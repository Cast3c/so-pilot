# Fase A: cimientos multi-red (diseño)

> Estado: **diseño para revisión**, 2026-10-13. No hay código nuevo todavía.
> Contexto: el dueño decidió construir la app completa y con seriedad de producto real (ver `docs/ROADMAP.md`, sección 8). Esta fase prepara el terreno para añadir redes sin parchear.

## 1. Alcance

- **Redes previstas (solo estas por ahora):** Threads (ya funciona), Instagram, Facebook, LinkedIn, YouTube y TikTok. Fuera de alcance: Pinterest, Discord, Slack y X.
- **Edición:** antes de publicar (lo borrador y lo programado). La edición de lo ya publicado depende de cada red y se verifica cuando se construya cada una.
- **Idea futura (no entra en la Fase A):** IA generativa para producir vídeo, un servidor MCP que exponga las acciones de la app a asistentes de IA, y "clipear" vídeos largos para publicarlos en YouTube. El diseño de la Fase A deja el espacio, pero no lo construye.

## 2. Qué falla hoy para soportar varias redes (verificado en el código)

| Problema | Dónde |
|---|---|
| Un post pertenece a **una** cuenta (`posts.social_account_id`) | `db/schema.ts`, `compose/actions.ts:71`, `dashboard/page.tsx:42`, `calendar/page.tsx:38` |
| La publicación llama directamente a Threads | `lib/publish.ts:34` |
| El límite de caracteres sale del archivo de Threads | `components/compose-form.tsx`, `compose/actions.ts:49` |
| El estado, el id externo y el error viven en `posts`, no por red | `lib/publish.ts`, `db/schema.ts` |
| El trabajo de la cola es **por post** (`post-<id>`) y el worker marca el post entero como fallido | `lib/queue.ts`, `worker/index.ts` |
| Todo error se reintenta tres veces, incluso los de autenticación o validación, que nunca se arreglan reintentando | `lib/queue.ts` |
| El borrado de datos asume un post por cuenta | `lib/account-data.ts:30` |
| Nadie renueva los tokens (Threads: ≈ 60 días) | n/a |
| No hay pruebas automáticas ni ejecutor de pruebas | `package.json` |

## 3. Modelo de datos nuevo

**Idea central:** un post es el *contenido y la hora*; cada red a la que va es un **destino** con su propio estado.

```
posts (contenido y programación)
  id, user_id, body, scheduled_at, created_at,
  status            ← agregado, derivado de los destinos

post_targets (un destino = un post en una cuenta concreta)       [NUEVA]
  id
  post_id           → posts.id            (on delete cascade)
  social_account_id → social_accounts.id  (on delete set null)
  provider          texto, copia de la red (sobrevive si se borra la cuenta)
  status            scheduled | publishing | published | failed | cancelled
  external_id       id del post en la red
  error             motivo del fallo
  published_at      cuándo salió
  created_at
  unique (post_id, social_account_id)

post_media: sin cambios en la Fase A (se comparte entre destinos)
```

**Regla del estado agregado del post** (función pura, con pruebas):

| Situación de los destinos (sin contar los cancelados) | Estado del post |
|---|---|
| No hay destinos | `draft` |
| Todos cancelados | `cancelled` |
| Alguno `publishing` | `publishing` |
| Alguno `scheduled` | `scheduled` |
| Todos `published` | `published` |
| Todos `failed` | `failed` |
| Mezcla de `published` y `failed` | `partial` |

## 4. Contrato de red

```ts
type ProviderId = "threads" | "instagram" | "facebook" | "linkedin" | "youtube" | "tiktok";

interface ProviderCapabilities {
  id: ProviderId;
  label: string;
  maxTextLength: number;
  media: {
    allowed: ("IMAGE" | "VIDEO")[];
    required: boolean;
    maxItems: number;
  };
}

interface SocialProvider {
  capabilities: ProviderCapabilities;
  publish(account: AccountCredentials, input: { text: string; media: Media[] }):
    Promise<{ externalId: string; permalink?: string }>;
  refreshToken?(account: AccountCredentials): Promise<TokenSet>;
}
```

Hay un **registro** (`getProvider(id)`) y las capacidades de cada red se rellenan **cuando se construye esa red, tras verificar su documentación vigente**. Hoy solo Threads está verificado: 500 caracteres, texto, imagen o vídeo, un archivo.

**Errores clasificados.** Todo adaptador lanza `ProviderError` con una de estas clases, y de eso depende lo que hace el worker:

| Clase | Ejemplo | Qué hace el worker |
|---|---|---|
| `auth` | token inválido o revocado | **No reintenta.** Cuenta → `revoked`, destino → `failed` con aviso de reconectar |
| `validation` | texto demasiado largo, medio no admitido | **No reintenta.** Destino → `failed` |
| `rate_limit` | cuota agotada | Reintenta con espera larga |
| `transient` | error 5xx o de red | Reintenta con espera creciente (3 intentos) |
| `unknown` | cualquier otro | Se trata como `transient` con tope |

## 5. Cola y worker

- **Un trabajo por destino:** `jobId = target-<id>`, datos `{ targetId }`. Los reintentos y los fallos son independientes por red.
- `publishTargetById(targetId)`: idempotente (si ya está `published`, no hace nada), carga cuenta y media, llama al proveedor, guarda `external_id` y estado.
- Tras cada destino se **recalcula el estado del post** con la función de agregación.
- **Cancelar un post** cancela sus destinos pendientes y quita sus trabajos de la cola. La base de datos manda sobre la cola, como hasta ahora.
- Los trabajos actuales (`post-<id>`) se vacían antes de migrar.

## 6. Migración sin perder datos

1. Crear `post_targets` (aditivo; no rompe nada).
2. **Rellenar**: por cada post con `social_account_id`, crear un destino copiando `provider`, estado, `external_id` y error.
3. Cambiar el código para leer y escribir en destinos.
4. **Más adelante**, y no en la Fase A, eliminar de `posts` las columnas `social_account_id`, `external_id` y `error`.
5. Actualizar `lib/account-data.ts`: al borrar una cuenta se borran **sus destinos**, y el post solo se elimina si se queda sin ninguno.

## 7. Compose

Selección múltiple de cuentas; límite y contador **por red**; validación con una función pura `validateForProvider` antes de guardar; resultado **por destino** ("salió en LinkedIn, falló en Instagram: reconecta"). El texto distinto por red queda para la Fase D.

## 8. Tokens

Tarea periódica (trabajo repetible de BullMQ, una vez al día): cuentas cuyo token vence en menos de 10 días → `refreshToken()`. Si falla por `auth` → cuenta `revoked` y aviso visible para reconectar. El mecanismo de renovación de cada red se verifica en su documentación al construirla; el de Threads se recuerda de memoria y **debe verificarse**.

## 9. Pruebas

- Ejecutor: **Vitest**, con el alias `@/` del proyecto.
- Primeras pruebas, todas de funciones puras: agregación de estado, validación por red, clasificación de errores, interpretación de la fecha programada.

## 10. Pasos de la fase (cada uno termina en algo que se ejecuta)

| Paso | Contenido | Está listo cuando |
|---|---|---|
| **A1** | Instalar Vitest y escribir `aggregatePostStatus` con sus pruebas | `npm test` pasa en verde |
| **A2** | Esquema `post_targets` y relleno desde los posts existentes | Cada post antiguo tiene su destino en Neon |
| **A3** | Contrato de red, `ProviderError`, registro; Threads como primer adaptador | La publicación actual funciona igual, pasando por el contrato |
| **A4** | Publicación por destino: cola, worker, cancelación y estado agregado | Publicar y programar siguen funcionando; un fallo no tumba al post entero |
| **A5** | Compose con varias cuentas, validación por red y resultado por destino | Se puede enviar el mismo post a dos cuentas (aunque sean de la misma red) |
| **A6** | Listado, calendario y tarjetas con destinos | Se ve el estado por red |
| **A7** | Renovación de tokens, estado `revoked` y aviso de reconexión | Una cuenta con token caducado se marca y se puede reconectar |

## 11. Archivos que cambian

`db/schema.ts`, `lib/publish.ts`, `lib/queue.ts`, `lib/account-data.ts`, `lib/providers/threads.ts`, `worker/index.ts`, `app/(app)/compose/actions.ts`, `app/(app)/dashboard/actions.ts`, `app/(app)/dashboard/page.tsx`, `app/(app)/calendar/page.tsx`, `components/compose-form.tsx`, `components/post-card.tsx`, `package.json`. Nuevos: `lib/post-status.ts`, `lib/providers/index.ts`, `lib/providers/types.ts`, `vitest.config.ts`.

## 12. Decisiones abiertas

| Decisión | Propuesta |
|---|---|
| ¿Eliminar ya las columnas antiguas de `posts`? | No: hacerlo en una fase posterior, cuando todo lea de `post_targets` |
| ¿Texto distinto por red? | No en la Fase A: es de la Fase D |
| ¿Un trabajo por destino o por post? | Por destino |
| ¿Cola o cron para el worker? | Seguir con BullMQ. Alojarlo fuera del PC sigue siendo un tema de infraestructura aparte |

# So-Pilot (Social Copilot)

> Documento vivo. Léelo de arriba abajo para entender **qué es** el proyecto, **cómo está construido**, **en qué etapa estamos** y **qué sigue**.
> Última actualización: 2026-10-08.

---

## 1. Qué es

So-Pilot es una aplicación web para **escribir una vez, programar y publicar en varias redes sociales**, y **responder comentarios automáticamente**.

- **Problema que resuelve:** quien maneja redes sociales pierde tiempo publicando lo mismo en cada plataforma, a mano y a deshoras.
- **Usuario hoy:** una sola persona (el autor), para uso propio y como proyecto de aprendizaje.
- **Meta:** convertirlo en un **SaaS** con planes Free y Premium.
- **Restricción actual:** costo cero. Todo corre en planes gratuitos o en la máquina local.

### Qué hace hoy (resumen)
1. Inicio de sesión y registro de usuarios.
2. Conectar una cuenta de **Threads** por OAuth (el token se guarda cifrado).
3. Escribir un post con texto, imagen o vídeo y **publicarlo ahora** en Threads.
4. **Programar** el post para una fecha y hora: un proceso aparte lo publica a su hora.
5. Ver todos los posts con su **estado**, filtrarlos y ver cómo se actualizan solos.
6. Ver los posts en un **calendario mensual**, ubicados según la hora local del usuario.

---

## 2. Estado del proyecto (dónde estamos)

Leyenda: ✅ hecho · 🟡 parcial · ⏳ pendiente

| Fase | Contenido | Estado |
|---|---|---|
| 0. Cimientos | Clerk, `proxy.ts`, Neon + Drizzle, layout con barra lateral | ✅ |
| 1. Landing | Página pública: hero, funciones, cómo funciona, precios, FAQ, llamada a la acción | ✅ |
| 2. Billing | Planes Free/Premium definidos en código (`lib/plans.ts`), **sin cobro real** | 🟡 |
| 3. Cuentas conectadas | OAuth con **Threads** ✅. Instagram y YouTube ⏳. Renovación de tokens ⏳ | 🟡 |
| 4. Composer y media | Texto, imagen y vídeo (un archivo por post) para Threads | 🟡 |
| 5. Programación | Cola BullMQ + Redis + worker, reintentos, estados | ✅ (solo local) |
| 6. Calendario | Vista de mes con los posts programados | ✅ |
| 7. Auto-respuestas | Responder comentarios por palabras clave | ⏳ |
| 8. Pulido | Inglés/Español, tema oscuro, estados vacíos y de error, accesibilidad | ⏳ |

### Qué sigue (en orden)
1. **Auto-respuestas** por palabras clave (Fase 7).
2. **Cancelar o editar** un post programado (hoy no se puede).
3. **Más redes:** Instagram, YouTube y LinkedIn (TikTok queda para después). Ver el orden sugerido en la sección 11, "Aprobaciones de plataformas".
4. **Internacionalización** (inglés y español con `next-intl`).
5. **Cobro real** con Clerk Billing cuando se decida monetizar.

Pendientes técnicos detallados: ver sección 11.

---

## 3. Funcionalidades

### Implementadas
| Funcionalidad | Dónde |
|---|---|
| Registro e inicio de sesión (email, Google) | Clerk |
| Landing pública con secciones y planes | `app/(marketing)/` |
| Panel con barra lateral (Posts, Compose, Calendar, Accounts, Automations) | `app/(app)/` |
| Conectar y desconectar una cuenta de Threads | `/accounts`, `app/api/oauth/threads/` |
| Subir imagen o vídeo (JPG, PNG, MP4, MOV; máx. 25 MB) con vista previa | `components/compose-form.tsx`, ImageKit |
| Publicar texto, imagen o vídeo en Threads (límite de 500 caracteres) | `lib/providers/threads.ts` |
| Programar una publicación (fecha y hora local convertida a UTC) | `/compose`, `lib/queue.ts` |
| Publicación automática a su hora con reintentos (3 intentos) | `worker/index.ts` |
| Listado de posts con cuenta, miniatura, estado, error y fecha | `/dashboard` |
| Filtro por estado y actualización automática de la lista | `components/auto-refresh.tsx` |
| Calendario mensual con los posts por día y hora local, estado por color y navegación entre meses | `/calendar`, `components/calendar-view.tsx` |

### Planificadas
- Detalle de un día del calendario (hoy el "+N more" no es clicable) y reprogramar arrastrando.
- Respuestas automáticas a comentarios (primero por palabras clave; el modo con IA queda apagado por costo).
- Publicar el mismo post en **varias redes a la vez** y previsualizar cómo se verá en cada una.
- Instagram y YouTube; más redes después.
- Varios archivos por post (carrusel).
- Planes Free y Premium con límites reales.
- Interfaz en inglés y español.

---

## 4. Plataformas y servicios externos

| Servicio | Para qué se usa | Plan / costo | Estado |
|---|---|---|---|
| **Clerk** | Autenticación y usuarios. Más adelante, suscripciones (Clerk Billing) | Gratuito, instancia de **desarrollo** | En uso |
| **Neon** (Postgres) | Base de datos. Se creó desde la integración de **Vercel** | Gratuito | En uso |
| **Vercel** | Hosting de la web (Next.js). Despliega al hacer push a `master` | Gratuito (Hobby) | En uso |
| **GitHub** | Repositorio del código | Gratuito | En uso |
| **ImageKit** | Almacenar imágenes y vídeos con URL pública (Threads descarga desde esa URL) | Gratuito | En uso |
| **Meta for Developers** | App con el caso de uso "API de Threads" | Gratuito, **modo desarrollo** | En uso |
| **Redis** (Docker) | Almacén de la cola de publicaciones | Local, gratuito | En uso (solo local) |
| **Anthropic API** | Respuestas con IA (futuro) | De pago | No usado |
| **Instagram / YouTube / TikTok / LinkedIn APIs** | Más redes | Gratuitas con límites y revisiones | No usadas |

---

## 5. Stack técnico

| Capa | Tecnología |
|---|---|
| Framework | **Next.js 16.3** (App Router, Turbopack) + **React 19.2** + TypeScript |
| Estilos y UI | **Tailwind CSS 4** + **shadcn/ui** (estilo `base-nova`, sobre **Base UI**) + lucide-react |
| Autenticación | **Clerk** (`@clerk/nextjs` 7) |
| Base de datos | **Neon** (Postgres) + **Drizzle ORM** 0.45 + `drizzle-kit` |
| Archivos | **ImageKit** (`@imagekit/next`) |
| Colas | **BullMQ** 6 + **ioredis** sobre **Redis 7** |
| Ejecución del worker | `tsx` |
| Gestor de paquetes | **npm** (solo `package-lock.json`) |
| Entorno | Node 24, Docker |

> **Importante sobre Next.js 16:** esta versión tiene cambios respecto a lo que se enseña en la mayoría de tutoriales. Por ejemplo, `middleware.ts` ahora se llama **`proxy.ts`**, y `searchParams` es una **promesa** (`await searchParams`). Ante la duda, consulta la documentación que viene en `node_modules/next/dist/docs/` (así lo indica `AGENTS.md`).

---

## 6. Arquitectura

### Vista general
```
                    ┌─────────────────────────────┐
   Navegador ─────► │  Next.js (Vercel / local)   │ ◄──── Clerk (sesión)
                    │  Páginas, Server Actions,   │
                    │  rutas de API               │
                    └──┬───────────┬──────────┬───┘
                       │           │          │
                       ▼           ▼          ▼
                  Neon (SQL)   ImageKit    Redis ◄──── Worker (proceso aparte)
                  posts,       archivos    cola de        │
                  cuentas,     públicos    publicación    ├─► Neon (lee y actualiza)
                  media                                    └─► API de Threads
```

La **web** y el **worker** son dos procesos distintos. La web nunca espera días: guarda el post en Neon, lo anota en la cola de Redis con el retraso necesario, y responde. El worker, siempre encendido, recoge el trabajo cuando llega su hora.

### Flujo 1: conectar una cuenta (OAuth)
1. `/accounts` → botón **Connect Threads** → `GET /api/oauth/threads/start`.
2. `start` crea un `state` aleatorio (cookie de 10 min) y redirige a Threads.
3. El usuario acepta; Threads devuelve a `GET /api/oauth/threads/callback?code=...&state=...`.
4. `callback` valida el `state`, cambia el `code` por un token corto, luego por uno largo (~60 días), pide el perfil y **guarda la cuenta con el token cifrado** (AES-256-GCM, `lib/crypto.ts`).

### Flujo 2: publicar ahora
1. `ComposeForm` → Server Action `publishPost` (`app/(app)/compose/actions.ts`).
2. Valida el texto, la cuenta (debe ser del usuario) y la media (solo URLs de nuestro ImageKit).
3. Inserta el post (`publishing`) y su media; llama a `publishPostById` (`lib/publish.ts`).
4. `publishPostById` descifra el token, crea el contenedor en Threads, espera a que procese la media, publica, y marca el post como `published` (o `failed` con el motivo).

### Flujo 3: programar
1. La misma Server Action, con `scheduledAt` (UTC) en vez de publicar.
2. Inserta el post como `scheduled` y encola un trabajo en BullMQ con `delay` y `jobId = post-<id>` (único). En la cola viaja **solo el id del post**, nada sensible.
3. El worker (`worker/index.ts`) toma el trabajo a su hora y llama a la **misma** `publishPostById`.
4. Si falla, BullMQ reintenta hasta 3 veces con espera creciente; solo tras el último fallo el post queda `failed`.

### Flujo 4: ver el estado
`/dashboard` consulta Neon (posts + cuenta + primera media). `AutoRefresh` vuelve a pedir la página cada 3 s si hay un post `publishing`, cada 15 s si solo hay `scheduled`, y no consulta si no hay nada pendiente.

### Flujo 5: calendario
1. La página `/calendar` (servidor) lee `?month=YYYY-MM` (validado; si es inválido usa el mes actual) y trae los posts de ese mes **con 7 días de margen** a cada lado.
2. La fecha de un post es `scheduled_at` si existe, y si no, `created_at`.
3. Pasa los posts al componente de cliente `CalendarView` como texto ISO.
4. `CalendarView` arma la cuadrícula (semana de lunes a domingo) y decide **en el navegador** en qué día cae cada post, con la zona horaria local. Hasta hidratar no pinta posts ni el día de hoy, para evitar diferencias entre servidor y navegador.

### Estados de un post
```
draft ─┐
       ├─► scheduled ──(llega la hora)──► publishing ──► published
       │                                       │
publishing (publicar ahora) ───────────────────┴──► failed
```

### Modelo de datos (`db/schema.ts`)
| Tabla | Campos principales |
|---|---|
| `posts` | `id`, `user_id`, `body`, `status`, `scheduled_at`, `social_account_id` (→ `social_accounts`, `set null`), `external_id` (id del post en la red), `error`, `created_at` |
| `social_accounts` | `id`, `user_id`, `provider`, `external_id`, `display_name`, `avatar_url`, `access_token` (**cifrado**), `refresh_token`, `expires_at`, `status`. Único por (`user_id`, `provider`, `external_id`) |
| `post_media` | `id`, `post_id` (→ `posts`, `cascade`), `url`, `file_id`, `type` (`IMAGE`/`VIDEO`), `position` |

`user_id` es el identificador del usuario en **Clerk** (texto); no hay tabla propia de usuarios.

### Rutas
| Ruta | Tipo | Función |
|---|---|---|
| `/` | Pública | Landing |
| `/dashboard` | Protegida | Listado de posts, filtros y refresco automático |
| `/compose` | Protegida | Crear, publicar o programar |
| `/accounts` | Protegida | Cuentas conectadas |
| `/calendar` | Protegida | Calendario mensual (`?month=YYYY-MM`) |
| `/automations` | Protegida | **Placeholder** (aún sin funcionalidad) |
| `/api/oauth/threads/start`, `/callback` | API | Flujo OAuth |
| `/api/imagekit-auth` | API | Firma temporal para subir archivos a ImageKit |

### Estructura de carpetas
```
app/(marketing)/      landing pública
app/(app)/            zona privada con barra lateral
app/api/              rutas de API (OAuth, ImageKit)
components/           componentes propios (landing/, post-card, compose-form…)
components/ui/        componentes de shadcn
db/                   conexión (index.ts) y esquema (schema.ts)
lib/                  crypto, plans, publish, queue
lib/providers/        un archivo por red social (hoy: threads.ts)
worker/               proceso que publica los posts programados
docs/                 documentación
proxy.ts              integración de Clerk
```

### Decisiones de seguridad
- **Autorización por recurso:** cada página, acción y ruta que toca datos llama a `auth.protect()` y filtra por `user_id`. No se confía solo en `proxy.ts`.
- **Tokens cifrados** en la base de datos (AES-256-GCM); la clave está en una variable de entorno.
- **`state` anti-CSRF** en el OAuth.
- La media se valida en el servidor (solo URLs del propio ImageKit, tipos permitidos).
- Las columnas sensibles (`access_token`) no se seleccionan en las páginas.

---

## 7. Requisitos

### Funcionales
- RF1. Un usuario puede registrarse, iniciar sesión y ver solo sus datos.
- RF2. Un usuario puede conectar y desconectar cuentas de redes sociales.
- RF3. Un usuario puede crear un post con texto y un archivo de imagen o vídeo.
- RF4. Un usuario puede publicar un post de inmediato o programarlo para una fecha futura.
- RF5. Un post programado se publica automáticamente a su hora, con reintentos si falla.
- RF6. Un usuario ve el estado de cada post y el motivo cuando falla.
- RF7. Un usuario ve sus posts programados en un calendario.
- RF8. *(Pendiente)* Un usuario define reglas de respuesta automática a comentarios.
- RF9. *(Pendiente)* Un usuario publica el mismo post en varias redes a la vez.

### No funcionales
- **Costo cero** en esta etapa (planes gratuitos o local).
- **Seguridad:** tokens cifrados, autorización en cada punto de acceso a datos.
- **Fiabilidad:** la publicación es idempotente (un post ya publicado no se vuelve a publicar) y los fallos se reintentan.
- **Zona horaria:** las fechas se guardan en **UTC**; la conversión desde la hora local se hace en el navegador.
- **Idiomas:** inglés y español *(pendiente)*.

---

## 8. Cómo ejecutarlo en local

**Requisitos previos:** Node 24, npm, Docker, y cuentas en Clerk, Neon (vía Vercel), ImageKit y Meta for Developers.

1. **Instalar dependencias:** `npm install`
2. **Variables de entorno:** crear `.env.local` (ver sección 9).
3. **Crear las tablas:** `npx drizzle-kit push`
4. **Levantar Redis** (una sola vez; después arranca solo con Docker):
   ```
   docker run -d --name so-pilot-redis -p 6379:6379 -v so-pilot-redis:/data --restart unless-stopped redis:7-alpine redis-server --appendonly yes --maxmemory-policy noeviction
   ```
5. **Web con HTTPS** (Meta exige HTTPS para el retorno de OAuth): `npm run dev:https` → `https://localhost:3000`
6. **Worker**, en otra terminal: `npm run worker`

> Si el worker no está encendido, los posts programados **no se pierden**: quedan en Redis y se publican cuando se vuelva a arrancar.

---

## 9. Variables de entorno

Solo nombres; **nunca** subir los valores al repositorio (`.env*` está en `.gitignore`).

| Variable | Tipo en Vercel | Uso |
|---|---|---|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Config | Clerk (pública) |
| `CLERK_SECRET_KEY` | **Secret** | Clerk |
| `DATABASE_URL` | Integración Neon | Conexión de la app a Neon (con *pooling*) |
| `DATABASE_URL_UNPOOLED` | Integración Neon | Conexión directa, la usa `drizzle-kit` |
| `THREADS_APP_ID` | Config | Credencial de Threads (de la app de **Threads**, no la general de Meta) |
| `THREADS_APP_SECRET` | **Secret** | Credencial de Threads |
| `NEXT_PUBLIC_APP_URL` | Config | URL base de la app (`https://localhost:3000` en local). Se usa para el `redirect_uri` de OAuth |
| `TOKEN_ENCRYPTION_KEY` | **Secret** | Clave de 32 bytes en base64 para cifrar tokens. **Si se pierde, los tokens guardados quedan ilegibles** |
| `NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY` | Config | ImageKit |
| `NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT` | Config | ImageKit |
| `IMAGEKIT_PRIVATE_KEY` | **Secret** | ImageKit (firma de subidas) |
| `REDIS_URL` | **Secret** (en producción) | Conexión a Redis |

Las variables que empiezan por `NEXT_PUBLIC_` se **incrustan al compilar**: deben estar guardadas antes de desplegar, y si cambian hay que redesplegar.

---

## 10. Despliegue

- **Web:** Vercel. La rama de producción es **`master`** (debe coincidir con *Settings → Git/Environments* en Vercel). Cada push a `master` despliega.
- **Base de datos:** Neon, compartida entre local y producción (mismo usuario de Clerk, mismos datos).
- **Redis y worker:** hoy **solo existen en la máquina local**. Consecuencia: desde la app desplegada, **programar falla** con el mensaje "Scheduling is not available right now", y publicar al momento sí funciona.
- **Para producción real** hacen falta un Redis accesible desde internet y un servicio donde el worker corra de forma continua. Vercel no sirve para el worker, porque sus funciones se apagan solas.

---

## 11. Pendientes técnicos y deuda

### Funcionalidad
- [ ] Cancelar o editar un post programado (hoy no hay forma desde la interfaz).
- [ ] Reintentar manualmente un post `failed`.
- [ ] Publicar en varias cuentas a la vez y vista previa por red.
- [ ] Varios archivos por post.
- [ ] Página de `automations`.
- [ ] Calendario: detalle de un día (el "+N more" no es clicable), crear un post desde un día y reprogramar arrastrando.

### Fiabilidad y escala
- [ ] **Renovar el token de Threads** antes de que expire (~60 días). Hoy nadie lo renueva.
- [ ] Desplegar Redis y el worker fuera de la máquina local.
- [ ] Reemplazar el sondeo de la lista por eventos (SSE + Redis pub/sub). El sondeo actual consulta la base de datos cada 3 o 15 s por pestaña, y no escala a miles de usuarios. Primer paso barato: sondear solo cerca de la hora programada.
- [ ] Vídeos largos: la espera de procesamiento está limitada a 60 s (20 consultas cada 3 s).
- [ ] Hueco conocido: si Redis responde justo después del límite de 5 s al encolar, el trabajo podría encolarse aunque el post se haya marcado `failed`.
- [ ] Si se desconecta una cuenta con posts programados, esos posts fallarán tras agotar los reintentos (conviene cancelarlos antes).

### Producto y negocio
- [ ] Cobro real con Clerk Billing y límites por plan (`getPlan()`).
- [ ] Instancia de **producción** de Clerk (requiere dominio propio).
- [ ] Aprobaciones de las plataformas para que otros usuarios (no solo testers) puedan conectar su cuenta. Ver la lista detallada en "Aprobaciones de plataformas", más abajo.
- [ ] `next-intl` (inglés y español) y selector de tema claro/oscuro.

### Aprobaciones de plataformas (checklist)

> **Aviso:** esta lista se escribió de memoria sobre la documentación de cada plataforma. Los requisitos cambian con frecuencia: **verifícalos en la documentación oficial antes de empezar cada trámite.**

**Hoy, ninguna red está abierta al público.** Cada una funciona solo con cuentas de prueba o con rol en la app. Abrir la app a cualquier usuario exige aprobaciones de terceros que no dependen del código y pueden tardar. Conviene empezar pronto.

#### Requisitos comunes (se hacen una vez y sirven para todas)
- [ ] **Dominio propio** con HTTPS (no `vercel.app`).
- [ ] **Política de privacidad** y **términos del servicio** públicos y reales: qué datos se guardan, que los tokens se almacenan cifrados, y cómo se borran.
- [ ] **Endpoint de borrado de datos** y de **desinstalación** que funcionen de verdad (hoy las URLs de Meta apuntan a la landing). Al recibirlos, hay que eliminar los tokens y datos del usuario.
- [ ] **Verificación del negocio** o de la persona jurídica (varias plataformas la exigen).
- [ ] **Vídeos de demostración** de cada permiso y una **cuenta de prueba** para los revisores.
- [ ] Nombre, icono, descripción, categoría y correo de soporte de la app.
- [ ] Instancia de **producción** de Clerk, con el dominio propio.

#### Por plataforma
| Plataforma | Estado hoy | Qué se necesita para abrirla a cualquier usuario |
|---|---|---|
| **Meta: Threads** | Modo desarrollo; solo cuentas con rol en la app (Threads Tester) | Pasar la app a **Live** con **App Review** de cada permiso usado (`threads_basic`, `threads_content_publish`, `threads_manage_replies`, `threads_read_replies`). Exige **verificación de negocio** y ser *proveedor de tecnología*, política de privacidad, URL de borrado de datos y *screencasts*. La revisión puede tardar de días a semanas y admite rechazos |
| **Meta: Instagram** | No implementado. Misma app de Meta | Cuenta **Business o Creator** vinculada a una página de Facebook. Permisos de publicación y de comentarios (por ejemplo `instagram_content_publish` e `instagram_manage_comments`), con la misma revisión que Threads |
| **Google: YouTube** | No implementado | Pantalla de consentimiento de OAuth y **verificación de la app** por usar *scopes* sensibles (subir vídeos, gestionar comentarios). Mientras no esté verificada: modo *Testing*, con **usuarios de prueba limitados**, tokens de refresco que **caducan a los 7 días**, y las subidas por API de proyectos sin verificar quedan **privadas** hasta pasar una auditoría. La cuota diaria es limitada y subir un vídeo consume mucha |
| **TikTok** | No implementado | Registrar la app y solicitar *Content Posting API*. Sin **auditoría**, solo se puede publicar en **privado**. TikTok también exige cumplir sus directrices de interfaz (mostrar vista previa, opciones de privacidad y consentimiento del usuario) |
| **LinkedIn** | No implementado | La app debe asociarse a una **página de empresa** de LinkedIn. **Publicar como persona** (*Share on LinkedIn*, permiso `w_member_social`) y **iniciar sesión con LinkedIn (OpenID Connect)** son productos de acceso **inmediato**, sin revisión. **Publicar como página de empresa** y **leer o responder comentarios** (necesario para las auto-respuestas) requieren la **Community Management API**, que se solicita y se aprueba, y suele pedir una organización legal verificada. Los tokens duran unos 60 días y la renovación puede exigir que el usuario vuelva a autorizar. La API de contenido va versionada (cabecera `LinkedIn-Version`) y la media se sube con sus APIs de imágenes y vídeos |

#### Orden sugerido para añadir redes
1. **LinkedIn** (publicar como persona): es la de menor barrera, porque puede funcionar para cualquier usuario sin revisión.
2. **Instagram**: reutiliza la app de Meta y el trabajo de Threads, y entra en la misma revisión.
3. **YouTube**: se puede construir ya con usuarios de prueba; el trámite de verificación pesa más.
4. **TikTok**: la última, por la auditoría y las exigencias de interfaz.

Para las **auto-respuestas** (Fase 7) el factor decisivo es qué redes permiten leer y responder comentarios sin trámites extra: en LinkedIn eso requiere la Community Management API, y en Meta, los permisos de comentarios aprobados.

### Calidad
- [ ] No hay pruebas automáticas.
- [ ] El script `dev` de `package.json` fue sustituido por `dev:https`; conviene restaurar `dev`.
- [ ] Un error de ESLint heredado en `components/ui/carousel.tsx` (componente de shadcn sin uso).

---

## 12. Decisiones tomadas y por qué

| Decisión | Motivo |
|---|---|
| Clerk en modo **Consumer** (no B2B) | Cada usuario es individual; los datos se filtran por `user_id`, sin organizaciones |
| **Threads primero** | Con Instagram comparte app de Meta. En modo desarrollo permite publicar y responder comentarios en la cuenta propia sin revisión. TikTok solo permite publicar en privado sin auditoría |
| **Sin Stripe ni Clerk Billing** de momento | Costo cero; los planes viven en `lib/plans.ts` y el usuario es siempre Premium |
| **Auto-respuestas solo por palabras clave** | El modo con IA requiere crédito de pago en la API de Anthropic |
| **BullMQ + Redis** (y no consultar la base de datos cada minuto) | Es un SaaS: se necesitan reintentos, trabajos con retraso y escalar con más workers. Alternativa descartada: sondeo a Neon, más simple pero menos escalable |
| **ImageKit** para archivos | Estaba en el stack inicial; ofrece URL pública (Threads la descarga), subida directa desde el navegador y plan gratuito |
| Autorización **por recurso**, no solo en `proxy.ts` | Clerk marcó `createRouteMatcher` como obsoleto: comprobar rutas por patrón puede divergir de cómo Next enruta |
| Subida de archivos **directa a ImageKit** | Evita el límite de tamaño de las funciones de Vercel |
| Un solo `publishPostById` compartido | La web (publicar ahora) y el worker (programado) usan exactamente la misma lógica |
| Se guarda el post **antes** de publicar | Así queda registro aunque el proceso se corte a mitad |
| El calendario agrupa los posts por día **en el navegador** | El servidor (Vercel) va en UTC y no conoce la zona del usuario: un post de las 22:00 locales caería en el día siguiente |

---

## 13. Lecciones y trampas conocidas

- **Meta/Threads (modo desarrollo):** solo funcionan las cuentas añadidas como *Threads Tester* y que **aceptaron la invitación** (en Threads, no en Facebook). El `Threads App ID/Secret` es distinto del de la app general de Meta.
- **`redirect_uri`:** debe coincidir **carácter por carácter** con lo registrado en Meta y ser HTTPS. Una errata en `NEXT_PUBLIC_APP_URL` rompe el login.
- **Dominios de la API de Threads:** la API de datos es `graph.threads.net`. La autorización de usuario usa `threads.net/oauth/authorize`. Usar el dominio equivocado devuelve HTML 404.
- **Nombres de archivo en ImageKit:** nombres largos con emojis o símbolos hacían que Threads no pudiera descargar la imagen (error `2207052`). El formulario limpia el nombre antes de subir.
- **ImageKit** puede servir WebP según la cabecera `Accept`, y Threads solo acepta JPEG/PNG.
- **Claves copiadas con un carácter de más** (comillas, espacios, saltos de línea) provocaron varios fallos de autenticación. Revisar siempre los valores pegados.
- **Vercel:** al renombrar la rama principal a `master` hay que actualizar la *Production Branch*. Un **Redeploy** reconstruye el mismo commit, no trae código nuevo.
- **Dos gestores de paquetes:** tener `pnpm-lock.yaml` junto a `package-lock.json` hizo que Vercel usara pnpm y fallara. El proyecto usa **solo npm**.
- **Zonas horarias:** `datetime-local` no incluye zona; se convierte a UTC en el navegador antes de enviarlo.
- **Hidratación:** todo lo que dependa de la hora local (calendario, "hoy") no debe pintarse en el servidor, porque el HTML difiere del del navegador y React avisa de un *hydration mismatch*. Se resuelve con `useSyncExternalStore` (ver `useHydrated` en `calendar-view.tsx`); las reglas de ESLint del proyecto marcan como error el `setState` dentro de un `useEffect`.
- **Scroll suave:** si el `<html>` usa `scroll-smooth`, Next 16 exige además `data-scroll-behavior="smooth"`; si no, avisa en la consola.

---

## 14. Cómo mantener este documento

Actualiza este archivo cuando cambie alguno de estos puntos:
- Termina o empieza una fase (sección 2) → cambia el estado y el "Qué sigue".
- Se añade o cambia una tabla, ruta o variable de entorno (secciones 6 y 9).
- Se toma una decisión de arquitectura (sección 12).
- Aparece una trampa nueva que costó tiempo (sección 13).

Para el detalle técnico original del plan, ver [`docs/plans/social-copilot.md`](plans/social-copilot.md), que queda como referencia histórica.

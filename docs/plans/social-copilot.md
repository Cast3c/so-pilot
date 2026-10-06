# Plan: Social Copilot

> **Referencia histórica.** Este fue el plan inicial. El estado actual, la arquitectura vigente y lo que sigue están en [`../PROJECT.md`](../PROJECT.md).

Estado: BORRADOR para revisión. No se ha escrito código de la app.

## 1. Punto de partida (repo actual)
- Next.js 16.3.6, React 19.2, Tailwind 4, shadcn (`base-nova`, sobre `@base-ui/react`) con ~60 componentes ya en `components/ui/` (calendar, dialog, sheet, chart, etc.).
- `app/` solo tiene `layout.tsx` y `page.tsx`. No hay auth, DB, colas ni rutas de API.
- Next 16: `middleware.ts` está deprecado y ahora se llama **`proxy.ts`** (ver `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md`). Clerk debe integrarse con `proxy.ts`. Verificar en la doc de Clerk que su versión soporta Next 16.

## 2. Stack (tal como se pidió) y ajustes recomendados
| Necesidad | Elección | Nota |
|---|---|---|
| Framework | Next.js App Router + TS | Server Components por defecto |
| UI | shadcn | ya instalado |
| Auth | Clerk | |
| Suscripción | Clerk Billing | Requiere Stripe conectado a Clerk. Planes Free y Premium; se lee con `has({ plan })` |
| DB | Neon + Drizzle | |
| Archivos | ImageKit | subida desde cliente con auth endpoint firmado |
| Jobs | BullMQ + Redis | **Necesita Redis y un worker de larga vida. No corre en Vercel serverless** (ver riesgos) |
| IA | Anthropic API (SDK `@anthropic-ai/sdk`) | "Claude Code" es una herramienta de CLI; para la app se usa la API. Modelo `claude-sonnet-5-5` para respuestas y `claude-haiku-4-5-20251001` para clasificación barata |

## 3. Arquitectura

```
Browser ── Next.js (App Router) ── Clerk (auth + billing)
              │  Server Actions / Route Handlers
              ├── Neon (Drizzle)
              ├── ImageKit (media)
              └── Redis ── BullMQ queues ──► Worker (proceso Node aparte)
                                               ├── publish-post  → APIs sociales
                                               ├── poll-comments → APIs sociales
                                               └── auto-reply    → Claude API
```

### Estructura de carpetas
```
app/
  (marketing)/page.tsx            landing
  (marketing)/pricing/page.tsx
  (app)/dashboard/page.tsx
  (app)/compose/page.tsx
  (app)/calendar/page.tsx
  (app)/accounts/page.tsx
  (app)/automations/page.tsx
  (app)/billing/page.tsx
  api/oauth/[provider]/start|callback/route.ts
  api/webhooks/[provider]/route.ts
  api/imagekit-auth/route.ts
proxy.ts                          Clerk: proteger (app)
db/schema.ts, db/index.ts, drizzle.config.ts
lib/providers/<red>.ts            un adaptador por red (interfaz común)
lib/queue/*.ts                    definición de colas
lib/ai/*.ts
worker/index.ts                   entrada del worker BullMQ
```

### Modelo de datos (Drizzle)
- `social_accounts`: id, user_id, provider, external_id, display_name, avatar, access_token_enc, refresh_token_enc, expires_at, scopes, status.
- `posts`: id, user_id, body, status (`draft|scheduled|publishing|published|partial|failed`), scheduled_at, timezone.
- `post_media`: post_id, imagekit_file_id, url, type, order.
- `post_targets`: post_id, social_account_id, status, external_post_id, error, published_at, per-network overrides (texto, hashtags).
- `automations`: id, user_id, social_account_id, scope (`account|post`), post_target_id nullable, mode (`keyword|ai`), keywords[], match_type, reply_template, ai_instructions, enabled.
- `comments`: id, social_account_id, external_id, post_target_id, author, body, replied_at, automation_id.
- Tokens cifrados en reposo (AES-GCM con clave en env), nunca en el cliente.
- Límites de plan (nº de cuentas, posts/mes, respuestas IA/mes) contados desde DB.

## 4. Contrato de proveedor
```ts
interface SocialProvider {
  id: 'instagram'|'youtube'|'tiktok'|'facebook'|'linkedin'|'pinterest'|'discord'|'threads'|'slack'
  getAuthUrl(state): string
  exchangeCode(code): Promise<Tokens>
  refresh(account): Promise<Tokens>
  publish(account, payload): Promise<{ externalId: string }>
  listComments?(account, target): Promise<Comment[]>
  reply?(account, comment, text): Promise<void>
  constraints: { maxChars, media: {...}, supportsText: boolean }
}
```
La UI de composición usa `constraints` para validar por red (límite de caracteres, tipo de media obligatorio, etc.).

## 5. Fases (cada una entregable y probable)

**Fase 0. Cimientos.** Clerk + `proxy.ts`, Neon + Drizzle + migraciones, layout de app (sidebar, topbar), tema.
**Fase 1. Landing y pricing.** Hero, features, cómo funciona, planes, FAQ, CTA. Página `/pricing` con `<PricingTable />` de Clerk.
**Fase 2. Billing.** Planes Free y Premium en Clerk, gating por `has()`, página `/billing`, componente `<UpgradeGate />`.
**Fase 3. Cuentas conectadas.** OAuth genérico + adaptadores. Empezar con **2 redes** (recomendado: LinkedIn y Facebook/Threads o Discord, las de acceso más fácil) y luego añadir el resto.
**Fase 4. Composer + media.** Editor, selector multi-red, previews por red, subida a ImageKit, borrador guardado.
**Fase 5. Programación y publicación.** Cola BullMQ con jobs retrasados, worker, reintentos con backoff, estados por target, publicación parcial.
**Fase 6. Calendario.** Vista mes/semana con `calendar` de shadcn o grid propio, posts por color de red, arrastrar para reprogramar, detalle en `sheet`.
**Fase 7. Auto-respuestas.** Ingesta de comentarios (webhook donde exista, polling si no), motor de reglas por keywords, modo IA con Claude, límites por plan, log de respuestas, botón de pausa.
**Fase 8. Pulido.** Estados vacíos, errores, skeletons, responsive, accesibilidad, analytics básicos (`recharts`).

## 6. Riesgos y decisiones abiertas (revisar antes de implementar)
1. **Acceso a las APIs de las redes es el mayor riesgo.** Instagram, Facebook, Threads, TikTok, LinkedIn y Pinterest exigen crear una app de desarrollador y pasar **revisión** para publicar en cuentas de terceros; puede tardar semanas. YouTube exige verificación de la app de Google. Discord y Slack son más simples (webhook/bot). Sin aprobación, solo funcionan con cuentas de prueba/propias.
2. **Auto-respuesta a comentarios:** no todas las redes exponen comentarios por API (o solo con permisos restringidos). Se implementará solo donde exista; el resto se marca "no disponible".
3. **BullMQ + hosting:** necesita Redis persistente y un proceso worker siempre activo. Con Vercel, el worker va aparte (Railway, Fly.io, VPS) y Redis en Upstash/Redis Cloud. Alternativa más simple si no se quiere infra extra: Vercel Cron + tabla `jobs` en Neon (se pierde BullMQ). **Decidir.**
4. **Clerk Billing** cobra comisión adicional sobre Stripe y tiene limitaciones de pruebas/impuestos. Confirmar que sirve para el modelo de precios.
5. **Costos de IA:** las respuestas automáticas consumen tokens por comentario; poner tope mensual por plan.
6. **Seguridad:** cifrado de tokens, verificación de firma de webhooks, `state` anti-CSRF en OAuth, rate limiting por usuario.
7. **Zonas horarias:** guardar `scheduled_at` en UTC y la zona del usuario aparte.

## 7. Decisiones (2026-09-28)
- **Modo de trabajo: aprendizaje.** El dueño escribe el código; Claude guía paso a paso, explica el porqué y revisa. Cada paso termina con algo que se puede ejecutar y comprobar.
- **Redes MVP:** Instagram, Threads y YouTube. TikTok queda para después (una app sin auditar solo publica en privado). Uso personal: las apps funcionan en modo desarrollo sin revisión.
  - YouTube: una app sin verificar solo sube videos en privado; cuota ~6 subidas/día.
  - Instagram requiere cuenta Business o Creator.
- **Costo cero:**
  - Clerk, Neon e ImageKit en plan gratuito.
  - Sin Clerk Billing ni Stripe por ahora: capa `getPlan()` + config de límites en código; el usuario es siempre Premium. Se sustituye por Clerk Billing más adelante.
  - Auto-respuestas solo por palabras clave; el modo IA queda apagado (la API de Anthropic es de pago).
  - Redis local con Docker y worker en la PC. Los posts programados solo salen con la PC encendida. Migrar después a Oracle Cloud o Fly.
  - Desarrollo en localhost; para OAuth de Meta probablemente haga falta HTTPS (Vercel gratis o túnel de Cloudflare).
- **Idiomas:** inglés y español con `next-intl`.
- **Pendiente:** definir precios y límites reales de Free vs. Premium cuando se decida cobrar.

## 8. Verificación
- Por fase: `npm run lint`, `npm run build` y prueba manual del flujo.
- Fase 5+: test del worker con una red de prueba y verificación de reintentos.
- Al terminar cada fase, `qa` y `/code-review` contrastan el resultado contra este documento.

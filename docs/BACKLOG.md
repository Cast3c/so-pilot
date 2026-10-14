# So-Pilot: backlog consolidado

> **Fuente única de "qué sigue".** Reemplaza el orden de "Qué sigue" de `PROJECT.md` y el backlog de `ROADMAP.md` (sección 8) para la ejecución. Los otros documentos conservan el contexto y las decisiones.
> Enfoque vigente: **aprovechamiento personal**, con seriedad de producto real. Sin cobro por ahora.
> Última actualización: 2026-10-13.

Leyenda: ✅ hecho · 🟡 parcial · ⏳ pendiente · ⏸ en pausa

---

## Orden de ejecución

1. **H1** Cimientos multi-red (fase A). En curso.
2. **H5** Calidad, en paralelo: pruebas y CI se añaden junto a cada hito, no al final.
3. **H2** Redes, una por una.
4. **H3** Métricas y vista general.
5. **H4** Edición y contenido avanzado.

## Hitos

### H1. Cimientos multi-red (fase A)
**Criterio de terminado:** un mismo post sale a dos cuentas y cada destino muestra su propio resultado; un token revocado marca la cuenta y no consume reintentos.

| Tarea | Estado | Nota |
|---|---|---|
| A1. Vitest y función `aggregatePostStatus` con pruebas | ✅ | 9 pruebas en verde |
| A2. Tabla `post_targets` y migración de datos | ✅ | 17 destinos, idempotente, verificado |
| A3. Contrato de red y errores clasificados; Threads como primer adaptador | ✅ | Cerrada 2026-10-14: publicación de texto e imagen verificada desde Compose; `posts` y `post_targets` en `published` |
| A4. Publicación por destino: cola, worker, cancelación y estado agregado | ⏳ | |
| A5. Compose con varias cuentas y resultado por destino | ⏳ | |
| A6. Listado, calendario y tarjetas con destinos | ⏳ | |
| A7. Renovación de tokens y estado `revoked` con aviso de reconexión | ⏳ | El token de Threads dura ≈ 60 días |

Diseño completo: `docs/plans/phase-a-multi-network.md`.

### H2. Redes y conexión de cuentas
**Criterio de terminado:** cada red conecta, publica texto y media con formato correcto para esa red, y responde comentarios donde la API lo permita.

| Red / tarea | Estado | Nota |
|---|---|---|
| Threads (conectar, publicar, programar) | ✅ | Base de referencia |
| Instagram | ⏳ | Requiere cuenta Business o Creator; verificar documentación vigente |
| Facebook | ⏳ | |
| LinkedIn (publicar como persona) | ⏳ | Verificar si la publicación como persona no requiere revisión |
| YouTube | ⏳ | Subidas en privado mientras no esté verificada; verificar |
| TikTok | ⏳ | Verificar si se puede publicar en uso personal sin auditoría |
| Transformación de media por red (recorte y formato con ImageKit) | ⏳ | Cada red pide proporción y formato distintos |
| Auto-respuestas por palabras clave, por red | ⏳ | Antes solo en Threads; con el contrato de A3, cada red declara si lo permite |

### H3. Métricas y vista general
**Criterio de terminado:** se ven cifras por post y por cuenta a lo largo del tiempo, y la portada resume la semana.

| Tarea | Estado |
|---|---|
| Snapshots periódicos de métricas por post y cuenta (con BullMQ) | ⏳ |
| Gráficos de evolución (`recharts`, ya instalado) | ⏳ |
| Vista general en el inicio: publicaciones de la semana, mejor post, próximas salidas | ⏳ |
| Ver todas las publicaciones de la cuenta, no solo las de So-Pilot | ⏳ |

### H4. Edición y contenido
**Criterio de terminado:** un post programado se puede editar y reprogramar, y el texto puede adaptarse por red.

| Tarea | Estado |
|---|---|
| Editar y reprogramar un post antes de publicar | ⏳ |
| Texto distinto por red desde un mismo borrador | ⏳ |
| Duplicar un post | ⏳ |
| Generación de vídeo con IA o servidor MCP | ⏳ | Idea futura; sin diseño todavía |
| Clips de vídeos largos para YouTube | ⏳ | Idea futura; sin diseño todavía |

### H5. Calidad de producto (transversal)
**Criterio de terminado:** el producto se ve y se comporta como uno real, y alguien puede entenderlo y reproducirlo desde el repositorio.

| Tarea | Estado | Nota |
|---|---|---|
| Pruebas automáticas del núcleo | 🟡 | Solo la función de estado; faltan publicación, fechas y zonas horarias |
| CI: lint, tipos, pruebas y build en cada cambio | ⏳ | |
| Diseño visual: pulido, tema oscuro, responsive | ⏳ | Del video, punto 9 |
| Página de ajustes: zona horaria, cuentas, borrado de datos | ⏳ | Del video, punto 14 |
| Registros y manejo de errores visibles | ⏳ | |
| Worker y Redis fuera del PC | ⏳ | Hoy solo funcionan en local |
| README con capturas y demo en vídeo | ⏳ | Para el portafolio |
| Deuda técnica de `PROJECT.md`, sección 11 | ⏳ | |

---

## En pausa (no descartado)

| Ítem | Motivo |
|---|---|
| Suscripciones y cobro (Clerk Billing, planes) | Sin objetivo de ingresos por ahora. Del video, punto 12 |
| Revisión de la app de Meta, verificación de negocio, dominio propio | Solo hacen falta para abrirla a terceros |
| Instancia de producción de Clerk | Solo importa con usuarios externos |
| Landing de precios y FAQ comercial | Se reduce a una página honesta de portafolio |

## Historial de cumplimiento frente al video de referencia

| Punto del video | Estado | Dónde |
|---|---|---|
| 1. Project setup | ✅ | Base del repositorio |
| 2. Auth y base de datos | ✅ | Clerk, Neon, Drizzle |
| 3. Layout del dashboard | ✅ | Barra lateral |
| 4. Landing | 🟡 | Existe, pero promete funciones que aún no están (se ajusta en H5) |
| 5. Conectar redes | 🟡 | Solo Threads (H2) |
| 6. Crear y componer post | ✅ | Para Threads; multi-red en A5 |
| 7. Programar post | ✅ | Con cola y worker local |
| 8. Calendario y lista | ✅ | |
| 9. Actualizar diseño | ⏳ | H5 |
| 10. Transformación de media | ⏳ | H2 |
| 11. Auto-respuestas | ⏳ | H2 |
| 12. Suscripciones | ⏸ | En pausa |
| 13. Actualizar dashboard | ⏳ | H3 |
| 14. Página de ajustes | ⏳ | H5 |
| 15. Vista general | ⏳ | H3 |
| 16. Conectar YouTube | ⏳ | H2 |
| 17. Desplegar | 🟡 | La web sí; el worker y Redis no |

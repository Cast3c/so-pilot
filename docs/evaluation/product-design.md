# So-Pilot: diseño de producto desde la deseabilidad (2026-10-12)

> **Origen:** informe del agente `product-designer`, entregado en la conversación y guardado aquí a petición del dueño. El contenido es el del agente, sin editar salvo este encabezado.
> **Cautela:** no hay entrevistas con usuarios. Todo lo que dice de la persona y de la deseabilidad es **hipótesis**. Su evaluación de diferenciación se apoya en una búsqueda web propia y rápida, más débil que una investigación de mercado completa; ver `market-research.md` y `validation-skeptic.md`.

**Contexto usado por el agente:** `docs/PROJECT.md`, `docs/ROADMAP.md`, `lib/plans.ts`, `app/(marketing)/page.tsx`, `components/landing/*`, `app/(app)/compose/page.tsx`, `app/(app)/dashboard/page.tsx`.

---

## 1. Persona principal y trabajos que contrata

### Problema de partida
"Personas a las que les cuesta manejar sus redes" describe un **estado**, no un segmento. Cubre desde el jubilado hasta la agencia. Además hay una tensión que el dueño debe ver: quien más sufre con las redes es quien menos probablemente pague y más rápido abandona (el propio ROADMAP asume 8 % de abandono mensual en usuario individual).

### Persona propuesta (hipótesis a validar, no hecho)
**Quien trabaja sola/solo y vive de su nombre: freelance, dueño/a de un negocio pequeño o creador/a pequeño/a que capta clientes o ventas por redes.** Tiene 1 a 3 redes, publica en rachas ("tres posts en una semana, desaparezco diez días") y siente culpa por ello.

Por qué esta y no "cualquiera a quien le cuesta": es la que puede convertir una publicación o un comentario en dinero, lo que enlaza con el criterio de redes del dueño ("que devuelvan dinero o resultados") y con la disposición a pagar 9 USD.

### Qué le cuesta (hipótesis; la evidencia pública es débil)
- **La hoja en blanco**: no sabe qué publicar. Esto no lo resuelve un programador.
- **La constancia**: aparece y desaparece. Evidencia anecdótica de blogs de proveedores (p. ej. [Postiz](https://postiz.com/blog/social-media-scheduler-for-small-business)); una encuesta vieja (VerticalResponse, probablemente 2014-2015) decía que el 43 % de pequeños negocios dedica 6+ h/semana. No encontró datos recientes de abandono de herramientas: **no es un hecho verificado**.
- **No saber si sirve**: ve números sueltos y no sabe qué hacer con ellos.
- **Comentarios sin atender**: pierde interesados por no contestar a tiempo.

### Qué ha intentado (a confirmar en entrevistas)
Recordatorios y notas del móvil, la app nativa de cada red, Meta Business Suite (gratis), Canva, plan gratuito de Buffer/Publer. Hipótesis: lo deja a las 2 a 4 semanas.

### Qué la frena
Herramientas pensadas para marketers (jerga, paneles), cuenta de empresa/Creator obligatoria en Instagram, miedo a que "algo se publique mal solo", precio por canal, y la sensación de "otra cosa más que mantener".

### Los 3 trabajos (jobs to be done)
1. **"Ayúdame a no desaparecer."** Mantener presencia constante sin decidir cada día. Esto es constancia, no calendario.
2. **"Dime si me está sirviendo y qué hago distinto."** Ver publicaciones y números, y salir con *una* acción, no con un panel.
3. **"No dejes que se me enfríe quien me escribe."** Que un comentario no quede sin respuesta y se convierta en contacto, clic o venta.

"Publicar en todas mis redes desde un sitio" es un **medio**, no un trabajo. Un usuario no contrata la herramienta por eso: lo da por supuesto, y es paridad.

---

## 2. Propuesta de valor y diferenciación

### Una frase
*Para freelances y negocios pequeños a quienes se les enfrían las redes por falta de tiempo y de constancia, So-Pilot es el copiloto que mantiene tus publicaciones saliendo, te dice qué funcionó y responde por ti lo básico, a diferencia de Buffer/Publer/Business Suite, que programan pero te dejan solo con la decisión y los números.*

### Alternativas actuales (con fuentes; precios de terceros, verificar en cada web)
| Alternativa | Qué ofrece | Fuente |
|---|---|---|
| **No hacer nada / apps nativas** | Costo cero. Threads tiene programación nativa (reportada; fechas de lanzamiento discrepan entre fuentes) y analítica propia | [Sprout Social](https://sproutsocial.com/insights/schedule-threads-posts/), [Social Samosa](https://www.socialsamosa.com/news-2/threads-rolls-out-new-updates-to-enhance-user-experience-8649102) |
| **Meta Business Suite** | Gratis; programa Instagram y, según guías, Threads; planner | [SocialBu](https://socialbu.com/blog/schedule-instagram-reels-and-posts), [Postplanify](https://postplanify.com/blog/how-to-schedule-threads-posts) |
| **Buffer** | Free: 3 canales, 10 posts en cola por canal. Essentials ≈ 6 USD/canal/mes | [NapoleonCat](https://napoleoncat.com/blog/buffer-pricing/) |
| **Publer** | Free: 3 cuentas, 10 posts programados por cuenta. De pago ≈ 4 a 12 USD/cuenta (fuentes discrepan) | [CostBench](https://costbench.com/software/social-media-management/publer/) |
| **Metricool** | Free: 1 marca, 20 posts/mes, 30 días de analítica; LinkedIn bloqueado en gratis | [SocialPilot](https://www.socialpilot.co/insights/metricool-pricing) |
| **ManyChat** (auto-respuesta a comentarios con palabra clave, normalmente comentario a DM) | Free de 25 contactos tras el cambio de marzo 2026; pago desde ~15 a 39 USD (fuentes discrepan) | [Botpenguin](https://botpenguin.com/blogs/manychat-pricing), [ManyChat](https://manychat.com/blog/how-to-automate-your-comments-with-manychat/) |
| **Meta nativo (comentario a mensaje)** | Plantilla gratuita en Business Suite de escritorio, palabras clave exactas; no encontró una respuesta pública automática nativa | [CreatorFlow](https://creatorflow.so/blog/instagram-built-in-automation/) |
| **OneUp** | Ya combina programación y automatización de DM | [OneUp](https://www.oneupapp.io/blog/oneups-dm-automation-feature-a-manychat-alternative-for-instagram-and-facebook) |

### Qué es paridad (decirlo sin adornos)
- Escribir, programar, calendario, subir media, estados: **paridad con herramientas que son gratis**. Hoy el plan gratuito de la competencia (10 en cola por canal x 3 canales) es más generoso que el de So-Pilot (10 programados al mes en total).
- "Publicar en todas las redes": paridad y, **hoy, falso**: solo funciona Threads.
- Auto-respuesta por palabra clave: existe en ManyChat, OneUp y parcialmente en Meta. Combinarla con programación **no es único**.
- Interfaz en español: Metricool (origen español, de memoria, verificar) y otros ya la tienen. No es un foso.

### Qué podría ser diferente de verdad (apuestas, no certezas)
1. **De "dashboard" a "una acción".** Los competidores entregan métricas; la persona que "le cuesta" necesita que se las traduzcan: *"tus 2 mejores posts fueron de mañana; esta semana te faltan 3 publicaciones; este te funcionó, repítelo"*. Se puede hacer con **reglas simples, sin IA ni costo por uso**. Es lo único que enlaza con el nombre "copiloto". **Sin validar.**
2. **Valor antes de esfuerzo:** al conectar la cuenta, mostrar de inmediato sus últimas publicaciones y números, sin escribir nada (requiere importar posts y permiso de insights; el ROADMAP ya lo señala, hay que verificar permisos).
3. **Precio plano** (9 USD sin importar canales): real solo con 2 o más canales; con un solo canal, Buffer a 6 USD es más barato. Hoy hay un canal.
4. **Simplicidad radical** como diseño, no como eslogan: 3 pantallas, lenguaje de persona, nada de estados técnicos.

**Veredicto honesto:** hoy So-Pilot no tiene un diferencial demostrado frente a Buffer/Publer/Metricool. Tiene una hipótesis (traducir números a acción + simplicidad para quien le cuesta) que es plausible pero no probada. Si las entrevistas no la confirman, el producto es otro programador más.

---

## 3. Experiencia central

### El "momento de valor" correcto
No es "publicar un post" (eso es una tarea). Propone dos:
- **Momento 1 (primeros 5 min):** "ya sé dónde estoy y mi próxima publicación está lista". Mejor aún si el primer valor es ver sus últimas publicaciones y números justo al conectar.
- **Momento 2 (primera semana):** "mi semana está cubierta y me dijo qué hacer". Es el que crea hábito.

### Recorrido con tiempo objetivo (objetivo: ≤ 5 min hasta la primera publicación o programación)
| # | Paso | Objetivo | Dónde se perdería | Qué hacer |
|---|---|---|---|---|
| 0 | Llega a la landing | 10 s para entender para quién es | Titular genérico | Mensaje concreto (ver sec. 5) |
| 1 | Registro (Google) | 20 s | Pantalla de login sin contexto | Un clic, sin formulario |
| 2 | Conectar cuenta | 60 s | **Pantalla de permisos de Meta** (publicar, gestionar respuestas); confusión Threads vs Instagram; en Instagram, **exigir cuenta Business/Creator vinculada a Página** | Explicar *antes* qué pedirá y por qué; guiar el cambio de tipo de cuenta con 3 pasos; es el punto de mayor fuga previsible |
| 3 | Ver su situación | 10 s | Pantalla vacía | Mostrar sus posts y números ya importados (valor sin esfuerzo) |
| 4 | Primer post | 90 s | **Hoja en blanco** | Sugerencias de arranque y plantillas simples; permitir publicar una nota corta |
| 5 | Elegir cuándo | 15 s | Selector de fecha/hora abierto | Tres botones: "Ahora", "Mañana 9:00", "Elegir"; una hora sugerida |
| 6 | Confirmación | 5 s | "¿Se programó o no?" | "Listo: sale el jueves a las 9:00" + vista de la semana |
| 7 | Vuelve | día 3 a 7 | Nada que lo traiga de vuelta | Aviso por correo cuando se publicó y resumen semanal |

Nota técnica que condiciona la deseabilidad (no es su alcance, pero hay que señalarla): hoy en producción **programar falla** (Redis y worker solo locales, PROJECT.md sec. 10) y las redes no están abiertas al público. Sin eso, ningún recorrido de usuario real es posible.

### Qué quitar (para quien le cuesta)
Basado en lo que vio del código:
- **Siete filtros de estado** en `/dashboard` (All, Published, Failed, Publishing, Scheduled, Draft, Cancelled). Sustituir por tres grupos humanos: "Salen pronto", "Ya publicados", "Necesitan tu atención".
- **Cinco ítems de menú** (Posts, Compose, Calendar, Accounts, Automations) con jerga en inglés. Proponer: "Mi semana", "Escribir", "Respuestas", "Cuentas". Calendario y lista son dos vistas del mismo contenido: unificarlas.
- **Mensajes de error crudos** del API de Threads: traducir a una causa y una acción ("Tu conexión caducó. Vuelve a conectarla").
- **Promesas aún no construidas** de la landing (ver sec. 5).
- **Opciones de configuración** de auto-respuestas al principio: una regla por defecto con ejemplo.
- Todo lo que ROADMAP ya marca [X] (carrusel, arrastrar, tema oscuro) no debe contaminar el primer recorrido.

---

## 4. Qué hace que pague

### Principio
Lo gratuito debe entregar el momento de valor y alimentar el hábito. Lo de pago debe aparecer **cuando el usuario ya obtuvo un resultado y quiere más de ese resultado**, no cuando choca contra un muro arbitrario.

### Crítica al plan actual (`lib/plans.ts`)
- **Inconsistencia:** el código dice 12 USD; la hipótesis del ROADMAP dice 9 USD. Hay que decidir y unificar antes de cualquier prueba de precio.
- **"10 posts programados al mes"** es un límite de volumen: menor a un ritmo constante (≈2,5 por semana) y peor que Buffer/Publer gratis. En un producto de *constancia*, el límite llega justo cuando se forma el hábito: puede convertir (bien) o expulsar hacia Publer gratis (mal). **Hay que probarlo.**
- **"AI-powered replies"** como gancho de pago: la persona probablemente **no** lo desea (miedo a que un bot hable en su nombre; riesgo de sonar robótico). Además ROADMAP lo apaga por costo. No venderlo como razón principal.
- **"Priority support"** y "unlimited": promesas de un solo desarrollador; cuidado.

### Gratis (para enganchar)
- Conectar cuenta, ver sus posts y números básicos (últimos días).
- Escribir, programar y calendario con un límite que **no corte la constancia** en las primeras semanas.
- Auto-respuesta por palabra clave en cantidad limitada, para que *vea* el resultado una vez ("3 comentarios respondidos esta semana").
- Resumen semanal básico.

### Premium (desde lo que valora, no desde el costo)
Candidatos, ordenados por estimación de deseabilidad (todas por validar):
1. **"Qué funcionó y qué hacer": historial largo, mejores horas, recomendaciones y resumen semanal completo.** Es el trabajo 2; es donde la herramienta se vuelve copiloto.
2. **Respuestas que dan resultado:** más reglas, más volumen, y un contador de qué trajeron (clics, contactos). Es el trabajo 3 y está ligado a dinero.
3. **Más redes y cola larga** (cuando existan) con precio plano.
4. Respuestas con IA: opcional, no como argumento principal.

La disposición a pagar debe medirse, no asumirse (ver sec. 6).

### Retención: qué la hace volver cada semana
Problema estructural: **un programador "gana" cuando no lo usas.** Si programa el mes en una tarde, no hay motivo para volver ni para pagar 9 USD cada mes. Eso hay que diseñarlo:
- **Resumen semanal por correo** (lunes: "tu semana"; domingo: "cómo te fue"), de bajo costo.
- **Salud de la cola:** "Tienes posts hasta el jueves; el viernes queda vacío" con un botón para llenarlo.
- **Un resultado visible por semana:** respuestas atendidas, mejor post, tiempo ahorrado estimado.
- **Racha suave** ("semanas seguidas publicando") solo si las entrevistas muestran que motiva y no culpa; riesgo de efecto contrario en quien ya se siente mal por no publicar.
- **Sin analítica, la retención es débil:** desde la deseabilidad, la analítica no es [P] de Etapa 3, es el motor de retención y el diferenciador. El ROADMAP ya la marca como "candidata a subir". El agente coincide.

---

## 5. Atractivo y compartible

### Nombre y posicionamiento
- **"So-Pilot"** (Social Copilot) sugiere "copiloto": tú mandas, él ayuda. Es coherente con la persona que teme perder el control.
- **Conflicto:** la landing dice "on autopilot" ("piloto automático"). Eso contradice el nombre y connota bots y spam. Posicionamiento recomendado: **copiloto, no piloto automático**.
- A verificar (no lo hizo): disponibilidad de dominio y marcas, y posible choque con "Copilot" (Microsoft/GitHub) o productos "Social Copilot" existentes. El guion del nombre y su pronunciación en español también merecen una prueba con 5 personas.

### Mensajes candidatos (para probar, no para adivinar)
- A: "Tus redes no se enfrían cuando tú no tienes tiempo."
- B: "Publica, mira qué funciona y responde sin vivir pegado al móvil."
- C: "Tu copiloto de Threads e Instagram: tú decides, él lo hace a tu hora."

### Pruebas de valor y ganchos
- **Tarjeta "Mi semana en redes"**: una imagen con sus números que el usuario publica *él mismo*. Resuelve su hoja en blanco y a la vez muestra la marca. Es la mejor idea de compartible que ve (supuesto, no probado).
- **Prueba social honesta**: hoy no hay usuarios; no fabricar testimonios. Usar un caso real del autor (su propia cuenta, antes/después) con números reales.
- **Referido simple**: un mes de Premium para ambos. El costo variable por usuario es bajo según ROADMAP, pero eso es suyo.
- **Herramientas gratuitas de entrada** (contador de caracteres Threads/IG, mejor hora para publicar): posible tráfico, sin verificar demanda.

### Revisión crítica de la landing actual
1. **Titular genérico:** "Your social media, on autopilot" lo podría decir cualquiera. No nombra a la persona ni el dolor. Subtítulo ("Connect, write once, schedule everywhere, keyword replies") es una lista de funciones.
2. **Promete lo que no existe** (riesgo de confianza y de revisión de plataformas):
   - "How it works": "Link Instagram, Threads and YouTube". **Solo Threads funciona.**
   - FAQ: "We are starting with Instagram, Threads and YouTube."
   - "Publish everywhere" y "Per-network previews": **no existen**.
   - "Visual calendar ... and move it around": **arrastrar no existe** (PROJECT.md).
   - "Auto replies": **aún no implementadas** (Fase 7 pendiente).
   - "Reuse media across platforms": no hay multi-red.
   Un revisor de Meta o un usuario que lo note pierde confianza al instante.
3. **No dice nada de analítica ni de "ver tus números"**, que es la mitad de la promesa que el dueño fijó en ROADMAP ("publica, programa, mira cómo te va..."). Landing y estrategia están desalineadas.
4. **Precios:** Premium 12 USD vs hipótesis 9 USD; "Free forever" con límites nada claros; "AI-powered replies" que ROADMAP apagó; botón Premium "Coming soon" deshabilitado, lo que comunica "no hay producto de pago".
5. **El CTA "Start for free" lleva a `/dashboard`**, es decir, a un login, y después a conectar una cuenta que **hoy casi nadie puede conectar** (modo desarrollo, solo testers). Se vende algo que un visitante no puede usar. Mejor, mientras tanto: lista de espera + solicitar entrevista (ROADMAP ya lo recomienda y cuesta casi nada).
6. **Solo en inglés** cuando el idioma está sin decidir y el diferencial plausible es hispanohablante.
7. **Sin evidencia visual:** ni capturas, ni demo, ni número. Cero pruebas de que funciona.
8. **FAQ no responde las dudas de la persona:** "¿Publica sin que yo lo apruebe?", "¿Necesito cuenta Business?", "¿Qué pasa si una respuesta automática dice algo mal?", "¿Qué datos veis?", "¿Puedo cancelar?".
9. **Hero, features y how-it-works dicen lo mismo tres veces** y ninguna sección responde "por qué yo".

---

## 6. Definición del producto en una página

**Qué es.** So-Pilot es el copiloto de redes para quien trabaja solo y vive de su nombre. Mantiene sus publicaciones saliendo, le dice qué funcionó y qué hacer la próxima semana, y responde lo básico para que no se le enfríe nadie.

**Para quién.** Freelances, negocios pequeños y creadores pequeños que captan clientes o ventas por redes y a quienes les cuesta la constancia. Idioma inicial: el de esa persona (decidir con entrevistas).

**Recorrido.** Registro con un clic, conectar cuenta con explicación previa, ver de inmediato sus publicaciones y números, escribir un primer post con ayuda, elegir cuándo con tres botones, confirmar "listo, sale el jueves a las 9". Cada semana: resumen de lo que salió, qué funcionó y una acción. Meta: ≤ 5 minutos hasta la primera publicación.

**Principios de diseño.**
1. Valor antes de esfuerzo (mostrar antes de pedir).
2. Una acción por pantalla; lenguaje de persona, no de marketer.
3. Tú mandas: nada sale ni se responde sin que sepas qué y cuándo.
4. Cada número viene con una acción.
5. Honestidad: solo se promete lo que funciona hoy.
6. Que sea un hábito de 5 minutos a la semana, no una tarea.

**Diferenciadores (a demostrar).** Traducir métricas a acciones simples; valor inmediato al conectar; simplicidad radical; precio plano cuando haya 2 o más redes; auto-respuestas ligadas a resultado.

**Paridad (no vender como diferencia).** Programar, calendario, subir media, multi-red, palabras clave.

**Lo que NO será.**
- Una suite para agencias (equipos, aprobaciones, informes de cliente, CSV masivos).
- Un generador masivo de contenido con IA.
- Un bot que se hace pasar por la persona o hace spam de respuestas.
- Un panel con decenas de métricas.
- Una herramienta de "growth hacks" (seguir/dejar de seguir, comentarios automáticos a terceros).
- Un buzón de mensajes privados completo.

### Suposiciones de deseabilidad a validar con usuarios reales
Ruta posible **ya**, sin esperar a la revisión de Meta: la app en modo desarrollo permite cuentas con rol de tester (PROJECT.md), así que se puede hacer una beta cerrada pequeña en paralelo a los trámites.

| # | Suposición | Cómo validarla | Señal para seguir / matar |
|---|---|---|---|
| 1 | Existe un segmento (freelance/negocio pequeño) con el dolor de constancia que describe | 8 a 10 entrevistas de problema (preguntar por la última vez que lo intentaron, no por intención futura) | La mayoría describe un intento reciente y abandono; si no, redefinir |
| 2 | Hoy abandonan las herramientas y por qué (hoja en blanco vs logística) | Mismas entrevistas; pedir que muestren lo que usan | Si el dolor es "qué publicar", el programador no es el producto |
| 3 | "Qué funcionó y qué hacer" se valora más que un panel | Concierge: enviar a mano un resumen semanal a 8 a 10 personas durante 4 semanas | Lo abren y actúan (responden, cambian una publicación); si no, el diferencial cae |
| 4 | Ver sus posts y números al conectar es "wow" | Prueba de uso con 5 personas, pensando en voz alta | Reacción espontánea sin pedirles que escriban nada |
| 5 | Convertir la cuenta a Business/Creator no las frena | Observar el paso 2 con 5 usuarios de Instagram | Si más de la mitad se queda, hay que cambiar el orden o empezar por Threads |
| 6 | Auto-respuesta pública por palabra clave aporta valor (en Threads no hay DM por API; el valor fuerte de la competencia es comentario a DM) | Preguntar casos reales en las entrevistas; probar con 3 negocios en beta | Si nadie tiene un caso concreto, el feature es relleno y no justifica Premium |
| 7 | La gente confía en una respuesta automática hablando por ella | Mostrar ejemplos y medir incomodidad | Rechazo alto implica bajar su peso como gancho |
| 8 | Pagarían ≈9 USD/mes plano | Prueba de puerta falsa (botón "Hazte Premium" tras el resultado) y 3 puntos de precio | Definir el umbral antes de medir; sin umbral previo es autoengaño |
| 9 | Volverían semanalmente | Beta de 4 semanas; medir cuántos programan algo en la semana 3 | Si solo usan el día 1, el producto no retiene |
| 10 | El mensaje de la landing se entiende | Prueba de 5 segundos con 10 personas y landing honesta con lista de espera | Entienden para quién es y qué hace sin ayuda |

### Riesgos finales
- **Riesgo de construir para uno mismo:** el dueño es la persona objetivo; sin entrevistas, sus supuestos se confirman solos.
- **Riesgo de dependencia:** el diferencial propuesto (números) depende de permisos de Meta por aprobar.
- **Riesgo de retención estructural:** un programador que funciona bien casi no se usa.

---

## Resumen del agente (≤ 300 palabras)

1. **Persona:** "a quien le cuesta" no es un segmento. Propone freelances, negocios y creadores pequeños que captan clientes por redes; es hipótesis sin entrevistas. Tres trabajos: no desaparecer, saber qué funciona y qué hacer, no dejar enfriar a quien escribe.
2. **Diferenciación honesta:** programar, calendario, multi-red y palabras clave son paridad con herramientas gratuitas (Buffer, Publer, Metricool, Meta Business Suite, ManyChat). Hoy no hay diferencial demostrado. La apuesta plausible: traducir números en una acción semanal (reglas simples, sin IA), valor inmediato al conectar y simplicidad radical.
3. **Experiencia:** objetivo ≤ 5 min a la primera publicación. Mayor fuga previsible: permisos de Meta y obligación de cuenta Business/Creator en Instagram, y la hoja en blanco. Quitar: siete filtros de estado, jerga, errores crudos y promesas no construidas.
4. **Pago y retención:** el plan actual (12 USD en código vs 9 en hipótesis; 10 posts/mes) pierde contra planes gratuitos y la IA no es el gancho deseable. Premium debería colgar de "qué funcionó y qué hacer" y de respuestas con resultado. Un programador casi no se usa; sin analítica y resumen semanal no hay retención. Subir la analítica de prioridad.
5. **Landing:** promete Instagram, YouTube, multi-red, previsualizaciones, arrastrar calendario y auto-respuestas que no existen; no menciona números; "Start for free" lleva a un login que nadie externo puede completar. Cambiar a mensaje concreto, honesto, con lista de espera.
6. **Validar ya:** 8 a 10 entrevistas, un resumen semanal manual (concierge) y una beta cerrada con testers de Threads, en paralelo a la revisión de Meta, con umbrales fijados antes de medir.

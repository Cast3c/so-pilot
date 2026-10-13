# So-Pilot: informe del escéptico de validación (2026-10-12)

> **Origen:** informe del agente `validation-skeptic`, entregado en la conversación y guardado aquí a petición del dueño. El contenido es el del agente, sin editar salvo este encabezado.
> **Cautela:** varias fuentes son secundarias o de interesados comerciales. Las cifras y los precedentes marcados [S] o [NV] deben verificarse antes de decidir con ellos.

Etiquetas: **[V]** = verificado en fuente citada; **[S]** = fuente secundaria o de un interesado (blog de competidor, foro); **[E]** = estimación o inferencia del agente; **[NV]** = no pudo verificarse.

## Señales de alarma, por delante

1. **Hoy la única evidencia de demanda es el autor (n = 1).** Ninguno de los dos documentos cita una conversación con un posible cliente. El propio ROADMAP admite que "hay que comprobarlo con personas reales antes de invertir meses", pero lo ordena en tercer lugar y "en paralelo", detrás de construir auto-respuestas. Lo correcto es que sea la puerta de entrada.
2. **El segmento objetivo ("personas a las que les cuesta manejar sus redes sociales") es un estado de ánimo, no un comprador.** Quien le dedica poco esfuerzo a sus redes es el que menos paga. El plan gratuito de Buffer (3 canales) ya cubre a casi toda esa gente.
3. **Las tres promesas están, hoy, cubiertas gratis por alguien más** (programar, ver números, auto-responder). La diferenciación real que queda es el idioma y la simplicidad, y ninguna de las dos está validada.
4. **No se encontró un fracaso específico de una herramienta solo de Threads.** Sí varios cierres de herramientas generalistas de programación (ver sección 2). Si esto aplica, el patrón es "mercado saturado más plataformas con herramientas nativas".

## 1. Por qué fracasaría, ordenado por probabilidad × impacto

### 1.1 Saturación y competencia gratuita (probabilidad muy alta, impacto alto)
- **Buffer, plan gratuito [V/S]:** 3 canales, 10 publicaciones en cola por canal, 1 usuario, 30 días de analítica. De pago: unos 5 a 6 USD por canal al mes (las fuentes difieren en si es tarifa mensual o anual). Fuente: https://napoleoncat.com/blog/buffer-pricing/ y https://www.socialchamp.com/blog/?p=44200
- **El 9 USD plano solo es más barato que Buffer de pago si el usuario tiene 2 o más canales de pago [E].** Para 1 o 2 canales, Buffer gratis o de pago sale igual o más barato. Para 3 o menos canales, Buffer es gratis. Un usuario individual con 1 a 3 canales no tiene motivo económico para pasarse.
- **Metricool [S]:** plan gratuito (1 marca, 20 publicaciones al mes), con Threads, analítica fuerte y 11 redes. Fue adquirido por team.blue en 2024. Fuente: https://bloggingwizard.com/metricool-review/
- **Postiz [S]:** open source (AGPL-3.0), más de 30 plataformas, autoalojable. Fuente: https://postiz.com/blog/open-source-social-media-scheduler. Un desarrollador puede copiar el producto gratis, y la ventaja en producto es cero.
- **Nativo de Meta [S]:**
  - Threads tiene programación nativa desde enero de 2025, hasta 75 días, sin respuestas programadas: https://alternativeto.net/news/2025/1/threads-introduces-post-scheduling-a-new-markup-feature-and-enhanced-post-metrics. Una guía de 2026 afirma lo contrario (que Threads casi no ofrece programación nativa). Hay conflicto entre fuentes y debe comprobarse en la app.
  - Instagram programa nativamente en cuentas profesionales (hasta 75 días) y Meta Business Suite es gratis: https://recurpost.com/blog/schedule-instagram-posts-without-third-party-app
  - Hay "Comment to Message" (comentario con palabra clave → DM) en Meta Business Suite, gratis, con una palabra clave por automatización según algunas fuentes. Las fuentes discrepan en si hay respuesta pública nativa: https://www.spurnow.com/blogs/instagram-auto-reply-to-comments-guide y https://creatorflow.so/blog/instagram-built-in-automation/
- **ManyChat [S]:** plan gratuito para Instagram y Messenger (el tope de contactos varía entre fuentes) y Pro desde ~15 USD/mes. Fuente: https://chatarmin.com/en/blog/manychat-pricing. Ya es el estándar de "comentario con palabra clave → mensaje". Sus ingresos publicados son inconsistentes entre fuentes y no se usan como evidencia.

### 1.2 Disposición a pagar de individuos (probabilidad alta, impacto alto)
- Conversión de gratis a de pago: referencias de entre 2,6 % y 5 % en freemium autoservicio [S, metodología poco clara]: https://www.crazyegg.com/blog/free-to-paid-conversion-rate/. Beacons (herramienta para creadores) reportó 0,5 % [S, Sacra, texto generado por IA]: https://sacra.com/chat/h/8d8ebb2c-c87f-4f41-8cce-bf42e378e0a3/
- Abandono: la suposición del ROADMAP (8 % mensual) está en el rango de apps de consumo (5 a 9 %) pero muy por debajo de herramientas de creadores (13 a 18 % mensual en Beacons y Stan) [S]: https://www.builtbyfoundry.io/blog/what-is-churn-creator-apps
- **Cuentas rápidas [E]:** con contribución de ≈ 7,88 USD por cliente (números del ROADMAP original), para llegar a 2.000 USD/mes de ingreso neto antes de costos fijos hacen falta ≈ 250 clientes de pago. Con 3 % de conversión eso es ≈ 8.000 a 9.000 usuarios gratuitos activos. Con 8 % de abandono, hay que reponer ≈ 20 clientes cada mes solo para no caer.
- **"4 clientes cubren costos y dan 30 % de margen" es técnicamente correcto pero engañoso:** son ≈ 36 USD de ingreso. Es margen sobre un hobby, no un ingreso. El margen no cuenta el sueldo. Hay que definir primero cuánto se necesita ganar al mes.

### 1.3 Dependencia de plataformas y revisión de apps (probabilidad alta, impacto muy alto)
- **[V] Documentación oficial de Threads:** "each permission must first be approved through the App Review process, and your app must be published"; los *testers* pueden otorgar permisos en cualquier momento; los usuarios sin rol solo tras la aprobación. Fuente: https://developers.facebook.com/documentation/threads/get-started.md
  - Consecuencia: **hoy no se puede servir a nadie fuera de la lista de testers.** Todo el negocio queda detrás de una revisión que decide un tercero sin plazo garantizado.
- **[V] Límites de la API de Threads:** 250 publicaciones y 1.000 respuestas por perfil en 24 h móviles; 100 borrados. Fuente: https://developers.facebook.com/documentation/threads/overview.md. Para un usuario individual no es problema. Para una cuenta con auto-respuestas en un post viral, 1.000 respuestas pueden agotarse.
- **[NV] Si una persona física sin empresa puede pasar la verificación de negocio de Meta para Threads.** La búsqueda no dio una fuente oficial. Una nota [S] indica que Meta exige verificación de negocio con documentos reales para permisos avanzados: https://singhamandeep.com/instagram-api-permissions-approval/ (vendedor de servicios de aprobación, con interés comercial). Hay un hilo de foro con apps rechazadas tras 16 días: https://developers.secure.facebook.com/community/threads/467668889451508
- **Dato nuevo y relevante [V según el agente]:** el 9 de octubre de 2026 Meta eliminó el paso "Access Verification" para proveedores de tecnología; se mantienen Business Verification y App Review. Fuentes: https://www.socialmediatoday.com/news/meta-removes-access-verification-for-developers/832678/ y https://www.socialsamosa.com/news-2/meta-removes-access-verification-tech-provider-app-onboarding-12667685. **Parte de la sección "Aprobaciones" de PROJECT.md (escrita "de memoria", como dice el propio aviso) puede haber quedado desactualizada.** Verificar en la documentación vigente antes de pagar nada (dominio, registro de empresa).
- Rechazos típicos reportados [S]: credenciales de prueba que no funcionan, flujo de conexión roto, justificación genérica por permiso, falta de vídeo de recepción. Una desarrolladora cuenta que durante años no pudo crear cuentas de prueba porque los sistemas las bloqueaban: https://dev.to/term164/a-developers-guide-to-surviving-metas-broken-app-review-process-54pj. Es un solo relato.
- **Riesgo estructural:** la promesa es "todas tus redes". Las redes donde el usuario gana dinero (Instagram, YouTube, TikTok) son las que más barreras tienen, y las que sí abren sin revisión (LinkedIn como persona) no tienen auto-respuestas sin la Community Management API [según PROJECT.md, sin verificar por el agente].

### 1.4 Sanciones por automatizar respuestas (probabilidad media, impacto medio-alto)
- **[NV] No se encontró texto de política oficial de Meta** que prohíba o sancione auto-respuestas hechas con la API oficial. Lo que hay es anecdótico.
- ManyChat se presenta como socio oficial de Meta, pero hilos de su comunidad reportan cuentas restringidas o baneadas por volumen e idénticas respuestas en ráfaga, sobre todo en posts virales: https://community.manychat.com/creator-conversations-72/manychat-got-my-instagram-account-banned-10265 y https://setsmart.io/blog/is-manychat-safe [S]. El riesgo de la propia herramienta es bajo, el de la conducta del usuario no.
- **Para So-Pilot [E]:** si una cuenta de un cliente es restringida por las auto-respuestas, el cliente culpa a la herramienta y se va, y no hay capacidad de soporte ni palanca ante Meta (ManyChat dice que no puede revertir baneos). Una función que expone la cuenta del cliente es difícil de vender a alguien "al que ya le cuesta manejar sus redes".

### 1.5 Costo de adquisición y retención (probabilidad alta, impacto alto)
- El ROADMAP original fijaba un CAC máximo de ≈ 65 USD. Esa cifra solo sirve con adquisición orgánica. No hay canal definido, presupuesto ni audiencia propia. Un canal orgánico para "programadores de redes" en español no está verificado.
- Retención: un programador de publicaciones es una herramienta de uso intermitente. Quien deja de publicar cancela. Con vida media supuesta de 12,5 meses el LTV es ≈ 98 USD [E sobre los supuestos del ROADMAP original].

### 1.6 Un solo desarrollador, sin ingresos (probabilidad alta, impacto alto)
- Una persona tiene que mantener 3 a 5 integraciones que cambian (versionado de LinkedIn, cuotas de YouTube, auditoría de TikTok), el worker siempre encendido, soporte, legal y adquisición. El ROADMAP no cuenta horas de soporte ni el mantenimiento recurrente de cada red.
- "Costo cero" ya es falso en la práctica: un worker y Redis siempre encendidos tienen costo, y el dominio propio y una posible verificación de negocio tampoco son gratis [E].
- Precedente de mercado: ver sección 2. Incluso empresas con equipo cierran.

## 2. Intentos previos similares

| Caso | Qué pasó | Calidad de la fuente |
|---|---|---|
| **Crowdfire** | Programación y curación para pequeños negocios; anunció cierre el 5 de mayo de 2025 y quedó fuera de línea el 15 de mayo (otra fuente dice junio). Razones citadas: plataformas con herramientas nativas de programación y analítica, y costo creciente de mantener integraciones de APIs de terceros. Sin opción de exportar datos | [S] directorio gappsy.com (https://gappsy.com/tools/crowdfire/); **no se encontró el anuncio original**. Los blogs de alternativas son de competidores |
| **Argyle Social** | Cierre de herramienta de publicación y atribución para marketers; la cobertura habla de mercado saturado, intensivo en capital y de plataformas y suites grandes | [S] reportes periodísticos resumidos; no se pudo verificar fecha ni causa por una fuente primaria |
| **Twitter Dashboard** | Herramienta de Twitter para negocios cerrada tras ~6 meses; "nunca despegó", las marcas ya usaban terceros | [S] https://martech.org/twitter-shutter-dashboard (el caso muestra que incluso una herramienta nativa puede fracasar frente a terceros establecidos) |
| **PostRocket (2013)** | Startup de Facebook con apoyo de 500 Startups; cierre. El CEO: "Our product had many issues..." | [V] https://techcrunch.com/2013/08/07/postrocket-shuts-down (antiguo; calidad de producto, no plataforma) |
| **Apps de terceros de Twitter (2023)** | Twitter cortó el acceso a API a Tweetbot y Twitterrific sin aviso y luego cobró; el nivel enterprise se reportó en ~42.000 USD/mes. Se advirtió que dejaba fuera a herramientas pequeñas | [S] https://www.androidcentral.com/twitter-finally-details-new-api-screws-third-party-apps-again y https://www.socialmediatoday.com/news/twitters-new-api-access-charges-could-price-many-apps-and-researchers-out/644775. No se pudo confirmar qué herramientas de programación concretas cerraron |
| **ContentCal** | Un usuario de foro dice que Adobe la compró y la retira | [NV] solo foro: https://www.ukbusinessforums.co.uk/goto/post?id=3175017 |
| **Hootsuite** | No cierra; se reposiciona como "Social OS" (junio de 2026) y cambió de dirección | [S] https://help.hootsuite.com/s/article/social-os |

**Qué NO se encontró:** una herramienta de programación o auto-respuesta específica de Threads que haya cerrado. Tampoco documentos de Meta sobre sanciones a usuarios por auto-respuestas. No inventarlo: lo que hay es un patrón general de saturación, plataformas con herramientas propias y dependencia de APIs.

**Patrón repetido:** (a) la plataforma integra la función nativamente, (b) el costo de mantener integraciones de APIs sube, (c) los precios por canal de los grandes y los planes gratuitos aprietan el segmento de bajo ingreso.

## 3. Evidencia a favor (qué tendría que ser verdad)

Para que funcione deben cumplirse todas:

1. **Existe un segmento concreto que paga.** Señal débil a favor: ManyChat existe y cobra desde ~15 USD/mes por comentario→mensaje. Es decir, quien vende por Instagram sí paga por automatizar comentarios [S]. Pero ese comprador es "creador o negocio que vende", no "persona a la que le cuesta manejar sus redes". **Lectura del agente: la hipótesis de valor más defendible es auto-respuestas para quien vende, no programación.**
2. **Un hueco real en español o en Threads.** Posible, no verificado. No se buscó si hay herramientas de auto-respuesta en español con buen producto, y las herramientas con Threads (Metricool, Buffer, Publer, etc.) ya están. Un hueco de idioma es defendible solo si el usuario lo siente como dolor.
3. **La revisión de Meta es alcanzable para una persona física.** No verificado (ver 1.3).
4. **Un canal de adquisición orgánico de coste cero.** Ninguno identificado. El autor puede ser su propio canal (construir en público).
5. **Un precio que vea valor frente a gratis.** Solo si hay una función que Buffer gratis y Meta nativo no den.

Señales a favor reales: el mercado de programadores existe y se sigue comprando (Metricool adquirida en 2024; Postiz crece); Meta mismo invierte en comment-to-DM, lo que confirma que el caso de uso importa; el costo de arranque es bajo y el autor ya construyó el núcleo.

## 4. Experimentos de 4 semanas, costo cero

Antes de cualquiera: **definir en una frase el comprador** (ej.: "creadores o negocios hispanohablantes que venden por Instagram o Threads y reciben comentarios tipo 'info'"). Si no se puede, el experimento 1 lo descubre.

### E1. 15 entrevistas (semanas 1 a 2)
- Encontrar 15 personas del segmento (contactos propios, comunidades de creadores en español, DM a cuentas con 1.000 a 20.000 seguidores). Preguntar por el *último* mes: qué publican, qué usan hoy, cuánto tiempo y dinero les cuesta, qué herramienta probaron y por qué la dejaron. **No presentar So-Pilot hasta el final.**
- **Éxito:** ≥ 6 de 15 describen sin que se les pregunte un dolor repetido sobre programar o responder comentarios **y** ≥ 3 ya pagan o pagaron por una herramienta o pagarían ≥ 9 USD.
- **Abandono / pivote:** < 3 de 15 mencionan el dolor, o ≥ 10 dicen que Buffer gratis, Meta Business Suite o ManyChat gratis les basta.

### E2. Página de espera con intención de pago (semanas 1 a 4)
- Una landing con una sola promesa, un botón "Quiero acceso" y, tras el correo, una segunda pantalla "Premium 9 USD/mes: reservar con tarjeta" (puede ser un enlace de pago o una simple pregunta).
- Tráfico orgánico propio (Threads, Instagram, comunidades). Mínimo 300 visitantes únicos para decidir.
- **Éxito:** ≥ 8 % de visitantes dejan correo (≥ 25) **y** ≥ 10 % de esos pulsan "reservar".
- **Abandono:** < 3 % deja correo con ≥ 300 visitas; o no se consiguen 300 visitas en 4 semanas (eso mismo es un dato sobre el canal).

### E3. Beta concierge con testers (semanas 2 a 4)
- Meta documenta que los *Threads testers* pueden otorgar permisos sin revisión [V]. Invitar a 5 a 8 personas reales (el máximo de testers permitido: [NV], verificarlo) y configurar sus auto-respuestas a mano si hace falta.
- **Éxito:** ≥ 3 de 5 siguen usándolo a los 14 días **y** ≥ 2 dicen que pagarían 9 USD.
- **Abandono:** < 2 lo usan tras el día 7. Si nadie lo usa gratis y con ayuda, no lo usará pagando.

### E4. Pre-venta pequeña (semana 4)
- Ofrecer a los que pasaron E1/E3 un pago adelantado de ≥ 9 USD o un plan anual con descuento por enlace de pago (solo comisión de Stripe).
- **Éxito:** ≥ 5 pagos. **Abandono:** 0 a 1 pagos.

### E5. Prueba de viabilidad de la revisión (semana 1, ½ día)
- Leer la documentación vigente de Threads y de Business Verification de Meta, y preguntar en el foro de desarrolladores de Meta si una persona física puede completarla en el país del dueño.
- **Abandono / replanteamiento:** si exige empresa constituida que no puede tenerse en < 60 días y los testers no alcanzan para el modelo de negocio, el plan es inviable tal cual.

### Regla de decisión al final de la semana 4
- **Seguir** solo si pasan E1 y E4 (los dos), y E2 o E3.
- **Cambiar de enfoque** si E1 muestra dolor pero no pago (producto gratis, otro modelo).
- **Parar o pivotar** si no pasan E1 ni E4.

## 5. Veredicto honesto

**Continuar, pero cambiando algo concreto, y con una puerta de validación obligatoria antes de seguir construyendo.** No se encontró una razón estructural que mate la idea con certeza. Lo que no hay es ninguna prueba de que alguien pague. Con el plan actual (construir auto-respuestas, luego trámites de plataformas, luego cobrar) el riesgo es pasar meses de dedicación completa y descubrir al final que el comprador no existe o que Meta rechaza la app.

La probabilidad del agente de que el plan actual produzca ingresos recurrentes suficientes para vivir es baja [E, sin base estadística]. Lo que la sube: nicho estrecho, función que no sea gratis en otro lado, y validación temprana.

### Qué cambiaría en ROADMAP.md

1. **Subir la validación a "Etapa 0.5, puerta de entrada".** Cuatro semanas de E1 a E5 antes de más features ni trámites con costo. Hoy aparece en Etapa 1 "en paralelo" y como "Previa".
2. **Abandonar "todas tus redes" como promesa.** Cambiarla por un nicho de una red y una función (Threads e Instagram, auto-respuestas para quien vende, en español, si E1 lo confirma). Un programador generalista compite con Buffer gratis. Una herramienta de auto-respuesta para vendedores compite con ManyChat, que es más estrecho.
3. **Quitar la analítica como razón de pago.** Está cubierta por Meta gratis y por Metricool/Buffer. Dejarla como mínimo (lectura simple), no como inversión.
4. **No empezar YouTube ni TikTok.** Cada una agrega una revisión y soporte a una sola persona. LinkedIn solo si E1 lo pide.
5. **Verificar los requisitos de Meta en la documentación vigente (E5) antes de pagar dominio o registro de empresa.** La sección de aprobaciones del PROJECT.md está escrita "de memoria" y Meta cambió un requisito hace tres días.
6. **Probar el precio.** Comparar 9 USD plano con un plan de ~5 USD o por uso, porque frente a Buffer el 9 USD plano solo gana con 2 o más canales de pago.
7. **Reemplazar el objetivo "30 % de margen neto" por un objetivo de ingreso mensual** (cuántos clientes y cuántos USD para poder dedicarse a esto), con fecha límite. Definir una regla de salida: p. ej., "si a los 6 meses no hay ≥ 20 clientes de pago, se archiva".
8. **Limitar la exposición legal y de soporte de las auto-respuestas:** tope de respuestas por hora, variación de texto y aviso de riesgo al usuario, antes de venderlas.

## Resumen del agente (≤ 300 palabras)

**Veredicto: continuar solo cambiando el plan, con una puerta de validación de 4 semanas antes de seguir construyendo.** No se encontró un asesino estructural confirmado, pero tampoco ninguna evidencia de que alguien pague: hoy la demanda es el propio autor.

**Riesgos principales (por probabilidad × impacto):**
1. Saturación y gratuidad: Buffer gratis (3 canales), Metricool gratis, Postiz open source, programación nativa de Threads e Instagram, y comment-to-DM nativo de Meta y ManyChat gratis. El plano de 9 USD solo es más barato que Buffer con 2 o más canales de pago.
2. Disposición a pagar: conversión típica de freemium ≈ 2,6 a 5 %, abandono de herramientas de creadores 13 a 18 % mensual (fuentes secundarias). Para ≈ 2.000 USD/mes harían falta ≈ 250 clientes.
3. Revisión de Meta: confirmado en la documentación que sin App Review solo funcionan los testers. No se pudo verificar si una persona física puede completar la verificación de negocio. Meta eliminó "Access Verification" el 9-oct-2026, así que el checklist de PROJECT.md puede estar desactualizado.
4. Solo un desarrollador, varias APIs, soporte y sin ingresos.
5. Auto-respuestas: no hay política oficial verificada, pero hay baneos anecdóticos por volumen.

**Precedentes:** Crowdfire (cierre mayo 2025, causa citada por un directorio, sin fuente primaria), Argyle Social, Twitter Dashboard, apps de terceros de Twitter 2023. No se encontró un fracaso específico de Threads.

**Cambios al ROADMAP:** validar primero (15 entrevistas, ≥ 6 con dolor y ≥ 3 que paguen; landing con ≥ 8 % de correos; 5 pre-ventas de ≥ 9 USD; abandonar si < 3 dolor y 0 a 1 pagos); elegir nicho (vendedores en español con auto-respuestas) en lugar de "todas las redes"; no gastar en dominio o empresa hasta confirmar requisitos de Meta; fijar un objetivo de ingreso con fecha de salida.

## Fuentes

- https://developers.facebook.com/documentation/threads/get-started.md
- https://developers.facebook.com/documentation/threads/overview.md
- https://www.socialmediatoday.com/news/meta-removes-access-verification-for-developers/832678/
- https://www.socialsamosa.com/news-2/meta-removes-access-verification-tech-provider-app-onboarding-12667685
- https://developers.secure.facebook.com/community/threads/467668889451508
- https://singhamandeep.com/instagram-api-permissions-approval/
- https://dev.to/term164/a-developers-guide-to-surviving-metas-broken-app-review-process-54pj
- https://napoleoncat.com/blog/buffer-pricing/
- https://www.socialchamp.com/blog/?p=44200
- https://bloggingwizard.com/metricool-review/
- https://postiz.com/blog/open-source-social-media-scheduler
- https://alternativeto.net/news/2025/1/threads-introduces-post-scheduling-a-new-markup-feature-and-enhanced-post-metrics
- https://recurpost.com/blog/schedule-instagram-posts-without-third-party-app
- https://www.spurnow.com/blogs/instagram-auto-reply-to-comments-guide
- https://creatorflow.so/blog/instagram-built-in-automation/
- https://chatarmin.com/en/blog/manychat-pricing
- https://community.manychat.com/creator-conversations-72/manychat-got-my-instagram-account-banned-10265
- https://setsmart.io/blog/is-manychat-safe
- https://www.crazyegg.com/blog/free-to-paid-conversion-rate/
- https://sacra.com/chat/h/8d8ebb2c-c87f-4f41-8cce-bf42e378e0a3/
- https://www.builtbyfoundry.io/blog/what-is-churn-creator-apps
- https://gappsy.com/tools/crowdfire/
- https://martech.org/twitter-shutter-dashboard
- https://techcrunch.com/2013/08/07/postrocket-shuts-down
- https://www.androidcentral.com/twitter-finally-details-new-api-screws-third-party-apps-again
- https://www.socialmediatoday.com/news/twitters-new-api-access-charges-could-price-many-apps-and-researchers-out/644775
- https://www.ukbusinessforums.co.uk/goto/post?id=3175017
- https://help.hootsuite.com/s/article/social-os

**Archivos leídos por el agente (sin modificar):** `docs/PROJECT.md`, `docs/ROADMAP.md`.

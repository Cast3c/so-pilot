# So-Pilot: filtro de features y hoja de ruta hacia el lanzamiento

> Cómo decidimos **qué se construye ahora** y **qué se acumula para cuando la app esté live**, con el objetivo final de que So-Pilot genere ingresos.
> Complementa a [`PROJECT.md`](PROJECT.md), que describe el estado técnico. Aquí se decide el **orden y el porqué**.
> Última actualización: 2026-10-12.

---

## 1. Para qué sirve este documento

Cada idea nueva compite por el mismo recurso escaso: el tiempo de una sola persona. Sin un criterio, el proyecto crece por lo que parece interesante y no por lo que acerca el lanzamiento.

El filtro responde a una pregunta: **¿esto va ahora, después del lanzamiento, o nunca?**

### Supuestos de partida (revisar si cambian)
- Un solo desarrollador, aprendiendo a la vez.
- **Costo cero** hasta que haya ingresos.
- Para abrir la app a usuarios hay que **pasar la revisión de las plataformas** (hoy solo funciona con cuentas de prueba). Eso no depende del código y tarda.
- Modelo de negocio previsto: **freemium** (Free y Premium, ya definidos en `lib/plans.ts`).
- Existen herramientas establecidas de programación en redes (Buffer, Hootsuite, Later, entre otras). **Diferenciarse** importa tanto como construir.

---

## 2. Las etapas de vida del producto

| Etapa | Nombre | Qué significa | Salida (cuándo se pasa a la siguiente) |
|---|---|---|---|
| **0** | Aprendizaje | Construir el núcleo funcional con cuentas de prueba. **Estamos aquí, cerrando.** | Publicar, programar, calendario, cancelar y auto-respuestas funcionando |
| **1** | Listo para revisión | Todo lo que exigen las plataformas para aprobar la app | La plataforma aprueba el envío |
| **2** | Lanzamiento (beta o live) | Poder operar con usuarios reales y **cobrar** | Primeros usuarios de pago |
| **3** | Crecimiento | Mejorar, escalar y diversificar con lo que pidan los usuarios | Continuo |

El filtro asigna cada feature a una de estas etapas.

---

## 3. El filtro: seis preguntas en orden

Se responde en este orden y **se para en la primera que cumpla**.

| # | Pregunta | Si la respuesta es sí… |
|---|---|---|
| **P1** | ¿Sin esto **no se puede lanzar o cobrar de forma legal y segura**? (revisión de plataformas, privacidad, pagos, que el servicio no se rompa para un usuario real) | **[G] Puerta.** Etapa 1 o 2. No se discute |
| **P2** | ¿Sin esto un usuario nuevo **no llega a su primer post publicado**? (el "momento de valor") | **[N] Núcleo.** Etapa 0, 1 o 2 |
| **P3** | ¿Es una **razón para pagar**? (una función Premium o un límite por plan) | **[P] Palanca de pago.** Etapa 2 si el cobro depende de ella. Si no, Etapa 3 |
| **P4** | ¿Tiene un **costo recurrente** por uso? (IA, almacenamiento pesado, más infraestructura) | **[C] Costo.** Etapa 3, y solo con un precio que lo cubra |
| **P5** | ¿Se puede añadir **después sin reescribir** lo que ya existe? | Si **sí**: acumular en el backlog. Si **no**: decidir ahora la forma, aunque se construya más tarde |
| **P6** | ¿Depende de **una espera de terceros**? (verificación, aprobaciones, dominio) | **Iniciar el trámite ya**, aunque la función llegue después |

Si una feature no cumple ninguna pregunta, es **[X] extra**: va al backlog o se descarta.

### Una regla que sale de aquí: permisos pedidos = funciones demostrables
Las plataformas revisan **cada permiso solicitado** y piden demostrar, con un vídeo, la función que lo usa. Pedir un permiso que la app no usa suele llevar al **rechazo**, y pedirlo después obliga a **otra ronda de revisión**.

Hoy el OAuth de Threads pide `threads_basic`, `threads_content_publish`, `threads_manage_replies` y `threads_read_replies`. Por tanto:
- Publicar y programar ya se pueden demostrar.
- **Las auto-respuestas deben existir antes de enviar la revisión**, o se retiran esos dos permisos de la solicitud y se piden más adelante.

---

## 4. Aplicación al backlog actual

Clave: **[G]** puerta · **[N]** núcleo · **[P]** palanca de pago · **[C]** costo recurrente · **[X]** extra.

### Etapa 0: terminar el núcleo (ahora)
| Feature | Etiqueta | Notas |
|---|---|---|
| Auto-respuestas por **palabras clave** | **[P]** + **[G]** | Función diferenciadora y la que justifica los permisos de comentarios. Versión mínima: una respuesta por regla, solo comentarios de primer nivel, sin IA |
| Estado `revoked` y aviso de **reconexión** al fallar un token | **[G]** | Sin esto, un token caducado o revocado parece un fallo misterioso, y genera soporte |
| **Pruebas automáticas** del núcleo (coincidencia de palabras clave, fecha y zona horaria, publicación idempotente) | **[G]** ligera | Con usuarios reales, un error cuesta más. La lógica pura es fácil de probar |
| **Renovar el token de Threads** (~60 días) | **[G]** | Sin esto el servicio deja de funcionar a cada usuario a los dos meses |

### Etapa 1: listo para revisión (en paralelo, **sin esperar al código**)
Son trámites con espera. **Conviene empezarlos ya** (P6):

| Trámite | Etiqueta | Notas |
|---|---|---|
| **Dominio propio** con HTTPS | **[G]** | También lo exige Clerk en producción |
| Registrar las URLs de desinstalación y borrado en Meta, y confirmar con una **llamada real** | **[G]** | Ya están hechos los endpoints |
| **Verificación de negocio** y registro como proveedor de tecnología | **[G]** | Suele ser lo más lento |
| Vídeos de demostración y cuenta de prueba para el revisor | **[G]** | Se graban cuando las funciones estén cerradas |
| Textos legales revisados y en español | **[G]** | Hoy en inglés y en borrador |
| **Validar que alguien pagaría** (lista de espera, entrevistas con 5 a 10 posibles usuarios) | Previa | Es el riesgo más grande, y no es técnico (ver sección 6) |

### Etapa 2: lanzamiento
| Feature | Etiqueta | Notas |
|---|---|---|
| **Redis y worker alojados** en un servidor siempre encendido | **[G]** | Hoy solo corren en tu máquina; sin ellos, programar no funciona en producción |
| **Instancia de producción de Clerk** | **[G]** | Requiere el dominio |
| **Cobro real** (Clerk Billing o Stripe) y **límites por plan** | **[G]** + **[P]** | Sin esto no hay ingresos. Los límites (cuentas, posts programados, auto-respuestas) son lo que diferencia Free de Premium |
| Borrado de usuario (webhook `user.deleted` de Clerk) y botón "Eliminar mis datos" | **[G]** | Cumplimiento |
| **Monitorización mínima** (aviso si el worker cae, errores de publicación) | **[G]** ligera | Un worker caído significa posts sin publicar y usuarios que pagan |
| **Editar o reprogramar** un post programado | **[N]** | Corregir una errata sin cancelar y repetir. Los usuarios lo pedirán enseguida |
| **LinkedIn** (publicar como persona) | **[N]** / **[P]** | Acceso inmediato, sin revisión de la plataforma. Aporta la propuesta "varias redes". Para publicar como página de empresa o leer comentarios hace falta una aprobación aparte |
| Interfaz en inglés y español | **[N]** | Decidir según el mercado objetivo (ver sección 6) |

### Etapa 3: acumular para cuando esté live
| Feature | Etiqueta | Por qué esperar |
|---|---|---|
| **Respuestas con IA** | **[P]** + **[C]** | Costo por uso. Se vende como Premium con un precio que lo cubra |
| **Analítica** de posts (alcance, interacciones) | **[P]** | ⚠️ **Candidata a subir de etapa:** forma parte de la propuesta de valor (ver sección 6). Pide otro permiso: decidir si va en la primera revisión de Meta |
| **Ver todas las publicaciones de la cuenta** (importar las que no se hicieron desde So-Pilot) | **[N]** | Parte de la propuesta de valor. Probablemente solo requiere `threads_basic`; verificarlo |
| **Instagram** | **[N]** / **[P]** | Idealmente entra en la **misma revisión** de Meta que Threads para no repetirla. Decidirlo al preparar el envío |
| **YouTube** | **[N]** | Verificación de Google y límite de cuota; las subidas de apps sin verificar quedan privadas |
| **TikTok** | **[X]** | Auditoría y exigencias de interfaz; la última |
| **Publicar un mismo post en varias redes a la vez** y vista previa por red | **[N]** / **[P]** | Cobra sentido cuando hay más de una red |
| **Varios archivos por post** (carrusel) | **[X]** | Mejora, no bloquea nada |
| Detalle de un día en el calendario, **arrastrar para reprogramar** | **[X]** | Pulido |
| **Equipos y organizaciones** (varios usuarios por cuenta) | **[P]** | Típica función de plan superior; hoy el modelo es individual y se puede ampliar después (P5) |
| **Programación masiva** (CSV), plantillas, biblioteca de medios | **[P]** | Funciones para agencias |
| **Eventos en tiempo real** (SSE) en lugar del sondeo | **[E]** | Solo importa con muchos usuarios simultáneos |
| Webhooks de comentarios en vez de sondeo | **[E]** | Requieren la app en modo Live |
| Selector de tema claro u oscuro | **[X]** | Pulido |

---

## 5. Cómo se usa en el día a día

1. **Toda idea nueva** se anota en la tabla de la etapa que corresponda al aplicar las seis preguntas. No se empieza a construir sin pasar por el filtro.
2. **Una sola cosa en curso** a la vez (idealmente una feature de la Etapa 0, o un trámite de la Etapa 1).
3. Al **cerrar una etapa**, se revisa todo el backlog: algo que parecía importante puede haber dejado de serlo, y los usuarios reales cambian las prioridades.
4. Cada decisión relevante se registra también en la sección 12 de `PROJECT.md`.

### Orden recomendado de lo que viene
1. Auto-respuestas por palabras clave (y la función pura de coincidencia con sus pruebas).
2. Estado `revoked` y renovación de tokens.
3. En paralelo, y sin código: dominio, verificación de negocio, y validar con posibles usuarios.
4. Editar o reprogramar posts.
5. Preparar la revisión de Meta (vídeos y registro de URLs).
6. Infraestructura de producción y cobro.

---

## 6. Riesgos y preguntas abiertas

### El riesgo más grande no es técnico
- **¿Hay quien pague?** Existen herramientas conocidas y, en muchos casos, con planes gratuitos. Convertir esto en ingresos necesita una razón clara para elegir So-Pilot. Candidatas a diferenciar: auto-respuestas por palabras clave en Threads e Instagram, una experiencia pensada para el mercado hispanohablante, o un precio bajo. **Hay que comprobarlo con personas reales antes de invertir meses.** Una lista de espera en la landing y unas cuantas conversaciones cuestan casi nada.
- **Dependencia de las plataformas.** Una red puede cambiar su API, sus límites o rechazar la revisión. El producto no debería depender de una sola red.

### Preguntas que hay que decidir (y que cambian el orden de arriba)
| Pregunta | Por qué importa |
|---|---|
| ~~¿Cuál es el **mercado objetivo**?~~ **Respondida el 2026-10-12** (ver "Decisiones tomadas", abajo). Falta concretar el **idioma** inicial | Decide el idioma inicial, qué redes importan y el precio |
| ~~¿Qué **redes** se incluyen en el lanzamiento?~~ **Criterio definido el 2026-10-12**; falta cerrar la lista (ver abajo) | Decide qué permisos se piden en la primera revisión |
| ¿Qué es **Free** y qué es **Premium**? **Sin decidir**; hay un borrador (ver abajo) | Decide los límites que hay que implementar |
| ~~¿Cuánto cuesta operar al mes?~~ **Estimado el 2026-10-12** (ver abajo); falta medir con datos reales | Fija el precio mínimo y cuántos suscriptores cubren los costos |
| ~~¿Cuánto tiempo semanal se puede dedicar?~~ **Respondida:** dedicación completa, 6 a 8 horas al día | Determina cuántas etapas caben y en cuánto tiempo |

### Decisiones tomadas

**Mercado objetivo (2026-10-12):** personas a las que **les cuesta manejar sus redes sociales** (como el autor) y que ven la herramienta como algo útil para **ver sus publicaciones, ver sus números y publicar en todas sus redes desde un solo sitio**.

Propuesta de valor, en una frase: *"Tus redes en un solo lugar: publica, programa, mira cómo te va y deja que las respuestas se hagan solas."*

Consecuencias que se derivan de esa respuesta:

| Consecuencia | Efecto en el plan |
|---|---|
| **"Ver sus números" es parte de la promesa**, no un extra. Hoy la analítica estaba en la Etapa 3 | Hay que decidir ya si entra en la **primera revisión** de Meta: añadir un permiso después obliga a otra ronda. Probablemente es el permiso de *insights* (`threads_manage_insights`); **verificar el nombre y los requisitos en la documentación** |
| **"Ver sus publicaciones"** no es solo las hechas desde So-Pilot. Hoy el listado muestra únicamente las nuestras (decisión 2 del plan de auto-respuestas) | Importar los posts existentes de la cuenta. La documentación de `threads_basic` indica que permite mostrar los posts propios del usuario, así que probablemente **no requiere un permiso nuevo**. Verificarlo |
| **Persona que le cuesta**: la herramienta debe ser **simple y guiada** | Pesa más la experiencia (menos opciones, mensajes claros) que el número de funciones. Un asistente de redacción con IA encajaría, pero es **[C]** costo por uso: solo como función Premium con precio que lo cubra |
| **Usuario individual**: disposición a pagar baja y alternativas gratuitas | El **costo por usuario** debe ser muy pequeño. Cada pieza de infraestructura (Redis, worker, IA) cuenta en el precio |

**Criterio para elegir redes (2026-10-12):** priorizar las que **puedan devolverle dinero o resultados al usuario** (campañas, monetización, clientes).

| Red | ¿Puede el usuario ganar dinero allí? *(de memoria; verificar)* | Acceso para nosotros |
|---|---|---|
| **Instagram** | Sí: colaboraciones con marcas, ventas, suscripciones | **Misma revisión de Meta que Threads.** Cuenta Business o Creator |
| **YouTube** | Sí, el más directo (programa de socios con anuncios) | Subidas en privado hasta verificar la app; cuota diaria |
| **TikTok** | Sí (programa de recompensas, tienda) | Auditoría previa; solo privado antes |
| **LinkedIn** | Indirecto: clientes, contactos, empleo, B2B | **Publicar como persona: acceso inmediato**, sin revisión |
| **Threads** | Poca monetización directa propia | Ya construido |

Tensión central: **las redes donde el usuario más gana son las más difíciles de abrir para nosotros**. Orden sugerido: **Threads + Instagram** en la primera revisión de Meta (una sola ronda), **LinkedIn** como primera red extra (sin espera), YouTube después y TikTok al final. Para que la herramienta "devuelva el esfuerzo", lo que más aporta no es la red sino **saber qué publicaciones funcionan**: de ahí la analítica y, como candidata, el **seguimiento de enlaces** (qué post trajo clics).

**Economía (2026-10-12):** el objetivo de 30 % **no es un margen sobre ingresos sino un retorno sobre lo invertido (ROI)**, aclarado por el dueño: recuperar lo puesto más un 30 %. Se cumple cuando la **ganancia neta acumulada** del negocio (ingresos − comisiones − costos de operación) alcanza `0,3 × dinero puesto + 1,3 × valor del tiempo invertido`. Si el tiempo no se cuenta como inversión, basta `0,3 × dinero puesto`. **Precisión posterior (2026-10-12):** el dueño aclaró que el negocio debe pagar primero la operación, el sueldo del dueño (objetivo **2.000 USD/mes**) y los de los trabajadores, devolver lo invertido y dar un 30 % de ganancia. El tiempo propio **no** se cuenta como inversión, porque se paga como sueldo. Capital disponible: **≈ 50 USD**, sin colchón. Con ese capital, el 30 % sobre lo invertido son ≈ 15 USD y es irrelevante: **lo que define el tamaño del negocio es el sueldo**.

Pagadores necesarios para pagar 2.000 USD/mes de sueldo más ≈ 43 USD de costos fijos (conversión 4 %, adquisición orgánica, hipótesis del analista; contribución por pagador = 0,945 × precio − 2,52 USD):

| Precio | Solo el dueño | Dueño + 1 trabajador* |
|---|---|---|
| 9 USD | 342 | ≈ 584 |
| 15 USD | ≈ 176 | ≈ 300 |
| 29 USD | ≈ 82 | ≈ 140 |

\* Trabajador a 1.000 USD/mes de salario con prestaciones ≈ 1.450 USD de costo (**supuesto sin verificar**). Con el ritmo de altas orgánicas del analista (ya optimista): 82 pagadores ≈ 27 meses, 176 ≈ 36 meses, 342 ≈ 48 meses o más tras el lanzamiento.

#### Decisión del dueño (2026-10-12): precio mínimo y clientela mínima

- **Precio mínimo por usuario de pago: 29 USD/mes.** Es el piso: no se diseñan planes de pago por debajo de eso.
- **Clientela mínima que sostiene el sueldo objetivo (2.000 USD/mes más ≈ 43 USD de costos fijos):**

| Escenario | Pagadores mínimos | Usuarios activos si convierte el 4 %* |
|---|---|---|
| Solo el dueño | **83** | ≈ 2.100 |
| Dueño + 1 trabajador (≈ 1.450 USD de costo, supuesto) | **141** | ≈ 3.500 |

\* La conversión de 4 % es una hipótesis tomada del analista para un producto de consumo; con un cliente de negocio puede ser distinta y debe medirse.

Cálculo: contribución por pagador a 29 USD ≈ 0,945 × 29 − 2,52 ≈ 24,9 USD; pagadores = (43 + sueldos y costos del equipo) / 24,9, redondeado hacia arriba.

**Esto es una hipótesis a validar, no un hecho.** Consecuencias que se derivan y **aún no están aplicadas**:
1. El cliente objetivo pasa de "individuo al que le cuesta" a **negocios o creadores que venden** y para quienes 29 USD es una herramienta de trabajo. Ya no encaja la landing actual ni `lib/plans.ts` (Premium en 12 USD).
2. En las entrevistas hay que **probar 29 USD de forma explícita**. El escéptico propuso como criterio de éxito ≥ 5 preventas de ≥ 9 USD; aplicar el mismo criterio a **29 USD**.
3. **Si nadie acepta 29 USD**, el piso no se sostiene y con el sueldo objetivo actual el negocio no cierra. Habría que revisar el sueldo objetivo, el segmento o el producto, y no bajar el precio sin más.
4. A ese precio el cliente espera un producto fiable y con soporte, lo que sube el costo de operar y de atender, y hace más importantes la reconexión de tokens, los avisos de fallo y las auto-respuestas con resultado. Las tablas de pagadores necesarios de más abajo siguen siendo válidas como entrada.

Hipótesis de partida (**todas por validar**):

| Supuesto | Valor | Origen |
|---|---|---|
| Precio Premium | 9 USD/mes | Hipótesis |
| Comisión de cobro | Stripe 2,9 % + 0,30 USD, más Clerk Billing 0,7 % (≈ 0,62 USD por cobro de 9 USD) | Fuentes de terceros; confirmar en Stripe y Clerk |
| Costo variable por usuario (infraestructura y soporte) | ≈ 0,50 USD/mes | Estimación |
| Costos fijos (servidor del worker, Redis, dominio) | ≈ 20 USD/mes | Estimación |
| Abandono mensual | 8 % (vida media ≈ 12,5 meses) | Hipótesis típica de consumo individual |

**Reemplazado por el análisis financiero** (ver "Evaluación de agentes" más abajo): los costos fijos reales son ≈ 43 USD/mes y el costo máximo de adquisición ≈ 41 USD. Resultado con los números iniciales: margen de contribución ≈ 7,88 USD/cliente/mes; **4 clientes** cubren los costos fijos y dan 30 % de margen con adquisición gratuita; el **costo máximo de adquisición** para mantener 30 % en la vida del cliente es ≈ **65 USD**.

**Competencia de referencia:** Buffer ofrece un plan gratuito (3 canales y 10 publicaciones en cola por canal) y cobra unos 5 a 6 USD **por canal** al mes en el plan de pago.

### Evaluación de agentes (2026-10-12)

Cuatro agentes evaluaron el proyecto: investigador de mercado, analista financiero, escéptico de validación y diseñador de producto. Informes completos en `docs/evaluation/`:

| Informe | Archivo |
|---|---|
| Investigación de mercado y competencia | [`evaluation/market-research.md`](evaluation/market-research.md) |
| Análisis financiero y de precios | [`evaluation/financial-analysis.md`](evaluation/financial-analysis.md) |
| Escéptico de validación | [`evaluation/validation-skeptic.md`](evaluation/validation-skeptic.md) |
| Diseño de producto y deseabilidad | [`evaluation/product-design.md`](evaluation/product-design.md) |

**Casi todas las cifras son hipótesis sin medir**; cada una va etiquetada en su informe. Varias fuentes de mercado son secundarias.

**Lo que los cuatro coinciden:**
1. **No hay evidencia de demanda.** Hoy el único usuario probado es el autor.
2. **Lo construido es paridad con herramientas gratuitas** (Buffer, Publer, Metricool, Meta Business Suite).
3. **El plan Free actual es más débil que el de la competencia** y el precio plano de 9 USD solo gana desde 2 canales.
4. **La landing promete lo que no existe** (YouTube, multi-red, previsualizaciones, arrastrar, auto-respuestas) y sus botones llevan a un login que nadie externo puede completar.
5. **Antes de gastar más tiempo o dinero hay que validar con personas reales.**

**Cifras corregidas** (precio 9 USD, conversión 4 %, abandono 8 %, adquisición orgánica):

| Concepto | Antes | Ahora |
|---|---|---|
| Costo fijo mensual al lanzar | ≈ 20 USD | **≈ 43 USD** (Vercel Pro para uso comercial, worker, Redis, herramientas) |
| Costo máximo de adquisición por cliente | ≈ 65 USD | **≈ 41 USD** |
| Pagadores para equilibrio / para 30 % de margen | 4 | **8 / 14** |
| Pagadores para 500 / 1.000 / 2.000 USD/mes de ganancia | no calculado | **91 / 175 / 342** |
| Ganancia con 1.000 usuarios activos y 4 % de pago | no calculado | **≈ 190 USD/mes** |
| Tiempo para 500 USD/mes (crecimiento orgánico de 8 % mensual, hipótesis) | no calculado | **≈ 28 meses tras el lanzamiento**; con altas planas, nunca |

**Dos hallazgos que cambian el plan:**
- **"Costo cero" no se sostiene al lanzar:** hacen falta unos 28 a 43 USD al mes más un colchón de 85 a 130 USD antes del primer ingreso.
- **Si el 30 % es después de un sueldo** de 1.000 USD, hacen falta ≈ 318 pagadores y no 91.

**Discrepancias entre agentes:**
- **Analítica:** el diseñador la ve como motor de retención ("qué funcionó y qué hacer"); el escéptico dice que no justifica pagar porque otros la dan gratis. Se prueba con un resumen semanal enviado a mano antes de construirla.
- **Alcance:** "copiloto de constancia para quien trabaja solo" (diseñador) frente a "auto-respuestas para quien vende, en español" (escéptico). Lo deben decidir las entrevistas.

**Propuestas pendientes de decisión (no aplicadas):**
1. **Etapa 0.5: puerta de validación de 4 semanas** antes de gastar en dominio, empresa o más redes: 15 entrevistas, lista de espera con intención de pago, beta cerrada con testers y 5 preventas. Criterios de éxito y de abandono fijados antes de medir (detalle en [`evaluation/validation-skeptic.md`](evaluation/validation-skeptic.md)).
2. **Corregir la landing** para que solo prometa lo que funciona, unificar el precio (hoy 12 USD en `lib/plans.ts`) y cambiar los botones por una lista de espera.
3. **Recortar Free** (por ejemplo 2 canales, 1 regla de auto-respuesta, analítica de 7 días) y partir de **9 USD como mínimo**, probando 12 a 15.
4. **Verificar antes de pagar nada** si una persona física puede pasar la verificación de negocio de Meta, y si Meta eliminó el paso "Access Verification" el 9-oct-2026, como dice una fuente.
5. **Definir una meta de ingreso mensual con fecha de salida** (por ejemplo, "si a los 6 meses no hay 20 clientes de pago, se archiva"), en lugar del margen como objetivo.
6. **Reabrir la arquitectura del worker:** una alternativa con cron de Vercel y la tabla de posts en Neon eliminaría Redis y el worker (≈ 7 USD/mes y su operación). **No verificada**: hay que comprobar los límites de frecuencia de los crons.

**Preguntas bloqueantes para el dueño** (no se pueden calcular sin respuesta):
1. ~~¿En qué país vives y desde qué país cobrarás?~~ **Respondida:** Colombia, cobrando desde allí con Clerk Billing en USD. **Pendiente de verificar:** que Stripe permita abrir una cuenta de producción con Colombia como país (la lista de exclusión de Clerk Billing no incluye a Colombia, pero depende de Stripe). Limitaciones de Clerk Billing que aplican: sin impuestos, sin reembolsos desde Clerk, no es *merchant of record* y sin 3D Secure.
2. ~~¿Cuánto efectivo puedes poner antes del primer ingreso?~~ **Respondida:** ≈ 50 USD, sin colchón. Alcanza para la fase de validación (dominio y lista de espera), no para operar con cobro (≈ 28 a 43 USD/mes).
3. ~~¿El 30 % es antes o después de pagarte un sueldo?~~ **Aclarada:** el negocio debe cubrir operación, sueldos (dueño y trabajadores), devolver lo invertido y dar un 30 % de ganancia (ver "Economía"). Objetivo de sueldo: 2.000 USD/mes. **Falta:** el plazo, si el sueldo es bruto o neto, y cuántos trabajadores y a qué salario.
4. ¿Cuántos canales tiene el usuario medio al que entrevistes? **Se responde en las entrevistas.**

Pendiente de decidir a raíz de esto: ver "Preguntas abiertas" más abajo.

---

## 7. Criterios para pasar de etapa

| Paso | Debe cumplirse |
|---|---|
| **Etapa 0 → 1** | Auto-respuestas, reconexión de tokens y pruebas del núcleo hechas; flujo completo grabado en vídeo |
| **Etapa 1 → 2** | Revisión aprobada; dominio y Clerk en producción; URLs registradas en Meta y probadas con una llamada real |
| **Etapa 2 → 3** | Infraestructura en producción estable; cobro funcionando; al menos los primeros usuarios de pago o una validación clara de que no los habrá |

---

## 8. Nota: cambio de enfoque por ahora (2026-10-13)

Por decisión del dueño, **por ahora el enfoque cambia de monetizar a aprovechamiento personal**: usar la app en sus propias redes, aprender y mostrarla como portafolio.

- Todo lo escrito arriba (etapas, filtro, precio mínimo de 29 USD/mes, clientela mínima y evaluación de agentes) **se conserva sin cambios**, como referencia y por si se reactiva el enfoque comercial.
- Mientras dure este enfoque, las tareas de lanzamiento, cobro, revisión de plataformas y adquisición de clientes **no se priorizan**.
- Qué se construye en su lugar y en qué orden **se define a continuación**; esta nota solo deja constancia del cambio.

### Precisión del dueño (2026-10-13)
Aunque no se busque monetizar por ahora, la app se debe **tratar con la seriedad de un producto real y de pago**: incluir **todas las redes** previstas, con **métricas**, **edición** de posts y publicación en varias redes a la vez. El alcance exacto y el orden de las fases se definen a continuación.

### Alcance acordado (2026-10-13)
- **Redes, por ahora solo estas:** Instagram, YouTube, TikTok, Facebook, LinkedIn y Threads. Pinterest, Discord, Slack y X quedan fuera.
- **Edición:** antes de publicar.
- **Idea futura:** IA generativa o un servidor MCP para generar vídeo, y una función para "clipear" vídeos largos y publicarlos en YouTube. No entra en la primera ronda.
- **Fase A (cimientos multi-red):** diseño en [`plans/phase-a-multi-network.md`](plans/phase-a-multi-network.md).

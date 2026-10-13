# So-Pilot: análisis financiero (costos, economía por unidad, punto de equilibrio)

> Fecha: 2026-10-12. Revisa y reemplaza la sección 6 de `docs/ROADMAP.md` ("Economía").
> Alcance: solo números. No evalúa si el negocio es buena idea.

## 0. Cómo leer este documento

Etiquetas de cada cifra:

| Etiqueta | Significado |
|---|---|
| **[V]** | Dato que la búsqueda web atribuye a la página oficial del proveedor (o a un artículo escrito por el proveedor). Ojo: yo no pude abrir las páginas, solo vi resultados de búsqueda; confirmar en la página antes de pagar. |
| **[T]** | Dato de un tercero (blog, comparador, agregador). Puede estar desactualizado. |
| **[H]** | Hipótesis mía o del dueño. No hay fuente. Es un número para probar, no un hecho. |
| **[NV]** | No pude verificarlo. |

Regla para el resto del documento: todo lo que dependa de una [H] hereda esa incertidumbre. Casi todo lo que decide el resultado (conversión, abandono, adquisición, uso por usuario) es [H].

Moneda: USD. EUR a USD = 1,15 [H] (no verificado).

---

## 1. Costos identificados (precios actuales)

### 1.1 Servicios que ya usas

| Servicio | Qué dice la fuente | Etiqueta | Implicación para So-Pilot |
|---|---|---|---|
| **Vercel** | Hobby: solo uso personal y no comercial. Pro: 20 USD/mes por asiento que despliega, incluye 20 USD de crédito de uso (1 TB de ancho de banda, etc., según un agregador). Otro agregador cita 24 USD/mes si se paga mes a mes | [T] (varios agregadores; no vi la página oficial) | **Al cobrar, hay que pasar a Pro: 20 USD/mes fijos.** El ROADMAP no lo contaba. Mientras no cobres y no haya usuarios externos, Hobby sigue sirviendo |
| **Neon** | Free: 0,5 GB por proyecto, 100 CU-horas/mes, suspende al agotar. Launch: 0,106 USD por CU-hora, 0,35 USD por GB-mes, sin mínimo mensual según la página de precios (un doc antiguo dice mínimo 5 USD). Apaga el cómputo tras 5 min de inactividad | [V] (neon.com/pricing en la búsqueda) con un conflicto interno sobre el mínimo de 5 USD | **Riesgo propio del diseño:** el refresco automático cada 3 a 15 s y el worker mantienen la base despierta. 0,25 CU las 24 h = 182 CU-h/mes, más que las 100 del plan Free. Con uso real, Neon pasará a Launch: ≈ 19 USD/mes a 0,25 CU continuo [H sobre el patrón de actividad] |
| **Clerk (auth)** | Hobby gratis: 50.000 usuarios retenidos al mes (MRU). Pro: 25 USD/mes (20 USD si se paga anual). Esa franja de 50.000 MRU sustituyó a la de 10.000 el 5-feb-2026 | [V] Clerk lo dice en su artículo "Clerk pricing explained" y en pricing.md; [T] el resto | Costo 0 hasta 50.000 MRU. Pasar a Pro solo si necesitas algo que el plan gratis no da (verificar qué) |
| **Clerk Billing** | 0,7 % del volumen cobrado **encima** de las comisiones de Stripe. Incluido en todos los planes. Solo USD. Sin impuestos/IVA, sin reembolsos desde Clerk, sin pruebas gratuitas ("próximamente"). No disponible en Brasil, India, Malasia, México, Singapur ni Tailandia. Necesita cuenta de Stripe de producción aparte de la de desarrollo. Una fuente de terceros dice que 3D Secure no está soportado | 0,7 %: [T] (blog de Dodo Payments, competidor, no neutral). Limitaciones: [V] docs y changelog de Clerk en la búsqueda. 3DS: [NV] | **Bloqueante de decisión:** depende del país del dueño y del negocio (ver sección 9). Sin IVA ni pruebas gratuitas, hay que resolverlo fuera de Clerk |
| **ImageKit** | Free: 20 GB de ancho de banda/mes, 3 GB de almacenamiento, límite duro. Lite: ≈ 9 USD/mes anual (13 mes a mes según un comparador), 40 GB de ancho de banda, 10 GB, sobrecargo 0,50 USD/GB de ancho de banda y 0,10 USD/GB almacenado. Un comparador dice 20 GB en Lite | [T] (dev.to, freetier.co, smallpics.io, rfp.wiki); no vi imagekit.io/plans | El ancho de banda lo dispara el vídeo (hasta 25 MB por archivo). Medir antes de prometer vídeo en Free |
| **GitHub** | Gratis | [H] sin cambios | 0 |

### 1.2 Redis y worker siempre encendido (comparación de al menos 3 opciones)

El worker es un proceso Node siempre encendido (BullMQ). Redis guarda solo ids de post (poco volumen).

| Opción | Costo mensual | Límites / observaciones | Etiqueta |
|---|---|---|---|
| **A. Un VPS Hetzner (CX23 o CAX11 ARM)** con worker + Redis en Docker, como hoy | ≈ 5,99 a 6,49 EUR con IPv4, ≈ 6,9 a 7,5 USD [H por el tipo de cambio] | 2 vCPU, 4 GB, 40 GB. Hetzner subió precios en abril y junio de 2026 (las cifras difieren entre fuentes). Precios sin IVA. Regiones de EE. UU. ≈ 20 % más caras según una página antigua. Tú administras el servidor (actualizaciones, copias, monitorización) | [T] comparador de agosto 2026 (kimmo.suominen.com); no vi hetzner.com |
| **B. Fly.io** (worker) + Redis aparte | Máquina shared-cpu-1x 256 MB: 1,94 USD/mes (Ashburn), por segundo. RAM extra ≈ 5 USD por GB-mes, así que 512 MB ≈ 3,2 USD. Redis como segunda máquina ≈ 2 USD, o Upstash/Redis Cloud | Facturación por segundo; IPv4, volúmenes y tráfico aparte. Las páginas dan cifras algo distintas (1,94 a 2,19 USD). Nivel gratuito vigente: **[NV]**, no lo encontré | [V] fly.io/pricing en la búsqueda; el cálculo de 512 MB es mío [H] |
| **C. Railway** (worker + Redis como servicios) | Hobby: 5 USD/mes que incluyen 5 USD de uso. Tarifas de uso reportadas: ≈ 20 USD por vCPU-mes y 10 USD por GB de RAM-mes. Un worker de 512 MB casi inactivo + Redis de 256 MB ≈ 7 a 9 USD de uso | La factura es el mayor entre 5 USD y el uso. Tarifas por unidad: no oficiales | Plan: [V] docs.railway.com; tarifas: [T]; estimación [H] |
| **D. Render** | Worker en segundo plano: Starter 7 USD/mes (512 MB, 0,5 CPU). Key Value (Redis): gratis con 25 MB; de pago desde 10 USD | Los servicios web gratis se duermen a los 15 min, **no sirven para un worker**. Una fuente dice que los workers no tienen nivel gratuito. Posible cargo de workspace: [NV] | [T] |
| **E. Redis gestionado gratis** (solo la parte Redis) | Upstash: 500.000 comandos/mes gratis, luego 0,20 USD por 100.000; plan fijo desde 10 USD. Redis Cloud: 30 MB gratis, 30 conexiones, 100 ops/s, 5 GB/mes, sin réplica; 250 MB ≈ 5 USD/mes | BullMQ en reposo consulta Redis sin parar: con el valor por defecto puede agotar los 500.000 comandos de Upstash; hay que subir `drainDelay`/`stalledInterval` y medir. BullMQ pide `maxmemory-policy noeviction`: **[NV] si Redis Cloud free y Upstash lo permiten** | Upstash: [V]; Redis Cloud: [V] docs de Redis, precio 5 USD [T]; consumo BullMQ [H] |

**Conclusión de costos de esta pieza:** no encontré una opción gratuita verificada para el worker siempre encendido. Para Redis sí hay niveles gratuitos, con riesgos (límites de comandos, persistencia y política de expulsión sin verificar). **Supuesto central del modelo: 7 USD/mes por worker + Redis (rango 5 a 12) [H].**

Alternativa que elimina esta pieza (no la he verificado): un cron de Vercel que, cada minuto, publique desde Neon los posts vencidos. Pro ya lo pagas y quitarías Redis, el worker y su operación. Hay que comprobar los límites de frecuencia y duración de los crons de Vercel **[NV]**. Contradice la decisión actual de usar BullMQ (PROJECT.md, sección 12), así que es una decisión de arquitectura, no solo de costo.

### 1.3 Otros costos

| Concepto | Valor | Etiqueta |
|---|---|---|
| **Dominio .com** | ≈ 10,46 USD/año (≈ 0,87 USD/mes), Cloudflare Registrar a precio de costo | [T] agregador domainoffer.net; no vi la página de Cloudflare |
| **Stripe** | 2,9 % + 0,30 USD por cobro con tarjeta doméstica. Tarjetas internacionales: +1,5 %. Conversión de moneda: +1 % | [T] (NerdWallet, flexprice); no vi stripe.com. Varía por país |
| **Stripe Billing** (producto distinto) | 0,7 % del volumen. **No** se suma si usas Clerk Billing (Clerk dice que no sincroniza con Stripe Billing) | [T] |
| **Clerk Billing** | +0,7 % | [T] |
| **Comisión efectiva por cobro (ver 3.2)** | doméstico 3,6 % + 0,30 USD; internacional 5,1 % + 0,30 USD; con conversión 6,1 % + 0,30 USD | Suma de las anteriores |
| **IVA / impuestos de venta** | Clerk Billing no los soporta y no es comerciante de registro (merchant of record). Obligación fiscal y costo contable: **[NV]**, depende del país | [V] docs de Clerk; resto [NV] |
| **Alternativa merchant of record** (Paddle, Lemon Squeezy, Dodo, etc.) | Suelen cobrar ≈ 5 % + 0,50 USD y gestionan el IVA. **No lo verifiqué** | [NV] |
| **Monitorización, correo transaccional, contabilidad, soporte** | 15 USD/mes agrupados | [H] (hay niveles gratis; el precio real depende de herramientas que no elegiste) |
| **API de Meta (Threads/Instagram), LinkedIn** | Sin cargo por uso identificado en esta búsqueda. Límite verificado de Threads: 250 posts publicados por API cada 24 h por perfil. Límite de 1.000 respuestas/24 h: solo fuentes de terceros | [V] documentación de Meta (250 posts); [T] (1.000 respuestas) |

### 1.4 API de Anthropic: costo por comentario con IA

| Dato | Valor | Etiqueta |
|---|---|---|
| Claude Haiku 4.5 | 1 USD por millón de tokens de entrada, 5 USD por millón de salida. Caché de lectura 0,10 USD/M; batch -50 % | [V] platform.claude.com/docs/en/about-claude/pricing (según la búsqueda) |
| Modelos más nuevos que Haiku 4.5 | **[NV]**: no consulté si existen versiones nuevas con otro precio |
| Tokens por respuesta (prompt de sistema + post + comentario + estilo del usuario) | ≈ 400 de entrada y ≈ 60 de salida | [H] |
| **Costo por comentario** | 400 × 1 USD/1M + 60 × 5 USD/1M = 0,0004 + 0,0003 = **≈ 0,0007 USD**. Con una llamada extra de clasificación/moderación: **≈ 0,0014 USD**. Rango: 0,0007 a 0,002 USD | [H] cálculo sobre precio [V] |
| 1.000 respuestas con IA | ≈ 0,7 a 2 USD | [H] |
| 300 respuestas con IA al mes por usuario Premium | ≈ 0,2 a 0,6 USD | [H] |

La IA es barata por comentario; el riesgo de costo es un usuario con miles de comentarios o un bucle de respuestas. Se controla con tope mensual por plan (ver sección 6). La respuesta por palabras clave no usa Anthropic: su costo es de llamadas a la API de Meta y de cómputo, que no pude estimar con datos **[NV]**.

---

## 2. Costo de lanzamiento (único) y costo fijo mensual por escala

### 2.1 Costo único

| Concepto | USD | Etiqueta |
|---|---|---|
| Dominio, primer año | ≈ 10 a 11 | [T] |
| Instancia de producción de Clerk, cuenta de Stripe de producción, política de privacidad y términos (ya escritos en borrador) | 0 | [V]/[H]: no vi cargos; Clerk Pro no es obligatorio según lo que encontré |
| Verificación de negocio de Meta / entidad legal para LinkedIn Community Management API | **[NV]**: no hay cargo directo de las plataformas que haya encontrado, pero pueden exigir una empresa registrada (costo depende del país) | [NV] |
| Revisión legal profesional de textos (opcional) | **[NV]** | [NV] |
| **Colchón recomendado** antes del primer ingreso: 2 a 3 meses de costo fijo (ver abajo) | ≈ 85 a 130 | [H] |

Costo de lanzamiento en efectivo: **≈ 10 a 15 USD** sin empresa ni abogado, o **≈ 100 a 145 USD** con colchón. Con presupuesto cero, el colchón sale de tu bolsillo o de un ingreso externo: **es el supuesto más débil de "costo cero hasta tener ingresos"**. El costo real de lanzar es tiempo: verificación y revisión de Meta (días a semanas, con rechazo posible, según PROJECT.md) y desarrollo pendiente.

### 2.2 Costo mensual por escala (en efectivo, sin sueldo, sin comisiones de pago)

"Usuario activo" = cuenta con al menos una red conectada y actividad en el mes (pagos y gratuitos).

| Concepto | Hoy (uso personal) | Lanzado, 0 a 20 activos | 100 activos | 1.000 activos | Etiqueta |
|---|---|---|---|---|---|
| Vercel | 0 (Hobby) | 20 (Pro) | 20 | 30 (Pro + ≈ 10 de excedente) | [T] / [H] |
| Neon | 0 | 0 | 10 (0 a 19) | 40 (20 a 80) | [H] sobre [V] de precios |
| Clerk | 0 | 0 | 0 | 0 (25 si hace falta Pro) | [V] / [NV] qué exige Pro |
| ImageKit | 0 | 0 | 0 (cabe en Free si se borra la media) | 40 (Lite 9 + ≈ 60 GB de excedente a 0,5) | [H] sobre [T] |
| Worker + Redis | 0 (local) | 7 | 7 | 15 (VPS + Redis gestionado) | [H] |
| Dominio | 0 | 0,87 | 0,87 | 0,87 | [T] |
| Monitorización, correo, contabilidad | 0 | 15 | 15 | 15 | [H] |
| **Total** | **0** | **≈ 43** | **≈ 53** | **≈ 141** | |
| Rango plausible | | 28 a 60 | 40 a 70 | 90 a 230 | [H] |

Aproximación lineal usada en el modelo: **43 USD fijos + ≈ 0,10 USD por usuario activo** [H], que reparto en 0,08 USD por usuario gratuito y 0,30 USD por usuario de pago (incluye IA, vídeo y más publicaciones) [H].

Consecuencia que el ROADMAP no veía: **un cliente de pago arrastra a sus usuarios gratuitos**. Si pagan el 4 % de los activos, cada pagador lleva 24 gratuitos: 24 × 0,08 = 1,92 USD de infraestructura gratuita por pagador.

---

## 3. Unit economics

### 3.1 Definición explícita de "margen neto de 30 %"

Propuesta (A), la que uso en todo el modelo:

> **Margen neto = (ingresos brutos cobrados − comisiones de pago (Stripe + Clerk) − reembolsos y disputas − infraestructura y servicios (fijos y variables, incluidos usuarios gratuitos e IA) − costo de adquisición pagado − otros costos fijos) / ingresos brutos.**
> **No descuenta:** el sueldo ni el tiempo del dueño, el impuesto sobre la renta, ni IVA/impuestos de venta.

Con esta definición el margen neto es exactamente lo que queda para el dueño antes de impuestos. Dos consecuencias:

1. El 30 % es un **piso de eficiencia**, no el objetivo de ingresos. Con adquisición orgánica y 9 USD se supera el 30 % desde ≈ 14 pagadores; para ganar 500 USD/mes hacen falta ≈ 91, con margen ≈ 61 %.
2. El 30 % solo "muerde" cuando pagas publicidad (ver 5.3).

Definición alternativa (B), por si "margen neto" significa después de pagarte un sueldo: el sueldo es un costo. Con un sueldo de 1.000 USD/mes y 9 USD/mes, hacen falta **≈ 318 pagadores** (ingresos ≈ 2.860 USD) [H]. Elige A o B explícitamente; el resultado cambia por un factor de ≈ 3,5.

### 3.2 Comisiones por cobro (verificables con las tarifas de 1.3)

| Precio | Doméstico (3,6 % + 0,30) | Internacional (5,1 % + 0,30) | Internacional + conversión (6,1 % + 0,30) | **Mezcla usada: 4,5 % + 0,30** [H: 60 % internacional] |
|---|---|---|---|---|
| 5 USD | 0,48 (9,6 %) | 0,555 (11,1 %) | 0,605 (12,1 %) | **0,525 (10,5 %)** |
| 9 USD | 0,624 (6,9 %) | 0,759 (8,4 %) | 0,849 (9,4 %) | **0,705 (7,8 %)** |
| 12 USD | 0,732 (6,1 %) | 0,912 (7,6 %) | 1,032 (8,6 %) | **0,84 (7,0 %)** |
| 15 USD | 0,84 (5,6 %) | 1,065 (7,1 %) | 1,215 (8,1 %) | **0,975 (6,5 %)** |

El ROADMAP usaba 0,62 USD (solo tarjeta doméstica). Con clientes de América Latina y España pagando a una cuenta de Stripe en otro país, 0,70 a 0,85 USD es más realista. El cargo fijo de 0,30 USD castiga el precio de 5 USD. Cobrar por año reduce las comisiones a la mitad aproximadamente (90 USD/año: ≈ 4,35 USD frente a ≈ 8,5 USD en 12 cobros mensuales). Clerk Billing soporta planes anuales [V].

### 3.3 Margen de contribución por cliente de pago y mes

Supuestos fijos de esta tabla: conversión de activos a pago 4 % (así hay 24 gratuitos por pagador) [H]; costo gratuito 0,08 USD; costo de pagador 0,30 USD [H]; reserva por reembolsos/disputas 1 % de ingresos [H].

| Concepto | 5 USD/mes | 9 USD/mes | 12 USD/mes | 15 USD/mes | Por canal: 4 USD x 2,5 canales = 10 USD |
|---|---|---|---|---|---|
| Ingreso | 5,00 | 9,00 | 12,00 | 15,00 | 10,00 |
| Comisiones (mezcla) | -0,525 | -0,705 | -0,84 | -0,975 | -0,75 |
| Reserva reembolsos 1 % | -0,05 | -0,09 | -0,12 | -0,15 | -0,10 |
| Infraestructura del pagador | -0,30 | -0,30 | -0,30 | -0,30 | -0,45 (0,10 por canal extra) |
| Carga de 24 gratuitos | -1,92 | -1,92 | -1,92 | -1,92 | -1,92 |
| **Contribución** | **2,205** | **5,985** | **8,82** | **11,655** | **6,78** |
| % del ingreso | 44 % | 67 % | 74 % | 78 % | 68 % |

Sensibilidad de la contribución de 9 USD al porcentaje de pagadores (que fija cuántos gratuitos hay por pagador): 2 % de conversión (49 gratuitos): 3,985 USD; 4 %: 5,985; 8 % (11,5 gratuitos): 6,985 [H].

### 3.4 LTV y CAC (muy especulativos en etapa temprana)

LTV = contribución mensual / abandono mensual (sin descuento, sin expansión). **Es un cálculo sobre hipótesis de abandono; la primera cohorte real puede cambiarlo por completo.** El abandono de 3 a 7 % mensual en SMB y 4,79 % medio en SaaS vienen de blogs sin metodología [T]; no encontré benchmark de schedulers de redes.

| Precio | Vida media (4 / 8 / 12 %) | LTV a 4 % | LTV a 8 % | LTV a 12 % |
|---|---|---|---|---|
| 5 USD | 25 / 12,5 / 8,3 meses | 55 | 28 | 18 |
| 9 USD | 25 / 12,5 / 8,3 meses | 150 | 75 | 50 |
| 12 USD | | 221 | 110 | 74 |
| 15 USD | | 291 | 146 | 97 |
| Por canal (10 USD ARPU) | | 170 | 85 | 57 |

**CAC máximo para conservar 30 % de margen en la vida del cliente** (definición A, sin asignar costos fijos): CAC máx = (contribución − 0,30 × precio) / abandono.

| Precio | a 4 % | a 8 % | a 12 % |
|---|---|---|---|
| 5 USD | 17,6 | 8,8 | 5,9 |
| 9 USD | 82 | 41 | 27 |
| 12 USD | 130 | 65 | 43 |
| 15 USD | 179 | 89 | 60 |

(El ROADMAP daba 65 USD para 9 USD y 8 %. Con mis supuestos, 41 USD: incluye los gratuitos y comisiones internacionales.)

**CAC realista (no hay dato):**
- Orgánico: 0 USD en efectivo. Cuesta horas del dueño y es lento. [H]
- Pago: 30 a 60 USD por cliente de pago [H], sin fuente verificada. Un cliente de 9 USD con abandono de 8 % admite 41 USD como máximo para 30 %; **a 60 USD no se llega al 30 % con ningún abandono razonable**.

---

## 4. Escenarios de pricing

| Escenario | Estructura | Razonamiento | Riesgo |
|---|---|---|---|
| **Conservador: 5 USD/mes plano** | Premium 5 USD, mismo Free | Se acerca al precio por canal de Buffer (5 a 6 USD) [T] | Comisión de 10,5 %; contribución 2,2 USD; exige **474 pagadores** para 1.000 USD/mes; no tolera ningún CAC pagado. No lo recomiendo salvo que Free quede muy recortado |
| **Base: 9 USD/mes plano** (hipótesis del dueño) | Premium 9 USD, tope de canales | Competidor con 2 canales cuesta 12 USD/mes en Buffer mensual [T]. El plano es más barato desde 2 canales | 175 pagadores para 1.000 USD/mes. Margen sensible al abandono y a los gratuitos |
| **Alternativo: 12 USD/mes plano** (interpolación mía, no pedida) | Premium 12 USD | Contribución 8,8 USD; punto de equilibrio con 5 pagadores | Sin evidencia de disposición a pagar; más difícil frente a un Buffer gratis con 3 canales |
| **Optimista: 15 USD/mes plano** | Premium 15 USD | Contribución 11,7 USD; 90 pagadores para 1.000 USD/mes; admite CAC pagado de 30 a 60 USD | Mayor fricción de conversión; competir con herramientas establecidas por un producto nuevo y sin aprobar |
| **Por canal: 4 USD/canal/mes** (alternativa pedida) | Cada canal conectado cuesta 4 USD; ARPU supuesto 2,5 canales = 10 USD [H] | Buffer cobra 5 a 6 USD por canal [T]; 4 USD lo bate y escala con el uso | ARPU depende del número de canales por usuario [H]. Más complejidad de cobro: Clerk Billing hoy solo ofrece planes; "por asiento/uso" aparece como "próximamente" según un tercero [NV] |

**Competencia:** Buffer Free = 3 canales y 10 posts en cola por canal. Essentials: 6 USD/canal/mes mensual, 5 USD anual; volumen: 4 USD (canales 11 a 25) [T] (NapoleonCat, ago-2026). El plan gratuito de Buffer fija el techo de lo que un usuario individual considera "gratis"; el pago debe justificarse con lo que Buffer no ofrece (auto-respuestas, español, números).

---

## 5. Punto de equilibrio

Fórmulas: N_equilibrio = F / contribución, con F = 43 USD [H]. N para ganar G al mes = (G + F) / (contribución − abandono × CAC) con adquisición pagada de reposición; con adquisición orgánica, CAC = 0. Antes de impuestos y sin sueldo (definición A).

### 5.1 Clientes de pago necesarios, adquisición orgánica (CAC = 0), conversión 4 %

| Escenario | Equilibrio de caja | 30 % de margen | Ganancia 500 USD/mes | 1.000 USD/mes | 2.000 USD/mes |
|---|---|---|---|---|---|
| 5 USD | 20 | 61 | 247 | 474 | 927 |
| 9 USD | 8 | 14 | 91 | 175 | 342 |
| 12 USD | 5 | 9 | 62 | 119 | 232 |
| 15 USD | 4 | 7 | 47 | 90 | 176 |
| Por canal (10 USD ARPU) | 7 | 11 | 81 | 154 | 302 |

Usuarios **activos totales** necesarios a 9 USD (pagadores / conversión), con conversión 4 %: 91 pagadores = ≈ 2.280 activos; 175 = ≈ 4.375; 342 = ≈ 8.550. Con conversión 2 %, el doble; con 8 %, la mitad. A 1.000 usuarios activos y 4 % de pago (40 pagadores a 9 USD), la ganancia es ≈ 190 a 200 USD/mes [H]. **No es 500.**

### 5.2 Efecto del abandono en la ganancia estable (ingresos orgánicos constantes)

N estable = altas nuevas de pago por mes / abandono mensual. Ejemplo a 9 USD con 15 altas de pago/mes:

| Abandono | N estable | Ganancia estable (9 USD) | Meses para 500 USD (91 pag.) | Meses para 1.000 USD (175 pag.) | Meses para 2.000 USD (342 pag.) |
|---|---|---|---|---|---|
| 4 % | 375 | ≈ 2.200 USD | 6,8 | 15 | 60 |
| 8 % | 187 | ≈ 1.080 USD | 8 | 32 | nunca (N máx. 187) |
| 12 % | 125 | ≈ 700 USD | 10 | nunca (N máx. 125) | nunca |

(Meses contados desde el lanzamiento, altas constantes desde el mes 1. Es un caso optimista; ver 5.4.)

### 5.3 Con adquisición pagada (reposición de abandono a 8 %, 9 USD)

| CAC | Contribución neta por cliente-mes | Pagadores para 500 | 1.000 | 2.000 | ¿Alcanza 30 % de margen? |
|---|---|---|---|---|---|
| 0 | 5,985 | 91 | 175 | 342 | Sí, desde 14 pagadores |
| 30 USD | 3,585 | 152 | 291 | 570 | Sí, desde 49 |
| 60 USD | 1,185 | 458 | 880 | 1.724 | **No, en ningún tamaño** |

A 15 USD con CAC 30: 59 / 113 / 221 pagadores. Con CAC 60: 80 / 153 / 299. A 5 USD con CAC 30 USD y 8 % de abandono: **imposible** (contribución negativa). Es solo reposición; el crecimiento neto cuesta más.

### 5.4 Cuánto tiempo tardaría con adquisición orgánica (estimación honesta)

**Supuestos [H], ninguno medido:**

| Supuesto | Valor |
|---|---|
| Altas (registros) orgánicas al lanzar | 60 por mes, creciendo 8 % mensual (contenido, SEO, publicaciones propias en Threads) |
| Registro a pago | 3 % |
| Abandono | 8 % |
| Precio | 9 USD |
| Antes del lanzamiento | Desarrollo pendiente + revisión de Meta + infraestructura: **no lo estimo; lo conoces tú mejor** |

**Resultado del modelo (iteración mes a mes):**

| Meta | Pagadores | Meses desde el lanzamiento |
|---|---|---|
| Equilibrio (43 USD) | 8 | ≈ 14 |
| 500 USD/mes | 91 | ≈ 28 |
| 1.000 USD/mes | 175 | ≈ 36 |
| 2.000 USD/mes | 342 | ≈ 48 o más; exige que los registros mensuales lleguen a miles, poco creíble |

Lectura crítica:

- Mantener un crecimiento orgánico de 8 % mensual durante 2 o 3 años ya es optimista. Con **altas planas** (60 registros × 3 % = 1,8 pagadores/mes) el máximo es 22 pagadores (≈ 90 USD/mes de ganancia): no se llega a 500 USD.
- Para 500 USD en ≈ 1 año hace falta del orden de **15 nuevos pagadores/mes constantes**: ≈ 300 registros/mes al 5 % o ≈ 500 al 3 %. Eso es mucho para un solo canal orgánico de un desarrollador en solitario, sin marca previa.
- Escenario pesimista: 40 registros/mes con 1,5 % de pago, altas de 0,6 pagadores/mes, N estable de 7 a 8 (≈ 0 USD de ganancia). El producto cubre su infraestructura, no el sueldo.
- Total realista para llegar a 500 USD/mes: **pre-lanzamiento (meses, a determinar) + 1 a 3 años**, con probabilidad no despreciable de no llegar sin una palanca de crecimiento (nicho claro, canal de distribución, o precio más alto). Sin datos propios, no puedo reducir ese rango.

---

## 6. Límites del plan Free y Premium: qué proteger por costo y qué por valor

### 6.1 Qué cuesta dinero (y qué no)

| Recurso | Costo marginal | Qué lo dispara | Control recomendado |
|---|---|---|---|
| **Respuestas con IA** | 0,0007 a 0,002 USD por comentario [H sobre V] | Volumen de comentarios; bucles | Solo Premium; tope mensual (p. ej. 300); apagar si el usuario no tiene crédito |
| **Vídeo y archivos grandes** | ImageKit: 0,50 USD/GB de ancho de banda y 0,10 USD/GB almacenado tras Lite [T] | Archivos de 25 MB, retención | Free: solo imagen o vídeo corto; **borrar la media tras publicar** (retención 30 días); límite de peso por plan |
| **Cuentas/canales conectados** | Cómputo de sondeo de comentarios, renovación de tokens, llamadas a la API | Número de canales activos | Es también un límite de valor (Buffer: 3 gratis) |
| **Sondeo de comentarios** (auto-respuestas) | Cómputo y cuota de API; hoy sin webhooks (requieren app en Live, según ROADMAP) | Frecuencia de sondeo × cuentas | Free: frecuencia menor (p. ej. cada 15 min); Premium: más frecuente |
| **Cola programada** | Casi 0 (ids en Redis) | Nada relevante | Límite de valor, no de costo |
| **Analítica histórica** | Almacenamiento y llamadas | Historial largo, muchas cuentas | Free: 7 a 30 días; Premium: 90 días |
| **Sondeo del panel (refresco cada 3 y 15 s)** | Mantiene Neon despierto y consume funciones de Vercel [H] | Pestañas abiertas | Bajar la frecuencia o sondear solo cerca de la hora programada (PROJECT.md ya lo anota) |

### 6.2 Propuesta de límites [H, para validar con usuarios]

| Dimensión | Free | Premium (9 a 12 USD) | Razón |
|---|---|---|---|
| Canales | 2 | 5 (extra: +3 USD cada uno) | Buffer da 3 gratis; el costo por canal es bajo, pero el plano sin tope no es sostenible [H] |
| Posts en cola | 10 en total | 100 | Valor: Buffer da 10 por canal; ser más estricto aquí cuesta poco en costo y protege conversión |
| Publicaciones a la vez en varias redes | 1 red por post | Todas | Es la propuesta de valor del mercado objetivo; razón para pagar |
| Reglas de auto-respuesta | 1 regla, 30 respuestas/mes | 20 reglas, 1.000 respuestas/mes | Es el diferenciador: Free debe dejarlo probar, no usarlo a escala |
| Respuestas con IA | 0 | 200 a 300 al mes | Costo variable directo |
| Vídeo | No o 1 por semana | Sí, tope de peso | Mayor costo de ImageKit |
| Analítica | 7 días | 90 días | Valor: "ver sus números" es la promesa del producto, no un extra |
| Historial / importar posts antiguos | Últimos 30 días | Completo | Costo de API y almacenamiento |

El **Free** es el mayor riesgo financiero del modelo: con 4 % de conversión, cada pagador trae 24 gratuitos. Cada 0,04 USD de costo mensual por gratuito mueve el costo del pagador en ≈ 1 USD. Hay que medir el costo real de un gratuito antes de decidir la generosidad.

---

## 7. Recomendación de precio y estructura

1. **Precio plano mensual, con tope de canales, no por canal.** Es simple (público objetivo: gente a la que le cuesta gestionar redes), da cobro único (menos comisión fija) y comparado con Buffer gana desde el segundo canal. Un precio por canal sube ARPU solo si el usuario medio tiene varios canales **[H]**, y Clerk Billing hoy lo hace torpe.
2. **Precio de partida: 9 USD/mes como mínimo.** No bajar a 5 USD: exige 474 pagadores para 1.000 USD/mes y no tolera ningún CAC. **Probar 12 a 15 USD** en la lista de espera y en las 5 a 10 entrevistas (disposición a pagar). Con 15 USD basta con 90 pagadores para 1.000 USD/mes.
3. **Anual a 10 meses (≈ 90 a 100 USD)**: reduce comisiones a la mitad y amarra el abandono. Clerk Billing soporta anual [V].
4. **Free limitado según 6.2.** Revisar de forma trimestral con el costo real por gratuito.
5. **Antes de cobrar, resolver tres bloqueos [NV]:** país de la cuenta de Stripe y compatibilidad con Clerk Billing (el país del dueño puede estar excluido), IVA/impuestos de venta (Clerk no los gestiona), y pruebas gratuitas/reembolsos (Clerk no los soporta; hay que usar el panel de Stripe). Compara con un merchant of record **[NV]** si el IVA te cuesta más tiempo que 5 %.
6. **No pagar publicidad** mientras el CAC no esté medido: a 9 USD solo hay holgura hasta ≈ 41 USD por cliente (con 8 % de abandono) y es fácil superarla.

---

## 8. Las 3 variables más sensibles

Base: 9 USD, abandono 8 %, conversión 4 %, costo gratuito 0,08 USD, CAC 0. Resultado medido: pagadores necesarios para 1.000 USD/mes (base = 175).

| # | Variable | Rango probado | Efecto | Por qué importa |
|---|---|---|---|---|
| **1** | **Volumen de altas de pago por mes (registros × conversión) y su costo** | 0,6 / 3,6 / 15 altas/mes | Desde "nunca llega a 500 USD" hasta "500 USD en ≈ 8 meses". CAC de 0 a 60 USD: pagadores para 1.000 USD de 175 a 880 | Es la variable menos conocida y la que más pesa. **Todo el negocio es una apuesta sobre ella**; el resto del modelo es aritmética |
| **2** | **Precio efectivo (ARPU)** | 5 / 9 / 12 / 15 USD | 474 / 175 / 119 / 90 pagadores | Una sola decisión de pricing divide por cinco el trabajo de adquisición. Pero sube la fricción de conversión (efecto en variable 1, no medido) |
| **3** | **Abandono mensual** | 4 / 8 / 12 % | Con 15 altas/mes: ganancia estable de 2.200 / 1.080 / 700 USD; para 2.000 USD de ganancia, solo alcanzable con 4 % | Define el techo de clientes y el CAC admisible (LTV 150 / 75 / 50 USD) |

Observadas pero de menor peso: **conversión gratuito a pago y costo por gratuito** (de 149 a 262 pagadores para 1.000 USD, si pasan de 8 % a 2 %); comisión internacional (± 0,15 USD por cobro); precio de Neon/ImageKit (± 50 USD fijos a 1.000 activos).

---

## 9. Supuestos que necesitan validarse

| # | Supuesto | Valor usado | Etiqueta | Cómo confirmarlo |
|---|---|---|---|---|
| 1 | Vercel Pro obligatorio al cobrar, 20 USD | 20 USD/mes | [T] | vercel.com/pricing y términos de uso comercial de Hobby |
| 2 | Clerk gratis hasta 50.000 MRU y Billing sin cuota mensual | 0 USD + 0,7 % | [V] parcial / [T] | clerk.com/pricing, clerk.com/docs/billing |
| 3 | País del dueño y de Stripe compatible con Clerk Billing; moneda solo USD | Supuesto | [NV] **crítico** | Preguntar al dueño; revisar el FAQ de Clerk Billing |
| 4 | IVA/impuestos de venta | 0 en el modelo | [NV] | Contador o merchant of record |
| 5 | Worker + Redis | 7 USD/mes | [H] | Prueba real: desplegar el worker 2 semanas y leer la factura; medir comandos de Redis |
| 6 | Neon: cuántas CU-horas consume el sondeo real | 10 a 40 USD/mes a 100 a 1.000 activos | [H] | Panel de Neon con tráfico de beta |
| 7 | ImageKit: ancho de banda por usuario | 100 MB/mes | [H] | Panel de ImageKit en beta; decidir si se borra la media |
| 8 | Costo por usuario gratuito y por pagador | 0,08 / 0,30 USD | [H] | Dividir factura total entre usuarios activos tras 2 meses de beta |
| 9 | Tokens por respuesta con IA | 400 de entrada, 60 de salida | [H] | Registrar `usage` de la API en beta |
| 10 | Precio de Anthropic | Haiku 4.5 a 1 y 5 USD/M | [V] | platform.claude.com/docs/en/about-claude/pricing |
| 11 | Conversión de activos a pago | 4 % (2 a 8 %) | [H] | Lista de espera + beta |
| 12 | Abandono | 8 % (4 a 12 %) | [H] | Cohortes reales de 3 meses |
| 13 | Altas orgánicas, conversión de registro a pago | 60/mes, 3 % | [H] | Medir en la lista de espera y landing |
| 14 | CAC pagado | 30 a 60 USD | [H] sin fuente | Prueba de 100 a 200 USD en anuncios y medir |
| 15 | Mezcla internacional de tarjetas | 60 % | [H] | Mercado objetivo; Stripe Dashboard |
| 16 | Costo de empresa/verificación para Meta y LinkedIn | No incluido | [NV] | Requisitos de verificación de negocio en tu país |
| 17 | Tipo de cambio EUR/USD | 1,15 | [H] | Cotización actual |
| 18 | Aprobación de Meta (Live) y permisos | Se asume que llega | **Riesgo no financiero con impacto total**: sin Live, el modelo no tiene clientes | App Review |
| 19 | Disposición a pagar 9 USD frente a un Buffer gratis | Supuesto | [H] | 5 a 10 entrevistas; precio mostrado en landing |

### Preguntas que bloquean cálculos

1. **¿En qué país vives y desde dónde cobrarás (cuenta de Stripe)?** Define si Clerk Billing es posible, comisión internacional, impuestos y registro de empresa.
2. **¿Cuánto efectivo puedes poner antes del primer ingreso?** Con "cero presupuesto" no se puede pagar Vercel Pro (20 USD) ni el worker (≈ 7 USD) al lanzar. Son ≈ 28 a 43 USD/mes.
3. **¿Tu "30 % de margen neto" es A (antes de sueldo) o B (después de sueldo)?** Cambia la meta de pagadores de 91 a ≈ 318 para el mismo sueldo.
4. **¿Cuántos canales tiene el usuario medio que entrevistaste?** Decide plano frente a por canal.

---

## 10. Correcciones a la sección 6 del ROADMAP

| ROADMAP | Problema | Corrección |
|---|---|---|
| Costos fijos ≈ 20 USD (servidor del worker, Redis, dominio) | Omite Vercel Pro (20 USD) y monitorización | ≈ 43 USD con Vercel Pro (28 sin herramientas) |
| Costo variable 0,50 USD por usuario | Mezcla gratuitos y pagadores; ignora que los gratuitos escalan con el pagador | 0,08 por gratuito y 0,30 por pagador, con 24 gratuitos por pagador al 4 %: ≈ 2,2 USD por pagador |
| Comisión 0,62 USD (doméstica) | No cuenta tarjetas internacionales | 0,70 a 0,85 USD |
| 4 clientes cubren fijos con 30 % | Fijos subestimados | 8 para equilibrio, 14 para 30 % (9 USD, 4 % conversión) |
| CAC máximo 65 USD | Sin gratuitos ni comisión internacional | ≈ 41 USD (8 % de abandono) |
| No menciona límites de Clerk Billing | USD, sin IVA, sin pruebas gratuitas, países excluidos | Ver sección 1.1 y preguntas bloqueantes |

---

## Fuentes

Búsqueda web (no pude abrir las páginas; los datos son los que muestran los resultados de búsqueda):

- Vercel: https://schematichq.com/blog/vercel-pricing , https://www.vendr.com/marketplace/vercel , https://benchlm.ai/vercel/pricing
- Neon: https://neon.com/pricing , https://neon.com/docs/introduction/plans , https://neon.com/faqs/postgres-services-no-minimum-charge
- Clerk: https://clerk.com/pricing.md , https://clerk.com/articles/clerk-pricing-explained , https://clerk.com/blog/new-pricing-plans
- Clerk Billing: https://clerk.com/docs/billing/overview , https://clerk.com/changelog/2025-05-13-billing-global-support , https://dodopayments.com/blogs/clerk-billing
- ImageKit: https://freetier.co/directory/products/imagekitio , https://dev.to/devtoolpicks/best-cloudinary-alternatives-for-indie-hackers-in-2026-cheaper-image-cdns-58cp , https://www.smallpics.io/compare/imagekit
- Redis/Upstash: https://upstash.com/pricing/redis , https://upstash.com/blog/redis-cloud-pricing-in-2026-plans-costs-and-real-examples , https://docs.redis.io/docs/latest/operate/rc/subscriptions/view-essentials-subscription/essentials-plan-details , https://docs.bullmq.io/api/interfaces/v6.WorkerOptions.html , https://upstash.com/examples/usingbullwithupstash
- Worker: https://fly.io/pricing.md , https://docs.railway.com/pricing/plans.md , https://render.com/pricing , https://kimmo.suominen.com/stuff/cpc-2026-08.txt , https://privatedevops.com/news/hetzner-june-2026-cloud-price-increase-what-to-do
- Stripe: https://flexprice.io/blog/stripe-pricing-breakdown-2026 , https://www.nerdwallet.com/business/software/learn/stripe-fees
- Anthropic: https://platform.claude.com/docs/en/about-claude/pricing
- Dominio: https://domainoffer.net/tld/com.co/cloudflare (agregador; precio .com ≈ 10,46 USD)
- Buffer: https://napoleoncat.com/blog/buffer-pricing/ , https://www.temperstack.com/plans/buffer/
- Threads API (límites): https://developers.facebook.com/docs/threads/overview , https://help.metricool.com/en/article/daily-posting-limits-on-social-media-kcqb91
- Conversión y abandono (genéricos, no específicos de la categoría): https://databox.com/freemium-conversion-rate , https://adamfard.com/blog/saas-churn-rate-benchmark

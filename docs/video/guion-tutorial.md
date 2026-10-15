# Guion: tutorial de So-Pilot

> Borrador. Muestra **solo lo que funciona hoy** (Threads, publicar, programar, calendario y listado). Las demás redes se mencionan como "próximamente" y no se muestran en acción.
> Duración objetivo: 25 a 30 minutos. Dividido en capítulos para poder publicarlos por separado.
> Público: programadores que quieren construir un SaaS con Next.js, Clerk, Neon y BullMQ.

---

## Capítulo 0. Presentación (1 min)

**En pantalla:** la landing de So-Pilot.

**Narración:**
> "So-Pilot es una aplicación para escribir, programar y publicar en redes sociales desde un solo lugar. En este tutorial vas a construirla paso a paso, y vas a ver cómo se conectan la autenticación, la base de datos, las colas de tareas y las APIs de redes sociales. Al final tendrás un proyecto que puedes mostrar en tu portafolio."

**Mensaje clave:** el tutorial enseña a construir, no solo a usar.

---

## Capítulo 1. Qué vamos a construir (2 min)

**En pantalla:** la estructura de carpetas y el diagrama de arquitectura de `docs/PROJECT.md`.

**Narración:**
> "Hay tres piezas que trabajan juntas: la web, que vive en Vercel; la base de datos, en Neon; y un proceso aparte, el *worker*, que publica a la hora programada. Como la web no puede esperar tres días, el trabajo se guarda en una cola de Redis y el worker lo recoge a su hora."

---

## Capítulo 2. Requisitos (3 min)

**En pantalla:** una lista con los requisitos, y después la terminal.

**Lista:**
- Node.js 24
- Docker (para Redis)
- Cuentas gratuitas en Clerk, Neon, ImageKit y Meta for Developers
- Una cuenta de Threads (para probar la publicación real)

**Narración:**
> "Todo lo que usamos tiene plan gratuito. Lo único que sí tiene un costo es el tiempo, así que vamos a ir paso a paso."

---

## Capítulo 3. Preparar el proyecto (4 min)

**En pantalla:** `npm install`, después el archivo `.env.local` (con los valores tapados).

**Narración:**
> "Las claves nunca van al repositorio. Por eso el archivo `.env.local` está en `.gitignore`. Cada variable tiene un propósito: la de Clerk para el login, la de Neon para la base, la de Redis para la cola, y la de cifrado para proteger los tokens de las redes."

**Punto a remarcar:** `TOKEN_ENCRYPTION_KEY` se genera con `openssl rand -base64 32`. Si se pierde, los tokens guardados quedan ilegibles.

---

## Capítulo 4. Base de datos y Redis (3 min)

**En pantalla:** `npx drizzle-kit push` y después `docker run` para Redis.

**Narración:**
> "Drizzle convierte nuestro esquema en tablas reales. Redis guarda la cola de tareas. Lo importante es que los datos de Redis sobreviven a un reinicio, gracias al volumen."

---

## Capítulo 5. Iniciar sesión (2 min)

**En pantalla:** la landing, el botón de registro de Clerk y el panel de la app.

**Narración:**
> "Clerk se encarga del registro y del inicio de sesión. Nuestra app solo recibe el identificador del usuario, y todas las consultas se filtran por ese identificador. Así, cada usuario ve solo sus datos."

**Punto a remarcar:** una página protegida no confía solo en el middleware. Cada página llama a `auth.protect()`.

---

## Capítulo 6. Conectar Threads (5 min)

**En pantalla:** la página Accounts, el botón Connect Threads y la pantalla de permisos de Threads.

**Narración:**
> "Conectar una cuenta usa OAuth: la app nunca ve la contraseña del usuario. Le pedimos permiso a Threads, Threads nos devuelve un código, y lo cambiamos por un token. El token se cifra antes de tocar la base de datos."

**Puntos a remarcar:**
- El parámetro `state` evita que alguien inicie un login ajeno.
- La URL de retorno debe coincidir **carácter por carácter** con la registrada en Meta.
- En modo desarrollo, solo funcionan las cuentas añadidas como testers.

---

## Capítulo 7. Escribir y publicar (4 min)

**En pantalla:** la página Compose. Escribe un texto, sube una imagen y pulsa Publish.

**Narración:**
> "Cuando publicas, la app guarda el post antes de llamar a Threads, así que el registro existe aunque algo falle. Después, el adaptador de Threads hace las dos llamadas: crear el contenedor y publicarlo."

**Punto a remarcar:** el nombre del archivo importa. Un nombre con emojis codificados hizo que Threads no pudiera descargar la imagen. La app limpia el nombre antes de subirlo.

---

## Capítulo 8. Programar (4 min)

**En pantalla:** el selector de fecha y hora, el mensaje "Post scheduled" y la terminal del worker.

**Narración:**
> "Al programar, el post se guarda como `scheduled` y se mete en la cola con un retraso. La fecha que eliges es tu hora local, pero se convierte a UTC en el navegador antes de enviarla. Si la convirtiéramos en el servidor, Vercel usaría UTC y el post saldría a otra hora."

**Demostración:** programa un post para dentro de dos minutos, apaga la web un momento, y muestra que el worker lo publica al encenderse. Esto demuestra qué pasa si el worker estaba apagado.

---

## Capítulo 9. Calendario y listado (3 min)

**En pantalla:** la página Calendar, después Posts con los filtros.

**Narración:**
> "El calendario decide en qué día cae cada post con la zona horaria del navegador. El listado muestra el estado de cada publicación, y si falló, el motivo."

**Punto a remarcar:** los posts se agrupan por la hora local del usuario, no del servidor.

---

## Capítulo 10. Cancelar (2 min)

**En pantalla:** un post programado, el botón Cancel y después la base de datos.

**Narración:**
> "Cancelar cambia el estado en la base de datos. Lo importante es que la base manda: si el worker ya hubiera tomado el trabajo, el guardián en `publish.ts` lo ignora."

---

## Capítulo 11. La arquitectura multi-red (4 min)

**En pantalla:** `lib/providers/types.ts` y `threads.ts`.

**Narración:**
> "Cada red es un adaptador con la misma interfaz. Cuando añadamos Instagram o LinkedIn, el resto de la app no cambia. Cada error de una red se clasifica: si es de autenticación no se reintenta, si es temporal sí."

**Punto a remarcar:** la clase de error decide qué hace el worker. Es la diferencia entre un sistema que se rinde y uno que se recupera.

---

## Capítulo 12. Lo que viene (1 min)

**En pantalla:** `docs/BACKLOG.md`.

**Narración:**
> "Quedan redes por conectar, métricas, edición antes de publicar y pruebas automáticas más completas. El backlog está en el repositorio, con criterios de terminado para cada tarea."

---

## Cierre (1 min)

**En pantalla:** el repositorio en GitHub.

**Narración:**
> "Todo el código está en el repositorio. Si quieres seguir el proceso paso a paso, el historial de commits muestra cómo se construyó cada parte. Nos vemos en el siguiente video."

---

## Notas de producción

- **Grabar por capítulos**, no en una sola toma. Cada uno debe poder verse solo.
- **Ocultar las claves** en cada pantalla: `.env.local`, la consola de Clerk y el panel de Meta.
- **Usar una cuenta de prueba** para publicar. Borra los posts de prueba al terminar.
- **Mostrar errores reales** cuando salgan. Un error bien explicado enseña más que un flujo perfecto.
- **Tiempo total estimado:** 30 minutos de contenido, con pausas de edición.

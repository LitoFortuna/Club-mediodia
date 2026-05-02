## Club Mediodía — Sitio web "Un globo en la terraza"

Un sitio multipágina inmersivo y experimental que traduce la "psicodelia doméstica" del manifiesto en una experiencia web: cielo pálido, luz quemada, sombras duras y un globo rojo como anomalía persistente.

### Identidad visual aplicada

**Paleta (mapeada al sistema de tema)**
- Fondo / cielo: `#6DC0E4` (Azul Mediodía)
- Superficie cálida: `#E8CA88` (Amarillo Arena)
- Anomalía / acento: `#C12523` (Rojo Globo) — usado con moderación, casi siempre como un único punto en pantalla
- Texto / sombra / racionalidad: `#01947F` (Teal Oscuro) para tipografía y contrastes

**Tipografía**
- Sans-serif arquitectónica para titulares (Space Grotesk o similar) con un filtro CSS sutil (`blur(0.3px)`) y variantes con `letter-spacing` negativo que provoque solapes leves — la "memoria erosionada".
- Sans-serif limpia para cuerpo (Inter), color teal oscuro.

**Texturas y efectos transversales**
- Capa global de grano analógico (SVG noise) sobre toda la web.
- Sombras duras y largas en imágenes y bloques (simulando luz cenital).
- Viñeta amarilla sutil en bordes de viewport (sensación de sobreexposición).

### Arquitectura del sitio (4 rutas)

```
src/routes/
  __root.tsx          → shell con header sticky, footer, capa de grano, metadata base
  index.tsx           → / (Home + Manifiesto)
  musica.tsx          → /musica (Álbum + embeds + galería)
  shows.tsx           → /shows (Fechas + tickets + newsletter)
  contacto.tsx        → /contacto (Booking/Prensa + redes)
```

Cada ruta con su propio `head()` (title, description, og:title, og:description; og:image en `/musica` con la portada del globo).

### Página por página

**Header (en __root.tsx)**
- Logo "CLUB MEDIODÍA" en teal, tipografía con leve solape.
- Navegación: Inicio · Música · Shows · Contacto.
- Pequeño globo rojo flotante en la esquina que sigue al cursor con suavidad — presente en todas las páginas como ancla simbólica.

**/ — Inicio**
1. **Hero inmersivo**: cielo azul a pantalla completa, sol amarillo arena difuso, globo rojo grande flotando con física suave (sube y baja con `transform`, ligero giro). Título "Un globo en la terraza" con efecto de doble exposición (dos copias del texto desplazadas, una en teal, otra en rojo translúcido).
2. **Manifiesto**: el texto completo del manifiesto presentado como bloque editorial sobre fondo arena, con palabras clave ("mediodía mental", "psicodelia doméstica", "memoria") resaltadas en rojo y fragmentándose al hacer scroll.
3. **Anticipo del álbum**: portada + frase "Memoria borrosa al mediodía" con enlace a `/musica`.
4. **Próximo show destacado** (uno) con CTA a `/shows`.
5. **Bio corta** (2-3 frases) con foto de banda sobreexpuesta y sombras duras tintadas en teal.

**/musica — Música**
- Portada del álbum a gran escala (la imagen del globo en la terraza) con parallax al scrollear.
- Tracklist tipográfica con número, título y duración; al hover, el track se "desenfoca" levemente.
- **Embeds**: Spotify (álbum completo), Bandcamp y YouTube (videoclip principal) en tarjetas con marco arena.
- Botones grandes a Apple Music, Tidal, etc.
- Galería de fotos del making-of / liminalidad doméstica (objetos, reflejos, sombras) en grid irregular.

**/shows — Shows**
- Listado de próximas fechas: ciudad, sala, fecha, hora, botón "Entradas" enlazado a la URL externa de ticketing (Dice/Ticketmaster/etc.) que el usuario configure.
- Cada fecha como tarjeta horizontal sobre arena, con sombra dura teal y un mini globo rojo si hay pocas entradas restantes.
- Sección "Shows pasados" colapsada al final.
- **Bloque newsletter** al pie: "Aún intentando recordar qué nos dijimos. Suscríbete." con campo email.

**/contacto — Contacto**
- Formulario único con selector de motivo: Booking / Prensa / Management / General.
- Campos: nombre, email, asunto, mensaje. Validación con Zod (cliente y servidor).
- Bloque lateral con enlaces a Instagram, Spotify, Bandcamp, YouTube, TikTok.
- Email de management visible.

### Funcionalidad backend (Lovable Cloud)

Tres piezas requieren backend — se implementan con Lovable Cloud + envíos de email transaccional:

1. **Newsletter** (`/shows`): tabla `newsletter_subscribers (id, email, created_at)`. Server function valida con Zod, inserta, devuelve confirmación. Email a la banda opcional.
2. **Contacto / booking** (`/contacto`): server function valida, envía email transaccional a la dirección del management con el contenido del formulario, guarda copia en tabla `contact_messages` para historial.
3. **Shows**: tabla `shows (id, city, venue, date, time, ticket_url, sold_out)` precargada con datos de ejemplo; el sitio lee y ordena por fecha. (Si el usuario prefiere editarlos en código, se puede sustituir por un array estático — lo dejamos en BD para que pueda añadir fechas sin redeploy.)

Lovable Cloud se habilita automáticamente al iniciar la implementación.

### Animaciones e inmersión (nivel: experimental)

- **Globo rojo persistente** en header siguiendo el cursor con lerp suave.
- **Hero**: globo flotante con keyframes (sube/baja 30px en 6s, ease-in-out infinito).
- **Scroll**: parallax sutil en cielo y portada del álbum; títulos con motion blur ligero al desplazarse rápido (CSS `filter: blur()` controlado por scroll velocity).
- **Doble exposición tipográfica** en titulares principales (capa rojo translúcido + capa teal con offset de 2-3px).
- **Transiciones entre rutas**: fade + ligero zoom-in (300ms) usando keyframes globales — sensación videoclip.
- **Hover en imágenes**: aumentan saturación amarilla y la sombra teal se alarga.
- **Grano analógico** animado (opacity oscilante muy sutil) sobre toda la web.

Todo el motion respeta `prefers-reduced-motion`.

### Detalles técnicos (sección para referencia)

- TanStack Start file-based routing en `src/routes/`.
- Tema en `src/styles.css`: añadir tokens semánticos (`--color-mediodia-sky`, `--color-arena`, `--color-globo`, `--color-teal`) en formato oklch y registrarlos en `@theme inline`.
- Componentes reutilizables en `src/components/`: `Header`, `Footer`, `GrainOverlay`, `FloatingBalloon`, `DoubleExposureHeading`, `ShowCard`, `NewsletterForm`, `ContactForm`.
- Server functions en `src/server/*.functions.ts` para newsletter, contacto y lectura de shows; helpers DB en `src/server/*.server.ts`.
- Validación con Zod en cliente y servidor.
- Imágenes generadas (portada del álbum con globo en terraza, fotos de banda con estética liminal) vía generación de imágenes durante la implementación.
- SEO: head() único por ruta; og:image del álbum en `/musica`.

### Lo que falta confirmar tras aprobar (lo preguntaré al implementar)
- Nombres y miembros de la banda para la bio.
- Email de destino para booking/prensa.
- Listado real de shows (o si quieres datos placeholder editables después).
- Enlaces reales a Spotify/Bandcamp/YouTube/Instagram (o usar placeholders que sustituyas luego).

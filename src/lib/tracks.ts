// Tracklist del álbum «Un globo en la terraza», con letras. Fuente única de
// verdad: usado por la página /musica y por las páginas individuales /musica/$slug.

export type Track = {
  n: string;
  title: string;
  duration: string; // mm:ss para mostrar
  durationISO: string; // ISO 8601 (schema.org)
  lyrics: string;
  slug: string;
};

function slugify(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const RAW_TRACKS: Omit<Track, "slug">[] = [
  {
    n: "01",
    title: "Domingo",
    duration: "4:10",
    durationISO: "PT4M10S",
    lyrics: `Esta vez salió más poético nena,
me abriste los brazos y me regalaste tu espacio mental.

Noé ya viene la lluvia,
Noé ya viene la lluvia, Noé,
ya viene…

¿Domingo, dónde estás?
¿Domingo, dónde estás?
Domingo, la lluvia mental.`,
  },
  {
    n: "02",
    title: "Aquí y Ahora (Amigo)",
    duration: "3:06",
    durationISO: "PT3M6S",
    lyrics: `Buscábamos sentidos para el amor,
vimos decaer de nuevo el sol.
Amigo no me dejes descansar,
los días más felices van a pasar.

Buscábamos sentidos para el amor,
vimos decaer de nuevo el sol.
Amigo no me dejes descansar,
los días más felices van a pasar

Y no regresan, no regresan,
no regresan, no…

Miro al espejo y me lleva hacia adentro,
miro el reflejo y me trae un recuerdo

Que no regresa, no regresa.`,
  },
  {
    n: "03",
    title: "Tirito",
    duration: "2:46",
    durationISO: "PT2M46S",
    lyrics: `Nos sobran Adanes, pecados capitales,
Iluminan mi ciudad nubarrones de otredad,
Y cerrás los ojos y miras miles de años transformados,
Un panal y vos la reina, gobernás haces colmena.
Sin vos me cansa, con vos no alcanza…
Sin vos me cansa, con vos no alcanza…

Memoria borrosa, paraíso infernal,
tímpano sentimental, en la ventana el calor se va.

Cerrás los ojos y miras miles de años transformados,
un panal y vos la reina, gobernás haces colmena.
Sin vos me cansa, con vos no alcanza…

Llamarada siempre inocua, se quema mi piel,
tirito adentro y en la calle falta amor.
Sin vos me cansa, con vos no alcanza.`,
  },
  {
    n: "04",
    title: "Perdido",
    duration: "3:04",
    durationISO: "PT3M4S",
    lyrics: `Si me perdí es porque a veces no entiendo,
Si me perdí es porque a veces mambeo.

Yo vi la piel, sentí la piel psicodélica.

Si me perdí es porque nadie importaba,
Si me perdí es porque el mañana no llegaba.

Yo vi la piel, sentí la piel psicodélica.

Si me perdí es porque con humo no miraba,
Déjalo así, a veces me encuentro.`,
  },
  {
    n: "05",
    title: "Las Mañanas",
    duration: "3:44",
    durationISO: "PT3M44S",
    lyrics: `Las mañanas eran para vos
Y no me despertabas a desayunar
La corbata me ahorcaba
Mientras tecleaba para madurar

Desde el banco me avisaban
Sin papeles puedes ser deudor
Mis caricias no llegaban
Ahora es tiempo para descansar

Mañana las mañanas serán mías
Sin opciones para postergar
Llegas tarde a trabajar.`,
  },
  {
    n: "06",
    title: "Mundial '94",
    duration: "4:29",
    durationISO: "PT4M29S",
    lyrics: `Contemplo la idea
De que todos venimos a pedazos
Y nos vamos armando mal

Me esquiva la pelota
Y el mundo me tira para abajo
Si no comparto con vos

Acepto la idea
De que todos venimos a pedazos
Y nos vamos armando mal

Me esquiva la pelota
Y el mundo me tira para abajo
Si no comparto con vos`,
  },
  {
    n: "07",
    title: "Rimpiangere",
    duration: "3:21",
    durationISO: "PT3M21S",
    lyrics: `Barrio de las letras yo te extraño
Me veo en tus soles reflejar
Necesito descansar
Son tus años son mis sueños
Los que infringen la obviedad

Miel y polen se escurren por mis dedos
Dicen no se puede alcanzarán las manos
Una fábula sin viento
Escapa donde no hay más viento

Al sur siempre un tormento
Un po' un posible encuentro

Nuestro virulento porvenir
Nuestro virulento porvenir
Nuestro virulento porvenir`,
  },
  {
    n: "08",
    title: "Versiones",
    duration: "3:11",
    durationISO: "PT3M11S",
    lyrics: `(Instrumental)

Las mañanas eran para vos
Y no me despertabas a desayunar
La corbata me ahorcaba
Mientras tecleaba para madurar

Desde el banco me avisaban
Sin papeles puedes ser deudor
Mis caricias no llegaban
Ahora es tiempo para descansar

Mañana las mañanas serán mías
Sin opciones para postergar
Llegas tarde a trabajar.`,
  },
];

export const TRACKS: Track[] = RAW_TRACKS.map((t) => ({ ...t, slug: slugify(t.title) }));

export function getTrackBySlug(slug: string): Track | undefined {
  return TRACKS.find((t) => t.slug === slug);
}

import { createFileRoute } from "@tanstack/react-router";
import { DoubleExposure } from "@/components/DoubleExposure";
import albumCover from "@/assets/CM_portada.jpg";
import gallery1 from "@/assets/CM_header.jpg";
import gallery2 from "@/assets/CM_portada.jpg";
import gallery3 from "@/assets/CM_header.jpg";
import { useState } from "react";

const tracklist = [
  { 
    n: "01", 
    title: "Domingo", 
    duration: "4:10",
    lyrics: `Esta vez salió más poético nena,
me abriste los brazos y me regalaste tu espacio mental.

Noé ya viene la lluvia,
Noé ya viene la lluvia, Noé,
ya viene…

¿Domingo, dónde estás?
¿Domingo, dónde estás?
Domingo, la lluvia mental.`
  },
  { 
    n: "02", 
    title: "Aquí y Ahora (Amigo)", 
    duration: "3:06",
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

Que no regresa, no regresa.`
  },
  { 
    n: "03", 
    title: "Tirito", 
    duration: "2:46",
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
Sin vos me cansa, con vos no alcanza.`
  },
  { 
    n: "04", 
    title: "Perdido", 
    duration: "3:04",
    lyrics: `Si me perdí es porque a veces no entiendo,
Si me perdí es porque a veces mambeo.

Yo vi la piel, sentí la piel psicodélica.

Si me perdí es porque nadie importaba,
Si me perdí es porque el mañana no llegaba.

Yo vi la piel, sentí la piel psicodélica.

Si me perdí es porque con humo no miraba,
Déjalo así, a veces me encuentro.`
  },
  { 
    n: "05", 
    title: "Las Mañanas", 
    duration: "3:44",
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
Llegas tarde a trabajar.`
  },
  { 
    n: "06", 
    title: "Mundial '94", 
    duration: "4:29",
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
Si no comparto con vos`
  },
  { 
    n: "07", 
    title: "Rimpiangere", 
    duration: "3:21",
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
Nuestro virulento porvenir`
  },
  { 
    n: "08", 
    title: "Versiones", 
    duration: "3:11",
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
Llegas tarde a trabajar.`
  },
];

export const Route = createFileRoute("/musica")({
  head: () => ({
    meta: [
      { title: "Música — Club Mediodía" },
      {
        name: "description",
        content:
          "Escucha 'Un globo en la terraza' de Club Mediodía. Disponible en Spotify, Bandcamp y YouTube.",
      },
      { property: "og:title", content: "Música — Club Mediodía" },
      {
        property: "og:description",
        content: "Ocho canciones desde una terraza de barrio. Un globo en la terraza.",
      },
      { property: "og:image", content: albumCover },
    ],
  }),
  component: MusicaPage,
});

function MusicaPage() {
  const [selectedTrack, setSelectedTrack] = useState<number | null>(0);

  return (
    <>
      {/* PORTADA */}
      <section className="px-6 pt-16 pb-20 md:pt-24 bg-background">
        <div className="mx-auto max-w-6xl grid md:grid-cols-[1.1fr_1fr] gap-12 items-center">
          <div className="relative group">
            <img
              src={albumCover}
              alt="Portada Un globo en la terraza"
              width={1024}
              height={1024}
              className="w-full grayscale contrast-125 border border-white/10"
            />
            <div className="absolute -bottom-10 -right-10 big-number opacity-10 pointer-events-none select-none">
              LP
            </div>
          </div>
          <div>
            <p className="font-display uppercase tracking-[0.4em] text-xs mb-4 text-accent">
              Lanzamiento · 1 Mayo 2026
            </p>
            <h1 className="font-display text-6xl md:text-8xl font-bold tracking-tighter leading-[0.85] text-white">
              UN GLOBO<br />
              <span className="text-accent">EN LA TERRAZA</span>
            </h1>
            <div className="mt-8 space-y-2 font-body text-sm uppercase tracking-widest text-white/40">
              <p>Producido por <span className="text-white/70">Daniel O'Connell</span> (O'Connell Mastering)</p>
              <p>Grabado en <span className="text-white/70">El Patio Estudio</span> (Barcelona)</p>
            </div>
            <p className="mt-8 font-body text-lg max-w-md text-white/60">
              Ocho canciones que exploran la psicodelia doméstica y la memoria borrosa. Un viaje visceral desde la terraza hasta el mediodía mental.
            </p>
          </div>
        </div>
      </section>

      {/* TRACKLIST & LYRICS */}
      <section className="px-6 py-20 md:py-28 bg-background border-t border-white/5">
        <div className="mx-auto max-w-5xl grid lg:grid-cols-[1fr_400px] gap-20 items-start">
          <div>
            <div className="flex items-baseline gap-4 mb-12">
              <h2 className="font-display text-sm uppercase tracking-[0.4em] text-accent">
                Tracklist
              </h2>
              <div className="h-[1px] flex-1 bg-accent/20"></div>
            </div>
            <ul className="space-y-1">
              {tracklist.map((t, index) => (
                <li
                  key={t.n}
                  onClick={() => setSelectedTrack(index)}
                  className={`grid grid-cols-[40px_1fr_auto] items-center gap-4 py-6 font-display group border-b border-white/5 cursor-pointer transition-all ${
                    selectedTrack === index ? "border-accent/60 bg-white/5" : "hover:border-white/20"
                  }`}
                >
                  <span className={`text-sm transition-colors ${selectedTrack === index ? "text-accent" : "text-white/30 group-hover:text-white/60"}`}>
                    {t.n}
                  </span>
                  <span className={`text-xl md:text-2xl font-bold transition-all ${selectedTrack === index ? "text-white translate-x-2" : "text-white/60 group-hover:text-white group-hover:translate-x-1"}`}>
                    {t.title}
                  </span>
                  <span className="text-sm text-white/20 tabular-nums group-hover:text-white/40">{t.duration}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:sticky lg:top-32 min-h-[400px]">
             <div className="flex items-baseline gap-4 mb-12">
              <h2 className="font-display text-sm uppercase tracking-[0.4em] text-white/40">
                Letras
              </h2>
              <div className="h-[1px] flex-1 bg-white/10"></div>
            </div>
            
            {selectedTrack !== null ? (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <h3 className="font-display text-3xl font-bold text-accent mb-8 uppercase tracking-tighter">
                  {tracklist[selectedTrack].title}
                </h3>
                <div className="font-body text-base leading-relaxed text-white/70 whitespace-pre-wrap max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar">
                  {tracklist[selectedTrack].lyrics}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-20 text-center border border-dashed border-white/10 opacity-30">
                <p className="font-display uppercase tracking-widest text-xs">Selecciona una canción<br/>para leer la letra</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* EMBEDS */}
      <section className="px-6 py-20 bg-background overflow-hidden relative border-t border-white/5">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 text-vertical big-number opacity-5 select-none">
          STREAMS
        </div>
        <div className="mx-auto max-w-6xl relative z-10">
          <h2 className="font-display text-4xl md:text-6xl font-bold tracking-tighter mb-16 text-white text-right">
            ESCUCHAR / <span className="text-accent">VER</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-zinc-950 p-6 border border-white/10 shadow-2xl">
              <p className="font-display uppercase tracking-widest text-[10px] mb-6 text-accent">
                Spotify
              </p>
              <iframe
                title="Spotify"
                src="https://open.spotify.com/embed/album/6C6u8Zv8Lxhx95zv3I4guY?utm_source=generator&theme=0"
                width="100%"
                height="380"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                className="grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
                loading="lazy"
              />
            </div>
            <div className="bg-zinc-950 p-6 border border-white/10 shadow-2xl">
              <p className="font-display uppercase tracking-widest text-[10px] mb-6 text-accent">
                YouTube
              </p>
              <div className="aspect-video relative">
                <iframe
                  title="YouTube"
                  src="https://www.youtube.com/embed/RQvYWml1ixw"
                  className="w-full h-full grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  loading="lazy"
                />
              </div>
              <div className="mt-8 p-4 border border-white/5 bg-white/2">
                <p className="font-body text-xs text-white/40 text-center italic">
                  "CLUB MEDIODIA @ DioBar" - Directo en Barcelona
                </p>
              </div>
            </div>
          </div>

          <div className="mt-16 flex flex-wrap gap-4 justify-center">
            {[
              { label: "Amazon Music", url: "https://music.amazon.es/albums/B0GY1YWF7B" },
              { label: "Bandcamp", url: "https://bandcamp.com" },
              { label: "Apple Music", url: "https://music.apple.com" },
              { label: "YouTube", url: "https://www.youtube.com/channel/UCobKsproqA8miDdGqqVNwRA" },
            ].map((p) => (
              <a
                key={p.label}
                href={p.url}
                target="_blank"
                rel="noreferrer"
                className="px-8 py-3 font-display uppercase tracking-widest text-[10px] border border-white/10 text-white/60 hover:border-accent hover:text-accent hover:bg-accent/5 transition-all"
              >
                {p.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* GALERÍA */}
      <section className="px-6 py-20 md:py-32 bg-background border-t border-white/5">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-4xl md:text-7xl font-bold tracking-tighter mb-20 text-white">
            LIMINALIDAD<br />
            <span className="text-accent">DOMÉSTICA</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div className="row-span-2 overflow-hidden border border-white/10">
              <img src={gallery1} alt="Vaso a medio beber" loading="lazy" width={1024} height={1024}
                   className="w-full grayscale hover:grayscale-0 transition-all duration-1000 object-cover h-full scale-105 hover:scale-100" />
            </div>
            <div className="overflow-hidden border border-white/10">
              <img src={gallery3} alt="Cielo del mediodía" loading="lazy" width={1280} height={1024}
                   className="w-full grayscale hover:grayscale-0 transition-all duration-1000 object-cover h-full scale-105 hover:scale-100" />
            </div>
            <div className="overflow-hidden border border-white/10">
              <img src={gallery2} alt="Sombra en la terraza" loading="lazy" width={1024} height={1280}
                   className="w-full grayscale hover:grayscale-0 transition-all duration-1000 object-cover h-full scale-105 hover:scale-100" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

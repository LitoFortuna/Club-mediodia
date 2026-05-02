import { createFileRoute } from "@tanstack/react-router";
import { DoubleExposure } from "@/components/DoubleExposure";
import albumCover from "@/assets/album-cover.jpg";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";

const tracklist = [
  { n: "01", title: "Mediodía mental", duration: "3:42" },
  { n: "02", title: "Globo rojo", duration: "4:15" },
  { n: "03", title: "Reflejo en la ventana", duration: "2:58" },
  { n: "04", title: "Sombra dura", duration: "5:11" },
  { n: "05", title: "Domingo que no termina", duration: "4:33" },
  { n: "06", title: "Taza a medio beber", duration: "3:21" },
  { n: "07", title: "Miles de versiones", duration: "4:48" },
  { n: "08", title: "Calor que pesa", duration: "3:07" },
  { n: "09", title: "Memoria borrosa", duration: "5:29" },
  { n: "10", title: "El eco", duration: "6:02" },
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
        content: "Diez canciones desde una terraza de barrio. Un globo en la terraza.",
      },
      { property: "og:image", content: albumCover },
    ],
  }),
  component: MusicaPage,
});

function MusicaPage() {
  return (
    <>
      {/* PORTADA */}
      <section className="px-6 pt-16 pb-20 md:pt-24" style={{ background: "var(--color-sky)" }}>
        <div className="mx-auto max-w-6xl grid md:grid-cols-[1.1fr_1fr] gap-12 items-center">
          <img
            src={albumCover}
            alt="Portada Un globo en la terraza"
            width={1024}
            height={1024}
            className="w-full hard-shadow-lg"
          />
          <div>
            <p
              className="font-display uppercase tracking-[0.4em] text-xs mb-4 opacity-80"
              style={{ color: "var(--color-teal)" }}
            >
              LP · 2026
            </p>
            <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tighter eroded leading-[0.95]">
              <span className="double-expo block" data-text="Un globo">Un globo</span>
              <span className="double-expo block" data-text="en la terraza">en la terraza</span>
            </h1>
            <p className="mt-6 font-body text-lg max-w-md" style={{ color: "var(--color-teal)" }}>
              Diez canciones grabadas a la luz dura del mediodía.
            </p>
          </div>
        </div>
      </section>

      {/* TRACKLIST */}
      <section className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-3xl">
          <DoubleExposure
            text="Tracklist"
            as="h2"
            className="font-display text-sm uppercase tracking-[0.4em] mb-10 opacity-70"
          />
          <ul className="divide-y divide-teal/20">
            {tracklist.map((t) => (
              <li
                key={t.n}
                className="grid grid-cols-[40px_1fr_auto] items-baseline gap-4 py-4 font-display transition-all hover:opacity-100 hover:[filter:blur(0.6px)]"
                style={{ color: "var(--color-teal)" }}
              >
                <span className="text-sm opacity-50">{t.n}</span>
                <span className="text-lg md:text-xl font-medium">{t.title}</span>
                <span className="text-sm opacity-60 tabular-nums">{t.duration}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* EMBEDS */}
      <section className="px-6 py-20" style={{ background: "var(--color-arena)" }}>
        <div className="mx-auto max-w-6xl">
          <DoubleExposure
            text="Escuchar / Ver"
            as="h2"
            className="font-display text-3xl md:text-5xl font-bold tracking-tighter mb-12"
          />
          <div className="grid md:grid-cols-2 gap-8">
            <div className="hard-shadow border-2 border-teal/30 bg-background p-4">
              <p
                className="font-display uppercase tracking-widest text-xs mb-3"
                style={{ color: "var(--color-teal)" }}
              >
                Spotify
              </p>
              <iframe
                title="Spotify"
                src="https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM5M?utm_source=generator&theme=0"
                width="100%"
                height="380"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
              />
            </div>
            <div className="hard-shadow border-2 border-teal/30 bg-background p-4">
              <p
                className="font-display uppercase tracking-widest text-xs mb-3"
                style={{ color: "var(--color-teal)" }}
              >
                YouTube
              </p>
              <div className="aspect-video">
                <iframe
                  title="YouTube"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap gap-3 justify-center">
            {[
              { label: "Bandcamp", url: "https://bandcamp.com" },
              { label: "Apple Music", url: "https://music.apple.com" },
              { label: "Tidal", url: "https://tidal.com" },
              { label: "SoundCloud", url: "https://soundcloud.com" },
            ].map((p) => (
              <a
                key={p.label}
                href={p.url}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2 font-display uppercase tracking-widest text-xs border-2 transition-transform hover:scale-105"
                style={{ borderColor: "var(--color-teal)", color: "var(--color-teal)" }}
              >
                {p.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* GALERÍA */}
      <section className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <DoubleExposure
            text="Liminalidad doméstica"
            as="h2"
            className="font-display text-3xl md:text-5xl font-bold tracking-tighter mb-12"
          />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            <img src={gallery1} alt="Vaso a medio beber" loading="lazy" width={1024} height={1024}
                 className="w-full hard-shadow row-span-2 object-cover h-full" />
            <img src={gallery3} alt="Cielo del mediodía" loading="lazy" width={1280} height={1024}
                 className="w-full hard-shadow object-cover h-full" />
            <img src={gallery2} alt="Sombra en la terraza" loading="lazy" width={1024} height={1280}
                 className="w-full hard-shadow object-cover h-full" />
          </div>
        </div>
      </section>
    </>
  );
}

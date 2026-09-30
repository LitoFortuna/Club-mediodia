import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { TRACKS, getTrackBySlug } from "@/lib/tracks";
import { ALBUM, SITE_URL, musicRecordingLd } from "@/lib/band";

export const Route = createFileRoute("/musica/$slug")({
  loader: ({ params }) => {
    const track = getTrackBySlug(params.slug);
    if (!track) throw notFound();
    return { track };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const { track } = loaderData;
    const position = TRACKS.findIndex((t) => t.slug === track.slug) + 1;
    return {
      meta: [
        { title: `${track.title} (Letra) — Club Mediodía` },
        {
          name: "description",
          content: `Letra completa de "${track.title}", canción ${position} de «${ALBUM.name}», el álbum de Club Mediodía.`,
        },
        { property: "og:title", content: `${track.title} — Club Mediodía` },
        {
          property: "og:description",
          content: `Letra de "${track.title}", de Club Mediodía. Del álbum «${ALBUM.name}».`,
        },
        { property: "og:image", content: `${SITE_URL}/og-default.jpg` },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: `${SITE_URL}/musica/${track.slug}` }],
      scripts: [{ type: "application/ld+json", children: musicRecordingLd(track, position) }],
    };
  },
  component: TrackPage,
  notFoundComponent: () => (
    <div className="min-h-[60vh] flex items-center justify-center px-6 bg-background text-center">
      <div>
        <p className="font-display text-2xl font-bold uppercase tracking-tight mb-4 text-rojo">
          Canción no encontrada
        </p>
        <Link to="/musica" className="text-cielo underline font-body">
          Volver a Música
        </Link>
      </div>
    </div>
  ),
});

function TrackPage() {
  const { track } = Route.useLoaderData();
  const position = TRACKS.findIndex((t) => t.slug === track.slug) + 1;
  const prev = TRACKS[position - 2];
  const next = TRACKS[position];

  return (
    <div className="bg-background min-h-[70vh] px-6 py-20 md:py-28">
      <div className="mx-auto max-w-3xl">
        <Link
          to="/musica"
          className="font-display uppercase tracking-widest text-[10px] text-white/40 hover:text-cielo transition-colors"
        >
          ← Un globo en la terraza
        </Link>

        <p className="mt-8 font-display uppercase tracking-[0.4em] text-xs text-cielo font-semibold">
          Canción {track.n} · {track.duration}
        </p>
        <h1 className="mt-4 font-display text-5xl md:text-7xl font-bold tracking-tighter leading-[0.9] text-white">
          {track.title}
        </h1>

        <div className="mt-12 font-body text-lg leading-relaxed text-white/70 whitespace-pre-wrap max-w-xl">
          {track.lyrics}
        </div>

        <div className="mt-20 flex items-center justify-between border-t border-white/10 pt-8">
          {prev ? (
            <Link
              to="/musica/$slug"
              params={{ slug: prev.slug }}
              className="font-display uppercase tracking-widest text-xs text-white/50 hover:text-cielo transition-colors"
            >
              ← {prev.title}
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link
              to="/musica/$slug"
              params={{ slug: next.slug }}
              className="font-display uppercase tracking-widest text-xs text-white/50 hover:text-cielo transition-colors"
            >
              {next.title} →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

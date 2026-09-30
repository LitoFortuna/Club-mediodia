import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Clock, Ticket } from "lucide-react";
import { AddToCalendar } from "@/components/AddToCalendar";
import { FEATURED_SHOW, formatDateEs } from "@/lib/concert";
import { featuredShowEventLd } from "@/lib/band";

export const Route = createFileRoute("/entradas")({
  head: () => {
    const poster = FEATURED_SHOW.posterUrl;
    const dateEs = formatDateEs(FEATURED_SHOW.dateISO);
    const title = `${FEATURED_SHOW.title} — ${dateEs}`;
    const desc = `${FEATURED_SHOW.bandName} en ${FEATURED_SHOW.venue}, ${FEATURED_SHOW.city}, el ${dateEs}. Entradas en Entradium.`;
    return {
      meta: [
        { title: `Entradas ${FEATURED_SHOW.dateISO} — Club Mediodía` },
        { name: "description", content: desc },
        { property: "og:type", content: "website" },
        { property: "og:url", content: "https://clubmediodia.es/entradas" },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:image", content: poster },
        { property: "og:image:secure_url", content: poster },
        { property: "og:image:alt", content: `Cartel de ${FEATURED_SHOW.title}` },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: desc },
        { name: "twitter:image", content: poster },
      ],
      links: [{ rel: "canonical", href: "https://clubmediodia.es/entradas" }],
      scripts: [{ type: "application/ld+json", children: featuredShowEventLd() }],
    };
  },
  component: EntradasPage,
});

function EntradasPage() {
  const day = FEATURED_SHOW.dateISO.slice(8, 10);

  return (
    <>
      <section className="px-6 pt-16 md:pt-24 pb-16 bg-background relative overflow-hidden">
        <div className="absolute top-0 right-0 big-number opacity-5 translate-x-1/4 -translate-y-1/4 select-none">
          {day}
        </div>
        <div className="mx-auto max-w-5xl relative z-10 grid md:grid-cols-[1.4fr_1fr] gap-12 items-center">
          <div>
            <p className="font-display uppercase tracking-[0.4em] text-xs mb-6 text-orange font-semibold">
              Concierto en directo
            </p>
            <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tighter leading-[0.9] text-white">
              {FEATURED_SHOW.title}
            </h1>

            <div className="mt-10 flex flex-col gap-3 text-white/70 font-body text-base md:text-lg">
              <p className="flex items-start gap-3">
                <MapPin size={20} className="text-orange shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">{FEATURED_SHOW.venue}</strong>
                  <br />
                  {FEATURED_SHOW.address}
                </span>
              </p>
              <p className="flex items-center gap-3">
                <Clock size={20} className="text-orange shrink-0" />
                {formatDateEs(FEATURED_SHOW.dateISO)} · Inicio {FEATURED_SHOW.startTime}h
              </p>
              <p className="flex items-center gap-3">
                <Ticket size={20} className="text-orange shrink-0" />
                {FEATURED_SHOW.priceInfo}.
              </p>
            </div>

            <div className="mt-10">
              <a
                href={FEATURED_SHOW.ticketUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-block px-8 py-4 bg-orange text-black font-display font-bold uppercase tracking-widest text-sm transition-all hover:bg-white hover:scale-105 active:scale-95"
              >
                Comprar entradas
              </a>
              <p className="mt-2 font-body text-xs text-white/30">
                Venta gestionada por Entradium.
              </p>
            </div>

            <div className="mt-8">
              <AddToCalendar
                title={`${FEATURED_SHOW.bandName} en directo — ${FEATURED_SHOW.venue}`}
                details={`${FEATURED_SHOW.title}. ${FEATURED_SHOW.priceInfo}. Entradas en ${FEATURED_SHOW.ticketUrl}`}
                address={FEATURED_SHOW.address}
                startUTC={FEATURED_SHOW.calStartUTC}
                endUTC={FEATURED_SHOW.calEndUTC}
                mapsUrl={FEATURED_SHOW.mapsUrl}
              />
            </div>
          </div>

          <img
            src={FEATURED_SHOW.posterUrl}
            alt={`Cartel de ${FEATURED_SHOW.title}`}
            width={1200}
            height={1600}
            fetchPriority="high"
            className="w-full max-w-sm mx-auto border border-white/10"
          />
        </div>
      </section>
    </>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Clock, Ticket } from "lucide-react";
import { EntradasForm } from "@/components/EntradasForm";
import { AddToCalendar } from "@/components/AddToCalendar";
import { Pic } from "@/components/Pic";
import { getConcertAvailability } from "@/api/concert.functions";
import { CONCERT, formatConcertDateEs, isRegistrationOpen } from "@/lib/concert";
import { concertEventLd } from "@/lib/band";

export const Route = createFileRoute("/entradas")({
  head: () => {
    const poster = `https://clubmediodia.es${CONCERT.posterPath}`;
    const title = `${CONCERT.bandName} en directo — ${formatConcertDateEs()}`;
    const desc = `Reserva tu entrada gratuita para ${CONCERT.bandName} en ${CONCERT.venue}, ${CONCERT.city}, el ${formatConcertDateEs()}.`;
    return {
      meta: [
        { title: `Entradas ${CONCERT.dateISO} — Club Mediodía` },
        { name: "description", content: desc },
        { property: "og:type", content: "website" },
        { property: "og:url", content: "https://clubmediodia.es/entradas" },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:image", content: poster },
        { property: "og:image:secure_url", content: poster },
        { property: "og:image:type", content: "image/jpeg" },
        { property: "og:image:width", content: "1200" },
        { property: "og:image:height", content: "1600" },
        { property: "og:image:alt", content: `Cartel del concierto de ${CONCERT.bandName}` },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: desc },
        { name: "twitter:image", content: poster },
      ],
      links: [{ rel: "canonical", href: "https://clubmediodia.es/entradas" }],
      scripts: [{ type: "application/ld+json", children: concertEventLd() }],
    };
  },
  loader: () => getConcertAvailability(),
  component: EntradasPage,
});

function EntradasPage() {
  const open = isRegistrationOpen();
  const { full } = Route.useLoaderData();

  return (
    <>
      <section className="px-6 pt-16 md:pt-24 pb-16 bg-background relative overflow-hidden">
        <div className="absolute top-0 right-0 big-number opacity-5 translate-x-1/4 -translate-y-1/4 select-none">
          11
        </div>
        <div className="mx-auto max-w-5xl relative z-10 grid md:grid-cols-[1.4fr_1fr] gap-12 items-center">
          <div>
            <p className="font-display uppercase tracking-[0.4em] text-xs mb-6 text-orange font-semibold">
              Concierto en directo
            </p>
            <h1 className="font-display text-6xl md:text-8xl font-bold tracking-tighter leading-[0.8] text-white">
              RESERVA<br />
              <span className="text-orange">TU ENTRADA</span>
            </h1>

            <div className="mt-10 flex flex-col gap-3 text-white/70 font-body text-base md:text-lg">
              <p className="flex items-start gap-3">
                <MapPin size={20} className="text-orange shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">{CONCERT.venue}</strong>
                  <br />
                  {CONCERT.address}
                </span>
              </p>
              <p className="flex items-center gap-3">
                <Clock size={20} className="text-orange shrink-0" />
                {formatConcertDateEs()} · Puertas {CONCERT.doorsTime}h · Inicio {CONCERT.startTime}h
              </p>
              <p className="flex items-center gap-3">
                <Ticket size={20} className="text-orange shrink-0" />
                {CONCERT.priceInfo}.
              </p>
            </div>

            <div className="mt-8">
              <AddToCalendar />
            </div>
          </div>

          <Pic
            jpg={CONCERT.posterPath}
            webp={CONCERT.posterPathWebp}
            alt={`Cartel del concierto de ${CONCERT.bandName}`}
            className="w-full max-w-sm mx-auto border border-white/10"
            width={1200}
            height={1600}
            fetchPriority="high"
          />
        </div>
      </section>

      <section className="px-6 pb-32 bg-background">
        <div className="mx-auto max-w-2xl">
          {open ? (
            <div className="p-1 border border-white/10 bg-white/5">
              <div className="p-8 md:p-12 border border-white/10 bg-background">
                {full ? (
                  <p className="text-arena font-body text-sm mb-8 border-l-2 border-arena pl-4">
                    El aforo ({CONCERT.capacity} personas) está completo. Puedes apuntarte igualmente:
                    entrarás en la <strong>lista de espera</strong> y, si hay alguna cancelación, te
                    enviaremos la entrada por orden de reserva.
                  </p>
                ) : (
                  <p className="text-white/60 font-body text-sm mb-8">
                    Recibirás un email de confirmación con un código QR por persona. Preséntalo en la
                    puerta el día del concierto.
                  </p>
                )}
                <EntradasForm />
              </div>
            </div>
          ) : (
            <div className="text-center py-24 border border-white/10 bg-white/5">
              <p className="font-display text-2xl text-white/40">
                Las inscripciones para este concierto ya han cerrado.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

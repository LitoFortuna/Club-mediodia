import { createFileRoute } from "@tanstack/react-router";
import { DoubleExposure } from "@/components/DoubleExposure";
import { ShowCard } from "@/components/ShowCard";
import { NewsletterForm } from "@/components/NewsletterForm";
import { getShows, type Show } from "@/api/shows.functions";

export const Route = createFileRoute("/shows")({
  head: () => ({
    meta: [
      { title: "Shows — Club Mediodía" },
      {
        name: "description",
        content:
          "Próximas fechas de Club Mediodía. Conciertos en Madrid, Barcelona, Valencia y más.",
      },
      { property: "og:title", content: "Shows — Club Mediodía" },
      { property: "og:description", content: "Próximas fechas y entradas." },
    ],
  }),
  loader: () => getShows(),
  component: ShowsPage,
  errorComponent: ({ error }) => (
    <div className="px-6 py-24 text-center" style={{ color: "var(--color-teal)" }}>
      <p>{error.message}</p>
    </div>
  ),
});

function ShowsPage() {
  const data = Route.useLoaderData() as { shows: Show[]; error: string | null };
  const { shows, error } = data;
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = shows.filter((s: Show) => s.show_date >= today);
  const past = shows.filter((s: Show) => s.show_date < today).reverse();

  return (
    <>
      <section className="px-6 pt-16 md:pt-24 pb-12">
        <div className="mx-auto max-w-5xl text-center">
          <p
            className="font-display uppercase tracking-[0.4em] text-xs mb-6 opacity-70"
            style={{ color: "var(--color-teal)" }}
          >
            En directo
          </p>
          <h1 className="font-display text-5xl md:text-8xl font-bold tracking-tighter eroded">
            <span className="double-expo" data-text="Próximas fechas">Próximas fechas</span>
          </h1>
          <p
            className="mt-6 font-body text-lg md:text-xl max-w-xl mx-auto"
            style={{ color: "var(--color-teal)" }}
          >
            Llevamos el mediodía a salas pequeñas. Ven a recordar con nosotros.
          </p>
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="mx-auto max-w-4xl flex flex-col gap-6">
          {error && (
            <p className="text-center" style={{ color: "var(--color-globo)" }}>{error}</p>
          )}
          {!error && upcoming.length === 0 && (
            <p
              className="text-center font-display text-xl py-12"
              style={{ color: "var(--color-teal)" }}
            >
              No hay fechas anunciadas. Pronto, en alguna terraza.
            </p>
          )}
          {upcoming.map((s: Show) => (
            <ShowCard key={s.id} show={s} />
          ))}
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="px-6 py-20 md:py-28" style={{ background: "var(--color-sky)" }}>
        <div className="mx-auto max-w-3xl text-center">
          <DoubleExposure
            text="Aún intentando recordar qué nos dijimos"
            as="h2"
            className="font-display text-3xl md:text-5xl font-bold tracking-tighter leading-tight"
          />
          <p
            className="mt-6 font-body text-lg"
            style={{ color: "var(--color-teal)" }}
          >
            Suscríbete y te avisamos de nuevas fechas, lanzamientos y memorias borrosas.
          </p>
          <div className="mt-10 flex justify-center">
            <NewsletterForm />
          </div>
        </div>
      </section>

      {/* PAST */}
      {past.length > 0 && (
        <section className="px-6 py-20">
          <div className="mx-auto max-w-4xl">
            <DoubleExposure
              text="Shows pasados"
              as="h2"
              className="font-display text-sm uppercase tracking-[0.4em] mb-8 opacity-70"
            />
            <ul className="divide-y divide-teal/20">
              {past.map((s: Show) => (
                <li
                  key={s.id}
                  className="grid grid-cols-[100px_1fr] gap-4 py-3 font-display opacity-60"
                  style={{ color: "var(--color-teal)" }}
                >
                  <span className="text-sm tabular-nums">{s.show_date}</span>
                  <span>
                    {s.city} · <span className="opacity-80">{s.venue}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}

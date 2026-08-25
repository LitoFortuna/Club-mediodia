import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { adminDb } from "@/lib/firebase.server";
import { DoubleExposure } from "@/components/DoubleExposure";
import { ShowCard } from "@/components/ShowCard";
import { NewsletterForm } from "@/components/NewsletterForm";
import type { Show } from "@/lib/types";

const getShows = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const snapshot = await adminDb
      .collection("shows")
      .orderBy("show_date", "asc")
      .get();

    const shows: Show[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Show, "id">),
    }));

    return { shows, error: null as string | null };
  } catch (err) {
    console.error("Error loading shows:", err);
    return { shows: [] as Show[], error: "No se pudieron cargar las fechas." };
  }
});

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
    <div className="px-6 py-24 text-center text-orange">
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
      <section className="px-6 pt-16 md:pt-24 pb-16 bg-background relative overflow-hidden">
        <div className="absolute top-0 right-0 big-number opacity-5 translate-x-1/4 -translate-y-1/4 select-none">
          LIVE
        </div>
        <div className="mx-auto max-w-5xl relative z-10">
          <p className="font-display uppercase tracking-[0.4em] text-xs mb-6 text-arena font-semibold">
            Gira 2026
          </p>
          <h1 className="font-display text-6xl md:text-9xl font-bold tracking-tighter leading-[0.8] text-white">
            PRÓXIMAS<br />
            <span className="text-arena">FECHAS</span>
          </h1>
          <p className="mt-8 font-body text-lg md:text-xl max-w-xl text-white/50">
            Llevamos el mediodía a salas pequeñas. Ven a recordar con nosotros en la penumbra.
          </p>
        </div>
      </section>

      <section className="px-6 pb-24 bg-background">
        <div className="mx-auto max-w-4xl flex flex-col gap-4">
          {error && (
            <p className="text-center text-arena py-12 border border-arena/20 bg-arena/5">{error}</p>
          )}
          {!error && upcoming.length === 0 && (
            <div className="text-center py-24 border border-white/10 bg-white/5">
              <p className="font-display text-2xl text-white/40">
                No hay fechas anunciadas.<br />
                <span className="text-sm uppercase tracking-widest text-arena mt-4 block font-semibold">Pronto, en alguna terraza.</span>
              </p>
            </div>
          )}
          {upcoming.map((s: Show) => (
            <ShowCard key={s.id} show={s} />
          ))}
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="px-6 py-20 md:py-32 bg-arena text-black relative">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-4xl md:text-6xl font-bold tracking-tighter leading-tight mb-8">
            AÚN INTENTANDO RECORDAR QUÉ NOS DIJIMOS
          </h2>
          <p className="font-body text-lg mb-12 opacity-80 max-w-xl mx-auto">
            Suscríbete y te avisamos de nuevas fechas, lanzamientos y memorias borrosas antes que a nadie.
          </p>
          <div className="flex justify-center">
            <NewsletterForm />
          </div>
        </div>
      </section>

      {/* PAST */}
      {past.length > 0 && (
        <section className="px-6 py-24 bg-background border-t border-white/5">
          <div className="mx-auto max-w-4xl">
            <div className="flex items-center gap-4 mb-12">
              <h2 className="font-display text-sm uppercase tracking-[0.4em] text-white/40 whitespace-nowrap">
                Shows pasados
              </h2>
              <div className="h-[1px] flex-1 bg-white/10"></div>
            </div>
            <ul className="space-y-4">
              {past.map((s: Show) => (
                <li
                  key={s.id}
                  className="grid grid-cols-[120px_1fr] gap-6 py-4 font-display border-b border-white/5 text-white/40 hover:text-white transition-colors group"
                >
                  <span className="text-sm tabular-nums opacity-50 group-hover:text-accent transition-colors">{s.show_date}</span>
                  <span className="text-lg">
                    {s.city} <span className="mx-2 text-white/10">/</span> <span className="opacity-60">{s.venue}</span>
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

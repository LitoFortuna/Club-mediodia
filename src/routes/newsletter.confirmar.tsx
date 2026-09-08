import { createFileRoute, Link } from "@tanstack/react-router";
import { confirmNewsletter } from "@/api/newsletter.functions";

export const Route = createFileRoute("/newsletter/confirmar")({
  head: () => ({
    meta: [
      { title: "Confirmar suscripción — Club Mediodía" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  validateSearch: (search: Record<string, unknown>): { t?: string } =>
    typeof search.t === "string" ? { t: search.t } : {},
  loaderDeps: ({ search }) => ({ t: search.t }),
  loader: async ({ deps }) => {
    if (!deps.t) return { ok: false, message: "Falta el código de confirmación." };
    try {
      return await confirmNewsletter({ data: { token: deps.t } });
    } catch {
      return { ok: false, message: "No pudimos procesar la confirmación. Inténtalo más tarde." };
    }
  },
  component: ConfirmarPage,
});

function ConfirmarPage() {
  const { ok, message } = Route.useLoaderData();

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 bg-background">
      <div className="max-w-md text-center">
        <p
          className={`font-display text-2xl md:text-3xl font-bold uppercase tracking-tight mb-4 ${
            ok ? "text-orange" : "text-rojo"
          }`}
        >
          {ok ? "Suscripción confirmada" : "No se pudo confirmar"}
        </p>
        <p className="text-white/70 font-body mb-8">{message}</p>
        <Link
          to="/"
          className="inline-flex items-center justify-center px-6 py-3 font-display uppercase tracking-widest text-sm hard-shadow"
          style={{ background: "var(--color-globo)", color: "var(--color-arena)" }}
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}

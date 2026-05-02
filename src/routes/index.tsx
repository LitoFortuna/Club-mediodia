import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { DoubleExposure } from "@/components/DoubleExposure";
import balloon from "@/assets/balloon.png";
import albumCover from "@/assets/album-cover.jpg";
import bandPhoto from "@/assets/band-photo.jpg";

const getNextShow = createServerFn({ method: "GET" }).handler(async () => {
  const today = new Date().toISOString().slice(0, 10);
  const { data, error } = await supabaseAdmin
    .from("shows")
    .select("*")
    .gte("show_date", today)
    .order("show_date", { ascending: true })
    .limit(1)
    .maybeSingle();
  if (error) {
    console.error("getNextShow error:", error);
    return { show: null };
  }
  return { show: data };
});

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Club Mediodía — Un globo en la terraza" },
      {
        name: "description",
        content:
          "Vivimos en el mediodía mental. Club Mediodía: psicodelia doméstica y memoria borrosa. Nuevo álbum próximamente.",
      },
      { property: "og:title", content: "Club Mediodía — Un globo en la terraza" },
      {
        property: "og:description",
        content: "Memoria borrosa al mediodía. Nuevo álbum: Un globo en la terraza.",
      },
    ],
  }),
  loader: () => getNextShow(),
  component: Index,
  errorComponent: ({ error }) => (
    <div className="px-6 py-24 text-center" style={{ color: "var(--color-teal)" }}>
      <p>{error.message}</p>
    </div>
  ),
});

function Index() {
  const { show } = Route.useLoaderData();

  return (
    <>
      {/* HERO */}
      <section
        className="relative min-h-[88vh] overflow-hidden flex items-center justify-center"
        style={{
          background:
            "linear-gradient(180deg, var(--color-sky) 0%, oklch(0.88 0.07 220) 60%, var(--color-arena) 100%)",
        }}
      >
        {/* sol difuso */}
        <div
          className="absolute top-[18%] left-1/2 -translate-x-1/2 w-[420px] h-[420px] rounded-full opacity-60 blur-3xl"
          style={{ background: "var(--color-arena)" }}
          aria-hidden="true"
        />
        {/* globo grande flotando */}
        <img
          src={balloon}
          alt=""
          width={220}
          height={280}
          className="absolute right-[8%] md:right-[15%] top-[20%] w-32 md:w-52 balloon-float"
          style={{ filter: "drop-shadow(8px 14px 0 rgba(1,148,127,0.55))" }}
        />

        <div className="relative z-10 px-6 max-w-5xl text-center">
          <p
            className="font-display uppercase tracking-[0.4em] text-xs md:text-sm mb-6 opacity-80"
            style={{ color: "var(--color-teal)" }}
          >
            Nuevo álbum · 2026
          </p>
          <h1 className="font-display font-bold text-5xl sm:text-7xl md:text-8xl leading-[0.95] tracking-tighter eroded">
            <span className="double-expo block" data-text="Un globo">Un globo</span>
            <span className="double-expo block" data-text="en la terraza">en la terraza</span>
          </h1>
          <p
            className="mt-8 font-body text-lg md:text-xl max-w-2xl mx-auto"
            style={{ color: "var(--color-teal)" }}
          >
            Memoria borrosa al mediodía. Una grabación de Club Mediodía.
          </p>
          <div className="mt-10 flex gap-4 justify-center flex-wrap">
            <Link
              to="/musica"
              className="px-7 py-3 font-display uppercase tracking-widest text-sm hard-shadow transition-transform hover:translate-x-[-2px] hover:translate-y-[-2px]"
              style={{ background: "var(--color-globo)", color: "var(--color-arena)" }}
            >
              Escuchar
            </Link>
            <Link
              to="/shows"
              className="px-7 py-3 font-display uppercase tracking-widest text-sm border-2 transition-transform hover:scale-105"
              style={{ borderColor: "var(--color-teal)", color: "var(--color-teal)" }}
            >
              Próximas fechas
            </Link>
          </div>
        </div>
      </section>

      {/* MANIFIESTO */}
      <section className="px-6 py-24 md:py-32" style={{ background: "var(--color-arena)" }}>
        <div className="mx-auto max-w-3xl">
          <DoubleExposure
            text="Manifiesto"
            as="h2"
            className="font-display text-sm uppercase tracking-[0.4em] mb-10 opacity-70"
          />
          <div
            className="font-display text-2xl md:text-3xl leading-snug font-medium space-y-6"
            style={{ color: "var(--color-teal)" }}
          >
            <p>
              Vivimos en el <em style={{ color: "var(--color-globo)", fontStyle: "normal" }}>mediodía mental</em>.
              Ese instante suspendido bajo un cielo pálido, donde el calor pesa demasiado para moverse y la mente empieza a divagar.
            </p>
            <p>
              Somos los observadores de la <em style={{ color: "var(--color-globo)", fontStyle: "normal" }}>psicodelia doméstica</em>:
              un globo rojo abandonado en una terraza, una taza a medio beber, el reflejo distorsionado en una ventana.
            </p>
            <p>
              No confiamos en nuestra <em style={{ color: "var(--color-globo)", fontStyle: "normal" }}>memoria</em>; sabemos que la luz dura del mediodía erosiona los recuerdos y nos deja con miles de versiones de lo que nos dijimos.
            </p>
            <p>
              Nuestra música es el eco de un domingo largo que se resiste a terminar.
            </p>
          </div>
        </div>
      </section>

      {/* ANTICIPO ÁLBUM */}
      <section className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl grid md:grid-cols-2 gap-12 items-center">
          <Link to="/musica" className="block group">
            <img
              src={albumCover}
              alt="Portada del álbum Un globo en la terraza"
              width={1024}
              height={1024}
              loading="lazy"
              className="w-full hard-shadow-lg transition-transform group-hover:translate-x-[-4px] group-hover:translate-y-[-4px]"
            />
          </Link>
          <div>
            <p
              className="font-display uppercase tracking-[0.4em] text-xs mb-4 opacity-70"
              style={{ color: "var(--color-teal)" }}
            >
              El álbum
            </p>
            <DoubleExposure
              text="Memoria borrosa al mediodía"
              as="h2"
              className="font-display text-4xl md:text-5xl font-bold tracking-tighter leading-tight"
            />
            <p
              className="mt-6 font-body text-lg max-w-md"
              style={{ color: "var(--color-teal)" }}
            >
              Diez canciones grabadas en una terraza de barrio. Diez intentos
              de recordar lo mismo de diez maneras distintas.
            </p>
            <Link
              to="/musica"
              className="inline-block mt-8 px-7 py-3 font-display uppercase tracking-widest text-sm hard-shadow transition-transform hover:translate-x-[-2px] hover:translate-y-[-2px]"
              style={{ background: "var(--color-globo)", color: "var(--color-arena)" }}
            >
              Escuchar el álbum
            </Link>
          </div>
        </div>
      </section>

      {/* NEXT SHOW */}
      {show && (
        <section
          className="px-6 py-20"
          style={{ background: "var(--color-sky)" }}
        >
          <div className="mx-auto max-w-4xl text-center">
            <p
              className="font-display uppercase tracking-[0.4em] text-xs mb-4 opacity-80"
              style={{ color: "var(--color-teal)" }}
            >
              Próximo show
            </p>
            <h2
              className="font-display text-4xl md:text-6xl font-bold tracking-tighter eroded"
              style={{ color: "var(--color-teal)" }}
            >
              {show.city} · {new Date(show.show_date + "T00:00:00").toLocaleDateString("es-ES", { day: "numeric", month: "long" })}
            </h2>
            <p
              className="mt-3 font-body text-lg"
              style={{ color: "var(--color-teal)" }}
            >
              {show.venue}{show.show_time ? ` · ${show.show_time}h` : ""}
            </p>
            <Link
              to="/shows"
              className="inline-block mt-8 px-7 py-3 font-display uppercase tracking-widest text-sm hard-shadow transition-transform hover:translate-x-[-2px] hover:translate-y-[-2px]"
              style={{ background: "var(--color-globo)", color: "var(--color-arena)" }}
            >
              Todas las fechas
            </Link>
          </div>
        </section>
      )}

      {/* BIO */}
      <section className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <DoubleExposure
              text="La banda"
              as="h2"
              className="font-display text-sm uppercase tracking-[0.4em] mb-6 opacity-70"
            />
            <p
              className="font-display text-2xl md:text-3xl font-medium leading-snug"
              style={{ color: "var(--color-teal)" }}
            >
              Cuatro personas escribiendo canciones desde la misma terraza desde hace demasiado tiempo.
            </p>
            <p
              className="mt-6 font-body text-base md:text-lg max-w-md opacity-80"
              style={{ color: "var(--color-teal)" }}
            >
              Influencias entre la guitarra de cámara, el indie de los noventa y los domingos largos.
              Club Mediodía nació en un mediodía cualquiera, observando un globo rojo
              que nadie se atrevía a recoger.
            </p>
          </div>
          <div className="order-1 md:order-2">
            <img
              src={bandPhoto}
              alt="Club Mediodía — la banda"
              width={1600}
              height={1067}
              loading="lazy"
              className="w-full hard-shadow"
              style={{ filter: "saturate(1.05) contrast(1.05)" }}
            />
          </div>
        </div>
      </section>
    </>
  );
}

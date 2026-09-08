import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { adminDb } from "@/lib/firebase.server";
import { DoubleExposure } from "@/components/DoubleExposure";
import balloon from "@/assets/balloon.png";
import albumCover from "@/assets/CM_portada.jpg";
import albumCoverWebp from "@/assets/CM_portada.webp";
import bandPhoto from "@/assets/CM_header.jpg";
import bandPhotoWebp from "@/assets/CM_header.webp";
import { Pic } from "@/components/Pic";

const getNextShow = createServerFn({ method: "GET" }).handler(async () => {
  const today = new Date().toISOString().slice(0, 10);
  try {
    const snapshot = await adminDb
      .collection("shows")
      .where("show_date", ">=", today)
      .orderBy("show_date", "asc")
      .limit(1)
      .get();

    if (snapshot.empty) return { show: null };
    const doc = snapshot.docs[0];
    return { show: { id: doc.id, ...doc.data() } };
  } catch (err) {
    console.error("getNextShow error:", err);
    return { show: null };
  }
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
    links: [{ rel: "canonical", href: "https://clubmediodia.es/" }],
  }),
  loader: () => getNextShow(),
  component: Index,
  errorComponent: ({ error }) => (
    <div className="px-6 py-24 text-center" style={{ color: "var(--color-teal)" }}>
      <p>{error instanceof Error ? error.message : "No se pudo cargar."}</p>
    </div>
  ),
});

function Index() {
  const { show } = Route.useLoaderData();

  return (
    <div className="bg-black text-white selection:bg-orange selection:text-black">
      {/* HERO SECTION */}
      <section className="relative min-h-screen flex flex-col md:flex-row items-center justify-center overflow-hidden smoke-gradient px-6 py-20">
        {/* Vertical Decoration Text */}
        <div className="absolute left-6 top-1/2 -translate-y-1/2 hidden lg:block">
          <p className="text-vertical text-6xl font-display font-black opacity-10 tracking-tighter uppercase select-none">
            Club Mediodía · Club Mediodía · Club Mediodía
          </p>
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <p className="text-orange font-display font-bold tracking-[0.3em] text-xs mb-4 uppercase">
              Nuevo álbum · 2026
            </p>
            <h1 className="text-6xl sm:text-8xl md:text-9xl font-display font-black leading-[0.8] tracking-tighter uppercase mb-8">
              <span className="block">Un globo</span>
              <span className="block text-orange">en la terraza</span>
            </h1>
            <p className="text-gray-400 font-body text-lg md:text-xl max-w-xl mb-10 leading-relaxed">
              Memoria borrosa al mediodía. Una grabación visceral de Club Mediodía capturada en una azotea de barrio.
            </p>
            <div className="flex flex-wrap gap-6">
              <Link
                to="/musica"
                className="px-10 py-4 bg-orange text-black font-display font-bold uppercase tracking-widest text-sm transition-all hover:bg-white hover:scale-105 active:scale-95"
              >
                Escuchar ahora
              </Link>
              <Link
                to="/shows"
                className="px-10 py-4 border border-white/20 font-display font-bold uppercase tracking-widest text-sm transition-all hover:bg-white hover:text-black"
              >
                Shows
              </Link>
            </div>
          </div>

          <div className="order-1 lg:order-2 relative">
            <div className="relative aspect-square w-full max-w-md mx-auto">
              <div className="absolute -inset-4 border border-orange/30 translate-x-4 translate-y-4 -z-10" />
              <Pic
                jpg={albumCover}
                webp={albumCoverWebp}
                alt="Portada del álbum «Un globo en la terraza» de Club Mediodía"
                wrapperClassName="block w-full h-full"
                className="w-full h-full object-cover bw-high-contrast hard-shadow shadow-orange/20"
                fetchPriority="high"
              />
              <div className="absolute -bottom-6 -right-6 text-8xl font-display font-black text-orange/10 select-none">
                01
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MANIFESTO SECTION */}
      <section className="relative py-32 border-t border-white/5 overflow-hidden">
        <div className="absolute right-0 top-0 big-number select-none">
          02
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-[1fr_2fr] gap-12 items-start">
            <h2 className="text-vertical text-4xl md:text-6xl font-display font-black text-rojo sticky top-24">
              Manifiesto
            </h2>
            <div className="space-y-12 text-2xl md:text-4xl font-display font-bold leading-tight tracking-tight uppercase">
              <p className="mediodia-enter">
                Vivimos en el <span className="text-cielo">mediodía mental</span>.
                Ese instante suspendido donde el calor pesa demasiado para moverse.
              </p>
              <p className="mediodia-enter [animation-delay:200ms]">
                Somos los observadores de la <span className="text-arena">psicodelia doméstica</span>:
                un globo abandonado, una taza fría, el reflejo distorsionado.
              </p>
              <p className="mediodia-enter [animation-delay:400ms] text-gray-500">
                No confiamos en la memoria; la luz erosiona los recuerdos y nos deja solo ecos de lo que fuimos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SHOWS SECTION (Asymmetric) */}
      {show && (
        <section className="py-32 bg-zinc-950 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-20 items-center">
            <div className="relative">
              <Pic
                jpg={bandPhoto}
                webp={bandPhotoWebp}
                alt="Club Mediodía"
                loading="lazy"
                className="w-full aspect-[4/5] object-cover bw-high-contrast grayscale opacity-50"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
              <div className="absolute -bottom-10 -left-10 big-number select-none text-white/5">
                03
              </div>
            </div>
            
            <div>
              <p className="text-arena font-display font-bold tracking-[0.3em] text-xs mb-6 uppercase">
                Próxima fecha
              </p>
              <h2 className="text-5xl md:text-8xl font-display font-black leading-[0.85] tracking-tighter uppercase mb-8">
                {show.city} <br />
                <span className="text-arena">{new Date(show.show_date + "T00:00:00").toLocaleDateString("es-ES", { day: "numeric", month: "long" })}</span>
              </h2>
              <div className="space-y-2 mb-12">
                <p className="text-xl font-display font-bold uppercase">{show.venue}</p>
                <p className="text-gray-500 font-display uppercase tracking-widest text-sm">{show.show_time ? `${show.show_time}H` : "HORARIO POR CONFIRMAR"}</p>
              </div>
              <Link
                to="/shows"
                className="inline-block px-10 py-4 bg-white text-black font-display font-bold uppercase tracking-widest text-sm transition-all hover:bg-arena hover:text-black"
              >
                Ver todas las fechas
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* FOOTER CALL TO ACTION */}
      <section className="py-40 text-center relative overflow-hidden">
        <div className="big-number absolute inset-0 flex items-center justify-center opacity-5 select-none">
          MEDIODÍA
        </div>
        <div className="relative z-10">
          <h2 className="text-5xl md:text-9xl font-display font-black tracking-tighter uppercase mb-12">
            Explora el <br /> <span className="text-rojo">Universo</span>
          </h2>
          <div className="flex justify-center gap-8 font-display font-bold uppercase tracking-[0.4em] text-sm md:text-base">
            <Link to="/musica" className="hover:text-cielo transition-colors">Música</Link>
            <Link to="/el-club" className="hover:text-menta transition-colors">El Club</Link>
            <Link to="/shows" className="hover:text-arena transition-colors">Shows</Link>
            <Link to="/contacto" className="hover:text-rojo transition-colors">Contacto</Link>
          </div>
        </div>
      </section>
    </div>
  );
}


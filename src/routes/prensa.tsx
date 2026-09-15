import { createFileRoute } from "@tanstack/react-router";
import { BAND, ALBUM, SITE_URL } from "@/lib/band";
import { Download } from "lucide-react";

export const Route = createFileRoute("/prensa")({
  head: () => ({
    meta: [
      { title: "Prensa / EPK — Club Mediodía" },
      {
        name: "description",
        content:
          "Kit de prensa de Club Mediodía: biografía, fotos, logos y datos técnicos para medios, festivales y programadores.",
      },
      { property: "og:title", content: "Prensa / EPK — Club Mediodía" },
      {
        property: "og:description",
        content: "Biografía, fotos en alta resolución, logos y contacto de prensa de Club Mediodía.",
      },
      { property: "og:image", content: `${SITE_URL}/og-default.jpg` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/prensa` }],
  }),
  component: PrensaPage,
});

const bioCorta =
  "Club Mediodía es un trío de Barcelona que explora la psicodelia doméstica: canciones que viven en el " +
  "espacio entre el recuerdo y la distorsión. Su álbum debut, «Un globo en la terraza» (1 de mayo de 2026), " +
  "retrata la vida cotidiana atravesada por estados mentales cambiantes — recuerdos, ansiedad, nostalgia, deseo.";

const bioLarga = [
  "Club Mediodía no es solo una banda; es un estado mental. Nacidos en la penumbra de una terraza calurosa, " +
    "el trío barcelonés busca capturar el sonido de lo que se olvida.",
  "Su música habita en el espacio entre el recuerdo y la distorsión. «Un globo en la terraza», su álbum debut, " +
    "retrata la vida cotidiana atravesada por estados mentales cambiantes: recuerdos, ansiedad, nostalgia, deseo. " +
    "Momentos comunes que, vistos desde dentro, se vuelven extraños, intensos o ligeramente irreales.",
  "Grabado en El Patio Estudio (Barcelona) y producido por Daniel O'Connell (O'Connell Mastering), el disco reúne " +
    "ocho canciones que van de la psicodelia doméstica a la memoria borrosa, siempre con un pie en la terraza y " +
    "otro en el mediodía mental.",
];

const downloads = [
  {
    label: "Foto de banda (alta resolución)",
    file: "/press/club-mediodia-foto-banda.jpg",
    meta: "JPG · alta resolución",
  },
  {
    label: "Portada del álbum",
    file: "/press/club-mediodia-portada-album.jpg",
    meta: "JPG · alta resolución",
  },
  {
    label: "Logo (fondo claro)",
    file: "/press/club-mediodia-logo-positivo.png",
    meta: "PNG · fondo transparente",
  },
  {
    label: "Logo (fondo oscuro)",
    file: "/press/club-mediodia-logo-negativo.png",
    meta: "PNG · fondo transparente",
  },
];

function PrensaPage() {
  return (
    <div className="bg-black text-white selection:bg-orange selection:text-black">
      {/* HERO */}
      <section className="px-6 pt-24 pb-16 md:pt-32">
        <div className="mx-auto max-w-5xl">
          <p className="font-display uppercase tracking-[0.4em] text-xs mb-4 text-menta font-semibold">
            Kit de prensa
          </p>
          <h1 className="font-display text-6xl md:text-8xl font-black tracking-tighter uppercase leading-none">
            PRENSA <span className="text-menta">& EPK</span>
          </h1>
          <p className="mt-8 font-body text-lg md:text-xl text-gray-400 max-w-2xl leading-relaxed">
            {bioCorta}
          </p>
        </div>
      </section>

      {/* FICHA TÉCNICA */}
      <section className="px-6 py-16 border-t border-white/5 bg-zinc-950/60">
        <div className="mx-auto max-w-5xl grid md:grid-cols-2 gap-16">
          <div>
            <h2 className="font-display text-xs uppercase tracking-[0.4em] text-menta font-bold mb-6">
              Ficha técnica
            </h2>
            <dl className="space-y-4 font-body text-sm">
              <div className="flex justify-between border-b border-white/5 pb-3">
                <dt className="text-gray-500">Nombre</dt>
                <dd className="text-white">{BAND.name}</dd>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-3">
                <dt className="text-gray-500">Origen</dt>
                <dd className="text-white">{BAND.foundingLocation}</dd>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-3">
                <dt className="text-gray-500">Género</dt>
                <dd className="text-white">{BAND.genre.join(", ")}</dd>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-3">
                <dt className="text-gray-500">Formación</dt>
                <dd className="text-white text-right">Trío</dd>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-3">
                <dt className="text-gray-500">Álbum</dt>
                <dd className="text-white text-right">«{ALBUM.name}»</dd>
              </div>
              <div className="flex justify-between pb-3">
                <dt className="text-gray-500">Lanzamiento</dt>
                <dd className="text-white">1 de mayo de 2026</dd>
              </div>
            </dl>
          </div>

          <div>
            <h2 className="font-display text-xs uppercase tracking-[0.4em] text-menta font-bold mb-6">
              Miembros
            </h2>
            <ul className="space-y-4 font-body text-sm">
              {BAND.members.map((m) => (
                <li key={m.name} className="border-b border-white/5 pb-3">
                  <p className="text-white font-semibold">{m.name}</p>
                  <p className="text-gray-500">{m.role}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* BIOGRAFÍA */}
      <section className="px-6 py-24 border-t border-white/5">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-xs uppercase tracking-[0.4em] text-menta font-bold mb-8">
            Biografía
          </h2>
          <div className="space-y-6 font-body text-base md:text-lg text-gray-400 leading-relaxed">
            {bioLarga.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      {/* DESCARGAS */}
      <section className="px-6 py-24 border-t border-white/5 bg-zinc-950/60">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-display text-xs uppercase tracking-[0.4em] text-menta font-bold mb-10">
            Material descargable
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {downloads.map((d) => (
              <a
                key={d.file}
                href={d.file}
                download
                className="group flex items-center justify-between gap-4 p-6 border border-white/10 hover:border-menta/50 bg-black/40 transition-colors"
              >
                <div>
                  <p className="font-display font-bold uppercase tracking-tight text-white group-hover:text-menta transition-colors">
                    {d.label}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{d.meta}</p>
                </div>
                <Download className="shrink-0 text-gray-600 group-hover:text-menta transition-colors" size={20} />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ENLACES */}
      <section className="px-6 py-24 border-t border-white/5">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-display text-xs uppercase tracking-[0.4em] text-menta font-bold mb-10">
            Enlaces
          </h2>
          <div className="flex flex-wrap gap-4">
            {BAND.sameAs.map((url) => (
              <a
                key={url}
                href={url}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3 font-display uppercase tracking-widest text-[10px] border border-white/10 text-white/60 hover:border-menta hover:text-menta transition-all"
              >
                {new URL(url).hostname.replace("www.", "")}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACTO DE PRENSA */}
      <section className="px-6 py-32 text-center border-t border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[16vw] font-black font-display uppercase tracking-tighter select-none">
            PRENSA
          </div>
        </div>
        <div className="relative z-10">
          <h2 className="font-display text-3xl md:text-5xl font-black uppercase tracking-tighter mb-6">
            Contacto de prensa
          </h2>
          <p className="text-gray-400 font-body mb-8 max-w-md mx-auto">
            Para entrevistas, cobertura, programación en festivales o cualquier gestión con medios.
          </p>
          <a
            href="mailto:info@clubmediodia.es?subject=Prensa%20/%20Booking"
            className="inline-block px-10 py-4 bg-menta text-black font-display font-bold uppercase tracking-widest text-sm transition-all hover:bg-white hover:scale-105"
          >
            info@clubmediodia.es
          </a>
        </div>
      </section>
    </div>
  );
}

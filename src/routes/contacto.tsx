import { createFileRoute } from "@tanstack/react-router";
import { DoubleExposure } from "@/components/DoubleExposure";
import { ContactForm } from "@/components/ContactForm";
import { Instagram, Youtube, Music2, Mail } from "lucide-react";

export const Route = createFileRoute("/contacto")({
  head: () => ({
    meta: [
      { title: "Contacto — Club Mediodía" },
      {
        name: "description",
        content:
          "Booking, prensa y management de Club Mediodía. Escríbenos.",
      },
      { property: "og:title", content: "Contacto — Club Mediodía" },
      { property: "og:description", content: "Booking, prensa, management y más." },
    ],
  }),
  component: ContactoPage,
});

function ContactoPage() {
  return (
    <>
      <section className="px-6 pt-16 md:pt-24 pb-16 bg-background relative overflow-hidden">
        <div className="absolute top-0 left-0 big-number opacity-5 -translate-x-1/4 -translate-y-1/4 select-none">
          HOLA
        </div>
        <div className="mx-auto max-w-4xl relative z-10">
          <p className="font-display uppercase tracking-[0.4em] text-xs mb-6 text-accent">
            Escríbenos
          </p>
          <h1 className="font-display text-6xl md:text-9xl font-bold tracking-tighter leading-[0.8] text-white">
            CON<span className="text-accent">TACTO</span>
          </h1>
          <p className="mt-8 font-body text-lg md:text-xl max-w-xl text-white/50">
            Booking, prensa, management o simplemente recordar algo juntos. Estamos al otro lado.
          </p>
        </div>
      </section>

      <section className="px-6 pb-32 bg-background">
        <div className="mx-auto max-w-5xl grid md:grid-cols-[1.5fr_1fr] gap-16 items-start">
          <div className="p-1 border border-white/10 bg-white/5">
            <div className="p-8 md:p-12 border border-white/10 bg-background">
              <ContactForm />
            </div>
          </div>

          <aside className="space-y-12 py-4">
            <div className="group">
              <p className="font-display uppercase tracking-widest text-[10px] mb-4 text-rojo font-bold">
                Email directo
              </p>
              <a
                href="mailto:info@clubmediodia.es"
                className="font-display text-xl md:text-2xl text-white hover:text-rojo transition-colors flex items-center gap-3"
              >
                <Mail size={20} className="text-rojo" />
                info@clubmediodia.es
              </a>
            </div>

            <div>
              <p className="font-display uppercase tracking-widest text-[10px] mb-6 text-white/40">
                Redes
              </p>
              <div className="flex gap-6">
                {[
                  { icon: Instagram, label: "Instagram", url: "https://www.instagram.com/club.mediodia/" },
                  { icon: Youtube, label: "YouTube", url: "https://www.youtube.com/channel/UCobKsproqA8miDdGqqVNwRA" },
                  { icon: Music2, label: "Spotify", url: "https://open.spotify.com/artist/573822769419" },
                ].map((social) => (
                  <a
                    key={social.label}
                    href={social.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.label}
                    className="p-3 border border-white/10 text-white/60 hover:text-arena hover:border-arena transition-all"
                  >
                    <social.icon size={24} />
                  </a>
                ))}
              </div>
            </div>

            <div className="pt-8">
              <div className="p-6 border-l-2 border-arena bg-arena/5">
                <p className="font-body text-sm text-white/60 italic">
                  "El mediodía es el único momento donde la sombra no nos puede engañar."
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>

    </>
  );
}

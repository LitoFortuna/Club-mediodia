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
      <section className="px-6 pt-16 md:pt-24 pb-12 text-center">
        <div className="mx-auto max-w-4xl">
          <p
            className="font-display uppercase tracking-[0.4em] text-xs mb-6 opacity-70"
            style={{ color: "var(--color-teal)" }}
          >
            Escríbenos
          </p>
          <h1 className="font-display text-5xl md:text-8xl font-bold tracking-tighter eroded">
            <span className="double-expo" data-text="Contacto">Contacto</span>
          </h1>
          <p
            className="mt-6 font-body text-lg md:text-xl max-w-xl mx-auto"
            style={{ color: "var(--color-teal)" }}
          >
            Booking, prensa, management o simplemente recordar algo juntos.
          </p>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto max-w-5xl grid md:grid-cols-[1.5fr_1fr] gap-12">
          <div
            className="p-6 md:p-10 hard-shadow border-2 border-teal/30"
            style={{ background: "var(--color-arena)" }}
          >
            <ContactForm />
          </div>

          <aside className="space-y-8">
            <div>
              <p
                className="font-display uppercase tracking-widest text-xs mb-3 opacity-70"
                style={{ color: "var(--color-teal)" }}
              >
                Email directo
              </p>
              <a
                href="mailto:hola@clubmediodia.com"
                className="memory-link font-display text-lg flex items-center gap-2"
              >
                <Mail size={18} />
                hola@clubmediodia.com
              </a>
            </div>

            <div>
              <p
                className="font-display uppercase tracking-widest text-xs mb-3 opacity-70"
                style={{ color: "var(--color-teal)" }}
              >
                Booking
              </p>
              <a
                href="mailto:booking@clubmediodia.com"
                className="memory-link font-display text-lg flex items-center gap-2"
              >
                <Mail size={18} />
                booking@clubmediodia.com
              </a>
            </div>

            <div>
              <p
                className="font-display uppercase tracking-widest text-xs mb-3 opacity-70"
                style={{ color: "var(--color-teal)" }}
              >
                Redes
              </p>
              <div className="flex gap-4">
                <a href="https://instagram.com" target="_blank" rel="noreferrer"
                   aria-label="Instagram" className="memory-link">
                  <Instagram size={26} />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noreferrer"
                   aria-label="YouTube" className="memory-link">
                  <Youtube size={26} />
                </a>
                <a href="https://open.spotify.com" target="_blank" rel="noreferrer"
                   aria-label="Spotify" className="memory-link">
                  <Music2 size={26} />
                </a>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}

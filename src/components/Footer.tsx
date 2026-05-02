import { Link } from "@tanstack/react-router";
import { Instagram, Youtube, Music2 } from "lucide-react";

export function Footer() {
  return (
    <footer
      className="mt-24 border-t border-teal/20 px-6 py-12"
      style={{ background: "var(--color-arena)" }}
    >
      <div className="mx-auto max-w-7xl grid gap-8 md:grid-cols-3">
        <div>
          <p
            className="font-display text-2xl font-bold tracking-tighter"
            style={{ color: "var(--color-teal)" }}
          >
            CLUB MEDIODÍA
          </p>
          <p className="mt-3 text-sm max-w-xs" style={{ color: "var(--color-teal)" }}>
            Memoria borrosa al mediodía. Un globo en la terraza —
            disponible próximamente.
          </p>
        </div>

        <div className="flex flex-col gap-2 font-display uppercase tracking-widest text-sm">
          <Link to="/" className="memory-link w-fit">Inicio</Link>
          <Link to="/musica" className="memory-link w-fit">Música</Link>
          <Link to="/shows" className="memory-link w-fit">Shows</Link>
          <Link to="/contacto" className="memory-link w-fit">Contacto</Link>
        </div>

        <div className="flex flex-col gap-3">
          <p
            className="font-display uppercase tracking-widest text-sm"
            style={{ color: "var(--color-teal)" }}
          >
            Síguenos
          </p>
          <div className="flex gap-4">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="memory-link"
            >
              <Instagram size={22} />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              aria-label="YouTube"
              className="memory-link"
            >
              <Youtube size={22} />
            </a>
            <a
              href="https://open.spotify.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Spotify"
              className="memory-link"
            >
              <Music2 size={22} />
            </a>
          </div>
          <p className="text-xs mt-3 opacity-60" style={{ color: "var(--color-teal)" }}>
            © {new Date().getFullYear()} Club Mediodía
          </p>
        </div>
      </div>
    </footer>
  );
}

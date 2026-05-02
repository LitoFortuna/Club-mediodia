import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { to: "/", label: "Inicio" },
  { to: "/musica", label: "Música" },
  { to: "/shows", label: "Shows" },
  { to: "/contacto", label: "Contacto" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-background/70 border-b border-teal/20">
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        <Link
          to="/"
          onClick={() => setOpen(false)}
          className="font-display text-xl md:text-2xl font-bold tracking-tighter eroded"
          style={{ color: "var(--color-teal)" }}
        >
          <span className="double-expo" data-text="CLUB MEDIODÍA">
            CLUB MEDIODÍA
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 font-display text-sm uppercase tracking-widest">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="memory-link"
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <button
          className="md:hidden text-teal"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menú"
          style={{ color: "var(--color-teal)" }}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <nav className="md:hidden border-t border-teal/20 bg-background/95">
          <ul className="flex flex-col px-6 py-4 gap-4 font-display uppercase tracking-widest text-sm">
            {links.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="memory-link block"
                  activeOptions={{ exact: l.to === "/" }}
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}

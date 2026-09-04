import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
const logo = "/logo.png";

const links = [
  { to: "/", label: "Inicio" },
  { to: "/musica", label: "Música" },
  { to: "/el-club", label: "El Club" },
  { to: "/shows", label: "Shows" },
  { to: "/entradas", label: "Entradas" },
  { to: "/contacto", label: "Contacto" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-black border-b border-white/5">
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        <Link
          to="/"
          onClick={() => setOpen(false)}
          className="h-8 md:h-10 block"
        >
          <img src={logo} alt="Club Mediodía" className="h-full object-contain" />
        </Link>

        <nav className="hidden md:flex items-center gap-10 font-display text-xs font-bold uppercase tracking-[0.3em]">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-white/60 hover:text-orange transition-colors"
              activeProps={{ className: "text-orange" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <button
          className="md:hidden text-white"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menú"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <nav className="md:hidden border-t border-white/5 bg-black">
          <ul className="flex flex-col px-6 py-8 gap-6 font-display font-bold uppercase tracking-[0.3em] text-sm">
            {links.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="text-white/60 active:text-orange"
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


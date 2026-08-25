import { Link } from "@tanstack/react-router";
import { Instagram, Youtube, Music2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-black border-t border-white/5 px-6 py-24">
      <div className="mx-auto max-w-7xl grid gap-16 md:grid-cols-3">
        <div>
          <p className="font-display text-2xl font-black tracking-tighter">
            <span className="text-white">CLUB</span>
            <span className="text-orange">MEDIODÍA</span>
          </p>
          <p className="mt-4 text-sm max-w-xs text-gray-500 font-body leading-relaxed">
            Explorando la psicodelia doméstica y la memoria borrosa desde la terraza.
          </p>
          <p className="text-xs mt-6 text-gray-700">
            © {new Date().getFullYear()} Club Mediodía
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 font-display font-bold uppercase tracking-[0.2em] text-xs">
          <Link to="/" className="text-gray-500 hover:text-orange transition-colors">Inicio</Link>
          <Link to="/musica" className="text-gray-500 hover:text-orange transition-colors">Música</Link>
          <Link to="/el-club" className="text-gray-500 hover:text-orange transition-colors">El Club</Link>
          <Link to="/shows" className="text-gray-500 hover:text-orange transition-colors">Shows</Link>
          <Link to="/contacto" className="text-gray-500 hover:text-orange transition-colors">Contacto</Link>
        </div>

        <div className="flex flex-col gap-6">
          <p className="font-display font-bold uppercase tracking-[0.3em] text-xs text-orange">
            CONECTA
          </p>
          <div className="flex gap-6">
            <a
              href="https://www.instagram.com/club.mediodia/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="text-white hover:text-orange transition-all hover:scale-110"
            >
              <Instagram size={20} />
            </a>
            <a
              href="https://www.youtube.com/channel/UCobKsproqA8miDdGqqVNwRA"
              target="_blank"
              rel="noreferrer"
              aria-label="YouTube"
              className="text-white hover:text-orange transition-all hover:scale-110"
            >
              <Youtube size={20} />
            </a>
            <a
              href="https://open.spotify.com/artist/573822769419"
              target="_blank"
              rel="noreferrer"
              aria-label="Spotify"
              className="text-white hover:text-orange transition-all hover:scale-110"
            >
              <Music2 size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}


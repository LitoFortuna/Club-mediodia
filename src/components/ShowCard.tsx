import type { Show } from "@/lib/types";

const months = [
  "Ene", "Feb", "Mar", "Abr", "May", "Jun",
  "Jul", "Ago", "Sep", "Oct", "Nov", "Dic",
];

export function ShowCard({ show }: { show: Show }) {
  const d = new Date(show.show_date + "T00:00:00");
  const day = d.getDate();
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  const poster = show.poster_url ?? null;
  // Si el cartel es un .jpg servido por nosotros, hay una versión .webp al lado
  const posterWebp = poster && poster.startsWith("/") && poster.endsWith(".jpg")
    ? poster.replace(/\.jpg$/, ".webp")
    : null;

  return (
    <div className="group relative flex flex-col md:flex-row gap-0 border border-white/10 overflow-hidden transition-all hover:border-orange/40">
      {/* POSTER */}
      {poster && (
        <div className="relative w-full md:w-48 aspect-[3/4] md:aspect-auto shrink-0 overflow-hidden">
          <picture>
            {posterWebp && <source srcSet={posterWebp} type="image/webp" />}
            <img
              src={poster}
              alt={`Cartel ${show.city}`}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </picture>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/60 md:block hidden" />
        </div>
      )}

      {/* INFO */}
      <div className="flex flex-1 items-center gap-6 p-5 md:p-7 bg-zinc-950">
        {/* DATE BLOCK */}
        <div className="text-center min-w-[64px]">
          <div className="font-display text-5xl md:text-6xl font-black leading-none text-white">
            {day}
          </div>
          <div className="font-display uppercase tracking-widest text-[10px] mt-1 text-orange">
            {month} · {year}
          </div>
        </div>

        {/* VERTICAL DIVIDER */}
        <div className="w-px self-stretch bg-white/10" />

        {/* VENUE */}
        <div className="flex-1 min-w-0">
          <div className="font-display text-xl md:text-2xl font-bold text-white truncate">
            {show.city}
          </div>
          <div className="font-body text-sm md:text-base text-white/50 truncate">
            {show.venue}
            {show.show_time ? (
              <span className="ml-2 text-orange/80">· {show.show_time}h</span>
            ) : null}
          </div>
        </div>

        {/* CTA */}
        <div className="flex items-center gap-3 shrink-0">
          {show.sold_out ? (
            <span className="px-4 py-2 font-display uppercase tracking-widest text-xs border border-white/20 text-white/40">
              Agotado
            </span>
          ) : show.ticket_url ? (
            <a
              href={show.ticket_url}
              target="_blank"
              rel="noreferrer"
              className="px-5 md:px-7 py-3 bg-orange text-black font-display font-bold uppercase tracking-widest text-xs md:text-sm transition-all hover:bg-white hover:scale-105 active:scale-95"
            >
              Entradas
            </a>
          ) : (
            <span className="font-display uppercase tracking-widest text-xs text-white/40">
              Próximamente
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

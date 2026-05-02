import balloon from "@/assets/balloon.png";

interface Show {
  id: string;
  city: string;
  venue: string;
  show_date: string;
  show_time: string | null;
  ticket_url: string | null;
  sold_out: boolean;
}

const months = [
  "Ene", "Feb", "Mar", "Abr", "May", "Jun",
  "Jul", "Ago", "Sep", "Oct", "Nov", "Dic",
];

export function ShowCard({ show }: { show: Show }) {
  const d = new Date(show.show_date + "T00:00:00");
  const day = d.getDate();
  const month = months[d.getMonth()];
  const year = d.getFullYear();

  return (
    <div
      className="relative grid grid-cols-[auto_1fr_auto] items-center gap-6 p-5 md:p-7 hard-shadow border-2 border-teal/30 transition-transform hover:translate-x-[-3px] hover:translate-y-[-3px]"
      style={{ background: "var(--color-arena)" }}
    >
      <div className="text-center min-w-[72px]">
        <div
          className="font-display text-5xl md:text-6xl font-bold leading-none"
          style={{ color: "var(--color-teal)" }}
        >
          {day}
        </div>
        <div
          className="font-display uppercase tracking-widest text-xs mt-1"
          style={{ color: "var(--color-teal)" }}
        >
          {month} · {year}
        </div>
      </div>

      <div>
        <div
          className="font-display text-xl md:text-2xl font-bold"
          style={{ color: "var(--color-teal)" }}
        >
          {show.city}
        </div>
        <div className="font-body text-sm md:text-base opacity-80" style={{ color: "var(--color-teal)" }}>
          {show.venue}{show.show_time ? ` · ${show.show_time}h` : ""}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {show.sold_out && (
          <img
            src={balloon}
            alt=""
            width={24}
            height={32}
            className="balloon-tiny"
            style={{ filter: "drop-shadow(2px 2px 0 rgba(1,148,127,0.5))" }}
          />
        )}
        {show.sold_out ? (
          <span
            className="px-4 py-2 font-display uppercase tracking-widest text-xs border-2"
            style={{ borderColor: "var(--color-globo)", color: "var(--color-globo)" }}
          >
            Agotado
          </span>
        ) : show.ticket_url ? (
          <a
            href={show.ticket_url}
            target="_blank"
            rel="noreferrer"
            className="px-4 md:px-6 py-2 md:py-3 font-display uppercase tracking-widest text-xs md:text-sm transition-transform hover:scale-105"
            style={{ background: "var(--color-globo)", color: "var(--color-arena)" }}
          >
            Entradas
          </a>
        ) : (
          <span className="font-display uppercase tracking-widest text-xs opacity-60" style={{ color: "var(--color-teal)" }}>
            Próximamente
          </span>
        )}
      </div>
    </div>
  );
}

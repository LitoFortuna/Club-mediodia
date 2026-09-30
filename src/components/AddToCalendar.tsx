import { CalendarPlus, MapPin } from "lucide-react";

type Props = {
  title: string;
  details: string;
  address: string;
  /** Formato Google Calendar UTC, ej. "20261022T180000Z" */
  startUTC: string;
  endUTC: string;
};

function icsDataUrl({ title, details, address, startUTC, endUTC }: Props): string {
  const escape = (s: string) => s.replace(/([,;])/g, "\\$1");
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Club Mediodia//Entradas//ES",
    "BEGIN:VEVENT",
    `DTSTART:${startUTC}`,
    `DTEND:${endUTC}`,
    `SUMMARY:${escape(title)}`,
    `DESCRIPTION:${escape(details)}`,
    `LOCATION:${escape(address)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`;
}

const linkCls =
  "inline-flex items-center gap-2 px-4 py-2 border border-white/15 text-white/70 font-display uppercase tracking-widest text-[10px] hover:border-orange hover:text-orange transition-colors";

export function AddToCalendar(props: Props) {
  const { title, details, address, startUTC, endUTC } = props;
  const googleUrl =
    "https://calendar.google.com/calendar/render?action=TEMPLATE" +
    `&text=${encodeURIComponent(title)}` +
    `&dates=${startUTC}/${endUTC}` +
    `&location=${encodeURIComponent(address)}` +
    `&details=${encodeURIComponent(details)}`;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

  return (
    <div className="flex flex-wrap gap-3">
      <a href={googleUrl} target="_blank" rel="noreferrer" className={linkCls}>
        <CalendarPlus size={14} /> Google Calendar
      </a>
      <a
        href={icsDataUrl({ title, details, address, startUTC, endUTC })}
        download="evento.ics"
        className={linkCls}
      >
        <CalendarPlus size={14} /> Apple / Outlook (.ics)
      </a>
      <a href={mapsUrl} target="_blank" rel="noreferrer" className={linkCls}>
        <MapPin size={14} /> Cómo llegar
      </a>
    </div>
  );
}

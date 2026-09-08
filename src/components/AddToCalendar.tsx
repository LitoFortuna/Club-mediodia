import { CalendarPlus, MapPin } from "lucide-react";
import {
  CONCERT_GOOGLE_CALENDAR_URL,
  CONCERT_ICS_URL,
  CONCERT_MAPS_URL,
} from "@/lib/concert";

const linkCls =
  "inline-flex items-center gap-2 px-4 py-2 border border-white/15 text-white/70 font-display uppercase tracking-widest text-[10px] hover:border-orange hover:text-orange transition-colors";

export function AddToCalendar() {
  return (
    <div className="flex flex-wrap gap-3">
      <a href={CONCERT_GOOGLE_CALENDAR_URL} target="_blank" rel="noreferrer" className={linkCls}>
        <CalendarPlus size={14} /> Google Calendar
      </a>
      <a href={CONCERT_ICS_URL} download className={linkCls}>
        <CalendarPlus size={14} /> Apple / Outlook (.ics)
      </a>
      <a href={CONCERT_MAPS_URL} target="_blank" rel="noreferrer" className={linkCls}>
        <MapPin size={14} /> Cómo llegar
      </a>
    </div>
  );
}

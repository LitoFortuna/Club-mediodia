import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { listConcertGuests, type RosterGuest } from "@/api/checkin.functions";
import { CONCERT, formatGuestCode } from "@/lib/concert";

export const Route = createFileRoute("/asistentes")({
  head: () => ({
    meta: [
      { title: "Listado de apuntados — Club Mediodía" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AsistentesPage,
});

type Data = {
  guests: RosterGuest[];
  totalPeople: number;
  totalCheckedIn: number;
  totalRegistrations: number;
};

function AsistentesPage() {
  const list = useServerFn(listConcertGuests);
  const [pin, setPin] = useState("");
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");

  const load = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!pin.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await list({ data: { pin } });
      if (!res.ok) {
        setError("PIN incorrecto.");
        setData(null);
      } else {
        setData(res);
      }
    } catch {
      setError("No se pudo cargar el listado.");
    } finally {
      setLoading(false);
    }
  };

  if (!data) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-6 bg-background">
        <form onSubmit={load} className="w-full max-w-xs flex flex-col gap-4">
          <p className="font-display uppercase tracking-widest text-xs text-white/50 text-center">
            Listado de apuntados · Staff
          </p>
          <input
            type="password"
            inputMode="numeric"
            autoFocus
            placeholder="PIN"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="w-full px-4 py-4 bg-zinc-950 border-2 border-white/10 focus:border-orange focus:outline-none font-display text-2xl text-center tracking-[0.5em] text-white"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-orange text-black font-display font-bold uppercase tracking-widest text-sm disabled:opacity-50"
          >
            {loading ? "…" : "Ver listado"}
          </button>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        </form>
      </div>
    );
  }

  const filtered = data.guests.filter((g) =>
    `${g.name} ${g.email ?? ""} ${g.code}`.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div className="min-h-[70vh] px-4 py-8 bg-background max-w-3xl mx-auto">
      <div className="flex items-baseline justify-between gap-4 mb-6">
        <h1 className="font-display text-2xl font-bold uppercase tracking-tight text-white">
          Apuntados
        </h1>
        <Link to="/checkin" className="font-display uppercase tracking-widest text-[10px] text-white/40 hover:text-orange">
          ← Check-in
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6 font-display text-center">
        <div className="p-3 border border-white/10 bg-white/5">
          <div className="text-3xl font-black text-white">{data.totalPeople}</div>
          <div className="text-[10px] uppercase tracking-widest text-white/40 mt-1">Personas</div>
        </div>
        <div className="p-3 border border-white/10 bg-white/5">
          <div className="text-3xl font-black text-menta">{data.totalCheckedIn}</div>
          <div className="text-[10px] uppercase tracking-widest text-white/40 mt-1">Dentro</div>
        </div>
        <div className="p-3 border border-white/10 bg-white/5">
          <div className="text-3xl font-black text-white">{data.totalRegistrations}</div>
          <div className="text-[10px] uppercase tracking-widest text-white/40 mt-1">Reservas</div>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar nombre, email o código…"
          className="flex-1 px-3 py-2 bg-zinc-950 border border-white/10 text-white text-sm"
        />
        <button
          onClick={() => load()}
          className="px-4 py-2 border border-white/20 text-white/70 font-display uppercase tracking-widest text-[10px]"
        >
          Actualizar
        </button>
      </div>

      <ul className="divide-y divide-white/5 border-y border-white/10">
        {filtered.map((g) => (
          <li key={g.code} className="flex items-center gap-3 py-3">
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${g.checked_in ? "bg-menta" : "bg-white/20"}`}
              title={g.checked_in ? "Dentro" : "Sin entrar"}
            />
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm truncate">
                {g.name}
                {g.is_lead && <span className="text-white/30 text-xs"> · reserva</span>}
              </p>
              <p className="text-white/40 text-xs truncate">{g.email ?? "—"}</p>
            </div>
            <span className="font-mono text-xs text-white/60 shrink-0">{formatGuestCode(g.code)}</span>
            {g.checked_in && g.checked_in_at && (
              <span className="text-menta text-[10px] shrink-0 tabular-nums">
                {new Date(g.checked_in_at).toLocaleTimeString("es-ES", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            )}
          </li>
        ))}
      </ul>

      {filtered.length === 0 && (
        <p className="text-center text-white/30 py-12 font-display uppercase tracking-widest text-xs">
          {data.guests.length === 0 ? "Aún no hay nadie apuntado" : "Sin resultados"}
        </p>
      )}

      <p className="text-white/30 text-[10px] mt-6 font-display uppercase tracking-widest">
        {CONCERT.venue} · {CONCERT.dateISO}
      </p>
    </div>
  );
}

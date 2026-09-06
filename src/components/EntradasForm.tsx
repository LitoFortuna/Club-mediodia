import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Plus, X } from "lucide-react";
import { registerForConcert } from "@/api/concert.functions";
import { CONCERT } from "@/lib/concert";

interface Guest {
  name: string;
  email: string;
}

export function EntradasForm() {
  const register = useServerFn(registerForConcert);
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [guests, setGuests] = useState<Guest[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [waitlisted, setWaitlisted] = useState(false);
  const [feedback, setFeedback] = useState("");

  const addGuest = () =>
    setGuests((g) => (g.length < CONCERT.maxGuestsPerRegistration ? [...g, { name: "", email: "" }] : g));

  const removeGuest = (i: number) => setGuests((g) => g.filter((_, idx) => idx !== i));

  const updateGuest = (i: number, key: keyof Guest, value: string) =>
    setGuests((g) => g.map((row, idx) => (idx === i ? { ...row, [key]: value } : row)));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await register({
        data: {
          contactName,
          contactEmail,
          guests: guests
            .filter((g) => g.name.trim())
            .map((g) => ({ name: g.name, email: g.email || undefined })),
        },
      });
      setFeedback(res.message);
      setWaitlisted(!!res.waitlisted);
      setStatus(res.ok ? "ok" : "error");
      if (res.ok) {
        setContactName("");
        setContactEmail("");
        setGuests([]);
      }
    } catch (err) {
      setFeedback(err instanceof Error ? err.message : "Error de validación");
      setStatus("error");
    }
  };

  const inputCls =
    "w-full px-4 py-3 bg-zinc-950 border-2 border-white/10 focus:border-orange focus:outline-none font-body text-base text-white transition-colors";

  if (status === "ok") {
    return (
      <div
        className={`p-8 border-2 text-center ${
          waitlisted ? "border-arena/50 bg-arena/5" : "border-orange/40 bg-orange/5"
        }`}
      >
        <p
          className={`font-display text-2xl font-bold mb-2 uppercase ${
            waitlisted ? "text-arena" : "text-orange"
          }`}
        >
          {waitlisted ? "Estás en lista de espera" : "¡Ya estáis dentro!"}
        </p>
        <p className="text-white/70 font-body">{feedback}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="block font-display uppercase tracking-widest text-[10px] mb-2 text-gray-500">
            Tu nombre
          </label>
          <input
            required
            maxLength={100}
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            className={inputCls}
          />
        </div>
        <div>
          <label className="block font-display uppercase tracking-widest text-[10px] mb-2 text-gray-500">
            Tu email
          </label>
          <input
            type="email"
            required
            maxLength={255}
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            className={inputCls}
          />
        </div>
      </div>

      {guests.length > 0 && (
        <div className="flex flex-col gap-4">
          {guests.map((g, i) => (
            <div key={i} className="grid sm:grid-cols-[1fr_1fr_auto] gap-3 items-end p-4 border border-white/10 bg-white/5">
              <div>
                <label className="block font-display uppercase tracking-widest text-[10px] mb-2 text-gray-500">
                  Acompañante {i + 1}
                </label>
                <input
                  required
                  maxLength={100}
                  placeholder="Nombre"
                  value={g.name}
                  onChange={(e) => updateGuest(i, "name", e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block font-display uppercase tracking-widest text-[10px] mb-2 text-gray-500">
                  Email (opcional)
                </label>
                <input
                  type="email"
                  maxLength={255}
                  placeholder="Para enviarle su propio QR"
                  value={g.email}
                  onChange={(e) => updateGuest(i, "email", e.target.value)}
                  className={inputCls}
                />
              </div>
              <button
                type="button"
                onClick={() => removeGuest(i)}
                aria-label="Quitar acompañante"
                className="p-3 border border-white/10 text-white/50 hover:text-rojo hover:border-rojo transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          ))}
        </div>
      )}

      {guests.length < CONCERT.maxGuestsPerRegistration && (
        <button
          type="button"
          onClick={addGuest}
          className="self-start flex items-center gap-2 px-5 py-3 border border-dashed border-white/20 text-white/60 font-display uppercase tracking-widest text-xs hover:border-orange hover:text-orange transition-colors"
        >
          <Plus size={16} /> Añadir acompañante
        </button>
      )}

      <div className="flex items-center gap-4 flex-wrap pt-2">
        <button
          type="submit"
          disabled={status === "loading"}
          className="px-10 py-4 bg-orange text-black font-display font-bold uppercase tracking-widest text-sm transition-all hover:bg-white hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
        >
          {status === "loading" ? "Reservando…" : "Reservar entrada"}
        </button>
        {status === "error" && feedback && (
          <p className="text-sm font-display uppercase tracking-widest text-red-500">{feedback}</p>
        )}
      </div>
    </form>
  );
}

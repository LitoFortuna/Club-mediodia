import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { sendContactMessage } from "@/api/contact.functions";

type Reason = "booking" | "prensa" | "management" | "general";

export function ContactForm() {
  const send = useServerFn(sendContactMessage);
  const [form, setForm] = useState({
    reason: "booking" as Reason,
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [feedback, setFeedback] = useState("");

  const update = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await send({ data: form });
      setFeedback(res.message);
      setStatus(res.ok ? "ok" : "error");
      if (res.ok) {
        setForm({ reason: "booking", name: "", email: "", subject: "", message: "" });
      }
    } catch (err) {
      setFeedback(err instanceof Error ? err.message : "Error de validación");
      setStatus("error");
    }
  };

  const inputCls =
    "w-full px-4 py-3 bg-zinc-950 border-2 border-white/10 focus:border-orange focus:outline-none font-body text-base text-white transition-colors";

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <div>
        <label className="block font-display uppercase tracking-widest text-[10px] mb-2 text-gray-500">
          Motivo
        </label>
        <select
          value={form.reason}
          onChange={(e) => update("reason", e.target.value as Reason)}
          className={inputCls}
        >
          <option value="booking">Booking</option>
          <option value="prensa">Prensa</option>
          <option value="management">Management</option>
          <option value="general">General</option>
        </select>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="block font-display uppercase tracking-widest text-[10px] mb-2 text-gray-500">
            Nombre
          </label>
          <input
            required maxLength={100}
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            className={inputCls}
          />
        </div>
        <div>
          <label className="block font-display uppercase tracking-widest text-[10px] mb-2 text-gray-500">
            Email
          </label>
          <input
            type="email" required maxLength={255}
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            className={inputCls}
          />
        </div>
      </div>

      <div>
        <label className="block font-display uppercase tracking-widest text-[10px] mb-2 text-gray-500">
          Asunto
        </label>
        <input
          required maxLength={200}
          value={form.subject}
          onChange={(e) => update("subject", e.target.value)}
          className={inputCls}
        />
      </div>

      <div>
        <label className="block font-display uppercase tracking-widest text-[10px] mb-2 text-gray-500">
          Mensaje
        </label>
        <textarea
          required maxLength={2000} rows={6}
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
          className={inputCls}
        />
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        <button
          type="submit"
          disabled={status === "loading"}
          className="px-10 py-4 bg-orange text-black font-display font-bold uppercase tracking-widest text-sm transition-all hover:bg-white hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
        >
          {status === "loading" ? "Enviando…" : "Enviar mensaje"}
        </button>
        {feedback && (
          <p
            className={`text-sm font-display uppercase tracking-widest ${status === "ok" ? "text-orange" : "text-red-500"}`}
          >
            {feedback}
          </p>
        )}
      </div>
    </form>
  );
}

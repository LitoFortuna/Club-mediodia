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
    "w-full px-4 py-3 bg-background border-2 border-teal/40 focus:border-globo focus:outline-none font-body text-base";

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <div>
        <label className="block font-display uppercase tracking-widest text-xs mb-2">
          Motivo
        </label>
        <select
          value={form.reason}
          onChange={(e) => update("reason", e.target.value as Reason)}
          className={inputCls}
          style={{ color: "var(--color-teal)" }}
        >
          <option value="booking">Booking</option>
          <option value="prensa">Prensa</option>
          <option value="management">Management</option>
          <option value="general">General</option>
        </select>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="block font-display uppercase tracking-widest text-xs mb-2">
            Nombre
          </label>
          <input
            required maxLength={100}
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            className={inputCls}
            style={{ color: "var(--color-teal)" }}
          />
        </div>
        <div>
          <label className="block font-display uppercase tracking-widest text-xs mb-2">
            Email
          </label>
          <input
            type="email" required maxLength={255}
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            className={inputCls}
            style={{ color: "var(--color-teal)" }}
          />
        </div>
      </div>

      <div>
        <label className="block font-display uppercase tracking-widest text-xs mb-2">
          Asunto
        </label>
        <input
          required maxLength={200}
          value={form.subject}
          onChange={(e) => update("subject", e.target.value)}
          className={inputCls}
          style={{ color: "var(--color-teal)" }}
        />
      </div>

      <div>
        <label className="block font-display uppercase tracking-widest text-xs mb-2">
          Mensaje
        </label>
        <textarea
          required maxLength={2000} rows={6}
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
          className={inputCls}
          style={{ color: "var(--color-teal)" }}
        />
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        <button
          type="submit"
          disabled={status === "loading"}
          className="px-8 py-3 font-display uppercase tracking-widest text-sm hard-shadow transition-transform hover:translate-x-[-2px] hover:translate-y-[-2px] disabled:opacity-50"
          style={{ background: "var(--color-globo)", color: "var(--color-arena)" }}
        >
          {status === "loading" ? "Enviando…" : "Enviar"}
        </button>
        {feedback && (
          <p
            className="text-sm font-body"
            style={{ color: status === "ok" ? "var(--color-teal)" : "var(--color-globo)" }}
          >
            {feedback}
          </p>
        )}
      </div>
    </form>
  );
}

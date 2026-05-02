import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { subscribeNewsletter } from "@/api/newsletter.functions";

export function NewsletterForm() {
  const subscribe = useServerFn(subscribeNewsletter);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [message, setMessage] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await subscribe({ data: { email } });
      setMessage(res.message);
      setStatus(res.ok ? "ok" : "error");
      if (res.ok) setEmail("");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Email inválido");
      setStatus("error");
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-3 w-full max-w-xl">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="tu@email.com"
        className="flex-1 px-4 py-3 bg-background border-2 border-teal/40 focus:border-globo focus:outline-none font-body text-base"
        style={{ color: "var(--color-teal)" }}
        disabled={status === "loading"}
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="px-6 py-3 font-display uppercase tracking-widest text-sm hard-shadow transition-transform hover:translate-x-[-2px] hover:translate-y-[-2px] disabled:opacity-50"
        style={{ background: "var(--color-globo)", color: "var(--color-arena)" }}
      >
        {status === "loading" ? "Enviando…" : "Suscribir"}
      </button>
      {message && (
        <p
          className="sm:absolute sm:mt-16 text-sm font-body w-full"
          style={{ color: status === "ok" ? "var(--color-teal)" : "var(--color-globo)" }}
        >
          {message}
        </p>
      )}
    </form>
  );
}

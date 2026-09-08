import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { subscribeNewsletter } from "@/api/newsletter.functions";

export function NewsletterForm() {
  const subscribe = useServerFn(subscribeNewsletter);
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [message, setMessage] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await subscribe({ data: { email, website } });
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
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        aria-hidden="true"
        className="hidden"
      />
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="tu@email.com"
        className="flex-1 px-4 py-3 bg-black/40 border-2 border-white/10 focus:border-orange focus:outline-none font-body text-base text-white transition-all placeholder:text-gray-600"
        disabled={status === "loading"}
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="px-8 py-3 bg-orange text-black font-display font-bold uppercase tracking-widest text-sm transition-all hover:bg-white active:scale-95 disabled:opacity-50"
      >
        {status === "loading" ? "..." : "Suscribir"}
      </button>
      {message && (
        <p
          className={`sm:absolute sm:mt-16 text-sm font-display uppercase tracking-widest w-full ${status === "ok" ? "text-white" : "text-orange"}`}
        >
          {message}
        </p>
      )}
    </form>
  );
}

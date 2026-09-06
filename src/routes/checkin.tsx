import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Link } from "@tanstack/react-router";
import { checkInGuest, type CheckInStatus } from "@/api/checkin.functions";
import { normalizeGuestCode } from "@/lib/concert";

export const Route = createFileRoute("/checkin")({
  head: () => ({
    meta: [
      { title: "Check-in — Club Mediodía" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  validateSearch: (search: Record<string, unknown>): { t?: string } =>
    typeof search.t === "string" ? { t: search.t } : {},
  component: CheckinPage,
});

type Result = { status: CheckInStatus; name?: string; checked_in_at?: string | null } | null;

const RESULT_STYLES: Record<CheckInStatus, { bg: string; label: string }> = {
  ok: { bg: "bg-menta", label: "ENTRADA VÁLIDA" },
  already: { bg: "bg-arena", label: "YA HABÍA ENTRADO" },
  waitlist: { bg: "bg-rojo", label: "EN LISTA DE ESPERA — SIN ENTRADA" },
  notfound: { bg: "bg-rojo", label: "QR NO VÁLIDO" },
  badpin: { bg: "bg-rojo", label: "PIN INCORRECTO" },
  error: { bg: "bg-rojo", label: "ERROR — REINTENTA" },
};

function CheckinPage() {
  const { t } = Route.useSearch();
  const checkIn = useServerFn(checkInGuest);

  const [pin, setPin] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<Result>(null);
  const [manualToken, setManualToken] = useState("");
  const scannerRef = useRef<import("html5-qrcode").Html5Qrcode | null>(null);
  const busyRef = useRef(false);

  const runCheckIn = async (raw: string) => {
    const token = normalizeGuestCode(raw);
    if (!token || busyRef.current) return;
    busyRef.current = true;
    try {
      const res = await checkIn({ data: { pin, token } });
      setResult(res);
    } catch {
      setResult({ status: "error" });
    } finally {
      setTimeout(() => {
        busyRef.current = false;
      }, 1200);
    }
  };

  // Si se abre el enlace del QR directamente (fuera de la cámara), permite confirmar a mano
  useEffect(() => {
    if (unlocked && t) setManualToken(t);
  }, [unlocked, t]);

  useEffect(() => {
    if (!unlocked || !scanning) return;

    let cancelled = false;

    (async () => {
      const { Html5Qrcode } = await import("html5-qrcode");
      if (cancelled) return;

      const scanner = new Html5Qrcode("qr-reader");
      scannerRef.current = scanner;

      try {
        await scanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          (decodedText) => {
            const token = decodedText.includes("t=")
              ? new URL(decodedText).searchParams.get("t") ?? decodedText
              : decodedText;
            runCheckIn(token);
          },
          undefined,
        );
      } catch (err) {
        console.error("No se pudo iniciar la cámara:", err);
        setScanning(false);
      }
    })();

    return () => {
      cancelled = true;
      scannerRef.current
        ?.stop()
        .then(() => scannerRef.current?.clear())
        .catch(() => {});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unlocked, scanning, pin]);

  if (!unlocked) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-6 bg-background">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (pin.trim()) setUnlocked(true);
          }}
          className="w-full max-w-xs flex flex-col gap-4"
        >
          <p className="font-display uppercase tracking-widest text-xs text-white/50 text-center">
            Check-in · Staff
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
            className="px-6 py-3 bg-orange text-black font-display font-bold uppercase tracking-widest text-sm"
          >
            Entrar
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] px-6 py-10 bg-background flex flex-col items-center gap-6">
      <p className="font-display uppercase tracking-widest text-xs text-white/50">
        Club Mediodía · Puerta
      </p>

      {result && (
        <div className={`w-full max-w-sm p-6 text-center text-black ${RESULT_STYLES[result.status].bg}`}>
          <p className="font-display font-black text-2xl uppercase tracking-tight">
            {RESULT_STYLES[result.status].label}
          </p>
          {result.name && <p className="font-body text-lg mt-2">{result.name}</p>}
          {result.status === "already" && result.checked_in_at && (
            <p className="font-body text-xs mt-1 opacity-70">
              Entró a las {new Date(result.checked_in_at).toLocaleTimeString("es-ES")}
            </p>
          )}
        </div>
      )}

      {!scanning ? (
        <button
          onClick={() => {
            setResult(null);
            setScanning(true);
          }}
          className="px-8 py-4 bg-orange text-black font-display font-bold uppercase tracking-widest text-sm"
        >
          {result ? "Escanear siguiente" : "Iniciar cámara"}
        </button>
      ) : (
        <div className="w-full max-w-sm">
          <div id="qr-reader" className="w-full" />
          <button
            onClick={() => setScanning(false)}
            className="mt-4 w-full px-6 py-3 border border-white/20 text-white/70 font-display uppercase tracking-widest text-xs"
          >
            Parar cámara
          </button>
        </div>
      )}

      <details className="w-full max-w-sm text-white/40" open={!!t}>
        <summary className="font-display uppercase tracking-widest text-[10px] cursor-pointer">
          ¿No lee el QR? Meter el código a mano
        </summary>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (manualToken.trim()) runCheckIn(manualToken.trim());
          }}
          className="flex gap-2 mt-3"
        >
          <input
            value={manualToken}
            onChange={(e) => setManualToken(e.target.value.toUpperCase())}
            placeholder="ABC-D23"
            autoCapitalize="characters"
            className="flex-1 px-3 py-2 bg-zinc-950 border border-white/10 text-white text-sm tracking-widest uppercase"
          />
          <button type="submit" className="px-4 py-2 border border-white/20 text-white text-sm">
            Comprobar
          </button>
        </form>
      </details>

      <Link
        to="/asistentes"
        className="font-display uppercase tracking-widest text-[10px] text-white/40 hover:text-orange"
      >
        Ver listado de apuntados →
      </Link>
    </div>
  );
}

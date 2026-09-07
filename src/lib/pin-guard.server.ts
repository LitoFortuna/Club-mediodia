// Comprobación del PIN de staff con bloqueo por fuerza bruta — SOLO servidor.
// Regla: 3 intentos fallidos por IP dentro de una ventana de 2 h → bloqueado
// hasta que termine esa ventana. Un acierto limpia el contador.
import { createHash } from "crypto";
import { getRequestIP, getRequestHeader } from "@tanstack/react-start/server";
import { adminDb } from "@/lib/firebase.server";

const MAX_FAILS = 3;
const WINDOW_MS = 2 * 60 * 60 * 1000; // 2 horas

function clientIp(): string {
  try {
    // Opción h3: confiar en el X-Forwarded-For del proxy de Vercel
    const ip = getRequestIP({ xForwardedFor: true });
    if (ip) return String(ip);
  } catch {
    /* noop */
  }
  for (const h of ["x-forwarded-for", "x-real-ip", "x-vercel-forwarded-for"]) {
    try {
      const v = getRequestHeader(h);
      if (v) return v.split(",")[0].trim();
    } catch {
      /* noop */
    }
  }
  return "unknown";
}

function ipHash(): string {
  return createHash("sha256").update("clubmediodia-pin:" + clientIp()).digest("hex");
}

export type PinGateResult =
  | { ok: true }
  | { ok: false; locked: boolean; retryAfterMin?: number };

export async function checkPinWithLockout(pin: string): Promise<PinGateResult> {
  const expected = process.env.CHECKIN_PIN;
  if (!expected) return { ok: false, locked: false };

  const ref = adminDb.collection("pin_attempts").doc(ipHash());

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return await adminDb.runTransaction(async (t: any) => {
      const snap = await t.get(ref);
      const now = Date.now();
      const data = snap.exists ? snap.data() : null;

      if (data?.blocked_until && now < Date.parse(data.blocked_until)) {
        return {
          ok: false as const,
          locked: true,
          retryAfterMin: Math.ceil((Date.parse(data.blocked_until) - now) / 60000),
        };
      }

      let count: number = data?.count ?? 0;
      let firstAt = data?.first_at ? Date.parse(data.first_at) : now;
      if (now - firstAt > WINDOW_MS) {
        count = 0;
        firstAt = now;
      }

      if (pin === expected) {
        if (snap.exists) t.delete(ref);
        return { ok: true as const };
      }

      count += 1;
      const blocked = count >= MAX_FAILS;
      t.set(
        ref,
        {
          count,
          first_at: new Date(firstAt).toISOString(),
          last_at: new Date(now).toISOString(),
          blocked_until: blocked ? new Date(firstAt + WINDOW_MS).toISOString() : null,
        },
        { merge: true },
      );

      return {
        ok: false as const,
        locked: blocked,
        retryAfterMin: blocked ? Math.ceil((firstAt + WINDOW_MS - now) / 60000) : undefined,
      };
    });
  } catch (err) {
    console.error("PIN guard error:", err);
    // Si falla el registro de intentos, no dejamos pasar sin PIN correcto,
    // pero tampoco bloqueamos: se valida el PIN a pelo.
    return pin === expected ? { ok: true } : { ok: false, locked: false };
  }
}

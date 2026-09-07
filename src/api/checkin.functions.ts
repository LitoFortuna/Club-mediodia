import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { adminDb } from "@/lib/firebase.server";
import { sendMail } from "@/lib/mailer.server";
import { generateQrPng } from "@/lib/qr.server";
import { renderConfirmationEmail } from "@/lib/concert-email.server";
import { CONCERT, normalizeGuestCode } from "@/lib/concert";
import { checkPinWithLockout, type PinGateResult } from "@/lib/pin-guard.server";

function pinDeniedMessage(gate: Extract<PinGateResult, { ok: false }>): string {
  if (gate.locked) {
    const h = Math.max(1, Math.round((gate.retryAfterMin ?? 120) / 60));
    return `Demasiados intentos fallidos. Vuelve a probar dentro de ~${h} h.`;
  }
  return "PIN incorrecto.";
}

function baseUrl() {
  return process.env.PUBLIC_BASE_URL || "https://clubmediodia.es";
}

/* ---------- Check-in en la puerta ---------- */

const checkInSchema = z.object({
  pin: z.string().trim().min(1),
  token: z.string().trim().min(4).max(200),
});

export type CheckInStatus =
  | "ok"
  | "already"
  | "notfound"
  | "badpin"
  | "locked"
  | "waitlist"
  | "error";

export const checkInGuest = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => checkInSchema.parse(input))
  .handler(async ({ data }): Promise<{
    status: CheckInStatus;
    name?: string;
    checked_in_at?: string | null;
    retryAfterMin?: number;
  }> => {
    const gate = await checkPinWithLockout(data.pin);
    if (!gate.ok) {
      return { status: gate.locked ? "locked" : "badpin", retryAfterMin: gate.retryAfterMin };
    }

    const code = normalizeGuestCode(data.token);
    if (!code) return { status: "notfound" };

    try {
      const ref = adminDb.collection("concert_guests").doc(code);
      const snap = await ref.get();
      if (!snap.exists) return { status: "notfound" };

      const guest = snap.data() as {
        name: string;
        status?: string;
        checked_in: boolean;
        checked_in_at: string | null;
      };

      if ((guest.status ?? "confirmed") !== "confirmed") {
        return { status: "waitlist", name: guest.name };
      }

      if (guest.checked_in) {
        return { status: "already", name: guest.name, checked_in_at: guest.checked_in_at };
      }

      const checked_in_at = new Date().toISOString();
      await ref.update({ checked_in: true, checked_in_at });
      console.log(`[audit] check-in OK code=${code} name=${guest.name}`);
      return { status: "ok", name: guest.name, checked_in_at };
    } catch (err) {
      console.error("Check-in error:", err);
      return { status: "error" };
    }
  });

/* ---------- Listado de asistentes ---------- */

export interface RosterGuest {
  code: string;
  name: string;
  email: string | null;
  is_lead: boolean;
  status: "confirmed" | "waitlist" | "cancelled";
  registration_id: string;
  checked_in: boolean;
  checked_in_at: string | null;
  created_at: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toRoster(d: any): RosterGuest {
  const g = d.data();
  return {
    code: g.code ?? d.id,
    name: g.name,
    email: g.email ?? null,
    is_lead: !!g.is_lead,
    status: g.status ?? "confirmed",
    registration_id: g.registration_id ?? d.id,
    checked_in: !!g.checked_in,
    checked_in_at: g.checked_in_at ?? null,
    created_at: g.created_at ?? "",
  };
}

async function fetchRoster(): Promise<RosterGuest[]> {
  const snap = await adminDb
    .collection("concert_guests")
    .where("event", "==", CONCERT.id)
    .get();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (snap.docs as any[])
    .map(toRoster)
    .sort((a, b) => a.created_at.localeCompare(b.created_at));
}

export const listConcertGuests = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ pin: z.string().trim().min(1) }).parse(input))
  .handler(async ({ data }): Promise<{
    ok: boolean;
    message?: string;
    guests: RosterGuest[];
    capacity: number;
    totalConfirmed: number;
    totalWaitlist: number;
    totalCheckedIn: number;
    totalRegistrations: number;
  }> => {
    const empty = {
      ok: false,
      guests: [] as RosterGuest[],
      capacity: CONCERT.capacity,
      totalConfirmed: 0,
      totalWaitlist: 0,
      totalCheckedIn: 0,
      totalRegistrations: 0,
    };
    const gate = await checkPinWithLockout(data.pin);
    if (!gate.ok) return { ...empty, message: pinDeniedMessage(gate) };

    try {
      const guests = await fetchRoster();
      const confirmed = guests.filter((g) => g.status === "confirmed");
      return {
        ok: true,
        guests,
        capacity: CONCERT.capacity,
        totalConfirmed: confirmed.length,
        totalWaitlist: guests.filter((g) => g.status === "waitlist").length,
        totalCheckedIn: confirmed.filter((g) => g.checked_in).length,
        totalRegistrations: new Set(guests.map((g) => g.registration_id)).size,
      };
    } catch (err) {
      console.error("Roster error:", err);
      return empty;
    }
  });

/* ---------- Cancelar una entrada ---------- */

export const cancelGuest = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({ pin: z.string().trim().min(1), code: z.string().trim().min(1) }).parse(input),
  )
  .handler(async ({ data }): Promise<{ ok: boolean; message: string }> => {
    const gate = await checkPinWithLockout(data.pin);
    if (!gate.ok) return { ok: false, message: pinDeniedMessage(gate) };
    try {
      const code = normalizeGuestCode(data.code);
      const ref = adminDb.collection("concert_guests").doc(code);
      const snap = await ref.get();
      if (!snap.exists) return { ok: false, message: "No existe ese código." };
      await ref.update({ status: "cancelled", checked_in: false, checked_in_at: null });
      console.log(`[audit] cancelación code=${code}`);
      return { ok: true, message: "Entrada cancelada. Ya puedes promover la lista de espera." };
    } catch (err) {
      console.error("Cancel error:", err);
      return { ok: false, message: "No se pudo cancelar." };
    }
  });

/* ---------- Promover lista de espera ---------- */

export const promoteWaitlist = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ pin: z.string().trim().min(1) }).parse(input))
  .handler(async ({ data }): Promise<{ ok: boolean; message: string; promoted: number }> => {
    const gate = await checkPinWithLockout(data.pin);
    if (!gate.ok) return { ok: false, message: pinDeniedMessage(gate), promoted: 0 };

    try {
      const guests = await fetchRoster();
      const confirmedCount = guests.filter((g) => g.status === "confirmed").length;
      let free = CONCERT.capacity - confirmedCount;
      if (free <= 0) return { ok: true, message: "El aforo ya está completo.", promoted: 0 };

      // Agrupa la lista de espera por reserva, en orden cronológico
      const waitlist = guests.filter((g) => g.status === "waitlist");
      const byReg = new Map<string, RosterGuest[]>();
      for (const g of waitlist) {
        const arr = byReg.get(g.registration_id) ?? [];
        arr.push(g);
        byReg.set(g.registration_id, arr);
      }
      const groups = [...byReg.values()].sort((a, b) =>
        a[0].created_at.localeCompare(b[0].created_at),
      );

      let promoted = 0;
      for (const group of groups) {
        if (group.length > free) continue; // el grupo no cabe entero: se salta
        const batch = adminDb.batch();
        for (const g of group) {
          batch.update(adminDb.collection("concert_guests").doc(g.code), { status: "confirmed" });
        }
        batch.update(adminDb.collection("concert_registrations").doc(group[0].registration_id), {
          status: "confirmed",
        });
        await batch.commit();

        // Envía las entradas (QR + código) a la reserva promovida
        const lead = group.find((g) => g.is_lead) ?? group[0];
        const attachments = await Promise.all(
          group.map(async (g, i) => ({
            filename: `qr-${i + 1}.png`,
            content: await generateQrPng(`${baseUrl()}/checkin?t=${g.code}`),
            cid: `qr${i}`,
          })),
        );
        if (lead.email) {
          await sendMail({
            to: lead.email,
            subject: `¡Hay sitio! Tu entrada · ${CONCERT.bandName} — ${CONCERT.dateISO}`,
            html: renderConfirmationEmail(group, attachments.map((a) => a.cid)),
            attachments,
          });
        }
        for (const g of group) {
          if (g.email && g.email !== lead.email && !g.is_lead) {
            const png = await generateQrPng(`${baseUrl()}/checkin?t=${g.code}`);
            await sendMail({
              to: g.email,
              subject: `¡Hay sitio! Tu entrada · ${CONCERT.bandName} — ${CONCERT.dateISO}`,
              html: renderConfirmationEmail([g], ["qr0"]),
              attachments: [{ filename: "qr.png", content: png, cid: "qr0" }],
            });
          }
        }

        free -= group.length;
        promoted += group.length;
        console.log(`[audit] promoción reg=${group[0].registration_id} personas=${group.length}`);
        if (free <= 0) break;
      }

      return {
        ok: true,
        message:
          promoted > 0
            ? `Promovidas ${promoted} personas de la lista de espera. Les han llegado sus entradas.`
            : "No hay reservas en lista de espera que quepan en las plazas libres.",
        promoted,
      };
    } catch (err) {
      console.error("Promote waitlist error:", err);
      return { ok: false, message: "No se pudo promover la lista de espera.", promoted: 0 };
    }
  });

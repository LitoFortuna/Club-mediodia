import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { adminDb } from "@/lib/firebase.server";
import { CONCERT, normalizeGuestCode } from "@/lib/concert";

const checkInSchema = z.object({
  pin: z.string().trim().min(1),
  token: z.string().trim().min(4).max(200),
});

export type CheckInStatus = "ok" | "already" | "notfound" | "badpin" | "error";

function pinOk(pin: string): boolean {
  const expected = process.env.CHECKIN_PIN;
  return !!expected && pin === expected;
}

export const checkInGuest = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => checkInSchema.parse(input))
  .handler(async ({ data }): Promise<{
    status: CheckInStatus;
    name?: string;
    checked_in_at?: string | null;
  }> => {
    if (!pinOk(data.pin)) return { status: "badpin" };

    const code = normalizeGuestCode(data.token);
    if (!code) return { status: "notfound" };

    try {
      const ref = adminDb.collection("concert_guests").doc(code);
      const snap = await ref.get();
      if (!snap.exists) return { status: "notfound" };

      const guest = snap.data() as {
        name: string;
        checked_in: boolean;
        checked_in_at: string | null;
      };

      if (guest.checked_in) {
        return { status: "already", name: guest.name, checked_in_at: guest.checked_in_at };
      }

      const checked_in_at = new Date().toISOString();
      await ref.update({ checked_in: true, checked_in_at });
      return { status: "ok", name: guest.name, checked_in_at };
    } catch (err) {
      console.error("Check-in error:", err);
      return { status: "error" };
    }
  });

export interface RosterGuest {
  code: string;
  name: string;
  email: string | null;
  is_lead: boolean;
  checked_in: boolean;
  checked_in_at: string | null;
  created_at: string;
}

export const listConcertGuests = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ pin: z.string().trim().min(1) }).parse(input))
  .handler(async ({ data }): Promise<{
    ok: boolean;
    guests: RosterGuest[];
    totalPeople: number;
    totalCheckedIn: number;
    totalRegistrations: number;
  }> => {
    const empty = { ok: false, guests: [], totalPeople: 0, totalCheckedIn: 0, totalRegistrations: 0 };
    if (!pinOk(data.pin)) return empty;

    try {
      const snap = await adminDb
        .collection("concert_guests")
        .where("event", "==", CONCERT.id)
        .get();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const docs: any[] = snap.docs;

      const guests: RosterGuest[] = docs
        .map((d) => {
          const g = d.data();
          return {
            code: g.code ?? d.id,
            name: g.name,
            email: g.email ?? null,
            is_lead: !!g.is_lead,
            checked_in: !!g.checked_in,
            checked_in_at: g.checked_in_at ?? null,
            created_at: g.created_at ?? "",
          };
        })
        .sort((a, b) => a.created_at.localeCompare(b.created_at));

      const registrations = new Set<string>();
      docs.forEach((d) => registrations.add(d.data().registration_id ?? d.id));

      return {
        ok: true,
        guests,
        totalPeople: guests.length,
        totalCheckedIn: guests.filter((g) => g.checked_in).length,
        totalRegistrations: registrations.size,
      };
    } catch (err) {
      console.error("Roster error:", err);
      return empty;
    }
  });

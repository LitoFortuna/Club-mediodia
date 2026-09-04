import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { adminDb } from "@/lib/firebase.server";

const schema = z.object({
  pin: z.string().trim().min(1),
  token: z.string().trim().min(8).max(200),
});

export type CheckInStatus = "ok" | "already" | "notfound" | "badpin" | "error";

export const checkInGuest = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => schema.parse(input))
  .handler(async ({ data }): Promise<{
    status: CheckInStatus;
    name?: string;
    checked_in_at?: string | null;
  }> => {
    const expectedPin = process.env.CHECKIN_PIN;
    if (!expectedPin || data.pin !== expectedPin) {
      return { status: "badpin" };
    }

    try {
      const ref = adminDb.collection("concert_guests").doc(data.token);
      const snap = await ref.get();

      if (!snap.exists) {
        return { status: "notfound" };
      }

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

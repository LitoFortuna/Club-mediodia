import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { adminDb } from "@/lib/firebase.server";

const schema = z.object({
  email: z.string().trim().email("Email inválido").max(255),
});

export const subscribeNewsletter = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => schema.parse(input))
  .handler(async ({ data }) => {
    try {
      const email = data.email.toLowerCase();

      // Check for duplicate
      const existing = await adminDb
        .collection("newsletter_subscribers")
        .where("email", "==", email)
        .limit(1)
        .get();

      if (!existing.empty) {
        return { ok: true, message: "Ya estás suscrito. Gracias." };
      }

      await adminDb.collection("newsletter_subscribers").add({
        email,
        created_at: new Date().toISOString(),
      });

      return { ok: true, message: "Suscrito. Te avisaremos." };
    } catch (err) {
      console.error("Newsletter error:", err);
      return { ok: false, message: "No pudimos suscribirte. Inténtalo de nuevo." };
    }
  });

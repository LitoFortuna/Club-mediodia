import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { randomUUID } from "crypto";
import { adminDb } from "@/lib/firebase.server";
import { sendMail } from "@/lib/mailer.server";
import { generateQrPng } from "@/lib/qr.server";
import { renderConfirmationEmail } from "@/lib/concert-email.server";
import { CONCERT, isRegistrationOpen } from "@/lib/concert";

const guestSchema = z.object({
  name: z.string().trim().min(1, "Indica el nombre").max(100),
  email: z
    .union([z.string().trim().email("Email inválido").max(255), z.literal("")])
    .optional(),
});

const schema = z.object({
  contactName: z.string().trim().min(1, "Indica tu nombre").max(100),
  contactEmail: z.string().trim().email("Email inválido").max(255),
  guests: z.array(guestSchema).max(CONCERT.maxGuestsPerRegistration).default([]),
});

function baseUrl() {
  return process.env.PUBLIC_BASE_URL || "https://clubmediodia.es";
}

export const registerForConcert = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => schema.parse(input))
  .handler(async ({ data }) => {
    if (!isRegistrationOpen()) {
      return { ok: false, message: "Las inscripciones para este concierto ya han cerrado." };
    }

    try {
      const registrationRef = adminDb.collection("concert_registrations").doc();
      const created_at = new Date().toISOString();

      const people = [
        { name: data.contactName, email: data.contactEmail, isLead: true },
        ...data.guests.map((g) => ({
          name: g.name,
          email: g.email ? g.email : null,
          isLead: false,
        })),
      ];

      const batch = adminDb.batch();
      batch.set(registrationRef, {
        event: CONCERT.id,
        contact_name: data.contactName,
        contact_email: data.contactEmail.toLowerCase(),
        party_size: people.length,
        created_at,
      });

      const guests = people.map((p) => ({
        token: randomUUID(),
        name: p.name,
        email: p.email ? p.email.toLowerCase() : null,
      }));

      guests.forEach((g, i) => {
        const ref = adminDb.collection("concert_guests").doc(g.token);
        batch.set(ref, {
          event: CONCERT.id,
          registration_id: registrationRef.id,
          name: g.name,
          email: g.email,
          is_lead: people[i].isLead,
          checked_in: false,
          checked_in_at: null,
          created_at,
        });
      });

      await batch.commit();

      // Email al titular con el QR de todo el grupo
      const attachments = await Promise.all(
        guests.map(async (g, i) => ({
          filename: `qr-${i + 1}.png`,
          content: await generateQrPng(`${baseUrl()}/checkin?t=${g.token}`),
          cid: `qr${i}`,
        })),
      );

      await sendMail({
        to: data.contactEmail,
        subject: `Confirmación · ${CONCERT.bandName} en directo — ${CONCERT.dateISO}`,
        html: renderConfirmationEmail(guests, attachments.map((a) => a.cid)),
        attachments,
      });

      // Email individual a cada acompañante que dio un email distinto al del titular
      for (let i = 1; i < guests.length; i++) {
        const g = guests[i];
        if (g.email && g.email !== data.contactEmail.toLowerCase()) {
          const png = await generateQrPng(`${baseUrl()}/checkin?t=${g.token}`);
          await sendMail({
            to: g.email,
            subject: `Tu entrada · ${CONCERT.bandName} — ${CONCERT.dateISO}`,
            html: renderConfirmationEmail([g], ["qr0"]),
            attachments: [{ filename: "qr.png", content: png, cid: "qr0" }],
          });
        }
      }

      return {
        ok: true,
        message: "¡Inscripción confirmada! Revisa tu email (y la carpeta de spam) para ver tu entrada.",
      };
    } catch (err) {
      console.error("Concert registration error:", err);
      return { ok: false, message: "No pudimos completar la inscripción. Inténtalo de nuevo." };
    }
  });

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { randomBytes } from "crypto";
import { adminDb } from "@/lib/firebase.server";
import { sendMail } from "@/lib/mailer.server";
import { generateQrPng } from "@/lib/qr.server";
import { renderConfirmationEmail, renderRegistrationNotification } from "@/lib/concert-email.server";
import {
  CONCERT,
  GUEST_CODE_ALPHABET,
  GUEST_CODE_LENGTH,
  isRegistrationOpen,
} from "@/lib/concert";

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

function randomCode(): string {
  const bytes = randomBytes(GUEST_CODE_LENGTH);
  let out = "";
  for (let i = 0; i < GUEST_CODE_LENGTH; i++) {
    out += GUEST_CODE_ALPHABET[bytes[i] % GUEST_CODE_ALPHABET.length];
  }
  return out;
}

// Genera un código que no exista ya en Firestore ni en este mismo grupo
async function uniqueCode(used: Set<string>): Promise<string> {
  for (let attempt = 0; attempt < 10; attempt++) {
    const code = randomCode();
    if (used.has(code)) continue;
    const snap = await adminDb.collection("concert_guests").doc(code).get();
    if (!snap.exists) {
      used.add(code);
      return code;
    }
  }
  throw new Error("No se pudo generar un código único");
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

      const usedCodes = new Set<string>();
      const guests: { code: string; name: string; email: string | null }[] = [];
      for (const p of people) {
        guests.push({
          code: await uniqueCode(usedCodes),
          name: p.name,
          email: p.email ? p.email.toLowerCase() : null,
        });
      }

      const batch = adminDb.batch();
      batch.set(registrationRef, {
        event: CONCERT.id,
        contact_name: data.contactName,
        contact_email: data.contactEmail.toLowerCase(),
        party_size: people.length,
        created_at,
      });
      guests.forEach((g, i) => {
        batch.set(adminDb.collection("concert_guests").doc(g.code), {
          event: CONCERT.id,
          registration_id: registrationRef.id,
          code: g.code,
          name: g.name,
          email: g.email,
          is_lead: people[i].isLead,
          checked_in: false,
          checked_in_at: null,
          created_at,
        });
      });
      await batch.commit();

      // Email al titular con el QR + código de todo el grupo
      const attachments = await Promise.all(
        guests.map(async (g, i) => ({
          filename: `qr-${i + 1}.png`,
          content: await generateQrPng(`${baseUrl()}/checkin?t=${g.code}`),
          cid: `qr${i}`,
        })),
      );

      await sendMail({
        to: data.contactEmail,
        subject: `Confirmación · ${CONCERT.bandName} en directo — ${CONCERT.dateISO}`,
        html: renderConfirmationEmail(guests, attachments.map((a) => a.cid)),
        attachments,
      });

      // Email individual a cada acompañante con email distinto al del titular
      for (let i = 1; i < guests.length; i++) {
        const g = guests[i];
        if (g.email && g.email !== data.contactEmail.toLowerCase()) {
          const png = await generateQrPng(`${baseUrl()}/checkin?t=${g.code}`);
          await sendMail({
            to: g.email,
            subject: `Tu entrada · ${CONCERT.bandName} — ${CONCERT.dateISO}`,
            html: renderConfirmationEmail([g], ["qr0"]),
            attachments: [{ filename: "qr.png", content: png, cid: "qr0" }],
          });
        }
      }

      // Aviso a la banda (no bloquea la inscripción si falla)
      try {
        const countSnap = await adminDb
          .collection("concert_guests")
          .where("event", "==", CONCERT.id)
          .count()
          .get();
        await sendMail({
          to: process.env.NOTIFY_EMAIL || process.env.SMTP_USER!,
          subject: `Nueva inscripción · ${data.contactName} (+${guests.length - 1}) — ${CONCERT.dateISO}`,
          html: renderRegistrationNotification({
            contactName: data.contactName,
            contactEmail: data.contactEmail,
            people: guests,
            totalPeople: countSnap.data().count,
          }),
        });
      } catch (notifyErr) {
        console.error("Registration notification failed:", notifyErr);
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

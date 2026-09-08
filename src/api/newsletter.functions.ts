import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { randomBytes } from "crypto";
import { adminDb } from "@/lib/firebase.server";
import { sendMail } from "@/lib/mailer.server";
import { escapeHtml } from "@/lib/escape";

function baseUrl() {
  return process.env.PUBLIC_BASE_URL || "https://clubmediodia.es";
}

const subscribeSchema = z.object({
  email: z.string().trim().email("Email inválido").max(255),
  // honeypot: los bots rellenan cualquier campo; las personas no ven este
  website: z.string().max(0).optional().or(z.literal("")),
});

async function sendConfirmationEmail(email: string, token: string) {
  const url = `${baseUrl()}/newsletter/confirmar?t=${token}`;
  await sendMail({
    to: email,
    subject: "Confirma tu suscripción · Club Mediodía",
    html: `
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:440px;margin:0 auto;color:#111;line-height:1.5;">
      <p style="text-transform:uppercase;letter-spacing:2px;font-size:11px;color:#C12523;font-weight:700;margin:0 0 8px;">Newsletter</p>
      <h1 style="font-size:20px;margin:0 0 16px;">Un último paso</h1>
      <p style="margin:0 0 20px;">Confirma que quieres recibir novedades de Club Mediodía (fechas, lanzamientos, memorias borrosas):</p>
      <p style="margin:0 0 20px;">
        <a href="${url}" style="display:inline-block;background:#C12523;color:#fff;text-decoration:none;padding:12px 22px;font-weight:700;">Confirmar suscripción</a>
      </p>
      <p style="font-size:12px;color:#888;">Si no te has suscrito tú, ignora este correo y no pasará nada.</p>
    </div>`,
  });
}

export const subscribeNewsletter = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => subscribeSchema.parse(input))
  .handler(async ({ data }) => {
    if (data.website) return { ok: true, message: "Suscrito. Te avisaremos." }; // honeypot

    try {
      const email = data.email.toLowerCase();
      const ref = adminDb.collection("newsletter_subscribers").doc(email);
      const snap = await ref.get();

      if (snap.exists) {
        const sub = snap.data() as { confirmed?: boolean; token?: string };
        if (sub.confirmed !== false) {
          return { ok: true, message: "Ya estás suscrito. Gracias." };
        }
        // Existe pero sin confirmar: reenvía el email
        await sendConfirmationEmail(email, sub.token ?? "");
        return { ok: true, message: "Te hemos reenviado el email de confirmación. Revísalo." };
      }

      const token = randomBytes(24).toString("hex");
      await ref.set({
        email,
        confirmed: false,
        token,
        created_at: new Date().toISOString(),
      });
      await sendConfirmationEmail(email, token);
      return { ok: true, message: "Casi. Revisa tu email para confirmar la suscripción." };
    } catch (err) {
      console.error("Newsletter error:", err);
      return { ok: false, message: "No pudimos suscribirte. Inténtalo de nuevo." };
    }
  });

export const confirmNewsletter = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({ token: z.string().trim().min(10).max(128) }).parse(input),
  )
  .handler(async ({ data }): Promise<{ ok: boolean; message: string }> => {
    try {
      const q = await adminDb
        .collection("newsletter_subscribers")
        .where("token", "==", data.token)
        .limit(1)
        .get();

      if (q.empty) {
        return { ok: false, message: "Este enlace de confirmación no es válido o ha caducado." };
      }

      const doc = q.docs[0];
      const sub = doc.data() as { email: string; confirmed?: boolean };
      if (sub.confirmed === true) {
        return { ok: true, message: "Tu suscripción ya estaba confirmada. ¡Gracias!" };
      }

      await doc.ref.update({ confirmed: true, confirmed_at: new Date().toISOString() });

      try {
        await sendMail({
          to: process.env.NOTIFY_EMAIL || process.env.SMTP_USER!,
          subject: "Nueva suscripción a la newsletter",
          html: `<p style="font-family:Arial,sans-serif;">Nueva suscripción confirmada: <strong>${escapeHtml(sub.email)}</strong></p>`,
        });
      } catch (notifyErr) {
        console.error("Newsletter notification failed:", notifyErr);
      }

      return { ok: true, message: "¡Suscripción confirmada! Te avisaremos de todo." };
    } catch (err) {
      console.error("Newsletter confirm error:", err);
      return { ok: false, message: "No pudimos confirmar la suscripción. Inténtalo más tarde." };
    }
  });

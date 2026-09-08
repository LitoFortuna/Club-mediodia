import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { adminDb } from "@/lib/firebase.server";
import { sendMail } from "@/lib/mailer.server";
import { escapeHtml } from "@/lib/escape";

const schema = z.object({
  reason: z.enum(["booking", "prensa", "management", "general"]),
  name: z.string().trim().min(1, "Indica tu nombre").max(100),
  email: z.string().trim().email("Email inválido").max(255),
  subject: z.string().trim().min(1, "Indica un asunto").max(200),
  message: z.string().trim().min(1, "Escribe un mensaje").max(2000),
});

const REASON_LABEL: Record<z.infer<typeof schema>["reason"], string> = {
  booking: "Booking",
  prensa: "Prensa",
  management: "Management",
  general: "General",
};

export const sendContactMessage = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => schema.parse(input))
  .handler(async ({ data }) => {
    try {
      await adminDb.collection("contact_messages").add({
        reason: data.reason,
        name: data.name,
        email: data.email.toLowerCase(),
        subject: data.subject,
        message: data.message,
        created_at: new Date().toISOString(),
      });

      // Aviso a la banda (no bloquea el "mensaje guardado" si el email falla)
      try {
        await sendMail({
          to: process.env.NOTIFY_EMAIL || process.env.SMTP_USER!,
          replyTo: data.email,
          subject: `[Web · ${REASON_LABEL[data.reason]}] ${data.subject}`,
          html: `
          <div style="font-family:Arial,Helvetica,sans-serif;max-width:520px;margin:0 auto;color:#111;line-height:1.5;">
            <p style="text-transform:uppercase;letter-spacing:2px;font-size:11px;color:#C12523;font-weight:700;margin:0 0 4px;">
              Nuevo mensaje de contacto &mdash; ${REASON_LABEL[data.reason]}
            </p>
            <p style="margin:0 0 4px;"><strong>${escapeHtml(data.name)}</strong> &lt;${escapeHtml(data.email)}&gt;</p>
            <p style="margin:0 0 12px;"><strong>Asunto:</strong> ${escapeHtml(data.subject)}</p>
            <div style="padding:12px 16px;background:#f7f7f7;white-space:pre-wrap;">${escapeHtml(data.message)}</div>
            <p style="font-size:12px;color:#888;margin-top:16px;">Responde a este correo para contestar directamente a ${escapeHtml(data.name)}.</p>
          </div>`,
        });
      } catch (notifyErr) {
        console.error("Contact notification failed:", notifyErr);
      }

      return { ok: true, message: "Mensaje enviado. Te responderemos pronto." };
    } catch (err) {
      console.error("Contact error:", err);
      return { ok: false, message: "No pudimos enviar el mensaje. Inténtalo de nuevo." };
    }
  });

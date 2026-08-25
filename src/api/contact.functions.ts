import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { adminDb } from "@/lib/firebase.server";

const schema = z.object({
  reason: z.enum(["booking", "prensa", "management", "general"]),
  name: z.string().trim().min(1, "Indica tu nombre").max(100),
  email: z.string().trim().email("Email inválido").max(255),
  subject: z.string().trim().min(1, "Indica un asunto").max(200),
  message: z.string().trim().min(1, "Escribe un mensaje").max(2000),
});

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
      return { ok: true, message: "Mensaje enviado. Te responderemos pronto." };
    } catch (err) {
      console.error("Contact error:", err);
      return { ok: false, message: "No pudimos enviar el mensaje. Inténtalo de nuevo." };
    }
  });

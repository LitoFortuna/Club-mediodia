import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { adminDb } from "@/lib/firebase.server";
import { checkPinWithLockout, type PinGateResult } from "@/lib/pin-guard.server";
import { getSiteContent } from "@/lib/site-content.server";
import type { SiteContent } from "@/lib/types";

function pinDeniedMessage(gate: Extract<PinGateResult, { ok: false }>): string {
  if (gate.locked) {
    const h = Math.max(1, Math.round((gate.retryAfterMin ?? 120) / 60));
    return `Demasiados intentos fallidos. Vuelve a probar dentro de ~${h} h.`;
  }
  return "PIN incorrecto.";
}

// Lectura pública: el contenido en sí no es sensible, lo usan las páginas públicas.
export const getPublicSiteContent = createServerFn({ method: "GET" }).handler(
  async (): Promise<SiteContent> => getSiteContent(),
);

const contentSchema = z.object({
  bio_corta: z.string().trim().min(1).max(2000),
  bio_larga: z.array(z.string().trim().min(1).max(2000)).max(20),
  members: z.array(z.object({ name: z.string().trim().min(1).max(120), role: z.string().trim().min(1).max(120) })).max(20),
  streaming_links: z
    .array(z.object({ label: z.string().trim().min(1).max(60), url: z.string().trim().url() }))
    .max(30),
  youtube_video_url: z.string().trim().url(),
});

export const getSiteContentAdmin = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ pin: z.string().trim().min(1) }).parse(input))
  .handler(async ({ data }): Promise<{ ok: boolean; message?: string; content?: SiteContent }> => {
    const gate = await checkPinWithLockout(data.pin);
    if (!gate.ok) return { ok: false, message: pinDeniedMessage(gate) };
    const content = await getSiteContent();
    return { ok: true, content };
  });

export const updateSiteContent = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({ pin: z.string().trim().min(1), fields: contentSchema }).parse(input),
  )
  .handler(async ({ data }): Promise<{ ok: boolean; message: string }> => {
    const gate = await checkPinWithLockout(data.pin);
    if (!gate.ok) return { ok: false, message: pinDeniedMessage(gate) };

    try {
      await adminDb
        .collection("site_content")
        .doc("main")
        .set({ ...data.fields, updated_at: new Date().toISOString() }, { merge: true });
      console.log("[audit] site_content actualizado");
      return { ok: true, message: "Contenido guardado." };
    } catch (err) {
      console.error("updateSiteContent error:", err);
      return { ok: false, message: "No se pudo guardar." };
    }
  });

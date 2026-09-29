import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { adminDb } from "@/lib/firebase.server";
import { checkPinWithLockout, type PinGateResult } from "@/lib/pin-guard.server";
import type { Show } from "@/lib/types";

function pinDeniedMessage(gate: Extract<PinGateResult, { ok: false }>): string {
  if (gate.locked) {
    const h = Math.max(1, Math.round((gate.retryAfterMin ?? 120) / 60));
    return `Demasiados intentos fallidos. Vuelve a probar dentro de ~${h} h.`;
  }
  return "PIN incorrecto.";
}

const showFieldsSchema = z.object({
  city: z.string().trim().min(1).max(120),
  venue: z.string().trim().min(1).max(120),
  show_date: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha inválida (AAAA-MM-DD)"),
  show_time: z
    .string()
    .trim()
    .regex(/^\d{2}:\d{2}$/, "Hora inválida (HH:MM)")
    .optional()
    .or(z.literal("")),
  sold_out: z.boolean().optional(),
  ticket_url: z.string().trim().url("URL inválida").optional().or(z.literal("")),
  poster_url: z.string().trim().optional().or(z.literal("")),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toShow(doc: any): Show {
  return { id: doc.id, ...(doc.data() as Omit<Show, "id">) };
}

/* ---------- Listado (admin) ---------- */

export const listShowsAdmin = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ pin: z.string().trim().min(1) }).parse(input))
  .handler(async ({ data }): Promise<{ ok: boolean; message?: string; shows: Show[] }> => {
    const gate = await checkPinWithLockout(data.pin);
    if (!gate.ok) return { ok: false, message: pinDeniedMessage(gate), shows: [] };

    try {
      const snap = await adminDb.collection("shows").orderBy("show_date", "desc").get();
      return { ok: true, shows: snap.docs.map(toShow) };
    } catch (err) {
      console.error("listShowsAdmin error:", err);
      return { ok: false, message: "No se pudo cargar el listado.", shows: [] };
    }
  });

/* ---------- Crear ---------- */

export const createShow = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({ pin: z.string().trim().min(1), fields: showFieldsSchema }).parse(input),
  )
  .handler(async ({ data }): Promise<{ ok: boolean; message: string }> => {
    const gate = await checkPinWithLockout(data.pin);
    if (!gate.ok) return { ok: false, message: pinDeniedMessage(gate) };

    try {
      const f = data.fields;
      await adminDb.collection("shows").add({
        city: f.city,
        venue: f.venue,
        show_date: f.show_date,
        show_time: f.show_time || null,
        sold_out: !!f.sold_out,
        ticket_url: f.ticket_url || null,
        poster_url: f.poster_url || null,
        created_at: new Date().toISOString(),
      });
      console.log(`[audit] show creado: ${f.venue} ${f.show_date}`);
      return { ok: true, message: "Concierto añadido." };
    } catch (err) {
      console.error("createShow error:", err);
      return { ok: false, message: "No se pudo crear el concierto." };
    }
  });

/* ---------- Editar ---------- */

export const updateShow = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({ pin: z.string().trim().min(1), id: z.string().trim().min(1), fields: showFieldsSchema })
      .parse(input),
  )
  .handler(async ({ data }): Promise<{ ok: boolean; message: string }> => {
    const gate = await checkPinWithLockout(data.pin);
    if (!gate.ok) return { ok: false, message: pinDeniedMessage(gate) };

    try {
      const f = data.fields;
      const ref = adminDb.collection("shows").doc(data.id);
      const snap = await ref.get();
      if (!snap.exists) return { ok: false, message: "Ese concierto ya no existe." };

      await ref.update({
        city: f.city,
        venue: f.venue,
        show_date: f.show_date,
        show_time: f.show_time || null,
        sold_out: !!f.sold_out,
        ticket_url: f.ticket_url || null,
        poster_url: f.poster_url || null,
      });
      console.log(`[audit] show actualizado: ${data.id}`);
      return { ok: true, message: "Concierto actualizado." };
    } catch (err) {
      console.error("updateShow error:", err);
      return { ok: false, message: "No se pudo actualizar." };
    }
  });

/* ---------- Borrar ---------- */

export const deleteShow = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({ pin: z.string().trim().min(1), id: z.string().trim().min(1) }).parse(input),
  )
  .handler(async ({ data }): Promise<{ ok: boolean; message: string }> => {
    const gate = await checkPinWithLockout(data.pin);
    if (!gate.ok) return { ok: false, message: pinDeniedMessage(gate) };

    try {
      const ref = adminDb.collection("shows").doc(data.id);
      const snap = await ref.get();
      if (!snap.exists) return { ok: false, message: "Ese concierto ya no existe." };
      await ref.delete();
      console.log(`[audit] show borrado: ${data.id}`);
      return { ok: true, message: "Concierto eliminado." };
    } catch (err) {
      console.error("deleteShow error:", err);
      return { ok: false, message: "No se pudo eliminar." };
    }
  });

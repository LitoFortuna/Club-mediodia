import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { adminDb } from "@/lib/firebase.server";
import { checkPinWithLockout, type PinGateResult } from "@/lib/pin-guard.server";
import type { Product } from "@/lib/types";

function pinDeniedMessage(gate: Extract<PinGateResult, { ok: false }>): string {
  if (gate.locked) {
    const h = Math.max(1, Math.round((gate.retryAfterMin ?? 120) / 60));
    return `Demasiados intentos fallidos. Vuelve a probar dentro de ~${h} h.`;
  }
  return "PIN incorrecto.";
}

const productFieldsSchema = z.object({
  name: z.string().trim().min(1).max(120),
  description: z.string().trim().max(500).optional().or(z.literal("")),
  price_cents: z.number().int().min(0),
  currency: z.string().trim().min(1).max(10),
  image_url: z.string().trim().optional().or(z.literal("")),
  buy_url: z.string().trim().url("URL inválida").optional().or(z.literal("")),
  sold_out: z.boolean().optional(),
  order: z.number().int().optional(),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toProduct(doc: any): Product {
  return { id: doc.id, ...(doc.data() as Omit<Product, "id">) };
}

/* ---------- Listado (admin) ---------- */

export const listProductsAdmin = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ pin: z.string().trim().min(1) }).parse(input))
  .handler(async ({ data }): Promise<{ ok: boolean; message?: string; products: Product[] }> => {
    const gate = await checkPinWithLockout(data.pin);
    if (!gate.ok) return { ok: false, message: pinDeniedMessage(gate), products: [] };

    try {
      const snap = await adminDb.collection("products").orderBy("order", "asc").get();
      return { ok: true, products: snap.docs.map(toProduct) };
    } catch (err) {
      console.error("listProductsAdmin error:", err);
      return { ok: false, message: "No se pudo cargar el listado.", products: [] };
    }
  });

/* ---------- Crear ---------- */

export const createProduct = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({ pin: z.string().trim().min(1), fields: productFieldsSchema }).parse(input),
  )
  .handler(async ({ data }): Promise<{ ok: boolean; message: string }> => {
    const gate = await checkPinWithLockout(data.pin);
    if (!gate.ok) return { ok: false, message: pinDeniedMessage(gate) };

    try {
      const f = data.fields;
      await adminDb.collection("products").add({
        name: f.name,
        description: f.description || "",
        price_cents: f.price_cents,
        currency: f.currency,
        image_url: f.image_url || null,
        buy_url: f.buy_url || null,
        sold_out: !!f.sold_out,
        order: f.order ?? 0,
        created_at: new Date().toISOString(),
      });
      console.log(`[audit] producto creado: ${f.name}`);
      return { ok: true, message: "Producto añadido." };
    } catch (err) {
      console.error("createProduct error:", err);
      return { ok: false, message: "No se pudo crear el producto." };
    }
  });

/* ---------- Editar ---------- */

export const updateProduct = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        pin: z.string().trim().min(1),
        id: z.string().trim().min(1),
        fields: productFieldsSchema,
      })
      .parse(input),
  )
  .handler(async ({ data }): Promise<{ ok: boolean; message: string }> => {
    const gate = await checkPinWithLockout(data.pin);
    if (!gate.ok) return { ok: false, message: pinDeniedMessage(gate) };

    try {
      const f = data.fields;
      const ref = adminDb.collection("products").doc(data.id);
      const snap = await ref.get();
      if (!snap.exists) return { ok: false, message: "Ese producto ya no existe." };

      await ref.update({
        name: f.name,
        description: f.description || "",
        price_cents: f.price_cents,
        currency: f.currency,
        image_url: f.image_url || null,
        buy_url: f.buy_url || null,
        sold_out: !!f.sold_out,
        order: f.order ?? 0,
      });
      console.log(`[audit] producto actualizado: ${data.id}`);
      return { ok: true, message: "Producto actualizado." };
    } catch (err) {
      console.error("updateProduct error:", err);
      return { ok: false, message: "No se pudo actualizar." };
    }
  });

/* ---------- Borrar ---------- */

export const deleteProduct = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({ pin: z.string().trim().min(1), id: z.string().trim().min(1) }).parse(input),
  )
  .handler(async ({ data }): Promise<{ ok: boolean; message: string }> => {
    const gate = await checkPinWithLockout(data.pin);
    if (!gate.ok) return { ok: false, message: pinDeniedMessage(gate) };

    try {
      const ref = adminDb.collection("products").doc(data.id);
      const snap = await ref.get();
      if (!snap.exists) return { ok: false, message: "Ese producto ya no existe." };
      await ref.delete();
      console.log(`[audit] producto borrado: ${data.id}`);
      return { ok: true, message: "Producto eliminado." };
    } catch (err) {
      console.error("deleteProduct error:", err);
      return { ok: false, message: "No se pudo eliminar." };
    }
  });

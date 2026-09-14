#!/usr/bin/env node
// Añade un producto a la colección "products" de Firestore (tienda).
//
// Uso:
//   node scripts/add-product.mjs <ruta-al-service-account.json>
//
// El service-account.json es el mismo que descargaste en Firebase Console
// (Configuración del proyecto → Cuentas de servicio → Generar nueva clave
// privada). No lo pongas dentro de este repositorio.
//
// Para añadir otro producto en el futuro, edita el objeto `product` de
// abajo. `buy_url` debe ser un Payment Link de Stripe o un enlace de
// PayPal.me/checkout ya creado por la banda: este script no crea ni
// gestiona pagos.
import { readFileSync } from "fs";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const keyPath = process.argv[2];
if (!keyPath) {
  console.error("Uso: node scripts/add-product.mjs <ruta-al-service-account.json>");
  process.exit(1);
}

const serviceAccount = JSON.parse(readFileSync(keyPath, "utf8"));
initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

const product = {
  name: "Camiseta Un globo en la terraza",
  description: "100% algodón orgánico. Serigrafía a una tinta.",
  price_cents: 2000,
  currency: "EUR",
  image_url: null, // ruta pública, ej. "/merch/camiseta.jpg"
  buy_url: null, // Payment Link de Stripe/PayPal; null = se muestra "Próximamente"
  sold_out: false,
  order: 1,
  created_at: new Date().toISOString(),
};

const ref = await db.collection("products").add(product);
console.log("✅ Producto creado:", ref.id);
console.log(product);
process.exit(0);

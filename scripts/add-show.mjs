#!/usr/bin/env node
// Añade un concierto a la colección "shows" de Firestore.
//
// Uso:
//   node scripts/add-show.mjs <ruta-al-service-account.json>
//
// El service-account.json es el mismo que descargaste en Firebase Console
// (Configuración del proyecto → Cuentas de servicio → Generar nueva clave
// privada). No lo pongas dentro de este repositorio.
//
// Para añadir otro concierto en el futuro, edita el objeto `show` de abajo.
import { readFileSync } from "fs";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const keyPath = process.argv[2];
if (!keyPath) {
  console.error("Uso: node scripts/add-show.mjs <ruta-al-service-account.json>");
  process.exit(1);
}

const serviceAccount = JSON.parse(readFileSync(keyPath, "utf8"));
initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

const show = {
  city: "Barcelona",
  venue: "Paral·lel 62",
  show_date: "2026-11-28",
  // Sin hora, precio ni enlace de entradas confirmados todavía:
  // dejándolos vacíos, la tarjeta se muestra como "Próximamente".
  show_time: null,
  sold_out: false,
  ticket_url: null,
  poster_url: null,
  created_at: new Date().toISOString(),
};

const ref = await db.collection("shows").add(show);
console.log("✅ Show creado:", ref.id);
console.log(show);
process.exit(0);

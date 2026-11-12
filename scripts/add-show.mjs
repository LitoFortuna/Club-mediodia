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
  show_time: "20:00",
  // Puertas y concierto a las 20:00. Entrada general 15 €, venta por DICE.
  sold_out: false,
  ticket_url: "https://dice.fm/event/x9vq7e-club-mediodia-28th-nov-parallel-62-barcelona-tickets?lng=es",
  poster_url:
    "https://dice-media.imgix.net/attachments/2026-11-06/2cd7a96b-81ae-48e2-87ff-51804eccac6b.jpg?rect=0%2C0%2C768%2C768",
  created_at: new Date().toISOString(),
};

const ref = await db.collection("shows").add(show);
console.log("✅ Show creado:", ref.id);
console.log(show);
process.exit(0);

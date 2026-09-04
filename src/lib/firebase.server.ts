// Firebase Admin SDK — SOLO para uso en servidor (SSR / Cloud Functions)
// Usamos createRequire para importar firebase-admin como CJS y evitar
// el error "__dirname is not defined in ES module scope"
import { createRequire } from "module";

const require = createRequire(import.meta.url);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _adminDb: any;

function getAdminDb() {
  if (_adminDb) return _adminDb;

  // Importar firebase-admin como CJS via require para evitar el problema ESM
  const admin = require("firebase-admin");

  if (!admin.apps.length) {
    const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
    if (raw) {
      // En Vercel (u otros hosts sin ADC): credenciales de una service account
      // pasadas por variable de entorno. Admite JSON en claro o en base64.
      const json = raw.trim().startsWith("{")
        ? raw
        : Buffer.from(raw, "base64").toString("utf8");
      admin.initializeApp({ credential: admin.credential.cert(JSON.parse(json)) });
    } else {
      // En Firebase Hosting/Functions: Application Default Credentials
      admin.initializeApp();
    }
  }

  _adminDb = admin.firestore();
  return _adminDb;
}

// Proxy que inicializa al primer uso
export const adminDb = new Proxy({} as ReturnType<typeof getAdminDb>, {
  get(_, prop, receiver) {
    return Reflect.get(getAdminDb(), prop, receiver);
  },
});

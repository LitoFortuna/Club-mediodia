// Firebase Admin SDK — SOLO para uso en servidor (SSR / Cloud Functions)
// Usamos createRequire para importar firebase-admin como CJS y evitar
// el error "__dirname is not defined in ES module scope"
import { createRequire } from "module";

const require = createRequire(import.meta.url);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _adminDb: any;

// Construye las credenciales de la service account a partir de variables de
// entorno. Soporta dos formatos:
//   A) Tres variables sueltas (recomendado en Vercel):
//      FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY
//   B) El JSON completo (en claro o base64) en FIREBASE_SERVICE_ACCOUNT
// Si no hay ninguna, devuelve null y se usan las Application Default
// Credentials (caso Firebase Hosting/Functions).
function loadServiceAccount(): Record<string, string> | null {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKeyRaw = process.env.FIREBASE_PRIVATE_KEY;

  if (projectId && clientEmail && privateKeyRaw) {
    return {
      projectId,
      clientEmail,
      // Vercel guarda los saltos de línea como "\n" literal; hay que restaurarlos
      privateKey: privateKeyRaw.replace(/\\n/g, "\n"),
    };
  }

  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (raw) {
    let text = raw.trim();
    if (!text.startsWith("{")) {
      text = Buffer.from(text, "base64").toString("utf8").trim();
    }
    if (text.charCodeAt(0) === 0xfeff) text = text.slice(1); // quita BOM
    const json = JSON.parse(text);
    return {
      projectId: json.project_id,
      clientEmail: json.client_email,
      privateKey: String(json.private_key).replace(/\\n/g, "\n"),
    };
  }

  return null;
}

function getAdminDb() {
  if (_adminDb) return _adminDb;

  // Importar firebase-admin como CJS via require para evitar el problema ESM
  const admin = require("firebase-admin");

  if (!admin.apps.length) {
    const serviceAccount = loadServiceAccount();
    if (serviceAccount) {
      admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
    } else {
      // Firebase Hosting/Functions: Application Default Credentials
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

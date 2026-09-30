#!/usr/bin/env node
// Genera public/sitemap.xml antes de cada build: incluye las páginas
// estáticas más las fechas de /shows y /tienda leídas de Firestore (si hay
// credenciales disponibles). Sin credenciales, escribe solo las estáticas
// para que el build nunca falle por esto.
import { writeFileSync } from "fs";
import { fileURLToPath, pathToFileURL } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SITE_URL = "https://clubmediodia.es";
const today = new Date().toISOString().slice(0, 10);

const STATIC_PAGES = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/musica", changefreq: "monthly", priority: "0.8" },
  { path: "/el-club", changefreq: "monthly", priority: "0.7" },
  { path: "/shows", changefreq: "weekly", priority: "0.9" },
  { path: "/entradas", changefreq: "weekly", priority: "0.9" },
  { path: "/tienda", changefreq: "weekly", priority: "0.7" },
  { path: "/contacto", changefreq: "yearly", priority: "0.5" },
  { path: "/prensa", changefreq: "monthly", priority: "0.4" },
];

// Páginas de letras por canción (/musica/$slug): se leen de tracks.ts vía
// una importación dinámica, ya que este script corre con Node "plano" y
// tracks.ts no depende de nada específico del navegador/servidor.
async function getTrackPages() {
  try {
    const tracksPath = join(__dirname, "..", "src", "lib", "tracks.ts");
    const { TRACKS } = await import(pathToFileURL(tracksPath).href);
    return TRACKS.map((t) => ({
      path: `/musica/${t.slug}`,
      changefreq: "monthly",
      priority: "0.5",
    }));
  } catch (err) {
    console.warn("[sitemap] No se pudo leer tracks.ts, omito /musica/*:", err.message);
    return [];
  }
}

function loadServiceAccount() {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKeyRaw = process.env.FIREBASE_PRIVATE_KEY;

  if (projectId && clientEmail && privateKeyRaw) {
    return {
      projectId,
      clientEmail,
      privateKey: privateKeyRaw.replace(/\\n/g, "\n"),
    };
  }

  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (raw) {
    let text = raw.trim();
    if (!text.startsWith("{")) {
      text = Buffer.from(text, "base64").toString("utf8").trim();
    }
    if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);
    const json = JSON.parse(text);
    return {
      projectId: json.project_id,
      clientEmail: json.client_email,
      privateKey: String(json.private_key).replace(/\\n/g, "\n"),
    };
  }

  return null;
}

async function getLastmodDates() {
  const serviceAccount = loadServiceAccount();
  if (!serviceAccount) {
    console.log("[sitemap] Sin credenciales de Firebase: sitemap solo con páginas estáticas.");
    return {};
  }

  try {
    const { initializeApp, cert } = await import("firebase-admin/app");
    const { getFirestore } = await import("firebase-admin/firestore");

    const app = initializeApp({ credential: cert(serviceAccount) }, "sitemap-gen");
    const db = getFirestore(app);

    const [showsSnap, productsSnap] = await Promise.all([
      db.collection("shows").orderBy("created_at", "desc").limit(1).get(),
      db.collection("products").orderBy("created_at", "desc").limit(1).get(),
    ]);

    return {
      "/shows": showsSnap.empty ? undefined : showsSnap.docs[0].data().created_at?.slice(0, 10),
      "/tienda": productsSnap.empty
        ? undefined
        : productsSnap.docs[0].data().created_at?.slice(0, 10),
    };
  } catch (err) {
    console.warn("[sitemap] No se pudo leer Firestore, uso solo páginas estáticas:", err.message);
    return {};
  }
}

const lastmodByPath = await getLastmodDates();
const allPages = [...STATIC_PAGES, ...(await getTrackPages())];

const urls = allPages
  .map(({ path, changefreq, priority }) => {
    const lastmod = lastmodByPath[path] ?? today;
    return (
      `  <url><loc>${SITE_URL}${path}</loc>` +
      `<lastmod>${lastmod}</lastmod>` +
      `<changefreq>${changefreq}</changefreq>` +
      `<priority>${priority}</priority></url>`
    );
  })
  .join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

writeFileSync(join(__dirname, "..", "public", "sitemap.xml"), xml);
console.log("[sitemap] public/sitemap.xml generado.");

// Contenido editable desde /admin (biografía, miembros, enlaces de streaming,
// vídeo de YouTube). Vive en Firestore, doc único site_content/main.
// Si el doc no existe todavía (antes del primer guardado desde el panel),
// se usan estos valores por defecto — así nada se rompe.
import { adminDb } from "@/lib/firebase.server";
import type { SiteContent } from "@/lib/types";

export const DEFAULT_SITE_CONTENT: SiteContent = {
  bio_corta:
    "Club Mediodía es un trío de Barcelona que explora la psicodelia doméstica: canciones que viven en el " +
    "espacio entre el recuerdo y la distorsión. Su álbum debut, «Un globo en la terraza» (1 de mayo de 2026), " +
    "retrata la vida cotidiana atravesada por estados mentales cambiantes — recuerdos, ansiedad, nostalgia, deseo.",
  bio_larga: [
    "Club Mediodía no es solo una banda; es un estado mental. Nacidos en la penumbra de una terraza calurosa, " +
      "el trío barcelonés busca capturar el sonido de lo que se olvida.",
    "Su música habita en el espacio entre el recuerdo y la distorsión. «Un globo en la terraza», su álbum debut, " +
      "retrata la vida cotidiana atravesada por estados mentales cambiantes: recuerdos, ansiedad, nostalgia, deseo. " +
      "Momentos comunes que, vistos desde dentro, se vuelven extraños, intensos o ligeramente irreales.",
    "Grabado en El Patio Estudio (Barcelona) y producido por Daniel O'Connell (O'Connell Mastering), el disco reúne " +
      "ocho canciones que van de la psicodelia doméstica a la memoria borrosa, siempre con un pie en la terraza y " +
      "otro en el mediodía mental.",
  ],
  members: [
    { name: "Adriel Achaval", role: "Voz y guitarra" },
    { name: "Marco Mazzotta", role: "Batería y coros" },
    { name: "Mauri Armora Basanta", role: "Bajo y coros" },
  ],
  streaming_links: [
    { label: "YouTube Music", url: "https://music.youtube.com/@Club.Mediod%C3%ADa" },
    { label: "Amazon Music", url: "https://music.amazon.es/artists/B0GY23XKNS" },
    { label: "Deezer", url: "https://www.deezer.com/album/966629901" },
    { label: "Tidal", url: "https://tidal.com/artist/78353738" },
    { label: "iHeartRadio", url: "https://www.iheart.com/artist/id-50487368/albums/id-396201091" },
    { label: "Apple Music", url: "https://music.apple.com" },
    { label: "Bandcamp", url: "https://bandcamp.com" },
  ],
  youtube_video_url: "https://youtu.be/KOLy_CiVJJE?list=PLSMCWp0cxjKQ",
  updated_at: "",
};

export async function getSiteContent(): Promise<SiteContent> {
  try {
    const snap = await adminDb.collection("site_content").doc("main").get();
    if (!snap.exists) return DEFAULT_SITE_CONTENT;
    const data = snap.data() as Partial<SiteContent>;
    return { ...DEFAULT_SITE_CONTENT, ...data };
  } catch (err) {
    console.error("getSiteContent error:", err);
    return DEFAULT_SITE_CONTENT;
  }
}

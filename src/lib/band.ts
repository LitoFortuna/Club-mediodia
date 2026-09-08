// Datos de la banda y del álbum + generadores de JSON-LD (schema.org) para SEO/GEO.
import { CONCERT } from "@/lib/concert";
import type { Show } from "@/lib/types";

export const SITE_URL = "https://clubmediodia.es";

export const BAND = {
  name: "Club Mediodía",
  url: SITE_URL,
  genre: ["Indie", "Pop psicodélico"],
  foundingLocation: "Barcelona, España",
  image: `${SITE_URL}/og-default.jpg`,
  members: [
    { name: "Adriel Achaval", role: "Voz y guitarra" },
    { name: "Marco Mazzotta", role: "Batería y coros" },
    { name: "Mauri Armora Basanta", role: "Bajo y coros" },
  ],
  sameAs: [
    "https://open.spotify.com/artist/573822769419",
    "https://www.instagram.com/club.mediodia/",
    "https://www.youtube.com/channel/UCobKsproqA8miDdGqqVNwRA",
  ],
} as const;

export const ALBUM = {
  name: "Un globo en la terraza",
  datePublished: "2026-05-01",
  image: `${SITE_URL}/og-default.jpg`,
  sameAs: [
    "https://open.spotify.com/album/6C6u8Zv8Lxhx95zv3I4guY",
    "https://music.amazon.es/albums/B0GY1YWF7B",
  ],
  tracks: [
    { name: "Domingo", duration: "PT4M10S" },
    { name: "Aquí y Ahora (Amigo)", duration: "PT3M6S" },
    { name: "Tirito", duration: "PT2M46S" },
    { name: "Perdido", duration: "PT3M4S" },
    { name: "Las Mañanas", duration: "PT3M44S" },
    { name: "Mundial '94", duration: "PT4M29S" },
    { name: "Rimpiangere", duration: "PT3M21S" },
    { name: "Versiones", duration: "PT3M11S" },
  ],
} as const;

const bandNode = {
  "@type": "MusicGroup",
  "@id": `${SITE_URL}/#band`,
  name: BAND.name,
  url: BAND.url,
  genre: [...BAND.genre],
  image: BAND.image,
  foundingLocation: BAND.foundingLocation,
  member: BAND.members.map((m) => ({ "@type": "Person", name: m.name, roleName: m.role })),
  sameAs: [...BAND.sameAs],
};

export function musicGroupLd(): string {
  return JSON.stringify({ "@context": "https://schema.org", ...bandNode });
}

export function musicAlbumLd(): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "MusicAlbum",
    name: ALBUM.name,
    byArtist: bandNode,
    datePublished: ALBUM.datePublished,
    numTracks: ALBUM.tracks.length,
    image: ALBUM.image,
    sameAs: [...ALBUM.sameAs],
    track: ALBUM.tracks.map((t, i) => ({
      "@type": "MusicRecording",
      position: i + 1,
      name: t.name,
      duration: t.duration,
      byArtist: { "@id": `${SITE_URL}/#band` },
    })),
  });
}

// Direcciones postales conocidas por nombre de sala (para el JSON-LD de /shows)
const VENUE_ADDRESSES: Record<string, { streetAddress: string; postalCode: string }> = {
  "Hangar 05": { streetAddress: "Carrer Bassols, 5", postalCode: "08026" },
};

// Offset aproximado de Europe/Madrid: CEST (+02:00) de abril a octubre, CET (+01:00) el resto.
function madridOffset(dateISO: string): string {
  const month = Number(dateISO.slice(5, 7));
  return month >= 4 && month <= 10 ? "+02:00" : "+01:00";
}

function abs(url: string): string {
  return url.startsWith("http") ? url : `${SITE_URL}${url}`;
}

// MusicEvent para un concierto cualquiera de Firestore (usado en /shows).
export function showEventLd(show: Show): string {
  const addr = VENUE_ADDRESSES[show.venue];
  const event: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "MusicEvent",
    name: `${BAND.name} en directo — ${show.venue}`,
    startDate: show.show_time
      ? `${show.show_date}T${show.show_time}:00${madridOffset(show.show_date)}`
      : show.show_date,
    eventStatus: show.sold_out
      ? "https://schema.org/EventSoldOut"
      : "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: show.venue,
      address: {
        "@type": "PostalAddress",
        ...(addr ? { streetAddress: addr.streetAddress, postalCode: addr.postalCode } : {}),
        addressLocality: show.city,
        addressCountry: "ES",
      },
    },
    performer: bandNode,
    organizer: { "@type": "MusicGroup", name: BAND.name, url: BAND.url },
  };
  if (show.poster_url) event.image = abs(show.poster_url);
  if (show.ticket_url) {
    event.offers = {
      "@type": "Offer",
      url: abs(show.ticket_url),
      availability: show.sold_out
        ? "https://schema.org/SoldOut"
        : "https://schema.org/InStock",
    };
  }
  return JSON.stringify(event);
}

export function concertEventLd(): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "MusicEvent",
    name: `${BAND.name} en directo — ${CONCERT.venue}`,
    startDate: `${CONCERT.dateISO}T${CONCERT.startTime}:00+02:00`,
    doorTime: `${CONCERT.dateISO}T${CONCERT.doorsTime}:00+02:00`,
    endDate: `${CONCERT.dateISO}T22:30:00+02:00`,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    image: `${SITE_URL}${CONCERT.posterPath}`,
    url: `${SITE_URL}/entradas`,
    description:
      `${BAND.name} presenta en directo su álbum «${ALBUM.name}». ` +
      `Entrada libre reservando en ${SITE_URL}/entradas.`,
    location: {
      "@type": "Place",
      name: CONCERT.venue,
      address: {
        "@type": "PostalAddress",
        streetAddress: "Carrer Bassols, 5",
        addressLocality: "Barcelona",
        postalCode: "08026",
        addressCountry: "ES",
      },
    },
    performer: bandNode,
    organizer: { "@type": "MusicGroup", name: BAND.name, url: BAND.url },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}/entradas`,
      category: "Entrada libre con reserva",
    },
  });
}

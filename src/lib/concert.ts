// Datos del concierto con inscripción por QR. Edítalo aquí para el próximo evento.
export const CONCERT = {
  // Identificador interno (se guarda en Firestore junto a cada inscripción)
  id: "2026-09-11",
  bandName: "Club Mediodía",
  venue: "Hangar 05",
  address: "Carrer Bassols, 5, Sant Martí, 08026 Barcelona",
  city: "Barcelona",
  dateISO: "2026-09-11",
  doorsTime: "18:45",
  startTime: "19:00",
  priceInfo: "Entrada libre reservando desde la web",
  ageInfo: "Sin edad mínima",
  // Las inscripciones se cierran al empezar este instante (medianoche del 12 en Madrid)
  registrationDeadlineISO: "2026-09-12T00:00:00+02:00",
  // Máximo de acompañantes por inscripción (además del titular)
  maxGuestsPerRegistration: 9,
} as const;

export function formatConcertDateEs(): string {
  return new Date(`${CONCERT.dateISO}T00:00:00`).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function isRegistrationOpen(): boolean {
  return new Date() < new Date(CONCERT.registrationDeadlineISO);
}

// Código corto de entrada (también es el ID del documento en concert_guests).
// Alfabeto sin caracteres ambiguos: sin I, L, O, 0, 1.
export const GUEST_CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
export const GUEST_CODE_LENGTH = 6;

// Limpia lo que teclee/escanee el staff: mayúsculas y solo letras/números.
export function normalizeGuestCode(raw: string): string {
  return raw.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
}

// Formato bonito para mostrar: ABC-D23
export function formatGuestCode(code: string): string {
  const c = normalizeGuestCode(code);
  return c.length > 3 ? `${c.slice(0, 3)}-${c.slice(3)}` : c;
}

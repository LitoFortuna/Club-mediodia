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

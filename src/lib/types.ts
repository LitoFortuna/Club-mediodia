// Shared TypeScript types for Firestore collections (replaces Supabase types)

export interface Show {
  id: string;
  city: string;
  venue: string;
  show_date: string;        // "YYYY-MM-DD"
  show_time: string | null; // "HH:MM" or null
  sold_out: boolean;
  ticket_url: string | null;
  poster_url: string | null;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price_cents: number;      // precio en céntimos (evita errores de coma flotante)
  currency: string;         // "EUR"
  image_url: string | null;
  buy_url: string | null;   // Payment Link de Stripe/PayPal; null = "Próximamente"
  sold_out: boolean;
  order: number;            // orden manual de aparición
  created_at: string;
}

export interface SiteContent {
  bio_corta: string;
  bio_larga: string[]; // párrafos
  members: { name: string; role: string }[];
  streaming_links: { label: string; url: string }[];
  youtube_video_url: string; // URL normal de YouTube (youtu.be o watch)
  updated_at: string;
}

export interface ContactMessage {
  id?: string;
  reason: "booking" | "prensa" | "management" | "general";
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}

export interface NewsletterSubscriber {
  id?: string;
  email: string;
  created_at: string;
}

export interface ConcertRegistration {
  id?: string;
  event: string;
  contact_name: string;
  contact_email: string;
  party_size: number;
  created_at: string;
}

export type ConcertGuestStatus = "confirmed" | "waitlist" | "cancelled";

export interface ConcertGuest {
  code: string; // también es el ID del documento
  event: string;
  registration_id: string;
  name: string;
  email: string | null;
  is_lead: boolean;
  status: ConcertGuestStatus;
  checked_in: boolean;
  checked_in_at: string | null;
  created_at: string;
}

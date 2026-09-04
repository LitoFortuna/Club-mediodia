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

export interface ConcertGuest {
  token: string; // también es el ID del documento
  event: string;
  registration_id: string;
  name: string;
  email: string | null;
  is_lead: boolean;
  checked_in: boolean;
  checked_in_at: string | null;
  created_at: string;
}

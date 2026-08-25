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

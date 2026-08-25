import { createClient } from "@supabase/supabase-js";

// Reemplaza SERVICE_ROLE_KEY con tu key de:
// https://supabase.com/dashboard/project/bbstbyryyyvyhmkjgwbo/settings/api
// La encuentras en "Project API keys > service_role (secret)"
const SUPABASE_URL = "https://bbstbyryyyvyhmkjgwbo.supabase.co";
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SERVICE_ROLE_KEY) {
  console.error("❌ Falta SUPABASE_SERVICE_ROLE_KEY en el entorno.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const show = {
  city: "Barcelona",
  venue: "Club Sauvage · Plaza Real 7",
  show_date: "2026-05-22",
  show_time: "20:00",
  sold_out: false,
  ticket_url: "https://entradas.tickety.es/events/karmadame-club-sauvage",
};

const { data, error } = await supabase.from("shows").insert(show).select();

if (error) {
  console.error("❌ Error:", error.message);
  process.exit(1);
}

console.log("✅ Show insertado correctamente:", JSON.stringify(data, null, 2));

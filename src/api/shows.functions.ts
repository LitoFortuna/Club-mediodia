import { createServerFn } from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import type { Tables } from "@/integrations/supabase/types";

export type Show = Tables<"shows">;

export const getShows = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabaseAdmin
    .from("shows")
    .select("*")
    .order("show_date", { ascending: true });

  if (error) {
    console.error("Error loading shows:", error);
    return { shows: [] as Show[], error: "No se pudieron cargar las fechas." };
  }
  return { shows: (data ?? []) as Show[], error: null as string | null };
});

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const schema = z.object({
  email: z.string().trim().email("Email inválido").max(255),
});

export const subscribeNewsletter = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => schema.parse(input))
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin
      .from("newsletter_subscribers")
      .insert({ email: data.email.toLowerCase() });

    if (error) {
      // Duplicate email = success from user's POV
      if (error.code === "23505") {
        return { ok: true, message: "Ya estás suscrito. Gracias." };
      }
      console.error("Newsletter error:", error);
      return { ok: false, message: "No pudimos suscribirte. Inténtalo de nuevo." };
    }
    return { ok: true, message: "Suscrito. Te avisaremos." };
  });

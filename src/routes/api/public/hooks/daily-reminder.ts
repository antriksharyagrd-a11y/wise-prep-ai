import { createFileRoute } from "@tanstack/react-router";

// Called by pg_cron each day. Rotates the daily question and could email users.
export const Route = createFileRoute("/api/public/hooks/daily-reminder")({
  server: {
    handlers: {
      POST: async () => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const today = new Date().toISOString().slice(0, 10);
        const { data: existing } = await supabaseAdmin.from("daily_questions").select("day").eq("day", today).maybeSingle();
        if (!existing) {
          const { data: pool } = await supabaseAdmin.from("questions").select("id");
          if (pool && pool.length > 0) {
            const pick = pool[Math.floor(Math.random() * pool.length)];
            await supabaseAdmin.from("daily_questions").insert({ day: today, question_id: pick.id });
          }
        }
        // Stub: notify users with an active streak (email hook would go here).
        return new Response(JSON.stringify({ ok: true, day: today }), { headers: { "Content-Type": "application/json" } });
      },
    },
  },
});
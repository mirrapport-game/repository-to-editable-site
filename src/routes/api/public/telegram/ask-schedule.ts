import { createFileRoute } from "@tanstack/react-router";
import { askText, adminDb, tgSend } from "@/lib/telegram-schedule.server";

// Weekly cron trigger. Safe to call publicly: each facilitator is asked at most once per 20 hours.
export const Route = createFileRoute("/api/public/telegram/ask-schedule")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const db = await adminDb();
        const slug = new URL(request.url).searchParams.get("facilitator");
        const since = new Date(Date.now() - 20 * 3600 * 1000).toISOString();
        let q = db.from("facilitator_telegram").select("*").not("chat_id", "is", null).or(`last_asked_at.is.null,last_asked_at.lt.${since}`);
        if (slug) q = q.eq("facilitator_slug", slug);
        const { data } = await q;
        let asked = 0;
        for (const f of data ?? []) {
          try { await tgSend(f.chat_id!, askText(f.first_name)); await db.from("facilitator_telegram").update({ last_asked_at: new Date().toISOString() }).eq("facilitator_slug", f.facilitator_slug); asked++; } catch (e) { console.error(e); }
        }
        return Response.json({ ok: true, asked, throttled: slug ? asked === 0 : undefined });
      },
    },
  },
});

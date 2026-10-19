import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { adminDb, CHANNEL_CHAT, tgSend } from "@/lib/telegram-schedule.server";

const PHASE: Record<string, string> = { demo: "Бесплатная демо-игра", paid: "Игра", intensive: "Интенсив" };

// Called by a DB trigger when a game slot is published. Posts each slot to the channel once (announced_at).
export const Route = createFileRoute("/api/public/telegram/announce")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const parsed = z.object({ slot_id: z.string().uuid() }).safeParse(await request.json().catch(() => null));
        if (!parsed.success) return new Response("Bad request", { status: 400 });
        const db = await adminDb();
        const { data: s } = await db.from("marathon_slots").update({ announced_at: new Date().toISOString() })
          .eq("id", parsed.data.slot_id).is("announced_at", null).eq("published", true).select("starts_at, phase, game, theme, capacity").maybeSingle();
        if (!s) return Response.json({ ok: true, skipped: true });
        const when = new Date(s.starts_at).toLocaleString("ru-RU", { timeZone: "Europe/Moscow", weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" });
        const url = s.phase === "demo" ? "https://rapportgame.ru/demo" : "https://rapportgame.ru/bloggers";
        try {
          await tgSend(CHANNEL_CHAT, `Новая игра в расписании!\n\n${PHASE[s.phase] ?? "Игра"} «${s.game}»${s.theme ? ` · ${s.theme}` : ""}\n${when} МСК · ${s.capacity} мест`, { inline_keyboard: [[{ text: "Записаться", url }]] });
        } catch (e) { console.error(e); await db.from("marathon_slots").update({ announced_at: null }).eq("id", parsed.data.slot_id); return Response.json({ ok: false }, { status: 502 }); }
        return Response.json({ ok: true });
      },
    },
  },
});

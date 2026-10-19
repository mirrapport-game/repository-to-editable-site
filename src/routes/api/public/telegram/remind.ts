import { createFileRoute } from "@tanstack/react-router";
import { adminDb, tgSend } from "@/lib/telegram-schedule.server";

// Hourly cron: reminds Telegram-linked signups ~24h before their game. Idempotent via reminded_at.
export const Route = createFileRoute("/api/public/telegram/remind")({
  server: {
    handlers: {
      POST: async () => {
        const db = await adminDb();
        const now = Date.now();
        const { data } = await db
          .from("marathon_signups")
          .select("id, name, tg_chat_id, marathon_slots!inner(starts_at, game, theme)")
          .not("tg_chat_id", "is", null)
          .is("reminded_at", null)
          .gt("marathon_slots.starts_at", new Date(now).toISOString())
          .lt("marathon_slots.starts_at", new Date(now + 25 * 3600 * 1000).toISOString());
        let sent = 0;
        for (const row of (data ?? []) as Array<{ id: string; name: string; tg_chat_id: number; marathon_slots: { starts_at: string; game: string; theme: string } }>) {
          const s = row.marathon_slots;
          const when = new Date(s.starts_at).toLocaleString("ru-RU", { timeZone: "Europe/Moscow", weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" });
          try {
            await tgSend(row.tg_chat_id, `${row.name}, напоминаем: завтра ваша бесплатная демо-игра «${s.game}»${s.theme ? ` (${s.theme})` : ""} — ${when} МСК. Место за вами! Если планы изменились, просто ответьте на это сообщение.`);
            await db.from("marathon_signups").update({ reminded_at: new Date().toISOString() }).eq("id", row.id);
            sent++;
          } catch (e) { console.error(e); }
        }
        // Participants of host games.
        const { data: es } = await db.from("event_signups").select("id, name, tg_chat_id, facilitator_events!inner(starts_at, game, place)")
          .not("tg_chat_id", "is", null).is("reminded_at", null)
          .gt("facilitator_events.starts_at", new Date(now).toISOString()).lt("facilitator_events.starts_at", new Date(now + 25 * 3600 * 1000).toISOString());
        for (const row of (es ?? []) as Array<{ id: string; name: string; tg_chat_id: number; facilitator_events: { starts_at: string; game: string; place: string } }>) {
          const ev = row.facilitator_events;
          const when = new Date(ev.starts_at).toLocaleString("ru-RU", { timeZone: "Europe/Moscow", weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" });
          try {
            await tgSend(row.tg_chat_id, `${row.name}, напоминаем: завтра игра «${ev.game}» — ${when} МСК, ${ev.place}. Ждём вас! Если планы изменились, ответьте на это сообщение.`);
            await db.from("event_signups").update({ reminded_at: new Date().toISOString() }).eq("id", row.id);
            sent++;
          } catch (e) { console.error(e); }
        }
        // Hosts: remind about their own scheduled games ~24h ahead.
        const { data: evs } = await db.from("facilitator_events").select("id, facilitator_slug, starts_at, game, place, capacity")
          .is("host_reminded_at", null).gt("starts_at", new Date(now).toISOString()).lt("starts_at", new Date(now + 25 * 3600 * 1000).toISOString());
        for (const ev of evs ?? []) {
          const { data: tg } = await db.from("facilitator_telegram").select("chat_id, first_name, time_zone").eq("facilitator_slug", ev.facilitator_slug).not("chat_id", "is", null).maybeSingle();
          if (!tg?.chat_id) continue;
          const when = new Date(ev.starts_at).toLocaleString("ru-RU", { timeZone: tg.time_zone || "Europe/Moscow", weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" });
          try {
            await tgSend(tg.chat_id, `${tg.first_name || "Привет"}, напоминание: ваша игра «${ev.game}» — ${when}, ${ev.place}, мест: ${ev.capacity}. Проверьте заявки в кабинете: https://rapportgame.ru/course`);
            await db.from("facilitator_events").update({ host_reminded_at: new Date().toISOString() }).eq("id", ev.id);
            sent++;
          } catch (e) { console.error(e); }
        }
        return Response.json({ ok: true, sent });
      },
    },
  },
});

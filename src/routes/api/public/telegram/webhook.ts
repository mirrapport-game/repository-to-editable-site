import { createFileRoute } from "@tanstack/react-router";
import { timingSafeEqual } from "crypto";
import { askText, FACILITATOR_TZ, LEAD_OWNERS, adminDb, parseSchedule, tgSend, tgSendPlay, webhookSecret } from "@/lib/telegram-schedule.server";

function safeEqual(a: string, b: string) {
  const x = Buffer.from(a), y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

export const Route = createFileRoute("/api/public/telegram/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (!safeEqual(request.headers.get("X-Telegram-Bot-Api-Secret-Token") ?? "", webhookSecret())) return new Response("Unauthorized", { status: 401 });
        const update = await request.json();
        const post = update.channel_post ?? update.edited_channel_post;
        if (post && String(post.chat?.username ?? "").toLowerCase() === "rapport_game") {
          const text = String(post.text ?? post.caption ?? "").trim();
          if (text) {
            const db = await adminDb();
            await db.from("channel_posts").upsert({ message_id: post.message_id, text: text.slice(0, 4000), posted_at: new Date(post.date * 1000).toISOString() });
            // Cross-post new (not edited) channel posts to the VK community once.
            if (update.channel_post && process.env["VK_ACCESS_TOKEN"]) {
              const { data: row } = await db.from("channel_posts").select("vk_post_id").eq("message_id", post.message_id).maybeSingle();
              if (!row?.vk_post_id) {
                try {
                  const { vkPostToWall } = await import("@/lib/vk.server");
                  const vkId = await vkPostToWall(text.slice(0, 4000));
                  await db.from("channel_posts").update({ vk_post_id: vkId }).eq("message_id", post.message_id);
                } catch (e) { console.error(e); }
              }
            }
          }
          return Response.json({ ok: true });
        }
        const msg = update.message;
        if (!msg?.chat?.id || typeof update.update_id !== "number") return Response.json({ ok: true });
        const db = await adminDb();
        const { error: dup } = await db.from("telegram_updates").insert({ update_id: update.update_id, chat_id: msg.chat.id, text: msg.text ?? null, raw_update: update });
        if (dup) return Response.json({ ok: true, duplicate: true });

        const raw: string = msg.text ?? "";
        const sender = String(msg.from?.username ?? "").toLowerCase();
        if (LEAD_OWNERS.includes(sender) && /^\/(start|leads)\b/i.test(raw)) {
          await db.from("lead_notify_recipients").upsert({ chat_id: msg.chat.id, username: sender });
          await tgSend(msg.chat.id, "Готово! Сюда будут приходить заявки с сайта «Раппóрт».");
          return Response.json({ ok: true });
        }
        if (/^\/(start play|play)\b/i.test(raw) || /^(играть|игра)$/i.test(raw.trim())) { await tgSendPlay(msg.chat.id); return Response.json({ ok: true }); }

        const evRemind = raw.match(/^\/start e_([0-9a-f-]{36})$/i);
        if (evRemind) {
          const { data: s } = await db.from("event_signups").update({ tg_chat_id: msg.chat.id }).eq("id", evRemind[1]!).select("name, facilitator_events(starts_at, game, place)").maybeSingle();
          const ev = (s as { facilitator_events?: { starts_at: string; game: string; place: string } } | null)?.facilitator_events;
          await tgSend(msg.chat.id, ev
            ? `Готово, ${s!.name}! Вы записаны на игру «${ev.game}»: ${new Date(ev.starts_at).toLocaleString("ru-RU", { timeZone: "Europe/Moscow", weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })} МСК, ${ev.place}.\n\nЯ напомню вам за день до начала.`
            : "Не нашёл вашу запись. Запишитесь ещё раз на сайте.");
          return Response.json({ ok: true });
        }

        const remind = raw.match(/^\/start r_([0-9a-f-]{36})$/i);
        if (remind) {
          const { data: s } = await db.from("marathon_signups").update({ tg_chat_id: msg.chat.id }).eq("id", remind[1]!).select("name, marathon_slots(starts_at, game, theme)").maybeSingle();
          const slot = (s as { marathon_slots?: { starts_at: string; game: string; theme: string } } | null)?.marathon_slots;
          await tgSend(msg.chat.id, slot
            ? `Готово, ${s!.name}! Ваше место на демо-игре «${slot.game}»${slot.theme ? ` (${slot.theme})` : ""} закреплено: ${new Date(slot.starts_at).toLocaleString("ru-RU", { timeZone: "Europe/Moscow", weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })} МСК.\n\nЯ напомню вам за день до начала.`
            : "Не нашёл вашу запись. Запишитесь ещё раз на сайте — и снова нажмите кнопку напоминания.");
          return Response.json({ ok: true });
        }

        const username = String(msg.from?.username ?? "").toLowerCase();
        const { data: byChat } = await db.from("facilitator_telegram").select("*").eq("chat_id", msg.chat.id).maybeSingle();
        let link = byChat;
        if (!link && username) {
          const { data } = await db.from("facilitator_telegram").select("*").eq("username", username.replace(/^@/, "")).maybeSingle();
          if (data) { await db.from("facilitator_telegram").update({ chat_id: msg.chat.id }).eq("facilitator_slug", data.facilitator_slug); link = { ...data, chat_id: msg.chat.id }; }
        }
        if (!link) { await tgSendPlay(msg.chat.id); return Response.json({ ok: true }); }

        const text: string = msg.text ?? "";
        if (!text || text.startsWith("/start")) { await tgSend(msg.chat.id, askText(link.first_name)); return Response.json({ ok: true }); }

        const tz = FACILITATOR_TZ[link.facilitator_slug] ?? { offset: link.utc_offset || "+03:00", zone: link.time_zone || "Europe/Moscow" };
        const events = await parseSchedule(text, tz.offset);
        const now = new Date().toISOString();
        await db.from("facilitator_events").delete().eq("facilitator_slug", link.facilitator_slug).gte("starts_at", now);
        if (events.length) await db.from("facilitator_events").insert(events.map((e) => ({ ...e, facilitator_slug: link.facilitator_slug })));
        await db.from("facilitator_telegram").update({ last_reply_at: now }).eq("facilitator_slug", link.facilitator_slug);
        const list = events.map((e) => `• ${new Date(e.starts_at).toLocaleString("ru-RU", { timeZone: tz.zone, weekday: "short", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })} — ${e.game}${e.place ? `, ${e.place}` : ""}`).join("\n");
        await tgSend(msg.chat.id, events.length ? `Спасибо! Занёс в календарь на сайте:\n${list}\n\nЕсли что-то не так — просто пришлите расписание заново, я его заменю.` : "Понял, на ближайшее время игр нет — календарь очищен. Пришлите расписание, когда появится.");
        return Response.json({ ok: true });
      },
    },
  },
});

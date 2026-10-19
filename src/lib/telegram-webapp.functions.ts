import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function hmac(key: BufferSource, data: string) {
  const k = await crypto.subtle.importKey("raw", key, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return new Uint8Array(await crypto.subtle.sign("HMAC", k, new TextEncoder().encode(data)));
}

/** Вход из мини-приложения Telegram: проверяем подпись initData и выдаём одноразовый вход. */
export const telegramWebAppSignIn = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ initData: z.string().min(10).max(4096) }).parse(d))
  .handler(async ({ data }) => {
    const token = process.env["TELEGRAM_BOT_TOKEN"];
    if (!token) throw new Error("Telegram не настроен");
    const params = new URLSearchParams(data.initData);
    const hash = params.get("hash") ?? "";
    params.delete("hash");
    const check = [...params.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([k, v]) => `${k}=${v}`).join("\n");
    const secret = await hmac(new TextEncoder().encode("WebAppData"), token);
    const hex = Array.from(await hmac(secret, check)).map((b) => b.toString(16).padStart(2, "0")).join("");
    if (hex !== hash) throw new Error("Подпись Telegram не прошла проверку");
    if (Date.now() / 1000 - Number(params.get("auth_date") ?? 0) > 86400) throw new Error("Вход устарел, откройте приложение заново");
    const u = JSON.parse(params.get("user") ?? "{}") as { id?: number; first_name?: string; last_name?: string; username?: string };
    if (typeof u.id !== "number") throw new Error("Нет данных пользователя Telegram");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const email = `tg${u.id}@telegram.rapportgame.ru`;
    const meta = { telegram_id: u.id, telegram_username: u.username, full_name: [u.first_name, u.last_name].filter(Boolean).join(" ") };
    const created = await supabaseAdmin.auth.admin.createUser({ email, email_confirm: true, user_metadata: meta });
    if (created.error && !/already|registered|exists/i.test(created.error.message)) throw new Error(created.error.message);
    const link = await supabaseAdmin.auth.admin.generateLink({ type: "magiclink", email });
    if (link.error) throw new Error(link.error.message);
    if (link.data.user && !link.data.user.user_metadata?.["telegram_id"]) await supabaseAdmin.auth.admin.updateUserById(link.data.user.id, { user_metadata: { ...link.data.user.user_metadata, ...meta } });
    return { tokenHash: link.data.properties.hashed_token };
  });

const CLUB_URL = "https://rapportgame.ru/community";

/** Сообщение участнику клуба в Telegram (если он входил через Telegram). */
export const clubNotify = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ kind: z.enum(["invite", "answered", "like", "message"]), id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const me = context.userId;
    const { supabaseAdmin: db } = await import("@/integrations/supabase/client.server");
    const { tgSend } = await import("./telegram-schedule.server");
    const name = async (id: string) => (await db.from("member_profiles").select("display_name").eq("user_id", id).maybeSingle()).data?.display_name ?? "Участник клуба";
    const send = async (userId: string, text: string) => {
      const { data: u } = await db.auth.admin.getUserById(userId);
      const tg = u.user?.user_metadata?.["telegram_id"];
      if (typeof tg !== "number") return;
      try { await tgSend(tg, text, { inline_keyboard: [[{ text: "Открыть клуб", web_app: { url: CLUB_URL } }]] }); } catch (e) { console.error(e); }
    };

    if (data.kind === "invite" || data.kind === "answered") {
      const { data: inv } = await db.from("member_invites").select("from_user,to_user,status").eq("id", data.id).maybeSingle();
      if (!inv) return { ok: false };
      if (data.kind === "invite" && inv.from_user === me) await send(inv.to_user, `${await name(me)} приглашает вас на игру «Раппóрт»! Ответьте на три вопроса — если совпадут хотя бы два ответа, откроются контакты.`);
      if (data.kind === "answered" && inv.to_user === me && inv.status === "answered") {
        const { data: matched } = await db.rpc("invite_matched", { _a: inv.from_user, _b: inv.to_user });
        if (matched) {
          await send(inv.from_user, `Совпадение! Ваши ответы с ${await name(me)} совпали — контакты открыты в клубе.`);
          await send(me, `Совпадение! Ваши ответы с ${await name(inv.from_user)} совпали — контакты открыты в клубе.`);
        } else await send(inv.from_user, `${await name(me)} ответил(а) на ваше приглашение. В этот раз ответы не совпали.`);
      }
    }
    if (data.kind === "like") {
      const target = data.id;
      const { data: mine } = await db.from("member_likes").select("to_user").eq("from_user", me).eq("to_user", target).maybeSingle();
      if (!mine) return { ok: false };
      const { data: back } = await db.from("member_likes").select("from_user").eq("from_user", target).eq("to_user", me).maybeSingle();
      if (back) {
        await send(target, `Взаимная симпатия с ${await name(me)}! Теперь можно переписываться в клубе.`);
        await send(me, `Взаимная симпатия с ${await name(target)}! Теперь можно переписываться в клубе.`);
      } else await send(target, "Кто-то в клубе «Раппóрт» проявил к вам симпатию. Загляните в анкеты!");
    }
    if (data.kind === "message") {
      const { data: m } = await db.from("member_messages").select("sender,recipient").eq("id", data.id).maybeSingle();
      if (m && m.sender === me) await send(m.recipient, `Новое сообщение от ${await name(me)} в клубе «Раппóрт».`);
    }
    return { ok: true };
  });

import { createServerFn } from "@tanstack/react-start";

type TgUser = { id: number; first_name?: string; last_name?: string; username?: string; photo_url?: string; auth_date: number; hash: string };

async function sha256(data: string) {
  return new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(data)));
}

export const telegramSignIn = createServerFn({ method: "POST" })
  .inputValidator((d: TgUser) => {
    if (!d || typeof d.id !== "number" || typeof d.hash !== "string" || typeof d.auth_date !== "number") throw new Error("Bad data");
    return d;
  })
  .handler(async ({ data }) => {
    const token = process.env['TELEGRAM_BOT_TOKEN'];
    if (!token) throw new Error("Telegram не настроен");
    const { hash, ...rest } = data;
    const check = Object.keys(rest).sort().filter((k) => (rest as Record<string, unknown>)[k] != null)
      .map((k) => `${k}=${(rest as Record<string, unknown>)[k]}`).join("\n");
    const key = await crypto.subtle.importKey("raw", await sha256(token), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
    const sig = new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(check)));
    const hex = Array.from(sig).map((b) => b.toString(16).padStart(2, "0")).join("");
    if (hex !== hash) throw new Error("Подпись Telegram не прошла проверку");
    if (Date.now() / 1000 - data.auth_date > 86400) throw new Error("Вход устарел, попробуйте ещё раз");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const email = `tg${data.id}@telegram.rapportgame.ru`;
    const name = [data.first_name, data.last_name].filter(Boolean).join(" ");
    const created = await supabaseAdmin.auth.admin.createUser({ email, email_confirm: true, user_metadata: { telegram_id: data.id, telegram_username: data.username, full_name: name } });
    if (created.error && !/already|registered|exists/i.test(created.error.message)) throw new Error(created.error.message);
    if (!created.error) {
      try {
        const { notifyLead } = await import("@/lib/telegram-schedule.server");
        await notifyLead(`🆕 Новая регистрация на сайте\n${name || "Без имени"}${data.username ? ` (@${data.username})` : ""}\nTelegram ID: ${data.id}`);
      } catch (e) { console.error("register notify", e); }
    }
    const link = await supabaseAdmin.auth.admin.generateLink({ type: "magiclink", email });
    if (link.error) throw new Error(link.error.message);
    return { tokenHash: link.data.properties.hashed_token };
  });

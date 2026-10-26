import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";
import { createHash } from "crypto";

export const FACILITATOR_TZ: Record<string, { offset: string; zone: string }> = {
  "natalya-kireeva": { offset: "+08:00", zone: "Asia/Irkutsk" },
};

function keys() {
  const lovable = (process.env["AI_API_KEY"] || process.env["LOVABLE_API_KEY"]) ?? "";
  const tg = process.env["TELEGRAM_BOT_TOKEN"];
  if (!tg) throw new Error("Telegram is not configured");
  return { lovable, tg };
}

/** Telegram usernames allowed to receive site leads in their chat with the bot. */
export const LEAD_OWNERS = ["artem_rapport"];

export function webhookSecret() {
  return createHash("sha256").update(`telegram-webhook:${keys().tg}`).digest("base64url");
}

export const PLAY_WEBAPP_URL = "https://rapportgame.ru/play";

export async function tgSendPlay(chatId: number) {
  await tgSend(chatId, "Раппóрт прямо в Telegram — без регистрации. Мини-игра про отношения: играйте с друзьями прямо здесь. А в клубе знакомств приглашения и совпадения будут приходить вам сообщениями. 6 этапов от знакомства до близости. Первая игра бесплатно, каждая следующая — 500 ₽.", { inline_keyboard: [[{ text: "Играть в Раппóрт", web_app: { url: PLAY_WEBAPP_URL } }], [{ text: "Клуб знакомств", web_app: { url: "https://rapportgame.ru/community" } }]] });
}

export const CHANNEL_CHAT = "@rapport_game";

export async function tgSend(chatId: number | string, text: string, replyMarkup?: unknown) {
  const k = keys();
  const res = await fetch(`https://api.telegram.org/bot${k.tg}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, ...(replyMarkup ? { reply_markup: replyMarkup } : {}) }),
  });
  if (!res.ok) throw new Error(`Telegram sendMessage failed [${res.status}]: ${await res.text()}`);
}

export async function adminDb() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

export const askText = (name?: string | null) => `Здравствуйте${name ? `, ${name}` : ""}! Это сайт «Раппóрт». Пришлите, пожалуйста, расписание игр на ближайшую неделю одним сообщением — в свободной форме, например:\n\nСр 15.10 19:00 — Отношения, кафе «Кофемания»\nСб 18.10 12:00 — Живая, онлайн\n\nЯ сам занесу игры в календарь на вашей странице. Если игр нет — напишите «нет игр».`;
export const ASK_TEXT = askText("Наталья");

export type ParsedEvent = { starts_at: string; game: string; place: string };

export async function parseSchedule(text: string, offset: string): Promise<ParsedEvent[]> {
  const apiKey = keys().lovable;
  const provider = createOpenAI({ baseURL: process.env["AI_BASE_URL"] || "https://ai.gateway.lovable.dev/v1", apiKey, headers: { "Lovable-API-Key": apiKey } });
  const today = new Date().toISOString().slice(0, 10);
  const { text: out } = await generateText({
    model: provider.responses("openai/gpt-6-astra"),
    providerOptions: { openai: { store: false } },
    system: `Ты извлекаешь расписание игр из сообщения ведущей. Сегодня ${today}. Даты без года относи к ближайшему будущему. Часовой пояс ведущей ${offset}. Верни только JSON без markdown: {"events":[{"starts_at":"YYYY-MM-DDTHH:MM:00${offset}","game":"название игры","place":"место или онлайн"}]}. Если игр нет или сообщение не о расписании — {"events":[]}.`,
    prompt: text,
  });
  const m = out.match(/\{[\s\S]*\}/);
  if (!m) return [];
  const parsed = JSON.parse(m[0]) as { events?: ParsedEvent[] };
  return (parsed.events ?? []).filter((e) => e.starts_at && !Number.isNaN(Date.parse(e.starts_at))).slice(0, 30).map((e) => ({ starts_at: new Date(e.starts_at).toISOString(), game: String(e.game ?? "").slice(0, 120), place: String(e.place ?? "").slice(0, 160) }));
}

/** Host chats that also receive leads from their own landing page. */
export const LANDING_HOST_CHATS: Record<string, number> = { "volgograd-marina": 811308448 };

/** Sends a site lead to every owner chat subscribed via the bot. Never throws. */
export async function notifyLead(text: string, landing?: string) {
  const hostChat = landing ? LANDING_HOST_CHATS[landing] : undefined;
  if (hostChat) await tgSend(hostChat, text).catch((e) => console.error("Host lead notification failed:", e));
  try {
    const db = await adminDb();
    const { data } = await db.from("lead_notify_recipients").select("chat_id");
    await Promise.all((data ?? []).map((r) => tgSend(r.chat_id, text)));
  } catch (e) {
    console.error("Lead notification failed:", e);
  }
}

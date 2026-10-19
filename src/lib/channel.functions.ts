import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const postToChannel = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ text: z.string().trim().min(5).max(3500) }).parse(d))
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
    if (!isAdmin) throw new Error("Только для администратора");
    const { tgSend, CHANNEL_CHAT } = await import("@/lib/telegram-schedule.server");
    try { await tgSend(CHANNEL_CHAT, data.text, { inline_keyboard: [[{ text: "Оставить заявку", url: "https://rapportgame.ru/" }]] }); }
    catch (e) { console.error(e); return { ok: false, error: "Не удалось отправить. Проверьте, что бот @Rapport_game_bot — администратор канала." }; }
    return { ok: true, error: null };
  });

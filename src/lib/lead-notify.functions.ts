import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// Уведомляет владельца в Telegram о заявке, которую браузер уже сохранил сам.
// Текст собирается только из реальной строки в базе и только для свежих записей.
export const notifySavedLead = createServerFn({ method: "POST" })
  .inputValidator((input) => z.object({ kind: z.enum(["game_order", "marathon"]), id: z.string().uuid() }).parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const fresh = (iso: string) => Date.now() - Date.parse(iso) < 10 * 60 * 1000;
    let text = "";
    if (data.kind === "game_order") {
      const { data: o } = await supabaseAdmin.from("game_orders").select("game,facilitator_slug,preferred_date,contact,comment,created_at").eq("id", data.id).maybeSingle();
      if (!o || !fresh(o.created_at)) return { ok: false };
      text = `Новая заявка ведущему\nВедущий: ${o.facilitator_slug}\nИгра: ${o.game}\nДата: ${o.preferred_date}\nКонтакт: ${o.contact}${o.comment ? `\n${o.comment}` : ""}`;
    } else {
      const { data: m } = await supabaseAdmin.from("marathon_signups").select("name,contact,created_at").eq("id", data.id).maybeSingle();
      if (!m || !fresh(m.created_at)) return { ok: false };
      text = `Новая запись на марафон\nИмя: ${m.name}\nКонтакт: ${m.contact}`;
    }
    const { notifyLead } = await import("./telegram-schedule.server");
    await notifyLead(text);
    return { ok: true };
  });

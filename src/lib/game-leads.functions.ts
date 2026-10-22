import { createServerFn } from "@tanstack/react-start";
import { BOOKING_FAILURE, gameLeadSchema, type GameLeadInput, type GameLeadResult } from "./booking-phone";

export const submitGameLead = createServerFn({ method: "POST" })
  .inputValidator((input: GameLeadInput) => input)
  .handler(async ({ data: input }): Promise<GameLeadResult> => {
    const parsed = gameLeadSchema.safeParse(input);
    if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Проверьте поля формы" };
    const data = parsed.data;
    if (!data.phone) return { ok: false, message: "Проверьте номер телефона" };
    try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("crm_contacts").insert({
      marketing_consent: data.marketing ?? false,
      name: data.name,
      phone: data.phone,
      city: data.city,
      source: `${data.formName ?? "Форма записи"}: «${data.game}» · ${data.format}`,
      notes: [`Форма: ${data.formName ?? "Форма записи"}`, data.page && `Страница: ${data.page}`, `Игра: ${data.game}`, `Формат: ${data.format}`, `Город: ${data.city}`, data.mentorship ? "Интересует также индивидуальное сопровождение" : ""].filter(Boolean).join(". "),
      stage: "observer",
      amount: 2500,
    });
    if (error) {
      console.error("Game lead could not be saved:", error.code);
      return { ok: false, message: BOOKING_FAILURE };
    }
    try {
      const { notifyLead } = await import("./telegram-schedule.server");
      await notifyLead(`Новая заявка: ${data.formName ?? "Форма записи"}${data.page ? `\nСтраница: ${data.page}` : ""}\nИгра: ${data.game}\nФормат: ${data.format}\nГород: ${data.city}\nИмя: ${data.name}\nТелефон: ${data.phone}${data.mentorship ? "\nИнтересует сопровождение" : ""}`);
    } catch { console.error("Game lead saved, notification unavailable"); }
    return { ok: true };
    } catch { console.error("Game lead storage unavailable"); return { ok: false, message: BOOKING_FAILURE }; }
  });

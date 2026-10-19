import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const projects = ["Игра про продажи", "Игра для сетевых компаний", "Игра для мужчин"] as const;

const focusGroupApplicationSchema = z.object({
  name: z.string().trim().min(2, "Укажите имя").max(100),
  phone: z.string().trim().min(7, "Проверьте номер телефона").max(30).regex(/^[+\d\s()\-@._a-zA-Zа-яА-ЯёЁ]+$/, "Проверьте контакт"),
  project: z.enum(projects),
  format: z.enum(["Онлайн", "Офлайн", "Индивидуально", "Для группы"]),
  consent: z.literal(true),
  marketing: z.boolean().optional(),
  website: z.string().max(0),
});

export const submitFocusGroupApplication = createServerFn({ method: "POST" })
  .inputValidator((input) => focusGroupApplicationSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("crm_contacts").insert({
      marketing_consent: data.marketing ?? false,
      name: data.name,
      phone: data.phone,
      source: `Фокус-группа: ${data.project} · ${data.format}`,
      stage: "observer",
      amount: 0,
      notes: `Бесплатное участие в фокус-группе новой игры. Формат: ${data.format}`,
    });

    if (error) {
      console.error("Focus group application could not be saved:", error.message);
      throw new Error("Не удалось отправить заявку. Попробуйте ещё раз.");
    }
    const { notifyLead } = await import("./telegram-schedule.server");
    await notifyLead(`Новая заявка в фокус-группу\nПроект: ${data.project}\nФормат: ${data.format}\nИмя: ${data.name}\nКонтакт: ${data.phone}`);

    return { ok: true };
  });
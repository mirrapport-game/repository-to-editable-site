import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const facilitatorApplicationSchema = z.object({
  name: z.string().trim().min(2, "Укажите имя").max(100),
  city: z.string().trim().min(2, "Укажите город").max(100),
  phone: z.string().trim().min(7, "Проверьте номер телефона").max(30)
    .regex(/^[+\d\s()\-]+$/, "Проверьте номер телефона"),
  interest: z.enum(["Пакет «Ведущий»", "Пакет «Под ключ»", "Пакет «Инвестор»", "Проведение игр", "Академия Раппóрт", "Индивидуальное сопровождение", "Покупка комплекта", "Партнёрство", "Другое"]),
  website: z.string().max(0),
  consent: z.literal(true, { message: "Отметьте согласие на обработку персональных данных" }),
});

export const submitFacilitatorApplication = createServerFn({ method: "POST" })
  .inputValidator((input) => facilitatorApplicationSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("facilitator_applications").insert({
      name: data.name,
      city: data.city,
      phone: data.phone,
      interest: data.interest,
    });

    if (error) {
      console.error("Facilitator application could not be saved:", error.message);
      throw new Error("Не удалось отправить заявку. Попробуйте ещё раз.");
    }
    const { notifyLead } = await import("./telegram-schedule.server");
    await notifyLead(`Новая заявка ведущего\nИнтерес: ${data.interest}\nГород: ${data.city}\nИмя: ${data.name}\nТелефон: ${data.phone}`);

    return { ok: true };
  });
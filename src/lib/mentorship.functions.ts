import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { MENTORSHIP_PRICE_RUB } from "@/data/prices";

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(5).max(60).regex(/^[+\d\s()\-@._a-zA-Zа-яА-ЯёЁ]+$/),
  goal: z.enum(["Стать ведущим", "Решить личную ситуацию", "Пока не знаю"]),
  format: z.enum(["Онлайн", "Офлайн", "Индивидуально", "Для группы"]),
  source: z.string().trim().max(80).optional(),
  marketing: z.boolean().optional(),
  website: z.string().max(0),
});

function siteOrigin(): string {
  return process.env["SITE_ORIGIN"] ?? "https://rapportgame.ru";
}

export const submitMentorshipLead = createServerFn({ method: "POST" })
  .inputValidator((input) => schema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("crm_contacts").insert({
      marketing_consent: data.marketing ?? false,
      name: data.name,
      phone: data.phone,
      source: `Индивидуальное сопровождение${data.source ? ` (${data.source})` : ""}`,
      stage: "observer",
      amount: MENTORSHIP_PRICE_RUB,
      notes: `Цель: ${data.goal}. Формат: ${data.format}`,
    });
    if (error) {
      console.error("Mentorship lead could not be saved:", error.message);
      throw new Error("Не удалось отправить заявку. Попробуйте ещё раз.");
    }
    const { notifyLead } = await import("./telegram-schedule.server");
    await notifyLead(`Новая заявка: индивидуальное сопровождение\nЦель: ${data.goal}\nФормат: ${data.format}\nИмя: ${data.name}\nКонтакт: ${data.phone}`);
    return { ok: true };
  });

// Заявка + оплата сопровождения: сохраняет заявку Артёму и возвращает ссылку на оплату.
export const payMentorshipLead = createServerFn({ method: "POST" })
  .inputValidator((input) => schema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: lead, error } = await supabaseAdmin.from("crm_contacts").insert({
      marketing_consent: data.marketing ?? false,
      name: data.name,
      phone: data.phone,
      source: `Индивидуальное сопровождение — оплата${data.source ? ` (${data.source})` : ""}`,
      stage: "observer",
      amount: MENTORSHIP_PRICE_RUB,
      notes: `Цель: ${data.goal}. Формат: ${data.format}`,
    }).select("id").single();
    if (error || !lead) {
      console.error("Mentorship paid lead insert failed:", error?.message);
      throw new Error("Не удалось отправить заявку. Попробуйте ещё раз.");
    }

    const { createPayment } = await import("./yookassa.server");
    const payment = await createPayment({
      amountRub: MENTORSHIP_PRICE_RUB,
      description: `Индивидуальное сопровождение «Раппóрт» — заявка ${lead.id.slice(0, 8)}`,
      returnUrl: `${siteOrigin()}/payment/result?mentorship=${lead.id}`,
      idempotenceKey: `mentorship-${lead.id}`,
      metadata: { kind: "mentorship", order_id: lead.id },
    });

    await supabaseAdmin.from("crm_contacts").update({
      payment_id: payment.id,
      payment_status: payment.status,
      updated_at: new Date().toISOString(),
    }).eq("id", lead.id);

    const url = payment.confirmation?.confirmation_url;
    if (!url) throw new Error("Не удалось получить ссылку на оплату");
    return { url };
  });

// Публичная проверка статуса оплаты по id заявки (uuid неугадываем).
export const getMentorshipPaymentStatus = createServerFn({ method: "GET" })
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row } = await supabaseAdmin.from("crm_contacts")
      .select("payment_status")
      .eq("id", data.id)
      .maybeSingle();
    return { status: row?.payment_status ?? "unknown" };
  });

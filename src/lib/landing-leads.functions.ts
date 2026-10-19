import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const utm = z.string().trim().max(200).optional().default("");
const schema = z.object({
  landing: z.string().trim().min(1).max(80),
  host: z.string().trim().max(120),
  city: z.string().trim().max(80),
  name: z.string().trim().min(2).max(100),
  contact: z.string().trim().min(3).max(100),
  button: z.string().trim().max(80).optional().default(""),
  utm_source: utm, utm_medium: utm, utm_campaign: utm, utm_content: utm, utm_term: utm,
  referrer: z.string().trim().max(300).optional().default(""),
  marketing: z.boolean().optional(),
  website: z.string().max(0),
});

export const submitLandingLead = createServerFn({ method: "POST" })
  .inputValidator((input) => schema.parse(input))
  .handler(async ({ data }) => {
    const utmLine = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]
      .map((k) => (data as unknown as Record<string, string>)[k] ? `${k}=${(data as unknown as Record<string, string>)[k]}` : "").filter(Boolean).join(" · ");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: lh } = await supabaseAdmin.from("landing_hosts").select("host_slug").eq("landing", data.landing).maybeSingle();
    const { error } = await supabaseAdmin.from("crm_contacts").insert({
      marketing_consent: data.marketing ?? false,
      host_slug: lh?.host_slug ?? null,
      name: data.name,
      phone: data.contact,
      source: `Посадочная: ${data.landing}${data.utm_source ? ` · ${data.utm_source}` : ""}`,
      notes: [`Ведущая: ${data.host}`, `Город: ${data.city}`, data.button && `Кнопка: ${data.button}`, utmLine && `UTM: ${utmLine}`, data.referrer && `Откуда: ${data.referrer}`].filter(Boolean).join(". "),
      stage: "observer",
      amount: 2500,
    });
    if (error) { console.error("Landing lead failed:", error.message); throw new Error("Не удалось отправить заявку"); }
    const { notifyLead } = await import("./telegram-schedule.server");
    await notifyLead(`Заявка с посадочной «${data.landing}»\nВедущая: ${data.host}\nИмя: ${data.name}\nКонтакт: ${data.contact}${utmLine ? `\nUTM: ${utmLine}` : ""}`);
    return { ok: true };
  });

const visitSchema = z.object({ landing: z.string().trim().min(1).max(80).regex(/^[a-z0-9-]+$/), utm_source: utm, utm_campaign: utm, referrer: z.string().trim().max(300).optional().default("") });

// Public: records one page view of a landing page (no personal data).
export const recordLandingVisit = createServerFn({ method: "POST" })
  .inputValidator((input) => visitSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("landing_visits").insert(data);
    if (error) console.error("Landing visit failed:", error.message);
    return { ok: true };
  });

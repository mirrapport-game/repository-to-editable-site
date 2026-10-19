import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { participationPrice, boxPrice } from "@/data/prices";

function siteOrigin(): string {
  return process.env["SITE_ORIGIN"] ?? "https://rapportgame.ru";
}

export const createGameOrderPayment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ orderId: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context as unknown as { supabase: any; userId: string };
    const { data: order, error } = await supabase
      .from("game_orders")
      .select("id,user_id,game,status,payment_status,amount_rub")
      .eq("id", data.orderId)
      .single();
    if (error || !order || order.user_id !== userId) throw new Error("Заявка не найдена");
    if (order.status !== "confirmed") throw new Error("Оплата доступна после подтверждения заявки ведущей");
    if (order.payment_status === "succeeded") throw new Error("Заявка уже оплачена");

    const { createPayment } = await import("./yookassa.server");
    const amount = order.amount_rub ?? participationPrice(order.game);
    const payment = await createPayment({
      amountRub: amount,
      description: `Игра «${order.game}» — заявка ${order.id.slice(0, 8)}`,
      returnUrl: `${siteOrigin()}/payment/result?order=${order.id}`,
      idempotenceKey: `game-order-${order.id}`,
      metadata: { kind: "game_order", order_id: order.id },
    });

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("game_orders").update({
      payment_id: payment.id,
      payment_status: payment.status,
      amount_rub: amount,
      updated_at: new Date().toISOString(),
    }).eq("id", order.id);

    const url = payment.confirmation?.confirmation_url;
    if (!url) throw new Error("Не удалось получить ссылку на оплату");
    return { url };
  });

const boxOrderSchema = z.object({
  gameSlug: z.string().trim().min(2).max(50),
  contact: z.string().trim().min(3).max(150),
  city: z.string().trim().min(2).max(100),
  address: z.string().trim().max(300).default(""),
});

export const createBoxOrderPayment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => boxOrderSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { userId } = context as unknown as { userId: string };
    const amount = boxPrice(data.gameSlug);

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: order, error } = await supabaseAdmin.from("box_orders").insert({
      user_id: userId,
      game_slug: data.gameSlug,
      contact: data.contact,
      city: data.city,
      address: data.address,
      amount_rub: amount,
    }).select("id").single();
    if (error || !order) {
      console.error("Box order insert failed:", error?.message);
      throw new Error("Не удалось создать заказ. Попробуйте ещё раз.");
    }
    const { notifyLead } = await import("./telegram-schedule.server");
    await notifyLead(`Новый заказ коробки\nИгра: ${data.gameSlug}\nГород: ${data.city}\nКонтакт: ${data.contact}`);

    const { createPayment } = await import("./yookassa.server");
    const payment = await createPayment({
      amountRub: amount,
      description: `Коробка «Раппóрт» (${data.gameSlug}) — заказ ${order.id.slice(0, 8)}`,
      returnUrl: `${siteOrigin()}/payment/result?box=${order.id}`,
      idempotenceKey: `box-order-${order.id}`,
      metadata: { kind: "box_order", order_id: order.id },
    });

    await supabaseAdmin.from("box_orders").update({
      payment_id: payment.id,
      payment_status: payment.status,
      updated_at: new Date().toISOString(),
    }).eq("id", order.id);

    const url = payment.confirmation?.confirmation_url;
    if (!url) throw new Error("Не удалось получить ссылку на оплату");
    return { url };
  });

export const createClubInvitePayment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ inviteId: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context as unknown as { supabase: any; userId: string };
    const { data: invite, error } = await supabase.from("member_invites")
      .select("id,from_user,kind,amount_rub,payment_status").eq("id", data.inviteId).single();
    if (error || !invite || invite.from_user !== userId || invite.kind !== "individual") throw new Error("Приглашение не найдено");
    if (invite.payment_status === "succeeded") throw new Error("Приглашение уже оплачено");
    const amount = invite.amount_rub ?? 5000;
    const { createPayment } = await import("./yookassa.server");
    const payment = await createPayment({
      amountRub: amount,
      description: `Индивидуальная игра «Раппóрт» — приглашение ${invite.id.slice(0, 8)}`,
      returnUrl: `${siteOrigin()}/community`,
      idempotenceKey: `club-invite-${invite.id}`,
      metadata: { kind: "club_invite", order_id: invite.id },
    });
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("member_invites").update({ payment_id: payment.id, payment_status: payment.status }).eq("id", invite.id);
    const url = payment.confirmation?.confirmation_url;
    if (!url) throw new Error("Не удалось получить ссылку на оплату");
    return { url };
  });

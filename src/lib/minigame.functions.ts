import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { MINIGAME_PRICE, type DeckCard } from "@/data/minigame";

function siteOrigin(): string {
  return process.env["SITE_ORIGIN"] ?? "https://rapportgame.ru";
}

async function accessFor(userId: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { count } = await supabaseAdmin.from("minigame_sessions").select("id", { count: "exact", head: true }).eq("user_id", userId);
  const { data: credits } = await supabaseAdmin.from("minigame_purchases").select("id").eq("user_id", userId).eq("payment_status", "succeeded").is("used_at", null).order("created_at");
  return { supabaseAdmin, played: count ?? 0, credits: credits ?? [] };
}

export const getMinigameAccess = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { userId } = context as unknown as { userId: string };
    const { played, credits } = await accessFor(userId);
    return { freeAvailable: played === 0, paidGames: credits.length, played };
  });

export const startMinigame = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { userId } = context as unknown as { userId: string };
    const { supabaseAdmin, played, credits } = await accessFor(userId);
    const { count: cardCount } = await supabaseAdmin.from("minigame_cards").select("id", { count: "exact", head: true });
    if (!cardCount) return { status: "no_cards" as const, cards: [] as DeckCard[] };
    let purchaseId: string | null = null;
    if (played > 0) {
      const credit = credits[0];
      if (!credit) return { status: "payment_required" as const, cards: [] as DeckCard[] };
      const { data: used } = await supabaseAdmin.from("minigame_purchases").update({ used_at: new Date().toISOString() }).eq("id", credit.id).is("used_at", null).select("id");
      if (!used?.length) return { status: "payment_required" as const, cards: [] as DeckCard[] };
      purchaseId = credit.id;
    }
    await supabaseAdmin.from("minigame_sessions").insert({ user_id: userId, free: played === 0, purchase_id: purchaseId });

    const { data: rows } = await supabaseAdmin.from("minigame_cards").select("id,stage,gender,image_path");
    const list = rows ?? [];
    const cards: DeckCard[] = [];
    if (list.length) {
      const { data: signed } = await supabaseAdmin.storage.from("minigame-cards").createSignedUrls(list.map((r) => r.image_path), 60 * 60 * 8);
      list.forEach((r, i) => {
        const url = signed?.[i]?.signedUrl;
        if (url) cards.push({ id: r.id, stage: r.stage as DeckCard["stage"], gender: r.gender as DeckCard["gender"], url });
      });
    }
    return { status: "ok" as const, cards };
  });

export const createMinigamePayment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { userId } = context as unknown as { userId: string };
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin.from("minigame_purchases").insert({ user_id: userId, amount_rub: MINIGAME_PRICE }).select("id").single();
    if (error || !row) throw new Error("Не удалось создать оплату. Попробуйте ещё раз.");
    const { createPayment } = await import("./yookassa.server");
    const payment = await createPayment({
      amountRub: MINIGAME_PRICE,
      description: `Онлайн-игра «Раппóрт» — ${row.id.slice(0, 8)}`,
      returnUrl: `${siteOrigin()}/play?purchase=${row.id}`,
      idempotenceKey: `minigame-${row.id}`,
      metadata: { kind: "minigame", order_id: row.id },
    });
    await supabaseAdmin.from("minigame_purchases").update({ payment_id: payment.id, payment_status: payment.status }).eq("id", row.id);
    const url = payment.confirmation?.confirmation_url;
    if (!url) throw new Error("Не удалось получить ссылку на оплату");
    return { url };
  });

// Проверка оплаты при возврате из ЮKassa (на случай, если уведомление ещё не пришло)
export const refreshMinigamePurchase = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { purchaseId: string }) => ({ purchaseId: String(input.purchaseId).slice(0, 64) }))
  .handler(async ({ data, context }) => {
    const { userId } = context as unknown as { userId: string };
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row } = await supabaseAdmin.from("minigame_purchases").select("id,user_id,payment_id,payment_status").eq("id", data.purchaseId).maybeSingle();
    if (!row || row.user_id !== userId || !row.payment_id) return { status: "unknown" };
    if (row.payment_status === "succeeded") return { status: "succeeded" };
    const { getPayment } = await import("./yookassa.server");
    const payment = await getPayment(row.payment_id);
    const paid = payment.status === "succeeded" && payment.paid;
    await supabaseAdmin.from("minigame_purchases").update({ payment_status: payment.status, ...(paid ? { paid_at: new Date().toISOString() } : {}) }).eq("id", row.id);
    return { status: payment.status };
  });

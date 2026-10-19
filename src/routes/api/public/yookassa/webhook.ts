import { createFileRoute } from "@tanstack/react-router";

// YooKassa sends payment status notifications here. We never trust the
// payload directly — we re-fetch the payment from the API and only then
// mark the order as paid.
export const Route = createFileRoute("/api/public/yookassa/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let event: { event?: string; object?: { id?: string; metadata?: Record<string, string> } };
        try {
          event = await request.json();
        } catch {
          return new Response("bad request", { status: 400 });
        }
        const paymentId = event.object?.id;
        const kind = event.object?.metadata?.["kind"];
        const orderId = event.object?.metadata?.["order_id"];
        if (!paymentId || !orderId || (kind !== "game_order" && kind !== "box_order" && kind !== "minigame" && kind !== "mentorship" && kind !== "club_invite")) {
          return new Response("ignored", { status: 200 });
        }

        const { getPayment } = await import("@/lib/yookassa.server");
        let payment;
        try {
          payment = await getPayment(paymentId);
        } catch (e) {
          console.error("YooKassa webhook verify failed:", e);
          return new Response("verify failed", { status: 500 });
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const patch: { payment_status: string; updated_at: string; paid_at?: string; status?: string } = {
          payment_status: payment.status,
          updated_at: new Date().toISOString(),
        };
        if (payment.status === "succeeded" && payment.paid) {
          patch.paid_at = new Date().toISOString();
          if (kind === "box_order") patch.status = "paid";
        }
        if (kind === "minigame") {
          const paid = payment.status === "succeeded" && payment.paid;
          const { error: mgError } = await supabaseAdmin.from("minigame_purchases")
            .update({ payment_status: payment.status, ...(paid ? { paid_at: new Date().toISOString() } : {}) })
            .eq("id", orderId).eq("payment_id", paymentId);
          if (mgError) return new Response("update failed", { status: 500 });
          return new Response("ok");
        }
        if (kind === "club_invite") {
          const paid = payment.status === "succeeded" && payment.paid;
          const { error: ciError } = await supabaseAdmin.from("member_invites")
            .update({ payment_status: payment.status, ...(paid ? { paid_at: new Date().toISOString() } : {}) })
            .eq("id", orderId).eq("payment_id", paymentId);
          if (ciError) return new Response("update failed", { status: 500 });
          return new Response("ok");
        }
        if (kind === "mentorship") {
          const paid = payment.status === "succeeded" && payment.paid;
          const { error: msError } = await supabaseAdmin.from("crm_contacts")
            .update({
              payment_status: payment.status,
              updated_at: new Date().toISOString(),
              ...(paid ? { paid_at: new Date().toISOString(), stage: "player" } : {}),
            })
            .eq("id", orderId).eq("payment_id", paymentId);
          if (msError) return new Response("update failed", { status: 500 });
          return new Response("ok");
        }
        const table = kind === "game_order" ? "game_orders" : "box_orders";
        const { error } = await supabaseAdmin
          .from(table)
          .update(patch as never)
          .eq("id", orderId)
          .eq("payment_id", paymentId);
        if (error) {
          console.error("YooKassa webhook update failed:", error.message);
          return new Response("update failed", { status: 500 });
        }
        return new Response("ok");
      },
    },
  },
});

import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { getMentorshipPaymentStatus } from "@/lib/mentorship.functions";

export const Route = createFileRoute("/payment/result")({
  validateSearch: (s: Record<string, unknown>) => ({
    order: typeof s["order"] === "string" ? s["order"] : undefined,
    box: typeof s["box"] === "string" ? s["box"] : undefined,
    mentorship: typeof s["mentorship"] === "string" ? s["mentorship"] : undefined,
  }),
  head: () => ({ meta: [{ title: "Оплата — Раппóрт" }, { name: "robots", content: "noindex" }] }),
  component: PaymentResultPage,
});

function PaymentResultPage() {
  const { order, box, mentorship } = useSearch({ from: "/payment/result" });
  const [status, setStatus] = useState<string>("checking");

  useEffect(() => {
    let cancelled = false;
    async function check() {
      if (mentorship) {
        const { status: s } = await getMentorshipPaymentStatus({ data: { id: mentorship } });
        if (!cancelled) setStatus(s);
        return;
      }
      const table = box ? "box_orders" : "game_orders";
      const id = box ?? order;
      if (!id) { setStatus("unknown"); return; }
      const { data } = await supabase.from(table).select("payment_status").eq("id", id).maybeSingle();
      if (cancelled) return;
      setStatus(data?.payment_status ?? "unknown");
    }
    void check();
    const t = setInterval(check, 5000);
    return () => { cancelled = true; clearInterval(t); };
  }, [order, box, mentorship]);

  const view = status === "succeeded"
    ? { icon: <CheckCircle2 className="size-12 text-primary" />, title: "Оплата прошла!", text: "Мы получили ваш платёж. Детали придут вам в ответном сообщении." }
    : status === "canceled"
      ? { icon: <XCircle className="size-12 text-destructive" />, title: "Оплата отменена", text: "Платёж не завершён. Вы можете попробовать ещё раз." }
      : { icon: <Clock className="size-12 text-muted-foreground" />, title: "Проверяем оплату…", text: "Обычно это занимает несколько секунд. Страница обновится сама." };

  return (
    <main className="section"><div className="section-inner max-w-xl text-center">
      <div className="flex justify-center">{view.icon}</div>
      <h1 className="section-title mt-6">{view.title}</h1>
      <p className="mt-4 text-muted-foreground">{view.text}</p>
      <div className="mt-8 flex justify-center gap-3">
        <Button asChild><Link to="/">На главную</Link></Button>
        <Button asChild variant="outline"><Link to="/community">В клуб</Link></Button>
      </div>
    </div></main>
  );
}

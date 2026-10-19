import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FacilitatorBotAdmin } from "@/components/facilitator-bot-admin";
import { CourseAuthPanel } from "@/components/course-auth-panel";

export const Route = createFileRoute("/manage-club")({
  head: () => ({ meta: [{ title: "Управление клубом — Раппóрт" }, { name: "description", content: "Заявки на игры и жалобы участников." }, { property: "og:title", content: "Управление клубом — Раппóрт" }, { property: "og:description", content: "Заявки на игры и жалобы участников." }, { name: "robots", content: "noindex" }] }),
  component: ManageClub,
});

type Order = { id: string; game: string; event_type: string; preferred_date: string; contact: string; comment: string; status: string; facilitator_slug: string; created_at: string; payment_status?: string | null; amount_rub?: number | null };
type Report = { id: string; reported: string; reason: string; resolved: boolean; created_at: string };

function ManageClub() {
  const [state, setState] = useState<"loading" | "guest" | "denied" | "ok">("loading");
  const [orders, setOrders] = useState<Order[]>([]);
  const [reports, setReports] = useState<Report[]>([]);

  async function load() {
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) { setState("guest"); return; }
    const { data: isAdmin } = await supabase.rpc("has_role", { _user_id: u.user.id, _role: "admin" });
    if (!isAdmin) { setState("denied"); return; }
    setState("ok");
    const [{ data: o }, { data: r }] = await Promise.all([
      supabase.from("game_orders").select("*").order("created_at", { ascending: false }),
      supabase.from("member_reports").select("*").eq("resolved", false).order("created_at", { ascending: false }),
    ]);
    setOrders(o ?? []); setReports(r ?? []);
  }
  useEffect(() => { void load(); const { data } = supabase.auth.onAuthStateChange(() => void load()); return () => data.subscription.unsubscribe(); }, []);

  async function setStatus(id: string, status: string) {
    const { error } = await supabase.from("game_orders").update({ status, updated_at: new Date().toISOString() }).eq("id", id);
    if (error) toast.error("Не сохранилось"); else { toast.success("Статус обновлён"); void load(); }
  }
  async function blockUser(r: Report) {
    await supabase.from("member_profiles").update({ is_blocked: true }).eq("user_id", r.reported);
    await supabase.from("member_reports").update({ resolved: true }).eq("id", r.id);
    toast.success("Анкета скрыта"); void load();
  }
  async function dismiss(r: Report) { await supabase.from("member_reports").update({ resolved: true }).eq("id", r.id); void load(); }

  if (state === "loading") return <p className="py-20 text-center">Загрузка…</p>;
  if (state === "guest") return <CourseAuthPanel title="Управление клубом" note="Войдите как владелец сайта." returnPath="/manage-club" />;
  if (state === "denied") return <p className="py-20 text-center">Доступ только для владельца сайта.</p>;

  return <section className="section"><div className="section-inner space-y-12">
    <div><h1 className="section-title">Заявки на игры</h1><p className="mt-2 text-sm text-muted-foreground">Отметьте «Игра прошла» — тогда участник сможет оставить отзыв ведущей.</p>
      <div className="mt-6 space-y-3">{orders.length === 0 && <p className="text-muted-foreground">Заявок пока нет.</p>}{orders.map((o) => <div key={o.id} className="grid gap-3 rounded-xl border border-border bg-card p-5 md:grid-cols-[1fr_14rem]">
        <div><p className="font-medium">{o.game} · {o.event_type} {o.payment_status === "succeeded" ? <span className="ml-2 rounded-full bg-primary/15 px-2 py-0.5 text-xs text-primary">Оплачено{o.amount_rub ? ` · ${o.amount_rub} ₽` : ""}</span> : o.payment_status === "pending" ? <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">Ожидает оплаты</span> : null}</p><p className="text-sm text-muted-foreground">{o.contact} · {o.preferred_date || "дата не указана"} · ведущая: {o.facilitator_slug}</p>{o.comment && <p className="mt-2 text-sm">{o.comment}</p>}</div>
        <Select value={o.status} onValueChange={(v) => setStatus(o.id, v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="new">Новая</SelectItem><SelectItem value="confirmed">Подтверждена</SelectItem><SelectItem value="completed">Игра прошла</SelectItem><SelectItem value="cancelled">Отменена</SelectItem></SelectContent></Select>
      </div>)}</div></div>
    <PaidInvites />
    <FacilitatorBotAdmin />
    <div><h2 className="section-title">Жалобы</h2><div className="mt-6 space-y-3">{reports.length === 0 && <p className="text-muted-foreground">Новых жалоб нет.</p>}{reports.map((r) => <div key={r.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-5"><p className="text-sm">{r.reason}</p><div className="flex gap-2"><Button size="sm" variant="destructive" onClick={() => blockUser(r)}>Скрыть анкету</Button><Button size="sm" variant="outline" onClick={() => dismiss(r)}>Отклонить</Button></div></div>)}</div></div>
  </div></section>;
}

function PaidInvites() {
  const [rows, setRows] = useState<{ id: string; from_user: string; to_user: string; status: string; paid_at: string | null }[]>([]);
  const [names, setNames] = useState<Record<string, string>>({});
  const [contacts, setContacts] = useState<Record<string, string>>({});
  useEffect(() => { void (async () => {
    const { data } = await supabase.from("member_invites").select("id,from_user,to_user,status,paid_at").eq("kind", "individual").eq("payment_status", "succeeded").order("paid_at", { ascending: false });
    setRows(data ?? []);
    const ids = [...new Set((data ?? []).flatMap((r) => [r.from_user, r.to_user]))];
    if (ids.length) {
      const { data: p } = await supabase.from("member_profiles").select("user_id,display_name").in("user_id", ids);
      setNames(Object.fromEntries((p ?? []).map((x) => [x.user_id, x.display_name])));
      const { data: c } = await supabase.from("member_contacts").select("user_id,contact").in("user_id", ids);
      setContacts(Object.fromEntries((c ?? []).map((x) => [x.user_id, x.contact])));
    }
  })(); }, []);
  return <div><h2 className="section-title">Оплаченные индивидуальные игры</h2><p className="mt-2 text-sm text-muted-foreground">Клуб знакомств: мужчина оплатил игру для девушки. Свяжитесь с парой и назначьте ведущего.</p>
    <div className="mt-6 space-y-3">{rows.length === 0 && <p className="text-muted-foreground">Пока нет.</p>}{rows.map((r) => <div key={r.id} className="rounded-xl border border-border bg-card p-5 text-sm">
      <p className="font-medium">{names[r.from_user] ?? "Участник"} → {names[r.to_user] ?? "Участница"} · {r.status === "matched" ? "ответы совпали" : r.status === "pending" ? "ждёт ответа" : r.status === "declined" ? "отклонено" : "ответы не совпали"}</p>
      <p className="text-muted-foreground">Контакты: {contacts[r.from_user] || "—"} / {contacts[r.to_user] || "—"}</p></div>)}</div></div>;
}

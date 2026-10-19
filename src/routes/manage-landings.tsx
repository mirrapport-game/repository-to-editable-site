import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { CourseAuthPanel } from "@/components/course-auth-panel";
import { landingPages } from "@/data/host-landings";

export const Route = createFileRoute("/manage-landings")({
  head: () => ({ meta: [{ title: "Посадочные страницы — статистика" }, { name: "description", content: "Переходы и заявки по посадочным страницам Раппóрт." }, { name: "robots", content: "noindex" }, { property: "og:title", content: "Посадочные — статистика" }, { property: "og:description", content: "Статистика посадочных страниц." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: ManageLandings,
});

type Visit = { id: string; created_at: string; utm_source: string; utm_campaign: string; referrer: string };
type Lead = { id: string; name: string; phone: string; created_at: string; notes: string };
const fmt = (d: string) => new Date(d).toLocaleString("ru-RU", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });

function ManageLandings() {
  const [state, setState] = useState<"loading" | "guest" | "denied" | "ok">("loading");
  const [sel, setSel] = useState(landingPages[0]?.id ?? "");
  const [days, setDays] = useState(30);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    const check = async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return setState("guest");
      const { data } = await supabase.rpc("has_role", { _user_id: u.user.id, _role: "admin" });
      setState(data ? "ok" : "denied");
    };
    void check();
    const { data } = supabase.auth.onAuthStateChange(() => void check());
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (state !== "ok" || !sel) return;
    const since = new Date(Date.now() - days * 864e5).toISOString();
    void supabase.from("landing_visits").select("id,created_at,utm_source,utm_campaign,referrer").eq("landing", sel).gte("created_at", since).order("created_at", { ascending: false }).limit(1000).then(({ data }) => setVisits((data ?? []) as Visit[]));
    void supabase.from("crm_contacts").select("id,name,phone,created_at,notes").like("source", `Посадочная: ${sel}%`).gte("created_at", since).order("created_at", { ascending: false }).then(({ data }) => setLeads((data ?? []) as Lead[]));
  }, [state, sel, days]);

  const byDay = useMemo(() => {
    const m = new Map<string, number>();
    for (let i = days - 1; i >= 0; i--) m.set(new Date(Date.now() - i * 864e5).toLocaleDateString("ru-RU"), 0);
    visits.forEach((v) => { const k = new Date(v.created_at).toLocaleDateString("ru-RU"); if (m.has(k)) m.set(k, (m.get(k) ?? 0) + 1); });
    return [...m.entries()];
  }, [visits, days]);
  const max = Math.max(1, ...byDay.map(([, n]) => n));
  const sources = useMemo(() => { const m = new Map<string, number>(); visits.forEach((v) => { const k = v.utm_source || (v.referrer ? new URL(v.referrer, "https://x").hostname : "прямой заход"); m.set(k, (m.get(k) ?? 0) + 1); }); return [...m.entries()].sort((a, b) => b[1] - a[1]); }, [visits]);

  if (state === "loading") return <p className="py-20 text-center">Загрузка…</p>;
  if (state === "guest") return <section className="section"><div className="section-inner max-w-md"><CourseAuthPanel title="Вход для администратора" note="Войдите, чтобы увидеть статистику." returnPath="/manage-landings" /></div></section>;
  if (state === "denied") return <p className="py-20 text-center">Доступ только для администратора.</p>;
  const page = landingPages.find((l) => l.id === sel);
  const conv = visits.length ? Math.round((leads.length / visits.length) * 1000) / 10 : 0;

  return <section className="section"><div className="section-inner space-y-8">
    <div><h1 className="section-title">Посадочные страницы</h1><p className="mt-2 text-muted-foreground">Выберите страницу, чтобы увидеть переходы и заявки. Считаются заходы начиная с сегодняшнего дня.</p></div>
    <div className="flex flex-wrap gap-2">{landingPages.map((l) => <button key={l.id} type="button" onClick={() => setSel(l.id)} className={`rounded-full border px-4 py-2 text-sm ${l.id === sel ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:border-primary"}`}>{l.title}</button>)}</div>
    <div className="flex flex-wrap items-center gap-3">
      {page && <a href={page.path} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-primary underline">Открыть страницу {page.path} <ExternalLink className="size-4" /></a>}
      <span className="ml-auto text-sm text-muted-foreground">Период:</span>
      {[7, 30, 90].map((d) => <button key={d} type="button" onClick={() => setDays(d)} className={`rounded-md border px-3 py-1 text-sm ${d === days ? "border-primary text-primary" : "border-border"}`}>{d} дн.</button>)}
    </div>
    <div className="grid gap-4 sm:grid-cols-3">{[["Переходов", visits.length], ["Заявок", leads.length], ["Конверсия", `${conv}%`]].map(([l, v]) => <div key={l} className="rounded-xl border border-border bg-card p-6"><p className="text-sm text-muted-foreground">{l}</p><p className="mt-2 font-display text-5xl">{v}</p></div>)}</div>
    <div className="rounded-xl border border-border bg-card p-6"><p className="mb-4 font-medium">Переходы по дням</p>
      <div className="flex h-40 items-end gap-0.5">{byDay.map(([d, n]) => <div key={d} title={`${d}: ${n}`} className="flex-1 rounded-t bg-primary" style={{ height: `${(n / max) * 100}%`, minHeight: n ? 4 : 1, opacity: n ? 1 : 0.2 }} />)}</div>
      <div className="mt-2 flex justify-between text-xs text-muted-foreground"><span>{byDay[0]?.[0]}</span><span>{byDay[byDay.length - 1]?.[0]}</span></div></div>
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-xl border border-border bg-card p-6"><p className="mb-3 font-medium">Откуда пришли</p>{sources.length === 0 ? <p className="text-sm text-muted-foreground">Пока нет переходов.</p> : sources.map(([s, n]) => <div key={s} className="flex justify-between border-b border-border py-2 text-sm"><span>{s}</span><span>{n}</span></div>)}</div>
      <div className="rounded-xl border border-border bg-card p-6"><p className="mb-3 font-medium">Заявки</p>{leads.length === 0 ? <p className="text-sm text-muted-foreground">Пока нет заявок.</p> : leads.map((l) => <div key={l.id} className="border-b border-border py-2 text-sm"><div className="flex justify-between"><span className="font-medium">{l.name} · {l.phone}</span><span className="text-muted-foreground">{fmt(l.created_at)}</span></div>{l.notes && <p className="text-xs text-muted-foreground">{l.notes}</p>}</div>)}</div>
    </div>
    <div className="rounded-xl border border-border bg-card p-6"><p className="mb-3 font-medium">Последние переходы</p>{visits.slice(0, 50).map((v) => <div key={v.id} className="flex justify-between gap-4 border-b border-border py-2 text-sm"><span>{fmt(v.created_at)}</span><span className="truncate text-muted-foreground">{[v.utm_source, v.utm_campaign].filter(Boolean).join(" · ") || v.referrer || "прямой заход"}</span></div>)}</div>
  </div></section>;
}

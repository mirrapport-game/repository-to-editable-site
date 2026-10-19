import { useEffect, useState, type FormEvent } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Lead = { id: string; name: string; contact: string; source: string; notes: string; host_status: string; created_at: string };
type Ev = { id: string; starts_at: string; game: string; place: string; capacity: number; event_signups?: { name: string; contact: string }[] };
const STATUSES: [string, string][] = [["new", "Новая"], ["contacted", "Связалась"], ["booked", "Записан"], ["came", "Пришёл"], ["declined", "Отказ"]];
const GAMES = ["Раппóрт — Живая", "Раппóрт про отношения"];

// Host cabinet: own leads, landing stats and own game schedule (all scoped to my_host_slug in the database).
export function HostWorkspace() {
  const [slug, setSlug] = useState<string | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [days, setDays] = useState(30);
  const [stats, setStats] = useState({ visits: 0, leads: 0 });
  const [events, setEvents] = useState<Ev[]>([]);
  const [form, setForm] = useState({ date: "", game: GAMES[0]!, place: "", capacity: "12" });

  async function loadEvents(s: string) {
    const { data } = await supabase.from("facilitator_events").select("id,starts_at,game,place,capacity,event_signups(name,contact)").eq("facilitator_slug", s).gte("starts_at", new Date().toISOString()).order("starts_at");
    setEvents((data ?? []) as Ev[]);
  }
  useEffect(() => { void (async () => {
    const { data: s } = await supabase.rpc("my_host_slug"); if (!s) return; setSlug(s);
    const { data } = await supabase.rpc("my_host_leads"); setLeads((data ?? []) as Lead[]);
    void loadEvents(s);
  })(); }, []);
  useEffect(() => { if (!slug) return; void supabase.rpc("my_host_stats", { _days: days }).then(({ data }) => { const r = data?.[0]; setStats({ visits: Number(r?.visits ?? 0), leads: Number(r?.leads ?? 0) }); }); }, [slug, days]);

  async function setStatus(id: string, status: string) {
    setLeads((l) => l.map((x) => x.id === id ? { ...x, host_status: status } : x));
    const { error } = await supabase.rpc("set_my_lead_status", { _id: id, _status: status }); if (error) toast.error("Не удалось сохранить");
  }
  async function addEvent(e: FormEvent) {
    e.preventDefault(); if (!slug) return;
    const starts = new Date(form.date); if (isNaN(+starts) || starts < new Date()) { toast.error("Укажите будущую дату"); return; }
    const { error } = await supabase.from("facilitator_events").insert({ facilitator_slug: slug, starts_at: starts.toISOString(), game: form.game, place: form.place.trim().slice(0, 200), capacity: Math.max(1, Math.min(50, Number(form.capacity) || 12)) });
    if (error) { toast.error("Не удалось добавить игру"); return; }
    toast.success("Игра добавлена в расписание"); setForm({ ...form, date: "", place: "" }); void loadEvents(slug);
  }
  async function removeEvent(id: string) {
    await supabase.from("facilitator_events").delete().eq("id", id); if (slug) void loadEvents(slug);
  }

  if (!slug) return null;
  const conv = stats.visits ? Math.round((stats.leads / stats.visits) * 100) : 0;
  return <div className="mb-12 space-y-8">
    <section className="border border-border bg-card p-6 md:p-8">
      <div className="flex flex-wrap items-end justify-between gap-3"><h2 className="font-display text-3xl">Моя статистика</h2>
        <div className="flex gap-2">{[7, 30, 90].map((d) => <Button key={d} size="sm" variant={d === days ? "default" : "outline"} onClick={() => setDays(d)}>{d} дн.</Button>)}</div></div>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {[["Переходы на посадочную", stats.visits], ["Заявки", stats.leads], ["Конверсия", `${conv}%`]].map(([l, v]) => <div key={l} className="bg-secondary p-5"><p className="font-display text-4xl">{v}</p><p className="mt-1 text-sm text-muted-foreground">{l}</p></div>)}
      </div>
    </section>

    <section className="border border-border bg-card p-6 md:p-8">
      <h2 className="font-display text-3xl">Мои заявки</h2>
      {leads.length === 0 ? <p className="mt-4 text-muted-foreground">Заявок с вашей посадочной пока нет.</p> :
      <ul className="mt-6 divide-y divide-border">{leads.map((l) => <li key={l.id} className="flex flex-wrap items-start justify-between gap-3 py-4">
        <div className="min-w-0"><p className="font-semibold">{l.name} · {l.contact}</p>
          <p className="text-xs text-muted-foreground">{new Date(l.created_at).toLocaleString("ru-RU")} · {l.source}</p>
          {l.notes && <p className="mt-1 text-sm text-muted-foreground">{l.notes}</p>}</div>
        <select aria-label="Статус заявки" value={l.host_status} onChange={(e) => setStatus(l.id, e.target.value)} className="border border-border bg-background px-3 py-2 text-sm">
          {STATUSES.map(([v, t]) => <option key={v} value={v}>{t}</option>)}</select>
      </li>)}</ul>}
    </section>

    <section className="border border-border bg-card p-6 md:p-8">
      <h2 className="font-display text-3xl">Мои игры</h2>
      <p className="mt-2 text-sm text-muted-foreground">Игры сразу появляются в расписании на сайте.</p>
      <form onSubmit={addEvent} className="mt-6 grid gap-3 md:grid-cols-[1fr_1fr_1.4fr_6rem_auto]">
        <Input type="datetime-local" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} aria-label="Дата и время" />
        <select aria-label="Игра" value={form.game} onChange={(e) => setForm({ ...form, game: e.target.value })} className="border border-border bg-background px-3 text-sm">{GAMES.map((g) => <option key={g}>{g}</option>)}</select>
        <Input required minLength={2} placeholder="Место или «онлайн»" value={form.place} onChange={(e) => setForm({ ...form, place: e.target.value })} aria-label="Место" />
        <Input type="number" min={1} max={50} value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} aria-label="Мест" />
        <Button type="submit">Добавить</Button>
      </form>
      <ul className="mt-6 divide-y divide-border">{events.map((ev) => <li key={ev.id} className="flex items-center justify-between gap-3 py-3">
        <span><b>{new Date(ev.starts_at).toLocaleString("ru-RU", { dateStyle: "medium", timeStyle: "short" })}</b> · {ev.game} · {ev.place} · записано {ev.event_signups?.length ?? 0} из {ev.capacity}{ev.event_signups?.length ? <span className="block text-sm text-muted-foreground">{ev.event_signups.map((p) => `${p.name} (${p.contact})`).join(", ")}</span> : null}</span>
        <Button size="icon" variant="ghost" aria-label="Удалить игру" onClick={() => removeEvent(ev.id)}><Trash2 /></Button>
      </li>)}{events.length === 0 && <li className="py-3 text-muted-foreground">Запланированных игр нет.</li>}</ul>
    </section>
  </div>;
}

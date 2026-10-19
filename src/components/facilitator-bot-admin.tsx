import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Row = { facilitator_slug: string; username: string; first_name: string; chat_id: number | null; last_asked_at: string | null; last_reply_at: string | null; time_zone: string };

const ZONES: [string, string, string][] = [
  ["Europe/Kaliningrad", "+02:00", "Калининград"], ["Europe/Moscow", "+03:00", "Москва"], ["Europe/Samara", "+04:00", "Самара"],
  ["Asia/Yekaterinburg", "+05:00", "Екатеринбург"], ["Asia/Omsk", "+06:00", "Омск"], ["Asia/Novosibirsk", "+07:00", "Новосибирск"],
  ["Asia/Irkutsk", "+08:00", "Иркутск"], ["Asia/Yakutsk", "+09:00", "Якутск"], ["Asia/Vladivostok", "+10:00", "Владивосток"],
];

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export function FacilitatorBotAdmin() {
  const [rows, setRows] = useState<Row[]>([]);
  const [f, setF] = useState({ name: "", city: "", citySlug: "", username: "", zone: "Europe/Moscow" });

  async function load() {
    const { data } = await supabase.from("facilitator_telegram").select("*").order("created_at");
    setRows((data as Row[]) ?? []);
  }
  useEffect(() => { void load(); }, []);

  async function add() {
    const username = f.username.trim().replace(/^@/, "").toLowerCase();
    if (!f.name.trim() || !f.city.trim() || !username) { toast.error("Заполните имя, город и Telegram"); return; }
    const citySlug = slugify(f.citySlug || f.city) || "city";
    const slug = `${slugify(username)}`;
    const zone = ZONES.find((z) => z[0] === f.zone)!;
    const { error: e1 } = await supabase.from("facilitators").upsert({ slug, name: f.name.trim(), city: f.city.trim(), city_slug: citySlug });
    if (e1) { toast.error("Не сохранилось"); return; }
    const { error } = await supabase.from("facilitator_telegram").upsert({ facilitator_slug: slug, username, first_name: f.name.trim().split(" ")[0] ?? "", time_zone: zone[0], utc_offset: zone[1] });
    if (error) toast.error("Не сохранилось"); else { toast.success("Ведущая добавлена"); setF({ name: "", city: "", citySlug: "", username: "", zone: "Europe/Moscow" }); void load(); }
  }
  async function ask(slug: string) {
    const r = await fetch(`/api/public/telegram/ask-schedule?facilitator=${encodeURIComponent(slug)}`, { method: "POST" });
    const j = await r.json().catch(() => ({}));
    if (j.asked) toast.success("Запрос отправлен"); else toast.message("Ещё не нажала «Старт» или уже спрашивали за последние 20 часов");
    void load();
  }
  async function remove(slug: string) {
    if (!confirm("Убрать ведущую из рассылки бота?")) return;
    await supabase.from("facilitator_telegram").delete().eq("facilitator_slug", slug); void load();
  }
  const fmt = (d: string | null) => d ? new Date(d).toLocaleString("ru-RU", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "—";

  return <div>
    <h2 className="section-title">Бот расписания ведущих</h2>
    <p className="mt-2 text-sm text-muted-foreground">Один бот @Rapport_game_bot спрашивает каждую ведущую отдельно — каждое воскресенье и по кнопке. Ведущей нужно один раз открыть бота и нажать «Старт».</p>
    <div className="mt-6 grid gap-3 rounded-xl border border-border bg-card p-5 md:grid-cols-5">
      <Input placeholder="Имя и фамилия" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
      <Input placeholder="Город" value={f.city} onChange={(e) => setF({ ...f, city: e.target.value })} />
      <Input placeholder="Город латиницей (kazan)" value={f.citySlug} onChange={(e) => setF({ ...f, citySlug: e.target.value })} />
      <Input placeholder="Telegram, например @name" value={f.username} onChange={(e) => setF({ ...f, username: e.target.value })} />
      <select className="h-10 rounded-md border border-input bg-background px-3 text-sm" value={f.zone} onChange={(e) => setF({ ...f, zone: e.target.value })}>
        {ZONES.map((z) => <option key={z[0]} value={z[0]}>{z[2]} (UTC{z[1]})</option>)}
      </select>
      <Button className="md:col-span-5 md:justify-self-start" onClick={add}>Добавить ведущую</Button>
    </div>
    <div className="mt-4 space-y-3">{rows.map((r) => <div key={r.facilitator_slug} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-5">
      <div><p className="font-medium">{r.first_name || r.facilitator_slug} · @{r.username}</p>
        <p className="text-sm text-muted-foreground">{r.chat_id ? "Бот подключён" : "Ждём «Старт» в боте"} · спрашивали: {fmt(r.last_asked_at)} · ответ: {fmt(r.last_reply_at)}</p></div>
      <div className="flex gap-2"><Button size="sm" variant="outline" onClick={() => ask(r.facilitator_slug)}>Запросить расписание</Button><Button size="sm" variant="ghost" onClick={() => remove(r.facilitator_slug)}>Убрать</Button></div>
    </div>)}</div>
  </div>;
}

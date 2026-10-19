import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Copy, Trash2, Pencil, Save, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CourseAuthPanel } from "@/components/course-auth-panel";
import { PHASE_LABELS } from "@/components/marathon-schedule";
import { ChannelPoster } from "@/components/channel-poster";
import { validMeetingCapacity, MEETING_MIN_PARTICIPANTS, MEETING_MAX_PARTICIPANTS } from "@/lib/meeting-capacity";

export const Route = createFileRoute("/manage-marathon")({
  ssr: false,
  head: () => ({ meta: [{ title: "Марафон и блогеры — управление Раппóрт" }, { name: "description", content: "Расписание марафона, записи участников и анкеты блогеров." }, { property: "og:title", content: "Марафон и блогеры — управление" }, { property: "og:description", content: "Закрытая страница управления марафоном." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: ManageMarathon,
});

type Slot = { id: string; starts_at: string; phase: string; game: string; theme: string; capacity: number; published: boolean; host_name: string };
type Signup = { id: string; slot_id: string; name: string; contact: string };
type App = { id: string; name: string; blog_url: string; contact: string; audience: string; topic: string; status: string; created_at: string };
const blank = { date: "", phase: "demo", game: "Раппóрт Отношения", theme: "", host_name: "", capacity: 6 };
const moscowInput = (date: string) => new Date(new Date(date).getTime() + 3 * 3600000).toISOString().slice(0, 16);

function ManageMarathon() {
  const [state, setState] = useState<"loading" | "guest" | "denied" | "ok">("loading");
  const [slots, setSlots] = useState<Slot[]>([]); const [signups, setSignups] = useState<Signup[]>([]); const [apps, setApps] = useState<App[]>([]);
  const [f, setF] = useState(blank);
  const [editing, setEditing] = useState<string | null>(null);
  const [edit, setEdit] = useState({ date: "", game: "", host_name: "", capacity: 6 });
  const [saving, setSaving] = useState(false);

  async function saveDate(id: string) {
    if (!edit.date || !edit.game.trim()) return;
    if (!validMeetingCapacity(edit.capacity)) { toast.error("Укажите от 2 до 150 участников"); return; }
    setSaving(true);
    const { error } = await supabase.from("marathon_slots").update({ starts_at: new Date(`${edit.date}:00+03:00`).toISOString(), game: edit.game.trim(), host_name: edit.host_name.trim(), capacity: edit.capacity }).eq("id", id);
    setSaving(false);
    if (error) { toast.error(error.message.includes("capacity") ? "Сохранение этого числа пока ограничено настройками базы. Требуется обновление ограничения участников." : error.message); return; }
    toast.success("Расписание обновлено"); setEditing(null); void load();
  }

  async function load() {
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) { setState("guest"); return; }
    const { data: isAdmin } = await supabase.rpc("has_role", { _user_id: u.user.id, _role: "admin" });
    if (!isAdmin) { setState("denied"); return; }
    setState("ok");
    const [a, b, c] = await Promise.all([
      supabase.from("marathon_slots").select("*").order("starts_at"),
      supabase.from("marathon_signups").select("id,slot_id,name,contact").order("created_at"),
      supabase.from("blogger_applications").select("*").order("created_at", { ascending: false }),
    ]);
    setSlots((a.data ?? []) as Slot[]); setSignups((b.data ?? []) as Signup[]); setApps((c.data ?? []) as App[]);
  }
  useEffect(() => { void load(); const { data } = supabase.auth.onAuthStateChange(() => void load()); return () => data.subscription.unsubscribe(); }, []);

  async function add(row: Omit<Slot, "id" | "published">) {
    if (!validMeetingCapacity(row.capacity)) { toast.error("Укажите от 2 до 150 участников"); return; }
    const { error } = await supabase.from("marathon_slots").insert(row);
    if (error) toast.error(error.message.includes("capacity") ? "Сохранение этого числа пока ограничено настройками базы. Требуется обновление ограничения участников." : error.message); else { toast.success("Игра добавлена"); void load(); }
  }
  async function del(id: string) { if (!confirm("Удалить игру вместе с записями?")) return; await supabase.from("marathon_slots").delete().eq("id", id); void load(); }
  async function setStatus(id: string, status: string) { await supabase.from("blogger_applications").update({ status }).eq("id", id); void load(); }
  async function remind(a: App) {
    const c = a.contact.trim();
    const tg = c.match(/t\.me\/([\w_]+)/i)?.[1] ?? (c.startsWith("@") ? c.slice(1) : null);
    if (tg) { window.open(`https://t.me/${tg}`, "_blank", "noopener"); toast.success("Открыл Telegram — напомните блогеру лично"); }
    else { try { await navigator.clipboard.writeText(c); toast.success("Контакт скопирован — напомните звонком или письмом"); } catch { toast.info(`Контакт: ${c}`); } }
  }

  if (state === "loading") return <p className="py-20 text-center">Загрузка…</p>;
  if (state === "guest") return <CourseAuthPanel title="Марафон" note="Войдите как владелец сайта." returnPath="/manage-marathon" />;
  if (state === "denied") return <p className="py-20 text-center">Доступ только для владельца сайта.</p>;

  return <section className="section-inner py-14">
    <ChannelPoster />
    <h1 className="font-display text-5xl">Марафон и блогеры</h1>
    <form className="mt-8 grid gap-3 border border-border p-5 md:grid-cols-3" onSubmit={(e) => { e.preventDefault(); if (!f.date) return; void add({ starts_at: new Date(`${f.date}:00+03:00`).toISOString(), phase: f.phase, game: f.game, theme: f.theme, host_name: f.host_name, capacity: f.capacity }); }}>
      <label className="grid gap-1 text-sm">Дата и время (МСК)<Input type="datetime-local" required value={f.date} onChange={(e) => setF({ ...f, date: e.target.value })} /></label>
      <select className="h-10 border border-input bg-background px-2" value={f.phase} onChange={(e) => setF({ ...f, phase: e.target.value })}>{Object.entries(PHASE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
      <select className="h-10 border border-input bg-background px-2" value={f.game} onChange={(e) => setF({ ...f, game: e.target.value })}>{["Раппóрт Отношения", "Раппóрт Живая", "Мужские карточки"].map((g) => <option key={g}>{g}</option>)}</select>
      <Input placeholder="Тема (необязательно)" value={f.theme} onChange={(e) => setF({ ...f, theme: e.target.value })} />
      <Input placeholder="Ведущий (для расписания главной)" value={f.host_name} onChange={(e) => setF({ ...f, host_name: e.target.value })} />
      <label className="grid gap-1 text-sm">Количество участников<Input type="number" required min={MEETING_MIN_PARTICIPANTS} max={MEETING_MAX_PARTICIPANTS} step={1} value={f.capacity} onChange={(e) => setF({ ...f, capacity: Number(e.target.value) })} /></label>
      <Button type="submit">Добавить игру</Button>
    </form>

    <h2 className="mt-12 font-display text-3xl">Расписание</h2>
    <div className="mt-4 grid gap-3">{slots.map((s) => { const list = signups.filter((x) => x.slot_id === s.id); return <div key={s.id} className="border border-border p-4">
      <div className="flex flex-wrap items-center justify-between gap-2"><p><b>{new Date(s.starts_at).toLocaleString("ru-RU", { timeZone: "Europe/Moscow" })}</b> · {PHASE_LABELS[s.phase]} · {s.game} {s.theme && `· ${s.theme}`} · <span className={list.length >= s.capacity ? "text-destructive" : "text-primary"}>{list.length}/{s.capacity}</span></p>
        <div className="flex flex-wrap gap-2"><Button size="sm" variant="outline" onClick={() => { setEditing(s.id); setEdit({ date: moscowInput(s.starts_at), game: s.game, host_name: s.host_name, capacity: s.capacity }); }}><Pencil className="size-4" />Изменить</Button><Button size="sm" variant="outline" onClick={() => void add({ starts_at: s.starts_at, phase: s.phase, game: s.game, theme: s.theme, host_name: s.host_name, capacity: s.capacity })}><Copy className="size-4" />Открыть ещё игру</Button><Button size="sm" variant="ghost" aria-label="Удалить игру" onClick={() => void del(s.id)}><Trash2 className="size-4" /></Button></div></div>
      {s.host_name && <p className="mt-2 text-sm">Ведущий: {s.host_name}</p>}
      {editing === s.id && <form className="mt-4 grid gap-3 sm:grid-cols-2" onSubmit={(e) => { e.preventDefault(); void saveDate(s.id); }}>
        <label className="grid gap-1 text-sm">Дата и время (МСК)<Input type="datetime-local" required value={edit.date} onChange={(e) => setEdit({ ...edit, date: e.target.value })} /></label>
        <label className="grid gap-1 text-sm">Игра<Input required value={edit.game} onChange={(e) => setEdit({ ...edit, game: e.target.value })} /></label>
        <label className="grid gap-1 text-sm">Ведущий<Input value={edit.host_name} onChange={(e) => setEdit({ ...edit, host_name: e.target.value })} /></label>
        <label className="grid gap-1 text-sm">Количество участников<Input type="number" required min={MEETING_MIN_PARTICIPANTS} max={MEETING_MAX_PARTICIPANTS} step={1} value={edit.capacity} onChange={(e) => setEdit({ ...edit, capacity: Number(e.target.value) })} /></label>
        <div className="flex flex-wrap items-end gap-2"><Button type="submit" disabled={saving}><Save />{saving ? "Сохраняем…" : "Сохранить"}</Button><Button type="button" variant="ghost" onClick={() => setEditing(null)}><X />Отмена</Button></div>
      </form>}
      {list.length > 0 && <ul className="mt-2 text-sm text-muted-foreground">{list.map((x) => <li key={x.id}>{x.name} — {x.contact}</li>)}</ul>}
    </div>; })}{!slots.length && <p className="text-muted-foreground">Игр пока нет.</p>}</div>

    <h2 className="mt-12 font-display text-3xl">Анкеты блогеров</h2>
    <div className="mt-4 grid gap-3">{apps.map((a) => <div key={a.id} className="border border-border p-4">
      <p><b>{a.name}</b> · <a className="text-primary underline" href={/^https?:\/\//.test(a.blog_url) ? a.blog_url : `https://${a.blog_url}`} target="_blank" rel="noreferrer">{a.blog_url}</a> · {a.contact} {a.audience && `· ${a.audience}`}</p>
      {a.topic && <p className="mt-1 text-sm text-muted-foreground">{a.topic}</p>}
      <p className="mt-2 text-sm">Статус: {a.status === "approved" ? <span className="text-primary">Одобрен</span> : a.status === "rejected" ? <span className="text-destructive">Отклонён</span> : <span className="text-muted-foreground">Ждёт ответа</span>}</p>
      <div className="mt-3 flex flex-wrap gap-2"><Button size="sm" variant={a.status === "approved" ? "default" : "outline"} onClick={() => void setStatus(a.id, "approved")}>Одобрить</Button><Button size="sm" variant={a.status === "rejected" ? "destructive" : "outline"} onClick={() => void setStatus(a.id, "rejected")}>Отклонить</Button>{a.status !== "approved" && <Button size="sm" variant="secondary" onClick={() => void remind(a)}>Напомнить</Button>}</div>
    </div>)}{!apps.length && <p className="text-muted-foreground">Анкет пока нет.</p>}</div>
  </section>;
}

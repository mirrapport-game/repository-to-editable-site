import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CourseAuthPanel } from "@/components/course-auth-panel";

export const Route = createFileRoute("/manage-crm")({
  head: () => ({ meta: [{ title: "CRM — воронка Раппóрт" }, { name: "description", content: "Воронка клиентов: от наблюдателя до инвестора." }, { property: "og:title", content: "CRM — воронка Раппóрт" }, { property: "og:description", content: "Воронка клиентов: от наблюдателя до инвестора." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }, { name: "robots", content: "noindex" }] }),
  component: ManageCrm,
});

const STAGES = [
  { id: "observer", label: "Новый участник" },
  { id: "demo", label: "Участник демо" },
  { id: "player", label: "Участник игры" },
  { id: "intensive", label: "Интенсив" },
  { id: "game_purchase", label: "Покупка игры" },
  { id: "package", label: "Покупка пакета" },
  { id: "investor", label: "Инвестор" },
] as const;

type Contact = { id: string; name: string; phone: string; telegram: string; city: string; source: string; stage: string; amount: number; notes: string; next_step: string; next_date: string | null; created_at: string; marketing_consent?: boolean };
const empty = { name: "", phone: "", telegram: "", city: "", source: "", stage: "observer", amount: 0, notes: "", next_step: "", next_date: null as string | null };

function ManageCrm() {
  const [state, setState] = useState<"loading" | "guest" | "denied" | "ok">("loading");
  const [items, setItems] = useState<Contact[]>([]);
  const [q, setQ] = useState("");
  const [edit, setEdit] = useState<(typeof empty & { id?: string }) | null>(null);

  async function load() {
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) { setState("guest"); return; }
    const { data: isAdmin } = await supabase.rpc("has_role", { _user_id: u.user.id, _role: "admin" });
    if (!isAdmin) { setState("denied"); return; }
    setState("ok");
    const { data } = await supabase.from("crm_contacts").select("*").order("updated_at", { ascending: false });
    setItems((data ?? []) as Contact[]);
  }
  useEffect(() => { void load(); const { data } = supabase.auth.onAuthStateChange(() => void load()); return () => data.subscription.unsubscribe(); }, []);

  const [onlyMkt, setOnlyMkt] = useState(false);
  const filtered = useMemo(() => { const s = q.trim().toLowerCase(); const base = onlyMkt ? items.filter((c) => c.marketing_consent) : items; return s ? base.filter((c) => [c.name, c.phone, c.telegram, c.city, c.notes, c.source].join(" ").toLowerCase().includes(s)) : base; }, [items, q, onlyMkt]);

  async function move(c: Contact, dir: -1 | 1) {
    const i = STAGES.findIndex((s) => s.id === c.stage) + dir;
    if (i < 0 || i >= STAGES.length) return;
    const { error } = await supabase.from("crm_contacts").update({ stage: STAGES[i]!.id, updated_at: new Date().toISOString() }).eq("id", c.id);
    if (error) toast.error("Не сохранилось"); else void load();
  }
  async function save() {
    if (!edit || !edit.name.trim()) { toast.error("Укажите имя"); return; }
    const { id, ...row } = edit;
    const payload = { ...row, amount: Number(row.amount) || 0, next_date: row.next_date || null, updated_at: new Date().toISOString() };
    const { error } = id ? await supabase.from("crm_contacts").update(payload).eq("id", id) : await supabase.from("crm_contacts").insert(payload);
    if (error) toast.error("Не сохранилось"); else { toast.success("Сохранено"); setEdit(null); void load(); }
  }
  async function remove(id: string) {
    if (!confirm("Удалить контакт?")) return;
    await supabase.from("crm_contacts").delete().eq("id", id); setEdit(null); void load();
  }

  if (state === "loading") return <p className="py-20 text-center">Загрузка…</p>;
  if (state === "guest") return <CourseAuthPanel title="CRM" note="Войдите как владелец сайта." returnPath="/manage-crm" />;
  if (state === "denied") return <p className="py-20 text-center">Доступ только для владельца сайта.</p>;

  const total = items.length || 1;
  return <section className="section"><div className="mx-auto max-w-[110rem] px-4 space-y-6">
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div><h1 className="section-title">CRM · воронка</h1><p className="mt-2 text-sm text-muted-foreground">Всего контактов: {items.length}. Двигайте карточки стрелками по этапам.</p></div>
      <div className="flex gap-2"><Input placeholder="Поиск: имя, телефон, город…" value={q} onChange={(e) => setQ(e.target.value)} className="w-64" /><Button onClick={() => setEdit({ ...empty })}>+ Контакт</Button></div>
    </div>
    <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={onlyMkt} onChange={(e) => setOnlyMkt(e.target.checked)} />Только согласные на рассылку ({items.filter((c) => c.marketing_consent).length})</label>
    <div className="grid grid-cols-7 gap-1 text-center text-xs">{STAGES.map((s) => { const n = items.filter((c) => c.stage === s.id).length; return <div key={s.id} className="rounded-md bg-muted p-2"><p className="font-medium">{n}</p><p className="text-muted-foreground">{Math.round((n / total) * 100)}%</p></div>; })}</div>
    <div className="flex gap-3 overflow-x-auto pb-4">{STAGES.map((s, si) => { const col = filtered.filter((c) => c.stage === s.id); const sum = col.reduce((a, c) => a + Number(c.amount), 0); return <div key={s.id} className="w-64 shrink-0 rounded-xl border border-border bg-muted/40 p-3">
      <p className="text-xs uppercase tracking-widest text-muted-foreground">{si + 1}. {s.label}</p><p className="mb-3 text-xs text-muted-foreground">{col.length} · {sum.toLocaleString("ru-RU")} ₽</p>
      <div className="space-y-2">{col.map((c) => <div key={c.id} className="rounded-lg border border-border bg-card p-3 text-sm">
        <button className="w-full text-left" onClick={() => setEdit({ ...c })}><p className="font-medium">{c.name}{Date.now() - Date.parse(c.created_at) < 3 * 864e5 && <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-[10px] text-primary-foreground">новая</span>}{c.marketing_consent && <span className="ml-2 rounded-full bg-accent px-2 py-0.5 text-[10px] text-accent-foreground">✉ рассылка</span>}</p>{c.source && <p className="mt-1 text-xs font-medium text-primary">{c.source}</p>}<p className="text-xs text-muted-foreground">{[c.city, c.telegram || c.phone].filter(Boolean).join(" · ")}</p>{c.notes && <p className="mt-1 line-clamp-3 text-xs text-muted-foreground">{c.notes}</p>}<p className="mt-1 text-[10px] text-muted-foreground">{new Date(c.created_at).toLocaleString("ru-RU")}</p>{c.next_step && <p className="mt-1 text-xs">→ {c.next_step}{c.next_date ? ` (${new Date(c.next_date).toLocaleDateString("ru-RU")})` : ""}</p>}</button>
        <div className="mt-2 flex justify-between"><Button size="icon" variant="ghost" className="h-7 w-7" disabled={si === 0} onClick={() => move(c, -1)} aria-label="Назад"><ChevronLeft className="h-4 w-4" /></Button><Button size="icon" variant="ghost" className="h-7 w-7" disabled={si === STAGES.length - 1} onClick={() => move(c, 1)} aria-label="Дальше"><ChevronRight className="h-4 w-4" /></Button></div>
      </div>)}</div></div>; })}</div>
    {edit && <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4" onClick={() => setEdit(null)}><div className="max-h-[90vh] w-full max-w-lg space-y-3 overflow-y-auto rounded-xl bg-card p-6" onClick={(e) => e.stopPropagation()}>
      <h2 className="text-lg font-medium">{edit.id ? "Контакт" : "Новый контакт"}</h2>
      <Input placeholder="Имя *" value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} />
      <div className="grid grid-cols-2 gap-2"><Input placeholder="Телефон" value={edit.phone} onChange={(e) => setEdit({ ...edit, phone: e.target.value })} /><Input placeholder="Telegram" value={edit.telegram} onChange={(e) => setEdit({ ...edit, telegram: e.target.value })} /><Input placeholder="Город" value={edit.city} onChange={(e) => setEdit({ ...edit, city: e.target.value })} /><Input placeholder="Откуда пришёл" value={edit.source} onChange={(e) => setEdit({ ...edit, source: e.target.value })} /></div>
      <div className="grid grid-cols-2 gap-2"><select className="h-10 rounded-md border border-input bg-background px-3 text-sm" value={edit.stage} onChange={(e) => setEdit({ ...edit, stage: e.target.value })}>{STAGES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}</select><Input type="number" placeholder="Сумма, ₽" value={edit.amount || ""} onChange={(e) => setEdit({ ...edit, amount: Number(e.target.value) })} /></div>
      <div className="grid grid-cols-2 gap-2"><Input placeholder="Следующий шаг" value={edit.next_step} onChange={(e) => setEdit({ ...edit, next_step: e.target.value })} /><Input type="date" value={edit.next_date ?? ""} onChange={(e) => setEdit({ ...edit, next_date: e.target.value })} /></div>
      <Textarea placeholder="Заметки" rows={4} value={edit.notes} onChange={(e) => setEdit({ ...edit, notes: e.target.value })} />
      <div className="flex justify-between">{edit.id ? <Button variant="ghost" onClick={() => remove(edit.id!)}><Trash2 className="mr-1 h-4 w-4" />Удалить</Button> : <span />}<div className="flex gap-2"><Button variant="outline" onClick={() => setEdit(null)}>Отмена</Button><Button onClick={save}>Сохранить</Button></div></div>
    </div></div>}
  </div></section>;
}

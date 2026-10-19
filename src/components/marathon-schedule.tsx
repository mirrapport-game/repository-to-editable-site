import { ConsentFields } from "@/components/consent-fields";
import { notifySavedLead } from "@/lib/lead-notify.functions";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Users, Trash2 } from "lucide-react";
import { useIsAdmin } from "@/components/site-shell";
import { scheduleTone } from "@/lib/schedule-presentation";
import { schedulePhoneSchema } from "@/lib/schedule-phone";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookingFormatField, type BookingFormat } from "@/components/booking-format";

export const PHASE_LABELS: Record<string, string> = { demo: "Демо-игра", paid: "Игра", intensive: "Интенсив" };

type Slot = { id: string; starts_at: string; phase: string; game: string; theme: string; capacity: number; host_name: string };

export function MarathonSchedule({ phase, theme, homepage = false }: { phase?: string | undefined; theme?: string | undefined; homepage?: boolean } = {}) {
  const isAdmin = useIsAdmin();
  const [deleting, setDeleting] = useState<string | null>(null);
  const [done, setDone] = useState<{ id: string; slot: Slot } | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [taken, setTaken] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", contact: "", format: "Онлайн" as BookingFormat });
  const [busy, setBusy] = useState(false);

  async function load() {
    const [{ data: s }, { data: c }] = await Promise.all([
      supabase.from("marathon_slots").select("id,starts_at,phase,game,theme,capacity,host_name").eq("published", true).gt("starts_at", new Date().toISOString()).order("starts_at").limit(60),
      supabase.rpc("marathon_slot_counts"),
    ]);
    setSlots(((s ?? []) as Slot[]).filter((x) => (!homepage || Boolean(x.host_name)) && (!phase || x.phase === phase) && (!theme || x.theme === theme || x.game === theme)));
    setTaken(Object.fromEntries((c ?? []).map((r: { slot_id: string; taken: number }) => [r.slot_id, r.taken])));
    setLoading(false);
  }
  useEffect(() => { void load(); }, [phase, theme, homepage]);

  const days = useMemo(() => {
    const map = new Map<string, Slot[]>();
    for (const s of slots) {
      const key = new Date(s.starts_at).toLocaleDateString("ru-RU", { weekday: "long", day: "numeric", month: "long", timeZone: "Europe/Moscow" });
      map.set(key, [...(map.get(key) ?? []), s]);
    }
    return homepage ? [...map.entries()].flatMap(([day, list]) => list.map((slot) => [day, [slot]] as [string, Slot[]])) : [...map.entries()];
  }, [slots, homepage]);

  async function removeSlot(slot: Slot) {
    if (!isAdmin || deleting) return;
    if (!window.confirm(`Удалить встречу «${slot.game}» и все записи на неё? Это действие нельзя отменить.`)) return;
    setDeleting(slot.id);
    const { data, error } = await supabase.from("marathon_slots").delete().eq("id", slot.id).select("id");
    setDeleting(null);
    if (error || !data?.length) { toast.error(error?.message ?? "Удаление не разрешено. Проверьте права администратора."); return; }
    if (done?.slot.id === slot.id) setDone(null);
    if (open === slot.id) setOpen(null);
    toast.success("Встреча удалена");
    await load();
  }

  async function signup(slotId: string) {
    if (busy) return;
    const phone = homepage ? schedulePhoneSchema.safeParse(form.contact) : null;
    if (phone && !phone.success) { toast.error(phone.error.issues[0]?.message ?? "Укажите номер телефона"); return; }
    setBusy(true);
    const { data: id, error } = await supabase.rpc("marathon_signup", { _slot_id: slotId, _name: homepage ? "Участник (имя не указано)" : form.name, _contact: phone?.success ? phone.data : `${form.contact} · Формат: ${form.format}` });
    setBusy(false);
    if (error) { toast.error(error.message); void load(); return; }
    if (typeof id === "string" && id.length === 36) void notifySavedLead({ data: { kind: "marathon", id } }).catch(() => {});
    toast.success("Место закреплено за вами!");
    const slot = slots.find((x) => x.id === slotId);
    if (slot && typeof id === "string" && id.length === 36) setDone({ id, slot });
    setOpen(null); setForm({ name: "", contact: "", format: "Онлайн" }); void load();
  }

  if (loading) return <p className="py-10 text-muted-foreground">Загружаем расписание…</p>;
  if (!days.length) return <div className="border border-border p-8"><p className="font-display text-3xl">{homepage ? "Новые даты игр скоро появятся" : "Расписание ближайшего марафона скоро появится"}</p><p className="mt-3 text-muted-foreground">Новые игры открываются, как только заполняются предыдущие. Загляните чуть позже.</p></div>;

  return <div className="grid gap-8">
    {done && <div className="border border-primary bg-card p-6" role="status">
      <p className="eyebrow">Место за вами</p>
      <p className="mt-2 font-display text-3xl">{done.slot.game}{done.slot.theme ? ` · ${done.slot.theme}` : ""}</p>
      <p className="mt-1 text-muted-foreground">{new Date(done.slot.starts_at).toLocaleString("ru-RU", { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Moscow" })} МСК</p>
      <p className="mt-4">Нажмите кнопку ниже и «Старт» в Telegram — бот напомнит вам об игре за день до начала.</p>
      <Button asChild className="mt-4"><a href={`https://t.me/Rapport_game_bot?start=r_${done.id}`} target="_blank" rel="noreferrer">Получить напоминание в Telegram</a></Button>
    </div>}
    <div className={homepage ? "flex gap-6 overflow-x-auto pb-4 snap-x snap-proximity" : "grid gap-8"}>
    {days.map(([day, list]) => <div key={homepage ? list[0]?.id : day} className={homepage ? "w-[min(22rem,85vw)] min-w-0 shrink-0 snap-start" : undefined}>
      <h3 className="font-display text-3xl capitalize">{day}</h3>
      <div className={homepage ? "mt-4 grid gap-4" : "mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"}>
        {list.map((s) => {
          const n = taken[s.id] ?? 0; const full = n >= s.capacity;
          return <article key={s.id} className={`schedule-event border p-5 ${full ? "opacity-60" : ""}`} data-tone={scheduleTone(s.game, s.phase)}>
            <div className="flex items-center justify-between gap-2 text-sm"><span className="eyebrow">{PHASE_LABELS[s.phase] ?? s.phase}</span><span>{new Date(s.starts_at).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Moscow" })} МСК</span>{homepage && isAdmin && <Button variant="ghost" size="icon" title="Удалить встречу" aria-label={`Удалить встречу ${s.game}`} disabled={deleting !== null} onClick={() => void removeSlot(s)}><Trash2 className="size-4" /></Button>}</div>
            <p className="mt-3 font-display text-2xl">{s.game}</p>
            {s.theme && <p className="mt-1 text-sm text-muted-foreground">{s.theme}</p>}
            {s.host_name && <p className="mt-2 text-sm">Ведущий: {s.host_name}</p>}
            <div className="mt-4 flex flex-wrap items-center gap-2" aria-label={`Записалось ${n} из ${s.capacity}`}>
              <Users className="size-4 text-primary" aria-hidden="true" />
              {s.capacity <= 12 && <div className="flex flex-wrap gap-1">{Array.from({ length: s.capacity }).map((_, i) => <span key={i} className={`size-3 rounded-full ${i < n ? "bg-primary" : "border border-primary/50"}`} />)}</div>}
              <span className="text-sm text-muted-foreground">{n}/{s.capacity}</span>
            </div>
            {full ? <p className="mt-4 text-sm font-medium">Мест нет — скоро откроем ещё игру</p>
              : open === s.id ? <form className="mt-4 grid min-w-0 grid-cols-1 gap-2" onSubmit={(e) => { e.preventDefault(); void signup(s.id); }}>
                {!homepage && <Input placeholder="Имя" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required maxLength={100} />}
                <Input aria-label={homepage ? "Номер телефона" : "Телефон или Telegram"} placeholder={homepage ? "+7 999 123-45-67" : "Телефон или Telegram"} type={homepage ? "tel" : "text"} autoComplete={homepage ? "tel" : undefined} value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} required maxLength={homepage ? 24 : 100} />
                {!homepage && <BookingFormatField id={`marathon-format-${s.id}`} value={form.format} onChange={(format) => setForm({ ...form, format })} />}
                <ConsentFields />
                <div className="flex gap-2"><Button type="submit" disabled={busy}>{busy ? "Записываем…" : "Записаться"}</Button><Button type="button" disabled={busy} variant="ghost" onClick={() => setOpen(null)}>Отмена</Button></div>
              </form>
              : <Button className="mt-4 w-full" onClick={() => setOpen(s.id)}>Записаться · осталось {s.capacity - n}</Button>}
          </article>;
        })}
      </div>
    </div>)}
    </div>
  </div>;
}

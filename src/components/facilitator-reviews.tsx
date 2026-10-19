import { hostTitle } from "@/components/host-reviews";
import { notifySavedLead } from "@/lib/lead-notify.functions";
import { useEffect, useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { games } from "@/data/site";
import { eventFormats } from "@/data/cities";
import { BookingFormatField, type BookingFormat } from "@/components/booking-format";

type Review = { id: string; author_name: string; rating: number; body: string; created_at: string };
type Order = { id: string; game: string; status: string; created_at: string; payment_status: string; amount_rub: number | null };

export function PayOrderButton({ orderId }: { orderId: string }) {
  const [busy, setBusy] = useState(false);
  async function pay() {
    setBusy(true);
    try {
      const { createGameOrderPayment } = await import("@/lib/yookassa.functions");
      const { url } = await createGameOrderPayment({ data: { orderId } });
      window.location.href = url;
    } catch (err) {
      setBusy(false);
      toast.error(err instanceof Error ? err.message : "Не удалось создать оплату");
    }
  }
  return <Button size="sm" onClick={pay} disabled={busy}>{busy ? "Создаём оплату…" : "Оплатить картой"}</Button>;
}

export function Stars({ value, onChange }: { value: number; onChange?: (v: number) => void }) {
  return <span className="inline-flex gap-0.5" aria-label={`Оценка ${value} из 5`}>{[1, 2, 3, 4, 5].map((n) =>
    <button key={n} type="button" disabled={!onChange} onClick={() => onChange?.(n)} className="disabled:cursor-default" aria-label={`${n} из 5`}>
      <Star className={`size-5 ${n <= Math.round(value) ? "fill-current text-primary" : "text-muted-foreground/40"}`} />
    </button>)}</span>;
}

const statusLabel: Record<string, string> = { new: "Новая заявка", confirmed: "Подтверждена", completed: "Игра прошла", cancelled: "Отменена" };

export function FacilitatorSection({ slug, name }: { slug: string; name: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviewedIds, setReviewedIds] = useState<string[]>([]);

  async function load() {
    const { data } = await supabase.from("facilitator_reviews").select("id,author_name,rating,body,created_at,order_id").eq("facilitator_slug", slug).order("created_at", { ascending: false });
    setReviews(data ?? []);
    const { data: u } = await supabase.auth.getUser();
    setUserId(u.user?.id ?? null);
    if (u.user) {
      const { data: o } = await supabase.from("game_orders").select("id,game,status,created_at,payment_status,amount_rub").eq("facilitator_slug", slug).eq("user_id", u.user.id).order("created_at", { ascending: false });
      setOrders(o ?? []);
      setReviewedIds((data ?? []).map((r) => r.order_id));
    }
  }
  useEffect(() => { void load(); }, [slug]);

  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
  const reviewable = orders.filter((o) => o.status === "completed" && !reviewedIds.includes(o.id));

  return <>
    <section className="section border-t border-border bg-secondary"><div className="section-inner max-w-3xl">
      <p className="eyebrow">Заказать игру</p><h2 className="section-title">Игра с {hostTitle(name).replace("ведущего","ведущим").replace("ведущей","ведущей")} {name}</h2>
      {userId ? <><OrderForm slug={slug} onDone={load} />
        {orders.length > 0 && <div className="mt-10 space-y-2"><p className="text-sm font-medium">Мои заявки</p>{orders.map((o) => <div key={o.id} className="flex flex-wrap items-center justify-between gap-2 border-b border-border py-2 text-sm"><span>{o.game}</span><span className="flex items-center gap-3">{o.payment_status === "succeeded" ? <span className="text-primary">Оплачено</span> : o.status === "confirmed" ? <PayOrderButton orderId={o.id} /> : <span className="text-muted-foreground">{statusLabel[o.status]}</span>}</span></div>)}</div>}</>
        : null}
    </div></section>
  </>;
}

function OrderForm({ slug, onDone }: { slug: string; onDone: () => void }) {
  const [game, setGame] = useState(games[0]?.title ?? "");
  const [eventType, setEventType] = useState<string>(eventFormats[0] ?? "");
  const [format, setFormat] = useState<BookingFormat>("Офлайн");
  const [date, setDate] = useState(""); const [contact, setContact] = useState(""); const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(e: FormEvent) {
    e.preventDefault(); setBusy(true);
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) { setBusy(false); toast.error("Войдите в клуб, чтобы отправить заявку"); return; }
    const formatNote = `Формат: ${format}`;
    const { data: saved, error } = await supabase.from("game_orders").insert({ user_id: u.user.id, facilitator_slug: slug, game, event_type: eventType, preferred_date: date.slice(0, 100), contact: contact.trim().slice(0, 150), comment: [formatNote, comment].filter(Boolean).join(". ").slice(0, 1000) }).select("id").single();
    if (saved) void notifySavedLead({ data: { kind: "game_order", id: saved.id } }).catch(() => {});
    setBusy(false);
    if (error) { toast.error("Не удалось отправить заявку"); return; }
    toast.success("Заявка отправлена — ведущая свяжется с вами"); setDate(""); setComment(""); onDone();
  }
  return <form onSubmit={submit} className="mt-8 grid gap-4 sm:grid-cols-2">
    <div className="space-y-2"><Label>Игра</Label><Select value={game} onValueChange={setGame}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{games.filter((g) => !g.comingSoon).map((g) => <SelectItem key={g.slug} value={g.title}>{g.title}</SelectItem>)}</SelectContent></Select></div>
    <div className="space-y-2"><Label>Повод</Label><Select value={eventType} onValueChange={setEventType}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{eventFormats.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}<SelectItem value="Индивидуальная игра для пары">Индивидуальная игра для пары</SelectItem></SelectContent></Select></div>
    <BookingFormatField id="facilitator-order-format" value={format} onChange={setFormat} />
    <div className="space-y-2"><Label htmlFor="o-date">Желаемая дата</Label><Input id="o-date" value={date} onChange={(e) => setDate(e.target.value)} placeholder="например, 15 ноября вечером" maxLength={100} /></div>
    <div className="space-y-2"><Label htmlFor="o-contact">Телефон или Telegram</Label><Input id="o-contact" value={contact} onChange={(e) => setContact(e.target.value)} required minLength={3} maxLength={150} /></div>
    <div className="space-y-2 sm:col-span-2"><Label htmlFor="o-comment">Комментарий</Label><Textarea id="o-comment" value={comment} onChange={(e) => setComment(e.target.value)} maxLength={1000} placeholder="Сколько человек, онлайн или офлайн, пожелания" /></div>
    <p className="text-xs text-muted-foreground sm:col-span-2">После подтверждения заявки ведущей здесь появится кнопка оплаты картой.</p>
    <Button type="submit" disabled={busy} className="sm:col-span-2 sm:justify-self-start">Отправить заявку</Button>
  </form>;
}

function ReviewForm({ order, slug, onDone }: { order: Order; slug: string; onDone: () => void }) {
  const [rating, setRating] = useState(5); const [body, setBody] = useState(""); const [author, setAuthor] = useState("");
  async function submit(e: FormEvent) {
    e.preventDefault();
    const { data: u } = await supabase.auth.getUser();
    const { error } = await supabase.from("facilitator_reviews").insert({ order_id: order.id, user_id: u.user!.id, facilitator_slug: slug, rating, body: body.trim(), author_name: author.trim() });
    if (error) { toast.error("Не удалось сохранить отзыв"); return; }
    toast.success("Спасибо за отзыв!"); onDone();
  }
  return <form onSubmit={submit} className="mt-10 max-w-2xl space-y-4 rounded-xl border border-border bg-card p-6">
    <p className="font-display text-2xl">Как прошла игра «{order.game}»?</p>
    <Stars value={rating} onChange={setRating} />
    <Input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Ваше имя" required minLength={2} maxLength={80} />
    <Textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Ваш отзыв" required minLength={3} maxLength={2000} />
    <Button type="submit">Опубликовать отзыв</Button>
  </form>;
}

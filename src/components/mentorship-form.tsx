import { ConsentFields, wantsMarketing } from "@/components/consent-fields";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { payMentorshipLead, submitMentorshipLead } from "@/lib/mentorship.functions";
import { MENTORSHIP_PRICE_RUB } from "@/data/prices";
import { BookingFormatField, type BookingFormat } from "@/components/booking-format";

const goals = ["Стать ведущим", "Решить личную ситуацию", "Пока не знаю"] as const;

const priceLabel = new Intl.NumberFormat("ru-RU").format(MENTORSHIP_PRICE_RUB);

export function MentorshipForm({ source }: { source?: string }) {
  const submit = useServerFn(submitMentorshipLead);
  const pay = useServerFn(payMentorshipLead);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [goal, setGoal] = useState<(typeof goals)[number]>("Стать ведущим");
  const [format, setFormat] = useState<BookingFormat>("Индивидуально");
  const [busy, setBusy] = useState<"lead" | "pay" | "">("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  if (done) return <p className="font-display text-2xl">Спасибо. Артём лично свяжется с вами, чтобы договориться о первой встрече.</p>;

  const valid = name.trim().length >= 2 && phone.trim().length >= 5;

  return <form className="grid gap-3" onSubmit={async (e) => {
    e.preventDefault(); const marketing = wantsMarketing(e.currentTarget); setBusy("lead"); setError("");
    try { await submit({ data: { marketing, name, phone, goal, format, source, website: "" } }); setDone(true); }
    catch { setError("Проверьте имя и контакт и попробуйте ещё раз."); }
    finally { setBusy(""); }
  }}>
    <div className="flex flex-wrap gap-2" role="group" aria-label="Цель сопровождения">
      {goals.map((g) => <Button key={g} type="button" size="sm" variant={goal === g ? "default" : "outline"} aria-pressed={goal === g} onClick={() => setGoal(g)}>{g}</Button>)}
    </div>
    <Input required placeholder="Ваше имя" value={name} onChange={(e) => setName(e.target.value)} aria-label="Имя" />
    <Input required placeholder="Телефон или Telegram" value={phone} onChange={(e) => setPhone(e.target.value)} aria-label="Телефон или Telegram" />
    <BookingFormatField id="mentorship-format" value={format} onChange={setFormat} />
    {error && <p className="text-sm text-destructive">{error}</p>}
    <div className="grid gap-3 sm:grid-cols-2">
<ConsentFields />
      <Button type="submit" size="lg" variant="outline" disabled={busy !== ""}>
        {busy === "lead" ? "Отправляем…" : "Записаться на личную встречу"}
      </Button>
      <Button type="button" size="lg" disabled={busy !== "" || !valid} onClick={async (ev) => {
        const marketing = wantsMarketing(ev.currentTarget); setBusy("pay"); setError("");
        try {
          const { url } = await pay({ data: { marketing, name, phone, goal, format, source, website: "" } });
          window.location.href = url;
        } catch {
          setError("Не удалось создать платёж. Попробуйте ещё раз.");
          setBusy("");
        }
      }}>
        {busy === "pay" ? "Переходим к оплате…" : `Оплатить ${priceLabel} ₽`}
      </Button>
    </div>
    <p className="text-xs leading-5 text-muted-foreground">
      Кнопка оплаты отправляет заявку Артёму и открывает безопасную страницу оплаты картой. Оплата подтверждается автоматически.
    </p>
  </form>;
}

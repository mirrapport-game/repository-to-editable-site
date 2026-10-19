import { useState, type FormEvent } from "react";
import { ArrowRight, Check } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { submitFacilitatorApplication } from "@/lib/facilitator-applications.functions";

const interests = ["Пакет «Ведущий»", "Пакет «Под ключ»", "Пакет «Инвестор»", "Тестовая игра", "Проведение игр", "Академия Раппóрт", "Индивидуальное сопровождение", "Покупка комплекта", "Партнёрство", "Другое"] as const;
type Interest = (typeof interests)[number];

export function FacilitatorApplicationForm() {
  const submitApplication = useServerFn(submitFacilitatorApplication);
  const [form, setForm] = useState({ name: "", city: "", phone: "", interest: "" as Interest | "", website: "" });
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.interest) { setError("Выберите, что вас интересует"); return; }
    if (!consent) { setError("Отметьте согласие на обработку персональных данных"); return; }
    setSubmitting(true);
    setError("");
    try {
      await submitApplication({ data: { ...form, interest: form.interest, consent } });
      setSubmitted(true);
      setForm({ name: "", city: "", phone: "", interest: "", website: "" });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Не удалось отправить заявку. Попробуйте ещё раз.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) return <div className="border border-border bg-card p-8 md:p-10" role="status">
    <span className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground"><Check /></span>
    <h3 className="mt-6 font-display text-4xl">Заявка отправлена</h3>
    <p className="mt-3 leading-7 text-muted-foreground">Артём свяжется с вами и расскажет о подходящем формате.</p>
    <Button variant="outline" className="mt-7" onClick={() => setSubmitted(false)}>Отправить ещё одну</Button>
  </div>;

  return <form onSubmit={handleSubmit} className="border border-border bg-card p-6 md:p-9" noValidate>
    <div className="grid gap-5 sm:grid-cols-2">
      <div className="space-y-2"><Label htmlFor="facilitator-name">Имя</Label><Input id="facilitator-name" autoComplete="name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} minLength={2} maxLength={100} required /></div>
      <div className="space-y-2"><Label htmlFor="facilitator-city">Город</Label><Input id="facilitator-city" autoComplete="address-level2" value={form.city} onChange={(event) => setForm({ ...form, city: event.target.value })} minLength={2} maxLength={100} required /></div>
      <div className="space-y-2"><Label htmlFor="facilitator-phone">Телефон</Label><Input id="facilitator-phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="+7 999 000-00-00" pattern="[+0-9 ()-]{7,30}" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} minLength={7} maxLength={30} required /></div>
      <div className="space-y-2"><Label htmlFor="facilitator-interest">Что именно интересует</Label><Select value={form.interest} onValueChange={(interest: Interest) => setForm({ ...form, interest })}><SelectTrigger id="facilitator-interest" className="h-10"><SelectValue placeholder="Выберите вариант" /></SelectTrigger><SelectContent>{interests.map((interest) => <SelectItem key={interest} value={interest}>{interest}</SelectItem>)}</SelectContent></Select></div>
    </div>
    <div className="hidden" aria-hidden="true"><Label htmlFor="facilitator-website">Сайт</Label><Input id="facilitator-website" tabIndex={-1} autoComplete="off" value={form.website} onChange={(event) => setForm({ ...form, website: event.target.value })} /></div>
    <div className="mt-6 flex items-start gap-3">
      <Checkbox
        id="facilitator-consent"
        checked={consent}
        onCheckedChange={(checked) => setConsent(checked === true)}
        className="mt-0.5"
      />
      <Label htmlFor="facilitator-consent" className="text-xs font-normal leading-5 text-muted-foreground">
        Я даю согласие на обработку моих персональных данных (имя, город, телефон) для
        связи по заявке и соглашаюсь с использованием файлов cookie на сайте.
      </Label>
    </div>
    {error && <p className="mt-5 text-sm text-destructive" role="alert">{error}</p>}
    <Button type="submit" size="lg" className="mt-7 w-full sm:w-auto" disabled={submitting}>{submitting ? "Отправляем…" : <>Оставить заявку <ArrowRight /></>}</Button>
  </form>;
}
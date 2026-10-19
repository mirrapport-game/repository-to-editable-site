import { useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ArrowRight, Check, Gift, Network, ShoppingBag, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { submitFocusGroupApplication } from "@/lib/focus-group.functions";
import { BookingFormatField, type BookingFormat } from "@/components/booking-format";

const projects = [
  { name: "Игра про продажи", description: "Для тех, кто хочет увереннее вести диалог, слышать клиента и договариваться.", icon: ShoppingBag },
  { name: "Игра для сетевых компаний", description: "Про команду, партнёрство, лидерство и экологичное развитие сети.", icon: Network },
  { name: "Игра для мужчин", description: "О решениях, отношениях, ответственности и честном разговоре без масок.", icon: Users },
] as const;

type Project = (typeof projects)[number]["name"];

export function FocusGroupSection() {
  const submitApplication = useServerFn(submitFocusGroupApplication);
  const [form, setForm] = useState({ name: "", phone: "", project: "" as Project | "", format: "Для группы" as BookingFormat, website: "" });
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.project) { setError("Выберите проект"); return; }
    if (!consent) { setError("Отметьте согласие на обработку персональных данных"); return; }
    setSubmitting(true);
    setError("");
    try {
      await submitApplication({ data: { ...form, project: form.project, consent: true } });
      setSubmitted(true);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Не удалось отправить заявку. Попробуйте ещё раз.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="section bg-secondary">
      <div className="section-inner">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div>
            <div className="flex items-center gap-4">
              <span aria-hidden className="h-px w-12 bg-primary" />
              <p className="eyebrow">Открытый набор</p>
            </div>
            <h2 className="section-title mt-5 max-w-3xl">Станьте частью <em>новой игры</em></h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              Сейчас экспертная группа «Раппóрт» создаёт новые проекты и приглашает участников в фокус-группы. Вы сыграете одной из первых команд, поделитесь впечатлениями и поможете сделать механику точнее и полезнее.
            </p>
            <div className="mt-5 inline-flex items-center gap-3 border border-primary/25 bg-card px-4 py-3 text-sm font-semibold text-foreground">
              <Gift className="size-5 text-primary" /> Участие бесплатное
            </div>

            <div className="mt-10 grid gap-4">
              {projects.map(({ name, description, icon: Icon }, index) => (
                <Button
                  key={name}
                  type="button"
                  variant="ghost"
                  onClick={() => setForm((current) => ({ ...current, project: name }))}
                  className={`grid h-auto w-full grid-cols-[3rem_1fr_auto] items-center gap-4 whitespace-normal rounded-none border p-5 text-left transition-colors ${form.project === name ? "border-primary bg-card hover:bg-card" : "border-border bg-background hover:border-primary/45 hover:bg-background"}`}
                  aria-pressed={form.project === name}
                >
                  <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary"><Icon className="size-5" /></span>
                  <span><span className="block font-display text-xl">{name}</span><span className="mt-1 block text-sm leading-6 text-muted-foreground">{description}</span></span>
                  <span className="font-display text-sm text-muted-foreground">0{index + 1}</span>
                </Button>
              ))}
            </div>
          </div>

          <div className="self-end">
            {submitted ? (
              <div className="border border-border bg-card p-8 md:p-10" role="status">
                <span className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground"><Check /></span>
                <h3 className="mt-6 font-display text-4xl">Вы в списке</h3>
                <p className="mt-3 leading-7 text-muted-foreground">Спасибо! Мы свяжемся с вами, когда соберём ближайшую фокус-группу.</p>
                <Button variant="outline" className="mt-7" onClick={() => { setSubmitted(false); setForm({ name: "", phone: "", project: "", format: "Для группы", website: "" }); setConsent(false); }}>Подать другую заявку</Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="border border-border bg-card p-6 shadow-sm md:p-9" noValidate>
                <p className="eyebrow">Заявка в фокус-группу</p>
                <h3 className="mt-4 font-display text-3xl leading-tight md:text-4xl">Выберите проект</h3>
                <p className="mt-3 leading-7 text-muted-foreground">Оставьте контакт — расскажем о формате и согласуем удобное время.</p>
                <div className="mt-7 space-y-5">
                  <div className="space-y-2"><Label htmlFor="focus-name">Имя</Label><Input id="focus-name" autoComplete="name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} minLength={2} maxLength={100} required /></div>
                  <div className="space-y-2"><Label htmlFor="focus-phone">Телефон или Telegram</Label><Input id="focus-phone" autoComplete="tel" placeholder="+7 999 000-00-00 или @username" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} minLength={7} maxLength={30} required /></div>
                  <div className="space-y-2"><Label htmlFor="focus-project">Проект</Label><Select value={form.project} onValueChange={(project: Project) => setForm({ ...form, project })}><SelectTrigger id="focus-project" className="h-10"><SelectValue placeholder="Выберите игру" /></SelectTrigger><SelectContent>{projects.map(({ name }) => <SelectItem key={name} value={name}>{name}</SelectItem>)}</SelectContent></Select></div>
                  <BookingFormatField id="focus-format" value={form.format} onChange={(format) => setForm({ ...form, format })} />
                </div>
                <div className="hidden" aria-hidden="true"><Label htmlFor="focus-website">Сайт</Label><Input id="focus-website" tabIndex={-1} autoComplete="off" value={form.website} onChange={(event) => setForm({ ...form, website: event.target.value })} /></div>
                <div className="mt-6 flex items-start gap-3">
                  <Checkbox id="focus-consent" checked={consent} onCheckedChange={(checked) => setConsent(checked === true)} className="mt-0.5" />
                  <Label htmlFor="focus-consent" className="text-xs font-normal leading-5 text-muted-foreground">Я даю согласие на обработку имени и контакта для связи по заявке.</Label>
                </div>
                {error && <p className="mt-5 text-sm text-destructive" role="alert">{error}</p>}
                <Button type="submit" size="lg" className="mt-7 w-full" disabled={submitting}>{submitting ? "Отправляем…" : <>Участвовать бесплатно <ArrowRight /></>}</Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { openBookingWidget } from "@/components/booking-format";
import { gameDetails } from "@/data/game-details";

// Суть игры: что это, как проходит, что забираете, форматы и вопросы.
export function GameDetailsSections({ slug }: { slug: string }) {
  const d = gameDetails[slug];
  if (!d) return null;
  return <>
    <section className="section border-t border-border"><div className="section-inner grid gap-10 lg:grid-cols-[1.1fr_1fr]">
      <div><p className="eyebrow">Что это за игра</p><h2 className="section-title mt-3">{d.what.title}</h2></div>
      <div className="space-y-4 text-lg leading-8 text-muted-foreground">{d.what.text.map((t) => <p key={t}>{t}</p>)}</div>
      {d.what.facts && <div className="grid grid-cols-3 gap-px bg-border lg:col-span-2">{d.what.facts.map((f) => <div key={f.label} className="bg-background p-5"><p className="font-display text-4xl text-primary md:text-5xl">{f.value}</p><p className="mt-1 text-sm text-muted-foreground">{f.label}</p></div>)}</div>}
    </div></section>

    {d.steps && <section className="section bg-secondary"><div className="section-inner">
      <p className="eyebrow">Как проходит игра</p><h2 className="section-title mt-3">Шаг за шагом</h2>
      <ol className="mt-10 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">{d.steps.map((s, i) => <li key={s.title} className="bg-background p-6"><span className="font-display text-3xl text-primary">{String(i + 1).padStart(2, "0")}</span><p className="mt-3 font-display text-2xl">{s.title}</p><p className="mt-2 text-sm leading-6 text-muted-foreground">{s.text}</p></li>)}</ol>
    </div></section>}

    {d.takeaways && <section className="section"><div className="section-inner grid gap-10 lg:grid-cols-[1fr_1.2fr]">
      <div><p className="eyebrow">Что вы забираете</p><h2 className="section-title mt-3">Результат игры</h2></div>
      <ul className="divide-y divide-border border-y border-border">{d.takeaways.map((t) => <li key={t} className="py-4 text-lg">{t}</li>)}</ul>
    </div></section>}

    {d.pricing && <section className="section border-t border-border"><div className="section-inner">
      <p className="eyebrow">Форматы и стоимость</p><h2 className="section-title mt-3">Выберите, как играть</h2>
      <div className={`mt-6 grid gap-3 sm:mt-10 sm:gap-4 ${d.pricing.length === 4 ? "md:grid-cols-2 lg:grid-cols-4" : "md:grid-cols-3"}`}>{d.pricing.map((p) => <div key={p.label} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 border border-border bg-card p-4 md:flex md:flex-col md:items-stretch md:p-6"><div className="min-w-0"><p className="text-xs uppercase tracking-widest text-muted-foreground">{p.label}</p><p className="mt-1 font-display text-2xl md:mt-3 md:text-4xl">{p.price}</p><p className="mt-1 text-sm text-muted-foreground md:mt-2">{p.note}</p></div><Button type="button" className="shrink-0 md:mt-6" onClick={openBookingWidget}>Записаться</Button></div>)}</div>
    </div></section>}

    {d.faq && <section className="section bg-secondary"><div className="section-inner max-w-3xl">
      <p className="eyebrow">Вопросы и ответы</p><h2 className="section-title mt-3">Частые вопросы</h2>
      <Accordion type="single" collapsible className="mt-8">{d.faq.map((f) => <AccordionItem key={f.q} value={f.q}><AccordionTrigger className="text-left text-lg">{f.q}</AccordionTrigger><AccordionContent className="text-base leading-7 text-muted-foreground">{f.a}</AccordionContent></AccordionItem>)}</Accordion>
    </div></section>}
  </>;
}

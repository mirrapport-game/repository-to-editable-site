import { Link } from "@tanstack/react-router";
import { ArrowRight, Briefcase, HeartHandshake, Flower2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const SEGMENTS = [
  { id: "business", icon: Briefcase, title: "Для команд и бизнеса", tags: ["Тимбилдинг", "Soft skills", "Разрешение конфликтов"],
    pain: "Сотрудники молчат на совещаниях, обиды копятся, а конфликты решаются в курилке. Игра даёт безопасно проговорить напряжение через роли — и договориться.", slug: "business", cta: "Выбрать формат" },
  { id: "couples", icon: HeartHandshake, title: "Для пар", tags: ["Эмоциональная близость", "Сложные разговоры", "Повторяющиеся ссоры"],
    pain: "Вы ссоритесь из-за одного и того же, а о главном говорить страшно. Персонаж на карточке помогает сказать трудное — без обвинений и обид.", slug: "otnosheniya", cta: "Подробнее" },
  { id: "women", icon: Flower2, title: "Для женских кругов", tags: ["Самопознание", "Поддержка", "Границы"],
    pain: "Трудно сказать «нет», забота о других съедает силы, а себя слышно всё реже. В круге можно примерить роль и увидеть свои границы со стороны.", slug: "zhivaya", cta: "Подробнее" },
  { id: "beauty", icon: Sparkles, title: "Для салонов и студий красоты", tags: ["Раппóрт Beauty", "Сервис", "Возврат клиентов"],
    pain: "Мастер делает отличную работу, а клиент не возвращается. Игра учит мастеров и руководителей выстраивать раппорт с клиентом и договариваться внутри команды.", slug: "beauty", cta: "Подробнее" },
] as const;

export function AudienceSegments() {
  return (
    <section id="audience" className="section border-t border-border">
      <div className="section-inner">
        <p className="eyebrow">Для кого игры</p>
        <h2 className="section-title">Выберите <em>свою</em> игру</h2>
        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {SEGMENTS.map(({ id, icon: Icon, title, tags, pain, slug, cta }) => (
            <article key={id} id={`audience-${id}`} className="flex flex-col rounded-3xl border border-border bg-card p-8 shadow-sm card-lift">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-primary text-primary-foreground"><Icon className="h-7 w-7" aria-hidden /></span>
              <h3 className="mt-6 font-display text-3xl">{title}</h3>
              <ul className="mt-4 flex flex-wrap gap-2">{tags.map((t) => <li key={t} className="rounded-full bg-secondary px-3 py-1 text-xs font-medium uppercase tracking-wider text-secondary-foreground">{t}</li>)}</ul>
              <p className="mt-5 flex-1 leading-7 text-muted-foreground">{pain}</p>
              <Button asChild size="lg" className="mt-8 self-start"><Link to="/games/$slug" params={{ slug }}>{cta} <ArrowRight /></Link></Button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

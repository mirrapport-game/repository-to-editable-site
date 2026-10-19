import { Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Dices, Heart } from "lucide-react";

const STEPS = [
  { icon: BookOpen, title: "Почитать блог", text: "Статьи о близости, границах и том, как проходит игра.", to: "/blog" as const },
  { icon: Dices, title: "Сыграть онлайн", text: "Мини-игра «Раппóрт» для 2–8 игроков прямо в браузере.", to: "/play" as const },
  { icon: Heart, title: "Клуб знакомств «Раппóрт Da»", text: "Для свободных участников: знакомства через игру, а не анкеты.", to: "/community" as const },
];

export function NextSteps() {
  return <section className="section bg-secondary"><div className="section-inner">
    <p className="eyebrow">Пока не готовы к игре?</p>
    <h2 className="section-title max-w-3xl">Начните <em>с малого шага</em></h2>
    <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {STEPS.map(({ icon: Icon, title, text, to }) => <Link key={to} to={to} className="group flex flex-col rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-lg">
        <Icon className="size-8 text-primary" />
        <h3 className="mt-5 font-display text-2xl leading-tight">{title}</h3>
        <p className="mt-2 flex-1 text-muted-foreground">{text}</p>
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary">Перейти <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /></span>
      </Link>)}
    </div>
  </div></section>;
}

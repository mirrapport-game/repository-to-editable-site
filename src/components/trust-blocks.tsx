import { CountUp } from "@/components/motion";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { participantReviewImages } from "@/data/site";
import { ArrowRight, MessageSquareText, Drama, HeartHandshake, Sparkles } from "lucide-react";

// ЗАГЛУШКИ: заменить реальными данными от владельца. Не выдумывать.
const STATS: { value: string; label: string; todo?: boolean }[] = [
  { value: "20", label: "городов в 3 странах" },
  { value: "5000+", label: "участников" },
  { value: "6", label: "лет практики" },
  { value: "500+", label: "пар прошли игру" },
];

const PARTNERS = ["Логотип 1", "Логотип 2", "Логотип 3", "Логотип 4", "Логотип 5", "Логотип 6"];

export function AchievementStats() {
  return (
    <section className="hidden border-y border-border bg-background py-14 md:block">
      <div className="section-inner grid grid-cols-2 gap-8 md:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label} className="text-center">
            <p className={`font-display text-6xl leading-none md:text-7xl ${s.todo ? "text-muted-foreground" : "text-primary"}`}>{s.todo ? s.value : <CountUp value={s.value} />}</p>
            <p className="mt-3 text-sm uppercase tracking-widest text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function ReviewWall() {
  return (
    <section className="section bg-secondary">
      <div className="section-inner">
        <p className="eyebrow">Стена любви</p>
        <h2 className="section-title">Что говорят <em>участники</em></h2>
        <div className="mt-14 columns-1 gap-5 sm:columns-2 lg:columns-3">
          {participantReviewImages.slice(0, 9).map((r) => (
            <figure key={r.src} className="card-lift mb-5 break-inside-avoid overflow-hidden rounded-3xl border border-border bg-card">
              <img src={r.src} alt={r.alt} loading="lazy" className="w-full" />
              <figcaption className="px-5 py-3 text-sm text-muted-foreground">{r.game}</figcaption>
            </figure>
          ))}
        </div>
        <div className="mt-10 flex justify-center"><Button asChild variant="outline"><Link to="/reviews">Все отзывы <ArrowRight /></Link></Button></div>
      </div>
    </section>
  );
}

export function PartnerLogos() {
  return (
    <section className="bg-secondary py-14">
      <div className="section-inner">
        <p className="eyebrow text-center">Нам доверяют</p>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {PARTNERS.map((p) => <div key={p} className="grid h-20 place-items-center rounded-2xl border border-dashed border-border text-sm text-muted-foreground">{p}</div>)}
        </div>
      </div>
    </section>
  );
}

const STEPS = [
  { icon: MessageSquareText, title: "Запрос", text: "Озвучиваете, с чем пришли и что хотите понять." },
  { icon: Drama, title: "Ситуация", text: "Играете персонажа и замечаете свои реакции." },
  { icon: HeartHandshake, title: "Обратная связь", text: "Её получает персонаж, а не вы — без оценок." },
  { icon: Sparkles, title: "Новый выбор", text: "Пробуете другое поведение и уносите его в жизнь." },
];

export function HowTimeline() {
  return (
    <ol className="relative mt-16 grid gap-10 md:grid-cols-4 md:gap-6">
      <span aria-hidden className="absolute left-0 right-0 top-8 hidden h-0.5 bg-border md:block" />
      {STEPS.map(({ icon: Icon, title, text }, i) => (
        <li key={title} className="relative flex flex-col items-center text-center">
          <span className="relative z-10 grid h-16 w-16 place-items-center rounded-full bg-primary text-primary-foreground ring-8 ring-background"><Icon className="h-7 w-7" aria-hidden /></span>
          <span className="mt-5 text-xs font-bold uppercase tracking-widest text-primary">Шаг {i + 1}</span>
          <h3 className="mt-2 font-display text-2xl">{title}</h3>
          <p className="mt-3 max-w-[16rem] leading-7 text-muted-foreground">{text}</p>
        </li>
      ))}
    </ol>
  );
}

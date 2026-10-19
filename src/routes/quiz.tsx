import { QuestGate } from "@/components/quest-gate";
import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { MentorshipForm } from "@/components/mentorship-form";

const title = "Тест: какой путь в Раппóрт ваш — Раппóрт";
const description = "Ответьте «да» или «нет» на несколько вопросов — и узнайте, что вам подходит: сыграть в игру, купить игру, инвестировать или индивидуальное сопровождение.";

export const Route = createFileRoute("/quiz")({
  head: () => ({
    meta: [
      { title }, { name: "description", content: description },
      { property: "og:title", content: title }, { property: "og:description", content: description },
      { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <QuestGate title="Тест «Ваш путь»"><QuizPage /></QuestGate>,
});

type Outcome = "play" | "buy" | "invest" | "mentor";
const questions: { q: string; yes: Outcome; no: Outcome | null }[] = [
  { q: "Хотите сначала сами почувствовать, как работает игра?", yes: "play", no: null },
  { q: "Вам интересно проводить игры для других людей?", yes: "buy", no: null },
  { q: "Хотите пройти путь лично с автором — с личными созвонами и поддержкой?", yes: "mentor", no: null },
  { q: "Ищете проект, в который можно вложить деньги и расти вместе с ним?", yes: "invest", no: null },
  { q: "Есть личная ситуация, которую хочется решить бережно и глубоко?", yes: "mentor", no: "play" },
];

const outcomes: Record<Outcome, { title: string; text: string; cta: string; to: string }> = {
  play: { title: "Ваш путь — сыграть", text: "Начните с одной игры: участие от 2 500 ₽. Это лучший способ понять Раппóрт изнутри.", cta: "Выбрать игру", to: "/games" },
  buy: { title: "Ваш путь — проводить игры", text: "Купите игру и пройдите Академию Раппóрт — и проводите игры в своём городе.", cta: "Смотреть тарифы", to: "/facilitators" },
  invest: { title: "Ваш путь — инвестировать", text: "Раппóрт растёт в новых городах и странах. Обсудим условия партнёрства.", cta: "Инвесторам", to: "/facilitators" },
  mentor: { title: "Ваш путь — личное сопровождение", text: "Все игры, тренинги и личные созвоны с автором — вокруг вашей цели.", cta: "О сопровождении", to: "/mentorship" },
};

function QuizPage() {
  const [step, setStep] = useState(0);
  const [result, setResult] = useState<Outcome | null>(null);
  const answer = (yes: boolean) => {
    const q = questions[step]; if (!q) return;
    const next = yes ? q.yes : q.no;
    if (next) setResult(next); else setStep(step + 1);
  };
  const reset = () => { setStep(0); setResult(null); };

  return <section className="section"><div className="section-inner max-w-3xl">
    <h1 className="eyebrow">Тест «Какой путь в Раппóрт ваш» · 1 минута</h1>
    {!result ? <>
      <p className="mt-8 font-display text-sm text-muted-foreground">Вопрос {step + 1} из {questions.length}</p>
      <div className="mt-3 h-1 bg-secondary"><div className="h-1 bg-primary transition-all" style={{ width: `${((step + 1) / questions.length) * 100}%` }} /></div>
      <h2 className="mt-10 font-display text-4xl leading-tight md:text-6xl">{questions[step]?.q}</h2>
      <div className="mt-10 flex gap-3"><Button size="lg" className="min-w-32" onClick={() => answer(true)}>Да</Button><Button size="lg" variant="outline" className="min-w-32" onClick={() => answer(false)}>Нет</Button></div>
    </> : <>
      <h2 className="mt-8 font-display text-5xl leading-tight md:text-6xl">{outcomes[result].title}</h2>
      <p className="mt-6 text-lg leading-8 text-muted-foreground">{outcomes[result].text}</p>
      <div className="mt-8 flex flex-wrap gap-3"><Button asChild size="lg"><Link to={outcomes[result].to}>{outcomes[result].cta}</Link></Button><Button size="lg" variant="ghost" onClick={reset}>Пройти заново</Button></div>
      {result === "mentor" && <div className="mt-10 border border-border bg-card p-6"><MentorshipForm source="Тест" /></div>}
    </>}
  </div></section>;
}

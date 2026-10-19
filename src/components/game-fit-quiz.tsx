import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

type Gender = "female" | "male";
type Slug = "otnosheniya" | "zhivaya" | "beauty" | "business";
type Q = { text: string; yes: Slug; onlyFor?: Gender };

// Each "Да" adds a point to one game; the game with most points is recommended.
const QUESTIONS: Q[] = [
  { text: "Хотите лучше понимать партнёра и реже ссориться?", yes: "otnosheniya" },
  { text: "Вы сейчас в поиске отношений и хотите понять, что вам мешает?", yes: "otnosheniya" },
  { text: "Хочется побыть наедине с собой и вернуть внутренний ресурс?", yes: "zhivaya", onlyFor: "female" },
  { text: "Важно разобраться в своих границах и самоценности?", yes: "zhivaya", onlyFor: "female" },
  { text: "Вы работаете с клиентами в сфере красоты?", yes: "beauty" },
  { text: "Вы руководите командой или ведёте переговоры?", yes: "business" },
];

const RESULT: Record<Slug, string> = {
  otnosheniya: "«Раппóрт про отношения»",
  zhivaya: "«Раппóрт Живая»",
  beauty: "«Раппóрт Beauty»",
  business: "«Раппóрт Бизнес»",
};

// Черновые тексты — требуют подтверждения автором.
const IMPACT: Record<Slug, { problems: string[]; before: string; after: string }> = {
  otnosheniya: { problems: ["Частые ссоры и недосказанность", "Непонимание ожиданий партнёра", "Повторяющиеся сценарии в отношениях"], before: "Разговоры уходят в претензии, сложно услышать друг друга.", after: "Понятно, чего хочет каждый, появляется язык для честного диалога." },
  zhivaya: { problems: ["Усталость и потеря ресурса", "Размытые личные границы", "Сомнения в своей ценности"], before: "Живёте чужими ожиданиями, мало энергии на себя.", after: "Ясность в желаниях, опора на себя и план бережных шагов." },
  beauty: { problems: ["Сложные клиенты и конфликты", "Выгорание мастеров", "Низкая повторная запись"], before: "Сервис держится на интуиции, клиенты уходят молча.", after: "Команда понимает клиента и умеет выстраивать доверие." },
  business: { problems: ["Слабая коммуникация в команде", "Напряжённые переговоры", "Скрытые конфликты"], before: "Решения буксуют, люди не договаривают.", after: "Открытый диалог, понятные роли и договорённости." },
};

export function GameFitQuiz() {
  const [gender, setGender] = useState<Gender | null>(null);
  const [step, setStep] = useState(0);
  const [score, setScore] = useState<Record<Slug, number>>({ otnosheniya: 0, zhivaya: 0, beauty: 0, business: 0 });
  const qs = QUESTIONS.filter((q) => !q.onlyFor || q.onlyFor === gender);
  const done = gender && step >= qs.length;
  const best = (Object.keys(score) as Slug[]).reduce((a, b) => (score[b] > score[a] ? b : a), "otnosheniya" as Slug);

  const answer = (yes: boolean) => {
    const q = qs[step];
    if (yes && q) setScore((s) => ({ ...s, [q.yes]: s[q.yes] + 1 }));
    setStep((n) => n + 1);
  };
  const reset = () => { setGender(null); setStep(0); setScore({ otnosheniya: 0, zhivaya: 0, beauty: 0, business: 0 }); };

  return <section className="section border-t border-border"><div className="section-inner max-w-3xl">
    <p className="eyebrow">Тест</p>
    <h2 className="section-title">Какая игра <em>вам подходит?</em></h2>
    <div className="mt-10 rounded-2xl border border-border bg-card p-6 sm:p-10">
      {!gender && <>
        <p className="font-display text-2xl">Начнём: вы…</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button size="lg" onClick={() => setGender("female")}>Женщина</Button>
          <Button size="lg" variant="outline" onClick={() => setGender("male")}>Мужчина</Button>
        </div>
      </>}
      {gender && !done && <>
        <p className="text-sm text-muted-foreground">Вопрос {step + 1} из {qs.length}</p>
        <p className="mt-3 font-display text-2xl sm:text-3xl">{qs[step]?.text}</p>
        <div className="mt-6 flex gap-3">
          <Button size="lg" onClick={() => answer(true)}>Да</Button>
          <Button size="lg" variant="outline" onClick={() => answer(false)}>Нет</Button>
        </div>
      </>}
      {done && <>
        <p className="text-sm text-muted-foreground">Вам подходит</p>
        <p className="mt-3 font-display text-3xl sm:text-4xl">{RESULT[best]}</p>
        <p className="mt-6 text-xs uppercase tracking-widest text-muted-foreground">Какие проблемы решает</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">{IMPACT[best].problems.map((p) => <li key={p}>{p}</li>)}</ul>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-muted/40 p-4"><p className="text-xs uppercase tracking-widest text-muted-foreground">До игры</p><p className="mt-2 text-sm">{IMPACT[best].before}</p></div>
          <div className="rounded-xl border border-primary/40 bg-primary/10 p-4"><p className="text-xs uppercase tracking-widest text-primary">После игры</p><p className="mt-2 text-sm">{IMPACT[best].after}</p></div>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild size="lg"><Link to="/games/$slug" params={{ slug: best }}>Подробнее об игре <ArrowRight /></Link></Button>
          <Button size="lg" variant="outline" onClick={reset}><RotateCcw />Пройти заново</Button>
        </div>
      </>}
    </div>
  </div></section>;
}

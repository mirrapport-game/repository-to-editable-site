import { useEffect, useState } from "react";
import { games } from "@/data/site";
import { QuestGate } from "@/components/quest-gate";
import { RelationshipQuestionGenerator } from "@/components/relationship-question-generator";
import { CaseTrainer } from "@/components/case-trainer";

export const QUEST_GAME_KEY = "rapport-quest-game";
const PRACTICE: Record<string, { title: string; text: string }> = {
  otnosheniya: { title: "Rapport AI для пары", text: "Вы выбрали «Отношения». Получите вопросы для разговора с партнёром — так начинается игра." },
  zhivaya: { title: "Разговор с собой", text: "Вы выбрали «Раппóрт Живая». Rapport AI подберёт вопросы, чтобы честно поговорить с собой." },
  beauty: { title: "Тренажёр для салона", text: "Вы выбрали «Раппóрт Beauty». Решите кейсы из жизни мастера и клиента." },
  business: { title: "Тренажёр для команды", text: "Вы выбрали «Бизнес». Решите кейсы руководителя и переговорщика." },
};

// Третий уровень квеста: практика по игре, выбранной на втором уровне.
export function QuestPractice() {
  const [slug, setSlug] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => { setSlug(localStorage.getItem(QUEST_GAME_KEY)); setReady(true); }, []);
  const pick = (s: string) => { localStorage.setItem(QUEST_GAME_KEY, s); setSlug(s); };
  const p = slug ? PRACTICE[slug] : undefined;
  if (!ready) return <div className="min-h-96" aria-busy="true" />;
  return <section className="section"><div className="mx-auto max-w-4xl px-5">
    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Уровень 3 · Практика</p>
    {!p ? <>
      <h1 className="mt-3 font-display text-4xl md:text-5xl">Попробуйте свою игру</h1>
      <p className="mt-3 text-muted-foreground">Выберите игру — и получите практику по ней.</p>
      <div className="mt-8 grid gap-3 sm:grid-cols-2">{games.filter((g) => PRACTICE[g.slug]).map((g) =>
        <button key={g.slug} type="button" onClick={() => pick(g.slug)} className="rounded-[var(--radius)] border border-border bg-card p-5 text-left hover:bg-secondary"><span className="font-display text-2xl">{g.shortTitle}</span><span className="mt-1 block text-sm text-muted-foreground">{g.tagline}</span></button>)}</div>
    </> : <>
      <h1 className="mt-3 font-display text-4xl md:text-5xl">{p.title}</h1>
      <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">{p.text}</p>
      <div className="mt-8">
        <QuestGate title={p.title}>
          {slug === "otnosheniya" && <RelationshipQuestionGenerator />}
          {slug === "zhivaya" && <RelationshipQuestionGenerator mode="self" />}
          {(slug === "beauty" || slug === "business") && <CaseTrainer kind={slug} />}
        </QuestGate>
      </div>
    </>}
  </div></section>;
}

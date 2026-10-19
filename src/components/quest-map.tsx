import { Link } from "@tanstack/react-router";
import { Check, Gift, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuest } from "@/hooks/use-quest";
import { QUEST_LEVELS, QUEST_REWARDS } from "@/lib/quest";
import { setVisitMode } from "@/lib/visit-mode";

// Карта квеста на главной: путь гостя из 6 уровней и сюрпризы в конце.
export function QuestMap() {
  const { user, levels, done, total, completed } = useQuest();
  const nextLevel = QUEST_LEVELS.find((l) => !levels.includes(l.path)) ?? QUEST_LEVELS[0];
  return <section className="section bg-secondary"><div className="section-inner">
    <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
      <div><p className="eyebrow">Квест «Раппóрт»</p><h2 className="section-title max-w-3xl">Шесть уровней — и куча сюрпризов в конце</h2>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:mt-4 sm:text-base">Каждая страница — новая глава. Проходите по порядку, открывайте игры, тест и Клуб, а в финале сыграйте сами.</p></div>
      {user
        ? <div className="text-right"><p className="font-display text-5xl text-primary">{done}/{total}</p><p className="text-sm text-muted-foreground">уровней пройдено</p></div>
        : null}
    </div>
    <ol className="mt-6 grid sm:mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {QUEST_LEVELS.map((l, i) => {
        const passed = levels.includes(l.path);
        const current = l.path === nextLevel.path && !completed;
        return <li key={l.path} className={`rounded-2xl border transition-shadow ${current ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/25 ring-4 ring-secondary" : "border-border bg-card"}`}>
          <Link to={l.path} onClick={() => setVisitMode("quest")} className="group flex h-full flex-col p-3 sm:p-5">
            <span className="flex items-center justify-between text-[10px] uppercase tracking-widest opacity-70 sm:text-xs">Уровень {i + 1}{passed && <Check className="size-4 text-primary" />}</span>
            <span className="mt-1.5 font-display text-lg leading-tight sm:mt-3 sm:text-2xl">{l.title}</span>
            <span className="mt-1 hidden text-sm opacity-75 sm:block">{l.hint}</span>
          </Link>
        </li>;
      })}
    </ol>
    <div className="mt-4 grid gap-3">
      {QUEST_REWARDS.map((r) => <div key={r.title} className="rounded-xl border border-dashed border-primary/40 bg-secondary p-3 text-secondary-foreground sm:p-5">
        <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">{completed ? <Gift className="size-4" /> : <Lock className="size-4" />}Сюрприз</span>
        <p className="mt-2 font-display text-lg leading-tight sm:mt-3 sm:text-2xl">{r.title}</p><p className="mt-1 hidden text-sm text-muted-foreground sm:block">{r.text}</p>
      </div>)}
    </div>
    <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
      {!user && <><Button asChild size="lg"><Link to="/auth" search={{ redirect: "/quest" }} onClick={() => setVisitMode("quest")}>Зарегистрироваться, чтобы копить подарки</Link></Button></>}
      {user && !completed && <Button asChild size="lg"><Link to={nextLevel.path} onClick={() => setVisitMode("quest")}>Продолжить: {nextLevel.title}</Link></Button>}
      {user && completed && <Button asChild size="lg"><Link to="/games/$slug" params={{ slug: "otnosheniya" }} hash="rapport-ai">Попробовать игру «Отношения»</Link></Button>}
    </div>
  </div></section>;
}

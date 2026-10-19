import { Link, useRouterState } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { type ReactNode, useCallback, useEffect, useState } from "react";
import { QuestRiddle } from "@/components/quest-riddle";
import { useQuest } from "@/hooks/use-quest";
import { QUEST_LEVELS, questIndex } from "@/lib/quest";
import { setVisitMode, useVisitMode } from "@/lib/visit-mode";

// Остальные страницы ведут обратно в маршрут квеста.
const extra: Record<string, { title: string; to: string }> = {
  "/blog": { title: "Вернуться к квесту: тест «Ваш путь»", to: "/quiz" },
  "/facilitators": { title: "Академия Раппóрт", to: "/course" },
  "/course": { title: "Индивидуальное сопровождение", to: "/mentorship" },
  "/online-platform": { title: "Вернуться к квесту: выбор игры", to: "/games" },
  "/contacts": { title: "Начать квест с первого уровня", to: "/about" },
};

export function StoryNext() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user, mark, completed, levels } = useQuest();
  const idx = questIndex(pathname);
  const [solvedPath, setSolvedPath] = useState<string | null>(null);
  const onSolved = useCallback(() => { setSolvedPath(pathname); if (idx >= 0) mark(pathname); }, [pathname, idx, mark]);
  const needsKey = idx >= 0 && solvedPath !== pathname && !(user && levels.includes(pathname));

  const { mode } = useVisitMode();
  const hidden = pathname.startsWith("/manage") || pathname.startsWith("/payment") || pathname === "/play" || pathname === "/auth";
  if (hidden) return null;
  // Режим «просто посмотреть сайт» — без заданий квеста, только предложение вернуться к нему.
  // Обычный сайт — никаких заданий квеста; квест живёт только в режиме «quest» (вход через /quest).
  if (mode !== "quest") return null;

  let next: { eyebrow: string; title: string; to: string } | null = null;
  if (pathname === "/" || pathname === "/quest") next = { eyebrow: "Начало квеста · уровень 1", title: QUEST_LEVELS[0].title, to: QUEST_LEVELS[0].path };
  else if (idx >= 0 && idx < QUEST_LEVELS.length - 1) {
    const n = QUEST_LEVELS[idx + 1]!;
    next = { eyebrow: `Уровень ${idx + 1} из ${QUEST_LEVELS.length} пройден · дверь открыта`, title: n.title, to: n.path };
  } else if (idx === QUEST_LEVELS.length - 1) {
    next = { eyebrow: user ? "Квест пройден · ваш подарок" : "Финал квеста", title: "Выберите игру и запишитесь", to: "/games" };
  } else if (extra[pathname]) next = { eyebrow: "Дальше", ...extra[pathname] };
  if (!next) return null;

  return <section className="border-t border-border bg-secondary">
    <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
      {idx >= 0 && (needsKey || solvedPath === pathname) && <QuestRiddle level={idx} onSolved={onSolved} />}
      {!needsKey && <Link to={next.to} className="group mt-6 flex items-center justify-between gap-6">
        <span><span className="eyebrow">{next.eyebrow}</span><span className="mt-2 block font-display text-3xl md:text-4xl">{next.title}</span></span>
        <ArrowRight className="size-8 shrink-0 text-primary transition-transform group-hover:translate-x-2" />
      </Link>}
      {idx >= 0 && <div className="mt-6 flex gap-1" aria-label="Прогресс квеста">{QUEST_LEVELS.map((l, i) => <span key={l.path} className={`h-1 flex-1 ${i <= idx ? "bg-primary" : "bg-border"}`} />)}</div>}
      {idx >= 0 && !user && <p className="mt-4 text-sm text-muted-foreground">Вы смотрите без регистрации — подарки не копятся. <Link to="/auth" search={{ redirect: pathname }} className="text-primary underline-offset-4 hover:underline">Зарегистрироваться</Link></p>}
      {completed && idx < 0 && <p className="mt-4 text-sm text-muted-foreground">Квест пройден: <Link to="/play" className="text-primary">тренажёр</Link></p>}
    </div>
  </section>;
}

// Верхняя полоска в режиме квеста: где я и как выйти на обычный сайт.
export function QuestBar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { mode } = useVisitMode();
  const { done, total } = useQuest();
  if (mode !== "quest" || pathname.startsWith("/manage") || pathname.startsWith("/payment")) return null;
  const idx = questIndex(pathname);
  return <div className="border-b border-border bg-card/80 backdrop-blur-md">
    <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-2 text-sm lg:px-8">
      <Link to="/quest" className="rounded-full bg-secondary px-3 py-1 font-medium text-secondary-foreground">{idx >= 0 ? `Уровень ${idx + 1} из ${QUEST_LEVELS.length}` : `Пройдено ${done}/${total}`}</Link>
      <button type="button" onClick={() => setVisitMode("site")} className="text-xs font-medium uppercase tracking-wider text-muted-foreground transition-colors hover:text-primary">Выйти из квеста</button>
    </div>
  </div>;
}

// Внутри квеста прячем всё, что уводит в сторону: меню, запись, подвал, всплывающие предложения.
export function QuestHide({ children }: { children: ReactNode }) {
  const { mode } = useVisitMode();
  useEffect(() => {
    if (mode === "quest") document.documentElement.dataset["quest"] = "on";
    else delete document.documentElement.dataset["quest"];
  }, [mode]);
  return mode === "quest" ? null : <>{children}</>;
}

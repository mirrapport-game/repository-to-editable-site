import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Compass, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuestMap } from "@/components/quest-map";
import { useQuest } from "@/hooks/use-quest";
import { QUEST_LEVELS } from "@/lib/quest";
import { canonical, seoMeta } from "@/lib/seo";
import { setVisitMode, useVisitMode } from "@/lib/visit-mode";

export const Route = createFileRoute("/quest")({
  head: () => ({ links: canonical("/quest"), meta: [...seoMeta("/quest"),
    { title: "Квест «Раппóрт» — познакомьтесь с игрой шаг за шагом" },
    { name: "description", content: "Шесть уровней с вопросами-ключами: узнайте о проекте, выберите игру, пройдите тест и получите подарки." },
    { property: "og:title", content: "Квест «Раппóрт»" },
    { property: "og:description", content: "Пройдите сайт как игру: шесть уровней, вопросы-ключи и подарки в конце." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: QuestPage,
});

function QuestPage() {
  const navigate = useNavigate();
  const { mode } = useVisitMode();
  const { levels } = useQuest();
  const next = QUEST_LEVELS.find((l) => !levels.includes(l.path)) ?? QUEST_LEVELS[0];
  const start = () => { setVisitMode("quest"); void navigate({ to: next.path }); };
  const exit = () => { setVisitMode("site"); void navigate({ to: "/" }); };
  return <>
    <section className="section"><div className="section-inner text-center">
      <p className="eyebrow">Отдельный путь</p>
      <h1 className="mx-auto mt-3 max-w-4xl font-display text-4xl leading-tight sm:text-5xl md:text-7xl">Квест «Раппóрт»</h1>
      <p className="mx-auto mt-4 max-w-2xl text-base leading-7 sm:mt-6 sm:text-lg sm:leading-8 text-muted-foreground">Сайт превращается в игру: страницы открываются по порядку, на каждой — вопрос-ключ из жизни. Ответили верно — дверь к следующему уровню открыта. В конце — подарки.</p>
      <div className="mt-6 grid gap-3 sm:mt-8 sm:flex sm:flex-wrap sm:justify-center">
        <Button size="lg" onClick={start}><Compass />{mode === "quest" ? `Продолжить: ${next.title}` : "Начать квест"}<ArrowRight /></Button>
        {mode !== "quest" && <Button size="lg" variant="outline" onClick={exit}><LogOut />Просто смотреть сайт</Button>}
      </div>
      <p className="mt-4 text-sm text-muted-foreground">Квест можно покинуть в любой момент — кнопка «Выйти из квеста» всегда вверху страницы.</p>
    </div></section>
    <QuestMap />
  </>;
}

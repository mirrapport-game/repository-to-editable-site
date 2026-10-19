import { createFileRoute } from "@tanstack/react-router";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FocusGroupSection } from "@/components/focus-group-section";
import { games, TELEGRAM_URL } from "@/data/site";

const upcomingGames = games.filter((g) => g.comingSoon);

const title = "Создание новых игр «Раппóрт» — фокус-группы и игры под ключ";
const description = "Приглашаем в фокус-группы по созданию новых игр «Раппóрт» и разрабатываем психологические игры под ключ. Бюджет от 300 000 ₽.";

export const Route = createFileRoute("/game-creation")({
  head: () => ({
    links: [{ rel: "canonical", href: "https://rapportgame.ru/game-creation" }],
    meta: [
      { title }, { name: "description", content: description },
      { property: "og:title", content: title }, { property: "og:description", content: description },
      { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
    ],
  }),
  component: GameCreationPage,
});

function GameCreationPage() {
  return <>
    <section className="section"><div className="section-inner">
      <p className="eyebrow">Создание новых игр</p>
      <h1 className="section-title">Создаём новые игры <em>«Раппóрт»</em></h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">Мы приглашаем в фокус-группы, где вместе тестируем и дорабатываем новые игры. Участие бесплатное.</p>
    </div></section>
    <section className="section bg-secondary"><div className="section-inner"><p className="eyebrow">Сейчас в разработке</p><h2 className="section-title">Новые игры <em>серии</em></h2>
      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{upcomingGames.map((g)=><div key={g.slug} className="rounded-2xl border border-border bg-card p-8"><h3 className="font-display text-4xl">{g.title}</h3><p className="mt-3 text-lg text-muted-foreground">{g.tagline}</p><p className="mt-5 text-sm font-semibold uppercase tracking-widest text-primary">Скоро · приглашаем в фокус-группу</p></div>)}</div>
    </div></section>
    <FocusGroupSection />
    <section className="section border-t border-border bg-secondary"><div className="section-inner grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
      <div><p className="eyebrow">Игра под ключ</p><h2 className="section-title">Разработаем игру <em>для вашего проекта</em></h2>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">Создаём психологическую игру под задачи вашей компании, школы или сообщества: от идеи до готовой коробки. Бюджет — от 300 000 ₽.</p></div>
      <Button asChild size="lg"><a href={TELEGRAM_URL} target="_blank" rel="noreferrer"><Send />Обсудить проект</a></Button>
    </div></section>
  </>;
}

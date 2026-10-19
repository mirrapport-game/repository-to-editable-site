import { QuestGate } from "@/components/quest-gate";
import { createFileRoute } from "@tanstack/react-router";
import { Minigame } from "@/components/minigame";
import { MINIGAME_PRICE } from "@/data/minigame";

export const Route = createFileRoute("/play")({
  ssr: false,
  head: () => ({ meta: [
    { title: "Мини-игра «Раппóрт» про отношения онлайн — играйте с друзьями" },
    { name: "description", content: "Онлайн-игра «Раппóрт» без ведущего: 6 этапов от знакомства до близости, мужские и женские карточки. Первая игра бесплатно." },
    { property: "og:title", content: "Мини-игра «Раппóрт» про отношения онлайн" },
    { property: "og:description", content: "6 этапов, карточки по очереди, один телефон на компанию. Первая игра бесплатно." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: PlayPage,
});

function PlayPage() {
  return <section className="min-h-[70svh]"><div className="section-inner py-14 md:py-20">
    <p className="eyebrow">Мини-игра онлайн</p>
    <h1 className="mt-4 mb-10 max-w-3xl font-display text-5xl leading-none md:text-7xl">Мини-игра «Раппóрт» про отношения</h1>
    <div className="mb-12 grid gap-4 md:grid-cols-3">
      <div className="border border-border bg-card p-6"><p className="eyebrow">Первая игра</p><p className="mt-3 font-display text-5xl">0 ₽</p><p className="mt-2 text-sm text-muted-foreground">Бесплатно для каждого аккаунта — без карты.</p></div>
      <div className="border border-primary bg-card p-6"><p className="eyebrow">Каждая следующая</p><p className="mt-3 font-display text-5xl text-primary">{MINIGAME_PRICE} ₽</p><p className="mt-2 text-sm text-muted-foreground">За одну игру для всей компании, сколько бы вас ни было.</p></div>
      <div className="border border-border bg-card p-6"><p className="eyebrow">Как оплатить</p><ul className="mt-3 space-y-1 text-sm text-muted-foreground"><li>Картой через ЮKassa</li><li>Игра открывается сразу после оплаты</li><li>Оплаченная игра не сгорает</li><li>Чек приходит на почту</li></ul></div>
    </div>
    <QuestGate title="Тренажёр «Раппóрт с друзьями»"><Minigame /></QuestGate>
  </div></section>;
}

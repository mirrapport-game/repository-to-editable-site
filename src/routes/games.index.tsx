import { BeforeAfter, SubscribeBanner } from "@/components/before-after";
import { seoMeta, canonical } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";
import { GameShowcase } from "@/components/game-showcase";
import { GameFitQuiz } from "@/components/game-fit-quiz";
import { FinalCta, PageIntro } from "@/components/content";
import { QuestPractice } from "@/components/quest-practice";
import { useVisitMode } from "@/lib/visit-mode";

export const Route = createFileRoute("/games/")({ head: () => ({ links: canonical("/games"), meta: [...seoMeta("/games"), 
  { title: "Каталог игр — Раппорт | Психологические игры для пар" },
  { name: "description", content: "Каталог психологических трансформационных игр «Раппóрт»: игра про отношения, женская игра «Живая», Beauty и игры для компании и сплочения коллектива." },
  { property: "og:title", content: "Все игры серии «Раппóрт»" }, { property: "og:description", content: "Интерактивная витрина психологических игр для разных сфер жизни." },
  { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
] }), component: GamesPage });
function GamesPage(){if(useVisitMode().mode==="quest")return <QuestPractice/>;return <><PageIntro eyebrow="Каталог" title="Одна серия. Разные сферы жизни." text="Отношения, внутренний ресурс, сервис и команда — выберите коробку и узнайте, какой формат подходит вам."/><section className="section overflow-hidden bg-secondary"><div className="section-inner"><GameShowcase /></div></section><SubscribeBanner kind="tg"/><GameFitQuiz/><SubscribeBanner kind="max"/><BeforeAfter/><SubscribeBanner kind="blog"/><FinalCta channel/></>}

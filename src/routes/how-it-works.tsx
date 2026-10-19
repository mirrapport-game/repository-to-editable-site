import { seoMeta, canonical } from "@/lib/seo";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, PlayCircle } from "lucide-react";
import { QuestGameSteps } from "@/components/quest-game-steps";
import { useVisitMode } from "@/lib/visit-mode";
import { PageIntro, ProcessGallery } from "@/components/content";
import { Button } from "@/components/ui/button";
import { processPhotos } from "@/data/site";

// Вставьте ссылку на видео о процессе игры (файл .mp4 или ссылку для встраивания).
const PROCESS_VIDEO_URL: string = "";

const steps = [
  ["01", "Знакомство", "Ведущий объясняет цель, правила конфиденциальности и создаёт пространство без оценок. Участники садятся за стол и получают карточки персонажей — мужские и женские."],
  ["02", "Игровая ситуация", "На столе — ситуация из жизни пары: знакомство, первое свидание, быт, ссора. Каждый отвечает не от себя, а от лица своего персонажа."],
  ["03", "Наблюдение", "Другие участники видят, как персонаж реагирует, и узнают в нём себя. Привычный сценарий становится заметен со стороны."],
  ["04", "Обратная связь", "Ведущий задаёт вопросы, а участники дают обратную связь персонажу — не человеку. Поэтому говорить честно легко и безопасно."],
  ["05", "Новый выбор", "Персонаж пробует другой ход в той же ситуации. Участник забирает с игры новую модель разговора в свои отношения."],
] as const;

export const Route = createFileRoute("/how-it-works")({
  head: () => ({ links: canonical("/how-it-works"), meta: [...seoMeta("/how-it-works"), { title: "Как проходит психологическая трансформационная игра «Раппóрт»" }, { name: "description", content: "Как проходит игра на примере «Раппóрт про отношения»: знакомство, игровая ситуация, наблюдение, обратная связь и новый выбор." }, { property: "og:title", content: "Как проходит игра «Раппóрт»" }, { property: "og:description", content: "Пять этапов игры на примере «Раппóрт про отношения» — с видео." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: Page,
});

function Page() {
  const quest = useVisitMode().mode === "quest";
  if (quest) return <QuestGameSteps />;
  const isFile = /\.(mp4|webm|mov)(\?|$)/i.test(PROCESS_VIDEO_URL);
  return <>
    <PageIntro eyebrow="Процесс" title="Как проходит игра «Раппóрт про отношения»" text="Игра длится около трёх часов. Ведущий держит структуру, а участники играют персонажей и через них исследуют свои реакции — без советов и оценок." />
    <section className="section"><div className="section-inner">
      <div className="aspect-video w-full overflow-hidden rounded-xl border border-border bg-muted">
        {!PROCESS_VIDEO_URL ? <div className="flex h-full flex-col items-center justify-center gap-3 text-muted-foreground"><PlayCircle className="size-14 text-primary" /><p>Видео о том, как проходит игра, скоро появится</p></div>
          : isFile ? <video src={PROCESS_VIDEO_URL} controls preload="metadata" className="h-full w-full" />
          : <iframe src={PROCESS_VIDEO_URL} title="Как проходит игра" allow="autoplay; encrypted-media; fullscreen" allowFullScreen className="h-full w-full" />}
      </div>
    </div></section>
    <section className="section border-t border-border"><div className="mx-auto max-w-4xl px-5">{steps.map(([n, t, d]) => <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-6 border-t border-border py-9 md:gap-12" key={n}><span className="font-display text-4xl text-primary">{n}</span><div><h2 className="font-display text-4xl">{t}</h2><p className="mt-3 max-w-2xl leading-7 text-muted-foreground">{d}</p></div></div>)}</div></section>
    <section className="section"><div className="section-inner"><ProcessGallery photos={processPhotos.slice(0, 2)} /></div></section>
    <section className="section border-t border-border"><div className="section-inner text-center">
      <p className="eyebrow">Продолжение</p><h2 className="section-title">Выберите свою игру</h2>
      <Button asChild size="lg" className="mt-8"><Link to="/games">Выбрать игру <ArrowRight /></Link></Button>
    </div></section>
  </>;
}

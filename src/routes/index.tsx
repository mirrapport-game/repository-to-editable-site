import { seoMeta, canonical } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { ArrowRight, CalendarDays } from "lucide-react";
import { openBookingWidget } from "@/components/booking-format";
import { Button } from "@/components/ui/button";
import { AuthorSection } from "@/components/author-section";
import { HomeFaq, QuestFinalCta } from "@/components/home-faq";
import { NextSteps } from "@/components/next-steps";
import { AchievementStats, ReviewWall, HowTimeline } from "@/components/trust-blocks";
import { PageMotion } from "@/components/motion";
import { BentoFacts } from "@/components/bento-facts";
import { GameShowcase } from "@/components/game-showcase";
import { AudienceSegments } from "@/components/audience-segments";
import { HeroCards } from "@/components/hero-cards";
import { CaseTrainer } from "@/components/case-trainer";
import { HeroRotator } from "@/components/hero-rotator";
import { BookingBand } from "@/components/booking-band";
import { MarathonSchedule } from "@/components/marathon-schedule";
import { VideoCarousel } from "@/components/video-carousel";

const HERO_FACTS = ["20 городов и 3 страны", "5000+ участников", "28 ведущих", "Раппóрт — Отношения", "Раппóрт — Живая", "Раппóрт Beauty", "Раппóрт Бизнес", "4 формата: онлайн, офлайн, индивидуально, для группы", "Играете за персонажа", "Обратная связь без осуждения", "Автор — Артём Ефимов", "Участие от 1 500 ₽"];

export const Route = createFileRoute("/")({
  head: () => ({ links: canonical("/"), meta: [...seoMeta("/"),
    { title: "Раппорт — психологические игры для пар, женщин и команд" },
    { name: "description", content: "«Раппóрт» — серия психологических трансформационных игр про отношения. Игра для пар, для компании и для себя: онлайн и офлайн, с ведущими в вашем городе." },
    { property: "og:title", content: "Раппóрт — психологические и трансформационные игры про отношения" },
    { property: "og:description", content: "Игры для глубоких разговоров, развития и гармоничных отношений." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
    { property: "og:image", content: "https://rapportgame.ru/og-rapport.jpg" }, { name: "twitter:image", content: "https://rapportgame.ru/og-rapport.jpg" },
  ] }),
  component: Index,
});

function Index() {
    return <>
    <PageMotion />
    <section className="relative overflow-hidden bg-foreground text-background">
      <div className="absolute inset-0 bg-hero-glow" />
      <div className="relative mx-auto flex min-h-[calc(100svh-12rem)] max-w-7xl items-end px-5 pb-8 pt-6 sm:pb-12 sm:pt-16 lg:items-center lg:pt-10 lg:px-8 lg:pb-24">
        <div className="grid w-full items-end gap-5 sm:gap-10 lg:grid-cols-[1fr_1.1fr]">
          <div className="lg:self-start lg:pt-[6vh]">
            <HeroRotator />
            <p className="mt-4 max-w-xl text-base leading-7 text-background sm:mt-6 sm:text-lg sm:leading-8">«Раппóрт» — серия игр Артёма Ефимова. Вы проживаете жизненную ситуацию за персонажа, получаете обратную связь без осуждения и пробуете новые способы слышать друг друга.</p>
          </div>
          <HeroCards />
        </div>
      </div>
      <div className="relative overflow-hidden border-t border-background/20 bg-primary py-3 text-primary-foreground" aria-label="Ключевые факты">
        <div className="marquee-track">{[0, 1].map((k) => <div key={k} aria-hidden={k === 1} className="flex shrink-0">{HERO_FACTS.map((f) => <span key={f} className="whitespace-nowrap px-6 text-sm font-medium uppercase tracking-widest">{f} <span className="ml-6">✦</span></span>)}</div>)}</div>
      </div>
    </section>
    <section className="home-about section border-b border-border"><div className="section-inner grid gap-10 lg:grid-cols-2">
      <div><p className="eyebrow">Что такое Раппóрт</p><h2 className="section-title">Контакт, в котором <em>вас слышат</em></h2></div>
      <div className="space-y-5 text-lg leading-8 text-muted-foreground">
        <p>Раппорт — это доверительный контакт и взаимопонимание между людьми: состояние, когда вы чувствуете, что вас слушают, понимают и принимают всерьёз.</p>
        <p>Слово пришло из французского: <span lang="fr" className="font-medium text-foreground">rapport</span> означает «связь», «отношение». В общении так называют отношения доверия и согласованности — то самое ощущение «мы на одной волне».</p>
        <p>«Раппóрт» — серия психологических игр Артёма Ефимова про отношения с собой, партнёром и командой. Вы проживаете жизненную ситуацию за персонажа, получаете обратную связь без осуждения и пробуете новые способы слышать друг друга, говорить о важном и договариваться.</p>
      </div>
    </div></section>
    <section className="section overflow-hidden bg-secondary"><div className="section-inner"><div className="grid gap-6 lg:grid-cols-[1fr_22rem] lg:items-end"><div><p className="eyebrow">Линейка «Раппóрт»</p><h2 className="section-title">Одна игра —<br /><em>и вы узнаете о себе больше, чем за год</em></h2></div><p className="max-w-sm text-muted-foreground">Поверните витрину и нажмите на коробку, чтобы открыть страницу игры.</p></div><GameShowcase /></div></section>
    <BookingBand title="Выбрали игру?" text="Оставьте заявку — подберём ближайшую дату, формат и ведущего." />
    <section id="schedule" className="home-schedule section border-b border-border"><div className="section-inner"><p className="eyebrow">Ближайшие встречи</p><h2 className="section-title">Расписание игр</h2><div className="mt-8"><MarathonSchedule homepage /></div></div></section>
    <AudienceSegments />
    <section id="rapport-trainer" className="home-trainer section"><div className="section-inner"><p className="eyebrow">Практика общения</p><h2 className="section-title">Как настроить раппорт</h2><p className="mt-5 mb-8 max-w-2xl text-lg">Выберите ответ, который помогает услышать собеседника и сохранить контакт.</p><CaseTrainer kind="rapport" /></div></section>
    <BookingBand title="Узнали себя?" text="Индивидуально — от 5 000 ₽, для компании — от 50 000 ₽, в группе — от 1 500 ₽." />
    <section className="section bg-secondary"><div className="section-inner"><div className="text-center"><p className="eyebrow">Как это работает</p><h2 className="section-title mx-auto max-w-3xl">Разговор становится <em>опытом</em></h2></div><HowTimeline /><div className="mt-16 flex flex-wrap justify-center gap-3"><Button className="px-8" onClick={openBookingWidget}><CalendarDays /> Записаться на игру</Button><Button asChild variant="outline" className="px-8"><Link to="/how-it-works">Как проходит игра <ArrowRight /></Link></Button></div></div></section>
    <BentoFacts />
    <AchievementStats />
    <ReviewWall />
    <section className="section"><div className="section-inner"><VideoCarousel eyebrow="Видео" heading="Артём Ефимов об игре «Раппóрт»" poster="/video/artem-poster.jpg" videos={[{ src: "/video/artem-ob-igre.mp4", title: "Артём Ефимов об игре «Раппóрт»" }]} /></div></section>
    <BookingBand title="Хотите так же?" text="Запишитесь на ближайшую игру онлайн или в вашем городе." />
    <AuthorSection />
    <HomeFaq />
    <NextSteps />
    <QuestFinalCta />
  </>;
}

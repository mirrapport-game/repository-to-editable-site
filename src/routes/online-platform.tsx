import { seoMeta, canonical } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Check, ExternalLink, MonitorPlay } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { audiencePaths, platformBenefits, playPasses, POLEGAME_CALENDAR_URL, POLEGAME_URL } from "@/data/online-platform";

export const Route = createFileRoute("/online-platform")({
  head: () => ({ links: canonical("/online-platform"), meta: [...seoMeta("/online-platform"), 
    { title: "Онлайн-платформа игр «Раппóрт» — вести и участвовать" },
    { name: "description", content: "Проводите игры «Раппóрт» онлайн, находите ведущих и ближайшие встречи или купите доступ, чтобы провести 1, 3 или 5 игр самостоятельно." },
    { property: "og:title", content: "Онлайн-платформа игр «Раппóрт»" },
    { property: "og:description", content: "Онлайн-игры для ведущих и участников: календарь, свободные места и доступ на 1, 3 или 5 самостоятельных игр." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: OnlinePlatformPage,
});

function RolePath({ role }: { role: keyof typeof audiencePaths }) {
  const content = audiencePaths[role];
  return <div className="grid gap-10 pt-10 lg:grid-cols-[.78fr_1.22fr] lg:gap-16">
    <div>
      <p className="eyebrow">{content.eyebrow}</p>
      <h2 className="mt-4 font-display text-5xl leading-none md:text-7xl">{content.title}</h2>
      <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">{content.text}</p>
    </div>
    <div className="border-y border-border">
      {content.steps.map(({ Icon, title, text }, index) => <div key={title} className="grid grid-cols-[3rem_1fr] gap-5 border-b border-border py-7 last:border-b-0 sm:grid-cols-[3rem_3rem_1fr]">
        <span className="text-sm text-primary">0{index + 1}</span>
        <Icon className="hidden size-6 text-primary sm:block" aria-hidden="true" />
        <div><h3 className="font-display text-3xl">{title}</h3><p className="mt-2 leading-7 text-muted-foreground">{text}</p></div>
      </div>)}
    </div>
  </div>;
}

function OnlinePlatformPage() {
  return <>
    <section className="facilitator-hero overflow-hidden">
      <div className="section-inner grid min-h-[42rem] items-end gap-12 py-16 lg:grid-cols-[1.08fr_.92fr]">
        <div>
          <p className="eyebrow text-accent">Онлайн-платформа «Раппóрт»</p>
          <h1 className="mt-5 max-w-5xl font-display text-6xl leading-[.94] sm:text-7xl lg:text-[5.5rem]">Игровой стол, который <em className="text-accent">всегда рядом</em></h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-background/75">Ведущие проводят свои игры онлайн, а участники находят встречи, видят свободные места и присоединяются из любого города.</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button asChild size="lg"><a href={POLEGAME_URL} target="_blank" rel="noreferrer">Открыть платформу <ExternalLink /></a></Button>
            <Button asChild size="lg" variant="outline" className="border-background/35 bg-transparent text-background hover:bg-background hover:text-foreground"><a href={POLEGAME_CALENDAR_URL} target="_blank" rel="noreferrer">Смотреть календарь</a></Button>
          </div>
        </div>
        <div className="border-l border-background/20 pl-7">
          <MonitorPlay className="size-9 text-accent" aria-hidden="true" />
          <p className="mt-6 font-display text-3xl italic text-background/90">Один кабинет для ведущего, одна ссылка для участников и живой разговор — независимо от расстояния.</p>
        </div>
      </div>
    </section>

    <section className="section bg-secondary"><div className="section-inner">
      <p className="eyebrow">Возможности</p>
      <h2 className="section-title max-w-4xl">Всё важное для <em>онлайн-игры</em></h2>
      <div className="mt-14 grid gap-px bg-border md:grid-cols-3">{platformBenefits.map(({ Icon, title, text }) => <div key={title} className="bg-secondary p-7 md:p-9"><Icon className="size-7 text-primary" aria-hidden="true"/><h3 className="mt-10 font-display text-3xl">{title}</h3><p className="mt-3 leading-7 text-muted-foreground">{text}</p></div>)}</div>
    </div></section>

    <section className="section"><div className="section-inner">
      <Tabs defaultValue="facilitator">
        <TabsList className="h-auto w-full justify-start gap-1 rounded-none border-b border-border bg-transparent p-0">
          <TabsTrigger value="facilitator" className="h-12 flex-1 rounded-none border-b-2 border-transparent text-base shadow-none data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none sm:flex-none sm:px-8">Я ведущий</TabsTrigger>
          <TabsTrigger value="participant" className="h-12 flex-1 rounded-none border-b-2 border-transparent text-base shadow-none data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none sm:flex-none sm:px-8">Я участник</TabsTrigger>
        </TabsList>
        <TabsContent value="facilitator"><RolePath role="facilitator" /></TabsContent>
        <TabsContent value="participant"><RolePath role="participant" /></TabsContent>
      </Tabs>
    </div></section>

    <section className="section bg-foreground text-background"><div className="section-inner">
      <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
        <div><p className="eyebrow text-accent">Провести самому</p><h2 className="mt-4 font-display text-5xl leading-none md:text-7xl">Выберите свой ритм</h2></div>
        <p className="max-w-2xl text-lg leading-8 text-background/70">Не обязательно становиться профессиональным ведущим. Купите доступ на 1, 3 или 5 игр и проведите «Раппóрт» для друзей, пары, семьи или своей команды.</p>
      </div>
      <div className="mt-12 grid gap-px bg-background/20 md:grid-cols-3">{playPasses.map((pass, index) => <article key={pass.games} className="flex min-h-80 flex-col bg-foreground p-7 md:p-9">
        <div className="flex items-start justify-between gap-4"><p className="text-xs font-bold uppercase text-accent">{pass.label}</p><span className="text-sm text-background/45">0{index + 1}</span></div>
        <p className="mt-8 font-display text-7xl text-accent">{pass.games}</p>
        <h3 className="font-display text-3xl">{pass.games === 1 ? "игра" : "игры"}</h3>
        <p className="mt-3 text-background/65">{pass.note}</p>
        <ul className="mt-7 space-y-2 text-sm text-background/75"><li className="flex gap-2"><Check className="mt-0.5 size-4 shrink-0 text-accent"/>Доступ к игровому столу</li><li className="flex gap-2"><Check className="mt-0.5 size-4 shrink-0 text-accent"/>Приглашение для участников</li></ul>
        <Button asChild variant={index === 1 ? "default" : "outline"} className={index === 1 ? "mt-auto" : "mt-auto border-background/35 bg-transparent text-background hover:bg-background hover:text-foreground"}><a href={POLEGAME_URL} target="_blank" rel="noreferrer">Выбрать доступ <ArrowRight /></a></Button>
      </article>)}</div>
      <p className="mt-5 text-sm text-background/50">Стоимость доступа уточняется на платформе перед покупкой.</p>
    </div></section>

    <section className="section"><div className="section-inner text-center"><p className="eyebrow">Начать онлайн</p><h2 className="mx-auto mt-4 max-w-4xl font-display text-5xl leading-none md:text-7xl">Соберите людей вокруг важного разговора</h2><p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">Зарегистрируйтесь на платформе, выберите свою роль и начните с ближайшей игры.</p><Button asChild size="lg" className="mt-9"><a href={POLEGAME_URL} target="_blank" rel="noreferrer">Перейти на Polegame <ExternalLink /></a></Button></div></section>
  </>;
}
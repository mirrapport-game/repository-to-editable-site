import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, CalendarDays, Check, Heart, User, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GameOrderForm } from "@/components/game-order-form";
import { Reveal } from "@/components/business-interactive";
import { PageMotion } from "@/components/motion";
import { GameFacts } from "@/components/game-facts";
import { ZoomImage } from "@/components/zoom-image";
import { seoHead } from "@/lib/seo";
import whatImg from "@/assets/zh-what-happens.webp.asset.json";

// Интенсив «Я живая — Раппорт с собой»: тексты из рабочих тетрадей и методички автора.
const TITLE = "Интенсив «Я живая — Раппорт с собой» — глубокая работа с собой";
const DESC = "Интенсив для женщин: играем себя, находим программу из детства и переписываем её. В группе — 1 день, 9 900 ₽; индивидуально с ведущим — 2 недели, 50 000 ₽.";

export const Route = createFileRoute("/ya-zhivaya")({
  head: () => seoHead({ title: TITLE, description: DESC, path: "/ya-zhivaya", keywords: ["интенсив для женщин", "Я живая", "работа с убеждениями", "психологический тренинг для женщин"] }),
  component: YaZhivaya,
});

const THEMES = [
  ["Любовь и отношения", "Любовь или зависимость?"], ["Я и моя самоценность", "Что такое индивидуация"], ["Я и мои желания", "Что такое проекция"],
  ["Близость", "Открываться в близости"], ["Папа, я взрослая", "Фигура отца и его голос"], ["Мама", "Маски и голос мамы"],
  ["Моя внешность", "Внешность и связь с внешним"], ["Кризис", "Что такое кризис"], ["Я и моё здоровье", "Здоровье как контакт с телом"], ["Сексуальность", "Моя энергия и чувственность"],
];
const STEPS = [
  ["Теория", "Короткое объяснение темы: например, чем любовь отличается от зависимости."],
  ["Сцена на сцене", "Первый отыгрыш твоей ситуации — как в жизни."],
  ["Чувства и качества", "Находишь, что откликается в теле и какого качества не хватает."],
  ["Проживание качества", "Второй отыгрыш — проживаешь это качество."],
  ["Программа", "Находишь убеждение, которое когда-то помогало выжить, а сейчас мешает."],
  ["Перепиши программу", "Создаёшь свою новую фразу."],
  ["Новый способ", "Третий отыгрыш — играешь сцену уже по-новому."],
  ["Навык в жизнь", "Забираешь конкретный навык и домашнее задание."],
];
const PROGRAMS = [
  ["«Любовь нужно заслужить»", "Я стараюсь быть «достаточно хорошей»"],
  ["«Если меня не выбирают — я плохая»", "Я боюсь отвержения"],
  ["«Я должна быть удобной, чтобы меня любили»", "Я не говорю о своих потребностях"],
  ["«Любовь — это страдание»", "Я терплю то, что терпеть нельзя"],
  ["«Без тебя я никто»", "Я теряю себя в отношениях"],
];
const SHIFT = [["«Я не могу без тебя»", "«Я выбираю быть с тобой»"], ["«Ты делаешь меня целой»", "«Я целая. И я выбираю быть с тобой»"], ["«Я боюсь, что ты уйдёшь»", "«Я хочу, чтобы ты был счастлив»"]];

function YaZhivaya() {
  const [flip, setFlip] = useState<number[]>([]);
  return <main>
    <PageMotion />
    <section className="relative overflow-hidden bg-foreground text-background">
      <div data-parallax className="absolute inset-0 bg-hero-glow will-change-transform" />
      <div className="relative mx-auto max-w-5xl px-5 pb-20 pt-8 text-center lg:px-8">
        <Link to="/games/$slug" params={{ slug: "zhivaya" }} className="inline-flex items-center gap-2 text-sm text-background/80 hover:text-accent"><ArrowLeft className="size-4" />Игра «Раппóрт — Живая»</Link>
        <p className="eyebrow mt-10 text-accent">Интенсив для женщин</p>
        <h1 className="mt-4 font-display text-5xl leading-[0.98] sm:text-7xl">Я <em className="text-accent">живая</em></h1>
        <p className="mt-3 font-display text-2xl italic text-background/85">Раппорт с собой</p>
        <p className="mx-auto mt-6 max-w-2xl text-xl leading-8 text-background/90">В игре ты играешь персонажа. Здесь — <strong>играешь саму себя</strong>: разбираешь свою ситуацию, находишь программу и переписываешь убеждение.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg"><a href="#ya-order"><CalendarDays />Записаться на интенсив</a></Button>
          <Button asChild size="lg" variant="secondary"><a href="#formats">Группа или индивидуально</a></Button>
        </div>
      </div>
    </section>

    <section className="section">
      <div className="section-inner grid gap-6 md:grid-cols-2">
        <Reveal><div className="card-lift h-full rounded-3xl bg-secondary p-8"><p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Игра «Живая»</p><h2 className="mt-3 font-display text-3xl">Знакомство с персонажами</h2><p className="mt-3 text-muted-foreground">Играем роли, которые не проживаем в жизни, знакомимся с их тенями и забираем ресурс. Без личного разбора.</p></div></Reveal>
        <Reveal delay={150}><div className="card-lift h-full rounded-3xl bg-primary p-8 text-primary-foreground"><p className="text-sm font-bold uppercase tracking-widest">Интенсив «Я живая»</p><h2 className="mt-3 font-display text-3xl">Глубина и личная история</h2><p className="mt-3 text-primary-foreground/90">Играем самих себя. Разбираем твои программы. Переписываем твои убеждения. Корень, тень, новая фраза, проживание.</p></div></Reveal>
      </div>
    </section>

    <section className="section bg-secondary">
      <div className="section-inner">
        <p className="eyebrow">Темы интенсивов</p>
        <h2 className="section-title">Одна сфера — <em>в глубину</em></h2>
        <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-5">
          {THEMES.map(([t, d], i) => <Reveal key={t} delay={i * 50}><div className="card-lift h-full rounded-2xl bg-card p-5"><Heart className="size-5 text-primary" /><p className="mt-3 font-display text-lg leading-tight">{t}</p><p className="mt-1 text-sm text-muted-foreground">{d}</p></div></Reveal>)}
        </div>
      </div>
    </section>

    <section className="section">
      <div className="section-inner">
        <p className="eyebrow">Как проходит интенсив</p>
        <h2 className="section-title">8 шагов <em>от автомата к выбору</em></h2>
        <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(([t, d], i) => <Reveal key={t} delay={i * 70}><li className="card-lift h-full rounded-3xl border border-border bg-card p-6"><span className="font-display text-4xl text-primary">{i + 1}</span><h3 className="mt-3 font-display text-2xl">{t}</h3><p className="mt-2 text-muted-foreground">{d}</p></li></Reveal>)}
        </ol>
        <Reveal className="mt-10"><ZoomImage src={whatImg.url} alt="Что происходит на игре и интенсиве" className="mx-auto max-w-3xl shadow-lg" /></Reveal>
      </div>
    </section>

    <section className="section bg-foreground text-background">
      <div className="section-inner grid gap-12 lg:grid-cols-2">
        <div>
          <p className="eyebrow text-accent">Пример: тема «Любовь»</p>
          <h2 className="section-title">Узнаёшь <em className="text-accent">свою программу?</em></h2>
          <p className="mt-4 text-background/85">Программа — это убеждение, которое я создала в детстве, чтобы выжить. Когда-то оно помогало. Сейчас мешает.</p>
          <ul className="mt-8 grid gap-3">{PROGRAMS.map(([p, h]) => <li key={p} className="rounded-2xl border border-background/20 p-4"><p className="font-display text-xl text-accent">{p}</p><p className="text-background/85">{h}</p></li>)}</ul>
        </div>
        <div>
          <p className="eyebrow text-accent">Перепиши программу</p>
          <h2 className="section-title">Зависимость → <em className="text-accent">любовь</em></h2>
          <p className="mt-4 text-background/85">«Любовь — это активная забота о жизни и развитии того, что мы любим» (Эрих Фромм). Нажми на фразу:</p>
          <div className="mt-8 grid gap-3">
            {SHIFT.map(([a, b], i) => { const on = flip.includes(i); return <button key={a} type="button" aria-pressed={on} onClick={() => setFlip(on ? flip.filter((x) => x !== i) : [...flip, i])} className={`rounded-2xl p-5 text-left font-display text-xl transition-all duration-500 ${on ? "bg-accent text-accent-foreground" : "bg-background/10 text-background/80 hover:bg-background/20"}`}>{on ? b : a}</button>; })}
          </div>
          <p className="mt-6 font-display text-2xl italic">«С тобой мне легче дышать. Но я могу дышать и одна».</p>
        </div>
      </div>
    </section>

    <section id="formats" className="section">
      <div className="section-inner">
        <p className="eyebrow">Форматы</p>
        <h2 className="section-title">В группе <em>или лично с ведущим</em></h2>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <Reveal><div className="card-lift flex h-full flex-col rounded-3xl border border-border bg-card p-8 shadow-sm">
            <Users className="size-8 text-primary" /><h3 className="mt-4 font-display text-3xl">Интенсив в группе</h3>
            <p className="mt-2 font-display text-4xl text-primary">9 900 ₽</p><p className="text-muted-foreground">1 день · 6–8 часов</p>
            <ul className="mt-6 space-y-2">{["Глубокая проработка одной сферы", "Теория + отыгрыши + разбор + интеграция", "Новая фраза и навык в жизнь", "Домашнее задание", "Поддержка круга и разные взгляды"].map((x) => <li key={x} className="flex gap-2"><Check className="mt-1 size-4 shrink-0 text-primary" />{x}</li>)}</ul>
          </div></Reveal>
          <Reveal delay={150}><div className="card-lift flex h-full flex-col rounded-3xl bg-primary p-8 text-primary-foreground shadow-lg">
            <User className="size-8" /><h3 className="mt-4 font-display text-3xl">Индивидуально с ведущим</h3>
            <p className="mt-2 font-display text-4xl">50 000 ₽</p><p className="text-primary-foreground/85">2 недели · 3–4 встречи онлайн или офлайн</p>
            <ul className="mt-6 space-y-2">{["Разбор твоей программы", "2–3 личные сессии", "Домашние задания и поддержка в чате", "Интеграция в жизнь", "Можно разобрать несколько сфер"].map((x) => <li key={x} className="flex gap-2"><Check className="mt-1 size-4 shrink-0" />{x}</li>)}</ul>
            <p className="mt-6 text-primary-foreground/90">Ведущий держит за руку 2 недели — результат быстрее.</p>
          </div></Reveal>
        </div>
        <p className="mt-8 text-center text-muted-foreground">Ещё не играла? Начни с <Link to="/demo" className="font-semibold text-primary underline">бесплатной демо-игры</Link> или <Link to="/games/$slug" params={{ slug: "zhivaya" }} className="font-semibold text-primary underline">игры «Живая»</Link>.</p>
      </div>
    </section>

    <section id="ya-order" className="game-story-booking"><div className="section-inner"><p className="eyebrow">Запись на интенсив</p><h2>Ты больше,<br />чем думаешь</h2><p>Напиши, какая сфера откликается, и выбери формат — в группе или индивидуально.</p><GameOrderForm gameTitle="Интенсив «Я живая»" /></div></section>
    <GameFacts />
  </main>;
}

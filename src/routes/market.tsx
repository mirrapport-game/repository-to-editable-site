import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Brain, GraduationCap, Heart, Sparkles, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/business-interactive";
import { CountUp, PageMotion } from "@/components/motion";
import { seoHead } from "@/lib/seo";

// Рыночное предложение для инвесторов. Цифры — из исследования FranchFamily «Анализ рынка Dating», презентации Life Style Group и питча «Раппорт Отношения». Страница не индексируется.
const TITLE = "Раппорт Групп — одна экосистема вместо трёх рынков";
const DESC = "Как «Раппóрт» объединяет рынки знакомств, психологии и обучения отношениям: цифры, сравнение и путь клиента.";

export const Route = createFileRoute("/market")({
  head: () => {
    const h = seoHead({ title: TITLE, description: DESC, path: "/market" });
    return { ...h, meta: [...(h.meta ?? []), { name: "robots", content: "noindex, nofollow" }] };
  },
  component: Market,
});

const PAIN = [["60", "%", "людей в мире — одиноки"], ["90", "%", "союзов нуждаются в укреплении и развитии"], ["15", "%", "— результативность самостоятельного поиска в приложениях"], ["78", "%", "пользователей Tinder жалуются на токсичность"]];

const SEARCH = [["«знакомства»", 12.7, "12,7 млн"], ["«психолог»", 1.8, "1,8 млн"], ["«брачное агентство»", 0.08, "78 тыс."]];

const MARKETS = [
  { icon: Heart, name: "Знакомства", tam: "28,1 млрд ₽", note: "Онлайн-знакомства в России; в мире ~$10 млрд", grow: "+13,5% спроса за год" },
  { icon: Brain, name: "Психология", tam: "206 млрд ₽", note: "Рынок психологических услуг, SAM 92,7 млрд ₽", grow: "+10,2% спроса за год" },
  { icon: GraduationCap, name: "Обучение отношениям", tam: "100 млрд ₽", note: "Онлайн-обучение в мире ~$20 млрд", grow: "+20–25% в год в России" },
  { icon: Sparkles, name: "Саморазвитие и эзотерика", tam: "112 млрд ₽", note: "SAM 73 млрд ₽ — люди ищут смысл и опору", grow: "Устойчивый спрос" },
];

const COMPARE = {
  dating: { label: "Сайт знакомств", them: ["Анкеты и пустые переписки", "Фейки, скамеры, токсичность", "Совместимость видна только через месяцы", "Около 15% доходят до отношений"], us: ["Знакомство через игру за персонажа", "Живые люди и ведущий рядом", "Совместимость видна за один вечер", "Клуб: контакты открываются при совпадении ответов"] },
  psy: { label: "Психолог", them: ["Дорого и долго: месяцы встреч", "89% пар приходят только в кризис", "Страшно говорить о себе", "Один специалист — один клиент"], us: ["Участие от 1 500 ₽ за вечер", "Профилактика до кризиса", "Говорите за персонажа — защита снимается", "Один ведущий — до 10–12 участников"] },
  course: { label: "Онлайн-курс", them: ["Теория без практики", "Досматривают единицы", "Нет живой обратной связи", "Навык не закрепляется"], us: ["Навык тренируется в игре", "Вовлечение и азарт до конца", "Обратная связь получает роль, а не вы", "Тренажёры и Rapport AI между играми"] },
} as const;

const PATH = [["Клуб знакомств", "Человек в поиске приходит на игру и встречает партнёра"], ["Раппóрт — Отношения", "Пара учится договариваться без ссор"], ["Тренинги и «Я живая»", "Глубокая работа с собой — от 15 000 ₽"], ["Академия Раппóрт", "Участник становится ведущим — от 150 000 ₽"], ["Свой клуб", "Ведущий покупает игру — от 75 000 ₽ и приводит новых людей"]];

function Bars() {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => { const el = ref.current; if (!el) return; const io = new IntersectionObserver(([e]) => { if (e?.isIntersecting) { setOn(true); io.disconnect(); } }, { threshold: 0.3 }); io.observe(el); return () => io.disconnect(); }, []);
  return <div ref={ref} className="mt-10 space-y-6">{SEARCH.map(([q, v, l], i) => <div key={q as string}>
    <div className="flex justify-between text-lg"><span>{q}</span><b className="font-display text-2xl text-accent">{l}</b></div>
    <div className="mt-2 h-4 overflow-hidden rounded-full bg-background/10"><div className="h-full rounded-full bg-accent transition-[width] duration-[1600ms] ease-out" style={{ width: on ? `${Math.max(1.5, ((v as number) / 12.7) * 100)}%` : "0%", transitionDelay: `${i * 200}ms` }} /></div>
  </div>)}</div>;
}

function Market() {
  const [tab, setTab] = useState<keyof typeof COMPARE>("dating");
  const c = COMPARE[tab];
  return <main>
    <PageMotion />
    <section className="relative overflow-hidden bg-foreground text-background">
      <div data-parallax className="absolute inset-0 bg-hero-glow will-change-transform" />
      <div className="relative mx-auto max-w-6xl px-5 pb-16 pt-16 lg:px-8 lg:pt-24">
        <p className="eyebrow text-accent">Раппорт Групп · рынок</p>
        <h1 className="mt-4 max-w-4xl font-display text-4xl leading-tight sm:text-6xl">Одна игра вместо <em className="text-accent">трёх рынков</em>: знакомства, психология, обучение</h1>
        <p className="mt-6 max-w-2xl text-lg text-background/85">Люди ищут партнёра в приложениях, спасают отношения у психолога и учатся на курсах. «Раппóрт» закрывает все три потребности в одном живом опыте — и зарабатывает на каждом шаге.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button size="lg" asChild><Link to="/investors">Инвестиционное предложение <ArrowRight /></Link></Button>
        </div>
        <div className="mt-14 grid grid-cols-2 gap-6 border-t border-background/20 pt-8 sm:grid-cols-4">
          {[["446", " млрд ₽", "суммарный объём рынков"], ["5000+", "", "участников уже сыграли"], ["28", "", "ведущих"], ["20", "", "городов"]].map(([v, s, l]) => <div key={l}><p className="font-display text-4xl text-accent sm:text-5xl"><CountUp value={v!} />{s}</p><p className="mt-1 text-sm text-background/80">{l}</p></div>)}
        </div>
      </div>
    </section>

    <section className="section"><div className="section-inner">
      <p className="eyebrow">Боль рынка</p>
      <h2 className="section-title">Спрос огромный, <em>решения — нет</em></h2>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{PAIN.map(([v, s, l], i) => <Reveal key={l} delay={i * 100}><div className="card-lift h-full rounded-3xl border border-border bg-card p-7"><p className="font-display text-5xl text-primary"><CountUp value={v!} />{s}</p><p className="mt-3 text-muted-foreground">{l}</p></div></Reveal>)}</div>
    </div></section>

    <section className="section bg-foreground text-background"><div className="section-inner max-w-4xl">
      <p className="eyebrow text-accent">Запросы в Яндексе в месяц</p>
      <h2 className="section-title">Знакомства ищут <em className="text-accent">в 7 раз чаще</em>, чем психолога</h2>
      <Bars />
      <p className="mt-8 text-lg text-background/85">Интерес огромный, но в агентства доходят единицы — весь трафик забирают приложения, которые не дают глубины. Это наше окно.</p>
    </div></section>

    <section className="section"><div className="section-inner">
      <p className="eyebrow">Четыре рынка — одна экосистема</p>
      <h2 className="section-title">Где <em>мы зарабатываем</em></h2>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{MARKETS.map((m, i) => <Reveal key={m.name} delay={i * 100}><div className="card-lift h-full rounded-3xl bg-secondary p-7"><m.icon className="size-9 text-primary" /><h3 className="mt-4 font-display text-2xl">{m.name}</h3><p className="mt-3 font-display text-4xl text-primary">{m.tam}</p><p className="mt-2 text-muted-foreground">{m.note}</p><p className="mt-4 inline-block rounded-full bg-primary px-3 py-1 text-sm text-primary-foreground">{m.grow}</p></div></Reveal>)}</div>
      <p className="mt-6 text-sm text-muted-foreground">Объёмы рынков России (TAM) — из питча «Раппорт Отношения»; динамика спроса — Яндекс Wordstat; мировые оценки — FranchFamily, Statista.</p>
    </div></section>

    <section className="section bg-secondary"><div className="section-inner">
      <p className="eyebrow">Что мы заменяем</p>
      <h2 className="section-title">Было — <em>стало</em></h2>
      <div className="mt-8 inline-flex flex-wrap rounded-full border border-border bg-card p-1">{(Object.keys(COMPARE) as (keyof typeof COMPARE)[]).map((k) => <button key={k} type="button" onClick={() => setTab(k)} className={`rounded-full px-5 py-2 text-sm transition-all duration-300 ${tab === k ? "bg-primary text-primary-foreground shadow-md" : "hover:bg-secondary"}`}>{COMPARE[k].label}</button>)}</div>
      <div key={tab} className="mt-8 grid gap-5 animate-in fade-in slide-in-from-bottom-3 duration-500 md:grid-cols-2">
        <div className="rounded-3xl border border-border bg-card p-8"><p className="eyebrow">{c.label}</p><ul className="mt-4 space-y-3 text-lg text-muted-foreground">{c.them.map((x) => <li key={x}>✕ {x}</li>)}</ul></div>
        <div className="card-lift rounded-3xl bg-primary p-8 text-primary-foreground"><p className="eyebrow text-primary-foreground">Раппóрт</p><ul className="mt-4 space-y-3 text-lg">{c.us.map((x) => <li key={x}>✓ {x}</li>)}</ul></div>
      </div>
    </div></section>

    <section className="section"><div className="section-inner">
      <p className="eyebrow">Путь клиента</p>
      <h2 className="section-title">Один человек — <em>пять продуктов</em></h2>
      <ol className="relative mt-12 grid gap-5 md:grid-cols-5">
        <div className="absolute left-0 right-0 top-6 hidden h-0.5 bg-border md:block" />
        {PATH.map(([t, d], i) => <Reveal key={t} delay={i * 150}><li className="relative"><span className="relative z-10 flex size-12 items-center justify-center rounded-full bg-primary font-display text-xl text-primary-foreground">{i + 1}</span><h3 className="mt-4 font-display text-xl">{t}</h3><p className="mt-2 text-muted-foreground">{d}</p></li></Reveal>)}
      </ol>
      <p className="mt-10 max-w-3xl text-lg">Приложение знакомств теряет пользователя, когда он нашёл пару. Психолог — когда кризис прошёл. «Раппóрт» остаётся с человеком дальше: от первой встречи до собственного клуба.</p>
    </div></section>

    <section className="section bg-foreground text-background"><div className="section-inner text-center">
      <Users className="mx-auto size-10 text-accent" />
      <h2 className="section-title mx-auto max-w-3xl">Цель — 1 000 000 людей к 2030 году скажут: <em className="text-accent">«Раппóрт изменил наши отношения»</em></h2>
      <p className="mx-auto mt-6 max-w-2xl text-background/85">Сильный я — сильная семья — сильная страна.</p>
      <Button size="lg" className="mt-8" asChild><Link to="/investors">Стать частью проекта <ArrowRight /></Link></Button>
    </div></section>
  </main>;
}

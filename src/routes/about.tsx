import { BeforeAfter, SubscribeBanner } from "@/components/before-after";
import { openBookingWidget } from "@/components/booking-format";
// ============= Full file contents =============

import { seoMeta, canonical } from "@/lib/seo";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, MessageCircle, Sparkles, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { games } from "@/data/site";
import { RussiaMap } from "@/components/russia-map";
import { FocusGroupFeed } from "@/components/focus-group-feed";
import { useVisitMode } from "@/lib/visit-mode";

export const Route = createFileRoute("/about")({
  head: () => ({ links: canonical("/about"), meta: [...seoMeta("/about"), 
    { title: "О проекте «Раппóрт» — игры для глубоких разговоров" },
    { name: "description", content: "Философия проекта «Раппóрт»: психологические игры, которые помогают увидеть свои реакции и строить гармоничные отношения." },
    { property: "og:title", content: "О проекте «Раппóрт»" },
    { property: "og:description", content: "Игры для глубоких разговоров, развития и гармоничных отношений." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: AboutPage,
});

const values = [
  { num: "01", title: "Честность", text: "Без готовых ролей и правильных ответов — только внимательный взгляд на себя." },
  { num: "02", title: "Диалог", text: "Мы учимся говорить, слышать и оставаться в контакте даже в сложном разговоре." },
  { num: "03", title: "Поддержка", text: "Группа становится безопасным пространством для нового опыта и обратной связи." },
];

// Координаты точек подобраны под контур карты (viewBox 0 0 920 330),
// порядок точек соответствует географии: запад → восток, север → юг.
const cities = [
  { name: "Санкт-Петербург", hosts: 5, cx: 150, cy: 125 },
  { name: "Москва", hosts: 4, cx: 228, cy: 162 },
  { name: "Воронеж", hosts: 1, cx: 268, cy: 200 },
  { name: "Краснодар", hosts: 2, cx: 232, cy: 210 },
  { name: "Сочи", hosts: 1, cx: 244, cy: 215 },
  { name: "Самара", hosts: 1, cx: 420, cy: 165 },
  { name: "Архангельск", hosts: 1, cx: 240, cy: 108 },
  { name: "Ленинградская область", hosts: 1, cx: 182, cy: 150 },
  { name: "Московская область", hosts: 1, cx: 262, cy: 184 },
  { name: "Иркутск", hosts: 3, cx: 792, cy: 155 },
  { name: "Красноярск", hosts: 3, cx: 722, cy: 122 },
  { name: "Кемерово", hosts: 1, cx: 682, cy: 130 },
  { name: "Ярославль", hosts: 1, cx: 292, cy: 130 },
  { name: "Нижний Новгород", hosts: 1, cx: 342, cy: 148 },
  { name: "Челябинск", hosts: 2, cx: 500, cy: 128 },
  { name: "Волгоград", hosts: 1, cx: 332, cy: 192 },
  { name: "Новосибирск", hosts: 1, cx: 648, cy: 142 },
  { name: "Донецк", hosts: 1, cx: 146, cy: 205 },
  { name: "Северодвинск", hosts: 1, cx: 268, cy: 100 },
  { name: "Сургут", hosts: 1, cx: 560, cy: 108 },
] as const;

const activeGames = games.filter((game) => !game.comingSoon).slice(0, 4);

function AboutPage() {
  // В квесте страница только знакомит: без ссылок, стрелок и кнопок.
  const quest = useVisitMode().mode === "quest";
  return (
    <div className="bg-sage-bg font-book-body text-sage-ink">
      {/* Бенто-сетка: герой, география-тизер, игры, карта, ценности */}
      <section className="section-inner pt-12 pb-14 md:pt-16">
        <div className="grid auto-rows-[minmax(10rem,auto)] gap-3 md:grid-cols-12">

          {/* Герой — большая плитка */}
          <div className="flex flex-col justify-between gap-8 border border-sage-line bg-white p-7 shadow-sm md:col-span-8 md:row-span-2 md:p-12">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sage">О проекте</p>
              <h1 className="mt-5 font-book text-4xl leading-[1.12] text-sage-ink md:text-6xl">
                Отношения начинаются <em className="text-sage-deep">с умения слышать</em>
              </h1>
            </div>
            <div className="grid gap-8 md:grid-cols-2">
              <p className="max-w-md text-lg leading-8 text-sage-ink/80">
                «Раппóрт» — серия коммуникационных и ролевых игр, в которых знакомые ситуации становятся возможностью увидеть себя со стороны.
              </p>
              <div className="border-l-2 border-sage pl-5">
                <h2 className="font-book text-xl italic text-sage-ink md:text-2xl">Не совет. Личный опыт.</h2>
                <p className="mt-3 text-sm leading-7 text-sage-ink/75">
                  Тренинг даёт информацию и упражнения. Игра создаёт ситуацию, в которой человек сам приходит к выводу. Ведущий задаёт вопросы и помогает заметить ключевой момент.
                </p>
                {!quest && (
                  <Button asChild variant="outline" className="mt-5">
                    <Link to="/how-it-works">Как проходит игра <ArrowRight /></Link>
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Плитка-факт о географии */}
          <div className="flex flex-col justify-center gap-2 bg-sage p-7 text-white md:col-span-4 md:p-8">
            <h2 className="font-book text-2xl">География</h2>
            <p className="text-sm leading-7 text-white/90">
              «Раппóрт» идёт в 20 городах и регионах России — от Санкт-Петербурга до Иркутска. В каждом городе игру ведёт своя команда.
            </p>
            <p className="mt-3 font-book text-3xl leading-none">20 городов · 5000 участников</p>
          </div>

          {/* Плитка-переход к играм */}
          {quest ? (
            <div className="flex flex-col justify-end gap-4 border border-sage-line bg-white p-7 md:col-span-4 md:p-8">
              <h2 className="font-book text-2xl text-sage-ink">Серия игр</h2>
              <p className="text-sm leading-7 text-sage-ink/70">Отношения, Живая, Beauty, Бизнес — у каждой игры своя тема, метод один.</p>
            </div>
          ) : (
          <div className="flex flex-col justify-end gap-4 border border-sage-line bg-white p-7 md:col-span-4 md:p-8">
            <h2 className="font-book text-2xl text-sage-ink">Серия игр</h2>
            <ul className="space-y-2 text-sm">{activeGames.map((g) => <li key={g.slug}><Link to="/games/$slug" params={{ slug: g.slug }} className="text-sage-deep underline underline-offset-4 hover:text-sage">{g.title}</Link></li>)}</ul>
          </div>

          )}

          {/* Карта — широкая тёмная плитка (в квесте скрыта: города кликабельны) */}
          {!quest && <div className="bg-sage-ink p-7 text-white md:col-span-12 md:p-10">
            <div className="grid gap-10 lg:grid-cols-[0.65fr_1.35fr] lg:items-end">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sage">География «Раппóрт»</p>
                <h2 className="mt-4 font-book text-3xl leading-tight md:text-5xl">Игра объединяет города</h2>
                <p className="mt-4 max-w-md text-sm leading-7 text-white/70">
                  Нажмите на город, чтобы познакомиться с его ведущими:
                </p>
                <ul className="mt-5 flex max-w-md flex-wrap gap-2">
                  {cities.map((city) => (
                    <li key={city.name} className="rounded-full border border-white/20 px-3 py-1 text-xs leading-5 text-white/80">
                      {city.name} <span className="font-semibold text-sage">· {city.hosts}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 grid grid-cols-2 gap-6 border-t border-white/15 pt-6">
                  <div><strong className="font-book text-4xl text-sage">20</strong><p className="mt-1 text-sm text-white/65">городов и регионов</p></div>
                  <div><strong className="font-book text-4xl text-sage">5000</strong><p className="mt-1 text-sm text-white/65">участников</p></div>
                </div>
              </div>
              <RussiaMap />
            </div>
          </div>}

          {/* Заголовок ценностей — отдельная плитка */}
          <div className="flex items-center bg-sage-tile p-7 md:col-span-3 md:p-8">
            <h2 className="font-book text-3xl leading-tight text-sage-ink">Три ценности<br />наших игр</h2>
          </div>

          {/* Ценности */}
          {values.map((v) => (
            <div key={v.num} className="flex flex-col justify-between gap-6 border border-sage-line bg-white p-7 md:col-span-3 md:p-8">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-sage">{v.num}</span>
              <div>
                <h3 className="font-book text-xl text-sage-ink underline decoration-sage underline-offset-4">{v.title}</h3>
                <p className="mt-2 text-sm leading-7 text-sage-ink/70">{v.text}</p>
              </div>
            </div>
          ))}

          {/* Формат */}
          <div className="flex items-center bg-sage-tile px-7 py-5 md:col-span-12 md:px-8">
            <h2 className="font-book text-3xl leading-tight text-sage-ink">Формат</h2>
          </div>

          <div className="flex flex-wrap gap-2 border border-sage-line bg-white p-7 md:col-span-12 md:p-8">
            {["Онлайн", "Офлайн", "Парная", "Семейная", "Групповая", "Индивидуальная"].map((f) => (
              <span key={f} className="rounded-full border border-sage-line px-4 py-2 text-sm font-semibold uppercase tracking-[0.12em] text-sage-deep">{f}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Лента заявок фокус-группы */}
      {!quest && <FocusGroupFeed />}

      {/* Сообщество — финальная тёмная плитка */}
      <section className="section-inner pt-2 pb-14">
        <div className="bg-sage-ink p-8 text-white md:p-12">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sage">Проект растёт вместе с людьми</p>
              <h2 className="mt-4 font-book text-3xl leading-tight md:text-5xl">От первой встречи — к своему сообществу</h2>
            </div>
            <p className="max-w-xl leading-8 text-white/75">
              Участники приходят с личным вопросом, знакомятся с методом, возвращаются на новые игры и становятся частью сообщества. Ведущие собирают группы в своих городах, а экспертные фокус-группы помогают создавать следующие проекты серии.
            </p>
          </div>
          <div className="mt-10 grid gap-8 border-t border-white/15 pt-8 md:grid-cols-3">
            <div className="flex gap-4"><MessageCircle className="mt-1 size-5 shrink-0 text-sage" /><div><h3 className="font-semibold">Попробовать игру</h3><p className="mt-2 text-sm leading-6 text-white/65">Познакомиться с форматом на живой встрече.</p></div></div>
            <div className="flex gap-4"><Users className="mt-1 size-5 shrink-0 text-sage" /><div><h3 className="font-semibold">Стать частью проекта</h3><p className="mt-2 text-sm leading-6 text-white/65">Присоединиться к клубу, фокус-группе или команде ведущих.</p></div></div>
            <div className="flex gap-4"><Sparkles className="mt-1 size-5 shrink-0 text-sage" /><div><h3 className="font-semibold">Развивать «Раппóрт»</h3><p className="mt-2 text-sm leading-6 text-white/65">Помогать новым играм и городам появляться на карте.</p></div></div>
          </div>
          {!quest && <div className="mt-10 flex flex-wrap gap-4">
            <Button size="lg" className="bg-sage text-white hover:bg-sage-deep" onClick={() => openBookingWidget()}>Попробовать игру <ArrowRight /></Button>
            <Button asChild size="lg" variant="outline" className="border-background/40 bg-transparent text-background hover:bg-background/10 hover:text-background"><Link to="/games">Познакомиться с играми</Link></Button>
          </div>}
        </div>
      </section>
      <BeforeAfter />
      <SubscribeBanner kind="tg" />
      {!quest && <section className="section-inner py-16 text-center"><h2 className="font-book text-4xl md:text-6xl">Какую игру выберешь <em>ты</em>?</h2><div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{activeGames.map((g) => <Link key={g.slug} to="/games/$slug" params={{ slug: g.slug }} className="rounded-2xl border border-border bg-card p-6 text-left transition-colors hover:border-primary"><p className="font-display text-2xl">{g.title}</p><p className="mt-2 text-sm text-muted-foreground">{g.tagline}</p><span className="mt-4 inline-flex items-center gap-1 text-sm text-primary">Выбрать <ArrowRight className="size-4" /></span></Link>)}</div></section>}
    </div>
  );
}

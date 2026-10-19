import { createFileRoute, Link } from "@tanstack/react-router";
import { GameOrderForm } from "@/components/game-order-form";
import { MarathonSchedule } from "@/components/marathon-schedule";

const TITLE = "Демо-день «Раппóрт» — три сферы жизни и нетворкинг";
const DESC = "Один день — три темы: Бизнес, Я и Отношения. Игровые практики «Раппóрт» плюс живой нетворкинг. Первое посещение бесплатно, далее 1 500 ₽.";

export const Route = createFileRoute("/demo")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://rapportgame.ru/demo" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "https://rapportgame.ru/demo" }],
  }),
  component: DemoPage,
});

const SPHERES = [
  { n: "01", title: "Бизнес", text: "Как вы договариваетесь, продаёте себя и свои идеи, держите позицию в переговорах. Через персонажа видно, где вы уступаете лишнее, а где можно смелее." },
  { n: "02", title: "Я", text: "Опора на себя, желания и внутренние запреты. Игра бережно подсвечивает, что на самом деле движет вашими решениями." },
  { n: "03", title: "Отношения", text: "Близость, доверие и границы с партнёром, семьёй и друзьями. Вы проживаете ситуации через роль и получаете обратную связь персонажу — без давления на вас лично." },
];

const FLOW = [
  ["Знакомство", "Короткий нетворкинг-разогрев: кто вы, с чем пришли, кого хотите встретить."],
  ["Три игровые сессии", "По одной теме из каждой сферы. Игроки действуют от лица персонажа, обратная связь — персонажу."],
  ["Нетворкинг между сессиями", "Пары и малые группы меняются — вы успеваете поговорить с каждым."],
  ["Финал: клуб «Раппóрт»", "Рассказываем о бизнес-возможностях клуба: как вести игры, зарабатывать и расти вместе с сообществом."],
];

function DemoPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
      <section className="max-w-4xl">
        <p className="eyebrow">Демо-день · первое посещение 0 ₽</p>
        <h1 className="mt-3 font-display text-5xl leading-tight md:text-6xl">Три сферы жизни за один день — и люди, с которыми хочется продолжить разговор</h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">Демо-день «Раппóрт» соединяет игровые практики и нетворкинг. Мы раскрываем три темы — из бизнеса, из отношений с собой и из отношений с другими — и даём время на живые знакомства.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#signup" className="bg-primary px-6 py-3 font-medium text-primary-foreground">Записаться бесплатно</a>
          <Link to="/games" className="border border-border px-6 py-3">Посмотреть игры</Link>
        </div>
      </section>

      <section className="mt-16 grid gap-4 md:grid-cols-3">
        {SPHERES.map((s) => (
          <article key={s.n} className="border border-border bg-card p-6">
            <p className="font-display text-4xl text-primary">{s.n}</p>
            <h2 className="mt-3 font-display text-2xl">{s.title}</h2>
            <p className="mt-3 text-muted-foreground">{s.text}</p>
          </article>
        ))}
      </section>

      <section className="mt-16">
        <p className="eyebrow">Как проходит день</p>
        <ol className="mt-6 grid gap-4 md:grid-cols-2">
          {FLOW.map(([t, d], i) => (
            <li key={t} className="flex gap-4 border-l-2 border-primary pl-4">
              <span className="font-display text-2xl text-primary">{i + 1}</span>
              <div><h3 className="font-medium">{t}</h3><p className="mt-1 text-muted-foreground">{d}</p></div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-16 grid gap-4 md:grid-cols-2">
        <div className="border border-primary bg-card p-6">
          <p className="eyebrow">Первое посещение</p>
          <p className="mt-2 font-display text-5xl">0 ₽</p>
          <p className="mt-2 text-muted-foreground">Приходите познакомиться с форматом — без оплаты.</p>
        </div>
        <div className="border border-border bg-card p-6">
          <p className="eyebrow">Следующие посещения</p>
          <p className="mt-2 font-display text-5xl">1 500 ₽</p>
          <p className="mt-2 text-muted-foreground">Каждый демо-день — новые темы и новые люди.</p>
        </div>
      </section>

      <section className="mt-16">
        <p className="eyebrow mb-4">Ближайшие даты</p>
        <MarathonSchedule phase="demo" />
      </section>

      <section id="signup" className="mt-16 max-w-xl">
        <h2 className="font-display text-3xl">Записаться на демо-день</h2>
        <p className="mt-2 text-muted-foreground">Оставьте контакты — мы подтвердим дату и пришлём детали.</p>
        <div className="mt-6"><GameOrderForm gameTitle="Демо-день «Раппóрт»" /></div>
      </section>
    </div>
  );
}

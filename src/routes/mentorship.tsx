import { createFileRoute, Link } from "@tanstack/react-router";
import { MentorshipForm } from "@/components/mentorship-form";
import { MENTORSHIP_PRICE_RUB } from "@/data/prices";

const title = "Индивидуальное сопровождение — Раппóрт";
const description = "Личное сопровождение с автором игр Раппóрт Артёмом Ефимовым: все игры, тренинги, индивидуальные созвоны, становление ведущим или решение личной ситуации.";

export const Route = createFileRoute("/mentorship")({
  head: () => ({
    meta: [
      { title }, { name: "description", content: description },
      { property: "og:title", content: title }, { property: "og:description", content: description },
      { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MentorshipPage,
});

const included = [
  ["Все игры Раппóрт", "Участие во всех играх серии — живые и онлайн, без ограничений на весь период."],
  ["Тренинги", "Закрытые тренинги и интенсивы по методике, коммуникации и отношениям."],
  ["Личные созвоны", "Регулярные индивидуальные встречи с автором методики — в удобном ритме."],
  ["Становление ведущим", "Обучение, первые игры, поддержка до уверенной самостоятельной практики."],
  ["Личная ситуация", "Или бережная работа с вашим запросом — отношения, выбор, кризис."],
] as const;

function MentorshipPage() {
  const price = MENTORSHIP_PRICE_RUB.toLocaleString("ru-RU");
  return <div className="bg-foreground text-background">
    <section className="mx-auto max-w-7xl px-5 pb-16 pt-12 lg:px-8 lg:pt-20">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">Глава последняя · лично</p>
      <h1 className="mt-6 max-w-5xl font-display text-[clamp(3rem,8vw,7.5rem)] leading-[0.9]">Индивидуальное <em className="text-accent">сопровождение</em></h1>
      <div className="mt-10 grid gap-8 border-t border-background/15 pt-8 md:grid-cols-[1fr_auto] md:items-end">
        <p className="max-w-2xl text-lg leading-8 text-background/70">Формат для тех, кто хочет пройти путь не в группе, а рядом с автором игр. Всё, что есть в Раппóрт, — собрано вокруг вашей цели.</p>
        <div className="text-right"><p className="font-display text-6xl text-accent">{price} ₽</p><p className="mt-1 text-xs uppercase tracking-widest text-background/50">за программу · мест ограничено</p></div>
      </div>
    </section>
    <section className="mx-auto max-w-7xl px-5 pb-16 lg:px-8">
      <ol className="grid gap-px bg-background/15 md:grid-cols-5">
        {included.map(([name, text], i) => <li key={name} className="bg-foreground p-6">
          <span className="font-display text-4xl text-primary">0{i + 1}</span>
          <h2 className="mt-4 font-display text-2xl">{name}</h2>
          <p className="mt-3 text-sm leading-6 text-background/65">{text}</p>
        </li>)}
      </ol>
    </section>
    <section className="mx-auto grid max-w-7xl gap-10 px-5 pb-20 lg:grid-cols-[1fr_0.9fr] lg:px-8">
      <div>
        <h2 className="font-display text-4xl leading-tight md:text-5xl">Начинается с <em className="text-accent">одного разговора</em></h2>
        <p className="mt-5 max-w-xl leading-7 text-background/70">Оставьте контакт — Артём лично свяжется, чтобы понять ваш запрос. Если формат подойдёт, составим план сопровождения. Не уверены? <Link to="/quiz" className="text-accent underline underline-offset-4">Пройдите короткий тест</Link>.</p>
      </div>
      <div className="border border-accent/40 bg-background p-6 text-foreground md:p-8"><MentorshipForm source="Страница сопровождения" /></div>
    </section>
  </div>;
}

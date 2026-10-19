import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Building2, Check, Heart, HeartHandshake, Landmark, Mail, Sparkles, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GameOrderForm } from "@/components/game-order-form";
import { Reveal } from "@/components/business-interactive";
import { PageMotion } from "@/components/motion";
import { GameFacts } from "@/components/game-facts";
import { seoHead } from "@/lib/seo";
import { authorPortraitImage } from "@/data/site";
import marina from "@/assets/marina-kravchenko.webp.asset.json";
import box from "@/assets/zh-box.webp.asset.json";

// Страница для государственных проектов, клубов и сообществ — тексты из презентации проекта «Живая».
const TITLE = "Игра-тренажёр «Живая» для госпроектов, клубов и сообществ";
const DESC = "Психологическая игра-тренажёр для женщин: 12 сфер жизни, игра через персонажа, без травмы. Для социальных программ, женских клубов и сообществ. Снижение тревоги, сохранение семьи.";

export const Route = createFileRoute("/social-projects")({
  head: () => seoHead({ title: TITLE, description: DESC, path: "/social-projects", keywords: ["социальный проект для женщин", "психологическая поддержка женщин", "женский клуб", "игра для сообществ", "профилактика тревожности"] }),
  component: SocialProjects,
});

const PROBLEMS = [
  "Теряем контакт с собой: перестаём слышать свои желания, чувства, потребности",
  "Страдают отношения — с собой, близкими, детьми, родителями, коллегами",
  "Общение уходит в мессенджеры: теряются интонации, накапливается непонимание",
  "Перекос в одной роли переносится на все остальные",
  "Тревога, панические состояния, ощущение «я не справляюсь»",
];
const ROLES = ["Женщина", "Мать", "Жена / партнёр", "Дочь", "Специалист", "Руководитель", "Подруга"];
const HOW = [
  "Проигрываем карточку с ситуацией", "Через персонажа видим автоматические реакции и роли", "Осознаём запрещённые чувства", "Примеряем новый навык из карточки",
  "Отыгрываем ту же ситуацию по-другому", "Психика запоминает новый опыт", "Ослабевают блокировки, убеждения, зажимы", "Эффект переносится в реальную жизнь",
];
const WHY = [["Легко", "без травмы, стыда, давления"], ["Безопасно", "через персонажа, а не про себя"], ["Быстро", "инсайты прямо в игре"], ["Глубоко", "роли, чувства, автоматические реакции"], ["Практично", "навыки сразу отрабатываются"], ["Экологично", "психика запоминает новый опыт"], ["Поддерживающе", "женский круг"], ["Переносимо", "результат идёт в реальную жизнь"]];
const WHO = ["Не знают, чего хотят, не чувствуют желаний", "Потеряли интерес — всё стало неинтересным", "Перестали понимать партнёра, детей, маму", "Хотят реализации, но не знают, куда идти", "Знают, куда хотят, но страшно", "Живут на автомате", "Стоят перед выбором: остаться или уйти", "Чувствуют: «живу не свою жизнь»", "Испытывают тревогу и перегрузку"];
const EXTRA = ["Эмоциональная ароматерапия", "Дыхательные упражнения", "Эмоционально-образная терапия", "Безопасная работа с напряжением и телесными зажимами"];
const RESULTS = ["Сохранение семьи и снижение разводов", "Сохранение рабочих мест", "Рост эффективности бизнеса", "Снижение уровня тревожности", "Улучшение общего фона в обществе"];
const PRODUCTS = [["Игра-тренажёр", "3 часа", "Игра, карточки, 12 сфер", "2 500 ₽"], ["Игра-практикум", "6 часов", "Погружение в личность + рабочая тетрадь + домашнее задание", "5 000 ₽"], ["Комплексный продукт", "10 недель", "10 тренингов + рабочая тетрадь + домашние задания + 1 личная консультация (1 час)", "29 900 ₽"]];
const FOR = [{ icon: Landmark, t: "Государственные и социальные программы", d: "Поддержка семьи, профилактика тревожности и выгорания, психологическое благополучие женщин." }, { icon: Users, t: "Женские клубы и сообщества", d: "Регулярные встречи с глубиной: игра вместо лекции, круг поддержки вместо одиночества." }, { icon: Building2, t: "Площадки и партнёры", d: "Конференц-залы, рестораны, beauty-пространства — демоверсии и регулярные игры для ваших гостей." }];

function SocialProjects() {
  return <main>
    <PageMotion />
    <section className="relative overflow-hidden bg-foreground text-background">
      <div data-parallax className="absolute inset-0 bg-hero-glow will-change-transform" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 pb-16 pt-14 lg:grid-cols-[1.2fr_1fr] lg:px-8 lg:pb-24">
        <div>
          <p className="eyebrow text-accent">Для госпроектов, клубов и сообществ</p>
          <h1 className="mt-4 font-display text-5xl leading-[0.98] sm:text-6xl">Игра-тренажёр для женщин <em className="text-accent">«Живая»</em></h1>
          <p className="mt-6 max-w-2xl text-xl leading-8 text-background/90">Возвращаем ресурс в каждую роль женщины — в лёгком игровом формате. Без погружения в травмы, без разбора «что со мной не так».</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg"><a href="#partner-order"><HeartHandshake />Стать партнёром</a></Button>
            <Button asChild size="lg" variant="secondary"><Link to="/demo">Демо-игра</Link></Button>
          </div>
        </div>
        <img src={box.url} alt="Игра-тренажёр «Живая»" className="w-full rounded-3xl shadow-2xl transition-transform duration-500 hover:-translate-y-2" />
      </div>
    </section>

    <section className="section">
      <div className="section-inner">
        <p className="eyebrow">Для кого эта программа</p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {FOR.map(({ icon: I, t, d }, i) => <Reveal key={t} delay={i * 100}><div className="card-lift h-full rounded-3xl border border-border bg-card p-8"><I className="size-8 text-primary" /><h2 className="mt-4 font-display text-2xl">{t}</h2><p className="mt-2 text-muted-foreground">{d}</p></div></Reveal>)}
        </div>
      </div>
    </section>

    <section className="section bg-secondary">
      <div className="section-inner grid gap-12 lg:grid-cols-2">
        <div>
          <p className="eyebrow">Актуальность</p>
          <h2 className="section-title">Много ролей — <em>и почти нет места для себя</em></h2>
          <p className="mt-6 text-lg text-muted-foreground">Многозадачность, постоянно меняющиеся экономические условия, растущая тревога как реакция на перегрузку и неопределённость.</p>
          <div className="mt-6 flex flex-wrap gap-2">{ROLES.map((r, i) => <Reveal key={r} delay={i * 60}><span className="inline-block rounded-full bg-card px-4 py-2 font-display text-lg shadow-sm">{r}</span></Reveal>)}</div>
        </div>
        <ul className="grid gap-3">{PROBLEMS.map((p, i) => <Reveal key={p} delay={i * 80}><li className="rounded-2xl bg-card p-5 text-lg">{p}</li></Reveal>)}</ul>
      </div>
    </section>

    <section className="section bg-foreground text-background">
      <div className="section-inner">
        <p className="eyebrow text-accent">Социальная значимость</p>
        <h2 className="section-title max-w-4xl">Одна роль не равна одному человеку. <em className="text-accent">Перекос в одной роли отражается на всей жизни.</em></h2>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {RESULTS.map((r, i) => <Reveal key={r} delay={i * 80}><div className="h-full rounded-3xl border border-background/20 p-6"><Heart className="text-accent" /><p className="mt-4 font-display text-xl">{r}</p></div></Reveal>)}
        </div>
        <p className="mt-8 max-w-3xl text-background/85">Тенденции: растёт запрос на психологическую поддержку, эмоциональный интеллект, mental health и осознанность. Женщины ищут пространство для восстановления и развития без чувства вины.</p>
      </div>
    </section>

    <section className="section">
      <div className="section-inner">
        <p className="eyebrow">Решение</p>
        <h2 className="section-title max-w-4xl">Карточки с ситуациями из <em>12 сфер жизни</em></h2>
        <p className="mt-4 max-w-3xl text-lg text-muted-foreground">Ситуация не про личность — она про роль, реакцию, выбор. Участница играет персонажа, а обратная связь идёт персонажу.</p>
        <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {HOW.map((h, i) => <Reveal key={h} delay={i * 60}><li className="card-lift h-full rounded-3xl border border-border bg-card p-6"><span className="font-display text-4xl text-primary">{i + 1}</span><p className="mt-3 text-lg">{h}</p></li></Reveal>)}
        </ol>
        <div className="mt-6 rounded-3xl bg-primary p-8 text-primary-foreground"><p className="font-display text-2xl">Поддержка женского круга: проблема перестаёт быть изолированной. Когда женщина видит, что она не одна, проблема минимизируется или растворяется.</p></div>
      </div>
    </section>

    <section className="section bg-secondary">
      <div className="section-inner grid gap-12 lg:grid-cols-2">
        <div>
          <p className="eyebrow">Целевая аудитория</p>
          <h2 className="section-title">Кому <em>поможет игра</em></h2>
          <ul className="mt-8 grid gap-2">{WHO.map((w) => <li key={w} className="flex gap-3"><Check className="mt-1 size-5 shrink-0 text-primary" />{w}</li>)}</ul>
        </div>
        <div>
          <p className="eyebrow">Почему это работает</p>
          <div className="mt-6 grid grid-cols-2 gap-3">{WHY.map(([t, d], i) => <Reveal key={t} delay={i * 50}><div className="h-full rounded-2xl bg-card p-5 transition-transform hover:-translate-y-1"><p className="font-display text-xl text-primary">{t}</p><p className="text-sm text-muted-foreground">{d}</p></div></Reveal>)}</div>
          <div className="mt-6 rounded-2xl border border-border bg-card p-5"><p className="flex items-center gap-2 font-semibold"><Sparkles className="size-5 text-primary" />Дополнительно интегрировано в игру</p><ul className="mt-3 space-y-1 text-muted-foreground">{EXTRA.map((e) => <li key={e}>— {e}</li>)}</ul></div>
        </div>
      </div>
    </section>

    <section className="section">
      <div className="section-inner">
        <p className="eyebrow">Продукты</p>
        <h2 className="section-title">От одной игры — <em>до 10 недель</em></h2>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {PRODUCTS.map(([t, dur, d, p], i) => <Reveal key={t} delay={i * 100}><div className={`card-lift flex h-full flex-col rounded-3xl p-8 shadow-sm ${i === 2 ? "bg-primary text-primary-foreground" : "border border-border bg-card"}`}><p className={`text-sm font-bold uppercase tracking-widest ${i === 2 ? "" : "text-primary"}`}>{dur}</p><h3 className="mt-2 font-display text-3xl">{t}</h3><p className={`mt-3 flex-1 ${i === 2 ? "text-primary-foreground/90" : "text-muted-foreground"}`}>{d}</p><p className="mt-6 font-display text-4xl">{p}</p></div></Reveal>)}
        </div>
        <p className="mt-6 text-muted-foreground">Ежемесячная демоверсия на 50 человек — 500 ₽ за билет. Для программ и сообществ формат и количество участниц обсуждаем отдельно.</p>
      </div>
    </section>

    <section className="section bg-secondary">
      <div className="section-inner">
        <p className="eyebrow">Команда проекта</p>
        <h2 className="section-title">Кто <em>стоит за игрой</em></h2>
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {[{ img: authorPortraitImage, n: "Артём Ефимов", r: "Автор проекта" }, { img: marina.url, n: "Марина Кравченко", r: "Эксперт проекта, ведущая терапевтических игр в Волгограде" }].map((m) => <div key={m.n} className="card-lift flex items-center gap-6 rounded-3xl bg-card p-6"><img src={m.img} alt={m.n} loading="lazy" className="size-24 shrink-0 rounded-full object-cover" /><div><h3 className="font-display text-2xl">{m.n}</h3><p className="text-muted-foreground">{m.r}</p></div></div>)}
        </div>
        <p className="mt-6 text-muted-foreground">Уже сейчас: еженедельные игры, кабинет до 14 человек, партнёры — ресторан «Болконский» и beauty-мастера Красноармейского района Волгограда.</p>
      </div>
    </section>

    <section id="partner-order" className="game-story-booking"><div className="section-inner"><p className="eyebrow">Партнёрство</p><h2>Запустим «Живую»<br />в вашей программе</h2><p>Расскажите о проекте, клубе или сообществе — предложим формат.</p><GameOrderForm gameTitle="«Живая» — госпроекты, клубы, сообщества" />
      <div className="mt-8"><Button asChild variant="outline"><a href="mailto:rapportower@gmail.com"><Mail />rapportower@gmail.com <ArrowRight /></a></Button></div>
    </div></section>
  <GameFacts />
  </main>;
}

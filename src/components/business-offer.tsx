import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, CalendarDays, Download, HeartHandshake, MessageCircle, Shield, Sparkles, TrendingUp, Users, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { openBookingWidget } from "@/components/booking-format";
import { GameOrderForm } from "@/components/game-order-form";
import { authorPortraitImage } from "@/data/site";
import presentation from "@/assets/rapport-business-presentation.pdf";
import { CountUp, DemoCallInvite, FlipCards, Reveal, TeamCheck } from "@/components/business-interactive";
import businessCutout from "@/assets/rapport-business-cutout.webp";

// Коммерческое предложение «Раппóрт Бизнес» — тексты из презентации автора для компаний.
const PARTNERSHIP = [
  { n: "01", t: "Среда", d: "психологической безопасности, основанная на открытом диалоге и обратной связи" },
  { n: "02", t: "Сотрудникам", d: "даёт возможность свободно выражать идеи и чувства" },
  { n: "03", t: "Руководителям", d: "помогает строить продуктивные и прибыльные бизнес-отношения" },
  { n: "04", t: "Компании", d: "предотвращает межличностные конфликты и сохраняет энергию для деловых задач" },
];
const BENEFITS = [
  { icon: TrendingUp, t: "Рост прибыли", d: "Эффективность сотрудников напрямую влияет на финансовые показатели компании." },
  { icon: HeartHandshake, t: "Сверхлояльность", d: "Преданность сотрудников и удержание талантов в долгосрочной перспективе." },
  { icon: Shield, t: "Устойчивость к кризису", d: "Команда, способная вместе преодолевать любые трудности." },
  { icon: Zap, t: "Максимальная вовлечённость", d: "Условия для полной реализации потенциала каждого сотрудника." },
];
const STAGES = [
  { t: "Диагностика", items: ["Онлайн-опрос команды", "Адаптация программы под климат компании"] },
  { t: "Тренинг-интенсив", items: ["Базовые навыки коммуникации", "Игры-симуляции рабочих ситуаций"] },
  { t: "Итоги", items: ["Командное обсуждение", "Кодекс эмоционального партнёрства компании"] },
];
const GAMES = [
  { t: "Обмен ролями", d: "Понять, что чувствуют коллеги противоположного пола в типичных рабочих ситуациях, и выработать уважительные модели поведения через наблюдение и прямой диалог." },
  { t: "Ментальный код", d: "Не бороться с унаследованными паттернами, а превратить их в сильные стороны. Команда учится переводить язык сомнений на язык уверенности, а пассивную позицию — в проактивную." },
  { t: "Мост поколений", d: "Переводим язык разных поколений и учимся понимать друг друга через реальные ситуации, с которыми сталкиваются в компании." },
];
const USES = [
  { t: "Онбординг", why: "Безопасная среда для новичка", exp: "Сотрудники на практике видят последствия своих решений" },
  { t: "Управленческие задачи", why: "Цена ошибки в игре — копейки по сравнению с ценой в жизни", exp: "Развитие гибких навыков" },
  { t: "Продажи и производство", why: "Снимает барьеры и помогает экспериментировать без страха", exp: "Сплочение команды через общие вызовы" },
];
const TEAM = [
  { name: "Артём Ефимов", role: "Автор игры", quote: "Раньше была дилемма: карьера или душевное спокойствие. Сегодня это синтез: карьера — путь к душевному спокойствию и реализации.", facts: ["Сертифицированный игропрактик", "800 часов практики трансформационных и бизнес-игр", "Основатель группы компаний «Раппóрт»"], img: authorPortraitImage },
  { name: "Лиана Кушенко", role: "Бизнес-тренер", quote: "Мы продаём не тренинг, а коммерческий успех компании, обусловленный самой сплочённой и эффективной командой.", facts: ["Сертифицированный корпоративный бизнес-тренер", "Лидер глобальной программы Mental Health в Colgate в России", "Финалист президентской программы для управленческих кадров", "Дипломированный психолог"] },
  { name: "Оксана Гузяева", role: "Траблшутер", quote: "Чтобы укрепить связи в коллективе и заново познакомить коллег, используйте бизнес-игры.", facts: ["20 лет в управлении продажами (FMCG, B2B): Mars, Colgate, Nestlé", "Управление командой, найм, обучение, развитие", "Решение кризисных ситуаций"] },
];

export function BusinessOffer() {
  return <>
    <section className="relative overflow-hidden bg-foreground text-background">
      <div data-parallax className="absolute inset-0 bg-hero-glow will-change-transform" />
      <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-8 lg:px-8 lg:pb-24">
        <Link to="/games" className="inline-flex items-center gap-2 text-sm text-background/80 hover:text-accent"><ArrowLeft className="size-4" />Все игры</Link>
        <div className="mt-10 grid items-center gap-10 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <p className="eyebrow text-accent">Тренинг-интенсив для компаний</p>
            <h1 className="mt-4 font-display text-5xl leading-[0.98] sm:text-7xl">Раппóрт <em className="text-accent">Бизнес</em></h1>
            <p className="mt-6 max-w-2xl text-xl leading-8 text-background/90">Живой тренинг для сотрудников и руководителей, который превращает эмоциональные амбиции команды в мотивацию, сплочённость и результат.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" onClick={openBookingWidget}><CalendarDays />Обсудить игру для команды</Button>
              <Button asChild size="lg" variant="secondary"><a href={presentation} target="_blank" rel="noreferrer"><Download />Презентация (PDF)</a></Button>
            </div>
          </div>
          <img src={businessCutout} alt="Коробка игры «Раппóрт Бизнес»" width={640} height={640} className="mx-auto w-full max-w-sm drop-shadow-2xl transition-transform duration-700 hover:-translate-y-2" />
        </div>
        <dl className="mt-14 grid grid-cols-3 gap-4 border-t border-background/25 pt-8">
          {([[45, "", "игр-симуляций реальных кейсов"], [1000, "+", "сценариев из жизни офиса"], [3, "", "этапа: от диагностики до кодекса"]] as const).map(([v, sfx, l]) => <div key={l}><dt className="font-display text-4xl text-accent sm:text-6xl"><CountUp to={v} suffix={sfx} /></dt><dd className="mt-2 text-sm text-background/85 sm:text-base">{l}</dd></div>)}
        </dl>
      </div>
    </section>

    <section className="section">
      <div className="section-inner grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-center">
        <div>
          <p className="eyebrow">Главная идея</p>
          <h2 className="section-title">Не только карьера. <em>Эмоциональные амбиции.</em></h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">Компании, которые строят для сотрудников «эмоционально-карьерные маршруты», строят своё устойчивое будущее. Люди остаются там, где их видят, слышат и где работа имеет личный смысл.</p>
        </div>
        <div className="grid gap-4">
          <blockquote className="rounded-3xl bg-primary p-8 font-display text-2xl leading-snug text-primary-foreground sm:text-3xl">«Удовлетворение эмоциональных амбиций в связке с карьерными — не каприз, а высшая форма управления персоналом в XXI веке»</blockquote>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-border bg-card p-6"><Sparkles className="text-primary" /><h3 className="mt-4 font-display text-2xl">Признание, которое питает</h3><p className="mt-2 text-muted-foreground">Вместо формального «молодец» — конкретное признание и живая обратная связь.</p></div>
            <div className="rounded-3xl border border-border bg-card p-6"><HeartHandshake className="text-primary" /><h3 className="mt-4 font-display text-2xl">Проекты с личным смыслом</h3><p className="mt-2 text-muted-foreground">Участие в задачах, которые резонируют с ценностями сотрудника.</p></div>
          </div>
        </div>
      </div>
    </section>

    <section className="section bg-secondary">
      <div className="section-inner">
        <p className="eyebrow">Почему сейчас</p>
        <h2 className="section-title max-w-4xl">Конфликты стоят дороже, <em>чем их профилактика</em></h2>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {[["78%", "российских компаний осенью 2025 года сталкивались с дефицитом персонала"], ["86%", "руководителей и сотрудников винят в сбоях неэффективное общение и отсутствие сотрудничества"], ["2,8 ч", "в неделю на одного сотрудника теряется из-за конфликтов (исследования США)"]].map(([v, l]) => <div key={v} className="rounded-3xl bg-card p-8 shadow-sm"><p className="font-display text-6xl text-primary">{v}</p><p className="mt-3 text-muted-foreground">{l}</p></div>)}
        </div>
        <p className="mt-10 max-w-3xl font-display text-2xl leading-snug">Вместо реакции на уже вспыхнувшие конфликты эффективнее инвестировать в их профилактику.</p>
      </div>
    </section>

    <section className="section">
      <div className="section-inner">
        <p className="eyebrow">Экспресс-проверка</p>
        <h2 className="section-title max-w-4xl">Что из этого <em>есть в вашей команде?</em></h2>
        <TeamCheck />
      </div>
    </section>

    <section className="section">
      <div className="section-inner">
        <p className="eyebrow">Что мы развиваем</p>
        <h2 className="section-title max-w-4xl">Эмоциональное партнёрство — <em>высшая форма корпоративной культуры</em></h2>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PARTNERSHIP.map((p, i) => <Reveal key={p.n} delay={i * 100}><div className="h-full card-lift rounded-3xl border border-border bg-card p-6"><span className="font-display text-4xl text-primary">{p.n}</span><h3 className="mt-4 text-sm font-bold uppercase tracking-widest">{p.t}</h3><p className="mt-2 text-muted-foreground">{p.d}</p></div></Reveal>)}
        </div>
      </div>
    </section>

    <section className="section bg-foreground text-background">
      <div className="section-inner">
        <p className="eyebrow text-accent">Результат для бизнеса</p>
        <h2 className="section-title max-w-4xl">Зачем компании <em className="text-accent">культура партнёрства</em></h2>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map(({ icon: I, t, d }, i) => <Reveal key={t} delay={i * 100}><div className="h-full transition-colors hover:bg-background/10 rounded-3xl border border-background/20 p-6"><I className="text-accent" /><h3 className="mt-4 font-display text-2xl">{t}</h3><p className="mt-2 text-background/85">{d}</p></div></Reveal>)}
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[["HR", "Профилактика выгорания и атмосфера психологической безопасности"], ["Сотрудникам", "Мотивация, отношение к компании как к своей, чувство свободы, реализации и признания"], ["Руководителям", "Преданность команды, удержание талантов и команда, устойчивая к кризисам"]].map(([t, d]) => <div key={t} className="rounded-3xl bg-background/10 p-6"><h3 className="text-sm font-bold uppercase tracking-widest text-accent">{t}</h3><p className="mt-2 text-background/90">{d}</p></div>)}
        </div>
      </div>
    </section>

    <section className="section">
      <div className="section-inner">
        <p className="eyebrow">Программа</p>
        <h2 className="section-title">Как проходит <em>тренинг-интенсив</em></h2>
        <ol className="mt-12 grid gap-4 md:grid-cols-3">
          {STAGES.map((s, i) => <li key={s.t} className="rounded-3xl border border-border bg-card p-8"><span className="text-sm font-bold uppercase tracking-widest text-primary">Этап {i + 1}</span><h3 className="mt-3 font-display text-3xl">{s.t}</h3><ul className="mt-4 space-y-2 text-muted-foreground">{s.items.map((x) => <li key={x}>— {x}</li>)}</ul></li>)}
        </ol>
      </div>
    </section>

    <section className="section bg-secondary">
      <div className="section-inner">
        <p className="eyebrow">Примеры игр-симуляций</p>
        <h2 className="section-title max-w-4xl">Ситуации, которые <em>узнает каждый офис</em></h2>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {GAMES.map((g) => <article key={g.t} className="card-lift rounded-3xl bg-card p-8 shadow-sm"><MessageCircle className="text-primary" /><h3 className="mt-4 font-display text-3xl">{g.t}</h3><p className="mt-3 leading-7 text-muted-foreground">{g.d}</p></article>)}
        </div>
        <p className="mt-10 max-w-3xl text-lg">Вы пробуете разные решения и стратегии и сразу видите их результат. <strong>Можно играть самим, а можно наблюдать за сотрудниками</strong>, понимая их особенности и сильные стороны.</p>
      </div>
    </section>

    <section className="section">
      <div className="section-inner">
        <p className="eyebrow">Примеры карточек</p>
        <h2 className="section-title max-w-4xl">Вытяните ситуацию — <em>переверните навык</em></h2>
        <FlipCards />
      </div>
    </section>

    <section className="section">
      <div className="section-inner">
        <p className="eyebrow">Где применять</p>
        <h2 className="section-title">Опыт <em>вместо слов</em></h2>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {USES.map((u) => <div key={u.t} className="rounded-3xl border border-border p-8"><h3 className="font-display text-3xl">{u.t}</h3><p className="mt-4 font-semibold">{u.why}</p><p className="mt-2 text-muted-foreground">{u.exp}</p></div>)}
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl bg-primary p-8 text-primary-foreground"><h3 className="font-display text-3xl">Глубокая кастомизация</h3><p className="mt-3 text-primary-foreground/90">Никаких шаблонов: каждая симуляция адаптируется под ценности, задачи и специфику вашей компании.</p></div>
          <div className="rounded-3xl bg-secondary p-8"><h3 className="font-display text-3xl">В основе методов</h3><p className="mt-3 text-muted-foreground">Сплав народной традиции, философии и управленческого опыта.</p></div>
        </div>
      </div>
    </section>

    <section className="section bg-secondary">
      <div className="section-inner">
        <p className="eyebrow">Стоимость</p>
        <h2 className="section-title">Форматы <em>для компании</em></h2>
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl bg-card p-8 shadow-sm"><Users className="text-primary" /><h3 className="mt-4 font-display text-3xl">Корпоративная игра</h3><p className="mt-2 font-display text-4xl text-primary">от 50 000 ₽</p><p className="mt-3 text-muted-foreground">Тренинг-интенсив для вашей команды: диагностика, игры-симуляции, итоги и кодекс партнёрства.</p></div>
          <div className="rounded-3xl bg-card p-8 shadow-sm"><Sparkles className="text-primary" /><h3 className="mt-4 font-display text-3xl">Игра под ваш запрос</h3><p className="mt-2 font-display text-4xl text-primary">от 300 000 ₽</p><p className="mt-3 text-muted-foreground">Разработаем бизнес-симуляцию под вашу задачу, которая превращает теорию в личный опыт и формирует мотивированную, лояльную команду.</p></div>
        </div>
      </div>
    </section>

    <section className="section">
      <div className="section-inner">
        <p className="eyebrow">Команда</p>
        <h2 className="section-title">Кто <em>проводит</em></h2>
        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {TEAM.map((m) => <article key={m.name} className="flex flex-col rounded-3xl border border-border bg-card p-8">
            {m.img && <img src={m.img} alt={m.name} loading="lazy" className="mb-6 aspect-square w-24 rounded-full object-cover" />}
            <p className="text-sm font-bold uppercase tracking-widest text-primary">{m.role}</p>
            <h3 className="mt-2 font-display text-3xl">{m.name}</h3>
            <p className="mt-4 font-display text-lg italic leading-snug">«{m.quote}»</p>
            <ul className="mt-4 space-y-1 text-sm text-muted-foreground">{m.facts.map((f) => <li key={f}>— {f}</li>)}</ul>
          </article>)}
        </div>
      </div>
    </section>

    <DemoCallInvite />

    <section className="game-story-booking"><div className="section-inner"><p className="eyebrow">Начните трансформацию команды</p><h2>Обсудим игру<br />для вашей компании</h2><p>Расскажите о команде и задаче — подберём формат и программу.</p><GameOrderForm gameTitle="Раппóрт Бизнес" />
      <div className="mt-8 flex flex-wrap gap-3"><Button asChild variant="outline"><a href={presentation} target="_blank" rel="noreferrer"><Download />Скачать презентацию</a></Button><Button asChild variant="outline"><a href="mailto:rapportower@gmail.com">rapportower@gmail.com <ArrowRight /></a></Button></div>
    </div></section>
  </>;
}

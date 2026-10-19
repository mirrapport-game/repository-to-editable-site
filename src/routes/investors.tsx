import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Download, Gem, Globe, Layers, Mail, Send, Phone, TrendingUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GameOrderForm } from "@/components/game-order-form";
import { Reveal } from "@/components/business-interactive";
import { CountUp, PageMotion } from "@/components/motion";
import { seoHead } from "@/lib/seo";
import deck from "@/assets/rapport-investor-deck.pdf";

// Питч для инвесторов — все цифры и условия из брифа автора (Артём Ефимов). Страница не индексируется.
const TITLE = "Раппорт Групп — инвестиции в рынок психологических игр";
const DESC = "Питч проекта «Раппóрт» и платформы polegame.ru: 5000+ участников, 28 ведущих, 20 городов. Инвестиции под 40% годовых или 10% компании за 1 млн ₽.";

export const Route = createFileRoute("/investors")({
  head: () => {
    const h = seoHead({ title: TITLE, description: DESC, path: "/investors" });
    return { ...h, meta: [...(h.meta ?? []), { name: "robots", content: "noindex, nofollow" }] };
  },
  component: Investors,
});

const STATS = [["5000+", "участников"], ["28", "ведущих"], ["20", "городов"], ["3", "страны"], ["4", "направления игр"]];
const GAMES = [["Раппóрт — Отношения", "Для пар", "Близость, повторяющиеся ссоры"], ["Раппóрт — Живая", "Для женских кругов", "Самопознание, границы"], ["Раппóрт Beauty", "Для женщин и салонов", "Самооценка, принятие себя"], ["Раппóрт Бизнес", "Для команд и компаний", "Тимбилдинг, soft skills, конфликты"]];
const REVENUE = [["Живые игры (B2C)", "от 1 500 ₽ за участие", "3–10 млн ₽"], ["Онлайн-игры (B2C)", "от 2 500 ₽ за участие", "2–7,2 млн ₽"], ["Корпоративные игры (B2B)", "от 150 000 ₽ за группу", "1,8–3,6 млн ₽"], ["Подписка ведущих", "от 5 000 ₽/мес", "1–1,7 млн ₽"], ["Тренинги", "от 15 000 ₽ за участие · 30 000 ₽/мес с ведущего", "3,6–36 млн ₽ (10–100 ведущих)"], ["Обучение ведущих (Академия Раппóрт)", "от 150 000 ₽ за курс · 3 человека в месяц", "7,2 млн ₽"], ["Продажа игр (коробка и лицензия)", "от 75 000 ₽ · 5 игр в месяц", "4,2 млн ₽"], ["Марафоны и интенсивы", "от 3 000 ₽ за участие", "0,5–1,5 млн ₽"]];
const TARIFFS = [["Наблюдатель", "500 ₽ · 2 500 ₽ · 5 000 ₽"], ["Игрок", "2 500 ₽ · 5 000 ₽ · 9 900 ₽"], ["Ведущий", "5 000 ₽/мес · 35 000 ₽/год · 75 000 ₽ навсегда"]];
const MARKET = [["45 млрд ₽", "рынок психологии и саморазвития в России (2025)"], ["19,5 млрд ₽", "ниша «Психология и отношения»"], ["15–20%", "ежегодный рост рынка"], ["0,1–0,5%", "наша цель по доле рынка = 19–97 млн ₽ выручки"]];
const PROBLEMS = [["Каждый 3-й брак", "распадается в первые 5 лет (Росстат)"], ["78%", "пользователей Tinder жалуются на токсичность (SuperJob)"], ["89%", "пар не обращаются к психологу до критической точки (ВЦИОМ)"]];
const PLANS = ["5 живых пространств с играми и тренингами в 5 регионах России", "Выход в страны СНГ и за рубеж", "5 новых игр в разработке", "Клуб знакомств «Раппóрт»", "Академия Раппóрт — обучение ведущих"];
const NEEDS = ["Образовательная лицензия", "Депонирование авторских материалов", "Юридическое и финансовое сопровождение", "Отдел продаж", "Управляющий проектом"];
const WHY = ["Продукт готов и подтверждён спросом: 5 000+ участников", "Готовая сеть из 28 ведущих в 20 городах и 3 странах", "Работающая технологическая платформа polegame.ru", "Основатель готов год работать за зарплату 150 000 ₽/мес и не вынимать прибыль"];
const ROADMAP = [["Месяц 1–2", "Найм управляющего, запуск отдела продаж"], ["Месяц 3–4", "Запуск корпоративного направления"], ["Месяц 5–6", "Масштабирование онлайн-форматов"], ["Месяц 7–9", "Запуск обучения новых ведущих"], ["Месяц 10–12", "Выход на выручку 1,5–2 млн ₽/мес"]];
const FAQ = [["Как я получу свои 40%?", "Ежемесячные или ежеквартальные выплаты из выручки."], ["Что если проект не вырастет?", "При займе — возврат тела и фиксированный процент."], ["Кто управляет проектом?", "Основатель и инвестор-управляющий."], ["Могу ли я выйти из проекта?", "Да, через продажу доли или возврат займа."], ["Как защищены мои права?", "Договор, vesting, прозрачная отчётность."]];

const rub = (n: number) => `${Math.round(n).toLocaleString("ru-RU")} ₽`;
const toForm = () => document.getElementById("invest-form")?.scrollIntoView({ behavior: "smooth" });

function Investors() {
  return <main>
    <PageMotion />
    <section className="relative overflow-hidden bg-foreground text-background">
      <div data-parallax className="absolute inset-0 bg-hero-glow will-change-transform" />
      <div className="relative mx-auto max-w-6xl px-5 pb-12 pt-16 lg:px-8 lg:pt-24">
        <p className="eyebrow text-accent">Инвестиционное предложение · 2026</p>
        <h1 className="mt-4 max-w-4xl font-display text-4xl leading-tight sm:text-6xl">Раппорт Групп — инвестиции в растущий рынок <em className="text-accent">психологических игр</em></h1>
        <p className="mt-6 text-lg text-background/85">5 000+ участников · 28 ведущих · 20 городов · 3 страны</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button size="lg" onClick={toForm}>Инвестировать под 40% годовых</Button>
          <Button size="lg" variant="outline" className="border-background/40 bg-transparent text-background hover:bg-background/10" onClick={toForm}>Получить 10% компании за 1 млн ₽</Button>
          <Button size="lg" variant="ghost" asChild className="text-background hover:bg-background/10"><a href="/market">Анализ рынка</a></Button>
          <Button size="lg" variant="ghost" asChild className="text-background hover:bg-background/10"><a href={deck} download="Rapport-Group-investor-deck.pdf"><Download /> Скачать презентацию (PDF)</a></Button>
        </div>
        <div className="mt-14 grid grid-cols-2 gap-4 border-t border-background/20 pt-8 sm:grid-cols-5">
          {STATS.map(([v, l]) => <div key={l}><CountUp value={v!} className="font-display text-4xl text-accent sm:text-5xl" /><p className="mt-1 text-sm text-background/80">{l}</p></div>)}
        </div>
      </div>
    </section>

    <section className="section"><div className="section-inner">
      <p className="eyebrow">О проекте</p>
      <h2 className="section-title">Что такое <em>Раппорт Групп</em></h2>
      <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">Раппорт Групп — авторская система психологических игр «Раппóрт». Это EdTech/психологический продукт для работы с отношениями, командами и личностными запросами. Участник играет за персонажа, а не за себя — это снимает защиту и позволяет безопасно говорить о сложном.</p>
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {[[Globe, "Витрина", "Раппорт Групп: бренд, методология, кейсы, отзывы"], [Layers, "Платформа", "polegame.ru: запись, оплата, расписание, личные кабинеты ведущих"], [Gem, "Экосистема", "Два продукта работают вместе: привлечение + удержание"]].map(([I, t, d], i) => { const Icon = I as typeof Globe; return <Reveal key={t as string} delay={i * 100}><div className="card-lift h-full rounded-3xl border border-border bg-card p-7"><Icon className="size-8 text-primary" /><h3 className="mt-4 font-display text-2xl">{t as string}</h3><p className="mt-2 text-muted-foreground">{d as string}</p></div></Reveal>; })}
      </div>
    </div></section>

    <section className="section bg-secondary"><div className="section-inner">
      <p className="eyebrow">Проблема</p>
      <h2 className="section-title">Рынок <em>кричит о боли</em></h2>
      <div className="mt-10 grid gap-5 md:grid-cols-3">{PROBLEMS.map(([v, l], i) => <Reveal key={v} delay={i * 100}><div className="card-lift h-full rounded-3xl bg-card p-7"><p className="font-display text-4xl text-primary">{v}</p><p className="mt-2 text-muted-foreground">{l}</p></div></Reveal>)}</div>
      <p className="mt-8 max-w-3xl text-lg">Люди готовы платить за решение, которое спасает от одиночества и боли. Мы уже фиксируем этот спрос — нужны ресурсы для масштабирования.</p>
    </div></section>

    <section className="section"><div className="section-inner">
      <p className="eyebrow">Линейка игр</p>
      <h2 className="section-title">4 направления, <em>которые уже работают</em></h2>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {GAMES.map(([t, a, d], i) => <Reveal key={t} delay={i * 80}><div className="card-lift h-full rounded-3xl bg-card p-6"><h3 className="font-display text-2xl">{t}</h3><p className="mt-2 text-sm font-semibold text-primary">{a}</p><p className="mt-2 text-muted-foreground">{d}</p></div></Reveal>)}
      </div>
      <p className="mt-8 text-center text-lg">Форматы: онлайн · офлайн · индивидуально · для групп</p>
    </div></section>

    <section className="section"><div className="section-inner">
      <p className="eyebrow">Как мы зарабатываем</p>
      <h2 className="section-title">Потоки <em>выручки</em></h2>
      <div className="mt-10 overflow-hidden rounded-3xl border border-border">
        <div className="hidden grid-cols-[1.4fr_1fr_1fr] bg-secondary px-6 py-3 text-sm font-semibold sm:grid"><span>Направление</span><span>Цена</span><span>Потенциал в год</span></div>
        {REVENUE.map(([t, p, y]) => <div key={t} className="grid gap-1 border-t border-border px-6 py-4 transition-colors hover:bg-secondary/60 sm:grid-cols-[1.4fr_1fr_1fr]"><span className="font-semibold">{t}</span><span className="text-muted-foreground">{p}</span><span className="text-primary">{y}</span></div>)}
        <div className="border-t border-border bg-primary px-6 py-5 font-display text-2xl text-primary-foreground">Совокупный потенциал: 23,3–71,4 млн ₽ в год</div>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">Диапазон: консервативный — оптимистичный сценарий.</p>
    </div></section>

    <section className="section bg-foreground text-background"><div className="section-inner grid gap-10 lg:grid-cols-2">
      <div>
        <p className="eyebrow text-accent">Платформа polegame.ru</p>
        <h2 className="section-title">Технологическая платформа <em className="text-accent">уже работает</em></h2>
        <p className="mt-6 text-lg leading-8 text-background/85">Polegame.ru — операционная система проекта. Ведущие управляют расписанием, клиенты записываются и оплачивают. Платформа собирает статистику и масштабируется без личного участия основателя.</p>
      </div>
      <div className="space-y-3">{TARIFFS.map(([t, p], i) => <Reveal key={t} delay={i * 100}><div className="card-lift rounded-2xl border border-background/20 p-5"><p className="font-display text-2xl text-accent">{t}</p><p className="mt-1 text-background/85">{p}</p></div></Reveal>)}</div>
    </div></section>

    <section className="section"><div className="section-inner">
      <p className="eyebrow">Рынок</p>
      <h2 className="section-title">Рынок, <em>который растёт</em></h2>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{MARKET.map(([v, l], i) => <Reveal key={v} delay={i * 80}><div className="card-lift h-full rounded-3xl border border-border bg-card p-6"><p className="font-display text-4xl text-primary">{v}</p><p className="mt-2 text-muted-foreground">{l}</p></div></Reveal>)}</div>
      <p className="mt-8 max-w-3xl text-lg">Мы уже занимаем нишу. Наша задача — масштабировать модель через ведущих, франшизу и онлайн-форматы.</p>
    </div></section>

    <section className="section"><div className="section-inner grid gap-10 lg:grid-cols-2">
      <div><p className="eyebrow">Планы на год</p><h2 className="section-title">Куда <em>мы растём</em></h2>
        <ul className="mt-8 space-y-3">{PLANS.map((x, i) => <Reveal key={x} delay={i * 80}><li className="card-lift rounded-2xl border border-border bg-card p-5 text-lg">{x}</li></Reveal>)}</ul></div>
      <div><p className="eyebrow">На что нужны ресурсы</p><h2 className="section-title">Что <em>предстоит решить</em></h2>
        <ul className="mt-8 space-y-3">{NEEDS.map((x, i) => <Reveal key={x} delay={i * 80}><li className="card-lift rounded-2xl bg-secondary p-5 text-lg">{x}</li></Reveal>)}</ul></div>
    </div></section>

    <section className="section bg-foreground text-background"><div className="section-inner max-w-4xl text-center">
      <p className="eyebrow text-accent">Бизнес-ангелам</p>
      <h2 className="section-title">Это миссия и <em className="text-accent">принадлежность к большому</em></h2>
      <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-background/85">Я рассматриваю вас как бизнес-ангелов. Это возможность стать частью большого и важного проекта, который формирует наше сегодняшнее будущее. Наша цель — чтобы к 2030 году 1 000 000 людей сказали: «Раппóрт изменил наши отношения». Сильный я — сильная семья — сильная страна.</p>
      <p className="mx-auto mt-6 max-w-3xl font-display text-2xl text-accent">Если вы не можете вложить деньги — вложите свои знания и компетенции, и мы поделимся с вами прибылью.</p>
      <Button size="lg" className="mt-8" onClick={toForm}>Присоединиться к проекту</Button>
    </div></section>

    <section className="section bg-secondary"><div className="section-inner">
      <p className="eyebrow">Почему сейчас</p>
      <h2 className="section-title">Почему инвестировать <em>именно сейчас</em></h2>
      <ol className="mt-10 grid gap-4 sm:grid-cols-2">{WHY.map((w, i) => <Reveal key={w} delay={i * 80}><li className="card-lift flex h-full gap-4 rounded-3xl bg-card p-6"><span className="font-display text-4xl text-primary">{i + 1}</span><p className="text-lg">{w}</p></li></Reveal>)}</ol>
    </div></section>

    <section className="section"><div className="section-inner">
      <p className="eyebrow">Два варианта инвестиций</p>
      <h2 className="section-title">Выберите <em>формат участия</em></h2>
      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <Reveal><div className="card-lift flex h-full flex-col rounded-3xl border border-border bg-card p-8">
          <TrendingUp className="size-9 text-primary" /><h3 className="mt-4 font-display text-3xl">Инвестиции под 40% годовых</h3>
          <ul className="mt-5 flex-1 space-y-2 text-muted-foreground">{["Минимальный вход: от 500 000 ₽", "Доходность: 40% годовых", "Формат: заём или доходное участие", "Выплаты: ежемесячно или ежеквартально", "Пример: 500 000 ₽ → 700 000 ₽ через 12 месяцев", "Кому подходит: тем, кто хочет доход без управления"].map((x) => <li key={x}>— {x}</li>)}</ul>
          <Button className="mt-6" onClick={() => document.getElementById("invest-calc")?.scrollIntoView({ behavior: "smooth" })}>Рассчитать доходность</Button>
        </div></Reveal>
        <Reveal delay={120}><div className="card-lift flex h-full flex-col rounded-3xl bg-primary p-8 text-primary-foreground">
          <Gem className="size-9" /><h3 className="mt-4 font-display text-3xl">Доля компании 10% за 1 000 000 ₽</h3>
          <ul className="mt-5 flex-1 space-y-2 text-primary-foreground/90">{["Сумма: 1 000 000 ₽", "Доля: 10%", "Оценка компании: 10 000 000 ₽ pre-money", "Формат: доля в ООО с vesting 2 года", "Право голоса: по ключевым вопросам", "Кому подходит: тем, кто хочет владеть частью бизнеса"].map((x) => <li key={x}>— {x}</li>)}</ul>
          <Button variant="secondary" className="mt-6" onClick={toForm}>Обсудить условия</Button>
        </div></Reveal>
      </div>
      <p className="mt-6 text-center text-muted-foreground">Возможны комбинированные варианты: доля + доходность. Обсуждается индивидуально.</p>
    </div></section>

    <Calculator />

    <section className="section"><div className="section-inner">
      <p className="eyebrow">Команда</p>
      <h2 className="section-title">Кто стоит <em>за проектом</em></h2>
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {[["Артём Ефимов", "Автор методики, специалист по отношениям, методолог, игропрактик"], ["28 ведущих", "Сертифицированные игропрактики в 20 городах"], ["Управляющий партнёр", "Вакансия открыта — инвестор может занять эту роль"]].map(([t, d], i) => <Reveal key={t} delay={i * 100}><div className="card-lift h-full rounded-3xl border border-border bg-card p-7"><Users className="size-8 text-primary" /><h3 className="mt-4 font-display text-2xl">{t}</h3><p className="mt-2 text-muted-foreground">{d}</p></div></Reveal>)}
      </div>
      <p className="mt-8 max-w-3xl text-lg">Мы ищем не просто деньги, а активное управление. Инвестор может взять на себя операционку, найм, продажи или финансы.</p>
    </div></section>

    <section className="section bg-secondary"><div className="section-inner">
      <p className="eyebrow">Дорожная карта</p>
      <h2 className="section-title">Что будет сделано <em>за 12 месяцев</em></h2>
      <ol className="mt-10 grid gap-4 md:grid-cols-5">{ROADMAP.map(([m, d], i) => <Reveal key={m} delay={i * 80}><li className="card-lift h-full rounded-3xl border-t-4 border-primary bg-card p-5"><p className="text-sm font-bold uppercase tracking-widest text-primary">{m}</p><p className="mt-2">{d}</p></li></Reveal>)}</ol>
    </div></section>

    <section className="section"><div className="section-inner max-w-3xl">
      <p className="eyebrow">Частые вопросы</p>
      <h2 className="section-title">Ответы <em>инвестору</em></h2>
      <div className="mt-8 divide-y divide-border rounded-3xl border border-border">{FAQ.map(([q, a]) => <details key={q} className="group p-5"><summary className="cursor-pointer list-none font-display text-xl">{q}</summary><p className="mt-3 text-muted-foreground">{a}</p></details>)}</div>
    </div></section>

    <section id="invest-form" className="game-story-booking scroll-mt-20"><div className="section-inner">
      <p className="eyebrow">Заявка</p>
      <h2>Оставьте заявку<br />на встречу</h2>
      <p>Мы свяжемся с вами в течение 24 часов и вышлем подробную презентацию. В комментарии укажите сумму и формат: 40% годовых, 10% доли, участие знаниями и компетенциями или обсудить.</p>
      <GameOrderForm gameTitle="Инвестиции в Раппорт Групп" />
      <Button asChild variant="outline" className="mt-6"><a href={deck} download="Rapport-Group-investor-deck.pdf"><Download /> Скачать презентацию (PDF)</a></Button>
    </div></section>

    <footer className="bg-foreground px-5 py-12 text-center text-background">
      <p className="font-display text-3xl">Раппорт Групп</p>
      <p className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2 text-background/85">
        <a className="underline" href="https://rapportgame.ru">Раппорт Групп</a><a className="underline" href="https://polegame.ru" target="_blank" rel="noreferrer">polegame.ru</a>
        <a href="tel:+79516821422" className="inline-flex items-center gap-1"><Phone className="size-4" /> 8 951 682 14 22</a>
        <a href="mailto:rapportower@gmail.com" className="inline-flex items-center gap-1"><Mail className="size-4" /> rapportower@gmail.com</a>
        <a href="https://t.me/artem_rapport" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1"><Send className="size-4" /> @artem_rapport</a>
      </p>
      <p className="mt-6 text-sm text-background/60">© 2026 Раппóрт. Не является публичной офертой.</p>
    </footer>
  </main>;
}

function Calculator() {
  const [sum, setSum] = useState(1_000_000);
  const [mode, setMode] = useState<"loan" | "share">("loan");
  const share = (sum / 1_000_000) * 10;
  return <section id="invest-calc" className="section bg-foreground text-background scroll-mt-20"><div className="section-inner max-w-4xl">
    <p className="eyebrow text-accent">Калькулятор</p>
    <h2 className="section-title">Рассчитайте <em className="text-accent">свой доход</em></h2>
    <div className="mt-8 inline-flex rounded-full border border-background/30 p-1">
      {([["loan", "Под 40% годовых"], ["share", "Доля 10% за 1 млн"]] as const).map(([k, l]) => <button key={k} type="button" onClick={() => setMode(k)} className={`rounded-full px-5 py-2 text-sm transition-colors ${mode === k ? "bg-accent text-accent-foreground" : "text-background"}`}>{l}</button>)}
    </div>
    <label className="mt-8 block"><span className="text-background/80">Сумма инвестиций: </span><b className="font-display text-3xl text-accent">{rub(sum)}</b>
      <input type="range" min={500_000} max={5_000_000} step={100_000} value={sum} onChange={(e) => setSum(Number(e.target.value))} className="mt-4 w-full accent-[var(--accent)]" aria-label="Сумма инвестиций" />
    </label>
    <div className="mt-8 grid gap-4 sm:grid-cols-3">
      {mode === "loan"
        ? [12, 24, 36].map((m) => <div key={m} className="rounded-2xl border border-background/20 p-5"><p className="text-sm text-background/70">через {m} мес.</p><p className="mt-1 font-display text-3xl">{rub(sum * (1 + 0.4 * (m / 12)))}</p></div>)
        : [["Ваша доля", `${share.toLocaleString("ru-RU", { maximumFractionDigits: 1 })}%`], ["Оценка через 3 года", "30 000 000 ₽"], ["Стоимость доли", rub((share / 100) * 30_000_000)]].map(([l, v]) => <div key={l} className="rounded-2xl border border-background/20 p-5"><p className="text-sm text-background/70">{l}</p><p className="mt-1 font-display text-3xl">{v}</p></div>)}
    </div>
    <p className="mt-3 text-sm text-background/60">{mode === "loan" ? "Простые проценты, 40% годовых, без реинвестирования." : "Расчёт при оценке компании 30 млн ₽ через 3 года; не является гарантией."}</p>
    <Button size="lg" className="mt-8" onClick={toForm}>Получить персональное предложение</Button>
  </div></section>;
}

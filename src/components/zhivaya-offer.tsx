import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, CalendarDays, Drama, Hand, Heart, Laugh, RefreshCw, RotateCw, Shield, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { openBookingWidget } from "@/components/booking-format";
import { GameOrderForm } from "@/components/game-order-form";
import { Reveal } from "@/components/business-interactive";
import { ZoomImage } from "@/components/zoom-image";
import { ShadowTest } from "@/components/shadow-test";
import box from "@/assets/zh-box.webp.asset.json";
import spheresImg from "@/assets/zh-12-spheres.webp.asset.json";
import cardsImg from "@/assets/zh-cards.png.asset.json";
import howImg from "@/assets/zh-how.png.asset.json";
import whyImg from "@/assets/zh-why-cards.webp.asset.json";
import whatImg from "@/assets/zh-what-happens.webp.asset.json";

// «Раппóрт — Живая»: тексты из методички ведущей и материалов автора.
const SPHERES = [
  ["Я и желания", "Мои мечты и истинные желания"], ["Любовь", "Отношения и партнёрство"], ["Самоценность", "Принятие себя и уверенность"],
  ["Внешность", "Моё отражение и образ"], ["Мама", "Отношения с мамой"], ["Папа", "Отношения с папой"],
  ["Кризис", "Перемены и новые возможности"], ["Близость", "Эмоциональная близость"], ["Сексуальность", "Моя энергия и чувственность"],
  ["Здоровье", "Энергия и ресурс"], ["Деньги", "Финансы и реализация"], ["Подруги", "Поддержка и окружение"],
];
const CARDS = [
  ["Отношения", "Любовь начинается с выбора каждый день"], ["Женщина-творец", "Я создаю жизнь, в которой хочу быть"],
  ["Поддержка", "Я не одна. Я принимаю поддержку Вселенной и людей"], ["Самоценность", "Я выбираю себя каждый день"],
  ["Чувства", "Я чувствую — значит, я живая"], ["Кризис", "В каждом конце есть новое начало"],
];
const LEVELS = [
  ["Персонаж", "Роль, которую ты играешь на сцене", "Познакомиться с тем, что ты не разрешаешь себе"],
  ["Твоя тень", "То, что ты прячешь от себя", "Увидеть свою тень через персонажа"],
  ["Ты настоящая", "То, что ты выбираешь в жизни", "Забрать ресурс и выбрать новый способ"],
];
const STEPS = [
  ["Запрос", "Выбираешь одну из 12 сфер или персонажа, которого хочешь отыграть."],
  ["Сценарий", "Тянешь карточку со сценарием — или бросаешь кубик."],
  ["Проживание", "Играешь сцену как в жизни, 2–3 минуты, без подготовки. Слушаешь чувства и тело."],
  ["Наблюдения круга", "«Я заметила, что твой голос стал тише». Никаких оценок и советов."],
  ["Качество или чувство", "Называешь качество, которого не хватало, или чувство, которое откликнулось в теле — и проживаешь его во втором отыгрыше."],
  ["Новый способ", "Играешь ту же сцену иначе: с юмором, со сменой ролей, с навыком."],
  ["Закрепление", "Что изменилось? Что ты забираешь из этого опыта?"],
];
const GIVES = [
  ["Узнаёшь своё качество — тень", "через вопрос «что раздражало или чего не хватало»"],
  ["Узнаёшь своё чувство", "через тело и называние"],
  ["Пробуешь новый способ", "юмор, смена ролей, навык"],
  ["Видишь разницу", "первый отыгрыш — автомат, третий — выбор"],
  ["Забираешь навык", "«Я могу выбирать, как реагировать»"],
];
const METHODS = [
  { icon: RefreshCw, t: "Смена ролей", d: "Партнёрша играет тебя, ты — её. Видишь ситуацию со стороны." },
  { icon: Laugh, t: "С юмором", d: "Доводишь ситуацию до абсурда. Когда программа становится смешной — она теряет власть." },
  { icon: Sparkles, t: "Карточка-навык", d: "Тянешь конкретный навык и тренируешь его в безопасной среде." },
];
const RULES = [
  ["Стоп-слово", "Говоришь «стоп» — игра останавливается. Без объяснений. Твоя безопасность важнее сцены."],
  ["Без оценок", "Круг говорит только наблюдения. Ни «молодец», ни «справилась»."],
  ["Без советов", "Даже если ты психолог с 20-летним стажем. Советы — это защита."],
  ["Роль, а не личность", "Сыграла «мужа-козла» — это роль. После сцены роли снимаем."],
  ["Конфиденциальность", "Всё, что происходит в игре, остаётся в игре."],
];

function AffirmationCards() {
  const [open, setOpen] = useState<number | null>(null);
  return <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-3">
    {CARDS.map(([t, a], i) => { const f = open === i; return <Reveal key={t} delay={i * 70}>
      <button type="button" aria-pressed={f} onClick={() => setOpen(f ? null : i)} className="group h-56 w-full [perspective:1200px] sm:h-64">
        <div className={`relative h-full w-full transition-transform duration-700 [transform-style:preserve-3d] ${f ? "[transform:rotateY(180deg)]" : "group-hover:-translate-y-1"}`}>
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-3xl border border-accent bg-foreground p-5 text-center text-background [backface-visibility:hidden]">
            <Heart className="text-accent" />
            <p className="mt-4 font-display text-2xl text-accent sm:text-3xl">{t}</p>
            <span className="mt-6 inline-flex items-center gap-2 text-xs text-background/70"><RotateCw className="size-3" />Открыть карту</span>
          </div>
          <div className="absolute inset-0 flex items-center justify-center rounded-3xl bg-primary p-5 text-center text-primary-foreground [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <p className="font-display text-xl leading-snug sm:text-2xl">«{a}»</p>
          </div>
        </div>
      </button>
    </Reveal>; })}
  </div>;
}

export function ZhivayaOffer() {
  const [sphere, setSphere] = useState(0);
  return <>
    <section className="relative overflow-hidden bg-foreground text-background">
      <div data-parallax className="absolute inset-0 bg-hero-glow will-change-transform" />
      <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-8 lg:px-8 lg:pb-24">
        <Link to="/games" className="inline-flex items-center gap-2 text-sm text-background/80 hover:text-accent"><ArrowLeft className="size-4" />Все игры</Link>
        <div className="mt-10 grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <p className="eyebrow text-accent">Психологическая игра-тренинг для женщин</p>
            <h1 className="mt-4 font-display text-5xl leading-[0.98] sm:text-7xl">Раппóрт — <em className="text-accent">Живая</em></h1>
            <p className="mt-6 max-w-xl text-xl leading-8 text-background/90">Настоящие разговоры меняют жизнь. Ближе к себе — ближе к другим.</p>
            <p className="mt-3 font-display text-2xl italic text-accent">Не терапия. Не лекция. Игра.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg"><Link to="/demo"><CalendarDays />Записаться на демо</Link></Button>
              <Button size="lg" variant="secondary" onClick={openBookingWidget}>Записаться на игру</Button>
            </div>
          </div>
          <img src={box.url} alt="Коробка игры «Раппóрт — Живая»" width={1371} height={1148} className="w-full rounded-3xl shadow-2xl transition-transform duration-700 hover:scale-[1.02]" />
        </div>
        <dl className="mt-14 grid grid-cols-3 gap-4 border-t border-background/25 pt-8">
          {[["12", "сфер жизни женщины"], ["3", "уровня роли: персонаж, тень, ты"], ["0", "советов и оценок"]].map(([v, l]) => <div key={l}><dt className="font-display text-4xl text-accent sm:text-6xl">{v}</dt><dd className="mt-2 text-sm text-background/85 sm:text-base">{l}</dd></div>)}
        </dl>
      </div>
    </section>

    <section className="section">
      <div className="section-inner grid gap-12 lg:grid-cols-2 lg:items-center">
        <Reveal>
          <p className="eyebrow">Почему карточки, а не разговор?</p>
          <h2 className="section-title">Карта задаёт вопрос, <em>на который не ответишь вежливо</em></h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-secondary p-6"><p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Разговор</p><p className="mt-2 font-display text-2xl">«Всё нормально»</p></div>
            <div className="rounded-3xl bg-primary p-6 text-primary-foreground"><p className="text-sm font-bold uppercase tracking-widest">Карточка</p><p className="mt-2 font-display text-2xl">«Я так больше не хочу»</p></div>
          </div>
          <p className="mt-6 text-lg text-muted-foreground">Ты играешь персонажа, а не себя. Но эта роль — то, что ты не разрешаешь себе в жизни. Через игру встречаешься с этими частями себя и забираешь оттуда ресурс.</p>
        </Reveal>
        <Reveal delay={150}><ZoomImage src={whyImg.url} alt="Почему карточки, а не разговор" className="shadow-lg" /></Reveal>
      </div>
    </section>

    <section className="section bg-secondary">
      <div className="section-inner">
        <p className="eyebrow">12 сфер жизни</p>
        <h2 className="section-title">Какая сфера <em>откликается тебе сегодня?</em></h2>
        <div className="mt-12 grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {SPHERES.map(([t], i) => <button key={t} type="button" onClick={() => setSphere(i)} aria-pressed={sphere === i} className={`rounded-2xl border p-4 text-left font-display text-lg transition-all duration-300 ${sphere === i ? "scale-105 border-primary bg-primary text-primary-foreground shadow-lg" : "border-border bg-card hover:border-primary"}`}>{t}</button>)}
          </div>
          <div className="rounded-3xl bg-foreground p-8 text-background">
            <p className="text-sm font-bold uppercase tracking-widest text-accent">Сфера {sphere + 1} из 12</p>
            <p key={sphere} className="mt-3 animate-in fade-in slide-in-from-bottom-2 font-display text-4xl duration-500">{SPHERES[sphere]![0]}</p>
            <p className="mt-3 text-lg text-background/85">{SPHERES[sphere]![1]}</p>
            <p className="mt-6 text-background/75">На игре ты сама выбираешь сферу или персонажа — и тянешь сценарий.</p>
          </div>
        </div>
        <Reveal className="mt-10"><ZoomImage src={spheresImg.url} alt="12 сфер жизни женщины в игре «Раппóрт — Живая»" className="mx-auto max-w-3xl shadow-lg" /></Reveal>
      </div>
    </section>

    <section className="section">
      <div className="section-inner">
        <p className="eyebrow">Роли и персонажи</p>
        <h2 className="section-title max-w-4xl">Три уровня роли — <em>путь к себе настоящей</em></h2>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {LEVELS.map(([t, w, why], i) => <Reveal key={t} delay={i * 120}><div className="card-lift h-full rounded-3xl border border-border bg-card p-8"><span className="font-display text-5xl text-primary">{i + 1}</span><h3 className="mt-4 font-display text-3xl">{t}</h3><p className="mt-3">{w}</p><p className="mt-2 text-muted-foreground">→ {why}</p></div></Reveal>)}
        </div>
        <p className="mt-8 max-w-3xl text-lg text-muted-foreground">Мы не разбираем твою личную жизнь, не анализируем детство и не даём советов. Мы просто играем роль — и забираем то, что нам нужно. Понятие Тени ввёл Карл Густав Юнг: это всё, что мы в себе не принимаем. И именно в ней скрыта наша сила.</p>
      </div>
    </section>

    <section className="section bg-foreground text-background">
      <div className="section-inner">
        <p className="eyebrow text-accent">Как проходит игра</p>
        <h2 className="section-title">Простые шаги <em className="text-accent">к большим изменениям</em></h2>
        <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(([t, d], i) => <Reveal key={t} delay={i * 80}><li className="h-full rounded-3xl border border-background/20 p-6 transition-colors hover:bg-background/10"><span className="font-display text-4xl text-accent">{i + 1}</span><h3 className="mt-3 font-display text-2xl">{t}</h3><p className="mt-2 text-background/85">{d}</p></li></Reveal>)}
          <Reveal delay={600}><li className="flex h-full items-center rounded-3xl bg-accent p-6 font-display text-2xl text-accent-foreground">Никаких советов. Никаких оценок. Только ты и твоя карта.</li></Reveal>
        </ol>
        <div className="mt-10 grid gap-6">
          <ZoomImage src={howImg.url} alt="Как работает игра «Раппóрт — Живая»" />
          <ZoomImage src={whatImg.url} alt="Что происходит на игре «Раппóрт — Живая»" />
        </div>
      </div>
    </section>

    <section className="section">
      <div className="section-inner">
        <p className="eyebrow">Карты-ресурсы</p>
        <h2 className="section-title">В конце ты забираешь <em>свою карту</em></h2>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">Карта-подсказка с ресурсом остаётся с тобой и поддерживает в жизни. Открой любую:</p>
        <AffirmationCards />
        <Reveal className="mt-10"><ZoomImage src={cardsImg.url} alt="Карты игры «Раппóрт — Живая»" className="shadow-lg" /></Reveal>
      </div>
    </section>

    <section className="section bg-secondary">
      <div className="section-inner max-w-4xl">
        <p className="eyebrow">Узнай свою тень</p>
        <h2 className="section-title">Что раздражает в других — <em>может быть твоей тенью</em></h2>
        <p className="mt-4 text-lg text-muted-foreground">Пять жизненных ситуаций. Выбирай честно — что задевает сильнее всего. В конце соберём ответы и сделаем вывод.</p>
        <ShadowTest />
      </div>
    </section>

    <section className="section bg-secondary">
      <div className="section-inner grid gap-12 lg:grid-cols-2">
        <div>
          <p className="eyebrow">Что ты получаешь</p>
          <h2 className="section-title">От автомата — <em>к выбору</em></h2>
          <ul className="mt-8 grid gap-3">{GIVES.map(([t, d], i) => <Reveal key={t} delay={i * 80}><li className="rounded-2xl bg-card p-5"><p className="font-display text-xl">{t}</p><p className="text-muted-foreground">{d}</p></li></Reveal>)}</ul>
        </div>
        <div>
          <p className="eyebrow">Способы отыгрыша</p>
          <h2 className="section-title">Та же сцена — <em>по-новому</em></h2>
          <div className="mt-8 grid gap-3">{METHODS.map(({ icon: I, t, d }) => <div key={t} className="flex gap-4 rounded-2xl border border-border bg-card p-5 transition-transform hover:-translate-y-1"><I className="size-7 shrink-0 text-primary" /><div><p className="font-display text-xl">{t}</p><p className="text-muted-foreground">{d}</p></div></div>)}</div>
          <div className="mt-3 flex gap-4 rounded-2xl bg-primary p-5 text-primary-foreground"><Drama className="size-7 shrink-0" /><p>Если плачешь — это нормально. Значит, роль задела что-то важное.</p></div>
        </div>
      </div>
    </section>

    <section className="section">
      <div className="section-inner">
        <p className="eyebrow">Безопасность прежде всего</p>
        <h2 className="section-title">Здесь можно <em>быть настоящей</em></h2>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {RULES.map(([t, d], i) => <Reveal key={t} delay={i * 80}><div className="h-full rounded-3xl border border-border bg-card p-6">{i === 0 ? <Hand className="text-primary" /> : <Shield className="text-primary" />}<h3 className="mt-4 font-display text-xl">{t}</h3><p className="mt-2 text-sm text-muted-foreground">{d}</p></div></Reveal>)}
        </div>
        <p className="mt-8 max-w-3xl text-lg">Хочешь разобрать свою личную ситуацию? Для этого есть <Link to="/ya-zhivaya" className="font-semibold text-primary underline">Интенсив «Я живая — Раппорт с собой»</Link>: там мы играем самих себя и переписываем убеждения.</p>
      </div>
    </section>

    <section className="section bg-secondary">
      <div className="section-inner">
        <p className="eyebrow">Форматы участия</p>
        <h2 className="section-title">Выбери <em>свой путь</em></h2>
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[["Демо-игра", "Первое посещение бесплатно", "Познакомиться с игрой и кругом"], ["Абонемент", "12 500 ₽", "5–7 игр — устойчивые изменения"], ["Интенсив", "9 900 ₽", "1 день: играем себя и переписываем убеждения"], ["Личное сопровождение", "50 000 ₽", "2 недели индивидуальной работы"]].map(([t, p, d], i) => <Reveal key={t} delay={i * 100}><div className={`h-full rounded-3xl p-8 shadow-sm ${i === 0 ? "bg-primary text-primary-foreground" : "bg-card"}`}><h3 className="font-display text-2xl">{t}</h3><p className={`mt-2 font-display text-3xl ${i === 0 ? "" : "text-primary"}`}>{p}</p><p className={`mt-3 ${i === 0 ? "text-primary-foreground/90" : "text-muted-foreground"}`}>{d}</p></div></Reveal>)}
        </div>
      </div>
    </section>

    <section className="section bg-foreground text-background">
      <div className="section-inner text-center">
        <Reveal>
          <p className="eyebrow text-accent">Ты больше, чем думаешь</p>
          <h2 className="section-title mx-auto max-w-3xl">Приходи на <em className="text-accent">демо-игру</em></h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-background/90">Первое посещение — бесплатно. Вытяни свою карту и почувствуй, как это — быть живой.</p>
          <Button asChild size="lg" className="mt-8"><Link to="/demo"><CalendarDays />Записаться на демо</Link></Button>
        </Reveal>
      </div>
    </section>

    <section className="game-story-booking"><div className="section-inner"><p className="eyebrow">Запись на игру</p><h2>Ближе к себе.<br />Ближе к другим.</h2><p>Оставь заявку — ведущая свяжется и подберёт ближайшую игру.</p><GameOrderForm gameTitle="Раппóрт — Живая" /></div></section>
  </>;
}

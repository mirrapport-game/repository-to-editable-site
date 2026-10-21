import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { CalendarDays, Check, Users } from "lucide-react";
import cover from "@/assets/novyi-uroven-cover.png.asset.json";
import olgaPortrait from "@/assets/olga-schastlivaya.jpg.asset.json";
import { authorPortraitImage } from "@/data/site";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConsentFields } from "@/components/consent-fields";
import { submitLandingLead } from "@/lib/landing-leads.functions";

const TITLE = "«Новый уровень» — интенсив для психологов по отношениям в Санкт-Петербурге, 27.10";
const DESC = "Бесплатный интенсив и нетворкинг для психологов по отношениям в Санкт-Петербурге 27.10: путь клиента от первого касания до покупки с чеком 50/150/300 тыс. Ведущие — Ольга Счастливая и Артём Ефимов.";

export const Route = createFileRoute("/intensiv")({
  head: () => ({
    meta: [
      { title: TITLE }, { name: "description", content: DESC },
      { property: "og:title", content: TITLE }, { property: "og:description", content: DESC },
      { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: IntensivePage,
});

const situations = ["развод", "абьюз", "самоценность", "критика, обесценивание, вина, стыд", "эмоциональные качели", "постоянное выяснение отношений"];

const steps = [
  { k: "A", t: "Точка А", d: "Клиенты приходят редко, продажа консультации даётся тяжело, ценность сложно объяснить." },
  { k: "B", t: "Интенсив", d: "Собираем путь клиента, план мягкого донесения ценности и программу на 2 часа. Знакомимся с коллегами." },
  { k: "C", t: "Новый уровень", d: "Понятная система: от первого касания до покупки с чеком 50 / 150 / 300 тыс. и первые заявки уже на практикуме." },
];

const outcomes = [
  "Пошаговый путь клиента — от первого касания до покупки с чеком 50 / 150 / 300 тыс.",
  "План мягкого донесения ценности вашего продукта",
  "Структуру двухчасовой программы, после которой клиент влюбляется в вас и в ваш метод",
];

const funnel = [
  "На базе проблем ваших клиентов создаём мини-версию вашей услуги — тренинг в записи",
  "Продаём этот мини-тренинг за 990 ₽",
  "Клиент за несколько дней проходит тренинг и влюбляется в вас без вашего участия",
  "Получает приглашение на консультацию и приходит к вам",
  "С консультации вы продаёте сопровождение за 50 / 150 / 300 тыс.",
];

function PathScene() {
  return (
    <svg viewBox="0 0 600 200" aria-hidden className="w-full max-w-xl">
      <path className="intensive-path" d="M60 160 C 160 160, 200 110, 300 110 S 450 50, 540 40" fill="none" stroke="var(--primary)" strokeWidth="3" />
      {[{ x: 60, y: 160, k: "A" }, { x: 300, y: 110, k: "B" }, { x: 540, y: 40, k: "C" }].map((n, i) => (
        <g key={n.k} className="intensive-node" style={{ animationDelay: `${i * 1.1}s` }}>
          <circle cx={n.x} cy={n.y} r="26" fill="var(--background)" stroke="var(--primary)" strokeWidth="2.5" />
          <text x={n.x} y={n.y + 8} textAnchor="middle" fontSize="24" fill="var(--primary)" fontFamily="serif">{n.k}</text>
        </g>
      ))}
    </svg>
  );
}

function SignupForm() {
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setBusy(true);
    try {
      await submitLandingLead({ data: {
        landing: "intensiv-novyi-uroven", host: "Ольга Счастливая и Артём Ефимов", city: "Санкт-Петербург",
        name: String(f.get("name") ?? ""), contact: String(f.get("contact") ?? ""), button: "Регистрация на интенсив",
        marketing: f.get("consent_marketing") === "on", website: String(f.get("website") ?? ""),
      } });
      setDone(true);
    } catch { toast.error("Не удалось отправить заявку. Попробуйте ещё раз."); }
    finally { setBusy(false); }
  }
  if (done) return <div className="border border-primary p-8 text-center"><p className="font-display text-3xl text-gold-gradient">Вы зарегистрированы!</p><p className="mt-3 text-muted-foreground">Мы напишем вам с подробностями перед интенсивом.</p></div>;
  return (
    <form onSubmit={submit} className="grid gap-4 border border-border bg-card p-6 md:p-8">
      <Input name="name" required minLength={2} placeholder="Ваше имя" className="h-12 rounded-none" />
      <Input name="contact" required minLength={3} placeholder="Телефон или Telegram" className="h-12 rounded-none" />
      <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <ConsentFields />
      <Button type="submit" size="lg" disabled={busy} className="h-14 rounded-none text-base">{busy ? "Отправляем…" : "Зарегистрироваться бесплатно"}</Button>
    </form>
  );
}

function IntensivePage() {
  return (
    <div className="theme-intensive min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
          <a href="#top" className="font-display text-xl uppercase tracking-wider text-gold-gradient">Новый уровень</a>
          <nav className="hidden gap-6 text-sm uppercase tracking-wider text-muted-foreground md:flex">
            <a href="#path" className="hover:text-primary">Путь A→C</a>
            <a href="#hosts" className="hover:text-primary">Ведущие</a>
            <a href="#register" className="hover:text-primary">27.10 · СПб</a>
          </nav>
          <Button asChild size="sm" className="rounded-none"><a href="#register">Регистрация</a></Button>
        </div>
      </header>
      {/* Обложка */}
      <section id="top" className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background/40 via-background/70 to-background" />
        <div className="mx-auto flex min-h-[88vh] max-w-5xl flex-col items-center justify-center px-5 py-20 text-center">
          <p className="eyebrow text-primary">27.10 · 12:00–16:00 · Санкт-Петербург · участие бесплатно</p>
          <h1 className="mt-6 font-display text-5xl uppercase leading-none text-gold-gradient md:text-8xl">«Новый уровень»</h1>
          <p className="mt-6 text-xl uppercase tracking-widest md:text-2xl">от 1 касания до покупки</p>
          <div className="my-6 h-px w-40 bg-primary" />
          <p className="font-display text-3xl uppercase leading-tight md:text-5xl">Интенсив для психологов<br />по отношениям</p>
          <p className="mt-3 text-lg uppercase tracking-wider text-primary">+ качественный нетворкинг</p>
          <div className="mt-10 w-full flex justify-center"><PathScene /></div>
          <Button asChild size="lg" className="mt-8 h-14 rounded-none px-10 text-base"><a href="#register">Зарегистрироваться</a></Button>
        </div>
      </section>

      {/* Путь A → B → C */}
      <section id="path" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-20">
        <h2 className="text-center font-display text-4xl md:text-6xl">Из точки А — в точку <span className="text-gold-gradient">С</span></h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.k} className="border border-border bg-card p-8">
              <span className="flex size-14 items-center justify-center rounded-full border-2 border-primary font-display text-2xl text-primary">{s.k}</span>
              <h3 className="mt-6 font-display text-2xl">{s.t}</h3>
              <p className="mt-3 leading-7 text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Для кого */}
      <section className="mx-auto grid max-w-6xl gap-12 px-5 py-16 md:grid-cols-2">
        <div>
          <p className="eyebrow text-primary">Для кого</p>
          <h2 className="mt-4 font-display text-4xl">Для тех, кто работает с ситуациями</h2>
          <ul className="mt-8 grid gap-3">{situations.map((s) => <li key={s} className="flex gap-3 text-lg"><Check className="mt-1 size-5 shrink-0 text-primary" />{s}</li>)}</ul>
        </div>
        <div>
          <p className="eyebrow text-primary">Составим вместе</p>
          <h2 className="mt-4 font-display text-4xl">Уйдёте с готовыми инструментами</h2>
          <ol className="mt-8 grid gap-5">{outcomes.map((o, i) => <li key={o} className="flex gap-4"><span className="font-display text-3xl text-gold-gradient">0{i + 1}</span><span className="pt-1 text-lg leading-7">{o}</span></li>)}</ol>
        </div>
      </section>

      {/* Нетворкинг и практикум */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="border border-primary p-8"><Users className="size-8 text-primary" /><h3 className="mt-4 font-display text-3xl">Нетворкинг</h3><p className="mt-3 leading-7 text-muted-foreground">3–5 минут на каждого. Многие выступят перед всей аудиторией — это ваш шанс, чтобы коллеги и будущие партнёры узнали вас.</p></div>
          <div className="border border-primary p-8"><CalendarDays className="size-8 text-primary" /><h3 className="mt-4 font-display text-3xl">Практикум</h3><p className="mt-3 leading-7 text-muted-foreground">Можно принять участие в практикуме и получить заявки прямо в моменте — выполняя новые для себя действия.</p></div>
        </div>
      </section>

      {/* Ведущие */}
      <section id="hosts" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-20">
        <h2 className="text-center font-display text-4xl md:text-6xl">Ведущие</h2>
        <img src={cover.url} alt="Ольга Счастливая и Артём Ефимов — ведущие интенсива «Новый уровень»" loading="lazy" className="mt-10 w-full border border-border" />
        <div className="mt-12 grid gap-10 md:grid-cols-2">
          <article className="border border-border bg-card p-8">
            <div className="flex items-center gap-5">
              <img src={olgaPortrait.url} alt="Ольга Счастливая" loading="lazy" className="size-28 shrink-0 rounded-full border-2 border-primary object-cover object-[50%_20%]" />
              <div><p className="eyebrow text-primary">Продажи услуг психологов</p><h3 className="mt-2 font-display text-4xl">Ольга Счастливая</h3></div>
            </div>
            <div className="mt-6 flex gap-10"><div><span className="font-display text-5xl text-gold-gradient">19</span><p className="text-sm text-muted-foreground">лет обучаю продажам</p></div><div><span className="font-display text-5xl text-gold-gradient">9</span><p className="text-sm text-muted-foreground">лет в мужской психологии</p></div></div>
            <p className="mt-6 leading-7">Я продаю услуги психологов, потому что знаю этот продукт изнутри.</p>
          </article>
          <article className="border border-border bg-card p-8">
            <div className="flex items-center gap-5">
              <img src={authorPortraitImage} alt="Артём Ефимов" loading="lazy" className="size-28 shrink-0 rounded-full border-2 border-primary object-cover object-[50%_20%]" />
              <div><p className="eyebrow text-primary">Специалист по отношениям</p><h3 className="mt-2 font-display text-4xl">Артём Ефимов</h3></div>
            </div>
            <p className="mt-6 leading-7">Автор серии трансформационных игр «Раппóрт», методолог и игропрактик. Более 20 лет работает с отношениями и помогает людям увидеть свои сценарии со стороны — через игру, без лекций.</p>
            <p className="mt-3 leading-7 text-muted-foreground">Поделится, как игровой формат превращает первое знакомство в доверие и запись на работу.</p>
          </article>
        </div>
      </section>

      {/* Как вы зарабатываете */}
      <section className="mx-auto max-w-4xl px-5 py-16">
        <p className="eyebrow text-center text-primary">Как это работает</p>
        <h2 className="mt-4 text-center font-display text-4xl md:text-5xl">Вы получаете <span className="text-gold-gradient">готового клиента</span></h2>
        <ol className="mt-10 grid gap-4">
          {funnel.map((f, i) => <li key={f} className="flex items-start gap-5 border-l-2 border-primary bg-card p-5"><span className="font-display text-2xl text-primary">{i + 1}</span><span className="text-lg leading-7">{f}</span></li>)}
        </ol>
      </section>

      {/* Регистрация */}
      <section id="register" className="mx-auto grid max-w-5xl scroll-mt-20 gap-10 px-5 py-20 md:grid-cols-2 md:items-center">
        <div>
          <p className="font-display text-7xl text-gold-gradient">27.10</p>
          <p className="mt-2 text-2xl">12:00–16:00</p>
          <p className="mt-2 text-xl uppercase tracking-wider">Санкт-Петербург</p>
          <p className="mt-6 text-xl uppercase tracking-wider text-primary">Участие бесплатно</p>
          <p className="mt-4 leading-7 text-muted-foreground">Количество мест ограничено — оставьте заявку, и мы пришлём точный адрес и детали.</p>
        </div>
        <SignupForm />
      </section>
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-5 pb-24 pt-10 text-center md:flex-row md:justify-between md:text-left">
          <div>
            <p className="font-display text-2xl uppercase text-gold-gradient">«Новый уровень»</p>
            <p className="mt-1 text-sm text-muted-foreground">Интенсив для психологов по отношениям · 27.10, 12:00–16:00 · Санкт-Петербург</p>
          </div>
          <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground md:items-end">
            <p>Ведущие: Ольга Счастливая и Артём Ефимов</p>
            <div className="flex gap-4"><a href="https://t.me/Rapport_game_bot" className="hover:text-primary">Telegram</a><a href="/offer" className="hover:text-primary">Оферта</a></div>
          </div>
        </div>
      </footer>
    </div>
  );
}

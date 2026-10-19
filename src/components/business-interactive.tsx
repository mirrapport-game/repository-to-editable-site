import { useEffect, useRef, useState, type ReactNode } from "react";
import { CalendarDays, Check, Clock, RotateCw, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { openBookingWidget } from "@/components/booking-format";

/** Плавное появление блока при прокрутке. */
export function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => { if (entries[0]?.isIntersecting) { setShown(true); io.disconnect(); } }, { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <div ref={ref} style={{ transitionDelay: `${delay}ms` }} className={`transition-all duration-700 ease-out ${shown ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"} ${className}`}>{children}</div>;
}

/** Счётчик, который «добегает» до значения при появлении. */
export function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [v, setV] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      if (!entries[0]?.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const tick = (t: number) => { const p = Math.min(1, (t - start) / 1400); setV(Math.round(to * (1 - Math.pow(1 - p, 3)))); if (p < 1) requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    });
    io.observe(el);
    return () => io.disconnect();
  }, [to]);
  return <span ref={ref}>{v}{suffix}</span>;
}

// Примеры карточек-ситуаций. ЧЕРНОВИК агента — заменить реальными карточками игры.
const CARDS = [
  { tag: "Руководитель", front: "Сотрудник при всех на планёрке говорит: «Это ваша идея, вы её и делайте».", back: "Навык: удержать позицию без нападения и вернуть диалог к задаче." },
  { tag: "Коллеги", front: "Коллега второй раз выдаёт вашу работу за свою на встрече с руководством.", back: "Навык: сказать о своих чувствах через «Я-сообщение», не разрушая отношения." },
  { tag: "Новичок", front: "Новый сотрудник неделю молчит и боится задать вопрос — дедлайн горит.", back: "Навык: создать безопасность, чтобы человек решился попросить помощь." },
  { tag: "Поколения", front: "Опытный специалист: «Молодёжь ничего не хочет». Молодой: «Вы живёте в прошлом веке».", back: "Навык: перевести язык одного поколения на язык другого." },
  { tag: "Продажи", front: "Клиент кричит в трубку, а план продаж висит на этой сделке.", back: "Навык: выдержать эмоцию клиента и найти общий интерес." },
  { tag: "Признание", front: "Вы закрыли сложный проект, а руководитель сказал только «ок».", back: "Навык: просить и давать конкретное признание вместо формального «молодец»." },
];

export function FlipCards() {
  const [open, setOpen] = useState<number | null>(null);
  return <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {CARDS.map((c, i) => {
      const flipped = open === i;
      return <Reveal key={c.front} delay={i * 80}>
        <button type="button" onClick={() => setOpen(flipped ? null : i)} aria-pressed={flipped} className="group h-64 w-full text-left [perspective:1200px]">
          <div className={`relative h-full w-full rounded-3xl transition-transform duration-700 [transform-style:preserve-3d] ${flipped ? "[transform:rotateY(180deg)]" : "group-hover:-translate-y-1"}`}>
            <div className="absolute inset-0 flex flex-col rounded-3xl border border-border bg-card p-6 shadow-sm [backface-visibility:hidden]">
              <span className="text-xs font-bold uppercase tracking-widest text-primary">{c.tag}</span>
              <p className="mt-4 font-display text-xl leading-snug">«{c.front}»</p>
              <span className="mt-auto inline-flex items-center gap-2 text-sm text-muted-foreground"><RotateCw className="size-4" />Нажмите, чтобы перевернуть</span>
            </div>
            <div className="absolute inset-0 flex flex-col justify-center rounded-3xl bg-primary p-6 text-primary-foreground [backface-visibility:hidden] [transform:rotateY(180deg)]">
              <p className="font-display text-2xl leading-snug">{c.back}</p>
              <p className="mt-4 text-sm text-primary-foreground/85">В игре вы отвечаете за персонажа — и пробуете разные решения без риска.</p>
            </div>
          </div>
        </button>
      </Reveal>;
    })}
  </div>;
}

const QUIZ = ["Конфликты обсуждают в курилке, а не на встречах", "Сильные сотрудники уходят «без причины»", "Похвала звучит формально или не звучит вообще", "Новички долго не включаются в работу", "Отделы перекладывают ответственность друг на друга"];

export function TeamCheck() {
  const [picked, setPicked] = useState<number[]>([]);
  const n = picked.length;
  const verdict = n === 0 ? "Отметьте, что узнаёте в своей команде." : n <= 2 ? "Есть первые сигналы — профилактика сейчас обойдётся дешевле всего." : "Команда тратит энергию на напряжение вместо задач. Тренинг-интенсив поможет.";
  return <div className="mt-12 grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-center">
    <ul className="grid gap-3">
      {QUIZ.map((q, i) => { const on = picked.includes(i); return <li key={q}>
        <button type="button" aria-pressed={on} onClick={() => setPicked(on ? picked.filter((x) => x !== i) : [...picked, i])} className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all duration-300 ${on ? "scale-[1.01] border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:border-primary"}`}>
          <span className={`flex size-6 shrink-0 items-center justify-center rounded-full border ${on ? "border-primary-foreground" : "border-border"}`}>{on && <Check className="size-4" />}</span>{q}
        </button>
      </li>; })}
    </ul>
    <div className="rounded-3xl bg-foreground p-8 text-background">
      <p className="text-sm font-bold uppercase tracking-widest text-accent">Узнали ситуаций</p>
      <p className="mt-2 font-display text-7xl text-accent">{n}<span className="text-3xl text-background/70"> / {QUIZ.length}</span></p>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-background/20"><div className="h-full rounded-full bg-accent transition-all duration-500" style={{ width: `${(n / QUIZ.length) * 100}%` }} /></div>
      <p className="mt-5 text-lg text-background/90">{verdict}</p>
    </div>
  </div>;
}

export function DemoCallInvite() {
  return <section className="section bg-foreground text-background">
    <div className="section-inner grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
      <Reveal>
        <p className="eyebrow text-accent">Демо-игра онлайн</p>
        <h2 className="section-title">Попробуйте игру <em className="text-accent">на созвоне</em></h2>
        <p className="mt-6 max-w-xl text-lg leading-8 text-background/90">Покажем механику на живом примере: вы сами сыграете одну ситуацию за персонажа, увидите, как работает обратная связь, и обсудим, как адаптировать игру под вашу команду.</p>
        <Button size="lg" className="mt-8" onClick={openBookingWidget}><CalendarDays />Записаться на демо-созвон</Button>
      </Reveal>
      <Reveal delay={150} className="grid gap-3">
        {[[Video, "Онлайн-созвон", "из любого города"], [Clock, "Короткая встреча", "одна ситуация + разбор"], [Check, "Без обязательств", "решение о тренинге — потом"]].map(([I, t, d]) => { const Icon = I as typeof Video; return <div key={t as string} className="flex items-center gap-4 rounded-2xl border border-background/20 p-5"><Icon className="size-6 shrink-0 text-accent" /><div><p className="font-semibold">{t as string}</p><p className="text-sm text-background/75">{d as string}</p></div></div>; })}
      </Reveal>
    </div>
  </section>;
}

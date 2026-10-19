import { useMemo, useState } from "react";
import { ArrowRight, Calculator, Sparkles, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TELEGRAM_URL } from "@/data/site";

const MIN = 500;
const MAX = 20000;
const STEP = 500;

const tiers = [
  {
    max: 1000,
    title: "«Я не достоин большего»",
    note: "За эту цену вы не ведёте игру, а помогаете с чаем и печеньками. Чай, кстати, стоит дороже.",
  },
  {
    max: 2000,
    title: "«Многие уже это делают»",
    note: "Вернее, многие делают дешевле. Ещё пятеро прямо сейчас ставят такую же цену — и все стесняются.",
  },
  {
    max: 3000,
    title: "«Мне бы хоть кого-то собрать»",
    note: "С такой ставкой к вам придут только друзья. И то не все — у Маши в этот день сессия.",
  },
  {
    max: 5000,
    title: "«Я боюсь брать больше»",
    note: "Бояться надо не высокой цены, а того, что после игры люди скажут: «И всего-то? Дёшево взял».",
  },
  {
    max: 7000,
    title: "«Вдруг подумают, что я жадный»",
    note: "Жадный — это кто берёт деньги и не даёт ценности. Вы-то даёте целый вечер живых разговоров.",
  },
  {
    max: 9000,
    title: "«Я пока набираюсь опыта»",
    note: "Опыт вы набираете уже проведённой игрой, а не скидкой. Скидка набирается сама — не надо ей помогать.",
  },
  {
    max: 12000,
    title: "«Наконец-то по-взрослому»",
    note: "Вот теперь это профессия, а не хобби с благодарностями «спасибо, было классно».",
  },
  {
    max: 15000,
    title: "«Уверенный ведущий»",
    note: "Такая ставка говорит сама за себя: вы держите процесс, а не держитесь за каждого участника.",
  },
  {
    max: 18000,
    title: "«Меня записываются заранее»",
    note: "Календарь заполнен, а вы всё ещё читаете калькулятор? Смелее — выше только космос.",
  },
];

const topTier = {
  title: "«Легенда игропрактики»",
  note: "Очередь на месяц вперёд, участники из трёх городов и вопрос «как вам удаётся?» от коллег. Дальше расти некуда — вы уже там.",
};

function verdictFor(price: number) {
  return tiers.find((tier) => price <= tier.max) ?? topTier;
}

const scale = [
  { at: MIN, label: "Скромняга" },
  { at: 5000, label: "Начало пути" },
  { at: 12000, label: "Профи" },
  { at: MAX, label: "Легенда" },
];

// Inputs keep raw text so the user can fully erase a value.
const digits = (v: string) => v.replace(/[^\d]/g, "").slice(0, 9);
const num = (v: string) => Number(v) || 0;

const SCHEDULES = {
  "5/2": { label: "пятидневка", daysPerYear: 247 },
  "6/1": { label: "шестидневка", daysPerYear: 299 },
  "2/2": { label: "2 через 2", daysPerYear: 182.5 },
} as const;

const WORK = {
  hire: { label: "Работаю в найме", story: (h: string) => `Смотрите: есть человек. Он работает в найме — каждое утро будильник, дорога, планёрки. Его час стоит ${h}. И эту цену за него назначил работодатель. Отпуск — по графику, рост — по решению начальства.` },
  freelance: { label: "Фриланс", story: (h: string) => `Смотрите: есть человек. Он на фрилансе — сам выбирает проекты, но живёт от заказа до заказа. Его час сейчас стоит ${h}. Сегодня густо, завтра пусто, а клиенты всё чаще просят «подешевле».` },
  self: { label: "Работаю на себя", story: (h: string) => `Смотрите: есть человек. Он работает на себя — сам себе начальник, бухгалтер и отдел продаж. Его час стоит ${h}. Свободы больше, но и вопрос «где взять новых клиентов?» звучит каждый день.` },
} as const;
type Work = keyof typeof WORK;

export function PriceCalculator() {
  const [work, setWork] = useState<Work>("hire");
  const [incomeText, setIncomeText] = useState("100000");
  const [schedule, setSchedule] = useState<keyof typeof SCHEDULES>("5/2");
  const [dayText, setDayText] = useState("8");
  const workHourCost = useMemo(() => {
    const hours = (SCHEDULES[schedule].daysPerYear / 12) * num(dayText);
    return hours > 0 ? Math.round(num(incomeText) / hours) : 0;
  }, [incomeText, schedule, dayText]);

  const [price, setPrice] = useState(5000);
  const verdict = useMemo(() => verdictFor(price), [price]);
  const share = ((price - MIN) / (MAX - MIN)) * 100;

  // Доход с игр: игроки × цена за игрока; 1 игра = 3 ч, 1 тренинг = 8 ч, 4 недели в месяце.
  const [players, setPlayers] = useState(8);
  const [perPlayer, setPerPlayer] = useState(2500);
  const [gamesText, setGamesText] = useState("2");
  const [trainingsText, setTrainingsText] = useState("1");
  const [trainingPriceText, setTrainingPriceText] = useState("5000");
  const [trainingPeopleText, setTrainingPeopleText] = useState("8");
  const trainingPrice = num(trainingPeopleText) * num(trainingPriceText);
  const gamePrice = players * perPlayer;
  const gamesPerMonth = num(gamesText) * 4;
  const trainings = num(trainingsText);
  const monthHours = gamesPerMonth * 3 + trainings * 8;
  const monthIncome = gamesPerMonth * gamePrice + trainings * trainingPrice;
  const hourFromGames = monthHours > 0 ? Math.round(monthIncome / monthHours) : 0;
  const ratio = workHourCost > 0 ? hourFromGames / workHourCost : 0;

  const [pkg, setPkg] = useState(75000);
  const payback = monthIncome > 0 ? pkg / monthIncome : 0;
  const paybackText = monthIncome <= 0 ? "—" : payback < 1 ? `${Math.max(1, Math.ceil(payback * 30))} дн.` : `${payback.toFixed(1).replace(".", ",")} мес.`;

  const rub = (n: number) => `${n.toLocaleString("ru-RU")} ₽`;
  const field = (label: string, value: string, set: (v: string) => void, suffix = "") => <label className="grid gap-2 text-sm">
    <span className="text-muted-foreground">{label}</span>
    <div className="relative"><Input inputMode="numeric" value={value ? Number(value).toLocaleString("ru-RU") : ""} placeholder="0" onChange={(e) => set(digits(e.target.value))} />{suffix && <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">{suffix}</span>}</div>
  </label>;
  const slider = (label: string, value: number, min: number, max: number, step: number, set: (n: number) => void, show: string) => <label className="grid gap-2 text-sm">
    <span className="flex justify-between text-muted-foreground"><span>{label}</span><b className="text-foreground">{show}</b></span>
    <div className="price-calc-slider !mt-0"><input type="range" min={min} max={max} step={step} value={value} aria-label={label} onChange={(e) => set(Number(e.target.value))} style={{ ["--share" as string]: `${((value - min) / (max - min)) * 100}%` }} /></div>
  </label>;

  return (
    <section className="section">
      <div className="section-inner">
        <div className="mb-12 grid gap-6 md:grid-cols-2 md:items-end">
          <div><p className="eyebrow">Калькулятор ведущего</p><h2 className="section-title">Сколько стоит ваш <em>час</em>?</h2></div>
          <p className="max-w-lg text-lg leading-8 text-muted-foreground">Небольшая история в четыре шага: где вы сейчас, во сколько себя оцениваете и что может измениться с играми.</p>
        </div>

        {/* Шаг 1 */}
        <div className="price-calc">
          <div className="flex items-center gap-3"><Calculator className="size-6 text-primary" /><h3 className="font-display text-2xl">Шаг 1. Рассчитаем часовую ставку</h3></div>
          <p className="mt-4 text-sm text-muted-foreground">Как вы сейчас работаете?</p>
          <div className="mt-3 flex flex-wrap gap-2">{(Object.keys(WORK) as Work[]).map((k) => <Button key={k} type="button" variant={work === k ? "default" : "outline"} onClick={() => setWork(k)}>{WORK[k].label}</Button>)}</div>
          <p className="mt-6 max-w-2xl text-sm text-muted-foreground">Укажите средний доход в месяц. Если он нестабильный — среднемесячный за последние полгода.</p>
          <div className="mt-4 grid gap-5 sm:grid-cols-3">
            {field(work === "hire" ? "Зарплата" : "Доход", incomeText, setIncomeText, "₽/мес")}
            <label className="grid gap-2 text-sm"><span className="text-muted-foreground">График работы</span>
              <select className="h-10 rounded-md border border-input bg-background px-3 text-sm" value={schedule} onChange={(e) => setSchedule(e.target.value as keyof typeof SCHEDULES)}>
                {Object.entries(SCHEDULES).map(([k, s]) => <option key={k} value={k}>{s.label}</option>)}
              </select>
            </label>
            {field("Рабочий день", dayText, setDayText, "часов")}
          </div>
          <p className="mt-6 border-t border-border pt-6 font-display text-4xl">= {rub(workHourCost)}/час</p>
          <p className="mt-4 rounded-xl bg-muted/50 p-4 leading-7">{WORK[work].story(rub(workHourCost))}</p>
        </div>

        {/* Шаг 3: доход с игр */}
        <div className="price-calc mt-8">
          <div className="flex items-center gap-3"><Users className="size-6 text-primary" /><h3 className="font-display text-2xl">Шаг 2. Ваш дополнительный доход с игр</h3></div>
          <p className="mt-2 text-sm text-muted-foreground">А теперь представим, что этот же человек начинает вести игры «Раппóрт».</p>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {slider("Игроков за столом", players, 4, 12, 1, setPlayers, `${players}`)}
            {slider("Стоимость для одного игрока", perPlayer, 2500, 15000, 500, setPerPlayer, rub(perPlayer))}
            <div className="grid gap-2">{field("Сколько игр в неделю", gamesText, setGamesText, "игр")}<p className="text-xs text-muted-foreground">1 игра — 3 часа · {gamesPerMonth * 3} ч в месяц · за игру {rub(gamePrice)}</p></div>
            <div className="grid gap-2">{field("Сколько тренингов в месяц", trainingsText, setTrainingsText, "трен.")}<p className="text-xs text-muted-foreground">1 тренинг — 8 часов · {trainings * 8} ч в месяц</p></div>
            {field("Участников в тренинге", trainingPeopleText, setTrainingPeopleText, "чел.")}
            <div className="grid gap-2">{field("Цена тренинга для одного участника", trainingPriceText, setTrainingPriceText, "₽")}<p className="text-xs text-muted-foreground">За тренинг {rub(trainingPrice)}</p></div>
          </div>
          <div className="mt-6 grid gap-4 border-t border-border pt-6 sm:grid-cols-2">
            <div><p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">Вы получаете в месяц</p><p className="price-calc-value font-display">{monthIncome.toLocaleString("ru-RU")} <span className="text-primary">₽</span></p></div>
            <div><p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">Стоимость вашего часа</p><p className="font-display text-4xl">{rub(hourFromGames)}</p></div>
          </div>
          {ratio > 0 && <p className="mt-4 rounded-xl bg-muted/50 p-4 leading-7">{ratio >= 1 ? `Тот же человек, тот же час — но теперь он стоит в ${ratio.toFixed(1).replace(".", ",")} раза дороже, чем ${work === "hire" ? "в найме" : work === "freelance" ? "на фрилансе" : "сейчас"}. И цену назначаете вы сами.` : "Пока час в игре стоит меньше, чем на основной работе. Попробуйте добавить игроков или поднять цену — ваш опыт этого стоит."}</p>}
          <p className="mt-4 rounded-xl bg-primary/10 p-4 text-sm"><b>+</b> люди после игр записываются к вам на консультации. Игра становится тем низкострессовым шагом к вам как автору и специалисту. (Это мы не считаем.)</p>
        </div>

        {/* Шаг 4: окупаемость */}
        <div className="price-calc mt-8">
          <h3 className="font-display text-2xl">Шаг 3. Окупаемость</h3>
          <p className="mt-4 text-sm text-muted-foreground">При стоимости игры</p>
          <div className="mt-3 flex flex-wrap gap-2">{[75000, 200000].map((p) => <Button key={p} type="button" variant={pkg === p ? "default" : "outline"} onClick={() => setPkg(p)}>{rub(p)}</Button>)}</div>
          <div className="mt-6 border-t border-border pt-6"><p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">Окупаемость</p><p className="price-calc-value font-display">{paybackText}</p><p className="mt-4 text-sm uppercase tracking-[0.18em] text-muted-foreground">Ваша новая цена часа</p><p className="font-display text-4xl text-primary">{rub(hourFromGames)}</p></div>
          <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-border pt-8">
            <Sparkles className="size-6 text-primary" />
            <p className="flex-1 text-muted-foreground">Хотите так же? Обсудим условия и поддержку сообщества.</p>
            <Button asChild><a href={TELEGRAM_URL} target="_blank" rel="noreferrer">Обсудить свою ставку <ArrowRight /></a></Button>
          </div>
        </div>
        {/* Шаг 2: юмор */}
        <div className="price-calc mt-8">
          <h3 className="font-display text-2xl">Шаг 4. А во сколько вы оцениваете свой час?</h3>
          <p className="mt-2 text-sm text-muted-foreground">Подвиньте ползунок — и узнайте, что ваша цена говорит о вас.</p>
          <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
            <p className="price-calc-value font-display">{price.toLocaleString("ru-RU")} <span className="text-primary">₽</span></p>
            <p className="max-w-sm font-display text-2xl italic leading-snug sm:text-3xl">{verdict.title}</p>
          </div>
          <div className="price-calc-slider">
            <input type="range" min={MIN} max={MAX} step={STEP} value={price} aria-label="Цена часа" onChange={(e) => setPrice(Number(e.target.value))} style={{ ["--share" as string]: `${share}%` }} />
            <div className="price-calc-scale">{scale.map(({ at, label }) => <span key={label} className={price >= at ? "is-passed" : undefined}>{label}</span>)}</div>
          </div>
          <p className="price-calc-note">{verdict.note}</p>
        </div>

      </div>
    </section>
  );
}

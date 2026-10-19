import { useState } from "react";
import { ArrowRight, Briefcase, Check, GraduationCap, Package, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TELEGRAM_URL } from "@/data/site";

const tabs = [
  { id: "facilitator", label: "Ведущим" },
  { id: "turnkey", label: "Под ключ" },
  { id: "investor", label: "Инвесторам" },
] as const;

type TabId = (typeof tabs)[number]["id"];

const tariffFeatures = [
  "Коробочная версия любой игры из серии «Раппóрт»",
  "Доступ к живой версии игры",
  "Обучающие материалы",
  "Поддержка сообщества ведущих",
  "10% за рекомендации",
] as const;

const training = [
  { title: "Методика и правила", text: "Методичка с правилами игры, структура встречи и готовые сценарии проведения — ничего придумывать не нужно." },
  { title: "Скрипты обратной связи", text: "Как вести разбор после игры, задавать вопросы и помогать участникам услышать себя — без психологического образования." },
  { title: "Обучающие видео", text: "Записи живых игр и разборы: вы видите, как ведущий держит процесс, и повторяете это на практике." },
  { title: "Практика с первого месяца", text: "Первую игру можно провести для друзей и знакомых уже в первый месяц обучения — онлайн или офлайн." },
  { title: "Экзамен и сертификат", text: "Совместные игры с наставником, экзамен и сертификат ведущего игр «Раппóрт»." },
  { title: "Поддержка после обучения", text: "Закрытый чат ведущих: если вы застряли, сообщество и автор помогают разобрать ситуацию." },
] as const;

const turnkeyFeatures = [
  "Игра под ключ с полной упаковкой и вашим брендингом",
  "Обучение: 15 видеоуроков по методике и проведению",
  "Личное сопровождение запуска первых игр",
  "Настройка рекламы для набора участников",
  "Общий сайт для сбора заявок",
  "Рассрочка без процентов на 1 или 2 года",
] as const;

const investorFeatures = [
  "Доходность от 30% годовых",
  "Растущий рынок трансформационных игр в России и СНГ",
  "Проверенная модель: 20+ городов и 3 страны, тысячи участников",
  "Прозрачная отчётность и личное общение с автором",
  "Возможность войти на этапе активного роста серии игр",
] as const;

// Рассрочка без процентов: сумма / число месяцев.
function InstallmentCalc({ total }: { total: number }) {
  const [months, setMonths] = useState(12);
  return <div className="mt-5 border border-primary/40 bg-secondary p-5">
    <p className="eyebrow">Рассрочка без процентов</p>
    <div className="mt-3 flex gap-2">{[12, 24].map((m) => <Button key={m} type="button" size="sm" variant={months === m ? "default" : "outline"} onClick={() => setMonths(m)}>{m === 12 ? "На 1 год" : "На 2 года"}</Button>)}</div>
    <p className="mt-4 font-display text-3xl">{Math.round(total / months).toLocaleString("ru-RU")} ₽ <span className="text-base text-muted-foreground">в месяц × {months}</span></p>
  </div>;
}

export function FacilitatorTariffs() {
  const [tab, setTab] = useState<TabId>("facilitator");
  return (
    <section className="section bg-secondary">
      <div className="section-inner">
        <div className="mb-10 grid gap-6 md:grid-cols-2 md:items-end">
          <div>
            <p className="eyebrow">Тарифы</p>
            <h2 className="section-title">Выберите свой <em>формат</em></h2>
          </div>
          <div className="max-w-xl">
            <p className="text-lg leading-8 text-muted-foreground">
              По нашим расчётам вы окупите игру за 1–2 месяца.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="border border-primary/40 bg-background p-5">
                <p className="eyebrow">Под ключ</p>
                <p className="mt-2 font-display text-2xl leading-snug">от 150 000 ₽<br />до 1 000 000 ₽ в месяц</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">Готовая игра для бизнеса — доход зависит от числа команд и запусков.</p>
              </div>
              <div className="border border-primary/40 bg-background p-5">
                <p className="eyebrow">Инвесторам</p>
                <p className="mt-2 font-display text-2xl leading-snug">от 30% годовых</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">И дополнительный доход от роста серии — новые города и продукты.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-10 flex flex-wrap gap-2">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={tab === t.id
                ? "border border-primary bg-primary px-5 py-2.5 text-sm font-semibold uppercase tracking-widest text-primary-foreground"
                : "border border-border bg-background px-5 py-2.5 text-sm font-semibold uppercase tracking-widest text-muted-foreground transition-colors hover:border-primary hover:text-foreground"}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "facilitator" && (
          <div className="grid gap-6 lg:grid-cols-[.9fr_1.1fr]">
            <div className="border-2 border-primary bg-background p-8">
              <Package className="size-8 text-primary" />
              <h3 className="mt-6 font-display text-3xl">Коробочная версия с обучающим видео</h3>
              <p className="mt-3 font-display text-5xl">75 000 ₽</p>
              <p className="mt-2 text-lg text-primary">или 7 500 ₽/мес · рассрочка на 12 мес (итого 90 000 ₽)</p>
              <div className="mt-6 border border-primary/40 bg-secondary p-6"><p className="eyebrow">Что будет после покупки</p><ol className="mt-4 space-y-3"><li className="flex gap-3 text-[15px] leading-6"><span className="font-semibold text-primary">01</span><span>Вы получаете обучающее видео.</span></li><li className="flex gap-3 text-[15px] leading-6"><span className="font-semibold text-primary">02</span><span>Самостоятельно настраиваете рекламу.</span></li><li className="flex gap-3 text-[15px] leading-6"><span className="font-semibold text-primary">03</span><span>Собираете группы на игры.</span></li><li className="flex gap-3 text-[15px] leading-6"><span className="font-semibold text-primary">04</span><span>Мы даём методологию, как после игры продавать тренинг на основе игры.</span></li><li className="flex gap-3 text-[15px] leading-6"><span className="font-semibold text-primary">05</span><span>Вы отдаёте 20% от прибыли с тренинга.</span></li></ol></div>
              <p className="mt-4 border-t border-border pt-4 text-sm text-muted-foreground">Участие в игре — 2 500 ₽ · демо-игра — 1 500 ₽</p>
              <ul className="mt-7 space-y-3 border-t border-border pt-7">
                {tariffFeatures.map((f) => (
                  <li key={f} className="flex gap-3 text-[15px] leading-6"><Check className="mt-0.5 size-4 shrink-0 text-primary" />{f}</li>
                ))}
              </ul>
              <Button asChild className="mt-8 w-full">
                <a href={TELEGRAM_URL} target="_blank" rel="noreferrer">Беру коробочную версию <ArrowRight /></a>
              </Button>
            </div>
            <div className="border border-border bg-background p-8">
              <GraduationCap className="size-8 text-primary" />
              <h3 className="mt-6 font-display text-3xl">Что входит в тариф</h3>
              <p className="mt-3 leading-7 text-muted-foreground">Всё необходимое, чтобы начать вести игры сразу после получения коробки — без длинного курса.</p>
              <div className="mt-7 space-y-5 border-t border-border pt-7">
                <div className="flex gap-4">
                  <span className="text-sm font-semibold text-primary">01</span>
                  <div>
                    <h4 className="font-display text-xl">Обучающий материал</h4>
                    <p className="mt-1 text-[15px] leading-6 text-muted-foreground">Методичка с правилами игры, структура встречи и видео с разбором проведения — всё, чтобы сесть за стол подготовленным.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="text-sm font-semibold text-primary">02</span>
                  <div>
                    <h4 className="font-display text-xl">Сопровождение</h4>
                    <p className="mt-1 text-[15px] leading-6 text-muted-foreground">Закрытый чат ведущих и помощь автора: если вы застряли или сомневаетесь — подскажем, как вести процесс дальше.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="text-sm font-semibold text-primary">03</span>
                  <div>
                    <h4 className="font-display text-xl">Тренинги на основе игры</h4>
                    <p className="mt-1 text-[15px] leading-6 text-muted-foreground">Проводите корпоративные тренинги и программы на основе игры «Раппóрт». Площадка берёт 20% комиссии с таких тренингов — остальное ваше.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "turnkey" && (
          <div className="space-y-6">
            <div className="border border-border bg-background p-8 lg:p-12">
              <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
                <div>
                  <Briefcase className="size-8 text-primary" />
                  <h3 className="mt-6 font-display text-4xl">Игра под ключ с упаковкой</h3>
                  <p className="mt-3 font-display text-5xl">200 000 ₽</p>
                  <p className="mt-2 text-lg text-primary">Доход от 150 000 ₽ в месяц</p>
                  <p className="mt-2 text-lg">Вложения от 8 333 ₽/мес</p>
                  <p className="mt-1 text-sm text-muted-foreground">Рассрочка без % и первого взноса на 1–2 года. Сразу получаете инструмент и начинаете зарабатывать.</p>
                  <div className="mt-6 border border-primary/40 bg-secondary p-6"><p className="eyebrow">Что будет после покупки</p><ol className="mt-4 space-y-3"><li className="flex gap-3 text-[15px] leading-6"><span className="font-semibold text-primary">01</span><span>Обучаем вас вести игры.</span></li><li className="flex gap-3 text-[15px] leading-6"><span className="font-semibold text-primary">02</span><span>Настраиваем общую рекламу и берём вас в рекламный пул ведущих.</span></li><li className="flex gap-3 text-[15px] leading-6"><span className="font-semibold text-primary">03</span><span>Распределяем заявки среди ведущих.</span></li><li className="flex gap-3 text-[15px] leading-6"><span className="font-semibold text-primary">04</span><span>Открываем доступ к онлайн-платформе.</span></li><li className="flex gap-3 text-[15px] leading-6"><span className="font-semibold text-primary">05</span><span>Делаем отдельную посадочную страницу о вас на общем сайте.</span></li><li className="flex gap-3 text-[15px] leading-6"><span className="font-semibold text-primary">06</span><span>Проводим 4 индивидуальные сессии с автором игры: распаковываем вас как ведущего и помогаем сформировать контент-план.</span></li></ol></div>
                  <InstallmentCalc total={200000} />
                  <p className="mt-4 text-lg leading-8 text-muted-foreground">
                    Готовый бизнес на игре: упаковка, обучение из 15 видеоуроков, сопровождение, настройка рекламы и общий сайт для сбора заявок.
                  </p>
                  <Button asChild className="mt-8">
                    <a href={TELEGRAM_URL} target="_blank" rel="noreferrer">Обсудить проект <ArrowRight /></a>
                  </Button>
                </div>
                <ul className="space-y-4 lg:border-l lg:border-border lg:pl-10">
                  {turnkeyFeatures.map((f) => (
                    <li key={f} className="flex gap-3 text-[15px] leading-6"><Check className="mt-0.5 size-4 shrink-0 text-primary" />{f}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="border border-border bg-background p-8">
              <GraduationCap className="size-8 text-primary" />
              <h3 className="mt-6 font-display text-3xl">Как проходит обучение</h3>
              <p className="mt-3 leading-7 text-muted-foreground">Один месяц — от знакомства с методикой до сертификата. Вы начнёте вести игры уже в первый месяц обучения.</p>
              <div className="mt-7 grid gap-x-10 gap-y-5 border-t border-border pt-7 md:grid-cols-2">
                {training.map((s, i) => (
                  <div key={s.title} className="flex gap-4">
                    <span className="text-sm font-semibold text-primary">0{i + 1}</span>
                    <div>
                      <h4 className="font-display text-xl">{s.title}</h4>
                      <p className="mt-1 text-[15px] leading-6 text-muted-foreground">{s.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "investor" && (
          <div className="border border-border bg-background p-8 lg:p-12">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
              <div>
                <TrendingUp className="size-8 text-primary" />
                <h3 className="mt-6 font-display text-4xl">Инвестиции в серию игр «Раппóрт»</h3>
                <p className="mt-3 font-display text-5xl text-primary">от 30% годовых</p>
                <p className="mt-4 text-lg leading-8 text-muted-foreground">
                  Серия игр «Раппóрт» растёт: новые города, ведущие и форматы. Предлагаем инвесторам войти в проект на этапе масштабирования — условия обсуждаем лично.
                </p>
                <div className="mt-6 border border-primary/40 bg-secondary p-6">
                  <p className="eyebrow">Что вы получаете дополнительно</p>
                  <ul className="mt-4 space-y-3">
                    <li className="flex gap-3 text-[15px] leading-6"><Check className="mt-0.5 size-4 shrink-0 text-primary" />Долю в выручке с новых городов — каждый запуск ведущих в регионе приносит доход без вашего участия</li>
                    <li className="flex gap-3 text-[15px] leading-6"><Check className="mt-0.5 size-4 shrink-0 text-primary" />Процент с каждой проданной коробки и каждой игры в ваших городах</li>
                    <li className="flex gap-3 text-[15px] leading-6"><Check className="mt-0.5 size-4 shrink-0 text-primary" />Доход с онлайн-платформы: игры идут без границ, без аренды и без затрат на площадки</li>
                    <li className="flex gap-3 text-[15px] leading-6"><Check className="mt-0.5 size-4 shrink-0 text-primary" />Первое право на новые игры серии — до открытых продаж</li>
                    <li className="flex gap-3 text-[15px] leading-6"><Check className="mt-0.5 size-4 shrink-0 text-primary" />Пассивный доход: команда ведёт операционку, вы получаете отчётность и дивиденды</li>
                  </ul>
                </div>
                <Button asChild className="mt-8">
                  <a href={TELEGRAM_URL} target="_blank" rel="noreferrer">Обсудить условия <ArrowRight /></a>
                </Button>
              </div>
              <ul className="space-y-4 lg:border-l lg:border-border lg:pl-10">
                {investorFeatures.map((f) => (
                  <li key={f} className="flex gap-3 text-[15px] leading-6"><Check className="mt-0.5 size-4 shrink-0 text-primary" />{f}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

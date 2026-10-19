import { Link } from "@tanstack/react-router";
import { ArrowLeft, CalendarDays, Check, Coffee, HeartHandshake, MessageCircle, Repeat, Sparkles, Users, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { openBookingWidget } from "@/components/booking-format";
import { GameOrderForm } from "@/components/game-order-form";
import { Reveal } from "@/components/business-interactive";
import { BeautySkillCards } from "@/components/beauty-skill-cards";
import { gameDetails } from "@/data/game-details";
import beautyCutout from "@/assets/rapport-beauty-cutout.webp";

// Коммерческое предложение «Раппóрт Beauty» — тексты из презентации автора для владельцев салонов.
const FACTS = [
  ["68%", "клиентов уходят из-за равнодушного отношения персонала — а не из-за цены или качества"],
  ["30", "потенциальных клиентов в среднем отпугивает 1 негативный отзыв в соцсетях"],
  ["5–7×", "дороже привлечь нового клиента, чем удержать существующего"],
  ["1 час+", "клиент общается с сотрудниками — вы либо укрепляете лояльность, либо теряете его"],
];
const PAINS = ["Ждут, пока клиент сам скажет, что ему нужно", "Не предлагают дополнительные услуги", "Молчат, когда клиент хочет поговорить", "Теряются при жалобах и конфликтах", "Не выручают друг друга, если кто-то заболел"];
const ROLES = [
  { t: "Мастер", d: "Чувствует, хочет ли клиент говорить, поддерживает разговор и предлагает уход с заботой, а не с продажей." },
  { t: "Администратор", d: "Встречает, решает вопрос со скидкой, сохраняя лицо, и спасает ситуацию, когда что-то пошло не так." },
  { t: "Клиент", d: "Самая важная роль: сотрудник оказывается на месте гостя и понимает его чувства изнутри." },
  { t: "Руководитель", d: "Видит команду со стороны и закрепляет стандарты, о которых договорились все вместе." },
];
const BEFORE_AFTER = [
  ["Мастер молчит, клиент скучает", "Мастер определяет, хочет ли клиент говорить, и поддерживает разговор"],
  ["Администратор говорит «подождите администратора»", "Мастер делает кофе клиенту, даже если администратор опаздывает"],
  ["Клиент просит скидку — администратор теряется", "Администратор предлагает альтернативу, сохраняя лицо"],
  ["Стол после клиента не убран", "Уборка после каждого клиента — автоматизм"],
  ["Сотрудник не предлагает дополнительные услуги", "Мастер предлагает уход с заботой, а не с продажей"],
];
const SKILLS = [
  ["Эмпатия и активное слушание", "клиент чувствует, что его понимают"],
  ["Гибкость в конфликтах", "ни одна жалоба не перерастает в скандал"],
  ["Инициативность", "сотрудники не ждут указаний, а действуют сами"],
  ["Допродажи с заботой", "средний чек растёт на 15–20%"],
  ["Командная взаимовыручка", "никто не остаётся один на один с проблемой"],
  ["Стандарты чистоты и вида", "доверие клиентов растёт"],
];
const SCENARIOS = [
  "Клиент пришёл на маникюр, администратор опоздал, кофе не подали — как исправить?",
  "Клиент требует скидку, хотя не наработал статус постоянного — как отказать вежливо?",
  "Мастер устал и не хочет говорить — клиент обижается",
  "Клиент видит грязный стол — как спасти репутацию?",
];
const STEPS = [["1 мин", "Выбор сценария", "ведущий достаёт карточку"], ["5 мин", "Отыгрыш", "два сотрудника разыгрывают диалог"], ["10 мин", "Обратная связь", "группа обсуждает, что было хорошо и что улучшить"], ["5 мин", "Повтор с решением", "те же роли по-новому, с подсказкой"], ["5 мин", "Выводы", "какие стандарты закрепить в салоне"]];
const RESULTS = [["+25%", "повторных визитов"], ["+15%", "средний чек"], ["+40%", "положительных отзывов"], ["−30%", "текучка персонала"], ["−50%", "конфликтов с клиентами"]];
const KIT = ["Колода сценариев — 60+ реальных ситуаций, по 5–10 на каждый отдел", "Колода форматов — 6 способов отыгрыша", "Колода решений — готовые фразы и алгоритмы для сложных случаев", "Инструкция для ведущего — тайминг и вопросы для обсуждения", "Бонус: чек-листы и карточки навыков (активное слушание, «Я-сообщения» и др.)"];
const START = ["Закажите комплект — пришлём коробку с материалами", "Назначьте ведущего — администратора или старшего мастера", "Проведите первую игру на планёрке", "Играйте каждую неделю — актуальные сценарии", "Фиксируйте результаты — через месяц изменения в настроении и отзывах"];

export function BeautyOffer() {
  return <>
    <section className="relative overflow-hidden bg-foreground text-background">
      <div data-parallax className="absolute inset-0 bg-hero-glow will-change-transform" />
      <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-8 lg:px-8 lg:pb-24">
        <Link to="/games" className="inline-flex items-center gap-2 text-sm text-background/80 hover:text-accent"><ArrowLeft className="size-4" />Все игры</Link>
        <div className="mt-10 grid items-center gap-10 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <p className="eyebrow text-accent">Для салонов и студий красоты</p>
            <h1 className="mt-4 font-display text-5xl leading-[0.98] sm:text-7xl">Раппóрт <em className="text-accent">Beauty</em></h1>
            <p className="mt-6 max-w-2xl text-xl leading-8 text-background/90">Игра, которая меняет ваш салон изнутри: превращаем сотрудников в команду заботы, а клиентов — в постоянных гостей.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" onClick={openBookingWidget}><CalendarDays />Получить демо-сценарии</Button>
              <Button asChild size="lg" variant="secondary"><a href="#beauty-order">Обсудить внедрение</a></Button>
            </div>
          </div>
          <img src={beautyCutout} alt="Коробка игры «Раппóрт Beauty»" width={640} height={640} className="mx-auto w-full max-w-sm drop-shadow-2xl" />
        </div>
        <dl className="mt-14 grid grid-cols-3 gap-4 border-t border-background/25 pt-8">
          {[["30–40", "минут в неделю на планёрке"], ["60+", "реальных ситуаций салона"], ["6", "навыков, влияющих на прибыль"]].map(([v, l]) => <div key={l}><dt className="font-display text-4xl text-accent sm:text-6xl">{v}</dt><dd className="mt-2 text-sm text-background/85 sm:text-base">{l}</dd></div>)}
        </dl>
      </div>
    </section>

    <section className="section">
      <div className="section-inner">
        <p className="eyebrow">Знаете ли вы?</p>
        <h2 className="section-title max-w-4xl">Клиент уходит не из-за цены — <em>а из-за чувства</em></h2>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FACTS.map(([v, l], i) => <Reveal key={v} delay={i * 100}><div className="card-lift h-full rounded-3xl border border-border bg-card p-6"><p className="font-display text-5xl text-primary">{v}</p><p className="mt-3 text-muted-foreground">{l}</p></div></Reveal>)}
        </div>
      </div>
    </section>

    <section className="section bg-secondary">
      <div className="section-inner grid gap-12 lg:grid-cols-2">
        <div>
          <p className="eyebrow">Главная проблема</p>
          <h2 className="section-title">Сотрудники <em>не видят клиента</em></h2>
          <ul className="mt-8 space-y-3">{PAINS.map((p, i) => <Reveal key={p} delay={i * 70}><li className="flex gap-3 text-lg"><X className="mt-1 size-5 shrink-0 text-destructive" />{p}</li></Reveal>)}</ul>
          <p className="mt-8 font-display text-2xl">Итог: клиенты уходят, средний чек стоит, текучка растёт.</p>
        </div>
        <div className="rounded-3xl bg-card p-8 shadow-sm">
          <h3 className="font-display text-3xl">Почему обычные тренинги не работают</h3>
          <ul className="mt-6 space-y-3 text-muted-foreground">
            {["Лекции забываются через 2 дня", "Ролевые игры — раз в год и не закрепляются", "Скрипты механичны и не работают в живых ситуациях", "Нет регулярной тренировки до автоматизма"].map((x) => <li key={x}>— {x}</li>)}
          </ul>
          <p className="mt-6 font-semibold">Нужна система, встроенная в жизнь салона, которая превращает обучение в привычку.</p>
        </div>
      </div>
    </section>

    <BeautySkillCards />

    <section className="section">
      <div className="section-inner">
        <p className="eyebrow">Роли в игре</p>
        <h2 className="section-title max-w-4xl">Побыть на месте другого — <em>и понять его</em></h2>
        <p className="mt-6 max-w-3xl text-lg text-muted-foreground">Сотрудники играют персонажа, а не себя: обратная связь — персонажу, без осуждения. Поэтому в игре безопасно ошибаться и пробовать.</p>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ROLES.map((r, i) => <div key={r.t} className="card-lift rounded-3xl border border-border bg-card p-6"><span className="font-display text-4xl text-primary">0{i + 1}</span><h3 className="mt-4 font-display text-2xl">{r.t}</h3><p className="mt-2 text-muted-foreground">{r.d}</p></div>)}
        </div>
      </div>
    </section>

    <section className="section bg-foreground text-background">
      <div className="section-inner">
        <p className="eyebrow text-accent">Реальные сценарии</p>
        <h2 className="section-title max-w-4xl">Ситуации, которые <em className="text-accent">случаются у вас каждый день</em></h2>
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {SCENARIOS.map((s) => <blockquote key={s} className="rounded-3xl border border-background/20 p-6 font-display text-xl leading-snug sm:text-2xl"><MessageCircle className="mb-3 text-accent" />«{s}»</blockquote>)}
        </div>
        <p className="mt-8 text-background/85">Все сценарии адаптируются под ваш салон: названия, цены, услуги, правила.</p>
      </div>
    </section>

    <section className="section">
      <div className="section-inner">
        <p className="eyebrow">Навыки</p>
        <h2 className="section-title">6 навыков, которые <em>влияют на прибыль</em></h2>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SKILLS.map(([t, d]) => <div key={t} className="rounded-3xl bg-secondary p-6"><Sparkles className="text-primary" /><h3 className="mt-4 font-display text-2xl">{t}</h3><p className="mt-2 text-muted-foreground">→ {d}</p></div>)}
        </div>
      </div>
    </section>

    <section className="section bg-secondary">
      <div className="section-inner">
        <p className="eyebrow">Как меняется поведение</p>
        <h2 className="section-title">Без игры <em>и с игрой</em></h2>
        <div className="mt-12 grid gap-3">
          {BEFORE_AFTER.map(([a, b]) => <div key={a} className="grid gap-3 md:grid-cols-2"><div className="flex gap-3 rounded-2xl bg-card p-5 text-muted-foreground"><X className="size-5 shrink-0 text-destructive" />{a}</div><div className="flex gap-3 rounded-2xl bg-primary p-5 text-primary-foreground"><Check className="size-5 shrink-0" />{b}</div></div>)}
        </div>
      </div>
    </section>

    <section className="section">
      <div className="section-inner">
        <p className="eyebrow">Формат</p>
        <h2 className="section-title">30 минут = <em>максимум пользы</em></h2>
        <ol className="mt-12 grid gap-4 md:grid-cols-5">
          {STEPS.map(([time, t, d]) => <li key={t} className="rounded-3xl border border-border bg-card p-6"><span className="text-sm font-bold uppercase tracking-widest text-primary">{time}</span><h3 className="mt-3 font-display text-2xl">{t}</h3><p className="mt-2 text-sm text-muted-foreground">{d}</p></li>)}
        </ol>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[[Repeat, "Раз в неделю", "Как в спорте: регулярная практика формирует устойчивый навык и не даёт забыть."], [Coffee, "Без отрыва от работы", "Игра проходит на планёрке и не вырывает людей из графика."], [HeartHandshake, "Традиция команды", "Её ждут, она сближает коллектив и помогает быстро обновлять стандарты."]].map(([I, t, d]) => { const Icon = I as typeof Repeat; return <div key={t as string} className="rounded-3xl bg-secondary p-6"><Icon className="text-primary" /><h3 className="mt-4 font-display text-2xl">{t as string}</h3><p className="mt-2 text-muted-foreground">{d as string}</p></div>; })}
        </div>
      </div>
    </section>

    <section className="section bg-foreground text-background">
      <div className="section-inner">
        <p className="eyebrow text-accent">Выгода для салона</p>
        <h2 className="section-title">Результаты <em className="text-accent">за 3 месяца</em></h2>
        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-5">
          {RESULTS.map(([v, l]) => <div key={l} className="rounded-3xl border border-background/20 p-6"><p className="font-display text-5xl text-accent">{v}</p><p className="mt-2 text-background/85">{l}</p></div>)}
        </div>
        <p className="mt-4 text-sm text-background/70">Данные основаны на пилотных внедрениях в салонах-партнёрах.</p>
        <div className="mt-10 rounded-3xl bg-background/10 p-8">
          <h3 className="font-display text-3xl">Как игра спасла постоянного клиента</h3>
          <p className="mt-4 leading-7 text-background/90">Мастер ошибся с окрашиванием на тон. Клиентка в ярости, администратор по скрипту извинился и предложил переделать через неделю — клиентка ушла навсегда. После того как сценарий отработали в игре, мастер знает: сразу предложить смывку, компенсировать время и подарить бонусную карту. Через месяц клиентка вернулась — и привела подругу.</p>
        </div>
      </div>
    </section>

    <section className="section">
      <div className="section-inner grid gap-12 lg:grid-cols-2">
        <div>
          <p className="eyebrow">Комплект игры</p>
          <h2 className="section-title">Что <em>в коробке</em></h2>
          <ul className="mt-8 space-y-3">{KIT.map((k) => <li key={k} className="flex gap-3"><Check className="mt-1 size-5 shrink-0 text-primary" />{k}</li>)}</ul>
          <p className="mt-6 text-muted-foreground">Всё адаптируется под ваши цены, услуги и внутренние правила.</p>
        </div>
        <div>
          <p className="eyebrow">Как начать</p>
          <h2 className="section-title">5 шагов <em>к команде заботы</em></h2>
          <ol className="mt-8 space-y-3">{START.map((s, i) => <li key={s} className="flex gap-4"><span className="font-display text-2xl text-primary">{i + 1}</span><span className="pt-1">{s}</span></li>)}</ol>
          <p className="mt-6 text-muted-foreground"><Users className="mr-2 inline size-4" />Для крупных салонов — выездной мастер-класс по внедрению.</p>
        </div>
      </div>
    </section>

    <section className="section bg-secondary">
      <div className="section-inner">
        <p className="eyebrow">Стоимость</p>
        <h2 className="section-title max-w-4xl">Стоимость игры — <em>одна средняя услуга</em> вашего салона</h2>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {[["30–50 тыс. ₽", "приносит салону один постоянный клиент в год"], ["300–500 тыс. ₽", "убытка — потеря 10 клиентов из-за плохого сервиса"], ["1 месяц", "окупаемость за счёт удержания клиентов и роста продаж"]].map(([v, l]) => <div key={v} className="rounded-3xl bg-card p-8 shadow-sm"><p className="font-display text-4xl text-primary">{v}</p><p className="mt-3 text-muted-foreground">{l}</p></div>)}
        </div>
      </div>
    </section>

    <section className="section border-t border-border">
      <div className="section-inner">
        <p className="eyebrow">Форматы и стоимость</p>
        <h2 className="section-title mt-3">Выберите, как играть</h2>
        <div className="mt-6 grid gap-3 sm:mt-10 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
          {gameDetails["beauty"]?.pricing?.map((p) => (
            <Reveal key={p.label} className="flex flex-col border border-border bg-card p-6">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">{p.label}</p>
              <p className="mt-3 font-display text-4xl">{p.price}</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{p.note}</p>
              <Button type="button" className="mt-6" onClick={openBookingWidget}>Записаться</Button>
            </Reveal>
          ))}
        </div>
      </div>
    </section>

    <section id="beauty-order" className="game-story-booking"><div className="section-inner"><p className="eyebrow">Ваш следующий шаг</p><h2>Начните играть<br />на следующей планёрке</h2><p>Не ждите негативных отзывов. Напишите нам — пришлём демо-версию сценариев и расскажем, как адаптировать игру под ваш салон.</p><GameOrderForm gameTitle="Раппóрт Beauty" /></div></section>
  </>;
}

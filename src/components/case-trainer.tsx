import { useState } from "react";
import { CheckCircle2, RotateCcw, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

type Case = { situation: string; options: { text: string; ok: boolean; why: string }[] };

// Draft cases written by the agent — replace with real game cases when the owner provides them.
export const TRAINER_CASES: Record<"beauty" | "business" | "rapport", { eyebrow: string; title: string; cases: Case[] }> = {
  rapport: {
    eyebrow: "Тренажёр · Как настроить раппорт",
    title: "Раппорт — это доверие с полуслова. Потренируйтесь его создавать",
    cases: [
      { situation: "Собеседник говорит медленно и тихо, подбирает слова. Вы обычно говорите быстро и громко.", options: [
        { text: "Говорить как обычно — так энергичнее.", ok: false, why: "Разница в темпе ощущается как давление: человек закрывается." },
        { text: "Немного замедлиться и понизить голос, подстроившись под его темп.", ok: true, why: "Подстройка по темпу и громкости — самый быстрый путь к ощущению «мы на одной волне»." },
        { text: "Попросить его говорить побыстрее.", ok: false, why: "Замечание о манере речи разрушает контакт с первых минут." },
      ] },
      { situation: "Человек сидит, скрестив руки, и откинулся на спинку стула.", options: [
        { text: "Сразу копировать каждое его движение.", ok: false, why: "Явное зеркалирование выглядит как передразнивание." },
        { text: "Мягко принять похожую позу и постепенно «вести» к более открытой.", ok: true, why: "Сначала присоединение, потом ведение: человек расслабляется вслед за вами." },
        { text: "Наклониться к нему как можно ближе.", ok: false, why: "Вторжение в личное пространство усиливает защиту." },
      ] },
      { situation: "Собеседник говорит: «Я вижу, что проект буксует, картина пока мутная».", options: [
        { text: "«Давайте я вам всё прорисую — посмотрим, где прояснить».", ok: true, why: "Вы говорите на его «визуальном» языке — и он чувствует, что его понимают." },
        { text: "«Я слышу вас, давайте обсудим».", ok: false, why: "Не ошибка, но вы говорите на своём языке, а не на его." },
        { text: "«Ничего не буксует, всё нормально».", ok: false, why: "Обесценивание его восприятия рвёт контакт." },
      ] },
      { situation: "Коллега расстроен: «Меня опять не позвали на встречу».", options: [
        { text: "«Да ладно, ничего важного там не было».", ok: false, why: "Утешение до признания чувств звучит как отмахивание." },
        { text: "«Обидно, когда узнаёшь последним. Что для тебя было бы важно?»", ok: true, why: "Подстройка по эмоции: сначала назвать чувство, потом идти к решению." },
        { text: "«Сам виноват, надо было напомнить о себе».", ok: false, why: "Оценка вместо поддержки — и раппорт потерян." },
      ] },
      { situation: "Вы хотите предложить идею человеку, который к вам пока насторожен.", options: [
        { text: "Сразу выложить идею и аргументы.", ok: false, why: "Без контакта любые аргументы встречают сопротивление." },
        { text: "Сначала согласиться с тем, что для него важно, и только потом предложить.", ok: true, why: "Несколько «да» подряд создают доверие — и новая идея звучит как продолжение его мысли." },
        { text: "Сказать, что его опасения напрасны.", ok: false, why: "Спор с чувствами собеседника превращает разговор в борьбу." },
      ] },
    ],
  },
  beauty: {
    eyebrow: "Тренажёр · Раппóрт Beauty",
    title: "Кейсы салона: как ответить клиенту",
    cases: [
      { situation: "Клиентка после окрашивания говорит: «Это совсем не тот оттенок, который я хотела».", options: [
        { text: "«Мы делали строго по вашему фото».", ok: false, why: "Спор о правоте усиливает обиду — клиентка уходит с ощущением, что её не слышат." },
        { text: "«Давайте посмотрим вместе: что именно не так — тон, яркость?»", ok: true, why: "Вы признаёте её чувства и переводите разговор в совместный поиск решения." },
        { text: "«Через пару моек цвет сам смоется».", ok: false, why: "Обещание «само пройдёт» обесценивает проблему здесь и сейчас." },
      ] },
      { situation: "Постоянная клиентка опоздала на 25 минут, а следующая запись уже через час.", options: [
        { text: "Молча сделать процедуру быстрее и хуже.", ok: false, why: "Качество страдает, а правила так и остаются непроговорёнными." },
        { text: "Отказать и попросить перезаписаться.", ok: false, why: "Жёсткий отказ без выбора разрушает долгий контакт." },
        { text: "Честно сказать, сколько времени осталось, и предложить, что успеем сделать.", ok: true, why: "Открытость и выбор сохраняют и отношения, и ваше расписание." },
      ] },
      { situation: "Клиент во время стрижки жалуется на личные проблемы и спрашивает: «А вы бы что сделали?»", options: [
        { text: "Дать подробный совет из своей жизни.", ok: false, why: "Советы мастера легко становятся поводом для обиды, если «не сработало»." },
        { text: "Выслушать и спросить: «А что вам самому кажется правильным?»", ok: true, why: "Вы поддерживаете, не забирая ответственность за чужое решение." },
        { text: "Сменить тему на погоду.", ok: false, why: "Клиент чувствует, что его отвергли, — доверие падает." },
      ] },
    ],
  },
  business: {
    eyebrow: "Тренажёр · Раппóрт Бизнес",
    title: "Кейсы команды: как поступить руководителю",
    cases: [
      { situation: "Сильный сотрудник второй раз срывает срок и на планёрке говорит: «Мне не дали данных вовремя».", options: [
        { text: "Публично отчитать, чтобы другим было неповадно.", ok: false, why: "Публичная критика включает защиту — причины так и не всплывут." },
        { text: "Поговорить один на один: что мешает и что нужно, чтобы успевать.", ok: true, why: "Вы отделяете человека от проблемы и получаете реальную причину." },
        { text: "Забрать задачу себе.", ok: false, why: "Проблема повторится, а вы станете узким горлышком команды." },
      ] },
      { situation: "Двое коллег в конфликте, и каждый по отдельности просит вас «разобраться с другим».", options: [
        { text: "Встать на сторону того, кто ценнее для проекта.", ok: false, why: "Вы становитесь участником конфликта, а не руководителем." },
        { text: "Собрать обоих и договориться о правилах совместной работы.", ok: true, why: "Ответственность за договорённость остаётся у тех, кто будет её выполнять." },
        { text: "Подождать — само рассосётся.", ok: false, why: "Скрытый конфликт растёт и заражает остальную команду." },
      ] },
      { situation: "Клиент на переговорах резко говорит: «У конкурентов дешевле на 20%».", options: [
        { text: "Сразу дать такую же скидку.", ok: false, why: "Вы уступаете, не узнав, что на самом деле важно клиенту." },
        { text: "Спросить: «Что для вас важнее всего в этом решении, кроме цены?»", ok: true, why: "Вопрос переводит торг в разговор о ценности." },
        { text: "Сказать, что конкуренты работают хуже.", ok: false, why: "Критика конкурента звучит как оправдание и снижает доверие." },
      ] },
    ],
  },
};

export function CaseTrainer({ kind }: { kind: "beauty" | "business" | "rapport" }) {
  const set = TRAINER_CASES[kind];
  const [i, setI] = useState(0);
  const [pick, setPick] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const done = i >= set.cases.length;
  const c = set.cases[i];
  const choose = (n: number) => { if (pick !== null || !c) return; setPick(n); if (c.options[n]?.ok) setScore((s) => s + 1); };
  return <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
    <p className="eyebrow">{set.eyebrow}</p>
    <h2 className="mt-2 font-display text-3xl md:text-4xl">{set.title}</h2>
    {done ? <div className="mt-6">
      <p className="font-display text-2xl">Верных решений: {score} из {set.cases.length}</p>
      <p className="mt-2 text-muted-foreground">На игре такие ситуации разыгрываются вживую — и вы пробуете новый ответ на себе.</p>
      <Button variant="outline" className="mt-5" onClick={() => { setI(0); setPick(null); setScore(0); }}><RotateCcw />Пройти ещё раз</Button>
    </div> : c && <div className="mt-6">
      <p className="text-sm text-muted-foreground">Кейс {i + 1} из {set.cases.length}</p>
      <p className="mt-2 text-lg leading-8">{c.situation}</p>
      <p className="mt-4 font-medium">Как бы вы поступили? Выберите один вариант ответа, который, по вашему мнению, поможет сохранить контакт. После выбора появится объяснение.</p>
      <div className="mt-5 grid gap-3">{c.options.map((o, n) => {
        const shown = pick !== null && (n === pick || o.ok);
        return <Button variant="outline" key={n} type="button" onClick={() => choose(n)} disabled={pick !== null}
          className={`h-auto w-full flex-col items-stretch whitespace-normal rounded-xl border p-4 text-left transition-colors ${shown ? (o.ok ? "border-primary bg-primary/10" : "border-destructive bg-destructive/10") : "border-border hover:bg-secondary"}`}>
          <span className="flex items-start gap-2">{shown && (o.ok ? <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" /> : <XCircle className="mt-0.5 size-5 shrink-0 text-destructive" />)}{o.text}</span>
          {shown && <span className="mt-2 block text-sm text-muted-foreground">{o.why}</span>}
        </Button>;
      })}</div>
      {pick !== null && <Button className="mt-5" onClick={() => { setI(i + 1); setPick(null); }}>{i + 1 < set.cases.length ? "Следующий кейс" : "Итог"}</Button>}
    </div>}
  </div>;
}

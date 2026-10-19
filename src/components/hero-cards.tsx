import { useState } from "react";
import { openBookingWidget } from "@/components/booking-format";
import { ArrowDown, ArrowRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import zvPurple from "@/assets/zhit-vmeste-purple.webp";
import zvBlue from "@/assets/zhit-vmeste-blue.webp";
import bMc from "@/assets/beauty-master-client.webp";
import bLm from "@/assets/beauty-lead-master.webp";
import zhD from "@/assets/zh-devochka.webp";
import zhZh from "@/assets/zh-zhelaniya.webp";
import zhZd from "@/assets/zh-zdorovie.webp";
import bizCover from "@/assets/rapport-business-cutout.webp";

// Draft life situations written by the agent — replace with real game cards when the owner provides them.
// Отношения: pink cover = women's card, blue cover = men's card.
const S = {
  relF: [
    "Он снова уткнулся в телефон, пока вы рассказываете про свой день. Вы замолкаете на полуслове — он даже не замечает.",
    "Вы приготовили ужин и ждали. Он пишет: «Задержусь, поешь без меня». Третий раз за неделю.",
    "Подруга говорит: «Твой опять на тебя голос повысил при всех?» Вы улыбаетесь и отвечаете: «Да нормально всё».",
    "Он говорит: «Ты слишком много тратишь». Вы молча убираете в шкаф новое платье с биркой.",
    "Вы предлагаете съездить к морю вдвоём. Он отвечает: «Давай с моими родителями, им будет приятно».",
    "Вы плачете в ванной, чтобы он не услышал. Потом выходите и говорите: «Всё хорошо, просто устала».",
  ],
  relM: [
    "Она говорит: «Ты меня совсем не слышишь». Вы как раз пытались объяснить, как решить её проблему.",
    "Вы пришли с работы выжатым. Она с порога: «Нам надо поговорить». Вы чувствуете, как сжимается внутри.",
    "Она снова сравнивает вас с мужем подруги: «А вот он её в Италию свозил».",
    "Вы хотели провести выходной с друзьями. Она молчит весь вечер, а на вопрос «что случилось?» отвечает «ничего».",
    "Она плачет, а вы не понимаете, что сделали не так. И просто уходите в другую комнату.",
    "Вы давно хотите сменить работу, но боитесь сказать: вдруг она решит, что вы не справляетесь.",
  ],
  self1: [
    "В детстве вам говорили «не выдумывай». Теперь вы снова молчите на совещании, хотя знаете ответ.",
    "Мама звонит и спрашивает: «Ну когда ты уже нормально заживёшь?» Вам сорок, и вы снова чувствуете себя девочкой.",
  ],
  self2: [
    "Вы в магазине держите вещь, которая вам очень нравится, и вешаете обратно: «Детям нужнее».",
    "Вас спрашивают: «А чего ты сама хочешь?» — и вы не можете ответить.",
  ],
  self3: [
    "Третью неделю вы просыпаетесь уставшей и говорите себе: «Отдохну в отпуске».",
    "Вы смотрите в зеркало и первой мыслью ругаете себя, а не здороваетесь.",
  ],
  beautyMC: [
    "Клиентка смотрит в зеркало после стрижки и говорит: «Я же просила совсем не так». В салоне полно людей.",
    "Постоянная клиентка опоздала на 40 минут и обиделась, что вы не можете принять её сейчас.",
    "Клиентка весь сеанс рассказывает про развод, а потом спрашивает: «А вы бы что сделали?»",
  ],
  beautyLM: [
    "Руководитель при клиенте делает вам замечание: «Опять у тебя на рабочем месте бардак».",
    "Вам ставят ещё одну запись в конце смены. Вы уже отказали подруге во встрече.",
    "Руководитель говорит: «Клиент на тебя пожаловался» — и не объясняет, кто и за что.",
  ],
  biz: [
    "Начальник на планёрке отдаёт ваш проект коллеге: «Ему виднее». Все смотрят на вас.",
    "Сотрудник третий раз срывает срок и говорит: «Я же не робот».",
    "Клиент кричит в трубку, что вы его обманули, хотя всё было в договоре.",
    "Коллега присвоил вашу идею на встрече с директором. Вы сидите рядом и молчите.",
    "Вас просят выйти в выходной «всего на пару часов». Опять.",
    "Вы предложили решение, а руководитель ответил: «Не умничай, делай как сказано».",
  ],
};

const GAMES = [
  { label: "Раппóрт — Отношения", covers: [zvPurple, zvBlue], sets: [S.relF, S.relM], tags: ["Женская карта", "Мужская карта"] },
  { label: "Раппóрт — Живая", covers: [zhD, zhZh, zhZd], sets: [S.self1, S.self2, S.self3], tags: ["Девочка внутри", "Я и мои желания", "Я и моё здоровье"] },
  { label: "Раппóрт Beauty", covers: [bMc, bLm], sets: [S.beautyMC, S.beautyLM], tags: ["Мастер — клиент", "Руководитель — мастер"] },
  { label: "Раппóрт Бизнес", covers: [bizCover], sets: [S.biz], tags: ["Ситуация"] },
];

function pick3(n: number) {
  const idx = Array.from({ length: n }, (_, i) => i).sort(() => Math.random() - 0.5);
  return idx.slice(0, 3);
}

/** Hero hook: choose a game, flip one of three face-down cards. */
export function HeroCards() {
  const [g, setG] = useState(0);
  const [order, setOrder] = useState<number[]>([0, 1, 2]);
  const [open, setOpen] = useState<number | null>(null);
  const game = GAMES[g]!;
  const text = (k: number, ci: number) => { const set = game.sets[k % game.sets.length]!; return set[ci % set.length]!; };
  const tag = (k: number) => game.tags[k % game.tags.length]!;

  const choose = (i: number) => { setG(i); setOpen(null); setOrder(pick3(6)); };
  const reset = () => { setOpen(null); setOrder(pick3(6)); };

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Выберите игру">
        {GAMES.map((x, i) => (
          <button key={x.label} role="tab" aria-selected={i === g} onClick={() => choose(i)}
            className={`rounded-full border px-4 py-2 text-sm transition-colors ${i === g ? "border-accent bg-accent text-accent-foreground" : "border-background/40 text-background hover:border-accent"}`}>{x.label}</button>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3 sm:gap-5">
        {order.map((ci, k) => {
          const isOpen = open === k;
          const dim = open !== null && !isOpen;
          return (
            <button key={`${g}-${ci}`} type="button" data-open={isOpen} onClick={() => open === null && setOpen(k)} disabled={open !== null && !isOpen}
              aria-label={isOpen ? text(k, ci) : `Перевернуть карту ${k + 1}`}
              className={`flip-card aspect-[3/4] w-full text-left transition-[opacity,transform] duration-500 ${dim ? "scale-95 opacity-40" : open === null ? "hover:-translate-y-2" : ""}`}>
              <span className="flip-inner block">
                <span className="flip-face overflow-hidden border border-accent/60 bg-primary shadow-2xl">
                  <img src={game.covers[k % game.covers.length]} alt="" width={300} height={400} loading="eager" fetchPriority={g === 0 && k === 0 ? "high" : "auto"} decoding={k === 0 ? "sync" : "async"} className="h-full w-full object-cover" />
                </span>
                <span className="flip-face flip-back flex flex-col justify-between bg-background p-3 text-foreground shadow-2xl sm:p-5">
                  <span className="text-[0.6rem] font-bold uppercase tracking-widest text-primary sm:text-xs">{tag(k)}</span>
                  <span className="hidden font-display text-base leading-snug lg:text-lg sm:block">{text(k, ci)}</span><span className="font-display text-3xl text-primary sm:hidden" aria-hidden>↓</span>
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-6 min-h-28" aria-live="polite">
        {open === null ? (
          <p className="text-background/80">Выберите игру и переверните одну карту. <span className="text-accent">Часто участники вытягивают именно свой жизненный сценарий.</span></p>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <p className="mb-4 font-display text-xl leading-snug text-background sm:hidden">«{text(open, order[open]!)}»</p>
            <p className="font-display text-2xl text-background">У вас было такое?</p>
            <p className="mt-1 text-background/85">В игре «{game.label}» — более 20 000 сценариев и 100 навыков. Попробуйте разные роли и найдите свои варианты решения — за персонажа, без осуждения.</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button size="lg" onClick={openBookingWidget}>Да, хочу сыграть <ArrowRight /></Button>
              <Button asChild size="lg" variant="secondary"><a href="#audience">Узнать больше <ArrowDown /></a></Button>
              <Button size="lg" variant="ghost" className="text-background hover:bg-background/10 hover:text-background" onClick={reset}><RotateCcw /> Другая карта</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

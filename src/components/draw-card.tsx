import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import bizScenario from "@/assets/cards/business-scenario.webp";
import bizNonverbal from "@/assets/cards/business-nonverbal.webp";

// Relationship cards approved by the owner; "Про себя" and "Бизнес" are drafts awaiting review.
export const DECKS = {
  "Отношения": [
    "Что вы делаете, когда близкий человек молчит после ссоры: ждёте, спрашиваете или уходите в дела?",
    "Что вам легче: попросить о поддержке или предложить её?",
    "О чём вы давно хотите сказать партнёру, но откладываете?",
    "По каким мелочам вы понимаете, что вас любят?",
    "Какую роль вы чаще берёте в паре: того, кто решает, или того, кто подстраивается?",
    "Что из родительской семьи вы повторяете в своих отношениях — и хотите ли этого?",
  ],
  "Про себя": [
    "Когда вы последний раз делали что-то только для себя?",
    "Какую свою черту вы прячете от других — и зачем?",
    "Чего вы ждёте от себя, но никогда не простили бы так другому?",
    "Что вы сказали бы себе в десять лет?",
    "В какой момент дня вы по-настоящему чувствуете жизнь?",
    "От чего вы давно хотите отказаться, но держитесь по привычке?",
  ],
  "Бизнес": [
    "Как вы реагируете, когда коллега не выполнил обещанное в срок?",
    "Что вам сложнее: сказать «нет» клиенту или руководителю?",
    "Какое решение в команде вы откладываете, потому что боитесь конфликта?",
    "За что вас ценят коллеги — и совпадает ли это с тем, за что цените себя вы?",
    "Как вы просите о помощи, когда не успеваете?",
    "Какую роль вы берёте на совещаниях: ведущего, критика или наблюдателя?",
  ],
  // Draft Beauty questions — scenarios «Мастер — клиент», «Руководитель — мастер»; replace with real cards when provided.
  "Beauty": [
    "Клиент недоволен результатом, хотя сделано по его фото. Что вы скажете первым?",
    "Как вы реагируете, когда клиент опаздывает на 20 минут?",
    "Что вам сложнее: поднять цену постоянному клиенту или отказать в записи?",
    "Руководитель просит взять ещё одного клиента в конце смены. Как вы ответите?",
    "Как вы даёте мастеру обратную связь, если клиент пожаловался?",
    "Что вы делаете, когда клиент делится личным и ждёт совета?",
  ],
} as const;
type Deck = keyof typeof DECKS;

export function DrawCard() {
  const [deck, setDeck] = useState<Deck>("Отношения");
  const [card, setCard] = useState<number | null>(null);
  const cards = DECKS[deck];
  const draw = () => setCard((c) => { let n = Math.floor(Math.random() * cards.length); if (n === c) n = (n + 1) % cards.length; return n; });
  const picked = card === null ? null : { sphere: deck, text: cards[card] };
  return <section className="section bg-secondary"><div className="section-inner grid items-center gap-12 lg:grid-cols-2">
    <div>
      <p className="eyebrow">Попробуйте прямо сейчас</p>
      <h2 className="section-title">Вытяните <em>свою карту</em></h2>
      <p className="mt-5 max-w-md text-lg leading-8 text-muted-foreground">Так начинается каждая игра «Раппóрт»: один вопрос — и разговор уже идёт по-другому. Ответьте себе честно.</p>
      <div className="mt-6 flex flex-wrap gap-2" role="tablist" aria-label="Колода">{(Object.keys(DECKS) as Deck[]).map((d) => <button key={d} type="button" role="tab" aria-selected={d === deck} onClick={() => { setDeck(d); setCard(null); }} className={`rounded-full border px-4 py-2 text-sm ${d === deck ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:border-primary"}`}>{d}</button>)}</div>
      {picked && <div className="mt-8 flex flex-wrap gap-3 animate-fade-in"><Button asChild size="lg"><Link to="/games">Сыграть по-настоящему <ArrowRight /></Link></Button><Button size="lg" variant="outline" onClick={draw}><RotateCcw />Ещё карту</Button></div>}
    </div>
    <div className="relative mx-auto h-[22rem] w-64 [perspective:1200px] sm:h-[26rem] sm:w-72">
      {!picked && [2, 1].map((i) => <div key={i} aria-hidden className="absolute inset-0 rounded-2xl border border-border bg-card shadow-lg" style={{ transform: `rotate(${i * 4 - 2}deg) translate(${i * 6}px, ${i * 4}px)` }} />)}
      <button type="button" onClick={draw} aria-label={picked ? "Вытянуть другую карту" : "Вытянуть карту"}
        className="group absolute inset-0 rounded-2xl transition-transform duration-700 [transform-style:preserve-3d] hover:-translate-y-2"
        style={{ transform: picked ? "rotateY(180deg)" : undefined }}>
        <span className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-2xl border border-primary/30 bg-primary p-6 text-primary-foreground shadow-2xl [backface-visibility:hidden]">
          {deck === "Бизнес" && <img src={bizScenario} alt="Карточка «Сценарий: сотрудник — руководитель» из игры «Раппóрт Бизнес»" className="absolute inset-0 h-full w-full rounded-2xl object-cover" />}
          {deck !== "Бизнес" && <span className="font-display text-4xl">Раппóрт</span>}
          <span className={`relative text-sm uppercase tracking-[0.25em] animate-pulse ${deck === "Бизнес" ? "mt-auto rounded-full bg-foreground/70 px-4 py-2 text-background" : "opacity-80"}`}>Нажмите, чтобы вытянуть</span>
        </span>
        <span className="absolute inset-0 flex flex-col justify-between rounded-2xl border border-border bg-card p-7 text-left shadow-2xl [backface-visibility:hidden] [transform:rotateY(180deg)]">
          {deck === "Бизнес" ? <img src={bizNonverbal} alt="Карточка «Невербальные сигналы» из игры «Раппóрт Бизнес»" className="w-full rounded-lg" /> : <span className="eyebrow">{picked?.sphere}</span>}
          <span className="font-display text-2xl leading-snug text-foreground">{picked?.text}</span>
          <span className="text-xs text-muted-foreground">Вопрос из игр «Раппóрт»</span>
        </span>
      </button>
    </div>
  </div></section>;
}

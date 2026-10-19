import { useEffect, useState } from "react";
import italy from "@/assets/hero/hero-restaurant.webp";
import relations2 from "@/assets/hero/hero-relations-2.webp";
import zhivaya from "@/assets/hero/hero-m-zhivaya.webp";
import zhivaya2 from "@/assets/hero/hero-zhivaya-2.webp";
import beauty from "@/assets/hero/hero-m-beauty.webp";
import beauty2 from "@/assets/hero/hero-beauty-2.webp";
import business from "@/assets/hero/hero-m-business.webp";
import business2 from "@/assets/hero/hero-business-2.webp";

type Slide = { src: string; alt: string; lead: string; rest: string; accent: string; contain?: boolean };
// Two covers per game, each with its own headline; faces kept in frame.
const slides: Slide[] = [
  { src: italy, alt: "Участники читают карточки «Раппóрт» за столом в ресторане", lead: "Одни и те же ссоры?", rest: "Посмотрите на них", accent: "со стороны" },
  { src: relations2, alt: "Пара на кухне читает карточки «Раппóрт про отношения»", lead: "Давно вместе,", rest: "а говорить стало не о чем?", accent: "Вернём разговор" },
  { src: zhivaya, alt: "Женщины играют в «Раппóрт — Живая» в уютном кабинете", lead: "Раппóрт — Живая.", rest: "Игра для женщин,", accent: "которая возвращает к себе" },
  { src: zhivaya2, alt: "Женщины сидят в кругу и делятся историями на игре «Раппóрт — Живая»", lead: "Устали быть сильной?", rest: "Побудьте", accent: "собой" },
  { src: beauty, alt: "Игра «Раппóрт Beauty» в салоне красоты", lead: "Раппóрт Beauty.", rest: "Игра, после которой", accent: "клиенты возвращаются" },
  { src: beauty2, alt: "Мастер и клиентка смеются над карточками в салоне", lead: "Не просто процедура —", rest: "разговор, который", accent: "запоминается" },
  { src: business, alt: "Команда играет в «Раппóрт Бизнес» в офисе", lead: "Раппóрт Бизнес.", rest: "Увидьте свою команду", accent: "со стороны" },
  { src: business2, alt: "Коллеги обсуждают карточки «Раппóрт Бизнес» за столом переговоров", lead: "Совещания по кругу?", rest: "Сыграйте и", accent: "договоритесь" },
];
slides.forEach((s) => { s.contain = true; });
// Per-game caption under the headline; two slides per game, in slide order.
const captions = [
  { game: "Раппóрт про отношения", text: "Игра для пар и тех, кто ищет отношения: увидеть свои сценарии и договориться по-новому.", slug: "otnosheniya" },
  { game: "Раппóрт — Живая", text: "Женская игра-практикум: вернуть себе силы, желания и голос.", slug: "zhivaya" },
  { game: "Раппóрт Beauty", text: "Игра для мастеров и салонов: сервис, после которого клиенты возвращаются.", slug: "beauty" },
  { game: "Раппóрт Бизнес", text: "Игра для команд: увидеть роли со стороны и научиться договариваться.", slug: "business" },
];
export function heroCaption(index: number) { return captions[Math.floor((index % slides.length) / 2)] ?? captions[0]!; }
const mobileSlides = slides;

function useIsMobile() {
  const [m, setM] = useState(false);
  useEffect(() => { setM(window.matchMedia("(max-width: 767px)").matches); }, []);
  return m;
}

export function useHeroIndex() {
  const [i, setI] = useState(0);
  useEffect(() => { const t = setInterval(() => setI((n) => (n + 1) % slides.length), 6000); return () => clearInterval(t); }, []);
  return i;
}

export function HeroSlideshow({ index }: { index: number }) {
  const mobile = useIsMobile();
  const list = mobile ? mobileSlides : slides;
  const active = index % list.length;
  // Only mount the visible slide and the next one, so the page doesn't download all covers at once.
  const next = (active + 1) % list.length;
  return <>{list.map((s, n) => (n === active || n === next || n === (active + list.length - 1) % list.length) && <div key={s.src} className={`absolute inset-0 transition-opacity duration-1000 ${n === active ? "opacity-100" : "opacity-0"}`}>
    {s.contain && <img src={s.src} alt="" role="presentation" aria-hidden className="absolute inset-0 h-full w-full scale-110 object-cover blur-2xl" />}
    <img src={s.src} alt={s.alt} loading={n === active ? "eager" : "lazy"} fetchPriority={n === 0 ? "high" : "auto"} decoding="async" className={`absolute inset-0 h-full w-full ${s.contain ? "object-contain md:object-right" : "object-cover"}`} />
  </div>)}{mobile && <div className="absolute inset-0 bg-foreground/45" />}</>;
}

export function HeroHeadline({ index }: { index: number }) {
  const mobile = useIsMobile();
  const list = mobile ? mobileSlides : slides;
  const s = list[index % list.length]!;
  return <h1 key={index} className="mt-5 max-w-5xl animate-in fade-in duration-700 font-display text-5xl leading-[0.96] sm:text-7xl lg:text-[5.6rem]">{s.lead}<br />{s.rest}<br /><em className="font-medium text-accent">{s.accent}</em></h1>;
}

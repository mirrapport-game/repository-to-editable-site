import { useEffect, useState } from "react";

/** Пары «аудитория → игра» для первого экрана главной. Меняются вместе. */
export const HOME_HEADLINES = [
  { audience: "для тех, кто в поиске", game: "Игра про отношения и знакомства «Раппóрт»" },
  { audience: "для пар", game: "Игра про коммуникацию в отношениях «Раппóрт»" },
  { audience: "для команд", game: "Игра про развитие эмоционального партнёрства «Раппóрт Бизнес»" },
  { audience: "для женщин", game: "Игра про выбор себя и проявление себя в жизненных сценариях с близкими" },
];

export function HeroRotator() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer: ReturnType<typeof setInterval> | undefined;
    const sync = () => {
      if (timer) clearInterval(timer);
      if (!motion.matches) timer = setInterval(() => {
        if (document.visibilityState === "visible") setI(n => n + 1);
      }, 3600);
    };
    sync(); motion.addEventListener("change", sync);
    return () => { if (timer) clearInterval(timer); motion.removeEventListener("change", sync); };
  }, []);
  const item = HOME_HEADLINES[i % HOME_HEADLINES.length]!;
  return <h1 className="font-display leading-[0.95]">
    <span className="hidden text-5xl font-medium sm:block sm:text-7xl lg:text-8xl">Раппóрт</span>
    <span aria-hidden="true" className="block min-h-[1.2em] whitespace-nowrap text-3xl text-accent sm:mt-2 sm:text-4xl lg:text-5xl"><em key={`a${i}`} className="inline-block animate-in fade-in duration-500 motion-reduce:animate-none">{item.audience}</em></span>
    <span aria-hidden="true" className="mt-3 block min-h-[3.75em] max-w-xl text-xl leading-tight sm:min-h-[2.5em] sm:text-2xl lg:text-3xl">
      <span key={`g${i}`} className="block animate-in fade-in duration-500 motion-reduce:animate-none">{item.game}</span>
    </span>
    <span className="sr-only">Раппóрт: {HOME_HEADLINES.map(h => `${h.audience} — ${h.game}`).join("; ")}</span>
  </h1>;
}

import { useEffect, useState } from "react";

const AUDIENCES = ["для пар", "для тех, кто в поиске", "для женщин", "для мужчин", "для компаний", "для команд", "для салонов красоты"];
const GAME_TYPES = ["психологические", "коммуникативные", "ролевые", "переговорные", "трансформационные"];

export function HeroRotator() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer: ReturnType<typeof setInterval> | undefined;
    const sync = () => {
      if (timer) clearInterval(timer);
      if (!motion.matches) timer = setInterval(() => {
        if (document.visibilityState === "visible") setI(n => n + 1);
      }, 3200);
    };
    sync(); motion.addEventListener("change", sync);
    return () => { if (timer) clearInterval(timer); motion.removeEventListener("change", sync); };
  }, []);
  return <h1 className="font-display leading-[0.95]">
    <span className="hidden text-5xl font-medium sm:block sm:text-7xl lg:text-8xl">Раппóрт</span>
    <span className="block min-h-[1.2em] whitespace-nowrap text-3xl sm:mt-2 text-accent sm:text-4xl lg:text-5xl"><em key={i} className="inline-block animate-in fade-in duration-500 motion-reduce:animate-none">{AUDIENCES[i % AUDIENCES.length]}</em></span>
    <span className="sr-only">Психологические, коммуникативные, ролевые, переговорные, трансформационные игры</span>
    <span aria-hidden="true" className="mt-2 block text-xl leading-tight sm:text-3xl lg:text-4xl">
      <span className="relative block min-h-[1.25em]"><span key={i} className="absolute inset-0 animate-in fade-in duration-500 motion-reduce:animate-none">{GAME_TYPES[i % GAME_TYPES.length]}</span></span>
      <span className="block">игры</span>
    </span>
  </h1>;
}

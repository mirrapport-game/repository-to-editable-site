import { useEffect, useState } from "react";

export const HOME_AUDIENCES = [
  "для психологов по отношениям",
  "для коучей",
  "для тренеров",
  "для помогающих практиков",
  "для игропрактиков",
  "для начинающих психологов",
  "для организаторов",
];

export const FACILITATOR_AUDIENCES = [
  "для психологов по отношениям",
  "для коучей",
  "для тренеров",
  "для помогающих практиков",
  "для игропрактиков",
  "для начинающих психологов",
  "для организаторов",
  "для служб знакомств",
  "для ретритных центров",
  "для лагерей для взрослых",
  "для компаний быстрых свиданий",
  "для женских комьюнити",
  "для деловых сообществ",
  "для предпринимателей",
  "для психологических центров",
  "для тренинговых центров",
  "для пространств",
  "для event-агентств",
];

export function HeroAudienceRotator({
  items = HOME_AUDIENCES,
  className = "mt-5 font-display text-2xl font-bold uppercase leading-tight text-background sm:mt-6 sm:text-3xl lg:text-4xl",
  reserveClass = "min-h-[2.5em] sm:min-h-[1.25em]",
}: {
  items?: string[];
  className?: string;
  reserveClass?: string;
}) {
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
  return <>
    <p className={className}>
      <span className={`block ${reserveClass}`}>
        <span key={i} className="inline-block animate-in fade-in duration-500 motion-reduce:animate-none">{items[i % items.length]}</span>
      </span>
    </p>
    <span className="sr-only">{items.join(", ")}</span>
  </>;
}

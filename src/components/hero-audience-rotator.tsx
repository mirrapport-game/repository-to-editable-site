import { useEffect, useState } from "react";

const PRO_AUDIENCES = [
  "для психологов по отношениям",
  "для коучей",
  "для тренеров",
  "для помогающих практиков",
  "для игропрактиков",
  "для начинающих психологов",
  "для организаторов",
];

export function HeroAudienceRotator() {
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
    <p className="mt-5 font-display text-2xl font-bold uppercase leading-tight text-background sm:mt-6 sm:text-3xl lg:text-4xl">
      <span className="block min-h-[2.5em] sm:min-h-[1.25em]">
        <span key={i} className="inline-block animate-in fade-in duration-500 motion-reduce:animate-none">{PRO_AUDIENCES[i % PRO_AUDIENCES.length]}</span>
      </span>
    </p>
    <span className="sr-only">{PRO_AUDIENCES.join(", ")}</span>
  </>;
}

import { useState } from "react";
import { Reveal } from "@/components/business-interactive";
import cover from "@/assets/beauty-skills-cover.webp.asset.json";
import s12 from "@/assets/beauty-skill-12.webp.asset.json";
import s15 from "@/assets/beauty-skill-13.webp.asset.json";
import s19 from "@/assets/beauty-skill-19.webp.asset.json";

const CARDS = [
  { img: s12.url, alt: "Навык 12: правило «нет» (гибкая вежливость)" },
  { img: s15.url, alt: "Навык 15: конкретика вместо абстракций" },
  { img: s19.url, alt: "Навык 19: разделение фактов и эмоций" },
];

/** Карты «Навыки» из игры: по клику карта мягко переворачивается. */
export function BeautySkillCards() {
  const [open, setOpen] = useState<number[]>([]);
  return (
    <section className="section">
      <div className="section-inner">
        <p className="eyebrow">Карты навыков</p>
        <h2 className="section-title max-w-3xl">Каждый навык — <em>отдельная карта</em></h2>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">Нажмите на карту, чтобы открыть навык.</p>
        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {CARDS.map((c, i) => {
            const isOpen = open.includes(i);
            return (
              <Reveal key={c.img} delay={i * 120}>
                <button type="button" data-open={isOpen} aria-label={isOpen ? c.alt : `Открыть карту навыка ${i + 1}`}
                  onClick={() => setOpen(isOpen ? open.filter((x) => x !== i) : [...open, i])}
                  className="flip-card card-lift aspect-[3/2] w-full">
                  <span className="flip-inner block">
                    <span className="flip-face overflow-hidden rounded-2xl shadow-lg"><img src={cover.url} alt="" loading="lazy" className="h-full w-full object-cover" /></span>
                    <span className="flip-face flip-back overflow-hidden rounded-2xl bg-card shadow-lg"><img src={c.img} alt={c.alt} loading="lazy" className="h-full w-full object-contain" /></span>
                  </span>
                </button>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

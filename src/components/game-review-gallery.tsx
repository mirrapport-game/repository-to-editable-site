import { useState } from "react";
import { participantReviewImages } from "@/data/site";
import { HostReviews } from "@/components/host-reviews";

const tabs = [
  { label: "Раппóрт про отношения", game: "Раппóрт — Отношения", slug: "game-relationships" },
  { label: "Раппóрт Живая", game: "Раппóрт — Живая", slug: "game-zhivaya" },
] as const;

export function GameReviewGallery() {
  const [active, setActive] = useState(0);
  const tab = tabs[active]!;
  const list = participantReviewImages.filter((r) => r.game === tab.game);
  return <>
    <section className="section border-t border-border"><div className="section-inner">
      <p className="eyebrow">Сообщения участников</p>
      <h2 className="section-title max-w-4xl">Как игра остаётся <em>в жизни</em></h2>
      <div className="mt-8 flex flex-wrap gap-3" role="tablist">
        {tabs.map((t, i) => <button key={t.slug} role="tab" aria-selected={i === active} onClick={() => setActive(i)}
          className={`rounded-full border px-5 py-2 text-sm transition-colors ${i === active ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary"}`}>{t.label}</button>)}
      </div>
      <div className="participant-review-gallery mt-10">{list.map((r) => <figure key={r.src} className="participant-review-image"><img src={r.src} alt={r.alt} loading="lazy" /><figcaption>{r.game}</figcaption></figure>)}</div>
    </div></section>
    <HostReviews key={tab.slug} slug={tab.slug} name={`«${tab.label}»`} />
  </>;
}

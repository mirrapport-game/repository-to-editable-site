import { useState } from "react";
import { ProcessGallery } from "@/components/content";
import zhivaya from "@/assets/hero/hero-m-zhivaya.webp";
import zhivaya2 from "@/assets/hero/hero-zhivaya-2.webp";
import beauty from "@/assets/hero/hero-m-beauty.webp";
import beauty2 from "@/assets/hero/hero-beauty-2.webp";
import business from "@/assets/hero/hero-m-business.webp";
import business2 from "@/assets/hero/hero-business-2.webp";

type Photo = { src: string; alt: string; caption: string };

// Tabs per game on the facilitators page; "Раппóрт" keeps its original photos.
export function LiveGamesSlider({ rapportPhotos }: { rapportPhotos: Photo[] }) {
  const games: { name: string; photos: Photo[] }[] = [
    { name: "Раппóрт", photos: rapportPhotos },
    { name: "Раппóрт Живая", photos: [{ src: zhivaya, alt: "Игра «Раппóрт Живая»", caption: "Женская группа" }, { src: zhivaya2, alt: "Карточки «Раппóрт Живая»", caption: "Работа с карточками" }] },
    { name: "Раппóрт Beauty", photos: [{ src: beauty, alt: "Игра «Раппóрт Beauty» в салоне", caption: "В салоне красоты" }, { src: beauty2, alt: "Раппóрт Beauty", caption: "Мастер и клиент" }] },
    { name: "Раппóрт Бизнес", photos: [{ src: business, alt: "Игра «Раппóрт Бизнес» в офисе", caption: "Команда в офисе" }, { src: business2, alt: "Раппóрт Бизнес", caption: "Переговоры" }] },
  ];
  const [i, setI] = useState(0);
  return <div>
    <div className="mb-8 flex flex-wrap gap-2">{games.map((g, k) => <button key={g.name} type="button" onClick={() => setI(k)} className={`rounded-full border px-5 py-2 text-sm font-medium transition-colors ${k === i ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary"}`}>{g.name}</button>)}</div>
    <ProcessGallery key={i} photos={games[i]?.photos ?? rapportPhotos} />
  </div>;
}

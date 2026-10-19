import { useState } from "react";
import { PlayCircle, Star, X } from "lucide-react";
import { Link } from "@tanstack/react-router";
import g1 from "@/assets/artem-gallery/g1.jpg";
import g2 from "@/assets/artem-gallery/g2.jpg";
import g3 from "@/assets/artem-gallery/g3.jpg";
import g4 from "@/assets/artem-gallery/g4.jpg";
import g5 from "@/assets/artem-gallery/g5.jpg";
import g6 from "@/assets/artem-gallery/g6.jpg";
import g7 from "@/assets/artem-gallery/g7.jpg";
import g8 from "@/assets/artem-gallery/g8.jpg";
import g9 from "@/assets/artem-gallery/g9.jpg";
import g10 from "@/assets/artem-gallery/g10.jpg";

const GALLERY = [g1, g2, g3, g4, g5, g6, g7, g8, g9, g10].map((g) => g.url);

/** Video files of the game itself; add URLs here when videos arrive. */
const GAME_VIDEOS: string[] = [];

/** Rating, "how the game goes" and photo gallery for the game's author. */
export function AuthorShowcase() {
  const [open, setOpen] = useState<string | null>(null);
  return <div className="mt-10">
    <h2 className="font-display text-3xl sm:text-4xl">Галерея игр</h2>
    <div className="mt-6 columns-2 gap-3 md:columns-3">
      {GALLERY.map((src, i) => <button key={src} type="button" onClick={() => setOpen(src)} className="mb-3 block w-full overflow-hidden rounded-xl">
        <img src={src} alt={`Игра «Раппóрт» с Артёмом Ефимовым, фото ${i + 1}`} loading="lazy" className="w-full transition-transform hover:scale-105" />
      </button>)}
    </div>
    <h2 className="mt-14 font-display text-3xl sm:text-4xl">Что предлагает Артём</h2>
    <div className="mt-6 grid gap-4 sm:grid-cols-2">
      <Link to="/mentorship" className="rounded-2xl border bg-card p-5 transition-colors hover:border-primary"><p className="font-display text-xl">Личное сопровождение</p><p className="mt-2 text-sm text-muted-foreground">Индивидуальная работа с автором игр.</p><span className="mt-3 inline-block text-sm text-primary">Подробнее →</span></Link>
      <Link to="/games/$slug" params={{ slug: "otnosheniya" }} className="rounded-2xl border bg-card p-5 transition-colors hover:border-primary"><p className="font-display text-xl">«Раппóрт про отношения»</p><p className="mt-2 text-sm text-muted-foreground">Игра про общение в паре; индивидуально с автором — 5 000 ₽/час.</p><span className="mt-3 inline-block text-sm text-primary">Подробнее →</span></Link>
      <Link to="/games/$slug" params={{ slug: "zhivaya" }} className="rounded-2xl border bg-card p-5 transition-colors hover:border-primary"><p className="font-display text-xl">«Раппóрт Живая»</p><p className="mt-2 text-sm text-muted-foreground">Игра-разговор с собой.</p><span className="mt-3 inline-block text-sm text-primary">Подробнее →</span></Link>
      <Link to="/course" className="rounded-2xl border bg-card p-5 transition-colors hover:border-primary"><p className="font-display text-xl">Обучение новых ведущих</p><p className="mt-2 text-sm text-muted-foreground">Академия Раппóрт: станьте ведущим игр.</p><span className="mt-3 inline-block text-sm text-primary">Подробнее →</span></Link>
    </div>

    <h2 className="mt-14 font-display text-3xl sm:text-4xl">Как проходит игра — видео</h2>
    <p className="mt-2 text-muted-foreground">Здесь будут видео с игр Артёма.</p>
    <div className="mt-6 grid gap-4 md:grid-cols-2">
      {GAME_VIDEOS.length ? GAME_VIDEOS.map((v) => <video key={v} src={v} controls preload="none" className="aspect-video w-full rounded-2xl bg-muted" />)
        : [0, 1].map((i) => <div key={i} className="flex aspect-video items-center justify-center rounded-2xl border border-dashed bg-muted text-muted-foreground"><span className="flex items-center gap-2"><PlayCircle />Видео с игры скоро появится</span></div>)}
    </div>

    {open && <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/80 p-4" onClick={() => setOpen(null)}>
      <button type="button" aria-label="Закрыть" className="absolute right-4 top-4 rounded-full bg-background p-2"><X /></button>
      <img src={open} alt="Фото с игры" className="max-h-full max-w-full rounded-xl" />
    </div>}
  </div>;
}

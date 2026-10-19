import { useRef, useState } from "react";
import { Pause, Play, SkipBack, SkipForward } from "lucide-react";
import hereAndNow from "@/assets/here-and-now.mp3.asset.json";
import segodnya from "@/assets/segodnya-sluchilos-vazhnoe.mp3.asset.json";
import possoritsya from "@/assets/hochesh-possoritsya.mp3.asset.json";

const TRACKS = [
  { title: "Here and Now", url: hereAndNow.url },
  { title: "Сегодня случилось важное", url: segodnya.url },
  { title: "Хочешь поссориться из-за работы", url: possoritsya.url },
];

// Site-wide music: nothing is downloaded until the visitor presses Play.
export function SitePlayer() {
  const ref = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [idx, setIdx] = useState(0);
  const toggle = () => {
    const a = ref.current; if (!a) return;
    if (a.paused) { void a.play().then(() => setPlaying(true)).catch(() => setPlaying(false)); }
    else { a.pause(); setPlaying(false); }
  };
  const go = (d: number) => {
    const n = (idx + d + TRACKS.length) % TRACKS.length;
    setIdx(n);
    const a = ref.current; if (!a) return;
    a.src = TRACKS[n]!.url;
    if (playing) void a.play().catch(() => setPlaying(false));
  };
  const btn = "grid h-9 w-9 place-items-center rounded-full text-foreground transition-colors hover:text-primary";
  return <div className="fixed bottom-3 left-3 z-40 flex items-center rounded-full border border-border bg-card/90 pr-1 shadow-lg backdrop-blur sm:bottom-5 sm:left-5">
    <audio ref={ref} src={TRACKS[0]!.url} preload="none" onEnded={() => go(1)} />
    <button type="button" onClick={() => go(-1)} aria-label="Предыдущий трек" className={`${btn} hidden sm:grid`}><SkipBack className="h-4 w-4" /></button>
    <button type="button" onClick={toggle} aria-label={playing ? "Пауза музыки" : `Включить музыку «${TRACKS[idx]!.title}»`}
      className="flex items-center gap-2 px-3 py-2 text-sm text-foreground transition-colors hover:text-primary">
      {playing ? <Pause className="h-4 w-4 text-primary" /> : <Play className="h-4 w-4 text-primary" />}
      <span className="hidden max-w-44 truncate sm:inline">{playing ? TRACKS[idx]!.title : "Музыка"}</span>
    </button>
    <button type="button" onClick={() => go(1)} aria-label="Следующий трек" className={btn}><SkipForward className="h-4 w-4" /></button>
  </div>;
}

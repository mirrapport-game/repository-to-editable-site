import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Volume2, VolumeX } from "lucide-react";

export type VideoSlide = { src: string; title: string };

// Autoplaying muted video playlist: plays slides in sequence, with prev/next
// and native controls for seeking and sound.
export function VideoCarousel({ videos, eyebrow, heading }: { videos: VideoSlide[]; eyebrow?: string; heading?: string }) {
  const [index, setIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const ref = useRef<HTMLVideoElement>(null);
  const active = videos[index]!;

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = muted;
    void v.play().catch(() => {});
  }, [index, muted]);

  function go(next: number) {
    setIndex((next + videos.length) % videos.length);
  }

  return <div>
    {(eyebrow || heading) && <div className="mb-8 text-center">{eyebrow && <p className="eyebrow">{eyebrow}</p>}{heading && <h2 className="section-title mx-auto max-w-3xl">{heading}</h2>}</div>}
    <div className="relative mx-auto max-w-4xl">
      <div className="aspect-video w-full overflow-hidden rounded-2xl border border-border bg-foreground">
        <video
          key={active.src}
          ref={ref}
          src={active.src}
          className="h-full w-full object-contain"
          autoPlay
          muted={muted}
          playsInline
          controls
          preload="metadata"
          onEnded={() => go(index + 1)}
        />
      </div>
      {videos.length > 1 && <>
        <button type="button" aria-label="Предыдущее видео" onClick={() => go(index - 1)} className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-2 text-foreground shadow-md backdrop-blur transition hover:bg-background"><ChevronLeft className="size-6" /></button>
        <button type="button" aria-label="Следующее видео" onClick={() => go(index + 1)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-2 text-foreground shadow-md backdrop-blur transition hover:bg-background"><ChevronRight className="size-6" /></button>
      </>}
      <button type="button" aria-label={muted ? "Включить звук" : "Выключить звук"} onClick={() => setMuted((m) => !m)} className="absolute bottom-14 right-3 rounded-full bg-background/80 p-2 text-foreground shadow-md backdrop-blur transition hover:bg-background">{muted ? <VolumeX className="size-5" /> : <Volume2 className="size-5" />}</button>
    </div>
    <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
      {videos.map((v, n) => <button key={v.src} type="button" onClick={() => go(n)} className={`rounded-full border px-4 py-1.5 text-sm transition ${n === index ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:border-primary/50"}`}>{v.title}</button>)}
    </div>
  </div>;
}

import { PlayCircle } from "lucide-react";

// Вставьте ссылку на видео автора (файл .mp4 или ссылку для встраивания YouTube/Rutube/VK).
export const AUTHOR_VIDEO_URL: string = "";

export function AuthorGameVideo() {
  const isFile = /\.(mp4|webm|mov)(\?|$)/i.test(AUTHOR_VIDEO_URL);
  return <section className="section"><div className="section-inner">
    <p className="eyebrow">Видео от автора</p>
    <h2 className="section-title max-w-4xl">Артём Ефимов об игре <em>«Раппóрт про отношения»</em></h2>
    <div className="mt-10 aspect-video w-full overflow-hidden rounded-xl border border-border bg-muted">
      {!AUTHOR_VIDEO_URL ? <div className="flex h-full flex-col items-center justify-center gap-3 text-muted-foreground"><PlayCircle className="size-14 text-primary" /><p>Видео скоро появится</p></div>
        : isFile ? <video src={AUTHOR_VIDEO_URL} controls preload="metadata" className="h-full w-full" />
        : <iframe src={AUTHOR_VIDEO_URL} title="Видео автора об игре" allow="autoplay; encrypted-media; fullscreen" allowFullScreen className="h-full w-full" />}
    </div>
  </div></section>;
}

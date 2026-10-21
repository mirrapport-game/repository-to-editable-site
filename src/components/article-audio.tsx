import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { BookOpen, Headphones } from "lucide-react";
import type { Article } from "@/data/site";
import { getArticleAudioUrl } from "@/lib/site-articles.functions";
import { Button } from "@/components/ui/button";

/**
 * Выбор «послушать или прочитать» в начале статьи.
 * Трек загружает администратор в управлении статьями; без трека блок не показывается.
 */
export function ArticleAudio({ article }: { article: Article }) {
  const [mode, setMode] = useState<"read" | "listen">("read");
  const [src, setSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const fetchUrl = useServerFn(getArticleAudioUrl);

  if (!article.audioPath) return null;

  async function listen() {
    setMode("listen");
    if (src || loading) return;
    setLoading(true);
    try {
      const res = await fetchUrl({ data: { slug: article.slug } });
      if (res.url) setSrc(res.url);
      else setFailed(true);
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-10 rounded-2xl border border-border bg-background p-5">
      <p className="eyebrow">Как вам удобнее</p>
      <div className="mt-3 flex flex-wrap gap-3">
        <Button type="button" variant={mode === "listen" ? "default" : "outline"} onClick={() => void listen()}>
          <Headphones className="size-4" /> Послушать песню на тему статьи
        </Button>
        <Button type="button" variant={mode === "read" ? "default" : "outline"} onClick={() => setMode("read")}>
          <BookOpen className="size-4" /> Читать
        </Button>
      </div>
      {mode === "listen" && (
        <div className="mt-4">
          <p className="text-sm font-medium">{article.audioTitle ?? "Песня на тему статьи"}</p>
          {loading && <p className="mt-2 text-sm text-muted-foreground">Готовим плеер…</p>}
          {src && <audio controls preload="none" src={src} className="mt-2 w-full" />}
          {failed && !loading && !src && (
            <p className="mt-2 text-sm text-muted-foreground">Трек временно недоступен — прочитайте текст, он рядом.</p>
          )}
        </div>
      )}
    </div>
  );
}

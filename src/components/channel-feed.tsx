import { useEffect, useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TELEGRAM_CHANNEL_URL } from "@/data/site";
import { getChannelPosts, type ChannelPost } from "@/lib/telegram-feed.functions";

// Latest posts from the Telegram channel; reloaded on visit and every 10 minutes while the page stays open.
export function ChannelFeed() {
  const [posts, setPosts] = useState<ChannelPost[] | null>(null);
  useEffect(() => {
    const load = () => getChannelPosts().then(setPosts).catch(() => setPosts((p) => p ?? []));
    load();
    const t = setInterval(load, 10 * 60 * 1000);
    return () => clearInterval(t);
  }, []);
  if (posts && posts.length === 0) return null;
  return <section className="section border-t border-border"><div className="section-inner">
    <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow">Из Telegram-канала</p><h2 className="section-title">Свежие посты <em>@rapport_game</em></h2></div><Button asChild variant="outline"><a href={TELEGRAM_CHANNEL_URL} target="_blank" rel="noreferrer"><Send />Подписаться</a></Button></div>
    {!posts ? <p className="mt-8 text-muted-foreground">Загружаем посты…</p> :
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{posts.map((p) => <a key={p.id} href={p.url} target="_blank" rel="noreferrer" className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-primary">
        {p.image && <img src={p.image} alt={`Фото к посту канала «Раппóрт»: ${p.text.slice(0, 80)}`} loading="lazy" className="aspect-video w-full object-cover" />}
        <div className="flex flex-1 flex-col p-5"><p className="text-xs text-muted-foreground">{new Date(p.date).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })}</p><p className="mt-2 line-clamp-6 whitespace-pre-line text-sm leading-6">{p.text}</p><span className="mt-auto pt-4 text-sm text-primary">Читать в Telegram →</span></div>
      </a>)}</div>}
  </div></section>;
}

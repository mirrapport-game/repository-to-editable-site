import { useEffect, useState } from "react";
import { Megaphone, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { TELEGRAM_CHANNEL_URL } from "@/data/site";

export function TelegramChannelSection() {
  const [posts, setPosts] = useState<{ message_id: number; text: string; posted_at: string }[]>([]);
  useEffect(() => { void supabase.from("channel_posts").select("message_id,text,posted_at").order("posted_at", { ascending: false }).limit(3).then(({ data }) => setPosts(data ?? [])); }, []);
  return (
    <section className="section bg-foreground text-background">
      <div className="section-inner grid items-center gap-10 lg:grid-cols-[auto_1fr_auto]">
        <span className="flex h-20 w-20 items-center justify-center rounded-full border border-background/25">
          <Megaphone className="h-8 w-8 text-accent" aria-hidden />
        </span>
        <div>
          <p className="eyebrow text-accent">Новости проекта</p>
          <h2 className="mt-4 font-display text-4xl tracking-tight sm:text-5xl">
            Telegram-канал <em className="font-medium text-accent">«Раппóрт»</em>
          </h2>
          <p className="mt-5 max-w-xl leading-7 text-background/80">
            Подписчики первыми узнают о наборе в фокус-группы, новых играх серии,
            датах встреч и запуске мини-игры онлайн.
          </p>
        </div>
        <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
          <a href={TELEGRAM_CHANNEL_URL} target="_blank" rel="noreferrer">
            <Send /> Подписаться на канал
          </a>
        </Button>
      </div>
      {posts.length > 0 && <div className="section-inner mt-12 grid gap-px bg-background/15 md:grid-cols-3">
        {posts.map((p) => <a key={p.message_id} href={`${TELEGRAM_CHANNEL_URL}/${p.message_id}`} target="_blank" rel="noreferrer" className="bg-foreground p-6 transition-colors hover:bg-background/5">
          <p className="eyebrow text-accent">{new Date(p.posted_at).toLocaleDateString("ru-RU", { day: "numeric", month: "long" })}</p>
          <p className="mt-3 line-clamp-6 whitespace-pre-line text-sm leading-6 text-background/85">{p.text}</p>
        </a>)}
      </div>}
    </section>
  );
}

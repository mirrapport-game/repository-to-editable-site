import { useEffect, useState } from "react";
import { Send, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { TELEGRAM_CHANNEL_URL } from "@/data/site";
import { supabase } from "@/integrations/supabase/client";
import { getChannelPosts, type ChannelPost } from "@/lib/telegram-feed.functions";

// Latest posts from the Telegram channel; reloaded on visit and every 10 minutes while the page stays open.
// Admins can hide a post from the site (blog_hidden_posts); the Telegram post itself stays.
export function ChannelFeed() {
  const [posts, setPosts] = useState<ChannelPost[] | null>(null);
  const [hidden, setHidden] = useState<Set<string>>(new Set());
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    const load = () => getChannelPosts().then(setPosts).catch(() => setPosts((p) => p ?? []));
    load();
    void supabase.from("blog_hidden_posts").select("post_id").then(({ data }) => setHidden(new Set((data ?? []).map((r) => r.post_id))));
    void supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return;
      const { data: ok } = await supabase.rpc("has_role", { _user_id: data.user.id, _role: "admin" });
      setIsAdmin(!!ok);
    });
    const t = setInterval(load, 10 * 60 * 1000);
    return () => clearInterval(t);
  }, []);
  const remove = async (id: string) => {
    if (!confirm("Удалить пост с сайта? В Telegram-канале он останется.")) return;
    const { error } = await supabase.from("blog_hidden_posts").insert({ post_id: id });
    if (error) { toast.error("Не удалось удалить пост"); return; }
    setHidden((s) => new Set(s).add(id));
    toast.success("Пост удалён с сайта");
  };
  const visible = posts?.filter((p) => !hidden.has(p.id)) ?? null;
  if (visible && visible.length === 0) return null;
  return <section className="section border-t border-border"><div className="section-inner">
    <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow">Из Telegram-канала</p><h2 className="section-title">Свежие посты <em>@rapport_game</em></h2></div><Button asChild variant="outline"><a href={TELEGRAM_CHANNEL_URL} target="_blank" rel="noreferrer"><Send />Подписаться</a></Button></div>
    {!visible ? <p className="mt-8 text-muted-foreground">Загружаем посты…</p> :
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{visible.map((p) => <div key={p.id} className="relative">
        <a href={p.url} target="_blank" rel="noreferrer" className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-primary">
          {p.image && <img src={p.image} alt={`Фото к посту канала «Раппóрт»: ${p.text.slice(0, 80)}`} loading="lazy" className="aspect-video w-full object-cover" />}
          <div className="flex flex-1 flex-col p-5"><p className="text-xs text-muted-foreground">{new Date(p.date).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })}</p><p className="mt-2 line-clamp-6 whitespace-pre-line text-sm leading-6">{p.text}</p><span className="mt-auto pt-4 text-sm text-primary">Читать в Telegram →</span></div>
        </a>
        {isAdmin && <Button type="button" size="icon" variant="destructive" aria-label="Удалить пост с сайта" className="absolute right-3 top-3" onClick={() => void remove(p.id)}><Trash2 /></Button>}
      </div>)}</div>}
  </div></section>;
}

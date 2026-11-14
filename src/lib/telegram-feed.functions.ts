import { createServerFn } from "@tanstack/react-start";

export type ChannelPost = { id: string; url: string; date: string; text: string; image: string | null };

const decode = (s: string) => s
  .replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, "")
  .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&")
  .trim();

// Public read of the channel's web preview (t.me/s/...), cached per server instance for 10 minutes.
let cache: { at: number; posts: ChannelPost[] } | null = null;
const TTL = 10 * 60 * 1000;
// Posts hidden by admins (blog_hidden_posts) are filtered here, so the hidden list never reaches visitors.
async function withoutHidden(posts: ChannelPost[]): Promise<ChannelPost[]> {
  if (!posts.length) return posts;
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data } = await supabaseAdmin.from("blog_hidden_posts").select("post_id").in("post_id", posts.map((p) => p.id));
    const hidden = new Set((data ?? []).map((r) => r.post_id));
    return posts.filter((p) => !hidden.has(p.id));
  } catch {
    return posts;
  }
}

export const getChannelPosts = createServerFn({ method: "GET" }).handler(async (): Promise<ChannelPost[]> => withoutHidden(await loadChannelPosts()));

async function loadChannelPosts(): Promise<ChannelPost[]> {
  if (cache && Date.now() - cache.at < TTL) return cache.posts;
  try {
    const res = await fetch("https://t.me/s/rapport_game", { headers: { "User-Agent": "Mozilla/5.0" } });
    if (!res.ok) return [];
    const html = await res.text();
    const blocks = html.split('class="tgme_widget_message_wrap').slice(1);
    const posts: ChannelPost[] = [];
    for (const b of blocks) {
      const id = b.match(/data-post="([^"]+)"/)?.[1];
      const date = b.match(/<time datetime="([^"]+)"/)?.[1];
      const textHtml = b.match(/tgme_widget_message_text[^>]*>([\s\S]*?)<\/div>/)?.[1];
      if (!id || !date || !textHtml) continue;
      const text = decode(textHtml);
      if (text.length < 20) continue;
      const image = b.match(/tgme_widget_message_photo_wrap[^>]*background-image:url\('([^']+)'\)/)?.[1] ?? null;
      posts.push({ id, url: `https://t.me/${id}`, date, text, image });
    }
    const out = posts.reverse().slice(0, 12);
    if (out.length) cache = { at: Date.now(), posts: out };
    return out;
  } catch {
    return cache?.posts ?? [];
  }
}

import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";
import type { Article } from "@/data/site";
import { siteArticleToArticle, type SiteArticleRow } from "./site-articles";

const sectionSchema = z.object({
  heading: z.string().trim().max(200).default(""),
  paragraphs: z.array(z.string().trim().max(4000)).max(60).default([]),
  bullets: z.array(z.string().trim().max(600)).max(60).default([]),
});

const articleSchema = z.object({
  id: z.string().uuid().nullish(),
  slug: z.string().trim().min(2).max(80).regex(/^[a-z0-9][a-z0-9-]*$/, "Адрес должен быть из латинских букв, цифр и дефисов"),
  title: z.string().trim().min(3, "Заголовок слишком короткий").max(200),
  description: z.string().trim().max(500).default(""),
  category: z.string().trim().min(2).max(60).default("Статьи"),
  publishedAt: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/, "Дата в формате 2026-10-21").nullish(),
  readTime: z.string().trim().max(40).default(""),
  intro: z.string().trim().max(2000).default(""),
  sections: z.array(sectionSchema).max(40).default([]),
  author: z.string().trim().max(120).default(""),
  authorBio: z.string().trim().max(1000).default(""),
  authorTelegram: z.string().trim().max(60).default(""),
  authorChannel: z.string().trim().max(200).default(""),
  isPublished: z.boolean().default(false),
});

export type SiteArticleDraft = z.infer<typeof articleSchema>;

/** Публичный клиент: читает только опубликованные строки, RLS решает, что видно. */
function publicClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(process.env["SUPABASE_URL"]!, key, {
    auth: { persistSession: false },
    // Ключ sb_ не является JWT, поэтому отправляем его только в apikey.
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) headers.delete("Authorization");
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
  });
}

async function requireAdmin(supabase: { rpc: (fn: string, args: Record<string, unknown>) => Promise<{ data: unknown }> }, userId: string) {
  const { data: isAdmin } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
  if (!isAdmin) throw new Error("Недостаточно прав для управления статьями");
}

/** Опубликованные статьи из базы — доступны гостям, используются в блоге и карте сайта. */
export const listPublishedSiteArticles = createServerFn({ method: "GET" }).handler(async (): Promise<Article[]> => {
  const supabase = publicClient();
  const { data, error } = await supabase
    .from("site_articles")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data as SiteArticleRow[]).map(siteArticleToArticle);
});

/** Все статьи, включая черновики — только администратору. */
export const listSiteArticles = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<{ rows: SiteArticleRow[]; error?: string }> => {
    await requireAdmin(context.supabase, context.userId);
    const { data, error } = await context.supabase
      .from("site_articles")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) return { rows: [], error: error.message };
    return { rows: data as SiteArticleRow[] };
  });

/** Создать или обновить статью. Возвращает id сохранённой строки. */
export const saveSiteArticle = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => articleSchema.parse(input))
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }): Promise<{ ok: boolean; id?: string; error?: string }> => {
    await requireAdmin(context.supabase, context.userId);

    // Такой адрес уже занят рукописной статьёй — иначе страница покажет её, а не новую.
    const { articles } = await import("@/data/site");
    if (!data.id && articles.some((a) => a.slug === data.slug)) {
      return { ok: false, error: "Такой адрес уже занят существующей статьёй. Поменяйте его." };
    }

    const payload = {
      slug: data.slug,
      title: data.title,
      description: data.description,
      category: data.category,
      date: data.publishedAt ? "" : "",
      published_at: data.publishedAt ?? null,
      read_time: data.readTime,
      intro: data.intro,
      sections: data.sections,
      author: data.author,
      author_bio: data.authorBio,
      author_telegram: data.authorTelegram || null,
      author_channel: data.authorChannel || null,
      is_published: data.isPublished,
      updated_at: new Date().toISOString(),
    };

    const query = data.id
      ? context.supabase.from("site_articles").update(payload).eq("id", data.id)
      : context.supabase.from("site_articles").insert(payload);

    const { data: saved, error } = await query.select("id").single();
    if (error) {
      if (error.code === "23505") return { ok: false, error: "Такой адрес уже занят другой статьёй. Поменяйте его." };
      return { ok: false, error: error.message };
    }
    return { ok: true, id: saved.id };
  });

/** Опубликовать или снять с публикации одной операцией. */
export const setSiteArticlePublished = createServerFn({ method: "POST" })
  .inputValidator((input: { id: string; isPublished: boolean }) => input)
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    await requireAdmin(context.supabase, context.userId);
    const { error, count } = await context.supabase
      .from("site_articles")
      .update({ is_published: data.isPublished, updated_at: new Date().toISOString() }, { count: "exact" })
      .eq("id", data.id);
    if (error) return { ok: false, error: error.message };
    if (!count) return { ok: false, error: "Статья не найдена" };
    return { ok: true };
  });

/** Удалить статью из блога. */
export const deleteSiteArticle = createServerFn({ method: "POST" })
  .inputValidator((input: { id: string }) => input)
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    await requireAdmin(context.supabase, context.userId);
    const { error, count } = await context.supabase
      .from("site_articles")
      .delete({ count: "exact" })
      .eq("id", data.id);
    if (error) return { ok: false, error: error.message };
    if (!count) return { ok: false, error: "Статья не найдена" };
    return { ok: true };
  });

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Article } from "@/data/site";
import { formatRussianDate, siteArticleToArticle, type SiteArticleRow } from "./site-articles";

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

export type SiteArticleInput = {
  id?: string | null;
  slug: string;
  title: string;
  description: string;
  category: string;
  publishedAt?: string | null;
  readTime: string;
  intro: string;
  sections: Array<{ heading?: string; paragraphs?: string[]; bullets?: string[] }>;
  author: string;
  authorBio: string;
  authorTelegram: string;
  authorChannel: string;
  isPublished: boolean;
};

/** Опубликованные статьи из базы — используются в блоге и карте сайта. */
export const listPublishedSiteArticles = createServerFn({ method: "GET" }).handler(async (): Promise<Article[]> => {
  const { fetchPublishedArticles } = await import("./site-articles.store");
  return fetchPublishedArticles();
});

/** Все статьи, включая черновики — только администратору. */
export const listSiteArticles = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<{ rows: SiteArticleRow[]; error?: string }> => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
    if (!isAdmin) return { rows: [], error: "Недостаточно прав" };
    const { data, error } = await context.supabase
      .from("site_articles")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) return { rows: [], error: error.message };
    return { rows: data as SiteArticleRow[] };
  });

/** Создать или обновить статью. */
export const saveSiteArticle = createServerFn({ method: "POST" })
  .inputValidator((input: SiteArticleInput) => articleSchema.parse(input))
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }): Promise<{ ok: boolean; id?: string; error?: string }> => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
    if (!isAdmin) return { ok: false, error: "Недостаточно прав" };

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
      date: data.publishedAt ? formatRussianDate(data.publishedAt) : "",
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

/** Опубликовать статью или снять её с публикации. */
export const setSiteArticlePublished = createServerFn({ method: "POST" })
  .inputValidator((input: { id: string; isPublished: boolean }) => input)
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
    if (!isAdmin) return { ok: false, error: "Недостаточно прав" };
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
    const { data: isAdmin } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
    if (!isAdmin) return { ok: false, error: "Недостаточно прав" };
    const { error, count } = await context.supabase
      .from("site_articles")
      .delete({ count: "exact" })
      .eq("id", data.id);
    if (error) return { ok: false, error: error.message };
    if (!count) return { ok: false, error: "Статья не найдена" };
    return { ok: true };
  });

import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { siteArticleToArticle, type SiteArticleRow } from "./site-articles";
import type { Article } from "@/data/site";

/**
 * Публичный доступ к базе: читает только опубликованные статьи.
 * Ключ берётся из переменных сервера внутри функций, чтобы не попасть в код браузера.
 */
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

/** Опубликованные статьи из базы: свежие сверху. */
export async function fetchPublishedArticles(): Promise<Article[]> {
  const supabase = publicClient();
  const { data, error } = await supabase
    .from("site_articles")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data as SiteArticleRow[]).map(siteArticleToArticle);
}

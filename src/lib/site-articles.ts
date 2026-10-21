import type { Article, ArticleSection } from "@/data/site";
import type { Tables } from "@/integrations/supabase/types";

export type SiteArticleRow = Tables<"site_articles">;

// Адрес статьи пишется латиницей, поэтому русские заголовки транслитерируются.
const TRANSLIT: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z", и: "i",
  й: "i", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r", с: "s", т: "t",
  у: "u", ф: "f", х: "kh", ц: "ts", ч: "ch", ш: "sh", щ: "sch", ъ: "", ы: "y",
  ь: "", э: "e", ю: "yu", я: "ya",
};

const MONTHS = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];

/** Русскую или английскую фразу превращает в адрес вида "dumat-ili-ne-dumat". */
export function articleSlug(title: string): string {
  const cleaned = title.toLowerCase().split("").map((ch) => {
    if (/[a-z0-9]/.test(ch)) return ch;
    if (ch in TRANSLIT) return TRANSLIT[ch];
    return "-";
  }).join("");
  const slug = cleaned.replace(/-+/g, "-").replace(/^-|-$/g, "");
  return slug.length > 80 ? slug.slice(0, 80).replace(/-$/g, "") : slug;
}

export function pluralRu(n: number, one: string, few: string, many: string): string {
  const mod100 = n % 100;
  const mod10 = n % 10;
  if (mod100 >= 11 && mod100 <= 14) return many;
  if (mod10 === 1) return one;
  if (mod10 >= 2 && mod10 <= 4) return few;
  return many;
}

/** Время чтения по количеству слов: ~130 слов в минуту, минимум одна минута. */
export function estimateReadTime(parts: Array<string | null | undefined>): string {
  const words = parts.filter(Boolean).join(" ").split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 130));
  return `${minutes} ${pluralRu(minutes, "минута", "минуты", "минут")}`;
}

/** "2026-10-21" -> "21 октября 2026" */
export function formatRussianDate(iso: string | null | undefined): string {
  if (!iso) return "";
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return iso;
  const [, year, month, day] = match;
  const name = MONTHS[Number(month) - 1];
  if (!name) return iso;
  return `${Number(day)} ${name} ${year}`;
}

/** Дата в базе хранится как ISO, а на странице показывается по-русски. */
export function todayIso(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

export function parseSections(value: unknown): ArticleSection[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const row = item as Record<string, unknown>;
    const section: ArticleSection = { heading: typeof row["heading"] === "string" ? row["heading"].trim() : "" };
    if (Array.isArray(row["paragraphs"])) {
      const paragraphs = row["paragraphs"].filter((p): p is string => typeof p === "string" && p.trim().length > 0);
      if (paragraphs.length) section.paragraphs = paragraphs;
    }
    if (Array.isArray(row["bullets"])) {
      const bullets = row["bullets"].filter((b): b is string => typeof b === "string" && b.trim().length > 0);
      if (bullets.length) section.bullets = bullets;
    }
    return section.heading || section.paragraphs || section.bullets ? [section] : [];
  });
}

/** Строка из базы -> статья в том же виде, что и рукописные статьи в коде. */
export function siteArticleToArticle(row: SiteArticleRow): Article {
  const publishedAt = row.published_at ? String(row.published_at).slice(0, 10) : undefined;
  const article: Article = {
    slug: row.slug,
    title: row.title,
    description: row.description,
    category: row.category,
    date: row.date || formatRussianDate(publishedAt),
    readTime: row.read_time || estimateReadTime([row.intro, row.description, JSON.stringify(row.sections)]),
    intro: row.intro,
    sections: parseSections(row.sections),
  };
  if (publishedAt) article.publishedAt = publishedAt;
  if (row.author) article.author = row.author;
  if (row.author_bio) article.authorBio = row.author_bio;
  if (row.author_telegram) article.authorTelegram = row.author_telegram;
  if (row.author_channel) article.authorChannel = row.author_channel;
  return article;
}

/** Статьи из базы идут первыми (свежие сверху), рукописные — за ними. Адреса не повторяются. */
export function mergeArticles(local: Article[], db: Article[]): Article[] {
  const seen = new Set<string>();
  const out: Article[] = [];
  for (const article of [...db, ...local]) {
    if (seen.has(article.slug)) continue;
    seen.add(article.slug);
    out.push(article);
  }
  return out;
}

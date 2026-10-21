import { createFileRoute } from "@tanstack/react-router";
import { articles, games } from "@/data/site";
import { gamesData } from "@/data/games";
import { landingHosts, landingTopics } from "@/data/landing-topics";

type Entry = { path: string; priority: string; changefreq: "weekly" | "monthly" };

// Generated on every request from the data modules: a new game or article appears automatically.
export const Route = createFileRoute("/sitemap.xml")({ server: { handlers: { GET: async () => {
  const base = "https://rapportgame.ru";
  const staticPaths = ["/about","/quiz","/quest","/mentorship","/game-creation","/facilitators","/online-platform","/bloggers","/how-it-works","/reviews","/contacts","/cities/irkutsk","/cities/moscow","/cities/saint-petersburg","/cities/online","/cities/voronezh","/cities/volgograd","/cities/samara","/cities/nizhny-novgorod","/cities/chelyabinsk","/cities/novosibirsk","/cities/krasnoyarsk","/cities/kemerovo","/cities/leningrad-oblast","/cities/sochi","/cities/krasnodar","/cities/donetsk","/cities/yaroslavl","/cities/blagoveshchensk","/community","/zhivaya","/game","/rapport_business","/demo","/trainers","/ya-zhivaya","/social-projects"];
  const gameSlugs = new Set([
    ...games.filter((g) => !g.comingSoon && !g.external).map((g) => g.slug),
    ...gamesData.filter((g) => !g.draft).map((g) => g.slug),
  ]);
  // Статьи, добавленные через админку, попадают в карту сайта автоматически.
  let dbArticles: { slug: string }[] = [];
  try {
    const { fetchPublishedArticles } = await import("@/lib/site-articles.store");
    dbArticles = await fetchPublishedArticles();
  } catch {
    // База недоступна — карта сайта остаётся со статьями из кода.
  }
  const entries: Entry[] = [
    { path: "", priority: "1.0", changefreq: "monthly" },
    { path: "/games", priority: "0.8", changefreq: "weekly" },
    ...[...gameSlugs].map((s): Entry => ({ path: `/games/${s}`, priority: "0.8", changefreq: "weekly" })),
    { path: "/blog", priority: "0.6", changefreq: "monthly" },
    ...articles.map((a): Entry => ({ path: `/blog/${a.slug}`, priority: "0.6", changefreq: "monthly" })),
    ...dbArticles.map((a): Entry => ({ path: `/blog/${a.slug}`, priority: "0.6", changefreq: "monthly" })),
    ...staticPaths.map((path): Entry => ({ path, priority: "0.5", changefreq: "monthly" })),
    ...Object.keys(landingHosts).flatMap((l) => [`/lp/${l}`, ...landingTopics.map((t) => `/lp/${l}/${t.slug}`)]).map((path): Entry => ({ path, priority: "0.5", changefreq: "monthly" })),
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.map((e) => `  <url><loc>${base}${e.path}</loc><changefreq>${e.changefreq}</changefreq><priority>${e.priority}</priority></url>`).join("\n")}\n</urlset>`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
} } } });

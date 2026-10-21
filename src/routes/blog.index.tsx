import { useMemo, useState } from "react";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { Search, X } from "lucide-react";
import { articles } from "@/data/site";
import { ChannelFeed } from "@/components/channel-feed";
import { PageIntro, FinalCta } from "@/components/content";
import { seoMeta, canonical } from "@/lib/seo";
import { listPublishedSiteArticles } from "@/lib/site-articles.functions";
import { mergeArticles } from "@/lib/site-articles";

const POSTS_TOPIC = "Новые посты";
const searchSchema = (q: string, topic: string) => ({ q, topic });

export const Route = createFileRoute("/blog/")({
  // resetScroll: false keeps the page where it is; without it a topic or search click jumps to the top.
  validateSearch: (search: Record<string, unknown>) =>
    searchSchema(String(search.q ?? ""), String(search.topic ?? "")),
  // Статьи из базы идут первыми, рукописные — за ними.
  loader: async () => mergeArticles(articles, await listPublishedSiteArticles()),
  head: () => ({
    links: canonical("/blog"),
    meta: [
      ...seoMeta("/blog"),
      { title: "Блог «Раппóрт» — статьи об играх, отношениях и бизнесе" },
      { name: "description", content: "Статьи об играх серии «Раппóрт», психологии отношений, бизнесе и личностном росте." },
      { property: "og:title", content: "Блог «Раппóрт»" },
      { property: "og:description", content: "Статьи об играх, отношениях и бизнесе." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: BlogPage,
});

function BlogPage() {
  const search = Route.useSearch();
  const all = Route.useLoaderData();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState(search.q);
  const [showAllTopics, setShowAllTopics] = useState(false);
  const topics = ["Все", ...Array.from(new Set(all.map((a) => a.category))).sort((a, b) => a.localeCompare(b, "ru"))];

  const shown = useMemo(() => {
    const q = search.q.toLowerCase();
    const filtered = all.filter((a) => (!search.topic || search.topic === "Все" || a.category === search.topic) && (!q || a.title.toLowerCase().includes(q) || a.description.toLowerCase().includes(q)));
    return filtered;
  }, [all, search.q, search.topic]);

  const isPostsTopic = search.topic === POSTS_TOPIC;
  const shownArticles = useMemo(() => (isPostsTopic ? [] : shown), [isPostsTopic, shown]);
  const visibleTopics = showAllTopics ? topics : topics.slice(0, 7);

  return (
    <>
      <PageIntro eyebrow="Блог" title="Статьи об играх и" accent="о жизни" text="Разборы, истории и практические подсказки от команды и игроков." />
      <section className="section">
        <div className="section-inner">
          <div className="mb-10 flex flex-wrap items-center gap-2">
            <button onClick={() => navigate({ to: "/blog", search: { q: search.q, topic: "" }, resetScroll: false })} className={chip(!search.topic)}>Все темы</button>
            {visibleTopics.filter((t) => t !== "Все").map((t) => <button key={t} onClick={() => navigate({ to: "/blog", search: { q: search.q, topic: t }, resetScroll: false })} className={chip(search.topic === t)}>{t}</button>)}
            {topics.length > 7 && !showAllTopics && <button onClick={() => setShowAllTopics(true)} className="rounded-full border border-border px-4 py-1.5 text-sm text-muted-foreground transition-colors hover:border-foreground hover:text-foreground">Ещё {topics.length - 7}</button>}
            <button onClick={() => navigate({ to: "/blog", search: { q: search.q, topic: POSTS_TOPIC }, resetScroll: false })} className={chip(isPostsTopic)}>{POSTS_TOPIC}</button>
            <button onClick={() => setSearchOpen((v) => !v)} className="ml-auto inline-flex items-center gap-2 rounded-full border border-border px-4 py-1.5 text-sm transition-colors hover:border-foreground"><Search className="size-4" /> Поиск</button>
          </div>
          {searchOpen && (
            <div className="mb-10 flex items-center gap-3 rounded-2xl border border-border bg-card p-3">
              <Search className="ml-2 size-5 shrink-0 text-muted-foreground" />
              <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") navigate({ to: "/blog", search: { q: query, topic: search.topic }, resetScroll: false }); }} placeholder="Найти статью" className="w-full bg-transparent outline-none" />
              {query && <button onClick={() => { setQuery(""); navigate({ to: "/blog", search: { q: "", topic: search.topic }, resetScroll: false }); }} className="rounded-full p-1 text-muted-foreground hover:text-foreground"><X className="size-4" /></button>}
            </div>
          )}
          {isPostsTopic && <ChannelFeed embedded />}
          {!isPostsTopic && shown.length === 0 && <p className="mb-10 text-muted-foreground">Ничего не нашлось. Попробуйте другой запрос или снимите фильтр.</p>}
          {shownArticles.length > 0 && <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{shownArticles.map((a) => <Link key={a.slug} to="/blog/$slug" params={{ slug: a.slug }} className="group rounded-3xl border border-border bg-card p-7 transition-colors hover:border-primary"><p className="text-xs uppercase tracking-[0.2em] text-primary">{a.category}</p><h3 className="mt-3 font-display text-2xl leading-none">{a.title}</h3><p className="mt-3 text-sm text-muted-foreground">{a.description}</p><p className="mt-6 text-xs text-muted-foreground">{a.date} · {a.readTime}</p></Link>)}</div>}
          {isPostsTopic && shownArticles.length === 0 && shown.length === 0 && !search.q && <p className="mb-10 text-muted-foreground">Новых постов пока нет.</p>}
          {!isPostsTopic && shown.length > 0 && <div className="mt-12 flex justify-center"><button onClick={() => navigate({ to: "/blog", search: { q: search.q, topic: "" }, resetScroll: false })} className="rounded-full border border-border px-6 py-3 text-sm transition-colors hover:border-foreground">Показать все статьи</button></div>}
        </div>
      </section>
      <FinalCta />
    </>
  );
}

function chip(active: boolean) {
  return `rounded-full px-4 py-1.5 text-sm transition-colors ${active ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground hover:border-foreground hover:text-foreground"}`;
}

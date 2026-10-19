import { seoMeta, canonical } from "@/lib/seo";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Search, X } from "lucide-react";
import { ArticleCard, PageIntro } from "@/components/content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { articles } from "@/data/site";
import { ChannelFeed } from "@/components/channel-feed";

type BlogSearch = { q?: string; topic?: string };

const topics = ["Все", ...Array.from(new Set(articles.map((article) => article.category)))];

export const Route = createFileRoute("/blog/")({
  validateSearch: (search: Record<string, unknown>): BlogSearch => {
    const result: BlogSearch = {};
    if (typeof search["q"] === "string" && search["q"]) result.q = search["q"].slice(0, 120);
    if (typeof search["topic"] === "string" && search["topic"]) result.topic = search["topic"];
    return result;
  },
  head: () => ({ links: canonical("/blog"), meta: [...seoMeta("/blog"), 
  { title: "Блог «Раппóрт» — психология, отношения и игровые практики" },
  { name: "description", content: "Статьи об отношениях, трансформационных играх, работе ведущего и практике осознанной коммуникации." },
  { property: "og:title", content: "Блог проекта «Раппóрт»" }, { property: "og:description", content: "Психология, отношения, игры и практика ведущих." },
  { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
] }), component: BlogPage });

function BlogPage() {
  const { q, topic } = Route.useSearch();
  const navigate = useNavigate({ from: "/blog/" });
  const safeQuery = q ?? "";
  const safeTopic = topic && topics.includes(topic) ? topic : "Все";
  const normalizedQuery = safeQuery.trim().toLocaleLowerCase("ru");
  const filteredArticles = articles.filter((article) => {
    const matchesTopic = safeTopic === "Все" || article.category === safeTopic;
    const searchable = `${article.title} ${article.description} ${article.intro}`.toLocaleLowerCase("ru");
    return matchesTopic && (!normalizedQuery || searchable.includes(normalizedQuery));
  });
  const resetFilters = () => navigate({ search: {}, replace: true });

  return <><PageIntro eyebrow="Журнал" title="О людях, разговорах и переменах" text="Практические материалы о трансформационных играх, отношениях и работе ведущего — без сложных терминов."/><ChannelFeed /><section className="section pt-0"><div className="section-inner"><div className="border-y border-border py-6 md:py-8"><div className="relative max-w-2xl"><Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground"/><Input aria-label="Поиск по статьям" value={safeQuery} onChange={(event)=>navigate({search:(previous)=>({...previous,q:event.target.value}),replace:true})} placeholder="Найти статью по слову или теме" className="h-12 rounded-none pl-12 pr-12"/>{safeQuery&&<Button type="button" variant="ghost" size="icon" aria-label="Очистить поиск" onClick={()=>navigate({search:({q: _q,...previous})=>previous,replace:true})} className="absolute right-1 top-1/2 -translate-y-1/2"><X className="size-4"/></Button>}</div><div className="mt-5 overflow-x-auto pb-2"><div className="flex min-w-max gap-2" aria-label="Фильтр по темам">{topics.map((item)=><Button key={item} type="button" size="sm" variant={safeTopic===item?"default":"outline"} aria-pressed={safeTopic===item} onClick={()=>navigate({search:(previous)=>item==="Все"?(({topic: _topic,...rest})=>rest)(previous):({...previous,topic:item}),replace:true})}>{item}</Button>)}</div></div></div><div className="mb-10 mt-8 flex items-center justify-between gap-4"><p className="text-sm text-muted-foreground">Найдено: {filteredArticles.length}</p>{(safeQuery||safeTopic!=="Все")&&<Button type="button" variant="ghost" size="sm" onClick={resetFilters}>Сбросить фильтры</Button>}</div>{filteredArticles.length>0?<div className="grid gap-x-10 gap-y-16 md:grid-cols-2">{filteredArticles.map(article=><ArticleCard key={article.slug} article={article}/>)}</div>:<div className="border-y border-border py-16 text-center"><h2 className="font-display text-4xl">Ничего не найдено</h2><p className="mx-auto mt-3 max-w-lg text-muted-foreground">Попробуйте изменить запрос или выбрать другую тему.</p><Button type="button" variant="outline" className="mt-6" onClick={resetFilters}>Показать все статьи</Button></div>}</div></section></>;
}
import { useState } from "react";
import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { ArrowLeft, Rss } from "lucide-react";
import { getArticle, articles } from "@/data/site";
import { PageIntro, FinalCta } from "@/components/content";
import { ChannelFeed } from "@/components/channel-feed";
import { TelegramShare } from "@/components/telegram-share";
import { seoMeta, canonical } from "@/lib/seo";
import { listPublishedSiteArticles } from "@/lib/site-articles.functions";

export const Route = createFileRoute("/blog/$slug")({
  // Рукописная статья из кода, а если её нет — опубликованная статья из базы.
  loader: async ({ params }) => {
    const local = getArticle(params.slug);
    if (local) return local;
    const db = await listPublishedSiteArticles();
    const found = db.find((a) => a.slug === params.slug);
    if (!found) throw notFound();
    return found;
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Статья не найдена — Раппóрт" }] };
    const base = seoMeta(`/blog/${loaderData.slug}`);
    const title = `${loaderData.title} — Раппóрт`;
    return {
      links: canonical(`/blog/${loaderData.slug}`),
      meta: [
        ...base.filter((m) => !("title" in m)),
        { title },
        { name: "description", content: loaderData.description },
        { property: "og:title", content: title },
        { property: "og:description", content: loaderData.description },
        { property: "og:type", content: "article" },
        {
          property: "article:published_time",
          content: loaderData.publishedAt ?? "2026-10-02",
        },
        { property: "article:author", content: loaderData.author ?? "Артём Ефимов" },
        { name: "twitter:card", content: "summary_large_image" },
        {
          name: "twitter:title",
          content: title,
        },
        { name: "twitter:description", content: loaderData.description },
        {
          name: "google-adsense-account",
          content: "ca-pub-1588069216590175",
        },
        {
          name: "google-site-verification",
          content: "6jfn7wRwWmB0A05BE2l3vwJN3KhwYnDWmm57mCkDcaY",
        },
        {
          tagName: "script",
          child: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: loaderData.title,
            description: loaderData.description,
            datePublished: loaderData.publishedAt ?? "2026-10-02",
            author: loaderData.author ?? "Артём Ефимов",
            publisher: { "@type": "Organization", name: "Раппóрт", url: "https://rapportgame.ru" },
            mainEntityOfPage: { "@type": "WebPage", "@id": `https://rapportgame.ru/blog/${loaderData.slug}` },
          }),
          type: "application/ld+json",
        },
      ] as any,
    };
  },
  component: ArticlePage,
  notFoundComponent: () => <ArticleMissing />,
});

function ArticlePage() {
  const loaderData = Route.useLoaderData();
  if (!loaderData) throw notFound();
  const related = articles.filter((a) => a.slug !== loaderData.slug).slice(0, 3);
  return (
    <>
      <PageIntro eyebrow={loaderData.category} title={loaderData.title} text={loaderData.description} />
      <section className="section">
        <div className="section-inner max-w-3xl">
          <Link to="/blog" className="mb-10 inline-flex items-center gap-2 text-sm text-muted-foreground"><ArrowLeft className="size-4" /> Все статьи</Link>
          <p className="text-lg font-medium leading-relaxed md:text-xl">{loaderData.intro}</p>
          <p className="mt-6 text-xs text-muted-foreground">{loaderData.date} · {loaderData.readTime}</p>
          {loaderData.sections.map((section, i) => (
            <div key={i} className="mt-10">
              {section.heading && <h2 className="font-display text-3xl leading-none">{section.heading}</h2>}
              {section.paragraphs?.map((p, j) => <p key={j} className="mt-5 text-foreground/80 leading-relaxed">{p}</p>)}
              {section.bullets && <ul className="mt-5 grid gap-2">{section.bullets.map((b, j) => <li key={j} className="flex gap-3 text-foreground/80"><span className="text-primary">—</span>{b}</li>)}</ul>}
            </div>
          ))}
          {loaderData.author && (
            <aside className="mt-12 rounded-3xl border border-border bg-secondary/40 p-7">
              <p className="text-xs uppercase tracking-[0.2em] text-primary">Автор</p>
              <p className="mt-3 font-display text-2xl">{loaderData.author}</p>
              {loaderData.authorBio && <p className="mt-3 text-sm text-muted-foreground">{loaderData.authorBio}</p>}
              <div className="mt-4 flex flex-wrap gap-3 text-sm">
                {loaderData.authorTelegram && <a className="inline-flex items-center gap-2 text-primary" href={`https://t.me/${loaderData.authorTelegram}`} target="_blank" rel="noreferrer"><Rss className="size-4" /> Telegram автора</a>}
                {loaderData.authorChannel && <a className="inline-flex items-center gap-2 text-primary" href={loaderData.authorChannel} target="_blank" rel="noreferrer"><Rss className="size-4" /> Канал автора</a>}
              </div>
            </aside>
          )}
          <div className="mt-10"><TelegramShare title={loaderData.title} text={loaderData.description} /></div>
          <div className="mt-14"><p className="eyebrow">Читайте также</p><div className="mt-4 grid gap-4 md:grid-cols-3">{related.map((a) => <Link key={a.slug} to="/blog/$slug" params={{ slug: a.slug }} className="rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary"><p className="text-xs uppercase tracking-[0.2em] text-primary">{a.category}</p><p className="mt-2 font-medium leading-tight">{a.title}</p></Link>)}</div></div>
          <div className="mt-14"><p className="eyebrow">Свежие посты из Telegram</p><ChannelFeed embedded /></div>
        </div>
      </section>
      <FinalCta />
    </>
  );
}

function ArticleMissing() {
  const [retry, setRetry] = useState(0);
  return (
    <section className="section">
      <div className="section-inner max-w-3xl text-center">
        <p className="eyebrow">Статья не найдена</p>
        <h1 className="mt-4 font-display text-4xl">Такой статьи больше нет</h1>
        <p className="mt-4 text-muted-foreground">Она могла быть переименована или удалена.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button onClick={() => setRetry((v) => v + 1)} className="rounded-full border border-border px-5 py-2.5 text-sm">Повторить проверку</button>
          <Link to="/blog" className="rounded-full bg-primary px-5 py-2.5 text-sm text-primary-foreground">Все статьи</Link>
        </div>
        {retry > 0 && <p className="mt-4 text-xs text-muted-foreground">Статьи по-прежнему нет в списке.</p>}
      </div>
    </section>
  );
}

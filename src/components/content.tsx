import { Link } from "@tanstack/react-router";
import { ArrowRight, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { articles, processPhotos, TELEGRAM_URL, TELEGRAM_CHANNEL_URL, type Article } from "@/data/site";

export function PageIntro({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return <section className="page-intro"><div className="mx-auto max-w-5xl px-5 py-20 text-center md:py-28"><p className="eyebrow">{eyebrow}</p><h1 className="mt-4 font-display text-5xl leading-[1.05] md:text-7xl">{title}</h1><p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">{text}</p></div></section>;
}

export function ArticleCard({ article }: { article: Article }) {
  return <article className="group border-t border-border pt-5"><div className="flex items-center justify-between text-xs uppercase tracking-widest text-muted-foreground"><span>{article.category}</span><span>{article.readTime}</span></div><h2 className="mt-5 font-display text-3xl leading-tight md:text-4xl"><Link to="/blog/$slug" params={{ slug: article.slug }} className="transition-colors group-hover:text-primary">{article.title}</Link></h2><p className="mt-4 line-clamp-3 leading-7 text-muted-foreground">{article.description}</p>{article.author && <p className="mt-4 text-sm text-muted-foreground">Автор — <span className="font-medium text-foreground">{article.author}</span>{article.authorChannel ? <> · канал «{article.authorChannel}»</> : null}</p>}<Link to="/blog/$slug" params={{ slug: article.slug }} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">Читать статью <ArrowRight className="size-4" /></Link></article>;
}

export function LatestArticles({ limit = 3 }: { limit?: number }) {
  return <div className="grid gap-10 md:grid-cols-3">{articles.slice(0, limit).map((article) => <ArticleCard key={article.slug} article={article} />)}</div>;
}

export function ProcessGallery({ photos = processPhotos }: { photos?: readonly { src: string; alt: string; caption: string }[] }) {
  return <div className="process-gallery" aria-label="Фотографии с игр «Раппóрт»">
    {photos.map((photo, index) => <figure key={photo.src} className={`process-photo ${index === 0 ? "process-photo-featured" : ""}`}>
      <img src={photo.src} alt={photo.alt} loading="lazy" />
      <figcaption>{photo.caption}</figcaption>
    </figure>)}
  </div>;
}

export function FinalCta({ channel = false }: { channel?: boolean }) {
  if (channel) return <section className="final-cta"><div className="mx-auto max-w-5xl px-5 py-20 text-center md:py-28"><p className="eyebrow text-primary">Будьте в курсе</p><h2 className="mt-4 font-display text-5xl md:text-7xl">Подпишитесь на Telegram-канал</h2><p className="mx-auto mt-5 max-w-xl opacity-75">Новые игры, расписание встреч и истории участников — в канале @rapport_game.</p><Button asChild size="lg" className="mt-8"><a href={TELEGRAM_CHANNEL_URL} target="_blank" rel="noreferrer"><Send />Подписаться</a></Button></div></section>;
  return <section className="final-cta"><div className="mx-auto max-w-5xl px-5 py-20 text-center md:py-28"><p className="eyebrow text-primary">Начать с разговора</p><h2 className="mt-4 font-display text-5xl md:text-7xl">Выберите свою игру</h2><p className="mx-auto mt-5 max-w-xl opacity-75">Напишите Артёму в Telegram — поможем найти подходящий формат и ближайшую встречу.</p><Button asChild size="lg" className="mt-8"><a href={TELEGRAM_URL} target="_blank" rel="noreferrer"><Send />Записаться в Telegram</a></Button></div></section>;
}
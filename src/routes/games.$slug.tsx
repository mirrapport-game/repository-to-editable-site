import { GAME_SEO } from "@/data/games";
import { BeforeAfter, SubscribeBanner } from "@/components/before-after";
import { QuestGate } from "@/components/quest-gate";
import { seoHead, SITE_URL } from "@/lib/seo";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Check, Monitor, Quote, Send, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FinalCta } from "@/components/content";
import { CharacterNote, ZhivayaStory } from "@/components/character-note";
import { OpenCityCta, OrderHost } from "@/components/city-blocks";
import { InstallPrompt } from "@/components/install-prompt";
import { GameReveal } from "@/components/game-reveal";
import { RelationshipQuestionGenerator } from "@/components/relationship-question-generator";
import { GameOrderForm } from "@/components/game-order-form";
import { GameCalendar } from "@/components/game-calendar";
import { GameDetailsSections } from "@/components/game-details";
import { AuthorGameVideo } from "@/components/author-game-video";
import { getGame, TELEGRAM_URL } from "@/data/site";
import { BusinessOffer } from "@/components/business-offer";
import { BeautyOffer } from "@/components/beauty-offer";
import { ZhivayaOffer } from "@/components/zhivaya-offer";
import { PageMotion } from "@/components/motion";
import { GameFacts } from "@/components/game-facts";

const OFFER_PRICE: Record<string, number> = { business: 50000 };


export const Route = createFileRoute("/games/$slug")({
  loader: ({ params }) => { const game = getGame(params.slug); if (!game || game.comingSoon) throw notFound(); return game; },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [
      { title: "Игра не найдена — Раппóрт" },
      { name: "description", content: "Эта игра недоступна. Выберите игру в каталоге Раппóрт." },
      { property: "og:title", content: "Игра не найдена — Раппóрт" },
      { property: "og:description", content: "Эта игра недоступна. Выберите игру в каталоге Раппóрт." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ] };
    const seo = GAME_SEO[loaderData.slug] ?? { title: `${loaderData.title} — Раппорт | Психологическая игра`, description: loaderData.description, keywords: [] };
    const h = seoHead({ title: seo.title, description: seo.description, path: `/games/${loaderData.slug}`, image: loaderData.image, keywords: [...seo.keywords, loaderData.title, `${loaderData.title} отзывы`, "записаться на игру"], type: "product" });
    return { ...h, scripts: [{ type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "Product", name: loaderData.title, description: seo.description, brand: { "@type": "Brand", name: "Раппóрт" }, url: `${SITE_URL}/games/${loaderData.slug}`, offers: { "@type": "Offer", priceCurrency: "RUB", price: OFFER_PRICE[loaderData.slug] ?? 75000, availability: "https://schema.org/InStock" } }) }] };
  },
  component: GamePage,
});
function GamePage() {
  const game = Route.useLoaderData();
  const offer = game.slug === "business" ? <BusinessOffer /> : game.slug === "beauty" ? <BeautyOffer /> : game.slug === "zhivaya" ? <ZhivayaOffer /> : null;
  if (offer) return <><PageMotion key={game.slug} />{offer}{game.slug === "zhivaya" && <div id="rapport-ai" className="scroll-mt-24"><RelationshipQuestionGenerator mode="self" /></div>}<GameFacts /></>;
  return <><PageMotion key={game.slug} />
    <section className="game-story-hero">
      <div className="section-inner game-story-nav"><Link to="/games" className="inline-flex items-center gap-2 text-sm text-muted-foreground"><ArrowLeft className="size-4" />Все игры</Link></div>
      <div className="section-inner game-story-heading">
        <p className="eyebrow">{game.tagline}</p>
        <h1>{game.title}</h1>
        <p>{game.description}</p>
      </div>
      <GameReveal game={game} />
    </section>

    <section className="game-story-manifesto">
      <div className="section-inner">
        <p className="eyebrow">Внутри игры</p>
        <h2>Не готовые ответы.<br />Ваш новый опыт.</h2>
        <p className="game-story-lead">Здесь можно увидеть привычный сценарий со стороны, попробовать другой ход и забрать это открытие в настоящую жизнь.</p>
      </div>
    </section>

    {game.slug === "otnosheniya" && <AuthorGameVideo />}
    {game.slug === "zhivaya" && game.gallery?.[0] && <GalleryBand item={game.gallery[0]} caption="Ближе к себе. Ближе к жизни." />}
    <GameDetailsSections slug={game.slug} />
    {game.slug === "zhivaya" && game.gallery?.[1] && <GalleryBand item={game.gallery[1]} />}
    {game.slug === "zhivaya" && <ZhivayaStory />}
    <CharacterNote />
    <BeforeAfter />

    <section className="game-story-details">
      <div className="section-inner">
        <div className="gsd-head"><span className="gsd-rule" /><p>Детали игры</p><span className="gsd-rule" /></div>
        <h2 className="gsd-title">{game.format}</h2>
        {game.formats && (
          <div className="game-format-cards">
            {game.formats.map((item) => (
              <div key={item.kind} className="game-format-card">
                <span className="game-format-icon">{item.kind === "online" ? <Monitor /> : <Users />}</span>
                <span className="game-format-label">{item.label}</span>
                <span className="game-format-note">{item.note}</span>
              </div>
            ))}
          </div>
        )}
        <p className="gsd-duration">{game.duration}</p>
        <div className="gsd-grid">
          <div className="gsd-col gsd-light">
            {game.audienceImage && <img className="gsd-photo" src={game.audienceImage.src} alt={game.audienceImage.alt} loading="lazy" />}
            <h3><span className="gsd-icon"><Users /></span>Для кого</h3>
            <ul>{game.audience.map((item) => <li key={item}><Check />{item}</li>)}</ul>
          </div>
          <div className="gsd-col gsd-dark">
            {game.outcomeImage && <img className="gsd-photo" src={game.outcomeImage.src} alt={game.outcomeImage.alt} loading="lazy" />}
            <h3><span className="gsd-icon"><Check /></span>После игры</h3>
            <ul>{game.outcomes.map((item) => <li key={item}><Check />{item}</li>)}</ul>
          </div>
        </div>
        <div className="gsd-dots"><i /><b /><i /><b /><i /></div>
      </div>
    </section>

    {game.slug === "zhivaya" && game.gallery?.[2] && <GalleryBand item={game.gallery[2]} />}
    {game.slug === "zhivaya" && <GameCalendar gameTitle={game.title} keyword="Живая" />}

    {game.testimonials && <section className="section border-t border-border"><div className="section-inner"><p className="eyebrow">Отзывы</p><h2 className="section-title max-w-4xl">Что говорят участники</h2><div className="game-testimonials mt-10">{game.testimonials.map((t) => <figure key={t.text} className="game-testimonial"><Quote className="size-6 text-primary" /><blockquote>{t.text}</blockquote><figcaption>{t.author}</figcaption></figure>)}</div><Link to="/reviews" className="mt-8 inline-block text-sm font-medium text-primary">Смотреть видеоотзывы →</Link></div></section>}

    {game.slug === "otnosheniya" && <div id="rapport-ai" className="scroll-mt-24"><QuestGate title="Rapport AI — вопросы для пары"><RelationshipQuestionGenerator /></QuestGate></div>}
    {game.slug === "zhivaya" && <div id="rapport-ai" className="scroll-mt-24"><QuestGate title="Rapport AI — вопросы для себя"><RelationshipQuestionGenerator mode="self" /></QuestGate></div>}

    <InstallPrompt />

    {game.gallery && (game.slug !== "zhivaya" || game.gallery.length > 3) && <section className="section border-t border-border bg-secondary"><div className="section-inner"><p className="eyebrow">Раппóрт Живая</p><h2 className="section-title max-w-4xl">Что происходит на игре</h2><div className="zhivaya-gallery mt-10">{(game.slug === "zhivaya" ? game.gallery.slice(3) : game.gallery).map((item)=><figure key={item.src} className="zhivaya-gallery-item"><img src={item.src} alt={item.alt} loading="lazy" width={824} height={1098}/></figure>)}</div></div></section>}

    <section className="game-story-booking"><div className="section-inner"><p className="eyebrow">Попробовать</p><h2>Ваша история начинается<br />с одной игры.</h2><p>Участие — от 2 500 ₽</p><GameOrderForm gameTitle={game.title} /></div></section>

    {game.slug === "otnosheniya" && <section className="section border-t border-border"><div className="section-inner max-w-3xl text-center">
      <p className="eyebrow">Мини-игра онлайн</p>
      <h2 className="section-title">Играйте с друзьями онлайн без ведущего</h2>
      <p className="mt-4 text-muted-foreground">6 этапов — от знакомства до близости. Выберите число игроков и по очереди тяните карточки: передавайте телефон или смотрите в один ноутбук. Первая игра бесплатно.</p>
      <div className="mt-8 flex flex-wrap gap-3"><Button asChild size="lg"><a href="https://t.me/Rapport_game_bot?start=play" target="_blank" rel="noreferrer"><Send />Играть в Telegram</a></Button><Button asChild size="lg" variant="outline"><Link to="/play">Играть на сайте</Link></Button></div>
    </div></section>}
    <GameFacts />
    <OrderHost />
    <OpenCityCta />
    <FinalCta />
  </>;
}
function GalleryBand({ item, caption }: { item: { src: string; alt: string }; caption?: string }) {
  return <section className="section border-t border-border bg-secondary"><div className="section-inner"><figure className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
    <img src={item.src} alt={item.alt} loading="lazy" className="w-full object-cover" />
    <figcaption className="p-5 text-center font-display text-2xl">{caption ?? item.alt}</figcaption>
  </figure></div></section>;
}

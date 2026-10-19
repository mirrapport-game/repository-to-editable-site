import { BeforeAfter, SubscribeBanner } from "@/components/before-after";
import { LiveGamesSlider } from "@/components/live-games-slider";
import { HostRotator } from "@/components/host-rotator";
import { seoMeta, canonical } from "@/lib/seo";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Box, FileText, Globe, Megaphone, MessageCircle, PlayCircle, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProcessGallery } from "@/components/content";
import { FacilitatorApplicationForm } from "@/components/facilitator-application-form";
import { PriceCalculator } from "@/components/price-calculator";
import { FacilitatorTariffs } from "@/components/facilitator-tariffs";
import { TELEGRAM_URL } from "@/data/site";
import { cities } from "@/data/cities";
import facCards from "@/assets/facilitators/fac-cards.jpg";
import facTable from "@/assets/facilitators/fac-table.jpg";
import { VideoCarousel } from "@/components/video-carousel";

// First 8 unique hosts with photos, in city order; each links to their city page.
const featuredHosts = (() => {
  const seen = new Set<string>(); const out: { slug: string; city: string; name: string; photo: string }[] = [];
  for (const c of cities) for (const h of c.facilitators) {
    if (!h.photo || seen.has(h.slug) || out.length >= 8) continue;
    seen.add(h.slug); out.push({ slug: h.slug, city: c.slug, name: `${h.name} ${h.surname}`.trim(), photo: h.photo });
  }
  return out;
})();

const facPhotos = [
  { src: facCards, alt: "Карточки «Раппóрт» на игровом столе", caption: "Карточки этапов на столе" },
  { src: facTable, alt: "Участницы игры «Раппóрт» за столом", caption: "Живая игра в группе" },
];

const kit = [
  { Icon: Box, title: "Коробочная версия", text: "Полный игровой комплект для очных встреч и групповой практики." },
  { Icon: PlayCircle, title: "Онлайн-формат", text: "Возможность проводить встречи с участниками из разных городов." },
  { Icon: BookOpen, title: "Обучение и методика", text: "Инструкции, обучающие видео и понятная структура проведения игры." },
  { Icon: Users, title: "Сообщество", text: "Среда ведущих для обмена опытом, практики и профессиональной поддержки." },
  { Icon: FileText, title: "Методички", text: "Пошаговые материалы по проведению каждой игры." },
  { Icon: MessageCircle, title: "Скрипты", text: "Готовые тексты для приглашения участников и ведения игры." },
  { Icon: Globe, title: "Сайт", text: "Своя страница ведущего на сайте «Раппóрт»." },
  { Icon: Megaphone, title: "Рекламный кабинет", text: "Настроенный кабинет для привлечения участников." },
] as const;

const audiences = ["Психологам и семейным консультантам", "Коучам, наставникам и помогающим практикам", "Организаторам сообществ и психологических центров", "Тем, кто хочет освоить профессию игропрактика"];

export const Route = createFileRoute("/facilitators")({
  head: () => ({ links: canonical("/facilitators"), meta: [...seoMeta("/facilitators"), 
    { title: "Как стать игропрактиком и вести психологические игры — обучение «Раппóрт»" },
    { name: "description", content: "Академия Раппóрт психологической игры «Раппóрт»: коробочный и онлайн-формат, методика, видео и поддержка сообщества." },
    { property: "og:title", content: "Стать ведущим игры «Раппóрт»" },
    { property: "og:description", content: "Готовая методика для психологов, коучей, сообществ и будущих игропрактиков." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: FacilitatorsPage,
});

function FacilitatorsPage() {
  return <>
    <section className="facilitator-hero"><div className="section-inner grid min-h-[42rem] items-end gap-10 py-16 lg:grid-cols-[1.15fr_.85fr]">
      <div><p className="eyebrow text-accent">Игропрактика «Раппóрт»</p><h1 className="mt-5 max-w-4xl font-display text-6xl leading-[.94] sm:text-7xl lg:text-[5.5rem]">Вести людей к важным <em className="text-accent">разговорам</em></h1><p className="mt-7 max-w-2xl text-lg leading-8 text-background/75">Освойте психологическую игру про отношения и получите готовую структуру для очных и онлайн-встреч — без необходимости придумывать упражнения с нуля.</p><Button asChild size="lg" className="mt-9"><a href={TELEGRAM_URL} target="_blank" rel="noreferrer">Узнать условия <ArrowRight /></a></Button></div>
      <div className="border-l border-background/20 pl-7"><p className="font-display text-3xl italic text-background/90">Ведущий не даёт готовых ответов. Он создаёт пространство, где участник слышит себя.</p></div>
    </div></section>

    <section className="section"><div className="section-inner"><div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr]"><div><p className="eyebrow">Кому подходит</p><h2 className="section-title">Новый инструмент для вашей <em>практики</em></h2></div><div className="divide-y divide-border border-y border-border">{audiences.map((item, index)=><div key={item} className="flex gap-5 py-6"><span className="text-sm text-primary">0{index + 1}</span><p className="text-lg">{item}</p></div>)}</div></div></div></section>

    <section className="section bg-secondary"><div className="section-inner"><p className="eyebrow">Комплект ведущего</p><h2 className="section-title max-w-4xl">Всё, чтобы провести <em>первую игру</em></h2><div className="mt-14 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">{kit.map(({ Icon, title, text })=><div key={title} className="bg-secondary p-7"><Icon className="size-7 text-primary"/><h3 className="mt-8 font-display text-3xl">{title}</h3><p className="mt-3 leading-7 text-muted-foreground">{text}</p></div>)}</div></div></section>

    <PriceCalculator />

    <section className="section"><div className="section-inner"><div className="mb-12 grid gap-6 md:grid-cols-2 md:items-end"><div><p className="eyebrow">Не теория, а практика</p><h2 className="section-title">Так выглядят <em>живые игры</em></h2></div><p className="max-w-lg text-lg leading-8 text-muted-foreground">Карты помогают начать, ведущий держит процесс, а участники проживают знакомые ситуации и пробуют разговаривать по-новому.</p></div><LiveGamesSlider rapportPhotos={facPhotos} /></div></section>

    <section className="section bg-secondary"><div className="section-inner"><p className="eyebrow">Команда</p><h2 className="section-title">Наши <em>ведущие</em> по городам</h2><HostRotator /><div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">{featuredHosts.map((h) => <Link key={h.slug} to="/cities/$slug" params={{ slug: h.city }} className="group flex flex-col items-center text-center"><img src={h.photo} alt={h.name} loading="lazy" className="size-28 rounded-full border-4 border-background object-cover shadow-md transition-transform group-hover:scale-105 md:size-36" /><span className="mt-3 font-display text-lg">{h.name}</span></Link>)}</div><div className="mt-10 flex flex-wrap gap-3">{cities.map((c) => <Button key={c.slug} asChild variant="outline"><Link to="/cities/$slug" params={{ slug: c.slug }}>{c.name}</Link></Button>)}</div></div></section>




    <FacilitatorTariffs />


    <section className="section bg-foreground text-background"><div className="section-inner grid gap-12 lg:grid-cols-2"><div><p className="eyebrow text-accent">Как начать</p><h2 className="mt-4 font-display text-5xl leading-none md:text-7xl">От знакомства с методом — к своей первой группе</h2></div><div className="space-y-8">{[["01","Сыграть","Познакомиться с механикой и прожить процесс как участник."],["02","Обучиться","Изучить правила, работу с вопросами и структуру обратной связи."],["03","Провести","Собрать первую группу и провести встречу по готовой методике."],["04","Развиваться","Обсуждать практику с сообществом и находить свой стиль ведения."]].map(([number,title,text])=><div key={number} className="grid grid-cols-[3rem_1fr] gap-4 border-t border-background/20 pt-6"><span className="text-accent">{number}</span><div><h3 className="font-display text-3xl">{title}</h3><p className="mt-2 text-background/65">{text}</p></div></div>)}</div></div></section>

    <BeforeAfter title="Ведущий до и после «Раппóрт»" pairs={[["Каждую встречу придумываете с нуля","Готовая структура игры и методички"],["Сложно собрать группу","Понятный формат, который легко объяснить"],["Доход только от консультаций","Игры и тренинги как новый источник дохода"]]} />
    <section id="trial" className="section"><div className="section-inner"><p className="eyebrow">Тестовая игра</p><h2 className="section-title max-w-4xl">Нет понимания, подойдёт ли вам <em>наш формат?</em></h2><p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">Сыграйте сначала, а потом примите решение. Попробуйте вести игру всего за 7 500 ₽.</p><div className="mt-12 grid gap-px bg-border md:grid-cols-2"><div className="bg-background p-8"><p className="font-display text-5xl text-primary">2 500 ₽</p><h3 className="mt-4 font-display text-3xl">Пробная игра</h3><p className="mt-3 leading-7 text-muted-foreground">Сначала вы проходите игру как участник — так становится понятно, как её вести.</p></div><div className="bg-background p-8"><p className="font-display text-5xl text-primary">5 000 ₽</p><h3 className="mt-4 font-display text-3xl">Доступ к игре</h3><p className="mt-3 leading-7 text-muted-foreground">Получаете доступ к игре и проводите её на свою аудиторию.</p></div></div><p className="mt-6 text-lg">Итого: <strong>7 500 ₽</strong> за первый опыт ведения.</p><Button asChild className="mt-6"><a href="#facilitator-apply">Оставить заявку <ArrowRight /></a></Button></div></section>
    <section className="section bg-secondary"><div className="section-inner"><VideoCarousel eyebrow="Видео" heading="Сообщество экспертов «Раппóрт»" poster="/video/soobschestvo-poster.jpg" videos={[{ src: "/video/soobschestvo-ekspertov.mp4", title: "Сообщество экспертов" }]} /></div></section>
    <section id="facilitator-apply" className="section"><div className="section-inner grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-start"><div><MessageCircle className="size-9 text-primary"/><p className="eyebrow mt-6">Условия и форматы</p><h2 className="mt-4 font-display text-5xl leading-none md:text-7xl">Оставьте заявку на знакомство</h2><p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">Расскажите, откуда вы и какой формат вам интересен. Артём свяжется с вами и ответит на вопросы о программе и ближайшем старте.</p><Button asChild variant="outline" className="mt-7"><a href={TELEGRAM_URL} target="_blank" rel="noreferrer">Или написать в Telegram <ArrowRight /></a></Button><p className="mt-6"><Link to="/course" className="text-primary underline underline-offset-4 hover:opacity-80">Я уже ведущий — войти в кабинет</Link></p></div><FacilitatorApplicationForm /></div></section>
  </>;
}
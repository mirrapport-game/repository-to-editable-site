import { seoMeta, canonical } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";
import { Community } from "@/components/community";

export const Route = createFileRoute("/community")({
  head: () => ({ links: canonical("/community"), meta: [...seoMeta("/community"),
    { title: "Клуб знакомств «Раппóрт» — для свободных и в поиске" },
    { name: "description", content: "Анкеты свободных участников, приглашения на игру, три вопроса о совместимости и открытие контактов при совпадении. 18+." },
    { property: "og:title", content: "Клуб знакомств «Раппóрт»" },
    { property: "og:description", content: "Пригласите на игру, ответьте на три вопроса — и при совпадении откройте контакты друг друга." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
  ] }),
  component: () => <section className="section"><div className="section-inner"><p className="eyebrow">Клуб знакомств «Раппóрт» · 18+</p><h1 className="section-title">Для тех, кто свободен и в поиске</h1><Community /></div></section>,
});

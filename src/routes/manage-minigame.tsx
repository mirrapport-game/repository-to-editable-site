import { createFileRoute } from "@tanstack/react-router";
import { MinigameManager } from "@/components/minigame-manager";

export const Route = createFileRoute("/manage-minigame")({
  ssr: false,
  head: () => ({ meta: [
    { title: "Карточки мини-игры — Раппóрт" },
    { name: "description", content: "Закрытая страница загрузки карточек мини-игры." },
    { property: "og:title", content: "Карточки мини-игры — Раппóрт" },
    { property: "og:description", content: "Закрытая страница." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
    { name: "robots", content: "noindex, nofollow" },
  ] }),
  component: () => <section className="min-h-[70svh] bg-secondary"><div className="section-inner py-14"><p className="eyebrow">Закрытый раздел</p><h1 className="mt-4 font-display text-5xl">Карточки мини-игры</h1><MinigameManager /></div></section>,
});

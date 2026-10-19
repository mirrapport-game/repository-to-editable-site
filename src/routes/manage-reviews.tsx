import { createFileRoute } from "@tanstack/react-router";
import { VideoReviewsManager } from "@/components/video-reviews-manager";
import { HostReviewsModeration } from "@/components/host-reviews";

export const Route = createFileRoute("/manage-reviews")({
  ssr: false,
  head: () => ({ meta: [
    { title: "Управление видеоотзывами — Раппóрт" },
    { name: "description", content: "Закрытая страница управления видеоотзывами проекта «Раппóрт»." },
    { property: "og:title", content: "Управление видеоотзывами — Раппóрт" },
    { property: "og:description", content: "Закрытая страница управления материалами." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
    { name: "robots", content: "noindex, nofollow" },
  ] }),
  component: ManageReviewsPage,
});

function ManageReviewsPage() {
  return <section className="min-h-[70svh] bg-secondary"><div className="section-inner py-14 md:py-20"><p className="eyebrow">Закрытый раздел</p><h1 className="mt-4 max-w-3xl font-display text-5xl leading-none md:text-7xl">Управление видеоотзывами</h1><VideoReviewsManager /><HostReviewsModeration /></div></section>;
}
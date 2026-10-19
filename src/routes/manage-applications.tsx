import { createFileRoute } from "@tanstack/react-router";
import { FacilitatorApplicationsManager } from "@/components/facilitator-applications-manager";

export const Route = createFileRoute("/manage-applications")({
  ssr: false,
  head: () => ({ meta: [
    { title: "Заявки ведущих — Раппóрт" },
    { name: "description", content: "Закрытый список заявок будущих ведущих проекта «Раппóрт»." },
    { property: "og:title", content: "Заявки ведущих — Раппóрт" },
    { property: "og:description", content: "Закрытая страница управления заявками." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
    { name: "robots", content: "noindex, nofollow" },
  ] }),
  component: ManageApplicationsPage,
});

function ManageApplicationsPage() {
  return <section className="min-h-[70svh] bg-secondary"><div className="section-inner py-14 md:py-20"><p className="eyebrow">Закрытый раздел</p><h1 className="mt-4 max-w-3xl font-display text-5xl leading-none md:text-7xl">Заявки будущих ведущих</h1><FacilitatorApplicationsManager /></div></section>;
}
import { createFileRoute } from "@tanstack/react-router";
import { CourseManager } from "@/components/course-manager";

export const Route = createFileRoute("/manage-course")({
  ssr: false,
  head: () => ({ meta: [
    { title: "Управление курсом ведущих — Раппóрт" },
    { name: "description", content: "Закрытая страница: уроки, приглашения и проверка домашних заданий." },
    { property: "og:title", content: "Управление курсом ведущих — Раппóрт" },
    { property: "og:description", content: "Закрытая страница управления обучением." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
    { name: "robots", content: "noindex, nofollow" },
  ] }),
  component: ManageCoursePage,
});

function ManageCoursePage() {
  return <section className="min-h-[70svh] bg-secondary"><div className="section-inner py-14 md:py-20"><p className="eyebrow">Закрытый раздел</p><h1 className="mt-4 max-w-3xl font-display text-5xl leading-none md:text-7xl">Курс для ведущих</h1><CourseManager /></div></section>;
}

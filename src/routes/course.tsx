import { createFileRoute } from "@tanstack/react-router";
import { CourseCabinet } from "@/components/course-cabinet";

export const Route = createFileRoute("/course")({
  ssr: false,
  head: () => ({ meta: [
    { title: "Академия Раппóрт — обучение ведущих" },
    { name: "description", content: "Академия Раппóрт: методика, обучающие видео, экзамен, сертификат ведущего и поддержка после обучения." },
    { property: "og:title", content: "Академия Раппóрт — обучение ведущих" },
    { property: "og:description", content: "Путь от методики до сертификата ведущего игр «Раппóрт»: видеоуроки, экзамен и поддержка." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
    { name: "robots", content: "noindex, nofollow" },
  ] }),
  component: CoursePage,
});

function CoursePage() {
  return <section className="min-h-[70svh] bg-secondary"><div className="section-inner py-14 md:py-20"><p className="eyebrow">Академия Раппóрт</p><h1 className="mt-4 max-w-3xl font-display text-5xl leading-none md:text-7xl">Кабинет ведущего</h1><CourseCabinet /></div></section>;
}

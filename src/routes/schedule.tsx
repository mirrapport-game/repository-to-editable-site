import { createFileRoute } from "@tanstack/react-router";
import { MarathonSchedule } from "@/components/marathon-schedule";
import { canonical } from "@/lib/seo";

export const Route = createFileRoute("/schedule")({
  head: () => ({ links: canonical("/schedule"), meta: [
    { title: "Расписание игр Раппóрт — ближайшие встречи" },
    { name: "description", content: "Ближайшие игры Раппóрт: даты, ведущие и свободные места. Выберите встречу и запишитесь." },
    { property: "og:title", content: "Расписание игр Раппóрт" },
    { property: "og:description", content: "Даты ближайших встреч, ведущие и запись на игры Раппóрт." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Schedule,
});

function Schedule() {
  return <>
    <section className="page-intro"><div className="section-inner py-16 md:py-24"><p className="eyebrow">Ближайшие встречи</p><h1 className="section-title">Расписание <em>игр Раппóрт</em></h1></div></section>
    <section className="section"><div className="section-inner"><MarathonSchedule homepage /></div></section>
  </>;
}

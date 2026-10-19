import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { landingHosts, landingTopics } from "@/data/landing-topics";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/lp/$landing/$topic")({
  loader: ({ params }) => {
    const h = landingHosts[params.landing];
    const t = landingTopics.find((x) => x.slug === params.topic);
    if (!h || !t) throw notFound();
    return { h, t };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const title = `${loaderData.t.title} — игра «Раппóрт — Живая» ${loaderData.h.cityIn}`;
    const desc = `${loaderData.t.lead} Женская игра ${loaderData.h.cityIn}, ведущая ${loaderData.h.host}.`;
    return { meta: [{ title }, { name: "description", content: desc }, { property: "og:title", content: title }, { property: "og:description", content: desc }, { property: "og:type", content: "article" }, { name: "twitter:card", content: "summary" }] };
  },
  component: TopicPage,
});

function TopicPage() {
  const { h, t } = Route.useLoaderData();
  const { landing } = Route.useParams();
  const others = landingTopics.filter((x) => x.slug !== t.slug);
  return <article className="mx-auto max-w-3xl px-5 py-12">
    <p className="eyebrow">{h.city} · Раппóрт — Живая</p>
    <h1 className="mt-3 font-display text-4xl md:text-5xl">{t.title}</h1>
    <p className="mt-5 text-lg">{t.lead}</p>
    <div className="mt-6 space-y-4 text-lg leading-8 text-muted-foreground">{t.text.map((p) => <p key={p}>{p}</p>)}</div>
    <h2 className="mt-12 font-display text-3xl">Что было до и что может стать после</h2>
    <p className="mt-2 text-sm text-muted-foreground">Типичные запросы участниц и изменения, к которым стремятся. Результат у каждой свой.</p>
    <div className="mt-6 space-y-4">{t.shifts.map((s) => <div key={s.sphere} className="rounded-xl border border-border bg-card p-5">
      <p className="font-semibold text-primary">{s.sphere}</p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg bg-secondary p-4"><p className="text-xs uppercase text-muted-foreground">До</p><p className="mt-1">{s.before}</p></div>
        <div className="rounded-lg bg-primary/10 p-4"><p className="text-xs uppercase text-muted-foreground">После</p><p className="mt-1">{s.after}</p></div>
      </div></div>)}</div>
    <div className="mt-10 rounded-2xl bg-secondary p-6 text-center">
      <p className="font-display text-2xl">Попробуйте на игре {h.cityIn} с ведущей {h.host}</p>
      <Button asChild size="lg" className="mt-4"><a href={`/lp/${landing}#zapis`}>Записаться на игру</a></Button>
    </div>
    <h2 className="mt-12 font-display text-2xl">Другие темы</h2>
    <ul className="mt-4 space-y-2">{others.map((o) => <li key={o.slug}><Link className="underline" to="/lp/$landing/$topic" params={{ landing, topic: o.slug }}>{o.title}</Link></li>)}</ul>
  </article>;
}

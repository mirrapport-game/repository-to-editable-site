import { EventSignup } from "@/components/event-signup";
import { openBookingWidget } from "@/components/booking-format";
import { seoMeta, canonical, SITE_URL } from "@/lib/seo";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Brain, CalendarDays, Leaf, Loader2, RefreshCw, Send, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cities, getCity, type Facilitator } from "@/data/cities";
import { OpenCityCta, OrderHost } from "@/components/city-blocks";
import { FacilitatorSection } from "@/components/facilitator-reviews";
import { HostReviews } from "@/components/host-reviews";
import { AuthorShowcase } from "@/components/author-showcase";

export const Route = createFileRoute("/cities/$slug")({
  loader: ({ params }) => { const city = getCity(params.slug); if (!city) throw notFound(); return city; },
  head: ({ loaderData }) => {
    const first = loaderData?.facilitators[0];
    const t = loaderData ? `Ведущие игр «Раппóрт» — ${loaderData.name}` : "Ведущие — Раппóрт";
    const d = loaderData ? `Выберите ведущего игр «Раппóрт» в формате ${loaderData.name}. Расписание, отзывы и запись на игру.` : "";
    return { links: loaderData ? canonical(`/cities/${loaderData.slug}`) : [], meta: [...(loaderData ? seoMeta(`/cities/${loaderData.slug}`, [`психологическая игра ${loaderData.name}`, `игра Раппорт ${loaderData.name}`, `игропрактик ${loaderData.name}`, `ведущие игр ${loaderData.name}`, first ? `${first.name} ${first.surname}` : ""]) : []), { title: t }, { name: "description", content: d }, { property: "og:title", content: t }, { property: "og:description", content: d }, { property: "og:type", content: "profile" }, { name: "twitter:card", content: "summary_large_image" }] };
  },
  notFoundComponent: () => <div className="section-inner py-32 text-center">Город пока не найден.</div>,
  component: CityPage,
});

const icons = [Brain, Leaf, Users];

type HostEvent = { id: string; starts_at: string; game: string; place: string; capacity?: number | null };

function CityPage() {
  const loaded = Route.useLoaderData();
  // Guard against stale cached loader data (older shape without `facilitators`).
  const city = { ...loaded, facilitators: Array.isArray(loaded?.facilitators) ? loaded.facilitators : [] };
  const [selectedSlug, setSelectedSlug] = useState(city.facilitators[0]?.slug ?? "");
  const f = city.facilitators.find((item) => item?.slug === selectedSlug) ?? city.facilitators[0];
  const [events, setEvents] = useState<HostEvent[]>([]);
  const [taken, setTaken] = useState<Record<string, number>>({});
  const [asking, setAsking] = useState(false);
  const [asked, setAsked] = useState(false);

  const loadEvents = useCallback(async () => {
    if (!f) return;
    const { data } = await supabase.from("facilitator_events").select("id,starts_at,game,place,capacity").eq("facilitator_slug", f.slug).gte("starts_at", new Date().toISOString()).order("starts_at").limit(20);
    setEvents(data ?? []);
    const ids = (data ?? []).map((e) => e.id);
    if (ids.length) { const { data: t } = await supabase.rpc("event_seats_taken", { _event_ids: ids }); setTaken(Object.fromEntries((t ?? []).map((r) => [r.event_id, r.taken]))); }
  }, [f]);

  useEffect(() => { void loadEvents(); }, [loadEvents]);

  // After asking the facilitator, keep checking for her reply for ~3 minutes.
  useEffect(() => {
    if (!asked) return;
    const t = setInterval(() => void loadEvents(), 15000);
    const stop = setTimeout(() => clearInterval(t), 3 * 60 * 1000);
    return () => { clearInterval(t); clearTimeout(stop); };
  }, [asked, loadEvents]);

  const askSchedule = async () => {
    if (!f) return;
    setAsking(true);
    try {
      await fetch(`/api/public/telegram/ask-schedule?facilitator=${encodeURIComponent(f.slug)}`, { method: "POST" });
      setAsked(true);
    } finally { setAsking(false); }
  };
  if (!f) return <main><div className="section-inner py-32 text-center">Ведущие скоро появятся.</div></main>;
  return <main>
    <section className="host-card-section"><div className="section-inner">
      <div className="host-selector-heading">
        <div><p className="eyebrow">{city.name}</p><h1>Выберите ведущего</h1><p>Познакомьтесь с ведущими и выберите того, с кем хочется сыграть.</p></div>
        <nav className="host-location-tabs" aria-label="Формат и город">
          {[city, ...cities.filter((c) => c.slug !== city.slug)].map((item) => <a key={item.slug} href={`/cities/${item.slug}`} aria-current={city.slug === item.slug ? "page" : undefined}>{item.name}</a>)}
        </nav>
      </div>
      <div className="host-selector-grid">
        {city.facilitators.map((host) => <button type="button" key={host.slug} className="host-selector-card" aria-pressed={host.slug === f.slug} onClick={() => setSelectedSlug(host.slug)}>
          <HostPhoto host={host} />
          <span><small>{host.slug === f.slug ? "Выбран" : "Выбрать"}</small>{host.name} {host.surname}</span>
        </button>)}
        <a className="host-selector-more" href="/facilitators"><span>Стать ведущим<br />в этом городе</span></a>
      </div>
      <div className="host-card">
        <div className="host-card-photo-wrap"><HostPhoto host={f} className="host-card-photo" alt={`${f.name} ${f.surname}, ведущий игр «Раппóрт», ${city.name}`} />{f.slug === "artem-efimov" ? <span>Автор игр</span> : null}</div>
        <div className="host-card-body">
          <p className="eyebrow">Раппóрт · {city.name}</p>
          <h2 className="host-card-name">{f.name}{f.surname ? <span>{f.surname}</span> : null}</h2>
          <p className="mt-3 text-sm"><span className="text-muted-foreground">Ведёт игры: </span>{gamesOf(f.slug).join(" · ")}</p><div className="host-locations">{[...f.locations].sort((a, b) => Number(b === city.name) - Number(a === city.name)).map((location) => <span key={location}>{location}</span>)}</div>
          <ul>{f.roles.map((r, i) => { const I = icons[i] ?? Users; return <li key={r}><span><I /></span>{r}</li>; })}</ul>
          {f.story.map((p) => <p key={p} className="host-card-story">{p}</p>)}
          {paid(f.slug) && f.channelUrl ? <p className="mt-4 text-sm">Канал ведущего: <a href={f.channelUrl} target="_blank" rel="noreferrer" className="text-primary underline underline-offset-4">{f.channelUrl.replace("https://", "")}</a></p> : null}
          {f.introVideo ? <video key={f.slug} src={f.introVideo} poster={f.photo || undefined} controls playsInline preload="none" className="mt-6 aspect-video w-full rounded-xl bg-muted object-cover" aria-label={`Видео-знакомство: ${f.name} ${f.surname}`} /> : null}
          {paid(f.slug) ? <Button asChild size="lg" className="mt-8"><a href={f.telegramUrl} target="_blank" rel="noreferrer"><Send />Записаться: {f.telegram}</a></Button> : <Button type="button" size="lg" className="mt-8" onClick={openBookingWidget}><Send />Записаться на игру</Button>}
          <p className="host-card-motto">Играй · Развивайся · Создавай гармоничные отношения</p>
        </div>
      </div>
    </div></section>
    <section className="section border-t border-border"><div className="section-inner">
      <p className="eyebrow">Расписание</p>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 className="section-title">Игры на неделю</h2>
        <Button variant="outline" onClick={() => void askSchedule()} disabled={asking}>
          {asking ? <Loader2 className="animate-spin" /> : <RefreshCw />}Запросить расписание
        </Button>
      </div>
      {asked && <p className="mt-4 text-sm text-muted-foreground">Мы написали {f.name} в Telegram — как только ведущий ответит, игры появятся в календаре ниже автоматически.</p>}
      {events.length ? <>
        <div className="host-calendar">{Array.from({ length: 7 }, (_, i) => {
          const day = new Date(Date.now() + i * 86400000);
          const dayEvents = events.filter((e) => new Date(e.starts_at).toLocaleDateString("ru-RU", { timeZone: city.timeZone }) === day.toLocaleDateString("ru-RU", { timeZone: city.timeZone }));
          return <div key={i} className={`host-cal-day${dayEvents.length ? " has-events" : ""}`}>
            <b>{day.toLocaleDateString("ru-RU", { timeZone: city.timeZone, weekday: "short" })}</b>
            <span>{day.toLocaleDateString("ru-RU", { timeZone: city.timeZone, day: "numeric", month: "short" })}</span>
            {dayEvents.map((e) => <div key={e.id} className="host-cal-event">
              <b>{new Date(e.starts_at).toLocaleTimeString("ru-RU", { timeZone: city.timeZone, hour: "2-digit", minute: "2-digit" })}</b>
              <p>{e.game}</p>
              {e.place ? <span>{e.place}</span> : null}
            </div>)}
          </div>;
        })}</div>
        <div className="host-schedule">{events.map((e) => <div key={e.id} className="host-event"><CalendarDays /><div><b>{new Date(e.starts_at).toLocaleString("ru-RU", { timeZone: city.timeZone, weekday: "short", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })}</b><p>{e.game}</p><span>{e.place}</span><EventSignup eventId={e.id} left={e.capacity != null ? Math.max(0, e.capacity - (taken[e.id] ?? 0)) : undefined} /></div></div>)}</div>
      </>
        : <div className="host-schedule-empty"><CalendarDays /><p>Расписание на эту неделю скоро появится. Нажмите «Запросить расписание» — сайт сам спросит у ведущего и занесёт игры в календарь.</p>{paid(f.slug) ? <Button asChild variant="outline"><a href={f.telegramUrl} target="_blank" rel="noreferrer"><Send />Написать ведущему</a></Button> : <Button type="button" variant="outline" onClick={openBookingWidget}><Send />Оставить заявку</Button>}</div>}
    </div></section>
    <HostReviews slug={f.slug} name={`${f.name} ${f.surname}`}>{f.slug === "artem-efimov" ? <AuthorShowcase /> : null}</HostReviews>
    <FacilitatorSection slug={f.slug} name={`${f.name} ${f.surname}`} />
    <OrderHost />
    <OpenCityCta />
  </main>;
}

function HostPhoto({ host, className, alt }: { host: Facilitator; className?: string; alt?: string }) {
  const label = alt ?? `${host.name} ${host.surname}`.trim();
  if (host.photo) return <img src={host.photo} alt={label} className={className} loading="lazy" />;
  const initials = `${host.name[0] ?? ""}${host.surname[0] ?? ""}`.toUpperCase();
  return <div role="img" aria-label={label} className={`${className ?? ""} flex aspect-[4/5] w-full items-center justify-center bg-secondary font-serif text-5xl text-primary`}>{initials}</div>;
}

const ZHIVAYA_HOSTS = new Set(["yulia-novitskaya", "natalya-vanyushkina", "artem-efimov", "natalya-kireeva", "marina-kravchenko"]);
// Paid hosts (those who bought «Живая») keep their personal contacts; others route to the shared booking form.
const paid = (slug: string) => ZHIVAYA_HOSTS.has(slug);
function gamesOf(slug: string) { return ["«Раппóрт про отношения»", ...(ZHIVAYA_HOSTS.has(slug) ? ["«Раппóрт — Живая»"] : [])]; }

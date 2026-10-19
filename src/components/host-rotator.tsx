import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { cities } from "@/data/cities";

/** Два круга, в которых по очереди сменяются ведущие с подписью, кто они. */
export function HostRotator() {
  const hosts = useMemo(() => {
    const seen = new Set<string>();
    return cities.flatMap((c) => c.facilitators.map((f) => ({ ...f, city: c.slug, cityName: c.name })))
      .filter((h) => h.photo && !seen.has(h.slug) && seen.add(h.slug));
  }, []);
  const [tick, setTick] = useState(0);
  useEffect(() => { const t = setInterval(() => setTick((n) => n + 1), 3500); return () => clearInterval(t); }, []);
  if (hosts.length < 2) return null;
  const half = Math.ceil(hosts.length / 2);
  const pick = [hosts[tick % half]!, hosts[half + (tick % (hosts.length - half))]!];
  return <div className="mt-10 grid gap-8 sm:grid-cols-2">{pick.map((h, i) => <Link key={i} to="/cities/$slug" params={{ slug: h.city }} className="group flex flex-col items-center text-center">
    <img key={h.slug} src={h.photo} alt={`${h.name} ${h.surname}`} className="size-44 animate-in fade-in rounded-full border-4 border-background object-cover shadow-md duration-700 md:size-56" />
    <span className="mt-4 font-display text-2xl">{h.name} {h.surname}</span>
    <span className="mt-1 text-sm text-primary">{h.roles[0]}</span>
    <span className="text-sm text-muted-foreground">{h.cityName}</span>
  </Link>)}</div>;
}

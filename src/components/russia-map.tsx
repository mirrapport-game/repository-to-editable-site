import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TELEGRAM_URL } from "@/data/site";
import { MAP_CITIES, RUSSIA_PATH, type MapCity } from "@/data/russia-map";

// Положение подписей, чтобы соседние города не наезжали друг на друга.
const LABEL: Record<string, "l" | "r" | "t" | "b"> = {
  "Санкт-Петербург": "l", "Ленинградская область": "r", "Москва": "l", "Московская область": "b", "Ярославль": "r",
  "Нижний Новгород": "r", "Краснодар": "l", "Сочи": "r", "Донецк": "l", "Воронеж": "r", "Волгоград": "r",
  "Архангельск": "b", "Северодвинск": "t", "Самара": "r", "Челябинск": "t", "Новосибирск": "b", "Кемерово": "t", "Красноярск": "t", "Иркутск": "r", "Сургут": "t",
};
const WEST = (c: MapCity) => c.x < 200;

function hostsWord(n: number) { return n === 1 ? "ведущий" : n < 5 ? "ведущих" : "ведущих"; }

function Points({ list, scale, active, onPick }: { list: MapCity[]; scale: number; active: string | null; onPick: (c: MapCity) => void }) {
  return <>{list.map((c, i) => {
    const r = (2.2 + c.hosts * 0.55) * scale;
    const pos = LABEL[c.name] ?? "r";
    const off = r + 3 * scale;
    const tx = pos === "l" ? c.x - off : pos === "r" ? c.x + off : c.x;
    const ty = pos === "t" ? c.y - off : pos === "b" ? c.y + off + 4 * scale : c.y + 2 * scale;
    const anchor = pos === "l" ? "end" : pos === "r" ? "start" : "middle";
    const on = active === c.name;
    return <g key={c.name} role="button" tabIndex={0} aria-label={`${c.name}: ${c.hosts} ${hostsWord(c.hosts)}`} className="russia-city cursor-pointer outline-none" onClick={() => onPick(c)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onPick(c); } }}>
      <circle cx={c.x} cy={c.y} r={r * 2.6} className="russia-city-halo fill-accent/25" style={{ animationDelay: `${(i % 6) * 0.35}s` }} />
      <circle cx={c.x} cy={c.y} r={r} className={on ? "fill-accent" : "fill-primary"} stroke="currentColor" strokeWidth={0.6 * scale} />
      <text x={tx} y={ty} textAnchor={anchor} fontSize={6.5 * scale} className={`russia-city-label ${on ? "fill-accent" : "fill-background"}`} style={{ paintOrder: "stroke" }}>{c.name}</text>
    </g>;
  })}</>;
}

export function RussiaMap() {
  const navigate = useNavigate();
  const [active, setActive] = useState<MapCity | null>(null);
  const pick = (c: MapCity) => {
    setActive(c);
    if (c.slug) navigate({ to: "/cities/$slug", params: { slug: c.slug } });
  };
  const west = MAP_CITIES.filter(WEST);
  const east = MAP_CITIES.filter((c) => !WEST(c));

  return <div className="relative overflow-hidden border border-background/15 bg-background/5 p-3 md:p-6" aria-label="Карта России: города проекта «Раппóрт»">
    <svg viewBox="0 0 1000 375" className="h-auto w-full text-foreground">
      <defs>
        <linearGradient id="ru-fill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.55" />
          <stop offset="55%" stopColor="var(--accent)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.25" />
        </linearGradient>
      </defs>
      <path d={RUSSIA_PATH} fill="url(#ru-fill)" className="stroke-accent/70" strokeWidth="1.2" strokeLinejoin="round" />
      <rect x="52" y="145" width="150" height="215" fill="none" className="stroke-background/40" strokeDasharray="4 4" />
      <text x="56" y="140" fontSize="14" className="fill-background/70">Европейская часть ↓</text>
      <Points list={east} scale={2.3} active={active?.name ?? null} onPick={pick} />
      {west.map((c) => <circle key={c.name} cx={c.x} cy={c.y} r={2.4} className="fill-primary" />)}
    </svg>

    <svg viewBox="20 140 210 222" className="mx-auto mt-4 h-auto w-full max-w-lg overflow-hidden text-foreground">
      <path d={RUSSIA_PATH} fill="url(#ru-fill)" className="stroke-accent/70" strokeWidth="0.5" strokeLinejoin="round" />
      <Points list={west} scale={0.62} active={active?.name ?? null} onPick={pick} />
    </svg>

    <div className="mt-4 min-h-24 border-t border-background/15 pt-4 text-background">
      {active ? <div className="flex flex-wrap items-center justify-between gap-4">
        <div><p className="flex items-center gap-2 font-display text-3xl"><MapPin className="size-5 text-primary" />{active.name}</p><p className="mt-1 text-sm text-background/70">{active.hosts} {hostsWord(active.hosts)} проекта</p></div>
        {active.slug
          ? <Button asChild><Link to="/cities/$slug" params={{ slug: active.slug }}>К ведущим города <ArrowRight /></Link></Button>
          : <div className="text-right"><p className="text-sm text-background/70">Анкеты ведущих города скоро появятся на сайте.</p><Button asChild variant="secondary" className="mt-2"><a href={TELEGRAM_URL} target="_blank" rel="noreferrer"><Send />Познакомиться с ведущим</a></Button></div>}
      </div> : <p className="text-sm text-background/60">Нажмите на город, чтобы перейти к его ведущим.</p>}
    </div>
  </div>;
}

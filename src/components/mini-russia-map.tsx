import { MAP_CITIES, RUSSIA_PATH } from "@/data/russia-map";

/** Decorative animated map: cities light up one by one. */
export function MiniRussiaMap() {
  return (
    <svg viewBox="0 30 1000 345" className="h-auto w-full" role="img" aria-label="Карта России с городами проекта">
      <path d={RUSSIA_PATH} className="fill-primary-foreground/15 stroke-primary-foreground/40" strokeWidth="1.2" strokeLinejoin="round" />
      {MAP_CITIES.map((c, i) => (
        <g key={c.name} className="map-city-pop" style={{ animationDelay: `${0.3 + i * 0.12}s` }}>
          <circle cx={c.x} cy={c.y} r={11} className="map-city-pulse fill-primary-foreground/30" style={{ animationDelay: `${(i % 5) * 0.5}s` }} />
          <circle cx={c.x} cy={c.y} r={4.5} className="fill-primary-foreground" />
        </g>
      ))}
    </svg>
  );
}

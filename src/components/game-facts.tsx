import { CountUp } from "@/components/motion";

// Ключевые факты проекта с «накручивающимися» цифрами — общие для всех страниц игр.
export function GameFacts() {
  return <section className="section border-t border-border">
    <div className="section-inner grid grid-cols-2 gap-4 md:grid-cols-4">
      {[["20", "городов"], ["3", "страны"], ["5000+", "участников"], ["28", "ведущих"]].map(([v, l]) => <div key={l} className="card-lift rounded-3xl border border-border bg-card p-6 text-center">
        <CountUp value={v!} className="font-display text-5xl text-primary sm:text-6xl" />
        <p className="mt-2 text-muted-foreground">{l}</p>
      </div>)}
    </div>
  </section>;
}

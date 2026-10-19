import { useState } from "react";
import { games } from "@/data/site";
import { gameDetails } from "@/data/game-details";

// Второй уровень квеста: выбор игры и её шаги — без ссылок и стрелок, до вопроса-ключа.
export function QuestGameSteps() {
  const list = games.filter((g) => !g.comingSoon && gameDetails[g.slug]);
  const [slug, setSlug] = useState<string | null>(null);
  const game = list.find((g) => g.slug === slug);
  const d = slug ? gameDetails[slug] : undefined;

  return (
    <section className="section">
      <div className="mx-auto max-w-4xl px-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Уровень 2</p>
        <h1 className="mt-3 font-display text-4xl md:text-5xl">С какой игрой хотите познакомиться?</h1>
        <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">Выберите игру — и пройдите её шаги, как на настоящей встрече.</p>
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {list.map((g) => {
            const on = g.slug === slug;
            return (
              <button
                key={g.slug}
                type="button"
                onClick={() => { setSlug(g.slug); localStorage.setItem("rapport-quest-game", g.slug); }}
                aria-pressed={on}
                className={`rounded-[var(--radius)] border p-5 text-left transition-colors ${on ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:bg-secondary"}`}
              >
                <span className="font-display text-2xl">{g.shortTitle}</span>
                <span className={`mt-1 block text-sm ${on ? "text-primary-foreground/85" : "text-muted-foreground"}`}>{g.tagline}</span>
              </button>
            );
          })}
        </div>

        {game && d && (
          <div className="mt-12">
            <h2 className="font-display text-3xl md:text-4xl">{d.what.title}</h2>
            {d.what.text.map((t, i) => <p key={i} className="mt-3 leading-7 text-muted-foreground">{t}</p>)}
            {d.steps?.length ? (
              <div className="mt-8">
                {d.steps.map((s, i) => (
                  <div key={i} className="grid grid-cols-[auto_minmax(0,1fr)] gap-6 border-t border-border py-7 md:gap-10">
                    <span className="font-display text-4xl text-primary">{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <h3 className="font-display text-2xl md:text-3xl">{s.title}</h3>
                      <p className="mt-2 leading-7 text-muted-foreground">{s.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
            {d.takeaways?.length ? (
              <div className="mt-6 rounded-[var(--radius)] bg-secondary p-6">
                <h3 className="font-display text-2xl">Что вы унесёте с собой</h3>
                <ul className="mt-3 list-disc space-y-1 pl-5 text-muted-foreground">
                  {d.takeaways.map((t) => <li key={t}>{t}</li>)}
                </ul>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </section>
  );
}

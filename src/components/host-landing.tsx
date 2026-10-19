import { ConsentFields, wantsMarketing } from "@/components/consent-fields";
import { ymGoal } from "@/lib/metrika";
import { useServerFn } from "@tanstack/react-start";
import { recordLandingVisit } from "@/lib/landing-leads.functions";
import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { submitLandingLead } from "@/lib/landing-leads.functions";
import { games, participantReviewImages } from "@/data/site";
import { HostLandingReviews } from "@/components/host-reviews";
import { gameDetails } from "@/data/game-details";
import { Reveal } from "@/components/business-interactive";
import { ShadowTest } from "@/components/shadow-test";
import { landingTopics } from "@/data/landing-topics";

export type HostLandingConfig = {
  landing: string; hostSlug: string; host: string; city: string; cityIn: string; photo: string; extraReviews?: { src: string; alt: string }[]; telegram: string; telegramUrl: string;
  eyebrow: string; headline: string; sub: string; roles: string; aboutTitle: string; story: string[]; audience: string[]; quote: string;
};
const game = games.find((g) => g.slug === "zhivaya")!;
const details = gameDetails["zhivaya"]!;
const gallery = game.gallery ?? [];
// Landing pages show only reviews that don't name a specific host (Artyom/Marina reviews excluded).
const namedReviewIdx = new Set([1, 3, 4, 7]);
const reviews = participantReviewImages.filter((r, i) => r.game === "Раппóрт — Живая" && !namedReviewIdx.has(i));

function scrollToForm(button: string) {
  sessionStorage.setItem("lp-button", button);
  document.getElementById("zapis")?.scrollIntoView({ behavior: "smooth" });
}

export function HostLanding({ c }: { c: HostLandingConfig }) {
  return <div className="bg-background text-foreground">
    <section className="mx-auto grid max-w-5xl gap-8 px-5 pb-14 pt-10 md:grid-cols-[1.1fr_0.9fr] md:items-center md:pt-20">
      <div>
        <p className="eyebrow">{c.eyebrow}</p>
        <h1 className="mt-4 font-display text-4xl leading-tight md:text-6xl">{c.headline}</h1>
        <p className="mt-5 text-lg text-muted-foreground">{c.sub}</p>
        <Button size="lg" className="mt-7 w-full sm:w-auto" onClick={() => scrollToForm("hero")}>Узнать даты игры {c.cityIn}</Button>
        <p className="mt-3 text-sm text-muted-foreground">18+ · группы до 12 человек · безопасное пространство</p>
      </div>
      <img src={c.photo} fetchPriority="high" decoding="async" width={800} height={1000} alt={`${c.host}, ведущая игры «Раппóрт» ${c.cityIn}`} className="aspect-[4/5] w-full rounded-2xl object-cover" />
    </section>

    <section className="bg-secondary px-5 py-14"><div className="mx-auto max-w-3xl">
      <p className="eyebrow">Кто я и почему веду эту игру</p>
      <h2 className="mt-3 font-display text-3xl md:text-5xl">{c.aboutTitle}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{c.roles}</p>
      <div className="mt-6 space-y-4 text-lg leading-8">{c.story.map((p) => <p key={p}>{p}</p>)}</div>
      <div className="mt-8 text-center"><Button size="lg" className="w-full sm:w-auto" onClick={() => scrollToForm("about")}>Познакомиться на игре</Button></div>
    </div></section>

    <section className="mx-auto max-w-3xl px-5 py-14">
      <p className="eyebrow">Что это за игра</p>
      <h2 className="mt-3 font-display text-3xl md:text-5xl">{details.what.title}</h2>
      <div className="mt-5 space-y-4 text-lg leading-8">{details.what.text.map((t) => <p key={t}>{t}</p>)}</div>
      <p className="mt-4 text-muted-foreground">Каждая участница играет роль-персонажа, а не себя — и наблюдения круга звучат персонажу. Поэтому безопасно пробовать новое.</p>
      <Reveal className="mt-8"><div className="grid gap-4 sm:grid-cols-3">{(details.what.facts ?? []).map((f) => <div key={f.label} className="card-lift rounded-xl bg-secondary p-5"><p className="font-display text-4xl">{f.value}</p><p className="mt-1 text-sm text-muted-foreground">{f.label}</p></div>)}</div></Reveal>
    </section>

    {gallery[0] && <img src={gallery[0].src} alt={gallery[0].alt} loading="lazy" decoding="async" className="mx-auto w-full max-w-4xl px-5" />}

    <section className="bg-secondary px-5 py-14"><div className="mx-auto max-w-3xl">
      <p className="eyebrow">Как проходит игра</p>
      <ol className="mt-6 grid gap-3 sm:grid-cols-2">{(details.steps ?? []).map((st, i) => <li key={st.title} className="card-lift rounded-xl bg-card p-4"><span className="text-primary">{String(i + 1).padStart(2, "0")}</span> <b>{st.title}</b><p className="mt-1 text-sm text-muted-foreground">{st.text}</p></li>)}</ol>
      <p className="mt-6 text-lg leading-8">{game.duration}. Правила: конфиденциальность, право не отвечать, право сказать «стоп». {c.quote}</p>
      <div className="mt-8 text-center"><Button size="lg" className="w-full sm:w-auto" onClick={() => scrollToForm("steps")}>Записаться на ближайшую игру</Button></div>
    </div></section>

    {gallery[1] && <img src={gallery[1].src} alt={gallery[1].alt} loading="lazy" className="mx-auto w-full max-w-4xl px-5 py-10" />}

    <section className="mx-auto max-w-3xl px-5 py-14">
      <p className="eyebrow">Что ты заберёшь с игры</p>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2">{(details.takeaways ?? []).map((t) => <li key={t} className="card-lift rounded-xl border border-border bg-card p-4">{t}</li>)}</ul>
      <div className="mt-8 text-center"><Button size="lg" className="w-full sm:w-auto" onClick={() => scrollToForm("takeaways")}>Хочу на игру</Button></div>
    </section>

    {gallery.slice(2).map((g) => <img key={g.src} src={g.src} alt={g.alt} loading="lazy" className="mx-auto w-full max-w-4xl px-5 pb-10" />)}

    <section className="mx-auto max-w-5xl px-5 py-10">
      <div className="grid gap-4 md:grid-cols-3">{(game.testimonials ?? []).map((t) => <blockquote key={t.text} className="card-lift rounded-xl bg-secondary p-5"><p>«{t.text}»</p><footer className="mt-3 text-sm text-muted-foreground">{t.author}</footer></blockquote>)}</div>
    </section>

    <section className="bg-secondary px-5 py-14"><div className="mx-auto max-w-3xl">
      <p className="eyebrow">Интерактив · 2 минуты</p>
      <h2 className="mt-3 font-display text-3xl md:text-5xl">Узнай свою тень</h2>
      <p className="mt-3 text-lg text-muted-foreground">То, что раздражает в других, часто подсказывает, что мы прячем в себе. Пройди пять ситуаций — на игре {c.cityIn} это можно прожить через роль.</p>
      <ShadowTest />
    </div></section>

    <section className="mx-auto max-w-5xl px-5 pt-4"><HostLandingReviews slug={c.hostSlug} /></section>

    {[...(c.extraReviews ?? []), ...reviews].length > 0 && <section className="mx-auto max-w-5xl px-5 py-14">
      <p className="eyebrow">Отзывы участниц</p>
      <div className="mt-6 grid gap-4 md:grid-cols-3">{[...(c.extraReviews ?? []), ...reviews].map((r) => <img key={r.src} src={r.src} alt={r.alt} loading="lazy" className="w-full rounded-xl border border-border" />)}</div>
    </section>}

    <section className="bg-secondary px-5 py-14"><div className="mx-auto max-w-3xl">
      <p className="eyebrow">Кому подойдёт</p>
      <ul className="mt-5 space-y-3 text-lg">{c.audience.map((a) => <li key={a}>— {a}</li>)}</ul>
      <p className="mt-8 font-display text-3xl">Участие — {game.price}</p>
      <p className="mt-2 text-muted-foreground">Ближайшие даты сообщу лично после заявки.</p>
      <Button size="lg" className="mt-6 w-full sm:w-auto" onClick={() => scrollToForm("price")}>Узнать даты {c.cityIn}</Button>
    </div></section>

    <SeoText c={c} />

    <LeadForm c={c} />

    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 p-3 backdrop-blur md:hidden"><Button className="w-full" onClick={() => scrollToForm("sticky")}>Записаться на игру · {game.price}</Button></div>

    <footer className="px-5 pb-24 pt-10 text-center md:pb-10 text-sm text-muted-foreground">
      <p><a className="underline" href={c.telegramUrl} target="_blank" rel="noreferrer">Telegram: {c.telegram}</a> · <a className="underline" href="https://rapportgame.ru">rapportgame.ru</a></p>
      <p className="mt-3">Игра не заменяет психотерапию. Если ты в остром состоянии — напиши мне, я подскажу, куда обратиться.</p>
    </footer>
  </div>;
}

function LeadForm({ c }: { c: HostLandingConfig }) {
  const submit = useServerFn(submitLandingLead);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [utm, setUtm] = useState<Record<string, string>>({});

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const keys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
    const fromUrl = Object.fromEntries(keys.map((k) => [k, p.get(k) ?? ""]).filter(([, v]) => v));
    if (Object.keys(fromUrl).length) sessionStorage.setItem("lp-utm", JSON.stringify(fromUrl));
    setUtm(Object.keys(fromUrl).length ? fromUrl : JSON.parse(sessionStorage.getItem("lp-utm") ?? "{}"));
    const key = `lp-visit-${c.landing}`;
    // Count only outside traffic: skip visits coming from our own site/preview.
    let internal = false;
    try { const h = document.referrer ? new URL(document.referrer).hostname : ""; internal = !!h && (h === location.hostname || h.endsWith("rapportgame.ru") || h.endsWith("lovable.app") || h.endsWith("lovable.dev") || h === "localhost"); } catch { /* ignore */ }
    if (!internal && !sessionStorage.getItem(key)) { sessionStorage.setItem(key, "1"); void recordLandingVisit({ data: { landing: c.landing, utm_source: p.get("utm_source") ?? "", utm_campaign: p.get("utm_campaign") ?? "", referrer: document.referrer.slice(0, 300) } }).catch(() => {}); }
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault(); const marketing = wantsMarketing(e.currentTarget); setBusy(true); setError("");
    try {
      await submit({ data: { marketing, landing: c.landing, host: c.host, city: c.city, name, contact, button: sessionStorage.getItem("lp-button") ?? "form", referrer: document.referrer.slice(0, 300), website: "", ...utm } });
      ymGoal("landing_lead", { landing: c.landing, host: c.host });
      setDone(true);
    } catch { setError("Проверьте имя и контакт и попробуйте ещё раз."); }
    finally { setBusy(false); }
  }

  return <section id="zapis" className="mx-auto max-w-xl px-5 py-16 text-center">
    <h2 className="font-display text-3xl md:text-5xl">Ты уже знаешь, что что-то пора менять. Начни с игры.</h2>
    {done ? <p className="mt-8 text-lg">Спасибо! Я свяжусь с тобой в течение дня и расскажу все детали.</p> :
    <form onSubmit={onSubmit} className="mt-8 grid gap-3 text-left">
      <Input required minLength={2} placeholder="Имя" value={name} onChange={(e) => setName(e.target.value)} aria-label="Имя" />
      <Input required minLength={3} placeholder="Телефон или Telegram" value={contact} onChange={(e) => setContact(e.target.value)} aria-label="Телефон или Telegram" />
      {error && <p className="text-sm text-destructive">{error}</p>}
<ConsentFields />
      <Button size="lg" type="submit" disabled={busy}>{busy ? "Отправляем…" : "Записаться на игру"}</Button>
      <p className="text-center text-sm text-muted-foreground">Я свяжусь с тобой в течение дня и расскажу все детали.</p>
    </form>}
  </section>;
}

// Search-oriented copy: themes women search for (boundaries, being "convenient", shadow, self-love, choosing yourself).
function SeoText({ c }: { c: HostLandingConfig }) {
  const blocks: [string, string][] = [
    [`Психологическая игра для женщин ${c.cityIn}`, `«Раппóрт — Живая» — трансформационная психологическая игра-тренинг для женщин ${c.cityIn}. Это женский круг, где вы играете роль, а не рассказываете о себе: так легче увидеть свои сценарии, страхи и желания со стороны. Ведущая — ${c.host}.`],
    ["Личные границы: как перестать быть удобной", "Многие женщины годами живут для других: соглашаются, когда хочется отказать, терпят, чтобы не было конфликта. На игре вы безопасно проживаете ситуации, где нужно сказать «нет», отстоять личные границы и выдержать чужое недовольство — и переносите этот навык в жизнь."],
    ["Работа с тенью и непрожитыми чувствами", "Злость, обида, зависть, страх оказаться «плохой» — то, что мы прячем, продолжает управлять поступками. Игровые карты помогают мягко встретиться со своей тенью, назвать чувства и принять их без стыда и самокритики."],
    ["Соответствие ожиданиям и выбор себя", "Быть хорошей дочерью, женой, мамой, сотрудницей — программы «надо» и «должна» часто достаются из семьи. На игре вы замечаете, какие сценарии жизни выбраны не вами, и пробуете выбрать себя: свои желания, темп и ценности."],
    ["Любовь к себе и уверенность", "Любовь к себе — это не эгоизм, а умение заботиться о себе, слышать своё тело и потребности. Игра помогает вернуть внутреннюю опору, повысить самооценку и почувствовать себя живой, а не функцией."],
    ["Отношения с мужчиной, мамой и собой", "Через 12 сфер жизни женщины игра затрагивает отношения с партнёром, родителями и детьми, деньги, тело, работу и предназначение. Вы видите связь между внутренними программами и тем, что происходит в отношениях."],
    [`Как проходит игра ${c.cityIn}`, `Встреча длится около 3–4 часов, в круге до 12 участниц. Без лекций и советов: только игра, честная обратная связь персонажу и поддержка ведущей. Подойдёт тем, кто ищет женский тренинг, психологическую практику или трансформационную игру ${c.cityIn}.`],
  ];
  return <section className="px-5 py-14"><div className="mx-auto max-w-3xl">
    <h2 className="font-display text-2xl md:text-3xl">{blocks[0]![0]}</h2><p className="mt-3 leading-7 text-muted-foreground">{blocks[0]![1]}</p>
    <p className="eyebrow mt-10">Темы игры: до и после</p>
    <div className="mt-4 grid gap-3 sm:grid-cols-2">{landingTopics.map((t) => <a key={t.slug} href={`/lp/${c.landing}/${t.slug}`} className="rounded-xl border border-border bg-card p-5 hover:border-primary"><p className="font-display text-xl">{t.title}</p><p className="mt-2 text-sm text-muted-foreground">{t.lead}</p><p className="mt-3 text-sm text-primary">Читать →</p></a>)}</div>
  </div></section>;
}

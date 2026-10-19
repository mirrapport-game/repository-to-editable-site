import { Link } from "@tanstack/react-router";
import { Send, BookOpen, MessageCircle } from "lucide-react";
import { TELEGRAM_CHANNEL_URL } from "@/data/site";

// Reusable "До игры / После игры" contrast block shown across pages.
const DEFAULT_PAIRS: [string, string][] = [
  ["Одни и те же ссоры по кругу", "Видите свой сценарий со стороны и знаете, где его остановить"],
  ["Трудно сказать о своих чувствах", "Есть слова и смелость, проверенные в безопасной игре"],
  ["Кажется, что проблема в другом человеке", "Понимаете свою роль и что можно поменять уже сегодня"],
  ["Решения откладываются", "Уходите с конкретным первым шагом"],
];

export function BeforeAfter({ title = "Что меняется после игры", pairs = DEFAULT_PAIRS }: { title?: string; pairs?: [string, string][] }) {
  return <section className="section"><div className="section-inner">
    <p className="eyebrow">До и после</p><h2 className="section-title max-w-4xl">{title}</h2>
    <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-2">
      <div className="bg-muted p-6 md:p-8"><p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">До игры</p>
        <ul className="mt-5 space-y-4">{pairs.map(([b]) => <li key={b} className="flex gap-3 text-lg text-muted-foreground"><span aria-hidden>✕</span>{b}</li>)}</ul></div>
      <div className="bg-primary p-6 text-primary-foreground md:p-8"><p className="text-sm font-semibold uppercase tracking-widest opacity-80">После игры</p>
        <ul className="mt-5 space-y-4">{pairs.map(([b, a]) => <li key={b} className="flex gap-3 text-lg"><span aria-hidden>✓</span>{a}</li>)}</ul></div>
    </div>
  </div></section>;
}

// Max channel link — fill in when the owner provides it; the card is hidden until then.
export const MAX_CHANNEL_URL = "";

type Kind = "tg" | "max" | "blog";
export function SubscribeBanner({ kind }: { kind: Kind }) {
  if (kind === "max" && !MAX_CHANNEL_URL) kind = "tg";
  const cfg = {
    tg: { Icon: Send, title: "Подпишитесь на наш Telegram-канал", text: "Анонсы игр, разборы и вопросы для пар — каждую неделю.", cta: "Подписаться", href: TELEGRAM_CHANNEL_URL },
    max: { Icon: MessageCircle, title: "Мы есть в Max", text: "Подписывайтесь, чтобы не пропустить новые игры.", cta: "Подписаться в Max", href: MAX_CHANNEL_URL },
    blog: { Icon: BookOpen, title: "Читайте наш блог", text: "Статьи об отношениях, ролях и честных разговорах.", cta: "Перейти в блог", href: "" },
  }[kind];
  const btn = "inline-flex items-center gap-2 rounded-full bg-background px-6 py-3 font-medium text-foreground transition-opacity hover:opacity-85";
  return <section className="section-inner py-8"><div className="flex flex-col gap-5 rounded-2xl bg-foreground p-7 text-background md:flex-row md:items-center md:justify-between md:p-10">
    <div className="flex items-start gap-4"><cfg.Icon className="mt-1 size-8 shrink-0 text-accent" /><div><p className="font-display text-3xl">{cfg.title}</p><p className="mt-2 opacity-80">{cfg.text}</p></div></div>
    {kind === "blog" ? <Link to="/blog" className={btn}>{cfg.cta}</Link> : <a href={cfg.href} target="_blank" rel="noreferrer" className={btn}>{cfg.cta}</a>}
  </div></section>;
}

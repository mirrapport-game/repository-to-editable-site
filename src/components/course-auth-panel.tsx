import { TelegramLogin } from "@/components/telegram-login";

// Every cabinet signs in through Telegram only (one club account per Telegram user).
export function CourseAuthPanel({ title, note }: { title: string; note: string; returnPath?: string; showGoogle?: boolean }) {
  return <div className="mx-auto max-w-md py-12"><div className="border border-border bg-card p-7 text-center">
    <h2 className="font-display text-4xl">{title}</h2>
    <p className="mt-3 text-sm leading-6 text-muted-foreground">{note}</p>
    <div className="mt-7"><TelegramLogin /></div>
  </div></div>;
}

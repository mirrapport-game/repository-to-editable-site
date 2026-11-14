import { PhoneLogin } from "@/components/phone-login";
import { TelegramLogin } from "@/components/telegram-login";

// Cabinets sign in through Telegram (one club account per Telegram user); the host cabinet also offers phone + password.
export function CourseAuthPanel({ title, note, phone = false }: { title: string; note: string; returnPath?: string; showGoogle?: boolean; phone?: boolean }) {
  return <div className="mx-auto max-w-md py-12"><div className="border border-border bg-card p-7 text-center">
    <h2 className="font-display text-4xl">{title}</h2>
    <p className="mt-3 text-sm leading-6 text-muted-foreground">{note}</p>
    {phone && <div className="mt-7"><PhoneLogin /></div>}
    {phone && <p className="mt-7 text-xs uppercase tracking-widest text-muted-foreground">или через Telegram</p>}
    <div className={phone ? "mt-4" : "mt-7"}><TelegramLogin /></div>
  </div></div>;
}

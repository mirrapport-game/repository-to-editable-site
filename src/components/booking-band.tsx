import { Link, useRouterState } from "@tanstack/react-router";
import { CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { openBookingWidget } from "@/components/booking-format";

// Компактный призыв записаться — между блоками главной и перед подвалом каждой страницы.
export function BookingBand({ title = "Готовы сыграть?", text = "Онлайн от 1 500 ₽, офлайн от 2 500 ₽. Первая игра — уже на этой неделе.", demo = false }: { title?: string; text?: string; demo?: boolean }) {
  return <section className="border-y border-border bg-primary text-primary-foreground">
    <div className="mx-auto flex max-w-7xl flex-col items-start gap-4 px-5 py-8 sm:flex-row sm:items-center sm:justify-between lg:px-8">
      <div><p className="font-display text-2xl sm:text-3xl">{title}</p><p className="mt-1 text-primary-foreground/85">{text}</p></div>
      {demo ? <Button asChild size="lg" variant="secondary" className="px-8"><Link to="/demo"><CalendarDays /> Записаться на демо</Link></Button> : <Button size="lg" variant="secondary" className="px-8" onClick={openBookingWidget}><CalendarDays /> Записаться на игру</Button>}
    </div>
  </section>;
}

export function SiteBookingBand() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (pathname === "/" || pathname.startsWith("/manage") || pathname.startsWith("/payment") || pathname === "/auth" || pathname === "/play" || pathname === "/course") return null;
  return <BookingBand demo title="Попробуйте на демо-игре" text="Первое посещение демо-дня — бесплатно. Бизнес, Я, Отношения и живой нетворкинг." />;
}

import { ConsentFields, wantsMarketing } from "@/components/consent-fields";
import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { useGameBooking } from "@/hooks/use-game-booking";
import { BookingRepeat } from "@/components/booking-repeat";
import { CalendarDays, ChevronDown, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BOOKING_WIDGET_EVENT, BookingFormatField, type BookingFormat } from "@/components/booking-format";
import { games } from "@/data/site";
import { BookingCityField } from "@/components/booking-city-field";

const available = games.filter((g) => !g.comingSoon);

// Общая форма записи на игру — внизу каждой публичной страницы.
export function BookingSection() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [game, setGame] = useState(available[0]?.title ?? "");
  const [format, setFormat] = useState<BookingFormat>("Онлайн");
  const [city, setCity] = useState("");
  const [open, setOpen] = useState(false);
  const { busy, done, error, registered, send } = useGameBooking(phone);

  useEffect(() => {
    const show = () => setOpen(true);
    window.addEventListener(BOOKING_WIDGET_EVENT, show);
    return () => window.removeEventListener(BOOKING_WIDGET_EVENT, show);
  }, []);

  const hidden = pathname.startsWith("/manage") || pathname.startsWith("/payment") || pathname === "/auth" || pathname === "/play";
  if (hidden) return null;

  return <aside id="booking" className={`pointer-events-none fixed bottom-0 right-0 z-[60] pb-3 pr-3 sm:right-5 sm:pb-5 sm:pr-0 ${open ? "left-0 pl-3 sm:left-auto sm:w-[25rem] sm:pl-0" : ""}`} aria-label="Запись на игру">
    <div className={`pointer-events-auto border border-border bg-background shadow-2xl ${open ? "" : "rounded-full sm:rounded-none"}`}>
      <Button type="button" variant="ghost" className={`flex w-full justify-between px-4 ${open ? "h-14 rounded-none" : "h-12 rounded-full sm:h-14 sm:w-[25rem] sm:rounded-none"}`} onClick={() => setOpen((current) => !current)} aria-expanded={open}>
        <span className="flex items-center gap-2 font-semibold"><CalendarDays className="size-5 text-primary" />{open ? "Записаться на игру" : <><span className="sm:hidden">Записаться</span><span className="hidden sm:inline">Записаться на игру</span></>}</span>
        {open ? <X className="size-4" /> : <ChevronDown className="hidden size-4 rotate-180 sm:block" />}
      </Button>
      {open && (done ? <div className="border-t border-border p-5"><p className="font-display text-2xl">Спасибо!</p><p className="mt-1 text-sm text-muted-foreground">Мы свяжемся с вами в ближайшее время.</p></div> :
      <form className="grid grid-cols-1 max-h-[min(36rem,calc(100dvh-6rem))] gap-3 overflow-y-auto overscroll-contain border-t border-border p-4" onSubmit={async (e) => {
        e.preventDefault(); const marketing = wantsMarketing(e.currentTarget);
        await send({ marketing, name, phone, game, format, city, website: "", formName: "Виджет «Записаться»", page: window.location.pathname });
      }}>
        <p className="text-sm text-muted-foreground">Выберите игру и удобный формат — мы подберём дату и ведущего.</p>
        <div className="space-y-2"><Label htmlFor="widget-game">Игра</Label><Select value={game} onValueChange={setGame}><SelectTrigger id="widget-game" className="h-10"><SelectValue /></SelectTrigger><SelectContent className="z-[70]">{available.map((g) => <SelectItem key={g.slug} value={g.title}>{g.title}</SelectItem>)}<SelectItem value="Пока не выбрал(а) — нужна консультация">Помогите выбрать</SelectItem></SelectContent></Select></div>
        <BookingFormatField id="widget-format" value={format} onChange={setFormat} />
        <BookingCityField id="widget-city" value={city} onChange={setCity} />
        <Input required placeholder="Ваше имя" value={name} onChange={(e) => setName(e.target.value)} aria-label="Имя" />
        <Input required type="tel" autoComplete="tel" maxLength={60} placeholder="Телефон" value={phone} onChange={(e) => setPhone(e.target.value)} aria-label="Телефон" />
        <BookingRepeat visible={registered} />
        {error && <p className="text-sm text-destructive">{error}</p>}
<ConsentFields />
        <Button type="submit" size="lg" disabled={busy}><Send />{busy ? "Отправляем…" : registered ? "Записаться в один клик" : "Записаться на игру"}</Button>
      </form>)}
    </div>
  </aside>;
}

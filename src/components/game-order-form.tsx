import { ConsentFields, wantsMarketing } from "@/components/consent-fields";
import { useState } from "react";
import { useGameBooking } from "@/hooks/use-game-booking";
import { BookingRepeat } from "@/components/booking-repeat";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookingFormatField, type BookingFormat } from "@/components/booking-format";
import { BookingCityField } from "@/components/booking-city-field";

export function GameOrderForm({ gameTitle }: { gameTitle: string }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [mentorship, setMentorship] = useState(false);
  const [format, setFormat] = useState<BookingFormat>("Онлайн");
  const [city, setCity] = useState("");
  const { busy, done, error, registered, send } = useGameBooking(phone);

  if (done) return <p className="mt-8 text-lg">Спасибо! Мы свяжемся с вами в ближайшее время.</p>;
  if (!open) return <Button size="lg" className="mt-8" onClick={() => setOpen(true)}><Send />Записаться на игру</Button>;

  return <form className="mx-auto mt-8 grid max-w-md gap-3 text-left" onSubmit={async (e) => {
    e.preventDefault();
    await send({ name, phone, game: gameTitle, format, city, website: "", marketing: wantsMarketing(e.currentTarget), mentorship, formName: "Заявка со страницы игры", page: window.location.pathname });
  }}>
    <Input required placeholder="Ваше имя" value={name} onChange={(e) => setName(e.target.value)} aria-label="Имя" />
    <Input required type="tel" autoComplete="tel" maxLength={60} placeholder="Телефон" value={phone} onChange={(e) => setPhone(e.target.value)} aria-label="Телефон" />
    <BookingRepeat visible={registered} />
    <BookingFormatField id="game-order-format" value={format} onChange={setFormat} />
    <BookingCityField id="game-order-city" value={city} onChange={setCity} />
    <label className="flex items-center gap-2 text-sm text-muted-foreground"><input type="checkbox" checked={mentorship} onChange={(e) => setMentorship(e.target.checked)} className="accent-primary" />Интересует индивидуальное сопровождение</label>
    {error && <p className="text-sm text-destructive">{error}</p>}
<ConsentFields />
    <Button type="submit" size="lg" disabled={busy}>{busy ? "Отправляем…" : registered ? "Записаться в один клик" : "Отправить заявку"}</Button>
  </form>;
}

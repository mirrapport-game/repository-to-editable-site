import { ConsentFields, wantsMarketing } from "@/components/consent-fields";
import { useState } from "react";
import { useGameBooking } from "@/hooks/use-game-booking";
import { BookingRepeat } from "@/components/booking-repeat";
import { Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookingFormatField, type BookingFormat } from "@/components/booking-format";
import { BookingCityField } from "@/components/booking-city-field";
import { games } from "@/data/site";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const available = games.filter((g) => !g.comingSoon);

const FAQ = [
  { q: "Это безопасно? Мне придётся рассказывать о себе?", a: "Нет. Вы играете за персонажа, а не за себя, и обратную связь получает роль. Делиться личным можно ровно настолько, насколько вам комфортно." },
  { q: "Чем игра отличается от тренинга или терапии?", a: "Здесь никто не учит «как правильно». Карточка задаёт жизненную ситуацию, вы проживаете её в роли и сами замечаете свои реакции — а затем пробуете новый выбор." },
  { q: "Нужна ли подготовка или опыт?", a: "Нет. Ведущий объясняет правила по ходу, первая партия подходит новичкам." },
  { q: "Какие есть форматы?", a: "Онлайн, офлайн, индивидуально и для группы. Можно играть парой, с друзьями или командой." },
  { q: "Сколько стоит участие?", a: "Онлайн — от 1 500 ₽, офлайн — от 2 500 ₽. Индивидуальная игра — от 5 000 ₽, корпоративная игра для компаний — от 50 000 ₽." },
  { q: "Можно ли провести игру для компании?", a: "Да. «Раппóрт Бизнес» подходит для тимбилдинга, развития soft skills и разбора конфликтов. Корпоративная игра — от 50 000 ₽. Также мы разрабатываем бизнес-игры под задачи компании — от 300 000 ₽." },
  { q: "С чего начать?", a: "Оставьте заявку внизу страницы — мы поможем выбрать игру и формат и запишем к ведущему в вашем городе или онлайн." },
];

export function HomeFaq() {
  return (
    <section className="section">
      <div className="section-inner grid gap-12 lg:grid-cols-[1fr_1.4fr]">
        <div><p className="eyebrow">Вопросы</p><h2 className="section-title">Частые <em>вопросы</em></h2></div>
        <Accordion type="single" collapsible className="w-full">
          {FAQ.map((f, i) => (
            <AccordionItem key={f.q} value={`q${i}`}>
              <AccordionTrigger className="py-6 text-left font-display text-xl hover:no-underline">{f.q}</AccordionTrigger>
              <AccordionContent className="pb-6 text-base leading-7 text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

export function QuestFinalCta() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [game, setGame] = useState(available[0]?.title ?? "");
  const [format, setFormat] = useState<BookingFormat>("Онлайн");
  const [city, setCity] = useState("");
  const { busy, done, error, registered, send } = useGameBooking(phone);
  return (
    <section className="section bg-primary text-primary-foreground">
      <div className="section-inner grid gap-10 lg:grid-cols-[1fr_28rem] lg:items-center">
        <div>
          <h2 className="section-title">Готовы попробовать?</h2>
          <p className="mt-6 max-w-xl text-lg opacity-85">Оставьте заявку — подберём игру, формат, дату и ведущего в вашем городе или онлайн.</p>
        </div>
        <div className="rounded-3xl bg-background p-6 text-foreground shadow-2xl">
          {done ? <div><p className="font-display text-3xl">Спасибо!</p><p className="mt-2 text-muted-foreground">Мы свяжемся с вами в ближайшее время.</p></div> :
          <form className="grid gap-3" onSubmit={async (e) => {
            e.preventDefault(); const marketing = wantsMarketing(e.currentTarget);
            await send({ marketing, name, phone, game, format, city, website: "", formName: "Главная — «Готовы попробовать?»", page: window.location.pathname });
          }}>
            <div className="space-y-2"><Label htmlFor="final-game">Игра</Label><Select value={game} onValueChange={setGame}><SelectTrigger id="final-game" className="h-11"><SelectValue /></SelectTrigger><SelectContent>{available.map((g) => <SelectItem key={g.slug} value={g.title}>{g.title}</SelectItem>)}<SelectItem value="Пока не выбрал(а) — нужна консультация">Помогите выбрать</SelectItem></SelectContent></Select></div>
            <BookingFormatField id="final-format" value={format} onChange={setFormat} />
            <BookingCityField id="final-city" value={city} onChange={setCity} />
            <Input required className="h-11" placeholder="Ваше имя" value={name} onChange={(e) => setName(e.target.value)} aria-label="Имя" />
            <Input required className="h-11" type="tel" autoComplete="tel" maxLength={60} placeholder="Телефон" value={phone} onChange={(e) => setPhone(e.target.value)} aria-label="Телефон" />
            <BookingRepeat visible={registered} />
            {error && <p className="text-sm text-destructive">{error}</p>}
<ConsentFields />
            <Button type="submit" size="lg" disabled={busy}><Send />{busy ? "Отправляем…" : registered ? "Записаться в один клик" : "Записаться на игру"}</Button>
          </form>}
        </div>
      </div>
    </section>
  );
}

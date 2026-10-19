import { Link, useNavigate } from "@tanstack/react-router";
import { MapPin, Send, Sparkles, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cities, eventFormats } from "@/data/cities";
import { TELEGRAM_URL } from "@/data/site";

export function CityPicker({ className }: { className?: string }) {
  const navigate = useNavigate();
  return <Select onValueChange={(slug) => navigate({ to: "/cities/$slug", params: { slug } })}>
    <SelectTrigger className={className ?? "h-9 w-36"} aria-label="Выбрать город"><MapPin className="size-4 text-primary" /><SelectValue placeholder="Ваш город" /></SelectTrigger>
    <SelectContent>{cities.map((c) => <SelectItem key={c.slug} value={c.slug}>{c.name}</SelectItem>)}</SelectContent>
  </Select>;
}

export function OrderHost() {
  return <section className="order-host"><div className="section-inner order-host-inner">
    <div><p className="eyebrow">Заказать ведущего</p><h2>Игра «Раппóрт» для вашего события</h2><p className="order-host-lead">Ведущий приедет к вам или проведёт игру онлайн — для любой компании и повода.</p>
      <Button asChild size="lg" className="mt-8"><a href={TELEGRAM_URL} target="_blank" rel="noreferrer"><Send />Заказать ведущего</a></Button></div>
    <ul className="order-host-list">{eventFormats.map((f) => <li key={f}><Sparkles />{f}</li>)}<li><Sparkles />и другие поводы</li></ul>
  </div></section>;
}

export function OpenCityCta() {
  return <section className="open-city"><div className="section-inner open-city-inner">
    <div className="open-city-card"><MapPin /><h3>Открой свой город</h3><p>Нет ведущего рядом? Станьте первым ведущим «Раппóрт» в своём городе.</p><Button asChild variant="outline"><Link to="/facilitators">Стать ведущим</Link></Button></div>
    <div className="open-city-card"><Globe /><h3>Начни проводить онлайн</h3><p>Ведите игры по видеосвязи для участников из любой точки мира.</p><Button asChild variant="outline"><Link to="/facilitators">Узнать как</Link></Button></div>
  </div></section>;
}

import { CountUp } from "@/components/motion";
import { MiniRussiaMap } from "@/components/mini-russia-map";
import { MapPin, Users, Sparkles, MessageCircleHeart, MonitorSmartphone, LayoutGrid } from "lucide-react";

export function BentoFacts() {
  const tile = "card-lift rounded-3xl border border-border bg-card p-7 flex flex-col justify-between gap-6";
  return (
    <section className="section">
      <div className="section-inner">
        <p className="eyebrow">Почему «Раппóрт»</p>
        <h2 className="section-title max-w-4xl">Больше, чем игра — <em>опыт</em></h2>
        <div className="mt-14 grid auto-rows-[minmax(11rem,auto)] gap-4 md:grid-cols-4">
          <div className="card-lift rounded-3xl bg-primary p-8 text-primary-foreground md:col-span-2 md:row-span-2 flex flex-col justify-between">
            <div className="flex items-center gap-2"><MapPin className="h-6 w-6" aria-hidden /><span className="text-sm uppercase tracking-widest">20 городов · 3 страны</span></div><MiniRussiaMap />
            <div><p className="font-display text-7xl leading-none md:text-9xl"><CountUp value="20" /></p><p className="mt-3 text-xl">городов в 3 странах и 28 ведущих</p></div>
          </div>
          <div className={`${tile} md:col-span-2`}>
            <Users className="h-7 w-7 text-primary" aria-hidden />
            <div><p className="font-display text-6xl leading-none text-primary"><CountUp value="5000+" /></p><p className="mt-2 text-muted-foreground">участников уже сыграли</p></div>
          </div>
          <div className={tile}>
            <Sparkles className="h-7 w-7 text-primary" aria-hidden />
            <p className="font-display text-2xl">Авторская методика Артёма Ефимова</p>
          </div>
          <div className={tile}>
            <MessageCircleHeart className="h-7 w-7 text-primary" aria-hidden />
            <p className="font-display text-2xl">Обратная связь без осуждения — её получает персонаж</p>
          </div>
          <div className={`${tile} md:col-span-2`}>
            <MonitorSmartphone className="h-7 w-7 text-primary" aria-hidden />
            <p className="font-display text-3xl">Онлайн и офлайн — из любого города</p>
          </div>
          <div className={`${tile} md:col-span-2`}>
            <LayoutGrid className="h-7 w-7 text-primary" aria-hidden />
            <div><p className="font-display text-6xl leading-none text-primary"><CountUp value="4" /></p><p className="mt-2 text-muted-foreground">формата: онлайн, офлайн, индивидуально, для группы</p></div>
          </div>
        </div>
      </div>
    </section>
  );
}

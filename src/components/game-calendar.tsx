import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CalendarDays, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TELEGRAM_URL } from "@/data/site";

type GameEvent = { id: string; starts_at: string; game: string; place: string };

export function GameCalendar({ gameTitle, keyword }: { gameTitle: string; keyword: string }) {
  const [events, setEvents] = useState<GameEvent[]>([]);

  const loadEvents = useCallback(async () => {
    const { data } = await supabase
      .from("facilitator_events")
      .select("id,starts_at,game,place")
      .ilike("game", `%${keyword}%`)
      .gte("starts_at", new Date().toISOString())
      .order("starts_at")
      .limit(20);
    setEvents(data ?? []);
  }, [keyword]);

  useEffect(() => { void loadEvents(); }, [loadEvents]);

  return (
    <section className="section border-t border-border">
      <div className="section-inner">
        <p className="eyebrow">Календарь игр</p>
        <h2 className="section-title">Когда играть в «{gameTitle}»</h2>
        <p className="mt-4 text-muted-foreground">Ближайшие игры наших ведущих. Выберите удобные дату и время и запишитесь.</p>
        {events.length ? (
          <>
            <div className="host-calendar mt-10">
              {Array.from({ length: 7 }, (_, i) => {
                const day = new Date(Date.now() + i * 86400000);
                const dayEvents = events.filter(
                  (e) => new Date(e.starts_at).toLocaleDateString("ru-RU") === day.toLocaleDateString("ru-RU"),
                );
                return (
                  <div key={i} className={`host-cal-day${dayEvents.length ? " has-events" : ""}`}>
                    <b>{day.toLocaleDateString("ru-RU", { weekday: "short" })}</b>
                    <span>{day.toLocaleDateString("ru-RU", { day: "numeric", month: "short" })}</span>
                    {dayEvents.map((e) => (
                      <div key={e.id} className="host-cal-event">
                        <b>{new Date(e.starts_at).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}</b>
                        <p>{e.game}</p>
                        {e.place ? <span>{e.place}</span> : null}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
            <div className="host-schedule">
              {events.map((e) => (
                <div key={e.id} className="host-event">
                  <CalendarDays />
                  <div>
                    <b>{new Date(e.starts_at).toLocaleString("ru-RU", { weekday: "short", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })}</b>
                    <p>{e.game}</p>
                    <span>{e.place}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <Button asChild size="lg"><a href={TELEGRAM_URL} target="_blank" rel="noreferrer"><Send />Записаться на игру</a></Button>
            </div>
          </>
        ) : (
          <div className="host-schedule-empty mt-10">
            <CalendarDays />
            <p>Расписание на эту неделю скоро появится. Напишите нам — подберём удобную дату и время.</p>
            <Button asChild variant="outline"><a href={TELEGRAM_URL} target="_blank" rel="noreferrer"><Send />Уточнить расписание</a></Button>
          </div>
        )}
      </div>
    </section>
  );
}

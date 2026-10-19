import { useState } from "react";
import { Button } from "@/components/ui/button";
import { openBookingWidget } from "@/components/booking-format";

// Черновик агента: ситуации и выводы требуют проверки автором игры.
type Trait = { id: string; label: string };
const T: Record<string, Trait> = {
  loud: { id: "loud", label: "громкая, требует внимания" },
  selfish: { id: "selfish", label: "думает только о себе" },
  weak: { id: "weak", label: "слабая, жалуется" },
  control: { id: "control", label: "всё контролирует" },
  free: { id: "free", label: "слишком свободная, без правил" },
  cold: { id: "cold", label: "холодная, закрытая" },
};
const SHADOW: Record<string, string> = {
  loud: "Возможно, в тени — твоё право быть заметной. Тебя учили не высовываться, а хочется сиять.",
  selfish: "Возможно, в тени — забота о себе. Ты привыкла ставить других на первое место, и чужое «я сначала» задевает.",
  weak: "Возможно, в тени — твоя уязвимость. Ты держишься сильной, а позволить себе слабость страшно.",
  control: "Возможно, в тени — твоя потребность в опоре и порядке, которую ты не признаёшь.",
  free: "Возможно, в тени — твоя спонтанность и желание жить без «надо».",
  cold: "Возможно, в тени — твоё право на границы и на «нет».",
};
const Q = [
  { s: "На вечеринке подруга весь вечер рассказывает о себе, смеётся громче всех.", o: ["loud", "selfish", "free"] },
  { s: "Коллега в третий раз за неделю жалуется на жизнь и ничего не меняет.", o: ["weak", "cold", "control"] },
  { s: "Партнёр сам решил, куда вы едете в отпуск, и даже не спросил.", o: ["control", "selfish", "cold"] },
  { s: "Знакомая ушла с работы «в никуда» и путешествует.", o: ["free", "selfish", "weak"] },
  { s: "Мама не звонит неделями и отвечает коротко.", o: ["cold", "selfish", "control"] },
];

export function ShadowTest() {
  const [ans, setAns] = useState<string[]>([]);
  const step = ans.length;
  const done = step >= Q.length;
  const counts = ans.reduce<Record<string, number>>((a, x) => ({ ...a, [x]: (a[x] ?? 0) + 1 }), {});
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 2).map(([k]) => k);
  return (
    <div className="mt-10 rounded-3xl border border-border bg-card p-6 sm:p-10">
      {!done ? (
        <>
          <p className="text-sm text-muted-foreground">Ситуация {step + 1} из {Q.length}</p>
          <div className="mt-2 h-1.5 rounded-full bg-secondary"><div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${(step / Q.length) * 100}%` }} /></div>
          <p className="mt-6 font-display text-2xl leading-snug sm:text-3xl">{Q[step]!.s}</p>
          <p className="mt-4 text-muted-foreground">Что в ней раздражает или напрягает сильнее всего?</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {Q[step]!.o.map((id) => (
              <button key={id} type="button" onClick={() => setAns([...ans, id])} className="rounded-2xl border border-border p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:shadow-md">Она {T[id]!.label}</button>
            ))}
          </div>
        </>
      ) : (
        <>
          <p className="eyebrow">Твой вывод</p>
          <h3 className="font-display text-3xl">Чаще всего тебя задевает: {top.map((k) => T[k]!.label).join(" и ")}</h3>
          <div className="mt-5 space-y-3 text-lg">{top.map((k) => <p key={k}>{SHADOW[k]}</p>)}</div>
          <p className="mt-5 text-muted-foreground">То, что сильно раздражает в другом, часто — отвергнутая часть нас самих. Это не диагноз, а повод присмотреться. На игре «Живая» тень можно прожить через роль — безопасно и в круге поддержки.</p>
          <div className="mt-6 flex flex-wrap gap-3"><Button onClick={openBookingWidget}>Записаться на игру</Button><Button variant="outline" onClick={() => setAns([])}>Пройти заново</Button></div>
        </>
      )}
    </div>
  );
}

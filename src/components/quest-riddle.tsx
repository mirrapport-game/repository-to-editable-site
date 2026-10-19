import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";
import { QUEST_SPHERES } from "@/data/quest-questions";

// Вопрос-ключ уровня: правильный ответ открывает переход на следующую страницу.
export function QuestRiddle({ level, onSolved }: { level: number; onSolved: () => void }) {
  const [sphereId, setSphereId] = useState(QUEST_SPHERES[0]!.id);
  const [picked, setPicked] = useState<number | null>(null);
  useEffect(() => { const s = localStorage.getItem("quest-sphere"); if (s && QUEST_SPHERES.some((x) => x.id === s)) setSphereId(s); }, []);
  useEffect(() => { setPicked(null); }, [level, sphereId]);

  const sphere = QUEST_SPHERES.find((s) => s.id === sphereId)!;
  const q = sphere.questions[level % sphere.questions.length]!;
  const solved = picked === q.correct;
  useEffect(() => { if (solved) onSolved(); }, [solved, onSolved]);

  const choose = (id: string) => { setSphereId(id); localStorage.setItem("quest-sphere", id); };

  return <div className="rounded-3xl border border-border bg-card p-5 shadow-2xl shadow-primary/10 sm:p-8 md:p-10">
    <p className="eyebrow">Ключ к следующему уровню</p>
    <div className="mt-3 flex flex-wrap gap-1.5 sm:gap-2">{QUEST_SPHERES.map((s) => <button key={s.id} type="button" onClick={() => choose(s.id)} className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors sm:px-4 sm:py-2 sm:text-sm ${s.id === sphereId ? "border-primary bg-primary text-primary-foreground" : "border-border bg-secondary text-secondary-foreground hover:border-primary"}`}>{s.label}</button>)}</div>
    <p className="mt-4 font-display text-xl leading-snug sm:mt-6 sm:text-2xl md:text-3xl">{q.situation}</p>
    <p className="mt-2 text-sm text-muted-foreground">Как поступить, чтобы сохранить раппорт?</p>
    <div className="mt-4 grid gap-2 md:grid-cols-3">{q.options.map((o, i) => {
      const state = picked === i ? (i === q.correct ? "ok" : "bad") : null;
      return <button key={o} type="button" disabled={solved} onClick={() => setPicked(i)} className={`flex items-start gap-2 rounded-xl border p-3 text-left text-sm font-medium sm:p-4 transition-colors ${state === "ok" ? "border-primary bg-primary/10" : state === "bad" ? "border-destructive bg-destructive/10" : "border-border hover:border-primary hover:bg-primary hover:text-primary-foreground"}`}>
        {state === "ok" && <Check className="mt-0.5 size-4 shrink-0 text-primary" />}{state === "bad" && <X className="mt-0.5 size-4 shrink-0 text-destructive" />}<span>{o}</span>
      </button>;
    })}</div>
    {picked !== null && !solved && <p className="mt-4 text-sm text-destructive">Не совсем. Попробуйте другой вариант.</p>}
    {solved && <p className="mt-4 text-sm text-primary">Верно! {q.why} Дверь открыта ↓</p>}
  </div>;
}

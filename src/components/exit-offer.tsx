import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Gift, Loader2, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateRelationshipQuestions } from "@/lib/relationship-questions.functions";

const KEY = "rapport-exit-gift-shown";
const SKIP = ["/demo", "/play", "/payment", "/quest", "/manage"];
const TOPICS = ["Близость", "Доверие", "Конфликты", "Самоценность", "Будущее"] as const;
type Topic = (typeof TOPICS)[number];

// Exit-intent gift: fires when the cursor moves quickly up out of the window
// (toward the close button / tab bar). Once per browser.
export function ExitOffer() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"pair" | "self">("pair");
  const [topic, setTopic] = useState<Topic>("Близость");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ intro: string; questions: string[] } | null>(null);
  const [error, setError] = useState("");
  const generate = useServerFn(generateRelationshipQuestions);

  useEffect(() => {
    if (SKIP.some((p) => pathname.startsWith(p)) || localStorage.getItem(KEY)) return;
    let lastY = 0, lastT = 0;
    const onMove = (e: MouseEvent) => { lastY = e.clientY; lastT = performance.now(); };
    const onLeave = (e: MouseEvent) => {
      if (e.relatedTarget || e.clientY > 0) return;
      const fast = performance.now() - lastT < 250 && lastY < 120;
      if (!fast && e.clientY > -5) return;
      localStorage.setItem(KEY, "1");
      setOpen(true);
    };
    const t = window.setTimeout(() => {
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseout", onLeave);
    }, 4000);
    return () => { window.clearTimeout(t); document.removeEventListener("mousemove", onMove); document.removeEventListener("mouseout", onLeave); };
  }, [pathname]);

  const run = async () => {
    setLoading(true); setError("");
    try {
      const r = await generate({ data: { topic, mode, context: "", tone: "Бережно" } });
      if (r.status === "ready") setResult({ intro: r.introduction, questions: r.questions.slice(0, 3) });
      else setError(r.message);
    } catch { setError("Не удалось подготовить вопросы. Попробуйте ещё раз."); }
    setLoading(false);
  };

  if (!open) return null;
  const close = () => setOpen(false);
  return <div className="fixed inset-0 z-[60] grid place-items-center bg-foreground/60 p-4 animate-fade-in" role="dialog" aria-modal="true" aria-labelledby="exit-gift-title" onClick={close}>
    <div className="relative max-h-[90svh] w-full max-w-lg overflow-y-auto rounded-2xl bg-background p-8 shadow-2xl animate-scale-in" onClick={(e) => e.stopPropagation()}>
      <button type="button" aria-label="Закрыть" onClick={close} className="absolute right-4 top-4 text-muted-foreground"><X className="size-5" /></button>
      <Gift className="size-10 text-primary" aria-hidden="true" />
      <p className="eyebrow mt-4">Подарок перед уходом</p>
      <h2 id="exit-gift-title" className="mt-2 font-display text-4xl">3 вопроса от Rapport AI — лично для вас</h2>
      {!result ? <>
        <p className="mt-3 text-muted-foreground">Выберите, о чём хотите поговорить, — и заберите вопросы с собой. Бесплатно и без регистрации.</p>
        <div className="mt-5 flex gap-2">{([["pair", "С партнёром"], ["self", "С собой"]] as const).map(([v, l]) =>
          <Button key={v} type="button" size="sm" variant={mode === v ? "default" : "outline"} onClick={() => setMode(v)}>{l}</Button>)}</div>
        <div className="mt-3 flex flex-wrap gap-2">{TOPICS.map((t) =>
          <button key={t} type="button" onClick={() => setTopic(t)} className={`rounded-full border px-3 py-1 text-sm ${topic === t ? "border-primary bg-primary/10 text-foreground" : "border-border text-muted-foreground"}`}>{t}</button>)}</div>
        {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
        <Button size="lg" className="mt-6 w-full" onClick={() => void run()} disabled={loading}>{loading ? <Loader2 className="animate-spin" /> : <Sparkles />}Получить мои вопросы</Button>
        <button type="button" onClick={close} className="mt-3 w-full text-sm text-muted-foreground underline-offset-4 hover:underline">Нет, спасибо</button>
      </> : <>
        {result.intro && <p className="mt-3 text-muted-foreground">{result.intro}</p>}
        <ol className="mt-5 space-y-3">{result.questions.map((q, i) => <li key={q} className="flex gap-3 rounded-xl border border-border bg-card p-4"><span className="font-display text-2xl text-primary">{i + 1}</span><span>{q}</span></li>)}</ol>
        <Button asChild size="lg" className="mt-6 w-full"><a href="/games">Продолжить разговор в игре</a></Button>
      </>}
    </div>
  </div>;
}

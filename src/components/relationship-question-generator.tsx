import { useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ArrowRight, HeartHandshake, LoaderCircle, RefreshCw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { generateRelationshipQuestions } from "@/lib/relationship-questions.functions";

const pairTopics = ["Близость", "Доверие", "Конфликты", "Поддержка", "Планы", "Быт и деньги"] as const;
const selfTopics = ["Желания", "Самоценность", "Ресурс", "Страхи", "Тело и чувства", "Будущее"] as const;
const tones = ["Бережно", "Прямо", "Легко"] as const;
type Topic = (typeof pairTopics)[number] | (typeof selfTopics)[number];
type Tone = (typeof tones)[number];
type Result = Awaited<ReturnType<typeof generateRelationshipQuestions>>;

const texts = {
  pair: { eyebrow: "RAPPORT AI · для двоих", title: "Начните разговор, который давно откладывали", lead: "Выберите тему и добавьте немного контекста — получите шесть вопросов, подобранных именно для вашей беседы.", note: "Отвечайте по очереди и не перебивайте. Можно остановиться в любой момент.", legend: "О чём хотите поговорить?", label: "Что сейчас происходит между вами?", placeholder: "Например: мы редко остаёмся вдвоём и хотим снова почувствовать близость…" },
  self: { eyebrow: "RAPPORT AI · наедине с собой", title: "Поговорите с собой честно", lead: "Выберите, о чём хочется поговорить с собой, — получите шесть вопросов, которые помогут услышать себя.", note: "Отвечайте письменно или вслух, не торопясь. Здесь нет правильных ответов.", legend: "О чём хотите поговорить с собой?", label: "Что сейчас происходит в вашей жизни?", placeholder: "Например: много сил уходит на других, хочу понять, чего хочу я сама…" },
};

export function RelationshipQuestionGenerator({ mode = "pair" }: { mode?: "pair" | "self" }) {
  const generate = useServerFn(generateRelationshipQuestions);
  const topics = mode === "self" ? selfTopics : pairTopics;
  const t = texts[mode];
  const [topic, setTopic] = useState<Topic>(topics[0]);
  const [tone, setTone] = useState<Tone>("Бережно");
  const [context, setContext] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setResult(null);
    setActiveQuestion(0);
    try {
      const next = await generate({ data: { topic, tone, context, mode } });
      setResult(next);
    } catch {
      setResult({ status: "error", message: "Не удалось подготовить вопросы. Попробуйте ещё раз чуть позже.", questions: [] });
    } finally {
      setPending(false);
    }
  }

  const ready = result?.status === "ready" ? result : null;

  return (
    <section className="relationship-conversation" aria-labelledby="relationship-conversation-title">
      <div className="section-inner relationship-conversation-inner">
        <div className="relationship-conversation-intro">
          <p className="eyebrow">{t.eyebrow}</p>
          <h2 id="relationship-conversation-title">{t.title}</h2>
          <p>{t.lead}</p>
          <div className="relationship-conversation-note"><HeartHandshake aria-hidden="true" /><span>{t.note}</span></div>
        </div>

        <div className="relationship-conversation-workspace">
          {!ready ? (
            <form onSubmit={submit} className="relationship-conversation-form">
              <fieldset disabled={pending}>
                <legend>{t.legend}</legend>
                <div className="relationship-topic-grid">
                  {topics.map((item) => <Button key={item} type="button" variant={topic === item ? "default" : "outline"} onClick={() => setTopic(item)} aria-pressed={topic === item}>{item}</Button>)}
                </div>
              </fieldset>

              <div className="space-y-3">
                <Label htmlFor="relationship-context">{t.label}</Label>
                <Textarea id="relationship-context" value={context} onChange={(event) => setContext(event.target.value)} maxLength={700} rows={5} placeholder={t.placeholder} disabled={pending} />
                <div className="flex justify-between gap-4 text-xs text-muted-foreground"><span>Не указывайте имена и личные данные</span><span>{context.length}/700</span></div>
              </div>

              <fieldset disabled={pending}>
                <legend>Какой тон вам ближе?</legend>
                <div className="relationship-tone-grid">
                  {tones.map((item) => <Button key={item} type="button" variant={tone === item ? "secondary" : "ghost"} onClick={() => setTone(item)} aria-pressed={tone === item}>{item}</Button>)}
                </div>
              </fieldset>

              {result && result.status !== "ready" && <div className={`relationship-conversation-message ${result.status === "safety" ? "relationship-conversation-message-safety" : ""}`} role="alert">{result.message}</div>}

              <Button type="submit" size="lg" className="w-full" disabled={pending}>
                {pending ? <><LoaderCircle className="animate-spin" />Подбираем вопросы…</> : <><Sparkles />Подобрать вопросы</>}
              </Button>
            </form>
          ) : (
            <div className="relationship-questions-result" aria-live="polite">
              <div className="relationship-question-progress"><span>Вопрос {activeQuestion + 1} из {ready.questions.length}</span><span>{topic} · {tone.toLowerCase()}</span></div>
              <p className="relationship-question-kicker">{ready.introduction}</p>
              <blockquote>{ready.questions[activeQuestion]}</blockquote>
              <div className="relationship-question-dots" aria-label="Выбор вопроса">
                {ready.questions.map((question, index) => <Button key={question} type="button" size="icon" variant={activeQuestion === index ? "default" : "outline"} onClick={() => setActiveQuestion(index)} aria-label={`Вопрос ${index + 1}`}>{index + 1}</Button>)}
              </div>
              <div className="relationship-question-actions">
                <Button type="button" variant="outline" onClick={() => setResult(null)}><RefreshCw />Другой набор</Button>
                {activeQuestion < ready.questions.length - 1 && <Button type="button" onClick={() => setActiveQuestion((index) => index + 1)}>Следующий вопрос <ArrowRight /></Button>}
              </div>
            </div>
          )}
          <p className="relationship-conversation-disclaimer">Это инструмент для начала разговора, а не замена психологической или экстренной помощи.</p>
        </div>
      </div>
    </section>
  );
}
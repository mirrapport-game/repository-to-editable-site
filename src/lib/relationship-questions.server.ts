import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { createLovableAiGatewayRunIdFetch } from "./lovable-ai-run-id.server";

export type RelationshipQuestionsResult =
  | { status: "ready"; introduction: string; questions: string[] }
  | { status: "safety"; message: string; questions: [] }
  | { status: "error"; message: string; questions: [] };

function safeGatewayMessage(error: unknown) {
  if (error && typeof error === "object") {
    const status = "statusCode" in error ? Number(error.statusCode) : "status" in error ? Number(error.status) : 0;
    const message = "message" in error && typeof error.message === "string" ? error.message : "";
    if (status === 402) return message || "RAPPORT AI временно недоступен. Попробуйте позже.";
    if (status === 429) return "Сейчас слишком много запросов. Подождите немного и попробуйте снова.";
    if (status === 401 || status === 403) return message || "RAPPORT AI сейчас недоступен.";
  }
  return "Не удалось подготовить вопросы. Попробуйте ещё раз чуть позже.";
}

function parseResult(text: string): RelationshipQuestionsResult {
  const normalized = text.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  try {
    const parsed = JSON.parse(normalized) as { status?: unknown; introduction?: unknown; message?: unknown; questions?: unknown };
    if (parsed.status === "safety") {
      return {
        status: "safety",
        message: typeof parsed.message === "string" ? parsed.message.slice(0, 500) : "В этой ситуации безопаснее обратиться за личной поддержкой к специалисту или в экстренную службу.",
        questions: [],
      };
    }
    if (parsed.status === "ready" && typeof parsed.introduction === "string" && Array.isArray(parsed.questions)) {
      const questions = parsed.questions.filter((item): item is string => typeof item === "string").map((item) => item.trim()).filter(Boolean).slice(0, 6);
      if (questions.length === 6) return { status: "ready", introduction: parsed.introduction.slice(0, 300), questions };
    }
  } catch {
    // A malformed model response is handled as a recoverable user-facing error.
  }
  return { status: "error", message: "Ответ получился неполным. Запросите другой набор вопросов.", questions: [] };
}

export async function createRelationshipQuestions(input: { topic: string; context: string; tone: string; mode?: "pair" | "self" }): Promise<RelationshipQuestionsResult> {
  const apiKey = (process.env["AI_API_KEY"] || process.env["LOVABLE_API_KEY"]);
  if (!apiKey) return { status: "error", message: "RAPPORT AI пока не настроен.", questions: [] };

  const runIdFetch = createLovableAiGatewayRunIdFetch();
  const provider = createOpenAI({
    baseURL: process.env["AI_BASE_URL"] || "https://ai.gateway.lovable.dev/v1",
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: runIdFetch.fetch,
  });

  try {
    const result = streamText({
      model: provider.responses("openai/gpt-6-astra"),
      system: input.mode === "self" ? `Ты бережный ведущий игры «Раппóрт — Живая». Создай ровно 6 открытых вопросов для честного разговора женщины с самой собой. Не ставь диагнозы, не давай советов и не проси раскрывать личные данные. Вопросы помогают замечать чувства, желания, ресурсы и опору на себя, говорить от первого лица, без самокритики. Если контекст указывает на насилие, угрозы, страх за безопасность или риск самоповреждения, верни статус safety и коротко предложи обратиться за личной помощью к местным экстренным службам или профильному специалисту. Верни только JSON без markdown: либо {"status":"ready","introduction":"одно короткое предложение","questions":["... ровно 6 вопросов"]}, либо {"status":"safety","message":"бережное сообщение","questions":[]}.` : `Ты бережный ведущий игры «Раппóрт — Отношения». Создай ровно 6 открытых вопросов для спокойного разговора пары. Не ставь диагнозы, не занимай ничью сторону, не давай советов и не проси раскрывать личные данные. Вопросы должны помогать каждому говорить от первого лица, замечать потребности и слушать партнёра. Не используй обвинительные формулировки «почему ты». Если контекст указывает на насилие, угрозы, принуждение, преследование, страх за безопасность или риск самоповреждения, не предлагай совместный разговор: верни статус safety и коротко предложи обратиться за личной помощью к местным экстренным службам или профильному специалисту. Верни только JSON без markdown: либо {"status":"ready","introduction":"одно короткое предложение","questions":["... ровно 6 вопросов"]}, либо {"status":"safety","message":"бережное сообщение","questions":[]}.`,
      prompt: `Тема: ${input.topic}\nЖелаемый тон: ${input.tone}\n${input.mode === "self" ? "Что происходит сейчас" : "Контекст пары"}: ${input.context || "Дополнительный контекст не указан"}`,
      providerOptions: {
        openai: {
          forceReasoning: true,
          reasoningEffort: "low",
          reasoningSummary: "auto",
          store: false,
          include: ["reasoning.encrypted_content"],
        },
      },
    });
    return parseResult(await result.text);
  } catch (error) {
    console.error("Relationship questions generation failed", error);
    return { status: "error", message: safeGatewayMessage(error), questions: [] };
  }
}
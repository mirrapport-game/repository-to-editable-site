import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createRelationshipQuestions } from "./relationship-questions.server";

const relationshipQuestionsInput = z.object({
  topic: z.enum(["Близость", "Доверие", "Конфликты", "Поддержка", "Планы", "Быт и деньги", "Желания", "Самоценность", "Ресурс", "Страхи", "Тело и чувства", "Будущее"]),
  mode: z.enum(["pair", "self"]).default("pair"),
  context: z.string().trim().max(700),
  tone: z.enum(["Бережно", "Прямо", "Легко"]),
});

export const generateRelationshipQuestions = createServerFn({ method: "POST" })
  .inputValidator((data) => relationshipQuestionsInput.parse(data))
  .handler(async ({ data }) => createRelationshipQuestions(data));
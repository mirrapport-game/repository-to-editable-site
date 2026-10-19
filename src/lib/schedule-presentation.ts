export function scheduleTone(game: string, phase: string): "demo" | "relationships" | "living" | "business" | "beauty" | "other" {
  if (phase === "demo") return "demo";
  const name = game.toLocaleLowerCase("ru-RU");
  if (name.includes("живая")) return "living";
  if (name.includes("отношения")) return "relationships";
  if (name.includes("бизнес") || name.includes("business")) return "business";
  if (name.includes("beauty") || name.includes("бьюти")) return "beauty";
  return "other";
}
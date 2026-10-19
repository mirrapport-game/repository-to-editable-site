// Уровни квеста гостя: порядок страниц-историй и награды за прохождение.
export const QUEST_LEVELS = [
  { path: "/about", title: "Знакомство с Раппóрт", hint: "Кто мы и откуда игра" },
  { path: "/how-it-works", title: "Как проходит игра", hint: "Пять шагов одной встречи" },
  { path: "/games", title: "Практика по игре", hint: "Rapport AI или тренажёр с кейсами" },
  { path: "/reviews", title: "Голоса участников", hint: "Видеоотзывы игроков" },
  { path: "/quiz", title: "Тест «Ваш путь»", hint: "Да / нет — и вы знаете маршрут" },
  { path: "/community", title: "Клуб знакомств", hint: "Люди, с которыми интересно" },
] as const;

export type QuestPath = (typeof QUEST_LEVELS)[number]["path"];

export const QUEST_REWARDS = [
  { title: "Раппóрт «Отношения» в деле", text: "Попробуйте игру про отношения: Rapport AI задаст вопросы для разговора с партнёром." },
] as const;

export function questIndex(path: string) {
  return QUEST_LEVELS.findIndex((l) => l.path === path);
}

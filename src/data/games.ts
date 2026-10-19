// Game catalogue for the per-game page template. The owner provides real data for 4 games;
// the single entry below is a PLACEHOLDER for testing the template — replace, don't publish as-is.

export type GameStep = { title: string; description: string };
export type GameTestimonial = { name: string; text: string; role: string };
export type GameSeo = { title: string; description: string; keywords: string[] };

export type GameEntry = {
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  audience: string[];
  outcomes: string[];
  steps: GameStep[];
  testimonials: GameTestimonial[];
  seo: GameSeo;
  /** Draft entries stay out of the sitemap until real data replaces them. */
  draft?: boolean;
};

export const gamesData: GameEntry[] = [
  {
    slug: "igra-na-blizost",
    draft: true,
    title: "Игра на близость (заглушка)",
    shortDescription: "Тестовая карточка: короткое описание игры в 1–2 предложения.",
    fullDescription: `Это тестовое описание для проверки шаблона.

Второй абзац: здесь будет рассказ о механике игры, атмосфере и том, что получают участники.`,
    audience: ["пары", "женщины"],
    outcomes: ["Тестовый результат 1", "Тестовый результат 2", "Тестовый результат 3"],
    steps: [
      { title: "Шаг 1", description: "Тестовое описание первого шага." },
      { title: "Шаг 2", description: "Тестовое описание второго шага." },
      { title: "Шаг 3", description: "Тестовое описание третьего шага." },
    ],
    testimonials: [
      { name: "Тестовое имя", text: "Тестовый отзыв — замените реальным.", role: "Участница" },
    ],
    seo: {
      title: "Игра на близость — Rapport Game | Психологическая игра для пар",
      description: "Тестовое SEO-описание: психологическая игра для пар и женщин, которая помогает вернуть близость и поговорить о важном. Заглушка.",
      keywords: ["игра для пар", "психологическая игра", "близость"],
    },
  },
];

export function getGameEntry(slug: string): GameEntry | undefined {
  return gamesData.find((g) => g.slug === slug);
}

/** Unique search tags for each released game page (title 50–60, description 140–160 chars). */
export const GAME_SEO: Record<string, GameSeo> = {
  otnosheniya: { title: "Отношения — Раппорт | Психологическая игра для пар онлайн", description: "Психологическая игра для пар «Раппорт — Отношения»: проживите сложные ситуации за персонажа, верните близость и научитесь говорить о важном. Онлайн и офлайн.", keywords: ["игра для пар", "психологическая игра для пар", "игра про отношения", "как вернуть близость"] },
  zhivaya: { title: "Живая — Раппорт | Женская трансформационная игра онлайн", description: "«Раппорт — Живая» — женская трансформационная игра: 12 сфер жизни, игра за персонажа и бережная обратная связь. Узнайте свои желания и границы.", keywords: ["женская трансформационная игра", "игра для женщин", "женский круг", "самопознание"] },
  beauty: { title: "Раппорт Beauty — игра для салонов и студий красоты", description: "Еженедельная 30-минутная ролевая игра для мастеров и администраторов: реальные сценарии салона, 6 навыков сервиса, рост повторных визитов и среднего чека.", keywords: ["игра для салона красоты", "обучение мастеров", "сервис в салоне", "работа с клиентами"] },
  business: { title: "Раппорт Бизнес — тренинг-интенсив для команд и руководителей", description: "45 игр-симуляций и 1000+ офисных сценариев: тренинг эмоционального партнёрства для сотрудников и руководителей. Мотивация, сплочение, профилактика конфликтов. От 50 000 ₽.", keywords: ["корпоративный тренинг", "тимбилдинг", "бизнес-симуляция", "эмоциональное партнёрство", "профилактика конфликтов", "корпоративная игра", "тренинг для руководителей"] },
};

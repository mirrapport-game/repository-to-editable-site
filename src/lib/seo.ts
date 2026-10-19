export const SITE_URL = "https://rapportgame.ru";

const BASE = ["Раппорт", "игра Раппорт", "психологическая игра", "трансформационная игра", "игра про отношения", "игропрактика"];

export const KEYWORDS: Record<string, string[]> = {
  "/": ["психологические игры", "игра для пар", "настольная психологическая игра", "игра для глубоких разговоров", "купить психологическую игру", "игры на отношения"],
  "/about": ["о проекте Раппорт", "автор игры Раппорт", "Артём Ефимов", "философия игры"],
  "/games": ["каталог психологических игр", "Раппорт Отношения", "Раппорт Живая", "Раппорт Beauty", "Раппорт Бизнес", "трансформационные игры купить"],
  "/facilitators": ["стать ведущим игры", "обучение игропрактиков", "как стать игропрактиком", "франшиза психологической игры", "заработок ведущего игр", "коробочная версия игры"],
  "/online-platform": ["онлайн психологическая игра", "игры онлайн для ведущих", "провести игру онлайн", "Polegame", "трансформационная игра онлайн"],
  "/how-it-works": ["как проходит психологическая игра", "правила игры Раппорт", "этапы трансформационной игры"],
  "/reviews": ["отзывы игра Раппорт", "отзывы о психологической игре", "видеоотзывы"],
  "/community": ["клуб знакомств", "знакомства для пар", "дружба семьями", "сообщество игроков"],
  "/blog": ["блог о психологии", "статьи об отношениях", "психология отношений", "как стать ведущим", "трансформационные игры статьи"],
  "/contacts": ["записаться на игру", "контакты Раппорт", "заказать ведущего", "игра на корпоратив", "игра на девичник"],
};

export function seoMeta(path: string, extra: string[] = []) {
  const kw = [...(KEYWORDS[path] ?? []), ...extra, ...BASE];
  return [
    { name: "keywords", content: Array.from(new Set(kw)).join(", ") },
    { property: "og:url", content: `${SITE_URL}${path === "/" ? "/" : path}` },
    { property: "og:locale", content: "ru_RU" },
    { property: "og:site_name", content: "Раппóрт" },
  ];
}

export function canonical(path: string) {
  return [{ rel: "canonical", href: `${SITE_URL}${path === "/" ? "/" : path}` }];
}

/** Reusable page SEO: title, description, canonical, Open Graph and Twitter Card tags for a route head(). */
export function seoHead(o: { title: string; description: string; path: string; image?: string | undefined; keywords?: string[]; type?: string }) {
  const url = `${SITE_URL}${o.path === "/" ? "/" : o.path}`;
  const image = o.image ? (o.image.startsWith("http") ? o.image : `${SITE_URL}${o.image}`) : undefined;
  return {
    links: [{ rel: "canonical", href: url }],
    meta: [
      ...seoMeta(o.path, o.keywords ?? []),
      { title: o.title },
      { name: "description", content: o.description },
      { property: "og:title", content: o.title },
      { property: "og:description", content: o.description },
      { property: "og:url", content: url },
      { property: "og:type", content: o.type ?? "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: o.title },
      { name: "twitter:description", content: o.description },
      ...(image ? [{ property: "og:image", content: image }, { name: "twitter:image", content: image }] : []),
    ],
  };
}

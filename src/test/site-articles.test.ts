import { describe, expect, it } from "vitest";
import {
  articleSlug,
  estimateReadTime,
  formatRussianDate,
  mergeArticles,
  parseSections,
  pluralRu,
} from "@/lib/site-articles";
import type { Article } from "@/data/site";

const article = (slug: string, category = "Статьи"): Article => ({
  slug,
  title: slug,
  description: "",
  category,
  date: "",
  readTime: "",
  intro: "",
  sections: [],
});

describe("адрес статьи", () => {
  it("транслитерирует русский заголовок", () => {
    expect(articleSlug("Думать или не думать — вот где собака зарыта")).toBe(
      "dumat-ili-ne-dumat-vot-gde-sobaka-zaryta",
    );
  });

  it("не оставляет лишних дефисов и обрезает длинные адреса", () => {
    expect(articleSlug("  Привет!!  Мир  ")).toBe("privet-mir");
    expect(articleSlug("а".repeat(120))).toHaveLength(80);
  });
});

describe("время чтения", () => {
  it("считает минуты по количеству слов", () => {
    expect(estimateReadTime(["слово ".repeat(260)])).toBe("2 минуты");
    expect(estimateReadTime(["слово ".repeat(650)])).toBe("5 минут");
  });

  it("не показывает ноль минут для короткого текста", () => {
    expect(estimateReadTime([""])).toBe("1 минута");
  });

  it("склоняет слово правильно", () => {
    expect(pluralRu(1, "минута", "минуты", "минут")).toBe("минута");
    expect(pluralRu(2, "минута", "минуты", "минут")).toBe("минуты");
    expect(pluralRu(5, "минута", "минуты", "минут")).toBe("минут");
    expect(pluralRu(11, "минута", "минуты", "минут")).toBe("минут");
    expect(pluralRu(21, "минута", "минуты", "минут")).toBe("минута");
  });
});

describe("дата", () => {
  it("показывает дату по-русски", () => {
    expect(formatRussianDate("2026-10-21")).toBe("21 октября 2026");
    expect(formatRussianDate("2026-01-05")).toBe("5 января 2026");
  });

  it("не выдумывает дату, если формат другой", () => {
    expect(formatRussianDate("")).toBe("");
    expect(formatRussianDate("вчера")).toBe("вчера");
  });
});

describe("блоки статьи", () => {
  it("убирает пустые абзацы и пункты", () => {
    expect(
      parseSections([
        { heading: "  Вывод  ", paragraphs: ["  ", "Текст"], bullets: ["", "Пункт"] },
        { heading: "", paragraphs: [], bullets: [] },
        "мусор",
      ]),
    ).toEqual([{ heading: "Вывод", paragraphs: ["Текст"], bullets: ["Пункт"] }]);
  });

  it("не падает на неожиданном содержимом", () => {
    expect(parseSections(null)).toEqual([]);
    expect(parseSections("не массив")).toEqual([]);
  });
});

describe("списание статей в блоге", () => {
  it("ставит статьи из базы первыми и не дублирует адрес", () => {
    const merged = mergeArticles([article("старая"), article("общий")], [article("новая"), article("общий")]);
    expect(merged.map((a) => a.slug)).toEqual(["новая", "общий", "старая"]);
  });
});

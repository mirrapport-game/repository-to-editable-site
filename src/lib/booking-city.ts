import { cities } from "@/data/cities";

/** Пункт списка «Другой город»: выбрав его, человек вписывает свой город вручную. */
export const OTHER_CITY = "Другой город";

/**
 * Все города проекта в том же порядке, что и на сайте («Онлайн» исключён —
 * это формат встречи, он уже есть в отдельном списке форматов).
 */
export const bookingCities: string[] = cities
  .filter((city) => city.slug !== "online")
  .map((city) => city.name);


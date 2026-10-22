import { expect, it } from "vitest";
import { OTHER_CITY, bookingCities } from "@/lib/booking-city";


it("lists every city the site works in", () => {
  for (const name of ["Санкт-Петербург", "Москва", "Сочи", "Иркутск", "Нижний Новгород", "Ярославль", "Благовещенск"]) {
    expect(bookingCities).toContain(name);
  }
});

it("keeps the list clean: no online pseudo-city, no duplicates, no 'other' entry inside", () => {
  expect(bookingCities).not.toContain("Онлайн");
  expect(bookingCities).not.toContain(OTHER_CITY);
  expect(new Set(bookingCities).size).toBe(bookingCities.length);
});

it("offers 'another city' as a separate choice, not as a city name", () => {
  expect(OTHER_CITY).toBe("Другой город");
});


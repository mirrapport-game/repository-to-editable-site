import { expect, it } from "vitest";
import { OTHER_CITY, bookingCities, resolveBookingCity } from "@/lib/booking-city";

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

it("uses the typed city only when 'other' is picked", () => {
  expect(resolveBookingCity(OTHER_CITY, "  Тюмень  ")).toBe("Тюмень");
  expect(resolveBookingCity("Сочи", "Тюмень")).toBe("Сочи");
});

import { describe, expect, it } from "vitest";
import { intensiveOffer } from "@/data/intensiv";

describe("Intensive offer", () => {
  it("Olga has 20 years in sales", () => {
    expect(intensiveOffer.olgaSalesYears).toBe(20);
  });
  it("Olga's psychology services start at 250 thousand rubles", () => {
    expect(intensiveOffer.olgaMinimumCheckRub).toBe(250_000);
  });
});

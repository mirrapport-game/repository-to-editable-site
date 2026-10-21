import { describe, expect, it } from "vitest";
import { followupTicketPrice, intensiveOffer } from "@/data/intensiv";

describe("Intensive offer", () => {
  it("Olga has 20 years in sales", () => {
    expect(intensiveOffer.olgaSalesYears).toBe(20);
  });
  it("Olga's psychology services start at 250 thousand rubles", () => {
    expect(intensiveOffer.olgaMinimumCheckRub).toBe(250_000);
  });
  it("the followup is one week later", () => {
    expect(intensiveOffer.followupAfterDays).toBe(7);
  });
  it("applications are generated at the second event", () => {
    expect(intensiveOffer.applicationGenerationEvent).toBe(2);
  });
  it("a regular followup ticket costs 15000 rubles", () => {
    expect(followupTicketPrice(false)).toBe(15_000);
  });
  it("coming with a relationship psychologist earns a free followup ticket", () => {
    expect(followupTicketPrice(true)).toBe(0);
  });
});
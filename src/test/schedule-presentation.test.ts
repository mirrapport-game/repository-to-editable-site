import { describe, expect, it } from "vitest";
import { scheduleTone } from "@/lib/schedule-presentation";

describe("Schedule categories", () => {
  it("demo has its own tone even when a game is selected", () => {
    expect(scheduleTone("Раппóрт Живая", "demo")).toBe("demo");
    expect(scheduleTone("Раппóрт Отношения", "demo")).toBe("demo");
  });
  it("each game has a distinct tone", () => {
    expect(scheduleTone("Раппóрт Отношения", "paid")).toBe("relationships");
    expect(scheduleTone("Раппóрт Живая", "paid")).toBe("living");
    expect(scheduleTone("Раппóрт Бизнес", "paid")).toBe("business");
    expect(scheduleTone("Раппóрт Beauty", "paid")).toBe("beauty");
  });
});
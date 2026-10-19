import { describe, expect, it } from "vitest";
import { gameLeadSchema, normalizeBookingPhone } from "@/lib/booking-phone";

describe("booking phone normalization", () => {
  it("removes spaces", () => expect(normalizeBookingPhone("+7 999 123 45 67")).toBe("+79991234567"));
  it("removes parentheses", () => expect(normalizeBookingPhone("+7 (999) 123-45-67")).toBe("+79991234567"));
  it("converts Russian trunk prefix 8 to +7", () => expect(normalizeBookingPhone("8 (999) 123-45-67")).toBe("+79991234567"));
  it("accepts pasted unicode punctuation", () => expect(normalizeBookingPhone("8\u00a0(999)\u00a0123‑45–67\u200b")).toBe("+79991234567"));
  it("accepts ten Russian national digits", () => expect(normalizeBookingPhone("9991234567")).toBe("+79991234567"));
  it("rejects short numbers", () => expect(normalizeBookingPhone("1234567")).toBeNull());
  it("rejects letters instead of silently stripping them", () => expect(normalizeBookingPhone("+7(999)1234567abc")).toBeNull());
  it("rejects excessive digits", () => expect(normalizeBookingPhone("899912345678")).toBeNull());
  it("validates normalized data before saving", () => {
    const data = gameLeadSchema.parse({ name: "Тест", phone: "8(999)1234567", game: "Раппорт", format: "Онлайн", website: "" });
    expect(data.phone).toBe("+79991234567");
  });
});

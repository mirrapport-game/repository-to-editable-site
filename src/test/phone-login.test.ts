import { describe, expect, it } from "vitest";
import { normalizePhone, PHONE_MAX_FAILED_ATTEMPTS, PHONE_PASSWORD_MIN } from "@/lib/phone";

describe("host phone sign-in", () => {
  it("treats 8, +7 and 10-digit Russian numbers as the same phone", () => {
    expect(normalizePhone("8 (900) 123-45-67")).toBe("79001234567");
    expect(normalizePhone("+7 900 123 45 67")).toBe("79001234567");
    expect(normalizePhone("9001234567")).toBe("79001234567");
  });
  it("rejects incomplete numbers", () => {
    expect(normalizePhone("12345")).toBeNull();
  });
  it("requires passwords of at least 8 characters and locks after 5 wrong tries", () => {
    expect(PHONE_PASSWORD_MIN).toBe(8);
    expect(PHONE_MAX_FAILED_ATTEMPTS).toBe(5);
  });
});

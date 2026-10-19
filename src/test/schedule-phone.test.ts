import { expect, it } from "vitest";
import { schedulePhoneSchema } from "@/lib/schedule-phone";
it("accepts and normalizes a telephone number without requiring a name", () => {
  expect(schedulePhoneSchema.parse("+7 (951) 682-14-22")).toBe("+79516821422");
  expect(schedulePhoneSchema.safeParse("@nickname").success).toBe(false);
  expect(schedulePhoneSchema.safeParse("123").success).toBe(false);
});
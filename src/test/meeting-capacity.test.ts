import { expect, it } from "vitest";
import { validMeetingCapacity } from "@/lib/meeting-capacity";
it("accepts participant counts from 2 to 150", () => {
  expect(validMeetingCapacity(2)).toBe(true);
  expect(validMeetingCapacity(150)).toBe(true);
  expect(validMeetingCapacity(1)).toBe(false);
  expect(validMeetingCapacity(151)).toBe(false);
  expect(validMeetingCapacity(2.5)).toBe(false);
});
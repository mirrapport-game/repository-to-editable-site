import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, expect, it, vi } from "vitest";
import { BOOKING_FAILURE } from "@/lib/booking-phone";

const submit = vi.hoisted(() => vi.fn());
vi.mock("@tanstack/react-start", () => ({ useServerFn: () => submit }));
vi.mock("@/lib/game-leads.functions", () => ({ submitGameLead: () => {} }));
import { useGameBooking } from "@/hooks/use-game-booking";
const input = { name: "Тест", phone: "8 (999) 123-45-67", game: "Раппорт", format: "Онлайн" as const, website: "" };

beforeEach(() => { localStorage.clear(); submit.mockReset(); });
it("recognizes a successful repeat in another phone format", async () => {
  submit.mockResolvedValue({ ok: true });
  const { result, rerender } = renderHook(({ phone }) => useGameBooking(phone), { initialProps: { phone: input.phone } });
  expect(result.current.registered).toBe(false);
  await act(() => result.current.send(input));
  rerender({ phone: "+7 999 123 45 67" });
  await waitFor(() => expect(result.current.registered).toBe(true));
  await act(() => result.current.send({ ...input, phone: "+7 999 123 45 67" }));
  expect(submit).toHaveBeenCalledTimes(2);
  expect(result.current.done).toBe(true);
});
it("does not remember rejected submissions as registered", async () => {
  submit.mockResolvedValue({ ok: false, message: BOOKING_FAILURE });
  const { result } = renderHook(() => useGameBooking(input.phone));
  await act(() => result.current.send(input));
  expect(result.current.error).toBe(BOOKING_FAILURE);
  expect(result.current.done).toBe(false);
  expect(result.current.registered).toBe(false);
});
it("does not label a transport failure as an invalid phone", async () => {
  submit.mockRejectedValue(new Error("network"));
  const { result } = renderHook(() => useGameBooking(input.phone));
  await act(() => result.current.send(input));
  expect(result.current.error).toBe(BOOKING_FAILURE);
});
it("rejects invalid numbers before sending", async () => {
  const { result } = renderHook(() => useGameBooking("123"));
  await act(() => result.current.send({ ...input, phone: "123" }));
  expect(submit).not.toHaveBeenCalled();
  expect(result.current.done).toBe(false);
});

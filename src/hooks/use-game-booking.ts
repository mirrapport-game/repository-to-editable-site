import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { submitGameLead } from "@/lib/game-leads.functions";
import { BOOKING_FAILURE, gameLeadSchema, normalizeBookingPhone, type GameLeadInput } from "@/lib/booking-phone";

const storageKey = "rapport-confirmed-booking-phone";

/** Only this visitor's successful booking is remembered; never query private accounts by phone. */
export function useGameBooking(phone: string) {
  const submit = useServerFn(submitGameLead);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [confirmedPhone, setConfirmedPhone] = useState("");
  useEffect(() => {
    try { setConfirmedPhone(localStorage.getItem(storageKey) ?? ""); } catch { /* Storage is optional. */ }
  }, []);
  const registered = Boolean(confirmedPhone && normalizeBookingPhone(phone) === confirmedPhone);

  async function send(input: GameLeadInput) {
    const parsed = gameLeadSchema.safeParse(input);
    if (!parsed.success) { setError(parsed.error.issues[0]?.message ?? "Проверьте поля формы"); return; }
    setBusy(true); setError("");
    try {
      const result = await submit({ data: input });
      if (!result.ok) { setError(result.message); return; }
      const normalized = parsed.data.phone;
      if (normalized) {
        setConfirmedPhone(normalized);
        try { localStorage.setItem(storageKey, normalized); } catch { /* Storage is optional. */ }
      }
      setDone(true);
    } catch { setError(BOOKING_FAILURE); }
    finally { setBusy(false); }
  }
  return { busy, done, error, registered, send };
}

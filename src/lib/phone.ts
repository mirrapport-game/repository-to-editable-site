// Phone numbers are stored as digits only, Russian numbers in the 7XXXXXXXXXX form.
export function normalizePhone(input: string): string | null {
  let d = String(input ?? "").replace(/\D/g, "");
  if (d.length === 11 && d.startsWith("8")) d = `7${d.slice(1)}`;
  if (d.length === 10 && d.startsWith("9")) d = `7${d}`;
  return /^[0-9]{11,15}$/.test(d) ? d : null;
}

export const PHONE_PASSWORD_MIN = 8;
export const PHONE_MAX_FAILED_ATTEMPTS = 5;
export const PHONE_LOCK_MINUTES = 15;

export function formatPhone(d: string) {
  return d.length === 11 && d.startsWith("7") ? `+7 ${d.slice(1, 4)} ${d.slice(4, 7)}-${d.slice(7, 9)}-${d.slice(9)}` : `+${d}`;
}

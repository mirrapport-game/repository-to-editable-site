import { parsePhoneNumberFromString } from "libphonenumber-js/min";
import { z } from "zod";

export function normalizeBookingPhone(value: string): string | null {
  const cleaned = value.normalize("NFKC").replace(/[\u200B-\u200D\uFEFF]/g, "").replace(/[‐‑‒–—−]/g, "-").trim();
  if (!/^[+\d\s()\-]+$/.test(cleaned) || cleaned.length > 60) return null;
  const phone = parsePhoneNumberFromString(cleaned, "RU");
  return phone?.isValid() ? phone.number : null;
}

export const gameLeadSchema = z.object({
  name: z.string().trim().min(2, "Укажите имя").max(100, "Имя слишком длинное"),
  phone: z.string().max(60).transform(normalizeBookingPhone).refine((value) => value !== null, "Проверьте номер телефона"),
  game: z.string().trim().max(120),
  format: z.enum(["Онлайн", "Офлайн", "Индивидуально", "Для группы"]),
  city: z.string().trim().min(2, "Укажите город").max(80, "Город слишком длинный"),
  marketing: z.boolean().optional(),
  website: z.string().max(0),
  mentorship: z.boolean().optional(),
  formName: z.string().trim().max(80).optional(),
  page: z.string().trim().max(200).optional(),
});

export type GameLeadInput = z.input<typeof gameLeadSchema>;
export type GameLeadResult = { ok: true } | { ok: false; message: string };
export const BOOKING_FAILURE = "Не удалось отправить заявку. Попробуйте ещё раз позже.";

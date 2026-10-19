// Цены в рублях. Поправьте здесь — и они обновятся везде.
export const GAME_PARTICIPATION_PRICE_RUB = 2500;
export const DEMO_GAME_PRICE_RUB = 1500;
/** Коробочная версия игры с обучающим видео */
export const BOX_PRICE_RUB = 75000;
/** Под ключ с упаковкой */
export const TURNKEY_PRICE_RUB = 200000;

export function participationPrice(game: string | null | undefined): number {
  return game && /демо|demo/i.test(game) ? DEMO_GAME_PRICE_RUB : GAME_PARTICIPATION_PRICE_RUB;
}

export function boxPrice(_slug: string): number {
  return BOX_PRICE_RUB;
}

/** Индивидуальное сопровождение с Артёмом */
export const MENTORSHIP_PRICE_RUB = 300000;

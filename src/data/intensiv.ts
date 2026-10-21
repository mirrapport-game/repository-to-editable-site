/** Public offer values shared by the intensive page and its rule tests. */
export const intensiveOffer = {
  olgaSalesYears: 20,
  olgaMinimumCheckRub: 250_000,
  followupAfterDays: 7,
  followupPriceRub: 15_000,
  applicationGenerationEvent: 2,
} as const;

export function followupTicketPrice(comesWithRelationshipPsychologist: boolean): number {
  return comesWithRelationshipPsychologist ? 0 : intensiveOffer.followupPriceRub;
}
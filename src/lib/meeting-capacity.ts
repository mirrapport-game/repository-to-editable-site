export const MEETING_MIN_PARTICIPANTS = 2;
export const MEETING_MAX_PARTICIPANTS = 150;
export function validMeetingCapacity(value: number): boolean {
  return Number.isInteger(value) && value >= MEETING_MIN_PARTICIPANTS && value <= MEETING_MAX_PARTICIPANTS;
}
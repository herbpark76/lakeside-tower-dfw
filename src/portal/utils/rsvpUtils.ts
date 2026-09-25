import type { Rsvp, RsvpStatus } from '../data/types';

export function countGoing(rsvps: Rsvp[]): number {
  return rsvps
    .filter((r) => r.status === 'going')
    .reduce((sum, r) => sum + 1 + r.guests, 0);
}

export function countMaybe(rsvps: Rsvp[]): number {
  return rsvps.filter((r) => r.status === 'maybe').length;
}

export function countWaitlist(rsvps: Rsvp[]): number {
  return rsvps.filter((r) => r.status === 'waitlist').length;
}

export function countNotGoing(rsvps: Rsvp[]): number {
  return rsvps.filter((r) => r.status === 'not_going').length;
}

export function countByStatus(rsvps: Rsvp[]): Record<RsvpStatus, number> {
  const counts: Record<RsvpStatus, number> = {
    going: 0,
    maybe: 0,
    not_going: 0,
    waitlist: 0,
  };
  for (const r of rsvps) {
    counts[r.status]++;
  }
  return counts;
}

export function findUserRsvp(
  rsvps: Rsvp[],
  userId: string,
): Rsvp | undefined {
  return rsvps.find((r) => r.userId === userId);
}

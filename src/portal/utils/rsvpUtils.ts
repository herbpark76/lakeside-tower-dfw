import type { Rsvp } from '../data/types';

export function countGoing(rsvps: Rsvp[]): number {
  return rsvps
    .filter((r) => r.status === 'going')
    .reduce((sum, r) => sum + 1 + r.guests, 0);
}

export function countMaybe(rsvps: Rsvp[]): number {
  return rsvps.filter((r) => r.status === 'maybe').length;
}

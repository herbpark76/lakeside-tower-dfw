import type { Rsvp } from '../data/types';
import { daysFromNowAt } from '../utils/dateUtils';

export const mockRsvps: Rsvp[] = [
  // Awards watch party (evt-awards-watch) — potluck dishes seeded
  { eventId: 'evt-awards-watch', userId: 'rsvp-8', displayName: 'Fictional Resident H', unit: 'Unit 1105', status: 'going', guests: 1, potluckItem: 'Buffalo chicken dip', respondedAt: daysFromNowAt(3, 12, 0) },
  { eventId: 'evt-awards-watch', userId: 'rsvp-9', displayName: 'Fictional Resident I', unit: 'Unit 1202', status: 'going', guests: 0, potluckItem: 'Sliders and fries', respondedAt: daysFromNowAt(4, 10, 0) },
  { eventId: 'evt-awards-watch', userId: 'rsvp-10', displayName: 'Fictional Resident J', unit: 'Unit 1504', status: 'going', guests: 2, potluckItem: 'Chocolate fondue with fruit', respondedAt: daysFromNowAt(5, 9, 0) },
  { eventId: 'evt-awards-watch', userId: 'rsvp-11', displayName: 'Fictional Resident B', unit: 'Unit 501', status: 'maybe', guests: 0, potluckItem: 'Charcuterie board', respondedAt: daysFromNowAt(5, 15, 0) },

  // Holiday stroll (evt-holiday-stroll)
  { eventId: 'evt-holiday-stroll', userId: 'demo-owner-a', displayName: 'Sample Resident A', unit: 'Unit 402', status: 'going', guests: 0, respondedAt: daysFromNowAt(2, 10, 0) },
  { eventId: 'evt-holiday-stroll', userId: 'rsvp-12', displayName: 'Fictional Resident C', unit: 'Unit 608', status: 'going', guests: 1, respondedAt: daysFromNowAt(3, 11, 0) },
  { eventId: 'evt-holiday-stroll', userId: 'rsvp-13', displayName: 'Fictional Resident E', unit: 'Unit 805', status: 'going', guests: 0, respondedAt: daysFromNowAt(4, 9, 0) },
  { eventId: 'evt-holiday-stroll', userId: 'rsvp-14', displayName: 'Fictional Resident G', unit: 'Unit 1001', status: 'going', guests: 2, respondedAt: daysFromNowAt(5, 14, 0) },
  { eventId: 'evt-holiday-stroll', userId: 'rsvp-15', displayName: 'Fictional Resident I', unit: 'Unit 1202', status: 'maybe', guests: 0, respondedAt: daysFromNowAt(6, 10, 0) },

  // Cooking class (evt-cooking-class)
  { eventId: 'evt-cooking-class', userId: 'rsvp-19', displayName: 'Fictional Resident J', unit: 'Unit 1504', status: 'going', guests: 0, respondedAt: daysFromNowAt(3, 11, 0) },
  { eventId: 'evt-cooking-class', userId: 'rsvp-20', displayName: 'Fictional Resident B', unit: 'Unit 501', status: 'going', guests: 0, respondedAt: daysFromNowAt(4, 10, 0) },
  { eventId: 'evt-cooking-class', userId: 'rsvp-21', displayName: 'Fictional Resident E', unit: 'Unit 805', status: 'going', guests: 0, respondedAt: daysFromNowAt(5, 14, 0) },

  // Wine pairing (evt-wine-pairing)
  { eventId: 'evt-wine-pairing', userId: 'rsvp-22', displayName: 'Fictional Resident C', unit: 'Unit 608', status: 'going', guests: 1, respondedAt: daysFromNowAt(5, 10, 0) },
  { eventId: 'evt-wine-pairing', userId: 'rsvp-23', displayName: 'Fictional Resident G', unit: 'Unit 1001', status: 'going', guests: 0, respondedAt: daysFromNowAt(6, 11, 0) },
  { eventId: 'evt-wine-pairing', userId: 'rsvp-24', displayName: 'Fictional Resident I', unit: 'Unit 1202', status: 'going', guests: 0, respondedAt: daysFromNowAt(7, 9, 0) },

  // Game show night (evt-game-show-night)
  { eventId: 'evt-game-show-night', userId: 'rsvp-25', displayName: 'Fictional Resident D', unit: 'Unit 701', status: 'going', guests: 1, respondedAt: daysFromNowAt(10, 10, 0) },
  { eventId: 'evt-game-show-night', userId: 'rsvp-26', displayName: 'Fictional Resident F', unit: 'Unit 902', status: 'going', guests: 0, respondedAt: daysFromNowAt(11, 12, 0) },
  { eventId: 'evt-game-show-night', userId: 'rsvp-27', displayName: 'Fictional Resident H', unit: 'Unit 1105', status: 'going', guests: 0, respondedAt: daysFromNowAt(12, 9, 0) },
];

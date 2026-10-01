import type { Rsvp } from '../data/types';

export const mockRsvps: Rsvp[] = [
  // Bunco Night (evt-bunco-night)
  { eventId: 'evt-bunco-night', userId: 'demo-owner-a', displayName: 'Sample Resident A', unit: 'Unit 402', status: 'going', guests: 0, respondedAt: '2026-10-01T10:00' },
  { eventId: 'evt-bunco-night', userId: 'rsvp-1', displayName: 'Fictional Resident C', unit: 'Unit 608', status: 'going', guests: 1, respondedAt: '2026-10-02T11:00' },
  { eventId: 'evt-bunco-night', userId: 'rsvp-2', displayName: 'Fictional Resident E', unit: 'Unit 805', status: 'going', guests: 0, respondedAt: '2026-10-03T09:00' },
  { eventId: 'evt-bunco-night', userId: 'rsvp-3', displayName: 'Fictional Resident G', unit: 'Unit 1001', status: 'maybe', guests: 0, respondedAt: '2026-10-03T14:00' },

  // Tower Talk: Travel Tales (evt-tower-talk-travel)
  { eventId: 'evt-tower-talk-travel', userId: 'demo-owner-a', displayName: 'Sample Resident A', unit: 'Unit 402', status: 'going', guests: 0, respondedAt: '2026-10-02T10:00' },
  { eventId: 'evt-tower-talk-travel', userId: 'rsvp-4', displayName: 'Fictional Resident B', unit: 'Unit 501', status: 'going', guests: 0, respondedAt: '2026-10-03T12:00' },
  { eventId: 'evt-tower-talk-travel', userId: 'rsvp-5', displayName: 'Fictional Resident D', unit: 'Unit 701', status: 'going', guests: 1, respondedAt: '2026-10-04T09:00' },

  // Oktoberfest at the Tower (evt-oktoberfest-tower)
  { eventId: 'evt-oktoberfest-tower', userId: 'demo-owner-a', displayName: 'Sample Resident A', unit: 'Unit 402', status: 'going', guests: 1, respondedAt: '2026-10-08T10:00' },
  { eventId: 'evt-oktoberfest-tower', userId: 'rsvp-6', displayName: 'Fictional Resident F', unit: 'Unit 902', status: 'going', guests: 0, respondedAt: '2026-10-09T11:00' },
  { eventId: 'evt-oktoberfest-tower', userId: 'rsvp-7', displayName: 'Fictional Resident H', unit: 'Unit 1105', status: 'going', guests: 2, respondedAt: '2026-10-10T14:00' },
  { eventId: 'evt-oktoberfest-tower', userId: 'rsvp-8', displayName: 'Fictional Resident J', unit: 'Unit 1504', status: 'maybe', guests: 0, respondedAt: '2026-10-11T10:00' },

  // Spooky Candlelight Concert (evt-spooky-concert)
  { eventId: 'evt-spooky-concert', userId: 'demo-owner-a', displayName: 'Sample Resident A', unit: 'Unit 402', status: 'going', guests: 0, respondedAt: '2026-10-12T10:00' },
  { eventId: 'evt-spooky-concert', userId: 'rsvp-9', displayName: 'Fictional Resident C', unit: 'Unit 608', status: 'going', guests: 1, respondedAt: '2026-10-13T12:00' },
  { eventId: 'evt-spooky-concert', userId: 'rsvp-10', displayName: 'Fictional Resident I', unit: 'Unit 1202', status: 'going', guests: 0, respondedAt: '2026-10-14T09:00' },

  // Gentlemen's Night (evt-gentlemens-night)
  { eventId: 'evt-gentlemens-night', userId: 'demo-owner-a', displayName: 'Sample Resident A', unit: 'Unit 402', status: 'going', guests: 0, note: 'Haircut', respondedAt: '2026-10-15T10:00' },
  { eventId: 'evt-gentlemens-night', userId: 'rsvp-11', displayName: 'Fictional Resident B', unit: 'Unit 501', status: 'going', guests: 0, note: 'Both', respondedAt: '2026-10-16T11:00' },
  { eventId: 'evt-gentlemens-night', userId: 'rsvp-12', displayName: 'Fictional Resident D', unit: 'Unit 701', status: 'going', guests: 0, note: 'Shave', respondedAt: '2026-10-17T14:00' },

  // Wicked Garden Halloween Party (evt-wicked-garden)
  { eventId: 'evt-wicked-garden', userId: 'demo-owner-a', displayName: 'Sample Resident A', unit: 'Unit 402', status: 'going', guests: 1, respondedAt: '2026-10-20T10:00' },
  { eventId: 'evt-wicked-garden', userId: 'rsvp-13', displayName: 'Fictional Resident E', unit: 'Unit 805', status: 'going', guests: 0, respondedAt: '2026-10-21T12:00' },
  { eventId: 'evt-wicked-garden', userId: 'rsvp-14', displayName: 'Fictional Resident G', unit: 'Unit 1001', status: 'going', guests: 2, respondedAt: '2026-10-22T09:00' },
  { eventId: 'evt-wicked-garden', userId: 'rsvp-15', displayName: 'Fictional Resident H', unit: 'Unit 1105', status: 'maybe', guests: 0, respondedAt: '2026-10-25T14:00' },
];

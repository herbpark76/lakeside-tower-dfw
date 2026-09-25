import type { Announcement } from '../data/types';
import {
  daysFromNow,
  nextWeekdayDate,
  weekdayName,
} from '../utils/dateUtils';

// Thursday = 4. strictlyAfterToday ensures the date is always after today.
const nextThursday = nextWeekdayDate(4, { strictlyAfterToday: true });

export const mockAnnouncements: Announcement[] = [
  {
    id: 'ann-community-update',
    title: 'Community Update: Pool pump failure, garage epoxy prep, and HVAC sensor installs',
    body: `Here's a roundup of what's happening around the building this week.

## Pool temporarily closed

The main pool pump failed on ${weekdayName(daysFromNow(-1))} morning. We've ordered a replacement and expect the pool to reopen **${weekdayName(nextThursday)}**. The hot tubs are unaffected and back to their normal temperature. We appreciate your patience while we get this sorted.

## 2nd-floor garage epoxy project — prep starts soon

Preparation for the 2nd-floor garage epoxy project begins next week. There will be short entrance closures on selected days, and we'll send at least an hour's notice before any closure. Please keep an eye on your email and the portal for updates.

## HVAC sensor installs for remaining units

We're continuing the HVAC sensor program. If your unit is on the list and you haven't yet scheduled your install, please contact the management office. The install takes about 45 minutes per unit.`,
    category: 'General',
    publishedAt: daysFromNow(0),
    pinned: true,
    authorName: 'Demo General Manager',
    authorTitle: 'General Manager',
  },
  {
    id: 'ann-town-hall-recap',
    title: 'Town Hall Recap: Fire safety, high-rise procedures, and what is next',
    body: `Thank you to everyone who joined us for the Town Hall on ${weekdayName(daysFromNow(-3))}. It was great to see such a strong turnout.

Our guest speaker from the Flower Mound Fire Department walked us through high-rise emergency procedures, including evacuation protocols, shelter-in-place scenarios, and what to expect when fire crews arrive. The presentation sparked some excellent questions from residents.

We've attached the slides from the evening, a one-page FAQ on high-rise fire safety, and our implementation plan for the safety recommendations discussed. The implementation plan is a living document — we'll update it as items are completed.

If you have follow-up questions, don't hesitate to reach out.`,
    category: 'Safety',
    publishedAt: daysFromNow(-2),
    pinned: false,
    authorName: 'Demo Lifestyle Manager',
    authorTitle: 'Lifestyle Manager',
    attachments: [
      { id: 'att-town-hall-slides', title: 'Town Hall — Fire Safety Slides.pdf', fileSizeLabel: '2.4 MB' },
      { id: 'att-high-rise-faqs', title: 'High-Rise Fire Safety — Resident FAQ.pdf', fileSizeLabel: '320 KB' },
      { id: 'att-implementation-plan', title: 'Safety Implementation Plan.pdf', fileSizeLabel: '185 KB' },
    ],
  },
  {
    id: 'ann-water-bill-audit',
    title: 'Water bill & meter audit: what to expect this month',
    body: `During a routine meter audit, we discovered that several water meters had dead batteries and under-reported usage for approximately three months. The meters have since been replaced.

**What this means for your bill:** Some residents may see a higher-than-usual water charge this month as we reconcile the under-reported usage. This is a one-time catch-up — going forward, the new meters will read accurately.

Credits from a prior incorrect bill have already been applied to affected accounts.

If you have questions about your account or believe there's an error, please contact the management office and we'll review it with you.`,
    category: 'Billing',
    publishedAt: daysFromNow(-4),
    pinned: false,
    authorName: 'Demo General Manager',
    authorTitle: 'General Manager',
  },
  {
    id: 'ann-monthly-events-preview',
    title: 'This month at Lakeside: events preview',
    body: `There's a lot happening in the coming weeks. Here are a few highlights:

- **Wine Tasting** in the Billiards Lounge — RSVP required, limited to 30 guests.
- **Awards Watch Party** — potluck in the Billiards Lounge and Media Room.
- **Holiday Stroll** through the Village — starts in the Billiards Lounge, RSVP required.
- **Fitness Friday** — 9 AM, location to be announced.
- **Cooking Class** in the Catering Kitchen — bring your own supplies.

Check the Events section for the full schedule and RSVP links. We look forward to seeing you there!`,
    category: 'General',
    publishedAt: daysFromNow(-5),
    pinned: false,
    authorName: 'Demo Lifestyle Manager',
    authorTitle: 'Lifestyle Manager',
  },
  {
    id: 'ann-garage-epoxy-notice',
    title: '2nd-floor garage epoxy: entrance closures next week',
    body: `The 2nd-floor garage epoxy project begins next week. During the application and curing period, the 2nd-floor garage entrance will experience **intermittent closures**.

We will send at least **one hour's notice** before any closure via email and the portal. Vehicles in the 2nd-floor garage during closures will not be able to enter or exit until the entrance reopens.

If you typically park on the 2nd floor, consider using the surface lot or another garage level during this period. Thank you for your understanding.`,
    category: 'Projects',
    publishedAt: daysFromNow(-1),
    pinned: false,
    authorName: 'Demo General Manager',
    authorTitle: 'General Manager',
  },
  {
    id: 'ann-hot-tub-temp',
    title: 'Hot tubs back to normal temperature',
    body: `The hot tubs are back to their normal temperature after a brief maintenance cycle. Both hot tubs are open and available during regular pool hours.

Thank you for your patience while we completed this maintenance.`,
    category: 'Maintenance',
    publishedAt: daysFromNow(-3),
    pinned: false,
    authorName: 'Demo General Manager',
    authorTitle: 'General Manager',
  },
  {
    id: 'ann-board-meeting-reminder',
    title: 'Board meeting reminder: agenda now available',
    body: `The next board meeting is coming up. The agenda includes the 2027 budget discussion, the garage epoxy project timeline, and a review of the recent town hall safety recommendations.

The agenda and previous meeting minutes are available in the Documents section under **Meetings**.

All owners are welcome to attend. Please review the agenda beforehand if you plan to bring questions.`,
    category: 'Board',
    publishedAt: daysFromNow(-6),
    pinned: false,
    authorName: 'Demo Board Secretary',
    authorTitle: 'Board Secretary',
  },
  {
    id: 'ann-vendor-popup-car-detailing',
    title: 'Vendor pop-up: mobile car detailing this week',
    body: `A mobile car detailing vendor will be on-site this week offering interior and exterior detailing at resident rates.

**No RSVP needed** — just come down during the scheduled window and book directly with the vendor. First come, first served.

See the Events section for the date and time.`,
    category: 'General',
    publishedAt: daysFromNow(-2),
    pinned: false,
    authorName: 'Demo Lifestyle Manager',
    authorTitle: 'Lifestyle Manager',
  },
];

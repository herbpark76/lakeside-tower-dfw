import type { Announcement } from '../data/types';

export const mockAnnouncements: Announcement[] = [
  {
    id: 'ann-pool-season',
    title: 'Pool hours shift to weekend-only after Labor Day',
    body: `Starting the week after Labor Day, the pool and hot tub will be open **Saturday and Sunday only**, from 8 AM to 8 PM, weather permitting.

The pool will close for the season on **October 15**. Cabanas can still be reserved through the concierge until then.

If you have questions, reach out to the board.`,
    category: 'General',
    publishedAt: '2026-09-15',
    pinned: true,
    author: 'Demo Board Member',
  },
  {
    id: 'ann-fire-alarm-test',
    title: 'Fire alarm system testing — September 28',
    body: `The fire alarm system will be tested on **Sunday, September 28** between 9 AM and 11 AM.

You will hear brief alarms during this window. No evacuation is required. This is a routine annual test required by the Town of Flower Mound.

If you have guests or pets sensitive to loud sounds, please plan accordingly.`,
    category: 'Maintenance',
    publishedAt: '2026-09-20',
    pinned: true,
    author: 'Sample Building Manager',
  },
  {
    id: 'ann-board-meeting-sep',
    title: 'Board meeting minutes — September 10',
    body: `The September board meeting covered the annual budget review, pool renovations discussion, and the upcoming holiday lighting plan.

Minutes are available in the Documents section under **Meeting Minutes**.

The next board meeting is scheduled for **October 8 at 6 PM** in the club room.`,
    category: 'Board',
    publishedAt: '2026-09-12',
    pinned: false,
    author: 'Demo Board Member',
  },
  {
    id: 'ann-social-hour-oct',
    title: 'Fall social hour on the terrace — October 4',
    body: `Join your neighbors for a fall social hour on the terrace overlooking the lake.

**Friday, October 4, 5:30 PM to 7 PM**

Wine, beer, and light bites provided. Please RSVP through the concierge by October 1 so we can plan accordingly.`,
    category: 'Social',
    publishedAt: '2026-09-18',
    pinned: false,
    author: 'Sample Social Committee',
  },
  {
    id: 'ann-garage-cleaning',
    title: 'Garage floor cleaning — September 30',
    body: `The garage will be pressure-washed on **Monday, September 30**. Please move your vehicle to the surface lot by 8 AM that morning.

The garage will reopen by 5 PM. Thank you for your patience.`,
    category: 'Maintenance',
    publishedAt: '2026-09-08',
    pinned: false,
    author: 'Sample Building Manager',
  },
  {
    id: 'ann-welcome-new-residents',
    title: 'Welcome to our newest residents',
    body: `We are pleased to welcome three new families who moved in this summer. If you see a new face in the elevator, please say hello.

A neighborhood directory is available in the portal under **Directory**.`,
    category: 'General',
    publishedAt: '2026-08-22',
    pinned: false,
    author: 'Demo Board Member',
  },
  {
    id: 'ann-budget-preview',
    title: '2027 budget preview now available',
    body: `The draft 2027 association budget is available for review in the **Documents** section under Financials.

The board will discuss it at the October 8 meeting. Owners are encouraged to review it beforehand and bring questions.

Written comments can be submitted to the board through the contact form.`,
    category: 'Board',
    publishedAt: '2026-08-15',
    pinned: false,
    author: 'Demo Board Treasurer',
  },
  {
    id: 'ann-summer-photos',
    title: 'Summer photo contest winners',
    body: `Thank you to everyone who submitted photos for the summer photo contest. The winning shots will be displayed in the club room through October.

Congratulations to **Unit 302**, **Unit 701**, and **Unit 1102** for their winning entries.`,
    category: 'Social',
    publishedAt: '2026-07-28',
    pinned: false,
    author: 'Sample Social Committee',
  },
];

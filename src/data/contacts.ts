export interface ContactEntry {
  id: string;
  name: string;
  for: string;
  phone?: string;
  email?: string;
  hours?: string;
  note?: string;
  sample: true; // BOARD: replace
}

export const contacts: ContactEntry[] = [
  {
    id: 'board',
    name: 'Board of Directors',
    for: 'Owner questions, governance, this website.',
    email: 'board@lakesidetower.com',
    sample: true, // BOARD: replace
  },
  {
    id: 'management',
    name: 'Management office, FirstService Residential',
    for: 'Accounts, billing, maintenance requests, documents.',
    phone: '(972) 555-0142',
    email: 'manager@lakesidetower.com',
    hours: 'Mon–Fri, 9 am – 5 pm',
    sample: true, // BOARD: replace
  },
  {
    id: 'frontdesk',
    name: 'Front desk & concierge',
    for: 'Deliveries, guest access, day-to-day help.',
    phone: '(972) 555-0100',
    hours: '24 hours',
    sample: true, // BOARD: replace
  },
  {
    id: 'buying',
    name: 'Buying at Lakeside Tower',
    for: 'Questions about residences and resales.',
    email: 'residences@lakesidetower.com',
    note: "The association doesn't sell residences, but we're happy to point you in the right direction.",
    sample: true, // BOARD: replace
  },
];

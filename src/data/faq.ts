export interface FaqItem {
  question: string;
  answer: string;
  sample: true; // BOARD: replace
}

export interface FaqCategory {
  id: string;
  label: string;
  items: FaqItem[];
}

export const faqCategories: FaqCategory[] = [
  {
    id: 'buying-ownership',
    label: 'Buying & ownership',
    items: [
      {
        question: 'How do I buy a residence?',
        answer:
          'Residences are sold through resale, via licensed real estate agents. The association doesn\u2019t list or sell units, but the board can point you to current listings.',
        sample: true, // BOARD: replace
      },
      {
        question: 'What do the monthly association dues cover?',
        answer:
          "Dues depend on the residence's size. They cover the 24-hour front desk, building insurance, amenities, common-area utilities, maintenance and reserves.",
        sample: true, // BOARD: replace
      },
      {
        question: 'Is there a transfer fee or resale certificate?',
        answer:
          'Yes. The management office prepares the resale certificate, and a one-time transfer fee is due at closing.',
        sample: true, // BOARD: replace
      },
    ],
  },
  {
    id: 'pets',
    label: 'Pets',
    items: [
      {
        question: 'Are pets allowed?',
        answer:
          "Yes. Up to two dogs or cats per residence. Pets must be leashed in common areas. There's a dog park and a wash station on site.",
        sample: true, // BOARD: replace
      },
    ],
  },
  {
    id: 'parking',
    label: 'Parking',
    items: [
      {
        question: 'How does parking work?',
        answer:
          'Each residence has two reserved spaces in the attached garage. Guests use visitor parking at the front drive.',
        sample: true, // BOARD: replace
      },
      {
        question: 'Is there EV charging?',
        answer:
          "Owners may install a charger in their reserved space, with the board's approval.",
        sample: true, // BOARD: replace
      },
    ],
  },
  {
    id: 'guests',
    label: 'Guests',
    items: [
      {
        question: 'Can I book a guest suite?',
        answer:
          'Yes. Owners book guest suites through the front desk, up to 60 days ahead.',
        sample: true, // BOARD: replace
      },
      {
        question: 'How do guests get in?',
        answer:
          'Register guests with the front desk. The concierge will let them in and call up to you.',
        sample: true, // BOARD: replace
      },
    ],
  },
  {
    id: 'leasing',
    label: 'Leasing',
    items: [
      {
        question: 'Can I lease my residence?',
        answer:
          'Yes. Leases must run at least 12 months, and the tenant has to be registered with the management office before moving in.',
        sample: true, // BOARD: replace
      },
    ],
  },
  {
    id: 'moving-in',
    label: 'Moving in',
    items: [
      {
        question: 'How do I schedule a move?',
        answer:
          'Reserve the service elevator through the management office at least 7 days ahead. Moves run Mon\u2013Sat, 8 am \u2013 5 pm. Movers need a certificate of insurance on file.',
        sample: true, // BOARD: replace
      },
    ],
  },
  {
    id: 'renovations',
    label: 'Renovations',
    items: [
      {
        question: 'Can I renovate my residence?',
        answer:
          'Yes. Most work needs architectural review first. Contractors work weekdays, 8 am \u2013 5 pm.',
        sample: true, // BOARD: replace
      },
    ],
  },
];

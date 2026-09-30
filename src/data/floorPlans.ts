export interface FloorPlan {
  id: string;
  name: string;
  beds: string;
  baths: string;
  sqft: string;
  balcony: string;
  floors: string;
  exposure: string;
  highlights: string[];
  planImage: string | null;
  sample: true; // BOARD: replace
}

export const floorPlans: FloorPlan[] = [
  {
    id: 'cove',
    name: 'The Cove',
    beds: '2 bed',
    baths: '2.5 bath + study',
    sqft: '~1,350 sq ft',
    balcony: 'Balcony ~220 sq ft',
    floors: 'Floors 2–8',
    exposure: 'South lake view',
    highlights: [
      'Private elevator foyer',
      'Folding glass wall to balcony',
      "Chef's kitchen with island",
    ],
    planImage: null,
    sample: true, // BOARD: replace
  },
  {
    id: 'shoreline',
    name: 'The Shoreline',
    beds: '3 bed',
    baths: '3.5 bath',
    sqft: '~2,400 sq ft',
    balcony: 'Balcony ~380 sq ft',
    floors: 'Floors 3–12',
    exposure: 'Southwest lake view',
    highlights: [
      'Private elevator foyer',
      'Walk-in pantry off kitchen',
      'Primary suite with lake-facing sitting area',
    ],
    planImage: null,
    sample: true, // BOARD: replace
  },
  {
    id: 'horizon',
    name: 'The Horizon',
    beds: '3 bed + media room',
    baths: '3.5 bath',
    sqft: '~3,200 sq ft',
    balcony: 'Wraparound balcony',
    floors: 'Floors 9–14',
    exposure: 'Lake and sunset views',
    highlights: [
      'Wraparound balcony with sunset exposure',
      'Media room with wet bar',
      'Separate guest quarters',
    ],
    planImage: null,
    sample: true, // BOARD: replace
  },
  {
    id: 'penthouse',
    name: 'The Penthouse Collection',
    beds: '4 bed',
    baths: '4.5 bath',
    sqft: 'up to ~5,800 sq ft',
    balcony: 'Full-floor terraces',
    floors: 'Floors 15–16',
    exposure: 'Full-floor lake views',
    highlights: [
      'Full-floor living, one residence per floor',
      'Private elevator entry',
      'Service kitchen and butler’s pantry',
    ],
    planImage: null,
    sample: true, // BOARD: replace
  },
];

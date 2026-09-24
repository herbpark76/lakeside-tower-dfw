export type Category =
  | 'Dining'
  | 'Drinks'
  | 'Sweets & Coffee'
  | 'Entertainment'
  | 'Shops & Services'
  | 'Outdoors';

export interface Business {
  name: string;
  category: Category;
}

export interface MapPlace {
  id: string;
  label: string;
  address: string;
  lat: number;
  lng: number;
  walkMinutes: number;
  businesses: Business[];
  note?: string;
  isTower?: boolean;
}

export const towerLocation = {
  lat: 32.98822,
  lng: -97.06793,
  address: '2800 Lakeside Pkwy, Flower Mound, TX 75022',
};

export const towerPlace: MapPlace = {
  id: 'tower',
  label: 'Lakeside Tower',
  address: '2800 Lakeside Pkwy',
  lat: 32.98822,
  lng: -97.06793,
  walkMinutes: 0,
  businesses: [],
  isTower: true,
};

export const mapPlaces: MapPlace[] = [
  {
    id: '2600-lakeside',
    label: '2600 / 2601 Lakeside Pkwy',
    address: '2600 Lakeside Pkwy, Flower Mound, TX 75022',
    lat: 32.99317,
    lng: -97.06731,
    walkMinutes: 12,
    businesses: [
      { name: 'The Tavern at Lakeside', category: 'Dining' },
      { name: 'Sakhuu Thai', category: 'Dining' },
      { name: 'Clink Wine Bar & Bites', category: 'Drinks' },
      { name: 'Touring Chocolatier', category: 'Sweets & Coffee' },
      { name: 'Trailhead Running Supply', category: 'Shops & Services' },
    ],
  },
  {
    id: '2500-lakeside',
    label: '2500 / 2501 Lakeside Pkwy',
    address: '2500 Lakeside Pkwy, Flower Mound, TX 75022',
    lat: 32.99396,
    lng: -97.06561,
    walkMinutes: 13,
    businesses: [
      { name: "Mena's Tex-Mex Grill & Cantina", category: 'Dining' },
      { name: "Flurry's Lakeside", category: 'Sweets & Coffee' },
      { name: 'Cadence Cyclery', category: 'Shops & Services' },
    ],
  },
  {
    id: '2450-lakeside',
    label: '2450 / 2451 Lakeside Pkwy',
    address: '2450 Lakeside Pkwy, Flower Mound, TX 75022',
    lat: 32.99425,
    lng: -97.06486,
    walkMinutes: 13,
    businesses: [
      { name: 'Mio Nonno Trattoria', category: 'Dining' },
      { name: 'Branded Bowls', category: 'Dining' },
      { name: 'Bloom-A-Round Luxury Florals', category: 'Shops & Services' },
      { name: "Briesly's Boutique", category: 'Shops & Services' },
      { name: 'In the Box Pack & Ship', category: 'Shops & Services' },
    ],
  },
  {
    id: '2400-lakeside',
    label: '2400 / 2401 Lakeside Pkwy',
    address: '2400 Lakeside Pkwy, Flower Mound, TX 75022',
    lat: 32.99447,
    lng: -97.06422,
    walkMinutes: 14,
    businesses: [
      { name: '1845 Taste Texas', category: 'Dining' },
      { name: 'Egg Farm Cafe', category: 'Dining' },
      { name: 'Vivo Wood Fire Pizzeria', category: 'Dining' },
      { name: 'Epic Gelato & Craft Coffee', category: 'Sweets & Coffee' },
      { name: 'Z Dry Cleaners', category: 'Shops & Services' },
    ],
  },
  {
    id: '901-long-prairie',
    label: '901 Long Prairie Rd',
    address: '901 Long Prairie Rd, Flower Mound, TX 75028',
    lat: 32.99468,
    lng: -97.06410,
    walkMinutes: 15,
    businesses: [
      { name: 'Hanaya Sushi, Hibachi & Ramen', category: 'Dining' },
      { name: 'Del Campo Empanadas', category: 'Dining' },
      { name: 'Lakeside Donuts', category: 'Sweets & Coffee' },
      { name: 'Starbucks', category: 'Sweets & Coffee' },
    ],
  },
  {
    id: 'moviehouse',
    label: 'Moviehouse & Eatery',
    address: '951 Long Prairie Rd, Flower Mound, TX 75028',
    lat: 32.99581,
    lng: -97.06576,
    walkMinutes: 16,
    businesses: [
      { name: 'Moviehouse & Eatery', category: 'Entertainment' },
    ],
  },
  {
    id: 'northshore-trail',
    label: 'Northshore Trail & Lakeside Boardwalk',
    address: '2599 Edgemere Rd, Flower Mound, TX 75022',
    lat: 32.98882,
    lng: -97.06814,
    walkMinutes: 4,
    businesses: [
      { name: 'Northshore Trail & Lakeside Boardwalk', category: 'Outdoors' },
    ],
    note: '22 miles of trail along Lake Grapevine\u2019s north shore.',
  },
];

export const allPlaces: MapPlace[] = [towerPlace, ...mapPlaces];

export const filterCategories: ('All' | Category)[] = [
  'All',
  'Dining',
  'Drinks',
  'Sweets & Coffee',
  'Entertainment',
  'Shops & Services',
  'Outdoors',
];

export const SHOW_LISTINGS = true;

export interface Listing {
  id: string;
  name: string;
  beds: string;
  baths: string;
  sqft: string;
  exposure: string;
  price: string;
  listedBy: string;
  sample: true; // BOARD: replace
}

export const listings: Listing[] = [
  {
    id: 'residence-1203',
    name: 'Residence 1203',
    beds: '3 bed',
    baths: '3.5 bath',
    sqft: '~2,450 sq ft',
    exposure: 'Southwest lake view',
    price: '$1,495,000',
    listedBy: 'Listed with: Sample Realty Group',
    sample: true, // BOARD: replace
  },
  {
    id: 'residence-704',
    name: 'Residence 704',
    beds: '2 bed',
    baths: '2.5 bath',
    sqft: '~1,400 sq ft',
    exposure: 'South view',
    price: 'Price on request',
    listedBy: 'Listed with: Sample Realty Group',
    sample: true, // BOARD: replace
  },
];

import type { Img } from '@/components/Img';

type ImageSlug = Parameters<typeof Img>[0]['slug'];

export type GalleryCategory =
  | 'The View'
  | 'The Tower'
  | 'Residences'
  | 'Amenities'
  | 'The Village'
  | 'The Trail';

export interface GalleryPhoto {
  src: ImageSlug;
  alt: string;
  caption: string;
  category: GalleryCategory;
  orientation: 'landscape' | 'portrait';
}

export const categoryOrder: GalleryCategory[] = [
  'The View',
  'The Tower',
  'Residences',
  'Amenities',
  'The Village',
  'The Trail',
];

export const galleryPhotos: GalleryPhoto[] = [
  {
    src: 'hero-sunset',
    alt: 'Sunset over Lake Grapevine from Lakeside Tower',
    caption: 'Sunset over Lake Grapevine',
    category: 'The View',
    orientation: 'landscape',
  },
  {
    src: 'lake-panorama',
    alt: 'Panoramic view of Lake Grapevine from the upper floors of Lakeside Tower',
    caption: 'The lake from the upper floors',
    category: 'The View',
    orientation: 'landscape',
  },
  {
    src: 'balcony-sunset',
    alt: 'Sunset over Lake Grapevine from a balcony at Lakeside Tower',
    caption: 'The light you come home to',
    category: 'The View',
    orientation: 'portrait',
  },
  {
    src: 'tower-aerial',
    alt: 'Aerial view of Lakeside Tower on the north shore of Lake Grapevine',
    caption: 'Lakeside Tower on the north shore',
    category: 'The Tower',
    orientation: 'landscape',
  },
  {
    src: 'village-street',
    alt: 'The street and storefronts of Lakeside Village at the foot of the tower',
    caption: 'Lakeside Village',
    category: 'The Village',
    orientation: 'portrait',
  },
  {
    src: 'village-evening',
    alt: 'Evening atmosphere on the patio at Lakeside Village',
    caption: 'Evening on the patio',
    category: 'The Village',
    orientation: 'landscape',
  },
  {
    src: 'village-daylight',
    alt: 'Daytime dining at Lakeside Village',
    caption: 'Lunch downstairs',
    category: 'The Village',
    orientation: 'landscape',
  },
  {
    src: 'village-dining',
    alt: 'A restaurant table set for dinner at Lakeside Village',
    caption: 'Dinner, on foot',
    category: 'The Village',
    orientation: 'landscape',
  },
  {
    src: 'village-signage',
    alt: 'The Tavern at Lakeside signage at Lakeside Village',
    caption: 'The Tavern at Lakeside',
    category: 'The Village',
    orientation: 'landscape',
  },
  {
    src: 'trail-shoreline',
    alt: 'The Northshore Trail beginning at the edge of Lakeside Tower along Lake Grapevine',
    caption: 'Where the Northshore Trail begins',
    category: 'The Trail',
    orientation: 'landscape',
  },
  {
    src: 'trail-woods',
    alt: 'Light through the trees on the Northshore Trail',
    caption: 'Twenty-two miles of shade',
    category: 'The Trail',
    orientation: 'landscape',
  },
];

export const nonEmptyCategories: GalleryCategory[] = categoryOrder.filter((cat) =>
  galleryPhotos.some((p) => p.category === cat)
);

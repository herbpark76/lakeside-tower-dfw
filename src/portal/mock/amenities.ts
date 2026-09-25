import type { AmenityStatus } from '../data/types';
import {
  daysFromNow,
  nextWeekdayDate,
} from '../utils/dateUtils';

// Thursday = 4
const nextThursday = nextWeekdayDate(4);

export const mockAmenityStatus: AmenityStatus[] = [
  {
    id: 'amenity-pool',
    amenity: 'Pool',
    status: 'closed',
    message: 'Closed for pump replacement',
    until: nextThursday,
    updatedAt: daysFromNow(-1),
  },
  {
    id: 'amenity-hot-tubs',
    amenity: 'Hot Tubs',
    status: 'open',
    message: 'Back to normal temperature',
    updatedAt: daysFromNow(-3),
  },
  {
    id: 'amenity-fitness',
    amenity: 'Fitness Center',
    status: 'open',
    updatedAt: daysFromNow(-7),
  },
  {
    id: 'amenity-garage-2nd',
    amenity: '2nd Floor Garage Entrance',
    status: 'limited',
    message: 'Intermittent closures this week for epoxy prep',
    updatedAt: daysFromNow(-1),
  },
  {
    id: 'amenity-dog-spa',
    amenity: 'Dog Spa',
    status: 'open',
    updatedAt: daysFromNow(-7),
  },
  {
    id: 'amenity-car-wash',
    amenity: 'Car Wash',
    status: 'open',
    updatedAt: daysFromNow(-7),
  },
];

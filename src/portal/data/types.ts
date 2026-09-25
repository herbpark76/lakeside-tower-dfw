export type AnnouncementCategory =
  | 'General'
  | 'Maintenance'
  | 'Projects'
  | 'Billing'
  | 'Safety'
  | 'Board';

export interface Attachment {
  id: string;
  title: string;
  fileSizeLabel: string;
}

export interface Announcement {
  id: string;
  title: string;
  body: string; // markdown
  category: AnnouncementCategory;
  publishedAt: string; // ISO date
  pinned: boolean;
  authorName: string;
  authorTitle: string;
  updatedAt?: string; // ISO date
  attachments?: Attachment[];
}

export type EventCategory =
  | 'Social'
  | 'Food & Wine'
  | 'Fitness'
  | 'Games'
  | 'Holiday'
  | 'Off-site'
  | 'Meeting'
  | 'Vendor Pop-up';

export type EventStatus = 'scheduled' | 'cancelled';

export interface PortalEvent {
  id: string;
  title: string;
  description: string; // markdown
  category: EventCategory;
  startsAt: string; // ISO datetime
  endsAt?: string; // ISO datetime
  location: string;
  locationTBD?: boolean;
  offsite?: boolean;
  rsvpRequired: boolean;
  rsvpDeadline?: string; // ISO datetime
  capacity?: number;
  allowGuests: boolean;
  potluck?: boolean;
  bringNote?: string;
  externalRsvpUrl?: string;
  organizerName: string;
  status: EventStatus;
}

export type RsvpStatus = 'going' | 'maybe' | 'not_going' | 'waitlist';

export interface Rsvp {
  eventId: string;
  userId: string;
  displayName: string;
  unit: string;
  status: RsvpStatus;
  guests: number;
  potluckItem?: string;
  note?: string;
  respondedAt: string; // ISO datetime
}

export type AmenityStatusType = 'open' | 'closed' | 'limited';

export interface AmenityStatus {
  id: string;
  amenity: string;
  status: AmenityStatusType;
  message?: string;
  until?: string; // ISO date
  updatedAt: string; // ISO date
}

export type ProjectStatus = 'planned' | 'in_progress' | 'complete';

export interface ProjectUpdate {
  date: string; // ISO date
  text: string;
}

export interface Project {
  id: string;
  title: string;
  summary: string;
  status: ProjectStatus;
  updates: ProjectUpdate[];
  targetDate?: string; // ISO date
}

export type DocumentCategory =
  | 'Governing Documents'
  | 'Meetings'
  | 'Safety & Emergency'
  | 'Projects'
  | 'Financials'
  | 'Forms';

export interface PortalDocument {
  id: string;
  title: string;
  category: DocumentCategory;
  date: string; // ISO date
  fileSizeLabel: string;
  updatedAt?: string; // ISO date
  isLivingDocument?: boolean;
  relatedMeetingId?: string;
}

export interface DirectoryEntry {
  id: string;
  displayName: string;
  unit: string;
  email?: string;
  phone?: string;
  isBoard: boolean;
  boardTitle?: string;
  isStaff: boolean;
  staffTitle?: string;
  showInDirectory: boolean;
}

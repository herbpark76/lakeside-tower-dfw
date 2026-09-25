export type AnnouncementCategory = 'General' | 'Maintenance' | 'Board' | 'Social';

export interface Announcement {
  id: string;
  title: string;
  body: string; // markdown
  category: AnnouncementCategory;
  publishedAt: string; // ISO date
  pinned: boolean;
  author: string;
}

export type EventCategory = 'Board' | 'Social' | 'Maintenance' | 'Community';

export interface PortalEvent {
  id: string;
  title: string;
  description: string;
  startsAt: string; // ISO datetime
  endsAt: string; // ISO datetime
  location: string;
  category: EventCategory;
}

export type DocumentCategory =
  | 'Governing Documents'
  | 'Meeting Minutes'
  | 'Financials'
  | 'Forms';

export interface PortalDocument {
  id: string;
  title: string;
  category: DocumentCategory;
  date: string; // ISO date
  fileSizeLabel: string;
}

export interface DirectoryEntry {
  id: string;
  displayName: string;
  unit: string;
  email?: string;
  phone?: string;
  isBoard: boolean;
  boardTitle?: string;
  showInDirectory: boolean;
}

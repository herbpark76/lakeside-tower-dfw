import type {
  Announcement,
  PortalEvent,
  PortalDocument,
  DirectoryEntry,
  Rsvp,
  AmenityStatus,
  Project,
} from './types';

export interface PortalDataSource {
  listAnnouncements(): Promise<Announcement[]>;
  getAnnouncement(id: string): Promise<Announcement | undefined>;
  listEvents(): Promise<PortalEvent[]>;
  getEvent(id: string): Promise<PortalEvent | undefined>;
  listRsvps(eventId: string): Promise<Rsvp[]>;
  setRsvp(eventId: string, rsvp: Rsvp): Promise<void>;
  listAmenityStatus(): Promise<AmenityStatus[]>;
  listProjects(): Promise<Project[]>;
  listDocuments(): Promise<PortalDocument[]>;
  listDirectory(): Promise<DirectoryEntry[]>;
}

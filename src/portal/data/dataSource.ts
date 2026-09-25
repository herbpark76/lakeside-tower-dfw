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
  createEvent(event: PortalEvent): Promise<PortalEvent>;
  updateEvent(id: string, patch: Partial<PortalEvent>): Promise<PortalEvent | undefined>;
  cancelEvent(id: string): Promise<void>;
  duplicateEvent(id: string): Promise<PortalEvent | undefined>;
  listRsvps(eventId: string): Promise<Rsvp[]>;
  setRsvp(eventId: string, rsvp: Rsvp): Promise<Rsvp>;
  listAmenityStatus(): Promise<AmenityStatus[]>;
  listProjects(): Promise<Project[]>;
  listDocuments(): Promise<PortalDocument[]>;
  listDirectory(): Promise<DirectoryEntry[]>;
}

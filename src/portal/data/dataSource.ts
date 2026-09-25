import type {
  Announcement,
  PortalEvent,
  PortalDocument,
  DirectoryEntry,
} from './types';

export interface PortalDataSource {
  listAnnouncements(): Promise<Announcement[]>;
  getAnnouncement(id: string): Promise<Announcement | undefined>;
  listEvents(): Promise<PortalEvent[]>;
  listDocuments(): Promise<PortalDocument[]>;
  listDirectory(): Promise<DirectoryEntry[]>;
}

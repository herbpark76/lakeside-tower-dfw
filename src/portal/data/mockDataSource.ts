import type { PortalDataSource } from './dataSource';
import type {
  Announcement,
  PortalEvent,
  PortalDocument,
  DirectoryEntry,
} from './types';
import { mockAnnouncements } from '../mock/announcements';
import { mockEvents } from '../mock/events';
import { mockDocuments } from '../mock/documents';
import { mockDirectory } from '../mock/directory';

export function createMockDataSource(): PortalDataSource {
  return {
    async listAnnouncements(): Promise<Announcement[]> {
      return [...mockAnnouncements].sort((a, b) => {
        if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
        return b.publishedAt.localeCompare(a.publishedAt);
      });
    },

    async getAnnouncement(id: string): Promise<Announcement | undefined> {
      return mockAnnouncements.find((a) => a.id === id);
    },

    async listEvents(): Promise<PortalEvent[]> {
      return [...mockEvents].sort((a, b) => a.startsAt.localeCompare(b.startsAt));
    },

    async listDocuments(): Promise<PortalDocument[]> {
      return [...mockDocuments].sort((a, b) => b.date.localeCompare(a.date));
    },

    async listDirectory(): Promise<DirectoryEntry[]> {
      return mockDirectory
        .filter((d) => d.showInDirectory)
        .sort((a, b) => a.unit.localeCompare(b.unit, undefined, { numeric: true }));
    },
  };
}

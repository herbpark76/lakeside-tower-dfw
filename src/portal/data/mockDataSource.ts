import type { PortalDataSource } from './dataSource';
import type {
  Announcement,
  PortalEvent,
  PortalDocument,
  DirectoryEntry,
  Rsvp,
  AmenityStatus,
  Project,
} from './types';
import { mockAnnouncements } from '../mock/announcements';
import { mockEvents } from '../mock/events';
import { mockDocuments } from '../mock/documents';
import { mockDirectory } from '../mock/directory';
import { mockRsvps } from '../mock/rsvps';
import { mockAmenityStatus } from '../mock/amenities';
import { mockProjects } from '../mock/projects';

const RSVP_STORAGE_KEY = 'lakeside_portal_demo_rsvps';

function readStoredRsvps(): Record<string, Rsvp[]> {
  try {
    const raw = localStorage.getItem(RSVP_STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, Rsvp[]>;
  } catch {
    return {};
  }
}

function writeStoredRsvps(data: Record<string, Rsvp[]>): void {
  try {
    localStorage.setItem(RSVP_STORAGE_KEY, JSON.stringify(data));
  } catch {
    // localStorage may be unavailable; ignore.
  }
}

function getMergedRsvps(): Rsvp[] {
  const stored = readStoredRsvps();
  const storedList = Object.values(stored).flat();
  // Merge: stored RSVPs override mock RSVPs with the same eventId+userId
  const merged: Rsvp[] = [...mockRsvps];
  for (const sr of storedList) {
    const idx = merged.findIndex(
      (m) => m.eventId === sr.eventId && m.userId === sr.userId,
    );
    if (idx >= 0) {
      merged[idx] = sr;
    } else {
      merged.push(sr);
    }
  }
  return merged;
}

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
      return [...mockEvents].sort((a, b) =>
        a.startsAt.localeCompare(b.startsAt),
      );
    },

    async getEvent(id: string): Promise<PortalEvent | undefined> {
      return mockEvents.find((e) => e.id === id);
    },

    async listRsvps(eventId: string): Promise<Rsvp[]> {
      return getMergedRsvps().filter((r) => r.eventId === eventId);
    },

    async setRsvp(eventId: string, rsvp: Rsvp): Promise<void> {
      const stored = readStoredRsvps();
      if (!stored[eventId]) stored[eventId] = [];
      const idx = stored[eventId].findIndex(
        (r) => r.userId === rsvp.userId,
      );
      if (idx >= 0) {
        stored[eventId][idx] = rsvp;
      } else {
        stored[eventId].push(rsvp);
      }
      writeStoredRsvps(stored);
    },

    async listAmenityStatus(): Promise<AmenityStatus[]> {
      return [...mockAmenityStatus];
    },

    async listProjects(): Promise<Project[]> {
      return [...mockProjects];
    },

    async listDocuments(): Promise<PortalDocument[]> {
      return [...mockDocuments].sort((a, b) =>
        b.date.localeCompare(a.date),
      );
    },

    async listDirectory(): Promise<DirectoryEntry[]> {
      const sorted = [...mockDirectory].sort((a, b) => {
        if (a.isStaff && !b.isStaff) return -1;
        if (!a.isStaff && b.isStaff) return 1;
        if (a.isBoard && !b.isBoard) return -1;
        if (!a.isBoard && b.isBoard) return 1;
        return a.unit.localeCompare(b.unit, undefined, { numeric: true });
      });
      return sorted.filter((d) => d.showInDirectory);
    },
  };
}

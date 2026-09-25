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
const EVENT_STORAGE_KEY = 'lakeside_portal_demo_events';

function readStored<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function writeStored(key: string, data: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // localStorage may be unavailable; ignore.
  }
}

// --- RSVP storage ---
type StoredRsvps = Record<string, Rsvp[]>;

function readStoredRsvps(): StoredRsvps {
  return readStored<StoredRsvps>(RSVP_STORAGE_KEY) ?? {};
}

function getMergedRsvps(): Rsvp[] {
  const stored = readStoredRsvps();
  const storedList = Object.values(stored).flat();
  const merged: Rsvp[] = [...mockRsvps];
  for (const sr of storedList) {
    const idx = merged.findIndex(
      (m) => m.eventId === sr.eventId && m.userId === sr.userId,
    );
    if (idx >= 0) merged[idx] = sr;
    else merged.push(sr);
  }
  return merged;
}

// --- Event storage (staff-created/edited events overlay) ---
type StoredEvents = {
  created: Record<string, PortalEvent>;
  patches: Record<string, Partial<PortalEvent>>;
  cancelled: string[];
};

function readStoredEvents(): StoredEvents {
  return (
    readStored<StoredEvents>(EVENT_STORAGE_KEY) ?? {
      created: {},
      patches: {},
      cancelled: [],
    }
  );
}

function writeStoredEvents(data: StoredEvents): void {
  writeStored(EVENT_STORAGE_KEY, data);
}

function getMergedEvents(): PortalEvent[] {
  const stored = readStoredEvents();
  const result: PortalEvent[] = [...mockEvents];

  // Apply patches
  for (const [id, patch] of Object.entries(stored.patches)) {
    const idx = result.findIndex((e) => e.id === id);
    if (idx >= 0) {
      result[idx] = { ...result[idx], ...patch };
    }
  }

  // Add created events
  for (const evt of Object.values(stored.created)) {
    const idx = result.findIndex((e) => e.id === evt.id);
    if (idx >= 0) {
      result[idx] = evt;
    } else {
      result.push(evt);
    }
  }

  // Apply cancellations last so they cover staff-created events too
  for (const id of stored.cancelled) {
    const idx = result.findIndex((e) => e.id === id);
    if (idx >= 0) {
      result[idx] = { ...result[idx], status: 'cancelled' as const };
    }
  }

  return result;
}

function genId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
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
      return getMergedEvents().sort((a, b) =>
        a.startsAt.localeCompare(b.startsAt),
      );
    },

    async getEvent(id: string): Promise<PortalEvent | undefined> {
      return getMergedEvents().find((e) => e.id === id);
    },

    async createEvent(event: PortalEvent): Promise<PortalEvent> {
      const stored = readStoredEvents();
      const id = event.id || genId('evt');
      const created = { ...event, id };
      stored.created[id] = created;
      writeStoredEvents(stored);
      return created;
    },

    async updateEvent(
      id: string,
      patch: Partial<PortalEvent>,
    ): Promise<PortalEvent | undefined> {
      const stored = readStoredEvents();
      const events = getMergedEvents();
      const existing = events.find((e) => e.id === id);
      if (!existing) return undefined;

      if (stored.created[id]) {
        // Staff-created event: update directly
        stored.created[id] = { ...stored.created[id], ...patch };
      } else {
        // Sample event: store a patch
        stored.patches[id] = { ...stored.patches[id], ...patch };
      }
      writeStoredEvents(stored);
      return { ...existing, ...patch };
    },

    async cancelEvent(id: string): Promise<void> {
      const stored = readStoredEvents();
      if (!stored.cancelled.includes(id)) {
        stored.cancelled.push(id);
      }
      writeStoredEvents(stored);
    },

    async duplicateEvent(id: string): Promise<PortalEvent | undefined> {
      const events = getMergedEvents();
      const original = events.find((e) => e.id === id);
      if (!original) return undefined;

      const newId = genId('evt');
      const copy: PortalEvent = {
        ...original,
        id: newId,
        title: `${original.title} (Copy)`,
        startsAt: '',
        endsAt: undefined,
      };
      const stored = readStoredEvents();
      stored.created[newId] = copy;
      writeStoredEvents(stored);
      return copy;
    },

    async listRsvps(eventId: string): Promise<Rsvp[]> {
      return getMergedRsvps().filter((r) => r.eventId === eventId);
    },

    async setRsvp(eventId: string, rsvp: Rsvp): Promise<Rsvp> {
      // Enforce deadline
      const events = getMergedEvents();
      const event = events.find((e) => e.id === eventId);
      const now = new Date().toISOString();
      const finalRsvp: Rsvp = { ...rsvp, respondedAt: now };

      if (event?.rsvpDeadline) {
        const deadline = new Date(event.rsvpDeadline);
        if (new Date(now) > deadline) {
          // RSVPs are closed — return the RSVP unchanged but don't store
          return finalRsvp;
        }
      }

      // Enforce capacity for "going" status
      if (event?.capacity && event.capacity > 0 && finalRsvp.status === 'going') {
        const allRsvps = getMergedRsvps().filter(
          (r) =>
            r.eventId === eventId &&
            r.userId !== finalRsvp.userId &&
            r.status === 'going',
        );
        const currentGoing = allRsvps.reduce(
          (sum, r) => sum + 1 + r.guests,
          0,
        );
        const newTotal = currentGoing + 1 + finalRsvp.guests;
        if (newTotal > event.capacity) {
          finalRsvp.status = 'waitlist';
        }
      }

      const stored = readStoredRsvps();
      if (!stored[eventId]) stored[eventId] = [];
      const idx = stored[eventId].findIndex(
        (r) => r.userId === finalRsvp.userId,
      );
      if (idx >= 0) stored[eventId][idx] = finalRsvp;
      else stored[eventId].push(finalRsvp);
      writeStored(RSVP_STORAGE_KEY, stored);

      return finalRsvp;
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

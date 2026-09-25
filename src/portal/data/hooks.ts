import { useState, useEffect, useCallback } from 'react';
import { createMockDataSource } from './mockDataSource';
import type {
  Announcement,
  PortalEvent,
  PortalDocument,
  DirectoryEntry,
  Rsvp,
  AmenityStatus,
  Project,
} from './types';

const dataSource = createMockDataSource();

export function useAnnouncements() {
  const [data, setData] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    dataSource.listAnnouncements().then((d) => {
      setData(d);
      setLoading(false);
    });
  }, []);
  return { announcements: data, loading };
}

export function useAnnouncement(id: string | undefined) {
  const [data, setData] = useState<Announcement | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    dataSource.getAnnouncement(id).then((d) => {
      setData(d);
      setLoading(false);
    });
  }, [id]);
  return { announcement: data, loading };
}

export function useEvents() {
  const [data, setData] = useState<PortalEvent[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    dataSource.listEvents().then((d) => {
      setData(d);
      setLoading(false);
    });
  }, []);
  return { events: data, loading };
}

export function useEvent(id: string | undefined) {
  const [data, setData] = useState<PortalEvent | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    dataSource.getEvent(id).then((d) => {
      setData(d);
      setLoading(false);
    });
  }, [id]);
  return { event: data, loading };
}

export function useRsvps(eventId: string | undefined) {
  const [data, setData] = useState<Rsvp[]>([]);
  const [loading, setLoading] = useState(true);
  const refresh = useCallback(() => {
    if (!eventId) {
      setLoading(false);
      return;
    }
    dataSource.listRsvps(eventId).then((d) => {
      setData(d);
      setLoading(false);
    });
  }, [eventId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const submitRsvp = useCallback(
    async (rsvp: Rsvp) => {
      await dataSource.setRsvp(rsvp.eventId, rsvp);
      refresh();
    },
    [refresh],
  );

  return { rsvps: data, loading, submitRsvp };
}

export function useAmenityStatus() {
  const [data, setData] = useState<AmenityStatus[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    dataSource.listAmenityStatus().then((d) => {
      setData(d);
      setLoading(false);
    });
  }, []);
  return { amenities: data, loading };
}

export function useProjects() {
  const [data, setData] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    dataSource.listProjects().then((d) => {
      setData(d);
      setLoading(false);
    });
  }, []);
  return { projects: data, loading };
}

export function useDocuments() {
  const [data, setData] = useState<PortalDocument[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    dataSource.listDocuments().then((d) => {
      setData(d);
      setLoading(false);
    });
  }, []);
  return { documents: data, loading };
}

export function useDirectory() {
  const [data, setData] = useState<DirectoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    dataSource.listDirectory().then((d) => {
      setData(d);
      setLoading(false);
    });
  }, []);
  return { directory: data, loading };
}

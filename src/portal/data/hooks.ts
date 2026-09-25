import { useState, useEffect } from 'react';
import { createMockDataSource } from './mockDataSource';
import type {
  Announcement,
  PortalEvent,
  PortalDocument,
  DirectoryEntry,
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

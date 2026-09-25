import type { PortalEvent } from '../data/types';
import { toDateOnlyInTZ, getYearMonthInTZ } from './format';

const TZ = 'America/Chicago';

export interface CalendarDay {
  date: Date;
  isoDate: string;
  dayOfMonth: number;
  isCurrentMonth: boolean;
  isToday: boolean;
}

export function getCalendarDays(
  year: number,
  month: number,
): CalendarDay[] {
  const firstOfMonth = new Date(year, month, 1);
  const startDay = firstOfMonth.getDay(); // 0=Sun
  const startDate = new Date(firstOfMonth);
  startDate.setDate(startDate.getDate() - startDay);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayIso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const days: CalendarDay[] = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    days.push({
      date: d,
      isoDate: iso,
      dayOfMonth: d.getDate(),
      isCurrentMonth: d.getMonth() === month,
      isToday: iso === todayIso,
    });
  }
  return days;
}

export function getEventsForDay(
  events: PortalEvent[],
  isoDate: string,
): PortalEvent[] {
  return events
    .filter((e) => toDateOnlyInTZ(e.startsAt) === isoDate)
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt));
}

export function getEventsForMonth(
  events: PortalEvent[],
  year: number,
  month: number,
): PortalEvent[] {
  const ym = `${year}-${String(month + 1).padStart(2, '0')}`;
  return events.filter((e) => getYearMonthInTZ(e.startsAt) === ym);
}

export function groupEventsByMonth(
  events: PortalEvent[],
): { yearMonth: string; label: string; events: PortalEvent[] }[] {
  const groups: Record<string, PortalEvent[]> = {};
  for (const e of events) {
    const ym = getYearMonthInTZ(e.startsAt);
    if (!groups[ym]) groups[ym] = [];
    groups[ym].push(e);
  }
  return Object.entries(groups)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([yearMonth, evts]) => {
      const [y, m] = yearMonth.split('-').map(Number);
      const label = new Date(y, m - 1, 1).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      });
      return {
        yearMonth,
        label,
        events: evts.sort((a, b) => a.startsAt.localeCompare(b.startsAt)),
      };
    });
}

// --- ICS file generation ---

function escapeICS(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

function toICSDateTime(isoStr: string): string {
  // Convert to UTC for ICS
  const d = new Date(isoStr);
  const PAD = (n: number) => String(n).padStart(2, '0');
  return `${d.getUTCFullYear()}${PAD(d.getUTCMonth() + 1)}${PAD(d.getUTCDate())}T${PAD(d.getUTCHours())}${PAD(d.getUTCMinutes())}00Z`;
}

export function generateICS(event: PortalEvent): string {
  const dtStart = toICSDateTime(event.startsAt);
  const dtEnd = event.endsAt
    ? toICSDateTime(event.endsAt)
    : toICSDateTime(
        new Date(new Date(event.startsAt).getTime() + 60 * 60 * 1000).toISOString(),
      );

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Lakeside Tower//Portal//EN',
    'BEGIN:VEVENT',
    `UID:${event.id}@lakesidetower.portal`,
    `DTSTAMP:${toICSDateTime(new Date().toISOString())}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${escapeICS(event.title)}`,
    `DESCRIPTION:${escapeICS(event.description.replace(/[#*]/g, ''))}`,
    `LOCATION:${escapeICS(event.locationTBD ? 'Location TBD' : event.location)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  return lines.join('\r\n');
}

export function downloadICS(event: PortalEvent): void {
  const ics = generateICS(event);
  const blob = new Blob([ics], { type: 'text/calendar' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${event.title.replace(/[^a-z0-9]/gi, '_')}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function getGoogleCalendarUrl(event: PortalEvent): string {
  const s = new Date(event.startsAt);
  const e = event.endsAt ? new Date(event.endsAt) : new Date(s.getTime() + 60 * 60 * 1000);
  const fmt = (d: Date) =>
    d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${fmt(s)}/${fmt(e)}`,
    details: event.description.replace(/[#*]/g, ''),
    location: event.locationTBD ? 'Location TBD' : event.location,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

// Centralized date utilities for the portal. All operations are in America/Chicago.
// This is the SINGLE source of truth for day/month keys and date formatting
// used by the month grid, list grouping, flyer, and home page.

const TZ = 'America/Chicago';
const PAD = (n: number) => String(n).padStart(2, '0');

/** Parse an ISO datetime string (or date-only) and return its parts in Chicago tz. */
function tzParts(iso: string): { year: number; month: number; day: number; weekday: number } {
  const d = new Date(iso);
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone: TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
  });
  const parts = fmt.formatToParts(d);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '';
  const weekdayMap: Record<string, number> = {
    Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
  };
  return {
    year: parseInt(get('year'), 10),
    month: parseInt(get('month'), 10),
    day: parseInt(get('day'), 10),
    weekday: weekdayMap[get('weekday')] ?? 0,
  };
}

/** Day key in YYYY-MM-DD format, in Chicago tz. Accepts ISO datetime or date-only. */
export function dayKey(iso: string): string {
  const { year, month, day } = tzParts(iso);
  return `${year}-${PAD(month)}-${PAD(day)}`;
}

/** Month key in YYYY-MM format, in Chicago tz. Accepts ISO datetime or date-only. */
export function monthKey(iso: string): string {
  const { year, month } = tzParts(iso);
  return `${year}-${PAD(month)}`;
}

/** Build a month key from numeric year/month (month is 0-indexed). */
export function monthKeyFromNums(year: number, month: number): string {
  return `${year}-${PAD(month + 1)}`;
}

/** Format a YYYY-MM month key as "October 2026". */
export function formatMonthHeading(ym: string): string {
  const [y, m] = ym.split('-').map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
}

/** Parse a ?month=YYYY-MM URL param. Returns null if invalid. */
export function parseMonthParam(param: string | null): { year: number; month: number } | null {
  if (!param) return null;
  const match = /^(\d{4})-(\d{2})$/.exec(param);
  if (!match) return null;
  const y = parseInt(match[1], 10);
  const m = parseInt(match[2], 10);
  if (m < 1 || m > 12) return null;
  return { year: y, month: m - 1 };
}

/** Build a YYYY-MM-DD key from a Date object (local, not tz-converted — for calendar grid). */
export function dayKeyFromDate(d: Date): string {
  return `${d.getFullYear()}-${PAD(d.getMonth() + 1)}-${PAD(d.getDate())}`;
}

/** Get the weekday (0=Sun) for an ISO datetime in Chicago tz. */
export function weekdayInTZ(iso: string): number {
  return tzParts(iso).weekday;
}

/** Format an ISO datetime as a short time in Chicago tz. */
export function formatTimeInTZ(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: TZ,
  });
}

/** Format an ISO datetime as a short month + day in Chicago tz (e.g. "Oct 3"). */
export function formatMonthDayInTZ(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: TZ,
  });
}

/** Format an ISO date string as a short weekday in Chicago tz (e.g. "Sat"). */
export function formatWeekdayInTZ(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    weekday: 'short',
    timeZone: TZ,
  });
}

/** Format a date-only ISO string (YYYY-MM-DD) as a long date (e.g. "October 3, 2026"). */
export function formatDateLong(iso: string): string {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: TZ,
  });
}

/** Format an ISO datetime as a long weekday + month + day in Chicago tz. */
export function formatWeekdayLongInTZ(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    weekday: 'long',
    timeZone: TZ,
  });
}

/** Get month name from 0-indexed month number. */
export function getMonthName(monthIndex: number): string {
  return new Date(2000, monthIndex, 1).toLocaleDateString('en-US', { month: 'long' });
}

/** Format an ISO datetime range as a human-readable string in Chicago tz. */
export function formatEventRange(start: string, end: string | undefined): string {
  const s = new Date(start);
  const e = end ? new Date(end) : null;
  const sDate = s.toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', timeZone: TZ,
  });
  const sTime = s.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: TZ });
  if (e) {
    const sameDay = dayKey(start) === dayKey(end);
    if (sameDay) {
      const eTime = e.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: TZ });
      return `${sDate}, ${sTime} – ${eTime}`;
    }
    const eDate = e.toLocaleDateString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric', timeZone: TZ,
    });
    const eTime2 = e.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: TZ });
    return `${sDate}, ${sTime} – ${eDate}, ${eTime2}`;
  }
  return sDate;
}

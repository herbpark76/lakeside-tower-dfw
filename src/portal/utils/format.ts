// All dates are displayed in America/Chicago timezone.
const TZ = 'America/Chicago';

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: TZ,
  });
}

export function formatEventDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: TZ,
  });
}

export function formatEventTimeRange(start: string, end: string): string {
  const s = new Date(start);
  const e = end ? new Date(end) : null;
  if (e && s.toDateString() === e.toDateString()) {
    return `${s.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      timeZone: TZ,
    })}, ${s.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: TZ })} – ${e.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: TZ })}`;
  }
  if (!e) {
    return s.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZone: TZ,
    });
  }
  return `${formatEventDate(start)} – ${formatEventDate(end)}`;
}

export function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: TZ,
  });
}

export function formatMonthDay(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: TZ,
  });
}

export function formatWeekday(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    timeZone: TZ,
  });
}

export function formatWeekdayLong(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    timeZone: TZ,
  });
}

export function getMonthName(monthIndex: number): string {
  const d = new Date(2000, monthIndex, 1);
  return d.toLocaleDateString('en-US', { month: 'long' });
}

export function getShortMonthName(monthIndex: number): string {
  const d = new Date(2000, monthIndex, 1);
  return d.toLocaleDateString('en-US', { month: 'short' });
}

/** Get the day-of-month from an ISO datetime string in Chicago timezone. */
export function getDayInTZ(dateStr: string): number {
  const d = new Date(dateStr);
  return parseInt(
    d.toLocaleDateString('en-US', { day: 'numeric', timeZone: TZ }),
  );
}

/** Get YYYY-MM from an ISO datetime in Chicago timezone. */
export function getYearMonthInTZ(dateStr: string): string {
  const d = new Date(dateStr);
  const parts = d
    .toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      timeZone: TZ,
    })
    .split('/');
  return `${parts[2]}-${parts[0]}`;
}

/** Convert an ISO datetime to the date-only ISO string in Chicago tz. */
export function toDateOnlyInTZ(dateStr: string): string {
  const d = new Date(dateStr);
  const parts = d
    .toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      timeZone: TZ,
    })
    .split('/');
  return `${parts[2]}-${parts[0]}-${parts[1]}`;
}

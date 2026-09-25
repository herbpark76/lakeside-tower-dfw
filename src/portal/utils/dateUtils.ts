// All sample dates are generated relative to "today" so the demo always looks current.

const PAD = (n: number) => String(n).padStart(2, '0');

function toISODate(d: Date): string {
  return `${d.getFullYear()}-${PAD(d.getMonth() + 1)}-${PAD(d.getDate())}`;
}

function toISODateTime(d: Date): string {
  return `${toISODate(d)}T${PAD(d.getHours())}:${PAD(d.getMinutes())}`;
}

const TODAY = new Date();
TODAY.setHours(0, 0, 0, 0);

/** Days from today as an ISO date string (time = 00:00). */
export function daysFromNow(days: number): string {
  const d = new Date(TODAY);
  d.setDate(d.getDate() + days);
  return toISODate(d);
}

/** Days from today at a specific hour/minute, as an ISO datetime string. */
export function daysFromNowAt(days: number, hour: number, minute = 0): string {
  const d = new Date(TODAY);
  d.setDate(d.getDate() + days);
  d.setHours(hour, minute, 0, 0);
  return toISODateTime(d);
}

/**
 * Next occurrence of a given weekday (0=Sun … 6=Sat).
 * By default, if today IS that weekday, returns today.
 * If strictlyAfterToday is true, always returns the next occurrence
 * (7 days from today when today is that weekday).
 */
export function nextWeekday(
  weekday: number,
  opts?: { strictlyAfterToday?: boolean },
): Date {
  const d = new Date(TODAY);
  let diff = (weekday - d.getDay() + 7) % 7;
  if (opts?.strictlyAfterToday && diff === 0) {
    diff = 7;
  }
  d.setDate(d.getDate() + diff);
  return d;
}

/** Next occurrence of a given weekday at a specific hour (ISO datetime). */
export function nextWeekdayAt(
  weekday: number,
  hour: number,
  minute = 0,
  opts?: { strictlyAfterToday?: boolean },
): string {
  const d = nextWeekday(weekday, opts);
  d.setHours(hour, minute, 0, 0);
  return toISODateTime(d);
}

/** Next occurrence of a given weekday as an ISO date (no time). */
export function nextWeekdayDate(
  weekday: number,
  opts?: { strictlyAfterToday?: boolean },
): string {
  return toISODate(nextWeekday(weekday, opts));
}

/** Format a date as a weekday name for inline text (e.g. "Thursday"). */
export function weekdayName(isoDate: string): string {
  const d = new Date(isoDate + 'T00:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'long' });
}

/** Format a date as a short weekday + month/day for inline text. */
export function shortDate(isoDate: string): string {
  const d = new Date(isoDate + 'T00:00:00');
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

/** Returns the weekday (0–6) for a given ISO date string. */
export function getWeekday(isoDate: string): number {
  const d = new Date(isoDate + 'T00:00:00');
  return d.getDay();
}

export const TODAY_ISO = toISODate(TODAY);

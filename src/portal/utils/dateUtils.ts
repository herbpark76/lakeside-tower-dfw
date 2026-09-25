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

/** The next occurrence of a given weekday (0=Sun … 6=Sat) at a specific hour. */
export function nextWeekdayAt(weekday: number, hour: number, minute = 0): string {
  const d = new Date(TODAY);
  let diff = (weekday - d.getDay() + 7) % 7;
  if (diff === 0 && d.getDay() === weekday) {
    // If today is that weekday, use today
  }
  d.setDate(d.getDate() + diff);
  d.setHours(hour, minute, 0, 0);
  return toISODateTime(d);
}

/** The next occurrence of a given weekday as an ISO date (no time). */
export function nextWeekdayDate(weekday: number): string {
  const d = new Date(TODAY);
  let diff = (weekday - d.getDay() + 7) % 7;
  d.setDate(d.getDate() + diff);
  return toISODate(d);
}

/** Format a date as a weekday name for inline text (e.g. "Thursday"). */
export function weekdayName(isoDate: string): string {
  const d = new Date(isoDate);
  return d.toLocaleDateString('en-US', { weekday: 'long' });
}

/** Format a date as a short weekday + month/day for inline text. */
export function shortDate(isoDate: string): string {
  const d = new Date(isoDate);
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export const TODAY_ISO = toISODate(TODAY);

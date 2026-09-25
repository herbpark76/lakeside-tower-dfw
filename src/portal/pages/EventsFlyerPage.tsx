import { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Head } from 'vite-react-ssg';
import { Printer, ArrowLeft } from 'lucide-react';
import { PortalLayout } from '../components/PortalLayout';
import { useAuth } from '../auth/AuthContext';
import { useEvents } from '../data/hooks';
import { getEventsForMonth, getCalendarDays } from '../utils/calendarUtils';
import { formatTime, getMonthName } from '../utils/format';
import type { PortalEvent } from '../data/types';

const ACCENT_PRESETS = [
  { name: 'Brass', color: '#8A6F3D', bg: '#F5EEDD' },
  { name: 'Lake Blue', color: '#18323B', bg: '#E0E8EA' },
  { name: 'Holiday Green', color: '#2D6A4F', bg: '#DCEDE4' },
  { name: 'Autumn Rust', color: '#B7541F', bg: '#F0DDD0' },
];

function FlyerContent({
  events,
  year,
  month,
  accent,
}: {
  events: PortalEvent[];
  year: number;
  month: number;
  accent: { name: string; color: string; bg: string };
}) {
  const days = getCalendarDays(year, month);
  const monthEvents = getEventsForMonth(events, year, month);
  const eventDates = new Set(
    monthEvents.map((e) => {
      const d = new Date(e.startsAt);
      const PAD = (n: number) => String(n).padStart(2, '0');
      return `${d.getFullYear()}-${PAD(d.getMonth() + 1)}-${PAD(d.getDate())}`;
    }),
  );

  return (
    <div
      className="mx-auto max-w-[800px] bg-white p-10"
      style={{ borderTop: `4px solid ${accent.color}` }}
    >
      {/* Heading */}
      <div className="text-center">
        <p
          className="text-[11px] font-bold uppercase tracking-[0.2em]"
          style={{ color: accent.color }}
        >
          The Lakeside Tower · Save the Dates
        </p>
        <h1
          className="serif text-5xl mt-2"
          style={{ color: '#102932' }}
        >
          {getMonthName(month)}
        </h1>
        <p
          className="text-2xl serif mt-1"
          style={{ color: accent.color }}
        >
          {year}
        </p>
      </div>

      {/* Mini calendar */}
      <div className="mt-6">
        <div className="grid grid-cols-7 gap-0.5">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
            <div
              key={i}
              className="py-1 text-center text-[10px] font-bold uppercase"
              style={{ color: accent.color }}
            >
              {d}
            </div>
          ))}
          {days.map((day, i) => (
            <div
              key={i}
              className="flex h-7 items-center justify-center text-[11px]"
              style={{
                color: day.isCurrentMonth ? '#18323B' : '#999',
                backgroundColor: eventDates.has(day.isoDate)
                  ? accent.bg
                  : 'transparent',
                borderRadius: eventDates.has(day.isoDate) ? '50%' : '0',
                fontWeight: eventDates.has(day.isoDate) ? 700 : 400,
              }}
            >
              {day.dayOfMonth}
            </div>
          ))}
        </div>
      </div>

      {/* Event rows */}
      <div className="mt-8 space-y-3">
        {monthEvents.length === 0 && (
          <p className="text-center text-[14px]" style={{ color: '#999' }}>
            No events scheduled for this month.
          </p>
        )}
        {monthEvents.map((e) => {
          const d = new Date(e.startsAt);
          const weekday = d.toLocaleDateString('en-US', {
            weekday: 'short',
            timeZone: 'America/Chicago',
          });
          const dayNum = d.toLocaleDateString('en-US', {
            day: 'numeric',
            timeZone: 'America/Chicago',
          });
          return (
            <div
              key={e.id}
              className="flex items-center gap-4 border-b pb-3"
              style={{ borderColor: `${accent.color}20` }}
            >
              {/* Day number */}
              <div
                className="flex shrink-0 flex-col items-center justify-center w-14 rounded-md py-1"
                style={{ backgroundColor: accent.bg }}
              >
                <span
                  className="text-[10px] font-bold uppercase"
                  style={{ color: accent.color }}
                >
                  {weekday}
                </span>
                <span
                  className="serif text-2xl leading-none"
                  style={{ color: '#102932' }}
                >
                  {dayNum}
                </span>
              </div>

              {/* Title + location + badges */}
              <div className="min-w-0 flex-1">
                <p
                  className="serif text-base leading-snug"
                  style={{ color: '#102932' }}
                >
                  {e.title}
                </p>
                <p className="text-[12px] mt-0.5" style={{ color: '#666' }}>
                  {e.locationTBD ? 'Location TBD' : e.location}
                </p>
                <div className="mt-1 flex gap-2">
                  {e.rsvpRequired && (
                    <span
                      className="rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider"
                      style={{ color: accent.color, backgroundColor: accent.bg }}
                    >
                      RSVP required
                    </span>
                  )}
                  {e.potluck && (
                    <span
                      className="rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider"
                      style={{ color: accent.color, backgroundColor: accent.bg }}
                    >
                      Potluck
                    </span>
                  )}
                </div>
              </div>

              {/* Time */}
              <div
                className="shrink-0 text-right text-[13px] font-semibold"
                style={{ color: accent.color }}
              >
                {formatTime(e.startsAt)}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p
          className="text-[11px] uppercase tracking-wider"
          style={{ color: '#999' }}
        >
          The Lakeside Tower · Owner Portal
        </p>
      </div>
    </div>
  );
}

export function EventsFlyerPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { events } = useEvents();
  const { user } = useAuth();
  const [accentIdx, setAccentIdx] = useState(0);

  const monthParam = searchParams.get('month');
  const now = new Date();
  const { year, month } = useMemo(() => {
    if (monthParam) {
      const [y, m] = monthParam.split('-').map(Number);
      if (y && m) return { year: y, month: m - 1 };
    }
    return { year: now.getFullYear(), month: now.getMonth() };
  }, [monthParam]);

  const accent = ACCENT_PRESETS[accentIdx];

  const changeMonth = (delta: number) => {
    const d = new Date(year, month + delta, 1);
    const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    setSearchParams({ month: ym });
  };

  const isStaff = user?.role === 'staff';

  return (
    <>
      <Head>
        <title>Events Flyer | Owner Portal | Lakeside Tower</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <PortalLayout>
        <div className="container-wide py-12">
          {/* Controls (hidden on print) */}
          <div className="flyer-controls flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link
                to="/portal/events"
                className="inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-wider text-brass-on-light transition hover:text-lake-deep"
              >
                <ArrowLeft size={14} /> Back to Events
              </Link>
            </div>

            <div className="flex items-center gap-4">
              {/* Month selector */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => changeMonth(-1)}
                  className="p-1.5 text-lake/60 hover:text-lake"
                >
                  ‹
                </button>
                <span className="serif text-lg text-lake">
                  {getMonthName(month)} {year}
                </span>
                <button
                  onClick={() => changeMonth(1)}
                  className="p-1.5 text-lake/60 hover:text-lake"
                >
                  ›
                </button>
              </div>

              {/* Accent picker */}
              <div className="flex items-center gap-2">
                {ACCENT_PRESETS.map((a, i) => (
                  <button
                    key={a.name}
                    onClick={() => setAccentIdx(i)}
                    className={`h-6 w-6 rounded-full border-2 transition ${
                      accentIdx === i ? 'border-lake' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: a.color }}
                    aria-label={a.name}
                    title={a.name}
                  />
                ))}
              </div>

              {/* Print button */}
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 bg-brass px-5 py-2.5 text-[12px] font-bold uppercase tracking-wider text-lake-deep transition hover:brightness-110"
              >
                <Printer size={15} /> Print
              </button>
            </div>
          </div>

          {/* Flyer */}
          <div className="mt-8 rounded-lg bg-cream p-6">
            <FlyerContent
              events={events}
              year={year}
              month={month}
              accent={accent}
            />
          </div>
        </div>
      </PortalLayout>

      <style>{`
        @media print {
          @page { margin: 0.5in; }
          body { background: white !important; }
          .fixed, .flyer-controls, nav, header { display: none !important; }
          main { padding-top: 0 !important; }
          .flyer-content { box-shadow: none !important; }
        }
      `}</style>
    </>
  );
}

import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Head } from 'vite-react-ssg';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Printer,
  CalendarDays,
  List as ListIcon,
  History,
} from 'lucide-react';
import { PortalLayout } from '../components/PortalLayout';
import { useAuth } from '../auth/AuthContext';
import { useEvents, useRsvps } from '../data/hooks';
import { EventBadges, CategoryChip, EVENT_CATEGORIES, RsvpStatusChip } from '../components/EventBadges';
import { countGoing, findUserRsvp } from '../utils/rsvpUtils';
import {
  getCalendarDays,
  getEventsForDay,
  getEventsForMonth,
  groupEventsByMonth,
} from '../utils/calendarUtils';
import {
  formatTimeInTZ,
  formatWeekdayInTZ,
  formatMonthDayInTZ,
  getMonthName,
  monthKeyFromNums,
} from '../lib/dates';
import { dayKey } from '../lib/dates';
import { TODAY_ISO } from '../utils/dateUtils';
import type { EventCategory, PortalEvent } from '../data/types';

const VIEW_KEY = 'lakeside_portal_events_view';

function readViewPref(): 'month' | 'list' {
  try {
    return (localStorage.getItem(VIEW_KEY) as 'month' | 'list') || 'list';
  } catch {
    return 'list';
  }
}

function writeViewPref(v: 'month' | 'list'): void {
  try {
    localStorage.setItem(VIEW_KEY, v);
  } catch {
    // ignore
  }
}

export function EventsPage() {
  const { user } = useAuth();
  const { events, loading } = useEvents();
  const [view, setView] = useState<'month' | 'list'>(readViewPref);
  const [filter, setFilter] = useState<EventCategory | 'All'>('All');
  const [showPast, setShowPast] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });
  const navigate = useNavigate();

  const isStaff = user?.role === 'staff';

  const switchView = (v: 'month' | 'list') => {
    setView(v);
    writeViewPref(v);
  };

  const filtered = useMemo(() => {
    return filter === 'All'
      ? events
      : events.filter((e) => e.category === filter);
  }, [events, filter]);

  const upcomingFiltered = useMemo(
    () => filtered.filter((e) => e.startsAt >= TODAY_ISO + 'T00:00'),
    [filtered],
  );
  const pastFiltered = useMemo(
    () =>
      filtered
        .filter((e) => e.startsAt < TODAY_ISO + 'T00:00')
        .sort((a, b) => b.startsAt.localeCompare(a.startsAt)),
    [filtered],
  );

  const monthEvents = useMemo(
    () =>
      getEventsForMonth(filtered, currentMonth.year, currentMonth.month),
    [filtered, currentMonth],
  );

  const prevMonth = () => {
    setCurrentMonth((c) => {
      const d = new Date(c.year, c.month - 1, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  };
  const nextMonth = () => {
    setCurrentMonth((c) => {
      const d = new Date(c.year, c.month + 1, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  };

  const flyerMonth = monthKeyFromNums(currentMonth.year, currentMonth.month);

  return (
    <>
      <Head>
        <title>Events | Owner Portal | Lakeside Tower</title>
        <meta name="description" content="Upcoming events at Lakeside Tower." />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <PortalLayout>
        <div className="container-wide py-12">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="eyebrow text-brass-on-light">Owner Portal</p>
              <h1 className="display-4 serif mt-4 text-lake">Events</h1>
            </div>
            {isStaff && (
              <div className="flex gap-3">
                <button
                  onClick={() => navigate('/portal/events/new')}
                  className="inline-flex items-center gap-2 bg-brass px-5 py-2.5 text-[12px] font-bold uppercase tracking-[0.12em] text-lake-deep transition hover:brightness-110"
                >
                  <Plus size={15} />
                  New event
                </button>
                <Link
                  to={`/portal/events/flyer?month=${flyerMonth}`}
                  className="inline-flex items-center gap-2 border border-lake/20 px-5 py-2.5 text-[12px] font-bold uppercase tracking-[0.12em] text-lake transition hover:border-brass"
                >
                  <Printer size={15} />
                  Print flyer
                </Link>
              </div>
            )}
          </div>

          {/* View toggle + category filters */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <div className="flex border border-lake/15">
              <button
                onClick={() => switchView('month')}
                className={`inline-flex items-center gap-2 px-4 py-2 text-[12px] font-semibold uppercase tracking-wider transition ${
                  view === 'month' ? 'bg-lake text-cream' : 'text-lake/60 hover:text-lake'
                }`}
              >
                <CalendarDays size={14} />
                Month
              </button>
              <button
                onClick={() => switchView('list')}
                className={`inline-flex items-center gap-2 px-4 py-2 text-[12px] font-semibold uppercase tracking-wider transition ${
                  view === 'list' ? 'bg-lake text-cream' : 'text-lake/60 hover:text-lake'
                }`}
              >
                <ListIcon size={14} />
                List
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter('All')}
                className={`px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider transition ${
                  filter === 'All'
                    ? 'bg-lake text-cream'
                    : 'border border-lake/15 text-lake/60 hover:border-brass'
                }`}
              >
                All
              </button>
              {EVENT_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider transition ${
                    filter === cat
                      ? 'bg-lake text-cream'
                      : 'border border-lake/15 text-lake/60 hover:border-brass'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <p className="mt-8 text-lake/40">Loading…</p>
          ) : view === 'month' ? (
            <MonthView
              year={currentMonth.year}
              month={currentMonth.month}
              events={monthEvents}
              onPrevMonth={prevMonth}
              onNextMonth={nextMonth}
            />
          ) : (
            <ListView
              upcoming={upcomingFiltered}
              past={pastFiltered}
              showPast={showPast}
              onTogglePast={() => setShowPast((s) => !s)}
              userId={user?.id ?? ''}
            />
          )}
        </div>
      </PortalLayout>
    </>
  );
}

// --- Month View ---

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function MonthView({
  year,
  month,
  events,
  onPrevMonth,
  onNextMonth,
}: {
  year: number;
  month: number;
  events: PortalEvent[];
  onPrevMonth: () => void;
  onNextMonth: () => void;
}) {
  const days = getCalendarDays(year, month);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const selectedDayEvents = selectedDay
    ? getEventsForDay(events, selectedDay)
    : [];

  return (
    <div className="mt-8">
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={onPrevMonth}
          className="p-2 text-lake/60 transition hover:text-lake"
          aria-label="Previous month"
        >
          <ChevronLeft size={20} />
        </button>
        <h2 className="serif text-2xl text-lake">
          {getMonthName(month)} {year}
        </h2>
        <button
          onClick={onNextMonth}
          className="p-2 text-lake/60 transition hover:text-lake"
          aria-label="Next month"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 border-b border-lake/10">
        {WEEKDAY_LABELS.map((d) => (
          <div
            key={d}
            className="py-2 text-center text-[11px] font-semibold uppercase tracking-wider text-lake/40"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7">
        {days.map((day, i) => {
          const dayEvents = getEventsForDay(events, day.isoDate);
          const hasEvents = dayEvents.length > 0;
          const isSelected = selectedDay === day.isoDate;
          return (
            <button
              key={i}
              onClick={() => hasEvents && setSelectedDay(day.isoDate)}
              className={`min-h-[80px] border-b border-r border-lake/10 p-1.5 text-left transition ${
                day.isCurrentMonth ? 'bg-white' : 'bg-cream/50'
              } ${hasEvents ? 'cursor-pointer hover:bg-brass/5' : 'cursor-default'} ${
                isSelected ? 'ring-2 ring-inset ring-brass' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-[13px] font-semibold ${
                    day.isCurrentMonth
                      ? day.isToday
                        ? 'flex h-6 w-6 items-center justify-center rounded-full bg-brass text-cream'
                        : 'text-lake'
                      : 'text-lake/30'
                  }`}
                >
                  {day.dayOfMonth}
                </span>
              </div>
              {dayEvents.slice(0, 2).map((e) => (
                <div
                  key={e.id}
                  className="mt-1 truncate rounded bg-brass/10 px-1.5 py-0.5 text-[10px] font-semibold text-brass-on-light"
                >
                  {e.title}
                </div>
              ))}
              {dayEvents.length > 2 && (
                <div className="mt-0.5 text-[10px] text-lake/40">
                  +{dayEvents.length - 2} more
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected day events */}
      {selectedDay && (
        <div className="mt-6 border border-lake/10 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="serif text-lg text-lake">
              {formatMonthDayInTZ(selectedDay + 'T00:00')}{' '}
              <span className="text-lake/40">· {formatWeekdayInTZ(selectedDay + 'T00:00')}</span>
            </h3>
            <button
              onClick={() => setSelectedDay(null)}
              className="text-[12px] font-semibold uppercase tracking-wider text-lake/40 hover:text-lake"
            >
              Close
            </button>
          </div>
          {selectedDayEvents.length === 0 ? (
            <p className="text-lake/40">No events on this day.</p>
          ) : (
            <div className="space-y-3">
              {selectedDayEvents.map((e) => (
                <DayEventRow key={e.id} event={e} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function DayEventRow({ event }: { event: PortalEvent }) {
  return (
    <Link
      to={`/portal/events/${event.id}`}
      className="flex items-center gap-4 border border-lake/10 p-3 transition hover:border-brass"
    >
      <span className="shrink-0 text-[13px] font-semibold text-lake/50">
        {formatTimeInTZ(event.startsAt)}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="serif text-base text-lake">{event.title}</span>
          <CategoryChip category={event.category} />
        </div>
        <div className="mt-1 flex items-center gap-2">
          <EventBadges event={event} />
        </div>
      </div>
    </Link>
  );
}

// --- List View ---

function ListView({
  upcoming,
  past,
  showPast,
  onTogglePast,
  userId,
}: {
  upcoming: PortalEvent[];
  past: PortalEvent[];
  showPast: boolean;
  onTogglePast: () => void;
  userId: string;
}) {
  const grouped = groupEventsByMonth(upcoming);

  return (
    <div className="mt-8">
      {upcoming.length === 0 && (
        <p className="text-lake/40">No upcoming events{past.length === 0 ? '.' : '.'}</p>
      )}

      {grouped.map((group) => (
        <div key={group.yearMonth} className="mb-10">
          <h2 className="serif text-xl text-lake mb-4">{group.label}</h2>
          <div className="space-y-3">
            {group.events.map((e) => (
              <ListEventRow key={e.id} event={e} userId={userId} />
            ))}
          </div>
        </div>
      ))}

      {past.length > 0 && (
        <div className="mt-8 border-t border-lake/10 pt-6">
          <button
            onClick={onTogglePast}
            className="inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-wider text-lake/50 transition hover:text-lake"
          >
            <History size={14} />
            {showPast ? 'Hide past events' : `Show past events (${past.length})`}
          </button>
          {showPast && (
            <div className="mt-4">
              {groupEventsByMonth(past)
                .reverse()
                .map((group) => (
                  <div key={group.yearMonth} className="mb-6">
                    <h3 className="serif text-lg text-lake/60 mb-3">{group.label}</h3>
                    <div className="space-y-3 opacity-70">
                      {group.events.map((e) => (
                        <ListEventRow key={e.id} event={e} userId={userId} />
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ListEventRow({ event, userId }: { event: PortalEvent; userId: string }) {
  const { rsvps } = useRsvps(event.id);
  const headcount = countGoing(rsvps);
  const userRsvp = findUserRsvp(rsvps, userId);
  const isEvite = !!event.externalRsvpUrl;

  const d = new Date(event.startsAt);
  const monthShort = d.toLocaleDateString('en-US', { month: 'short', timeZone: 'America/Chicago' });
  const dayNum = d.toLocaleDateString('en-US', { day: 'numeric', timeZone: 'America/Chicago' });
  const weekdayShort = d.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'America/Chicago' });

  return (
    <Link
      to={`/portal/events/${event.id}`}
      className="flex gap-4 border border-lake/10 bg-white p-4 transition hover:border-brass"
    >
      {/* Date block */}
      <div className="flex shrink-0 flex-col items-center justify-center w-14 rounded-md bg-lake/5 py-2">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-lake/40">
          {monthShort}
        </span>
        <span className="serif text-2xl text-lake leading-none mt-0.5">
          {dayNum}
        </span>
        <span className="text-[10px] text-lake/40 mt-0.5">
          {weekdayShort}
        </span>
      </div>

      {/* Details */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <CategoryChip category={event.category} />
          <EventBadges event={event} />
        </div>
        <h3 className="serif text-base text-lake mt-1.5 leading-snug">{event.title}</h3>
        <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-lake/50">
          <span>{formatTimeInTZ(event.startsAt)}</span>
          <span className="inline-flex items-center gap-1">
            {event.locationTBD ? 'Location TBD' : event.location}
          </span>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          {!isEvite && headcount > 0 && (
            <span className="text-[12px] font-semibold text-lake/60">{headcount} going</span>
          )}
          {!isEvite && userRsvp && <RsvpStatusChip status={userRsvp.status} />}
        </div>
      </div>
    </Link>
  );
}

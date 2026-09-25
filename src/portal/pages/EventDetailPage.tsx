import { useState, useCallback, useMemo } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Head } from 'vite-react-ssg';
import { marked } from 'marked';
import {
  ArrowLeft,
  ExternalLink,
  Users,
  Minus,
  Plus,
  Calendar,
  Copy,
  Pencil,
  XCircle,
  Download,
  ChevronDown,
} from 'lucide-react';
import { PortalLayout } from '../components/PortalLayout';
import { useAuth } from '../auth/AuthContext';
import { useEvent, useRsvps, dataSource } from '../data/hooks';
import { EventBadges, CategoryChip, RsvpStatusChip } from '../components/EventBadges';
import {
  formatEventTimeRange,
  formatTime,
  formatDate,
} from '../utils/format';
import {
  countGoing,
  countMaybe,
  countNotGoing,
  countWaitlist,
  findUserRsvp,
  countByStatus,
} from '../utils/rsvpUtils';
import { downloadICS, getGoogleCalendarUrl } from '../utils/calendarUtils';
import type { RsvpStatus, Rsvp } from '../data/types';

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div
      className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-lake-deep px-5 py-3 text-[13px] text-cream shadow-lg"
      role="status"
      onClick={onClose}
    >
      {message}
    </div>
  );
}

export function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { event, loading } = useEvent(id);
  const { rsvps, submitRsvp } = useRsvps(id);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [toast, setToast] = useState<string | null>(null);
  const [showCalendarMenu, setShowCalendarMenu] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);

  const isStaff = user?.role === 'staff';
  const isStaffOrBoard = user?.role === 'staff' || user?.role === 'board';
  const isCancelled = event?.status === 'cancelled';
  const hasExternalRsvp = !!event?.externalRsvpUrl;

  const userRsvp = user ? findUserRsvp(rsvps, user.id) : undefined;
  const isRsvpClosed = useMemo(() => {
    if (!event?.rsvpDeadline) return false;
    return new Date() > new Date(event.rsvpDeadline);
  }, [event?.rsvpDeadline]);

  const goingCount = countGoing(rsvps);
  const headcount = goingCount;
  const capacity = event?.capacity ?? 0;
  const spotsFilled = Math.min(headcount, capacity);
  const isFull = capacity > 0 && headcount >= capacity;
  const capacityPct = capacity > 0 ? Math.min((headcount / capacity) * 100, 100) : 0;

  if (loading) {
    return (
      <>
        <Head>
          <title>Event | Owner Portal | Lakeside Tower</title>
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        <PortalLayout>
          <div className="container-narrow py-12">
            <p className="text-lake/40">Loading…</p>
          </div>
        </PortalLayout>
      </>
    );
  }

  if (!event) {
    return (
      <>
        <Head>
          <title>Event | Owner Portal | Lakeside Tower</title>
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        <PortalLayout>
          <div className="container-narrow py-12">
            <h1 className="display-4 serif text-lake">Event not found</h1>
            <p className="body-text mt-4 text-lake/60">
              The event you&rsquo;re looking for isn&rsquo;t here.
            </p>
            <Link
              to="/portal/events"
              className="mt-6 inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-wider text-brass-on-light"
            >
              <ArrowLeft size={14} /> Back to Events
            </Link>
          </div>
        </PortalLayout>
      </>
    );
  }

  const handleDuplicate = async () => {
    // Duplicate navigates to the editor with a prefilled event (date cleared)
    navigate(`/portal/events/new?from=${event.id}`);
  };

  const handleCancel = async () => {
    await dataSource.cancelEvent(event.id);
    setShowCancelConfirm(false);
    showToast('Event cancelled (demo only — stored in this browser)');
    setTimeout(() => navigate('/portal/events'), 1500);
  };

  return (
    <>
      <Head>
        <title>{event.title} | Owner Portal | Lakeside Tower</title>
        <meta name="description" content={event.description.slice(0, 160)} />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <PortalLayout>
        <div className="container-narrow py-12">
          <Link
            to="/portal/events"
            className="inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-brass-on-light transition hover:text-lake-deep"
          >
            <ArrowLeft size={14} strokeWidth={1.5} />
            Back to Events
          </Link>

          {/* Cancelled banner */}
          {isCancelled && (
            <div className="mt-6 rounded-md bg-red-600/10 border border-red-600/20 px-5 py-4">
              <p className="text-[14px] font-bold text-red-700">
                This event has been cancelled. RSVPs are no longer available.
              </p>
            </div>
          )}

          <article className="mt-8">
            <div className="flex flex-wrap items-center gap-2">
              <CategoryChip category={event.category} />
              <EventBadges event={event} />
            </div>
            <h1 className="display-4 serif mt-4 text-lake leading-tight">{event.title}</h1>

            <div className="mt-4 space-y-1.5 text-[14px] text-lake/60">
              <p className="flex items-center gap-2">
                <Calendar size={15} className="text-brass-on-light" />
                {event.endsAt
                  ? formatEventTimeRange(event.startsAt, event.endsAt)
                  : formatEventTimeRange(event.startsAt, event.startsAt)}
              </p>
              <p className="flex items-center gap-2">
                <Users size={15} className="text-brass-on-light" />
                {event.locationTBD ? (
                  <span className="italic text-lake/40">Location TBD</span>
                ) : (
                  event.location
                )}
              </p>
              <p className="text-[13px] text-lake/40">Organized by {event.organizerName}</p>
            </div>

            {/* Description */}
            <div
              className="journal-body mt-8"
              dangerouslySetInnerHTML={{
                __html: marked.parse(event.description, { async: false }) as string,
              }}
            />

            {event.bringNote && (
              <div className="mt-6 rounded-md border border-brass/20 bg-brass/5 px-5 py-3">
                <p className="text-[13px] font-semibold text-brass-on-light">
                  {event.bringNote}
                </p>
              </div>
            )}

            {/* Staff actions */}
            {isStaff && !isCancelled && (
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to={`/portal/events/${event.id}/edit`}
                  className="inline-flex items-center gap-2 border border-lake/20 px-4 py-2 text-[12px] font-semibold uppercase tracking-wider text-lake transition hover:border-brass"
                >
                  <Pencil size={14} /> Edit
                </Link>
                <button
                  onClick={handleDuplicate}
                  className="inline-flex items-center gap-2 border border-lake/20 px-4 py-2 text-[12px] font-semibold uppercase tracking-wider text-lake transition hover:border-brass"
                >
                  <Copy size={14} /> Duplicate
                </button>
                <button
                  onClick={() => setShowCancelConfirm(true)}
                  className="inline-flex items-center gap-2 border border-red-600/20 px-4 py-2 text-[12px] font-semibold uppercase tracking-wider text-red-700 transition hover:border-red-600"
                >
                  <XCircle size={14} /> Cancel event
                </button>
              </div>
            )}

            {/* Cancel confirm dialog */}
            {showCancelConfirm && (
              <div className="mt-6 rounded-md border border-red-600/20 bg-red-600/5 px-5 py-4">
                <p className="text-[14px] text-lake">
                  Are you sure you want to cancel this event? This cannot be undone in the demo.
                </p>
                <div className="mt-3 flex gap-3">
                  <button
                    onClick={handleCancel}
                    className="bg-red-600 px-4 py-2 text-[12px] font-bold uppercase tracking-wider text-white"
                  >
                    Yes, cancel event
                  </button>
                  <button
                    onClick={() => setShowCancelConfirm(false)}
                    className="border border-lake/20 px-4 py-2 text-[12px] font-semibold uppercase tracking-wider text-lake"
                  >
                    No, go back
                  </button>
                </div>
              </div>
            )}

            {/* RSVP section */}
            {!isCancelled && (
              <div className="mt-10 border-t border-lake/10 pt-8">
                {hasExternalRsvp ? (
                  <div>
                    <h2 className="serif text-xl text-lake mb-3">RSVP</h2>
                    <a
                      href={event.externalRsvpUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-brass px-6 py-3 text-[13px] font-bold uppercase tracking-[0.12em] text-lake-deep transition hover:brightness-110"
                    >
                      RSVP on Evite
                      <ExternalLink size={15} />
                    </a>
                    <p className="mt-3 text-[13px] text-lake/50">
                      RSVPs for this event are handled on Evite.
                    </p>
                  </div>
                ) : (
                  <RsvpPanel
                    eventId={event.id}
                    allowGuests={event.allowGuests}
                    potluck={event.potluck}
                    capacity={capacity}
                    spotsFilled={spotsFilled}
                    isFull={isFull}
                    capacityPct={capacityPct}
                    isRsvpClosed={isRsvpClosed}
                    rsvpDeadline={event.rsvpDeadline}
                    userRsvp={userRsvp}
                    user={user}
                    rsvps={rsvps}
                    submitRsvp={submitRsvp}
                    showToast={showToast}
                    headcount={headcount}
                  />
                )}
              </div>
            )}

            {/* Add to calendar */}
            <div className="mt-8 relative">
              <button
                onClick={() => setShowCalendarMenu((s) => !s)}
                className="inline-flex items-center gap-2 border border-lake/20 px-4 py-2 text-[12px] font-semibold uppercase tracking-wider text-lake transition hover:border-brass"
              >
                <Calendar size={14} />
                Add to calendar
                <ChevronDown size={14} />
              </button>
              {showCalendarMenu && (
                <div className="absolute z-10 mt-2 border border-lake/10 bg-white py-1 shadow-lg">
                  <button
                    onClick={() => {
                      downloadICS(event);
                      setShowCalendarMenu(false);
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2 text-[13px] text-lake hover:bg-cream"
                  >
                    <Download size={14} /> Download .ics file
                  </button>
                  <a
                    href={getGoogleCalendarUrl(event)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center gap-2 px-4 py-2 text-[13px] text-lake hover:bg-cream"
                    onClick={() => setShowCalendarMenu(false)}
                  >
                    <ExternalLink size={14} /> Google Calendar
                  </a>
                </div>
              )}
            </div>
          </article>
        </div>
      </PortalLayout>
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </>
  );
}

// --- RSVP Panel ---

interface RsvpPanelProps {
  eventId: string;
  allowGuests: boolean;
  potluck?: boolean;
  capacity: number;
  spotsFilled: number;
  isFull: boolean;
  capacityPct: number;
  isRsvpClosed: boolean;
  rsvpDeadline?: string;
  userRsvp?: Rsvp;
  user: { id: string; displayName: string; unit: string } | null;
  rsvps: Rsvp[];
  submitRsvp: (rsvp: Rsvp) => Promise<Rsvp>;
  showToast: (msg: string) => void;
  headcount: number;
}

function RsvpPanel({
  eventId,
  allowGuests,
  potluck,
  capacity,
  spotsFilled,
  isFull,
  capacityPct,
  isRsvpClosed,
  rsvpDeadline,
  userRsvp,
  user,
  rsvps,
  submitRsvp,
  showToast,
}: RsvpPanelProps) {
  const [guests, setGuests] = useState(userRsvp?.guests ?? 0);
  const [potluckItem, setPotluckItem] = useState(userRsvp?.potluckItem ?? '');
  const [note, setNote] = useState(userRsvp?.note ?? '');

  if (!user) return null;

  const handleSubmit = async (status: RsvpStatus) => {
    const rsvp: Rsvp = {
      eventId,
      userId: user.id,
      displayName: user.displayName,
      unit: user.unit,
      status,
      guests: status === 'going' || status === 'maybe' ? guests : 0,
      potluckItem: potluck ? potluckItem.trim() || undefined : undefined,
      note: note.trim() || undefined,
      respondedAt: new Date().toISOString(),
    };
    const result = await submitRsvp(rsvp);
    if (result.status === 'waitlist' && status === 'going') {
      showToast('This event is full — you have been added to the waitlist.');
    } else {
      showToast('RSVP updated (demo only — stored in this browser)');
    }
  };

  return (
    <div>
      <h2 className="serif text-xl text-lake mb-4">RSVP</h2>

      {isRsvpClosed ? (
        <p className="text-[14px] text-lake/50">
          RSVPs for this event are closed
          {rsvpDeadline && ` (closed ${formatDate(rsvpDeadline.split('T')[0])})`}.
        </p>
      ) : (
        <>
          {/* Capacity bar */}
          {capacity > 0 && (
            <div className="mb-5">
              <div className="flex items-center justify-between text-[12px] text-lake/50 mb-1.5">
                <span>
                  {spotsFilled} of {capacity} spots filled
                </span>
                {isFull && (
                  <span className="font-semibold text-amber-700">
                    Full — waitlist active
                  </span>
                )}
              </div>
              <div className="h-2 rounded-full bg-lake/10">
                <div
                  className={`h-full rounded-full transition-all ${isFull ? 'bg-amber-500' : 'bg-brass'}`}
                  style={{ width: `${capacityPct}%` }}
                />
              </div>
              {rsvpDeadline && (
                <p className="mt-2 text-[12px] text-lake/40">
                  RSVPs close {formatDate(rsvpDeadline.split('T')[0])} at{' '}
                  {formatTime(rsvpDeadline)}
                </p>
              )}
            </div>
          )}

          {/* Current RSVP status */}
          {userRsvp && (
            <div className="mb-4">
              <RsvpStatusChip status={userRsvp.status} />
            </div>
          )}

          {/* RSVP buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleSubmit('going')}
              className={`px-5 py-2.5 text-[12px] font-bold uppercase tracking-wider transition ${
                userRsvp?.status === 'going' || userRsvp?.status === 'waitlist'
                  ? 'bg-green-600 text-white'
                  : 'border border-green-600/30 text-green-700 hover:border-green-600'
              }`}
            >
              {isFull ? 'Join waitlist' : "I'm going"}
            </button>
            <button
              onClick={() => handleSubmit('maybe')}
              className={`px-5 py-2.5 text-[12px] font-bold uppercase tracking-wider transition ${
                userRsvp?.status === 'maybe'
                  ? 'bg-amber-500 text-white'
                  : 'border border-amber-500/30 text-amber-700 hover:border-amber-500'
              }`}
            >
              Maybe
            </button>
            <button
              onClick={() => handleSubmit('not_going')}
              className={`px-5 py-2.5 text-[12px] font-bold uppercase tracking-wider transition ${
                userRsvp?.status === 'not_going'
                  ? 'bg-red-600 text-white'
                  : 'border border-red-600/30 text-red-700 hover:border-red-600'
              }`}
            >
              Can't go
            </button>
          </div>

          {/* Guests stepper */}
          {allowGuests && (
            <div className="mt-5">
              <label className="text-[13px] font-semibold text-lake/70">
                Guests
              </label>
              <div className="mt-2 flex items-center gap-3">
                <button
                  onClick={() => setGuests(Math.max(0, guests - 1))}
                  className="flex h-8 w-8 items-center justify-center border border-lake/20 text-lake"
                >
                  <Minus size={14} />
                </button>
                <span className="w-8 text-center text-[14px] font-semibold text-lake">
                  {guests}
                </span>
                <button
                  onClick={() => setGuests(Math.min(2, guests + 1))}
                  className="flex h-8 w-8 items-center justify-center border border-lake/20 text-lake"
                >
                  <Plus size={14} />
                </button>
                <span className="text-[12px] text-lake/40">Up to 2 guests</span>
              </div>
            </div>
          )}

          {/* Potluck item */}
          {potluck && (
            <div className="mt-5">
              <label className="text-[13px] font-semibold text-lake/70">
                What are you bringing?
              </label>
              <input
                type="text"
                value={potluckItem}
                onChange={(e) => setPotluckItem(e.target.value)}
                placeholder="e.g. Spinach dip and chips"
                className="mt-2 w-full max-w-md border border-lake/20 px-3 py-2 text-[14px] text-lake focus:border-brass focus:outline-none"
              />
            </div>
          )}

          {/* Note */}
          <div className="mt-5">
            <label className="text-[13px] font-semibold text-lake/70">
              Note <span className="text-lake/30 font-normal">(optional)</span>
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              placeholder="Anything you'd like the organizer to know"
              className="mt-2 w-full max-w-md border border-lake/20 px-3 py-2 text-[14px] text-lake focus:border-brass focus:outline-none"
            />
          </div>
        </>
      )}

      {/* Headcount + potluck list for owners */}
      <div className="mt-6 border-t border-lake/10 pt-6">
        <p className="text-[14px] font-semibold text-lake/70">
          {countGoing(rsvps)} going
          {countMaybe(rsvps) > 0 && ` · ${countMaybe(rsvps)} maybe`}
        </p>

        {potluck && (
          <div className="mt-4">
            <h3 className="text-[13px] font-semibold uppercase tracking-wider text-lake/40 mb-2">
              What people are bringing
            </h3>
            <ul className="space-y-1">
              {rsvps
                .filter((r) => r.potluckItem)
                .map((r, i) => (
                  <li key={i} className="text-[14px] text-lake/60">
                    {r.potluckItem}
                  </li>
                ))}
              {rsvps.filter((r) => r.potluckItem).length === 0 && (
                <li className="text-[13px] text-lake/30">
                  No dishes shared yet.
                </li>
              )}
            </ul>
          </div>
        )}
      </div>

      {/* Full attendee list for staff/board */}
      {user && (user.role === 'staff' || user.role === 'board') && (
        <AttendeeList rsvps={rsvps} />
      )}
    </div>
  );
}

function AttendeeList({ rsvps }: { rsvps: Rsvp[] }) {
  const counts = countByStatus(rsvps);

  const exportCsv = () => {
    const header = 'Name,Unit,Status,Guests,Dish,Note\n';
    const rows = rsvps
      .map((r) => {
        const esc = (s: string | undefined) =>
          `"${(s ?? '').replace(/"/g, '""')}"`;
        return [
          esc(r.displayName),
          esc(r.unit),
          esc(r.status),
          r.guests,
          esc(r.potluckItem),
          esc(r.note),
        ].join(',');
      })
      .join('\n');
    const csv = header + rows;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'attendees.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mt-6 border-t border-lake/10 pt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[13px] font-semibold uppercase tracking-wider text-lake/40">
          Attendees ({rsvps.length})
        </h3>
        <button
          onClick={exportCsv}
          className="inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-wider text-brass-on-light transition hover:text-lake-deep"
        >
          <Download size={14} /> Export CSV
        </button>
      </div>

      <div className="mb-4 flex gap-4 text-[12px] text-lake/50">
        <span>{counts.going} going</span>
        <span>{counts.maybe} maybe</span>
        <span>{counts.waitlist} waitlist</span>
        <span>{counts.not_going} can't go</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-[13px]">
          <thead>
            <tr className="border-b border-lake/10 text-[11px] uppercase tracking-wider text-lake/40">
              <th className="py-2 pr-4">Name</th>
              <th className="py-2 pr-4">Unit</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2 pr-4">Guests</th>
              <th className="py-2 pr-4">Dish</th>
              <th className="py-2">Note</th>
            </tr>
          </thead>
          <tbody>
            {rsvps.map((r, i) => (
              <tr key={i} className="border-b border-lake/5">
                <td className="py-2 pr-4 font-semibold text-lake">{r.displayName}</td>
                <td className="py-2 pr-4 text-lake/60">{r.unit || '—'}</td>
                <td className="py-2 pr-4">
                  <RsvpStatusChip status={r.status} />
                </td>
                <td className="py-2 pr-4 text-lake/60">{r.guests}</td>
                <td className="py-2 pr-4 text-lake/60">{r.potluckItem || '—'}</td>
                <td className="py-2 text-lake/50">{r.note || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

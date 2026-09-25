import { Link } from 'react-router-dom';
import { Head } from 'vite-react-ssg';
import {
  ArrowRight,
  FileText,
  Users,
  Pin,
  Calendar,
  Paperclip,
} from 'lucide-react';
import { PortalLayout } from '../components/PortalLayout';
import { useAuth } from '../auth/AuthContext';
import { useAnnouncements, useEvents, useAmenityStatus, useRsvps } from '../data/hooks';
import { formatDate, formatEventDate } from '../utils/format';
import { countGoing } from '../utils/rsvpUtils';
import { TODAY_ISO } from '../utils/dateUtils';
import type { AmenityStatusType } from '../data/types';

const AMENITY_STYLES: Record<AmenityStatusType, { dot: string; chip: string; label: string }> = {
  open: { dot: 'bg-green-600', chip: 'border-green-600/20 bg-green-50', label: 'text-green-700' },
  limited: { dot: 'bg-amber-500', chip: 'border-amber-500/20 bg-amber-50', label: 'text-amber-700' },
  closed: { dot: 'bg-red-600', chip: 'border-red-600/20 bg-red-50', label: 'text-red-700' },
};

function AmenityChip({ amenity }: { amenity: { amenity: string; status: AmenityStatusType; message?: string; until?: string } }) {
  const style = AMENITY_STYLES[amenity.status];
  return (
    <div className={`flex items-start gap-2.5 rounded-md border px-3.5 py-3 ${style.chip}`}>
      <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${style.dot}`} />
      <div className="min-w-0">
        <p className={`text-[13px] font-semibold ${style.label}`}>{amenity.amenity}</p>
        {amenity.message && (
          <p className="text-[12px] text-lake/50 leading-5 mt-0.5">{amenity.message}</p>
        )}
        {amenity.until && (
          <p className="text-[11px] text-lake/40 mt-0.5">Until {formatDate(amenity.until)}</p>
        )}
      </div>
    </div>
  );
}

function EventCard({ event, headcount }: { event: { id: string; title: string; startsAt: string; location: string; rsvpRequired: boolean; category: string }; headcount: number }) {
  const d = new Date(event.startsAt);
  return (
    <div className="flex gap-4 border border-lake/10 bg-white p-4">
      <div className="flex shrink-0 flex-col items-center justify-center w-14 rounded-md bg-lake/5 py-2">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-lake/40">
          {d.toLocaleDateString('en-US', { month: 'short' })}
        </span>
        <span className="serif text-2xl text-lake leading-none mt-0.5">
          {d.getDate()}
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="eyebrow text-brass-on-light">{event.category}</span>
          {event.rsvpRequired && (
            <span className="rounded bg-brass/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brass-on-light">
              RSVP
            </span>
          )}
        </div>
        <h3 className="serif text-base text-lake mt-1 leading-snug">{event.title}</h3>
        <p className="text-[12px] text-lake/50 mt-1">
          {d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} ·{' '}
          {d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} · {event.location}
        </p>
        {headcount > 0 && (
          <p className="text-[12px] font-semibold text-lake/60 mt-1.5">{headcount} going</p>
        )}
      </div>
    </div>
  );
}

export function PortalHomePage() {
  const { user } = useAuth();
  const { announcements } = useAnnouncements();
  const { events } = useEvents();
  const { amenities } = useAmenityStatus();

  const pinnedAndLatest = [
    ...announcements.filter((a) => a.pinned),
    ...announcements.filter((a) => !a.pinned),
  ].slice(0, 3);

  const upcoming = events
    .filter((e) => e.startsAt >= TODAY_ISO + 'T00:00' && e.status === 'scheduled')
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt))
    .slice(0, 4);

  const subtitle =
    user?.role === 'staff' && user.staffTitle
      ? user.staffTitle + ' · Lakeside Tower'
      : (user?.unit || '') + ' · Lakeside Tower';

  return (
    <>
      <Head>
        <title>Owner Portal | Lakeside Tower</title>
        <meta name="description" content="Lakeside Tower owner portal — home." />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <PortalLayout>
        <div className="container-wide py-12">
          <p className="eyebrow text-brass-on-light">Owner Portal</p>
          <h1 className="display-4 serif mt-4 text-lake">
            Welcome back,<br />
            <em className="font-medium">{user?.displayName ?? 'Resident'}.</em>
          </h1>
          <p className="body-text mt-4 text-lake/60">{subtitle}</p>

          {/* Building status strip */}
          {amenities.length > 0 && (
            <div className="mt-8">
              <h2 className="serif text-lg text-lake mb-3">Building Status</h2>
              <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                {amenities.map((a) => (
                  <AmenityChip key={a.id} amenity={a} />
                ))}
              </div>
            </div>
          )}

          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            {/* Announcements */}
            <div className="lg:col-span-2">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="serif text-2xl text-lake">Announcements</h2>
                <Link
                  to="/portal/announcements"
                  className="text-[12px] font-semibold uppercase tracking-[0.12em] text-brass-on-light transition hover:text-lake-deep"
                >
                  View all
                </Link>
              </div>
              <div className="space-y-4">
                {pinnedAndLatest.map((a) => (
                  <Link
                    key={a.id}
                    to={`/portal/announcements/${a.id}`}
                    className="block border border-lake/10 bg-white p-5 transition hover:border-brass"
                  >
                    <div className="flex items-center gap-2">
                      {a.pinned && <Pin size={13} className="text-brass-on-light" />}
                      <span className="eyebrow text-brass-on-light">{a.category}</span>
                      <span className="text-[12px] text-lake/40">·</span>
                      <span className="text-[12px] text-lake/50">{formatDate(a.publishedAt)}</span>
                      {a.attachments && a.attachments.length > 0 && (
                        <Paperclip size={12} className="ml-1 text-lake/40" />
                      )}
                    </div>
                    <h3 className="serif text-lg text-lake mt-2 leading-snug">{a.title}</h3>
                    <p className="mt-1.5 text-[12px] text-lake/40">
                      {a.authorName} · {a.authorTitle}
                    </p>
                    <p className="mt-2 text-[14px] leading-6 text-lake/60 line-clamp-2">
                      {a.body.replace(/[#*]/g, '').slice(0, 140)}…
                    </p>
                  </Link>
                ))}
              </div>
            </div>

            {/* Events + quick links */}
            <div className="space-y-8">
              <div>
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="serif text-2xl text-lake">Coming up</h2>
                  <Link
                    to="/portal/events"
                    className="text-[12px] font-semibold uppercase tracking-[0.12em] text-brass-on-light transition hover:text-lake-deep"
                  >
                    View all
                  </Link>
                </div>
                <div className="space-y-3">
                  {upcoming.map((e) => (
                    <EventCardWithRsvp key={e.id} event={e} />
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h2 className="serif text-2xl text-lake">Quick links</h2>
                <Link
                  to="/portal/building"
                  className="flex items-center justify-between border border-lake/10 bg-white px-5 py-4 transition hover:border-brass"
                >
                  <span className="flex items-center gap-3 text-[14px] font-semibold text-lake">
                    <Calendar size={16} className="text-brass-on-light" />
                    Building
                  </span>
                  <ArrowRight size={15} className="text-lake/40" />
                </Link>
                <Link
                  to="/portal/documents"
                  className="flex items-center justify-between border border-lake/10 bg-white px-5 py-4 transition hover:border-brass"
                >
                  <span className="flex items-center gap-3 text-[14px] font-semibold text-lake">
                    <FileText size={16} className="text-brass-on-light" />
                    Documents
                  </span>
                  <ArrowRight size={15} className="text-lake/40" />
                </Link>
                <Link
                  to="/portal/directory"
                  className="flex items-center justify-between border border-lake/10 bg-white px-5 py-4 transition hover:border-brass"
                >
                  <span className="flex items-center gap-3 text-[14px] font-semibold text-lake">
                    <Users size={16} className="text-brass-on-light" />
                    Directory
                  </span>
                  <ArrowRight size={15} className="text-lake/40" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </PortalLayout>
    </>
  );
}

function EventCardWithRsvp({ event }: { event: { id: string; title: string; startsAt: string; location: string; rsvpRequired: boolean; category: string } }) {
  const { rsvps } = useRsvps(event.id);
  const headcount = countGoing(rsvps);
  return <EventCard event={event} headcount={headcount} />;
}

import { Link } from 'react-router-dom';
import { Head } from 'vite-react-ssg';
import { ArrowRight, FileText, Users, Pin, Calendar } from 'lucide-react';
import { PortalLayout } from '../components/PortalLayout';
import { useAuth } from '../auth/AuthContext';
import { useAnnouncements, useEvents } from '../data/hooks';
import { formatDate, formatEventDate } from '../utils/format';

export function PortalHomePage() {
  const { user } = useAuth();
  const { announcements } = useAnnouncements();
  const { events } = useEvents();

  const pinnedAndLatest = [
    ...announcements.filter((a) => a.pinned),
    ...announcements.filter((a) => !a.pinned),
  ].slice(0, 3);

  const now = '2026-09-25T00:00';
  const upcoming = events
    .filter((e) => e.startsAt >= now)
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt))
    .slice(0, 3);

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
          <p className="body-text mt-4 text-lake/60">
            {user?.unit} · Lakeside Tower
          </p>

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
                    </div>
                    <h3 className="serif text-lg text-lake mt-2 leading-snug">{a.title}</h3>
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
                  <h2 className="serif text-2xl text-lake">Upcoming</h2>
                  <Link
                    to="/portal/events"
                    className="text-[12px] font-semibold uppercase tracking-[0.12em] text-brass-on-light transition hover:text-lake-deep"
                  >
                    View all
                  </Link>
                </div>
                <div className="space-y-3">
                  {upcoming.map((e) => (
                    <div key={e.id} className="border border-lake/10 bg-white p-4">
                      <div className="flex items-center gap-2">
                        <Calendar size={13} className="text-brass-on-light" />
                        <span className="eyebrow text-brass-on-light">{e.category}</span>
                      </div>
                      <h3 className="serif text-base text-lake mt-1.5">{e.title}</h3>
                      <p className="text-[12px] text-lake/50 mt-1">{formatEventDate(e.startsAt)}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h2 className="serif text-2xl text-lake">Quick links</h2>
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

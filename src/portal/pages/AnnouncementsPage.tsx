import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Head } from 'vite-react-ssg';
import { Pin } from 'lucide-react';
import { PortalLayout } from '../components/PortalLayout';
import { useAnnouncements } from '../data/hooks';
import { formatDate } from '../utils/format';
import type { AnnouncementCategory } from '../data/types';

const CATEGORIES: (AnnouncementCategory | 'All')[] = [
  'All',
  'General',
  'Maintenance',
  'Board',
  'Social',
];

export function AnnouncementsPage() {
  const { announcements, loading } = useAnnouncements();
  const [filter, setFilter] = useState<AnnouncementCategory | 'All'>('All');

  const filtered =
    filter === 'All'
      ? announcements
      : announcements.filter((a) => a.category === filter);

  return (
    <>
      <Head>
        <title>Announcements | Owner Portal | Lakeside Tower</title>
        <meta name="description" content="Community announcements for Lakeside Tower owners." />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <PortalLayout>
        <div className="container-wide py-12">
          <p className="eyebrow text-brass-on-light">Owner Portal</p>
          <h1 className="display-4 serif mt-4 text-lake">Announcements</h1>

          {/* Filter pills */}
          <div className="mt-8 flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.12em] transition ${
                  filter === cat
                    ? 'bg-lake text-cream'
                    : 'border border-lake/15 text-lake/60 hover:border-brass hover:text-lake'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <p className="mt-8 text-lake/40">Loading…</p>
          ) : (
            <div className="mt-8 space-y-4">
              {filtered.map((a) => (
                <Link
                  key={a.id}
                  to={`/portal/announcements/${a.id}`}
                  className="block border border-lake/10 bg-white p-6 transition hover:border-brass"
                >
                  <div className="flex items-center gap-2">
                    {a.pinned && <Pin size={13} className="text-brass-on-light" />}
                    <span className="eyebrow text-brass-on-light">{a.category}</span>
                    <span className="text-[12px] text-lake/40">·</span>
                    <span className="text-[12px] text-lake/50">{formatDate(a.publishedAt)}</span>
                  </div>
                  <h2 className="serif text-xl text-lake mt-2 leading-snug">{a.title}</h2>
                  <p className="mt-2 text-[14px] leading-6 text-lake/60 line-clamp-2">
                    {a.body.replace(/[#*]/g, '').slice(0, 160)}…
                  </p>
                </Link>
              ))}
              {filtered.length === 0 && (
                <p className="text-lake/40">No announcements in this category.</p>
              )}
            </div>
          )}
        </div>
      </PortalLayout>
    </>
  );
}

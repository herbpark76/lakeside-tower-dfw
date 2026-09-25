import { Link, useParams } from 'react-router-dom';
import { Head } from 'vite-react-ssg';
import { ArrowLeft, Pin } from 'lucide-react';
import { marked } from 'marked';
import { PortalLayout } from '../components/PortalLayout';
import { useAnnouncement } from '../data/hooks';
import { formatDate } from '../utils/format';

export function AnnouncementDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { announcement, loading } = useAnnouncement(id);

  return (
    <>
      <Head>
        <title>{announcement ? `${announcement.title} | Owner Portal` : 'Announcement | Owner Portal'} | Lakeside Tower</title>
        <meta name="description" content={announcement?.excerpt ?? 'Community announcement.'} />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <PortalLayout>
        <div className="container-narrow py-12">
          <Link
            to="/portal/announcements"
            className="inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-brass-on-light transition hover:text-lake-deep"
          >
            <ArrowLeft size={14} strokeWidth={1.5} />
            Back to Announcements
          </Link>

          {loading ? (
            <p className="mt-8 text-lake/40">Loading…</p>
          ) : !announcement ? (
            <div className="mt-12">
              <h1 className="display-4 serif text-lake">This announcement has drifted off.</h1>
              <p className="body-text mt-4 text-lake/60">
                The announcement you&rsquo;re looking for isn&rsquo;t here.
              </p>
            </div>
          ) : (
            <article className="mt-8">
              <div className="flex items-center gap-2">
                {announcement.pinned && <Pin size={13} className="text-brass-on-light" />}
                <span className="eyebrow text-brass-on-light">{announcement.category}</span>
                <span className="text-[12px] text-lake/40">·</span>
                <span className="text-[12px] text-lake/50">{formatDate(announcement.publishedAt)}</span>
              </div>
              <h1 className="display-4 serif mt-4 text-lake leading-tight">{announcement.title}</h1>
              <p className="mt-3 text-[13px] text-lake/40">By {announcement.author}</p>
              <div
                className="journal-body mt-8"
                dangerouslySetInnerHTML={{
                  __html: marked.parse(announcement.body, { async: false }) as string,
                }}
              />
            </article>
          )}
        </div>
      </PortalLayout>
    </>
  );
}

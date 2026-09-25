import { useState, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Head } from 'vite-react-ssg';
import { ArrowLeft, Pin, Paperclip, FileText } from 'lucide-react';
import { marked } from 'marked';
import { PortalLayout } from '../components/PortalLayout';
import { useAnnouncement } from '../data/hooks';
import { formatDate } from '../utils/format';

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

export function AnnouncementDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { announcement, loading } = useAnnouncement(id);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);

  return (
    <>
      <Head>
        <title>{announcement ? `${announcement.title} | Owner Portal` : 'Announcement | Owner Portal'} | Lakeside Tower</title>
        <meta name="description" content="Community announcement." />
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
              <p className="mt-3 text-[13px] text-lake/40">
                By {announcement.authorName} · {announcement.authorTitle}
              </p>
              {announcement.updatedAt && (
                <p className="mt-1 text-[12px] text-lake/30">
                  Updated {formatDate(announcement.updatedAt)}
                </p>
              )}
              <div
                className="journal-body mt-8"
                dangerouslySetInnerHTML={{
                  __html: marked.parse(announcement.body, { async: false }) as string,
                }}
              />

              {announcement.attachments && announcement.attachments.length > 0 && (
                <div className="mt-10 border-t border-lake/10 pt-6">
                  <h2 className="serif text-lg text-lake mb-4">Attachments</h2>
                  <div className="space-y-2">
                    {announcement.attachments.map((att) => (
                      <button
                        key={att.id}
                        onClick={() => showToast('Sample document — not available in demo')}
                        className="flex w-full items-center gap-3 border border-lake/10 bg-white px-4 py-3 text-left transition hover:border-brass"
                      >
                        <FileText size={16} className="shrink-0 text-brass-on-light" />
                        <span className="flex-1 text-[14px] font-semibold text-lake">{att.title}</span>
                        <span className="text-[12px] text-lake/40">{att.fileSizeLabel}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </article>
          )}
        </div>
      </PortalLayout>

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </>
  );
}

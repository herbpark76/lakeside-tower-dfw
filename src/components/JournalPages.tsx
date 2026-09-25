import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useReveal } from '@/hooks/useReveal';
import {
  journalPosts,
  getPostBySlug,
  getOtherPosts,
  formatDate,
  type JournalPost,
} from '@/data/journal';
import { Seo } from '@/components/Seo';

const SITE_URL = 'https://www.lakesidetower.com';

function Reveal({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useReveal<HTMLDivElement>();
  return <div ref={ref} data-reveal className={className}>{children}</div>;
}

function PostCard({ post, index }: { post: JournalPost; index: number }) {
  return (
    <Reveal className="journal-card">
      <a href={`/journal/${post.slug}`} className="journal-card-link">
        <div className="journal-card-img-wrap">
          <img
            src={post.heroImage}
            alt={post.heroAlt}
            className="journal-card-img"
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="journal-card-body">
          <p className="eyebrow text-brass-on-light">{formatDate(post.date)}</p>
          <h3 className="serif text-2xl text-lake mt-3 leading-tight">{post.title}</h3>
          <p className="body-text mt-3 text-lake/70 text-[15px] leading-7">{post.excerpt}</p>
          <span className="journal-card-read">
            Read <ArrowRight size={14} strokeWidth={1.5} />
          </span>
        </div>
      </a>
    </Reveal>
  );
}

export function JournalIndexPage() {
  return (
    <>
      <Seo
        title="The Lakeside Journal | Lakeside Tower"
        description="A collection of stories from the water's edge — dining, trails, travel, neighborhood life and the rituals of coming home."
        path="/journal"
      />
      <div className="relative flex min-h-[70vh] items-end overflow-hidden bg-lake text-cream">
        <div className="absolute inset-0">
          <img
            src="/assets/images/hero-sunset-1600.webp"
            alt=""
            className="h-full w-full object-cover opacity-60"
            loading="eager"
          />
        </div>
        <div className="img-overlay absolute inset-0" />
        <div className="container-wide relative z-10 pb-16 pt-36 sm:pb-24">
          <div className="max-w-3xl">
            <p className="eyebrow mb-6 text-brass-on-dark">Journal</p>
            <h1 className="display-4 serif text-cream">
              The Lakeside<br />
              <em className="font-medium">Journal.</em>
            </h1>
          </div>
        </div>
      </div>

      <section className="bg-cream section-pad">
        <div className="container-wide">
          <Reveal className="measure-narrow">
            <p className="body-text text-lg leading-8 text-lake/80">
              A collection of stories from the water&rsquo;s edge: dining, trails, travel, neighborhood life and the rituals of coming home.
            </p>
          </Reveal>

          <div className="journal-grid mt-12">
            {journalPosts.map((post, i) => (
              <PostCard key={post.slug} post={post} index={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export function JournalPostPage({ slug }: { slug: string }) {
  const post = getPostBySlug(slug);

  if (!post) {
    return (
      <>
        <Seo
          title="Post not found | Lakeside Tower"
          description="The post you're looking for isn't here."
          path="/journal"
        />
        <main id="main" className="flex min-h-screen flex-col items-center justify-center bg-cream px-6 text-center text-lake">
          <h1 className="display-4 serif text-lake">This entry has drifted off.</h1>
          <a href="/journal" className="mt-10 inline-flex items-center gap-3 bg-lake px-6 py-4 text-[13px] font-bold uppercase tracking-[0.14em] text-cream transition hover:bg-lake-deep">
            Back to the Journal <ArrowRight size={15} />
          </a>
        </main>
      </>
    );
  }

  const otherPosts = getOtherPosts(slug, 2);
  const ogImageUrl = post.heroImage.startsWith('http')
    ? post.heroImage
    : `${SITE_URL}${post.heroImage}`;

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: [ogImageUrl],
    datePublished: post.date,
    author: {
      '@type': 'Organization',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Lakeside Tower',
      url: SITE_URL,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/journal/${post.slug}`,
    },
  };

  return (
    <>
      <Seo
        title={`${post.title} | Lakeside Tower`}
        description={post.excerpt}
        path={`/journal/${post.slug}`}
        type="article"
        jsonLd={articleJsonLd}
        ogImage={ogImageUrl}
        ogImageAlt={post.heroAlt}
      />

      <main id="main">
        {/* Full-width hero */}
        <div className="relative flex min-h-[60vh] items-end overflow-hidden bg-lake">
          <div className="absolute inset-0">
            <img
              src={post.heroImage}
              alt={post.heroAlt}
              className="h-full w-full object-cover"
              loading="eager"
            />
          </div>
          <div className="img-overlay absolute inset-0" />
          <div className="container-wide relative z-10 pb-16 pt-36 sm:pb-24">
            <div className="max-w-3xl">
              <p className="eyebrow mb-4 text-brass-on-dark">
                {formatDate(post.date)}
                <span className="mx-2 opacity-50">&middot;</span>
                {post.author}
              </p>
              <h1 className="display-4 serif text-cream">{post.title}</h1>
            </div>
          </div>
        </div>

        {/* Reading column */}
        <section className="bg-cream py-16 md:py-24">
          <div className="container-narrow">
            <Reveal>
              <div
                className="journal-body"
                dangerouslySetInnerHTML={{ __html: post.bodyHtml }}
              />
            </Reveal>

            <div className="mt-16 border-t border-lake/10 pt-8">
              <a
                href="/journal"
                className="inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.14em] text-brass-on-light transition hover:text-lake-deep"
              >
                <ArrowLeft size={15} strokeWidth={1.5} />
                Back to the Journal
              </a>
            </div>

            {otherPosts.length > 0 && (
              <div className="mt-16">
                <p className="eyebrow text-brass-on-light mb-6">More from the Journal</p>
                <div className="journal-more-grid">
                  {otherPosts.map((other) => (
                    <a
                      key={other.slug}
                      href={`/journal/${other.slug}`}
                      className="journal-more-card"
                    >
                      <img
                        src={other.heroImage}
                        alt={other.heroAlt}
                        className="journal-more-img"
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="journal-more-body">
                        <p className="eyebrow text-brass-on-light">{formatDate(other.date)}</p>
                        <h3 className="serif text-xl text-lake mt-2 leading-tight">{other.title}</h3>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}

export default JournalIndexPage;

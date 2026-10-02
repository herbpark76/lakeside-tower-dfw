import { useState, useEffect, useRef, type ReactNode } from 'react';
import { Outlet, useSearchParams } from 'react-router-dom';

import {
  ArrowRight,
  ArrowUpRight,
  Menu,
  X,
  Plus,
  Minus,
} from 'lucide-react';
import { Img } from '@/components/Img';
import { Photo, heroPathToSlug } from '@/components/Photo';
import { Seo } from '@/components/Seo';
import { TonightAtTheLake } from '@/components/TonightAtTheLake';
import { WalkabilitySection } from '@/components/WalkabilityMap';
import { PhotoGallery } from '@/components/PhotoGallery';
import { JournalIndexPage, JournalPostPage } from '@/components/JournalPages';
import { journalPosts, formatDate, type JournalPost } from '@/data/journal';
import { AuthProvider } from '@/portal/auth/AuthContext';
import { RequireAuth } from '@/portal/auth/RequireAuth';
import { SignInPage } from '@/portal/pages/SignInPage';
import { PortalHomePage } from '@/portal/pages/PortalHomePage';
import { AnnouncementsPage } from '@/portal/pages/AnnouncementsPage';
import { AnnouncementDetailPage } from '@/portal/pages/AnnouncementDetailPage';
import { EventsPage } from '@/portal/pages/EventsPage';
import { EventDetailPage } from '@/portal/pages/EventDetailPage';
import { EventEditorPage } from '@/portal/pages/EventEditorPage';
import { EventsFlyerPage } from '@/portal/pages/EventsFlyerPage';
import { BuildingPage, DocumentsPage, DirectoryPage } from '@/portal/pages/PlaceholderPages';
import { useReveal, useRevealStagger } from '@/hooks/useReveal';
import { contacts } from '@/data/contacts';
import { floorPlans, type FloorPlan } from '@/data/floorPlans';
import { listings, SHOW_LISTINGS, type Listing } from '@/data/listings';
import { faqCategories } from '@/data/faq';
import { facts, timeline, governanceText, boardMembers, SHOW_BOARD_NAMES } from '@/data/about';
import { SHOW_SAMPLE_MARKERS } from '@/data/draft';
import { SampleNote } from '@/components/SampleNote';
import { SampleBlock } from '@/components/SampleBlock';

/* ── Skip to content link ── */
export function SkipLink() {
  return (
    <a href="#main" className="skip-link">
      Skip to content
    </a>
  );
}

/* ── Homepage JSON-LD: ApartmentComplex ── */
const homeJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ApartmentComplex',
  name: 'Lakeside Tower',
  url: 'https://www.lakesidetower.com',
  image: 'https://www.lakesidetower.com/assets/images/og-card-1200x630.jpg',
  numberOfAccommodationUnits: 55,
  address: {
    '@type': 'PostalAddress',
    streetAddress: '2800 Lakeside Parkway',
    addressLocality: 'Flower Mound',
    addressRegion: 'TX',
    postalCode: '75022',
    addressCountry: 'US',
  },
  amenityFeature: [
    { '@type': 'LocationFeatureSpecification', name: 'Resort-style pool with hot tub and poolside cabanas' },
    { '@type': 'LocationFeatureSpecification', name: 'Outdoor fire pit and grilling stations' },
    { '@type': 'LocationFeatureSpecification', name: 'Fitness center' },
    { '@type': 'LocationFeatureSpecification', name: 'Yoga and Pilates studio' },
    { '@type': 'LocationFeatureSpecification', name: 'GolfZon golf simulator' },
    { '@type': 'LocationFeatureSpecification', name: 'Putting green' },
    { '@type': 'LocationFeatureSpecification', name: 'Club room and lounge' },
    { '@type': 'LocationFeatureSpecification', name: 'Wine room with private dining' },
    { '@type': 'LocationFeatureSpecification', name: 'Screening room' },
    { '@type': 'LocationFeatureSpecification', name: 'Billiards lounge' },
    { '@type': 'LocationFeatureSpecification', name: 'Coffee bar' },
    { '@type': 'LocationFeatureSpecification', name: 'Concierge, twenty-four hours' },
    { '@type': 'LocationFeatureSpecification', name: 'Guest suites' },
    { '@type': 'LocationFeatureSpecification', name: 'On-site spa' },
    { '@type': 'LocationFeatureSpecification', name: 'Reserved parking in an attached garage' },
    { '@type': 'LocationFeatureSpecification', name: 'Dog park and wash station' },
  ],
};

/* ── Navigation ── */
const navItems = [
  ['The Residences', '/residences'],
  ['Life at Lakeside', '/life-at-lakeside'],
  ['Location', '/location'],
  ['Journal', '/journal'],
  ['About', '/about'],
  ['Contact', '/contact'],
] as const;

function Logo({ dark = false, small = false }: { dark?: boolean; small?: boolean }) {
  return (
    <a
      href="/"
      className={`block ${small ? 'w-28' : 'w-36 sm:w-44'} ${dark ? 'brightness-0 invert' : ''}`}
      aria-label="Lakeside Tower home"
    >
      <img
        src="/assets/images/logo-400.png"
        alt="The Lakeside Tower"
        className="h-auto w-full"
        width={200}
        height={50}
        loading="eager"
      />
    </a>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const solid = scrolled || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-30 transition-colors duration-700 ${
        solid
          ? 'bg-cream border-b border-lake/10 text-lake'
          : 'bg-transparent text-cream'
      }`}
      style={{ transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)' }}
    >
      <div className="container-wide flex h-24 items-center justify-between">
        <a
          href="/"
          className={`block w-36 sm:w-44 ${solid ? '' : 'brightness-0 invert'}`}
          aria-label="Lakeside Tower home"
        >
          <img
            src="/assets/images/logo-400.png"
            alt="The Lakeside Tower"
            className="h-auto w-full"
            width={200}
            height={50}
            loading="eager"
          />
        </a>
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary navigation">
          {navItems.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="link-underline text-[13px] font-medium uppercase tracking-[0.14em] opacity-80 transition hover:opacity-100"
            >
              {label}
            </a>
          ))}
          <a
            href="/owners"
            className="ml-2 border-l border-brass pl-6 text-[13px] font-semibold uppercase tracking-[0.14em] transition hover:text-brass-on-dark"
          >
            Owners
          </a>
        </nav>
        <button
          className="lg:hidden"
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div className="fixed inset-0 top-24 z-20 bg-lake-deep lg:hidden">
          <nav
            className="container-wide flex flex-col gap-2 py-12"
            aria-label="Mobile navigation"
          >
            {navItems.map(([label, href]) => (
              <a
                onClick={() => setOpen(false)}
                key={href}
                href={href}
                className="serif text-3xl text-cream/80 transition hover:text-cream"
              >
                {label}
              </a>
            ))}
            <a
              onClick={() => setOpen(false)}
              href="/owners"
              className="serif mt-4 border-t border-cream/15 pt-6 text-3xl text-brass-on-dark transition hover:text-cream"
            >
              Owners
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}

function ArrowLink({ children, href = '#', light = false }: { children: ReactNode; href?: string; light?: boolean }) {
  return (
    <a
      href={href}
      className={`link-arrow ${light ? 'text-cream' : 'text-lake'}`}
    >
      <span className="link-underline">{children}</span>
      <ArrowUpRight size={15} strokeWidth={1.5} />
    </a>
  );
}

function Eyebrow({ children, onTeal = false, dark = false }: { children: ReactNode; onTeal?: boolean; dark?: boolean }) {
  return (
    <p className={`eyebrow ${onTeal ? 'text-lake' : dark ? 'text-brass-on-dark' : 'text-brass-on-light'}`}>{children}</p>
  );
}

export function Footer() {
  return (
    <footer className="bg-lake-deep text-cream">
      <div className="container-wide grid gap-14 py-16 md:grid-cols-[1.2fr_1fr_1fr] md:py-20">
        <div>
          <Logo dark />
          <p className="mt-8 text-[17px] leading-7 text-cream/55 measure">
            A private home at the water&rsquo;s edge.<br />
            Flower Mound, Texas
          </p>
        </div>
        <div>
          <p className="eyebrow mb-6 text-brass-on-dark">Explore</p>
          <div className="grid gap-4 text-[17px] text-cream/70">
            {navItems.slice(0, 5).map(([label, href]) => (
              <a key={href} href={href} className="link-underline transition hover:text-cream w-fit">
                {label}
              </a>
            ))}
          </div>
        </div>
        <div>
          <p className="eyebrow mb-6 text-brass-on-dark">For our community</p>
          <div className="grid gap-4 text-[17px] text-cream/70">
            <a href="/owners" className="link-underline transition hover:text-cream w-fit">Owners</a>
            <a href="/contact" className="link-underline transition hover:text-cream w-fit">Contact</a>
            <a href="/faq" className="link-underline transition hover:text-cream w-fit">FAQ</a>
            <a href="/privacy" className="link-underline transition hover:text-cream w-fit">Privacy</a>
          </div>
        </div>
      </div>
      <div className="container-wide flex flex-col gap-3 border-t border-cream/10 py-6 text-[13px] uppercase tracking-[0.14em] text-cream/40 sm:flex-row sm:justify-between">
        <span>&copy; 2026 Lakeside Tower</span>
        <span>Real life, beautifully told.</span>
      </div>
    </footer>
  );
}

/* ── Reveal wrapper ── */
function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useReveal<HTMLDivElement>();
  return <div ref={ref} data-reveal className={className}>{children}</div>;
}

/* ── HERO ── full-bleed hero-sunset, bottom-left aligned ── */
function Hero() {
  return (
    <section className="relative flex min-h-[100svh] items-end overflow-hidden bg-lake-deep text-cream">
      <div className="absolute inset-0">
        <Img
          slug="hero-sunset"
          alt="Sunset over Lake Grapevine from Lakeside Tower"
          priority
          className="h-full w-full object-cover object-center"
        />
      </div>
      <div className="img-overlay absolute inset-0" />
      <Header />
      <div className="container-wide relative z-10 pb-14 pt-40 sm:pb-20 lg:pb-24">
        <div className="max-w-[95%] sm:max-w-[90%]">
          <p className="eyebrow mb-8 text-sand sm:mb-10">Flower Mound &middot; Texas</p>
          <h1 className="display-5 serif">
            Live at the<br />
            <em className="font-medium">water&rsquo;s edge.</em>
          </h1>
          <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
            <p className="body-text text-cream/70 max-w-xs">
              A private home overlooking Lake Grapevine.
            </p>
            <div className="flex flex-wrap items-center gap-6 sm:gap-8">
              <a
                href="/life-at-lakeside"
                className="inline-flex items-center gap-3 border-b border-cream/40 pb-3 text-[13px] font-bold uppercase tracking-[0.14em] text-cream transition hover:border-brass hover:text-brass-on-dark"
              >
                Explore life at Lakeside <ArrowRight size={15} />
              </a>
              <a
                href="/owners"
                className="inline-flex items-center gap-3 border-b border-cream/20 pb-3 text-[13px] font-semibold uppercase tracking-[0.14em] text-cream/60 transition hover:border-brass hover:text-cream"
              >
                Owners
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── 1. LAKESIDE TOWER ── cream, text left / 4:5 portrait right, overlaps into trail section ── */
function TowerSection() {
  return (
    <section id="home" className="relative bg-cream section-pad">
      <div className="container-wide">
        <Reveal className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-start lg:gap-20">
          <div className="lg:pt-8">
            <Eyebrow>Lakeside Tower</Eyebrow>
            <h2 className="display-4 serif mt-6 text-lake">
              A home to<br />
              <em className="font-medium">come back to.</em>
            </h2>
            <p className="body-text mt-6">
              A private high-rise community shaped by light, quiet and the view beyond the glass.
            </p>
            <div className="mt-8">
              <ArrowLink href="/residences">Discover the residences</ArrowLink>
            </div>
          </div>
          <div className="relative order-first lg:order-last">
            <div className="img-inset relative lg:-mb-[120px] lg:z-10">
              <Photo
                slug="tower-aerial"
                alt="Lakeside Tower overlooking Lake Grapevine from above"
                className="aspect-[4/5] w-full"
                sizes="(min-width: 1024px) 55vw, 100vw"
                objectPosition="center 40%"
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ── 2. THE TRAIL ── full-bleed dark, scroll zoom + gradient fade, caption ── */
function TrailSection() {
  return (
    <section
      className="photo-band-fade relative flex min-h-[90vh] items-end overflow-hidden bg-lake-deep text-cream"
      style={{ '--fade-top': 'var(--cream)', '--fade-bottom': 'var(--sand)' } as React.CSSProperties}
    >
      <div className="absolute inset-0">
        <div className="photo-band-zoom h-full w-full" ref={(el) => {
          if (!el) return;
          const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          if (prefersReduced || !('IntersectionObserver' in window)) {
            el.classList.add('photo-revealed');
            return;
          }
          const obs = new IntersectionObserver((entries) => {
            entries.forEach((e) => {
              if (e.isIntersecting) { e.target.classList.add('photo-revealed'); obs.unobserve(e.target); }
            });
          }, { threshold: 0.1 });
          obs.observe(el);
        }}>
          <Photo
            slug="trail-shoreline"
            alt="The Northshore Trail beginning at the edge of Lakeside Tower"
            className="h-full w-full object-cover object-center"
            sizes="100vw"
          />
        </div>
      </div>
      <div className="img-overlay absolute inset-0" />
      <div className="container-wide relative z-10 pb-16 pt-40 sm:pb-24 lg:pb-28">
        <div className="max-w-2xl">
          <Eyebrow dark>The Trail</Eyebrow>
          <h2 className="display-4 serif mt-6 text-cream">
            Twenty-two miles,<br />
            <em className="font-medium">straight from the lobby.</em>
          </h2>
          <p className="body-text mt-8 text-cream/75 max-w-lg">
            You can walk out of the building and onto the Northshore Trail. No car, no trailhead parking, no loading a bike onto a rack &mdash; the trail simply begins where the building ends.
          </p>
          <div className="photo-caption mt-8">
            <span className="photo-caption-rule" />
            <span className="photo-caption-text text-cream/60">Where the Northshore Trail begins, a morning in October.</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── 3. LAKESIDE VILLAGE ── sand, large photo + inset photo, caption ── */
function VillageSection() {
  return (
    <section className="relative bg-sand section-pad">
      <div className="container-wide">
        <Reveal className="grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:items-center lg:gap-20">
          <div className="relative">
            <div className="img-inset">
              <Photo
                slug="village-evening"
                alt="Evening patio at Lakeside Village"
                className="w-full object-cover"
                sizes="(min-width: 1024px) 60vw, 100vw"
              />
            </div>
            {/* Inset photo — overlapping lower-right corner, hidden on mobile */}
            <div className="absolute -bottom-12 -right-6 z-10 hidden w-[40%] border-6 border-cream p-0 sm:block">
              <div className="img-inset">
                <Photo
                  slug="village-daylight"
                  alt="Daytime dining at Lakeside Village"
                  className="w-full object-cover"
                  sizes="(min-width: 640px) 25vw, 100vw"
                />
              </div>
            </div>
          </div>
          <div>
            <Eyebrow>Lakeside Village</Eyebrow>
            <h2 className="display-4 serif mt-6 text-lake">
              Good days<br />
              <em className="font-medium">start close.</em>
            </h2>
            <p className="body-text mt-8 text-lake/70">
              Walk to a table in the evening. A patio for a slow afternoon. More than a dozen places to eat and drink, all of them on foot.
            </p>
            <div className="photo-caption mt-6">
              <span className="photo-caption-rule" />
              <span className="photo-caption-text">Lakeside Village, an evening in September.</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ── 4. LAKE PANORAMA BAND ── full-width, scroll zoom + gradient fades ── */
function PanoramaBand() {
  return (
    <div
      className="photo-band-fade relative w-full overflow-hidden"
      style={{ '--fade-top': 'var(--sand)', '--fade-bottom': 'var(--cream)' } as React.CSSProperties}
    >
      <div
        className="photo-band-zoom h-full w-full"
        ref={(el) => {
          if (!el) return;
          const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          if (prefersReduced || !('IntersectionObserver' in window)) {
            el.classList.add('photo-revealed');
            return;
          }
          const obs = new IntersectionObserver((entries) => {
            entries.forEach((e) => {
              if (e.isIntersecting) { e.target.classList.add('photo-revealed'); obs.unobserve(e.target); }
            });
          }, { threshold: 0.1 });
          obs.observe(el);
        }}
      >
        <Photo
          slug="lake-panorama"
          alt="Panoramic view of Lake Grapevine from Lakeside Tower"
          className="h-[400px] w-full object-cover"
          sizes="100vw"
          objectPosition="center"
        />
      </div>
    </div>
  );
}

/* ── 5. LIFE HERE ── cream, three linked cards, uniform 4:5, captions ── */
const stories = [
  ['01', 'The light you come home to.', 'balcony-sunset', '/residences#gallery', 'The light you come home to, a balcony in late summer.'] as const,
  ['02', 'A Saturday without a plan.', 'trail-shoreline', '/journal/northshore-trail-first-timers-guide', 'The Northshore Trail, where it meets the lake.'] as const,
  ['03', 'The world within reach.', 'village-street', '/location', 'Lakeside Village, the street at the foot of the tower.'] as const,
];

function StoriesSection() {
  const refs = useRevealStagger<HTMLDivElement>(3);
  return (
    <section className="bg-cream section-pad">
      <div className="container-wide">
        <Reveal className="mb-16 max-w-2xl">
          <Eyebrow>Life here</Eyebrow>
          <h2 className="display-4 serif mt-7 text-lake">
            Real life,<br />
            <em className="font-medium">beautifully told.</em>
          </h2>
        </Reveal>
        <div className="grid gap-8 sm:grid-cols-3 sm:gap-10">
          {stories.map(([num, title, image, href, caption], i) => (
            <div
              key={title}
              ref={(el) => { refs.current[i] = el; }}
              data-reveal
            >
              <a href={href} className="group block">
                <div className="img-inset overflow-hidden">
                  <div className="group-hover:scale-[1.03] transition-transform duration-700">
                    <Photo
                      slug={image as never}
                      alt={title}
                      className="aspect-[4/5] w-full"
                      sizes="(min-width: 640px) 33vw, 100vw"
                    />
                  </div>
                </div>
                <div className="mt-5 flex items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-[13px] text-brass-on-light">{num}</p>
                    <h3 className="display-2 serif mt-2 text-lake">{title}</h3>
                  </div>
                  <span className="mt-1 flex-shrink-0 text-lake transition-transform duration-300 group-hover:translate-x-1">
                    <ArrowRight size={20} strokeWidth={1.5} />
                  </span>
                </div>
                <div className="photo-caption">
                  <span className="photo-caption-rule" />
                  <span className="photo-caption-text">{caption}</span>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── 5b. FROM THE JOURNAL ── two newest posts, card images, above For our community ── */
function JournalStrip() {
  const posts = journalPosts.slice(0, 2);
  const postSlugs = posts.map((post) => heroPathToSlug(post.cardImage || post.heroImage));
  return (
    <section className="bg-sand section-pad">
      <div className="container-wide">
        <Reveal className="mb-12 max-w-2xl">
          <Eyebrow>From the Journal</Eyebrow>
          <h2 className="display-4 serif mt-7 text-lake">
            Stories from<br />
            <em className="font-medium">the water&rsquo;s edge.</em>
          </h2>
        </Reveal>
        <div className="grid gap-8 sm:grid-cols-2 sm:gap-10">
          {posts.map((post, i) => (
            <Reveal key={post.slug}>
              <a href={`/journal/${post.slug}`} className="group block">
                <div className="img-inset overflow-hidden">
                  <div className="group-hover:scale-[1.03] transition-transform duration-700">
                    <Photo
                      slug={postSlugs[i]}
                      alt={post.heroAlt}
                      className="aspect-[3/2] w-full"
                      sizes="(min-width: 640px) 50vw, 100vw"
                    />
                  </div>
                </div>
                <p className="mt-5 text-[13px] text-lake/50">
                  By {post.author || 'The Lakeside Tower Journal'} <span className="mx-1.5 opacity-50">&middot;</span> {formatDate(post.date)}
                </p>
                <h3 className="display-2 serif mt-2 text-lake">{post.title}</h3>
                <p className="body-text mt-3 text-[15px] leading-7 text-lake/70">{post.excerpt}</p>
              </a>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-10">
          <a
            href="/journal"
            className="inline-flex items-center gap-3 border-b border-lake/30 pb-3 text-[13px] font-semibold uppercase tracking-[0.14em] text-lake transition hover:border-brass hover:text-brass-on-light"
          >
            Read the Journal <ArrowRight size={15} />
          </a>
        </Reveal>
      </div>
    </section>
  );
}

/* ── 6. FOR OUR COMMUNITY ── dark, four items with brass rules ── */
function OwnersSection() {
  const items = ['Announcements', 'Events', 'Documents', 'Directory'];
  return (
    <section className="bg-lake-deep section-pad text-cream">
      <div className="container-wide">
        <Reveal className="mb-14 max-w-2xl">
          <Eyebrow dark>For our community</Eyebrow>
          <h2 className="display-4 serif mt-7 text-cream">
            Lakeside Tower,<br />
            <em className="font-medium">at home online.</em>
          </h2>
          <p className="body-text mt-8 text-cream/65">
            A private place for owners and residents to stay connected, share information and take part in life at the Tower.
          </p>
        </Reveal>
        <Reveal>
          <div className="grid gap-0 border-t border-cream/10 sm:grid-cols-4">
            {items.map((item) => (
              <div
                key={item}
                className="border-b border-cream/10 py-6 sm:border-r sm:border-cream/10 sm:last:border-r-0 sm:px-6"
              >
                <span className="block h-px w-8 bg-brass" />
                <p className="mt-4 text-[17px] font-medium text-cream/80">{item}</p>
              </div>
            ))}
          </div>
        </Reveal>
        <Reveal className="mt-12">
          <p className="eyebrow text-cream/35">Owner portal in development.</p>
          <div className="mt-8">
            <a
              href="/owners"
              className="inline-flex items-center gap-3 border-b border-cream/30 pb-3 text-[13px] font-semibold uppercase tracking-[0.14em] text-cream/70 transition hover:border-brass hover:text-cream"
            >
              Learn more <ArrowRight size={15} />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ── 7. CLOSING ── cream, centered, generous whitespace ── */
function ClosingSection() {
  return (
    <section className="bg-cream flex min-h-[50vh] items-center justify-center px-6 py-32 text-center sm:py-40">
      <div className="max-w-3xl">
        <p className="display-3 serif text-lake">
          Start with home.<br />
          <em className="font-medium">Expand to the horizon.</em>
        </p>
      </div>
    </section>
  );
}

/* ── PAGES ── */
function HomePage() {
  return (
    <>
      <Seo
        title="Lakeside Tower | Live at the water's edge"
        description="Lakeside Tower — a private home at the water's edge in Flower Mound, Texas."
        path="/"
        jsonLd={homeJsonLd}
      />
      <SkipLink />
      <main id="main">
      <Hero />
      <TonightAtTheLake />
      <TowerSection />
      <TrailSection />
      <VillageSection />
      <PanoramaBand />
      <StoriesSection />
      <JournalStrip />
      <OwnersSection />
      <ClosingSection />
      </main>
      <Footer />
    </>
  );
}

function OwnersPage() {
  const cards = [
    ['Announcements', 'Board updates and community news for Lakeside Tower owners and residents.'],
    ['Events', 'A calendar of upcoming gatherings, meetings, and social occasions at the Tower.'],
    ['Documents', 'Association documents, meeting minutes, and reference materials in one place.'],
    ['Directory', 'A private directory of owners, residents, and board contacts for the community.'],
  ] as const;
  const refs = useRevealStagger<HTMLDivElement>(4);
  return (
    <>
      <Seo
        title="Owners | Lakeside Tower"
        description="The Lakeside Tower owner portal is in development. Owners will receive access details from the board when it opens."
        path="/owners"
      />
      <SkipLink />
      <main id="main">
      <div className="relative flex min-h-[70vh] items-end overflow-hidden bg-lake text-cream">
        <div className="absolute inset-0">
          <Img
            slug="hero-sunset"
            alt=""
            className="h-full w-full object-cover opacity-50"
            sizes="100vw"
          />
        </div>
        <div className="img-overlay absolute inset-0" />
        <Header />
        <div className="container-wide relative z-10 pb-16 pt-36 sm:pb-24">
          <div className="max-w-3xl">
            <p className="eyebrow mb-6 text-brass-on-dark">For our community</p>
            <h1 className="display-4 serif text-cream">
              Lakeside Tower,<br /><em className="font-medium">at home online.</em>
            </h1>
          </div>
        </div>
      </div>
      <section className="bg-cream section-pad">
        <div className="container-wide">
          <Reveal className="mb-16 max-w-2xl">
            <p className="body-text">
              The Lakeside Tower owner portal is in development. When it launches, owners will be able to read announcements, find association documents, see what&rsquo;s coming up, and reach the board&mdash;all in one place.
            </p>
          </Reveal>
          <div className="grid gap-8 sm:grid-cols-2">
            {cards.map(([title, description], i) => (
              <div
                key={title}
                ref={(el) => { refs.current[i] = el; }}
                data-reveal
                className="border border-lake/10 p-7"
              >
                <h3 className="serif text-2xl text-lake/40">{title}</h3>
                <p className="body-text mt-4 text-muted/70">{description}</p>
              </div>
            ))}
          </div>
          <Reveal className="mt-16 max-w-2xl">
            <p className="body-text">
              Owners will receive access details from the board when the portal opens.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <ArrowLink href="/contact">Contact the board</ArrowLink>
              <a
                href="/portal/sign-in"
                className="link-arrow text-lake/50 transition hover:text-lake"
              >
                <span className="link-underline">Preview the owner portal (demo)</span>
                <ArrowUpRight size={15} strokeWidth={1.5} />
              </a>
            </div>
          </Reveal>
        </div>
      </section>
      </main>
      <Footer />
    </>
  );
}

function LocationPage() {
  const places = [
    ['Lakeside Tower', 'The building itself, on the north shore of Lake Grapevine.'],
    ['Lakeside Village', 'A walkable collection of restaurants and shops at the foot of the tower.'],
    ['Flower Mound', 'The town Lakeside Tower calls home, named for a wildflower-covered mound.'],
    ['Dallas\u2013Fort Worth', 'The metroplex, reachable in under an hour for work, culture, and sport.'],
    ['DFW Airport', 'The airport\u2019s north entrance is about seven minutes away.'],
  ];
  return (
    <>
      <Seo
        title="Location | Lakeside Tower"
        description="Lakeside Tower on the north shore of Lake Grapevine in Flower Mound, Texas — close to everything, far from the noise."
        path="/location"
      />
      <SkipLink />
      <main id="main">
      {/* Hero: lake-panorama wide band */}
      <div className="relative flex min-h-[70vh] items-end overflow-hidden bg-lake text-cream">
        <div className="absolute inset-0">
          <Img
            slug="lake-panorama"
            alt=""
            className="h-full w-full object-cover opacity-60"
            sizes="100vw"
          />
        </div>
        <div className="img-overlay absolute inset-0" />
        <Header />
        <div className="container-wide relative z-10 pb-16 pt-36 sm:pb-24">
          <div className="max-w-3xl">
            <p className="eyebrow mb-6 text-brass-on-dark">Location</p>
            <h1 className="display-4 serif text-cream">
              Close to everything.<br />
              <em className="font-medium">Far from the noise.</em>
            </h1>
            <p className="body-text mt-8 text-cream/70 max-w-xl">
              Lakeside Tower sits on the north shore of Lake Grapevine in Flower Mound, Texas &mdash; a stretch of water the Army Corps of Engineers impounded in 1952 and still manages today. Seven thousand acres, sixty miles of shoreline, and a horizon that changes by the hour.
            </p>
          </div>
        </div>
      </div>

      {/* THE WALK — sand, village-evening left / text right */}
      <section className="bg-sand section-pad">
        <div className="container-wide">
          <Reveal className="grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:items-center lg:gap-20">
            <div className="img-inset">
              <Img
                slug="village-evening"
                alt="Evening at Lakeside Village"
                className="w-full object-cover"
                sizes="(min-width: 1024px) 60vw, 100vw"
              />
            </div>
            <div>
              <Eyebrow>The Walk</Eyebrow>
              <h2 className="display-4 serif mt-6 text-lake">
                Good days<br />
                <em className="font-medium">start close.</em>
              </h2>
              <p className="body-text mt-8 text-lake/70">
                Lakeside Village begins at the foot of the building. More than a dozen places to eat and drink are within walking distance &mdash; a wine bar, a Texas kitchen, sushi, Tex-Mex, an Italian trattoria, a wood-fired pizzeria, a gelato counter, a movie house that serves dinner. Some evenings the walk home is the best part.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <WalkabilitySection />

      {/* THE TRAIL — full-bleed dark, trail-shoreline */}
      <section className="relative flex min-h-[90vh] items-end overflow-hidden bg-lake-deep text-cream">
        <div className="absolute inset-0">
          <Img
            slug="trail-shoreline"
            alt="The Northshore Trail beginning at the edge of Lakeside Tower"
            className="h-full w-full object-cover object-center"
            sizes="100vw"
          />
        </div>
        <div className="img-overlay absolute inset-0" />
        <div className="container-wide relative z-10 pb-16 pt-40 sm:pb-24 lg:pb-28">
          <div className="max-w-2xl">
            <Eyebrow dark>The Trail</Eyebrow>
            <h2 className="display-4 serif mt-6 text-cream">
              Twenty-two miles,<br />
              <em className="font-medium">straight from the lobby.</em>
            </h2>
            <p className="body-text mt-8 text-cream/75 max-w-lg">
              You can walk out of the building and onto the Northshore Trail. No car, no trailhead parking, no loading a bike onto a rack &mdash; the trail simply begins where the building ends.
            </p>
            <p className="body-text mt-6 text-cream/60 max-w-lg">
              It runs roughly twenty-two miles along the north shore of Lake Grapevine, from Rockledge Park in the east to Twin Coves Park in the west. Single-track, and single-purpose: hiking, running and mountain biking, no horses. It closes to bikes when the ground is wet, though walking stays open. Dogs are welcome on a leash.
            </p>
          </div>
        </div>
      </section>

      {/* THE REGION — cream */}
      <section className="bg-cream section-pad">
        <div className="container-wide">
          <Reveal className="measure-narrow">
            <Eyebrow>The Region</Eyebrow>
            <h2 className="display-4 serif mt-6 text-lake">
              Easy to leave.<br />
              <em className="font-medium">Better to return.</em>
            </h2>
            <p className="body-text mt-8">
              DFW International sits just south across the water. The airport&rsquo;s north entrance is about seven minutes away &mdash; close enough that a morning flight doesn&rsquo;t require a pre-dawn start, far enough that you never hear it.
            </p>
          </Reveal>
        </div>
      </section>

      {/* PLACE LIST — sand, vertical, brass rules */}
      <section className="bg-sand section-pad">
        <div className="container-wide">
          <Reveal>
            <div className="border-t border-lake/10">
              {places.map(([name, description]) => (
                <div
                  key={name}
                  className="grid gap-2 border-b border-lake/10 py-6 sm:grid-cols-[1fr_1.5fr] sm:gap-12 sm:py-8"
                >
                  <div className="flex items-center gap-4">
                    <span className="h-px w-8 bg-brass" />
                    <p className="serif text-xl text-lake">{name}</p>
                  </div>
                  <p className="body-text text-muted">{description}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      </main>
      <Footer />
    </>
  );
}

/* ── Floor plan card ── */
function FloorPlanPlaceholderSVG() {
  return (
    <svg
      viewBox="0 0 200 140"
      className="h-auto w-full"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      aria-hidden="true"
    >
      <rect x="10" y="10" width="180" height="120" rx="2" />
      <line x1="10" y1="55" x2="115" y2="55" />
      <line x1="115" y1="10" x2="115" y2="75" />
      <line x1="115" y1="75" x2="190" y2="75" />
      <line x1="10" y1="95" x2="115" y2="95" />
      <line x1="60" y1="55" x2="60" y2="130" />
      <rect x="14" y="14" width="40" height="37" rx="1" />
      <rect x="120" y="14" width="66" height="57" rx="1" />
      <rect x="14" y="59" width="42" height="32" rx="1" />
      <rect x="64" y="99" width="48" height="27" rx="1" />
      <rect x="120" y="79" width="66" height="47" rx="1" />
    </svg>
  );
}

function FloorPlanCard({ plan }: { plan: FloorPlan }) {
  return (
    <div className="relative rounded-sm border border-lake/10 bg-card p-6">
      <div className="mb-4 flex items-start justify-between gap-3">
        <h3 className="serif text-2xl text-lake">{plan.name}</h3>
        <SampleNote />
      </div>

      <div className="grid gap-6 sm:grid-cols-[1fr_1fr]">
        <dl className="space-y-1.5 text-[13px] text-lake/70">
          <div className="flex justify-between gap-4">
            <dt className="text-lake/40">Bedrooms</dt>
            <dd>{plan.beds}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-lake/40">Bathrooms</dt>
            <dd>{plan.baths}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-lake/40">Interior</dt>
            <dd>{plan.sqft}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-lake/40">Balcony</dt>
            <dd>{plan.balcony}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-lake/40">Floors</dt>
            <dd>{plan.floors}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-lake/40">Exposure</dt>
            <dd>{plan.exposure}</dd>
          </div>
        </dl>

        <div className="flex flex-col">
          <div className="flex-1 rounded-sm border border-lake/8 bg-cream p-4 text-brass-light/60">
            {plan.planImage ? (
              <img src={plan.planImage} alt={`${plan.name} floor plan`} className="h-auto w-full" />
            ) : (
              <FloorPlanPlaceholderSVG />
            )}
          </div>
          <p className="mt-2 text-center text-[11px] uppercase tracking-[0.12em] text-lake/30">
            {plan.planImage ? 'Floor plan' : 'Plan drawing to come'}
          </p>
        </div>
      </div>

      <ul className="mt-5 space-y-1 text-[13px] text-lake/60">
        {plan.highlights.map((h) => (
          <li key={h} className="flex items-start gap-2">
            <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-brass" />
            {h}
          </li>
        ))}
      </ul>

      <a
        href="/contact?topic=buying"
        className="link-arrow mt-6 text-lake"
      >
        <span className="link-underline">Ask about this plan</span>
        <ArrowUpRight size={14} strokeWidth={1.5} />
      </a>
    </div>
  );
}

function ResidencesPage() {
  const amenityGroups = [
    ['The water', 'Resort-style pool with hot tub and poolside cabanas; outdoor fire pit and grilling stations.'],
    ['Movement', 'Fitness center; yoga and Pilates studio; GolfZon golf simulator; putting green.'],
    ['Gathering', 'Club room and lounge; wine room with private dining; screening room; billiards lounge; coffee bar.'],
    ['Service', 'Concierge, twenty-four hours; guest suites; on-site spa; reserved parking in an attached garage; dog park and wash station.'],
  ] as const;
  const refs = useRevealStagger<HTMLDivElement>(4);
  return (
    <>
      <Seo
        title="The Residences | Lakeside Tower"
        description="Fifty-five residences across sixteen floors at Lakeside Tower — a private place to be yourself, overlooking Lake Grapevine."
        path="/residences"
      />
      <SkipLink />
      <main id="main">
      {/* Hero: tower-aerial */}
      <div className="relative flex min-h-[70vh] items-end overflow-hidden bg-lake text-cream">
        <div className="absolute inset-0">
          <Img
            slug="tower-aerial"
            alt=""
            className="h-full w-full object-cover opacity-60"
            sizes="100vw"
          />
        </div>
        <div className="img-overlay absolute inset-0" />
        <Header />
        <div className="container-wide relative z-10 pb-16 pt-36 sm:pb-24">
          <div className="max-w-3xl">
            <p className="eyebrow mb-6 text-brass-on-dark">The Residences</p>
            <h1 className="display-4 serif text-cream">
              A private place<br />
              <em className="font-medium">to be yourself.</em>
            </h1>
          </div>
        </div>
      </div>

      {/* Intro — cream */}
      <section className="bg-cream section-pad">
        <div className="container-wide">
          <Reveal className="measure-narrow space-y-6">
            <p className="body-text text-lg leading-8 text-lake/80">
              Fifty-five residences across sixteen floors. Two to four bedrooms, from roughly thirteen hundred square feet to nearly six thousand.
            </p>
            <p className="body-text text-lg leading-8 text-lake/80">
              Ten-foot ceilings. Glass doors that fold away onto the balcony. An elevator that opens into the residence rather than a corridor.
            </p>
            <p className="body-text text-lg leading-8 text-lake/80">
              The building is Mediterranean in character &mdash; warm stone, deep shade, a posture that suits the water it faces.
            </p>
          </Reveal>
        </div>
      </section>

      {/* WHAT'S HERE — four groups + tall 4:5 tower photo offset 80px lower */}
      <section className="bg-cream pb-[var(--space-xl)] md:pb-[var(--space-2xl)]">
        <div className="container-wide">
          <Reveal className="mb-12">
            <Eyebrow>What&rsquo;s here</Eyebrow>
          </Reveal>
          <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-20">
            <div className="border-t border-lake/10">
              {amenityGroups.map(([heading, body], i) => (
                <div
                  key={heading}
                  ref={(el) => { refs.current[i] = el; }}
                  data-reveal
                  className="grid gap-2 border-b border-lake/10 py-7 sm:grid-cols-[1fr_2fr] sm:gap-16 sm:py-9"
                >
                  <h3 className="eyebrow text-brass-on-light">{heading}</h3>
                  <p className="body-text">{body}</p>
                </div>
              ))}
            </div>
            <div className="relative hidden lg:block">
              <div className="img-inset sticky top-32 lg:mt-20">
                <Photo
                  slug="tower-aerial"
                  alt="Lakeside Tower on the north shore of Lake Grapevine"
                  className="aspect-[4/5] w-full"
                  sizes="(min-width: 1024px) 35vw, 100vw"
                  objectPosition="center 30%"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FLOOR PLANS */}
      <section className="bg-sand section-pad">
        <div className="container-wide">
          <Reveal>
            <Eyebrow>Floor plans</Eyebrow>
            <h2 className="display-4 serif mt-6 text-lake">
              Room to<br />
              <em className="font-medium">spread out.</em>
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:gap-8">
            {floorPlans.map((plan) => (
              <FloorPlanCard key={plan.id} plan={plan} />
            ))}
          </div>
          <p className="mt-8 text-[13px] text-lake/40">
            Plans, dimensions and square footage are approximate and vary by residence.
          </p>
        </div>
      </section>

      <PhotoGallery />

      {/* Editorial moment — "A room for bad weather." */}
      <section className="bg-sand section-pad">
        <div className="container-wide">
          <Reveal className="mx-auto max-w-[640px] text-center">
            <span className="mx-auto block h-px w-12 bg-brass" />
            <h2 className="display-3 serif text-lake mt-8">
              A room for<br />
              <em className="font-medium">bad weather.</em>
            </h2>
            <p className="body-text mt-8 text-lake/70 mx-auto max-w-md">
              There&rsquo;s a GolfZon simulator downstairs. In August, when the putting green is a bad idea by ten in the morning, it turns out to be the most-used room in the building.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Close */}
      <section className="bg-cream section-pad">
        <div className="container-wide">
          <Reveal className="measure-narrow">
            <p className="body-text text-lg leading-8 text-lake/80">
              Lakeside Tower sold out during its original release. Residences become available through resale from time to time.
            </p>
          </Reveal>
        </div>
      </section>

      {/* INTERESTED IN A RESIDENCE? */}
      <section className="bg-lake-deep section-pad text-cream">
        <div className="container-wide">
          <Reveal>
            <p className="eyebrow mb-6 text-brass-on-dark">Residences available</p>
            <h2 className="display-4 serif text-cream">
              Your view is<br />
              <em className="font-medium">waiting.</em>
            </h2>
          </Reveal>

          {SHOW_LISTINGS && listings.length > 0 ? (
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:gap-8">
              {listings.map((listing) => (
                <SampleBlock key={listing.id} className="!border-brass-light/20">
                  <div className="flex items-center gap-3">
                    <h3 className="serif text-2xl text-cream">{listing.name}</h3>
                  </div>
                  <dl className="mt-4 space-y-1 text-[14px] text-cream/70">
                    <div className="flex justify-between">
                      <dt className="text-cream/40">Bedrooms</dt>
                      <dd>{listing.beds}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-cream/40">Bathrooms</dt>
                      <dd>{listing.baths}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-cream/40">Square feet</dt>
                      <dd>{listing.sqft}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-cream/40">Exposure</dt>
                      <dd>{listing.exposure}</dd>
                    </div>
                    <div className="flex justify-between border-t border-cream/10 pt-2 mt-2">
                      <dt className="text-cream/40">Price</dt>
                      <dd className="font-semibold text-brass-on-dark">{listing.price}</dd>
                    </div>
                  </dl>
                  <p className="mt-3 text-[12px] text-cream/40">{listing.listedBy}</p>
                </SampleBlock>
              ))}
            </div>
          ) : (
            <Reveal className="mt-12">
              <p className="body-text text-cream/60 max-w-md">
                No residences are listed right now.{' '}
                <a href="/contact?topic=buying" className="link-underline text-brass-on-dark">
                  Ask to be told when one is.
                </a>
              </p>
            </Reveal>
          )}

          <div className="mt-12 flex flex-col gap-4 sm:flex-row">
            <a
              href="/contact?topic=buying"
              className="inline-flex items-center gap-3 bg-brass px-6 py-4 text-[13px] font-bold uppercase tracking-[0.14em] text-lake-deep transition hover:brightness-110"
            >
              Ask about buying <ArrowRight size={15} />
            </a>
            <a
              href="/faq"
              className="inline-flex items-center gap-3 border border-cream/25 px-6 py-4 text-[13px] font-semibold uppercase tracking-[0.14em] text-cream/80 transition hover:border-brass-light hover:text-cream"
            >
              Read the FAQ
            </a>
          </div>
        </div>
      </section>

      </main>
      <Footer />
    </>
  );
}

/* ── /life-at-lakeside ── */
const calendarCards = [
  { title: 'A string quartet by candlelight', body: 'Cocktails on the amenity deck, then a quartet from the Dallas Symphony Orchestra.' },
  { title: 'Oktoberfest with the neighbors', body: 'Schnitzel, pretzels and a local taproom\u2019s beer tasting on the deck.' },
  { title: 'Tower Talks', body: 'Residents share their travels, ten minutes and a slideshow each.' },
  { title: 'Coffee with management', body: 'An open hour to talk events, maintenance and building questions.' },
  { title: 'A Halloween garden party', body: 'The fountain becomes a cauldron; costumes optional, contest serious.' },
];

function LifeAtLakesidePage() {
  return (
    <>
      <Seo
        title="Life at Lakeside | Lakeside Tower"
        description="Real life, beautifully told — a day at Lakeside Tower, from the trail to the village to the water."
        path="/life-at-lakeside"
      />
      <SkipLink />
      <main id="main">
      {/* Hero: village-dining */}
      <div className="relative flex min-h-[70vh] items-end overflow-hidden bg-lake text-cream">
        <div className="absolute inset-0">
          <Img
            slug="village-dining"
            alt=""
            className="h-full w-full object-cover opacity-60"
            sizes="100vw"
          />
        </div>
        <div className="img-overlay absolute inset-0" />
        <Header />
        <div className="container-wide relative z-10 pb-16 pt-36 sm:pb-24">
          <div className="max-w-3xl">
            <p className="eyebrow mb-6 text-brass-on-dark">Life at Lakeside</p>
            <h1 className="display-4 serif text-cream">
              Real life,<br />
              <em className="font-medium">beautifully told.</em>
            </h1>
          </div>
        </div>
      </div>

      {/* 1. A Saturday without a plan — cream, large trail photo + trail-woods inset */}
      <section className="bg-cream section-pad">
        <div className="container-wide">
          <Reveal className="grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:items-start lg:gap-20">
            <div className="lg:pt-8">
              <Eyebrow>01</Eyebrow>
              <h2 className="display-4 serif mt-6 text-lake">
                A Saturday<br />
                <em className="font-medium">without a plan.</em>
              </h2>
              <p className="body-text mt-8 text-lake/70 max-w-md">
                Coffee first, on the balcony, while the lake decides what color it&rsquo;s going to be. Then the trail &mdash; an hour under the trees, or three if the morning holds. Lunch on a patio downstairs. The afternoon goes wherever it wants. By evening the light comes back through the west windows and the day closes itself.
              </p>
              <p className="serif text-2xl leading-snug text-lake/85 mt-8 max-w-md">
                The luxury isn&rsquo;t any single part of that. It&rsquo;s that none of it required arranging.
              </p>
            </div>
            <div className="relative order-first lg:order-last">
              <div className="img-inset relative">
                <Photo
                  slug="trail-shoreline"
                  alt="The Northshore Trail where it meets the lake"
                  className="aspect-[4/5] w-full"
                  sizes="(min-width: 1024px) 60vw, 100vw"
                />
              </div>
              {/* Inset trail-woods photo — overlapping lower-left corner */}
              <div className="absolute -bottom-10 -left-6 z-10 hidden w-[38%] border-6 border-cream sm:block">
                <div className="img-inset">
                  <Photo
                    slug="trail-woods"
                    alt="Light through the trees on the Northshore Trail"
                    className="w-full"
                    sizes="(min-width: 640px) 25vw, 100vw"
                  />
                </div>
              </div>
              {/* Caption right-aligned to clear the overlapping inset on the left */}
              <div className="photo-caption mt-3 sm:mt-14 justify-end">
                <span className="photo-caption-rule" />
                <span className="photo-caption-text">The Northshore Trail, a Saturday morning.</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 2. Good days start close — sand, wide 3:2 image overlapping into next section */}
      <section className="bg-sand section-pad">
        <div className="container-wide">
          <Reveal className="grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:items-start lg:gap-20">
            <div>
              <div className="img-inset relative lg:-mb-[100px] lg:z-10">
                <Photo
                  slug="village-evening"
                  alt="Evening atmosphere on the patio at Lakeside Village"
                  className="aspect-[3/2] w-full"
                  sizes="(min-width: 1024px) 60vw, 100vw"
                />
              </div>
              {/* Caption sits directly under the photo, aligned to its left edge */}
              <div className="photo-caption mt-3">
                <span className="photo-caption-rule" />
                <span className="photo-caption-text">Lakeside Village at dinnertime.</span>
              </div>
            </div>
            <div className="lg:pt-8">
              <Eyebrow>02</Eyebrow>
              <h2 className="display-4 serif mt-6 text-lake">
                Good days<br />
                <em className="font-medium">start close.</em>
              </h2>
              <p className="body-text mt-8 text-lake/70 max-w-md">
                A wine bar for a Tuesday. A Texas kitchen when someone visits. Sushi, Tex-Mex, an Italian room with a short menu, a pizzeria with a wood fire, a chocolate shop that has no business being this good. A movie house that serves dinner while you watch.
              </p>
              <p className="body-text mt-6 text-lake/70 max-w-md">
                All of it on foot. None of it requiring a car, a reservation made three weeks out, or a drive home afterward.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 3. The water — full-bleed dark, scroll zoom + gradient fades */}
      <section
        className="photo-band-fade relative flex min-h-[80vh] items-end overflow-hidden bg-lake-deep text-cream"
        style={{ '--fade-top': 'var(--sand)', '--fade-bottom': 'var(--lake-deep)' } as React.CSSProperties}
      >
        <div className="absolute inset-0">
          <div className="photo-band-zoom h-full w-full" ref={(el) => {
            if (!el) return;
            const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (prefersReduced || !('IntersectionObserver' in window)) {
              el.classList.add('photo-revealed');
              return;
            }
            const obs = new IntersectionObserver((entries) => {
              entries.forEach((e) => {
                if (e.isIntersecting) { e.target.classList.add('photo-revealed'); obs.unobserve(e.target); }
              });
            }, { threshold: 0.1 });
            obs.observe(el);
          }}>
            <Photo
              slug="hero-sunset"
              alt="Sunset over Lake Grapevine"
              className="h-full w-full"
              sizes="100vw"
            />
          </div>
        </div>
        <div className="img-overlay absolute inset-0" />
        <div className="container-wide relative z-10 pb-16 pt-40 sm:pb-24 lg:pb-28">
          <div className="max-w-xl">
            <Eyebrow dark>03</Eyebrow>
            <h2 className="display-4 serif mt-6 text-cream">
              The<br />
              <em className="font-medium">water.</em>
            </h2>
            <p className="body-text mt-8 text-cream/75 max-w-lg">
              Seven thousand acres. Sixty miles of shoreline. The Corps has kept this lake since 1952 and it still looks like it belongs to no one, which is the point.
            </p>
            <p className="body-text mt-6 text-cream/60 max-w-lg">
              Mornings it&rsquo;s glass. Afternoons it turns to chop and sailboats. Evenings it goes gold and then copper and then dark, and you find you&rsquo;ve been watching it for twenty minutes.
            </p>
            <div className="photo-caption mt-8">
              <span className="photo-caption-rule" />
              <span className="photo-caption-text text-cream/60">Lake Grapevine, just after sunset.</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. At the tower — typography-led calendar preview */}
      <section className="bg-sand section-pad">
        <div className="container-wide">
          <Reveal>
            <Eyebrow>At the tower</Eyebrow>
            <h2 className="display-4 serif mt-6 text-lake">
              A full<br />
              <em className="font-medium">calendar.</em>
            </h2>
            <p className="body-text mt-8 max-w-lg text-lake/70">
              Most months, there&rsquo;s something on the calendar most weeks. A recent October looked like this:
            </p>
          </Reveal>
          <Reveal className="mt-10 grid grid-cols-1 gap-px bg-brass/20 sm:grid-cols-2 lg:grid-cols-5">
            {calendarCards.map((card) => (
              <div key={card.title} className="flex min-h-[220px] flex-col bg-sand p-6">
                <div className="h-px w-8 bg-brass/50" />
                <h3 className="serif text-[20px] leading-snug text-lake mt-5">{card.title}</h3>
                <p className="body-text mt-3 text-[14px] leading-relaxed text-lake/60">{card.body}</p>
              </div>
            ))}
          </Reveal>
          <Reveal className="mt-10">
            <a
              href="/owners"
              className="inline-flex items-center gap-3 border-b border-lake/30 pb-3 text-[13px] font-semibold uppercase tracking-[0.14em] text-lake transition hover:border-brass hover:text-brass-on-light"
            >
              Owners see the full calendar and RSVP in the owner portal <ArrowRight size={15} />
            </a>
          </Reveal>
        </div>
      </section>

      </main>
      <Footer />
    </>
  );
}

/* ── /about ── */
function AboutPage() {
  return (
    <>
      <Seo
        title="About | Lakeside Tower"
        description="Lakeside Tower is a private residential community of fifty-five residences on the north shore of Lake Grapevine in Flower Mound, Texas."
        path="/about"
      />
      <SkipLink />
      <main id="main">
      <div className="relative flex min-h-[70vh] items-end overflow-hidden bg-lake text-cream">
        <div className="absolute inset-0">
          <Img
            slug="village-signage"
            alt=""
            className="h-full w-full object-cover opacity-60"
            sizes="100vw"
          />
        </div>
        <div className="img-overlay absolute inset-0" />
        <Header />
        <div className="container-wide relative z-10 pb-16 pt-36 sm:pb-24">
          <div className="max-w-3xl">
            <p className="eyebrow mb-6 text-brass-on-dark">About Lakeside Tower</p>
            <h1 className="display-4 serif text-cream">
              A home with<br />
              <em className="font-medium">a point of view.</em>
            </h1>
          </div>
        </div>
      </div>

      {/* FACTS STRIP */}
      <section className="bg-cream section-pad">
        <div className="container-wide">
          <Reveal className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-6">
            {facts.map((fact) => (
              <div key={fact.label} className="min-w-0 text-center md:text-left">
                <p className="serif text-5xl text-lake sm:text-6xl">{fact.value}</p>
                <p className="mt-2 text-[13px] uppercase tracking-[0.1em] text-lake/50">{fact.label}</p>
                {fact.sample && (
                  <div className="mt-2 flex justify-center md:justify-start">
                    <SampleNote />
                  </div>
                )}
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* THE STORY SO FAR */}
      <section className="bg-sand section-pad">
        <div className="container-wide">
          <Reveal>
            <div className="flex items-center gap-3">
              <Eyebrow>The story so far</Eyebrow>
              <SampleNote />
            </div>
            <h2 className="display-4 serif mt-6 text-lake">
              How we<br />
              <em className="font-medium">got here.</em>
            </h2>
            <ol className="mt-10 max-w-[760px] space-y-0">
              {timeline.map((entry) => (
                <li key={entry.year} className="relative flex gap-6 pb-8 last:pb-0">
                  <div className="flex flex-col items-center">
                    <span className="h-2.5 w-2.5 flex-shrink-0 rounded-full bg-brass" />
                    <span className="mt-1 w-px flex-1 bg-lake/15" />
                  </div>
                  <div className="min-w-0 pb-1">
                    <p className="font-mono text-[14px] text-brass-on-light">{entry.year}</p>
                    <p className="body-text mt-1 text-[15px] leading-relaxed text-lake/70">{entry.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      {/* HOW THE BUILDING IS RUN */}
      <section className="bg-cream section-pad">
        <div className="container-wide">
          <Reveal>
            <Eyebrow>How the building is run</Eyebrow>
            <h2 className="display-4 serif mt-6 text-lake">
              Owners at<br />
              <em className="font-medium">the helm.</em>
            </h2>
            <SampleBlock className="mt-8 max-w-[760px]">
              <p className="body-text text-[15px] leading-relaxed text-lake/70">{governanceText}</p>
            </SampleBlock>
          </Reveal>
        </div>
      </section>

      {/* THE BOARD */}
      <section className="bg-sand section-pad">
        <div className="container-wide">
          <Reveal>
            <Eyebrow>The board</Eyebrow>
            <h2 className="display-4 serif mt-6 text-lake">
              Elected by owners,<br />
              <em className="font-medium">for owners.</em>
            </h2>
          </Reveal>
          <Reveal className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {boardMembers.map((member) => (
              <div key={member.role} className="min-w-0 rounded-sm border border-lake/10 bg-card p-5">
                <h3 className="serif text-[20px] leading-snug text-lake">{member.role}</h3>
                {SHOW_BOARD_NAMES ? (
                  <>
                    <p className="mt-3 text-[14px] text-lake/60">{member.name}</p>
                    <div className="mt-3 max-w-full">
                      <SampleNote />
                    </div>
                  </>
                ) : null}
              </div>
            ))}
          </Reveal>
          <Reveal className="mt-10">
            <a
              href="/contact?topic=board"
              className="inline-flex items-center gap-3 border-b border-lake/30 pb-3 text-[13px] font-semibold uppercase tracking-[0.14em] text-lake transition hover:border-brass hover:text-brass-on-light"
            >
              Contact the board <ArrowRight size={15} />
            </a>
          </Reveal>
        </div>
      </section>

      {/* THIS SITE */}
      <section className="bg-cream section-pad">
        <div className="container-wide">
          <Reveal className="measure-narrow">
            <Eyebrow>This site</Eyebrow>
            <p className="body-text mt-6 text-lake/70 max-w-lg">
              This website is maintained by the Lakeside Tower community. It exists to introduce the building to people discovering it for the first time, and to serve as the online home of the people who already live here.
            </p>
          </Reveal>
        </div>
      </section>

      </main>
      <Footer />
    </>
  );
}

/* ── /contact ── */
function ContactCard({ entry, highlighted }: { entry: typeof contacts[number]; highlighted: boolean }) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (highlighted && cardRef.current) {
      requestAnimationFrame(() => {
        setTimeout(() => {
          cardRef.current?.scrollIntoView({ block: 'center', behavior: 'instant' });
        }, 100);
      });
    }
  }, [highlighted]);

  return (
    <div
      ref={cardRef}
      id={`contact-${entry.id}`}
      className={`relative flex min-w-0 flex-col rounded-sm border p-6 transition-colors duration-700 ${
        highlighted
          ? 'border-brass/50 bg-brass/5'
          : 'border-lake/10 bg-card'
      }`}
    >
      <h3 className="serif text-[22px] leading-snug text-lake">{entry.name}</h3>
      <div className="mt-2 max-w-full">
        <SampleNote />
      </div>
      <p className="body-text mt-4 text-[14px] text-lake/70">{entry.for}</p>

      <div className="mt-4 space-y-1.5">
        {entry.phone && (
          <a
            href={`tel:${entry.phone.replace(/[^0-9]/g, '')}`}
            className="block text-[16px] leading-relaxed text-lake no-underline hover:text-brass-on-light"
            style={{ overflowWrap: 'anywhere' }}
          >
            {entry.phone}
          </a>
        )}
        {entry.email && (
          <a
            href={`mailto:${entry.email}`}
            className="block text-[16px] leading-relaxed text-lake no-underline hover:text-brass-on-light"
            style={{ overflowWrap: 'anywhere' }}
          >
            {entry.email}
          </a>
        )}
      </div>

      {entry.hours && (
        <p className="mt-4 text-[13px] text-lake/50">{entry.hours}</p>
      )}
      {entry.note && (
        <p className="mt-3 text-[13px] italic text-lake/50">{entry.note}</p>
      )}
    </div>
  );
}

function ContactPage() {
  const [searchParams] = useSearchParams();
  const topicId = searchParams.get('topic');
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  useEffect(() => {
    if (topicId && contacts.some((c) => c.id === topicId)) {
      setHighlightedId(topicId);
    }
  }, [topicId]);

  return (
    <>
      <Seo
        title="Contact | Lakeside Tower"
        description="Contact Lakeside Tower at 2800 Lakeside Parkway, Flower Mound, TX 75022."
        path="/contact"
      />
      <SkipLink />
      <main id="main">
      <div className="relative flex min-h-[70vh] items-end overflow-hidden bg-lake text-cream">
        <div className="absolute inset-0">
          <Img
            slug="village-evening"
            alt=""
            className="h-full w-full object-cover opacity-60"
            sizes="100vw"
          />
        </div>
        <div className="img-overlay absolute inset-0" />
        <Header />
        <div className="container-wide relative z-10 pb-16 pt-36 sm:pb-24">
          <div className="max-w-3xl">
            <p className="eyebrow mb-6 text-brass-on-dark">Contact</p>
            <h1 className="display-4 serif text-cream">
              Let&rsquo;s<br />
              <em className="font-medium">talk.</em>
            </h1>
          </div>
        </div>
      </div>

      <section className="bg-cream section-pad">
        <div className="container-wide">
          <Reveal>
            <Eyebrow>Address</Eyebrow>
            <div className="mt-6 space-y-1">
              <p className="body-text text-lake">Lakeside Tower</p>
              <p className="body-text text-lake/70">2800 Lakeside Parkway</p>
              <p className="body-text text-lake/70">Flower Mound, TX 75022</p>
            </div>
          </Reveal>

          <Reveal className="mt-12 md:mt-16">
            <Eyebrow>How to reach us</Eyebrow>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {contacts.map((entry) => (
                <ContactCard
                  key={entry.id}
                  entry={entry}
                  highlighted={highlightedId === entry.id}
                />
              ))}
            </div>
            <p className="mt-8 text-[13px] text-lake/40">
              In an emergency, call 911 first, then the front desk.
            </p>
          </Reveal>
        </div>
      </section>

      </main>
      <Footer />
    </>
  );
}

/* ── /privacy ── */
function PrivacyPage() {
  return (
    <>
      <Seo
        title="Privacy | Lakeside Tower"
        description="Lakeside Tower's privacy policy — this site currently collects nothing. No analytics, no cookies, no tracking."
        path="/privacy"
      />
      <SkipLink />
      <main id="main">
      <div className="relative flex min-h-[70vh] items-end overflow-hidden bg-lake text-cream">
        <div className="absolute inset-0">
          <Img
            slug="hero-sunset"
            alt=""
            className="h-full w-full object-cover opacity-60"
            sizes="100vw"
          />
        </div>
        <div className="img-overlay absolute inset-0" />
        <Header />
        <div className="container-wide relative z-10 pb-16 pt-36 sm:pb-24">
          <div className="max-w-3xl">
            <p className="eyebrow mb-6 text-brass-on-dark">Privacy</p>
            <h1 className="display-4 serif text-cream">
              Your<br />
              <em className="font-medium">privacy.</em>
            </h1>
          </div>
        </div>
      </div>

      <section className="bg-cream section-pad">
        <div className="container-wide">
          <Reveal className="measure-narrow space-y-8">
            <p className="body-text text-lg leading-8 text-lake/80">
              This website currently collects nothing. There is no analytics, no cookies, no tracking of any kind.
            </p>
            <p className="body-text text-lake/70">
              When the owner portal launches, it will have its own privacy policy, written to reflect what it collects and how that information is used.
            </p>
          </Reveal>
        </div>
      </section>

      </main>
      <Footer />
    </>
  );
}

/* ── /journal ── */
function JournalPage() {
  return (
    <>
      <SkipLink />
      <JournalIndexPage />
      <Footer />
    </>
  );
}

/* ── /faq ── */
function FaqAccordionItem({ item, index, categoryId }: { item: typeof faqCategories[number]['items'][number]; index: number; categoryId: string }) {
  const [open, setOpen] = useState(false);
  const answerId = `faq-${categoryId}-${index}`;
  return (
    <div className="border-b border-lake/10">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls={answerId}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
      >
        <span className="text-[16px] leading-snug text-lake">{item.question}</span>
        <span className="flex-shrink-0 text-brass-on-light">
          {open ? <Minus size={18} strokeWidth={1.5} /> : <Plus size={18} strokeWidth={1.5} />}
        </span>
      </button>
      {open && (
        <div id={answerId} className="min-w-0 pb-5">
          <p className="body-text text-[15px] leading-relaxed text-lake/70">{item.answer}</p>
          <div className="mt-3 max-w-full">
            <SampleNote />
          </div>
        </div>
      )}
    </div>
  );
}

function FaqPage() {
  const faqJsonLd = !SHOW_SAMPLE_MARKERS
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqCategories.flatMap((cat) =>
          cat.items.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: { '@type': 'Answer', text: item.answer },
          }))
        ),
      }
    : undefined;

  return (
    <>
      <Seo
        title="FAQ | Lakeside Tower"
        description="Answers to common questions about owning and living at Lakeside Tower \u2014 pets, parking, guests, leasing, moving in and more."
        path="/faq"
        jsonLd={faqJsonLd}
      />
      <SkipLink />
      <main id="main">
      <div className="relative flex min-h-[70vh] items-end overflow-hidden bg-lake text-cream">
        <div className="absolute inset-0">
          <Img
            slug="tower-aerial"
            alt=""
            className="h-full w-full object-cover opacity-60"
            sizes="100vw"
          />
        </div>
        <div className="img-overlay absolute inset-0" />
        <Header />
        <div className="container-wide relative z-10 pb-16 pt-36 sm:pb-24">
          <div className="max-w-3xl">
            <p className="eyebrow mb-6 text-brass-on-dark">FAQ</p>
            <h1 className="display-4 serif text-cream">
              Good<br />
              <em className="font-medium">questions.</em>
            </h1>
          </div>
        </div>
      </div>

      <section className="bg-cream section-pad">
        <div className="container-wide">
          <Reveal className="mx-auto max-w-[820px]">
            <div className="flex flex-wrap gap-2.5">
              {faqCategories.map((cat) => (
                <a
                  key={cat.id}
                  href={`#${cat.id}`}
                  className="rounded-full border border-lake/15 px-4 py-1.5 text-[12px] font-medium tracking-[0.04em] text-lake/70 transition hover:border-brass hover:text-brass-on-light"
                >
                  {cat.label}
                </a>
              ))}
            </div>

            <div className="mt-12 space-y-12">
              {faqCategories.map((cat) => (
                <div key={cat.id} id={cat.id} className="min-w-0 scroll-mt-24">
                  <h2 className="display-2 serif text-lake">{cat.label}</h2>
                  <div className="mt-2 border-t border-lake/10">
                    {cat.items.map((item, i) => (
                      <FaqAccordionItem
                        key={i}
                        item={item}
                        index={i}
                        categoryId={cat.id}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-16 border-t border-lake/10 pt-10">
              <p className="text-[15px] text-lake/60">Didn&rsquo;t find it?</p>
              <a
                href="/contact"
                className="link-arrow mt-3 text-lake"
              >
                <span className="link-underline">Contact us</span>
                <ArrowUpRight size={15} strokeWidth={1.5} />
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      </main>
      <Footer />
    </>
  );
}

/* ── /journal/:slug ── routes generated below from journalPosts ── */

function NotFoundPage() {
  return (
    <>
      <Seo
        title="Page not found | Lakeside Tower"
        description="The page you're looking for isn't here."
        path="/404"
      />
      <SkipLink />
      <main id="main" className="flex min-h-screen flex-col items-center justify-center bg-cream px-6 text-center text-lake">
        <h1 className="display-4 serif text-lake">This page has drifted off.</h1>
        <p className="body-text mt-6 max-w-md">
          The page you&rsquo;re looking for isn&rsquo;t here. Let&rsquo;s get you back to the water&rsquo;s edge.
        </p>
        <a
          href="/"
          className="mt-10 inline-flex items-center gap-3 bg-lake px-6 py-4 text-[13px] font-bold uppercase tracking-[0.14em] text-cream transition hover:bg-lake-deep"
        >
          Return home <ArrowRight size={15} />
        </a>
      </main>
    </>
  );
}

/* ── ROUTES ── */
export const routes = [
  { path: '/', element: <HomePage /> },
  { path: '/residences', element: <ResidencesPage /> },
  { path: '/life-at-lakeside', element: <LifeAtLakesidePage /> },
  { path: '/location', element: <LocationPage /> },
  { path: '/journal', element: <JournalPage /> },
  ...journalPosts.map((post) => ({
    path: `/journal/${post.slug}`,
    element: (
      <>
        <SkipLink />
        <JournalPostPage slug={post.slug} />
        <Footer />
      </>
    ),
  })),
  { path: '/about', element: <AboutPage /> },
  { path: '/contact', element: <ContactPage /> },
  { path: '/faq', element: <FaqPage /> },
  { path: '/privacy', element: <PrivacyPage /> },
  { path: '/owners', element: <OwnersPage /> },
  {
    path: '/portal',
    element: <AuthProvider><Outlet /></AuthProvider>,
    children: [
      { index: true, element: <RequireAuth><PortalHomePage /></RequireAuth> },
      { path: 'sign-in', element: <SignInPage /> },
      { path: 'announcements', element: <RequireAuth><AnnouncementsPage /></RequireAuth> },
      { path: 'announcements/:id', element: <RequireAuth><AnnouncementDetailPage /></RequireAuth> },
      { path: 'events', element: <RequireAuth><EventsPage /></RequireAuth> },
      { path: 'events/flyer', element: <RequireAuth><EventsFlyerPage /></RequireAuth> },
      { path: 'events/new', element: <RequireAuth><EventEditorPage /></RequireAuth> },
      { path: 'events/:id', element: <RequireAuth><EventDetailPage /></RequireAuth> },
      { path: 'events/:id/edit', element: <RequireAuth><EventEditorPage /></RequireAuth> },
      { path: 'building', element: <RequireAuth><BuildingPage /></RequireAuth> },
      { path: 'documents', element: <RequireAuth><DocumentsPage /></RequireAuth> },
      { path: 'directory', element: <RequireAuth><DirectoryPage /></RequireAuth> },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
];



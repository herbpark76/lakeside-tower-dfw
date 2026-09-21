import { useState, useEffect, type ReactNode } from 'react';

import {
  ArrowRight,
  ArrowUpRight,
  Menu,
  X,
} from 'lucide-react';
import { Img } from '@/components/Img';
import { Seo } from '@/components/Seo';
import { useReveal, useRevealStagger } from '@/hooks/useReveal';

/* ── Skip to content link ── */
function SkipLink() {
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

function Header() {
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

function Footer() {
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
            {navItems.slice(0, 4).map(([label, href]) => (
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

/* ── 1. LAKESIDE TOWER ── cream, text left / tower-aerial right ── */
function TowerSection() {
  return (
    <section id="home" className="bg-cream section-pad">
      <div className="container-wide">
        <Reveal className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:items-end lg:gap-20">
          <div className="lg:pb-6">
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
          <div className="img-inset relative order-first lg:order-last">
            <Img
              slug="tower-aerial"
              alt="Lakeside Tower overlooking Lake Grapevine from above"
              className="w-full object-cover"
              sizes="(min-width: 1024px) 60vw, 100vw"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ── 2. THE TRAIL ── full-bleed dark, trail-shoreline, strongest differentiator ── */
function TrailSection() {
  return (
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
        </div>
      </div>
    </section>
  );
}

/* ── 3. LAKESIDE VILLAGE ── sand, village-evening left / text right ── */
function VillageSection() {
  return (
    <section className="bg-sand section-pad">
      <div className="container-wide">
        <Reveal className="grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:items-center lg:gap-20">
          <div className="img-inset">
            <Img
              slug="village-evening"
              alt="Evening patio at Lakeside Village"
              className="w-full object-cover"
              sizes="(min-width: 1024px) 60vw, 100vw"
            />
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
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ── 4. LAKE PANORAMA BAND ── full-width, no text, visual breath ── */
function PanoramaBand() {
  return (
    <div className="relative w-full overflow-hidden">
      <Img
        slug="lake-panorama"
        alt=""
        className="h-[400px] w-full object-cover"
        sizes="100vw"
        objectPosition="center"
      />
    </div>
  );
}

/* ── 5. LIFE HERE ── cream, three static cards (not links) ── */
const stories = [
  ['01', 'The light you come home to.', 'balcony-sunset', true] as const,
  ['02', 'A Saturday without a plan.', 'trail-woods', false] as const,
  ['03', 'The world within reach.', 'village-street', true] as const,
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
          {stories.map(([num, title, image, tall], i) => (
            <div
              key={title}
              ref={(el) => { refs.current[i] = el; }}
              data-reveal
            >
              <div className="img-inset overflow-hidden">
                <Img
                  slug={image as never}
                  alt={title}
                  className={`${tall ? 'aspect-[3/4]' : 'aspect-[4/5]'} w-full object-cover`}
                  sizes="(min-width: 640px) 33vw, 100vw"
                />
              </div>
              <p className="mt-5 font-mono text-[13px] text-brass-on-light">{num}</p>
              <h3 className="display-2 serif mt-2 text-lake">{title}</h3>
            </div>
          ))}
        </div>
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
      <TowerSection />
      <TrailSection />
      <VillageSection />
      <PanoramaBand />
      <StoriesSection />
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
            <div className="mt-8">
              <ArrowLink href="/contact">Contact the board</ArrowLink>
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
    ['DFW Airport', 'The airport&rsquo;s north entrance is about seven minutes away.'],
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

      {/* WHAT'S HERE — four groups, brass subheadings, hairline rules */}
      <section className="bg-cream pb-[var(--space-xl)] md:pb-[var(--space-2xl)]">
        <div className="container-wide">
          <Reveal className="mb-12">
            <Eyebrow>What&rsquo;s here</Eyebrow>
          </Reveal>
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
        </div>
      </section>

      {/* Editorial moment — "A room for bad weather." */}
      <section className="bg-sand section-pad">
        <div className="container-wide">
          <Reveal className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-start lg:gap-24">
            {/* TALL portrait balcony-sunset — min 600px */}
            <div className="img-inset order-first lg:order-last">
              <Img
                slug="balcony-sunset"
                alt="Sunset over Lake Grapevine from a balcony at Lakeside Tower"
                className="h-[600px] w-full object-cover sm:h-[700px]"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
            </div>
            <div className="lg:pt-16">
              <h2 className="display-3 serif text-lake">
                A room for<br />
                <em className="font-medium">bad weather.</em>
              </h2>
              <p className="body-text mt-8 text-lake/70 max-w-md">
                There&rsquo;s a GolfZon simulator downstairs. In August, when the putting green is a bad idea by ten in the morning, it turns out to be the most-used room in the building.
              </p>
            </div>
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

      </main>
      <Footer />
    </>
  );
}

/* ── /life-at-lakeside ── */
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

      {/* 1. A Saturday without a plan — cream, image right */}
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
            <div className="img-inset order-first lg:order-last">
              <Img
                slug="trail-woods"
                alt="Light through the trees on the Northshore Trail"
                className="w-full object-cover"
                sizes="(min-width: 1024px) 60vw, 100vw"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* 2. Good days start close — sand, image left */}
      <section className="bg-sand section-pad">
        <div className="container-wide">
          <Reveal className="grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:items-start lg:gap-20">
            <div className="img-inset">
              <Img
                slug="village-daylight"
                alt="Daytime dining at Lakeside Village"
                className="w-full object-cover"
                sizes="(min-width: 1024px) 60vw, 100vw"
              />
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

      {/* 3. The water — dark full-bleed, hero-sunset */}
      <section className="relative flex min-h-[80vh] items-end overflow-hidden bg-lake-deep text-cream">
        <div className="absolute inset-0">
          <Img
            slug="hero-sunset"
            alt="Sunset over Lake Grapevine"
            className="h-full w-full object-cover object-center"
            sizes="100vw"
          />
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
          </div>
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

      <section className="bg-cream section-pad">
        <div className="container-wide">
          <Reveal className="measure-narrow space-y-8">
            <p className="body-text text-lg leading-8 text-lake/80">
              Lakeside Tower is a private residential community of fifty-five residences on the north shore of Lake Grapevine in Flower Mound, Texas. The building is owned and governed by its residents through the homeowners association.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-sand section-pad">
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
function ContactPage() {
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
          <Reveal className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-24">
            <div>
              <Eyebrow>Address</Eyebrow>
              <div className="mt-6 space-y-1">
                <p className="body-text text-lake">Lakeside Tower</p>
                <p className="body-text text-lake/70">2800 Lakeside Parkway</p>
                <p className="body-text text-lake/70">Flower Mound, TX 75022</p>
              </div>
            </div>
            <div>
              <Eyebrow>Email</Eyebrow>
              <div className="mt-6">
                <p className="body-text text-lake/70 mb-4">
                  Reach the Lakeside Tower community by email.
                </p>
                {/* PLACEHOLDER — replace with the real email address before publishing */}
                <div className="border border-dashed border-brass/50 bg-brass/5 p-5">
                  <p className="eyebrow text-brass-on-light/70 mb-3">Placeholder &mdash; needs replacing</p>
                  <a
                    href="mailto:hello@lakesidetower.example"
                    className="link-arrow text-lake"
                  >
                    <span className="link-underline">hello@lakesidetower.example</span>
                    <ArrowUpRight size={15} strokeWidth={1.5} />
                  </a>
                  <p className="mt-3 text-[13px] text-lake/50">
                    Replace this with the verified contact email before the page goes live.
                  </p>
                </div>
              </div>
            </div>
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
            {/* PENDING REVIEW marker */}
            <div className="mt-12 inline-flex items-center gap-3 border border-dashed border-brass/40 bg-brass/5 px-5 py-3">
              <span className="eyebrow text-brass-on-light/60">Pending review</span>
              <span className="text-[13px] text-lake/50">This page is a draft and has not been reviewed by the board.</span>
            </div>
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
      <Seo
        title="The Lakeside Journal | Lakeside Tower"
        description="A collection of stories from the water's edge — coming soon."
        path="/journal"
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
              A collection of stories from the water&rsquo;s edge: dining, trails, travel, neighborhood life and the rituals of coming home. The first entries are being written.
            </p>
          </Reveal>
        </div>
      </section>

      </main>
      <Footer />
    </>
  );
}

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
  { path: '/about', element: <AboutPage /> },
  { path: '/contact', element: <ContactPage /> },
  { path: '/privacy', element: <PrivacyPage /> },
  { path: '/owners', element: <OwnersPage /> },
  { path: '*', element: <NotFoundPage /> },
];



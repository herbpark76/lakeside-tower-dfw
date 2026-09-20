import { useState, type ReactNode } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Head } from 'vite-react-ssg';
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  LockKeyhole,
  Menu,
  X,
} from 'lucide-react';
import { Img } from '@/components/Img';
import { useReveal, useRevealStagger } from '@/hooks/useReveal';

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
        src="/assets/images/logo-200.png"
        alt="The Lakeside Tower"
        className="h-auto w-full"
        width={200}
        height={50}
        loading="eager"
      />
    </a>
  );
}

function Header({ dark = false }: { dark?: boolean }) {
  const [open, setOpen] = useState(false);
  const text = dark ? 'text-cream' : 'text-lake';
  return (
    <header className={`absolute inset-x-0 top-0 z-30 ${text}`}>
      <div className="container-wide flex h-24 items-center justify-between">
        <Logo dark={dark} />
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
            href="/login"
            className={`ml-2 inline-flex items-center gap-2 border px-4 py-3 text-[13px] font-semibold uppercase tracking-[0.14em] transition ${
              dark
                ? 'border-cream/40 hover:bg-cream hover:text-lake'
                : 'border-lake/30 hover:bg-lake hover:text-cream'
            }`}
          >
            <LockKeyhole size={13} /> Owner Login
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
        <nav
          className="border-t border-white/15 bg-lake px-6 py-5 lg:hidden"
          aria-label="Mobile navigation"
        >
          {navItems.map(([label, href]) => (
            <a
              onClick={() => setOpen(false)}
              key={href}
              href={href}
              className="block border-b border-white/10 py-4 text-sm uppercase tracking-[0.14em] text-cream"
            >
              {label}
            </a>
          ))}
          <a
            onClick={() => setOpen(false)}
            href="/login"
            className="mt-5 inline-flex items-center gap-2 border border-cream/40 px-4 py-3 text-[13px] font-semibold uppercase tracking-[0.14em] text-cream"
          >
            <LockKeyhole size={13} /> Owner Login
          </a>
        </nav>
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

function Eyebrow({ children, onTeal = false }: { children: ReactNode; onTeal?: boolean }) {
  return (
    <p className={`eyebrow ${onTeal ? 'text-lake' : 'text-brass'}`}>{children}</p>
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
          <p className="eyebrow mb-6 text-brass">Explore</p>
          <div className="grid gap-4 text-[17px] text-cream/70">
            {navItems.slice(0, 4).map(([label, href]) => (
              <a key={href} href={href} className="link-underline transition hover:text-cream w-fit">
                {label}
              </a>
            ))}
          </div>
        </div>
        <div>
          <p className="eyebrow mb-6 text-brass">For our community</p>
          <div className="grid gap-4 text-[17px] text-cream/70">
            <a href="/login" className="link-underline transition hover:text-cream w-fit">Owner Login</a>
            <a href="/about" className="link-underline transition hover:text-cream w-fit">Contact</a>
            <a href="/about" className="link-underline transition hover:text-cream w-fit">Privacy</a>
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

/* ── HERO ── full-bleed sunset, lower-left editorial composition ── */
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
      <Header dark />
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
                className="inline-flex items-center gap-3 border-b border-cream/40 pb-3 text-[13px] font-bold uppercase tracking-[0.14em] text-cream transition hover:border-brass hover:text-brass"
              >
                Explore life at Lakeside <ArrowRight size={15} />
              </a>
              <a href="/login" className="link-arrow text-cream/60 hover:text-cream">
                <span className="link-underline">Owner Login</span>
                <ArrowUpRight size={15} strokeWidth={1.5} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── HOME / TOWER ── cream, image left / text right ── */
function HomeSection() {
  return (
    <section id="home" className="bg-cream section-pad">
      <div className="container-wide">
        <Reveal className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:items-end lg:gap-20">
          <div className="img-inset relative">
            <Img
              slug="tower-aerial"
              alt="Lakeside Tower overlooking Lake Grapevine from above"
              className="w-full object-cover"
              sizes="(min-width: 1024px) 60vw, 100vw"
            />
          </div>
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
        </Reveal>
      </div>
    </section>
  );
}

/* ── ARCHITECTURE ── dark full-bleed, tall tower image ── */
function ArchitectureSection() {
  return (
    <section className="relative flex min-h-[80vh] items-end overflow-hidden bg-lake-deep text-cream">
      <div className="absolute inset-0">
        <Img
          slug="tower-aerial"
          alt="Lakeside Tower and the lake from above"
          className="h-full w-full object-cover object-center"
          sizes="100vw"
        />
      </div>
      <div className="img-overlay absolute inset-0" />
      <div className="container-wide relative z-10 pb-12 pt-40 sm:pb-16">
        <Eyebrow>Architecture</Eyebrow>
        <h2 className="display-3 serif mt-5 text-cream">
          Life above<br />
          <em className="font-medium">the lake.</em>
        </h2>
      </div>
    </section>
  );
}

/* ── VILLAGE ── sand, art-directed collage ── */
function VillageSection() {
  return (
    <section className="bg-sand section-pad">
      <div className="container-wide">
        <Reveal className="mb-16 max-w-2xl">
          <Eyebrow>Lakeside Village</Eyebrow>
          <h2 className="display-4 serif mt-7 text-lake">
            Good days<br />
            <em className="font-medium">start close.</em>
          </h2>
          <p className="body-text mt-8 text-lake/70">
            Walk to a table in the evening. A patio for a slow afternoon. The neighborhood provides the backdrop.
          </p>
        </Reveal>
        <Reveal className="grid grid-cols-12 gap-4 sm:gap-5">
          <div className="col-span-12 sm:col-span-8 img-inset">
            <Img
              slug="village-evening"
              alt="Evening patio at The Tavern at Lakeside"
              className="w-full object-cover"
              sizes="(min-width: 640px) 66vw, 100vw"
            />
          </div>
          <div className="col-span-12 mt-4 sm:col-span-4 sm:mt-12 img-inset">
            <Img
              slug="village-dining"
              alt="Dining and neighborhood life at Lakeside Village"
              className="w-full object-cover"
              sizes="(min-width: 640px) 33vw, 100vw"
            />
          </div>
          <div className="col-span-12 mt-4 sm:col-span-7 sm:mt-6 img-inset">
            <Img
              slug="village-daylight"
              alt="Daytime patio dining at The Tavern at Lakeside"
              className="w-full object-cover"
              sizes="(min-width: 640px) 58vw, 100vw"
            />
          </div>
          <div className="col-span-12 mt-4 sm:col-span-5 sm:mt-6 img-inset">
            <Img
              slug="village-signage"
              alt="Lakeside Village signage"
              className="w-full object-cover"
              sizes="(min-width: 640px) 41vw, 100vw"
            />
          </div>
        </Reveal>
        <div className="mt-12">
          <ArrowLink href="/life-at-lakeside">Explore life at Lakeside</ArrowLink>
        </div>
      </div>
    </section>
  );
}

/* ── NORTHSHORE ── cream, full-width panorama + supporting trail ── */
function OutdoorSection() {
  return (
    <section className="bg-cream section-pad">
      <div className="container-wide">
        <Reveal className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Eyebrow>Lake &amp; outdoor life</Eyebrow>
            <h2 className="display-4 serif mt-6 text-lake">
              Room to<br />
              <em className="font-medium">live well.</em>
            </h2>
          </div>
          <p className="body-text max-w-xs">
            The water changes by the hour. Trails take you beneath the trees.
          </p>
        </Reveal>
      </div>
      <Reveal className="relative w-full overflow-hidden">
        <Img
          slug="lake-panorama"
          alt="Lake Grapevine shoreline beneath a clear sky"
          className="h-[45vh] w-full object-cover sm:h-[55vh]"
          sizes="100vw"
          objectPosition="center"
        />
      </Reveal>
      <div className="container-wide mt-10">
        <Reveal className="grid gap-10 sm:grid-cols-[1.2fr_1fr] sm:items-center sm:gap-16">
          <div className="img-inset">
            <Img
              slug="trail-shoreline"
              alt="Wooded Northshore trail near Lake Grapevine"
              className="w-full object-cover"
              sizes="(min-width: 640px) 60vw, 100vw"
            />
          </div>
          <div className="sm:pl-6">
            <p className="body-text">
              A North Texas rhythm with room for movement and stillness&mdash;just beyond the door.
            </p>
            <div className="mt-8">
              <ArrowLink href="/life-at-lakeside">See life beyond home</ArrowLink>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ── CONNECTION ── dark lake, brand statement ── */
function ConnectionSection() {
  const places = ['Lakeside Tower', 'Lakeside Village', 'Flower Mound', 'Dallas\u2013Fort Worth', 'DFW Airport'];
  return (
    <section className="bg-lake section-pad text-cream">
      <div className="container-wide">
        <Reveal className="mb-16">
          <Eyebrow>Connection</Eyebrow>
          <h2 className="display-4 serif mt-8 text-cream">
            Easy to leave.<br />
            <em className="font-medium">Better to return.</em>
          </h2>
        </Reveal>
        <Reveal>
          <div className="flex flex-wrap gap-x-8 gap-y-3 border-t border-cream/15 pt-8 sm:gap-x-12">
            {places.map((place, index) => (
              <span key={place} className="flex items-baseline gap-3">
                {index > 0 && <span className="text-brass-light/40">&middot;</span>}
                <span className="text-[17px] font-medium tracking-wide text-cream/55">{place}</span>
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ── STORIES ── cream, one feature + two supporting ── */
const stories = [
  ['01', 'The light you come home to.', 'Views that stay with you.', 'balcony-sunset'] as const,
  ['02', 'A Saturday without a plan.', 'Coffee, trail, lunch, sunset, home.', 'trail-shoreline'] as const,
  ['03', 'The world within reach.', 'Leave easily. Come home gladly.', 'village-signage'] as const,
];

function StoriesSection() {
  const [feature, ...supporting] = stories;
  const refs = useRevealStagger<HTMLAnchorElement>(3);
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
        <a href="/journal" className="group mb-12 block sm:mb-16" ref={(el) => { refs.current[0] = el; }} data-reveal>
          <div className="img-inset overflow-hidden">
            <Img
              slug={feature[3]}
              alt={feature[1]}
              className="w-full object-cover transition-transform duration-700 group-hover:scale-103"
              sizes="(min-width: 640px) 100vw, 100vw"
            />
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_1fr] sm:gap-12">
            <div>
              <p className="font-mono text-[13px] text-brass">{feature[0]}</p>
              <h3 className="display-2 serif mt-2 text-lake">{feature[1]}</h3>
            </div>
            <p className="body-text sm:pt-8">{feature[2]}</p>
          </div>
        </a>
        <div className="grid gap-8 border-t border-lake/10 pt-10 sm:grid-cols-2 sm:gap-12">
          {supporting.map(([num, title, subtitle, image], i) => (
            <a
              href="/journal"
              key={title}
              className="group"
              ref={(el) => { refs.current[i + 1] = el; }}
              data-reveal
            >
              <div className="img-inset overflow-hidden">
                <Img
                  slug={image}
                  alt={title}
                  className="w-full object-cover transition-transform duration-700 group-hover:scale-103"
                  sizes="(min-width: 640px) 50vw, 100vw"
                />
              </div>
              <p className="mt-4 font-mono text-[13px] text-brass">{num}</p>
              <h3 className="display-2 serif mt-2 text-lake">{title}</h3>
              <p className="body-text mt-2">{subtitle}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── JOURNAL ── card/cream, three-column structured ── */
function JournalSection() {
  const articles = [
    ['A changing view', 'Lake Grapevine', 'lake-panorama'] as const,
    ['Start with somewhere good', 'Lakeside Village', 'village-signage'] as const,
    ['The return home', 'Resident life', 'hero-sunset'] as const,
  ];
  const refs = useRevealStagger<HTMLAnchorElement>(3);
  return (
    <section className="bg-card section-pad">
      <div className="container-wide">
        <Reveal className="mb-16 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Eyebrow>Journal</Eyebrow>
            <h2 className="display-4 serif mt-7 text-lake">
              The Lakeside<br />
              <em className="font-medium">Journal.</em>
            </h2>
          </div>
          <ArrowLink href="/journal">Visit the journal</ArrowLink>
        </Reveal>
        <div className="grid gap-10 md:grid-cols-3 md:gap-8">
          {articles.map(([title, category, image], i) => (
            <a
              href="/journal"
              key={title}
              className="group"
              ref={(el) => { refs.current[i] = el; }}
              data-reveal
            >
              <div className="img-inset overflow-hidden">
                <Img
                  slug={image}
                  alt={title}
                  className="aspect-[3/2] w-full object-cover transition-transform duration-700 group-hover:scale-103"
                  sizes="(min-width: 768px) 33vw, 100vw"
                />
              </div>
              <p className="mt-5 text-[13px] font-semibold uppercase tracking-[0.14em] text-brass">{category}</p>
              <h3 className="display-2 serif mt-2 text-lake">{title}</h3>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── OWNER COMMUNITY ── teal, elegant portal teaser ── */
function OwnersSection() {
  const features = ['Community', 'Announcements', 'Upcoming Events', 'Documents', 'Forum'];
  return (
    <section className="bg-teal section-pad text-lake">
      <div className="container-wide">
        <Reveal className="grid gap-14 lg:grid-cols-[1fr_0.85fr] lg:items-center lg:gap-24">
          <div>
            <Eyebrow onTeal>For our community</Eyebrow>
            <h2 className="display-4 serif mt-7 text-lake">
              Lakeside Tower,<br />
              <em className="font-medium">at home online.</em>
            </h2>
            <p className="body-text mt-8 text-lake/75">
              A private place for owners and residents to stay connected, share information and participate in life at the Tower.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-6">
              <a
                href="/login"
                className="inline-flex items-center gap-3 bg-lake px-6 py-4 text-[13px] font-bold uppercase tracking-[0.14em] text-cream transition hover:bg-lake-deep"
              >
                Owner Login <ArrowRight size={15} />
              </a>
              <span className="text-[13px] text-lake/55">Resident portal coming soon</span>
            </div>
          </div>
          <div className="lg:pl-6">
            <p className="serif text-2xl leading-snug text-lake/85 measure-narrow">
              This website will also become the private digital home of the Lakeside Tower community.
            </p>
            <div className="mt-10 border-t border-lake/15">
              {features.map((feature) => (
                <div
                  key={feature}
                  className="group flex items-center justify-between border-b border-lake/15 py-4 text-[17px] font-medium text-lake/75 transition hover:text-lake"
                >
                  <span>{feature}</span>
                  <span className="h-px w-6 bg-brass-light/40 transition group-hover:w-10 group-hover:bg-brass" />
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ── CLOSING ── dark full-bleed sunset ── */
function ClosingSection() {
  return (
    <section className="relative flex min-h-[60vh] items-center overflow-hidden bg-lake-deep text-cream">
      <div className="absolute inset-0">
        <Img
          slug="balcony-sunset"
          alt="Sunset view over Lake Grapevine from a balcony"
          className="h-full w-full object-cover object-center"
          sizes="100vw"
        />
      </div>
      <div className="img-overlay absolute inset-0" />
      <div className="container-wide relative z-10 text-center">
        <p className="display-3 serif text-cream">
          Start with home.<br />
          <em className="font-medium">Expand to the horizon.</em>
        </p>
        <div className="mx-auto mt-10 w-36">
          <Logo dark />
        </div>
      </div>
    </section>
  );
}

/* ── PAGE DATA ── */
const pageData: Record<string, { label: string; title: ReactNode; copy: string; image: string }> = {
  '/residences': {
    label: 'The residences',
    title: <>A private place<br /><em className="font-medium">to be yourself.</em></>,
    copy: 'The residence story begins with light, outlook and the quiet pleasure of a home above the lake.',
    image: 'tower-aerial',
  },
  '/life-at-lakeside': {
    label: 'Life at Lakeside',
    title: <>More horizon.<br /><em className="font-medium">More life.</em></>,
    copy: 'From the first light on the water to dinner around the corner, a day here has room to unfold naturally.',
    image: 'village-evening',
  },
  '/location': {
    label: 'Location',
    title: <>Close to the<br /><em className="font-medium">right things.</em></>,
    copy: 'Lake Grapevine, Lakeside Village, Flower Mound and the wider Dallas\u2013Fort Worth region form a setting with both calm and reach.',
    image: 'lake-panorama',
  },
  '/journal': {
    label: 'The Lakeside Journal',
    title: <>Real life,<br /><em className="font-medium">beautifully told.</em></>,
    copy: 'A future collection of stories from the water\u2019s edge: dining, trails, travel, neighborhood life and the rituals of coming home.',
    image: 'hero-sunset',
  },
  '/about': {
    label: 'About Lakeside Tower',
    title: <>A home with<br /><em className="font-medium">a point of view.</em></>,
    copy: 'Lakeside Tower is a private residential community in Flower Mound, Texas, overlooking Lake Grapevine.',
    image: 'village-signage',
  },
};

/* ── PAGES ── */
function HomePage() {
  return (
    <>
      <Head>
        <title>Lakeside Tower | Live at the water&rsquo;s edge</title>
        <meta name="description" content="Lakeside Tower — a private home at the water&rsquo;s edge in Flower Mound, Texas." />
      </Head>
      <Hero />
      <HomeSection />
      <ArchitectureSection />
      <VillageSection />
      <OutdoorSection />
      <ConnectionSection />
      <StoriesSection />
      <JournalSection />
      <OwnersSection />
      <ClosingSection />
      <Footer />
    </>
  );
}

function InteriorPage({ data }: { data: { label: string; title: ReactNode; copy: string; image: string } }) {
  return (
    <>
      <Head>
        <title>{data.label} | Lakeside Tower</title>
        <meta name="description" content={data.copy} />
      </Head>
      <div className="relative flex min-h-[70vh] items-end overflow-hidden bg-lake text-cream">
        <div className="absolute inset-0">
          <Img
            slug={data.image as never}
            alt=""
            className="h-full w-full object-cover opacity-60"
            sizes="100vw"
          />
        </div>
        <div className="img-overlay absolute inset-0" />
        <Header dark />
        <div className="container-wide relative z-10 pb-16 pt-36 sm:pb-24">
          <div className="max-w-3xl">
            <p className="eyebrow mb-6 text-brass">{data.label}</p>
            <h1 className="display-4 serif text-cream">{data.title}</h1>
            <p className="body-text mt-8 text-cream/70 max-w-md">{data.copy}</p>
          </div>
        </div>
      </div>
      <section className="bg-cream section-pad">
        <div className="container-wide grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
          <Reveal>
            <Eyebrow>A first look</Eyebrow>
            <h2 className="display-3 serif mt-6 text-lake">The story is just beginning.</h2>
          </Reveal>
          <Reveal className="measure-narrow">
            <p className="body-text text-lg leading-8 text-muted">
              This page is a considered beginning for a deeper Lakeside Tower experience. The next layer will bring verified residence details, neighborhood guides, local context and stories from the people who make this place feel like home.
            </p>
            <div className="mt-9">
              <ArrowLink href="/">Return home</ArrowLink>
            </div>
          </Reveal>
        </div>
      </section>
      <Footer />
    </>
  );
}

function LoginPage() {
  const [submitted, setSubmitted] = useState(false);
  return (
    <>
      <Head>
        <title>Owner Login | Lakeside Tower</title>
        <meta name="description" content="Private owner and resident portal for Lakeside Tower." />
      </Head>
      <div className="min-h-screen bg-lake text-cream">
        <div className="container-wide flex min-h-screen flex-col">
          <div className="flex items-center justify-between py-8">
            <Logo dark small />
            <a href="/" className="text-[13px] font-semibold uppercase tracking-[0.14em] text-cream/60 hover:text-cream">
              Return to site
            </a>
          </div>
          <div className="grid flex-1 items-center gap-16 py-12 lg:grid-cols-2 lg:gap-24">
            <div className="max-w-xl">
              <p className="eyebrow text-brass">For our community</p>
              <h1 className="display-4 serif mt-6 text-cream">
                Welcome<br />
                <em className="font-medium">home.</em>
              </h1>
              <p className="body-text mt-8 text-cream/65 max-w-sm">
                Your private space for news, events, documents and the everyday life of Lakeside Tower.
              </p>
            </div>
            <div className="bg-card p-7 text-lake sm:p-10">
              <p className="eyebrow text-brass">Owner access</p>
              <h2 className="display-3 serif mt-4 text-lake">Sign in to continue.</h2>
              {submitted ? (
                <div className="mt-8 border border-teal bg-teal/40 p-5 text-[17px] leading-6">
                  <Check className="mb-3 text-brass" size={20} />
                  This is a design preview. Resident access will be available when the private portal launches.
                </div>
              ) : (
                <form
                  className="mt-8 space-y-5"
                  onSubmit={(event) => {
                    event.preventDefault();
                    setSubmitted(true);
                  }}
                >
                  <label className="block">
                    <span className="eyebrow mb-2 block text-muted">Email address</span>
                    <input
                      type="email"
                      required
                      className="w-full border-b border-lake/20 bg-transparent px-0 py-3 text-[17px] outline-none placeholder:text-muted/60 focus:border-brass"
                      placeholder="you@example.com"
                    />
                  </label>
                  <label className="block">
                    <span className="eyebrow mb-2 block text-muted">Password</span>
                    <input
                      type="password"
                      required
                      className="w-full border-b border-lake/20 bg-transparent px-0 py-3 text-[17px] outline-none placeholder:text-muted/60 focus:border-brass"
                      placeholder="Enter your password"
                    />
                  </label>
                  <button className="mt-4 inline-flex w-full items-center justify-center gap-3 bg-lake px-5 py-4 text-[13px] font-bold uppercase tracking-[0.14em] text-cream transition hover:bg-lake-deep">
                    Sign in <ArrowRight size={15} />
                  </button>
                  <p className="text-center text-[13px] text-muted">Portal coming soon &middot; This is a visual preview</p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function NotFoundPage() {
  return (
    <>
      <Head>
        <title>Page not found | Lakeside Tower</title>
      </Head>
      <div className="flex min-h-screen flex-col items-center justify-center bg-cream text-lake">
        <p className="eyebrow text-brass">404</p>
        <h1 className="display-3 serif mt-4 text-lake">Page not found</h1>
        <a href="/" className="mt-8 link-arrow text-lake">
          <span className="link-underline">Return home</span>
          <ArrowUpRight size={15} strokeWidth={1.5} />
        </a>
      </div>
    </>
  );
}

/* ── ROUTES ── */
export const routes = [
  { path: '/', element: <HomePage /> },
  { path: '/residences', element: <InteriorPage data={pageData['/residences']} /> },
  { path: '/life-at-lakeside', element: <InteriorPage data={pageData['/life-at-lakeside']} /> },
  { path: '/location', element: <InteriorPage data={pageData['/location']} /> },
  { path: '/journal', element: <InteriorPage data={pageData['/journal']} /> },
  { path: '/about', element: <InteriorPage data={pageData['/about']} /> },
  { path: '/login', element: <LoginPage /> },
  { path: '*', element: <NotFoundPage /> },
];

export default function App() {
  const location = useLocation();

  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <main id="main">
        <Routes location={location}>
          <Route path="/" element={<HomePage />} />
          <Route path="/residences" element={<InteriorPage data={pageData['/residences']} />} />
          <Route path="/life-at-lakeside" element={<InteriorPage data={pageData['/life-at-lakeside']} />} />
          <Route path="/location" element={<InteriorPage data={pageData['/location']} />} />
          <Route path="/journal" element={<InteriorPage data={pageData['/journal']} />} />
          <Route path="/about" element={<InteriorPage data={pageData['/about']} />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </>
  );
}

import { useEffect, useRef } from 'react';
import { Img, imageBase, imageRegistry, type ImgProps } from '@/components/Img';

type Slug = ImgProps['slug'];

interface PhotoProps {
  slug: Slug;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  objectPosition?: string;
  onLoad?: () => void;
}

export function Photo({
  slug,
  alt,
  className = '',
  priority = false,
  sizes = '100vw',
  objectPosition = 'center',
  onLoad,
}: PhotoProps) {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      el.classList.add('photo-revealed');
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('photo-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className={`photo-grade ${className}`}>
      <Img
        slug={slug}
        alt={alt}
        priority={priority}
        sizes={sizes}
        objectPosition={objectPosition}
        onLoad={onLoad}
        className="photo-grade-img"
      />
      <div className="photo-grade-overlay" aria-hidden="true" />
    </div>
  );
}

const homePageSlugs = new Set<string>([
  'hero-sunset',
  'tower-aerial',
  'trail-shoreline',
  'village-evening',
  'lake-panorama',
  'balcony-sunset',
  'trail-woods',
  'village-street',
  'village-daylight',
]);

const alternateSlugs: Slug[] = [
  'village-signage',
  'village-dining',
  'tower-detail',
];

export function dedupHeroSlug(heroPath: string): Slug {
  const slugMatch = heroPath.match(/\/assets\/images\/([^-/]+)/);
  const heroSlug = slugMatch ? slugMatch[1] : '';

  if (homePageSlugs.has(heroSlug)) {
    for (const alt of alternateSlugs) {
      if (!homePageSlugs.has(alt)) return alt;
    }
  }

  return (heroSlug && heroSlug in imageRegistry ? heroSlug : alternateSlugs[0]) as Slug;
}

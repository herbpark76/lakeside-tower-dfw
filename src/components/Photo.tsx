import { useEffect, useRef } from 'react';
import { Img, imageRegistry, type ImgProps } from '@/components/Img';

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

const warnedSlugs = new Set<string>();

function checkImageSize(slug: string, img: HTMLImageElement) {
  if (warnedSlugs.has(slug)) return;
  const naturalW = img.naturalWidth;
  if (naturalW > 0 && naturalW < 800) {
    warnedSlugs.add(slug);
    console.warn(
      `[Photo] Image "${slug}" natural width is ${naturalW}px (under 800px). Consider replacing with a higher-resolution source.`
    );
  }
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
  const imgRef = useRef<HTMLImageElement>(null);

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

  const handleLoad = () => {
    if (imgRef.current) checkImageSize(slug, imgRef.current);
    onLoad?.();
  };

  return (
    <div ref={wrapRef} className={`photo-grade ${className}`}>
      <Img
        slug={slug}
        alt={alt}
        priority={priority}
        sizes={sizes}
        objectPosition={objectPosition}
        onLoad={handleLoad}
        className="photo-grade-img"
      />
      <div className="photo-grade-overlay" aria-hidden="true" />
    </div>
  );
}

export function heroPathToSlug(heroPath: string): Slug {
  const slugMatch = heroPath.match(/\/assets\/images\/([^-/]+)/);
  const heroSlug = slugMatch ? slugMatch[1] : '';
  return (heroSlug && heroSlug in imageRegistry ? heroSlug : 'village-signage') as Slug;
}

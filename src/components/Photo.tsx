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
  noReveal?: boolean;
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
  noReveal = false,
}: PhotoProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || noReveal) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion || !('IntersectionObserver' in window)) return;

    const rect = el.getBoundingClientRect();
    const inViewport = rect.top < window.innerHeight && rect.bottom > 0;
    if (inViewport) return;

    el.classList.add('photo-grade--hidden');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('photo-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0, rootMargin: '0px 0px -10% 0px' }
    );

    observer.observe(el);

    const timer = setTimeout(() => {
      el.classList.add('photo-revealed');
    }, 2000);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [noReveal]);

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
  const knownSlugs = Object.keys(imageRegistry).sort((a, b) => b.length - a.length);
  for (const slug of knownSlugs) {
    if (heroPath.includes(slug)) return slug as Slug;
  }
  return 'village-signage' as Slug;
}

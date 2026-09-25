import {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from 'react';
import { ChevronLeft, ChevronRight, X, ArrowDown } from 'lucide-react';
import { Img, imageRegistry, imageBase } from '@/components/Img';
import { useReveal } from '@/hooks/useReveal';
import {
  galleryPhotos,
  nonEmptyCategories,
  type GalleryPhoto,
  type GalleryCategory,
} from '@/data/gallery';

type Filter = 'All' | GalleryCategory;

const INITIAL_COUNT = 9;

function buildSrcSet(slug: string): { webp: string; jpg: string; fallback: string } {
  const meta = imageRegistry[slug];
  if (!meta) return { webp: '', jpg: '', fallback: '' };
  const widths = meta.widths;
  const ext = meta.ext;
  return {
    webp: widths.map((w) => `${imageBase}${slug}-${w}.webp ${w}w`).join(', '),
    jpg: widths.map((w) => `${imageBase}${slug}-${w}.${ext} ${w}w`).join(', '),
    fallback: `${imageBase}${slug}-${widths[widths.length - 1]}.${ext}`,
  };
}

function preloadImage(slug: string) {
  const meta = imageRegistry[slug];
  if (!meta) return;
  const largest = meta.widths[meta.widths.length - 1];
  const img = new Image();
  img.src = `${imageBase}${slug}-${largest}.webp`;
}

function useFocusTrap(active: boolean, containerRef: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    if (!active || !containerRef.current) return;
    const container = containerRef.current;
    const focusable = container.querySelectorAll<HTMLElement>(
      'button, [href], [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length > 0) focusable[0].focus();

    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Tab' && focusable.length > 0) {
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [active, containerRef]);
}

function Lightbox({
  photos,
  index,
  onClose,
  onNavigate,
}: {
  photos: GalleryPhoto[];
  index: number;
  onClose: () => void;
  onNavigate: (newIndex: number) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const photo = photos[index];

  useFocusTrap(true, containerRef);

  const goPrev = useCallback(() => {
    onNavigate((index - 1 + photos.length) % photos.length);
  }, [index, photos.length, onNavigate]);

  const goNext = useCallback(() => {
    onNavigate((index + 1) % photos.length);
  }, [index, photos.length, onNavigate]);

  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft') goPrev();
      else if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, goPrev, goNext]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    const prevPhoto = photos[(index - 1 + photos.length) % photos.length];
    const nextPhoto = photos[(index + 1) % photos.length];
    preloadImage(prevPhoto.src);
    preloadImage(nextPhoto.src);
  }, [index, photos]);

  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
      if (dx > 0) goPrev();
      else goNext();
    }
    touchStart.current = null;
  };

  const srcs = buildSrcSet(photo.src);
  const meta = imageRegistry[photo.src];

  return (
    <div
      ref={containerRef}
      className="gallery-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={photo.caption}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <button
        className="gallery-lightbox-close"
        onClick={onClose}
        aria-label="Close gallery"
      >
        <X size={24} strokeWidth={1.5} />
      </button>

      <button
        className="gallery-lightbox-nav gallery-lightbox-nav--prev"
        onClick={goPrev}
        aria-label="Previous photograph"
      >
        <ChevronLeft size={32} strokeWidth={1.5} />
      </button>

      <button
        className="gallery-lightbox-nav gallery-lightbox-nav--next"
        onClick={goNext}
        aria-label="Next photograph"
      >
        <ChevronRight size={32} strokeWidth={1.5} />
      </button>

      <div className="gallery-lightbox-content">
        <picture>
          {srcs.webp && <source type="image/webp" srcSet={srcs.webp} />}
          {srcs.jpg && <source type="image/jpeg" srcSet={srcs.jpg} />}
          <img
            src={srcs.fallback}
            alt={photo.alt}
            className="gallery-lightbox-img"
            style={
              meta
                ? { aspectRatio: `${meta.aspectRatio}` }
                : undefined
            }
          />
        </picture>
        <div className="gallery-lightbox-info">
          <p className="gallery-lightbox-caption">{photo.caption}</p>
          <p className="gallery-lightbox-counter">
            {index + 1} / {photos.length}
          </p>
        </div>
      </div>
    </div>
  );
}

function GalleryThumbnail({
  photo,
  index,
  onOpen,
}: {
  photo: GalleryPhoto;
  index: number;
  onOpen: (index: number) => void;
}) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [loaded, setLoaded] = useState(false);
  const meta = imageRegistry[photo.src];
  const aspectRatio = meta ? meta.aspectRatio : 1;

  const handleClick = () => {
    onOpen(index);
  };

  return (
    <button
      ref={buttonRef}
      className="gallery-thumb"
      onClick={handleClick}
      aria-label={`Open photograph: ${photo.caption}`}
      data-gallery-index={index}
    >
      <div
        className="gallery-thumb-frame"
        style={{ aspectRatio: `${aspectRatio}` }}
      >
        <Img
          slug={photo.src}
          alt={photo.alt}
          className={`gallery-thumb-img ${loaded ? 'gallery-thumb-img--loaded' : ''}`}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          onLoad={() => setLoaded(true)}
        />
        <div className="gallery-thumb-overlay">
          <p className="gallery-thumb-caption">{photo.caption}</p>
        </div>
      </div>
    </button>
  );
}

export function PhotoGallery() {
  const [filter, setFilter] = useState<Filter>('All');
  const [expanded, setExpanded] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const headerRef = useReveal<HTMLDivElement>();
  const gridRef = useReveal<HTMLDivElement>();

  const filterOptions: Filter[] = useMemo(
    () => ['All', ...nonEmptyCategories],
    []
  );

  const filteredPhotos = useMemo(() => {
    if (filter === 'All') return galleryPhotos;
    return galleryPhotos.filter((p) => p.category === filter);
  }, [filter]);

  const visiblePhotos = useMemo(
    () => (expanded ? filteredPhotos : filteredPhotos.slice(0, INITIAL_COUNT)),
    [filteredPhotos, expanded]
  );

  const hasMore = filteredPhotos.length > INITIAL_COUNT;

  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const handleOpen = (index: number) => {
    triggerRef.current = document.activeElement as HTMLButtonElement;
    setLightboxIndex(index);
  };

  const handleClose = () => {
    setLightboxIndex(null);
    requestAnimationFrame(() => {
      triggerRef.current?.focus();
    });
  };

  const handleNavigate = (newIndex: number) => {
    setLightboxIndex(newIndex);
  };

  return (
    <section className="bg-cream pb-[var(--space-xl)] md:pb-[var(--space-2xl)]">
      <div className="container-wide">
        <div ref={headerRef} data-reveal className="mb-10">
          <p className="eyebrow text-brass-on-light">Gallery</p>
          <h2 className="display-4 serif mt-6 text-lake">
            Seen from<br />
            <em className="font-medium">the eleventh floor.</em>
          </h2>
        </div>

        <div ref={gridRef} data-reveal>
          <div className="flex flex-wrap gap-2 mb-8">
            {filterOptions.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setFilter(cat);
                  setExpanded(false);
                }}
                className={`walkability-pill ${filter === cat ? 'walkability-pill--active' : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="gallery-grid">
            {visiblePhotos.map((photo, i) => (
              <GalleryThumbnail
                key={`${photo.src}-${i}`}
                photo={photo}
                index={i}
                onOpen={handleOpen}
              />
            ))}
          </div>

          {hasMore && !expanded && (
            <div className="gallery-expand-row">
              <button
                onClick={() => setExpanded(true)}
                className="gallery-expand-btn"
              >
                View all photographs
                <ArrowDown size={15} strokeWidth={1.5} />
              </button>
            </div>
          )}
        </div>
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          photos={visiblePhotos}
          index={lightboxIndex}
          onClose={handleClose}
          onNavigate={handleNavigate}
        />
      )}
    </section>
  );
}

export default PhotoGallery;

interface ImageVariant {
  width: number;
}

const imageRegistry: Record<string, {
  widths: number[];
  ext: 'jpg' | 'png';
  aspectRatio: number;
}> = {
  'hero-sunset':      { widths: [640, 1024, 1600], ext: 'jpg', aspectRatio: 1600 / 1200 },
  'tower-aerial':     { widths: [640, 1024],       ext: 'jpg', aspectRatio: 1024 / 682 },
  'trail-shoreline':  { widths: [640, 1024, 1080], ext: 'jpg', aspectRatio: 1080 / 700 },
  'trail-woods':      { widths: [640, 1024],       ext: 'jpg', aspectRatio: 1024 / 485 },
  'lake-panorama':    { widths: [640, 1024, 1600, 2044], ext: 'jpg', aspectRatio: 2044 / 624 },
  'village-evening':  { widths: [640, 1024, 1280], ext: 'jpg', aspectRatio: 1280 / 720 },
  'village-daylight': { widths: [640, 1024],       ext: 'jpg', aspectRatio: 1024 / 768 },
  'village-dining':   { widths: [640, 1024],       ext: 'jpg', aspectRatio: 1024 / 683 },
  'village-signage':  { widths: [640, 1024],       ext: 'jpg', aspectRatio: 1024 / 768 },
  'village-restaurant': { widths: [640, 800],      ext: 'jpg', aspectRatio: 800 / 722 },
  'village-street':   { widths: [600],             ext: 'jpg', aspectRatio: 600 / 800 },
  'balcony-sunset':   { widths: [640, 1024, 1199], ext: 'jpg', aspectRatio: 1199 / 1600 },
  'tower-detail':     { widths: [474],             ext: 'jpg', aspectRatio: 474 / 474 },
};

const imageBase = '/assets/images/';

interface ImgProps {
  slug: keyof typeof imageRegistry;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  objectPosition?: string;
}

export function Img({
  slug,
  alt,
  className = '',
  priority = false,
  sizes = '100vw',
  objectPosition = 'center',
}: ImgProps) {
  const meta = imageRegistry[slug];
  if (!meta) throw new Error(`Unknown image slug: ${slug}`);

  const widths = meta.widths;
  const ext = meta.ext;

  const webpSrcset = widths
    .map((w) => `${imageBase}${slug}-${w}.webp ${w}w`)
    .join(', ');

  const jpgSrcset = widths
    .map((w) => `${imageBase}${slug}-${w}.${ext} ${w}w`)
    .join(', ');

  const fallbackSrc = `${imageBase}${slug}-${widths[widths.length - 1]}.${ext}`;

  return (
    <picture>
      <source
        type="image/webp"
        srcSet={webpSrcset}
        sizes={sizes}
      />
      <source
        type="image/jpeg"
        srcSet={jpgSrcset}
        sizes={sizes}
      />
      <img
        src={fallbackSrc}
        alt={alt}
        width={widths[widths.length - 1]}
        height={Math.round(widths[widths.length - 1] / meta.aspectRatio)}
        className={className}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        {...(priority ? { fetchpriority: 'high' } : {})}
        style={objectPosition !== 'center' ? { objectPosition } : undefined}
      />
    </picture>
  );
}

export default Img;

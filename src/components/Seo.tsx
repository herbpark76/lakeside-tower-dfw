import { Head } from 'vite-react-ssg';
import type { ReactNode } from 'react';

const SITE_URL = 'https://www.lakesidetower.com';
const SITE_NAME = 'Lakeside Tower';
const OG_IMAGE = `${SITE_URL}/assets/images/og-card-1200x630.jpg`;
const OG_IMAGE_ALT = 'Lakeside Tower on the north shore of Lake Grapevine at sunset';

interface SeoProps {
  title: string;
  description: string;
  path: string;
  type?: string;
  jsonLd?: Record<string, unknown>;
  ogImage?: string;
  ogImageAlt?: string;
  children?: ReactNode;
}

export function Seo({ title, description, path, type = 'website', jsonLd, ogImage, ogImageAlt, children }: SeoProps) {
  const url = `${SITE_URL}${path}`;
  const image = ogImage ?? OG_IMAGE;
  const imageAlt = ogImageAlt ?? OG_IMAGE_ALT;
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={imageAlt} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={imageAlt} />

      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
      {children}
    </Head>
  );
}

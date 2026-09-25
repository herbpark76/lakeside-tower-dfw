import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const contentDir = join(root, 'content', 'journal');
const sitemapPath = join(root, 'public', 'sitemap.xml');
const SITE_URL = 'https://www.lakesidetower.com';

function parseSlug(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;
  const yaml = match[1];
  for (const line of yaml.split(/\r?\n/)) {
    const m = line.match(/^slug:\s*(.*)$/);
    if (m) return m[1].replace(/^["']|["']$/g, '');
  }
  return null;
}

async function main() {
  const staticUrls = [
    { loc: '/', changefreq: 'monthly', priority: '1.0' },
    { loc: '/residences', changefreq: 'monthly', priority: '0.9' },
    { loc: '/life-at-lakeside', changefreq: 'monthly', priority: '0.8' },
    { loc: '/location', changefreq: 'monthly', priority: '0.8' },
    { loc: '/journal', changefreq: 'weekly', priority: '0.7' },
    { loc: '/about', changefreq: 'yearly', priority: '0.6' },
    { loc: '/contact', changefreq: 'yearly', priority: '0.6' },
    { loc: '/privacy', changefreq: 'yearly', priority: '0.3' },
  ];

  let files = [];
  try {
    files = await readdir(contentDir);
  } catch {
    // no content directory
  }

  const postUrls = [];
  for (const file of files) {
    if (!file.endsWith('.md')) continue;
    const raw = await readFile(join(contentDir, file), 'utf-8');
    const slug = parseSlug(raw);
    if (slug) {
      postUrls.push({
        loc: `/journal/${slug}`,
        changefreq: 'monthly',
        priority: '0.6',
      });
    }
  }

  const allUrls = [...staticUrls, ...postUrls];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    (u) =>
      `  <url><loc>${SITE_URL}${u.loc}</loc><changefreq>${u.changefreq}</changefreq><priority>${u.priority}</priority></url>`
  )
  .join('\n')}
</urlset>
`;

  await writeFile(sitemapPath, xml.trim() + '\n');
  console.log(`Sitemap generated with ${allUrls.length} URLs`);
}

main();

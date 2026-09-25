import { marked } from 'marked';

export interface JournalPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  heroImage: string;
  heroAlt: string;
  author: string;
  bodyHtml: string;
}

interface RawFrontMatter {
  title?: string;
  slug?: string;
  date?: string;
  excerpt?: string;
  heroImage?: string;
  heroAlt?: string;
  author?: string;
}

function parseFrontMatter(raw: string): { data: RawFrontMatter; content: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { data: {}, content: raw };

  const [, yaml, content] = match;
  const data: RawFrontMatter = {};

  for (const line of yaml.split(/\r?\n/)) {
    const m = line.match(/^(\w+):\s*(.*)$/);
    if (!m) continue;
    const [, key, value] = m;
    const unquoted = value.replace(/^["']|["']$/g, '');
    (data as Record<string, string>)[key] = unquoted;
  }

  return { data, content };
}

const modules = import.meta.glob('/content/journal/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

function loadPosts(): JournalPost[] {
  const posts: JournalPost[] = [];

  for (const [path, raw] of Object.entries(modules)) {
    const { data, content } = parseFrontMatter(raw);
    if (!data.slug || !data.title) continue;

    posts.push({
      slug: data.slug,
      title: data.title,
      date: data.date ?? '',
      excerpt: data.excerpt ?? '',
      heroImage: data.heroImage ?? '',
      heroAlt: data.heroAlt ?? '',
      author: data.author ?? '',
      bodyHtml: marked.parse(content, { async: false }) as string,
    });
  }

  posts.sort((a, b) => b.date.localeCompare(a.date));
  return posts;
}

export const journalPosts: JournalPost[] = loadPosts();

export function getPostBySlug(slug: string): JournalPost | undefined {
  return journalPosts.find((p) => p.slug === slug);
}

export function getOtherPosts(slug: string, count = 2): JournalPost[] {
  return journalPosts.filter((p) => p.slug !== slug).slice(0, count);
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

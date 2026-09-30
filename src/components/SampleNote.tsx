import { SHOW_SAMPLE_MARKERS } from '@/data/draft';

export function SampleNote() {
  if (!SHOW_SAMPLE_MARKERS) return null;

  return (
    <span
      className="inline-flex items-center whitespace-nowrap rounded-full border border-brass-light/80 bg-transparent px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-brass-light"
      style={{ textShadow: '0 1px 3px rgba(16,41,50,0.45)' }}
    >
      Sample — board to confirm
    </span>
  );
}

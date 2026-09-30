import { SHOW_SAMPLE_MARKERS } from '@/data/draft';

export function SampleNote() {
  if (!SHOW_SAMPLE_MARKERS) return null;

  return (
    <span
      className="inline-flex max-w-full items-center whitespace-normal rounded-full border border-brass bg-transparent px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-brass-on-light"
    >
      Sample — board to confirm
    </span>
  );
}

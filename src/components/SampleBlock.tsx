import type { ReactNode } from 'react';
import { SHOW_SAMPLE_MARKERS } from '@/data/draft';
import { SampleNote } from './SampleNote';

interface SampleBlockProps {
  children: ReactNode;
  className?: string;
}

export function SampleBlock({ children, className = '' }: SampleBlockProps) {
  if (!SHOW_SAMPLE_MARKERS) {
    return <>{children}</>;
  }

  return (
    <div className={`rounded-sm border border-dashed border-brass/40 p-4 ${className}`}>
      <div className="mb-3">
        <SampleNote />
      </div>
      {children}
    </div>
  );
}

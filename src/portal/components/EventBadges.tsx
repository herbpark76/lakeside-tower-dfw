import type { PortalEvent, EventCategory, RsvpStatus } from '../data/types';
import { Link } from 'react-router-dom';
import { Users, MapPin, Potluck } from 'lucide-react';

const CATEGORY_COLORS: Record<EventCategory, string> = {
  'Holidays': 'bg-green-600/10 text-green-700',
  'HOA Sponsored': 'bg-brass/10 text-brass-on-light',
  'Resident Sponsored': 'bg-lake/8 text-lake',
  'Board/Committee': 'bg-lake-deep/8 text-lake-deep',
  'Neighborhood': 'bg-amber-500/10 text-amber-700',
};

export function CategoryChip({ category }: { category: EventCategory }) {
  const color = CATEGORY_COLORS[category] ?? 'bg-lake/8 text-lake';
  return (
    <span className={`rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${color}`}>
      {category}
    </span>
  );
}

interface BadgeProps {
  event: Pick<PortalEvent, 'rsvpRequired' | 'potluck' | 'offsite' | 'status' | 'externalRsvpUrl' | 'recurring' | 'category'>;
}

function externalLinkLabel(url: string, category?: PortalEvent['category']): string {
  if (url.includes('evite.com')) return 'Evite';
  if (category === 'Neighborhood' || category === 'Off-site') return 'Tickets';
  return 'Details';
}

export function EventBadges({ event }: BadgeProps) {
  return (
    <>
      {event.status === 'cancelled' && (
        <span className="rounded bg-red-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
          Cancelled
        </span>
      )}
      {event.rsvpRequired && (
        <span className="rounded bg-brass/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brass-on-light">
          RSVP required
        </span>
      )}
      {event.potluck && (
        <span className="rounded bg-green-600/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-green-700">
          Potluck
        </span>
      )}
      {event.offsite && (
        <span className="rounded bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-700">
          Off-site
        </span>
      )}
      {event.externalRsvpUrl && (
        <span className="rounded bg-lake/8 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-lake">
          {externalLinkLabel(event.externalRsvpUrl, event.category)}
        </span>
      )}
      {event.recurring && (
        <span className="rounded bg-lake/8 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-lake">
          Recurring
        </span>
      )}
    </>
  );
}

const RSVP_STATUS_LABELS: Record<RsvpStatus, { label: string; className: string }> = {
  going: { label: "You're going", className: 'bg-green-600/10 text-green-700' },
  maybe: { label: "You're a maybe", className: 'bg-amber-500/10 text-amber-700' },
  not_going: { label: "You can't go", className: 'bg-red-600/10 text-red-700' },
  waitlist: { label: 'On waitlist', className: 'bg-lake/10 text-lake' },
};

const NEUTRAL_STATUS_LABELS: Record<RsvpStatus, { label: string; className: string }> = {
  going: { label: 'Going', className: 'bg-green-600/10 text-green-700' },
  maybe: { label: 'Maybe', className: 'bg-amber-500/10 text-amber-700' },
  not_going: { label: "Can't go", className: 'bg-red-600/10 text-red-700' },
  waitlist: { label: 'Waitlist', className: 'bg-lake/10 text-lake' },
};

export function RsvpStatusChip({ status }: { status: RsvpStatus }) {
  const info = RSVP_STATUS_LABELS[status];
  return (
    <span className={`rounded px-2 py-0.5 text-[11px] font-semibold ${info.className}`}>
      {info.label}
    </span>
  );
}

export function NeutralStatusChip({ status }: { status: RsvpStatus }) {
  const info = NEUTRAL_STATUS_LABELS[status];
  return (
    <span className={`rounded px-2 py-0.5 text-[11px] font-semibold ${info.className}`}>
      {info.label}
    </span>
  );
}

export const EVENT_CATEGORIES: EventCategory[] = [
  'Holidays',
  'HOA Sponsored',
  'Resident Sponsored',
  'Board/Committee',
  'Neighborhood',
];

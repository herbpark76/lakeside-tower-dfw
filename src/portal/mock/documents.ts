import type { PortalDocument } from '../data/types';
import { daysFromNow } from '../utils/dateUtils';

export const mockDocuments: PortalDocument[] = [
  // Town hall docs
  {
    id: 'doc-town-hall-slides',
    title: 'Town Hall — Fire Safety Slides',
    category: 'Safety & Emergency',
    date: daysFromNow(-3),
    fileSizeLabel: '2.4 MB',
    relatedMeetingId: 'meeting-town-hall',
  },
  {
    id: 'doc-high-rise-faqs',
    title: 'High-Rise Fire Safety — Resident FAQ',
    category: 'Safety & Emergency',
    date: daysFromNow(-3),
    fileSizeLabel: '320 KB',
    relatedMeetingId: 'meeting-town-hall',
  },
  {
    id: 'doc-safety-implementation-plan',
    title: 'Safety Implementation Plan',
    category: 'Safety & Emergency',
    date: daysFromNow(-3),
    fileSizeLabel: '185 KB',
    isLivingDocument: true,
    updatedAt: daysFromNow(-1),
    relatedMeetingId: 'meeting-town-hall',
  },
  // Governing documents
  {
    id: 'doc-bylaws',
    title: 'Association bylaws (current)',
    category: 'Governing Documents',
    date: daysFromNow(-900),
    fileSizeLabel: '420 KB',
  },
  {
    id: 'doc-ccrs',
    title: 'Declaration of covenants, conditions & restrictions',
    category: 'Governing Documents',
    date: daysFromNow(-900),
    fileSizeLabel: '1.1 MB',
  },
  {
    id: 'doc-rules',
    title: 'House rules and policies',
    category: 'Governing Documents',
    date: daysFromNow(-120),
    fileSizeLabel: '180 KB',
  },
  // Meetings
  {
    id: 'doc-board-minutes-latest',
    title: 'Board meeting minutes — last month',
    category: 'Meetings',
    date: daysFromNow(-30),
    fileSizeLabel: '95 KB',
  },
  {
    id: 'doc-board-agenda-next',
    title: 'Board meeting agenda — upcoming',
    category: 'Meetings',
    date: daysFromNow(-2),
    fileSizeLabel: '48 KB',
  },
  // Financials
  {
    id: 'doc-budget-draft',
    title: 'Draft association budget — next fiscal year',
    category: 'Financials',
    date: daysFromNow(-15),
    fileSizeLabel: '210 KB',
  },
  // Projects
  {
    id: 'doc-garage-epoxy-scope',
    title: '2nd Floor Garage Epoxy — project scope',
    category: 'Projects',
    date: daysFromNow(-10),
    fileSizeLabel: '340 KB',
  },
  // Forms
  {
    id: 'doc-arc-form',
    title: 'Architectural review request form',
    category: 'Forms',
    date: daysFromNow(-120),
    fileSizeLabel: '55 KB',
  },
];

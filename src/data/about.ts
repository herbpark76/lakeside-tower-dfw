export const SHOW_BOARD_NAMES = true;

export interface Fact {
  value: string;
  label: string;
  sample?: boolean;
}

export const facts: Fact[] = [
  { value: '16', label: 'floors' },
  { value: '55', label: 'residences' },
  { value: '2020', label: 'year completed', sample: true },
  { value: '5', label: 'board members', sample: true },
];

export interface TimelineEntry {
  year: string;
  text: string;
  sample: true;
}

export const timeline: TimelineEntry[] = [
  { year: '2017', text: 'Ground broken on the north shore of Lake Grapevine.', sample: true },
  { year: '2020', text: 'First owners move in.', sample: true },
  { year: '2021', text: 'Final residences sold; the building is fully owner-occupied.', sample: true },
  { year: '2023', text: 'Owners take over governance from the developer.', sample: true },
  { year: '2026', text: 'Lakeside Tower\u2019s community website launches.', sample: true },
];

export const governanceText =
  'Lakeside Tower is governed by its owners through the homeowners association. An elected board of five owners sets policy and the budget. Day-to-day operations are handled by FirstService Residential, with a front desk staffed around the clock. Owners meet at least once a year, at the annual meeting each spring.';

export interface BoardMember {
  role: string;
  name: string;
  sample: true;
}

export const boardMembers: BoardMember[] = [
  { role: 'President', name: 'Name to come', sample: true },
  { role: 'Vice President', name: 'Name to come', sample: true },
  { role: 'Treasurer', name: 'Name to come', sample: true },
  { role: 'Secretary', name: 'Name to come', sample: true },
  { role: 'Director at Large', name: 'Name to come', sample: true },
];

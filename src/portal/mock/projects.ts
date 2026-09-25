import type { Project } from '../data/types';
import { daysFromNow } from '../utils/dateUtils';

export const mockProjects: Project[] = [
  {
    id: 'project-garage-epoxy-2nd',
    title: '2nd Floor Garage Epoxy',
    summary: 'Applying a durable epoxy coating to the 2nd-floor garage floor. Expect short entrance closures during prep and application.',
    status: 'in_progress',
    targetDate: daysFromNow(7),
    updates: [
      { date: daysFromNow(-7), text: 'Material delivery scheduled. Prep work begins next week.' },
      { date: daysFromNow(-1), text: 'Entrance closure notices sent to 2nd-floor parkers. At least one hour notice will be given before each closure.' },
      { date: daysFromNow(0), text: 'Surface preparation underway. Application expected to start within 48 hours.' },
    ],
  },
  {
    id: 'project-dog-spa-car-wash-epoxy',
    title: 'Dog Spa & Car Wash Epoxy',
    summary: 'Epoxy coating for the Dog Spa and Car Wash area, similar to the garage project. Scheduled to begin next week.',
    status: 'planned',
    targetDate: daysFromNow(14),
    updates: [
      { date: daysFromNow(-5), text: 'Project scoped and materials ordered.' },
      { date: daysFromNow(-2), text: 'Scheduling confirmed for next week. Closure notices will be sent closer to the date.' },
    ],
  },
  {
    id: 'project-hvac-sensors',
    title: 'HVAC Sensor Program',
    summary: 'Installing smart HVAC sensors across participating units for improved climate control and energy monitoring.',
    status: 'in_progress',
    updates: [
      { date: daysFromNow(-21), text: 'Program launched. Sensors delivered and installation schedule opened.' },
      { date: daysFromNow(-10), text: 'Approximately 60% of participating units have sensors installed.' },
      { date: daysFromNow(-2), text: 'Remaining units contacted to schedule installs. Each install takes about 45 minutes.' },
    ],
  },
  {
    id: 'project-pool-pump',
    title: 'Pool Pump Replacement',
    summary: 'Replacing the failed main pool pump. Pool closed until the replacement is installed and tested.',
    status: 'in_progress',
    targetDate: daysFromNow(4),
    updates: [
      { date: daysFromNow(-1), text: 'Pump failure detected. Replacement ordered with expedited shipping.' },
      { date: daysFromNow(0), text: 'Replacement pump received. Installation scheduled. Pool expected to reopen by Thursday.' },
    ],
  },
];

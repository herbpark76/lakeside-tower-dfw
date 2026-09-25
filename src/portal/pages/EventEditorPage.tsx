import { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Head } from 'vite-react-ssg';
import { ArrowLeft } from 'lucide-react';
import { PortalLayout } from '../components/PortalLayout';
import { useAuth } from '../auth/AuthContext';
import { useEvent, dataSource } from '../data/hooks';
import { EVENT_CATEGORIES } from '../components/EventBadges';
import { toChicagoISO } from '../lib/dates';
import type { PortalEvent, EventCategory, EventStatus } from '../data/types';

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div
      className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-lake-deep px-5 py-3 text-[13px] text-cream shadow-lg"
      role="status"
      onClick={onClose}
    >
      {message}
    </div>
  );
}

interface FormState {
  title: string;
  category: EventCategory;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  location: string;
  locationTBD: boolean;
  offsite: boolean;
  description: string;
  bringNote: string;
  rsvpRequired: boolean;
  rsvpDeadlineDate: string;
  rsvpDeadlineTime: string;
  capacity: string;
  allowGuests: boolean;
  potluck: boolean;
  externalRsvpUrl: string;
  organizerName: string;
  status: EventStatus;
}

function emptyForm(organizerName: string): FormState {
  return {
    title: '',
    category: 'Social',
    startDate: '',
    startTime: '18:00',
    endDate: '',
    endTime: '20:00',
    location: '',
    locationTBD: false,
    offsite: false,
    description: '',
    bringNote: '',
    rsvpRequired: false,
    rsvpDeadlineDate: '',
    rsvpDeadlineTime: '12:00',
    capacity: '',
    allowGuests: true,
    potluck: false,
    externalRsvpUrl: '',
    organizerName,
    status: 'scheduled',
  };
}

function eventToForm(event: PortalEvent): FormState {
  const TZ = 'America/Chicago';
  const PAD = (n: number) => String(n).padStart(2, '0');
  const toLocalInputs = (iso: string) => {
    const d = new Date(iso);
    return {
      date: d.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: TZ }).replace(/\//g, '-'),
      time: d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: TZ }).replace(/^24/, '00'),
    };
  };
  const startInputs = toLocalInputs(event.startsAt);
  const endInputs = event.endsAt ? toLocalInputs(event.endsAt) : { date: '', time: '20:00' };

  const deadlineInputs = event.rsvpDeadline ? toLocalInputs(event.rsvpDeadline) : { date: '', time: '12:00' };

  return {
    title: event.title,
    category: event.category,
    startDate: startInputs.date,
    startTime: startInputs.time,
    endDate: endInputs.date,
    endTime: endInputs.time,
    location: event.location,
    locationTBD: event.locationTBD ?? false,
    offsite: event.offsite ?? false,
    description: event.description,
    bringNote: event.bringNote ?? '',
    rsvpRequired: event.rsvpRequired,
    rsvpDeadlineDate: deadlineInputs.date,
    rsvpDeadlineTime: deadlineInputs.time,
    capacity: event.capacity?.toString() ?? '',
    allowGuests: event.allowGuests,
    potluck: event.potluck ?? false,
    externalRsvpUrl: event.externalRsvpUrl ?? '',
    organizerName: event.organizerName,
    status: event.status,
  };
}

function formToEvent(form: FormState, id: string): PortalEvent {
  const startsAt = form.startDate ? toChicagoISO(form.startDate, form.startTime) : '';
  const endsAt = form.endDate ? toChicagoISO(form.endDate, form.endTime) : undefined;
  const rsvpDeadline =
    form.rsvpRequired && form.rsvpDeadlineDate
      ? toChicagoISO(form.rsvpDeadlineDate, form.rsvpDeadlineTime)
      : undefined;

  return {
    id,
    title: form.title,
    category: form.category,
    startsAt,
    endsAt,
    location: form.locationTBD ? 'Location TBD' : form.location,
    locationTBD: form.locationTBD,
    offsite: form.offsite,
    description: form.description,
    bringNote: form.bringNote || undefined,
    rsvpRequired: form.rsvpRequired,
    rsvpDeadline,
    capacity: form.capacity ? parseInt(form.capacity, 10) : undefined,
    allowGuests: form.allowGuests,
    potluck: form.potluck,
    externalRsvpUrl: form.externalRsvpUrl || undefined,
    organizerName: form.organizerName,
    status: form.status,
  };
}

const inputClass =
  'w-full border border-lake/20 px-3 py-2 text-[14px] text-lake focus:border-brass focus:outline-none';
const labelClass = 'text-[13px] font-semibold text-lake/70';
const checkboxLabelClass =
  'flex items-center gap-2 text-[14px] text-lake cursor-pointer';

export function EventEditorPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const fromId = searchParams.get('from');
  const isEdit = !!id;
  const { user } = useAuth();
  const navigate = useNavigate();
  const { event: existingEvent, loading } = useEvent(id || undefined);
  const { event: sourceEvent, loading: sourceLoading } = useEvent(fromId || undefined);

  const [form, setForm] = useState<FormState>(() =>
    emptyForm(user?.displayName ?? 'Demo Lifestyle Manager'),
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  // For edit mode: load from existing event
  useEffect(() => {
    if (isEdit && !loading && existingEvent && !initialized) {
      setForm(eventToForm(existingEvent));
      setInitialized(true);
    }
  }, [isEdit, loading, existingEvent, initialized]);

  // For duplicate mode: load from source event but clear dates
  useEffect(() => {
    if (!isEdit && fromId && !sourceLoading && sourceEvent && !initialized) {
      const f = eventToForm(sourceEvent);
      f.startDate = '';
      f.endDate = '';
      f.rsvpDeadlineDate = '';
      f.title = `${sourceEvent.title} (Copy)`;
      setForm(f);
      setInitialized(true);
    }
  }, [fromId, sourceLoading, sourceEvent, isEdit, initialized]);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => {
      const next = { ...e };
      delete next[key];
      return next;
    });
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (!form.startDate) errs.startDate = 'Start date is required';
    if (!form.startTime) errs.startTime = 'Start time is required';
    if (form.endDate && form.endTime && form.endDate < form.startDate) {
      errs.endDate = 'End date must be on or after start date';
    }
    if (
      form.endDate &&
      form.endTime &&
      form.endDate === form.startDate &&
      form.endTime <= form.startTime
    ) {
      errs.endTime = 'End time must be after start time';
    }
    if (!form.locationTBD && !form.location.trim()) {
      errs.location = 'Location is required (or check "Location TBD")';
    }
    if (!form.description.trim()) errs.description = 'Description is required';
    if (form.rsvpRequired && form.rsvpDeadlineDate && !form.rsvpDeadlineTime) {
      errs.rsvpDeadlineTime = 'RSVP deadline time is required';
    }
    if (form.capacity && (parseInt(form.capacity, 10) < 1 || isNaN(parseInt(form.capacity, 10)))) {
      errs.capacity = 'Capacity must be a positive number';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    if (isEdit && id) {
      const evt = formToEvent(form, id);
      await dataSource.updateEvent(id, evt);
      showToast('Saved (demo only — stored in this browser)');
      setTimeout(() => navigate(`/portal/events/${id}`), 1000);
    } else {
      const evt = formToEvent(form, `evt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`);
      const created = await dataSource.createEvent(evt);
      showToast('Saved (demo only — stored in this browser)');
      setTimeout(() => navigate(`/portal/events/${created.id}`), 1000);
    }
  };

  if (loading || (fromId && sourceLoading)) {
    return (
      <>
        <Head>
          <title>{isEdit ? 'Edit Event' : 'New Event'} | Owner Portal</title>
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        <PortalLayout>
          <div className="container-narrow py-12">
            <p className="text-lake/40">Loading…</p>
          </div>
        </PortalLayout>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{isEdit ? 'Edit Event' : 'New Event'} | Owner Portal</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <PortalLayout>
        <div className="container-narrow py-12">
          <Link
            to="/portal/events"
            className="inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-brass-on-light transition hover:text-lake-deep"
          >
            <ArrowLeft size={14} strokeWidth={1.5} />
            Back to Events
          </Link>

          <h1 className="display-4 serif mt-6 text-lake">
            {isEdit ? 'Edit event' : 'New event'}
          </h1>

          <div className="mt-8 space-y-6">
            {/* Title */}
            <div>
              <label className={labelClass}>Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => update('title', e.target.value)}
                className={`mt-1.5 ${inputClass}`}
                placeholder="e.g. Wine Tasting — Spring Varietals"
              />
              {errors.title && <p className="mt-1 text-[12px] text-red-600">{errors.title}</p>}
            </div>

            {/* Category */}
            <div>
              <label className={labelClass}>Category *</label>
              <select
                value={form.category}
                onChange={(e) => update('category', e.target.value as EventCategory)}
                className={`mt-1.5 ${inputClass}`}
              >
                {EVENT_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Date/time */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Start date *</label>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => update('startDate', e.target.value)}
                  className={`mt-1.5 ${inputClass}`}
                />
                {errors.startDate && <p className="mt-1 text-[12px] text-red-600">{errors.startDate}</p>}
              </div>
              <div>
                <label className={labelClass}>Start time *</label>
                <input
                  type="time"
                  value={form.startTime}
                  onChange={(e) => update('startTime', e.target.value)}
                  className={`mt-1.5 ${inputClass}`}
                />
              </div>
              <div>
                <label className={labelClass}>End date</label>
                <input
                  type="date"
                  value={form.endDate}
                  onChange={(e) => update('endDate', e.target.value)}
                  className={`mt-1.5 ${inputClass}`}
                />
                {errors.endDate && <p className="mt-1 text-[12px] text-red-600">{errors.endDate}</p>}
              </div>
              <div>
                <label className={labelClass}>End time</label>
                <input
                  type="time"
                  value={form.endTime}
                  onChange={(e) => update('endTime', e.target.value)}
                  className={`mt-1.5 ${inputClass}`}
                />
                {errors.endTime && <p className="mt-1 text-[12px] text-red-600">{errors.endTime}</p>}
              </div>
            </div>

            {/* Location */}
            <div>
              <label className={labelClass}>Location</label>
              <div className="mt-1.5 space-y-2">
                <label className={checkboxLabelClass}>
                  <input
                    type="checkbox"
                    checked={form.locationTBD}
                    onChange={(e) => update('locationTBD', e.target.checked)}
                  />
                  Location TBD
                </label>
                {!form.locationTBD && (
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => update('location', e.target.value)}
                    className={inputClass}
                    placeholder="e.g. Billiards Lounge"
                  />
                )}
                {errors.location && <p className="mt-1 text-[12px] text-red-600">{errors.location}</p>}
                <label className={checkboxLabelClass}>
                  <input
                    type="checkbox"
                    checked={form.offsite}
                    onChange={(e) => update('offsite', e.target.checked)}
                  />
                  Off-site
                </label>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className={labelClass}>Description * <span className="text-lake/30 font-normal">(markdown supported)</span></label>
              <textarea
                value={form.description}
                onChange={(e) => update('description', e.target.value)}
                rows={4}
                className={`mt-1.5 ${inputClass}`}
                placeholder="Describe the event…"
              />
              {errors.description && <p className="mt-1 text-[12px] text-red-600">{errors.description}</p>}
            </div>

            {/* Bring note */}
            <div>
              <label className={labelClass}>Bring note <span className="text-lake/30 font-normal">(optional)</span></label>
              <input
                type="text"
                value={form.bringNote}
                onChange={(e) => update('bringNote', e.target.value)}
                className={`mt-1.5 ${inputClass}`}
                placeholder="e.g. BYO wine glass"
              />
            </div>

            {/* RSVP settings */}
            <div className="rounded-md border border-lake/10 p-5">
              <label className={checkboxLabelClass}>
                <input
                  type="checkbox"
                  checked={form.rsvpRequired}
                  onChange={(e) => update('rsvpRequired', e.target.checked)}
                />
                <span className={labelClass}>RSVP required</span>
              </label>

              {form.rsvpRequired && (
                <div className="mt-4 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className={labelClass}>RSVP deadline date</label>
                      <input
                        type="date"
                        value={form.rsvpDeadlineDate}
                        onChange={(e) => update('rsvpDeadlineDate', e.target.value)}
                        className={`mt-1.5 ${inputClass}`}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>RSVP deadline time</label>
                      <input
                        type="time"
                        value={form.rsvpDeadlineTime}
                        onChange={(e) => update('rsvpDeadlineTime', e.target.value)}
                        className={`mt-1.5 ${inputClass}`}
                      />
                      {errors.rsvpDeadlineTime && <p className="mt-1 text-[12px] text-red-600">{errors.rsvpDeadlineTime}</p>}
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Capacity <span className="text-lake/30 font-normal">(leave empty for unlimited)</span></label>
                    <input
                      type="number"
                      value={form.capacity}
                      onChange={(e) => update('capacity', e.target.value)}
                      className={`mt-1.5 ${inputClass}`}
                      placeholder="e.g. 30"
                      min="1"
                    />
                    {errors.capacity && <p className="mt-1 text-[12px] text-red-600">{errors.capacity}</p>}
                  </div>
                </div>
              )}

              <div className="mt-4 flex flex-wrap gap-6">
                <label className={checkboxLabelClass}>
                  <input
                    type="checkbox"
                    checked={form.allowGuests}
                    onChange={(e) => update('allowGuests', e.target.checked)}
                  />
                  Allow guests
                </label>
                <label className={checkboxLabelClass}>
                  <input
                    type="checkbox"
                    checked={form.potluck}
                    onChange={(e) => update('potluck', e.target.checked)}
                  />
                  Potluck
                </label>
              </div>
            </div>

            {/* External RSVP */}
            <div>
              <label className={labelClass}>
                Using Evite instead? Paste the link <span className="text-lake/30 font-normal">(optional)</span>
              </label>
              <input
                type="url"
                value={form.externalRsvpUrl}
                onChange={(e) => update('externalRsvpUrl', e.target.value)}
                className={`mt-1.5 ${inputClass}`}
                placeholder="https://www.evite.com/…"
              />
            </div>

            {/* Organizer */}
            <div>
              <label className={labelClass}>Organizer name</label>
              <input
                type="text"
                value={form.organizerName}
                onChange={(e) => update('organizerName', e.target.value)}
                className={`mt-1.5 ${inputClass}`}
              />
            </div>

            {/* Status */}
            <div>
              <label className={labelClass}>Status</label>
              <select
                value={form.status}
                onChange={(e) => update('status', e.target.value as EventStatus)}
                className={`mt-1.5 ${inputClass}`}
              >
                <option value="scheduled">Scheduled</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Save buttons */}
            <div className="flex gap-4 pt-4">
              <button
                onClick={handleSave}
                className="bg-brass px-7 py-3 text-[13px] font-bold uppercase tracking-[0.12em] text-lake-deep transition hover:brightness-110"
              >
                {isEdit ? 'Save changes' : 'Create event'}
              </button>
              <Link
                to="/portal/events"
                className="border border-lake/20 px-7 py-3 text-[13px] font-semibold uppercase tracking-[0.12em] text-lake transition hover:border-brass"
              >
                Cancel
              </Link>
            </div>
          </div>
        </div>
      </PortalLayout>
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </>
  );
}

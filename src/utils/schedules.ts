/**
 * Helper data schedule kontrak baru — docs/SCHEDULE-ARCHITECTURE-PLAN.md §11.
 *
 * Lapisan ini adalah sumber tunggal untuk halaman indeks, arsip bulanan,
 * detail, JSON-LD, dan sitemap (Tahap 3–4). Jangan menduplikasi logika
 * pengelompokan/status di komponen.
 *
 * Catatan: `utils/schedule.ts` (tunggal) tetap menjadi adapter bentuk `Batch`
 * lama untuk menjaga output HTML komponen yang sudah ada. File ini (plural)
 * memakai field kontrak baru secara langsung.
 */
import { getCollection, type CollectionEntry } from 'astro:content';
import { defaultVenue, site } from '../config/site';

export type ScheduleEntry = CollectionEntry<'schedules'>;
export type ClassKey = 'D' | 'C' | 'B' | 'A';
export type Phase = 'scheduled' | 'ongoing' | 'completed' | 'postponed' | 'cancelled';
export type UiStatus = 'open' | 'soon' | 'ongoing' | 'done';

const ORDER: ClassKey[] = ['D', 'C', 'B', 'A'];

export interface ScheduleView {
  entry: ScheduleEntry;
  /** id Astro, mis. "2026/kelas-a/agustus-2026-kelas-a-gelombang-08". */
  id: string;
  data: ScheduleEntry['data'];
  /** "YYYY-MM" dari startDate — kunci arsip bulanan. */
  month: string;
  year: string;
  classKey: ClassKey;
  start: Date;
  end: Date;
  /** Fase lifecycle kanonis (menghormati override terminal di frontmatter). */
  phase: Phase;
}

/** YYYY-MM-DD -> Date lokal (hindari pergeseran zona waktu server). */
function dateOf(iso: string): Date {
  const [y, m, d] = iso.slice(0, 10).split('-').map(Number);
  return new Date(y, m - 1, d);
}

/** Tengah malam lokal hari ini; stabil selama satu build. */
function today(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function classOf(trainingId: string): ClassKey {
  const last = (trainingId.split('-').pop() ?? '').toUpperCase();
  return (ORDER.includes(last as ClassKey) ? last : 'D') as ClassKey;
}

/**
 * Fase kanonis: status terminal dari frontmatter menang; selain itu dihitung
 * dari tanggal pelaksanaan. `ongoing` bukan status terminal.
 */
export function computePhase(
  startDate: string,
  endDate: string,
  statusOverride?: Phase,
): Phase {
  if (statusOverride === 'completed' || statusOverride === 'postponed' || statusOverride === 'cancelled') {
    return statusOverride;
  }
  const st = dateOf(startDate);
  const en = dateOf(endDate);
  const t = today();
  if (en < t) return 'completed';
  if (st <= t) return 'ongoing';
  return 'scheduled';
}

/** Badge UI: Pendaftaran dibuka / Mulai N hari lagi / Sedang berlangsung / Selesai. */
export function computeUiStatus(view: Pick<ScheduleView, 'start' | 'end'>): [UiStatus, string] {
  const t = today();
  if (view.end < t) return ['done', 'Selesai'];
  if (view.start <= t) return ['ongoing', 'Sedang berlangsung'];
  const days = Math.round((view.start.getTime() - t.getTime()) / 86_400_000);
  if (days <= site.soonDays) return ['soon', days === 1 ? 'Mulai besok' : `Mulai ${days} hari lagi`];
  return ['open', 'Pendaftaran dibuka'];
}

/** Lifecycle -> URL schema.org EventStatus (EventScheduled untuk ongoing). */
export function eventStatusUrl(phase: Phase): string {
  switch (phase) {
    case 'completed':
      return 'https://schema.org/EventCompleted';
    case 'postponed':
      return 'https://schema.org/EventPostponed';
    case 'cancelled':
      return 'https://schema.org/EventCancelled';
    default:
      return 'https://schema.org/EventScheduled';
  }
}

/** Attendance mode -> URL schema.org. */
export function attendanceModeUrl(mode: 'offline' | 'online' | 'mixed'): string {
  return {
    offline: 'https://schema.org/OfflineEventAttendanceMode',
    online: 'https://schema.org/OnlineEventAttendanceMode',
    mixed: 'https://schema.org/MixedEventAttendanceMode',
  }[mode];
}

let cache: ScheduleView[] | null = null;

/** Semua schedule non-draft, urut tanggal mulai lalu jenjang (D, C, B, A). */
export async function getSchedules(): Promise<ScheduleView[]> {
  if (cache) return cache;
  const entries = await getCollection('schedules', (entry) => !entry.data.draft);
  cache = entries
    .map((entry) => {
      const d = entry.data;
      return {
        entry,
        id: entry.id,
        data: d,
        month: d.startDate.slice(0, 7),
        year: d.startDate.slice(0, 4),
        classKey: classOf(d.trainingId),
        start: dateOf(d.startDate),
        end: dateOf(d.endDate),
        phase: computePhase(d.startDate, d.endDate, d.status),
      } satisfies ScheduleView;
    })
    .sort(
      (a, b) =>
        a.start.getTime() - b.start.getTime() || ORDER.indexOf(a.classKey) - ORDER.indexOf(b.classKey),
    );
  return cache;
}

/** Kelompokkan per bulan "YYYY-MM"; kunci urut naik. */
export async function getSchedulesByMonth(): Promise<Map<string, ScheduleView[]>> {
  const map = new Map<string, ScheduleView[]>();
  for (const item of await getSchedules()) {
    const list = map.get(item.month) ?? [];
    list.push(item);
    map.set(item.month, list);
  }
  return new Map([...map.entries()].sort(([a], [b]) => a.localeCompare(b)));
}

/** Kelompokkan per trainingId. */
export async function getSchedulesByTraining(): Promise<Map<string, ScheduleView[]>> {
  const map = new Map<string, ScheduleView[]>();
  for (const item of await getSchedules()) {
    const list = map.get(item.data.trainingId) ?? [];
    list.push(item);
    map.set(item.data.trainingId, list);
  }
  return map;
}

/** Lookup detail berdasarkan bulan + slug (dasar getStaticPaths route detail). */
export async function getScheduleBySlug(
  month: string,
  slug: string,
): Promise<ScheduleView | undefined> {
  return (await getSchedules()).find((s) => s.month === month && s.data.slug === slug);
}

/** Schedule yang belum selesai (scheduled/ongoing), opsional filter jenjang. */
export async function getActiveSchedules(key?: ClassKey): Promise<ScheduleView[]> {
  return (await getSchedules()).filter(
    (s) => (s.phase === 'scheduled' || s.phase === 'ongoing') && (key === undefined || s.classKey === key),
  );
}

/**
 * Nilai <lastmod> untuk satu scope: maksimum updatedDate dari schedule yang
 * tampil. Tanggal pelaksanaan tidak pernah dipakai sebagai lastmod.
 */
export function getSitemapLastmod(items: ScheduleView[]): Date | undefined {
  return items.reduce<Date | undefined>(
    (max, item) => (!max || item.data.updatedDate > max ? item.data.updatedDate : max),
    undefined,
  );
}

export interface VenueView {
  name: string;
  address?: string;
  city?: string;
  province?: string;
  countryCode?: string;
}

/**
 * Venue yang dipakai halaman detail dan JSON-LD `Event`.
 * `venue` di frontmatter selalu menang; bila kosong, dipakai alamat
 * penyelenggara dari `site.ts` (`defaultVenue`) supaya Event punya `location`.
 */
export function resolveVenue(
  venue?: ScheduleEntry['data']['venue'],
): VenueView {
  return venue?.name ? venue : defaultVenue;
}

/** Alamat venue sebagai satu baris: "Jl. … , Jakarta Barat, DKI Jakarta". */
export function venueAddressText(venue: VenueView): string {
  return [venue.address, venue.city, venue.province].filter(Boolean).join(', ');
}

/** Nama bulan Indonesia panjang. */
export const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
] as const;

/** "2026-11" -> "November 2026". */
export function monthLabel(month: string): string {
  const [y, m] = month.split('-');
  return `${MONTH_NAMES[Number(m) - 1]} ${y}`;
}

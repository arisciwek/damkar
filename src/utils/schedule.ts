/**
 * Sumber jadwal gelombang — membaca collection `schedule`
 * (src/content/schedule/*.md, 57 gelombang; Tahap 4 keputusan #14).
 *
 * Dipindah utuh dari src/config/jadwal.ts (kini retired): logika status,
 * pengurutan, dan bentuk `Batch` identik supaya output tidak berubah.
 * Status gelombang (Selesai / Sedang berlangsung / Mulai N hari lagi /
 * Pendaftaran dibuka) dihitung dari tanggal build supaya konsisten.
 *
 * Perbedaan: seluruh fungsi data kini async (sumber = content collection).
 * Konstanta murni (MONTHS/MON) dan `monthLabel` tetap sync.
 */
import { getCollection } from 'astro:content';
import { site } from '../config/site';

export type KelasKey = 'D' | 'C' | 'B' | 'A';

export interface Gelombang {
  class: KelasKey;
  /** Nomor gelombang, mis. "01". */
  batch: string;
  /** Tanggal mulai (YYYY-MM-DD). */
  start: string;
  /** Tanggal selesai (YYYY-MM-DD). */
  end: string;
  /** Label tampilan, mis. "19–21 Januari 2026". */
  label: string;
}

export type StatusKey = 'open' | 'soon' | 'ongoing' | 'done';

export interface Batch extends Gelombang {
  st: Date;
  en: Date;
  status: StatusKey;
  statusText: string;
  /** "YYYY-MM" - kunci pengelompokan bulan. */
  month: string;
}

const ORDER: KelasKey[] = ['D', 'C', 'B', 'A'];

/** "Hari ini" = tanggal build (tengah malam lokal) supaya status tidak berubah di tengah build. */
const now = new Date();
const TODAY = new Date(now.getFullYear(), now.getMonth(), now.getDate());

/** YYYY-MM-DD -> Date lokal (bukan UTC) supaya zona waktu server tidak menggeser tanggal. */
function dateOf(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/** Logika yang sama dengan status_of() di referensi/_tools/build.py. */
function statusOf(start: Date, end: Date): [StatusKey, string] {
  if (end < TODAY) return ['done', 'Selesai'];
  if (start <= TODAY) return ['ongoing', 'Sedang berlangsung'];
  const days = Math.round((start.getTime() - TODAY.getTime()) / 86_400_000);
  if (days <= site.soonDays) {
    return ['soon', days === 1 ? 'Mulai besok' : `Mulai ${days} hari lagi`];
  }
  return ['open', 'Pendaftaran dibuka'];
}

let cache: Batch[] | null = null;

/** Semua gelombang, diurutkan menurut tanggal lalu jenjang (D, C, B, A). */
export async function getBatches(): Promise<Batch[]> {
  if (cache) return cache;
  const entries = await getCollection('schedule', (entry) => !entry.data.draft);
  cache = entries
    .map((entry) => {
      const g = entry.data;
      const st = dateOf(g.start);
      const en = dateOf(g.end);
      const [status, statusText] = statusOf(st, en);
      return {
        class: g.class,
        batch: g.batch,
        start: g.start,
        end: g.end,
        label: g.label,
        st,
        en,
        status,
        statusText,
        month: g.start.slice(0, 7),
      } satisfies Batch;
    })
    .sort(
      (a, b) =>
        a.st.getTime() - b.st.getTime() || ORDER.indexOf(a.class) - ORDER.indexOf(b.class),
    );
  return cache;
}

/** Gelombang pendaftarannya masih terbuka (belum dimulai). */
export async function upcoming(key?: KelasKey | string): Promise<Batch[]> {
  const all = await getBatches();
  return all.filter(
    (b) =>
      (b.status === 'open' || b.status === 'soon') && (key === undefined || b.class === key),
  );
}

/** Gelombang yang belum selesai (termasuk yang sedang berlangsung). */
export async function active(key?: KelasKey | string): Promise<Batch[]> {
  const all = await getBatches();
  return all.filter((b) => b.status !== 'done' && (key === undefined || b.class === key));
}

/** Label gelombang berikutnya untuk satu jenjang (untuk kartu program & hero). */
export async function nextLabel(key?: KelasKey | string): Promise<string> {
  return (await upcoming(key))[0]?.label ?? 'Hubungi kami';
}

/** Jumlah gelombang untuk satu jenjang (atau semua). */
export async function countBatches(key?: KelasKey | string): Promise<number> {
  const all = await getBatches();
  return all.filter((b) => key === undefined || b.class === key).length;
}

/** Nama bulan panjang (Januari..Desember) — sama dengan MONTHS di build.py. */
export const MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
] as const;

/** Inisial bulan pendek (Jan..Des) — sama dengan MON di build.py. */
export const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'] as const;

/** "2026-06" -> "Juni 2026". */
export function monthLabel(key: string): string {
  const [y, m] = key.split('-');
  return `${MONTHS[Number(m) - 1]} ${y}`;
}

/** Gelombang yang cocok dengan filter (kelas dan/atau bulan), urut tanggal. */
export async function batchesIn(kelas?: KelasKey, bulan?: string): Promise<Batch[]> {
  const all = await getBatches();
  return all.filter(
    (b) => (kelas === undefined || b.class === kelas) && (bulan === undefined || b.month === bulan),
  );
}

/** Kunci bulan unik (YYYY-MM) urut naik untuk satu jenjang — dasar halaman bulan. */
export async function monthsIn(kelas?: KelasKey): Promise<string[]> {
  const list = await batchesIn(kelas);
  return [...new Set(list.map((b) => b.month))].sort();
}

/** Jumlah gelombang dalam konteks; activeOnly = hitung yang belum selesai. */
export async function countIn(options: {
  kelas?: KelasKey;
  bulan?: string;
  activeOnly?: boolean;
}): Promise<number> {
  const list = await batchesIn(options.kelas, options.bulan);
  return list.filter((b) => !options.activeOnly || b.status !== 'done').length;
}

/**
 * Jadwal Public Training 2026 — satu-satunya sumber jadwal di situs ini.
 * Data dipindah dari referensi/data/site.json (`schedule`, 57 gelombang).
 * Status gelombang (Selesai / Sedang berlangsung / Mulai N hari lagi / Pendaftaran
 * dibuka) dihitung dari tanggal build supaya konsisten di semua halaman.
 */
import { site } from './site';

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

const RAW: Gelombang[] = [
  { class: 'D', batch: '01', start: '2026-01-19', end: '2026-01-21', label: '19–21 Januari 2026' },
  { class: 'D', batch: '02', start: '2026-02-02', end: '2026-02-04', label: '2–4 Februari 2026' },
  { class: 'D', batch: '03', start: '2026-02-16', end: '2026-02-19', label: '16, 18 & 19 Februari 2026' },
  { class: 'D', batch: '04', start: '2026-03-02', end: '2026-03-04', label: '2–4 Maret 2026' },
  { class: 'D', batch: '05', start: '2026-03-30', end: '2026-04-01', label: '30–31 Maret & 1 April 2026' },
  { class: 'D', batch: '06', start: '2026-04-13', end: '2026-04-15', label: '13–15 April 2026' },
  { class: 'D', batch: '07', start: '2026-04-27', end: '2026-04-29', label: '27–29 April 2026' },
  { class: 'D', batch: '08', start: '2026-05-11', end: '2026-05-13', label: '11–13 Mei 2026' },
  { class: 'D', batch: '09', start: '2026-05-25', end: '2026-05-28', label: '25, 26 & 28 Mei 2026' },
  { class: 'D', batch: '10', start: '2026-06-08', end: '2026-06-10', label: '8–10 Juni 2026' },
  { class: 'D', batch: '11', start: '2026-06-22', end: '2026-06-24', label: '22–24 Juni 2026' },
  { class: 'D', batch: '12', start: '2026-07-06', end: '2026-07-08', label: '6–8 Juli 2026' },
  { class: 'D', batch: '13', start: '2026-07-20', end: '2026-07-22', label: '20–22 Juli 2026' },
  { class: 'D', batch: '14', start: '2026-08-03', end: '2026-08-05', label: '3–5 Agustus 2026' },
  { class: 'D', batch: '15', start: '2026-08-17', end: '2026-08-19', label: '17–19 Agustus 2026' },
  { class: 'D', batch: '16', start: '2026-09-07', end: '2026-09-09', label: '7–9 September 2026' },
  { class: 'D', batch: '17', start: '2026-09-21', end: '2026-09-23', label: '21–23 September 2026' },
  { class: 'D', batch: '18', start: '2026-10-05', end: '2026-10-07', label: '5–7 Oktober 2026' },
  { class: 'D', batch: '19', start: '2026-10-19', end: '2026-10-21', label: '19–21 Oktober 2026' },
  { class: 'D', batch: '20', start: '2026-11-02', end: '2026-11-04', label: '2–4 November 2026' },
  { class: 'D', batch: '21', start: '2026-11-17', end: '2026-11-19', label: '17–19 November 2026' },
  { class: 'D', batch: '22', start: '2026-11-30', end: '2026-12-02', label: '30 November–2 Desember 2026' },
  { class: 'D', batch: '23', start: '2026-12-14', end: '2026-12-16', label: '14–16 Desember 2026' },
  { class: 'C', batch: '01', start: '2026-02-04', end: '2026-02-19', label: '4–19 Februari 2026' },
  { class: 'C', batch: '02', start: '2026-03-04', end: '2026-03-10', label: '4–10 Maret 2026' },
  { class: 'C', batch: '03', start: '2026-04-15', end: '2026-04-21', label: '15–21 April 2026' },
  { class: 'C', batch: '04', start: '2026-05-13', end: '2026-05-20', label: '13–20 Mei 2026' },
  { class: 'C', batch: '05', start: '2026-06-10', end: '2026-06-17', label: '10–17 Juni 2026' },
  { class: 'C', batch: '06', start: '2026-07-08', end: '2026-07-14', label: '8–14 Juli 2026' },
  { class: 'C', batch: '07', start: '2026-08-05', end: '2026-08-11', label: '5–11 Agustus 2026' },
  { class: 'C', batch: '08', start: '2026-09-09', end: '2026-09-15', label: '9–15 September 2026' },
  { class: 'C', batch: '09', start: '2026-10-07', end: '2026-10-13', label: '7–13 Oktober 2026' },
  { class: 'C', batch: '10', start: '2026-11-04', end: '2026-11-10', label: '4–10 November 2026' },
  { class: 'C', batch: '11', start: '2026-12-02', end: '2026-12-08', label: '2–8 Desember 2026' },
  { class: 'B', batch: '01', start: '2026-02-10', end: '2026-02-16', label: '10–16 Februari 2026' },
  { class: 'B', batch: '02', start: '2026-03-10', end: '2026-03-16', label: '10–16 Maret 2026' },
  { class: 'B', batch: '03', start: '2026-04-21', end: '2026-04-27', label: '21–27 April 2026' },
  { class: 'B', batch: '04', start: '2026-05-20', end: '2026-05-26', label: '20–26 Mei 2026' },
  { class: 'B', batch: '05', start: '2026-06-17', end: '2026-06-23', label: '17–23 Juni 2026' },
  { class: 'B', batch: '06', start: '2026-07-14', end: '2026-07-20', label: '14–20 Juli 2026' },
  { class: 'B', batch: '07', start: '2026-08-11', end: '2026-08-18', label: '11–18 Agustus 2026' },
  { class: 'B', batch: '08', start: '2026-09-15', end: '2026-09-21', label: '15–21 September 2026' },
  { class: 'B', batch: '09', start: '2026-10-13', end: '2026-10-19', label: '13–19 Oktober 2026' },
  { class: 'B', batch: '10', start: '2026-11-23', end: '2026-11-27', label: '23–27 November 2026' },
  { class: 'B', batch: '11', start: '2026-12-08', end: '2026-12-14', label: '8–14 Desember 2026' },
  { class: 'A', batch: '01', start: '2026-01-20', end: '2026-01-27', label: '20–27 Januari 2026' },
  { class: 'A', batch: '02', start: '2026-02-16', end: '2026-02-24', label: '16–24 Februari 2026' },
  { class: 'A', batch: '03', start: '2026-03-16', end: '2026-03-26', label: '16–26 Maret 2026' },
  { class: 'A', batch: '04', start: '2026-04-27', end: '2026-05-05', label: '27 April–5 Mei 2026' },
  { class: 'A', batch: '05', start: '2026-05-26', end: '2026-06-04', label: '26 Mei–4 Juni 2026' },
  { class: 'A', batch: '06', start: '2026-06-23', end: '2026-06-30', label: '23–30 Juni 2026' },
  { class: 'A', batch: '07', start: '2026-07-20', end: '2026-07-27', label: '20–27 Juli 2026' },
  { class: 'A', batch: '08', start: '2026-08-18', end: '2026-08-26', label: '18–26 Agustus 2026' },
  { class: 'A', batch: '09', start: '2026-09-21', end: '2026-09-28', label: '21–28 September 2026' },
  { class: 'A', batch: '10', start: '2026-10-19', end: '2026-10-26', label: '19–26 Oktober 2026' },
  { class: 'A', batch: '11', start: '2026-11-16', end: '2026-11-23', label: '16–23 November 2026' },
  { class: 'A', batch: '12', start: '2026-12-14', end: '2026-12-21', label: '14–21 Desember 2026' },
];

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

/** Semua gelombang, diurutkan menurut tanggal lalu jenjang (D, C, B, A). */
export const batches: Batch[] = RAW.map((g) => {
  const st = dateOf(g.start);
  const en = dateOf(g.end);
  const [status, statusText] = statusOf(st, en);
  return { ...g, st, en, status, statusText, month: g.start.slice(0, 7) };
}).sort(
  (a, b) =>
    a.st.getTime() - b.st.getTime() || ORDER.indexOf(a.class) - ORDER.indexOf(b.class),
);

/** Gelombang pendaftarannya masih terbuka (belum dimulai). */
export function upcoming(key?: KelasKey | string): Batch[] {
  return batches.filter(
    (b) =>
      (b.status === 'open' || b.status === 'soon') && (key === undefined || b.class === key),
  );
}

/** Gelombang yang belum selesai (termasuk yang sedang berlangsung). */
export function active(key?: KelasKey | string): Batch[] {
  return batches.filter((b) => b.status !== 'done' && (key === undefined || b.class === key));
}

/** Label gelombang berikutnya untuk satu jenjang (untuk kartu program & hero). */
export function nextLabel(key?: KelasKey | string): string {
  return upcoming(key)[0]?.label ?? 'Hubungi kami';
}

/** Jumlah gelombang untuk satu jenjang (atau semua). */
export function countBatches(key?: KelasKey | string): number {
  return batches.filter((b) => key === undefined || b.class === key).length;
}

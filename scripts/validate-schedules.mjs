/**
 * Validator kontrak schedule bersama — docs/SCHEDULE-ARCHITECTURE-PLAN.md §11.
 *
 * Dijalankan oleh `npm run check`. Memeriksa hal yang tidak bisa ditangani
 * Zod per-entri:
 *
 *   1. trainingId unik di collection trainings.
 *   2. scheduleId unik global.
 *   3. slug unik di dalam bulan startDate (arsip bulanan menggabungkan semua kelas).
 *   4. trainingId setiap schedule menunjuk ke training yang dikenal.
 *   5. Struktur path cocok: schedules/<YYYY>/<trainingId>/<slug>.md.
 *   6. pubDate/updatedDate ISO UTC ketat; updatedDate >= pubDate.
 *   7. endDate >= startDate.
 *   8. dateLabel konsisten dengan startDate/endDate: tanggal pertama yang
 *      disebut = startDate, tanggal terakhir = endDate. Label boleh memuat
 *      hari terpisah (mis. "16, 18 & 19 Februari 2026") karena rentang
 *      pelaksanaan tidak selalu berurutan, tetapi kedua ujungnya wajib sama.
 *
 * Gagal di sini = build gagal.
 */
import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import YAML from 'yaml';

const ROOT = process.cwd();
const TRAININGS = join(ROOT, 'src/content/trainings');
const SCHEDULES = join(ROOT, 'src/content/schedules');
const UTC = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}(:\d{2})?(Z|[+-]\d{2}:\d{2}))?$/;
const MONTHS = {
  januari: 1,
  februari: 2,
  maret: 3,
  april: 4,
  mei: 5,
  juni: 6,
  juli: 7,
  agustus: 8,
  september: 9,
  oktober: 10,
  november: 11,
  desember: 12,
};

const problems = [];
const fail = (msg) => problems.push(msg);

async function walk(dir) {
  let out = [];
  let entries = [];
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out = out.concat(await walk(p));
    else if (e.name.endsWith('.md')) out.push(p);
  }
  return out;
}

function frontmatter(path, text) {
  const m = text.match(/^---\n([\s\S]*?)\n---\s*$/);
  if (!m) {
    fail(`${rel(path)}: frontmatter tidak lengkap (butuh tepat satu pembuka & penutup ---)`);
    return null;
  }
  try {
    return YAML.parse(m[1]);
  } catch (err) {
    fail(`${rel(path)}: YAML tidak valid — ${err.message}`);
    return null;
  }
}

const rel = (p) => relative(ROOT, p);

/**
 * Urai `dateLabel` Indonesia menjadi tanggal pertama & terakhir.
 * Contoh: "30–31 Maret & 1 April 2026" → 2026-03-30 … 2026-04-01;
 * "16, 18 & 19 Februari 2026" → 2026-02-16 … 2026-02-19.
 *
 * Nama bulan hanya ditulis sekali untuk daftar hari (mis. "25, 26 & 28 Mei"),
 * jadi bulan diisi dari nama bulan terdekat di sebelah kanannya.
 */
function parseDateLabel(label) {
  const year = Number(label.match(/\b(\d{4})\b/)?.[1]);
  if (!year) return null;
  const tokens = [...label.matchAll(/\b(\d{1,2})\b(?:\s+([A-Za-z]+))?/g)].map((m) => ({
    day: Number(m[1]),
    month: m[2] ? (MONTHS[m[2].toLowerCase()] ?? null) : null,
  }));
  if (tokens.length === 0) return null;
  let nextMonth = null;
  for (let i = tokens.length - 1; i >= 0; i -= 1) {
    if (tokens[i].month) nextMonth = tokens[i].month;
    else if (nextMonth) tokens[i].month = nextMonth;
    else return null;
  }
  const iso = (t) => `${year}-${String(t.month).padStart(2, '0')}-${String(t.day).padStart(2, '0')}`;
  return { first: iso(tokens[0]), last: iso(tokens.at(-1)) };
}

/** Ambil YYYY-MM-DD dari string ISO atau Date hasil parse YAML. */
const isoDay = (value) =>
  value instanceof Date ? value.toISOString().slice(0, 10) : String(value).slice(0, 10);

// --- 1. Trainings ---
const trainingIds = new Set();
for (const path of await walk(TRAININGS)) {
  const d = frontmatter(path, await readFile(path, 'utf8'));
  if (!d) continue;
  if (!d.trainingId) fail(`${rel(path)}: trainingId hilang`);
  else if (trainingIds.has(d.trainingId)) fail(`${rel(path)}: trainingId "${d.trainingId}" duplikat`);
  else trainingIds.add(d.trainingId);
}
if (trainingIds.size === 0) fail('src/content/trainings: tidak ada training terbaca');

// --- 2-7. Schedules ---
const files = await walk(SCHEDULES);
if (files.length === 0) fail('src/content/schedules: tidak ada schedule terbaca');

const seenScheduleId = new Map();
const seenSlugPerMonth = new Map();

for (const path of files) {
  const d = frontmatter(path, await readFile(path, 'utf8'));
  if (!d) continue;
  const at = rel(path);

  // scheduleId unik
  if (!d.scheduleId) fail(`${at}: scheduleId hilang`);
  else if (!/^damkar_[0-9A-HJKMNP-TV-Z]{26}$/.test(d.scheduleId)) {
    fail(`${at}: scheduleId harus "damkar_" + ULID 26 karakter`);
  }
  if (d.scheduleId) {
    if (seenScheduleId.has(d.scheduleId)) {
      fail(`${at}: scheduleId "${d.scheduleId}" duplikat dengan ${seenScheduleId.get(d.scheduleId)}`);
    } else seenScheduleId.set(d.scheduleId, at);
  }

  // trainingId dikenal
  if (!d.trainingId) fail(`${at}: trainingId hilang`);
  else if (!trainingIds.has(d.trainingId)) {
    fail(`${at}: trainingId "${d.trainingId}" tidak ada di src/content/trainings`);
  }

  // tanggal
  for (const f of ['startDate', 'endDate']) {
    if (!d[f]) fail(`${at}: ${f} hilang`);
    else if (!ISO_DATE.test(String(d[f]))) fail(`${at}: ${f}="${d[f]}" bukan tanggal ISO`);
  }
  if (d.startDate && d.endDate && String(d.endDate) < String(d.startDate)) {
    fail(`${at}: endDate lebih awal daripada startDate`);
  }
  // dateLabel harus menyebut ujung yang sama dengan startDate/endDate.
  if (!d.dateLabel) fail(`${at}: dateLabel hilang`);
  else {
    const parsed = parseDateLabel(String(d.dateLabel));
    if (!parsed) {
      fail(`${at}: dateLabel "${d.dateLabel}" tidak bisa dibaca sebagai tanggal Indonesia`);
    } else {
      if (d.startDate && parsed.first !== isoDay(d.startDate)) {
        fail(`${at}: dateLabel "${d.dateLabel}" mulai ${parsed.first}, bukan startDate ${isoDay(d.startDate)}`);
      }
      if (d.endDate && parsed.last !== isoDay(d.endDate)) {
        fail(`${at}: dateLabel "${d.dateLabel}" berakhir ${parsed.last}, bukan endDate ${isoDay(d.endDate)}`);
      }
    }
  }
  for (const f of ['pubDate', 'updatedDate']) {
    if (!d[f]) fail(`${at}: ${f} hilang`);
    else if (!UTC.test(String(d[f]))) fail(`${at}: ${f}="${d[f]}" bukan YYYY-MM-DDTHH:MM:SSZ`);
  }
  if (d.pubDate && d.updatedDate && String(d.updatedDate) < String(d.pubDate)) {
    fail(`${at}: updatedDate lebih awal daripada pubDate`);
  }

  // slug unik per bulan
  if (d.slug && d.startDate) {
    const month = String(d.startDate).slice(0, 7);
    const key = `${month}/${d.slug}`;
    if (seenSlugPerMonth.has(key)) {
      fail(`${at}: slug "${d.slug}" duplikat di bulan ${month} dengan ${seenSlugPerMonth.get(key)}`);
    } else seenSlugPerMonth.set(key, at);
  }

  // struktur path: schedules/<YYYY>/<trainingId>/<slug>.md
  const parts = rel(path).split(/[\\/]/);
  const iSchedules = parts.indexOf('schedules');
  const dirParts = parts.slice(iSchedules + 1, -1); // [YYYY, trainingId]
  const fileBase = parts.at(-1).replace(/\.md$/, '');
  if (dirParts.length !== 2) {
    fail(`${at}: path harus schedules/<YYYY>/<trainingId>/<slug>.md`);
  } else {
    const [yearDir, trainingDir] = dirParts;
    if (d.startDate && yearDir !== String(d.startDate).slice(0, 4)) {
      fail(`${at}: folder tahun "${yearDir}" tidak cocok dengan startDate ${d.startDate}`);
    }
    if (d.trainingId && trainingDir !== d.trainingId) {
      fail(`${at}: folder training "${trainingDir}" tidak cocok dengan trainingId ${d.trainingId}`);
    }
    if (d.slug && fileBase !== d.slug) {
      fail(`${at}: nama file "${fileBase}.md" tidak cocok dengan slug "${d.slug}"`);
    }
  }
}

if (problems.length) {
  console.error('[validasi-schedules] kontrak schedule bermasalah:');
  for (const p of problems) console.error(`  ✗ ${p}`);
  process.exit(1);
}
console.log(`[validasi-schedules] ok — ${trainingIds.size} training, ${files.length} schedule`);

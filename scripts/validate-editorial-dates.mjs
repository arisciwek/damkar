/**
 * Validator metadata editorial — aturan di AGENTS.md "Kebijakan tanggal".
 *
 * Setiap entri (setiap page, setiap content, artikel, schedule) WAJIB punya `pubDate`
 * dan `updatedDate` dengan format ISO 8601 UTC tanpa milidetik:
 * "2026-11-12T18:30:35Z". Field ini "data entri" yang berujung ke <lastmod>
 * sitemap. Tanggal pelaksanaan jadwal (`start`/`end`) urusan JSON-LD Event —
 * bukan urusan field ini.
 *
 * Dijalankan otomatis oleh `npm run check` (dan `npm run build` lewat check).
 * Gagal di sini = build gagal; jangan diam-diam mengisi tanggal asal-asalan.
 */
import { readdir, readFile } from 'node:fs/promises';

const DIRS = ['src/content/pages', 'src/content/schedule', 'src/content/articles'];
const UTC = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;

const problems = [];
let checked = 0;

for (const dir of DIRS) {
  let names = [];
  try {
    names = (await readdir(dir)).filter((f) => f.endsWith('.md'));
  } catch {
    continue; // koleksi belum dibuat (mis. artikel di Tahap 5) — lewati.
  }
  for (const name of names) {
    const path = `${dir}/${name}`;
    const text = await readFile(path, 'utf8');
    checked++;
    for (const field of ['pubDate', 'updatedDate']) {
      const m = text.match(new RegExp(`^${field}:\\s*["']?([^"'\\s]+)["']?\\s*$`, 'm'));
      if (!m) {
        problems.push(`${path}: ${field} hilang`);
      } else if (!UTC.test(m[1])) {
        problems.push(`${path}: ${field}="${m[1]}" bukan YYYY-MM-DDTHH:MM:SSZ (UTC tanpa milidetik)`);
      }
    }
  }
}

if (problems.length) {
  console.error('[validasi] metadata editorial bermasalah:');
  for (const p of problems) console.error(`  ✗ ${p}`);
  process.exit(1);
}
console.log(`[validasi] pubDate/updatedDate ok — ${checked} entri (${DIRS.join(', ')})`);

/**
 * Rapikan <lastmod> di sitemap hasil @astrojs/sitemap.
 *
 * Integrasi selalu memformat lewat `Date.toISOString()` sehingga menghasilkan
 * "2026-11-12T16:18:34.000Z" (milidetik selalu 000). Kita pakai format UTC
 * tanpa milidetik: "2026-11-12T16:18:34Z" — ISO-8601 valid, diterima Google.
 *
 * Dijalankan otomatis sebagai langkah terakhir `npm run build`.
 */
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const DIST = new URL('../dist/', import.meta.url);
const files = (await readdir(DIST)).filter((f) => /^sitemap.*\.xml$/.test(f));

let changed = 0;
for (const file of files) {
  const path = join(DIST.pathname, file);
  const before = await readFile(path, 'utf8');
  // Hanya di dalam <lastmod>; buang bagian milidetik sebelum penanda UTC "Z".
  const after = before.replace(
    /(<lastmod>[^<]+?)\.\d{3}Z(<\/lastmod>)/g,
    '$1Z$2',
  );
  if (after !== before) {
    await writeFile(path, after);
    changed++;
  }
}

console.log(`[sitemap] lastmod dinormalkan (tanpa milidetik) di ${changed}/${files.length} file`);

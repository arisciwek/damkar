import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { execSync } from 'node:child_process';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

// Domain produksi bisa diganti lewat env (SITE_URL) tanpa menyentuh kode.
// Contoh staging: SITE_URL=http://damkar.lan  npm run build
const vercelProductionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;
const siteUrl =
  process.env.SITE_URL ||
  (vercelProductionUrl ? `https://${vercelProductionUrl}` : 'https://pelatihandamkar.web.id');

// ---------------------------------------------------------------------------
// <lastmod> per-URL (Tahap 1, keputusan 13 Nov 2026) — bukan commit HEAD seragam.
//
// Kebijakan (docs/RENCANA-FASE.md "Kebijakan tanggal editorial dan lastmod teknis"):
// - halaman editorial (punya `updatedDate` valid di frontmatter) ← updatedDate;
// - beranda & listing selama belum punya metadata editorial ← commit file sumber;
// - /jadwal/ ← max(updatedDate halaman, updatedDate ?? pubDate seluruh gelombang);
// - Route turunan jadwal (arsip, kelas, detail) ← max(updatedDate template,
//   updatedDate ?? pubDate file schedule penyumbang route); tanggal editorial tetap berlaku
//   meskipun tanggal pelaksanaan sudah lewat;
// - fallback terakhir ← commit HEAD; tanpa git → tanpa lastmod.
// Format: ISO-8601 UTC tanpa milidetik, mis. "2026-11-12T23:30:00Z".
// ---------------------------------------------------------------------------

const toUtc = (iso) => (iso ? new Date(iso).toISOString().replace(/\.\d+Z$/, 'Z') : null);

// Waktu commit terakhir yang menyentuh salah satu file; null bila gagal/tak ada.
const gitLastmodFiles = (files) => {
  try {
    const out = execSync(`git log -1 --format=%cI -- ${files.join(' ')}`, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    return toUtc(out || null);
  } catch {
    return null;
  }
};

// `updatedDate` frontmatter sebuah file md; null bila tak ada/tak valid.
const readUpdatedDate = (file) => {
  try {
    const m = readFileSync(file, 'utf8').match(/^updatedDate:\s*["']?([0-9]{4}-[0-9:-]+T[0-9:]+Z)["']?\s*$/m);
    if (!m) return null;
    const d = new Date(m[1]);
    return Number.isNaN(d.getTime()) ? null : toUtc(m[1]);
  } catch {
    return null;
  }
};

const HEAD_LASTMOD = gitLastmodFiles([]);

// Cache git per kombinasi file (63 route jadwal berbagi banyak file penyumbang).
const gitCache = new Map();
const gitLastmodCached = (files) => {
  const key = files.join('|');
  if (!gitCache.has(key)) gitCache.set(key, gitLastmodFiles(files));
  return gitCache.get(key);
};

// Indeks file schedule baru (rekursif) untuk lastmod per-route.
const scheduleFiles = (() => {
  const root = 'src/content/schedules';
  const markdownFiles = [];
  const walk = (directory) => {
    try {
      for (const entry of readdirSync(directory, { withFileTypes: true })) {
        const path = join(directory, entry.name);
        if (entry.isDirectory()) walk(path);
        else if (entry.isFile() && entry.name.endsWith('.md')) markdownFiles.push(path);
      }
    } catch {
      // Folder tidak tersedia pada checkout/build yang belum memiliki collection baru.
    }
  };

  walk(root);
  return markdownFiles.map((path) => {
    const text = readFileSync(path, 'utf8');
    const trainingId = text.match(/^trainingId:\s*['"]?([^'"]+)['"]?\s*$/m)?.[1];
    const cls = trainingId?.match(/^kelas-([a-d])$/)?.[1]?.toUpperCase() ?? null;
    const start = text.match(/^startDate:\s*['"]?(\d{4}-\d{2}-\d{2})/)?.[1] ?? null;
    const slug = text.match(/^slug:\s*['"]?([^'"]+)['"]?\s*$/m)?.[1] ?? null;
    const updated = text.match(/^updatedDate:\s*['"]?([0-9]{4}-[0-9:-]+T[0-9:]+Z)['"]?\s*$/m)?.[1] ?? null;
    const published = text.match(/^pubDate:\s*['"]?([0-9]{4}-[0-9:-]+T[0-9:]+Z)['"]?\s*$/m)?.[1] ?? null;
    return {
      path,
      cls,
      month: start ? start.slice(0, 7) : null,
      slug,
      last: toUtc(updated ?? published),
    };
  }).filter((entry) => entry.month && entry.slug && entry.last);
})();

const maxDate = (...values) => values.filter(Boolean).sort().at(-1) ?? null;

// Lastmod indeks jadwal mencerminkan template halaman dan seluruh gelombang.
//   /jadwal/2026-01/            → bulan itu (month = start, sama dengan monthsIn)
//   /jadwal/kelas-d/             → seluruh gelombang kelas D
//   /jadwal/kelas-d/2026-01/     → irisan kelas + bulan
const scheduleIndexLastmod = () =>
  maxDate(
    readUpdatedDate('src/content/pages/jadwal.md'),
    ...scheduleFiles.map((entry) => entry.last),
  );

// Lastmod satu route turunan jadwal = tanggal editorial terbaru dari template
// dan file gelombang penyumbangnya.
const scheduleRouteLastmod = (pathname) => {
  const segs = pathname.slice('/jadwal/'.length).split('/').filter(Boolean);
  let kelas = null;
  let bulan = null;
  let slug = null;
  for (const seg of segs) {
    const classMatch = seg.match(/^kelas-([a-d])$/);
    if (classMatch) kelas = classMatch[1].toUpperCase();
    else if (/^\d{4}-\d{2}$/.test(seg)) bulan = seg;
    else slug = seg;
  }

  const dates = scheduleFiles
    .filter((entry) =>
      (!kelas || entry.cls === kelas) &&
      (!bulan || entry.month === bulan) &&
      (!slug || (entry.month === bulan && entry.slug === slug))
    )
    .map((entry) => entry.last);

  return maxDate(readUpdatedDate('src/content/pages/jadwal-detail.md'), ...dates);
};

// Aturan pathname → sumber. `editorial: true` berarti updatedDate didahulukan.
const SOURCES = [
  { match: (p) => p === '/', files: ['src/content/pages/home.md'], editorial: true },
  {
    match: (p) => /^\/artikel\/[^/]+\/$/.test(p),
    files: (p) => [`src/content/articles/${p.split('/')[2]}.md`],
    editorial: true,
  },
  { match: (p) => p === '/layanan/', files: ['src/content/pages/layanan.md'], editorial: true },
  {
    match: (p) => /^\/layanan\/damkar-kelas-[a-d]\/$/.test(p),
    files: (p) => [`src/content/pages/damkar-kelas-${p.match(/damkar-kelas-([a-d])\//)[1]}.md`],
    editorial: true,
  },
  { match: (p) => p === '/jadwal/', lastmod: scheduleIndexLastmod },
  {
    // 62 route turunan: max tanggal editorial template + gelombang penyumbang.
    match: (p) => p.startsWith('/jadwal/'),
    lastmod: scheduleRouteLastmod,
  },
];

const resolveLastmod = (pathname) => {
  const rule = SOURCES.find((r) => r.match(pathname));
  if (!rule) return HEAD_LASTMOD;
  if (rule.lastmod) return rule.lastmod(pathname) ?? HEAD_LASTMOD;
  const files = typeof rule.files === 'function' ? rule.files(pathname) : rule.files;
  if (!files || files.length === 0) return HEAD_LASTMOD;
  const editorial = rule.editorial ? readUpdatedDate(files[0]) : null;
  return editorial ?? gitLastmodCached(files) ?? HEAD_LASTMOD;
};

export default defineConfig({
  site: siteUrl,
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
  integrations: [
    sitemap({
      // 404 tidak boleh diindeks mesin pencari.
      filter: (page) => !page.endsWith('/404.html'),
      // <lastmod> tiap URL dari sumbernya masing-masing (lihat blok komentar di atas).
      serialize: (item) => {
        const lastmod = resolveLastmod(new URL(item.url).pathname);
        return lastmod ? { ...item, lastmod } : item;
      },
    }),
  ],
});

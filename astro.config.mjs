import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

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
// - 63 route turunan jadwal ← commit terakhir file data jadwal yang berkontribusi
//   (data gelombang + template), TANPA memakai tanggal editorial template;
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

// Aturan pathname → sumber. `editorial: true` berarti updatedDate didahulukan.
const SOURCES = [
  { match: (p) => p === '/', files: ['src/content/pages/home.md'], editorial: true },
  { match: (p) => p === '/layanan/', files: ['src/content/pages/layanan.md'], editorial: true },
  {
    match: (p) => /^\/layanan\/damkar-kelas-[a-d]\/$/.test(p),
    files: (p) => [`src/content/pages/damkar-kelas-${p.match(/damkar-kelas-([a-d])\//)[1]}.md`],
    editorial: true,
  },
  { match: (p) => p === '/jadwal/', files: ['src/content/pages/jadwal.md'], editorial: true },
  {
    // Route turunan template: data gelombang + template block (bukan tanggal editorial).
    match: (p) => p.startsWith('/jadwal/'),
    files: ['src/config/jadwal.ts', 'src/content/pages/jadwal-detail.md'],
    editorial: false,
  },
];

const resolveLastmod = (pathname) => {
  const rule = SOURCES.find((r) => r.match(pathname));
  if (!rule) return HEAD_LASTMOD;
  const files = typeof rule.files === 'function' ? rule.files(pathname) : rule.files;
  const editorial = rule.editorial ? readUpdatedDate(files[0]) : null;
  return editorial ?? gitLastmodFiles(files) ?? HEAD_LASTMOD;
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

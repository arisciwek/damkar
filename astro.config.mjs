import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { execSync } from 'node:child_process';

// Domain produksi bisa diganti lewat env (SITE_URL) tanpa menyentuh kode.
// Contoh staging: SITE_URL=http://damkar.lan  npm run build
const vercelProductionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;
const siteUrl =
  process.env.SITE_URL ||
  (vercelProductionUrl ? `https://${vercelProductionUrl}` : 'https://pelatihandamkar.web.id');

// <lastmod> untuk sitemap: waktu commit HEAD terakhir (bukan waktu build), supaya
// tidak ikut berubah tiap rebuild tanpa ada perubahan kode.
// Format ISO-8601 UTC tanpa milidetik, mis. "2026-11-12T23:30:00Z".
const gitLastmod = (() => {
  try {
    const iso = execSync('git log -1 --format=%cI', {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    return iso ? new Date(iso).toISOString().replace(/\.\d+Z$/, 'Z') : null;
  } catch {
    return null; // build di lingkungan tanpa git → tanpa lastmod
  }
})();

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
      // Isi <lastmod> tiap URL dengan waktu commit HEAD (UTC, tanpa milidetik).
      serialize: (item) => (gitLastmod ? { ...item, lastmod: gitLastmod } : item),
    }),
  ],
});
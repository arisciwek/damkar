import { defineConfig } from 'astro/config';

// Domain produksi bisa diganti lewat env (SITE_URL) tanpa menyentuh kode.
// Contoh staging: SITE_URL=http://damkar.lan  npm run build
const vercelProductionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;
const siteUrl =
  process.env.SITE_URL ||
  (vercelProductionUrl ? `https://${vercelProductionUrl}` : 'https://pelatihandamkar.web.id');

export default defineConfig({
  site: siteUrl,
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
});
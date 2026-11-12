# Log Pekerjaan

Catatan kronologis per sesi/fase. Tambah entri baru di **atas** garis "Entri baru".

## 12 Nov 2026 — Keputusan: jadwal tanpa URL per gelombang

- User memilih **ikuti referensi**: 57 gelombang tidak punya URL sendiri.
  Struktur URL jadwal = `/jadwal/` + `#jadwal` per kelas + deep link `?kelas=&bulan=`
  (ditangani `main.js` baris ~300). Tidak ada penambahan 57 halaman/sitemap/JSON-LD Event
  per gelombang. Dicatat sebagai Keputusan #13 di `RENCANA-FASE.md`.

## 12 Nov 2026 — Fase 2 selesai: halaman /layanan + redirect 301

- **Commit**: `495304b` `feat(fase2): halaman /layanan (listing + detail kelas) + redirect 301` (**belum push**).
- Dibuat:
  - `src/config/jadwal.ts` — 57 gelombang + `statusOf/upcoming/active/nextLabel/countBatches`,
    status dihitung saat build.
  - `src/config/blocks.ts` — faq/reasons/benefits/copy dari `site.json`.
  - Komponen `Hero`, `Breadcrumb`, `Nearest`, `MateriList` (show-more), `Sidebar` (scrollspy),
    `BlockHead`, `ReasonsBlock`, `BenefitsBlock`, `FaqBlock`, `ProgramGrid`, `Icon`.
  - `/layanan/` (JSON-LD ItemList+FAQPage+BreadcrumbList) dan `/layanan/[slug]/`
    (JSON-LD Course+CourseInstance+BreadcrumbList, URL `/layanan/...`).
  - `public/.htaccess` (301 lama→baru + kanonis ber-syarat host) + `vercel.json`
    (8 redirect permanen, `trailingSlash: true`).
  - `BaseLayout`: `preloadImage` per halaman, `og:image` dims dari foto terkait.
- **Verifikasi**: `npm run check` + `npm run build` lolos (7 halaman); perbandingan DOM dengan
  referensi identik (title/desc/h1/facts/zigzag/materi/sidebar); tanpa anchor rusak;
  `.htaccess` IfModule seimbang, `dist/.htaccess` ikut ter-copy.
- **Perbedaan yang disengaja**: section `#jadwal` belum ada (Fase 3); nav header memakai halaman
  baru, bukan anchor lama.
- **Catatan data**: HTML referensi lebih lama dari `site.json` (gelombang D 16→17 Nov, B 10→23 Nov
  sudah digeser di data) → "Jadwal terdekat" kelas B kini 2 baris — **bukan bug**.
- **Catatan alat**: screenshot via tool `read` sempat tidak konsisten/stale — verifikasi visual
  andal lewat Chrome `--dump-dom` + pemotongan PNG `sharp`.

## 12 Nov 2026 — Fix: site.url ikut env SITE_URL

- **Commit**: `ae2cd64`.
- `astro.config.mjs`: `site` = `SITE_URL` env → `VERCEL_PROJECT_PRODUCTION_URL` → default domain produksi.
- Diuji: `SITE_URL=http://pelatihan-damkar.lan npm run build` → canonical + `@id` JSON-LD ikut berubah.

## 12 Nov 2026 — Fase 0–1 selesai: fondasi Astro

- **Commit**: `ec5c12f` `feat(fase1): fondasi Astro — scaffold, style referensi, layout, header/footer`.
- Scaffold: Astro 7.4, TS strict, Node 22, `.npmrc` allowScripts; `src/styles/global.css`
  (style referensi, hanya path font berubah); font Poppins lokal; `src/config/site.ts` + `ui.ts`;
  collection `kelas` (4 MD); `src/utils/schema.ts`; `BaseLayout.astro`; komponen shared
  (SiteHeader/SiteFooter/ContactBand/WaFloat); foto diunduh→WebP/JPG via `scripts/import-images.mjs`;
  pratinjau `/` + `404`.
- Build & render Chrome headless identik dengan referensi.

## Sebelumnya

- `1773c96` update .gitignore (referensi/ & /images/ masuk ignore).
- `2ced962` Initial commit.

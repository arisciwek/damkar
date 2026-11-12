# Rencana & Status Fase

> Dokumen hidup. **Update setiap satu fase selesai** (status, commit, catatan).
> Terakhir diperbarui: **12 Nov 2026 — Fase 2 selesai**.

## Ikhtisar

Migrasi situs statis `referensi/` (pelatihandamkar.web.id) ke project Astro baru
di `/www/wwwroot/damkar`.

- **Konsep/architecture** mengikuti `/www/wwwroot/confinedspace/`: content collections,
  config terpusat, validasi saat build (`astro check` + Zod schema).
- **Visual/style** memakai `referensi/assets/css/style.css` apa adanya — hasil render
  identik dengan referensi. Tanpa Tailwind, tanpa MDX.
- **Data hybrid**: 4 kelas → content collection MD; org/faq/benefits/reasons → `src/config/`;
  57 gelombang jadwal → 1 file data terpusat (`src/config/jadwal.ts`).
- **JSON-LD dirender saat build** (bukan runtime JS); foto lokal di `public/images/` (bukan hotlink).
- **Hosting**: Vercel nanti; domain custom `.lan` sedang disiapkan user → build/preview lokal,
  `SITE_URL` via env.
- **Bahasa**: Indonesia untuk komunikasi & teks UI.

## Status fase

| Fase | Isi | Status | Commit |
| --- | --- | --- | --- |
| 0 | Scaffold project (Astro, TS, config) | ✅ Selesai | `ec5c12f`* (digabung dgn Fase 1) |
| 1 | Fondasi: style referensi, layout, header/footer, config, collection kelas | ✅ Selesai | `ec5c12f` |
| 1-fix | `site.url` ikut env `SITE_URL` | ✅ Selesai | `ae2cd64` |
| 2 | Halaman `/layanan/` (listing + detail 4 kelas) + redirect 301 | ✅ Selesai | `495304b` (belum push) |
| 3 | Jadwal: komponen Scheduler + halaman `/jadwal/` + section `#jadwal` di halaman kelas | ⬜ **Berikutnya** | — |
| 4 | Beranda lengkap (port `page_home()` dari `build.py`) | ⬜ Belum | — |
| 5 | Artikel (collection + halaman) + `/kontak/` | ⬜ Belum | — |
| 6 | SEO: sitemap, robots, JSON-LD final, 404 final, AGENTS.md | ⬜ Belum | — |
| 7 | Verifikasi menyeluruh + staging `.lan` | ⬜ Belum | — |

\* Fase 0 (scaffold) dikerjakan bersamaan dengan Fase 1 dalam satu commit.

---

## Rincian tiap fase

### Fase 0–1 — Fondasi ✅ (commit `ec5c12f`, fix `ae2cd64`)

- Scaffold: Astro 7.4, TypeScript strict, Node 22 (`.nvmrc` = 22.23.4), `.npmrc` allowScripts
  (esbuild, sharp), `astro.config.mjs` dengan `site` dari env `SITE_URL` → fallback
  `VERCEL_PROJECT_PRODUCTION_URL` → `https://pelatihandamkar.web.id`.
- `src/styles/global.css`: style referensi diadopsi **apa adanya**, hanya path font berubah
  (font Poppins lokal di `public/fonts/`, lisensi OFL).
- `src/config/site.ts` (identitas, WA, foto, `year: 2026`, `soonDays: 14`) & `src/config/ui.ts`
  (teks UI, nav, meta) — dipindah dari `referensi/data/site.json`.
- Collection `kelas` (4 file MD) + Zod schema di `src/content.config.ts`.
- `src/utils/schema.ts`: builder JSON-LD (port `referensi/assets/js/schema.js`) —
  EducationalOrganization + WebSite di semua halaman, WebPage/Breadcrumb per halaman.
- Komponen shared: `SiteHeader` (mega menu Program ▾ 4 kelas, nav Layanan/Jadwal/Artikel/Kontak,
  tombol Daftar Sekarang), `SiteFooter`, `ContactBand`, `WaFloat`.
- 4 foto + logo diunduh → WebP/JPG via `scripts/import-images.mjs` → `public/images/`
  (mentah di `/images/` di-gitignore).
- Halaman pratinjau `/` dan `404`.

**Fix**: `site.url` ikut `import.meta.env.SITE` supaya canonical + `@id` JSON-LD selalu sama
dengan URL build. Diuji: `SITE_URL=http://pelatihan-damkar.lan npm run build` → canonical ikut berubah.

### Fase 2 — Halaman Layanan ✅ (commit `495304b`, belum push)

- `src/config/jadwal.ts`: **57 gelombang** terpusat + helper `statusOf/upcoming/active/
  nextLabel/countBatches` — status gelombang **dihitung saat build** (tanggal build = tengah
  malam lokal), bukan client-side harian.
- `src/config/blocks.ts`: faq(4), reasons(3), benefits(4), copy blok — dari `site.json`.
- Komponen content: `Hero`, `Breadcrumb`, `Nearest` (jadwal terdekat), `MateriList`
  (script show-more), `Sidebar` (script scrollspy), `BlockHead`, `ReasonsBlock`,
  `BenefitsBlock`, `FaqBlock`, `ProgramGrid`, `ui/Icon.astro` + `utils/icons.ts`.
- `/layanan/`: hero + nearest + 4 kartu program + benefits + FAQ;
  JSON-LD ItemList + FAQPage + BreadcrumbList.
- `/layanan/[slug]/`: hero + breadcrumb + zigzag (peran/materi/persyaratan) + FAQ + Jenjang;
  JSON-LD Course + CourseInstance + BreadcrumbList (URL baru `/layanan/...`).
- **Redirect 301**: `public/.htaccess` (untuk Apache/hosting lama) + `vercel.json`
  (8 entri: `/damkar-kelas-{d,c,b,a}/` → `/layanan/...`, `trailingSlash: true`).
  Kanonis https/www di `.htaccess` **hanya** untuk host `pelatihandamkar.web.id`
  supaya staging `.lan` tetap jalan.
- `BaseLayout`: `preloadImage` per halaman, `og:image` dims dari foto terkait.

**Verifikasi**: `npm run check` + `npm run build` lolos (7 halaman); perbandingan DOM dengan
referensi identik (title/desc/h1/facts/zigzag/materi/sidebar); tanpa anchor rusak;
`.htaccess` IfModule seimbang, ikut ter-copy ke `dist/`.

### Fase 3 — Jadwal ⬜ BERIKUTNYA

Data sudah siap (`src/config/jadwal.ts`). Yang dikerjakan:

1. **Komponen `Scheduler`** — port perilaku dari `referensi/assets/js/main.js` (baris 147–326):
   - chips filter kelas (Semua / D / C / B / A), pilih bulan (strip `.months` + count per bulan),
     toggle "Tampilkan jadwal yang sudah lewat", summary live (`aria-live`), empty state.
   - kartu gelombang: badge status, tanggal, kelas, tombol **WA daftar** + **GCal**
     (`gcalLink` baris 156), status `open/soon/ongoing/done`.
   - deep link: `?kelas=D&bulan=2026-12` atau `#jadwal-d` → auto scroll.
   - **Beda dengan referensi**: status sudah dihitung saat build (`jadwal.ts`), jadi script
     klien hanya untuk filter/toggle — tidak perlu `fetch(site.json)` (data build-time).
2. **Halaman `/jadwal/`** — nav & footer sudah menautkan ke sini (sekarang masih 404).
3. **Section `#jadwal` di tiap halaman kelas** (`/layanan/[slug]/`) + tambah link sidebar
   **"Jadwal & Persyaratan"** → jadi **6 anchor** seperti referensi
   (urutan referensi `build.py` baris 590: manfaat, detail, fasilitas, **jadwal**, faq, jenjang).
   Sekarang baru 5 (manfaat, detail, fasilitas, faq, jenjang).
4. Judul section: `Jadwal {nama kelas} 2026` + sub `{n} gelombang ... {m} di antaranya masih
   aktif atau akan datang` (dari `build.py` `page_class()` baris 611–614).

### Fase 4 — Beranda ⬜

Port `page_home()` (`referensi/_tools/build.py` baris 448–551):

- Hero slider 2 foto (`#heroSlider`, auto-slide 6500ms, `prefers-reduced-motion`), hero-facts
  (4 jenjang / 57 gelombang / Kemnaker), `nearest(null, 3)`.
- Sidebar 7 anchor: manfaat, program, detail, fasilitas, pengalaman, jadwal, faq.
- Section: `#manfaat` (reasons) → `#program` (4 kartu `prog-card`) → `#detail`
  (tabs kelas A–D + tabpanel materi) → benefits → `#pengalaman` (gallery) → `#jadwal`
  (Scheduler semua kelas) → `#faq` → contact band.
- Nav header referensi memakai anchor `/#jadwal`, `/#detail`, `/#faq` — **keputusan**: nav
  memakai halaman (`/jadwal/`, `/layanan/`, dst.) sesuai Fase 2; anchor lama di-redirect/None.
- `src/pages/index.astro` sekarang masih pratinjau (hero + ContactBand) → diganti total.

### Fase 5 — Artikel + Kontak ⬜

- Collection `artikel` (**sistem dulu**: schema + halaman list `/artikel/` + detail
  `/artikel/[slug]/`; konten menyusul).
- `/kontak/`: data dari `src/config/site.ts` (alamat, WA, email, jam) + ContactBand sudah ada.

### Fase 6 — SEO & pelengkap ⬜

- `sitemap.xml` (port `build.py sitemap()` baris 648 — pakai foto lokal, bukan hotlink
  pusattrainingk3.com) + `robots.txt` (konstanta `ROBOTS` baris 660) — buat via
  endpoint/integration Astro.
- JSON-LD final per halaman (artikel, kontak, home lengkap).
- `404.astro` final (sudah ada, cocokkan dengan `page_404()` baris 631).
- `AGENTS.md` di root (panduan konvensi project, mengikuti confinedspace).

### Fase 7 — Verifikasi & staging ⬜

- `npm run check` + `npm run build` bersih; bandingkan semua halaman dengan referensi
  (Chrome headless `--dump-dom` + screenshot PNG dipotong `sharp`).
- Build staging: `SITE_URL=http://<domain>.lan npm run build` → cek canonical/JSON-LD/sitemap ikut.
- Uji redirect: `/damkar-kelas-d/` → `/layanan/damkar-kelas-d/` (htaccess + vercel.json).
- Push ke `origin` (github.com/arisciwek/damkar); deploy Vercel saat domain siap.

---

## Keputusan arsitektur (jangan diubah tanpa catat)

1. **URL pindah** `/damkar-kelas-x/` → `/layanan/damkar-kelas-x/` — 301 di
   `public/.htaccess` **dan** `vercel.json`.
2. **Gaya**: `style.css` referensi apa adanya — tanpa Tailwind, tanpa MDX, tanpa komponen UI kit.
3. **Data hybrid**: kelas → MD collection; org/faq/benefits/reasons → `src/config/`;
   jadwal → `src/config/jadwal.ts` (satu-satunya sumber jadwal).
4. **JSON-LD build-time** via `src/utils/schema.ts`, bukan runtime JS.
5. **Foto lokal** `public/images/` — tidak hotlink ke pusattrainingk3.com.
6. **`site.url` ikut env `SITE_URL`** (`astro.config.mjs`) — canonical, OG, JSON-LD, sitemap
   otomatis sama.
7. **Status jadwal dihitung saat build** (tanggal build = tengah malam lokal), bukan
   client-side harian. Konsekuensi: rebuild harian/manual agar status selalu segar.
8. **`.htaccess` kanonis https/www hanya untuk host `pelatihandamkar.web.id`**
   (pakai `If`) agar staging `.lan` tidak redirect.
9. **Header nav**: Program ▾ (mega menu 4 kelas) · Layanan · Jadwal · Artikel · Kontak +
   tombol `Daftar Sekarang` — halaman, bukan anchor seperti referensi.
10. **Breadcrumb kelas**: "Program" → `/layanan/` (bukan `/#program`); JSON-LD BreadcrumbList
    2 item (Beranda + nama kelas) persis referensi.
11. **Collection `artikel`**: sistem dulu, konten menyusul; `/kontak` fase pertama.
12. **`trailingSlash: 'always'`** + `build.format: 'directory'`.

## Peta file penting

| File | Peran |
| --- | --- |
| `referensi/_tools/build.py` | **Sumber copy halaman**: `page_home()` 448, `page_class()` 554, `page_404()` 631, `sitemap()` 648, helper 175–443, `status_of` 48, `schedule_block` 266, sidebar kelas 590 |
| `referensi/assets/js/main.js` | Perilaku yang harus diport per-island: scheduler 147–326, tabs 111, scrollspy 71, slider 87, show-more 137 |
| `referensi/data/site.json` | Data asli: schedule[57], faq[4], benefits[4], reasons[3] |
| `src/config/jadwal.ts` | Data jadwal terpusat + helper status (untuk Fase 3) |
| `src/config/{site,ui,blocks}.ts` | Identitas, teks UI, blok konten |
| `src/pages/layanan/*.astro` | Halaman Fase 2 (tambah section `#jadwal` di Fase 3) |
| `src/components/content/` | Komponen halaman kelas/listing |
| `src/utils/schema.ts` | Builder JSON-LD |
| `src/layouts/BaseLayout.astro` | Head/meta/OG/JSON-LD/preload |
| `public/.htaccess`, `vercel.json` | Redirect 301 URL lama |
| `scripts/import-images.mjs` | Konversi foto mentah → WebP/JPG |

## Perintah

```bash
npm run check                          # astro sync + tsc --noEmit
npm run build                          # build dengan URL produksi
SITE_URL=http://pelatihan-damkar.lan npm run build   # uji canonical+JSON-LD staging
npm run preview                        # http://localhost:4321/  (stop: npx astro preview stop)

# Verifikasi visual
google-chrome --headless=new --screenshot=/tmp/x.png --virtual-time-budget=25000 http://localhost:4321/
google-chrome --headless=new --dump-dom http://localhost:4321/layanan/ | grep -o '<h1[^>]*>.*</h1>'
```

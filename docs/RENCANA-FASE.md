# Rencana & Status Fase

> Dokumen hidup. **Update setiap satu fase selesai** (status, commit, catatan).
> Terakhir diperbarui: **12 Nov 2026 — Fase 4 selesai**.

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
| 3 | Jadwal: komponen Scheduler + halaman `/jadwal/` + section `#jadwal` di halaman kelas | ✅ Selesai | `dd62aa3` |
| 4 | Beranda lengkap (port `page_home()` dari `build.py`) | ✅ Selesai | `b8c56ab` |
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

### Fase 3 — Jadwal ✅ (commit `dd62aa3`)

1. **Struktur route** (keputusan #13 — clean URL; **satu file catch-all** agar tidak
   ada dua dynamic route ambigu di `/jadwal/`):
   ```
   src/pages/jadwal/index.astro          → /jadwal/                   (1)
   src/pages/jadwal/[...path].astro      → kelas-d | 2026-06 | kelas-d/2026-06
   ```
   - `getStaticPaths` menghasilkan 63 path dari `jadwal.ts` + collection kelas;
     path di luar daftar (mis. `kelas-x`, `2026-13`, kombinasi kosong
     C/2026-01 & B/2026-01) tidak dibuat → 404.
   - Data di-generate saat build, jadi tak ada fetch client-side.
2. **Komponen `Scheduler`** — port perilaku dari `referensi/assets/js/main.js` (baris 147–326):
   - **Chip kelas & strip bulan = tautan** ke URL bersih (bukan filter in-page);
     jumlah per bulan/kelas di-render saat build (agregat → aktif saja,
     halaman bulan → semua). Chip urut jenjang D, C, B, A.
   - Toggle "Tampilkan jadwal yang sudah lewat" tetap JS (state lokal, tak mengubah URL),
     summary live (`aria-live`), empty state.
   - Kartu gelombang: badge status, tanggal, kelas, tombol **WA daftar** + **GCal**
     (`gcalLink` baris 156), status `open/soon/ongoing/done` (dihitung saat build).
   - Deep link `?kelas=&bulan=` **tidak dipakai** (sudah jadi URL bersih).
3. **Section `#jadwal` di tiap halaman kelas** (`/layanan/[slug]/`) + link sidebar
   **"Jadwal & Persyaratan"** → **6 anchor** seperti referensi
   (urutan `build.py` baris 590: manfaat, detail, fasilitas, **jadwal**, faq, jenjang).
   Judul: `Jadwal {nama kelas} 2026` + sub `{n} gelombang ... {m} di antaranya masih
   aktif atau akan datang` (dari `build.py` `page_class()` baris 611–614).
   `chips={false}` — persis referensi (chips hanya di halaman agregat).
4. **JSON-LD** tiap halaman jadwal: `WebPage` + `BreadcrumbList`
   (Beranda → Jadwal → [Kelas] → [Bulan]); `ItemList` juga di `/jadwal/`
   (4 halaman kelas) dan `/jadwal/kelas-x/` (12 halaman bulan kelas itu).
   Sitemap: 63 URL jadwal (Fase 6).
5. **Halaman `/jadwal/` jadi tujuan** nav header, footer, 404, dan tombol
   "Lihat Jadwal" (sudah ada di `/layanan/`; beranda menyusul Fase 4).

**Verifikasi**: `check` + `build` lolos (70 halaman); diff kanonis vs referensi
(`build.py` diregenerasi dulu — HTML referensi sempat basi dari update `site.json`):
**IDENTIK untuk ke-4 halaman kelas**; blok jadwal `/jadwal/` sama dengan blok jadwal
home referensi **kecuali judul section** ("Semua Gelombang Public Training" — sengaja
beda karena h1 sudah "Jadwal Pelatihan Damkar 2026."). Uji HTTP: URL valid 200,
kombinasi kosong & URL ngawur 404. JSON-LD 69 blok valid. Headless Chrome:
toggle jalan (8 aktif / 49 kartu tersembunyi, 10 grup bulan tersembunyi, summary diupdate).

**Divergensi kecil yang disengaja** (keputusan #13):
- Chip/mon = `<a>` (bukan `<button disabled>`); sel tanpa data → `<span aria-disabled>`,
  sel berisi jadwal lewat tetap bisa diklik (tampil abu-abu `is-off`).
- Strip bulan & chip tidak punya filter in-page — navigasi sepenuhnya lewat URL;
  `data-count`/`aria-pressed` referensi diganti `aria-current` + hitungan statis.

### Fase 4 — Beranda ✅ (commit `b8c56ab`)

Port `page_home()` (`referensi/_tools/build.py` baris 448–551):

- Hero slider 2 foto (`#heroSlider`, auto-slide 6500ms, `prefers-reduced-motion`), hero-facts
  (4 jenjang / 57 gelombang / Kemnaker), `nearest(null, 3)`.
- Sidebar 7 anchor: manfaat, program, detail, fasilitas, pengalaman, jadwal, faq.
- Section: `#manfaat` (reasons) → `#program` (4 kartu `prog-card`) → `#detail`
  (tabs kelas A–D + tabpanel materi) → benefits → `#pengalaman` (gallery) → `#jadwal`
  (Scheduler semua kelas) → `#faq` → contact band.
- Nav header referensi memakai anchor `/#jadwal`, `/#detail`, `/#faq` — **keputusan**: nav
  memakai halaman (`/jadwal/`, `/layanan/`, dst.) sesuai Fase 2; anchor lama di-redirect/None.
- `src/pages/index.astro` diganti total (pratinjau hero+ContactBand → `page_home()` lengkap).
- **Verifikasi**: check+build lolos (70 halaman); diff kanonis `<main>` **IDENTIK 3892 token**
  (`/tmp/opencode/diff-home.py`); JS slider/tabs/materi teruji headless Chrome + CDP;
  JSON-LD home 5 node valid; alt foto hydrant disamakan dengan referensi.

### Fase 5 — Artikel + Kontak ⬜

- Collection `artikel` (**sistem dulu**: schema + halaman list `/artikel/` + detail
  `/artikel/[slug]/`; konten menyusul).
- `/kontak/`: data dari `src/config/site.ts` (alamat, WA, email, jam) + ContactBand sudah ada.

### Fase 6 — SEO & pelengkap ⬜

- `sitemap.xml` (port `build.py sitemap()` baris 648 — pakai foto lokal, bukan hotlink
  pusattrainingk3.com) + `robots.txt` (konstanta `ROBOTS` baris 660) — buat via
  endpoint/integration Astro. **Termasuk 63 URL jadwal** (keputusan #13) + halaman
  layanan/artikel/kontak — daftar URL diambil dari route yang sama dengan build.
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
13. **URL jadwal: clean URL per kelas & per bulan** (keputusan user, 12 Nov 2026 —
    revisi 2: +12 halaman bulan supaya strip bulan di `/jadwal/` punya tujuan):
    ```
    /jadwal/                     ← semua 57 gelombang
    /jadwal/2026-06/             ← 12 URL bulan (semua kelas, rata-rata 4,75 gelombang)
    /jadwal/kelas-d/             ← 4 URL per kelas (D=23, C=11, B=11, A=12)
    /jadwal/kelas-d/2026-06/     ← 46 URL (hanya kombinasi terisi; C/2026-01 &
                                    B/2026-01 kosong → tidak dibuat / 404)
    ```
    - **Tidak ada URL per gelombang** — tiap gelombang tetap kartu dalam halaman.
    - **Chip kelas & strip bulan = tautan** (`<a>` menuju URL bersih), bukan filter
      in-page. Navigasi jalan tanpa JS & bisa di-crawl; toggle "tampilkan jadwal
      lewat" tetap JS. Karena itu deep link `?kelas=&bulan=` **tidak dipakai**.
    - **Hitungan chip/bulan = jumlah yang terlihat di halaman tujuannya**
      (halaman agregat → hanya aktif, halaman bulan → semua). Sel kosong →
      tampil abu-abu; sel dengan data tapi 0 aktif → tetap bisa diklik (membuka
      halaman bulan berisi jadwal lewat) — divergensi kecil dari referensi yang
      memakai `disabled` murni.
    - Sitemap jadwal: 1 + 12 + 4 + 46 = **63 URL**. Tiap halaman canonical ke dirinya sendiri.
    - `#jadwal` di `/layanan/[slug]/` tetap ada (section dalam halaman kelas,
      tanpa chips — persis referensi).

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

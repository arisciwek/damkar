# Log Pekerjaan

Catatan kronologis per sesi/fase. Tambah entri baru di **atas** garis "Entri baru".

## 12 Nov 2026 — Merge fix jadwal: "Jadwal undefined" (merge `d56c401`)

- **Tag**: `checkpoint/fase-4` (annotated) di `b6c51a0` — penanda main sebelum merge branch remote.
- **Bug**: `/jadwal/kelas-d/` & `/jadwal/kelas-d/2026-11/` (dst.) menampilkan "Jadwal undefined".
  Akar: `byKey` di `src/pages/jadwal/[...path].astro` memetakan ke *entry*, bukan `entry.data`
  → `cls.name`/`cls.desc`/`cls.step`/`cls.role` = `undefined`.
- **Branch remote di-merge**: `fix/jadwal-kelas-d-undefined` (`19f8931`, base `733f6d0`) → merge
  `d56c401` tanpa konflik. Isi: `byKey` → `entry.data`, label kelas jadi `Kelas ${kelas}`
  ("Jadwal Kelas D 2026", bukan "Jadwal Damkar Kelas D 2026").
- **Verifikasi**: `npm run check` + `build` lolos (70 halaman); `grep undefined` di seluruh
  `dist/` = **0**; H1/lead/facts/breadcrumb terisi benar (mis. `Jenjang 1 — Petugas Pemadam`);
  preview 4321 menyajikan judul baru untuk 5 URL jadwal yang dicek.
- **Merge bertahap**: sisa branch remote (`content/damkar-articles-and-blocks`,
  `assets/ilustrasi-12-artikel-damkar`, `docs/research-kompetitor-pelatihan-damkar`)
  menyusul sesuai kebutuhan fase — jangan digabung sekaligus.

## 12 Nov 2026 — Fase 4 selesai: beranda (commit `b8c56ab`)

- Port `page_home()` (`build.py` 448–551) ke `src/pages/index.astro` + komponen baru:
  `HeroSlider.astro` (auto-slide 6500ms, hormati `prefers-reduced-motion`),
  `DetailTabs.astro` (4 tab kelas + panel materi `limit=6`, klik + panah/Home/End),
  `GalleryBlock.astro` (4 foto + caption). Section: hero+slider → sidebar 7 anchor →
  reasons → program → detail-tabs → benefits → gallery → `#jadwal` (Scheduler) → `#faq`.
- `BaseLayout`: `<script is:inline>document.documentElement.classList.add("js")</script>`
  — tab & "lihat semua materi" tampil penuh tanpa JS (progressive enhancement).
- Copy persis referensi: WA hero "…konsultasi…" vs sidebar "…mendaftar…", tombol
  "Lihat Jadwal" → `#jadwal` (anchor, bukan `/jadwal/` — divergensi disengaja).
- **Diff kanonis** (`/tmp/opencode/diff-home.py`, normalisasi: entitas HTML `&amp;`/`&middot;`,
  foto remote→lokal di-drop `src`, bentuk `<path></path>`≡`<path/>`, button→a chip):
  `<main>` **IDENTIK — 3892 token**.
- **Bug saat verifikasi**: alt foto hydrant di `config/site.ts` beda dengan referensi
  (berlaku juga di halaman kelas) → disamakan.
- **JS teruji** headless Chrome + CDP: `html.js`; slider `1 / 2` → auto `2 / 2` →
  next/prev wrap-around + `aria-hidden`; tab klik & keyboard (ArrowRight/End) memindah
  `aria-selected` + panel (`display:none` non-aktif); "Lihat semua materi" 6→13.
- JSON-LD home: EducationalOrganization + WebSite + WebPage + ItemList (4 program) +
  FAQPage (4) — 1 blok valid. Screenshot hero/gallery/jadwal/faq cocok referensi.

## 12 Nov 2026 — Fase 3 selesai (commit `dd62aa3`)

- **63 URL jadwal live**: `/jadwal/` + 12 halaman bulan + 4 kelas + 46 kelas×bulan;
  70 halaman total dibangun. Kombinasi kosong (C/2026-01, B/2026-01) & URL ngawur
  (`kelas-x`, `2026-13`) diuji → **404**; URL valid → 200.
- Komponen `Scheduler.astro` (port `schedule_block`/`batch_html`/`initSchedule`),
  section `#jadwal` + sidebar "Jadwal & Persyaratan" di 4 halaman kelas (6 anchor).
- **Bug ketika verifikasi**: judul grup & pesan WA berisi "undefined" — `byKey` memetakan
  ke *entry*, bukan `entry.data` (salah akses `.name` vs `.data.name`). Diperbaiki.
  Chip juga sempat urut A,B,C,D (id alfabetis) → di-sort `data.order` jadi D,C,B,A.
- **HTML referensi basi**: `referensi/*/index.html` dibangun 10:15, `data/site.json`
  diupdate 10:39 (D-G21 16–18 → 17–19 Nov) — data kita yang benar. `build.py`
  diregenerasi sebelum diff supaya perbandingan adil.
- **Diff kanonis** (skrip di `/tmp/opencode/diff-jadwal.py`, normalkan button→a,
  disabled→is-off, whitespace, slug): ke-4 halaman kelas **IDENTIK**;
  `/jadwal/` identik dengan blok jadwal home referensi kecuali judul section
  (sengaja beda, hindari duplikasi h1). JSON-LD 69 blok valid; toggle JS teruji
  di headless Chrome (8 aktif, 49 kartu tersembunyi, 10 grup bulan tersembunyi).

## 12 Nov 2026 — Revisi #13b: +12 halaman bulan (total 63 URL)

- Saat mulai Fase 3 ditemukan celah: strip bulan di `/jadwal/` (semua kelas) tidak
  punya tujuan kalau hanya ada URL kelas+bulan. User memilih **tambah 12 halaman
  bulan** `/jadwal/2026-01/ … /jadwal/2026-12/`.
- Total URL jadwal: **63** (1 index + 12 bulan + 4 kelas + 46 kelas×bulan).
- Aturan hitungan chip/bulan & perilaku (lihat Keputusan #13) ikut diperbarui;
  route memakai satu file catch-all `src/pages/jadwal/[...path].astro` supaya
  tidak ada dua dynamic route ambigu.
- Response sempat terpotong di tengah riset (harness) — tidak ada kerjaan hilang,
  working tree bersih.

## 12 Nov 2026 — Revisi: jadwal pakai clean URL per kelas & per bulan

- Keputusan #13 **direvisi** setelah diskusi: awalnya ikuti referensi (query param),
  user memilih **clean URL** demi SEO:
  - `/jadwal/` + `/jadwal/kelas-d/` (4) + `/jadwal/kelas-d/2026-06/` (**46 URL**).
  - Data: 57 gelombang, 46 kombinasi terisi; **C/2026-01 & B/2026-01 kosong → tidak dibuat**.
  - Distribusi per kelas: D=23, C=11, B=11, A=12.
  - Rata-rata isi 1,2 gelombang/halaman (maks 3) — user tetap memilih opsi ini
    setelah thin content / doorway risk dijelaskan.
  - **Chip kelas & strip bulan = tautan** (`<a>`), bukan filter in-page → navigasi
    tanpa JS, semua URL bisa di-crawl; toggle "jadwal lewat" tetap JS.
  - Deep link `?kelas=&bulan=` **dihapus** dari rencana (sudah jadi URL bersih).
  - Sitemap jadwal: 1 + 4 + 46 = 51 URL; canonical per halaman ke dirinya sendiri.
- Detail implementasi ada di `RENCANA-FASE.md` → Fase 3.

## 12 Nov 2026 — Keputusan (lama): jadwal tanpa URL per gelombang

- ~~User memilih **ikuti referensi**~~ → **direvisi** lihat entri di atas.
  Yang masih berlaku: **tiap gelombang tetap tidak punya URL sendiri** (kartu dalam
  halaman). Dicatat sebagai Keputusan #13 di `RENCANA-FASE.md` (sudah diperbarui).

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

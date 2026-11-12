# Log Pekerjaan

Catatan kronologis per sesi/fase. Tambah entri baru di **atas** garis "Entri baru".

## 13 Nov 2026 — Pertahankan fakta jumlah gelombang tetap dinamis pada hero Markdown

- Commit `f6a75ff`: kontrak `HeroFact` mendukung sumber nilai dinamis `batch-count`.
- Commit `e88ca84`: `HeroBlock` menghitung jumlah gelombang memakai `countBatches()` ketika fact memakai `dynamic: batch-count`.
- Commit `507a149`: schema frontmatter memvalidasi nilai sumber dinamis tersebut.
- Commit `f21b159`: fact hero beranda memakai `dynamic: batch-count`; angka fallback tetap 57 agar output saat ini tidak berubah, tetapi nilai render mengikuti data jadwal.
- Tujuan: mencegah angka gelombang di hero menjadi stale saat data jadwal berubah.

## 13 Nov 2026 — Migrasi beranda ke Markdown + BlockRenderer

- Commit `f6f3feb`: `/` mulai merender `PageBlockRenderer` dari `src/content/pages/home.md`; header, footer, floating WhatsApp, BaseLayout, JSON-LD, dan preload hero tetap dipertahankan.
- Commit `945af6a` + `3f35541`: title dan meta description dipertahankan persis seperti metadata SEO sebelumnya, tetapi sekarang dibaca dari frontmatter.
- Commit `cab96b1`: rapikan import setelah pergantian renderer.
- Urutan block frontmatter: hero → content-layout/sidebar (reasons, program-grid, class-tabs, benefits, gallery, schedule-list, FAQ) → contact-band.
- Data kelas, jadwal, navigasi global, dan informasi organisasi tetap bersumber dari collection/config yang sudah ada; tidak disalin ke frontmatter.
- **Belum diverifikasi di runtime**: `npm run check`, `npm run build`, DOM diff `/`, dan browser interaction harus dijalankan setelah pull. Jangan anggap migrasi lolos parity sebelum hasil tersebut diperiksa.

## 13 Nov 2026 — Siapkan konten beranda dalam frontmatter Markdown

- Commit `2caa1a0`: tambah collection `pages` beserta schema block yang membatasi tipe dan properti yang diterima.
- Commit `e5abef3`: tambah `src/content/pages/home.md` berisi konfigurasi hero, sidebar/layout, reasons, program-grid, class-tabs, benefits, gallery, schedule-list, FAQ, dan contact-band.
- Konten editorial beranda kini tersimpan sebagai frontmatter; data kelas dan gelombang tetap dibaca dari collection/config produksi oleh komponen dinamis.
- File Markdown belum dipakai route `/` pada commit ini; perubahan ini menyiapkan sumber konten sebelum pergantian renderer.
- Check/build belum dijalankan di lingkungan ini. Verifikasi lokal tetap wajib sebelum dinyatakan lolos.

## 13 Nov 2026 — Source parity section beranda (tanpa perubahan route)

- Inspeksi dilanjutkan pada Reasons, ProgramGrid, DetailTabs, Benefits, Gallery, Scheduler, FAQ, ContactBand, serta wrapper Sidebar/layout.
- Nilai fixture cocok dengan props/default komponen asal; wrapper `PageBlockRenderer` mengikuti urutan DOM wrapper yang dipakai `index.astro`.
- Scheduler tetap memakai komponen dan script produksi yang sama; default `chips=true` serta filter kelas/bulan kosong setara dengan `<Scheduler />`.
- Rincian per section dicatat di `docs/BLOCK-PARITY-CHECKLIST.md`.
- Belum ada klaim DOM/browser parity; route `/` belum dimigrasikan dan tetap aman.
- Commit: `8762d72` (`docs: rinci source parity section beranda`).

## 13 Nov 2026 — Source parity hero beranda (tanpa perubahan route)

- Membandingkan `src/pages/index.astro`, `homeBlockFixture`, `HeroBlock.astro`, dan komponen `Hero.astro`.
- Props hero (eyebrow, heading, highlight, lead), nearest (limit 3), facts, actions, serta media slider cocok antara pemakaian langsung dan adapter.
- Adapter tetap memakai komponen `Hero` dan `HeroSlider` yang sama; tidak ada perubahan markup atau style produksi.
- Status: **source/props cocok**. DOM output belum dibandingkan; kolom DOM dan browser tetap pending.
- Commit: `09d4947` (`docs: catat source parity hero beranda`).

## 13 Nov 2026 — Diff DOM seluruh route layanan/jadwal/beranda (tanpa perubahan kode)

- `npm run build` lolos (70 halaman) di `486c1a2`, working tree bersih; **tidak ada commit
  kode** — semua selisih diselidiki sebelum menyentuh komponen.
- Alat: `diff-jadwal.py` + varian tanpa batas baris (`/tmp/opencode/diff-full.py`,
  `diff-jadwal-full.py`) karena script bawaan memotong diff.
- **Hasil lengkap + metode: `docs/VERIFIKASI-DOM-ROUTE.md`** (dokumen baru).
- Temuan: semua selisih = divergensi terdokumentasi (breadcrumb **#10**, role nr-class
  `d519571`/month-title `f2d2272`/batch-title `fbb9fb4`, judul section jadwal Fase 3) +
  selisih tanggal `Mulai N hari lagi` (ref diregenerasi 12 Nov vs kita 13 Nov, −1 hari).
  **Tidak ada selisih tak terduga → tidak ada komponen yang perlu diperbaiki.**
- Bukti pull Tahap 0 **nol efek**: 7 route **byte-identik** (md5) dengan baseline pre-pull
  `3eb515a` (git worktree, sudah dihapus). `/layanan/` listing tidak punya referensi
  (build.py hanya home/class/404) → baseline memakai build pre-pull.
- **Sisa gerbang Tahap 0**: DOM diff per-block via fixture, uji interaksi browser,
  screenshot desktop/mobile.
- Update menyertainya: `RENCANA-BLOCK-PARITY.md` (diff route → "sudah diverifikasi"),
  `BLOCK-PARITY-CHECKLIST.md` (catatan di bagian Status).

## 13 Nov 2026 — Penanda: pull kedua terverifikasi (`git pull` di `a519f22`)

- `git pull origin main` → 5 commit, **3 file murni `docs/`** (baru
  `BLOCK-PARITY-CHECKLIST.md`, revisi `RENCANA-BLOCK-PARITY.md` + `LOG.md`) — tidak ada
  perubahan kode di `src/`.
- `npm run check` + `npm run build` **lolos** (70 halaman, sitemap + lastmod normal).
- Diff ulang tidak diperlukan: output identik dengan build `4713cad` karena tak ada kode
  yang berubah.
- **Status parity tidak berubah**: source review ✅ (`BLOCK-PARITY-CHECKLIST.md`),
  DOM/visual/interaksi ⬜.
- Commit ini = penanda bahwa pull terakhir sudah ditarik, dicek, dan dibangun bersih.

## 13 Nov 2026 — Rapikan peta parity sesuai registry aktual

- Commit `88e24cd`: koreksi peta section → block. Varian hero layanan dan jadwal
  menggunakan `hero` yang sama (bukan tipe konseptual `service-hero`/`schedule-hero`).
- Catatan `class-detail` diperbarui karena inventarisasi dan adapter sudah tersedia.
- Section jenjang terkait pada halaman detail dicatat sebagai `other-programs`, bukan
  `program-grid`, karena markup dan tujuan UI-nya berbeda.
- Tidak ada perubahan komponen atau output route produksi.

## 13 Nov 2026 — Checklist parity per block + source review

- Commit `ec90d3e`: tambah `docs/BLOCK-PARITY-CHECKLIST.md` untuk memetakan 12
  block konten dan 2 wrapper layout terhadap komponen asal, fixture, dan route pembanding.
- Inspeksi source-level dilakukan pada adapter Hero, class-detail, other-programs,
  schedule-list, serta komponen Reasons, Benefits, FAQ, Gallery, ProgramGrid, DetailTabs,
  Nearest, Sidebar, Scheduler, dan ContactBand.
- Tidak ditemukan alasan untuk mengganti komponen produksi atau mengubah markup pada tahap ini;
  adapter menggunakan ulang komponen yang sama. Ini bukan bukti DOM/visual/browser parity.
- Commit `59e1c74`: tautkan checklist dari `RENCANA-BLOCK-PARITY.md` dan catat batas
  antara source review dengan verifikasi runtime.
- **Masih pending**: diff route layanan/jadwal, DOM diff per block, screenshot desktop/mobile,
  dan uji interaksi browser. Tidak ada route produksi yang dimigrasikan atau diubah.

## 13 Nov 2026 — Verifikasi runtime Tahap 0: check/build lolos (fix `4713cad`)

- `git pull` (19 file, `3eb515a..8b05643`): 3 dokumen (termasuk baru
  `RENCANA-BLOCK-PARITY.md`) + folder `src/blocks/` (kontrak, registry, renderer, 12 adapter,
  fixtures) + 6 komponen `content/` dimodifikasi.
- `npm run check` **gagal** pertama: `TS2307 Cannot find module '*.astro'` di 12 baris
  `src/blocks/registry.ts` — file `.ts` **pertama** project yang mengimpor `.astro`;
  `astro/client` hanya mendeklarasikan modul gambar (png/svg/...), bukan `*.astro`.
  Kedua proyek referensi (konsultan-slf, confinedspace) memakai `src/components/modules.d.ts`
  sendiri → damkar ikut pola sama (commit `4713cad`).
- Setelah fix: `npm run check` + `npm run build` **lolos** (70 halaman, sitemap + lastmod
  normal) → menutup poin "check/build belum dijalankan" di `RENCANA-BLOCK-PARITY.md`.
- Diff beranda (`referensi/index.html` vs `dist/index.html`): **hanya divergensi role**
  yang disengaja (`d519571`, `fbb9fb4`) — 6 komponen ter-pull tidak mengubah output;
  route lama tetap dirender halaman `.astro`.
- **Masih pending (parity Tahap 0)**: diff layanan & jadwal, DOM diff per-block, screenshot,
  uji interaksi (slider, tabs/keyboard, show-more, scrollspy, toggle jadwal lewat),
  checklist parity per block. Status lengkap → `RENCANA-BLOCK-PARITY.md` bagian Status.
- `4713cad` sudah push; `main` sinkron, working tree bersih.

## 13 Nov 2026 — Tahap 0 Design Parity Blocks (implementasi awal, verifikasi pending)

- Revisi rencana: `docs/RENCANA-FASE.md` menambahkan Tahap 0 sebelum migrasi halaman;
  rincian peta section, urutan commit, dan gerbang parity ada di
  `docs/RENCANA-BLOCK-PARITY.md`.
- Eksekusi langsung di `main`, tanpa mengubah atau mengganti route produksi yang sudah ada.
  Commit dibuat kecil dan berurutan.
- Fondasi: `src/blocks/types.ts`, `registry.ts`, `BlockRenderer.astro`, dan
  `PageBlockRenderer.astro` (wrapper layout sidebar/container mengikuti struktur halaman).
- Adapter dibuat untuk Hero, reasons, benefits, FAQ, gallery, program-grid, class-tabs,
  nearest-schedule, schedule-list, contact-band, class-detail, dan other-programs.
  Komponen lama menerima props konfigurasi dengan default data produksi agar pemakaian
  halaman saat ini tetap memakai markup yang sama.
- Fixture berbasis data nyata dibuat untuk beranda, listing layanan, indeks jadwal, dan
  detail kelas: `src/blocks/fixtures.ts`.
- **Belum dinyatakan lolos parity**: runtime project belum menjalankan `npm run check`,
  `npm run build`, DOM diff, screenshot, atau uji browser. Tidak ada halaman yang dimigrasikan.
  Lanjutkan verifikasi sebelum menambah adapter lain atau memulai migrasi.
- Commit utama: `c44aa71` (dokumen parity), `9e714c5` (revisi rencana), lalu rangkaian
  commit `src/blocks/*` dan adapter komponen setelahnya.

## 13 Nov 2026 — Keputusan arsitektur: pola konsultan-slf + lastmod per-URL (rencana, belum ada kode)

- Lanjutan diskusi arsitektur; analisis `../konsultan-slf` & `../confinedspace`: semua
  halaman = md + `blocks[]` + `BlockRenderer`; **artikel pun blocks** (18 artikel kslf =
  2158 baris YAML, tanpa `<Content />`); sitemap mereka endpoint `.ts` dengan **lastmod
  per-URL dari frontmatter** (confinedspace bahkan `max(updatedDate)` utk halaman hub jadwal).
- **Poin kunci**: section "artikel terbaru" di beranda tetap SSG (data-driven **saat build**,
  bukan request-time). Google suka homepage segar **hanya bila lastmod akurat per-halaman** —
  lastmod seragam (commit HEAD, `752e99a`) lama-lama akan diabaikan Google.
- **Keputusan user (3)**:
  1. **Urutan tahapan disetujui** → ditulis lengkap di `docs/RENCANA-FASE.md`
     (bagian **"Rencana tahapan lanjutan"**, Tahap 1–7) supaya sesi lain bisa lanjut.
  2. **Jadwal → collection `schedule` md** (pola confinedspace): *"jika hasil terbaik adalah
     collection schedule.md; kita pakai itu. mahal sepadan dengan hasil."*
  3. **Artikel Fase 5 → blocks, ikuti konsultan-slf persis** (menggantikan rekomendasi
     hibrida md-biasa dari sesi sebelumnya).
- Konsekuensi tercatat: keputusan #3 lama (jadwal = `jadwal.ts`) ditandai **direvisi oleh #14**;
  lastmod commit-HEAD diganti per-URL mulai Tahap 1 (interim: commit file sumber utk beranda/
  listing & `jadwal.ts` sampai halaman jadi md).
- **Belum ada kode yang diubah** — murni perencanaan. Tag `checkpoint/sitemap` = titik aman.

## 12 Nov 2026 — Sitemap + `<lastmod>` (commit `17d5b3d`, `752e99a`)

- `@astrojs/sitemap` 3.7.4 di `astro.config.mjs`, filter buang `/404.html`.
  Output bawaan: **`sitemap-index.xml`** (pembungkus) + `sitemap-0.xml` (**69 URL**:
  1 beranda + 5 layanan + 63 jadwal). ⚠️ `/sitemap.xml` = **404**, memang tidak pernah
  dibuat (user pilih biarkan, keputusan via tanya).
- URL kosong B/2026-01 & C/2026-01 absen dari sitemap — benar (memang 404, keputusan #13).
- **`<lastmod>`**: via `serialize` = waktu **commit HEAD** (bukan waktu build, agar tidak
  berubah tiap rebuild). Format ISO-8601 **UTC tanpa milidetik** (`2026-11-12T16:18:34Z`).
  `@astrojs/sitemap` memaksa `toISOString()` (selalu `.000Z`) → dirapikan langkah akhir
  `npm run build` oleh `scripts/fix-sitemap-lastmod.mjs`.
  **Bug skrip saat pertama**: replacement `'$1Z'` lupa `$2` → tag `</lastmod>` hilang dan
  XML rusak; diperbaiki jadi `'$1Z$2'`, divalidasi `ET.fromstring` (69/69 lastmod, XML valid).
- `SITE_URL` staging diuji: `http://pelatihan-damkar.lan/` → sitemap ikut, 0 referensi domain
  produksi, lalu build normal dikembalikan.
- ⚠️ **Setelah tambah artikel (Fase 5): `npm run build` ulang** supaya URL baru ikut sitemap.
- Push `58e78c1` (sebelum sitemap): main sinkron dengan origin.

## 12 Nov 2026 — batch-title kartu gelombang: tambah role (commit `fbb9fb4`)

- Pertanyaan user: role di `<a>Damkar Kelas A</a> <span>Gelombang 11</span>` → di mana?
- **Keputusan**: di dalam `<a>` ("Damkar Kelas A Ahli K3"), bukan di `<span>`. Alasan: `<span>`
  bergaya abu (`--mute`) → jadinya "Ahli K3 Gelombang 11" yang ambigu. Juga konsisten `nr-class`.
- Hanya tampil bila `showClass` (beranda `#jadwal`, `/jadwal/`, `/jadwal/bulan/`); halaman
  kelas+bulan tetap "Gelombang NN" (kelasnya sudah disebut di judul grup).
- **Belum disentuh**: `<a>Damkar Kelas A</a>` di ProgramGrid (kartu Program beranda) — di luar
  scope permintaan ini; kandidat revisi konsistensi berikutnya.

## 12 Nov 2026 — nr-class lebar & nr-date sempit (commit `8bc3d5e`)

- Permintaan user: kolom `nr-date` (tanggal) disempitkan agar `nr-class` (nama+role) lebih lebar.
- `global.css` `.nearest-list li`: `grid-template-columns1.25fr/1fr/auto` → `.9fr/1.5fr/auto`.
- Hasil: "Damkar Kelas D Petugas Pemadam" muat1 baris (sebelumnya wrap). Tanggal panjang
  ("30 November–2 Desember 2026") tetap terbaca (wrap alami). Layout mobile tidak berubah.

## 12 Nov 2026 — "Jadwal terdekat" (nr-class): tambah role (commit `d519571`)

- Permintaan user: `<span class="nr-class">Damkar Kelas A</span>` → `…Damkar Kelas A Ahli K3`.
- Sumber: `Nearest.astro` (`name = ${info.name} ${info.role}`).
- Berlaku di beranda + `/layanan/` (listing & detail) — komponen sama.
- **Divergensi disengaja**: ini mengubah teks sidebar "Jadwal terdekat" yang pada diff Fase 2
  IDENTIK dengan referensi; sekarang sedikit berbeda demi konsistensi role di seluruh situs.

## 12 Nov 2026 — month-title grup bulan: tambah role (commit `f2d2272`)

- Permintaan user: `<h3 class="month-title">Jadwal Damkar Kelas D November 2026</h3>`
  → `…Jadwal Damkar Kelas D Petugas Pemadam November 2026`.
- Sumber: `groups[].title` di `Scheduler.astro` (memakai `name` collection, bukan `kelasLabel`).
- Berlaku untuk 46 halaman kelas+bulan; halaman tanpa kelas (`/`, `/jadwal/`, `/jadwal/bulan/`)
  judulnya tetap `Jadwal <bulan> <tahun>` — tidak berubah.

## 12 Nov 2026 — Lead & lede jadwal kelas: tambah role (commit `560a505`)

- Permintaan user: paragraf "3 gelombang Kelas D pada November 2026…" juga menyebut role.
- Diubah di2 tempat terlihat: **hero lead** dan **block lede** (`blockLede`) —
  `3 gelombang Kelas D (Petugas Pemadam) pada November 2026. …` (role dalam kurung).
- **Meta description sengaja tidak diubah** (bukan teks terlihat; agar tetap ringkas).
- Berlaku untuk 46 halaman kelas+bulan; `/jadwal/kelas-x/` (lead-nya memakai `desc`) dan
  `/jadwal/` + `/jadwal/bulan/` tidak berubah.

## 12 Nov 2026 — H1 jadwal kelas: tambah keterangan role (commit `8f02322`)

- Permintaan user: H1 halaman jadwal kelas diberi keterangan "kelas ini apa".
  Pilihan user (via tanya): pakai field **`role`** collection, di dalam H1 sebelum bulan/tahun.
- `heading = kelas ? \`Jadwal ${kelasLabel} — ${cls.role}\` : 'Jadwal Pelatihan Damkar'`
  → "Jadwal Kelas D — Petugas Pemadam November 2026."
- Berlaku 4 kelas × (`/jadwal/kelas-x/` + bulan) = 46 halaman; halaman `/jadwal/` &
  `/jadwal/bulan/` tanpa kelas tidak berubah. Meta title tidak diubah (tetap tanpa role).

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

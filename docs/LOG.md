# Log Pekerjaan

## 13 Nov 2026 — Tanggal editorial halaman jadwal diterapkan

- Commit `b953682`: schema collection `pages` menerima `pubDate` dan `updatedDate`
  opsional menggunakan `z.coerce.date()`.
- Commit `40f3472` dan `15c9e41`: tanggal editorial ditambahkan ke frontmatter
  `jadwal.md` dan `jadwal-detail.md`. Keduanya memakai ISO 8601 UTC tanpa milidetik,
  dengan `updatedDate` setelah `pubDate`.
- Commit `affb27b` dan `976e159`: tanggal diteruskan ke `webpageNode()`, sehingga
  JSON-LD halaman jadwal memuat `datePublished` dan `dateModified`.
- Tanggal route dinamis bersumber dari satu template; karena itu semua halaman kelas,
  bulan, dan kombinasi kelas/bulan menggunakan tanggal template yang sama. Tanggal ini
  adalah tanggal editorial template, bukan tanggal modifikasi data gelombang per URL.
- Commit `dca9212`: kebijakan tanggal di `RENCANA-FASE.md` diperbarui agar sesuai
  keputusan terbaru. Catatan sebelumnya yang menyatakan halaman jadwal tidak memiliki
  tanggal editorial sudah tidak berlaku.
- Validasi statis dari GitHub: kedua file Markdown diawali dan diakhiri delimiter
  frontmatter serta masing-masing memiliki tepat dua baris `---`.
- **Menunggu verifikasi lokal**: jalankan `npm run check` dan `npm run build`;
  periksa JSON-LD pada `/jadwal/`, `/jadwal/kelas-d/`,
  `/jadwal/2026-11/`, dan `/jadwal/kelas-d/2026-11/`.

## 13 Nov 2026 — Migrasi 63 route turunan jadwal ke template Markdown blocks

- Commit `c344c0f`: tambah `src/content/pages/jadwal-detail.md` sebagai template bersama
  untuk hero, breadcrumb, facts, CTA, media, `content-container`, `schedule-list`,
  dan `contact-band`.
- Commit `246a29a`: route catch-all `src/pages/jadwal/[...path].astro` sekarang
  mengambil template tersebut dan mengisi nilai per kelas/bulan dari collection `kelas`
  serta helper jadwal yang sudah ada. Pola `getStaticPaths`, 63 URL, filter gelombang,
  metadata SEO, JSON-LD, dan sumber data tidak diubah.
- Commit `cf44ee3`: adapter route memetakan props secara rekursif ke block di dalam
  `content-container`, sehingga `kelas` dan `bulan` benar-benar diteruskan ke `Scheduler`
  pada setiap URL turunan, bukan hanya ke block yang berada di level teratas.
- Tidak ada file Markdown per URL yang menduplikasi data. Satu template mengendalikan
  struktur, sedangkan nilai dinamis tetap berasal dari sumber data kanonis.
- **Kebijakan tanggal**: semua halaman jadwal bersifat operasional; tidak memiliki
  `pubDate`/`updatedDate` dan tidak menambahkan `datePublished`/`dateModified`
  pada WebPage JSON-LD. Sitemap `lastmod` diperlakukan terpisah sebagai metadata teknis.
- Pemeriksaan frontmatter `jadwal-detail.md`: tepat dua delimiter `---`, penutup benar,
  tanpa field tanggal editorial dan tanpa body Markdown.
- **Belum diverifikasi runtime**: jalankan `npm run check` + `npm run build`; pastikan
  63 URL tetap terbentuk dan lakukan diff DOM untuk minimal route kelas, bulan, dan
  kombinasi kelas/bulan. Uji scheduler, navigasi breadcrumb, CTA, dan responsive layout.

## 13 Nov 2026 — Migrasi indeks jadwal `/jadwal/` ke Markdown blocks

- Commit `b8ba560`: tambah `src/content/pages/jadwal.md`; konfigurasi hero,
  breadcrumb, facts, CTA, media, `content-container`, `schedule-list`, dan
  `contact-band` sekarang tersimpan di frontmatter. Tidak ada body Markdown.
- Commit `a9c617b`: route `src/pages/jadwal/index.astro` memakai
  `PageBlockRenderer`. Jumlah gelombang, tahun, CTA WhatsApp, title, description,
  ItemList JSON-LD, dan breadcrumb tetap dihitung/dibentuk dari sumber data yang sama.
- Wrapper tetap `.container` tanpa sidebar; scheduler tetap komponen produksi yang sama.
  Struktur header/footer, `main#konten`, preload gambar, dan JSON-LD dipertahankan.
- **Pemeriksaan frontmatter**: file baru memiliki tepat dua delimiter `---`
  (pembuka dan penutup); penutup berada setelah seluruh konfigurasi blocks.
- **Belum diverifikasi runtime**: setelah pull jalankan `npm run check` dan
  `npm run build`, lalu bandingkan `/jadwal/` dengan baseline serta uji filter kelas/bulan,
  toggle jadwal lewat, summary, tautan WhatsApp, dan responsive layout.

## 13 Nov 2026 — Migrasi 4 halaman detail layanan ke Markdown blocks

- Kontrak collection `pages` diperluas untuk menyimpan referensi jenjang (`kelas: D|C|B|A`)
  serta penanda block `class-detail` dan `other-programs`; isi program tetap bersumber
  dari collection `kelas`, bukan disalin ke Markdown.
- Dibuat empat dokumen frontmatter: `damkar-kelas-d.md`, `damkar-kelas-c.md`,
  `damkar-kelas-b.md`, dan `damkar-kelas-a.md`. Dokumen menentukan susunan
  blocks, metadata, hero, CTA, serta sidebar; tidak memiliki body Markdown.
- Route `src/pages/layanan/[slug].astro` kini mengambil dokumen sesuai ID kelas,
  memvalidasi `kelas` terhadap collection, menyusun nilai dinamis (materi, jadwal,
  pendidikan, foto, jenjang terkait), lalu merender `PageBlockRenderer`.
- Urutan DOM dipertahankan: hero → layout container/sidebar/content → contact band.
  JSON-LD Organization, WebSite, WebPage, BreadcrumbList, Course, dan FAQPage tetap
  dibangun pada route.
- **Belum diverifikasi runtime dari sesi GitHub**: wajib jalankan `npm run check` dan
  `npm run build`; periksa juga empat URL detail, materi show-more, scrollspy,
  nearest schedule, jadwal per kelas, tautan CTA, dan diff DOM terhadap baseline.
  Jangan menganggap migrasi lolos sebelum hasil lokal dicatat.
- Commit implementasi bertahap: `f60a5e0` (schema), `c27a4bf`–`ef433a5`
  (empat dokumen awal), `61f6ff9` (schema block), `921c876` (route renderer),
  disusul koreksi posisi contact-band, metadata SEO, dan validasi referensi kelas.
  
Catatan kronologis per sesi/fase. Tambah entri baru di **atas** garis "Entri baru".

## 13 Nov 2026 — Tahap 4 selesai: 57 gelombang → collection `schedule` (3 commit)

- **Commit `eeecc5a` (Unit A)**: 57 file md di `src/content/schedule/` (nama
  `YYYY-MM-DD-kelas-batch.md`, frontmatter-only, semua nilai di-quoted — hindari jadi
  Date/number di YAML; round-trip terverifikasi identik dengan RAW lama, D=23 C=11 B=11
  A=12), collection `schedule` di `content.config.ts`, `src/utils/schedule.ts` (API +
  logika status/pengurutan **identik** dengan `jadwal.ts`, seluruh fungsi data async).
- **Commit `4950c57` (Unit B)**: 8 konsumen beralih (`jadwal/index`, `[...path]`,
  `Scheduler`, `Nearest`, `ProgramGrid`, `HeroBlock`, `layanan/[slug]`, `fixtures`);
  pemakaian fungsi di template di-precompute di frontmatter (`chipItems` kini membawa
  `total`+`count`, `monthItems` via `Promise.all`, `nextLabels[]`, `batchCount`);
  `fixtures.ts` pakai top-level await; `serviceDetailBlockFixture` async;
  **`src/config/jadwal.ts` dihapus**.
- **Unit C (commit docs ini menyusul)**: `astro.config.mjs` — indeks 57 file gelombang +
  resolver `scheduleRouteFiles()` (bulan ← `start.slice(0,7)`, kelas, irisan) untuk lastmod
  63 route ← commit file penyumbang; cache git per kombinasi file.
- **Gerbang lulus semua**: check+build lolos (70 halaman); **70 HTML byte-identik** vs
  baseline pre-Tahap 4 (`/tmp/opencode/html-before-tahap4.md5`); diff vs referensi persis
  pola lama (beranda 3892/3892, listing IDENTIK 610, 4 detail 1802/32 1316/26 1351/30
  1399/32, jadwal 2777/2777); sitemap valid XML, 69 URL, 63 route; lastmod terverifikasi
  terhadap git (contoh `/jadwal/kelas-d/` = commit 23 file penyumbang ✓).
- **Temuan**: 62 route turunan kini berbagi lastmod `2026-11-12T20:06:58Z` karena seluruh
  57 file lahir di commit migrasi yang sama (`eeecc5a`) — jujur; otomatis unik saat tiap
  file diubah terpisah. Field `role` (rencana Tahap 4) ternyata tidak ada pada data
  gelombang — tidak diterapkan. Uji toggle CDP tidak dijalankan (script klien tak disentuh,
  output byte-identik) — masuk sisa gerbang Tahap 0.

## 13 Nov 2026 — Sitemap lastmod per-URL (Tahap 1 poin 3+4) — gerbang lulus

- Ganti `serialize` di `astro.config.mjs` (commit HEAD seragam → peta **URL → lastmod**
  yang dibangun saat build): helper `gitLastmodFiles()` (`git log -1 --format=%cI -- <file>`)
  + `readUpdatedDate()` (regex frontmatter) + `SOURCES` (5 aturan pathname) +
  `resolveLastmod()`; fallback: editorial → commit file sumber → HEAD → tanpa lastmod.
- Kebijakan per grup: beranda/listing/4 detail ← `updatedDate` jika ada, else commit file
  md-nya; indeks `/jadwal/` ← `updatedDate` `jadwal.md`; 63 route turunan ← commit
  `jadwal.ts` + `jadwal-detail.md` (**tanpa** tanggal editorial template).
- **Gerbang Tahap 1 terpenuhi**:
  1. **nol perubahan HTML** — 70 file byte-identik (md5 sebelum/sesudah);
  2. XML valid (`sitemap-0.xml` + `sitemap-index.xml`);
  3. lastmod per grup sumber terverifikasi: home `18:46:21Z`, layanan `18:55:26Z`, detail
     `19:05:49Z`, indeks `08:15:00Z` (updatedDate), 63 route `19:36:42Z` (commit data+template)
     — 69 URL, 404 tetap tak ikut.
- `RENCANA-FASE.md` Tahap 1: poin 3 & 4 ditandai ✅ (status tetap 🟡 — poin 1, sambungan
  editorial lain menunggu). `fix-sitemap-lastmod.mjs` tetap dipakai (normalisasi ms dari
  format integrasi).

## 13 Nov 2026 — Pull tanggal editorial jadwal → JSON-LD: build lolos tanpa fix

- Pull **9 commit** (`d82fcbd..2a1c884`): field `pubDate`/`updatedDate` di schema `pages`
  (`b953682`), tanggal editorial di `jadwal.md` (indeks) & `jadwal-detail.md` (template
  63 route), disambungkan ke `webpageNode()` → `datePublished`/`dateModified` WebPage
  JSON-LD (`affb27b`, `976e159`); **kebijakan tanggal di-revisi** (`dca9212`): jadwal kini
  BOLEH punya tanggal editorial — indeks memakai tanggalnya sendiri, 63 route turunan
  template berbagi satu tanggal (bukan waktu perubahan data gelombang per URL).
- `npm run check` + `npm run build` **lolos pertama kali** — tanpa kegagalan, tanpa fix.
- **Verifikasi** vs baseline pre-pull `5f2c6e5` (worktree `/tmp/opencode/prepull-5f2c6e5`):
  - 63/63 route `/jadwal/`: **hanya JSON-LD berubah** — strip `<script ld+json>` →
    byte-identik; tidak ada perubahan lain di route mana pun;
  - beranda, listing, 4 detail, 404 **byte-identik**; daftar route & sitemap 69 URL sama;
  - indeks `/jadwal/` vs referensi tetap 2777/2777 (selisih kategori terdokumentasi);
  - JSON-LD: `datePublished`/`dateModified` ISO UTC **tanpa milidetik**, tanpa
    `T00:00:00Z`; indeks `08:00/08:15`, 62 route template `08:01/08:16` (berbagi tanggal
    sesuai kebijakan); semua 63 route punya tanggal; halaman non-jadwal **tidak** punya.
- **Belum**: lastmod sitemap masih seragam commit-HEAD (`2026-11-12T19:36:42Z`) — Tahap 1
  poin 3 (peta URL → lastmod per sumber) menyusul; Tahap 1 kini status 🟡.

## 13 Nov 2026 — Pull migrasi 63 route jadwal ke template blocks: build lolos tanpa fix

- Pull **7 commit** (`5f2c6e5..2f57d4b`): template `jadwal-detail.md` (blocks), refactor
  `[...path].astro` render dari blocks + penerusan props scheduler (`cf44ee3`), kebijakan
  tanggal editorial & jadwal (`8311ba6`), docs.
- `npm run check` + `npm run build` **lolos pertama kali** — tanpa kegagalan, tanpa fix.
- **Verifikasi** (baseline = worktree pre-pull `5f2c6e5` di
  `/tmp/opencode/prepull-5f2c6e5`, dibangun khusus karena referensi statis tidak memuat
  halaman detail jadwal):
  - **63/63 route `/jadwal/` byte-identik** dengan baseline pre-pull (`cmp` per file);
  - daftar seluruh route `dist/` **sama persis** (tak ada route hilang/tambah);
  - beranda, listing, 4 detail, 404 **byte-identik** vs baseline; indeks `/jadwal/` tetap
    2777/2777 vs referensi (selisih kategori terdokumentasi);
  - sitemap 69 URL, `<loc>` **sama persis** dengan baseline.
- Route `/kontak/` belum ada di kedua build (belum dimigrasi — sesuai rencana).

## 13 Nov 2026 — Pull migrasi indeks jadwal ke blocks: build lolos tanpa fix

- Pull **3 commit** (`d7d71d2..eb1bdf4`): `src/content/pages/jadwal.md` (blok konfigurasi
  halaman indeks jadwal), `src/pages/jadwal/index.astro` render dari entry `pages/jadwal`
  (−61/+36 baris), docs.
- `npm run check` + `npm run build` **lolos pertama kali** — tanpa kegagalan, tanpa fix.
- **Verifikasi**: diff `/jadwal/` vs referensi **2777 = 2777 token**, 122 baris — selisih
  persis kategori terdokumentasi lama (role nr-class/batch-title, judul section jadwal,
  selisih tanggal "Mulai N hari"); sanity beranda 3892/3892, listing IDENTIK 610, 4 detail
  tak berubah; 63 route detail bulan (`/jadwal/2026-xx/`, `/jadwal/kelas-x/…`) tetap ada;
  sitemap 69 URL + lastmod normal.
- Sisa migrasi: 63 route detail jadwal (`[...path].astro`), `/kontak/`, 404.

## 13 Nov 2026 — Pull migrasi 4 detail ke blocks: build gagal → fix frontmatter tak tertutup

- Pull **19 commit** (`4d6c4ff..257e0a3`): 4 halaman detail (`damkar-kelas-{d,c,b,a}.md`)
  dimigrasi ke Markdown blocks + block `referensi-kelas`/`other-programs` di schema,
  lalu rangkaian fix: posisi contact-band per kelas, metadata SEO diselaraskan dengan data
  program, validasi referensi kelas, docs.
- `npm run check` **gagal** di sync: `[InvalidContentEntryDataError] pages → damkar-kelas-a`
  — `type` bukan `"page"`, `slug/title/blocks` **Required** (data = `{}`).
- **Akar**: ke-4 file **tidak punya penutup `---`** (hanya 1 delimiter, pembuka) → parser
  menganggap tak ada frontmatter → data kosong. `home.md` & `layanan.md` punya 2 delimiter
  (benar).
- **Fix**: tambah `---` penutup di akhir ke-4 file (konten seluruhnya di frontmatter,
  tanpa body — pola sama dengan `layanan.md`). Validasi ulang `yaml.safe_load` → OK,
  keys lengkap (`type, slug, kelas, title, description, draft, blocks`), 3 block per file.
- **Verifikasi setelah fix**: check + build lolos (70 halaman); **4 detail vs referensi:
  token & jumlah baris diff persis sama dengan sebelum migrasi** (d 1802/32, c 1316/26,
  b 1351/30, a 1399/32 — selisih hanya kategori lama: breadcrumb #10, role nr-class &
  month-title, selisih tanggal); beranda 3892/3892 (126 baris, tak berubah); listing
  **IDENTIK 610** vs baseline; `<title>` + `meta description` ke-4 halaman **SAMA** dengan
  referensi (membuktikan fix SEO `257e0a3` dll. jalan); sitemap 69 URL + lastmod normal.

## 13 Nov 2026 — Pull migrasi listing /layanan/: build gagal → fix YAML (`layanan.md`)

- Pull **4 commit** (`3a0661c..9712b44`): frontmatter block halaman layanan (`c0370e7`),
  **listing `/layanan/` render dari Markdown blocks** (`c5aab1d`), fallback fakta gelombang
  (`59058ac`), docs (`9712b44`).
- `npm run check` **gagal** di `astro sync`: `Nested mappings are not allowed in compact
  mappings` — `src/content/pages/layanan.md` baris 5, `description:` berisi teks
  `"…Kemnaker RI: Kelas D, …"` tanpa kutip → `: ` di nilai polos dianggap nested mapping.
- **Fix (1 baris)**: bungkus nilai `description` dengan tanda kutip ganda. Cek menyeluruh
  `grep ': .*: '` di `layanan.md` & `home.md` → hanya 1 baris yang kena.
- **Verifikasi setelah fix**: check + build lolos (70 halaman); **listing `/layanan/`
  pre-migrasi (build `3a0661c`) vs migrasi blocks = IDENTIK 610 token** (baseline disimpan
  ke `/tmp/opencode/layanan-pre-migration.html` sebelum dist tertimpa — build gagal sebelumnya
  membuat dist masih berisi versi lama). Sanity: beranda 3892/3892, 4 detail & `/jadwal/`
  tidak berubah dari sesi sebelumnya, sitemap 69 URL + lastmod normal.
- Pelajaran: **simpan baseline dist SEBELUM rebuild** ketika build sebelumnya gagal — dist
  lama masih utuh dan jadi pembanding gratis.

## 13 Nov 2026 — Migrasi listing /layanan ke Markdown blocks

- Commit `c0370e7`: tambah `src/content/pages/layanan.md` dengan seluruh konten listing
  berada di frontmatter `blocks[]`: hero, wrapper `content-layout` + sidebar
  (program-grid, benefits, FAQ), dan contact-band.
- Commit `c5aab1d`: `src/pages/layanan/index.astro` mengambil entry `pages/layanan`
  dan merender `PageBlockRenderer`; header/footer, BaseLayout, preload hero, canonical,
  metadata, BreadcrumbList, ItemList program, dan FAQPage JSON-LD tetap dipertahankan.
- Commit `59058ac`: fallback fakta gelombang frontmatter tetap `57`; nilai render tetap
  dinamis dari `countBatches()` melalui `dynamic: batch-count`.
- Sumber data program tetap collection `kelas`; FAQ, benefits, hero, CTA, dan sidebar
  listing sekarang dikendalikan frontmatter. Tidak ada perubahan pada halaman beranda
  atau route detail `/layanan/<slug>/`.
- **Verifikasi runtime belum dilakukan dari sesi GitHub**: perlu `npm run check`,
  `npm run build`, dan diff DOM `/layanan/` terhadap output sebelum migrasi. Jangan
  menganggap migrasi ini lolos build sampai gerbang tersebut dijalankan.

## 13 Nov 2026 — Pull pilot migrasi beranda: build gagal → fix id collection (`slug`)

- Pull **14 commit** (`1a856f5..879d9c5`): schema halaman blocks (`2caa1a0`), **beranda
  dimigrasi ke frontmatter Markdown** (`e5abef3` dst.), fakta hero dinamis `batch-count`
  (`e88ca84`), validasi sumber fakta (`507a149`), +4 commit docs.
- `npm run check` lolos, tapi `npm run build` **gagal**: `Konten halaman beranda
  (src/content/pages/home.md) tidak ditemukan` + warn `Entry pages → home was not found`.
- **Akar masalah**: loader glob Astro (`generateIdDefault`) — *jika frontmatter punya
  `slug`, id collection = nilai `slug` itu, bukan nama file*. `home.md` berisi `slug: /`
  → id = `"/"`, sedangkan `index.astro` memanggil `getEntry('pages', 'home')`.
  Koleksi `pages` ada di store, id-inya yang beda.
- **Fix (1 baris)**: `src/content/pages/home.md` `slug: /` → `slug: home` — meniru
  konsultan-slf & confinedspace (`slug: "home"`). Tidak ada kode yang membaca
  `page.data.slug` untuk URL (slug murni menentukan id).
- **Verifikasi setelah fix**: check + build lolos (70 halaman); diff beranda vs referensi
  **3892 = 3892 token**, selisih hanya divergensi terdokumentasi (role nr-class/batch-title
  + selisih tanggal "Mulai N hari") — **migrasi Markdown→blocks nol perubahan output**;
  fakta dinamis `57` tampil benar. Diff `/jadwal/` & 4 detail tidak berubah dari sesi
  sebelumnya.

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

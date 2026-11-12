# Tahap 0 — Design Parity Blocks

> Addendum dan revisi pelaksanaan untuk `docs/RENCANA-FASE.md`, disepakati 13 Nov 2026.
> Tahap ini dikerjakan sebelum migrasi halaman ke Markdown. Semua pekerjaan langsung di
> branch `main`, dengan commit kecil dan berurutan agar mudah ditinjau atau di-revert.

## Checklist per block

Rincian source review dan status DOM/browser setiap block dicatat di
[`docs/BLOCK-PARITY-CHECKLIST.md`](./BLOCK-PARITY-CHECKLIST.md). Checklist membedakan
inspeksi source dari pembuktian hasil render; tanda source diperiksa tidak boleh dianggap
sebagai parity runtime.

## Tujuan

Membentuk katalog block yang merepresentasikan section nyata pada tiga area yang sudah
berjalan: beranda, layanan, dan jadwal. Tujuannya menjaga desain, struktur HTML, semantic
class, dan interaksi tetap tersedia ketika halaman kelak dipindahkan ke frontmatter
Markdown `blocks[]`.

Tahap ini **tidak memigrasikan halaman** dan tidak mengubah output halaman produksi.
Implementasi block harus menggunakan komponen, CSS, ikon, data, serta perilaku yang sudah
ada. Jangan membuat desain baru atau mengubah visual hanya agar cocok dengan abstraksi block.

## Prinsip implementasi

1. **Parity sebelum migrasi.** Halaman `.astro` yang sekarang tetap menjadi sumber pembanding.
   Setiap block harus menghasilkan struktur dan class yang sama dengan section asalnya.
2. **Data nyata sebagai fixture utama.** Gunakan collection `kelas`, data `faq/reasons/benefits`,
   foto, konfigurasi organisasi, dan jadwal yang benar-benar dipakai halaman saat ini.
   Data contoh hanya boleh dipakai untuk menguji variasi opsional, bukan sebagai baseline.
3. **Tidak ada pemaksaan semua UI menjadi block.** Block mewakili section konten yang dapat
   diurutkan/dikonfigurasi. Elemen layout global seperti header/footer, metadata, navigasi
   route, dan kontrol internal yang tidak berdiri sendiri tetap menjadi komponen/layout.
4. **Komponen ≠ block.** Komponen menangani markup, style hook, dan interaksi. Block adalah
   adapter/kontrak konfigurasi untuk menggunakan satu atau beberapa komponen. Markdown
   nantinya menentukan urutan dan data block.
5. **Jangan duplikasi data.** Selama migrasi belum dimulai, komponen block membaca sumber
   data yang sama dengan halaman lama. Saat frontmatter menjadi sumber konten, pindahkan data
   secara eksplisit dan pertahankan bentuk output.
6. **Jaga perilaku JavaScript.** ID, data-attribute, ARIA, event, progressive enhancement,
   keyboard interaction, dan selector CSS tidak boleh berubah tanpa alasan dan verifikasi.
7. **Class semantik dipertahankan.** Jangan menghapus atau mengganti class HTML yang dipakai
   stylesheet atau script. Elemen wrapper baru harus punya class yang jelas dan tidak
   mengubah layout.
8. **Tidak ada block yatim.** Setiap block yang didaftarkan harus punya implementasi, tipe
   konfigurasi, data nyata untuk preview, dan catatan parity.
9. **Tidak mengubah halaman produksi pada tahap katalog.** Jangan mengganti halaman lama
   dengan renderer sampai tahap migrasi halaman yang terpisah.

## Pemetaan section ke block

| Area | Section/fitur saat ini | Kandidat block | Catatan parity |
| --- | --- | --- | --- |
| Beranda | Hero + slider + CTA + facts + jadwal terdekat | `hero` | Slot media/near/facts/actions harus tetap identik; slider adalah bagian media, bukan hero terpisah di konten. |
| Beranda/Layanan | Sidebar navigasi section | `content-layout` wrapper + komponen `Sidebar` | Interaksi scrollspy, anchor, ikon, CTA, dan class tetap. Sidebar adalah bagian layout, bukan content block yang berdiri sendiri. |
| Beranda | Mengapa pelatihan penting | `reasons` | `block-intro`, `reason-list`, foto dan urutan nyata tetap. |
| Beranda/Layanan | Kartu 4 jenjang | `program-grid` | Sumber collection `kelas`, urutan D-C-B-A dan link detail tetap. |
| Beranda | Tab detail + materi | `class-tabs` | Tab ARIA, keyboard, panel, dan show-more tetap. |
| Beranda/Layanan | Keunggulan/fasilitas | `benefits` | Ikon dan data dari sumber sekarang. |
| Beranda | Galeri praktik | `gallery` | Foto/caption lokal dan lazy loading tetap. |
| Beranda/Layanan | FAQ | `faq` | Details/summary dan FAQ schema tetap. |
| Beranda/Jadwal/Layanan | Jadwal terdekat | `nearest-schedule` | Menggunakan helper jadwal sekarang; kelak adapter collection schedule. |
| Beranda/Jadwal/Layanan | Daftar jadwal dan navigasi bulan/kelas | `schedule-list` | URL bersih, status, toggle jadwal lewat, summary, GCal, WA, empty state, dan note tetap. |
| Semua halaman | CTA kontak | `contact-band` | Reuse komponen shared; bukan duplikasi markup. |
| Layanan | Hero layanan + breadcrumb + facts + CTA + foto | `hero` | Varian konfigurasi dari Hero generik; breadcrumb dan foto dikirim melalui props/slot, tanpa fork markup. |
| Layanan | Detail kelas/zigzag/materi/persyaratan | `class-detail` | Adapter sudah dipetakan dari markup route detail; pertahankan tiga zigzag, foto, MateriList, definisi, dan urutan konten. |
| Layanan | FAQ dan jenjang terkait | `faq`, `other-programs` | FAQ memakai block generik; kartu jenjang terkait memakai adapter tersendiri karena struktur `.others` berbeda dari grid program. |
| Jadwal | Hero jadwal + breadcrumb + facts + CTA | `hero` | Varian konfigurasi Hero generik; route jadwal memakai breadcrumb, facts, actions, dan foto tanpa nearest. |
| Jadwal | Scheduler | `schedule-list` | Halaman agregat, bulan, kelas, dan section kelas menggunakan props yang sesuai. |

## Struktur layout dan renderer

- `BlockRenderer.astro` hanya merender block konten.
- `PageBlockRenderer.astro` menangani wrapper halaman: `content-layout` menghasilkan
  `.container.layout` + `Sidebar` + `.content`; `content-container` menghasilkan
  `.container` tanpa sidebar.
- Header, footer, `main#konten`, meta/JSON-LD, dan navigasi global tetap menjadi tanggung
  jawab layout halaman. Jangan memasukkannya ke array content blocks.

## Urutan commit

Setiap commit hanya mengambil satu unit yang bisa ditinjau. Jangan menggabungkan beberapa
tahap jika verifikasi tahap sebelumnya belum lolos.

| Urutan | Isi commit | Gerbang |
| --- | --- | --- |
| 0.1 | Revisi dokumen rencana dan peta parity | Dokumen menyatakan batas migrasi, data fixture, dan checklist. |
| 0.2 | Kontrak block + renderer + registry awal | `npm run check` dan `npm run build`; halaman lama tidak berubah. |
| 0.3 | Adapter block hero dan CTA | Markup hero beranda/layanan/jadwal tetap identik. |
| 0.4 | Block reasons, benefits, FAQ, gallery | Urutan data, class, heading, foto, dan details tetap. |
| 0.5 | Block program-grid dan class-tabs | Link kelas, tab keyboard/ARIA, panel, materi tetap. |
| 0.6 | Block sidebar dan nearest-schedule | Anchor scrollspy dan jadwal terdekat tetap. |
| 0.7 | Block schedule-list | 63 URL, navigasi, toggle jadwal lewat, summary, GCal/WA tetap. |
| 0.8 | Block detail layanan + katalog final | Detail kelas dipetakan; seluruh block punya fixture dan checklist parity. |

## Gerbang verifikasi wajib

Untuk setiap kelompok block:

- `npm run check` berhasil.
- `npm run build` berhasil.
- Route produksi lama tetap dirender oleh halaman `.astro`, bukan renderer baru.
- Bandingkan DOM block terhadap section asal: tag, urutan, atribut, ID, class, ARIA,
  data-attribute, link, dan teks harus sama kecuali perubahan yang terdokumentasi.
- Uji interaksi yang relevan di browser: tabs (klik + ArrowLeft/ArrowRight/Home/End),
  materi show-more, sidebar scrollspy, hero slider, dan toggle jadwal lewat.
- Tidak ada selector CSS/JS yang menjadi orphan.
- Catat commit, hasil check/build, route yang diperiksa, dan setiap intentional diff di
  `docs/LOG.md`.

## Batas tahap

Selesainya Tahap 0 hanya berarti katalog dan implementasi block siap dipakai. Itu **bukan**
persetujuan untuk memigrasikan halaman. Migrasi beranda, layanan, jadwal, artikel, dan kontak
tetap mengikuti tahap masing-masing di `docs/RENCANA-FASE.md`, setelah parity block terbukti.


## Status implementasi (13 Nov 2026)

### Sudah dibuat di `main`

- Kontrak TypeScript block di `src/blocks/types.ts`.
- Registry komponen di `src/blocks/registry.ts`.
- `BlockRenderer.astro` untuk block konten dan `PageBlockRenderer.astro` untuk wrapper
  layout `.container.layout`, sidebar, dan `.container` tanpa sidebar.
- Adapter hero yang menyusun kembali komponen Hero, Breadcrumb, Nearest, HeroSlider,
  facts, actions, dan media sesuai varian halaman.
- Block reasons, benefits, FAQ, gallery, program-grid, class-tabs, nearest-schedule,
  schedule-list, contact-band, class-detail, dan other-programs.
- Komponen existing yang perlu diisi frontmatter menerima props data dengan default
  tetap memakai data produksi saat ini; pemakaian halaman `.astro` lama tidak diganti.
- Fixture nyata untuk beranda, listing layanan, indeks jadwal, dan factory fixture detail
  layanan berdasarkan entry collection `kelas`: `src/blocks/fixtures.ts`.

### Sudah diverifikasi (13 Nov 2026 — sesi runtime, commit `4713cad`)

- ✅ `npm run check` — **lolos** setelah perbaikan `src/components/modules.d.ts`
  (ambient `declare module '*.astro'`): `registry.ts` adalah file `.ts` pertama di project
  yang mengimpor `.astro`, dan `astro/client` hanya mendeklarasikan modul gambar.
  Kedua proyek referensi memakai `modules.d.ts` sendiri — damkar ikut pola yang sama.
- ✅ `npm run build` — **lolos**, 70 halaman, sitemap + lastmod normal.
- ✅ Route lama tetap dirender halaman `.astro` — diff kanonis `<main>` beranda
  (`referensi/index.html` vs `dist/index.html`): **hanya divergensi role yang disengaja**
  (`d519571`, `fbb9fb4`); 6 komponen yang dimodifikasi di pull tidak mengubah output.
  (Halaman layanan & jadwal belum di-diff pada sesi ini.)

### Hasil inspeksi source-level (13 Nov 2026)

- Membandingkan adapter dengan komponen asal untuk hero, reasons, program-grid,
  class-tabs, benefits, gallery, schedule-list, FAQ, nearest-schedule, class-detail,
  other-programs, contact-band, serta wrapper content-layout/content-container.
- Struktur komponen asal direuse; adapter tidak membuat ulang komponen interaksi inti.
- Catatan rinci per block dan route pembanding: `docs/BLOCK-PARITY-CHECKLIST.md`.
- Hasil ini hanya inspeksi source. Belum ada klaim DOM, visual, atau browser parity.

### Belum dianggap lolos

- Diff halaman layanan (listing + 4 detail) dan jadwal (`diff-jadwal.py`) terhadap build
  sebelum pull.
- DOM diff per-block terhadap section asal: tag, urutan, atribut, ID, class, ARIA,
  data-attribute, link, teks.
- Screenshot serta uji browser untuk slider, tabs/keyboard, show-more, scrollspy, dan
  toggle jadwal lewat.
- Checklist parity per block (tipe, registry entry, fixture nyata, catatan parity).
- Karena itu, katalog ini berstatus **implementasi awal — verifikasi parity sebagian
  (check/build + beranda lolos; parity visual & interaksi pending)**.
  Jangan mulai migrasi halaman sebelum gerbang verifikasi pada dokumen ini lolos.

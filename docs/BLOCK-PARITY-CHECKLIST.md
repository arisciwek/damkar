# Checklist Parity Block

> Pemeriksaan source-level: 13 Nov 2026. Dokumen ini memisahkan hasil inspeksi kode
> dari hasil render/browser. Status **source diperiksa** tidak berarti DOM atau visual
> sudah terbukti identik.

## Legenda

- [x] Source/adapter dibandingkan dengan komponen asal.
- [ ] DOM hasil render dibandingkan pada route produksi.
- [ ] Interaksi diuji di browser.
- [ ] Screenshot/visual diperiksa pada viewport desktop dan mobile.

## Matriks block

| Block | Komponen asal | Fixture/route pembanding | Source | DOM | Browser |
| --- | --- | --- | --- | --- | --- |
| `hero` | `Hero`, `Breadcrumb`, `Nearest`, `HeroSlider` | Beranda, listing layanan, detail kelas, jadwal | [x] | [ ] | [ ] |
| `reasons` | `ReasonsBlock` | Beranda + detail kelas | [x] | [ ] | [ ] |
| `program-grid` | `ProgramGrid` | Beranda + listing layanan | [x] | [ ] | [ ] |
| `class-tabs` | `DetailTabs` | Beranda | [x] | [ ] | [ ] |
| `benefits` | `BenefitsBlock` | Beranda + listing + detail kelas | [x] | [ ] | [ ] |
| `gallery` | `GalleryBlock` | Beranda | [x] | [ ] | [ ] |
| `schedule-list` | `BlockHead` + `Scheduler` | Beranda + indeks jadwal + detail kelas | [x] | [ ] | [ ] |
| `faq` | `FaqBlock` | Beranda + listing + detail kelas | [x] | [ ] | [ ] |
| `nearest-schedule` | `Nearest` | Slot hero beranda/listing/detail kelas | [x] | [ ] | [ ] |
| `class-detail` | Markup zigzag + `MateriList` | Detail kelas D/C/B/A | [x] | [ ] | [ ] |
| `other-programs` | Markup `.others` + `Icon` | Detail kelas D/C/B/A | [x] | [ ] | [ ] |
| `contact-band` | Shared `ContactBand` | Beranda + listing + detail + jadwal | [x] | [ ] | [ ] |
| `content-layout` | `.container.layout` + `Sidebar` + `.content` | Beranda + listing + detail kelas | [x] | [ ] | [ ] |
| `content-container` | `.container` | Indeks jadwal | [x] | [ ] | [ ] |

## Catatan hasil inspeksi source

1. `HeroBlock` menyusun komponen Hero dan slot media/facts/actions. Varian foto
   mendukung breadcrumb opsional, nearest opsional, dan label kelas; varian slider
   memakai `HeroSlider`.
2. `ClassDetailBlock` mempertahankan tiga artikel zigzag, urutan foto, heading,
   definisi metode/jenjang, daftar materi, dokumen, dan lokasi. Fixture detail
   memakai foto zigzag dengan pola indeks yang sama dengan route lama.
3. `OtherProgramsBlock` mempertahankan struktur `.others`, `.other`, `.prog-letter`,
   serta ikon panah.
4. `ScheduleListBlock` membungkus `BlockHead` dan `Scheduler`; props kelas, bulan,
   chips, serta ID section diteruskan ke komponen yang sama.
5. `PageBlockRenderer` mempertahankan wrapper layout sebagai struktur halaman,
   bukan mengubah sidebar menjadi block konten.
6. `BenefitsBlock`, `ReasonsBlock`, `FaqBlock`, `GalleryBlock`, `ProgramGrid`,
   `DetailTabs`, `Nearest`, dan `ContactBand` direuse dari komponen yang juga
   dipakai route produksi lama.

### Rincian source parity — hero beranda (13 Nov 2026)

- `src/pages/index.astro` → `Hero` menerima eyebrow, heading, highlight, dan lead yang
  sama persis dengan `homeBlockFixture`.
- Slot `near` → `Nearest` dengan `limit={3}`; adapter `HeroBlock` meneruskan `nearest.limit`
  dan tidak mengisi `kelas`, sehingga perilaku prop sama.
- Slot `facts` → tiga item (4 jenjang, jumlah gelombang dinamis, Kemnaker) dengan urutan
  dan label sama.
- Slot `actions` → dua tautan dengan label, href, class, target, dan rel yang sama.
- Slot `media` → `HeroSlider` pada kedua jalur.
- `HeroBlock` menggunakan komponen `Hero` yang sama. Source/props beranda **cocok**;
  ini belum dianggap DOM parity karena hasil render belum dibandingkan.

### Rincian source parity — section beranda (13 Nov 2026)

| Section asal di `index.astro` | Konfigurasi fixture | Hasil perbandingan source |
| --- | --- | --- |
| `ReasonsBlock` | `reasons` | Judul, lede, intro, item dan fallback foto memakai nilai/config yang sama. |
| `ProgramGrid` | `program-grid` | Judul dan lede fixture sama dengan default komponen; data kelas tetap diambil dari collection. |
| `DetailTabs` | `class-tabs` | Judul dan lede fixture sama dengan default komponen; collection dan script tabs tetap berasal dari komponen yang sama. |
| `BenefitsBlock` | `benefits` | Judul, lede, item dan ikon berasal dari `config/blocks` yang sama. |
| `GalleryBlock` | `gallery` | Judul, lede dan empat foto/caption sama dengan default komponen. |
| `BlockHead` + `Scheduler` dalam section `#jadwal` | `schedule-list` | ID section/heading, judul, lede, dan default Scheduler (semua kelas/bulan, chips aktif) cocok. |
| `FaqBlock` | `faq` | Judul, lede, dan empat pasangan tanya-jawab berasal dari config yang sama. |
| `ContactBand` | `contact-band` | Adapter meneruskan props opsional sebagai undefined; default ID, heading, kicker dan konten tetap dari komponen yang sama. |
| `.container.layout` + `Sidebar` + `.content` | `content-layout` | Urutan wrapper, Sidebar, link anchor, dan container konten sama. |

Kesimpulan source review beranda: konfigurasi fixture saat ini menyalin nilai yang
dipakai route lama dan adapter mereuse komponen asal. Tidak ditemukan perbedaan props
yang disengaja pada section-section di atas. Ini masih **source-level equivalence**,
bukan klaim hasil DOM browser telah dibandingkan.

## Pemeriksaan yang masih wajib

### DOM

Bandingkan HTML hasil render fixture dengan section asal untuk:
- tag dan urutan elemen;
- seluruh class, ID, atribut ARIA, dan data-attribute;
- href, target, rel, teks, serta urutan data;
- atribut gambar (src, alt, width, height, loading, decoding, fetchpriority);
- heading hierarchy dan hubungan `aria-labelledby` / `aria-controls`.

Jangan menormalisasi perbedaan yang berpotensi memengaruhi CSS, JS, aksesibilitas,
atau SEO. Jika normalisasi diperlukan, dokumentasikan alasan dan bentuknya.

### Browser

- Hero slider: autoplay, next/prev, wrap-around, `aria-hidden`.
- Tabs: klik, ArrowLeft/ArrowRight, Home/End, fokus, `aria-selected`, panel aktif.
- Materi: batas awal dan tombol show-more.
- Sidebar: anchor, scrollspy, dan active state.
- Scheduler: toggle jadwal lewat, summary, empty state, hitungan bulan, dan tautan.
- Responsive: hero, sidebar/layout, grid, gallery, dan strip bulan.

### Route minimum

- `/`
- `/layanan/`
- `/layanan/kelas-d/`
- `/layanan/kelas-c/`
- `/layanan/kelas-b/`
- `/layanan/kelas-a/`
- `/jadwal/`
- minimal satu route jadwal kelas dan satu route jadwal bulan.

**Update 13 Nov 2026 — 63 route turunan jadwal memakai template Markdown blocks**

- `src/content/pages/jadwal-detail.md` menyimpan struktur hero → content-container
  (schedule-list) → contact-band.
- `src/pages/jadwal/[...path].astro` mengisi props route-specific dan tetap memakai
  sumber jadwal/kelas serta `getStaticPaths` yang sama.
- Ini adalah migrasi konfigurasi/renderer, bukan bukti DOM parity. Kolom DOM dan Browser
  tetap belum dicentang sampai build terbaru dibandingkan dengan baseline dan interaksi
  diuji pada route kelas, bulan, serta kombinasi kelas/bulan.
- Halaman jadwal tidak menggunakan tanggal editorial (`pubDate`/`updatedDate`).

## Status

**Source-level review selesai; DOM, visual, dan interaksi belum diverifikasi.**

**Update 13 Nov (sesi kedua)**: diff DOM **route produksi** (beranda, `/jadwal/`, 4 detail,
listing `/layanan/`) terhadap referensi/pre-pull sudah lolos — semua selisih tercatat
sebagai divergensi terdokumentasi + selisih tanggal; rincian di
`docs/VERIFIKASI-DOM-ROUTE.md`. Ini belum menutup kolom DOM per block (fixture vs section
asal) maupun kolom Browser.

**Pilot migrasi beranda sudah dimulai** setelah source/props beranda diperiksa.
Konfigurasi sekarang berada di `src/content/pages/home.md` dan route `/` memakai
`PageBlockRenderer`. Ini belum membuktikan DOM parity. Check/build, diff DOM hasil
render baru vs baseline, uji browser, dan screenshot masih wajib.

Jangan migrasikan route layanan, jadwal, atau artikel sebelum verifikasi pilot beranda
lolos. Tahap 0 juga belum boleh dinyatakan selesai.

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

## Status

**Source-level review selesai; DOM, visual, dan interaksi belum diverifikasi.**

**Update 13 Nov (sesi kedua)**: diff DOM **route produksi** (beranda, `/jadwal/`, 4 detail,
listing `/layanan/`) terhadap referensi/pre-pull sudah lolos — semua selisih tercatat
sebagai divergensi terdokumentasi + selisih tanggal; rincian di
`docs/VERIFIKASI-DOM-ROUTE.md`. Ini belum menutup kolom DOM per block (fixture vs section
asal) maupun kolom Browser.

Jangan mengubah status Tahap 0 menjadi selesai dan jangan mulai migrasi halaman
berdasarkan checklist source-level ini saja.

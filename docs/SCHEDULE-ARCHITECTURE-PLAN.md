# Arsitektur Schedule Bersama — Damkar & Confined Space

> Status: **rencana yang disepakati; belum diimplementasikan**  
> Berlaku untuk: `arisciwek/damkar` dan `arisciwek/confinedspace`  
> Tujuan: satu standar data dan perilaku schedule yang dapat disinkronkan ke situs induk.

## 1. Tujuan dan prinsip

Schedule diperlakukan sebagai **entitas konten mandiri**, bukan sekadar baris pada tabel jadwal bulanan. Satu file Markdown mewakili satu penyelenggaraan pelatihan (satu angkatan/gelombang) dan memiliki URL permanen.

Entitas schedule mempunyai lifecycle:

1. Sebelum pelatihan: informasi program, tanggal, tempat, metode, biaya/kuota bila relevan, dan pendaftaran.
2. Saat pelatihan: status pelaksanaan dan informasi operasional yang relevan.
3. Setelah pelatihan: status selesai, peserta (sesuai persetujuan publikasi), nomor sertifikat (sesuai kebijakan publikasi), dokumentasi dan galeri foto.

Penambahan informasi pascapelatihan memperbarui `updatedDate` dan sitemap `lastmod`, tetapi **tidak mengubah tanggal pelaksanaan** `startDate`/`endDate`. Tanggal pelaksanaan hanya dikoreksi jika data tanggal awal memang salah, bukan karena lifecycle berubah.

Prinsip wajib:

- Satu schedule = satu Markdown = satu URL detail.
- Arsip bulanan tetap ada sebagai halaman agregasi.
- Struktur direktori dan nama field schedule konsisten di kedua repository.
- Identitas schedule stabil dan tidak diturunkan dari tanggal, judul, atau nama file.
- Identitas training adalah kunci relasi lintas situs.
- `pubDate` dan `updatedDate` adalah metadata editorial; keduanya bukan tanggal Event.
- JSON-LD Event/CourseInstance hanya menggunakan tanggal pelaksanaan untuk `startDate` dan `endDate`.
- Perubahan URL tidak perlu mempertahankan pola lama karena kedua situs belum live.

## 2. Struktur direktori standar

Gunakan nama collection/direktori plural `schedules` dan `trainings` pada kedua repository:

```text
src/content/
├── trainings/
│   ├── <training-slug-1>.md
│   └── <training-slug-2>.md
└── schedules/
    ├── 2026/
    │   ├── <training-slug-1>/
    │   │   ├── <schedule-slug-1>.md
    │   │   └── <schedule-slug-2>.md
    │   └── <training-slug-2>/
    │       └── <schedule-slug-1>.md
    └── 2027/
        └── ...
```

Aturan:

- Folder tahun memakai tahun pelaksanaan `startDate` dalam format `YYYY`.
- Folder kedua memakai `trainingSlug` yang sama dengan identitas training.
- Nama file memakai `scheduleSlug`, bukan nomor urut berbasis tanggal yang bisa berubah.
- Satu training boleh memiliki banyak schedule dalam satu tahun.
- Schedule lintas tahun masuk ke folder tahun tanggal mulainya.
- Lokasi file bukan sumber URL dan bukan identitas integrasi.
- Loader Astro harus mendukung file Markdown secara rekursif: `**/*.md`.

Contoh:

```text
src/content/schedules/2026/teknisi-k3-ruang-terbatas/november-2026-gelombang-1.md
```

## 3. Standar URL

Pola URL detail yang disepakati:

```text
/jadwal/<YYYY-MM>/<schedule-slug>/
```

Contoh:

```text
/jadwal/2026-11/november-2026-gelombang-1/
```

Pola halaman agregasi:

| Jenis | URL |
|---|---|
| Indeks seluruh jadwal | `/jadwal/` |
| Arsip bulanan | `/jadwal/2026-11/` |
| Detail satu schedule | `/jadwal/2026-11/november-2026-gelombang-1/` |
| Detail training | `/pelatihan/<training-slug>/` |
| Indeks training | `/pelatihan/` |

Ketentuan implementasi:

- Bulan URL dihitung dari `startDate` dengan timezone yang ditetapkan pada data, bukan dari tanggal build.
- `scheduleSlug` harus unik setidaknya di dalam bulan; validasi sebaiknya menolak duplikasi URL hasil gabungan bulan + slug.
- Route detail harus dibuat dari data collection melalui `getStaticPaths()`.
- Route arsip bulanan mengelompokkan schedule berdasarkan bulan `startDate`.
- Route arsip bulanan menampilkan beberapa schedule (misalnya 2, 3, atau 4) sebagai kartu/ringkasan yang masing-masing menaut ke halaman detail.
- Tidak membuat URL detail hanya dari nama training karena satu training dapat memiliki banyak penyelenggaraan dalam bulan yang sama.
- Canonical detail menunjuk ke URL detail schedule itu sendiri.

## 4. Identitas dan relasi lintas situs

### 4.1 Training

Setiap training memiliki identitas global yang stabil:

- `trainingId`: kunci integrasi lintas situs; tidak berubah ketika nama tampilan atau SEO title berubah.
- `slug`: identitas URL lokal; idealnya sama dengan `trainingId` selama belum ada alasan kuat untuk memisahkannya.
- `name`: nama resmi/tampilan training.

Contoh:

```yaml
type: training
trainingId: teknisi-k3-ruang-terbatas
slug: teknisi-k3-ruang-terbatas
name: Teknisi K3 Ruang Terbatas
```

Jika training yang sama tersedia di kedua situs, gunakan `trainingId` yang sama. Jangan menyamakan dua program hanya karena topiknya mirip. Kelas/jenjang Damkar yang berbeda harus mempunyai identitas training yang berbeda kecuali memang terbukti merupakan program yang sama secara definisi.

### 4.2 Schedule

Setiap penyelenggaraan mempunyai `scheduleId` unik global. ID tidak boleh dibuat dari tanggal atau judul karena keduanya dapat berubah. Gunakan ID stabil dengan namespace penerbit, misalnya `damkar_<ULID>` dan `confinedspace_<ULID>`, atau UUID/ULID global yang sama kuatnya. Format final dipilih saat implementasi dan divalidasi unik di masing-masing repository.

Field relasi:

- `trainingId`: mengacu ke training yang menjadi induk schedule.
- `scheduleId`: identitas satu penyelenggaraan.
- `publisherId`: identitas situs sumber, misalnya `damkar` atau `confinedspace`, agar sumber data jelas saat agregasi.

Jangan menggunakan path file, Astro entry ID, atau slug URL sebagai primary key sinkronisasi.

## 5. Kontrak frontmatter schedule bersama

Kedua repository menggunakan nama field dan tipe data yang sama. Schema dapat memberi default untuk field opsional, tetapi nama dan maknanya tidak boleh berbeda.

Contoh frontmatter acuan:

```yaml
---
type: schedule

scheduleId: damkar_01JXXXXXXXXXXXXXXX
publisherId: damkar
trainingId: kelas-d

slug: november-2026-gelombang-1
title: Jadwal Pelatihan Kelas D — November 2026
description: Informasi penyelenggaraan Pelatihan Kelas D bulan November 2026.

startDate: 2026-11-20T08:00:00+07:00
endDate: 2026-11-22T17:00:00+07:00
dateLabel: 20–22 November 2026
timezone: Asia/Jakarta

pubDate: 2026-09-01T08:00:00+07:00
updatedDate: 2026-11-25T08:00:00+07:00
draft: false

status: completed

registration:
  status: closed
  deadline: 2026-11-15T23:59:00+07:00
  capacity: 20

delivery:
  mode: offline
  attendanceMode: offline

venue:
  name: Nama tempat
  address: Alamat tempat
  city: Kota
  province: Provinsi
  countryCode: ID

completion:
  completedDate: 2026-11-22
  participants:
    - name: Nama peserta
      certificateNumber: NOMOR-SERTIFIKAT
  gallery:
    - src: /images/schedules/kelas-d/november-2026-gelombang-1/foto-01.webp
      alt: Peserta mengikuti pelatihan
      caption: Dokumentasi kegiatan pelatihan
---
```

Catatan schema:

- `startDate` dan `endDate` wajib; gunakan ISO 8601 yang konsisten dan sertakan offset untuk datetime. Bila jadwal hanya diketahui sebagai tanggal, date-only ISO `YYYY-MM-DD` boleh digunakan. Jangan mencampur format bebas.
- `dateLabel` adalah teks presentasi, bukan sumber kalkulasi tanggal.
- `pubDate` dan `updatedDate` wajib ISO 8601 dengan timezone; `updatedDate >= pubDate`.
- `updatedDate` diperbarui ketika ada perubahan konten bermakna, termasuk galeri, peserta, atau informasi sertifikat.
- `status` adalah lifecycle penyelenggaraan, bukan status pendaftaran.
- `registration.status` berdiri sendiri: `not-open`, `open`, `closed`.
- `delivery.mode` dan `delivery.attendanceMode` menggunakan enum bersama yang didefinisikan eksplisit dalam schema.
- Field yang tidak relevan untuk salah satu situs boleh opsional/null, tetapi nama dan definisinya tetap sama.
- Hindari menyimpan informasi global training berulang pada setiap schedule jika bisa direferensikan dari collection `trainings`.
- Jangan membuat field `updatedAt` atau `lastmod` terpisah; `updatedDate` adalah sumber metadata editorial dan sitemap.

## 6. Lifecycle dan status

Gunakan status lifecycle berikut pada kedua situs:

| Status | Makna | JSON-LD EventStatus |
|---|---|---|
| `scheduled` | Penyelenggaraan direncanakan | `EventScheduled` |
| `ongoing` | Pelatihan sedang berlangsung | `EventScheduled` |
| `completed` | Pelatihan selesai | `EventCompleted` |
| `postponed` | Pelatihan ditunda | `EventPostponed` |
| `cancelled` | Pelatihan dibatalkan | `EventCancelled` |

Status pendaftaran tidak mengubah status Event. Contohnya, pendaftaran yang ditutup tetap dapat mempunyai Event berstatus `EventScheduled`.

Status dapat dihitung dari waktu untuk badge UI bila sesuai, tetapi status akhir seperti `completed`, `postponed`, dan `cancelled` harus dapat dinyatakan secara eksplisit di frontmatter. Hindari status yang saling bertentangan; validasi perlu memeriksa tanggal dan status.

## 7. Data pascapelatihan: peserta, sertifikat, dan galeri

Data pascapelatihan berada pada entitas schedule yang sama, bukan dibuat menjadi halaman atau file schedule baru.

### Peserta dan sertifikat

- `completion.participants[]` berisi nama peserta dan nomor sertifikat jika memang akan dipublikasikan.
- Publikasi nama dan nomor sertifikat harus memiliki dasar persetujuan yang sesuai.
- Pertimbangkan menampilkan nomor sertifikat sebagian atau menyediakan verifikasi melalui kanal resmi; jangan menganggap semua nomor sertifikat aman untuk publik.
- Jangan menambahkan data pribadi lain yang tidak diperlukan (alamat, nomor identitas, nomor telepon, dan sebagainya).
- Data peserta kosong/tidak tersedia tidak boleh menghasilkan section kosong.

### Galeri

- Gunakan aset lokal repository, bukan hotlink.
- Rekomendasi lokasi: `public/images/schedules/<training-slug>/<schedule-slug>/`.
- Setiap foto wajib memiliki `src` dan `alt`; `caption` opsional.
- Optimalkan ukuran dan format gambar; jangan mengunggah foto mentah berukuran besar ke halaman.
- Foto peserta hanya dipublikasikan dengan memperhatikan izin dokumentasi/publikasi.

## 8. Perilaku halaman

### Indeks `/jadwal/`

- Menampilkan schedule mendatang dan/atau arsip berdasarkan desain situs.
- Schedule dikelompokkan per bulan.
- Setiap kartu menampilkan ringkasan yang cukup dan tautan detail.
- Jangan menganggap satu bulan hanya memiliki satu schedule.

### Arsip `/jadwal/YYYY-MM/`

- Menampilkan semua schedule pada bulan tersebut.
- Masing-masing schedule memiliki tautan detail sendiri.
- Tampilkan status pendaftaran/lifecycle dengan label yang tidak saling tertukar.
- Halaman bulan tetap berguna sebagai landing page agregasi, bukan pengganti halaman detail.

### Detail `/jadwal/YYYY-MM/slug/`

- Satu halaman untuk satu penyelenggaraan.
- Sebelum pelatihan: informasi program, tanggal, lokasi, metode, biaya/kuota bila relevan, persyaratan, dan CTA pendaftaran.
- Setelah pelatihan: informasi pelaksanaan selesai, peserta/sertifikat yang boleh dipublikasikan, dan galeri.
- Bagian yang belum tersedia tidak dirender sebagai placeholder kosong.
- URL, `scheduleId`, `trainingId`, `startDate`, dan `endDate` tidak berubah hanya karena konten pascapelatihan ditambahkan.

## 9. JSON-LD

Implementasi mengikuti tipe yang paling tepat untuk masing-masing program, tetapi memakai tanggal dan aturan lifecycle yang sama.

- Confined Space saat ini memakai graph `Course`, `CourseInstance`, dan `Event`; pertahankan graph yang relevan sambil menghubungkan URL detail schedule baru.
- Damkar saat ini memakai `Event`; perlu ditinjau apakah `Course`/`CourseInstance` juga relevan untuk model pelatihannya. Jangan menambah tipe hanya demi keseragaman jika tidak akurat.
- `startDate` dan `endDate` JSON-LD selalu berasal dari frontmatter `startDate`/`endDate`.
- `eventStatus` mengikuti lifecycle: completed/postponed/cancelled sesuai status; ongoing tetap `EventScheduled` karena Schema.org tidak menyediakan status ongoing khusus.
- URL Event/CourseInstance harus sama dengan canonical URL detail schedule.
- `pubDate`/`updatedDate` **tidak** boleh menggantikan `startDate`/`endDate`, dan tidak boleh dipakai untuk menggeser tanggal pelaksanaan.
- Informasi peserta, nomor sertifikat, dan galeri tidak otomatis dimasukkan ke JSON-LD Event. Tampilkan di konten halaman; hanya tambahkan structured data bila ada tipe Schema.org yang tepat dan datanya benar.
- Pastikan tidak ada duplikasi graph dengan ID berbeda untuk Event yang sama.

## 10. Sitemap dan metadata editorial

Aturan bersama:

- Detail schedule `lastmod = updatedDate`.
- Jika `updatedDate` tidak tersedia pada data lama selama migrasi, gunakan `pubDate` sebagai fallback sementara; setelah migrasi selesai keduanya wajib.
- Arsip bulanan `lastmod` = nilai maksimum `updatedDate` schedule yang tampil pada bulan tersebut, digabung dengan `updatedDate` dokumen/konfigurasi halaman arsip jika halaman itu mempunyai metadata sendiri.
- Indeks `/jadwal/` `lastmod` = nilai maksimum tanggal editorial halaman indeks dan seluruh schedule yang disajikan/dirujuk.
- Perubahan foto/peserta/sertifikat yang mengubah halaman detail harus mengubah `updatedDate`; lastmod detail dan arsip/indeks induk ikut berubah sesuai cakupan.
- Jangan memperbarui `updatedDate` hanya karena build atau deploy.
- Jangan memakai tanggal pelaksanaan sebagai sitemap `lastmod`.
- `updatedDate` tidak dimasukkan sebagai tanggal Event di JSON-LD.

## 11. Collection, validasi, dan helper

Kedua repository harus mempunyai:

1. Collection `trainings` dengan loader rekursif bila struktur folder training kelak bertingkat.
2. Collection `schedules` dengan loader `**/*.md` di `src/content/schedules`.
3. Zod schema schedule dengan field bersama.
4. Validasi relasi bahwa setiap `trainingId` menunjuk ke training yang dikenal.
5. Validasi keunikan `scheduleId`, `trainingId`, dan URL hasil generasi.
6. Validasi folder tahun cocok dengan tahun `startDate`.
7. Validasi folder training cocok dengan training slug/relasi.
8. Validasi `updatedDate >= pubDate`.
9. Validasi `endDate >= startDate`.
10. Validasi enum status, mode, dan registration.
11. Helper bersama untuk grouping schedule per bulan, status, URL, serta sitemap lastmod.
12. `getStaticPaths()` yang menghasilkan route arsip bulanan dan detail schedule.

Jangan menyalin business logic yang sama ke komponen UI. Helper data menjadi sumber tunggal untuk halaman indeks, arsip, detail, dan sitemap.

## 12. Perbedaan implementasi yang boleh dipertahankan

Keseragaman berarti kontrak data dan perilaku inti sama, bukan memaksa kedua situs mempunyai tampilan atau semua structured data identik.

Boleh berbeda:

- Desain visual, komponen, CSS, copywriting, CTA, dan informasi khusus program.
- Field tambahan khusus situs di luar kontrak bersama, dengan namespace/kelompok yang jelas dan tidak mengubah makna field standar.
- Detail JSON-LD yang sesuai jenis pelatihan, selama tanggal, URL, status, dan identitas konsisten.

Tidak boleh berbeda:

- Nama dan makna field inti schedule.
- Format identitas dan relasi training.
- Struktur folder tahun/training/schedule.
- Pola URL detail dan arsip bulanan.
- Semantik `pubDate`, `updatedDate`, `startDate`, dan `endDate`.
- Aturan lastmod dan lifecycle.
- Cara menghasilkan URL dan mengelompokkan jadwal.

## 13. Catatan kondisi awal tiap repository

### Damkar — `arisciwek/damkar`

Kondisi yang ditemukan pada `main`:

- Collection saat ini bernama `schedule`, loader hanya membaca `*.md` langsung di `src/content/schedule`.
- Schema memakai `class`, `batch`, `start`, `end`, `label`, `pubDate`, `updatedDate`, dan `draft`.
- Dokumen migrasi mencatat 57 file schedule dan keputusan bahwa tanggal editorial hanya untuk sitemap, sedangkan Event memakai tanggal pelaksanaan.
- Data kelas ada di collection `kelas` dengan key D/C/B/A.

Rencana migrasi Damkar:

1. Petakan setiap nilai `class` ke `trainingId`/training record yang stabil. Jangan menghapus informasi jenjang; pindahkan ke relasi training atau metadata training yang tepat.
2. Petakan `batch` menjadi label/nomor angkatan tanpa menjadikannya primary key.
3. Migrasikan `start`/`end` ke `startDate`/`endDate` tanpa mengubah tanggal aktual.
4. Pertahankan `label` sebagai `dateLabel` atau bentuk label tampilan yang setara.
5. Tambahkan `scheduleId`, `publisherId`, `trainingId`, `slug`, dan `description` yang diperlukan.
6. Pindahkan 57 Markdown ke `src/content/schedules/YYYY/<training-slug>/`.
7. Ubah route lama menjadi indeks, arsip bulanan, dan detail schedule dengan pola URL standar.
8. Perbarui seluruh pemakai collection: scheduler, nearest schedule, program grid, halaman kelas, helper status, JSON-LD, dan sitemap.
9. Pertahankan desain/DOM yang sudah disepakati kecuali perubahan yang memang dibutuhkan untuk tautan detail schedule.

### Confined Space — `arisciwek/confinedspace`

Kondisi yang ditemukan pada `main`:

- Collection saat ini bernama `schedule` dan README mencatat 9 angkatan 2026.
- Loader schedule dan route detail saat ini menggunakan pola flat `src/content/schedule/` dan `/jadwal/[slug]/`.
- Field tanggal yang terlihat pada halaman adalah `startDate` dan `endDate`; field lain yang dipakai route antara lain `batchNo`, `dateLabel`, `mode`, `attendanceMode`, `venue`, `virtualUrl`, `title`, `description`, `seoTitle`, `socialImage`, `canonical`, dan `noindex`.
- Detail schedule sudah membangun graph `Course`, `CourseInstance`, dan `Event`.

Rencana migrasi Confined Space:

1. Pertahankan identitas training utama Teknisi K3 Ruang Terbatas sebagai `trainingId`; bila kelak ada program berbeda (misalnya Teknisi vs Petugas), buat training record terpisah.
2. Petakan `batchNo` ke nomor/label angkatan, `dateLabel` ke `dateLabel`, `mode` dan `attendanceMode` ke kelompok `delivery` bersama.
3. Pertahankan informasi `venue` dan `virtualUrl` dengan struktur yang konsisten; data venue menjadi objek bersama.
4. Pindahkan file schedule ke `src/content/schedules/YYYY/<training-slug>/`.
5. Ubah `/jadwal/[slug]/` menjadi route detail `/jadwal/YYYY-MM/[slug]/`, dan bangun arsip bulanan.
6. Perbarui helper status, indeks jadwal, JSON-LD graph, canonical, sitemap, dan semua tautan internal.
7. Pindahkan konfigurasi konten yang benar-benar umum (misalnya HowTo/FAQ global) tetap sebagai konten program/site; jangan menggandakannya ke setiap schedule tanpa kebutuhan.

## 14. Urutan implementasi dan gerbang verifikasi

Kerjakan sebagai perubahan terencana; jangan sekaligus mengubah data, route, dan schema tanpa checkpoint.

### Tahap 0 — Audit dan baseline

- Inventarisasi semua file schedule, field aktual, pemakai collection, route, helper, JSON-LD, sitemap, dan link internal.
- Catat jumlah schedule dan nilai tanggal/ID sebelum migrasi.
- Simpan baseline hasil `npm run check` dan `npm run build`.
- Pastikan semua keputusan khusus situs terdokumentasi.

**Gerbang:** daftar pemetaan lengkap; tidak ada schedule yang tidak terpetakan.

### Tahap 1 — Schema dan identitas

- Implementasikan collection `trainings` dan `schedules` (nama plural).
- Tambahkan schema bersama dan validator relasi/keunikan.
- Tambahkan training records dan ID stabil.
- Belum mengubah URL publik/route pada tahap schema awal jika perlu adapter sementara.

**Gerbang:** seluruh konten lama dapat dipetakan; check lulus.

### Tahap 2 — Migrasi file

- Pindahkan Markdown ke struktur `schedules/YYYY/training-slug/`.
- Pertahankan konten dan tanggal pelaksanaan.
- Tambahkan field identitas dan lifecycle.
- Tambahkan contoh data completion kosong/tidak ada untuk schedule yang belum selesai.
- Tempatkan foto di direktori aset per schedule ketika tersedia.

**Gerbang:** jumlah file sebelum/sesudah sama; semua ID unik; seluruh relasi valid; tidak ada tanggal berubah tanpa alasan terdokumentasi.

### Tahap 3 — Route dan halaman

- Buat indeks `/jadwal/`, arsip `/jadwal/YYYY-MM/`, dan detail `/jadwal/YYYY-MM/slug/`.
- Tambahkan tautan detail dari seluruh kartu/baris schedule.
- Implementasikan tampilan fase pra-pelatihan dan pascapelatihan.
- Pastikan data yang kosong tidak menghasilkan section kosong.
- Perbarui breadcrumb, canonical, navigasi internal, dan related schedules.

**Gerbang:** setiap schedule punya tepat satu URL detail; seluruh tautan internal valid; jumlah halaman sesuai data; halaman bulan mengelompokkan semua schedule dengan benar.

### Tahap 4 — JSON-LD dan sitemap

- Perbarui Event/CourseInstance URL dan ID.
- Pastikan `startDate`/`endDate` hanya bersumber dari tanggal pelaksanaan.
- Pemetaan lifecycle ke `eventStatus` benar.
- Terapkan `updatedDate` untuk lastmod detail dan max(updatedDate) untuk arsip/indeks.
- Pastikan tidak ada WebPage dateModified yang keliru memakai tanggal event atau sebaliknya.

**Gerbang:** JSON-LD valid; tanggal Event tidak berubah saat completion ditambahkan; XML sitemap valid dan lastmod sesuai data.

### Tahap 5 — Uji lifecycle

Untuk satu fixture schedule, uji perubahan berurutan:

1. scheduled + registration open.
2. registration closed.
3. ongoing.
4. completed tanpa data peserta.
5. completed dengan peserta/nomor sertifikat yang disetujui.
6. completed dengan galeri foto.
7. pembaruan galeri kedua.

Pada langkah 4–7, pastikan URL, `scheduleId`, `startDate`, dan `endDate` tidak berubah. `updatedDate` dan lastmod harus berubah ketika konten bermakna diperbarui.

**Gerbang:** diff JSON-LD membuktikan tanggal Event tetap; sitemap lastmod berubah sesuai editorial update.

### Tahap 6 — Konsistensi lintas repository

- Bandingkan nama field, tipe, enum, aturan validasi, struktur folder, dan URL pada kedua repo.
- Pastikan trainingId yang merepresentasikan program sama benar-benar identik.
- Pastikan scheduleId tidak bertabrakan dan memiliki publisher yang jelas.
- Simpan fixture/schema reference yang sama atau checklist parity dalam docs kedua repo.

**Gerbang:** kedua repository lulus checklist kontrak bersama.

### Tahap 7 — Build dan review akhir

- Jalankan `npm run check` dan `npm run build` pada kedua repo.
- Uji semua route statis, canonical, breadcrumb, internal link, JSON-LD, sitemap, gambar, dan status.
- Review tampilan mobile/desktop.
- Pastikan tidak ada perubahan tidak terkait pada artikel, halaman layanan, atau desain.

**Gerbang akhir:** kedua build lulus dan hasil audit route/schema/sitemap tidak memiliki error.

## 15. Checklist penerimaan

- [ ] Kedua repo memakai `src/content/trainings/` dan `src/content/schedules/`.
- [ ] Schedule tersimpan di `<tahun>/<training-slug>/<schedule-slug>.md`.
- [ ] Loader membaca Markdown secara rekursif.
- [ ] Satu Markdown menghasilkan satu URL detail.
- [ ] URL detail mengikuti `/jadwal/YYYY-MM/<schedule-slug>/`.
- [ ] Arsip bulanan tetap mengagregasi 2, 3, 4, atau lebih schedule.
- [ ] Field frontmatter inti dan enum sama pada kedua repo.
- [ ] `trainingId` stabil dan dapat digunakan lintas situs.
- [ ] `scheduleId` unik, stabil, dan tidak berbasis tanggal/judul.
- [ ] Peserta, nomor sertifikat, dan galeri dapat ditambahkan setelah pelatihan.
- [ ] Privasi dan persetujuan publikasi peserta diperhatikan.
- [ ] `updatedDate` memperbarui sitemap `lastmod`.
- [ ] Penambahan completion tidak mengubah `startDate`/`endDate`.
- [ ] JSON-LD memakai tanggal pelaksanaan, bukan tanggal editorial.
- [ ] Lifecycle EventStatus sesuai.
- [ ] Kedua repo lulus `npm run check` dan `npm run build`.

## 16. Batas pekerjaan dokumen ini

Dokumen ini menetapkan target arsitektur dan rencana migrasi. Dokumen ini **tidak** mengubah schema, file schedule, halaman, route, JSON-LD, atau sitemap. Implementasi baru dimulai setelah audit/pemetaan rinci dan persetujuan tahap eksekusi.

---
# Addendum — Sumber Data Terpusat dan Situs Induk

> Addendum ini memperluas spesifikasi sebelumnya. Jika ada pertentangan mengenai integrasi situs utama, aturan dalam addendum ini yang berlaku. Dokumen ini tetap merupakan rencana; bukan instruksi untuk langsung mengubah kode atau konten produksi.

## 18. Satu repository sebagai sumber data kanonis

Gunakan repository khusus, misalnya arisciwek/schedule-data, sebagai single source of truth untuk data training dan schedule. Situs spesifik (Confined Space, Damkar, dan situs lain) serta situs utama membaca file Markdown yang sama.

```text
arisciwek/schedule-data/
└── src/content/
    ├── trainings/
    │   ├── teknisi-k3-ruang-terbatas.md
    │   ├── damkar-kelas-d.md
    │   └── ...
    └── schedules/
        └── 2026/
            └── teknisi-k3-ruang-terbatas/
                └── 07-11-desember-2026.md

             ┌──────────────────────┐
             │ schedule-data        │
             │ satu sumber Markdown │
             └──────────┬───────────┘
                  ┌─────┴─────┐
                  ▼           ▼
             Confined Space  Situs utama
             filter publisher agregasi semua publisher
             URL lokal        URL portal
```

Ketentuan:

- Satu penyelenggaraan hanya memiliki satu file Markdown kanonis.
- File schedule tidak boleh disalin menjadi salinan yang diedit terpisah di setiap situs.
- Data master training juga berada di repository sumber agar relasi dan identitas konsisten.
- Repository sumber mengelola data; situs konsumen mengelola route, layout, UI, SEO halaman, dan proses build/deploy.
- Repository sumber tidak memerlukan backend, database, atau API untuk kebutuhan ini.
- Perubahan data dilakukan pada repository sumber, kemudian situs konsumen memperbarui referensi commit sumber dan menjalankan build.

## 19. Struktur repository sumber

```text
schedule-data/
└── src/content/
    ├── trainings/
    │   └── <training-slug>.md
    └── schedules/
        ├── 2026/
        │   └── <training-slug>/
        │       └── <schedule-slug>.md
        └── 2027/
            └── ...
```

Folder tahun mengikuti tahun dari startDate. Folder training mengikuti identitas/slug master training. Nama file adalah slug schedule. Path file bukan primary key dan tidak menentukan URL publik.

## 20. Kontrak frontmatter dan perbedaan presentasi per situs

Nama serta makna field inti tetap sama untuk seluruh schedule. Nilai field boleh berbeda antar-schedule karena setiap penyelenggaraan memiliki fakta sendiri. Jika satu schedule memerlukan judul, deskripsi, CTA, atau URL pendaftaran yang berbeda pada tiap situs, gunakan kelompok sites opsional.

Contoh acuan:

```yaml
---
type: schedule
scheduleId: confinedspace_01JXXXXXXXXXXXXXXX
publisherId: confinedspace
trainingId: teknisi-k3-ruang-terbatas
slug: 07-11-desember-2026

title: Jadwal Teknisi K3 Ruang Terbatas
description: Informasi penyelenggaraan pelatihan Teknisi K3 Ruang Terbatas.

startDate: 2026-12-07T08:00:00+07:00
endDate: 2026-12-11T17:00:00+07:00
dateLabel: 7–11 Desember 2026
timezone: Asia/Jakarta

pubDate: 2026-10-01T08:00:00+07:00
updatedDate: 2026-11-20T08:00:00+07:00
draft: false
status: scheduled

registration:
  status: open
  deadline: 2026-12-01T23:59:00+07:00
  capacity: 20

delivery:
  mode: offline
  attendanceMode: offline

venue:
  name: Nama tempat
  address: Alamat tempat
  city: Jakarta
  province: DKI Jakarta
  countryCode: ID

sites:
  confinedspace:
    enabled: true
    title: Jadwal Pelatihan Teknisi K3 Ruang Terbatas Desember 2026
    description: Informasi jadwal dan pendaftaran pelatihan.
    ctaLabel: Daftar Pelatihan
    registrationUrl: https://confinedspace.example/daftar/

  main:
    enabled: true
    title: Jadwal Teknisi K3 Ruang Terbatas — 7–11 Desember 2026
    description: Jadwal pelatihan dari penyelenggara Confined Space.
    ctaLabel: Lihat Detail dan Pendaftaran
---
```

Aturan override:

- title dan description pada root adalah nilai default.
- sites.<siteId> hanya menyimpan perbedaan presentasi yang diperlukan situs terkait.
- Jika override tidak tersedia, situs menggunakan nilai root.
- enabled: false mengecualikan schedule dari situs tersebut tanpa menghapus record kanonis.
- publisherId adalah identitas penerbit/penyelenggara asal, bukan situs konsumen.
- sites.main mengatur presentasi di portal; key situs lain mengikuti ID situs yang ditetapkan.
- URL pendaftaran boleh spesifik situs. Jangan menebak URL dari domain atau slug.
- Fakta inti seperti tanggal, lokasi, status, kapasitas, dan identitas tidak boleh berbeda hanya karena override presentasi.
- Schema harus memvalidasi struktur sites, tipe field, dan ID situs yang diizinkan.

## 21. Identitas dan aturan distribusi

| Field | Makna |
|---|---|
| scheduleId | Identitas global satu penyelenggaraan |
| trainingId | Identitas global jenis/program pelatihan |
| publisherId | Identitas situs penerbit/penyelenggara asal |

Situs Confined Space mengambil schedule dengan publisherId confinedspace dan sites.confinedspace.enabled true. Situs Damkar menggunakan publisherId damkar dan flag situsnya. Portal mengambil seluruh schedule yang sites.main.enabled true, tanpa membatasi satu publisher.

Jangan menyamakan publisherId dengan target distribusi. Satu schedule dapat diterbitkan oleh satu situs dan didistribusikan ke beberapa situs.

## 22. URL lokal dan URL portal

Satu record sumber boleh menghasilkan URL berbeda karena setiap situs memiliki struktur navigasi sendiri.

**Situs spesifik**

Confined Space mempertahankan URL lokal yang telah digunakan, misalnya:

```text
/jadwal/07-11-desember-2026/
```

Damkar mempertahankan pola route lokal yang disepakati pada tahap implementasinya. Khusus arsip bulanan yang sudah ada, URL dan fungsinya tidak diganti oleh arsitektur portal.

**Situs utama**

Pola detail portal:

```text
/jadwal/<YYYY-MM>/<training-slug>/<schedule-slug>/
```

Contoh:

```text
/jadwal/2026-12/teknisi-k3-ruang-terbatas/07-11-desember-2026/
```

Aturan:

- Segmen YYYY-MM diturunkan dari bulan startDate menurut timezone schedule.
- Contoh tanggal 7–11 Desember 2026 masuk ke /jadwal/2026-12/, bukan /jadwal/2026-11/. Bulan November pada contoh data adalah bulan editorial, bukan bulan pelaksanaan.
- Arsip /jadwal/YYYY-MM/ tetap merupakan halaman agregasi. Pada portal, arsip menggabungkan semua training dan publisher yang aktif untuk portal.
- Setiap kartu di arsip menaut ke detail schedule.
- Detail portal memuat konteks training dan publisher serta tautan ke situs penyelenggara bila relevan.
- Slug training berasal dari master training yang stabil, bukan dari SEO title yang dapat berubah.
- Canonical detail ditentukan oleh masing-masing situs dan menunjuk ke URL detail pada domain situs itu. URL lokal dan URL portal adalah dua presentasi atas entitas data yang sama, bukan satu URL lintas-domain.

## 23. Integrasi teknis repository sumber

Rekomendasi awal adalah Git submodule pada masing-masing situs konsumen.

```text
confinedspace/
└── data/
    └── schedule-data/  # submodule

main-site/
└── data/
    └── schedule-data/  # submodule yang sama
```

Ketentuan:

- Kedua situs menunjuk ke repository sumber yang sama.
- Submodule mengunci commit tertentu agar build dapat direproduksi.
- Update data dilakukan dengan memperbarui pointer submodule pada branch situs konsumen.
- Astro membaca Markdown secara rekursif dari direktori submodule; jangan membuat salinan konten saat build.
- Schema lokal harus memvalidasi kontrak sumber. Bila kelak schema/helper dipaketkan bersama, pastikan tidak ada dua definisi yang menyimpang.
- Tidak perlu menambahkan API, backend, atau database untuk membaca file statis.
- Evaluasi mekanisme distribusi lain hanya jika submodule terbukti menghambat workflow; hindari kembali ke duplikasi manual.

## 24. Pembagian tanggung jawab

| Area | schedule-data | Situs spesifik | Situs utama |
|---|---|---|---|
| Data schedule kanonis | Pemilik | Konsumen | Konsumen |
| Master training | Pemilik | Konsumen | Konsumen |
| Identitas dan relasi | Pemilik | Validasi | Validasi |
| Override presentasi | Menyimpan | Menggunakan | Menggunakan |
| Filter publisher | — | Publisher sendiri | Gabungan |
| Route dan URL | — | Route lokal | Route portal |
| Layout, UI, CSS | — | Pemilik | Pemilik |
| Canonical dan SEO halaman | — | Pemilik | Pemilik |
| Build dan deploy | — | Pemilik | Pemilik |

## 25. Tahap implementasi tambahan untuk portal

Tahapan berikut dilakukan sebagai pekerjaan terpisah dan tidak otomatis dimulai hanya karena dokumen ini direvisi.

**Tahap A — Bentuk repository sumber**
- Buat repository arisciwek/schedule-data.
- Siapkan master trainings dan schedules dengan struktur kanonis.
- Tetapkan schema, enum, identitas, dan fixture.
- Gerbang: satu schedule contoh terbaca dari satu file dan seluruh ID/relasi valid.

**Tahap B — Integrasi satu situs spesifik**
- Hubungkan Confined Space ke repository sumber sebagai submodule.
- Filter berdasarkan publisherId dan sites.confinedspace.enabled.
- Pertahankan URL lokal yang telah ada pada tahap ini.
- Gerbang: situs membaca sumber, bukan salinan lokal; hasil build sesuai baseline.

**Tahap C — Integrasi situs utama**
- Hubungkan portal ke repository sumber yang sama.
- Filter schedule dengan sites.main.enabled.
- Bangun indeks, arsip bulanan, dan detail sesuai pola URL portal.
- Gerbang: satu perubahan pada file sumber dapat tercermin pada kedua situs setelah pointer submodule diperbarui dan build dijalankan.

**Tahap D — Konsistensi operasional**
- Uji schedule yang tampil di dua situs dengan copy berbeda.
- Uji schedule yang hanya aktif di satu situs.
- Uji perubahan tanggal, status, venue, dan registration; fakta operasional harus konsisten pada semua konsumen.
- Dokumentasikan alur update submodule dan urutan deploy.
- Gerbang: tidak ada salinan schedule yang menjadi sumber kebenaran kedua.

## 26. Penegasan khusus untuk Damkar

Perluasan ke portal tidak membatalkan atau mengganti arsip bulanan Damkar yang sudah ada.

- /jadwal/2026-11/ tetap halaman arsip bulanan Damkar.
- Halaman tersebut tetap menampilkan kumpulan schedule November 2026.
- Setiap kartu/baris schedule ditautkan ke detail schedule yang sesuai.
- Data schedule nantinya dibaca dari file kanonis di repository sumber.
- Integrasi sumber data tidak boleh menghilangkan fungsi arsip, merusak desain/DOM yang telah disepakati, atau mengubah URL arsip tanpa persetujuan terpisah.

## 27. Checklist tambahan integrasi sumber data

- [ ] Repository schedule-data menjadi satu-satunya pemilik Markdown schedule kanonis.
- [ ] Master training juga berada di repository sumber.
- [ ] Satu penyelenggaraan hanya memiliki satu file sumber.
- [ ] Kedua situs mengonsumsi repository dan commit sumber yang sama.
- [ ] Tidak ada salinan schedule yang diedit secara independen di situs konsumen.
- [ ] Field inti sama; nilai antar-schedule boleh berbeda sesuai fakta.
- [ ] Override copy/CTA per situs berada dalam kelompok sites.
- [ ] publisherId menunjukkan penerbit, bukan target distribusi.
- [ ] Situs spesifik memfilter publisher dan flag situsnya.
- [ ] Portal mengagregasi semua publisher yang diaktifkan untuk portal.
- [ ] URL portal mengikuti /jadwal/YYYY-MM/<training-slug>/<schedule-slug>/.
- [ ] Bulan URL berasal dari startDate.
- [ ] Arsip bulanan Damkar tetap ada dan tidak diganti.
- [ ] Canonical dibuat per domain situs konsumen.
- [ ] Build dapat direproduksi dari commit sumber yang terkunci.
- [ ] Perubahan satu file sumber dapat dipropagasikan ke seluruh konsumen melalui update submodule.

## 28. Batas perubahan addendum

Addendum ini hanya menetapkan arsitektur dan rencana. Ia tidak membuat repository schedule-data, tidak memindahkan file schedule, tidak menambahkan submodule, dan tidak mengubah route, JSON-LD, sitemap, atau tampilan situs. Implementasi dilakukan sebagai tahap terpisah setelah audit dan persetujuan.

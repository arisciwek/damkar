# Checklist Implementasi Schedule — Route & JSON-LD (Bagian 2)

**Status:** Rencana implementasi, belum dikerjakan  
**Tanggung jawab:** User (route & JSON-LD)  
**Berdasarkan:** `SCHEDULE-ARCHITECTURE-PLAN.md` (Tahap 3–5)

---

## Ringkasan Tahap

| Tahap | Cakupan | Target |
|---|---|---|
| **Tahap 3** | Route & halaman | `/jadwal/`, `/jadwal/YYYY-MM/`, `/jadwal/YYYY-MM/slug/` |
| **Tahap 4** | JSON-LD & sitemap | `Event` node, canonical, lastmod |
| **Tahap 5** | Uji lifecycle | 7 langkah perubahan schedule |

---

## ✅ Tahap 3 — Route & Halaman

### 3.1 Route indeks `/jadwal/`

- [ ] `src/pages/jadwal/index.astro` — pakai `getSchedules()` baru
- [ ] Tampilkan schedule mendatang (status `scheduled`, `ongoing`)
- [ ] Kelompokkan per bulan (pakai helper `getSchedulesByMonth()`)
- [ ] Setiap kartu → link ke detail `/jadwal/YYYY-MM/slug/`
- [ ] Breadcrumbs: Beranda → Jadwal
- [ ] Hero section (pakai `Hero.astro` existing)

### 3.2 Route arsip bulanan `/jadwal/[month]/`

- [ ] `src/pages/jadwal/[month].astro` (param: `month` = `YYYY-MM`)
- [ ] Ambil schedule dengan `month` = `startDate.slice(0,7)`
- [ ] Tampilkan semua schedule bulan tersebut (2, 3, 4+ kartu)
- [ ] Setiap kartu: ringkasan + link detail
- [ ] Badge status lifecycle yang jelas (Selesai / Sedang / Mulai N hari / Pendaftaran)
- [ ] Breadcrumbs: Beranda → Jadwal → Bulan

### 3.3 Route detail `/jadwal/[month]/[slug]/`

- [ ] `src/pages/jadwal/[month]/[slug].astro`
- [ ] `getStaticPaths()` dari `getSchedules()` → generate `{ month, slug }`
- [ ] Validasi `month` cocok dengan `startDate` schedule
- [ ] Layout split hero: kiri (kategori/eyebrow, H1, P1), kanan (featured image)
- [ ] Konten per fase lifecycle:
  - **Scheduled/Ongoing**: info program, tanggal, lokasi, metode, biaya/kuota, syarat, CTA daftar
  - **Completed**: info selesai, peserta/sertifikat (jika dipublikasikan), galeri
- [ ] Bagian kosong tidak dirender (conditional rendering)
- [ ] Canonical URL = URL detail ini
- [ ] Breadcrumbs: Beranda → Jadwal → Bulan → Detail

### 3.4 Integrasi ke halaman existing

- [ ] `src/pages/layanan/[slug].astro` — ganti `scheduleForSchema` pakai helper baru
- [ ] `src/components/content/Scheduler.astro` — pakai `getSchedules()` baru
- [ ] `src/pages/jadwal/[...path].astro` — deprecate/redirect ke struktur baru
- [ ] Internal links: semua tautan jadwal lama → redirect ke URL baru

**Gerbang:** Setiap schedule punya tepat 1 URL detail; semua tautan internal valid; halaman bulan mengelompokkan semua schedule dengan benar.

---

## ✅ Tahap 4 — JSON-LD & Sitemap

### 4.1 JSON-LD `Event` node di halaman detail

- [ ] `src/utils/schema.ts` — tambah fungsi `eventNode(schedule)`:
  ```typescript
  {
    '@type': 'Event',
    '@id': `${pageUrl}#event`,
    name: schedule.title,
    description: schedule.description,
    url: pageUrl,
    startDate: schedule.startDate,    // dari frontmatter
    endDate: schedule.endDate,
    eventStatus: mapStatus(schedule.status), // EventScheduled/Completed/Postponed/Cancelled
    eventAttendanceMode: schedule.delivery.attendanceMode,
    location: { '@type': 'Place', name: ..., address: ... },
    organizer: { '@id': `${origin}/#organization` },
    offers: { '@type': 'Offer', category: 'Paid', availability: ..., price: ..., priceCurrency: 'IDR', url: ... }
  }
  ```
- [ ] Inject ke `<head>` di halaman detail (`jadwal/[month]/[slug].astro`)
- [ ] **Jangan** pakai `pubDate`/`updatedDate` untuk `startDate`/`endDate`
- [ ] `ongoing` → `EventScheduled` (Schema.org tidak punya Ongoing)

### 4.2 JSON-LD `CourseInstance` di halaman layanan (existing)

- [ ] Update `courseNode()` pakai field baru (`startDate`, `endDate`)
- [ ] Filter `CourseInstance` hanya yang `startDate > today` (sudah ada)
- [ ] URL `CourseInstance` = `#jadwal` anchor di halaman layanan (tetap)

### 4.3 JSON-LD `Course` (training master)

- [ ] Halaman `/layanan/[slug]/` — `Course` node dengan `hasCourseInstance` ke instance mendatang
- [ ] `trainingId` sebagai `@id` stabil

### 4.4 Sitemap `lastmod`

- [ ] Detail schedule: `lastmod = updatedDate`
- [ ] Arsip bulanan: `lastmod = max(updatedDate schedule di bulan) + updatedDate halaman arsip`
- [ ] Indeks `/jadwal/`: `lastmod = max(updatedDate semua schedule + updatedDate halaman indeks)`
- [ ] Pastikan `astro.config.mjs` resolver `lastmod` pakai `updatedDate` dari frontmatter

### 4.5 Validasi tanggal

- [ ] Tanggal Event (`startDate`/`endDate`) **tidak berubah** saat completion ditambahkan
- [ ] `updatedDate` berubah saat konten bermakna diperbarui → lastmod ikut berubah
- [ ] Tidak ada `WebPage.dateModified` yang pakai tanggal Event

**Gerbang:** JSON-LD valid (test di Rich Results Test); tanggal Event tidak berubah saat completion ditambahkan; XML sitemap valid & lastmod sesuai data editorial.

---

## ✅ Tahap 5 — Uji Lifecycle (1 fixture schedule)

Ambil 1 schedule (misal Kelas D November 2026), uji berurutan:

| Langkah | Kondisi | Verifikasi |
|---|---|---|
| 1 | `status: scheduled`, `registration.status: open` | URL, `scheduleId`, `startDate`, `endDate` tetap; JSON-LD `EventScheduled`; lastmod = `pubDate` |
| 2 | `registration.status: closed` | URL/ID/tanggal tetap; lastmod = `updatedDate` (berubah) |
| 3 | `status: ongoing` | JSON-LD `EventScheduled`; lastmod berubah |
| 4 | `status: completed`, `completion: {}` | JSON-LD `EventCompleted`; lastmod berubah; **tanggal Event tidak berubah** |
| 5 | `completion.participants` + `certificateNumber` | lastmod berubah; URL/ID/tanggal tetap |
| 6 | `completion.gallery` + foto | lastmod berubah; galeri tampil di halaman detail |
| 7 | Update galeri kedua | lastmod berubah lagi; URL/ID/tanggal tetap |

**Gerbang:** Diff JSON-LD membuktikan tanggal Event (`startDate`/`endDate`) stabil; sitemap `lastmod` berubah sesuai editorial update.

---

## File Terkait yang Perlu Diubah (Route & JSON-LD)

| File | Perubahan |
|---|---|
| `src/pages/jadwal/index.astro` | Pakai helper baru, grup per bulan |
| `src/pages/jadwal/[month].astro` | **Baru**: halaman arsip bulanan |
| `src/pages/jadwal/[month]/[slug].astro` | **Baru**: halaman detail schedule |
| `src/pages/jadwal/[...path].astro` | Deprecate / redirect |
| `src/pages/layanan/[slug].astro` | Update `scheduleForSchema` pakai helper baru |
| `src/components/content/Scheduler.astro` | Pakai `getSchedules()` baru |
| `src/utils/schema.ts` | Tambah `eventNode()`, update `courseNode()` |
| `astro.config.mjs` | Pastikan sitemap `lastmod` resolver pakai `updatedDate` |

---

## Checklist Penerimaan (Route & JSON-LD)

- [ ] `/jadwal/` menampilkan schedule grup per bulan, link detail valid
- [ ] `/jadwal/YYYY-MM/` menampilkan semua schedule bulan tersebut
- [ ] `/jadwal/YYYY-MM/slug/` detail lengkap per fase lifecycle
- [ ] Setiap schedule punya **tepat 1** URL detail kanonikal
- [ ] Semua tautan internal dari kartu/baris jadwal → URL detail baru
- [ ] JSON-LD `Event` di halaman detail valid & pakai tanggal pelaksanaan
- [ ] JSON-LD `CourseInstance` di layanan pakai field baru
- [ ] `lastmod` detail = `updatedDate`; arsip/indeks = max `updatedDate`
- [ ] Tanggal Event **tidak berubah** saat completion/galeri ditambah
- [ ] `npm run check` & `npm run build` lulus
- [ ] Rich Results Test lulus untuk halaman detail & layanan

---

## Dependensi ke Bagian 1 (Schema & Field)

| Butuh dari Bagian 1 | Digunakan di |
|---|---|
| Collection `schedules` + loader `**/*.md` | `getStaticPaths()`, `getSchedules()` |
| Field `slug`, `title`, `description`, `startDate`, `endDate` | Route params, JSON-LD, tampilan |
| Field `trainingId`, `delivery`, `venue`, `registration` | JSON-LD `Event`, `CourseInstance`, detail page |
| Field `status`, `completion` | Lifecycle badge, JSON-LD `eventStatus` |
| Helper `getSchedules()`, `getSchedulesByMonth()`, `getScheduleBySlug()` | Semua route & komponen |

---

## Catatan Implementasi

- **Route baru dulu**, baru deprecate `[...path]` lama (hindari 404 saat transisi)
- **Canonical** di detail = URL detail itu sendiri (bukan URL lama)
- **Redirect** URL lama (`/jadwal/...` pattern lama) → URL baru via middleware atau halaman 404 dengan link
- **Breadcrumbs** konsisten di semua halaman jadwal
- **Responsive**: kartu arsip 2/3/4 kolom tergantung lebar (CSS existing)
- **Accessibility**: badge status pakai `aria-label`, link detail pakai teks deskriptif
# Checklist Implementasi Schedule — Schema & Field (Bagian 1)

**Status:** Rencana implementasi, belum dikerjakan  
**Tanggung jawab:** Agent (schema & field)  
**Berdasarkan:** `SCHEDULE-ARCHITECTURE-PLAN.md` (Tahap 0–2)

---

## Ringkasan Tahap

| Tahap | Cakupan | Target |
|---|---|---|
| **Tahap 0** | Audit & baseline | Daftar pemetaan lengkap 57 schedule |
| **Tahap 1** | Schema & identitas | Collection `trainings` & `schedules` + validator |
| **Tahap 2** | Migrasi file | 57 file ke struktur baru + field identitas |

---

## ✅ Tahap 0 — Audit & Baseline

- [ ] Inventarisasi 57 file schedule: field aktual, `class`, `batch`, `startDate`, `endDate`, `label`, `pubDate`, `updatedDate`
- [ ] Inventarisasi pemakai collection: `getBatches()`, `Scheduler.astro`, `schema.ts`, halaman `jadwal/`, `layanan/`
- [ ] Inventarisasi route: `/jadwal/`, `/jadwal/[...path]/`, `/layanan/[slug]/`
- [ ] Inventarisasi JSON-LD: `Course` + `CourseInstance` (hanya mendatang)
- [ ] Simpan baseline `npm run check` & `npm run build` (md5 `dist/*.html`)
- [ ] Catat mapping `class` (D/C/B/A) → `trainingId` stabil

**Gerbang:** Daftar pemetaan lengkap; tidak ada schedule yang tidak terpetakan.

---

## ✅ Tahap 1 — Schema & Identitas

### 1.1 Buat collection `trainings` (plural)

- [ ] `src/content/trainings/` — 4 file: `kelas-d.md`, `kelas-c.md`, `kelas-b.md`, `kelas-a.md`
- [ ] Field wajib: `trainingId`, `slug`, `name`, `role`, `desc`, `mode`, `courseMode`, `education`, `requirement`, `materi[]`, `order`
- [ ] Loader rekursif: `glob({ pattern: '**/*.md', base: './src/content/trainings' })`

### 1.2 Buat collection `schedules` (plural) baru

- [ ] Ganti collection lama `schedule` → `schedules`
- [ ] Loader rekursif: `glob({ pattern: '**/*.md', base: './src/content/schedules' })`
- [ ] Schema field wajib (kontrak bersama):

```yaml
type: "schedule" (literal)
scheduleId: string (ULID dengan prefix publisher, e.g., "damkar_01J...")
publisherId: "damkar" (literal)
trainingId: string (ref ke trainings.trainingId)

slug: string (URL slug, unik dalam bulan)
title: string (judul tampilan)
description: string (deskripsi singkat)

startDate: string (ISO 8601 datetime dengan offset, atau date-only YYYY-MM-DD)
endDate: string (ISO 8601)
dateLabel: string (label presentasi, e.g., "20–22 November 2026")
timezone: string (default "Asia/Jakarta")

pubDate: UTC datetime (wajib, ISO 8601 tanpa milidetik)
updatedDate: UTC datetime (wajib, >= pubDate)
draft: boolean (default false)

status: enum [scheduled, ongoing, completed, postponed, cancelled]

registration:
  status: enum [not-open, open, closed]
  deadline?: UTC datetime
  capacity?: number

delivery:
  mode: enum [offline, online, blended]
  attendanceMode: enum [offline, online, mixed]

venue: object? (name, address, city, province, countryCode)

completion: object? (completedDate, participants[], gallery[])
```

### 1.3 Validator relasi & keunikan

- [ ] Validasi `trainingId` menunjuk ke `trainings` yang dikenal
- [ ] Validasi `scheduleId` unik global (prefix `damkar_` + ULID)
- [ ] Validasi `slug` unik dalam bulan `startDate` (bukan global unik)
- [ ] Validasi folder tahun cocok dengan tahun `startDate`
- [ ] Validasi folder training cocok dengan `trainingId`
- [ ] Validasi `updatedDate >= pubDate`
- [ ] Validasi `endDate >= startDate`
- [ ] Validasi enum status, mode, attendanceMode, registration

### 1.4 Helper bersama (data layer)

- [ ] `getSchedules()` — semua schedule, sorted by `startDate` + `trainingId`
- [ ] `getSchedulesByMonth()` — grouping per `YYYY-MM`
- [ ] `getSchedulesByTraining()` — grouping per `trainingId`
- [ ] `getScheduleBySlug(month, slug)` — lookup detail
- [ ] `computeStatus(startDate, endDate, statusOverride?)` — status lifecycle
- [ ] `getSitemapLastmod(schedules)` — max `updatedDate` per scope

**Gerbang:** Seluruh konten lama dapat dipetakan ke schema baru; `npm run check` lulus.

---

## ✅ Tahap 2 — Migrasi File (57 file)

### 2.1 Petakan `class` + `batch` → `trainingId` + `scheduleId` + `slug`

| class | batch | trainingId (baru) | scheduleId (contoh) | slug (contoh) |
|---|---|---|---|---|
| D | "01" | kelas-d | damkar_01J... | november-2026-gelombang-1 |
| A | "11" | kelas-a | damkar_01J... | november-2026-gelombang-11 |

- [ ] Buat mapping lengkap 57 baris (simpan di `docs/SCHEDULE-MAPPING.csv` atau serupa)

### 2.2 Pindahkan file ke struktur baru

```
src/content/schedules/
├── 2026/
│   ├── kelas-d/
│   │   ├── november-2026-gelombang-1.md
│   │   ├── november-2026-gelombang-2.md
│   │   └── ...
│   ├── kelas-c/
│   ├── kelas-b/
│   └── kelas-a/
```

- [ ] Buat direktori `src/content/schedules/2026/kelas-{d,c,b,a}/`
- [ ] Untuk setiap 57 file lama:
  - [ ] Baca field lama
  - [ ] Generate `scheduleId` (ULID dengan prefix `damkar_`)
  - [ ] Generate `slug` dari `label` + `batch` (format: `bulan-tahun-gelombang-N`)
  - [ ] Tulis frontmatter baru dengan field kontrak bersama
  - [ ] Simpan ke path baru
- [ ] Hapus direktori lama `src/content/schedule/` setelah verifikasi

### 2.3 Isi field tambahan

- [ ] `title`: "Jadwal Pelatihan Kelas D — November 2026"
- [ ] `description`: "Informasi penyelenggaraan Pelatihan Kelas D bulan November 2026."
- [ ] `timezone`: "Asia/Jakarta"
- [ ] `status`: hitung dari tanggal (scheduled/ongoing/completed)
- [ ] `registration`: default `status: "open"`, `deadline: startDate - 7 hari`, `capacity: 20`
- [ ] `delivery`: default `mode: "offline"`, `attendanceMode: "offline"`
- [ ] `venue`: default tempat training (bisa dari config site)
- [ ] `completion`: kosong `{}` untuk schedule yang belum selesai

### 2.4 Verifikasi migrasi

- [ ] Jumlah file sebelum = sesudah (57)
- [ ] Semua `scheduleId` unik
- [ ] Semua `trainingId` valid (ada di `trainings`)
- [ ] Semua `slug` unik dalam bulan
- [ ] Tanggal pelaksanaan (`startDate`/`endDate`) tidak berubah
- [ ] `npm run check` lulus
- [ ] `npm run build` lulus

**Gerbang:** Jumlah file sama; ID unik; relasi valid; tanggal tidak berubah tanpa alasan terdokumentasi.

---

## File Terkait yang Perlu Diubah (Schema & Field)

| File | Perubahan |
|---|---|
| `src/content.config.ts` | Tambah collection `trainings` & `schedules`; hapus `schedule` lama |
| `src/content/trainings/*.md` | Baru: 4 file training master |
| `src/content/schedules/2026/kelas-*/*.md` | Baru: 57 file schedule (migrasi dari `schedule/`) |
| `src/utils/schedule.ts` | Update interface `Batch` pakai field baru; helper baru |
| `src/utils/schema.ts` | Update `KelasSchemaInput` → pakai field baru |
| `docs/SCHEDULE-MAPPING.csv` | Baru: mapping 57 schedule lama → baru |

---

## Checklist Penerimaan (Schema & Field)

- [ ] Collection `trainings` dan `schedules` (plural) aktif
- [ ] Loader rekursif `**/*.md` berfungsi
- [ ] Schema kontrak bersama lengkap & divalidasi
- [ ] 4 training records di `trainings/` dengan ID stabil
- [ ] 57 schedule di `schedules/2026/kelas-*/` dengan field lengkap
- [ ] `scheduleId` unik, `trainingId` valid, `slug` unik per bulan
- [ ] `npm run check` lulus (Zod + validator editorial dates)
- [ ] `npm run build` lulus
- [ ] Baseline HTML tidak berubah tak terduga (hanya field internal)

---

## Catatan Implementasi

- **Jangan** mengubah route/URL pada tahap ini — gunakan adapter sementara di `schedule.ts` jika perlu
- **Jangan** menghapus collection `schedule` lama sebelum `schedules` baru terverifikasi
- **Pastikan** `pubDate`/`updatedDate` format UTC ketat (ISO 8601 tanpa milidetik)
- **Gunakan** ULID untuk `scheduleId` (`01JXXXXXXXXXXXXXXX` 26 char)
- **Simpan** mapping lama↔baru untuk rollback & audit lintas repo
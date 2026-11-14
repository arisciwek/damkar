# Checklist Implementasi Schedule — Schema & Field (Bagian 1)

**Status:** ✅ Tahap 0–2 selesai (commit `5d09181`, `df605c1`)  
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

- [x] Inventarisasi 57 file schedule: field aktual, `class`, `batch`, `startDate`, `endDate`, `label`, `pubDate`, `updatedDate`
- [x] Inventarisasi pemakai collection: `getBatches()`, `Scheduler.astro`, `schema.ts`, halaman `jadwal/`, `layanan/`
- [x] Inventarisasi route: `/jadwal/`, `/jadwal/[...path]/`, `/layanan/[slug]/`
- [x] Inventarisasi JSON-LD: `Course` + `CourseInstance` (hanya mendatang)
- [x] Simpan baseline `npm run check` & `npm run build` (md5 `dist/*.html`)
- [x] Catat mapping `class` (D/C/B/A) → `trainingId` stabil

**Gerbang:** Daftar pemetaan lengkap; tidak ada schedule yang tidak terpetakan.

---

## ✅ Tahap 1 — Schema & Identitas

### 1.1 Buat collection `trainings` (plural)

- [x] `src/content/trainings/` — 4 file: `damkar-kelas-d.md`, `damkar-kelas-c.md`, `damkar-kelas-b.md`, `damkar-kelas-a.md`
- [x] Field wajib: `trainingId`, `slug`, `name`, `role`, `desc`, `mode`, `courseMode`, `education`, `requirement`, `materi[]`, `order`
- [x] Loader rekursif: `glob({ pattern: '**/*.md', base: './src/content/trainings' })`

### 1.2 Buat collection `schedules` (plural) baru

- [x] Ganti collection lama `schedule` → `schedules`
- [x] Loader rekursif: `glob({ pattern: '**/*.md', base: './src/content/schedules' })`
- [x] Schema field wajib (kontrak bersama):

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

> Status: sebagian. `superRefine` Zod sudah menangani tanggal; validasi relasi
> dan keunikan baru dijalankan sekali oleh script migrasi (belum permanen).

- [ ] Validasi `trainingId` menunjuk ke `trainings` yang dikenal
- [ ] Validasi `scheduleId` unik global (prefix `damkar_` + ULID)
- [ ] Validasi `slug` unik dalam bulan `startDate` (bukan global unik)
- [ ] Validasi folder tahun cocok dengan tahun `startDate`
- [ ] Validasi folder training cocok dengan `trainingId`
- [x] Validasi `updatedDate >= pubDate` (Zod `superRefine`)
- [x] Validasi `endDate >= startDate` (Zod `superRefine`)
- [x] Validasi enum status, mode, attendanceMode, registration (Zod)

### 1.4 Helper bersama (data layer)

> Status: ditunda ke Tahap 3 (bagian route). Bentuk `Batch` lama sengaja
> dipertahankan lewat adapter agar output HTML tidak berubah; helper baru
> dibuat setelah konsumen route baru diketahui.

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

- [x] Buat mapping lengkap 57 baris (simpan di `docs/SCHEDULE-MAPPING.csv` atau serupa)

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

- [x] Buat direktori `src/content/schedules/2026/kelas-{d,c,b,a}/`
- [x] Untuk setiap 57 file lama:
  - [x] Baca field lama
  - [x] Generate `scheduleId` (ULID dengan prefix `damkar_`)
  - [x] Generate `slug` dari `label` + `batch` (format: `bulan-tahun-gelombang-N`)
  - [x] Tulis frontmatter baru dengan field kontrak bersama
  - [x] Simpan ke path baru
- [x] Hapus direktori lama `src/content/schedule/` setelah verifikasi

### 2.3 Isi field tambahan

- [x] `title`: "Jadwal Pelatihan Kelas D — November 2026"
- [x] `description`: "Informasi penyelenggaraan Pelatihan Kelas D bulan November 2026."
- [x] `timezone`: "Asia/Jakarta"
- [x] `status`: hitung dari tanggal (scheduled/ongoing/completed)
- [x] `registration`: default `status: "open"`, `deadline: startDate - 7 hari`, `capacity: 20`
- [x] `delivery`: default `mode: "offline"`, `attendanceMode: "offline"`
- [ ] `venue`: sengaja DIBIARKAN KOSONG — halaman FAQ menyatakan lokasi menyesuaikan penyelenggara, jadi tidak boleh mengarang venue
- [x] `completion`: tidak ditambahkan (belum ada data pascapelatihan nyata; section kosong tidak boleh dirender — domain Tahap 3)

### 2.4 Verifikasi migrasi

- [x] Jumlah file sebelum = sesudah (57)
- [x] Semua `scheduleId` unik
- [x] Semua `trainingId` valid (ada di `trainings`)
- [x] Semua `slug` unik dalam bulan
- [x] Tanggal pelaksanaan (`startDate`/`endDate`) tidak berubah
- [x] `npm run check` lulus
- [x] `npm run build` lulus

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

- [x] Collection `trainings` dan `schedules` (plural) aktif
- [x] Loader rekursif `**/*.md` berfungsi
- [x] Schema kontrak bersama lengkap & divalidasi
- [x] 4 training records di `trainings/` dengan ID stabil
- [x] 57 schedule di `schedules/2026/kelas-*/` dengan field lengkap
- [x] `scheduleId` unik, `trainingId` valid, `slug` unik per bulan
- [x] `npm run check` lulus (Zod + validator editorial dates)
- [x] `npm run build` lulus
- [x] Baseline HTML tidak berubah tak terduga (hanya field internal)

---

## Catatan Implementasi

- **Jangan** mengubah route/URL pada tahap ini — gunakan adapter sementara di `schedule.ts` jika perlu
- **Jangan** menghapus collection `schedule` lama sebelum `schedules` baru terverifikasi
- **Pastikan** `pubDate`/`updatedDate` format UTC ketat (ISO 8601 tanpa milidetik)
- **Gunakan** ULID untuk `scheduleId` (`01JXXXXXXXXXXXXXXX` 26 char)
- **Simpan** mapping lama↔baru untuk rollback & audit lintas repo
---

## Hasil Implementasi (14 Nov 2026)

### Yang selesai

| Tahap | Commit | Hasil |
|---|---|---|
| Rename field | `5653eb8` | `start`/`end` → `startDate`/`endDate` (57 file + konsumen) |
| Trainings | `5d09181` | `kelas` → `trainings`; `trainingId` = `kelas-{a..d}`, `slug` = `damkar-kelas-{a..d}` |
| Schedules | `df605c1` | Collection `schedules` rekursif; 57 file ke `schedules/2026/kelas-*/`; mapping CSV |

### Keputusan implementasi

1. **Slug schedule** = `<bulan>-<tahun>-kelas-<x>-gelombang-<nn>` (mis. `november-2026-kelas-a-gelombang-11`).
   Alasan: harus unik **per bulan lintas kelas** (arsip Damkar menggabungkan semua kelas), dan tidak berbasis path file/tanggal.
2. **`batchNo`** dipertahankan sebagai metadata nomor gelombang (bukan primary key).
3. **`status`** hanya menyimpan keadaan terminal (`completed`) atau `scheduled`.
   Badge UI (Pendaftaran dibuka / Mulai N hari / Sedang berlangsung / Selesai) tetap **dihitung dari tanggal** di `utils/schedule.ts`, sesuai AGENTS.md kebijakan tanggal.
4. **`venue` kosong** — tidak ada data lokasi tetap; FAQ resmi menyatakan lokasi menyesuaikan penyelenggara.
5. **`registration`** default: `open` + `deadline = startDate − 7 hari` untuk status `scheduled`; `closed` untuk `completed`.
6. **`delivery`** default: `offline`/`offline`.
7. **Adapter** `utils/schedule.ts` memetakan field baru ke bentuk `Batch` lama sehingga route, komponen, dan **HTML identik** dengan baseline (83 file, md5 sama).

### Utang teknis / belum selesai

- [ ] Validator unik lintas entri (`scheduleId`, `slug` per bulan, `trainingId` valid) baru dijalankan di script migrasi sekali jalan — belum menjadi validator permanen di `npm run check`. Perlu ditambahkan sebagai script validasi (mis. `scripts/validate-schedules.mjs`).
- [ ] Validasi folder tahun/training cocok dengan `startDate`/`trainingId` belum permanen.
- [ ] Helper baru (`getSchedulesByMonth`, `getScheduleBySlug`, `getSitemapLastmod`) belum dibuat — menunggu Tahap 3 (bagian route) agar bentuk data final diketahui.
- [ ] Data pascapelatihan (`completion`) belum ada; menunggu foto/peserta nyata.
- [ ] Rename collection `trainings` belum menyentuh `entry.id`; URL `/layanan/<slug>/` tetap. Jika kelak `slug` dipisah dari id file, route harus ikut diubah.

### Verifikasi

- `npm run check` lulus (77 entri editorial).
- `npm run build` lulus (83 halaman).
- md5 seluruh `dist/**/*.html` **identik** dengan baseline sebelum migrasi.

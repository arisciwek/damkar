# AGENTS.md — Aturan Kerja Repo ini

## Kebijakan tanggal (keputusan 13 Nov 2026)

Dua hal ini terpisah. Jangan dicampur.

**1. `pubDate` + `updatedDate` → data entri → sitemap `<lastmod>`.**

- WAJIB ada di **setiap** node: setiap page (`src/content/pages/`: home, layanan,
  4 detail, jadwal, template, artikel nanti), setiap content, setiap schedule
  (`src/content/schedule/`), dan setiap koleksi baru berikutnya.
- Fungsinya **hanya** itu: "kapan entri ini dipublikasikan" (`pubDate`) dan
  "kapan terakhir datanya berubah" (`updatedDate`) → sitemap `<lastmod>`.
  Karena itu data boleh diedit kapan pun — termasuk setelah tanggal pelaksanaan
  lewat (mis. menambah galeri peserta) — dan `updatedDate` ikut diperbarui.
- Format wajib: **ISO 8601 UTC tanpa milidetik**, `YYYY-MM-DDTHH:MM:SSZ`
  (contoh `2026-11-12T18:30:35Z`), unik sampai detik dalam satu hari,
  `updatedDate` ≥ `pubDate`, tidak boleh di masa depan.
- Tanggal per file: `pubDate` = waktu entri benar-benar dipublikasikan (riwayat
  nyata), `updatedDate` = waktu perubahan data yang terakhir kali dilakukan.

**2. `start` + `end` (schedule) → tanggal pelaksanaan → JSON-LD Event.**

- Field `start`/`end` di `src/content/schedule/` adalah tanggal pelaksanaan
  pelatihan. Dipakai untuk: tampilan jadwal, status (Selesai/Mulai N hari lagi),
  dan JSON-LD `Event` (`startDate`/`endDate`) / `CourseInstance`.
- **Tidak** dipakai untuk `<lastmod>` sitemap. Jangan membalik dua hal ini.

**Validator** — aturan di atas dijalankan otomatis, jangan ditawar:

- `npm run check` menjalankan `scripts/validate-editorial-dates.mjs`:
  setiap entri wajib `pubDate` + `updatedDate` format UTC ketat; gagal = build gagal.
- Zod schema (`src/content.config.ts`): `pubDate`/`updatedDate` wajib pada
  collection `pages` dan `schedule` (tanpa `.optional()`).
- `astro.config.mjs` membaca `updatedDate`/`pubDate` frontmatter untuk
  `<lastmod>` per-URL. Jangan ubah resolver tanpa membaca kebijakan lastmod di
  `docs/RENCANA-FASE.md`.

## Aturan kerja

- **Jangan mengubah data sebelum paham.** Audit dulu, laporkan temuan, tunggu
  instruksi — baru menyentuh konten/frontmatter.
- **Satu commit per unit**, pesan menjelaskan apa & kenapa; langsung push ke
  `origin/main` (repo ini satu-satunya jalur kerja — jangan branch diam-diam).
- Tiap perubahan halaman: **verifikasi output vs referensi**
  (`/tmp/opencode/diff-full.py`, `diff-jadwal-full.py`) dan jaga gerbang
  "nol perubahan tak terduga" (md5 seluruh `dist/*.html` sebelum/sesudah).
- Siklus: user `git pull` → `npm run check && npm run build` → agent fix +
  verifikasi + push. Simpan baseline `dist/` sebelum rebuild.
- Konten = Markdown + `blocks[]` (pola konsultan-slf). Tanpa Tailwind, tanpa
  MDX. Visual mengikuti `referensi/assets/css/style.css` apa adanya.
- Dokumentasi keputusan/fase/temuan: `docs/RENCANA-FASE.md` + `docs/LOG.md`
  (entri LOG terbaru di atas).

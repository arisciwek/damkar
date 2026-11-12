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


## Konvensi artikel (wajib)

- `description` adalah **meta description ringkas** untuk `<meta name="description">`,
  Open Graph, dan kartu artikel. Tulis ringkas, spesifik, menjelaskan topik/benefit,
  dan relevan dengan intent pencarian. Jangan memaksakan kalimat pembuka artikel
  yang panjang ke field ini. Panjang SERP bukan batas karakter yang dijamin Google.
- Paragraf pembuka lengkap berada di `blocks[]`, sebagai `type: p` pertama
  pada section pertama. Paragraf ini harus menjelaskan topik secara utuh dan natural,
  bukan sekadar mengulang meta description. Keduanya saling mendukung, tetapi
  **tidak wajib identik**.
- Jangan membuat field `intro` metadata tambahan untuk menduplikasi paragraf pertama.
  Isi artikel tetap berada di `blocks[]`; `description` khusus metadata/kartu.
- Google dapat memilih snippet dari isi halaman sesuai kueri; meta description
  bukan instruksi agar Google selalu menampilkan teks itu. Tulis paragraf pembuka
  yang berdiri sendiri dan informatif.
- Artikel wajib frontmatter-only: tepat satu delimiter pembuka `---` dan satu
  delimiter penutup `---`; tidak boleh ada body Markdown setelah delimiter penutup.
  Pastikan delimiter penutup tetap ada setelah mengedit YAML.
- Quote string YAML yang berpotensi ditafsirkan sebagai sintaks YAML (terutama
  `description` dengan tanda baca seperti `: `, kutip, atau karakter khusus).
  Setelah menulis artikel, validasi parse frontmatter melalui `npm run check`.
- Saat mengubah `.astro`, periksa pasangan backtick, kurung, kurawal, dan array
  pada ekspresi JSX/Astro, terutama `class:list` dan template literal. Jangan
  menganggap edit satu karakter aman tanpa `npm run check` + `npm run build`.
- Jangan menyamakan perubahan teks dengan sekadar edit metadata: periksa halaman
  detail, kartu/listing yang memakai `description`, JSON-LD, OG, serta sitemap
  `lastmod`. Perbarui `updatedDate` hanya jika data entri memang berubah.

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

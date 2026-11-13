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

- **Keputusan 13 Nov 2026**: `description` = **paragraf pertama artikel** — item
  `type: p` pertama pada section pertama `blocks[]`, disalin persis ke frontmatter.
  Satu teks yang sama dipakai untuk `<meta name="description">`, Open Graph, JSON-LD
  `Article.description`, kartu artikel (`ArticleCard`), dan lead halaman detail.
  Konsisten di semua artikel; jangan menulis ringkasan terpisah.
- Karena itu panjang `description` mengikuti paragraf pertama (ratusan karakter
  boleh). Panjang SERP bukan batas karakter yang dijamin Google — Google dapat
  memilih snippet dari isi halaman sesuai kueri.
- Jangan membuat field `intro` metadata tambahan. Isi artikel tetap berada di
  `blocks[]`; `description` = salinan paragraf pertama untuk keperluan metadata/kartu.
- Google dapat memilih snippet dari isi halaman sesuai kueri; meta description
  bukan instruksi agar Google selalu menampilkan teks itu. Tulis paragraf pembuka
  yang berdiri sendiri dan informatif.
- Artikel wajib frontmatter-only: tepat satu delimiter pembuka `---` dan satu
  delimiter penutup `---`; tidak boleh ada body Markdown setelah delimiter penutup.
  Pastikan delimiter penutup tetap ada setelah mengedit YAML.
- Quote string YAML yang berpotensi ditafsirkan sebagai sintaks YAML (terutama
  `description` dengan tanda baca seperti `: `, kutip, atau karakter khusus).
  Setelah menulis artikel, validasi parse frontmatter melalui `npm run check`.
- `ArticleCard.astro` adalah komponen listing reusable: semua elemen punya semantic
  class `article-card__*`; gambar memakai rasio 1.11:1 yang mendekati aset artikel;
  description tidak diubah di sumber dan boleh dibatasi **hanya secara visual**
  dengan line-clamp (saat ini 5 baris). Jangan menambahkan ringkasan khusus kartu.
- Halaman detail artikel memakai split hero yang sama dengan halaman layanan:
  kategori/eyebrow, H1, P1 di kolom kiri; featured image di kolom kanan. Hero memakai
  komponen `Hero.astro` yang sudah ada, bukan membuat sistem hero/CSS paralel.
  P1 diambil dari `blocks[]`, ditampilkan sekali di hero, lalu dikeluarkan dari
  body renderer agar tidak berulang.
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

# Verifikasi DOM Route (13 Nov 2026)

> Hasil pembuktian diff seluruh route produksi terhadap baseline. Melengkapi
> `docs/RENCANA-BLOCK-PARITY.md` (gerbang Tahap 0) dan `docs/BLOCK-PARITY-CHECKLIST.md`
> (inspeksi source per block). **Tidak ada kode yang diubah** pada sesi ini — semua
> perubahan adalah dokumen.

## Ringkasan

**Tidak ada selisih tak terduga di semua route.** Setiap beda yang ditemukan masuk
kategori: (a) divergensi yang sudah terdokumentasi/berkeputusan, atau (b) selisih tanggal
pada teks hitung mundur status (referensi basi 1 hari). Struktur DOM, urutan elemen,
class, ID, atribut, link, dan teks lain: **identik**.

Konsekuensi: **tidak ada komponen yang perlu diperbaiki** dari hasil diff ini.

## Metode & alat

| Alat | Peran |
| --- | --- |
| `npm run build` di `486c1a2` (working tree bersih) | Menghasilkan `dist/` yang diperiksa |
| `python3 /tmp/opencode/diff-jadwal.py <ref> <kita>` | Diff kanonis `section#jadwal` (normalisasi keputusan #13) |
| `/tmp/opencode/diff-full.py` | Varian **tanpa batas baris** dari `diff-home.py` — diff kanonis `<main id="konten">` penuh |
| `/tmp/opencode/diff-jadwal-full.py` | Varian tanpa batas baris dari `diff-jadwal.py` |
| git worktree `3eb515a` (baseline pre-pull, sudah dihapus) | Pembanding `/layanan/` listing & bukti "pull nol efek" |

Catatan: script `*.py` ada di `/tmp/opencode/` (temp sesi), mengikuti konvensi
`diff-home.py`/`diff-jadwal.py` sebelumnya.

## Hasil per route

### 1. `section#jadwal` — ref home vs `/jadwal/` kita

Ref **2777 token** vs kita **2777 token**. Selisih:

| Selisih | Jumlah | Kategori |
| --- | --- | --- |
| `<h2>`: `Jadwal Pelatihan Damkar 2026` → `Semua Gelombang Public Training` | 1 | ✅ disengaja — keputusan Fase 3 (judul section sengaja beda karena H1 sudah memakai kalimat itu) |
| `batch-title`: `Damkar Kelas {X}` → `Damkar Kelas {X} {Role}` | **57** (D 23, A 12, C 11, B 11) | ✅ disengaja — `fbb9fb4` |
| `Mulai 5/11 hari lagi` → `Mulai 4/10/3 hari lagi` | 3 | ⏱ selisih tanggal — referensi diregenerasi 12 Nov, build ini 13 Nov (konsisten −1 hari) |

Ref vs **beranda** kita (section sama): hanya role `batch-title` + selisih hari —
**tanpa** beda judul.

### 2. Empat halaman detail — `referensi/damkar-kelas-*/` vs `/layanan/damkar-kelas-*/`

Token **sama persis**: kelas-d 1802, kelas-c 1316, kelas-b 1351, kelas-a 1399.
Selisih unik ke-4 halaman:

| Selisih | Halaman | Kategori |
| --- | --- | --- |
| Breadcrumb `Program`: `/#program` → `/layanan/` | 4/4 | ✅ keputusan **#10** |
| `nr-class`: `Damkar Kelas D` → `Damkar Kelas D Petugas Pemadam` (slot hero) | 4/4 | ✅ `d519571` |
| `month-title`: `Jadwal Damkar Kelas D Januari 2026` → `... Petugas Pemadam Januari 2026` | 4/4 (9–12 title) | ✅ `f2d2272` |
| `Mulai 5/11/4 hari lagi` → `4/10/3` | D, B, A | ⏱ selisih tanggal (−1 hari) |

### 3. Listing `/layanan/` — baseline khusus

Referensi **tidak punya** halaman listing (`build.py` hanya `page_home()`, `page_class()`,
`page_404()`; sitemap lama = 5 URL: home + 4 kelas). Pembanding: **build sebelum pull**
(`3eb515a`) lewat git worktree.

### 4. Bukti "pull Tahap 0 nol efek" — pre-pull `3eb515a` vs build sekarang

Dibandingkan byte-per-byte (md5), **7 route identik**:

```
layanan/ · kelas-d · kelas-c · kelas-b · kelas-a · beranda · jadwal
→ SEMUANYA IDENTIK (md5 sama)
```

Artinya rangkaian pull Tahap 0 (kontrak + registry + 12 adapter + 6 komponen dimodifikasi)
**tidak mengubah output satu pun route produksi**. (Worktree baseline sudah dihapus.)

## Yang belum tercakup (sisa gerbang Tahap 0)

1. **DOM diff per-block via fixture** — renderer `src/blocks/` dengan `fixtures.ts`
   vs section asal (tag/urutan/ID/ARIA/data-attribute per block) — checklist di
   `docs/BLOCK-PARITY-CHECKLIST.md` (kolom DOM).
2. **Uji interaksi browser**: slider (autoplay/next/prev/`aria-hidden`), tabs
   (klik + Arrow/Home/End), materi show-more, sidebar scrollspy, toggle jadwal lewat,
   summary live.
3. **Screenshot/visual** desktop & mobile (hero, layout sidebar, grid, strip bulan).

Route-level di atas baru membuktikan **halaman lama** tidak berubah; belum membuktikan
**block katalog** (Tahap 0) merender identik — itu tujuan kolom DOM/Browser checklist.

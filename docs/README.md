# docs/ — Dokumentasi Migrasi Pelatihan Damkar

Dokumen ini menjaga konteks pekerjaan tidak hilang antar sesi. Dibaca/diupdate
setiap satu fase selesai.

| File | Isi |
| --- | --- |
| [RENCANA-FASE.md](RENCANA-FASE.md) | Rencana 7+1 fase, status tiap fase, keputusan arsitektur, pemetaan file, langkah berikutnya |
| [LOG.md](LOG.md) | Catatan kronologis: apa yang dikerjakan, commit, hasil verifikasi, perbedaan yang disengaja |

## Ringkasan cepat

- **Sumber**: situs statis lama di `referensi/` (hasil `referensi/_tools/build.py` + `data/site.json`).
- **Target**: situs Astro di root repo ini, konsep/architecture mengikuti `/www/wwwroot/confinedspace/`,
  visual/style memakai `referensi/assets/css/style.css` apa adanya (tanpa Tailwind, tanpa MDX).
- **Status sekarang (12 Nov 2026)**: Fase 0–2 selesai (commit `ec5c12f`, `ae2cd64`, `495304b`).
  Berikutnya **Fase 3 — Jadwal**.
- **Perintah**: `npm run check` · `npm run build` (URL produksi) ·
  `SITE_URL=http://<domain>.lan npm run build` (uji staging) · `npm run preview` → `http://localhost:4321/`

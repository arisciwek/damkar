/**
 * Konten blok yang dipakai di banyak halaman: FAQ, alasan ("Mengapa ... Penting?"),
 * dan keunggulan (benefits). Sumber: referensi/data/site.json → faq, reasons, benefits.
 */

export const faq = [
  {
    q: 'Apa perbedaan Damkar D, C, B dan A?',
    a: 'Setiap kelas memiliki jenjang kompetensi berbeda, mulai dari petugas pemadam, petugas madya, ketua regu hingga ahli K3 pemadam kebakaran.',
  },
  {
    q: 'Bagaimana metode pelatihannya?',
    a: 'Damkar D menggunakan blended training. Damkar C, B dan A menggunakan full offline sesuai informasi program.',
  },
  {
    q: 'Apa persyaratan pesertanya?',
    a: 'Kelas D, C dan B minimal SMA/SLTA. Kelas A minimal D3. Persyaratan jenjang sebelumnya perlu diperhatikan untuk proses menuju Kelas A.',
  },
  {
    q: 'Di mana lokasi pelatihan?',
    a: 'Lokasi dapat menyesuaikan jadwal penyelenggara. Konfirmasi lokasi terbaru saat melakukan pendaftaran.',
  },
] as const;

export const reasons = [
  {
    title: 'Penilaian risiko',
    text: 'Menilai tingkat risiko kebakaran dan meminimalkan potensi kerugian.',
  },
  {
    title: 'Sistem proteksi',
    text: 'Memahami dan merancang sistem proteksi kebakaran sesuai kebutuhan.',
  },
  {
    title: 'Evaluasi menyeluruh',
    text: 'Mengevaluasi konsep dan implementasi sistem proteksi secara menyeluruh.',
  },
] as const;

/** Ikon mengacu ke src/utils/icons.ts (nama yang sama dengan referensi). */
export const benefits = [
  {
    title: 'Materi & Handout',
    text: 'Bahan pembelajaran untuk mendukung pemahaman peserta.',
    icon: 'book',
  },
  {
    title: 'Peralatan Praktik',
    text: 'Praktik menggunakan perlengkapan sesuai program.',
    icon: 'tool',
  },
  {
    title: 'Wahana Praktik',
    text: 'Area praktik untuk mengasah keterampilan lapangan.',
    icon: 'flame',
  },
  {
    title: 'Sertifikat & Lisensi',
    text: 'Dokumen kompetensi sesuai program yang diikuti.',
    icon: 'badge',
  },
] as const;

/** Teks pendukung yang muncul di beberapa blok (copy dari referensi/_tools/build.py). */
export const blockCopy = {
  reasonsLede: 'Keselamatan bukan sekadar alat. Ini soal kompetensi.',
  reasonsIntro:
    'Risiko kebakaran di tempat kerja membutuhkan tenaga kerja yang memahami bahaya, prosedur darurat, sistem proteksi, serta teknik penanggulangan. Pelatihan disusun dengan teori dan praktik agar kompetensi dapat diterapkan dalam kondisi kerja nyata.',
  benefitsTitle: 'Mengapa Pilih Betracom',
  benefitsLede:
    'Fokus pada kompetensi. Fasilitas pelatihan untuk mendukung pemahaman teori dan keterampilan lapangan.',
  faqTitle: 'Informasi Penting & Pertanyaan Umum',
  faqLede: 'Belum menemukan jawaban? Tim kami siap membantu melalui WhatsApp.',
  mediaTitle: 'Belajar Teori, Latihan di Lapangan',
  mediaLede:
    'Peserta mempelajari teori lalu mempraktikkannya langsung dengan perlengkapan pemadam kebakaran.',
  othersTitle: 'Jenjang Pelatihan Lainnya',
  othersLede: 'Lanjutkan kompetensi ke jenjang berikutnya.',
} as const;
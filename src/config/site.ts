/**
 * Identitas situs & organisasi.
 * Sumber: referensi/data/site.json (folder referensi tidak di-bundle, isinya dipindah ke sini).
 * Ubah file ini lalu jalankan `npm run build` — meta, footer, dan JSON-LD ikut berubah.
 */

export const site = {
  url: 'https://pelatihandamkar.web.id',
  name: 'Pelatihan Damkar Betracom',
  shortName: 'Betracom',
  year: 2026,
  language: 'id-ID',
  locale: 'id_ID',
  themeColor: '#111111',
  /** Gelombang dianggap "segera dimulai" bila kurang dari N hari lagi. */
  soonDays: 14,
  /** Batas tampilan "jadwal berikutnya" di komponen ringkas. */
  nearestLimit: 3,
} as const;

export const organization = {
  name: 'PT Betracom Gemilang Nusa',
  alternateName: 'Betracom',
  url: 'https://betracom.co.id/',
  logo: '/images/logo-betracom.png',
  description:
    'Program pelatihan dan sertifikasi pemadam kebakaran bersama PT Betracom Gemilang Nusa.',
  email: 'betracomtraining@gmail.com',
  phones: [
    { display: '+62 812-9805-3891', tel: '+6281298053891', type: 'customer service' },
    { display: '+62 822-6806-6126', tel: '+6282268066126', type: 'sales' },
  ],
  address: {
    street: 'Grand Slipi Tower Lt. 9',
    road: 'Jl. Letjen S. Parman',
    city: 'Jakarta Barat',
    region: 'DKI Jakarta',
    country: 'ID',
  },
  sameAs: ['https://betracom.co.id/'],
} as const;

export const whatsapp = {
  /** Pendaftaran (nomor sales). */
  daftar: '6282268066126',
  /** Konsultasi (nomor customer service). */
  konsultasi: '6281298053891',
} as const;

/** Galeri foto latihan (semua aset lokal di public/images). */
export const photos = [
  {
    src: '/images/damkar-pemadaman-tradisional.webp',
    ogSrc: '/images/damkar-pemadaman-tradisional.jpg',
    w: 1200,
    h: 1600,
    cap: 'Pemadaman tradisional',
    alt: 'Peserta Pelatihan Damkar Kemnaker RI saat praktik pemadaman api',
  },
  {
    src: '/images/damkar-praktik-apar.webp',
    ogSrc: '/images/damkar-praktik-apar.jpg',
    w: 1200,
    h: 1600,
    cap: 'Penggunaan APAR',
    alt: 'Peserta Pelatihan Damkar berlatih menggunakan APAR di lapangan',
  },
  {
    src: '/images/damkar-prosedur-apd.webp',
    ogSrc: '/images/damkar-prosedur-apd.jpg',
    w: 1200,
    h: 1600,
    cap: 'Prosedur APD',
    alt: 'Peserta Pelatihan Damkar mempelajari prosedur alat pelindung diri',
  },
  {
    src: '/images/damkar-simulasi-hydrant.webp',
    ogSrc: '/images/damkar-simulasi-hydrant.jpg',
    w: 960,
    h: 1280,
    cap: 'Simulasi hydrant',
    alt: 'Peserta Pelatihan Damkar berlatih memadamkan kebakaran dengan hydrant',
  },
] as const;

/** Tautan WhatsApp dengan pesan siap kirim. */
export function waLink(number: string, text: string): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

export const waDaftar = (text: string) => waLink(whatsapp.daftar, text);
export const waKonsultasi = (text: string) => waLink(whatsapp.konsultasi, text);
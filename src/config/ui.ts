/**
 * Teks tampilan, navigasi, dan label meta.
 * Sumber: teks pada referensi/*.html (diadopsi apa adanya, hanya dirapikan).
 */
import { organization, photos, site, waKonsultasi } from './site';

export const ui = {
  meta: {
    defaultTitle: 'Pelatihan Damkar Kelas D, C, B, A Kemnaker RI | Jadwal 2026',
    defaultDescription:
      'Pelatihan Damkar Kelas D, C, B & A bersertifikat Kemnaker RI. Teori dan praktik lapangan, jadwal 2026 setiap bulan. Bandingkan kelas dan daftar via WhatsApp.',
    defaultImage: photos[0].ogSrc,
    defaultImageAlt: photos[0].alt,
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    author: organization.name,
    themeColor: site.themeColor,
  },

  brand: {
    name: organization.alternateName,
    suffix: 'Gemilang Nusa',
    logo: organization.logo,
    logoAlt: `Logo ${organization.name}`,
    homeLabel: `Beranda ${site.name}`,
  },

  nav: {
    mainAriaLabel: 'Navigasi utama',
    programButton: 'Program',
    programMenuAriaLabel: 'Program pelatihan',
    /** Tautan tambahan di kaki mega menu Program. */
    programLinks: [
      { label: 'Bandingkan semua kelas', href: '/#program' },
      { label: 'Semua layanan', href: '/layanan/' },
    ],
    items: [
      { label: 'Layanan', href: '/layanan/' },
      { label: 'Jadwal', href: '/jadwal/' },
      { label: 'Artikel', href: '/artikel/' },
      { label: 'Kontak', href: '/kontak/' },
    ],
    cta: {
      label: 'Daftar Sekarang',
      href: waKonsultasi('Halo saya ingin konsultasi Pelatihan Damkar.'),
    },
    toggleAriaLabel: { open: 'Buka menu', close: 'Tutup menu' },
    breadcrumbHome: 'Beranda',
  },

  contact: {
    kicker: 'Siap meningkatkan kompetensi?',
    heading: 'Jangan biarkan keselamatan menjadi pilihan terakhir.',
    whatsappLabel: 'Konsultasi via WhatsApp',
    whatsappHref: waKonsultasi('Halo saya ingin konsultasi Pelatihan Damkar.'),
    labels: {
      phone: 'Telepon & WhatsApp',
      email: 'Email',
      office: 'Kantor',
      certificate: 'Sertifikasi',
    },
    certificateValue: 'Kemnaker RI',
    certificateNote: 'Sertifikat & lisensi resmi',
  },

  footer: {
    programTitle: 'Program',
    programLabel: 'Program pelatihan',
    navTitle: 'Navigasi',
    navLabel: 'Situs Betracom lainnya',
    contactTitle: 'Kontak',
    links: [
      { label: 'Pusat Training K3', href: 'https://pusattrainingk3.com/' },
      { label: 'Betracom.co.id', href: 'https://betracom.co.id/' },
      { label: 'Betracom Training', href: 'https://betracomtraining.com/' },
      { label: 'Sertifikasi Confined Space', href: 'https://sertifikasiconfinedspace.web.id/' },
      { label: 'Ahli K3 Umum', href: 'https://k3umum.co.id/' },
    ],
    tagline: 'Pelatihan · Sertifikasi · K3',
  },

  waFloat: {
    label: 'Chat WhatsApp',
    href: waKonsultasi('Halo, saya ingin tanya Pelatihan Damkar.'),
  },

  notFound: {
    title: 'Halaman tidak ditemukan',
    description: 'Halaman tidak ditemukan.',
  },
} as const;
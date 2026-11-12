/**
 * Fixture parity memakai konten produksi yang sedang dipakai halaman .astro.
 *
 * File ini bukan sumber konten baru dan tidak dipakai route produksi. Saat halaman
 * dimigrasikan ke Markdown, data dipindahkan ke frontmatter secara eksplisit.
 */
import { benefits, blockCopy, faq, reasons } from '../config/blocks';
import { countBatches } from '../config/jadwal';
import { photos, site, waDaftar } from '../config/site';
import type { BlockConfig } from './types';

const homeHeroMessage = 'Halo saya ingin konsultasi Pelatihan Damkar.';
const registrationMessage =
  'Halo tim Betracom, saya ingin mendaftar Pelatihan Damkar. Mohon info jadwal, biaya, dan persyaratannya.';

export const homeBlockFixture = [
  {
    type: 'hero',
    eyebrow: 'Sertifikasi Kemnaker RI',
    heading: 'Pelatihan Damkar Kelas D, C, B & A',
    highlight: 'Kompetensi untuk keselamatan.',
    lead: 'Pelatihan Pemadam Kebakaran Kelas D, C, B & A untuk membangun kompetensi pencegahan, penanggulangan, dan evaluasi sistem proteksi kebakaran di tempat kerja.',
    nearest: { limit: 3 },
    facts: [
      { value: '4', label: 'Jenjang kompetensi' },
      { value: String(countBatches()), label: `Gelombang ${site.year}` },
      { value: 'Kemnaker', label: 'Sertifikasi & lisensi resmi' },
    ],
    actions: [
      {
        label: 'Daftar Sekarang',
        href: waDaftar(homeHeroMessage),
        className: 'btn btn-black btn-lg',
        target: '_blank',
        rel: 'noopener',
      },
      {
        label: 'Lihat Jadwal',
        href: '#jadwal',
        className: 'btn btn-outline btn-lg',
      },
    ],
    media: { type: 'slider' },
  },
  {
    type: 'section-sidebar',
    ctaMsg: 'Halo saya ingin mendaftar Pelatihan Damkar.',
    links: [
      { id: 'manfaat', label: 'Manfaat Pelatihan', icon: 'check' },
      { id: 'program', label: 'Jenjang Program', icon: 'list' },
      { id: 'detail', label: 'Materi Pelatihan', icon: 'book' },
      { id: 'fasilitas', label: 'Mengapa Pilih Kami', icon: 'badge' },
      { id: 'pengalaman', label: 'Praktik Lapangan', icon: 'flame' },
      { id: 'jadwal', label: 'Jadwal & Persyaratan', icon: 'cal' },
      { id: 'faq', label: 'FAQ', icon: 'info' },
    ],
  },
  {
    type: 'reasons',
    title: 'Mengapa Pelatihan Damkar Penting?',
    lede: blockCopy.reasonsLede,
    intro: blockCopy.reasonsIntro,
    items: reasons.map((item) => ({ ...item })),
  },
  {
    type: 'program-grid',
    title: 'Pilih Jenjang Sesuai Kebutuhan',
    lede: 'Program berjenjang dari Petugas Pemadam hingga Ahli K3 Pemadam Kebakaran.',
  },
  {
    type: 'class-tabs',
    title: 'Detail Program & Materi',
    lede: 'Materi yang relevan dengan pekerjaan. Pilih kelas untuk melihat materinya.',
  },
  {
    type: 'benefits',
    title: blockCopy.benefitsTitle,
    lede: blockCopy.benefitsLede,
    items: benefits.map((item) => ({ ...item })),
  },
  {
    type: 'gallery',
    title: blockCopy.mediaTitle,
    lede: blockCopy.mediaLede,
    items: photos.map((photo) => ({ ...photo })),
  },
  {
    type: 'schedule-list',
    id: 'jadwal',
    title: `Jadwal Pelatihan Damkar ${site.year}`,
    lede: 'Temukan tanggal yang cocok. Pilih kelas dan bulan, lalu daftar langsung via WhatsApp.',
  },
  {
    type: 'faq',
    title: blockCopy.faqTitle,
    lede: blockCopy.faqLede,
    items: faq.map((item) => ({ ...item })),
  },
  { type: 'contact-band' },
] satisfies BlockConfig[];

export const serviceListingBlockFixture = [
  {
    type: 'hero',
    eyebrow: 'Sertifikasi Kemnaker RI',
    heading: 'Layanan Pelatihan Damkar',
    highlight: 'Kelas D, C, B & A.',
    lead: 'Empat jenjang kompetensi pemadam kebakaran — dari Petugas Pemadam hingga Ahli K3 — dengan teori, praktik lapangan, dan sertifikasi Kemnaker RI bersama PT Betracom Gemilang Nusa.',
    breadcrumb: [
      { label: 'Beranda', href: '/' },
      { label: 'Layanan' },
    ],
    nearest: { limit: 3 },
    facts: [
      { value: '4', label: 'Jenjang kompetensi' },
      { value: String(countBatches()), label: `Gelombang ${site.year}` },
      { value: 'Kemnaker', label: 'Sertifikasi & lisensi resmi' },
    ],
    actions: [
      {
        label: 'Daftar Sekarang',
        href: waDaftar(registrationMessage),
        className: 'btn btn-black btn-lg',
        target: '_blank',
        rel: 'noopener',
      },
      {
        label: 'Lihat Jadwal',
        href: '/jadwal/',
        className: 'btn btn-outline btn-lg',
      },
    ],
    media: { type: 'photo', photo: photos[0] },
  },
  {
    type: 'program-grid',
    title: 'Pilih Jenjang Sesuai Kebutuhan',
    lede: 'Program berjenjang dari Petugas Pemadam hingga Ahli K3 Pemadam Kebakaran.',
  },
  {
    type: 'benefits',
    title: blockCopy.benefitsTitle,
    lede: blockCopy.benefitsLede,
    items: benefits.map((item) => ({ ...item })),
  },
  {
    type: 'faq',
    title: blockCopy.faqTitle,
    lede: blockCopy.faqLede,
    items: faq.map((item) => ({ ...item })),
  },
  { type: 'contact-band' },
] satisfies BlockConfig[];

export const scheduleIndexBlockFixture = [
  {
    type: 'hero',
    eyebrow: 'Jadwal & Pendaftaran',
    heading: 'Jadwal Pelatihan Damkar',
    highlight: `${site.year}.`,
    lead: `Semua gelombang Public Training bersertifikat Kemnaker RI dalam satu halaman — ${countBatches()} gelombang sepanjang ${site.year} untuk Kelas D, C, B, dan A. Pilih kelas dan bulan, lalu daftar via WhatsApp.`,
    breadcrumb: [
      { label: 'Beranda', href: '/' },
      { label: 'Jadwal' },
    ],
    facts: [
      { value: '4', label: 'Jenjang kompetensi' },
      { value: String(countBatches()), label: `Gelombang ${site.year}` },
      { value: 'Kemnaker', label: 'Sertifikasi & lisensi resmi' },
    ],
    actions: [
      {
        label: 'Daftar Sekarang',
        href: waDaftar(registrationMessage),
        className: 'btn btn-black btn-lg',
        target: '_blank',
        rel: 'noopener',
      },
      {
        label: 'Pilih Kelas',
        href: '/layanan/',
        className: 'btn btn-outline btn-lg',
      },
    ],
    media: { type: 'photo', photo: photos[0] },
  },
  {
    type: 'schedule-list',
    id: 'jadwal',
    title: 'Semua Gelombang Public Training',
    lede: 'Temukan tanggal yang cocok. Pilih kelas dan bulan, lalu daftar langsung via WhatsApp.',
  },
  { type: 'contact-band' },
] satisfies BlockConfig[];

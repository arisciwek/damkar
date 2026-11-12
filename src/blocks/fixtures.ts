/**
 * Fixture parity memakai konten produksi yang sedang dipakai halaman .astro.
 *
 * File ini bukan sumber konten baru dan tidak dipakai route produksi. Saat halaman
 * dimigrasikan ke Markdown, data dipindahkan ke frontmatter secara eksplisit.
 */
import { benefits, blockCopy, faq, reasons } from '../config/blocks';
import { active, countBatches } from '../utils/schedule';
import { organization, photos, site, waDaftar } from '../config/site';
import type { PageBlockConfig } from './types';

/** countBatches/active kini async (collection schedule) — fixture tetap konstanta sync. */
const countBatchesTotal = await countBatches();

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
      { value: String(countBatchesTotal), label: `Gelombang ${site.year}` },
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
    type: 'content-layout',
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
    blocks: [
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
    ],
  },
  { type: 'contact-band' },
] satisfies PageBlockConfig[];

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
      { value: String(countBatchesTotal), label: `Gelombang ${site.year}` },
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
    type: 'content-layout',
    ctaMsg: registrationMessage,
    links: [
      { id: 'program', label: 'Program Pelatihan', icon: 'list' },
      { id: 'fasilitas', label: 'Mengapa Pilih Kami', icon: 'badge' },
      { id: 'faq', label: 'FAQ', icon: 'info' },
    ],
    blocks: [
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
    ],
  },
  { type: 'contact-band' },
] satisfies PageBlockConfig[];

export const scheduleIndexBlockFixture = [
  {
    type: 'hero',
    eyebrow: 'Jadwal & Pendaftaran',
    heading: 'Jadwal Pelatihan Damkar',
    highlight: `${site.year}.`,
    lead: `Semua gelombang Public Training bersertifikat Kemnaker RI dalam satu halaman — ${countBatchesTotal} gelombang sepanjang ${site.year} untuk Kelas D, C, B, dan A. Pilih kelas dan bulan, lalu daftar via WhatsApp.`,
    breadcrumb: [
      { label: 'Beranda', href: '/' },
      { label: 'Jadwal' },
    ],
    facts: [
      { value: '4', label: 'Jenjang kompetensi' },
      { value: String(countBatchesTotal), label: `Gelombang ${site.year}` },
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
    type: 'content-container',
    blocks: [
      {
        type: 'schedule-list',
        id: 'jadwal',
        title: 'Semua Gelombang Public Training',
        lede: 'Temukan tanggal yang cocok. Pilih kelas dan bulan, lalu daftar langsung via WhatsApp.',
      },
    ],
  },
  { type: 'contact-band' },
] satisfies PageBlockConfig[];


interface ServiceClassEntry {
  id: string;
  data: {
    key: 'D' | 'C' | 'B' | 'A';
    step: number;
    name: string;
    role: string;
    desc: string;
    mode: string;
    modeNote: string;
    education: string;
    requirement: string;
    materi: readonly string[];
  };
}

/** Fixture halaman detail kelas dengan data entry collection yang benar-benar dipakai route. */
export async function serviceDetailBlockFixture(
  entry: ServiceClassEntry,
  entries: readonly ServiceClassEntry[],
): Promise<PageBlockConfig[]> {
  const data = entry.data;
  const key = data.key;
  const step = (['D', 'C', 'B', 'A'] as const).indexOf(key);
  const photo = photos[step];
  const zigPhotos = [
    photos[(step + 1) % photos.length],
    photos[(step + 2) % photos.length],
    photos[(step + 3) % photos.length],
  ] as const;
  const ctaMsg = `Halo tim Betracom, saya ingin mendaftar Pelatihan ${data.name}. Mohon info jadwal, biaya, dan persyaratannya.`;
  const gelombangCount = await countBatches(key);
  const gelombangAktif = (await active(key)).length;
  const others = entries.filter((other) => other.data.key !== key);

  return [
    {
      type: 'hero',
      eyebrow: `Jenjang ${data.step} dari 4 · Sertifikasi Kemnaker RI`,
      heading: `Pelatihan ${data.name}`,
      highlight: data.role,
      lead: `${data.desc} Program ${data.mode} dengan sertifikasi Kemnaker RI bersama ${organization.name}.`,
      breadcrumb: [
        { label: 'Beranda', href: '/' },
        { label: 'Program', href: '/layanan/' },
        { label: data.name },
      ],
      nearest: { kelas: key, limit: 2 },
      facts: [
        { value: `${data.step}/4`, label: 'Jenjang' },
        { value: String(data.materi.length), label: 'Materi' },
        { value: String(gelombangCount), label: `Gelombang ${site.year}` },
        { value: data.education, label: 'Pendidikan min.' },
      ],
      actions: [
        {
          label: 'Daftar Sekarang',
          href: waDaftar(ctaMsg),
          className: 'btn btn-black btn-lg',
          target: '_blank',
          rel: 'noopener',
        },
        {
          label: 'Lihat Materi',
          href: '#detail',
          className: 'btn btn-outline btn-lg',
        },
      ],
      media: { type: 'photo', photo, letter: key },
    },
    {
      type: 'content-layout',
      ctaMsg,
      links: [
        { id: 'manfaat', label: 'Manfaat Pelatihan', icon: 'check' },
        { id: 'detail', label: 'Detail Program', icon: 'list' },
        { id: 'fasilitas', label: 'Mengapa Pilih Kami', icon: 'badge' },
        { id: 'jadwal', label: 'Jadwal & Persyaratan', icon: 'cal' },
        { id: 'faq', label: 'FAQ', icon: 'info' },
        { id: 'jenjang', label: 'Jenjang Lainnya', icon: 'arrow-ur' },
      ],
      blocks: [
        {
          type: 'reasons',
          title: `Mengapa ${data.name} Penting?`,
        },
        {
          type: 'class-detail',
          name: data.name,
          role: data.role,
          description: data.desc,
          mode: data.mode,
          modeNote: data.modeNote,
          step: data.step,
          materi: data.materi,
          requirement: data.requirement,
          location: faq[3].a,
          photos: zigPhotos,
        },
        { type: 'benefits' },
        {
          type: 'schedule-list',
          id: 'jadwal',
          title: `Jadwal ${data.name} ${site.year}`,
          lede: `${gelombangCount} gelombang Public Training sepanjang ${site.year}, ${gelombangAktif} di antaranya masih aktif atau akan datang.`,
          kelas: key,
          chips: false,
        },
        { type: 'faq' },
        {
          type: 'other-programs',
          title: 'Jenjang Pelatihan Lainnya',
          lede: 'Lanjutkan kompetensi ke jenjang berikutnya.',
          items: others.map((other) => ({
            key: other.data.key,
            step: other.data.step,
            name: other.data.name,
            role: other.data.role,
            href: `/layanan/${other.id}/`,
          })),
        },
      ],
    },
    { type: 'contact-band' },
  ] satisfies PageBlockConfig[];
}

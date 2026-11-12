/**
 * Pembangun JSON-LD — port dari referensi/assets/js/schema.js, tetapi dirender
 * saat build (ada di view-source, Google tidak perlu menjalankan JavaScript).
 *
 * Susunan graph disamakan dengan versi lama:
 *   semua halaman : EducationalOrganization + WebSite (+ WebPage/BreadcrumbList)
 *   beranda        : + ItemList program + FAQPage
 *   halaman kelas  : + Course (CourseInstance gelombang mendatang + Syllabus)
 */
import { organization, photos, site } from '../config/site';

export type JsonLd = Record<string, unknown>;

export const ids = {
  org: `${site.url}#organization`,
  website: `${site.url}#website`,
} as const;

export function organizationNode(): JsonLd {
  return {
    '@type': 'EducationalOrganization',
    '@id': ids.org,
    name: organization.name,
    alternateName: organization.alternateName,
    url: organization.url,
    logo: { '@type': 'ImageObject', url: absolute(organization.logo), width: 150, height: 150 },
    image: absolute(organization.logo),
    description: organization.description,
    email: organization.email,
    telephone: organization.phones[0].tel,
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${organization.address.street}, ${organization.address.road}`,
      addressLocality: organization.address.city,
      addressRegion: organization.address.region,
      addressCountry: organization.address.country,
    },
    areaServed: { '@type': 'Country', name: 'Indonesia' },
    knowsAbout: [
      'Pelatihan Damkar',
      'K3 Penanggulangan Kebakaran',
      'Sistem Proteksi Kebakaran',
      'Keselamatan dan Kesehatan Kerja',
    ],
    contactPoint: organization.phones.map((p) => ({
      '@type': 'ContactPoint',
      telephone: p.tel,
      contactType: p.type,
      areaServed: 'ID',
      availableLanguage: 'Indonesian',
    })),
    sameAs: [...organization.sameAs],
  };
}

export function websiteNode(): JsonLd {
  return {
    '@type': 'WebSite',
    '@id': ids.website,
    url: site.url,
    name: site.name,
    inLanguage: site.language,
    publisher: { '@id': ids.org },
  };
}

export function webpageNode(input: {
  url: string;
  name: string;
  description: string;
  extra?: JsonLd;
  pubDate?: Date;
  updatedDate?: Date;
}): JsonLd {
  const primary = photos[0];
  return {
    '@type': 'WebPage',
    '@id': `${input.url}#webpage`,
    url: input.url,
    name: input.name,
    description: input.description,
    inLanguage: site.language,
    isPartOf: { '@id': ids.website },
    primaryImageOfPage: { '@type': 'ImageObject', url: absolute(primary.src), width: primary.w, height: primary.h },
    ...(input.pubDate ? { datePublished: iso(input.pubDate) } : {}),
    ...(input.updatedDate ? { dateModified: iso(input.updatedDate) } : {}),
    ...(input.extra ?? {}),
  };
}

export function breadcrumbNode(url: string, items: { name: string; url: string }[]): JsonLd {
  return {
    '@type': 'BreadcrumbList',
    '@id': `${url}#breadcrumb`,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export interface KelasSchemaInput {
  key: string;
  slug: string;
  name: string;
  role: string;
  desc: string;
  mode: string;
  courseMode: string;
  education: string;
  materi: string[];
  schedule: { class: string; batch: string; start: string; end: string; label: string }[];
}

/** Course + CourseInstance (hanya gelombang yang belum dimulai) + Syllabus per materi. */
export function courseNode(kelas: KelasSchemaInput, today = new Date()): JsonLd {
  const url = `${site.url}/layanan/${kelas.slug}/`;
  const instances = kelas.schedule
    .filter((row) => row.class === kelas.key && parseIso(row.start) > today)
    .sort((a, b) => a.start.localeCompare(b.start))
    .map((row) => ({
      '@type': 'CourseInstance',
      name: `${kelas.name} Gelombang ${row.batch}`,
      description: `Public Training ${kelas.name} (${kelas.mode}), ${row.label}.`,
      courseMode: kelas.courseMode,
      startDate: row.start,
      endDate: row.end,
      url: `${url}#jadwal`,
      inLanguage: site.language,
    }));

  const node: JsonLd = {
    '@type': 'Course',
    '@id': `${url}#course`,
    url,
    name: `Pelatihan ${kelas.name} (${kelas.role})`,
    description: `${kelas.desc} Program ${kelas.mode} dengan sertifikasi Kemnaker RI bersama ${organization.name}.`,
    courseCode: `DAMKAR-${kelas.key}`,
    inLanguage: site.language,
    educationalLevel: kelas.role,
    coursePrerequisites: `Pendidikan minimal ${kelas.education}`,
    teaches: [...kelas.materi],
    syllabusSections: kelas.materi.map((m) => ({ '@type': 'Syllabus', name: m })),
    image: absolute(photos[0].src),
    provider: {
      '@type': 'EducationalOrganization',
      '@id': ids.org,
      name: organization.name,
      url: organization.url,
    },
    educationalCredentialAwarded: {
      '@type': 'EducationalOccupationalCredential',
      name: `Sertifikat & Lisensi ${kelas.name}`,
      credentialCategory: 'certificate',
      recognizedBy: {
        '@type': 'GovernmentOrganization',
        name: 'Kementerian Ketenagakerjaan Republik Indonesia',
        alternateName: 'Kemnaker RI',
      },
    },
  };
  if (instances.length > 0) node.hasCourseInstance = instances;
  return node;
}

export function programItemList(
  items: { url: string; name: string }[],
  id = `${site.url}#program`,
): JsonLd {
  return {
    '@type': 'ItemList',
    '@id': id,
    name: 'Program Pelatihan Damkar Kemnaker RI',
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: item.url,
      name: item.name,
    })),
  };
}

/** ItemList untuk halaman jadwal (halaman kelas / halaman bulan). */
export function scheduleItemList(
  url: string,
  name: string,
  items: { url: string; name: string }[],
): JsonLd {
  return {
    '@type': 'ItemList',
    '@id': `${url}#jadwal-list`,
    name,
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: item.url,
      name: item.name,
    })),
  };
}

export function faqPageNode(url: string, faq: { q: string; a: string }[]): JsonLd {
  return {
    '@type': 'FAQPage',
    '@id': `${url}#faq`,
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };
}

/** Path lokal -> URL absolut (untuk og:image, logo, dsb). */
export function absolute(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  return new URL(path, site.url).toString();
}

/** Serialisasi aman: "<" di-escape agar tidak menutup tag <script>. */
export function serializeJsonLd(nodes: JsonLd[]): string {
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': nodes }).replace(/</g, '\\u003c');
}

function iso(date: Date): string {
  return date.toISOString().replace(/\.\d{3}Z$/, 'Z');
}

/** YYYY-MM-DD dianggap tanggal lokal (bukan UTC) agar "hari ini" konsisten. */
function parseIso(value: string): Date {
  const [y, m, d] = value.split('-').map(Number);
  return new Date(y, m - 1, d);
}
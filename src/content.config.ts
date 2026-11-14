import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

/**
 * Collection master training (jenjang D, C, B, A).
 * Data dipindah dari referensi/data/site.json → src/content/trainings/*.md
 *
 * `trainingId` adalah kunci integrasi lintas situs yang stabil (lihat
 * docs/SCHEDULE-ARCHITECTURE-PLAN.md §4.1). `slug` adalah identitas URL lokal;
 * nilainya dipertahankan sama dengan id file agar URL /layanan/<slug>/ tidak berubah.
 */
const trainings = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/trainings' }),
  schema: z.object({
    /** Kunci integrasi lintas situs, stabil. */
    trainingId: z.string().min(1),
    /** Identitas URL lokal (harus sama dengan id file selama belum dipisah). */
    slug: z.string().min(1),
    /** Huruf jenjang: D | C | B | A */
    key: z.string().length(1),
    /** Urutan jenjang (1 = paling dasar). */
    step: z.number().int().min(1),
    name: z.string().min(1),
    role: z.string().min(1),
    desc: z.string().min(1),
    mode: z.string().min(1),
    modeNote: z.string().min(1),
    /** Nilai schema.org `courseMode`: Blended | Onsite */
    courseMode: z.string().min(1),
    education: z.string().min(1),
    requirement: z.string().min(1),
    materi: z.array(z.string().min(1)).min(1),
    order: z.number().int().default(100),
    draft: z.boolean().default(false),
  }),
});


/** Konfigurasi block untuk halaman editorial berbasis Markdown. */
const blockImage = z.object({
  src: z.string().min(1),
  w: z.number().int().positive(),
  h: z.number().int().positive(),
  alt: z.string(),
});

const contentBlock = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('hero'),
    eyebrow: z.string(),
    heading: z.string(),
    highlight: z.string().optional(),
    lead: z.string(),
    breadcrumb: z.array(z.object({ label: z.string(), href: z.string().optional() })).optional(),
    nearest: z.object({ kelas: z.enum(['D', 'C', 'B', 'A']).optional(), limit: z.number().int().positive().optional() }).optional(),
    facts: z.array(z.object({ value: z.string(), label: z.string(), dynamic: z.enum(['batch-count']).optional() })),
    actions: z.array(z.object({
      label: z.string(), href: z.string(), className: z.string(),
      target: z.string().optional(), rel: z.string().optional(),
    })),
    media: z.discriminatedUnion('type', [
      z.object({ type: z.literal('slider') }),
      z.object({ type: z.literal('photo'), photo: blockImage, letter: z.string().optional() }),
    ]),
  }),
  z.object({
    type: z.literal('reasons'), title: z.string(), lede: z.string().optional(),
    intro: z.string().optional(),
    items: z.array(z.object({ title: z.string(), text: z.string(), image: blockImage.optional() })).optional(),
  }),
  z.object({ type: z.literal('program-grid'), title: z.string().optional(), lede: z.string().optional() }),
  z.object({ type: z.literal('class-tabs'), title: z.string().optional(), lede: z.string().optional() }),
  z.object({
    type: z.literal('benefits'), title: z.string().optional(), lede: z.string().optional(),
    items: z.array(z.object({ title: z.string(), text: z.string(), icon: z.string() })).optional(),
  }),
  z.object({
    type: z.literal('gallery'), title: z.string().optional(), lede: z.string().optional(),
    items: z.array(blockImage.extend({ cap: z.string() })).optional(),
  }),
  z.object({
    type: z.literal('schedule-list'), id: z.string().optional(), title: z.string(),
    lede: z.string().optional(), kelas: z.enum(['D', 'C', 'B', 'A']).optional(),
    bulan: z.string().optional(), chips: z.boolean().optional(),
  }),
  z.object({
    type: z.literal('faq'), title: z.string().optional(), lede: z.string().optional(),
    items: z.array(z.object({ q: z.string(), a: z.string() })).optional(),
  }),
  z.object({ type: z.literal('contact-band'), id: z.string().optional(), heading: z.string().optional(), kicker: z.string().optional() }),
  z.object({ type: z.literal('class-detail') }),
  z.object({ type: z.literal('other-programs'), title: z.string().optional(), lede: z.string().optional() }),
]);

const pageBlock = z.union([
  contentBlock,
  z.object({
    type: z.literal('content-layout'),
    ctaMsg: z.string(),
    links: z.array(z.object({ id: z.string(), label: z.string(), icon: z.string() })),
    blocks: z.array(contentBlock),
  }),
  z.object({ type: z.literal('content-container'), blocks: z.array(contentBlock) }),
]);

const pages = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/pages' }),
  schema: z.object({
    type: z.literal('page'),
    slug: z.string().min(1),
    kelas: z.enum(['D', 'C', 'B', 'A']).optional(),
    title: z.string().min(1),
    description: z.string().optional(),
    /** Wajib di setiap page — "data entri" yang berujung ke <lastmod> sitemap. */
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date(),
    draft: z.boolean().default(false),
    blocks: z.array(pageBlock).min(1),
  }),
});

/**
 * Collection jadwal gelombang — 57 file gelombang 2026, dipindah dari
 * `src/content/schedule/` (flat) ke `src/content/schedules/<YYYY>/<trainingId>/`
 * (Tahap 2 SCHEDULE-ARCHITECTURE-PLAN.md). Data asal berasal dari
 * `src/config/jadwal.ts`. Field tanggal pelaksanaan di-quoted agar tetap string.
 */
/**
 * Collection schedules — satu Markdown = satu penyelenggaraan.
 * Struktur: src/content/schedules/<YYYY>/<trainingId>/<slug>.md
 * Kontrak bersama: docs/SCHEDULE-ARCHITECTURE-PLAN.md §2, §5.
 *
 * Tanggal pelaksanaan (`startDate`/`endDate`) hanya untuk tampilan jadwal dan
 * JSON-LD Event. Metadata editorial (`pubDate`/`updatedDate`) hanya untuk
 * <lastmod> sitemap. Jangan menukar keduanya.
 */
const schedules = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/schedules' }),
  schema: z.object({
    type: z.literal('schedule'),
    /** Identitas global satu penyelenggaraan (prefix publisher + ULID). */
    scheduleId: z.string().min(1),
    /** Identitas situs penerbit asal. */
    publisherId: z.literal('damkar'),
    /** Relasi ke master training (trainings.trainingId). */
    trainingId: z.string().min(1),
    /** Nomor gelombang, mis. "01". Metadata, bukan primary key. */
    batchNo: z.string().regex(/^\d{1,3}$/, 'batchNo harus angka, mis. "01"'),
    /** Slug URL, unik di dalam bulan startDate. */
    slug: z.string().min(1),
    title: z.string().min(1),
    description: z.string().min(1),
    /** Tanggal mulai pelaksanaan (YYYY-MM-DD atau ISO 8601 lengkap). */
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}(:\d{2})?(Z|[+-]\d{2}:\d{2}))?$/, 'startDate harus tanggal ISO'),
    /** Tanggal selesai pelaksanaan. */
    endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}(:\d{2})?(Z|[+-]\d{2}:\d{2}))?$/, 'endDate harus tanggal ISO'),
    /** Label tampilan, mis. "19–21 Januari 2026". */
    dateLabel: z.string().min(1),
    timezone: z.string().min(1).default('Asia/Jakarta'),
    /** Waktu publikasi entri (ISO 8601 UTC tanpa milidetik) → sitemap lastmod. */
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date(),
    draft: z.boolean().default(false),
    /** Lifecycle penyelenggaraan (bukan status pendaftaran). */
    status: z.enum(['scheduled', 'ongoing', 'completed', 'postponed', 'cancelled']).default('scheduled'),
    registration: z.object({
      status: z.enum(['not-open', 'open', 'closed']).default('not-open'),
      deadline: z.string().optional(),
      capacity: z.number().int().positive().optional(),
    }).optional(),
    delivery: z.object({
      mode: z.enum(['offline', 'online', 'blended']).default('offline'),
      attendanceMode: z.enum(['offline', 'online', 'mixed']).default('offline'),
    }).optional(),
    venue: z.object({
      name: z.string().min(1),
      address: z.string().optional(),
      city: z.string().optional(),
      province: z.string().optional(),
      countryCode: z.string().length(2).default('ID'),
    }).optional(),
    /** Data pascapelatihan; kosong/tidak ada = tidak dirender. */
    completion: z.object({
      completedDate: z.string().optional(),
      participants: z.array(z.object({
        name: z.string().min(1),
        certificateNumber: z.string().optional(),
      })).default([]),
      gallery: z.array(z.object({
        src: z.string().min(1),
        alt: z.string().min(1),
        caption: z.string().optional(),
      })).default([]),
    }).optional(),
  }).superRefine((data, ctx) => {
    if (data.updatedDate < data.pubDate) {
      ctx.addIssue({ code: 'custom', message: 'updatedDate tidak boleh lebih awal daripada pubDate.' });
    }
    if (data.endDate < data.startDate) {
      ctx.addIssue({ code: 'custom', message: 'endDate tidak boleh lebih awal daripada startDate.' });
    }
  }),
});


/** Konten artikel — isi lengkap berada di frontmatter blocks[]. */
const articleContent = z.discriminatedUnion('type', [
  z.object({ type: z.literal('p'), text: z.string().min(1) }),
  z.object({ type: z.literal('list'), ordered: z.boolean().default(false), items: z.array(z.string().min(1)).min(1) }),
  z.object({ type: z.literal('h3'), text: z.string().min(1) }),
  z.object({ type: z.literal('h4'), text: z.string().min(1) }),
]);
const articleBlock = z.discriminatedUnion('component', [
  z.object({ component: z.literal('section'), id: z.string().min(1), heading: z.string().min(1), content: z.array(articleContent).min(1) }),
  z.object({ component: z.literal('note'), id: z.string().min(1), variant: z.enum(['info', 'success', 'warning', 'danger']).default('info'), title: z.string().optional(), text: z.string().min(1) }),
  z.object({ component: z.literal('comparison-table'), id: z.string().min(1), title: z.string().min(1), intro: z.string().optional(), headers: z.array(z.string().min(1)).min(1), rows: z.array(z.array(z.string().min(1))).min(1), note: z.string().optional() }),
  z.object({ component: z.literal('checklist-card'), id: z.string().min(1), title: z.string().min(1), description: z.string().optional(), items: z.array(z.object({ label: z.string().min(1), detail: z.string().optional(), required: z.boolean().optional() })).min(1), note: z.string().optional() }),
  z.object({ component: z.literal('process-timeline'), id: z.string().min(1), title: z.string().min(1), steps: z.array(z.object({ title: z.string().min(1), description: z.string().min(1) })).min(1) }),
  z.object({ component: z.literal('feature-card-grid'), id: z.string().min(1), title: z.string().min(1), columns: z.union([z.literal(2), z.literal(3)]).default(3), items: z.array(z.object({ title: z.string().min(1), description: z.string().optional(), points: z.array(z.string()).optional() })).min(1) }),
  z.object({ component: z.literal('source-links'), id: z.string().min(1), title: z.string().min(1), intro: z.string().optional(), items: z.array(z.object({ label: z.string().min(1), url: z.url(), description: z.string().optional() })).min(1) }),
  z.object({ component: z.literal('faq'), id: z.string().min(1), heading: z.string().min(1), items: z.array(z.object({ question: z.string().min(1), answer: z.string().min(1) })).min(1) }),
  z.object({ component: z.literal('cta'), id: z.string().min(1), heading: z.string().optional(), message: z.string().min(1), button: z.string().optional(), serviceHref: z.string().optional(), serviceLabel: z.string().optional() }),
]);
const articles = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/articles' }),
  schema: z.object({
    id: z.number().int().positive(),
    ulid: z.string().regex(/^[0-9A-HJKMNP-TV-Z]{26}$/),
    type: z.literal('article'),
    schemaType: z.enum(['Article', 'BlogPosting', 'TechArticle']).default('Article'),
    slug: z.string().min(1),
    title: z.string().min(1),
    description: z.string().min(1),
    draft: z.boolean().default(false),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date(),
    author: z.object({ name: z.string().min(1), type: z.enum(['Person', 'Organization']).default('Organization'), url: z.url().optional() }),
    category: z.string().min(1),
    tags: z.array(z.string()).default([]),
    featuredImage: z.string().optional(),
    featuredImageAlt: z.string().optional(),
    relatedServices: z.array(z.number().int().positive()).max(1).default([]),
    relatedArticles: z.array(z.number().int().positive()).default([]),
    blocks: z.array(articleBlock).min(1),
  }).superRefine((data, ctx) => {
    if (data.featuredImage && data.featuredImageAlt !== data.title) {
      ctx.addIssue({ code: 'custom', message: 'featuredImageAlt harus sama persis dengan title artikel.' });
    }
    if (data.updatedDate < data.pubDate) {
      ctx.addIssue({ code: 'custom', message: 'updatedDate tidak boleh lebih awal daripada pubDate.' });
    }
  }),
});
export const collections = { trainings, pages, schedules, articles };
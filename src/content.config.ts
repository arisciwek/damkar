import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

/**
 * Collection jenjang pelatihan (kelas D, C, B, A).
 * Data dipindah dari referensi/data/site.json → src/content/kelas/*.md
 */
const kelas = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/kelas' }),
  schema: z.object({
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
    facts: z.array(z.object({ value: z.string(), label: z.string() })),
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
    title: z.string().min(1),
    description: z.string().optional(),
    draft: z.boolean().default(false),
    blocks: z.array(pageBlock).min(1),
  }),
});

export const collections = { kelas, pages };
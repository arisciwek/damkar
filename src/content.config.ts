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

export const collections = { kelas };
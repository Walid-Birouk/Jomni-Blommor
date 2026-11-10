import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/** Services, one Markdown file per service and language: src/content/services/<lang>/<slug>.md */
const services = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/services' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string(),
      order: z.number(),
      image: image(),
      imageAlt: z.string(),
      /** Mark copy that still needs the client's text. */
      placeholder: z.boolean().default(true),
      /** Pre-selects the occasion in the order form. */
      occasion: z.enum(['bouquet', 'wedding', 'funeral', 'event']),
    }),
});

/** Seasonal banners (Alla hjärtans dag, Mors dag, studenten, midsommar, Allhelgona, jul). */
const copy = z.object({ title: z.string(), body: z.string(), cta: z.string(), imageAlt: z.string() });
const seasons = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/seasons' }),
  schema: ({ image }) => z.object({ active: z.boolean(), image: image(), sv: copy, en: copy }),
});

export const collections = { services, seasons };

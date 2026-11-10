import { defineCollection } from 'astro:content';
import { glob, file } from 'astro/loaders';
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

/**
 * Google reviews quoted on the site, word for word, in the reviewer's language.
 * TODO before launch: confirm with the client (and ideally the reviewers) that they may be quoted.
 */
const reviews = defineCollection({
  loader: file('src/content/reviews/reviews.json'),
  schema: z.object({
    name: z.string(),
    lang: z.enum(['sv', 'en']),
    rating: z.number().min(1).max(5),
    featured: z.boolean(),
    order: z.number(),
    text: z.string(),
  }),
});

export const collections = { services, seasons, reviews };

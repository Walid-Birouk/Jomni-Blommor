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
    }),
});

export const collections = { services };

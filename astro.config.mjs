// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// TODO: replace with the real domain once confirmed with the client.
const SITE = 'https://jomniblommor.example';

export default defineConfig({
  site: SITE,
  output: 'static',
  trailingSlash: 'always',
  i18n: {
    defaultLocale: 'sv',
    locales: ['sv', 'en'],
    routing: { prefixDefaultLocale: false },
  },
  // Fonts are downloaded at build time and self-hosted as woff2 (font-display: swap).
  // TODO: replace with the client's brand fonts if they have any.
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'Fraunces',
      cssVariable: '--font-display',
      weights: ['300 700'],
      styles: ['normal'],
      subsets: ['latin'],
      display: 'swap',
      fallbacks: ['Georgia', 'serif'],
    },
    {
      provider: fontProviders.fontsource(),
      name: 'Instrument Sans',
      cssVariable: '--font-body',
      weights: ['400 700'],
      styles: ['normal'],
      subsets: ['latin'],
      display: 'swap',
      fallbacks: ['system-ui', 'sans-serif'],
    },
  ],
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'sv',
        locales: { sv: 'sv', en: 'en' },
      },
      filter: (page) => !page.includes('/404') && !page.includes('/dev/'),
    }),
  ],
});

import sv from './sv.json';
import en from './en.json';

export const languages = { sv: 'Svenska', en: 'English' } as const;
export type Lang = keyof typeof languages;
export const defaultLang: Lang = 'sv';

const strings: Record<Lang, Record<string, string>> = { sv, en };
export type UiKey = keyof typeof sv;

/** Translate a UI key, replacing {placeholders} with values. */
export function t(lang: Lang, key: UiKey, vars: Record<string, string> = {}): string {
  const raw = strings[lang][key] ?? strings[defaultLang][key] ?? key;
  return raw.replace(/\{(\w+)\}/g, (_, name) => vars[name] ?? `{${name}}`);
}

export function getLangFromUrl(url: URL): Lang {
  const [, first] = url.pathname.split('/');
  return first === 'en' ? 'en' : 'sv';
}

/**
 * Page routes per language. Keys are stable route ids, used for hreflang
 * and the language switcher. Add every new page here in both languages.
 */
export const routes = {
  home: { sv: '/', en: '/en/' },
  notFound: { sv: '/404/', en: '/en/404/' },
} as const satisfies Record<string, Record<Lang, string>>;
export type RouteId = keyof typeof routes;

export function otherLang(lang: Lang): Lang {
  return lang === 'sv' ? 'en' : 'sv';
}

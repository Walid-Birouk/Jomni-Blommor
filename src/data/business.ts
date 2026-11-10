/**
 * Business facts for Jomni Blommor. Only confirmed values go here.
 * Every `null` is a TODO to confirm with the client (see CLAUDE.md section 2).
 * Components show a visible placeholder while a value is null.
 */
export interface Business {
  name: string;
  city: string | null;
  district: string | null;
  /** Neighbourhood phrase used in copy, per language. */
  locality: { sv: string; en: string } | null;
  geo: { latitude: number; longitude: number } | null;
  streetAddress: string | null;
  postalCode: string | null;
  /** E.164 format for tel: links, e.g. "+46812345678". */
  phoneE164: string | null;
  /** Swedish display format, e.g. "08-123 45 67". */
  phoneDisplay: string | null;
  email: string | null;
  /** Google or Apple Maps link for "Visa på karta". */
  mapUrl: string | null;
  /** One line per row, e.g. { days: 'Mån–fre', hours: '10:00–18:00' }. */
  openingHours: { sv: string; en: string; hours: string }[] | null;
  social: { label: string; url: string }[];
  /** Google rating as shown on the Google Maps listing. Not used in structured data. */
  googleRating: { rating: number; count: number; checked: string } | null;
}

export const business: Business = {
  name: 'Jomni Blommor',
  // Address, coordinates and map link: Google Maps listing checked 5 Nov 2026.
  // TODO: confirm with the client that the listing is current.
  city: 'Stockholm',
  district: 'Södermalm',
  locality: { sv: 'på Södermalm i Stockholm', en: 'on Södermalm in Stockholm' },
  geo: { latitude: 59.3186797, longitude: 18.0618168 },
  streetAddress: 'Hornsgatan 33A',
  postalCode: '118 49',
  phoneE164: null, // TODO: phone
  phoneDisplay: null, // TODO: phone
  email: null, // TODO: email
  mapUrl:
    'https://www.google.com/maps/place/Jomni+Blommor/@59.3186797,18.0592419,17z/data=!3m1!4b1!4m6!3m5!1s0x465f77eeaa85a707:0xb2d94a6d5b320287!8m2!3d59.3186797!4d18.0618168!16s%2Fg%2F11lnmpg9ny',
  openingHours: null, // TODO: opening hours incl. holiday hours
  social: [], // TODO: Instagram, Facebook, Google Business Profile
  // From the Google Maps listing checked 5 Nov 2026. TODO: refresh before launch, or fetch live
  // with the Places API once there is a key and the client's OK.
  googleRating: { rating: 4.8, count: 40, checked: '2026-11-05' },
};

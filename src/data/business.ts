/**
 * Business facts for Jomni Blommor. Only confirmed values go here.
 * Every `null` is a TODO to confirm with the client (see CLAUDE.md section 2).
 * Components show a visible placeholder while a value is null.
 */
export interface Business {
  name: string;
  city: string | null;
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
}

export const business: Business = {
  name: 'Jomni Blommor',
  city: null, // TODO: city
  streetAddress: null, // TODO: address
  postalCode: null, // TODO: postal code
  phoneE164: null, // TODO: phone
  phoneDisplay: null, // TODO: phone
  email: null, // TODO: email
  mapUrl: null, // TODO: map link
  openingHours: null, // TODO: opening hours incl. holiday hours
  social: [], // TODO: Instagram, Facebook, Google Business Profile
};

/**
 * Opening hours helpers: a compact grouped summary ("Mån–fre 09:30–18:30"), structured data
 * for Google, and the live "open now" status. Pure functions, used at build time and in the browser.
 */
export type Day = { opens: string; closes: string } | null;
export type Week = Day[]; // index 0 = Monday

const SHORT = {
  sv: ['mån', 'tis', 'ons', 'tor', 'fre', 'lör', 'sön'],
  en: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
};
const SCHEMA_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const same = (a: Day, b: Day) => (a === null && b === null) || (!!a && !!b && a.opens === b.opens && a.closes === b.closes);
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Runs of consecutive days with the same hours, e.g. [{ label: 'Mån–fre', hours: '09:30–18:30' }]. */
export function groupHours(week: Week, lang: 'sv' | 'en', closed: string) {
  const rows: { label: string; hours: string }[] = [];
  let start = 0;
  for (let i = 1; i <= week.length; i++) {
    if (i === week.length || !same(week[i], week[start])) {
      const names = SHORT[lang];
      const label = i - 1 === start ? cap(names[start]) : `${cap(names[start])}–${names[i - 1]}`;
      const d = week[start];
      rows.push({ label, hours: d ? `${d.opens}–${d.closes}` : closed });
      start = i;
    }
  }
  return rows;
}

/** schema.org openingHoursSpecification, one entry per set of identical hours. */
export function hoursSchema(week: Week) {
  const out: { '@type': string; dayOfWeek: string[]; opens: string; closes: string }[] = [];
  week.forEach((d, i) => {
    if (!d) return;
    const match = out.find((o) => o.opens === d.opens && o.closes === d.closes);
    if (match) match.dayOfWeek.push(SCHEMA_DAYS[i]);
    else out.push({ '@type': 'OpeningHoursSpecification', dayOfWeek: [SCHEMA_DAYS[i]], opens: d.opens, closes: d.closes });
  });
  return out;
}

/** Whether the shop is open at `now`, judged in Stockholm time, and the next relevant time. */
export function hoursStatus(week: Week, now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Stockholm', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(now);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '';
  const day = SHORT.en.indexOf(get('weekday'));
  const minutes = Number(get('hour')) * 60 + Number(get('minute'));
  const toMin = (t: string) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
  const today = week[day];
  if (today && minutes >= toMin(today.opens) && minutes < toMin(today.closes)) return { open: true as const, time: today.closes };
  if (today && minutes < toMin(today.opens)) return { open: false as const, time: today.opens, when: 'today' as const };
  for (let k = 1; k <= 7; k++) {
    const d = week[(day + k) % 7];
    if (d) return { open: false as const, time: d.opens, when: k === 1 ? ('tomorrow' as const) : ('later' as const), day: (day + k) % 7 };
  }
  return null;
}

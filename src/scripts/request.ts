/**
 * The shop's request list: products a visitor wants to order, kept for this visit in
 * sessionStorage (a per-visitor convenience; it is never sent anywhere by itself).
 * The request bar turns it into a link to the contact form with the products filled in.
 */
const KEY = 'jomni-request';
type Listener = (items: string[]) => void;
const listeners = new Set<Listener>();

function read(): string[] {
  try {
    const raw = sessionStorage.getItem(KEY);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list.filter((x) => typeof x === 'string').slice(0, 30) : [];
  } catch { return []; }
}
function write(items: string[]) {
  try { sessionStorage.setItem(KEY, JSON.stringify(items)); } catch { /* storage unavailable: list lives in memory */ }
  memory = items;
  listeners.forEach((fn) => fn(items));
}
let memory = read();

export const getItems = () => memory;
export const addItem = (name: string) => write([...memory, name]);
export const clearItems = () => write([]);
export const onChange = (fn: Listener) => { listeners.add(fn); fn(memory); };

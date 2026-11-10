/**
 * Draws the bouquet builder's live preview (drawn on a 400 x 420 canvas, shown from y = 70) from the visitor's choices.
 * Runs in the browser and reuses the site's line-drawn flower parts.
 */
import { INK } from '../lib/botanical';
import { roseHead, radial, leaf } from '../lib/product-art';

export type Choice = { size: string; colors: string; flowers: string[] };

const PALETTES: Record<string, string[]> = {
  'pink-white': ['#e3a3b5', '#fbfbf8', '#f1d5dc', '#c25a78'],
  red: ['#9e2f4f', '#b4405f', '#7f2440', '#c25a78'],
  'white-green': ['#fbfbf8', '#eef0e6', '#f7f4ee', '#dfe6d8'],
  'yellow-orange': ['#e8b83a', '#f0a35e', '#f6d58e', '#e9874f'],
  'purple-blue': ['#8e7aa8', '#7f7fb0', '#b9a9d0', '#6d6a9c'],
  florist: ['#e3a3b5', '#9e2f4f', '#fbfbf8', '#e8b83a', '#8e7aa8'],
};
const SIZES: Record<string, number> = { small: 7, medium: 11, large: 16 };
const n = (v: number) => v.toFixed(1);
const line = (w: number) => `stroke="${INK}" stroke-width="${w}" vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round"`;

// Seeded random so the same choices always draw the same bouquet.
function rng(seed: number) {
  let s = seed % 2147483647 || 1;
  return (a: number, b: number) => a + ((s = (s * 16807) % 2147483647) / 2147483647) * (b - a);
}

function head(kind: string, x: number, y: number, s: number, color: string, r: (a: number, b: number) => number) {
  switch (kind) {
    case 'roses': return roseHead(x, y, s * 1.2, color);
    case 'peonies': {
      let p = '';
      [1, 0.75, 0.5].forEach((k, i) => {
        for (let j = 0; j < 7; j++) {
          const a = (j / 7) * 360 + i * 20;
          p += `<ellipse cx="${n(x)}" cy="${n(y - s * 0.42 * k)}" rx="${n(s * 0.34 * k)}" ry="${n(s * 0.42 * k)}" transform="rotate(${n(a)} ${n(x)} ${n(y)})" fill="${color}" ${line(0.9)}/>`;
        }
      });
      return p;
    }
    case 'tulips':
      return `<path d="M${n(x - s * 0.5)} ${n(y - s * 0.2)} Q${n(x - s * 0.55)} ${n(y + s * 0.7)} ${n(x)} ${n(y + s * 0.7)} Q${n(x + s * 0.55)} ${n(y + s * 0.7)} ${n(x + s * 0.5)} ${n(y - s * 0.2)} L${n(x + s * 0.22)} ${n(y + s * 0.05)} L${n(x)} ${n(y - s * 0.45)} L${n(x - s * 0.22)} ${n(y + s * 0.05)} Z" fill="${color}" ${line(1.2)}/>`;
    case 'chrysanthemums': return radial(x, y, s * 0.9, 18, color, '#e8c95a', 0.14);
    case 'sunflowers': return radial(x, y, s, 14, '#e8b83a', '#6b4a2b', 0.2);
    case 'thistles': {
      let p = '';
      for (let i = 0; i < 10; i++) {
        const a = Math.PI * (1.05 + (i / 9) * 0.9);
        p += `<path d="M${n(x)} ${n(y)} L${n(x + Math.cos(a) * s * 0.6)} ${n(y + Math.sin(a) * s * 0.6)}" ${line(1)}/>`;
      }
      return p + `<ellipse cx="${n(x)}" cy="${n(y)}" rx="${n(s * 0.34)}" ry="${n(s * 0.42)}" fill="#7f7fb0" ${line(1)}/>`;
    }
    case 'gypsophila': {
      let p = '';
      for (let i = 0; i < 8; i++) p += `<circle cx="${n(x + r(-s * 0.6, s * 0.6))}" cy="${n(y + r(-s * 0.5, s * 0.4))}" r="3.2" fill="#fbfbf8" ${line(0.8)}/>`;
      return p;
    }
    case 'eucalyptus': {
      let p = '';
      for (let i = 0; i < 4; i++) p += `<circle cx="${n(x + (i % 2 ? 8 : -8))}" cy="${n(y + i * 14)}" r="${n(9 - i)}" fill="#9fb5ab" ${line(1)}/>`;
      return p;
    }
    default: return radial(x, y, s * 0.8, 8, color, '#c9a24a', 0.28);
  }
}

export function drawBouquet(choice: Choice): string {
  const count = SIZES[choice.size] ?? SIZES.medium;
  const palette = PALETTES[choice.colors] ?? PALETTES.florist;
  const blooms = choice.flowers.filter((f) => f !== 'eucalyptus' && f !== 'gypsophila');
  const kinds = blooms.length ? blooms : ['roses', 'peonies', 'chrysanthemums'];
  const fillers = choice.flowers.filter((f) => f === 'eucalyptus' || f === 'gypsophila');
  const seed = [...`${choice.size}${choice.colors}${choice.flowers.join()}`].reduce((a, c) => a + c.charCodeAt(0) * 7, 11);
  const r = rng(seed);
  const BX = 200, BY = 372; // where the stems are tied
  const s = 30 - count * 0.5; // bloom size shrinks a little as the bouquet fills
  let stems = '', heads = '', green = '';

  // Greenery behind the flowers.
  for (let i = 0; i < 7 + count / 2; i++) {
    const a = -165 + (i / (6 + count / 2)) * 150 + r(-8, 8);
    green += leaf(BX + r(-14, 14), 300 - r(0, 24), r(56, 84), a, i % 2 ? '#cfdcc8' : '#dfe6d8');
  }
  // Blooms sit in a dome above the wrap's mouth, spread evenly with a sunflower spiral
  // (golden angle) folded into the upper half, so any size reads as a rounded hand-tied bouquet.
  const total = count + fillers.length * 3;
  const R = 92 + count * 4.2; // dome radius grows with the size
  const CX = 200, CY = 286;
  const spots: { x: number; y: number; i: number }[] = [];
  for (let i = 0; i < total; i++) {
    const rr = R * Math.sqrt((i + 0.6) / total);
    const phi = ((i * 137.508) % 180) * (Math.PI / 180);
    spots.push({ x: CX + Math.cos(phi) * rr * 1.12 + r(-5, 5), y: CY - Math.sin(phi) * rr * 0.95 - 18 + r(-5, 5), i });
  }
  // Stems first, then lower blooms before higher ones so the dome overlaps naturally.
  for (const p of spots) {
    stems += `<path class="b-line" pathLength="1" d="M${BX + r(-6, 6)} ${BY} Q${n(BX + (p.x - BX) * 0.25)} ${n(BY - 50)} ${n(p.x)} ${n(p.y)}" fill="none" ${line(1.5)}/>`;
  }
  spots.sort((a, b) => b.y - a.y);
  for (const p of spots) {
    const isFiller = p.i >= count;
    const kind = isFiller ? fillers[(p.i - count) % fillers.length] : kinds[p.i % kinds.length];
    heads += head(kind, p.x, p.y, s, palette[p.i % palette.length], r);
  }
  // Kraft paper wrap: a back flap behind, a front cone in front, running off the bottom.
  const back = `<path d="M124 320 L86 196 Q146 222 200 220 Q254 222 314 196 L276 320 Z" fill="#d9c2a0" ${line(1.2)}/>`;
  const front = `<path d="M128 318 L162 430 L238 430 L272 318 Q200 352 128 318 Z" fill="#e6d2b2" ${line(1.2)}/>` +
    `<path d="M150 360 Q200 378 250 360" fill="none" stroke="#a08a68" stroke-width="4" stroke-linecap="round"/>` +
    `<path d="M196 368 Q184 392 178 404 M204 368 Q214 390 222 402" fill="none" stroke="#a08a68" stroke-width="3" stroke-linecap="round"/>`;
  return `${back}<g class="pv-grow">${stems}${green}${heads}</g>${front}`;
}

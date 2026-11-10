/**
 * Line-drawn product illustrations for shop items without a photo, in the same hand
 * as src/lib/botanical.ts. Returns SVG markup for a 240 x 240 viewBox. Build-time only.
 */
import { botanical, INK } from './botanical';

export type ArtKind =
  | 'rose' | 'rose-mix' | 'sunflower' | 'chrysanthemum' | 'eucalyptus' | 'thistle' | 'gyps'
  | 'orchid' | 'cactus' | 'plant' | 'plant-red' | 'plant-white' | 'pot' | 'saucer';

const n = (v: number) => v.toFixed(1);
const line = (w: number) => `stroke="${INK}" stroke-width="${w}" vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round"`;
const stem = (x1: number, y1: number, cx: number, cy: number, x2: number, y2: number) =>
  `<path class="b-line" pathLength="1" d="M${n(x1)} ${n(y1)} Q${n(cx)} ${n(cy)} ${n(x2)} ${n(y2)}" fill="none" ${line(1.6)}/>`;

/** A rose seen from the side: cupped bloom with a scalloped rim, folded front petals and sepals. */
const roseHead = (x: number, y: number, s: number, fill: string) =>
  `<path d="M${n(x - s * 0.34)} ${n(y + s * 0.42)} L${n(x - s * 0.12)} ${n(y + s * 0.62)} L${n(x)} ${n(y + s * 0.46)} L${n(x + s * 0.12)} ${n(y + s * 0.62)} L${n(x + s * 0.34)} ${n(y + s * 0.42)}" fill="#a8bfa0" ${line(1.1)}/>` +
  `<path d="M${n(x - s * 0.6)} ${n(y - s * 0.12)} C${n(x - s * 0.6)} ${n(y + s * 0.56)} ${n(x + s * 0.6)} ${n(y + s * 0.56)} ${n(x + s * 0.6)} ${n(y - s * 0.12)} Q${n(x + s * 0.46)} ${n(y - s * 0.56)} ${n(x + s * 0.16)} ${n(y - s * 0.44)} Q${n(x)} ${n(y - s * 0.76)} ${n(x - s * 0.16)} ${n(y - s * 0.44)} Q${n(x - s * 0.46)} ${n(y - s * 0.56)} ${n(x - s * 0.6)} ${n(y - s * 0.12)} Z" fill="${fill}" ${line(1.3)}/>` +
  `<path d="M${n(x - s * 0.38)} ${n(y - s * 0.18)} Q${n(x)} ${n(y + s * 0.3)} ${n(x + s * 0.38)} ${n(y - s * 0.18)} M${n(x - s * 0.14)} ${n(y - s * 0.4)} Q${n(x)} ${n(y - s * 0.14)} ${n(x + s * 0.14)} ${n(y - s * 0.4)}" fill="none" ${line(1.1)}/>`;

const radial = (x: number, y: number, s: number, count: number, petal: string, center: string, thin = 0.26) => {
  let p = '';
  for (let i = 0; i < count; i++) {
    const a = (i / count) * 360;
    p += `<ellipse cx="${n(x)}" cy="${n(y - s * 0.55)}" rx="${n(s * thin)}" ry="${n(s * 0.5)}" transform="rotate(${n(a)} ${n(x)} ${n(y)})" fill="${petal}" ${line(1)}/>`;
  }
  return p + `<circle cx="${n(x)}" cy="${n(y)}" r="${n(s * 0.32)}" fill="${center}" ${line(1.1)}/>`;
};

const leaf = (x: number, y: number, len: number, ang: number, fill = '#dfe6d8') =>
  `<path d="M${n(x)} ${n(y)} q${n(len * 0.35)} ${n(-len * 0.25)} ${n(len)} 0 q${n(-len * 0.45)} ${n(len * 0.3)} ${n(-len)} 0 Z" transform="rotate(${n(ang)} ${n(x)} ${n(y)})" fill="${fill}" ${line(1.2)}/>`;

const pot = (fill: string, top = 150, w = 92, h = 64) => {
  const x = 120 - w / 2, x2 = 120 + w / 2;
  return `<path d="M${n(x + 8)} ${top + 14} L${n(x + 18)} ${top + h} L${n(x2 - 18)} ${top + h} L${n(x2 - 8)} ${top + 14} Z" fill="${fill}" ${line(1.4)}/>` +
    `<rect x="${n(x)}" y="${top}" width="${w}" height="16" rx="3" fill="${fill}" ${line(1.4)}/>`;
};
const ground = `<ellipse cx="120" cy="218" rx="70" ry="6" fill="rgb(30 42 36 / 0.08)"/>`;

/** A loose hand-tied bunch: stems fanning from a tie, heads drawn by `drawHead`. */
const bunch = (count: number, drawHead: (x: number, y: number, i: number) => string, spread = 64) => {
  const { r } = botanical(count * 13 + spread);
  let stems = '', heads = '';
  for (let i = 0; i < count; i++) {
    const t = count === 1 ? 0.5 : i / (count - 1);
    const hx = 120 + (t - 0.5) * spread * 2 + r(-6, 6);
    const hy = 70 + Math.abs(t - 0.5) * 50 + r(-8, 8);
    stems += stem(120, 214, 120 + (hx - 120) * 0.4, 160, hx, hy);
    heads += drawHead(hx, hy, i);
  }
  const tie = `<path d="M108 182 Q120 188 132 182" fill="none" stroke="#a08a68" stroke-width="3" stroke-linecap="round"/>`;
  return `${stems}${tie}<g class="b-bloom">${leaf(112, 170, 30, -130)}${leaf(128, 166, 30, -50)}${heads}</g>`;
};

export function productArt(kind: ArtKind): string {
  const { r } = botanical(kind.length * 31);
  switch (kind) {
    case 'rose':
      return bunch(3, (x, y) => roseHead(x, y, 34, '#9e2f4f'), 46);
    case 'rose-mix': {
      const c = ['#9e2f4f', '#e3a3b5', '#fbfbf8', '#c25a78', '#f1d5dc'];
      return bunch(5, (x, y, i) => roseHead(x, y, 28, c[i % c.length]), 62);
    }
    case 'sunflower':
      return bunch(1, (x, y) => radial(x, y + 10, 46, 16, '#e8b83a', '#6b4a2b', 0.2));
    case 'chrysanthemum':
      return bunch(4, (x, y) => radial(x, y, 24, 18, '#fbfbf8', '#e8c95a', 0.14), 52);
    case 'thistle':
      return bunch(5, (x, y) => {
        let spikes = '';
        for (let i = 0; i < 10; i++) {
          const a = Math.PI * (1.05 + (i / 9) * 0.9);
          spikes += `<path d="M${n(x)} ${n(y)} L${n(x + Math.cos(a) * 16)} ${n(y + Math.sin(a) * 16)}" ${line(1)}/>`;
        }
        return spikes + `<ellipse cx="${n(x)}" cy="${n(y)}" rx="9" ry="11" fill="#7f7fb0" ${line(1.1)}/>` +
          `<path d="M${n(x - 14)} ${n(y + 12)} L${n(x)} ${n(y + 6)} L${n(x + 14)} ${n(y + 12)}" fill="none" ${line(1)}/>`;
      }, 58);
    case 'gyps':
      return bunch(6, (x, y) => {
        let dots = '';
        for (let i = 0; i < 9; i++) dots += `<circle cx="${n(x + r(-16, 16))}" cy="${n(y + r(-12, 10))}" r="3.4" fill="#fbfbf8" ${line(0.8)}/>`;
        return dots;
      }, 60);
    case 'eucalyptus':
      return bunch(4, (x, y) => {
        let leaves = '';
        for (let i = 0; i < 5; i++) {
          const yy = y + i * 18, side = i % 2 ? 1 : -1;
          leaves += `<circle cx="${n(x + side * 9)}" cy="${n(yy)}" r="${n(10 - i)}" fill="#9fb5ab" ${line(1)}/>`;
        }
        return leaves;
      }, 50);
    case 'orchid': {
      let blooms = '';
      [[150, 64], [168, 80], [178, 102], [182, 126]].forEach(([x, y], i) => {
        let p = '';
        for (let k = 0; k < 5; k++) p += `<ellipse cx="${x}" cy="${n(y - 9)}" rx="6" ry="10" transform="rotate(${k * 72} ${x} ${y})" fill="${i % 2 ? '#f1d5dc' : '#fbfbf8'}" ${line(1)}/>`;
        blooms += p + `<circle cx="${x}" cy="${y}" r="3.2" fill="#c25a78" ${line(0.8)}/>`;
      });
      return `${ground}${stem(118, 150, 118, 70, 150, 60)}<g class="b-bloom">${leaf(120, 152, 52, -165, '#cfdcc8')}${leaf(120, 152, 50, -15, '#cfdcc8')}${blooms}</g>${pot('#e9e4da', 150)}`;
    }
    case 'cactus':
      return `${ground}<g class="b-bloom"><path d="M100 152 L100 84 Q100 56 120 56 Q140 56 140 84 L140 152 Z" fill="#a8bfa0" ${line(1.4)}/>` +
        `<path d="M110 150 V80 M120 150 V64 M130 150 V80" fill="none" ${line(1)}/>` +
        `<path d="M100 112 Q78 112 78 92 L78 84" fill="none" ${line(1.4)}/><path d="M140 102 Q160 102 160 82" fill="none" ${line(1.4)}/></g>${pot('#b0785a')}`;
    case 'plant':
    case 'plant-red':
    case 'plant-white': {
      const flower = kind === 'plant-red' ? '#9e2f4f' : kind === 'plant-white' ? '#fbfbf8' : null;
      let leaves = '';
      [-150, -125, -100, -80, -55, -30].forEach((a, i) => { leaves += leaf(120, 150, 44 + (i % 2) * 10, a, i % 2 ? '#cfdcc8' : '#dfe6d8'); });
      let flowers = '';
      if (flower) [[96, 98], [120, 84], [146, 100]].forEach(([x, y]) => { flowers += radial(x, y, 16, 6, flower, '#e8c95a', 0.3); });
      return `${ground}<g class="b-bloom">${leaves}${flowers}</g>${pot('#b0785a')}`;
    }
    case 'pot':
      return `${ground}${pot('#b0785a', 110, 110, 96)}<g transform="translate(58 0)">${pot('#a3a8a5', 150, 64, 58)}</g>`;
    case 'saucer':
      return `${ground}<path d="M52 186 L66 206 L174 206 L188 186 Z" fill="#b0785a" ${line(1.4)}/><path d="M82 168 L92 182 L148 182 L158 168 Z" fill="#a3a8a5" ${line(1.4)}/>`;
  }
}

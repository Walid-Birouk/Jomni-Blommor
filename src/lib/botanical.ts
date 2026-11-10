/**
 * Line-drawn botanical art in one hand: the hero meadow, section edges and flower stamps.
 * Build-time only; returns SVG markup strings. Deterministic, so every build draws the same.
 */
export const INK = '#3e5b40';
const fills = { peony: '#9e2f4f', rose: '#c25a78', blush: '#e3a3b5', pale: '#f1d5dc', white: '#fbfbf8' };
const kinds = ['cosmos', 'tulip', 'umbel', 'bud', 'cosmos', 'grass', 'umbel', 'tulip'] as const;
export type FlowerKind = 'cosmos' | 'tulip' | 'umbel' | 'bud';
export type Stem = {
  x: number; h: number; svg: string; phase: number; delay: number;
  /** Bounding box of the drawing in the meadow's viewBox, so each stem can be its own layer. */
  box: { x: number; y: number; w: number; h: number };
};
const n = (v: number) => v.toFixed(1);

/** Make a drawing kit with its own seeded random. `ink` is the line colour. */
export function botanical(seed: number, ink = INK, leafFill = '#dfe6d8') {
  let state = seed;
  const rnd = () => ((state = (state * 16807) % 2147483647) / 2147483647);
  const r = (a: number, b: number) => a + rnd() * (b - a);
  const line = (w: number) => `stroke="${ink}" stroke-width="${w}" vector-effect="non-scaling-stroke"`;

  const leafAt = (x: number, y: number, len: number, ang: number) =>
    `<path d="M${n(x)} ${n(y)} q${n(len * 0.35)} ${n(-len * 0.25)} ${n(len)} 0 q${n(-len * 0.45)} ${n(len * 0.3)} ${n(-len)} 0 Z" transform="rotate(${n(ang)} ${n(x)} ${n(y)})" fill="${leafFill}" ${line(1.3)}/>`;

  const head = (kind: string, x: number, y: number, s: number) => {
    if (kind === 'cosmos') {
      const c = [fills.blush, fills.pale, fills.rose, fills.white][Math.floor(r(0, 4))];
      let p = '';
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * 360;
        p += `<ellipse cx="${n(x)}" cy="${n(y - s * 0.55)}" rx="${n(s * 0.28)}" ry="${n(s * 0.55)}" transform="rotate(${a} ${n(x)} ${n(y)})" fill="${c}" fill-opacity="0.9" ${line(1.1)}/>`;
      }
      return p + `<circle cx="${n(x)}" cy="${n(y)}" r="${n(s * 0.2)}" fill="#c9a24a" ${line(1.1)}/>`;
    }
    if (kind === 'tulip') {
      const c = rnd() > 0.5 ? fills.peony : fills.rose;
      return `<path d="M${n(x - s * 0.5)} ${n(y - s * 0.2)} Q${n(x - s * 0.55)} ${n(y + s * 0.7)} ${n(x)} ${n(y + s * 0.7)} Q${n(x + s * 0.55)} ${n(y + s * 0.7)} ${n(x + s * 0.5)} ${n(y - s * 0.2)} L${n(x + s * 0.22)} ${n(y + s * 0.05)} L${n(x)} ${n(y - s * 0.45)} L${n(x - s * 0.22)} ${n(y + s * 0.05)} Z" fill="${c}" fill-opacity="0.92" ${line(1.2)}/>`;
    }
    if (kind === 'umbel') {
      let p = '';
      for (let i = 0; i < 9; i++) {
        const a = Math.PI * (1.1 + (i / 8) * 0.8);
        const ex = x + Math.cos(a) * s * 0.9, ey = y + Math.sin(a) * s * 0.7;
        p += `<path d="M${n(x)} ${n(y + s * 0.3)} L${n(ex)} ${n(ey)}" ${line(1)}/>`;
        p += `<circle cx="${n(ex)}" cy="${n(ey)}" r="${n(s * 0.13)}" fill="${fills.white}" ${line(0.9)}/>`;
      }
      return p;
    }
    if (kind === 'bud') {
      return `<path d="M${n(x)} ${n(y - s * 0.7)} Q${n(x + s * 0.45)} ${n(y)} ${n(x)} ${n(y + s * 0.4)} Q${n(x - s * 0.45)} ${n(y)} ${n(x)} ${n(y - s * 0.7)} Z" fill="${fills.blush}" ${line(1.2)}/>`;
    }
    return '';
  };

  /**
   * One meadow. `height(t)` gives each stem's height as a share of H for its position
   * t (0 = left, 1 = right); `scale` sizes the flower heads. Stems carry pathLength="1"
   * and class "b-line" so they can draw themselves in.
   */
  const meadow = (W: number, H: number, count: number, height: (t: number) => number, scale: number) => {
    const stems: Stem[] = [];
    for (let i = 0; i < count; i++) {
      const x = 16 + (i / (count - 1)) * (W - 32) + r(-10, 10);
      const t = x / W;
      const h = H * height(t);
      const kind = kinds[i % kinds.length];
      const bend = r(-30, 30);
      const tx = x + bend * 0.6, ty = H - h;
      let svg = `<path class="b-line" pathLength="1" d="M${n(x)} ${H} Q${n(x + bend)} ${n(H - h * 0.55)} ${n(tx)} ${n(ty)}" fill="none" ${line(1.5)} stroke-linecap="round"/>`;
      const leaves = kind === 'grass' ? 0 : Math.round(r(1, 3));
      let bloom = '';
      for (let k = 0; k < leaves; k++) {
        const u = r(0.2, 0.6);
        const lx = x + (bend * 2 * (1 - u) * u) + (tx - x) * u * u;
        const ly = H - h * 0.55 * 2 * (1 - u) * u - h * u * u;
        bloom += leafAt(lx, ly, r(20, 34) * scale, k % 2 ? r(-160, -120) : r(-60, -20));
      }
      if (kind === 'grass') {
        svg = `<path class="b-line" pathLength="1" d="M${n(x)} ${H} Q${n(x + bend)} ${n(H - h * 0.5)} ${n(x + bend * 1.4)} ${n(H - h * 0.75)}" fill="none" ${line(1.3)} stroke-linecap="round"/>`;
      } else {
        // Leaves and the flower head open after the stem has drawn (class "b-bloom").
        svg += `<g class="b-bloom">${bloom}${head(kind, tx, ty, r(18, 28) * scale)}</g>`;
      }
      // Arrival: growth rolls left to right like the wind, with a little jitter.
      // Generous box around stem, leaves and head (head size up to 28 * scale, leaves up to 34 * scale).
      const pad = 42 * scale;
      const minX = Math.min(x, x + bend * 1.4, tx) - pad, maxX = Math.max(x, x + bend * 1.4, tx) + pad;
      const minY = Math.max(0, H - h - pad);
      const box = { x: minX, y: minY, w: maxX - minX, h: H - minY };
      stems.push({ x, h, svg, phase: rnd() * 6.28, delay: Math.round(t * 450 + r(0, 120)), box });
    }
    return stems;
  };

  /** A single flower on a short curved stem with one leaf, for stamps (viewBox 0 0 60 80). */
  const stamp = (kind: FlowerKind) => {
    const stemPath = `<path class="b-line" pathLength="1" d="M30 78 Q24 56 30 34" fill="none" ${line(1.5)} stroke-linecap="round"/>`;
    return stemPath + `<g class="b-bloom">${leafAt(28, 60, 20, -40)}${head(kind, 30, 30, 22)}</g>`;
  };

  return { r, meadow, head, leafAt, stamp };
}

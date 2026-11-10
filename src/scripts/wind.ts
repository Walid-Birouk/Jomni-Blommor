/**
 * Shared wind for the hero: one breeze, one animation loop.
 * The falling petals and the bouquet both subscribe, so a gust moves them together.
 * The loop only runs while the hero is on screen, the tab is visible, the user has
 * not paused it, and the user has not asked for reduced motion.
 */
type Tick = (dt: number, now: number) => void;
type Listener = () => void;
/** Client (viewport) coordinates. */
type Emit = (x: number, y: number, color: string) => void;

const ticks = new Set<Tick>();
const stateListeners = new Set<Listener>();
const emitters = new Set<Emit>();

export const wind = {
  /** Steady breeze, px/s to the right. */
  base: 24,
  /** Extra wind from gusts, decays over a few seconds. */
  gust: 0,
  paused: false,
  visible: true,
  reduced: false,
  pointer: { x: -1e4, y: -1e4, vx: 0, vy: 0, active: false, type: 'mouse' },
  /** Set when the device keeps missing frames; subscribers then do less work. */
  lowPower: false,
  /** Counts frames, so low-power subscribers can update every other one. */
  frame: 0,
};

let raf = 0;
let last = 0;
let nextGust = 0;
let started = false;

// Smoothed frame time. Above ~22 ms for a couple of seconds means the device is struggling.
let avgMs = 16.7;
let slowFor = 0;
const frame = (now: number) => {
  const raw = now - last;
  const dt = Math.min(raw / 1000, 0.05);
  last = now;
  wind.frame++;
  avgMs += (Math.min(raw, 100) - avgMs) * 0.05;
  slowFor = avgMs > 22 ? slowFor + dt : 0;
  if (!wind.lowPower && slowFor > 2) wind.lowPower = true;
  if (now > nextGust) {
    wind.gust += 60 + Math.random() * 80;
    nextGust = now + 7000 + Math.random() * 6000;
  }
  wind.gust *= Math.pow(0.55, dt);
  wind.pointer.vx *= Math.pow(0.02, dt);
  wind.pointer.vy *= Math.pow(0.02, dt);
  ticks.forEach((fn) => fn(dt, now));
  raf = requestAnimationFrame(frame);
};

function update() {
  const run = started && !wind.paused && wind.visible && !document.hidden && !wind.reduced;
  if (run && !raf) {
    last = performance.now();
    raf = requestAnimationFrame(frame);
  } else if (!run && raf) {
    cancelAnimationFrame(raf);
    raf = 0;
  }
  stateListeners.forEach((fn) => fn());
}

export const isRunning = () => raf !== 0;
export const onTick = (fn: Tick) => void ticks.add(fn);
export const onState = (fn: Listener) => void stateListeners.add(fn);
export const onEmit = (fn: Emit) => void emitters.add(fn);
export const emit: Emit = (x, y, color) => emitters.forEach((fn) => fn(x, y, color));

/** Add to the current gust (scrolling, pointer movement). */
export function stir(amount: number) {
  if (raf) wind.gust = Math.min(wind.gust + amount, 220);
}

/** Set the gust directly, e.g. the opening gust on load. */
export function gustNow(amount: number) {
  wind.gust = amount;
  nextGust = performance.now() + 9000;
}

export function setPaused(value: boolean) {
  wind.paused = value;
  update();
}

export function startWind(host: Element) {
  if (started) return;
  started = true;

  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  wind.reduced = mq.matches;
  mq.addEventListener('change', () => {
    wind.reduced = mq.matches;
    update();
  });

  new IntersectionObserver(([entry]) => {
    wind.visible = entry.isIntersecting;
    update();
  }).observe(host);
  document.addEventListener('visibilitychange', update);

  let lastY = window.scrollY;
  window.addEventListener('scroll', () => {
    const dy = Math.abs(window.scrollY - lastY);
    lastY = window.scrollY;
    stir(Math.min(dy * 0.6, 40));
  }, { passive: true });

  let lastT = 0;
  window.addEventListener('pointermove', (e) => {
    const p = wind.pointer;
    const now = performance.now();
    const dt = Math.max((now - lastT) / 1000, 0.008);
    if (p.active) {
      p.vx = (e.clientX - p.x) / dt;
      p.vy = (e.clientY - p.y) / dt;
    }
    p.x = e.clientX;
    p.y = e.clientY;
    p.active = true;
    p.type = e.pointerType;
    lastT = now;
    if (e.pointerType === 'mouse') stir(Math.min(Math.abs(p.vx) * 0.004, 10));
  }, { passive: true });
  document.documentElement.addEventListener('pointerleave', () => { wind.pointer.active = false; });
  window.addEventListener('pointerup', (e) => {
    if (e.pointerType !== 'mouse') wind.pointer.active = false;
  }, { passive: true });

  update();
}

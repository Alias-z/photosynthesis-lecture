// Lead page for slide C2 (Rubisco), which opens the Rubisco chunk (28 Oct 2026; draft): the question alone, one full-page
// drawing (viewBox 1600 x 900). Slide C2 answers it (Rubisco is slow, so a C₃ leaf holds ≈ 20 % of its nitrogen in it).
// Never reveals: Rubisco, protein, enzyme, the 20 %.
// Photo: Patrick Alexander, "Triticum aestivum", Wikimedia Commons, CC0 (photos/cr-ear.jpg; assets/SOURCES-cr.md).
// Nitrogen atoms are the deck's N balls (rf-kit beads: #9dbbdb, ring #3f6f99, letter N).
import type { Variant } from '../types';
import './leadC2.css';
import earJpg from '../../assets/photos/cr-ear.jpg';

export const VARIANTS: Variant[] = [
  { id: 'a', name: 'Wheat ear (photo)' },
  { id: 'b', name: 'Fertiliser pellets over a wheat field (drawn)' },
  { id: 'c', name: 'Nitrogen atoms falling onto the wheat (photo + glyphs)' },
];

type Pt = [number, number];
const f = (v: number): string => v.toFixed(1);
const svg = (label: string, body: string): string => `<svg class="flc2" viewBox="0 0 1600 900" role="img" aria-label="${label}">${body}</svg>`;
const T = (x: number, y: number, s: string, cls: string, a: 'start' | 'middle' | 'end' = 'start'): string =>
  `<text class="${cls}" x="${f(x)}" y="${f(y)}" text-anchor="${a}">${s}</text>`;
function ask(x: number, y: number, size: number, lines: string[], gap = 1.14): string {
  return `<text class="lead-q" x="${x}" y="${y}" font-size="${size}">${lines.map((s, i) => `<tspan x="${x}" dy="${i ? f(size * gap) : 0}">${s}</tspan>`).join('')}</text>`;
}
const Q = ['Why do farmers spread', 'so much nitrogen fertiliser', 'on a wheat field?'];
const CR = 'Photo: Patrick Alexander, CC0';
const credit = (s: string): string => T(96, 866, s, 'flc2-credit');

/** The wheat photo (1200 × 800) printed on the paper: window win covers the box, rounded, on a mat with a soft shadow. */
function photo(id: string, x: number, y: number, w: number, h: number, win: [number, number, number, number]): string {
  const [u0, v0, uw, vh] = win, s = Math.max(w / uw, h / vh);
  const ix = x - u0 * s + (w - uw * s) / 2, iy = y - v0 * s + (h - vh * s) / 2;
  return `<defs><clipPath id="${id}-c"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="20"/></clipPath>
    <filter id="${id}-sh" x="-10%" y="-10%" width="120%" height="125%"><feDropShadow dx="0" dy="10" stdDeviation="12" flood-color="#46321a" flood-opacity=".22"/></filter></defs>
    <rect class="flc2-mat" x="${x}" y="${y}" width="${w}" height="${h}" rx="20" filter="url(#${id}-sh)"/>
    <g clip-path="url(#${id}-c)"><image href="${earJpg}" x="${f(ix)}" y="${f(iy)}" width="${f(1200 * s)}" height="${f(800 * s)}" preserveAspectRatio="none"/></g>
    <rect class="flc2-edge" x="${x}" y="${y}" width="${w}" height="${h}" rx="20"/>`;
}
/** A nitrogen atom: the deck's N ball with its letter. */
const nBall = (x: number, y: number, r = 20): string =>
  `<circle class="flc2-n" cx="${f(x)}" cy="${f(y)}" r="${r}"/>${T(x, y + r * 0.42, 'N', 'flc2-nt', 'middle')}`;

/* ---------- a · the wheat ear ---------- */

function drawA(): string {
  return svg('Photo of a green wheat ear with its leaves. Question: why do farmers spread so much nitrogen fertiliser on a wheat field?', `
    ${ask(96, 190, 64, Q)}
    ${photo('flc2a', 880, 170, 560, 640, [380, 0, 700, 800])}
    ${credit(CR)}
  `);
}

/* ---------- b · fertiliser pellets over a wheat field (drawn) ---------- */

/** One drawn wheat plant at (x, ground y), height h: a stem, 2 leaves and an ear of grains. */
function plant(x: number, y: number, h: number, lean: number): string {
  const top: Pt = [x + lean, y - h];
  const ear = Array.from({ length: 7 }, (_, i) => {
    const t = i / 6, cx = top[0] + lean * 0.15 * t, cy = top[1] - 8 - t * h * 0.2;
    return `<ellipse class="flc2-grain" cx="${f(cx - 6)}" cy="${f(cy)}" rx="6" ry="10" transform="rotate(-18 ${f(cx - 6)} ${f(cy)})"/><ellipse class="flc2-grain" cx="${f(cx + 6)}" cy="${f(cy)}" rx="6" ry="10" transform="rotate(18 ${f(cx + 6)} ${f(cy)})"/>`;
  }).join('');
  const lf = (dir: 1 | -1, at: number): string => {
    const sx = x + lean * at, sy = y - h * at;
    return `<path class="flc2-leaf" d="M${f(sx)},${f(sy)} Q${f(sx + dir * 40)},${f(sy - 30)} ${f(sx + dir * 70)},${f(sy + 10)} Q${f(sx + dir * 36)},${f(sy - 12)} ${f(sx)},${f(sy + 6)}Z"/>`;
  };
  return `<path class="flc2-stem" d="M${x},${y} Q${f(x + lean * 0.2)},${f(y - h * 0.6)} ${f(top[0])},${f(top[1])}"/>${lf(-1, 0.35)}${lf(1, 0.55)}${ear}`;
}
/** Fertiliser pellets: small white granules in a loose falling sheet (fixed positions, no randomness at runtime). */
function pellets(x0: number, x1: number, y0: number, y1: number, n: number): string {
  return Array.from({ length: n }, (_, i) => {
    const u = (i * 0.618034) % 1, v = (i * 0.414214 + 0.13) % 1;
    const x = x0 + u * (x1 - x0), y = y0 + v * (y1 - y0);
    return `<circle class="flc2-pellet" cx="${f(x)}" cy="${f(y)}" r="10"/>`;
  }).join('');
}
function drawB(): string {
  const ground = 760;
  const back = Array.from({ length: 10 }, (_, i) => plant(950 + i * 62, ground - 70, 190, (i % 3) - 1 + 6)).join('');
  const front = Array.from({ length: 8 }, (_, i) => plant(930 + i * 80, ground, 250, (i % 2 ? 8 : -6))).join('');
  return svg('Drawing of a wheat field; small white fertiliser pellets fall onto it. Question: why do farmers spread so much nitrogen fertiliser on a wheat field?', `
    ${ask(96, 190, 64, Q)}
    <path class="flc2-soil" d="M880,${ground - 80} H1560 V${ground + 40} H880 Z"/>
    <g class="flc2-back">${back}</g>${front}
    ${pellets(940, 1390, 170, 440, 32)}${pellets(1390, 1540, 210, 440, 8)}
  `);
}

/* ---------- c · nitrogen atoms falling onto the wheat ---------- */

function drawC(): string {
  const balls: Pt[] = [[1000, 190], [1150, 160], [1300, 210], [1090, 290], [1240, 320], [1420, 280], [980, 330]];
  return svg('Photo of a green wheat ear, with nitrogen atoms, drawn as blue balls marked N, falling onto it. Question: why do farmers spread so much nitrogen fertiliser on a wheat field?', `
    ${ask(96, 190, 64, Q)}
    ${photo('flc2c', 920, 380, 560, 440, [200, 0, 1000, 786])}
    ${balls.map(([x, y]) => `<path class="flc2-trail" d="M${x - 8},${y - 46} L${x},${y - 22}"/>${nBall(x, y)}`).join('')}
    ${credit(CR)}
  `);
}

export function draw(id: string): string {
  const d: Record<string, () => string> = { a: drawA, b: drawB, c: drawC };
  return (d[id] ?? drawA)();
}

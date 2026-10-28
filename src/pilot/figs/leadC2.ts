// Lead page for slide C2 (RuBisCO), which opens the RuBisCO chunk (lecturer-approved hook, 28 Oct 2026): the question
// alone, one full-page image (viewBox 1600 x 900), nothing else on the page. Slides C2, C5 and C5a–C5c answer it.
// Never reveals: oxygenation, photorespiration, specificity.
// Images: our own render of PDB 8RUC (spinach RuBisCO; assets/SOURCES-rf.md); "Photosynthesis in action", underwater
// lake plants with O₂ bubble trails, Rcaravit 2021, Wikimedia Commons, CC BY 4.0 (photos/lead-bubbles.jpg, as on slide
// 6's lead page; assets/SOURCES.md). CO₂ and O₂ are the deck's atom balls (illus.ts molecule()); gas paths are grey.
import type { Variant } from '../types';
import './leadC2.css';
import { molecule } from '../illus';
import rubiscoPng from '../../assets/rf/rubisco-8ruc.png';
import bubblesJpg from '../../assets/photos/lead-bubbles.jpg';

export const VARIANTS: Variant[] = [
  { id: 'a', name: 'RuBisCO: CO₂ and O₂ head for the same active site' },
  { id: 'b', name: 'Water plant releasing O₂; some drifts back to RuBisCO in a chloroplast (drawn)' },
  { id: 'c', name: 'Underwater plants with O₂ bubble trails (photo)' },
];

type Pt = [number, number];
const f = (v: number): string => v.toFixed(1);
const svg = (label: string, body: string): string => `<svg class="flc2" viewBox="0 0 1600 900" role="img" aria-label="${label}">${body}</svg>`;
const T = (x: number, y: number, s: string, cls: string, a: 'start' | 'middle' | 'end' = 'start'): string =>
  `<text class="${cls}" x="${f(x)}" y="${f(y)}" text-anchor="${a}">${s}</text>`;
/** Subscript digits as smaller, lowered digits (the serif has no subscript glyphs). */
const chem = (s: string): string => s.replace(/[₀-₉]+/g, m => `<tspan class="flc2-sb">${[...m].map(d => d.charCodeAt(0) - 0x2080).join('')}</tspan>`);
function ask(x: number, y: number, size: number, lines: string[], gap = 1.14): string {
  return `<text class="lead-q" x="${x}" y="${y}" font-size="${size}">${lines.map((s, i) => `<tspan x="${x}" dy="${i ? f(size * gap) : 0}">${chem(s)}</tspan>`).join('')}</text>`;
}
const Q = ['Why does the O₂', 'that plants release', 'inhibit their own', 'photosynthesis?'];
/** The RuBisCO render (548 × 471 px), w wide, top-left at (x, y); its front active site is image px (317.6, 309.5). */
const rub = (x: number, y: number, w: number): { svg: string; site: Pt } => {
  const s = w / 548;
  return { svg: `<image href="${rubiscoPng}" x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(471 * s)}"/>`, site: [x + 317.6 * s, y + 309.5 * s] };
};
const gas = (d: string): string => `<path class="flc2-gas" d="${d}"/>`;

/* ---------- a · CO₂ and O₂ head for the same active site ---------- */

function drawA(): string {
  const r = rub(1010, 150, 500), [sx, sy] = r.site;
  return svg('RuBisCO, the CO2-fixing enzyme, drawn atom by atom; a CO2 molecule and an O2 molecule head for the same active site, which is ringed. Question: why does the O2 that plants release inhibit their own photosynthesis?', `
    ${ask(96, 190, 64, Q)}
    ${r.svg}<circle class="flc2-ring" cx="${f(sx)}" cy="${f(sy)}" r="26"/>
    ${gas(`M${f(sx - 300)},${f(sy + 230)} Q${f(sx - 160)},${f(sy + 150)} ${f(sx - 30)},${f(sy + 20)}`)}${molecule(sx - 330, sy + 250, 'OCO', 22)}
    ${gas(`M${f(sx + 140)},${f(sy + 240)} Q${f(sx + 90)},${f(sy + 150)} ${f(sx + 26)},${f(sy + 24)}`)}${molecule(sx + 150, sy + 262, 'OO', 22)}
  `);
}

/* ---------- b · a water plant releasing O₂, some of it drifting back to RuBisCO in a chloroplast ---------- */

/** A water-plant sprig (Elodea-like): a curved stem with whorls of 3 narrow leaves. Returns the svg and the leaf tips. */
function sprig(base: Pt, top: Pt, whorls: number): { svg: string; tips: Pt[] } {
  const ctrl: Pt = [base[0] - 70, (base[1] + top[1]) / 2];
  const at = (t: number): Pt => {
    const a = (1 - t) * (1 - t), b = 2 * (1 - t) * t, c = t * t;
    return [a * base[0] + b * ctrl[0] + c * top[0], a * base[1] + b * ctrl[1] + c * top[1]];
  };
  let s = `<path class="flc2-stem" d="M${base[0]},${base[1]} Q${ctrl[0]},${ctrl[1]} ${top[0]},${top[1]}"/>`;
  const tips: Pt[] = [];
  for (let i = 0; i < whorls; i++) {
    const t = 0.12 + (0.86 * i) / (whorls - 1), [x, y] = at(t), L = 64 - 26 * t;
    for (const a of [-58, 0, 58]) {
      const rad = ((a - 90) * Math.PI) / 180, tip: Pt = [x + Math.cos(rad) * L * (a ? 1 : 0.55), y + Math.sin(rad) * L * (a ? 0.55 : 1)];
      const nx = -Math.sin(rad) * 7, ny = Math.cos(rad) * 7;
      s += `<path class="flc2-leaf" d="M${f(x)},${f(y)} Q${f((x + tip[0]) / 2 + nx)},${f((y + tip[1]) / 2 + ny)} ${f(tip[0])},${f(tip[1])} Q${f((x + tip[0]) / 2 - nx)},${f((y + tip[1]) / 2 - ny)} ${f(x)},${f(y)}Z"/>`;
      if (t > 0.5) tips.push(tip);
    }
  }
  return { svg: s, tips };
}
function drawB(): string {
  const p = sprig([960, 840], [1020, 330], 8);
  // the chloroplast, enlarged from one leaf (zoom lines), with a small RuBisCO inside
  const C: Pt = [1310, 640], RX = 170, RY = 92, leaf = p.tips[4];
  const grana = [[-100, -20], [-40, 30], [30, -26], [96, 22]].map(([dx, dy]) =>
    Array.from({ length: 4 }, (_, k) => `<rect class="flc2-thy" x="${f(C[0] + dx - 22)}" y="${f(C[1] + dy - 18 + k * 9)}" width="44" height="7" rx="3.5"/>`).join('')).join('');
  const r = rub(C[0] - 34 + 10, C[1] - 20, 64), [sx, sy] = r.site;
  // O₂ rising from the upper leaves; 3 of them curve back into the chloroplast, towards RuBisCO
  const up: Array<[Pt, number]> = [[[970, 290], 0], [[1050, 250], 1], [[920, 220], 2], [[1110, 320], 3], [[1000, 190], 4], [[1160, 250], 5]];
  const rising = up.map(([[x, y]], i) => `${gas(`M${f(x)},${f(y + 70)} L${f(x)},${f(y + 24)}`)}${molecule(x, y, 'OO', 15 - (i % 2) * 2)}`).join('');
  const back: Array<[Pt, Pt]> = [[[1150, 420], [sx - 6, sy - 4]], [[1240, 370], [sx, sy - 6]], [[1290, 470], [sx + 4, sy]]];
  const drift = back.map(([a, b]) => `${gas(`M${f(a[0])},${f(a[1])} Q${f((a[0] + b[0]) / 2 + 60)},${f(Math.min(a[1], b[1]) - 10)} ${f(b[0] + 8)},${f(b[1] - 14)}`)}${molecule(a[0], a[1], 'OO', 14)}`).join('');
  return svg('Drawing of a water plant under water. O2 molecules rise from its leaves; some of them drift back into a chloroplast, enlarged from one leaf, towards a small RuBisCO inside it. Question: why does the O2 that plants release inhibit their own photosynthesis?', `
    ${ask(96, 190, 64, Q)}
    <rect class="flc2-water" x="800" y="150" width="720" height="710" rx="28"/>
    ${p.svg}
    <path class="flc2-zoom" d="M${f(leaf[0])},${f(leaf[1])} L${f(C[0] - RX + 18)},${f(C[1] - 40)} M${f(leaf[0])},${f(leaf[1])} L${f(C[0] - RX + 30)},${f(C[1] + 52)}"/>
    <ellipse class="flc2-chl" cx="${C[0]}" cy="${C[1]}" rx="${RX}" ry="${RY}"/><ellipse class="flc2-env" cx="${C[0]}" cy="${C[1]}" rx="${RX - 7}" ry="${RY - 7}"/>
    ${grana}${r.svg}<circle class="flc2-ring" cx="${f(sx)}" cy="${f(sy)}" r="10"/>
    ${rising}${drift}
  `);
}

/* ---------- c · underwater plants with O₂ bubble trails (photo) ---------- */

function drawC(): string {
  const x = 820, y = 150, w = 680, h = 680, win: [number, number, number, number] = [200, 120, 1000, 1000];
  const [u0, v0, uw, vh] = win, s = Math.max(w / uw, h / vh);
  const ix = x - u0 * s + (w - uw * s) / 2, iy = y - v0 * s + (h - vh * s) / 2;
  return svg('Photo under water: lake plants with fine trails of O2 bubbles rising from them towards the light. Question: why does the O2 that plants release inhibit their own photosynthesis?', `
    ${ask(96, 190, 64, Q)}
    <defs><clipPath id="flc2c-c"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="20"/></clipPath>
      <filter id="flc2c-sh" x="-10%" y="-10%" width="120%" height="125%"><feDropShadow dx="0" dy="10" stdDeviation="12" flood-color="#46321a" flood-opacity=".22"/></filter></defs>
    <rect class="flc2-mat" x="${x}" y="${y}" width="${w}" height="${h}" rx="20" filter="url(#flc2c-sh)"/>
    <g clip-path="url(#flc2c-c)"><image href="${bubblesJpg}" x="${f(ix)}" y="${f(iy)}" width="${f(1300 * s)}" height="${f(1200 * s)}" preserveAspectRatio="none"/></g>
    <rect class="flc2-edge" x="${x}" y="${y}" width="${w}" height="${h}" rx="20"/>
    ${T(x, y + h + 28, 'Photo: Rcaravit, CC BY 4.0', 'flc2-credit')}
  `);
}

export function draw(id: string): string {
  const d: Record<string, () => string> = { a: drawA, b: drawB, c: drawC };
  return (d[id] ?? drawA)();
}

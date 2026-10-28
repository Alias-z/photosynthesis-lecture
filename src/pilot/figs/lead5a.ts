// Lead page for slide C5a, which opens the RuBisCO story (28 Oct 2026; draft): the question alone, one full-page drawing
// (viewBox 1600 x 900). Slides C5a–C5c answer it; the "?" box (hooks/C2a-rubisco-story.json) holds the candidate
// questions and their explanations. Never reveals: the Great Oxidation Event, the 210 ppm optimum, the specificity
// numbers.
// Images: our own render of PDB 8RUC (spinach RuBisCO; assets/SOURCES-rf.md); D. S. Goodsell, PDB-101 Molecule of the
// Month 11 (CC BY 4.0; assets/SOURCES-cb.md). CO₂ and O₂ are the deck's atom balls (illus.ts molecule()).
import type { Variant } from '../types';
import './lead5a.css';
import { molecule } from '../illus';
import rubiscoPng from '../../assets/rf/rubisco-8ruc.png';
import goodJpg from '../../assets/photos/c2-goodsell.jpg';

export const VARIANTS: Variant[] = [
  { id: 'a', name: 'RuBisCO takes O₂ “by mistake”: why not fixed?' },
  { id: 'b', name: 'The same question over 3 billion years' },
  { id: 'c', name: 'Is there a better RuBisCO in nature?' },
  { id: 'd', name: 'Warmer world, more CO₂: help or harm?' },
];

const f = (v: number): string => v.toFixed(1);
const svg = (p: string, label: string, body: string): string =>
  `<svg class="fl5a" viewBox="0 0 1600 900" role="img" aria-label="${label}">${body}</svg>`;
const T = (x: number, y: number, s: string, cls: string, a: 'start' | 'middle' | 'end' = 'start'): string =>
  `<text class="${cls}" x="${f(x)}" y="${f(y)}" text-anchor="${a}">${s}</text>`;
/** Subscript digits as smaller, lowered digits (the serif has no subscript glyphs). */
const chem = (s: string): string => s.replace(/[₀-₉]+/g, m => `<tspan class="fl5a-sb">${[...m].map(d => d.charCodeAt(0) - 0x2080).join('')}</tspan>`);
/** The question in Newsreader, one tspan per line. */
function ask(x: number, y: number, size: number, lines: string[], gap = 1.14): string {
  return `<text class="lead-q" x="${x}" y="${y}" font-size="${size}">${lines.map((s, i) => `<tspan x="${x}" dy="${i ? f(size * gap) : 0}">${chem(s)}</tspan>`).join('')}</text>`;
}
/** The RuBisCO render (548 × 471 px), w wide, its top-left at (x, y); its first active site sits at image px (317.6, 309.5). */
const rub = (x: number, y: number, w: number): { svg: string; site: [number, number] } => {
  const s = w / 548;
  return { svg: `<image href="${rubiscoPng}" x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(471 * s)}"/>`, site: [x + 317.6 * s, y + 309.5 * s] };
};
const gas = (d: string): string => `<path class="fl5a-gas" d="${d}"/>`;
const credit = (s: string): string => T(96, 866, s, 'fl5a-credit');
const CR_RUB = 'RuBisCO: own render of PDB 8RUC, spinach (Andersson 1996)';
const Q_A = ['If RuBisCO keeps grabbing O₂', 'by mistake, why hasn’t evolution', 'fixed it in 3 billion years?'];

/* ---------- a · the active site with CO₂ and O₂ arriving ---------- */

function drawA(): string {
  const r = rub(1010, 150, 500), [sx, sy] = r.site;
  return svg('fl5aa', 'RuBisCO, the CO2-fixing enzyme, drawn atom by atom; a CO2 molecule and an O2 molecule head for the same active site, which is ringed. Question: if RuBisCO keeps grabbing O2 by mistake, why has evolution not fixed it in 3 billion years?', `
    ${ask(96, 170, 64, Q_A)}
    ${r.svg}<circle class="fl5a-ring" cx="${f(sx)}" cy="${f(sy)}" r="30"/>
    ${gas(`M${f(sx - 300)},${f(sy + 230)} Q${f(sx - 160)},${f(sy + 150)} ${f(sx - 34)},${f(sy + 22)}`)}${molecule(sx - 330, sy + 250, 'OCO', 22)}${T(sx - 330, sy + 310, 'CO₂', 'fl5a-name', 'middle')}
    ${gas(`M${f(sx + 140)},${f(sy + 240)} Q${f(sx + 90)},${f(sy + 150)} ${f(sx + 30)},${f(sy + 26)}`)}${molecule(sx + 150, sy + 260, 'OO', 22)}${T(sx + 150, sy + 320, 'O₂', 'fl5a-name', 'middle')}
    ${T(sx + 44, sy - 40, 'active site', 'fl5a-lab fl5a-halo')}
    ${credit(CR_RUB)}
  `);
}

/* ---------- b · the same question over 3 billion years ---------- */

function drawB(): string {
  const y = 640, x0 = 140, x1 = 1460, r = rub(x0 - 70, y - 210, 160);
  return svg('fl5ab', 'A line from 3 billion years ago to today. At its start a small RuBisCO; at its end, today, a question mark. Question: if RuBisCO keeps grabbing O2 by mistake, why has evolution not fixed it in 3 billion years?', `
    ${ask(96, 150, 64, Q_A)}
    <path class="fl5a-line" d="M${x0},${y} H${x1}"/><path class="fl5a-tick" d="M${x0},${y - 14} V${y + 14} M${x1},${y - 14} V${y + 14}"/>
    ${r.svg}${T(x0, y + 56, '3 billion years ago', 'fl5a-lab', 'middle')}
    ${T(x1, y + 56, 'today', 'fl5a-lab', 'middle')}${T(x1, y - 40, '?', 'fl5a-qm', 'middle')}
    ${molecule(x1 - 70, y - 120, 'OO', 20)}${molecule(x1 + 60, y - 150, 'OCO', 20)}
    ${credit(CR_RUB)}
  `);
}

/* ---------- c · is there a better RuBisCO in nature? (Goodsell) ---------- */

function drawC(): string {
  // Goodsell's image (1400 × 776): spinach RuBisCO left, the 2-chain bacterial RuBisCO right.
  const w = 760, s = w / 1400, x = 760, y = 260;
  return svg('fl5ac', 'Two RuBisCOs drawn by David Goodsell: a large one from spinach and a small one from a photosynthetic bacterium. Question: is there a better RuBisCO somewhere in nature, and could crops use it?', `
    ${ask(96, 170, 64, ['Is there a better RuBisCO', 'somewhere in nature,', 'and could crops use it?'])}
    <image href="${goodJpg}" x="${x}" y="${y}" width="${w}" height="${f(776 * s)}" class="fl5a-mult"/>
    ${T(x + 230, y + 776 * s + 50, 'spinach', 'fl5a-lab', 'middle')}${T(x + 620, y + 776 * s + 50, 'a bacterium', 'fl5a-lab', 'middle')}
    ${credit('D. S. Goodsell, PDB-101 Molecule of the Month 11 · CC BY 4.0')}
  `);
}

/* ---------- d · warmer world, more CO₂ ---------- */

function drawD(): string {
  const r = rub(980, 250, 440), [sx, sy] = r.site;
  return svg('fl5ad', 'RuBisCO between a thermometer, rising, and a CO2 molecule. Question: in a warmer world with more CO2, will RuBisCO work better or worse?', `
    ${ask(96, 170, 64, ['In a warmer world', 'with more CO₂, will RuBisCO', 'work better or worse?'])}
    ${r.svg}<circle class="fl5a-ring" cx="${f(sx)}" cy="${f(sy)}" r="24"/>
    <rect class="fl5a-th" x="852" y="330" width="34" height="300" rx="17"/><rect class="fl5a-thf" x="860" y="420" width="18" height="212" rx="9"/><circle class="fl5a-thf" cx="869" cy="650" r="34"/>
    ${T(869, 742, 'warmer', 'fl5a-lab', 'middle')}
    ${molecule(1500, 210, 'OCO', 22)}${T(1500, 274, 'more CO₂', 'fl5a-lab', 'middle')}
    ${credit(CR_RUB)}
  `);
}

export function draw(id: string): string {
  const d: Record<string, () => string> = { a: drawA, b: drawB, c: drawC, d: drawD };
  return (d[id] ?? drawA)();
}

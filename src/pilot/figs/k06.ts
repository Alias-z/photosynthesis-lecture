// Slide C6 · Photorespiration (redo of 27 Oct 2026, block L2b). Every variant but f is built from real published figures:
// Ehleringer & Björkman 1977 Fig. 2 (C₃ quantum yield in 21 vs 2 % O₂, Encelia californica, 30 °C; axes redrawn over the
// page scan), South et al. 2019 Fig. 1A (the native pathway across three organelles; the engineered bypasses faded),
// Frederick & Newcomb 1969 Figs 2 and 6 (tobacco leaf TEM: peroxisome against chloroplasts, mitochondria beside it) and
// Sage, Sage & Kocacinar 2012 Fig. 4 (photorespiration/photosynthesis vs chloroplast CO₂ and temperature, modelled).
// f is the one drawn variant: the pathway after South et al. 2019, with carbon counts (2 × 2 C in, 3 C back, 1 C as CO₂).
// Sources and crops: assets/SOURCES-L2b.md. Pixel positions below are in the asset files.
import type { PlateText, Variant } from '../types';
import ebPng from '../../assets/photos/c6-eb-o2.png';
import southPng from '../../assets/photos/c6-south-native.png';
import sageJpg from '../../assets/photos/c6-sage-ratio.jpg';
import fn6Jpg from '../../assets/photos/c6-fn-fig6.jpg';
import fn2Jpg from '../../assets/photos/c6-fn-fig2.jpg';
import './k06.css';

export const PLATE: PlateText = {
  n: 'C6',
  title: 'Photorespiration',
  status: 'draft',
  lead: 'Photorespiration recycles 2-phosphoglycolate into 3-PGA, at a cost of CO₂, ammonia and energy.',
  points: [
    { claim: 'Three organelles.', text: 'Chloroplast → peroxisome → mitochondrion and back<br>In the mitochondrion, two glycine → serine + CO₂ + NH₃' },
    { claim: 'Cost.', text: 'Of every 4 carbons, 3 return to the cycle and 1 is lost as CO₂<br>Refixing NH₃ and recycling the carbon cost ATP and reductant' },
    { claim: 'Yield loss.', text: 'Photorespiration lowers the yield of C₃ crops, more in warm climates<br>C₃ leaves fix more CO₂ at 2 % than at 21 % O₂' },
  ],
  refs: [
    { label: 'Ehleringer & Björkman 1977', url: 'https://doi.org/10.1104/pp.59.1.86' },
    { label: 'South et al. 2019', url: 'https://doi.org/10.1126/science.aat9077' },
    { label: 'Frederick & Newcomb 1969', url: 'https://doi.org/10.1083/jcb.43.2.343' },
    { label: 'Sage, Sage & Kocacinar 2012', url: 'https://doi.org/10.1146/annurev-arplant-042811-105511' },
    { label: 'Busch, Sage & Farquhar 2018', url: 'https://doi.org/10.1038/s41477-017-0065-x' },
    { label: 'Walker et al. 2016', url: 'https://doi.org/10.1146/annurev-arplant-043015-111709' },
  ],
};

export const VARIANTS: Variant[] = [
  { id: 'a', name: 'Quantum yield in 21 % vs 2 % O₂' },
  { id: 'b', name: 'Pathway in chloroplast, peroxisome, mitochondrion' },
  { id: 'c', name: '21 % vs 2 % O₂ + peroxisome (TEM)' },
  { id: 'd', name: 'Photorespiration/photosynthesis vs CO₂ and temperature' },
  { id: 'e', name: 'Chloroplast, peroxisome, mitochondria (TEM) with steps' },
  { id: 'f', name: 'Carbon balance: 2 × 2 C → 3 C + CO₂ (drawn)' },
];

/* ---------- shared parts (after l04b u–z) ---------- */

type A = 'start' | 'middle' | 'end';
type Pt = [number, number];
interface Img { href: string; w: number; h: number }
interface Shot { svg: string; at: (u: number, v: number) => Pt; h: number }
const f = (v: number): string => v.toFixed(1);
const T = (x: number, y: number, s: string, cls = 'fk06-l', a: A = 'start'): string =>
  `<text class="${cls}" x="${f(x)}" y="${f(y)}" text-anchor="${a}">${s}</text>`;
/** Rotated axis title, centred on (x, y). */
const TV = (x: number, y: number, s: string, cls = 'fk06-at'): string =>
  `<text class="${cls}" x="${f(x)}" y="${f(y)}" text-anchor="middle" transform="rotate(-90 ${f(x)} ${f(y)})">${s}</text>`;
const it = (s: string): string => `<tspan font-style="italic">${s}</tspan>`;
const sb = (s: string): string => `<tspan baseline-shift="sub" font-size="72%">${s}</tspan>`;

const EB: Img = { href: ebPng, w: 468, h: 487 };
const SOUTH: Img = { href: southPng, w: 1300, h: 897 };
const SAGE: Img = { href: sageJpg, w: 1113, h: 1040 };
const FN6: Img = { href: fn6Jpg, w: 600, h: 490 };
const FN2: Img = { href: fn2Jpg, w: 836, h: 553 };
const CR = {
  eb: 'Ehleringer & Björkman 1977, Plant Physiol, Fig. 2 (free in PMC)',
  south: 'South et al. 2019, Science, Fig. 1A, CC BY 4.0 (engineered bypasses faded)',
  sage: 'Sage, Sage & Kocacinar 2012, Annu Rev Plant Biol, Fig. 4',
  fn6: 'Frederick & Newcomb 1969, J Cell Biol, Fig. 6, CC BY-NC-SA',
  fn2: 'Frederick & Newcomb 1969, J Cell Biol, Fig. 2, CC BY-NC-SA',
};

/** A real image: the window win = [u0, v0, width, height] of it (image pixels) shown w wide at x, y, its height following.
 *  A photo sits in a rounded frame with a dark credit band; a published figure ('fig') keeps its white ground multiplied into
 *  the page and is credited separately in grey. at() maps image pixels to the figure. */
function shot(id: string, im: Img, x: number, y: number, w: number,
  o: { win?: [number, number, number, number]; fig?: boolean; credit?: string; top?: boolean } = {}): Shot {
  const [u0, v0, uw, vh] = o.win ?? [0, 0, im.w, im.h];
  const s = w / uw, h = vh * s, ox = x - u0 * s, oy = y - v0 * s;
  const img = `<image href="${im.href}" x="${f(ox)}" y="${f(oy)}" width="${f(im.w * s)}" height="${f(im.h * s)}"/>`;
  let band = '';
  if (o.credit) {
    const by = o.top ? y : y + h - 22;
    band = `<rect class="fk06-credbg" x="${f(x)}" y="${f(by)}" width="${f(w)}" height="22"/>${T(x + w - 8, by + 15.5, o.credit, 'fk06-cr', 'end')}`;
  }
  const clip = o.fig
    ? `<clipPath id="${id}"><rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}"/></clipPath>`
    : `<clipPath id="${id}"><rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="10"/></clipPath>`;
  return { svg: `${clip}<g clip-path="url(#${id})"${o.fig ? ' class="fk06-mult"' : ''}>${img}${band}</g>`, at: (u, v) => [ox + u * s, oy + v * s], h };
}
const pleader = (a: Pt, b: Pt): string => {
  const d = `M${f(a[0])},${f(a[1])}L${f(b[0])},${f(b[1])}`;
  return `<path class="fk06-ldh" d="${d}"/><path class="fk06-ldk" d="${d}"/><circle class="fk06-tipd" cx="${f(b[0])}" cy="${f(b[1])}" r="2.8"/>`;
};
/** A label pill centred at (x, y): white on photos, tinted on white-ground figures; with `to`, a leader from its edge. */
function pill(x: number, y: number, s: string, to?: Pt, tint = false): string {
  const w = s.replace(/<[^>]+>/g, '').length * 9.2 + 22;
  let ld = '';
  if (to) {
    const dx = to[0] - x, dy = to[1] - y, t = Math.min(w / 2 / Math.max(Math.abs(dx), 1e-6), 14 / Math.max(Math.abs(dy), 1e-6));
    ld = pleader([x + dx * t, y + dy * t], to);
  }
  return `${ld}<rect class="${tint ? 'fk06-pillbg-t' : 'fk06-pillbg'}" x="${f(x - w / 2)}" y="${f(y - 14)}" width="${f(w)}" height="28" rx="14"/>${T(x, y + 6, s, 'fk06-pill', 'middle')}`;
}
const credit = (x: number, y: number, s: string, a: A = 'end'): string => T(x, y, s, 'fk06-crd', a);
const realSvg = (label: string, body: string): string =>
  `<svg class="fig-svg fk06" viewBox="0 0 800 600" role="img" aria-label="${label}">${body}</svg>`;

/* ---------- Ehleringer & Björkman 1977 Fig. 2 with redrawn axes ---------- */
// In the asset (plot box cropped from the page scan at x 154, y 47): Cᵢ (µbar) → u = 4.9 + 0.268 Cᵢ; quantum yield φ →
// v = 482.5 − 5300 φ; O₂ inhibition (%) on the right axis → v = 482.5 − 5.3 p. Left axis u 3, right axis u 460, bottom v 482.5.
const ebU = (ci: number): number => 4.9 + 0.268 * ci;
const ebV = (q: number): number => 482.5 - 5300 * q;
const ebR = (p: number): number => 482.5 - 5.3 * p;

/** E&B Fig. 2 drawn w wide at (x, y) with clean tick labels and axis titles. */
function ebPlot(p: string, x: number, y: number, w: number): { svg: string; h: number } {
  const a = shot(`${p}-eb`, EB, x, y, w, { fig: true });
  const xl = a.at(3, 0)[0], xr = a.at(460, 0)[0], yb = a.at(0, 482.5)[1];
  const tk: string[] = [];
  for (const q of [0, 0.02, 0.04, 0.06, 0.08]) tk.push(T(xl - 8, a.at(0, ebV(q))[1] + 6, q === 0 ? '0' : q.toFixed(2), 'fk06-ax', 'end'));
  for (const c of [0, 400, 800, 1200, 1600]) tk.push(T(a.at(ebU(c), 0)[0], yb + 24, `${c}`, 'fk06-ax', 'middle'));
  for (const r of [0, 20, 40, 60, 80]) tk.push(T(xr + 8, a.at(0, ebR(r))[1] + 6, `${r}`, 'fk06-ax', 'start'));
  const titles = `${TV(xl - 60, y + a.h / 2, 'Quantum yield (mol CO₂ mol⁻¹ absorbed photons)')}
    ${T((xl + xr) / 2, yb + 52, `Intercellular CO₂, ${it('C')}${sb('i')} (µbar)`, 'fk06-at', 'middle')}
    ${TV(xr + 62, y + a.h / 2, 'O₂ inhibition (%)')}`;
  return { svg: `${a.svg}${tk.join('')}${titles}`, h: a.h };
}

/* a · E&B Fig. 2 large */

function drawA(): string {
  const e = ebPlot('fk06a', 150, 14, 465);
  return realSvg('Ehleringer and Björkman 1977, figure 2: quantum yield of carbon dioxide uptake of Encelia californica, a C3 plant, at 30 degrees, against intercellular carbon dioxide from 0 to 1600 microbar. In 2 percent oxygen it stays at 0.08 at all carbon dioxide levels; in 21 percent oxygen, normal air, it is lower and rises with carbon dioxide towards 0.08. The second curve, read on the right axis, is the oxygen inhibition, 70 percent at the lowest carbon dioxide and falling to 6 percent at 1500 microbar.', `
    ${e.svg}
    ${credit(780, 590, CR.eb)}
  `);
}

/* b · South et al. 2019 Fig. 1A, the native pathway with carbon counts */
// Asset positions: 2-P-glycolate (383, 409), glycerate in the chloroplast (171, 123), mitochondrial CO₂ (1112, 765).

function drawB(): string {
  const a = shot('fk06b-a', SOUTH, 20, 14, 760, { fig: true });
  return realSvg('South and colleagues 2019, figure 1A, with the three engineered bypasses faded so that only the native pathway stands out. In the chloroplast RuBisCO adds oxygen to RuBP, giving 3-phosphoglycerate and 2-phosphoglycolate, which becomes glycolate and leaves through the transporter PLGG1. In the peroxisome glycolate becomes glyoxylate and glycine; in the mitochondrion two glycines give serine, NADH, ammonia and carbon dioxide; serine returns to the peroxisome and becomes hydroxypyruvate and glycerate, which re-enters the chloroplast. Labels: two 2-phosphoglycolates carry 4 carbons; glycerate brings 3 back; 1 leaves as carbon dioxide.', `
    ${a.svg}
    ${pill(86, 30, 'glycerate: 3 C', a.at(150, 116), true)}
    ${pill(250, 392, '2 × 2-phosphoglycolate: 4 C', a.at(383, 421), true)}
    ${pill(738, 562, 'CO₂: 1 C', a.at(1112, 780), true)}
    ${credit(560, 590, CR.south)}
  `);
}

/* c · E&B Fig. 2 beside the TEM of a peroxisome between chloroplasts (Frederick & Newcomb 1969, Fig. 6) */
// FN6 asset: peroxisome with its catalase crystal ≈ (233, 200), mitochondrion ≈ (470, 300), chloroplasts at the left edge and
// along the bottom.

function drawC(): string {
  const e = ebPlot('fk06c', 96, 96, 330);
  const b = shot('fk06c-b', FN6, 500, 120, 280, { credit: 'Frederick & Newcomb 1969, CC BY-NC-SA' });
  const yb = 120 + b.h + 30;
  return realSvg('Left: Ehleringer and Björkman 1977, figure 2, the quantum yield of a C3 leaf at 30 degrees in 2 and 21 percent oxygen against intercellular carbon dioxide; in air it is lower, most of all at low carbon dioxide. Right: electron micrograph of a tobacco leaf cell (Frederick and Newcomb 1969, figure 6): a peroxisome with a catalase crystal pressed against two chloroplasts, with a small mitochondrion beside it.', `
    ${e.svg}${b.svg}
    ${pill(640, 92, 'peroxisome', b.at(260, 140))}
    ${pill(570, yb, 'chloroplast', b.at(170, 460))}
    ${pill(718, yb, 'mitochondrion', b.at(470, 330))}
    ${credit(780, 590, CR.eb)}
  `);
}

/* d · Sage, Sage & Kocacinar 2012 Fig. 4, without its colour key and its two printed notes (given as pills) */
// Asset: ellipse ('value on hot soils with low humidity') ≈ (565, 290); first and last dot of the typical C₃ range ≈ (660, 305)
// and (472, 790).

function drawD(): string {
  const a = shot('fk06d-a', SAGE, 92, 40, 619, { fig: true, win: [0, 132, 1010, 908] });
  return realSvg('Sage, Sage and Kocacinar 2012, figure 4: modelled ratio of photorespiration to photosynthesis plotted against chloroplast carbon dioxide from 100 to 600 micromoles per mole and leaf temperature from 0 to 40 degrees. The ratio is near 0.1 at high carbon dioxide and low temperature and rises above 0.8 at low carbon dioxide and high temperature; dots mark the typical C3 range at current carbon dioxide, an ellipse the value on hot soils with low humidity.', `
    ${a.svg}
    ${pill(360, 22, 'hot soils, low humidity', a.at(593, 133), true)}
    ${pill(640, 22, 'typical C₃ range, current CO₂', a.at(663, 133), true)}
    ${credit(780, 590, CR.sage)}
  `);
}

/* e · Frederick & Newcomb 1969 Fig. 2 (peroxisomes 'Mb', mitochondria 'M', chloroplasts) with the step in each organelle */
// FN2 asset: large peroxisome (Mb) ≈ (616, 400), mitochondrion (M) ≈ (484, 226), chloroplast with grana ≈ (250, 470).

function drawE(): string {
  const a = shot('fk06e-a', FN2, 50, 50, 700, { credit: CR.fn2 });
  return realSvg('Electron micrograph of part of a young tobacco leaf cell (Frederick and Newcomb 1969, figure 2): peroxisomes, labelled Mb, pressed against chloroplast envelopes, and mitochondria, labelled M, nearby. Labels give the photorespiratory step in each: in the chloroplast 2-phosphoglycolate becomes glycolate; in the peroxisome glycolate becomes glycine; in the mitochondrion two glycines give serine, carbon dioxide and ammonia.', `
    ${a.svg}
    ${pill(400, 24, 'mitochondrion: 2 glycine → serine + CO₂ + NH₃', a.at(484, 200))}
    ${pill(200, 50 + a.h + 28, 'chloroplast: 2-PG → glycolate', a.at(250, 470))}
    ${pill(598, 50 + a.h + 28, 'peroxisome: glycolate → glycine', a.at(660, 470))}
  `);
}

/* ---------- f · drawn: the pathway with carbon counts (after South et al. 2019, Fig. 1A) ---------- */

const ah = (p: string): string =>
  `<defs><marker id="${p}-h" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="fk06-hd" d="M0,0 L10,5 L0,10 Z"/></marker></defs>`;
const arr = (p: string, d: string): string => `<path class="fk06-ar" d="${d}" marker-end="url(#${p}-h)"/>`;
/** A carbon-count badge. */
function cb(x: number, y: number, s: string): string {
  const w = s.length * 9 + 16;
  return `<rect class="fk06-cb" x="${f(x - w / 2)}" y="${f(y - 13)}" width="${f(w)}" height="24" rx="12"/>${T(x, y + 5, s, 'fk06-c', 'middle')}`;
}

function drawF(): string {
  const p = 'fk06f';
  return `<svg class="fig-svg fk06" viewBox="0 0 800 600" role="img" aria-label="Drawn after South and colleagues 2019: the photorespiratory pathway across three organelles with carbon counts. In the chloroplast RuBisCO adds oxygen to RuBP, giving 3-phosphoglycerate and 2-phosphoglycolate; two 2-phosphoglycolates, four carbons, become glycolate and move to the peroxisome, where they become glyoxylate and then glycine. In the mitochondrion two glycines give one serine, one carbon dioxide and one ammonia. Serine returns to the peroxisome and becomes hydroxypyruvate and glycerate, three carbons, which the chloroplast turns back into 3-phosphoglycerate for the Calvin–Benson cycle.">${ah(p)}
    <rect class="fk06-org" x="16" y="40" width="352" height="510" rx="26"/>
    <rect class="fk06-org" x="432" y="40" width="352" height="250" rx="60"/>
    <rect class="fk06-org" x="432" y="330" width="352" height="220" rx="44"/>
    ${T(36, 76, 'chloroplast', 'fk06-h')}${T(608, 76, 'peroxisome', 'fk06-h', 'middle')}${T(608, 534, 'mitochondrion', 'fk06-h', 'middle')}

    ${T(220, 136, 'glycerate', 'fk06-l', 'middle')}${cb(82, 130, '3 C')}
    ${arr(p, 'M220,146 V180')}
    ${T(220, 204, '3-PGA', 'fk06-l', 'middle')}${T(220, 228, 'Calvin–Benson cycle', 'fk06-s', 'middle')}
    ${T(192, 312, 'RuBP + O₂', 'fk06-l', 'middle')}
    ${arr(p, 'M192,322 V362')}${T(204, 348, 'RuBisCO', 'fk06-s')}
    ${T(192, 388, '3-PGA + 2-phosphoglycolate', 'fk06-l', 'middle')}
    ${arr(p, 'M262,400 V444')}
    ${T(262, 468, 'glycolate', 'fk06-l', 'middle')}${cb(110, 462, '2 × 2 C')}

    ${T(452, 136, 'glycerate', 'fk06-l')}${arr(p, 'M602,130 H550')}${T(610, 136, 'hydroxypyruvate', 'fk06-l')}
    ${arr(p, 'M448,130 H282')}
    ${T(452, 206, 'glycolate', 'fk06-l')}${arr(p, 'M544,200 H596')}${T(604, 206, 'glyoxylate', 'fk06-l')}
    ${arr(p, 'M650,214 V242')}${T(650, 264, 'glycine', 'fk06-l', 'middle')}
    ${arr(p, 'M312,462 C400,452 392,214 446,202')}

    ${arr(p, 'M630,272 C600,330 520,350 496,404')}
    ${T(452, 430, '2 glycine', 'fk06-l')}${arr(p, 'M542,424 H600')}${T(608, 430, 'serine', 'fk06-l')}
    ${T(452, 466, '+ CO₂ + NH₃ (glycine decarboxylase)', 'fk06-s')}
    ${arr(p, 'M690,412 C740,380 760,250 748,146')}
    ${cb(530, 498, 'CO₂: 1 C')}
    ${credit(780, 590, 'Drawn after South et al. 2019, Fig. 1A')}
  </svg>`;
}

const DRAW: Record<string, () => string> = { a: drawA, b: drawB, c: drawC, d: drawD, e: drawE, f: drawF };

export function draw(id: string): string {
  return (DRAW[id] ?? drawA)();
}

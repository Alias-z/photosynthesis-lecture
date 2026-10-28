// Slide C01 · From light energy to organic carbon. Lecture 2 opener. Draft context; see research/figure-briefs/LECTURE_OVERVIEW.md.
// Checked facts only (research/review-2026-10-23-claude/D_C01-C06.md, claims 1–9, 30, 33, gaps 2–3; REVIEW_SUMMARY.md
// essentials #3 and #8, §5c, §6):
// ATP and NADPH are delivered on the stromal side; the CBB cycle in the stroma spends them; ADP, Pᵢ and NADP⁺ return.
// Redox: water is oxidised (it supplies the electrons, O₂ is the by-product); CO₂ (carbon +4) is reduced.
// Per CO₂: 3 ATP + 2 NADPH; per hexose equivalent 18 ATP + 12 NADPH; the cycle exports triose phosphate, not glucose.
// Light switches the cycle on: Fd → FTR → thioredoxin reduces FBPase, SBPase, PRK, GAPDH (and activase); Rubisco needs
// activase (ATP); an oxidising switch turns the targets off in darkness, and GAPDH/PRK are held in a CP12 complex.
// Land GPP ≈ 120–160 Pg C yr⁻¹, upper values debated (Beer 2010; Lai 2024; never the retracted Keenan 2021).
// Equation thread: C01 makes ATP and NADPH the link, using the L08 form 6 CO₂ + 12 H₂O → C₆H₁₂O₆ + 6 O₂ + 6 H₂O.
// Not drawn here, to avoid repeating other slides: the battery analogy, electrons-uphill and chloroplast views (L01),
// and the light-off PGA/RuBP transient (C03).
import type { PlateText, Variant } from '../types';
import './c01.css';
import { bilayer, bolt, epath, illusHeads, molecule, tag, water } from '../illus';
import { arrow } from '../mechanisms';

export const PLATE: PlateText = {
  n: 'C1',
  title: 'From light energy to organic carbon',
  status: 'draft',
  lead: 'In the stroma, Rubisco fixes CO₂; ATP and NADPH from the light reactions turn it into sugar. Light also switches the cycle on.',
  points: [
    { claim: 'ATP and NADPH link the two halves.', text: 'NADPH supplies electrons, ATP energy; ADP, inorganic phosphate (Pᵢ) and NADP⁺ return to the light reactions.' },
    { claim: 'Water is oxidised, carbon reduced.', text: 'Electrons taken from water end up in sugar; the water’s oxygen leaves as O₂.' },
    { claim: 'The “dark reactions” need light.', text: 'Light activates cycle enzymes via ferredoxin and thioredoxin; at night they are inactivated.' },
  ],
  refs: [
    { label: 'Johnson 2016', url: 'https://doi.org/10.1042/EBC20160016' },
    { label: 'Sharkey 2024', url: 'https://doi.org/10.1093/plphys/kiad601' },
    { label: 'Yoshida & Hisabori 2023', url: 'https://doi.org/10.1093/pcp/pcad049' },
    { label: 'Buchanan 2016', url: 'https://doi.org/10.1007/s11120-015-0212-z' },
  ],
};

export const VARIANTS: Variant[] = [
  { id: 'a', name: 'Three links' },
  { id: 'b', name: 'Equation halves' },
  { id: 'c', name: 'Oxidation states' },
  { id: 'd', name: 'Carbon from air' },
  { id: 'e', name: 'Day and night' },
  { id: 'f', name: 'Fuel and key' },
  { id: 'g', name: 'Thesis panorama' },
  { id: 'h', name: 'Switch timeline', anim: true },
  { id: 'i', name: 'Electron’s trip', anim: true },
  { id: 'j', name: 'Three icons' },
];

export function draw(id: string): string {
  const f = { a: drawA, b: drawB, c: drawC, d: drawD, e: drawE, f: drawF, g: drawG, h: drawH, i: drawI, j: drawJ }[id] ?? drawA;
  return f();
}

/* ---------- shared parts ---------- */

type Anchor = 'start' | 'middle' | 'end';
type K = 'g' | 'c' | 'w' | 'k';
const f = (v: number): string => (Math.round(v * 10) / 10).toString();

/** Subscript digits as smaller, lowered Inter digits (the web font has no subscript glyphs). */
const chem = (s: string): string =>
  s.replace(/[₀-₉]+/g, m => `<tspan class="fc01-sb">${[...m].map(d => d.charCodeAt(0) - 0x2080).join('')}</tspan>`);
const T = (x: number, y: number, s: string, cls = 'sm', a: Anchor = 'middle'): string =>
  `<text class="${cls}" x="${f(x)}" y="${f(y)}" text-anchor="${a}">${chem(s)}</text>`;

/** Shared inks plus green (thioredoxin switch), brown (carbon), blue (water) and grey arrowheads. */
const marks = (p: string): string => `${illusHeads(p)}<defs>${(['g', 'c', 'w', 'k'] as const).map(k =>
  `<marker id="${p}-${k}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse"><path class="fc01-hd-${k}" d="M0,0L10,5L0,10z"/></marker>`).join('')}</defs>`;
const arr = (p: string, k: K, d: string, extra = ''): string =>
  `<path class="fc01-ar fc01-ar-${k}${extra ? ` ${extra}` : ''}" d="${d}" marker-end="url(#${p}-${k})"/>`;
const svg = (p: string, label: string, body: string): string =>
  `<svg class="fig-svg fc01" viewBox="0 0 800 600" role="img" aria-label="${label}">${marks(p)}${body}</svg>`;

/** RuBP as the thesis draws it: a pentagon. */
function pent(x: number, y: number, r: number, label = '', cls = 'node node-rubp'): string {
  const pts = Array.from({ length: 5 }, (_, k) => {
    const a = -Math.PI / 2 + (k * 2 * Math.PI) / 5;
    return `${f(x + r * Math.cos(a))},${f(y + r * Math.sin(a))}`;
  }).join(' ');
  return `<polygon class="${cls}" points="${pts}"/>${label ? T(x, y + 6, label, 'tiny fc01-dark') : ''}`;
}

/** A 3-carbon molecule as the deck draws it: a triangle. */
function tri(x: number, y: number, r: number, cls = 'fc01-tri'): string {
  const pts = [-90, 30, 150].map(d => `${f(x + r * Math.cos((d * Math.PI) / 180))},${f(y + r * Math.sin((d * Math.PI) / 180))}`).join(' ');
  return `<polygon class="${cls}" points="${pts}"/>`;
}

/** n carbon beads on a bond. */
function chain(x: number, y: number, n: number, gap = 20, r = 7, cls = 'bead'): string {
  const x0 = x - ((n - 1) * gap) / 2;
  return `<path class="fc01-bond" d="M${f(x0)},${y} H${f(x0 + (n - 1) * gap)}"/>` +
    Array.from({ length: n }, (_, i) => `<circle class="${cls}" cx="${f(x0 + i * gap)}" cy="${y}" r="${r}"/>`).join('');
}

/** A cycle drawn as a ring of arcs (angles in degrees, SVG orientation). */
function ring(p: string, cx: number, cy: number, R: number, arcs: Array<[number, number]>, cls = 'fc01-cyc', heads = true): string {
  const at = (d: number): string => `${f(cx + R * Math.cos((d * Math.PI) / 180))},${f(cy + R * Math.sin((d * Math.PI) / 180))}`;
  return arcs.map(([a, b]) => heads
    ? arrow(p, 'ink', `M${at(a)} A${R},${R} 0 ${b - a > 180 ? 1 : 0} 1 ${at(b)}`, cls)
    : `<path class="ar ${cls}" d="M${at(a)} A${R},${R} 0 ${b - a > 180 ? 1 : 0} 1 ${at(b)}"/>`).join('');
}

/** ATP synthase: blue stalk across the membrane, purple head on the stroma side. */
const synthase = (x: number, top: number, h: number, r = 22): string =>
  `<rect class="blob-stalk" x="${x - 17}" y="${top}" width="34" height="${h}" rx="10"/>` +
  `<circle class="blob-atp" cx="${x - 14}" cy="${top - r + 2}" r="${r}"/><circle class="blob-atp" cx="${x + 14}" cy="${top - r + 2}" r="${r}"/><circle class="blob-atp" cx="${x}" cy="${top - r * 2 + 4}" r="${r}"/>`;

/** A small sun, and a crescent moon. */
const sun = (x: number, y: number, r = 16, cls = 'fc01-sun'): string =>
  `<circle class="${cls}" cx="${x}" cy="${y}" r="${r}"/>` + Array.from({ length: 8 }, (_, i) => {
    const a = (i * Math.PI) / 4, c = Math.cos(a), s = Math.sin(a);
    return `<path class="${cls}-ray" d="M${f(x + c * (r + 5))},${f(y + s * (r + 5))} L${f(x + c * (r + 12))},${f(y + s * (r + 12))}"/>`;
  }).join('');
const moon = (x: number, y: number, r = 18): string => {
  const ax = f(x + r * 0.42), ay = f(y - r * 0.908), by = f(y + r * 0.908);
  return `<path class="fc01-moon" d="M${ax},${ay} A${r},${r} 0 1 0 ${ax},${by} A${r},${r} 0 0 1 ${ax},${ay} Z"/>`;
};

/** A thylakoid stack: a few green discs. */
const stack = (x: number, y: number, w: number, n = 4): string =>
  Array.from({ length: n }, (_, i) => `<rect class="fc01-disc" x="${f(x - w / 2)}" y="${f(y + (i - n / 2) * 15)}" width="${w}" height="12" rx="6"/>`).join('');

/** An enzyme chip: name on the left, its thiol state on the right. */
function chip(x: number, y: number, name: string, on: boolean, w = 300): string {
  return `<rect class="fc01-chip ${on ? 'fc01-chip-on' : 'fc01-chip-off'}" x="${f(x - w / 2)}" y="${y - 21}" width="${w}" height="42" rx="12"/>` +
    T(x - w / 2 + 16, y + 8, name, 'sm lab-b', 'start') + T(x + w / 2 - 14, y + 8, on ? 'SH SH' : 'S–S', `sm ${on ? 'fc01-g' : 'fc01-mute'}`, 'end');
}

/* ---------- a · Three links: what crosses from the thylakoid to the cycle, and what comes back ---------- */

function drawA(): string {
  const p = 'fc01a';
  const cx = 430, cy = 170, R = 100;
  const at = (d: number): [number, number] => [cx + R * Math.cos((d * Math.PI) / 180), cy + R * Math.sin((d * Math.PI) / 180)];
  const [px, py] = at(270);
  return svg(p, 'The thylakoid membrane below, the Calvin–Benson–Bassham cycle in the stroma above. Three links: NADPH and ATP rise to the cycle, ADP, phosphate and NADP+ return, and ferredoxin reduces thioredoxin, which switches the cycle on. CO₂ enters the cycle and triose phosphate leaves.', `
    ${T(786, 36, 'stroma', 'note', 'end')}${T(786, 590, 'lumen', 'note', 'end')}
    ${bilayer(p, 14, 786, 430, 490)}${T(786, 424, 'thylakoid membrane', 'tiny', 'end')}
    <rect class="blob-ps" x="44" y="404" width="104" height="112" rx="30"/>${T(96, 467, 'PSII', 'sm lab-b')}
    <ellipse class="blob-b6f" cx="186" cy="460" rx="22" ry="46"/>${T(186, 467, 'b₆f', 'sm')}
    <rect class="blob-ps" x="226" y="404" width="104" height="112" rx="30"/>${T(278, 467, 'PSI', 'sm lab-b')}
    <circle class="blob-small" cx="352" cy="402" r="17"/>${T(352, 409, 'Fd', 'sm')}
    <ellipse class="blob-pq" cx="414" cy="404" rx="32" ry="17"/>${T(414, 411, 'FNR', 'sm')}
    ${synthase(616, 410, 106)}${T(616, 548, 'ATP synthase', 'sm')}
    ${epath(p, 'M76,532 C92,512 120,496 150,494 L300,494 C326,492 340,456 346,422')}${T(186, 404, 'e⁻', 'sm fc01-e')}
    ${water(70, 548)}${arrow(p, 'ink', 'M94,556 L126,556')}${molecule(150, 556, 'OO', 10)}${T(178, 564, 'PSII takes e⁻ from water', 'sm', 'start')}
    ${bolt(p, 30, 340, 72, 400)}${bolt(p, 214, 340, 256, 400)}${T(108, 362, 'light', 'note', 'start')}

    ${ring(p, cx, cy, R, [[288, 398], [48, 140], [160, 252]])}
    ${pent(px, py, 26, 'RuBP')}${T(468, 46, 'Rubisco', 'sm', 'start')}
    ${molecule(290, 46, 'OCO', 11)}${arrow(p, 'ink', 'M322,52 L398,66')}${T(290, 86, 'CO₂', 'sm lab-b')}
    ${T(cx, cy - 6, 'Calvin–Benson–', 'sm lab-b')}${T(cx, cy + 20, 'Bassham cycle', 'sm lab-b')}
    ${arrow(p, 'ink', `M${f(cx + R + 4)},${cy} L618,${cy}`)}
    <rect class="node node-out" x="622" y="${cy - 22}" width="140" height="44" rx="22"/>${T(692, cy + 8, 'triose-P', 'sm lab-b')}${T(692, cy - 38, 'sugar', 'sm')}

    ${arrow(p, 'ink', 'M398,384 L398,278')}${tag(398, 318, 'NADPH', 'nadph')}
    ${arrow(p, 'ink', 'M452,280 L444,384', 'dashed')}${tag(456, 352, 'NADP⁺', 'nadph')}
    ${arrow(p, 'ink', 'M596,340 C584,296 556,256 516,240')}${tag(564, 282, 'ATP', 'atp')}
    ${arrow(p, 'ink', 'M534,198 C620,204 670,262 652,342', 'dashed')}${tag(666, 238, 'ADP + Pᵢ', 'atp')}
    ${arr(p, 'g', 'M344,386 C318,336 316,276 344,232', 'fc01-trx')}
    ${T(306, 268, 'Fd → thioredoxin', 'sm lab-b fc01-g', 'end')}${T(306, 294, 'activates the cycle', 'sm', 'end')}
  `);
}

/* ---------- b · Equation halves: ATP and NADPH made in one half, spent in the other ---------- */

/** An equation term; `over` turns '→' into a long reaction arrow with its condition written over it. */
interface Tok { s: string; k?: 'l' | 'w' | 'c' | 'o'; tag?: 'atp' | 'nadph'; id?: string; over?: string }
const EMW: Record<string, number> = { ' ': 0.27, '+': 0.62, '→': 0.9, C: 0.74, O: 0.8, H: 0.76, l: 0.27, i: 0.27, g: 0.62, h: 0.62, t: 0.38 };
const em = (s: string): number => [...s].reduce((a, ch) => a + (/[₀-₉]/.test(ch) ? 0.44 : /\d/.test(ch) ? 0.64 : (EMW[ch] ?? 0.6)), 0);
const tagW = (s: string): number => s.length * 12.5 + 26;

/** Lays a row of equation terms and tags centred on cx; returns the drawing and each term's centre. */
function eqRow(toks: Tok[], cx: number, y: number, size: number): { svg: string; x: Record<string, number> } {
  const gap = 0.3 * size, ws = toks.map(t => (t.tag ? tagW(t.s) : t.over ? 2.2 * size : em(t.s) * size));
  let at = cx - (ws.reduce((a, b) => a + b, 0) + gap * (toks.length - 1)) / 2;
  const x: Record<string, number> = {};
  const body = toks.map((t, i) => {
    const c = at + ws[i] / 2;
    at += ws[i] + gap;
    if (t.id) x[t.id] = c;
    if (t.over) {
      const ay = y - 0.32 * size, a0 = c - ws[i] / 2, a1 = c + ws[i] / 2, hd = 0.3 * size;
      return `<path class="fc01-eqar" d="M${f(a0)},${f(ay)} H${f(a1 - hd * 0.6)}" style="stroke-width:${f(size * 0.07)}px"/>`
        + `<path class="fc01-eqhd" d="M${f(a1)},${f(ay)} L${f(a1 - hd)},${f(ay - hd * 0.5)} L${f(a1 - hd)},${f(ay + hd * 0.5)} Z"/>`
        + `<text class="fc01-eq fc01-l" x="${f(c)}" y="${f(ay - 0.26 * size)}" text-anchor="middle" style="font-size:${f(Math.max(22, size * 0.62))}px">${t.over}</text>`;
    }
    return t.tag ? tag(c, y - size * 0.34, t.s, t.tag)
      : `<text class="fc01-eq fc01-${t.k ?? 'o'}" x="${f(c)}" y="${y}" text-anchor="middle" style="font-size:${size}px">${chem(t.s)}</text>`;
  }).join('');
  return { svg: body, x };
}

function drawB(): string {
  const p = 'fc01b';
  const plus: Tok = { s: '+' };
  const yP = 112, yS = 330;
  const light: Tok = { s: '→', over: 'light' };
  const P = eqRow([{ s: '12 H₂O', k: 'w', id: 'h2o' }, light, { s: '6 O₂', k: 'w' }, plus,
    { s: 'NADPH', tag: 'nadph', id: 'nadph' }, plus, { s: 'ATP', tag: 'atp', id: 'atp' }], 490, yP, 30);
  const S = eqRow([{ s: '6 CO₂', k: 'c', id: 'co2' }, plus, { s: 'NADPH', tag: 'nadph', id: 'nadph' }, plus, { s: 'ATP', tag: 'atp', id: 'atp' },
    { s: '→' }, { s: 'C₆H₁₂O₆', k: 'c' }, plus, { s: '6 H₂O', k: 'w' }], 500, yS, 30);
  const N = eqRow([{ s: '6 CO₂', k: 'c' }, plus, { s: '12 H₂O', k: 'w' }, light, { s: 'C₆H₁₂O₆', k: 'c' }, plus,
    { s: '6 O₂', k: 'w' }, plus, { s: '6 H₂O', k: 'w' }], 456, 494, 27);
  const link = (x1: number, x2: number, k: 'ink' | 'red', extra = ''): string =>
    arrow(p, k, `M${f(x1)},${yP + 20} C${f(x1)},210 ${f(x2)},214 ${f(x2)},${yS - 34}`, extra);
  return svg(p, 'The equation in two halves. Photo, in the thylakoid: driven by light, 12 H₂O give 6 O₂ and NADPH and ATP are made; water is oxidised. Synthesis, in the stroma: 6 CO₂ with NADPH and ATP give C₆H₁₂O₆ and 6 H₂O; CO₂ is reduced. NADPH carries the electrons. Added up, NADPH and ATP cancel: 6 CO₂ + 12 H₂O → C₆H₁₂O₆ + 6 O₂ + 6 H₂O, with light written over the arrow.', `<g transform="translate(0 -26)">
    ${T(20, yP - 10, 'PHOTO', 'fc01-band', 'start')}${T(20, yP + 16, 'thylakoid', 'sm', 'start')}
    ${T(20, yS - 10, 'SYNTHESIS', 'fc01-band', 'start')}${T(20, yS + 16, 'stroma', 'sm', 'start')}
    ${T(20, 484, 'NET', 'fc01-band', 'start')}
    ${P.svg}${S.svg}
    ${T(P.x.h2o, yP + 44, 'oxidised: loses e⁻', 'sm fc01-w')}
    ${T(S.x.co2, yS + 44, 'reduced: gains e⁻', 'sm fc01-ct')}
    ${link(P.x.nadph, S.x.nadph, 'red', 'epath')}${link(P.x.atp, S.x.atp, 'ink')}
    ${T(20, 232, 'NADPH carries the e⁻', 'sm fc01-e', 'start')}
    ${T(786, yS + 44, 'per CO₂: 3 ATP + 2 NADPH', 'sm lab-b', 'end')}
    <path class="rule" d="M20,428 H786"/>
    ${N.svg}
    ${T(456, 540, 'NADPH and ATP cancel: made, then used', 'sm')}
    ${T(456, 572, 'C₆H₁₂O₆ is shorthand: the cycle exports triose-P', 'tiny')}
  </g>`);
}

/* ---------- c · Oxidation states: carbon goes down from +4, oxygen goes up from −2 ---------- */

function drawC(): string {
  const p = 'fc01c';
  const Y = (v: number): number => 340 - v * 64;
  const levels = [4, 3, 2, 1, 0, -1, -2];
  const lab = (v: number): string => (v > 0 ? `+${v}` : v < 0 ? `−${-v}` : '0');
  const cx = 300, ox = 640;
  return svg(p, 'Oxidation states. Carbon in CO₂ is at +4; in sugar it is at 0, so each carbon gains 4 electrons, which is 2 NADPH per CO₂: CO₂ is reduced. Oxygen in water is at −2; in O₂ it is at 0, so each O gives up 2 electrons: water is oxidised. Light moves the electrons from water to carbon via NADPH. Four electrons per O₂ and four per CO₂ is why one O₂ is released per CO₂ fixed.', `
    ${levels.map(v => `<path class="fc01-grid${v === 0 ? ' fc01-grid0' : ''}" d="M112,${Y(v)} H780"/>${T(94, Y(v) + 8, lab(v), 'tl', 'end')}`).join('')}
    <path class="axis" d="M104,${Y(4) - 30} V${Y(-2) + 20}"/>
    <text class="tl" transform="translate(36 ${Y(1)}) rotate(-90)" text-anchor="middle">oxidation state</text>
    ${T(112, 34, 'higher = more oxidised', 'tiny', 'start')}

    ${molecule(cx, Y(4), 'OCO', 13)}${T(cx + 40, Y(4) + 9, 'CO₂', 'lab lab-b', 'start')}
    ${arr(p, 'c', `M${cx},${Y(4) + 22} L${cx},${Y(0) - 20}`, 'fc01-thick')}
    ${chain(cx, Y(0), 3)}${T(cx + 40, Y(0) + 9, 'sugar (CH₂O)', 'lab lab-b', 'start')}
    ${T(cx + 20, 176, 'reduced', 'lab lab-b fc01-ct', 'start')}
    ${T(cx + 20, 204, 'gains 4 e⁻ per carbon', 'sm', 'start')}${T(cx + 20, 232, '= 2 NADPH per CO₂', 'sm', 'start')}

    ${water(ox, Y(-2))}${T(ox + 32, Y(-2) + 9, 'H₂O', 'lab lab-b', 'start')}
    ${arr(p, 'w', `M${ox},${Y(-2) - 22} L${ox},${Y(0) + 22}`, 'fc01-thick')}
    ${molecule(ox, Y(0), 'OO', 13)}${T(ox + 32, Y(0) + 9, 'O₂', 'lab lab-b', 'start')}
    ${T(ox + 20, 398, 'oxidised', 'lab lab-b fc01-w', 'start')}${T(ox + 20, 426, '2 e⁻ per O', 'sm', 'start')}

    ${epath(p, `M${ox - 26},${Y(-2) - 2} C556,${Y(-2) - 2} 560,300 480,294 L${cx + 18},290`)}
    ${tag(410, 290, '2 NADPH', 'nadph')}${T(530, 498, '4 e⁻ per O₂', 'sm fc01-e', 'middle')}
    ${bolt(p, 452, 446, 552, 396)}${T(444, 466, 'light', 'note', 'end')}
    ${T(440, 556, 'So one O₂ is released per CO₂ fixed.', 'sm lab-b')}
  `);
}

/* ---------- d · Carbon from the air: one plant, then the planet ---------- */

function drawD(): string {
  const p = 'fc01d';
  const leafE = (x: number, y: number, rx: number, rot: number): string =>
    `<ellipse class="fc01-leaf" cx="${x}" cy="${y}" rx="${rx}" ry="${f(rx * 0.34)}" transform="rotate(${rot} ${x} ${y})"/>` +
    `<path class="fc01-vein" d="M${f(x - rx * 0.85 * Math.cos((rot * Math.PI) / 180))},${f(y - rx * 0.85 * Math.sin((rot * Math.PI) / 180))} L${f(x + rx * 0.85 * Math.cos((rot * Math.PI) / 180))},${f(y + rx * 0.85 * Math.sin((rot * Math.PI) / 180))}"/>`;
  return svg(p, 'A plant takes its carbon from CO₂ in the air; water and minerals come from the soil. The myth that a plant’s mass comes from the soil is crossed out. On land, plants fix about 120 to 160 billion tonnes of carbon a year, gross; the upper values are debated.', `
    <rect class="fc01-soil" x="14" y="452" width="400" height="104" rx="10"/>
    <path class="fc01-root" d="M212,452 C204,490 176,512 150,548 M212,452 C218,494 246,516 276,552 M212,456 L210,546 M188,488 L160,500 M232,500 L262,500"/>
    <path class="fc01-stem" d="M212,452 C206,372 216,272 210,150"/>
    ${leafE(152, 380, 62, -28)}${leafE(272, 330, 62, 26)}${leafE(156, 262, 54, -34)}${leafE(262, 214, 50, 30)}${leafE(196, 150, 36, -62)}
    ${molecule(64, 92, 'OCO', 11)}${molecule(116, 150, 'OCO', 11)}${molecule(330, 108, 'OCO', 11)}
    ${arr(p, 'c', 'M76,112 C96,160 116,200 134,234')}${arr(p, 'c', 'M330,130 C318,160 296,180 276,196')}
    ${T(214, 40, 'CO₂ from the air', 'sm lab-b fc01-ct')}
    ${water(96, 516)}${water(330, 524)}
    ${arr(p, 'w', 'M110,504 C130,490 146,480 160,470')}${arr(p, 'w', 'M316,512 C296,500 278,490 264,478')}
    ${T(214, 588, 'water and minerals: from the soil', 'sm fc01-w')}

    <rect class="box" x="440" y="24" width="346" height="222" rx="18"/>
    ${T(464, 64, 'Myth', 'lab lab-b fc01-clay', 'start')}
    ${T(464, 98, 'A plant’s mass comes', 'sm', 'start')}${T(464, 124, 'from the soil.', 'sm', 'start')}
    <path class="fc01-strike" d="M460,92 L700,92 M460,118 L612,118"/>
    ${T(464, 174, 'Fact', 'lab lab-b fc01-g', 'start')}
    ${T(464, 206, 'Its carbon comes from', 'sm', 'start')}${T(464, 232, 'CO₂ in the air.', 'sm lab-b', 'start')}

    <rect class="box" x="440" y="270" width="346" height="300" rx="18"/>
    ${T(464, 314, 'All land plants fix', 'lab lab-b', 'start')}
    ${T(613, 392, '≈ 120–160', 'fc01-big')}
    ${T(613, 436, 'billion tonnes of carbon', 'sm')}${T(613, 462, 'a year (gross)', 'sm')}
    ${T(613, 506, 'upper values debated', 'sm fc01-mute')}
    ${T(613, 548, 'Beer et al. 2010 · Lai et al. 2024', 'fc01-cr')}
  `);
}

/* ---------- e · Day and night: the same enzymes switched on and off ---------- */

function drawE(): string {
  const p = 'fc01e';
  const D = 203, N = 597;
  const list = (cx: number, on: boolean): string =>
    // Named on slide C3 (FBPase, SBPase, PRK in regeneration; GAPDH in reduction); here only their step.
    ['regeneration', 'regeneration', 'regeneration', 'reduction'].map((n, i) => chip(cx, 204 + i * 50, n, on)).join('');
  return svg(p, 'Day and night. By day, light drives ferredoxin, which reduces thioredoxin; thioredoxin switches on FBPase, SBPase, PRK and GAPDH by reducing their disulfides, and Rubisco is kept active by activase, which uses ATP. The cycle turns. At night an oxidising switch re-forms the disulfides, GAPDH and PRK are held in a CP12 complex, and the cycle stops.', `
    <rect class="fc01-day" x="14" y="14" width="378" height="572" rx="20"/>
    <rect class="fc01-night" x="408" y="14" width="378" height="572" rx="20"/>
    ${T(D, 58, 'Day: light on', 'lab lab-b')}${T(N, 58, 'Night: light off', 'lab lab-b')}

    ${bolt(p, 40, 86, 84, 116)}
    <circle class="blob-small" cx="112" cy="126" r="20"/>${T(112, 133, 'Fd', 'sm')}
    ${arrow(p, 'ink', 'M134,126 L168,126')}
    <rect class="fc01-trxbox" x="172" y="104" width="190" height="44" rx="22"/>${T(267, 133, 'thioredoxin', 'sm lab-b fc01-g')}
    ${arr(p, 'g', 'M267,150 L267,174', 'fc01-trx')}

    ${moon(452, 126, 17)}
    <rect class="fc01-oxbox" x="482" y="104" width="250" height="44" rx="22"/>${T(607, 133, 'oxidising switch', 'sm lab-b')}
    ${arrow(p, 'ink', 'M607,150 L607,174')}

    ${list(D, true)}${list(N, false)}
    <rect class="fc01-cp12" x="${N - 162}" y="276" width="324" height="106" rx="16"/>

    ${T(D, 418, 'Rubisco activase', 'sm lab-b')}${T(D, 444, 'uses ATP', 'sm')}
    ${T(N, 418, 'two of them', 'sm lab-b')}${T(N, 444, 'held by CP12', 'sm')}

    ${ring(p, 104, 506, 40, [[290, 390], [50, 150], [170, 270]])}${T(166, 514, 'cycle runs', 'sm lab-b', 'start')}
    ${ring(p, 498, 506, 40, [[290, 390], [50, 150], [170, 270]], 'fc01-cyc-off', false)}${T(560, 514, 'cycle stops', 'sm lab-b', 'start')}
    ${T(D, 574, 'SH SH: reduced, on', 'tiny fc01-g')}${T(N, 574, 'S–S: disulfide, off', 'tiny')}
  `);
}

/* ---------- f · Fuel and key: an analogy, mapped part by part ---------- */

function drawF(): string {
  const p = 'fc01f';
  const gear = (x: number, y: number, r: number, cls: string): string => {
    const n = 12, step = (2 * Math.PI) / n, h = r > 60 ? 14 : 9, pts: string[] = [];
    const pt = (a: number, rr: number): string => `${f(x + rr * Math.cos(a))},${f(y + rr * Math.sin(a))}`;
    for (let i = 0; i < n; i++) {
      const a = i * step;
      pts.push(pt(a - step * 0.3, r), pt(a - step * 0.16, r + h), pt(a + step * 0.16, r + h), pt(a + step * 0.3, r));
    }
    return `<polygon class="${cls}" points="${pts.join(' ')}"/><circle class="fc01-hub" cx="${x}" cy="${y}" r="${f(r * 0.72)}"/>`;
  };
  const key = (x: number, y: number, cls = 'fc01-key'): string =>
    `<circle class="${cls}" cx="${x - 26}" cy="${y}" r="13"/><circle class="fc01-keyhole" cx="${x - 26}" cy="${y}" r="4"/>` +
    `<path class="${cls}" d="M${x - 13},${y - 4} H${x + 28} V${y + 4} H${x + 22} V${y + 12} H${x + 15} V${y + 4} H${x + 9} V${y + 10} H${x + 3} V${y + 4} H${x - 13} Z"/>`;
  return svg(p, 'Analogy. A fuel pump (the light reactions in the thylakoid) sends fuel (ATP and NADPH) to an engine (the Calvin–Benson–Bassham cycle) that turns CO₂ into sugar. The same pump also turns the ignition key (thioredoxin, reduced via ferredoxin). At night no fuel arrives and an oxidising switch pulls the key: the engine stops, so the dark reactions do not run in the dark.', `<g transform="translate(0 20)">
    ${T(135, 100, 'fuel pump', 'lab lab-b')}
    <rect class="fc01-pump" x="40" y="120" width="190" height="180" rx="22"/>${stack(135, 214, 110)}
    ${bolt(p, 26, 40, 66, 118)}${T(70, 52, 'light', 'note', 'start')}
    ${T(135, 334, '= light reactions', 'sm')}${T(135, 360, 'in the thylakoid', 'sm')}

    <rect class="fc01-pipe" x="230" y="176" width="282" height="30" rx="8"/>
    ${tag(312, 191, 'ATP', 'atp')}${tag(418, 191, 'NADPH', 'nadph')}
    ${T(372, 158, 'fuel = ATP + NADPH', 'sm lab-b')}
    <path class="fc01-cable" d="M230,268 H520"/>${key(372, 268)}
    ${T(372, 244, 'ignition key', 'sm lab-b fc01-g')}
    ${T(372, 306, '= thioredoxin,', 'sm')}${T(372, 332, 'reduced by ferredoxin', 'sm')}

    ${gear(612, 218, 84, 'fc01-gear')}${T(612, 214, 'engine', 'lab lab-b')}${T(612, 242, 'CO₂ → sugar', 'sm')}
    <circle class="fc01-lock" cx="530" cy="262" r="7"/><path class="fc01-lock" d="M527,264 L524,280 H536 L533,264 Z"/>
    ${molecule(612, 46, 'OCO', 11)}${arrow(p, 'ink', 'M612,62 L612,106')}${T(652, 54, 'CO₂', 'sm lab-b', 'start')}
    ${arrow(p, 'ink', 'M714,218 L778,218')}${T(744, 200, 'sugar', 'sm lab-b')}
    ${T(612, 344, '= Calvin–Benson–', 'sm')}${T(612, 370, 'Bassham cycle', 'sm')}

    <path class="rule" d="M20,404 H780"/>
    ${moon(56, 456)}${T(90, 464, 'At night', 'lab lab-b', 'start')}
    ${T(40, 506, 'no fuel; thioredoxin oxidised', 'sm', 'start')}
    ${T(40, 534, '(key pulled): the engine stops', 'sm', 'start')}
    ${gear(700, 494, 44, 'fc01-gear fc01-gear-off')}
    ${key(586, 494, 'fc01-key fc01-key-off')}<path class="fc01-cross" d="M560,470 L612,518 M612,470 L560,518"/>
  </g>`);
}

/* ---------- g · Thesis panorama: the two panels of the MSc thesis figure, joined by ATP and NADPH ---------- */

function drawG(): string {
  const p = 'fc01g';
  return svg(p, 'Illustrated light reactions and carbon fixation side by side, after the MSc thesis figure. Left: in the thylakoid membrane, light drives PSII and PSI, water gives electrons and O₂, protons build up in the lumen and ATP synthase makes ATP; ferredoxin reduces NADP⁺ to NADPH. Right: in the stroma, Rubisco joins CO₂ to RuBP, giving PGA; ATP and NADPH from the left reduce PGA to triose phosphate; five of six rebuild RuBP using ATP and one of six leaves as sugar, freeing phosphate.', `
    ${T(14, 30, 'Light reactions · thylakoid', 'sm lab-b', 'start')}${T(440, 30, 'CO₂ fixation · stroma', 'sm lab-b', 'start')}
    ${T(14, 60, 'stroma', 'tiny', 'start')}${T(14, 590, 'lumen', 'tiny', 'start')}
    ${bilayer(p, 14, 380, 300, 370)}
    <rect class="blob-ps" x="22" y="250" width="100" height="170" rx="32"/>${T(72, 330, 'PSII &', 'sm lab-b')}${T(72, 354, 'antenna', 'sm')}
    <ellipse class="blob-b6f" cx="153" cy="335" rx="24" ry="74"/>${T(153, 342, 'b₆f', 'sm')}
    <rect class="blob-ps" x="184" y="250" width="100" height="170" rx="32"/>${T(234, 330, 'PSI &', 'sm lab-b')}${T(234, 354, 'antenna', 'sm')}
    <circle class="blob-small" cx="290" cy="220" r="16"/>${T(290, 227, 'Fd', 'sm')}
    ${synthase(346, 306, 110)}
    ${bolt(p, 36, 110, 62, 244)}${bolt(p, 198, 110, 224, 244)}${T(88, 140, 'light', 'note', 'start')}
    ${epath(p, 'M58,474 L66,424')}${epath(p, 'M120,392 L188,392')}${epath(p, 'M266,254 L280,236')}${T(153, 250, 'e⁻', 'sm fc01-e')}
    ${water(46, 492)}${water(92, 514)}${arrow(p, 'ink', 'M110,532 L136,546')}${molecule(158, 552, 'OO', 11)}
    ${tag(214, 470, '', 'h')}${tag(250, 500, '', 'h')}${tag(206, 528, '', 'h')}${tag(290, 464, '', 'h')}${tag(300, 530, '', 'h')}
    ${arrow(p, 'proton', 'M346,520 L346,430')}${T(368, 474, 'ATP synthase', 'tiny', 'start')}

    ${arrow(p, 'ink', 'M306,212 C350,196 400,236 428,244')}${arrow(p, 'ink', 'M372,262 C400,276 420,294 440,298')}
    ${tag(484, 246, 'NADPH', 'nadph')}${tag(476, 300, 'ATP', 'atp')}

    <rect class="node node-rub" x="500" y="504" width="122" height="44" rx="14"/>${T(561, 533, 'Rubisco', 'sm lab-b')}
    ${pent(561, 462, 34, 'RuBP')}
    ${molecule(712, 570, 'OCO', 11)}${arrow(p, 'ink', 'M690,560 L630,536')}${T(712, 546, 'CO₂', 'sm lab-b')}
    ${arrow(p, 'ink', 'M561,426 L561,384')}
    <rect class="node" x="506" y="340" width="110" height="40" rx="20"/>${T(561, 368, '2 PGA', 'sm lab-b')}
    ${arrow(p, 'ink', 'M561,338 L561,204', 'boost')}${T(578, 270, 'reduction', 'sm', 'start')}
    <rect class="node" x="481" y="160" width="160" height="40" rx="20"/>${T(561, 188, 'triose-P', 'sm lab-b')}
    <path class="ar ar-ink" d="M641,180 C744,180 768,400 598,456" marker-end="url(#${p}-ink)"/>
    ${T(712, 134, '5 of 6', 'sm lab-b')}${T(712, 160, 'rebuild RuBP', 'sm')}${tag(736, 318, 'ATP', 'atp')}
    ${arrow(p, 'ink', 'M530,158 L494,108')}${T(536, 140, '1 of 6', 'sm lab-b', 'start')}
    <rect class="node node-out" x="430" y="56" width="120" height="40" rx="20"/>${T(490, 84, 'sugar', 'sm lab-b')}
    ${tag(596, 70, '', 'pi')}${T(620, 77, 'freed', 'tiny', 'start')}
  `);
}

/* ---------- h · Switch timeline: enzymes follow the light, on and off (schematic) ---------- */

function drawH(): string {
  const p = 'fc01h';
  const x0 = 110, x1 = 760, y0 = 400, yt = 128, tOn = 200, tOff = 520;
  const Y = (v: number): number => y0 - v * (y0 - yt);
  const curve = (): string => {
    const pts: string[] = [];
    for (let x = x0; x <= x1; x += 4) {
      let v = 0.06;
      if (x > tOn) v = 0.06 + 0.86 * (1 - Math.exp(-(x - tOn) / 48));
      if (x > tOff) { const top = 0.06 + 0.86 * (1 - Math.exp(-(tOff - tOn) / 48)); v = 0.06 + (top - 0.06) * Math.exp(-(x - tOff) / 70); }
      pts.push(`${pts.length ? 'L' : 'M'}${x},${f(Y(v))}`);
    }
    return pts.join('');
  };
  return svg(p, 'Schematic time course. While the light is on, ferredoxin and thioredoxin switch FBPase, SBPase, PRK and GAPDH on, and CO₂ is fixed. After the light goes off, an oxidising switch turns them off again and fixation stops.', `<g transform="translate(0 6)">
    <rect class="fc01-lightband" x="${tOn}" y="40" width="${tOff - tOn}" height="34" rx="6"/>
    <rect class="fc01-darkband" x="${x0}" y="40" width="${tOn - x0}" height="34" rx="6"/><rect class="fc01-darkband" x="${tOff}" y="40" width="${x1 - tOff}" height="34" rx="6"/>
    ${T((tOn + tOff) / 2, 64, 'light on', 'sm lab-b')}${T((x0 + tOn) / 2, 64, 'dark', 'sm fc01-paper')}${T((tOff + x1) / 2, 64, 'dark', 'sm fc01-paper')}
    ${sun((tOn + tOff) / 2 - 92, 57, 9)}${moon(tOff + 40, 57, 11)}
    <path class="fc01-guide" d="M${tOn},84 V${y0}M${tOff},84 V${y0}"/>
    <path class="axis" d="M${x0},${yt - 10} V${y0} H${x1}"/>
    <text class="tl" transform="translate(${x0 - 24} ${(y0 + yt) / 2}) rotate(-90)" text-anchor="middle">enzymes switched on</text>
    ${T(x0 - 8, Y(1) + 8, 'all', 'tiny', 'end')}${T(x0 - 8, y0, 'none', 'tiny', 'end')}
    ${T((x0 + x1) / 2, y0 + 34, 'time →', 'tl')}
    <path class="fc01-curve" d="${curve()}"/>
    ${T(tOn + 150, Y(0.92) - 14, 'four cycle enzymes', 'sm lab-b fc01-g')}
    ${T(tOn + 96, Y(0.42), 'Fd → thioredoxin', 'sm', 'start')}${T(tOn + 96, Y(0.42) + 26, 'reduces them', 'sm', 'start')}
    ${T(tOff + 82, Y(0.5), 'oxidising switch', 'sm', 'start')}${T(tOff + 82, Y(0.5) + 26, 'turns them off', 'sm', 'start')}
    <rect class="fc01-fix" x="${tOn + 30}" y="466" width="${tOff - tOn - 10}" height="30" rx="8"/>
    ${T((tOn + tOff) / 2 + 10, 488, 'CO₂ fixed', 'sm lab-b')}
    ${T(x0, 488, 'no fixation', 'sm fc01-mute', 'start')}${T(x1, 488, 'fixation stops', 'sm fc01-mute', 'end')}</g>
    ${T(x1, 548, 'schematic', 'fc01-cr', 'end')}
    ${T(x0, 548, 'after Yoshida et al. 2018; Yoshida & Hisabori 2024', 'fc01-cr', 'start')}
  `);
}

/* ---------- i · An electron's trip from water into sugar, in four panels ---------- */

function drawI(): string {
  const p = 'fc01i';
  const panel = (x: number, y: number, n: number, l1: string, l2: string): string =>
    `<rect class="fc01-panel" x="${x}" y="${y}" width="376" height="276" rx="18"/>` +
    `<circle class="num" cx="${x + 32}" cy="${y + 36}" r="17"/><text class="num-t" x="${x + 32}" y="${y + 42}" text-anchor="middle">${n}</text>` +
    T(x + 62, y + 42, l1, 'sm lab-b', 'start') + T(x + 62, y + 70, l2, 'sm', 'start');
  return svg(p, 'Four steps. One: PSII takes an electron from water and O₂ is released. Two: PSI absorbs a second photon and the electron passes to ferredoxin. Three: ferredoxin reduces NADP⁺ to NADPH and also reduces thioredoxin, which switches the cycle on. Four: 3-PGA is reduced to triose phosphate using NADPH and ATP, so the electron from water ends up in sugar.', `
    ${panel(14, 14, 1, 'PSII takes e⁻ from water', 'O₂ is released')}
    <rect class="blob-ps" x="196" y="114" width="110" height="150" rx="32"/>${T(251, 196, 'PSII', 'sm lab-b')}
    ${bolt(p, 150, 100, 196, 150)}
    ${water(84, 236)}${epath(p, 'M106,232 L192,220')}${T(150, 212, 'e⁻', 'sm fc01-e')}
    ${arrow(p, 'ink', 'M84,214 L84,170')}${molecule(84, 150, 'OO', 11)}
    ${epath(p, 'M306,170 L370,150')}

    ${panel(410, 14, 2, 'PSI: a second photon', 'e⁻ passes to ferredoxin')}
    <rect class="blob-ps" x="556" y="114" width="110" height="150" rx="32"/>${T(611, 196, 'PSI', 'sm lab-b')}
    ${bolt(p, 510, 100, 556, 150)}
    ${epath(p, 'M428,236 L552,226')}${T(468, 258, 'from PSII', 'tiny')}
    <circle class="blob-small" cx="730" cy="150" r="22"/>${T(730, 157, 'Fd', 'sm')}${epath(p, 'M666,170 L704,158')}

    ${panel(14, 310, 3, 'Ferredoxin reduces NADP⁺', 'and thioredoxin')}
    <circle class="blob-small" cx="76" cy="470" r="22"/>${T(76, 477, 'Fd', 'sm')}
    ${epath(p, 'M98,462 L178,426')}${tag(236, 418, 'NADPH', 'nadph')}
    ${arr(p, 'g', 'M98,480 L150,516', 'fc01-trx')}
    <rect class="fc01-trxbox" x="154" y="500" width="150" height="40" rx="20"/>${T(229, 527, 'thioredoxin', 'sm lab-b fc01-g')}
    ${arr(p, 'g', 'M306,520 L338,520', 'fc01-trx')}${T(366, 527, 'on', 'sm lab-b fc01-g')}

    ${panel(410, 310, 4, '3-PGA reduced to triose-P', 'using NADPH and ATP')}
    ${tri(470, 476, 30)}${T(470, 536, '3-PGA', 'sm lab-b')}
    ${arrow(p, 'ink', 'M510,476 L644,476', 'boost')}
    ${tag(560, 430, 'NADPH', 'nadph')}${tag(578, 516, 'ATP', 'atp')}${arrow(p, 'ink', 'M578,498 L578,486')}
    ${epath(p, 'M574,448 L590,470')}
    ${tri(690, 476, 30, 'fc01-tri fc01-tri-out')}${T(690, 536, 'triose-P', 'sm lab-b')}
  `);
}

/* ---------- j · Three icons: the page's three take-homes, one per row, in the order of the claims ----------
 * The rows carry no captions: the claims beside the figure say them (rule 5). The icons sit centred in the card. */

function drawJ(): string {
  const p = 'fc01j';
  const big = (cx: number, cy: number, k: number, body: string): string =>
    `<g transform="translate(${cx} ${cy}) scale(${k}) translate(${-cx} ${-cy})">${body}</g>`;
  return svg(p, 'Three take-homes as icons, in the order of the claims. One: the thylakoid makes NADPH and ATP, and the cycle uses them. Two: an electron goes from water to CO₂; water is oxidised, CO₂ reduced. Three: a switch turned on by the sun and off by the moon: light switches the cycle on.', `
    <path class="rule" d="M140,204 H660M140,396 H660"/>
    <g transform="translate(210 0)">
    ${big(190, 108, 1.3, `${stack(80, 110, 60)}${arrow(p, 'ink', 'M116,110 L134,110')}
      ${tag(182, 88, 'NADPH', 'nadph')}${tag(182, 132, 'ATP', 'atp')}
      ${arrow(p, 'ink', 'M232,110 L250,110')}${ring(p, 284, 110, 24, [[210, 500]], 'fc01-cyc')}`)}

    ${big(190, 300, 1.45, `${water(110, 300)}${epath(p, 'M128,296 C160,270 214,270 244,292')}${T(186, 266, 'e⁻', 'sm fc01-e')}
      ${molecule(270, 300, 'OCO', 11)}`)}
    ${T(74, 360, 'H₂O', 'sm fc01-w')}${T(306, 360, 'CO₂', 'sm fc01-ct')}

    ${big(190, 492, 1.35, `${sun(94, 492, 14)}
      <rect class="fc01-toggle" x="132" y="472" width="96" height="40" rx="20"/><circle class="fc01-knob" cx="208" cy="492" r="15"/>${T(162, 499, 'on', 'sm lab-b fc01-g')}
      ${moon(270, 492, 16)}`)}
    </g>
  `);
}

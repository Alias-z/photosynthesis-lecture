// Carbon bookkeeping per 3 CO₂ for slide C1 · C₃ photosynthesis (research/redo-2026-10-29/EFFICIENCY_BRIEF.md, lecturer,
// 29 Oct 2026: "Why is 3 CO₂ the minimum?", "Why do 5 triose phosphates come back and only 1 is used?"). Joined after C1's
// cell figures (plates.ts, prefix k). Drawn in the deck's carbon form (figs/carbon-form.ts) on the stroma tint of the cell
// figures; the carbon is counted by origin: the acceptor's (RuBP, teal halo) and the carbon fixed from CO₂ (amber halo, the
// deck's mark for a fixed carbon).
// - k1 · carbon balance: 3 RuBP (15 C) + 3 CO₂ (3 C) → 6 triose phosphates (18 C) → 3 RuBP (15 C) back + 1 triose phosphate
//   (3 C) out. The count (15 back, 3 out) is a net balance; the atoms are traced as in cb1 staging k (accuracy review R2,
//   29 Oct 2026): the 3 fixed C sit at C1 of triose phosphates 1, 3 and 6; regeneration puts 2 of them into RuBP (at C3 and
//   C2), and the triose phosphate that leaves holds 1 fixed C and 2 of the acceptor's.
// - k2 · why 3 CO₂: per n CO₂, 2n triose phosphates (6n C); n RuBP to rebuild take 5n C. The cut after 5n C falls inside a
//   triose phosphate for n = 1 (1⅔ back) and n = 2 (3⅓), between two for n = 3 (5 back, 1 out): 15 is the smallest common
//   multiple of 3 and 5.
// - k3 · the acceptor as a loop: 3 RuBP (15 C) on a ring that turns, rebuilt each turn; 3 C come in as CO₂ and 3 C leave as
//   1 triose phosphate (1 fixed C and 2 of the acceptor's, as in k1).
import './carbonbook.css';
import { atomBall, rowWidth, step, type Atom } from './carbon-form';
import { arrow, balls } from './cell-schema';
import type { PlateText, Variant } from '../types';

export const PLATE: PlateText = { n: 'C1', title: '', status: 'draft', lead: '', points: [], refs: [] };
export const VARIANTS: Variant[] = [
  { id: '1', name: 'Carbon balance per 3 CO₂: 15 C back to RuBP, 3 C out = 3 C fixed' },
  { id: '2', name: 'Why 3 CO₂: whole triose phosphates only for 3, 6, 9 … CO₂' },
  { id: '3', name: 'The acceptor as a loop: 15 C rebuilt, 3 C in as CO₂, 3 C out as triose phosphate' },
];

type Pt = [number, number];
type A = 'start' | 'middle' | 'end';
const f = (v: number): string => (Math.round(v * 10) / 10).toString();
const T = (x: number, y: number, s: string, cls: string, a: A = 'middle', extra = ''): string =>
  `<text class="${cls}" x="${f(x)}" y="${f(y)}" text-anchor="${a}"${extra}>${s}</text>`;
const BOND = 'stroke:#6b6a64;fill:none';
const HALO = { a: '#2f8f86', n: '#f2b705' } as const;
const HALO_OP = { a: 0.45, n: 0.75 } as const;

/** Runs of one halo kind as one rounded band behind the balls (so neighbours read as one coloured stretch). */
function bands(xs: number[], ys: number[], halos: string, r: number): string {
  let out = '';
  for (let i = 0; i < halos.length;) {
    const h = halos[i];
    if (h !== 'a' && h !== 'n') { i++; continue; }
    let j = i;
    while (j + 1 < halos.length && halos[j + 1] === h) j++;
    const d = xs.slice(i, j + 1).map((x, k) => `${k ? 'L' : 'M'}${f(x)},${f(ys[i + k])}`).join('') + (i === j ? `l0.01,0` : '');
    out += `<path d="${d}" style="stroke:${HALO[h]};stroke-width:${f(2 * r + 7)};stroke-linecap:round;stroke-linejoin:round;fill:none;opacity:${HALO_OP[h]}"/>`;
    i = j + 1;
  }
  return out;
}
/** A carbon-form row (figs/carbon-form.ts glyphs) centred on (x, y), or starting at x; halos one character per atom:
 *  'a' the acceptor's carbon, 'n' carbon fixed from CO₂, '.' none. */
export function krow(x: number, y: number, formula: string, halos = '', r = 10, anchor: A = 'middle'): string {
  const n = formula.length, w = rowWidth(n, r), x0 = (anchor === 'start' ? x : anchor === 'end' ? x - w : x - w / 2) + r;
  const xs = [...formula].map((_, i) => x0 + i * step(r)), ys = xs.map(() => y);
  const bond = n > 1 ? `<path d="M${f(xs[0])},${f(y)}H${f(xs[n - 1])}" style="${BOND};stroke-width:${f(Math.max(1.6, r * 0.22))}"/>` : '';
  return bands(xs, ys, halos, r) + bond + [...formula].map((a, i) => atomBall(xs[i], y, a as Atom, r)).join('');
}
/** CO₂ as the deck's O–C–O balls, its carbon ringed amber (fixed from CO₂). */
const co2 = (x: number, y: number, r = 10): string => `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r + 3.5)}" style="fill:${HALO.n};opacity:${HALO_OP.n}"/>${balls(x, y, 'OCO', r)}`;
/** The key: the two origins of the carbon. */
function key(cx: number, y: number): string {
  const sw = (x: number, h: 'a' | 'n'): string => `<circle cx="${f(x)}" cy="${f(y)}" r="13.5" style="fill:${HALO[h]};opacity:${HALO_OP[h]}"/>${atomBall(x, y, 'C', 10)}`;
  const a = 'carbon of the acceptor, RuBP', b = 'carbon fixed from CO₂', wa = a.length * 7.4, wb = b.length * 7.4, gap = 40, tot = 30 + wa + gap + 30 + wb;
  const x0 = cx - tot / 2;
  return `${sw(x0 + 10, 'a')}${T(x0 + 30, y + 5, a, 'kb-key', 'start')}${sw(x0 + 30 + wa + gap + 10, 'n')}${T(x0 + 30 + wa + gap + 30, y + 5, b, 'kb-key', 'start')}`;
}
const svg = (label: string, body: string): string =>
  `<svg class="fig-svg cel kb" viewBox="0 0 800 600" role="img" aria-label="${label}"><rect class="cel-stroma" x="0" y="0" width="800" height="600"/>${body}</svg>`;

/* ---------------------------------------------------------------- k1 · carbon balance per 3 CO₂ */

function k1(): string {
  const xR = 250, xC = 550, yIn = [76, 106, 136], yOut = [432, 462, 492];
  const tpX = [342, 458], tpY = [262, 292, 322];
  const rubp = (x: number, ys: number[], h: string): string => ys.map(y => krow(x, y, 'PCCCCCP', h)).join('');
  return svg('The carbon of the Calvin–Benson–Bassham cycle counted per 3 CO2. In: 3 RuBP, the CO2 acceptor, with 15 carbons (teal), and 3 CO2 with 3 carbons (amber). Carboxylation and reduction give 6 triose phosphates, 18 carbons; 3 of them carry 1 fixed carbon each. Out: 5 of them rebuild 3 RuBP, 15 carbons, 2 of which were fixed from CO2; 1 triose phosphate, 3 carbons, as many as were fixed, leaves the cycle, with 1 fixed carbon.', `
    ${T(xR, 44, '3 RuBP', 'cel-mn')}${rubp(xR, yIn, '.aaaaa.')}${T(xR, 172, '15 C', 'kb-s')}
    ${T(400, 116, '+', 'kb-big')}
    ${T(xC, 44, '3 CO₂', 'cel-mn')}${yIn.map(y => co2(xC, y)).join('')}${T(xC, 172, '3 C', 'kb-s')}
    ${arrow([[400, 184], [400, 236]], 'c')}${T(416, 216, 'carboxylation, reduction', 'cbb-proc', 'start')}
    ${tpY.map((y, i) => tpX.map((x, j) => krow(x, y, 'CCCP', ['naa.', 'aaa.', 'naa.', 'aaa.', 'aaa.', 'naa.'][2 * i + j])).join('')).join('')}
    ${T(286, 286, '6 triose', 'cel-mn', 'end')}${T(286, 306, 'phosphates', 'cel-mn', 'end')}
    ${T(514, 300, '18 C = 15 C + 3 C', 'kb-big', 'start')}
    ${arrow([[338, 344], [300, 380], [266, 408]], 'c')}${T(286, 364, '5 to regeneration', 'cbb-proc', 'end')}
    ${arrow([[462, 344], [500, 380], [534, 420]], 'c')}${T(506, 372, '1 out of the cycle', 'cbb-proc', 'start')}
    ${yOut.map((y, i) => krow(xR, y, 'PCCCCCP', ['.aanaa.', '.anaaa.', '.aaaaa.'][i])).join('')}${T(xR, 528, '3 RuBP · 15 C', 'cel-mn')}
    ${krow(xC, 462, 'CCCP', 'naa.')}${T(xC, 500, '1 triose phosphate · 3 C', 'cel-mn')}
    ${arrow([[164, 462], [118, 400], [106, 286], [118, 170], [164, 106]], 'c', { thin: true })}
    ${T(88, 286, 'next turn', 'kb-s', 'middle', ' transform="rotate(-90 88 286)"')}
    ${key(400, 574)}`);
}

/* ---------------------------------------------------------------- k2 · why 3 CO₂ */

function k2(): string {
  const r = 8, w = rowWidth(4, r), pitch = w + 10, x0 = 136, s = step(r);
  const rows = [
    { n: 1, y: 140, back: '1⅔', out: '⅓', ok: false },
    { n: 2, y: 292, back: '3⅓', out: '⅔', ok: false },
    { n: 3, y: 444, back: '5', out: '1', ok: true },
  ];
  const cx = (k: number): number => x0 + Math.floor(k / 3) * pitch + r + (k % 3) * s; // centre of carbon k (0-based)
  const body = rows.map(({ n, y, back, out, ok }) => {
    const need = 5 * n, tps = 2 * n;
    const tp = Array.from({ length: tps }, (_, i) => {
      const h = ['naa.', 'aaa.', 'naa.', 'aaa.', 'aaa.', 'naa.'][i];
      return krow(x0 + i * pitch, y, 'CCCP', h, r, 'start');
    }).join('');
    const xl = cx(0) - r, last = need - 1, xr = cx(last) + r;
    // the cut after the 5n-th carbon: inside a triose phosphate (between two of its carbons) or between two of them
    const inside = last % 3 !== 2;
    const xc = inside ? cx(last) + s / 2 : x0 + Math.floor(last / 3) * pitch + w + 5;
    const brk = `<path class="kb-brk" d="M${f(xl)},${f(y - 18)}V${f(y - 26)}H${f(xr)}V${f(y - 18)}"/>`;
    const co2s = Array.from({ length: n }, (_, i) => co2(64, y - 12 * (n - 1) + 24 * i, 8)).join('');
    return `${co2s}${T(64, y + 58, `${n} CO₂`, 'kb-big')}
      ${brk}${T((xl + xr) / 2, y - 34, `rebuild ${n} RuBP: ${need} C`, 'kb-s')}
      ${tp}${T(x0, y + 38, `${tps} triose phosphate${tps > 1 ? 's' : ''}: ${3 * tps} C`, 'kb-s', 'start')}
      <path class="${inside ? 'kb-cut' : 'kb-cutok'}" d="M${f(xc)},${f(y - 22)}V${f(y + 22)}"/>
      ${T(660, y + 2, back, ok ? 'kb-whole' : 'kb-frac')}${T(752, y + 2, out, ok ? 'kb-whole' : 'kb-frac')}
      ${T(706, y + 40, ok ? '✓' : '✗', ok ? 'kb-ok' : 'kb-no')}`;
  }).join('');
  return svg('Why the cycle is counted per 3 CO2. Each CO2 fixed gives 2 triose phosphates of 3 carbons; each RuBP to rebuild takes 5 carbons. For 1 CO2, the 5 carbons of 1 RuBP end inside the second triose phosphate: 1 and 2 thirds would have to go back, 1 third out. For 2 CO2: 3 and 1 third back, 2 thirds out. For 3 CO2: the 15 carbons of 3 RuBP are exactly 5 triose phosphates, and 1 whole triose phosphate goes out.', `
    ${T(64, 40, 'CO₂ fixed', 'cel-mn')}${T(366, 40, 'triose phosphates made (3 C each)', 'cel-mn')}
    ${T(660, 40, 'back to RuBP', 'cel-mn')}${T(752, 40, 'out', 'cel-mn')}
    <path class="kb-rule" d="M24,56H776"/>
    ${body}<path class="kb-rule" d="M24,216H776"/><path class="kb-rule" d="M24,368H776"/>
    ${key(400, 574)}`);
}

/* ---------------------------------------------------------------- k3 · the acceptor as a loop */

function k3(): string {
  const cx = 400, cy = 292, R = 160, r = 10, da = (step(r) / R) * (180 / Math.PI);
  const P = (a: number, rr = R): Pt => [cx + rr * Math.cos((a * Math.PI) / 180), cy + rr * Math.sin((a * Math.PI) / 180)];
  const arcPts = (a0: number, a1: number, rr = R, n = 8): Pt[] => Array.from({ length: n + 1 }, (_, i) => P(a0 + ((a1 - a0) * i) / n, rr));
  // 3 RuBP, P–C–C–C–C–C–P along the ring, centred at −90°, 30° and 150°
  const rubp = (ac: number): string => {
    const as = [0, 1, 2, 3, 4, 5, 6].map(i => ac + (i - 3) * da), pts = as.map(a => P(a));
    const bond = `<path d="${arcPts(as[0], as[6], R, 12).map((p, i) => `${i ? 'L' : 'M'}${f(p[0])},${f(p[1])}`).join('')}" style="${BOND};stroke-width:2.2"/>`;
    const band = `<path d="${arcPts(as[1], as[5], R, 12).map((p, i) => `${i ? 'L' : 'M'}${f(p[0])},${f(p[1])}`).join('')}" style="stroke:${HALO.a};stroke-width:${2 * r + 7};stroke-linecap:round;stroke-linejoin:round;fill:none;opacity:${HALO_OP.a}"/>`;
    return band + bond + pts.map((p, i) => atomBall(p[0], p[1], (i === 0 || i === 6 ? 'P' : 'C') as Atom, r)).join('');
  };
  const half = 3 * da + 12;
  const turn = (a0: number, a1: number): string => arrow(arcPts(a0 + half, a1 - half, R, 10), 'c', { thin: true });
  const cIn = P(-30), tOut = P(90);
  return svg('The CO2 acceptor drawn as a loop, per 3 CO2. Three RuBP, 15 carbons of the acceptor (teal), sit on a ring that turns: they are rebuilt each turn. Three CO2 bring 3 carbons in (amber); one triose phosphate with 3 carbons leaves the cycle, 1 of them fixed from CO2.', `
    ${turn(-90, 30)}${turn(30, 150)}${turn(150, 270)}
    ${rubp(-90)}${rubp(30)}${rubp(150)}
    ${T(cx, cy - 6, '3 RuBP · 15 C', 'kb-big')}${T(cx, cy + 22, 'rebuilt each turn', 'kb-s')}
    ${[0, 1, 2].map(i => co2(640, 122 + 30 * i)).join('')}${T(640, 92, '3 CO₂ · 3 C', 'cel-mn')}
    ${arrow([[606, 164], [580, 186], cIn], 'gas')}
    ${arrow([tOut, [cx, tOut[1] + 22], [cx, tOut[1] + 52]], 'c')}
    ${krow(cx, tOut[1] + 74, 'CCCP', 'naa.')}${T(cx + 58, tOut[1] + 80, '1 triose phosphate · 3 C', 'cel-mn', 'start')}
    ${key(400, 584)}`);
}

const DRAW: Record<string, () => string> = { 1: k1, 2: k2, 3: k3 };
export const draw = (id: string): string => (DRAW[id] ?? k1)();

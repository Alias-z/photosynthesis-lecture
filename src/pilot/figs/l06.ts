// Slide L06 · Light-harvesting complexes. Confirmed context. Round 2 shows the picks a, c, d, g, i and the combinations k–o;
// b, e, f, h, j stay drawable by id. a, c, d, e reuse ./s6.ts.
// Physics kept honest throughout: Chl b's excited state lies above Chl a's, so energy flows b → a, then among Chl a to
// the reaction centre; only there does an electron move. Numbers: a:b ≈ 2.2 / 11 (PSII–LHCII, PSI–LHCI) and ≈ 2,500 Chl per CO₂ per flash
// (FIGURE_BRIEF; Emerson & Arnold 1932, JGP 16:191), ≈ 10 photons s⁻¹ per chlorophyll in full sun (REVIEW_SUMMARY #16).
import type { PlateText, Variant } from '../types';
import './l06.css';
import { mulberry } from '../../lib/canvas';
import { arrow, text } from '../mechanisms';
import { bolt, epath, molecule } from '../illus';
import {
  absorb, awayFrom, chlHead, defs, dots, f, funnelSvg, glow, hop, inRound, membraneSvg, onRing, pig, qAt, rc, scatter, strip, svg,
  topViewBody, topViewSvg, twoPartsSvg, type Arc, type Box, type Pigment, type Pt,
} from './s6';
import { lightHeads, ray } from './s5';
import { drawRound3 } from './l06r';

export const PLATE: PlateText = {
  n: '6',
  status: 'confirmed',
  title: 'Light-harvesting complexes',
  lead: 'In full sun one chlorophyll absorbs only ~10 photons per second, so light-harvesting complexes (LHC) collect light for each reaction centre.',
  points: [
    { claim: 'Energy transfer.', text: 'Antenna pigments pass on energy, not electrons<br>Only the reaction centre releases an electron' },
    { claim: 'Two antennas.', text: 'LHCII feeds mainly photosystem II (PSII)<br>and PSI too<br>LHCI feeds PSI and absorbs beyond 700 nm' },
  ],
  refs: [
    { label: 'Emerson & Arnold 1932', url: 'https://doi.org/10.1085/jgp.16.2.191' },
    { label: 'Liu et al. 2004', url: 'https://doi.org/10.1038/nature02373' },
    { label: 'Kouřil et al. 2012', url: 'https://doi.org/10.1016/j.bbabio.2011.05.024' },
    { label: 'Su et al. 2017', url: 'https://doi.org/10.1126/science.aan0327' },
    { label: 'Lichtenthaler et al. 2007', url: 'https://doi.org/10.1016/j.plaphy.2007.04.006' },
  ],
  animation: 'Follow an excitation',
};

export const VARIANTS: Variant[] = [
  // Round 3 (27 Oct 2026): real images mixed with drawings, listed first; drawn in ./l06r.ts.
  { id: 'r1', name: 'Routes on the real structure' },
  { id: 'k', name: 'Parts and funnel' },
];

export function draw(id: string): string {
  switch (id) {
    case 'r1': case 'r2': case 'r3': case 'r4': case 'r5': return drawRound3(id) ?? funnelSvg('fl06a');
    case 'b': return stepsSvg();
    case 'c': return topViewSvg('fl06c');
    case 'd': return twoPartsSvg('fl06d');
    case 'e': return membraneSvg('fl06e');
    case 'f': return flashSvg();
    case 'g': return rateSvg();
    case 'h': return dishSvg();
    case 'i': return downhillSvg();
    case 'j': return zoomSvg();
    case 'k': return partsFunnelSvg();
    case 'l': return laddersSvg();
    case 'm': return busyFunnelSvg();
    case 'n': return keyedMapSvg();
    case 'o': return columnsSvg();
    case 'p': return zoomSvg(true);
    default: return funnelSvg('fl06a');
  }
}

/* ---------- shared pieces ---------- */

/** A soft amber halo drawn behind a pigment that holds the excitation. */
const halo = (p: string, [x, y]: Pt, r = 36): string => `<circle cx="${f(x)}" cy="${f(y)}" r="${r}" fill="url(#${p}-glow)"/>`;
/** Reaction centre before charge separation: an empty ring. */
const rcRing = (x: number, y: number, r: number): string => `<circle class="rc-ring f6-rc" cx="${f(x)}" cy="${f(y)}" r="${r}"/>`;
/** An arc that rises h above the higher of its two ends. */
const lift = (a: Pt, b: Pt, h = 26): Arc => [a, [(a[0] + b[0]) / 2, Math.min(a[1], b[1]) - h], b];
const badge = (x: number, y: number, n: number): string =>
  `<circle class="num" cx="${x}" cy="${y}" r="15"/><text class="num-t" x="${x}" y="${y + 6}" text-anchor="middle">${n}</text>`;

/* ---------- 6B · relay steps: four moments of one excitation ---------- */

function stepsSvg(): string {
  const p = 'fl06b';
  const xs = [84, 150, 216, 282], isB = [true, true, false, false], r = 22, R = 370;
  const rows = [112, 238, 364, 490];
  const caps: Array<[string, string]> = [
    ['Chl <tspan font-style="italic">b</tspan> absorbs a photon', 'and becomes excited'],
    ['Energy hops to Chl <tspan font-style="italic">a</tspan>,', 'which sits lower'],
    ['Energy hops on through', 'Chl <tspan font-style="italic">a</tspan> to the centre'],
    ['Only here an electron', 'moves: charge separation'],
  ];
  const up = (k: number, y: number): Pt => [xs[k] + (k ? -6 : 6), y - r - 3];
  const row = (y: number, i: number): string => {
    const into = onRing([R, y], 28, 232);
    const last: Arc = lift([xs[3] + 6, y - r - 3], into, 30);
    const hops = i === 1 ? hop(p, lift([xs[0] + 6, y - r - 3], up(1, y))) + hop(p, lift([xs[1] + 6, y - r - 3], up(2, y)))
      : i === 2 ? hop(p, lift([xs[2] + 6, y - r - 3], up(3, y))) + hop(p, last) : '';
    const lit = i === 0 ? halo(p, [xs[0], y]) : i === 1 ? halo(p, [xs[2], y]) : '';
    const centre = `<rect class="blob-ps" x="${R - 44}" y="${y - 44}" width="88" height="88" rx="28"/>${i === 3 ? rc(R, y, 24) : rcRing(R, y, 24)}`;
    return `${lit}${xs.map((x, k) => pig(x, y, isB[k], r, true)).join('')}${centre}${hops}
      ${i === 2 ? glow(p, qAt(last, 0.72), 0.9) : ''}
      ${i === 0 ? bolt(p, 26, y - 84, 70, y - 22) : ''}
      ${i === 3 ? `${epath(p, `M${R},${y + 28} L${R},${y + 76}`)}${text(R + 16, y + 74, 'e⁻', 'lab lbl-e', 'start')}` : ''}
      ${badge(452, y, i + 1)}${text(478, y - 4, caps[i][0], 'sm lab-b', 'start')}${text(478, y + 24, caps[i][1], 'sm', 'start')}`;
  };
  return svg('Four moments of one excitation: Chl b absorbs light, energy hops to lower-energy Chl a, then on to the reaction centre, where an electron moves', `
    ${defs(p)}
    ${text(117, 40, 'Chl <tspan font-style="italic">b</tspan>', 'sm lab-b f6-lb')}${text(249, 40, 'Chl <tspan font-style="italic">a</tspan>', 'sm lab-b f6-la')}${text(R, 22, 'reaction', 'sm')}${text(R, 46, 'centre', 'sm')}
    <path class="rule" d="M20,175 H780 M20,301 H780 M20,427 H780"/>
    ${rows.map(row).join('')}
  `);
}

/* ---------- 6F · Emerson & Arnold 1932: thousands of chlorophylls per CO₂ fixed per flash ---------- */

function flashSvg(): string {
  const p = 'fl06f';
  const burst = [-150, -110, -70, -30, 10, 190].map(d => {
    const a = (d * Math.PI) / 180;
    return `M${f(78 + 32 * Math.cos(a))},${f(104 + 32 * Math.sin(a))} L${f(78 + 44 * Math.cos(a))},${f(104 + 44 * Math.sin(a))}`;
  }).join(' ');
  const algae = [[214, 152], [232, 166], [252, 150], [270, 168], [288, 156], [226, 180], [262, 182], [244, 170], [280, 182], [210, 172]]
    .map(([x, y]) => `<circle class="fl06-alga" cx="${x}" cy="${y}" r="4.5"/>`).join('');
  // Schematic saturation curve: yield per flash rises with flash brightness, then levels off.
  const O: Pt = [84, 470], gx1 = 386, plateau = 292;
  const curve = Array.from({ length: 61 }, (_, i) => {
    const s = i / 60, y = 1 - Math.exp(-3.4 * s);
    return `${i ? 'L' : 'M'}${f(O[0] + s * (gx1 - O[0] - 6))},${f(O[1] - y * (O[1] - plateau))}`;
  }).join('');
  const field: string[] = [];
  for (let i = 0; i < 50; i++) for (let j = 0; j < 50; j++) field.push(`<circle cx="${464 + i * 5.7}" cy="${92 + j * 5.7}" r="1.5"/>`);
  return svg('Emerson and Arnold 1932: with brief saturating flashes, algae fix at most one CO₂ per about 2,500 chlorophylls per flash, so most chlorophylls only collect light', `
    ${defs(p)}
    ${text(30, 40, 'Emerson & Arnold 1932', 'lab lab-b', 'start')}
    <circle class="fl06-bulb" cx="78" cy="104" r="24"/><rect class="fl06-base" x="67" y="128" width="22" height="16" rx="3"/>
    <path class="fl06-burst" d="${burst}"/>
    ${bolt(p, 112, 92, 196, 120)}${bolt(p, 112, 118, 196, 146)}
    <path class="fl06-liquid" d="M215,140 L201,170 Q197,182 209,182 H291 Q303,182 299,170 L285,140 Z"/>${algae}
    <path class="fl06-flask" d="M232,62 V100 L201,170 Q197,182 209,182 H291 Q303,182 299,170 L268,100 V62"/>
    ${text(78, 178, 'short, bright', 'sm')}${text(78, 204, 'flashes', 'sm')}${text(250, 212, 'algae', 'sm')}
    ${arrow(p, 'ink', `M${O[0]},${O[1]} L${O[0]},246`)}${arrow(p, 'ink', `M${O[0]},${O[1]} L${gx1 + 4},${O[1]}`)}
    <path class="fl06-plateau" d="M${O[0]},${plateau} H${gx1}"/>
    <path class="curve fl06-curve" d="${curve}"/>
    ${text(gx1, plateau - 14, 'levels off', 'sm lab-b', 'end')}
    <text class="tl" transform="translate(60 368) rotate(-90)" text-anchor="middle">CO₂ fixed per flash</text>
    ${text(235, 504, 'flash brightness', 'tl')}
    ${text(gx1, 248, 'schematic', 'tiny f6-tiny', 'end')}
    ${arrow(p, 'ink', `M${gx1 + 8},${plateau} L446,${plateau}`, 'dashed')}
    ${text(604, 62, '≈ 2,500 chlorophylls', 'lab lab-b')}
    <g class="fl06-field">${field.join('')}</g>
    ${arrow(p, 'ink', 'M604,388 L604,420')}
    ${molecule(604, 444, 'OCO', 13)}
    ${text(604, 494, '1 CO₂ fixed per flash', 'lab')}
    ${text(400, 556, 'Most chlorophylls only collect light; few sites convert it.', 'sm lab-b')}
    <a href="https://doi.org/10.1085/jgp.16.2.191" target="_blank" rel="noopener">${text(400, 590, 'Emerson & Arnold 1932, J Gen Physiol 16:191', 'tiny f6-tiny fl06-link')}</a>
  `);
}

/* ---------- 6G · why antennas: one chlorophyll in full sun catches only ≈ 10 photons per second ---------- */

function rateSvg(): string {
  const p = 'fl06g';
  const rand = mulberry(5);
  const T0 = 236, T1 = 764, yA = 168, yB = 372;
  const X = (s: number): number => T0 + s * (T1 - T0);
  const few = [0.05, 0.14, 0.21, 0.36, 0.44, 0.57, 0.66, 0.78, 0.87, 0.95]
    .map(s => `<path class="fl06-tick" d="M${f(X(s))},${yA} v-24"/><circle class="f6-gc" cx="${f(X(s))}" cy="${yA - 28}" r="5"/>`).join('');
  const many = Array.from({ length: 320 }, () => `M${f(X(0.004 + rand() * 0.992))},${yB} v-24`).join(' ');
  const second = (y: number): string => `<path class="bracket" d="M${T0},${y + 12} v8 H${T1} v-8"/>${text((T0 + T1) / 2, y + 46, '1 second', 'sm f6-mut')}`;
  // An antenna: pigments in an oval round a reaction centre, a few routes converging on it.
  const A: Pt = [112, yB];
  const inOval = (x: number, y: number): boolean => ((x - A[0]) / 84) ** 2 + ((y - A[1]) / 56) ** 2 < 1 && awayFrom(A, 30)(x, y);
  const seeds: Pigment[] = [{ x: 46, y: yB - 6, b: true }, { x: 174, y: yB - 26, b: false }, { x: 90, y: yB + 40, b: true }, { x: 160, y: yB + 30, b: false }];
  const pigs = [...seeds, ...scatter(rand, 30, inOval, [20, yB - 60, 204, yB + 60], 0.4, 15, seeds)];
  const routes = seeds.map((q, i): Arc => {
    const b = onRing(A, 24, [180, 320, 120, 40][i]);
    return [[q.x, q.y], [(q.x + b[0]) / 2, Math.min(q.y, b[1]) - 16], b];
  });
  return svg('In full sun a single chlorophyll absorbs only about ten photons per second, so a reaction centre alone would mostly wait; an antenna of many pigments adds up their photons', `
    ${defs(p)}
    ${pig(70, yA, false, 15)}${hop(p, lift([84, yA - 14], [138, yA - 18], 22))}${rcRing(158, yA, 20)}
    ${text(114, yA + 50, 'one pigment', 'sm')}
    ${text(T0, yA - 52, 'full sun: ≈ 10 photons, the centre mostly waits', 'sm', 'start')}
    <path class="axis" d="M${T0},${yA} H${T1}"/>${few}${second(yA)}
    <ellipse class="f6-ant" cx="${A[0]}" cy="${A[1]}" rx="94" ry="64"/>
    ${dots(pigs, 5.5)}${routes.map(a => hop(p, a, true)).join('')}${seeds.map(q => glow(p, [q.x, q.y], 0.55)).join('')}
    ${rcRing(A[0], A[1], 20)}
    ${text(A[0], yB + 94, 'antenna', 'sm')}
    ${text(T0, yB - 52, 'antenna: every pigment’s photons add up', 'sm', 'start')}
    <path class="axis" d="M${T0},${yB} H${T1}"/><path class="fl06-tick fl06-tick-thin" d="${many}"/>${second(yB)}
    ${text(400, 530, '', 'lab lab-b')}
    ${text(400, 580, '≈ 10 photons s⁻¹: Croce & van Amerongen 2013 · ticks schematic', 'tiny f6-tiny')}
  `);
}

/* ---------- 6H · analogy: a satellite dish, not a solar panel ---------- */

function dishSvg(): string {
  const p = 'fl06h';
  const cells: string[] = [];
  for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) {
    const x = 66 + c * 60, y = 78 + r * 60;
    cells.push(`<rect class="fl06-pv" x="${x}" y="${y}" width="52" height="52" rx="4"/>${rc(x + 26, y + 26, 12)}`);
  }
  // Dish: a parabola y = V − (x − 560)² / 4F with its focus at the receiver.
  const V = 396, Fl = 118, Fp: Pt = [560, V - Fl];
  const yD = (x: number): number => V - ((x - 560) ** 2) / (4 * Fl);
  const dish = Array.from({ length: 69 }, (_, i) => { const x = 390 + i * 5; return `${i ? 'L' : 'M'}${x},${f(yD(x))}`; }).join('');
  const surf = Array.from({ length: 13 }, (_, i) => 404 + i * 26).map((x, i) => pig(x, yD(x) - 11, i % 3 === 1, 6.5)).join('');
  const rays = [430, 490, 630, 690].map(x => {
    const hit: Pt = [x, yD(x) - 20];
    const b = onRing(Fp, 26, x < 560 ? 160 : 20);
    return `<path class="fl06-ray" d="M${x},96 V${f(hit[1])}"/>${hop(p, [hit, [(hit[0] + b[0]) / 2, (hit[1] + b[1]) / 2 - 10], b], true)}`;
  }).join('');
  const map: Array<[string, string]> = [
    ['dish', 'antenna pigments collect'], ['focusing', 'energy hops in, no mirror'], ['receiver', 'reaction centre converts'], ['signal out', 'an electron leaves'],
  ];
  return svg('Analogy: a leaf antenna works like a satellite dish, not a solar panel; many pigments collect and pass energy to one reaction centre, which converts it', `
    ${defs(p)}
    ${text(150, 44, 'Solar panel', 'lab lab-b')}
    <rect class="fl06-pv-frame" x="56" y="68" width="188" height="248" rx="8"/>${cells.join('')}
    ${text(150, 352, 'every cell converts', 'sm lab-b')}
    ${text(150, 380, 'as if every pigment', 'sm f6-mut')}${text(150, 404, 'were a reaction centre', 'sm f6-mut')}
    ${text(150, 446, 'not how a leaf works', 'sm lab-b fl06-clay')}
    <path class="rule" d="M302,28 V528"/>
    ${text(560, 44, 'Satellite dish', 'lab lab-b')}
    ${text(430, 88, 'light', 'f6-note', 'end')}
    ${rays}
    <path class="fl06-dish" d="${dish}"/>${surf}
    <path class="fl06-strut" d="M404,${f(yD(404))} L540,${Fp[1] + 14} M716,${f(yD(716))} L580,${Fp[1] + 14}"/>
    <rect class="blob-ps" x="${Fp[0] - 24}" y="${Fp[1] - 22}" width="48" height="44" rx="12"/>${rc(Fp[0], Fp[1], 14)}
    ${epath(p, `M${Fp[0]},${Fp[1] - 24} L${Fp[0]},150`)}${text(Fp[0] + 14, 162, 'e⁻', 'lab lbl-e', 'start')}
    ${map.map(([a, b], i) => `${text(328, 448 + i * 30, a, 'sm lab-b', 'start')}${text(466, 448 + i * 30, '→', 'sm f6-mut')}${text(486, 448 + i * 30, b, 'sm', 'start')}`).join('')}
    ${text(400, 584, 'Many collect, one converts: a dish, not a panel.', 'lab lab-b')}
  `);
}

/* ---------- 6I · downhill by colour: Chl b's red peak is bluer, so its excited state sits higher ---------- */

function downhillSvg(): string {
  const p = 'fl06i';
  const G = 446, Yb = 160, Ya = 214, xb = 200, xa = 416, xr = 630, hw = 62;
  const lvl = (x: number, y: number): string => `<path class="lvl" d="M${x - hw},${y} H${x + hw}"/>`;
  const h1: Arc = [[xb + hw - 2, Yb - 8], [(xb + xa) / 2 + 4, Yb - 44], [xa - hw + 4, Ya - 8]];
  const h2: Arc = [[xa + hw - 2, Ya - 8], [(xa + xr) / 2, Ya - 40], [xr - hw + 4, Ya - 8]];
  return svg('Energy levels: Chl b absorbs at a shorter red wavelength than Chl a, so its excited state lies higher; energy flows downhill from Chl b to Chl a, then to the reaction centre, where an electron moves', `
    ${defs(p)}${lightHeads(p)}<g transform="translate(0 -14)">
    ${arrow(p, 'ink', 'M40,470 L40,92')}<text class="tl" transform="translate(26 280) rotate(-90)" text-anchor="middle">energy</text>
    ${lvl(xb, G)}${lvl(xa, G)}${lvl(xr, G)}${lvl(xb, Yb)}${lvl(xa, Ya)}${lvl(xr, Ya)}
    ${ray(p, 'r', [[xb - 30, G - 4], [xb - 30, Yb + 8]], '', true, 5, 18)}
    ${ray(p, 'r', [[xa - 30, G - 4], [xa - 30, Ya + 8]], '', true, 5, 18)}
    ${text(xb - 14, 300, '642 nm', 'sm lab-b', 'start')}${text(xa - 14, 330, '662 nm', 'sm lab-b', 'start')}
    ${text(xb - 14, 336, 'shorter', 'sm f6-mut', 'start')}${text(xb - 14, 362, 'wavelength,', 'sm f6-mut', 'start')}${text(xb - 14, 388, 'more energy', 'sm f6-mut', 'start')}
    ${hop(p, h1)}${hop(p, h2)}${glow(p, qAt(h1, 0.5), 0.8)}${glow(p, qAt(h2, 0.5), 0.8)}
    ${text((xb + xa) / 2 + 4, Yb - 62, 'downhill', 'lab lab-b f6-amb')}
    ${text((xa + xr) / 2, Ya - 58, 'energy hops', 'sm f6-amb')}
    ${epath(p, `M${xr + hw - 4},${Ya + 6} L748,300`)}${text(756, 312, 'e⁻', 'lab lbl-e', 'start')}
    ${pig(xb, 494, true, 18, true)}${text(xb, 540, 'Chl <tspan font-style="italic">b</tspan>', 'lab lab-b f6-lb')}
    ${pig(xa, 494, false, 18, true)}${text(xa, 540, 'Chl <tspan font-style="italic">a</tspan>', 'lab lab-b f6-la')}
    ${rcRing(xr, 494, 18)}${text(xr, 540, 'reaction centre', 'sm lab-b')}</g>
    ${text(780, 584, 'red peaks in solvent · spacing exaggerated', 'tiny f6-tiny', 'end')}
  `);
}

/* ---------- 6J · zoom in: membrane → PSII–LHCII → LHCII trimer → one LHCII protein ----------
   6P (place = true): the membrane lens shows a granum from above, PSII–LHCII on the stacked disc and PSI–LHCI on the
   unstacked membrane around it (Wietrzynski et al. 2025), and the protein panel marks two neighbouring chlorophylls
   about 1 nm apart (average Chl–Chl distance ≈ 10 Å; van Amerongen & Croce 2013). */

/** A PSII–LHCII supercomplex seen from above: dimeric core, two minor antennas, two LHCII trimers. */
function superIcon(cx: number, cy: number, s: number, rot = 0, cls = ''): string {
  const tri = (tx: number, ty: number, upward: boolean): string => [0, 1, 2].map(k => {
    const a = ((upward ? -90 : 90) + k * 120) * (Math.PI / 180);
    return `<circle class="f6-ant" cx="${f(tx + 15 * Math.cos(a))}" cy="${f(ty + 15 * Math.sin(a))}" r="15"/>`;
  }).join('');
  return `<g class="${cls}" transform="translate(${f(cx)} ${f(cy)}) rotate(${rot}) scale(${s})">
    <rect class="f6-core" x="-36" y="-40" width="36" height="80" rx="10"/><rect class="f6-core" x="0" y="-40" width="36" height="80" rx="10"/>
    <circle class="f6-ant" cx="-48" cy="-26" r="10"/><circle class="f6-ant" cx="48" cy="26" r="10"/>
    ${tri(-78, 6, true)}${tri(78, -6, false)}</g>`;
}

/** PSI–LHCI seen from above: the core with a belt of four LHCI proteins along one side. */
function psiIcon(cx: number, cy: number, s: number, rot = 0): string {
  return `<g transform="translate(${f(cx)} ${f(cy)}) rotate(${rot}) scale(${s})">
    <rect class="f6-core" x="-30" y="-26" width="60" height="40" rx="10"/>${[-24, -8, 8, 24].map(x => `<circle class="f6-ant" cx="${x}" cy="24" r="8"/>`).join('')}</g>`;
}

function zoomSvg(place = false): string {
  const p = place ? 'fl06p' : 'fl06j';
  const rand = mulberry(17);
  const rr = 86, cy = 146;
  const C1: Pt = [110, cy], C2: Pt = [400, cy], C3: Pt = [690, cy];
  const clip = (id: string, c: Pt): string => `<clipPath id="${p}-${id}"><circle cx="${c[0]}" cy="${c[1]}" r="${rr}"/></clipPath>`;
  const lens = (id: string, c: Pt, body: string): string =>
    `<g clip-path="url(#${p}-${id})"><circle class="fl06-mem" cx="${c[0]}" cy="${c[1]}" r="${rr}"/>${body}</g><circle class="fl06-lens" cx="${c[0]}" cy="${c[1]}" r="${rr}"/>`;
  type Rect = { x: number; y: number; w: number; h: number };
  const boxR = (b: Rect): string => `<rect class="fl06-zbox" x="${f(b.x)}" y="${f(b.y)}" width="${b.w}" height="${b.h}" rx="6"/>`;
  const join = (b: Rect, c: Pt): string =>
    `<path class="fl06-zline" d="M${f(b.x + b.w)},${f(b.y)} L${f(c[0] - rr * 0.5)},${f(c[1] - rr * 0.866)} M${f(b.x + b.w)},${f(b.y + b.h)} L${f(c[0] - rr * 0.5)},${f(c[1] + rr * 0.866)}"/>`;
  // 1 · membrane with several supercomplexes; the boxed one is enlarged next.
  const many: Array<[number, number, number]> = [[-46, -46, 20], [36, -54, -15], [-58, 14, 70], [22, 4, 0], [-14, 60, -30], [62, 52, 40]];
  // 6P: a granum disc (stacked membrane) with PSII–LHCII, ringed by unstacked membrane with PSI–LHCI.
  const disc: Pt = [C1[0] - 8, C1[1] + 2], dr = 50;
  const inDisc: Array<[number, number, number]> = [[-24, -24, 20], [20, -26, -15], [-30, 16, 70], [14, 8, 0], [-4, 34, -30]];
  const ring: Array<[number, number, number]> = [[64, -38, 30], [70, 18, -60], [42, 62, 10], [-30, 70, 80], [-62, -52, -20], [8, -72, 0]];
  const m1 = place
    ? `<circle class="fl06-grana" cx="${disc[0]}" cy="${disc[1]}" r="${dr}"/>${inDisc.map(([dx, dy, rot]) => superIcon(disc[0] + dx, disc[1] + dy, 0.24, rot)).join('')}${ring.map(([dx, dy, rot]) => psiIcon(disc[0] + dx, disc[1] + dy, 0.36, rot)).join('')}`
    : many.map(([dx, dy, rot]) => superIcon(C1[0] + dx, C1[1] + dy, 0.3, rot)).join('');
  const box1: Rect = place ? { x: disc[0] + 14 - 30, y: disc[1] + 8 - 14, w: 60, h: 28 } : { x: C1[0] + 22 - 36, y: C1[1] + 4 - 16, w: 72, h: 32 };
  // 2 · one supercomplex; the right-hand LHCII trimer is enlarged next.
  const m2 = superIcon(C2[0], C2[1], 0.72);
  const tR: Pt = [C2[0] + 78 * 0.72, C2[1] - 6 * 0.72];
  const box2: Rect = { x: tR[0] - 26, y: tR[1] - 26, w: 52, h: 52 };
  // 3 · one LHCII trimer with its pigments; the lowest protein is enlarged below.
  const lobes = [0, 1, 2].map((k): Pt => { const a = ((90 + k * 120) * Math.PI) / 180; return [C3[0] + 34 * Math.cos(a), C3[1] - 6 + 34 * Math.sin(a)]; });
  const m3 = lobes.map(([x, y]) => `<circle class="f6-ant" cx="${f(x)}" cy="${f(y)}" r="33"/>`).join('')
    + lobes.map(([x, y]) => dots(scatter(rand, 14, (px, py) => Math.hypot(px - x, py - y) < 26, [x - 30, y - 30, x + 30, y + 30], 6 / 14, 11), 4.2)).join('');
  const L0 = lobes[0];
  const box3: Rect = { x: L0[0] - 36, y: L0[1] - 36, w: 72, h: 72 };
  // 4 · one LHCII protein: three helices, four carotenoids (two crossing), eight Chl a and six Chl b.
  const P0: Rect = place ? { x: 316, y: 290, w: 464, h: 300 } : { x: 236, y: 290, w: 544, h: 300 };
  const helices: Array<[number, number, number]> = [[452, 440], [598, 440], [525, 532]].map(([x, y]) => [x, y, 22]);
  const cars: Array<[number, number, number, number]> = [[492, 392, 558, 488], [558, 392, 492, 488], [634, 520, 668, 548], [404, 486, 392, 532]];
  const chlA: Pt[] = [[436, 376], [525, 362], [614, 376], [664, 440], [406, 440], [474, 512], [576, 512], [640, 494]];
  const chlB: Pt[] = [[392, 392], [692, 404], [430, 542], [620, 556], [525, 402], [525, 478]];
  const exitA = chlA[3];
  const route: Arc[] = [
    [[chlB[1][0] - 6, chlB[1][1] + 10], [686, 430], [exitA[0] + 10, exitA[1] - 8]],
    [[exitA[0] + 12, exitA[1] + 6], [716, 484], [764, 500]],
  ];
  const blob = 'M372,446 C366,378 452,348 530,350 C616,352 704,388 708,456 C712,530 640,578 536,578 C446,578 378,520 372,446 Z';
  // 6P: the place key under the membrane lens, and a spacing bar between two neighbouring chlorophylls.
  const placeKey = `<g transform="translate(24 254)">${superIcon(14, 0, 0.17)}${text(40, 7, 'stacked: PSII + LHCII', 'sm', 'start')}${psiIcon(14, 30, 0.3)}${text(40, 37, 'unstacked: PSI + LHCI', 'sm', 'start')}</g>`;
  const [sa, sb] = [chlA[1], chlA[2]];
  const spacing = `<path class="fl06-dim" d="M${sa[0]},${sa[1] - 16} V${sa[1] - 30} M${sb[0]},${sb[1] - 16} V${sb[1] - 30} M${sa[0]},${sa[1] - 24} L${sb[0]},${sb[1] - 24}"/>${text((sa[0] + sb[0]) / 2, Math.min(sa[1], sb[1]) - 34, '≈ 1 nm', 'sm lab-b')}`;
  const label = place
    ? 'Zoom from the thylakoid membrane, seen from above: PSII with LHCII on the stacked granum disc, PSI with LHCI on the unstacked membrane around it; then one PSII–LHCII supercomplex, an LHCII trimer and one LHCII protein, whose scaffold holds eight Chl a, six Chl b and four carotenoids about 1 nm apart'
    : 'Zoom from the thylakoid membrane to a PSII–LHCII supercomplex, an LHCII trimer and one LHCII protein, whose scaffold holds eight Chl a, six Chl b and four carotenoids in place';
  return svg(label, `
    ${defs(p)}<defs>${clip('c1', C1)}${clip('c2', C2)}${clip('c3', C3)}</defs>
    ${text(C1[0], 40, 'membrane', 'sm lab-b')}${text(C2[0], 40, 'PSII + LHCII', 'sm lab-b')}${text(C3[0], 40, 'LHCII trimer', 'sm lab-b')}
    ${lens('c1', C1, m1 + boxR(box1))}${lens('c2', C2, m2 + boxR(box2))}${lens('c3', C3, m3 + boxR(box3))}
    ${join(box1, C2)}${join(box2, C3)}
    <path class="fl06-zline" d="M${f(box3.x)},${f(box3.y + box3.h)} L420,${P0.y} M${f(box3.x + box3.w)},${f(box3.y + box3.h)} L730,${P0.y}"/>
    <rect class="box" x="${P0.x}" y="${P0.y}" width="${P0.w}" height="${P0.h}" rx="18"/>
    <path class="f6-ant" d="${blob}"/>
    ${helices.map(([x, y, r]) => `<circle class="fl06-helix" cx="${x}" cy="${y}" r="${r}"/>`).join('')}
    ${cars.map(([x0, y0, x1, y1]) => `<path class="fl06-car" d="M${x0},${y0} L${x1},${y1}"/>`).join('')}
    ${chlA.map(([x, y]) => pig(x, y, false, 11)).join('')}${chlB.map(([x, y]) => pig(x, y, true, 10)).join('')}
    ${glow(p, chlB[1], 0.75)}${route.map(a => hop(p, a, true)).join('')}
    ${text(770, 538, 'to PSII', 'sm lab-b', 'end')}
    ${text(P0.x + 20, 326, 'one LHCII protein', 'sm lab-b', 'start')}
    ${place ? placeKey + spacing : ''}
    <g transform="translate(30 ${place ? 356 : 330})">
      ${pig(10, -7, false, 10)}${text(30, 0, 'Chl <tspan font-style="italic">a</tspan>', 'sm', 'start')}
      ${pig(10, 33, true, 9.5)}${text(30, 40, 'Chl <tspan font-style="italic">b</tspan>', 'sm', 'start')}
      <path class="fl06-car" d="M0,73 L22,73"/>${text(30, 80, 'carotenoid', 'sm', 'start')}
      <circle class="fl06-helix" cx="10" cy="113" r="10"/>${text(30, 120, 'helix', 'sm', 'start')}
      ${text(0, 186, '<tspan font-style="italic">a</tspan>:<tspan font-style="italic">b</tspan> ≈ 1.3', 'lab lab-b', 'start')}
      ${text(0, 214, 'Chl <tspan font-style="italic">b</tspan>-rich', 'sm f6-mut', 'start')}
    </g>
  `);
}

/* ======================================================================================================
   Round 2 · k–o combine the lecturer's picks (A funnel, C top view, D two parts, G why antennas, I downhill)
   into figures that carry all three page points. They reuse the picked drawings' marks and helpers.
   ====================================================================================================== */

/** A's energy funnel re-laid: A's x positions scaled by sx about cx, with rim, floor and notch depths set per figure. */
interface FunnelOpts { cx?: number; sx?: number; rim: number; floor: number; notch: number; base: number }
interface Funnel { body: string; R: Pt; X: (u: number) => number; yb: number; ya: number }
function funnelCore(p: string, o: FunnelOpts): Funnel {
  const cx = o.cx ?? 400, sx = o.sx ?? 1, r = 17, rr = 20;
  const { rim: RIM, floor: FLOOR, notch: NOTCH, base: BASE } = o;
  const X = (u: number): number => cx + (u - 400) * sx;
  const x = (u: number): string => f(X(u));
  const yb = RIM - r - 1.5, ya = FLOOR - r - 1.5;
  const R: Pt = [cx, NOTCH - rr - 1.5];
  const ground = `M${x(64)},${RIM} H${x(196)} C${x(234)},${RIM} ${x(230)},${FLOOR} ${x(262)},${FLOOR} H${x(374)} C${x(390)},${FLOOR} ${x(386)},${NOTCH} ${x(400)},${NOTCH} C${x(414)},${NOTCH} ${x(410)},${FLOOR} ${x(426)},${FLOOR} H${x(538)} C${x(570)},${FLOOR} ${x(566)},${RIM} ${x(604)},${RIM} H${x(736)}`;
  const bX = [98, 160, 640, 702].map(X), aX = [290, 345, 455, 510].map(X);
  const tb = (u: number): Pt => [u, yb - r - 3], ta = (u: number): Pt => [u, ya - r - 3];
  const step = (a: Pt, b: Pt, h = 28): Arc => [a, [(a[0] + b[0]) / 2, Math.min(a[1], b[1]) - h], b];
  const route = (b0: number, b1: number, a0: number, a1: number, side: -1 | 1): Arc[] => {
    const into: Pt = onRing(R, rr + 3, side < 0 ? 228 : 312);
    return [step(tb(b0), tb(b1)), [tb(b1), [a0 - (a0 - b1) * 0.15, yb - r - 26], ta(a0)], step(ta(a0), ta(a1)), step(ta(a1), into, 24)];
  };
  const routes = [route(bX[0], bX[1], aX[0], aX[1], -1), route(bX[3], bX[2], aX[3], aX[2], 1)];
  const trail = (arcs: Arc[]): string => arcs.map(a => hop(p, a)).join('')
    + arcs.map((a, i) => (i === arcs.length - 1 ? glow(p, qAt(a, 0.55), 1.1) : glow(p, qAt(a, 0.5), 0.72, 0.45 + 0.15 * i))).join('');
  const body = `<path class="f6-terrain" d="${ground} V${BASE} H${x(64)} Z"/><path class="f6-ground" d="${ground}"/>
    ${bX.map(u => pig(u, yb, true, r, true)).join('')}${aX.map(u => pig(u, ya, false, r, true)).join('')}
    ${rc(R[0], R[1], rr)}${routes.map(trail).join('')}
    ${bolt(p, X(58), yb - 111.5, X(95), yb - 15.5)}${bolt(p, X(742), yb - 111.5, X(705), yb - 15.5)}`;
  return { body, R, X, yb, ya };
}

/** PSII–LHCII in miniature (C's shapes): dimeric core with two centres, minor antennas, two LHCII trimers. */
function miniPSII(cx: number, cy: number, s: number, withDots = false): string {
  const rand = mulberry(41);
  const lobes = (tx: number, ty: number, up: boolean): Pt[] => [0, 1, 2].map((k): Pt => {
    const a = ((up ? -90 : 90) + k * 120) * (Math.PI / 180);
    return [cx + (tx + 15 * Math.cos(a)) * s, cy + (ty + 15 * Math.sin(a)) * s];
  });
  const tris = [...lobes(-78, 6, true), ...lobes(78, -6, false)];
  const cores: Box[] = [[cx - 36 * s, cy - 40 * s, cx, cy + 40 * s], [cx, cy - 40 * s, cx + 36 * s, cy + 40 * s]];
  const R2: Pt[] = [[cx - 18 * s, cy], [cx + 18 * s, cy]];
  const dr = 4.2, gap = 11;
  const pigs = withDots ? [
    ...tris.flatMap(([a, b]) => scatter(rand, 3, (x, y) => Math.hypot(x - a, y - b) < 15 * s - dr - 1, [a - 15 * s, b - 15 * s, a + 15 * s, b + 15 * s], 0.43, gap)),
    ...cores.flatMap((c, i) => scatter(rand, 5, (x, y) => inRound(c, dr + 3)(x, y) && awayFrom(R2[i], 9 * s + dr + 2)(x, y), c, 0, gap)),
  ] : [];
  return `${superIcon(cx, cy, s)}${dots(pigs, dr)}${R2.map(([a, b]) => rcRing(a, b, 9 * s)).join('')}`;
}

/** PSI–LHCI in miniature (C's shapes): one core with its centre and a belt of four LHCI proteins along one side. */
function miniPSI(cx: number, cy: number, s: number, withDots = false): string {
  const rand = mulberry(43);
  const core: Box = [cx - 117 * s, cy - 80 * s, cx + 117 * s, cy + 80 * s];
  const belt: Pt[] = [0, 1, 2, 3].map((k): Pt => [cx + (-77 + k * 51) * s, cy + (136 + Math.abs(k - 1.5) * 6) * s]);
  const dr = 4.2, gap = 11;
  const pigs = withDots ? [
    ...scatter(rand, 26, (x, y) => inRound(core, dr + 5)(x, y) && awayFrom([cx, cy], 16 * s + dr + 2)(x, y), core, 0, gap),
    ...belt.flatMap(([a, b]) => scatter(rand, 4, (x, y) => Math.abs(x - a) < 23 * s - dr - 2 && Math.abs(y - b) < 42 * s - dr - 2, [a - 23 * s, b - 42 * s, a + 23 * s, b + 42 * s], 0.21, gap)),
  ] : [];
  return `<rect class="f6-core" x="${f(core[0])}" y="${f(core[1])}" width="${f(core[2] - core[0])}" height="${f(core[3] - core[1])}" rx="${f(26 * s)}"/>
    ${belt.map(([a, b]) => `<rect class="f6-ant" x="${f(a - 23 * s)}" y="${f(b - 42 * s)}" width="${f(46 * s)}" height="${f(84 * s)}" rx="${f(16 * s)}"/>`).join('')}
    ${dots(pigs, dr)}${rcRing(cx, cy, 16 * s)}`;
}

/** G's photon ticks along a one-second axis: sparse with dot heads for one pigment, dense for an antenna. */
function photonTicks(x0: number, x1: number, y: number, dense: boolean, h = 24, seed = 5): string {
  const X = (s: number): number => x0 + s * (x1 - x0);
  if (!dense) {
    return [0.05, 0.14, 0.21, 0.36, 0.44, 0.57, 0.66, 0.78, 0.87, 0.95]
      .map(s => `<path class="fl06-tick" d="M${f(X(s))},${y} v-${h}"/><circle class="f6-gc" cx="${f(X(s))}" cy="${y - h - 4}" r="5"/>`).join('')
      + `<path class="axis" d="M${x0},${y} H${x1}"/>`;
  }
  const rand = mulberry(seed);
  const many = Array.from({ length: 320 }, () => `M${f(X(0.004 + rand() * 0.992))},${y} v-${h}`).join(' ');
  return `<path class="axis" d="M${x0},${y} H${x1}"/><path class="fl06-tick fl06-tick-thin" d="${many}"/>`;
}

/* ---------- 6K · parts in a funnel: D's two structures above A's funnel, and which antenna feeds which photosystem ---------- */

function partsFunnelSvg(): string {
  const p = 'fl06k';
  const F = funnelCore(p, { rim: 280, floor: 370, notch: 382, base: 420 });
  const ob = 172, oa = 486, oy = 82;
  const name = (ox: number, b: boolean, nm: string): string =>
    `${pig(ox + 58, oy + 9, b, 9)}${text(ox + 74, oy + 18, b ? 'Chl <tspan font-style="italic">b</tspan>' : 'Chl <tspan font-style="italic">a</tspan>', `lab lab-b ${b ? 'f6-lb' : 'f6-la'}`, 'start')}`
    + text(ox + 50, oy + 46, `red peak ${nm} nm`, 'sm f6-mut', 'start');
  return svg('Chl b and Chl a differ by one group, –CHO instead of –CH₃, which moves the red peak from 662 to 642 nm. In the antenna funnel Chl b therefore sits higher than Chl a; energy hops down to the reaction centre, where an electron moves. LHCII serves mainly PSII, and PSI too; LHCI serves PSI', `
    ${defs(p)}
    ${chlHead(ob, oy, 0.5, '–CHO')}${name(ob, true, '642')}
    ${chlHead(oa, oy, 0.5, '–CH₃')}${name(oa, false, '662')}
    ${arrow(p, 'ink', 'M34,420 L34,170')}
    <text class="tl" transform="translate(22 295) rotate(-90)" text-anchor="middle">excitation energy</text>
    ${F.body}
    ${text(F.X(400), 280, 'only energy moves', 'lab f6-amb')}
    ${text(F.X(318), 406, 'Chl <tspan font-style="italic">a</tspan>', 'sm lab-b f6-la')}${text(F.X(482), 406, 'Chl <tspan font-style="italic">a</tspan>', 'sm lab-b f6-la')}
    ${arrow(p, 'ink', `M${F.R[0]},386 L${F.R[0]},452`)}
    ${text(386, 444, 'reaction centre', 'sm', 'end')}${text(414, 444, 'e⁻', 'lab lab-b', 'start')}
    <path class="rule" d="M20,468 H780"/>
    ${miniPSII(92, 532, 0.62)}
    ${text(176, 522, 'PSII + LHCII', 'sm lab-b', 'start')}${text(176, 550, 'Chl <tspan font-style="italic">b</tspan>‑rich · <tspan font-style="italic">a</tspan>:<tspan font-style="italic">b</tspan> ≈ 2.2', 'sm', 'start')}
    ${miniPSI(466, 516, 0.34)}
    ${text(520, 522, 'PSI + LHCI', 'sm lab-b', 'start')}${text(520, 550, 'Chl <tspan font-style="italic">a</tspan>‑rich · <tspan font-style="italic">a</tspan>:<tspan font-style="italic">b</tspan> ≈ 11', 'sm', 'start')}
    ${text(20, 594, 'red peaks of Chl in solvent', 'tiny f6-tiny', 'start')}
  `);
}

/* ---------- 6L · two ladders: I's energy levels for PSII and for PSI; PSI's red forms sit below its centre ---------- */

function laddersSvg(): string {
  const p = 'fl06l';
  const G = 440, Yb = 170, Ya = 224, Yr = 244, Yred = 284, hw = 40;
  const [xb, xa, xr] = [96, 206, 316], [xa2, xr2, xf] = [494, 608, 722];
  const lvl = (x: number, y: number): string => `<path class="lvl" d="M${x - hw},${y} H${x + hw}"/>`;
  const fall = (x0: number, y0: number, x1: number, y1: number, h: number): Arc => [[x0 + hw - 2, y0 - 8], [(x0 + x1) / 2, Math.min(y0, y1) - h], [x1 - hw + 4, y1 - 8]];
  const h1 = fall(xb, Yb, xa, Ya, 44), h2 = fall(xa, Ya, xr, Yr, 34), h3 = fall(xa2, Ya, xr2, Yr, 34);
  const up: Arc = [[xf - hw + 2, Yred - 8], [(xr2 + xf) / 2, Yr - 40], [xr2 + hw - 4, Yr - 8]];
  const pair = (x: number, y: number): string => `${pig(x - 9, y, false, 15)}${pig(x + 9, y, false, 15)}`;
  return svg('Energy levels for both photosystems. PSII with LHCII: Chl b absorbs at a shorter wavelength than Chl a, so energy hops downhill from Chl b to Chl a to the reaction centre. PSI with LHCI: Chl a passes energy downhill to the centre; red forms absorb beyond 700 nm and sit below the centre, so their energy must climb uphill, helped by heat. Only at the centres does an electron move', `
    ${defs(p)}${lightHeads(p)}
    ${arrow(p, 'ink', 'M36,440 L36,120')}<text class="tl" transform="translate(22 280) rotate(-90)" text-anchor="middle">energy</text>
    ${text(206, 38, 'PSII + LHCII', 'lab lab-b')}${text(206, 68, 'Chl <tspan font-style="italic">b</tspan>‑rich · <tspan font-style="italic">a</tspan>:<tspan font-style="italic">b</tspan> ≈ 2.2', 'sm')}
    ${text(608, 38, 'PSI + LHCI', 'lab lab-b')}${text(608, 68, 'Chl <tspan font-style="italic">a</tspan>‑rich · <tspan font-style="italic">a</tspan>:<tspan font-style="italic">b</tspan> ≈ 11', 'sm')}
    <path class="rule" d="M414,20 V560"/>
    ${[xb, xa, xr, xa2, xr2, xf].map(x => lvl(x, G)).join('')}
    ${lvl(xb, Yb)}${lvl(xa, Ya)}${lvl(xr, Yr)}${lvl(xa2, Ya)}${lvl(xr2, Yr)}${lvl(xf, Yred)}
    ${ray(p, 'r', [[xb - 22, G - 4], [xb - 22, Yb + 8]], '', true, 5, 18)}
    ${ray(p, 'r', [[xa - 22, G - 4], [xa - 22, Ya + 8]], '', true, 5, 18)}
    ${ray(p, 'r', [[xa2 - 22, G - 4], [xa2 - 22, Ya + 8]], '', true, 5, 18)}
    ${ray(p, 'r', [[xf - 22, G - 4], [xf - 22, Yred + 8]], '', true, 5, 18)}
    ${text(xb - 10, 312, '642 nm', 'sm lab-b', 'start')}${text(xa - 10, 336, '662 nm', 'sm lab-b', 'start')}
    ${text(xf - 10, 350, 'beyond', 'sm lab-b', 'start')}${text(xf - 10, 376, '700 nm', 'sm lab-b', 'start')}
    ${hop(p, h1)}${hop(p, h2)}${hop(p, h3)}${hop(p, up)}
    ${glow(p, qAt(h1, 0.5), 0.8)}${glow(p, qAt(h3, 0.5), 0.8)}${glow(p, qAt(up, 0.5), 0.8)}
    ${text((xb + xa) / 2, Yb - 62, 'downhill', 'lab lab-b f6-amb')}
    ${text((xa2 + xr2) / 2, Ya - 52, 'downhill', 'lab lab-b f6-amb')}
    ${text(xf + 2, Yr - 74, 'uphill,', 'lab lab-b f6-amb')}${text(xf + 2, Yr - 48, 'helped by heat', 'sm f6-amb')}
    ${epath(p, `M${xr},${Yr + 6} L${xr},334`)}${text(xr + 12, 334, 'e⁻', 'lab lbl-e', 'start')}
    ${epath(p, `M${xr2},${Yr + 6} L${xr2},334`)}${text(xr2 + 12, 334, 'e⁻', 'lab lbl-e', 'start')}
    ${pig(xb, 476, true, 17, true)}${text(xb, 520, 'Chl <tspan font-style="italic">b</tspan>', 'lab lab-b f6-lb')}
    ${pig(xa, 476, false, 17, true)}${text(xa, 520, 'Chl <tspan font-style="italic">a</tspan>', 'lab lab-b f6-la')}
    ${rcRing(xr, 476, 17)}${text(xr, 520, 'reaction', 'sm lab-b')}${text(xr, 546, 'centre', 'sm lab-b')}
    ${pig(xa2, 476, false, 17, true)}${text(xa2, 520, 'Chl <tspan font-style="italic">a</tspan>', 'lab lab-b f6-la')}
    ${rcRing(xr2, 476, 17)}${text(xr2, 520, 'reaction', 'sm lab-b')}${text(xr2, 546, 'centre', 'sm lab-b')}
    ${pair(xf, 476)}${text(xf, 520, 'red forms', 'sm lab-b')}${text(xf, 546, 'Chl pairs', 'sm')}
    ${text(780, 592, '642 and 662 nm: Chl in solvent · spacing exaggerated', 'tiny f6-tiny', 'end')}
  `);
}

/* ---------- 6M · why a funnel: A's funnel above G's photon ticks, one row per photosystem ---------- */

function busyFunnelSvg(): string {
  const p = 'fl06m';
  const F = funnelCore(p, { rim: 152, floor: 244, notch: 256, base: 296 });
  const T0 = 320, T1 = 770;
  const rows: Array<[number, string, string, boolean]> = [
    [398, 'one chlorophyll, full sun', '≈ 10 photons per second', false],
    [462, 'PSII + LHCII', 'Chl <tspan font-style="italic">b</tspan>‑rich antenna', true],
    [526, 'PSI + LHCI', 'Chl <tspan font-style="italic">a</tspan>‑rich antenna', true],
  ];
  return svg('Energy funnel: Chl b on the rim, Chl a on the floor; only energy moves until the reaction centre, where an electron moves. Below, photon arrivals in one second: one chlorophyll in full sun catches about ten, while each photosystem collects many through its own antenna', `
    ${defs(p)}
    ${arrow(p, 'ink', 'M34,296 L34,40')}
    <text class="tl" transform="translate(22 168) rotate(-90)" text-anchor="middle">excitation energy</text>
    ${F.body}
    ${text(104, 66, 'Chl <tspan font-style="italic">b</tspan>', 'sm lab-b f6-lb', 'start')}
    ${text(400, 152, 'only energy moves', 'lab f6-amb')}
    ${text(F.X(318), 280, 'Chl <tspan font-style="italic">a</tspan>', 'sm lab-b f6-la')}
    ${epath(p, `M${F.R[0]},260 L${F.R[0]},336`)}
    ${text(386, 322, 'reaction centre', 'sm', 'end')}${text(414, 322, 'e⁻', 'lab lbl-e', 'start')}
    <path class="rule" d="M20,350 H780"/>
    ${rows.map(([y, a, b, dense], i) => `${text(20, y - 22, a, 'sm lab-b', 'start')}${text(20, y + 4, b, 'sm f6-mut', 'start')}${photonTicks(T0, T1, y, dense, 22, 5 + i)}`).join('')}
    <path class="bracket" d="M${T0},538 v8 H${T1} v-8"/>${text((T0 + T1) / 2, 568, '1 second', 'sm f6-mut')}
    ${text(20, 568, 'each centre kept busy', 'sm lab-b', 'start')}
    ${text(780, 593, '≈ 10 photons s⁻¹: Croce & van Amerongen 2013 · ticks schematic', 'tiny f6-tiny', 'end')}
  `);
}

/* ---------- 6N · map with a key: C's top view under D's two structures and a key for energy and electron ---------- */

function keyedMapSvg(): string {
  const p = 'fl06n';
  const name = (ox: number, oy: number, b: boolean): string =>
    `${pig(ox + 54, oy + 10, b, 8)}${text(ox + 68, oy + 18, b ? 'Chl <tspan font-style="italic">b</tspan>' : 'Chl <tspan font-style="italic">a</tspan>', `lab lab-b ${b ? 'f6-lb' : 'f6-la'}`, 'start')}`;
  return svg('Key: Chl a carries –CH₃ where Chl b carries –CHO; in the antenna only energy hops, at the reaction centre an electron moves. Top view: LHCII serves mainly PSII, and PSI too, Chl b-rich; LHCI serves PSI, Chl a-rich', `
    ${chlHead(96, 64, 0.44, '–CH₃')}${name(96, 64, false)}
    ${chlHead(330, 64, 0.44, '–CHO')}${name(330, 64, true)}
    ${glow(p, [494, 40], 0.6)}${hop(p, [[494, 40], [522, 24], [552, 40]])}${text(566, 48, 'antenna: energy hops', 'sm', 'start')}
    ${rc(523, 90, 15)}${text(566, 98, 'centre: e⁻ moves', 'sm', 'start')}
    <path class="rule" d="M20,124 H780"/>
    <g transform="translate(0 104)">${topViewBody(p, false)}</g>
  `);
}

/* ---------- 6O · three columns, one per page point: D's parts · I's levels · C's two antennas ---------- */

function columnsSvg(): string {
  const p = 'fl06o';
  // Column 1 · one group apart, different colours (D).
  const x0 = 30, x1 = 230, top = 404, base = 488;
  const X = (nm: number): number => x0 + ((nm - 400) / 300) * (x1 - x0);
  const Y = (a: number): number => base - a * (base - top);
  const curve = (k: 'a' | 'b'): string => `<path class="curve chl${k}" d="${absorb(k).map(([nm, a], i) => `${i ? 'L' : 'M'}${f(X(nm))},${f(Y(a))}`).join('')}"/>`;
  const name = (ox: number, oy: number, b: boolean): string =>
    `${text(ox + 50, oy + 22, b ? 'Chl <tspan font-style="italic">b</tspan>' : 'Chl <tspan font-style="italic">a</tspan>', `lab lab-b ${b ? 'f6-lb' : 'f6-la'}`, 'start')}<path class="curve ${b ? 'chlb' : 'chla'}" d="M${ox + 50},${oy + 38} H${ox + 112}"/>`;
  // Column 2 · energy hops downhill, an electron moves at the centre (I).
  const G = 346, Yb = 160, Ya = 206, Yr = 222, hw = 30;
  const [cb, ca, cr] = [318, 404, 490];
  const lvl = (x: number, y: number): string => `<path class="lvl" d="M${x - hw},${y} H${x + hw}"/>`;
  const fall = (x0: number, y0: number, x1: number, y1: number, h: number): Arc => [[x0 + hw - 2, y0 - 8], [(x0 + x1) / 2, Math.min(y0, y1) - h], [x1 - hw + 4, y1 - 8]];
  const h1 = fall(cb, Yb, ca, Ya, 38), h2 = fall(ca, Ya, cr, Yr, 30);
  return svg('Three columns. One: Chl a carries –CH₃ and Chl b –CHO, so their absorption peaks differ. Two: energy hops downhill from Chl b to Chl a to the reaction centre, where an electron moves. Three: LHCII, Chl b-rich, serves mainly PSII, and PSI too; LHCI, Chl a-rich, serves PSI', `
    ${defs(p)}${lightHeads(p)}${strip(`${p}-strip`)}
    <path class="rule" d="M256,24 V566 M548,24 V566"/>
    ${badge(34, 62, 1)}${badge(288, 62, 2)}${badge(568, 62, 3)}
    ${chlHead(92, 160, 0.46, '–CH₃')}${name(92, 160, false)}
    ${chlHead(92, 304, 0.46, '–CHO')}${name(92, 304, true)}
    ${text(x0, top - 16, 'absorption · schematic', 'tiny f6-tiny', 'start')}
    <path class="axis" d="M${x0},${top - 6} V${base} H${x1}"/>
    ${curve('b')}${curve('a')}
    <rect x="${x0}" y="${base + 8}" width="${x1 - x0}" height="14" rx="3" fill="url(#${p}-strip)"/>
    ${text(X(445), base + 48, 'blue', 'sm f6-blue')}${text(X(655), base + 48, 'red', 'sm f6-red')}
    <g transform="translate(404 326) scale(1.15) translate(-404 -255)">
    ${[cb, ca, cr].map(x => lvl(x, G)).join('')}${lvl(cb, Yb)}${lvl(ca, Ya)}${lvl(cr, Yr)}
    ${ray(p, 'r', [[cb - 14, G - 4], [cb - 14, Yb + 8]], '', true, 4, 16)}
    ${ray(p, 'r', [[ca - 14, G - 4], [ca - 14, Ya + 8]], '', true, 4, 16)}
    ${hop(p, h1)}${hop(p, h2)}${glow(p, qAt(h1, 0.5), 0.75)}${glow(p, qAt(h2, 0.5), 0.75)}
    ${text((cb + ca) / 2, Yb - 56, 'downhill', 'sm lab-b f6-amb')}
    ${epath(p, `M${cr},${Yr + 6} L${cr},294`)}${text(cr + 10, 294, 'e⁻', 'lab lbl-e', 'start')}
    ${pig(cb, 370, true, 14, true)}${pig(ca, 370, false, 14, true)}${rcRing(cr, 370, 14)}
    ${text(cb, 406, 'Chl <tspan font-style="italic">b</tspan>', 'sm lab-b f6-lb')}${text(ca, 406, 'Chl <tspan font-style="italic">a</tspan>', 'sm lab-b f6-la')}${text(cr, 406, 'centre', 'sm lab-b')}
    </g>
    ${text(676, 106, 'PSII + LHCII', 'sm lab-b')}
    ${miniPSII(676, 166, 0.98, true)}
    ${text(676, 238, 'Chl <tspan font-style="italic">b</tspan>‑rich · <tspan font-style="italic">a</tspan>:<tspan font-style="italic">b</tspan> ≈ 2.2', 'sm')}
    ${text(676, 300, 'PSI + LHCI', 'sm lab-b')}
    ${miniPSI(676, 370, 0.62, true)}
    ${text(676, 510, 'Chl <tspan font-style="italic">a</tspan>‑rich · <tspan font-style="italic">a</tspan>:<tspan font-style="italic">b</tspan> ≈ 11', 'sm')}
  `);
}

// Slide C4e · Efficiency of photosynthesis, wide figures x1, x2 (lecture day, last; lecturer: "redo slide 25 like the summary
// of slide 20, about efficiency, in 2 layers: the pathways C₃ … CAM compared, and where the energy is lost"). viewBox
// 1340 × 590, 1 unit per px, as figs/cov-w3.ts; its plant drawings (figs/ov-plants.ts) and text helpers (figs/ov-sum.ts).
// Values as figs/ce04e.ts (header, STEPS, CREDIT): C₃ 4.6 %, C₄ 6.0 % (Zhu, Long & Ort 2008, Fig. 1, 30 °C); C₂ between C₃
// and C₄ in heat, no published maximum (Lundgren 2020); CAM ≈ 4.5–4.9 %, agave, theory (Wang et al. 2023); CAM water-use
// efficiency ≈ 3 × C₄ and ≥ 6 × C₃ (Borland et al. 2009). The losses in % of the incident sunlight, in the order of the
// animation 'eff'.
// - x1 · the 4 plants with their maximum and one "why" each; under them the C₃ loss stream, C₄ where it differs.
// - x2 · the loss stream across the page; after the photochemical step it forks into a C₃ and a C₄ lane, which end at
//   wheat (4.6 %) and maize (6.0 %); C₂ and CAM as small notes.
import rubPng from '../../assets/rf/rubisco-8ruc.png';
import { PLANTS, PLANT_H, wheat, maize, flaveria, cactus } from './ov-plants';
import { f, INK, MUTE, RULE, TX, markerDef } from './ov-sum';
import { STEPS, CREDIT, peel, type Step } from './ce04e';

const W = 1340, H = 590;
const MK = 'cex-mk';
const SUN = '#f7ca66', LOSS = '#d9d5ca', PR = '#dc9a7f', PRT = '#9a4426', BIO = '#76aa58', C4T = '#8a6a1e';
const pct = (v: number): string => `${v === 0 ? '0' : v.toFixed(1)} %`;
/** A line of text with **bold** parts. */
const RT = (x: number, y: number, s: string, size: number, fill: string, a: 'start' | 'middle' | 'end' = 'start', weight = 400): string =>
  `<text x="${f(x)}" y="${f(y)}" text-anchor="${a}" style="font-size:${size}px;font-weight:${weight};fill:${fill}">${s.replace(/\*\*([^*]+)\*\*/g, '<tspan style="font-weight:700;fill:#2f2e2b">$1</tspan>')}</text>`;
const svgOf = (label: string, body: string, defs = ''): string =>
  `<svg class="fig-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${label}"><defs>${markerDef(MK)}${defs}</defs>${body}</svg>`;

/* ---------------------------------------------------------------- the small pictures of where each loss happens */

const SPEC = `<linearGradient id="cex-spec" x1="0" x2="1"><stop offset="0" stop-color="#6a2fb5"/><stop offset=".2" stop-color="#2350e6"/><stop offset=".45" stop-color="#2a963a"/><stop offset=".62" stop-color="#e3c21a"/><stop offset=".8" stop-color="#f08a1a"/><stop offset="1" stop-color="#de361e"/></linearGradient>`;
/** Sunlight's spectrum, 300–1100 nm: 400–700 nm in colour, the rest grey (lost). */
function iSpec(cx: number, cy: number): string {
  const x0 = cx - 44, k = 88 / 800, X = (nm: number): number => x0 + (nm - 300) * k;
  return `<rect x="${f(x0)}" y="${f(cy - 10)}" width="88" height="20" rx="3" style="fill:#bdb8ab"/>
    <rect x="${f(X(400))}" y="${f(cy - 10)}" width="${f(X(700) - X(400))}" height="20" style="fill:url(#cex-spec)"/>
    <rect x="${f(x0)}" y="${f(cy - 10)}" width="88" height="20" rx="3" style="fill:none;stroke:#8a877d;stroke-width:1.2"/>`;
}
/** A ray with its head, from a to b. */
function ray(a: [number, number], b: [number, number], c = '#e3a21a', w = 2.6): string {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = [-u[1], u[0]];
  const hb = [b[0] - u[0] * 8, b[1] - u[1] * 8];
  return `<path d="M${f(a[0])},${f(a[1])}L${f(hb[0])},${f(hb[1])}" style="fill:none;stroke:${c};stroke-width:${w};stroke-linecap:round"/>`
    + `<path d="M${f(b[0])},${f(b[1])}L${f(hb[0] + n[0] * 5)},${f(hb[1] + n[1] * 5)}L${f(hb[0] - n[0] * 5)},${f(hb[1] - n[1] * 5)}Z" style="fill:${c}"/>`;
}
/** The leaf: light in, part reflected, part transmitted. */
function iLeaf(cx: number, cy: number): string {
  return `<path d="M${cx - 42},${cy + 2} Q${cx},${cy - 8} ${cx + 42},${cy + 2} V${cy + 11} Q${cx},${cy + 1} ${cx - 42},${cy + 11} Z" style="fill:#cfe3bf;stroke:#76aa58;stroke-width:1.6"/>`
    + ray([cx - 30, cy - 22], [cx - 8, cy - 4]) + ray([cx - 2, cy - 5], [cx + 22, cy - 24]) + ray([cx + 2, cy + 8], [cx + 20, cy + 24]);
}
/** Excitation: blue light lifts chlorophyll to a high level, which falls as heat to the lowest excited level; red light out (fluorescence). */
function iExc(cx: number, cy: number): string {
  const g = cy + 18, s1 = cy - 2, sn = cy - 20, x0 = cx - 30, x1 = cx + 30;
  let wig = '';
  for (let i = 0; i <= 16; i++) { const t = i / 16; wig += `${i ? 'L' : 'M'}${f(cx + 2 + Math.sin(t * 4 * Math.PI) * 3.4)},${f(sn + 2 + (s1 - sn - 8) * t)}`; }
  return `<path d="M${x0},${g}H${x1}M${x0},${s1}H${x1}M${x0},${sn}H${x1}" style="fill:none;stroke:#3d3d3a;stroke-width:2"/>`
    + ray([cx - 16, g], [cx - 16, sn + 1], '#2350e6', 2.6)
    + `<path d="${wig}" style="fill:none;stroke:#b5532f;stroke-width:2;stroke-linecap:round"/><path d="M${cx + 2},${s1}l-4.5,-7h9Z" style="fill:#b5532f"/>`
    + ray([cx + 18, s1], [cx + 18, g - 1], '#de361e', 2.6);
}
/** The Calvin–Benson–Bassham cycle: a ring of 3 arrows (the colours of the deck's cycle). */
function iCycle(cx: number, cy: number): string {
  const r = 17, arc = (a0: number, a1: number, c: string): string => {
    const p = (a: number): [number, number] => [cx + r * Math.cos(a), cy + r * Math.sin(a)];
    const [x0, y0] = p(a0), [x1, y1] = p(a1), t = [-Math.sin(a1), Math.cos(a1)], nn = [Math.cos(a1), Math.sin(a1)];
    return `<path d="M${f(x0)},${f(y0)}A${r},${r} 0 0 1 ${f(x1)},${f(y1)}" style="fill:none;stroke:${c};stroke-width:3.4"/>`
      + `<path d="M${f(x1 + t[0] * 7)},${f(y1 + t[1] * 7)}L${f(x1 + nn[0] * 5.5)},${f(y1 + nn[1] * 5.5)}L${f(x1 - nn[0] * 5.5)},${f(y1 - nn[1] * 5.5)}Z" style="fill:${c}"/>`;
  };
  const d = Math.PI / 180;
  return arc(-80 * d, 25 * d, '#2a963a') + arc(40 * d, 145 * d, '#d9a23a') + arc(160 * d, 265 * d, '#4a78b8');
}
/** RuBisCO (the structure of the deck) with an O₂. */
function iRub(cx: number, cy: number): string {
  const w = 46, h = (w * 471) / 548;
  return `<image href="${rubPng}" x="${f(cx - 36)}" y="${f(cy - h / 2)}" width="${w}" height="${f(h)}"/>`
    + `<g transform="translate(${f(cx + 26)} ${f(cy)}) scale(0.62)"><circle cx="-9" cy="0" r="10" style="fill:#e8573f;stroke:#9a3322;stroke-width:1.6"/><circle cx="9" cy="0" r="10" style="fill:#e8573f;stroke:#9a3322;stroke-width:1.6"/></g>`;
}
/** A mitochondrion: outer membrane and cristae. */
function iMito(cx: number, cy: number): string {
  let cr = '';
  for (let i = 0; i < 4; i++) { const x = cx - 18 + i * 12; cr += `<path d="M${x},${cy - 11} q4,6 0,11 q-4,6 0,11" style="fill:none;stroke:#d9a28a;stroke-width:1.8"/>`; }
  return `<ellipse cx="${cx}" cy="${cy}" rx="30" ry="17" style="fill:#fbefe9;stroke:#b5532f;stroke-width:2"/>${cr}`;
}
/** Sugar: a green ring of 6. */
function iSugar(cx: number, cy: number): string {
  const r = 15, pts = Array.from({ length: 6 }, (_, i) => { const a = (Math.PI / 3) * i + Math.PI / 6; return `${f(cx + r * Math.cos(a))},${f(cy + r * Math.sin(a))}`; });
  return `<path d="M${pts.join('L')}Z" style="fill:#d6e8c7;stroke:#4f7f35;stroke-width:2.2;stroke-linejoin:round"/>`;
}
const ICON: Record<Step['k'] | 'bio', (cx: number, cy: number) => string> = {
  par: iSpec, refl: iLeaf, photo: iExc, carb: iCycle, pr: iRub, resp: iMito, bio: iSugar,
};
const NAME: Record<Step['k'] | 'bio', [string, string]> = {
  par: ['outside', '400–700 nm'], refl: ['reflected,', 'transmitted'], photo: ['photochemical', 'inefficiency'],
  carb: ['carbohydrate', 'synthesis'], pr: ['photo-', 'respiration'], resp: ['respiration', ''], bio: ['left in', 'biomass'],
};

/** A loss's label stack at its foot: picture, name, number (and a C₄ line). up: the stack above (number nearest the stream). */
function stack(fx: number, y: number, k: Step['k'] | 'bio', v: string, o: { c4?: string; fade?: boolean } = {}): string {
  const [a, b] = NAME[k], col = k === 'pr' ? PRT : INK;
  const num = k === 'bio'
    ? `<text x="${f(fx)}" y="${y + 108}" text-anchor="middle" filter="url(#${MK})" style="font-size:28px;font-weight:800;fill:${INK}">${v}</text>`
    : TX(fx, y + 106, v, 23, col, 800, 'middle');
  return `<g${o.fade ? ' style="opacity:.55"' : ''}>${ICON[k](fx, y + 20)}</g>`
    + TX(fx, y + 60, a, 17, INK, 600, 'middle') + (b ? TX(fx, y + 80, b, 17, INK, 600, 'middle') : '') + num
    + (o.c4 ? TX(fx, y + 132, o.c4, 18, C4T, 700, 'middle') : '');
}
/** A peel that turns up off the top of a lane: the mirror of ce04e's peel. */
const peelUp = (x: number, yA: number, yB: number, yEnd: number, ri: number, fill: string): string =>
  `<path transform="scale(1 -1)" d="${peel(x, -yB, -yA, -yEnd, ri)}" style="fill:${fill}"/>`;
const peelDn = (x: number, yA: number, yB: number, yEnd: number, ri: number, fill: string): string =>
  `<path d="${peel(x, yA, yB, yEnd, ri)}" style="fill:${fill}"/>`;
const fillOf = (k: Step['k'] | 'bio'): string => (k === 'pr' ? PR : k === 'bio' ? BIO : LOSS);

/* ---------------------------------------------------------------- x1 */

const CW = W / 4, cx = (i: number): number => i * CW;
interface Col { name: string; plant: string; big: string; bigSize: number; why: string[] }
const COLS: Col[] = [
  { name: 'C₃', plant: 'wheat', big: '4.6 %', bigSize: 44, why: ['loses energy to **photorespiration**'] },
  { name: 'C₂', plant: '<tspan font-style="italic">Flaveria</tspan>', big: 'between C₃ and C₄', bigSize: 26, why: ['in heat: **refixes part of the**', '**photorespired CO₂**'] },
  { name: 'C₄', plant: 'maize', big: '6.0 %', bigSize: 44, why: ['**almost no photorespiration,**', 'but 2 extra ATP per CO₂'] },
  { name: 'CAM', plant: 'agave, in theory', big: '≈ 4.5–4.9 %', bigSize: 44, why: ['**saves water:** water-use', 'efficiency ≈ 3 × C₄, ≥ 6 × C₃'] },
];

export function drawX1(): string {
  // layer 1: a soft strip with the plants, the name beside each; under it the most each stores in biomass and why
  const SH = 118, GY = 110;
  const strip = `<linearGradient id="cex-sky" x1="0" x2="${W}" y1="0" y2="0" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#e3ebf0"/><stop offset="0.4" stop-color="#eff0e3"/><stop offset="0.7" stop-color="#f8efd4"/><stop offset="1" stop-color="#fbe9c4"/></linearGradient>
    <linearGradient id="cex-gnd" x1="0" x2="${W}" y1="0" y2="0" gradientUnits="userSpaceOnUse">
      <stop offset="0.08" stop-color="#b9d39c"/><stop offset="0.36" stop-color="#d3d8a2"/><stop offset="0.64" stop-color="#dfcb8c"/><stop offset="0.9" stop-color="#ecd49e"/></linearGradient>`;
  const scene = `<rect x="4" y="0" width="${W - 8}" height="${SH}" rx="14" style="fill:url(#cex-sky)"/>
    <path d="M4,${GY} H${W - 4} V${SH - 14} a14,14 0 0 1 -14,14 H18 a14,14 0 0 1 -14,-14 Z" style="fill:url(#cex-gnd)"/>
    <rect x="4" y="0" width="${W - 8}" height="${SH}" rx="14" style="fill:none;stroke:#cfc8b6;stroke-width:1"/>`;
  const top = COLS.map((c, i) => {
    const x = cx(i), plant = PLANTS[i](x + 84, GY + 4, Math.min(0.6, 100 / PLANT_H[i]));
    const big = `<text x="${f(x + 16)}" y="${c.bigSize > 30 ? 176 : 168}" filter="url(#${MK})" style="font-size:${c.bigSize}px;font-weight:800;fill:${INK}">${c.big}</text>`;
    return plant + TX(x + 150, 58, c.name, 30, INK, 700) + TX(x + 150, 84, c.plant, 17, MUTE)
      + big + c.why.map((s, j) => RT(x + 16, 208 + j * 22, s, 17, INK)).join('')
      + (i ? `<path d="M${f(x)},${SH + 14} V244" style="stroke:${RULE};stroke-width:1.2"/>` : '');
  }).join('');
  // layer 2: the C₃ stream, 100 % of the sunlight on the leaf, each loss peeling off with its picture, name and share
  const TOP = 300, k = 0.9, ri = 10, yEnd = 414, yLab = 418;
  const vals = [...STEPS.map(s => s.c3), 4.6], keys: Array<Step['k'] | 'bio'> = [...STEPS.map(s => s.k), 'bio'];
  const feet = [250, 428, 606, 784, 962, 1120, 1268];
  const L = vals.reduce((a, v) => [...a, Math.round((a[a.length - 1] - v) * 10) / 10], [100]);
  const xs = vals.map((v, i) => feet[i] - ri - (v * k) / 2);
  let band = `M0,${TOP}H${f(xs[6])}`;
  for (let i = 6; i >= 1; i--) band += `V${f(TOP + L[i] * k)}H${f(xs[i - 1])}`;
  band += `V${f(TOP + 100 * k)}H0Z`;
  const peels = vals.map((v, i) => peelDn(xs[i], TOP + L[i + 1] * k, TOP + L[i] * k, yEnd, ri, fillOf(keys[i]))).join('');
  const c4: Record<number, string> = { 3: `C₄ ${pct(28.7)}`, 4: 'C₄ 0', 5: `C₄ ${pct(2.5)}`, 6: `C₄ ${pct(6.0)}` };
  const labels = vals.map((v, i) => stack(feet[i], yLab, keys[i], pct(v), { c4: c4[i] })).join('');
  const head = TX(0, 284, 'Where the energy of sunlight is lost: C₃ leaf, 30 °C', 17, MUTE, 700) + TX(426, 284, '(C₄ where it differs)', 17, C4T, 700);
  const start = TX(14, TOP + 30, 'sunlight', 17, INK, 600) + TX(14, TOP + 62, '100 %', 26, INK, 800);
  const credit = TX(W, 584, `${CREDIT} · C₂: Lundgren 2020 · CAM: Wang et al. 2023; water: Borland et al. 2009`, 12.5, '#8a877d', 400, 'end');
  return svgOf('Top: the most of the sunlight each type of photosynthesis stores in biomass, with a drawing of a representative plant. C3, wheat: 4.6 percent, it loses energy to photorespiration. C2, Flaveria: between C3 and C4 in heat, as it refixes part of the photorespired CO2. C4, maize: 6.0 percent, almost no photorespiration but 2 extra ATP per CO2. CAM, agave in theory: about 4.5 to 4.9 percent; it saves water, with a water-use efficiency about 3 times that of C4 and at least 6 times that of C3. Bottom: a band of sunlight on a C3 leaf at 30 degrees, 100 percent, from which each loss peels off with a picture of where it happens: 51.3 percent outside 400 to 700 nanometres, 4.9 reflected and transmitted, 6.6 photochemical inefficiency (heat and fluorescence), 24.6 in carbohydrate synthesis (C4 28.7), 6.1 to photorespiration (C4 0), 1.9 to respiration (C4 2.5), leaving 4.6 percent in biomass (C4 6.0).',
    `${scene}${top}${head}<path d="${band}" style="fill:${SUN}"/>${peels}${start}${labels}${credit}`, strip + SPEC);
}

/* ---------------------------------------------------------------- x2 */

export function drawX2(): string {
  const TOP = 150, k = 2.0, ri = 12, xF = 540, Y4 = 290, xE = 1070;
  const s = (key: Step['k']): Step => STEPS.find(q => q.k === key) as Step;
  // the shared stream: the first 3 losses peel off down
  const shared: Array<[Step['k'], number]> = [['par', 200], ['refl', 340], ['photo', 470]];
  let rem = 100;
  const sh = shared.map(([key, fx]) => { const v = s(key).c3, x = fx - ri - (v * k) / 2, yB = TOP + rem * k; rem = Math.round((rem - v) * 10) / 10; return { key, fx, v, x, yA: TOP + rem * k, yB }; });
  const R = rem * k; // 37.2 % left, the thickness of each lane
  const sharedBand = `M0,${TOP}H${xF}V${f(TOP + R)}H${f(sh[2].x)}V${f(sh[2].yB)}H${f(sh[1].x)}V${f(sh[1].yB)}H${f(sh[0].x)}V${f(TOP + 100 * k)}H0Z`;
  const yEnd = 380, yLab = 392;
  const shPeels = sh.map(q => peelDn(q.x, q.yA, q.yB, yEnd, ri, LOSS)).join('');
  const shLabs = sh.map(q => stack(q.fx, yLab, q.key, pct(q.v))).join('');
  // the C₃ lane: straight on, its losses peel off up
  const c3: Array<[Step['k'], number]> = [['carb', 720], ['pr', 880], ['resp', 1010]];
  let r3 = rem, y3 = TOP;
  const l3 = c3.map(([key, fx]) => { const v = s(key).c3, x = fx - ri - (v * k) / 2, yA = y3; y3 = TOP + (rem - (r3 - v)) * k; r3 = Math.round((r3 - v) * 10) / 10; return { key, fx, v, x, yA, yB: y3 }; });
  const lane3 = `M${xF},${TOP}H${f(l3[0].x)}V${f(l3[0].yB)}H${f(l3[1].x)}V${f(l3[1].yB)}H${f(l3[2].x)}V${f(l3[2].yB)}H${xE}V${f(TOP + R)}H${xF}Z`;
  const yUp = 128, up3 = l3.map(q => peelUp(q.x, q.yA, q.yB, yUp, ri, fillOf(q.key))).join('');
  // its label stacks above: picture, name, number nearest the lane
  const lab3 = l3.map(q => stack(q.fx, 4, q.key, pct(q.v))).join('');
  // the C₄ lane: bends down, its losses peel off down; photorespiration 0
  const c4: Array<[Step['k'], number]> = [['carb', 780], ['resp', 1010]];
  let r4 = rem;
  const l4 = c4.map(([key, fx]) => { const v = s(key).c4, x = fx - ri - (v * k) / 2, yB = Y4 + r4 * k; r4 = Math.round((r4 - v) * 10) / 10; return { key, fx, v, x, yA: Y4 + r4 * k, yB }; });
  const xb = xF + 110, m = xF + 55;
  const lane4 = `M${xF},${TOP}C${m},${TOP} ${m},${Y4} ${xb},${Y4}H${xE}V${f(l4[1].yA)}H${f(l4[1].x)}V${f(l4[1].yB)}H${f(l4[0].x)}V${f(Y4 + R)}H${xb}C${m},${f(Y4 + R)} ${m},${f(TOP + R)} ${xF},${f(TOP + R)}Z`;
  const dn4 = l4.map(q => peelDn(q.x, q.yA, q.yB, yEnd, ri, LOSS)).join('');
  const lab4 = l4.map(q => stack(q.fx, yLab, q.key, pct(q.v))).join('') + stack(900, yLab, 'pr', '0', { fade: true });
  // the ends: what is left flows into biomass, the plant and its number
  const end = (yA: number, yB: number): string => `<path d="M${xE - 50},${f(yA)}H${xE}V${f(yA - 6)}l16,${f((yB - yA) / 2 + 6)}l-16,${f((yB - yA) / 2 + 6)}V${f(yB)}H${xE - 50}Z" style="fill:${BIO}"/>`;
  const ends = end(l3[2].yB, TOP + R) + end(Y4, l4[1].yA);
  const big = (x: number, y: number, v: string): string => `<text x="${x}" y="${y}" filter="url(#${MK})" style="font-size:42px;font-weight:800;fill:${INK}">${v}</text>`;
  const plants = wheat(1132, 258, 0.62) + TX(1186, 190, 'C₃', 28, INK, 700) + TX(1236, 190, 'wheat', 17, MUTE) + big(1186, 238, '4.6 %')
    + maize(1132, 404, 0.56) + TX(1186, 330, 'C₄', 28, INK, 700) + TX(1236, 330, 'maize', 17, MUTE) + big(1186, 378, '6.0 %');
  const notes = flaveria(1124, 494, 0.36) + TX(1160, 446, 'C₂', 20, INK, 700) + TX(1160, 468, 'between C₃ and C₄', 16, INK) + TX(1160, 488, 'in heat', 16, INK)
    + cactus(1124, 572, 0.36) + TX(1160, 528, 'CAM ≈ 4.5–4.9 %', 18, INK, 700) + TX(1160, 549, 'agave, in theory;', 16, INK) + RT(1160, 569, '**saves water**', 16, INK);
  const lanes = TX(xF + 58, TOP + 44, 'C₃', 22, INK, 800) + TX(xb + 30, Y4 + 46, 'C₄', 22, INK, 800);
  const start = TX(14, TOP + 34, 'sunlight', 17, INK, 600) + TX(14, TOP + 68, '100 %', 28, INK, 800);
  const credit = TX(0, 562, `${CREDIT.split('; ')[0]};`, 12.5, '#8a877d') + TX(0, 580, `${CREDIT.split('; ')[1]} · leaf, 30 °C · C₂: Lundgren 2020 · CAM: Wang et al. 2023; Borland et al. 2009`, 12.5, '#8a877d');
  return svgOf('A band of sunlight on a leaf at 30 degrees, 100 percent, runs across the page; each loss peels off with a picture of where it happens. Shared by C3 and C4: 51.3 percent outside 400 to 700 nanometres, 4.9 reflected and transmitted, 6.6 photochemical inefficiency (heat and fluorescence). Then the band forks. C3 lane: 24.6 carbohydrate synthesis, 6.1 photorespiration, 1.9 respiration, leaving 4.6 percent in biomass, wheat. C4 lane: 28.7 carbohydrate synthesis, 0 photorespiration, 2.5 respiration, leaving 6.0 percent, maize. Notes: C2, Flaveria, between C3 and C4 in heat; CAM, agave in theory, about 4.5 to 4.9 percent, saves water.',
    `<path d="${lane4}" style="fill:${SUN}"/><path d="${lane3}" style="fill:${SUN}"/><path d="${sharedBand}" style="fill:${SUN}"/>
    ${shPeels}${up3}${dn4}${ends}${lanes}${start}${shLabs}${lab3}${lab4}${plants}${notes}${credit}`, SPEC);
}

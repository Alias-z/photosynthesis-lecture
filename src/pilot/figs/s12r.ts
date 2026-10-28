// Slide 11 · Excess light (was slide 12, "Fates of an excitation"; redo of 27 Oct 2026, block L1c; page text approved 27 Oct). Named s12r because figs/s12.ts already exists
// and l12.ts imports it. Real figure: Porcar-Castell et al. 2021 Nat Plants Fig. 1, in two crops (12-pc-leaf: leaf
// absorptance, partitioning, emission; 12-pc-node: partitioning at PSII). Drawn: a Jablonski diagram LHCII → P680
// after E. Rosenqvist (slide 11), redrawn; excited-state decay curves exp(−t/τ) from the published lifetimes.
// Numbers used, and no others: trapping by open PSII ≈ 0.3 ns (van Amerongen & Croce 2013, 0.3–0.4 ns); excited-state
// lifetime with closed PSII (Fm) ≈ 2 ns (Belgio et al. 2012, 2.0 ± 0.1 ns); carotenoids quench > 95 % of antenna
// chlorophyll triplets (van Amerongen & Croce 2013); β-carotene cannot quench ³P680 (Telfer 2014).
// Focus (lecturer, 27 Oct): in full sun leaves absorb more light than they can use (Murchie & Niyogi 2011 Fig. 1A,
// 12-murchie-1a, a schematic; its labels are masked and set again larger); the pathways compete; excess forms ¹O₂.
import type { PlateText, Variant } from '../types';
import { wave } from '../mechanisms';
import leafPng from '../../assets/photos/12-pc-leaf.png';
import nodePng from '../../assets/photos/12-pc-node.png';
import murchieJpg from '../../assets/photos/12-murchie-1a.jpg';
import './s12r.css';

export const PLATE: PlateText = {
  n: '11',
  title: 'Excess light',
  status: 'draft',
  lead: 'In bright light, leaves absorb more energy than they can use; the excess must be removed or it damages the photosystems.',
  points: [
    { claim: 'Light saturation.', text: 'CO₂ fixation reaches its maximum well below full sunlight<br>Light absorbed beyond that cannot be used' },
    { claim: 'Fates of absorbed energy.', text: 'Each excitation is used in photochemistry, lost as heat or re-emitted as fluorescence<br>When photochemistry is saturated, more goes to heat and fluorescence' },
    { claim: 'Reactive oxygen species.', text: 'Energy and electrons that cannot be used pass to O₂<br>Singlet oxygen and superoxide damage proteins (especially D1), lipids and pigments' },
  ],
  refs: [
    { label: 'Murchie & Niyogi 2011', url: 'https://doi.org/10.1104/pp.110.168831' },
    { label: 'Porcar-Castell et al. 2021', url: 'https://doi.org/10.1038/s41477-021-00980-4' },
    { label: 'van Amerongen & Croce 2013', url: 'https://doi.org/10.1007/s11120-013-9824-3' },
    { label: 'Belgio et al. 2012', url: 'https://doi.org/10.1016/j.bpj.2012.05.004' },
    { label: 'Telfer 2014', url: 'https://doi.org/10.1093/pcp/pcu040' },
  ],
};

export const VARIANTS: Variant[] = [
  { id: 'h', name: 'Light saturation + partitioning at PSII + singlet oxygen, superoxide' },
  { id: 'g', name: 'Light saturation (Murchie & Niyogi 2011) + triplet chlorophyll → ¹O₂, superoxide' },
  { id: 'a', name: 'Partitioning of absorbed light in a leaf (Porcar-Castell 2021)' },
  { id: 'b', name: 'Partitioning at PSII, trapping ≈ 0.3 ns, lifetime ≈ 2 ns' },
  { id: 'c', name: 'Jablonski diagram, LHCII → P680' },
  { id: 'd', name: 'Partitioning at PSII + excited-state decay' },
  { id: 'e', name: 'Partitioning in a leaf + triplet chlorophyll → ¹O₂' },
  { id: 'f', name: 'Excited-state decay + triplet chlorophyll → ¹O₂' },
];

/* ---------- shared parts ---------- */

type A = 'start' | 'middle' | 'end';
type K = 'ink' | 'red' | 'green' | 'grey' | 'clay' | 'orange' | 'blue';
type Pt = [number, number];
const KS: K[] = ['ink', 'red', 'green', 'grey', 'clay', 'orange', 'blue'];
const f = (v: number): string => v.toFixed(1);
const T = (x: number, y: number, s: string, cls = 'fx12-l', a: A = 'start'): string =>
  `<text class="${cls}" x="${f(x)}" y="${f(y)}" text-anchor="${a}">${s}</text>`;
/** Text turned to read upwards, centred on (x, y). */
const TV = (x: number, y: number, s: string, cls = 'fx12-ax'): string =>
  `<text class="${cls}" transform="translate(${f(x)} ${f(y)}) rotate(-90)" text-anchor="middle">${s}</text>`;

/** Arrowheads in each ink and the amber glow of an excitation, prefixed per figure. */
const defs = (p: string): string => `<defs>${KS.map(k =>
  `<marker id="${p}-${k}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path class="fx12-hd-${k}" d="M0,0L10,5L0,10z"/></marker>`).join('')}
  <radialGradient id="${p}-glow"><stop offset="0" stop-color="#f6c453" stop-opacity=".95"/><stop offset=".45" stop-color="#f6c453" stop-opacity=".45"/><stop offset="1" stop-color="#f6c453" stop-opacity="0"/></radialGradient></defs>`;
const ar = (p: string, k: K, d: string, cls = '', start = false): string =>
  `<path class="fx12-ar fx12-k-${k}${cls ? ` ${cls}` : ''}" d="${d}" marker-end="url(#${p}-${k})"${start ? ` marker-start="url(#${p}-${k})"` : ''}/>`;
const wv = (p: string, k: K, x0: number, y0: number, x1: number, y1: number, n = 5, amp = 6): string =>
  `<path class="fx12-ar fx12-k-${k}" d="${wave(x0, y0, x1, y1, amp, n)}" marker-end="url(#${p}-${k})"/>`;
const lvl = (x0: number, x1: number, y: number): string => `<path class="fx12-lvl" d="M${f(x0)},${f(y)} H${f(x1)}"/>`;
const sub = (x0: number, x1: number, y: number): string => `<path class="fx12-sub" d="M${f(x0)},${f(y - 10)} H${f(x1)} M${f(x0)},${f(y - 20)} H${f(x1)}"/>`;
const exc = (p: string, x: number, y: number, r = 22): string =>
  `<circle cx="${f(x)}" cy="${f(y)}" r="${r}" fill="url(#${p}-glow)"/><circle class="fx12-e" cx="${f(x)}" cy="${f(y)}" r="6.5"/>`;
/** A time or fact badge centred at (x, y). */
function badge(x: number, y: number, s: string): string {
  const w = s.replace(/<[^>]+>/g, '').length * 9.2 + 26;
  return `<rect class="fx12-badge" x="${f(x - w / 2)}" y="${f(y - 15)}" width="${f(w)}" height="30" rx="15"/>${T(x, y + 6, s, 'fx12-bt', 'middle')}`;
}

/* real figures: a window of the image, never stretched; published figures keep their white ground multiplied into the page */
interface Img { href: string; w: number; h: number }
interface Shot { svg: string; at: (u: number, v: number) => Pt; h: number }
type Mask = [number, number, number, number, string?];
function shot(id: string, im: Img, x: number, y: number, w: number,
  o: { win?: [number, number, number, number]; fig?: boolean; credit?: string; masks?: Mask[] } = {}): Shot {
  const [u0, v0, uw, vh] = o.win ?? [0, 0, im.w, im.h];
  const s = w / uw, h = vh * s, ox = x - u0 * s, oy = y - v0 * s;
  const img = `<image href="${im.href}" x="${f(ox)}" y="${f(oy)}" width="${f(im.w * s)}" height="${f(im.h * s)}"/>`;
  const masks = (o.masks ?? []).map(([a, b, c, d, fill]) =>
    `<rect x="${f(ox + a * s)}" y="${f(oy + b * s)}" width="${f((c - a) * s)}" height="${f((d - b) * s)}" fill="${fill ?? '#ffffff'}"/>`).join('');
  const band = o.credit ? `<rect class="fx12-credbg" x="${f(x)}" y="${f(y + h - 22)}" width="${f(w)}" height="22"/>${T(x + w - 8, y + h - 6.5, o.credit, 'fx12-cr', 'end')}` : '';
  const clip = o.fig
    ? `<clipPath id="${id}"><rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}"/></clipPath>`
    : `<clipPath id="${id}"><rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="10"/></clipPath>`;
  return { svg: `${clip}<g clip-path="url(#${id})"${o.fig ? ' class="fx12-mult"' : ''}>${img}${masks}${band}</g>`, at: (u, v) => [ox + u * s, oy + v * s], h };
}
const pleader = (a: Pt, b: Pt): string => {
  const d = `M${f(a[0])},${f(a[1])}L${f(b[0])},${f(b[1])}`;
  return `<path class="fx12-ldh" d="${d}"/><path class="fx12-ldk" d="${d}"/><circle class="fx12-tipd" cx="${f(b[0])}" cy="${f(b[1])}" r="2.8"/>`;
};
/** A label pill centred at (x, y), white on photos, tinted on white-ground figures; with `to`, a leader from its edge. */
function pill(x: number, y: number, s: string, to?: Pt, tint = true): string {
  const w = s.replace(/<[^>]+>/g, '').length * 9.7 + 24;
  let ld = '';
  if (to) {
    const dx = to[0] - x, dy = to[1] - y, t = Math.min(w / 2 / Math.max(Math.abs(dx), 1e-6), 14 / Math.max(Math.abs(dy), 1e-6));
    ld = pleader([x + dx * t, y + dy * t], to);
  }
  return `${ld}<rect class="${tint ? 'fx12-pillbg-t' : 'fx12-pillbg'}" x="${f(x - w / 2)}" y="${f(y - 15)}" width="${f(w)}" height="30" rx="15"/>${T(x, y + 6.5, s, 'fx12-pill', 'middle')}`;
}
const credit = (x: number, y: number, s: string, a: A = 'end'): string => T(x, y, s, 'fx12-crd', a);
const svg = (p: string, label: string, body: string): string =>
  `<svg class="fig-svg fx12" viewBox="0 0 800 600" role="img" aria-label="${label}">${defs(p)}${body}</svg>`;

/* ---------- the real figure: Porcar-Castell et al. 2021, Fig. 1, two crops (pixel positions are in the asset files) ---------- */

const LEAF: Img = { href: leafPng, w: 844, h: 964 }; // x 446–1290, y 196–1160 of the 1568 × 1321 figure
const NODE: Img = { href: nodePng, w: 590, h: 760 }; // x 700–1290, y 130–890
const LIME = '#eff5d0'; // the figure's pale-green ground
// Masks: the absorptance tick labels, solar-spectrum traces and a cut label at the left edge of the leaf crop, and the paper's caption keys 4 and 5,
// which the crops cut in half. Nothing in the data is masked.
const LEAF_MASK: Mask[] = [[0, 0, 252, 32], [0, 738, 238, 964], [0, 292, 30, 338], [794, 0, 844, 68, LIME], [814, 604, 844, 676]];
const NODE_MASK: Mask[] = [[532, 66, 590, 134, LIME], [560, 660, 590, 746]];
const CR_PC = 'Porcar-Castell et al. 2021, Nat Plants, Fig. 1 (crop) · © Springer Nature';
// Points in the crops: the PSII → LET arrow (photochemistry), the NPQ arrow (heat), the red arrow (fluorescence), the band
const LP = { let: [820, 92] as Pt, band: [130, 150] as Pt };
const NWIN: [number, number, number, number] = [14, 0, 576, 760]; // leaves out the edge of the absorptance band
const NP = { let: [530, 158] as Pt, fluo: [115, 420] as Pt };

/* a · the leaf crop large, the three exits named */
function drawA(): string {
  const p = 'fx12a', a = shot(`${p}-a`, LEAF, 150, 6, 500, { fig: true, masks: LEAF_MASK });
  return svg(p, 'Porcar-Castell and colleagues 2021, Figure 1, cropped: the absorptance of a leaf from 400 to 900 nanometres, high from 400 to 700 and falling to near zero beyond 750; the absorbed light flows to photosystems I and II; at PSII it splits into photochemistry (linear electron transport), thermal dissipation (NPQ) and fluorescence, whose emission spectrum peaks near 685 and 740 nanometres.', `
    ${a.svg}
    ${pill(...a.at(...LP.band), 'absorbed light', undefined, false)}
    ${pill(a.at(...LP.let)[0] + 6, a.at(...LP.let)[1], 'photochemistry')}
    ${pill(535, 236, 'fluorescence')}
    ${credit(786, 594, CR_PC)}
  `);
}

/* b · the PSII crop large, the exits named, with the two lifetimes */
function drawB(): string {
  const p = 'fx12b', a = shot(`${p}-a`, NODE, 14, 14, 433.5, { fig: true, masks: NODE_MASK, win: NWIN });
  return svg(p, 'Porcar-Castell and colleagues 2021, Figure 1, cropped to photosystem II: the excitation leaves PSII by photochemistry (linear electron transport), by thermal dissipation (NPQ) or as fluorescence, drawn as a red arrow into the leaf emission spectrum. An open PSII traps the excitation in about 0.3 nanoseconds; with PSII closed the excitation lasts about 2 nanoseconds.', `
    ${a.svg}
    ${pill(a.at(...NP.let)[0] + 13, a.at(...NP.let)[1], 'photochemistry')}${badge(632, 174, 'open PSII: trapping ≈ 0.3 ns')}
    ${pill(...a.at(...NP.fluo), 'fluorescence')}${badge(632, 476, 'closed PSII: lifetime ≈ 2 ns')}
    ${credit(786, 592, CR_PC)}
  `);
}

/* ---------- c · Jablonski diagram, LHCII → P680 (after E. Rosenqvist, slide 11; redrawn) ---------- */

function jablonski(p: string): string {
  const y0 = 486, y1 = 196, y1p = 208, yT = 292, xa0 = 92, xa1 = 340, xp0 = 470, xp1 = 590;
  return `
    ${ar(p, 'grey', 'M38,540 L38,70', 'fx12-thin')}${TV(22, 300, 'energy')}
    ${T((xa0 + xa1) / 2, 60, 'LHCII chlorophylls', 'fx12-h', 'middle')}${T((xp0 + xp1) / 2, 60, 'P680 (PSII)', 'fx12-h', 'middle')}
    ${lvl(xa0, xa1, y1)}${sub(xa0, xa1, y1)}${T(xa0 - 12, y1 + 9, 'S₁', 'fx12-lv', 'end')}
    ${lvl(xa0, xa1, y0)}${sub(xa0, xa1, y0)}${T(xa0 - 12, y0 + 9, 'S₀', 'fx12-lv', 'end')}
    ${lvl(294, xa1, yT)}${T(287, yT + 9, 'T₁', 'fx12-lv', 'end')}
    ${lvl(xp0, xp1, y1p)}${sub(xp0, xp1, y1p)}${lvl(xp0, xp1, y0)}${sub(xp0, xp1, y0)}
    ${ar(p, 'grey', `M${xa1 + 14},${(y1 + y1p) / 2} L${xp0 - 14},${(y1 + y1p) / 2}`, 'fx12-thin', true)}${T((xa1 + xp0) / 2, y1 - 36, 'energy', 'fx12-l', 'middle')}${T((xa1 + xp0) / 2, y1 - 14, 'transfer', 'fx12-l', 'middle')}
    ${exc(p, 140, y1)}
    ${wv(p, 'red', 130, y1 + 8, 130, y0 - 6, 7)}${T(130, y0 + 36, 'fluorescence', 'fx12-h fx12-c-red', 'middle')}
    ${wv(p, 'grey', 250, y1 + 8, 250, y0 - 6, 7)}${T(266, y0 + 36, 'heat (NPQ)', 'fx12-h fx12-c-grey', 'middle')}
    ${ar(p, 'clay', `M${300},${y1 + 6} L${312},${yT - 6}`, 'fx12-dash')}
    ${ar(p, 'clay', `M${314},${yT + 6} L${340},${yT + 66}`, 'fx12-thin')}${T(346, yT + 92, '³O₂ → ¹O₂', 'fx12-h fx12-c-clay', 'middle')}
    ${ar(p, 'orange', `M${340},${yT + 2} L${404},${yT + 24}`, 'fx12-thin')}${T(412, yT + 34, 'carotenoid', 'fx12-l fx12-c-orange')}${T(412, yT + 56, 'quenching', 'fx12-l fx12-c-orange')}
    ${ar(p, 'green', `M${xp1 - 10},${y1p + 6} L656,276`)}${lvl(640, 704, 290)}${T(712, 297, 'Pheo', 'fx12-l')}
    ${ar(p, 'green', 'M680,298 L716,352')}${lvl(700, 764, 366)}${T(772, 373, 'Q<tspan baseline-shift="sub" font-size="14">A</tspan>', 'fx12-l')}
    ${T(706, 232, 'photochemistry', 'fx12-h fx12-c-green', 'middle')}${badge(640, 140, 'open PSII: trapping ≈ 0.3 ns')}
    ${badge(640, 432, 'closed PSII: lifetime ≈ 2 ns')}
  `;
}

function drawC(): string {
  const p = 'fx12c';
  return svg(p, 'Jablonski diagram after E. Rosenqvist. Left, LHCII chlorophylls with ground state S0, first excited singlet state S1 and triplet state T1; right, P680 of PSII. The excitation in S1 moves between antenna and P680 by energy transfer. It can return to S0 as fluorescence or as heat (NPQ), or cross to the triplet T1, which makes singlet oxygen from oxygen unless a carotenoid quenches it. At P680 it drives photochemistry: an electron moves to pheophytin and then to QA. An open PSII traps the excitation in about 0.3 nanoseconds; with PSII closed the excitation lasts about 2 nanoseconds.', `
    ${jablonski(p)}
    ${credit(786, 592, 'after E. Rosenqvist; times: van Amerongen & Croce 2013, Belgio et al. 2012')}
  `);
}

/* ---------- excited-state decay: exp(−t/τ) with τ ≈ 0.3 ns (open PSII) and ≈ 2 ns (closed PSII, Fm) ---------- */

function decay(p: string, x0: number, y0: number, w: number, h: number, lx = 2.4): string {
  const tmax = 6, X = (t: number): number => x0 + (t / tmax) * w, Y = (v: number): number => y0 - v * h;
  const curve = (tau: number): string => Array.from({ length: 121 }, (_, i) => { const t = (i / 120) * tmax; return `${i ? 'L' : 'M'}${f(X(t))},${f(Y(Math.exp(-t / tau)))}`; }).join('');
  return `
    <path class="fx12-axis" d="M${x0},${f(Y(1.08))} V${y0} H${f(X(tmax) + 8)}"/>
    ${[0, 2, 4, 6].map(t => `<path class="fx12-axis" d="M${f(X(t))},${y0} v7"/>${T(X(t), y0 + 30, `${t}`, 'fx12-tk', 'middle')}`).join('')}
    ${[0, 0.5, 1].map(v => `<path class="fx12-axis" d="M${x0},${f(Y(v))} h-7"/>${T(x0 - 12, Y(v) + 6, `${v}`, 'fx12-tk', 'end')}`).join('')}
    ${T(X(tmax / 2), y0 + 60, 'time after absorption (ns)', 'fx12-ax', 'middle')}${TV(x0 - 52, Y(0.5), 'excitation remaining')}
    <path class="fx12-ar fx12-k-green" d="${curve(0.3)}"/><path class="fx12-ar fx12-k-red" d="${curve(2)}"/>
    <path class="fx12-guide" d="M${f(X(0.3))},${y0} V${f(Y(Math.exp(-1)))} H${x0} M${f(X(2))},${y0} V${f(Y(Math.exp(-1)))}"/>
    ${T(X(lx), Y(0.98), 'open PSII', 'fx12-h fx12-c-green')}${T(X(lx), Y(0.98) + 24, 'τ ≈ 0.3 ns', 'fx12-l fx12-c-green')}
    ${T(X(lx), Y(0.98) + 64, 'closed PSII', 'fx12-h fx12-c-red')}${T(X(lx), Y(0.98) + 88, 'τ ≈ 2 ns', 'fx12-l fx12-c-red')}
  `;
}

/* d · PSII crop + decay curves */
function drawD(): string {
  const p = 'fx12d', a = shot(`${p}-a`, NODE, 10, 10, 409, { fig: true, masks: NODE_MASK, win: NWIN });
  return svg(p, 'Left: Porcar-Castell and colleagues 2021, Figure 1, cropped to photosystem II, where the excitation leaves by photochemistry, heat (NPQ) or fluorescence. Right: the fraction of excitations remaining after absorption, falling as exp(−t/τ): with PSII open, τ is about 0.3 nanoseconds and the excitation is gone within 1 nanosecond; with PSII closed, τ is about 2 nanoseconds.', `
    ${a.svg}
    ${pill(a.at(...NP.let)[0] + 13, a.at(...NP.let)[1], 'photochemistry')}${pill(...a.at(...NP.fluo), 'fluorescence')}
    ${decay(p, 545, 470, 230, 330, 1.6)}
    ${credit(10, 574, CR_PC, 'start')}${credit(786, 594, 'exp(−t/τ); τ: van Amerongen & Croce 2013, Belgio et al. 2012')}
  `);
}

/* ---------- triplet chlorophyll → singlet oxygen, as a vertical chain ---------- */

function triplet(p: string, x: number, y: number, withBadge = true): string {
  return `
    ${withBadge ? badge(x, y - 8, 'closed PSII: ≈ 2 ns') : ''}
    ${T(x, y + 62, '¹Chl*', 'fx12-lv', 'middle')}
    ${ar(p, 'clay', `M${x},${y + 76} L${x},${y + 150}`, 'fx12-dash')}${T(x + 14, y + 108, 'intersystem', 'fx12-l')}${T(x + 14, y + 130, 'crossing', 'fx12-l')}
    ${T(x, y + 188, '³Chl*', 'fx12-lv', 'middle')}
    ${ar(p, 'clay', `M${x},${y + 202} L${x},${y + 276}`)}${T(x + 14, y + 246, '+ ³O₂', 'fx12-l')}
    ${T(x, y + 314, '¹O₂', 'fx12-lv fx12-c-clay', 'middle')}${T(x, y + 340, 'singlet oxygen', 'fx12-l', 'middle')}
    ${T(x, y + 394, 'e⁻ + O₂ → O₂<tspan baseline-shift="super" font-size="70%">•−</tspan>', 'fx12-h fx12-c-clay', 'middle')}${T(x, y + 418, 'superoxide', 'fx12-l', 'middle')}
    ${ar(p, 'orange', `M${x - 34},${y + 196} L${x - 92},${y + 256}`, 'fx12-thin')}${T(x - 96, y + 282, 'carotenoid', 'fx12-l fx12-c-orange', 'middle')}${T(x - 96, y + 304, 'quenching', 'fx12-l fx12-c-orange', 'middle')}
  `;
}

/* e · leaf crop + the triplet chain */
function drawE(): string {
  const p = 'fx12e', a = shot(`${p}-a`, LEAF, 10, 10, 460, { fig: true, masks: LEAF_MASK });
  return svg(p, 'Left: Porcar-Castell and colleagues 2021, Figure 1, cropped: leaf absorptance, the partitioning of absorbed light at PSII into photochemistry, heat (NPQ) and fluorescence, and the emission spectrum. Right: when PSII is closed the excitation lasts about 2 nanoseconds; the singlet excited chlorophyll can cross to the triplet state, which passes its energy to oxygen and makes singlet oxygen, unless a carotenoid quenches it.', `
    ${a.svg}
    ${pill(...a.at(...LP.band), 'absorbed light', undefined, false)}
    ${pill(a.at(...LP.let)[0] + 6, a.at(...LP.let)[1], 'photochemistry')}${pill(...a.at(650, 384), 'fluorescence')}
    ${triplet(p, 684, 60)}
    ${credit(786, 592, CR_PC)}
  `);
}

/* f · decay curves + the triplet chain, both drawn */
function drawF(): string {
  const p = 'fx12f';
  return svg(p, 'Left: the fraction of excitations remaining after absorption, exp(−t/τ): with PSII open τ is about 0.3 nanoseconds, with PSII closed about 2 nanoseconds. Right: from the long-lived singlet excited chlorophyll, intersystem crossing gives triplet chlorophyll, which makes singlet oxygen from oxygen unless a carotenoid quenches it.', `
    ${decay(p, 110, 460, 330, 360, 2.2)}
    ${triplet(p, 660, 60, false)}
    ${credit(786, 592, 'exp(−t/τ); τ: van Amerongen & Croce 2013, Belgio et al. 2012')}
  `);
}

/* ---------- Murchie & Niyogi 2011, Fig. 1A: absorbed light rises linearly, CO₂ assimilation saturates ---------- */

const MUR: Img = { href: murchieJpg, w: 531, h: 374 }; // panel A without its x-axis label, from the 531 × 961 figure
const MUR_MASK: Mask[] = [[0, 0, 24, 28], [524, 0, 531, 374], [380, 0, 531, 58], [305, 92, 404, 174], [425, 170, 482, 208], [292, 230, 434, 268], [118, 318, 531, 354]];
const CR_MUR = 'Murchie & Niyogi 2011, Plant Physiol, Fig. 1A · © ASPB';
function murchie(id: string, x: number, y: number, w: number): string {
  const a = shot(id, MUR, x, y, w, { fig: true, masks: MUR_MASK });
  const [lx, ly] = a.at(352, 30), [ex, ey] = a.at(312, 112), [cx, cy] = a.at(300, 240), [ax, ay] = a.at(240, 374);
  return `${a.svg}
    ${T(lx + 10, ly + 4, 'absorbed light', 'fx12-h')}
    ${T(ex, ey, 'excess', 'fx12-h fx12-c-amber')}${T(ex, ey + 24, 'excitation energy', 'fx12-l fx12-c-amber')}
    ${T(cx, cy, 'CO₂ assimilation', 'fx12-h fx12-c-green')}
    ${T(ax, ay + 26, 'light intensity', 'fx12-ax', 'middle')}`;
}

/** ¹Chl* → ³Chl* → ¹O₂ in one row, with carotenoid quenching below the triplet. */
function tripletRow(p: string, x: number, y: number): string {
  return `
    ${T(x, y, '¹Chl*', 'fx12-lv', 'middle')}
    ${ar(p, 'clay', `M${x + 38},${y - 8} L${x + 112},${y - 8}`, 'fx12-dash')}${T(x + 75, y - 32, 'intersystem crossing', 'fx12-l', 'middle')}
    ${T(x + 150, y, '³Chl*', 'fx12-lv', 'middle')}
    ${ar(p, 'clay', `M${x + 190},${y - 8} L${x + 262},${y - 8}`)}${T(x + 226, y - 24, '+ ³O₂', 'fx12-l', 'middle')}
    ${T(x + 296, y, '¹O₂', 'fx12-lv fx12-c-clay', 'middle')}${T(x + 296, y + 26, 'singlet oxygen', 'fx12-l', 'middle')}
    ${ar(p, 'orange', `M${x + 150},${y + 10} L${x + 150},${y + 48}`, 'fx12-thin')}${T(x + 150, y + 72, 'carotenoid quenching', 'fx12-l fx12-c-orange', 'middle')}
    ${T(x - 40, y + 112, 'e⁻ + O₂ → O₂<tspan baseline-shift="super" font-size="70%">•−</tspan> (superoxide)', 'fx12-l fx12-c-clay')}
  `;
}

/* g · Murchie Fig. 1A + the triplet chain */
function drawG(): string {
  const p = 'fx12g';
  return svg(p, 'Left: Murchie and Niyogi 2011, Figure 1A: as light intensity rises, the light absorbed by chlorophyll rises in a straight line, while CO2 assimilation levels off; the gap between them is excess excitation energy. Right: excess excitation lasts longer in chlorophyll; the singlet excited chlorophyll can cross to the triplet state, which passes its energy to oxygen and makes singlet oxygen, unless a carotenoid quenches it.', `
    ${murchie(`${p}-m`, 14, 70, 470)}
    ${triplet(p, 684, 60)}
    ${credit(14, 594, CR_MUR, 'start')}
  `);
}

/* h · Murchie Fig. 1A, the PSII crop of Porcar-Castell Fig. 1 and the triplet row */
function drawH(): string {
  const p = 'fx12h', a = shot(`${p}-a`, NODE, 450, 10, 340, { fig: true, masks: NODE_MASK, win: NWIN });
  return svg(p, 'Top left: Murchie and Niyogi 2011, Figure 1A: absorbed light rises in a straight line with light intensity while CO2 assimilation levels off; the gap is excess excitation energy. Right: Porcar-Castell and colleagues 2021, Figure 1, cropped to photosystem II: excitation leaves by photochemistry, heat (NPQ) or fluorescence. Bottom left: excess excitation in chlorophyll can cross to the triplet state, which makes singlet oxygen from oxygen unless a carotenoid quenches it.', `
    ${murchie(`${p}-m`, 14, 14, 400)}
    ${a.svg}
    ${pill(a.at(...NP.let)[0] + 6, a.at(...NP.let)[1], 'photochemistry')}${pill(...a.at(...NP.fluo), 'fluorescence')}
    ${tripletRow(p, 70, 440)}
    ${credit(14, 576, CR_MUR, 'start')}${credit(786, 594, CR_PC)}
  `);
}

const DRAW: Record<string, () => string> = { a: drawA, b: drawB, c: drawC, d: drawD, e: drawE, f: drawF, g: drawG, h: drawH };

export function draw(id: string): string {
  return (DRAW[id] ?? drawH)();
}

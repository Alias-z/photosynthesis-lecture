// Slide L12 · Four fates of an excitation. Draft context; see research/figure-briefs/LECTURE_OVERVIEW.md.
// Times used, and no others: absorption fs; Sₙ→S₁ heat < 1 ps; trapping by an open PSII in leaves ≈ 0.3 ns (van Amerongen
// & Croce 2013; Wientjes et al. 2013; < 100 ps only in isolated cores); S₁ lifetime ns;
// triplet µs and longer; fluorescence ≈ 685 nm. Triplet → ¹O₂ is the fourth fate (REVIEW_SUMMARY.md §4 #5).
// Variants a, c, e and f are the strongest earlier concepts, imported unchanged from ./s12.ts.
// One ink per exit throughout: photochemistry green, heat grey wave, fluorescence red wave, triplet clay, excitation amber.
import type { PlateText, Variant } from '../types';
import { draw as s12 } from './s12';
import { rcDot, text as t, wave } from '../mechanisms';
import { bilayer, bolt, molecule } from '../illus';
import './l12.css';

export const PLATE: PlateText = {
  n: '12',
  title: 'Four fates of an excitation',
  status: 'draft',
  lead: 'An excited chlorophyll keeps its energy for only nanoseconds and loses it by photochemistry, heat, fluorescence or triplet formation.',
  points: [
    { claim: 'The fates compete.', text: 'Their yields add up to 1, and the fastest wins<br>With reaction centres open, PSII uses 84–91 % (Fv/Fm ≈ 0.8, slide 14)' },
    { claim: 'Fluorescence reports the competition.', text: 'It rises when reaction centres close and falls when heat dissipation (non-photochemical quenching, NPQ) grows.' },
    { claim: 'Triplets are the risky fate.', text: 'Triplet chlorophyll passes energy to O₂, forming singlet oxygen; carotenoids catch triplets in the antenna, but not in the PSII reaction centre.' },
  ],
  play: 'fates',
  refs: [
    { label: 'van Amerongen & Croce 2013', url: 'https://doi.org/10.1007/s11120-013-9824-3' },
    { label: 'Murchie & Lawson 2013', url: 'https://doi.org/10.1093/jxb/ert208' },
    { label: 'Krieger-Liszkay 2005', url: 'https://doi.org/10.1093/jxb/erh237' },
    { label: 'Telfer 2014', url: 'https://doi.org/10.1093/pcp/pcu040' },
    { label: 'van Amerongen & Croce 2025', url: 'https://doi.org/10.1093/plcell/koaf240' },
  ],
};

export const VARIANTS: Variant[] = [
  { id: 'a', name: 'Levels + times' },
  { id: 'b', name: 'Energy × time' },
  { id: 'c', name: 'Race lanes' },
  { id: 'd', name: 'Time zoom' },
  { id: 'e', name: 'Tank', anim: true },
  { id: 'f', name: 'Open vs closed', anim: true },
  { id: 'g', name: 'Four steps', anim: true },
  { id: 'h', name: 'In the membrane', anim: true },
  { id: 'i', name: 'Kautsky curve', anim: true },
  { id: 'j', name: 'Light term' },
];

export function draw(id: string): string {
  switch (id) {
    case 'b': return energyTime();
    case 'c': return s12('e');
    case 'd': return timeZoom();
    case 'e': return s12('a');
    case 'f': return s12('d');
    case 'g': return fourSteps();
    case 'h': return membrane();
    case 'i': return kautsky();
    case 'j': return lightTerm();
    default: return s12('b');
  }
}

/* ---------- shared parts ---------- */

type K = 'ink' | 'green' | 'grey' | 'red' | 'blue' | 'clay' | 'amber';
const KS: K[] = ['ink', 'green', 'grey', 'red', 'blue', 'clay', 'amber'];
type Sc = 'fs' | 'ps' | 'ns' | 'us';
type Anchor = 'start' | 'middle' | 'end';

/** Arrowheads in each ink and the amber glow of excitation energy, prefixed per figure. */
const defs = (p: string, extra = ''): string =>
  `<defs><marker id="${p}-bolt" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="hd-bolt" d="M0,0L10,5L0,10z"/></marker>${KS.map(k => `<marker id="${p}-${k}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path class="fl12-hd-${k}" d="M0,0L10,5L0,10z"/></marker>`).join('')}
  <radialGradient id="${p}-glow"><stop offset="0" class="fl12-g0"/><stop offset=".45" class="fl12-g1"/><stop offset="1" class="fl12-g2"/></radialGradient>${extra}</defs>`;

const ar = (p: string, k: K, d: string, cls = ''): string =>
  `<path class="fl12-ar fl12-k-${k}${cls ? ` ${cls}` : ''}" d="${d}" marker-end="url(#${p}-${k})"/>`;

/** A wavy arrow: light in its colour, heat in grey. */
const wv = (p: string, k: K, x0: number, y0: number, x1: number, y1: number, amp = 6, n = 6): string =>
  `<path class="fl12-ar fl12-k-${k}" d="${wave(x0, y0, x1, y1, amp, n)}" marker-end="url(#${p}-${k})"/>`;

const lvl = (x0: number, x1: number, y: number, cls = 'fl12-lvl'): string => `<path class="${cls}" d="M${x0},${y} H${x1}"/>`;

/** A time pill; its colour deepens from fs to µs, and the text always says the time. */
function badge(x: number, y: number, s: string, sc: Sc, anchor: Anchor = 'middle'): string {
  const w = Math.round(s.length * 10.2 + 26), x0 = anchor === 'start' ? x : anchor === 'end' ? x - w : x - w / 2;
  return `<rect class="tb tb-${sc}" x="${x0}" y="${y - 15}" width="${w}" height="30" rx="15"/>${t(x0 + w / 2, y + 6.5, s, 'fl12-bt')}`;
}

const glow = (p: string, x: number, y: number, r = 20): string =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#${p}-glow)"/><circle class="fl12-exc" cx="${x}" cy="${y}" r="${Math.max(4, r * 0.3)}"/>`;

const num = (x: number, y: number, n: number): string =>
  `<circle class="fl12-num" cx="${x}" cy="${y}" r="14"/>${t(x, y + 6, `${n}`, 'fl12-nt')}`;

const rc = (x: number, y: number, w: number, h: number): string =>
  `<rect class="blob-ps" x="${x}" y="${y}" width="${w}" height="${h}" rx="${Math.min(26, h / 2)}"/>`;

/** Singlet oxygen in the clay danger box, drawn as an O₂ molecule. */
const o2box = (x: number, y: number, w = 96, h = 72): string =>
  `<rect class="ros" x="${x}" y="${y}" width="${w}" height="${h}" rx="14"/>${molecule(x + w / 2, y + 22, 'OO', 10)}${t(x + w / 2, y + h - 12, '¹O₂', 'fl12-h')}`;

/** A carotenoid: a polyene zigzag with a ring at each end. */
function carotenoid(x: number, y: number, len: number): string {
  const r = 8, hex = (cx: number): string =>
    `<path class="fl12-car-ring" d="${Array.from({ length: 6 }, (_, i) => `${i ? 'L' : 'M'}${(cx + r * Math.cos((Math.PI / 3) * i)).toFixed(1)},${(y + r * Math.sin((Math.PI / 3) * i)).toFixed(1)}`).join('')}Z"/>`;
  const a = x + r, b = x + len - r, n = Math.max(4, Math.round((b - a) / 9));
  const zz = Array.from({ length: n + 1 }, (_, i) => `${i ? 'L' : 'M'}${(a + ((b - a) * i) / n).toFixed(1)},${y + (i % 2 ? -5 : 5)}`).join('');
  return `<path class="fl12-car" d="${zz}"/>${hex(x)}${hex(x + len)}`;
}

const svg = (label: string, body: string): string =>
  `<svg class="fig-svg fl12" viewBox="0 0 800 600" role="img" aria-label="${label}">${body}</svg>`;

/** A horizontal fade for a level that empties over time. */
const fade = (id: string, x0: number, x1: number, a: string, b: string, from = 0.5): string =>
  `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${x0}" y1="0" x2="${x1}" y2="0"><stop offset="0" class="${a}"/><stop offset="${from}" class="${a}"/><stop offset="1" class="${b}"/></linearGradient>`;

/* ---------- B · the energy levels drawn on a log-time axis ---------- */

function energyTime(): string {
  const p = 'fl12b';
  const X = (e: number): number => 120 + (e + 15) * 55;
  const S2 = 118, S1 = 250, T1 = 380, S0 = 488, ay = 534;
  const named: Record<number, string> = { [-15]: 'fs', [-12]: 'ps', [-9]: 'ns', [-6]: 'µs', [-3]: 'ms' };
  let axis = `<path class="fl12-axis" d="M${X(-15)},${ay} H${X(-3)}"/>`;
  for (let e = -15; e <= -3; e++) {
    const w = named[e] ? 9 : 4;
    axis += `<path class="fl12-axis" d="M${X(e)},${ay - w} V${ay + w}"/>`;
    if (named[e]) axis += t(X(e), ay + 30, named[e], 'fl12-ax');
  }
  const xs = X(-10.6), xe = X(-8.2), xt = X(-8.6);
  return svg('Energy levels of chlorophyll drawn against logarithmic time: absorption in femtoseconds, blue’s extra energy lost as heat in under a picosecond, charge separation in under 100 picoseconds, the remaining excited state lasting nanoseconds, and a triplet that lasts microseconds and longer and makes singlet oxygen', `
    ${defs(p, fade(`${p}-s1`, xs, xe, 'fl12-s0', 'fl12-s1') + fade(`${p}-t1`, xt, X(-3), 'fl12-c0', 'fl12-c1', 0.6))}<g transform="translate(0 -14)">
    ${ar(p, 'ink', 'M40,510 L40,70', 'fl12-axis')}<text class="fl12-ax" transform="translate(28 300) rotate(-90)" text-anchor="middle">energy</text>
    ${t(104, S2 + 9, 'Sₙ', 'fl12-lv', 'end')}${t(104, S1 + 9, 'S₁', 'fl12-lv', 'end')}${t(104, S0 + 9, 'S₀', 'fl12-lv', 'end')}
    ${lvl(X(-15), X(-3), S0)}${lvl(X(-15), X(-12.3), S2)}
    ${lvl(X(-14.6), xs, S1, 'fl12-lvl-thick')}<path class="fl12-lvl-fade" stroke="url(#${p}-s1)" d="M${xs},${S1} H${xe}"/>
    <path class="fl12-lvl-fade" stroke="url(#${p}-t1)" d="M${xt},${T1} H${X(-3)}"/>

    ${ar(p, 'blue', `M${X(-14.8)},${S0 - 2} L${X(-14.8)},${S2 + 4}`)}${ar(p, 'red', `M${X(-14.4)},${S0 - 2} L${X(-14.4)},${S1 + 6}`)}
    ${t(X(-14.8) - 8, 200, 'blue', 'fl12-l fl12-c-blue', 'end')}${t(X(-14.4) + 8, 400, 'red', 'fl12-l fl12-c-red', 'start')}
    ${badge(X(-14.6), 84, 'absorb: fs', 'fs')}

    ${wv(p, 'grey', X(-12.6), S2 + 6, X(-12.6), S1 - 6, 6, 5)}
    ${t(X(-12.6) + 16, 170, 'heat', 'fl12-h', 'start')}${badge(X(-12.6) + 16, 202, '< 1 ps', 'ps', 'start')}

    ${ar(p, 'green', `M${xs},${S1 - 6} L${xs},108`)}
    ${rc(290, 34, 214, 72)}${rcDot(320, 70)}${t(414, 64, 'charge', 'fl12-h')}${t(414, 90, 'separation', 'fl12-h')}
    ${t(xs + 14, 148, 'photochemistry', 'fl12-h fl12-c-green', 'start')}${badge(xs + 14, 180, '~300 ps', 'ps', 'start')}
    ${badge(290, S1 + 44, 'S₁ lasts ns', 'ns')}

    ${wv(p, 'grey', X(-9.5), S1 + 8, X(-9.5), S0 - 6, 6, 8)}${wv(p, 'red', X(-9.05), S1 + 8, X(-9.05), S0 - 6, 6, 8)}
    ${ar(p, 'clay', `M${X(-8.85)},${S1 + 6} L${xt + 6},${T1 - 6}`, 'fl12-dash')}
    ${t(X(-9.5) - 10, S0 + 30, 'heat (NPQ)', 'fl12-l', 'end')}${t(X(-9.05) + 10, S0 + 30, 'fluorescence ≈ 685 nm', 'fl12-l fl12-c-red', 'start')}
    ${t(xt + 18, 316, 'spin flip', 'fl12-l fl12-c-clay', 'start')}
    ${t(xt + 30, T1 - 12, 'T₁ triplet', 'fl12-lv', 'start')}${badge(640, T1 + 32, 'lasts µs and longer', 'us')}
    ${ar(p, 'clay', `M738,${T1 - 4} L738,${T1 - 26}`)}${t(696, T1 - 8, '+', 'fl12-s', 'end')}${molecule(714, T1 - 14, 'OO', 8)}${o2box(690, T1 - 100, 96, 72)}
    ${t(790, 192, 'carotenoids (antenna)', 'fl12-l fl12-c-orange', 'end')}${carotenoid(706, 222, 78)}

    ${axis}${t(X(-9), 590, 'time after absorption (log scale)', 'fl12-ax')}
  </g>`);
}

/* ---------- D · zoom in time: each row lasts 1000 times longer than the one above ---------- */

function timeZoom(): string {
  const p = 'fl12d', x0 = 172, x1 = 768, W = x1 - x0;
  const ys = [118, 258, 398, 538];
  const bar = (a: number, b: number, yc: number, cls: string, label = '', head = false): string =>
    `<rect class="${cls}" x="${a}" y="${yc - 11}" width="${Math.max(6, b - a)}" height="22" rx="11"/>`
    + (head ? `<path class="${cls}" d="M${b - 2},${yc - 15} L${b + 16},${yc} L${b - 2},${yc + 15}Z"/>` : '')
    + (label ? t(a + 12, yc + 6, label, 'fl12-in', 'start') : '');
  const ruler = (y: number, end: string, mid?: [number, string]): string =>
    `<path class="fl12-axis" d="M${x0},${y} H${x1} M${x0},${y - 7} V${y + 7} M${x1},${y - 7} V${y + 7}${mid ? ` M${x0 + mid[0]},${y - 6} V${y + 6}` : ''}"/>`
    + t(x0, y + 26, '0', 'fl12-ax') + t(x1, y + 26, end, 'fl12-ax') + (mid ? t(x0 + mid[0], y + 26, mid[1], 'fl12-ax') : '');
  const name = (y: number, s: string): string => `${t(24, y - 34, 'first', 'fl12-s', 'start')}${t(24, y - 8, s, 'fl12-h', 'start')}`;
  const wedge = (ya: number, yb: number): string =>
    `<path class="fl12-wedge" d="M${x0},${ya + 8} L${x1},${ya + 8} L${x0 + 4},${yb - 62} L${x0},${yb - 62}Z"/>`;
  const [r1, r2, r3, r4] = ys, A = -44, B = -18;
  return svg('Zooming out in time, each row a thousand times longer than the one above: in the first picosecond the photon is absorbed and blue’s extra energy becomes heat; within the first nanosecond an open reaction centre separates charge in under 100 picoseconds; within the first microsecond any unused excitation leaves in nanoseconds, some as a triplet; the triplet lasts microseconds and longer and can make singlet oxygen', `
    ${defs(p, `<linearGradient id="${p}-tr" gradientUnits="userSpaceOnUse" x1="${x0}" y1="0" x2="${x1}" y2="0"><stop offset="0" stop-color="#f6cdb9"/><stop offset=".55" stop-color="#f6cdb9"/><stop offset="1" stop-color="#f6cdb9" stop-opacity=".1"/></linearGradient>`)}<g transform="translate(0 8)">
    ${wedge(r1, r2)}${wedge(r2, r3)}${wedge(r3, r4)}
    ${t(x1, r1 + 58, 'each row × 1000 longer', 'fl12-it', 'end')}

    ${name(r1, 'picosecond')}${ruler(r1, '1 ps', [W * 0.55, '< 1 ps'])}
    ${bolt(p, x0 - 26, r1 - 98, x0 + 2, r1 + A - 14)}${t(x0 + 14, r1 - 76, 'photon absorbed: fs', 'fl12-s', 'start')}
    ${bar(x0 + 4, x0 + W * 0.55, r1 + A, 'fl12-bar-blue', 'blue: extra energy → heat')}${bar(x0 + W * 0.55, x1, r1 + A, 'fl12-bar-amber', 'S₁', true)}
    ${bar(x0 + 4, x1, r1 + B, 'fl12-bar-amber', 'red: straight to S₁', true)}

    ${name(r2, 'nanosecond')}${ruler(r2, '1 ns', [W * 0.3, '300 ps'])}
    ${bar(x0 + 4, x0 + W * 0.3, r2 + A, 'fl12-bar-green')}${t(x0 + W * 0.3 + 14, r2 + A + 7, 'open reaction centre: charge separation', 'fl12-l fl12-c-green', 'start')}
    ${bar(x0 + 4, x1, r2 + B, 'fl12-bar-amber', 'otherwise S₁ stays excited', true)}

    ${name(r3, 'microsecond')}${ruler(r3, '1 µs')}
    ${bar(x0 + 4, x0 + 10, r3 + A, 'fl12-bar-amber')}${t(x0 + 22, r3 + A + 7, 'S₁ decays: heat, fluorescence, spin flip', 'fl12-l', 'start')}
    ${bar(x0 + 8, x1, r3 + B, 'fl12-bar-clay', 'triplet ³Chl lives on', true)}

    ${name(r4, 'millisecond')}${ruler(r4, '1 ms')}
    <rect x="${x0 + 4}" y="${r4 + B - 11}" width="${W - 4}" height="22" rx="11" fill="url(#${p}-tr)" class="fl12-bar-fade"/>${t(x0 + 16, r4 + B + 6, 'triplet lasts µs and longer', 'fl12-in', 'start')}
    ${t(x0 + 16, r4 + A + 7, '³Chl + O₂ → ¹O₂', 'fl12-l fl12-c-clay', 'start')}
    ${carotenoid(472, r4 + A + 1, 56)}${t(540, r4 + A + 7, 'carotenoids (antenna)', 'fl12-s fl12-c-orange', 'start')}
  </g>`);
}

/* ---------- G · one photon in four numbered steps ---------- */

function fourSteps(): string {
  const p = 'fl12g';
  const card = (x0: number, y0: number, n: number, title: string, b: string, sc: Sc, body: string): string =>
    `<rect class="fl12-card" x="${x0}" y="${y0}" width="372" height="280" rx="16"/>${num(x0 + 30, y0 + 34, n)}
     ${t(x0 + 52, y0 + 42, title, 'fl12-h', 'start')}${badge(x0 + 356, y0 + 76, b, sc, 'end')}${body}`;
  /** Mini energy levels, centred in a card. */
  const mini = (x0: number, y0: number): string =>
    `${lvl(x0 + 86, x0 + 300, y0 + 118)}${t(x0 + 76, y0 + 125, 'Sₙ', 'fl12-h', 'end')}${lvl(x0 + 86, x0 + 300, y0 + 178)}${t(x0 + 76, y0 + 185, 'S₁', 'fl12-h', 'end')}
     ${lvl(x0 + 86, x0 + 300, y0 + 252)}${t(x0 + 76, y0 + 259, 'S₀', 'fl12-h', 'end')}`;
  const c1 = card(14, 14, 1, 'A photon is absorbed', 'fs', 'fs', `
    ${mini(14, 14)}
    ${ar(p, 'blue', 'M160,264 L160,136')}${ar(p, 'red', 'M244,264 L244,196')}
    ${t(150, 238, 'blue', 'fl12-l fl12-c-blue', 'end')}${t(254, 238, 'red', 'fl12-l fl12-c-red', 'start')}`);
  const c2 = card(414, 14, 2, 'Extra energy → heat', '< 1 ps', 'ps', `
    ${mini(414, 14)}
    ${ar(p, 'blue', 'M540,264 L540,136', 'fl12-faint')}${wv(p, 'grey', 566, 138, 566, 186, 5, 4)}
    ${ar(p, 'red', 'M644,264 L644,196', 'fl12-faint')}${glow(p, 606, 192, 16)}`);
  const c3 = card(14, 306, 3, 'Open reaction centre wins', '~300 ps', 'ps', `
    ${lvl(54, 124, 466)}${t(90, 496, 'S₁', 'fl12-h')}${glow(p, 90, 462, 18)}
    ${ar(p, 'green', 'M122,462 L176,462')}
    ${rc(182, 420, 184, 84)}${rcDot(210, 462)}${t(296, 456, 'charge', 'fl12-h')}${t(296, 482, 'separation', 'fl12-h')}
    ${t(200, 552, 'photochemistry', 'fl12-h fl12-c-green')}`);
  const c4 = card(414, 306, 4, 'Otherwise: slower exits', 'ns', 'ns', `
    ${lvl(462, 522, 470)}${t(492, 500, 'S₁', 'fl12-h')}${glow(p, 492, 466, 18)}
    ${wv(p, 'grey', 514, 448, 590, 406, 5, 4)}${t(600, 414, 'heat (NPQ)', 'fl12-l', 'start')}
    ${wv(p, 'red', 516, 466, 590, 466, 5, 5)}${t(600, 473, 'fluorescence', 'fl12-l fl12-c-red', 'start')}
    ${ar(p, 'clay', 'M514,484 L586,526', 'fl12-dash')}${t(600, 532, 'triplet → ¹O₂', 'fl12-l fl12-c-clay', 'start')}
    ${t(600, 558, 'lasts µs and longer', 'fl12-s', 'start')}`);
  return svg('One photon in four steps: absorbed in femtoseconds; blue’s extra energy lost as heat in under a picosecond, so blue and red both end on S₁; an open reaction centre separates charge in under 100 picoseconds; otherwise heat, fluorescence or a triplet within nanoseconds', `${defs(p)}${c1}${c2}${c3}${c4}`);
}

/* ---------- H · where each fate happens in the membrane (thesis style) ---------- */

function membrane(): string {
  const p = 'fl12h', mt = 300, mb = 380;
  const pigs = (cx: number, cy: number): string =>
    [[-40, -28], [0, -40], [40, -26], [-46, 14], [-8, 4], [34, 18], [-20, 44], [22, 50]]
      .map(([dx, dy]) => `<circle class="fl12-pig" cx="${cx + dx}" cy="${cy + dy}" r="7"/>`).join('');
  return svg('A light-harvesting antenna and photosystem II in the thylakoid membrane: light is absorbed in the antenna; the excitation hops to the reaction centre for charge separation, or leaves as heat (mostly in the antenna), as red fluorescence, or as a triplet that turns O2 into singlet oxygen', `
    ${defs(p)}
    <rect class="fl12-lumen" x="0" y="${mb}" width="800" height="${600 - mb}"/>
    ${bilayer(p, 0, 800, mt, mb)}
    <rect class="fl12-lhc" x="36" y="268" width="160" height="148" rx="52"/>${pigs(116, 340)}
    <rect class="fl12-lhc" x="206" y="268" width="160" height="148" rx="52"/>${pigs(286, 340)}
    ${rc(386, 252, 176, 180)}${rcDot(474, 340)}
    ${t(200, 458, 'antenna (LHCII)', 'fl12-l')}${t(474, 290, 'PSII', 'fl12-h')}

    ${bolt(p, 236, 150, 258, 268)}${t(250, 146, 'light', 'fl12-it', 'start')}
    ${glow(p, 270, 316, 16)}<path class="fl12-hop" d="M286,320 C330,300 380,356 446,342" marker-end="url(#${p}-amber)"/>

    ${ar(p, 'ink', 'M492,340 L640,340')}${t(604, 330, 'e⁻', 'fl12-e')}
    ${t(580, 212, 'photochemistry', 'fl12-h fl12-c-green', 'start')}${badge(580, 246, '~300 ps', 'ps', 'start')}${t(652, 347, 'to PQ', 'fl12-s', 'start')}

    ${wv(p, 'grey', 84, 262, 70, 190, 5, 5)}${wv(p, 'grey', 126, 262, 138, 190, 5, 5)}
    ${t(40, 112, 'heat (NPQ)', 'fl12-h', 'start')}${t(40, 138, 'mostly in LHCII', 'fl12-s', 'start')}${badge(160, 172, 'ns', 'ns')}
    ${wv(p, 'red', 340, 262, 382, 196, 5, 6)}
    ${t(390, 116, 'fluorescence', 'fl12-h fl12-c-red')}${t(390, 142, '≈ 685 nm', 'fl12-s')}${badge(390, 172, 'ns', 'ns')}

    ${ar(p, 'clay', 'M474,434 L474,480', 'fl12-dash')}
    <rect class="ros" x="384" y="486" width="180" height="56" rx="14"/>${t(474, 520, '³Chl + O₂ → ¹O₂', 'fl12-h fl12-c-clay')}
    ${badge(474, 566, 'µs and longer', 'us')}
    ${carotenoid(600, 498, 70)}${t(600, 532, 'carotenoids (antenna)', 'fl12-s fl12-c-orange', 'start')}
    ${t(780, 60, 'stroma', 'fl12-it', 'end')}${t(24, 576, 'lumen', 'fl12-it', 'start')}
  `);
}

/* ---------- I · evidence: Kautsky's transient, same light in, changing fluorescence out ---------- */

function kautsky(): string {
  const p = 'fl12i';
  return svg('Schematic of the Kautsky effect: after a leaf is moved from dark into constant light, its fluorescence first rises as reaction centres close, then slowly falls as reaction centres reopen and heat loss (NPQ) grows', `
    ${defs(p)}<g transform="translate(-24 -8)">
    ${t(110, 67, 'light', 'fl12-l', 'end')}
    <rect class="fl12-dark" x="120" y="50" width="52" height="24" rx="4"/>${t(146, 67, 'dark', 'fl12-wt')}
    <rect class="fl12-on" x="172" y="50" width="598" height="24" rx="4"/>${t(186, 68, 'on, then constant', 'fl12-in', 'start')}
    <path class="fl12-mark" d="M172,80 V496"/>
    ${ar(p, 'ink', 'M120,496 L120,104', 'fl12-axis')}${ar(p, 'ink', 'M120,496 L784,496', 'fl12-axis')}
    <text class="fl12-l" transform="translate(92 300) rotate(-90)" text-anchor="middle">fluorescence</text>
    ${t(452, 532, 'time in constant light (schematic)', 'fl12-l')}
    <path class="fl12-curve" d="M122,494 H172 V410 C190,320 214,176 252,170 C298,164 328,292 422,334 C522,380 642,388 770,388"/>
    ${num(304, 136, 1)}${t(328, 143, 'rise: reaction centres close', 'fl12-l', 'start')}
    ${num(372, 412, 2)}${t(396, 419, 'slow fall: heat (NPQ) grows,', 'fl12-l', 'start')}${t(396, 446, 'reaction centres reopen', 'fl12-l', 'start')}
    ${t(784, 566, 'after Kautsky & Hirsch 1931', 'fl12-s', 'end')}
  </g>`);
}

/* ---------- J · equation-anchored: where the "light" term goes ---------- */

function lightTerm(): string {
  const p = 'fl12j', ny = 214, dy = 368;
  const brs: { w: number; to: number; k: 'green' | 'grey' | 'red' | 'clay' }[] = [
    { w: 36, to: 130, k: 'green' }, { w: 16, to: 320, k: 'grey' }, { w: 6, to: 530, k: 'red' }, { w: 3, to: 700, k: 'clay' },
  ];
  let x = 400 - 61 / 2, branches = '';
  for (const b of brs) {
    const cx = x + b.w / 2; x += b.w;
    const hw = b.w / 2 + 9;
    branches += `<path class="fl12-br fl12-br-${b.k}" style="stroke-width:${b.w}px" d="M${cx},${ny} C${cx},${ny + 90} ${b.to},${dy - 80} ${b.to},${dy}"/>`
      + `<path class="fl12-f-${b.k}" d="M${b.to - hw},${dy} L${b.to + hw},${dy} L${b.to},${dy + 22}Z"/>`;
  }
  const dest = (x0: number, title: string, cls: string, sub: string, b: string, sc: Sc): string =>
    `${t(x0, dy + 56, title, `fl12-h ${cls}`)}${t(x0, dy + 82, sub, 'fl12-s')}${badge(x0, dy + 116, b, sc)}`;
  return svg('The light written over the arrow of the photosynthesis equation splits into four exits: most goes to photochemistry, the only route to sugar and O₂; some to heat (NPQ); a little to fluorescence; and a trace to triplets that make singlet oxygen. Branch widths are qualitative', `
    ${defs(p)}<g transform="translate(0 -6)">
    <rect class="fl12-trunk" x="${400 - 61 / 2}" y="62" width="61" height="${ny - 62}"/>
    <rect class="fl12-pill" x="356" y="24" width="88" height="38" rx="14"/>${t(400, 51, 'light', 'fl12-h fl12-c-amber')}
    ${t(340, 94, '6 CO₂ + 12 H₂O', 'fl12-eq', 'end')}
    <path class="fl12-eq-ar" d="M350,86 H440"/><path class="fl12-eq-hd" d="M452,86 L436,79 L436,93Z"/>
    ${t(462, 94, 'C₆H₁₂O₆ + 6 O₂ + 6 H₂O', 'fl12-eq', 'start')}
    ${branches}
    ${glow(p, 400, 196, 26)}${t(446, 150, 'excited', 'fl12-s', 'start')}${t(446, 172, 'chlorophyll (S₁)', 'fl12-s', 'start')}
    ${dest(130, 'photochemistry', 'fl12-c-green', 'charge separation', '~300 ps', 'ps')}
    ${dest(320, 'heat (NPQ)', '', 'adjustable', 'ns', 'ns')}
    ${dest(530, 'fluorescence', 'fl12-c-red', '≈ 685 nm', 'ns', 'ns')}
    ${dest(700, 'triplet → ¹O₂', 'fl12-c-clay', '³Chl + O₂', 'µs and longer', 'us')}
    ${ar(p, 'green', 'M56,400 C30,300 40,140 150,100', 'fl12-dots')}${t(58, 236, 'the only route', 'fl12-s fl12-c-green', 'start')}${t(58, 258, 'to sugar and O₂', 'fl12-s fl12-c-green', 'start')}
    ${t(400, 572, 'branch width: share with reaction centres open (qualitative)', 'fl12-s')}
  </g>`);
}

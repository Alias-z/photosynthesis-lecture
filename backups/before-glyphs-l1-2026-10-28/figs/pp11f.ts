// Slide 11 · Excess light: figures of chunk pp (28 Oct 2026). The lecturer's picks a and b (Jablonski diagrams of
// ./l12.ts) come first and are drawn by l12; then the new variants v1–v10; then the older unpicked l12 figures.
// New variants by approach: whole chain with photosystem II lit (v1, v2); data redrawn from a paper (v5, v6: yields of
// photochemistry, regulated heat and the rest against light, Quercus pyrenaica, Rodríguez-Calcerrada et al. 2008, values
// read off the figure as shown by E. Rosenqvist 2018, slide 56); restyled paper figures (v4: Murchie & Niyogi 2011 Fig. 1A;
// v9: Porcar-Castell et al. 2021 Fig. 1); drawings (v3 energy balance, v7 levels without times, v8 low light vs full sun);
// combination (v10: Murchie & Niyogi's graph with the routes of the excess drawn beside it).
import type { PlateText, Variant } from '../types';
import { draw as l12, VARIANTS as L12 } from './l12';
import type { FocusView, Part } from './chain';
import { PLATE as TEXT } from './pp11';
import murchieJpg from '../../assets/photos/12-murchie-1a.jpg';
import nodePng from '../../assets/photos/12-pc-node.png';
import {
  ar, axes, callout, leader, chainCrop, chainMap, chainWhole, credit, defs, f, frame, glow, mark, PS2, pill, shot, smooth, sub, svg, T,
  TV, wv, type Img, type Pt,
} from './pp-kit';

export const PLATE: PlateText = { ...TEXT, play: 'pp11' };

const PICKS = ['a', 'b'];
export const VARIANTS: Variant[] = [
  ...L12.filter(v => PICKS.includes(v.id)),
  { id: 'v1', name: 'Chain: excess light at photosystem II and its three exits' },
  { id: 'v2', name: 'Chain close-up on photosystem II: the three exits, with a map of the chain' },
  { id: 'v3', name: 'Energy balance: absorbed light vs CO₂ fixation (drawn)' },
  { id: 'v4', name: 'Murchie & Niyogi 2011, Fig. 1A (restyled)' },
  { id: 'v5', name: 'Yields vs light, oak leaves (data, Rodríguez-Calcerrada 2008)' },
  { id: 'v6', name: 'Shares of absorbed light add up to 1 (stacked data)' },
  { id: 'v7', name: 'Energy levels and the exits, without times (lighter pick a)' },
  { id: 'v8', name: 'Weak vs strong light: the exits as arrows of measured width' },
  { id: 'v9', name: 'Porcar-Castell 2021, Fig. 1: partitioning at the photosystems (restyled)' },
  { id: 'v10', name: 'Murchie & Niyogi graph + where the excess goes' },
  ...L12.filter(v => !PICKS.includes(v.id)),
];

export function draw(id: string): string {
  switch (id) {
    case 'v1': return chainV1();
    case 'v2': return chainV2();
    case 'v3': return balanceV3();
    case 'v4': return murchieV4();
    case 'v5': return yieldsV5();
    case 'v6': return stackV6();
    case 'v7': return levelsV7();
    case 'v8': return lowHighV8();
    case 'v9': return nodeV9();
    case 'v10': return murchieV10();
    default: return l12(id);
  }
}

/* ---------- data: Rodríguez-Calcerrada et al. 2008, Quercus pyrenaica grown in high light ---------- */
// Read off the figure (lower left panel) as reproduced by Rosenqvist 2018, slide 56; the sums are 0.99–1.02.
const PPF = [0, 40, 100, 250, 410, 715, 1065, 1420];
const Y_PSII = [0.87, 0.79, 0.73, 0.63, 0.52, 0.40, 0.29, 0.22];
const Y_NPQ = [0.00, 0.06, 0.12, 0.18, 0.28, 0.40, 0.50, 0.57];
const Y_NO = [0.15, 0.17, 0.17, 0.18, 0.21, 0.22, 0.22, 0.22];
const CR_RC = `data: Rodríguez-Calcerrada et al. 2008, Tree Physiol., <tspan class="pp-i">Quercus pyrenaica</tspan> grown in high light; read off the figure`;

/* ---------- v1 · the whole chain, photosystem II ringed, a zoom circle with its three exits ---------- */

const LIT11: Part[] = ['psii', 'light-psii', 'e-psii-pq', 'pq'];

function chainV1(): string {
  const p = 'pp11v1';
  const c: Pt = [276, 128], r = 122, win: Pt = [125, 292], z = 1;
  const Z = (q: Pt): Pt => [c[0] + z * (q[0] - win[0]), c[1] + z * (q[1] - win[1])];
  const v: FocusView = {
    look: 'bil', lit: LIT11, labels: [],
    inset: { k: 0.78, at: [88, 170], ring: [112, 318, 112], c, r, win, z },
    say: 'The chain is drawn smaller; a circle above enlarges photosystem II under excess light, with its three exits: electrons to plastoquinone (photochemistry), heat and red fluorescence.',
  };
  const tl = Z([PS2.x0 + 20, PS2.top]), tr = Z([PS2.x1 - 18, PS2.top + 2]), pq = Z([236, 292]);
  return chainWhole(p, v, `${defs(`${p}x`)}
    ${wv(`${p}x`, 'amber', Z([96, 196])[0], Z([96, 196])[1], Z([98, 256])[0], Z([98, 256])[1], 6, 3)}
    ${wv(`${p}x`, 'amber', Z([126, 190])[0], Z([126, 190])[1], Z([124, 256])[0], Z([124, 256])[1], 6, 3)}
    ${T(c[0] + r + 14, 30, 'excess light', 'pp-hb pp-c-amber', 'start')}${leader([c[0] + r + 10, 36], Z([118, 214]))}
    ${wv(`${p}x`, 'grey', tl[0] - 4, tl[1] - 4, 80, 40, 7, 4)}${wv(`${p}x`, 'grey', tl[0] + 18, tl[1] - 8, 112, 22, 7, 4)}
    ${T(30, 40, 'heat', 'pp-hb pp-c-grey', 'start')}
    ${wv(`${p}x`, 'red', tr[0] - 6, tr[1] - 6, 520, 96, 7, 5)}${T(528, 104, 'fluorescence', 'pp-hb pp-c-red', 'start')}
    ${callout(c[0] + r + 30, 176, 'photochemistry', [pq[0] - 6, pq[1] + 6], 'start', 'pp-hb pp-c-green', [c[0] + r + 26, 168])}`);
}

/* ---------- v2 · close-up on photosystem II (glow look), map of the chain below ---------- */

function chainV2(): string {
  const p = 'pp11v2';
  const v: FocusView = { look: 'glow', lit: LIT11, say: 'Close-up of photosystem II.' };
  const win: [number, number, number] = [0, 150, 380], H = 490;
  const c = chainCrop(`${p}c`, v, win, [0, 0, 800, H]);
  const M = c.M, top = M([0, PS2.top])[1];
  const pq = M([236, 292]), bot = M([112, PS2.bot])[1];
  return svg('Close-up of photosystem II in the thylakoid membrane, its protein structure glowing: excess light arrives from above; the absorbed energy leaves photosystem II three ways: electrons to plastoquinone (photochemistry), heat, and red fluorescence. Below, a small map of the whole chain marks the close-up.', `
    ${defs(p)}${c.svg}
    ${wv(p, 'amber', 214, 14, 210, top - 10, 9, 4)}${wv(p, 'amber', 262, 22, 262, top - 10, 9, 4)}
    ${T(286, 46, 'excess light', 'pp-hb pp-c-amber pp-halo', 'start')}
    ${wv(p, 'grey', 70, top - 4, 24, 96, 8, 3.5)}${wv(p, 'grey', 100, top - 6, 70, 92, 8, 3.5)}${T(22, 74, 'heat', 'pp-hb pp-c-grey pp-halo', 'start')}
    ${wv(p, 'red', 410, top - 2, 520, 120, 8, 4.5)}${T(528, 112, 'fluorescence', 'pp-hb pp-c-red pp-halo', 'start')}
    ${callout(600, 214, 'photochemistry', [pq[0] + 2, pq[1] - 14], 'start', 'pp-hb pp-c-green', [604, 220])}
    ${T(786, 34, 'stroma', 'pp-lb pp-c-grey pp-halo', 'end')}${T(786, H - 18, 'lumen', 'pp-lb pp-c-grey pp-halo', 'end')}
    ${chainMap(`${p}m`, { look: 'glow', lit: LIT11, say: '' }, [16, 506], 0.2, [100, 470], [win[0], win[1], win[2], H / c.z])}
    ${callout(214, 548, 'photosystem II', [236, bot - 24], 'start', 'pp-hb', [226, 532])}
    ${credit(786, 590, 'structures: PDB 5XNL, 6RQF, 5L8R, 6FKF')}`);
}

/* ---------- v3 · energy balance, drawn (after Murchie & Niyogi 2011, Fig. 1A) ---------- */

function balanceV3(): string {
  const p = 'pp11v3';
  const a = axes(120, 470, 740, 70, [0, 2000], [0, 1]);
  const absorbed = (q: number): number => q / 2000 * 0.92;
  // CO₂ fixation: a non-rectangular hyperbola whose initial slope is 0.85 of the absorbed line, saturating at 0.30
  const used = (q: number): number => {
    const fq = 0.85 * absorbed(q), A = 0.3, th = 0.9;
    return (fq + A - Math.sqrt((fq + A) ** 2 - 4 * th * fq * A)) / (2 * th);
  };
  const qs = Array.from({ length: 41 }, (_, i) => i * 50);
  const top: Pt[] = qs.map(q => [a.X(q), a.Y(absorbed(q))]), low: Pt[] = qs.map(q => [a.X(q), a.Y(used(q))]);
  const area = `M${top.map(([x, y]) => `${f(x)},${f(y)}`).join('L')}L${[...low].reverse().map(([x, y]) => `${f(x)},${f(y)}`).join('L')}Z`;
  return svg('Drawn energy balance of a leaf: absorbed light rises in a straight line with light intensity, CO₂ fixation rises and then saturates; the widening gap between them is the excess energy. Full sunlight is marked at the right.', `
    ${defs(p)}
    <path class="pp-area-excess" d="${area}"/>
    <path class="pp-line" stroke="#e0a21a" d="${smooth(top)}"/><path class="pp-line" stroke="#2a963a" d="${smooth(low)}"/>
    <path class="pp-axis" d="M${a.x0},${a.y1 - 6}V${a.y0}H${a.x1 + 8}"/>
    ${ar(p, 'ink', `M${a.x0},${a.y0} H${a.x1 + 30}`, 'pp-thin')}${ar(p, 'ink', `M${a.x0},${a.y0} V${a.y1 - 30}`, 'pp-thin')}
    ${T((a.x0 + a.x1) / 2, a.y0 + 48, 'light intensity', 'pp-ax')}${TV(a.x0 - 34, (a.y0 + a.y1) / 2, 'energy per second')}
    ${T(a.X(1450), a.Y(absorbed(1450)) - 26, 'absorbed light', 'pp-hb pp-c-amber', 'end')}
    ${T(a.X(1500), a.Y(used(1500)) + 46, 'used: CO₂ fixation', 'pp-hb pp-c-green', 'middle')}
    ${T(a.X(1620), a.Y(0.5), 'excess', 'pp-big pp-c-clay', 'middle')}
    <path class="pp-guide" d="M${a.X(2000)},${a.y0} V${a.Y(absorbed(2000)) - 10}"/>${T(a.X(2000), a.y0 + 48, 'full sun', 'pp-lb', 'end')}
    ${credit(786, 590, 'drawn after Murchie & Niyogi 2011, Plant Physiol., Fig. 1A')}`);
}

/* ---------- v4 · Murchie & Niyogi 2011, Fig. 1A, restyled ---------- */

const MURCHIE: Img = { href: murchieJpg, w: 531, h: 374 };
const MURCHIE_TEXT: [number, number, number, number][] = [[0, 0, 26, 28], [374, 2, 482, 58], [306, 98, 400, 174], [424, 172, 476, 208], [294, 230, 432, 270], [118, 318, 531, 354], [524, 0, 531, 374]];
function murchieShot(id: string, x: number, y: number, w: number): { svg: string; at: (u: number, v: number) => Pt } {
  const a = shot(id, MURCHIE, x, y, w, { win: [0, 0, 531, 374], masks: MURCHIE_TEXT, mult: true });
  return a;
}
function murchieV4(): string {
  const p = 'pp11v4';
  const a = murchieShot(`${p}i`, 64, 40, 650);
  const [x0, y0] = a.at(48, 372);
  return svg('Murchie and Niyogi 2011, Figure 1A, restyled: absorbed light rises in a straight line with light intensity while CO₂ assimilation saturates; the gap between them is excess excitation energy.', `
    ${defs(p)}${a.svg}
    ${T(...a.at(372, 40), 'absorbed light', 'pp-hb pp-c-amber', 'start')}
    ${T(...a.at(352, 142), 'excess', 'pp-big pp-c-clay')}
    ${T(...a.at(362, 258), 'CO₂ fixation', 'pp-hb pp-c-green')}
    ${T(a.at(250, 0)[0], y0 + 46, 'light intensity', 'pp-ax')}${TV(x0 - 30, a.at(0, 190)[1], 'energy per second')}
    ${credit(786, 590, 'Murchie & Niyogi 2011, Plant Physiol. 155: 86, Fig. 1A · © ASPB')}`);
}

/* ---------- v5 · yields against light (data) ---------- */

function yieldsV5(): string {
  const p = 'pp11v5';
  const a = axes(130, 470, 630, 70, [0, 1500], [0, 1]);
  const series = (ys: number[], col: string, kind: 'tr' | 'sq' | 'ci'): string =>
    `<path class="pp-line" stroke="${col}" d="${smooth(PPF.map((q, i): Pt => [a.X(q), a.Y(ys[i])]))}"/>${PPF.map((q, i) => mark(kind, true, a.X(q), a.Y(ys[i]), 6.5, col)).join('')}`;
  return svg('Measured yields against light in oak leaves (Quercus pyrenaica grown in high light): the yield of photochemistry falls from about 0.87 in darkness to about 0.22 at 1420 micromoles per square metre per second, the yield of regulated heat dissipation rises from 0 to about 0.57, and the remaining losses, including fluorescence, stay near 0.2. At each light level the three add up to 1.', `
    ${defs(p)}
    ${frame(a, [0, 500, 1000, 1500], [0, 0.5, 1], 'light (µmol photons m⁻² s⁻¹)', 'share of absorbed light')}
    ${series(Y_PSII, '#2a963a', 'tr')}${series(Y_NPQ, '#6b6a64', 'sq')}${series(Y_NO, '#c8361e', 'ci')}
    ${T(a.X(250) + 22, a.Y(0.63) - 22, 'photochemistry', 'pp-hb pp-c-green', 'start')}
    ${T(a.X(1420) + 14, a.Y(0.57) + 8, 'heat (NPQ)', 'pp-hb pp-c-grey', 'start')}
    ${T(a.X(1420) + 14, a.Y(0.22) - 4, 'fluorescence', 'pp-lb pp-c-red', 'start')}${T(a.X(1420) + 14, a.Y(0.22) + 22, '+ other heat', 'pp-lb pp-c-red', 'start')}
    ${T(a.X(560), a.Y(0.93), 'sum = 1 at every light level', 'pp-l', 'start')}
    ${credit(786, 590, CR_RC)}`);
}

/* ---------- v6 · stacked shares (data) ---------- */

function stackV6(): string {
  const p = 'pp11v6';
  const a = axes(130, 470, 720, 70, [0, 1420], [0, 1]);
  // normalise each column to 1 (the read values sum to 0.99–1.02)
  const s = PPF.map((_, i) => Y_PSII[i] + Y_NPQ[i] + Y_NO[i]);
  const c1 = PPF.map((_, i) => Y_PSII[i] / s[i]), c2 = PPF.map((_, i) => (Y_PSII[i] + Y_NPQ[i]) / s[i]);
  const edge = (ys: number[]): Pt[] => PPF.map((q, i): Pt => [a.X(q), a.Y(ys[i])]);
  const band = (lo: Pt[], hi: Pt[], cls: string): string =>
    `<path class="${cls}" d="${smooth(hi)}L${[...lo].reverse().map(([x, y]) => `${f(x)},${f(y)}`).join('L')}Z"/>`;
  const zero: Pt[] = PPF.map((q): Pt => [a.X(q), a.Y(0)]), one: Pt[] = PPF.map((q): Pt => [a.X(q), a.Y(1)]);
  // the bands are bounded by smooth edges; the lower edge of each band is drawn as a polyline under the smooth upper edge
  const e1 = edge(c1), e2 = edge(c2);
  return svg('Stacked shares of absorbed light against light in oak leaves (Quercus pyrenaica grown in high light), each column adding up to 1: photochemistry fills most of the column in low light and shrinks in strong light, regulated heat dissipation (NPQ) grows from nothing to more than half, and the rest, fluorescence and other heat loss, stays a thin band near one fifth.', `
    ${defs(p)}
    ${band(zero, e1, 'pp-area-green')}${band(e1, e2, 'pp-area-grey')}${band(e2, one, 'pp-area-red')}
    <path class="pp-line" stroke="#2a963a" d="${smooth(e1)}"/><path class="pp-line" stroke="#6b6a64" d="${smooth(e2)}"/>
    ${frame(a, [0, 500, 1000], [0, 0.5, 1], 'light (µmol photons m⁻² s⁻¹)', 'share of absorbed light')}
    ${T(a.X(230), a.Y(0.32), 'photochemistry', 'pp-hb pp-c-green', 'start')}
    ${T(a.X(1060), a.Y(0.52), 'heat (NPQ)', 'pp-hb', 'middle')}
    ${T(a.X(980), a.Y(0.895), 'fluorescence + other heat', 'pp-lb pp-c-red', 'middle')}
    ${credit(786, 590, CR_RC)}`);
}

/* ---------- v7 · energy levels and the three exits, no times (lighter version of pick a) ---------- */

function levelsV7(): string {
  const p = 'pp11v7';
  const S2 = 130, S1 = 300, S0 = 500, T1 = 400;
  const lvl = (x0: number, x1: number, y: number): string => `<path class="pp-ar pp-k-ink" d="M${x0},${y}H${x1}"/>`;
  return svg('Energy levels of chlorophyll: blue light lifts it to a higher excited state, red light to the first excited state S1; the extra energy above S1 is lost as heat. From S1 the energy leaves by photochemistry (charge separation at the reaction centre), by heat (NPQ), or as red fluorescence; if it lingers, chlorophyll can form a triplet that makes singlet oxygen.', `
    ${defs(p)}
    ${ar(p, 'ink', 'M56,540 V70', 'pp-thin')}${TV(38, 300, 'energy')}
    ${lvl(110, 250, S2)}${lvl(110, 560, S1)}${lvl(110, 600, S0)}${lvl(470, 584, T1)}
    ${T(98, S2 + 9, 'S₂', 'pp-lv', 'end')}${T(98, S1 + 9, 'S₁', 'pp-lv', 'end')}${T(98, S0 + 9, 'S₀', 'pp-lv', 'end')}
    ${ar(p, 'blue', `M136,${S0 - 4} V${S2 + 8}`)}${ar(p, 'red', `M176,${S0 - 4} V${S1 + 8}`)}
    ${T(130, 230, 'blue', 'pp-lb pp-c-blue', 'end')}${T(184, 430, 'red', 'pp-lb pp-c-red', 'start')}
    ${wv(p, 'grey', 222, S2 + 6, 222, S1 - 8, 6, 4)}${T(238, 222, 'heat', 'pp-lb pp-c-grey', 'start')}
    ${ar(p, 'green', `M560,${S1} H618`)}
    <rect class="pp-box" x="624" y="${S1 - 44}" width="160" height="88" rx="16" style="stroke:#2a963a;fill:#e8f3e1"/>
    ${T(704, S1 - 8, 'photo-', 'pp-hb pp-c-green')}${T(704, S1 + 22, 'chemistry', 'pp-hb pp-c-green')}
    ${wv(p, 'red', 300, S1 + 8, 300, S0 - 8, 7, 6)}${T(300, S0 + 38, 'fluorescence', 'pp-hb pp-c-red')}
    ${wv(p, 'grey', 392, S1 + 8, 392, S0 - 8, 7, 6)}${T(400, S0 + 38, 'heat (NPQ)', 'pp-hb pp-c-grey', 'start')}
    ${ar(p, 'clay', `M450,${S1 + 6} L500,${T1 - 6}`, 'pp-dash')}${T(530, T1 + 32, 'triplet', 'pp-lb pp-c-clay', 'middle')}
    ${ar(p, 'clay', `M584,${T1} H640`, 'pp-thin')}
    <rect class="pp-o2" x="646" y="${T1 - 29}" width="140" height="58" rx="14"/>${T(716, T1 + 8, `singlet O${sub('2')}`, 'pp-lb pp-c-clay')}
    ${credit(786, 590, 'after E. Rosenqvist, PhD course 2018, slides 11 and 13 (redrawn)')}`);
}

/* ---------- v8 · low light vs full sun: arrow widths = measured shares ---------- */

function lowHighV8(): string {
  const p = 'pp11v8';
  // shares at 40 and at 1420 µmol m⁻² s⁻¹ (Rodríguez-Calcerrada et al. 2008, read off the figure)
  const col = (cx: number, light: string, sh: [number, number, number], sun: number): string => {
    const S1 = 230, base = 470, w = (v: number): number => Math.max(3, v * 46);
    const rays = Array.from({ length: sun }, (_, i) => wv(p, 'amber', cx - 70 + i * 28, 70, cx - 54 + i * 22, S1 - 22, 6, 3.5)).join('');
    const exit = (x: number, y0: number, y1: number, k: string, v: number, wave: boolean): string => wave
      ? `<path class="pp-ar" stroke="${k}" style="stroke-width:${f(w(v))}" d="${wavePathLocal(x, y0, x, y1)}"/>`
      : `<path class="pp-ar" stroke="${k}" style="stroke-width:${f(w(v))};stroke-linecap:butt" d="M${x},${y0}V${y1}"/>`;
    return `${T(cx, 46, light, 'pp-hb', 'middle')}${rays}
      <path class="pp-ar pp-k-ink" d="M${cx - 160},${S1}H${cx + 172}"/>${T(cx - 166, S1 + 8, 'S₁', 'pp-lv', 'end')}
      ${exit(cx - 118, S1 + 6, base, '#2a963a', sh[0], false)}${exit(cx, S1 + 6, base, '#8a877d', sh[1], true)}${exit(cx + 118, S1 + 6, base, '#c8361e', sh[2], true)}
      ${T(cx - 118, base + 34, 'photo-', 'pp-lb pp-c-green')}${T(cx - 118, base + 58, 'chemistry', 'pp-lb pp-c-green')}
      ${T(cx, base + 34, 'heat', 'pp-lb pp-c-grey')}${T(cx, base + 58, '(NPQ)', 'pp-lb pp-c-grey')}
      ${T(cx + 118, base + 34, 'fluorescence', 'pp-lb pp-c-red')}${T(cx + 118, base + 58, '+ other heat', 'pp-lb pp-c-red')}`;
  };
  return svg('Side by side, the fate of absorbed energy in weak light (40 micromoles per square metre per second) and strong light (1420), each route drawn as an arrow whose width is its measured share: in weak light photochemistry takes most of it; in strong light most leaves as regulated heat (NPQ), and photochemistry takes about a fifth.', `
    ${defs(p)}<path class="pp-guide" d="M400,30V540"/>
    ${col(210, 'weak light', [0.79, 0.06, 0.17], 2)}${col(600, 'strong light', [0.22, 0.57, 0.22], 6)}
    ${credit(786, 590, 'arrow widths: shares measured at 40 and 1420 µmol m⁻² s⁻¹, Rodríguez-Calcerrada et al. 2008')}`);
}
/** A gentle wave for thick arrows (no head). */
function wavePathLocal(x0: number, y0: number, x1: number, y1: number): string {
  const pts: string[] = [], n = 3.5, amp = 7;
  for (let i = 0; i <= 60; i++) {
    const t = i / 60, w = Math.sin(t * n * 2 * Math.PI) * amp;
    pts.push(`${i ? 'L' : 'M'}${f(x0 + (x1 - x0) * t + w)},${f(y0 + (y1 - y0) * t)}`);
  }
  return pts.join('');
}

/* ---------- v9 · Porcar-Castell et al. 2021, Fig. 1 (detail), restyled ---------- */

const NODE: Img = { href: nodePng, w: 590, h: 760 };
function nodeV9(): string {
  const p = 'pp11v9';
  const PALE = '#eff5d0';
  const masks: [number, number, number, number, string?][] = [[202, 142, 334, 218, PALE], [202, 218, 300, 240, PALE], [394, 10, 460, 50, PALE], [60, 486, 172, 545], [426, 496, 520, 545]];
  const a = shot(`${p}i`, NODE, 196, 20, 420, { win: [60, 40, 390, 500], masks, discs: [[125, 253, 31, '#6bbd46'], [256, 276, 31, PALE]], mult: true });
  const P = (u: number, v: number): Pt => a.at(u, v);
  return svg('Porcar-Castell and colleagues 2021, Figure 1, detail, restyled: light absorbed by the leaf flows to photosystem I and photosystem II; at photosystem II it is split into photochemistry, heat (NPQ) and red fluorescence, which leaves the leaf.', `
    ${defs(p)}${a.svg}
    ${pill(...P(290, 86), 'photosystem I')}${pill(...P(308, 308), 'photosystem II')}
    ${callout(P(250, 190)[0] - 4, P(250, 190)[1], 'heat (NPQ)', P(322, 236), 'end', 'pp-hb pp-c-grey', [P(250, 190)[0] + 4, P(250, 190)[1] - 6])}
    ${callout(790, P(470, 120)[1] - 40, 'photochemistry', P(432, 162), 'end', 'pp-hb pp-c-green', [700, P(470, 120)[1] - 32])}
    ${callout(P(110, 470)[0] - 10, P(110, 470)[1], 'fluorescence', P(212, 470), 'end', 'pp-hb pp-c-red', [P(110, 470)[0] - 4, P(110, 470)[1] - 6])}
    ${T(P(70, 260)[0] - 12, P(70, 260)[1] - 30, 'absorbed', 'pp-hb', 'end')}${T(P(70, 260)[0] - 12, P(70, 260)[1] - 4, 'light', 'pp-hb', 'end')}
    ${credit(786, 590, 'Porcar-Castell et al. 2021, Nat. Plants 7: 998, Fig. 1 (detail) · © Springer Nature')}`);
}

/* ---------- v10 · Murchie & Niyogi's graph + where the excess goes ---------- */

function murchieV10(): string {
  const p = 'pp11v10';
  const a = murchieShot(`${p}i`, 30, 96, 520);
  const gap = a.at(350, 140);
  const rows: Array<[number, string, string, string]> = [[160, 'heat (NPQ)', 'grey', 'pp-c-grey'], [280, 'fluorescence', 'red', 'pp-c-red'], [400, `singlet O${sub('2')}`, 'clay', 'pp-c-clay']];
  return svg('Left, Murchie and Niyogi 2011, Figure 1A: absorbed light rises in a straight line with light intensity while CO₂ assimilation saturates, leaving excess energy. Right, drawn: the excess leaves as heat (NPQ) or fluorescence, and what is left forms singlet oxygen, which damages photosystem II.', `
    ${defs(p)}${a.svg}
    ${T(...a.at(372, 40), 'absorbed light', 'pp-hb pp-c-amber', 'start')}${T(...a.at(362, 258), 'CO₂ fixation', 'pp-hb pp-c-green')}
    ${T(gap[0], gap[1], 'excess', 'pp-big pp-c-clay')}
    ${T(a.at(250, 0)[0], a.at(0, 372)[1] + 44, 'light intensity', 'pp-ax')}
    <path class="pp-guide" d="M${gap[0] + 62},${gap[1] - 8} H546"/>
    ${rows.map(([y, s, k, c]) => `${k === 'clay' ? ar(p, 'clay', `M546,${gap[1] - 8} Q546,${y - 10} 574,${y - 8}`, 'pp-thin') : ar(p, k as 'grey', `M546,${gap[1] - 8} Q546,${y - 10} 574,${y - 8}`, 'pp-thin')}
      ${k === 'clay' ? `<rect class="pp-o2" x="584" y="${y - 34}" width="150" height="50" rx="12"/>` : wv(p, k as 'grey', 584, y - 8, 636, y - 8, 6, 2.5)}
      ${T(k === 'clay' ? 659 : 644, y, s, `pp-hb ${c}`, k === 'clay' ? 'middle' : 'start')}`).join('')}
    ${T(659, 456, 'damages', 'pp-lb pp-c-clay')}${T(659, 482, 'photosystem II', 'pp-lb pp-c-clay')}
    ${credit(786, 590, 'graph: Murchie & Niyogi 2011, Plant Physiol., Fig. 1A · © ASPB')}`);
}

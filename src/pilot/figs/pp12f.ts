// Slide 12 · Photoprotection and repair: figures of chunk pp (28 Oct 2026). The lecturer's pick b ("Thesis inset" of
// ./l13.ts) comes first; then the new variants v1–v10; then the older unpicked l13 figures.
// New variants by approach: whole chain with photosystem II and the lumen H⁺ lit (v1 zoom circle, v2 close-up with map),
// photosystem II damaged and repaired on the chain (v3); data redrawn (v4: Li et al. 2000 Fig. 1b, NPQ of wild type,
// npq1, npq4, values read off the figure); restyled paper figures (v5: Li et al. 2000 Fig. 1c, NPQ image; v6: Tyystjärvi
// & Aro 1996 Fig. 2A, damage rate ∝ light); drawings (v7: a lighter version of pick b; v8: the PSII repair cycle after
// Järvi et al. 2015 Fig. 1); combinations (v9: PsbS crystal structure, Fan et al. 2015, with the lumen H⁺ drawn on; v10:
// the VPZ tobacco field trial, Kromdijk et al. 2016 Fig. 5A and 5D).
import type { PlateText, Variant } from '../types';
import { draw as l13, VARIANTS as L13 } from './l13';
import type { FocusView, Glyphs, Part } from './chain';
/** The chain in the deck's glyph mode (atom balls, ringed H⁺, tagged carriers; lecturer, 28 Oct 2026). */
const G: Glyphs = { mol: true };
import { PLATE as TEXT } from './pp12';
import liCJpg from '../../assets/photos/13-li-c.jpg';
import tyPng from '../../assets/photos/13-tyystjarvi.png';
import kr5aJpg from '../../assets/photos/13-kromdijk-5a.jpg';
import kr5dJpg from '../../assets/photos/13-kromdijk-5d.jpg';
import fanJpg from '../../assets/refs/L6-photoprotection/fan2015-psbs-structure.jpg';
import {
  ar, axes, callout, chainCrop, chainMap, chainWhole, credit, defs, f, frame, hplus, it, leader, mark, PS2, poly, shot,
  sub, svg, T, TV, wv, xan, type Img, type Pt,
} from './pp-kit';

export const PLATE: PlateText = { ...TEXT, play: 'pp12' };

const PICKS = ['b'];
export const VARIANTS: Variant[] = [
  ...L13.filter(v => PICKS.includes(v.id)),
  { id: 'v1', name: 'Chain: acidic lumen, PsbS and zeaxanthin at photosystem II (zoom circle)' },
  { id: 'v2', name: 'Chain close-up: acidic lumen switches the antenna to heat, with a map' },
  { id: 'v3', name: 'Chain close-up: D1 damaged and replaced' },
  { id: 'v4', name: 'NPQ of wild type, no zeaxanthin, no PsbS (data, Li 2000 Fig. 1b)' },
  { id: 'v5', name: 'NPQ image: plants without PsbS (Li 2000 Fig. 1c)' },
  { id: 'v6', name: 'Damage rate ∝ light (Tyystjärvi & Aro 1996 Fig. 2A)' },
  { id: 'v7', name: 'Harvesting → heat in three states (lighter pick b)' },
  { id: 'v8', name: 'PSII repair cycle (drawn after Järvi 2015)' },
  { id: 'v9', name: 'PsbS structure senses the lumen H⁺ (Fan 2015 + drawing)' },
  { id: 'v10', name: 'Faster NPQ relaxation: tobacco field trial (Kromdijk 2016)' },
  ...L13.filter(v => !PICKS.includes(v.id)),
];

export function draw(id: string): string {
  switch (id) {
    case 'v1': return chainV1();
    case 'v2': return chainV2();
    case 'v3': return repairChainV3();
    case 'v4': return liDataV4();
    case 'v5': return liImageV5();
    case 'v6': return damageV6();
    case 'v7': return statesV7();
    case 'v8': return cycleV8();
    case 'v9': return psbsV9();
    case 'v10': return fieldV10();
    default: return l13(id);
  }
}

/* ---------- shared drawn parts ---------- */

/** PsbS as a yellow ellipse, optionally with H⁺ bound. */
const psbs = (x: number, y: number, rx: number, ry: number, protons: Pt[] = [], r = 11): string =>
  `<ellipse class="pp-psbs" cx="${f(x)}" cy="${f(y)}" rx="${f(rx)}" ry="${f(ry)}"/>${protons.map(([a, b]) => hplus(a, b, r)).join('')}`;
/** H⁺ as the deck's ringed marks (the chain's glyph mode draws them the same way); radius at least 11 so "H⁺" reads. */
const hd = (pts: Pt[], r = 11): string => pts.map(([x, y]) => hplus(x, y, Math.max(11, r))).join('');
const heatWaves = (p: string, pts: Array<[number, number, number, number]>, amp = 7): string =>
  pts.map(([x0, y0, x1, y1]) => wv(p, 'grey', x0, y0, x1, y1, amp, 3.5)).join('');

/* ---------- v1 · zoom circle on photosystem II: acidic lumen, PsbS, zeaxanthin, heat ---------- */

const LIT12: Part[] = ['psii', 'light-psii', 'h-water', 'pq-h-out', 'h-lumen'];

function chainV1(): string {
  const p = 'pp12v1';
  const c: Pt = [276, 132], r = 124, win: Pt = [110, 322], z = 1.1;
  const Z = (q: Pt): Pt => [c[0] + z * (q[0] - win[0]), c[1] + z * (q[1] - win[1])];
  const v: FocusView = {
    look: 'bil', lit: LIT12, labels: [], g: G,
    inset: { k: 0.78, at: [88, 170], ring: [112, 330, 118], c, r, win, z },
    say: 'The chain is drawn smaller, its lumen H⁺ highlighted; a circle above enlarges photosystem II: lumen H⁺ bind PsbS, zeaxanthin forms in the antenna, and the antenna gives off heat.',
  };
  const ps = Z([44, 330]), zx = Z([30, 300]), hs: Pt[] = [Z([88, 372]), Z([118, 388]), Z([150, 396]), Z([176, 380]), Z([70, 396])];
  return chainWhole(p, v, `${defs(`${p}x`)}
    ${hd(hs)}
    <ellipse class="pp-psbs" cx="${f(ps[0])}" cy="${f(ps[1] + 4)}" rx="26" ry="13"/>${hd([[ps[0] - 13, ps[1] + 26], [ps[0] + 13, ps[1] + 28]])}
    ${xan(zx[0], zx[1], 40, 'z', 7)}
    ${heatWaves(`${p}x`, [[Z([40, 262])[0], Z([40, 262])[1], 96, 20], [Z([70, 262])[0], Z([70, 262])[1], 132, 12]])}
    ${T(20, 34, 'heat', 'pp-hb pp-c-grey', 'start')}
    ${callout(14, 130, 'zeaxanthin', [zx[0] + 6, zx[1] + 2], 'start', 'pp-hb pp-c-orange', [90, 136])}
    ${callout(c[0] + r + 22, 136, 'PsbS', [ps[0] + 22, ps[1] + 6], 'start', 'pp-hb', [c[0] + r + 18, 130])}
    ${callout(c[0] + r + 22, 52, 'acidic lumen', [hs[3][0] + 8, hs[3][1] - 6], 'start', 'pp-hb pp-c-red', [c[0] + r + 18, 58])}`);
}

/* ---------- v2 · close-up (glow look): acidic lumen switches the antenna to heat ---------- */

function chainV2(): string {
  const p = 'pp12v2';
  const v: FocusView = { look: 'glow', lit: LIT12, g: G, say: 'Close-up of photosystem II.' };
  const win: [number, number, number] = [0, 180, 380], H = 500;
  const c = chainCrop(`${p}c`, v, win, [0, 0, 800, H]);
  const M = c.M, top = M([0, PS2.top])[1];
  const ps = M([44, 326]), zx = M([22, 300]);
  // The chain's own lumen H⁺ (glyph mode, enlarged by the crop) sit near x 430–660; the added ones keep clear of them.
  const hs: Pt[] = [[120, 452], [190, 474], [262, 446], [720, 446], [330, 478]];
  return svg('Close-up of photosystem II in the thylakoid membrane: the lumen below is crowded with H⁺; H⁺ bind PsbS at the antenna, zeaxanthin forms in the antenna, and the antenna gives off the excess energy as heat. Below, a small map of the whole chain.', `
    ${defs(p)}${c.svg}
    ${hd(hs, 16)}
    <ellipse class="pp-psbs" cx="${f(ps[0])}" cy="${f(ps[1] + 6)}" rx="44" ry="20"/>${hd([[ps[0] - 20, ps[1] + 40], [ps[0] + 22, ps[1] + 42]], 13)}
    ${xan(zx[0], zx[1], 70, 'z', 11)}
    ${heatWaves(p, [[70, top - 4, 40, 40], [110, top - 6, 96, 30], [150, top - 4, 150, 40]], 8)}
    ${T(186, 46, 'heat', 'pp-hb pp-c-grey pp-halo', 'start')}
    ${callout(330, 150, 'zeaxanthin', [zx[0] + 70, zx[1]], 'start', 'pp-hb pp-c-orange', [326, 156])}
    ${callout(16, 412, 'PsbS', [ps[0] - 30, ps[1] + 20], 'start', 'pp-hb', [34, 396])}
    ${T(786, 534, 'acidic lumen (H⁺)', 'pp-hb pp-c-red pp-halo', 'end')}
    ${T(786, 34, 'stroma', 'pp-lb pp-c-grey pp-halo', 'end')}
    ${chainMap(`${p}m`, { look: 'glow', lit: LIT12, g: G, say: '' }, [16, 512], 0.18, [100, 470], [win[0], win[1], win[2], H / c.z])}
    ${T(176, 556, 'photosystem II', 'pp-hb', 'start')}
    ${credit(786, 590, 'structures: PDB 5XNL, 6RQF, 5L8R, 6FKF')}`);
}

/* ---------- v3 · close-up: D1 damaged, and its repair ---------- */

function repairChainV3(): string {
  const p = 'pp12v3';
  const lit: Part[] = ['psii', 'light-psii'];
  const v: FocusView = { look: 'bil', lit, g: G, say: 'Close-up of photosystem II.' };
  const win: [number, number, number] = [0, 186, 220], H = 470;
  const c = chainCrop(`${p}c`, v, win, [0, 0, 500, H]);
  const d1 = c.M([128, 300]);
  const star = (x: number, y: number, r1: number, r2: number, n = 9): string =>
    `<path class="pp-burst" d="${poly(Array.from({ length: n * 2 }, (_, i): Pt => {
      const a = (i * Math.PI) / n - Math.PI / 2, rr = i % 2 ? r2 : r1; return [x + rr * Math.cos(a), y + rr * Math.sin(a)];
    }))}Z"/>`;
  const step = (y: number, s1: string, s2: string, cls: string): string => `${T(660, y, s1, `pp-hb ${cls}`)}${T(660, y + 28, s2, `pp-hb ${cls}`)}`;
  return svg('Left, a close-up of photosystem II in the thylakoid membrane: singlet oxygen damages the D1 protein at its reaction centre. Right, the repair in three steps: the damaged D1 is removed, a new D1 is inserted, photosystem II works again. Below, a small map of the whole chain.', `
    ${defs(p)}${c.svg}
    ${star(d1[0], d1[1], 56, 28)}${T(d1[0], d1[1] + 9, 'D1', 'pp-hb pp-c-red')}
    <rect class="pp-o2" x="22" y="30" width="150" height="54" rx="14"/>${T(97, 66, `singlet O${sub('2')}`, 'pp-hb pp-c-clay')}
    ${ar(p, 'clay', `M140,84 Q${f(d1[0] - 70)},110 ${f(d1[0] - 40)},${f(d1[1] - 48)}`)}
    <rect class="pp-card" x="530" y="40" width="260" height="410" rx="20"/>
    ${T(660, 84, 'repair', 'pp-big')}
    ${step(144, 'damaged D1', 'removed', 'pp-c-red')}${ar(p, 'ink', 'M660,190 V236', 'pp-thin')}
    ${step(272, 'new D1', 'inserted', 'pp-c-green')}${ar(p, 'ink', 'M660,318 V364', 'pp-thin')}
    ${step(400, 'photosystem II', 'works again', '')}
    ${ar(p, 'ink', `M${f(d1[0] + 66)},${f(d1[1] - 40)} Q470,150 528,150`, 'pp-thin pp-dash')}
    ${chainMap(`${p}m`, { look: 'bil', lit, g: G, say: '' }, [16, 494], 0.18, [100, 470], [win[0], win[1], win[2], H / c.z])}
    ${T(176, 546, 'photosystem II', 'pp-hb', 'start')}
    ${credit(786, 590, 'structures: PDB 5XNL, 6RQF, 5L8R, 6FKF · repair after Järvi et al. 2015')}`);
}

/* ---------- v4 · Li et al. 2000, Fig. 1b, redrawn ---------- */

// NPQ read off Fig. 1b (5 min light, then dark): wild type, npq1-2 (no zeaxanthin), npq4-1 (no PsbS).
const LT = [0, 0.5, 1, 2, 3, 4, 5, 6, 8, 10];
const LI_WT = [0, 0.80, 1.36, 1.99, 2.27, 2.41, 2.43, 0.49, 0.32, 0.25];
const LI_NPQ1 = [0, 0.53, 0.71, 0.78, 0.73, 0.73, 0.79, 0.57, 0.40, 0.36];
const LI_NPQ4 = [0, 0.13, 0.22, 0.33, 0.41, 0.48, 0.53, 0.55, 0.45, 0.39];
const CR_LI = 'data: Li et al. 2000, Nature 403: 391, Fig. 1b, <tspan class="pp-i">Arabidopsis</tspan>; read off the figure';

function liDataV4(): string {
  const p = 'pp12v4';
  const a = axes(120, 470, 740, 110, [0, 10], [0, 2.5]);
  const line = (ys: number[], col: string, kind: 'sq' | 'ci' | 'tr', filled: boolean): string =>
    `<path class="pp-line" stroke="${col}" d="${poly(LT.map((t, i): Pt => [a.X(t), a.Y(ys[i])]))}"/>${LT.map((t, i) => mark(kind, filled, a.X(t), a.Y(ys[i]), 7, col)).join('')}`;
  return svg('NPQ of Arabidopsis leaves during 5 minutes of strong light and 5 minutes of darkness, redrawn from Li et al. 2000: the wild type builds NPQ up to about 2.4; plants without zeaxanthin (npq1) reach about 0.8; plants without PsbS (npq4) reach only about 0.5. In darkness NPQ falls in the wild type.', `
    ${defs(p)}
    <rect class="pp-band" x="${a.X(0)}" y="${a.y1 - 44}" width="${f(a.X(5) - a.X(0))}" height="26"/><rect class="pp-dark" x="${f(a.X(5))}" y="${a.y1 - 44}" width="${f(a.X(10) - a.X(5))}" height="26"/>
    ${T(a.X(2.5), a.y1 - 24, 'light', 'pp-lb')}${T(a.X(7.5), a.y1 - 24, 'dark', 'pp-lb pp-c-paper')}
    ${frame(a, [0, 5, 10], [0, 1, 2], 'time (min)', 'NPQ (heat dissipation)')}
    ${line(LI_WT, '#141413', 'sq', true)}${line(LI_NPQ1, '#d9821e', 'ci', true)}${line(LI_NPQ4, '#2350e6', 'sq', false)}
    ${T(a.X(3) + 10, a.Y(2.27) - 22, 'wild type', 'pp-hb', 'end')}
    ${T(a.X(1.6), a.Y(0.95), `no zeaxanthin (${it('npq1')})`, 'pp-lb pp-c-orange', 'start')}
    ${T(a.X(2.6), a.Y(0.13), `no PsbS (${it('npq4')})`, 'pp-lb pp-c-blue', 'start')}
    ${credit(786, 590, CR_LI)}`);
}

/* ---------- v5 · Li et al. 2000, Fig. 1c: NPQ image ---------- */

const LIC: Img = { href: liCJpg, w: 328, h: 333 };
function liImageV5(): string {
  const p = 'pp12v5';
  const a = shot(`${p}i`, LIC, 60, 40, 470, { rx: 14 });
  const row = (v: number, s: string, s2 = ''): string => {
    const y = a.at(0, v)[1];
    return `${T(556, y + (s2 ? -4 : 8), s, 'pp-hb', 'start')}${s2 ? T(556, y + 24, s2, 'pp-l', 'start') : ''}<path class="pp-guide" d="M${f(a.at(328, 0)[0] + 4)},${f(y)}H548"/>`;
  };
  return svg('Li et al. 2000, Figure 1c: a false-colour image of NPQ in Arabidopsis plants. Wild-type plants (top) show high NPQ; npq4 plants, which lack PsbS (middle two rows, one with an empty vector), show low NPQ (purple); npq4 plants given the PsbS gene back (bottom) show high NPQ again.', `
    ${defs(p)}${a.svg}
    ${row(48, 'wild type')}${row(130, `no PsbS (${it('npq4')})`)}${row(205, `${it('npq4')} + empty`, 'vector')}${row(290, `${it('npq4')} + PsbS`, 'gene')}
    ${T(60, a.at(0, 333)[1] + 40, 'NPQ image: purple = low NPQ', 'pp-l', 'start')}
    ${credit(786, 590, 'Li et al. 2000, Nature 403: 391, Fig. 1c · © Macmillan')}`);
}

/* ---------- v6 · Tyystjärvi & Aro 1996, Fig. 2A ---------- */

const TY: Img = { href: tyPng, w: 502, h: 392 };
const tyU = (ppfd: number): number => 15.5 + 0.2285 * ppfd;
const tyV = (k: number): number => 365.8 - 853 * k;
function damageV6(): string {
  const p = 'pp12v6';
  const a = shot(`${p}i`, TY, 150, 30, 560, { masks: [[24, 22, 58, 56]], mult: true });
  const [x0] = a.at(4, 0), [, yb] = a.at(0, 386);
  return svg('Tyystjärvi and Aro 1996, Figure 2A: the rate constant of photosystem II damage in pumpkin leaves, measured with repair blocked by lincomycin, rises in a straight line with light from 6.5 to 1500 micromoles per square metre per second.', `
    ${defs(p)}${a.svg}
    ${[0, 0.1, 0.2, 0.3, 0.4].map(k => T(x0 - 10, a.at(0, tyV(k))[1] + 7, `${k}`, 'pp-tk', 'end')).join('')}
    ${[0, 500, 1000, 1500, 2000].map(q => T(a.at(tyU(q), 0)[0], yb + 30, `${q}`, 'pp-tk')).join('')}
    ${T(a.at(tyU(1000), 0)[0], yb + 62, 'light (µmol photons m⁻² s⁻¹)', 'pp-ax')}
    ${TV(x0 - 60, a.at(0, tyV(0.2))[1], 'damage rate of photosystem II (h⁻¹)')}
    ${T(a.at(tyU(250), 0)[0], a.at(0, tyV(0.36))[1], 'repair blocked', 'pp-hb', 'start')}${T(a.at(tyU(250), 0)[0], a.at(0, tyV(0.36))[1] + 28, '(lincomycin)', 'pp-l', 'start')}
    ${T(a.at(tyU(1180), 0)[0], a.at(0, tyV(0.12))[1], 'damage ∝ light', 'pp-hb pp-c-red', 'start')}
    ${credit(786, 590, 'Tyystjärvi & Aro 1996, PNAS 93: 2213, Fig. 2A, pumpkin leaves · © PNAS')}`);
}

/* ---------- v7 · harvesting → heat in three states (lighter version of pick b) ---------- */

function statesV7(): string {
  const p = 'pp12v7';
  const xs = [30, 290, 550], w = 220, y0 = 190, h = 160;
  const blob = (x: number, kind: 'v' | 'z', on: boolean, heat: boolean): string => `
    <rect class="pp-lhc" x="${x}" y="${y0}" width="${w}" height="${h}" rx="40"/><rect class="pp-core" x="${x + 140}" y="${y0 + 18}" width="64" height="${h - 36}" rx="22"/>
    ${xan(x + 16, y0 + 92, 70, kind, 9)}
    ${psbs(x + 194, y0 + h + 4, 42, 19, on ? [[x + 158, y0 + h + 40], [x + 214, y0 + h + 44]] : [], 13)}
    ${heat ? heatWaves(p, [[x + 40, y0 - 4, x + 18, 70], [x + 78, y0 - 6, x + 74, 64]]) : ar(p, 'amber', `M${x + 60},${y0 + 50} H${x + 132}`, 'pp-dot')}`;
  return svg('A lighter version of the thesis inset: photosystem II with its antenna in three states. Harvesting: the antenna passes the energy to the reaction centre. Low lumen pH: H⁺ bind PsbS. Then violaxanthin is converted to zeaxanthin and the antenna gives off the excess energy as heat.', `
    ${defs(p)}
    ${xs.map(x => wv(p, 'amber', x + 150, 48, x + 168, y0 - 8, 6, 3.5)).join('')}
    ${blob(xs[0], 'v', false, false)}${blob(xs[1], 'v', true, false)}${blob(xs[2], 'z', true, true)}
    ${T(xs[2] + 4, 50, 'heat', 'pp-hb pp-c-grey', 'start')}
    ${ar(p, 'ink', `M${xs[0] + w + 6},${y0 + 80} H${xs[1] - 6}`, 'pp-thin')}${ar(p, 'ink', `M${xs[1] + w + 6},${y0 + 80} H${xs[2] - 6}`, 'pp-thin')}
    ${T(xs[0] + 16, y0 + 136, 'violaxanthin', 'pp-lb pp-c-violet', 'start')}
    ${T(xs[2] + 16, y0 + 136, 'zeaxanthin', 'pp-lb pp-c-orange', 'start')}
    ${T(xs[0] + w / 2, 470, 'harvesting', 'pp-hb')}${T(xs[1] + w / 2, 470, 'H⁺ bind PsbS', 'pp-hb')}${T(xs[2] + w / 2, 470, 'heat dissipation', 'pp-hb')}
    ${T(xs[0] + w / 2, 500, 'lumen pH high', 'pp-l pp-c-blue')}${T((xs[1] + xs[2] + w) / 2, 500, 'lumen pH low', 'pp-l pp-c-red')}
    ${T(xs[0] + 18, y0 + 36, 'antenna', 'pp-lb', 'start')}${T(xs[0] + 194, y0 + h + 52, 'PsbS', 'pp-lb')}
    ${credit(786, 590, 'after the MSc-thesis inset; Wilhelm & Selmar 2011, Fig. 2')}`);
}

/* ---------- v8 · the PSII repair cycle (drawn after Järvi et al. 2015, Fig. 1) ---------- */

function cycleV8(): string {
  const p = 'pp12v8';
  /** PSII as a core dimer with D1 marked: ok, damaged (red) or missing. */
  const ps2 = (x: number, y: number, d1: 'ok' | 'dmg' | 'gone' | 'new'): string => `
    <rect class="pp-lhc" x="${x - 74}" y="${y - 34}" width="148" height="68" rx="20"/>
    <rect class="pp-core" x="${x - 46}" y="${y - 26}" width="92" height="52" rx="14"/>
    ${d1 === 'gone' ? `<rect x="${x - 12}" y="${y - 20}" width="30" height="40" rx="8" fill="#fbfaf6" stroke="#8a877d" stroke-dasharray="4 4"/>`
      : `<rect class="${d1 === 'dmg' ? 'pp-core-dmg' : 'pp-core'}" x="${x - 12}" y="${y - 20}" width="30" height="40" rx="8" style="${d1 === 'new' ? 'fill:#6fb35a;stroke:#24812f;stroke-width:2.4' : d1 === 'ok' ? 'fill:#8fc06f' : ''}"/>`}
    ${T(x + 3, y + 7, 'D1', `pp-lb${d1 === 'dmg' ? ' pp-c-red' : d1 === 'gone' ? ' pp-c-grey' : ''}`)}`;
  const grana = (x: number, y: number): string => [-60, -30, 30, 60].map(d => `<path class="pp-mem" d="M${x - 120},${y + d - 7} h240 v14 h-240z"/>`).join('');
  const lam = (x: number, y: number): string => `<path class="pp-mem" d="M${x - 130},${y - 7} h260 v14 h-260z"/>`;
  const A: Pt = [200, 150], B: Pt = [600, 150], C: Pt = [600, 400], D: Pt = [200, 400];
  return svg('The repair cycle of photosystem II, drawn after Järvi, Suorsa and Aro 2015: in the stacked grana, light damages the D1 protein; the damaged photosystem moves to the unstacked membrane, where D1 is removed and a new D1 is made and inserted; the repaired photosystem returns to the grana.', `
    ${defs(p)}
    ${grana(A[0], A[1])}${grana(B[0], B[1])}${lam(C[0], C[1])}${lam(D[0], D[1])}
    <path class="pp-mem" d="M${A[0] - 120},${A[1] - 7} h${B[0] - A[0] + 240} v14 h-${B[0] - A[0] + 240}z"/>
    ${ps2(A[0], A[1], 'ok')}${ps2(B[0], B[1], 'dmg')}${ps2(C[0], C[1], 'gone')}${ps2(D[0], D[1], 'new')}
    ${ar(p, 'red', `M${A[0] + 96},${A[1] - 74} Q400,${A[1] - 104} ${B[0] - 96},${B[1] - 74}`)}${T(400, 34, 'light damages D1', 'pp-hb pp-c-red')}
    ${ar(p, 'ink', `M${B[0] + 140},${B[1] + 40} Q${B[0] + 170},${(B[1] + C[1]) / 2} ${C[0] + 146},${C[1] - 30}`)}
    ${T(B[0] + 110, (B[1] + C[1]) / 2 + 2, 'to unstacked', 'pp-lb', 'end')}${T(B[0] + 110, (B[1] + C[1]) / 2 + 28, 'membrane', 'pp-lb', 'end')}
    ${ar(p, 'ink', `M${C[0] - 140},${C[1] + 50} Q400,${C[1] + 100} ${D[0] + 140},${D[1] + 50}`)}${T(400, C[1] + 120, 'new D1 made and inserted', 'pp-hb pp-c-green')}
    ${ar(p, 'ink', `M${D[0] - 140},${D[1] - 30} Q${D[0] - 170},${(A[1] + D[1]) / 2} ${A[0] - 140},${A[1] + 40}`)}
    ${T(A[0] - 110, (A[1] + D[1]) / 2 + 2, 'back to', 'pp-lb', 'start')}${T(A[0] - 110, (A[1] + D[1]) / 2 + 28, 'grana', 'pp-lb', 'start')}
    ${T(C[0], C[1] - 52, 'damaged D1 removed', 'pp-lb pp-c-red')}
    ${T(B[0], B[1] + 96, 'grana', 'pp-s')}${T(C[0], C[1] + 64, 'unstacked membrane', 'pp-s')}
    ${credit(786, 590, 'drawn after Järvi, Suorsa & Aro 2015, BBA Bioenerg. 1847: 900, Fig. 1')}`);
}

/* ---------- v9 · PsbS structure (Fan et al. 2015, Fig. 1a, right view) + drawn lumen H⁺ ---------- */

const FAN: Img = { href: fanJpg, w: 1395, h: 428 };
function psbsV9(): string {
  const p = 'pp12v9';
  const masks: [number, number, number, number][] = [[512, 138, 600, 178], [512, 332, 600, 372], [345, 274, 398, 310], [498, 284, 542, 322], [345, 348, 408, 392], [462, 378, 528, 422], [345, 186, 362, 262]];
  const a = shot(`${p}i`, FAN, 40, 20, 300, { win: [345, 20, 255, 408], masks, mult: true });
  const g1 = a.at(398, 344), g2 = a.at(494, 372);
  const [, ys] = a.at(0, 183), [, yl] = a.at(0, 325);
  return svg('Left, the crystal structure of spinach PsbS in the thylakoid membrane (Fan et al. 2015), stroma above, lumen below; two acidic amino acids on its lumen side take up H⁺ when the lumen becomes acidic. Right, drawn: low lumen pH, H⁺ bound to PsbS, the antenna then dissipates heat.', `
    ${defs(p)}${a.svg}
    ${T(350, ys + 7, 'stroma', 'pp-lb pp-c-grey', 'start')}${T(350, yl + 7, 'lumen', 'pp-lb pp-c-grey', 'start')}
    ${hplus(g1[0] - 26, g1[1] + 34, 15)}${hplus(g2[0] + 34, g2[1] + 20, 15)}
    ${callout(170, 548, 'H⁺-binding sites', [g1[0] + 2, g1[1] + 4], 'middle', 'pp-hb pp-c-red', [176, 530])}
    ${leader([196, 532], [g2[0] - 2, g2[1] + 4])}
    ${T(232, 62, 'PsbS', 'pp-big', 'start')}
    <rect class="pp-card" x="440" y="70" width="330" height="420" rx="20"/>
    ${T(605, 130, 'lumen pH falls', 'pp-hb pp-c-red')}${ar(p, 'ink', 'M605,148 V196', 'pp-thin')}
    ${T(605, 236, 'H⁺ bind PsbS', 'pp-hb')}${ar(p, 'ink', 'M605,254 V302', 'pp-thin')}
    ${T(605, 342, 'antenna switches', 'pp-hb')}${T(605, 370, 'to heat dissipation', 'pp-hb')}
    ${heatWaves(p, [[560, 470, 548, 400], [605, 470, 605, 396], [650, 470, 662, 400]].map(([x0, y0, x1, y1]): [number, number, number, number] => [x0, y0 + 0, x1, y1 + 6]))}
    ${credit(786, 590, 'structure: Fan et al. 2015, Nat. Struct. Mol. Biol. 22: 729, Fig. 1a (PDB 4RI2) · © Springer Nature')}`);
}

/* ---------- v10 · Kromdijk et al. 2016: field trial of VPZ tobacco ---------- */

const K5A: Img = { href: kr5aJpg, w: 426, h: 370 };
const K5D: Img = { href: kr5dJpg, w: 282, h: 250 };
function fieldV10(): string {
  const p = 'pp12v10';
  const ph = shot(`${p}p`, K5D, 420, 70, 360, { rx: 12 });
  const g = shot(`${p}g`, K5A, 120, 70, 250, { win: [170, 0, 256, 250], masks: [[180, 10, 420, 56], [100, 40, 172, 210]], mult: true });
  const ty = (pct: number): number => g.at(0, 185 - (pct - 10) * 6.15)[1];
  const [gx0] = g.at(172, 0), [, gy0] = g.at(0, 245);
  return svg('The field trial of tobacco with faster NPQ relaxation (VPZ lines, Kromdijk et al. 2016): left, the dry weight of three VPZ lines, 14 to 20 percent above the wild type; right, an aerial photograph of the field plots, Urbana, Illinois, 2016.', `
    ${defs(p)}${g.svg}${ph.svg}
    ${[10, 20, 30].map(v => `<path class="pp-axis" d="M${f(gx0)},${f(ty(v))}h-8"/>${T(gx0 - 14, ty(v) + 7, `${v}`, 'pp-tk', 'end')}`).join('')}
    ${TV(gx0 - 58, ty(20), 'dry weight, % above wild type')}
    ${['23', '34', '56'].map((s, i) => T(g.at(238 + i * 63, 0)[0], gy0 + 30, s, 'pp-tk')).join('')}
    ${T(g.at(300, 0)[0], gy0 + 62, 'VPZ lines', 'pp-ax')}
    ${T(600, ph.h + 70 + 36, 'field plots, Illinois', 'pp-l')}
    ${T(400, 470, 'faster NPQ relaxation: ≈ 15 % more dry weight', 'pp-hb pp-c-green')}
    ${credit(786, 590, 'Kromdijk et al. 2016, Science 354: 857, Fig. 5A and 5D (photo D. Drag) · © AAAS')}`);
}


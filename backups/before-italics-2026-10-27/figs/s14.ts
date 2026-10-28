// Slide 13 · Chlorophyll fluorescence (was slide 14; redo of 27 Oct 2026, block L1c; page text approved 27 Oct). Focus (lecturer, 27 Oct): Fv/Fm as a
// stress indicator, ΦPSII and NPQ, satellite SIF.
// Real data: Kalaji et al. 2014 Photosynth Res Fig. 4 (CC BY 4.0), a PAM-2100 trace: the published image is 387 px wide,
// so the trace is redrawn from points digitised off it (orig. pixel u → time t = (u − 111.5)/18.07 min; v → fluorescence,
// arbitrary units, no zero shown in the original). Guanter et al. 2014 PNAS Fig. 1 (maximum monthly SIF at 740 nm, 2009);
// Porcar-Castell et al. 2021 Nat Plants Fig. 3a, b (RGB photo and SIF₇₆₀ image of a maple and an oak); ESA photo of the
// Vega-C VV30 launch with FLEX, 15 Sep 2026. Drawn: PSII states at Fo, Fm, Fm′ and Fs (after E. Rosenqvist, slide 34).
// Numbers: Fv/Fm ≈ 0.8 in healthy leaves, as on the approved page (Björkman & Demmig 1987: 0.832 ± 0.004 across 37 C₃ species).
import type { PlateText, Variant } from '../types';
import guanterJpg from '../../assets/photos/14-guanter.jpg';
import treeJpg from '../../assets/photos/14-pc-tree.jpg';
import flexJpg from '../../assets/photos/14-flex.jpg';
import './s14.css';

export const PLATE: PlateText = {
  n: '13',
  title: 'Chlorophyll fluorescence',
  status: 'draft',
  lead: 'Fluorescence competes with photochemistry and heat, so measuring it shows how a leaf uses light, without harming it.',
  points: [
    { claim: 'Fv/Fm.', text: 'Measured after dark adaptation with a saturating light pulse<br>Maximum PSII efficiency: ≈ 0.8 in healthy leaves, lower under stress' },
    { claim: 'ΦPSII and NPQ.', text: 'Measured in the light<br>ΦPSII: the share of absorbed light used by PSII; NPQ: the heat dissipation' },
    { claim: 'Solar-induced fluorescence (SIF).', text: 'Satellites detect the faint fluorescence of vegetation<br>It tracks crop photosynthesis across regions' },
  ],
  refs: [
    { label: 'Kalaji et al. 2014', url: 'https://doi.org/10.1007/s11120-014-0024-6' },
    { label: 'Björkman & Demmig 1987', url: 'https://doi.org/10.1007/BF00402983' },
    { label: 'Guanter et al. 2014', url: 'https://doi.org/10.1073/pnas.1320008111' },
    { label: 'Porcar-Castell et al. 2021', url: 'https://doi.org/10.1038/s41477-021-00980-4' },
  ],
};

export const VARIANTS: Variant[] = [
  { id: 'a', name: 'PAM trace: Fo, Fm, Fm′, Fs with Fv/Fm, ΦPSII, NPQ (Kalaji 2014)' },
  { id: 'b', name: 'PAM trace + PSII states at Fo, Fm, Fm′, Fs' },
  { id: 'c', name: 'PSII states at Fo, Fm, Fm′, Fs, with the formulas' },
  { id: 'f', name: 'PAM trace + global SIF (Guanter 2014)' },
  { id: 'd', name: 'Global SIF at 740 nm, 2009 (Guanter 2014)' },
  { id: 'e', name: 'SIF image of two trees (Porcar-Castell 2021) + global SIF' },
  { id: 'g', name: 'Global SIF + FLEX launch, 15 Sep 2026' },
];

/* ---------- shared parts ---------- */

type A = 'start' | 'middle' | 'end';
type Pt = [number, number];
const f = (v: number): string => v.toFixed(1);
const T = (x: number, y: number, s: string, cls = 'fx14-l', a: A = 'start'): string =>
  `<text class="${cls}" x="${f(x)}" y="${f(y)}" text-anchor="${a}">${s}</text>`;
const TV = (x: number, y: number, s: string, cls = 'fx14-ax'): string =>
  `<text class="${cls}" transform="translate(${f(x)} ${f(y)}) rotate(-90)" text-anchor="middle">${s}</text>`;
/** F with a subscript and an optional prime: Fo, Fm, Fm′, Fs, Fv. */
const F = (s: string, prime = false): string => `F<tspan baseline-shift="sub" font-size="72%">${s}</tspan>${prime ? '′' : ''}`;
const PHI = `Φ<tspan baseline-shift="sub" font-size="72%">PSII</tspan>`;
const defs = (p: string): string =>
  `<defs><marker id="${p}-ink" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path class="fx14-hd-ink" d="M0,0L10,5L0,10z"/></marker></defs>`;

interface Img { href: string; w: number; h: number }
interface Shot { svg: string; at: (u: number, v: number) => Pt; h: number; s: number }
type Mask = [number, number, number, number, string?];
function shot(id: string, im: Img, x: number, y: number, w: number,
  o: { win?: [number, number, number, number]; fig?: boolean; credit?: string; masks?: Mask[] } = {}): Shot {
  const [u0, v0, uw, vh] = o.win ?? [0, 0, im.w, im.h];
  const s = w / uw, h = vh * s, ox = x - u0 * s, oy = y - v0 * s;
  const img = `<image href="${im.href}" x="${f(ox)}" y="${f(oy)}" width="${f(im.w * s)}" height="${f(im.h * s)}"/>`;
  const masks = (o.masks ?? []).map(([a, b, c, d, fill]) =>
    `<rect x="${f(ox + a * s)}" y="${f(oy + b * s)}" width="${f((c - a) * s)}" height="${f((d - b) * s)}" fill="${fill ?? '#ffffff'}"/>`).join('');
  const band = o.credit ? `<rect class="fx14-credbg" x="${f(x)}" y="${f(y + h - 22)}" width="${f(w)}" height="22"/>${T(x + w - 8, y + h - 6.5, o.credit, 'fx14-cr', 'end')}` : '';
  const clip = o.fig
    ? `<clipPath id="${id}"><rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}"/></clipPath>`
    : `<clipPath id="${id}"><rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="8"/></clipPath>`;
  return { svg: `${clip}<g clip-path="url(#${id})"${o.fig ? ' class="fx14-mult"' : ''}>${img}${masks}${band}</g>`, at: (u, v) => [ox + u * s, oy + v * s], h, s };
}
const pleader = (a: Pt, b: Pt): string => {
  const d = `M${f(a[0])},${f(a[1])}L${f(b[0])},${f(b[1])}`;
  return `<path class="fx14-ldh" d="${d}"/><path class="fx14-ldk" d="${d}"/><circle class="fx14-tipd" cx="${f(b[0])}" cy="${f(b[1])}" r="2.8"/>`;
};
function pill(x: number, y: number, s: string, to?: Pt, tint = true): string {
  const w = s.replace(/<[^>]+>/g, '').length * 9.7 + 24;
  let ld = '';
  if (to) {
    const dx = to[0] - x, dy = to[1] - y, t = Math.min(w / 2 / Math.max(Math.abs(dx), 1e-6), 14 / Math.max(Math.abs(dy), 1e-6));
    ld = pleader([x + dx * t, y + dy * t], to);
  }
  return `${ld}<rect class="${tint ? 'fx14-pillbg-t' : 'fx14-pillbg'}" x="${f(x - w / 2)}" y="${f(y - 15)}" width="${f(w)}" height="30" rx="15"/>${T(x, y + 6.5, s, 'fx14-pill', 'middle')}`;
}
function badge(x: number, y: number, s: string): string {
  const w = s.replace(/<[^>]+>/g, '').length * 9.2 + 26;
  return `<rect class="fx14-badge" x="${f(x - w / 2)}" y="${f(y - 15)}" width="${f(w)}" height="30" rx="15"/>${T(x, y + 6, s, 'fx14-bt', 'middle')}`;
}
const credit = (x: number, y: number, s: string, a: A = 'end'): string => T(x, y, s, 'fx14-crd', a);
const svg = (p: string, label: string, body: string): string =>
  `<svg class="fig-svg fx14" viewBox="0 0 800 600" role="img" aria-label="${label}">${defs(p)}${body}</svg>`;

const FV_FM = `${F('v')}/${F('m')} = (${F('m')} − ${F('o')})/${F('m')}`;
const PHI_EQ = `${PHI} = (${F('m', true)} − ${F('s')})/${F('m', true)}`;
const NPQ_EQ = `NPQ = (${F('m')} − ${F('m', true)})/${F('m', true)}`;

/* ---------- the PAM trace of Kalaji et al. 2014, Fig. 4, redrawn from digitised points ---------- */

// [u, v] in pixels of the 387 × 253 original: u → time, v → fluorescence (down = lower)
const TRACE: Pt[] = [
  [66, 196], [66.5, 55], [67.3, 60], [68, 112], [68.6, 160], [69.5, 170.5], [71, 173], [72, 173.5], [110.3, 173.5],
  [110.8, 64], [111.6, 66], [112.2, 118], [113, 120], [114, 122], [124, 123], [132, 123.5],
  [133, 114], [134.5, 103], [136, 95], [137, 120], [137.6, 151], [139, 150.5], [151.5, 151.5],
  [152.5, 141], [153.5, 158], [155, 158.5], [171.5, 158.5], [172.5, 138], [173.8, 154], [175, 158.5], [177, 160], [190.5, 160.5],
  [191.6, 150], [193.3, 161.5], [195, 162.5], [211.6, 162.5], [212.8, 122], [214.2, 150], [215.5, 160], [217, 162.5], [234.6, 163],
  [235.6, 115], [237, 140], [238.5, 160.5], [240, 162.5], [257.6, 163], [258.6, 112], [260, 144], [261.5, 158], [263, 163], [280.6, 163],
  [281.6, 111], [283, 143], [284.5, 159], [286, 163.5], [301.6, 163.5], [302.6, 110], [304, 143], [305.5, 160.5], [307, 163.5],
  [324.6, 164.5], [325.6, 111], [327, 121], [328, 150], [329.5, 163], [330.5, 163.5],
];
const PULSES = [66.7, 111.7, 136, 152.8, 172.8, 191.8, 212.8, 235.6, 258.6, 281.6, 302.6, 325.6];
const tOf = (u: number): number => (u - 111.5) / 18.07;
const T0 = -4.3, T1 = 12.6, V0 = 50, V1 = 200;
const CR_KA = 'trace redrawn from Kalaji et al. 2014, Photosynth Res, Fig. 4 · CC BY 4.0';

/** The trace in the box x0…x0+w, y0…y0+h, with pulse arrows above, the dark/actinic bar and the time axis below. */
function trace(p: string, x0: number, y0: number, w: number, h: number, o: { labels?: boolean; pulsesLabel?: boolean } = {}): string {
  const X = (t: number): number => x0 + ((t - T0) / (T1 - T0)) * w, Y = (v: number): number => y0 + ((v - V0) / (V1 - V0)) * h;
  const P = (u: number, v: number): Pt => [X(tOf(u)), Y(v)];
  const d = TRACE.map(([u, v], i) => `${i ? 'L' : 'M'}${f(X(tOf(u)))},${f(Y(v))}`).join('');
  const yb = y0 + h + 14, ya = yb + 30;
  const [fo, fm, fmp, fs] = [P(66, 196), P(66.5, 55), P(325.6, 111), P(330.5, 163.5)];
  const lab = o.labels === false ? '' : `
    ${T(fo[0] - 10, fo[1] + 8, F('o'), 'fx14-lv', 'end')}${T(fm[0] - 10, fm[1] + 10, F('m'), 'fx14-lv', 'end')}
    ${T(fmp[0] + 10, fmp[1] + 10, F('m', true), 'fx14-lv')}${T(fs[0] + 10, fs[1] + 8, F('s'), 'fx14-lv')}`;
  return `
    <path class="fx14-axis" d="M${x0},${y0 - 8} V${ya} H${x0 + w}"/>
    ${[0, 5, 10].map(t => `<path class="fx14-axis" d="M${f(X(t))},${ya} v6"/>${T(X(t), ya + 26, `${t}`, 'fx14-tk', 'middle')}`).join('')}
    ${T(X(4), ya + 52, 'time (min)', 'fx14-ax', 'middle')}${TV(x0 - 18, y0 + h / 2, 'fluorescence (a.u.)')}
    <rect x="${f(X(tOf(38)))}" y="${yb}" width="${f(X(0) - X(tOf(38)))}" height="20" fill="#141413"/>
    <rect x="${f(X(0))}" y="${yb}" width="${f(X(tOf(323)) - X(0))}" height="20" fill="#fffdf8" stroke="#141413" stroke-width="1.2"/>
    ${T((X(tOf(38)) + X(0)) / 2, yb + 15, 'dark', 'fx14-bt', 'middle').replace('class="fx14-bt"', 'class="fx14-bt" style="fill:#fffdf8"')}
    ${T((X(0) + X(tOf(323))) / 2, yb + 15, 'actinic light', 'fx14-bt', 'middle')}
    ${PULSES.map(u => `<path class="fx14-ar fx14-k-ink fx14-thin" d="M${f(X(tOf(u)))},${y0 - 40} V${y0 - 16}" marker-end="url(#${p}-ink)"/>`).join('')}
    ${o.pulsesLabel === false ? '' : T(X(tOf(PULSES[0])) - 14, y0 - 30, 'saturating pulses', 'fx14-l', 'end')}
    <path class="fx14-trace" d="${d}"/>
    ${lab}`;
}

/* ---------- PSII states (after E. Rosenqvist, slide 34): open, closed, quenched ---------- */

type St = 'o' | 'c' | 'q';
const QS = new Set([1, 3, 5, 9, 12, 15, 19, 21]); // quenched antenna in light (8 of 25), the same at Fm′ and Fs
const CS = new Set([0, 4, 7, 11, 14, 17, 22, 24]); // closed PSII at Fs (8 of 25)
const STATES: Record<string, (i: number) => St> = {
  o: () => 'o', m: () => 'c', mp: i => (QS.has(i) ? 'q' : 'c'), s: i => (QS.has(i) ? 'q' : CS.has(i) ? 'c' : 'o'),
};
function dot(st: St, x: number, y: number, r: number): string {
  const [fill, stroke] = st === 'o' ? ['#ffffff', '#c8361e'] : st === 'c' ? ['#c8361e', '#9e2814'] : ['#141413', '#141413'];
  return `<circle cx="${f(x)}" cy="${f(y)}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${st === 'o' ? 2.4 : 1}"/>`;
}
function grid(kind: string, cx: number, cy: number, n = 5, d = 27, r = 10): string {
  const s = STATES[kind];
  return Array.from({ length: n * n }, (_, i) => dot(s(i), cx + ((i % n) - (n - 1) / 2) * d, cy + (Math.floor(i / n) - (n - 1) / 2) * d, r)).join('');
}
const legend = (x: number, y: number, dy = 34): string => [
  ['o', 'open PSII (Q<tspan baseline-shift="sub" font-size="72%">A</tspan>)'], ['c', 'closed PSII (Q<tspan baseline-shift="sub" font-size="72%">A</tspan>⁻)'], ['q', 'quenched antenna (NPQ)'],
].map(([k, s], i) => `${dot(k as St, x, y + i * dy - 6, 10)}${T(x + 20, y + i * dy, s, 'fx14-l')}`).join('');

/* ---------- Guanter et al. 2014, Fig. 1 ---------- */

const GU: Img = { href: guanterJpg, w: 786, h: 422 };
const CR_GU = 'Guanter et al. 2014, PNAS, Fig. 1';
// colour bar x 360–757, y 364–378 in the image; its own labels are small, so in small placements they are masked and set again
const GU_LABELS: Mask[] = [[0, 352, 356, 422], [356, 352, 786, 362], [356, 380, 786, 422], [759, 352, 786, 422]];
function guanter(id: string, x: number, y: number, w: number, small: boolean): string {
  const a = shot(id, GU, x, y, w, { fig: true, masks: small ? GU_LABELS : [] });
  if (!small) return a.svg;
  const [l, yb] = a.at(360, 378), [r] = a.at(757, 0);
  return `${a.svg}${T(l, yb + 20, '0', 'fx14-tk', 'middle')}${T(r, yb + 20, '4.5', 'fx14-tk', 'middle')}
    ${T(l - 10, yb - 2, 'SIF', 'fx14-l', 'end')}${T((l + r) / 2, yb + 20, 'mW m⁻² sr⁻¹ nm⁻¹', 'fx14-l', 'middle')}`;
}
const CORN: Pt = [205, 92]; // the US Corn Belt, the highest SIF on land

/* ---------- the other images ---------- */

const TREE: Img = { href: treeJpg, w: 1552, h: 475 }; // Porcar-Castell Fig. 3a (x 0–748), 3b (758–1507), colour bar 1520–1548, y 5–465
const CR_TREE = 'Porcar-Castell et al. 2021, Nat Plants, Fig. 3a, b · © Springer Nature';
const FLEX: Img = { href: flexJpg, w: 1100, h: 941 };
const CR_FLEX = '© ESA–CNES–AVIO / Optique Vidéo du CSG – J. Georget';

/* ---------- variants ---------- */

/* a · the PAM trace large, the four levels named, the three formulas above */
function drawA(): string {
  const p = 'fx14a';
  return svg(p, 'A pulse-amplitude-modulated fluorescence trace of a leaf, redrawn from Kalaji and colleagues 2014. In the dark the leaf shows the minimum fluorescence Fo; a saturating pulse closes all PSII and gives the maximum Fm. In actinic light, pulses about every minute give Fm prime, which falls as NPQ develops, above the steady-state level Fs. Fv over Fm equals Fm minus Fo over Fm, about 0.83 in healthy leaves and lower under stress; PhiPSII equals Fm prime minus Fs over Fm prime; NPQ equals Fm minus Fm prime over Fm prime.', `
    ${pill(150, 30, FV_FM)}${badge(150, 70, '≈ 0.8 in healthy leaves, lower under stress')}
    ${pill(420, 30, PHI_EQ)}${pill(668, 30, NPQ_EQ)}
    ${trace(p, 90, 160, 660, 270)}
    ${credit(786, 594, CR_KA)}
  `);
}

/* b · the trace beside the PSII states that make each level */
function drawB(): string {
  const p = 'fx14b';
  const g = (kind: string, cx: number, cy: number, l: string): string => `${grid(kind, cx, cy, 4, 22, 8)}${T(cx + 46, cy + 9, l, 'fx14-lv')}`;
  return svg(p, 'Left: a PAM fluorescence trace redrawn from Kalaji and colleagues 2014, with the levels Fo, Fm, Fm prime and Fs. Right: the PSII population behind each level. At Fo all PSII are open; at Fm all are closed by the saturating pulse; at Fm prime in light all are closed but part of the antenna is quenched (NPQ); at Fs some are open, some closed, some quenched.', `
    ${trace(p, 74, 130, 380, 270, { pulsesLabel: false })}
    ${T(264, 60, 'saturating pulses', 'fx14-l', 'middle')}
    ${T(572, 60, 'dark', 'fx14-h', 'middle')}${T(706, 60, 'light', 'fx14-h', 'middle')}
    ${g('m', 572, 140, F('m'))}${g('mp', 706, 140, F('m', true))}${g('o', 572, 300, F('o'))}${g('s', 706, 300, F('s'))}
    ${legend(552, 430, 32)}
    ${credit(786, 594, CR_KA)}
  `);
}

/* c · the four PSII states with their conditions, the legend and the formulas */
function drawC(): string {
  const p = 'fx14c', c1 = 150, c2 = 380, r1 = 170, r2 = 380;
  const g = (kind: string, cx: number, cy: number, l: string, cond: string): string =>
    `${grid(kind, cx, cy)}${T(cx + 82, cy - 6, l, 'fx14-lv')}${T(cx, cy + 90, cond, 'fx14-l fx14-c-grey', 'middle')}`;
  return svg(p, 'Drawn after E. Rosenqvist: the PSII population at the four fluorescence levels. Dark-adapted with measuring light only, Fo: all PSII open. Dark-adapted with a saturating pulse, Fm: all closed. In actinic light, Fs: some open, some closed, some antenna quenched. In actinic light with a saturating pulse, Fm prime: all closed, the same antenna quenched. Fv over Fm equals Fm minus Fo over Fm; PhiPSII equals Fm prime minus Fs over Fm prime; NPQ equals Fm minus Fm prime over Fm prime.', `
    ${T(c1, 46, 'dark-adapted', 'fx14-h', 'middle')}${T(c2, 46, 'actinic light', 'fx14-h', 'middle')}
    ${g('m', c1, r1, F('m'), 'saturating pulse')}${g('mp', c2, r1, F('m', true), 'saturating pulse')}
    ${g('o', c1, r2, F('o'), 'measuring light')}${g('s', c2, r2, F('s'), 'steady state')}
    ${legend(552, 140, 40)}
    ${pill(660, 300, FV_FM)}${pill(660, 350, PHI_EQ)}${pill(660, 400, NPQ_EQ)}
    ${credit(786, 594, 'after E. Rosenqvist')}
  `);
}

/* d · Guanter Fig. 1 large */
function drawD(): string {
  const p = 'fx14d';
  const W = 770, s = W / GU.w, at = (u: number, v: number): Pt => [15 + u * s, 70 + v * s];
  return svg(p, 'Guanter and colleagues 2014, Figure 1: a world map of the maximum monthly sun-induced chlorophyll fluorescence (SIF) at 740 nanometres in 2009, from 0 to 4.5 milliwatts per square metre per steradian per nanometre. The highest values on land are in the US Corn Belt; deserts, ice and the boreal winter are near zero.', `
    ${guanter(`${p}-g`, 15, 70, W, false)}
    ${T(400, 40, 'maximum monthly SIF at 740 nm, 2009', 'fx14-h', 'middle')}
    ${pill(330, 140, 'US Corn Belt', at(...CORN), false)}
    ${credit(786, 594, CR_GU)}
  `);
}

/* e · the SIF image of two trees above the global map */
function drawE(): string {
  const p = 'fx14e', t = shot(`${p}-t`, TREE, 14, 14, 770);
  const [bx, by0] = t.at(1534, 5), [, by1] = t.at(1534, 465);
  return svg(p, 'Top: Porcar-Castell and colleagues 2021, Figure 3a and b: a photo of a red maple and a green oak beside a building, and the same scene imaged at 760 nanometres for SIF, from 0 to 3.8 milliwatts per square metre per nanometre per steradian; the oak fluoresces more than the maple. Bottom: Guanter and colleagues 2014, Figure 1: maximum monthly SIF from satellite across the globe in 2009, highest in the US Corn Belt.', `
    ${t.svg}
    ${pill(...t.at(250, 60), 'photo', undefined, false)}${pill(...t.at(1010, 60), 'SIF, 760 nm', undefined, false)}
    ${pill(...t.at(170, 300), 'maple', undefined, false)}${pill(...t.at(470, 300), 'oak', undefined, false)}
    ${T(bx - 22, by0 + 14, '3.8', 'fx14-tk', 'end').replace('class="fx14-tk"', 'class="fx14-tk" style="fill:#fffdf8"')}${T(bx - 22, by1, '0', 'fx14-tk', 'end').replace('class="fx14-tk"', 'class="fx14-tk" style="fill:#fffdf8"')}
    ${guanter(`${p}-g`, 14, 270, 500, true)}
    ${pill(640, 330, 'US Corn Belt', [14 + CORN[0] * (500 / GU.w), 270 + CORN[1] * (500 / GU.w)])}
    ${T(640, 400, 'satellite SIF, 740 nm', 'fx14-l', 'middle')}${T(640, 424, 'maximum monthly, 2009', 'fx14-l', 'middle')}
    ${credit(786, 578, CR_TREE)}${credit(786, 596, CR_GU)}
  `);
}

/* f · the PAM trace beside the global map */
function drawF(): string {
  const p = 'fx14f', s = 360 / GU.w;
  return svg(p, 'Left: a PAM fluorescence trace of a leaf redrawn from Kalaji and colleagues 2014, with Fo, Fm, Fm prime and Fs. Right: Guanter and colleagues 2014, Figure 1: sun-induced fluorescence at 740 nanometres measured from a satellite, maximum monthly values in 2009, highest in the US Corn Belt.', `
    ${T(214, 40, 'leaf: PAM fluorometer', 'fx14-h', 'middle')}${T(606, 40, 'globe: satellite SIF', 'fx14-h', 'middle')}
    ${trace(p, 66, 150, 296, 250, { pulsesLabel: false })}
    ${guanter(`${p}-g`, 426, 170, 360, true)}
    ${pill(560, 128, 'US Corn Belt', [426 + CORN[0] * s, 170 + CORN[1] * s])}
    ${credit(14, 578, CR_KA, 'start')}${credit(786, 596, `${CR_GU}, 740 nm, 2009`)}
  `);
}

/* g · the global map beside the FLEX launch */
function drawG(): string {
  const p = 'fx14g', fl = shot(`${p}-f`, FLEX, 14, 14, 300, { win: [300, 0, 504, 941], credit: '© ESA–CNES–AVIO' });
  const s = 460 / GU.w;
  return svg(p, 'Left: ESA photo of the Vega-C VV30 launch carrying the FLEX satellite, 15 September 2026, Kourou. Right: Guanter and colleagues 2014, Figure 1: maximum monthly sun-induced fluorescence at 740 nanometres in 2009 from satellite, highest in the US Corn Belt.', `
    ${fl.svg}
    ${pill(164, 46, 'FLEX launch, 15 Sep 2026', undefined, false)}
    ${T(560, 60, 'maximum monthly SIF, 740 nm, 2009', 'fx14-h', 'middle')}
    ${guanter(`${p}-g`, 330, 150, 460, true)}
    ${pill(430, 112, 'US Corn Belt', [330 + CORN[0] * s, 150 + CORN[1] * s])}
    ${credit(786, 578, `photo: ${CR_FLEX}`)}${credit(786, 596, CR_GU)}
  `);
}

const DRAW: Record<string, () => string> = { a: drawA, b: drawB, c: drawC, d: drawD, e: drawE, f: drawF, g: drawG };

export function draw(id: string): string {
  return (DRAW[id] ?? drawA)();
}

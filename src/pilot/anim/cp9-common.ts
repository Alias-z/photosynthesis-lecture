// Measuring leaf gas exchange (slide C9): the scenes the four stagings (cp9-a … cp9-d) share. Every figure scene IS a
// slide figure, drawn by figs/cp09.ts (draw('v1'), 'v4', 'v5', 'v6', 'v7'), its ids renamed for the stage and its parts
// tagged by their exact markup; the stagings move their own cameras through them.
// - The open system (C9 v1): the slide shows the lit leaf (CO₂ out < in, H₂O out > in). The story starts it in the dark:
//   lamp off, the chamber shaded, the sample analyser holding one more CO₂ than the reference and the CO₂ bar out above
//   the bar in ("rise: respiration"); the water bar out just above the bar in. Light on: lamp and rays, the slide's
//   molecules and bars, "drop: A". The end state is the slide figure.
// - The CO₂ path (C9 v7): the outside parts lit, the mesophyll dimmed, as on the slide. Its two pills (measured A, E;
//   calculated gₛ, Cᵢ) appear in the story; the overlays are the typical values under Cₐ and Cᵢ (420, 300 µmol mol⁻¹,
//   Busch et al. 2024, Table 1, as on C10) and the question mark at C_c.
// - Gaastra 1959: his title page (assets/anim/cp9/gaastra1959-title.png, page 1 of edepot 291215 at 220 dpi, crop x 80–1300,
//   y 135–668, ink made transparent) and his Fig. 1 (photos/cp-gaastra-irga.png, the slide's crop).
// - Readouts (staging C): the open system's two bar pairs, CO₂ and H₂O, in and out, drawn as on v1.
// Sources: assets/SOURCES-cp.md (append of the anim build).
import './cp9-common.css';
import gaTitle from '../../assets/anim/cp9/gaastra1959-title.png';
import gaIrga from '../../assets/photos/cp-gaastra-irga.png';
import { draw as c9 } from '../figs/cp09';
import { co2, h2o, pill, SYM } from '../figs/cp-kit';
import { cardSvg, clipping, f1, figInner, lerp, mark, pathLit, LIT, litMix, tw, wrap, type Setters } from './cp-stage';

/* ---------------------------------------------------------------- the open system, C9 v1 */

const BASE = 520; // the bars' axis in v1
const BARS = { co2In: 150, co2Light: 105, co2Dark: 162, h2oIn: 70, h2oLight: 140, h2oDark: 80 };
const SAMPLE_LIGHT = co2(574, 180, 9) + co2(628, 180, 9) + h2o(672, 176, 8) + h2o(672, 206, 8) + h2o(672, 236, 8);
const SAMPLE_DARK = co2(574, 180, 9) + co2(628, 180, 9) + co2(574, 214, 9) + co2(628, 214, 9) + co2(601, 245, 9) + h2o(672, 176, 8);

/** The slide's open system with the story's tags; sc prefixes its keys (a stage may hold two). */
export function sysSvg(P: string, sc: string): string {
  let s = figInner(c9('v1'), 'cp09v1', `${P}${sc}v1`);
  s = mark(s, '<rect class="fcp-lamp"', `${sc}-lamp`);
  // each mark takes the first unmarked ray (a marked tag no longer starts with the head)
  [0, 1, 2].forEach(i => { s = mark(s, '<path class="fcp-ar fcp-ar-grey"', `${sc}-ray${i}`); });
  s = mark(s, '<rect class="fcp-bar-co2"', `${sc}-bco2`);
  s = mark(s, '<rect class="fcp-bar-h2o"', `${sc}-bh2o`);
  s = mark(s, '<text class="fcp-h" x="230.0" y="452.0"', `${sc}-lA`);
  s = mark(s, '<text class="fcp-s" x="230.0" y="482.0"', `${sc}-lA2`);
  s = wrap(s, SAMPLE_LIGHT, `${sc}-mlight`);
  // the dark state's overlays: the chamber shaded, the sample analyser's molecules, the respiration label
  const over = `<rect data-k="${sc}-shade" class="cp9-shade" x="301" y="141" width="198" height="128" rx="11"/>
    <g data-k="${sc}-mdark">${SAMPLE_DARK}</g>
    <text data-k="${sc}-lR" class="fcp-h" x="230" y="452">rise: respiration</text>`;
  return `${cardSvg(`${P}${sc}`)}${s}${over}`;
}
/** Draws the open system between dark (0) and the slide's light (1). */
export function sysCtl(S: Setters, sc: string): (light: number) => void {
  const { q, set, op } = S;
  const lamp = q(`${sc}-lamp`), rays = [0, 1, 2].map(i => q(`${sc}-ray${i}`));
  const bco2 = q(`${sc}-bco2`), bh2o = q(`${sc}-bh2o`);
  const OFF = [207, 203, 191], ON = [244, 204, 79];
  return u => {
    const c = OFF.map((v, i) => Math.round(lerp(v, ON[i], u)));
    set(lamp, 'style', u >= 0.999 ? '' : `fill:rgb(${c.join(',')});stroke:${u < 0.5 ? '#a3a198' : '#b8902a'}`);
    rays.forEach(r => op(r, u));
    op(q(`${sc}-shade`), 1 - u);
    const hc = lerp(BARS.co2Dark, BARS.co2Light, u), hw = lerp(BARS.h2oDark, BARS.h2oLight, u);
    set(bco2, 'y', f1(BASE - hc)); set(bco2, 'height', f1(hc));
    set(bh2o, 'y', f1(BASE - hw)); set(bh2o, 'height', f1(hw));
    const sw = tw(u, 0.35, 0.75);
    op(q(`${sc}-mdark`), 1 - sw); op(q(`${sc}-mlight`), sw);
    op(q(`${sc}-lR`), 1 - sw); op(q(`${sc}-lA`), sw); op(q(`${sc}-lA2`), sw);
  };
}
/** Where the leaf's lower surface is in v1 (figure units): the dive into the leaf starts here. */
export const LEAF_PT: [number, number] = [400, 228];

/* ---------------------------------------------------------------- the CO₂ path, C9 v7 */

const { ci, gs, A, E } = SYM;
const PILL_M = pill(120, 50, `from the chamber: ${A}, ${E}`, { k: 'dark', big: true });
const PILL_C = pill(330, 98, `calculated: ${gs}, ${ci}`, { k: 'paper', big: true });
/** v7's pore, where the dive lands (top 150, bottom 476: the pore at y 313). */
export const PORE_PT: [number, number] = [259, 313];

export function pathSvg(P: string, sc: string): string {
  let s = figInner(c9('v7'), 'cp09v7', `${P}${sc}v7`);
  s = wrap(s, PILL_M, `${sc}-pm`);
  s = wrap(s, PILL_C, `${sc}-pc`);
  const over = `<g data-k="${sc}-vals"><text class="fcp-s" x="85" y="546" text-anchor="middle">430</text>
      <text class="fcp-s" x="376" y="546" text-anchor="middle">300</text><text class="fcp-s" x="780" y="546" text-anchor="end">ppm</text></g>
    <text data-k="${sc}-q" class="cp9-q" x="664" y="556" text-anchor="middle">?</text>`;
  return `${cardSvg(`${P}${sc}`)}<g data-k="${sc}-schema">${s}</g>${over}`;
}
export interface PathState { measured: number; calc: number; values: number; pulse: number; q: number }
/** Draws the path figure: its pills, the values, the mesophyll's pulse (0 → 1 → 0) and the question mark. */
export function pathCtl(S: Setters, sc: string): (o: PathState) => void {
  const { q, op } = S;
  const lit = pathLit(q(`${sc}-schema`), S);
  return o => {
    op(q(`${sc}-pm`), o.measured); op(q(`${sc}-pc`), o.calc); op(q(`${sc}-vals`), o.values); op(q(`${sc}-q`), o.q);
    lit(litMix(LIT.out, { ...LIT.out, me: 0.75 }, o.pulse), 1, { me: o.pulse * 0.6 });
  };
}

/* ---------------------------------------------------------------- other slide figures (v4, v5, v6) as cards */

export function figCard(P: string, sc: string, id: 'v4' | 'v5' | 'v6'): string {
  return `${cardSvg(`${P}${sc}`)}${figInner(c9(id), `cp09${id}`, `${P}${sc}${id}`)}`;
}

/* ---------------------------------------------------------------- Gaastra 1959: title page and Fig. 1 */

export const GA_TITLE_AR = 399 / 915, GA_FIG1_AR = 328 / 955;
export const gaTitleClip = (P: string, k: string, x: number, y: number, w: number, rot = -1.2): string =>
  clipping(P, k, gaTitle, x, y, w, GA_TITLE_AR, { rot, seed: 31, under: 'Gaastra 1959, title page' });
export const gaFig1Clip = (P: string, k: string, x: number, y: number, w: number, rot = 1.4): string =>
  clipping(P, k, gaIrga, x, y, w, GA_FIG1_AR, { rot, seed: 37, mult: true, under: 'his infrared CO₂ analyser, Fig. 1' });

/* ---------------------------------------------------------------- readouts: CO₂ and H₂O before and after the leaf */

/** A readout card in stage units at x, y (420 × 300): CO₂ and H₂O bars, before (in) and after (out) the leaf. */
export function readoutSvg(k: string, x: number, y: number): string {
  const pair = (x0: number, lab: string, cls: string, kk: string): string => `
    <text class="${cls}" x="${x0 + 75}" y="${y + 58}" text-anchor="middle">${lab}</text>
    <rect class="cps-bar-in" data-k="${k}-${kk}i" x="${x0 + 10}" y="0" width="56" height="0" rx="3"/>
    <rect class="cps-bar-${kk}" data-k="${k}-${kk}o" x="${x0 + 84}" y="0" width="56" height="0" rx="3"/>
    <path class="cps-axis" d="M${x0},${y + 250} H${x0 + 150}"/>
    <text class="cps-sub" x="${x0 + 38}" y="${y + 280}" text-anchor="middle">in</text><text class="cps-sub" x="${x0 + 112}" y="${y + 280}" text-anchor="middle">out</text>`;
  return `<g data-k="${k}" opacity="0"><rect class="cps-rcard" x="${x}" y="${y}" width="420" height="300" rx="16"/>
    ${pair(x + 40, 'CO₂', 'cps-c', 'co2')}${pair(x + 230, 'H₂O', 'cps-w', 'h2o')}</g>`;
}
/** The readout's bars: in at the slide's heights (scaled 0.95), out between 'no leaf' (= in) and the slide's light values. */
export function readoutCtl(S: Setters, k: string, y: number): (leaf: number) => void {
  const { q, set } = S;
  const bar = (kk: string, h: number): void => { const el = q(`${k}-${kk}`); set(el, 'y', f1(y + 250 - h)); set(el, 'height', f1(h)); };
  return u => {
    bar('co2i', BARS.co2In * 1.2); bar('h2oi', BARS.h2oIn * 1.2);
    bar('co2o', lerp(BARS.co2In, BARS.co2Light, u) * 1.2); bar('h2oo', lerp(BARS.h2oIn, BARS.h2oLight, u) * 1.2);
  };
}

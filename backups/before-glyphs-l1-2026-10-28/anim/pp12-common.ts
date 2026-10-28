// Slide 12 · Photoprotection and repair, stagings A and B (beats PP12 of beats-pp.ts): the story both share; A and B
// differ in the camera and the chain's look. The stage IS the slide 12 chain figure: focusSvg() of figs/chain.ts with
// photosystem II, its light, the H⁺ from water, the H⁺ released at cytochrome b₆f and the lumen H⁺ lit (LIT12 of
// figs/pp12f.ts, as figures v1 and v2 draw it), in the slide's figure card. A readout is on screen from the start, with
// three gauges and no numbers: light (weak–strong), lumen pH (high–low), heat dissipation, NPQ (off–on).
// - Beat 1 (opens on the slide figure; one click): strong light (three more light waves); H⁺ pile up in the lumen one by
//   one; the lumen pH gauge falls.
// - Beat 2: the camera goes to the antenna of photosystem II (A: zoom; B: a close-up window out of a map of the chain).
//   Two lumen H⁺ bind PsbS; violaxanthin turns into zeaxanthin; heat waves leave the antenna; the fluorescence dims; the
//   NPQ gauge goes on.
// - Beat 3: a clipping of Li et al. 2000, Fig. 1c (NPQ image of Arabidopsis), the row without PsbS ringed.
// - Beat 4: back to the whole chain; singlet O₂ marks D1 (damage). Hold. A repair card: damaged D1 removed → new D1
//   inserted → photosystem II works again; the mark turns into a new D1.
// - Beat 5: a cloud passes over photosystem II: the light falls, the lumen H⁺ leave (pH gauge back to high), but
//   zeaxanthin and the heat stay (the NPQ gauge stays on); a clipping of the VPZ tobacco field trial (Kromdijk et al.
//   2016, Fig. 5D) with "≈ 15 % more dry weight".
import './pp12-common.css';
import type { FocusLook, Part } from '../figs/chain';
import { xan } from '../figs/pp-kit';
import liCJpg from '../../assets/photos/13-li-c.jpg';
import kr5dJpg from '../../assets/photos/13-kromdijk-5d.jpg';
import {
  box, burst, chainGroup, counterScaler, cutPath, drawWindow, f1, fade, glyph, kOf, lab, lerp, lerpV, markers, mv, o2, partsIn,
  pulse, putter, setters, slideCard, stroke, taggedChain, tfStr, tween, view, waveArrow, WHOLE, windowSvg,
  type Pic, type Setters, type Tf, type V, type WinLayout,
} from './pp-stage';
import type { Staging } from './types';

/** Lit on the slide (figs/pp12f.ts LIT12). */
export const LIT12: Part[] = ['psii', 'light-psii', 'h-water', 'pq-h-out', 'h-lumen'];

/* ---------------------------------------------------------------- geometry (figure units) */

/** Violaxanthin / zeaxanthin in the antenna at the left end of photosystem II; PsbS under it, at the lumen side. */
export const XAN: V = [50, 298], PSBS: V = [50, 318];
/** Where two lumen H⁺ bind PsbS. */
export const SITES: V[] = [[36, 331], [64, 332]];
/** H⁺ that pile up in the lumen (the first two later bind PsbS). */
export const MORE: V[] = [[100, 396], [126, 404], [152, 396], [176, 412], [258, 426], [282, 402], [332, 396], [348, 414], [318, 430],
  [196, 432], [232, 436], [282, 440]];
export const HEAT: Array<[V, V]> = [[[28, 262], [-16, 206]], [[52, 259], [18, 198]]];
export const FLUO: [V, V] = [[178, 261], [198, 200]];
export const LIGHT: Array<[V, V]> = [[[106, 198], [110, 254]], [[132, 196], [132, 255]], [[158, 200], [152, 256]]];
export const D1: V = [128, 300];
export const LAB = {
  heat: [-50, 236] as V, fluo: [206, 208] as V, xan: [-50, 296] as V, psbs: [-50, 328] as V, ant: [-50, 264] as V,
  name: [112, 406] as V, stroma: [430, 204] as V, lumen: [430, 404] as V, light: [96, 200] as V,
};
/** The cloud of beat 5 drifts in over photosystem II's light. */
export const CLOUD0: V = [-150, 96], CLOUD1: V = [86, 96];

/* ---------------------------------------------------------------- timing (s into each beat) */

const B1 = { light: 0.1, lightD: 0.5, h0: 0.45, hDt: 0.14, end: 2.4 };
const B2 = { cam: 0.05, camD: 1.1, labs: 0.95, bind: 1.25, bindD: 0.7, conv: 1.95, convD: 0.4, heat: 2.15, end: 2.8 };
const B3 = { card: 0, ring: 0.25, end: 0.5 };
const B4 = { cardOut: 0, labsOut: 0.05, cam: 0.1, camD: 1.2, so: 1.3, hit: 1.45, hitD: 0.45, dmg: 1.9, hold: 2.2, rcard: 2.25, swap: 2.55, swapD: 0.35, end: 3.0 };
const B5 = { cardOut: 0, cloud: 0.1, cloudD: 1.1, lightOut: 0.6, hOut: 0.9, hDt: 0.06, kcard: 1.9, end: 2.3 };
const TEND = [B1.end, B2.end, B3.end, B4.end, B5.end];

/* ---------------------------------------------------------------- drawn parts */

/** A cloud, drawn round its origin (about 150 × 60). */
export const cloud = (): string =>
  `<path class="pp12-cloud" d="M-70,22 C-92,22 -94,-6 -70,-8 C-70,-30 -40,-38 -24,-22 C-14,-46 26,-44 30,-16 C48,-30 78,-18 70,4 C92,6 90,22 72,22 Z"/>`;
/** H⁺ in the chain's style, drawn round the origin. */
export const hDot = (r = 6.5): string => `<circle class="chn-hd" r="${r}"/>`;

/* ---------------------------------------------------------------- the gauges (stage units) */

export interface Gauge { x: number; y: number; w: number; compact?: boolean }
const ROWS: Array<[string, string, string, string]> = [['light', 'weak', 'strong', 'amber'], ['lumen pH', 'high', 'low', 'red'], ['heat dissipation (NPQ)', 'off', 'on', 'grey']];
const rowH = (g: Gauge): number => (g.compact ? 84 : 96);
export function gaugeSvg(p: string, g: Gauge): string {
  const x0 = g.x + 18, iw = g.w - 36, dy = rowH(g);
  const rows = ROWS.map(([s, lo, hi, c], i) => {
    const y = g.y + 14 + i * dy;
    return `${lab(s, 'ppa-t', x0, y + 24)}
      <rect class="ppa-bar-bg" x="${x0}" y="${y + 36}" width="${iw}" height="18" rx="5"/><rect data-k="g${i}" class="pp12-bar-${c}" x="${x0}" y="${y + 36}" width="0" height="18" rx="5"/>
      ${lab(lo, 'pp12-s', x0, y + 76)}${lab(hi, 'pp12-s', x0 + iw, y + 76, 'end')}`;
  }).join('');
  return box(p, g.x, g.y, g.w, 3 * dy + 14, rows, 'gauge');
}
/** Sets the three gauges (0–1): light, acidity of the lumen, NPQ. */
export function drawGauges(S: Setters, g: Gauge, v: [number, number, number]): void {
  const iw = g.w - 36;
  v.forEach((x, i) => S.set(S.q(`g${i}`), 'width', f1(Math.max(0, Math.min(1, x)) * iw)));
}

/* ---------------------------------------------------------------- cards (stage units) */

/** A newsprint card: a picture with a headline above and lines below (stage units), hidden until shown. */
export function card(p: string, k: string, x: number, y: number, w: number, pic: Pic | null, o: {
  head?: string; lines?: Array<[string, string]>; credit?: string; rot?: number; seed?: number; picW?: number; side?: (at: (u: number, v: number) => V, px: number, pw: number) => string;
  ph?: number;
} = {}): { svg: string; h: number; at: (u: number, v: number) => V } {
  const m = 20, head = o.head ? 40 : 0, pw = pic ? (o.picW ?? w - 2 * m) : 0, sc = pic ? pw / pic.w : 1;
  const ph = pic ? pic.h * sc : (o.ph ?? 0);
  const lines = o.lines ?? [], lh = lines.length * 30, cred = o.credit ? 24 : 0;
  const h = m + head + ph + (lines.length ? 14 + lh : 0) + cred + m;
  const px = x + m, py = y + m + head;
  const at = (u: number, v: number): V => [px + u * sc, py + v * sc];
  const rot = o.rot ?? -1.2;
  return {
    h, at,
    svg: `<g data-k="${k}" opacity="0" display="none"><g transform="rotate(${rot} ${f1(x + w / 2)} ${f1(y + h / 2)})">
      <defs><filter id="${p}-${k}-sh" x="-10%" y="-8%" width="120%" height="118%"><feDropShadow dx="1" dy="4" stdDeviation="6" flood-color="#3d3020" flood-opacity=".22"/></filter></defs>
      <path class="clip-paper" d="${cutPath(x, y, w, h, o.seed ?? 41, 3.2)}" filter="url(#${p}-${k}-sh)"/>
      ${o.head ? `<text class="clip-name ppa-head" x="${f1(px)}" y="${f1(y + m + 26)}">${o.head}</text>` : ''}
      ${pic ? `<image href="${pic.href}" x="${f1(px)}" y="${f1(py)}" width="${f1(pw)}" height="${f1(ph)}" preserveAspectRatio="none"/>` : ''}
      ${o.side ? o.side(at, px, pw) : ''}
      ${lines.map(([s, cls], i) => `<text class="${cls}" x="${f1(px)}" y="${f1(py + ph + 14 + 22 + i * 30)}">${s}</text>`).join('')}
      ${o.credit ? `<text class="ppa-cr" x="${f1(x + w - m)}" y="${f1(y + h - m + 4)}" text-anchor="end">${o.credit}</text>` : ''}</g></g>`,
  };
}

export const LI_C: Pic = { href: liCJpg, w: 328, h: 333 };
export const KR_5D: Pic = { href: kr5dJpg, w: 282, h: 250 };
/** Li et al. 2000, Fig. 1c: the four rows of plants (image rows, px) and their names. */
export const LI_ROWS: Array<[number, string]> = [[48, 'wild type'], [130, 'no PsbS (<tspan class="ppa-i">npq4</tspan>)'], [205, '<tspan class="ppa-i">npq4</tspan> + empty vector'], [290, '<tspan class="ppa-i">npq4</tspan> + PsbS gene']];
/** The Li clipping: picture left, row names right, the npq4 row ringed (glyph `${k}-ring`). */
export function liCard(p: string, k: string, x: number, y: number, w: number, picW: number): string {
  const c = card(p, k, x, y, w, LI_C, {
    head: 'Nature, 2000', picW, credit: 'Li et al. 2000, Nature 403: 391, Fig. 1c', seed: 23,
    lines: [['NPQ image: purple = low NPQ', 'pp12-s']],
    side: (at, px, pw) => LI_ROWS.map(([v, s]) => `<text class="ppa-l" x="${f1(px + pw + 16)}" y="${f1(at(0, v)[1] + 7)}">${s}</text>`).join('')
      + `<rect data-k="${k}-ring" class="pp12-ring" x="${f1(px - 6)}" y="${f1(at(0, 92)[1])}" width="${f1(w - 28)}" height="${f1(at(0, 170)[1] - at(0, 92)[1])}" rx="10" opacity="0" display="none"/>`,
  });
  return c.svg;
}
/** The Kromdijk clipping: the aerial photo of the field trial, two lines under it. */
export function fieldCard(p: string, k: string, x: number, y: number, w: number): string {
  return card(p, k, x, y, w, KR_5D, {
    head: 'Science, 2016', seed: 57, rot: 1.1,
    lines: [['tobacco field trial, Illinois', 'pp12-s'], ['faster NPQ relaxation:', 'ppa-l pp12-green'], ['≈ 15 % more dry weight', 'ppa-l pp12-green']],
    credit: 'Kromdijk et al. 2016, Science, Fig. 5D',
  }).svg;
}
/** The repair card (as figure v3 of pp12f.ts): three steps. */
export function repairCard(p: string, k: string, x: number, y: number, w: number): string {
  const cx = x + w / 2;
  return `<g data-k="${k}" opacity="0" display="none">${box(p, x, y, w, 330, `
    ${lab('D1 repair', 'ppa-big', cx, y + 52, 'middle')}
    ${lab('damaged D1', 'ppa-l ppa-red', cx, y + 104, 'middle')}${lab('removed', 'ppa-l ppa-red', cx, y + 128, 'middle')}
    <path class="ppa-axis" d="M${cx},${y + 142}V${y + 172}"/><path d="M${cx - 6},${y + 166}L${cx},${y + 176}L${cx + 6},${y + 166}" fill="none" stroke="#6b6a64" stroke-width="1.6"/>
    ${lab('new D1', 'ppa-l ppa-green', cx, y + 202, 'middle')}${lab('inserted', 'ppa-l ppa-green', cx, y + 226, 'middle')}
    <path class="ppa-axis" d="M${cx},${y + 240}V${y + 270}"/><path d="M${cx - 6},${y + 264}L${cx},${y + 274}L${cx + 6},${y + 264}" fill="none" stroke="#6b6a64" stroke-width="1.6"/>
    ${lab('photosystem II', 'ppa-l', cx, y + 298, 'middle')}${lab('works again', 'ppa-l', cx, y + 320, 'middle')}`, `${k}b`)}</g>`;
}

/* ---------------------------------------------------------------- the story overlay (figure units) */

/** The story's glyphs; `pre` prefixes their keys, so that B can draw a second copy on the map. */
export function storySvg(p: string, pre = ''): string {
  const g = (k: string, inner: string): string => glyph(`${pre}${k}`, inner);
  return `${markers(p)}
    ${LIGHT.map(([a, b], i) => waveArrow(p, `${pre}li${i}`, 'amber', a, b, 6, 3)).join('')}
    ${HEAT.map(([a, b], i) => waveArrow(p, `${pre}heat${i}`, 'grey', a, b, 6, 3.5)).join('')}
    ${waveArrow(p, `${pre}fluo`, 'red', FLUO[0], FLUO[1], 6, 4)}
    ${g('xv', xan(-31, 0, 40, 'v', 7))}${g('xz', xan(-31, 0, 40, 'z', 7))}
    ${g('psbs', '<ellipse class="pp-psbs" rx="21" ry="9"/>')}
    ${MORE.map((_, i) => g(`h${i}`, hDot())).join('')}
    ${g('l-heat', lab('heat', 'ppa-l ppa-grey ppa-halo', 0, 0))}
    ${g('l-fluo', lab('fluorescence', 'ppa-l ppa-red ppa-halo', 0, 0))}
    ${g('l-xv', lab('violaxanthin', 'ppa-l pp12-violet ppa-halo', 0, 0))}${g('l-xz', lab('zeaxanthin', 'ppa-l ppa-orange ppa-halo', 0, 0))}
    ${g('l-psbs', lab('PsbS', 'ppa-l ppa-halo', 0, 0))}${g('l-ant', lab('antenna', 'ppa-l ppa-halo', 0, 0))}
    ${g('l-name', lab('photosystem II', 'ppa-l ppa-halo', 0, 0, 'middle'))}${g('l-light', lab('light', 'ppa-l ppa-amber ppa-halo', 0, 0, 'end'))}
    ${g('l-stroma', lab('stroma', 'chn-zone', 0, 0, 'end'))}${g('l-lumen', lab('lumen', 'chn-zone', 0, 0, 'end'))}
    ${g('so', `<circle r="20" fill="url(#${p}-sog)"/>${o2(6)}`)}${g('l-so', lab('singlet O₂', 'ppa-l ppa-clay ppa-halo', 0, 0, 'middle'))}
    ${g('flash', `<circle r="30" fill="url(#${p}-sog)"/>`)}
    ${g('dmg', burst(18, 9))}${g('newd1', '<circle class="pp12-newd1" r="12"/>')}
    ${g('cloud', cloud())}${g('l-cloud', lab('cloud', 'ppa-s', 0, 0, 'middle'))}
    <defs><radialGradient id="${p}-sog"><stop offset="0" stop-color="#f6b8a4"/><stop offset="1" stop-color="#e2553a" stop-opacity="0"/></radialGradient></defs>`;
}


/** The story's state at one frame (0–1 values unless named otherwise). */
export interface StoryState {
  /** strong light; the cloud's way across and its opacity */
  strong: number; cl: number; clOn: number;
  /** the lumen H⁺: place, growth and opacity */
  dots: Array<{ p: V; u: number; o: number }>;
  /** zeaxanthin made; heat waves; fluorescence shown; close-view labels */
  conv: number; heat: number; fl: number; lb: number;
  /** singlet O₂ on its way to D1; the flash; the damage mark; the new D1 */
  soOn: number; hit: number; flash: number; dmg: number; swap: number;
}
/** Draws one copy of the story (storySvg with key prefix pre): text and dot scale kk, opacity factor r. */
export function drawStory(S: Setters, put0: ReturnType<typeof putter>, st: StoryState, pre: string, kk: number, r: number): void {
  const put = (key: string, at: V, sc: number, op: number): void => put0(`${pre}${key}`, at, sc, op * r);
  const str = (key: string, w: number, op: number): void => stroke(S, `${pre}${key}`, w, op * r);
  const { strong, cl, clOn, dots, conv, heat, fl, lb, soOn, hit, flash, dmg, swap } = st;
  LIGHT.forEach((_, i) => str(`li${i}`, 3.4, Math.max(0, Math.min(1, strong * 3 - i))));
  put('cloud', lerpV(CLOUD0, CLOUD1, cl), 1, clOn);
  put('l-cloud', lerpV([CLOUD0[0], CLOUD0[1] + 7], [CLOUD1[0], CLOUD1[1] + 7], cl), 1, clOn);
  dots.forEach((d, i) => put(`h${i}`, d.p, kk * lerp(0.5, 1, d.u), d.o));
  put('psbs', PSBS, 1, 1);
  put('xv', XAN, 1, 1 - conv);
  put('xz', XAN, 1, conv);
  HEAT.forEach((_, i) => str(`heat${i}`, 4, heat));
  str('fluo', lerp(4.5, 2, conv), fl * lerp(1, 0.3, conv));
  put('l-heat', LAB.heat, kk, lb * heat);
  put('l-fluo', LAB.fluo, kk, lb);
  put('l-xv', LAB.xan, kk, lb * (1 - conv));
  put('l-xz', LAB.xan, kk, lb * conv);
  put('l-psbs', LAB.psbs, kk, lb);
  put('l-ant', LAB.ant, kk, lb);
  put('l-name', LAB.name, kk, lb);
  put('l-light', LAB.light, kk, lb);
  put('l-stroma', LAB.stroma, kk, lb);
  put('l-lumen', LAB.lumen, kk, lb);
  put('so', lerpV([D1[0] - 46, D1[1] - 40], D1, hit), 1, soOn);
  put('l-so', [D1[0] - 46, D1[1] - 60], kk, soOn);
  put('flash', D1, 1, flash);
  put('dmg', D1, lerp(0.4, 1, dmg), dmg * (1 - swap));
  put('newd1', D1, 1, swap);
}

/* ---------------------------------------------------------------- the staging */

export interface Opt { id: string; name: string; note: string; look: FocusLook; camera: 'dive' | 'window' }

/** Close view of the dive (A): the antenna end of photosystem II. */
export const Z: Tf = view([192, 302], 3.2);
/** Window camera (B). */
const WIN: WinLayout = { map: { s: 0.3, t: [18 + 43.3 * 0.3, 16 + 30.9 * 0.3] }, win: [-66, 182, 510, 280.5], R: [304, 16, 1280, 704] };
const G_DIVE: Gauge = { x: 1282, y: 22, w: 306 }, G_WIN: Gauge = { x: 18, y: 230, w: 278, compact: true };

export function makeStaging(o: Opt): Staging {
  const P = `pp12${o.id}`, win = o.camera === 'window';
  const G = win ? G_WIN : G_DIVE;
  const chainA = taggedChain(`${P}a`, o.look, LIT12);
  const chainB = win ? taggedChain(`${P}b`, o.look, LIT12) : '';
  // cards: A keeps the right edge for the gauges, so its whole-view cards go left; B keeps the left column
  const liX = win ? 1010 : 700, sideX = win ? 1294 : 14;
  return {
    id: o.id,
    name: o.name,
    note: o.note,
    holds: [[0], [], [], [B4.hold]],
    svg: () => `${win
      ? `<g data-k="map"><g class="fig">${slideCard(P)}${chainGroup('chainA', o.look, chainA)}<g data-k="mres">${storySvg(`${P}r`, 'r-')}</g></g></g>
        ${windowSvg(P, `${chainGroup('chainB', o.look, chainB)}${storySvg(P)}`)}`
      : `<g data-k="cam"><g class="fig">${slideCard(P)}${chainGroup('chainA', o.look, chainA)}${storySvg(P)}</g></g>`}
      ${gaugeSvg(P, G)}
      ${liCard(P, 'li', liX, 96, 566, 290)}
      ${repairCard(P, 'rep', sideX, 160, 292)}
      ${fieldCard(P, 'kr', sideX, 120, 292)}`,

    bind(stage) {
      const S = setters(stage), { q } = S, put0 = putter(S);
      const gA = q('chainA'), gB = win ? q('chainB') : gA;
      const csA = counterScaler(gA, S), csB = win ? counterScaler(gB, S) : csA;
      /** The slide's dimmed H⁺ uptake at photosystem II crosses the close view's light and fluorescence: hidden there. */
      const uptake = partsIn(gB, 'pq-h-in');
      let last = '';
      return (beatIn, t) => {
        const b = Math.max(0, Math.min(4, Math.round(beatIn)));
        const tt = Math.max(0, Math.min(t, TEND[b]));
        const key = `${b}:${tt.toFixed(3)}`;
        if (key === last) return;
        last = key;
        const T = (n: number): number => (b === n ? tt : b > n ? 99 : -1);
        const t1 = T(0), t2 = T(1), t4 = T(3), t5 = T(4);

        /* ---- camera: in with beat 2, out with beat 4 */
        const e = mv(t2, B2.cam, B2.camD) * (1 - mv(t4, B4.cam, B4.camD));
        let k: number;
        if (win) {
          const v = drawWindow(S, WIN, e, q('map'));
          csA(1, 1 - Math.min(1, e * 1.6));
          k = kOf(v.inner.s);
          csB(k);
        } else {
          const cam = tween(WHOLE, Z, e);
          S.set(q('cam'), 'transform', tfStr(cam));
          k = kOf(cam.s);
          csA(k);
        }
        const close = b === 1 || b === 2 ? 1 : b === 3 ? 1 - fade(tt, B4.labsOut, 0.3) : 0;
        const away = b === 1 ? 1 - fade(tt, B2.cam, 0.3) : b === 2 ? 0 : b === 3 ? fade(tt, B4.cam + B4.camD - 0.3, 0.3) : 1;
        uptake.forEach(g => S.op(g, away));

        /* ---- the story's state */
        const strong = fade(t1, B1.light, B1.lightD) * (1 - fade(t5, B5.lightOut, 0.5));
        const cl = mv(t5, B5.cloud, B5.cloudD), clOn = b === 4 ? fade(tt, B5.cloud, 0.2) : 0;
        const bind = mv(t2, B2.bind, B2.bindD), conv = mv(t2, B2.conv, B2.convD);
        const heat = fade(t2, B2.heat, 0.3), fl = fade(t2, B2.labs - 0.1, 0.3) * close;
        const lb = fade(t2, B2.labs, 0.25) * close;
        const soOn = fade(t4, B4.so, 0.12) * (1 - fade(t4, B4.dmg, 0.1)), dmg = fade(t4, B4.dmg, 0.12), swap = mv(t4, B4.swap, B4.swapD);
        let acid = 0;
        const dots = MORE.map((at, i) => {
          const u = fade(t1, B1.h0 + i * B1.hDt, 0.15), out = fade(t5, B5.hOut + i * B5.hDt, 0.25);
          acid += u * (1 - out);
          return { p: (i < 2 ? lerpV(at, SITES[i], bind) : at) as V, u, o: u * (1 - out) };
        });
        acid /= MORE.length;
        const npq = conv * (1 - 0.15 * fade(t5, B5.hOut, 1.2));
        drawGauges(S, G, [0.08 + 0.87 * strong, acid, npq]);

        const st: StoryState = { strong, cl, clOn, dots, conv, heat, fl, lb, soOn, hit: mv(t4, B4.hit, B4.hitD), flash: pulse(t4, B4.dmg), dmg, swap };
        const story = (pre: string, kk: number, r: number): void => drawStory(S, put0, st, pre, kk, r);
        story('', k, 1);
        if (win) story('r-', 1, 1 - Math.min(1, e * 3));

        /* ---- cards */
        S.op(q('li'), b === 2 ? fade(tt, B3.card, 0.15) : 0);
        S.op(q('li-ring'), b === 2 ? fade(tt, B3.ring, 0.15) : 0);
        S.op(q('rep'), b === 3 ? fade(tt, B4.rcard, 0.15) : 0);
        S.op(q('kr'), b === 4 ? fade(tt, B5.kcard, 0.15) : 0);
      };
    },
  };
}

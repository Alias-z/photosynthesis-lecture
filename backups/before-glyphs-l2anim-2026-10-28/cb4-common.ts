// C4 animation, "Sucrose and starch" (beats CB4 in beats-cb.ts): the pieces every staging (cb4-a … cb4-c) shares.
// - Slide C4's figures, exactly (figs/cb04.ts draw(id)): v7 (the wheel with its exit lit, split into sucrose and
//   starch), v5 (a mesophyll cell by day), v8 (the translocator), v4 (TEMs pinned to the starch curve), v2 (Graf et al.
//   2010 Fig. 1A redrawn, with the early night), v1 (the published graph).
// - The cell's motion (v5 geometry): one triose phosphate goes out through the translocator while one Pᵢ comes in;
//   sucrose leaves for the whole plant; the starch granule grows (Sharkey 2024 Fig. 1, redrawn; Smith & Stitt 2007).
// - The starch curve: Graf et al. 2010 Fig. 1A, read off the figure (cb-common GRAF_CTRL, GRAF_EARLY), drawn on as the
//   clock runs; the granule in the cell grows and shrinks with it. Arabidopsis rosettes, 12 h light / 12 h dark, and
//   the night begun after 8 h.
// - The bridge to C5 on v7's wheel: its carboxylation arc lights, "Rubisco" is named, a CO₂ and an O₂ (atom balls)
//   approach; the O₂ reaches the arc (Bowes, Ogren & Hageman 1971: Rubisco is also an oxygenase).
import { draw as drawC4 } from '../figs/cb04';
import { ar, arcD, axes, defs as figDefs, GRAF_CTRL, GRAF_EARLY, series, X, Y, type Axes } from '../figs/cb-common';
import strebJpg from '../../assets/photos/c4-streb.jpg';
import grafJpg from '../../assets/photos/c4-graf.jpg';
import {
  type Api, bezPath, co2Ball, crow, f1, figInner, hide, type Img, type Item, type Key, o2Ball, onFig, pill, show, T, type V, win,
} from './cb-kit';

export const STREB: Img = { href: strebJpg, w: 394, h: 323 };
export const GRAF: Img = { href: grafJpg, w: 533, h: 395 };
export const WIN_C: [number, number, number, number] = [0, 46, 195, 277];
export const WIN_G: [number, number, number, number] = [200, 46, 194, 277];
export const CR_STREB = 'Streb & Zeeman 2012, The Arabidopsis Book 10:e0160, Fig. 4 C, G · © ASPB';
export const CR_GRAF = 'Graf, Schlereth, Stitt & Smith 2010, PNAS 107:9458, Fig. 1A · © National Academy of Sciences';
export const CR_GRAFR = 'Redrawn from Graf et al. 2010, PNAS 107:9458, Fig. 1A (Arabidopsis)';

/** Slide C4's figure, ids prefixed p. */
export const slideC4 = (p: string, v: string): string => figInner(drawC4(v), `fcb4${v}`, p);
const xy = (q: V): { x: number; y: number } => ({ x: q[0], y: q[1] });

/** Starch (mg g⁻¹) at hour h on one of Graf's curves (linear between the read points). */
export function starchAt(curve: Array<[number, number]>, h: number): number {
  if (h <= curve[0][0]) return curve[0][1];
  for (let i = 1; i < curve.length; i++) {
    const [h1, s1] = curve[i], [h0, s0] = curve[i - 1];
    if (h <= h1) return s0 + ((s1 - s0) * (h - h0)) / (h1 - h0);
  }
  return curve[curve.length - 1][1];
}

/* ---------------------------------------------------------------- the cell (v5 geometry, figure units) */

/** A triose phosphate as a token: three carbons and a phosphate, centred on the origin. */
export const tpTok = (sc: number): string =>
  `<g transform="scale(${sc.toFixed(3)})">${crow('ccc', 13, 2)}<circle cx="31" cy="0" r="8" fill="#f6dfd6" stroke="#c8361e" stroke-width="1.4"/>${T(31, 4, 'P', 'cbk-s', 'middle', ' style="font-size:10px;font-weight:700"')}</g>`;
export const piTok = (sc: number): string =>
  `<g transform="scale(${sc.toFixed(3)})"><circle r="11" fill="#f6dfd6" stroke="#c8361e" stroke-width="1.6"/>${T(0, 4.5, 'Pᵢ', 'cbk-s', 'middle', ' style="font-size:12px;font-weight:700"')}</g>`;

/** The cell's motion on v5 (place: figure → layer), from G0: a triose phosphate out through the translocator while a Pᵢ
 *  comes in; sucrose leaves for the whole plant. ≈ 2.4 s. */
export function cellItems(k: string, place: (q: V) => V, sc: number, G0: number): Item[] {
  const P = (q: V): V => place(q);
  const tpPath = (u: number): V => P(u < 0.5 ? [276 + (420 - 276) * u / 0.5, 300 - 8 * (u / 0.5)] : [440 + (630 - 440) * (u - 0.5) / 0.5, 292]);
  const piPath = (u: number): V => P([640 - (640 - 470) * u, 322]);
  const sucPath = (u: number): V => P([700, 310 + 130 * u]);
  return [
    { k: `${k}-tp`, svg: tpTok(1.1 * sc), keys: [{ ...xy(tpPath(0)), o: 0 }, show(G0, 0.15), { at: G0, d: 1.4, path: tpPath }, hide(G0 + 1.45, 0.2)] },
    { k: `${k}-pi`, svg: piTok(1.1 * sc), keys: [{ ...xy(piPath(0)), o: 0 }, show(G0 + 0.7, 0.15), { at: G0 + 0.7, d: 0.8, path: piPath }, hide(G0 + 1.55, 0.2)] },
    { k: `${k}-suc`, svg: pill('sucrose', { size: 20 * sc, tint: 'rust' }), keys: [{ ...xy(sucPath(0)), o: 0 }, show(G0 + 1.5, 0.2), { at: G0 + 1.5, d: 0.8, path: sucPath }, hide(G0 + 2.1, 0.2)] },
  ];
}
/** A starch granule (as v5 draws it: 58 × 34 at 330, 420) whose size fx sets: a stroma-coloured patch hides the
 *  figure's own granule, and the drawn one scales with `scaleAt(G)`. */
export function granuleItems(k: string, place: (q: V) => V, sc: number, at: V = [330, 420], rx = 58, ry = 34): Item[] {
  const c = place(at);
  return [
    { k: `${k}-patch`, svg: `<ellipse class="cbk-stroma" rx="${f1((rx + 4) * sc)}" ry="${f1((ry + 4) * sc)}"/>`, keys: [{ ...xy(c), o: 1 }] },
    { k: `${k}-gr`, svg: `<g data-k="${k}-grs"><ellipse class="fcb-starch" rx="${f1(rx * sc)}" ry="${f1(ry * sc)}"/><ellipse rx="${f1(rx * 0.62 * sc)}" ry="${f1(ry * 0.6 * sc)}" fill="none" stroke="#c9bb8a" stroke-width="1.4"/></g>`, keys: [{ ...xy(c), o: 1 }] },
  ];
}
export function granuleFx(k: string, scaleAt: (G: number) => number): (G: number, api: Api) => void {
  return (G, api) => {
    const s = Math.max(0.02, scaleAt(G));
    api.set(api.q(`${k}-grs`), 'transform', `scale(${s.toFixed(3)})`);
  };
}

/* ---------------------------------------------------------------- the starch graph (redrawn), drawn on by fx */

/** Bands (day 0–12, night 12–24, after 24), the early-night hatch 8–12 (shown by fx), axes, and the two curves each in
 *  a clip whose width fx sets (ids k-cc, k-ce). In .fig for the figure styles. */
export function grafGraph(k: string, a: Axes): string {
  const top = a.y0 - 30, band = (x0: number, x1: number, cls: string): string =>
    `<rect x="${f1(X(a, x0))}" y="${f1(top)}" width="${f1(X(a, x1) - X(a, x0))}" height="24" class="${cls}"/>`;
  const clip = (id: string): string => `<clipPath id="${k}-${id}"><rect data-k="${k}-${id}" x="${f1(a.x0 - 10)}" y="${f1(a.y0 - 12)}" width="0.01" height="${f1(a.h + 24)}"/></clipPath>`;
  return `<g class="fig"><defs>${figDefs(`${k}d`).replace(/^<defs>|<\/defs>$/g, '')}${clip('cc')}${clip('ce')}</defs>`
    + `${band(0, 12, 'fcb-band-day')}${band(12, 24, 'fcb-band-night')}${band(24, 28, 'fcb-band-ext')}`
    + T((X(a, 0) + X(a, 12)) / 2, top + 18, 'day', 'fcb-band', 'middle') + T((X(a, 12) + X(a, 24)) / 2, top + 18, 'night', 'fcb-band-d', 'middle')
    + `<rect x="${f1(X(a, 12))}" y="${f1(a.y0)}" width="${f1(X(a, 24) - X(a, 12))}" height="${f1(a.h)}" class="fcb-shade-night"/>`
    + `<g data-k="${k}-early" opacity="0"><rect x="${f1(X(a, 8))}" y="${f1(a.y0)}" width="${f1(X(a, 12) - X(a, 8))}" height="${f1(a.h)}" fill="url(#${k}d-hatch)" opacity=".35"/>`
    + `<rect x="${f1(X(a, 8))}" y="${f1(top)}" width="${f1(X(a, 12) - X(a, 8))}" height="24" fill="url(#${k}d-hatch)"/></g>`
    + axes(a, [0, 4, 8, 12, 16, 20, 24, 28], [0, 2, 4, 6, 8], 'hours after dawn', 'starch (mg g⁻¹ fresh weight)', { ylx: a.x0 - 52 })
    + `<g clip-path="url(#${k}-cc)">${series(a, GRAF_CTRL, 'ink', 'ink', 6)}</g>`
    + `<g clip-path="url(#${k}-ce)">${series(a, GRAF_EARLY, 'amber', 'amber', 6)}</g>`
    + `<g data-k="${k}-l1" opacity="0">${T(X(a, 12) + 14, Y(a, 6.7) - 4, 'night after 12 h', 'fcb-node', 'start')}</g>`
    + `<g data-k="${k}-l2" opacity="0">${T(X(a, 0.4), Y(a, 5.6), 'night after 8 h', 'fcb-node fcb-c-amber', 'start')}</g>`
    + `<g data-k="${k}-l3" opacity="0">${T(X(a, 24) + 6, Y(a, 0.2) - 20, 'dawn', 'fcb-l', 'middle')}</g>`
    + `</g>`;
}
/** Draws the control curve on from hour 0 to 26 over [t0, t0 + d], and the early curve (with its hatch) over [e0, e0 + d]. */
export function grafFx(k: string, a: Axes, t0: number, e0: number, d = 2.2): (G: number, api: Api) => void {
  return (G, api) => {
    const hc = 26.5 * win(G, t0, t0 + d), he = 26.5 * win(G, e0 + 0.3, e0 + 0.3 + d);
    api.set(api.q(`${k}-cc`), 'width', hc > 0.01 ? f1(X(a, hc) - a.x0 + 10) : '0.01');
    api.set(api.q(`${k}-ce`), 'width', he > 0.01 ? f1(X(a, he) - a.x0 + 10) : '0.01');
    api.op(api.q(`${k}-early`), win(G, e0, e0 + 0.3));
    api.op(api.q(`${k}-l1`), win(G, t0 + d * 0.5, t0 + d * 0.5 + 0.3));
    api.op(api.q(`${k}-l3`), win(G, t0 + d * 0.92, t0 + d * 0.92 + 0.3));
    api.op(api.q(`${k}-l2`), win(G, e0 + 0.3 + d * 0.4, e0 + 0.3 + d * 0.4 + 0.3));
  };
}
/** The hour the control curve has reached at G (for a granule or a clock in step with it). */
export const hourAt = (G: number, t0: number, d = 2.2): number => 26.5 * win(G, t0, t0 + d);

/** A 24-hour clock face (sun at the top for dawn), its hand set by fx through data-k="<k>-hand"; centred, radius r. */
export function clockFace(k: string, r = 46): string {
  const ticks = Array.from({ length: 24 }, (_, i) => {
    const a = (i / 24) * 2 * Math.PI - Math.PI / 2, r0 = i % 6 === 0 ? r - 10 : r - 5;
    return `<path d="M${f1(Math.cos(a) * r0)},${f1(Math.sin(a) * r0)} L${f1(Math.cos(a) * r)},${f1(Math.sin(a) * r)}" stroke="#6b6a64" stroke-width="${i % 6 === 0 ? 2 : 1}"/>`;
  }).join('');
  return `<circle r="${r}" fill="#fffdf8" stroke="#3d3d3a" stroke-width="2"/>`
    + `<path d="M0,0 L0,${-r} A${r},${r} 0 0 1 0,${r} Z" fill="#f7ecc4" opacity=".7"/><path d="M0,0 L0,${r} A${r},${r} 0 0 1 0,${-r} Z" fill="#55534d" opacity=".18"/>`
    + ticks + `<path data-k="${k}-hand" d="M0,4 L0,${-r + 12}" stroke="#141413" stroke-width="3.2" stroke-linecap="round"/><circle r="4" fill="#141413"/>`
    + `<text data-k="${k}-txt" class="cbk-h" x="0" y="${r + 34}" text-anchor="middle">0 h</text>`;
}
export function clockFx(k: string, hourOf: (G: number) => number): (G: number, api: Api) => void {
  return (G, api) => {
    const h = hourOf(G);
    api.set(api.q(`${k}-hand`), 'transform', `rotate(${((h % 24) / 24 * 360).toFixed(1)})`);
    api.set(api.q(`${k}-txt`), 'text', h < 0.05 ? 'dawn' : h >= 23.95 && h < 24.6 ? 'dawn' : `${Math.round(h)} h`);
  };
}

/* ---------------------------------------------------------------- the bridge on v7 */

/** v7's wheel (figure units). */
export const V7W = { c: [250, 260] as V, r: 130 };
/** Overlay on v7: the carboxylation arc lit and Rubisco named (figure units, in .fig). */
export const rubiscoLit = (p: string): string =>
  `<g class="fig"><defs>${figDefs(p).replace(/^<defs>|<\/defs>$/g, '')}</defs>${ar(p, 'green', arcD(250, 260, 130, -126, -58), 'fcb-fat')}${T(250, 214, 'Rubisco', 'fcb-h', 'middle', ' style="font-size:24px"')}</g>`;
/** CO₂ and O₂ balls approach the top of v7's carboxylation arc from G0; O₂ arrives, CO₂ stops short; a "?" appears. */
export function bridgeItems(k: string, place: (q: V) => V, sc: number, G0: number): Item[] {
  const top: V = [250, 128];
  const o2From: V = [470, 70], co2From: V = [40, 70];
  const o2End: V = [279, 133];
  const o2Path = (u: number): V => place(bezPath(o2From, [400, 70], o2End)(u));
  const co2End: V = [150, 122];
  const co2Path = (u: number): V => place(bezPath(co2From, [90, 70], co2End)(u));
  const q = place([352, 122]);
  return [
    { k: `${k}-co2`, svg: co2Ball(13 * sc), keys: [{ ...xy(co2Path(0)), o: 0 }, show(G0, 0.2), { at: G0, d: 1.2, path: co2Path }] },
    { k: `${k}-o2`, svg: o2Ball(13 * sc), keys: [{ ...xy(o2Path(0)), o: 0 }, show(G0, 0.2), { at: G0 + 0.1, d: 1.1, path: o2Path }] },
    { k: `${k}-co2l`, svg: T(0, 0, 'CO₂', 'cbk-h', 'middle', ` style="font-size:${f1(22 * sc)}px"`), keys: [{ ...xy(place([co2From[0], co2From[1] - 30])), o: 0 }, show(G0, 0.2), { at: G0, d: 1.2, ...xy(place([co2End[0], co2End[1] - 30])) }] },
    { k: `${k}-o2l`, svg: T(0, 0, 'O₂', 'cbk-h cbk-red', 'middle', ` style="font-size:${f1(22 * sc)}px"`), keys: [{ ...xy(place([o2From[0], o2From[1] - 30])), o: 0 }, show(G0, 0.2), { at: G0 + 0.1, d: 1.1, ...xy(place([o2End[0] + 12, o2End[1] - 30])) }] },
    { k: `${k}-ring`, svg: `<circle class="cbk-pulse cbk-pulse-red" r="${f1(30 * sc)}"/>`, keys: [{ ...xy(place(o2End)), o: 0 }, show(G0 + 1.2, 0.15), hide(G0 + 1.5, 0.5)] },
    { k: `${k}-q`, svg: pill('?', { size: 30 * sc, w: 60 * sc, tint: 'red' }), keys: [{ ...xy(q), o: 0 }, show(G0 + 1.6, 0.3)] },
  ];
}
export { hide, onFig, show, type Key };

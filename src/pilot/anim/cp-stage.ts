// Shared parts of the CO₂-path animations cp9 (slide C9, measuring leaf gas exchange) and cp10 (slide C10, the CO₂
// diffusion pathway), chunk cp, 28 Oct 2026:
// - the slide's figure card and slide figures drawn by their own modules (figs/cp09.ts, figs/cp10.ts), with their SVG ids
//   renamed for the stage (the slide on the page holds the same ids) and their parts tagged by exact markup;
// - cameras (views figure → stage), clippings, photo cards and halftone portraits, all in the deck's newsprint look;
// - the lit control of the drawn CO₂ path (figs/cp-kit.ts pathSchema, whose parts sit in <g data-p="...">), the same
//   lit sets as the slide's variants: dimmed parts at the slide's 0.22, lit parts with the slide's amber glow.
import '../figs/clipping.css';
import './cp-stage.css';
import { co2 as co2g, h2o as h2og } from '../figs/cp-kit';
import { cutPath, f1, lerp, lerpV, setters, smooth, smoother, tfStr, tw, tween, type Tf, type V } from './antenna-common';

export { cutPath, f1, lerp, lerpV, setters, smooth, smoother, tfStr, tw, tween };
export type { Tf, V };
export type Setters = ReturnType<typeof setters>;

/* ---------------------------------------------------------------- views */

/** The slide's figure card, in figure units (pilot.css .lay-figure .fig: 860 × 642 px around the 800 × 600 figure at 0.97). */
export const CARD = { x: -43.3, y: -30.9, w: 886.6, h: 661.9, r: 22.7 };
/** The view that puts figure point c at stage point at, scaled s. */
export const view = (s: number, c: V, at: V = [800, 370]): Tf => ({ s, t: [at[0] - s * c[0], at[1] - s * c[1]] });
/** The whole slide figure card filling the stage. */
export const FULL: Tf = view(1.07, [400, 300]);
/** a after b: first b, then a. */
export const compose = (a: Tf, b: Tf): Tf => ({ s: a.s * b.s, t: [a.s * b.t[0] + a.t[0], a.s * b.t[1] + a.t[1]] });
export const onStage = (v: Tf, p: V): V => [v.s * p[0] + v.t[0], v.s * p[1] + v.t[1]];
/** A move of about 1 s: 0 → 1 from t0 over d, eased at both ends. */
export const mv = (t: number, t0: number, d: number): number => smoother((t - t0) / d);
/** A dive between two figures: figure A's point fa (its view va) and figure B's point fb (its view vb) meet on the stage while
 *  the camera zooms Z times; e = 0 shows A in va, e = 1 shows B in vb. Returns the views of A and B at e. */
export function dive(va: Tf, fa: V, vb: Tf, fb: V, Z: number, e: number): [Tf, Tf] {
  const pa = onStage(va, fa), pb = onStage(vb, fb), c = lerpV(pa, pb, e);
  const ka = Z ** e, kb = Z ** (e - 1);
  const a: Tf = { s: ka, t: [c[0] - pa[0] * ka, c[1] - pa[1] * ka] }, b: Tf = { s: kb, t: [c[0] - pb[0] * kb, c[1] - pb[1] * kb] };
  return [compose(a, va), compose(b, vb)];
}

/* ---------------------------------------------------------------- slide figures on the stage */

/** A slide figure's inner markup, its ids (all prefixed `from`) renamed to `to`. */
export function figInner(svg: string, from: string, to: string): string {
  return svg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '').split(from).join(to);
}
/** Wraps the exact markup `exact` in <g data-k="k">; it must occur in s. */
export function wrap(s: string, exact: string, k: string, attrs = ''): string {
  const i = s.indexOf(exact);
  if (i < 0) throw new Error(`cp-stage: markup for ${k} not found`);
  return `${s.slice(0, i)}<g data-k="${k}"${attrs}>${exact}</g>${s.slice(i + exact.length)}`;
}
/** Adds data-k="k" to the n-th tag (0-based) that starts with `head` (e.g. '<rect class="fcp-bar-co2"'). A marked tag no
 *  longer starts with head, so marking several in turn takes n = 0 each time. */
export function mark(s: string, head: string, k: string, n = 0): string {
  let i = -1;
  for (let j = 0; j <= n; j++) { i = s.indexOf(head, i + 1); if (i < 0) throw new Error(`cp-stage: ${head} #${n} not found`); }
  const sp = head.indexOf(' ');
  return `${s.slice(0, i + sp)} data-k="${k}"${s.slice(i + sp)}`;
}
/** The slide's figure card with its soft shadow, in figure units. */
export const cardSvg = (p: string, k = ''): string =>
  `<defs><filter id="${p}-sl" x="-5%" y="-5%" width="110%" height="112%"><feDropShadow dx="0" dy="8" stdDeviation="9" flood-color="#46321a" flood-opacity=".14"/></filter></defs>
  <rect class="cps-card"${k ? ` data-k="${k}"` : ''} x="${CARD.x}" y="${CARD.y}" width="${CARD.w}" height="${CARD.h}" rx="${CARD.r}" filter="url(#${p}-sl)"/>`;

/** Text that keeps a readable size while the camera zooms: each text is scaled by k about its own anchor. Texts inside
 *  molecules (atom letters) scale with their atoms and are left out. */
export function counterTexts(root: Element, S: Setters): (k: number, shift?: Map<Element, number>) => void {
  const ts = Array.from(root.querySelectorAll<SVGTextElement>('text')).filter(el => !/atom-t/.test(el.getAttribute('class') ?? ''))
    .map(el => ({ el, x: Number(el.getAttribute('x')), y: Number(el.getAttribute('y')), tf: el.getAttribute('transform') ?? '' }));
  // a shifted text moves sideways by dx (figure units) before it is scaled and turned about its own anchor
  return (k, shift) => ts.forEach(({ el, x, y, tf }) => {
    const dx = shift?.get(el) ?? 0;
    S.set(el, 'transform', `${dx ? `translate(${dx.toFixed(2)} 0) ` : ''}matrix(${k.toFixed(4)},0,0,${k.toFixed(4)},${(x * (1 - k)).toFixed(2)},${(y * (1 - k)).toFixed(2)})${tf ? ` ${tf}` : ''}`);
  });
}

/* ---------------------------------------------------------------- the drawn CO₂ path: lit parts */

export type PathPart = 'air' | 'bl' | 'st' | 'ias' | 'me' | 'h2o' | 'co2';
export const PARTS: PathPart[] = ['air', 'bl', 'st', 'ias', 'me', 'h2o', 'co2'];
export type Lit = Record<PathPart, number>;
/** The lit sets of the slides' path figures: all (C10 v2), boundary layer, stomata (C10 v11), mesophyll (C10 v12),
 *  outside the leaf (C9 v7). */
export const LIT = {
  all: { air: 1, bl: 1, st: 1, ias: 1, me: 1, h2o: 1, co2: 1 } as Lit,
  bl: { air: 1, bl: 1, st: 0, ias: 0, me: 0, h2o: 0, co2: 1 } as Lit,
  st: { air: 1, bl: 0, st: 1, ias: 1, me: 0, h2o: 1, co2: 1 } as Lit,
  me: { air: 0, bl: 0, st: 0, ias: 1, me: 1, h2o: 0, co2: 1 } as Lit,
  out: { air: 1, bl: 1, st: 1, ias: 1, me: 0, h2o: 1, co2: 1 } as Lit,
};
export const litMix = (a: Lit, b: Lit, e: number): Lit =>
  Object.fromEntries(PARTS.map(p => [p, lerp(a[p], b[p], e)])) as Lit;
/** Sets the lit state of every part group under root: opacity 0.22 (dimmed) → 1 (lit); the amber glow of the slide's
 *  partial lit sets scaled by glow (0 for the all-lit figure). */
export function pathLit(root: Element, S: Setters): (w: Lit, glow: number, extra?: Partial<Record<PathPart, number>>) => void {
  const gs = Array.from(root.querySelectorAll<SVGGElement>('g[data-p]')).map(el => ({ el, p: el.dataset.p as PathPart }));
  return (w, glow, extra = {}) => gs.forEach(({ el, p }) => {
    const v = w[p] ?? 1, a = Math.max(0, glow * v * 0.75 + (extra[p] ?? 0));
    S.set(el, 'style', `opacity:${(0.22 + 0.78 * v).toFixed(3)};filter:${a > 0.01 ? `drop-shadow(0 0 ${(6 + 4 * (extra[p] ?? 0)).toFixed(1)}px rgba(242,183,5,${Math.min(1, a).toFixed(3)}))` : 'none'}`);
  });
}

/* ---------------------------------------------------------------- newsprint: clippings, photos, portraits */

/** A newsprint clipping holding an image (ink on transparent, or a white-ground scan multiplied into the paper), w wide
 *  at x, y; the image keeps its aspect ar (height / width). m is the paper margin. */
export function clipping(p: string, k: string, href: string, x: number, y: number, w: number, ar: number,
  o: { rot?: number; seed?: number; m?: number; mult?: boolean; under?: string } = {}): string {
  const m = o.m ?? 18, ih = (w - 2 * m) * ar, h = ih + 2 * m + (o.under ? 34 : 0), rot = o.rot ?? 0;
  return `<g data-k="${k}" opacity="0"><g transform="rotate(${rot} ${f1(x + w / 2)} ${f1(y + h / 2)})">
    <path class="clip-paper" d="${cutPath(x, y, w, h, o.seed ?? 29)}" filter="url(#${p}-clipsh)"/>
    <image${o.mult ? ' class="cps-mult"' : ''} href="${href}" x="${f1(x + m)}" y="${f1(y + m)}" width="${f1(w - 2 * m)}" height="${f1(ih)}" preserveAspectRatio="none"/>
    ${o.under ? `<text class="cps-under" x="${f1(x + w / 2)}" y="${f1(y + ih + m + 26)}" text-anchor="middle">${o.under}</text>` : ''}
  </g></g>`;
}
/** The shadow the clippings and cards share; once per stage. */
export const clipDefs = (p: string): string =>
  `<defs><filter id="${p}-clipsh" x="-15%" y="-10%" width="130%" height="125%"><feDropShadow dx="1" dy="3" stdDeviation="4" flood-color="#3d3020" flood-opacity=".22"/></filter></defs>`;
/** A halftone portrait on a newsprint card with the name and the year below. */
export function portrait(p: string, k: string, href: string, x: number, y: number, w: number, name: string, year: string, rot = -2): string {
  const m = w * 0.07, ph = (w - 2 * m) * 1.25, h = ph + 2 * m + 86;
  return `<g data-k="${k}" opacity="0"><g transform="rotate(${rot} ${f1(x + w / 2)} ${f1(y + h / 2)})">
    <path class="clip-paper" d="${cutPath(x, y, w, h, 23)}" filter="url(#${p}-clipsh)"/>
    <image href="${href}" x="${f1(x + m)}" y="${f1(y + m)}" width="${f1(w - 2 * m)}" height="${f1(ph)}" preserveAspectRatio="xMidYMid slice"/>
    <text class="clip-name cps-pname" x="${f1(x + w / 2)}" y="${f1(y + m + ph + 36)}" text-anchor="middle">${name}</text>
    <text class="clip-find cps-pyear" x="${f1(x + w / 2)}" y="${f1(y + m + ph + 72)}" text-anchor="middle">${year}</text>
  </g></g>`;
}
/** A photograph or micrograph in a rounded frame, w × h at x, y, showing the image window win = [u0, v0, uw, vh] (image
 *  pixels) of an image iw × ih, with a credit line below and an optional label above. */
export function photo(p: string, k: string, href: string, iw: number, ih: number, x: number, y: number, w: number, h: number,
  o: { win?: [number, number, number, number]; credit?: string; creditStart?: boolean; label?: string; o?: number; back?: boolean } = {}): string {
  const [u0, v0, uw, vh] = o.win ?? [0, 0, iw, ih], s = Math.max(w / uw, h / vh);
  const ox = x - u0 * s + (w - uw * s) / 2, oy = y - v0 * s + (h - vh * s) / 2;
  // a paper backing under the image, its label and its credit, so they read over a busy scene
  const top = o.label ? 46 : 12, bot = o.credit ? 32 : 12;
  const back = o.back ? `<rect class="cps-back" x="${f1(x - 12)}" y="${f1(y - top)}" width="${f1(w + 24)}" height="${f1(h + top + bot)}" rx="14" filter="url(#${p}-clipsh)"/>` : '';
  return `<g data-k="${k}" opacity="${o.o ?? 0}">${back}
    <clipPath id="${p}-${k}-c"><rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" rx="12"/></clipPath>
    <rect class="cps-photobg" x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" rx="12" filter="url(#${p}-clipsh)"/>
    <g clip-path="url(#${p}-${k}-c)"><image href="${href}" x="${f1(ox)}" y="${f1(oy)}" width="${f1(iw * s)}" height="${f1(ih * s)}" preserveAspectRatio="none"/></g>
    <rect class="cps-frame" x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" rx="12"/>
    ${o.label ? `<text class="cps-plabel" x="${f1(x)}" y="${f1(y - 14)}">${o.label}</text>` : ''}
    ${o.credit ? `<text class="cps-credit" x="${f1(o.creditStart ? x : x + w)}" y="${f1(y + h + 20)}" text-anchor="${o.creditStart ? 'start' : 'end'}">${o.credit}</text>` : ''}
  </g>`;
}
/** A label pill in stage units, centred at x, y. Kinds as the slide figures: paper, dark, co2, h2o. As figs/cp-kit pill(),
 *  a co2 or h2o pill is paper with the molecule's glyph before its words, written in ink (the deck's one glyph set). */
export function stagePill(k: string, x: number, y: number, s: string, kind: 'paper' | 'dark' | 'co2' | 'h2o' = 'paper', o = 0): string {
  const gl = kind === 'co2' ? 58 : kind === 'h2o' ? 40 : 0;
  const w = s.replace(/<[^>]+>/g, '').length * 12.6 + 34 + gl, x0 = x - w / 2;
  const glyph = kind === 'co2' ? `<g class="fig">${co2g(x0 + 38, y, 11)}</g>` : kind === 'h2o' ? `<g class="fig">${h2og(x0 + 28, y - 4, 11)}</g>` : '';
  return `<g data-k="${k}" opacity="${o}"><rect class="cps-pill cps-pill-${kind}" x="${f1(x0)}" y="${f1(y - 21)}" width="${f1(w)}" height="42" rx="21"/>${glyph}
    <text class="cps-pt cps-pt-${kind}" x="${f1(x + gl / 2)}" y="${f1(y + 8.5)}" text-anchor="middle">${s}</text></g>`;
}

/** One pulse, 0 → 1 → 0, from t0 over d. */
export const pulseAt = (t: number, t0: number, d: number): number => (t < t0 || t > t0 + d ? 0 : Math.sin((Math.PI * (t - t0)) / d));
/** Seconds into beat n, for a draw call at beat b, t: −1 before it begins, 99 after it. */
export const beatClock = (b: number, t: number) => (n: number): number => (b === n ? t : b > n ? 99 : -1);

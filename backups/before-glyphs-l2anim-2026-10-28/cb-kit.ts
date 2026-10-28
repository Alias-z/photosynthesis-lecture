// Lecture 2 chunk 1 (Calvin–Benson–Bassham cycle, slides C1–C4, prefix cb): the parts all cb animations share.
// - A small keyframe engine on one global clock. Each beat lasts D[b] seconds; the player's (beat, t) maps to the global
//   time G = S[b] + min(t, D[b]), so a beat's end state is everything up to that point and Back/Next always land right.
//   Every element has a track of keys: the first sets its initial pose; each later key moves it from where it is (at
//   time `at`, over `d` seconds, eased) to the key's values. The camera is a track too: the scene point shown at the
//   stage centre (x, y) and the zoom (s, interpolated in log).
// - The slide figures are drawn by their own figure modules (figs/cb01–cb04.ts, draw(id)) and placed exactly as the
//   slide's figure card fills the stage in the other animations (b6f8-common.ts: 1.07 ×, centred). Only the SVG ids are
//   re-prefixed, so that the figure on the slide page and its copy on the stage never share an arrowhead id.
// - Shared looks: newsprint clippings (figs/clipping.css), halftone portraits, framed photos, multiplied scans,
//   label pills, readouts and credits, all in the deck's fonts on Bristol paper (cb-kit.css).
import './cb-kit.css';
import '../figs/clipping.css';
import { cutPath, f1, setters, smoother } from './antenna-common';
import type { Staging } from './types';

export type V = [number, number];
export { f1 };

/* ---------------------------------------------------------------- clock and tracks */

export interface Clock { D: number[]; S: number[]; end: number; g: (b: number, t: number) => number }
/** Beat durations → start times; g(b, t) is the global time t seconds into beat b. */
export function clock(D: number[]): Clock {
  const S = D.map((_, i) => D.slice(0, i).reduce((a, x) => a + x, 0));
  return { D, S, end: S[S.length - 1] + D[D.length - 1], g: (b, t) => S[b] + t };
}

export interface Key {
  at?: number; d?: number;
  x?: number; y?: number; s?: number; o?: number; r?: number;
  /** Moves along this path instead of a straight line (u: 0 → 1, eased). */
  path?: (u: number) => V;
  ease?: (u: number) => number;
}
export interface Pose { x: number; y: number; s: number; o: number; r: number }

export const lerp = (a: number, b: number, u: number): number => a + (b - a) * u;
export const clamp01 = (u: number): number => Math.max(0, Math.min(1, u));
/** 0 → 1 between t0 and t1, eased. */
export const win = (G: number, t0: number, t1: number): number => smoother((G - t0) / (t1 - t0));

/** The pose of a track at global time G. */
export function poseAt(keys: Key[], G: number): Pose {
  const k0 = keys[0] ?? {};
  const p: Pose = { x: k0.x ?? 0, y: k0.y ?? 0, s: k0.s ?? 1, o: k0.o ?? 1, r: k0.r ?? 0 };
  for (let i = 1; i < keys.length; i++) {
    const k = keys[i], at = k.at ?? 0, d = k.d ?? 1;
    if (G < at) break;
    const u = d > 0 ? (k.ease ?? smoother)(clamp01((G - at) / d)) : 1;
    if (k.path) { const q = k.path(u); p.x = q[0]; p.y = q[1]; } else {
      if (k.x !== undefined) p.x = lerp(p.x, k.x, u);
      if (k.y !== undefined) p.y = lerp(p.y, k.y, u);
    }
    if (k.s !== undefined) p.s = p.s * (k.s / p.s) ** u;
    if (k.o !== undefined) p.o = lerp(p.o, k.o, u);
    if (k.r !== undefined) p.r = lerp(p.r, k.r, u);
  }
  return p;
}

/** Shorthands for the most common keys. */
export const show = (at: number, d = 0.3): Key => ({ at, d, o: 1 });
export const hide = (at: number, d = 0.3): Key => ({ at, d, o: 0 });
export const to = (at: number, x: number, y: number, d = 1, s?: number): Key => ({ at, d, x, y, s });

/* ---------------------------------------------------------------- staging assembly */

export interface Item {
  k: string;
  /** 'scene' items move with the camera; 'hud' items stay put on the stage. */
  layer?: 'scene' | 'hud';
  svg: string;
  keys: Key[];
}
export interface Api {
  q: <E extends Element = SVGElement>(k: string) => E;
  set: (el: Element, a: string, v: string) => void;
  op: (el: Element, v: number) => void;
  /** All elements matching a selector inside the stage. */
  all: <E extends Element = SVGElement>(sel: string) => E[];
  cam: Pose;
}
export interface Spec {
  id: string; name: string; note: string;
  D: number[];
  holds?: number[][];
  /** Extra markup at the very back (paper marks) and defs. */
  back?: string; defs?: string;
  items: Item[];
  cam?: Key[];
  /** Per-frame work the tracks cannot do (counters, curves drawing on, text counter-scaling). */
  fx?: (G: number, api: Api) => void;
  /** Runs once the stage is in the page. */
  init?: (api: Api) => void;
}

const camStr = (c: Pose): string => {
  const s = c.s;
  return `matrix(${s.toFixed(5)},0,0,${s.toFixed(5)},${(800 - s * c.x).toFixed(2)},${(370 - s * c.y).toFixed(2)})`;
};
const poseStr = (p: Pose): string =>
  `translate(${p.x.toFixed(2)} ${p.y.toFixed(2)})${p.r ? ` rotate(${p.r.toFixed(2)})` : ''}${p.s !== 1 ? ` scale(${p.s.toFixed(4)})` : ''}`;

export function build(sp: Spec): Staging {
  const clk = clock(sp.D);
  const camKeys = sp.cam ?? [{ x: 800, y: 370, s: 1 }];
  const g = (it: Item): string => `<g data-k="${it.k}">${it.svg}</g>`;
  return {
    id: sp.id,
    name: sp.name,
    note: sp.note,
    holds: sp.holds,
    svg: () => `<defs>${sp.defs ?? ''}</defs>${sp.back ?? ''}
      <g data-k="cam">${sp.items.filter(i => (i.layer ?? 'scene') === 'scene').map(g).join('')}</g>
      ${sp.items.filter(i => i.layer === 'hud').map(g).join('')}`,
    bind(stage) {
      const S = setters(stage);
      const els = sp.items.map(it => ({ it, el: S.q(it.k) }));
      const camEl = S.q('cam');
      const api: Api = { ...S, all: <E extends Element = SVGElement>(sel: string) => Array.from(stage.querySelectorAll<E>(sel)), cam: { x: 800, y: 370, s: 1, o: 1, r: 0 } };
      sp.init?.(api);
      let last = -1;
      return (beatIn, t) => {
        const b = Math.max(0, Math.min(clk.D.length - 1, Math.round(beatIn)));
        const G = clk.S[b] + Math.max(0, Math.min(t, clk.D[b]));
        if (Math.abs(G - last) < 1e-4) return;
        last = G;
        const c = poseAt(camKeys, G);
        api.cam = c;
        S.set(camEl, 'transform', camStr(c));
        for (const { it, el } of els) {
          if (!el) continue;
          const p = poseAt(it.keys, G);
          S.op(el, p.o);
          if (p.o > 0.004) S.set(el, 'transform', poseStr(p));
        }
        sp.fx?.(G, api);
      };
    },
  };
}

/* ---------------------------------------------------------------- the slide figure on the stage */

/** Where a slide figure (800 × 600) sits when its card fills the stage, as in the other slide animations. */
export const FIG_S = 1.07;
export const FIG_O: V = [800 - FIG_S * 400, 370 - FIG_S * 300];
/** A figure point on the stage (scene units), with the figure placed at FIG_O, FIG_S. */
export const onFig = (p: V): V => [FIG_O[0] + FIG_S * p[0], FIG_O[1] + FIG_S * p[1]];
/** The figure card in figure units (pilot.css .lay-figure .fig, paper look). */
const CARD = { x: -43.3, y: -30.9, w: 886.6, h: 661.9, r: 22.7 };

/** The inner markup of a figure module's SVG, its ids (prefix `from`) renamed to prefix `to`. */
export function figInner(svg: string, from: string, to: string): string {
  return svg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '').split(`${from}-`).join(`${to}-`);
}
/** A slide figure in its card, drawn in figure units (place the group with FIG_O / FIG_S, or any transform). */
export function figCard(inner: string, card = true): string {
  return `${card ? `<rect class="cbk-slidecard" x="${CARD.x}" y="${CARD.y}" width="${CARD.w}" height="${CARD.h}" rx="${CARD.r}"/>` : ''}<g class="fig">${inner}</g>`;
}
/** The same, placed as on the slide card (scene units). */
export const figOnStage = (inner: string, card = true): string =>
  `<g transform="matrix(${FIG_S},0,0,${FIG_S},${FIG_O[0].toFixed(2)},${FIG_O[1].toFixed(2)})">${figCard(inner, card)}</g>`;

/* ---------------------------------------------------------------- pieces drawn round their origin */

export const T = (x: number, y: number, s: string, cls: string, a: 'start' | 'middle' | 'end' = 'middle', extra = ''): string =>
  `<text class="${cls}" x="${f1(x)}" y="${f1(y)}" text-anchor="${a}"${extra}>${s}</text>`;
/** Visible length of a label (markup not counted). */
export const vis = (s: string): number => s.replace(/<[^>]+>/g, '').length;

/** A label pill centred on the origin; `size` is the font size. */
export function pill(s: string, o: { size?: number; cls?: string; tint?: string; w?: number } = {}): string {
  const size = o.size ?? 24, w = o.w ?? vis(s) * size * 0.56 + size * 1.2, h = size * 1.6;
  return `<rect class="cbk-pill${o.tint ? ` cbk-pill-${o.tint}` : ''}" x="${f1(-w / 2)}" y="${f1(-h / 2)}" width="${f1(w)}" height="${f1(h)}" rx="${f1(h / 2)}"/>`
    + T(0, size * 0.36, s, `cbk-pt${o.cls ? ` ${o.cls}` : ''}`, 'middle', ` style="font-size:${size}px"`);
}
/** Width of a pill for label s. */
export const pillW = (s: string, size = 24): number => vis(s) * size * 0.56 + size * 1.2;

/** A newsprint clipping w × h centred on the origin, slightly turned, with a soft shadow; `inner` is drawn in its frame
 *  (origin at its centre). */
export function clipping(p: string, w: number, h: number, inner: string, o: { rot?: number; seed?: number; jag?: number } = {}): string {
  return `<g transform="rotate(${o.rot ?? -1.2})">
    <path class="clip-paper cbk-clipsh" d="${cutPath(-w / 2, -h / 2, w, h, o.seed ?? 37, o.jag ?? 3.4)}" filter="url(#${p}-sh)"/>${inner}</g>`;
}
/** The shadow filter clippings and cards use (put once in defs). */
export const shadowDef = (p: string): string =>
  `<filter id="${p}-sh" x="-12%" y="-10%" width="124%" height="124%"><feDropShadow dx="1" dy="4" stdDeviation="6" flood-color="#3d3020" flood-opacity=".22"/></filter>`;

/** A halftone portrait (600 × 750 newsprint file) w wide, with the name under it, centred on the origin. */
export function portrait(href: string, name: string, w: number, o: { year?: string; size?: number } = {}): string {
  const h = w * 1.25, size = o.size ?? Math.max(22, w * 0.17);
  return `<image href="${href}" x="${f1(-w / 2)}" y="${f1(-h / 2)}" width="${f1(w)}" height="${f1(h)}" preserveAspectRatio="xMidYMid slice"/>`
    + T(0, h / 2 + size * 1.05, name, 'clip-name cbk-name', 'middle', ` style="font-size:${f1(size)}px"`)
    + (o.year ? T(0, h / 2 + size * 2.15, o.year, 'clip-find cbk-name', 'middle', ` style="font-size:${f1(size * 0.95)}px"`) : '');
}
/** A portrait on its own clipping (name and optional year under it), centred on the origin. */
export function portraitClip(p: string, href: string, name: string, w: number, o: { year?: string; rot?: number; seed?: number } = {}): string {
  const m = w * 0.09, size = Math.max(22, w * 0.15), h = w * 1.25 + 2 * m + size * (o.year ? 2.5 : 1.45);
  const cy = -h / 2 + m + (w * 1.25) / 2;
  return clipping(p, w + 2 * m, h, `<g transform="translate(0 ${f1(cy)})">${portrait(href, name, w, { year: o.year, size })}</g>`, { rot: o.rot, seed: o.seed });
}

/** A real image w wide (its height following), centred on the origin. `mult`: its white ground multiplied into the
 *  paper (published figures); otherwise framed (photos). win: the window [u0, v0, uw, vh] of the file shown. */
export interface Img { href: string; w: number; h: number }
export function image(p: string, im: Img, w: number, o: { win?: [number, number, number, number]; mult?: boolean; frame?: boolean; r?: number } = {}): { svg: string; h: number; at: (u: number, v: number) => V } {
  const [u0, v0, uw, vh] = o.win ?? [0, 0, im.w, im.h];
  const s = w / uw, h = vh * s, x = -w / 2, y = -h / 2, ox = x - u0 * s, oy = y - v0 * s, r = o.r ?? (o.mult ? 0 : 6);
  const img = `<image href="${im.href}" x="${f1(ox)}" y="${f1(oy)}" width="${f1(im.w * s)}" height="${f1(im.h * s)}" preserveAspectRatio="none"/>`;
  const clip = `<clipPath id="${p}"><rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" rx="${r}"/></clipPath>`;
  const frame = o.frame !== false && !o.mult ? `<rect class="cbk-frame" x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" rx="${r}"/>` : '';
  return { svg: `${clip}<g clip-path="url(#${p})"${o.mult ? ' class="cbk-mult"' : ''}>${img}</g>${frame}`, h, at: (u, v) => [ox + u * s, oy + v * s] };
}
/** A white card (rounded, soft shadow) w × h centred on the origin. */
export const card = (p: string, w: number, h: number, cls = 'cbk-card'): string =>
  `<rect class="${cls}" x="${f1(-w / 2)}" y="${f1(-h / 2)}" width="${f1(w)}" height="${f1(h)}" rx="18" filter="url(#${p}-sh)"/>`;
/** Grey credit line(s), '|' breaks lines; anchored at the origin. */
export const credit = (s: string, a: 'start' | 'middle' | 'end' = 'middle', size = 14): string =>
  s.split('|').map((l, i) => T(0, i * (size + 3), l.trim(), 'cbk-crd', a, ` style="font-size:${size}px"`)).join('');
/** A leader from a to b: dark line in a light halo, ending in a dot. */
export const leader = (a: V, b: V): string => {
  const d = `M${f1(a[0])},${f1(a[1])}L${f1(b[0])},${f1(b[1])}`;
  return `<path class="cbk-ldh" d="${d}"/><path class="cbk-ldk" d="${d}"/><circle class="cbk-tip" cx="${f1(b[0])}" cy="${f1(b[1])}" r="3.5"/>`;
};

/** A carbon square (side d) centred on the origin: 'n' newly fixed (orange), 'c' plain, 'x' exported. */
export const csq = (kind: 'n' | 'c' | 'x', d = 20): string =>
  `<rect class="${kind === 'n' ? 'fcb-cn' : kind === 'x' ? 'fcb-cx' : 'fcb-c'}" x="${f1(-d / 2)}" y="${f1(-d / 2)}" width="${d}" height="${d}" rx="${f1(d / 4)}"/>`;
/** A row of carbon squares centred on the origin. */
export const crow = (kinds: string, d = 20, gap = 4): string => {
  const w = kinds.length * d + (kinds.length - 1) * gap;
  return [...kinds].map((k, i) => `<g transform="translate(${f1(-w / 2 + d / 2 + i * (d + gap))} 0)">${csq(k as 'n', d)}</g>`).join('');
};
/** CO₂ and O₂ as atom balls (C dark, O red), centred on the origin. */
export const co2Ball = (r = 15): string =>
  `<circle class="cbk-atom-o" cx="${f1(-1.55 * r)}" cy="0" r="${f1(r * 0.86)}"/><circle class="cbk-atom-o" cx="${f1(1.55 * r)}" cy="0" r="${f1(r * 0.86)}"/><circle class="cbk-atom-c" cx="0" cy="0" r="${r}"/>`
  + T(0, r * 0.38, 'C', 'cbk-atom-t', 'middle', ` style="font-size:${f1(r * 1.05)}px"`) + T(-1.55 * r, r * 0.34, 'O', 'cbk-atom-t', 'middle', ` style="font-size:${f1(r * 0.92)}px"`) + T(1.55 * r, r * 0.34, 'O', 'cbk-atom-t', 'middle', ` style="font-size:${f1(r * 0.92)}px"`);
export const o2Ball = (r = 15): string =>
  `<circle class="cbk-atom-o" cx="${f1(-0.78 * r)}" cy="0" r="${f1(r * 0.9)}"/><circle class="cbk-atom-o" cx="${f1(0.78 * r)}" cy="0" r="${f1(r * 0.9)}"/>`
  + T(-0.78 * r, r * 0.34, 'O', 'cbk-atom-t', 'middle', ` style="font-size:${f1(r * 0.95)}px"`) + T(0.78 * r, r * 0.34, 'O', 'cbk-atom-t', 'middle', ` style="font-size:${f1(r * 0.95)}px"`);

/* ---------------------------------------------------------------- paths */

const rad = (a: number): number => (a * Math.PI) / 180;
export const polarV = (c: V, r: number, a: number): V => [c[0] + r * Math.cos(rad(a)), c[1] + r * Math.sin(rad(a))];
/** Along a circle (centre c, radius r) from angle a0 to a1 (degrees, y down). */
export const arcPath = (c: V, r: number, a0: number, a1: number) => (u: number): V => polarV(c, r, lerp(a0, a1, u));
/** Along the quadratic Bézier a → ctl → b. */
export const bezPath = (a: V, ctl: V, b: V) => (u: number): V => {
  const v = 1 - u;
  return [v * v * a[0] + 2 * v * u * ctl[0] + u * u * b[0], v * v * a[1] + 2 * v * u * ctl[1] + u * u * b[1]];
};

/** Scales each text in `root` about its own anchor by k (to keep the text readable while the camera zooms). */
export function textScaler(root: Element | null): (k: number) => void {
  if (!root) return () => undefined;
  const ts = Array.from(root.querySelectorAll<SVGTextElement>('text')).map(el => ({ el, x: Number(el.getAttribute('x')), y: Number(el.getAttribute('y')) }));
  let lastK = -1;
  return k => {
    if (Math.abs(k - lastK) < 1e-4) return;
    lastK = k;
    ts.forEach(({ el, x, y }) => el.setAttribute('transform', `matrix(${k.toFixed(4)},0,0,${k.toFixed(4)},${(x * (1 - k)).toFixed(2)},${(y * (1 - k)).toFixed(2)})`));
  };
}

/** Text scale for a figure drawn s times its slide size: zoomed in, text grows only as s^0.4 (so it stays readable
 *  without filling the view); zoomed out, it shrinks as s^0.8, so the words still fit their boxes on the wheel (the
 *  longest, "6 triose phosphate", has 12 % to spare). */
export const textK = (s: number): number => (s >= 1 ? s ** -0.6 : s ** -0.2);

// Builder 2's shared code for the dark-reaction animations re-staged in the real-protein strip (lecturer, 28 Oct 2026;
// research/redo-2026-10-28/DARK_ANIM_BRIEF.md): cb4, rf6, rf7, rf8 (stagings anim/dk-<key>.ts, id 's').
// - The scene is the dark-reaction strip of figs/cell-schema.ts (arrangement 'strip', no counts, its cycle molecules left
//   out), drawn twice: every part dimmed, and every part lit on top. Each lit part's groups fade in or out per beat, so
//   parts are lit per beat as in the electron-transport animations; dimmed parts show no labels (dk2-common.css).
//   cell-schema.ts is not modified: its part groups (<g data-p>) are sorted by what they hold (membrane, protein, arrow,
//   molecule, text) when the stage binds, and static molecules a staging moves itself are hidden.
// - The camera (one move per beat at most) moves over the strip, in strip units, as anim/bridge-common.ts does.
// - Moving molecules are the deck's glyphs: carbon form (figs/carbon-form.ts), CO₂ and O₂ as atom balls, ATP, NADPH and
//   Pᵢ as the chain's tags; each glides on an eased, gently curved path (a Catmull–Rom curve through its points).
// - A ledger (counts per the animation's one unit, ticking in step) and a graph panel sit on the stage, outside the
//   camera.
import './dk2-common.css';
import { cellSvg, SPOT, type Part } from '../figs/cell-schema';
import { ease, lerpCam, type Cam, type V } from './bridge-common';

export { ease, type Cam, type V };

export const f = (v: number): string => (Math.round(v * 100) / 100).toString();
export const clamp01 = (x: number): number => (x < 0 ? 0 : x > 1 ? 1 : x);
export const lerp = (a: number, b: number, u: number): number => a + (b - a) * u;
export const lerpV = (a: V, b: V, u: number): V => [lerp(a[0], b[0], u), lerp(a[1], b[1], u)];
/** 1 inside [t0, t1], fading in over `fi` before and out over `fo` after (0 when fo is 0 and t is past t1: kept). */
export const win = (t: number, t0: number, fi: number, t1 = Infinity, fo = 0.3): number =>
  ease(t, t0, t0 + fi) * (t1 === Infinity ? 1 : 1 - ease(t, t1, t1 + fo));

/* ---------------------------------------------------------------- curved paths */

export type Path = (u: number) => V;
/** An eased-ready path through the points: a Catmull–Rom curve, parametrised by arc length (u 0 → 1). */
export function curve(q: V[]): Path {
  if (q.length === 1) return () => q[0];
  const pts: V[] = [];
  for (let i = 0; i < q.length - 1; i++) {
    const p0 = q[Math.max(0, i - 1)], p1 = q[i], p2 = q[i + 1], p3 = q[Math.min(q.length - 1, i + 2)];
    for (let k = 0; k < 24; k++) {
      const s = k / 24, s2 = s * s, s3 = s2 * s;
      const c = (a: number, b: number, cc: number, d: number): number => 0.5 * (2 * b + (-a + cc) * s + (2 * a - 5 * b + 4 * cc - d) * s2 + (-a + 3 * b - 3 * cc + d) * s3);
      pts.push([c(p0[0], p1[0], p2[0], p3[0]), c(p0[1], p1[1], p2[1], p3[1])]);
    }
  }
  pts.push(q[q.length - 1]);
  const L = [0];
  for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const tot = L[L.length - 1] || 1;
  return (u: number): V => {
    const d = clamp01(u) * tot;
    let lo = 0, hi = L.length - 1;
    while (hi - lo > 1) { const m = (lo + hi) >> 1; if (L[m] <= d) lo = m; else hi = m; }
    const seg = L[hi] - L[lo] || 1;
    return lerpV(pts[lo], pts[hi], (d - L[lo]) / seg);
  };
}
/** Position on `p` for a glide that starts at t0 and lasts d (eased at both ends). */
export const glide = (p: Path, t: number, t0: number, d: number): V => p(ease(t, t0, t0 + d));

/* ---------------------------------------------------------------- where things are in the strip */

/** The strip's glyph spots (strip units): the one adapter to cell-schema.ts's layout (its SPOT: each gas beside its own
 *  reaction, CO₂ upper left with carboxylation and 3-PGA, O₂ right with oxygenation and 2-phosphoglycolate). */
export type Spots = typeof SPOT;
export const SP: Spots = SPOT;
/** A gas's way in to RuBisCO along its drawn arrow (SP.co2From → co2To, SP.o2From → o2To): from `far` beyond its spot
 *  (on a gentle arc), past the spot, to `short` units before the arrow's tip, which touches RuBisCO's rim. CO₂ uses a short
 *  run-in: beyond its spot lies the thylakoid. */
export function gasPath(g: 'co2' | 'o2', far = 110, short = 0): Path {
  const spot = SP[g], to = g === 'co2' ? SP.co2To : SP.o2To;
  const dx = spot[0] - to[0], dy = spot[1] - to[1], L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L;
  const arc = 26 * Math.min(1, far / 110);
  return curve([[spot[0] + ux * far - uy * arc, spot[1] + uy * far + ux * arc * (g === 'co2' ? -1 : 1)], spot, [to[0] + ux * short, to[1] + uy * short]]);
}
/** A point on RuBisCO's rim (its render ≈ 130 × 112) facing p. */
export function rimOf(p: V, r = 44): V {
  const dx = p[0] - SP.rub[0], dy = p[1] - SP.rub[1], L = Math.hypot(dx, dy) || 1;
  return [SP.rub[0] + (dx / L) * r, SP.rub[1] + (dy / L) * r];
}
/** A gas comes in to RuBisCO: from `far` units beyond its spot (away from RuBisCO), past the spot, to the rim. */
export function gasIn(spot: V, far = 110): Path {
  const dx = spot[0] - SP.rub[0], dy = spot[1] - SP.rub[1], L = Math.hypot(dx, dy) || 1;
  return curve([[spot[0] + (dx / L) * far, spot[1] + (dy / L) * far], spot, rimOf(spot)]);
}

/* ---------------------------------------------------------------- the strip, dimmed and lit */

/** Every part the strip draws (the FvCB boxes are not drawn without CellOpts.limits). */
export const ALL_PARTS: Part[] = ['co2', 'o2', 'rubisco', 'carbox', 'oxy', 'pga', 'pg2', 'light', 'thyl', 'supply', 'reduce', 'tp',
  'regen', 'export', 'glycolate', 'perox', 'glycine', 'mito', 'serine', 'co2-out', 'nh3', 'glycerate', 'starch'];
/** What a part group holds. */
export type Kind = 'mem' | 'body' | 'flow' | 'node' | 'text';
/** Lit level of a part (or of one kind of a part's groups: key "part:kind"), 0 … 1. */
export type LitMap = Record<string, number>;

export interface SceneOpt {
  /** World markup between the dimmed and the lit strip (e.g. a granule the lit labels sit on). */
  under?: string;
  /** World markup above the lit strip, below the moving glyphs. */
  over?: string;
  /** The moving glyphs (world). */
  movers?: string;
  /** Stage markup outside the camera: ledger, panel. */
  hud?: string;
}
/** The stage: camera group (strip dimmed, strip lit, overlays, movers), then the HUD. */
export function sceneSvg(p: string, o: SceneOpt): string {
  const dim = cellSvg(`${p}d`, 'strip', [], { bare: true, unit: 'none', noMol: true });
  const lit = cellSvg(`${p}l`, 'strip', ALL_PARTS, { bare: true, unit: 'none', noMol: true });
  return `<g data-k="cam"><g class="fig dk2">
      <g class="dk2-dim">${dim}</g>${o.under ?? ''}<g class="dk2-lit" data-k="lit">${lit}</g>
      ${o.over ?? ''}${o.movers ?? ''}
    </g></g><g class="fig dk2 dk2-hud">${o.hud ?? ''}</g>`;
}

interface Grp { el: SVGGElement; part: string; kind: Kind; dim: boolean; o: number }
function kindOf(g: Element): Kind {
  if (g.querySelector('.cbb-band, .cel-lumen')) return 'mem';
  if (g.querySelector('image.cel-p, rect.cel-drawn, ellipse.cel-starch')) return 'body';
  if (g.querySelector('path.cbb-a, path.chn-lw')) return 'flow';
  if (g.querySelector('.chn-g, image')) return 'node';
  return 'text';
}
/** The bound strip: its part groups, and how to light them. */
export class Strip {
  readonly groups: Grp[] = [];
  constructor(readonly stage: SVGSVGElement) {
    const lit = stage.querySelector('[data-k="lit"]') as SVGGElement;
    for (const layer of [stage.querySelector('.dk2-dim') as SVGGElement, lit]) {
      const dim = layer !== lit;
      for (const el of Array.from(layer.children)) {
        const part = el.getAttribute('data-p');
        if (!part) { if (!dim && el.tagName !== 'defs') (el as SVGElement).setAttribute('display', 'none'); continue; }
        const g = el as SVGGElement;
        this.groups.push({ el: g, part, kind: kindOf(g), dim, o: -1 });
        if (!dim) g.setAttribute('opacity', '0');
      }
    }
  }
  /** Hides a part's groups of one kind in both layers (those `pick` accepts). */
  hide(part: string, kind: Kind, pick: (el: SVGGElement) => boolean = () => true): void {
    for (const g of this.groups) if (g.part === part && g.kind === kind && pick(g.el)) g.el.setAttribute('display', 'none');
  }
  /** Gives some of a part's groups a name of their own (lit by that name), e.g. one label among a part's labels. */
  retag(part: string, kind: Kind, pick: (el: SVGGElement) => boolean, tag: string): void {
    for (const g of this.groups) if (g.part === part && g.kind === kind && pick(g.el)) g.part = tag;
  }
  /** The groups of a part (both layers), e.g. to transform them. */
  of(part: string, kind?: Kind): SVGGElement[] { return this.groups.filter(g => g.part === part && (!kind || g.kind === kind)).map(g => g.el); }
  /** Lights the parts: map keys "part" or "part:kind". */
  light(L: LitMap): void {
    for (const g of this.groups) {
      if (g.dim) continue;
      const v = L[`${g.part}:${g.kind}`] ?? L[g.part] ?? 0;
      if (Math.abs(v - g.o) < 0.002) continue;
      g.o = v;
      g.el.setAttribute('opacity', f(v));
    }
  }
}
/** Photorespiration's own molecules (glyphs and names), hidden where an animation is about the cycle only. */
export function hidePhotoresp(S: Strip): void {
  for (const p of ['pg2', 'glycolate', 'glycine', 'serine', 'glycerate', 'nh3', 'co2-out', 'o2']) S.hide(p, 'node');
  S.hide('perox', 'node');
}
/** A lit map from a list of parts (each at level v). */
export const litOf = (parts: string[], v = 1): LitMap => Object.fromEntries(parts.map(p => [p, v]));
/** Cross-fade between two lit maps (u 0 → 1). */
export function mixLit(a: LitMap, b: LitMap, u: number): LitMap {
  const out: LitMap = {};
  for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) out[k] = lerp(a[k] ?? 0, b[k] ?? 0, u);
  return out;
}

/* ---------------------------------------------------------------- camera */

export const camTf = (c: Cam): string => `translate(${f(800 - c.c[0] * c.s)} ${f(370 - c.c[1] * c.s)}) scale(${f(c.s)})`;
/** Beat b's framing is cams[b]; the camera moves there from cams[b − 1] over the beat's first `d` s. */
export const camAt = (cams: Cam[], beat: number, t: number, d = 1.6): Cam =>
  beat === 0 ? cams[0] : lerpCam(cams[beat - 1], cams[beat], ease(t, 0, d));
/** The framing that shows strip x0 … x1 across stage px0 … px1, with the strip's y0 at stage py0. */
export function frame(x0: number, x1: number, px0: number, px1: number, y0: number, py0 = 0): Cam {
  const s = (px1 - px0) / (x1 - x0);
  return { s, c: [x0 + (800 - px0) / s, y0 + (370 - py0) / s] };
}

/* ---------------------------------------------------------------- moving glyphs */

export interface Mover { k: string; svg: string; label?: string; at?: V; cls?: string; anchor?: 'start' | 'middle' | 'end' }
/** A moving glyph drawn at the origin, its label at `at` (relative). */
export const moverSvg = (m: Mover): string =>
  `<g data-k="m-${m.k}" opacity="0">${m.svg}${m.label ? `<text class="${m.cls ?? 'cel-mn'} cel-halo" x="${f(m.at?.[0] ?? 0)}" y="${f(m.at?.[1] ?? -24)}" text-anchor="${m.anchor ?? 'middle'}">${m.label}</text>` : ''}</g>`;
export interface Put { at: V; o: number; s?: number }
export function placer(stage: SVGSVGElement, keys: string[]): (P: Record<string, Put | undefined>) => void {
  const els = new Map(keys.map(k => [k, stage.querySelector(`[data-k="m-${k}"]`) as SVGGElement]));
  return P => {
    for (const [k, el] of els) {
      const pu = P[k];
      const o = pu ? clamp01(pu.o) : 0;
      el.setAttribute('opacity', f(o));
      if (pu && o > 0.003) el.setAttribute('transform', `translate(${f(pu.at[0])} ${f(pu.at[1])})${pu.s && pu.s !== 1 ? ` scale(${f(pu.s)})` : ''}`);
    }
  };
}
/** A number tag beside a glyph (strip units). */
export const numT = (n: number | string, x: number, y: number): string => `<text class="dk2-num cel-halo" x="${f(x)}" y="${f(y)}" text-anchor="middle">${n}</text>`;

/* ---------------------------------------------------------------- ledger (stage units) */

export interface LedRow { name: string; nums: Array<number | string>; total?: string }
/** A ledger card: the unit line, then rows of numerals that light as they are counted, each row's total at its end. */
export function ledgerSvg(p: string, x: number, y: number, w: number, unit: string, rows: LedRow[], o: { nameW?: number; numW?: number } = {}): string {
  const lh = 34, h = 50 + rows.length * lh, nw = o.nameW ?? 150, step = o.numW ?? 26;
  const rs = rows.map((r, i) => {
    const yy = y + 66 + i * lh;
    const nums = r.nums.map((n, j) => `<text data-k="${p}-n${i}-${j}" class="dk2-ln" x="${f(x + 18 + nw + j * step)}" y="${f(yy)}" text-anchor="middle">${n}</text>`).join('');
    const tot = r.total ? `<text data-k="${p}-t${i}" class="dk2-lt" x="${f(x + 18 + nw + (r.nums.length - 0.5) * step + 16)}" y="${f(yy)}" opacity="0">${r.total}</text>` : '';
    return `<text class="dk2-lname" x="${f(x + 18)}" y="${f(yy)}">${r.name}</text>${nums}${tot}`;
  }).join('');
  return `<g data-k="${p}" opacity="0"><rect class="dk2-card" x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="14"/>
    <text class="dk2-unit" x="${f(x + 18)}" y="${f(y + 32)}">${unit}</text>${rs}</g>`;
}
/** Sets row i's count (numerals 1 … n lit, the rest faint) and its total's opacity. */
export function ledgerSetter(stage: SVGSVGElement, p: string, rows: LedRow[]): (i: number, n: number, tot?: number) => void {
  const el = rows.map((r, i) => r.nums.map((_, j) => stage.querySelector(`[data-k="${p}-n${i}-${j}"]`) as SVGTextElement));
  const tl = rows.map((_, i) => stage.querySelector(`[data-k="${p}-t${i}"]`) as SVGTextElement | null);
  const st = new Map<Element, string>();
  const set = (e: Element, a: string, v: string): void => { const k = st.get(e); if (k === `${a}=${v}`) return; st.set(e, `${a}=${v}`); e.setAttribute(a, v); };
  return (i, n, tot = 0) => {
    el[i].forEach((e, j) => set(e, 'class', j < n ? 'dk2-ln dk2-ln-on' : 'dk2-ln'));
    if (tl[i]) tl[i]!.setAttribute('opacity', f(tot));
  };
}

/* ---------------------------------------------------------------- graph panel (stage units) */

export interface Axes { x0: number; y0: number; w: number; h: number; xr: [number, number]; yr: [number, number] }
export const AX = (a: Axes, v: number): number => a.x0 + ((v - a.xr[0]) / (a.xr[1] - a.xr[0])) * a.w;
export const AY = (a: Axes, v: number): number => a.y0 + a.h - ((v - a.yr[0]) / (a.yr[1] - a.yr[0])) * a.h;
/** Axes with ticks and titles; the y title rotated. */
export function axesSvg(a: Axes, xt: number[], yt: number[], xl: string, yl: string, o: { zero?: boolean } = {}): string {
  const b = a.y0 + a.h;
  const xs = xt.map(v => `<path class="dk2-tick" d="M${f(AX(a, v))},${f(b)}v7"/><text class="dk2-tl" x="${f(AX(a, v))}" y="${f(b + 27)}" text-anchor="middle">${v}</text>`).join('');
  const ys = yt.map(v => `<path class="dk2-tick" d="M${f(a.x0)},${f(AY(a, v))}h-7"/><text class="dk2-tl" x="${f(a.x0 - 12)}" y="${f(AY(a, v) + 6)}" text-anchor="end">${v}</text>`).join('');
  const zero = o.zero && a.yr[0] < 0 ? `<path class="dk2-zero" d="M${f(a.x0)},${f(AY(a, 0))}H${f(a.x0 + a.w)}"/>` : '';
  return `${zero}<path class="dk2-axis" d="M${f(a.x0)},${f(a.y0 - 6)}V${f(b)}H${f(a.x0 + a.w + 6)}"/>${xs}${ys}
    <text class="dk2-at" x="${f(a.x0 + a.w / 2)}" y="${f(b + 58)}" text-anchor="middle">${xl}</text>
    <text class="dk2-at" transform="translate(${f(a.x0 - 62)} ${f(a.y0 + a.h / 2)}) rotate(-90)" text-anchor="middle">${yl}</text>`;
}
/** A path of y = fn(x) from x0 to x1 (n samples), in the axes. */
export function fnPath(a: Axes, fn: (x: number) => number, x0: number, x1: number, n = 90): string {
  if (x1 <= x0) return 'M0,0';
  let d = '';
  for (let i = 0; i <= n; i++) { const x = x0 + ((x1 - x0) * i) / n; d += `${i ? 'L' : 'M'}${f(AX(a, x))},${f(AY(a, fn(x)))}`; }
  return d;
}
/** Linear interpolation through data points (x ascending). */
export function interp(pts: Array<[number, number]>): (x: number) => number {
  return x => {
    if (x <= pts[0][0]) return pts[0][1];
    for (let i = 1; i < pts.length; i++) if (x <= pts[i][0]) { const [x0, y0] = pts[i - 1], [x1, y1] = pts[i]; return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0); }
    return pts[pts.length - 1][1];
  };
}
/** A smooth curve through data points (x ascending) that never overshoots them (monotone cubic, Fritsch–Carlson). */
export function monotone(pts: Array<[number, number]>): (x: number) => number {
  const n = pts.length, xs = pts.map(q => q[0]), ys = pts.map(q => q[1]);
  const d = xs.slice(0, -1).map((x, i) => (ys[i + 1] - ys[i]) / (xs[i + 1] - x));
  const m = xs.map((_, i) => (i === 0 ? d[0] : i === n - 1 ? d[n - 2] : d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2));
  for (let i = 0; i < n - 1; i++) {
    if (d[i] === 0) { m[i] = 0; m[i + 1] = 0; continue; }
    const a = m[i] / d[i], b = m[i + 1] / d[i], q = a * a + b * b;
    if (q > 9) { const k = 3 / Math.sqrt(q); m[i] = k * a * d[i]; m[i + 1] = k * b * d[i]; }
  }
  return x => {
    if (x <= xs[0]) return ys[0];
    if (x >= xs[n - 1]) return ys[n - 1];
    let i = 0;
    while (x > xs[i + 1]) i++;
    const h = xs[i + 1] - xs[i], u = (x - xs[i]) / h, u2 = u * u, u3 = u2 * u;
    return (2 * u3 - 3 * u2 + 1) * ys[i] + (u3 - 2 * u2 + u) * h * m[i] + (-2 * u3 + 3 * u2) * ys[i + 1] + (u3 - u2) * h * m[i + 1];
  };
}
/** The panel card. */
export const cardSvg = (x: number, y: number, w: number, h: number): string => `<rect class="dk2-card dk2-panel" x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="18"/>`;

/* ---------------------------------------------------------------- glow behind an acting protein (world) */

export const poolDefs = (p: string): string => `<defs><radialGradient id="${p}-pool"><stop offset="0" class="dk2-pool0"/><stop offset=".55" class="dk2-pool1"/><stop offset="1" class="dk2-pool2"/></radialGradient></defs>`;
export const poolSvg = (p: string, k: string, at: V, rx: number, ry: number): string =>
  `<ellipse data-k="${k}" cx="${f(at[0])}" cy="${f(at[1])}" rx="${f(rx)}" ry="${f(ry)}" fill="url(#${p}-pool)" opacity="0"/>`;

/* ---------------------------------------------------------------- small setters */

export function attrSetter(stage: SVGSVGElement): (k: string, a: string, v: string | number) => void {
  const cache = new Map<string, Element | null>(), last = new Map<string, string>();
  return (k, a, v) => {
    let el = cache.get(k);
    if (el === undefined) { el = stage.querySelector(`[data-k="${k}"]`); cache.set(k, el); }
    if (!el) return;
    const s = typeof v === 'number' ? f(v) : v, key = `${k}|${a}`;
    if (last.get(key) === s) return;
    last.set(key, s);
    if (a === 'text') el.textContent = s; else el.setAttribute(a, s);
  };
}

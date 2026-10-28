// Shared stage kit of chunk pp's animations (slides 11–13, 28 Oct 2026): the slide's chain figure tagged by part (as
// b6f8-common.ts reads it), the two cameras on it, glyph and label helpers, newsprint clippings and readout boxes.
// figs/chain.ts is not modified: every drawing comes from focusSvg(), exactly as the slide figures draw it.
//
// Cameras on the chain (stage 1600 × 740):
// - dive: the slide's figure card fills the stage (WHOLE, as slides 7–10b's animations); the camera zooms into a close
//   view and back out. Text and glyphs are counter-scaled by (s/s₀)^−0.7, as psii7-common.ts and b6f8-common.ts do.
// - window: the slide's figure card shrinks into a map at the top left, and a close-up window opens out of the map's
//   marked part (the look of the slide figures with a crop and a mini-map, pp11f v2 / pp12f v2); at the end the window
//   closes back into the map and the map grows back into the slide figure.
import '../figs/clipping.css';
import './pp-anim.css';
import { atoms, focusSvg, type FocusLook, type Part } from '../figs/chain';
import { wavePath } from '../figs/pp-kit';
import { cutPath, f1, lerp, lerpV, setters, smooth, smoother, tfStr, tw, tween, type Tf, type V } from './antenna-common';

export { cutPath, f1, lerp, lerpV, setters, smooth, smoother, tfStr, tw, tween, wavePath };
export type { Tf, V };
export type Setters = ReturnType<typeof setters>;

/* ================================================================ the chain figure, tagged by part */

export const STYLE: Record<FocusLook, string> = { bil: 'pdb-bilayer', glow: 'bil-glow' };
const PARTS: Part[] = ['psii', 'light-psii', 'water', 'e-water-psii', 'e-psii-pq', 'pq', 'pq-h-in', 'e-pq-b6f', 'b6f', 'pq-h-out',
  'e-b6f-pc', 'pc', 'e-pc-psi', 'psi', 'light-psi', 'e-psi-fd', 'fd', 'e-fd-fnr', 'fnr', 'e-fnr-nadph', 'nadph', 'h-lumen', 'atps', 'atp'];

interface Wrap { a: number; b: number; inner: string; on: boolean }
/** The part wrappers of a chain drawing, in document order (they never nest; their content may hold other groups). */
function wraps(s: string): Wrap[] {
  const out: Wrap[] = [], re = /<g class="chn-(on|off)">/g, tag = /<g[\s>]|<\/g>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(s))) {
    const i0 = m.index + m[0].length;
    let depth = 1, i = i0, t: RegExpExecArray | null;
    tag.lastIndex = i0;
    while (depth && (t = tag.exec(s))) { depth += t[0] === '</g>' ? -1 : 1; i = tag.lastIndex; }
    out.push({ a: m.index, b: i, inner: s.slice(i0, i - 4), on: m[1] === 'on' });
    re.lastIndex = i;
  }
  return out;
}
const strip = (s: string): string => s.replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
/** The slide's chain drawing (inner markup), exactly as focusSvg draws the whole view, in the deck's glyph mode (atom
 *  balls, ringed H⁺, tagged carriers; lecturer, 28 Oct 2026), as the slide figures draw it. */
export const drawChain = (id: string, look: FocusLook, lit: Part[]): string => strip(focusSvg(id, { look, lit, say: '', g: { mol: true } }));

/** The chain drawing with every part wrapper tagged data-p="<part>" (found by flipping one part's lit state at a time).
 *  `up`: parts dimmed on the slide that the story lights later; a lit copy of each, data-p="<part>-lit", opacity 0, is
 *  added right after the dimmed one. `down`: parts lit on the slide that the story dims for a while; a dimmed copy,
 *  data-p="<part>-dim", opacity 0, is added right under the lit one. */
export function taggedChain(id: string, look: FocusLook, lit: Part[], o: { up?: Part[]; down?: Part[] } = {}): string {
  const base = drawChain(id, look, lit), wb = wraps(base), parts: Array<Part | null> = wb.map(() => null);
  for (const p of PARTS) {
    const alt = wraps(drawChain(`${id}q`, look, lit.includes(p) ? lit.filter(x => x !== p) : [...lit, p]));
    if (alt.length === wb.length) alt.forEach((w, i) => { if (w.on !== wb[i].on) parts[i] = p; });
  }
  const up = o.up ?? [], down = o.down ?? [];
  const wu = up.length ? wraps(drawChain(id, look, [...lit, ...up])) : [];
  const wd = down.length ? wraps(drawChain(id, look, lit.filter(p => !down.includes(p)))) : [];
  let svg = '', at = 0;
  wb.forEach((w, i) => {
    const p = parts[i] ?? 'x';
    svg += base.slice(at, w.a);
    if (p !== 'x' && down.includes(p as Part) && wd.length === wb.length) svg += `<g class="chn-off" data-p="${p}-dim" opacity="0" display="none">${wd[i].inner}</g>`;
    svg += `<g class="chn-${w.on ? 'on' : 'off'}" data-p="${p}">${w.inner}</g>`;
    if (p !== 'x' && up.includes(p as Part) && wu.length === wb.length) svg += `<g class="chn-on" data-p="${p}-lit" opacity="0" display="none">${wu[i].inner}</g>`;
    at = w.b;
  });
  return svg + base.slice(at);
}

/* ================================================================ camera */

/** The whole chain: the slide's figure card (860 × 642 px around the 800 × 600 figure drawn at 0.97) fills the stage. */
export const WHOLE: Tf = { s: 1.07, t: [800 - 1.07 * 400, 370 - 1.07 * 300] };
/** The slide's figure card, in figure units (pilot.css .lay-figure .fig, with the paper look's fill and edge). */
export const CARD = { x: -43.3, y: -30.9, w: 886.6, h: 661.9, r: 22.7 };
/** A view centred on figure point c at scale s. */
export const view = (c: V, s: number): Tf => ({ s, t: [800 - s * c[0], 370 - s * c[1]] });
/** The view whose figure window [x, y, w, h] fills the stage rectangle [X, Y, W, H] (width-matched). */
export const fit = (win: [number, number, number, number], R: [number, number, number, number]): Tf => {
  const s = R[2] / win[2];
  return { s, t: [R[0] - s * win[0], R[1] - s * win[1]] };
};
/** Text and glyph scale for a camera scale s (1 in the whole view). */
export const kOf = (s: number): number => (s / WHOLE.s) ** -0.7;
/** A move of about 1 s: 0 → 1 from t0 over d, eased at both ends. */
export const mv = (t: number, t0: number, d: number): number => smoother((t - t0) / d);
/** 0 → 1 over [t0, t0 + d] (smooth). */
export const fade = (t: number, t0: number, d = 0.25): number => tw(t, t0, t0 + d);
/** A short pulse: up over 0.1 s from t0, down by t0 + 0.6. */
export const pulse = (t: number, t0: number): number => tw(t, t0, t0 + 0.1) * (1 - tw(t, t0 + 0.25, t0 + 0.6));
/** A point on a figure → the stage, under view v. */
export const onStage = (v: Tf, p: V): V => [v.s * p[0] + v.t[0], v.s * p[1] + v.t[1]];

/** The slide's figure card (drawn inside the camera group, in figure units). */
export const slideCard = (p: string): string =>
  `<defs><filter id="${p}-sl" x="-5%" y="-5%" width="110%" height="112%"><feDropShadow dx="0" dy="8" stdDeviation="9" flood-color="#46321a" flood-opacity=".14"/></filter></defs>
  <rect class="ppa-slidecard" x="${CARD.x}" y="${CARD.y}" width="${CARD.w}" height="${CARD.h}" rx="${CARD.r}" filter="url(#${p}-sl)"/>`;

/** The chain group of a staging: its texts and H⁺ dots are counter-scaled with the camera. */
export function chainGroup(k: string, look: FocusLook, inner: string): string {
  return `<g data-k="${k}" class="chn chn-${STYLE[look]} chn-fx">${inner}</g>`;
}
/** The centre of a glyph group (glyph mode's .chn-g: atom balls, ringed H⁺, tag rows), from its circles and rects. */
function glyphCentre(el: Element): V {
  const pts: V[] = [];
  el.querySelectorAll('circle').forEach(c => pts.push([Number(c.getAttribute('cx')), Number(c.getAttribute('cy'))]));
  el.querySelectorAll('rect').forEach(r => pts.push([Number(r.getAttribute('x')) + Number(r.getAttribute('width')) / 2, Number(r.getAttribute('y')) + Number(r.getAttribute('height')) / 2]));
  if (!pts.length) return [0, 0];
  const xs = pts.map(q => q[0]), ys = pts.map(q => q[1]);
  return [(Math.min(...xs) + Math.max(...xs)) / 2, (Math.min(...ys) + Math.max(...ys)) / 2];
}
/** Counter-scales the texts, H⁺ dots and glyphs of a chain group: call with k (1 = the slide's size); `textOp` fades its
 *  texts. A glyph (.chn-g) scales as one piece about its centre, so its balls, rings and letters stay together. */
export function counterScaler(g: Element, S: Setters): (k: number, textOp?: number) => void {
  const inGlyph = (el: Element): boolean => !!el.parentElement?.closest('.chn-g');
  const texts = Array.from(g.querySelectorAll<SVGTextElement>('text')).filter(el => !inGlyph(el)).map(el => ({ el, x: Number(el.getAttribute('x')), y: Number(el.getAttribute('y')) }));
  const hds = Array.from(g.querySelectorAll<SVGCircleElement>('circle.chn-hd')).map(el => ({ el, r: Number(el.getAttribute('r')) }));
  const glyphs = Array.from(g.querySelectorAll<SVGGElement>('g.chn-g')).filter(el => !inGlyph(el)).map(el => ({ el, c: glyphCentre(el) }));
  return (k, textOp = 1) => {
    texts.forEach(({ el, x, y }) => {
      S.set(el, 'transform', `matrix(${k.toFixed(4)},0,0,${k.toFixed(4)},${(x * (1 - k)).toFixed(2)},${(y * (1 - k)).toFixed(2)})`);
      S.set(el, 'opacity', textOp >= 0.996 ? '1' : textOp.toFixed(3));
    });
    hds.forEach(({ el, r }) => S.set(el, 'r', (r * k).toFixed(2)));
    glyphs.forEach(({ el, c }) => S.set(el, 'transform', `matrix(${k.toFixed(4)},0,0,${k.toFixed(4)},${(c[0] * (1 - k)).toFixed(2)},${(c[1] * (1 - k)).toFixed(2)})`));
  };
}
/** The groups of a tagged chain for one part (its wrapper, or its -lit / -dim copy). */
export const partsIn = (g: Element, p: string): SVGGElement[] => Array.from(g.querySelectorAll<SVGGElement>(`[data-p="${p}"]`));

/* ---------------------------------------------------------------- the window camera */

/** Layout of the window camera: the map (the slide card shrunk), the close-up window on the stage, and the figure window
 *  it shows. */
export interface WinLayout { map: Tf; win: [number, number, number, number]; R: [number, number, number, number] }
/** The window's markup: its clip (animated) and the close-up content (chain copy + story, in figure units). `x` suffixes
 *  the window's keys, for a stage with two windows. */
export function windowSvg(p: string, content: string, x = ''): string {
  return `<defs><clipPath id="${p}-wclip${x}"><rect data-k="wclip${x}" x="0" y="0" width="10" height="10" rx="18"/></clipPath>
    <filter id="${p}-wsh${x}" x="-5%" y="-5%" width="110%" height="112%"><feDropShadow dx="0" dy="8" stdDeviation="9" flood-color="#46321a" flood-opacity=".16"/></filter></defs>
    <g data-k="wbox${x}" opacity="0" display="none"><rect data-k="wbg${x}" class="ppa-winbg" x="0" y="0" width="10" height="10" rx="18" filter="url(#${p}-wsh${x})"/>
      <g clip-path="url(#${p}-wclip${x})"><g data-k="wcam${x}"><g class="fig">${content}</g></g></g>
      <rect data-k="wedge${x}" class="ppa-winedge" x="0" y="0" width="10" height="10" rx="18"/></g>
    <rect data-k="wmark${x}" class="ppa-mark" x="0" y="0" width="10" height="10" rx="5" opacity="0" display="none"/>`;
}
/** Draws the window camera at opening e (0: the slide card whole, no window; 1: map + window). Returns the map's view and
 *  the window content's view (for counter-scaling). `x`: the window's key suffix; `moveMap: false` leaves the map's
 *  transform alone (a second window on the same map). */
export function drawWindow(S: Setters, L: WinLayout, e: number, mapG: Element, x = '', moveMap = true): { map: Tf; inner: Tf } {
  const map = tween(WHOLE, L.map, e);
  if (moveMap) S.set(mapG, 'transform', tfStr(map));
  const [wx, wy, ww, wh] = L.win;
  const m0 = onStage(map, [wx, wy]), m1 = onStage(map, [wx + ww, wy + wh]);
  const r0: [number, number, number, number] = [m0[0], m0[1], m1[0] - m0[0], m1[1] - m0[1]];
  // the window grows out of its mark on the map: corners glide, so the content stays put at the start
  const u = smooth((e - 0.08) / 0.92);
  const R: [number, number, number, number] = [lerp(r0[0], L.R[0], u), lerp(r0[1], L.R[1], u), lerp(r0[2], L.R[2], u), lerp(r0[3], L.R[3], u)];
  const inner = fit(L.win, R);
  for (const k of ['wclip', 'wbg', 'wedge']) {
    const el = S.q(k + x);
    S.set(el, 'x', f1(R[0])); S.set(el, 'y', f1(R[1])); S.set(el, 'width', f1(R[2])); S.set(el, 'height', f1(R[3]));
    S.set(el, 'rx', f1(lerp(4, 18, u)));
  }
  S.set(S.q(`wcam${x}`), 'transform', tfStr(inner));
  S.op(S.q(`wbox${x}`), tw(e, 0, 0.12));
  const mk = S.q(`wmark${x}`);
  S.set(mk, 'x', f1(r0[0])); S.set(mk, 'y', f1(r0[1])); S.set(mk, 'width', f1(r0[2])); S.set(mk, 'height', f1(r0[3]));
  S.op(mk, tw(e, 0.5, 1));
  return { map, inner };
}

/* ================================================================ glyphs and labels */

/** A glyph group, drawn round its origin, hidden until placed. */
export const glyph = (k: string, inner: string, o = 0): string => `<g data-k="${k}" opacity="${o}"${o ? '' : ' display="none"'}>${inner}</g>`;
export const lab = (s: string, cls: string, x: number, y: number, a: 'start' | 'middle' | 'end' = 'start'): string =>
  `<text class="${cls}" x="${x}" y="${y}" text-anchor="${a}">${s}</text>`;
/** Places glyph k at figure point `at`, scaled sc, at opacity o. */
export function putter(S: Setters): (k: string, at: V, sc: number, o: number, rot?: number) => void {
  return (k, at, sc, o, rot = 0) => {
    const el = S.q(k);
    if (!el) return;
    S.op(el, o);
    if (o > 0.004) S.set(el, 'transform', `translate(${f1(at[0])} ${f1(at[1])}) scale(${sc.toFixed(4)})${rot ? ` rotate(${rot.toFixed(1)})` : ''}`);
  };
}
/** Arrowhead markers in the deck's inks (size follows the stroke width). */
export const INK = { green: '#2a963a', grey: '#8a877d', red: '#c8361e', amber: '#e0a21a', clay: '#a65a32', ink: '#3d3d3a', orange: '#d9821e', blue: '#2350e6' };
export type Ink = keyof typeof INK;
export function markers(p: string): string {
  return `<defs>${(Object.keys(INK) as Ink[]).map(k => `<marker id="${p}-m-${k}" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="3.2" markerHeight="3.2" orient="auto-start-reverse"><path d="M0,0L10,5L0,10z" fill="${INK[k]}"/></marker>`).join('')}</defs>`;
}
/** A wavy arrow (heat, fluorescence, light) from a to b, or a straight one (wave = 0). */
export const waveArrow = (p: string, k: string, ink: Ink, a: V, b: V, amp = 6, n = 3.5, w = 3.4, head = true): string =>
  `<path data-k="${k}" class="ppa-ar" stroke="${INK[ink]}" style="stroke-width:${w}" d="${amp ? wavePath(a[0], a[1], b[0], b[1], amp, n) : `M${f1(a[0])},${f1(a[1])}L${f1(b[0])},${f1(b[1])}`}"${head ? ` marker-end="url(#${p}-m-${ink})"` : ''} opacity="0" display="none"/>`;
/** Sets a stroked glyph's width and opacity. */
export function stroke(S: Setters, k: string, w: number, o: number): void {
  const el = S.q(k);
  if (!el) return;
  S.op(el, o);
  S.set(el, 'style', `stroke-width:${w.toFixed(2)}`);
}

/** A 9-point burst (damage mark), drawn round the origin. */
export function burst(r1: number, r2: number, n = 9): string {
  const pts = Array.from({ length: n * 2 }, (_, i) => {
    const a = (i * Math.PI) / n - Math.PI / 2, r = i % 2 ? r2 : r1;
    return `${f1(r * Math.cos(a))},${f1(r * Math.sin(a))}`;
  });
  return `<path class="ppa-burst" d="M${pts.join('L')}Z"/>`;
}
/** O₂ as the deck's glyph: two O balls with their letters, centred on the origin (r at least 8 so the letters fit). */
export const o2 = (r = 8): string => atoms(0, 0, 'OO', Math.max(8, r));

/* ================================================================ newsprint clippings and readout boxes (stage units) */

export interface Pic { href: string; w: number; h: number }
/** A newsprint clipping holding a picture (cropped to `crop` = [u0, v0, uw, vh] in picture pixels), slightly turned, with an
 *  optional headline above the picture and a credit line under it. Returns the svg (group k, hidden) and a map from
 *  picture pixels to the stage (before the turn). */
export function clipping(p: string, k: string, x: number, y: number, w: number, pic: Pic,
  o: { crop?: [number, number, number, number]; head?: string; credit?: string; rot?: number; m?: number; seed?: number; over?: (at: (u: number, v: number) => V) => string } = {}):
  { svg: string; h: number; at: (u: number, v: number) => V } {
  const m = o.m ?? 20, [u0, v0, uw, vh] = o.crop ?? [0, 0, pic.w, pic.h];
  const head = o.head ? 40 : 0, cred = o.credit ? 26 : 0;
  const pw = w - 2 * m, sc = pw / uw, ph = vh * sc, h = head + ph + 2 * m + cred;
  const px = x + m, py = y + m + head;
  const at = (u: number, v: number): V => [px + (u - u0) * sc, py + (v - v0) * sc];
  const rot = o.rot ?? -1.2;
  return {
    h, at,
    svg: `<g data-k="${k}" opacity="0" display="none"><g transform="rotate(${rot} ${f1(x + w / 2)} ${f1(y + h / 2)})">
      <defs><filter id="${p}-${k}-sh" x="-10%" y="-8%" width="120%" height="118%"><feDropShadow dx="1" dy="4" stdDeviation="6" flood-color="#3d3020" flood-opacity=".22"/></filter>
        <clipPath id="${p}-${k}-cl"><rect x="${f1(px)}" y="${f1(py)}" width="${f1(pw)}" height="${f1(ph)}"/></clipPath></defs>
      <path class="clip-paper" d="${cutPath(x, y, w, h, o.seed ?? 41, 3.2)}" filter="url(#${p}-${k}-sh)"/>
      ${o.head ? `<text class="clip-name ppa-head" x="${f1(px)}" y="${f1(y + m + 26)}">${o.head}</text>` : ''}
      <g clip-path="url(#${p}-${k}-cl)"><image href="${pic.href}" x="${f1(px - u0 * sc)}" y="${f1(py - v0 * sc)}" width="${f1(pic.w * sc)}" height="${f1(pic.h * sc)}" preserveAspectRatio="none"/></g>
      ${o.over ? o.over(at) : ''}
      ${o.credit ? `<text class="ppa-cr" x="${f1(x + w - m)}" y="${f1(py + ph + 22)}" text-anchor="end">${o.credit}</text>` : ''}</g></g>`,
  };
}
/** A readout box (stage units), fixed on the stage, shown from the start. */
export const box = (p: string, x: number, y: number, w: number, h: number, inner: string, k = 'ro'): string =>
  `<g data-k="${k}"><defs><filter id="${p}-${k}sh" x="-10%" y="-10%" width="120%" height="125%"><feDropShadow dx="0" dy="6" stdDeviation="7" flood-color="#46321a" flood-opacity=".12"/></filter></defs>
    <rect class="ppa-box" x="${x}" y="${y}" width="${w}" height="${h}" rx="16" filter="url(#${p}-${k}sh)"/>${inner}</g>`;
/** A number shown with fixed decimals. */
export const num = (v: number, d = 2): string => v.toFixed(d);

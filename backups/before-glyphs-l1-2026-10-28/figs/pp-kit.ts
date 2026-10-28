// Shared drawing kit of chunk pp (slides 11–13: excess light, photoprotection, chlorophyll fluorescence; 28 Oct 2026).
// Text, arrows, waves, plots, placed paper figures with masks, label pills and callouts, and the light-reaction chain of
// slides 7–10b (./chain.ts, focusSvg) with this chunk's parts drawn over it. chain.ts itself is not changed: the overlays
// are added after its markup, in chain units (whole view) or through a crop transform (close-up views).
import './pp.css';
import { focusSvg, type FocusView } from './chain';

export type A = 'start' | 'middle' | 'end';
export type Pt = [number, number];
export type K = 'ink' | 'red' | 'green' | 'grey' | 'clay' | 'orange' | 'amber' | 'blue' | 'violet';
const KS: K[] = ['ink', 'red', 'green', 'grey', 'clay', 'orange', 'amber', 'blue', 'violet'];

export const f = (v: number): string => v.toFixed(1);
export const T = (x: number, y: number, s: string, cls = 'pp-l', a: A = 'middle'): string =>
  `<text class="${cls}" x="${f(x)}" y="${f(y)}" text-anchor="${a}">${s}</text>`;
/** Text turned to read upwards, centred on (x, y). */
export const TV = (x: number, y: number, s: string, cls = 'pp-ax'): string =>
  `<text class="${cls}" transform="translate(${f(x)} ${f(y)}) rotate(-90)" text-anchor="middle">${s}</text>`;
export const it = (s: string): string => `<tspan class="pp-i">${s}</tspan>`;
export const sub = (s: string): string => `<tspan baseline-shift="sub" font-size="70%">${s}</tspan>`;
/** Fluorescence parameters: F with a subscript (o, m, s, v) and an optional prime. */
export const F = (s: string, prime = false): string => `F${sub(s)}${prime ? '′' : ''}`;
export const FVFM = `${F('v')}/${F('m')}`;
export const PHI2 = `Φ${sub('PSII')}`;
export const CHLA = `Chl ${it('a')}`;

/** Arrowheads in every ink, a glow gradient; prefixed per figure. */
export const defs = (p: string, extra = ''): string => `<defs>${KS.map(k =>
  `<marker id="${p}-${k}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4.6" markerHeight="4.6" orient="auto-start-reverse"><path class="pp-hd-${k}" d="M0,0L10,5L0,10z"/></marker>`).join('')}
  <radialGradient id="${p}-glow"><stop offset="0" class="pp-glow0"/><stop offset=".5" class="pp-glow1"/><stop offset="1" class="pp-glow2"/></radialGradient>${extra}</defs>`;
export const ar = (p: string, k: K, d: string, cls = ''): string =>
  `<path class="pp-ar pp-k-${k}${cls ? ` ${cls}` : ''}" d="${d}" marker-end="url(#${p}-${k})"/>`;
/** A line without a head. */
export const ln = (k: K, d: string, cls = ''): string => `<path class="pp-ar pp-k-${k}${cls ? ` ${cls}` : ''}" d="${d}"/>`;
/** A sine wave along the segment a → b (photons, fluorescence, heat), ending straight for its arrowhead. */
export function wavePath(x0: number, y0: number, x1: number, y1: number, amp = 7, n = 4.5): string {
  const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, pts: string[] = [];
  const stop = 1 - 10 / L;
  for (let i = 0; i <= 90; i++) {
    const t = (i / 90) * stop, w = Math.sin(t * n * 2 * Math.PI) * amp * Math.min(1, (stop - t) * 6, t * 12 + 0.2);
    pts.push(`${i ? 'L' : 'M'}${f(x0 + dx * t - uy * w)},${f(y0 + dy * t + ux * w)}`);
  }
  pts.push(`L${f(x1)},${f(y1)}`);
  return pts.join('');
}
export const wv = (p: string, k: K, x0: number, y0: number, x1: number, y1: number, amp = 7, n = 4.5, cls = ''): string =>
  `<path class="pp-ar pp-k-${k}${cls ? ` ${cls}` : ''}" d="${wavePath(x0, y0, x1, y1, amp, n)}" marker-end="url(#${p}-${k})"/>`;
export const glow = (p: string, x: number, y: number, r = 40): string => `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="url(#${p}-glow)"/>`;

export const svg = (label: string, body: string): string =>
  `<svg class="fig-svg pp" viewBox="0 0 800 600" role="img" aria-label="${label}">${body}</svg>`;
export const credit = (x: number, y: number, s: string, a: A = 'end'): string => T(x, y, s, 'pp-cr', a);

/** A label pill (white rounded box), with an optional leader to `to`. */
export function pill(x: number, y: number, s: string, to?: Pt, cls = 'pp-pill', w0?: number): string {
  const w = w0 ?? s.replace(/<[^>]+>/g, '').length * 11 + 26;
  let ld = '';
  if (to) {
    const dx = to[0] - x, dy = to[1] - y;
    const t = Math.min(Math.abs(dx) > 1e-6 ? (w / 2) / Math.abs(dx) : 1e9, Math.abs(dy) > 1e-6 ? 17 / Math.abs(dy) : 1e9);
    ld = leader([x + dx * Math.min(t, 1), y + dy * Math.min(t, 1)], to);
  }
  return `${ld}<rect class="pp-pillbg" x="${f(x - w / 2)}" y="${f(y - 17)}" width="${f(w)}" height="34" rx="17"/>${T(x, y + 7, s, cls)}`;
}
/** A thin leader with a halo, ending in a dot. */
export function leader(a: Pt, b: Pt): string {
  const d = `M${f(a[0])},${f(a[1])}L${f(b[0])},${f(b[1])}`;
  return `<path class="pp-ldh" d="${d}"/><path class="pp-ld" d="${d}"/><circle class="pp-ldt" cx="${f(b[0])}" cy="${f(b[1])}" r="3.4"/>`;
}
/** A label with a leader from `from` (default: just under the label) to `to`. */
export function callout(x: number, y: number, s: string, to: Pt, a: A = 'middle', cls = 'pp-lb', from?: Pt): string {
  return `${leader(from ?? [x, y + 8], to)}${T(x, y, s, `${cls} pp-halo`, a)}`;
}

/* ---------- plots ---------- */

export interface Axes { x0: number; y0: number; x1: number; y1: number; X: (v: number) => number; Y: (v: number) => number }
/** Linear axes from (xa, ya) data ranges to the box x0..x1, y1(top)..y0(bottom). */
export function axes(x0: number, y0: number, x1: number, y1: number, xr: [number, number], yr: [number, number]): Axes {
  return {
    x0, y0, x1, y1,
    X: v => x0 + ((v - xr[0]) / (xr[1] - xr[0])) * (x1 - x0),
    Y: v => y0 - ((v - yr[0]) / (yr[1] - yr[0])) * (y0 - y1),
  };
}
/** The axis lines with ticks and labels. */
export function frame(a: Axes, xt: number[], yt: number[], xl: string, yl: string, o: { xfmt?: (v: number) => string; yfmt?: (v: number) => string; ylx?: number; yly?: number } = {}): string {
  const xf = o.xfmt ?? ((v: number) => `${v}`), yf = o.yfmt ?? ((v: number) => `${v}`);
  return `<path class="pp-axis" d="M${a.x0},${a.y1 - 6}V${a.y0}H${a.x1 + 6}"/>
    ${xt.map(v => `<path class="pp-axis" d="M${f(a.X(v))},${a.y0}v8"/>${T(a.X(v), a.y0 + 32, xf(v), 'pp-tk')}`).join('')}
    ${yt.map(v => `<path class="pp-axis" d="M${a.x0},${f(a.Y(v))}h-8"/>${T(a.x0 - 14, a.Y(v) + 7, yf(v), 'pp-tk', 'end')}`).join('')}
    ${xl ? T((a.x0 + a.x1) / 2, a.y0 + 66, xl, 'pp-ax') : ''}${yl ? TV(o.ylx ?? a.x0 - 62, o.yly ?? (a.y0 + a.y1) / 2, yl) : ''}`;
}
/** A smooth path through points (Catmull–Rom as cubic Béziers). */
export function smooth(q: Pt[]): string {
  let d = `M${f(q[0][0])},${f(q[0][1])}`;
  for (let i = 0; i < q.length - 1; i++) {
    const p0 = q[Math.max(0, i - 1)], p1 = q[i], p2 = q[i + 1], p3 = q[Math.min(q.length - 1, i + 2)];
    d += `C${f(p1[0] + (p2[0] - p0[0]) / 6)},${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)},${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])},${f(p2[1])}`;
  }
  return d;
}
export const poly = (q: Pt[]): string => q.map(([x, y], i) => `${i ? 'L' : 'M'}${f(x)},${f(y)}`).join('');
/** A data marker: filled or open square, circle or triangle. */
export function mark(kind: 'sq' | 'ci' | 'tr' | 'td', filled: boolean, x: number, y: number, r: number, col: string): string {
  const fill = filled ? col : '#fffdf8', st = `class="pp-mk" fill="${fill}" stroke="${col}"`;
  if (kind === 'sq') return `<rect ${st} x="${f(x - r)}" y="${f(y - r)}" width="${f(2 * r)}" height="${f(2 * r)}"/>`;
  if (kind === 'ci') return `<circle ${st} cx="${f(x)}" cy="${f(y)}" r="${f(r)}"/>`;
  const s = kind === 'tr' ? 1 : -1;
  return `<path ${st} d="M${f(x)},${f(y - s * r * 1.2)}L${f(x + r * 1.1)},${f(y + s * r * 0.8)}L${f(x - r * 1.1)},${f(y + s * r * 0.8)}Z"/>`;
}

/* ---------- paper figures ---------- */

export interface Img { href: string; w: number; h: number }
export interface Shot { svg: string; at: (u: number, v: number) => Pt; h: number; s: number }
/** [u0, v0, u1, v1] in image pixels, optional fill. */
export type Mask = [number, number, number, number, string?];
/** A paper figure placed at (x, y), width w; `win` crops it (image pixels), masks cover its own text; `mult` multiplies a
 *  white ground into the page. */
export function shot(id: string, im: Img, x: number, y: number, w: number,
  o: { win?: [number, number, number, number]; masks?: Mask[]; discs?: Array<[number, number, number, string]>; mult?: boolean; rx?: number } = {}): Shot {
  const [u0, v0, uw, vh] = o.win ?? [0, 0, im.w, im.h];
  const s = w / uw, h = vh * s, ox = x - u0 * s, oy = y - v0 * s;
  const img = `<image href="${im.href}" x="${f(ox)}" y="${f(oy)}" width="${f(im.w * s)}" height="${f(im.h * s)}" preserveAspectRatio="none"/>`;
  const masks = (o.masks ?? []).map(([a, b, c, d, fill]) =>
    `<rect x="${f(ox + a * s)}" y="${f(oy + b * s)}" width="${f((c - a) * s)}" height="${f((d - b) * s)}" fill="${fill ?? '#ffffff'}"/>`).join('')
    + (o.discs ?? []).map(([u, v, r, fill]) => `<circle cx="${f(ox + u * s)}" cy="${f(oy + v * s)}" r="${f(r * s)}" fill="${fill}"/>`).join('');
  const clip = `<clipPath id="${id}"><rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="${o.rx ?? 0}"/></clipPath>`;
  return { svg: `<defs>${clip}</defs><g clip-path="url(#${id})"${o.mult ? ' class="pp-mult"' : ''}>${img}${masks}</g>`, at: (u, v) => [ox + u * s, oy + v * s], h, s };
}

/* ---------- the light-reaction chain of slides 7–10b, with this chunk's parts over it ---------- */

/** Photosystem II in the c2c layout (chain units): the render spans x 14–210, y 260–378; the membrane band y 281–319;
 *  its water-splitting site (OEC) and Q_B site; the antenna sits at both ends of the supercomplex. */
export const PS2 = { x0: 14, x1: 210, top: 260, bot: 378, m0: 281, m1: 319, oec: [144.7, 326.6] as Pt, qb: [150.5, 288.5] as Pt, antL: [42, 300] as Pt, antR: [188, 300] as Pt };

/** The whole chain (800 × 600 chain units = figure units) with svg added over it. */
export function chainWhole(id: string, v: FocusView, over: string): string {
  return focusSvg(id, v).replace(/<\/svg>\s*$/, `${over}</svg>`);
}

/** The chain's inner markup and its svg classes, for placing it inside another figure. */
function chainInner(id: string, v: FocusView): { cls: string; body: string } {
  const s = focusSvg(id, v);
  const cls = /class="([^"]*)"/.exec(s)?.[1] ?? 'fig-svg chn';
  return { cls: cls.replace('fig-svg', '').trim(), body: s.replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '') };
}

/** A close-up of the chain: chain window `win` = [x0, y0, width] scaled into the box [X, Y, W, H] (rounded, clipped),
 *  chain text hidden (labels are set again at figure size by the caller). Returns the svg and a map chain → figure. */
export function chainCrop(id: string, v: FocusView, win: [number, number, number], box: [number, number, number, number], rx = 16):
  { svg: string; M: (q: Pt) => Pt; z: number } {
  const [x0, y0, w] = win, [X, Y, W, H] = box, z = W / w;
  const { cls, body } = chainInner(id, v);
  const M = (q: Pt): Pt => [X + (q[0] - x0) * z, Y + (q[1] - y0) * z];
  return {
    z, M,
    svg: `<defs><clipPath id="${id}-cc"><rect x="${f(X)}" y="${f(Y)}" width="${f(W)}" height="${f(H)}" rx="${rx}"/></clipPath></defs>
      <g clip-path="url(#${id}-cc)"><g class="${cls} chn-notext" transform="translate(${f(X - x0 * z)} ${f(Y - y0 * z)}) scale(${f(z)})">${body}</g></g>`,
  };
}

/** The whole chain small, as a map, with the window `win` (chain units, [x0, y0, w, h]) marked. */
export function chainMap(id: string, v: FocusView, at: Pt, k: number, rows: [number, number], win: [number, number, number, number]): string {
  const { cls, body } = chainInner(id, v);
  const mw = 800 * k, mh = (rows[1] - rows[0]) * k;
  return `<g transform="translate(${f(at[0])} ${f(at[1])})"><rect class="pp-map" x="-1" y="-1" width="${f(mw + 2)}" height="${f(mh + 2)}" rx="7"/>
    <defs><clipPath id="${id}-mc"><rect x="0" y="0" width="${f(mw)}" height="${f(mh)}" rx="6"/></clipPath></defs>
    <g clip-path="url(#${id}-mc)"><g class="${cls} chn-notext" transform="translate(0 ${f(-rows[0] * k)}) scale(${k})">${body}</g></g>
    <rect class="pp-ring" x="${f(win[0] * k)}" y="${f((win[1] - rows[0]) * k)}" width="${f(win[2] * k)}" height="${f(win[3] * k)}" rx="4"/></g>`;
}

/* ---------- drawn parts shared by the three slides ---------- */

/** H⁺ as a small labelled disc. */
export const hplus = (x: number, y: number, r = 13): string =>
  `<circle class="pp-h" cx="${f(x)}" cy="${f(y)}" r="${r}"/><text class="pp-hp" x="${f(x)}" y="${f(y + r * 0.42)}" text-anchor="middle" style="font-size:${f(r * 1.2)}px">H⁺</text>`;
/** A xanthophyll as a zig-zag chain with two end rings: violaxanthin (yellow, epoxide dots) or zeaxanthin (orange). */
export function xan(x: number, y: number, len: number, kind: 'v' | 'a' | 'z', r = 9): string {
  const n = 8, dx = len / n, pts: Pt[] = [];
  for (let i = 0; i <= n; i++) pts.push([x + r * 1.6 + i * dx, y + (i % 2 ? -5 : 5)]);
  const col = kind === 'z' ? '#d9821e' : kind === 'a' ? '#e0a21a' : '#c9a227';
  const ring = (cx: number): string => `<polygon class="${kind === 'z' ? 'pp-xz' : 'pp-xv'}" points="${[0, 1, 2, 3, 4, 5].map(i => `${f(cx + r * Math.cos(Math.PI / 6 + (i * Math.PI) / 3))},${f(y + r * Math.sin(Math.PI / 6 + (i * Math.PI) / 3))}`).join(' ')}"/>`;
  const ep = (cx: number): string => `<circle cx="${f(cx)}" cy="${f(y - r - 4)}" r="3.6" fill="#b8301b"/>`;
  const x2 = x + r * 3.2 + len;
  return `<path class="pp-xchain" stroke="${col}" d="${poly(pts)}"/>${ring(x + r)}${ring(x2 - r)}${kind === 'v' ? ep(x + r) + ep(x2 - r) : kind === 'a' ? ep(x + r) : ''}`;
}

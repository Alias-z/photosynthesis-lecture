// Shared drawing kit of chunk cc (lecture 2 slides C11–C13: C₃ refixation → C₂ → C₄, plus CAM), 28 Oct 2026.
// One vocabulary on all three slides: chloroplast green, mitochondrion clay (dark = with glycine decarboxylase),
// peroxisome sand, CO₂ as atom balls, glycine route clay dashed, C₄-acid route teal, CO₂ escaping grey dotted.
// Real images sit in `shot()` windows; figures from papers multiply into the page and carry a grey credit line.
import { molecule } from '../illus';
import './cc.css';

export type A = 'start' | 'middle' | 'end';
export type Pt = [number, number];
export interface Img { href: string; w: number; h: number }
export interface Shot { svg: string; at: (u: number, v: number) => Pt; h: number; x: number; y: number; w: number }

export const f = (v: number): string => v.toFixed(1);
export const T = (x: number, y: number, s: string, cls = 'fcc-l', a: A = 'middle'): string =>
  `<text class="${cls}" x="${f(x)}" y="${f(y)}" text-anchor="${a}">${s}</text>`;
/** Rotated axis title centred on (x, y). */
export const TV = (x: number, y: number, s: string, cls = 'fcc-at'): string =>
  `<text class="${cls}" x="${f(x)}" y="${f(y)}" text-anchor="middle" transform="rotate(-90 ${f(x)} ${f(y)})">${s}</text>`;
export const it = (s: string): string => `<tspan font-style="italic">${s}</tspan>`;
export const svg = (label: string, body: string, cls = ''): string =>
  `<svg class="fig-svg fcc${cls ? ` ${cls}` : ''}" viewBox="0 0 800 600" role="img" aria-label="${label}">${body}</svg>`;

/** A real image: the window win = [u0, v0, width, height] of it (image pixels), shown w wide at x, y. A published figure
 *  ('fig') multiplies into the page; a photo or micrograph gets a rounded frame. at() maps image pixels to the figure. */
export function shot(id: string, im: Img, x: number, y: number, w: number,
  o: { win?: [number, number, number, number]; fig?: boolean; r?: number } = {}): Shot {
  const [u0, v0, uw, vh] = o.win ?? [0, 0, im.w, im.h];
  const s = w / uw, h = vh * s, ox = x - u0 * s, oy = y - v0 * s;
  const img = `<image href="${im.href}" x="${f(ox)}" y="${f(oy)}" width="${f(im.w * s)}" height="${f(im.h * s)}" preserveAspectRatio="none"/>`;
  const r = o.fig ? 0 : (o.r ?? 12);
  const clip = `<clipPath id="${id}"><rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="${r}"/></clipPath>`;
  const frame = o.fig ? '' : `<rect class="fcc-frame" x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="${r}"/>`;
  return {
    svg: `${clip}<g clip-path="url(#${id})"${o.fig ? ' class="fcc-mult"' : ''}>${img}</g>${frame}`,
    at: (u, v) => [ox + u * s, oy + v * s], h, x, y, w,
  };
}

/** Width of a label in px at the pill size (Inter 19 px semibold, rough). */
const textW = (s: string, k = 10.2): number => s.replace(/<[^>]+>/g, '').length * k;

/** A label pill centred at (x, y); with `to`, a leader from its edge to that point. Light ground for photos. */
export function pill(x: number, y: number, s: string, to?: Pt, o: { cls?: string; tint?: boolean; k?: number } = {}): string {
  const w = textW(s, o.k) + 26;
  let ld = '';
  if (to) {
    const dx = to[0] - x, dy = to[1] - y;
    const t = Math.min(w / 2 / Math.max(Math.abs(dx), 1e-6), 16 / Math.max(Math.abs(dy), 1e-6));
    const a: Pt = [x + dx * t, y + dy * t];
    const d = `M${f(a[0])},${f(a[1])}L${f(to[0])},${f(to[1])}`;
    ld = `<path class="fcc-ldh" d="${d}"/><path class="fcc-ldk" d="${d}"/><circle class="fcc-tip" cx="${f(to[0])}" cy="${f(to[1])}" r="3.2"/>`;
  }
  return `${ld}<rect class="${o.tint ? 'fcc-pill-t' : 'fcc-pill'}" x="${f(x - w / 2)}" y="${f(y - 16)}" width="${f(w)}" height="32" rx="16"/>${T(x, y + 6.5, s, o.cls ?? 'fcc-pt')}`;
}

/** Small grey credit line. */
export const credit = (x: number, y: number, s: string, a: A = 'end'): string => T(x, y, s, 'fcc-cr', a);

/* ---------- arrows ---------- */

/** Route inks: k ink, c CO₂ (a gas path: neutral grey), g glycine (clay dashed), m C₄ acid (teal), x CO₂ escaping (grey dotted), w white (on photos), a ATP. */
export type Route = 'k' | 'c' | 'g' | 'm' | 'x' | 'w' | 'a';
const ROUTES: Route[] = ['k', 'c', 'g', 'm', 'x', 'w', 'a'];
export const heads = (p: string): string =>
  `<defs>${ROUTES.map(h => `<marker id="${p}-hd-${h}" viewBox="0 0 10 10" refX="6.5" refY="5" markerWidth="15" markerHeight="15" markerUnits="userSpaceOnUse" orient="auto"><path class="fcc-hd-${h}" d="M0,0.6L10,5L0,9.4z"/></marker>`).join('')}</defs>`;
export const route = (p: string, k: Route, d: string, extra = ''): string =>
  `<path class="fcc-r fcc-r-${k}${extra ? ` ${extra}` : ''}" d="${d}" marker-end="url(#${p}-hd-${k})"/>`;
/** A route on a photo: a white halo under the coloured stroke. */
export const routeOnPhoto = (p: string, k: Route, d: string): string =>
  `<path class="fcc-halo" d="${d}"/>${route(p, k, d)}`;

/* ---------- organelles ---------- */

/** Chloroplast: ellipse with grana strokes. rot in degrees. */
export function chloro(x: number, y: number, rx: number, ry: number, rot = 0, cls = 'fcc-cp'): string {
  const n = Math.max(2, Math.round(rx / 11));
  const g: string[] = [];
  for (let i = 0; i < n; i++) {
    const gx = -rx * 0.62 + (i * rx * 1.24) / Math.max(1, n - 1);
    const hh = ry * 0.46 * Math.sqrt(Math.max(0, 1 - (gx / rx) ** 2));
    g.push(`M${f(gx)},${f(-hh)}V${f(hh)}`);
  }
  return `<g transform="translate(${f(x)} ${f(y)}) rotate(${rot})"><ellipse class="${cls}" rx="${rx}" ry="${ry}"/><path class="fcc-th" d="${g.join('')}"/></g>`;
}

/** Mitochondrion with cristae; on = it carries glycine decarboxylase (dark). */
export function mito(x: number, y: number, rx: number, ry: number, rot = 0, on = false): string {
  const c: string[] = [];
  const n = Math.max(2, Math.round(rx / 7));
  for (let i = 0; i < n; i++) {
    const cx = -rx * 0.6 + (i * rx * 1.2) / Math.max(1, n - 1), s = i % 2 ? 1 : -1;
    c.push(`M${f(cx)},${f(s * ry * 0.7)}V${f(-s * ry * 0.05)}`);
  }
  return `<g transform="translate(${f(x)} ${f(y)}) rotate(${rot})"><ellipse class="${on ? 'fcc-mt-on' : 'fcc-mt'}" rx="${rx}" ry="${ry}"/><path class="${on ? 'fcc-cr-on' : 'fcc-crs'}" d="${c.join('')}"/></g>`;
}

export const perox = (x: number, y: number, r: number): string =>
  `<circle class="fcc-px" cx="${f(x)}" cy="${f(y)}" r="${r}"/>`;

/** CO₂ as atom balls (O C O); the letters follow the ball size but never go below 11 px. */
export const co2 = (x: number, y: number, r = 11): string =>
  molecule(x, y, 'OCO', r).replace(/<text class="atom-t/g, `<text style="font-size:${f(Math.max(11, Math.min(14, r * 1.3)))}px" class="atom-t`);

/** An ATP tag in the deck's clay (illus.ts tag-atp), centred at (x, y). */
export const atpTag = (x: number, y: number, s = 'ATP', fs = 17): string => {
  const w = textW(s, fs * 0.6) + 18;
  return `<rect class="tag-atp" x="${f(x - w / 2)}" y="${f(y - 14)}" width="${f(w)}" height="28" rx="9"/><text x="${f(x)}" y="${f(y + fs * 0.36)}" text-anchor="middle" style="font-size:${fs}px;font-weight:600;fill:#2b2a27">${s}</text>`;
};

/** A RuBisCO tag (small white lozenge with the name). */
export const rubisco = (x: number, y: number, small = false): string => {
  const w = small ? 74 : 92;
  return `<rect class="fcc-enz" x="${f(x - w / 2)}" y="${f(y - (small ? 13 : 15))}" width="${w}" height="${small ? 26 : 30}" rx="${small ? 13 : 15}"/>${T(x, y + (small ? 5.5 : 6.5), 'RuBisCO', small ? 'fcc-enz-s' : 'fcc-enz-t')}`;
};

/** An enzyme tag in a route colour: k ink, m teal, g clay. */
export const enzyme = (x: number, y: number, s: string, k: 'k' | 'm' | 'g' = 'k', fs = 19): string => {
  const w = textW(s, fs * 0.58) + 22;
  return `<rect class="fcc-enz fcc-enz-${k}" x="${f(x - w / 2)}" y="${f(y - 15)}" width="${f(w)}" height="30" rx="15"/>${T(x, y + 6.5, s, `fcc-enz-t fcc-enz-t-${k}`)}`;
};


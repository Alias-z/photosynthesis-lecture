// Shared parts of chunk cr (lecture 2 chunk 5, photosynthesis and crops: slides C14 and C15), built 28 Oct 2026.
// The helpers follow k01.ts (real images multiplied into the paper, label pills with haloed leaders, grey credits),
// prefixed cr-. The yield chain (Monteith's equation as drawn by Zhu, Long & Ort 2010) is the chunk's one schema: C14
// lights its conversion-efficiency link, C15 lights each link in turn. Every part sits in <g data-p="…" class="on|off">.
// Sizes: the figure box shows the 800 × 600 viewBox at ≈ 0.97 of screen pixels on a 1600-wide page, so labels are
// ≥ 21 px; only credits are smaller.
import { molecule } from '../illus';
import './cr.css';

export type A = 'start' | 'middle' | 'end';
export type Pt = [number, number];
export type Box = [number, number, number, number];
export type Ink = 'ink' | 'grey' | 'green' | 'c3' | 'c4' | 'amber' | 'red' | 'blue' | 'paper' | 'gas';

export const f = (v: number): string => v.toFixed(1);
export const T = (x: number, y: number, s: string, cls = 'cr-l', a: A = 'start'): string =>
  `<text class="${cls}" x="${f(x)}" y="${f(y)}" text-anchor="${a}">${s}</text>`;
/** An italic variable such as A or Cᵢ. */
export const it = (s: string): string => `<tspan class="cr-it">${s}</tspan>`;
export const cw = (c: Ink, s: string): string => `<tspan class="cr-c-${c}">${s}</tspan>`;
export const NB = ' ';
export const PPM = 'ppm';

export interface Img { href: string; w: number; h: number }
export interface Shot { svg: string; at: (u: number, v: number) => Pt; h: number; s: number }
/** A real image: the window win = [u0, v0, width, height] (image pixels) shown w wide at x, y (never stretched). A published
 *  figure ('fig') multiplies its white ground into the page; a photo or micrograph keeps its own ground in a frame with
 *  rounded corners. `holes` = [u0, v0, u1, v1] boxes left out of the crop (panel letters). */
export function shot(id: string, im: Img, x: number, y: number, w: number, o: { win?: Box; fig?: boolean; holes?: Box[]; r?: number } = {}): Shot {
  const [u0, v0, uw, vh] = o.win ?? [0, 0, im.w, im.h];
  const s = w / uw, h = vh * s, ox = x - u0 * s, oy = y - v0 * s, r = o.r ?? (o.fig ? 0 : 10);
  const img = `<image href="${im.href}" x="${f(ox)}" y="${f(oy)}" width="${f(im.w * s)}" height="${f(im.h * s)}" preserveAspectRatio="none"/>`;
  const hl = (o.holes ?? []).map(([a, b, c, d]) => ` M${f(ox + a * s)},${f(oy + b * s)} H${f(ox + c * s)} V${f(oy + d * s)} H${f(ox + a * s)}Z`).join('');
  const outer = `M${f(x + r)},${f(y)} H${f(x + w - r)} Q${f(x + w)},${f(y)} ${f(x + w)},${f(y + r)} V${f(y + h - r)} Q${f(x + w)},${f(y + h)} ${f(x + w - r)},${f(y + h)} H${f(x + r)} Q${f(x)},${f(y + h)} ${f(x)},${f(y + h - r)} V${f(y + r)} Q${f(x)},${f(y)} ${f(x + r)},${f(y)}Z`;
  const clip = `<clipPath id="${id}"><path clip-rule="evenodd" d="${outer}${hl}"/></clipPath>`;
  return { svg: `${clip}<g clip-path="url(#${id})"${o.fig ? ' class="cr-mult"' : ''}>${img}</g>`, at: (u, v) => [ox + u * s, oy + v * s], h, s };
}

/** A leader onto a real image: dark line in a light halo, ending in a dot. */
export const pleader = (a: Pt, b: Pt): string => {
  const d = `M${f(a[0])},${f(a[1])}L${f(b[0])},${f(b[1])}`;
  return `<path class="cr-ldh" d="${d}"/><path class="cr-ldk" d="${d}"/><circle class="cr-tipd" cx="${f(b[0])}" cy="${f(b[1])}" r="3.2"/>`;
};
/** Width of a label pill (visible characters only). */
export const pw = (s: string, k = 11.2): number => s.replace(/<[^>]+>/g, '').length * k + 26;
/** A label pill centred at (x, y): paper-white on photos, tinted on a figure's ground; leaders to one or more points. */
export function pill(x: number, y: number, s: string, to?: Pt | Pt[], tint = false, cls = 'cr-pill'): string {
  const w = pw(s), tos: Pt[] = to === undefined ? [] : typeof to[0] === 'number' ? [to as Pt] : (to as Pt[]);
  const ld = tos.map(p => {
    const dx = p[0] - x, dy = p[1] - y, t = Math.min(w / 2 / Math.max(Math.abs(dx), 1e-6), 17 / Math.max(Math.abs(dy), 1e-6));
    return pleader([x + dx * t, y + dy * t], p);
  }).join('');
  return `${ld}<rect class="${tint ? 'cr-pillbg-t' : 'cr-pillbg'}" x="${f(x - w / 2)}" y="${f(y - 17)}" width="${f(w)}" height="34" rx="17"/>${T(x, y + 7.5, s, cls, 'middle')}`;
}
/** Grey credit line; '|' breaks it onto a second line. */
export const credit = (x: number, y: number, s: string, a: A = 'end'): string =>
  s.split('|').map((l, i) => T(x, y + i * 17, l.trim(), 'cr-crd', a)).join('');

const INKS: Ink[] = ['ink', 'grey', 'green', 'c3', 'c4', 'amber', 'red', 'blue', 'paper', 'gas'];
/** Arrowheads in each ink, prefixed per figure (the gallery shows every variant at once). */
export const defs = (p: string): string => `<defs>${INKS.map(k =>
  `<marker id="${p}-${k}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4.4" markerHeight="4.4" orient="auto-start-reverse"><path class="cr-hd-${k}" d="M0,0L10,5L0,10z"/></marker>`).join('')}</defs>`;
export const ar = (p: string, k: Ink, d: string, cls = ''): string =>
  `<path class="cr-ar cr-k-${k}${cls ? ` ${cls}` : ''}" d="${d}" marker-end="url(#${p}-${k})"/>`;
export const svg = (p: string, label: string, body: string): string =>
  `<svg class="fig-svg fcr" viewBox="0 0 800 600" role="img" aria-label="${label}">${defs(p)}${body}</svg>`;
/** A rounded box. */
export const box = (x: number, y: number, w: number, h: number, cls = 'cr-box', r = 14): string =>
  `<rect class="${cls}" x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="${r}"/>`;
export const line = (pts: Pt[]): string => pts.map((p, i) => `${i ? 'L' : 'M'}${f(p[0])},${f(p[1])}`).join('');

/** Smooth curve through knots (cubic Hermite with Catmull–Rom tangents). */
export function smooth(k: Array<[number, number]>): (x: number) => number {
  return (x: number): number => {
    if (x <= k[0][0]) return k[0][1];
    if (x >= k[k.length - 1][0]) return k[k.length - 1][1];
    let i = 0;
    while (x > k[i + 1][0]) i++;
    const p0 = k[Math.max(0, i - 1)], p1 = k[i], p2 = k[i + 1], p3 = k[Math.min(k.length - 1, i + 2)];
    const w = p2[0] - p1[0], s = (x - p1[0]) / w;
    const m1 = ((p2[1] - p0[1]) / (p2[0] - p0[0])) * w, m2 = ((p3[1] - p1[1]) / (p3[0] - p1[0])) * w;
    return (2 * s ** 3 - 3 * s ** 2 + 1) * p1[1] + (s ** 3 - 2 * s ** 2 + s) * m1 + (-2 * s ** 3 + 3 * s ** 2) * p2[1] + (s ** 3 - s ** 2) * m2;
  };
}

/* ---------- small drawn icons (line drawings in the deck's inks; no cartoon faces or props) ---------- */

/** The sun: a disc with short rays. */
export function sun(x: number, y: number, r = 22): string {
  const rays = Array.from({ length: 12 }, (_, i) => {
    const a = (i * Math.PI) / 6, c = Math.cos(a), s = Math.sin(a);
    return `M${f(x + c * (r + 6))},${f(y + s * (r + 6))}L${f(x + c * (r + 15))},${f(y + s * (r + 15))}`;
  }).join('');
  return `<path class="cr-ray" d="${rays}"/><circle class="cr-sun" cx="${f(x)}" cy="${f(y)}" r="${r}"/>`;
}

/** A wheat ear: stalk, two rows of spikelets and awns; h = height of the ear (without the stalk). */
export function wheatEar(x: number, y: number, h = 120, cls = 'cr-ear', awns = true): string {
  const n = 7, dy = h / (n + 0.6), sw = h * 0.085, sh = h * 0.13;
  const parts: string[] = [];
  for (let i = 0; i < n; i++) {
    const cy = y + h - (i + 0.8) * dy;
    for (const side of [-1, 1]) {
      const cx = x + side * sw * 0.95;
      parts.push(`<ellipse class="${cls}" cx="${f(cx)}" cy="${f(cy)}" rx="${f(sw)}" ry="${f(sh)}" transform="rotate(${side * 22} ${f(cx)} ${f(cy)})"/>`);
      if (awns) parts.push(`<path class="cr-awn" d="M${f(cx + side * sw * 0.3)},${f(cy - sh * 0.8)} L${f(cx + side * h * 0.16)},${f(cy - sh * 0.8 - h * 0.42)}"/>`);
    }
  }
  const top = y + h - (n - 0.2) * dy;
  parts.push(`<ellipse class="${cls}" cx="${f(x)}" cy="${f(top)}" rx="${f(sw * 0.9)}" ry="${f(sh)}"/>`);
  return `<path class="cr-stalk" d="M${f(x)},${f(y + h + h * 0.55)} L${f(x)},${f(y + h * 0.1)}"/>${parts.join('')}`;
}

/** A maize cob in its husk; h = height. */
export function maizeCob(x: number, y: number, h = 120): string {
  const w = h * 0.36, rows: string[] = [];
  for (let j = 0; j < 7; j++) {
    const yy = y + h * 0.16 + j * h * 0.1;
    const half = w * 0.5 * Math.sin(Math.PI * (0.15 + 0.7 * (j + 0.5) / 7));
    rows.push(`<path class="cr-kernel" d="M${f(x - half)},${f(yy)} H${f(x + half)}"/>`);
  }
  return `<path class="cr-husk" d="M${f(x)},${f(y + h * 1.12)} C${f(x - w * 1.25)},${f(y + h * 0.75)} ${f(x - w * 0.9)},${f(y + h * 0.15)} ${f(x - w * 0.15)},${f(y - h * 0.08)} C${f(x - w * 0.35)},${f(y + h * 0.4)} ${f(x - w * 0.25)},${f(y + h * 0.85)} ${f(x)},${f(y + h * 1.12)}Z"/>
    <ellipse class="cr-cob" cx="${f(x + w * 0.08)}" cy="${f(y + h * 0.5)}" rx="${f(w * 0.5)}" ry="${f(h * 0.48)}"/>${rows.join('')}
    <path class="cr-husk" d="M${f(x)},${f(y + h * 1.12)} C${f(x + w * 1.2)},${f(y + h * 0.8)} ${f(x + w * 0.95)},${f(y + h * 0.3)} ${f(x + w * 0.35)},${f(y + h * 0.02)} C${f(x + w * 0.45)},${f(y + h * 0.45)} ${f(x + w * 0.3)},${f(y + h * 0.85)} ${f(x)},${f(y + h * 1.12)}Z"/>`;
}

/** A soybean pod with three seeds; L = length. */
export function soyPod(x: number, y: number, L = 90, rot = -20): string {
  const h = L * 0.3;
  const seeds = [-1, 0, 1].map(i => `<ellipse class="cr-seed" cx="${f(x + i * L * 0.27)}" cy="${f(y)}" rx="${f(L * 0.12)}" ry="${f(h * 0.33)}"/>`).join('');
  return `<g transform="rotate(${rot} ${f(x)} ${f(y)})"><path class="cr-pod" d="M${f(x - L / 2)},${f(y)} C${f(x - L / 2)},${f(y - h)} ${f(x + L / 2)},${f(y - h)} ${f(x + L / 2)},${f(y)} C${f(x + L / 2)},${f(y + h)} ${f(x - L / 2)},${f(y + h)} ${f(x - L / 2)},${f(y)}Z"/>${seeds}</g>`;
}

/** A loaf of bread, w wide, its base at y. */
export function loaf(x: number, y: number, w = 120): string {
  const h = w * 0.5;
  const cuts = [-0.22, 0, 0.22].map(c => `<path class="cr-cut" d="M${f(x + c * w - w * 0.07)},${f(y - h * 0.62)} Q${f(x + c * w)},${f(y - h * 0.8)} ${f(x + c * w + w * 0.08)},${f(y - h * 0.62)}"/>`).join('');
  return `<path class="cr-loaf" d="M${f(x - w / 2)},${f(y)} L${f(x - w / 2)},${f(y - h * 0.45)} C${f(x - w / 2)},${f(y - h * 1.05)} ${f(x + w / 2)},${f(y - h * 1.05)} ${f(x + w / 2)},${f(y - h * 0.45)} L${f(x + w / 2)},${f(y)}Z"/>${cuts}`;
}

/** A leaf blade pointing up-right from (x, y), length L. */
export function leaf(x: number, y: number, L = 80, rot = -35, cls = 'cr-leaf'): string {
  const w = L * 0.3;
  return `<g transform="rotate(${rot} ${f(x)} ${f(y)})"><path class="${cls}" d="M${f(x)},${f(y)} C${f(x + L * 0.3)},${f(y - w)} ${f(x + L * 0.75)},${f(y - w * 0.8)} ${f(x + L)},${f(y)} C${f(x + L * 0.75)},${f(y + w * 0.8)} ${f(x + L * 0.3)},${f(y + w)} ${f(x)},${f(y)}Z"/><path class="cr-vein" d="M${f(x)},${f(y)} L${f(x + L * 0.95)},${f(y)}"/></g>`;
}

/** CO₂ as atom balls, as on the deck's other slides. */
export const co2 = (x: number, y: number, r = 11): string => molecule(x, y, 'OCO', r);
/** O₂ as two touching O balls (illus.ts). */
export const o2 = (x: number, y: number, r = 11): string => molecule(x, y, 'OO', r);

/* ---------- the yield chain: grain yield = sunlight × interception × conversion efficiency × harvest index ---------- */

export type Link = 'sun' | 'int' | 'conv' | 'hi' | 'yield';
export interface ChainText { int?: string[]; conv?: string[]; hi?: string[]; yield?: string[]; sun?: string[] }
/** The chain drawn as five stations on one row (sunlight, interception, conversion, harvest index, grain), y = the icon row.
 *  `lit` names the links that are on; the others are dimmed. `txt` gives each station's value lines under its name. */
export function yieldChain(p: string, y: number, lit: Link[], txt: ChainText = {}, o: { names?: Partial<Record<Link, string[]>> } = {}): string {
  const xs: Record<Link, number> = { sun: 50, int: 214, conv: 396, hi: 578, yield: 740 };
  const on = (k: Link): string => (lit.includes(k) ? 'on' : 'off');
  const names: Record<Link, string[]> = {
    sun: ['sunlight'], int: ['light', 'interception'], conv: ['conversion', 'efficiency'], hi: ['harvest', 'index'], yield: ['grain', 'yield'],
    ...o.names,
  };
  const icon: Record<Link, string> = {
    sun: sun(xs.sun, y, 26),
    int: `${leaf(xs.int - 44, y + 26, 62, -58)}${leaf(xs.int - 6, y + 30, 66, -18)}${leaf(xs.int + 10, y + 28, 58, -88, 'cr-leaf2')}<path class="cr-soil" d="M${xs.int - 58},${y + 34} H${xs.int + 58}"/>`,
    conv: `<circle class="cr-chl" cx="${xs.conv}" cy="${y}" r="34"/>${co2(xs.conv, y - 2, 10)}`,
    hi: wheatEar(xs.hi, y - 46, 74, 'cr-ear', true),
    yield: loaf(xs.yield, y + 26, 92),
  };
  const order: Link[] = ['sun', 'int', 'conv', 'hi', 'yield'];
  // The links are factors of one product: × between them, = before the grain yield.
  const arrows = order.slice(0, -1).map((k, i) => {
    const xm = (xs[k] + xs[order[i + 1]]) / 2;
    return `<g data-p="${k}-${order[i + 1]}">${T(xm, y + 12, i === 3 ? '=' : '×', 'cr-op', 'middle')}</g>`;
  }).join('');
  const st = order.map(k => {
    const nm = names[k].map((s, i) => T(xs[k], y + 84 + i * 27, s, 'cr-sn', 'middle')).join('');
    const vy = y + 84 + names[k].length * 27 + 12;
    const vals = (txt[k] ?? []).map((s, i) => T(xs[k], vy + i * 28, s, i === 0 ? 'cr-sv' : 'cr-svs', 'middle')).join('');
    const halo = lit.includes(k) ? `<rect class="cr-lit" x="${xs[k] - 74}" y="${y - 70}" width="148" height="${170 + names[k].length * 27 + (txt[k]?.length ?? 0) * 28}" rx="20"/>` : '';
    return `<g data-p="${k}" class="cr-${on(k)}">${halo}${icon[k]}${nm}${vals}</g>`;
  }).join('');
  return `${arrows}${st}`;
}

// Shared drawing kit of the rf figure modules (rff05–rff08): real images with credits, label pills, axes, and crops and
// mini-maps of the rf schema (./rf-schema.ts). Classes are prefixed rfk- (./rf-kit.css).
import './rf-kit.css';
import { schemaSvg, type Look, type Part } from './rf-schema';

export type A = 'start' | 'middle' | 'end';
export type Pt = [number, number];
export interface Img { href: string; w: number; h: number }

export const f = (v: number): string => (Math.round(v * 10) / 10).toString();
export const T = (x: number, y: number, s: string, cls = 'rfk-l', a: A = 'start'): string =>
  `<text class="${cls}" x="${f(x)}" y="${f(y)}" text-anchor="${a}">${s}</text>`;
/** Rotated axis title, centred on (x, y). */
export const TV = (x: number, y: number, s: string, cls = 'rfk-at'): string =>
  `<text class="${cls}" x="${f(x)}" y="${f(y)}" text-anchor="middle" transform="rotate(-90 ${f(x)} ${f(y)})">${s}</text>`;
export const it = (s: string): string => `<tspan font-style="italic">${s}</tspan>`;
export const sb = (s: string): string => `<tspan class="rfk-sb" dy="5">${s}</tspan><tspan dy="-5">&#8203;</tspan>`;
export const sp = (s: string): string => `<tspan class="rfk-sb" dy="-9">${s}</tspan><tspan dy="9">&#8203;</tspan>`;

export const fig = (cls: string, label: string, body: string): string =>
  `<svg class="fig-svg rfk ${cls}" viewBox="0 0 800 600" role="img" aria-label="${label}">${body}</svg>`;

/** A real image: the window win = [u0, v0, width, height] (image pixels) drawn w wide at (x, y). A published figure ('fig')
 *  multiplies its white ground into the page; a photo gets rounded corners. at() maps image pixels to the figure. */
export function shot(id: string, im: Img, x: number, y: number, w: number,
  o: { win?: [number, number, number, number]; fig?: boolean } = {}): { svg: string; at: (u: number, v: number) => Pt; h: number } {
  const [u0, v0, uw, vh] = o.win ?? [0, 0, im.w, im.h];
  const s = w / uw, h = vh * s, ox = x - u0 * s, oy = y - v0 * s;
  const img = `<image href="${im.href}" x="${f(ox)}" y="${f(oy)}" width="${f(im.w * s)}" height="${f(im.h * s)}"/>`;
  const clip = `<clipPath id="${id}"><rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}"${o.fig ? '' : ' rx="10"'}/></clipPath>`;
  return { svg: `${clip}<g clip-path="url(#${id})"${o.fig ? ' class="rfk-mult"' : ''}>${img}</g>`, at: (u, v) => [ox + u * s, oy + v * s], h };
}

/** A grey credit line. */
export const credit = (x: number, y: number, s: string, a: A = 'end'): string => T(x, y, s, 'rfk-cr', a);

const plain = (s: string): string => s.replace(/<[^>]+>/g, '').replace(/&#8203;/g, '');
/** A label pill centred at (x, y); with `to`, a leader from its edge to that point. */
export function pill(x: number, y: number, s: string, to?: Pt, k = ''): string {
  const w = plain(s).length * 10.4 + 24;
  let ld = '';
  if (to) {
    const dx = to[0] - x, dy = to[1] - y;
    const t = Math.min(w / 2 / Math.max(Math.abs(dx), 1e-6), 15 / Math.max(Math.abs(dy), 1e-6));
    const a: Pt = [x + dx * t, y + dy * t], d = `M${f(a[0])},${f(a[1])}L${f(to[0])},${f(to[1])}`;
    ld = `<path class="rfk-ldh" d="${d}"/><path class="rfk-ldk" d="${d}"/><circle class="rfk-tip" cx="${f(to[0])}" cy="${f(to[1])}" r="3"/>`;
  }
  return `${ld}<rect class="rfk-pill ${k}" x="${f(x - w / 2)}" y="${f(y - 15)}" width="${f(w)}" height="30" rx="15"/>${T(x, y + 7, s, `rfk-pillt ${k}`, 'middle')}`;
}

/** An arrow (closed head) along points, smoothed. */
export function arrow(q: Pt[], cls = 'rfk-ar', hl = 13): string {
  const tip = q[q.length - 1], prev = q[q.length - 2];
  const dx = tip[0] - prev[0], dy = tip[1] - prev[1], L = Math.hypot(dx, dy), u: Pt = [dx / L, dy / L], n: Pt = [-u[1], u[0]];
  const back: Pt = [tip[0] - u[0] * hl * 0.7, tip[1] - u[1] * hl * 0.7];
  const pts = [...q.slice(0, -1), back];
  let d = `M${f(pts[0][0])},${f(pts[0][1])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
    d += `C${f(p1[0] + (p2[0] - p0[0]) / 6)},${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)},${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])},${f(p2[1])}`;
  }
  const b: Pt = [tip[0] - u[0] * hl, tip[1] - u[1] * hl], hw = hl * 0.55;
  return `<path class="${cls}" d="${d}"/><path class="${cls}-hd" d="M${f(tip[0])},${f(tip[1])}L${f(b[0] + n[0] * hw)},${f(b[1] + n[1] * hw)}L${f(b[0] - n[0] * hw)},${f(b[1] - n[1] * hw)}Z"/>`;
}

/** Atom balls: a molecule such as 'OCO' along an angle (the thesis vocabulary). */
export function balls(c: Pt, atoms: string, angle = 0, r = 13): string {
  const step = 2 * r * 0.92, a = (angle * Math.PI) / 180;
  let s = '';
  for (let i = 0; i < atoms.length; i++) {
    const o = (i - (atoms.length - 1) / 2) * step, x = c[0] + Math.cos(a) * o, y = c[1] + Math.sin(a) * o, el = atoms[i];
    s += `<circle class="rfk-atom rfk-atom-${el}" cx="${f(x)}" cy="${f(y)}" r="${r}"/>${T(x, y + r * 0.42, el, `rfk-atomt rfk-atomt-${el}`, 'middle')}`;
  }
  return s;
}
/** A molecule on a photo or a busy figure: a light pill holding its atom balls and its name in ink. */
export function gasPill(x: number, y: number, atoms: string, name: string, r = 10): string {
  const gw = (atoms.length - 1) * 2 * r * 0.92 + 2 * r, tw = plain(name).length * 10.4, w = gw + tw + 34;
  const gx = x - w / 2 + 14 + gw / 2;
  return `<rect class="rfk-pill" x="${f(x - w / 2)}" y="${f(y - 17)}" width="${f(w)}" height="34" rx="17"/>${balls([gx, y], atoms, 0, r)}${T(gx + gw / 2 + 8, y + 7, name, 'rfk-pillt', 'start')}`;
}
/** RuBP pentagon. */
export function pentagon(c: Pt, R = 32, label = 'RuBP'): string {
  const pts = Array.from({ length: 5 }, (_, i) => { const a = (-90 + i * 72) * Math.PI / 180; return `${f(c[0] + R * Math.cos(a))},${f(c[1] + R * Math.sin(a) + 3)}`; }).join(' ');
  return `<polygon class="rfk-rubp" points="${pts}"/>${T(c[0], c[1] + 9, label, 'rfk-rubpt', 'middle')}`;
}
/** Atoms in a row, one ball per atom with its letter (the deck's one glyph set, 28 Oct 2026): 'c' carbon, 'o' a carbon
 *  bound for photorespiration (carbon ball on a rust halo), 'n' nitrogen, 'p' phosphate. */
export function beads(x: number, y: number, n: number, k = 'c', r = 11): string {
  const el = k === 'n' ? 'N' : k === 'p' ? 'P' : 'C', fs = Math.max(11, Math.min(15, r * 1.25));
  let halo = '', s = '';
  for (let i = 0; i < n; i++) {
    const cx = x + i * r * 2.15;
    if (k === 'o') halo += `<circle class="rfk-halo-o" cx="${f(cx)}" cy="${f(y)}" r="${f(r + 3.5)}"/>`;
    s += `<circle class="rfk-bead rfk-bead-${k}" cx="${f(cx)}" cy="${f(y)}" r="${r}"/>`
      + `<text class="rfk-beadt rfk-beadt-${k}" x="${f(cx)}" y="${f(y + fs * 0.36)}" text-anchor="middle" style="font-size:${f(fs)}px">${el}</text>`;
  }
  return halo + s;
}
export const beadsW = (n: number, r = 11): number => (n - 1) * r * 2.15 + 2 * r;
/** A tag pill (ATP, NADPH). */
export function tag(x: number, y: number, s: string, k: 'atp' | 'nadph' | 'fd'): string {
  const w = s.length * 10.2 + 16;
  return `<rect class="rfk-tag rfk-tag-${k}" x="${f(x - w / 2)}" y="${f(y - 13)}" width="${f(w)}" height="26" rx="13"/>${T(x, y + 6.5, s, `rfk-tagt rfk-tagt-${k}`, 'middle')}`;
}

/** A crop of the schema drawn into the box [x, y, w, h]; `view` is the schema region [x, y, w, h] shown. */
export function crop(id: string, look: Look, lit: Iterable<Part>, view: [number, number, number, number], box: [number, number, number, number], frame = true, zoom = true): string {
  const inner = schemaSvg(look, lit, { id, bare: true, noCredit: true });
  const [x, y, w, h] = box;
  return `<svg class="rfs rfs-${look} rfk-crop${zoom ? ' rfk-zoom' : ''}" data-look="${look}" x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" viewBox="${view.join(' ')}" preserveAspectRatio="xMidYMid meet" overflow="hidden" style="overflow:hidden">${inner}</svg>${frame ? `<rect class="rfk-cropfr" x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="12"/>` : ''}`;
}

/** The whole schema small, as a map: at (x, y), w wide; `mark` frames a region of the schema (schema units). */
export function minimap(id: string, look: Look, lit: Iterable<Part>, x: number, y: number, w: number, mark?: [number, number, number, number]): string {
  const s = w / 800, h = 600 * s;
  const inner = schemaSvg(look, lit, { id, bare: true, noCredit: true });
  const m = mark ? `<rect class="rfk-mark" x="${f(x + mark[0] * s)}" y="${f(y + mark[1] * s)}" width="${f(mark[2] * s)}" height="${f(mark[3] * s)}" rx="4"/>` : '';
  return `<rect class="rfk-mapbg" x="${f(x - 4)}" y="${f(y - 4)}" width="${f(w + 8)}" height="${f(h + 8)}" rx="8"/><svg class="rfs rfs-${look} rfk-map" data-look="${look}" x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" viewBox="0 0 800 600" overflow="hidden" style="overflow:hidden">${inner}</svg>${m}`;
}

/** Axes of a plot box [x0, y0, x1, y1] with ticks; xs/ys are [value, label] pairs mapped by X/Y. */
export function axes(b: [number, number, number, number], X: (v: number) => number, Y: (v: number) => number,
  xs: Array<[number, string]>, ys: Array<[number, string]>, xt: string, yt: string, o: { zero?: boolean } = {}): string {
  const [x0, y0, x1, y1] = b;
  let s = `<path class="rfk-axis" d="M${x0},${y0}V${y1}H${x1}"/>`;
  for (const [v, l] of xs) s += `<path class="rfk-tk" d="M${f(X(v))},${y1}v7"/>${T(X(v), y1 + 27, l, 'rfk-ax', 'middle')}`;
  for (const [v, l] of ys) s += `<path class="rfk-tk" d="M${x0},${f(Y(v))}h-7"/>${T(x0 - 12, Y(v) + 6, l, 'rfk-ax', 'end')}`;
  if (o.zero) s += `<path class="rfk-zero" d="M${x0},${f(Y(0))}H${x1}"/>`;
  s += T((x0 + x1) / 2, y1 + 58, xt, 'rfk-at', 'middle') + TV(x0 - 62, (y0 + y1) / 2, yt);
  return s;
}
/** A polyline through points (already in figure units), smoothed. */
export function curve(pts: Pt[], cls: string): string {
  let d = `M${f(pts[0][0])},${f(pts[0][1])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
    d += `C${f(p1[0] + (p2[0] - p0[0]) / 6)},${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)},${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])},${f(p2[1])}`;
  }
  return `<path class="${cls}" d="${d}"/>`;
}

// Shared drawing parts for lecture 2 chunk 1, the Calvin–Benson–Bassham cycle (slides C1–C4, prefix cb, 28 Oct 2026).
// Figures are 800 × 600 SVGs (shown ≈ 860 px wide). Classes are prefixed fcb- (cb.css). Real images are multiplied into
// the paper (published figures) or framed (photos); each carries its credit in small grey type.
import './cb.css';

export type A = 'start' | 'middle' | 'end';
export type Pt = [number, number];
export type Box = [number, number, number, number];
export type Ink = 'ink' | 'grey' | 'dim' | 'green' | 'blue' | 'amber' | 'red' | 'rust';

export const f = (v: number): string => v.toFixed(1);
export const T = (x: number, y: number, s: string, cls = 'fcb-l', a: A = 'start', extra = ''): string =>
  `<text class="${cls}" x="${f(x)}" y="${f(y)}" text-anchor="${a}"${extra}>${s}</text>`;
/** An italic run (variables, genus names, Chl a/b letters). */
export const it = (s: string): string => `<tspan class="fcb-it">${s}</tspan>`;
export const cw = (c: Ink | 'paper', s: string): string => `<tspan class="fcb-c-${c}">${s}</tspan>`;
/** Visible length of a label (markup not counted). */
export const vis = (s: string): number => s.replace(/<[^>]+>/g, '').replace(/&[a-z]+;/g, 'x').length;

export const svg = (p: string, label: string, body: string): string =>
  `<svg class="fig-svg fcb" viewBox="0 0 800 600" role="img" aria-label="${label}">${defs(p)}${body}</svg>`;

/** Arrowheads in each ink, a hatch for an early night and a soft glow, prefixed per figure (ids must be unique when the
 *  gallery shows every variant at once). */
export function defs(p: string): string {
  const heads = (['ink', 'grey', 'dim', 'green', 'blue', 'amber', 'red', 'rust'] as Ink[]).map(k =>
    `<marker id="${p}-${k}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4.4" markerHeight="4.4" orient="auto-start-reverse"><path class="fcb-hd-${k}" d="M0,0L10,5L0,10z"/></marker>`).join('');
  return `<defs>${heads}<pattern id="${p}-hatch" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="9" height="9" fill="#e9e6dc"/><rect width="4" height="9" fill="#9b988e"/></pattern>`
    + `<radialGradient id="${p}-glow"><stop offset="0" stop-color="#f2b705" stop-opacity=".45"/><stop offset="1" stop-color="#f2b705" stop-opacity="0"/></radialGradient></defs>`;
}
export const ar = (p: string, k: Ink, d: string, cls = ''): string =>
  `<path class="fcb-ar fcb-k-${k}${cls ? ` ${cls}` : ''}" d="${d}" marker-end="url(#${p}-${k})"/>`;
export const line = (d: string, cls: string): string => `<path class="${cls}" d="${d}"/>`;

/* ---------- real images ---------- */

export interface Img { href: string; w: number; h: number }
export interface Shot { svg: string; at: (u: number, v: number) => Pt; h: number; s: number; x: number; y: number; w: number }
/** A real image: the window win = [u0, v0, width, height] of it (image pixels) shown w wide at x, y, its height following
 *  (never stretched). A published figure ('fig') multiplies its white ground into the page; a photo or micrograph keeps
 *  its own ground in a frame with rounded corners. at() maps image pixels to the figure. */
export function shot(id: string, im: Img, x: number, y: number, w: number, o: { win?: Box; fig?: boolean; frame?: boolean; r?: number; white?: Box[] } = {}): Shot {
  const [u0, v0, uw, vh] = o.win ?? [0, 0, im.w, im.h];
  const s = w / uw, h = vh * s, ox = x - u0 * s, oy = y - v0 * s, r = o.fig ? 0 : (o.r ?? 8);
  const img = `<image href="${im.href}" x="${f(ox)}" y="${f(oy)}" width="${f(im.w * s)}" height="${f(im.h * s)}" preserveAspectRatio="none"/>`;
  const clip = `<clipPath id="${id}"><rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="${r}"/></clipPath>`;
  // white boxes [u0, v0, u1, v1] painted inside a multiplied figure vanish into the paper (panel letters)
  const wh = (o.white ?? []).map(([a, b, c, d]) => `<rect x="${f(ox + a * s)}" y="${f(oy + b * s)}" width="${f((c - a) * s)}" height="${f((d - b) * s)}" fill="#fff"/>`).join('');
  const frame = o.frame ? `<rect class="fcb-frame" x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="${r}"/>` : '';
  return { svg: `${clip}<g clip-path="url(#${id})"${o.fig ? ' class="fcb-mult"' : ''}>${img}${wh}</g>${frame}`, at: (u, v) => [ox + u * s, oy + v * s], h, s, x, y, w };
}

/** A leader onto a real image: dark line in a light halo, ending in a dot, so it reads on dark and light ground alike. */
export const pleader = (a: Pt, b: Pt): string => {
  const d = `M${f(a[0])},${f(a[1])}L${f(b[0])},${f(b[1])}`;
  return `<path class="fcb-ldh" d="${d}"/><path class="fcb-ldk" d="${d}"/><circle class="fcb-tipd" cx="${f(b[0])}" cy="${f(b[1])}" r="3"/>`;
};
export const pw = (s: string): number => vis(s) * 10.6 + 24;
/** A label pill centred at (x, y): light on images, tinted on the paper; with `to`, leaders from its edge to the point(s). */
export function pill(x: number, y: number, s: string, to?: Pt | Pt[], tint = false, cls = 'fcb-pill'): string {
  const w = pw(s), tos: Pt[] = to === undefined ? [] : typeof to[0] === 'number' ? [to as Pt] : (to as Pt[]);
  const ld = tos.map(q => {
    const dx = q[0] - x, dy = q[1] - y, t = Math.min(w / 2 / Math.max(Math.abs(dx), 1e-6), 16 / Math.max(Math.abs(dy), 1e-6));
    return pleader([x + dx * t, y + dy * t], q);
  }).join('');
  return `${ld}<rect class="${tint ? 'fcb-pillbg-t' : 'fcb-pillbg'}" x="${f(x - w / 2)}" y="${f(y - 16)}" width="${f(w)}" height="32" rx="16"/>${T(x, y + 7, s, cls, 'middle')}`;
}
/** Grey credit line; '|' breaks it onto further lines. */
export const credit = (x: number, y: number, s: string, a: A = 'end'): string =>
  s.split('|').map((l, i) => T(x, y + i * 17, l.trim(), 'fcb-crd', a)).join('');

/* ---------- chips, boxes, carbon squares ---------- */

/** An energy chip: 'atp' (red) or 'nadph' (blue), centred at (x, y). */
export function chip(x: number, y: number, s: string, kind: 'atp' | 'nadph' | 'dim', size = 21): string {
  const w = vis(s) * size * 0.56 + 22, h = size + 14;
  return `<rect class="fcb-${kind === 'dim' ? 'chip-dim' : kind}" x="${f(x - w / 2)}" y="${f(y - h / 2)}" width="${f(w)}" height="${f(h)}" rx="${f(h / 2.4)}"/>`
    + T(x, y + size * 0.36, s, kind === 'dim' ? 'fcb-node fcb-c-dim' : 'fcb-node', 'middle', ` style="font-size:${size}px"`);
}
/** A molecule box with a label (and an optional second line), centred at (x, y). */
export function node(x: number, y: number, s: string, o: { w?: number; sub?: string; cls?: string; box?: string; size?: number } = {}): string {
  const size = o.size ?? 22;
  const w = o.w ?? Math.max(vis(s) * size * 0.56 + 28, o.sub ? vis(o.sub) * 10 + 26 : 0);
  const h = o.sub ? size + 34 : size + 18;
  return `<rect class="${o.box ?? 'fcb-box'}" x="${f(x - w / 2)}" y="${f(y - h / 2)}" width="${f(w)}" height="${f(h)}" rx="10"/>`
    + (o.sub ? `${T(x, y - 3, s, o.cls ?? 'fcb-node', 'middle', ` style="font-size:${size}px"`)}${T(x, y + 21, o.sub, 'fcb-s', 'middle')}`
      : T(x, y + size * 0.36, s, o.cls ?? 'fcb-node', 'middle', ` style="font-size:${size}px"`));
}
/** A row of n carbon squares (side d) from x (top y): 'c' plain, 'n' the newly fixed carbon, 'x' an exported one, 'd' dimmed. */
export function carbons(x: number, y: number, kinds: string, d = 16, gap = 3, label = true): string {
  return [...kinds].map((k, i) => {
    const bx = x + i * (d + gap), cls = k === 'n' ? 'fcb-cn' : k === 'x' ? 'fcb-cx' : k === 'd' ? 'fcb-c-dim' : 'fcb-c';
    return `<rect class="${cls}" x="${f(bx)}" y="${f(y)}" width="${d}" height="${d}" rx="${f(d / 4)}"/>`
      + (label && d >= 18 ? T(bx + d / 2, y + d / 2 + 4.6, 'C', k === 'n' ? 'fcb-cl-n' : 'fcb-cl', 'middle') : '');
  }).join('');
}
export const rowW = (n: number, d = 16, gap = 3): number => n * d + (n - 1) * gap;

/* ---------- the cycle, drawn as a wheel of three phases (per 3 CO₂) ---------- */

export type Phase = 'carb' | 'red' | 'regen' | 'out';
export const PHASE_INK: Record<Phase, Ink> = { carb: 'green', red: 'blue', regen: 'amber', out: 'rust' };
export const PHASE_NAME: Record<Phase, string> = { carb: 'carboxylation', red: 'reduction', regen: 'regeneration', out: 'export' };

export interface CycleOpts {
  cx: number; cy: number; r: number;
  /** Phases drawn in colour; the others are pale grey. Default: all. */
  lit?: Phase[];
  /** ATP and NADPH chips (with their numbers per 3 CO₂). */
  energy?: boolean;
  /** Phase names: beside their arcs outside the wheel ('out', default), inside it ('in'), or none (false). */
  names?: 'out' | 'in' | false;
  /** Rubisco named on the carboxylation arc. */
  rubisco?: boolean;
  /** Coefficients per 3 CO₂ on the molecules (3 RuBP, 6 3-PGA, …). */
  counts?: boolean;
  /** Pale coloured sectors behind the three phases. */
  sectors?: boolean;
  /** Label of the product arrow (default '1 triose phosphate'); '' hides the arrow. */
  out?: string;
  /** Second line under the product label. */
  outSub?: string;
  /** Scale of the text (1 = 22 px nodes). */
  k?: number;
  /** Molecule boxes (RuBP, 3-PGA, triose phosphate); default true. */
  mols?: boolean;
  /** The CO₂ arrow and label at the top; default true. */
  co2?: boolean;
}

const rad = (a: number): number => (a * Math.PI) / 180;
export const polar = (cx: number, cy: number, r: number, a: number): Pt => [cx + r * Math.cos(rad(a)), cy + r * Math.sin(rad(a))];
/** A clockwise arc from angle a0 to a1 (degrees, y down), as path data. */
export function arcD(cx: number, cy: number, r: number, a0: number, a1: number): string {
  const [x0, y0] = polar(cx, cy, r, a0), [x1, y1] = polar(cx, cy, r, a1);
  return `M${f(x0)},${f(y0)} A${f(r)},${f(r)} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${f(x1)},${f(y1)}`;
}
/** A filled ring sector between radii r0 and r1, angles a0..a1. */
export function sectorD(cx: number, cy: number, r0: number, r1: number, a0: number, a1: number): string {
  const [x0, y0] = polar(cx, cy, r1, a0), [x1, y1] = polar(cx, cy, r1, a1), [x2, y2] = polar(cx, cy, r0, a1), [x3, y3] = polar(cx, cy, r0, a0);
  const lg = a1 - a0 > 180 ? 1 : 0;
  return `M${f(x0)},${f(y0)} A${f(r1)},${f(r1)} 0 ${lg} 1 ${f(x1)},${f(y1)} L${f(x2)},${f(y2)} A${f(r0)},${f(r0)} 0 ${lg} 0 ${f(x3)},${f(y3)}Z`;
}

/** Angles of the three molecules on the wheel: RuBP upper left, 3-PGA upper right, triose phosphate at the bottom. */
export const ANG = { rubp: -150, pga: -30, tp: 90 };

/** The Calvin–Benson–Bassham cycle per 3 CO₂ as a wheel: carboxylation over the top (CO₂ in), reduction down the right
 *  (ATP, NADPH in), regeneration up the left (ATP in), one triose phosphate out at the bottom. */
export function cycleWheel(p: string, o: CycleOpts): string {
  const { cx, cy, r } = o, k = o.k ?? 1, lit = new Set(o.lit ?? ['carb', 'red', 'regen', 'out']);
  const on = (ph: Phase): boolean => lit.has(ph);
  const ink = (ph: Phase): Ink => (on(ph) ? PHASE_INK[ph] : 'dim');
  const fs = 22 * k, gap = 24;
  const c = o.counts !== false;
  const mol = (a: number, s: string, ph: Phase[], wMin = 0): string => {
    const [x, y] = polar(cx, cy, r, a), live = ph.some(on);
    const w = Math.max(vis(s) * fs * 0.56 + 26 * k, wMin);
    return `<rect class="${live ? 'fcb-box' : 'fcb-box-dim'}" x="${f(x - w / 2)}" y="${f(y - (fs + 18 * k) / 2)}" width="${f(w)}" height="${f(fs + 18 * k)}" rx="${f(10 * k)}"/>`
      + T(x, y + fs * 0.36, s, live ? 'fcb-node' : 'fcb-node fcb-c-dim', 'middle', ` style="font-size:${f(fs)}px"`);
  };
  const sectors = o.sectors
    ? [['carb', ANG.rubp, ANG.pga], ['red', ANG.pga, ANG.tp], ['regen', ANG.tp, ANG.rubp + 360]].map(([ph, a0, a1]) =>
      `<path class="fcb-sector-${on(ph as Phase) ? { carb: 'green', red: 'blue', regen: 'amber' }[ph as 'carb'] : 'dim'}" d="${sectorD(cx, cy, r - 46 * k, r + 46 * k, (a0 as number) + 3, (a1 as number) - 3)}"/>`).join('')
    : '';
  // arcs, stopping short of the molecule boxes
  const arcs = `${ar(p, ink('carb'), arcD(cx, cy, r, ANG.rubp + gap, ANG.pga - gap - 4), 'fcb-fat')}
    ${ar(p, ink('red'), arcD(cx, cy, r, ANG.pga + gap - 6, ANG.tp - gap), 'fcb-fat')}
    ${ar(p, ink('regen'), arcD(cx, cy, r, ANG.tp + gap, ANG.rubp + 360 - gap + 6), 'fcb-fat')}`;
  // CO₂ in at the top
  const [tx, ty] = polar(cx, cy, r + 8, -90);
  const co2 = o.co2 === false ? '' : `${ar(p, ink('carb'), `M${f(tx)},${f(ty - 62 * k)} L${f(tx)},${f(ty - 6)}`)}${T(tx, ty - 72 * k, c ? '3 CO₂' : 'CO₂', on('carb') ? 'fcb-node' : 'fcb-node fcb-c-dim', 'middle', ` style="font-size:${f(fs + 2)}px"`)}`;
  // phase names: outside the wheel beside their arcs ('out'), or inside it ('in')
  const pcls = (ph: Phase): string => `fcb-phase fcb-c-${on(ph) ? (ph === 'carb' ? 'green' : ph === 'red' ? 'blue' : 'amber') : 'dim'}`;
  const nmAt = (ph: Phase, x: number, y: number, a: A, size: number): string => T(x, y + 8, PHASE_NAME[ph], pcls(ph), a, ` style="font-size:${f(size)}px"`);
  let names = '';
  if (o.names === 'out' || o.names === undefined) {
    const [ax, ay] = polar(cx, cy, r + 44 * k, -128), [bx, by] = polar(cx, cy, r + 48 * k, 28), [gx, gy] = polar(cx, cy, r + 48 * k, 152);
    names = `${nmAt('carb', ax, ay, 'end', 24 * k)}${nmAt('red', bx, by, 'start', 24 * k)}${nmAt('regen', gx, gy, 'end', 24 * k)}`;
  } else if (o.names === 'in') {
    names = `${nmAt('carb', cx, cy - r * 0.40, 'middle', 21 * k)}${nmAt('red', cx + r * 0.38, cy + r * 0.08, 'middle', 21 * k)}${nmAt('regen', cx - r * 0.38, cy + r * 0.32, 'middle', 21 * k)}`;
  }
  if (o.rubisco) {
    const [x, y] = polar(cx, cy, r - (o.names === 'in' ? 74 : 40) * k, -90);
    names += T(x, y + 8, 'Rubisco', on('carb') ? 'fcb-h' : 'fcb-h fcb-c-dim', 'middle', ` style="font-size:${f(24 * k)}px"`);
  }
  // energy chips
  let energy = '';
  if (o.energy) {
    const red = on('red'), reg = on('regen');
    const [ax, ay] = polar(cx, cy, r + 64 * k, 2), [bx, by] = polar(cx, cy, r + 64 * k, 32), [gx, gy] = polar(cx, cy, r + 64 * k, 178);
    const ia = polar(cx, cy, r + 12, 6), ib = polar(cx, cy, r + 12, 34), ig = polar(cx, cy, r + 12, 174);
    energy = `${ar(p, red ? 'red' : 'dim', `M${f(ax)},${f(ay)} L${f(ia[0] + 3)},${f(ia[1])}`, 'fcb-thin')}${ar(p, red ? 'blue' : 'dim', `M${f(bx)},${f(by)} L${f(ib[0] + 3)},${f(ib[1] + 1)}`, 'fcb-thin')}
      ${ar(p, reg ? 'red' : 'dim', `M${f(gx)},${f(gy)} L${f(ig[0] - 3)},${f(ig[1])}`, 'fcb-thin')}
      ${chip(ax + 44 * k, ay, c ? '6 ATP' : 'ATP', red ? 'atp' : 'dim', 21 * k)}${chip(bx + 56 * k, by + 4, c ? '6 NADPH' : 'NADPH', red ? 'nadph' : 'dim', 21 * k)}
      ${chip(gx - 44 * k, gy, c ? '3 ATP' : 'ATP', reg ? 'atp' : 'dim', 21 * k)}`;
  }
  // product out at the bottom right
  let out = '';
  if (o.out !== '') {
    const [ox, oy] = polar(cx, cy, r + 30 * k, 72), [ex, ey] = [ox + 92 * k, oy + 52 * k];
    const live = on('out');
    out = `${ar(p, live ? 'rust' : 'dim', `M${f(ox - 8)},${f(oy - 4)} Q${f(ox + 30 * k)},${f(oy + 44 * k)} ${f(ex)},${f(ey)}`, 'fcb-fat')}
      ${T(ex + 10, ey + 8, o.out ?? (c ? '1 triose phosphate' : 'triose phosphate'), live ? 'fcb-node fcb-c-rust' : 'fcb-node fcb-c-dim', 'start', ` style="font-size:${f(fs)}px"`)}
      ${o.outSub ? T(ex + 10, ey + 34 * k, o.outSub, live ? 'fcb-s' : 'fcb-s fcb-c-dim', 'start', ` style="font-size:${f(19 * k)}px"`) : ''}`;
  }
  const regenCount = c ? (() => { const [x, y] = polar(cx, cy, r - 30 * k, 118); return T(x, y + 7, '5 of 6', on('regen') ? 'fcb-s fcb-c-amber' : 'fcb-s fcb-c-dim', 'middle', ' style="font-weight:700"'); })() : '';
  if (o.mols === false) return `${sectors}${arcs}${co2}${names}${energy}${out}${regenCount}`;
  return `${sectors}${arcs}${co2}${names}${energy}${out}${regenCount}
    ${mol(ANG.rubp, c ? '3 RuBP' : 'RuBP', ['carb', 'regen'])}${mol(ANG.pga, c ? '6 3-PGA' : '3-PGA', ['carb', 'red'])}${mol(ANG.tp, c ? '6 triose phosphate' : 'triose phosphate', ['red', 'regen', 'out'])}`;
}

/** The abbreviations used on the wheel, spelled out once under a figure. */
export const KEY_ABBR = 'RuBP: ribulose 1,5-bisphosphate · 3-PGA: 3-phosphoglycerate';

/* ---------- graphs ---------- */

export interface Axes { x0: number; y0: number; w: number; h: number; xr: [number, number]; yr: [number, number] }
export const X = (a: Axes, v: number): number => a.x0 + ((v - a.xr[0]) / (a.xr[1] - a.xr[0])) * a.w;
export const Y = (a: Axes, v: number): number => a.y0 + a.h - ((v - a.yr[0]) / (a.yr[1] - a.yr[0])) * a.h;
/** Axes with ticks and titles. xt/yt are tick values; xl/yl the axis titles (quantity, unit). */
export function axes(a: Axes, xt: number[], yt: number[], xl: string, yl: string, o: { xfmt?: (v: number) => string; yfmt?: (v: number) => string; ylx?: number } = {}): string {
  const xf = o.xfmt ?? String, yf = o.yfmt ?? String;
  const xs = xt.map(v => `${line(`M${f(X(a, v))},${f(a.y0 + a.h)} v8`, 'fcb-tick')}${T(X(a, v), a.y0 + a.h + 30, xf(v), 'fcb-tk', 'middle')}`).join('');
  const ys = yt.map(v => `${line(`M${f(a.x0)},${f(Y(a, v))} h-8`, 'fcb-tick')}${T(a.x0 - 14, Y(a, v) + 7, yf(v), 'fcb-tk', 'end')}`).join('');
  const ylx = o.ylx ?? a.x0 - 62;
  return `${line(`M${f(a.x0)},${f(a.y0)} V${f(a.y0 + a.h)} H${f(a.x0 + a.w)}`, 'fcb-axis')}${xs}${ys}
    ${T(a.x0 + a.w / 2, a.y0 + a.h + 62, xl, 'fcb-ax', 'middle')}
    <text class="fcb-ax" x="${f(ylx)}" y="${f(a.y0 + a.h / 2)}" text-anchor="middle" transform="rotate(-90 ${f(ylx)} ${f(a.y0 + a.h / 2)})">${yl}</text>`;
}
/** A data line through points (data units) with markers. */
export function series(a: Axes, pts: Array<[number, number]>, ink: string, dot: string, r = 6.5, smooth = false): string {
  const xy = pts.map(([u, v]) => [X(a, u), Y(a, v)] as Pt);
  let d = `M${xy.map(q => `${f(q[0])},${f(q[1])}`).join(' L')}`;
  if (smooth) d = catmull(xy);
  return `<path class="fcb-line fcb-line-${ink}" d="${d}"/>${dot ? xy.map(q => `<circle class="fcb-dot-${dot}" cx="${f(q[0])}" cy="${f(q[1])}" r="${r}"/>`).join('') : ''}`;
}
/** A smooth path through points (Catmull–Rom as cubic Béziers). */
export function catmull(q: Pt[]): string {
  let d = `M${f(q[0][0])},${f(q[0][1])}`;
  for (let i = 0; i < q.length - 1; i++) {
    const p0 = q[Math.max(0, i - 1)], p1 = q[i], p2 = q[i + 1], p3 = q[Math.min(q.length - 1, i + 2)];
    const c1: Pt = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6], c2: Pt = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${f(c1[0])},${f(c1[1])} ${f(c2[0])},${f(c2[1])} ${f(p2[0])},${f(p2[1])}`;
  }
  return d;
}

/* ---------- data read off published graphs (digitised from the files on the C1-cbb-cycle board) ---------- */

/** Graf et al. 2010 PNAS Fig. 1A: Arabidopsis rosette starch (mg g⁻¹ fresh weight) vs hours after dawn; 12 h light /
 *  12 h dark (control, squares) and the night begun after 8 h (diamonds). Read from the figure (±0.1 mg g⁻¹, ±0.2 h). */
export const GRAF_CTRL: Array<[number, number]> = [[0, 0.15], [8, 4.3], [12, 6.7], [14.6, 4.9], [17.3, 3.15], [20, 1.7], [22.2, 0.68], [24, 0.15], [26, 0.12]];
export const GRAF_EARLY: Array<[number, number]> = [[0, 0.15], [8, 4.3], [10.6, 3.4], [13.2, 2.95], [16.1, 1.97], [18.2, 1.55], [20.2, 1.06], [22.2, 0.45], [24, 0.15], [26, 0.12]];
/** Calvin 1961 Nobel lecture Fig. 15 (Bassham's data, Chlorella): ¹⁴C in 3-PGA and RuBP (counts min⁻¹ / 1000) vs time
 *  (s); light off at 400 s. Read from the figure (±0.4 × 1000 counts min⁻¹, ±3 s). */
export const FIG15_PGA: Array<[number, number]> = [[0, 10.9], [100, 10.9], [200, 10.9], [300, 10.9], [400, 10.9], [404, 14.4], [409, 18.5], [413, 20.0], [418, 23.3], [430, 24.1], [461, 24.6], [500, 23.5], [550, 21.0], [600, 18.6], [650, 16.8], [702, 15.7]];
export const FIG15_RUBP: Array<[number, number]> = [[0, 5.7], [100, 5.7], [200, 5.7], [300, 5.7], [400, 5.9], [403, 6.4], [406, 5.2], [410, 3.4], [413, 2.8], [416, 1.4], [425, 0.25], [460, 0.1], [550, 0.05], [702, 0]];

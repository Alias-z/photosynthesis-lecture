// The engine the rf7 (slide C7, light-response curve) and rf8 (slide C8, FvCB model) animations share. The stage is the
// slide's own figure, schemaSvg() of figs/rf-schema.ts, in its figure card on the left (exactly as the slide draws it at
// the first and the last frame), and a live instrument panel on the right (readout + curve with its dot), on screen from
// the first frame. The camera zooms inside the card into one part of the schema at a time and back out, as the
// slide 7–10b animations do (b6f8-common.ts, psii7-common.ts).
//
// How the slide figure is reused (figs/rf-schema.ts is not modified):
// - schemaSvg() wraps every part in <g data-p="<part>" class="on|off">. The schema is drawn twice, once with no part lit
//   and once with every part lit; each wrapper of the unlit drawing is followed by its lit twin, and the pair is tagged
//   data-q="<part>", data-s="0|1". Lighting a part cross-fades the twins, so every look keeps its own on/off styling
//   (thesis: dimmed grey; glow: pale silhouettes; line: ink outlines) and a lit part looks exactly as on the slide.
// - The camera scales the whole schema; text and the story's glyphs are counter-scaled by (s/s₀)^−0.7, as on the
//   slide 7–10b animations, so labels grow only a little while the drawing grows 2–3×.
// - Everything drawn is a pure function of (beat, t): a Timeline folds each beat's moves (camera, lit parts, the dial,
//   opacities) into the state at t, and every beat holds its last frame.
import '../figs/clipping.css';
import '../figs/rf-kit.css';
import './rf78.css';
import { PARTS, schemaSvg, type Look, type Part } from '../figs/rf-schema';
import { cutPath, f1, lerp, lerpV, smooth, smoother, type Tf, type V } from './antenna-common';

export type { Tf, V };

/* ================================================================ stage layout */

/** The schema's card on the stage (the slide's figure card: 886.6 × 661.9 around the 800 × 600 schema). */
export const VP = { x: 16.7, y: 39.1, w: 886.6, h: 661.9, r: 22.7 };
/** The instrument panel on the right. */
export const PANEL = { x: 926, y: 39.1, w: 658, h: 661.9, r: 22.7 };
/** The whole schema, as on the slide. */
export const WHOLE: Tf = { s: 1, t: [VP.x + VP.w / 2 - 400, VP.y + VP.h / 2 - 300] };
const VC: V = [VP.x + VP.w / 2, VP.y + VP.h / 2];
/** The view that shows the schema region r = [x, y, w, h] (figure units) as large as fits in the card. */
export function view(r: [number, number, number, number], margin = 0.04): Tf {
  const s = Math.min(VP.w / r[2], VP.h / r[3]) * (1 - margin), c: V = [r[0] + r[2] / 2, r[1] + r[3] / 2];
  return { s, t: [VC[0] - s * c[0], VC[1] - s * c[1]] };
}
/** The view part way from a to b: scale even in log, the point at the card's centre glides between. */
export function camTween(a: Tf, b: Tf, e: number): Tf {
  const ca: V = [(VC[0] - a.t[0]) / a.s, (VC[1] - a.t[1]) / a.s], cb: V = [(VC[0] - b.t[0]) / b.s, (VC[1] - b.t[1]) / b.s];
  const s = a.s * (b.s / a.s) ** e, c = lerpV(ca, cb, e);
  return { s, t: [VC[0] - s * c[0], VC[1] - s * c[1]] };
}
/** Text and glyph scale for a camera scale s. */
export const kOf = (s: number): number => (s / WHOLE.s) ** -0.7;
export const camStr = (v: Tf): string => `matrix(${v.s.toFixed(5)},0,0,${v.s.toFixed(5)},${v.t[0].toFixed(2)},${v.t[1].toFixed(2)})`;

/* ================================================================ the slide figure, as part twins */

interface Wrap { a: number; b: number; part: Part; full: string }
/** The part wrappers of a schema drawing, in document order (they never nest). */
function wraps(s: string): Wrap[] {
  const out: Wrap[] = [], re = /<g data-p="([a-z0-9-]+)" class="(?:on|off)"(?: data-opt="1")?>/g, tag = /<g[\s>]|<\/g>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(s))) {
    const i0 = m.index + m[0].length;
    let depth = 1, i = i0, t: RegExpExecArray | null;
    tag.lastIndex = i0;
    while (depth && (t = tag.exec(s))) { depth += t[0] === '</g>' ? -1 : 1; i = tag.lastIndex; }
    out.push({ a: m.index, b: i, part: m[1] as Part, full: s.slice(m.index, i) });
    re.lastIndex = i;
  }
  return out;
}
/** The schema in one look as part twins (unlit, lit), with the slide's credit line. */
export function sceneSvg(id: string, look: Look): string {
  const s0 = schemaSvg(look, [], { id, bare: true }), s1 = schemaSvg(look, PARTS, { id, bare: true, noCredit: true });
  const w0 = wraps(s0), w1 = wraps(s1);
  if (w0.length !== w1.length || w0.some((w, i) => w.part !== w1[i].part)) throw new Error('rf78: schema wrappers differ');
  let out = '', at = 0;
  w0.forEach((w, i) => {
    out += s0.slice(at, w.a) + `<g data-q="${w.part}" data-s="0">${w.full}</g>`;
    // the chloroplast is never lit (no slide lights it): one copy
    if (w.part !== 'chl') out += `<g data-q="${w.part}" data-s="1">${w1[i].full}</g>`;
    at = w.b;
  });
  return `<g class="rfs rfs-${look}" data-look="${look}">${out}${s0.slice(at)}</g>`;
}
/** Lit sets as channel values: L:<part> = 1 lit, 0 dimmed. */
export const LIT_PARTS = PARTS.filter(p => p !== 'chl');
export function litCh(set: Iterable<Part>): Record<string, number> {
  const on = new Set(set), r: Record<string, number> = {};
  for (const p of LIT_PARTS) r[`L:${p}`] = on.has(p) ? 1 : 0;
  return r;
}

/* ================================================================ timeline */

export type Ease = (x: number) => number;
/** One move: from the channel's value when it starts, to `to`, over [at, at + d] seconds into its beat. */
export interface Move { at: number; d: number; to: Record<string, number>; ease?: Ease }
export interface CamMove { at: number; d: number; to: Tf }
export interface BeatPlan { end: number; moves: Move[]; cam?: CamMove[] }

export class Timeline {
  constructor(readonly init: Record<string, number>, readonly cam0: Tf, readonly beats: BeatPlan[]) {
    for (const b of beats) b.moves.sort((x, y) => x.at - y.at);
  }
  get ends(): number[] { return this.beats.map(b => b.end); }
  /** Channel ch at t seconds into beat b (earlier beats complete). */
  v(ch: string, b: number, t: number): number {
    let v = this.init[ch] ?? 0;
    for (let bb = 0; bb <= b && bb < this.beats.length; bb++) {
      for (const m of this.beats[bb].moves) {
        if (!(ch in m.to)) continue;
        const e = bb < b ? 1 : (m.ease ?? smooth)((t - m.at) / m.d);
        if (e <= 0) continue;
        v = lerp(v, m.to[ch], e);
      }
    }
    return v;
  }
  cam(b: number, t: number): Tf {
    let v = this.cam0;
    for (let bb = 0; bb <= b && bb < this.beats.length; bb++) {
      for (const m of this.beats[bb].cam ?? []) {
        const e = bb < b ? 1 : smoother((t - m.at) / m.d);
        if (e <= 0) continue;
        v = camTween(v, m.to, e);
      }
    }
    return v;
  }
  /** ∫ f over the beats up to (b, t), each beat frozen at its end: a phase that carries on from beat to beat. */
  integral(f: (b: number, t: number) => number, b: number, t: number, dt = 1 / 30): number {
    let s = 0;
    for (let bb = 0; bb <= b; bb++) {
      const T = bb < b ? this.beats[bb].end : Math.min(t, this.beats[bb].end);
      const n = Math.max(1, Math.ceil(T / dt));
      for (let i = 0; i < n; i++) s += f(bb, ((i + 0.5) * T) / n) * (T / n);
    }
    return s;
  }
}

/* ================================================================ paths and streams */

/** A smooth path through points (Catmull-Rom, as rf-schema.ts draws its arrows), walked at even speed: u ∈ [0, 1]. */
export function walker(q: V[]): (u: number) => V {
  const pts: V[] = [q[0]];
  for (let i = 0; i < q.length - 1; i++) {
    const p0 = q[Math.max(0, i - 1)], p1 = q[i], p2 = q[i + 1], p3 = q[Math.min(q.length - 1, i + 2)];
    const c1: V = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6], c2: V = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    for (let j = 1; j <= 30; j++) {
      const u = j / 30, w = 1 - u;
      pts.push([w ** 3 * p1[0] + 3 * w * w * u * c1[0] + 3 * w * u * u * c2[0] + u ** 3 * p2[0], w ** 3 * p1[1] + 3 * w * w * u * c1[1] + 3 * w * u * u * c2[1] + u ** 3 * p2[1]]);
    }
  }
  const acc = [0];
  for (let i = 1; i < pts.length; i++) acc.push(acc[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const L = acc[acc.length - 1];
  return u => {
    const d = Math.max(0, Math.min(1, u)) * L;
    let i = 1;
    while (i < acc.length - 1 && acc[i] < d) i++;
    return lerpV(pts[i - 1], pts[i], (d - acc[i - 1]) / Math.max(1e-6, acc[i] - acc[i - 1]));
  };
}
/** The order in which the items of a stream appear as it fills, so that any count is spread along the path. */
const RANK = [0, 4, 2, 6, 1, 5, 3, 7];
/** The items of a stream of up to 8 glyphs on a path: item i is at u = frac(phase + i/8) and shows while its rank is below
 *  count (fading in by the fraction); items fade at both ends of the path. Returns [u, opacity] per item. */
export function stream(phase: number, count: number): Array<[number, number]> {
  return RANK.map((r, i) => {
    const u = ((phase + i / 8) % 1 + 1) % 1;
    const vis = Math.max(0, Math.min(1, count - r));
    const ends = Math.min(1, u / 0.08, (1 - u) / 0.08);
    return [u, vis * Math.max(0, ends)] as [number, number];
  });
}

/* ================================================================ glyphs (figure units, drawn round their origin) */

export const glyph = (k: string, inner: string): string => `<g data-k="${k}" opacity="0" display="none">${inner}</g>`;
export const tagG = (k: 'atp' | 'nadph', w = 30, h = 15): string =>
  `<rect class="rfs-tag rfs-tag-${k} rf78-tag" x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="${h / 2}"/>`;
/** CO₂ as three small atom balls (O C O). */
export const co2G = (r = 6.5, ang = 0): string => {
  const a = (ang * Math.PI) / 180, ux = Math.cos(a), uy = Math.sin(a), st = 2 * r * 0.92;
  return ['O', 'C', 'O'].map((el, i) => `<circle class="rfs-atom rfs-atom-${el}" cx="${f1((i - 1) * st * ux)}" cy="${f1((i - 1) * st * uy)}" r="${r}"/>`).join('');
};
export const rubpG = (R = 16, label = ''): string => {
  const pts = Array.from({ length: 5 }, (_, i) => { const a = (-90 + i * 72) * Math.PI / 180; return `${f1(R * Math.cos(a))},${f1(R * Math.sin(a) + R * 0.1)}`; }).join(' ');
  return `<polygon class="rfs-rubp" points="${pts}"/>${label ? `<text class="rfs-rubpt" x="0" y="${f1(R * 0.3)}" text-anchor="middle">${label}</text>` : ''}`;
};
export const beadG = (cls: string, r = 5): string => `<circle class="${cls}" r="${r}"/>`;
export const tpG = (w = 34, h = 15): string => `<rect class="rf78-tp" x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="4"/>`;
export const photonG = (): string => `<circle class="rf78-ph-halo" r="11"/><circle class="rf78-ph" r="5"/>`;

/* ================================================================ cards and clippings (stage units) */

/** A newsprint clipping with a real figure (image win = [u0, v0, w, h] in image pixels), w wide; at() maps image pixels. */
export function clipImage(p: string, href: string, iw: number, ih: number, x: number, y: number, w: number,
  o: { win?: [number, number, number, number]; rot?: number; seed?: number; m?: number; foot?: string } = {}): { svg: string; at: (u: number, v: number) => V; h: number } {
  const [u0, v0, uw, vh] = o.win ?? [0, 0, iw, ih], m = o.m ?? 16, s = (w - 2 * m) / uw, h = vh * s + 2 * m + (o.foot ? 22 : 0);
  const ox = x + m - u0 * s, oy = y + m - v0 * s, rot = o.rot ?? 0;
  const svg = `<g transform="rotate(${rot} ${f1(x + w / 2)} ${f1(y + h / 2)})">
    <defs><filter id="${p}-sh" x="-10%" y="-8%" width="120%" height="118%"><feDropShadow dx="1" dy="4" stdDeviation="6" flood-color="#3d3020" flood-opacity=".22"/></filter>
    <clipPath id="${p}-cl"><rect x="${f1(x + m)}" y="${f1(y + m)}" width="${f1(w - 2 * m)}" height="${f1(vh * s)}"/></clipPath></defs>
    <path class="clip-paper" d="${cutPath(x, y, w, h, o.seed ?? 37, 3.2)}" filter="url(#${p}-sh)"/>
    <g clip-path="url(#${p}-cl)" class="rf78-mult"><image href="${href}" x="${f1(ox)}" y="${f1(oy)}" width="${f1(iw * s)}" height="${f1(ih * s)}"/></g>
    ${o.foot ? `<text class="rfk-cr" x="${f1(x + w - m)}" y="${f1(y + h - 12)}" text-anchor="end">${o.foot}</text>` : ''}</g>`;
  const r = (rot * Math.PI) / 180, cx = x + w / 2, cy = y + h / 2;
  const at = (u: number, v: number): V => {
    const px = ox + u * s - cx, py = oy + v * s - cy;
    return [cx + px * Math.cos(r) - py * Math.sin(r), cy + px * Math.sin(r) + py * Math.cos(r)];
  };
  return { svg, at, h };
}
/** A paper card citing one paper: authors, year and journal, and the title (two lines at most). */
export function paperCard(p: string, x: number, y: number, w: number, lines: { who: string; where: string; title: string[] }, rot = 0, seed = 51): string {
  const h = 58 + 24 * lines.title.length;
  return `<g transform="rotate(${rot} ${f1(x + w / 2)} ${f1(y + h / 2)})">
    <defs><filter id="${p}-sh" x="-10%" y="-10%" width="120%" height="125%"><feDropShadow dx="1" dy="3" stdDeviation="5" flood-color="#3d3020" flood-opacity=".2"/></filter></defs>
    <path class="clip-paper" d="${cutPath(x, y, w, h, seed, 2.6)}" filter="url(#${p}-sh)"/>
    <text class="rf78-cw" x="${f1(x + 16)}" y="${f1(y + 28)}">${lines.who}</text>
    <text class="rf78-cj" x="${f1(x + 16)}" y="${f1(y + 52)}">${lines.where}</text>
    ${lines.title.map((t, i) => `<text class="rf78-ct" x="${f1(x + 16)}" y="${f1(y + 78 + 24 * i)}">${t}</text>`).join('')}</g>`;
}

/* ================================================================ curves (panel units) */

/** Dense points of the smooth curve through pts (the same Catmull-Rom as rf-kit's curve()). */
export function dense(pts: V[], n = 24): V[] {
  const out: V[] = [pts[0]];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
    const c1: V = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6], c2: V = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    for (let j = 1; j <= n; j++) {
      const u = j / n, w = 1 - u;
      out.push([w ** 3 * p1[0] + 3 * w * w * u * c1[0] + 3 * w * u * u * c2[0] + u ** 3 * p2[0], w ** 3 * p1[1] + 3 * w * w * u * c1[1] + 3 * w * u * u * c2[1] + u ** 3 * p2[1]]);
    }
  }
  return out;
}
/** y on a polyline at x (x ascending). */
export function yAt(q: V[], x: number): number {
  if (x <= q[0][0]) return q[0][1];
  for (let i = 1; i < q.length; i++) if (x <= q[i][0]) return lerp(q[i - 1][1], q[i][1], (x - q[i - 1][0]) / Math.max(1e-9, q[i][0] - q[i - 1][0]));
  return q[q.length - 1][1];
}
/** The polyline up to x, as a path d. */
export function dUpTo(q: V[], x0: number, x1: number): string {
  if (x1 <= x0) return '';
  const pts: V[] = [[x0, yAt(q, x0)], ...q.filter(p => p[0] > x0 && p[0] < x1), [x1, yAt(q, x1)]];
  return `M${pts.map(p => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join('L')}`;
}

/** The panel's card (stage units). */
export const panelCard = (p: string): string =>
  `<rect class="rf78-card" x="${PANEL.x}" y="${PANEL.y}" width="${PANEL.w}" height="${PANEL.h}" rx="${PANEL.r}" filter="url(#${p}-sl)"/>`;
/** The schema's card and the clip that keeps the zoomed schema inside it. */
export const schemaCard = (p: string): string =>
  `<defs><filter id="${p}-sl" x="-5%" y="-5%" width="110%" height="112%"><feDropShadow dx="0" dy="8" stdDeviation="9" flood-color="#46321a" flood-opacity=".14"/></filter>
   <clipPath id="${p}-vp"><rect x="${VP.x}" y="${VP.y}" width="${VP.w}" height="${VP.h}" rx="${VP.r}"/></clipPath></defs>
   <rect class="rf78-card" x="${VP.x}" y="${VP.y}" width="${VP.w}" height="${VP.h}" rx="${VP.r}" filter="url(#${p}-sl)"/>`;

/* ================================================================ binding helpers */

export interface Bound {
  /** Every text and the glyphs inside the camera, counter-scaled with it. */
  scaleText(k: number): void;
  /** Sets each part's lit amount. */
  light(u: (p: Part) => number): void;
}
export function bindScene(cam: Element, S: { set: (el: Element, a: string, v: string) => void; op: (el: Element, v: number) => void }): Bound {
  const texts = Array.from(cam.querySelectorAll<SVGTextElement>('text')).map(el => ({ el, x: Number(el.getAttribute('x')), y: Number(el.getAttribute('y')) }));
  const pairs = new Map<string, { off: Element[]; on: Element[] }>();
  cam.querySelectorAll('[data-q]').forEach(el => {
    const p = el.getAttribute('data-q') as string, s = el.getAttribute('data-s');
    if (!pairs.has(p)) pairs.set(p, { off: [], on: [] });
    (s === '1' ? pairs.get(p)!.on : pairs.get(p)!.off).push(el);
  });
  return {
    scaleText(k) {
      const ks = k.toFixed(4);
      texts.forEach(({ el, x, y }) => S.set(el, 'transform', `matrix(${ks},0,0,${ks},${(x * (1 - k)).toFixed(2)},${(y * (1 - k)).toFixed(2)})`));
    },
    light(u) {
      pairs.forEach((g, p) => {
        if (p === 'chl') return;
        const v = Math.max(0, Math.min(1, u(p as Part)));
        g.off.forEach(el => S.op(el, Math.min(1, 2 * (1 - v))));
        g.on.forEach(el => S.op(el, Math.min(1, 2 * v)));
      });
    },
  };
}

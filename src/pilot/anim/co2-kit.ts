// The CO₂-story animations of slides C10, C11 and C11a (keys lf10, lf11, lf11a; brief research/redo-2026-10-29/
// CO2_DIFFUSION_STORY_BRIEF.md): what their stagings share.
// - A plain scene engine: the stage markup is drawn once; every moving or appearing piece is an actor (data-actor),
//   hidden unless the frame shows it, so each frame is a pure function of (beat, t). One fixed framing, no camera.
// - The CO₂ character: the deck's O–C–O atom balls (atom-O, atom-C), a face on the C ball (neutral, strained, glad),
//   a sweat drop, and a water shell for dissolved CO₂. The face only marks a resistance; the path and the numbers are
//   the physics.
// - Drift along gently curved paths whose speed depends on where the molecule is (slow in a resistance), eased at both
//   ends, never jittered.
// - Round magnifier insets: a lens ring on the section, two tangent lines, the enlarged drawing clipped to a circle.
// - Drawn cells: smooth closed outlines, chloroplasts lining the wall, mitochondria with cristae, a peroxisome.
import './dk1-common.css';
import './co2-kit.css';
import { balls, bilayer } from '../figs/cell-schema';
import { row, rowWidth } from '../figs/carbon-form';
import { clamp, ease, curve, lerp, type V } from './lf-common';
import type { Beat, Staging } from './types';

export { add, clamp, ease, ease2, glide, life, lerp, lerpV, path, type V } from './lf-common';

export const f = (v: number): string => (Math.round(v * 100) / 100).toString();
export type Anchor = 'start' | 'middle' | 'end';
/** A text line (cls from the deck's figure classes or co2k-*). */
export const T = (x: number, y: number, s: string, cls: string, a: Anchor = 'middle', extra = ''): string =>
  `<text class="${cls}" x="${f(x)}" y="${f(y)}" text-anchor="${a}"${extra}>${s}</text>`;
/** Symbols set as the slide text sets them: an italic letter with a real subscript. */
export const sym = (l: string, sub: string): string => `<tspan font-style="italic">${l}</tspan><tspan class="co2k-sub" dy="4">${sub}</tspan><tspan dy="-4"> </tspan>`;

/* ================================================================ the engine */

export interface Api {
  /** Shows actor k at `at` (stage units), opacity o, uniform scale sc. */
  put(k: string, at: V, o?: number, sc?: number): void;
  /** Opacity of any keyed element (an actor counts as shown). */
  op(k: string, v: number): void;
  attr(k: string, a: string, v: string): void;
  txt(k: string, s: string): void;
}
export interface SceneOpt {
  id: string; name: string; note: string; beats?: Beat[]; holds?: number[][];
  /** The stage markup (viewBox 0 0 1600 740). */
  svg(): string;
  frame(a: Api, beat: number, t: number): void;
}

export function makeScene(o: SceneOpt): Staging {
  return {
    id: o.id, name: o.name, note: o.note, ...(o.beats ? { beats: o.beats } : {}), ...(o.holds ? { holds: o.holds } : {}),
    svg: () => `<g class="dk1 fig co2k">${o.svg()}</g>`,
    bind(stage) {
      const cache = new Map<Element, Map<string, string>>();
      const set = (el: Element | null | undefined, a: string, v: string): void => {
        if (!el) return;
        let m = cache.get(el);
        if (!m) { m = new Map(); cache.set(el, m); }
        if (m.get(a) === v) return;
        m.set(a, v);
        if (a === 'text') el.textContent = v; else el.setAttribute(a, v);
      };
      const els = new Map<string, Element>();
      stage.querySelectorAll('[data-k]').forEach(el => els.set(el.getAttribute('data-k') as string, el));
      const actors = [...stage.querySelectorAll('[data-actor]')].map(el => el.getAttribute('data-k') as string);
      const shown = new Set<string>();
      const opEl = (el: Element | undefined, v: number): void => { set(el, 'display', v < 0.004 ? 'none' : 'inline'); set(el, 'opacity', v >= 0.996 ? '1' : v.toFixed(3)); };
      const api: Api = {
        put(k, at, op = 1, sc = 1) { const el = els.get(k); shown.add(k); opEl(el, op); if (op >= 0.004) set(el, 'transform', `translate(${f(at[0])} ${f(at[1])})${Math.abs(sc - 1) > 0.001 ? ` scale(${sc.toFixed(3)})` : ''}`); },
        op(k, v) { shown.add(k); opEl(els.get(k), v); },
        attr(k, a, v) { set(els.get(k), a, v); },
        txt(k, s) { set(els.get(k), 'text', s); },
      };
      return (beat, t) => {
        shown.clear();
        o.frame(api, beat, t);
        for (const k of actors) if (!shown.has(k)) opEl(els.get(k), 0);
      };
    },
  };
}
/** An actor: markup that is hidden unless the frame shows it. */
export const actor = (k: string, inner: string, cls = ''): string => `<g data-k="${k}" data-actor="1" display="none"${cls ? ` class="${cls}"` : ''}>${inner}</g>`;
/** Fade in over [a0, a1] and out over [b0, b1] (b0 = Infinity: stays). */
export const fade = (t: number, a0: number, a1: number, b0 = Infinity, b1 = Infinity): number => ease(t, a0, a1) * (b0 === Infinity ? 1 : 1 - ease(t, b0, b1));
/** 1 in beats after b, the fade-in [t0, t1] in beat b, 0 before. */
export const from = (beat: number, t: number, b: number, t0: number, t1 = t0 + 0.5): number => (beat > b ? 1 : beat === b ? ease(t, t0, t1) : 0);

/* ================================================================ motion: drift with a speed field */

/** A drift along a gently curved path through q, from t0 to t1: its speed at each point is speed(p) (1 = free, small =
 *  a resistance), smoothed and eased at both ends. Returns the place at t and the local relative speed there. */
export function drift(q: V[], speed: (p: V) => number, t0: number, t1: number): (t: number) => { p: V; v: number; u: number } {
  const c = curve(q), N = 360, ts = [0], vs: number[] = [];
  const end = (u: number): number => 0.3 + 0.7 * Math.min(ease(u, 0, 0.1), 1 - ease(u, 0.9, 1));
  for (let i = 0; i <= N; i++) vs.push(Math.max(0.03, speed(c(i / N))));
  // smooth the speed over ±6 samples so that it changes gently at a boundary
  const sm = vs.map((_, i) => { let s = 0, n = 0; for (let j = -6; j <= 6; j++) { const k = i + j; if (k >= 0 && k <= N) { s += vs[k]; n++; } } return s / n; });
  for (let i = 1; i <= N; i++) ts.push(ts[i - 1] + 1 / (sm[i] * end(i / N)));
  const tot = ts[N];
  return (t: number) => {
    const w = clamp((t - t0) / (t1 - t0)) * tot;
    let lo = 0, hi = N;
    while (hi - lo > 1) { const m = (lo + hi) >> 1; if (ts[m] < w) lo = m; else hi = m; }
    const fr = ts[hi] - ts[lo] ? (w - ts[lo]) / (ts[hi] - ts[lo]) : 0, u = (lo + fr) / N;
    return { p: c(u), v: lerp(sm[lo], sm[hi], fr), u };
  };
}
const dmemo = new Map<string, ReturnType<typeof drift>>();
/** drift(), memoized by its key. */
export function driftM(key: string, q: V[], speed: (p: V) => number, t0: number, t1: number): ReturnType<typeof drift> {
  let d = dmemo.get(key);
  if (!d) { d = drift(q, speed, t0, t1); dmemo.set(key, d); }
  return d;
}

/* ================================================================ the CO₂ character */

/** The CO₂ character, drawn at the origin: atom balls O–C–O (O letters), a face on the C ball, a sweat drop and a water
 *  shell, each keyed for the frame: `${k}-b` body (squeeze), `${k}-fn` neutral, `${k}-fs` strained, `${k}-fh` glad,
 *  `${k}-sw` sweat, `${k}-sh` water shell, `${k}-l` name. */
export function kidG(k: string, r: number, lab = 'CO₂', labDy?: number): string {
  const s = 1.7 * r, ink = 'co2k-face', w = r * 0.1;
  const o = (x: number): string => `<circle class="atom atom-O" cx="${f(x)}" cy="0" r="${f(r)}"/><text class="co2k-att" x="${f(x)}" y="${f(r * 0.42)}" text-anchor="middle" style="font-size:${f(Math.max(12, r * 1.15))}px">O</text>`;
  const p = (d: string, extra = ''): string => `<path class="${ink}" d="${d}" style="stroke-width:${f(Math.max(1.4, w * 1.2))}px"${extra}/>`;
  const R = (v: number): string => f(v * r);
  const eyes = `<circle class="co2k-eye" cx="${R(-0.36)}" cy="${R(-0.14)}" r="${f(Math.max(1.5, r * 0.13))}"/><circle class="co2k-eye" cx="${R(0.36)}" cy="${R(-0.14)}" r="${f(Math.max(1.5, r * 0.13))}"/>`;
  const neutral = `${eyes}${p(`M${R(-0.3)},${R(0.36)}Q0,${R(0.5)} ${R(0.3)},${R(0.36)}`)}`;
  const strained = p(`M${R(-0.56)},${R(-0.34)}L${R(-0.22)},${R(-0.14)}L${R(-0.56)},${R(0.04)}M${R(0.56)},${R(-0.34)}L${R(0.22)},${R(-0.14)}L${R(0.56)},${R(0.04)}`)
    + p(`M${R(-0.42)},${R(0.42)}l${R(0.14)},${R(-0.12)}l${R(0.14)},${R(0.12)}l${R(0.14)},${R(-0.12)}l${R(0.14)},${R(0.12)}l${R(0.14)},${R(-0.12)}l${R(0.14)},${R(0.12)}`);
  const glad = p(`M${R(-0.5)},${R(-0.08)}Q${R(-0.36)},${R(-0.34)} ${R(-0.22)},${R(-0.08)}M${R(0.22)},${R(-0.08)}Q${R(0.36)},${R(-0.34)} ${R(0.5)},${R(-0.08)}`)
    + `<path class="co2k-mouth" d="M${R(-0.36)},${R(0.24)}Q0,${R(0.7)} ${R(0.36)},${R(0.24)}Z"/>`;
  const drop = `<path class="co2k-sweat" d="M${R(0.62)},${R(-1.58)}C${R(0.86)},${R(-1.24)} ${R(0.86)},${R(-1.02)} ${R(0.62)},${R(-1.0)}C${R(0.38)},${R(-1.02)} ${R(0.38)},${R(-1.24)} ${R(0.62)},${R(-1.58)}Z"/>`;
  // the water shell: a pale disc and 6 water molecules round the CO₂
  const sr = r * 2.25, wr = r * 0.4;
  const waters = Array.from({ length: 6 }, (_, i) => {
    const a = (i / 6) * Math.PI * 2 + Math.PI / 6, x = sr * Math.cos(a), y = sr * 0.78 * Math.sin(a);
    const h = (sg: number): string => { const ang = a + sg * 0.95; return `<circle class="atom atom-H" cx="${f(x + wr * 1.15 * Math.cos(ang))}" cy="${f(y + wr * 1.15 * Math.sin(ang))}" r="${f(wr * 0.56)}"/>`; };
    return `${h(1)}${h(-1)}<circle class="atom atom-O" cx="${f(x)}" cy="${f(y)}" r="${f(wr)}"/>`;
  }).join('');
  const shell = `<ellipse class="co2k-shell" rx="${f(sr + wr * 0.6)}" ry="${f(sr * 0.78 + wr * 0.6)}"/>${waters}`;
  const cap = `<rect class="dk-cap" x="${f(-s - r - 4)}" y="${f(-r - 4)}" width="${f(2 * s + 2 * r + 8)}" height="${f(2 * r + 8)}" rx="${f(r + 4)}"/>`;
  return actor(k, `<g data-k="${k}-b"><g data-k="${k}-sh">${shell}</g>${cap}${o(-s)}${o(s)}<circle class="atom atom-C" r="${f(r)}"/>
    <g data-k="${k}-fn">${neutral}</g><g data-k="${k}-fs">${strained}</g><g data-k="${k}-fh">${glad}</g><g data-k="${k}-sw">${drop}</g></g>
    ${lab ? `<text data-k="${k}-l" class="cel-mn cel-halo co2k-kl" x="0" y="${f(labDy ?? -r - 12)}" text-anchor="middle">${lab}</text>` : ''}`);
}
export interface Mood { n?: number; s?: number; h?: number; sweat?: number; shell?: number; sx?: number; sy?: number; lab?: number }
/** Shows the CO₂ character k: its face weights (neutral, strained, glad), sweat, shell, squeeze and name. */
export function kid(a: Api, k: string, at: V, o: number, m: Mood, sc = 1): void {
  a.put(k, at, o, sc);
  if (o < 0.004) return;
  const s = clamp(m.s ?? 0), h = clamp(m.h ?? 0), n = m.n ?? clamp(1 - s - h);
  a.op(`${k}-fn`, n); a.op(`${k}-fs`, s); a.op(`${k}-fh`, h);
  a.op(`${k}-sw`, clamp(m.sweat ?? 0)); a.op(`${k}-sh`, clamp(m.shell ?? 0)); a.op(`${k}-l`, clamp(m.lab ?? 0));
  const sx = m.sx ?? 1, sy = m.sy ?? 1;
  a.attr(`${k}-b`, 'transform', Math.abs(sx - 1) + Math.abs(sy - 1) > 0.002 ? `scale(${sx.toFixed(3)} ${sy.toFixed(3)})` : '');
}

/* ================================================================ plain glyphs (deck style) */

/** Water: an O ball with two H balls (illus/leaf-schema style). */
export function h2oG(r = 10): string {
  return `<circle class="atom atom-H" cx="${f(-r * 1.05)}" cy="${f(r * 0.8)}" r="${f(r * 0.56)}"/><circle class="atom atom-H" cx="${f(r * 1.05)}" cy="${f(r * 0.8)}" r="${f(r * 0.56)}"/>${balls(0, 0, 'O', r)}`;
}
export const co2G = (r = 10): string => balls(0, 0, 'OCO', r);
export const o2G = (r = 10): string => balls(0, 0, 'OO', r);
/** A metabolite in carbon form with a pale capsule. */
export const carbG = (formula: string, r = 9): string => `<rect class="dk-cap" x="${f(-rowWidth(formula.length, r) / 2 - 5)}" y="${f(-r - 5)}" width="${f(rowWidth(formula.length, r) + 10)}" height="${f(2 * r + 10)}" rx="${f(r + 5)}"/>${row(0, 0, formula, { r })}`;
/** NH₃: an N ball with three H balls. */
export const nh3G = (r = 9): string => `<circle class="atom atom-H" cx="${f(-r * 1.2)}" cy="${f(r * 0.75)}" r="${f(r * 0.55)}"/><circle class="atom atom-H" cx="${f(r * 1.2)}" cy="${f(r * 0.75)}" r="${f(r * 0.55)}"/><circle class="atom atom-H" cx="0" cy="${f(-r * 1.3)}" r="${f(r * 0.55)}"/><circle class="cbb-n" r="${f(r)}"/>${T(0, r * 0.44, 'N', 'cbb-nt')}`;
/** A flash where a reaction happens (radial gradient #<p>-flash, see flashDefs). */
export const flashDefs = (p: string): string => `<radialGradient id="${p}-flash"><stop offset="0" stop-color="#fff4d6"/><stop offset=".45" stop-color="#f6c453" stop-opacity=".8"/><stop offset="1" stop-color="#f0a316" stop-opacity="0"/></radialGradient>`;
export const flashG = (p: string, r = 30): string => `<circle r="${r}" fill="url(#${p}-flash)"/>`;
export const flash = (a: Api, t: number, tf: number, at: V, k: string, sc = 1): void => { if (t > tf - 0.15 && t < tf + 0.55) a.put(k, at, ease(t, tf - 0.15, tf) * (1 - ease(t, tf + 0.1, tf + 0.55)), sc); };
/** A tick mark with a word ("fixed", "used"). */
export const tickG = (word: string): string => `<path class="co2k-tick" d="M-9,0l6,7l12,-15"/>${T(14, 6, word, 'co2k-tickt', 'start')}`;

/* ================================================================ drawn cells */

/** A smooth closed outline through points (Catmull–Rom as cubic Béziers). */
export function closed(q: V[]): string {
  const n = q.length;
  let s = `M${f(q[0][0])},${f(q[0][1])}`;
  for (let i = 0; i < n; i++) {
    const p0 = q[(i - 1 + n) % n], p1 = q[i], p2 = q[(i + 1) % n], p3 = q[(i + 2) % n];
    s += `C${f(p1[0] + (p2[0] - p0[0]) / 6)},${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)},${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])},${f(p2[1])}`;
  }
  return `${s}Z`;
}
/** A blob: n points round (cx, cy), radii rx, ry, gently lobed by a seed. */
export function blob(cx: number, cy: number, rx: number, ry: number, seed: number, n = 12, lobe = 0.1): V[] {
  return Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2, k = 1 + lobe * Math.sin(3 * a + seed) + lobe * 0.6 * Math.sin(5 * a + seed * 2.3);
    return [cx + rx * k * Math.cos(a), cy + ry * k * Math.sin(a)] as V;
  });
}
/** A rounded rectangle as points (for closed()). */
export function rbox(x: number, y: number, w: number, h: number, r: number): V[] {
  const out: V[] = [];
  const arc = (cx: number, cy: number, a0: number): void => { for (let i = 0; i <= 2; i++) { const a = a0 + (i / 2) * (Math.PI / 2); out.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); } };
  arc(x + w - r, y + r, -Math.PI / 2); arc(x + w - r, y + h - r, 0); arc(x + r, y + h - r, Math.PI / 2); arc(x + r, y + r, Math.PI);
  return out;
}
/** The smooth closed outline of closed(q), sampled finely. */
export function outline(q: V[], per = 24): V[] {
  const n = q.length, out: V[] = [];
  for (let i = 0; i < n; i++) {
    const p0 = q[(i - 1 + n) % n], p1 = q[i], p2 = q[(i + 1) % n], p3 = q[(i + 2) % n];
    for (let j = 0; j < per; j++) {
      const s = j / per, s2 = s * s, s3 = s2 * s;
      const c = (a: number, b: number, cc: number, d: number): number => 0.5 * (2 * b + (-a + cc) * s + (2 * a - 5 * b + 4 * cc - d) * s2 + (-a + 3 * b - 3 * cc + d) * s3);
      out.push([c(p0[0], p1[0], p2[0], p3[0]), c(p0[1], p1[1], p2[1], p3[1])]);
    }
  }
  return out;
}
/** Points spaced `step` apart along the closed outline of q, `inset` inside it, with the outline's direction (radians);
 *  skip(p) leaves a place out. */
export function along(q: V[], step: number, inset: number, skip?: (p: V) => boolean): Array<{ p: V; a: number }> {
  const pts = outline(q), n = pts.length;
  let cx = 0, cy = 0; for (const p of pts) { cx += p[0]; cy += p[1]; } cx /= n; cy /= n;
  const out: Array<{ p: V; a: number }> = [];
  let acc = step / 2;
  for (let i = 0; i < n; i++) {
    const a = pts[i], b = pts[(i + 1) % n], L = Math.hypot(b[0] - a[0], b[1] - a[1]);
    acc += L;
    if (acc < step) continue;
    acc = 0;
    let nx = -(b[1] - a[1]) / (L || 1), ny = (b[0] - a[0]) / (L || 1);
    if ((cx - a[0]) * nx + (cy - a[1]) * ny < 0) { nx = -nx; ny = -ny; }
    const p: V = [a[0] + nx * inset, a[1] + ny * inset];
    if (skip && skip(p)) continue;
    out.push({ p, a: Math.atan2(b[1] - a[1], b[0] - a[0]) });
  }
  return out;
}
/** A chloroplast at p, long axis at angle a (radians): envelope, stroma, two grana. */
export function chloroG(p: V, a: number, w: number, h: number, cls = 'co2k-cp'): string {
  const deg = (a * 180) / Math.PI;
  const gr = w > 26 ? `<path class="co2k-gr" d="M${f(-w * 0.28)},${f(-h * 0.18)}h${f(w * 0.16)}M${f(-w * 0.28)},0h${f(w * 0.16)}M${f(-w * 0.28)},${f(h * 0.18)}h${f(w * 0.16)}M${f(w * 0.1)},${f(-h * 0.18)}h${f(w * 0.16)}M${f(w * 0.1)},0h${f(w * 0.16)}M${f(w * 0.1)},${f(h * 0.18)}h${f(w * 0.16)}"/>` : '';
  return `<g transform="translate(${f(p[0])} ${f(p[1])}) rotate(${f(deg)})"><ellipse class="${cls}" rx="${f(w / 2)}" ry="${f(h / 2)}"/>${gr}</g>`;
}
/** A mitochondrion at p, long axis at angle a: outer membrane, matrix, cristae. */
export function mitoG(p: V, a: number, w: number, h: number, cls = 'co2k-mt'): string {
  const deg = (a * 180) / Math.PI, n = Math.max(2, Math.round(w / 11));
  const cr = Array.from({ length: n }, (_, i) => { const x = -w / 2 + (w * (i + 0.7)) / (n + 0.4), up = i % 2 === 0; return `M${f(x)},${f(up ? -h / 2 + 2 : h / 2 - 2)}v${f(up ? h * 0.55 : -h * 0.55)}`; }).join('');
  return `<g transform="translate(${f(p[0])} ${f(p[1])}) rotate(${f(deg)})"><ellipse class="${cls}" rx="${f(w / 2)}" ry="${f(h / 2)}"/><path class="co2k-crista" d="${cr}"/></g>`;
}
/** A peroxisome: a small round organelle with a dense core. */
export const peroxG = (p: V, r: number): string => `<circle class="co2k-px" cx="${f(p[0])}" cy="${f(p[1])}" r="${f(r)}"/><circle class="co2k-pxc" cx="${f(p[0] + r * 0.15)}" cy="${f(p[1] - r * 0.1)}" r="${f(r * 0.42)}"/>`;
/** A stromule: a thin stroma-filled tube from a chloroplast, through points. */
export const stromuleG = (q: V[]): string => { const c = curve(q); const pts = Array.from({ length: 30 }, (_, i) => c(i / 29)); return `<path class="co2k-stromule" d="M${pts.map(p => `${f(p[0])},${f(p[1])}`).join('L')}"/>`; };

/* ================================================================ magnifier insets */

/** The two outer tangent lines from a lens circle (c1, r1) to an inset circle (c2, r2). */
export function tangents(c1: V, r1: number, c2: V, r2: number): string {
  const dx = c2[0] - c1[0], dy = c2[1] - c1[1], d = Math.hypot(dx, dy), a = Math.atan2(dy, dx), b = Math.acos((r1 - r2) / d);
  const seg = (s: number): string => {
    const t = a + s * b;
    return `M${f(c1[0] + r1 * Math.cos(t))},${f(c1[1] + r1 * Math.sin(t))}L${f(c2[0] + r2 * Math.cos(t))},${f(c2[1] + r2 * Math.sin(t))}`;
  };
  return `${seg(1)}${seg(-1)}`;
}
/** A magnifier: the lens ring on the section and the tangent lines (actor `${k}-lens`), the inset (actor `${k}`, its
 *  drawing clipped to the circle, then the ring on top). */
export function inset(p: string, k: string, lens: V, lr: number, c: V, r: number, inner: string, over = ''): { lens: string; box: string } {
  return {
    lens: actor(`${k}-lens`, `<path class="co2k-tan" d="${tangents(lens, lr, c, r)}"/><circle class="co2k-lens" cx="${f(lens[0])}" cy="${f(lens[1])}" r="${lr}"/>`),
    box: actor(k, `<clipPath id="${k}-c"><circle cx="${f(c[0])}" cy="${f(c[1])}" r="${r}"/></clipPath>
      <circle class="co2k-inbg" cx="${f(c[0])}" cy="${f(c[1])}" r="${r}"/>
      <g clip-path="url(#${k}-c)">${inner}</g>
      <circle class="co2k-inring" cx="${f(c[0])}" cy="${f(c[1])}" r="${r}"/>${over}`),
  };
}

/* ================================================================ membranes at inset scale */

/** A horizontal bilayer from x0 to x1 at y (heads on both faces). */
export const bilayerH = (x0: number, x1: number, y: number, half = 6): string => bilayer([{ L: [x0, y, x1, y] }], half, 1.8, 4.4);
/** A bilayer along an ellipse. */
export const bilayerE = (cx: number, cy: number, rx: number, ry: number, half = 4): string => bilayer([{ A: [cx, cy, rx, ry, -90, 270] }], half, 1.4, 3.6);

/* ================================================================ a thermometer and a sun */

export const thermoG = (k: string, x: number, y: number, h = 86): string => `<rect class="co2k-th" x="${x - 8}" y="${y}" width="16" height="${h}" rx="8"/><circle class="co2k-th" cx="${x}" cy="${y + h + 10}" r="14"/>
  <rect data-k="${k}-f" class="co2k-thf" x="${x - 4}" y="${y + h - 30}" width="8" height="40"/><circle class="co2k-thf" cx="${x}" cy="${y + h + 10}" r="10"/>`;
/** Sets the thermometer's fill for a temperature on 15–40 °C. */
export function thermoSet(a: Api, k: string, y: number, temp: number, h = 86): void {
  const fh = 8 + (h - 12) * clamp((temp - 15) / 25);
  a.attr(`${k}-f`, 'y', f(y + h + 4 - fh)); a.attr(`${k}-f`, 'height', f(fh + 4));
}
export const sunG = (r = 16): string => `<g class="co2k-sun"><circle r="${r}"/>${Array.from({ length: 8 }, (_, i) => { const a = (i * Math.PI) / 4; return `<path d="M${f((r + 6) * Math.cos(a))},${f((r + 6) * Math.sin(a))}L${f((r + 14) * Math.cos(a))},${f((r + 14) * Math.sin(a))}"/>`; }).join('')}</g>`;


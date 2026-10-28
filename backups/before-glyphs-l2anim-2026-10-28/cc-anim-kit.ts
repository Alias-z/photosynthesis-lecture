// Shared kit of the chunk cc animations (C11 refixation → C₂, C12 C₄, C13 CAM; 28 Oct 2026, overnight).
// Every staging draws as a pure function of (beat, t), as the other lecture animations do: T(n) gives the seconds into beat
// n (−1 before it, 99 after it), so going back replays nothing and a large t is the beat's end state.
// - The camera scales a world group that holds the slide's own figure (the four-panel schema of figs/cc-schema.ts, or one of
//   the slide's figures), drawn by the same draw function as the slide, in the slide's figure card.
// - Moving glyphs (CO₂, glycine, C₄ acid), labels, readouts and cards live in stage space (1600 × 740), placed on the world
//   through the camera of the view they belong to, so their size stays readable whatever the zoom.
import { molecule } from '../illus';
import { cutPath, setters, smooth, smoother, tfStr, tween, type Tf, type V } from './antenna-common';
import './cc-anim.css';

export { cutPath, setters, smooth, smoother, tfStr, tween, type Tf, type V };
export type Rect = [number, number, number, number];
export type S = ReturnType<typeof setters>;

export const f1 = (v: number): string => v.toFixed(1);
export const clamp01 = (x: number): number => Math.max(0, Math.min(1, x));
export const lerp = (a: number, b: number, e: number): number => a + (b - a) * e;
export const lerpV = (a: V, b: V, e: number): V => [lerp(a[0], b[0], e), lerp(a[1], b[1], e)];
/** 0 → 1 from t0 to t1, eased. */
export const tw = (t: number, t0: number, t1: number): number => smooth((t - t0) / (t1 - t0));
/** A move of about 1 s, eased at both ends. */
export const mv = (t: number, t0: number, d: number): number => smoother((t - t0) / d);
/** Appears whole (labels, cards, portraits): a quick 0.25 s fade. */
export const pop = (t: number, t0: number): number => tw(t, t0, t0 + 0.25);
export const onStage = (v: Tf, p: V): V => [v.s * p[0] + v.t[0], v.s * p[1] + v.t[1]];

/** The view that fits world rect r into stage box (centred). */
export function fit(r: Rect, box: Rect = [40, 30, 1520, 680]): Tf {
  const s = Math.min(box[2] / r[2], box[3] / r[3]);
  return { s, t: [box[0] + box[2] / 2 - s * (r[0] + r[2] / 2), box[1] + box[3] / 2 - s * (r[1] + r[3] / 2)] };
}
/** The slide figure (800 × 600) as the slide shows it, in its card, filling the stage (as b6f8). */
export const SLIDE: Tf = { s: 1.07, t: [800 - 1.07 * 400, 370 - 1.07 * 300] };
/** The slide's figure card, in figure units (pilot.css .lay-figure .fig, with the paper look's fill and edge). */
export const CARD = { x: -43.3, y: -30.9, w: 886.6, h: 661.9, r: 22.7 };
export const slideCard = (p: string): string => `<defs><filter id="${p}-sl" x="-5%" y="-5%" width="110%" height="112%"><feDropShadow dx="0" dy="8" stdDeviation="9" flood-color="#46321a" flood-opacity=".14"/></filter></defs>
  <rect class="cca-slidecard" x="${CARD.x}" y="${CARD.y}" width="${CARD.w}" height="${CARD.h}" rx="${CARD.r}" filter="url(#${p}-sl)"/>`;
export const strip = (s: string): string => s.replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');

/** Seconds into beat n while beat b plays at tt: −1 before it, 99 after it. */
export const clock = (b: number, tt: number) => (n: number): number => (b === n ? tt : b > n ? 99 : -1);

/** A camera path: views[i] holds from the end of its move; moves[i] = [beat, t0, d] goes from views[i] to views[i + 1]. */
export function camera(views: Tf[], moves: Array<[number, number, number]>, T: (n: number) => number): Tf {
  let v = views[0];
  moves.forEach(([n, t0, d], i) => { const u = mv(T(n), t0, d); if (u > 0) v = tween(v, views[i + 1], u); });
  return v;
}
/** Scale of text in a zoomed world, so that it grows only gently with the camera (as psii7/b6f8). */
export const kOf = (s: number, s0 = SLIDE.s): number => Math.min(1, (s / s0) ** -0.7);

/** Counter-scales every text of a world group about its own anchor. */
export function textScaler(root: Element, S: S): (k: number) => void {
  const texts = Array.from(root.querySelectorAll<SVGTextElement>('text')).filter(el => !el.hasAttribute('transform'))
    .map(el => ({ el, x: Number(el.getAttribute('x')), y: Number(el.getAttribute('y')) }));
  return k => texts.forEach(({ el, x, y }) => S.set(el, 'transform', k > 0.999 ? '' : `matrix(${k.toFixed(4)},0,0,${k.toFixed(4)},${(x * (1 - k)).toFixed(2)},${(y * (1 - k)).toFixed(2)})`));
}

/* ---------------------------------------------------------------- glyphs (drawn round their origin, stage px) */

/** CO₂ as three atom balls; iso 13 marks the carbon as ¹³C (blue), for the isotope experiment. */
export function co2G(r = 9, iso: 12 | 13 = 12): string {
  const d = r * 1.55;
  const atom = (x: number, a: string, cls: string, s: string): string =>
    `<circle class="atom ${cls}" cx="${f1(x)}" cy="0" r="${r}"/><text class="cca-atom${a === 'C' ? ' cca-atom-c' : ''}" x="${f1(x)}" y="${f1(r * 0.38)}" text-anchor="middle" style="font-size:${f1(r * (s.length > 1 ? 0.9 : 1.05))}px">${s}</text>`;
  return atom(-d, 'O', 'atom-O', 'O') + atom(0, 'C', iso === 13 ? 'cca-c13' : 'atom-C', 'C') + atom(d, 'O', 'atom-O', 'O');
}
export { molecule };
/** A small bead (glycine clay, C₄ acid teal, malic acid plum). */
export const bead = (cls: string, r = 8): string => `<circle class="${cls}" r="${r}"/>`;
/** A short ring that flashes where a CO₂ is fixed. */
export const ring = (r = 16): string => `<circle class="cca-fix" r="${r}"/>`;

/** A glyph in stage space: opacity 0 until placed. */
export const glyph = (k: string, inner: string, o = 0): string => `<g data-k="${k}" opacity="${o}">${inner}</g>`;
export function put(S: S, k: string, at: V, o: number, sc = 1): void {
  const el = S.q(k);
  if (!el) return;
  S.op(el, o);
  if (o > 0.004) S.set(el, 'transform', `translate(${f1(at[0])} ${f1(at[1])})${Math.abs(sc - 1) > 0.002 ? ` scale(${sc.toFixed(3)})` : ''}`);
}

/** Stage text. */
export const tx = (x: number, y: number, s: string, cls: string, a: 'start' | 'middle' | 'end' = 'middle'): string =>
  `<text class="${cls}" x="${f1(x)}" y="${f1(y)}" text-anchor="${a}">${s}</text>`;
/** A label on a paper pill, centred at (x, y), stage px; with `to`, a leader to that point. */
export function label(x: number, y: number, s: string, o: { to?: V; cls?: string; k?: number } = {}): string {
  const w = s.replace(/<[^>]+>/g, '').replace(/[₀-₉⁰-⁹]/g, '').length * (o.k ?? 13.2) + 30;
  let ld = '';
  if (o.to) {
    const dx = o.to[0] - x, dy = o.to[1] - y;
    const u = Math.min(w / 2 / Math.max(Math.abs(dx), 1e-6), 20 / Math.max(Math.abs(dy), 1e-6));
    const a: V = [x + dx * u, y + dy * u];
    const d = `M${f1(a[0])},${f1(a[1])}L${f1(o.to[0])},${f1(o.to[1])}`;
    ld = `<path class="cca-ldh" d="${d}"/><path class="cca-ldk" d="${d}"/><circle class="cca-tip" cx="${f1(o.to[0])}" cy="${f1(o.to[1])}" r="4"/>`;
  }
  return `${ld}<rect class="cca-pill" x="${f1(x - w / 2)}" y="${f1(y - 20)}" width="${f1(w)}" height="40" rx="20"/>${tx(x, y + 8.5, s, o.cls ?? 'cca-pt')}`;
}

/** A journal clipping: newsprint with the paper's journal line, title and authors, set in the deck's serif. */
export function clipping(p: string, x: number, y: number, w: number, o: { journal: string; title: string[]; authors: string; rot?: number; seed?: number }): { svg: string; h: number } {
  const h = 70 + o.title.length * 38 + 46;
  const lines = o.title.map((s, i) => tx(x + 24, y + 86 + i * 38, s, 'cca-clip-title', 'start')).join('');
  return {
    h,
    svg: `<g transform="rotate(${o.rot ?? -1.4} ${f1(x + w / 2)} ${f1(y + h / 2)})">
      <defs><filter id="${p}-csh" x="-10%" y="-10%" width="120%" height="130%"><feDropShadow dx="1" dy="4" stdDeviation="6" flood-color="#3d3020" flood-opacity=".22"/></filter></defs>
      <path class="clip-paper" d="${cutPath(x, y, w, h, o.seed ?? 37, 3.2)}" filter="url(#${p}-csh)"/>
      ${tx(x + 24, y + 40, o.journal, 'cca-clip-journal', 'start')}
      <path class="cca-clip-rule" d="M${x + 24},${y + 54} H${x + w - 24}"/>
      ${lines}${tx(x + 24, y + 86 + o.title.length * 38 + 2, o.authors, 'cca-clip-auth', 'start')}</g>`,
  };
}

/** A printed card (paper, shadow) for real images and redrawn graphs over the stage. */
export const card = (p: string, x: number, y: number, w: number, h: number, seed = 41): string =>
  `<defs><filter id="${p}-ksh" x="-6%" y="-6%" width="112%" height="116%"><feDropShadow dx="1" dy="5" stdDeviation="8" flood-color="#3d3020" flood-opacity=".2"/></filter></defs>
  <path class="cca-card" d="${cutPath(x, y, w, h, seed, 2.2)}" filter="url(#${p}-ksh)"/>`;

/** A real image in a rounded window: win = [u0, v0, w, h] of the image (px), shown w wide at (x, y). at() maps image px → stage. */
export function photo(id: string, href: string, iw: number, ih: number, x: number, y: number, w: number,
  win: Rect = [0, 0, iw, ih], o: { r?: number; mult?: boolean } = {}): { svg: string; at: (u: number, v: number) => V; h: number } {
  const [u0, v0, uw, vh] = win, s = w / uw, h = vh * s, ox = x - u0 * s, oy = y - v0 * s, r = o.r ?? 12;
  return {
    h,
    at: (u, v) => [ox + u * s, oy + v * s],
    svg: `<clipPath id="${id}"><rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" rx="${r}"/></clipPath>
      <g clip-path="url(#${id})"${o.mult ? ' class="cca-mult"' : ''}><image href="${href}" x="${f1(ox)}" y="${f1(oy)}" width="${f1(iw * s)}" height="${f1(ih * s)}" preserveAspectRatio="none"/></g>
      ${o.mult ? '' : `<rect class="cca-frame" x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" rx="${r}"/>`}`,
  };
}
/** Small grey credit, stage px. */
export const credit = (x: number, y: number, s: string, a: 'start' | 'middle' | 'end' = 'end'): string => tx(x, y, s, 'cca-cr', a);

/* ---------------------------------------------------------------- paths */

/** A smooth path through points (Catmull-Rom), walked at even speed: u ∈ [0, 1]. */
export function walker(q: V[]): (u: number) => V {
  const pts: V[] = [q[0]];
  for (let i = 0; i < q.length - 1; i++) {
    const p0 = q[Math.max(0, i - 1)], p1 = q[i], p2 = q[i + 1], p3 = q[Math.min(q.length - 1, i + 2)];
    const c1: V = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6], c2: V = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    for (let j = 1; j <= 30; j++) {
      const u = j / 30, v = 1 - u;
      pts.push([v ** 3 * p1[0] + 3 * v * v * u * c1[0] + 3 * v * u * u * c2[0] + u ** 3 * p2[0], v ** 3 * p1[1] + 3 * v * v * u * c1[1] + 3 * v * u * u * c2[1] + u ** 3 * p2[1]]);
    }
  }
  const acc = [0];
  for (let i = 1; i < pts.length; i++) acc.push(acc[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const L = acc[acc.length - 1];
  return u => {
    const d = clamp01(u) * L;
    let i = 1;
    while (i < acc.length - 1 && acc[i] < d) i++;
    return lerpV(pts[i - 1], pts[i], (d - acc[i - 1]) / Math.max(1e-6, acc[i] - acc[i - 1]));
  };
}

/** A traveller along a path: hidden before t0, moving t0 → t0 + d, then either staying (fade = 0) or caught: shrinks and
 *  fades over `fade` s at the end (a CO₂ fixed by Rubisco). Returns [position, opacity, scale]. */
export function travel(t: number, t0: number, d: number, path: (u: number) => V, o: { fade?: number; out?: number } = {}): [V, number, number] {
  if (t < t0) return [path(0), 0, 1];
  const u = (t - t0) / d;
  const at = path(smooth(Math.min(1, u)));
  const appear = t0 <= 0 ? 1 : tw(t, t0, t0 + 0.2);
  if (u <= 1) return [at, appear, 1];
  const after = t - t0 - d;
  if (o.fade) { const e = clamp01(after / o.fade); return [at, 1 - e, 1 - 0.6 * e]; }
  if (o.out) return [at, 1 - clamp01(after / o.out), 1];
  return [at, 1, 1];
}
/** The fix flash: a ring that grows and fades over 0.5 s after time tf. */
export function flash(S: S, k: string, at: V, t: number, tf: number): void {
  const e = (t - tf) / 0.5;
  if (e < 0 || e > 1) { put(S, k, at, 0); return; }
  put(S, k, at, 0.9 * (1 - e), 0.6 + 0.8 * e);
}

/* ---------------------------------------------------------------- readouts (stage px) */

/** A readout panel: a heading, then rows of label + value; values are set per frame (data-k `${k}-v${i}`). */
export function readout(k: string, x: number, y: number, w: number, head: string, rows: Array<{ label: string[]; value: string; cls?: string }>): string {
  let yy = y + 78;
  const body = rows.map((r, i) => {
    const ls = r.label.map((s, j) => tx(x + 24, yy + j * 28, s, 'cca-ro-l', 'start')).join('');
    const v = `<text data-k="${k}-v${i}" class="cca-ro-v ${r.cls ?? ''}" x="${x + 24}" y="${yy + r.label.length * 28 + 30}">${r.value}</text>`;
    yy += r.label.length * 28 + 64;
    return `<g data-k="${k}-r${i}">${ls}${v}</g>`;
  }).join('');
  return `<g data-k="${k}"><rect class="cca-ro" x="${x}" y="${y}" width="${w}" height="${yy - y - 6}" rx="18"/>${tx(x + 24, y + 38, head, 'cca-ro-h', 'start')}${body}</g>`;
}

/* ---------------------------------------------------------------- the four-panel schema (figs/cc-schema.ts) */

export type Part = 'c3' | 'c2' | 'c4' | 'cam';
export const PANEL: Record<Part, Rect> = { c3: [8, 10, 386, 284], c2: [406, 10, 386, 284], c4: [8, 306, 386, 284], cam: [406, 306, 386, 284] };
export interface Org { x: number; y: number; rx: number; ry: number; rot: number }
/** What the slide drawing holds in one panel, read from its markup. */
export interface PanelGeo { cp: Org[]; mt: Org[]; mtOn: Org[]; rects: Record<string, Rect[]>; paths: Record<string, string[]>; co2: V[] }
const NUM = '(-?[\\d.]+)';
export function readPanel(s: string): PanelGeo {
  const orgs = (cls: string): Org[] => [...s.matchAll(new RegExp(`<g transform="translate\\(${NUM} ${NUM}\\) rotate\\(${NUM}\\)"><ellipse class="${cls}" rx="${NUM}" ry="${NUM}"/>`, 'g'))]
    .map(m => ({ x: +m[1], y: +m[2], rot: +m[3], rx: +m[4], ry: +m[5] }));
  const rects: Record<string, Rect[]> = {};
  for (const m of s.matchAll(new RegExp(`<rect class="(fcc-[a-z-]+)" x="${NUM}" y="${NUM}" width="${NUM}" height="${NUM}"`, 'g'))) (rects[m[1]] ??= []).push([+m[2], +m[3], +m[4], +m[5]]);
  const paths: Record<string, string[]> = {};
  for (const m of s.matchAll(/<path class="(fcc-[a-z-]+(?: fcc-[a-z-]+)*)" d="([^"]+)"/g)) (paths[m[1]] ??= []).push(m[2]);
  // CO₂ molecules: the C atom of each
  const co2: V[] = [...s.matchAll(new RegExp(`<circle class="atom atom-C" cx="${NUM}" cy="${NUM}"`, 'g'))].map(m => [+m[1], +m[2]]);
  return { cp: orgs('fcc-cp'), mt: orgs('fcc-mt'), mtOn: orgs('fcc-mt-on'), rects, paths, co2 };
}

/** The slide's schema made animatable: each panel's ground and drawing get handles, so its lighting can change smoothly. The
 *  markup inside is the slide's own (same draw call); only the dimming moves from a class to an inline style. */
export function schemaScene(svg: string, p: string, lit: Part[]): { svg: string; geo: Record<Part, PanelGeo> } {
  let s = strip(svg);
  const geo = {} as Record<Part, PanelGeo>;
  for (const k of ['c3', 'c2', 'c4', 'cam'] as Part[]) {
    const a = s.indexOf(`<g data-p="${k}"`), b = (['c3', 'c2', 'c4', 'cam'] as Part[]).map(j => s.indexOf(`<g data-p="${j}"`)).filter(i => i > a).sort((x, y) => x - y)[0] ?? s.length;
    geo[k] = readPanel(s.slice(a, b));
    const [x, y, w, h] = PANEL[k], on = lit.includes(k);
    const head = new RegExp(`(<g data-p="${k}" class="(?:on|off)">)\\s*<rect class="fcc-(?:lit|off)-bg"[^>]*/>\\s*<g(?: class="fcc-dim")?>`);
    s = s.replace(head, (_all, g0: string) => `${g0}<rect data-k="${p}-bg0-${k}" class="fcc-off-bg" x="${x}" y="${y}" width="${w}" height="${h}" rx="18"${on ? ' display="none"' : ''}/>`
      + `<rect data-k="${p}-bg1-${k}" class="fcc-lit-bg" x="${x}" y="${y}" width="${w}" height="${h}" rx="18"${on ? '' : ' opacity="0" display="none"'}/>`
      + `<g data-k="${p}-in-${k}"${on ? '' : ' style="opacity:0.26;filter:grayscale(1)"'}>`);
  }
  return { svg: s, geo };
}
/** Sets how lit a panel is: 1 = as the slide lights it, 0 = as the slide dims it. */
export function lightPanel(S: S, p: string, k: Part, L: number): void {
  const bg0 = S.q(`${p}-bg0-${k}`), bg1 = S.q(`${p}-bg1-${k}`), inn = S.q(`${p}-in-${k}`);
  if (!inn) return;
  S.set(bg0, 'display', L > 0.996 ? 'none' : 'inline');
  S.op(bg1, L);
  S.set(inn, 'style', L > 0.996 ? '' : `opacity:${(0.26 + 0.74 * L).toFixed(3)};filter:grayscale(${(1 - L).toFixed(3)})`);
}

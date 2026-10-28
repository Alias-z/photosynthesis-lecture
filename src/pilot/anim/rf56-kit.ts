// Shared kit of the rf5 and rf6 animations (slides C5 RuBisCO, C6 Photorespiration): the stage IS the slide's figure,
// schemaSvg() of figs/rf-schema.ts in the slide's look with the slide's lit set, drawn in the slide's figure card, and a
// camera that zooms into one part of it and back out (as anim/b6f8-common.ts and psii7-common.ts do on the chain).
//
// How the slide figure is reused (figs/rf-schema.ts is not modified):
// - schemaSvg(look, lit, { bare: true }) gives the slide's markup; it is wrapped in <g class="rfs rfs-<look>"> so the
//   schema's own CSS (rf-schema.css, scoped under .fig .rfs) applies unchanged.
// - Every part sits in <g data-p="<part>" class="on|off">. A part that should start to light at the end (the next
//   slide's part) gets a lit copy, taken from a second drawing with that part lit and inserted right after the dimmed
//   one (data-lit, hidden until the story fades it in), so it lights exactly as the slide that lights it.
// - The camera scales the whole schema. Labels, pills, tags, RuBP, RuBisCO's body and the atom balls are counter-scaled
//   about their own centres by k = (s/s₀)^−0.7 (s₀ = the whole-figure view), as on slides 7–10b, so they grow from
//   ≈ 20 to ≈ 28 px while the drawing grows 2–6×; at s₀ every transform is the identity, so the whole view is the slide.
import './rf56-kit.css';
import { schemaSvg, type Look, type Part } from '../figs/rf-schema';
import { cutPath, f1, lerpV, smoother, tween, type Tf, type V } from './antenna-common';

export type { Tf, V };

/* ---------------------------------------------------------------- views */

/** The whole schema: the slide's figure card (860 × 642 px around the 800 × 600 figure drawn at 0.97) fills the stage. */
export const B: Tf = { s: 1.07, t: [800 - 1.07 * 400, 370 - 1.07 * 300] };
/** The whole schema moved left, leaving the stage's right ≈ 600 px for a card. */
export const BL: Tf = { s: B.s, t: [B.t[0] - 300, B.t[1]] };
/** A view with figure point f at stage point at, at scale s. */
export const view = (s: number, f: V, at: V = [800, 370]): Tf => ({ s, t: [at[0] - s * f[0], at[1] - s * f[1]] });
/** Text and glyph scale for a camera scale s (never larger than on the slide). */
export const kOf = (s: number): number => Math.min(1, (s / B.s) ** -0.7);
/** The slide's figure card, in figure units (pilot.css .lay-figure .fig, with the paper look's fill and edge). */
export const CARD = { x: -43.3, y: -30.9, w: 886.6, h: 661.9, r: 22.7 };

/** A move of about 1 s: 0 → 1 from t0 over d, eased at both ends. */
export const mv = (t: number, t0: number, d: number): number => smoother((t - t0) / d);
/** 0 → 1 over [t0, t0 + d], linear. */
export const lin = (t: number, t0: number, d: number): number => Math.max(0, Math.min(1, (t - t0) / d));
/** A short pulse: up over 0.15 s from t0, down by t0 + 0.7. */
export const pulse = (t: number, t0: number): number => {
  const a = lin(t, t0, 0.15), b = lin(t, t0 + 0.3, 0.4);
  return a * (1 - b);
};

/** One camera move: starting `at` s into the beat, over `d` s, to view `to`. */
export type Move = [at: number, d: number, to: Tf];
/** The camera of a staging: per beat, its moves; each beat starts where the beat before ended. */
export function camera(start: Tf, moves: Move[][]): (beat: number, t: number) => Tf {
  return (beat, t) => {
    let v = start;
    for (let i = 0; i <= beat && i < moves.length; i++) {
      for (const [at, d, to] of moves[i]) {
        const e = mv(i < beat ? 1e6 : t, at, d);
        if (e > 0) v = e >= 1 ? to : tween(v, to, e);
      }
    }
    return v;
  };
}

/* ---------------------------------------------------------------- the slide figure */

interface Wrap { a: number; b: number; inner: string; part: string; on: boolean }
/** The part wrappers of a schema drawing, in document order (they never nest; their content may hold groups). */
function wraps(s: string): Wrap[] {
  const out: Wrap[] = [], re = /<g data-p="([^"]+)" class="(on|off)"(?: data-opt="1")?>/g, tag = /<g[\s>]|<\/g>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(s))) {
    const i0 = m.index + m[0].length;
    let depth = 1, i = i0, t: RegExpExecArray | null;
    tag.lastIndex = i0;
    while (depth && (t = tag.exec(s))) { depth += t[0] === '</g>' ? -1 : 1; i = tag.lastIndex; }
    out.push({ a: m.index, b: i, inner: s.slice(i0, i - 4), part: m[1], on: m[2] === 'on' });
    re.lastIndex = i;
  }
  return out;
}

/** The slide's schema (look, lit) with a hidden lit copy of each `extra` part, wrapped so rf-schema.css applies. */
export function sceneSvg(id: string, look: Look, lit: Part[], extra: Part[] = []): string {
  const base = schemaSvg(look, lit, { id, bare: true });
  let body = base;
  if (extra.length) {
    const lit2 = schemaSvg(look, [...lit, ...extra], { id, bare: true });
    const wb = wraps(base), wl = wraps(lit2);
    let at = 0;
    body = '';
    wb.forEach((w, i) => {
      body += base.slice(at, w.b);
      const c = wl[i];
      if (!w.on && c && c.part === w.part && (extra as string[]).includes(w.part)) {
        body += `<g data-p="${w.part}" data-lit="1" class="on" style="display:none;opacity:0">${c.inner}</g>`;
      }
      at = w.b;
    });
    body += base.slice(at);
  }
  return `<g data-k="schema" class="rfs rfs-${look}" data-look="${look}">${body}</g>`;
}

/** The slide's figure card and the schema, inside the camera; `over` is drawn on top in figure units. */
export function stageSvg(p: string, schema: string, over: string, cards: string): string {
  return `
    <g class="rf56">
      <g data-k="cam"><g class="fig">
        <defs><filter id="${p}-sl" x="-5%" y="-5%" width="110%" height="112%"><feDropShadow dx="0" dy="8" stdDeviation="9" flood-color="#46321a" flood-opacity=".14"/></filter></defs>
        <rect class="rf-slidecard" x="${CARD.x}" y="${CARD.y}" width="${CARD.w}" height="${CARD.h}" rx="${CARD.r}" filter="url(#${p}-sl)"/>
        ${schema}
        <g class="rfs rfs-over">${over}</g>
      </g></g>
      <g class="fig rfk rf-cards">${cards}</g>
    </g>`;
}

/* ---------------------------------------------------------------- counter-scaled clusters */

interface Cl { el: Element; c: V }
const num = (el: Element, a: string): number => Number(el.getAttribute(a));
/** Everything that keeps its size better than the drawing when the camera zooms: pills with their text, RuBP, RuBisCO's
 *  body, each molecule's atom balls, and every other label about its own anchor. */
function clusters(root: Element): Cl[] {
  const out: Cl[] = [], used = new Set<Element>();
  const add = (el: Element, c: V): void => { out.push({ el, c }); used.add(el); };
  root.querySelectorAll('rect.rfs-node, rect.rfs-tag, rect.rfs-chip, rect.rfs-rub').forEach(r => {
    const x = num(r, 'x'), y = num(r, 'y'), w = num(r, 'width'), h = num(r, 'height'), c: V = [x + w / 2, y + h / 2];
    add(r, c);
    Array.from(r.parentElement?.children ?? []).forEach(e => {
      if (used.has(e)) return;
      if (e.tagName === 'text') {
        const tx = num(e, 'x'), ty = num(e, 'y');
        if (tx >= x - 2 && tx <= x + w + 2 && ty >= y - 2 && ty <= y + h + 12) add(e, c);
      } else if (e.matches('path.rfs-notch')) add(e, c);
    });
  });
  root.querySelectorAll('polygon.rfs-rubp').forEach(pg => {
    const pts = (pg.getAttribute('points') ?? '').trim().split(/\s+/).map(q => q.split(',').map(Number));
    const c: V = [pts.reduce((s, q) => s + q[0], 0) / pts.length, pts.reduce((s, q) => s + q[1], 0) / pts.length];
    add(pg, c);
    Array.from(pg.parentElement?.children ?? []).forEach(e => { if (e.matches('text.rfs-rubpt') && !used.has(e)) add(e, c); });
  });
  // molecules: runs of atom circles (and their letters) in one parent
  const parents = new Set<Element>();
  root.querySelectorAll('circle.rfs-atom').forEach(a => { if (a.parentElement) parents.add(a.parentElement); });
  parents.forEach(par => {
    let run: Element[] = [];
    const flush = (): void => {
      const cs = run.filter(e => e.tagName === 'circle');
      if (cs.length) {
        const c: V = [cs.reduce((s, e) => s + num(e, 'cx'), 0) / cs.length, cs.reduce((s, e) => s + num(e, 'cy'), 0) / cs.length];
        run.forEach(e => add(e, c));
      }
      run = [];
    };
    Array.from(par.children).forEach(e => {
      // a molecule's atoms and letters, and the gas label that follows them
      if (e.matches('circle.rfs-atom, text.rfs-atomt') || (run.length && e.matches('text.rfs-gas'))) run.push(e); else flush();
    });
    flush();
  });
  // labels of two lines (e.g. "2-phosphoglycolate / + PGA"): consecutive texts in one parent, one above the other
  root.querySelectorAll('text').forEach(t => {
    if (used.has(t)) return;
    const nx = t.nextElementSibling;
    if (nx && nx.tagName === 'text' && !used.has(nx) && Math.abs(num(nx, 'x') - num(t, 'x')) < 20 && num(nx, 'y') - num(t, 'y') > 0 && num(nx, 'y') - num(t, 'y') < 32) {
      const c: V = [num(t, 'x'), (num(t, 'y') + num(nx, 'y')) / 2 - 6];
      add(t, c); add(nx, c);
    }
  });
  root.querySelectorAll('text').forEach(t => { if (!used.has(t)) add(t, [num(t, 'x'), num(t, 'y')]); });
  return out;
}

/* ---------------------------------------------------------------- per-frame setters */

export interface Kit {
  q: <E extends Element = SVGElement>(k: string) => E;
  set: (el: Element | null, a: string, v: string) => void;
  /** Opacity by inline style (it beats rf-schema.css), display none below 0.004. */
  op: (el: Element | null, v: number) => void;
  /** A glyph at figure point at, scaled sc, at opacity o. */
  put: (k: string, at: V, sc: number, o: number) => void;
  /** The camera: moves the schema and counter-scales its labels; returns k. */
  cam: (v: Tf) => number;
  /** All wrappers of a part (not its lit copy). */
  parts: (p: string) => SVGGElement[];
  /** The lit copies (made by sceneSvg's extra). */
  litCopies: () => SVGGElement[];
}

export function kit(stage: SVGSVGElement): Kit {
  const cache = new Map<Element, Map<string, string>>();
  const q = <E extends Element = SVGElement>(k: string): E => stage.querySelector(`[data-k="${k}"]`) as E;
  const set = (el: Element | null, a: string, v: string): void => {
    if (!el) return;
    let m = cache.get(el);
    if (!m) { m = new Map(); cache.set(el, m); }
    if (m.get(a) === v) return;
    m.set(a, v);
    if (a === 'text') el.textContent = v;
    else if (a.startsWith('style:')) (el as SVGElement).style.setProperty(a.slice(6), v);
    else el.setAttribute(a, v);
  };
  const op = (el: Element | null, v: number): void => {
    if (!el) return;
    set(el, 'style:display', v < 0.004 ? 'none' : 'inline');
    set(el, 'style:opacity', v >= 0.996 ? '1' : Math.max(0, v).toFixed(3));
  };
  const put = (k: string, at: V, sc: number, o: number): void => {
    const el = q(k);
    op(el, o);
    if (o > 0.004) set(el, 'transform', `translate(${f1(at[0])} ${f1(at[1])}) scale(${sc.toFixed(4)})`);
  };
  const schema = q('schema');
  const cls = clusters(schema);
  const camG = q('cam');
  const cam = (v: Tf): number => {
    set(camG, 'transform', `matrix(${v.s.toFixed(5)},0,0,${v.s.toFixed(5)},${v.t[0].toFixed(2)},${v.t[1].toFixed(2)})`);
    const k = kOf(v.s), ks = k.toFixed(4);
    cls.forEach(({ el, c }) => set(el, 'transform', k > 0.9995 ? '' : `matrix(${ks},0,0,${ks},${(c[0] * (1 - k)).toFixed(2)},${(c[1] * (1 - k)).toFixed(2)})`));
    return k;
  };
  const parts = (p: string): SVGGElement[] => Array.from(schema.querySelectorAll<SVGGElement>(`[data-p="${p}"]:not([data-lit])`));
  const litCopies = (): SVGGElement[] => Array.from(schema.querySelectorAll<SVGGElement>('[data-lit]'));
  return { q, set, op, put, cam, parts, litCopies };
}

/* ---------------------------------------------------------------- paths */

/** A point on the quadratic Bézier a → c → b. */
export const bez = (a: V, c: V, b: V, u: number): V => {
  const v = 1 - u;
  return [v * v * a[0] + 2 * v * u * c[0] + u * u * b[0], v * v * a[1] + 2 * v * u * c[1] + u * u * b[1]];
};
/** A smooth path through points (Catmull-Rom, as rf-schema.ts draws its arrows), walked at even speed: u ∈ [0, 1]. */
export function walker(q: V[]): (u: number) => V {
  const pts: V[] = [q[0]];
  for (let i = 0; i < q.length - 1; i++) {
    const p0 = q[Math.max(0, i - 1)], p1 = q[i], p2 = q[i + 1], p3 = q[Math.min(q.length - 1, i + 2)];
    const c1: V = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6], c2: V = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    for (let j = 1; j <= 40; j++) {
      const u = j / 40, v = 1 - u;
      pts.push([v ** 3 * p1[0] + 3 * v * v * u * c1[0] + 3 * v * u * u * c2[0] + u ** 3 * p2[0], v ** 3 * p1[1] + 3 * v * v * u * c1[1] + 3 * v * u * u * c2[1] + u ** 3 * p2[1]]);
    }
  }
  const acc = [0];
  for (let i = 1; i < pts.length; i++) acc.push(acc[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const L = acc[acc.length - 1];
  return u => {
    const d = Math.max(0, Math.min(1, u)) * L;
    let i = 1;
    while (i < acc.length - 1 && acc[i] < d) i++;
    const e = (d - acc[i - 1]) / Math.max(1e-6, acc[i] - acc[i - 1]);
    return lerpV(pts[i - 1], pts[i], e);
  };
}

/* ---------------------------------------------------------------- glyphs and cards */

export const glyph = (k: string, inner: string, cls = ''): string => `<g data-k="${k}"${cls ? ` class="${cls}"` : ''} style="display:none">${inner}</g>`;
export const T = (x: number, y: number, s: string, cls: string, a: 'start' | 'middle' | 'end' = 'start'): string =>
  `<text class="${cls}" x="${f1(x)}" y="${f1(y)}" text-anchor="${a}">${s}</text>`;
/** A molecule as atom balls, round its origin (the schema's look: r 12.5, O yellow, C red). */
export function atoms(s: string, angle = 0, r = 12.5): string {
  const step = 2 * r * 0.92, a = (angle * Math.PI) / 180;
  let out = '';
  for (let i = 0; i < s.length; i++) {
    const o = (i - (s.length - 1) / 2) * step, x = Math.cos(a) * o, y = Math.sin(a) * o, el = s[i];
    out += `<circle class="rfs-atom rfs-atom-${el}" cx="${f1(x)}" cy="${f1(y)}" r="${r}"/><text class="rfs-atomt rfs-atomt-${el}" x="${f1(x)}" y="${f1(y + 5.5)}" text-anchor="middle">${el}</text>`;
  }
  return out;
}
/** A small named chip round its origin (a product on its way). */
export function chip(s: string, k = ''): string {
  const w = s.replace(/<[^>]+>/g, '').length * 9.6 + 22;
  return `<rect class="rf-chip ${k}" x="${f1(-w / 2)}" y="-15" width="${f1(w)}" height="30" rx="15"/><text class="rf-chipt" x="0" y="6" text-anchor="middle">${s}</text>`;
}
/** RuBP as the schema's pentagon, round its origin, radius R. */
export function pentagon(R: number, label = 'RuBP'): string {
  const pts = Array.from({ length: 5 }, (_, i) => {
    const a = (-90 + i * 72) * Math.PI / 180;
    return `${f1(R * Math.cos(a))},${f1(R * Math.sin(a) + R * 0.1)}`;
  }).join(' ');
  return `<polygon class="rfs-rubp" points="${pts}"/><text class="rfs-rubpt" x="0" y="${f1(R * 0.3)}" text-anchor="middle" style="font-size:${f1(R * 0.53)}px">${label}</text>`;
}
/** A cut-paper card on the stage (top-left x, y), tilted by rot, its inner markup in stage units. */
export function paper(p: string, k: string, x: number, y: number, w: number, h: number, inner: string, rot = -1, seed = 37): string {
  return `<g data-k="${k}" style="display:none"><g transform="rotate(${rot} ${x + w / 2} ${y + h / 2})">
    <defs><filter id="${p}-${k}-sh" x="-10%" y="-6%" width="120%" height="114%"><feDropShadow dx="1" dy="4" stdDeviation="6" flood-color="#3d3020" flood-opacity=".22"/></filter></defs>
    <path class="rf-paper" d="${cutPath(x, y, w, h, seed, 3.2)}" filter="url(#${p}-${k}-sh)"/>${inner}</g></g>`;
}
/** A plain panel on the stage (readouts). */
export function panel(k: string, x: number, y: number, w: number, h: number, inner: string): string {
  return `<g data-k="${k}" style="display:none"><rect class="rf-panel" x="${x}" y="${y}" width="${w}" height="${h}" rx="16"/>${inner}</g>`;
}

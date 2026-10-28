// The leaf-section animations of slides C10–C13 (keys lf10, lf11, lf11a, lf12, lf13; brief research/redo-2026-10-28/
// CO2_COPING_BRIEF.md): what their stagings share, after dk1-common.ts.
// - The world is the leaf section of figs/leaf-schema.ts (panorama units), drawn twice: every part dimmed (names of
//   dimmed parts left out), and every part lit, of which only the part wrappers are kept, laid over the dimmed copy at
//   opacity 0. A beat lights a part by fading its lit wrapper in, so proteins cross-fade from grey to colour and a
//   mechanism's arrows appear only when lit. The static molecules are left out (noMol): every molecule is an actor.
// - One fixed framing (cam); at most one slow pan, eased (pan).
// - Actors are the deck's glyphs (carbon form, atom balls, HCO₃⁻ ball group, ATP and AMP tags, Pᵢ, H⁺ ring), placed per
//   frame as a pure function of (beat, t). A ledger panel and cards sit above the world in stage units.
import './dk1-common.css';
import './lf-anim.css';
import { leafSvg, type LeafOpts, type LPart } from '../figs/leaf-schema';
import type { Beat, Staging } from './types';

export type V = [number, number];
export type { LPart };
const f = (v: number): string => (Math.round(v * 100) / 100).toString();
export const clamp = (x: number): number => (x < 0 ? 0 : x > 1 ? 1 : x);
export const ease = (t: number, t0: number, t1: number): number => { const u = clamp((t - t0) / (t1 - t0)); return u * u * (3 - 2 * u); };
export const ease2 = (t: number, t0: number, t1: number): number => { const u = clamp((t - t0) / (t1 - t0)); return u * u * u * (u * (u * 6 - 15) + 10); };
export const life = (t: number, a0: number, a1: number, b0: number, b1: number): number => ease(t, a0, a1) * (1 - ease(t, b0, b1));
export const lerp = (a: number, b: number, u: number): number => a + (b - a) * u;
export const lerpV = (a: V, b: V, u: number): V => [lerp(a[0], b[0], u), lerp(a[1], b[1], u)];
export const add = (a: V, b: V): V => [a[0] + b[0], a[1] + b[1]];

/** A gently curved path through points (Catmull–Rom, sampled; u is the arc-length fraction). */
export function curve(q: V[]): (u: number) => V {
  const pts: V[] = [];
  for (let i = 0; i < q.length - 1; i++) {
    const p0 = q[Math.max(0, i - 1)], p1 = q[i], p2 = q[i + 1], p3 = q[Math.min(q.length - 1, i + 2)];
    for (let j = 0; j < 24; j++) {
      const s = j / 24, s2 = s * s, s3 = s2 * s;
      const c = (a: number, b: number, cc: number, d: number): number => 0.5 * (2 * b + (-a + cc) * s + (2 * a - 5 * b + 4 * cc - d) * s2 + (-a + 3 * b - 3 * cc + d) * s3);
      pts.push([c(p0[0], p1[0], p2[0], p3[0]), c(p0[1], p1[1], p2[1], p3[1])]);
    }
  }
  pts.push(q[q.length - 1]);
  const acc = [0];
  for (let i = 1; i < pts.length; i++) acc.push(acc[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const tot = acc[acc.length - 1] || 1;
  return (u: number): V => {
    const d = clamp(u) * tot;
    let lo = 0, hi = acc.length - 1;
    while (hi - lo > 1) { const m = (lo + hi) >> 1; if (acc[m] < d) lo = m; else hi = m; }
    const L = acc[hi] - acc[lo];
    return lerpV(pts[lo], pts[hi], L ? (d - acc[lo]) / L : 0);
  };
}
const memo = new Map<string, (u: number) => V>();
/** curve(), memoized by its points. */
export function path(q: V[]): (u: number) => V {
  const key = q.map(p => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
  let c = memo.get(key);
  if (!c) { c = curve(q); memo.set(key, c); }
  return c;
}
/** Position on a path, glided (smoother step) between t0 and t1. */
export const glide = (q: V[], t: number, t0: number, t1: number): V => path(q)(ease2(t, t0, t1));

/** A camera: panorama point c shown at stage point at, scale s. */
export interface Cam { s: number; c: V; at: V }
const lerpCam = (a: Cam, b: Cam, u: number): Cam => ({ s: Math.exp(lerp(Math.log(a.s), Math.log(b.s), u)), c: lerpV(a.c, b.c, u), at: lerpV(a.at, b.at, u) });

/** A moving molecule: its glyph at the origin, an optional label under (dy > 0) or over it. */
export interface Actor { k: string; g: string; lab?: string; dy?: number; dx?: number; an?: 'start' | 'middle' | 'end'; cls?: string }
export interface Api {
  put(k: string, at: V, o?: number, sc?: number): void;
  lab(k: string, s: string): void;
  op(k: string, o: number): void;
  txt(k: string, s: string): void;
  html(k: string, s: string): void;
  lit(p: LPart, v: number): void;
  attr(k: string, a: string, v: string): void;
}
export interface Opt {
  id: string; name: string; note: string; beats?: Beat[]; holds?: number[][];
  /** Options of the drawn leaf (hide, gap, noGuard, acid, starch). */
  leaf?: LeafOpts;
  actors: Actor[];
  /** Extra world markup (under the actors), panorama units. */
  world?: (p: string) => string;
  /** Markup over the world, stage units. */
  hud?: (p: string) => string;
  cam: Cam;
  /** Clip of the world on the stage [x, y, w, h] (stage units), so that the panels on the right sit on paper. */
  clip?: [number, number, number, number];
  /** The one pan: in beat `beat`, from t0 to t1, to camera `to`. */
  pan?: { beat: number; t0: number; t1: number; to: Cam };
  /** Lit parts at the end of each beat (cross-faded over litT of the beat; beat 0 from all dimmed). */
  lit: LPart[][]; litT?: [number, number];
  frame(a: Api, beat: number, t: number): void;
}

/** Every part, lit, for the lit copy. */
const ALL: LPart[] = ['air', 'bl', 'stoma', 'as', 'mwall', 'co2-path', 'h2o', 'gb', 'gs', 'gm', 'm-cp', 'm-rub', 'starch', 'ppdk', 'ca', 'pepc',
  'm-perox', 'm-mito', 'vac', 'co2-in', 'o2', 'pr-m', 'pr-gly', 'refix', 'escape', 'gly', 'ser', 'bs-mito', 'bs-co2', 'bs-rub', 'bs-cp', 'c4-co2', 'hco3',
  'pep', 'c4acid', 'me', 'me-co2', 'pyr', 'atp', 'cam-n', 'cam-acid', 'cam-d', 'cam-me', 'pep-starch'];

function leafSvgs(p: string, o: LeafOpts, used: Set<LPart>): { dim: string; lit: string } {
  const base: LeafOpts = { ...o, bare: true, unit: 'none', noMol: true };
  const dim = leafSvg(`${p}d`, [], base), litAll = leafSvg(`${p}l`, ALL.filter(q => used.has(q)), base);
  const out: string[] = [], re = /<g data-p="([^"]+)" class="chn-on([^"]*)">/g, tag = /<g[\s>]|<\/g>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(litAll))) {
    const i0 = m.index + m[0].length;
    let depth = 1, i = i0, tt: RegExpExecArray | null;
    tag.lastIndex = i0;
    while (depth && (tt = tag.exec(litAll))) { depth += tt[0] === '</g>' ? -1 : 1; i = tag.lastIndex; }
    out.push(`<g data-p="${m[1]}" data-lit="1" opacity="0" class="chn-on${m[2]}">${litAll.slice(i0, i)}`);
    re.lastIndex = i;
  }
  return { dim, lit: out.join('') };
}
const actorSvg = (a: Actor): string =>
  `<g data-k="${a.k}" data-actor="1" display="none">${a.g}${a.lab !== undefined ? `<text data-k="${a.k}-l" class="${a.cls ?? 'cel-mn cel-halo'}" x="${a.dx ?? 0}" y="${a.dy ?? 30}" text-anchor="${a.an ?? 'middle'}">${a.lab}</text>` : ''}</g>`;

export function makeLeafStaging(o: Opt): Staging {
  const p = `lfa${o.id}`;
  const used = new Set<LPart>(o.lit.flat());
  return {
    id: o.id, name: o.name, note: o.note, ...(o.beats ? { beats: o.beats } : {}), ...(o.holds ? { holds: o.holds } : {}),
    svg: () => {
      const { dim, lit } = leafSvgs(p, o.leaf ?? {}, used);
      return `<defs><radialGradient id="${p}-flash"><stop offset="0" stop-color="#fff4d6"/><stop offset=".45" stop-color="#f6c453" stop-opacity=".8"/><stop offset="1" stop-color="#f0a316" stop-opacity="0"/></radialGradient>
        <radialGradient id="${p}-pool"><stop offset="0" class="dk-pool0"/><stop offset=".55" class="dk-pool1"/><stop offset="1" class="dk-pool2"/></radialGradient></defs>
        <g class="dk1 lfa fig">${o.clip ? `<clipPath id="${p}-clip"><rect x="${o.clip[0]}" y="${o.clip[1]}" width="${o.clip[2]}" height="${o.clip[3]}" rx="18"/></clipPath>` : ''}
        <g${o.clip ? ` clip-path="url(#${p}-clip)"` : ''}><g data-k="cam"><g class="dk-dim">${dim}</g><g class="dk-lit">${lit}</g>${o.world ? o.world(p) : ''}
          <g data-k="fl" data-actor="1" display="none"><circle r="30" fill="url(#${p}-flash)"/></g>
          <g data-k="fl2" data-actor="1" display="none"><circle r="30" fill="url(#${p}-flash)"/></g>${o.actors.map(actorSvg).join('')}</g></g>
        ${o.hud ? o.hud(p) : ''}</g>`;
    },
    bind(stage) {
      const cache = new Map<Element, Map<string, string>>();
      const set = (el: Element | null, a: string, v: string): void => {
        if (!el) return;
        let m = cache.get(el);
        if (!m) { m = new Map(); cache.set(el, m); }
        if (m.get(a) === v) return;
        m.set(a, v);
        if (a === 'text') el.textContent = v; else if (a === 'html') el.innerHTML = v; else el.setAttribute(a, v);
      };
      const els = new Map<string, Element>();
      stage.querySelectorAll('[data-k]').forEach(el => els.set(el.getAttribute('data-k') as string, el));
      const q = (k: string): Element | null => els.get(k) ?? null;
      const opEl = (el: Element | null, v: number): void => { set(el, 'display', v < 0.004 ? 'none' : 'inline'); set(el, 'opacity', v >= 0.996 ? '1' : v.toFixed(3)); };
      const cam = q('cam');
      const litEls = new Map<string, Element[]>();
      stage.querySelectorAll('[data-lit]').forEach(el => { const k = el.getAttribute('data-p') as string; litEls.set(k, [...(litEls.get(k) ?? []), el]); });
      const actors = [...stage.querySelectorAll('[data-actor]')].map(el => el.getAttribute('data-k') as string);
      const placed = new Set<string>(), litOver = new Map<string, number>();
      const api: Api = {
        put(k, at, op = 1, sc = 1) { const el = q(k); placed.add(k); opEl(el, op); if (op >= 0.004) set(el, 'transform', `translate(${f(at[0])} ${f(at[1])})${sc !== 1 ? ` scale(${sc.toFixed(3)})` : ''}`); },
        lab(k, s) { set(q(`${k}-l`), 'text', s); },
        op(k, v) { opEl(q(k), v); },
        txt(k, s) { set(q(k), 'text', s); },
        html(k, s) { set(q(k), 'html', s); },
        lit(part, v) { litOver.set(part, v); },
        attr(k, a, v) { set(q(k), a, v); },
      };
      const litT = o.litT ?? [0.1, 0.9];
      return (beat, t) => {
        let c = o.cam;
        if (o.pan) c = beat < o.pan.beat ? o.cam : beat > o.pan.beat ? o.pan.to : lerpCam(o.cam, o.pan.to, ease2(t, o.pan.t0, o.pan.t1));
        set(cam, 'transform', `translate(${f(c.at[0] - c.c[0] * c.s)} ${f(c.at[1] - c.c[1] * c.s)}) scale(${c.s.toFixed(4)})`);
        placed.clear(); litOver.clear();
        o.frame(api, beat, t);
        for (const k of actors) if (!placed.has(k)) opEl(q(k), 0);
        const cur = new Set(o.lit[beat] ?? []), prev = new Set(beat === 0 ? [] : o.lit[beat - 1] ?? []), u = ease(t, litT[0], litT[1]);
        for (const [part, list] of litEls) {
          const v = litOver.has(part) ? (litOver.get(part) as number) : lerp(prev.has(part as LPart) ? 1 : 0, cur.has(part as LPart) ? 1 : 0, u);
          for (const el of list) set(el, 'opacity', v >= 0.996 ? '1' : v.toFixed(3));
        }
      };
    },
  };
}

/* ---------------------------------------------------------------- the ledger panel (stage units) */

export interface Row { k: string; h: number; html: string; cls?: string }
/** A panel fixed on the stage: rows stacked from the top; it grows as rows appear. */
export function panelSvg(k: string, x: number, y: number, w: number, rows: Row[]): string {
  let yy = y + 14;
  const rs = rows.map(r => { const s = `<g data-k="${r.k}" display="none"><text class="${r.cls ?? 'dk-pr'}" x="${x + 20}" y="${f(yy + r.h - 10)}">${r.html}</text></g>`; yy += r.h; return s; }).join('');
  return `<g data-k="${k}" display="none"><rect data-k="${k}-bg" class="dk-panel" x="${x}" y="${y}" width="${w}" height="40" rx="14"/>${rs}</g>`;
}
export function panelShow(a: Api, k: string, rows: Row[], vis: Record<string, number>): void {
  let h = 14, any = 0;
  for (const r of rows) { const v = vis[r.k] ?? 0; a.op(r.k, v); h += r.h * clamp(v * 1.6); any = Math.max(any, v); }
  a.op(k, clamp(any * 2));
  a.attr(`${k}-bg`, 'height', f(h + 12));
}
/** A flash where a reaction happens (actor 'fl' or 'fl2'). */
export const flash = (a: Api, t: number, tf: number, at: V, k = 'fl'): void => { if (t > tf - 0.15 && t < tf + 0.5) a.put(k, at, life(t, tf - 0.15, tf, tf + 0.1, tf + 0.5)); };
export const T = (x: number, y: number, s: string, cls: string, an = 'middle'): string => `<text class="${cls}" x="${f(x)}" y="${f(y)}" text-anchor="${an}">${s}</text>`;

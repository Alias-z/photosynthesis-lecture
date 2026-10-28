// The dark-reaction animations of builder 1 (cb2, rf5, cb1, cb3) re-staged in the real-protein strip (lecturer, 28 Oct
// 2026; brief research/redo-2026-10-28/DARK_ANIM_BRIEF.md): what their stagings share.
// - The world is the dark-reaction strip of figs/cell-schema.ts (arrangement 'strip', strip units, unchanged), drawn
//   twice: once with every part dimmed (labels of dimmed parts hidden: only lit parts are named), and once with every
//   part lit, of which only the part wrappers are kept, laid over the dimmed copy. A staging lights a part by fading in
//   its lit wrappers, so the proteins cross-fade from their grey to their coloured render.
// - Static molecules a staging moves itself are left out of both copies (`drop`: exact markup of cell-schema.ts's
//   glyphs and names, rebuilt here with the same functions; a missing piece is reported in the console).
// - The camera (one move per beat) scales the world; the strip's names and glyphs, and the moving molecules, are
//   counter-scaled about their anchors by s^−0.7, as in the electron-transport animations, so letters stay readable
//   while proteins grow.
// - The moving molecules are the deck's glyphs: carbon form (figs/carbon-form.ts), CO₂ and O₂ atom balls, ATP, NADPH,
//   ADP, Pᵢ and NADP⁺ tags (figs/chain.ts). A staging places them per frame as a pure function of (beat, t).
// - A panel fixed on the screen (the tally) and paper cards (insets of papers) sit above the world.
import './dk1-common.css';
import * as CS from '../figs/cell-schema';
import { balls, cellSvg, LIT_ALL, type Part } from '../figs/cell-schema';
import { row, rowWidth } from '../figs/carbon-form';
import { rowG, tagG } from '../figs/chain';
import { cutPath } from './antenna-common';
import type { Beat, Staging } from './types';

export type V = [number, number];
export type { Part };

/* ---------------------------------------------------------------- numbers and motion */

const f = (v: number): string => (Math.round(v * 100) / 100).toString();
export const clamp = (x: number): number => (x < 0 ? 0 : x > 1 ? 1 : x);
/** Smooth step of t between t0 and t1. */
export const ease = (t: number, t0: number, t1: number): number => { const u = clamp((t - t0) / (t1 - t0)); return u * u * (3 - 2 * u); };
/** Smoother step (zero first and second derivative at both ends), for glides. */
export const ease2 = (t: number, t0: number, t1: number): number => { const u = clamp((t - t0) / (t1 - t0)); return u * u * u * (u * (u * 6 - 15) + 10); };
/** Up between a0 and a1, down between b0 and b1. */
export const life = (t: number, a0: number, a1: number, b0: number, b1: number): number => ease(t, a0, a1) * (1 - ease(t, b0, b1));
export const lerp = (a: number, b: number, u: number): number => a + (b - a) * u;
export const lerpV = (a: V, b: V, u: number): V => [lerp(a[0], b[0], u), lerp(a[1], b[1], u)];
export const add = (a: V, b: V): V => [a[0] + b[0], a[1] + b[1]];

/** A gently curved path through points (Catmull–Rom, sampled; u is arc-length fraction). */
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
/** Position on a curve, glided (smoother step) between t0 and t1. */
export const glide = (c: (u: number) => V, t: number, t0: number, t1: number): V => c(ease2(t, t0, t1));

/* ---------------------------------------------------------------- the strip's geometry (cell-schema.ts, strip units) */

/** The one adapter to the strip's layout (strip units), as cell-schema.ts's stripPano draws it. When cell-schema.ts
 *  exports SPOT (announced: rub, co2, o2, rubp, pga, pg2, tp, carboxFrom, carboxTo, oxyFrom, oxyTo, …), its values
 *  override these, so a re-synced strip moves the animations with it. */
const G0 = {
  rub: [312, 430] as V, gap: [232, 200] as V, prk: [504, 236] as V, pga: [162, 338] as V, tp: [352, 98] as V,
  rubp: [470, 330] as V, co2: [306, 330] as V, o2: [206, 524] as V, pg2: [520, 476] as V, starch: [560, 18] as V,
  glyk: [680, 300] as V, nadphTag: [94, 64] as V, atpTag: [70, 100] as V, back: [70, 30] as V, regenAtp: [600, 226] as V,
  glykAtp: [676, 344] as V,
  tpt: [760, 112] as V, sucrose: [938, 45] as V,
  oxyPga: [430, 232] as V, oxyPgaFrom: [392, 300] as V, oxyPgaTo: [430, 248] as V, prkFrom: [476, 476] as V, prkTo: [424, 476] as V,
  co2From: [280, 348] as V, co2To: [292, 376] as V, o2From: [424, 434] as V, o2To: [382, 440] as V,
  rubpFrom: [404, 344] as V, rubpTo: [374, 380] as V,
  carboxFrom: [246, 410] as V, carboxTo: [214, 346] as V, oxyFrom: [376, 460] as V, oxyTo: [480, 478] as V,
};
type GeoKey = keyof typeof G0;
const SPOT = (CS as unknown as { SPOT?: Partial<Record<GeoKey | 'gapdh', V>> }).SPOT ?? {};
export const G: Record<GeoKey, V> = { ...G0, ...SPOT, gap: SPOT.gapdh ?? G0.gap };
export const SX = CS.SX;
/** RuBisCO's render (rubisco-8ruc.png, 548 × 471 px at 4 px per Å) as the strip draws it, and its 8 active sites
 *  (assets/rf/rubisco-8ruc.json: image pixels and depth; z > 0 faces the viewer). */
const RUB_K = 0.95 / 4;
export const RUB = { w: 548 * RUB_K, h: 471 * RUB_K };
const SITE_PX: V[] = [[317.6, 309.5], [342.7, 161.3], [139.8, 161.4], [129.6, 309.7], [418.4, 309.3], [407.9, 161.5], [204.8, 161.5], [230.2, 309.7]];
const SITE_Z = [36.1, 33.6, 17.2, 10.9, -10.8, -17.3, -33.6, -36.1];
export const SITES = SITE_PX.map((p, i) => ({ p: [G.rub[0] - RUB.w / 2 + p[0] * RUB_K, G.rub[1] - RUB.h / 2 + p[1] * RUB_K] as V, front: SITE_Z[i] > 0 }));
/** The strip's carboxylation and oxygenation arrows (their ends, as cell-schema.ts draws them). */
export const ARROW = { carbox: [G.carboxFrom, G.carboxTo] as [V, V], oxy: [G.oxyFrom, G.oxyTo] as [V, V] };

/* ---------------------------------------------------------------- static pieces of the strip, rebuilt to leave out */

const Tx = (x: number, y: number, s: string, cls: string, a = 'middle'): string => `<text class="${cls}" x="${f(x)}" y="${f(y)}" text-anchor="${a}">${s}</text>`;
const gl = (svg: string): string => `<g class="chn-g">${svg}</g>`;
const NM = 'cel-mn cel-halo';
const molAt = (at: V, formula: string): string => gl(row(at[0], at[1], formula, { r: 11 }));
/** Exact markup of the strip's static molecules and tags (cell-schema.ts stripPano, unit 'none'; names placed as its mol()). */
export const DROP = {
  pga: molAt(G.pga, 'CCCP'), pgaName: Tx(G.pga[0], G.pga[1] + 32, '3-PGA', NM),
  tp: molAt(G.tp, 'CCCP'), tpName: Tx(G.tp[0], G.tp[1] - 21, 'triose phosphate', NM),
  rubp: molAt(G.rubp, 'PCCCCCP'), rubpName: Tx(G.rubp[0], G.rubp[1] + 32, 'RuBP', NM),
  co2: balls(G.co2[0], G.co2[1], 'OCO'), co2Name: Tx(G.co2[0], G.co2[1] - 22, 'CO₂', NM),
  o2: balls(G.o2[0], G.o2[1], 'OO'),
  pg2: molAt(G.pg2, 'CCP'), pg2Name: Tx(G.pg2[0] - 8, G.pg2[1] - 21, '2-phosphoglycolate', NM),
  nadph: gl(tagG(G.nadphTag[0], G.nadphTag[1], 'NADPH', 'nadph')), atp: gl(tagG(G.atpTag[0], G.atpTag[1], 'ATP', 'atp')),
  back: rowG(G.back[0], G.back[1], [['NADP⁺', 'plain'], ['ADP', 'atp'], ['', 'pi']]),
  regenAtp: gl(tagG(G.regenAtp[0], G.regenAtp[1], 'ATP', 'atp')),
  glykAtp: gl(tagG(G.glykAtp[0], G.glykAtp[1], 'ATP', 'atp')),
};

/* ---------------------------------------------------------------- glyphs of the moving molecules (drawn at the origin) */

export const R = 11;
/** A pale capsule under a moving molecule, so that it reads on a protein's coloured surface too. */
const cap = (w: number, r: number): string => `<rect class="dk-cap" x="${f(-w / 2 - 5)}" y="${f(-r - 5)}" width="${f(w + 10)}" height="${f(2 * r + 10)}" rx="${f(r + 5)}"/>`;
export const GLYPH = {
  co2: (): string => cap(5.4 * R, R) + balls(0, 0, 'OCO'),
  o2: (): string => cap(3.7 * R, R) + balls(0, 0, 'OO'),
  c14: (): string => `<circle class="dk-c14g" r="17"/>${gl(row(0, 0, 'C', { r: R }))}`,
  carbon: (formula: string, halos?: string, r = R): string => cap(rowWidth(formula.length, r), r) + gl(row(0, 0, formula, { r, halos })),
  atp: (): string => gl(tagG(0, 0, 'ATP', 'atp')),
  nadph: (): string => gl(tagG(0, 0, 'NADPH', 'nadph')),
  adp: (): string => gl(tagG(0, 0, 'ADP', 'atp')),
  nadp: (): string => gl(tagG(0, 0, 'NADP⁺', 'plain')),
  pi: (): string => gl(tagG(0, 0, '', 'pi')),
};

/* ---------------------------------------------------------------- the staging */

/** A camera: world point c is shown at stage point at (default the stage centre) at scale s. */
export interface Cam { s: number; c: V; at?: V }
export const view = (s: number, c: V, at: V = [800, 370]): Cam => ({ s, c, at });
const lerpCam = (a: Cam, b: Cam, u: number): Cam => {
  const A = a.at ?? [800, 370], B = b.at ?? [800, 370];
  return { s: Math.exp(lerp(Math.log(a.s), Math.log(b.s), u)), c: lerpV(a.c, b.c, u), at: lerpV(A, B, u) };
};
/** Counter-scale of names and glyphs at camera scale s. */
export const kOf = (s: number): number => Math.min(1, s ** -0.7);

/** A moving molecule: its glyph at the origin, an optional label under (dy > 0) or over it. */
export interface Actor { k: string; g: string; lab?: string; dy?: number; cls?: string; /** label x offset and anchor */ dx?: number; anchor?: 'start' | 'middle' | 'end' }
/** A name with a leader line from a world point; d is the text's offset in label units (counter-scaled). */
export interface Lead { k: string; at: V; d: V; text: string; a?: 'start' | 'middle' | 'end'; /** the line's start, offset from at */ o?: V }

export interface Api {
  /** current camera scale and counter-scale */
  s: number; k: number;
  /** Shows actor k at world point at (actor 'fl' is a flash, always there) (opacity o, extra scale sc); unplaced actors are hidden. */
  put(k: string, at: V, o?: number, sc?: number): void;
  /** Sets an actor's label. */
  lab(k: string, s: string): void;
  /** Opacity of any element data-k="k" (display none below 0.004). */
  op(k: string, o: number): void;
  /** Text (textContent) of a data-k element. */
  txt(k: string, s: string): void;
  /** Places a world item data-k="k" (drawn at the origin) at world point at, counter-scaled. */
  pos(k: string, at: V, sc?: number): void;
  /** Sets the lighting of a part (overrides the beat's set). */
  lit(p: Part, v: number): void;
  /** Sets any attribute of a data-k element. */
  attr(k: string, a: string, v: string): void;
}

export interface Opt {
  id: string; name: string; note: string; beats?: Beat[]; holds?: number[][];
  /** Static strip pieces to leave out (DROP values: exact markup). */
  drop?: string[];
  /** Parts whose molecule glyphs (node wrappers), and whose molecule names (cel-mn text wrappers), are left out. */
  dropGlyph?: Part[]; dropName?: Part[];
  /** Parts whose arrows (flow wrappers) are left out. */
  dropFlow?: Part[];
  actors: Actor[];
  leads?: Lead[];
  /** Extra world markup (under the actors): items with data-k, placed by pos(). */
  world?: (p: string) => string;
  /** Extra markup over the world, in stage units. */
  hud?: (p: string) => string;
  /** The camera at the start of beat 0, then at the end of each beat; each beat moves over camT[b]. */
  cam0: Cam; cams: Cam[]; camT: Array<[number, number]>;
  /** Lit parts at the end of each beat (they cross-fade over litT of the beat; beat 0 from all dimmed). */
  lit: Part[][]; litT?: [number, number];
  frame(a: Api, beat: number, t: number): void;
}

const DIM_ID = 'dkd', LIT_ID = 'dkl';
/** The strip drawn dimmed and lit; of the lit copy only the part wrappers, each with data-lit and opacity 0. */
/** Leaves out the part wrappers that hold a part's molecule glyph or its molecule name (cell-schema.ts's mol(), balls()). */
function dropParts(svg: string, glyph: Set<string>, name: Set<string>, flow: Set<string> = new Set()): string {
  if (!glyph.size && !name.size && !flow.size) return svg;
  const re = /<g data-p="([^"]+)" class="chn-(?:on|off)[^"]*">/g, tag = /<g[\s>]|<\/g>/g, cut: Array<[number, number]> = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(svg))) {
    const i0 = m.index + m[0].length;
    let depth = 1, i = i0, tt: RegExpExecArray | null;
    tag.lastIndex = i0;
    while (depth && (tt = tag.exec(svg))) { depth += tt[0] === '</g>' ? -1 : 1; i = tag.lastIndex; }
    const inner = svg.slice(i0, i - 4);
    const isGlyph = inner.startsWith('<g class="chn-g">'), isName = inner.startsWith('<text') && inner.includes('cel-mn') && !inner.includes('cel-prot');
    const isFlow = /^<path class="cbb-(a |halo-l)/.test(inner);
    if ((glyph.has(m[1]) && isGlyph) || (name.has(m[1]) && isName) || (flow.has(m[1]) && isFlow)) cut.push([m.index, i]);
    re.lastIndex = i;
  }
  let out = '', at = 0;
  for (const [a0, a1] of cut) { out += svg.slice(at, a0); at = a1; }
  return out + svg.slice(at);
}
function stripSvgs(p: string, drop: string[], glyph: Part[] = [], name: Part[] = [], flow: Part[] = []): { dim: string; lit: string } {
  const o = { bare: true, unit: 'none' } as const, G1 = new Set<string>(glyph), N1 = new Set<string>(name), F1 = new Set<string>(flow);
  let dim = dropParts(cellSvg(`${p}${DIM_ID}`, 'strip', [], o), G1, N1, F1), lit = dropParts(cellSvg(`${p}${LIT_ID}`, 'strip', LIT_ALL, o), G1, N1, F1);
  for (const s of drop) {
    if (!dim.includes(s) || !lit.includes(s)) console.warn('dk1: a static piece to drop is not in the strip', s.slice(0, 120));
    dim = dim.split(s).join('');
    lit = lit.split(s).join('');
  }
  const out: string[] = [], re = /<g data-p="([^"]+)" class="chn-on([^"]*)">/g, tag = /<g[\s>]|<\/g>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(lit))) {
    const i0 = m.index + m[0].length;
    let depth = 1, i = i0, tt: RegExpExecArray | null;
    tag.lastIndex = i0;
    while (depth && (tt = tag.exec(lit))) { depth += tt[0] === '</g>' ? -1 : 1; i = tag.lastIndex; }
    out.push(`<g data-p="${m[1]}" data-lit="1" opacity="0" class="chn-on${m[2]}">${lit.slice(i0, i)}`);
    re.lastIndex = i;
  }
  return { dim, lit: out.join('') };
}

const actorSvg = (a: Actor): string =>
  `<g data-k="${a.k}" data-actor="1" display="none">${a.g}${a.lab !== undefined ? `<text data-k="${a.k}-l" class="${a.cls ?? 'cel-cnt cel-halo'}" x="${a.dx ?? 0}" y="${a.dy ?? 34}" text-anchor="${a.anchor ?? 'middle'}">${a.lab}</text>` : ''}</g>`;
const leadSvg = (l: Lead): string => {
  const [dx, dy] = l.d, o0 = l.o ?? [0, 0], a = l.a ?? (dx > 8 ? 'start' : dx < -8 ? 'end' : 'middle');
  const ty = dy < 0 ? dy - 6 : dy + 18, tx = a === 'start' ? dx + 4 : a === 'end' ? dx - 4 : dx;
  return `<g data-k="${l.k}" data-w="1" data-at="${l.at[0]},${l.at[1]}" display="none"><path class="dk-ldh" d="M${f(o0[0])},${f(o0[1])}L${f(dx)},${f(dy)}"/><path class="dk-ld" d="M${f(o0[0])},${f(o0[1])}L${f(dx)},${f(dy)}"/><circle class="dk-ldt" cx="${f(o0[0])}" cy="${f(o0[1])}" r="3"/>${Tx(tx, ty, l.text, 'dk-lt cel-halo', a)}</g>`;
};

export function makeStaging(o: Opt): Staging {
  const p = `dk1${o.id}`;
  const leads = o.leads ?? [];
  return {
    id: o.id, name: o.name, note: o.note, ...(o.beats ? { beats: o.beats } : {}), ...(o.holds ? { holds: o.holds } : {}),
    svg: () => {
      const { dim, lit } = stripSvgs(p, o.drop ?? [], o.dropGlyph, o.dropName, o.dropFlow);
      return `<defs>${defs(p)}</defs><g class="dk1 fig">
        <g data-k="cam"><g data-k="strip"><g class="dk-dim">${dim}</g><g class="dk-lit">${lit}</g></g>
          ${o.world ? o.world(p) : ''}${leads.map(leadSvg).join('')}<g data-k="fl" data-actor="1" display="none">${flashG(p)}</g>${o.actors.map(actorSvg).join('')}</g>
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
        if (a === 'text') el.textContent = v; else el.setAttribute(a, v);
      };
      const els = new Map<string, Element>();
      stage.querySelectorAll('[data-k]').forEach(el => els.set(el.getAttribute('data-k') as string, el));
      const q = (k: string): Element | null => els.get(k) ?? null;
      const opEl = (el: Element | null, v: number): void => {
        set(el, 'display', v < 0.004 ? 'none' : 'inline');
        set(el, 'opacity', v >= 0.996 ? '1' : v.toFixed(3));
      };
      const cam = q('cam');
      // the lit wrappers, by part
      const litEls = new Map<string, Element[]>();
      stage.querySelectorAll('[data-lit]').forEach(el => {
        const k = el.getAttribute('data-p') as string;
        litEls.set(k, [...(litEls.get(k) ?? []), el]);
      });
      // the strip's names (about their anchors) and glyphs (about their centres), counter-scaled
      const fix: Array<{ el: Element; x: number; y: number }> = [];
      stage.querySelectorAll('[data-k="strip"] text').forEach(el => {
        if (el.closest('.chn-g')) return;
        fix.push({ el, x: Number(el.getAttribute('x') ?? 0), y: Number(el.getAttribute('y') ?? 0) });
      });
      stage.querySelectorAll<SVGGraphicsElement>('[data-k="strip"] .chn-g').forEach(el => {
        if (el.parentElement?.closest('.chn-g')) return;
        const b = el.getBBox();
        fix.push({ el, x: b.x + b.width / 2, y: b.y + b.height / 2 });
      });
      const worldItems = [...stage.querySelectorAll('[data-w]')].map(el => {
        const at = (el.getAttribute('data-at') ?? '0,0').split(',').map(Number) as V;
        return { el, at };
      });
      const actors = [...stage.querySelectorAll('[data-actor]')].map(el => el.getAttribute('data-k') as string);
      let lastK = -1;
      const placed = new Set<string>();
      const litOver = new Map<string, number>();
      let K = 1, S = 1;
      const api: Api = {
        get s() { return S; }, get k() { return K; },
        put(k, at, op = 1, sc = 1) {
          const el = q(k);
          placed.add(k);
          opEl(el, op);
          if (op >= 0.004) set(el, 'transform', `translate(${f(at[0])} ${f(at[1])}) scale(${(K * sc).toFixed(4)})`);
        },
        lab(k, s) { set(q(`${k}-l`), 'text', s); },
        op(k, v) { opEl(q(k), v); },
        txt(k, s) { set(q(k), 'text', s); },
        pos(k, at, sc = 1) { set(q(k), 'transform', `translate(${f(at[0])} ${f(at[1])}) scale(${(K * sc).toFixed(4)})`); },
        lit(part, v) { litOver.set(part, v); },
        attr(k, a, v) { set(q(k), a, v); },
      };
      const litT = o.litT ?? [0.1, 1.0];
      return (beat, t) => {
        // camera: one move per beat
        const [c0, c1] = o.camT[beat] ?? [0, 1];
        const from = beat === 0 ? o.cam0 : o.cams[beat - 1];
        const c = lerpCam(from, o.cams[beat], ease2(t, c0, c1)), at = c.at ?? [800, 370];
        set(cam, 'transform', `translate(${f(at[0] - c.c[0] * c.s)} ${f(at[1] - c.c[1] * c.s)}) scale(${c.s.toFixed(4)})`);
        S = c.s; K = kOf(c.s);
        if (Math.abs(K - lastK) > 1e-4) {
          for (const { el, x, y } of fix) set(el, 'transform', `translate(${f(x * (1 - K))} ${f(y * (1 - K))}) scale(${K.toFixed(4)})`);
          for (const { el, at: w } of worldItems) set(el, 'transform', `translate(${f(w[0])} ${f(w[1])}) scale(${K.toFixed(4)})`);
          lastK = K;
        }
        placed.clear();
        litOver.clear();
        o.frame(api, beat, t);
        for (const k of actors) if (!placed.has(k)) opEl(q(k), 0);
        // lighting: the beat's set, cross-faded from the previous beat's
        const cur = new Set(o.lit[beat] ?? []), prev = new Set(beat === 0 ? [] : o.lit[beat - 1] ?? []), u = ease(t, litT[0], litT[1]);
        for (const [part, list] of litEls) {
          const v = litOver.has(part) ? (litOver.get(part) as number) : lerp(prev.has(part as Part) ? 1 : 0, cur.has(part as Part) ? 1 : 0, u);
          for (const el of list) set(el, 'opacity', v >= 0.996 ? '1' : v.toFixed(3));
        }
      };
    },
  };
}

function defs(p: string): string {
  return `<radialGradient id="${p}-pool"><stop offset="0" class="dk-pool0"/><stop offset=".55" class="dk-pool1"/><stop offset="1" class="dk-pool2"/></radialGradient>
    <radialGradient id="${p}-flash"><stop offset="0" stop-color="#fff4d6"/><stop offset=".45" stop-color="#f6c453" stop-opacity=".8"/><stop offset="1" stop-color="#f0a316" stop-opacity="0"/></radialGradient>
    <filter id="${p}-sh" x="-10%" y="-6%" width="120%" height="114%"><feDropShadow dx="1" dy="4" stdDeviation="6" flood-color="#3d3020" flood-opacity=".22"/></filter>`;
}

/* ---------------------------------------------------------------- world items and stage pieces */

/** A warm glow (world item, placed by pos) behind a protein that acts. */
export const pool = (p: string, k: string, rx: number, ry: number): string =>
  `<g data-k="${k}" display="none"><ellipse rx="${rx}" ry="${ry}" fill="url(#${p}-pool)"/></g>`;
/** A short flash (actor glyph) where a reaction happens. */
export const flashG = (p: string, r = 34): string => `<circle r="${r}" fill="url(#${p}-flash)"/>`;
/** An active-site ring with its number (world item). */
export const siteRing = (k: string, n: string): string =>
  `<g data-k="${k}" display="none"><circle class="dk-site" r="12"/>${n ? Tx(0, -18, n, 'dk-sn cel-halo') : ''}</g>`;

/** Active site 1 as a pale pocket in Rubisco's surface (world item), so that the molecules bound in it stand out. */
export const pocket = (k: string): string => `<g data-k="${k}" display="none"><ellipse class="dk-pocket" rx="98" ry="38"/></g>`;
/** The tally panel, fixed on the screen: rows stacked from the top; the panel grows as rows appear. */
export interface Row { k: string; h: number; html: string; cls?: string; x?: number; extra?: (x: number, y: number) => string }
export function panelSvg(k: string, x: number, y: number, w: number, rows: Row[]): string {
  let yy = y + 14;
  const rs = rows.map(r => { const s = `<g data-k="${r.k}" display="none"><text class="${r.cls ?? 'dk-pr'}" x="${x + (r.x ?? 18)}" y="${f(yy + r.h - 9)}">${r.html}</text>${r.extra ? r.extra(x + (r.x ?? 18), yy) : ''}</g>`; yy += r.h; return s; }).join('');
  return `<g data-k="${k}" display="none"><rect data-k="${k}-bg" class="dk-panel" x="${x}" y="${y}" width="${w}" height="40" rx="14"/>${rs}</g>`;
}
/** Sets the rows' opacities and the panel's height to the rows shown (rows fill from the top). */
export function panelShow(a: Api, k: string, rows: Row[], vis: Record<string, number>): void {
  let h = 14, any = 0;
  for (const r of rows) {
    const v = vis[r.k] ?? 0;
    a.op(r.k, v);
    h += r.h * clamp(v * 1.6);
    any = Math.max(any, v);
  }
  a.op(k, clamp(any * 2));
  a.attr(`${k}-bg`, 'height', f(h + 12));
}
/** A paper card (stage units) with an image of a paper's figure, its title and its credit. */
export function card(p: string, k: string, x: number, y: number, w: number, h: number, inner: string, rot = -1, seed = 37): string {
  return `<g data-k="${k}" display="none"><g transform="rotate(${rot} ${x + w / 2} ${y + h / 2})">
    <path class="dk-paper" d="${cutPath(x, y, w, h, seed, 3.2)}" filter="url(#${p}-sh)"/>${inner}</g></g>`;
}
export { Tx as T };

/* ---------------------------------------------------------------- one reaction at Rubisco's active site 1 */

const memo = new Map<string, (u: number) => V>();
/** curve(), memoized by its points (paths that depend on a slot are rebuilt only once). */
export function path(q: V[]): (u: number) => V {
  const key = q.map(p => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
  let c = memo.get(key);
  if (!c) { c = curve(q); memo.set(key, c); }
  return c;
}
/** Active site 1 (the front site of the render). */
export const SITE: V = SITES[0].p;
/** One step of the RuBP row in label units. */
const STEP = 2.15 * R;
/** One reaction: RuBP glides into active site 1, the gas (CO₂ or O₂) docks on it, and at the merge two products appear
 *  in its place (a: 3-PGA; b: 3-PGA after CO₂, 2-phosphoglycolate after O₂) and glide to their slots. */
export interface RubEv {
  gas: 'co2' | 'o2'; t0: number; d: number; slotA: V; slotB: V;
  /** the gas's way in (default: from the strip's CO₂ or O₂ glyph), RuBP's (default: from the strip's RuBP) */
  gasFrom?: V[]; rubpFrom?: V[];
  /** via points of the products' ways out (defaults: 3-PGA up the carboxylation arrow, 2-phosphoglycolate along the
   *  oxygenation arrow) */
  viaA?: V[]; viaB?: V[];
  /** scale of a product once in its slot */
  settle?: number;
  /** the products fade as they reach their slots (they join the strip's own glyph there) */
  fade?: boolean;
}
export interface RubKeys { rb: string; g: string; a: string; b: string; fl?: string }
/** Places the reaction's actors at t; returns its merge time and end. Names of the actors (their labels) show while
 *  they move and fade once the products are in their slots. */
export function rubEvent(a: Api, t: number, ev: RubEv, k: RubKeys): { tm: number; end: number } {
  const D = ev.d, t0 = ev.t0, tm = t0 + 0.56 * D, end = t0 + D, K = a.k;
  if (t < t0) return { tm, end };
  const gasDock: V = add(SITE, [-STEP * K, -24 * K]), src = ev.gas === 'co2' ? G.co2 : G.o2;
  // along the strip's own arrows: RuBP's into RuBisCO, the gas's (CO₂ on the carboxylation side, O₂ on the other)
  const rubIn = path([...(ev.rubpFrom ?? [G.rubp]), G.rubpFrom, G.rubpTo, SITE]);
  const gasIn = path([...(ev.gasFrom ?? [src]), ...(ev.gas === 'co2' ? [G.co2From, G.co2To] : [G.o2From, G.o2To]), gasDock]);
  if (t < tm + 0.3) {
    const tr = t0 + 0.42 * D, tg = t0 + 0.12 * D, tga = t0 + 0.5 * D;
    a.put(k.rb, glide(rubIn, t, t0, tr), 1 - ease(t, tm, tm + 0.22));
    a.op(`${k.rb}-l`, ease(t, tr - 0.1, tr + 0.2));
    if (t >= tg) a.put(k.g, glide(gasIn, t, tg, tga), 1 - ease(t, tm, tm + 0.2));
    a.op(`${k.g}-l`, ease(t, tga - 0.1, tga + 0.2));
  }
  if (k.fl && t > tm - 0.12 && t < tm + 0.55) a.put(k.fl, SITE, life(t, tm - 0.12, tm + 0.04, tm + 0.12, tm + 0.55));
  if (t >= tm) {
    const sA = add(SITE, [-46 * K, 0]), sB = add(SITE, [46 * K, 0]), go0 = tm + 0.08 * D;
    const [c0, c1] = ARROW.carbox, [o0, o1] = ARROW.oxy;
    const oxyA: V[] = [G.oxyPgaFrom, G.oxyPgaTo, G.oxyPga, ...(Math.hypot(ev.slotA[0] - G.oxyPga[0], ev.slotA[1] - G.oxyPga[1]) > 4 ? [add(G.oxyPga, [-48, 8]), [330, 262] as V, add(G.pga, [54, -4])] : [])];
    const outA = path([sA, ...(ev.viaA ?? (ev.gas === 'co2' ? [lerpV(c0, c1, 0.1), lerpV(c0, c1, 0.85)] : oxyA)), ev.slotA]);
    const outB = path([sB, ...(ev.viaB ?? (ev.gas === 'co2' ? [add(lerpV(c0, c1, 0.2), [40, -6]), lerpV(c0, c1, 0.95)] : [lerpV(o0, o1, 0.15), lerpV(o0, o1, 0.85)])), ev.slotB]);
    const u = ease2(t, go0, end), sc = lerp(1, ev.settle ?? (ev.fade ? 1 : 0.7), u), o = ease(t, tm, tm + 0.2) * (ev.fade ? 1 - ease(t, end - 0.3, end + 0.05) : 1);
    a.put(k.a, outA(u), o, sc);
    a.put(k.b, outB(ease2(t, go0 + 0.05 * D, end)), o, sc);
    const lab = ease(t, go0 + 0.12 * D, go0 + 0.24 * D) * (1 - ease(t, end - 0.15, end + 0.35));
    a.op(`${k.a}-l`, lab); a.op(`${k.b}-l`, lab);
  }
  return { tm, end };
}

/* ---------------------------------------------------------------- the cycle's piles and ways (cb1, cb3) */

/** Scale of a molecule resting in a pile. */
export const PILE = 0.8;
/** The camera on the cycle (cb1, cb3): the stroma from the thylakoid edge to TPT, the panel's room at the bottom right. */
export const CYCLE_VIEW: Cam = { s: 1.4, c: [366, 268], at: [560, 370] }; // 12 up: the supply note fits (R2)
/** The piles: 3-PGA in a column over its name, triose phosphate in 2 columns over its place, RuBP in a column. */
export const PGA_AT = (i: number): V => add(G.pga, [-78 + 74 * (i % 2), 2 - 24 * Math.floor(i / 2)]);
export const TP_AT = (j: number): V => add(G.tp, [-40 + 60 * (j % 2), -14 - 22 * Math.floor(j / 2)]);
export const RUBP_AT = (m: number): V => add(G.rubp, [0, 24 * m]);
const GAP_M: V = add(G.gap, [-40, -6]);
/** Ways along the strip's arrows: into GAPDH and out, the spent carriers back to the thylakoid edge, into PRK and out. */
export const WAY = {
  tpOut: [add(G.gap, [30, -48]), add(G.tp, [-50, 12])] as V[],
  back: [add(G.gap, [-16, -50]), [176, 52], [120, 32], G.back] as V[],
  nadphIn: [G.nadphTag, add(G.nadphTag, [56, 32]), add(G.gap, [-46, -34]), GAP_M] as V[],
  atpIn: [G.atpTag, add(G.atpTag, [54, 46]), add(G.gap, [-50, 4]), GAP_M] as V[],
  pgaUp: (from: V): V[] => [from, add(from, [26, -12]), GAP_M],
  // the strip's regeneration arrow: round the right from triose phosphate down to PRK (cell-schema.ts stripPano)
  toPrk: (from: V): V[] => [from, add(G.tp, [48, 8]), [480, 128], [580, 196], [606, 300], [598, 398], add(G.prk, [20, -38]), G.prk],
  prkOut: (to: V): V[] => [G.prk, G.prkFrom, G.prkTo, to],
  regenAtp: [G.regenAtp, add(G.regenAtp, [40, 4]), add(G.prk, [-20, 8])] as V[],
  prkBack: [add(G.prk, [0, -34]), [628, 380], [640, 220], [560, 70], [380, 12], [200, 4], add(G.back, [30, -6]), G.back] as V[],
  export: [add(G.tp, [88, -2]), [560, 96], [760, 100], [858, 98], [898, 76]] as V[],
};
const sc = (a0: number, a1: number, u: number): number => a0 + (a1 - a0) * u;
const flashAt = (a: Api, t: number, tf: number, at: V): void => { if (t > tf - 0.15 && t < tf + 0.45) a.put('fl', at, life(t, tf - 0.15, tf, tf + 0.1, tf + 0.45)); };
export interface RedKeys { pga: string; atp: string; nadph: string; tp: string; adp: string; pi: string; nadp: string }
/** One reduction at GAPDH from t0: 3-PGA (from its pile place), ATP and NADPH (from the thylakoid edge's tags) meet at
 *  GAPDH (1.25 s); triose phosphate goes to its pile place, ADP, Pᵢ and NADP⁺ glide back to the thylakoid edge.
 *  The caller places the 3-PGA before t0. Returns whether it has happened. */
export function reduction(a: Api, t: number, t0: number, from: V, to: V, k: RedKeys): boolean {
  if (t < t0 - 0.1) return false;
  const tR = t0 + 1.25;
  if (t < tR + 0.25) {
    const o = 1 - ease(t, tR, tR + 0.2);
    if (t >= t0) a.put(k.pga, glide(path(WAY.pgaUp(from)), t, t0, t0 + 1.2), o, sc(PILE, 0.85, ease(t, t0, t0 + 0.6)));
    a.put(k.atp, glide(path(WAY.atpIn), t, t0 - 0.1, t0 + 1.15), o);
    a.put(k.nadph, glide(path(WAY.nadphIn), t, t0 - 0.05, t0 + 1.2), o);
  } else a.put(k.pga, from, 0);
  flashAt(a, t, tR, G.gap);
  if (t < tR) return false;
  a.put(k.tp, glide(path([...WAY.tpOut, to]), t, tR + 0.05, tR + 1.05), ease(t, tR, tR + 0.2), sc(1, PILE, ease(t, tR + 0.3, tR + 1.05)));
  const back = (key: string, dt: number): void => { if (t < tR + 1.7 + dt) a.put(key, glide(path(WAY.back), t, tR + 0.1 + dt, tR + 1.5 + dt), ease(t, tR, tR + 0.2) * (1 - ease(t, tR + 1.35 + dt, tR + 1.6 + dt)), 0.8); };
  back(k.adp, 0); back(k.pi, 0.12); back(k.nadp, 0.22);
  return true;
}
/** A triose phosphate from its pile place into PRK (1.1 s from t0). Returns whether it has arrived. */
export function intoPrk(a: Api, t: number, t0: number, from: V, key: string): boolean {
  if (t < t0) return false;
  if (t < t0 + 1.35) a.put(key, glide(path(WAY.toPrk(from)), t, t0, t0 + 1.1), 1 - ease(t, t0 + 1.0, t0 + 1.25), sc(PILE, 0.85, ease(t, t0, t0 + 0.6)));
  else a.put(key, from, 0);
  return t >= t0 + 1.1;
}
/** A new RuBP at tE: ATP glides in from the strip's ATP tag at PRK (0.8 s before), RuBP leaves PRK for its pile place,
 *  ADP glides back to the thylakoid edge. Returns whether it has happened. */
export function newRubp(a: Api, t: number, tE: number, to: V, k: { atp: string; rubp: string; adp: string }): boolean {
  if (t < tE - 0.8) return false;
  if (t < tE + 0.25) a.put(k.atp, glide(path(WAY.regenAtp), t, tE - 0.8, tE), 1 - ease(t, tE, tE + 0.2));
  flashAt(a, t, tE, G.prk);
  if (t < tE) return false;
  a.put(k.rubp, glide(path(WAY.prkOut(to)), t, tE + 0.05, tE + 1.05), ease(t, tE, tE + 0.2), sc(1, PILE, ease(t, tE + 0.3, tE + 1.05)));
  if (t < tE + 2.5) a.put(k.adp, glide(path(WAY.prkBack), t, tE + 0.1, tE + 2.3), ease(t, tE, tE + 0.2) * (1 - ease(t, tE + 2.1, tE + 2.35)), 0.8);
  return true;
}
/** A triose phosphate out through TPT into the cytosol (t0 to t1), fading at sucrose. Returns whether it has crossed TPT. */
export function tpExport(a: Api, t: number, t0: number, t1: number, from: V, key: string): boolean {
  if (t < t0) return false;
  if (t < t1 + 0.3) a.put(key, glide(path([from, ...WAY.export]), t, t0, t1), 1 - ease(t, t1 - 0.2, t1 + 0.2), sc(PILE, 0.85, ease(t, t0, t0 + 0.6)));
  else a.put(key, from, 0);
  return t >= t0 + 0.6 * (t1 - t0);
}

/* ---------------------------------------------------------------- the counted cycle (cb1, reduction, regeneration) */
// DARK_COUNTS_BRIEF.md (lecturer, 28 Oct 2026, evening): the smallest whole unit, stated once; the inputs drawn and numbered
// first; every output made from inputs the viewer saw arrive; ATP and NADPH bind each 3-PGA together, in one go; counters
// tick with the drawn molecules; one fixed framing; smooth eased curves.

/** Places (strip units): the inputs' columns (CO₂ at the strip's CO₂, RuBP under RuBisCO, the first on top) and the piles
 *  (3-PGA: 2 columns over the strip's 3-PGA name; triose phosphate: 2 columns at its place). */
export const AT = {
  co2: (k: number): V => add(G.co2, [0, 30 * k]),
  rubp: (m: number): V => add(G.rubp, [0, 24 * m]),
  pga: (j: number): V => add(G.pga, [-96 + 84 * (j % 2), -2 - 24 * Math.floor(j / 2)]),
  tp: (j: number): V => add(G.tp, [-44 + 88 * (j % 2), -14 - 22 * Math.floor(j / 2)]),
  /** a triose phosphate waiting at TPT, in the stroma */
  tpt: add(G.tpt, [-70, -14]) as V,
};
/** Where an input CO₂ comes from: below the frame, left of RuBisCO. */
export const CO2_FROM: V = [G.co2[0] - 24, G.co2[1] + 190];
const halfW = (n: number, r = R): number => rowWidth(n, r) / 2 + 5;
/** A molecule in carbon form with its number on its left. */
export const numbered = (k: string, formula: string, n: number, halos?: string): Actor =>
  ({ k, g: GLYPH.carbon(formula, halos), lab: String(n), dx: -(halfW(formula.length) + 3), dy: 5.5, anchor: 'end', cls: 'dk-num cel-halo' });
/** CO₂ with its number on its left. */
export const numberedCo2 = (k: string, n: number): Actor => ({ k, g: GLYPH.co2(), lab: String(n), dx: -(2.7 * R + 8), dy: 5.5, anchor: 'end', cls: 'dk-num cel-halo' });
/** A short line (world item) such as "from carboxylation", at a pile, keyed k. */
export const fromLine = (k: string, text: string, a: 'start' | 'middle' | 'end' = 'middle'): string =>
  `<g data-k="${k}" display="none">${Tx(0, 0, text, 'dk-from cel-halo', a)}</g>`;
/** A pile's name (world item), keyed k. */
export const pileName = (k: string, text: string, a: 'start' | 'middle' | 'end' = 'middle'): string =>
  `<g data-k="${k}" display="none">${Tx(0, 0, text, 'cel-mn cel-halo', a)}</g>`;

/** One carboxylation: RuBP rises from its place into the active site, CO₂ glides from its place along the CO₂ arrow and
 *  docks; at the merge both fade and 2 3-PGA leave along the carboxylation arrow to their pile places. Times in the beat:
 *  t0 start, d length. The caller places the inputs before t0. */
export interface CarbN { t0: number; d: number; co2: V; rubp: V; to: [V, V]; k: { rb: string; g: string; a: string; b: string } }
export function carbN(a: Api, t: number, e: CarbN): { tm: number; end: number } {
  const { t0, d } = e, tm = t0 + 0.56 * d, end = t0 + d, K = a.k;
  if (t < t0) return { tm, end };
  const dock: V = add(SITE, [-STEP * K, -24 * K]);
  if (t < tm + 0.3) {
    a.put(e.k.rb, glide(path([e.rubp, G.rubpFrom, G.rubpTo, SITE]), t, t0, t0 + 0.45 * d), 1 - ease(t, tm, tm + 0.22));
    a.put(e.k.g, glide(path([e.co2, G.co2From, G.co2To, dock]), t, t0 + 0.08 * d, tm - 0.05 * d), 1 - ease(t, tm, tm + 0.2));
  }
  if (t > tm - 0.12 && t < tm + 0.5) a.put('fl', SITE, life(t, tm - 0.12, tm + 0.03, tm + 0.1, tm + 0.5));
  if (t >= tm) {
    const [c0, c1] = ARROW.carbox, go0 = tm + 0.05 * d, o = ease(t, tm, tm + 0.18);
    const outA = path([add(SITE, [-40 * K, 0]), lerpV(c0, c1, 0.1), lerpV(c0, c1, 0.9), e.to[0]]);
    const outB = path([add(SITE, [-6 * K, -6 * K]), lerpV(c0, c1, 0.3), lerpV(c0, c1, 0.98), e.to[1]]);
    a.put(e.k.a, outA(ease2(t, go0, end)), o, lerp(1, PILE, ease(t, go0, end)));
    a.put(e.k.b, outB(ease2(t, go0 + 0.06 * d, end)), o, lerp(1, PILE, ease(t, go0, end)));
  }
  return { tm, end };
}
/** Into GAPDH: the 3-PGA's way from its pile place, and ATP's and NADPH's from the thylakoid edge's tags. */
const GAP_IN: V = add(G.gap, [-38, -4]);
const ATP_IN: V[] = [G.atpTag, lerpV(G.atpTag, GAP_IN, 0.5), GAP_IN];
const NADPH_IN: V[] = [G.nadphTag, add(lerpV(G.nadphTag, GAP_IN, 0.5), [14, -6]), GAP_IN];
const TP_OUT: V[] = [add(G.gap, [26, -44]), add(G.tp, [-56, 14])];
const SPENT: V[] = [add(G.gap, [-14, -48]), add(G.back, [96, 40]), add(G.back, [40, 8]), G.back];
export interface RedKeysN { pga: string; atp: string; nadph: string; tp: string; adp: string; pi: string; nadp: string }
/** One reduction at GAPDH: 3-PGA (from its pile place), ATP and NADPH (from the thylakoid edge's tags) set off at t0 and
 *  reach GAPDH together at t0 + d; triose phosphate leaves for its pile place; ADP, Pᵢ and NADP⁺ glide back to the
 *  thylakoid edge's spent-carrier row. Returns whether it has happened (t ≥ t0 + d). */
export function reduceN(a: Api, t: number, t0: number, d: number, from: V, to: V, k: RedKeysN): boolean {
  if (t < t0) return false;
  const tR = t0 + d;
  if (t < tR + 0.25) {
    const o = 1 - ease(t, tR - 0.02, tR + 0.18);
    a.put(k.pga, glide(path([from, add(from, [26, -12]), GAP_IN]), t, t0, tR), o, lerp(PILE, 0.9, ease(t, t0, tR)));
    a.put(k.atp, glide(path(ATP_IN), t, t0, tR), o * ease(t, t0, t0 + 0.15));
    a.put(k.nadph, glide(path(NADPH_IN), t, t0, tR), o * ease(t, t0, t0 + 0.15));
  } else a.put(k.pga, from, 0);
  if (t > tR - 0.12 && t < tR + 0.45) a.put('fl', G.gap, life(t, tR - 0.12, tR, tR + 0.08, tR + 0.45));
  if (t < tR) return false;
  const u = Math.min(1, 0.6 + 0.4 * d);
  a.put(k.tp, glide(path([...TP_OUT, to]), t, tR + 0.05, tR + 0.05 + u), ease(t, tR, tR + 0.18), lerp(1, PILE, ease(t, tR + 0.2, tR + 0.05 + u)));
  const back = (key: string, dt: number): void => {
    const b0 = tR + 0.1 + dt, b1 = b0 + 1.1 + 0.3 * d;
    if (t < b1 + 0.3) a.put(key, glide(path(SPENT), t, b0, b1), ease(t, tR, tR + 0.18) * (1 - ease(t, b1 - 0.2, b1 + 0.1)), 0.8);
  };
  back(k.adp, 0); back(k.pi, 0.1); back(k.nadp, 0.2);
  return true;
}
/** A triose phosphate along the regeneration arrow into PRK (t0 to t1). Returns whether it has arrived. */
export function intoPrkN(a: Api, t: number, t0: number, t1: number, from: V, key: string): boolean {
  if (t < t0) return false;
  if (t < t1 + 0.25) a.put(key, glide(path(WAY.toPrk(from)), t, t0, t1), 1 - ease(t, t1 - 0.1, t1 + 0.15), lerp(PILE, 0.9, ease(t, t0, t0 + 0.5)));
  else a.put(key, from, 0);
  return t >= t1;
}
/** At PRK at tE: ATP glides in from the strip's ATP tag at PRK (from tE − 0.8), RuBP leaves PRK for `to` along the strip's
 *  PRK → RuBP arrow, ADP glides back to the thylakoid edge. Returns whether it has happened. */
export function prkN(a: Api, t: number, tE: number, from: V | null, to: V, k: { ru?: string; atp: string; rubp: string; adp: string }): boolean {
  if (t < tE - 0.8) return false;
  if (t < tE + 0.25) {
    a.put(k.atp, glide(path(WAY.regenAtp), t, tE - 0.8, tE), 1 - ease(t, tE - 0.02, tE + 0.18));
    if (k.ru && from) a.put(k.ru, glide(path([from, lerpV(from, G.prk, 0.5), G.prk]), t, tE - 0.8, tE), 1 - ease(t, tE - 0.02, tE + 0.18), PILE);
  }
  if (t > tE - 0.12 && t < tE + 0.45) a.put('fl', G.prk, life(t, tE - 0.12, tE, tE + 0.08, tE + 0.45));
  if (t < tE) return false;
  a.put(k.rubp, glide(path([G.prk, G.prkFrom, G.prkTo, to]), t, tE + 0.05, tE + 1.2), ease(t, tE, tE + 0.18), lerp(1, PILE, ease(t, tE + 0.3, tE + 1.2)));
  if (t < tE + 2.6) a.put(k.adp, glide(path(WAY.prkBack), t, tE + 0.1, tE + 2.3), ease(t, tE, tE + 0.18) * (1 - ease(t, tE + 2.1, tE + 2.4)), 0.8);
  return true;
}

// Cytochrome b₆f on the slide 8 figure, in the 7m1 glyph style (lecturer, 28 Oct 2026; research/redo-2026-10-28/
// ETC_ANIM_BRIEF.md, section b6f): the parts both stagings (b6f-m1, b6f-m2) share. Reworked from b6f8-common.ts.
// The stage IS the slide 8 figure, variant 8m1: focusSvg() of figs/chain.ts with LIT_B6F in the 'bil' look and glyph mode
// (atom balls, ringed H⁺, tags), drawn in the slide's figure card. The camera zooms in, the story plays, the camera zooms
// back out to the whole chain.
// - Beat 1 (two clicks). Point: leaders name "cytochrome b₆f" (it glows briefly), then "plastoquinol (PQH₂)", the lettered
//   PQ carrying 2 e⁻ and 2 ringed H⁺ (it glows). Do: it docks at b₆f; its 2 H⁺ drop into the lumen onto the slide's two
//   H⁺ there, its 2 e⁻ enter b₆f; emptied, it is named "plastoquinone (PQ)" again.
// - Beat 2 (two clicks). Point: the leader "plastocyanin, a small copper protein" (it glows), and "photosystem I" (m1:
//   before plastocyanin moves; m2: as it arrives). Do: one e⁻ passes from b₆f to plastocyanin along the slide's arrow;
//   plastocyanin carries it through the lumen to photosystem I and docks under it (m2: the camera follows it there).
// - Beat 3: zoom out to the whole chain. The carriers stay where the story left them: plastoquinone docked at b₆f,
//   plastocyanin with its electron docked under photosystem I (PC_DOCK, where the PSI animation starts). b₆f's H⁺ arrow
//   comes back, two more pairs of H⁺ collect in the lumen, photosystem I starts to light (60 %). b₆f's two electron
//   arrows do not come back: the carriers they point at have moved.
//
// How the slide figure is reused (figs/chain.ts is not modified):
// - focusSvg() wraps every part's markup in <g class="chn-on|off">. The part of each wrapper is found by drawing the
//   figure once per part with that part's lit state flipped; the wrappers are tagged data-p="<part>". A lit copy of
//   photosystem I (from a drawing with PSI lit) waits at opacity 0; a copy of b₆f's render under it, through the chain's
//   own glow filter, gives b₆f its brief glow.
// - Plastoquinone and plastocyanin (bodies, labels, plastoquinone's H⁺) are told by copies that sit exactly on the slide's
//   and take over once b₆f's lit arrows (drawn over the carriers on the slide) have faded, so the first frame is the
//   slide's. The slide's own never come back.
// - In glyph mode, the H⁺ rings, atom balls and tags are <g class="chn-g"> groups: each is counter-scaled about its own
//   centre; the other texts about their anchor. The camera scales the whole schema by s; text and glyphs are
//   counter-scaled by (s/s₀)^−0.7, as on slide 7's animation (psii7-common.ts).
import './b6fm-common.css';
import { focusSvg, GEO, hring, LIT_B6F, type Part } from '../figs/chain';
import { clamp01, f1, lerp, lerpV, setters, smooth, smoother, tfStr, tw, tween, type Tf, type V } from './antenna-common';
import type { Staging } from './types';

/* ---------------------------------------------------------------- the slide figure (8m1), tagged by part */

/** Parts drawn in every view (the extras of chain.ts's focus views, drawn only when lit, are found separately). */
const PARTS: Part[] = ['psii', 'light-psii', 'water', 'e-water-psii', 'e-psii-pq', 'pq', 'pq-h-in', 'e-pq-b6f', 'b6f', 'pq-h-out',
  'e-b6f-pc', 'pc', 'e-pc-psi', 'psi', 'light-psi', 'e-psi-fd', 'fd', 'e-fd-fnr', 'fnr', 'e-fnr-nadph', 'nadph', 'h-lumen', 'atps', 'atp'];

interface Wrap { a: number; b: number; inner: string; on: boolean }
/** The part wrappers of a chain drawing, in document order (they never nest; their content may hold other groups). */
function wraps(s: string): Wrap[] {
  const out: Wrap[] = [], re = /<g class="chn-(on|off)">/g, tag = /<g[\s>]|<\/g>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(s))) {
    const i0 = m.index + m[0].length;
    let depth = 1, i = i0, t: RegExpExecArray | null;
    tag.lastIndex = i0;
    while (depth && (t = tag.exec(s))) { depth += t[0] === '</g>' ? -1 : 1; i = tag.lastIndex; }
    out.push({ a: m.index, b: i, inner: s.slice(i0, i - 4), on: m[1] === 'on' });
    re.lastIndex = i;
  }
  return out;
}
const strip = (s: string): string => s.replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
/** Slide 8's figure, variant 8m1 (figs/l08c.ts), with the given parts lit. */
const draw8 = (id: string, lit: Part[]): string => strip(focusSvg(id, { look: 'bil', lit, g: { mol: true }, say: '' }));
/** The part of each wrapper of the slide 8 drawing: flip one part's lit state at a time and see which wrappers change. */
function partsOf(): Array<Part | null> {
  const base = wraps(draw8('p8mprobe', LIT_B6F)), out: Array<Part | null> = base.map(() => null);
  for (const p of PARTS) {
    const alt = wraps(draw8('p8mprobe', LIT_B6F.includes(p) ? LIT_B6F.filter(x => x !== p) : [...LIT_B6F, p]));
    if (alt.length === base.length) alt.forEach((w, i) => { if (w.on !== base[i].on) out[i] = p; });
  }
  // the H⁺ riding on plastoquinone: drawn only when lit, as two ringed H⁺ of radius 9.5
  base.forEach((w, i) => { if (out[i] === null && w.on && /class="chn-hr"[^>]*r="9\.5"/.test(w.inner)) out[i] = 'pq-h-load'; });
  return out;
}
const esc = (s: string): string => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const NUM = '(-?[\\d.]+)';
const circlesOf = (s: string, cls: string): V[] =>
  [...s.matchAll(new RegExp(`<circle class="${cls}" cx="${NUM}" cy="${NUM}"`, 'g'))].map(m => [Number(m[1]), Number(m[2])]);
function textOf(s: string, cls: string, content: string, dflt: V): V {
  const m = new RegExp(`<text class="${cls}" x="${NUM}" y="${NUM}"[^>]*>${esc(content)}</text>`).exec(s);
  return m ? [Number(m[1]), Number(m[2])] : dflt;
}

/** Where the story happens, read from the drawing (fallbacks: chain.ts's c2c layout). */
interface Geo {
  pq: V; pc: V; hem: V; cytf: V;
  /** the two ringed H⁺ on plastoquinone; the two ringed H⁺ in the lumen under b₆f */
  pqH: V[]; hOut: V[];
  /** the labels of plastoquinone and plastocyanin */
  pqLab: V; pcLab: V;
}
interface Scene { svg: string; geo: Geo }
function scene(id: string): Scene {
  const base = draw8(id, LIT_B6F), lit = draw8(id, [...LIT_B6F, 'psi']);
  const parts = partsOf(), wb = wraps(base), wl = wraps(lit);
  const inner = (p: Part): string => wb.filter((_, i) => parts[i] === p).map(w => w.inner).join('');
  let svg = '', at = 0;
  wb.forEach((w, i) => {
    const p = parts[i] ?? 'x';
    // b₆f's glow: a copy of its render under it, through the chain's own glow filter (halo + render), faded in briefly
    const im = p === 'b6f' ? /<image [^>]*\/>/.exec(w.inner) : null;
    const halo = im ? im[0].replace(/ filter="[^"]*"/, '').replace('<image', `<image data-k="b6fhalo" opacity="0" filter="url(#${id}-glow)"`) : '';
    svg += `${base.slice(at, w.a)}${halo}<g class="chn-${w.on ? 'on' : 'off'}" data-p="${p}">${w.inner}</g>`;
    if (p === 'psi' && wl[i]) svg += `<g class="chn-on" data-p="psi-lit" opacity="0">${wl[i].inner}</g>`;
    at = w.b;
  });
  svg += base.slice(at);
  const { pq, pc, hem, cytf } = GEO;
  const pqH = circlesOf(inner('pq-h-load'), 'chn-hr'), hOut = circlesOf(inner('pq-h-out'), 'chn-hr');
  return {
    svg,
    geo: {
      pq, pc, hem, cytf,
      pqH: pqH.length === 2 ? pqH : [[pq[0] - 11, pq[1] - 19], [pq[0] + 11, pq[1] - 19]],
      hOut: hOut.length === 2 ? hOut : [[285.3, 388.4], [313.8, 403.6]],
      pqLab: textOf(inner('pq'), 'chn-in', 'plastoquinone', [pq[0], pq[1] - 46]),
      pcLab: textOf(inner('pc'), 'chn-in', 'plastocyanin', [pc[0], pc[1] + 44]),
    },
  };
}

/* ---------------------------------------------------------------- views */

/** The whole chain: the slide's figure card (860 × 642 px around the 800 × 600 figure drawn at 0.97) fills the stage. */
const B: Tf = { s: 1.07, t: [800 - 1.07 * 400, 370 - 1.07 * 300] };
/** A close view: scale s, figure point c at the stage centre. */
export interface View { s: number; c: V }
const tf = (v: View): Tf => ({ s: v.s, t: [800 - v.s * v.c[0], 370 - v.s * v.c[1]] });
/** Text and glyph scale for a camera scale s. */
const kOf = (s: number): number => (s / B.s) ** -0.7;
/** The slide's figure card, in figure units (pilot.css .lay-figure .fig, with the paper look's fill and edge). */
const CARD = { x: -43.3, y: -30.9, w: 886.6, h: 661.9, r: 22.7 };

/* ---------------------------------------------------------------- where things go (figure units) */

/** Where plastocyanin docks under photosystem I: on PSI's lumenal face (render bottom ≈ 335 at x ≈ 500), under P700
 *  (505.8, 311.5). The PSI animation (slide 9) starts with plastocyanin here. */
export const PC_DOCK: V = [500, 350];
/** Where plastoquinone docks in b₆f: its Q_o site, toward the lumen side of the membrane, left of the hemes. */
const DOCK: V = [GEO.hem[0] - 30, GEO.hem[1] + 5];
/** The two electrons on plastoquinone (0 goes on to plastocyanin), relative to its centre; where they wait in b₆f. */
const ON_PQ: V[] = [[12.5, 0.5], [-12.5, 0.5]];
const E_IN: V[] = [[GEO.hem[0] + 4, GEO.hem[1] + 6], [GEO.hem[0] - 1, GEO.hem[1] - 9]];
/** Plastoquinone's two H⁺ fall through b₆f's lumen side to the slide's two H⁺ (control points of their curves). */
const H_VIA: V[] = [[DOCK[0] - 22, 346], [DOCK[0] + 8, 354]];
/** Two more pairs of H⁺ in the lumen round the slide's two, coming out of b₆f's lumen side. */
const MORE: V[] = [[341, 383], [347, 413], [318, 431], [289, 421]];
const MORE_FROM: V = [DOCK[0] + 6, 352];
/** Leader labels of the close view: label anchor and leader end. */
const LAB = {
  b6f: { at: [345, 214] as V, to: [345, 262] as V },
  psi: { at: [476, 214] as V, to: [481, 248] as V },
  /** plastoquinone's label relative to it; its leader ends on top of plastoquinone, between its two H⁺ */
  pqOff: [-26, -60] as V, pqTo: [0, -9.5] as V,
  /** plastocyanin's label under it, as on the slide */
  pcOff: [0, 44] as V,
};

/* ---------------------------------------------------------------- timing (s into each beat) */

/** A move: 0 → 1 from t0 over d, eased at both ends. */
const mv = (t: number, t0: number, d: number): number => smoother((t - t0) / d);
/** A brief glow: up over 0.3 s from t0, held, down by t0 + 1.4. */
const glow = (t: number, t0: number): number => tw(t, t0, t0 + 0.3) * (1 - tw(t, t0 + 1.0, t0 + 1.4));
/** A label's text changing at t0: the old one goes over 0.15 s, then the new one comes over 0.2 s. */
const swOut = (t: number, t0: number): number => 1 - tw(t, t0, t0 + 0.15);
const swIn = (t: number, t0: number): number => tw(t, t0 + 0.15, t0 + 0.35);
/** A point on the quadratic Bézier a → c → b. */
const bez = (a: V, c: V, b: V, u: number): V => {
  const v = 1 - u;
  return [v * v * a[0] + 2 * v * u * c[0] + u * u * b[0], v * v * a[1] + 2 * v * u * c[1] + u * u * b[1]];
};
/** A smooth path through points (Catmull-Rom, as chain.ts draws its arrows), walked at even speed: u ∈ [0, 1]. */
function walker(q: V[]): (u: number) => V {
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
    const d = clamp01(u) * L;
    let i = 1;
    while (i < acc.length - 1 && acc[i] < d) i++;
    const e = (d - acc[i - 1]) / Math.max(1e-6, acc[i] - acc[i - 1]);
    return lerpV(pts[i - 1], pts[i], e);
  };
}
/** Electron 0, b₆f → plastocyanin along the slide's arrow (chain.ts e-b6f-pc); plastocyanin through the lumen to PSI. */
const TO_PC = walker([E_IN[0], [GEO.cytf[0] - 6, GEO.cytf[1] - 10], [GEO.cytf[0] + 12, GEO.cytf[1] + 14], [GEO.pc[0] - 14, GEO.pc[1] - 8], GEO.pc]);
const PC_WAY = walker([GEO.pc, [446, 390], [482, 374], PC_DOCK]);

// Beat 1: zoom in (1.1 s) while b₆f's lit arrows give way; the carriers change over to the story's copies (swap) and
// plastoquinone takes its lettered shape; b₆f is named and glows; plastoquinol is named and glows, its electrons show;
// [click] it docks; H⁺ drop, e⁻ enter; it is named plastoquinone again.
const B1 = { zoom: 0.05, zoomD: 1.1, flowsOut: [0.05, 0.4], swap: 0.4, zl: 0.95, b6f: 1.25, pq: 2.3, hold: 3.75, dock: 3.85, dockD: 1.0, hand: 5.0, eD: 0.6, hD: 0.9, relabel: 5.6, end: 6.15 };
/** Beat 2, per staging: camera move (m2), plastocyanin named, PSI named, [click] e⁻ to plastocyanin, plastocyanin to PSI. */
export interface Beat2 { cam?: [number, number]; pc: number; psi: number; hold: number; e: number; eD: number; go: number; goD: number; end: number }
// Beat 3: zoom out; the labels go to their slide form; b₆f's H⁺ arrow returns; more H⁺; photosystem I starts to light.
const B3 = { out: 0.05, outD: 1.2, labs: 0.1, hOut: 1.05, more: [1.45, 1.85], psi: 2.25, end: 3.0 };
/** How lit photosystem I gets at the end: it starts to light. */
const PSI_END = 0.6;

/* ---------------------------------------------------------------- overlay: drawn round their origin at the slide's size */

const glyph = (k: string, inner: string, o = 0): string => `<g data-k="${k}" opacity="${o}">${inner}</g>`;
const lab = (s: string, cls: string, a: 'start' | 'middle' | 'end' = 'middle'): string =>
  `<text class="${cls}" x="0" y="0" text-anchor="${a}">${s}</text>`;
const B6F_NAME = 'cytochrome <tspan class="chn-it">b</tspan>₆<tspan class="chn-it">f</tspan>';
const leader = (k: string): string =>
  `<g class="b6fm-lead" data-k="ld-${k}" opacity="0"><path class="chn-ldh" data-k="ld-${k}-h" d="M0,0"/><path class="chn-ld" data-k="ld-${k}-l" d="M0,0"/><circle class="chn-ldt" data-k="ld-${k}-t" r="3.2"/></g>`;
/** Label texts, by key: [text, class]. Widths (at the slide's size) place the leaders' starts. */
const TEXTS: Record<string, [string, string, number]> = {
  'lt-b6f': [B6F_NAME, 'chn-name chn-halo', 150],
  'lt-psi': ['photosystem I', 'chn-name chn-halo', 140],
  'lt-pq0': ['plastoquinone', 'chn-in', 132],
  'lt-pq1': ['plastoquinol (PQH₂)', 'chn-in chn-halo', 196],
  'lt-pq2': ['plastoquinone (PQ)', 'chn-in chn-halo', 186],
  'lt-pc0': ['plastocyanin', 'chn-in', 122],
  'lt-pc1': ['plastocyanin, a small copper protein', 'chn-in chn-halo', 352],
};

function overlaySvg(P: string): string {
  return `<defs><radialGradient id="${P}-pool"><stop offset="0" class="b6fm-pool0"/><stop offset=".55" class="b6fm-pool1"/><stop offset="1" class="b6fm-pool2"/></radialGradient></defs>
    ${glyph('gpq', `<ellipse rx="44" ry="34" fill="url(#${P}-pool)"/>`)}${glyph('gpc', `<circle r="44" fill="url(#${P}-pool)"/>`)}
    ${glyph('mpc', '<circle class="chn-body chn-pc" r="16"/>')}
    ${glyph('mpq', '<ellipse class="chn-body chn-pq" data-k="mpqe" rx="13" ry="6.5"/><text class="chn-lt" data-k="mpqt" x="0" y="5" text-anchor="middle" opacity="0">PQ</text>')}
    ${[0, 1].map(i => glyph(`e${i}`, '<circle class="b6fm-e" r="6"/>')).join('')}
    ${[0, 1].map(i => glyph(`h${i}`, hring(0, 0, 9.5))).join('')}${[0, 1, 2, 3].map(i => glyph(`x${i}`, hring(0, 0, 12))).join('')}
    ${['b6f', 'psi', 'pq', 'pc'].map(leader).join('')}
    ${Object.entries(TEXTS).map(([k, [s, cls]]) => glyph(k, lab(s, cls))).join('')}
    ${glyph('zl-stroma', lab('stroma', 'chn-zone', 'start'))}${glyph('zl-lumen', lab('lumen', 'chn-zone', 'start'))}
    ${glyph('l-e', lab('e⁻', 'b6fm-elab chn-halo', 'start'))}`;
}

/* ---------------------------------------------------------------- the staging */

export interface Opt {
  id: string; name: string; note: string;
  /** the close view of beat 1; of beat 2's first step (z2) and of its end (z2e: m2 follows plastocyanin there) */
  z1: View; z2: View; z2e: View; follow: boolean;
  b2: Beat2;
}

export function makeStaging(o: Opt): Staging {
  const P = `p8m${o.id}`;
  const { svg: chain, geo: G } = scene(`${P}c`);
  const V1 = tf(o.z1), V2 = tf(o.z2), V2e = tf(o.z2e), B2 = o.b2;
  const TEND = [B1.end, B2.end, B3.end];
  const H_ON: V[] = G.pqH.map(h => [h[0] - G.pq[0], h[1] - G.pq[1]]);

  return {
    id: o.id,
    name: o.name,
    note: o.note,
    holds: [[B1.hold], [B2.hold], []],
    svg: () => `
      <g data-k="cam"><g class="fig">
        <defs><filter id="${P}-sl" x="-5%" y="-5%" width="110%" height="112%"><feDropShadow dx="0" dy="8" stdDeviation="9" flood-color="#46321a" flood-opacity=".14"/></filter></defs>
        <rect class="b6fm-slidecard" x="${CARD.x}" y="${CARD.y}" width="${CARD.w}" height="${CARD.h}" rx="${CARD.r}" filter="url(#${P}-sl)"/>
        <g data-k="chain" class="chn chn-pdb-bilayer chn-fx">${chain}</g>
        ${overlaySvg(P)}
      </g></g>`,

    bind(stage) {
      const S = setters(stage), { q, set, op } = S;
      const chainG = q('chain');
      const parts = (p: string): SVGGElement[] => Array.from(chainG.querySelectorAll<SVGGElement>(`[data-p="${p}"]`));
      // the chain's texts (counter-scaled about their anchor) and glyphs (H⁺ rings, atoms, tags: about their centre, read
      // from their circles and rects, so it does not depend on layout)
      const texts = Array.from(chainG.querySelectorAll<SVGTextElement>('text')).filter(el => !el.closest('.chn-g'))
        .map(el => ({ el, x: Number(el.getAttribute('x')), y: Number(el.getAttribute('y')) }));
      const glyphs = Array.from(chainG.querySelectorAll<SVGGElement>('g.chn-g')).map(el => {
        let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
        const n = (e: Element, a: string): number => Number(e.getAttribute(a) ?? 0);
        el.querySelectorAll('circle').forEach(c => { const r = n(c, 'r'); x0 = Math.min(x0, n(c, 'cx') - r); x1 = Math.max(x1, n(c, 'cx') + r); y0 = Math.min(y0, n(c, 'cy') - r); y1 = Math.max(y1, n(c, 'cy') + r); });
        el.querySelectorAll('rect').forEach(c => { x0 = Math.min(x0, n(c, 'x')); x1 = Math.max(x1, n(c, 'x') + n(c, 'width')); y0 = Math.min(y0, n(c, 'y')); y1 = Math.max(y1, n(c, 'y') + n(c, 'height')); });
        return { el, c: (Number.isFinite(x0) ? [(x0 + x1) / 2, (y0 + y1) / 2] : [0, 0]) as V };
      });
      const sc = (el: Element, c: V, k: number): void =>
        set(el, 'transform', `matrix(${k.toFixed(4)},0,0,${k.toFixed(4)},${(c[0] * (1 - k)).toFixed(2)},${(c[1] * (1 - k)).toFixed(2)})`);
      const flowsE = ['e-pq-b6f', 'e-b6f-pc'].flatMap(parts), hOutW = parts('pq-h-out');
      const slideCarriers = ['pq', 'pc', 'pq-h-load'].flatMap(parts);
      const psiLit = parts('psi-lit'), halo = q('b6fhalo');
      /** A glyph at figure point at, scaled sc, at opacity o. */
      const put = (k: string, at: V, s: number, o: number): void => {
        const el = q(k);
        op(el, o);
        if (o > 0.004) set(el, 'transform', `translate(${f1(at[0])} ${f1(at[1])}) scale(${s.toFixed(4)})`);
      };
      /** A leader from `from` to `to` (figure units), its end dot counter-scaled. */
      const lead = (k: string, from: V, to: V, kk: number, o: number): void => {
        op(q(`ld-${k}`), o);
        if (o <= 0.004) return;
        const d = `M${f1(from[0])},${f1(from[1])}L${f1(to[0])},${f1(to[1])}`;
        set(q(`ld-${k}-h`), 'd', d);
        set(q(`ld-${k}-l`), 'd', d);
        const t = q(`ld-${k}-t`);
        set(t, 'cx', f1(to[0])); set(t, 'cy', f1(to[1])); set(t, 'r', (3.2 * kk).toFixed(2));
      };
      /** The start of a leader under (dy > 0) or over (dy < 0) a label, toward its end but within the label. */
      const start = (key: string, at: V, to: V, kk: number, dy: number): V => {
        const w = TEXTS[key][2] * kk * 0.36;
        return [at[0] + Math.max(-w, Math.min(w, to[0] - at[0])), at[1] + dy * kk];
      };

      let last = '';
      return (beatIn, t) => {
        const b = Math.max(0, Math.min(2, Math.round(beatIn)));
        const tt = Math.max(0, Math.min(t, TEND[b]));
        const key = `${b}:${tt.toFixed(3)}`;
        if (key === last) return;
        last = key;
        /** Seconds into beat n: −1 before it begins, 99 after it. */
        const T = (n: number): number => (b === n ? tt : b > n ? 99 : -1);
        const t1 = T(0), t2 = T(1), t3 = T(2);

        /* ---- camera: in with beat 1; m2 moves on in beat 2 and follows plastocyanin; out with beat 3 */
        const uPc = mv(t2, B2.go, B2.goD);
        let cam = tween(B, V1, mv(t1, B1.zoom, B1.zoomD));
        if (b === 1) {
          cam = tween(V1, V2, B2.cam ? mv(tt, B2.cam[0], B2.cam[1] - B2.cam[0]) : 1);
          if (o.follow) cam = tween(cam, V2e, uPc);
        } else if (b === 2) cam = tween(V2e, B, mv(tt, B3.out, B3.outD));
        const k = kOf(cam.s), z = clamp01(Math.log(cam.s / B.s) / Math.log(V1.s / B.s));
        set(q('cam'), 'transform', tfStr(cam));
        texts.forEach(({ el, x, y }) => sc(el, [x, y], k));
        glyphs.forEach(({ el, c }) => sc(el, c, k));
        /** A stage point in figure units (labels fixed on the screen). */
        const fig = (p: V): V => [(p[0] - cam.t[0]) / cam.s, (p[1] - cam.t[1]) / cam.s];

        /* ---- close-view labels: the zones, fixed on the screen; b₆f and photosystem I by leaders */
        const zl = tw(t1, B1.zl, B1.zl + 0.25) * (1 - tw(t3, B3.out, B3.out + 0.3));
        put('zl-stroma', fig([36, 54]), k, zl);
        put('zl-lumen', fig([36, 712]), k, zl);
        const outL = 1 - tw(t3, B3.labs - 0.05, B3.labs + 0.25);
        // (m2: b₆f's label, at the top, gives way as the camera moves down to plastocyanin)
        const nb = tw(t1, B1.b6f, B1.b6f + 0.25) * outL * (B2.cam ? 1 - tw(t2, B2.cam[0], B2.cam[0] + 0.35) : 1);
        put('lt-b6f', LAB.b6f.at, k, nb);
        lead('b6f', start('lt-b6f', LAB.b6f.at, LAB.b6f.to, k, 7), LAB.b6f.to, k, nb);
        const np = tw(t2, B2.psi, B2.psi + 0.25) * outL;
        put('lt-psi', LAB.psi.at, k, np);
        lead('psi', start('lt-psi', LAB.psi.at, LAB.psi.to, k, 7), LAB.psi.to, k, np);
        // b₆f glows briefly when it is named
        if (halo) op(halo, glow(t1, B1.b6f));

        /* ---- the slide's carriers and b₆f's lit arrows give way to the story; the carriers never come back */
        const story = b === 0 ? (tt >= B1.swap ? 1 : 0) : 1;
        slideCarriers.forEach(el => op(el, 1 - story));
        const flowsOp = b === 0 ? 1 - tw(tt, B1.flowsOut[0], B1.flowsOut[1]) : 0;
        flowsE.forEach(g => op(g, flowsOp));
        const hOutOp = b === 2 ? tw(tt, B3.hOut, B3.hOut + 0.4) : flowsOp;
        hOutW.forEach(g => op(g, hOutOp));

        /* ---- plastoquinol: named (glows), docks at b₆f (beat 1) and stays there */
        const shape = mv(t1, B1.swap, 0.75), pq = lerpV(G.pq, DOCK, mv(t1, B1.dock, B1.dockD));
        put('mpq', pq, 1, story);
        set(q('mpqe'), 'rx', f1(lerp(13, 18, shape)));
        set(q('mpqe'), 'ry', f1(lerp(6.5, 9.5, shape)));
        const lt = q('mpqt');
        op(lt, shape);
        sc(lt, [0, 5], k);
        put('gpq', pq, 1, glow(t1, B1.pq));
        // its label: the slide's, then (close view) above-left with a leader; named plastoquinol, then plastoquinone again,
        // and at the zoom-out the slide's name. Each change: the old text goes, then the new comes (no overlap).
        const T3 = B3.labs;
        let w0 = 0, w1 = 0, w2 = 0;
        if (b === 0) {
          if (tt < B1.relabel) { w0 = swOut(tt, B1.pq); w1 = swIn(tt, B1.pq); } else { w1 = swOut(tt, B1.relabel); w2 = swIn(tt, B1.relabel); }
        } else if (b === 1) w2 = 1;
        else if (o.follow) w0 = 1;
        else { w2 = swOut(tt, T3); w0 = swIn(tt, T3); }
        // (m2: the label gives way while the camera follows plastocyanin, and returns in its slide form at the zoom-out)
        const pqVis = !o.follow ? 1 : b === 1 ? 1 - tw(tt, B2.go, B2.go + 0.35) : b === 2 ? swIn(tt, T3) : 1;
        const named = b === 0 ? swIn(tt, B1.pq) : 1;
        const pqL = lerpV(G.pqLab, [pq[0] + LAB.pqOff[0], pq[1] + LAB.pqOff[1]], z);
        put('lt-pq0', pqL, k, story * pqVis * w0);
        put('lt-pq1', pqL, k, story * pqVis * w1);
        put('lt-pq2', pqL, k, story * pqVis * w2);
        const pqTo: V = [pq[0] + LAB.pqTo[0], pq[1] + LAB.pqTo[1]];
        // the leader runs down from the label to plastoquinone's top (between the H⁺ it carries)
        const pqFrom = start('lt-pq0', pqL, pqTo, k, 7);
        lead('pq', pqFrom, pqTo, k, story * pqVis * named);

        /* ---- plastocyanin: named (glows), carries electron 0 to photosystem I and docks there (beat 2), and stays */
        const pc = uPc > 0 ? PC_WAY(uPc) : G.pc;
        put('mpc', pc, 1, story);
        put('gpc', pc, 1, glow(t2, B2.pc));
        const pcL: V = [pc[0] + LAB.pcOff[0], pc[1] + LAB.pcOff[1]];
        const pcLong = b === 1 ? swIn(tt, B2.pc) : b === 2 ? swOut(tt, T3) : 0;
        const pcShort = b === 1 ? swOut(tt, B2.pc) : b === 2 ? swIn(tt, T3) : 1;
        put('lt-pc0', pcL, k, story * pcShort);
        put('lt-pc1', pcL, k, story * pcLong);
        lead('pc', start('lt-pc1', pcL, [pc[0], pc[1] + 17], k, -19), [pc[0], pc[1] + 17], k, pcLong);

        /* ---- the electrons: on plastoquinol (beat 1), into b₆f; electron 0 on to plastocyanin and with it (beat 2) */
        const eShow = tw(t1, B1.pq + 0.15, B1.pq + 0.4);
        const uIn = smooth((t1 - B1.hand) / B1.eD);
        const inB6f = (i: number): V => {
          const a: V = [pq[0] + ON_PQ[i][0], pq[1] + ON_PQ[i][1]], e = E_IN[i];
          return bez(a, [(a[0] + e[0]) / 2, Math.min(a[1], e[1]) - 8], e, uIn);
        };
        const uE = (t2 - B2.e) / B2.eD;
        const e0: V = t2 < 0 ? inB6f(0) : uE < 1 ? TO_PC(smooth(uE)) : pc;
        const eOp = b === 0 ? eShow * story : 1;
        put('e0', e0, k, eOp);
        put('e1', inB6f(1), k, eOp);
        // the e⁻ label rides on electron 0 until it reaches plastocyanin
        const le = b === 0 ? tw(tt, B1.pq + 0.2, B1.pq + 0.45) : b === 1 ? 1 - tw(tt, B2.e + B2.eD - 0.05, B2.e + B2.eD + 0.15) : 0;
        put('l-e', [e0[0] + 7, e0[1] + 21], k, le);

        /* ---- plastoquinol's H⁺: ride on it, then fall into the lumen onto the slide's two H⁺ (beat 1) */
        const uH = smooth((t1 - B1.hand) / B1.hD);
        const hAt = (i: number): V => {
          const a: V = [pq[0] + H_ON[i][0], pq[1] + H_ON[i][1] - 3 * shape];
          return uH > 0 ? bez(a, H_VIA[i], G.hOut[i], uH) : a;
        };
        // the story's H⁺ hand over to the slide's own once b₆f's H⁺ arrow and marks are back (beat 3)
        const hOp = b < 2 ? story : tt < B3.hOut + 0.4 ? 1 : 0;
        [0, 1].forEach(i => put(`h${i}`, hAt(i), k * lerp(1, 12 / 9.5, uH), hOp));

        /* ---- more H⁺ collect in the lumen; photosystem I starts to light (beat 3) */
        MORE.forEach((at, i) => {
          const t0 = B3.more[i >> 1], u = mv(t3, t0, 0.55);
          put(`x${i}`, lerpV(MORE_FROM, at, u), k * lerp(0.6, 1, u), tw(t3, t0, t0 + 0.15));
        });
        psiLit.forEach(g => op(g, PSI_END * tw(t3, B3.psi, B3.psi + 0.6)));
      };
    },
  };
}

// Cytochrome b₆f on the slide 8 schema (script approved by the lecturer, 27 Oct 2026): the parts both stagings (b6f8-a,
// b6f8-b) share. The stage IS the slide 8 figure: focusSvg() of figs/chain.ts with LIT_B6F, as figs/l08c.ts draws it (8b:
// look 'glow', c2c3; 8a: look 'bil', c2c), in the slide's figure card. The camera zooms into cytochrome b₆f, the story
// plays there, and the camera zooms back out to the whole chain, which ends as on the slide, with a few more H⁺ in the
// lumen and photosystem I starting to light. Three clicks, one per beat.
// - Beat 1: zoom in; plastoquinone, carrying 2 e⁻ and 2 H⁺, docks at b₆f; its 2 H⁺ drop into the lumen (onto the slide's
//   two H⁺ marks there) and its 2 e⁻ enter b₆f.
// - Beat 2: one electron passes from b₆f to plastocyanin on the lumen side (along the slide's own e⁻ arrow), and
//   plastocyanin moves off along the lumen toward photosystem I; the other electron waits in b₆f.
// - Beat 3: zoom out to the whole chain; the story's plastoquinone and plastocyanin give way to the slide's own, the
//   slide's lit arrows come back, two more pairs of H⁺ collect in the lumen, photosystem I starts to light (60 %).
//
// How the slide figure is reused (figs/chain.ts is not modified):
// - focusSvg() wraps every part's markup in <g class="chn-on|off">. The part of each wrapper is found by drawing the
//   figure once per part with that part's lit state flipped; the wrappers are then tagged data-p="<part>", so the story
//   can hide the lit arrows of b₆f while it tells them and fade in the lit copy of photosystem I (taken from a second
//   drawing with PSI lit, so both looks light it as their slide 9 does).
// - Plastoquinone and plastocyanin are told by copies (the same ellipse, label and glow pool), so that at the end the
//   moved ones can dissolve while the slide's own come back in place. The copies sit exactly on the slide's and take
//   over once b₆f's lit arrows (drawn over the carriers on the slide) have faded, so the first frame is the slide's.
// - Positions are those of the drawing: plastoquinone, plastocyanin and the b₆f anchors from chain.ts's GEO, the H⁺
//   marks on plastoquinone and in the lumen and the two labels read from the markup.
// - The camera scales the whole schema; text, dots and atoms are counter-scaled by (s/s₀)^−0.7, as on slide 7's
//   animation (psii7-common.ts).
import './b6f8-common.css';
import { focusSvg, GEO, LIT_B6F, type FocusLook, type Part } from '../figs/chain';
import { f1, lerp, lerpV, setters, smooth, smoother, tfStr, tw, tween, type Tf, type V } from './antenna-common';
import type { Staging } from './types';

/* ---------------------------------------------------------------- the slide figure, tagged by part */

/** Parts drawn in every view (the extras of chain.ts's focus views, drawn only when lit, are found separately). */
const PARTS: Part[] = ['psii', 'light-psii', 'water', 'e-water-psii', 'e-psii-pq', 'pq', 'pq-h-in', 'e-pq-b6f', 'b6f', 'pq-h-out',
  'e-b6f-pc', 'pc', 'e-pc-psi', 'psi', 'light-psi', 'e-psi-fd', 'fd', 'e-fd-fnr', 'fnr', 'e-fnr-nadph', 'nadph', 'h-lumen', 'atps', 'atp'];
const STYLE: Record<FocusLook, string> = { bil: 'pdb-bilayer', glow: 'bil-glow' };

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
const draw8 = (id: string, look: FocusLook, lit: Part[]): string => strip(focusSvg(id, { look, lit, say: '' }));
/** The part of each wrapper of the slide 8 drawing: flip one part's lit state at a time and see which wrappers change. */
function partsOf(look: FocusLook): Array<Part | null> {
  const base = wraps(draw8('p8probe', look, LIT_B6F)), out: Array<Part | null> = base.map(() => null);
  for (const p of PARTS) {
    const alt = wraps(draw8('p8probe', look, LIT_B6F.includes(p) ? LIT_B6F.filter(x => x !== p) : [...LIT_B6F, p]));
    if (alt.length === base.length) alt.forEach((w, i) => { if (w.on !== base[i].on) out[i] = p; });
  }
  // the H⁺ riding on plastoquinone: drawn only when lit, as two small H⁺ marks
  base.forEach((w, i) => { if (out[i] === null && w.on && /class="chn-hd"[^>]*r="5\.5"/.test(w.inner)) out[i] = 'pq-h-load'; });
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

/** Where the story happens, read from the drawing (fallbacks: chain.ts's pdb layout). */
interface Geo {
  pq: V; pc: V; hem: V; cytf: V;
  /** the two H⁺ marks on plastoquinone; the two H⁺ marks in the lumen under b₆f */
  pqH: V[]; hOut: V[];
  /** the labels of plastoquinone and plastocyanin */
  pqLab: V; pcLab: V;
  /** the glow pools of plastoquinone and plastocyanin (look 'glow'): rx, ry and fill */
  pqPool?: [number, number, string]; pcPool?: [number, number, string];
}
interface Scene { svg: string; geo: Geo }
function scene(id: string, look: FocusLook): Scene {
  const base = draw8(id, look, LIT_B6F), lit = draw8(id, look, [...LIT_B6F, 'psi']);
  const parts = partsOf(look), wb = wraps(base), wl = wraps(lit);
  const inner = (p: Part): string => wb.filter((_, i) => parts[i] === p).map(w => w.inner).join('');
  let svg = '', at = 0;
  wb.forEach((w, i) => {
    const p = parts[i] ?? 'x';
    svg += `${base.slice(at, w.a)}<g class="chn-${w.on ? 'on' : 'off'}" data-p="${p}">${w.inner}</g>`;
    if (p === 'psi' && wl[i]) svg += `<g class="chn-on" data-p="psi-lit" opacity="0">${wl[i].inner}</g>`;
    at = w.b;
  });
  svg += base.slice(at);
  const { pq, pc, hem, cytf } = GEO;
  // the glow pools of look c2c3 (plastoquinone's, plastocyanin's): tagged, and a copy of each for the story's carriers
  let pqPool: Geo['pqPool'], pcPool: Geo['pcPool'];
  svg = svg.replace(new RegExp(`<ellipse cx="${NUM}" cy="${NUM}" rx="${NUM}" ry="${NUM}" fill="(url\\(#${esc(id)}-pool2?\\))"/>`, 'g'),
    (all, x: string, y: string, rx: string, ry: string, fill: string) => {
      const c: V = [Number(x), Number(y)], near = (q: V): boolean => Math.hypot(c[0] - q[0], c[1] - q[1]) < 2;
      const k = near(pq) ? 'pq' : near(pc) ? 'pc' : '';
      if (!k) return all;
      const copy = `<ellipse data-k="m${k}pool" cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${fill}" opacity="0"/>`;
      if (k === 'pq') pqPool = [Number(rx), Number(ry), fill]; else pcPool = [Number(rx), Number(ry), fill];
      return `${all.replace('<ellipse', `<ellipse data-k="${k}pool"`)}${copy}`;
    });
  const pqH = circlesOf(inner('pq-h-load'), 'chn-hd'), hOut = circlesOf(inner('pq-h-out'), 'chn-hd');
  return {
    svg,
    geo: {
      pq, pc, hem, cytf,
      pqH: pqH.length === 2 ? pqH : [[pq[0] - 8, pq[1] - 14], [pq[0] + 8, pq[1] - 14]],
      hOut: hOut.length === 2 ? hOut : [[292, 392], [307, 400]],
      pqLab: textOf(inner('pq'), 'chn-in', 'plastoquinone', [pq[0], pq[1] - 46]),
      pcLab: textOf(inner('pc'), 'chn-in', 'plastocyanin', [pc[0], pc[1] + 44]),
      pqPool, pcPool,
    },
  };
}

/* ---------------------------------------------------------------- views */

/** The whole chain: the slide's figure card (860 × 642 px around the 800 × 600 figure drawn at 0.97) fills the stage. */
const B: Tf = { s: 1.07, t: [800 - 1.07 * 400, 370 - 1.07 * 300] };
/** Cytochrome b₆f, close: plastoquinone's place on the left, plastocyanin's way to photosystem I on the right, the stroma
 *  above and the lumen below (stage ≈ figure x 74–626, y 186–441). */
const ZS = 2.9, ZC: V = [350, 313.5];
const Z: Tf = { s: ZS, t: [800 - ZS * ZC[0], 370 - ZS * ZC[1]] };
/** Text and glyph scale for a camera scale s. */
const kOf = (s: number): number => (s / B.s) ** -0.7;
/** The slide's figure card, in figure units (pilot.css .lay-figure .fig, with the paper look's fill and edge). */
const CARD = { x: -43.3, y: -30.9, w: 886.6, h: 661.9, r: 22.7 };

/* ---------------------------------------------------------------- timing (s into each beat) */

/** A move of about 1 s: 0 → 1 from t0 over d, eased at both ends. */
const mv = (t: number, t0: number, d: number): number => smoother((t - t0) / d);
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
    const d = Math.max(0, Math.min(1, u)) * L;
    let i = 1;
    while (i < acc.length - 1 && acc[i] < d) i++;
    const e = (d - acc[i - 1]) / Math.max(1e-6, acc[i] - acc[i - 1]);
    return lerpV(pts[i - 1], pts[i], e);
  };
}

// Beat 1: zoom in (1.1 s) while b₆f's lit arrows give way; the e⁻ show on plastoquinone; it docks; H⁺ drop, e⁻ enter.
const B1 = { zoom: 0.05, zoomD: 1.1, flowsOut: [0.05, 0.4], show: 0.55, labs: 0.95, dock: 1.2, dockD: 0.85, hand: 2.15, eD: 0.6, hD: 0.8, end: 3.1 };
// Beat 2: one electron to plastocyanin along the slide's arrow; plastocyanin moves off toward photosystem I.
const B2 = { e: 0.1, eD: 0.9, pc: 1.1, pcD: 1.0, end: 2.3 };
// Beat 3: zoom out; the slide's carriers and arrows return; two more H⁺ pairs; photosystem I starts to light.
const B3 = { out: 0.05, outD: 1.2, swap: 1.0, swapD: 0.4, more: [1.55, 1.9], psi: 2.05, end: 2.75 };
const TEND = [B1.end, B2.end, B3.end];
/** How lit photosystem I gets at the end: it starts to light. */
const PSI_END = 0.6;

/* ---------------------------------------------------------------- glyphs: drawn round their origin at the slide's size */

const glyph = (k: string, inner: string, o = 0): string => `<g data-k="${k}" opacity="${o}">${inner}</g>`;
const lab = (s: string, cls: string, x: number, y: number, a: 'start' | 'middle' | 'end' = 'start'): string =>
  `<text class="${cls}" x="${x}" y="${y}" text-anchor="${a}">${s}</text>`;
const B6F_NAME = 'cytochrome <tspan class="chn-it">b</tspan>₆<tspan class="chn-it">f</tspan>';
const E_DOT = '<circle class="p8-e" r="6"/>';
const hDot = (r: number): string => `<circle class="chn-hd" r="${r}"/>`;

function overlaySvg(): string {
  return `${glyph('zl-stroma', lab('stroma', 'chn-zone', 0, 0))}${glyph('zl-lumen', lab('lumen', 'chn-zone', 0, 0))}
    ${glyph('zl-b6f', lab(B6F_NAME, 'chn-name chn-halo', 0, 0, 'middle'))}
    ${glyph('mpq', '<ellipse class="chn-body chn-pq" cx="0" cy="0" rx="13.0" ry="6.5"/>')}
    ${glyph('mpc', '<ellipse class="chn-body chn-pc" cx="0" cy="0" rx="16.0" ry="16.0"/>')}
    ${glyph('mpq-l', lab('plastoquinone', 'chn-in', 0, 0, 'middle'))}${glyph('mpc-l', lab('plastocyanin', 'chn-in', 0, 0, 'middle'))}
    ${[0, 1].map(i => glyph(`h${i}`, hDot(5.5))).join('')}${[0, 1, 2, 3].map(i => glyph(`x${i}`, hDot(6.5))).join('')}
    ${[0, 1].map(i => glyph(`e${i}`, E_DOT)).join('')}
    ${glyph('l-e', lab('e⁻', 'p8-elab chn-halo', 0, 0))}${glyph('l-h', lab('H⁺', 'chn-hl chn-halo', 0, 0))}`;
}

/* ---------------------------------------------------------------- the staging */

export interface Opt { id: string; name: string; note: string; look: FocusLook }

export function makeStaging(o: Opt): Staging {
  const P = `p8${o.id}`;
  const { svg: chain, geo: G } = scene(`${P}c`, o.look);
  // where plastoquinone docks: its site in b₆f, near the lumen side of the membrane, where the slide's H⁺ arrow starts
  const DOCK: V = [G.hem[0] - 33, G.hem[1] + 5];
  // the electrons on plastoquinone (0 goes on to plastocyanin first), and where they wait in b₆f
  const ON_PQ: V[] = [[5, 0.5], [-5, 0.5]], E_IN: V[] = [[G.hem[0] + 4, G.hem[1] + 6], [G.hem[0] - 9, G.hem[1] - 4]];
  const H_ON: V[] = G.pqH.map(h => [h[0] - G.pq[0], h[1] - G.pq[1]]);
  // the H⁺ fall through b₆f's lumen side to the slide's two H⁺ marks
  const H_VIA: V[] = [[DOCK[0] - 14, 350], [DOCK[0] + 4, 356]];
  // electron 0 to plastocyanin along the slide's arrow (chain.ts e-b6f-pc), then plastocyanin toward photosystem I
  const TO_PC = walker([E_IN[0], [G.cytf[0] - 6, G.cytf[1] - 10], [G.cytf[0] + 12, G.cytf[1] + 14], [G.pc[0] - 14, G.pc[1] - 8], G.pc]);
  const PC_TO: V = [G.pc[0] + 68, G.pc[1] - 20];
  // labels of the carriers: plastoquinone's in the close view (before and after docking), plastocyanin's (slide, close)
  const PQLZ: V[] = [[0, -40], [-52, -32]];
  const PCL0: V = [G.pcLab[0] - G.pc[0], G.pcLab[1] - G.pc[1]], PCLZ: V = [0, 33];
  // two more pairs of H⁺ in the lumen, round the slide's two
  const MORE: V[] = [[277, 407], [294, 415], [323, 390], [321, 411]];
  const ZL = { stroma: [86, 208] as V, lumen: [86, 432] as V, b6f: [G.hem[0], 244] as V };

  return {
    id: o.id,
    name: o.name,
    note: o.note,
    holds: [[0]],
    svg: () => `
      <g data-k="cam"><g class="fig">
        <defs><filter id="${P}-sl" x="-5%" y="-5%" width="110%" height="112%"><feDropShadow dx="0" dy="8" stdDeviation="9" flood-color="#46321a" flood-opacity=".14"/></filter></defs>
        <rect class="p8-slidecard" x="${CARD.x}" y="${CARD.y}" width="${CARD.w}" height="${CARD.h}" rx="${CARD.r}" filter="url(#${P}-sl)"/>
        <g data-k="chain" class="chn chn-${STYLE[o.look]} chn-fx">${chain}</g>
        ${overlaySvg()}
      </g></g>`,

    bind(stage) {
      const S = setters(stage), { q, set, op } = S;
      const chainG = q('chain');
      const parts = (p: string): SVGGElement[] => Array.from(chainG.querySelectorAll<SVGGElement>(`[data-p="${p}"]`));
      const texts = Array.from(chainG.querySelectorAll<SVGTextElement>('text')).map(el => ({ el, x: Number(el.getAttribute('x')), y: Number(el.getAttribute('y')) }));
      const hds = Array.from(chainG.querySelectorAll<SVGCircleElement>('circle.chn-hd')).map(el => ({ el, r: Number(el.getAttribute('r')) }));
      const flows = ['e-pq-b6f', 'e-b6f-pc'].flatMap(parts), hOutW = parts('pq-h-out');
      const carrierW = ['pq', 'pc'].flatMap(parts), carrierText = carrierW.filter(g => g.querySelector('text'));
      const carrierBody: Element[] = [...carrierW.filter(g => !g.querySelector('text')), ...parts('pq-h-load')];
      for (const k of ['pqpool', 'pcpool']) { const el = q(k); if (el) carrierBody.push(el); }
      const mpqPool = q('mpqpool'), mpcPool = q('mpcpool'), psiLit = parts('psi-lit');
      /** A glyph at figure point at, scaled sc, at opacity o. */
      const put = (k: string, at: V, sc: number, o: number): void => {
        const el = q(k);
        op(el, o);
        if (o > 0.004) set(el, 'transform', `translate(${f1(at[0])} ${f1(at[1])}) scale(${sc.toFixed(4)})`);
      };
      const shift = (el: Element | null, d: V, o: number): void => {
        if (!el) return;
        op(el, o);
        set(el, 'transform', `translate(${d[0].toFixed(2)} ${d[1].toFixed(2)})`);
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

        /* ---- camera: in with beat 1, out with beat 3 */
        const zoom = mv(t1, B1.zoom, B1.zoomD) * (1 - mv(t3, B3.out, B3.outD));
        const cam = tween(B, Z, zoom), k = kOf(cam.s);
        set(q('cam'), 'transform', tfStr(cam));
        texts.forEach(({ el, x, y }) => set(el, 'transform', `matrix(${k.toFixed(4)},0,0,${k.toFixed(4)},${(x * (1 - k)).toFixed(2)},${(y * (1 - k)).toFixed(2)})`));
        hds.forEach(({ el, r }) => set(el, 'r', (r * k).toFixed(2)));
        // labels that only the close view needs (the slide's own are out of view there)
        const zl = tw(t1, B1.labs, B1.labs + 0.25) * (1 - tw(t3, B3.out, B3.out + 0.3));
        put('zl-stroma', ZL.stroma, k, zl);
        put('zl-lumen', ZL.lumen, k, zl);
        put('zl-b6f', ZL.b6f, k, zl);

        /* ---- the slide's own carriers and lit arrows of b₆f give way to the story, and come back at the end */
        const story = b < 2 ? 1 : 1 - tw(tt, B3.swap, B3.swap + B3.swapD);
        // the bodies change over once the lit arrows (drawn over them on the slide) are gone, so the first frame is the slide's
        const storyB = b === 0 ? (tt >= B1.flowsOut[1] ? 1 : 0) : story;
        // the story carriers' labels leave with the close view's, so that the moved ones never stand beside the slide's
        const storyLab = story * (1 - tw(t3, B3.out, B3.out + 0.3));
        carrierText.forEach(el => op(el, 1 - story));
        carrierBody.forEach(el => op(el, 1 - storyB));
        const flowsOp = b === 0 ? 1 - tw(tt, B1.flowsOut[0], B1.flowsOut[1]) : b === 1 ? 0 : tw(tt, B3.swap, B3.swap + B3.swapD);
        flows.forEach(g => op(g, flowsOp));
        hOutW.forEach(g => op(g, flowsOp));

        /* ---- plastoquinone: docks at b₆f (beat 1) */
        const dock = mv(t1, B1.dock, B1.dockD), pqAt = lerpV(G.pq, DOCK, dock);
        put('mpq', pqAt, 1, storyB);
        shift(mpqPool, [pqAt[0] - G.pq[0], pqAt[1] - G.pq[1]], storyB);
        // its label: in the close view above plastoquinone, then, as it docks, left of b₆f
        const pqlZ = lerpV([G.pq[0] + PQLZ[0][0], G.pq[1] + PQLZ[0][1]], [DOCK[0] + PQLZ[1][0], DOCK[1] + PQLZ[1][1]], dock);
        put('mpq-l', lerpV(G.pqLab, pqlZ, zoom), k, storyLab);

        /* ---- plastocyanin: moves off toward photosystem I (beat 2) */
        const pcAt = lerpV(G.pc, PC_TO, mv(t2, B2.pc, B2.pcD));
        put('mpc', pcAt, 1, storyB);
        shift(mpcPool, [pcAt[0] - G.pc[0], pcAt[1] - G.pc[1]], storyB);
        const pcl = lerpV(PCL0, PCLZ, zoom);
        put('mpc-l', [pcAt[0] + pcl[0], pcAt[1] + pcl[1]], k, storyLab);

        /* ---- the electrons: on plastoquinone, into b₆f (beat 1); electron 0 on to plastocyanin and with it (beat 2) */
        const show = tw(t1, B1.show, B1.show + 0.25);
        const uIn = smooth((t1 - B1.hand) / B1.eD);
        const inB6f = (i: number): V => {
          const a: V = [pqAt[0] + ON_PQ[i][0], pqAt[1] + ON_PQ[i][1]], z = E_IN[i];
          return bez(a, [(a[0] + z[0]) / 2, Math.min(a[1], z[1]) - 6], z, uIn);
        };
        const uPc = (t2 - B2.e) / B2.eD;
        const e0: V = t2 < 0 ? inB6f(0) : uPc < 1 ? TO_PC(smooth(uPc)) : pcAt;
        const eOp = b === 0 ? show : story;
        put('e0', e0, k, eOp);
        put('e1', inB6f(1), k, eOp);
        // the e⁻ label rides on electron 0 until it reaches plastocyanin
        const le = b === 0 ? tw(tt, B1.show + 0.05, B1.show + 0.3) : b === 1 ? 1 - tw(tt, B2.e + B2.eD - 0.05, B2.e + B2.eD + 0.15) : 0;
        put('l-e', [e0[0] + 6, e0[1] + 17], k, le);

        /* ---- plastoquinone's H⁺: ride on it, then fall into the lumen onto the slide's two H⁺ marks (beat 1) */
        const uH = smooth((t1 - B1.hand) / B1.hD);
        const hAt = (i: number): V => {
          const a: V = [pqAt[0] + H_ON[i][0], pqAt[1] + H_ON[i][1]];
          return uH > 0 ? bez(a, H_VIA[i], G.hOut[i], uH) : a;
        };
        // the story's H⁺ hand over to the slide's marks once those are back (beat 3)
        const hOp = b === 0 ? storyB : b === 1 ? 1 : 1 - tw(tt, B3.swap + B3.swapD, B3.swap + B3.swapD + 0.01);
        [0, 1].forEach(i => put(`h${i}`, hAt(i), k * lerp(1, 6.5 / 5.5, uH), hOp));
        const lh = b === 0 ? tw(tt, B1.show + 0.05, B1.show + 0.3) : b === 1 ? 1 : 1 - tw(tt, B3.out, B3.out + 0.3);
        const h1 = hAt(1);
        put('l-h', [h1[0] + 9, h1[1] + 4], k, lh);

        /* ---- more H⁺ collect in the lumen; photosystem I starts to light (beat 3) */
        MORE.forEach((at, i) => {
          const u = tw(t3, B3.more[i >> 1], B3.more[i >> 1] + 0.2);
          put(`x${i}`, at, k * lerp(0.5, 1, u), u);
        });
        psiLit.forEach(g => op(g, PSI_END * tw(t3, B3.psi, B3.psi + 0.6)));
      };
    },
  };
}

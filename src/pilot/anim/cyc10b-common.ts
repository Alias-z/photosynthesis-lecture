// Cyclic electron flow on the slide 10b schema (script approved by the lecturer, 28 Oct 2026): the parts both stagings
// (cyc10b-a, cyc10b-b) share. The stage IS the slide 10b figure: focusSvg() of figs/chain.ts with the cycle lit
// (LIT_CYCLIC), drawn in the slide's figure card. A readout box beside the card's stroma corner is the only addition.
// - Beat 1 (opens on the slide figure; one click): the readout appears, two bar pairs, linear flow 2.6 ATP : 2 NADPH and
//   CO₂ fixation's need 3 ATP : 2 NADPH; the missing 0.4 ATP of linear flow is a dashed gap.
// - Beat 2: zoom onto photosystem I, ferredoxin and cytochrome b₆f (ATP synthase and its H⁺ dim). Light at photosystem I;
//   its electron goes to ferredoxin, then back along the "cyclic flow" arrow to plastoquinone (not to FNR, which stays
//   dim); plastoquinone takes 2 H⁺ from the stroma, moves to b₆f and releases them into the lumen along the slide's arrow;
//   the electron goes on through b₆f and plastocyanin back to photosystem I, refilling its empty place; plastoquinone
//   returns to its place. No NADPH is made.
// - Beat 3: a newsprint clipping of Munekage et al. 2004's plants (wild type, double mutant) appears on the right.
// - Beat 4: the clipping goes; zoom out to the whole chain; ATP synthase lights up again; the readout's linear-flow ATP bar
//   grows from 2.6 to 3 (the added part lighter) while NADPH stays at 2. The end frame is the slide plus the readout.
//
// How the slide figure is reused (figs/chain.ts is not modified):
// - focusSvg() wraps every part's markup in <g class="chn-on|off">. The part of each wrapper is found by drawing the view
//   once per part with only that part lit (plus the two parts drawn only when lit, e-fd-pq and pq-h-load, so the
//   wrappers line up); the wrappers are then tagged data-p="<part>". ATP synthase, its H⁺ path and ATP also get their
//   dimmed copy (from a second drawing without them lit) right under the lit one, so the story can dim them and light
//   them up again exactly as the slides draw them.
// - The electron and H⁺ run along the slide's own arrows: the paths are sampled from the drawing (e-psi-fd, e-fd-pq,
//   e-b6f-pc, e-pc-psi, pq-h-out); the anchors (P700, ferredoxin, plastoquinone, b₆f hemes, plastocyanin) are GEO of
//   chain.ts, the same that draws them.
// - In the close view the dimmed H⁺ uptake at photosystem II's Q_B site (pq-h-in) gives way to plastoquinone's label;
//   it comes back with the zoom out, like the H⁺ marks the story takes over.
// - The camera scales the whole schema; text, dots and glyphs are counter-scaled by (s/s₀)^−0.7, as in psii7-common.ts.
//
// Image: munekage2004-plants.png (assets/anim/cyclic), Munekage et al. 2004, Nature 429: 579, Fig. 2, restyled as a
// newspaper halftone with the paper's genotype labels taken out (scripts/cyclic_anim_assets.py); the card sets two labels
// where the paper has WT and crr2-2 pgr5.
import '../figs/clipping.css';
import './cyc10b-common.css';
import plantsImg from '../../assets/anim/cyclic/munekage2004-plants.png';
import { focusSvg, GEO, LIT_CYCLIC, type FocusLook, type Part } from '../figs/chain';
import { cutPath, f1, lerp, lerpV, setters, smooth, smoother, tfStr, tw, tween, type Tf, type V } from './antenna-common';
import type { Staging } from './types';

/* ---------------------------------------------------------------- the slide figure, tagged by part */

/** Parts drawn only when lit: lit in every drawing, so that all drawings have the same wrappers. */
const ALWAYS: Part[] = ['e-fd-pq', 'pq-h-load'];
const PARTS: Part[] = ['psii', 'light-psii', 'water', 'e-water-psii', 'e-psii-pq', 'pq', 'pq-h-in', 'e-pq-b6f', 'b6f', 'pq-h-out',
  'e-b6f-pc', 'pc', 'e-pc-psi', 'psi', 'light-psi', 'e-psi-fd', 'fd', 'e-fd-fnr', 'fnr', 'e-fnr-nadph', 'nadph', 'h-lumen', 'atps', 'atp'];
/** Lit on the slide, dimmed while the camera is in, lit again in beat 4. */
const ATP_SIDE: Part[] = ['h-lumen', 'atps', 'atp'];

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
const esc = (s: string): string => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const NUM = '(-?[\\d.]+)';
/** The slide 10b view (figs/l11c.ts, 11a and 11b) with `lit` lit, without its <svg> wrapper. */
const view = (id: string, look: FocusLook, lit: Part[]): string => strip(focusSvg(id, { look, lit, say: '' }));

/** The part of each wrapper: draw the view with one part lit at a time. */
function partsOf(look: FocusLook): Array<Part | null> {
  const probe = (lit: Part[]): Wrap[] => wraps(view('c10probe', look, [...ALWAYS, ...lit]));
  const base = probe([]);
  // the two always-lit parts: the H⁺ marks on plastoquinone (dots only) and the cyclic route (its arrow and its label)
  const out: Array<Part | null> = base.map(w => (!w.on ? null : /^(\s*<circle class="chn-hd"[^>]*\/>)+\s*$/.test(w.inner) ? 'pq-h-load' : 'e-fd-pq'));
  for (const p of PARTS) probe([p]).forEach((w, i) => { if (w.on && base[i] && !base[i].on) out[i] = p; });
  return out;
}

function scene(id: string, look: FocusLook): string {
  const base = view(id, look, LIT_CYCLIC), dim = view(id, look, LIT_CYCLIC.filter(p => !ATP_SIDE.includes(p)));
  const parts = partsOf(look), wb = wraps(base), wd = wraps(dim);
  let svg = '', at = 0;
  wb.forEach((w, i) => {
    const p = parts[i] ?? 'x';
    svg += base.slice(at, w.a);
    if ((ATP_SIDE as string[]).includes(p) && wd[i]) svg += `<g class="chn-off" data-p="${p}-dim" display="none">${wd[i].inner}</g>`;
    svg += `<g class="chn-${w.on ? 'on' : 'off'}" data-p="${p}">${w.inner}</g>`;
    at = w.b;
  });
  svg += base.slice(at);
  // look c2c3: plastoquinone's glow pool moves with it
  return svg.replace(new RegExp(`<ellipse cx="${NUM}" cy="${NUM}"([^>]*)fill="url\\(#${esc(id)}-pool\\)"/>`, 'g'),
    (all, x: string, y: string) => (Math.hypot(Number(x) - GEO.pq[0], Number(y) - GEO.pq[1]) < 2 ? all.replace('<ellipse', '<ellipse data-k="pqpool"') : all));
}

/* ---------------------------------------------------------------- views */

/** The whole chain: the slide's figure card (860 × 642 px around the 800 × 600 figure drawn at 0.97) fills the stage. */
const B: Tf = { s: 1.07, t: [800 - 1.07 * 400, 370 - 1.07 * 300] };
/** The cycle, close: figure x 130–797, y 148–456 (plastoquinone to ferredoxin, the stroma H⁺ to plastocyanin and the
 *  slide's "lumen"), with the right third (FNR, ATP synthase) free for the clipping. */
const Z: Tf = { s: 2.4, t: [-130 * 2.4, -148 * 2.4] };
/** Text and glyph scale for a camera scale s. */
const kOf = (s: number): number => (s / B.s) ** -0.7;
/** The slide's figure card, in figure units (pilot.css .lay-figure .fig, with the paper look's fill and edge). */
const CARD = { x: -43.3, y: -30.9, w: 886.6, h: 661.9, r: 22.7 };

/* ---------------------------------------------------------------- timing (s into each beat) */

/** A move of about 1 s: 0 → 1 from t0 over d, eased at both ends. */
const mv = (t: number, t0: number, d: number): number => smoother((t - t0) / d);
/** A short pulse: up over 0.12 s from t0, down by t0 + 0.6. */
const pulse = (t: number, t0: number): number => tw(t, t0, t0 + 0.12) * (1 - tw(t, t0 + 0.25, t0 + 0.6));

// Beat 1: the readout appears whole, its bars grow, the gap shows.
const B1 = { box: 0.05, bars: 0.35, barsD: 0.9, gap: 1.25, end: 1.6 };
// Beat 2: zoom in; light; the electron's loop (jump → Fd → PQ → b₆f → PC → PSI, 1.65–4.25 s); plastoquinone's trip.
const B2 = {
  zoom: 0.05, zoomD: 1.1, away: 0.05, awayD: 0.35, zl: 0.95, light: 1.15, lightD: 0.45, rc: 1.2, flash: 1.55,
  jump: 1.65, aD: 0.35, b: 2.05, bD: 0.65, hIn: 2.25, hMove: 2.35, hD: 0.45, go: 2.9, goD: 0.45,
  rel: 3.4, relD: 0.5, d: 3.4, dD: 0.5, e: 3.95, eD: 0.3, back: 3.95, backD: 0.45, end: 4.6,
};
// Beat 3: the clipping.
const B3 = { card: 0, end: 0.5 };
// Beat 4: the clipping goes; zoom out; the readout returns; ATP synthase lights up; the ATP bar grows.
const B4 = { cardOut: 0, out: 0.2, outD: 1.2, ro: 1.15, atp: 1.5, atpD: 0.6, grow: 2.15, growD: 0.9, end: 3.3 };
const TEND = [B1.end, B2.end, B3.end, B4.end];

/* ---------------------------------------------------------------- glyphs: drawn round their origin at the slide's size */

const glyph = (k: string, inner: string, o = 0): string => `<g data-k="${k}" opacity="${o}" display="none">${inner}</g>`;
const lab = (s: string, cls: string, x: number, y: number, a: 'start' | 'middle' | 'end' = 'start'): string =>
  `<text class="${cls}" x="${x}" y="${y}" text-anchor="${a}">${s}</text>`;
const E_DOT = '<circle class="c10-e" r="6"/>';
const H_DOT = '<circle class="chn-hd" r="6.5"/>';
const B6F = 'cytochrome <tspan class="chn-it">b</tspan>₆<tspan class="chn-it">f</tspan>';

function overlaySvg(p: string): string {
  return `<defs><radialGradient id="${p}-rcglow"><stop offset="0" stop-color="#fff4d6"/><stop offset=".4" stop-color="#f6c453" stop-opacity=".9"/><stop offset="1" stop-color="#f0a316" stop-opacity="0"/></radialGradient>
      <clipPath id="${p}-lclip"><rect data-k="lclip" x="-200" y="-200" width="1200" height="1200"/></clipPath></defs>
    ${glyph('zl-stroma', lab('stroma', 'chn-zone', 0, 0))}
    ${glyph('zl-psi', lab('photosystem I', 'chn-name', 0, 0, 'middle'))}${glyph('zl-b6f', lab(B6F, 'chn-name', 0, 0, 'middle'))}
    ${glyph('zl-light', lab('light', 'chn-light', 0, 0, 'end'))}
    ${glyph('rcglow', `<circle r="24" fill="url(#${p}-rcglow)"/>`)}${glyph('rcring', '<circle class="c10-ring" r="7.5"/>')}
    ${[0, 1].map(i => glyph(`h${i}`, H_DOT)).join('')}${glyph('el', E_DOT)}
    ${glyph('l-sh', lab('H⁺', 'chn-hl chn-halo', 0, 0))}
    ${glyph('l-e', lab('e⁻', 'c10-elab chn-halo', -8, -8, 'end'))}`;
}

/* ---------------------------------------------------------------- the readout: ATP : NADPH (stage units) */

const RO = { x: 1300, y: 44, w: 280, pad: 18 };
/** Bar length per ATP or NADPH: 3 ATP fill the box's inner width. */
const PER = 80;
/** Rows: linear flow, CO₂ fixation; each a two-line text and an ATP bar over an NADPH bar. */
const ROW = [{ y: RO.y + RO.pad, l1: 'linear flow:', atp: '2.6', nadph: '2', a: 2.6 }, { y: RO.y + RO.pad + 111, l1: 'CO₂ fixation needs:', atp: '3', nadph: '2', a: 3 }];
function readoutSvg(p: string): string {
  const x0 = RO.x + RO.pad, h = 200 + 2 * RO.pad;
  const rows = ROW.map((r, i) => `${lab(r.l1, 'c10-ro1', x0, r.y + 19)}
    <text class="c10-ro2" x="${x0}" y="${r.y + 44}"><tspan class="c10-atp">${r.atp} ATP</tspan> : <tspan class="c10-nadph">${r.nadph} NADPH</tspan></text>
    <rect class="c10-bar-atp" data-k="ro-a${i}" x="${x0}" y="${r.y + 56}" width="${r.a * PER}" height="14" rx="3"/>
    <rect class="c10-bar-nadph" data-k="ro-n${i}" x="${x0}" y="${r.y + 75}" width="${2 * PER}" height="14" rx="3"/>`).join('');
  const gx = x0 + 2.6 * PER, gy = ROW[0].y + 56;
  return `<g data-k="ro" opacity="0" display="none">
    <defs><filter id="${p}-rosh" x="-10%" y="-10%" width="120%" height="125%"><feDropShadow dx="0" dy="6" stdDeviation="7" flood-color="#46321a" flood-opacity=".12"/></filter></defs>
    <rect class="c10-robox" x="${RO.x}" y="${RO.y}" width="${RO.w}" height="${h}" rx="16" filter="url(#${p}-rosh)"/>${rows}
    <rect class="c10-bar-extra" data-k="ro-x" x="${gx}" y="${gy}" width="0" height="14"/>
    <rect class="c10-gap" data-k="ro-gap" x="${gx}" y="${gy + 0.8}" width="${0.4 * PER - 0.8}" height="12.4" rx="2"/></g>`;
}

/* ---------------------------------------------------------------- the clipping: Munekage et al. 2004 (stage units) */

const CD = { x: 1076, y: 170, w: 514, m: 22 };
/** The photo: crop x 30–572, y 19–429 of the board image, at 2 px per board px (scripts/cyclic_anim_assets.py). */
const PH = { x0: 30, y0: 19, w: 542, ar: 820 / 1084 };
function cardSvg(p: string): string {
  const pw = CD.w - 2 * CD.m, ph = pw * PH.ar, h = ph + 2 * CD.m, px = CD.x + CD.m, py = CD.y + CD.m, sc = pw / PH.w;
  // a board-image point on the stage
  const at = (bx: number, by: number): V => [px + (bx - PH.x0) * sc, py + (by - PH.y0) * sc];
  const wt = at(203, 148), dm = at(426, 178);
  return `<g data-k="card" opacity="0" display="none"><g transform="rotate(-1.2 ${f1(CD.x + CD.w / 2)} ${f1(CD.y + h / 2)})">
    <defs><filter id="${p}-cardsh" x="-10%" y="-8%" width="120%" height="118%"><feDropShadow dx="1" dy="4" stdDeviation="6" flood-color="#3d3020" flood-opacity=".22"/></filter></defs>
    <path class="clip-paper" d="${cutPath(CD.x, CD.y, CD.w, h, 41, 3.2)}" filter="url(#${p}-cardsh)"/>
    <image href="${plantsImg}" x="${f1(px)}" y="${f1(py)}" width="${f1(pw)}" height="${f1(ph)}"/>
    ${lab('wild type', 'c10-plab', Number(f1(wt[0])), Number(f1(wt[1])), 'end')}
    ${lab('double', 'c10-plab', Number(f1(dm[0])), Number(f1(dm[1])))}${lab('mutant', 'c10-plab', Number(f1(dm[0])), Number(f1(dm[1] + 24)))}</g></g>`;
}

/* ---------------------------------------------------------------- paths */

/** Points along a polyline by arc length, u in 0–1. */
function along(pts: V[], u: number): V {
  const L: number[] = [0];
  for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const s = Math.max(0, Math.min(1, u)) * L[L.length - 1];
  let i = 1;
  while (i < L.length - 1 && L[i] < s) i++;
  const e = L[i] > L[i - 1] ? (s - L[i - 1]) / (L[i] - L[i - 1]) : 1;
  return lerpV(pts[i - 1], pts[i], Math.max(0, Math.min(1, e)));
}
/** An svg path of the drawing, sampled (it is drawn in figure units, untransformed). */
function sample(el: SVGPathElement | null, n = 40): V[] {
  if (!el) return [];
  const L = el.getTotalLength(), out: V[] = [];
  for (let i = 0; i <= n; i++) { const q = el.getPointAtLength((L * i) / n); out.push([q.x, q.y]); }
  return out;
}

/* ---------------------------------------------------------------- the staging */

export interface Opt { id: string; name: string; note: string; look: FocusLook }

export function makeStaging(o: Opt): Staging {
  const P = `c10${o.id}`;
  const chain = scene(`${P}c`, o.look);
  const { pq: PQ, hem: HEM, pc: PC, p700: P700, fd: FD } = GEO;
  // plastoquinone docks in b₆f, beside its hemes; what rides on it (relative to its centre)
  const DOCK: V = [HEM[0] - 26, HEM[1] - 3];
  const ON_PQ: V = [5, 0.5], H_ON_PQ: V[] = [[-8, -12], [8, -12]];
  // the 2 H⁺ come down from the stroma straight above plastoquinone
  const H_FROM: V[] = [[PQ[0] - 6, 186], [PQ[0] + 10, 176]];
  // plastoquinone's label: as on the slide (above it), and in the close view up and to its left, clear of the H⁺ coming in
  const LAB_OFFZ: V = [-60, -34];

  return {
    id: o.id,
    name: o.name,
    note: o.note,
    holds: [[0]],
    svg: () => `
      <g data-k="cam"><g class="fig">
        <defs><filter id="${P}-sl" x="-5%" y="-5%" width="110%" height="112%"><feDropShadow dx="0" dy="8" stdDeviation="9" flood-color="#46321a" flood-opacity=".14"/></filter></defs>
        <rect class="c10-slidecard" x="${CARD.x}" y="${CARD.y}" width="${CARD.w}" height="${CARD.h}" rx="${CARD.r}" filter="url(#${P}-sl)"/>
        <g data-k="chain" class="chn chn-${o.look === 'glow' ? 'bil-glow' : 'pdb-bilayer'} chn-fx">${chain}</g>
        ${overlaySvg(P)}
      </g></g>
      ${readoutSvg(P)}
      ${cardSvg(P)}`,

    bind(stage) {
      const S = setters(stage), { q, set, op } = S;
      const chainG = q('chain');
      const parts = (p: string): SVGGElement[] => Array.from(chainG.querySelectorAll<SVGGElement>(`[data-p="${p}"]`));
      const texts = Array.from(chainG.querySelectorAll<SVGTextElement>('text')).map(el => ({ el, x: Number(el.getAttribute('x')), y: Number(el.getAttribute('y')) }));
      const hds = Array.from(chainG.querySelectorAll<SVGCircleElement>('circle.chn-hd')).map(el => ({ el, r: Number(el.getAttribute('r')) }));
      const lightW = parts('light-psi');
      lightW.forEach(g => g.setAttribute('clip-path', `url(#${P}-lclip)`));
      const atpLit = ATP_SIDE.flatMap(parts), atpDim = ATP_SIDE.flatMap(p => parts(`${p}-dim`));
      const pqW = parts('pq'), pqBody = pqW.filter(g => !g.querySelector('text')), pqText = pqW.filter(g => g.querySelector('text'));
      const pqLab0 = pqText[0]?.querySelector('text');
      const PQLAB: V = pqLab0 ? [Number(pqLab0.getAttribute('x')), Number(pqLab0.getAttribute('y'))] : [PQ[0], PQ[1] - 46];
      const LAB_OFF0: V = [PQLAB[0] - PQ[0], PQLAB[1] - PQ[1]];
      const pool = chainG.querySelector('[data-k="pqpool"]');
      const load = parts('pq-h-load'), hIn = parts('pq-h-in');
      const outDots = Array.from(chainG.querySelectorAll<SVGCircleElement>('[data-p="pq-h-out"] circle.chn-hd'));
      const HOUT: V[] = outDots.length === 2 ? outDots.map(c => [Number(c.getAttribute('cx')), Number(c.getAttribute('cy'))] as V) : [[292, 392], [307, 400]];
      // the electron's legs along the slide's arrows, and the H⁺ path into the lumen
      const path = (p: string, cls: string): SVGPathElement | null => chainG.querySelector<SVGPathElement>(`[data-p="${p}"] path.${cls}`);
      const onPq = (c: V): V => [c[0] + ON_PQ[0], c[1] + ON_PQ[1]];
      const LEG_A: V[] = [P700, ...sample(path('e-psi-fd', 'chn-e')), FD];
      const LEG_B: V[] = [FD, ...sample(path('e-fd-pq', 'chn-e'), 60), onPq(PQ)];
      const LEG_D: V[] = [onPq(DOCK), HEM, ...sample(path('e-b6f-pc', 'chn-e')), PC];
      const LEG_E: V[] = [PC, ...sample(path('e-pc-psi', 'chn-e')), P700];
      const hPath = sample(path('pq-h-out', 'chn-h'));
      const LEG_H: V[][] = [0, 1].map(i => [[DOCK[0] + H_ON_PQ[i][0], DOCK[1] + H_ON_PQ[i][1]] as V, ...hPath, HOUT[i]]);
      /** A glyph at figure point at, scaled sc, at opacity o. */
      const put = (k: string, at: V, sc: number, o: number): void => {
        const el = q(k);
        op(el, o);
        if (o > 0.004) set(el, 'transform', `translate(${f1(at[0])} ${f1(at[1])}) scale(${sc.toFixed(4)})`);
      };
      const shift = (els: Element[], d: V): void => els.forEach(el => set(el, 'transform', `translate(${d[0].toFixed(2)} ${d[1].toFixed(2)})`));

      let last = '';
      return (beatIn, t) => {
        const b = Math.max(0, Math.min(3, Math.round(beatIn)));
        const tt = Math.max(0, Math.min(t, TEND[b]));
        const key = `${b}:${tt.toFixed(3)}`;
        if (key === last) return;
        last = key;
        /** Seconds into beat n: −1 before it begins, 99 after it. */
        const T = (n: number): number => (b === n ? tt : b > n ? 99 : -1);
        const t1 = T(0), t2 = T(1), t3 = T(2), t4 = T(3);
        void t3;

        /* ---- camera: in with beat 2, out in beat 4 */
        const zoom = mv(t2, B2.zoom, B2.zoomD) * (1 - mv(t4, B4.out, B4.outD));
        const cam = tween(B, Z, zoom), k = kOf(cam.s);
        set(q('cam'), 'transform', tfStr(cam));
        texts.forEach(({ el, x, y }) => set(el, 'transform', `matrix(${k.toFixed(4)},0,0,${k.toFixed(4)},${(x * (1 - k)).toFixed(2)},${(y * (1 - k)).toFixed(2)})`));
        hds.forEach(({ el, r }) => set(el, 'r', (r * k).toFixed(2)));
        // labels only the close view needs (the slide's own are out of view there)
        const zl = tw(t2, B2.zl, B2.zl + 0.25) * (1 - tw(t4, B4.out, B4.out + 0.3));
        put('zl-stroma', [136, 174], k, zl);
        put('zl-psi', [530, 374], k, zl);
        put('zl-b6f', [310, 418], k, zl);
        /** What only the story shows: gone as the camera goes back out. */
        const story = 1 - tw(t4, B4.out, B4.out + 0.3);
        /** The slide's own marks that the story takes over: away as the camera goes in, back as it comes out. */
        const slideOwn = b === 0 ? 1 : b === 1 ? 1 - tw(tt, B2.away, B2.away + B2.awayD) : b === 2 ? 0 : tw(tt, B4.out + 0.5, B4.out + 1.0);

        /* ---- ATP synthase, its H⁺ and ATP: dim while the camera is in, light up in beat 4 */
        const atpOn = b === 0 ? 1 : b === 1 ? 1 - tw(tt, B2.away, B2.away + 0.4) : b === 2 ? 0 : tw(tt, B4.atp, B4.atp + B4.atpD);
        atpLit.forEach(g => op(g, atpOn));
        atpDim.forEach(g => op(g, atpOn >= 0.996 ? 0 : 1));

        /* ---- light at photosystem I: the slide's wave, cleared, then drawn in from above; it stays */
        let lOp = 1, lY = 1000;
        if (b === 1) {
          if (tt < B2.light - 0.05) lOp = 1 - tw(tt, B2.away, B2.away + B2.awayD);
          else lY = lerp(90, 250, smooth((tt - B2.light) / B2.lightD));
        }
        lightW.forEach(g => op(g, lOp));
        set(q('lclip'), 'height', f1(lY + 200));
        put('zl-light', [420, 182], k, b === 1 ? tw(tt, B2.light + 0.1, B2.light + 0.3) : b === 2 ? 1 : b === 3 ? story : 0);

        /* ---- plastoquinone: to b₆f and back (beat 2) */
        const go = mv(t2, B2.go, B2.goD), back = mv(t2, B2.back, B2.backD);
        const pq = back > 0 ? lerpV(DOCK, PQ, back) : lerpV(PQ, DOCK, go);
        const dPq: V = [pq[0] - PQ[0], pq[1] - PQ[1]];
        shift(pqBody, dPq);
        if (pool) shift([pool], dPq);
        const lo = lerpV(LAB_OFF0, LAB_OFFZ, zoom);
        shift(pqText, [pq[0] + lo[0] - PQLAB[0], pq[1] + lo[1] - PQLAB[1]]);
        // the slide's H⁺ marks on plastoquinone and in the lumen at b₆f: the story's H⁺ take their place
        load.forEach(g => op(g, slideOwn));
        // the dimmed uptake at photosystem II's Q_B site gives way in the close view, where plastoquinone's label goes
        hIn.forEach(g => op(g, slideOwn));
        outDots.forEach(c => op(c, b === 3 ? 1 : slideOwn));

        /* ---- the electron: from P700 to ferredoxin, back to plastoquinone, with it to b₆f, through plastocyanin to P700 */
        const fl = b === 1 ? pulse(tt, B2.flash) : 0;
        put('rcglow', P700, k, fl);
        const home = B2.e + B2.eD;
        put('rcring', P700, k, b === 1 ? tw(tt, B2.jump + 0.05, B2.jump + 0.15) * (1 - tw(tt, home - 0.05, home)) : 0);
        let e: V = P700, eOp = 0;
        if (b === 1) {
          eOp = tw(tt, B2.rc, B2.rc + 0.2);
          if (tt < B2.jump) e = P700;
          else if (tt < B2.b) e = along(LEG_A, smooth((tt - B2.jump) / B2.aD));
          else if (tt < B2.d) e = tt < B2.b + B2.bD ? along(LEG_B, smooth((tt - B2.b) / B2.bD)) : onPq(pq);
          else if (tt < B2.e) e = along(LEG_D, smooth((tt - B2.d) / B2.dD));
          else e = along(LEG_E, smooth((tt - B2.e) / B2.eD));
        } else if (b > 1) { e = P700; eOp = b === 3 ? story : 1; }
        put('el', e, k, eOp);
        // its label gives way while the H⁺ sit on plastoquinone beside it
        const eLab = b === 1 ? tw(tt, B2.rc, B2.rc + 0.2) * (1 - tw(tt, B2.hMove + B2.hD - 0.2, B2.hMove + B2.hD - 0.05) * (1 - tw(tt, B2.d + 0.05, B2.d + 0.2))) : b === 2 ? 1 : b === 3 ? story : 0;
        put('l-e', e, k, eLab);

        /* ---- 2 H⁺: from the stroma onto plastoquinone, with it to b₆f, out into the lumen */
        [0, 1].forEach(i => {
          let h: V = H_FROM[i], hOp = 0;
          const onIt: V = [pq[0] + H_ON_PQ[i][0], pq[1] + H_ON_PQ[i][1]];
          if (b === 1) {
            hOp = tw(tt, B2.hIn, B2.hIn + 0.15);
            const r0 = B2.rel + i * 0.1;
            if (tt < B2.hMove + B2.hD) h = lerpV(H_FROM[i], onIt, smooth((tt - B2.hMove) / B2.hD));
            else if (tt < r0) h = onIt;
            else h = along(LEG_H[i], smooth((tt - r0) / (B2.relD - 0.1)));
          } else if (b > 1) { h = HOUT[i]; hOp = b === 3 ? story : 1; }
          put(`h${i}`, h, k, hOp);
        });
        put('l-sh', [H_FROM[1][0] + 14, H_FROM[0][1] + 2], k, b === 1 ? tw(tt, B2.hIn, B2.hIn + 0.15) * (1 - tw(tt, B2.hMove + 0.25, B2.hMove + 0.4)) : 0);

        /* ---- the clipping (beat 3) */
        op(q('card'), b === 2 ? tw(tt, B3.card, B3.card + 0.25) : b === 3 ? 1 - tw(tt, B4.cardOut, B4.cardOut + 0.25) : 0);

        /* ---- the readout: in with beat 1, away while the camera is in, back in beat 4, where linear flow's ATP grows */
        op(q('ro'), b === 0 ? tw(t1, B1.box, B1.box + 0.3) : b === 1 ? 1 - tw(tt, B2.away, B2.away + 0.3) : b === 2 ? 0 : tw(tt, B4.ro, B4.ro + 0.3));
        const grow = b === 0 ? smoother((tt - B1.bars) / B1.barsD) : 1;
        ROW.forEach((r, i) => {
          set(q(`ro-a${i}`), 'width', f1(r.a * PER * grow));
          set(q(`ro-n${i}`), 'width', f1(2 * PER * grow));
        });
        const extra = mv(t4, B4.grow, B4.growD);
        set(q('ro-x'), 'width', f1(0.4 * PER * extra));
        op(q('ro-gap'), b === 0 ? tw(tt, B1.gap, B1.gap + 0.2) : 1 - tw(t4, B4.grow + B4.growD - 0.15, B4.grow + B4.growD));
      };
    },
  };
}

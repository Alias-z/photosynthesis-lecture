// Photosystem II on the slide 7 schema (script approved by the lecturer, 27 Oct 2026): the parts both stagings (psii7-a,
// psii7-b) share. The stage IS the slide 7 figure: chainSvg() of figs/chain.ts with photosystem II lit, drawn in the
// slide's figure card. The camera zooms into photosystem II, the story plays there, and the camera zooms back out to the
// whole chain, which ends exactly as on the slide, with cytochrome b₆f starting to light.
// - Beat 1 (opens on the slide figure; one click): zoom in; plastoquinone moves into its site on photosystem II's stroma
//   side; light arrives; the reaction centre sends its electron across the membrane to plastoquinone and is left with an
//   empty place.
// - Beat 2: a card with Ruben's and Kamen's portraits and the experiment appears on the right; heavy O₂ rises.
// - Beat 3: on photosystem II's lumen side, 2 H₂O split: O₂ leaves, 4 H⁺ stay in the lumen, 4 e⁻ refill the reaction
//   centre.
// - Beat 4: light again; a second electron goes to plastoquinone, which takes 2 H⁺ from the stroma and moves along the
//   membrane; zoom out to the whole chain; cytochrome b₆f starts to light.
//
// How the slide figure is reused (figs/chain.ts is not modified):
// - chainSvg() wraps every part's markup in <g class="chn-on|off">. The part of each wrapper is found by drawing the chain
//   once per part with only that part lit; the wrappers are then tagged data-p="<part>", so the story can hide the lit
//   arrows of photosystem II while it tells them, move plastoquinone, and fade in the lit copy of cytochrome b₆f (taken
//   from a second drawing with b₆f lit, so both looks light it exactly as the slides that light it).
// - Positions the story needs (plastoquinone, the H⁺ marks, the O₂ and H⁺ labels) are read from the drawing itself; the
//   PSII render's box is read from it too, and its anchors (oxygen-evolving site, Q_B site) are those of
//   chain-structures.json (oec2, qb2), the same that chain.ts uses.
// - The reaction centre is drawn between the oxygen-evolving site and the Q_B site, 36.5 % of the way up: P680's height in
//   PDB 5XNL (psii-data.ts: Mn₄CaO₅ cluster −27.6 Å, P680 −12.4 Å, Q_B +14.2 Å along the membrane normal).
// - The camera scales the whole schema; text, dots and atoms are counter-scaled by (s/s₀)^−0.7, so labels grow only from
//   21 to 28 px while the structures grow 2.5×.
//
// Images: ruben.png, kamen.png (assets/anim/psii; sources in psii-common.ts).
import '../figs/clipping.css';
import './psii7-common.css';
import kamenImg from '../../assets/anim/psii/kamen.png';
import rubenImg from '../../assets/anim/psii/ruben.png';
import psiiHref from '../../assets/chain/psii.webp';
import { chainSvg, LIT_PSII, type Part, type Style } from '../figs/chain';
import { clamp01, cutPath, f1, lerp, lerpV, setters, smooth, smoother, tfStr, tw, tween, type Tf, type V } from './antenna-common';
import type { Staging } from './types';

/* ---------------------------------------------------------------- the slide figure, tagged by part */

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
/** The part of each wrapper: draw the chain with one part lit at a time. */
function partsOf(style: Style): Array<Part | null> {
  const out: Array<Part | null> = wraps(chainSvg('p7probe', style, [])).map(() => null);
  for (const p of PARTS) wraps(chainSvg('p7probe', style, [p])).forEach((w, i) => { if (w.on) out[i] = p; });
  return out;
}
const strip = (s: string): string => s.replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
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
  oec: V; qb: V; rc: V;
  /** plastoquinone on the slide and its label */
  pq: V; pqLab: V;
  /** the four H⁺ marks of water and their label; the O₂ label */
  wH: V[]; wHLab: V; o2Lab: V;
  /** the two H⁺ marks in the stroma above Q_B and their label */
  sH: V[]; sHLab: V;
}

interface Scene { svg: string; geo: Geo }
function scene(id: string, style: Style): Scene {
  const base = strip(chainSvg(id, style, LIT_PSII)), lit = strip(chainSvg(id, style, [...LIT_PSII, 'b6f']));
  const parts = partsOf(style), wb = wraps(base), wl = wraps(lit);
  const inner = (p: Part): string => wb.filter((_, i) => parts[i] === p).map(w => w.inner).join('');
  let svg = '', at = 0;
  wb.forEach((w, i) => {
    const p = parts[i] ?? 'x';
    svg += `${base.slice(at, w.a)}<g class="chn-${w.on ? 'on' : 'off'}" data-p="${p}">${w.inner}</g>`;
    if (p === 'b6f' && wl[i]) svg += `<g class="chn-on" data-p="b6f-lit" opacity="0">${wl[i].inner}</g>`;
    at = w.b;
  });
  svg += base.slice(at);

  // photosystem II's render and its two sites (chain-structures.json: psii 496 × 299 px, oec2, qb2)
  const im = new RegExp(`<image href="${esc(psiiHref)}" x="${NUM}" y="${NUM}" width="${NUM}" height="${NUM}"`).exec(base);
  const [ix, iy, iw, ih] = im ? im.slice(1, 5).map(Number) : [14, 259.6, 196.3, 118.4];
  const px = (q: V): V => [ix + (q[0] * iw) / 496, iy + (q[1] * ih) / 299];
  const oec = px([330.3, 169.3]), qb = px([344.8, 73]);
  const pqm = /<ellipse class="chn-body chn-pq" cx="(-?[\d.]+)" cy="(-?[\d.]+)"/.exec(base);
  const pq: V = pqm ? [Number(pqm[1]), Number(pqm[2])] : [236, 292];
  // the glow pools of look c2c3: plastoquinone's moves with it, water's goes and comes back with water's arrows
  svg = svg.replace(new RegExp(`<ellipse cx="${NUM}" cy="${NUM}"([^>]*)fill="url\\(#${esc(id)}-pool\\)"/>`, 'g'),
    (all, x: string, y: string) => all.replace('<ellipse', `<ellipse data-k="${Math.hypot(Number(x) - pq[0], Number(y) - pq[1]) < 2 ? 'pqpool' : 'wpool'}"`));
  const water = inner('water'), hin = inner('pq-h-in');
  const wH = circlesOf(water, 'chn-hd'), sH = circlesOf(hin, 'chn-hd');
  return {
    svg,
    geo: {
      oec, qb, rc: lerpV(oec, qb, 0.365), pq,
      pqLab: textOf(inner('pq'), 'chn-in', 'plastoquinone', [pq[0], pq[1] - 46]),
      wH: wH.length === 4 ? wH : [[oec[0] + 62, 396], [oec[0] + 80, 390], [oec[0] + 66, 414], [oec[0] + 84, 410]],
      wHLab: textOf(water, 'chn-hl', 'H⁺', [oec[0] + 98, 408]),
      o2Lab: textOf(water, 'chn-ol', 'O₂', [oec[0] + 22, 436]),
      sH: sH.length === 2 ? sH : [[qb[0] - 4, 196], [qb[0] + 14, 186]],
      sHLab: textOf(hin, 'chn-hl', 'H⁺', [qb[0] + 28, 196]),
    },
  };
}

/* ---------------------------------------------------------------- views */

/** The whole chain: the slide's figure card (860 × 642 px around the 800 × 600 figure drawn at 0.97) fills the stage. */
const B: Tf = { s: 1.07, t: [800 - 1.07 * 400, 370 - 1.07 * 300] };
/** Photosystem II, close: its left edge near the stage's, the stroma above and the lumen below (stage ≈ figure y 168–442). */
const Z: Tf = { s: 2.7, t: [-8, -168 * 2.7] };
/** Text and glyph scale for a camera scale s. */
const kOf = (s: number): number => (s / B.s) ** -0.7;
/** The slide's figure card, in figure units (pilot.css .lay-figure .fig, with the paper look's fill and edge). */
const CARD = { x: -43.3, y: -30.9, w: 886.6, h: 661.9, r: 22.7 };

/* ---------------------------------------------------------------- timing (s into each beat) */

/** A move of about 1 s: 0 → 1 from t0 over d, eased at both ends. */
const mv = (t: number, t0: number, d: number): number => smoother((t - t0) / d);
/** A short pulse: up over 0.12 s from t0, down by t0 + 0.6. */
const pulse = (t: number, t0: number): number => tw(t, t0, t0 + 0.12) * (1 - tw(t, t0 + 0.25, t0 + 0.6));
/** A point on the quadratic Bézier a → c → b. */
const bez = (a: V, c: V, b: V, u: number): V => {
  const v = 1 - u;
  return [v * v * a[0] + 2 * v * u * c[0] + u * u * b[0], v * v * a[1] + 2 * v * u * c[1] + u * u * b[1]];
};

// Beat 1: zoom in (≈ 1.1 s) while the lit arrows give way and plastoquinone moves into its site; light; the jump.
const B1 = { zoom: 0.05, flowsOut: [0.05, 0.4], dock: 0.55, rc: 1.05, light: 1.35, flash: 1.8, jump: 1.9, end: 2.8 };
// Beat 2: the card; the heavy O₂ rises.
const B2 = { card: 0, bub: 0.35, bubD: 1.1, lab: 1.3, end: 1.6 };
// Beat 3: the card goes; 2 H₂O come to the site; they split; the electrons go up one after another.
const B3 = { cardOut: 0, in: 0.2, move: 0.4, split: 1.05, e: 1.1, eGap: 0.2, eD: 0.35, end: 2.3 };
// Beat 4: light, the second electron; 2 H⁺ from the stroma; plastoquinone moves; zoom out; b₆f starts to light.
const B4 = { light: 0.05, flash: 0.45, jump: 0.5, hIn: 1.0, hMove: 1.15, go: 1.75, out: 2.6, flowsIn: 3.2, b6f: 3.7, end: 4.4 };
const TEND = [B1.end, B2.end, B3.end, B4.end];
const JUMP = 0.55;
/** How lit b₆f gets at the end: it starts to light. */
const B6F_END = 0.6;

/* ---------------------------------------------------------------- glyphs: drawn round their origin at the slide's size */

const glyph = (k: string, inner: string, o = 0): string => `<g data-k="${k}" opacity="${o}">${inner}</g>`;
const lab = (s: string, cls: string, x: number, y: number, a: 'start' | 'middle' | 'end' = 'start'): string =>
  `<text class="${cls}" x="${x}" y="${y}" text-anchor="${a}">${s}</text>`;
const E_DOT = '<circle class="p7-e" r="6"/>';
const H_DOT = '<circle class="chn-hd" r="6.5"/>';
const O_ATOM = '<circle class="p7-o" r="8"/>';
/** Electrons: e1 (beat 1) and e2 (beat 4) end on plastoquinone; w0–w3 rise from water (beat 3). */
const ELECS = ['e1', 'e2', 'w0', 'w1', 'w2', 'w3'];

function overlaySvg(p: string): string {
  return `<defs><radialGradient id="${p}-rcglow"><stop offset="0" stop-color="#fff4d6"/><stop offset=".4" stop-color="#f6c453" stop-opacity=".9"/><stop offset="1" stop-color="#f0a316" stop-opacity="0"/></radialGradient>
      <clipPath id="${p}-lclip"><rect data-k="lclip" x="-200" y="-200" width="1200" height="1000"/></clipPath></defs>
    ${glyph('zl-stroma', lab('stroma', 'chn-zone', 0, 0))}${glyph('zl-lumen', lab('lumen', 'chn-zone', 0, 0))}
    ${glyph('zl-psii', lab('photosystem II', 'chn-name', 0, 0))}${glyph('zl-light', lab('light', 'chn-light', 0, 0))}
    ${glyph('rcglow', `<circle r="24" fill="url(#${p}-rcglow)"/>`)}
    ${glyph('rcring', '<circle class="p7-ring" r="7.5"/>')}${glyph('rcdot', E_DOT)}
    ${[0, 1].map(i => glyph(`wo${i}`, O_ATOM)).join('')}
    ${[0, 1, 2, 3].map(i => glyph(`wh${i}`, `<circle class="p7-hat" r="4.5" data-k="wha${i}"/><g data-k="whp${i}" opacity="0">${H_DOT}</g>`)).join('')}
    ${[0, 1].map(i => glyph(`sh${i}`, H_DOT)).join('')}
    ${ELECS.map(k => glyph(k, E_DOT)).join('')}
    ${glyph('l-h2o', lab('H₂O', 'chn-mol chn-halo', 0, 0))}${glyph('l-o2', lab('O₂', 'chn-ol chn-halo', 0, 0, 'middle'))}
    ${glyph('l-wh', lab('H⁺', 'chn-hl chn-halo', 0, 0))}${glyph('l-sh', lab('H⁺', 'chn-hl chn-halo', 0, 0))}
    ${glyph('l-e1', lab('e⁻', 'p7-elab chn-halo', -8, -8, 'end'))}${glyph('l-w', lab('e⁻', 'p7-elab chn-halo', -8, -8, 'end'))}`;
}

/* ---------------------------------------------------------------- the card: Ruben and Kamen, 1941 */

export type Lab = 'one' | 'two';
const CD = { x: 1118, y: 22, w: 444, h: 698 };
/** A round-bottom flask of water with algae; its neck's lip at y = lip. */
function flask(p: string, cx: number, cy: number, R: number, lip: number, seed: number): string {
  const n = 15, ny = cy - Math.sqrt(R * R - n * n), liq = cy - R * 0.45;
  let s = seed, algae = '';
  const rnd = (): number => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  for (let i = 0; i < 9; i++) {
    const a = rnd() * Math.PI * 2, d = Math.sqrt(rnd()) * (R - 12), x = cx + Math.cos(a) * d, y = cy + Math.abs(Math.sin(a)) * d * 0.9 - 4;
    if (y > liq + 8) algae += `<circle class="p7-alga" cx="${f1(x)}" cy="${f1(y)}" r="3.4"/>`;
  }
  return `<clipPath id="${p}-fl${seed}"><circle cx="${cx}" cy="${cy}" r="${R - 2}"/></clipPath>
    <rect class="p7-water" x="${cx - R}" y="${f1(liq)}" width="${2 * R}" height="${2 * R}" clip-path="url(#${p}-fl${seed})"/>${algae}
    <path class="p7-glass" d="M${cx - n},${lip}V${f1(ny)}A${R},${R} 0 1 0 ${cx + n},${f1(ny)}V${lip}"/>
    <path class="p7-lip" d="M${cx - n - 7},${lip - 3}H${cx + n + 7}"/>`;
}
const h2oMol = (x: number, y: number): string =>
  `<circle class="p7-hat" cx="${x - 8}" cy="${y - 7}" r="4.6"/><circle class="p7-hat" cx="${x + 8}" cy="${y - 7}" r="4.6"/><circle class="p7-o18" cx="${x}" cy="${y}" r="8"/>`;
const co2Mol = (x: number, y: number): string =>
  `<circle class="p7-o18" cx="${x - 13}" cy="${y}" r="8"/><circle class="p7-o18" cx="${x + 13}" cy="${y}" r="8"/><circle class="p7-c" cx="${x}" cy="${y}" r="7"/>`;
/** A bubble of O₂, heavy or not, drawn round its origin. */
const bubble = (heavy: boolean): string =>
  `<circle class="p7-bub" r="18"/><circle class="${heavy ? 'p7-o18' : 'p7-o'}" cx="-5.5" r="7"/><circle class="${heavy ? 'p7-o18' : 'p7-o'}" cx="5.5" r="7"/>`;
/** Bubbles: flask, start and end on the stage. */
interface Bub { k: string; from: V; to: V }
function cardSvg(p: string, look: Lab): { svg: string; bubs: Bub[] } {
  const { x, y, w, h } = CD, pw = 160, ph = 200, gap = 24, px0 = x + (w - 2 * pw - gap) / 2, py = y + 26;
  const por = (href: string, px: number): string => `<image href="${href}" x="${px}" y="${py}" width="${pw}" height="${ph}" preserveAspectRatio="xMidYMid slice"/>`;
  const head = `${por(rubenImg, px0)}${por(kamenImg, px0 + pw + gap)}
    <text class="clip-name p7-cname" x="${px0 + pw / 2}" y="${py + ph + 34}" text-anchor="middle">Ruben</text>
    <text class="clip-name p7-cname" x="${px0 + 1.5 * pw + gap}" y="${py + ph + 34}" text-anchor="middle">Kamen</text>
    <text class="clip-find p7-year" x="${x + w / 2}" y="${py + ph + 74}" text-anchor="middle">1941</text>`;
  let exp = '';
  const bubs: Bub[] = [];
  if (look === 'one') {
    const cx = x + w / 2, cy = 566, R = 74, lip = 428;
    exp = `${flask(p, cx, cy, R, lip, 11)}${lab('heavy-oxygen water', 'p7-cl p7-cl-o18', cx, cy + R + 40, 'middle')}
      ${glyph(`${p}-b0`, bubble(true))}${glyph(`${p}-bl0`, lab('heavy O₂', 'p7-cl p7-cl-o18', 0, 0))}`;
    bubs.push({ k: `${p}-b0`, from: [cx + 8, cy + 18], to: [cx, lip - 44] });
  } else {
    const cy = 532, R = 58, lip = 424, xs = [x + w * 0.27, x + w * 0.73];
    exp = `${flask(p, xs[0], cy, R, lip, 11)}${flask(p, xs[1], cy, R, lip, 23)}
      ${h2oMol(xs[0] - 22, cy + 2)}${h2oMol(xs[0] + 20, cy + 24)}${h2oMol(xs[0] - 4, cy + 42)}
      ${co2Mol(xs[1] - 18, cy + 4)}${co2Mol(xs[1] + 16, cy + 30)}
      ${lab('heavy oxygen', 'p7-cl', xs[0], cy + R + 32, 'middle')}${lab('in water', 'p7-cl', xs[0], cy + R + 58, 'middle')}
      ${lab('heavy oxygen', 'p7-cl', xs[1], cy + R + 32, 'middle')}${lab('in CO₂', 'p7-cl', xs[1], cy + R + 58, 'middle')}
      <circle class="p7-o18" cx="${x + w / 2 - 66}" cy="${y + h - 32}" r="7"/>${lab('heavy oxygen', 'p7-key', x + w / 2 - 52, y + h - 25)}
      ${glyph(`${p}-b0`, bubble(true))}${glyph(`${p}-bl0`, lab('heavy O₂', 'p7-cl p7-cl-o18', 0, 0))}
      ${glyph(`${p}-b1`, bubble(false))}${glyph(`${p}-bl1`, lab('O₂', 'p7-cl p7-cl-o', 0, 0))}`;
    bubs.push({ k: `${p}-b0`, from: [xs[0] + 6, cy + 16], to: [xs[0], lip - 50] }, { k: `${p}-b1`, from: [xs[1] - 4, cy + 18], to: [xs[1], lip - 50] });
  }
  const svg = `<g data-k="card" opacity="0"><g transform="rotate(-1.2 ${x + w / 2} ${y + h / 2})">
    <defs><filter id="${p}-cardsh" x="-10%" y="-6%" width="120%" height="114%"><feDropShadow dx="1" dy="4" stdDeviation="6" flood-color="#3d3020" flood-opacity=".22"/></filter></defs>
    <path class="p7-paper" d="${cutPath(x, y, w, h, 37, 3.2)}" filter="url(#${p}-cardsh)"/>${head}${exp}</g></g>`;
  return { svg, bubs };
}

/* ---------------------------------------------------------------- the staging */

export interface Opt { id: string; name: string; note: string; style: Style; card: Lab }

export function makeStaging(o: Opt): Staging {
  const P = `p7${o.id}`;
  const { svg: chain, geo: G } = scene(`${P}c`, o.style);
  const card = cardSvg(P, o.card);
  // plastoquinone's site on photosystem II, and where its label sits beside it in the close view
  const QB: V = G.qb, LAB_OFF0: V = [G.pqLab[0] - G.pq[0], G.pqLab[1] - G.pq[1]], LAB_OFFZ: V = [66, -38];
  // the electrons on plastoquinone, the H⁺ it takes from the stroma (relative to its centre)
  const ON_PQ: V[] = [[-5, 0.5], [5, 0.5]], H_ON_PQ: V[] = [[-7, -8.5], [7, -8.5]];
  // water comes in from the lumen to the oxygen-evolving site; its O₂ leaves along the slide's O₂ arrow
  const W_FROM: V[] = [[112, 410], [134, 420]], W_AT: V[] = [[G.oec[0] - 7, G.oec[1] + 4], [G.oec[0] + 8, G.oec[1] + 7]];
  const O2_TO: V = [G.o2Lab[0], G.o2Lab[1] - 22];
  const H_OFF: V[] = [[-8, -7], [8, -7]];

  return {
    id: o.id,
    name: o.name,
    note: o.note,
    holds: [[0]],
    svg: () => `
      <g data-k="cam"><g class="fig">
        <defs><filter id="${P}-sl" x="-5%" y="-5%" width="110%" height="112%"><feDropShadow dx="0" dy="8" stdDeviation="9" flood-color="#46321a" flood-opacity=".14"/></filter></defs>
        <rect class="p7-slidecard" x="${CARD.x}" y="${CARD.y}" width="${CARD.w}" height="${CARD.h}" rx="${CARD.r}" filter="url(#${P}-sl)"/>
        <g data-k="chain" class="chn chn-${o.style}">${chain}</g>
        ${overlaySvg(P)}
      </g></g>
      ${card.svg}`,

    bind(stage) {
      const S = setters(stage), { q, set, op } = S;
      const chainG = q('chain');
      const parts = (p: string): SVGGElement[] => Array.from(chainG.querySelectorAll<SVGGElement>(`[data-p="${p}"]`));
      const texts = Array.from(chainG.querySelectorAll<SVGTextElement>('text')).map(el => ({ el, x: Number(el.getAttribute('x')), y: Number(el.getAttribute('y')) }));
      const hds = Array.from(chainG.querySelectorAll<SVGCircleElement>('circle.chn-hd')).map(el => ({ el, r: Number(el.getAttribute('r')) }));
      const lightW = parts('light-psii');
      lightW.forEach(g => g.setAttribute('clip-path', `url(#${P}-lclip)`));
      const flows = ['water', 'e-water-psii', 'e-psii-pq', 'pq-h-in'].flatMap(parts);
      const pqW = parts('pq'), pqBody = pqW.filter(g => !g.querySelector('text')), pqText = pqW.filter(g => g.querySelector('text'));
      const pool = q('pqpool'), wpool = q('wpool'), b6fLit = parts('b6f-lit');
      /** A glyph at figure point at, scaled k, at opacity o. */
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

        /* ---- camera: in with beat 1, out in beat 4 */
        const zoom = mv(t1, B1.zoom, 1.1) * (1 - mv(t4, B4.out, 1.2));
        const cam = tween(B, Z, zoom), k = kOf(cam.s);
        set(q('cam'), 'transform', tfStr(cam));
        texts.forEach(({ el, x, y }) => set(el, 'transform', `matrix(${k.toFixed(4)},0,0,${k.toFixed(4)},${(x * (1 - k)).toFixed(2)},${(y * (1 - k)).toFixed(2)})`));
        hds.forEach(({ el, r }) => set(el, 'r', (r * k).toFixed(2)));
        // labels that only the close view needs (the slide's own are out of view there)
        const zl = tw(t1, 0.95, 1.2) * (1 - tw(t4, B4.out, B4.out + 0.3));
        put('zl-stroma', [14, 190], k, zl);
        put('zl-lumen', [14, 434], k, zl);
        put('zl-psii', [14, 398], k, zl);

        /* ---- the slide's lit arrows of photosystem II give way while the story tells them, and come back at the end */
        const flowsOp = b === 0 ? 1 - tw(tt, B1.flowsOut[0], B1.flowsOut[1]) : b < 3 ? 0 : tw(tt, B4.flowsIn, B4.flowsIn + 0.5);
        flows.forEach(g => op(g, flowsOp));
        if (wpool) op(wpool, Math.max(flowsOp, tw(t3, B3.in, B3.in + 0.4)));
        // light: the slide's own wave, cleared, then drawn in from above each time light arrives
        let lOp = 0, lY = 1000;
        if (b === 0) {
          if (tt < B1.light - 0.05) lOp = 1 - tw(tt, B1.flowsOut[0], B1.flowsOut[1]);
          else { lOp = 1 - tw(tt, B1.jump + 0.5, B1.jump + 0.8); lY = lerp(150, 262, smooth((tt - B1.light) / 0.45)); }
        } else if (b === 3) {
          if (tt < B4.out) { lOp = 1 - tw(tt, B4.jump + 0.45, B4.jump + 0.7); lY = lerp(150, 262, smooth((tt - B4.light) / 0.4)); }
          else lOp = tw(tt, B4.flowsIn, B4.flowsIn + 0.5);
        }
        lightW.forEach(g => op(g, lOp));
        set(q('lclip'), 'height', f1(lY + 200));
        const lightLab = b === 0 ? tw(t1, B1.light + 0.1, B1.light + 0.3) * (1 - tw(t1, B1.jump + 0.5, B1.jump + 0.8))
          : b === 3 ? tw(t4, B4.light + 0.05, B4.light + 0.25) * (1 - tw(t4, B4.jump + 0.45, B4.jump + 0.7)) : 0;
        put('zl-light', [84, 200], k, lightLab);

        /* ---- plastoquinone: into its site on the stroma side (beat 1), out along the membrane (beat 4) */
        const dock = mv(t1, B1.dock, 0.65), go = mv(t4, B4.go, 0.8);
        const pq = go > 0 ? lerpV(QB, G.pq, go) : lerpV(G.pq, QB, dock);
        const dPq: V = [pq[0] - G.pq[0], pq[1] - G.pq[1]];
        shift(pqBody, dPq);
        if (pool) shift([pool], dPq);
        const lo = lerpV(LAB_OFF0, LAB_OFFZ, zoom);
        shift(pqText, [pq[0] + lo[0] - G.pqLab[0], pq[1] + lo[1] - G.pqLab[1]]);
        const onPq = (i: number): V => [pq[0] + ON_PQ[i][0], pq[1] + ON_PQ[i][1]];
        const riders = 1 - tw(t4, B4.out, B4.out + 0.3);

        /* ---- the reaction centre: its electron, the flash, the empty place */
        const fl = b === 0 ? pulse(tt, B1.flash) : b === 3 ? pulse(tt, B4.flash) : 0;
        put('rcglow', G.rc, k, fl);
        const firstBack = B3.e + B3.eD; // the first electron from water arrives
        const ring = b === 0 ? tw(tt, B1.jump + 0.05, B1.jump + 0.15) : b === 1 ? 1 : b === 2 ? 1 - tw(tt, firstBack - 0.05, firstBack) : 0;
        put('rcring', G.rc, k, ring);
        const dot = b === 0 ? tw(tt, B1.rc, B1.rc + 0.2) * (tt < B1.jump ? 1 : 0) : b === 1 ? 0 : b === 2 ? tw(tt, firstBack - 0.05, firstBack) : riders;
        put('rcdot', G.rc, k, dot);

        // the jumps: the reaction centre → plastoquinone at Q_B, arching through the protein
        const jump = (t0: number, i: number): V => {
          const u = smooth((t0) / JUMP), a = G.rc, z = onPq(i);
          return bez(a, [Math.max(a[0], z[0]) + 14, (a[1] + z[1]) / 2], z, u);
        };
        const u1 = b === 0 ? (tt - B1.jump) : 99, e1 = u1 >= 0 ? jump(Math.min(u1, JUMP), 0) : G.rc;
        put('e1', e1, k, b === 0 ? (tt < B1.jump ? 0 : 1) : riders);
        const u2 = b === 3 ? tt - B4.jump : b > 3 ? 99 : -1;
        put('e2', u2 >= 0 ? jump(Math.min(u2, JUMP), 1) : G.rc, k, u2 >= 0 ? riders : 0);
        // the e⁻ label: on the reaction centre's electron, with it to plastoquinone, and along with plastoquinone
        // (it gives way when the H⁺ arrive on plastoquinone in beat 4)
        put('l-e1', b === 0 && tt < B1.jump ? G.rc : e1, k, b === 0 ? tw(tt, B1.rc, B1.rc + 0.2) : 1 - tw(t4, B4.hIn, B4.hIn + 0.15));

        /* ---- the card (beat 2) */
        op(q('card'), b === 1 ? tw(tt, B2.card, B2.card + 0.25) : b === 2 ? 1 - tw(tt, B3.cardOut, B3.cardOut + 0.25) : 0);
        card.bubs.forEach((bb, i) => {
          const u = b === 1 ? (tt - B2.bub) / B2.bubD : b > 1 ? 1 : -1;
          const el = q(bb.k);
          op(el, u >= 0 ? tw(u, 0, 0.1) : 0);
          if (u >= 0) { const at = lerpV(bb.from, bb.to, 1 - (1 - clamp01(u)) ** 2); set(el, 'transform', `translate(${f1(at[0])} ${f1(at[1])})`); }
          const le = q(`${P}-bl${i}`);
          op(le, b === 1 ? tw(tt, B2.lab, B2.lab + 0.2) : b > 1 ? 1 : 0);
          set(le, 'transform', `translate(${f1(bb.to[0] + 26)} ${f1(bb.to[1] + 8)})`);
        });

        /* ---- water splitting (beat 3) */
        const wIn = tw(t3, B3.in, B3.in + 0.2), wMove = mv(t3, B3.move, B3.split - B3.move - 0.05), split = mv(t3, B3.split, 0.6);
        const wAt = (i: number): V => lerpV(W_FROM[i], W_AT[i], wMove);
        const before = t3 < B3.split ? 1 : 0;
        // each water molecule: its O atom joins the other's as O₂, which leaves; its two H atoms become H⁺
        const lumenOut = b === 3 ? 1 - tw(tt, B4.flowsIn, B4.flowsIn + 0.5) : 1; // the slide's own marks take over
        const o2c = lerpV(W_AT[0], W_AT[1], 0.5), o2at = lerpV(o2c, O2_TO, split);
        [0, 1].forEach(i => {
          const rel: V = [W_AT[i][0] - o2c[0], W_AT[i][1] - o2c[1]], join = Math.min(1, split * 2.5);
          const at: V = before ? wAt(i) : [o2at[0] + lerp(rel[0], (i ? 6.5 : -6.5) * k, join), o2at[1] + lerp(rel[1], 0, join)];
          put(`wo${i}`, at, k, wIn * lumenOut);
        });
        [0, 1, 2, 3].forEach(i => {
          const w = wAt(i >> 1), h0: V = [w[0] + H_OFF[i & 1][0] * k, w[1] + H_OFF[i & 1][1] * k];
          put(`wh${i}`, before ? h0 : lerpV(h0, G.wH[i], split), k, wIn * lumenOut);
          op(q(`wha${i}`), 1 - tw(t3, B3.split, B3.split + 0.15));
          op(q(`whp${i}`), tw(t3, B3.split, B3.split + 0.15));
        });
        // the four electrons go up to the reaction centre, one after another, and refill it
        [0, 1, 2, 3].forEach(i => {
          const t0 = B3.e + i * B3.eGap, u = (t3 - t0) / B3.eD, a = W_AT[i >> 1];
          put(`w${i}`, bez(a, [G.rc[0] - 10, (a[1] + G.rc[1]) / 2], G.rc, smooth(u)), k, u >= 0 && u < 1 ? 1 : 0);
        });
        const uw = (t3 - B3.e) / B3.eD;
        put('l-w', uw < 1 ? bez(W_AT[0], [G.rc[0] - 10, (W_AT[0][1] + G.rc[1]) / 2], G.rc, smooth(uw)) : G.rc, k,
          tw(t3, B3.e, B3.e + 0.15) * riders);
        put('l-h2o', [wAt(1)[0] + 21 * k, wAt(1)[1] + 7 * k], k, wIn * (1 - tw(t3, B3.split - 0.1, B3.split + 0.1)));
        put('l-o2', G.o2Lab, k, tw(t3, B3.split + 0.45, B3.split + 0.65) * lumenOut);
        put('l-wh', G.wHLab, k, tw(t3, B3.split + 0.45, B3.split + 0.65) * lumenOut);

        /* ---- plastoquinone takes 2 H⁺ from the stroma (beat 4) */
        const hShow = tw(t4, B4.hIn, B4.hIn + 0.15), hMove = mv(t4, B4.hMove, 0.5);
        [0, 1].forEach(i => {
          const z: V = [pq[0] + H_ON_PQ[i][0], pq[1] + H_ON_PQ[i][1]];
          put(`sh${i}`, lerpV(G.sH[i], z, hMove), k, hShow * riders);
        });
        put('l-sh', G.sHLab, k, hShow * (1 - tw(t4, B4.hMove + 0.4, B4.hMove + 0.6)));

        /* ---- cytochrome b₆f starts to light */
        b6fLit.forEach(g => op(g, B6F_END * tw(t4, B4.b6f, B4.b6f + 0.6)));
      };
    },
  };
}

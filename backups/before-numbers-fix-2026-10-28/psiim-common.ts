// Photosystem II on the slide 7 figure in the 7m1 glyph style (ETC_ANIM_BRIEF.md "psii", lecturer, 28 Oct 2026): the
// parts the stagings psii-m1 (one flask) and psii-m2 (two flasks) share. The stage IS slide 7's figure 7m1:
// chainSvg(id, 'pdb-bilayer', LIT_PSII, { mol: true }) in the slide's figure card. The camera zooms into photosystem II,
// the story plays there, and zooms back out to the whole chain, where plastoquinol stays where the story left it and
// cytochrome b₆f starts to light.
// Point, then do: every part is named by a leader and glows briefly before it acts.
// - Beat 1 (stops after the naming of PSII and its reaction centre, and after plastoquinone docks): zoom in; leaders
//   name "photosystem II" (it glows), "reaction centre (P680)" (its electron, labelled e⁻) and "plastoquinone (PQ)",
//   which slides into its site at Q_B; light arrives; one e⁻ jumps P680 → PQ; P680 shows an empty place.
// - Beat 2 (stops once the card is in): Ruben and Kamen's card; one or two flasks; ¹⁸O₂ (purple) or O₂ (yellow) rises.
// - Beat 3 (stops when the water has arrived): the water-splitting site is named; 2 H₂O come to it; the O atoms pair into
//   O₂, which leaves; the four H become ringed H⁺ that stay in the lumen; 4 e⁻ go up one by one and refill P680.
// - Beat 4 (stops after the second electron, and after the H⁺ are taken up): light again, a second e⁻ to PQ; 2 ringed H⁺
//   come from the stroma onto it; it becomes plastoquinol (PQH₂) and moves off along the membrane; zoom out; b₆f lights.
//
// How the slide figure is reused (figs/chain.ts is not modified):
// - chainSvg() wraps every part in <g class="chn-on|off">; the part of each wrapper is found by drawing the chain with one
//   part lit at a time, and the wrappers are tagged data-p="<part>". The story hides photosystem II's lit arrows, its
//   water group and plastoquinone (with its label) while it tells them; the lit copy of b₆f is taken from a second drawing.
// - Glyph mode (7m1): H⁺ are <g class="chn-g"> ringed marks, water and O₂ atom balls. Positions are read from the
//   markup: the four lumen H⁺ rings and the two stroma H⁺ rings (circle.chn-hr), the O₂ balls (circle.atom-O), the O₂
//   label; photosystem II's box from its <image>, its anchors (oec, qb) as chain.ts's REN.
// - The camera scales the whole schema; text is counter-scaled about its anchor and each glyph group (.chn-g) about its
//   centre by (s/s₀)^−0.7, so labels grow from 21 to ≈ 27 px while the structures grow 2.3×.
// - Plastoquinone is drawn as the lettered lozenge of chain.ts's named mode (a small molecule in the lipids, not a
//   protein); its letters and its leader change to plastoquinol (PQH₂) once it holds 2 e⁻ and 2 H⁺.
//
// Images: ruben.png, kamen.png (assets/anim/psii; sources in psii-common.ts).
import '../figs/clipping.css';
import './psiim-common.css';
import kamenImg from '../../assets/anim/psii/kamen.png';
import rubenImg from '../../assets/anim/psii/ruben.png';
import psiiHref from '../../assets/chain/psii.webp';
import { atoms, chainSvg, GEO, hring, LIT_PSII, type Glyphs, type Part } from '../figs/chain';
import { cutPath, f1, lerp, lerpV, setters, smooth, smoother, tfStr, tw, tween, type Tf, type V } from './antenna-common';
import type { Beat, Staging } from './types';

/* ---------------------------------------------------------------- the slide figure (7m1), tagged by part */

const STYLE = 'pdb-bilayer' as const;
const GL: Glyphs = { mol: true };
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
function partsOf(): Array<Part | null> {
  const out: Array<Part | null> = wraps(chainSvg('p7mprobe', STYLE, [], GL)).map(() => null);
  for (const p of PARTS) wraps(chainSvg('p7mprobe', STYLE, [p], GL)).forEach((w, i) => { if (w.on) out[i] = p; });
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

/** Where the story happens, read from the drawing (fallbacks: chain.ts's GEO and its glyph-mode layout). */
interface Geo {
  oec: V; qb: V; rc: V; pq: V;
  /** the four H⁺ rings of water in the lumen; the O₂ (centre of its two balls) and its label */
  wH: V[]; o2: V; o2Lab: V;
  /** the two H⁺ rings in the stroma above Q_B */
  sH: V[];
  /** photosystem II's render: x, y, width, height */
  box: [number, number, number, number];
}
interface Scene { svg: string; geo: Geo }
function scene(id: string): Scene {
  const base = strip(chainSvg(id, STYLE, LIT_PSII, GL)), lit = strip(chainSvg(id, STYLE, [...LIT_PSII, 'b6f'], GL));
  const parts = partsOf(), wb = wraps(base), wl = wraps(lit);
  const inner = (p: Part): string => wb.filter((_, i) => parts[i] === p).map(w => w.inner).join('');
  // photosystem II's render (chain.ts REN.psii: 496 × 299 px, oec and qb anchors)
  const im = new RegExp(`<image href="${esc(psiiHref)}" x="${NUM}" y="${NUM}" width="${NUM}" height="${NUM}"`).exec(base);
  const box = (im ? im.slice(1, 5).map(Number) : [14, 259.6, 196.3, 118.4]) as [number, number, number, number];
  const px = (q: V): V => [box[0] + (q[0] * box[2]) / 496, box[1] + (q[1] * box[3]) / 299];
  // a glowing copy of photosystem II's render under it (the chain's own glow filter), to make it glow when it is named
  const glowCopy = `<g data-k="psiiglow" opacity="0" display="none"><image href="${psiiHref}" x="${box[0]}" y="${box[1]}" width="${box[2]}" height="${box[3]}" filter="url(#${id}-glow)"/></g>`;
  let svg = '', at = 0, glowDone = false;
  wb.forEach((w, i) => {
    const p = parts[i] ?? 'x';
    svg += base.slice(at, w.a);
    if (p === 'psii' && !glowDone) { svg += glowCopy; glowDone = true; }
    svg += `<g class="chn-${w.on ? 'on' : 'off'}" data-p="${p}">${w.inner}</g>`;
    if (p === 'b6f' && wl[i]) svg += `<g class="chn-on" data-p="b6f-lit" opacity="0" display="none">${wl[i].inner}</g>`;
    at = w.b;
  });
  svg += base.slice(at);

  const pqm = /<ellipse class="chn-body chn-pq" cx="(-?[\d.]+)" cy="(-?[\d.]+)"/.exec(base);
  const oec = px([330.3, 169.3]), qb = px([344.8, 73]);
  const water = inner('water'), hin = inner('pq-h-in');
  const wH = circlesOf(water, 'chn-hr'), sH = circlesOf(hin, 'chn-hr'), oAt = circlesOf(water, 'atom atom-O');
  const o2: V = oAt.length >= 2 ? lerpV(oAt[oAt.length - 2], oAt[oAt.length - 1], 0.5) : [oec[0] + 14, 414];
  return {
    svg,
    geo: {
      oec, qb, rc: lerpV(oec, qb, 0.365), box,
      pq: pqm ? [Number(pqm[1]), Number(pqm[2])] : [GEO.pq[0], GEO.pq[1]],
      wH: wH.length === 4 ? wH : [[205.5, 391.1], [234.3, 381.5], [211.9, 420.3], [240.7, 414]],
      o2, o2Lab: textOf(water, 'chn-ol', 'O₂', [o2[0], 446]),
      sH: sH.length === 2 ? sH : [[141.1, 199], [169.9, 183]],
    },
  };
}

/* ---------------------------------------------------------------- views */

/** The whole chain: the slide's figure card (860 × 642 px around the 800 × 600 figure drawn at 0.97) fills the stage. */
const B: Tf = { s: 1.07, t: [800 - 1.07 * 400, 370 - 1.07 * 300] };
/** Photosystem II, close: figure x −6…647, y 160…462 (the stroma above PSII for the leaders, the lumen to its floor). */
const ZS = 2.45;
const Z: Tf = { s: ZS, t: [6 * ZS, -160 * ZS] };
/** Text and glyph scale for a camera scale s. */
const kOf = (s: number): number => (s / B.s) ** -0.7;
/** The slide's figure card, in figure units (pilot.css .lay-figure .fig, with the paper look's fill and edge). */
const CARD = { x: -43.3, y: -30.9, w: 886.6, h: 661.9, r: 22.7 };

/* ---------------------------------------------------------------- timing (s into each beat) */

/** A move: 0 → 1 from t0 over d, eased at both ends. */
const mv = (t: number, t0: number, d: number): number => smoother((t - t0) / d);
/** Up over `up` from t0, held, down by t1. */
const glowAt = (t: number, t0: number, t1: number, up = 0.25): number => tw(t, t0, t0 + up) * (1 - tw(t, t1 - 0.35, t1));
/** A short flash: up over 0.12 s from t0, down by t0 + 0.6. */
const pulse = (t: number, t0: number): number => tw(t, t0, t0 + 0.12) * (1 - tw(t, t0 + 0.25, t0 + 0.6));
/** A point on the quadratic Bézier a → c → b. */
const bez = (a: V, c: V, b: V, u: number): V => {
  const v = 1 - u;
  return [v * v * a[0] + 2 * v * u * c[0] + u * u * b[0], v * v * a[1] + 2 * v * u * c[1] + u * u * b[1]];
};

// Beat 1: zoom in; name PSII, then its reaction centre (stop); name plastoquinone, which docks (stop); light; the jump.
const B1G = { zoom: 0.15, flowsOut: [0.15, 0.6], psii: 1.45, rc: 2.45, h1: 3.6, pq: 3.75, dock: 4.55, h2: 5.8,
  light: 5.95, flash: 6.5, jump: 6.6, end: 7.9 };
// … with plastoquinone already bound at Q_B (pa, pb): it is only named there (stop); light; the jump.
const B1W = { ...B1G, dock: 99, h2: 4.9, light: 5.05, flash: 5.6, jump: 5.7, end: 7.0 };
// Beat 2: the card (stop); the bubbles rise.
const B2 = { card: 0, h: 0.7, bub: 0.85, bubD: 1.6, lab: 2.3, end: 2.9 };
// Beat 3: the card goes; the site is named; 2 H₂O come (stop); they split; 4 e⁻ go up one by one.
const B3 = { cardOut: 0, site: 0.35, in: 1.0, move: 1.2, h: 2.4, split: 2.5, o2go: 2.95, e: 2.6, eGap: 0.5, eD: 0.55, end: 5.2 };
// Beat 4: light, the second e⁻ (stop); 2 H⁺ from the stroma, PQ → PQH₂ (stop); it moves off; zoom out; b₆f lights.
const B4G = { light: 0.1, flash: 0.6, jump: 0.7, h1: 1.8, hIn: 1.9, hMove: 2.2, swap: 3.1, h2: 3.7, go: 3.8, goD: 1.0, newIn: 99,
  newD: 1, out: 4.9, flowsIn: 5.8, b6f: 6.3, end: 7.1 };
// … pa, pb: plastoquinol drops out and diffuses (2 s) to the slide's PQ place; a new PQ drifts into Q_B (2 s, from 4.3 s).
const B4W = { ...B4G, goD: 2.0, newIn: 4.3, newD: 2.0, out: 6.5, flowsIn: 7.4, b6f: 7.9, end: 8.7 };
// … pb: the exchange (stop), then the fresh plastoquinone takes the other 2 e⁻ (two short flashes) and 2 H⁺ from the
// stroma and slips into the pool as a second plastoquinol (stop); the readout per O₂ (stop); zoom out; b₆f lights.
const B4P = { ...B4G, go: 3.8, goD: 1.8, newIn: 4.1, newD: 1.8, h3: 6.0, l3: 6.1, l4: 6.8, hIn2: 7.5, hMove2: 7.6, swap2: 8.35,
  out2: 8.9, out2D: 1.5, h4: 10.5, ro: 10.6, h5: 12.4, out: 12.6, flowsIn: 13.5, b6f: 14.0, end: 14.8 };
const JUMP = 0.6;
/** How lit b₆f gets at the end: it starts to light. */
const B6F_END = 0.6;

/* ---------------------------------------------------------------- the story's glyphs, drawn round their origin */

const glyph = (k: string, inner: string): string => `<g data-k="${k}" opacity="0" display="none">${inner}</g>`;
const lab = (s: string, cls: string, a: 'start' | 'middle' | 'end' = 'start', dx = 0, dy = 0): string =>
  `<text class="${cls}" x="${dx}" y="${dy}" text-anchor="${a}">${s}</text>`;
const E_DOT = '<circle class="p7m-e" r="6"/>';
/** Electrons: e1 (beat 1) and e2 (beat 4) end on plastoquinone; w0–w3 rise from water (beat 3). */
const ELECS = ['e1', 'e2', 'w0', 'w1', 'w2', 'w3'];
const leader = (k: string): string =>
  `<g data-k="${k}" opacity="0" display="none"><path data-k="${k}-h" class="chn-ldh"/><path data-k="${k}-l" class="chn-ld"/><circle data-k="${k}-d" class="chn-ldt" r="3.2"/></g>`;
/** Plastoquinone as a small molecule: the lettered lozenge of chain.ts's named mode; its letters change to PQH₂. */
const PQ_GLYPH = `<ellipse data-k="pqb" class="chn-pq p7m-pq" rx="18" ry="9.5"/>
  <text data-k="pqt1" class="chn-lt" y="4.6" text-anchor="middle">PQ</text><text data-k="pqt2" class="chn-lt" y="4.6" text-anchor="middle" opacity="0">PQH₂</text>`;

/** A plastoquinone whose letters change (pb's second one), its parts keyed `${p}b`, `${p}t1`, `${p}t2`. */
const pqGlyph = (p: string): string => `<ellipse data-k="${p}b" class="chn-pq p7m-pq" rx="18" ry="9.5"/>
  <text data-k="${p}t1" class="chn-lt" y="4.6" text-anchor="middle">PQ</text><text data-k="${p}t2" class="chn-lt" y="4.6" text-anchor="middle" opacity="0">PQH₂</text>`;
/** A plastoquinone of the pool (pa, pb): the same lettered lozenge, without the parts that change. */
const PQ_STATIC = '<ellipse class="chn-pq p7m-pq" rx="18" ry="9.5"/><text class="chn-lt" y="4.6" text-anchor="middle">PQ</text>';

function overlaySvg(p: string, mode: PqMode = 'glide'): string {
  const glow = (k: string): string => glyph(k, `<circle r="22" fill="url(#${p}-glow)"/>`);
  const pool = mode === 'glide' ? '' : `${glow('g-pqn')}${glyph('pqn', mode === 'pool' ? pqGlyph('pqn') : PQ_STATIC)}${mode === 'pool'
    ? `${glow('g-pp1')}${glow('g-pp2')}${glyph('pp1', PQ_STATIC)}${glyph('pp2', PQ_STATIC)}${leader('ld-pool')}${glyph('l-pool', lab('plastoquinone pool', 'chn-in chn-halo'))}
` : ''}`;
  const pool2 = mode === 'pool' ? `${[2, 3].map(i => glyph(`sh${i}`, hring(0, 0, 12))).join('')}${['e3', 'e4'].map(k => glyph(k, E_DOT)).join('')}` : '';
  return `<defs><radialGradient id="${p}-glow"><stop offset="0" stop-color="#fff4d6"/><stop offset=".4" stop-color="#f6c453" stop-opacity=".9"/><stop offset="1" stop-color="#f0a316" stop-opacity="0"/></radialGradient>
      <clipPath id="${p}-lclip"><rect data-k="lclip" x="-200" y="-200" width="1200" height="1000"/></clipPath></defs>
    ${glyph('zl-stroma', lab('stroma', 'chn-zone'))}${glyph('zl-lumen', lab('lumen', 'chn-zone'))}${glyph('zl-light', lab('light', 'chn-light', 'end'))}
    ${glow('g-pq')}${glow('g-oec')}${glow('g-rc')}${mode === 'pool' ? [0, 1, 2, 3].map(i => `${glow(`gw${i}`)}${glow(`gr${i}`)}`).join('') : ''}
    ${glyph('rcring', '<circle class="p7m-ring" r="7.5"/>')}${glyph('rcdot', E_DOT)}
    ${[0, 1].map(i => glyph(`wo${i}`, atoms(0, 0, 'O'))).join('')}
    ${[0, 1, 2, 3].map(i => glyph(`wh${i}`, `<g data-k="wha${i}"><circle class="atom atom-H" r="6.5"/></g><g data-k="whp${i}" opacity="0" display="none">${hring(0, 0, 12)}</g>`)).join('')}
    ${pool}${glyph('pq', PQ_GLYPH)}
    ${[0, 1].map(i => glyph(`sh${i}`, hring(0, 0, 12))).join('')}
    ${ELECS.map(k => glyph(k, E_DOT)).join('')}${pool2}
    ${leader('ld-psii')}${leader('ld-rc')}${leader('ld-pq')}${leader('ld-oec')}
    ${glyph('l-psii', lab('photosystem II', 'chn-name chn-halo'))}${glyph('l-rc', lab('reaction centre (P680)', 'chn-in chn-halo'))}
    ${glyph('l-pq', lab('plastoquinone (PQ)', 'chn-in chn-halo'))}${glyph('l-pq2', lab('plastoquinol (PQH₂)', 'chn-in chn-halo'))}
    ${glyph('l-oec', lab('water-splitting site', 'chn-in chn-halo'))}
    ${glyph('l-e', lab('e⁻', 'p7m-elab chn-halo', 'start', 9, 18))}
    ${glyph('l-h2o', lab('2 H₂O', 'chn-mol chn-halo'))}${glyph('l-o2', lab('O₂', 'chn-ol chn-halo', 'middle'))}`;
}

/* ---------------------------------------------------------------- the card: Ruben and Kamen, 1941 */

export type CardKind = 'one' | 'two';
const CD = { x: 1118, y: 22, w: 444, h: 698 };
/** Atom balls of the card (stage px): O yellow, ¹⁸O purple, C red-orange, each with its letter; H small, white. */
const ball = (x: number, y: number, k: 'O' | 'O18' | 'C' | 'H', r = 14): string => {
  if (k === 'H') return `<circle class="atom atom-H" cx="${f1(x)}" cy="${f1(y)}" r="${r}"/>`;
  if (k === 'O18') return `<circle class="p7m-o18" cx="${f1(x)}" cy="${f1(y)}" r="${r}"/><text class="p7m-o18t" x="${f1(x)}" y="${f1(y + 4.6)}" text-anchor="middle">¹⁸O</text>`;
  return `<circle class="atom atom-${k}" cx="${f1(x)}" cy="${f1(y)}" r="${r}"/><text class="${k === 'C' ? 'p7m-ct' : 'atom-t'}" x="${f1(x)}" y="${f1(y + 5)}" text-anchor="middle">${k}</text>`;
};
const water = (x: number, y: number, heavy: boolean): string =>
  `${ball(x - 14, y + 12, 'H', 8.5)}${ball(x + 14, y + 12, 'H', 8.5)}${ball(x, y, heavy ? 'O18' : 'O')}`;
const co2 = (x: number, y: number, heavy: boolean): string =>
  `${ball(x - 23.8, y, heavy ? 'O18' : 'O')}${ball(x + 23.8, y, heavy ? 'O18' : 'O')}${ball(x, y, 'C', 13)}`;
/** A bubble of O₂ (isotope or not), drawn round its origin. */
const bubble = (heavy: boolean): string =>
  `<circle class="p7m-bub" r="31"/>${ball(-11.5, 0, heavy ? 'O18' : 'O', 13.5)}${ball(11.5, 0, heavy ? 'O18' : 'O', 13.5)}`;
/** A round-bottom flask of water with algae; its neck (half-width n) ends in a lip at y = lip. */
function flask(p: string, cx: number, cy: number, R: number, lip: number, seed: number, n = 30): string {
  const ny = cy - Math.sqrt(R * R - n * n), liq = cy - R * 0.5;
  let s = seed, algae = '';
  const rnd = (): number => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  for (let i = 0; i < 11; i++) {
    const a = rnd() * Math.PI * 2, d = Math.sqrt(rnd()) * (R - 10), x = cx + Math.cos(a) * d, y = cy + Math.abs(Math.sin(a)) * d * 0.9 - 2;
    if (y > liq + 8) algae += `<circle class="p7m-alga" cx="${f1(x)}" cy="${f1(y)}" r="3.4"/>`;
  }
  return `<clipPath id="${p}-fl${seed}"><circle cx="${cx}" cy="${cy}" r="${R - 2}"/></clipPath>
    <rect class="p7m-water" x="${cx - R}" y="${f1(liq)}" width="${2 * R}" height="${2 * R}" clip-path="url(#${p}-fl${seed})"/>${algae}
    <path class="p7m-glass" d="M${cx - n},${lip}V${f1(ny)}A${R},${R} 0 1 0 ${cx + n},${f1(ny)}V${lip}"/>
    <path class="p7m-lip" d="M${cx - n - 7},${lip - 3}H${cx + n + 7}"/>`;
}
interface Bub { k: string; from: V; to: V; lk: string }
function cardSvg(p: string, kind: CardKind): { svg: string; bubs: Bub[] } {
  const { x, y, w, h } = CD, pw = 160, ph = 200, gap = 24, px0 = x + (w - 2 * pw - gap) / 2, py = y + 26;
  const por = (href: string, px: number): string => `<image href="${href}" x="${px}" y="${py}" width="${pw}" height="${ph}" preserveAspectRatio="xMidYMid slice"/>`;
  const head = `${por(rubenImg, px0)}${por(kamenImg, px0 + pw + gap)}
    <text class="clip-name p7m-cname" x="${px0 + pw / 2}" y="${py + ph + 34}" text-anchor="middle">Ruben</text>
    <text class="clip-name p7m-cname" x="${px0 + 1.5 * pw + gap}" y="${py + ph + 34}" text-anchor="middle">Kamen</text>
    <text class="clip-find p7m-year" x="${x + w / 2}" y="${py + ph + 72}" text-anchor="middle">1941</text>`;
  const keyY = y + h - 30;
  const key = `${ball(x + w / 2 - 124, keyY - 7, 'O18')}<text class="p7m-key" x="${x + w / 2 - 100}" y="${keyY}">= ¹⁸O, an oxygen isotope</text>`;
  const bubG = (k: string, heavy: boolean, s: string): string =>
    `${glyph(`${p}-${k}`, bubble(heavy))}${glyph(`${p}-l${k}`, `<text class="p7m-cl" x="0" y="8">${s}</text>`)}`;
  let exp = '';
  const bubs: Bub[] = [];
  if (kind === 'one') {
    const cx = x + w / 2, R = 88, lip = 412, cy = lip + 40 + Math.sqrt(R * R - 30 * 30);
    exp = `${flask(p, cx, cy, R, lip, 11)}${water(cx - 34, cy + 2, true)}${water(cx + 34, cy + 18, true)}${water(cx - 2, cy + 48, true)}
      <text class="p7m-cl" x="${cx}" y="${cy + R + 36}" text-anchor="middle">H₂¹⁸O</text>${bubG('b0', true, '¹⁸O₂')}`;
    bubs.push({ k: `${p}-b0`, lk: `${p}-lb0`, from: [cx + 4, cy - 34], to: [cx, lip - 50] });
  } else {
    const R = 70, lip = 418, cy = lip + 36 + Math.sqrt(R * R - 28 * 28), xs = [x + w * 0.27, x + w * 0.73];
    exp = `${flask(p, xs[0], cy, R, lip, 11, 28)}${flask(p, xs[1], cy, R, lip, 23, 28)}
      ${water(xs[0] - 24, cy - 8, true)}${water(xs[0] + 28, cy + 8, true)}${co2(xs[0] - 6, cy + 44, false)}
      ${water(xs[1] - 24, cy - 8, false)}${water(xs[1] + 28, cy + 8, false)}${co2(xs[1] - 6, cy + 44, true)}
      <text class="p7m-cl" x="${xs[0]}" y="${cy + R + 36}" text-anchor="middle">H₂¹⁸O + CO₂</text>
      <text class="p7m-cl" x="${xs[1]}" y="${cy + R + 36}" text-anchor="middle">H₂O + C¹⁸O₂</text>
      ${bubG('b0', true, '¹⁸O₂')}${bubG('b1', false, 'O₂')}`;
    bubs.push({ k: `${p}-b0`, lk: `${p}-lb0`, from: [xs[0] + 4, cy - 28], to: [xs[0], lip - 50] },
      { k: `${p}-b1`, lk: `${p}-lb1`, from: [xs[1] + 4, cy - 28], to: [xs[1], lip - 50] });
  }
  const svg = `<g data-k="card" opacity="0" display="none"><g transform="rotate(-1.2 ${x + w / 2} ${y + h / 2})">
    <defs><filter id="${p}-cardsh" x="-10%" y="-6%" width="120%" height="114%"><feDropShadow dx="1" dy="4" stdDeviation="6" flood-color="#3d3020" flood-opacity=".22"/></filter></defs>
    <path class="p7m-paper" d="${cutPath(x, y, w, h, 37, 3.2)}" filter="url(#${p}-cardsh)"/>${head}${exp}${key}</g></g>`;
  return { svg, bubs };
}

/* ---------------------------------------------------------------- label and leader places (figure units) */

/** Label anchors (start-anchored) and where their leaders leave them, in the close view. */
const L = {
  psii: { at: [14, 404] as V, from: [58, 390] as V, to: [62, 369] as V },
  rc: { at: [100, 206] as V, from: [112, 212] as V },
  pq: { at: [196, 244] as V, from: [208, 249] as V },
  oec: { at: [14, 440] as V, from: [118, 428] as V },
};

/* ---------------------------------------------------------------- the staging */

/** How plastoquinone reaches Q_B and leaves it: 'glide' (m1, m2: it moves into Q_B before light and back out along
 *  the membrane), 'bound' (pa: it sits in Q_B from the first frame; plastoquinol drops out and wanders off on a jittery
 *  path, while a second plastoquinone drifts in), 'pool' (pb: as 'bound', with a pool of plastoquinone swaying slowly in the
 *  membrane between PSII and b₆f the whole time). */
export type PqMode = 'glide' | 'bound' | 'pool';
export interface Opt { id: string; name: string; note: string; card: CardKind; pq?: PqMode; beats?: Beat[] }

/** The pool's places (pb) besides the slide's own plastoquinone (G.pq): the lower leaflet, clear of where PQH₂ rests. */
const POOL: V[] = [[226, 313], [253, 311]];
/** Where pb's second plastoquinol comes to rest in the pool (upper leaflet, at PSII's edge), and its lane out of Q_B. */
const POOL2: V = [211, 299], OUT2_C: V = [182, 300];

/** The readout per O₂ (pb), beside the figure in stage px: three bands as the membrane, stroma above, lumen below. */
const RO = { x: 1240, y: 56, w: 346 };
function readoutSvg(): string {
  const { x, y, w } = RO, bx = x + 12, bw = w - 24;
  const ring = (cx: number, cy: number): string => hring(cx, cy, 14);
  const arrowDown = (ax: number, y0: number, y1: number): string =>
    `<path class="chn-h" d="M${ax},${y0}V${y1 - 9}"/><path class="chn-hh" d="M${ax},${y1}l-6,-11h12z"/>`;
  const lozenge = (cx: number, cy: number): string =>
    `<ellipse class="chn-pq p7m-pq" cx="${cx}" cy="${cy}" rx="29" ry="14"/><text class="p7m-rolt" x="${cx}" y="${cy + 5.5}" text-anchor="middle">PQH₂</text>`;
  const heads = (yy: number): string => Array.from({ length: Math.floor(bw / 9) }, (_, i) => `<circle class="chn-head" cx="${bx + 5 + i * 9}" cy="${yy}" r="3.4"/>`).join('');
  const rx = [x + 150, x + 186, x + 222, x + 258];
  return `<g data-k="readout" opacity="0" display="none"><g class="fig">
    <rect class="p7m-ro" x="${x}" y="${y}" width="${w}" height="306" rx="14"/>
    <text class="p7m-rot" x="${x + 18}" y="${y + 32}">per O₂</text>
    <g data-k="ro-s" opacity="0" display="none"><rect class="chn-stromaf" x="${bx}" y="${y + 46}" width="${bw}" height="84"/>
      <text class="p7m-rol" x="${bx + 10}" y="${y + 66}">stroma</text>
      <text class="p7m-rox" x="${bx + 10}" y="${y + 90}">−4 H⁺ (taken by plastoquinone)</text>${rx.map(cx => ring(cx, y + 112)).join('')}</g>
    <g data-k="ro-m" opacity="0" display="none"><rect class="chn-bil" x="${bx}" y="${y + 130}" width="${bw}" height="76"/>${heads(y + 134)}${heads(y + 202)}
      ${[0, 1, 2, 3].map(i => `<circle class="p7m-e" cx="${bx + 22 + i * 17}" cy="${y + 160}" r="6.5"/>`).join('')}
      <text class="p7m-rox" x="${bx + 94}" y="${y + 166}">→</text>${lozenge(bx + 152, y + 160)}${lozenge(bx + 222, y + 160)}
      <text class="p7m-rox" x="${bx + 10}" y="${y + 192}">4 e⁻ → 2 plastoquinol</text>
      <g data-k="ro-sa" opacity="0" display="none">${arrowDown(x + 168, y + 116, y + 145)}${arrowDown(x + 240, y + 116, y + 145)}</g></g>
    <g data-k="ro-l" opacity="0" display="none"><rect class="chn-lumenf" x="${bx}" y="${y + 206}" width="${bw}" height="88"/>
      <text class="p7m-rol" x="${bx + 10}" y="${y + 228}">lumen</text>${rx.map(cx => ring(cx, y + 236)).join('')}
      <text class="p7m-rox" x="${bx + 10}" y="${y + 282}">+4 H⁺ (from water)</text></g>
  </g></g>`;
}
/** Controls of the two lanes through PSII's Q_B channel: plastoquinol out high, the new plastoquinone in low. */
const OUT_C: V = [193, 272], IN_C: V = [193, 318];
/** Deterministic noise: a sum of sines (seeded phases), about −1.8…1.8. */
const noise = (t: number, s: number, f: number[]): number => f.reduce((a, w, i) => a + Math.sin(w * t + s * (i + 1.7)) / (1 + 0.6 * i), 0);
/** A diffusive walk from a to b over u = 0…1 (along the lane through c): the progress wavers back and forth and the place
 *  jitters, most in the middle, nothing at both ends. */
function walk(a: V, c: V, b: V, u: number, t: number, seed: number, amp: V): V {
  const tau = Math.max(0, Math.min(1, u)), env = Math.sin(Math.PI * tau);
  const e = Math.max(0, Math.min(1, smoother(tau) + 0.1 * Math.sin(3 * Math.PI * tau + seed) * env));
  const p = bez(a, c, b, e);
  return [p[0] + amp[0] * env * noise(t, seed, [7.3, 12.7, 19.1]), p[1] + amp[1] * env * noise(t, seed + 3, [8.9, 15.3])];
}
/** The slow sway of a pool molecule (pb; lecturer, 28 Oct 2026: smooth, no zigzag): one sine per axis, periods 2.6–3.7 s,
 *  at most 1.8 units; wall clock, so it goes on while the player waits at a stop. */
const jig = (now: number, i: number): V => {
  const px = 2.6 + 0.3 * (i % 3), py = 3.4 + 0.25 * (i % 2);
  return [1.6 * Math.sin((2 * Math.PI * now) / px + i * 1.9), 0.8 * Math.sin((2 * Math.PI * now) / py + i * 2.7)];
};

export function makeStaging(o: Opt): Staging {
  const P = `p7${o.id}`;
  const mode: PqMode = o.pq ?? 'glide', wander = mode !== 'glide', pool = mode === 'pool';
  const B1 = wander ? B1W : B1G, B4 = pool ? B4P : wander ? B4W : B4G;
  const TEND = [B1.end, B2.end, B3.end, B4.end];
  const HOLDS = [[B1.h1, B1.h2], [B2.h], [B3.h], pool ? [B4.h1, B4.h2, B4P.h3, B4P.h4, B4P.h5] : [B4.h1, B4.h2]];
  /** Jitter of pa's walks (pb moves on smooth curves). */
  const AMP: V = [5, 3.2];
  /** A move from a to b along the lane through c: pb glides on a smooth eased curve; pa wanders (walk). */
  const move = (a: V, c: V, b: V, u: number, t: number, seed: number): V =>
    pool ? bez(a, c, b, smoother(u)) : walk(a, c, b, u, t, seed, AMP);
  const { svg: chain, geo: G } = scene(`${P}c`);
  const card = cardSvg(P, o.card);
  const QB: V = [G.qb[0], G.qb[1]];

  return {
    id: o.id,
    name: o.name,
    note: o.note,
    ...(o.beats ? { beats: o.beats } : {}),
    holds: HOLDS,
    svg: () => `
      <g data-k="cam"><g class="fig">
        <defs><filter id="${P}-sl" x="-5%" y="-5%" width="110%" height="112%"><feDropShadow dx="0" dy="8" stdDeviation="9" flood-color="#46321a" flood-opacity=".14"/></filter></defs>
        <rect class="p7m-slidecard" x="${CARD.x}" y="${CARD.y}" width="${CARD.w}" height="${CARD.h}" rx="${CARD.r}" filter="url(#${P}-sl)"/>
        <g data-k="chain" class="chn chn-${STYLE}">${chain}</g>
        ${overlaySvg(P, mode)}
      </g></g>
      ${card.svg}${pool ? readoutSvg() : ''}`,

    bind(stage) {
      const S = setters(stage), { q, set, op } = S;
      const chainG = q('chain');
      const parts = (p: string): SVGGElement[] => Array.from(chainG.querySelectorAll<SVGGElement>(`[data-p="${p}"]`));
      // counter-scaled: every text of the chain about its anchor, every glyph group (outermost .chn-g) about its centre
      const texts = Array.from(chainG.querySelectorAll<SVGTextElement>('text')).filter(el => !el.closest('.chn-g'))
        .map(el => ({ el, x: Number(el.getAttribute('x')), y: Number(el.getAttribute('y')) }));
      const gs = Array.from(chainG.querySelectorAll<SVGGElement>('.chn-g')).filter(el => !el.parentElement?.closest('.chn-g')).map(el => {
        const b = el.getBBox();
        return { el, c: [b.x + b.width / 2, b.y + b.height / 2] as V };
      });
      const lightW = parts('light-psii');
      lightW.forEach(g => g.setAttribute('clip-path', `url(#${P}-lclip)`));
      const flows = ['water', 'e-water-psii', 'e-psii-pq', 'pq-h-in'].flatMap(parts);
      const pqW = parts('pq'), b6fLit = parts('b6f-lit');
      // the plastoquinol label, centred over plastoquinone on the slide (as the slide's own "plastoquinone")
      const pq2G = q('l-pq2');
      pq2G.setAttribute('display', 'inline');
      const pq2Len = (pq2G.querySelector('text') as SVGTextElement).getComputedTextLength() || 190;
      pq2G.setAttribute('display', 'none');
      const scaleAt = (x: number, y: number, k: number): string =>
        `matrix(${k.toFixed(4)},0,0,${k.toFixed(4)},${(x * (1 - k)).toFixed(2)},${(y * (1 - k)).toFixed(2)})`;
      /** A glyph at figure point at, scaled sc, at opacity o. */
      const put = (k: string, at: V, sc: number, o: number): void => {
        const el = q(k);
        op(el, o);
        if (o > 0.004) set(el, 'transform', `translate(${f1(at[0])} ${f1(at[1])}) scale(${sc.toFixed(4)})`);
      };
      /** A leader through pts (ending on the glyph), its stroke and end dot scaled k. */
      const lead = (k: string, pts: V[], o: number, kk: number): void => {
        op(q(k), o);
        if (o <= 0.004) return;
        const d = pts.map((p, i) => `${i ? 'L' : 'M'}${f1(p[0])},${f1(p[1])}`).join(''), to = pts[pts.length - 1];
        set(q(`${k}-h`), 'd', d); set(q(`${k}-l`), 'd', d);
        set(q(`${k}-h`), 'style', `stroke-width:${(4 * kk).toFixed(2)}`);
        set(q(`${k}-l`), 'style', `stroke-width:${(1.3 * kk).toFixed(2)}`);
        const dot = q(`${k}-d`);
        set(dot, 'cx', f1(to[0])); set(dot, 'cy', f1(to[1])); set(dot, 'r', (3.2 * kk).toFixed(2));
        set(dot, 'style', `stroke-width:${(1.2 * kk).toFixed(2)}`);
      };
      /** The point at distance r from c towards `from` (a leader ends at a glyph's edge). */
      const edge = (c: V, from: V, r: number, ry = r): V => {
        const dx = from[0] - c[0], dy = from[1] - c[1], l = Math.hypot(dx, dy) || 1, ux = dx / l, uy = dy / l;
        const d = 1 / Math.hypot(ux / r, uy / ry);
        return [c[0] + ux * d, c[1] + uy * d];
      };

      let last = '';
      return (beatIn, t) => {
        const b = Math.max(0, Math.min(3, Math.round(beatIn)));
        const tt = Math.max(0, Math.min(t, TEND[b]));
        const now = performance.now() / 1000;
        const key = pool ? `${now}` : `${b}:${tt.toFixed(3)}`;
        if (key === last) return;
        last = key;
        /** Seconds into beat n: −1 before it begins, 99 after it. */
        const T = (n: number): number => (b === n ? tt : b > n ? 99 : -1);
        const t1 = T(0), t2 = T(1), t3 = T(2), t4 = T(3);

        /* ---- camera: in with beat 1, out in beat 4 */
        const zoom = mv(t1, B1.zoom, 1.2) * (1 - mv(t4, B4.out, 1.2));
        const cam = tween(B, Z, zoom), k = kOf(cam.s);
        set(q('cam'), 'transform', tfStr(cam));
        texts.forEach(({ el, x, y }) => set(el, 'transform', scaleAt(x, y, k)));
        gs.forEach(({ el, c }) => set(el, 'transform', scaleAt(c[0], c[1], k)));
        // labels that only the close view needs (the slide's own are out of view there)
        const zl = tw(t1, 1.1, 1.4) * (1 - tw(t4, B4.out, B4.out + 0.3));
        put('zl-stroma', [4, 178], k, zl);
        put('zl-lumen', [262, 424], k, zl);

        /* ---- the slide's lit arrows and water group give way while the story tells them, and come back at the end */
        const flowsOp = b === 0 ? 1 - tw(tt, B1.flowsOut[0], B1.flowsOut[1]) : b < 3 ? 0 : tw(tt, B4.flowsIn, B4.flowsIn + 0.5);
        flows.forEach(g => op(g, flowsOp));
        // the slide's plastoquinone and its label hand over to the story's lettered one and its leader
        const pqSlide = b === 0 ? 1 - tw(tt, B1.flowsOut[0], B1.flowsOut[1]) : 0;
        pqW.forEach(g => op(g, pqSlide));
        // light: the slide's own wave, cleared, then drawn in from above each time light arrives
        let lOp = 0, lY = 1000;
        if (b === 0) {
          if (tt < B1.light - 0.05) lOp = 1 - tw(tt, B1.flowsOut[0], B1.flowsOut[1]);
          else { lOp = 1 - tw(tt, B1.jump + 0.8, B1.jump + 1.1); lY = lerp(150, 262, smooth((tt - B1.light) / 0.5)); }
        } else if (b === 3) {
          if (tt < B4.out) { lOp = 1 - tw(tt, B4.jump + 0.7, B4.jump + 1.0); lY = lerp(150, 262, smooth((tt - B4.light) / 0.45)); }
          else lOp = tw(tt, B4.flowsIn, B4.flowsIn + 0.5);
          if (pool) [B4P.l3, B4P.l4].forEach(l => { lOp = Math.max(lOp, tw(tt, l, l + 0.15) * (1 - tw(tt, l + 0.55, l + 0.75))); });
        }
        lightW.forEach(g => op(g, lOp));
        set(q('lclip'), 'height', f1(lY + 200));
        const lightLab = b === 0 ? tw(t1, B1.light + 0.15, B1.light + 0.35) * (1 - tw(t1, B1.jump + 0.8, B1.jump + 1.1))
          : b === 3 ? tw(t4, B4.light + 0.1, B4.light + 0.3) * (1 - tw(t4, B4.jump + 0.7, B4.jump + 1.0)) : 0;
        put('zl-light', [52, 214], k, lightLab);

        /* ---- photosystem II: named, glows */
        const nPsii = tw(t1, B1.psii, B1.psii + 0.25) * (1 - tw(t4, B4.out, B4.out + 0.3));
        put('l-psii', L.psii.at, k, nPsii);
        lead('ld-psii', [L.psii.from, L.psii.to], nPsii, k);
        op(q('psiiglow'), b === 0 ? 0.9 * glowAt(tt, B1.psii, B1.psii + 1.2) : 0);

        /* ---- plastoquinone: named, glows, into its site at Q_B (beat 1); plastoquinol, out along the membrane (beat 4) */
        const dock = mv(t1, B1.dock, 1.0), go = mv(t4, B4.go, 1.0);
        let pq: V = go > 0 ? lerpV(QB, G.pq, go) : lerpV(G.pq, QB, dock);
        const zoomOut = mv(t4, B4.out, 1.2);
        if (wander) {
          // bound at Q_B from the first frame; as plastoquinol it drops out and diffuses to the slide's PQ place
          const u = (t4 - B4.go) / B4.goD;
          pq = u <= 0 ? QB : move(QB, OUT_C, G.pq, u, t4, 0.4);
          if (pool) { const j = jig(now, 0), a = tw(u, 0.85, 1.05) * (1 - zoomOut); pq = [pq[0] + j[0] * a, pq[1] + j[1] * a]; }
          // the next plastoquinone: waits at the slide's PQ place (in the pool), then drifts into the empty Q_B
          const un = (t4 - B4.newIn) / B4.newD;
          let pn: V = un <= 0 ? G.pq : move(G.pq, IN_C, QB, un, t4, 2.2);
          if (pool) { const j = jig(now, 1), a = 1 - tw(un, 0, 0.2); pn = [pn[0] + j[0] * a, pn[1] + j[1] * a]; }
          // pb: in Q_B it takes the other 2 e⁻ and 2 H⁺ from the stroma, and slips into the pool as a second plastoquinol
          const u2 = pool ? (t4 - B4P.out2) / B4P.out2D : -1;
          if (u2 > 0) {
            pn = move(QB, OUT2_C, POOL2, u2, t4, 5.1);
            const j = jig(now, 4), a = tw(u2, 0.85, 1.05);
            pn = [pn[0] + j[0] * a, pn[1] + j[1] * a];
          }
          const shown = b === 0 ? tw(tt, B1.flowsOut[0], B1.flowsOut[1]) : 1, poolOut = 1 - tw(t4, B4.out, B4.out + 0.5);
          put('pqn', pn, k, shown * (pool ? poolOut : 1));
          if (pool) {
            const swap2 = tw(t4, B4P.swap2, B4P.swap2 + 0.4);
            set(q('pqnb'), 'rx', f1(lerp(18, 21, swap2)));
            op(q('pqnt1'), 1 - swap2);
            op(q('pqnt2'), swap2);
            // its two electrons, one per short flash, from the reaction centre
            [B4P.l3, B4P.l4].forEach((l, i) => {
              const ue = t4 - (l + 0.3), z: V = [pn[0] + (i ? 8 : -8) * k, pn[1] + 12 * k];
              const at = ue < JUMP ? bez(G.rc, [Math.max(G.rc[0], z[0]) + 16 * k, (G.rc[1] + z[1]) / 2], z, smooth(ue / JUMP)) : z;
              put(`e${i + 3}`, at, k, ue >= 0 ? poolOut : 0);
            });
            // its two H⁺, from the stroma
            const hm2 = mv(t4, B4P.hMove2, 0.7);
            [0, 1].forEach(i => {
              const z: V = [pn[0] + (i ? 11 : -11) * k, pn[1] - 19 * k];
              put(`sh${i + 2}`, lerpV(G.sH[i], z, hm2), k * lerp(1, 9.5 / 12, hm2), tw(t4, B4P.hIn2, B4P.hIn2 + 0.2) * poolOut);
            });
            // the readout per O₂ (stage px, beside the figure: it stays to the end); on the stage, the H⁺ it counts glow
            const ro = tw(t4, B4P.ro, B4P.ro + 0.4);
            op(q('readout'), ro);
            op(q('ro-m'), ro);
            op(q('ro-s'), tw(t4, B4P.ro + 0.5, B4P.ro + 0.9));
            op(q('ro-sa'), tw(t4, B4P.ro + 0.6, B4P.ro + 1.0));
            op(q('ro-l'), tw(t4, B4P.ro + 1.1, B4P.ro + 1.5));
            const gS = glowAt(t4, B4P.ro + 0.5, B4P.ro + 1.3), gL = glowAt(t4, B4P.ro + 1.1, B4P.ro + 1.75);
            [pq, pq, pn, pn].forEach((c, i) => put(`gr${i}`, [c[0] + (i & 1 ? 11 : -11) * k, c[1] - 19 * k], k * 0.6, gS));
            G.wH.forEach((c, i) => put(`gw${i}`, c, k * 0.7, gL));
          }
          const nPool = b === 0 ? glowAt(tt, B1.pq, B1.pq + 1.0) : 0;
          put('g-pqn', pn, k, pool ? nPool : 0);
          if (pool) {
            // the rest of the pool jiggles in the membrane the whole time, and gives way when the camera leaves
            POOL.forEach((c, i) => {
              const j = jig(now, i + 2), at: V = [c[0] + j[0], c[1] + j[1]];
              put(`pp${i + 1}`, at, k, shown * (1 - tw(t4, B4.out, B4.out + 0.5)));
              put(`g-pp${i + 1}`, at, k, nPool);
            });
            const nP = tw(t1, B1.pq, B1.pq + 0.25) * (1 - tw(t4, B4.out, B4.out + 0.3));
            put('l-pool', [222, 356], k, nP);
            lead('ld-pool', [[236, 343], [236, 319]], nP, k);
          }
        }
        const swap = tw(t4, B4.swap, B4.swap + 0.4);
        put('pq', pq, k, b === 0 && !wander ? tw(tt, B1.flowsOut[0], B1.flowsOut[1]) : 1);
        set(q('pqb'), 'rx', f1(lerp(18, 21, swap)));
        op(q('pqt1'), 1 - swap);
        op(q('pqt2'), swap);
        put('g-pq', pq, k, b === 0 ? glowAt(tt, B1.pq, B1.pq + 1.0) : 0);
        // its label: beside it in the close view, centred over it on the slide (as the slide's own label)
        const nPq = tw(t1, B1.pq, B1.pq + 0.25);
        const pqAt: V = lerpV([G.pq[0] - (pq2Len * k) / 2, G.pq[1] - 46], L.pq.at, zoom);
        const pqFrom: V = lerpV([G.pq[0] + 40, G.pq[1] - 41], L.pq.from, zoom);
        put('l-pq', pqAt, k, nPq * (1 - swap));
        put('l-pq2', pqAt, k, swap);
        // the leader meets the lozenge at its near end (pa, pb: its left end once plastoquinol has wandered right of it)
        const pqEnd = wander && pqFrom[0] < pq[0] - 10 * k ? -1 : 1;
        lead('ld-pq', [pqFrom, [pq[0] + pqEnd * (lerp(18, 21, swap) + 2.5) * k, pq[1] - 2 * k]], nPq, k);

        /* ---- the reaction centre: named with its electron; the flash; the empty place; refilled from water */
        const nRc = tw(t1, B1.rc, B1.rc + 0.25) * (1 - tw(t4, B4.hIn - 0.05, B4.hIn + 0.2));
        put('l-rc', L.rc.at, k, nRc);
        lead('ld-rc', [L.rc.from, [L.rc.from[0], G.rc[1]], [G.rc[0] - 8.5 * k, G.rc[1]]], nRc, k);
        const fl = b === 0 ? Math.max(glowAt(tt, B1.rc, B1.rc + 1.0), pulse(tt, B1.flash))
          : b === 3 ? Math.max(pulse(tt, B4.flash), pool ? Math.max(pulse(tt, B4P.l3 + 0.2), pulse(tt, B4P.l4 + 0.2)) : 0) : 0;
        put('g-rc', G.rc, k, fl);
        const firstBack = B3.e + B3.eD; // the first electron from water arrives
        const riders = 1 - tw(t4, B4.out, B4.out + 0.3);
        const ring = b === 0 ? tw(tt, B1.jump + 0.05, B1.jump + 0.15) : b === 1 ? 1 : b === 2 ? 1 - tw(tt, firstBack - 0.05, firstBack) : 0;
        put('rcring', G.rc, k, ring);
        const dot = b === 0 ? tw(tt, B1.rc, B1.rc + 0.2) * (tt < B1.jump ? 1 : 0) : b === 1 ? 0 : b === 2 ? tw(tt, firstBack - 0.05, firstBack) : riders;
        put('rcdot', G.rc, k, dot);

        // the jumps: the reaction centre → plastoquinone at Q_B, arching through the protein
        const onPq = (i: number): V => [pq[0] + (i ? 8 : -8) * k, pq[1] + 12 * k];
        const jump = (u0: number, i: number): V => {
          const u = smooth(u0 / JUMP), a = G.rc, z = onPq(i);
          return bez(a, [Math.max(a[0], z[0]) + 16 * k, (a[1] + z[1]) / 2], z, u);
        };
        const u1 = b === 0 ? tt - B1.jump : 99, e1 = u1 >= 0 ? jump(Math.min(u1, JUMP), 0) : G.rc;
        put('e1', e1, k, b === 0 ? (tt < B1.jump ? 0 : 1) : 1);
        const u2 = b === 3 ? tt - B4.jump : b > 3 ? 99 : -1;
        put('e2', u2 >= 0 ? jump(Math.min(u2, JUMP), 1) : G.rc, k, u2 >= 0 ? 1 : 0);
        // the e⁻ label: on the reaction centre's electron, with it to plastoquinone (gives way when the H⁺ arrive)
        put('l-e', b === 0 && tt < B1.jump ? G.rc : e1, k, b === 0 ? tw(tt, B1.rc, B1.rc + 0.2) : 1 - tw(t4, B4.jump - 0.1, B4.jump + 0.1));

        /* ---- the card (beat 2) */
        op(q('card'), b === 1 ? tw(tt, B2.card, B2.card + 0.3) : b === 2 ? 1 - tw(tt, B3.cardOut, B3.cardOut + 0.3) : 0);
        card.bubs.forEach((bb, i) => {
          const u = b === 1 ? (tt - B2.bub - i * 0.1) / B2.bubD : b > 1 ? 1 : -1;
          const el = q(bb.k);
          op(el, u >= 0 ? tw(u, 0, 0.12) : 0);
          if (u >= 0) { const at = lerpV(bb.from, bb.to, smooth(u)); set(el, 'transform', `translate(${f1(at[0])} ${f1(at[1])})`); }
          const le = q(bb.lk);
          op(le, b === 1 ? tw(tt, B2.lab, B2.lab + 0.25) : b > 1 ? 1 : 0);
          set(le, 'transform', `translate(${f1(bb.to[0] + 38)} ${f1(bb.to[1])})`);
        });

        /* ---- water splitting (beat 3) */
        const nOec = tw(t3, B3.site, B3.site + 0.25) * (1 - tw(t4, B4.out, B4.out + 0.3));
        put('l-oec', L.oec.at, k, nOec);
        lead('ld-oec', [L.oec.from, edge(G.oec, L.oec.from, 6 * k)], nOec, k);
        put('g-oec', G.oec, k, b === 2 ? glowAt(tt, B3.site, B3.site + 1.0) : 0);
        const W_FROM: V[] = [[176, 452], [204, 446]];
        const W_AT: V[] = [[G.oec[0] + 12 * k, G.oec[1] + 16 * k], [G.oec[0] + 54 * k, G.oec[1] + 20 * k]];
        const wIn = tw(t3, B3.in, B3.in + 0.2), wMove = mv(t3, B3.move, 1.0), split = mv(t3, B3.split, 0.45);
        const wAt = (i: number): V => lerpV(W_FROM[i], W_AT[i], wMove);
        const before = t3 < B3.split;
        // the slide's own water group takes over at the end
        const lumenOut = b === 3 ? 1 - tw(tt, B4.flowsIn, B4.flowsIn + 0.5) : 1;
        // the two O atoms pair into O₂ at the site, which then leaves along the slide's O₂ arrow to the slide's O₂
        const o2c: V = [G.oec[0] + 30 * k, G.oec[1] + 24 * k], o2go = mv(t3, B3.o2go, 0.8), o2at = lerpV(o2c, G.o2, o2go);
        [0, 1].forEach(i => {
          const pair: V = [o2at[0] + (i ? 8.5 : -8.5) * k, o2at[1]];
          put(`wo${i}`, before ? wAt(i) : lerpV(W_AT[i], pair, Math.min(1, split * 1.6)), k, wIn * lumenOut);
        });
        // the four H atoms become ringed H⁺ and move to the slide's four H⁺ in the lumen
        const hMove = mv(t3, B3.split + 0.1, 0.9);
        [0, 1, 2, 3].forEach(i => {
          const w = wAt(i >> 1), h0: V = [w[0] + (i & 1 ? 11 : -11) * k, w[1] + 9 * k];
          put(`wh${i}`, before ? h0 : lerpV(h0, G.wH[i], hMove), k, wIn * lumenOut);
          op(q(`wha${i}`), 1 - tw(t3, B3.split, B3.split + 0.2));
          op(q(`whp${i}`), tw(t3, B3.split, B3.split + 0.2));
        });
        put('l-h2o', [wAt(1)[0] + 22 * k, wAt(1)[1] + 7 * k], k, wIn * (1 - tw(t3, B3.split - 0.1, B3.split + 0.1)));
        put('l-o2', G.o2Lab, k, tw(t3, B3.o2go + 0.7, B3.o2go + 0.9) * lumenOut);
        // the four electrons go up to the reaction centre, one after another, and refill it
        [0, 1, 2, 3].forEach(i => {
          const t0 = B3.e + i * B3.eGap, u = (t3 - t0) / B3.eD;
          put(`w${i}`, bez(G.oec, [G.oec[0] - 14 * k, (G.oec[1] + G.rc[1]) / 2], G.rc, smooth(u)), k, u >= 0 && u < 1 ? 1 : 0);
        });

        /* ---- plastoquinone takes 2 H⁺ from the stroma (beat 4) and carries them on */
        const hShow = tw(t4, B4.hIn, B4.hIn + 0.2), hm = mv(t4, B4.hMove, 0.8);
        [0, 1].forEach(i => {
          const z: V = [pq[0] + (i ? 11 : -11) * k, pq[1] - 19 * k];
          put(`sh${i}`, lerpV(G.sH[i], z, hm), k * lerp(1, 9.5 / 12, hm), hShow);
        });

        /* ---- cytochrome b₆f starts to light */
        b6fLit.forEach(g => op(g, B6F_END * tw(t4, B4.b6f, B4.b6f + 0.6)));
      };
    },
  };
}

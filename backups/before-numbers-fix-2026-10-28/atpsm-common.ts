// ATP synthase on the slide 10 figure (ETC_ANIM_BRIEF, 28 Oct 2026): the parts both stagings (atps-m1, atps-m2) share.
// The stage IS the slide 10 figure, variant 10m1: focusSvg(id, { look: 'bil', lit: LIT_ATPS, g: { mol: true } }) of
// figs/chain.ts, drawn in the slide's figure card. Molecules in the 7m1 glyph style (GLYPH_BRIEF §1): H⁺ as ringed marks,
// ADP, Pᵢ and ATP as tags. The lecturer read the earlier version as a proton pump (only H⁺ moved), so here H⁺ visibly
// flow down their gradient (crowded acid lumen, pH ≈ 6 → stroma, pH ≈ 8), the rotor visibly turns with them, ADP + Pᵢ
// visibly enter the head and ATP leaves it, and a counter reads 14 H⁺ → 1 turn → 3 ATP.
// - Beat 1 (opens on the slide figure): 14 ringed H⁺ leave the water-splitting site of photosystem II (one in three) and
//   cytochrome b₆f (two in three: the Q cycle moves 8 of the 12 H⁺ per 4 e⁻) and spread through the lumen, whose blue
//   deepens; "pH ≈ 6" and "pH ≈ 8" appear by the zone names (Kramer, Sacksteder & Cruz 1999).
// - Beat 2: the chain moves left; the Jagendorf & Uribe card: their Table 1 as a clipping, and the experiment drawn:
//   chloroplasts in acid (pH 3.8, the table's) → basic buffer (pH 8) with ADP + Pᵢ → ATP, in the dark.
// - Beat 3, two steps. Point: the card goes, the camera zooms into ATP synthase; leaders name the rotor (c-ring) and the
//   head, each glows in turn (click stop). Do: the 14 H⁺ go one by one from the lumen through the rotor to the stroma;
//   each moves the rotor on by 1/14 turn; ADP + Pᵢ enter the head, ATP leaves it, three times in the turn; the counter.
//   m1 stays on the render (subunit stripes turn on the c-ring); m2 cuts the render open (atpsm-cut.ts).
// - Beat 4: back out to the whole slide; the slide's own H⁺ path and ADP + Pᵢ → ATP return; NADPH lights beside ATP.
//
// How the slide figure is reused (figs/chain.ts is not modified):
// - focusSvg() wraps every part in <g class="chn-on|off">; the part of each wrapper is found by drawing the view once per
//   part with only that part lit (plus 'h-water', drawn only when lit, so every probe has the same wrappers).
// - Positions are read from the drawing: the ringed H⁺ of water and of b₆f, ATP synthase's render box. The c-ring anchor
//   and the H⁺ path through ATP synthase are those of chain.ts (chain-structures.json cring, the same offsets). The
//   rotor's extent on the render (c-ring 76–220 × 386–538 px, central stalk 108–212 × 290–386 px of atps.webp,
//   343 × 557 px) was measured from the render's three tints (atps10-common.ts).
// - The rotor turns counterclockwise seen from the stroma, as in ATP synthesis (Noji et al. 1997 saw F₁ turn the other
//   way while hydrolysing ATP): its front face moves to the right.
// - The camera scales the whole schema; texts and glyph groups are counter-scaled by (s/s₀)^−0.7 about their own centre.
//
// Image: jagendorf1966-acid-bath-table1.png (Jagendorf & Uribe 1966, PNAS 55:170, Table 1; as atps10-common.ts).
import '../figs/clipping.css';
import './atpsm-common.css';
import atpsHref from '../../assets/chain/atps.webp';
import tableImg from '../../assets/refs/L5-electron-transport/jagendorf1966-acid-bath-table1.png';
import { focusSvg, hring, LIT_ATPS, rowG, tagG, type Glyphs, type Part } from '../figs/chain';
import { cutPath, f1, lerp, lerpV, rng, setters, smooth, smoother, tfStr, tw, tween, type Tf, type V } from './antenna-common';
import type { Staging } from './types';

/* ---------------------------------------------------------------- the slide figure (10m1), tagged by part */

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
const view = (id: string, lit: Part[]): string => focusSvg(id, { look: 'bil', lit, g: GL, say: '' });
/** The part of each wrapper: draw the view with one part lit at a time ('h-water' always lit, see above). */
function partsOf(): Array<Part | null> {
  const out: Array<Part | null> = wraps(view('amprobe', ['h-water'])).map(w => (w.on ? 'h-water' : null));
  for (const p of PARTS) wraps(view('amprobe', ['h-water', p])).forEach((w, i) => { if (w.on && out[i] === null) out[i] = p; });
  return out;
}
const strip = (s: string): string => s.replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
const esc = (s: string): string => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const NUM = '(-?[\\d.]+)';
const circlesOf = (s: string, cls: string): V[] =>
  [...s.matchAll(new RegExp(`<circle class="${cls}" cx="${NUM}" cy="${NUM}"`, 'g'))].map(m => [Number(m[1]), Number(m[2])]);

/** Where the story happens, read from the drawing (fallbacks: chain.ts's c2c layout). */
export interface Geo {
  /** the slide's ringed H⁺: from water (4), from b₆f (2) */
  hW: V[]; hB: V[];
  /** ATP synthase: its render's box (x, y, w, h) and figure units per render pixel */
  img: [number, number, number, number]; px: number;
  /** the c-ring anchor and the slide's H⁺ path through ATP synthase, lumen → stroma */
  ring: V; path: V[];
  /** the lumen field: top and height */
  lum: [number, number];
}

interface Scene { svg: string; bil: string; geo: Geo }
function scene(id: string): Scene {
  const base = strip(view(id, LIT_ATPS)), litN = strip(view(id, [...LIT_ATPS, 'nadph']));
  const parts = partsOf(), wb = wraps(base), wn = wraps(litN);
  const inner = (p: Part): string => wb.filter((_, i) => parts[i] === p).map(w => w.inner).join('');
  let svg = '', at = 0;
  wb.forEach((w, i) => {
    const p = parts[i] ?? 'x';
    svg += `${base.slice(at, w.a)}<g class="chn-${w.on ? 'on' : 'off'}" data-p="${p}">${w.inner}</g>`;
    if (p === 'nadph' && wn[i]) svg += `<g class="chn-on" data-p="nadph-lit" opacity="0">${wn[i].inner}</g>`;
    at = w.b;
  });
  svg += base.slice(at);

  // the lumen's blue deepens under an overlay; the stroma and lumen fields (and the overlay) run on to x 1600 under a
  // mask that shows them only up to the figure's edge (x 800) until the close view
  const fade = `mask="url(#${id}-fade)"`, wide = (r: string): string => r.replace('<rect ', `<rect ${fade} `).replace('width="800"', 'width="1600"');
  const lm = new RegExp(`<rect class="chn-lumenf" x="0" y="${NUM}" width="800" height="${NUM}"/>`).exec(svg);
  const lum: [number, number] = lm ? [Number(lm[1]), Number(lm[2])] : [319, 133];
  if (lm) svg = svg.replace(lm[0], `${wide(lm[0])}<rect data-k="acid" class="am-acid" ${fade} x="0" y="${lum[0]}" width="1600" height="${lum[1]}" opacity="0"/>`);
  const sm = /<rect class="chn-stromaf"[^>]*\/>/.exec(svg);
  if (sm) svg = svg.replace(sm[0], wide(sm[0]));
  const bil = /<rect class="chn-bil"[^>]*\/><path class="chn-tail" d="[^"]*"\/><path class="chn-head" d="[^"]*"\/>/.exec(base)?.[0] ?? '';

  const im = new RegExp(`<image href="${esc(atpsHref)}" x="${NUM}" y="${NUM}" width="${NUM}" height="${NUM}"`).exec(base);
  const [ix, iy, iw, ih] = im ? im.slice(1, 5).map(Number) : [640, 116.8, 135.8, 220.5];
  const px = iw / 343, ring: V = [ix + 146.6 * px, iy + 463.8 * px];
  const hW = circlesOf(inner('h-water'), 'chn-hr'), hB = circlesOf(inner('pq-h-out'), 'chn-hr');
  return {
    svg, bil,
    geo: {
      hW: hW.length === 4 ? hW : [[204.1, 391.3], [232.9, 381.7], [210.5, 420.1], [239.3, 413.7]],
      hB: hB.length === 2 ? hB : [[285.3, 388.4], [313.8, 403.6]],
      img: [ix, iy, iw, ih], px, ring,
      path: [[ring[0] - 2, ring[1] + 30], [ring[0] - 8, ring[1]], [ring[0] - 14, ring[1] - 34], [ring[0] - 30, ring[1] - 52]],
      lum,
    },
  };
}

/* ---------------------------------------------------------------- views */

/** The whole chain: the slide's figure card (860 × 642 px around the 800 × 600 figure drawn at 0.97) fills the stage. */
export const B: Tf = { s: 1.07, t: [800 - 1.07 * 400, 370 - 1.07 * 300] };
/** Beat 2: the chain at the left, room for the card on the right. */
const B2: Tf = { s: 0.93, t: [60, 91] };
/** Text and glyph scale for a camera scale s: closer in, they grow less than the structures; further out (beat 2), they
 *  shrink with the chain, so its labels keep their spacing. */
export const kOf = (s: number): number => (s > B.s ? (s / B.s) ** -0.7 : 1);
/** The slide's figure card, in figure units (pilot.css .lay-figure .fig, with the paper look's fill and edge). */
const CARD = { x: -43.3, y: -30.9, w: 886.6, h: 661.9, r: 22.7 };

/* ---------------------------------------------------------------- timing (s into each beat) */

/** A move of about 1 s: 0 → 1 from t0 over d, eased at both ends. */
export const mv = (t: number, t0: number, d: number): number => smoother((t - t0) / d);
/** A short pulse: up over 0.15 s from t0, down by t0 + 0.6. */
export const pulse = (t: number, t0: number): number => tw(t, t0, t0 + 0.15) * (1 - tw(t, t0 + 0.3, t0 + 0.6));
/** A glow that rises, holds and fades: [t0, t0 + d]. */
export const glowAt = (t: number, t0: number, d = 1.0): number => tw(t, t0, t0 + 0.25) * (1 - tw(t, t0 + d - 0.35, t0 + d));
const bez = (a: V, c: V, b: V, u: number): V => {
  const v = 1 - u;
  return [v * v * a[0] + 2 * v * u * c[0] + u * u * b[0], v * v * a[1] + 2 * v * u * c[1] + u * u * b[1]];
};
/** The point a fraction u along a polyline, by length. */
export function along(q: V[], u: number): V {
  const seg = q.slice(1).map((p, i) => Math.hypot(p[0] - q[i][0], p[1] - q[i][1])), L = seg.reduce((a, b) => a + b, 0);
  let d = Math.max(0, Math.min(1, u)) * L, i = 0;
  while (i < seg.length - 1 && d > seg[i]) { d -= seg[i]; i++; }
  return lerpV(q[i], q[i + 1], seg[i] ? Math.min(1, d / seg[i]) : 1);
}
const plen = (q: V[]): number => q.slice(1).reduce((a, p, i) => a + Math.hypot(p[0] - q[i][0], p[1] - q[i][1]), 0);

// Beat 1: the slide's H⁺ path, arrow and ATP give way; 14 H⁺ spread through the lumen; the blue deepens; the pH labels.
const B1 = { out: 0.4, d0: 0.3, gap: 0.16, dD: 1.0, tint: [0.3, 3.2], ph: 3.5, end: 4.2 };
// Beat 2: the chain moves left; the card; on it, ADP + Pᵢ go into the basic tube, then ATP.
const B2T = { camD: 0.9, card: 0.45, adp: 1.3, atp: 2.0, end: 2.6 };
/** Beat 3, step "point": zoom in; the rotor is named and glows, then the head. Step "do" begins at HOLD3. */
export const B3 = { zoom: 0.1, zoomD: 1.2, labs: 1.1, rotor: 1.5, head: 2.6, hold: 3.8 };
/** Beat 3, step "do": the counter; the 14 H⁺ pass (each reaches the rotor's entry tE(j) = t0 + j·gap and crosses in
 *  cross s); lumen H⁺ move at v figure units per s. */
export const PASS = { counter: 3.85, t0: 4.5, gap: 0.4, cross: 0.85, v: 260, drift: 1.1 };
const N_H = 14;
const tE = (j: number): number => PASS.t0 + j * PASS.gap;
/** The rotor's progress in H⁺ (0–14) t s into beat 3: each H⁺ moves it on by 1/14 turn while it crosses. */
export const nPassed = (t: number): number => {
  let n = 0;
  for (let j = 0; j < N_H; j++) n += Math.max(0, Math.min(1, (t - tE(j)) / PASS.cross));
  return n;
};
/** When a progress function first reaches the value v (s into beat 3). */
export function whenAt(prog: (t: number) => number, v: number): number {
  let t = PASS.t0 - 1;
  while (prog(t) < v - 1e-6 && t < 40) t += 0.005;
  return t;
}
const B3END = tE(N_H - 1) + PASS.cross + PASS.drift + 0.3;
// Beat 4: zoom out; the story's glyphs go and the slide's arrows come back; the blue returns; NADPH lights.
const B4 = { zoom: 0.05, zoomD: 1.2, glyphs: [0.35, 0.9], flowsIn: 0.8, tint: [0.3, 1.25], nadph: 1.3, end: 1.9 };
export const TEND = [B1.end, B2T.end, B3END, B4.end];
export const HOLDS: number[][] = [[], [], [B3.hold], []];

/* ---------------------------------------------------------------- the story's H⁺ in the lumen */

/** Where the 14 H⁺ settle (figure units), clear of the labels, the carriers and the slide's own H⁺. */
/** The slide's zone names (chain.ts pdbStyle): the pH labels sit under "stroma" and over "lumen". */
const ZONE_S: V = [14, 30], ZONE_L: V = [786, 440];
const CLOUD: V[] = [[262, 432], [300, 438], [346, 394], [478, 376], [512, 420], [540, 372], [566, 432], [588, 394],
  [618, 362], [624, 426], [652, 392], [676, 432], [702, 398], [590, 362]];
/** Their source on the slide: one in three from water splitting, two in three from b₆f (the Q cycle). */
const srcOf = (g: Geo, i: number): V => (i % 3 === 0 ? g.hW[(i / 3) % 4] : g.hB[i % 2]);

/* ---------------------------------------------------------------- glyphs: drawn round their origin at the slide's size */

export const glyph = (k: string, inner: string, o = 0): string => `<g data-k="${k}" opacity="${o}">${inner}</g>`;
export const lab = (s: string, cls: string, x: number, y: number, a: 'start' | 'middle' | 'end' = 'start'): string =>
  `<text class="${cls}" x="${x}" y="${y}" text-anchor="${a}">${s}</text>`;
export const H_RING = hring(0, 0, 12);
const ADP_ROW = rowG(0, 0, [['ADP', 'atp'], ['+', 'op'], ['', 'pi']]);
const ATP_TAG = `<g class="chn-g">${tagG(0, 0, 'ATP', 'atp')}</g>`;
/** A leader: from the label's side to a point on the structure, in chain.css's callout style (figure units, around 0). */
export const leader = (d: string, to: V): string =>
  `<path class="chn-ldh" d="${d}"/><path class="chn-ld" d="${d}"/><circle class="chn-ldt" cx="${f1(to[0])}" cy="${f1(to[1])}" r="3.2"/>`;

/* ---------------------------------------------------------------- the counter: 14 H⁺ → 1 turn → 3 ATP (stage units) */

export const CTR = { x: 1004, y: 18, w: 566, h: 96 };
/** The counter's parts, x from its left edge. */
const CX = { nH: 64, h: 96, ar1: 146, dial: 196, turn: 236, ar2: 418, nA: 470, atp: 512 };
function counterSvg(): string {
  const { x, y, w, h } = CTR, cy = y + h / 2, dc: V = [x + CX.dial, cy];
  const ticks = Array.from({ length: N_H }, (_, i) => {
    const a = (i / N_H) * 2 * Math.PI;
    return `M${f1(dc[0] + 22 * Math.sin(a))},${f1(dc[1] - 22 * Math.cos(a))}L${f1(dc[0] + 29 * Math.sin(a))},${f1(dc[1] - 29 * Math.cos(a))}`;
  }).join('');
  return `<g data-k="ctr" opacity="0" class="fig"><rect class="am-ctr" x="${x}" y="${y}" width="${w}" height="${h}" rx="14"/>
    <text class="am-num" data-k="c-h" x="${x + CX.nH}" y="${cy + 12}" text-anchor="end">0</text>
    <g transform="translate(${x + CX.h} ${cy}) scale(1.55)">${H_RING}</g>
    <text class="am-op" x="${x + CX.ar1}" y="${cy + 10}" text-anchor="middle">→</text>
    <circle class="am-dial" cx="${dc[0]}" cy="${dc[1]}" r="29"/><path class="am-dial-t" d="${ticks}"/>
    <path class="am-dial-f" data-k="c-dial" d=""/><circle class="am-dial-c" cx="${dc[0]}" cy="${dc[1]}" r="5"/>
    <text class="am-num am-num-s" x="${x + CX.turn}" y="${cy + 10}"><tspan data-k="c-t">0/14</tspan><tspan class="am-unit" dx="10">turn</tspan></text>
    <text class="am-op" x="${x + CX.ar2}" y="${cy + 10}" text-anchor="middle">→</text>
    <text class="am-num" data-k="c-a" x="${x + CX.nA}" y="${cy + 12}" text-anchor="end">0</text>
    <g transform="translate(${x + CX.atp} ${cy}) scale(1.3)">${ATP_TAG}</g></g>`;
}
/** The dial's filled sector for a fraction u of a turn (counterclockwise seen from the stroma: drawn so on the dial). */
function dialPath(u: number): string {
  const { x, y, h } = CTR, c: V = [x + CX.dial, y + h / 2], r = 20;
  if (u <= 0.001) return '';
  if (u >= 0.999) return `M${c[0] - r},${c[1]}a${r},${r} 0 1 0 ${2 * r},0a${r},${r} 0 1 0 ${-2 * r},0Z`;
  const a = -u * 2 * Math.PI, e: V = [c[0] + r * Math.sin(a), c[1] - r * Math.cos(a)];
  return `M${c[0]},${c[1]}V${c[1] - r}A${r},${r} 0 ${u > 0.5 ? 1 : 0} 0 ${f1(e[0])},${f1(e[1])}Z`;
}

/* ---------------------------------------------------------------- the card: Jagendorf and Uribe, 1966 */

const CD = { x: 878, y: 40, w: 694, h: 660 };
/** Table 1, its first three columns (reaction mixture, acid pH, luciferase assay), in the scan's pixels (720 × 232). */
const CROP = { x: 40, y: 52, w: 356, h: 114 };
const arrowR = (x0: number, x1: number, y: number): string =>
  `<path class="am-ar" d="M${x0},${y}H${x1 - 12}"/><path class="am-arh" d="M${x1},${y}L${x1 - 15},${y - 8.5}L${x1 - 15},${y + 8.5}Z"/>`;
/** A test tube of liquid with chloroplasts (and ringed H⁺ in the acid one); its rim at y = top. */
function tube(p: string, k: string, cx: number, top: number, liq: string, seed: number, hplus: boolean): string {
  const r = 34, bot = top + 168, ly = top + 44, rnd = rng(seed);
  const shape = `M${cx - r},${top}V${bot - r}A${r},${r} 0 0 0 ${cx + r},${bot - r}V${top}`;
  let chl = '';
  const spots: V[] = hplus ? [[-14, 14], [14, 44], [-12, 70], [14, 92], [-4, 112]] : [[-12, 18], [10, 44], [-8, 70], [12, 92], [0, 112]];
  spots.forEach(([dx, dy], i) => {
    const x = cx + dx, y = ly + dy - 4;
    chl += `<ellipse class="am-chl" cx="${f1(x)}" cy="${f1(y)}" rx="9" ry="5.5" transform="rotate(${f1((rnd() - 0.5) * 70 + i * 9)} ${f1(x)} ${f1(y)})"/>`;
  });
  const hs = hplus ? `<g class="fig">${[[12, 22], [-12, 58], [12, 96]].map(([dx, dy]) => hring(cx + dx, ly + dy, 11)).join('')}</g>` : '';
  return `<clipPath id="${p}-${k}"><path d="${shape}Z"/></clipPath>
    <rect class="${liq}" x="${cx - r}" y="${ly}" width="${2 * r}" height="${bot - ly}" clip-path="url(#${p}-${k})"/>${chl}${hs}
    <path class="am-glass" d="${shape}"/><path class="am-lip" d="M${cx - r - 7},${top}H${cx + r + 7}"/>`;
}
/** No light: a sun, struck through, and the word. */
function noLight(x: number, y: number): string {
  const rays = Array.from({ length: 8 }, (_, i) => {
    const a = (i * Math.PI) / 4;
    return `M${f1(x + 13 * Math.cos(a))},${f1(y + 13 * Math.sin(a))}L${f1(x + 19.5 * Math.cos(a))},${f1(y + 19.5 * Math.sin(a))}`;
  }).join('');
  return `<circle class="am-sunc" cx="${x}" cy="${y}" r="8.5"/><path class="am-sun" d="${rays}"/><path class="am-slash" d="M${x - 21},${y - 21}L${x + 21},${y + 21}"/>
    ${lab('dark', 'am-cl', x, y + 46, 'middle')}`;
}
function cardSvg(p: string): string {
  const { x, y, w, h } = CD, cx = x + w / 2;
  const tw_ = 560, th = (tw_ * CROP.h) / CROP.w, m = 18, cw = tw_ + 2 * m, ch = th + 2 * m, kx = cx - cw / 2, ky = y + 118;
  const table = `<g transform="rotate(-1.4 ${f1(cx)} ${f1(ky + ch / 2)})">
      <path class="clip-paper" d="${cutPath(kx, ky, cw, ch, 41, 3.4)}" filter="url(#${p}-tsh)"/>
      <svg x="${f1(kx + m)}" y="${f1(ky + m)}" width="${tw_}" height="${f1(th)}" viewBox="${CROP.x} ${CROP.y} ${CROP.w} ${CROP.h}" preserveAspectRatio="none">
        <image href="${tableImg}" x="0" y="0" width="720" height="232" filter="url(#${p}-ink)"/></svg></g>`;
  // the experiment: acid → basic + ADP + Pᵢ → ATP, in the dark
  const top = ky + ch + 92, xs = [x + 130, x + 346, x + 560], mid = top + 96;
  const exp = `${tube(p, 't1', xs[0], top, 'am-acidl', 5, true)}${tube(p, 't2', xs[1], top, 'am-basel', 9, false)}
    ${arrowR(xs[0] + 54, xs[1] - 52, mid)}${arrowR(xs[1] + 54, xs[2] - 62, mid)}
    ${lab('pH 3.8', 'am-cl', xs[0], top + 212, 'middle')}${lab('pH 8', 'am-cl', xs[1], top + 212, 'middle')}
    ${glyph('c-adp', `<g class="fig" transform="translate(${xs[1]} ${top - 40}) scale(1.3)">${ADP_ROW}</g>`)}
    ${glyph('c-atp', `<g class="fig" transform="translate(${xs[2]} ${mid}) scale(1.7)">${ATP_TAG}</g>`)}
    ${noLight(x + w - 52, y + 52)}`;
  return `<g data-k="card" opacity="0"><g transform="rotate(-1.2 ${x + w / 2} ${y + h / 2})">
    <defs><filter id="${p}-cardsh" x="-10%" y="-6%" width="120%" height="114%"><feDropShadow dx="1" dy="4" stdDeviation="6" flood-color="#3d3020" flood-opacity=".22"/></filter>
      <filter id="${p}-tsh" x="-6%" y="-12%" width="112%" height="130%"><feDropShadow dx="1" dy="3" stdDeviation="4" flood-color="#3d3020" flood-opacity=".22"/></filter>
      <filter id="${p}-ink" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="0 0 0 0 .169 0 0 0 0 .165 0 0 0 0 .153 -.2126 -.7152 -.0722 0 1"/></filter></defs>
    <path class="am-paper" d="${cutPath(x, y, w, h, 37, 3.2)}" filter="url(#${p}-cardsh)"/>
    <text class="clip-name am-cname" x="${cx}" y="${y + 58}" text-anchor="middle">Jagendorf &amp; Uribe</text>
    <text class="clip-find am-year" x="${cx}" y="${y + 96}" text-anchor="middle">1966</text>
    ${table}${exp}</g></g>`;
}

/* ---------------------------------------------------------------- the close view: what each staging draws on it */

/** What a staging adds for its close view (beat 3), in figure units inside the camera, and how it draws it. */
export interface Close {
  /** the camera of the close view */
  Z: Tf;
  /** markup over the chain, given the prefix and the geometry */
  svg(p: string, g: Geo): string;
  /** wires it up; the returned function draws it t s into beat 3 (−1 before, 99 after), with the camera's glyph scale k
   *  and the zoom (0–1) */
  bind(S: ReturnType<typeof setters>, g: Geo, stage: SVGSVGElement): (t3: number, k: number, zoom: number) => void;
  /** the rotor's progress in H⁺ (0–14) t s into beat 3, if not nPassed; the counter and the ATP follow it */
  progress?: (t3: number) => number;
  /** true: a passing H⁺ ends at the last point of path() and is handed over to the staging's own drawing there */
  handover?: boolean;
  /** the passing H⁺'s scale at the end of its way up, relative to the camera's glyph scale (default 1) */
  upScale?: number;
  /** where the H⁺ go up through ATP synthase into the stroma, lumen → stroma (the first point is the entry) */
  path(g: Geo): V[];
  /** where each passing H⁺ ends in the stroma, before it drifts off and fades (unused with handover) */
  exits: V[];
  /** where ADP + Pᵢ come from, the catalytic site of each of the three ATP, and where each ATP settles */
  adpFrom: V[]; sites: V[]; atpTo: V[];
  /** the close view's own zone names (with their pH), figure units, where the slide's are out of view */
  zones: { stroma: V; lumen?: V };
}

/* ---------------------------------------------------------------- the staging */

export interface Opt { id: string; name: string; note: string; close: Close }

export function makeStaging(o: Opt): Staging {
  const P = `am${o.id}`, C = o.close;
  const { svg: chain, bil, geo: G } = scene(`${P}c`);
  const Z = C.Z;
  const hpath = C.path(G);

  return {
    id: o.id,
    name: o.name,
    note: o.note,
    holds: HOLDS,
    svg: () => `
      <g data-k="cam"><g class="fig">
        <defs><filter id="${P}-sl" x="-5%" y="-5%" width="110%" height="112%"><feDropShadow dx="0" dy="8" stdDeviation="9" flood-color="#46321a" flood-opacity=".14"/></filter></defs>
        <rect data-k="slidecard" class="am-slidecard" x="${CARD.x}" y="${CARD.y}" width="${CARD.w}" height="${CARD.h}" rx="${CARD.r}" filter="url(#${P}-sl)"/>
        <defs><linearGradient id="${P}c-fadeg" gradientUnits="userSpaceOnUse" x1="800" y1="0" x2="1600" y2="0"><stop data-k="fs0" offset="0" stop-color="#fff"/><stop data-k="fs1" offset="0" stop-color="#fff" stop-opacity="0"/></linearGradient>
          <mask id="${P}c-fade" maskUnits="userSpaceOnUse" x="-60" y="-60" width="1720" height="720"><rect data-k="fadeL" x="-60" y="-60" width="860" height="720" fill="#fff"/><rect x="800" y="-60" width="860" height="720" fill="url(#${P}c-fadeg)"/></mask>
          <clipPath id="${P}-ext"><rect x="797.5" y="0" width="900" height="600"/></clipPath></defs>
        <g data-k="ext" class="chn" clip-path="url(#${P}-ext)" opacity="0"><g mask="url(#${P}c-fade)"><g transform="translate(799.2 0)">${bil}</g></g></g>
        <g data-k="chain" class="chn chn-pdb-bilayer chn-fx">${chain}</g>
        ${C.svg(P, G)}
        ${glyph('ph-s', lab('pH ≈ 8', 'chn-zone am-ph', 0, 28))}${glyph('ph-l', lab('pH ≈ 6', 'chn-zone am-ph', 0, -26, 'end'))}
        ${glyph('zl-stroma', `${lab('stroma', 'chn-zone chn-halo', 0, 0, 'end')}${lab('pH ≈ 8', 'chn-zone am-ph chn-halo', 0, 26, 'end')}`)}
        ${C.zones.lumen ? glyph('zl-lumen', `${lab('pH ≈ 6', 'chn-zone am-ph chn-halo', 0, -26, 'end')}${lab('lumen', 'chn-zone chn-halo', 0, 0, 'end')}`) : ''}
        ${CLOUD.map((_, i) => glyph(`h${i}`, H_RING)).join('')}
        ${[0, 1, 2].map(i => glyph(`adp${i}`, ADP_ROW)).join('')}${[0, 1, 2].map(i => glyph(`atp${i}`, ATP_TAG)).join('')}
      </g></g>
      ${counterSvg()}
      ${cardSvg(P)}`,

    bind(stage) {
      const S = setters(stage), { q, set, op } = S;
      const chainG = q('chain');
      const parts = (p: string): SVGGElement[] => Array.from(chainG.querySelectorAll<SVGGElement>(`[data-p="${p}"]`));
      // texts outside glyphs scale about their anchor; glyph groups (H⁺ rings, atoms, tag rows) about their centre
      const texts = Array.from(chainG.querySelectorAll<SVGTextElement>('text')).filter(el => !el.closest('.chn-g'))
        .map(el => ({ el, x: Number(el.getAttribute('x')), y: Number(el.getAttribute('y')) }));
      const glyphs = Array.from(chainG.querySelectorAll<SVGGElement>('g.chn-g')).filter(g => !g.parentElement?.closest('.chn-g')).map(el => {
        const b = el.getBBox();
        return { el, c: [b.x + b.width / 2, b.y + b.height / 2] as V };
      });
      // what the story tells: the H⁺ path to ATP synthase, the arrow through it (not its render or name), ADP + Pᵢ → ATP
      const flows = [...parts('h-lumen'), ...parts('atps').filter(g => g.querySelector('.chn-h')), ...parts('atp')];
      const nadOff = parts('nadph'), nadOn = parts('nadph-lit');
      const put = (k: string, at: V, sc: number, o: number): void => {
        const el = q(k);
        op(el, o);
        if (o > 0.004) set(el, 'transform', `translate(${f1(at[0])} ${f1(at[1])}) scale(${sc.toFixed(4)})`);
      };
      const drawClose = C.bind(S, G, stage);
      const prog = C.progress ?? nPassed;
      /** one ATP each when the rotor reaches 1/3, 2/3 and 1 turn */
      const atpAt = [1, 2, 3].map(m => whenAt(prog, (N_H * m) / 3));
      // each passing H⁺: its path from its place in the lumen to the entry, up through ATP synthase, to its exit
      const order = CLOUD.map((c, i) => ({ i, d: Math.hypot(c[0] - hpath[0][0], c[1] - hpath[0][1]) })).sort((a, b) => a.d - b.d).map(e => e.i);
      const routes = order.map((i, j) => {
        const lumen: V[] = [CLOUD[i], hpath[0]], up: V[] = C.handover ? hpath : [...hpath, C.exits[j]];
        const dl = plen(lumen) / PASS.v;
        return { i, j, lumen, up, start: tE(j) - dl, dl };
      });

      let last = '';
      return (beatIn, t) => {
        const b = Math.max(0, Math.min(3, Math.round(beatIn)));
        const tt = Math.max(0, Math.min(t, TEND[b]));
        const key = `${b}:${tt.toFixed(3)}`;
        if (key === last) return;
        last = key;
        const T = (n: number): number => (b === n ? tt : b > n ? 99 : -1);
        const t1 = T(0), t3 = T(2), t4 = T(3);

        /* ---- camera: the slide; left for the card (beat 2); into ATP synthase (beat 3); back to the slide (beat 4) */
        const zIn = mv(t3, B3.zoom, B3.zoomD), zOut = mv(t4, B4.zoom, B4.zoomD);
        const cam = b === 0 ? B : b === 1 ? tween(B, B2, mv(tt, 0, B2T.camD)) : b === 2 ? tween(B2, Z, zIn) : tween(Z, B, zOut);
        const zoom = b === 2 ? zIn : b === 3 ? 1 - zOut : 0, k = kOf(cam.s);
        set(q('cam'), 'transform', tfStr(cam));
        const mk = (c: V): string => `matrix(${k.toFixed(4)},0,0,${k.toFixed(4)},${(c[0] * (1 - k)).toFixed(2)},${(c[1] * (1 - k)).toFixed(2)})`;
        texts.forEach(({ el, x, y }) => set(el, 'transform', mk([x, y])));
        glyphs.forEach(({ el, c }) => set(el, 'transform', mk(c)));
        // close view: the stroma, membrane and lumen run on beyond the figure's edge (x 800); the figure card goes
        const ext = Math.min(1, zoom * 1.6);
        op(q('ext'), ext > 0 ? 1 : 0);
        set(q('fs0'), 'offset', (0.55 * ext).toFixed(3));
        set(q('fs1'), 'offset', ext.toFixed(3));
        set(q('fadeL'), 'width', ext > 0 ? '862' : '860');
        op(q('slidecard'), 1 - zoom);
        const zl = tw(t3, B3.labs, B3.labs + 0.25) * (1 - tw(t4, 0, 0.3));
        put('zl-stroma', C.zones.stroma, k, zl);
        if (C.zones.lumen) put('zl-lumen', C.zones.lumen, k, zl);

        /* ---- the slide's H⁺ path, arrow and ATP give way while the story tells them, and come back at the end */
        const flowsOp = b === 0 ? 1 - tw(tt, 0, B1.out) : b < 3 ? 0 : tw(tt, B4.flowsIn, B4.flowsIn + 0.5);
        flows.forEach(g => op(g, flowsOp));

        /* ---- the card (beat 2) */
        op(q('card'), b === 1 ? tw(tt, B2T.card, B2T.card + 0.25) : b === 2 ? 1 - tw(tt, 0, 0.25) : 0);
        op(q('c-adp'), b === 1 ? tw(tt, B2T.adp, B2T.adp + 0.3) : b === 2 ? 1 : 0);
        op(q('c-atp'), b === 1 ? tw(tt, B2T.atp, B2T.atp + 0.3) : b === 2 ? 1 : 0);

        /* ---- the lumen grows more acidic (beat 1) and is back to the slide's at the end; the pH labels */
        const acid = b === 0 ? tw(tt, B1.tint[0], B1.tint[1]) : b < 3 ? 1 : 1 - tw(tt, B4.tint[0], B4.tint[1]);
        op(q('acid'), acid);
        // under the slide's zone names, scaled with them; in the close view the lumen's stays (its name is in view), the
        // stroma's hands over to the close view's own name (the slide's is out of view)
        const ph = b === 0 ? tw(tt, B1.ph, B1.ph + 0.3) : b === 1 ? 1 : b === 2 ? 1 : 1 - tw(tt, 0, 0.35);
        put('ph-s', ZONE_S, k, b === 2 ? ph * (1 - tw(tt, 0.3, 0.7)) : ph);
        put('ph-l', ZONE_L, k, ph);

        /* ---- the story's H⁺: into the lumen (beat 1); through ATP synthase to the stroma, one by one (beat 3) */
        const gone = 1 - tw(t4, B4.glyphs[0], B4.glyphs[1]);
        routes.forEach(({ i, j, lumen, up, start, dl }) => {
          const dst = CLOUD[i], src = srcOf(G, i);
          const u = (t1 - B1.d0 - i * B1.gap) / B1.dD;
          let at: V = dst, o = 1, sc = k;
          if (b === 0) {
            at = bez(src, [(src[0] + dst[0]) / 2, Math.min(446, Math.max(src[1], dst[1]) + 18)], dst, smooth(u));
            o = u < 0 ? 0 : tw(u, 0, 0.12);
          }
          if (t3 > start) {
            if (t3 < tE(j)) at = along(lumen, (t3 - start) / dl);
            else {
              const v = (t3 - tE(j)) / PASS.cross;
              at = along(up, smooth(v));
              sc = k * lerp(1, C.upScale ?? 1, smooth(v));
              // in the stroma it drifts on a little and fades: the stroma is large and stays near pH 8
              const w = (t3 - tE(j) - PASS.cross) / PASS.drift;
              if (C.handover) { if (w >= 0) o = 0; }
              else if (w > 0) { at = [at[0] - 18 * smooth(w), at[1] - 22 * smooth(w)]; o = 1 - tw(w, 0.2, 1); }
            }
          }
          if (b === 3) o = Math.min(o, gone);
          put(`h${i}`, at, sc, o);
        });

        /* ---- ADP + Pᵢ go into the head, ATP comes out, at each third of the turn */
        for (let m = 0; m < 3; m++) {
          const r = atpAt[m], ua = (t3 - (r - 1.05)) / 0.8, ub = (t3 - r) / 0.8;
          put(`adp${m}`, lerpV(C.adpFrom[m], C.sites[m], smoother(ua)), k * lerp(1, 0.7, smooth(ua)), tw(ua, -0.25, 0) * (1 - tw(ua, 0.75, 1)));
          put(`atp${m}`, lerpV(C.sites[m], C.atpTo[m], smoother(ub)), k * lerp(0.7, 1, smooth(ub)), tw(ub, 0, 0.15) * (b === 3 ? 1 - tw(tt, 0, 0.35) : 1));
        }

        /* ---- the counter */
        // an H⁺ counts once the rotor has taken it most of its 1/14 turn
        const n = b === 2 ? Math.max(0, prog(tt)) : b > 2 ? N_H : 0;
        const nDone = Math.min(N_H, Math.floor(n + 0.2));
        const atps = atpAt.filter(r => t3 >= r).length;
        op(q('ctr'), b === 2 ? tw(tt, PASS.counter, PASS.counter + 0.3) : b === 3 ? 1 - tw(tt, 0, 0.35) : 0);
        set(q('c-h'), 'text', String(Math.min(N_H, nDone)));
        set(q('c-t'), 'text', nDone >= N_H ? '1' : `${nDone}/14`);
        set(q('c-a'), 'text', String(atps));
        set(q('c-dial'), 'd', dialPath(n / N_H));

        /* ---- the staging's close view: the rotor, its names and glows */
        drawClose(t3, k, zoom);

        /* ---- NADPH lights beside ATP */
        const nad = tw(t4, B4.nadph, B4.nadph + 0.5);
        nadOn.forEach(g => op(g, nad));
        nadOff.forEach(g => op(g, 1 - nad));
      };
    },
  };
}

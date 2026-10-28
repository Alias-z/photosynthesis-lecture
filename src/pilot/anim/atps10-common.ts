// ATP synthase on the slide 10 schema (script approved by the lecturer, 28 Oct 2026): the parts both stagings (atps10-a,
// atps10-b) share. The stage IS the slide 10 figure: focusSvg() of figs/chain.ts with LIT_ATPS, drawn in the slide's
// figure card (as figs/l10c.ts draws views 10a and 10b). The story plays on it; the camera zooms into ATP synthase and
// back out, and the last frame is the slide, with NADPH lit beside ATP.
// - Beat 1 (opens on the slide figure; one click): H⁺ leave the water-splitting site of photosystem II and cytochrome
//   b₆f and spread through the lumen, whose blue deepens a little. The slide's H⁺ path to ATP synthase, its arrow through
//   ATP synthase and "ADP + Pᵢ → ATP" give way while the story tells them.
// - Beat 2: the chain moves left; a card on the right: Jagendorf & Uribe 1966, their Table 1 (the luciferase columns)
//   as a newsprint clipping, and the experiment drawn small: a tube "acid" → a tube "basic + ADP" → "ATP", in the dark.
// - Beat 3: the card goes; zoom into ATP synthase; H⁺ from the lumen pass through its membrane part to the stroma one
//   after another, while its rotor (the c-ring and the central stalk) turns: bright bands ride round the ring and the
//   stalk on the render itself; ADP + Pᵢ go into the head, ATP comes out, in the stroma.
// - Beat 4: zoom out to the whole chain; the slide's own arrows and "ADP + Pᵢ → ATP" come back, the story's dots go,
//   the lumen's blue returns to the slide's; NADPH lights up beside ATP.
//
// How the slide figure is reused (figs/chain.ts is not modified):
// - focusSvg() wraps every part's markup in <g class="chn-on|off">. The part of each wrapper is found by drawing the view
//   once per part with only that part lit (plus 'h-water', which is drawn only when lit, so every probe has the same
//   wrappers); the wrappers are then tagged data-p="<part>". The lit copy of NADPH comes from a second drawing.
// - Positions are read from the drawing: the H⁺ marks of water and of b₆f, the ATP synthase render's box, its H⁺ mark in
//   the stroma. The c-ring anchor and the H⁺ path through ATP synthase are those of chain.ts (chain-structures.json
//   cring, the same offsets). The rotor's extent on the render (c-ring 76–220 × 386–538 px, central stalk 108–212 ×
//   290–386 px of atps.webp, 343 × 557 px) was measured from the render's three tints.
// - The rotor turns counterclockwise seen from the stroma, as in ATP synthesis (Noji et al. 1997 saw F₁ turn the other
//   way, hydrolysing ATP): its front face moves to the right.
// - In the close view the stage shows the stroma, membrane and lumen beyond the figure's right edge (x 800): copies of
//   the figure's own fields and bilayer, shown only while zoomed (the slide figure ends at 800).
// - The camera scales the whole schema; text and dots are counter-scaled by (s/s₀)^−0.7, as on slide 7's animation.
//
// Image: jagendorf1966-acid-bath-table1.png (assets/refs/L5-electron-transport, refs.json item l): Jagendorf & Uribe
// 1966, PNAS 55:170, Table 1 (PMC page scan), cropped to its first three columns (reaction mixture, acid pH, luciferase
// assay); its ink is laid on the newsprint by an SVG filter.
import '../figs/clipping.css';
import './atps10-common.css';
import atpsHref from '../../assets/chain/atps.webp';
import tableImg from '../../assets/refs/L5-electron-transport/jagendorf1966-acid-bath-table1.png';
import { focusSvg, LIT_ATPS, type FocusLook, type Part } from '../figs/chain';
import { cutPath, f1, lerp, lerpV, rng, setters, smooth, smoother, tfStr, tw, tween, type Tf, type V } from './antenna-common';
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
const view = (id: string, look: FocusLook, lit: Part[]): string => focusSvg(id, { look, lit, say: '' });
/** The part of each wrapper: draw the view with one part lit at a time ('h-water' always lit, see above). */
function partsOf(look: FocusLook): Array<Part | null> {
  const out: Array<Part | null> = wraps(view('a10probe', look, ['h-water'])).map(w => (w.on ? 'h-water' : null));
  for (const p of PARTS) wraps(view('a10probe', look, ['h-water', p])).forEach((w, i) => { if (w.on && out[i] === null) out[i] = p; });
  return out;
}
const strip = (s: string): string => s.replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
const esc = (s: string): string => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const NUM = '(-?[\\d.]+)';
const circlesOf = (s: string, cls: string): V[] =>
  [...s.matchAll(new RegExp(`<circle class="${cls}" cx="${NUM}" cy="${NUM}"`, 'g'))].map(m => [Number(m[1]), Number(m[2])]);

/** Where the story happens, read from the drawing (fallbacks: chain.ts's c2c layout). */
interface Geo {
  /** the slide's H⁺ marks: from water (4), from b₆f (2), and the one ATP synthase has let into the stroma */
  hW: V[]; hB: V[]; hOut: V;
  /** ATP synthase: its render's box (x, y, w, h) and figure units per render pixel */
  img: [number, number, number, number]; px: number;
  /** the slide's H⁺ path through ATP synthase, lumen → stroma */
  path: V[];
  /** the lumen field: top and height */
  lum: [number, number];
}

interface Scene { svg: string; bil: string; geo: Geo }
function scene(id: string, look: FocusLook): Scene {
  const base = strip(view(id, look, LIT_ATPS)), litN = strip(view(id, look, [...LIT_ATPS, 'nadph']));
  const parts = partsOf(look), wb = wraps(base), wn = wraps(litN);
  const inner = (p: Part): string => wb.filter((_, i) => parts[i] === p).map(w => w.inner).join('');
  let svg = '', at = 0;
  wb.forEach((w, i) => {
    const p = parts[i] ?? 'x';
    svg += `${base.slice(at, w.a)}<g class="chn-${w.on ? 'on' : 'off'}" data-p="${p}">${w.inner}</g>`;
    if (p === 'nadph' && wn[i]) svg += `<g class="chn-on" data-p="nadph-lit" opacity="0">${wn[i].inner}</g>`;
    at = w.b;
  });
  svg += base.slice(at);

  // the lumen field: its blue deepens under an overlay drawn right on top of it. The stroma and lumen fields (and the
  // overlay) run on to x 1600 under a mask that shows them only up to the figure's edge (x 800) until the close view.
  const fade = `mask="url(#${id}-fade)"`, wide = (r: string): string => r.replace('<rect ', `<rect ${fade} `).replace('width="800"', 'width="1600"');
  const lm = new RegExp(`<rect class="chn-lumenf" x="0" y="${NUM}" width="800" height="${NUM}"/>`).exec(svg);
  const lum: [number, number] = lm ? [Number(lm[1]), Number(lm[2])] : [319, 133];
  if (lm) svg = svg.replace(lm[0], `${wide(lm[0])}<rect data-k="acid" class="a10-acid" ${fade} x="0" y="${lum[0]}" width="1600" height="${lum[1]}" opacity="0"/>`);
  const sm = /<rect class="chn-stromaf"[^>]*\/>/.exec(svg);
  if (sm) svg = svg.replace(sm[0], wide(sm[0]));
  // the bilayer, copied beyond x 800 for the close view (its heads repeat every 7.2 from x 2)
  const bil = /<rect class="chn-bil"[^>]*\/><path class="chn-tail" d="[^"]*"\/><path class="chn-head" d="[^"]*"\/>/.exec(base)?.[0] ?? '';

  // ATP synthase's render (chain-structures.json: atps 343 × 557 px, c-ring anchor 146.6, 463.8)
  const im = new RegExp(`<image href="${esc(atpsHref)}" x="${NUM}" y="${NUM}" width="${NUM}" height="${NUM}"`).exec(base);
  const [ix, iy, iw, ih] = im ? im.slice(1, 5).map(Number) : [640, 116.8, 135.8, 220.5];
  const px = iw / 343, ring: V = [ix + 146.6 * px, iy + 463.8 * px];
  const hW = circlesOf(inner('h-water'), 'chn-hd'), hB = circlesOf(inner('pq-h-out'), 'chn-hd'), hO = circlesOf(inner('atps'), 'chn-hd');
  return {
    svg,
    bil,
    geo: {
      hW: hW.length === 4 ? hW : [[206.7, 396], [224.7, 390], [210.7, 414], [228.7, 410]],
      hB: hB.length === 2 ? hB : [[292, 392], [307, 400]],
      hOut: hO[0] ?? [ring[0] - 40, ring[1] - 60],
      img: [ix, iy, iw, ih], px,
      path: [[ring[0] - 2, ring[1] + 30], [ring[0] - 8, ring[1]], [ring[0] - 14, ring[1] - 34], [ring[0] - 30, ring[1] - 52]],
      lum,
    },
  };
}

/* ---------------------------------------------------------------- views */

/** The whole chain: the slide's figure card (860 × 642 px around the 800 × 600 figure drawn at 0.97) fills the stage. */
const B: Tf = { s: 1.07, t: [800 - 1.07 * 400, 370 - 1.07 * 300] };
/** Beat 2: the chain at the left, room for the card on the right. */
const B2: Tf = { s: 0.93, t: [60, 91] };
/** ATP synthase, close: figure x 365–1060 (ATP synthase 640–776, near the middle), y 88–410 (head to lumen). */
const Z: Tf = { s: 2.3, t: [790 - 708 * 2.3, -88 * 2.3] };
/** Text and glyph scale for a camera scale s: closer in, they grow less than the structures; further out (beat 2),
 *  they shrink with the chain, so its labels keep their spacing. */
const kOf = (s: number): number => (s > B.s ? (s / B.s) ** -0.7 : 1);
/** The slide's figure card, in figure units (pilot.css .lay-figure .fig, with the paper look's fill and edge). */
const CARD = { x: -43.3, y: -30.9, w: 886.6, h: 661.9, r: 22.7 };

/* ---------------------------------------------------------------- timing (s into each beat) */

/** A move of about 1 s: 0 → 1 from t0 over d, eased at both ends. */
const mv = (t: number, t0: number, d: number): number => smoother((t - t0) / d);
/** A short pulse: up over 0.15 s from t0, down by t0 + 0.6. */
const pulse = (t: number, t0: number): number => tw(t, t0, t0 + 0.15) * (1 - tw(t, t0 + 0.3, t0 + 0.6));
/** A point on the quadratic Bézier a → c → b. */
const bez = (a: V, c: V, b: V, u: number): V => {
  const v = 1 - u;
  return [v * v * a[0] + 2 * v * u * c[0] + u * u * b[0], v * v * a[1] + 2 * v * u * c[1] + u * u * b[1]];
};
/** The point a fraction u along a polyline, by length. */
function along(q: V[], u: number): V {
  const seg = q.slice(1).map((p, i) => Math.hypot(p[0] - q[i][0], p[1] - q[i][1])), L = seg.reduce((a, b) => a + b, 0);
  let d = Math.max(0, Math.min(1, u)) * L, i = 0;
  while (i < seg.length - 1 && d > seg[i]) { d -= seg[i]; i++; }
  return lerpV(q[i], q[i + 1], seg[i] ? Math.min(1, d / seg[i]) : 1);
}

// Beat 1: the slide's H⁺ path, arrow and ATP give way; 14 H⁺ spread through the lumen, one every 0.1 s; the blue deepens.
const B1 = { out: 0.4, d0: 0.25, gap: 0.1, dD: 1.0, tint: [0.3, 2.4], end: 2.7 };
// Beat 2: the chain moves left; the card.
const B2T = { camD: 0.9, card: 0.45, end: 1.0 };
// Beat 3: the card goes; zoom in; H⁺ pass one after another while the rotor turns; ADP + Pᵢ in, ATP out.
const B3 = { zoom: 0.1, zoomD: 1.2, labs: 1.1, h0: 1.3, hGap: 0.3, hD: 1.1, spin: 1.3, spinUp: 0.4, spinDown: 0.5,
  adp: 1.9, adpD: 0.8, site: 2.75, atp: 3.0, atpD: 0.8, end: 4.0 };
// Beat 4: zoom out; the story's glyphs go and the slide's arrows come back; the blue returns; NADPH lights.
const B4 = { zoom: 0.05, zoomD: 1.2, glyphs: [0.45, 0.95], flowsIn: 0.8, tint: [0.3, 1.25], nadph: 1.3, end: 1.9 };
const TEND = [B1.end, B2T.end, B3.end, B4.end];
/** The rotor's angle speed at full turn: a band crosses the ring's front in 1.2 s. */
const W_ROT = Math.PI / 1.2;
/** The rotor's angle t s into beat 3: speeds up over spinUp, turns evenly, slows to a stop at the beat's end. */
/** The rotor's speed (0–1) t s into beat 3. */
const spinSpeed = (t: number): number =>
  Math.max(0, Math.min(1, (t - B3.spin) / B3.spinUp) - Math.max(0, Math.min(1, (t - (B3.end - B3.spinDown)) / B3.spinDown)));
function spinAngle(t: number): number {
  const ramp = (x: number, w: number): number => (x <= 0 ? 0 : x < w ? (x * x) / (2 * w) : x - w / 2);
  return W_ROT * (ramp(t - B3.spin, B3.spinUp) - ramp(t - (B3.end - B3.spinDown), B3.spinDown));
}

/* ---------------------------------------------------------------- the story's H⁺ in the lumen */

/** Where the 14 H⁺ settle, clear of the labels and carriers (figure units). */
const CLOUD: V[] = [[252, 438], [300, 430], [336, 444], [474, 392], [500, 432], [538, 408], [578, 440], [596, 380],
  [624, 420], [656, 392], [676, 432], [700, 366], [718, 404], [746, 380]];
/** The five that pass through ATP synthase in beat 3, in order, and where each ends in the stroma. */
const PASS = [11, 13, 12, 9, 10];
const EXIT: V[] = [[658, 241], [638, 256], [624, 236], [646, 222], [608, 252]];

/* ---------------------------------------------------------------- glyphs: drawn round their origin at the slide's size */

const glyph = (k: string, inner: string, o = 0): string => `<g data-k="${k}" opacity="${o}">${inner}</g>`;
const lab = (s: string, cls: string, x: number, y: number, a: 'start' | 'middle' | 'end' = 'start'): string =>
  `<text class="${cls}" x="${x}" y="${y}" text-anchor="${a}">${s}</text>`;
const H_DOT = '<circle class="chn-hd" r="6.5"/>';

/** The rotor's bands: three on the c-ring (120° apart), one on the central stalk; drawn on the render through its alpha. */
const RING_BANDS = 3;
function rotorSvg(p: string, g: Geo): string {
  const [ix, iy, iw, ih] = g.img;
  return `<defs><mask id="${p}-rmask" maskUnits="userSpaceOnUse" x="${f1(ix)}" y="${f1(iy)}" width="${f1(iw)}" height="${f1(ih)}" mask-type="alpha" style="mask-type:alpha">
      <image href="${atpsHref}" x="${f1(ix)}" y="${f1(iy)}" width="${f1(iw)}" height="${f1(ih)}"/></mask></defs>
      <linearGradient id="${p}-sheen"><stop offset="0" class="a10-sh0"/><stop offset=".5" class="a10-sh1"/><stop offset="1" class="a10-sh0"/></linearGradient>
    <g data-k="rotor" opacity="0" mask="url(#${p}-rmask)">${Array.from({ length: RING_BANDS }, (_, i) => `<rect data-k="rb${i}" fill="url(#${p}-sheen)"/>`).join('')}<rect data-k="sb0" fill="url(#${p}-sheen)"/></g>`;
}

function overlaySvg(p: string, g: Geo): string {
  return `<defs><radialGradient id="${p}-site"><stop offset="0" stop-color="#fff4d6"/><stop offset=".45" stop-color="#f6c453" stop-opacity=".85"/><stop offset="1" stop-color="#f0a316" stop-opacity="0"/></radialGradient></defs>
    ${rotorSvg(p, g)}
    ${glyph('zl-stroma', lab('stroma', 'chn-zone', 0, 0, 'end'))}${glyph('zl-lumen', lab('lumen', 'chn-zone', 0, 0, 'end'))}
    ${glyph('zl-atps', lab('ATP synthase', 'chn-name chn-halo', 0, 0))}${glyph('zl-h', lab('H⁺', 'chn-hl chn-halo', 0, 0, 'end'))}
    ${CLOUD.map((_, i) => glyph(`d${i}`, H_DOT)).join('')}
    ${glyph('site', `<circle r="22" fill="url(#${p}-site)"/>`)}
    ${glyph('l-adp', lab('ADP + Pᵢ', 'chn-mol chn-halo', 0, 7, 'middle'))}${glyph('l-atp', lab('ATP', 'chn-mol chn-halo', 0, 7, 'middle'))}`;
}

/* ---------------------------------------------------------------- the card: Jagendorf and Uribe, 1966 */

const CD = { x: 878, y: 40, w: 694, h: 660 };
/** Table 1, its first three columns (reaction mixture, acid pH, luciferase assay), in the scan's pixels (720 × 232). */
const CROP = { x: 40, y: 52, w: 356, h: 114 };
const arrowR = (x0: number, x1: number, y: number): string =>
  `<path class="a10-ar" d="M${x0},${y}H${x1 - 12}"/><path class="a10-arh" d="M${x1},${y}L${x1 - 15},${y - 8.5}L${x1 - 15},${y + 8.5}Z"/>`;
/** A test tube of liquid with chloroplasts (and H⁺ in the acid one); its rim at y = top. */
function tube(p: string, k: string, cx: number, top: number, liq: string, seed: number, hplus: boolean): string {
  const r = 27, bot = top + 160, ly = top + 50, rnd = rng(seed);
  const shape = `M${cx - r},${top}V${bot - r}A${r},${r} 0 0 0 ${cx + r},${bot - r}V${top}`;
  let chl = '', hs = '';
  for (let i = 0; i < 5; i++) {
    const x = cx + (rnd() - 0.5) * (2 * r - 22), y = ly + 18 + (i / 4) * (bot - ly - 44) + (rnd() - 0.5) * 8;
    chl += `<ellipse class="a10-chl" cx="${f1(x)}" cy="${f1(y)}" rx="7.5" ry="4.6" transform="rotate(${f1((rnd() - 0.5) * 70)} ${f1(x)} ${f1(y)})"/>`;
  }
  if (hplus) for (let i = 0; i < 7; i++) hs += `<circle class="a10-h" cx="${f1(cx + (rnd() - 0.5) * (2 * r - 14))}" cy="${f1(ly + 10 + rnd() * (bot - ly - 30))}" r="3.4"/>`;
  return `<clipPath id="${p}-${k}"><path d="${shape}Z"/></clipPath>
    <rect class="${liq}" x="${cx - r}" y="${ly}" width="${2 * r}" height="${bot - ly}" clip-path="url(#${p}-${k})"/>${chl}${hs}
    <path class="a10-glass" d="${shape}"/><path class="a10-lip" d="M${cx - r - 7},${top}H${cx + r + 7}"/>`;
}
/** No light: a sun, struck through. */
function noLight(x: number, y: number): string {
  const rays = Array.from({ length: 8 }, (_, i) => {
    const a = (i * Math.PI) / 4;
    return `M${f1(x + 13 * Math.cos(a))},${f1(y + 13 * Math.sin(a))}L${f1(x + 19.5 * Math.cos(a))},${f1(y + 19.5 * Math.sin(a))}`;
  }).join('');
  return `<circle class="a10-sunc" cx="${x}" cy="${y}" r="8.5"/><path class="a10-sun" d="${rays}"/><path class="a10-slash" d="M${x - 21},${y - 21}L${x + 21},${y + 21}"/>`;
}
function cardSvg(p: string): string {
  const { x, y, w, h } = CD, cx = x + w / 2;
  // the clipping: Table 1 in the paper's ink on newsprint
  const tw_ = 584, th = (tw_ * CROP.h) / CROP.w, m = 18, cw = tw_ + 2 * m, ch = th + 2 * m, kx = cx - cw / 2, ky = y + 126;
  const table = `<g transform="rotate(-1.4 ${f1(cx)} ${f1(ky + ch / 2)})">
      <path class="clip-paper" d="${cutPath(kx, ky, cw, ch, 41, 3.4)}" filter="url(#${p}-tsh)"/>
      <svg x="${f1(kx + m)}" y="${f1(ky + m)}" width="${tw_}" height="${f1(th)}" viewBox="${CROP.x} ${CROP.y} ${CROP.w} ${CROP.h}" preserveAspectRatio="none">
        <image href="${tableImg}" x="0" y="0" width="720" height="232" filter="url(#${p}-ink)"/></svg></g>`;
  // the experiment: acid → basic + ADP → ATP, in the dark
  const top = ky + ch + 54, xs = [x + 150, x + 362, x + 566], mid = top + 92;
  const exp = `${tube(p, 't1', xs[0], top, 'a10-acidl', 5, true)}${tube(p, 't2', xs[1], top, 'a10-basel', 9, false)}
    ${arrowR(xs[0] + 46, xs[1] - 44, mid)}${arrowR(xs[1] + 46, xs[2] - 58, mid)}
    ${lab('ATP', 'a10-atp', xs[2], mid + 12, 'middle')}
    ${lab('acid', 'a10-cl', xs[0], top + 204, 'middle')}${lab('basic + ADP', 'a10-cl', xs[1], top + 204, 'middle')}
    ${noLight(x + w - 58, top + 6)}`;
  return `<g data-k="card" opacity="0"><g transform="rotate(-1.2 ${x + w / 2} ${y + h / 2})">
    <defs><filter id="${p}-cardsh" x="-10%" y="-6%" width="120%" height="114%"><feDropShadow dx="1" dy="4" stdDeviation="6" flood-color="#3d3020" flood-opacity=".22"/></filter>
      <filter id="${p}-tsh" x="-6%" y="-12%" width="112%" height="130%"><feDropShadow dx="1" dy="3" stdDeviation="4" flood-color="#3d3020" flood-opacity=".22"/></filter>
      <filter id="${p}-ink" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="0 0 0 0 .169 0 0 0 0 .165 0 0 0 0 .153 -.2126 -.7152 -.0722 0 1"/></filter></defs>
    <path class="a10-paper" d="${cutPath(x, y, w, h, 37, 3.2)}" filter="url(#${p}-cardsh)"/>
    <text class="clip-name a10-cname" x="${cx}" y="${y + 62}" text-anchor="middle">Jagendorf &amp; Uribe</text>
    <text class="clip-find a10-year" x="${cx}" y="${y + 102}" text-anchor="middle">1966</text>
    ${table}${exp}</g></g>`;
}

/* ---------------------------------------------------------------- the staging */

export interface Opt { id: string; name: string; note: string; look: FocusLook }

export function makeStaging(o: Opt): Staging {
  const P = `a10${o.id}`;
  const { svg: chain, bil, geo: G } = scene(`${P}c`, o.look);
  const [ix, iy] = G.img, px = G.px;
  // the rotor on the render (render pixels → figure units): c-ring and central stalk, centre, radius, top, bottom
  const RING = { cx: ix + 148 * px, r: 72 * px, y0: iy + 386 * px, y1: iy + 538 * px, w: 18 };
  const STALK = { cx: ix + 160 * px, r: 46 * px, y0: iy + 290 * px, y1: iy + 386 * px, w: 15 };
  // the H⁺ path into ATP synthase from the lumen: down below the c-ring, then the slide's path up through it
  const ENTRY: V = [G.path[0][0] + 6, G.path[0][1] + 20];
  // ADP + Pᵢ go into the head, ATP comes out (stroma, right of the head); the catalytic site where they meet
  const ADP_FROM: V = [852, 132], ADP_TO: V = [772, 178], SITE: V = [ix + 262 * px, iy + 200 * px], ATP_TO: V = [812, 216];

  return {
    id: o.id,
    name: o.name,
    note: o.note,
    holds: [[0]],
    svg: () => `
      <g data-k="cam"><g class="fig">
        <defs><filter id="${P}-sl" x="-5%" y="-5%" width="110%" height="112%"><feDropShadow dx="0" dy="8" stdDeviation="9" flood-color="#46321a" flood-opacity=".14"/></filter></defs>
        <rect data-k="slidecard" class="a10-slidecard" x="${CARD.x}" y="${CARD.y}" width="${CARD.w}" height="${CARD.h}" rx="${CARD.r}" filter="url(#${P}-sl)"/>
        <defs><linearGradient id="${P}c-fadeg" gradientUnits="userSpaceOnUse" x1="800" y1="0" x2="1600" y2="0"><stop data-k="fs0" offset="0" stop-color="#fff"/><stop data-k="fs1" offset="0" stop-color="#fff" stop-opacity="0"/></linearGradient>
          <mask id="${P}c-fade" maskUnits="userSpaceOnUse" x="-60" y="-60" width="1720" height="720"><rect data-k="fadeL" x="-60" y="-60" width="860" height="720" fill="#fff"/><rect x="800" y="-60" width="860" height="720" fill="url(#${P}c-fadeg)"/></mask>
          <clipPath id="${P}-ext"><rect x="797.5" y="0" width="900" height="600"/></clipPath></defs>
        <g data-k="ext" class="chn" clip-path="url(#${P}-ext)" opacity="0"><g mask="url(#${P}c-fade)"><g transform="translate(799.2 0)">${bil}</g></g></g>
        <g data-k="chain" class="chn chn-${o.look === 'glow' ? 'bil-glow' : 'pdb-bilayer'} chn-fx">${chain}</g>
        ${overlaySvg(P, G)}
      </g></g>
      ${cardSvg(P)}`,

    bind(stage) {
      const S = setters(stage), { q, set, op } = S;
      const chainG = q('chain');
      const parts = (p: string): SVGGElement[] => Array.from(chainG.querySelectorAll<SVGGElement>(`[data-p="${p}"]`));
      const texts = Array.from(chainG.querySelectorAll<SVGTextElement>('text')).map(el => ({ el, x: Number(el.getAttribute('x')), y: Number(el.getAttribute('y')) }));
      const hds = Array.from(chainG.querySelectorAll<SVGCircleElement>('circle.chn-hd')).map(el => ({ el, r: Number(el.getAttribute('r')) }));
      // what the story tells: the H⁺ path to ATP synthase, the arrow through it (not its render or name), ADP + Pᵢ → ATP
      const flows = [...parts('h-lumen'), ...parts('atps').filter(g => g.querySelector('.chn-h')), ...parts('atp')];
      const nadOff = parts('nadph'), nadOn = parts('nadph-lit');
      /** A glyph at figure point at, scaled k, at opacity o. */
      const put = (k: string, at: V, sc: number, o: number): void => {
        const el = q(k);
        op(el, o);
        if (o > 0.004) set(el, 'transform', `translate(${f1(at[0])} ${f1(at[1])}) scale(${sc.toFixed(4)})`);
      };
      /** A band on a turning cylinder (c-ring or stalk) at angle a: front at a = 0, moving right. */
      const band = (k: string, c: { cx: number; r: number; y0: number; y1: number; w: number }, a: number, vis: number): void => {
        const el = q(k), cs = Math.cos(a), w = Math.max(0.6, c.w * cs), x = c.cx + c.r * Math.sin(a);
        op(el, cs > 0 ? vis * cs ** 0.6 : 0);
        if (cs > 0) { set(el, 'x', f1(x - w / 2)); set(el, 'width', f1(w)); set(el, 'y', f1(c.y0)); set(el, 'height', f1(c.y1 - c.y0)); }
      };

      let last = '';
      return (beatIn, t) => {
        const b = Math.max(0, Math.min(3, Math.round(beatIn)));
        const tt = Math.max(0, Math.min(t, TEND[b]));
        const key = `${b}:${tt.toFixed(3)}`;
        if (key === last) return;
        last = key;
        /** Seconds into beat n: −1 before it begins, 99 after it. */
        const T = (n: number): number => (b === n ? tt : b > n ? 99 : -1);
        const t1 = T(0), t3 = T(2), t4 = T(3);

        /* ---- camera: the slide; left for the card (beat 2); into ATP synthase (beat 3); back to the slide (beat 4) */
        const zIn = mv(t3, B3.zoom, B3.zoomD), zOut = mv(t4, B4.zoom, B4.zoomD);
        const cam = b === 0 ? B : b === 1 ? tween(B, B2, mv(tt, 0, B2T.camD)) : b === 2 ? tween(B2, Z, zIn) : tween(Z, B, zOut);
        const zoom = b === 2 ? zIn : b === 3 ? 1 - zOut : 0, k = kOf(cam.s);
        set(q('cam'), 'transform', tfStr(cam));
        texts.forEach(({ el, x, y }) => set(el, 'transform', `matrix(${k.toFixed(4)},0,0,${k.toFixed(4)},${(x * (1 - k)).toFixed(2)},${(y * (1 - k)).toFixed(2)})`));
        hds.forEach(({ el, r }) => set(el, 'r', (r * k).toFixed(2)));
        // close view: the stroma, membrane and lumen run on beyond the figure's edge (x 800), the figure card goes
        // (a soft edge that sweeps out from x 800 as the camera moves in, and back as it moves out)
        const ext = Math.min(1, zoom * 1.6);
        op(q('ext'), ext > 0 ? 1 : 0);
        set(q('fs0'), 'offset', (0.55 * ext).toFixed(3));
        set(q('fs1'), 'offset', ext.toFixed(3));
        set(q('fadeL'), 'width', ext > 0 ? '862' : '860');   // overlaps the soft part while zoomed: no seam at x 800
        op(q('slidecard'), 1 - zoom);
        const zl = tw(t3, B3.labs, B3.labs + 0.25) * (1 - tw(t4, 0, 0.3));
        put('zl-stroma', [1040, 112], k, zl);
        put('zl-lumen', [1040, 398], k, zl);
        put('zl-atps', [786, 366], k, zl);
        put('zl-h', [584, 386], k, zl);

        /* ---- the slide's H⁺ path, arrow and ATP give way while the story tells them, and come back at the end */
        const flowsOp = b === 0 ? 1 - tw(tt, 0, B1.out) : b < 3 ? 0 : tw(tt, B4.flowsIn, B4.flowsIn + 0.5);
        flows.forEach(g => op(g, flowsOp));

        /* ---- the card (beat 2) */
        op(q('card'), b === 1 ? tw(tt, B2T.card, B2T.card + 0.25) : b === 2 ? 1 - tw(tt, 0, 0.25) : 0);

        /* ---- the lumen grows more acidic (beat 1) and is back to the slide's at the end */
        const acid = b === 0 ? tw(tt, B1.tint[0], B1.tint[1]) : b < 3 ? 1 : 1 - tw(tt, B4.tint[0], B4.tint[1]);
        op(q('acid'), acid);

        /* ---- the story's H⁺: from water and b₆f into the lumen (beat 1); five through ATP synthase (beat 3) */
        const gone = 1 - tw(t4, B4.glyphs[0], B4.glyphs[1]);
        CLOUD.forEach((dst, i) => {
          const src = i % 2 ? G.hB[(i >> 1) % 2] : G.hW[(i >> 1) % 4];
          const u = (t1 - B1.d0 - i * B1.gap) / B1.dD;
          let at: V = dst, o = gone;
          if (b === 0) {
            at = bez(src, [(src[0] + dst[0]) / 2, Math.min(446, Math.max(src[1], dst[1]) + 18)], dst, smooth(u));
            o = u < 0 ? 0 : tw(u, 0, 0.12);
          }
          const j = PASS.indexOf(i);
          if (j >= 0) {
            const v = (t3 - B3.h0 - j * B3.hGap) / B3.hD;
            if (v > 0) at = along([dst, ENTRY, ...G.path, EXIT[j]], smoother(v));
          }
          put(`d${i}`, at, k, o);
        });

        /* ---- the rotor turns while the H⁺ pass */
        // the bands show the turning: they come with the speed and go as the rotor stops
        const ang = b === 2 ? spinAngle(tt) : 0, rotVis = b === 2 ? smooth(spinSpeed(tt) * 1.4) : 0;
        op(q('rotor'), rotVis);
        for (let i = 0; i < RING_BANDS; i++) band(`rb${i}`, RING, ang + (i * 2 * Math.PI) / RING_BANDS - 0.5, 1);
        band('sb0', STALK, ang - 0.5, 1);

        /* ---- ADP + Pᵢ go into the head; the site lights; ATP comes out */
        const ua = (t3 - B3.adp) / B3.adpD;
        put('l-adp', lerpV(ADP_FROM, ADP_TO, smoother(ua)), k * lerp(1, 0.8, smooth(ua)), tw(ua, -0.25, 0) * (1 - tw(ua, 0.7, 1)));
        put('site', SITE, k, b === 2 ? pulse(tt, B3.site) : 0);
        const ub = (t3 - B3.atp) / B3.atpD;
        put('l-atp', lerpV(SITE, ATP_TO, smoother(ub)), k * lerp(0.8, 1, smooth(ub)), tw(ub, 0, 0.2) * gone);

        /* ---- NADPH lights beside ATP */
        const nad = tw(t4, B4.nadph, B4.nadph + 0.5);
        nadOn.forEach(g => op(g, nad));
        nadOff.forEach(g => op(g, 1 - nad));
      };
    },
  };
}

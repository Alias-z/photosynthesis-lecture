// Chunk cr (lecture 2 chunk 5: C14 Rising CO₂, C15 From leaf to loaf), animations built 28 Oct 2026 (night): the tools all
// eight stagings share. Each staging lays its scenes out on one paper "world" (stage units, 1600 × 740 per view) and moves
// a camera over it, as the slide 6–10b animations do (antenna-common.ts: tween, setters). Slide figures are reused
// exactly: the staging calls the slide's own draw(id) from figs/cr14.ts or figs/cr15.ts and shows it in the slide's figure
// card (pilot.css .lay-figure .fig, 860 × 642 px around the 800 × 600 figure drawn at 0.97), so the card at camera scale
// 1.07 looks as on the slide. Parts of a figure that the story tells are hidden by a mask (black boxes in figure units)
// or found in its markup by class, never redrawn.
import '../figs/clipping.css';
import './cr-anim.css';
import { cutPath, f1, lerp, lerpV, setters, smooth, smoother, tfStr, tween, type Tf, type V } from './antenna-common';
import { co2 } from './l2-glyphs';

export { f1, lerp, lerpV, setters, smooth, smoother, tfStr, tween, type Tf, type V };
export type Setters = ReturnType<typeof setters>;

/* ---------------------------------------------------------------- time */

/** A move of about 1 s: 0 → 1 from t0 over d, eased at both ends. */
export const mv = (t: number, t0: number, d = 1): number => smoother((t - t0) / d);
/** A quick fade: 0 → 1 from t0 over d. */
export const fd = (t: number, t0: number, d = 0.3): number => smooth((t - t0) / d);
/** Seconds into beat n, seen from beat b at t: −1 before beat n begins, 99 after it. */
export const clock = (b: number, t: number) => (n: number): number => (b === n ? t : b > n ? 99 : -1);

/* ---------------------------------------------------------------- camera */

/** The view that shows the world box centred at (cx, cy), w wide, across the 1600-wide stage. */
export const view = (cx: number, cy: number, w: number): Tf => {
  const s = 1600 / w;
  return { s, t: [800 - s * cx, 370 - s * cy] };
};
/** One camera move: from the camera so far to `to`, from t0 over d seconds of beat `beat`. */
export interface Move { beat: number; t0: number; d?: number; to: Tf }
/** The camera after every move up to now: the moves fold in order, so a large t gives the beat's end view. */
export function camAt(start: Tf, moves: Move[], T: (n: number) => number): Tf {
  let cam = start;
  for (const m of moves) {
    const e = mv(T(m.beat), m.t0, m.d ?? 1);
    if (e > 0) cam = tween(cam, m.to, e);
  }
  return cam;
}

/* ---------------------------------------------------------------- slide figures in their card */

/** The slide's figure card, in figure units (pilot.css .lay-figure .fig with the paper look's fill and edge). */
export const CARD = { x: -43.3, y: -30.9, w: 886.6, h: 661.9, r: 22.7 };
/** Camera scale at which a card drawn at world scale 1 looks as on the slide. */
export const SLIDE_S = 1.07;
/** The view that shows a card (world origin ox, oy, world scale k) as the slide does. */
export const slideView = (ox: number, oy: number, k = 1): Tf => {
  const s = SLIDE_S / k;
  return { s, t: [800 - s * (ox + 400 * k), 370 - s * (oy + 300 * k)] };
};
const strip = (s: string): string => s.replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
/** The figure's ids (clip paths, markers) prefixed with the card's key: the slide that plays the animation holds the same
 *  figure with the same ids, and url(#id) would resolve to the slide's copy (hidden under the player, so its clip would
 *  not apply). */
function ownIds(key: string, body: string): string {
  const ids = Array.from(new Set(Array.from(body.matchAll(/\sid="([^"]+)"/g), m => m[1])));
  for (const id of ids) {
    body = body.split(`id="${id}"`).join(`id="${key}-${id}"`).split(`url(#${id})`).join(`url(#${key}-${id})`).split(`href="#${id}"`).join(`href="#${key}-${id}"`);
  }
  return body;
}
/** A slide figure (the SVG string of the slide's own draw()) in its card, at world (ox, oy), scale k. `hide` lists boxes
 *  [x, y, w, h] in figure units, each keyed `${key}-m-${name}`, that start hidden: a staging fades a box's black rect out
 *  to reveal what lies under it. `over` is drawn on top, in figure units (the story's glyphs). */
export function figCard(key: string, fig: string, ox: number, oy: number, k = 1, hide: Record<string, number[]> = {}, o = 1, over = ''): string {
  const names = Object.keys(hide);
  const mask = names.length ? `<mask id="${key}-mask" maskUnits="userSpaceOnUse" x="-60" y="-60" width="920" height="720">
      <rect x="-60" y="-60" width="920" height="720" fill="#fff"/>
      ${names.map(n => { const [x, y, w, h] = hide[n]; return `<rect data-k="${key}-m-${n}" x="${x}" y="${y}" width="${w}" height="${h}" fill="#000"/>`; }).join('')}
    </mask>` : '';
  return `<g data-k="${key}" transform="matrix(${k},0,0,${k},${ox},${oy})" opacity="${o}">
    <defs><filter id="${key}-sh" x="-5%" y="-5%" width="110%" height="112%"><feDropShadow dx="0" dy="8" stdDeviation="9" flood-color="#46321a" flood-opacity=".14"/></filter>${mask}</defs>
    <rect class="cra-card" x="${CARD.x}" y="${CARD.y}" width="${CARD.w}" height="${CARD.h}" rx="${CARD.r}" filter="url(#${key}-sh)"/>
    <g class="fig"${names.length ? ` mask="url(#${key}-mask)"` : ''}>${ownIds(key, strip(fig))}</g>${over}
  </g>`;
}
/** Places a card group: world origin, scale, opacity. */
export function placeCard(S: Setters, key: string, ox: number, oy: number, k: number, o: number): void {
  const el = S.q(key);
  S.op(el, o);
  if (o > 0.004) S.set(el, 'transform', `matrix(${k.toFixed(5)},0,0,${k.toFixed(5)},${f1(ox)},${f1(oy)})`);
}
/** The drawn elements of a figure card whose box centre lies in each named box (figure units). For figures whose published
 *  image multiplies its white ground into the paper: a mask would isolate the group and show that ground as white, so
 *  their story parts are hidden element by element instead. Call in bind(), once the stage is in the page. */
export function partsIn(root: Element, boxes: Record<string, number[]>): Record<string, Element[]> {
  const out: Record<string, Element[]> = Object.fromEntries(Object.keys(boxes).map(k => [k, [] as Element[]]));
  for (const el of Array.from(root.querySelector('g.fig')?.children ?? [])) {
    if (el.tagName.toLowerCase() === 'defs' || el.tagName.toLowerCase() === 'clippath') continue;
    const b = (el as SVGGraphicsElement).getBBox(), cx = b.x + b.width / 2, cy = b.y + b.height / 2;
    for (const [k, [x, y, w, h]] of Object.entries(boxes)) if (cx >= x && cx <= x + w && cy >= y && cy <= y + h) out[k].push(el);
  }
  return out;
}
export const showParts = (S: Setters, els: Element[], u: number): void => els.forEach(el => S.op(el, u));
/** Reveals a hidden box of a figure card (0 hidden, 1 shown). */
export const reveal = (S: Setters, key: string, name: string, u: number): void => S.set(S.q(`${key}-m-${name}`), 'opacity', (1 - u).toFixed(3));

/* ---------------------------------------------------------------- paper pieces */

/** A newsprint clipping (scissor-cut paper with a shadow), w × h at (x, y), turned rot degrees; content in its frame. */
export function paper(id: string, x: number, y: number, w: number, h: number, inner: string, rot = 0, seed = 11): string {
  return `<g transform="rotate(${rot} ${f1(x + w / 2)} ${f1(y + h / 2)})">
    <defs><filter id="${id}-sh" x="-12%" y="-10%" width="124%" height="125%"><feDropShadow dx="1" dy="4" stdDeviation="6" flood-color="#3d3020" flood-opacity=".22"/></filter></defs>
    <path class="clip-paper" d="${cutPath(x, y, w, h, seed, 3.4)}" filter="url(#${id}-sh)"/>${inner}</g>`;
}
/** A journal clipping: the journal and year over the paper's title (lines as given) and its authors. Text only, as
 *  printed on the paper's first page; returns the markup and its height. */
export function journalClip(id: string, x: number, y: number, w: number, o: { journal: string; year: string; title: string[]; authors: string }, rot = -1.5, seed = 17): { svg: string; h: number } {
  const lh = 40, h = 92 + o.title.length * lh + 64;
  const tx = o.title.map((l, i) => `<text class="cra-ctitle" x="${f1(x + 34)}" y="${f1(y + 112 + i * lh)}">${l}</text>`).join('');
  const inner = `<text class="cra-cjour" x="${f1(x + 34)}" y="${f1(y + 50)}">${o.journal}</text>
    <text class="cra-cyear" x="${f1(x + w - 34)}" y="${f1(y + 50)}" text-anchor="end">${o.year}</text>
    <path class="cra-crule" d="M${f1(x + 34)},${f1(y + 68)} H${f1(x + w - 34)}"/>${tx}
    <text class="cra-cauth" x="${f1(x + 34)}" y="${f1(y + 112 + o.title.length * lh + 6)}">${o.authors}</text>`;
  return { svg: paper(id, x, y, w, h, inner, rot, seed), h };
}
/** A halftone portrait (600 × 750 newsprint PNG) on a clipping, w wide, with the name under it. */
export function portraitClip(id: string, href: string, x: number, y: number, w: number, name: string, sub = '', rot = 2, seed = 23): { svg: string; h: number } {
  const m = w * 0.07, pw = w - 2 * m, ph = pw * 1.25, h = m + ph + (sub ? 104 : 70);
  const inner = `<image href="${href}" x="${f1(x + m)}" y="${f1(y + m)}" width="${f1(pw)}" height="${f1(ph)}" preserveAspectRatio="xMidYMid slice"/>
    <text class="cra-cname" x="${f1(x + w / 2)}" y="${f1(y + m + ph + 46)}" text-anchor="middle">${name}</text>
    ${sub ? `<text class="cra-csub" x="${f1(x + w / 2)}" y="${f1(y + m + ph + 82)}" text-anchor="middle">${sub}</text>` : ''}`;
  return { svg: paper(id, x, y, w, h, inner, rot, seed), h };
}
/** A real image on a clipping: the image window [u0, v0, uw, vh] (image pixels) w wide, margin m, white ground multiplied
 *  into the paper when `fig`. Returns the markup, its height and the image-to-world mapping. */
export function imageClip(id: string, im: { href: string; w: number; h: number }, x: number, y: number, w: number, o: { win?: number[]; fig?: boolean; rot?: number; seed?: number; m?: number; below?: number } = {}): { svg: string; h: number; at: (u: number, v: number) => V } {
  const [u0, v0, uw, vh] = o.win ?? [0, 0, im.w, im.h], m = o.m ?? 18, iw = w - 2 * m, s = iw / uw, ih = vh * s, h = ih + 2 * m + (o.below ?? 0);
  const ox = x + m - u0 * s, oy = y + m - v0 * s;
  const inner = `<defs><clipPath id="${id}-win"><rect x="${f1(x + m)}" y="${f1(y + m)}" width="${f1(iw)}" height="${f1(ih)}"/></clipPath></defs>
    <g clip-path="url(#${id}-win)"${o.fig ? ' class="cra-mult"' : ''}><image href="${im.href}" x="${f1(ox)}" y="${f1(oy)}" width="${f1(im.w * s)}" height="${f1(im.h * s)}" preserveAspectRatio="none"/></g>`;
  // the mapping ignores the clipping's slight turn (≤ 2°): callers that point into the image pass rot 0
  return { svg: paper(id, x, y, w, h, inner, o.rot ?? 0, o.seed ?? 29), h, at: (u, v) => [ox + u * s, oy + v * s] };
}

/* ---------------------------------------------------------------- labels and readouts */

export const T = (x: number, y: number, s: string, cls: string, a: 'start' | 'middle' | 'end' = 'start', k = ''): string =>
  `<text class="${cls}" x="${f1(x)}" y="${f1(y)}" text-anchor="${a}"${k ? ` data-k="${k}"` : ''}>${s}</text>`;
/** Width of a label pill (visible characters). */
export const pillW = (s: string, k = 13.4): number => s.replace(/<[^>]+>/g, '').length * k + 34;
/** A paper-white label pill centred at (x, y), with a haloed leader to `to`; keyed for fading. */
export function pill(k: string, x: number, y: number, s: string, to?: V): string {
  const w = pillW(s);
  let ld = '';
  if (to) {
    const dx = to[0] - x, dy = to[1] - y, e = Math.min(w / 2 / Math.max(Math.abs(dx), 1e-6), 21 / Math.max(Math.abs(dy), 1e-6));
    const d = `M${f1(x + dx * e)},${f1(y + dy * e)}L${f1(to[0])},${f1(to[1])}`;
    ld = `<path class="cra-ldh" d="${d}"/><path class="cra-ldk" d="${d}"/><circle class="cra-tip" cx="${f1(to[0])}" cy="${f1(to[1])}" r="4"/>`;
  }
  return `<g data-k="${k}" opacity="0">${ld}<rect class="cra-pillbg" x="${f1(x - w / 2)}" y="${f1(y - 21)}" width="${f1(w)}" height="42" rx="21"/>${T(x, y + 8.5, s, 'cra-pill', 'middle')}</g>`;
}
/** A horizontal bar readout: label over a track; the bar (keyed `${k}-bar`) grows from x0 by v × kx; the value text
 *  (`${k}-val`) sits after its end. Negative values grow left. */
export function hbar(k: string, x0: number, y: number, label: string, cls: string, track = 0): string {
  return `<g data-k="${k}">${label ? T(x0, y - 16, label, 'cra-l') : ''}
    ${track ? `<rect class="cra-track" x="${f1(x0)}" y="${f1(y)}" width="${f1(track)}" height="40" rx="5"/>` : ''}
    <rect data-k="${k}-bar" class="${cls}" x="${f1(x0)}" y="${f1(y)}" width="0" height="40" rx="5"/>
    <text data-k="${k}-val" class="cra-val" x="${f1(x0 + 12)}" y="${f1(y + 30)}">0 %</text></g>`;
}
/** Draws an hbar at value v (%), kx px per %, `txt` the value text (from the final value, so the readout reacts at once). */
export function drawHbar(S: Setters, k: string, x0: number, v: number, kx: number, txt: string, o = 1): void {
  const w = Math.abs(v) * kx, bar = S.q(`${k}-bar`), val = S.q(`${k}-val`);
  S.set(bar, 'width', f1(w));
  S.set(bar, 'x', f1(v < 0 ? x0 - w : x0));
  S.set(val, 'x', f1(v < 0 ? x0 - w - 12 : x0 + w + 12));
  S.set(val, 'text-anchor', v < 0 ? 'end' : 'start');
  S.set(val, 'text', txt);
  S.op(val, o);
}
/** A glyph group keyed k, drawn round its origin, placed later with put(). */
export const glyph = (k: string, inner: string): string => `<g data-k="${k}" opacity="0">${inner}</g>`;
export function put(S: Setters, k: string, at: V, o: number, sc = 1): void {
  const el = S.q(k);
  S.op(el, o);
  if (o > 0.004) S.set(el, 'transform', `translate(${f1(at[0])} ${f1(at[1])})${sc !== 1 ? ` scale(${sc.toFixed(4)})` : ''}`);
}
/** CO₂ as atom balls, drawn round the origin: the deck's one glyph set (l2-glyphs.ts: the shared atom balls, white C,
 *  letters ≥ 11 px), as the slide figures draw it (figs/cr-common.ts co2). */
export const CO2 = (r = 12): string => co2(0, 0, r);

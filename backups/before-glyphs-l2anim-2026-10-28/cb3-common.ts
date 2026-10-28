// C3 animation, "Reduction and regeneration" (beats CB3 in beats-cb.ts): the pieces every staging (cb3-a … cb3-c)
// shares.
// - The slide figure C3 v3 (figs/cb03.ts draw('v3')), exactly: the wheel per 3 CO₂ with reduction and regeneration lit
//   and the energy chips (6 ATP + 6 NADPH into reduction, 3 ATP into regeneration). Its light-off state is the same
//   wheel drawn by cycleWheel() with only carboxylation lit, so its chips turn grey (as slide C3 v5 draws it).
// - The fuel: ATP (red) and NADPH (blue) tokens leave the chips along the figure's own arrows into the arcs: 6 + 6 into
//   reduction, 3 into regeneration (Sharkey 2019 Fig. 3; Bassham et al. 1954, equation A′: 3 ATP + 2 NADPH per CO₂).
// - The light-off transient: Calvin 1961 Nobel lecture Fig. 15 (J. A. Bassham's data, Chlorella), as the scan
//   (photos/c3-light.png; x = 172 + 1.1625 × t px, light off at 400 s, x 637) or redrawn from the values read off it
//   (cb-common FIG15_PGA, FIG15_RUBP). The part before the light goes off is on screen from the start; the click
//   switches the lamp off and draws on the rest, to 700 s.
// - Beat 3 on the light-off wheel: Rubisco runs once more (CO₂ squares along the carboxylation arc), 3-PGA piles up,
//   RuBP is used up. Beat 4 on the slide's wheel: one turn, and the one triose phosphate in six leaves.
import { draw as drawC3 } from '../figs/cb03';
import { axes, cycleWheel, FIG15_PGA, FIG15_RUBP, polar, series, X, Y, type Axes } from '../figs/cb-common';
import lightPng from '../../assets/photos/c3-light.png';
import basshamPng from '../../assets/anim/cb1/bassham.png';
import {
  type Api, arcPath, bezPath, clipping, f1, figInner, hide, image, type Img, type Item, type Key, pill, pillW, show, T, type V, win,
} from './cb-kit';

export const LIGHT: Img = { href: lightPng, w: 1423, h: 823 };
export const BASSHAM = basshamPng;
export const CR_15 = 'Calvin 1961, Nobel lecture, Fig. 15 (J. A. Bassham’s data) · © The Nobel Foundation 1961, www.nobelprize.org';
export const CR_15R = 'Redrawn from Calvin 1961, Nobel lecture, Fig. 15 (J. A. Bassham’s data, Chlorella)';

/** Slide C3's figure, ids prefixed p. */
export const slideC3 = (p: string, v = 'v3'): string => figInner(drawC3(v), `fcb3${v}`, p);
/** The wheel of v3 (figure units). */
export const W3 = { c: [380, 290] as V, r: 160 };
/** The same wheel with the light off: only carboxylation lit, chips grey. */
export const darkWheel = (p: string): string =>
  cycleWheel(p, { cx: 380, cy: 290, r: 160, lit: ['carb'], names: 'in', counts: true, sectors: true, energy: true });

const P3 = (a: number, rr = W3.r): V => polar(W3.c[0], W3.c[1], rr, a) as V;
const tok = (cls: string, r: number): string => `<circle class="${cls}" r="${f1(r)}"/>`;

/** The fuel: tokens from the energy chips along their arrows into the arcs, from G0 (≈ 2.4 s in all). */
export function fuelItems(k: string, place: (q: V) => V, sc: number, G0: number): Item[] {
  const r = W3.r, out: Item[] = [];
  const lane = (chip: V, start: V, entry: V, a0: number, a1: number) => (u: number): V => {
    if (u < 0.55) return place(bezPath(chip, start, entry)(u / 0.55));
    return place(arcPath(W3.c, r, a0, a1)((u - 0.55) / 0.45));
  };
  const atpR = P3(2, r + 64), nadR = P3(32, r + 64), atpG = P3(178, r + 64);
  const lanes = {
    atp: lane([atpR[0] + 44, atpR[1]], atpR, P3(6, r + 12), 6, 30),
    nad: lane([nadR[0] + 56, nadR[1] + 4], nadR, P3(34, r + 12), 34, 56),
    reg: lane([atpG[0] - 44, atpG[1]], atpG, P3(174, r + 12), 174, 150),
  };
  const run = (name: keyof typeof lanes, cls: string, n: number, t0: number): void => {
    for (let i = 0; i < n; i++) {
      const a = t0 + i * 0.13, path = lanes[name];
      out.push({ k: `${k}-${name}${i}`, svg: tok(cls, 8 * sc), keys: [{ o: 0, ...xy(path(0)) }, show(a, 0.1), { at: a, d: 0.95, path, ease: (u: number) => u }, hide(a + 0.85, 0.15)] });
    }
  };
  run('atp', 'cbk-tok-red', 6, G0);
  run('nad', 'cbk-tok-blue', 6, G0 + 0.06);
  run('reg', 'cbk-tok-red', 3, G0 + 1.0);
  return out;
}
const xy = (q: V): { x: number; y: number } => ({ x: q[0], y: q[1] });

/** A pulse round the figure's box "per 3 CO₂: 9 ATP + 6 NADPH" (v3: 12–364 × 514–578). */
export const boxPulse = (k: string, place: (q: V) => V, sc: number, at: number): Item => {
  const c = place([188, 546]);
  return { k, svg: `<rect class="cbk-pulse cbk-pulse-red" x="${f1(-182 * sc)}" y="${f1(-38 * sc)}" width="${f1(364 * sc)}" height="${f1(76 * sc)}" rx="${f1(16 * sc)}"/>`, keys: [{ x: c[0], y: c[1], o: 0 }, show(at, 0.15), hide(at + 0.6, 0.6)] };
};

/** Beat 3 on the light-off wheel: two CO₂ squares run along the carboxylation arc once more, 3-PGA piles up (pill and
 *  pulse), RuBP is used up (pill), from G0. */
export function whyItems(k: string, place: (q: V) => V, sc: number, G0: number, size = 24 * sc): Item[] {
  const out: Item[] = [];
  for (let i = 0; i < 2; i++) {
    const a = G0 + 0.4 + i * 0.25, path = (u: number): V => place(arcPath(W3.c, W3.r, -126, -46)(u));
    out.push({ k: `${k}-c${i}`, svg: `<rect class="fcb-cn" x="${f1(-7.5 * sc)}" y="${f1(-7.5 * sc)}" width="${f1(15 * sc)}" height="${f1(15 * sc)}" rx="${f1(3.7 * sc)}"/>`, keys: [{ o: 0, ...xy(path(0)) }, show(a, 0.12), { at: a, d: 0.8, path }, hide(a + 0.8, 0.2)] });
  }
  const pga = place(P3(-30)), rubp = place(P3(-150));
  out.push({ k: `${k}-pp`, svg: `<rect class="cbk-pulse cbk-pulse-green" x="${f1(-62 * sc)}" y="${f1(-22 * sc)}" width="${f1(124 * sc)}" height="${f1(44 * sc)}" rx="${f1(12 * sc)}"/>`, keys: [{ ...xy(pga), o: 0 }, show(G0 + 1.3, 0.2), { at: G0 + 1.3, d: 0.6, s: 1.18 }] });
  const dUp = pillW("3-PGA piles up", size) / 2 + 72 * sc + 16, dDn = pillW("RuBP is used up", size) / 2 + 54 * sc + 16;
  out.push({ k: `${k}-up`, svg: pill('3-PGA piles up', { size, tint: 'green' }), keys: [{ x: pga[0] + dUp, y: pga[1], o: 0 }, show(G0 + 1.4, 0.25)] });
  out.push({ k: `${k}-dn`, svg: pill('RuBP is used up', { size, tint: 'amber' }), keys: [{ x: rubp[0] - dDn, y: rubp[1], o: 0 }, show(G0 + 1.6, 0.25)] });
  return out;
}

/** Beat 4 on the slide's wheel: one turn (tokens round the three arcs) and the one triose phosphate out, from G0. */
export function turnItems(k: string, place: (q: V) => V, sc: number, G0: number): Item[] {
  const out: Item[] = [], { c, r } = W3;
  const seg = (a0: number, a1: number) => (u: number): V => place(arcPath(c, r, a0, a1)(u));
  const go = (name: string, cls: string, a0: number, a1: number, t: number, n: number): void => {
    for (let i = 0; i < n; i++) {
      const a = t + i * 0.09, path = seg(a0, a1);
      out.push({ k: `${k}-${name}${i}`, svg: tok(cls, 7.5 * sc), keys: [{ o: 0, ...xy(path(0)) }, show(a, 0.1), { at: a, d: 0.8, path }, hide(a + 0.75, 0.15)] });
    }
  };
  go('g', 'cbk-tok-green', -126, -46, G0, 3);
  go('b', 'cbk-tok-blue', -14, 66, G0 + 0.8, 6);
  go('a', 'cbk-tok-amber', 114, 192, G0 + 1.7, 5);
  const o0 = P3(72, r + 30), ex: V = [o0[0] + 92, o0[1] + 52];
  const outPath = (u: number): V => place(u < 0.6 ? bezPath([o0[0] - 8, o0[1] - 4], [o0[0] + 30, o0[1] + 44], ex)(u / 0.6) : [ex[0] + (u - 0.6) / 0.4 * 120, ex[1] + (u - 0.6) / 0.4 * 70]);
  out.push({ k: `${k}-out`, svg: tok('cbk-tok-rust', 9 * sc), keys: [{ o: 0, ...xy(outPath(0)) }, show(G0 + 1.9, 0.1), { at: G0 + 1.9, d: 1.4, path: outPath }] });
  const q = place([ex[0] + 172, ex[1] + 70]);
  out.push({ k: `${k}-q`, svg: pill('?', { size: 30 * sc, w: 60 * sc, tint: 'rust' }), keys: [{ x: q[0], y: q[1], o: 0 }, show(G0 + 3.2, 0.3)] });
  return out;
}

/* ---------------------------------------------------------------- the light-off experiment, redrawn */

/** Lamp over a flask of Chlorella, centred on the origin (about 200 × 330); the lamp's light and its "on" look are in
 *  groups data-k="<k>-on", the "off" look in "<k>-off". */
export function lampFlask(k: string): string {
  const rays = [-60, -30, 0, 30, 60].map(a => { const r0 = 46, r1 = 76, c = Math.cos((a + 90) * Math.PI / 180), s = Math.sin((a + 90) * Math.PI / 180); return `<path class="cbk-ray" d="M${f1(c * r0)},${f1(-100 + s * r0)} L${f1(c * r1)},${f1(-100 + s * r1)}"/>`; }).join('');
  return `<path class="cbk-beam" data-k="${k}-beam" d="M-40,-80 L-90,70 L90,70 L40,-80Z"/>`
    + `<g data-k="${k}-on">${rays}<circle class="cbk-lamp" cx="0" cy="-100" r="34"/></g>`
    + `<g data-k="${k}-off" opacity="0"><circle class="cbk-lamp-off" cx="0" cy="-100" r="34"/></g>`
    + T(54, -96, 'lamp', 'cbk-l', 'start')
    + `<path class="cbk-flask" d="M-22,-8 L-22,22 L-70,104 Q-76,118 -60,120 L60,120 Q76,118 70,104 L22,22 L22,-8Z"/>`
    + `<path class="cbk-algae" d="M-46,62 L-70,104 Q-76,118 -60,120 L60,120 Q76,118 70,104 L46,62Z"/>`
    + T(0, 158, '<tspan class="cbk-it">Chlorella</tspan> in ¹⁴CO₂', 'cbk-l', 'middle');
}
export function lampFx(k: string, off: number, on?: number): (G: number, api: Api) => void {
  return (G, api) => {
    const u = win(G, off, off + 0.25) * (on === undefined ? 1 : 1 - win(G, on, on + 0.25));
    api.op(api.q(`${k}-on`), 1 - u);
    api.op(api.q(`${k}-off`), u);
    api.op(api.q(`${k}-beam`), 1 - u);
  };
}

/** The redrawn transient on axes a (stage units): bands light/dark, the two curves clipped to show up to time t (set by
 *  graphFx), labels. Wrapped in .fig for the figure styles. */
export function graph(k: string, a: Axes): string {
  const top = a.y0 - 30;
  return `<g class="fig"><defs><clipPath id="${k}-cp"><rect data-k="${k}-clip" x="${f1(a.x0 - 4)}" y="${f1(a.y0 - 10)}" width="${f1(X(a, 400) - a.x0 + 4)}" height="${f1(a.h + 20)}"/></clipPath></defs>`
    + `<rect x="${f1(X(a, 0))}" y="${f1(top)}" width="${f1(X(a, 400) - X(a, 0))}" height="24" class="fcb-band-day"/>${T((X(a, 0) + X(a, 400)) / 2, top + 18, 'light', 'fcb-band', 'middle')}`
    + `<g data-k="${k}-dark"><rect x="${f1(X(a, 400))}" y="${f1(top)}" width="${f1(X(a, 700) - X(a, 400))}" height="24" class="fcb-band-night"/>${T((X(a, 400) + X(a, 700)) / 2, top + 18, 'dark', 'fcb-band-d', 'middle')}`
    + `<rect x="${f1(X(a, 400))}" y="${f1(a.y0)}" width="${f1(X(a, 700) - X(a, 400))}" height="${f1(a.h)}" class="fcb-shade-night"/></g>`
    + axes(a, [0, 200, 400, 600], [0, 10, 20], 'time (s)', '¹⁴C label (counts min⁻¹ × 1000)', { ylx: a.x0 - 56 })
    + `<g clip-path="url(#${k}-cp)">${series(a, FIG15_PGA, 'green', '', 0, true)}${series(a, FIG15_RUBP, 'amber', '', 0, true)}</g>`
    + T(X(a, 20), Y(a, 10.9) - 14, '3-PGA', 'fcb-node fcb-c-green', 'start') + T(X(a, 20), Y(a, 5.7) - 14, 'RuBP', 'fcb-node fcb-c-amber', 'start')
    + `</g>`;
}
export function graphFx(k: string, a: Axes, t0: number, d = 1.6): (G: number, api: Api) => void {
  return (G, api) => {
    const u = win(G, t0, t0 + d), tt = 400 + 300 * u;
    api.set(api.q(`${k}-clip`), 'width', f1(X(a, tt) - a.x0 + 4));
    api.op(api.q(`${k}-dark`), win(G, t0 - 0.05, t0 + 0.2));
  };
}

/* ---------------------------------------------------------------- the light-off experiment, the scan */

/** Fig. 15 (0–700 s only: window 0,0–1010,823) w wide, multiplied, centred; a veil hides it right of the cursor, which
 *  fx moves from 400 s (just before the light goes off) to 700 s. Pills name the curves by today's names. */
export function scan(k: string, w: number, o: { clip?: boolean } = {}): { svg: string; h: number; xs: (t: number) => number } {
  const a = image(`${k}-im`, LIGHT, w, { mult: true, win: [0, 0, 1010, 823] }), s = w / 1010;
  const xs = (t: number): number => -w / 2 + (172 + 1.1625 * t) * s;
  const top = -a.h / 2, h = a.h;
  const veil = `<rect data-k="${k}-veil" class="cbk-veil2" x="${f1(xs(404))}" y="${f1(top + 24 * s)}" width="${f1(w / 2 - xs(404))}" height="${f1(664 * s)}"/>`
    + `<path data-k="${k}-cur" class="cbk-cursor" d="M${f1(xs(404))},${f1(top + 20 * s)} V${f1(top + h - 100 * s)}"/>`;
  const p1 = a.at(780, 140), p2 = a.at(720, 688);
  const pills = `<g data-k="${k}-p1" opacity="0"><g transform="translate(${f1(p1[0] + 120)} ${f1(p1[1] - 10)})">${pill('3-PGA piles up', { size: 24, tint: 'green' })}</g></g>`
    + `<g data-k="${k}-p2" opacity="0"><g transform="translate(${f1(p2[0] + 120)} ${f1(p2[1] - 44)})">${pill('RuBP is used up', { size: 24, tint: 'amber' })}</g></g>`;
  const body = `${a.svg}${veil}${pills}`;
  if (!o.clip) return { svg: body, h: a.h, xs };
  const m = 18, ch = a.h + 2 * m;
  return { svg: clipping(k, w + 2 * m, ch, body, { rot: 0.8, seed: 141 }), h: ch, xs };
}
export function scanFx(k: string, xs: (t: number) => number, w: number, t0: number, d = 1.6, pillsOut = 1e9): (G: number, api: Api) => void {
  return (G, api) => {
    const u = win(G, t0, t0 + d), x = xs(404 + 300 * u);
    api.set(api.q(`${k}-veil`), 'x', f1(x));
    api.set(api.q(`${k}-veil`), 'width', f1(Math.max(0.01, w / 2 - x)));
    api.set(api.q(`${k}-cur`), 'transform', `translate(${f1(x - xs(404))} 0)`);
    api.op(api.q(`${k}-cur`), u < 0.999 ? 1 : 0);
    const out = 1 - win(G, pillsOut, pillsOut + 0.3);
    api.op(api.q(`${k}-p1`), win(G, t0 + 0.5, t0 + 0.8) * out);
    api.op(api.q(`${k}-p2`), win(G, t0 + 0.7, t0 + 1.0) * out);
  };
}
export { hide, show, type Key };

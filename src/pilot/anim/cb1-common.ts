// C1 animation, "How the cycle was found" (beats CB1 in beats-cb.ts): the pieces every staging (cb1-a … cb1-d) shares.
// - The lab: Berkeley Lab's photo of the lollipop (photos/cb-lollipop-lbl.jpg, as on slide C2 v2), with the ¹⁴CO₂ fed
//   in at its neck and the algae drained into the alcohol below. The flask is named only as the first apparatus
//   (Calvin 1961: the exposures "were initially performed" in it); the shortest feeds are shown in Bassham's quenched
//   flow tube (Bassham et al. 1954, as reproduced in Sharkey 2019, Fig. 6: algae run through a thin lit tube, ¹⁴CO₂ is
//   injected along it, the tube ends in boiling methanol; feeds as short as 0.4 s). Sharkey 2019 (OSTI accepted
//   manuscript, read in full): the lollipop takes 5–10 s to drain, so it was not the sub-second apparatus.
// - The films: Calvin 1961 Nobel lecture Figs 5 (30 s) and 6 (5 s), whole scans multiplied into the paper; spot centres
//   read off the scans (file pixels). The "under 1 s" step shows no film (none was published): the 5 s film is veiled
//   except its 3-PGA spot, and a readout gives the lecture's figure, "over eighty or ninety percent" of the label in PGA.
// - The portraits (assets/anim/cb1, scripts/halftone.py): Calvin from the Berkeley Lab photo of 26 Oct 1961 (board
//   image f); Benson and Bassham from the Radiation Laboratory photo in Govindjee et al. 2019, Fig. 2b (board image e,
//   names printed under it), midtones darkened before the screen.
// - The wheel: slide C1's figure v1 (figs/cb01.ts draw('v1')), exactly; its "map" state is the same wheel drawn by
//   cycleWheel() with every phase dimmed and no molecules, and "?" in the molecules' places. Beat 4 counts the carbon on
//   the slide's wheel: 3 CO₂ in, 6 3-PGA, 6 triose phosphates, 5 back to RuBP, 1 out.
import { draw as drawC1 } from '../figs/cb01';
import { ANG, cycleWheel, polar } from '../figs/cb-common';
import lolJpg from '../../assets/photos/cb-lollipop-lbl.jpg';
import s30Png from '../../assets/photos/c2-30s.png';
import s5Png from '../../assets/photos/c2-5s.png';
import bas54Png from '../../assets/photos/cb-bassham1954.png';
import flowPng from '../../assets/anim/cb1/bassham1954-flow.png';
import calvinPng from '../../assets/anim/cb1/calvin.png';
import bensonPng from '../../assets/anim/cb1/benson.png';
import basshamPng from '../../assets/anim/cb1/bassham.png';
import {
  type Api, bezPath, clipping, credit, f1, figInner, hide, image, type Img, type Item, type Key, leader, onFig, pill, pillW, polarV,
  portrait, show, T, type V, win, co2Fig,
} from './cb-kit';

export const LOL: Img = { href: lolJpg, w: 1274, h: 884 };
export const F30: Img = { href: s30Png, w: 1348, h: 1053 };
export const F5: Img = { href: s5Png, w: 1349, h: 1025 };
export const B54: Img = { href: bas54Png, w: 1410, h: 840 };
export const FLOW: Img = { href: flowPng, w: 760, h: 910 };
export const PORTRAITS = { calvin: calvinPng, benson: bensonPng, bassham: basshamPng };

export const CR_LOL = 'The “lollipop”: Berkeley Lab photo (R. M. Couto), colorised by LBL · © The Regents of the University of California';
export const CR_FILM = 'Calvin 1961, Nobel lecture, Figs 5, 6 · © The Nobel Foundation 1961, www.nobelprize.org';
export const CR_FILM30 = 'Calvin 1961, Nobel lecture, Fig. 5 · © The Nobel Foundation 1961, www.nobelprize.org';
export const CR_FLOW = 'Bassham et al. 1954, J Am Chem Soc 76:1760, as reproduced in Sharkey 2019, Photosynth Res 140:235, Fig. 6';
export const CR_B54 = 'Bassham, Benson, Kay, Harris, Wilson & Calvin 1954, J Am Chem Soc 76:1760, Fig. 7 (via Sharkey 2019, Fig. 2)';
export const CR_PORTRAITS = 'Calvin: Berkeley Lab 1961 · Benson, Bassham: Govindjee et al. 2019, Photosynth Res 143:1, Fig. 2b';

/** Points on the lollipop photo (file pixels): the neck where ¹⁴CO₂ comes in, the flask's centre, the stopcock, the
 *  alcohol in the beaker below, the left lamp. */
export const LP = { neck: [490, 200] as V, flask: [495, 410] as V, cock: [497, 566] as V, alcohol: [512, 742] as V, lamp: [150, 340] as V };
/** Spot centres on the films (file pixels). */
export const SP30 = { pga: [925, 712] as V, tp: [655, 727] as V, sp: [850, 782] as V, sdp: [1105, 842] as V, suc: [300, 640] as V };
export const SP5 = { pga: [975, 708] as V, tp: [695, 735] as V, sp: [910, 782] as V, sdp: [1105, 845] as V };

/* ---------------------------------------------------------------- the slide's wheel */

/** Slide C1's figure v1, its ids prefixed `p`. */
export const slideC1 = (p: string, v = 'v1'): string => figInner(drawC1(v), `fcb1${v}`, p);
/** The wheel as an empty map: the same wheel, all phases dimmed, no molecules, no counts. */
export const mapWheel = (p: string): string => cycleWheel(p, { cx: 400, cy: 300, r: 165, lit: [], names: false, counts: false, sectors: true, out: '', mols: false });
/** Molecule places on the slide's wheel (figure units). */
export const WP = { rubp: polar(400, 300, 165, ANG.rubp) as V, pga: polar(400, 300, 165, ANG.pga) as V, tp: polar(400, 300, 165, ANG.tp) as V };

/* ---------------------------------------------------------------- the lab (photo with its labels and moving parts) */

/** The lollipop photo w wide, centred on the origin, with pills (outside its right edge when `pillsRight`, else on it).
 *  Returns the markup and where its points land (origin-centred units). */
export function labPhoto(p: string, w: number, o: { pillsRight?: boolean; size?: number } = {}): { svg: string; h: number; at: (q: V) => V } {
  const im = image(`${p}-lol`, LOL, w), at = (q: V): V => im.at(q[0], q[1]);
  const size = o.size ?? 22, xr = w / 2 + 14 + pillW('algae in light', size) / 2;
  const lab = (s: string, x: number, y: number, tgt: V): string => {
    const pw = pillW(s, size), ex = x - pw / 2;
    return `${leader([ex, y], tgt)}<g transform="translate(${f1(x)} ${f1(y)})">${pill(s, { size })}</g>`;
  };
  const fl = at(LP.flask), al = at(LP.alcohol);
  const pills = o.pillsRight
    ? `${lab('algae in light', xr, fl[1] - 30, [fl[0] + 40, fl[1] - 30])}${lab('alcohol', w / 2 + 14 + pillW('alcohol', size) / 2, al[1], [al[0] + 26, al[1]])}`
    : `${lab('algae in light', w * 0.3, -im.h * 0.32, [fl[0] + 30, fl[1] - 40])}${lab('alcohol', w * 0.22, im.h * 0.36, [al[0] + 24, al[1]])}`;
  return { svg: `${im.svg}${pills}`, h: im.h, at };
}

/** The moving parts on the lab photo: ¹⁴CO₂ (atom balls, the ¹⁴C purple) fed in at the neck, named in ink on a pill (feeding from G0, ≈ 1.1 s), the algae's glow, and
 *  the drop that falls into the alcohol (from G0 + 1.3, ≈ 0.8 s). Positions in the photo's frame, placed by `place`. */
export function labMotion(k: string, at: (q: V) => V, place: (q: V) => V, G0: number, layer: 'scene' | 'hud' = 'hud'): Item[] {
  const P = (q: V): V => place(at(q));
  const neck = P([LP.neck[0], LP.neck[1] - 70]), mouth = P([LP.neck[0], LP.neck[1] + 70]), fl = P(LP.flask);
  const dots: Item[] = [0, 1, 2, 3, 4].map(i => {
    const end: V = [fl[0] + [-18, 14, -6, 20, -22][i], fl[1] + [-30, -8, 18, 26, 40][i]];
    const a = G0 + i * 0.12;
    return {
      k: `${k}-c${i}`, layer, svg: co2Fig(10, true),
      keys: [{ x: neck[0], y: neck[1], o: 0 }, { at: a, d: 0.15, o: 1 }, { at: a, d: 0.8, path: bezPath(neck, mouth, end) }, { at: G0 + 1.4, d: 0.3, o: 0 }],
    };
  });
  const label: Item = { k: `${k}-c14`, layer, svg: pill('¹⁴CO₂', { size: 24 }), keys: [{ x: neck[0] + 36 + pillW('¹⁴CO₂', 24) / 2, y: neck[1], o: 0 }, show(G0, 0.25), hide(G0 + 1.5, 0.3)] };
  // the drop: from the stopcock into the alcohol
  const ck = P(LP.cock), al = P([LP.alcohol[0], LP.alcohol[1] - 22]);
  const drop: Item = { k: `${k}-drop`, layer, svg: '<ellipse class="cbk-drop" rx="9" ry="12"/>', keys: [{ x: ck[0], y: ck[1], o: 0 }, show(G0 + 1.3, 0.15), { at: G0 + 1.35, d: 0.65, x: al[0], y: al[1], ease: (u: number) => u * u }, hide(G0 + 2.0, 0.2)] };
  const stop: Item = { k: `${k}-stop`, layer, svg: pill('stops all reactions', { size: 21, tint: 'red' }), keys: [{ x: al[0] - 150, y: al[1] + 12, o: 0 }, show(G0 + 1.95, 0.25)] };
  return [...dots, label, drop, stop];
}

/* ---------------------------------------------------------------- the films */

export interface FilmOpts { w: number; rings?: boolean; pills?: Array<'pga' | 'tp' | 'sdp' | 'sp' | 'suc'>; size?: number }
const RING_INK = { pga: 'green', tp: 'blue', sp: 'blue', sdp: 'amber', suc: 'rust' } as const;
const SPOT_NAME = { pga: '3-PGA', tp: 'triose phosphate', sp: 'sugar phosphates', sdp: 'sugar bisphosphates', suc: 'sucrose' } as const;
/** A film (whole scan, multiplied) w wide, centred on the origin. */
export function film(p: string, im: Img, w: number): { svg: string; h: number; at: (q: V) => V } {
  const a = image(p, im, w, { mult: true });
  return { svg: a.svg, h: a.h, at: q => a.at(q[0], q[1]) };
}
/** A coloured ring round a spot (file pixels) of a film placed by `at`. */
export function ring(at: (q: V) => V, q: V, rx: number, ry: number, ink: keyof typeof RING_INK, s: number): string {
  const c = at(q);
  return `<ellipse class="cbk-ring cbk-ring-${RING_INK[ink]}" cx="${f1(c[0])}" cy="${f1(c[1])}" rx="${f1(rx * s)}" ry="${f1(ry * s)}"/>`;
}
export const spotName = (k: keyof typeof SPOT_NAME): string => SPOT_NAME[k];
export const spotInk = (k: keyof typeof RING_INK): string => RING_INK[k];

/** The flow tube drawing w wide, centred on the origin, with its two labels. */
export function flowTube(p: string, w: number, size = 21): { svg: string; h: number } {
  const a = image(`${p}-flow`, FLOW, w, { mult: true });
  return { svg: a.svg, h: a.h };
}

/** A readout bar: label above, a meter w wide, filled by fx through the rect data-k="<k>-fill"; centred on the origin. */
export function meter(k: string, label: string, w: number, ink = 'green', h = 30): string {
  return `${T(-w / 2, -h / 2 - 14, label, 'cbk-l', 'start')}<rect class="cbk-meter" x="${f1(-w / 2)}" y="${f1(-h / 2)}" width="${w}" height="${h}" rx="${h / 2}"/>`
    + `<rect data-k="${k}-fill" class="cbk-fill-${ink}" x="${f1(-w / 2)}" y="${f1(-h / 2)}" width="0" height="${h}" rx="${h / 2}"/>`
    + `<text data-k="${k}-val" class="cbk-h cbk-green" x="${f1(w / 2 + 16)}" y="${f1(h / 2 - 5)}" text-anchor="start"></text>`;
}

/* ---------------------------------------------------------------- beat 4: the count on the slide's wheel */

/** Tokens that move round the slide's wheel per 3 CO₂ (the CO₂ as atom balls, the carbon after it as tokens), from global time G0 (≈ 4.2 s in all); `place` maps figure
 *  units to the layer they are drawn in, `sc` is their size factor there. */
export function countItems(k: string, place: (q: V) => V, sc: number, G0: number): Item[] {
  const C: V = [400, 300], R = 165;
  const P = (q: V): V => place(q);
  const arc = (a0: number, a1: number, r = R) => (u: number): V => P(polarV(C, r, a0 + (a1 - a0) * u));
  const out: Item[] = [];
  const sq = (cls: string, d: number): string => `<rect class="${cls}" x="${f1(-d / 2)}" y="${f1(-d / 2)}" width="${f1(d)}" height="${f1(d)}" rx="${f1(d / 4)}"/>`;
  const dot = (cls: string, r: number): string => `<circle class="${cls}" r="${f1(r)}"/>`;
  // 3 CO₂ down the arrow, then along the carboxylation arc to 3-PGA
  for (let i = 0; i < 3; i++) {
    // 0.24 s apart (from 0.08 s early) so that the three CO₂ glyphs do not overlap on the short arrow
    const a = G0 - 0.08 + i * 0.24, top = P([400, 74]), arrowEnd = P([400, 135]);
    out.push({
      k: `${k}-co2-${i}`, svg: co2Fig(11.5 * sc),
      keys: [{ x: top[0], y: top[1], o: 0 }, { at: a, d: 0.15, o: 1 }, { at: a, d: 0.6, x: arrowEnd[0], y: arrowEnd[1] }, { at: a + 0.65, d: 0.75, path: arc(-90, -40) }, { at: a + 1.35, d: 0.2, o: 0 }],
    });
  }
  // 6 to triose phosphate along the reduction arc
  const g1 = G0 + 1.9;
  for (let i = 0; i < 6; i++) {
    const a = g1 + i * 0.09;
    out.push({ k: `${k}-red-${i}`, svg: dot('cbk-tok-blue', 7.5 * sc), keys: [{ o: 0, ...pt(P(polarV(C, R, -16))) }, { at: a, d: 0.12, o: 1 }, { at: a, d: 0.85, path: arc(-16, 66) }, { at: a + 0.85, d: 0.15, o: 0 }] });
  }
  // 5 back up the regeneration arc to RuBP, 1 out along the export arrow
  const g2 = G0 + 3.0;
  for (let i = 0; i < 5; i++) {
    const a = g2 + i * 0.09;
    out.push({ k: `${k}-reg-${i}`, svg: dot('cbk-tok-amber', 7.5 * sc), keys: [{ o: 0, ...pt(P(polarV(C, R, 114))) }, { at: a, d: 0.12, o: 1 }, { at: a, d: 0.95, path: arc(114, 190) }, { at: a + 0.95, d: 0.15, o: 0 }] });
  }
  const o0 = polar(400, 300, 195, 72) as V, ex: V = [o0[0] + 92, o0[1] + 52];
  const outPath = (u: number): V => P(bezPath([o0[0] - 8, o0[1] - 4], [o0[0] + 30, o0[1] + 44], [ex[0] - 6, ex[1] - 2])(u));
  out.push({ k: `${k}-out`, svg: dot('cbk-tok-rust', 8.5 * sc), keys: [{ o: 0, ...pt(outPath(0)) }, { at: g2 + 0.2, d: 0.12, o: 1 }, { at: g2 + 0.2, d: 0.85, path: outPath }] });
  return out;
}
const pt = (q: V): { x: number; y: number } => ({ x: q[0], y: q[1] });

/** Pulses (rings that flash once) on the slide wheel's boxes as the tokens arrive. */
export function pulseItems(k: string, place: (q: V) => V, sc: number, G0: number): Item[] {
  const box = (key: string, q: V, w: number, ink: string, at: number): Item => {
    const c = place(q);
    return { k: `${k}-${key}`, svg: `<rect class="cbk-pulse cbk-pulse-${ink}" x="${f1(-w * sc / 2)}" y="${f1(-22 * sc)}" width="${f1(w * sc)}" height="${f1(44 * sc)}" rx="${f1(12 * sc)}"/>`, keys: [{ x: c[0], y: c[1], o: 0 }, { at, d: 0.15, o: 1 }, { at: at + 0.35, d: 0.45, o: 0 }] };
  };
  return [box('p-pga', WP.pga, 124, 'green', G0 + 1.5), box('p-tp', WP.tp, 252, 'blue', G0 + 2.8), box('p-rubp', WP.rubp, 112, 'amber', G0 + 4.0), box('p-out', [674, 538], 240, 'rust', G0 + 4.1)];
}

/** Figure points of slide C1 v1 → scene units, placed as on the slide card. */
export const onSlide = (q: V): V => onFig(q);
export { credit };

/* ---------------------------------------------------------------- staging pieces (stage units, on the hud layer) */

/** Id prefix of the cb1 stagings (the staging id is appended). */
export const ANIM_P = 'cb1';

/** The lab: the lollipop photo w wide centred at (cx, cy) with its pills on the right, its credit, the three portraits
 *  under it; it appears at inAt, the feeding plays from G0, and all of it leaves at outAt. */
export function lab(p: string, o: { cx: number; cy: number; w: number; G0: number; inAt: number; outAt: number; portraits?: boolean }): { items: Item[]; h: number } {
  const ph = labPhoto(`${p}l`, o.w, { pillsRight: true });
  const place = (q: V): V => [o.cx + q[0], o.cy + q[1]];
  const life = (x: number, y: number): Key[] => [{ x, y, o: 0 }, show(o.inAt, 0.25), hide(o.outAt, 0.3)];
  const items: Item[] = [
    { k: 'lab-photo', layer: 'hud', svg: ph.svg, keys: life(o.cx, o.cy) },
    { k: 'lab-cr', layer: 'hud', svg: credit(CR_LOL, 'end'), keys: life(o.cx + o.w / 2, o.cy + ph.h / 2 + 18) },
  ];
  if (o.portraits !== false) {
    const py = o.cy + ph.h / 2 + 90;
    (['calvin', 'benson', 'bassham'] as const).forEach((n, i) => items.push({
      k: `lab-${n}`, layer: 'hud', svg: portrait(PORTRAITS[n], n[0].toUpperCase() + n.slice(1), 88), keys: life(o.cx + (i - 1) * 124, py),
    }));
    items.push({ k: 'lab-pcr', layer: 'hud', svg: credit(CR_PORTRAITS, 'end'), keys: life(1580, 724) });
  }
  const motion = labMotion('lab-m', ph.at, place, o.G0);
  motion.forEach(m => m.keys.push(hide(o.outAt, 0.3)));
  return { items: [...items, ...motion], h: ph.h };
}

type Chip = 'pga' | 'tp' | 'rubp';
const CHIP_TXT: Record<Chip, string> = { pga: '3-PGA', tp: 'triose phosphate', rubp: 'RuBP' };
const CHIP_INK: Record<Chip, string> = { pga: 'green', tp: 'blue', rubp: 'amber' };
const CHIP_SPOT: Record<Chip, V> = { pga: SP30.pga, tp: SP30.tp, rubp: SP30.sdp };

/** The two films at C (w wide), cross-faded: 30 s, then 5 s, then the 5 s film veiled but for its 3-PGA spot (under
 *  one second), then the 30 s film again with its three cycle spots ringed; and the 3-PGA pill under them. */
export function filmItems(p: string, C: V, w: number, t: { in30: number; to5: number; sub1: number; back30: number; out: number }, o: { pill?: V; cr?: V } = {}): {
  items: Item[]; defs: string; h: number; spot: (m: Chip) => V; chip: (m: Chip) => string;
} {
  const a = film(`${p}-f30`, F30, w), b = film(`${p}-f5`, F5, w), s30 = w / F30.w, s5 = w / F5.w;
  const at = (q: V): V => [C[0] + q[0], C[1] + q[1]];
  const pga30 = a.at(SP30.pga), pga5 = b.at(SP5.pga);
  const hole = `<mask id="${p}-vm"><rect x="${f1(-w / 2)}" y="${f1(-b.h / 2)}" width="${f1(w)}" height="${f1(b.h)}" fill="#fff"/><ellipse cx="${f1(pga5[0] + 4)}" cy="${f1(pga5[1] - 2)}" rx="${f1(70 * s5)}" ry="${f1(100 * s5)}" fill="#000"/></mask>`;
  const lbl = (y: number): string => pill('3-PGA', { size: 24, tint: 'green' });
  const pgaPill = o.pill ?? at([pga30[0] + 10, a.h / 2 + 44]);
  const lead = (): string => { const dx = pga30[0] + C[0] - pgaPill[0], dy = pga30[1] + C[1] - pgaPill[1], n = Math.hypot(dx, dy); return leader([dx * 40 / n, dy * 22 / n], [dx - dx * 34 / n, dy - dy * 34 / n]); };
  const items: Item[] = [
    { k: 'f30', layer: 'hud', svg: `${a.svg}${ring(a.at, SP30.pga, 62, 92, 'pga', s30)}`, keys: [{ x: C[0], y: C[1], o: 0 }, show(t.in30, 0.3), hide(t.to5, 0.6), show(t.back30, 0.45), hide(t.out, 0.4)] },
    { k: 'f5', layer: 'hud', svg: `${b.svg}${ring(b.at, SP5.pga, 58, 96, 'pga', s5)}`, keys: [{ x: C[0], y: C[1], o: 0 }, show(t.to5, 0.6), hide(t.back30, 0.4)] },
    { k: 'veil', layer: 'hud', svg: `<rect class="cbk-veil" x="${f1(-w / 2)}" y="${f1(-b.h / 2)}" width="${f1(w)}" height="${f1(b.h)}" mask="url(#${p}-vm)"/>`, keys: [{ x: C[0], y: C[1], o: 0 }, show(t.sub1, 0.4), hide(t.back30, 0.3)] },
    { k: 'pga-l', layer: 'hud', svg: `${lead()}${lbl(0)}`, keys: [{ x: pgaPill[0], y: pgaPill[1], o: 0 }, show(t.in30, 0.3), hide(t.back30, 0.3)] },
    { k: 'rings30', layer: 'hud', svg: `${ring(a.at, SP30.tp, 62, 52, 'tp', s30)}${ring(a.at, SP30.sdp, 78, 70, 'sdp', s30)}`, keys: [{ x: C[0], y: C[1], o: 0 }, show(t.back30 + 0.4, 0.3), hide(t.out, 0.4)] },
    { k: 'f-cr', layer: 'hud', svg: credit(CR_FILM), keys: [{ x: (o.cr ?? [C[0], C[1] + a.h / 2 + 96])[0], y: (o.cr ?? [C[0], C[1] + a.h / 2 + 96])[1], o: 0 }, show(t.in30, 0.3), hide(t.out, 0.4)] },
  ];
  return {
    items, defs: hole, h: a.h,
    spot: m => at(a.at(CHIP_SPOT[m])),
    chip: m => pill(CHIP_TXT[m], { size: 24, tint: CHIP_INK[m] }),
  };
}

/** The feed-time pills at pos: 30 s, 5 s, under 1 s, cross-faded. */
export function timerItems(p: string, pos: V, t: { in30: number; to5: number; sub1: number; out: number }): Item[] {
  const one = (k: string, s: string, keys: Key[]): Item => ({ k, layer: 'hud', svg: pill(s, { size: 28, tint: 'ink' }), keys: [{ x: pos[0], y: pos[1], o: 0 }, ...keys] });
  return [
    one('tm30', '¹⁴CO₂ for 30 s', [show(t.in30, 0.3), hide(t.to5, 0.3)]),
    one('tm5', '¹⁴CO₂ for 5 s', [show(t.to5 + 0.2, 0.3), hide(t.sub1, 0.3)]),
    one('tm1', '¹⁴CO₂ for under 1 s', [show(t.sub1 + 0.2, 0.3), hide(t.out, 0.3)]),
  ];
}

/** Bassham's flow tube as a clipping at pos (image w wide), named, with its credit under it. */
export function flowClip(p: string, pos: V, w: number, t: { in: number; out: number }): Item[] {
  const im = image(`${p}-flow`, FLOW, w, { mult: true }), m = 18, cw = w + 2 * m, ch = im.h + 2 * m + 70;
  const inner = `<g transform="translate(0 ${f1(-ch / 2 + m + im.h / 2)})">${im.svg}</g>`
    + T(0, ch / 2 - 44, 'Bassham’s flow tube', 'clip-name cbk-serif', 'middle', ' style="font-size:24px"')
    + T(0, ch / 2 - 16, 'feeds under 1 s', 'cbk-s', 'middle');
  return [
    { k: 'flow', layer: 'hud', svg: clipping(p, cw, ch, inner, { rot: 1.4, seed: 53 }), keys: [{ x: pos[0], y: pos[1], o: 0 }, show(t.in, 0.25), hide(t.out, 0.3)] },
    { k: 'flow-cr', layer: 'hud', svg: credit('Bassham et al. 1954, J Am Chem Soc 76:1760|as reproduced in Sharkey 2019, Fig. 6'), keys: [{ x: pos[0], y: pos[1] + ch / 2 + 24, o: 0 }, show(t.in, 0.25), hide(t.out, 0.3)] },
  ];
}

/** The readout "¹⁴C in 3-PGA": a meter at pos (w wide) that fills to 80 % and reads "over 80 %". */
export function pgaMeter(p: string, pos: V, w: number, t: { in: number; fill: number; out: number }): { items: Item[]; fx: (G: number, api: Api) => void } {
  const k = `${p}-pm`;
  return {
    items: [{ k: 'pm', layer: 'hud', svg: meter(k, '¹⁴C in 3-PGA', w), keys: [{ x: pos[0], y: pos[1], o: 0 }, show(t.in, 0.25), hide(t.out, 0.3)] }],
    fx(G, api) {
      const u = win(G, t.fill, t.fill + 0.8);
      api.set(api.q(`${k}-fill`), 'width', f1(Math.max(0.001, w * 0.8 * u)));
      api.set(api.q(`${k}-val`), 'text', u > 0.98 ? 'over 80 %' : '');
    },
  };
}

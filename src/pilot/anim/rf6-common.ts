// Photorespiration, on the slide C6 schema (script: REPORT_rf.md, C6, tightened in beats-rf56.ts): the story the rf6
// stagings share. The stage IS a slide C6 figure: schemaSvg(look, LIT_C6) of figs/rf-schema.ts, as figs/rff06.ts draws it
// (v1 thesis, v2 tem, v3 glow), in the slide's figure card (rf56-kit.ts). The camera follows the carbon of two
// 2-phosphoglycolate round the photorespiratory loop, one organelle at a time, and zooms back out to the whole schema,
// which ends as on the slide with the light reactions' supply of ATP and NADPH (the next slide's part) starting to light.
//
// Carbon and nitrogen atoms are drawn as beads (dark: C, blue: N), as in the slide's carbon-count figure (rff06 v9):
// - glycolate: two 2-phosphoglycolate (2 × 2 C) leave the chloroplast along the glycolate arrow into the peroxisome.
// - perox: each takes an N: glycine (2 C + N).
// - mito: both glycine go to the mitochondrion; they make one serine (3 C + N); one C leaves as CO₂ along the schema's
//   CO₂ arrow, one N as NH₃ along the NH₃ arrow (Peterhänsel et al. 2010, §2.1–2.2).
// - back: serine goes back to the peroxisome, where its N stays (it becomes glycerate, 3 C); glycerate goes to the
//   chloroplast and becomes PGA (its ATP tag pulses); NH₃ is refixed in the chloroplast (its ATP and ferredoxin tags pulse).
// - screen: Somerville & Ogren 1979 as a clipping (the three trays of the screen as Peterhänsel et al. 2010 draw it, Fig. 2).
// - out: back to the whole schema; the light reactions, thylakoid and the ATP + NADPH supply start to light (60 %).
// A readout counts the carbon: 4 C in, 3 C back as PGA, 1 C lost as CO₂ (Peterhänsel et al. 2010; the slide's point 2).
// Staging B tells the same on Frederick & Newcomb's micrograph (1969, Fig. 6, tobacco leaf), placed exactly under the tem
// look's peroxisome cut-out (rf-schema.ts draws that crop, box 45, 30, 445, 360 of the same image, at 0.5 units per px),
// with the pathway drawn on it as the slide's figure C6 v5 draws it.
import screenJpg from '../../assets/refs/C2-photorespiration/peterhansel2010-mutant-screen.jpg';
import fnJpg from '../../assets/rf/fn6-whole.jpg';
import { GEO, LIT_C6, type Look, type Part } from '../figs/rf-schema';
import { arrow as kArrow, balls, beads, gasPill, pill, tag as kTag } from '../figs/rf-kit';
import { f1, lerpV, smooth, tw, type V } from './antenna-common';
import { B, camera, chip, glyph, kit, panel, paper, pulse, sceneSvg, stageSvg, T, view, walker, type Move, type Tf } from './rf56-kit';
import type { Beat, Staging } from './types';

/* ---------------------------------------------------------------- views (figure units) */

export { B };
export { BL } from './rf56-kit';
/** The chloroplast's exit to the peroxisome; the peroxisome; the mitochondrion with the CO₂ and NH₃ ways out; the whole
 *  loop. The stage's right ≈ 450 px stays free for the readout and the clipping. */
export const P1: Tf = view(2.5, [585, 330], [600, 370]);
export const P2: Tf = view(3.2, [702, 290], [600, 370]);
export const P3: Tf = view(2.7, [620, 490], [620, 370]);
export const P4: Tf = view(1.75, [540, 400], [620, 370]);
/** The micrograph (staging B): image pixel (u, v) of fn6-whole.jpg → figure units, under the tem look's peroxisome crop. */
const M = (u: number, v: number): V => [GEO.perox[0] - 98 + 0.5 * (u - 45), GEO.perox[1] - 88 + 0.5 * (v - 30)];
export const MV: Tf = view(2.5, M(300, 245), [560, 370]);
export const MP: Tf = view(3.3, M(240, 175), [500, 370]);

/* ---------------------------------------------------------------- the ways (figure units) */

interface Ways {
  /** where the two 2-phosphoglycolate appear, and their way into the peroxisome */
  glyc: V[];
  /** from the peroxisome to the mitochondrion */
  gly: V[];
  /** the lost carbon (CO₂) and the nitrogen (NH₃) out of the mitochondrion */
  co2: V[]; nh3: V[];
  /** serine back to the peroxisome; glycerate on to PGA */
  ser: V[]; glyr: V[];
}
const [px, py] = GEO.perox, [mx, my] = GEO.mito;
const SCHEMA_WAYS: Ways = {
  glyc: [[556, 370], [590, 352], [640, 338], [672, 312], [694, 272], [702, 252]],
  gly: [[702, 252], [684, 290], [px - 24, 352], [px - 24, my - 56], [mx - 6, my - 28]],
  co2: [[mx + 14, my - 28], [mx + 40, my + 40], [mx + 54, 566]],
  nh3: [[mx + 8, my - 22], [mx - 40, my + 6], [mx - 84, my + 12], [584, 520], [540, 522]],
  ser: [[mx - 6, my - 28], [px + 26, my - 60], [px + 26, py + 64], [px + 14, py - 36]],
  glyr: [[px + 14, py - 36], [px - 30, py - 30], [px - 66, py - 22], [560, 264], [452, 286], [356, 310]],
};
const MICRO_WAYS: Ways = {
  glyc: [M(150, 440), M(138, 400), M(128, 360), M(150, 300), M(185, 200), M(215, 82)],
  gly: [M(215, 82), M(300, 80), M(430, 98), M(478, 196), M(480, 236)],
  co2: [M(500, 236), M(548, 222), M(590, 160)],
  nh3: [M(492, 250), M(530, 330), M(552, 398)],
  ser: [M(480, 236), M(452, 300), M(400, 296), M(360, 262), M(330, 230)],
  glyr: [M(330, 230), M(306, 290), M(300, 340), M(300, 410)],
};
/** The micrograph's arrows and labels (image pixels), as figs/rff06.ts v5 draws them. */
const MICRO_ARROWS: Record<string, V[]> = {
  glycolate: [M(140, 420), M(128, 360), M(160, 300)],
  glycine: [M(330, 95), M(430, 98), M(478, 196)],
  serine: [M(452, 300), M(400, 296), M(372, 268)],
  glycerate: [M(300, 312), M(300, 400)],
  co2: [M(548, 222), M(590, 160)],
  nh3: [M(530, 330), M(552, 395)],
};

/* ---------------------------------------------------------------- timing (s into each event) */

const E = {
  glycolate: { show: 1.0, go: 1.3, goD: 1.3, end: 2.8 },
  perox: { n: 1.1, nD: 0.3, end: 1.7 },
  mito: { go: 0.2, goD: 1.1, merge: 1.45, mergeD: 0.4, out: 2.0, co2D: 0.8, nh3D: 1.0, end: 3.45 },
  back: { go: 0.3, goD: 1.1, nOff: 1.4, on: 1.6, onD: 1.3, pga: 2.95, nh3: 1.7, end: 3.7 },
  screen: { end: 0.6 },
  eb77: { end: 0.6 },
  out: { lit: 1.4, end: 2.2 },
};
export type Ev = keyof typeof E;
/** The next slide's part, lit at the end: the light reactions' supply of ATP and NADPH. */
const NEXT: Part[] = ['light', 'thyl', 'supply'];
const NEXT_LIT = 0.6;

/* ---------------------------------------------------------------- overlay (figure units) */

/** The carbon and nitrogen atoms followed round the loop, as the slide's own figures draw them (figs/rf-kit.ts beads():
 *  lettered balls, the photorespiratory carbon on a rust halo; GLYPH_BRIEF). r 9: the letter (11.3 px in figure units)
 *  reads at ≥ 14 px in every zoomed view, where the camera draws it at ≥ 1.24×. */
const BEAD_C = beads(0, 0, 1, 'o', 9), BEAD_N = beads(0, 0, 1, 'n', 9);
/** The carbon that leaves the mitochondrion becomes a CO₂ molecule on its way out (rf-kit balls, as gasPill draws it). */
const LOST_CO2 = balls([0, 0], 'OCO', 0, 10);
/** Spacing of the beads in a molecule and between the two molecules' rows (figure units, before k): as beads() spaces
 *  them (2.15 r), the rows far enough apart for the halos. */
const BEAD_DX = 19.4, BEAD_DY = 13;
function overSvg(p: string, micro: boolean): string {
  const mtx = M(0, 0);
  const microSvg = !micro ? '' : `
    <rect data-k="veil" class="rf-veil" x="-60" y="-40" width="980" height="700" style="display:none"/>
    <g data-k="micro" style="display:none">
      <clipPath id="${p}-mc"><rect x="${f1(mtx[0])}" y="${f1(mtx[1])}" width="300" height="245" rx="8"/></clipPath>
      <g clip-path="url(#${p}-mc)"><image href="${fnJpg}" x="${f1(mtx[0])}" y="${f1(mtx[1])}" width="300" height="245"/></g>
      <rect class="rf-frame" x="${f1(mtx[0])}" y="${f1(mtx[1])}" width="300" height="245" rx="8"/>
      ${Object.entries(MICRO_ARROWS).map(([k, q]) => `<g data-k="ma-${k}" style="display:none">${kArrow(q, 'rfk-arw', 9)}${kArrow(q, k === 'co2' ? 'rfk-arg' : 'rfk-aro', 8)}</g>`).join('')}
    </g>
    ${[['ml-perox', 'peroxisome', ''], ['ml-mito', 'mitochondrion', ''], ['ml-chl1', 'chloroplast', ''], ['ml-chl2', 'chloroplast', ''],
      ['ml-glycolate', 'glycolate', 'rfk-ko'], ['ml-glycine', 'glycine', 'rfk-ko'], ['ml-serine', 'serine', 'rfk-ko'], ['ml-glycerate', 'glycerate', 'rfk-ko'],
      ['ml-nh3', 'NH₃', 'rfk-ko']].map(([k, s, c]) => glyph(k, pill(0, 0, s, undefined, c))).join('')}
    ${glyph('ml-co2', gasPill(0, 0, 'OCO', 'CO₂'))}
    ${glyph('mt-atp1', kTag(0, 0, 'ATP', 'atp'))}${glyph('mt-atp2', kTag(0, 0, 'ATP', 'atp'))}${glyph('mt-fd', kTag(0, 0, 'ferredoxin', 'fd'))}
    ${glyph('mt-pga', chip('3-PGA'))}
    ${glyph('mt-cr', T(0, 0, 'micrograph: Frederick &amp; Newcomb 1969, J Cell Biol, Fig. 6 (tobacco leaf)', 'rf-sub', 'start'))}`;
  return `${microSvg}
    ${glyph('cx', LOST_CO2)}${[0, 1, 2, 3].map(i => glyph(`c${i}`, BEAD_C)).join('')}${[0, 1].map(i => glyph(`n${i}`, BEAD_N)).join('')}
`;
}

/* ---------------------------------------------------------------- cards (stage units) */

const READ = { x: 1150, y: 26, w: 420, h: 250 };
function readPanel(): string {
  const { x, y, w, h } = READ, r = x + w - 30;
  return panel('read', x, y, w, h, `
    ${T(x + 28, y + 44, 'carbon (C)', 'rf-ct')}
    ${beads(r - 128, y + 37, 1, 'o', 13)}${beads(r - 88, y + 37, 1, 'n', 13)}
    <path class="rf-rule" d="M${x + 28},${y + 66}H${r}"/>
    ${T(x + 28, y + 108, 'in two 2-phosphoglycolate', 'rf-cs')}${T(r, y + 110, '4', 'rf-cbig', 'end')}
    ${T(x + 28, y + 162, 'back as 3-PGA', 'rf-cs')}<text data-k="r-back" class="rf-cbig" x="${r}" y="${y + 164}" text-anchor="end">0</text>
    ${T(x + 28, y + 216, 'lost as CO₂', 'rf-cs')}<text data-k="r-lost" class="rf-cbig rf-cbig-o" x="${r}" y="${y + 218}" text-anchor="end">0</text>`);
}

/** Somerville & Ogren's screen as Peterhänsel et al. 2010 draw it (Fig. 2): the three trays, side by side. */
const TRAY_WIN: Array<[number, number]> = [[4, 2], [4, 359], [4, 714]];
function screenCard(p: string, x: number, y: number): string {
  const w = 440, h = 330, tw0 = 118, sc = tw0 / 300, step = 140, x0 = x + 22, ty = y + 96;
  const trays = TRAY_WIN.map(([u, v], i) => {
    const tx = x0 + i * step;
    return `<clipPath id="${p}-tr${i}"><rect x="${tx}" y="${ty}" width="${tw0}" height="${f1(300 * sc)}"/></clipPath>
      <g clip-path="url(#${p}-tr${i})"><image class="rf-cmult" href="${screenJpg}" x="${f1(tx - u * sc)}" y="${f1(ty - v * sc)}" width="${f1(500 * sc)}" height="${f1(1016 * sc)}"/></g>`;
  }).join('');
  const ar = (i: number): string => {
    const a = x0 + i * step + tw0 + 3, b = x0 + (i + 1) * step - 3, yy = ty + 150 * sc;
    return `<path class="rf-ar" d="M${a},${f1(yy)}H${b - 7}"/><path class="rf-ar-hd" d="M${b},${f1(yy)}l-9,-5v10Z"/>`;
  };
  const lab = (i: number, s1: string, s2: string): string => `${T(x0 + i * step + tw0 / 2, ty + 300 * sc + 34, s1, 'rf-ct', 'middle')}${T(x0 + i * step + tw0 / 2, ty + 300 * sc + 62, s2, 'rf-cs', 'middle')}`;
  // the pale plant in the middle tray (image ≈ 106, 470)
  const pale: V = [x0 + step + (106 - 4) * sc, ty + (470 - 359) * sc];
  return paper(p, 'screen', x, y, w, h, `
    ${T(x + 22, y + 44, 'Somerville &amp; Ogren 1979', 'rf-cname')}
    ${T(x + 22, y + 74, '<tspan font-style="italic">Arabidopsis</tspan>', 'rf-cs')}
    ${trays}${ar(0)}${ar(1)}
    <circle cx="${f1(pale[0])}" cy="${f1(pale[1])}" r="15" fill="none" stroke="#b5482a" stroke-width="2.6"/>
    ${lab(0, '1 % CO₂', 'all grow')}${lab(1, 'air', 'mutant pale')}${lab(2, '1 % CO₂', 'it recovers')}
    ${T(x + 22, y + h - 18, 'drawing: Peterhänsel et al. 2010, Arabidopsis Book, Fig. 2', 'rf-ccr')}`, -1, 61);
}

/** CO₂ fixed per absorbed photon by C₃ leaves at 30 °C, in air and in 2 % O₂ (Ehleringer & Björkman 1977, abstract;
 *  as the slide's figure C6 v8 draws it). */
function eb77Card(p: string, x: number, y: number): string {
  const w = 440, h = 500, b = [x + 110, y + 120, x + 400, y + 380] as const;
  const Y = (v: number): number => b[3] - (v / 0.08) * (b[3] - b[1]);
  const X = (i: number): number => b[0] + 75 + i * 140;
  const bar = (i: number, v: number, k: string): string => `<rect class="rf-bar-${k}" x="${X(i) - 46}" y="${f1(Y(v))}" width="92" height="${f1(b[3] - Y(v))}" rx="4"/>${T(X(i), Y(v) - 12, v.toFixed(3), 'rf-ct', 'middle')}`;
  return paper(p, 'eb77', x, y, w, h, `
    ${T(x + 24, y + 46, 'Ehleringer &amp; Björkman 1977', 'rf-cname')}
    ${T(x + 24, y + 76, 'C₃ leaves, 30 °C', 'rf-cs')}
    <path class="rf-tick" d="M${b[0]},${b[1]}V${b[3]}H${b[2]}" fill="none"/>
    ${[0, 0.02, 0.04, 0.06, 0.08].map(v => `<path class="rf-tick" d="M${b[0]},${f1(Y(v))}h-7"/>${T(b[0] - 12, Y(v) + 6, v === 0 ? '0' : v.toFixed(2), 'rf-cs', 'end')}`).join('')}
    <text class="rf-cs" x="${x + 34}" y="${(b[1] + b[3]) / 2}" text-anchor="middle" transform="rotate(-90 ${x + 34} ${(b[1] + b[3]) / 2})">CO₂ fixed per photon</text>
    ${bar(0, 0.0524, 'o')}${bar(1, 0.0733, 'k')}
    ${T(X(0), b[3] + 30, 'air', 'rf-ct', 'middle')}${T(X(0), b[3] + 56, '21 % O₂', 'rf-cs', 'middle')}
    ${T(X(1), b[3] + 30, '2 % O₂', 'rf-ct', 'middle')}${T(X(1), b[3] + 56, 'little oxygenation', 'rf-cs', 'middle')}
    ${T(x + 24, y + h - 18, 'Plant Physiol 59:86 (abstract): mol CO₂ per mol photons', 'rf-ccr')}`, 1, 83);
}

/* ---------------------------------------------------------------- the staging */

export interface Opt {
  id: string; name: string; note: string; look: Look;
  order: Ev[]; beats?: Beat[];
  start: Tf; cam: Move[][];
  /** Tell the loop on the micrograph (look tem). */
  micro?: boolean;
  /** Where the 1979 clipping sits (stage, top left), and when it appears in its beat. */
  screenAt?: V; cardAt?: number;
}

export function makeStaging(o: Opt): Staging {
  const P = `r6${o.id}`, W = o.micro ? MICRO_WAYS : SCHEMA_WAYS;
  const schema = sceneSvg(`${P}s`, o.look, LIT_C6, NEXT);
  const [sx, sy] = o.screenAt ?? [1130, 340];
  const cards = `${readPanel()}${o.order.includes('screen') ? screenCard(P, sx, sy) : ''}${o.order.includes('eb77') ? eb77Card(P, sx, sy) : ''}`;
  const camAt = camera(o.start, o.cam);
  const n = o.order.length;
  const holds = o.order.map((_, i) => (i === 0 ? [0] : []));
  const cardAt = o.cardAt ?? 0.1;
  const ends = o.order.map((e, i) => Math.max(E[e].end, ...(o.cam[i] ?? []).map(([a, d]) => a + d + 0.05), e === 'screen' || e === 'eb77' ? cardAt + 0.3 : 0));
  const way = { glyc: walker(W.glyc), gly: walker(W.gly), co2: walker(W.co2), nh3: walker(W.nh3), ser: walker(W.ser), glyr: walker(W.glyr) };

  return {
    id: o.id,
    name: o.name,
    note: o.note,
    beats: o.beats,
    holds,
    svg: () => stageSvg(P, schema, overSvg(P, !!o.micro), cards),

    bind(stage) {
      const K = kit(stage), { q, set, op, put } = K;
      const lit = K.litCopies();
      const tagsIn = (p: string): Element[] => K.parts(p).flatMap(g => Array.from(g.querySelectorAll('rect.rfs-tag')));
      const glyrTag = tagsIn('glycerate'), nh3Tags = tagsIn('nh3');
      const co2Out = K.parts('co2-out'), pgaNode = K.parts('pga');
      const glow = (els: Element[], v: number): void => els.forEach(el => set(el, 'style:filter', v > 0.01 ? `drop-shadow(0 0 ${f1(10 * v)}px rgba(240,163,22,.95))` : ''));
      let last = '';

      return (beatIn, t) => {
        const b = Math.max(0, Math.min(n - 1, Math.round(beatIn)));
        const tt = Math.max(0, Math.min(t, ends[b]));
        const key = `${b}:${tt.toFixed(3)}`;
        if (key === last) return;
        last = key;
        /** Seconds into event e: −1 before its beat, 1e6 after it. */
        const at = (e: Ev): number => { const i = o.order.indexOf(e); return i < 0 ? -1 : b === i ? tt : b > i ? 1e6 : -1; };
        const t1 = at('glycolate'), t2 = at('perox'), t3 = at('mito'), t4 = at('back'), t6 = at('out');

        /* ---- camera */
        const k = K.cam(camAt(b, tt));

        /* ---- cards: the readout from the first transport to the zoom out; the clipping in its beat */
        op(q('read'), t1 < 0 ? 0 : tw(t1, 0.8, 1.1) * (1 - tw(t6, 0, 0.3)));
        for (const c of ['screen', 'eb77'] as const) {
          const iS = o.order.indexOf(c);
          if (iS >= 0) op(q(c), b < iS ? 0 : b === iS ? tw(tt, cardAt, cardAt + 0.25) : b === iS + 1 ? 1 - tw(tt, 0, 0.25) : 0);
        }
        set(q('r-lost'), 'text', t3 >= E.mito.out + E.mito.co2D ? '1' : '0');
        set(q('r-back'), 'text', t4 >= E.back.pga ? '3' : '0');

        /* ---- the micrograph (staging B) */
        if (o.micro) {
          const mOn = t1 < 0 ? 0 : tw(t1, 0.6, 1.1) * (1 - tw(t6, 0.1, 0.6));
          op(q('micro'), mOn);
          op(q('veil'), 0.92 * mOn);
          const lab = (kk: string, u: number, v: number, o2: number, dx = 0): void => { const pt = M(u, v); put(kk, [pt[0] + dx, pt[1]], k, o2 * mOn); };
          lab('ml-perox', 250, 205, 1); lab('ml-mito', 565, 290, 1); lab('ml-chl1', 110, 468, 1); lab('ml-chl2', 400, 468, 1);
          const arr = (kk: string, tv: number, t0: number): number => { const v = tv < 0 ? 0 : tv >= 1e6 ? 1 : tw(tv, t0, t0 + 0.25); op(q(`ma-${kk}`), v); return v; };
          lab('ml-glycolate', 62, 330, arr('glycolate', t1, 1.1));
          lab('ml-glycine', 400, 62, arr('glycine', t3, 0.1));
          lab('ml-co2', 590, 128, arr('co2', t3, E.mito.out));
          lab('ml-nh3', 590, 385, arr('nh3', t3, E.mito.out));
          lab('ml-serine', 380, 350, arr('serine', t4, 0.2));
          lab('ml-glycerate', 222, 372, arr('glycerate', t4, E.back.on - 0.1));
          const tp = (tv: number, t0: number): number => (tv < 0 ? 0 : tv >= 1e6 ? 1 : tw(tv, t0, t0 + 0.2));
          lab('mt-atp1', 345, 385, tp(t4, E.back.pga - 0.2));
          lab('mt-atp2', 590, 430, tp(t4, E.back.nh3));
          lab('mt-fd', 568, 462, tp(t4, E.back.nh3));
          put('mt-pga', M(300, 412), k, tp(t4, E.back.pga) * mOn);
          const cr = M(0, 490);
          put('mt-cr', [cr[0], cr[1] + 12], k, mOn);
        }

        /* ---- the beads */
        // offsets of a row of beads (C… then N), drawn side by side, k-scaled
        const row = (nC: number, nN: number): V[] => {
          const m = nC + nN, d = BEAD_DX * k;
          return Array.from({ length: m }, (_, i) => [(i - (m - 1) / 2) * d, 0] as V);
        };
        const C: Array<{ at: V; o: number }> = [0, 1, 2, 3].map(() => ({ at: [0, 0], o: 0 }));
        const N: Array<{ at: V; o: number; s: number }> = [0, 1].map(() => ({ at: [0, 0], o: 0, s: 1 }));
        const dy = BEAD_DY * k;
        let cx: { at: V; o: number } = { at: [0, 0], o: 0 };
        if (t1 >= 0 && t3 < E.mito.merge) {
          // two molecules as two rows: 2-phosphoglycolate (beat 1), glycine (beat 2 on), travelling as a group
          const g1 = t3 >= 0 ? way.gly(smooth((t3 - E.mito.go) / E.mito.goD)) : way.glyc(smooth((t1 - E.glycolate.go) / E.glycolate.goD));
          const withN = t2 >= E.perox.n || t2 >= 1e6;
          const r = row(2, withN ? 1 : 0);
          [0, 1].forEach(m => {
            const c0 = r[0], c1 = r[1], yy = (m ? 1 : -1) * dy;
            C[2 * m] = { at: [g1[0] + c0[0], g1[1] + c0[1] + yy], o: tw(t1, E.glycolate.show, E.glycolate.show + 0.2) };
            C[2 * m + 1] = { at: [g1[0] + c1[0], g1[1] + c1[1] + yy], o: tw(t1, E.glycolate.show, E.glycolate.show + 0.2) };
            if (withN) N[m] = { at: [g1[0] + r[2][0], g1[1] + r[2][1] + yy], o: 1, s: t2 >= 1e6 ? 1 : smooth((t2 - E.perox.n) / E.perox.nD) };
          });
        } else if (t3 >= E.mito.merge && t4 < 0) {
          // the mitochondrion: one serine (3 C + N); one C out as CO₂, one N out as NH₃
          const g = W.gly[W.gly.length - 1], e = smooth((t3 - E.mito.merge) / E.mito.mergeD);
          const r0 = row(2, 1), sr = row(3, 1);
          const from = (m: number, i: number): V => [g[0] + r0[i][0], g[1] + r0[i][1] + (m ? 1 : -1) * dy];
          const ser = (i: number): V => [g[0] + sr[i][0], g[1] + sr[i][1]];
          C[0] = { at: lerpV(from(0, 0), ser(0), e), o: 1 };
          C[1] = { at: lerpV(from(0, 1), ser(1), e), o: 1 };
          C[2] = { at: lerpV(from(1, 0), ser(2), e), o: 1 };
          N[0] = { at: lerpV(from(0, 2), ser(3), e), o: 1, s: 1 };
          const uc = (t3 - E.mito.out) / E.mito.co2D, un = (t3 - E.mito.out) / E.mito.nh3D;
          // the lost carbon leaves as a CO₂ molecule: the C ball gives way to the O–C–O glyph as it sets off
          C[3] = { at: uc < 0 ? lerpV(from(1, 1), [g[0] + 22 * k, g[1] + 26 * k], e) : way.co2(smooth(uc)), o: 1 - tw(uc, 0, 0.18) };
          cx = { at: way.co2(smooth(Math.max(0, uc))), o: uc < 0 ? 0 : tw(uc, 0, 0.18) * (1 - tw(uc, 0.85, 1.0)) };
          N[1] = { at: un < 0 ? lerpV(from(1, 2), [g[0] - 6 * k, g[1] + 28 * k], e) : way.nh3(smooth(un)), o: 1, s: 1 };
        } else if (t4 >= 0) {
          // serine back to the peroxisome (its N stays there), glycerate on to PGA; NH₃ refixed in the chloroplast
          const us = (t4 - E.back.go) / E.back.goD, ug = (t4 - E.back.on) / E.back.onD;
          const gp = ug < 0 ? way.ser(smooth(us)) : way.glyr(smooth(ug));
          const sr = row(3, ug < 0 ? 1 : 0);
          const fade = t4 >= 1e6 ? 0 : 1 - tw(t4, E.back.pga - 0.05, E.back.pga + 0.25);
          [0, 1, 2].forEach(i => { C[i] = { at: [gp[0] + sr[i][0], gp[1] + sr[i][1]], o: fade }; });
          if (ug < 0) N[0] = { at: [gp[0] + sr[3][0], gp[1] + sr[3][1]], o: 1 - tw(t4, E.back.nOff, E.back.nOff + 0.25), s: 1 };
          const ne = way.nh3(1);
          N[1] = { at: [ne[0] - 14 * tw(t4, E.back.nh3, E.back.nh3 + 0.5), ne[1] + 10 * tw(t4, E.back.nh3, E.back.nh3 + 0.5)], o: 1 - tw(t4, E.back.nh3 + 0.3, E.back.nh3 + 0.6), s: 1 };
        }
        C.forEach((c, i) => put(`c${i}`, c.at, k, c.o));
        put('cx', cx.at, k, cx.o);
        N.forEach((m, i) => put(`n${i}`, m.at, k * Math.max(0.01, m.s), m.o));

        /* ---- the schema answers: CO₂ out, ATP and ferredoxin tags, PGA */
        const lost = t3 >= 0 && t3 < 1e6 ? pulse(t3, E.mito.out + E.mito.co2D - 0.1) : 0;
        if (!o.micro) {
          glow(co2Out, lost);
          glow(glyrTag, t4 >= 0 && t4 < 1e6 ? pulse(t4, E.back.on + E.back.onD * 0.7) : 0);
          glow(nh3Tags, t4 >= 0 && t4 < 1e6 ? pulse(t4, E.back.nh3) : 0);
          glow(pgaNode, t4 >= 0 && t4 < 1e6 ? pulse(t4, E.back.pga) : 0);
        }

        /* ---- the next slide's part starts to light */
        lit.forEach(g => op(g, NEXT_LIT * (t6 >= 0 ? tw(t6, E.out.lit, E.out.lit + 0.6) : 0)));
      };
    },
  };
}

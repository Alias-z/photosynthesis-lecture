// C11 · Refixation of photorespired CO₂ → C₂: the story pieces the stagings (cc11-a … cc11-d) share. Facts:
// - Busch, Sage, Cousins & Sage 2013 (Plant Cell Environ 36:200, full text read): rice, 30 °C, 350 µmol mol⁻¹ CO₂: of the
//   CO₂ released in the mitochondria, 29 % is refixed inside the same cell (wheat 26 %), 22 % from the air spaces, 49 %
//   leaves the leaf (Table 1, Results); net CO₂ uptake +11 % (wheat +9 %); chloroplasts cover 98.9 % (wheat 92.5 %) of the
//   wall facing the air spaces. Method (their Fig. 1): switch the air from ¹²CO₂ to ¹³CO₂ at the same level (the ¹²CO₂ still
//   leaving escaped refixation), then to 10 000 µmol mol⁻¹ ¹³CO₂, which stops the refixation of ¹²CO₂ (all of it leaves).
// - Sage & Sage 2009 (abstract): rice chloroplasts and stromules cover > 95 % of the periphery; mitochondria inside.
// - Rawsthorne et al. 1988 (abstract): glycine decarboxylase only in bundle-sheath mitochondria of C₂ Moricandia arvensis.
// - Sage, Khoshravesh & Sage 2014 Fig. 2: Flaveria bundle-sheath TEMs, C₃ → proto-Kranz → C₂ → C₄.
import { chloro, mito } from '../figs/cc-kit';
import { bead, card, clipping, co2G, credit, f1, flash, glyph, lerp, photo, pop, put, ring, travel, tw, tx, walker, type S, type V } from './cc-anim-kit';
import s14c3 from '../../assets/photos/cc-sage14-tem-c3.jpg';
import s14pk from '../../assets/photos/cc-sage14-tem-pk.jpg';
import s14c2 from '../../assets/photos/cc-sage14-tem-c2.jpg';
import s14c4 from '../../assets/photos/cc-sage14-tem-c4.jpg';

/* ---------------------------------------------------------------- flyers: CO₂, glycine, … along paths */

export interface Flyer {
  k: string; glyph: string; beat: number; t0: number; d: number; path: V[];
  /** caught: shrinks and fades over this many s at the end, with a fix flash */
  fade?: number;
  /** escapes: fades out over this many s at the end */
  out?: number;
}
export const flyersSvg = (fs: Flyer[]): string => fs.map(f => `${f.fade ? glyph(`${f.k}-fx`, ring()) : ''}${glyph(f.k, f.glyph)}`).join('');
/** Draws the flyers: world points go to the stage through `toStage` (the camera, or the identity for stage-space cards). */
export function drawFlyers(S: S, fs: Flyer[], T: (n: number) => number, toStage: (p: V) => V, vis = 1): void {
  for (const f of fs) {
    const t = T(f.beat), w = walker(f.path.map(toStage));
    const [at, o, sc] = travel(t, f.t0, f.d, w, { fade: f.fade, out: f.out });
    put(S, f.k, at, o * vis, sc);
    if (f.fade) flash(S, `${f.k}-fx`, at, vis > 0.5 ? t : -1, f.t0 + f.d);
  }
}
/** How many of the caught flyers have been caught by time t of their beat. */
export const caught = (fs: Flyer[], T: (n: number) => number): number => fs.filter(f => f.fade && T(f.beat) >= f.t0 + f.d).length;

/** The rice trap on a drawn wall section: n CO₂ leave the mitochondria (alternately), each must cross the chloroplast
 *  above it; those in `hit` are refixed in the stroma, the others go on through the wall into the air space. World units. */
export function c3Trap(p: string, beat: number, o: { mito: V[]; cpY: number; wallY: number; airY: number; t0: number; step: number; d?: number; n?: number; hit?: number[]; r?: number; first?: number }): Flyer[] {
  const n = o.n ?? 10, hit = o.hit ?? [1, 4, 8], out: Flyer[] = [], d = o.d ?? 1.15;
  const jit = [-6, 5, -2, 7, -4, 3, -7, 6, 0, -3, 4, -5];
  for (let i = 0; i < n; i++) {
    const m = o.mito[i % o.mito.length], j = jit[i % jit.length], dy = o.cpY - o.wallY;
    const start: V = [m[0] + j * 0.6, m[1] - 2];
    const path: V[] = hit.includes(i)
      ? [start, [m[0] + j, lerp(m[1], o.cpY, 0.55)], [m[0] + j * 1.4, o.cpY + 1]]
      : [start, [m[0] + j, lerp(m[1], o.cpY, 0.6)], [m[0] + j * 1.3, o.cpY - dy * 0.2], [m[0] + j * 1.8 + 3, o.wallY - 6], [m[0] + j * 2.4 + 6, o.airY]];
    out.push({ k: `${p}-co${i}`, glyph: co2G(o.r ?? 12), beat, t0: i < (o.first ?? 0) ? 0 : o.t0 + i * o.step, d: hit.includes(i) ? d * 0.75 : d, path, fade: hit.includes(i) ? 0.4 : undefined, out: hit.includes(i) ? undefined : 0.3 });
  }
  return out;
}

/* ---------------------------------------------------------------- the 2013 measurement (drawn after Busch 2013 Fig. 1) */

/** Timing of the measurement card, in s into its beat (one hold, after the first switch). */
export const M = { card: 0, sw1: 0.35, in1: 0.5, rel1: 0.6, bar1: [1.0, 1.9] as V, hold: 1.95, sw2: 2.05, flood: 2.15, rel2: 2.3, bar2: [2.9, 3.6] as V, brk: 3.65, end: 3.95 };

const BOX = { x: 40, y: 22, w: 1520, h: 696 };
// the drawn leaf (after their Fig. 1): air above the epidermis, a stoma, the air space, one mesophyll cell
const MD = { airY: [262, 334] as V, epiY: [340, 378] as V, stoma: 560, cell: [96, 476, 680, 214] as [number, number, number, number], cp: [290, 584] as V, mt: [626, 596] as V };
const BAR = { x: 846, w: 620, y1: 238, y2: 392, h: 58 };
const STOMA_IN: V[] = [[MD.stoma + 8, 318], [MD.stoma, 358], [MD.stoma - 12, 418]];
const ESC = (j: number): V[] => [[MD.mt[0] - 14 + j, MD.mt[1] - 10], [MD.mt[0] - 50, 524], [MD.stoma + 56 + j, 444], [MD.stoma + 4, 382], [MD.stoma + 2, 340], [MD.stoma + 40 + j, 296], [MD.stoma + 90 + j * 2, 268]];

function methodFlyers(p: string, beat: number): Flyer[] {
  const f: Flyer[] = [];
  const g12 = co2G(12), g13 = co2G(12, 13);
  // step 1: ¹³CO₂ (350) enters and is fixed in the chloroplast
  [0, 1, 2, 3].forEach(i => f.push({ k: `${p}-i${i}`, glyph: g13, beat, t0: M.in1 + i * 0.3, d: 1.0, fade: 0.35,
    path: [[MD.stoma + 70 + i * 34, 276], ...STOMA_IN, [420 - i * 16, 470], [MD.cp[0] + 40 - i * 26, MD.cp[1] - 8 + (i % 2) * 16]] }));
  // step 1: ¹²CO₂ from the mitochondrion: 2 refixed inside the cell, 1 from the air space, 3 leave through the stoma
  [0, 1].forEach(i => f.push({ k: `${p}-a${i}`, glyph: g12, beat, t0: M.rel1 + i * 0.35, d: 0.9, fade: 0.35,
    path: [[MD.mt[0] - 24, MD.mt[1] + 4 - i * 10], [480, 606 - i * 20], [MD.cp[0] + 70 - i * 34, MD.cp[1] + 10 - i * 16]] }));
  f.push({ k: `${p}-r0`, glyph: g12, beat, t0: M.rel1 + 0.2, d: 1.2, fade: 0.35,
    path: [[MD.mt[0] - 6, MD.mt[1] - 16], [570, 512], [520, 436], [380, 436], [320, 500], [MD.cp[0] + 10, MD.cp[1] - 16]] });
  [0, 1, 2].forEach(i => f.push({ k: `${p}-e${i}`, glyph: g12, beat, t0: M.rel1 + 0.1 + i * 0.3, d: 1.1, out: 0.25, path: ESC(i * 6 - 6) }));
  // step 2: in the flood of ¹³CO₂ every ¹²CO₂ leaves
  [0, 1, 2, 3, 4, 5].forEach(i => f.push({ k: `${p}-x${i}`, glyph: g12, beat, t0: M.rel2 + i * 0.18, d: 1.05, out: 0.25, path: ESC((i % 3) * 6 - 6) }));
  [0, 1, 2].forEach(i => f.push({ k: `${p}-j${i}`, glyph: g13, beat, t0: M.flood + 0.1 + i * 0.25, d: 0.9, fade: 0.35,
    path: [[MD.stoma + 60 + i * 30, 284], ...STOMA_IN, [420 - i * 20, 470], [MD.cp[0] - 30 + i * 36, MD.cp[1] + 8 - i * 12]] }));
  return f;
}
/** The static crowd of ¹³CO₂ in the flood: in the air above the leaf and in the air space. */
const FLOOD: V[] = [
  ...[0, 1, 2, 3].map((i): V => [606 + i * 52, 284 + (i % 2) * 28]),
  [230, 410], [322, 446], [414, 410], [496, 446], [700, 412], [740, 452],
];

export interface Method { svg: string; draw: (S: S, t: number, vis?: number) => void }
/** The measurement card (stage space): the paper's clipping, the drawn leaf with ¹²CO₂ and ¹³CO₂, and the two ¹²CO₂ bars. */
export function method(p: string, beat: number): Method {
  const fl = methodFlyers(p, beat);
  const clip = clipping(p, 74, 44, 700, {
    journal: 'Plant, Cell & Environment · 2013',
    title: ['C₃ plants enhance rates of photosynthesis by', 'reassimilating photorespired and respired CO₂'],
    authors: 'Florian A. Busch, Tammy L. Sage, Asaph B. Cousins, Rowan F. Sage',
  });
  const [cx, cy, cw, ch] = MD.cell;
  const gas = (k: string, iso: string, ppm: string, cls: string): string =>
    `<g data-k="${p}-${k}" opacity="0">${tx(106, 307, `air: <tspan class="${cls}">${iso}</tspan>, ${ppm} µmol mol⁻¹`, 'cca-b', 'start')}</g>`;
  const leaf = `<rect class="cca-air" x="90" y="${MD.airY[0]}" width="690" height="${MD.airY[1] - MD.airY[0]}" rx="12"/>
    <rect class="cca-epi" x="90" y="${MD.epiY[0]}" width="${MD.stoma - 22 - 90}" height="${MD.epiY[1] - MD.epiY[0]}" rx="10"/>
    <rect class="cca-epi" x="${MD.stoma + 22}" y="${MD.epiY[0]}" width="${780 - MD.stoma - 22}" height="${MD.epiY[1] - MD.epiY[0]}" rx="10"/>
    <ellipse class="fcc-stoma" cx="${MD.stoma - 15}" cy="359" rx="9" ry="20"/><ellipse class="fcc-stoma" cx="${MD.stoma + 15}" cy="359" rx="9" ry="20"/>
    <rect class="fcc-wall" x="${cx}" y="${cy}" width="${cw}" height="${ch}" rx="30"/>
    ${chloro(MD.cp[0], MD.cp[1], 132, 52)}${mito(MD.mt[0], MD.mt[1], 76, 36)}
    ${tx(110, 428, 'air space', 'cca-s', 'start')}${tx(MD.stoma + 34, 404, 'stoma', 'cca-s', 'start')}
    ${tx(MD.cp[0], 670, 'chloroplast', 'cca-l')}${tx(MD.mt[0], 670, 'mitochondrion', 'cca-l')}
    ${gas('g0', '¹²CO₂', '350', '')}${gas('g1', '¹³CO₂', '350', 'cca-blue')}${gas('g2', '¹³CO₂', '10 000', 'cca-blue')}
    <g data-k="${p}-flood" opacity="0">${FLOOD.map(q => `<g transform="translate(${q[0]} ${q[1]})">${co2G(8, 13)}</g>`).join('')}</g>`;
  const W = BAR.w;
  const bars = `${tx(BAR.x, 150, '¹²CO₂ leaving the leaf', 'cca-h', 'start')}${tx(BAR.x, 182, 'share of the CO₂ released by the mitochondria (rice)', 'cca-s', 'start')}
    ${tx(BAR.x, BAR.y1 - 14, 'air with ¹³CO₂ at 350 µmol mol⁻¹', 'cca-l', 'start')}
    <rect class="cca-bar-out" data-k="${p}-b1" x="${BAR.x}" y="${BAR.y1}" width="0" height="${BAR.h}" rx="8"/>
    <g data-k="${p}-v1" opacity="0">${tx(BAR.x + W * 0.49 + 16, BAR.y1 + 40, '49 %', 'cca-h', 'start')}</g>
    ${tx(BAR.x, BAR.y2 - 14, 'flood of ¹³CO₂, 10 000 µmol mol⁻¹', 'cca-l', 'start')}
    <rect class="cca-bar-all" data-k="${p}-b2" x="${BAR.x}" y="${BAR.y2}" width="0" height="${BAR.h}" rx="8"/>
    <g data-k="${p}-v2" opacity="0">${tx(BAR.x + W - 16, BAR.y2 + 40, '100 %', 'cca-h cca-white', 'end')}</g>
    <g data-k="${p}-brk" opacity="0">
      <path class="cca-brk" d="M${f1(BAR.x + W * 0.49)},${BAR.y2 + BAR.h + 14} v14 H${BAR.x + W} v-14"/>
      ${tx(BAR.x + W * 0.745, BAR.y2 + BAR.h + 64, 'refixed in the leaf: 51 %', 'cca-b')}
      ${tx(BAR.x + W * 0.745, BAR.y2 + BAR.h + 100, '29 % inside the same cell', 'cca-l cca-co2c')}
      ${tx(BAR.x + W * 0.745, BAR.y2 + BAR.h + 132, '22 % from the air spaces', 'cca-l')}
    </g>
    <g transform="translate(${BAR.x + 38} 618)">${co2G(12)}</g>${tx(BAR.x + 82, 626, '¹²CO₂: the leaf’s own carbon', 'cca-l', 'start')}
    <g transform="translate(${BAR.x + 38} 662)">${co2G(12, 13)}</g>${tx(BAR.x + 82, 670, '¹³CO₂: supplied in the air', 'cca-l cca-blue', 'start')}
    ${credit(BOX.x + BOX.w - 26, BOX.y + BOX.h - 18, 'drawn after Busch, Sage, Cousins & Sage 2013, Plant Cell Environ 36:200, Fig. 1; values: their Table 1 (rice, 30 °C)')}`;
  const svg = `<g data-k="${p}-card" opacity="0"><rect class="cca-veil" x="0" y="0" width="1600" height="740" opacity=".88"/>${card(p, BOX.x, BOX.y, BOX.w, BOX.h)}${clip.svg}${leaf}${bars}${flyersSvg(fl)}</g>`;
  return {
    svg,
    draw(S, t, vis = 1) {
      const T = (n: number): number => (n === beat ? t : -1);
      S.op(S.q(`${p}-card`), vis);
      if (vis < 0.004) return;
      const g1 = tw(t, M.sw1, M.sw1 + 0.2), g2 = tw(t, M.sw2, M.sw2 + 0.2);
      S.op(S.q(`${p}-g0`), 1 - g1);
      S.op(S.q(`${p}-g1`), g1 * (1 - g2));
      S.op(S.q(`${p}-g2`), g2);
      S.op(S.q(`${p}-flood`), pop(t, M.flood));
      drawFlyers(S, fl, T, q => q);
      const b1 = tw(t, M.bar1[0], M.bar1[1]), b2 = tw(t, M.bar2[0], M.bar2[1]);
      S.set(S.q(`${p}-b1`), 'width', f1(BAR.w * 0.49 * b1));
      S.set(S.q(`${p}-b2`), 'width', f1(BAR.w * b2));
      S.op(S.q(`${p}-v1`), pop(t, M.bar1[1] - 0.1));
      S.op(S.q(`${p}-v2`), pop(t, M.bar2[1] - 0.1));
      S.op(S.q(`${p}-brk`), pop(t, M.brk));
    },
  };
}

/* ---------------------------------------------------------------- glycine to the bundle sheath (C₂) */

/** Four glycine beads move from the mesophyll to two bundle-sheath mitochondria; each pair gives one CO₂, which moves into
 *  the chloroplast in front of that mitochondrion and is fixed (2 glycine → serine + CO₂ + NH₃; only the CO₂ is drawn). */
export function glyFlyers(p: string, beat: number, o: { from: V; to: V; mito: V[]; cp: V[]; t0: number; rb?: number; rc?: number }): Flyer[] {
  const f: Flyer[] = [];
  for (let i = 0; i < 4; i++) {
    const m = o.mito[i % 2];
    f.push({ k: `${p}-g${i}`, glyph: bead('cca-gly', o.rb ?? 11), beat, t0: o.t0 + i * 0.22, d: 1.1, fade: 0.25,
      path: [[o.from[0], o.from[1] + (i % 2 ? 6 : -6)], [lerp(o.from[0], o.to[0], 0.5), o.to[1] + (i % 2 ? 4 : -4)], o.to, [m[0] - 6, m[1]]] });
  }
  for (let i = 0; i < 2; i++) {
    f.push({ k: `${p}-c${i}`, glyph: co2G(o.rc ?? 11), beat, t0: o.t0 + 1.55 + i * 0.2, d: 0.8, fade: 0.4, path: [o.mito[i], lerpV2(o.mito[i], o.cp[i], 0.5), o.cp[i]] });
  }
  return f;
}
const lerpV2 = (a: V, b: V, e: number): V => [lerp(a[0], b[0], e), lerp(a[1], b[1], e) - 3];

/* ---------------------------------------------------------------- Flaveria, C₃ → proto-Kranz → C₂ → C₄ (Sage 2014 Fig. 2) */

const S14 = [
  { k: 'c3', href: s14c3, w: 212, h: 215, name: 'C₃' }, { k: 'pk', href: s14pk, w: 213, h: 215, name: 'proto-Kranz' },
  { k: 'c2', href: s14c2, w: 209, h: 215, name: 'C₂' }, { k: 'c4', href: s14c4, w: 215, h: 215, name: 'C₄' },
];
/** The four Flaveria bundle-sheath micrographs (chloroplasts green, mitochondria red: colours theirs), as a 2 × 2 grid or a
 *  row, each with its name; they appear one by one. */
export function flaveria(p: string, x: number, y: number, cell: number, o: { cols?: number; gap?: number } = {}): { svg: string; draw: (S: S, t: number, t0: number, vis?: number) => void; h: number; w: number } {
  const cols = o.cols ?? 2, gap = o.gap ?? 26, rows = Math.ceil(4 / cols), lh = 40;
  const w = cols * cell + (cols - 1) * gap, h = 64 + rows * (cell + lh) + (rows - 1) * gap + 56;
  const body = S14.map((m, i) => {
    const cxi = x + (i % cols) * (cell + gap), cyi = y + 64 + Math.floor(i / cols) * (cell + lh + gap) + lh;
    const ph = photo(`${p}-f${i}`, m.href, m.w, m.h, cxi, cyi, cell, [0, 0, m.w, Math.min(m.h, m.w)], { r: 10 });
    return `<g data-k="${p}-f${i}" opacity="0">${tx(cxi, cyi - 12, m.name, 'cca-b', 'start')}${ph.svg}</g>`;
  }).join('');
  const key = `<rect x="${x}" y="${y + h - 46}" width="22" height="22" rx="5" fill="#16a05a"/>${tx(x + 32, y + h - 28, 'chloroplasts', 'cca-s', 'start')}
    <rect x="${x + 178}" y="${y + h - 46}" width="22" height="22" rx="11" fill="#e0306a"/>${tx(x + 210, y + h - 28, 'mitochondria', 'cca-s', 'start')}`;
  const svg = `<g data-k="${p}-fl" opacity="0">${tx(x, y + 26, `<tspan font-style="italic">Flaveria</tspan> bundle-sheath cells`, 'cca-b', 'start')}
    ${body}${key}${credit(x + w, y + h + 4, 'Sage, Khoshravesh & Sage 2014, J Exp Bot 65:3341, Fig. 2 (colours theirs)')}</g>`;
  return {
    svg, w, h,
    draw(S, t, t0, vis = 1) {
      S.op(S.q(`${p}-fl`), vis * pop(t, t0));
      S14.forEach((_, i) => S.op(S.q(`${p}-f${i}`), pop(t, t0 + 0.05 + i * 0.32)));
    },
  };
}

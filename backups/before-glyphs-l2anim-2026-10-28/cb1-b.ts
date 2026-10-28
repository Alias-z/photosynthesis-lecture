// C1 animation, staging B · "Clippings". History-led, on Bristol paper: the three halftone portraits as avatars beside
// the lollipop photo as a clipping (beat 1); the Nobel-lecture films as clippings laid one on another, then Bassham's
// portrait with his flow tube and the readout (beat 2); the compounds named in the order they took up ¹⁴C, a strip that
// bends into a loop, and the first drawing of the cycle (Bassham et al. 1954) as a clipping beside it (beat 3); then the
// slide's wheel (C1 v1) with the count per 3 CO₂ (beat 4). Story pieces: cb1-common.ts.
import { ar, arcD, defs as figDefs } from '../figs/cb-common';
import {
  ANIM_P, B54, countItems, CR_B54, CR_FILM, F30, F5, flowClip, labMotion, labPhoto, onSlide, pgaMeter, PORTRAITS, pulseItems,
  slideC1, SP5,
} from './cb1-common';
import {
  build, clipping, credit, f1, figOnStage, hide, image, type Item, type Key, leader, pill, pillW, polarV, portraitClip, shadowDef,
  show, T, type V,
} from './cb-kit';

const P = `${ANIM_P}b`;
const D = [3.4, 3.6, 3.9, 5.2];
const S = [0, 3.4, 7.0, 10.9];
const life = (x: number, y: number, a: number, b: number, d = 0.25): Key[] => [{ x, y, o: 0 }, show(a, d), hide(b, 0.3)];

/* ---- beat 1: the three portraits and the lollipop clipping */
const people: Item[] = (['calvin', 'benson', 'bassham'] as const).map((n, i) => ({
  k: `pp-${n}`, svg: portraitClip(P, PORTRAITS[n], n[0].toUpperCase() + n.slice(1), 112, { rot: [-2, 1.5, -1][i], seed: 61 + i }),
  keys: life(300, 128 + i * 244, -1, S[1]),
}));
people.push({ k: 'pp-cr', svg: credit('Calvin: Berkeley Lab 1961|Benson, Bassham: Govindjee et al. 2019, Fig. 2b', 'start'), keys: life(30, 722, -1, S[1]) });
const LW = 700, lab = labPhoto(`${P}l`, LW, { pillsRight: true });
const LC: V = [850, 338];
const labClip: Item = {
  k: 'lab', svg: clipping(P, LW + 36, lab.h + 36, '', { rot: -0.8, seed: 71 }) + lab.svg,
  keys: life(LC[0], LC[1], -1, S[1]),
};
const labCr: Item = { k: 'lab-cr', svg: credit('The “lollipop”: Berkeley Lab photo (R. M. Couto), colorised by LBL · © The Regents of the University of California', 'end'), keys: life(LC[0] + LW / 2 + 18, LC[1] + lab.h / 2 + 40, -1, S[1]) };
const motion = labMotion('lm', lab.at, q => [LC[0] + q[0], LC[1] + q[1]], 0.2, 'scene');
motion.forEach(m => m.keys.push(hide(S[1], 0.3)));

/* ---- beat 2: the films as clippings, then Bassham with his flow tube */
const FW = 560;
function filmClip(k: string, im: typeof F30, rot: number, seed: number, label: string, ringAt: V, rx: number, ry: number): { svg: string; h: number; at: (q: V) => V } {
  const a = image(`${P}-${k}`, im, FW, { mult: true }), m = 20, w = FW + 2 * m, h = a.h + 2 * m + 44;
  const dy = -h / 2 + m + a.h / 2;
  const at = (q: V): V => { const r = a.at(q[0], q[1]); return [r[0], r[1] + dy]; };
  const c = at(ringAt), s = FW / im.w;
  const inner = `<g transform="translate(0 ${f1(dy)})">${a.svg}</g>`
    + `<ellipse class="cbk-ring cbk-ring-green" cx="${f1(c[0])}" cy="${f1(c[1])}" rx="${f1(rx * s)}" ry="${f1(ry * s)}"/>`
    + `${leader([c[0] + 108, c[1] - 52], [c[0] + rx * s + 2, c[1] - 12])}<g transform="translate(${f1(c[0] + 150)} ${f1(c[1] - 66)})">${pill('3-PGA', { size: 24, tint: 'green' })}</g>`
    + T(-w / 2 + m, h / 2 - 18, label, 'clip-find cbk-serif', 'start', ' style="font-size:24px"');
  return { svg: clipping(P, w, h, inner, { rot, seed }), h, at };
}
const C30: V = [520, 360], C5: V = [548, 380];
const fc30 = filmClip('c30', F30, -1.2, 81, '30 s in ¹⁴CO₂, <tspan class="cbk-it">Chlorella</tspan>', [925, 712], 62, 92);
const fc5 = filmClip('c5', F5, 1.3, 83, '5 s in ¹⁴CO₂', [975, 708], 58, 96);
const B2 = { c30: S[1] + 0.1, c5: S[1] + 0.75, sub1: S[1] + 1.85 };
// the veil on the 5 s clipping: everything but its 3-PGA spot (same frame and turn as the clipping)
const s5 = FW / F5.w, pga5 = fc5.at(SP5.pga);
const veil = `<g transform="rotate(1.3)"><mask id="${P}-vm"><rect x="${-FW / 2}" y="${f1(-fc5.h / 2 + 20)}" width="${FW}" height="${f1(fc5.h - 84)}" fill="#fff"/><ellipse cx="${f1(pga5[0] + 4)}" cy="${f1(pga5[1] - 2)}" rx="${f1(70 * s5)}" ry="${f1(100 * s5)}" fill="#000"/></mask>`
  + `<rect class="cbk-veil" x="${-FW / 2}" y="${f1(-fc5.h / 2 + 20)}" width="${FW}" height="${f1(fc5.h - 84)}" mask="url(#${P}-vm)"/></g>`;
const films: Item[] = [
  { k: 'c30', svg: fc30.svg, keys: life(C30[0], C30[1], B2.c30, S[2]) },
  { k: 'c5', svg: fc5.svg, keys: life(C5[0], C5[1], B2.c5, S[2]) },
  { k: 'c5veil', svg: veil, keys: [{ x: C5[0], y: C5[1], o: 0 }, show(B2.sub1, 0.4), hide(S[2], 0.3)] },
  { k: 'c-cr', svg: credit(CR_FILM), keys: life(C30[0] + 20, 716, B2.c30, S[2]) },
];
const basshamClip: Item = { k: 'bas', svg: portraitClip(P, PORTRAITS.bassham, 'Bassham', 118, { rot: -2.2, seed: 91 }), keys: life(1040, 292, B2.sub1, S[2]) };
const flow = flowClip(`${P}f`, [1370, 300], 250, { in: B2.sub1, out: S[2] });
flow.forEach(f => { f.layer = 'scene'; });
const meter = pgaMeter(`${P}`, [1180, 664], 300, { in: B2.sub1, fill: B2.sub1 + 0.25, out: S[2] });
meter.items.forEach(m => { m.layer = 'scene'; });

/* ---- beat 3: the labelling order as a strip, bent into a loop; the 1954 drawing */
type Mol = 'co2' | 'pga' | 'tp' | 'sp' | 'rubp';
const MOLS: Mol[] = ['co2', 'pga', 'tp', 'sp', 'rubp'];
const TXT: Record<Mol, string> = { co2: 'CO₂', pga: '3-PGA', tp: 'triose phosphate', sp: 'sugar phosphates', rubp: 'RuBP' };
const TINT: Record<Mol, string | undefined> = { co2: undefined, pga: 'green', tp: 'blue', sp: 'amber', rubp: 'amber' };
const SZ = 26, GAP = 74;
const widths = MOLS.map(m => pillW(TXT[m], SZ)), total = widths.reduce((a, b) => a + b, 0) + GAP * (MOLS.length - 1);
const stripX: number[] = [];
{ let x = 800 - total / 2; widths.forEach(w => { stripX.push(x + w / 2); x += w + GAP; }); }
const STRIP_Y = 150;
const LOOP_C: V = [400, 440], LOOP_R = 170;
const LOOP_A: Record<Mol, number> = { co2: -90, pga: -30, tp: 90, sp: 150, rubp: -150 };
const loopAt = (m: Mol): V => m === 'co2' ? [LOOP_C[0], LOOP_C[1] - LOOP_R - 78] : polarV(LOOP_C, LOOP_R, LOOP_A[m]);
const B3 = { strip: S[2] + 0.35, step: 0.32, bend: S[2] + 2.05, arcs: S[2] + 2.9, clip: S[2] + 3.2 };
const chips: Item[] = MOLS.map((m, i) => {
  const end = loopAt(m);
  return { k: `m-${m}`, svg: pill(TXT[m], { size: SZ, tint: TINT[m] }), keys: [{ x: stripX[i], y: STRIP_Y, o: 0 }, show(B3.strip + i * B3.step, 0.2), { at: B3.bend, d: 1.0, x: end[0], y: end[1] }, hide(S[3], 0.3)] };
});
const arrows: Item[] = MOLS.slice(0, -1).map((_, i) => ({
  k: `m-ar${i}`, svg: `<path class="cbk-arrow" d="M-22,0 H18 M8,-9 L19,0 L8,9"/>`,
  keys: [{ x: stripX[i] + widths[i] / 2 + GAP / 2, y: STRIP_Y, o: 0 }, show(B3.strip + (i + 0.6) * B3.step, 0.2), hide(B3.bend, 0.25)],
}));
const [cx, cy] = LOOP_C, r = LOOP_R;
const loopSvg = `${ar(`${P}k`, 'green', arcD(cx, cy, r, -138, -44), 'fcb-fat')}${ar(`${P}k`, 'blue', arcD(cx, cy, r, -16, 58), 'fcb-fat')}`
  + `${ar(`${P}k`, 'amber', arcD(cx, cy, r, 124, 141), 'fcb-fat')}${ar(`${P}k`, 'amber', arcD(cx, cy, r, 168, 196), 'fcb-fat')}`
  + `${ar(`${P}k`, 'green', `M${cx},${cy - r - 54} L${cx},${cy - r - 8}`)}`;
const loop: Item = { k: 'loop', svg: `<g class="fig">${loopSvg}</g>`, keys: [{ o: 0 }, show(B3.arcs, 0.35), hide(S[3], 0.3)] };
const b54 = image(`${P}-b54`, B54, 700, { mult: true });
const b54h = b54.h + 40 + 60;
const b54Clip: Item = {
  k: 'b54', svg: clipping(P, 740, b54h, `<g transform="translate(0 ${f1(-b54h / 2 + 20 + b54.h / 2)})">${b54.svg}</g>${T(0, b54h / 2 - 26, '1954: the first drawing of the cycle', 'clip-name cbk-serif', 'middle', ' style="font-size:28px"')}`, { rot: 1.1, seed: 97 }),
  keys: life(1140, 420, B3.clip, S[3]),
};
const b54Cr: Item = { k: 'b54-cr', svg: credit(CR_B54), keys: life(1140, 420 + b54h / 2 + 26, B3.clip, S[3]) };

/* ---- beat 4: the slide's wheel */
const slide: Item = { k: 'slide', svg: figOnStage(slideC1(`${P}w`)), keys: [{ o: 0 }, show(S[3] + 0.2, 0.45)] };

export const STAGING = build({
  id: 'b',
  name: 'B · Clippings',
  note: 'History-led: portraits and clippings (lollipop photo, the Nobel films, Bassham’s flow tube, the 1954 drawing); the labelling order bends into a loop; ends on the slide’s wheel.',
  D,
  holds: [[0], [0.6, 1.75], [], []],
  defs: `${shadowDef(P)}${figDefs(`${P}k`).replace(/^<defs>|<\/defs>$/g, '')}`,
  items: [...people, labClip, labCr, ...motion, ...films, basshamClip, ...flow, ...meter.items, ...chips, ...arrows, loop, b54Clip, b54Cr, slide,
    ...countItems(`${P}n`, onSlide, 1.07, S[3] + 0.75), ...pulseItems(`${P}n`, onSlide, 1.07, S[3] + 0.75)],
  fx(G, api) { meter.fx(G, api); },
});

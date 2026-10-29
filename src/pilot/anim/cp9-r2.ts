// Measuring leaf gas exchange (slide C9), staging r2: the same beats as r1 in another layout. The real LI-6800 photo (cp9-r1.ts
// has its source) stays small on the left the whole time; one eased zoom grows a frame out of its sensor head into the right
// half, holding the LI-6800 manual's head drawing; that gives way to the inside drawn large (sample analyser above, reference analyser below, the
// leaf chamber at the right, as in the schematic). The spectra appear inside the 2 analysers, the gas-cell demo in the
// reference one; then the counted molecules fill them (10 + 5 in, 8 + 7 out) and the 2 formula lines come in below.
import photoJpg from '../../assets/photos/cp9-li6800-maize.jpg';
import licorPng from '../../assets/photos/cp9-li6800-head.svg';
import { beatClock, f1, lerp, mv, setters, stagePill, tw, type V } from './cp-stage';
import {
  BEATS, box, buildMols, cellCtl, cellSvg, defs, flowArrow, FORMULA_A, FORMULA_E, formulaSvg, INK, lab, leafSvg,
  miniSpec, molCtl, molSvg, pipe, slot, type CellG,
} from './cp9-r1';
import type { Staging } from './types';

const P = 'cp9r2';
// the photo, small on the left: the whole 1400 × 2252 image in a 400-wide frame; the sensor head at image px 860, 450
const FX = 40, FY = 48, FW = 400, IS = FW / 1400, FH = 2252 * IS;
const img = (u: number, v: number): V => [FX + u * IS, FY + v * IS];
const HC = img(860, 450), HR = { x: HC[0] - 55, y: HC[1] - 35, w: 110, h: 70 };
const PAN = { x: 500, y: 30, w: 1070, h: 680 };
const H0 = 2.0, Z0 = H0 + 0.2, ZD = 2.4;
const LW = 1040, LH = LW * 213 / 662, LX = PAN.x + (PAN.w - LW) / 2, LY = PAN.y + (PAN.h - LH) / 2;
// the inside, drawn: sample analyser above, reference below, leaf chamber at the right
const BX = 560, BW = 620, BH = 200, SY = 40, RY = 330;
const AIR: V = [470, 285], SPLIT: V = [530, 285];
const CH = { x: 1290, y: 220, w: 250, h: 130 }, LEAF_Y = 322, MY = 262;
const REF_PATH: V[] = [AIR, SPLIT, [SPLIT[0], RY + 100], [BX, RY + 100]];
const SAMP_IN: V[] = [AIR, SPLIT, [CH.x, 285], [CH.x + 30, MY]];
const OUT: V[] = [[1415, CH.y], [1415, SY + 100], [BX + BW, SY + 100]];
const SAMP_PATH: V[] = [...SAMP_IN, [1400, MY], ...OUT];
const gridAt = (y0: number) => (kind: 'c' | 'h', j: number): V => slot(kind, j, BX + 60, BX + 360, y0 + 62, 42);
const H1 = 2.4, H2 = 9.6;
const MOLS = buildMols(P, {
  ref: REF_PATH, refSlots: gridAt(RY), refT0: 1.8, samp: SAMP_PATH, sampSlots: gridAt(SY), sampT0: H2 + 0.3,
  toLeaf: j => [...SAMP_IN, [1370 + 70 * j, MY], [1370 + 70 * j, LEAF_Y - 24]],
  fromLeaf: j => [[1350 + 110 * j, LEAF_Y - 22], [1350 + 110 * j, MY], [1400, MY], ...OUT],
  gap: 0.25, dRef: 3.2, dSamp: 5.6, dLeaf: 3.2, dOut: 3.0, leafT: 3.0,
});
const CELL: CellG = { lamp: BX + 34, ca: BX + 70, cb: BX + 470, y: RY + 160, hh: 22, fx: BX + 500, dx: BX + 540, dw: 50, r: 8, inlet: BX + 100, outlet: BX + 440, meter: false, ports: false, labels: null };
const TEND = [Z0 + ZD + 0.4, 12.2, 20.0, 2.6];

export const STAGING: Staging = {
  id: 'r2',
  name: 'r2 · the photo stays small; the inside drawn large beside it',
  note: 'The LI-6800 photo small on the left throughout; its head grows into the manual’s head drawing, then the inside drawn large: spectra in the 2 analysers, counted CO₂ and H₂O, the 2 formulas.',
  beats: BEATS,
  holds: [[H0], [H1], [H2], []],
  keys: [],
  svg: () => `${defs(P)}
    <g data-k="ph" opacity="0">
      <clipPath id="${P}-fr"><rect x="${FX}" y="${FY}" width="${FW}" height="${FH}" rx="12"/></clipPath>
      <rect x="${FX}" y="${FY}" width="${FW}" height="${FH}" rx="12" fill="#fffdf8" filter="url(#${P}-sh)"/>
      <g clip-path="url(#${P}-fr)"><image href="${photoJpg}" x="${f1(img(0, 0)[0])}" y="${f1(img(0, 0)[1])}" width="${f1(1400 * IS)}" height="${f1(2252 * IS)}" preserveAspectRatio="none"/></g>
      <rect x="${FX}" y="${FY}" width="${FW}" height="${FH}" rx="12" fill="none" stroke="#d3cfc3" stroke-width="1.2"/>
      ${lab(FX, FY + FH + 20, 'Photo: Viséan (LI-6800), Wikimedia Commons,', 'start', 'cps-credit')}${lab(FX, FY + FH + 38, 'CC BY-SA 4.0', 'start', 'cps-credit')}
    </g>
    <g data-k="labs" opacity="0">
      <path d="M222,96 L${f1(img(905, 400)[0])},${f1(img(905, 400)[1])}" stroke="${INK}" stroke-width="1.8"/><circle cx="${f1(img(905, 400)[0])}" cy="${f1(img(905, 400)[1])}" r="4.5" fill="${INK}" stroke="#fffdf8" stroke-width="1.5"/>
      ${stagePill(`${P}-pl`, 132, 96, 'leaf chamber', 'paper', 1)}
      <path d="M205,262 L${f1(img(760, 560)[0])},${f1(img(760, 560)[1])}" stroke="${INK}" stroke-width="1.8"/><circle cx="${f1(img(760, 560)[0])}" cy="${f1(img(760, 560)[1])}" r="4.5" fill="${INK}" stroke="#fffdf8" stroke-width="1.5"/>
      ${stagePill(`${P}-pa`, 132, 262, 'analysers', 'paper', 1)}
    </g>
    <rect data-k="hr" x="${f1(HR.x)}" y="${f1(HR.y)}" width="${HR.w}" height="${HR.h}" rx="8" fill="none" stroke="${INK}" stroke-width="2" opacity="0"/>
    <g data-k="zoom" opacity="0" display="none">
      <path data-k="c1" fill="none" stroke="${INK}" stroke-width="1.2" stroke-dasharray="6 6"/><path data-k="c2" fill="none" stroke="${INK}" stroke-width="1.2" stroke-dasharray="6 6"/>
      <rect data-k="zr" rx="14" fill="#fffdf8" stroke="${INK}" stroke-width="1.6" filter="url(#${P}-sh)"/>
      <g data-k="lc" opacity="0"><image href="${licorPng}" x="${f1(LX)}" y="${f1(LY)}" width="${LW}" height="${f1(LH)}" preserveAspectRatio="none"/></g>
    </g>
    ${lab(PAN.x + PAN.w - 14, LY + LH + 36, 'LI-6800 sensor head: LI-COR LI-6800 manual · © LI-COR, in-class use only', 'end', 'cps-credit', `${P}-lcc`)}
    <g data-k="in" opacity="0" display="none">
      ${pipe(REF_PATH)}${pipe([AIR, SPLIT, [CH.x + 20, 285]])}${pipe(OUT)}
      ${lab(AIR[0], AIR[1] - 20, 'air in', 'start')}
      ${box(BX, SY, BW, BH)}${lab(BX, SY - 12, 'sample analyser', 'start')}
      ${box(BX, RY, BW, BH)}${lab(BX, RY + BH + 30, 'reference analyser', 'start')}
      ${box(CH.x, CH.y, CH.w, CH.h, '#f6f4ec')}${leafSvg(CH.x + 22, CH.x + CH.w - 22, LEAF_Y, 11)}${lab(CH.x + CH.w / 2, CH.y + CH.h + 30, 'leaf chamber')}
      ${flowArrow(P, [BX, SY + 100], [BX - 50, SY + 100])}${flowArrow(P, [BX + BW, RY + 100], [BX + BW + 70, RY + 100])}
      <g data-k="spec">${miniSpec(BX + 60, SY + 32, 320, 66)}${miniSpec(BX + 60, RY + 32, 320, 66)}</g>
      <g data-k="cell" opacity="0" display="none">${cellSvg(`${P}c`, CELL)}</g>
      ${lab(BX + 172, RY + 160, '10 CO₂', 'middle', 'cps-lab', `${P}-n1`)}${lab(BX + 420, RY + 160, '5 H₂O', 'middle', 'cps-lab', `${P}-n2`)}
      ${lab(BX + 172, SY + 160, '8 CO₂', 'middle', 'cps-lab', `${P}-n3`)}${lab(BX + 420, SY + 160, '7 H₂O', 'middle', 'cps-lab', `${P}-n4`)}
      ${MOLS.map(m => molSvg(m.k, m.kind)).join('')}
    </g>
    ${formulaSvg(`${P}-fa`, BX, 614, FORMULA_A)}${formulaSvg(`${P}-fe`, BX, 664, FORMULA_E)}`,

  bind(stage) {
    const S = setters(stage), { q, set, op } = S;
    const cell = cellCtl(S, `${P}c`, CELL, H1 + 1.2, H1 + 2.4, 8.4);
    const mols = molCtl(S, MOLS);
    let last = '';
    return (beatIn, t) => {
      const b = Math.max(0, Math.min(3, Math.round(beatIn))), tt = Math.max(0, Math.min(t, TEND[b]));
      const key = `${b}:${tt.toFixed(3)}`;
      if (key === last) return;
      last = key;
      const T = beatClock(b, tt), t0 = T(0), t1 = T(1), t2 = T(2), t3 = T(3);

      // beat 0: the photo and its labels stay; a frame grows out of the head into the right half, holding the schematic
      op(q('ph'), tw(t0, 0, 1.0));
      op(q('labs'), tw(t0, 1.0, 1.8)); op(q('hr'), tw(t0, 1.0, 1.8));
      const e = mv(t0, Z0, ZD), sc = lerp(HR.w / PAN.w, 1, e);
      const r = { x: lerp(HR.x, PAN.x, e), y: lerp(HR.y, PAN.y, e), w: PAN.w * sc, h: PAN.h * sc };
      const zr = q('zr');
      set(zr, 'x', f1(r.x)); set(zr, 'y', f1(r.y)); set(zr, 'width', f1(r.w)); set(zr, 'height', f1(r.h));
      set(q('c1'), 'd', `M${f1(HR.x + HR.w)},${f1(HR.y)}L${f1(r.x)},${f1(r.y)}`);
      set(q('c2'), 'd', `M${f1(HR.x + HR.w)},${f1(HR.y + HR.h)}L${f1(r.x)},${f1(r.y + r.h)}`);
      set(q('lc'), 'transform', `matrix(${sc.toFixed(4)},0,0,${sc.toFixed(4)},${f1(r.x - PAN.x * sc)},${f1(r.y - PAN.y * sc)})`);
      const out1 = 1 - tw(t1, 0, 1.0);
      op(q('zoom'), tw(t0, Z0, Z0 + 0.8) * out1);
      op(q('lc'), tw(t0, Z0 + 0.3, Z0 + 1.4));
      op(q(`${P}-lcc`), tw(t0, Z0 + ZD - 0.6, Z0 + ZD + 0.3) * out1);

      // beat 1: the inside drawn, the spectra in both analysers, then the gas cell in the reference one
      op(q('in'), tw(t1, 0.6, 1.6));
      const specOut = 1 - tw(t2, 0, 1.0);
      op(q('spec'), tw(t1, 1.2, 2.2) * specOut);
      op(q('cell'), tw(t1, H1 + 0.2, H1 + 1.2) * specOut);
      cell(t1, 1);

      // beat 2: the counted molecules; beat 3: the formulas
      mols(t2, 1);
      op(q(`${P}-n1`), tw(t2, 8.5, 9.4)); op(q(`${P}-n2`), tw(t2, 8.5, 9.4));
      op(q(`${P}-n3`), tw(t2, 19.0, 19.9)); op(q(`${P}-n4`), tw(t2, 19.0, 19.9));
      op(q(`${P}-fa`), tw(t3, 0.4, 1.4)); op(q(`${P}-fe`), tw(t3, 1.4, 2.4));
    };
  },
};

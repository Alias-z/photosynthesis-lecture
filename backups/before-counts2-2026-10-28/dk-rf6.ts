// C6 · Photorespiration (beats RF6), staging s: in the real-protein strip (dk2-common.ts; DARK_ANIM_BRIEF.md). Counted per
// 2 O₂ at RuBisCO; the ledger ticks in step: 4 C in, 1 C lost, 3 C back, NH₃ refixed, 2 ATP, 2 reduced ferredoxin.
// - Beat 1, glycolate: O₂ 1–2 go into RuBisCO; 2-phosphoglycolate 1–2 come out (2 × 2 C = 4 C in); each loses its
//   phosphate in the stroma and leaves as glycolate through PLGG1 into the cytosol.
// - Beat 2, peroxisome: glycolate 1–2 go to glycolate oxidase and take an amino N: glycine 1–2, which go to the
//   mitochondrion.
// - Beat 3, mitochondrion: glycine 1 at glycine decarboxylase gives CO₂ 1 (1 C lost) and NH₃ 1, its other carbon goes to
//   SHMT, where it joins glycine 2: serine 1 (3 C), which leaves for the peroxisome.
// - Beat 4, back to PGA: serine becomes glycerate in the peroxisome (its N stays there), glycerate goes back through
//   PLGG1 and glycerate kinase makes 3-PGA 1 with ATP 1 (3 C back); NH₃ 1 goes to the chloroplast, where GS and
//   Fd-GOGAT refix it with ATP 2 and reduced ferredoxin 1–2 (both from the light reactions, coming in from the left).
//   The peroxisome's and mitochondrion's NADH are left out (not in the captions).
// - Beat 5, 1979: zoom to RuBisCO; the step from 2-phosphoglycolate to glycolate is crossed out, and 2-phosphoglycolate
//   piles up (uncounted).
// - Beat 6, ATP and reductant: the camera pulls back over the whole strip; the thylakoid sends ATP and NADPH to the cycle
//   (GAPDH, PRK) and ATP and reduced ferredoxin to photorespiration (glycerate kinase, GS). Ends on the caption's question.
import { atomBall, row } from '../figs/carbon-form';
import { balls } from '../figs/cell-schema';
import { carrierImg, tagG } from '../figs/chain';
import {
  attrSetter, camTf, curve, ease, f, frame, gasPath, glide, lerpV, SP, ledgerSetter, ledgerSvg, litOf, mixLit, moverSvg, numT, placer,
  sceneSvg, Strip, type Cam, type LedRow, type LitMap, type Mover, type Path, type Put, type V,
} from './dk2-common';
import type { Staging } from './types';

const P = 'dkr6';
const R = 11, ST = 2.15 * R;

/* ---------------------------------------------------------------- glyphs */

const bond = (x0: number, x1: number): string => `<path d="M${f(x0)},0H${f(x1)}" style="stroke:#6b6a64;stroke-width:2.42;fill:none"/>`;
/** A 2-C body (C at −ST, 0) with an end atom that can change: P (2-phosphoglycolate), none (glycolate), N (glycine). */
const c2G = (k: string, n: number): string => `<g data-k="${k}P">${bond(0, ST)}${atomBall(ST, 0, 'P', R)}</g><g data-k="${k}N" opacity="0">${bond(0, ST)}${atomBall(ST, 0, 'N', R)}</g>${row(-ST / 2, 0, 'CC', { r: R })}${numT(n, -ST / 2, -18)}`;
/** A 3-C body (C at −1.5 ST … 0.5 ST) with an end atom: N (serine), none (glycerate), P (3-PGA). */
const c3G = (k: string): string => `<g data-k="${k}N">${bond(ST / 2, 1.5 * ST)}${atomBall(1.5 * ST, 0, 'N', R)}</g><g data-k="${k}P" opacity="0">${bond(ST / 2, 1.5 * ST)}${atomBall(1.5 * ST, 0, 'P', R)}</g>${row(-ST / 2, 0, 'CCC', { r: R })}${numT(1, -ST / 2, -18)}`;
const nh3G = `<g class="chn-g"><circle class="atom atom-H" cx="-13" cy="8" r="6"/><circle class="atom atom-H" cx="13" cy="8" r="6"/><circle class="atom atom-H" cx="0" cy="-14" r="6"/><circle class="cbb-n" r="${R}"/><text class="cbb-nt" y="4.8" text-anchor="middle">N</text></g>`;
const atpG = (n?: number): string => `<g class="chn-g">${tagG(0, 0, 'ATP', 'atp')}</g>${n ? numT(n, 0, -22) : ''}`;
const fdG = (n?: number): string => `${carrierImg('fd', 0, 0, 0.9)}${n ? numT(n, 0, -26) : ''}`;

const MOV: Mover[] = [
  ...[0, 1].map(i => ({ k: `o2${i}`, svg: `<g class="chn-g">${balls(0, 0, 'OO')}</g>${numT(i + 1, 0, -18)}` })),
  ...[0, 1].map(i => ({ k: `c2${i}`, svg: c2G(`c2${i}`, i + 1) })),
  ...[0, 1].map(i => ({ k: `rb${i}`, svg: row(0, 0, 'PCCCCCP', { r: R }), label: i === 0 ? 'RuBP' : undefined, at: [0, 32] as [number, number] })),
  ...[0, 1].map(i => ({ k: `xp${i}`, svg: row(0, 0, 'CCCP', { r: R }) })),
  { k: 'co2', svg: `<g class="chn-g">${balls(0, 0, 'OCO')}</g>${numT(1, -48, 6)}`, label: 'CO₂', at: [34, 6], anchor: 'start' },
  { k: 'nh3', svg: `${nh3G}${numT(1, -26, 6)}`, label: 'NH₃', at: [22, 6], anchor: 'start' },
  { k: 'cb', svg: atomBall(0, 0, 'C', R) },
  { k: 'c3', svg: c3G('c3') },
  ...[0, 1].map(i => ({ k: `atp${i}`, svg: atpG(i + 1) })),
  ...[0, 1].map(i => ({ k: `fd${i}`, svg: fdG(i + 1) })),
  ...[0, 1, 2, 3].map(i => ({ k: `pile${i}`, svg: row(0, 0, 'CCP', { r: R }) })),
  ...['n', 'a0', 'a1', 'a2', 'a3', 'f'].map(k => ({ k: `s${k}`, svg: k === 'n' ? `<g class="chn-g">${tagG(0, 0, 'NADPH', 'nadph')}</g>` : k === 'f' ? fdG() : atpG() })),
];

/* ---------------------------------------------------------------- where (strip units, cell-schema.ts) */

/** At RuBisCO, from the one adapter SP (dk2-common.ts): where 2-phosphoglycolate 1–2 wait; the glycolate arrow's start. */
const PG_AT: V[] = [[SP.pg2[0] - 20, SP.pg2[1] - 24], [SP.pg2[0] + 20, SP.pg2[1] + 20]];
const GLY0: V = [SP.pg2[0] + 36, SP.pg2[1] + 2], GLY1: V = [606, 352];
/** The oxygenation's 3-PGA (uncounted: it stays in the cycle): where the 2 wait. */
const XP_AT: V[] = [SP.oxyPga, [SP.oxyPga[0] - 112, SP.oxyPga[1] + 12]];
const P_XP = (i: number): Path => curve([SP.oxyPgaFrom, SP.oxyPgaTo, XP_AT[i]]);
const P_RB = curve([[SP.rubp[0], SP.rubp[1] + 40], SP.rubp, SP.rubpFrom, SP.rubpTo]);
const GLY_AT: V[] = [[872, 314], [866, 404]];
const GOX_AT: V[] = [[SP.gox[0] - 22, SP.gox[1] - 8], [SP.gox[0] + 28, SP.gox[1] + 22]];
const WAIT: V[] = [[1262, 172], [1214, 112]];
const GDC: V = [SP.gdcP[0] - 16, SP.gdcP[1] - 2], SHMT: V = [SP.shmt[0] - 10, SP.shmt[1] - 6], SER_W: V = [SP.serine[0] + 2, SP.serine[1] - 2];
const PEROX_IN: V = [SP.cat[0] + 20, SP.cat[1] + 38], GK: V = [SP.glyk[0] + 30, SP.glyk[1] + 8], PGA_AT: V = SP.pgaBack;
const GS: V = [SP.gs[0] + 30, SP.gs[1] + 8];
const P_O2 = (i: number): Path => gasPath('o2', 110 + 34 * i);
const P_PG = (i: number): Path => curve([SP.oxyFrom, SP.oxyTo, PG_AT[i]]);
const P_GLY = (i: number): Path => curve([PG_AT[i], lerpV(GLY0, GLY1, 0.5), [690, 380], [760, 370], [818, 374], GLY_AT[i]]);
const P_GOX = (i: number): Path => curve([GLY_AT[i], [928, 300], [978, 254], GOX_AT[i]]);
const P_GLN = (i: number): Path => curve([GOX_AT[i], [1084, 186], [1136, 124], [1196, 110], WAIT[i]]);
const P_GDC = curve([WAIT[0], [1306, 200], GDC]);
const P_SHMT = curve([WAIT[1], [1264, 160], [1292, 250], [1318, 330], SHMT]);
const P_CO2 = curve([[GDC[0] + 22, GDC[1] - 14], [1374, 150], [SP.co2Lost[0], 80], SP.co2Lost]);
const P_NH3a = curve([[GDC[0] - 24, GDC[1] + 20], [1318, 330], [1320, 440], [1308, 520], SP.nh3]);
const P_CB = curve([[GDC[0] + 12, GDC[1]], [1384, 300], [SHMT[0] + 1.5 * ST - 1.5 * ST + ST * 0.5, SHMT[1]]]);
const P_SER = curve([SHMT, [1300, 430], [1250, 462], SER_W]);
const P_PEROX = curve([SER_W, [1112, 474], [1078, 440], PEROX_IN]);
const P_GLYC = curve([PEROX_IN, [968, 350], [904, 314], [848, 334], [760, 334], [748, 306], GK]);
const P_PGA = curve([GK, [SP.glyk[0] + 4, SP.glyk[1] + 32], PGA_AT]);
const P_NH3b = curve([SP.nh3, [1180, 568], [1082, 566], [848, 556], [760, 540], GS]);
/** ATP and reduced ferredoxin come in from the thylakoid side (left of the frame) to glycerate kinase and GS. */
const P_ATP1 = curve([[100, 250], [300, 236], [480, 234], SP.glykAtp]);
const P_ATP2 = curve([[70, 496], [176, 578], [400, 582], [560, 578], [606, 556], SP.nh3Atp]);
const FD_AT: V[] = [SP.fd, [SP.fd[0] - 12, SP.fd[1] - 36]];
const P_FD = (i: number): Path => curve([[70, 500], [176, 586], [420, 588], [566, 580], [600, 540 - 30 * i], FD_AT[i]]);
const PILE: V[] = [[0, -36], [0, -70], [0, 36], [0, -104]].map(([dx, dy]) => [SP.pg2[0] + dx, SP.pg2[1] + dy] as V);
const XAT = lerpV(GLY0, GLY1, 0.8);
/** Beat 6: the light reactions' supply to the cycle and to photorespiration (uncounted). */
const SUP: Record<string, Path> = {
  n: curve([[-4, 64], [100, 64], [150, 96], [188, 166]]), a0: curve([[-4, 96], [86, 98], [124, 146], [184, 206]]),
  a1: curve([[96, 420], [200, 500], [330, 534], SP.regenAtp]), a2: curve([[-4, 110], [200, 130], [420, 180], [560, 230], SP.glykAtp]),
  a3: curve([[96, 440], [200, 600], [420, 606], [580, 582], SP.nh3Atp]), f: curve([[96, 430], [200, 584], [420, 590], [560, 566], SP.fd]),
};

/* ---------------------------------------------------------------- the ledger */

const ROWS: LedRow[] = [
  { name: '2-phosphoglycolate', nums: [1, 2], total: '4 C in' },
  { name: 'CO₂ released', nums: [1], total: '1 C lost' },
  { name: '3-PGA', nums: [1], total: '3 C back' },
  { name: 'NH₃ refixed', nums: [1] },
  { name: 'ATP', nums: [1, 2] },
  { name: 'reduced ferredoxin', nums: [1, 2] },
];
/** Has the event at (beat be, time te) happened by (beat, t)? */
const by = (beat: number, t: number, be: number, te: number): boolean => beat > be || (beat === be && t >= te);

/* ---------------------------------------------------------------- framings and lighting */

/** One still framing for all six beats (lecturer: no zoom in and out): the whole strip, thylakoid to mitochondrion. */
const CAM: Cam = frame(-10, 1550, 0, 1600, -60);
const PLGG1 = { 'glycolate:body': 1, 'glycolate:text': 1 };
const LIT: LitMap[] = [
  litOf(['rubisco', 'o2', 'oxy', 'pg2', 'glycolate']),
  litOf(['glycolate', 'perox', 'glycine']),
  { ...litOf(['glycine', 'mito', 'serine', 'co2-out']), 'nh3:flow': 1 },
  { ...litOf(['serine', 'perox', 'glycerate', 'nh3']), ...PLGG1 },
  { ...litOf(['rubisco', 'o2', 'oxy', 'pg2']), 'glycolate:flow': 1 },
  litOf(['thyl', 'light', 'supply', 'reduce', 'regen', 'glycerate', 'nh3']),
];
const lit = (beat: number, t: number): LitMap => mixLit(beat ? LIT[beat - 1] : {}, LIT[beat], ease(t, 0.1, 0.9));

/* ---------------------------------------------------------------- the script */

interface St { pos: Record<string, Put>; att: Record<string, number> }
function script(beat: number, t: number): St {
  const pos: Record<string, Put> = {}, att: Record<string, number> = {};
  const c2 = (i: number, at: V, o = 1, pO = 1, nO = 0): void => { pos[`c2${i}`] = { at, o }; att[`c2${i}P`] = pO; att[`c2${i}N`] = nO; };
  const c3 = (at: V, o = 1, nO = 1, pO = 0): void => { pos.c3 = { at, o }; att.c3N = nO; att.c3P = pO; };
  if (beat === 0) {
    for (const i of [0, 1]) {
      const g = 0.6 + 0.6 * i, e = 2.0 + 0.6 * i;
      pos[`o2${i}`] = { at: glide(P_O2(i), t, g, 1.5), o: ease(t, g - 0.3, g + 0.1) * (1 - ease(t, g + 1.3, g + 1.6)) };
      pos[`rb${i}`] = { at: glide(P_RB, t, g + 0.1, 1.5), o: ease(t, g - 0.2, g + 0.2) * (1 - ease(t, g + 1.3, g + 1.6)) };
      pos[`xp${i}`] = { at: glide(P_XP(i), t, e, 1.1), o: ease(t, e, e + 0.3) };
      const gl = 4.5 + 0.35 * i;
      c2(i, t < gl ? glide(P_PG(i), t, e, 1.1) : glide(P_GLY(i), t, gl, 2.3), ease(t, e, e + 0.3), 1 - ease(t, 3.8 + 0.2 * i, 4.3 + 0.2 * i));
    }
  }
  if (beat === 1) for (const i of [0, 1]) pos[`xp${i}`] = { at: XP_AT[i], o: 1 - ease(t, 0, 0.8) };
  if (beat === 1) for (const i of [0, 1]) {
    const g = 0.4 + 0.3 * i, n = 2.3 + 0.2 * i, o = 2.9 + 0.35 * i;
    c2(i, t < o ? glide(P_GOX(i), t, g, 1.7) : glide(P_GLN(i), t, o, 2.0), 1, 0, ease(t, n, n + 0.4));
  }
  if (beat === 2) {
    const split = ease(t, 2.0, 2.4);
    c2(0, glide(P_GDC, t, 0.4, 1.5), 1 - split, 0, 1);
    c2(1, glide(P_SHMT, t, 0.6, 1.9), 1 - ease(t, 3.2, 3.5), 0, 1);
    pos.co2 = { at: glide(P_CO2, t, 2.3, 1.6), o: split };
    pos.nh3 = { at: glide(P_NH3a, t, 2.4, 1.8), o: split };
    pos.cb = { at: glide(P_CB, t, 2.3, 1.0), o: split * (1 - ease(t, 3.25, 3.4)) };
    c3(glide(P_SER, t, 3.7, 1.8), ease(t, 3.2, 3.5));
  }
  if (beat >= 3 && beat <= 3) {
    pos.co2 = { at: P_CO2(1), o: 1 };
    const gly = ease(t, 1.5, 1.9), pga = ease(t, 3.9, 4.3);
    c3(t < 1.9 ? glide(P_PEROX, t, 0.3, 1.2) : t < 4.3 ? glide(P_GLYC, t, 1.9, 2.0) : glide(P_PGA, t, 4.3, 0.8), 1, 1 - gly, pga);
    pos.atp0 = { at: glide(P_ATP1, t, 2.3, 1.6), o: ease(t, 2.1, 2.5) * (1 - ease(t, 3.9, 4.3)) };
    // NH₃ refixed at GS once ATP 2 and ferredoxin 1–2 are there (they come in one after another along the stroma's bottom)
    pos.nh3 = { at: glide(P_NH3b, t, 0.9, 3.6), o: 1 - ease(t, 5.3, 5.7) };
    pos.atp1 = { at: glide(P_ATP2, t, 2.4, 1.8), o: ease(t, 2.2, 2.6) * (1 - ease(t, 5.3, 5.7)) };
    for (const i of [0, 1]) pos[`fd${i}`] = { at: glide(P_FD(i), t, 2.9 + 0.5 * i, 1.8), o: ease(t, 2.7 + 0.5 * i, 3.1 + 0.5 * i) * (1 - ease(t, 5.3, 5.7)) };
  }
  if (beat === 4) {
    // the 1979 mutant: 2-phosphoglycolate cannot become glycolate; it piles up
    c3(PGA_AT, 1 - ease(t, 0, 0.6), 0, 1);
    PILE.forEach((at, i) => { const g = 1.2 + 0.55 * i; pos[`pile${i}`] = { at: glide(curve([SP.oxyFrom, SP.oxyTo, at]), t, g, 0.9), o: ease(t, g - 0.1, g + 0.2) }; });
  }
  if (beat === 5) {
    Object.entries(SUP).forEach(([k, p], i) => { const g = 0.9 + 0.25 * i; pos[`s${k}`] = { at: glide(p, t, g, 2.2), o: ease(t, g - 0.2, g + 0.2) }; });
  }
  return { pos, att };
}

/** Name labels of the molecules (strip units): [text, x, y, beat, from, to] (shown while beat === b and from ≤ t < to). */
const NAMES: Array<[string, number, number, number, number, number]> = [
  ['O₂', SP.o2[0] + 6, SP.o2[1] - 24, 0, 0.6, 2.2],
  ['2-phosphoglycolate', SP.pg2[0] + 40, SP.pg2[1] + 56, 0, 2.3, 4.4],
  ['3-PGA', SP.oxyPga[0] + 92, SP.oxyPga[1] + 6, 0, 2.3, 99], ['3-PGA', SP.oxyPga[0] + 92, SP.oxyPga[1] + 6, 1, 0, 0.6],
  ['glycolate', SP.glycolate[0] + 14, SP.glycolate[1] + 44, 0, 6.2, 99], ['glycolate', SP.glycolate[0] + 14, SP.glycolate[1] + 44, 1, 0, 1.0],
  ['glycine', SP.glycine[0], SP.glycine[1] - 26, 1, 4.2, 99], ['glycine', SP.glycine[0], SP.glycine[1] - 26, 2, 0, 0.8],
  ['serine', SP.serine[0] + 2, SP.serine[1] + 44, 2, 5.0, 99], ['serine', SP.serine[0] + 2, SP.serine[1] + 44, 3, 0, 0.8],
  ['glycerate', SP.glycerate[0] + 14, SP.glycerate[1] - 2, 3, 2.4, 3.9],
  ['3-PGA', SP.pgaBack[0] - 2, SP.pgaBack[1] + 40, 3, 4.6, 99], ['2-phosphoglycolate', SP.pg2[0] + 50, SP.pg2[1] - 128, 4, 1.6, 99],
];

export const STAGING: Staging = {
  id: 's',
  name: 's · In the protein strip',
  note: 'The dark-reaction strip, counted per 2 O₂: 2-phosphoglycolate 1–2 → glycolate through PLGG1 → glycine in the peroxisome → serine + CO₂ + NH₃ in the mitochondrion → glycerate → 3-PGA with ATP; NH₃ refixed by GS with ATP and ferredoxin; the 1979 block; then the light reactions feeding both',
  svg: () => {
    const names = NAMES.map(([s, x, y], i) => `<text data-k="${P}-nm${i}" class="cel-mn cel-halo" x="${x}" y="${y}" text-anchor="middle" opacity="0">${s}</text>`).join('');
    const x = `<g data-k="${P}-x" opacity="0"><path class="dk2-x" d="M${f(XAT[0] - 20)},${f(XAT[1] - 20)}l40,40M${f(XAT[0] + 20)},${f(XAT[1] - 20)}l-40,40"/></g>`;
    const hud = ledgerSvg(`${P}-led`, 16, 16, 430, 'per 2 O₂ at RuBisCO', ROWS, { nameW: 196 });
    return sceneSvg(P, { over: names + x, movers: MOV.map(moverSvg).join(''), hud });
  },
  bind(stage) {
    const S = new Strip(stage);
    for (const p of ['o2', 'pg2', 'glycine', 'serine', 'co2-out']) { S.hide(p, 'node'); S.hide(p, 'text'); }
    S.hide('glycolate', 'node'); S.hide('glycolate', 'text', el => !el.textContent?.includes('PLGG1'));
    S.hide('glycerate', 'node'); S.hide('glycerate', 'text', el => !el.textContent?.includes('kinase'));
    S.hide('nh3', 'node'); S.hide('nh3', 'text', el => !el.textContent?.includes('GS'));
    const cam = stage.querySelector('[data-k="cam"]') as SVGGElement;
    cam.setAttribute('transform', camTf(CAM));
    const put = placer(stage, MOV.map(m => m.k)), led = ledgerSetter(stage, `${P}-led`, ROWS), A = attrSetter(stage);
    return (beat, t) => {
      S.light(lit(beat, t));
      const { pos, att } = script(beat, t);
      put(pos);
      for (const [k, v] of Object.entries(att)) A(k, 'opacity', v);
      NAMES.forEach(([, , , b, t0, t1], i) => A(`${P}-nm${i}`, 'opacity', beat === b ? ease(t, t0, t0 + 0.4) * (1 - ease(t, t1, t1 + 0.4)) : 0));
      A(`${P}-x`, 'opacity', beat === 4 ? ease(t, 0.8, 1.2) : 0);
      // the ledger, cumulative over beats 1–4
      const n = (ev: Array<[number, number]>): number => ev.filter(([b, te]) => by(beat, t, b, te)).length;
      led(0, n([[0, 2.4], [0, 3.0]]), by(beat, t, 0, 3.6) ? 1 : 0);
      led(1, n([[2, 3.3]]), by(beat, t, 2, 3.9) ? 1 : 0);
      led(2, n([[3, 4.4]]), by(beat, t, 3, 5.0) ? 1 : 0);
      led(3, n([[3, 5.4]]));
      led(4, n([[3, 4.0], [3, 4.3]]));
      led(5, n([[3, 4.8], [3, 5.3]]));
      A(`${P}-led`, 'opacity', beat === 0 ? ease(t, 0.3, 0.9) : beat < 4 ? 1 : beat === 4 ? 1 - ease(t, 0, 0.5) : 0);
    };
  },
};

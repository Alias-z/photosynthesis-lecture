// C6 · Photorespiration (beats RF6N, beats-rf6n.ts), staging s: the new story in the real-protein strip (dk2-common.ts;
// research/redo-2026-10-28/DARK_COUNTS_BRIEF.md). One still framing, the whole strip; parts are lit, the rest dimmed.
// Counted per 2 O₂ in beats 2–3 only (the ledger, the numbers on the molecules).
// - Beat 1, respiration: a small inset of a mitochondrion: O₂ goes in, CO₂ comes out. The strip stays dim.
// - Beat 2, oxygenation of RuBP: RuBP 1–2 rise into RuBisCO from below, O₂ 1–2 come in from the right; out come
//   3-PGA 1–2 (up, to the cycle) and 2-PG 1–2, which glow red: "toxic: inhibits enzymes of the cycle".
// - Beat 3, recycling, in one run: each 2-PG loses its phosphate and leaves the chloroplast, takes an amino N in the
//   peroxisome (glycine) and goes on to the mitochondrion. There glycine 1 gives CO₂ 1 (out, numbered) and NH₃, and its
//   other carbon joins glycine 2 (serine, 3 C). Serine goes back through the peroxisome (it gives up its N: glycerate) to
//   the chloroplast, where ATP adds a phosphate: 3-PGA 1 (3 C), back to the cycle. Organelles are named; no enzyme names.
//   A takeaway card stays: 2 × 2-PG (4 C) → 3-PGA (3 C) + CO₂ (1 C).
// - Beat 4, why "photorespiration": the respiration inset again, beside the strip, where O₂ is taken up at RuBisCO and the
//   CO₂ leaves the mitochondrion (both glow), with the thylakoid lit: only in the light.
// - Beat 5, waste or function: two cards (Ehleringer & Björkman 1977; Somerville & Ogren 1979).
import { atomBall, row } from '../figs/carbon-form';
import { balls } from '../figs/cell-schema';
import { tagG } from '../figs/chain';
import {
  attrSetter, camTf, cardSvg, curve, ease, f, frame, gasPath, glide, lerpV, ledgerSetter, ledgerSvg, litOf, mixLit, moverSvg,
  numT, placer, poolDefs, poolSvg, sceneSvg, SP, Strip, tAt, uNear, type Cam, type LedRow, type LitMap, type Mover,
  type Path, type Put, type V,
} from './dk2-common';
import type { Staging } from './types';

const P = 'dkr6';
const R = 11, ST = 2.15 * R;

/* ---------------------------------------------------------------- glyphs (numbers in their own group, to fade) */

const bond = (x0: number, x1: number): string => `<path d="M${f(x0)},0H${f(x1)}" style="stroke:#6b6a64;stroke-width:2.42;fill:none"/>`;
const num = (k: string, n: number, x: number, y: number): string => `<g data-k="${k}#">${numT(n, x, y)}</g>`;
/** 2-PG → glycolate → glycine: a 2-C body (C at −ST, 0) whose end atom changes (P, none, N); a red glow while it is 2-PG. */
const c2G = (k: string, n: number): string => `<ellipse data-k="${k}G" rx="44" ry="26" fill="url(#${P}-red)" opacity="0"/>`
  + `<g data-k="${k}P">${bond(0, ST)}${atomBall(ST, 0, 'P', R)}</g><g data-k="${k}N" opacity="0">${bond(0, ST)}${atomBall(ST, 0, 'N', R)}</g>`
  + `${row(-ST / 2, 0, 'CC', { r: R })}${num(k, n, -ST / 2, -18)}`;
/** serine → glycerate → 3-PGA: a 3-C body (C at −1.5 ST … 0.5 ST) whose end atom changes (N, none, P). */
const c3G = (k: string): string => `<g data-k="${k}N">${bond(ST / 2, 1.5 * ST)}${atomBall(1.5 * ST, 0, 'N', R)}</g><g data-k="${k}P" opacity="0">${bond(ST / 2, 1.5 * ST)}${atomBall(1.5 * ST, 0, 'P', R)}</g>${row(-ST / 2, 0, 'CCC', { r: R })}${num(k, 1, -ST / 2, -18)}`;
const nh3G = `<g class="chn-g"><circle class="atom atom-H" cx="-13" cy="8" r="6"/><circle class="atom atom-H" cx="13" cy="8" r="6"/><circle class="atom atom-H" cx="0" cy="-14" r="6"/><circle class="cbb-n" r="${R}"/><text class="cbb-nt" y="4.8" text-anchor="middle">N</text></g>`;

const MOV: Mover[] = [
  ...[0, 1].map(i => ({ k: `rb${i}`, svg: `${row(0, 0, 'PCCCCCP', { r: R })}${num(`rb${i}`, i + 1, -96, 6)}`, label: i === 0 ? 'RuBP' : undefined, at: [0, 32] as V })),
  ...[0, 1].map(i => ({ k: `o2${i}`, svg: `<g class="chn-g">${balls(0, 0, 'OO')}</g>${num(`o2${i}`, i + 1, 0, -18)}` })),
  ...[0, 1].map(i => ({ k: `xp${i}`, svg: `${row(0, 0, 'CCCP', { r: R })}${num(`xp${i}`, i + 1, 0, -18)}` })),
  ...[0, 1].map(i => ({ k: `c2${i}`, svg: c2G(`c2${i}`, i + 1) })),
  { k: 'co2', svg: `<g class="chn-g">${balls(0, 0, 'OCO')}</g>${num('co2', 1, -46, 6)}`, label: 'CO₂', at: [34, 6], anchor: 'start' },
  { k: 'nh3', svg: nh3G, label: 'NH₃', at: [22, 6], anchor: 'start' },
  { k: 'cb', svg: atomBall(0, 0, 'C', R) },
  { k: 'c3', svg: c3G('c3') },
  { k: 'atp', svg: `<g class="chn-g">${tagG(0, 0, 'ATP', 'atp')}</g>` },
  { k: 'adp', svg: `<g class="chn-g">${tagG(0, 0, 'ADP', 'atp')}</g>` },
  { k: 'o2s', svg: `<g class="chn-g">${balls(0, 0, 'OO')}</g>`, label: 'O₂', at: [0, -22] },
];

/* ---------------------------------------------------------------- where: SPOT (cell-schema) through SP */

/** 2-PG 1–2 fan out along their arrow: 1 to the far spot, 2 to the near one, so 2 never passes over 1. */
const PG_AT: V[] = [[SP.pg2[0] + 34, SP.pg2[1]], [SP.pg2[0] - 26, SP.pg2[1] - 32]];
/** The oxygenation's 3-PGA 1–2 fan out along their own arrow (up and right of RuBisCO, clear of its label). */
const XP_AT: V[] = [[SP.oxyPga[0] + 24, SP.oxyPga[1] - 42], SP.oxyPga];
const GLY0: V = [SP.pg2[0] + 36, SP.pg2[1] + 2], GLY1: V = [606, 352];
const GOX_AT: V[] = [[SP.gox[0] - 22, SP.gox[1] - 8], [SP.gox[0] + 28, SP.gox[1] + 22]];
const GDC: V = [SP.gdcP[0] - 16, SP.gdcP[1] - 2], SHMT: V = [SP.shmt[0] - 10, SP.shmt[1] - 6];
const PEROX_IN: V = [SP.cat[0] + 20, SP.cat[1] + 38], GK: V = [SP.glyk[0] + 30, SP.glyk[1] + 8], PGA_AT: V = SP.pgaBack;
const P_O2 = (i: number): Path => gasPath('o2', 110 + 34 * i);
const P_RB = curve([[SP.rubp[0], SP.rubp[1] + 40], SP.rubp, SP.rubpFrom, SP.rubpTo]);
const P_XP = (i: number): Path => curve([[SP.oxyPgaTo[0] - 5, SP.oxyPgaTo[1] + 24], SP.oxyPgaTo, XP_AT[i]]);
const P_PG = (i: number): Path => curve([SP.oxyFrom, SP.oxyTo, PG_AT[i]]);
/** The recycling run of each 2-C molecule: out of the chloroplast through PLGG1, through the peroxisome, to the
 *  mitochondrion's glycine decarboxylase (molecule 1) or SHMT (molecule 2). */
const RUN: Path[] = [0, 1].map(i => curve([PG_AT[i], lerpV(GLY0, GLY1, 0.5), [690, 380], [760, 370], [818, 374], [880, 336], [934, 296], [982, 254], GOX_AT[i],
  [1084, 186], [1136, 124], [1196, 110], ...(i === 0 ? [[1262, 172], [1306, 200], GDC] : [[1236, 140], [1280, 220], [1312, 310], SHMT]) as V[]]));
const U_GOX = RUN.map((p, i) => uNear(p, GOX_AT[i]));
const P_CO2 = curve([[GDC[0] + 22, GDC[1] - 14], [1374, 150], [SP.co2Lost[0], 80], SP.co2Lost]);
/** NH₃ (uncounted) leaves the mitochondrion and goes back along its arrow to glutamine synthetase in the chloroplast. */
const P_NH3 = curve([[GDC[0] - 24, GDC[1] + 20], [1318, 330], [1320, 440], [1308, 520], SP.nh3, [1180, 568], [1082, 566], [848, 556], [760, 540], [SP.gs[0] + 30, SP.gs[1] + 10]]);
const P_CB = curve([[GDC[0] + 12, GDC[1]], [1384, 300], [SHMT[0] + ST, SHMT[1]]]);
/** Serine's run back: through the peroxisome (glycerate), through PLGG1, to glycerate kinase (3-PGA) and on to its spot. */
const BACK = curve([SHMT, [1300, 430], [1250, 462], [SP.serine[0] + 2, SP.serine[1] - 2], [1112, 474], [1078, 440], PEROX_IN, [968, 350], [904, 314], [848, 334], [760, 334], [748, 306], GK, [700, 300], PGA_AT]);
const U_PEROX = uNear(BACK, PEROX_IN), U_GK = uNear(BACK, GK);
const P_ATP = curve([[100, 520], [260, 540], [420, 524], [560, 404], [612, 300], SP.glykAtp]);
/** Beat 3's times: the run, the split in the mitochondrion, the run back. */
const T3 = { run: [0.7, 1.3], d: 4.6, split: 5.5, back: 6.9, bd: 4.0 };
const T_GK = tAt(U_GK, T3.back, T3.bd);
const T_ATP = { g: T_GK - 1.7, d: 1.7 };

/* ---------------------------------------------------------------- the ledger, the inset, the cards (stage units) */

const ROWS: LedRow[] = [
  { name: 'O₂', nums: [1, 2] },
  { name: 'RuBP', nums: [1, 2] },
  { name: '3-PGA', nums: [1, 2] },
  { name: '2-PG', nums: [1, 2], total: '2 × 2 C = 4 C' },
  { name: 'CO₂ released', nums: [1], total: '1 C' },
  { name: '3-PGA back', nums: [1], total: '3 C' },
];
const by = (beat: number, t: number, be: number, te: number): boolean => beat > be || (beat === be && t >= te);
/** The respiration inset: a mitochondrion icon, O₂ in from the left, CO₂ out to the right (stage units). */
/** 1.5 × the first size, at the top between the chloroplast and the mitochondrion (beside the strip's lit parts in beat 4). */
const IN = { x: 600, y: 16, w: 570, h: 294, c: [885, 172] as V };
function insetSvg(): string {
  const [cx, cy] = IN.c;
  const cris = `M${cx - 75},${cy + 27}c15,-45 30,-45 36,-6s24,39 36,0 27,-42 39,-3 24,42 39,0`;
  return `<g data-k="${P}-inset" opacity="0">${cardSvg(IN.x, IN.y, IN.w, IN.h)}
    <text class="dk2-ititle" x="${IN.x + 24}" y="${IN.y + 42}" style="font-size:26px">respiration</text>
    <ellipse class="dk2-imito" cx="${cx}" cy="${cy}" rx="111" ry="69"/><path class="dk2-icris" d="${cris}" style="stroke-width:4"/>
    <text class="cel-zone" x="${cx}" y="${cy + 104}" text-anchor="middle" style="font-size:21px">mitochondrion</text>
    ${moverSvg({ k: 'io2', svg: `<g class="chn-g">${balls(0, 0, 'OO', 16)}</g>`, label: 'O₂', at: [0, -30], cls: 'dk2-ilab' })}
    ${moverSvg({ k: 'ico2', svg: `<g class="chn-g">${balls(0, 0, 'OCO', 16)}</g>`, label: 'CO₂', at: [0, -30], cls: 'dk2-ilab' })}</g>`;
}
const I_O2 = curve([[IN.x + 50, IN.c[1] + 14], [IN.x + 120, IN.c[1]], [IN.c[0] - 45, IN.c[1]]]);
const I_CO2 = curve([[IN.c[0] + 30, IN.c[1]], [IN.c[0] + 144, IN.c[1] - 6], [IN.x + IN.w - 70, IN.c[1] + 12]]);
const TAKE = { x: 16, y: 664, w: 560, h: 56 };
const takeSvg = (): string => `<g data-k="${P}-take" opacity="0">${cardSvg(TAKE.x, TAKE.y, TAKE.w, TAKE.h)}
  <text class="dk2-take" x="${TAKE.x + TAKE.w / 2}" y="${TAKE.y + 36}" text-anchor="middle">2 × 2-PG (4 C) → 3-PGA (3 C) + CO₂ (1 C)</text></g>`;
const card = (k: string, x: number, head: string, lines: string[]): string => `<g data-k="${P}-${k}" opacity="0">${cardSvg(x, 576, 492, 144)}
  <text class="dk2-cardh" x="${x + 20}" y="${606}">${head}</text>${lines.map((l, i) => `<text class="dk2-cardt" x="${x + 20}" y="${634 + i * 24}">${l}</text>`).join('')}</g>`;
const cardsSvg = (): string =>
  card('loss', 596, 'loss', ['at 30 °C ≈ 29 % less CO₂ fixed per absorbed', 'photon in air than in 2 % O₂', '(Ehleringer &amp; Björkman 1977)'])
  + card('func', 1100, 'function', ['removes toxic 2-PG; mutants that cannot', 'recycle it die in air', '(Somerville &amp; Ogren 1979)']);

/* ---------------------------------------------------------------- framing and lighting */

/** One still framing for all five beats: the whole strip, thylakoid to mitochondrion. */
const CAM: Cam = frame(-10, 1550, 0, 1600, -60);
const LOOP: LitMap = { pg2: 1, 'glycolate:flow': 1, 'glycolate:body': 1, 'perox:mem': 1, 'perox-name': 1, 'glycine:flow': 1, 'mito:mem': 1, 'mito-name': 1,
  'serine:flow': 1, 'co2-out:flow': 1, 'glycerate:flow': 1, 'glycerate:body': 1, 'nh3:flow': 1, 'nh3:body': 1 };
const LIT: LitMap[] = [
  {},
  litOf(['rubisco', 'o2', 'oxy', 'pg2']),
  LOOP,
  { ...litOf(['o2', 'rubisco', 'light', 'thyl']), 'co2-out:flow': 1, 'mito:mem': 1, 'mito-name': 1 },
  Object.fromEntries(Object.keys(LOOP).map(k => [k, 0.4])),
];
const lit = (beat: number, t: number): LitMap => mixLit(beat ? LIT[beat - 1] : {}, LIT[beat], ease(t, 0.1, 0.9));

/* ---------------------------------------------------------------- the script */

interface St { pos: Record<string, Put>; att: Record<string, number> }
function script(beat: number, t: number): St {
  const pos: Record<string, Put> = {}, att: Record<string, number> = {};
  const c2 = (i: number, at: V, o: number, pO: number, nO: number, gO: number): void => { pos[`c2${i}`] = { at, o }; att[`c2${i}P`] = pO; att[`c2${i}N`] = nO; att[`c2${i}G`] = gO; };
  const c3 = (at: V, o: number, nO: number, pO: number): void => { pos.c3 = { at, o }; att.c3N = nO; att.c3P = pO; };
  // the inset (beats 1 and 4): O₂ in, CO₂ out; both stay
  if (beat === 0 || beat === 3) {
    const g = beat === 0 ? 0.8 : 0.5;
    pos.io2 = { at: glide(I_O2, t, g, 1.4), o: ease(t, g - 0.3, g) };
    pos.ico2 = { at: glide(I_CO2, t, g + 1.2, 1.4), o: ease(t, g + 1.0, g + 1.3) };
  }
  // the oxygenation's 3-PGA 1–2 stay in the cycle from beat 2 on (dimmed once counting ends)
  const keep = beat >= 3 ? 0.4 : 1;
  if (beat === 1) {
    for (const i of [0, 1]) {
      const g = 0.6 + 0.7 * i, e = 2.7 + 0.7 * i;
      pos[`o2${i}`] = { at: glide(P_O2(i), t, g, 1.5), o: ease(t, g - 0.3, g) * (1 - ease(t, g + 1.3, g + 1.6)) };
      pos[`rb${i}`] = { at: glide(P_RB, t, g + 0.1, 1.5), o: ease(t, g - 0.2, g + 0.1) * (1 - ease(t, g + 1.4, g + 1.7)) };
      pos[`xp${i}`] = { at: glide(P_XP(i), t, e, 1.1), o: ease(t, e - 0.1, e + 0.2) };
      c2(i, glide(P_PG(i), t, e, 1.1), ease(t, e - 0.1, e + 0.2), 1, 0, ease(t, 4.6, 5.2));
    }
  }
  if (beat >= 2) for (const i of [0, 1]) pos[`xp${i}`] = { at: XP_AT[i], o: keep };
  if (beat === 2) {
    for (const i of [0, 1]) {
      const g = T3.run[i], u = ease(t, g, g + T3.d), pO = 1 - ease(t, 0.2, 0.7), nO = ease(u, U_GOX[i] - 0.03, U_GOX[i] + 0.03);
      const fade = i === 0 ? ease(t, T3.split, T3.split + 0.4) : ease(t, T3.split + 0.9, T3.split + 1.2);
      c2(i, RUN[i](u), 1 - fade, pO, nO, 1 - ease(t, 0.2, 0.7));
    }
    const sp = ease(t, T3.split, T3.split + 0.4);
    pos.co2 = { at: glide(P_CO2, t, T3.split + 0.2, 1.5), o: sp };
    pos.nh3 = { at: glide(P_NH3, t, T3.split + 0.3, 4.2), o: sp * (1 - ease(t, T3.split + 4.3, T3.split + 4.7)) };
    pos.cb = { at: glide(P_CB, t, T3.split + 0.2, 0.9), o: sp * (1 - ease(t, T3.split + 1.0, T3.split + 1.2)) };
    const u = ease(t, T3.back, T3.back + T3.bd);
    c3(BACK(u), ease(t, T3.split + 0.9, T3.split + 1.2), 1 - ease(u, U_PEROX - 0.03, U_PEROX + 0.03), ease(t, T_GK - 0.1, T_GK + 0.2));
    pos.atp = { at: glide(P_ATP, t, T_ATP.g, T_ATP.d), o: ease(t, T_ATP.g - 0.2, T_ATP.g + 0.1) * (1 - ease(t, T_GK - 0.1, T_GK + 0.2)) };
    pos.adp = { at: glide(curve([SP.glykAtp, [600, 330], [570, 380]]), t, T_GK, 0.9), o: ease(t, T_GK - 0.1, T_GK + 0.2) * (1 - ease(t, T_GK + 0.7, T_GK + 1.1)) };
  }
  if (beat >= 3) {
    pos.co2 = { at: SP.co2Lost, o: 1 };
    c3(PGA_AT, keep, 0, 1);
  }
  if (beat === 3) pos.o2s = { at: gasPath('o2', 90, 24)(ease(t, 0.8, 2.2)), o: ease(t, 0.6, 0.9) };
  if (beat === 4) pos.o2s = { at: gasPath('o2', 90, 24)(1), o: 1 - ease(t, 0, 0.6) };
  // numbers belong to beats 2–3 only
  const nums = beat === 3 ? 1 - ease(t, 0, 0.5) : beat > 3 ? 0 : 1;
  for (const k of ['rb0', 'rb1', 'o20', 'o21', 'xp0', 'xp1', 'c20', 'c21', 'co2', 'c3']) att[`${k}#`] = nums;
  return { pos, att };
}

/** Name labels (strip units): [text, x, y, beat, from, to, class]. */
const NAMES: Array<[string, number, number, number, number, number, string?]> = [
  ['3-PGA', SP.oxyPga[0] + 92, SP.oxyPga[1] + 6, 1, 3.3, 99], ['3-PGA', SP.oxyPga[0] + 92, SP.oxyPga[1] + 6, 2, 0, 0.6],
  ['2-PG', SP.pg2[0] + 66, SP.pg2[1] - 32, 1, 3.3, 99],
  ['toxic: inhibits', SP.pg2[0] + 44, SP.pg2[1] + 62, 1, 4.6, 99, 'dk2-toxic'], ['enzymes of the cycle', SP.pg2[0] + 44, SP.pg2[1] + 82, 1, 4.6, 99, 'dk2-toxic'],
  ['toxic: inhibits', SP.pg2[0] + 44, SP.pg2[1] + 62, 2, 0, 0.3, 'dk2-toxic'], ['enzymes of the cycle', SP.pg2[0] + 44, SP.pg2[1] + 82, 2, 0, 0.3, 'dk2-toxic'],
  ['glycine', SP.glycine[0], SP.glycine[1] - 26, 2, 2.9, 4.6],
  ['serine', SP.serine[0] + 2, SP.serine[1] + 44, 2, 7.0, 7.9],
  ['3-PGA', SP.pgaBack[0] - 2, SP.pgaBack[1] + 40, 2, 10.6, 99],
];

export const STAGING: Staging = {
  id: 's',
  name: 's · In the protein strip',
  note: 'One still framing of the whole strip: a respiration inset; RuBP 1–2 + O₂ 1–2 → 3-PGA 1–2 + toxic 2-PG 1–2 at RuBisCO; the 2 2-PG recycled in one run to 3-PGA 1 + CO₂ 1; O₂ in at RuBisCO and CO₂ out of the mitochondrion beside the inset; loss and function cards',
  svg: () => {
    const names = NAMES.map(([s, x, y, , , , c], i) => `<text data-k="${P}-nm${i}" class="${c ?? 'cel-mn'} cel-halo" x="${x}" y="${y}" text-anchor="middle" opacity="0">${s}</text>`).join('');
    const defs = `${poolDefs(P)}<defs><radialGradient id="${P}-red"><stop offset="0" class="dk2-red0"/><stop offset=".6" class="dk2-red1"/><stop offset="1" class="dk2-red2"/></radialGradient></defs>`;
    const pools = `${poolSvg(P, `${P}-po2`, SP.o2, 90, 60)}${poolSvg(P, `${P}-pco2`, SP.co2Lost, 100, 56)}`;
    const hud = `${ledgerSvg(`${P}-led`, 16, 16, 380, 'per 2 O₂', ROWS, { nameW: 150 })}${insetSvg()}${takeSvg()}${cardsSvg()}`;
    return sceneSvg(P, { under: defs + pools, over: names, movers: MOV.map(moverSvg).join(''), hud });
  },
  bind(stage) {
    const S = new Strip(stage);
    S.retag('perox', 'text', el => !!el.textContent?.includes('peroxisome'), 'perox-name');
    S.retag('mito', 'text', el => !!el.textContent?.includes('mitochondrion'), 'mito-name');
    for (const p of ['o2', 'pg2', 'glycine', 'serine', 'co2-out', 'glycolate', 'glycerate', 'nh3']) { S.hide(p, 'node'); S.hide(p, 'text'); }
    S.hide('perox', 'node'); S.hide('perox', 'text'); S.hide('mito', 'text');   // enzyme names and H₂O₂ off; organelle names kept (retagged)
    const cam = stage.querySelector('[data-k="cam"]') as SVGGElement;
    cam.setAttribute('transform', camTf(CAM));
    const keys = [...MOV.map(m => m.k), 'io2', 'ico2'];
    const put = placer(stage, keys), led = ledgerSetter(stage, `${P}-led`, ROWS), A = attrSetter(stage);
    return (beat, t) => {
      S.light(lit(beat, t));
      const { pos, att } = script(beat, t);
      put(pos);
      for (const [k, v] of Object.entries(att)) A(k, 'opacity', v);
      NAMES.forEach(([, , , b, t0, t1], i) => A(`${P}-nm${i}`, 'opacity', beat === b ? ease(t, t0, t0 + 0.4) * (1 - ease(t, t1, t1 + 0.4)) : 0));
      // the ledger (beats 2–3), ticking as the molecules arrive and leave
      const n = (ev: Array<[number, number]>): number => ev.filter(([b, te]) => by(beat, t, b, te)).length;
      led(0, n([[1, 2.1], [1, 2.8]])); led(1, n([[1, 2.2], [1, 2.9]]));
      led(2, n([[1, 3.3], [1, 4.0]])); led(3, n([[1, 3.3], [1, 4.0]]), by(beat, t, 1, 4.4) ? 1 : 0);
      led(4, n([[2, T3.split + 1.1]]), by(beat, t, 2, T3.split + 1.4) ? 1 : 0);
      led(5, n([[2, T_GK + 0.1]]), by(beat, t, 2, T_GK + 0.4) ? 1 : 0);
      A(`${P}-led`, 'opacity', beat === 1 ? ease(t, 0.2, 0.7) : beat === 2 ? 1 : beat === 3 ? 1 - ease(t, 0, 0.4) : 0);
      A(`${P}-inset`, 'opacity', beat === 0 ? ease(t, 0.2, 0.6) : beat === 1 ? 1 - ease(t, 0, 0.3) : beat === 3 ? ease(t, 0.3, 0.7) : beat === 4 ? 1 - ease(t, 0, 0.4) : 0);
      A(`${P}-take`, 'opacity', beat === 2 ? ease(t, T_GK + 0.8, T_GK + 1.3) : beat > 2 ? 1 : 0);
      A(`${P}-po2`, 'opacity', beat === 3 ? 0.9 * ease(t, 0.6, 1.2) : beat === 4 ? 0.9 * (1 - ease(t, 0, 0.5)) : 0);
      A(`${P}-pco2`, 'opacity', beat === 3 ? 0.9 * ease(t, 0.6, 1.2) : beat === 4 ? 0.9 * (1 - ease(t, 0, 0.5)) : 0);
      A(`${P}-loss`, 'opacity', beat === 4 ? ease(t, 0.4, 0.9) : 0);
      A(`${P}-func`, 'opacity', beat === 4 ? ease(t, 1.0, 1.5) : 0);
    };
  },
};

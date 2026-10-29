// 'lf11a', staging c2s · C₂ slide, C₃ vs C₂: "the photorespiration strip, 2 fates" (captions C2P, anim/beats-c2p.ts).
// One fixed framing; one thing moves at a time.
// - Left: the photorespiration slide's own strip (dk2-common.ts sceneSvg, framed as anim/dk-rf6.ts frames it, at 0.8),
//   cut before the mitochondrion: thylakoid end, stroma with RuBisCO, envelope, cytosol, peroxisome. Played once (beat 2):
//   RuBisCO carboxylates (RuBP + CO₂ → 2 × 3-PGA), then oxygenates (RuBP + O₂ → 3-PGA + toxic 2-PG); the 2-PG runs out
//   through PLGG1 and the peroxisome (glycine) and waits where the strip's glycine arrow leaves for the mitochondrion.
// - There the path splits into 2 panels on the right, stacked, each a micrograph (Khoshravesh et al. 2016, J. Exp. Bot.,
//   Fig. 1D and 1B, CC BY 3.0) with its bundle sheath ringed, a lens and a round magnifier drawn in the strip's look
//   (matrix and 2 bilayers, real protein renders: glycine decarboxylase PDB 4LHC, RuBisCO PDB 8RUC).
//   - Top, "C₃ leaf": the lens on a mesophyll cell beside an air space; the magnifier: a mitochondrion with glycine
//     decarboxylase, the plasma membrane, the cell wall, the air space.
//   - Bottom, "C₂ leaf": the lens on a bundle-sheath cell; the magnifier: the mesophyll edge, the wall with a
//     plasmodesma, the bundle-sheath chloroplast with RuBisCO and behind it a mitochondrion with glycine decarboxylase.
// - Beats: 1 the bundle sheath and the mesophyll named on both photos, then the lenses and magnifiers (nothing moves);
//   2 the strip; 3 C₃ only: the glycine enters the mesophyll mitochondrion, its CO₂ leaves to the air space; 4 C₂ only:
//   a glycine goes through the plasmodesma into the bundle-sheath mitochondrion, its CO₂ goes to RuBisCO, the bundle
//   sheath glows; then the question (anim/player.ts, after the motion).
// - The essence (lecturer, 29 Oct 2026: "after photorespiration, in one the CO₂ is leaked, in the other it cannot leak, it
//   gets trapped"): the released CO₂ is the hero, slide 19's CO₂ character (co2-kit.ts kidG). In C₃ it crosses the
//   membranes and the wall into the air space and is glad (free); in C₂ its way out runs through the chloroplast, where
//   RuBisCO catches it (strained: it cannot get out). Under each photo, its fate: "much CO₂ escapes", "most CO₂ is
//   trapped" (much, not all; mostly: a little can still leak).
// Glyphs are dk-rf6's, unchanged (R = 11), without its numbers; the panels draw them at the strip's scale.
import steJpg from '../../assets/photos/c11a-steinchisma-c3.jpg';
import homJpg from '../../assets/photos/c11a-homolepis-c2.jpg';
import gdcPng from '../../assets/cell/gdcp.png';
import rubPng from '../../assets/rf/rubisco-8ruc.png';
import { atomBall, row } from '../figs/carbon-form';
import { arrow, balls, bilayer } from '../figs/cell-schema';
import { bilayerE, kidG, T, tangents } from './co2-kit';
import {
  attrSetter, camTf, cardSvg, curve, ease, f, frame, gasPath, glide, lerpV, litOf, mixLit, moverSvg, placer, sceneSvg, SP,
  Strip, uNear, type Cam, type LitMap, type Mover, type Path, type Put, type V,
} from './dk2-common';
import type { Staging } from './types';

const P = 'c2s';
const R = 11, ST = 2.15 * R;

/* ---------------------------------------------------------------- glyphs (dk-rf6.ts, without the numbers) */

const bond = (x0: number, x1: number): string => `<path d="M${f(x0)},0H${f(x1)}" style="stroke:#6b6a64;stroke-width:2.42;fill:none"/>`;
/** 2-PG → glycolate → glycine: a 2-C body whose end atom changes (P, none, N); a red glow while it is 2-PG. */
const c2G = (k: string): string => `<ellipse data-k="${k}G" rx="44" ry="26" fill="url(#${P}-red)" opacity="0"/>`
  + `<g data-k="${k}P">${bond(0, ST)}${atomBall(ST, 0, 'P', R)}</g><g data-k="${k}N" opacity="0">${bond(0, ST)}${atomBall(ST, 0, 'N', R)}</g>`
  + `${row(-ST / 2, 0, 'CC', { r: R })}`;
/** The same glyph as glycine (its N on). */
const glyG = `${bond(0, ST)}${atomBall(ST, 0, 'N', R)}${row(-ST / 2, 0, 'CC', { r: R })}`;
const co2B = `<g class="chn-g">${balls(0, 0, 'OCO')}</g>`;
const o2B = `<g class="chn-g">${balls(0, 0, 'OO')}</g>`;

/** The strip's moving glyphs (strip units). */
const MOV: Mover[] = [
  { k: 'rbA', svg: row(0, 0, 'PCCCCCP', { r: R }), label: 'RuBP', at: [0, 32] },
  { k: 'rbB', svg: row(0, 0, 'PCCCCCP', { r: R }), label: 'RuBP', at: [0, 32] },
  { k: 'co2', svg: co2B, label: 'CO₂', at: [0, -22] },
  { k: 'o2', svg: o2B, label: 'O₂', at: [0, -22] },
  { k: 'pgaC', svg: `${row(0, -13, 'CCCP', { r: R })}${row(0, 13, 'CCCP', { r: R })}` },
  { k: 'xp', svg: row(0, 0, 'CCCP', { r: R }) },
  { k: 'pg', svg: c2G('pg') },
];

/* ---------------------------------------------------------------- the strip: framing and paths (strip units) */

/** The strip from the thylakoid end to just past the peroxisome, at 0.8, stage x 0–952, y 52–564. */
const CAM: Cam = frame(-10, 1180, 0, 952, -40, 52);
const WIN = { x: 0, y: 52, w: 952, h: 512 };
const toStage = (q: V): V => [800 + (q[0] - CAM.c[0]) * CAM.s, 370 + (q[1] - CAM.c[1]) * CAM.s];
const G = CAM.s;

const PG_AT: V = [SP.pg2[0] + 34, SP.pg2[1]];
const XP_AT: V = SP.oxyPga;
const GLY0: V = [SP.pg2[0] + 36, SP.pg2[1] + 2], GLY1: V = [606, 352];
const GOX_AT: V = [SP.gox[0] - 22, SP.gox[1] - 8];
/** Where the glycine waits: on the strip's glycine arrow, leaving the peroxisome for the mitochondrion. */
const GW: V = [1138, 116];
const P_RB = curve([[SP.rubp[0], SP.rubp[1] + 40], SP.rubp, SP.rubpFrom, SP.rubpTo]);
const P_CO2 = gasPath('co2', 110), P_O2 = gasPath('o2', 110);
const P_PGA = curve([[SP.rub[0] - 34, SP.rub[1] - 10], SP.carboxFrom, SP.carboxTo, SP.pga]);
const P_XP = curve([[SP.oxyPgaTo[0] - 5, SP.oxyPgaTo[1] + 24], SP.oxyPgaTo, XP_AT]);
const P_PG = curve([SP.oxyFrom, SP.oxyTo, PG_AT]);
/** dk-rf6's recycling run of molecule 1, out through PLGG1 and the peroxisome, ending on the glycine arrow. */
const RUN = curve([PG_AT, lerpV(GLY0, GLY1, 0.5), [690, 380], [760, 370], [818, 374], [880, 336], [934, 296], [982, 254], GOX_AT,
  [1084, 186], [1112, 150], GW]);
const U_GOX = uNear(RUN, GOX_AT);
/** Beat 2's times (s): each glide's start and length. */
const T2 = { rbA: [0.5, 1.0], co2: [1.5, 1.2], pga: [2.9, 1.0], ox: 4.0, rbB: [4.4, 1.0], o2: [5.4, 1.2], xp: [6.8, 0.8], pg: [7.7, 1.0], tox: 8.7, run: [10.0, 4.0] } as const;

/* ---------------------------------------------------------------- the panels (stage units) */

const CX = 1146, RM = 142, C3: V = [CX, 158], C2: V = [CX, 466];
const PH = { x: 1330, w: 256, k: 0.256, y3: 46, y2: 356 };
const ph = (y0: number, q: V): V => [PH.x + q[0] * PH.k, y0 + q[1] * PH.k];
/** C₃ magnifier: the mitochondrion, the wall (W3 … W3 + 16) and the air space. */
const MT3: V = [1086, 166], W3 = 1176;
/** C₂ magnifier: the wall with the plasmodesma (WL … WR, at PDY), the bundle-sheath chloroplast and mitochondrion. */
const WL = 1034, WR = 1050, PDY = 500;
const BCP: V = [1146, 416], BRUB: V = [1144, 410], BMT: V = [1220, 522];
const GWs = toStage(GW), FORK: V = [952, 173];
const G3: Path = curve([GWs, FORK, [992, 167], [1040, 165], [MT3[0], MT3[1] - 2]]);
const K3: Path = curve([[MT3[0], MT3[1] - 2], [1128, 168], [1168, 176], [1206, 190], [1238, 200]]);
const G2: Path = curve([GWs, [FORK[0], FORK[1] + 3], [972, 232], [980, 400], [994, 476], [1014, PDY], [WL - 8, PDY], [(WL + WR) / 2, PDY], [WR + 8, PDY],
  [1090, 504], [1134, 503], [1176, 509], [BMT[0] - 2, BMT[1] - 2]]);
const K2: Path = curve([[BMT[0] - 2, BMT[1] - 2], [1208, 496], [1194, 470], [1180, 452], [1166, 440]]);

const band = (a: number, b: number, c: V, cls: string): string => `<rect class="${cls}" x="${f(a)}" y="${f(c[1] - RM)}" width="${f(b - a)}" height="${2 * RM}"/>`;
const fibres = (x: number, c: V, skip: (y: number) => boolean = () => false): string => Array.from({ length: 12 }, (_, i) => {
  const y = c[1] - RM + 6 + i * 25;
  return skip(y + 7) ? '' : `<path class="co2k-fib" d="M${f(x + (i % 3) * 4)},${f(y)}q4,7 0,14t0,14"/>`;
}).join('');
const pmV = (x: number, y0: number, y1: number): string => bilayer([{ L: [x, y0, x, y1] }], 5, 1.4, 3.8);
const granum = (x: number, y: number, w: number, n: number): string => Array.from({ length: n }, (_, k) => `<rect class="cel-lumen" x="${f(x - w / 2)}" y="${f(y + k * 7.5)}" width="${f(w)}" height="5" rx="2.5" style="stroke:#9fbf6e;stroke-width:1.1"/>`).join('');
/** A mitochondrion in the strip's look: the matrix, the outer and inner bilayer, glycine decarboxylase (width gw). */
function mitoM(c: V, rx: number, ry: number, gw: number): string {
  return `<ellipse class="cel-matrix" cx="${f(c[0])}" cy="${f(c[1])}" rx="${rx}" ry="${ry}"/>${bilayerE(c[0], c[1], rx, ry, 5)}${bilayerE(c[0], c[1], rx - 16, ry - 14, 5)}
    <image href="${gdcPng}" x="${f(c[0] - gw / 2)}" y="${f(c[1] - (gw * 222) / 302 / 2)}" width="${gw}" height="${f((gw * 222) / 302)}"/>`;
}
const lab = (x: number, y: number, s: string, a: 'start' | 'middle' | 'end' = 'middle'): string => T(x, y, s, 'co2k-il cel-halo', a);

function mag3(): string {
  return `${band(CX - RM, W3, C3, 'co2k-cyt')}${band(W3, W3 + 16, C3, 'co2k-wallb')}${band(W3 + 16, CX + RM, C3, 'co2k-ias')}
    ${fibres(W3 + 4, C3)}${pmV(W3 - 6, C3[1] - RM, C3[1] + RM)}${mitoM(MT3, 64, 44, 44)}
    ${lab(MT3[0], 234, 'mitochondrion')}${lab(1236, 126, 'air space')}`;
}
function mag2(): string {
  const y0 = C2[1] - RM, y1 = C2[1] + RM, h = 11;
  const pd = `<rect class="co2k-cyt" x="${WL - 1}" y="${PDY - h}" width="${WR - WL + 2}" height="${2 * h}"/>
    ${bilayer([{ L: [WL - 6, PDY - h, WR + 6, PDY - h] }], 4, 1.3, 3.6)}${bilayer([{ L: [WL - 6, PDY + h, WR + 6, PDY + h] }], 4, 1.3, 3.6)}
    <path d="M${WL - 8},${PDY}H${WR + 8}" style="stroke:#b9a27a;stroke-width:2.4;stroke-dasharray:2 3;fill:none"/>`;
  const pms = [WL - 6, WR + 6].map(x => pmV(x, y0, PDY - h) + pmV(x, PDY + h, y1)).join('');
  const cp = `<ellipse class="co2k-strm" cx="${BCP[0]}" cy="${BCP[1]}" rx="70" ry="48"/>${granum(1100, 414, 20, 3)}${granum(1190, 392, 18, 2)}
    ${bilayerE(BCP[0], BCP[1], 70, 48, 4)}${bilayerE(BCP[0], BCP[1], 80, 58, 4)}
    <image href="${rubPng}" x="${f(BRUB[0] - 26)}" y="${f(BRUB[1] - (52 * 471) / 548 / 2)}" width="52" height="${f((52 * 471) / 548)}"/>`;
  const glow = `<g clip-path="url(#${P}-bsc)"><ellipse data-k="${P}-glow" opacity="0" cx="1170" cy="${C2[1]}" rx="150" ry="170" fill="url(#${P}-glowg)"/></g>`;
  return `${band(CX - RM, WL, C2, 'co2k-cyt')}${band(WL, WR, C2, 'co2k-wallb')}${band(WR, CX + RM, C2, 'co2k-cyt')}
    ${fibres(WL + 4, C2, y => Math.abs(y - PDY) < 20)}${pms}${pd}${cp}${mitoM(BMT, 50, 32, 32)}${glow}
    ${lab(WL - 4, 538, 'plasmodesma', 'start')}${lab(BRUB[0], 350, 'RuBisCO')}`;
}
function magnifier(k: string, c: V, lens: V, lr: number, inner: string): string {
  return `<g data-k="${P}-${k}l" opacity="0"><path class="co2k-tan" d="${tangents(lens, lr, c, RM)}"/><circle class="co2k-lens" cx="${f(lens[0])}" cy="${f(lens[1])}" r="${lr}"/></g>
    <g data-k="${P}-${k}" opacity="0"><clipPath id="${P}-${k}c"><circle cx="${c[0]}" cy="${c[1]}" r="${RM}"/></clipPath>
    <circle class="co2k-inbg" cx="${c[0]}" cy="${c[1]}" r="${RM}"/><g clip-path="url(#${P}-${k}c)">${inner}</g><circle class="co2k-inring" cx="${c[0]}" cy="${c[1]}" r="${RM}"/></g>`;
}
/** A micrograph with its bundle sheath ringed (photo units: centre, radii) and its 2 names (photo units). */
interface Photo { y: number; href: string; ring: [number, number, number, number]; bs: V; ms: V; lens: V; lr: number }
const PH3: Photo = { y: PH.y3, href: steJpg, ring: [478, 360, 305, 345], bs: [480, 655], ms: [170, 165], lens: [110, 330], lr: 55 };
const PH2: Photo = { y: PH.y2, href: homJpg, ring: [488, 414, 294, 240], bs: [500, 625], ms: [840, 105], lens: [305, 430], lr: 105 };
function photo(k: string, p: Photo): string {
  const [cx, cy] = ph(p.y, [p.ring[0], p.ring[1]]), H = 740 * PH.k;
  return `<image href="${p.href}" x="${PH.x}" y="${p.y}" width="${PH.w}" height="${f(H)}" preserveAspectRatio="none"/>
    <rect x="${PH.x}" y="${p.y}" width="${PH.w}" height="${f(H)}" style="fill:none;stroke:#bdb9ad;stroke-width:1"/>
    ${k === '2' ? `<ellipse data-k="${P}-pglow" opacity="0" cx="${f(cx)}" cy="${f(cy)}" rx="${f(200 * PH.k)}" ry="${f(168 * PH.k)}" style="fill:none;stroke:#f6c453;stroke-width:40;stroke-opacity:.5"/>` : ''}
    <g data-k="${P}-bs${k}" opacity="0"><ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(p.ring[2] * PH.k)}" ry="${f(p.ring[3] * PH.k)}" style="fill:none;stroke:#2f6f5f;stroke-width:2;stroke-dasharray:6 4"/></g>`;
}
const photoNames = (k: string, p: Photo): string => {
  const bs = ph(p.y, p.bs), ms = ph(p.y, p.ms);
  return `<g data-k="${P}-bsn${k}" opacity="0">${T(bs[0], bs[1], 'bundle sheath', 'co2k-zl cel-halo', 'middle', ' style="font-size:16px"')}</g>
    <g data-k="${P}-ms${k}" opacity="0">${T(ms[0], ms[1], 'mesophyll', 'co2k-zl cel-halo', 'middle', ' style="font-size:16px"')}</g>`;
};
/** A moving glyph in stage units, at the strip's scale, its name inside the scaled group. */
const hudMover = (k: string, g: string, name: string, ny: number): string =>
  `<g data-k="m-${k}" opacity="0"><g transform="scale(${f(G)})">${g}<text class="cel-mn cel-halo" x="0" y="${ny}" text-anchor="middle">${name}</text></g></g>`;
/** The path splits at the mitochondrion: one arm into the C₃ magnifier, one down into the C₂ magnifier. */
const F3: V[] = [FORK, [992, 167], [1026, 165]];
const F2: V[] = [[FORK[0], FORK[1] + 3], [972, 232], [980, 400], [994, 476], [1018, PDY - 1]];

/** Each leaf's fate of the released CO₂, under its photo (heading weight). */
const VERDICT = 'font-size:22px;font-weight:700';

function hudSvg(): string {
  const defs = `<defs><radialGradient id="${P}-red"><stop offset="0" class="dk2-red0"/><stop offset=".6" class="dk2-red1"/><stop offset="1" class="dk2-red2"/></radialGradient>
    <radialGradient id="${P}-glowg"><stop offset="0" stop-color="#f6c453" stop-opacity=".55"/><stop offset=".7" stop-color="#f6c453" stop-opacity=".3"/><stop offset="1" stop-color="#f6c453" stop-opacity=".1"/></radialGradient>
    <clipPath id="${P}-bsc"><rect x="${WR}" y="${C2[1] - RM}" width="${CX + RM - WR}" height="${2 * RM}"/></clipPath></defs>`;
  const L3 = ph(PH3.y, PH3.lens), L2 = ph(PH2.y, PH2.lens);
  return `${defs}${cardSvg(966, 4, 628, 302)}${cardSvg(966, 314, 628, 302)}
    ${photo('3', PH3)}${photo('2', PH2)}
    ${magnifier('m3', C3, L3, PH3.lr * PH.k, mag3())}${magnifier('m2', C2, L2, PH2.lr * PH.k, mag2())}
    ${photoNames('3', PH3)}${photoNames('2', PH2)}
    ${T(PH.x + PH.w / 2, 36, 'C₃ leaf', 'co2k-zl', 'middle', ' style="font-size:24px"')}${T(PH.x + PH.w / 2, 346, 'C₂ leaf', 'co2k-zl', 'middle', ' style="font-size:24px"')}
    <g class="chn-off">${arrow(F3, 'pr', { thin: true })}${arrow(F2, 'pr', { thin: true })}</g>
    <g data-k="${P}-f3" opacity="0">${arrow(F3, 'pr', { thin: true })}</g><g data-k="${P}-f2" opacity="0">${arrow(F2, 'pr', { thin: true })}</g>
    ${hudMover('g3', glyG, 'glycine', -26)}${hudMover('g2', glyG, 'glycine', -26)}${kidG(`${P}-kid3`, 12)}${kidG(`${P}-kid2`, 12)}
    ${T(PH.x + PH.w / 2, 274, 'much CO₂ escapes', '', 'middle', ` data-k="${P}-v3" opacity="0" style="${VERDICT};fill:#b0431f"`)}
    ${T(PH.x + PH.w / 2, 584, 'most CO₂ is trapped', '', 'middle', ` data-k="${P}-v2" opacity="0" style="${VERDICT};fill:#2f6f5f"`)}
    ${T(8, 734, '<tspan font-style="italic">Steinchisma laxum</tspan> (C₃), <tspan font-style="italic">Homolepis aturensis</tspan> (C₂): Khoshravesh et al. 2016, J. Exp. Bot. (CC BY 3.0)', 'co2k-cr', 'start')}
    ${T(1592, 734, 'RuBisCO: PDB 8RUC · glycine decarboxylase: PDB 4LHC', 'co2k-cr', 'end')}`;
}

/* ---------------------------------------------------------------- lighting (the strip) */

const L_C0: LitMap = litOf(['rubisco', 'co2']), L_C: LitMap = { ...L_C0, carbox: 1 };
const L_O0: LitMap = { ...litOf(['co2', 'carbox'], 0.35), ...litOf(['rubisco', 'o2']) }, L_O: LitMap = { ...L_O0, oxy: 1 };
const L_R: LitMap = { ...litOf(['rubisco', 'co2', 'carbox', 'o2', 'oxy'], 0.35), 'glycolate:flow': 1, 'glycolate:body': 1, 'perox:mem': 1, 'perox-name': 1, 'glycine:flow': 1 };
const L_E: LitMap = { ...Object.fromEntries(Object.keys(L_R).map(k => [k, 0.3])), 'glycine:flow': 0.6 };
function lit(beat: number, t: number): LitMap {
  if (beat === 0) return {};
  // the gas and RuBisCO first; each reaction's word (and its product arrows) as its products leave, RuBP gone by then
  if (beat === 1) {
    if (t < 2.8) return mixLit({}, L_C0, ease(t, 0.1, 0.6));
    if (t < T2.ox) return mixLit(L_C0, L_C, ease(t, 2.8, 3.2));
    if (t < 6.7) return mixLit(L_C, L_O0, ease(t, T2.ox, T2.ox + 0.5));
    if (t < T2.run[0] - 0.4) return mixLit(L_O0, L_O, ease(t, 6.7, 7.1));
    return mixLit(L_O, L_R, ease(t, T2.run[0] - 0.4, T2.run[0] + 0.2));
  }
  return beat === 2 ? mixLit(L_R, L_E, ease(t, 0, 0.5)) : L_E;
}

/** The strip's names (strip units): [text, x, y, from (beat 2, s), to, class]; to = 99: kept to the end of beat 2. */
const NAMES: Array<[string, number, number, number, number, string?]> = [
  ['3-PGA', SP.pga[0], SP.pga[1] + 50, 3.4, 99],
  ['3-PGA', SP.oxyPga[0] + 80, SP.oxyPga[1] + 6, 7.3, 99],
  ['2-PG', SP.pg2[0] + 66, SP.pg2[1] - 32, 8.4, T2.run[0]],
  ['toxic: inhibits', SP.pg2[0] + 44, SP.pg2[1] + 62, T2.tox, T2.run[0], 'dk2-toxic'], ['enzymes of the cycle', SP.pg2[0] + 44, SP.pg2[1] + 82, T2.tox, T2.run[0], 'dk2-toxic'],
  ['glycine', GW[0], GW[1] - 26, T2.run[0] + T2.run[1] - 0.2, 99],
];

/* ---------------------------------------------------------------- the script */

/** The CO₂ character's state: place, opacity, face (s strained, h glad). */
interface Kid { at: V; o: number; s?: number; h?: number }
function script(beat: number, t: number): { pos: Record<string, Put>; att: Record<string, number>; kid: Record<string, Kid> } {
  const pos: Record<string, Put> = {}, att: Record<string, number> = {}, kid: Record<string, Kid> = {};
  const g = (p: Path, s: readonly [number, number]): V => glide(p, t, s[0], s[1]);
  if (beat === 1) {
    pos.rbA = { at: g(P_RB, T2.rbA), o: ease(t, 0.3, 0.6) * (1 - ease(t, 2.6, 2.9)) };
    pos.co2 = { at: g(P_CO2, T2.co2), o: ease(t, 1.3, 1.6) * (1 - ease(t, 2.6, 2.9)) };
    pos.pgaC = { at: g(P_PGA, T2.pga), o: ease(t, 2.8, 3.1) };
    pos.rbB = { at: g(P_RB, T2.rbB), o: ease(t, 4.2, 4.5) * (1 - ease(t, 6.5, 6.8)) };
    pos.o2 = { at: g(P_O2, T2.o2), o: ease(t, 5.2, 5.5) * (1 - ease(t, 6.5, 6.8)) };
    pos.xp = { at: g(P_XP, T2.xp), o: ease(t, 6.7, 7.0) };
    const u = ease(t, T2.run[0], T2.run[0] + T2.run[1]);
    pos.pg = { at: t < T2.run[0] ? g(P_PG, T2.pg) : RUN(u), o: ease(t, 7.6, 7.9) };
    att.pgP = 1 - ease(t, T2.run[0], T2.run[0] + 0.4);
    att.pgN = ease(u, U_GOX - 0.03, U_GOX + 0.03);
    att.pgG = ease(t, T2.tox, T2.tox + 0.5) * (1 - ease(t, T2.run[0], T2.run[0] + 0.4));
  }
  // the strip's 3-PGA stay in the cycle, dimmed once the panels play
  if (beat >= 2) {
    const o = 1 - 0.6 * (beat === 2 ? ease(t, 0, 0.5) : 1);
    pos.pgaC = { at: SP.pga, o }; pos.xp = { at: XP_AT, o };
  }
  // C₃: the glycine (taking over from the strip's, in place) into the mesophyll mitochondrion; its CO₂ comes out and
  // crosses the membranes and the wall into the air space, glad once it is there (free)
  if (beat === 2) {
    pos.g3 = { at: glide(G3, t, 0.4, 2.2), o: 1 - ease(t, 2.6, 2.85) };
    const at = glide(K3, t, 3.2, 2.4);
    kid.kid3 = { at, o: ease(t, 2.85, 3.15), h: Math.min(1, Math.max(0, (at[0] - W3 - 20) / 30)) };
  }
  // C₂: a glycine through the plasmodesma into the bundle-sheath mitochondrion; its CO₂ heads out, but the way out runs
  // through the chloroplast, where RuBisCO catches it (strained: trapped)
  if (beat === 3) {
    kid.kid3 = { at: K3(1), o: 1, h: 1 };
    pos.g2 = { at: glide(G2, t, 0.5, 3.2), o: ease(t, 0, 0.4) * (1 - ease(t, 3.7, 3.95)) };
    kid.kid2 = { at: glide(K2, t, 4.2, 1.4), o: ease(t, 3.95, 4.25), s: ease(t, 5.4, 5.9) };
  }
  return { pos, att, kid };
}

export const STAGING: Staging = {
  id: 'c2s',
  name: 'c2s · The photorespiration strip, 2 fates',
  note: 'The photorespiration slide’s strip on the left (carboxylation, oxygenation, 2-PG → glycine, played once); at the mitochondrion it splits into 2 stacked panels, each a micrograph with a lens and a magnifier; the released CO₂ is slide 19’s character: in C₃ it escapes from the mesophyll mitochondrion to an air space; in C₂ glycine crosses a plasmodesma to the bundle-sheath mitochondrion and its CO₂ is caught by RuBisCO on its way out (trapped), the bundle sheath glows',
  keys: [
    { beat: 3, text: 'What if the leaf pumped CO₂', x: 800, y: 656, size: 44 },
    { beat: 3, text: 'into the bundle sheath directly?', x: 800, y: 704, size: 44 },
  ],
  svg: () => {
    const names = NAMES.map(([s, x, y, , , c], i) => `<text data-k="${P}-nm${i}" class="${c ?? 'cel-mn'} cel-halo" x="${x}" y="${y}" text-anchor="middle" opacity="0">${s}</text>`).join('');
    const scene = sceneSvg(P, { over: names, movers: MOV.map(moverSvg).join('') });
    return `<defs><clipPath id="${P}-win"><rect x="${WIN.x}" y="${WIN.y}" width="${WIN.w}" height="${WIN.h}" rx="14"/></clipPath></defs>
      <g clip-path="url(#${P}-win)">${scene}</g>
      <rect x="${WIN.x + 0.6}" y="${WIN.y + 0.6}" width="${WIN.w - 1.2}" height="${WIN.h - 1.2}" rx="14" style="fill:none;stroke:#d8d5cb;stroke-width:1.2"/>
      <g class="dk1 fig dk2 co2k">${hudSvg()}</g>`;
  },
  bind(stage) {
    const S = new Strip(stage);
    S.retag('perox', 'text', el => !!el.textContent?.includes('peroxisome'), 'perox-name');
    for (const p of ['o2', 'pg2', 'glycine', 'serine', 'co2-out', 'glycolate', 'glycerate', 'nh3']) { S.hide(p, 'node'); S.hide(p, 'text'); }
    S.hide('perox', 'node'); S.hide('perox', 'text'); S.hide('mito', 'text');   // enzyme names and H₂O₂ off; "peroxisome" kept
    (stage.querySelector('[data-k="cam"]') as SVGGElement).setAttribute('transform', camTf(CAM));
    const put = placer(stage, [...MOV.map(m => m.k), 'g3', 'g2']), A = attrSetter(stage);
    return (beat, t) => {
      S.light(lit(beat, t));
      const { pos, att, kid } = script(beat, t);
      put(pos);
      // the CO₂ characters (co2-kit.ts kid(), on this staging's setter): hidden unless shown; one face at a time
      for (const k of ['kid3', 'kid2']) {
        const q = kid[k], key = `${P}-${k}`, o = q ? q.o : 0;
        A(key, 'display', o < 0.004 ? 'none' : 'inline'); A(key, 'opacity', o);
        if (!q || o < 0.004) continue;
        const s = q.s ?? 0, h = q.h ?? 0;
        A(key, 'transform', `translate(${f(q.at[0])} ${f(q.at[1])})`);
        A(`${key}-fn`, 'opacity', Math.max(0, 1 - s - h)); A(`${key}-fs`, 'opacity', s); A(`${key}-fh`, 'opacity', h);
        A(`${key}-sw`, 'opacity', 0); A(`${key}-sh`, 'opacity', 0); A(`${key}-l`, 'opacity', 1);
      }
      A(`${P}-v3`, 'opacity', beat === 2 ? ease(t, 5.8, 6.3) : beat === 3 ? 1 : 0);
      A(`${P}-v2`, 'opacity', beat === 3 ? ease(t, 6.3, 6.8) : 0);
      for (const [k, v] of Object.entries(att)) A(k, 'opacity', v);
      // the strip's names: in beat 2; the 3-PGA names fade as beat 3 begins; the glycine's passes to the panel's glycine
      NAMES.forEach(([s, , , t0, t1], i) => A(`${P}-nm${i}`, 'opacity', beat === 1 ? ease(t, t0, t0 + 0.4) * (t1 === 99 ? 1 : 1 - ease(t, t1, t1 + 0.4))
        : beat === 2 && t1 === 99 && s !== 'glycine' ? 1 - ease(t, 0, 0.4) : 0));
      // beat 1: on both photos the bundle sheath, then the mesophyll, named; then the lenses and the magnifiers
      const on = (t0: number): number => (beat > 0 ? 1 : ease(t, t0, t0 + 0.5));
      for (const k of ['3', '2']) { A(`${P}-bs${k}`, 'opacity', on(0.4)); A(`${P}-bsn${k}`, 'opacity', on(0.4)); A(`${P}-ms${k}`, 'opacity', on(1.2)); }
      for (const k of ['m3l', 'm2l']) A(`${P}-${k}`, 'opacity', on(2.0));
      for (const k of ['m3', 'm2']) A(`${P}-${k}`, 'opacity', on(2.4));
      // the arm of the split that plays is lit
      A(`${P}-f3`, 'opacity', beat === 2 ? ease(t, 0, 0.4) : beat === 3 ? 1 - 0.5 * ease(t, 0, 0.4) : 0);
      A(`${P}-f2`, 'opacity', beat === 3 ? ease(t, 0, 0.4) : 0);
      // beat 4: the bundle sheath glows, in the magnifier and on the photo
      const glow = beat === 3 ? ease(t, 5.8, 7.0) : 0;
      A(`${P}-glow`, 'opacity', glow); A(`${P}-pglow`, 'opacity', glow);
    };
  },
};

// 'lf13', staging camp · C₄ separates the 2 steps in space, CAM in time (slide 22). Two halves side by side, each a real
// micrograph with a lens and a round magnifier drawn with the deck's kit (bilayers, real protein structures, atom-ball
// molecules), mirrored so that the 2 magnifiers meet in the middle: [maize photo | C₄ magnifier || CAM magnifier |
// succulent photo]. Slide 19's CO₂ character is the hero on both sides; the carbon it becomes in the C₄ acid wears its
// face (with the deck's amber "just fixed" halo), so the eye can follow it. One fixed framing; one thing moves at a time.
// - Left (the C₄ slide's picture, anim/c4-kranz.ts): maize leaf (Berkshire Community College Bioscience Image Library,
//   Wikimedia Commons, CC0), the lens on a bundle-sheath/mesophyll wall; in the magnifier the bundle-sheath chloroplast
//   with RuBisCO (PDB 8RUC), the wall with a plasmodesma, the mesophyll cytosol with PEPC (PDB 3ZGE).
// - Right: a succulent leaf in cross-section, a stoma over its substomatal chamber (same library, CC0; cp-succulent-xs.jpg,
//   as on slide 19), the lens on the stoma; in the magnifier the stoma (2 guard cells with their plasma membrane), the air
//   space, one mesophyll cell: wall, plasma membrane, cytosol with PEPC and a chloroplast with RuBisCO, and the large
//   central vacuole behind its tonoplast (≥ 90 % of a CAM mesophyll cell; Winter & Smith 2022). A small pill above it
//   says night or day; at night the magnifier and the photo are tinted dark blue.
// - Beat 1: the left half fades in and plays the pump once (CO₂ caught by PEPC, the C₄ acid through the plasmodesma, CO₂
//   released at RuBisCO); hold; the right half fades in, named.
// - Beat 2 (night): the left dims; night falls; the stoma opens; hold; the CO₂ comes in through the pore (turned to fit
//   it, as on slide 19), is caught by PEPC, and its C₄ acid goes into the vacuole as malic acid, where it sleeps; hold;
//   more malic acid fills the vacuole, one at a time.
// - Beat 3 (day): day breaks; the stoma closes; hold; the hero wakes, its malic acid leaves the vacuole and releases the
//   CO₂, which goes into the chloroplast to RuBisCO; hold; the rest of the vacuole's malic acid fades, one at a time.
// - Beat 4: the left returns; the titles turn into the 2 pills, each with sun and moon marks at its 2 enzymes (C₄: sun,
//   sun; CAM: moon at PEPC, sun at RuBisCO); then the closing question.
// Facts: CAM: at night CO₂ (as HCO₃⁻) is fixed by cytosolic PEPC and stored as malic acid in the vacuole; by day the
// stomata close, malic acid is decarboxylated and RuBisCO refixes the CO₂ behind closed stomata; high water-use
// efficiency (Winter & Smith 2022, New Phytol. 233:599, "The CAM cycle"); temporal separation of carboxylation, high
// water-use efficiency (Borland et al. 2009, J. Exp. Bot. 60:2879). C₄: PEPC in the mesophyll and RuBisCO in the bundle
// sheath work together by day (von Caemmerer 2021).
import zeaJpg from '../../assets/photos/c12-zea-kranz.jpg';
import succJpg from '../../assets/photos/cp-succulent-xs.jpg';
import pepcPng from '../../assets/rf/pepc-3zge.png';
import rubPng from '../../assets/rf/rubisco-8ruc.png';
import { bilayer } from '../figs/cell-schema';
import {
  actor, add, bilayerE, carbG, clamp, driftM, ease, f, flash, flashDefs, flashG, glide, inset, kid, kidG, lerp, makeScene,
  sunG, T, type Api, type V,
} from './co2-kit';
import type { Beat, Cite, Staging, StageKey } from './types';

const P = 'camp';

/* ---------------------------------------------------------------- captions */

const VC21: Cite = { label: 'von Caemmerer 2021, J. Exp. Bot.', url: 'https://doi.org/10.1093/jxb/erab266' };
const WS22: Cite = { label: 'Winter & Smith 2022, New Phytol.', url: 'https://doi.org/10.1111/nph.17790' };
const BOR09: Cite = { label: 'Borland et al. 2009, J. Exp. Bot.', url: 'https://doi.org/10.1093/jxb/erp118' };

const BEATS: Beat[] = [
  { tag: 'C₄: 2 cells at the same time', say: 'In maize, PEPC fixes CO₂ (as HCO₃⁻) in the mesophyll cell, and the C₄ acid carries it to RuBisCO in the bundle-sheath cell; both enzymes work at the same time. CAM plants use the same 2 enzymes in 1 cell.', cite: [VC21, WS22] },
  { tag: 'CAM at night', say: 'At night the stomata open. PEPC fixes CO₂ (as HCO₃⁻) into a C₄ acid, stored as malic acid in the large central vacuole, which fills through the night. The cool night air draws little water from the leaf.', cite: [WS22, BOR09] },
  { tag: 'CAM by day', say: 'By day the stomata stay closed. Malic acid leaves the vacuole and releases its CO₂, which RuBisCO fixes with the energy of the light reactions. So far less water is lost per CO₂ fixed.', cite: [WS22, BOR09] },
  { tag: 'Separated in space or in time', say: 'C₄ separates the 2 steps in space, between 2 cells; CAM separates them in time, night and day, in 1 cell. <b>Which type turns the most sunlight into biomass?</b>', cite: [BOR09] },
];

/** Steps inside each beat (s): the player stops at each and waits for a click. */
const HOLDS: number[][] = [[7.4], [3.0, 8.7], [2.5, 7.1], [2.2]];

/** The closing question, one line centred at x 800 in the free band under the 2 halves (it shows once the motion stops). */
const KEYS: StageKey[] = [{ beat: 3, text: 'Which type turns the most sunlight into biomass?', x: 800, y: 686, size: 44 }];

/* ---------------------------------------------------------------- shared glyphs */

const R = 224, MY = 390;
const CL: V = [564, MY], CR: V = [1036, MY];
const r10 = 10, ST = r10 * 2.15;
const lab = (x: number, y: number, s: string, a: 'start' | 'middle' | 'end' = 'middle', cls = 'co2k-il cel-halo'): string => T(x, y, s, cls, a);
const mn = (x: number, y: number, s: string): string => T(x, y, s, 'cel-mn cel-halo');
const img = (href: string, cx: number, cy: number, w: number, ar: number): string => `<image href="${href}" x="${f(cx - w / 2)}" y="${f(cy - (w * ar) / 2)}" width="${w}" height="${f(w * ar)}"/>`;
const RUB_AR = 471 / 548, PEPC_AR = 517 / 608;

/** The CO₂ character's face, drawn on a carbon ball of radius r: neutral, strained (caught) and asleep, each keyed. */
function faces(k: string, r: number): string {
  const R_ = (v: number): string => f(v * r), sw = `stroke-width:${f(Math.max(1.4, r * 0.13))}px`;
  const p = (d: string): string => `<path class="co2k-face" d="${d}" style="${sw}"/>`;
  const eye = (x: number): string => `<circle class="co2k-eye" cx="${R_(x)}" cy="${R_(-0.14)}" r="${f(Math.max(1.5, r * 0.13))}"/>`;
  const neutral = `${eye(-0.36)}${eye(0.36)}${p(`M${R_(-0.3)},${R_(0.36)}Q0,${R_(0.5)} ${R_(0.3)},${R_(0.36)}`)}`;
  const strained = p(`M${R_(-0.56)},${R_(-0.34)}L${R_(-0.22)},${R_(-0.14)}L${R_(-0.56)},${R_(0.04)}M${R_(0.56)},${R_(-0.34)}L${R_(0.22)},${R_(-0.14)}L${R_(0.56)},${R_(0.04)}`)
    + p(`M${R_(-0.3)},${R_(0.44)}l${R_(0.15)},${R_(-0.12)}l${R_(0.15)},${R_(0.12)}l${R_(0.15)},${R_(-0.12)}l${R_(0.15)},${R_(0.12)}`);
  const asleep = p(`M${R_(-0.54)},${R_(-0.12)}Q${R_(-0.36)},${R_(0.08)} ${R_(-0.18)},${R_(-0.12)}M${R_(0.18)},${R_(-0.12)}Q${R_(0.36)},${R_(0.08)} ${R_(0.54)},${R_(-0.12)}`)
    + p(`M${R_(-0.14)},${R_(0.42)}H${R_(0.14)}`);
  return `<g data-k="${k}-fn">${neutral}</g><g data-k="${k}-fs">${strained}</g><g data-k="${k}-fz">${asleep}</g>`;
}
/** The C₄ acid with the hero carbon (end `at`: 0 left, 3 right) wearing the face and the amber "just fixed" halo; on the
 *  right, "z z" when it sleeps. */
function heroAcid(k: string, at: 0 | 3): string {
  const hx = (at - 1.5) * ST;
  const zz = `<g data-k="${k}-zz"><text x="${f(hx + 12)}" y="-20" style="font-size:15px;font-weight:700;font-style:italic;fill:#46538a">z</text><text x="${f(hx + 22)}" y="-33" style="font-size:19px;font-weight:700;font-style:italic;fill:#46538a">z</text></g>`;
  return actor(k, `${carbG('CCCC', r10)}<g transform="translate(${f(hx)} 0)"><circle r="${f(r10 + 3.4)}" style="fill:#f2b705;opacity:.45"/>
    <circle r="${r10}" style="fill:#d9633a;stroke:#9b3e1e;stroke-width:1.3"/>${faces(k, r10)}</g>${at === 3 ? zz : ''}`);
}
/** Shows the hero acid: face weights neutral n, strained s, asleep z; z z on z2. */
function hero(a: Api, k: string, at: V, o: number, n: number, s: number, z: number, z2 = 0): void {
  a.put(k, at, o);
  a.op(`${k}-fn`, n); a.op(`${k}-fs`, s); a.op(`${k}-fz`, z);
  if (z2 >= 0) a.op(`${k}-zz`, z2);
}
/** The moon: a crescent at the origin (radius 12). */
const moonG = (sc = 1): string => `<path transform="scale(${sc})" d="M-2.36,-11.77A12,12 0 1 0 11.77,2.36A10,10 0 0 1 -2.36,-11.77Z" style="fill:#c9cfe8;stroke:#5d6898;stroke-width:1.6;stroke-linejoin:round"/>`;
/** A pill (paper card) centred on (x, y) with its text. */
const pill = (x: number, y: number, w: number, h: number, inner: string, stroke = '#d8d5cb'): string =>
  `<rect x="${f(x - w / 2)}" y="${f(y - h / 2)}" width="${w}" height="${h}" rx="${h / 2}" style="fill:#fffdf8;stroke:${stroke};stroke-width:1.4"/>${inner}`;
const big = (x: number, y: number, s: string, size = 24): string => `<text x="${f(x)}" y="${f(y)}" text-anchor="middle" style="font-size:${size}px;font-weight:700;fill:#141413">${s}</text>`;

/** A photo cropped into a rounded frame: image of size iw × ih, crop (cx, cy, cw, ch) shown at (x, y), width w. */
function photo(k: string, href: string, iw: number, ih: number, crop: [number, number, number, number], x: number, y: number, w: number): { svg: string; at: (p: V) => V; s: number } {
  const [cx, cy, cw, ch] = crop, s = w / cw, h = ch * s;
  return {
    s, at: p => [x + (p[0] - cx) * s, y + (p[1] - cy) * s],
    svg: `<clipPath id="${k}-c"><rect x="${x}" y="${y}" width="${w}" height="${f(h)}" rx="10"/></clipPath>
      <g clip-path="url(#${k}-c)"><image href="${href}" x="${f(x - cx * s)}" y="${f(y - cy * s)}" width="${f(iw * s)}" height="${f(ih * s)}" preserveAspectRatio="none"/></g>
      <rect x="${x}" y="${y}" width="${w}" height="${f(h)}" rx="10" style="fill:none;stroke:#bdb9ad;stroke-width:1.4"/>`,
  };
}
const PH_Y = 200, PH_W = 300;

/* ================================================================ the left half: C₄ (maize) */

const ZEA = photo(`${P}-zea`, zeaJpg, 1000, 740, [250, 25, 540, 690], 12, PH_Y, PH_W);
/** The lens on the bundle-sheath/mesophyll wall (anim/c4-kranz.ts: photo point (752, 386)); the ring of bundle-sheath cells. */
const LENS_L = ZEA.at([752, 386]);
const RING_C = ZEA.at([515, 380]);

const L = {
  top: CL[1] - R, bot: CL[1] + R, x0: CL[0] - R, x1: CL[0] + R,
  W0: CL[0] - 17, W1: CL[0] + 17, PDY: 400,
  CP: [440, 388] as V, CRX: 84, CRY: 136,
  RUB: [432, 330] as V, RUBW: 100,
  PEPC: [666, 300] as V, PEPCW: 106,
};
const PM_B = L.W0 - 6, PM_M = L.W1 + 6;
/** The CO₂ from beyond the circle into PEPC; the C₄ acid out of PEPC, through the plasmodesma into the chloroplast. */
const KL_IN: V[] = [[820, 476], [776, 462], [738, 428], [712, 380], [706, 346]];
const KL_DOCK = KL_IN[KL_IN.length - 1];
const AL_AT: V = [650, 364];
const AL_PATH: V[] = [AL_AT, [624, 388], [PM_M + 10, L.PDY], [CL[0], L.PDY], [PM_B - 12, L.PDY], [506, 416], [470, 440]];
const AL_STOP = AL_PATH[AL_PATH.length - 1];
/** The released CO₂ starts just off the hero carbon (up and out, clear of the 3 carbons left) and goes to RuBisCO. */
const KL_OUT: V = [AL_STOP[0] - 1.5 * ST - 8, AL_STOP[1] - 14], KL_RUB: V = [442, 364];
const PYR_L: V = [AL_STOP[0] + 0.5 * ST, AL_STOP[1]];

const bandL = (a: number, b: number, cls: string): string => `<rect class="${cls}" x="${f(a)}" y="${L.top}" width="${f(b - a)}" height="${2 * R}"/>`;
const pmVL = (x: number): string => bilayer([{ L: [x, L.top, x, L.PDY - 16] }], 6, 1.6, 4.2) + bilayer([{ L: [x, L.PDY + 16, x, L.bot] }], 6, 1.6, 4.2);
const granum = (x: number, y: number, w: number, n = 4): string => Array.from({ length: n }, (_, k) => `<rect class="cel-lumen" x="${f(x - w / 2)}" y="${f(y + k * 8.5)}" width="${f(w)}" height="6" rx="3" style="stroke:#9fbf6e;stroke-width:1.2"/>`).join('');

function magnifierL(): string {
  const fib = Array.from({ length: 19 }, (_, i) => { const y = L.top + 10 + i * 24; return Math.abs(y + 7 - L.PDY) < 26 ? '' : `<path class="co2k-fib" d="M${L.W0 + 7 + (i % 3) * 7},${y}q5,7 0,14t0,14"/>`; }).join('');
  const pd = `<rect x="${L.W0 - 1}" y="${L.PDY - 16}" width="${L.W1 - L.W0 + 2}" height="32" class="co2k-cyt"/>
    ${bilayer([{ L: [PM_B, L.PDY - 16, PM_M, L.PDY - 16] }], 5, 1.5, 4)}${bilayer([{ L: [PM_B, L.PDY + 16, PM_M, L.PDY + 16] }], 5, 1.5, 4)}
    <path d="M${PM_B - 4},${L.PDY}H${PM_M + 4}" style="stroke:#b9a27a;stroke-width:3;stroke-dasharray:2 3;fill:none"/>`;
  const cp = `<ellipse class="co2k-strm" cx="${L.CP[0]}" cy="${L.CP[1]}" rx="${L.CRX}" ry="${L.CRY}"/>
    ${bilayerE(L.CP[0], L.CP[1], L.CRX, L.CRY, 4)}${bilayerE(L.CP[0], L.CP[1], L.CRX + 10, L.CRY + 10, 4)}
    ${granum(404, 466, 54)}${granum(462, 488, 46, 3)}${granum(470, 386, 40, 3)}${img(rubPng, L.RUB[0], L.RUB[1], L.RUBW, RUB_AR)}`;
  return `${bandL(L.x0, L.W0, 'co2k-cyt')}${bandL(L.W0, L.W1, 'co2k-wallb')}${bandL(L.W1, L.x1, 'co2k-cyt')}${fib}${pmVL(PM_B)}${pmVL(PM_M)}${pd}
    ${cp}${img(pepcPng, L.PEPC[0], L.PEPC[1], L.PEPCW, PEPC_AR)}
    ${lab(L.RUB[0], 276, 'RuBisCO')}${lab(L.PEPC[0], 246, 'PEPC')}${lab(CL[0], 366, 'plasmodesma')}
    ${actor(`${P}-iL`, `<g transform="translate(${L.RUB[0] + 68} 270)">${sunG(7)}</g><g transform="translate(${L.PEPC[0] - 50} 240)">${sunG(7)}</g>`)}
    ${actor(`${P}-flL`, flashG(P, 32))}
    ${heroAcid(`${P}-aL`, 0)}${actor(`${P}-aLl`, mn(0, -24, 'C₄ acid'))}${actor(`${P}-pL`, carbG('CCC', r10))}
    ${kidG(`${P}-kL`, 12, 'CO₂', -24)}`;
}

/* ================================================================ the right half: CAM (a succulent leaf) */

const SUC = photo(`${P}-suc`, succJpg, 1800, 1015, [360, 40, 540, 690], 1288, PH_Y, PH_W);
/** The lens on the stoma and the top of its substomatal chamber (photo point (525, 300)). */
const LENS_R = SUC.at([525, 300]);

const Rr = {
  top: CR[1] - R, bot: CR[1] + R, x0: CR[0] - R, x1: CR[0] + R,
  CUT: 198, EPI0: 204, EPI1: 246, WALL0: 274, WALL1: 290, PM: 296, TONO: 446,
  GCY: 224, GRX: 26, GRY: 21,
  PEPC: [930, 372] as V, PEPCW: 96,
  CP: [1150, 384] as V, CRX: 70, CRY: 42,
  RUB: [1148, 384] as V, RUBW: 76,
};
/** The guard cells' centres from the pore's midline, closed and open; the epidermal cells' inner edges. */
const GC_SHUT = Rr.GRX, GC_OPEN = Rr.GRX + 17, EPI_IN = GC_OPEN + Rr.GRX + 4;
/** The vacuole: an ellipse whose top is the tonoplast; it runs out of the circle at the sides and bottom. */
const VAC = { cx: CR[0], cy: Rr.TONO + 200, rx: 320, ry: 200 };
/** The night CO₂: from above the circle down through the pore, the air space and the wall to PEPC. */
const KR_IN: V[] = [[CR[0], 136], [CR[0], 186], [CR[0], 224], [CR[0], 256], [1020, 280], [1004, 298], [990, 324], [978, 354]];
/** Its C₄ acid (malic acid) from under PEPC into the vacuole; by day out again, to the chloroplast. */
const AR_AT: V = [940, 430];
const H_STOP: V = [990, 508];
const AR_NIGHT: V[] = [AR_AT, [950, 456], [968, 486], H_STOP];
const A_STOP: V = [1026, 418];
const AR_DAY: V[] = [H_STOP, [1004, 482], [1016, 452], A_STOP];
const KR_OUT: V = [A_STOP[0] + 1.5 * ST + 8, A_STOP[1] - 14], KR_RUB: V = [1126, 392];
const PYR_R: V = [A_STOP[0] - 0.5 * ST, A_STOP[1]];
/** The rest of the night's malic acid in the vacuole (filled one at a time, emptied one at a time). */
const STORE: V[] = [[1110, 490], [1146, 532], [1088, 568], [986, 588]];
/** Speed along the night path: slow in the pore and across the wall and plasma membrane. */
const krSpeed = (p: V): number => { const y = p[1]; return Math.abs(y - Rr.GCY) < 22 ? 0.32 : y > Rr.WALL0 - 6 && y < Rr.PM + 10 ? 0.3 : 1; };

/** A guard cell in section at the origin: its wall (thick on the pore side), cytosol behind its plasma membrane (a
 *  bilayer), 2 chloroplasts. */
function guardCell(side: -1 | 1): string {
  const rx = Rr.GRX, ry = Rr.GRY;
  return `<ellipse rx="${rx}" ry="${ry}" class="co2k-wallb" style="stroke:#a88f52;stroke-width:1.6"/>
    <ellipse rx="${rx - 6}" ry="${ry - 6}" class="co2k-guard" style="stroke:none"/>${bilayerE(0, 0, rx - 6, ry - 6, 3)}
    <ellipse class="co2k-gcp" cx="${f(side * 4)}" cy="-5" rx="6" ry="3.6"/><ellipse class="co2k-gcp" cx="${f(side * 6)}" cy="6" rx="6" ry="3.6"/>
    <path d="M${f(-side * (rx - 3))},${-ry + 8}Q${f(-side * (rx + 1))},0 ${f(-side * (rx - 3))},${ry - 8}" style="fill:none;stroke:#8f7a3e;stroke-width:4;stroke-linecap:round"/>`;
}
/** An epidermal cell from x a to b: its wall, cytosol, plasma membrane (a bilayer round its inside). */
function epiCell(a: number, b: number): string {
  const y0 = Rr.EPI0, y1 = Rr.EPI1, i = 7;
  const pm = bilayer([{ L: [a + i, y0 + i, b - i, y0 + i] }, { L: [b - i, y0 + i, b - i, y1 - i] }, { L: [b - i, y1 - i, a + i, y1 - i] }, { L: [a + i, y1 - i, a + i, y0 + i] }], 3, 1.1, 3.2);
  return `<rect x="${f(a)}" y="${y0}" width="${f(b - a)}" height="${y1 - y0}" rx="9" class="co2k-wallb" style="stroke:#c9b98f;stroke-width:1.4"/>
    <rect x="${f(a + i)}" y="${y0 + i}" width="${f(b - a - 2 * i)}" height="${y1 - y0 - 2 * i}" rx="4" class="co2k-cyt"/>${pm}`;
}

function magnifierR(): string {
  const { x0, x1, top, bot } = Rr, w = x1 - x0, cx = CR[0];
  const band = (y0: number, y1: number, cls: string): string => `<rect class="${cls}" x="${x0}" y="${y0}" width="${w}" height="${y1 - y0}"/>`;
  // the cuticle over the epidermis, curling down as a ledge over each guard cell
  const cut = `<path class="co2k-cut" d="M${x0},${Rr.CUT}H${cx - EPI_IN}Q${cx - 40},${Rr.CUT} ${cx - 23},${Rr.CUT + 15}M${x1},${Rr.CUT}H${cx + EPI_IN}Q${cx + 40},${Rr.CUT} ${cx + 23},${Rr.CUT + 15}" style="stroke-width:6"/>`;
  const fib = Array.from({ length: 20 }, (_, i) => { const x = x0 + 8 + i * 23; return `<path class="co2k-fib" d="M${x},${Rr.WALL0 + 4 + (i % 2) * 3}q6,5 12,0t12,0"/>`; }).join('');
  const vac = `<ellipse cx="${VAC.cx}" cy="${VAC.cy}" rx="${VAC.rx}" ry="${VAC.ry}" style="fill:#e9eef4"/>
    ${bilayer([{ A: [VAC.cx, VAC.cy, VAC.rx, VAC.ry, 180, 360] }], 4, 1.4, 3.6)}`;
  const cp = `<ellipse class="co2k-strm" cx="${Rr.CP[0]}" cy="${Rr.CP[1]}" rx="${Rr.CRX}" ry="${Rr.CRY}"/>
    ${bilayerE(Rr.CP[0], Rr.CP[1], Rr.CRX, Rr.CRY, 3.6)}${bilayerE(Rr.CP[0], Rr.CP[1], Rr.CRX + 9, Rr.CRY + 9, 3.6)}
    ${granum(1198, 372, 18, 3)}${granum(1101, 380, 14, 3)}${img(rubPng, Rr.RUB[0], Rr.RUB[1], Rr.RUBW, RUB_AR)}`;
  return `${band(top, Rr.CUT, 'co2k-air')}${band(Rr.CUT, Rr.WALL0, 'co2k-ias')}${band(Rr.WALL0, Rr.WALL1, 'co2k-wallb')}${fib}${band(Rr.WALL1, bot, 'co2k-cyt')}
    ${epiCell(x0 - 12, cx - EPI_IN)}${epiCell(cx + EPI_IN, x1 + 12)}
    ${actor(`${P}-gl`, guardCell(-1))}${actor(`${P}-gr`, guardCell(1))}${cut}
    ${bilayer([{ L: [x0, Rr.PM, x1, Rr.PM] }], 6, 1.6, 4.2)}
    ${vac}${cp}${img(pepcPng, Rr.PEPC[0], Rr.PEPC[1], Rr.PEPCW, PEPC_AR)}
    ${lab(Rr.PEPC[0], 322, 'PEPC')}${lab(Rr.CP[0], 322, 'RuBisCO')}${lab(858, 500, 'vacuole', 'start')}${lab(cx + 70, 266, 'air space', 'start')}${lab(cx - 66, 266, 'stoma', 'end')}
    ${actor(`${P}-night`, `<rect x="${x0}" y="${top}" width="${w}" height="${2 * R}" style="fill:#1d2a52;opacity:.2"/>`)}
    ${actor(`${P}-iR`, `<g transform="translate(${Rr.PEPC[0] - 48} 316)">${moonG(0.95)}</g><g transform="translate(${Rr.CP[0] + 66} 316)">${sunG(7)}</g>`)}
    ${actor(`${P}-flR`, flashG(P, 32))}
    ${STORE.map((_, i) => actor(`${P}-m${i}`, carbG('CCCC', r10))).join('')}
    ${heroAcid(`${P}-aR`, 3)}${actor(`${P}-aRl`, mn(0, 36, 'malic acid'))}${actor(`${P}-pR`, carbG('CCC', r10))}
    ${kidG(`${P}-kR`, 12, '')}`;
}

/* ================================================================ the whole stage */

const RING = `<ellipse cx="${f(RING_C[0])}" cy="${f(RING_C[1])}" rx="${f(262 * ZEA.s)}" ry="${f(215 * ZEA.s)}" style="fill:none;stroke:#2f6f5f;stroke-width:2.2;stroke-dasharray:7 5" opacity=".85"/>`;
const TIME: V = [CR[0], 110];

function stage(): string {
  const mL = inset(P, `${P}-inL`, LENS_L, 18, CL, R, magnifierL());
  const mR = inset(P, `${P}-inR`, LENS_R, 32, CR, R, magnifierR());
  const left = `<g data-k="${P}-L">${actor(`${P}-Lin`, `${ZEA.svg}${RING}${lab(RING_C[0], 548, 'bundle sheath', 'middle', 'co2k-zl cel-halo')}
      ${T(452, 150, 'bundle-sheath cell', 'co2k-zl')}${T(684, 150, 'mesophyll cell', 'co2k-zl')}`)}
    ${mL.lens}${mL.box}</g>`;
  const right = actor(`${P}-R`, `${SUC.svg}${actor(`${P}-nightP`, `<rect x="1288" y="${PH_Y}" width="${PH_W}" height="${f(690 * SUC.s)}" rx="10" style="fill:#1d2a52;opacity:.22"/>`)}
    ${T(CR[0], 152, 'mesophyll cell', 'co2k-zl')}
    ${mR.lens}${mR.box}`);
  const timePill = actor(`${P}-time`, `${pill(TIME[0], TIME[1], 124, 36, '')}
    ${actor(`${P}-day`, `<g transform="translate(${TIME[0] - 36} ${TIME[1]})">${sunG(7)}</g>${T(TIME[0] + 12, TIME[1] + 6, 'day', 'co2k-zl')}`)}
    ${actor(`${P}-ngt`, `<g transform="translate(${TIME[0] - 36} ${TIME[1]})">${moonG(0.95)}</g>${T(TIME[0] + 12, TIME[1] + 6, 'night', 'co2k-zl')}`)}`);
  const titles = `${actor(`${P}-tL`, big(400, 64, 'C₄ leaf · maize'))}${actor(`${P}-tR`, big(1200, 64, 'CAM leaf · succulent'))}
    ${actor(`${P}-pilL`, pill(400, 56, 196, 46, big(400, 65, 'C₄: 2 cells'), '#3d3d3a'))}
    ${actor(`${P}-pilR`, pill(1200, 56, 372, 46, big(1200, 65, 'CAM: 1 cell, night and day'), '#3d3d3a'))}`;
  return `<defs>${flashDefs(P)}</defs>${left}${right}${timePill}${titles}
    ${T(6, 732, 'Leaf sections: Berkshire Community College Bioscience Image Library (CC0)', 'co2k-cr', 'start')}
    ${T(1594, 732, 'RuBisCO: PDB 8RUC · PEPC: PDB 3ZGE (Paulus et al. 2013)', 'co2k-cr', 'end')}`;
}

/* ---------------------------------------------------------------- the frame */

/** The left half: shown, dimmed in beats 2–3, back in beat 4. */
const leftOp = (beat: number, t: number): number => beat === 0 ? ease(t, 0, 0.5) : beat === 1 ? 1 - 0.65 * ease(t, 0, 0.5) : beat === 2 ? 0.35 : 0.35 + 0.65 * ease(t, 0.6, 1.2);
/** Night (1) or day (0) on the right. */
const nightOf = (beat: number, t: number): number => beat === 1 ? ease(t, 0.6, 1.6) : beat === 2 ? 1 - ease(t, 0, 1.0) : 0;
/** The stoma: 0 shut, 1 open. */
const openOf = (beat: number, t: number): number => beat === 1 ? ease(t, 1.8, 2.8) : beat === 2 ? 1 - ease(t, 1.2, 2.3) : 0;

function frame(a: Api, beat: number, t: number): void {
  // ---- the left half and its pump (beat 1)
  a.op(`${P}-L`, leftOp(beat, t));
  a.op(`${P}-Lin`, 1); a.op(`${P}-inL`, 1); a.op(`${P}-inL-lens`, 1);
  if (beat === 0) {
    const kin = glide(KL_IN, t, 0.7, 2.4);
    if (t < 3.0) kid(a, `${P}-kL`, kin, ease(t, 0.6, 0.9) * (1 - ease(t, 2.8, 3.0)), { s: ease(t, 2.3, 2.6), lab: 1 - ease(t, 1.9, 2.3) });
    flash(a, t, 2.8, add(L.PEPC, [10, 30]), `${P}-flL`);
    const ap = glide(AL_PATH, t, 3.2, 5.2), ao = ease(t, 2.9, 3.2) * (1 - ease(t, 5.3, 5.6));
    if (t > 2.8 && t < 5.7) hero(a, `${P}-aL`, ap, ao, ease(t, 3.4, 3.9), 1 - ease(t, 3.4, 3.9), 0, -1);
    if (t > 2.8 && t < 4.0) a.put(`${P}-aLl`, ap, ao * (1 - ease(t, 3.5, 3.8)));
    // the hero carbon leaves as CO₂ (glad), the last bit to RuBisCO; the 3 carbons left (pyruvate) fade
    if (t > 5.3) {
      kid(a, `${P}-kL`, glide([KL_OUT, [440, 398], KL_RUB], t, 5.6, 6.4), ease(t, 5.3, 5.6) * (1 - ease(t, 6.5, 6.8)), { h: 1 });
      a.put(`${P}-pL`, PYR_L, ease(t, 5.3, 5.6) * (1 - ease(t, 6.8, 7.2)));
    }
    flash(a, t, 6.5, KL_RUB, `${P}-flL`);
  }
  // ---- the right half
  const rOp = beat === 0 ? ease(t, 7.4, 8.2) : 1;
  a.op(`${P}-R`, rOp); a.op(`${P}-inR`, 1); a.op(`${P}-inR-lens`, 1);
  const nu = nightOf(beat, t);
  a.op(`${P}-night`, nu); a.op(`${P}-nightP`, nu);
  a.op(`${P}-time`, beat === 3 ? 1 - ease(t, 0, 0.5) : rOp);
  // the pill's word changes in 2 steps (the old one out, then the new one in), so the 2 words never overlap
  a.op(`${P}-day`, beat === 1 ? 1 - ease(t, 0.6, 0.95) : beat === 2 ? ease(t, 0.5, 0.85) : 1);
  a.op(`${P}-ngt`, beat === 1 ? ease(t, 1.05, 1.4) : beat === 2 ? 1 - ease(t, 0, 0.35) : 0);
  const g = lerp(GC_SHUT, GC_OPEN, openOf(beat, t));
  a.put(`${P}-gl`, [CR[0] - g, Rr.GCY]); a.put(`${P}-gr`, [CR[0] + g, Rr.GCY]);

  if (beat === 1) {
    // the CO₂ down through the open pore (turned upright to fit it), across the wall, caught by PEPC
    if (t > 3.0 && t < 6.2) {
      const d = driftM(`${P}-kr`, KR_IN, krSpeed, 3.1, 5.6)(t), y = d.p[1];
      const up = ease(y, 176, 200) * (1 - ease(y, 244, 266)), inPore = clamp(1 - Math.abs(y - Rr.GCY) / 24);
      kid(a, `${P}-kR`, d.p, ease(t, 3.0, 3.3) * (1 - ease(t, 5.95, 6.15)), { s: Math.max(clamp((1 - d.v) * 1.4), ease(t, 5.5, 5.8)) });
      a.attr(`${P}-kR-b`, 'transform', `rotate(${(90 * up).toFixed(1)}) scale(1 ${(1 - 0.18 * inPore).toFixed(3)})`);
    }
    flash(a, t, 5.95, add(Rr.PEPC, [24, 26]), `${P}-flR`);
    // its malic acid into the vacuole, where it falls asleep
    if (t > 5.9) {
      const p = glide(AR_NIGHT, t, 6.3, 7.8), z = ease(t, 8.0, 8.5);
      hero(a, `${P}-aR`, p, ease(t, 6.0, 6.3), ease(t, 6.5, 7.0) * (1 - z), 1 - ease(t, 6.5, 7.0), z, ease(t, 8.1, 8.5));
      a.put(`${P}-aRl`, H_STOP, ease(t, 7.8, 8.1));
    }
    // the vacuole fills, one malic acid at a time
    STORE.forEach((q, i) => a.put(`${P}-m${i}`, q, ease(t, 8.8 + 0.55 * i, 9.2 + 0.55 * i)));
  }
  if (beat === 2) {
    // the hero wakes; its malic acid leaves the vacuole for the chloroplast; the hero carbon leaves as CO₂ to RuBisCO
    const w = ease(t, 2.5, 2.9);
    if (t < 5.4) hero(a, `${P}-aR`, glide(AR_DAY, t, 3.0, 4.8), 1 - ease(t, 4.9, 5.2), w, 0, 1 - w, 1 - ease(t, 2.5, 2.8));
    a.put(`${P}-aRl`, H_STOP, 1 - ease(t, 2.5, 2.8));
    if (t > 4.9) {
      kid(a, `${P}-kR`, glide([KR_OUT, [1096, 398], KR_RUB], t, 5.3, 6.2), ease(t, 4.9, 5.2) * (1 - ease(t, 6.3, 6.6)), { h: 1 });
      a.put(`${P}-pR`, PYR_R, ease(t, 4.9, 5.2) * (1 - ease(t, 6.5, 6.9)));
    }
    flash(a, t, 6.3, KR_RUB, `${P}-flR`);
    // over the day the vacuole empties, one malic acid at a time
    STORE.forEach((q, i) => a.put(`${P}-m${i}`, q, 1 - ease(t, 7.2 + 0.5 * i, 7.6 + 0.5 * i)));
  }
  // ---- titles and pills
  const tl = beat === 0 ? ease(t, 0, 0.5) : 1;
  // in beat 4 each title fades out, then its pill fades in at the same place
  a.op(`${P}-tL`, beat === 3 ? 1 - ease(t, 1.4, 1.7) : tl);
  a.op(`${P}-tR`, beat === 3 ? 1 - ease(t, 2.3, 2.6) : rOp);
  if (beat === 3) {
    const pl = ease(t, 1.75, 2.1), pr = ease(t, 2.65, 3.0);
    a.op(`${P}-pilL`, pl); a.op(`${P}-iL`, pl); a.op(`${P}-pilR`, pr); a.op(`${P}-iR`, pr);
  }
}

export const STAGING: Staging = {
  ...makeScene({
    id: 'camp', name: 'camp · C₄ in space vs CAM in time',
    note: 'Two halves side by side: the maize micrograph and its C₄ magnifier (PEPC in the mesophyll, RuBisCO in the bundle sheath) and a succulent-leaf micrograph with one CAM cell (stoma, PEPC, chloroplast with RuBisCO, large vacuole) under a night/day pill; slide 19’s CO₂ character is caught by PEPC, sleeps in the vacuole as malic acid and is fixed by RuBisCO next day',
    beats: BEATS, holds: HOLDS,
    svg: stage,
    frame,
  }),
  keys: KEYS,
};

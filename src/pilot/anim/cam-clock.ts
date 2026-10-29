// 'lf13', staging camc · CAM (slide C13) under a day–night band. The same science, captions, glyphs and question as
// camk (cam-kranz.ts, whose cell motion it shares), staged differently: a band across the top is the clock (night, then
// day, as a slow timeline); under it one CAM mesophyll cell, large in the middle, drawn with the deck's kit (cell wall,
// plasma membrane, tonoplast and chloroplast envelopes as bilayers; PEPC: PDB 3ZGE; RuBisCO: PDB 8RUC; atom-ball
// molecules) under the epidermis with its stoma; a small real micrograph in the lower right corner, a lens on the cell
// it shows. Each step: the band's marker glides on first (only the marker); then, in its time, the cell's step plays (only
// the cell). The hero is slide 19's CO₂ character, as in camk.
// - The micrograph: the same succulent leaf at 100× (Berkshire Community College Bioscience Image Library, "Succulent
//   xerophyte leaf", Wikimedia Commons, CC0; the 3264 × 1840 original turned 180° so the epidermis is on top, as drawn,
//   cut to x 1823–2633, y 519–1119 round the stoma, scaled to 640 × 474; no letters to remove).
// - Beats: 1 the parts named one at a time, then the micrograph and its lens, then the band (nothing moves); 2 night
//   (marker into the night; a soft dark veil): the stoma opens | marker on: the CO₂ comes in → HCO₃⁻ → PEPC → C₄ acid →
//   malic acid asleep in the vacuole | marker on: the vacuole fills; 3 day (marker into the day; the veil lifts): the
//   stoma closes | marker on: the malic acid wakes, leaves the vacuole and releases the CO₂ | marker on: the CO₂ goes to
//   RuBisCO, the vacuole empties; the question.
import inJpg from '../../assets/photos/c13-cam-succulent-100x.jpg';
import { bilayer } from '../figs/cell-schema';
import {
  BIG, CAM_BEATS, CAM_Q, camActors, camDur, camFrame, chloroplastG, guardMarkup, pepcG, REL_DX, vacuoleG, type CamGeo,
} from './cam-kranz';
import { actor, ease, f, glide, makeScene, sunG, T, type Api, type V } from './co2-kit';
import type { Staging, StageKey } from './types';

const P = 'camc';

/* ---------------------------------------------------------------- the day–night band (top) */
const BX0 = 100, BX1 = 1500, BY = 24, BH = 46, BM = 800;
/** The marker's places: at dusk (beat 1), then after each of its 6 glides. */
const MX = [118, 300, 480, 700, 900, 1120, 1380];
function bandG(): string {
  const y = BY + BH / 2;
  const moon = `<path d="M${BX0 + 74},${y - 12}A13,13 0 1 0 ${BX0 + 80},${y + 11}A10,10 0 1 1 ${BX0 + 74},${y - 12}Z" style="fill:#e3e7f1;stroke:#c9cfe0;stroke-width:1.2"/>`;
  return `<defs><linearGradient id="${P}-bandg" x1="${BX0}" x2="${BX1}" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#2f3a59"/><stop offset="${f((BM - 40 - BX0) / (BX1 - BX0))}" stop-color="#3d4a6b"/>
      <stop offset="${f((BM + 40 - BX0) / (BX1 - BX0))}" stop-color="#f6e2a6"/><stop offset="1" stop-color="#fbeec6"/></linearGradient></defs>
    ${actor(`${P}-band`, `<rect x="${BX0}" y="${BY}" width="${BX1 - BX0}" height="${BH}" rx="${BH / 2}" fill="url(#${P}-bandg)" style="stroke:#8a877d;stroke-width:1.2"/>
      ${moon}${T(BX0 + 102, y + 7, 'night', 'co2k-ilb', 'start', ' style="fill:#f4f2ea"')}
      <g transform="translate(${BX1 - 36} ${y})">${sunG(9)}</g>${T(BX1 - 64, y + 7, 'day', 'co2k-ilb', 'end')}`)}
    ${actor(`${P}-mk`, `<path d="M0,${BY - 8}V${BY + BH + 8}" style="stroke:#b0431f;stroke-width:4;stroke-linecap:round"/><circle cx="0" cy="${BY + BH + 12}" r="6" style="fill:#b0431f"/>`)}`;
}

/* ---------------------------------------------------------------- the cell (stage units) */
/** The epidermis (cuticle on top) and the stoma; the cell's outer wall, its inner face, the plasma membrane. */
const EPI = { x0: 160, x1: 1240, y0: 150, y1: 214 };
const PORE: V = [470, 182];
const CELL = { x0: 220, x1: 1180, y0: 252, y1: 640, r: 44, wall: 16 };
const PEPC = { x: 254, y: 290, w: 128 };
const CP: V = [1052, 350], RUB: V = [1048, 338];
const VAC: V = [700, 470], VRX = 316, VRY = 128;

const GEO: CamGeo = {
  p: P, pore: PORE, gOut: 58, epi: [EPI.y0 + 2, EPI.y1],
  kidIn: [[640, 112], [580, 116], [516, 126], [480, 142], [472, 160], [PORE[0], PORE[1]], [470, 212], [473, 236], [477, 262], [482, 292], [486, 318]],
  hco3: [[486, 318], [440, 326], [352, 338]],
  pep: [398, 364],
  acidIn: [[398, 364], [440, 388], [500, 414], [580, 440], [700, 454]], cross: 0.16,
  others: [[572, 476], [828, 476], [508, 524], [636, 524], [764, 524], [892, 524]],
  acidOut: [[700, 454], [760, 414], [826, 366], [858, 316]],
  kidFix: [[858 + REL_DX, 316], [930, 324], [972, 332], [1014, 336]],
  tick: [1040, 446],
};

/** A rounded rectangle's outline as bilayer segments (4 sides, 4 quarter arcs). */
function rrBilayer(x0: number, y0: number, x1: number, y1: number, r: number, half = 6): string {
  return bilayer([
    { L: [x0 + r, y0, x1 - r, y0] }, { A: [x1 - r, y0 + r, r, r, -90, 0] }, { L: [x1, y0 + r, x1, y1 - r] }, { A: [x1 - r, y1 - r, r, r, 0, 90] },
    { L: [x1 - r, y1, x0 + r, y1] }, { A: [x0 + r, y1 - r, r, r, 90, 180] }, { L: [x0, y1 - r, x0, y0 + r] }, { A: [x0 + r, y0 + r, r, r, 180, 270] },
  ], half, 1.6, 4.2);
}
const rrect = (x0: number, y0: number, x1: number, y1: number, r: number, cls: string): string => `<rect class="${cls}" x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}" rx="${r}"/>`;

function cellG(): string {
  const { x0, x1, y0, y1, r, wall } = CELL, gl = PORE[0] - GEO.gOut, gr = PORE[0] + GEO.gOut;
  // the epidermis: cells either side of the stoma, the cuticle over them (open at the pore); the air space under it
  const cuts: Array<[number, number]> = [[EPI.x0, gl - 92], [gl - 88, gl - 4], [gr + 4, gr + 96]];
  for (let x = gr + 100; x < EPI.x1 - 30; x += 96) cuts.push([x, Math.min(EPI.x1, x + 92)]);
  const epi = cuts.map(([a, b]) => `<rect class="co2k-epi" x="${a}" y="${EPI.y0 + 2}" width="${b - a}" height="${EPI.y1 - EPI.y0 - 2}" rx="12"/>`).join('');
  const cut = `<path class="co2k-cut" d="M${EPI.x0},${EPI.y0}H${PORE[0] - 20}M${PORE[0] + 20},${EPI.y0}H${EPI.x1}"/>`;
  const air = `<rect class="co2k-ias" x="${EPI.x0}" y="${EPI.y0}" width="${EPI.x1 - EPI.x0}" height="${y1 + 20 - EPI.y0}" rx="18"/>`;
  // the cell: wall (with fibres), plasma membrane, cytosol
  const fib = Array.from({ length: 36 }, (_, i) => { const x = x0 + 40 + i * 25; return x > x1 - 40 ? '' : `<path class="co2k-fib" d="M${x},${y0 + 4 + (i % 3) * 3}q7,4 14,0"/>`; }).join('');
  const body = `${rrect(x0, y0, x1, y1, r, 'co2k-wallb')}${rrect(x0 + wall, y0 + wall, x1 - wall, y1 - wall, r - wall, 'co2k-cyt')}${fib}${rrBilayer(x0 + 22, y0 + 22, x1 - 22, y1 - 22, r - 22)}`;
  // chloroplasts: the one with RuBisCO (upper right) and 2 along the side walls
  const cps = chloroplastG(CP, 90, 58, [[980, 340], [1118, 346]], 26, { at: RUB, w: 80 })
    + chloroplastG([300, 520], 30, 52, [[300, 504], [300, 552]], 30) + chloroplastG([1100, 520], 30, 52, [[1100, 504], [1100, 552]], 30);
  return `${air}${epi}${cut}${guardMarkup(GEO)}${body}${pepcG(PEPC.x, PEPC.y, PEPC.w)}${cps}${vacuoleG(`${P}tint`, VAC, VRX, VRY)}`;
}

/* ---------------------------------------------------------------- the micrograph inset (lower right) */
const IN = { x: 1268, y: 380, w: 320, h: 237 };
/** The lens on the cell right of the substomatal cavity (inset px 205, 100), and the lines to the drawn cell. */
const ILENS: V = [IN.x + 205, IN.y + 100], ILR = 20;
function insetG(): string {
  const [lx, ly] = ILENS;
  const lines = `<path class="co2k-tan" d="M${f(lx - ILR * 0.8)},${f(ly - ILR * 0.6)}L${CELL.x1 - 6},${CELL.y0 + 60}M${f(lx - ILR * 0.8)},${f(ly + ILR * 0.6)}L${CELL.x1 - 6},${CELL.y1 - 60}"/>`;
  return actor(`${P}-in`, `<rect x="${IN.x - 2}" y="${IN.y - 2}" width="${IN.w + 4}" height="${IN.h + 4}" rx="6" style="fill:#fffdf8;stroke:#8a877d;stroke-width:1.2"/>
    <image href="${inJpg}" x="${IN.x}" y="${IN.y}" width="${IN.w}" height="${IN.h}" preserveAspectRatio="none"/>
    ${lines}<circle class="co2k-lens" cx="${lx}" cy="${ly}" r="${ILR}" style="stroke:#141413;stroke-width:2.4"/>
    ${T(IN.x + IN.w, IN.y + IN.h + 20, 'succulent leaf, 100×: Berkshire Community College', 'co2k-cr', 'end')}${T(IN.x + IN.w, IN.y + IN.h + 36, 'Bioscience Image Library (CC0)', 'co2k-cr', 'end')}`);
}

/* ---------------------------------------------------------------- the staging */
const DUR = camDur(GEO.others.length);
/** Each step's marker glide (s) and the gap before the cell's step begins. */
const MG = 1.1, MS = 1.2;
/** Beat 2 (steps 0–2) and beat 3 (steps 3–5): the marker glides at the start of each step's slot; the slot ends with a
 *  hold. */
const slots = (d: number[]): number[] => { const o = [0]; d.forEach(x => o.push(o[o.length - 1] + MS + x)); return o; };
const S2 = slots(DUR.slice(0, 3)), S3 = slots(DUR.slice(3, 6));
const KEYS: StageKey[] = [{ beat: 2, text: CAM_Q, x: 800, y: 704, size: 44 }];

export const STAGING: Staging = {
  ...makeScene({
    id: 'camc', name: 'camc · One cell under a day–night band', beats: CAM_BEATS, holds: [[], S2.slice(1, 3), S3.slice(1, 3)],
    note: 'A day–night band on top whose marker moves first; under it one CAM cell, large (bilayers, PEPC 3ZGE, RuBisCO 8RUC), with a small 100× micrograph and its lens in the corner: slide 19’s CO₂ slips in through the open stoma at night and sleeps in the vacuole as malic acid; by day, the stoma shut, it is freed to RuBisCO',
    svg: () => `${bandG()}${cellG()}
      <defs><linearGradient id="${P}-veilg" x1="0" x2="0" y1="${BY + BH + 16}" y2="740" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#33405e" stop-opacity="0"/><stop offset=".1" stop-color="#33405e"/></linearGradient></defs>
      <rect data-k="${P}veil" x="0" y="${BY + BH + 16}" width="1600" height="${740 - BY - BH - 16}" fill="url(#${P}-veilg)" opacity="0"/>
      ${actor(`${P}-l-st`, T(PORE[0] - GEO.gOut - 8, 188, 'stoma', 'co2k-il cel-halo', 'end'))}
      ${actor(`${P}-l-mc`, T(VAC[0], 240, 'mesophyll cell', 'co2k-zl cel-halo'))}
      ${actor(`${P}-l-pc`, T(PEPC.x + PEPC.w / 2 - 4, 418, 'PEPC', 'co2k-il cel-halo'))}
      ${actor(`${P}-l-va`, T(VAC[0], 584, 'vacuole', 'co2k-il cel-halo'))}
      ${actor(`${P}-l-rb`, T(RUB[0], 394, 'RuBisCO', 'co2k-il cel-halo'))}
      ${insetG()}${camActors(GEO)}
      ${actor(`${P}-cr`, T(1596, 732, 'RuBisCO: PDB 8RUC · PEPC: PDB 3ZGE (Paulus et al. 2013)', 'co2k-cr', 'end'))}`,
    frame(a: Api, beat: number, t: number) {
      const at = (b: number, t0: number, t1: number): number => (beat > b ? 1 : beat === b ? ease(t, t0, t1) : 0);
      // beat 1: the parts named one at a time, then the micrograph and its lens, then the band and its marker at dusk
      a.op(`${P}-l-st`, at(0, 0.3, 0.7)); a.op(`${P}-l-mc`, at(0, 0.9, 1.3)); a.op(`${P}-l-pc`, at(0, 1.5, 1.9));
      a.op(`${P}-l-va`, at(0, 2.1, 2.5)); a.op(`${P}-l-rb`, at(0, 2.7, 3.1));
      a.op(`${P}-in`, at(0, 3.4, 4.0)); a.op(`${P}-cr`, at(0, 3.4, 4.0));
      const bo = at(0, 4.2, 4.8);
      a.op(`${P}-band`, bo);
      // the marker: one glide at the start of each step's slot
      const slot = beat === 1 ? S2 : beat === 2 ? S3 : [];
      let mx = MX[beat === 0 ? 0 : beat === 1 ? 0 : 3];
      slot.slice(0, 3).forEach((t0, i) => { const j = (beat === 1 ? 0 : 3) + i; mx = t < t0 ? mx : glide([[MX[j], 0], [MX[j + 1], 0]], t, t0, t0 + MG)[0]; });
      a.put(`${P}-mk`, [mx, 0], bo);
      // the cell: each step starts once its marker glide is done
      const st = (b: number, i: number): number => (beat > b ? BIG : beat < b ? -BIG : t - (b === 1 ? S2 : S3)[i] - MS);
      const night = camFrame(a, GEO, [st(1, 0), st(1, 1), st(1, 2), st(2, 0), st(2, 1), st(2, 2)]);
      a.op(`${P}veil`, 0.13 * night);
    },
  }),
  keys: KEYS,
};

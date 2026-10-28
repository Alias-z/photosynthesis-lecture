// 'lf10', staging a · the drawn leaf section (lf10-common.ts). Top to bottom: the upper epidermis, palisade cells,
// spongy mesophyll with large air spaces, the lower epidermis with one stoma (2 guard cells) over its substomatal air
// space, the boundary layer of still air, the outside air. Chloroplasts line the cell walls. The CO₂ goes straight up
// through the stoma and the air space to the wall of the spongy cell above it.
import { along, blob, chloroG, closed, rbox, type V } from './co2-kit';
import { lf10Staging } from './lf10-common';
import { keyLines } from './stage-keys';
import type { Staging } from './types';

const X0 = 368, X1 = 1000, PX = 690;
const Y = { cutU: 24, epiU0: 27, epiU1: 61, pal0: 66, pal1: 262, epiL0: 529, epiL1: 559, cutL: 561, bl1: 650 };
/** The spongy cell above the stoma (its lower wall faces the substomatal air space) and its chloroplast at that wall. */
const TARGET = rbox(PX - 56, 336, 112, 110, 30);
const CP: V = [PX + 1, 436];

const SPONGY: Array<[number, number, number, number, number]> = [
  [404, 306, 32, 28, 1], [488, 300, 38, 26, 2], [582, 300, 36, 24, 3], [690, 296, 42, 21, 4], [800, 302, 38, 28, 5], [900, 300, 36, 26, 6], [978, 318, 26, 36, 7],
  [410, 404, 38, 42, 8], [522, 394, 40, 40, 9], [842, 396, 46, 42, 10], [950, 404, 40, 46, 11],
  [418, 494, 44, 25, 12], [504, 497, 26, 21, 13], [592, 488, 30, 30, 14], [792, 486, 34, 32, 15], [886, 494, 40, 25, 16], [968, 496, 28, 24, 17],
];

function section(p: string): string {
  // backgrounds: the air above, the leaf's air spaces, the boundary layer, the outside air
  const bg = `<rect class="co2k-air" x="${X0}" y="0" width="${X1 - X0}" height="${Y.cutU}"/>
    <rect class="co2k-as" x="${X0}" y="${Y.cutU}" width="${X1 - X0}" height="${Y.cutL - Y.cutU}"/>
    <rect x="${X0}" y="${Y.cutL}" width="${X1 - X0}" height="${Y.bl1 - Y.cutL}" fill="url(#${p}-blg)"/>
    <rect class="co2k-air" x="${X0}" y="${Y.bl1}" width="${X1 - X0}" height="${740 - Y.bl1}"/>
    <path class="lf-bledge" d="M${X0},${Y.bl1}H${X1}" style="fill:none;stroke:#c9d6dd;stroke-width:1.4;stroke-dasharray:5 5"/>`;
  // upper epidermis
  const wU = [62, 70, 56, 74, 60, 66, 58, 72, 64, 52];
  let x = X0 + 2;
  const epiU = wU.map(w => { const s = `<rect class="co2k-epi" x="${x}" y="${Y.epiU0}" width="${w - 2}" height="${Y.epiU1 - Y.epiU0}" rx="10"/>`; x += w; return s; }).join('');
  // palisade cells with chloroplasts along their walls
  const pal: string[] = [];
  for (let i = 0; i < 12; i++) {
    const cx = X0 + 4 + i * 52, top = Y.pal0 + (i % 3) * 2, bot = Y.pal1 - ((i * 7) % 5) * 2, q = rbox(cx, top, 46, bot - top, 20);
    pal.push(`<path class="co2k-cell" d="${closed(q)}"/>${along(q, 21, 7).map(c => chloroG(c.p, c.a, 15, 7)).join('')}`);
  }
  // spongy cells
  const spo = SPONGY.map(([cx, cy, rx, ry, s]) => { const q = blob(cx, cy, rx, ry, s); return `<path class="co2k-cell" d="${closed(q)}"/>${along(q, 19, 6).map(c => chloroG(c.p, c.a, 14, 7)).join('')}`; }).join('');
  const tgt = `<path class="co2k-cell" d="${closed(TARGET)}"/>${along(TARGET, 19, 7, p => Math.abs(p[0] - CP[0]) < 16 && p[1] > 420).map(c => chloroG(c.p, c.a, 15, 7)).join('')}${chloroG(CP, 0, 17, 8)}`;
  // lower epidermis with the stoma (its guard cells are actors: they close on the hot day)
  const wL = [58, 66, 52, 70, 60, 54];
  x = X0 + 2;
  const left = wL.map(w => { const s = `<rect class="co2k-epi" x="${x}" y="${Y.epiL0}" width="${w - 2}" height="${Y.epiL1 - Y.epiL0}" rx="10"/>`; x += w; return s; }).join('');
  x = PX + 30;
  const wR = [60, 70, 56, 64, 60];
  const right = wR.map(w => { const s = `<rect class="co2k-epi" x="${x}" y="${Y.epiL0}" width="${w - 2}" height="${Y.epiL1 - Y.epiL0}" rx="10"/>`; x += w; return s; }).join('');
  const cut = `<path class="co2k-cut" d="M${X0},${Y.cutU}H${X1}"/><path class="co2k-cut" d="M${X0},${Y.cutL}H${PX - 16}M${PX + 16},${Y.cutL}H${X1}"/>`;
  return `${bg}${epiU}${pal.join('')}${spo}${tgt}${left}${right}${cut}`;
}
/** A small guard cell at the origin (pore side towards +x), mirrored for the right one. */
const gc = (m: boolean): string => `<g${m ? ' transform="scale(-1 1)"' : ''}><path class="co2k-guard" d="M-13,-12C-13,-16 -6,-16 2,-15C9,-14 13,-10 13,-6V6C13,10 9,14 2,15C-6,16 -13,16 -13,12Z"/><path class="co2k-guardw" d="M12,-7V7" style="stroke-width:3"/><circle class="co2k-gcp" cx="-4" cy="-4" r="2.6"/><circle class="co2k-gcp" cx="-2" cy="5" r="2.6"/></g>`;

const BASE = lf10Staging({
  id: 'lf10a',
  name: 'a · Drawn leaf section',
  note: 'CO₂ as a small character from the outside air through the boundary layer, the stoma and the air space to the wet wall, where it dissolves, and on to RuBisCO; magnifiers on the wall and the stoma; the CO₂ concentrations step down; on a hot, dry day the stoma half-closes',
  section,
  guard: { l: gc(false), r: gc(true), open: [[PX - 16, 545], [PX + 16, 545]], half: [[PX - 13.5, 545], [PX + 13.5, 545]] },
  air: [PX, 702], blBot: Y.bl1, blTop: Y.cutL, epiTop: Y.epiL0, wallY: 452,
  pore: [PX, 545], cav: [[PX, 522], [PX - 4, 488], [PX, 462]], wall: [PX + 1, 450], cp: CP,
  lensS: [PX, 545], lensW: [PX + 1, 444],
  zones: [
    { k: 'epu', at: [X0 + 10, 50], text: 'upper epidermis', lit: [] },
    { k: 'pal', at: [X0 + 10, 170], text: 'palisade mesophyll', lit: [] },
    { k: 'spo', at: [X0 + 10, 352], text: 'spongy mesophyll', lit: [3] },
    { k: 'epl', at: [X0 + 10, 551], text: 'lower epidermis', lit: [2] },
    { k: 'bl', at: [X0 + 10, 612], text: 'boundary layer: still air', lit: [1] },
    { k: 'air', at: [X0 + 10, 704], text: 'outside air', lit: [0] },
    // right beside the pore it names (lecturer, 29 Oct 2026: the label was off the stoma)
    { k: 'st', at: [PX - 30, 551], text: 'stoma', lit: [2], a: 'end' },
    { k: 'cp', at: [PX + 1, 388], text: 'chloroplast', lit: [0, 4], a: 'middle' },
  ],
});

/** The key lines on the stage (lecturer, 29 Oct 2026): each beat's take-home and the closing question. */
export const STAGING: Staging = { ...BASE, keys: [
  ...keyLines(0, ['CO₂ diffuses', 'down its gradient'], 183, 128, { size: 34 }),
  ...keyLines(1, ['Boundary layer:', 'still air'], 183, 128, { size: 34 }),
  ...keyLines(2, ['CO₂ in, water out', 'through the stoma'], 183, 128, { size: 34 }),
  ...keyLines(3, ['Dissolved CO₂:', '≈ 10,000 × slower'], 183, 128, { size: 34 }),
  ...keyLines(4, ['Each resistance', 'lowers the CO₂'], 183, 128, { size: 34 }),
  ...keyLines(5, ['How have plants coped?'], 800, 380, { size: 44, t0: 3.0 }),
] };

// 'lf10', staging b · the lecturer's own section (lf10-common.ts): slice 22 of the aligned series "Hp rep2 I"
// (toluidine blue; ~/Downloads/3d/Aligned downsized/), cropped to x 1060–2290, y 300–1700 of the downsized slice, the
// stretch with the two minor veins the 3D model shows (inferred from the vein positions, no crop record was found), at
// 0.514 stage units per pixel. The stoma (lecturer, 29 Oct 2026, who circled the section's 2 stomata): its 2 guard cells
// in the lower epidermis at slice pixels ≈ (1905–1920, 1350–1372) and (1940–1975, 1347–1372), the pore between them at
// (1932, 1362), the substomatal cavity above it, which runs up ≈ 180 px (to y ≈ 1180), then the air spaces winding up
// between spongy cells to a cell deep in the mesophyll (1899–1939, 951–997; lecturer, 29 Oct 2026: "put the chloroplast
// deeper into the path, so people see the CO₂ really has to go all the way"), a chloroplast just inside its lower wall.
// (The other stoma, at ≈ (2208, 1342), sits at the crop's right edge.)
// Drawn over the photograph: the boundary layer along the traced lower surface, the outline of the spongy cell the CO₂
// reaches, the names, the lenses. The guard cells of the photograph stay as they are; on the hot day the stoma closes
// in the magnifier only.
import photo from '../../assets/photos/c10-own-s22.jpg';
import { closed, T, type V } from './co2-kit';
import { lf10Staging } from './lf10-common';
import { keyLines } from './stage-keys';
import type { Staging } from './types';

const X0 = 368, SC = 632 / 1230;
/** Slice pixel → stage. */
const P = (x: number, y: number): V => [X0 + (x - 1060) * SC, (y - 300) * SC];
/** The lower leaf surface (the outer face of the lower epidermis), traced along the crop. */
const SURF: V[] = [[368, 579], [389, 577], [409, 574], [430, 571], [450, 566], [471, 556], [491, 553], [512, 558], [532, 564], [553, 567], [574, 566], [594, 566], [615, 565], [635, 563], [656, 561], [676, 559], [697, 555], [717, 553], [738, 554], [759, 555], [779, 555], [800, 555], [820, 555], [841, 555], [861, 553], [882, 550], [902, 549], [923, 551], [943, 551], [964, 550], [985, 549], [1000, 549]];
const BL = 88;
/** The spongy cell over the substomatal air space, traced (slice pixels). */
const CELL: V[] = [P(1903, 955), P(1920, 951), P(1936, 955), P(1939, 970), P(1936, 990), P(1920, 997), P(1904, 994), P(1899, 976)];
const PORE = P(1934, 1362), WALL = P(1918, 998), CP = P(1918, 985);

function section(p: string): string {
  const top = SURF.map(([x, y]) => `${x},${y}`).join(' '), bot = [...SURF].reverse().map(([x, y]) => `${x},${y + BL}`).join(' ');
  return `<rect class="co2k-air" x="${X0}" y="0" width="632" height="740"/>
    <image href="${photo}" x="${X0}" y="0" width="632" height="${(1400 * SC).toFixed(1)}" preserveAspectRatio="none"/>
    <polygon points="${top} ${bot}" fill="url(#${p}-blg)" opacity=".85"/>
    <polyline points="${SURF.map(([x, y]) => `${x},${y + BL}`).join(' ')}" style="fill:none;stroke:#c9d6dd;stroke-width:1.4;stroke-dasharray:5 5"/>
    <path d="${closed(CELL)}" style="fill:none;stroke:#8f7a3e;stroke-width:2.2;stroke-dasharray:6 4"/>
    ${T(992, 732, 'section: own data (Hp rep2 I)', 'co2k-cr', 'end')}`;
}

const BASE = lf10Staging({
  id: 'lf10b',
  name: 'b · On the lecturer’s own section',
  note: 'The same trip traced over slice 22 of the lecturer’s toluidine-blue series (Hp rep2 I): the boundary layer along the real lower surface, the real stoma and its substomatal air space, the spongy cell above it; magnifiers and the CO₂ card as in a',
  section,
  air: [PORE[0], 700], blBot: 564 + BL, blTop: 564, epiTop: 528, wallY: WALL[1] + 2,
  pore: PORE, cav: [P(1935, 1310), P(1932, 1240), P(1930, 1180), P(1920, 1130), P(1905, 1095), P(1898, 1050), P(1903, 1012)], wall: WALL, cp: CP, airT: 5.0,
  lensS: [PORE[0], PORE[1] + 4], lensW: [WALL[0], WALL[1] - 3],
  zones: [
    { k: 'epu', at: [X0 + 10, 74], text: 'upper epidermis', lit: [] },
    { k: 'pal', at: [X0 + 10, 196], text: 'palisade mesophyll', lit: [] },
    { k: 'spo', at: [X0 + 10, 404], text: 'spongy mesophyll', lit: [3] },
    { k: 'epl', at: [X0 + 10, 549], text: 'lower epidermis', lit: [2] },
    { k: 'bl', at: [X0 + 10, 640], text: 'boundary layer: still air', lit: [1] },
    { k: 'air', at: [X0 + 10, 706], text: 'outside air', lit: [0] },
    // right beside the pore it names (lecturer, 29 Oct 2026: the label was off the stoma)
    { k: 'st', at: [PORE[0] - 92, PORE[1] + 8], text: 'stoma', lit: [2] },
    { k: 'cp', at: [CP[0] + 30, CP[1] + 4], text: 'chloroplast', lit: [0, 4] },
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

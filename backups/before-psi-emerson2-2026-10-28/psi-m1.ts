// Photosystem I, staging m1: Emerson with two lamps on the chain and an O₂ count. Beats 1–2 and the frame: psim-common.ts.
// - Beat 3 (holds: ready; far-red done; red done): over both photosystems hang a red lamp (680 nm) aimed at photosystem II
//   (its light reaches photosystem I too, more weakly: PSI absorbs 680 nm as well) and a far-red lamp (> 700 nm) aimed at
//   photosystem I. In the panel, Emerson's clipping and a count of the O₂ molecules released in the same time under each
//   light: far-red alone 1 (PSI glows, PSII barely), red alone 3, red + far-red 5, more than the 1 + 3 of the two apart
//   (a dashed box). Each O₂ leaves photosystem II's water-splitting site on the chain as it is counted.
// - Beat 4 (hold: written): under the count, the brief's two statements; then the common zoom out.
// The counts are illustrative (labelled so), chosen with an enhancement near Emerson's at 690 nm in the 1957 curves: the
// far-red beam's yield about doubles when red is added (1 → 2 extra), so 3 + 2 = 5.
import { o2G } from '../figs/chain';
import { OEC, PANEL, SAY_BOTH, SAY_FR, lightAt, makeStaging, ptext, type Step } from './psim-common';
import { f1, lerpV, smooth, tw, type V } from './antenna-common';
import { PSIM } from './beats-psim';

const READY = 1.6;
const STEPS: Step[] = [
  { on: 1.65, off: 4.05, far: true },
  { on: 4.4, off: 6.75, red: true },
  { on: 7.1, off: 999, red: true, far: true },
];
/** When each O₂ leaves photosystem II, per row (far-red alone, red alone, both). */
const PUFFS: number[][] = [[2.95], [5.0, 5.45, 5.9], [7.6, 7.95, 8.3, 8.65, 9.0]];
const COUNT = 0.6;           // a puff is counted this long after it leaves
const SUM = 9.75;            // the dashed box of the two apart
const END3 = 10.35;

/* ---- the panel (stage units) */
const ROWS = [292, 392, 492];
const X0 = 1100, DX = 72;   // tally slots
const SAY = [610, 637, 676, 703];
const LX = 886;             // left edge of the panel's text
/** One O₂ in the count, at stage scale 1.7. */
const o2At = (x: number, y: number, k: string): string => `<g data-k="${k}" opacity="0" display="none" transform="translate(${f1(x)} ${f1(y)}) scale(1.7)">${o2G(0, 0)}</g>`;

function panel(): string {
  const rowLab = [
    ptext(LX, ROWS[0] + 7, 'far-red alone', 'pm-t pm-fr'),
    ptext(LX, ROWS[1] + 7, 'red alone', 'pm-t pm-red'),
    `<text class="pm-t" x="${LX}" y="${ROWS[2] + 7}"><tspan class="pm-red">red</tspan> + <tspan class="pm-fr">far-red</tspan></text>`,
  ];
  const slots = PUFFS.map((row, r) => row.map((_, i) => o2At(X0 + i * DX, ROWS[r], `tally-${r}-${i}`)).join('')).join('');
  const box = `<g data-k="sum" opacity="0" display="none"><rect class="pm-sum" x="${X0 - 40}" y="${ROWS[2] - 36}" width="${3 * DX + 80}" height="72" rx="12"/>
    ${ptext(X0 + 1.5 * DX, ROWS[2] + 60, 'the two apart: 1 + 3', 'pm-s', 'middle')}</g>`;
  const say = `<g data-k="say1" opacity="0" display="none">${ptext(LX, SAY[0], SAY_FR[0], 'pm-say')}${ptext(LX, SAY[1], SAY_FR[1], 'pm-say')}</g>
    <g data-k="say2" opacity="0" display="none">${ptext(LX, SAY[2], SAY_BOTH[0], 'pm-say')}${ptext(LX, SAY[3], SAY_BOTH[1], 'pm-say')}</g>`;
  return `${ptext(1192, 84, 'O₂ released', 'pm-h')}
    ${ptext(1192, 112, 'in the same time, per light', 'pm-t')}
    ${ptext(1192, 140, 'counts illustrative', 'pm-s')}
    <path class="pm-rule" d="M${LX},${ROWS[0] - 56}H${PANEL.x + PANEL.w - 26}M${LX},${ROWS[2] + 82}H${PANEL.x + PANEL.w - 26}"/>
    ${rowLab.join('')}${slots}${box}${say}`;
}

/* ---- the O₂ leaving photosystem II on the chain (figure units) */
const PUFF_A: V = [OEC[0] + 6, OEC[1] + 18], PUFF_B: V = [OEC[0] + 40, OEC[1] + 80];
const ALL = PUFFS.flat();
const world = (): string => ALL.map((_, i) => `<g data-k="puff-${i}" opacity="0" display="none">${o2G(0, 0)}</g>`).join('');

export const STAGING = makeStaging({
  id: 'm1',
  name: 'M1 · Lamps and an O₂ count',
  note: 'Slide 9 figure: zoom on photosystem I, its parts named before they act; Emerson with a red and a far-red lamp over both photosystems and an O₂ count (far-red alone, red alone, both).',
  beats: PSIM,
  lamps: true,
  holds3: [READY, 4.35, 7.05], end3: END3,
  holds4: [1.1], out4: 1.15,
  panel,
  world,
  bind(c) {
    return (t3, t4, k) => {
      // O₂ leaving PSII, and the count
      ALL.forEach((p0, i) => {
        const u = (t3 - p0) / 0.9;
        c.put(`puff-${i}`, lerpV(PUFF_A, PUFF_B, smooth(u)), k, u < 0 || u > 1.3 ? 0 : tw(u, 0, 0.15) * (1 - tw(u, 0.75, 1.0)));
      });
      PUFFS.forEach((row, r) => row.forEach((p0, i) => c.op(c.q(`tally-${r}-${i}`), tw(t3, p0 + COUNT, p0 + COUNT + 0.2))));
      c.op(c.q('sum'), tw(t3, SUM, SUM + 0.4));
      c.op(c.q('say1'), tw(t4, 0.1, 0.5));
      c.op(c.q('say2'), tw(t4, 0.55, 0.95));
      return lightAt(STEPS, t3);
    };
  },
});

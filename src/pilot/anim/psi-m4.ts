// Photosystem I, staging m4: the red drop, Emerson's enhancement, then the Z-scheme (order of 29 Oct 2026,
// research/redo-2026-10-29/PSI_EMERSON_BRIEF.md). All five beats, the O₂ meters, the clipping and the Z-scheme are drawn
// by psim-common.ts; the panel and bind below (an older round's small Z-scheme over photon rows) are not drawn.
// - Older round, beat 4 (Emerson's enhancement): above the photon rows, the Z-scheme (Hill & Bendall 1960) with energy upwards: water,
//   photosystem II's lift (P680 → P680*), plastoquinone, cytochrome b₆f, plastocyanin, photosystem I's lift (P700 →
//   P700*), ferredoxin, NADP⁺; PSII's levels in its green, PSI's in its teal, the carriers in their slide colours. Each
//   lift starts as a dashed grey line and lights, per row, as strongly as its photosystem is fed: far-red alone PSII
//   1/7 of PSI (red lift faint, far-red lift full), red alone PSI 3/5 of PSII, both PSII 6/10 of PSI. The fainter lift is
//   the one that sets the pace.
// Levels are placed by approximate midpoint potentials (V; energy up = more negative): P680 +1.2, H₂O/O₂ +0.82, PQ +0.1,
// cytochrome f +0.35, plastocyanin +0.37, P700 +0.45, P700* ≈ −1.3, P680* ≈ −0.8, ferredoxin −0.42, NADP⁺/NADPH −0.32
// (Govindjee, Shevela & Björn 2017, Photosynth Res 133:5, Fig. 6); no numbers are shown, "levels approximate" is.
import { tagG, waterG } from '../figs/chain';
import { B4, ROWS, head, makeStaging, ptext } from './psim-common';
import { f1, tw, type V } from './antenna-common';
import { PSIM_M4 } from './beats-psim';

const y = (e: number): number => 340 + 72 * e;
const AX = 904;
const H2O: V = [962, y(0.9)];
const P680: V = [1030, y(1.2)], P680S: V = [1030, y(-0.8)];
const PQ: V = [1160, y(0.1)], B6F: V = [1232, y(0.35)], PCv: V = [1296, y(0.38)];
const P700: V = [1368, y(0.45)], P700S: V = [1368, y(-1.3)];
const FD: V = [1466, y(-0.42)], NAD: V = [1520, y(-0.3)];

const lvl = (c: V, cls: string, w = 52): string => `<rect class="pm-lvl ${cls}" x="${f1(c[0] - w / 2)}" y="${f1(c[1] - 6)}" width="${w}" height="12" rx="4"/>`;
const carrier = (c: V, part: string, rx: number, ry: number): string => `<g class="chn-on"><ellipse class="chn-body chn-${part}" cx="${f1(c[0])}" cy="${f1(c[1])}" rx="${rx}" ry="${ry}"/></g>`;
function down(a: V, b: V, ax = 0, bx = 0): string {
  const p: V = [a[0] + ax, a[1] + 7], q: V = [b[0] + bx, b[1] - 9], d: V = [q[0] - p[0], q[1] - p[1]], L = Math.hypot(d[0], d[1]);
  const e: V = [q[0] - (d[0] / L) * 9, q[1] - (d[1] / L) * 9];
  return `<path class="pm-zgrey" d="M${f1(p[0])},${f1(p[1])}L${f1(e[0])},${f1(e[1])}"/>${head(q, d, 'pm-zgreyh', 11, 6)}`;
}
/** A lift: dashed grey under a coloured copy whose opacity says how strongly the photosystem is fed. */
function lift(k: string, lo: V, hi: V, cls: string): string {
  const dd = `M${lo[0]},${lo[1] - 7}V${hi[1] + 20}`, h = (c: string): string => head([lo[0], hi[1] + 7], [0, -1], c, 18, 11);
  return `<path class="pm-lift-off" d="${dd}"/>${h('pm-lift-offh')}<g data-k="${k}" opacity="0" display="none"><path class="${cls}" d="${dd}"/>${h(`${cls}h`)}</g>`;
}

function panel(): string {
  return `<path class="pm-axis" d="M${AX},${y(1.32)}V${y(-1.36) + 10}"/>${head([AX, y(-1.36)], [0, -1], 'pm-axh', 12, 6.5)}
    <text class="pm-ax" transform="translate(${AX - 12} ${y(0)}) rotate(-90)" text-anchor="middle">energy</text>
    ${down(H2O, P680, 14, -18)}${down(P680S, PQ, 26, -14)}${down(PQ, B6F, 18, -10)}${down(B6F, PCv, 16, -10)}${down(PCv, P700, 14, -18)}${down(P700S, FD, 26, -8)}${down(FD, NAD, 14, -24)}
    ${lift('l2', P680, P680S, 'pm-lift-red')}${lift('l1', P700, P700S, 'pm-lift-fr')}
    ${lvl(P680, 'pm-lvl-ii')}${lvl(P680S, 'pm-lvl-ii')}${lvl(P700, 'pm-lvl-i')}${lvl(P700S, 'pm-lvl-i')}
    ${carrier(PQ, 'pq', 16, 8)}${carrier(B6F, 'b6f', 18, 10)}${carrier(PCv, 'pc', 11, 11)}${carrier(FD, 'fd', 10, 10)}
    <g transform="translate(${H2O[0]} ${H2O[1] - 4}) scale(1.1)">${waterG(0, 0)}</g>${ptext(H2O[0], H2O[1] + 31, 'H₂O', 'pm-xs', 'middle')}
    ${ptext(P680[0] + 32, P680[1] + 5, 'P680', 'pm-xs')}${ptext(P700[0] + 32, P700[1] + 5, 'P700', 'pm-xs')}
    ${ptext(PQ[0], PQ[1] + 26, 'PQ', 'pm-xs', 'middle')}${ptext(B6F[0], B6F[1] + 28, 'b₆f', 'pm-xs', 'middle')}${ptext(PCv[0], PCv[1] + 28, 'PC', 'pm-xs', 'middle')}
    ${ptext(FD[0] + 16, FD[1] - 8, 'Fd', 'pm-xs')}
    ${ptext(P680[0] + 14, y(0.15), 'PSII', 'pm-t pm-ii')}${ptext(P680[0] + 14, y(0.15) + 22, 'red', 'pm-xs pm-red')}
    ${ptext(P700[0] - 14, y(-0.62), 'PSI', 'pm-t pm-i', 'end')}${ptext(P700[0] - 14, y(-0.62) + 22, 'far-red', 'pm-xs pm-fr', 'end')}
    <g transform="translate(${NAD[0]} ${NAD[1] + 24})">${tagG(0, 0, 'NADP⁺', 'plain')}</g>
    ${ptext(1560, 236, 'after Hill &amp; Bendall 1960; levels approximate', 'pm-xs', 'end')}`;
}

export const STAGING = makeStaging({
  id: 'm4',
  name: 'M4 · The Z-scheme',
  note: 'Slide 9 figure: zoom on photosystem I, its parts named before they act; the red drop (1943, Emerson’s clipping with the first far-red light); the enhancement (1957, O₂ meters: red alone, far-red alone, both); both photosystems together on the Z-scheme (Hill & Bendall 1960).',
  beats: PSIM_M4,
  lamps: false,
  table: { y0: 484, rowH: 66, o2: 'none' },
  panel,
  bind(c) {
    return t4 => {
      // per row: how strongly each lift lights (photons caught / the larger of the two)
      let ii = 0, i = 0;
      ROWS.forEach((w, r) => {
        const on = tw(t4, B4.rows[r], B4.rows[r] + 0.4), m = Math.max(w.ii, w.i);
        ii = ii + (w.ii / m - ii) * on; i = i + (w.i / m - i) * on;
      });
      c.op(c.q('l2'), ii);
      c.op(c.q('l1'), i);
    };
  },
});

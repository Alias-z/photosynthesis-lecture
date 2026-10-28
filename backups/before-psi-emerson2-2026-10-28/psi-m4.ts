// Photosystem I, staging m4: Emerson read on the Z-scheme. Beats 1–2 and the frame: psim-common.ts.
// - Beat 3 (holds: ready; far-red only): the panel holds Emerson's clipping and the Z-scheme (Hill & Bendall 1960) with
//   energy upwards: water, photosystem II's lift (P680 → P680*), plastoquinone, cytochrome b₆f, plastocyanin,
//   photosystem I's lift (P700 → P700*), ferredoxin, NADP⁺; PSII's levels in its green, PSI's in its teal, the carriers in
//   their slide colours. Each reaction centre holds one e⁻. (1) Far-red only: far-red falls on PSI on the chain; PSI's lift
//   lights far-red and its e⁻ goes up and on to ferredoxin and NADP⁺; P700 is left empty; PSII's lift stays a dashed grey
//   line, "step missing". (2) Red added: red falls on PSII (and PSI); PSII's lift lights red; its e⁻ goes up and down the
//   chain, refills P700, is lifted again and reaches NADP⁺, which becomes NADPH; water refills P680 and gives O₂.
// - Beat 4 (hold: written): the brief's two statements; then the common zoom out.
// Levels are placed by approximate midpoint potentials (V; energy up = more negative): P680 +1.2, H₂O/O₂ +0.82, PQ +0.1,
// cytochrome f +0.35, plastocyanin +0.37, P700 +0.45, P700* ≈ −1.3, P680* ≈ −0.8, ferredoxin −0.42, NADP⁺/NADPH −0.32
// (Govindjee, Shevela & Björn 2017, Photosynth Res 133:5, Fig. 6); no numbers are shown, "levels approximate" is.
import { o2G, tagG, waterG } from '../figs/chain';
import { along, head, lightAt, makeStaging, ptext, sayBlock, type Light, type Step } from './psim-common';
import { f1, lerp, smooth, tw, type V } from './antenna-common';
import { PSIM_M4 } from './beats-psim';

/* ---- the scheme (stage units): y from the midpoint potential, x by column */
const y = (e: number): number => 400 + 125 * e;
const AX = 904;
const H2O: V = [962, y(0.9)];
const P680: V = [1030, y(1.2)], P680S: V = [1030, y(-0.8)];
const PQ: V = [1160, y(0.1)], B6F: V = [1232, y(0.35)], PCv: V = [1296, y(0.38)];
const P700: V = [1368, y(0.45)], P700S: V = [1368, y(-1.3)];
const FD: V = [1466, y(-0.42)], NAD: V = [1520, y(-0.3)];

/* ---- timing (s into beat 3) */
const READY = 1.6, ZIN = [0.9, 1.4];
const STEPS: Step[] = [
  { on: 1.65, off: 999, far: true },
  { on: 4.15, off: 999, red: true },
];
const LIFT1 = [1.9, 2.4], LIFT2 = [4.4, 4.9];
/** e⁻ of PSI in step 1: up its lift, on to ferredoxin and NADP⁺. */
const PATH1: V[] = [P700, P700S, FD, NAD], T1 = [2.45, 2.95, 3.35, 3.75];
/** e⁻ of PSII in step 2: up, down the chain, refills P700, up again, on to NADP⁺. */
const PATH2: V[] = [P680, P680S, PQ, B6F, PCv, P700, P700S, FD, NAD], T2 = [4.95, 5.45, 5.85, 6.1, 6.35, 6.65, 7.05, 7.35, 7.65];
const WATER = [5.5, 5.9], END3 = 8.15;

const lvl = (c: V, cls: string, w = 56): string => `<rect class="pm-lvl ${cls}" x="${f1(c[0] - w / 2)}" y="${f1(c[1] - 7)}" width="${w}" height="14" rx="5"/>`;
const carrier = (c: V, part: string, rx: number, ry: number): string => `<g class="chn-on"><ellipse class="chn-body chn-${part}" cx="${f1(c[0])}" cy="${f1(c[1])}" rx="${rx}" ry="${ry}"/></g>`;
/** A downhill step: thin grey arrow between two levels. */
function down(a: V, b: V, ax = 0, bx = 0): string {
  const p: V = [a[0] + ax, a[1] + 8], q: V = [b[0] + bx, b[1] - 10], d: V = [q[0] - p[0], q[1] - p[1]], L = Math.hypot(d[0], d[1]);
  const e: V = [q[0] - (d[0] / L) * 9, q[1] - (d[1] / L) * 9];
  return `<path class="pm-zgrey" d="M${f1(p[0])},${f1(p[1])}L${f1(e[0])},${f1(e[1])}"/>${head(q, d, 'pm-zgreyh', 11, 6)}`;
}
/** A lift: dashed grey; its coloured copy is revealed from the bottom by a clip. */
function lift(p: string, k: string, lo: V, hi: V, cls: string): string {
  const a = lo[1] - 8, b = hi[1] + 22, dd = `M${lo[0]},${a}V${b}`;
  return `<path class="pm-lift-off" d="${dd}"/>${head([lo[0], hi[1] + 8], [0, -1], 'pm-lift-offh', 20, 12)}
    <clipPath id="${p}-${k}"><rect data-k="${k}" x="${lo[0] - 20}" y="${a}" width="40" height="0"/></clipPath>
    <g clip-path="url(#${p}-${k})"><path class="${cls}" d="${dd}"/>${head([lo[0], hi[1] + 8], [0, -1], `${cls}h`, 20, 12)}</g>`;
}

function panel(p: string): string {
  const z = `<g data-k="z" opacity="0" display="none">
    <path class="pm-axis" d="M${AX},${y(1.32)}V${y(-1.36) + 10}"/>${head([AX, y(-1.36)], [0, -1], 'pm-axh', 13, 7)}
    <text class="pm-ax" transform="translate(${AX - 12} ${y(0)}) rotate(-90)" text-anchor="middle">energy</text>
    ${down(H2O, P680, 14, -18)}${down(P680S, PQ, 26, -14)}${down(PQ, B6F, 18, -10)}${down(B6F, PCv, 16, -10)}${down(PCv, P700, 14, -18)}${down(P700S, FD, 26, -8)}${down(FD, NAD, 14, -24)}
    ${lift(p, 'l2', P680, P680S, 'pm-lift-red')}${lift(p, 'l1', P700, P700S, 'pm-lift-fr')}
    ${lvl(P680, 'pm-lvl-ii')}${lvl(P680S, 'pm-lvl-ii')}${lvl(P700, 'pm-lvl-i')}${lvl(P700S, 'pm-lvl-i')}
    ${carrier(PQ, 'pq', 18, 9)}${carrier(B6F, 'b6f', 20, 11)}${carrier(PCv, 'pc', 13, 13)}${carrier(FD, 'fd', 12, 12)}
    <g transform="translate(${H2O[0]} ${H2O[1]}) scale(1.3)">${waterG(0, 0)}</g>
    ${ptext(H2O[0], H2O[1] + 40, 'H₂O', 'pm-lt', 'middle')}
    ${ptext(P680[0] + 34, P680[1] + 6, 'P680', 'pm-s')}${ptext(P700[0] + 34, P700[1] + 6, 'P700', 'pm-s')}
    ${ptext(PQ[0], PQ[1] + 32, 'PQ', 'pm-lt', 'middle')}${ptext(B6F[0], B6F[1] + 34, 'b₆f', 'pm-lt', 'middle')}${ptext(PCv[0], PCv[1] + 34, 'PC', 'pm-lt', 'middle')}
    ${ptext(FD[0] + 20, FD[1] - 10, 'Fd', 'pm-lt')}
    ${ptext(P680[0] + 16, y(0.2), 'PSII', 'pm-h pm-ii')}${ptext(P680[0] + 16, y(0.2) + 24, 'red', 'pm-t pm-red')}
    ${ptext(P700[0] - 16, y(-0.62), 'PSI', 'pm-h pm-i', 'end')}${ptext(P700[0] - 16, y(-0.62) + 24, 'far-red', 'pm-t pm-fr', 'end')}
    <g data-k="miss" opacity="0" display="none">${ptext(P680[0] + 16, y(0.2) + 50, 'step missing', 'pm-miss')}</g>
    <g data-k="znadp" transform="translate(${NAD[0]} ${NAD[1] + 26})">${tagG(0, 0, 'NADP⁺', 'plain')}</g>
    <g data-k="znadph" opacity="0" display="none" transform="translate(${NAD[0]} ${NAD[1] + 26})">${tagG(0, 0, 'NADPH', 'nadph')}</g>
    <circle data-k="ring1" opacity="0" display="none" class="pm-ring" cx="${P700[0]}" cy="${P700[1]}" r="8"/>
    <circle data-k="eII" opacity="0" display="none" class="pm-e" r="7"/><circle data-k="eI" opacity="0" display="none" class="pm-e" r="7"/>
    <circle data-k="eW" opacity="0" display="none" class="pm-e" r="7"/>
    <g data-k="o2" opacity="0" display="none">${o2G(0, 0)}<text class="pm-s" x="17" y="5">O₂</text></g>
  </g>`;
  return `${ptext(1192, 84, 'The Z-scheme', 'pm-h')}${ptext(1192, 112, 'two light reactions in series', 'pm-t')}
    ${ptext(1192, 140, 'after Hill & Bendall 1960; levels approximate', 'pm-s')}
    ${z}
    <path class="pm-rule" d="M886,592H${1584 - 26}"/>
    ${sayBlock(886, [622, 649, 686, 713])}`;
}

export const STAGING = makeStaging({
  id: 'm4',
  name: 'M4 · The Z-scheme',
  note: 'Slide 9 figure: zoom on photosystem I, its parts named before they act; Emerson read on the Z-scheme (Hill & Bendall 1960): far-red only lifts at PSI and the PSII step is missing; with red added both lift and electrons run from water to NADPH.',
  beats: PSIM_M4,
  lamps: false,
  holds3: [READY, 4.1], end3: END3,
  holds4: [1.1], out4: 1.15,
  panel,
  bind(c) {
    const reveal = (k: string, lo: V, hi: V, u: number): void => {
      const a = lo[1] - 8, b = hi[1] + 8, top = lerp(a, b, smooth(u));
      c.set(c.q(k), 'y', f1(top));
      c.set(c.q(k), 'height', f1(a - top));
    };
    const at = (k: string, p: V, o: number): void => {
      const el = c.q(k);
      c.op(el, o);
      c.set(el, 'cx', f1(p[0])); c.set(el, 'cy', f1(p[1]));
    };
    return (t3, t4): Light => {
      const zin = tw(t3, ZIN[0], ZIN[1]);
      c.op(c.q('z'), zin);
      reveal('l1', P700, P700S, tw(t3, LIFT1[0], LIFT1[1]));
      reveal('l2', P680, P680S, tw(t3, LIFT2[0], LIFT2[1]));
      c.op(c.q('miss'), tw(t3, LIFT1[0], LIFT1[0] + 0.4) * (1 - tw(t3, STEPS[1].on, STEPS[1].on + 0.3)));
      // PSI's e⁻ (step 1) and PSII's (step 2); P700 empty between them; water refills P680 and gives O₂
      at('eI', along(PATH1, T1, t3), 1 - tw(t3, T1[3] - 0.05, T1[3] + 0.2));
      at('eII', along(PATH2, T2, t3), 1 - tw(t3, T2[8] - 0.05, T2[8] + 0.2));
      c.op(c.q('ring1'), tw(t3, T1[0] + 0.05, T1[0] + 0.15) * (1 - tw(t3, T2[5] - 0.05, T2[5])));
      at('eW', along([H2O, P680], WATER, t3), tw(t3, WATER[0] - 0.2, WATER[0]));
      const uo = tw(t3, WATER[0], WATER[0] + 0.8), o2 = c.q('o2');
      c.op(o2, uo);
      c.set(o2, 'transform', `translate(${f1(H2O[0] - 2)} ${f1(H2O[1] - 34 - 22 * uo)}) scale(1.3)`);
      c.op(c.q('znadph'), tw(t3, T2[8], T2[8] + 0.25));
      c.op(c.q('znadp'), 1 - tw(t3, T2[8], T2[8] + 0.25));
      c.op(c.q('say1'), tw(t4, 0.1, 0.5));
      c.op(c.q('say2'), tw(t4, 0.55, 0.95));
      return lightAt(STEPS, t3);
    };
  },
});

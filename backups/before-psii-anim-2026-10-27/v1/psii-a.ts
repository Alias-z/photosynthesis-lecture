// Photosystem II, staging A "One continuous zoom": the real PSII core monomer (PDB 5XNL) side on in its membrane; the
// camera moves smoothly between its parts, and for Ruben and Kamen's experiment zooms out through an alga to the flask
// and back in. Every click plays one short move (about 1 s) or one sequence, then stops.
// - Beat 1: Kok's clipping, PSII in its membrane, P680 named | a photon arrives, the pair lights up and gives away an
//   electron, and pales | the absorption inset: the red band gets a notch at 680 nm.
// - Beat 2: closer onto the electron path, the cofactors named, the staircase | the electron hops P680 → pheophytin → QA →
//   QB (2.3 s), down the staircase; the pair is left as P680⁺.
// - Beat 3: zoom out to the alga | out to the flask, Ruben and Kamen's clipping | the heavy-oxygen water drips in, and
//   bubbles of heavy-oxygen O₂ rise.
// - Beat 4: back into the alga | into PSII at the Mn₄CaO₅ cluster | 2 H₂O come in; four electrons go up to P680⁺, one
//   after each photon | O₂ leaves, 4 H⁺ go into the lumen, which fills with H⁺: "acidic lumen".
// - Beat 5: across to QB at the stroma side | a second electron and 2 H⁺ from the stroma: PQ becomes PQH₂ | PQH₂ slides
//   into the membrane as the camera pulls back: acid in the lumen, PQH₂ in the membrane.
// Shared drawings, sources and the physics notes: psii-common.ts.
import './psii-a.css';
import {
  absSvg, B1, B4, B4X, B5, B5X, CHAIN, clockFor, compose, drawAbs, drawChem, drawFlask, drawStair, END, f1, FL_ALGA,
  flaskSvg, FLASK_DONE, HOPS_T, ID_TF, kokClip, labels, LAY, MEM_MID, MN, mv, onStage, overlaySvg, placeQb, QBV, REST,
  rkClip, setters, stairSvg, structureSvg, tfStr, tw, tween, type Tf, type V,
} from './psii-common';
import type { Staging } from './types';

const P = 'psa';

/* ---------------------------------------------------------------- the alga (between the flask and the membrane) */

const CELL_C: V = [800, 360], CELL_R = 250;
const polar = (c: V, r: number, deg: number): V => [c[0] + r * Math.cos((deg * Math.PI) / 180), c[1] + r * Math.sin((deg * Math.PI) / 180)];
/** Where PSII sits: the middle thylakoid, at the bottom of the cup-shaped chloroplast, where it runs level. */
const ALGA_PT: V = polar(CELL_C, 172, 90);
function algaSvg(): string {
  const a0 = -28, a1 = 208, ro = 226, ri = 118, o0 = polar(CELL_C, ro, a0), o1 = polar(CELL_C, ro, a1), i0 = polar(CELL_C, ri, a0), i1 = polar(CELL_C, ri, a1);
  const cup = `M${f1(o0[0])},${f1(o0[1])}A${ro},${ro} 0 1 1 ${f1(o1[0])},${f1(o1[1])}A54,54 0 0 1 ${f1(i1[0])},${f1(i1[1])}A${ri},${ri} 0 1 0 ${f1(i0[0])},${f1(i0[1])}A54,54 0 0 1 ${f1(o0[0])},${f1(o0[1])}Z`;
  const arc = (r: number): string => { const p = polar(CELL_C, r, -18), q = polar(CELL_C, r, 198); return `M${f1(p[0])},${f1(p[1])}A${r},${r} 0 1 1 ${f1(q[0])},${f1(q[1])}`; };
  return `<circle class="psa-wall" cx="${CELL_C[0]}" cy="${CELL_C[1]}" r="${CELL_R}"/>
    <path class="psa-cup" d="${cup}"/><path class="psa-thy" d="${arc(146)}${arc(172)}${arc(198)}"/>
    <circle class="psa-nuc" cx="${CELL_C[0]}" cy="${CELL_C[1] - 30}" r="58"/>
    <g data-k="al-lab"><text class="ps-lab" x="1066" y="150">alga</text>
      <text class="ps-lab" x="${ALGA_PT[0] + 80}" y="${ALGA_PT[1] + 136}">thylakoid membrane</text>
      <path class="ps-lead-h" d="M${ALGA_PT[0] + 72},${ALGA_PT[1] + 112}L${ALGA_PT[0] + 4},${ALGA_PT[1] + 6}"/><path class="ps-lead" d="M${ALGA_PT[0] + 72},${ALGA_PT[1] + 112}L${ALGA_PT[0] + 4},${ALGA_PT[1] + 6}"/>
      <circle class="ps-lead-dot" cx="${ALGA_PT[0]}" cy="${ALGA_PT[1]}" r="4"/></g>`;
}

/* ---------------------------------------------------------------- dives */

const Z_ALGA = CELL_R / 3.8; // the alga drawn 250 px is a 3.8 px dot in the flask
const S_SMALL = 0.0105; // the structure's scale when it is a speck on the alga's thylakoid
/** Structure (seen through view V) inside the alga at ALGA_PT: e = 1 shows the structure in V, e = 0 the alga. */
function diveStruct(V0: Tf, e: number): [Tf, Tf] {
  const fb = onStage(V0, MEM_MID), Z = V0.s / S_SMALL;
  const c: V = [ALGA_PT[0] + (fb[0] - ALGA_PT[0]) * e, ALGA_PT[1] + (fb[1] - ALGA_PT[1]) * e], sa = Z ** e, sb = Z ** (e - 1);
  const vAlga: Tf = { s: sa, t: [c[0] - ALGA_PT[0] * sa, c[1] - ALGA_PT[1] * sa] };
  const vRel: Tf = { s: sb, t: [c[0] - fb[0] * sb, c[1] - fb[1] * sb] };
  return [vAlga, compose(vRel, V0)];
}
/** The alga inside the flask at FL_ALGA: e = 1 shows the alga, e = 0 the flask. */
function diveAlga(e: number): [Tf, Tf] {
  const c: V = [FL_ALGA[0] + (CELL_C[0] - FL_ALGA[0]) * e, FL_ALGA[1] + (CELL_C[1] - FL_ALGA[1]) * e], sa = Z_ALGA ** e, sb = Z_ALGA ** (e - 1);
  return [{ s: sa, t: [c[0] - FL_ALGA[0] * sa, c[1] - FL_ALGA[1] * sa] }, { s: sb, t: [c[0] - CELL_C[0] * sb, c[1] - CELL_C[1] * sb] }];
}

/* ---------------------------------------------------------------- timing (s into each beat) */

// Beat 1: the scene appears | the photon step | the absorption step.
const T1 = { show: 0.45, c0: 0.5, hold: 0.5 + B1.done + 0.05, abs: 1.85, end: 3.0 };
// Beat 2: the camera onto the path | the hops.
const T2 = { cam: [0.05, 1.0], hold: 1.15, hops: 1.2, end: 1.2 + HOPS_T + 0.2 };
// Beat 3: out to the alga | out to the flask | the experiment.
const T3 = { out1: [0.05, 1.15], hold1: 1.3, out2: [1.35, 1.0], hold2: 2.5, f: 2.55, end: 2.55 + FLASK_DONE + 0.1 };
// Beat 4: into the alga | into PSII at the cluster | water and four electrons | O₂ and H⁺.
const T4 = { in1: [0.05, 1.0], hold1: 1.15, in2: [1.2, 1.15], hold2: 2.5, w: 2.55, hold3: 2.55 + B4.done + 0.05, x: 2.55 + B4.done + 0.1 };
const T4END = T4.x + B4X.done + 0.1;
// Beat 5: across to QB | PQ takes 2 e⁻ and 2 H⁺ | PQH₂ leaves, the camera pulls back.
const T5 = { cam: [0.05, 1.0], hold1: 1.1, q: 1.15, hold2: 1.15 + B5.done + 0.05, m: 1.15 + B5.done + 0.1 };
const T5END = T5.m + B5X.done + 0.15;
const TEND = [T1.end, T2.end, T3.end, T4END, T5END];

const KOK = { x: 66, y: 140, w: 250 };
const RK = { x: 60, y: 210, w: 320 };

export const STAGING: Staging = {
  id: 'a',
  name: 'A · One continuous zoom',
  note: 'The real PSII side on in its membrane; the camera glides between its parts, and zooms out through an alga to the flask and back.',
  holds: [[T1.show, T1.hold], [T2.hold], [T3.hold1, T3.hold2], [T4.hold1, T4.hold2, T4.hold3], [T5.hold1, T5.hold2]],
  svg: () => `
    <g data-k="w-flask">${flaskSvg(P, 'a')}</g>
    <g data-k="w-alga">${algaSvg()}</g>
    ${structureSvg(P, 'a')}
    <g data-k="kok" opacity="0">${kokClip(P, KOK.x, KOK.y, KOK.w, -2.2)}</g>
    <g data-k="rk" opacity="0">${rkClip(P, RK.x, RK.y, RK.w, -2.4)}</g>
    ${absSvg()}${stairSvg()}${overlaySvg()}`,

  bind(stage) {
    const S = setters(stage), { q, set, op } = S;
    const scene = (k: string, v: Tf, o: number): void => { const el = q(k); op(el, o); if (o > 0.004) set(el, 'transform', tfStr(v)); };
    let last = '';
    return (beatIn, t) => {
      const b = Math.max(0, Math.min(4, Math.round(beatIn)));
      const tt = Math.max(0, Math.min(t, TEND[b]));
      const key = `${b}:${tt.toFixed(3)}`;
      if (key === last) return;
      last = key;

      let vS: Tf = REST, oS = 1, oOv = 1, vAlga: Tf = ID_TF, oAlga = 0, vFlask: Tf = ID_TF, oFlask = 0, oAlLab = 0;
      let clock = clockFor(b, {});
      let oKok = 0, oRk = 0, oAbs = 0, dip = 0, oStair = 0;

      if (b === 0) {
        const show = tw(tt, 0, 0.35);
        oS = show; oOv = show; oKok = show;
        clock = clockFor(0, { c0: tt - T1.c0 });
        oAbs = tw(tt, T1.abs, T1.abs + 0.25); dip = tw(tt, T1.abs + 0.3, T1.end - 0.1);
        labels(S, vS, null, LAY.rest, 1, show);
      } else if (b === 1) {
        const e = mv(tt, T2.cam[0], T2.cam[1]);
        vS = tween(REST, CHAIN, e);
        oKok = 1 - tw(tt, 0, 0.3); oAbs = 1 - tw(tt, 0, 0.3); dip = 1;
        oStair = tw(tt, T2.cam[0] + T2.cam[1] - 0.1, T2.hold);
        clock = clockFor(1, { hops: tt - T2.hops });
        labels(S, vS, LAY.rest, LAY.chain, e);
      } else if (b === 2) {
        const e1 = 1 - mv(tt, T3.out1[0], T3.out1[1]), e2 = 1 - mv(tt, T3.out2[0], T3.out2[1]);
        oStair = 1 - tw(tt, 0, 0.3);
        if (e2 >= 1) {
          [vAlga, vS] = diveStruct(CHAIN, e1);
          oS = tw(e1, 0.3, 0.6); oAlga = 1 - tw(e1, 0.35, 0.6); oOv = tw(e1, 0.8, 0.95);
          oAlLab = tw(tt, T3.out1[0] + T3.out1[1] - 0.1, T3.hold1);
        } else {
          [vFlask, vAlga] = diveAlga(e2);
          oS = 0; oOv = 0; oAlga = tw(e2, 0.3, 0.6); oFlask = 1 - tw(e2, 0.35, 0.6);
          oAlLab = 1 - tw(tt, T3.out2[0], T3.out2[0] + 0.2);
        }
        oRk = tw(tt, T3.out2[0] + T3.out2[1] - 0.15, T3.hold2);
        labels(S, vS, LAY.chain, null, tw(tt, 0, 0.3), oOv);
      } else if (b === 3) {
        const e2 = mv(tt, T4.in1[0], T4.in1[1]), e1 = mv(tt, T4.in2[0], T4.in2[1]);
        oRk = 1 - tw(tt, 0, 0.3);
        if (e1 <= 0) {
          [vFlask, vAlga] = diveAlga(e2);
          oS = 0; oOv = 0; oAlga = tw(e2, 0.3, 0.6); oFlask = 1 - tw(e2, 0.35, 0.6);
          oAlLab = tw(tt, T4.in1[0] + T4.in1[1] - 0.1, T4.hold1);
        } else {
          [vAlga, vS] = diveStruct(MN, e1);
          oS = tw(e1, 0.3, 0.6); oAlga = 1 - tw(e1, 0.35, 0.6); oOv = tw(e1, 0.8, 0.95);
          oAlLab = 1 - tw(tt, T4.in2[0], T4.in2[0] + 0.2);
        }
        clock = clockFor(3, { w: tt - T4.w, x: tt - T4.x });
        const acid = clock.x >= 0 ? tw(clock.x, 2.0, 2.35) : 0;
        labels(S, vS, null, LAY.mn, 1, tw(tt, T4.hold2 - 0.25, T4.hold2), { lumen: 1 - acid, acid });
      } else {
        const e = mv(tt, T5.cam[0], T5.cam[1]), e3 = mv(tt, T5.m, B5X.done);
        vS = e3 > 0 ? tween(QBV, END, e3) : tween(MN, QBV, e);
        clock = clockFor(4, { q: tt - T5.q, m: tt - T5.m });
        placeQb(clock);
        const h2 = clock.q >= 0 ? tw(clock.q, 1.6, 1.85) : 0;
        if (e3 > 0) labels(S, vS, LAY.qb, LAY.end, e3, 1, { pq: 0 });
        else labels(S, vS, LAY.mn, LAY.qb, e, 1, { lumen: 0, pq: 1 - h2, pqh2: h2 });
      }

      scene('w-flask', vFlask, oFlask);
      scene('w-alga', vAlga, oAlga);
      op(q('al-lab'), oAlLab);
      scene('st', vS, oS);
      op(q('kok'), oKok); op(q('rk'), oRk);
      drawAbs(S, oAbs, dip);
      drawStair(S, oStair, clock.hops);
      drawChem(S, clock, vS, oOv);
      drawFlask(S, 'a', b === 2 ? tt - T3.f : b > 2 ? 99 : -1);
    };
  },
};

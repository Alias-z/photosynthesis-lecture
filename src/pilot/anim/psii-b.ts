// Photosystem II, staging B "Newspaper desk". Everything lies on one desk (the Bristol paper): Kok's clipping, the PSII
// structure printed as a newspaper halftone on a newsprint sheet, and further along Ruben and Kamen's clipping beside the
// flask. Each historical beat opens on its clipping; the camera then glides over the desk to the scene. Clicks stop only
// where the camera reaches a new view; inside a view, an event and all it causes play through on one click (lecturer,
// 27 Oct 2026). Moves take about 1 s.
// - Beat 1: Kok's clipping, close | the camera glides back to show the printed PSII beside it, P680 named | a photon
//   arrives, the pair gives away an electron and pales, and the absorption inset shows a notch at 680 nm.
// - Beat 2: closer onto the electron path, the staircase | the hops P680 → pheophytin → QA → QB; P680⁺.
// - Beat 3: the camera lifts off the sheet and lands on Ruben and Kamen's clipping | glides to the flask beside it | the
//   heavy-oxygen water drips in, bubbles of heavy-oxygen O₂ rise.
// - Beat 4: back over the desk onto the printed PSII at the Mn₄CaO₅ cluster | water in, four electrons up to P680⁺, O₂
//   out, H⁺ into the lumen: "acidic lumen".
// - Beat 5: as staging A: QB | PQ takes 2 e⁻ and 2 H⁺ and goes into the membrane as PQH₂, camera back: the end still.
// Shared drawings, sources and the physics notes: psii-common.ts.
import './psii-b.css';
import {
  absSvg, B1, B4, B4X, B5, B5X, CHAIN, clockFor, compose, drawAbs, drawChem, drawFlask, drawStair, END, flaskSvg,
  FLASK_DONE, HOPS_T, kokClip, KOK_H, labels, LAY, lerpV, MN, mv, overlaySvg, placeQb, QBV, REST, rkClip, rkClipH,
  setters, stairSvg, structureSvg, tfStr, tw, type Tf, type V,
} from './psii-common';
import type { Staging } from './types';

const P = 'psb';

/* ---------------------------------------------------------------- the desk and its views */

/** The flask scene lies this far right of the sheet on the desk. */
const DX = 1900;
const KOK = { x: 66, y: 140, w: 250 };
const RK = { x: DX + 60, y: 210, w: 320 };
/** The desk view that shows the structure in view V (the sheet is printed in the REST frame). */
const deskFor = (V0: Tf): Tf => { const s = V0.s / REST.s; return { s, t: [V0.t[0] - s * REST.t[0], V0.t[1] - s * REST.t[1]] }; };
const HOME: Tf = { s: 1, t: [0, 0] };
const zoomOn = (c: V, s: number): Tf => ({ s, t: [800 - s * c[0], 370 - s * c[1]] });
const KOKV = zoomOn([KOK.x + KOK.w / 2, KOK.y + KOK_H(KOK.w) / 2], 1.55);
const RKV = zoomOn([RK.x + RK.w / 2, RK.y + rkClipH(RK.w) / 2], 1.55);
const FLASKV: Tf = { s: 1, t: [-DX, 0] };
/** A glide over the desk from view a to view b: the scale rises and falls along a short arc (lifted by `lift`, as a
 *  factor at the middle), the stage centre's desk point moves evenly. */
function glide(a: Tf, b: Tf, e: number, lift = 1): Tf {
  const C: V = [800, 370], ca: V = [(C[0] - a.t[0]) / a.s, (C[1] - a.t[1]) / a.s], cb: V = [(C[0] - b.t[0]) / b.s, (C[1] - b.t[1]) / b.s];
  const s = a.s * (b.s / a.s) ** e * lift ** (4 * e * (1 - e) * -1), c = lerpV(ca, cb, e);
  return { s, t: [C[0] - s * c[0], C[1] - s * c[1]] };
}

/* ---------------------------------------------------------------- timing (s into each beat) */

const T1 = { show: 0.45, cam: [0.5, 1.1], hold2: 1.7, c0: 1.75, abs: 1.75 + B1.done - 0.1, end: 1.75 + B1.done + 1.1 };
const T2 = { cam: [0.05, 1.0], hold: 1.15, hops: 1.2, end: 1.2 + HOPS_T + 0.2 };
const T3 = { cam1: [0.05, 1.25], hold1: 1.4, cam2: [1.45, 1.0], hold2: 2.55, f: 2.6, end: 2.6 + FLASK_DONE + 0.1 };
const T4 = { cam: [0.05, 1.25], hold1: 1.4, w: 1.45, x: 1.45 + B4.done + 0.1 };
const T4END = T4.x + B4X.done + 0.1;
const T5 = { cam: [0.05, 1.0], hold1: 1.1, q: 1.15, m: 1.15 + B5.done + 0.1 };
const T5END = T5.m + B5X.done + 0.15;
const TEND = [T1.end, T2.end, T3.end, T4END, T5END];

export const STAGING: Staging = {
  id: 'b',
  name: 'B · Newspaper desk',
  note: 'Clippings and the printed PSII lie on one desk; each historical beat opens on its clipping, then the camera glides to the scene.',
  holds: [[T1.show, T1.hold2], [T2.hold], [T3.hold1, T3.hold2], [T4.hold1], [T5.hold1]],
  svg: () => `
    ${structureSvg(P, 'b')}
    <g data-k="desk">
      <g transform="translate(${DX} 0)">${flaskSvg(P, 'b')}</g>
      <g data-k="kokb">${kokClip(P, KOK.x, KOK.y, KOK.w, -2.2)}</g>${rkClip(P, RK.x, RK.y, RK.w, -2.4)}
    </g>
    ${absSvg()}${stairSvg()}${overlaySvg()}`,

  bind(stage) {
    const S = setters(stage), { q, set, op } = S;
    let last = '';
    return (beatIn, t) => {
      const b = Math.max(0, Math.min(4, Math.round(beatIn)));
      const tt = Math.max(0, Math.min(t, TEND[b]));
      const key = `${b}:${tt.toFixed(3)}`;
      if (key === last) return;
      last = key;

      let vD: Tf = HOME, oDesk = 1, oOv = 1, oAbs = 0, dip = 0, oStair = 0;
      let clock = clockFor(b, {});
      let lab: () => void;

      if (b === 0) {
        const e = mv(tt, T1.cam[0], T1.cam[1]);
        vD = glide(KOKV, HOME, e);
        oDesk = tw(tt, 0, 0.35);
        oOv = tw(tt, T1.cam[0] + T1.cam[1] - 0.15, T1.hold2);
        clock = clockFor(0, { c0: tt - T1.c0 });
        oAbs = tw(tt, T1.abs, T1.abs + 0.25); dip = tw(tt, T1.abs + 0.3, T1.end - 0.1);
        lab = () => labels(S, compose(vD, REST), null, LAY.rest, 1, oOv);
      } else if (b === 1) {
        const e = mv(tt, T2.cam[0], T2.cam[1]);
        vD = glide(HOME, deskFor(CHAIN), e);
        oAbs = 1 - tw(tt, 0, 0.3); dip = 1;
        oStair = tw(tt, T2.cam[0] + T2.cam[1] - 0.1, T2.hold);
        clock = clockFor(1, { hops: tt - T2.hops });
        lab = () => labels(S, compose(vD, REST), LAY.rest, LAY.chain, e);
      } else if (b === 2) {
        const e1 = mv(tt, T3.cam1[0], T3.cam1[1]), e2 = mv(tt, T3.cam2[0], T3.cam2[1]);
        vD = e2 > 0 ? glide(RKV, FLASKV, e2) : glide(deskFor(CHAIN), RKV, e1, 3.2);
        oStair = 1 - tw(tt, 0, 0.3); oOv = 1 - tw(tt, 0, 0.3);
        lab = () => labels(S, compose(vD, REST), LAY.chain, null, tw(tt, 0, 0.3));
      } else if (b === 3) {
        const e = mv(tt, T4.cam[0], T4.cam[1]);
        vD = glide(FLASKV, deskFor(MN), e, 3.2);
        oOv = tw(tt, T4.cam[0] + T4.cam[1] - 0.2, T4.hold1);
        clock = clockFor(3, { w: tt - T4.w, x: tt - T4.x });
        const acid = clock.x >= 0 ? tw(clock.x, 2.0, 2.35) : 0;
        lab = () => labels(S, compose(vD, REST), null, LAY.mn, 1, oOv, { lumen: 1 - acid, acid });
      } else {
        const e = mv(tt, T5.cam[0], T5.cam[1]), e3 = mv(tt, T5.m, B5X.done);
        vD = e3 > 0 ? glide(deskFor(QBV), deskFor(END), e3) : glide(deskFor(MN), deskFor(QBV), e);
        clock = clockFor(4, { q: tt - T5.q, m: tt - T5.m });
        const h2 = clock.q >= 0 ? tw(clock.q, 1.6, 1.85) : 0;
        lab = () => (e3 > 0 ? labels(S, compose(vD, REST), LAY.qb, LAY.end, e3, 1, { pq: 0 }) : labels(S, compose(vD, REST), LAY.mn, LAY.qb, e, 1, { lumen: 0, pq: 1 - h2, pqh2: h2 }));
      }

      const vS = compose(vD, REST);
      op(q('st'), oDesk); set(q('st'), 'transform', tfStr(vS));
      op(q('desk'), oDesk); set(q('desk'), 'transform', tfStr(vD));
      // Kok's clipping has done its work once the camera leaves for the electron path; it would lie beside PQH₂ later.
      op(q('kokb'), b === 0 ? 1 : b === 1 ? 1 - tw(tt, 0, 0.3) : 0);
      drawAbs(S, oAbs, dip);
      drawStair(S, oStair, clock.hops);
      placeQb(clock);
      lab();
      drawChem(S, clock, vS, oOv);
      drawFlask(S, 'b', b === 2 ? tt - T3.f : b > 2 ? 99 : -1);
    };
  },
};

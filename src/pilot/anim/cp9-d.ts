// Measuring leaf gas exchange, staging D: side by side. Two copies of the slide's drawn open system (C9 v1), both in the
// dark (both leaves respire: CO₂ out above CO₂ in); beat 2 switches on the right lamp only, and only the right readouts
// react (CO₂ drop A, H₂O rise E), so the right one ends as the slide figure; beat 3 drops the dark one and dives into the
// lit leaf onto C9 v7 (gₛ and Cᵢ calculated); beat 4: the question. Scenes: cp9-common.ts.
import { CP9_D } from './beats-cp';
import { beatClock, clipDefs, dive, FULL, mv, pulseAt, setters, tfStr, tw, view } from './cp-stage';
import { LEAF_PT, pathCtl, pathSvg, PORE_PT, sysCtl, sysSvg } from './cp9-common';
import type { Staging } from './types';

const P = 'cp9d';
const VL = view(0.86, [400, 300], [400, 392]), VR = view(0.86, [400, 300], [1200, 392]);
const TEND = [0.4, 1.2, 2.6, 1.6];

export const STAGING: Staging = {
  id: 'd',
  name: 'D · Side by side (dark | light)',
  note: 'Two copies of C9 v1 side by side, both dark; light on the right one only, its readouts react; then the dive into the lit leaf onto C9 v7.',
  beats: CP9_D,
  svg: () => `${clipDefs(P)}
    <g class="fig"><g data-k="sl">${sysSvg(P, 'l')}</g><g data-k="sr">${sysSvg(P, 'r')}</g><g data-k="path" opacity="0">${pathSvg(P, 'p')}</g></g>
    <g data-k="hd"><text class="cps-head" x="400" y="72" text-anchor="middle">leaf in the dark</text>
      <text data-k="hr0" class="cps-head" x="1200" y="72" text-anchor="middle">leaf in the dark</text>
      <text data-k="hr1" class="cps-head" x="1200" y="72" text-anchor="middle" opacity="0">leaf in the light</text></g>`,

  bind(stage) {
    const S = setters(stage), { q, set, op } = S;
    const left = sysCtl(S, 'l'), right = sysCtl(S, 'r'), path = pathCtl(S, 'p');
    set(q('sl'), 'transform', `matrix(${VL.s},0,0,${VL.s},${VL.t[0]},${VL.t[1]})`);
    let last = '';
    return (beatIn, t) => {
      const b = Math.max(0, Math.min(3, Math.round(beatIn))), tt = Math.max(0, Math.min(t, TEND[b]));
      const key = `${b}:${tt.toFixed(3)}`;
      if (key === last) return;
      last = key;
      const T = beatClock(b, tt), t1 = T(1), t2 = T(2), t3 = T(3);

      left(0);
      const u = mv(t1, 0.1, 0.9);
      right(u);
      op(q('hr0'), 1 - tw(u, 0.3, 0.6)); op(q('hr1'), tw(u, 0.3, 0.6));
      // beat 3: the dark one and the headings go; the dive into the lit leaf
      const away = 1 - tw(t2, 0, 0.4);
      op(q('sl'), away); op(q('hd'), away);
      const e = mv(t2, 0.3, 1.3);
      const [va, vb] = dive(VR, LEAF_PT, FULL, PORE_PT, 9, e);
      set(q('sr'), 'transform', tfStr(va)); set(q('path'), 'transform', tfStr(vb));
      op(q('sr'), 1 - tw(e, 0.5, 0.85)); op(q('path'), tw(e, 0.35, 0.75));
      path({ measured: tw(t2, 1.65, 1.85), calc: tw(t2, 2.15, 2.35), values: tw(t2, 2.15, 2.35), pulse: pulseAt(t3, 0.1, 1.2), q: tw(t3, 0.9, 1.1) });
    };
  },
};

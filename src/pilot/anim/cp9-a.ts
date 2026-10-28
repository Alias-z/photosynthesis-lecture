// Measuring leaf gas exchange, staging A: on the slide's drawn open system (C9 v1). Beat 1 shows it in the dark; beat 2
// switches the lamp on and the readouts react in the same click; beat 3 moves the figure aside for Gaastra's two
// clippings; beat 4 dives into the leaf onto C9 v7, where the pills appear (measured A, E; calculated gₛ, Cᵢ) with the
// typical values; beat 5 pulses the dimmed mesophyll and puts a question mark at C_c. Scenes: cp9-common.ts.
import { beatClock, clipDefs, dive, FULL, mv, pulseAt, setters, tfStr, tw, tween, view } from './cp-stage';
import { gaFig1Clip, gaTitleClip, LEAF_PT, pathCtl, pathSvg, PORE_PT, sysCtl, sysSvg } from './cp9-common';
import type { Staging } from './types';

const P = 'cp9a';
/** The open system moved left to make room for the clippings. */
const SIDE = view(0.74, [400, 300], [440, 370]);
const TEND = [0.5, 1.2, 1.3, 2.6, 1.6];

export const STAGING: Staging = {
  id: 'a',
  name: 'A · On the slide figure',
  note: 'C9 v1 (the drawn open system): dark, then light on with the readouts reacting; Gaastra’s clippings beside it; a dive into the leaf onto C9 v7, where gₛ and Cᵢ are calculated.',
  svg: () => `${clipDefs(P)}
    <g class="fig"><g data-k="sys">${sysSvg(P, 's')}</g><g data-k="path" opacity="0">${pathSvg(P, 'p')}</g></g>
    ${gaTitleClip(P, 'gt', 862, 52, 680)}${gaFig1Clip(P, 'g1', 872, 400, 680)}`,

  bind(stage) {
    const S = setters(stage), { q, set, op } = S;
    const sys = sysCtl(S, 's'), path = pathCtl(S, 'p');
    let last = '';
    return (beatIn, t) => {
      const b = Math.max(0, Math.min(4, Math.round(beatIn))), tt = Math.max(0, Math.min(t, TEND[b]));
      const key = `${b}:${tt.toFixed(3)}`;
      if (key === last) return;
      last = key;
      const T = beatClock(b, tt), t1 = T(1), t2 = T(2), t3 = T(3), t4 = T(4);

      sys(mv(t1, 0.1, 0.9));
      // camera: the whole figure, then aside for the clippings, then the dive into the leaf
      const vs = tween(FULL, SIDE, mv(t2, 0.05, 1.0)), e = mv(t3, 0.2, 1.3);
      const [va, vb] = dive(vs, LEAF_PT, FULL, PORE_PT, 9, e);
      set(q('sys'), 'transform', tfStr(va)); set(q('path'), 'transform', tfStr(vb));
      op(q('sys'), 1 - tw(e, 0.5, 0.85)); op(q('path'), tw(e, 0.35, 0.75));
      const clip = tw(t2, 0.95, 1.15) * (1 - tw(t3, 0, 0.2));
      op(q('gt'), clip); op(q('g1'), clip);
      path({ measured: tw(t3, 1.55, 1.75), calc: tw(t3, 2.05, 2.25), values: tw(t3, 2.05, 2.25), pulse: pulseAt(t4, 0.1, 1.2), q: tw(t4, 0.9, 1.1) });
    };
  },
};

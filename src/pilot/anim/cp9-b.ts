// Measuring leaf gas exchange, staging B: history first, on the slide's own "1959 and today" figure (C9 v6). Beat 1: the
// camera on Gaastra's analyser (v6, top) with his title page beside it; beat 2: the camera glides down to today's portable
// system (v6, bottom); beat 3: the drawn open system (C9 v1) in the dark, a click, then light on with the readouts
// reacting; beat 4: the dive into the leaf onto C9 v7 (gₛ and Cᵢ calculated); beat 5: the question. Scenes: cp9-common.ts.
import { CP9_B } from './beats-cp';
import { beatClock, clipDefs, dive, FULL, mv, pulseAt, setters, tfStr, tw, tween, view } from './cp-stage';
import { figCard, gaTitleClip, LEAF_PT, pathCtl, pathSvg, PORE_PT, sysCtl, sysSvg } from './cp9-common';
import type { Staging } from './types';

const P = 'cp9b';
/** v6's top half (Gaastra's Fig. 1 with its labels) and bottom half (the GFS-3000 in an orchard). */
const TOP = view(1.25, [400, 150], [580, 318]), BOT = view(1.3, [480, 430], [800, 420]);
const TEND = [0.4, 1.3, 2.1, 2.6, 1.6];

export const STAGING: Staging = {
  id: 'b',
  name: 'B · History first (1959 → today)',
  note: 'Starts on C9 v6: Gaastra’s 1959 analyser with his title page, then today’s portable system; then C9 v1 dark → light, and the dive into the leaf onto C9 v7.',
  beats: CP9_B,
  holds: [[], [], [1.0], [], []],
  svg: () => `${clipDefs(P)}
    <g class="fig"><g data-k="hist">${figCard(P, 'h', 'v6')}</g><g data-k="sys" opacity="0">${sysSvg(P, 's')}</g>
      <g data-k="path" opacity="0">${pathSvg(P, 'p')}</g></g>
    ${gaTitleClip(P, 'gt', 1110, 118, 462, -1.5)}`,

  bind(stage) {
    const S = setters(stage), { q, set, op } = S;
    const sys = sysCtl(S, 's'), path = pathCtl(S, 'p');
    let last = '';
    return (beatIn, t) => {
      const b = Math.max(0, Math.min(4, Math.round(beatIn))), tt = Math.max(0, Math.min(t, TEND[b]));
      const key = `${b}:${tt.toFixed(3)}`;
      if (key === last) return;
      last = key;
      const T = beatClock(b, tt), t0 = T(0), t1 = T(1), t2 = T(2), t3 = T(3), t4 = T(4);

      // v6: top, glide to the bottom, then back to the whole card as it gives way to the drawn system
      const away = mv(t2, 0, 0.8);
      const vh = tween(tween(TOP, BOT, mv(t1, 0.05, 1.1)), FULL, away);
      set(q('hist'), 'transform', tfStr(vh));
      op(q('hist'), 1 - tw(t2, 0.1, 0.7));
      op(q('gt'), tw(t0, 0, 0.2) * (1 - tw(t1, 0, 0.2)));
      // the drawn system: in from the third beat, dark until the click, then light
      sys(mv(t2, 1.1, 0.9));
      const e = mv(t3, 0.2, 1.3);
      const [va, vb] = dive(FULL, LEAF_PT, FULL, PORE_PT, 9, e);
      set(q('sys'), 'transform', tfStr(va)); set(q('path'), 'transform', tfStr(vb));
      op(q('sys'), tw(t2, 0.3, 0.9) * (1 - tw(e, 0.5, 0.85))); op(q('path'), tw(e, 0.35, 0.75));
      path({ measured: tw(t3, 1.55, 1.75), calc: tw(t3, 2.05, 2.25), values: tw(t3, 2.05, 2.25), pulse: pulseAt(t4, 0.1, 1.2), q: tw(t4, 0.9, 1.1) });
    };
  },
};

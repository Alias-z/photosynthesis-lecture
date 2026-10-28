// Slide 13 · Chlorophyll fluorescence, staging C: the real PAM trace plays (figure v3 of the slide, Ruban 2016 Fig. 1A,
// recorded left to right) while the photosystem II population beside it (the dot grid of figure v5) changes state with it:
// open centres white, closed red, quenching antennae black; every saturating pulse closes all non-quenching centres
// (beats PP13_TRACE). The shares of closed and quenching centres follow the trace by eye; the pattern is illustrative.
// - Beat 1: measuring light on: F_o, all centres open.
// - Beat 2: the saturating pulse: F_m, all centres closed.
// - Beat 3: actinic light: the trace peaks (centres closed) and settles at F_s while quenching grows; the pulses reach
//   only F_m′ (non-quenching centres closed).
// - Beat 4: actinic light off: quenching relaxes over the dark pulses, the peaks recover towards F_m (not all the way).
import { lab, lerp, setters, smooth } from './pp-stage';
import { drawGrid, drawLamps, drawRuban, gridSvg, inPulse, lampsSvg, RUBAN_ACT, RUBAN_ML, rubanSvg } from './pp13-common';
import { PP13_TRACE } from './beats-pp';
import type { Staging } from './types';

const P = 'pp13c';
const RB = rubanSvg(P, 'rb', 16, 4, 980);
const GX = 1190, GY = 130;

/** Quenching share and closed share (of all centres) along the trace (image px u). */
const quench = (u: number): number => (u < 150 ? 0 : u <= RUBAN_ACT[1] ? 0.48 * smooth((u - 150) / 150) : 0.12 + 0.36 * Math.exp(-(u - RUBAN_ACT[1]) / 90));
const closed = (u: number): number => (u < RUBAN_ACT[0] || u > RUBAN_ACT[1] ? 0 : u < 158 ? smooth((u - RUBAN_ACT[0]) / 15) : 0.3 + 0.7 * Math.exp(-(u - 158) / 30));

/* ---------------------------------------------------------------- timing: the trace position per beat */

const STEPS: Array<[number, number, number, number]> = [[52, 92, 0.1, 0.7], [92, 104, 0.1, 0.5], [104, 410, 0.1, 2.4], [410, 728, 0.1, 2.4]];
const TEND = STEPS.map(s => s[2] + s[3] + 0.2);

export const STAGING: Staging = {
  id: 'c',
  name: 'C · Real trace + photosystem II population',
  note: 'The real PAM trace (figure v3) is recorded live while a grid of photosystem II centres beside it flips open / closed / quenching at every pulse (figure v5 in motion).',
  beats: PP13_TRACE,
  holds: [[0], [], [], []],
  svg: () => `${RB.svg}
    ${lab('photosystem II in the leaf', 'ppa-t', GX - 22, GY - 50)}
    ${gridSvg('rc', GX, GY)}
    ${lampsSvg('lamps', GX - 22, 548)}`,

  bind(stage) {
    const S = setters(stage), { q, op } = S;
    let last = '';
    return (beatIn, t) => {
      const b = Math.max(0, Math.min(3, Math.round(beatIn)));
      const tt = Math.max(0, Math.min(t, TEND[b]));
      const key = `${b}:${tt.toFixed(3)}`;
      if (key === last) return;
      last = key;
      const [u0, u1, t0, d] = STEPS[b];
      const u = lerp(u0, u1, Math.max(0, Math.min(1, (tt - t0) / d)));
      op(q('rb'), 1);
      drawRuban(S, 'rb', RB, u);
      drawGrid(S, 'rc', quench(u), closed(u), inPulse(u));
      drawLamps(S, 'lamps', [u >= RUBAN_ML ? 1 : 0, u >= RUBAN_ACT[0] && u <= RUBAN_ACT[1] ? 1 : 0, inPulse(u) ? 1 : 0]);
    };
  },
};

// C12, staging C · Real images: the slide's maize figures, each exactly as C12 draws it, in the slide's card. Beat 1: the
// Hatch & Slack card over the maize section. Beat 2: C12 v1 (maize leaf section, Kranz wreaths), then (hold) the camera
// dives into one bundle. Beat 3: at the end of the dive the same piece of micrograph is C12 v2 (one bundle with the pump drawn
// on it), so the swap is seamless; the pump runs on the photo, with the CO₂ readout. Beat 4: 2 ATP are spent per round
// (hold), then the Ehleringer & Björkman graph (C12 v6) draws itself.
import { CC12 } from './beats-cc';
import { drawFlyers, flyersSvg } from './cc11-common';
import { atp, backFlyers, drawAtp, ebCard, fig12, hatchCard, pumpFlyers } from './cc12-common';
import { camera, clock, glyph, onStage, pop, readout, setters, slideCard, SLIDE, tfStr, tw, type Tf, type V } from './cc-anim-kit';
import type { Staging } from './types';

const P = 'a12c';
/** v1 shows the maize image (1400 px) 772 wide at (14, 96) from y 20; v2 shows its window (500, 150, 500, 450) 540 wide at
 *  (130, 30). The dive puts that window of v1 exactly where v2 shows it at the slide's size. */
const S1 = 772 / 1400, S2 = 540 / 500;
const W1: [number, number, number, number] = [14 + 500 * S1, 96 + 130 * S1, 500 * S1, 450 * S1];
const DIVE: Tf = (() => { const s = (540 * SLIDE.s) / W1[2]; return { s, t: [SLIDE.t[0] + 130 * SLIDE.s - s * W1[0], SLIDE.t[1] + 30 * SLIDE.s - s * W1[1]] }; })();
const at2 = (u: number, v: number): V => [130 + (u - 500) * S2, 30 + (v - 150) * S2];
const B1 = { card: 0, reveal: [0.4, 1.8] as V, labs: 1.9, end: 2.3 };
const B2 = { out: 0, hold: 0.5, cam: 0.55, camD: 1.2, end: 1.9 };
const B3 = { swap: 0, t0: 0.6, end: 4.9 };
const B4 = { t0: 0.1, atp: [1.15, 1.6], cost: 1.3, hold: 2.4, card: 2.5, reveal: [2.75, 4.0] as V, end: 4.3 };
const TEND = [B1.end, B2.end, B3.end, B4.end];

export function build(): Staging {
  const v1 = fig12('v1', 'fcc12a', `${P}a`), v2 = fig12('v2', 'fcc12b', `${P}b`);
  // v2's drawn pump: CO₂ above the mesophyll cell → PEPC → C₄ acid → bundle sheath, where CO₂ meets RuBisCO
  const m = at2(560, 236), bs = at2(640, 318);
  const pump = pumpFlyers(`${P}p`, 2, {
    co2: [[m[0] - 2, m[1] - 70], [m[0] - 2, m[1] - 36], [m[0] - 2, m[1] - 2]],
    acid: [[m[0] + 30, m[1] + 18], [m[0] + 58, m[1] + 30], [bs[0] - 26, bs[1] - 30], [bs[0] - 2, bs[1] - 4]],
    rel: [[[bs[0] + 2, bs[1]], [bs[0] + 14, bs[1] + 14], [bs[0] + 20, bs[1] + 30]], [[bs[0] + 2, bs[1]], [bs[0] + 24, bs[1] + 6], [bs[0] + 40, bs[1] + 14]]],
  }, { t0: B3.t0, r: 10 });
  const back = backFlyers(`${P}b`, 3, [[bs[0] - 8, bs[1] + 10], [bs[0] - 40, bs[1] + 20], [m[0] + 40, m[1] + 60], [m[0] + 6, m[1] + 34]], { t0: B4.t0, r: 10 });
  const atpAt = onStage(SLIDE, [m[0] - 10, m[1] + 74]);
  const hc = hatchCard(`${P}h`, B1), eb = ebCard(`${P}e`, { reveal: B4.reveal });
  const ro = readout(`${P}ro`, 24, 120, 296, 'CO₂ (µmol mol⁻¹)', [
    { label: ['mesophyll'], value: '≈ 100' },
    { label: ['bundle sheath'], value: '≈ 1500', cls: 'cca-co2c' },
    { label: ['PEP costs'], value: '2 ATP' },
  ]);

  // the rest of the micrograph fades as the camera reaches the window that v2 shows
  const [wx, wy, ww, wh] = W1;
  const surround = [[-400, -400, wx + 400, 1400], [wx + ww, -400, 1400, 1400], [wx, -400, ww, wy + 400], [wx, wy + wh, ww, 1400]]
    .map(([x, y, w, h]) => `<rect class="cca-veil" x="${x}" y="${y}" width="${w}" height="${h}"/>`).join('');

  return {
    id: 'c',
    name: 'C · Real images (maize)',
    note: 'On the slide’s maize micrographs: the leaf section (v1), a dive into one bundle that becomes v2 with the pump drawn on the photo, the pump running there, 2 ATP, the crossover.',
    beats: CC12,
    holds: [[], [B2.hold], [], [B4.hold]],
    svg: () => `
      <g data-k="cam"><g class="fig fcc">${slideCard(P)}<g data-k="w1">${v1}</g><g data-k="${P}-surr" opacity="0">${surround}</g></g></g>
      <g data-k="cam2" opacity="0" transform="${tfStr(SLIDE)}"><g class="fig fcc">${slideCard(`${P}2`)}<g data-k="w2">${v2}</g></g></g>
      <g class="fig fcc">
        <g data-k="${P}-ro-w" opacity="0">${ro}</g>
        ${flyersSvg(pump)}${flyersSvg(back)}${[0, 1].map(j => glyph(`${P}-atp${j}`, atp()) + glyph(`${P}-atq${j}`, atp())).join('')}
        ${hc.svg}${eb.svg}
      </g>`,

    bind(stage) {
      const S = setters(stage), w1 = S.q('w1');
      const pills1 = Array.from(w1.querySelectorAll('.fcc-ldh, .fcc-ldk, .fcc-tip, .fcc-pill, .fcc-pt, .fcc-b, .fcc-cr'));
      let last = '';
      return (beatIn, t) => {
        const b = Math.max(0, Math.min(3, Math.round(beatIn))), tt = Math.max(0, Math.min(t, TEND[b]));
        const key = `${b}:${tt.toFixed(3)}`;
        if (key === last) return;
        last = key;
        const T = clock(b, tt);
        // the dive into v1, then v2 in its place at the slide's size
        const cam = camera([SLIDE, DIVE], [[1, B2.cam, B2.camD]], T);
        S.set(S.q('cam'), 'transform', tfStr(cam));
        const dive = b === 1 ? pop(tt, B2.cam) : b >= 2 ? 1 : 0;
        pills1.forEach(el => S.op(el, 1 - dive));
        S.op(S.q(`${P}-surr`), b === 1 ? tw(tt, B2.cam + 0.6, B2.cam + B2.camD) : b >= 2 ? 1 : 0);
        S.op(S.q('cam'), 1 - (b >= 2 ? (b > 2 ? 1 : pop(tt, B3.swap)) : 0));
        S.op(S.q('cam2'), b > 2 ? 1 : b === 2 ? pop(tt, B3.swap) : 0);
        const toStage = (p: V): V => onStage(SLIDE, p);

        hc.draw(S, T(0), b === 0 ? pop(tt, B1.card) : b === 1 ? 1 - pop(tt, B2.out) : 0);
        const ebv = b === 3 ? pop(tt, B4.card) : 0;
        S.op(S.q(`${P}-ro-w`), (b === 2 ? pop(tt, B3.swap + 0.3) : b === 3 ? 1 : 0) * (1 - ebv));
        S.op(S.q(`${P}ro-r2`), pop(T(3), B4.cost));
        drawFlyers(S, pump, T, toStage, b === 2 ? 1 : 0);
        drawFlyers(S, back, T, toStage, 1 - ebv);
        drawAtp(S, `${P}-atp`, atpAt, b === 3 ? tt : -9, B4.atp[0]);
        drawAtp(S, `${P}-atq`, atpAt, b === 3 ? tt : -9, B4.atp[1]);
        eb.draw(S, T(3), ebv);
      };
    },
  };
}

export const STAGING = build();

// C12, staging B · History first, on the slide's own figures (each exactly as C12 draws it, in the slide's card):
// beat 1 v5 (Hatch & Slack 1966 Fig. 2 scan, drawing itself) beside their clipping; beat 2 v4 (Haberlandt 1904 drawing) with
// his halftone portrait, then (hold) v1 (maize leaf section); beat 3 v3 (the two-cell cycle) with the pump running; beat 4
// pyruvate returns and 2 ATP are spent (hold), then v6 (Ehleringer & Björkman 1977) draws itself.
import { CC12 } from './beats-cc';
import { drawFlyers, flyersSvg } from './cc11-common';
import { atp, backFlyers, drawAtp, fig12, pumpFlyers } from './cc12-common';
import { camera, clipping, clock, cutPath, f1, glyph, kOf, onStage, pop, setters, slideCard, SLIDE, textScaler, tfStr, tw, tx, type Tf, type V } from './cc-anim-kit';
import type { Staging } from './types';
import haberlandt from '../../assets/anim/cc12/haberlandt.png';

const P = 'a12b';
const VB: Tf = { s: 0.9, t: [1540 - 0.9 * 800, 370 - 0.9 * 300] };
const B1 = { reveal: [0.3, 1.7] as V, labs: 1.8, end: 2.2 };
const B2 = { swap: 0.05, hold: 1.0, swap2: 1.1, cam: 1.15, camD: 1.0, end: 2.4 };
const B3 = { swap: 0.05, t0: 0.5, end: 4.9 };
const B4 = { t0: 0.1, atp: [1.15, 1.6], hold: 2.4, swap: 2.5, reveal: [2.8, 4.0] as V, end: 4.3 };
const TEND = [B1.end, B2.end, B3.end, B4.end];
/** v5's scan: shot at (40, 30), 560 wide, of the 694 px scan; its plot runs from x 122 to 640 px of the scan. */
const K5 = 560 / 694;

export function build(): Staging {
  const v5 = fig12('v5', 'fcc12e', `${P}e`), v4 = fig12('v4', 'fcc12d', `${P}d`), v1 = fig12('v1', 'fcc12a', `${P}a`);
  const v3 = fig12('v3', 'fcc12c', `${P}c`), v6 = fig12('v6', 'fcc12f', `${P}f`);
  // v3 (drawn after Sage 2012 Fig. 1): CO₂ → HCO₃⁻ → PEP carboxylase → C₄ acid → CO₂ at Rubisco; pyruvate → PEP
  const pump = pumpFlyers(`${P}p`, 2, {
    co2: [[70, 186], [150, 186], [190, 214], [190, 256]],
    acid: [[300, 276], [420, 276], [504, 276]],
    rel: [[[560, 300], [560, 340], [578, 380]], [[560, 300], [566, 340], [600, 384]]],
  }, { t0: B3.t0, r: 11 });
  const back = backFlyers(`${P}b`, 3, [[500, 300], [455, 326], [420, 376], [350, 424], [270, 440], [200, 440], [160, 426], [145, 372], [168, 300]], { t0: B4.t0, r: 11 });
  const clip = clipping(P, 52, 70, 690, {
    journal: 'Biochemical Journal · 1966',
    title: ['Photosynthesis by sugar-cane leaves.', 'A new carboxylation reaction and the', 'pathway of sugar formation'],
    authors: 'M. D. Hatch and C. R. Slack', rot: -1.2,
  });
  const facts = `${tx(80, 384, 'sugarcane leaves in ¹⁴CO₂, after ≈ 1 s:', 'cca-l', 'start')}${tx(80, 456, '&gt; 93 %', 'cca-big cca-c4c', 'start')}
    ${tx(80, 496, 'of the fixed ¹⁴C in four-carbon acids', 'cca-l', 'start')}${tx(80, 528, '(malate, aspartate, oxaloacetate)', 'cca-s', 'start')}`;
  const portrait = `<g transform="rotate(-1.5 330 360)">
    <path class="clip-paper" d="${cutPath(70, 96, 560, 470, 29, 3.2)}"/>
    <image href="${haberlandt}" x="96" y="124" width="240" height="300" preserveAspectRatio="xMidYMid slice"/>
    ${tx(476, 230, 'Gottlieb', 'clip-name cca-port', 'middle')}${tx(476, 272, 'Haberlandt', 'clip-name cca-port', 'middle')}
    ${tx(476, 326, '1904', 'clip-find cca-port-y', 'middle')}
    ${tx(96, 474, '“Kranztypus”: wreath type', 'cca-b', 'start')}
    ${tx(96, 512, 'Physiologische Pflanzenanatomie, 3rd edn', 'cca-it', 'start')}
    ${tx(96, 548, 'portrait c. 1890, public domain (Univ. Graz)', 'cca-cr', 'start')}</g>`;

  return {
    id: 'b',
    name: 'B · History first (slide figures)',
    note: 'Hatch & Slack’s graph draws itself beside their clipping; Haberlandt’s Kranz drawing with his portrait, then the maize section; the pump on the two-cell drawing; 2 ATP; the 30 °C crossover.',
    beats: CC12,
    holds: [[], [B2.hold], [], [B4.hold]],
    svg: () => `
      <g data-k="cam"><g class="fig fcc">${slideCard(P)}
        <g data-k="w5">${v5}<rect data-k="${P}-cov5" class="cca-cover" x="${f1(40 + 122 * K5)}" y="26" width="${f1(518 * K5 + 4)}" height="${f1(568 * K5)}"/></g>
        <g data-k="w4" opacity="0">${v4}</g><g data-k="w1" opacity="0">${v1}</g><g data-k="w3" opacity="0">${v3}</g>
        <g data-k="w6" opacity="0">${v6}<rect data-k="${P}-cov6" class="cca-cover" x="122" y="30" width="660" height="436"/></g>
      </g></g>
      <g class="fig fcc">
        <g data-k="${P}-clip">${clip.svg}${facts}</g>
        <g data-k="${P}-port" opacity="0">${portrait}</g>
        ${flyersSvg(pump)}${flyersSvg(back)}${[0, 1].map(j => glyph(`${P}-atp${j}`, atp()) + glyph(`${P}-atq${j}`, atp())).join('')}
      </g>`,

    bind(stage) {
      const S = setters(stage), w5 = S.q('w5'), w4 = S.q('w4'), w1 = S.q('w1'), w3 = S.q('w3'), w6 = S.q('w6');
      const scale = textScaler(S.q('cam'), S);
      const pills5 = Array.from(w5.querySelectorAll('.fcc-pill-t, .fcc-ldh, .fcc-ldk, .fcc-tip, .fcc-pt, text.fcc-s'));
      let last = '';
      return (beatIn, t) => {
        const b = Math.max(0, Math.min(3, Math.round(beatIn))), tt = Math.max(0, Math.min(t, TEND[b]));
        const key = `${b}:${tt.toFixed(3)}`;
        if (key === last) return;
        last = key;
        const T = clock(b, tt);
        const cam = camera([VB, SLIDE], [[1, B2.cam, B2.camD]], T);
        S.set(S.q('cam'), 'transform', tfStr(cam));
        scale(kOf(cam.s));
        const toStage = (p: V): V => onStage(cam, p);

        // which slide figure shows
        const s4 = pop(T(1), B2.swap) * (1 - pop(T(1), B2.swap2)), s1 = pop(T(1), B2.swap2) * (1 - pop(T(2), B3.swap));
        const s3 = pop(T(2), B3.swap) * (1 - pop(T(3), B4.swap)), s6 = pop(T(3), B4.swap);
        S.op(w5, 1 - pop(T(1), B2.swap));
        S.op(w4, s4); S.op(w1, s1); S.op(w3, s3); S.op(w6, s6);

        // beat 1: the clipping; the graph draws itself, then its labels
        const u = tw(T(0), B1.reveal[0], B1.reveal[1]);
        S.set(S.q(`${P}-cov5`), 'x', f1(40 + (122 + 518 * u) * K5));
        S.set(S.q(`${P}-cov5`), 'width', f1(518 * (1 - u) * K5 + 4 * (1 - u)));
        pills5.forEach(el => S.op(el, pop(T(0), B1.labs)));
        S.op(S.q(`${P}-clip`), 1 - pop(T(1), B2.swap));
        S.op(S.q(`${P}-port`), pop(T(1), B2.swap + 0.1) * (1 - pop(T(1), B2.swap2)));

        // beats 3–4: the pump on v3, then pyruvate back with 2 ATP each
        drawFlyers(S, pump, T, toStage, b === 2 ? 1 : 0);
        drawFlyers(S, back, T, toStage, 1 - s6);
        const at = toStage([70, 446]);
        drawAtp(S, `${P}-atp`, at, b === 3 ? tt : -9, B4.atp[0]);
        drawAtp(S, `${P}-atq`, at, b === 3 ? tt : -9, B4.atp[1]);

        // v6 draws itself
        const v = tw(T(3), B4.reveal[0], B4.reveal[1]);
        S.set(S.q(`${P}-cov6`), 'x', f1(122 + 660 * v));
        S.set(S.q(`${P}-cov6`), 'width', f1(660 * (1 - v)));
      };
    },
  };
}

export const STAGING = build();

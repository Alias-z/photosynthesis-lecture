// C11, staging D · Side by side: three of the slide's own figures, each exactly as C11 draws it, in the slide's card.
// Beat 1–2: C11 v3 (rice vs tobacco wall, drawn after Busch 2020 Fig. 2): the camera moves in on both; CO₂ leaves the
// mitochondria on both sides at once. In rice every CO₂ must cross a chloroplast; in tobacco the CO₂ from the mitochondrion
// under a gap leaves directly (the drawn proportions illustrate the mechanism; no refixation was measured in tobacco, so
// no counter is shown). Beat 3: C11 v4 (Busch 2013 Fig. 5a, redrawn) with rice, tobacco
// and Rubisco alone ringed. Beat 4: C11 v6 (C₃ cell → C₂ leaf) with the trap and glycine moving together. Beat 5: v6 moves
// aside for the Flaveria series.
import { draw as drawC11 } from '../figs/cc11';
import { CC11_SIDE } from './beats-cc';
import { c3Trap, drawFlyers, flaveria, flyersSvg, glyFlyers } from './cc11-common';
import {
  camera, clock, fit, glyph, kOf, label, onStage, pop, put, readPanel, setters, slideCard, SLIDE, strip, textScaler, tfStr,
  type Tf, type V,
} from './cc-anim-kit';
import type { Staging } from './types';

const P = 'a11d';
const VS = fit([14, 56, 772, 470], [40, 20, 1520, 700]);
const VOUT: Tf = { s: 0.98, t: [70.4, 370 - 0.98 * 300] };
const B1 = { cam: 0.05, camD: 1.0, labs: 1.05, end: 1.4 };
const B2 = { t0: 0.1, step: 0.26, end: 4.0 };
const B3 = { cam: 0.0, camD: 0.9, swap: 0.1, rings: [0.9, 1.2, 1.5], end: 2.2 };
const B4 = { swap: 0.1, t0: 0.6, gly: 0.8, end: 4.0 };
const B5 = { cam: 0.05, camD: 1.15, strip: 1.3, end: 2.7 };
const TEND = [B1.end, B2.end, B3.end, B4.end, B5.end];

const fig = (id: string, from: string, to: string): string => strip(drawC11(id)).split(from).join(to);
/** Busch 2013 Fig. 5a as v4 draws it: cover (%) → x, C* → y. */
const X4 = (s: number): number => 130 + s * 6.1, Y4 = (c: number): number => 470 - (c - 44) * 25;

export function build(): Staging {
  const v3 = fig('v3', 'fcc11c', `${P}c`), v4 = fig('v4', 'fcc11d', `${P}d`), v6 = fig('v6', 'fcc11f', `${P}f`);
  const g3 = readPanel(v3), g6 = readPanel(v6);
  // v3: rice (left) and tobacco (right), each with two mitochondria; the wall at the top of each cell
  const walls = g3.rects['fcc-wall'].sort((a, b) => a[0] - b[0]);
  const mt = g3.mt.map((m): V => [m.x, m.y]).sort((a, b) => a[0] - b[0]);
  const cpY = g3.cp[0].y;
  const rice = c3Trap(`${P}r`, 1, { mito: [mt[0], mt[1]], cpY, wallY: walls[0][1], airY: walls[0][1] - 66, t0: B2.t0, step: B2.step, r: 11 });
  // tobacco: even CO₂ from the mitochondrion under the gap (straight out), odd from the one under a chloroplast
  const tob = c3Trap(`${P}b`, 1, { mito: [mt[2], mt[3]], cpY, wallY: walls[1][1], airY: walls[1][1] - 66, t0: B2.t0, step: B2.step, hit: [3, 7], r: 11 });
  // v6: the rice section and the C₂ cells together, at the slide's size
  const w6 = g6.rects['fcc-wall'][0], c6 = g6.cp.filter(c => c.rot === 0 && c.x < 340);
  const m6: V[] = g6.mt.map((m): V => [m.x, m.y]).sort((a, b) => a[0] - b[0]);
  const trap6 = c3Trap(`${P}s`, 3, { mito: m6, cpY: c6[0].y, wallY: w6[1], airY: w6[1] - 58, t0: B4.t0, step: 0.3, r: 8, d: 1.0 });
  const bs = g6.rects['fcc-bs'][0], gr = /M([\d.]+),([\d.]+) H([\d.]+)/.exec(g6.paths['fcc-r fcc-r-g'][0])!;
  const mOn = g6.mtOn.map((m): V => [m.x, m.y]).sort((a, b) => a[1] - b[1]);
  const cpBs = g6.cp.filter(c => c.x > bs[0]).map((c): V => [c.x, c.y]).sort((a, b) => a[1] - b[1]);
  const gly = glyFlyers(`${P}g`, 3, { from: [+gr[1], +gr[2]], to: [+gr[3] - 8, +gr[2]], mito: [mOn[1], mOn[mOn.length - 2]],
    cp: [[cpBs[0][0] + 4, cpBs[0][1] + 18], [cpBs[cpBs.length - 1][0] + 4, cpBs[cpBs.length - 1][1] - 18]], t0: B4.gly, rb: 8, rc: 8 });
  const fl = flaveria(`${P}fl`, 1012, 18, 240);

  // labels of the close view on v3 (stage px)
  const a = (p: V): V => onStage(VS, p);
  const rc = g3.cp.filter(c => c.x < 400).sort((x, y) => x.x - y.x), tc = g3.cp.filter(c => c.x > 400).sort((x, y) => x.x - y.x);
  const gapX = (tc[0].x + tc[1].x) / 2, strX = (rc[0].x + rc[1].x) / 2;
  const labs = [
    label(...a([strX + 20, walls[0][1] - 44]), 'stromule', { to: a([strX, walls[0][1] + 7]) }),
    label(...a([gapX + 64, walls[1][1] - 44]), 'gap', { to: a([gapX, walls[1][1] + 10]) }),
  ].join('');
  // v4: rings round rice, tobacco and Rubisco alone
  const pts: V[] = [[X4(98.9), Y4(45.9)], [X4(61), Y4(51.4)], [X4(0), Y4(57.2)]];

  return {
    id: 'd',
    name: 'D · Side by side',
    note: 'Rice next to tobacco on the slide’s v3 (CO₂ on both sides at once), the six-species data (v4), then C₃ next to C₂ on v6 with the Flaveria series.',
    beats: CC11_SIDE,
    svg: () => `
      <g data-k="cam"><g class="fig fcc">${slideCard(P)}
        <g data-k="w3">${v3}</g><g data-k="w4" opacity="0">${v4}</g><g data-k="w6" opacity="0">${v6}</g>
      </g></g>
      <g class="fig fcc">
        <g data-k="${P}-l" opacity="0">${labs}</g>
        ${pts.map((_, i) => glyph(`${P}-ring${i}`, '<circle class="cca-hl" r="22"/>')).join('')}
        ${flyersSvg(rice)}${flyersSvg(tob)}${flyersSvg(trap6)}${flyersSvg(gly)}${fl.svg}
      </g>`,

    bind(stage) {
      const S = setters(stage), w3 = S.q('w3'), w4 = S.q('w4'), w6 = S.q('w6');
      const scale3 = textScaler(w3, S);
      let last = '';
      return (beatIn, t) => {
        const b = Math.max(0, Math.min(4, Math.round(beatIn))), tt = Math.max(0, Math.min(t, TEND[b]));
        const key = `${b}:${tt.toFixed(3)}`;
        if (key === last) return;
        last = key;
        const T = clock(b, tt);
        const cam = camera([SLIDE, VS, SLIDE, VOUT], [[0, B1.cam, B1.camD], [2, B3.cam, B3.camD], [4, B5.cam, B5.camD]], T);
        S.set(S.q('cam'), 'transform', tfStr(cam));
        scale3(kOf(cam.s));
        const toStage = (p: V): V => onStage(cam, p);

        // v3: rice and tobacco
        const s4 = pop(T(2), B3.swap) * (1 - pop(T(3), B4.swap)), s6 = pop(T(3), B4.swap);
        S.op(w3, 1 - pop(T(2), B3.swap));
        S.op(w4, s4);
        S.op(w6, s6);
        S.op(S.q(`${P}-l`), pop(T(0), B1.labs) * (1 - pop(T(2), 0)));
        const on3 = b <= 1 ? 1 : 1 - pop(T(2), 0);
        drawFlyers(S, rice, T, toStage, on3);
        drawFlyers(S, tob, T, toStage, on3);

        // v4: the three points ringed one by one
        pts.forEach((p, i) => put(S, `${P}-ring${i}`, toStage(p), b === 2 ? pop(tt, B3.rings[i]) : 0));

        // v6: the trap and glycine together; then the Flaveria series
        drawFlyers(S, trap6, T, toStage, b === 3 ? 1 : 0);
        drawFlyers(S, gly, T, toStage, b === 3 ? 1 : 0);
        fl.draw(S, T(4), B5.strip);
      };
    },
  };
}

export const STAGING = build();

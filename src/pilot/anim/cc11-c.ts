// C11, staging C · Real images: the slide's own real-image figures, each exactly as C11 draws it, in the slide's figure card.
// Beat 1: C11 v1 (rice mesophyll TEMs, Busch et al. 2013 Fig. 4 c, d). Beat 2: the camera zooms into the close-up; CO₂
// from the mitochondrion crosses the chloroplast on its way to the air space, and 3 of 10 are refixed (readout 29 %).
// Beat 3: the 2013 measurement card. Beat 4: C11 v8 (glycine decarboxylase immunostain, C₃ vs C₂ Flaveria), with glycine
// moving to the bundle sheath in its C₂ drawing. Beat 5: C11 v7 (Flaveria bundle-sheath TEMs), revealed C₃ → C₄.
import { draw as drawC11 } from '../figs/cc11';
import { CC11 } from './beats-cc';
import { caught, drawFlyers, flyersSvg, glyFlyers, M, method, type Flyer } from './cc11-common';
import { clock, co2G, fit, kOf, label, mv, onStage, pop, readout, setters, slideCard, SLIDE, strip, textScaler, tfStr, tween, type V } from './cc-anim-kit';
import type { Staging } from './types';

const P = 'a11c';
/** TEM d in C11 v1: shot at (406, 116), 380 wide, window from (30, 30) of the 504 px image. */
const D = (u: number, v: number): V => [406 + (u - 30) * (380 / 474), 116 + (v - 30) * (380 / 474)];
const VZ = fit([406, 116, 380, 380], [400, 34, 720, 672]);
const B1 = { end: 0.4 };
const B2 = { zoom: 0.05, zoomD: 1.05, labs: 1.1, hold: 1.4, t0: 1.5, step: 0.24, up: 4.55, end: 5.1 };
const B4 = { out: 0, swap: 0.15, gly: 0.9, end: 3.7 };
const B5 = { swap: 0.1, reveal: 0.5, end: 2.0 };
const TEND = [B1.end, B2.end, M.end, B4.end, B5.end];

/** The slide figure's id prefix replaced, so that its clip paths and markers never clash with the slide on the page. */
const fig = (id: string, from: string, to: string): string => strip(drawC11(id)).split(from).join(to);

export function build(): Staging {
  const v1 = fig('v1', 'fcc11a', `${P}a`), v8 = fig('v8', 'fcc11h', `${P}h`), v7 = fig('v7', 'fcc11g', `${P}g`);
  // the CO₂ path on the close-up: from the mitochondrion inside the chloroplast (image px 170, 300) through the
  // chloroplast (C) to the air space (IAS), bottom left
  const jit = [-5, 4, -2, 6, -4, 2, -6, 5, 0, -3];
  const trap: Flyer[] = jit.map((j, i) => {
    const hit = [1, 4, 8].includes(i), o = (u: number, v: number): V => D(u + j, v - j * 0.6);
    return {
      k: `${P}t-co${i}`, glyph: co2G(13), beat: 1, t0: B2.t0 + i * B2.step, d: hit ? 0.85 : 1.15, fade: hit ? 0.4 : undefined, out: hit ? undefined : 0.3,
      path: hit ? [o(170, 296), o(142, 326), o(114, 356)] : [o(170, 296), o(142, 326), o(108, 364), o(78, 400), o(46, 446)],
    };
  });
  const hits = trap.filter(f => f.fade).length;
  // v8's C₂ drawing (mini at x 438, y 430): mesophyll → bundle-sheath mitochondria (dark, with glycine decarboxylase)
  const gly = glyFlyers(`${P}g`, 3, { from: [520, 482], to: [664, 482], mito: [[692, 456], [692, 508]], cp: [[662, 452], [662, 512]], t0: B4.gly, rb: 10, rc: 10 })
    .map(f => (f.k.includes('-c') ? { ...f, fade: undefined } : f));
  const meth = method(`${P}m`, 2);
  const at = (u: number, v: number): V => onStage(VZ, D(u, v));
  const labZ = [
    label(250, 110, 'mitochondrion', { to: at(300, 112) }),
    label(250, 270, 'peroxisome', { to: at(146, 196) }),
    label(250, 390, 'mitochondrion', { to: at(176, 292) }),
    label(250, 510, 'chloroplast', { to: at(92, 352) }),
    label(250, 640, 'air space', { to: at(50, 446) }),
  ].join('');
  const ro = readout(`${P}ro`, 1150, 150, 420, 'rice, 30 °C', [
    { label: ['CO₂ from the mitochondria', 'refixed inside the cell'], value: '0 %', cls: 'cca-co2c' },
    { label: ['net CO₂ uptake'], value: '+11 %' },
  ]);
  // v7's four micrographs, uncovered one by one (cells at x 40 | 300, y 48 | 336, 236 wide, name above)
  const covers = [[40, 48], [300, 48], [40, 336], [300, 336]].map(([x, y], i) =>
    `<rect data-k="${P}-cov${i}" class="cca-cover" x="${x - 6}" y="${y - 40}" width="250" height="${i < 2 ? 286 : 286}"/>`).join('');

  return {
    id: 'c',
    name: 'C · Real images (slide figures)',
    note: 'On the slide’s own micrographs: rice TEM (v1) with the CO₂ path on the close-up, the 2013 measurement card, the glycine decarboxylase stain (v8), the Flaveria TEMs (v7).',
    beats: CC11,
    holds: [[], [B2.hold], [M.hold], [], []],
    svg: () => `
      <g data-k="cam"><g class="fig fcc">${slideCard(P)}
        <g data-k="w1">${v1}<rect data-k="${P}-veil" class="cca-cover" x="0" y="60" width="400" height="560" opacity="0"/></g><g data-k="w8" opacity="0">${v8}</g><g data-k="w7" opacity="0">${v7}${covers}</g>
      </g></g>
      <g class="fig fcc">
        <g data-k="${P}-lz" opacity="0">${labZ}</g><g data-k="${P}-ro-w" opacity="0">${ro}</g>
        ${flyersSvg(trap)}${flyersSvg(gly)}
        ${meth.svg}
      </g>`,

    bind(stage) {
      const S = setters(stage);
      const w1 = S.q('w1'), w8 = S.q('w8'), w7 = S.q('w7');
      const scale = textScaler(w1, S);
      // the slide's own labels of v1 (pills with leaders) give way to the close view's
      const pills = Array.from(w1.querySelectorAll('.fcc-ldh, .fcc-ldk, .fcc-tip, .fcc-pill, .fcc-pt, .fcc-cr, .fcc-b'));
      let last = '';
      return (beatIn, t) => {
        const b = Math.max(0, Math.min(4, Math.round(beatIn))), tt = Math.max(0, Math.min(t, TEND[b]));
        const key = `${b}:${tt.toFixed(3)}`;
        if (key === last) return;
        last = key;
        const T = clock(b, tt);
        const z = mv(T(1), B2.zoom, B2.zoomD) * (1 - mv(T(3), B4.out, 0.6));
        const cam = tween(SLIDE, VZ, z);
        S.set(S.q('cam'), 'transform', tfStr(cam));
        scale(kOf(cam.s));
        pills.forEach(el => S.op(el, 1 - Math.min(1, z * 3)));
        S.op(S.q(`${P}-veil`), Math.min(1, z * 2));
        const toStage = (p: V): V => onStage(cam, p);

        // the close view: labels, readout, the trap (gone under the card and when the next figure comes)
        const card = b === 2 ? pop(tt, M.card) : 0;
        const inZ = pop(T(1), B2.labs - 0.1) * (1 - pop(T(3), B4.out));
        S.op(S.q(`${P}-lz`), inZ * (1 - card));
        S.op(S.q(`${P}-ro-w`), inZ * (1 - card));
        drawFlyers(S, trap, T, toStage, inZ * (1 - card));
        S.set(S.q(`${P}ro-v0`), 'text', `${Math.round((29 * caught(trap, T)) / hits)} %`);
        S.op(S.q(`${P}ro-r1`), pop(T(1), B2.up));
        meth.draw(S, T(2), card);

        // the next figures: v8 with glycine moving in its C₂ drawing, then v7 uncovered C₃ → C₄
        const s8 = pop(T(3), B4.swap) * (1 - pop(T(4), B5.swap)), s7 = pop(T(4), B5.swap);
        S.op(w1, 1 - pop(T(3), B4.swap));
        S.op(w8, s8);
        S.op(w7, s7);
        drawFlyers(S, gly, T, toStage, s8);
        [0, 1, 2, 3].forEach(i => S.op(S.q(`${P}-cov${i}`), 1 - pop(T(4), B5.reveal + i * 0.32)));
      };
    },
  };
}

export const STAGING = build();

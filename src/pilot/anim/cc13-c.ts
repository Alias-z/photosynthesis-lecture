// C13, staging C · Measured on Agave: the slide's own data figures, each exactly as C13 draws it, in the slide's card.
// Beat 1: C13 v8 (malic acid over 24 h, Agave vs Arabidopsis, Abraham et al. 2016 Fig. 1c): the dark half draws itself
// (acid rises). Beat 2: the light half draws itself (acid falls). Beat 3: C13 v2 (young C₃ leaf vs mature CAM leaf,
// Abraham Fig. 1a) draws itself. Beat 4: C13 v4 (the Agave field) moves aside for the water-use numbers (Borland 2009).
import { CC13_AGAVE } from './beats-cc';
import { fig13 } from './cc13-common';
import { clock, camera, f1, pop, setters, slideCard, SLIDE, tfStr, tw, tx, type Tf, type V } from './cc-anim-kit';
import type { Staging } from './types';

const P = 'a13c';
const XA = (t: number): number => 110 + (t / 24) * 270, XB = (t: number): number => 520 + (t / 24) * 260;
const VF: Tf = { s: 0.92, t: [40 + 0.92 * 43.3, 370 - 0.92 * 300] };
const B1 = { reveal: [0.3, 1.6] as V, end: 1.9 };
const B2 = { reveal: [0.2, 1.5] as V, end: 1.8 };
const B3 = { swap: 0.05, reveal: [0.4, 1.9] as V, end: 2.2 };
const B4 = { swap: 0.05, cam: 0.6, camD: 1.0, panel: 1.5, bars: [1.6, 2.4] as V, end: 2.7 };
const TEND = [B1.end, B2.end, B3.end, B4.end];
const WUE: Array<[string, string, number, number, string]> = [['CAM', 'agave, pineapple', 4, 10, 'cca-bar-cam'], ['C₄', 'maize, sugarcane', 1, 2, 'cca-bar-c4'], ['C₃', 'wheat, rice', 0.5, 1.5, 'cca-bar-c3']];

export function build(): Staging {
  const v8 = fig13('v8', 'fcc13h', `${P}h`), v2 = fig13('v2', 'fcc13b', `${P}b`), v4 = fig13('v4', 'fcc13d', `${P}d`);
  // covers on v8: per panel, one over the light half (0–12 h) and one over the dark half (12–24 h)
  const cov = (k: string, x0: number, x1: number): string => `<rect data-k="${P}-${k}" class="cca-cover" x="${f1(x0)}" y="126" width="${f1(x1 - x0)}" height="302"/>`;
  const covers8 = cov('aL', XA(0) + 2, XA(12)) + cov('aD', XA(12), XA(24) + 8) + cov('bL', XB(0) + 2, XB(12)) + cov('bD', XB(12), XB(24) + 8);
  const X = (v: number): number => 984 + v * 46;
  const water = `<g data-k="${P}-wue" opacity="0"><rect class="cca-ro" x="930" y="60" width="640" height="560" rx="18"/>
    ${tx(960, 108, 'CO₂ gained per water lost', 'cca-b', 'start')}${tx(960, 140, 'mmol CO₂ per mol H₂O (Borland et al. 2009, Table 2)', 'cca-s', 'start')}
    ${WUE.map(([n, ex, lo, hi, cls], i) => {
      const y = 210 + i * 130;
      return `${tx(960, y, n, 'cca-h', 'start')}${tx(1040, y, ex, 'cca-s', 'start')}
        <rect data-k="${P}-w${i}" class="${cls}" x="${f1(X(lo))}" y="${y + 18}" width="0" height="44" rx="8"/>
        <g data-k="${P}-wv${i}" opacity="0">${tx(X(hi) + 14, y + 50, `${lo}–${hi}`, 'cca-h', 'start')}</g>`;
    }).join('')}
    <path class="cca-tk" d="M${X(0)},${600 - 12} H${X(10)}"/>${[0, 2, 4, 6, 8, 10].map(v => `<path class="cca-tk" d="M${X(v)},588 v8"/>${tx(X(v), 616, `${v}`, 'cca-s')}`).join('')}</g>`;

  return {
    id: 'c',
    name: 'C · Measured on Agave',
    note: 'The slide’s Agave data: malic acid by night and by day (v8), young C₃ vs mature CAM leaf (v2), then the Agave field (v4) with the water-use numbers.',
    beats: CC13_AGAVE,
    svg: () => `
      <g data-k="cam"><g class="fig fcc">${slideCard(P)}
        <g data-k="w8">${v8}${covers8}</g>
        <g data-k="w2" opacity="0">${v2}<rect data-k="${P}-c2" class="cca-cover" x="122" y="100" width="660" height="348"/></g>
        <g data-k="w4" opacity="0">${v4}</g>
      </g></g>
      <g class="fig fcc">${water}</g>`,

    bind(stage) {
      const S = setters(stage), w8 = S.q('w8'), w2 = S.q('w2'), w4 = S.q('w4');
      const slide = (k: string, x0: number, x1: number, u: number): void => {
        S.set(S.q(`${P}-${k}`), 'x', f1(x0 + (x1 - x0) * u));
        S.set(S.q(`${P}-${k}`), 'width', f1((x1 - x0) * (1 - u)));
      };
      let last = '';
      return (beatIn, t) => {
        const b = Math.max(0, Math.min(3, Math.round(beatIn))), tt = Math.max(0, Math.min(t, TEND[b]));
        const key = `${b}:${tt.toFixed(3)}`;
        if (key === last) return;
        last = key;
        const T = clock(b, tt);
        const cam = camera([SLIDE, VF], [[3, B4.cam, B4.camD]], T);
        S.set(S.q('cam'), 'transform', tfStr(cam));
        // night first (the dark half, 12–24 h), then the day (0–12 h)
        const uD = tw(T(0), ...B1.reveal), uL = tw(T(1), ...B2.reveal);
        slide('aD', XA(12), XA(24) + 8, uD); slide('bD', XB(12), XB(24) + 8, uD);
        slide('aL', XA(0) + 2, XA(12), uL); slide('bL', XB(0) + 2, XB(12), uL);
        const s2 = pop(T(2), B3.swap) * (1 - pop(T(3), B4.swap)), s4 = pop(T(3), B4.swap);
        S.op(w8, 1 - pop(T(2), B3.swap)); S.op(w2, s2); S.op(w4, s4);
        const u2 = tw(T(2), ...B3.reveal);
        S.set(S.q(`${P}-c2`), 'x', f1(122 + 660 * u2)); S.set(S.q(`${P}-c2`), 'width', f1(660 * (1 - u2)));
        // the water numbers
        S.op(S.q(`${P}-wue`), pop(T(3), B4.panel));
        const ub = tw(T(3), ...B4.bars);
        WUE.forEach(([, , lo, hi], i) => {
          S.set(S.q(`${P}-w${i}`), 'width', f1((X(hi) - X(lo)) * ub));
          S.op(S.q(`${P}-wv${i}`), pop(T(3), B4.bars[1] - 0.1));
        });
      };
    },
  };
}

export const STAGING = build();

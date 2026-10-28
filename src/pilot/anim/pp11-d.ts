// Slide 11 · Excess light, staging D: side by side (beats PP11_PAIR). Opens on the slide 11 chain figure (c2c look); the
// chain shrinks to a map at the top, and two close-ups of photosystem II open out of it side by side: weak light
// (40 µmol photons m⁻² s⁻¹) on the left, strong light (1420) on the right, the same layout, each exit an arrow whose
// width is its measured share (oak leaves, Rodríguez-Calcerrada et al. 2008, the values of figure v8).
// - Beat 1 (one click): the two close-ups open; light waves (1 vs 4), the exits and their shares appear.
// - Beat 2: in the strong-light close-up an excitation reaches O₂, singlet O₂ forms and hits D1.
// - Beat 3: both close-ups close back into the map, which grows back into the slide figure; the damage mark stays.
import { PP11_PAIR } from './beats-pp';
import { B3, D1, drawStory, L0, L1, LIT11, shares, storySvg } from './pp11-common';
import {
  burst, chainGroup, counterScaler, drawWindow, fade, glyph, kOf, lab, mv, partsIn, putter, setters, slideCard, taggedChain,
  windowSvg, type V, type WinLayout,
} from './pp-stage';
import type { Staging } from './types';

const P = 'pp11d';
const MAP = { s: 0.26, t: [685 + 43.3 * 0.26, 14 + 30.9 * 0.26] as V };
const WIN: [number, number, number, number] = [-40, 114, 440, 289.2];
const LEFT: WinLayout = { map: { s: MAP.s, t: MAP.t }, win: WIN, R: [16, 214, 776, 510] };
const RIGHT: WinLayout = { map: { s: MAP.s, t: MAP.t }, win: WIN, R: [808, 214, 776, 510] };
/** Labels inside the narrower close-ups. */
const LABD = { stroma: [392, 140] as V, lumen: [392, 398] as V };

const D1T = { open: 0.05, openD: 1.1, exits: 1.0, labs: 1.15, end: 1.6 };
const D3T = { close: 0.1, closeD: 1.2, back: 1.0, end: 1.5 };
const TEND = [D1T.end, B3.end, D3T.end];

const title = (x: number, a: 'start' | 'end', s1: string, s2: string): string =>
  `${lab(s1, 'ppa-hd', x, 64, a)}${lab(s2, 'ppa-t', x, 98, a)}`;

export const STAGING: Staging = (() => {
  const chainM = taggedChain(`${P}m`, 'bil', LIT11), chainL = taggedChain(`${P}l`, 'bil', LIT11), chainR = taggedChain(`${P}r`, 'bil', LIT11);
  return {
    id: 'd',
    name: 'D · Side by side',
    note: 'Weak light and strong light at once: two close-ups of photosystem II open out of a map of the slide 11 chain, with the measured shares as arrow widths; singlet O₂ in the strong-light one; back into the slide figure.',
    beats: PP11_PAIR,
    holds: [[0]],
    svg: () => `
      <g data-k="map"><g class="fig">${slideCard(P)}${chainGroup('chainM', 'bil', chainM)}${glyph('mdmg', burst(20, 10))}</g></g>
      ${windowSvg(P, `${chainGroup('chainL', 'bil', chainL)}${storySvg(P, 'L', shares(L0))}`, 'L')}
      ${windowSvg(P, `${chainGroup('chainR', 'bil', chainR)}${storySvg(P, 'R', shares(L1))}`, 'R')}
      <g data-k="titles" opacity="0" display="none">
        ${title(30, 'start', 'weak light', `${L0} µmol photons m⁻² s⁻¹`)}${title(1570, 'end', 'strong light', `${L1} µmol photons m⁻² s⁻¹`)}
        ${lab('numbers: share of absorbed energy, oak leaves', 'ppa-s', 800, 206, 'middle')}</g>`,

    bind(stage) {
      const S = setters(stage), { q, op } = S, put = putter(S);
      const gM = q('chainM'), gL = q('chainL'), gR = q('chainR');
      const csM = counterScaler(gM, S), csL = counterScaler(gL, S), csR = counterScaler(gR, S);
      const covered = [gL, gR].flatMap(g => ['e-psii-pq', 'pq-h-in'].flatMap(p => partsIn(g, p)));
      let last = '';
      return (beatIn, t) => {
        const b = Math.max(0, Math.min(2, Math.round(beatIn)));
        const tt = Math.max(0, Math.min(t, TEND[b]));
        const key = `${b}:${tt.toFixed(3)}`;
        if (key === last) return;
        last = key;
        const T = (n: number): number => (b === n ? tt : b > n ? 99 : -1);
        const t1 = T(0), t2 = T(1), t3 = T(2);

        const e = mv(t1, D1T.open, D1T.openD) * (1 - mv(t3, D3T.close, D3T.closeD));
        const vL = drawWindow(S, LEFT, e, q('map'), 'L');
        const vR = drawWindow(S, RIGHT, e, q('map'), 'R', false);
        csM(1, 1 - Math.min(1, e * 1.6));
        const kL = kOf(vL.inner.s), kR = kOf(vR.inner.s);
        csL(kL); csR(kR);
        op(q('titles'), fade(e, 0.7, 0.3));
        const story = b < 2 ? 1 : 1 - fade(tt, 0.05, 0.3);
        covered.forEach(g => op(g, b < 2 ? 1 - fade(t1, 0.05, 0.3) : fade(tt, D3T.back, 0.4)));
        const st = { ex: fade(t1, D1T.exits, 0.3), lb: fade(t1, D1T.labs, 0.25), story };
        drawStory(S, 'L', kL, { ...st, L: L0, ts: -1 }, LABD);
        drawStory(S, 'R', kR, { ...st, L: L1, ts: t2 }, LABD);
        put('mdmg', D1, 1, b === 2 ? fade(tt, D3T.close + D3T.closeD - 0.3, 0.3) : 0);
      };
    },
  };
})();

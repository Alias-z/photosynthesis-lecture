// Slide 11 · Excess light, staging C: graph-led (beats PP11_GRAPH). Opens on the energy balance (the drawing of figure v3,
// after Murchie & Niyogi 2011 Fig. 1A), then shows where the excess goes in photosystem II, then where singlet oxygen forms
// on the real structures (Pospíšil 2016 Fig. 1, CC BY 4.0), and ends on the slide 11 chain figure (c2c3 look).
// - Beat 1 (opens on the empty graph; one click): a light cursor runs from 0 to 1420 µmol photons m⁻² s⁻¹; absorbed light
//   and CO₂ fixation are drawn as it passes; the gap between them fills: excess.
// - Beat 2: the graph slides to the left half; a close-up of photosystem II on the slide's chain opens on the right with
//   the three exits at their measured shares in strong light (Rodríguez-Calcerrada et al. 2008, 1420 µmol m⁻² s⁻¹).
// - Beat 3: a clipping of Pospíšil 2016 Fig. 1 covers the graph (antenna and reaction centre, O₂ → singlet O₂ marked by
//   the paper); in the close-up an excitation reaches O₂, singlet O₂ forms and hits D1.
// - Beat 4: the clipping and the graph go; the close-up grows to the stage and the camera zooms out to the whole chain:
//   the slide figure, with the damage mark on photosystem II.
import pospisilJpg from '../../assets/anim/pp11/pospisil2016-fig1.jpg';
import { PP11_GRAPH } from './beats-pp';
import { absorbed, B3, drawStory, fixed, L1, LIT11, storySvg } from './pp11-common';
import {
  chainGroup, clipping, counterScaler, f1, fade, fit, INK, kOf, lab, lerp, mv, partsIn, setters, slideCard, taggedChain, tfStr,
  tween, WHOLE, type V,
} from './pp-stage';
import type { Staging } from './types';

const P = 'pp11c';

/* ---------------------------------------------------------------- the graph (stage units, drawn at its place left of centre) */

/** Graph frame: origin, size; light 0–1500, energy 0–0.75 (the readout's scale in A and B). */
const G = { x: 100, y: 52, w: 560, h: 470 };
const GX = (q: number): number => G.x + (q / 1500) * G.w, GY = (v: number): number => G.y + G.h - (v / 0.75) * G.h;
/** The graph slides by this much in beat 2 (from centred to the left half). */
const SLIDE0 = 420, SLIDE1 = 0;
function graphSvg(): string {
  const ticks = [0, 500, 1000, 1500].map(q => `<path class="ppa-axis" d="M${GX(q)},${G.y + G.h}v8"/>${lab(`${q}`, 'ppa-s', GX(q), G.y + G.h + 30, 'middle')}`).join('');
  return `<g data-k="graph">
    <path data-k="g-ex" class="ppa-excess" d="M0,0"/>
    <path data-k="g-abs" class="ppa-line" stroke="${INK.amber}" style="stroke-width:4.4" d="M0,0"/>
    <path data-k="g-fix" class="ppa-line" stroke="${INK.green}" style="stroke-width:4.4" d="M0,0"/>
    <path class="ppa-axis" style="stroke-width:2" d="M${G.x},${G.y - 8}V${G.y + G.h}H${G.x + G.w + 10}"/>${ticks}
    ${lab('light (µmol photons m⁻² s⁻¹)', 'ppa-t', G.x + G.w / 2, G.y + G.h + 62, 'middle')}
    <text class="ppa-t" transform="translate(${G.x - 24} ${G.y + G.h / 2}) rotate(-90)" text-anchor="middle">energy per second</text>
    <path data-k="g-cur" class="ppa-cursor" d="M0,0"/>
    <g data-k="g-val"><text data-k="g-valt" class="ppa-num" x="0" y="0" text-anchor="middle">0</text></g>
    <g data-k="g-labs" opacity="0" display="none">${lab('absorbed light', 'ppa-l ppa-amber ppa-halo', GX(880), GY(absorbed(880)) - 22, 'end')}</g>
    <g data-k="g-labf" opacity="0" display="none">${lab('CO₂ fixation', 'ppa-l ppa-green ppa-halo', GX(1500), GY(fixed(1500)) + 34, 'end')}</g>
    <g data-k="g-labe" opacity="0" display="none">${lab('excess', 'ppa-big ppa-clay ppa-halo', GX(1240), GY(0.44), 'middle')}</g>
  </g>`;
}
function drawGraph(S: ReturnType<typeof setters>, L: number, dx: number, o: number): void {
  const g = S.q('graph');
  S.op(g, o);
  S.set(g, 'transform', `translate(${f1(dx)} 0)`);
  const qs = Array.from({ length: 41 }, (_, i) => (i / 40) * L);
  const pts = (fn: (q: number) => number): string => qs.map(q => `${f1(GX(q))},${f1(GY(fn(q)))}`).join('L');
  S.set(S.q('g-abs'), 'd', `M${pts(absorbed)}`);
  S.set(S.q('g-fix'), 'd', `M${pts(fixed)}`);
  S.set(S.q('g-ex'), 'd', `M${pts(absorbed)}L${[...qs].reverse().map(q => `${f1(GX(q))},${f1(GY(fixed(q)))}`).join('L')}Z`);
  S.set(S.q('g-cur'), 'd', `M${f1(GX(L))},${G.y - 4}V${G.y + G.h}`);
  S.set(S.q('g-valt'), 'text', `${Math.round(L / 10) * 10}`);
  S.set(S.q('g-val'), 'transform', `translate(${f1(GX(L))} ${G.y - 14})`);
  S.op(S.q('g-labs'), Math.max(0, Math.min(1, (L - 900) / 150)));
  S.op(S.q('g-labf'), Math.max(0, Math.min(1, (L - 1150) / 150)));
  S.op(S.q('g-labe'), Math.max(0, Math.min(1, (L - 1000) / 200)));
}

/* ---------------------------------------------------------------- the close-up (chain, c2c3 look) */

/** The figure window of the close-up and its stage rectangle (right half); at the end it grows into the whole stage. */
const WINC: [number, number, number, number] = [-40, 96, 420, 375];
const RC: [number, number, number, number] = [800, 20, 784, 700];
const LABC = { stroma: [372, 128] as V, lumen: [372, 462] as V, name: [112, 400] as V };

/* ---------------------------------------------------------------- the clipping: Pospíšil 2016, Fig. 1 */

const POSP = { href: pospisilJpg, w: 1600, h: 667 };
function cardSvg(): string {
  return clipping(P, 'card', 24, 196, 752, POSP, {
    crop: [40, 20, 1560, 640],
    credit: 'Pospíšil 2016, Front. Plant Sci. 7: 1950, Fig. 1 · CC BY 4.0',
    over: at => {
      const a = at(330, 40), b = at(1180, 40);
      return `${lab('light-harvesting antenna (LHCII)', 'ppa-l ppa-halo', a[0], a[1], 'middle')}${lab('reaction centre', 'ppa-l ppa-halo', b[0], b[1], 'middle')}`;
    },
  }).svg;
}

/* ---------------------------------------------------------------- timing (s into each beat) */

const C1 = { sweep: 0.15, sweepD: 2.5, end: 2.9 };
const C2 = { slide: 0.05, slideD: 0.9, win: 0.55, exits: 0.8, labs: 0.95, end: 1.3 };
const C4 = { out: 0.05, cam: 0.1, camD: 1.2, back: 1.0, end: 1.5 };
const TEND = [C1.end, C2.end, B3.end, C4.end];

export const STAGING: Staging = (() => {
  const chain = taggedChain(`${P}a`, 'glow', LIT11);
  return {
    id: 'c',
    name: 'C · Graph first',
    note: 'Opens on the energy balance (figure v3 drawn live), then the close-up of photosystem II with the measured shares, then the real structure of where singlet O₂ forms (Pospíšil 2016), and zooms out to the slide 11 chain.',
    beats: PP11_GRAPH,
    holds: [[0]],
    svg: () => `${graphSvg()}
      <defs><clipPath id="${P}-cc"><rect data-k="cclip" x="0" y="0" width="10" height="10" rx="18"/></clipPath>
        <filter id="${P}-csh" x="-5%" y="-5%" width="110%" height="112%"><feDropShadow dx="0" dy="8" stdDeviation="9" flood-color="#46321a" flood-opacity=".16"/></filter></defs>
      <g data-k="cbox" opacity="0" display="none"><rect data-k="cbg" class="ppa-winbg" x="0" y="0" width="10" height="10" rx="18" filter="url(#${P}-csh)"/>
        <g clip-path="url(#${P}-cc)"><g data-k="ccam"><g class="fig">${slideCard(P)}${chainGroup('chain', 'glow', chain)}${storySvg(P, '', [0.22, 0.57, 0.22])}</g></g></g>
        <rect data-k="cedge" class="ppa-winedge" x="0" y="0" width="10" height="10" rx="18"/></g>
      ${cardSvg()}`,

    bind(stage) {
      const S = setters(stage), { q, set, op } = S;
      const g = q('chain'), cs = counterScaler(g, S);
      const covered = ['e-psii-pq', 'pq-h-in'].flatMap(p => partsIn(g, p));
      let last = '';
      return (beatIn, t) => {
        const b = Math.max(0, Math.min(3, Math.round(beatIn)));
        const tt = Math.max(0, Math.min(t, TEND[b]));
        const key = `${b}:${tt.toFixed(3)}`;
        if (key === last) return;
        last = key;
        const T = (n: number): number => (b === n ? tt : b > n ? 99 : -1);
        const t1 = T(0), t2 = T(1), t3 = T(2), t4 = T(3);

        /* ---- the graph: drawn with the light (beat 1), slides left (beat 2), goes (beat 4) */
        const L = b === 0 ? lerp(0, L1, mv(tt, C1.sweep, C1.sweepD)) : L1;
        drawGraph(S, L, lerp(SLIDE0, SLIDE1, mv(t2, C2.slide, C2.slideD)), b === 2 ? 1 - fade(tt, 0, 0.25) : b === 3 ? 0 : 1);

        /* ---- the close-up: appears on the right (beat 2), grows into the whole chain (beat 4) */
        const e = mv(t4, C4.cam, C4.camD);
        const R = RC.map((v, i) => lerp(v, [0, 0, 1600, 740][i], e));
        for (const k of ['cclip', 'cbg', 'cedge']) {
          const el = q(k);
          set(el, 'x', f1(R[0])); set(el, 'y', f1(R[1])); set(el, 'width', f1(R[2])); set(el, 'height', f1(R[3]));
          set(el, 'rx', f1(lerp(18, 0, e)));
        }
        op(q('cbg'), 1 - e);
        op(q('cedge'), 1 - e);
        op(q('cbox'), fade(t2, C2.win, 0.3));
        const cam = tween(fit(WINC, RC), WHOLE, e);
        set(q('ccam'), 'transform', tfStr(cam));
        const k = kOf(cam.s);
        cs(k);
        const story = b < 3 ? 1 : 1 - fade(tt, C4.out, 0.3);
        covered.forEach(el => op(el, b < 3 ? 0 : fade(tt, C4.back, 0.4)));
        drawStory(S, '', k, { L: L1, ex: fade(t2, C2.exits, 0.3), lb: fade(t2, C2.labs, 0.25), story, ts: t3 }, LABC);

        /* ---- the clipping (beat 3) */
        op(q('card'), b === 2 ? fade(tt, 0, 0.2) : b === 3 ? 1 - fade(tt, 0, 0.25) : 0);
      };
    },
  };
})();

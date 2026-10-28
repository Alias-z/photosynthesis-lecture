// Slide 12 · Photoprotection and repair, staging D (side by side; beats PP12_PAIR of beats-pp.ts). It opens on the
// slide 12 chain figure (c2c3 look, LIT12); the first click splits it into two close-ups of the antenna of photosystem II,
// side by side under the same light:
// - Beat 1: Arabidopsis wild type (left) and the mutant without PsbS, npq4 (right). Strong light; H⁺ fill both lumens;
//   on the left two H⁺ bind PsbS, heat leaves the antenna and the fluorescence dims; on the right there is no PsbS, little
//   heat and the fluorescence stays bright. Under each, NPQ during 5 min of strong light, drawn from Li et al. 2000,
//   Fig. 1b (the values of figs/pp12f.ts v4, read off the figure).
// - Beat 2: the panels become tobacco: wild type (left) and VPZ (right; more violaxanthin de-epoxidase, PsbS and
//   zeaxanthin epoxidase), both with NPQ on. A cloud passes over both; the H⁺ leave; on the right zeaxanthin turns back
//   into violaxanthin and the heat stops; on the left zeaxanthin and heat stay. A clipping of Kromdijk et al. 2016,
//   Fig. 3A (the measured NPQ relaxation after light off, wild type vs three VPZ lines).
// - Beat 3: the clipping of the field trial (Fig. 5D) with "≈ 15 % more dry weight".
// The xanthophylls are left out of beat 1 (Li et al. 2000's point is PsbS alone).
import { PP12_PAIR } from './beats-pp';
import kr3aJpg from '../../assets/photos/13-kromdijk-3a.jpg';
import {
  chainGroup, counterScaler, f1, fade, fit, glyph, kOf, lab, lerp, lerpV, mv, onStage, putter, setters, slideCard, taggedChain, tfStr,
  WHOLE, type V,
} from './pp-stage';
import { card, drawStory, fieldCard, LIT12, MORE, PSBS, SITES, storySvg, type StoryState } from './pp12-common';
import type { Staging } from './types';

/** Li et al. 2000, Fig. 1b, the first 5 min (strong light): NPQ of the wild type and of npq4-1 (figs/pp12f.ts). */
const LT = [0, 0.5, 1, 2, 3, 4, 5];
const NPQ_WT = [0, 0.80, 1.36, 1.99, 2.27, 2.41, 2.43];
const NPQ_N4 = [0, 0.13, 0.22, 0.33, 0.41, 0.48, 0.53];
const npqAt = (ys: number[], m: number): number => {
  let i = 1;
  while (i < LT.length - 1 && LT[i] < m) i++;
  return lerp(ys[i - 1], ys[i], Math.max(0, Math.min(1, (m - LT[i - 1]) / (LT[i] - LT[i - 1]))));
};

/** The close-up window of each panel (figure units) and the panels on the stage. */
const WIN: [number, number, number, number] = [-60, 196, 440, 214.2];
const PAN: Array<[number, number, number, number]> = [[24, 64, 764, 372], [812, 64, 764, 372]];
const GR = (i: number): { x: number; y: number; w: number; h: number } => ({ x: PAN[i][0] + 96, y: 468, w: 600, h: 166 });

const B1 = { open: 0.05, openD: 1.0, cardOut: 0.3, graph: 0.9, light: 1.1, h0: 1.15, hDt: 0.06, bind: 1.7, bindD: 0.6, sweep: 1.1, sweepD: 2.2, end: 3.5 };
const B2 = { cloud: 0.2, cloudD: 1.0, lightOut: 0.8, hOut: 1.0, hDt: 0.04, back: 1.4, backD: 0.6, heatOut: 1.6, card: 2.3, end: 2.6 };
const B3 = { card: 0, end: 0.4 };
const TEND = [B1.end, B2.end, B3.end];

function panelSvg(p: string, i: number, content: string): string {
  return `<defs><clipPath id="${p}-pc${i}"><rect data-k="pc${i}" x="0" y="0" width="10" height="10" rx="16"/></clipPath></defs>
    <g data-k="pan${i}" opacity="0" display="none"><rect data-k="pbg${i}" class="ppa-winbg" x="0" y="0" width="10" height="10" rx="16"/>
      <g clip-path="url(#${p}-pc${i})"><g data-k="pcam${i}"><g class="fig">${content}</g></g></g>
      <rect data-k="ped${i}" class="ppa-winedge" x="0" y="0" width="10" height="10" rx="16"/></g>`;
}
function graphSvg(i: number): string {
  const g = GR(i), X = (m: number): number => g.x + (m / 5) * g.w, Y = (v: number): number => g.y + g.h - (v / 2.5) * g.h;
  return `<g data-k="gr${i}" opacity="0" display="none">
    <path class="ppa-axis" d="M${g.x},${g.y - 8}V${g.y + g.h}H${g.x + g.w + 8}"/>
    ${[0, 1, 2, 3, 4, 5].map(m => `<path class="ppa-axis" d="M${f1(X(m))},${g.y + g.h}v7"/>${lab(`${m}`, 'pp12-s', X(m), g.y + g.h + 30, 'middle')}`).join('')}
    ${[0, 1, 2].map(v => `<path class="ppa-axis" d="M${g.x},${f1(Y(v))}h-7"/>${lab(`${v}`, 'pp12-s', g.x - 14, Y(v) + 7, 'end')}`).join('')}
    ${lab('minutes in strong light', 'pp12-s', g.x + g.w / 2, g.y + g.h + 58, 'middle')}
    ${lab('NPQ', 'ppa-t', g.x - 14, g.y - 16, 'end')}
    <path data-k="cv${i}" class="ppa-line" stroke="${i ? '#2350e6' : '#141413'}" d="M0,0"/>
    <circle data-k="cd${i}" r="7" fill="${i ? '#2350e6' : '#141413'}" stroke="#fbfaf6" stroke-width="1.6" cx="${X(0)}" cy="${Y(0)}"/></g>`;
}

export const STAGING: Staging = (() => {
  const P = 'pp12d';
  const chain = taggedChain(`${P}s`, 'glow', LIT12);
  const kr3a = card(P, 'k3', 560, 262, 480, { href: kr3aJpg, w: 622, h: 470 }, {
    head: 'Science, 2016', picW: 420, seed: 61, rot: -0.9,
    lines: [['NPQ after light off: VPZ falls faster', 'pp12-s']], credit: 'Kromdijk et al. 2016, Science, Fig. 3A',
  });
  const nopsbs = (pre: string): string => `${glyph(`${pre}nops`, '<ellipse class="pp12-nopsbs" rx="21" ry="9"/>')}${glyph(`${pre}l-nops`, lab('no PsbS', 'ppa-l ppa-halo', 0, 0))}`;
  const content = (i: number): string => `${chainGroup(`ch${i}`, 'glow', taggedChain(`${P}c${i}`, 'glow', LIT12))}${storySvg(`${P}p${i}`, `p${i}-`)}${i ? nopsbs('p1-') : ''}`;
  const title = (k: string, x: number, s: string): string => glyph(k, lab(s, 'pp12-title', x, 50));
  return {
    id: 'd',
    name: 'D · Side by side (PsbS, VPZ)',
    note: 'Two antenna close-ups side by side: Arabidopsis wild type vs no PsbS (npq4) with Li 2000 NPQ data, then tobacco wild type vs VPZ under a passing cloud (Kromdijk 2016).',
    beats: PP12_PAIR,
    holds: [[0]],
    svg: () => `<g data-k="cardg"><g class="fig">${slideCard(P)}${chainGroup('chS', 'glow', chain)}</g></g>
      ${panelSvg(P, 0, content(0))}${panelSvg(P, 1, content(1))}
      ${title('t0a', PAN[0][0] + 8, '<tspan class="ppa-i">Arabidopsis</tspan>, wild type')}${title('t1a', PAN[1][0] + 8, '<tspan class="ppa-i">Arabidopsis</tspan>, no PsbS (<tspan class="ppa-i">npq4</tspan>)')}
      ${title('t0b', PAN[0][0] + 8, 'tobacco, wild type')}${title('t1b', PAN[1][0] + 8, 'tobacco, faster NPQ relaxation (VPZ)')}
      ${graphSvg(0)}${graphSvg(1)}
      <g data-k="grcr" opacity="0" display="none"><text class="ppa-cr" x="1576" y="728" text-anchor="end">NPQ: Li et al. 2000, Nature 403: 391, Fig. 1b (read off the figure)</text></g>
      ${kr3a.svg}
      ${fieldCard(P, 'kr', 654, 300, 292)}`,
    bind(stage) {
      const S = setters(stage), { q, set, op } = S, put0 = putter(S);
      const csS = counterScaler(q('chS'), S), cs = [0, 1].map(i => counterScaler(q(`ch${i}`), S));
      const R0 = ((): [number, number, number, number] => {
        const a = onStage(WHOLE, [WIN[0], WIN[1]]);
        return [a[0], a[1], WIN[2] * WHOLE.s, WIN[3] * WHOLE.s];
      })();
      set(q('cardg'), 'transform', tfStr(WHOLE));
      csS(1);
      let last = '';
      return (beatIn, t) => {
        const b = Math.max(0, Math.min(2, Math.round(beatIn)));
        const tt = Math.max(0, Math.min(t, TEND[b]));
        const key = `${b}:${tt.toFixed(3)}`;
        if (key === last) return;
        last = key;
        const T = (n: number): number => (b === n ? tt : b > n ? 99 : -1);
        const t1 = T(0), t2 = T(1);

        /* ---- the split: the slide card gives way to the two panels */
        const e = mv(t1, B1.open, B1.openD);
        op(q('cardg'), 1 - fade(t1, B1.cardOut, 0.4));
        let k = 1;
        PAN.forEach((R1, i) => {
          const R = R0.map((v, j) => lerp(v, R1[j], e));
          for (const n of [`pc${i}`, `pbg${i}`, `ped${i}`]) {
            const el = q(n);
            set(el, 'x', f1(R[0])); set(el, 'y', f1(R[1])); set(el, 'width', f1(R[2])); set(el, 'height', f1(R[3]));
          }
          const v = fit(WIN, R as [number, number, number, number]);
          set(q(`pcam${i}`), 'transform', tfStr(v));
          k = kOf(v.s);
          cs[i](k);
          op(q(`pan${i}`), fade(t1, B1.open, 0.15));
        });
        const lb = fade(t1, B1.graph, 0.2);
        op(q('t0a'), b === 0 ? lb : 0); op(q('t1a'), b === 0 ? lb : 0);
        op(q('t0b'), b >= 1 ? 1 : 0); op(q('t1b'), b >= 1 ? 1 : 0);

        /* ---- beat 1: Li et al. 2000 */
        const m = 5 * Math.max(0, Math.min(1, (t1 - B1.sweep) / B1.sweepD));
        [NPQ_WT, NPQ_N4].forEach((ys, i) => {
          const g = GR(i), X = (x: number): number => g.x + (x / 5) * g.w, Y = (v: number): number => g.y + g.h - (v / 2.5) * g.h;
          const pts: V[] = LT.filter(x => x <= m).map(x => [X(x), Y(npqAt(ys, x))]);
          pts.push([X(m), Y(npqAt(ys, m))]);
          set(q(`cv${i}`), 'd', `M${pts.map(p => `${f1(p[0])},${f1(p[1])}`).join('L')}`);
          set(q(`cd${i}`), 'cx', f1(X(m))); set(q(`cd${i}`), 'cy', f1(Y(npqAt(ys, m))));
          op(q(`gr${i}`), b === 0 ? lb : 0);
        });
        op(q('grcr'), b === 0 ? lb : 0);

        /* ---- the two panels' stories */
        const strong = b === 0 ? fade(t1, B1.light, 0.4) : 1 - fade(t2, B2.lightOut, 0.4);
        const cl = mv(t2, B2.cloud, B2.cloudD), clOn = b === 1 ? fade(tt, B2.cloud, 0.2) : b === 2 ? 1 : 0;
        [0, 1].forEach(i => {
          const npq = b === 0 ? npqAt(i ? NPQ_N4 : NPQ_WT, m) : 2.4;
          const bind = b === 0 ? (i ? 0 : mv(t1, B1.bind, B1.bindD)) : 1;
          const dots = MORE.map((at, j) => {
            const u = b === 0 ? fade(t1, B1.h0 + j * B1.hDt, 0.15) : 1, out = fade(t2, B2.hOut + j * B2.hDt, 0.25);
            return { p: (j < 2 ? lerpV(at, SITES[j], bind) : at) as V, u, o: u * (1 - out) };
          });
          // beat 2: VPZ (right) turns zeaxanthin back and stops the heat sooner
          const back = i && b >= 1 ? mv(t2, B2.back, B2.backD) : 0;
          const heatOn = b === 0 ? Math.min(1, npq * 2) : 1 - (i ? fade(t2, B2.heatOut, 0.5) : 0);
          const st: StoryState = {
            strong, cl, clOn, dots, conv: b === 0 ? 0 : 1 - back, heat: heatOn,
            fl: b === 0 ? fade(t1, B1.light, 0.3) : 1, lb: b === 0 ? fade(t1, B1.graph, 0.2) : 1,
            soOn: 0, hit: 0, flash: 0, dmg: 0, swap: 0,
          };
          const pre = `p${i}-`;
          drawStory(S, put0, st, pre, k * 0.9, 1);
          put0(`${pre}l-light`, [0, 0], 1, 0);
          // the close-ups do not reach the slide's cloud height: the cloud passes over the light inside them
          put0(`${pre}cloud`, lerpV([-150, 206], [108, 206], cl), 1, clOn);
          put0(`${pre}l-cloud`, lerpV([-150, 213], [108, 213], cl), 1, clOn);
          // the heat's width follows NPQ; the fluorescence dims as NPQ rises (beat 1), stays dim in beat 2
          for (const h of ['heat0', 'heat1']) set(q(`${pre}${h}`), 'style', `stroke-width:${(b === 0 ? 1 + 1.4 * npq : 4.4).toFixed(2)}`);
          const fl = b === 0 ? fade(t1, B1.light, 0.3) * (1 - 0.27 * npq) : 0.35;
          op(q(`${pre}fluo`), fl);
          set(q(`${pre}fluo`), 'style', `stroke-width:${(b === 0 ? 4.5 - 1.0 * npq : 2.2).toFixed(2)}`);
          // the xanthophylls only in beats 2–3
          if (b === 0) for (const x of ['xv', 'xz', 'l-xv', 'l-xz']) put0(`${pre}${x}`, [0, 0], 1, 0);
          // no PsbS in npq4 (beat 1)
          if (i === 1) {
            const n4 = b === 0 ? 1 : 0;
            if (n4) { put0('p1-psbs', PSBS, 1, 0); put0('p1-l-psbs', [0, 0], 1, 0); }
            put0('p1-nops', PSBS, 1, n4 * lb);
            put0('p1-l-nops', [-50, 328], k, n4 * lb);
          }
        });

        /* ---- clippings */
        op(q('k3'), b === 1 ? fade(tt, B2.card, 0.15) : 0);
        op(q('kr'), b === 2 ? fade(tt, B3.card, 0.15) : 0);
      };
    },
  };
})();

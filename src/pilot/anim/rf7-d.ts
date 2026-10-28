// Light-response curve (slide C7), animation rf7, staging D: side by side. Two windows on slide C7's schema (flat look,
// the light supply lit, as C7's figures light it), one for tobacco grown in 95 % sunlight and one for tobacco grown in
// 28 %, under the same rising light; the panel carries both of Huang et al. 2014's curves, each with its dot. In dim light
// both leaves fix CO₂ alike (the same slope); in bright light the shade-grown leaf's ATP and NADPH pile up at lower light
// and its uptake levels off lower. Beats and captions: beats-rf78.ts (RF7); beat 5 needs no clipping here, the curves are
// already side by side.
//
// Data: Huang, Zhang & Hu 2014, Fig. 1C, read off the figure (as slide C7 v6): sun 21.8 and shade 13.1 µmol m⁻² s⁻¹ at
// 2000, light compensation points 32 and 20 (their Table 1). The glyph rates follow each curve as in rf7-common.ts; the
// shade leaf's ATP and NADPH crowd from ≈ 400 µmol m⁻² s⁻¹ (where its curve bends), the sun leaf's from ≈ 700.
import { LIT_C7, type Look, type Part } from '../figs/rf-schema';
import { axes, pill, T } from '../figs/rf-kit';
import { f1, setters, type V } from './antenna-common';
import {
  beadG, bindScene, co2G, dense, dUpTo, glyph, litCh, panelCard, PANEL, photonG, rubpG, schemaCard, sceneSvg, stream, tagG,
  Timeline, VP, walker, WHOLE, yAt, type BeatPlan,
} from './rf78-common';
import type { Staging } from './types';

const LOOK: Look = 'flat';
const PPFD = [0, 20, 50, 100, 200, 300, 500, 800, 1200, 1600, 2000];
const SUN = [-2.2, -0.8, 1.4, 4.3, 8.8, 12.4, 16.7, 19.7, 21.1, 21.8, 21.8];
const SHADE = [-1.0, 0.0, 1.8, 3.9, 6.7, 8.6, 10.4, 11.6, 12.3, 12.9, 13.1];
type Leaf = 'sun' | 'shade';
const LEAF: Record<Leaf, { data: number[]; title: string; bend: number }> = {
  sun: { data: SUN, title: 'grown in 95 % sunlight', bend: 700 },
  shade: { data: SHADE, title: 'grown in 28 % sunlight', bend: 400 },
};

/* the two windows on the stage, and the schema region they show (the light supply and the cycle, figure units) */
const PAD = 14, GAP = 12, WW = (VP.w - 2 * PAD - GAP) / 2, WH = VP.h - 2 * PAD;
const BOX: Record<Leaf, [number, number, number, number]> = {
  sun: [VP.x + PAD, VP.y + PAD, WW, WH],
  shade: [VP.x + PAD + WW + GAP, VP.y + PAD, WW, WH],
};
const REGION: [number, number, number, number] = [122, 20, 452, 665];

const PATH = {
  photon: walker([[600, 144], [554, 180], [508, 212]]),
  supply: walker([[398, 214], [330, 214]]),
  reduce: walker([[316, 296], [316, 174]]),
  regen: walker([[236, 156], [152, 198], [126, 300], [150, 402], [282, 454]]),
  co2: walker([[244, 556], [268, 536], [292, 520]]),
};

/* the plot */
const PB: [number, number, number, number] = [1062, 206, 1548, 558];
const X = (q: number): number => PB[0] + (q / 2000) * (PB[2] - PB[0]);
const Y = (a: number): number => PB[3] - ((a + 5) / 30) * (PB[3] - PB[1]);
const CURVE: Record<Leaf, V[]> = {
  sun: dense(PPFD.map((q, i) => [X(q), Y(SUN[i])] as V)),
  shade: dense(PPFD.map((q, i) => [X(q), Y(SHADE[i])] as V)),
};
const aAt = (k: Leaf, q: number): number => ((PB[3] - yAt(CURVE[k], X(q))) / (PB[3] - PB[1])) * 30 - 5;

export const STAGING: Staging = (() => {
  const P = 'r7d';
  const DARK: Part[] = ['light', 'thyl', 'supply'];
  const LIT0 = [...LIT_C7];
  const beats: BeatPlan[] = [
    { end: 2.2, moves: [{ at: 0.1, d: 0.5, to: litCh(LIT0.filter(p => !DARK.includes(p))) }] },
    { end: 2.8, moves: [
      { at: 0.1, d: 0.5, to: litCh([...LIT0, 'co2']) },
      { at: 0.2, d: 1.5, to: { q: 32 } },
      { at: 0.3, d: 0.4, to: { 'o:s': 1 } },
      { at: 1.8, d: 0.3, to: { 'o:llcp': 1 } },
    ] },
    { end: 3.2, moves: [
      { at: 0.2, d: 2.0, to: { q: 150 } },
      { at: 2.0, d: 0.3, to: { 'o:lqy': 1 } },
    ] },
    { end: 3.6, moves: [
      { at: 0.2, d: 2.8, to: { q: 2000 } },
      { at: 2.8, d: 0.3, to: { 'o:lsat': 1 } },
    ] },
    { end: 1.0, moves: [{ at: 0.05, d: 0.3, to: { 'o:vals': 1 } }] },
    { end: 1.2, moves: [{ at: 0.05, d: 0.6, to: { ...litCh(LIT0), 'o:s': 0 } }] },
  ];
  const TL = new Timeline({ q: 0, ...litCh(LIT0) }, WHOLE, beats);
  const ENDS = TL.ends, START = ENDS.map((_, i) => ENDS.slice(0, i).reduce((a, b) => a + b, 0));

  const N8 = [0, 1, 2, 3, 4, 5, 6, 7];
  const glyphs = (k: Leaf): string => [
    `<g class="rf78-mult"><ellipse data-k="${k}-hr" class="rf78-glow" cx="316" cy="500" rx="92" ry="40" opacity="0" filter="url(#${P}-blur)"/></g>`,
    ...N8.map(i => glyph(`${k}-ph-${i}`, photonG())),
    ...N8.map(i => glyph(`${k}-sup-${i}`, tagG(i % 2 ? 'nadph' : 'atp', 18, 10))),
    ...N8.map(i => glyph(`${k}-red-${i}`, beadG('rfk-bead rfk-bead-c', 5.5))),
    ...N8.map(i => glyph(`${k}-reg-${i}`, rubpG(10))),
    ...N8.map(i => glyph(`${k}-co2-${i}`, co2G(4.6, -38))),
  ].join('');
  const win = (k: Leaf): string => {
    const [x, y, w, h] = BOX[k];
    return `<svg x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" viewBox="${REGION.join(' ')}" preserveAspectRatio="xMidYMid meet" overflow="hidden" style="overflow:hidden">
        <g class="fig" data-k="s-${k}">${sceneSvg(`${P}${k}`, LOOK)}<g class="rfs rfs-${LOOK}">${glyphs(k)}</g></g></svg>
      <rect class="rf78-win" x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" rx="12"/>
      <g class="fig"><g class="rfk">${pill(x + w / 2, y + h - 40, `tobacco ${LEAF[k].title}`)}</g></g>`;
  };
  const dots = (k: Leaf): string => PPFD.map((q, i) => `<circle data-k="${k}-pt-${i}" class="${k === 'sun' ? 'rf78-pt' : 'rf78-ptk'}" cx="${f1(X(q))}" cy="${f1(Y(LEAF[k].data[i]))}" r="6.5" opacity="0"/>`).join('');
  const S0 = (SUN[3] - SUN[0]) / 100;
  const panel = `${panelCard(P)}<g class="fig"><g class="rfk">
    ${axes(PB, X, Y, [[0, '0'], [500, '500'], [1000, '1000'], [1500, '1500'], [2000, '2000']], [[-5, '−5'], [0, '0'], [5, '5'], [10, '10'], [15, '15'], [20, '20'], [25, '25']],
      'light, PPFD (µmol photons m⁻² s⁻¹)', 'net CO₂ uptake (µmol m⁻² s⁻¹)', { zero: true })}
    <path data-k="slope" class="rf78-slope" d="M${f1(X(0))},${f1(Y(SUN[0]))}L${f1(X(360))},${f1(Y(SUN[0] + S0 * 360))}" opacity="0"/>
    <path data-k="sun-tr" class="rf78-trace"/><path data-k="shade-tr" class="rf78-trace rf78-trace-g"/>
    ${dots('sun')}${dots('shade')}
    <circle data-k="sun-dot" class="rf78-dot" r="9"/><circle data-k="shade-dot" class="rf78-dot rf78-dot-g" r="9"/>
    <g data-k="l-lcp" opacity="0">${pill(X(720), Y(3.6), 'light compensation point', [X(32), Y(0)])}</g>
    <g data-k="l-qy" opacity="0">${pill(X(560), Y(25.9), 'quantum yield', [X(300), Y(SUN[0] + S0 * 300)])}</g>
    <g data-k="l-sat" opacity="0">${pill(X(1330), Y(25.9), 'light saturation')}</g>
    <g data-k="vals" opacity="0">${T(X(2000) - 4, Y(21.8) + 32, 'grown in 95 %: ≈ 22', 'rfk-m', 'end')}${T(X(2000) - 4, Y(13.1) + 32, 'grown in 28 %: ≈ 13', 'rfk-m', 'end')}</g>
    <g data-k="ro">
      <text class="rf78-rl" x="958" y="98">light</text><text class="rf78-val" data-k="ro-q" x="1112" y="99" text-anchor="end">0</text><text class="rf78-unit" x="1120" y="98">µmol photons m⁻² s⁻¹</text>
      <text class="rf78-rl" x="958" y="146">CO₂ uptake</text>
      <text class="rf78-rl" x="1090" y="146">95 %</text><text class="rf78-val" data-k="ro-sun" x="1230" y="147" text-anchor="end">−2.2</text>
      <text class="rf78-rl" x="1270" y="146">28 %</text><text class="rf78-val" data-k="ro-shade" x="1410" y="147" text-anchor="end">−1.0</text>
      <text class="rf78-unit" x="1420" y="146">µmol m⁻² s⁻¹</text>
    </g>
    ${T(PANEL.x + PANEL.w - 16, PANEL.y + PANEL.h - 14, 'redrawn from Huang, Zhang &amp; Hu 2014, Front Plant Sci 5:688, Fig. 1C (tobacco; CC BY 4.0)', 'rfk-cr', 'end')}
    ${T(PANEL.x + PANEL.w - 16, PANEL.y + PANEL.h - 34, 'schema after Zhang 2021, MSc thesis, Fig. 2b, and von Caemmerer 2000, Fig. 2.1', 'rfk-cr', 'end')}
  </g></g>`;

  return {
    id: 'd',
    name: 'D · Sun and shade side by side (flat look)',
    note: 'Two windows on the slide C7 schema (flat look), tobacco grown in 95 % vs 28 % sunlight, under the same rising light, with both curves and dots on the panel: same slope in dim light, the shade-grown leaf saturates lower.',
    svg: () => `${schemaCard(P)}<defs><filter id="${P}-blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="14"/></filter></defs>
      ${win('sun')}${win('shade')}${panel}`,
    bind(stage) {
      const S = setters(stage), { q, set, op } = S;
      const scenes = { sun: bindScene(q('s-sun'), S), shade: bindScene(q('s-shade'), S) };
      const put = (key: string, at: V, a: number): void => {
        const g = q(key);
        op(g, a);
        if (a > 0.004) set(g, 'transform', `translate(${f1(at[0])} ${f1(at[1])})`);
      };
      let last = '';
      return (beatIn, t) => {
        const b = Math.max(0, Math.min(ENDS.length - 1, Math.round(beatIn)));
        const tt = Math.max(0, Math.min(t, ENDS[b]));
        const key = `${b}:${tt.toFixed(3)}`;
        if (key === last) return;
        last = key;
        const V_ = (ch: string): number => TL.v(ch, b, tt);
        const abs = START[b] + tt, qq = V_('q'), on = V_('o:s');
        set(q('ro-q'), 'text', `${Math.round(qq)}`);
        op(q('slope'), V_('o:lqy'));
        op(q('l-lcp'), V_('o:llcp')); op(q('l-qy'), V_('o:lqy')); op(q('l-sat'), V_('o:lsat')); op(q('vals'), V_('o:vals'));
        (['sun', 'shade'] as Leaf[]).forEach(k => {
          scenes[k].light(p => V_(`L:${p}`));
          const a = aAt(k, qq), x = X(qq), y = yAt(CURVE[k], x);
          set(q(`${k}-dot`), 'cx', f1(x)); set(q(`${k}-dot`), 'cy', f1(y));
          set(q(`${k}-tr`), 'd', dUpTo(CURVE[k], X(0), x) || 'M0,0');
          PPFD.forEach((pp, i) => op(q(`${k}-pt-${i}`), qq >= pp - 0.5 ? 1 : 0));
          set(q(`ro-${k}`), 'text', (a < -0.05 ? '−' : '') + Math.abs(a).toFixed(1));
          const light = qq / 2000, jRel = 1 - Math.exp(-qq / 700), gross = Math.max(0, a + 2.2) / 24;
          const jam = Math.max(0, Math.min(1, (qq - LEAF[k].bend) / 1000));
          op(q(`${k}-hr`), on * jam * 0.6);
          const draw = (pre: string, path: (u: number) => V, omega: number, count: number, o: number, squeeze = 0): void => {
            stream(abs * omega, count).forEach(([u, vis], i) => put(`${k}-${pre}-${i}`, path(1 - (1 - u) * (1 - squeeze)), o * vis));
          };
          draw('ph', PATH.photon, 0.9, 8 * Math.min(1, light * 1.6 + (qq > 0 ? 0.12 : 0)), on);
          draw('sup', PATH.supply, 0.55 * (1 - 0.6 * jam), 1 + 3 * jRel + 4 * jam, on * (qq > 0 ? 1 : 0), 0.55 * jam);
          draw('red', PATH.reduce, 0.6, 5 * gross, on);
          draw('reg', PATH.regen, 0.32, 5 * gross, on);
          draw('co2', PATH.co2, 0.45, 3 * gross, on);
        });
      };
    },
  };
})();

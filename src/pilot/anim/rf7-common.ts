// Light-response curve (slide C7), animation rf7: the story the zoom stagings share (rf7-a: thesis look, Huang 2014
// clipping; rf7-b: glow look, a deeper camera and Gaastra's 1959 clipping). The stage is the slide C7 figure,
// schemaSvg(look, LIT_C7) (C7 v1 thesis, v2 glow), in its card on the left, and a panel on the right with a light readout
// and the light-response curve of tobacco sun leaves with its dot, live from the first frame. The light rises once,
// 0 → 2000 µmol photons m⁻² s⁻¹; six clicks, one per beat:
// 1 · darkness (whole schema): no light, no ATP or NADPH; CO₂ leaves the mitochondrion (lit with its CO₂ arrow); the dot
//     sits below zero.
// 2 · light compensation point (whole schema): light 0 → 32; a few photons, a few ATP and NADPH; CO₂ starts to enter
//     at RuBisCO; the dot reaches zero.
// 3 · quantum yield (zoom on the light supply): 32 → 200; photons, ATP and NADPH and the cycle's flow rise together; the
//     dot climbs the straight part; its slope is drawn.
// 4 · light saturation: 200 → 2000; ATP and NADPH crowd at the reduction step, RuBisCO glows; the dot levels off. The
//     camera widens to the cycle first (wide), or follows the bottleneck from the thylakoid down to RuBisCO (deep).
// 5 · a clipping: (A) Huang et al. 2014 Fig. 1C, sun and shade tobacco; (B) Gaastra 1959 Fig. 12A, spinach at four CO₂.
// 6 · zoom out to the slide figure.
//
// The curve: net CO₂ uptake of tobacco leaves grown in 95 % sunlight, read off Huang, Zhang & Hu 2014 Fig. 1C (as slide
// C7 v6 redraws it; 21.8 µmol m⁻² s⁻¹ at 2000, light compensation point 32, their Table 1). The rates of the story's
// glyphs follow it: photons ∝ light; ATP and NADPH ∝ 1 − e^(−light/700) (electron transport saturates later than
// uptake); the cycle's flow ∝ uptake + 2.2 (gross fixation, release in darkness 2.2); the crowding ∝ how far light is
// past ≈ 700 µmol m⁻² s⁻¹, where the curve bends.
import gaastraPng from '../../assets/rf/gaastra1959-fig12.png';
import huangJpg from '../../assets/rf/huang2014-fig1c.jpg';
import { LIT_C7, type Look, type Part } from '../figs/rf-schema';
import { axes, pill, T } from '../figs/rf-kit';
import { f1, setters, type V } from './antenna-common';
import {
  beadG, bindScene, camStr, clipImage, co2G, dense, dUpTo, glyph, kOf, litCh, PANEL, panelCard, photonG, rubpG,
  schemaCard, sceneSvg, stream, tagG, Timeline, view, walker, WHOLE, yAt, type BeatPlan, type Tf,
} from './rf78-common';
import type { Beat, Staging } from './types';

/* ================================================================ data: Huang, Zhang & Hu 2014, Fig. 1C */

const PPFD = [0, 20, 50, 100, 200, 300, 500, 800, 1200, 1600, 2000];
const SUN = [-2.2, -0.8, 1.4, 4.3, 8.8, 12.4, 16.7, 19.7, 21.1, 21.8, 21.8];
const LCP = 32;

/* ================================================================ schema positions (figure units, rf-schema.ts) */

const PATH = {
  photon: walker([[600, 144], [554, 180], [508, 212]]),
  supply: walker([[398, 214], [330, 214]]),
  reduce: walker([[316, 296], [316, 174]]),
  regen: walker([[236, 156], [152, 198], [126, 300], [150, 402], [282, 454]]),
  co2: walker([[244, 556], [268, 536], [292, 520]]),
  resp: walker([[752, 546], [776, 574], [806, 604]]),
  // the chain close view (look 'pdb'): light onto photosystems II and I; ATP from ATP synthase's stroma head and NADPH
  // from photosystem I's stroma side, off toward the cycle
  phII: walker([[408, 120], [416, 160], [424, 196]]),
  phI: walker([[470, 120], [478, 160], [484, 196]]),
  atpo: walker([[508, 180], [492, 164], [450, 158], [404, 176]]),
  nadpho: walker([[484, 192], [474, 176], [440, 170], [404, 188]]),
};
const HALO = { bolt: [522, 150] as V, thyl: [454, 206] as V, rub: [316, 500] as V };

/* ================================================================ the plot (stage units) */

const PB: [number, number, number, number] = [1062, 206, 1548, 558];
const X = (q: number): number => PB[0] + (q / 2000) * (PB[2] - PB[0]);
const Y = (a: number): number => PB[3] - ((a + 5) / 30) * (PB[3] - PB[1]);
const CURVE: V[] = dense(PPFD.map((q, i) => [X(q), Y(SUN[i])] as V));
const aAt = (q: number): number => (PB[3] - yAt(CURVE, X(q))) / (PB[3] - PB[1]) * 30 - 5;
const S0 = (SUN[3] - SUN[0]) / 100;

/* ================================================================ the staging */

export interface Opt {
  id: string; name: string; note: string; look: Look;
  /** The clipping of beat 5: Huang et al. 2014 (sun and shade tobacco) or Gaastra 1959 (spinach at four CO₂ levels). */
  clip: 'huang' | 'gaastra';
  /** The camera: 'wide' zooms on the supply, then widens to the cycle; 'deep' dives into the thylakoid, then pans to
   *  RuBisCO; 'chain' (look 'pdb') dives into the thylakoid's four complexes, the chain of slides 7–10b, then widens. */
  camera: 'wide' | 'deep' | 'chain';
  /** Beats, when the staging tells a different beat 5 (rf7 B: Gaastra). */
  beats?: Beat[];
}

export function makeStaging(o: Opt): Staging {
  const P = `r7${o.id}`;
  const LIT0 = [...LIT_C7];
  /** Parts that go dark in darkness: light, the thylakoid and its ATP and NADPH. */
  const DARK: Part[] = ['light', 'thyl', 'supply'];
  const VS: Tf = o.camera === 'deep' ? view([300, 108, 272, 196]) : o.camera === 'chain' ? view([334, 128, 240, 172]) : view([196, 96, 350, 260]);
  const CH = o.camera === 'chain' ? 1 : 0;
  const V2: Tf = o.camera === 'deep' ? view([170, 380, 300, 226]) : view([96, 100, 460, 450]);
  const glyphOff = { 'o:sPh': 0, 'o:sSup': 0, 'o:sCyc': 0, 'o:sCO2': 0, 'o:resp': 0, 'o:halo': 0, 'o:hr': 0 };
  const beats: BeatPlan[] = [
    { end: 2.6, moves: [
      { at: 0.1, d: 0.5, to: litCh([...LIT0.filter(p => !DARK.includes(p)), 'mito', 'co2-out']) },
      { at: 0.3, d: 0.4, to: { 'o:resp': 1 } },
      { at: 0.9, d: 0.3, to: { 'o:lrel': 1 } },
    ] },
    { end: 3.0, moves: [
      { at: 0.1, d: 0.5, to: litCh([...LIT0, 'mito', 'co2-out', 'co2']) },
      { at: 0.2, d: 1.5, to: { q: LCP } },
      { at: 0.3, d: 0.4, to: { 'o:sPh': 1, 'o:sSup': 1, 'o:sCyc': 1, 'o:sCO2': 1, 'o:halo': 1 } },
      { at: 1.8, d: 0.3, to: { 'o:llcp': 1 } },
    ] },
    { end: 3.6, cam: [{ at: 0.05, d: 1.1, to: VS }], moves: [
      { at: 0.1, d: 0.5, to: litCh([...LIT0, 'co2']) },
      { at: 0.8, d: 0.3, to: { 'o:chain': CH } },
      { at: 0.1, d: 0.5, to: { 'o:resp': 0 } },
      { at: 1.0, d: 1.8, to: { q: 200 } },
      { at: 2.3, d: 0.3, to: { 'o:lqy': 1 } },
    ] },
    // wide: widen to the cycle, then light rises; deep: light rises on the thylakoid, then the camera follows the
    // bottleneck down to RuBisCO
    o.camera === 'deep'
      ? { end: 4.6, cam: [{ at: 2.6, d: 1.2, to: V2 }], moves: [
        { at: 0.1, d: 2.4, to: { q: 2000 } },
        { at: 2.3, d: 0.3, to: { 'o:lsat': 1 } },
      ] }
      : { end: 4.2, cam: [{ at: 0.05, d: 1.1, to: V2 }], moves: [
        { at: 0.05, d: 0.4, to: { 'o:chain': 0 } },
        { at: 0.9, d: 2.6, to: { q: 2000 } },
        { at: 3.0, d: 0.3, to: { 'o:lsat': 1 } },
      ] },
    { end: 1.2, moves: [{ at: 0.05, d: 0.25, to: { 'o:clip': 1 } }] },
    { end: 2.6, cam: [{ at: 0.2, d: 1.2, to: WHOLE }], moves: [
      { at: 0, d: 0.25, to: { 'o:clip': 0 } },
      { at: 0.2, d: 0.6, to: litCh(LIT0) },
      { at: 0.2, d: 0.6, to: glyphOff },
    ] },
  ];
  const TL = new Timeline({ q: 0, ...litCh(LIT0) }, WHOLE, beats);
  const ENDS = TL.ends, START = ENDS.map((_, i) => ENDS.slice(0, i).reduce((a, b) => a + b, 0));

  /* ---------------- markup */
  const N8 = [0, 1, 2, 3, 4, 5, 6, 7];
  const under = `<circle data-k="h-bolt" class="rf78-glow" cx="${HALO.bolt[0]}" cy="${HALO.bolt[1]}" r="46" opacity="0" filter="url(#${P}-blur)"/>`;
  // glows over the drawing (multiplied in, so the parts under them stay readable)
  const over = `<g class="rf78-mult"><circle data-k="h-thyl" class="rf78-glow" cx="${HALO.thyl[0]}" cy="${HALO.thyl[1]}" r="66" opacity="0" filter="url(#${P}-blur)"/>
    <ellipse data-k="h-rub" class="rf78-glow" cx="${HALO.rub[0]}" cy="${HALO.rub[1]}" rx="92" ry="40" opacity="0" filter="url(#${P}-blur)"/></g>`;
  const glyphs = [
    ...N8.map(i => glyph(`ph-${i}`, photonG())),
    ...N8.map(i => glyph(`sup-${i}`, tagG(i % 2 ? 'nadph' : 'atp', 18, 10))),
    ...N8.map(i => glyph(`red-${i}`, beadG('rfk-bead rfk-bead-c', 5.5))),
    ...N8.map(i => glyph(`reg-${i}`, rubpG(10))),
    ...N8.map(i => glyph(`co2-${i}`, co2G(4.6, -38))),
    ...N8.map(i => glyph(`resp-${i}`, co2G(4.6, 52))),
    ...N8.map(i => glyph(`ph2-${i}`, photonG())),
    ...N8.map(i => glyph(`ph3-${i}`, photonG())),
    ...N8.map(i => glyph(`atpo-${i}`, tagG('atp', 18, 10))),
    ...N8.map(i => glyph(`nadpho-${i}`, tagG('nadph', 18, 10))),
  ].join('');
  // the four complexes of the thylakoid in look 'pdb' (rf-schema.ts thylakoid(): PSII x − 30, b₆f x + 6, PSI x + 30,
  // ATP synthase x + 52; stroma up), named in the close view
  const cx = o.camera === 'chain' ? `<g data-k="cx" opacity="0" display="none">
    <text class="rf78-cx" x="424" y="235" text-anchor="middle">photosystem II</text>
    <text class="rf78-cx" x="458" y="187" text-anchor="middle">cytochrome <tspan font-style="italic">b</tspan>₆<tspan font-style="italic">f</tspan></text>
    <text class="rf78-cx" x="486" y="235" text-anchor="middle">photosystem I</text>
    <text class="rf78-cx" x="518" y="186" text-anchor="start">ATP synthase</text></g>` : '';
  const dots = PPFD.map((q, i) => `<circle data-k="pt-${i}" class="rf78-pt" cx="${f1(X(q))}" cy="${f1(Y(SUN[i]))}" r="6.5" opacity="0"/>`).join('');
  const qy = `M${f1(X(0))},${f1(Y(SUN[0]))}L${f1(X(360))},${f1(Y(SUN[0] + S0 * 360))}`;
  const clip = o.clip === 'huang' ? huangClip(P) : gaastraClip(P);
  const panelSvg = `${panelCard(P)}<g class="fig"><g class="rfk">
    ${axes(PB, X, Y, [[0, '0'], [500, '500'], [1000, '1000'], [1500, '1500'], [2000, '2000']], [[-5, '−5'], [0, '0'], [5, '5'], [10, '10'], [15, '15'], [20, '20'], [25, '25']],
      'light, PPFD (µmol photons m⁻² s⁻¹)', 'net CO₂ uptake (µmol m⁻² s⁻¹)', { zero: true })}
    <path data-k="slope" class="rf78-slope" d="${qy}" opacity="0"/>
    <path data-k="trace" class="rf78-trace"/>
    ${dots}
    <path data-k="drop" class="rf78-drop"/>
    <circle data-k="dot" class="rf78-dot" r="9"/>
    <g data-k="l-rel" opacity="0">${pill(X(720), Y(3.6), 'respiration: CO₂ released', [X(0) + 9, Y(SUN[0])])}</g>
    <g data-k="l-lcp" opacity="0">${pill(X(720), Y(3.6), 'light compensation point', [X(LCP), Y(0)])}</g>
    <g data-k="l-qy" opacity="0">${pill(X(560), Y(25.9), 'quantum yield', [X(300), Y(SUN[0] + S0 * 300)])}</g>
    <g data-k="l-sat" opacity="0">${pill(X(1330), Y(25.9), 'light saturation')}</g>
    ${T(PB[2], Y(10.5), 'tobacco grown in 95 % sunlight', 'rfk-s', 'end')}
    <g data-k="ro">
      <text class="rf78-rl" x="958" y="98">light</text><text class="rf78-val" data-k="ro-q" x="1112" y="99" text-anchor="end">0</text><text class="rf78-unit" x="1120" y="98">µmol photons m⁻² s⁻¹</text>
      <text class="rf78-rl" x="958" y="146">net CO₂ uptake</text><text class="rf78-val" data-k="ro-a" x="1206" y="147" text-anchor="end">−2.2</text><text class="rf78-unit" x="1214" y="146">µmol m⁻² s⁻¹</text>
    </g>
    ${T(PANEL.x + PANEL.w - 16, PANEL.y + PANEL.h - 14, 'redrawn from Huang, Zhang &amp; Hu 2014, Front Plant Sci 5:688, Fig. 1C (tobacco; CC BY 4.0)', 'rfk-cr', 'end')}
  </g></g>`;

  return {
    id: o.id,
    name: o.name,
    note: o.note,
    beats: o.beats,
    svg: () => `
      ${schemaCard(P)}<defs><filter id="${P}-blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="14"/></filter></defs>
      <g clip-path="url(#${P}-vp)"><g data-k="cam"><g class="fig">${under}${sceneSvg(`${P}s`, o.look)}
        ${over}<g class="rfs rfs-${o.look}">${glyphs}</g>${cx}</g></g></g>
      ${panelSvg}
      <g data-k="clip" opacity="0" display="none"><g class="fig"><g class="rfk">${clip}</g></g></g>`,

    bind(stage) {
      const S = setters(stage), { q, set, op } = S;
      const cam = q('cam'), scene = bindScene(cam, S);
      const els = new Map<string, SVGElement>();
      const el = (k: string): SVGElement => { let e = els.get(k); if (!e) { e = q<SVGElement>(k); els.set(k, e); } return e; };
      const put = (k: string, at: V, sc: number, a: number): void => {
        const g = el(k);
        op(g, a);
        if (a > 0.004) set(g, 'transform', `translate(${f1(at[0])} ${f1(at[1])}) scale(${sc.toFixed(4)})`);
      };
      let last = '';
      return (beatIn, t) => {
        const b = Math.max(0, Math.min(ENDS.length - 1, Math.round(beatIn)));
        const tt = Math.max(0, Math.min(t, ENDS[b]));
        const key = `${b}:${tt.toFixed(3)}`;
        if (key === last) return;
        last = key;
        const V_ = (ch: string): number => TL.v(ch, b, tt);
        const abs = START[b] + tt;

        /* camera, text, lit parts */
        const c = TL.cam(b, tt), k = kOf(c.s);
        set(cam, 'transform', camStr(c));
        scene.scaleText(k);
        scene.light((p: Part) => V_(`L:${p}`));

        /* the dial and the curve */
        const qq = V_('q'), a = aAt(qq), x = X(qq), y = yAt(CURVE, x);
        set(el('dot'), 'cx', f1(x)); set(el('dot'), 'cy', f1(y));
        set(el('drop'), 'd', `M${f1(x)},${f1(y + 10)}V${f1(PB[3])}`);
        set(el('trace'), 'd', dUpTo(CURVE, X(0), x) || 'M0,0');
        PPFD.forEach((p, i) => op(el(`pt-${i}`), qq >= p - 0.5 ? 1 : 0));
        set(el('ro-q'), 'text', `${Math.round(qq)}`);
        set(el('ro-a'), 'text', (a < -0.05 ? '−' : '') + Math.abs(a).toFixed(1));
        op(el('slope'), V_('o:lqy'));
        op(el('l-rel'), V_('o:lrel') * (1 - V_('o:llcp')));
        op(el('l-lcp'), V_('o:llcp'));
        op(el('l-qy'), V_('o:lqy'));
        op(el('l-sat'), V_('o:lsat'));
        op(el('clip'), V_('o:clip'));

        /* the schema's story */
        const light = qq / 2000, jRel = 1 - Math.exp(-qq / 700), gross = Math.max(0, a + 2.2) / 24;
        const jam = Math.max(0, Math.min(1, (qq - 700) / 1000));
        const halo = V_('o:halo');
        op(el('h-bolt'), halo * (0.15 + 0.85 * Math.min(1, qq / 600)) * 0.9);
        op(el('h-thyl'), halo * Math.min(1, qq / 800) * 0.55);
        op(el('h-rub'), halo * jam * 0.6);
        // glyphs grow with the camera, but less than the drawing
        const gs = k ** 0.6;
        const draw = (pre: string, path: (u: number) => V, omega: number, count: number, on: number, squeeze = 0): void => {
          stream(abs * omega, count).forEach(([u, vis], i) => {
            const uu = 1 - (1 - u) * (1 - squeeze);
            put(`${pre}-${i}`, path(uu), gs, on * vis);
          });
        };
        const ch = o.camera === 'chain' ? V_('o:chain') : 0, nPh = 8 * Math.min(1, light * 1.6 + (qq > 0 ? 0.12 : 0));
        draw('ph', PATH.photon, 0.9, nPh, V_('o:sPh') * (1 - ch));
        draw('sup', PATH.supply, 0.55 * (1 - 0.6 * jam), 1 + 3 * jRel + 4 * jam, V_('o:sSup') * (qq > 0 ? 1 : 0), 0.55 * jam);
        draw('red', PATH.reduce, 0.6, 5 * gross, V_('o:sCyc'));
        draw('reg', PATH.regen, 0.32, 5 * gross, V_('o:sCyc'));
        draw('co2', PATH.co2, 0.45, 3 * gross, V_('o:sCO2'));
        draw('resp', PATH.resp, 0.4, 2, V_('o:resp'));
        if (o.camera === 'chain') {
          op(el('cx'), ch);
          // in the close view the light falls on the two photosystems
          draw('ph3', PATH.phII, 0.9, nPh / 2, ch);
          draw('ph2', PATH.phI, 0.9, nPh / 2, ch);
          draw('atpo', PATH.atpo, 0.5, 1 + 3 * jRel, ch);
          draw('nadpho', PATH.nadpho, 0.5, 1 + 2 * jRel, ch);
        }
      };
    },
  };
}

/* ================================================================ the clippings (stage units, over the schema's card) */

function huangClip(p: string): string {
  const foot = 'Huang, Zhang &amp; Hu 2014, Front Plant Sci 5:688, Fig. 1C (tobacco; CC BY 4.0)';
  const r = clipImage(`${p}hu`, huangJpg, 1156, 895, 96, 70, 600, { rot: -1.2, seed: 43, foot });
  // Fig. 1C axes: PPFD 0 at x 263, 0.417 px per µmol; A 0 at y 589, 22.35 px per unit
  const at = (q: number, a: number): V => r.at(263 + q * 0.417, 589 - a * 22.35);
  const sunL = at(1330, 16.9), shadeL = at(1330, 7.4);
  return `${r.svg}
    ${pill(sunL[0], sunL[1], '○ grown in 95 % sunlight', at(1600, 20.6))}
    ${pill(shadeL[0], shadeL[1], '● grown in 28 % sunlight', at(1600, 12.0))}`;
}

function gaastraClip(p: string): string {
  const foot = 'Gaastra 1959, Meded Landbouwhogeschool Wageningen 59(13), Fig. 12A (spinach, 21–24 °C)';
  const r = clipImage(`${p}ga`, gaastraPng, 970, 880, 80, 64, 580, { win: [0, 0, 478, 362], rot: 1.0, seed: 47, foot });
  const lab = (u: number, v: number, s: string, to: V): string => { const c = r.at(u, v); return pill(c[0], c[1], s, to); };
  return `${r.svg}
    ${lab(470, 20, 'CO₂: 0.10–0.15 %', r.at(370, 76))}
    ${lab(470, 270, '0.017 %', r.at(380, 238))}`;
}

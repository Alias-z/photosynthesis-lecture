// Slide 13 · Chlorophyll fluorescence, staging A: one zoom-out, from photosystem II on the slide 13 chain (c2c3 look) to a
// pumpkin leaf in a leaf-clip fluorometer, a crop field seen from the air and the Earth from orbit (beats PP13).
// The scenes are nested: the chain card sits inside the leaf at the clip, the leaf scene inside the field, the field inside
// the Earth map at the US Corn Belt; the camera moves through them and each scene fades in and out with its size on the
// stage (pp13-common.ts sceneOp), so each scale reads alone. One click per scale.
// - Beat 1 (opens on the slide 13 chain figure): the Kautsky clipping appears with the 1931 induction curve drawn live.
// - Beat 2: zoom into photosystem II: light arrives; open reaction centres send most energy to photochemistry (thick
//   green arrow to plastoquinone) and little to fluorescence; then the centres close: the green arrow fades, the red
//   fluorescence widens; a fluorescence meter on the stage follows.
// - Beat 3: back to the whole chain (stop); out to the leaf in its clip, the fluorometer's trace at F_o (stop); the
//   saturating pulse flashes: the trace jumps to F_m and back, F_v/F_m = 0.83.
// - Beat 4: the leaf after 4.6 h at 548 µmol m⁻² s⁻¹ with repair blocked: the same pulse gives a lower peak, 0.52; the
//   healthy trace stays grey and dashed.
// - Beat 5: out to the crop field's SIF image from the air (stop), out to the Earth's SIF map; the US Corn Belt is marked.
import type { Part } from '../figs/chain';
import {
  chainGroup, counterScaler, fade, glyph, INK, kOf, lab, lerp, markers, mv, partsIn, putter, setters, slideCard, stroke,
  taggedChain, tfStr, tween, view, waveArrow, WHOLE, onStage, type Tf, type V,
} from './pp-stage';
import {
  clipSvg, comp, drawInduction, drawPulse, earthSvg, fieldSvg, flashAt, flashSvg, fmOf, FVFM_HURT, FVFM_OK, inductionSvg, inv,
  kautskyCard, leafSvg, nestAt, pulsePlotSvg, readoutSvg, sceneOp, type Box,
} from './pp13-common';
import { PP13 } from './beats-pp';
import type { Staging } from './types';

const P = 'pp13a';
/** Lit on the slide (figs/pp13f.ts LIT13). */
const LIT13: Part[] = ['psii', 'light-psii'];

/* ---------------------------------------------------------------- the scenes and where they sit */

const earth = earthSvg(`${P}e`, 150, 12, 1300);
const CB = earth.at(190, 86);
const field = fieldSvg(`${P}f`, 175, 17, 1250);
const FP = field.at(1180, 600);
/** The leaf scene: the leaf, its clip, the fluorometer box. */
const LEAF = { c: [440, 330] as V, R: 250, ang: 20 };
const CLIP: V = [LEAF.c[0] + 40, LEAF.c[1] - 50];
const PLOT: Box = { x: 1000, y: 170, w: 500, h: 280 };
/** Photosystem II on the stage in the whole chain view: the point that sits at the clip. */
const ANCH = onStage(WHOLE, [112, 320]);
const W_F: Tf = nestAt(CB, [800, 370], 7);
const W_L: Tf = comp(W_F, nestAt(FP, CLIP, 7));
const W_C: Tf = comp(W_L, nestAt(CLIP, ANCH, 10));
/** The views (world → stage). */
const V_E: Tf = { s: 1, t: [0, 0] }, V_F = inv(W_F), V_L = inv(W_L), V_C = inv(W_C);
const V_P: Tf = comp(view([280, 262], 2.4), comp(inv(WHOLE), inv(W_C)));

/* ---------------------------------------------------------------- timing (s into each beat) */

const B1 = { card: 0.05, curve: 0.3, curveD: 2.6, end: 3.1 };
const B2 = { out: 0.0, cam: 0.15, camD: 1.1, story: 1.1, close: 2.1, closeD: 0.8, end: 3.2 };
const B3 = { cam1: 0.1, cam1D: 1.1, stop1: 1.35, cam2: 1.45, cam2D: 1.3, fo: [2.3, 2.9] as [number, number], stop2: 2.95, run: 3.05, runD: 1.4, end: 4.7 };
const B4 = { lab: 0.05, run: 0.2, runD: 1.8, end: 2.3 };
const B5 = { cam1: 0.1, cam1D: 1.25, stop: 1.45, cam2: 1.55, cam2D: 1.25, cb: 2.7, end: 3.0 };
const TEND = [B1.end, B2.end, B3.end, B4.end, B5.end];
/** The trace's time axis u after the measuring light is on: F_o drawn to 0.42 on arrival; the pulse at 0.5. */
const U_FO = 0.42, U_END = 0.9;

/* ---------------------------------------------------------------- the story at photosystem II (figure units) */

const E_PATH = 'M144.7,320.6C145.0,318.3 143.2,312.2 146.5,306.5C149.8,300.8 153.6,289.1 164.5,286.5C175.4,284.0 204.1,290.4 212.0,291.1';
const LIGHT: Array<[V, V]> = [[[104, 120], [110, 254]], [[128, 118], [130, 255]], [[152, 122], [150, 256]]];
const FLUO: [V, V] = [[172, 261], [184, 150]];
const LAB = { photo: [262, 346] as V, fluo: [194, 140] as V, name: [112, 396] as V, light: [96, 132] as V };

function storySvg(): string {
  return `${markers(P)}
    ${LIGHT.map(([a, b], i) => waveArrow(P, `li${i}`, 'amber', a, b, 6, 4)).join('')}
    <path data-k="photo" class="ppa-ar" stroke="${INK.green}" d="${E_PATH}" marker-end="url(#${P}-m-green)" opacity="0" display="none"/>
    ${waveArrow(P, 'fluo', 'red', FLUO[0], FLUO[1], 6, 4.5)}
    ${glyph('l-photo', lab('photochemistry', 'ppa-l ppa-green ppa-halo', 0, 0))}
    ${glyph('l-fluo', lab('fluorescence', 'ppa-l ppa-red ppa-halo', 0, 0))}
    ${glyph('l-name', lab('photosystem II', 'ppa-l ppa-halo', 0, 0, 'middle'))}
    ${glyph('l-light', lab('light', 'ppa-l ppa-amber ppa-halo', 0, 0, 'middle'))}`;
}

/* ---------------------------------------------------------------- the leaf scene (its own stage frame) */

function leafScene(): string {
  const plot = pulsePlotSvg('tr', PLOT);
  return `<rect class="p13-card" x="16" y="12" width="1568" height="716" rx="24"/>
    ${leafSvg(LEAF.c[0], LEAF.c[1], LEAF.R, LEAF.ang)}
    ${clipSvg(CLIP[0], CLIP[1], [930, 300])}
    ${flashSvg(P, 'flash', CLIP[0], CLIP[1], 120)}
    ${lab('leaf clip', 'ppa-l ppa-halo', CLIP[0], CLIP[1] - 46, 'middle')}
    <g data-k="l-pulse" opacity="0" display="none">${lab('saturating pulse', 'ppa-l ppa-amber ppa-halo', CLIP[0], CLIP[1] + 74, 'middle')}</g>
    ${lab('pumpkin leaf', 'ppa-t', LEAF.c[0] + 170, 640, 'middle')}
    <g data-k="l-ok">${lab('dark-adapted, healthy', 'ppa-s', LEAF.c[0] + 170, 668, 'middle')}</g>
    <g data-k="l-hurt" opacity="0" display="none">${lab('4.6 h at 548 µmol m⁻² s⁻¹, D1 repair blocked', 'ppa-s ppa-red', LEAF.c[0] + 170, 668, 'middle')}</g>
    <rect class="ppa-box" x="930" y="60" width="630" height="640" rx="18"/>
    ${lab('fluorometer', 'ppa-t', 954, 100)}
    ${plot}
    ${readoutSvg('ro', 1000, 580)}
    <g data-k="ro2" opacity="0" display="none">${lab('healthy: 0.83', 'ppa-s', 1300, 584)}</g>
    ${lab('pumpkin: Tyystjärvi &amp; Aro 1996, PNAS, Fig. 1A', 'ppa-cr', 1544, 688, 'end')}`;
}

/* ---------------------------------------------------------------- the staging */

/** The clipping on the right of the chain card, the induction curve under the portraits. */
const cb = kautskyCard(P, 'kc', 1140, 36, 440, 250);
const IBOX: Box = { x: 1200, y: cb.y1 + 14, w: 350, h: 176 };
const KC = kautskyCard(P, 'kc', 1140, 36, 440, 250, inductionSvg('ind', IBOX));

export const STAGING: Staging = {
  id: 'a',
  name: 'A · One zoom-out (glow)',
  note: 'The slide 13 chain (c2c3 look): Kautsky’s clipping, then into photosystem II (open vs closed centres), then out scale by scale: leaf clip and saturating pulse, a damaged leaf, a crop field from the air, the Earth from orbit.',
  beats: PP13,
  holds: [[0], [], [1.35, 2.95], [], [1.45]],
  svg: () => `
    <g data-k="world">
      <g data-k="sc-earth">${earth.svg}</g>
      <g data-k="sc-field" transform="${tfStr(W_F)}">${field.svg}</g>
      <g data-k="sc-leaf" transform="${tfStr(W_L)}">${leafScene()}</g>
      <g data-k="sc-chain" transform="${tfStr(comp(W_C, WHOLE))}"><g class="fig">${slideCard(P)}${chainGroup('chain', 'glow', taggedChain(`${P}c`, 'glow', LIT13))}${storySvg()}</g></g>
    </g>
    <g data-k="meter" opacity="0" display="none"><rect class="ppa-box" x="1270" y="30" width="310" height="150" rx="16"/>
      ${lab('reaction centres', 'ppa-s', 1290, 62)}<g data-k="m-open">${lab('open', 'ppa-l ppa-green', 1290, 90)}</g><g data-k="m-shut" opacity="0" display="none">${lab('closed', 'ppa-l ppa-red', 1290, 90)}</g>
      ${lab('fluorescence', 'ppa-l ppa-red', 1290, 126)}<rect class="ppa-bar-bg" x="1290" y="140" width="270" height="22" rx="5"/><rect data-k="meter-bar" class="p13-meter" x="1290" y="140" width="0" height="22" rx="5"/></g>
    ${KC.svg}`,

  bind(stage) {
    const S = setters(stage), { q, set, op } = S, put = putter(S);
    const chainG = q('chain'), cs = counterScaler(chainG, S);
    const covered = ['e-psii-pq', 'pq-h-in'].flatMap(p => partsIn(chainG, p));
    const scenes: Array<[Element, Tf]> = [[q('sc-earth'), V_E], [q('sc-field'), W_F], [q('sc-leaf'), W_L], [q('sc-chain'), W_C]];
    let last = '';
    return (beatIn, t) => {
      const b = Math.max(0, Math.min(4, Math.round(beatIn)));
      const tt = Math.max(0, Math.min(t, TEND[b]));
      const key = `${b}:${tt.toFixed(3)}`;
      if (key === last) return;
      last = key;

      /* ---- camera */
      let cam: Tf;
      if (b === 0) cam = V_C;
      else if (b === 1) cam = tween(V_C, V_P, mv(tt, B2.cam, B2.camD));
      else if (b === 2) cam = tt < B3.stop1 ? tween(V_P, V_C, mv(tt, B3.cam1, B3.cam1D)) : tween(V_C, V_L, mv(tt, B3.cam2, B3.cam2D));
      else if (b === 3) cam = V_L;
      else cam = tt < B5.stop ? tween(V_L, V_F, mv(tt, B5.cam1, B5.cam1D)) : tween(V_F, V_E, mv(tt, B5.cam2, B5.cam2D));
      set(q('world'), 'transform', tfStr(cam));
      scenes.forEach(([el, w]) => op(el, sceneOp(cam.s * w.s)));
      const k = kOf(cam.s * W_C.s * WHOLE.s);
      cs(k);

      /* ---- beat 1: the Kautsky clipping and the induction curve */
      op(q('kc'), b === 0 ? fade(tt, B1.card, 0.15) : b === 1 ? 1 - fade(tt, B2.out, 0.15) : 0);
      drawInduction(S, 'ind', IBOX, b === 0 ? Math.max(0, Math.min(1, (tt - B1.curve) / B1.curveD)) : 1);

      /* ---- beat 2: open, then closed reaction centres */
      const story = b === 1 ? fade(tt, B2.story, 0.3) : b === 2 ? 1 - fade(tt, B3.cam1, 0.3) : 0;
      const shut = b === 1 ? mv(tt, B2.close, B2.closeD) : b > 1 ? 1 : 0;
      covered.forEach(g => op(g, 1 - story));
      LIGHT.forEach((_, i) => stroke(S, `li${i}`, 3.4, story));
      stroke(S, 'photo', lerp(12, 1.5, shut), story * lerp(1, 0.35, shut));
      stroke(S, 'fluo', lerp(2.6, 12, shut), story);
      put('l-photo', LAB.photo, k, story * lerp(1, 0.45, shut));
      put('l-fluo', LAB.fluo, k, story);
      op(q('m-open'), 1 - shut);
      op(q('m-shut'), shut);
      put('l-name', LAB.name, k, story);
      put('l-light', LAB.light, k, story);
      op(q('meter'), b === 1 ? fade(tt, B2.story - 0.2, 0.3) : 0);
      set(q('meter-bar'), 'width', (270 * lerp(0.22, 0.92, shut)).toFixed(1));

      /* ---- beats 3–4: the leaf clip, the pulse, the readout */
      let u = 0, fm = fmOf(FVFM_OK), old: number | null = null, flash = 0, pulseLab = 0, val = '–';
      if (b === 2) {
        u = tt < B3.run ? U_FO * Math.max(0, Math.min(1, (tt - B3.fo[0]) / (B3.fo[1] - B3.fo[0]))) : Math.min(U_END, U_FO + (U_END - U_FO) * (tt - B3.run) / B3.runD);
        const tf = B3.run + ((0.5 - U_FO) / (U_END - U_FO)) * B3.runD;
        flash = flashAt(tt, tf); pulseLab = tt >= tf ? 1 : 0;
        if (u >= 0.6) val = '0.83';
      } else if (b >= 3) {
        fm = fmOf(FVFM_HURT); old = fmOf(FVFM_OK);
        u = b === 3 ? Math.min(U_END, (U_END * (tt - B4.run)) / B4.runD) : U_END;
        const tf = B4.run + (0.5 / U_END) * B4.runD;
        if (b === 3) { flash = flashAt(tt, tf); pulseLab = tt >= tf ? 1 : 0; }
        val = u >= 0.6 ? '0.52' : '0.83';
      }
      drawPulse(S, 'tr', PLOT, Math.max(0, u), fm, old);
      op(q('flash'), flash);
      op(q('l-pulse'), pulseLab);
      set(q('ro-v'), 'text', val);
      op(q('ro2'), b >= 3 && u >= 0.6 ? 1 : 0);
      const hurt = b === 3 ? fade(tt, B4.lab, 0.15) : b > 3 ? 1 : 0;
      op(q('l-ok'), 1 - hurt);
      op(q('l-hurt'), hurt);

      /* ---- beat 5: the Corn Belt */
      op(q('cornbelt'), b === 4 ? fade(tt, B5.cb, 0.2) : 0);
    };
  },
};

// The CO₂ diffusion pathway, staging C: a journey through real images, the concentration readout fixed at the top right.
// Beat 1: the slide's wind figure (C10 v8, Dupont et al. 2025, Fig. 3), whole, then the camera on the low-wind leaf's surface; a click,
// then across to the high-wind leaf while C_s rises on the readout; beat 2: a stoma (tomato, SEM), CO₂ in and water vapour
// out, with the 150-to-500 count; beat 3: through the pore into the air spaces (wheat, micro-CT); beat 4: the slide's TEM
// figure (C10 v7, Clarke et al. 2021: stoma → air space → wall, the layers in a row under g_m); beat 5: an open and a
// closed stoma (succulent leaf, light micrographs), and Cᵢ and C_c fall on the readout. Images: photos/c7-stoma-sem.jpg
// (pore at 395, 265), photos/cp-lundgren-block.png, anim/cp10/stoma-open.jpg and stoma-closed.jpg (pore at 500, 250 and
// 492, 283 of 1000 × 587).
import openJpg from '../../assets/anim/cp10/stoma-open.jpg';
import closedJpg from '../../assets/anim/cp10/stoma-closed.jpg';
import ctPng from '../../assets/photos/cp-lundgren-block.png';
import semJpg from '../../assets/photos/c7-stoma-sem.jpg';
import { draw as c10 } from '../figs/cp10';
import { CP10_C } from './beats-cp';
import {
  beatClock, cardSvg, clipDefs, dive, f1, figInner, lerp, mv, photo, setters, stagePill, tfStr, tw, tween, view, type Tf, type V,
} from './cp-stage';
import { concCtl, concSvg, RO_BARS, sceneClip } from './cp10-common';
import type { Staging } from './types';

const P = 'cp10c';
const RO = { x: 1286, y: 22 };
/** v8's two leaf sections (figure units): low wind (A) and high wind (B), their surfaces near y 150. */
const WA = view(1.7, [178, 175], [520, 380]), WB = view(1.7, [509, 175], [520, 380]), WALL = view(1.0, [400, 300], [600, 372]);
const SEM = { x: 300, y: 60, w: 680, h: 590 }, CT = { x: 330, y: 92, w: 620, h: 519 };
const PORE: V = [SEM.x + (395 * SEM.w) / 760, SEM.y + (265 * SEM.h) / 660];
const CT_PT: V = [CT.x + CT.w * 0.45, CT.y + CT.h * 0.55];
const V7 = view(1.0, [400, 300], [640, 372]);
const OC = { w: 560, h: 329, y: 292, xo: 60, xc: 680 };
const ID: Tf = { s: 1, t: [0, 0] };
const TEND = [2.4, 1.9, 1.6, 1.6, 2.2];

const arrow = (k: string, d: string, cls: 'co2' | 'h2o', o = 0): string =>
  `<g data-k="${k}" opacity="${o}"><path class="cps-halo" d="${d}"/><path class="cps-arrow-${cls}" d="${d}" marker-end="url(#${P}-hd-${cls})"/></g>`;

export const STAGING: Staging = {
  id: 'c',
  name: 'C · Real images along the path',
  note: 'Real images only, readout fixed: Dupont’s wind figure (C10 v8), a stoma (SEM), wheat air spaces (micro-CT), Clarke’s TEM figure (C10 v7), then an open and a closed stoma.',
  beats: CP10_C,
  holds: [[1.0], [], [], [], []],
  svg: () => `${clipDefs(P)}
    <defs>${(['co2', 'h2o'] as const).map(k => `<marker id="${P}-hd-${k}" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="4" markerHeight="4" orient="auto"><path class="cps-hd-${k}" d="M0,0.6 L10,5 L0,9.4z"/></marker>`).join('')}</defs>
    ${sceneClip(P)}<g clip-path="url(#${P}-scene)"><g data-k="wind" class="fig">${cardSvg(`${P}w`)}${figInner(c10('v8'), 'cp10v8', `${P}v8`)}</g></g>
    <g data-k="semg" opacity="0">
      ${photo(P, 'sem', semJpg, 760, 660, SEM.x, SEM.y, SEM.w, SEM.h, { credit: 'tomato stoma, SEM: Dartmouth Electron Microscope Facility, public domain', o: 1 })}
      ${arrow('a-co2', `M${f1(PORE[0] - 170)},${f1(PORE[1] - 150)} Q${f1(PORE[0] - 50)},${f1(PORE[1] - 125)} ${f1(PORE[0] - 14)},${f1(PORE[1] - 8)}`, 'co2', 1)}
      ${arrow('a-h2o', `M${f1(PORE[0] + 16)},${f1(PORE[1] - 6)} Q${f1(PORE[0] + 60)},${f1(PORE[1] - 135)} ${f1(PORE[0] + 190)},${f1(PORE[1] - 152)}`, 'h2o', 1)}
      ${stagePill('l-co2', PORE[0] - 180, PORE[1] - 180, 'CO₂ in', 'co2', 1)}${stagePill('l-h2o', PORE[0] + 200, PORE[1] - 182, 'H₂O out', 'h2o', 1)}
      ${stagePill('cnt', SEM.x + SEM.w / 2, SEM.y + SEM.h - 50, '150 to over 500 H₂O per CO₂', 'h2o')}
    </g>
    <g data-k="ctg" opacity="0">
      ${photo(P, 'ct', ctPng, 460, 385, CT.x, CT.y, CT.w, CT.h, { win: [6, 0, 448, 356], label: 'air spaces (yellow) between mesophyll cells, wheat', credit: 'micro-CT: Lundgren et al. 2019, Nat. Commun., Fig. 2a, CC BY 4.0', o: 1, back: true })}
      ${stagePill('l-ci', CT.x + CT.w / 2, CT.y + CT.h + 62, '<tspan font-style="italic">C</tspan><tspan baseline-shift="sub" font-size="70%">i</tspan> ≈ 300 µmol mol⁻¹', 'paper')}
    </g>
    <g data-k="tem" class="fig" opacity="0">${cardSvg(`${P}t`)}${figInner(c10('v7'), 'cp10v7', `${P}v7`)}</g>
    ${stagePill('slow', 640, 626, 'in water: ≈ 10,000 × slower', 'co2')}
    <g data-k="oc" opacity="0">
      ${photo(P, 'po', openJpg, 1000, 587, OC.xo, OC.y, OC.w, OC.h, { label: 'open stoma', o: 1 })}
      ${arrow('o-co2', `M${f1(OC.xo + 0.5 * OC.w - 70)},${OC.y - 0} Q${f1(OC.xo + 0.5 * OC.w - 20)},${OC.y + 40} ${f1(OC.xo + 0.5 * OC.w - 6)},${f1(OC.y + 0.425 * OC.h)}`, 'co2', 1)}
      ${arrow('o-h2o', `M${f1(OC.xo + 0.5 * OC.w + 8)},${f1(OC.y + 0.43 * OC.h)} Q${f1(OC.xo + 0.5 * OC.w + 24)},${OC.y + 40} ${f1(OC.xo + 0.5 * OC.w + 76)},${OC.y - 0}`, 'h2o', 1)}
      ${stagePill('o-l1', OC.xo + 0.5 * OC.w - 112, OC.y + 26, 'CO₂ in', 'co2', 1)}${stagePill('o-l2', OC.xo + 0.5 * OC.w + 140, OC.y + 26, 'H₂O out', 'h2o', 1)}
      <text class="cps-credit" x="${OC.xo}" y="${OC.y + OC.h + 24}">succulent leaf sections: Berkshire Community College Bioscience Image Library, CC0</text>
    </g>
    <g data-k="ocC" opacity="0">${photo(P, 'pc', closedJpg, 1000, 587, OC.xc, OC.y, OC.w, OC.h, { label: 'closed stoma', o: 1 })}</g>
    <text class="cps-sub" data-k="air" x="640" y="${OC.y - 60}" text-anchor="middle" opacity="0">outside air above, leaf below</text>
    ${concSvg('ro', RO.x, RO.y)}`,

  bind(stage) {
    const S = setters(stage), { q, set, op } = S;
    const ro = concCtl(S, 'ro', RO.y);
    let last = '';
    return (beatIn, t) => {
      const b = Math.max(0, Math.min(4, Math.round(beatIn))), tt = Math.max(0, Math.min(t, TEND[b]));
      const key = `${b}:${tt.toFixed(3)}`;
      if (key === last) return;
      last = key;
      const T = beatClock(b, tt), t0 = T(0), t1 = T(1), t2 = T(2), t3 = T(3), t4 = T(4);

      // beat 1: the wind figure, low wind (A) first; after the click across to high wind (B), C_s rises
      const up = tw(t0, 1.5, 2.2);
      set(q('wind'), 'transform', tfStr(t0 < 1.05 ? tween(WALL, WA, mv(t0, 0.05, 0.9)) : tween(WA, WB, mv(t0, 1.1, 1.0))));
      op(q('wind'), 1 - tw(t1, 0, 0.5));
      // beat 2: the stoma; beat 3: through its pore into the air spaces
      const e = mv(t2, 0.1, 1.2);
      const [va, vb] = dive(ID, PORE, ID, CT_PT, 5, e);
      set(q('semg'), 'transform', tfStr(va)); set(q('ctg'), 'transform', tfStr(vb));
      op(q('semg'), tw(t1, 0.2, 0.7) * (1 - tw(e, 0.45, 0.8)));
      op(q('cnt'), tw(t1, 0.9, 1.1));
      op(q('ctg'), tw(e, 0.35, 0.75) * (1 - tw(t3, 0, 0.5)));
      op(q('l-ci'), tw(t2, 1.3, 1.5));
      // beat 4: the slide's TEM figure, CO₂ slowed in water
      set(q('tem'), 'transform', tfStr(V7));
      op(q('tem'), tw(t3, 0.3, 0.8) * (1 - tw(t4, 0, 0.5)));
      op(q('slow'), tw(t3, 1.0, 1.2) * (1 - tw(t4, 0, 0.3)));
      // beat 5: an open stoma, and beside it a closed one; Cᵢ and C_c fall
      op(q('oc'), tw(t4, 0.3, 0.8)); op(q('air'), tw(t4, 0.3, 0.8));
      const cl = tw(t4, 1.2, 1.9);
      op(q('ocC'), cl);
      // the readout: C_s up with the wind; the pair across each step lit; Cᵢ and C_c down as the stomata close
      const hl = b === 0 ? { ca: 1, cs: 1 } : b === 1 ? { cs: 1, ci: 1 } : b === 2 ? { ci: 1 } : b === 3 ? { ci: 1, cc: 1 } : { ci: 1 - cl, cc: 1 - cl };
      ro({ up: b === 0 ? up : 0, cs: lerp(RO_BARS.cs, RO_BARS.csWind, b === 0 ? up : 0), ci: lerp(RO_BARS.ci, RO_BARS.ciClosed, cl), cc: lerp(RO_BARS.cc, RO_BARS.ccClosed, cl), down: cl, hl });
    };
  },
};

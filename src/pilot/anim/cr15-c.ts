// From leaf to loaf, staging C · "Real images first": a SoyFACE soybean plot (Aspray et al. 2023 Fig. 1b, CC BY 4.0)
// beside slide figure C15 v9; the published energy cascade (Zhu, Long & Ort 2010 Fig. 2) with a ring stepping down the C₃
// path and a readout of the sunlight left and the loss at each step; the yield chain (v3 → v4); the bypass tobacco (South
// et al. 2019 Fig. 3A) with the field gains; a wheat ear (CC0) and its endosperm filling with starch, 10, 15 and 20 days
// after flowering, and the mature grain's granules (Chen et al. 2024 Figs. 9A, 6B, CC BY 4.0); last, the chain (v3).
// Clicks: 1 · squares | 2 · glide to Fig. 2 ▸ the steps | 3 · glide to the chain ▸ breeding's two links | 4 · glide to the
// tobacco ▸ field gains | 5 · glide to the ear ▸ endosperm, day by day ▸ the chain.
import {
  camAt, clock, drawHbar, fd, figCard, glyph, hbar, imageClip, pill, placeCard, put, setters, slideView, smooth, T, tfStr, view,
  type Move, type V,
} from './cr-kit';
import { FIG, IMG, squaresAnim } from './cr15-common';
import type { Staging } from './types';
import { keyLines } from './stage-keys';

const P = 'c15c';
const VX = [0, 1800, 3600, 5400, 7200, 9300];
// beat 1: the soybean plot and v9
const SOY = { x: 40, y: 130, w: 600, win: [8, 40, 282, 222] };
const V9 = { x: 760, y: 90, k: 0.85 };
// beat 2: the published cascade and its readout
const ZF = { x: VX[1] + 60, y: 30, w: 660 };
const RD = { x: VX[1] + 830, y: 170 };
/** The C₃ path down Zhu Fig. 2 (image pixels of the number), the share left (%) and the loss named on the figure. */
const STEPS: Array<{ u: number; v: number; left: string; loss: string }> = [
  { u: 320, v: 103, left: '100 %', loss: 'sunlight on the leaf' },
  { u: 320, v: 186, left: '48.7 %', loss: '− 51.3 outside 400–700 nm' },
  { u: 320, v: 282, left: '43.8 %', loss: '− 4.9 reflected, transmitted' },
  { u: 320, v: 360, left: '37.2 %', loss: '− 6.6 photochemical inefficiency' },
  { u: 320, v: 444, left: '23.4 %', loss: '− 13.8 thermodynamic limit' },
  { u: 137, v: 634, left: '12.6 %', loss: '− 10.8 carbohydrate synthesis' },
  { u: 137, v: 715, left: '6.5 %', loss: '− 6.1 photorespiration' },
  { u: 137, v: 797, left: '4.6 %', loss: '− 1.9 respiration' },
];
const STEP_DT = 0.42;
// beat 3: the chain
const CH = { x: VX[2], y: 70 };
// beat 4: the tobacco and the gains
const TP = { x: VX[3] + 40, y: 190, w: 1000 };
const TB = { x: VX[3] + 1100, y: 300 };
const GAINS = [{ k: 'g16', label: 'field 2016', v: 20 }, { k: 'g17', label: 'field 2017', v: 24 }];
const GK = 16;
// beat 5: the ear, the endosperm day by day, the mature granules; the chain
const EAR = { x: VX[4] + 40, y: 46, w: 330, win: [580, 40, 360, 720] };
const DAYS = [{ d: '10', win: [27, 26, 232, 152] }, { d: '15', win: [265, 26, 232, 152] }, { d: '20', win: [502, 26, 236, 152] }];
const SEM = { x: VX[4] + 420, y: 120, w: 360, gap: 14 };
const GR = { x: VX[4] + 420, y: 450, w: 160, win: [16, 340, 189, 286] };
const END = { x: VX[5], y: 70 };

const HOME = view(758, 370, 1600);
const MOVES: Move[] = [
  { beat: 1, t0: 0, d: 1.0, to: view(VX[1] + 800, 370, 1600) },
  { beat: 2, t0: 0, d: 1.0, to: slideView(CH.x, CH.y) },
  { beat: 3, t0: 0, d: 1.0, to: view(VX[3] + 800, 370, 1600) },
  { beat: 4, t0: 0, d: 1.0, to: view(VX[4] + 800, 370, 1600) },
  { beat: 4, t0: 3.6, d: 1.0, to: slideView(END.x, END.y) },
];

const BASE: Staging = {
  id: 'c',
  name: 'C · Real images first',
  note: 'SoyFACE plot + squares (v9); the published cascade stepped down; the chain (v3 → v4); bypass tobacco; ear and endosperm SEM.',
  holds: [[0], [1.05], [1.05], [1.05], [1.05, 3.5]],
  svg: () => {
    const soy = imageClip(`${P}-soy`, IMG.soyB, SOY.x, SOY.y, SOY.w, { win: SOY.win, rot: 0, seed: 91, m: 12 });
    const zf = imageClip(`${P}-zf`, IMG.zhu, ZF.x, ZF.y, ZF.w, { fig: true, rot: 0, seed: 93, m: 14 });
    const tp = imageClip(`${P}-tp`, IMG.south, TP.x, TP.y, TP.w, { win: [22, 8, 746, 300], rot: 0, seed: 95, m: 12 });
    const ear = imageClip(`${P}-ear`, IMG.ear, EAR.x, EAR.y, EAR.w, { win: EAR.win, rot: 0, seed: 97, m: 10 });
    const sem = DAYS.map((d, i) => imageClip(`${P}-s${i}`, IMG.chen9, SEM.x + i * (SEM.w + SEM.gap), SEM.y, SEM.w, { win: d.win, rot: 0, seed: 99 + i, m: 8 }));
    const gr = imageClip(`${P}-gr`, IMG.chen6, GR.x, GR.y, GR.w, { win: GR.win, rot: 0, seed: 103, m: 8 });
    const semH = sem[0].h;
    return `<g data-k="cam">
      ${soy.svg}
      ${pill(`${P}-psoy`, SOY.x + 300, SOY.y + soy.h - 40, 'soybean plot in its CO₂ pipe ring', soy.at(150, 200))}
      ${T(SOY.x + SOY.w, SOY.y + soy.h + 24, 'photo: Aspray et al. 2023, Sci Data, Fig. 1b · CC BY 4.0 (SoyFACE, Illinois)', 'cra-crd', 'end')}
      ${figCard(`${P}-v9`, FIG('v9'), V9.x, V9.y, V9.k)}
      ${zf.svg}
      ${T(ZF.x + ZF.w, ZF.y + zf.h + 22, 'Zhu, Long &amp; Ort 2010, Annu Rev Plant Biol, Fig. 2 · © Annual Reviews', 'cra-crd', 'end')}
      ${glyph(`${P}-ring`, '<circle class="cra-ring-k" cx="0" cy="0" r="30"/>')}
      ${T(RD.x, RD.y, 'C₃ crop: share of sunlight left', 'cra-lb')}
      <rect class="cra-box" x="${RD.x}" y="${RD.y + 26}" width="620" height="200" rx="16"/>
      <text data-k="${P}-left" class="cra-huge" x="${RD.x + 30}" y="${RD.y + 112}">100 %</text>
      <text data-k="${P}-loss" class="cra-l" x="${RD.x + 30}" y="${RD.y + 176}">sunlight on the leaf</text>
      <g data-k="${P}-c4" opacity="0">${T(RD.x, RD.y + 300, 'C₄ crop: 6.0 %', 'cra-big cra-c4')}${T(RD.x, RD.y + 344, 'no photorespiration loss', 'cra-s')}</g>
      ${figCard(`${P}-v3`, FIG('v3'), CH.x, CH.y)}
      ${figCard(`${P}-v4`, FIG('v4'), CH.x, CH.y, 1, {}, 0)}
      ${tp.svg}
      ${pill(`${P}-pu`, TP.x + 140, TP.y + 52, 'unmodified', tp.at(100, 175))}
      ${pill(`${P}-pb`, TP.x + 760, TP.y + 52, 'with bypass', tp.at(490, 140))}
      ${T(TP.x + TP.w, TP.y + tp.h + 24, 'photo: South et al. 2019, Science, Fig. 3A · CC BY 4.0', 'cra-crd', 'end')}
      ${T(TB.x, TB.y - 70, 'biomass with bypass', 'cra-lb')}${T(TB.x, TB.y - 36, 'vs unmodified tobacco', 'cra-s')}
      ${GAINS.map((g, i) => hbar(`${P}-${g.k}`, TB.x, TB.y + 66 + i * 110, g.label, 'cra-bar-up', 24 * GK)).join('')}
      ${ear.svg}
      ${pill(`${P}-pear`, EAR.x + EAR.w / 2, EAR.y + ear.h - 40, 'green ear', ear.at(760, 420))}
      ${T(SEM.x, SEM.y - 24, 'endosperm of the grain, days after flowering', 'cra-lb')}
      ${sem.map((s, i) => `<g data-k="${P}-day${i}" opacity="0">${s.svg}${T(SEM.x + i * (SEM.w + SEM.gap) + SEM.w / 2, SEM.y + semH + 34, `${DAYS[i].d} days`, 'cra-l', 'middle')}</g>`).join('')}
      <g data-k="${P}-mat" opacity="0">${gr.svg}${T(GR.x + GR.w + 30, GR.y + 60, 'mature grain:', 'cra-lb')}${T(GR.x + GR.w + 30, GR.y + 96, 'starch granules', 'cra-l')}</g>
      ${pill(`${P}-pst`, VX[4] + 1060, 540, 'starch granules', sem[2].at(640, 110))}
      ${T(VX[4] + 1560, 722, 'photo: P. Alexander, Wikimedia Commons · CC0 · SEM: Chen et al. 2024, Plant Physiol, Figs. 9A, 6B (wild type, durum wheat) · CC BY 4.0', 'cra-crd', 'end')}
      ${figCard(`${P}-end`, FIG('v3'), END.x, END.y)}
    </g>`;
  },
  bind(stage) {
    const S = setters(stage);
    const zf = imageClip(`${P}-zf`, IMG.zhu, ZF.x, ZF.y, ZF.w, { fig: true, rot: 0, seed: 93, m: 14 });
    const squares = squaresAnim(S, S.q(`${P}-v9`));
    return (beat, t) => {
      const T_ = clock(beat, t);
      S.set(S.q('cam'), 'transform', tfStr(camAt(HOME, MOVES, T_)));
      for (const k of ['psoy', 'pu', 'pb', 'pear']) S.op(S.q(`${P}-${k}`), 1);
      // 1 · the field's squares
      squares(Math.max(0, Math.min(1, T_(0) / 1.8)));
      // 2 · down the C₃ path, step by step
      const i = Math.max(0, Math.min(STEPS.length - 1, Math.floor((T_(1) - 1.1) / STEP_DT) + 1));
      const st = T_(1) < 1.1 ? STEPS[0] : STEPS[i];
      put(S, `${P}-ring`, zf.at(st.u, st.v) as V, 1);
      S.set(S.q(`${P}-left`), 'text', st.left);
      S.set(S.q(`${P}-loss`), 'text', st.loss);
      S.set(S.q(`${P}-loss`), 'class', i === 6 && T_(1) >= 1.1 ? 'cra-lb cra-c3' : 'cra-l');
      S.op(S.q(`${P}-c4`), fd(T_(1), 1.1 + STEPS.length * STEP_DT, 0.3));
      // 3 · breeding's two links light: v3 → v4
      const mix = fd(T_(2), 1.1, 0.5);
      placeCard(S, `${P}-v3`, CH.x, CH.y, 1, 1 - mix);
      placeCard(S, `${P}-v4`, CH.x, CH.y, 1, mix);
      // 4 · the field gains grow
      GAINS.forEach((g, k) => {
        const u = Math.max(0, Math.min(1, (T_(3) - 1.15 - k * 0.35) / 0.8));
        drawHbar(S, `${P}-${g.k}`, TB.x, g.v * smooth(u), GK, `+${g.v} %`, fd(u, 0, 0.25));
      });
      // 5 · the endosperm fills, day by day; then the mature grain
      [0, 1, 2].forEach(k => S.op(S.q(`${P}-day${k}`), fd(T_(4), 1.15 + k * 0.45, 0.3)));
      S.op(S.q(`${P}-pst`), fd(T_(4), 2.6, 0.3));
      S.op(S.q(`${P}-mat`), fd(T_(4), 2.95, 0.3));
    };
  },
};

/** The closing question on the stage, centred under the chain once the motion has finished (lecturer, 29 Oct 2026: on
 *  the stage only the closing question). */
export const STAGING: Staging = { ...BASE, keys: [
  ...keyLines(4, ['Which link of the chain would you improve?'], 800, 600, { size: 44, t0: 3.0 }),
] };

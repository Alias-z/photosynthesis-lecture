// From leaf to loaf, staging B · "The papers on the desk": the camera glides from paper to paper. Zhu, Long & Ort 2010
// beside slide figure C15 v9 (the field's squares grow in); their published Fig. 2 with the maxima (v1), photorespiration
// framed; Norman Borlaug (halftone of the USAID photo, 2004, public domain) beside the yield chain, v3 turning into v4;
// South et al. 2019 beside their tobacco photo, the field gains growing; then v5 (sucrose in the phloem), v6 (the endosperm)
// and, last, the chain (v3) as on the slide, for the question.
// Clicks: 1 · squares | 2 · glide to Fig. 2 ▸ photorespiration and the maxima | 3 · glide to Borlaug ▸ breeding's two
// links | 4 · glide to South 2019 ▸ field gains | 5 · glide to the shoot (phloem) ▸ the endosperm ▸ the chain.
import {
  camAt, clock, drawHbar, fd, figCard, hbar, imageClip, partsIn, pill, placeCard, portraitClip, setters, showParts, slideView, smooth, T, tfStr, view,
  type Move,
} from './cr-kit';
import { BORLAUG, FIG, IMG, phloemAnim, southClip, squaresAnim, V1_HIDE, zhuClip } from './cr15-common';
import type { Staging } from './types';

const P = 'c15b';
const VX = [0, 1800, 3600, 5400, 7400, 9300, 11200];
// beat 1: Zhu 2010 and v9
const ZC = { x: 40, y: 200, w: 600 };
const V9 = { x: 720, y: 96, k: 0.85 };
// beat 2: v1
const V1 = { x: VX[1], y: 70 };
// beat 3: Borlaug and the chain
const POR = { x: VX[2] + 70, y: 120, w: 340 };
const CH = { x: VX[2] + 520, y: 50, k: 1 };
// beat 4: South 2019, the photo, the gains
const SC = { x: VX[3] + 40, y: 46, w: 740 };
const SP = { x: VX[3] + 40, y: 360, w: 760 };
const SB = { x: VX[3] + 900, y: 300 };
const GAINS = [{ k: 'g16', label: 'field 2016', v: 20 }, { k: 'g17', label: 'field 2017', v: 24 }];
const GK = 20;
// beat 5: v5, v6, the chain
const V5 = { x: VX[4], y: 70 }, V6 = { x: VX[5], y: 70 }, END = { x: VX[6], y: 70 };

const HOME = view(780, 370, 1600);
const MOVES: Move[] = [
  { beat: 1, t0: 0, d: 1.0, to: slideView(V1.x, V1.y) },
  { beat: 2, t0: 0, d: 1.0, to: view(VX[2] + 790, 370, 1600) },
  { beat: 3, t0: 0, d: 1.0, to: view(VX[3] + 720, 370, 1600) },
  { beat: 4, t0: 0, d: 1.0, to: slideView(V5.x, V5.y) },
  { beat: 4, t0: 2.7, d: 1.0, to: slideView(V6.x, V6.y) },
  { beat: 4, t0: 3.8, d: 1.0, to: slideView(END.x, END.y) },
];

export const STAGING: Staging = {
  id: 'b',
  name: 'B · The papers on the desk',
  note: 'Zhu 2010 + field squares (v9); its Fig. 2 (v1); Borlaug + the chain (v3 → v4); South 2019 + tobacco; v5, v6; the chain.',
  holds: [[0], [1.05], [1.05], [1.05], [2.6, 3.7]],
  svg: () => {
    const sp = imageClip(`${P}-sp`, IMG.south, SP.x, SP.y, SP.w, { win: [22, 8, 746, 300], rot: 0, seed: 83, m: 14 });
    return `<g data-k="cam">
      ${zhuClip(`${P}-zc`, ZC.x, ZC.y, ZC.w).svg}
      ${figCard(`${P}-v9`, FIG('v9'), V9.x, V9.y, V9.k)}
      ${figCard(`${P}-v1`, FIG('v1'), V1.x, V1.y)}
      ${portraitClip(`${P}-por`, BORLAUG, POR.x, POR.y, POR.w, 'Norman Borlaug', 'Green Revolution wheats', -2).svg}
      ${figCard(`${P}-v3`, FIG('v3'), CH.x, CH.y, CH.k)}
      ${figCard(`${P}-v4`, FIG('v4'), CH.x, CH.y, CH.k, {}, 0)}
      ${southClip(`${P}-sc`, SC.x, SC.y, SC.w).svg}
      ${sp.svg}
      ${pill(`${P}-pu`, SP.x + 130, SP.y + 50, 'unmodified', sp.at(100, 175))}
      ${pill(`${P}-pb`, SP.x + 610, SP.y + 50, 'with bypass', sp.at(490, 140))}
      ${T(SP.x + SP.w, SP.y + sp.h + 24, 'photo: South et al. 2019, Science, Fig. 3A · CC BY 4.0', 'cra-crd', 'end')}
      ${T(SB.x, SB.y - 70, 'biomass with bypass', 'cra-lb')}${T(SB.x, SB.y - 36, 'vs unmodified tobacco', 'cra-s')}
      ${GAINS.map((g, i) => hbar(`${P}-${g.k}`, SB.x, SB.y + 66 + i * 110, g.label, 'cra-bar-up', 24 * GK)).join('')}
      ${figCard(`${P}-v5`, FIG('v5'), V5.x, V5.y)}
      ${figCard(`${P}-v6`, FIG('v6'), V6.x, V6.y)}
      ${figCard(`${P}-end`, FIG('v3'), END.x, END.y)}
    </g>`;
  },
  bind(stage) {
    const S = setters(stage);
    const squares = squaresAnim(S, S.q(`${P}-v9`)), phloem = phloemAnim(S, S.q(`${P}-v5`));
    const frame = S.q(`${P}-v1`).querySelector('rect.cr-ci');
    const v1 = partsIn(S.q(`${P}-v1`), V1_HIDE);
    return (beat, t) => {
      const T_ = clock(beat, t);
      S.set(S.q('cam'), 'transform', tfStr(camAt(HOME, MOVES, T_)));
      S.op(S.q(`${P}-pu`), 1);
      S.op(S.q(`${P}-pb`), 1);
      // 1 · the field's squares
      squares(Math.max(0, Math.min(1, T_(0) / 1.8)));
      // 2 · Fig. 2: photorespiration framed, then the maxima
      if (frame) S.op(frame, fd(T_(1), 1.1, 0.3));
      showParts(S, v1.max, fd(T_(1), 1.6, 0.4));
      // 3 · breeding's two links light: v3 → v4
      const mix = fd(T_(2), 1.1, 0.5);
      placeCard(S, `${P}-v3`, CH.x, CH.y, CH.k, 1 - mix);
      placeCard(S, `${P}-v4`, CH.x, CH.y, CH.k, mix);
      // 4 · the field gains grow
      GAINS.forEach((g, i) => {
        const u = Math.max(0, Math.min(1, (T_(3) - 1.15 - i * 0.35) / 0.8));
        drawHbar(S, `${P}-${g.k}`, SB.x, g.v * smooth(u), GK, `+${g.v} %`, fd(u, 0, 0.25));
      });
      // 5 · sucrose in the phloem
      phloem(Math.min(T_(4), 2.6) - 0.9);
    };
  },
};

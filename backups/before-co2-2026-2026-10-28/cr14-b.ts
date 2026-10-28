// Rising CO₂, staging B · "History, clipping by clipping": a desk of newsprint, the camera gliding from one paper to the
// next. Keeling (halftone portrait, NSF photo 2001, public domain) beside the published NOAA/Scripps graph, a dot tracing
// the record with the readout; Kimball 1983; Long et al. 2006 with the FACE ring photo and the yield readout; Leakey et al.
// 2009 beside slide figure C14 v3 (the 2050 points move); Myers et al. 2014 beside its Fig. 1, the wheat points ringed.
// Clicks: 1 · trace | 2 · glide ▸ bar | 3 · glide ▸ FACE bars | 4 · glide ▸ 2050 | 5 · glide ▸ wheat nutrients.
import {
  camAt, clock, drawHbar, fd, figCard, glyph, hbar, imageClip, portraitClip, put, setters, smooth, T, tfStr, view, type Move, type V,
} from './cr-kit';
import {
  drawFinding, drawPuffs, FACE_C3, FACE_C4, FIG, findingsSvg, GREENHOUSE, IMG, KEEL_D, keelAt, KEELING, kimballClip, leafAnim,
  leakeyClip, longClip, myersClip, noaaPx, puffsSvg,
} from './cr14-common';
import type { Staging } from './types';

const P = 'c14b';
const VX = [0, 1700, 3400, 5100, 6800];
// beat 1: portrait, the published graph, the readout
const POR = { x: 70, y: 110, w: 330 };
const NG = { x: 440, y: 46, w: 820 };
const RD = { x: 1295, y: 230 };
// beat 2: Kimball's clipping over his result
const KIM = { x: VX[1] + 420, y: 90, w: 760 };
const F2 = { x: VX[1] + 440, y: 470 };
// beat 3: Long et al. 2006 and the FACE ring; the readout of all three findings
const LONG = { x: VX[2] + 60, y: 54, w: 690 };
const FP = { x: VX[2] + 70, y: 370, w: 660 };
const F3 = { x: VX[2] + 860, y: 150 };
// beat 4: Leakey et al. 2009 and slide figure v3
const LEA = { x: VX[3] + 30, y: 170, w: 600 };
const V3 = { x: VX[3] + 700, y: 100, k: 0.88 };
// beat 5: Myers et al. 2014, its Fig. 1 and the wheat readout
const MY = { x: VX[4] + 60, y: 60, w: 560 };
const MF = { x: VX[4] + 690, y: 70, w: 860 };
const W5 = { x: VX[4] + 600, y: 360 }, WL = VX[4] + 80;
/** Wheat zinc, iron and protein in Myers Fig. 1 (image pixels, measured on the image: zero line y 172, 9.9 px per %). */
const WHEAT: Array<{ n: string; u: number; v: number; val: number }> = [
  { n: 'zinc', u: 69, v: 172 + 9.3 * 9.9, val: -9.3 }, { n: 'iron', u: 93, v: 172 + 5.1 * 9.9, val: -5.1 }, { n: 'protein', u: 116, v: 172 + 6.3 * 9.9, val: -6.3 },
];
const W_KX = 22;

const MOVES: Move[] = [1, 2, 3, 4].map(b => ({ beat: b, t0: 0, d: 1.0, to: view(VX[b] + (b === 2 ? 680 : 800), 370, 1600) }));
MOVES[2] = { beat: 3, t0: 0, d: 1.0, to: view(VX[3] + 736, 370, 1600) };

export const STAGING: Staging = {
  id: 'b',
  name: 'B · History, clipping by clipping',
  note: 'Keeling, Kimball 1983, Long 2006, Leakey 2009, Myers 2014 as clippings beside the real graphs; slide figure v3 for the leaf.',
  holds: [[0], [1.1], [1.1], [1.1], [1.1]],
  svg: () => {
    const por = portraitClip(`${P}-por`, KEELING, POR.x, POR.y, POR.w, 'Charles David Keeling', 'Mauna Loa, from 1958', -2);
    const ng = imageClip(`${P}-ng`, IMG.noaa, NG.x, NG.y, NG.w, { rot: 0, seed: 37, m: 14 });
    const fp = imageClip(`${P}-fp`, IMG.face, FP.x, FP.y, FP.w, { win: [0, 90, 1464, 600], rot: 0, seed: 47, m: 14 });
    const mf = imageClip(`${P}-mf`, IMG.myers, MF.x, MF.y, MF.w, { fig: true, rot: 0, seed: 59, m: 16 });
    const rings = WHEAT.map((_w, i) => { return glyph(`${P}-ring${i}`, `<circle class="cra-ring" cx="0" cy="0" r="17"/>`); }).join('');
    const wbars = WHEAT.map((w, i) => hbar(`${P}-w${i}`, W5.x, W5.y + 70 + i * 92, '', 'cra-bar-dn')
      + T(WL, W5.y + 70 + i * 92 + 30, w.n, 'cra-l')).join('');
    return `<g data-k="cam">
      ${por.svg}${ng.svg}
      ${T(NG.x + NG.w, NG.y + ng.h + 26, 'graph: NOAA Global Monitoring Laboratory &amp; Scripps Institution of Oceanography, Oct 2026', 'cra-crd', 'end')}
      ${glyph(`${P}-dot`, '<circle class="cra-dot" cx="0" cy="0" r="9"/>')}
      <rect class="cra-box" x="${RD.x}" y="${RD.y}" width="250" height="122" rx="14"/>
      <text data-k="${P}-yr" class="cra-big" x="${RD.x + 22}" y="${RD.y + 52}">1959</text>
      <text data-k="${P}-ppm" class="cra-big cra-red" x="${RD.x + 22}" y="${RD.y + 104}">316 ppm</text>
      ${T(RD.x + 4, RD.y - 18, 'yearly mean', 'cra-s')}
      ${kimballClip(`${P}-kc`, KIM.x, KIM.y, KIM.w).svg}
      ${findingsSvg(`${P}f2`, F2.x, F2.y, [GREENHOUSE], 'yield gain, 1983')}
      ${longClip(`${P}-lc`, LONG.x, LONG.y, LONG.w).svg}
      ${fp.svg}<g>${puffsSvg(P, 12)}</g>
      ${T(FP.x + FP.w, FP.y + fp.h + 26, 'photo: B. Kimball, USDA-ARS, wheat FACE ring (1993) · public domain', 'cra-crd', 'end')}
      ${findingsSvg(`${P}f3`, F3.x, F3.y, [GREENHOUSE, FACE_C3, FACE_C4], 'yield gain')}
      ${leakeyClip(`${P}-ec`, LEA.x, LEA.y, LEA.w).svg}
      ${figCard(`${P}-v3`, FIG('v3'), V3.x, V3.y, V3.k)}
      ${myersClip(`${P}-mc`, MY.x, MY.y, MY.w).svg}
      ${mf.svg}${rings}
      ${T(MF.x + MF.w, MF.y + mf.h + 26, 'Myers et al. 2014, Nature, Fig. 1 · © Springer Nature (author manuscript)', 'cra-crd', 'end')}
      ${T(WL, W5.y + 18, 'wheat grain, ≈ 550 ppm', 'cra-lb')}
      <path class="cra-zero" d="M${W5.x},${W5.y + 50} V${W5.y + 70 + 2 * 92 + 60}"/>
      ${wbars}
    </g>`;
  },
  bind(stage) {
    const S = setters(stage);
    const ng = imageClip(`${P}-ng`, IMG.noaa, NG.x, NG.y, NG.w, { rot: 0, seed: 37, m: 14 });
    const fp = imageClip(`${P}-fp`, IMG.face, FP.x, FP.y, FP.w, { win: [0, 90, 1464, 600], rot: 0, seed: 47, m: 14 });
    const mf = imageClip(`${P}-mf`, IMG.myers, MF.x, MF.y, MF.w, { fig: true, rot: 0, seed: 59, m: 16 });
    const leaf = leafAnim(S, S.q(`${P}-v3`));
    const HOME = view(800, 370, 1600);
    return (beat, t) => {
      const T_ = clock(beat, t);
      S.set(S.q('cam'), 'transform', tfStr(camAt(HOME, MOVES, T_)));
      // 1 · the dot traces the published record; the readout follows it
      const k = keelAt(Math.min(1, Math.max(0, T_(0)) / KEEL_D)), px = noaaPx(k.dec, k.ppm);
      put(S, `${P}-dot`, ng.at(px[0], px[1]) as V, 1);
      S.set(S.q(`${P}-yr`), 'text', `${k.year}`);
      S.set(S.q(`${P}-ppm`), 'text', `${k.mean.toFixed(0)} ppm`);
      // 2 · Kimball's result
      drawFinding(S, `${P}f2`, F2.x, GREENHOUSE, Math.max(0, Math.min(1, (T_(1) - 1.15) / 0.9)));
      // 3 · CO₂ from the ring's pipes; the greenhouse bar stands as found, the FACE bars grow
      drawPuffs(S, P, (u, v) => fp.at(u, v) as V, T_(2), 0.5, fp.at(760, 0)[0]);
      drawFinding(S, `${P}f3`, F3.x, GREENHOUSE, 1);
      drawFinding(S, `${P}f3`, F3.x, FACE_C3, Math.max(0, Math.min(1, (T_(2) - 1.2) / 0.8)));
      drawFinding(S, `${P}f3`, F3.x, FACE_C4, Math.max(0, Math.min(1, (T_(2) - 1.5) / 0.6)));
      // 4 · the 2050 points
      leaf(Math.max(0, Math.min(1, (T_(3) - 1.2) / 1.1)), fd(T_(3), 2.3, 0.3));
      // 5 · the wheat points ringed one by one, their bars grow
      WHEAT.forEach((w, i) => {
        const u = Math.max(0, Math.min(1, (T_(4) - 1.2 - i * 0.35) / 0.6));
        put(S, `${P}-ring${i}`, mf.at(w.u, w.v) as V, fd(u, 0, 0.3), 0.6 + 0.4 * smooth(u * 2));
        drawHbar(S, `${P}-w${i}`, W5.x, w.val * smooth(u), W_KX, `−${Math.round(-w.val)} %`, fd(u, 0, 0.25));
      });
    };
  },
};

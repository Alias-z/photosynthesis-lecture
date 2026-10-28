// To the reaction centre, staging B "Newspaper desk". Emerson & Arnold's 1932 clipping lies on the desk (the Bristol
// paper): their halftone portraits and their Fig. 1, where the yield per flash levels off, beside the flash experiment.
// The camera later zooms from the field of 2,400 chlorophylls into one antenna, onto the real photosystem II structure
// (PDB 5XNL, pea) printed as a newspaper halftone. Brisk motion with a click stop at each talking point
// (lecturer, 27 Oct 2026): every click plays one short move and stops; clippings, portraits, cards and labels just
// appear.
// - Beat 1. From the start, the readout on the right ("O₂ per flash: –") and the dim field of 2,400 chlorophylls; a
//   click stop before the flash. Then the lamp flashes; at that instant the whole field lights up and the readout turns
//   to "1 O₂ per ~2,400 chlorophylls" with a small rising bubble; 0.3 s later the glow drains into the 8 reaction
//   centres (≈ 1 s), which appear only as the drain begins.
// - Beat 2, three clicks, as staging A. Click 1 (≈ 1 s): in the field, the patch of one reaction centre (its 286
//   dots, ≈ 300 = 2,400 ÷ 8) gets an outline and the rest of the field dims; "antenna: ≈ 300 chlorophylls" under the
//   outline, "reaction centre" on its red dot. Click 2 (≈ 1.2 s): the camera zooms into the patch, which becomes the
//   printed structure, one reaction centre with its antenna (the complex's other half is not shown): "photosystem II ·
//   pea", "antenna" on a soft outline around its pigments (no number: this half holds 157 chlorophylls), "reaction
//   centre", the key. Click 3 (≈ 1.2 s): the antenna lights up from the reaction centre outward.
// - Beat 3, as staging A. Click 1: a blue photon lands on a Chl b at the outer edge of M-LHCII; "blue light" stays.
//   Click 2: the 19 hops (≈ 2.5 s), the staircase tracking them, and the reaction centre's flash, which stays.
// Shared drawings, sources and the physics notes: antenna-common.ts.
import './antenna-b.css';
import {
  ARNOLD, benchSvg, BENCH_DX, countersSvg, cutPath, dive, drawCounters, drawField, drawFlash, drawHop, drawLabel,
  drawPatch, drawPigments, drawStair, EMERSON, f1, FIELD_SPOTS_T, fieldSvg, FIG1, FIG1_AR, flashAt, hopPos, HOPS_END,
  ID_TF, keySvg, labelsSvg, lerpV, onStage, P680, packet, PATCH, PATCH_T, patchSvg, PATH_PTS, setters, smoother, spotAt,
  stairSvg, structureSvg, T, type Tf, tfStr, TIERS, type Tier, tw, type V, VIEW,
} from './antenna-common';
import type { Staging } from './types';

const P = 'anb';

/* ---------------------------------------------------------------- the clipping on the desk */

const DESK = { x: 60, y: 34, w: 880, h: 316, rot: -1 };
const POR = { w: 150, h: 188, y: 58, x1: 92, x2: 262 };
const FIG = { x: 480, y: 50, w: 380 };
const DC: V = [DESK.x + DESK.w / 2, DESK.y + DESK.h / 2];

function deskSvg(): string {
  const por = (href: string, x: number): string => `<image href="${href}" x="${x}" y="${POR.y}" width="${POR.w}" height="${POR.h}" preserveAspectRatio="xMidYMid slice"/>`;
  const ny = POR.y + POR.h + 34;
  return `<defs><filter id="${P}-desksh" x="-5%" y="-5%" width="110%" height="115%"><feDropShadow dx="2" dy="5" stdDeviation="7" flood-color="#3d3020" flood-opacity=".22"/></filter></defs>
    <g class="clip" transform="rotate(${DESK.rot} ${DC[0]} ${DC[1]})">
      <path class="clip-paper" d="${cutPath(DESK.x, DESK.y, DESK.w, DESK.h, 41, 4)}" filter="url(#${P}-desksh)"/>
      ${por(EMERSON, POR.x1)}${por(ARNOLD, POR.x2)}
      <text class="clip-name" x="${POR.x1 + POR.w / 2}" y="${ny}" text-anchor="middle" font-size="28">Emerson</text>
      <text class="clip-name" x="${POR.x2 + POR.w / 2}" y="${ny}" text-anchor="middle" font-size="28">Arnold</text>
      <text class="clip-find" x="${(POR.x1 + POR.x2 + POR.w) / 2}" y="${ny + 36}" text-anchor="middle" font-size="30">1932</text>
      <path class="anb-rule" d="M${FIG.x - 22},${POR.y}V${DESK.y + DESK.h - 24}"/>
      <image href="${FIG1}" x="${FIG.x}" y="${FIG.y}" width="${FIG.w}" height="${f1(FIG.w * FIG1_AR)}"/>
    </g>`;
}

/* ---------------------------------------------------------------- timing */

// Beat 1: the flash and the counters; click; the field and its drain.
const FLASH = 0.3, FIELD_IN = FLASH, DRAIN = FLASH + 0.3; // the readout switches at the flash; the drain ≈ 1 s
// Beat 2: the patch; click; the zoom into it (≈ 1.2 s); click; the lighting.
const H1 = PATCH_T + 0.1, DV: [number, number] = [H1 + 0.05, H1 + 1.25], H2 = DV[1] + 0.1;
const LIT: Record<Tier, number> = { rc: H2 + 0.05, core: H2 + 0.3, minor: H2 + 0.55, lhcii: H2 + 0.8 };
const LIT_FADE = 0.4;
// Beat 3: the photon lands; click; the hops; the trap.
const PH0 = 0.15, PH1 = 0.75, HOLD3 = 0.95, HOPS = HOLD3 + 0.05;
const TEND = [DRAIN + FIELD_SPOTS_T + 0.6, LIT.lhcii + LIT_FADE + 0.1, HOPS + HOPS_END + 0.75];
// The bench is drawn at 0.9 below the clipping, its flask at FLASK.
const BENCH_K = 0.9, FLASK: V = [520, 530];
const BENCH_TF = `matrix(${BENCH_K},0,0,${BENCH_K},${FLASK[0] - BENCH_K * (650 + BENCH_DX)},${FLASK[1] - BENCH_K * 500})`;
const S0 = spotAt(PATCH), ZF = 7; // the patch's reaction centre lands on P680; the field grows 7×
const PH_FROM: V = [1500, 112];

export const STAGING: Staging = {
  id: 'b',
  name: 'B · Newspaper desk',
  note: 'The 1932 clipping on the desk beside the experiment; the camera dives from the field of chlorophylls onto the printed structure.',
  holds: [[FLASH - 0.03], [H1, H2], [HOLD3]],
  svg: () => `
    ${structureSvg(P, 'b')}
    <g data-k="w-flash">
      <g data-k="w-desk">${deskSvg()}</g>
      <g class="anb-scene" data-k="w-bench"><g transform="${BENCH_TF}">${benchSvg(P, 'b')}</g></g>
      ${countersSvg(1016, 176)}
      <g data-k="w-field">${fieldSvg()}${patchSvg()}</g>
    </g>
    ${labelsSvg()}${keySvg(76, 716)}${stairSvg()}
    <g data-k="photon"><path class="an-photon" data-k="ph-wave"/></g>${T(0, 0, 'blue light', 'an-lab an-lab-photon', 'start', 'ph-lab')}`,

  bind(stage) {
    const S = setters(stage), { q, set, op } = S;
    const scene = (k: string, v: Tf, o: number): void => { const el = q(k); op(el, o); if (o > 0.004) set(el, 'transform', tfStr(v)); };
    let last = '';
    return (beatIn, t) => {
      const b = Math.max(0, Math.min(2, Math.round(beatIn)));
      const key = `${b}:${Math.max(0, Math.min(t, TEND[b])).toFixed(3)}`;
      if (key === last) return;
      last = key;
      const tb = (k: number): number => (b === k ? Math.max(0, t) : b > k ? 99 : 0);
      const t0 = tb(0), t1 = tb(1), t2 = tb(2);

      /* ---- beat 1: everything there at once; one flash and the counters; (click) the field drains */
      const in0 = b === 0 ? tw(t0, 0, 0.25) : 1;
      const over = b === 0 ? in0 : b === 1 ? 1 : 0; // the beat-1 parts stay into beat 2 and leave with its zoom
      op(q('w-desk'), over);
      op(q('w-bench'), over);
      drawFlash(S, 'b', b === 0 ? flashAt(t0, FLASH) : 0);
      drawCounters(S, t0 - FLASH, over);
      op(q('w-field'), over);
      drawField(S, b === 0 ? tw(t0, FLASH, FLASH + 0.08) : 1, b === 0 ? t0 - DRAIN : 99);
      const keyOut = b === 1 ? 1 - tw(t1, 0, 0.12) : 1; // the field's key gives way to the patch's labels
      op(q('fkey1'), over * keyOut * tw(t0, FIELD_IN, FIELD_IN + 0.25));
      op(q('fkey2'), over * keyOut * tw(t0, DRAIN + FIELD_SPOTS_T, DRAIN + FIELD_SPOTS_T + 0.25));

      /* ---- beat 2: the patch; (click) the zoom into it, onto the printed structure; (click) the antenna lights up */
      drawPatch(S, b === 1 ? 1 : 0, t1, 1 - tw(t1, DV[0], DV[0] + 0.12));
      const e = b === 1 ? smoother((t1 - DV[0]) / (DV[1] - DV[0])) : b > 1 ? 1 : 0;
      const [vw, vb] = dive(S0, onStage(VIEW, P680), ZF, e);
      scene('w-flash', b === 1 ? vw : ID_TF, b === 0 ? 1 : b === 1 ? 1 - tw(e, 0.35, 0.65) : 0);
      const vStruct: Tf = b === 1 ? { s: vb.s * VIEW.s, t: [vb.s * VIEW.t[0] + vb.t[0], vb.s * VIEW.t[1] + vb.t[1]] } : VIEW;
      scene('st', vStruct, b === 1 ? tw(e, 0.3, 0.6) : b > 1 ? 1 : 0);
      const atStruct = b === 1 ? tw(e, 0.8, 0.97) : b > 1 ? 1 : 0;

      const lit = (k: Tier): number => (b === 1 ? tw(t1, LIT[k], LIT[k] + LIT_FADE) : b > 1 ? 1 : 0);
      const back = b === 2 ? tw(t2, 0, 0.5) : 0;
      TIERS.forEach(k => op(q(`lit-${k}`), lit(k) * (1 - (k === 'rc' ? 0.4 : 0.55) * back)));
      op(q('rcring'), lit('rc'));
      const pl = (k: Tier): number => (0.5 + 0.5 * lit(k)) * (1 - 0.55 * back);
      const hx = b === 2 ? hopPos(t2 - HOPS) : 0, on = b === 2 ? tw(t2, PH1 - 0.05, PH1 + 0.15) : 0;
      drawPigments(S, { rc: pl('rc'), core: pl('core'), minor: pl('minor'), lhcii: pl('lhcii') }, on, hx);

      const fade3 = b === 2 ? 1 - tw(t2, 0, 0.3) : 1;
      drawLabel(S, 'rc', vStruct, 0, atStruct);
      op(q('lab-psii'), atStruct * fade3);
      op(q('lab-ant'), atStruct * fade3);
      op(q('antline'), atStruct * fade3);
      op(q('key'), atStruct);

      /* ---- beat 3: the photon lands; (click) the hops and the trap */
      op(q('stair'), b === 2 ? tw(t2, 0, 0.25) : 0);
      const pf = b === 2 ? (t2 - PH0) / (PH1 - PH0) : -1, start = onStage(VIEW, PATH_PTS[0]);
      // The packet is absorbed where it lands; its label stays beside the Chl b until the next click.
      op(q('photon'), pf > 0 && pf < 1.4 ? tw(pf, 0, 0.12) * (1 - tw(pf, 0.97, 1.35)) : 0);
      const pp = lerpV(PH_FROM, start, Math.max(0, Math.min(1, pf)));
      if (pf > 0 && pf < 1.4) {
        const ang = (Math.atan2(start[1] - PH_FROM[1], start[0] - PH_FROM[0]) * 180) / Math.PI;
        set(q('ph-wave'), 'd', packet(pp[0], pp[1], 450, ang, 130, 17));
      }
      const phl = q('ph-lab');
      op(phl, b === 2 ? tw(pf, 0, 0.15) * (1 - tw(t2, HOLD3, HOLD3 + 0.2)) : 0);
      set(phl, 'x', f1(pp[0] + 26)); set(phl, 'y', f1(pp[1] - 28));
      const trap = b === 2 ? Math.max(0, (t2 - HOPS - HOPS_END - 0.02) / 0.7) : 0;
      drawHop(S, hx, on, Math.min(1, trap));
      drawStair(S, hx, on, Math.min(1, trap));
    };
  },
};

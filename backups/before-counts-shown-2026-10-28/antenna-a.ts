// To the reaction centre, staging A "One continuous zoom". The lab bench of Emerson & Arnold's flash experiment, then
// one camera zoom without cuts from the field of 2,400 chlorophylls into one antenna, onto the real photosystem II
// structure (PDB 5XNL, pea), which the camera stays on for the path the energy takes to the reaction centre.
// Brisk motion with a click stop at each talking point (lecturer, 27 Oct 2026): every click plays one short move
// (≈ 1 s) and stops; nothing is gone before the next click. Clippings, portraits, cards and labels just appear.
// - Beat 1. From the start, the readout on the right ("O₂ per flash: –") and the dim field of 2,400 chlorophylls; a
//   click stop before the flash. Then the lamp flashes; at that instant the whole field lights up and the readout turns
//   to "1 O₂ per ~2,400 chlorophylls" with a small rising bubble; 0.3 s later the glow drains into the 8 reaction
//   centres (≈ 1 s), which appear only as the drain begins.
// - Beat 2, three clicks. Click 1 (≈ 1 s): in the field, the patch of one reaction centre (its 286 dots, ≈ 300 =
//   2,400 ÷ 8) gets an outline and the rest of the field dims; "antenna: ≈ 300 chlorophylls" under the outline,
//   "reaction centre" on its red dot. Click 2 (≈ 1.2 s): the camera zooms into the patch, which becomes the real
//   structure, one reaction centre with its antenna (the complex's other half is not shown): "photosystem II · pea",
//   "antenna" on a soft outline around its pigments (no number: this half holds 157 chlorophylls), "reaction centre",
//   the key. Click 3 (≈ 1.2 s): the antenna lights up from the reaction centre outward.
// - Beat 3. Click 1: a blue photon lands on a Chl b at the outer edge of M-LHCII (≈ 0.6 s); "blue light" stays. Click 2:
//   the excitation makes the 19 hops of slide 6's path (≈ 2.5 s), the energy staircase tracks it, and the reaction
//   centre flashes and stays lit.
// Shared drawings, sources and the physics notes: antenna-common.ts.
import './antenna-a.css';
import {
  benchSvg, countersSvg, dive, drawCounters, drawField, drawFlash, drawHop, drawLabel, drawPatch, drawPigments,
  drawStair, f1, FIELD_SPOTS_T, fieldSvg, fig1Clip, flashAt, hopPos, HOPS_END, ID_TF, keySvg, labelsSvg, lerpV, onStage,
  P680, packet, pairClip, PATCH, PATCH_T, patchSvg, PATH_PTS, setters, smoother, spotAt, stairSvg, structureSvg, T,
  type Tf, tfStr, TIERS, type Tier, tw, type V, VIEW,
} from './antenna-common';
import type { Staging } from './types';

const P = 'ana';

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
const S0 = spotAt(PATCH), ZF = 7; // the patch's reaction centre lands on P680; the field grows 7×
const PH_FROM: V = [1500, 112]; // the photon comes in from the upper right

export const STAGING: Staging = {
  id: 'a',
  name: 'A · One continuous zoom',
  note: 'From the lab bench, one zoom without cuts: from the field of chlorophylls into one antenna, onto photosystem II; then the path to the reaction centre.',
  holds: [[FLASH - 0.03], [H1, H2], [HOLD3]],
  svg: () => `
    ${structureSvg(P, 'a')}
    <g data-k="w-flash">
      <g class="ana-scene" data-k="w-bench">${benchSvg(P, 'b')}</g>
      <g data-k="clip">${pairClip(P, 60, 40, 286, -2.5)}${fig1Clip(P, 66, 322, 300, 1.8)}</g>
      ${countersSvg(1016, 176)}${fieldSvg()}${patchSvg()}
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
      drawFlash(S, 'b', b === 0 ? flashAt(t0, FLASH) : 0);
      scene('w-bench', ID_TF, over);
      op(q('clip'), over);
      drawCounters(S, t0 - FLASH, over);
      op(q('field'), over);
      drawField(S, b === 0 ? tw(t0, FLASH, FLASH + 0.08) : 1, b === 0 ? t0 - DRAIN : 99);
      const keyOut = b === 1 ? 1 - tw(t1, 0, 0.12) : 1; // the field's key gives way to the patch's labels
      op(q('fkey1'), over * keyOut * tw(t0, FIELD_IN, FIELD_IN + 0.25));
      op(q('fkey2'), over * keyOut * tw(t0, DRAIN + FIELD_SPOTS_T, DRAIN + FIELD_SPOTS_T + 0.25));

      /* ---- beat 2: the patch; (click) the zoom into it, onto the structure; (click) the antenna lights up */
      drawPatch(S, b === 1 ? 1 : 0, t1, 1 - tw(t1, DV[0], DV[0] + 0.12));
      const e = b === 1 ? smoother((t1 - DV[0]) / (DV[1] - DV[0])) : b > 1 ? 1 : 0;
      const [vw, vb] = dive(S0, onStage(VIEW, P680), ZF, e);
      scene('w-flash', b === 1 ? vw : ID_TF, b === 0 ? 1 : b === 1 ? 1 - tw(e, 0.35, 0.65) : 0);
      const vStruct: Tf = b === 1 ? { s: vb.s * VIEW.s, t: [vb.s * VIEW.t[0] + vb.t[0], vb.s * VIEW.t[1] + vb.t[1]] } : VIEW;
      scene('st', vStruct, b === 1 ? tw(e, 0.3, 0.6) : b > 1 ? 1 : 0);
      const atStruct = b === 1 ? tw(e, 0.8, 0.97) : b > 1 ? 1 : 0;

      // The antenna lights up around the reaction centre, from the centre outward. In beat 3 all but the path steps back.
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

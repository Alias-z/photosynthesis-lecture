// To the reaction centre, staging A "One continuous zoom". The lab bench of Emerson & Arnold's flash experiment, then
// one camera dive without cuts: into the flask, one alga and its chloroplast, one granum, onto the real PSII–LHCII
// structure (PDB 5XNL), which the camera stays on for the path the energy takes to the reaction centre.
// Brisk motion with a click stop at each talking point (lecturer, 27 Oct 2026): every click plays one short move
// (≈ 1 s) and stops; nothing is gone before the next click. Clippings, portraits, cards and labels just appear.
// - Beat 1. From the start, the readout on the right (chlorophylls in the flask ~2,400; O₂ released per flash –) and the
//   dim field of 2,400 chlorophylls. Click 1: the lamp flashes; at once the whole field lights up and the O₂ row turns to
//   1 with a small rising bubble (≈ 1 s). Click 2: the glow drains into 8 reaction centres (≈ 1.5 s).
// - Beat 2. Click 1: zoom flask → alga ("alga", "chloroplast"). Click 2: chloroplast → granum ("granum"). Click 3:
//   granum → the structure ("photosystem II (PSII)", key). Click 4: the antenna lights up from the centre outward:
//   reaction centre, core antenna, CP24/26/29, LHCII (≈ 1.2 s).
// - Beat 3. Click 1: a blue photon lands on a Chl b at the outer edge of M-LHCII (≈ 0.6 s); "blue light" stays. Click 2:
//   the excitation makes the 19 hops of slide 6's path (≈ 2.5 s), the energy staircase tracks it, and the reaction
//   centre flashes and stays lit.
// Shared drawings, sources and the physics notes: antenna-common.ts.
import './antenna-a.css';
import {
  benchSvg, countersSvg, dive, DIVE_CELL, drawCounters, drawField, drawFlash, drawHop, drawLabel, drawPigments,
  drawStair, f1, FIELD_SPOTS_T, fieldSvg, fig1Clip, flashAt, hopPos, HOPS_END, ID_TF, keySvg, labelsSvg, lerpV, onStage,
  packet, pairClip, PATH_PTS, setters, smoother, stairSvg, structureSvg, T, type Tf, tfStr, TIERS, type Tier, tw, type V,
  VIEW,
} from './antenna-common';
import small from '../../assets/anim/antenna/psii-small.webp';
import type { Staging } from './types';

const P = 'ana';

/* ---------------------------------------------------------------- the cell and the granum (look A's dive) */

const CELL_C: V = [800, 370], CELL_R = 250;
const GR_ANG = 128; // the granum the camera dives into, on the chloroplast's cup (degrees, y down)
const polar = (c: V, r: number, deg: number): V => [c[0] + r * Math.cos((deg * Math.PI) / 180), c[1] + r * Math.sin((deg * Math.PI) / 180)];
const GR_AT = polar(CELL_C, 172, GR_ANG);

/** One alga (Chlorella-like): cell wall, the cup-shaped chloroplast open at the top, its grana as short stacks. */
function cellSvg(): string {
  const a0 = -28, a1 = 208, ro = 226, ri = 118, o0 = polar(CELL_C, ro, a0), o1 = polar(CELL_C, ro, a1), i0 = polar(CELL_C, ri, a0), i1 = polar(CELL_C, ri, a1);
  const cup = `M${f1(o0[0])},${f1(o0[1])}A${ro},${ro} 0 1 1 ${f1(o1[0])},${f1(o1[1])}A54,54 0 0 1 ${f1(i1[0])},${f1(i1[1])}A${ri},${ri} 0 1 0 ${f1(i0[0])},${f1(i0[1])}A54,54 0 0 1 ${f1(o0[0])},${f1(o0[1])}Z`;
  const grana = [-8, 16, 40, 64, 90, 112, GR_ANG, 152, 176, 196].map(a => {
    const c = polar(CELL_C, 172, a), t = a + 90, d = (k: number): string => {
      const off = (k - 2) * 5.2, p = polar(c, off, a), u = polar(p, 17, t), v = polar(p, -17, t);
      return `M${f1(v[0])},${f1(v[1])}L${f1(u[0])},${f1(u[1])}`;
    };
    return `<path class="ana-gr" d="${[0, 1, 2, 3, 4].map(d).join('')}"/>`;
  }).join('');
  const lam = [0, 30, 58, 84, 120, 160, 186].map(a => { const p = polar(CELL_C, 172, a + 12), q = polar(CELL_C, 172, a + 22); return `M${f1(p[0])},${f1(p[1])}L${f1(q[0])},${f1(q[1])}`; }).join('');
  return `<circle class="ana-wall" cx="${CELL_C[0]}" cy="${CELL_C[1]}" r="${CELL_R}"/>
    <path class="ana-cup" d="${cup}"/><path class="ana-lam" d="${lam}"/>${grana}
    <circle class="ana-nuc" cx="${CELL_C[0]}" cy="${CELL_C[1] - 18}" r="58"/>`;
}

const GD_C: V = [800, 360], GD_R = 296, FP_W = 44; // the granum disc seen from the stroma, its footprints' width
const FP_H = FP_W * (821 / 1254);
/** A granum seen from above: its top thylakoid disc, packed with PSII–LHCII supercomplexes, the stack's rims below. */
function granumSvg(): string {
  const r = (seed: number): (() => number) => { let s = seed; return () => { s = (s * 16807) % 2147483647; return s / 2147483647; }; };
  const R = r(5), fps: string[] = [];
  for (let j = -7; j <= 7; j++) for (let i = -7; i <= 7; i++) {
    const x = GD_C[0] + (i + (j % 2 ? 0.5 : 0)) * 54, y = GD_C[1] + j * 44;
    if (Math.hypot(x - GD_C[0], y - GD_C[1]) > GD_R - 30 || (i === 0 && j === 0)) continue;
    const rot = Math.round(R() * 360), jx = (R() - 0.5) * 8, jy = (R() - 0.5) * 8;
    fps.push(`<image href="${small}" x="${f1(x + jx - FP_W / 2)}" y="${f1(y + jy - FP_H / 2)}" width="${FP_W}" height="${f1(FP_H)}" transform="rotate(${rot} ${f1(x + jx)} ${f1(y + jy)})"/>`);
  }
  fps.push(`<image href="${small}" x="${GD_C[0] - FP_W / 2}" y="${f1(GD_C[1] - FP_H / 2)}" width="${FP_W}" height="${f1(FP_H)}"/>`);
  return `<circle class="ana-rim" cx="${GD_C[0]}" cy="${GD_C[1] + 26}" r="${GD_R}"/><circle class="ana-rim" cx="${GD_C[0]}" cy="${GD_C[1] + 13}" r="${GD_R}"/>
    <circle class="ana-disc" cx="${GD_C[0]}" cy="${GD_C[1]}" r="${GD_R}"/>${fps.join('')}`;
}

/* ---------------------------------------------------------------- timing */

// Beat 1: the flash and the counters; click; the field and its drain.
const FLASH = 0.3, HOLD1 = 1.25, FIELD_IN = HOLD1 + 0.02, DRAIN = HOLD1 + 0.15;
// Beat 2: three zooms of ≈ 1 s, a click stop after each; click; the lighting.
const D1: [number, number] = [0.05, 1.05], D2: [number, number] = [1.15, 2.15], D3: [number, number] = [2.25, 3.25];
const HOLDS2 = [1.12, 2.22, 3.32];
const LIT: Record<Tier, number> = { rc: 3.4, core: 3.65, minor: 3.9, lhcii: 4.15 };
const LIT_FADE = 0.4;
// Beat 3: the photon lands; click; the hops; the trap.
const PH0 = 0.15, PH1 = 0.75, HOLD3 = 0.95, HOPS = HOLD3 + 0.05;
const TEND = [DRAIN + FIELD_SPOTS_T + 0.6, LIT.lhcii + LIT_FADE + 0.1, HOPS + HOPS_END + 0.75];
const ST_C: V = onStage(VIEW, [800, 500]); // where the structure's frame centre lands on the stage
const Z1 = 250 / 3.3, Z2 = 15, Z3 = (VIEW.s * 1254) / FP_W;
const PH_FROM: V = [1500, 112]; // the photon comes in from the upper right

export const STAGING: Staging = {
  id: 'a',
  name: 'A · One continuous zoom',
  note: 'From the lab bench, one dive without cuts: flask, alga, granum, photosystem II; then the path to the reaction centre.',
  holds: [[], HOLDS2, [HOLD3]],
  svg: () => `
    <g class="ana-scene" data-k="w-bench">${benchSvg(P, 'b')}</g>
    <g class="ana-scene" data-k="w-cell">${cellSvg()}</g>
    <g class="ana-scene" data-k="w-gran">${granumSvg()}</g>
    ${structureSvg(P, 'a')}
    <g data-k="clip">${pairClip(P, 60, 40, 286, -2.5)}${fig1Clip(P, 66, 322, 300, 1.8)}</g>
    ${countersSvg(1016, 88)}${fieldSvg()}
    ${T(1110, 160, 'alga', 'an-lab', 'start', 'l-alga')}${T(CELL_C[0] + 70, CELL_C[1] + 300, 'chloroplast', 'an-lab', 'start', 'l-chl')}
    ${T(GD_C[0] + GD_R + 26, GD_C[1] - 120, 'granum', 'an-lab', 'start', 'l-gran')}
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
      const over = b === 0 ? in0 : b === 1 ? 1 - tw(t1, 0, 0.35) : 0; // the beat-1 parts leave as the dive starts
      drawFlash(S, 'b', b === 0 ? flashAt(t0, FLASH) : 0);
      op(q('clip'), over);
      drawCounters(S, t0 - FLASH, over);
      op(q('field'), over);
      drawField(S, b === 0 ? tw(t0, FLASH, FLASH + 0.08) : 1, b === 0 ? t0 - DRAIN : 99);
      op(q('fkey1'), over * tw(t0, FIELD_IN, FIELD_IN + 0.25));
      op(q('fkey2'), over * tw(t0, DRAIN + FIELD_SPOTS_T, DRAIN + FIELD_SPOTS_T + 0.25));

      /* ---- beat 2: the dive; (click) the antenna lights up */
      const e1 = b === 1 ? smoother((t1 - D1[0]) / (D1[1] - D1[0])) : b > 1 ? 1 : 0;
      const e2 = b === 1 ? smoother((t1 - D2[0]) / (D2[1] - D2[0])) : b > 1 ? 1 : 0;
      const e3 = b === 1 ? smoother((t1 - D3[0]) / (D3[1] - D3[0])) : b > 1 ? 1 : 0;
      let vStruct: Tf = VIEW, oStruct = b === 2 ? 1 : 0;
      if (b === 0) { scene('w-bench', ID_TF, in0); scene('w-cell', ID_TF, 0); scene('w-gran', ID_TF, 0); }
      else if (b === 1) {
        if (e2 <= 0) {
          const [va, vb] = dive(DIVE_CELL, CELL_C, Z1, e1);
          scene('w-bench', va, 1 - tw(e1, 0.35, 0.6)); scene('w-cell', vb, tw(e1, 0.3, 0.6)); scene('w-gran', ID_TF, 0);
        } else if (e3 <= 0) {
          const [va, vb] = dive(GR_AT, GD_C, Z2, e2);
          scene('w-bench', ID_TF, 0); scene('w-cell', va, 1 - tw(e2, 0.4, 0.68)); scene('w-gran', vb, tw(e2, 0.35, 0.62));
        } else {
          const [va, vb] = dive(GD_C, ST_C, Z3, e3);
          scene('w-bench', ID_TF, 0); scene('w-cell', ID_TF, 0); scene('w-gran', va, 1 - tw(e3, 0.5, 0.78));
          vStruct = { s: vb.s * VIEW.s, t: [vb.s * VIEW.t[0] + vb.t[0], vb.s * VIEW.t[1] + vb.t[1]] };
          oStruct = tw(e3, 0.42, 0.7);
        }
      } else { scene('w-bench', ID_TF, 0); scene('w-cell', ID_TF, 0); scene('w-gran', ID_TF, 0); }
      scene('st', vStruct, oStruct);
      // Each scale's label stays until the next scale replaces it.
      const cellLab = b === 1 ? tw(e1, 0.75, 0.95) * (1 - tw(e2, 0.3, 0.45)) : 0;
      op(q('l-alga'), cellLab); op(q('l-chl'), cellLab);
      op(q('l-gran'), b === 1 ? tw(e2, 0.75, 0.95) * (1 - tw(e3, 0.35, 0.5)) : 0);

      // The antenna lights up around one reaction centre, from the centre outward; the other monomer's pigments dim.
      // In beat 3 all but the path steps back.
      const lit = (k: Tier): number => (b === 1 ? tw(t1, LIT[k], LIT[k] + LIT_FADE) : b > 1 ? 1 : 0);
      const back = b === 2 ? tw(t2, 0, 0.5) : 0;
      TIERS.forEach(k => op(q(`lit-${k}`), lit(k) * (1 - (k === 'rc' ? 0.4 : 0.55) * back)));
      op(q('rcring'), lit('rc'));
      op(q('veil'), lit('rc')); // the other monomer recedes under a paper veil as the reaction centre lights up
      const pl = (k: Tier): number => (0.5 + 0.5 * lit(k)) * (1 - 0.55 * back);
      const hx = b === 2 ? hopPos(t2 - HOPS) : 0, on = b === 2 ? tw(t2, PH1 - 0.05, PH1 + 0.15) : 0;
      drawPigments(S, (0.5 - 0.18 * lit('rc')) * (1 - 0.4 * back), { rc: pl('rc'), core: pl('core'), minor: pl('minor'), lhcii: pl('lhcii') }, on, hx);

      const labIn = (k: Tier): number => (b === 1 ? tw(t1, LIT[k] + 0.2, LIT[k] + 0.5) : b > 1 ? 1 : 0);
      const fade3 = b === 2 ? 1 - tw(t2, 0, 0.3) : 1;
      drawLabel(S, 'rc', vStruct, 0, labIn('rc'));
      drawLabel(S, 'core', vStruct, 0, labIn('core') * fade3);
      drawLabel(S, 'lhcii', vStruct, 0, labIn('lhcii') * fade3);
      const atStruct = b === 1 ? tw(e3, 0.75, 0.95) : b > 1 ? 1 : 0;
      op(q('lab-psii'), atStruct * fade3);
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

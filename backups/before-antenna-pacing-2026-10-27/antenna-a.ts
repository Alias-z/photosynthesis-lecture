// To the reaction centre, staging A "One continuous zoom". The lab bench of Emerson & Arnold's flash experiment, then
// one camera dive without cuts: into the flask, one alga, one granum of its chloroplast, onto the real PSII–LHCII
// structure (PDB 5XNL), and closer onto the path the energy takes to the reaction centre.
// - Beat 1: the clipping slides in at the side; the lamp flashes on the flask; the counters give ~2,400 chlorophylls
//   and 1 O₂. Click: the field of 2,400 chlorophylls lights up with the flash and drains into 8 reaction centres.
// - Beat 2: the dive (bench → alga → granum → photosystem II), pausing briefly at each level. Click: the antenna lights
//   up around one reaction centre, from the centre outward: reaction centre, core antenna, CP24/26/29, LHCII.
// - Beat 3: the camera closes in on the path; a blue photon lands on a Chl b at the outer edge of M-LHCII. Click: the
//   excitation hops along the 19 hops of slide 6's path, down the energy staircase, and the reaction centre traps it.
// Shared drawings, sources and the physics notes: antenna-common.ts.
import './antenna-a.css';
import {
  benchSvg, countersSvg, dive, DIVE_CELL, drawCounters, drawField, drawFlash, drawHop, drawLabel, drawStair,
  drawPigments, f1, FIELD_SPOTS_T, fieldSvg, flashAt, hopPos, HOPS_END, ID_TF, keySvg, labelsSvg, lerp, onStage,
  fig1Clip, packet, pairClip, PATH_PTS, REST, setters, smoother, stairSvg, structureSvg, T, type Tf, tfStr, TIERS, type Tier, tw, tween, type V,
  ZOOM,
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

// Beat 1: the lamp flashes at FLASH1; click; the field's flash at FLASH2.
const FLASH1 = 1.9, HOLD1 = 3.2, FLASH2 = 3.75;
// Beat 2: three dives with short pauses, then (click) the antenna lights up from the centre outward.
const D1: [number, number] = [0.25, 1.35], D2: [number, number] = [1.65, 2.75], D3: [number, number] = [3.05, 4.15], HOLD2 = 4.25;
const LIT: Record<string, number> = { rc: 4.35, core: 4.8, minor: 5.2, lhcii: 5.55 };
// Beat 3: the camera closes in; the photon lands at PHOTON; click; the hops begin at HOPS.
const PHOTON = 2.05, HOLD3 = 2.3, HOPS = 2.4;
const TEND = [FLASH2 + FIELD_SPOTS_T + 0.6, LIT.lhcii + 0.5, HOPS + HOPS_END + 0.7];
const Z1 = 250 / 3.3, Z2 = 15, Z3 = (REST.s * 1254) / FP_W;
const PH_FROM: V = [1500, 112]; // the photon comes in from the upper right

export const STAGING: Staging = {
  id: 'a',
  name: 'A · One continuous zoom',
  note: 'From the lab bench, one dive without cuts: flask, alga, granum, photosystem II, the path to the reaction centre.',
  holds: [[HOLD1], [HOLD2], [HOLD3]],
  svg: () => `
    <g class="ana-scene" data-k="w-bench">${benchSvg(P, 'b')}</g>
    <g class="ana-scene" data-k="w-cell">${cellSvg()}</g>
    <g class="ana-scene" data-k="w-gran">${granumSvg()}</g>
    ${structureSvg(P, 'a')}
    <g data-k="clip">${pairClip(P, 60, 40, 286, -2.5)}${fig1Clip(P, 66, 322, 300, 1.8)}</g>
    ${countersSvg(1016, 120)}${fieldSvg()}
    ${T(1110, 160, 'alga', 'an-lab', 'start', 'l-alga')}${T(CELL_C[0] + 70, CELL_C[1] + 300, 'chloroplast', 'an-lab', 'start', 'l-chl')}
    ${T(GD_C[0] + GD_R + 26, GD_C[1] - 120, 'granum', 'an-lab', 'start', 'l-gran')}
    ${labelsSvg()}${keySvg(76, 716)}${stairSvg()}
    <g data-k="photon"><path class="an-photon" data-k="ph-wave"/>${T(1540, 72, 'blue light', 'an-lab an-lab-photon', 'end')}</g>`,

  bind(stage) {
    const S = setters(stage), { q, set, op } = S;
    const scene = (k: string, v: Tf, o: number): void => { const el = q(k); op(el, o); if (o > 0.004) set(el, 'transform', tfStr(v)); };
    const struct = (v: Tf, o: number): void => scene('st', v, o);
    let last = '';
    return (beatIn, t) => {
      const b = Math.max(0, Math.min(2, Math.round(beatIn)));
      const key = `${b}:${Math.max(0, Math.min(t, TEND[b])).toFixed(3)}`;
      if (key === last) return;
      last = key;
      const tb = (k: number): number => (b === k ? Math.max(0, t) : b > k ? 99 : 0);
      const t0 = tb(0), t1 = tb(1), t2 = tb(2);

      /* ---- beat 1: bench, clipping, flash, counters; the field */
      const benchIn = b === 0 ? tw(t0, 0, 0.3) : 1;
      const push = smoother((t0 - 0.1) / 1.7), sB = lerp(0.93, 1, push), PB: V = [760, 460];
      const vBench: Tf = { s: sB, t: [PB[0] - sB * PB[0], PB[1] - sB * PB[1]] };
      const fl = b === 0 ? Math.max(flashAt(t0, FLASH1), flashAt(t0, FLASH2)) : 0;
      drawFlash(S, 'b', fl);
      const over = b === 0 ? 1 : b === 1 ? 1 - tw(t1, 0, 0.35) : 0; // the beat-1 overlays leave as the dive starts
      const clipIn = smoother((t0 - 0.25) / 0.6);
      const cg = q('clip');
      op(cg, over * tw(t0, 0.25, 0.5));
      set(cg, 'transform', `translate(${f1(-380 * (1 - clipIn))} 0)`);
      drawCounters(S, t0 - FLASH1, over * tw(t0, FLASH1 + 0.1, FLASH1 + 0.35));
      op(q('field'), over * tw(t0, HOLD1, HOLD1 + 0.3));
      drawField(S, b === 0 ? t0 - FLASH2 : 99);
      op(q('fkey1'), over * tw(t0, FLASH2 + 0.15, FLASH2 + 0.4));
      op(q('fkey2'), over * tw(t0, FLASH2 + FIELD_SPOTS_T, FLASH2 + FIELD_SPOTS_T + 0.25));

      /* ---- beat 2: the dive, then the antenna lights up */
      const e1 = b === 1 ? smoother((t1 - D1[0]) / (D1[1] - D1[0])) : b > 1 ? 1 : 0;
      const e2 = b === 1 ? smoother((t1 - D2[0]) / (D2[1] - D2[0])) : b > 1 ? 1 : 0;
      const e3 = b === 1 ? smoother((t1 - D3[0]) / (D3[1] - D3[0])) : b > 1 ? 1 : 0;
      let vStruct: Tf = REST, oStruct = 0;
      if (b === 0) { scene('w-bench', vBench, benchIn); scene('w-cell', ID_TF, 0); scene('w-gran', ID_TF, 0); }
      else if (b === 1) {
        if (e2 <= 0) {
          const [va, vb] = dive(DIVE_CELL, CELL_C, Z1, e1);
          scene('w-bench', va, 1 - tw(e1, 0.35, 0.6)); scene('w-cell', vb, tw(e1, 0.3, 0.6)); scene('w-gran', ID_TF, 0);
        } else if (e3 <= 0) {
          const [va, vb] = dive(GR_AT, GD_C, Z2, e2);
          scene('w-bench', ID_TF, 0); scene('w-cell', va, 1 - tw(e2, 0.4, 0.68)); scene('w-gran', vb, tw(e2, 0.35, 0.62));
        } else {
          const [va, vb] = dive(GD_C, [800, 395], Z3, e3);
          scene('w-bench', ID_TF, 0); scene('w-cell', ID_TF, 0); scene('w-gran', va, 1 - tw(e3, 0.5, 0.78));
          vStruct = { s: vb.s * REST.s, t: [vb.s * REST.t[0] + vb.t[0], vb.s * REST.t[1] + vb.t[1]] };
          oStruct = tw(e3, 0.42, 0.7);
        }
      } else { scene('w-bench', ID_TF, 0); scene('w-cell', ID_TF, 0); scene('w-gran', ID_TF, 0); }
      op(q('l-alga'), b === 1 ? tw(t1, D1[1] - 0.15, D1[1]) * (1 - tw(t1, D2[0] + 0.05, D2[0] + 0.2)) : 0);
      op(q('l-chl'), b === 1 ? tw(t1, D1[1] - 0.15, D1[1]) * (1 - tw(t1, D2[0] + 0.05, D2[0] + 0.2)) : 0);
      op(q('l-gran'), b === 1 ? tw(t1, D2[1] - 0.15, D2[1]) * (1 - tw(t1, D3[0] + 0.05, D3[0] + 0.2)) : 0);

      // The antenna lights up around one reaction centre, from the centre outward; the other monomer's pigments dim.
      // In beat 3 everything but the path steps back.
      const lit = (k: string): number => (b === 1 ? tw(t1, LIT[k], LIT[k] + 0.35) : b > 1 ? 1 : 0);
      const zoomE = b === 2 ? smoother((t2 - 0.1) / 1.4) : 0, back = b === 2 ? tw(t2, 0.6, 1.4) : 0;
      TIERS.forEach(k => op(q(`lit-${k}`), lit(k) * (1 - (k === 'rc' ? 0.4 : 0.55) * back)));
      op(q('rcring'), lit('rc'));
      const pl = (k: Tier): number => (0.5 + 0.5 * lit(k)) * (1 - 0.55 * back);
      const hx = b === 2 ? hopPos(t2 - HOPS) : 0, on = b === 2 ? tw(t2, PHOTON - 0.05, PHOTON + 0.15) : 0;
      drawPigments(S, (0.5 - 0.18 * lit('rc')) * (1 - 0.4 * back), { rc: pl('rc'), core: pl('core'), minor: pl('minor'), lhcii: pl('lhcii') }, on, hx);

      /* ---- beat 3: closer onto the path; the photon; the hops; the trap */
      if (b === 1 && e3 >= 1) { vStruct = REST; oStruct = 1; }
      if (b === 2) { vStruct = tween(REST, ZOOM, zoomE); oStruct = 1; }
      struct(vStruct, oStruct);

      const labIn = (k: string): number => (b === 1 ? tw(t1, LIT[k] + 0.15, LIT[k] + 0.4) : b > 1 ? 1 : 0);
      drawLabel(S, 'rc', vStruct, zoomE, labIn('rc'));
      drawLabel(S, 'core', vStruct, 0, labIn('core') * (b === 2 ? 1 - tw(t2, 0, 0.3) : 1));
      drawLabel(S, 'lhcii', vStruct, 0, labIn('lhcii') * (b === 2 ? 1 - tw(t2, 0, 0.3) : 1));
      op(q('lab-psii'), (b === 1 ? tw(t1, D3[1] - 0.2, D3[1] + 0.1) : b > 1 ? 1 : 0) * (b === 2 ? 1 - tw(t2, 0, 0.3) : 1));
      op(q('key'), b === 1 ? tw(t1, D3[1] - 0.1, D3[1] + 0.2) : b > 1 ? 1 : 0);

      op(q('stair'), b === 2 ? tw(t2, 1.2, 1.5) : 0);
      const pf = b === 2 ? (t2 - (PHOTON - 0.6)) / 0.6 : -1, start = onStage(vStruct, PATH_PTS[0]);
      const ph = q('photon');
      op(ph, pf > 0 && pf < 1.2 ? tw(pf, 0, 0.15) * (1 - tw(pf, 0.95, 1.15)) : 0);
      if (pf > 0 && pf < 1.2) {
        const pp = [lerp(PH_FROM[0], start[0], Math.min(1, pf)), lerp(PH_FROM[1], start[1], Math.min(1, pf))] as V;
        const ang = (Math.atan2(start[1] - PH_FROM[1], start[0] - PH_FROM[0]) * 180) / Math.PI;
        set(q('ph-wave'), 'd', packet(pp[0], pp[1], 450, ang, 130, 17));
      }
      const trap = b === 2 ? Math.max(0, (t2 - HOPS - HOPS_END - 0.02) / 0.6) : 0;
      drawHop(S, hx, on, Math.min(1, trap));
      drawStair(S, hx, b === 2 ? tw(t2, PHOTON, PHOTON + 0.2) : 0, Math.min(1, trap));
    };
  },
};

// To the reaction centre, staging B "Newspaper desk". Emerson & Arnold's 1932 clipping lies on the desk (the Bristol
// paper): their halftone portraits and their Fig. 1, where the yield per flash levels off, beside the flash experiment.
// The camera later dives into one reaction centre of the field of 2,400 chlorophylls, onto the real PSII–LHCII
// structure (PDB 5XNL) printed as a newspaper halftone. Two clicks per beat where a beat holds two events (lecturer,
// 27 Oct 2026); clippings, portraits, cards and labels just appear, and only the teaching motion moves.
// - Beat 1. Click 1: the lamp flashes once; the counters count up to ~2,400 chlorophylls and 1 O₂. Click 2: the field of
//   2,400 chlorophylls appears lit by the flash, and its glow drains into 8 reaction centres (≈ 3 s).
// - Beat 2. Click 1: one smooth dive into a reaction centre of the field, onto the printed structure; a card shows
//   that it sits in a granum's membrane. Click 2: the antenna lights up in one calm sweep, from the centre outward.
// - Beat 3, as staging A. Click 1: a blue photon lands on a Chl b at the outer edge of M-LHCII. Click 2: the 19 hops
//   (≈ 4.5 s), the staircase tracking them, and the reaction centre's flash, which stays.
// Shared drawings, sources and the physics notes: antenna-common.ts.
import './antenna-b.css';
import {
  ARNOLD, benchSvg, BENCH_DX, countersSvg, cutPath, dive, drawCounters, drawField, drawFlash, drawHop, drawLabel,
  drawPigments, drawStair, EMERSON, f1, FIELD_SPOTS_T, fieldSvg, FIG1, FIG1_AR, flashAt, hopPos, HOPS_END, ID_TF,
  keySvg, labelsSvg, lerpV, onStage, P680, packet, PATH_PTS, setters, smoother, spotAt, stairSvg, structureSvg, T,
  type Tf, tfStr, TIERS, type Tier, tw, type V, VIEW,
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

/* ---------------------------------------------------------------- the granum card (beat 2) */

const GC = { x: 1206, y: 478, w: 334, h: 222 };
function granumCard(): string {
  const discs = Array.from({ length: 6 }, (_, i) => `<rect class="${i === 0 ? 'anb-thy anb-thy-on' : 'anb-thy'}" x="${GC.x + 28}" y="${GC.y + 30 + i * 22}" width="130" height="15" rx="7.5"/>`).join('');
  return `<g data-k="gcard"><path class="an-card" d="${cutPath(GC.x, GC.y, GC.w, GC.h, 83, 2.4)}"/>${discs}
    <path class="an-lead" d="M${GC.x + 164},${GC.y + 37}L${GC.x + 178},${GC.y + 37}"/>
    ${T(GC.x + 184, GC.y + 46, 'membrane', 'an-lab')}
    ${T(GC.x + 28, GC.y + GC.h - 20, 'granum', 'an-lab')}</g>`;
}

/* ---------------------------------------------------------------- timing */

// Beat 1: the flash, the counters; click; the field's drain.
const FLASH = 0.45, HOLD1 = 1.9, FIELD_IN = HOLD1 + 0.05, DRAIN = HOLD1 + 0.7;
// Beat 2: one dive into a reaction centre of the field; click; the lighting sweep.
const DV: [number, number] = [0.3, 3.4], HOLD2 = 3.6;
const LIT: Record<Tier, number> = { rc: HOLD2 + 0.15, core: HOLD2 + 0.6, minor: HOLD2 + 1.05, lhcii: HOLD2 + 1.5 };
const LIT_FADE = 0.6;
// Beat 3: the photon lands; click; the hops; the trap.
const PH0 = 0.45, PH1 = 1.85, HOLD3 = 2.2, HOPS = HOLD3 + 0.1;
const TEND = [DRAIN + FIELD_SPOTS_T + 0.7, LIT.lhcii + LIT_FADE + 0.2, HOPS + HOPS_END + 0.8];
// The bench is drawn at 0.9 below the clipping, its flask at FLASK.
const BENCH_K = 0.9, FLASK: V = [520, 530];
const BENCH_TF = `matrix(${BENCH_K},0,0,${BENCH_K},${FLASK[0] - BENCH_K * (650 + BENCH_DX)},${FLASK[1] - BENCH_K * 500})`;
const S0 = spotAt(2); // the field's reaction centre the camera dives into
const ZF = 7;
const PH_FROM: V = [1500, 112];

export const STAGING: Staging = {
  id: 'b',
  name: 'B · Newspaper desk',
  note: 'The 1932 clipping on the desk beside the experiment; the camera dives from the field of chlorophylls onto the printed structure.',
  holds: [[HOLD1], [HOLD2], [HOLD3]],
  svg: () => `
    <g data-k="w-desk">${deskSvg()}</g>
    <g class="anb-scene" data-k="w-bench"><g transform="${BENCH_TF}">${benchSvg(P, 'b')}</g></g>
    ${structureSvg(P, 'b')}
    ${countersSvg(1016, 120)}
    <g data-k="w-field">${fieldSvg()}</g>
    ${granumCard()}
    ${labelsSvg()}${keySvg(76, 716)}${stairSvg()}
    <g data-k="photon"><path class="an-photon" data-k="ph-wave"/>${T(1540, 72, 'blue light', 'an-lab an-lab-photon', 'end')}</g>`,

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
      const over = b === 0 ? in0 : b === 1 ? 1 - tw(t1, 0, 0.35) : 0;
      op(q('w-desk'), over);
      op(q('w-bench'), over);
      drawFlash(S, 'b', b === 0 ? flashAt(t0, FLASH) : 0);
      drawCounters(S, t0 - FLASH, over);
      drawField(S, 1, b === 0 ? t0 - DRAIN : 99);
      op(q('fkey1'), over * tw(t0, FIELD_IN, FIELD_IN + 0.25));
      op(q('fkey2'), over * tw(t0, DRAIN + FIELD_SPOTS_T, DRAIN + FIELD_SPOTS_T + 0.25));

      /* ---- beat 2: one dive into a reaction centre of the field, onto the printed structure; (click) the sweep */
      const e = b === 1 ? smoother((t1 - DV[0]) / (DV[1] - DV[0])) : b > 1 ? 1 : 0;
      const [vf, vb] = dive(S0, onStage(VIEW, P680), ZF, e);
      scene('w-field', b === 1 ? vf : ID_TF, b === 0 ? tw(t0, FIELD_IN, FIELD_IN + 0.25) : b === 1 ? 1 - tw(e, 0.35, 0.65) : 0);
      const vStruct: Tf = b === 1 ? { s: vb.s * VIEW.s, t: [vb.s * VIEW.t[0] + vb.t[0], vb.s * VIEW.t[1] + vb.t[1]] } : VIEW;
      scene('st', vStruct, b === 1 ? tw(e, 0.3, 0.6) : b > 1 ? 1 : 0);
      const atStruct = b === 1 ? tw(e, 0.8, 0.97) : b > 1 ? 1 : 0;
      op(q('gcard'), b === 1 ? atStruct : b === 2 ? 1 - tw(t2, 0, 0.3) : 0);

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
      op(q('lab-psii'), atStruct * fade3);
      op(q('key'), atStruct);

      /* ---- beat 3: the photon lands; (click) the hops and the trap */
      op(q('stair'), b === 2 ? tw(t2, 0.1, 0.4) : 0);
      const pf = b === 2 ? (t2 - PH0) / (PH1 - PH0) : -1, start = onStage(VIEW, PATH_PTS[0]);
      op(q('photon'), pf > 0 && pf < 1.3 ? tw(pf, 0, 0.1) * (1 - tw(pf, 0.97, 1.25)) : 0);
      if (pf > 0 && pf < 1.3) {
        const pp = lerpV(PH_FROM, start, smoother(Math.min(1, pf)) * 0.25 + Math.min(1, pf) * 0.75);
        const ang = (Math.atan2(start[1] - PH_FROM[1], start[0] - PH_FROM[0]) * 180) / Math.PI;
        set(q('ph-wave'), 'd', packet(pp[0], pp[1], 450, ang, 130, 17));
      }
      const trap = b === 2 ? Math.max(0, (t2 - HOPS - HOPS_END - 0.02) / 0.7) : 0;
      drawHop(S, hx, on, Math.min(1, trap));
      drawStair(S, hx, on, Math.min(1, trap));
    };
  },
};

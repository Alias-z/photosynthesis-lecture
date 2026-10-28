// To the reaction centre, staging B "Newspaper desk". Emerson & Arnold's 1932 clipping lies on the desk (the Bristol
// paper): their halftone portraits and their Fig. 1, where the yield per flash levels off. The camera dives into the
// brightest flash's point, which opens onto the experiment; later it dives into the field of 2,400 chlorophylls, whose
// dots fly to the real pigment positions of one PSII monomer, printed as a newspaper halftone of PDB 5XNL.
// - Beat 1: the clipping leads; the dive opens onto the lamp and the flask; the flash; the counters (~2,400
//   chlorophylls, 1 O₂). Click: the field of 2,400 chlorophylls lights up and drains into 8 reaction centres.
// - Beat 2: the camera dives into one reaction centre of the field; its ~160 nearest dots fly to the chlorophyll
//   positions of one monomer, and the printed structure appears under them; a small card shows that it sits in a
//   granum's membrane. Click: the antenna lights up from the centre outward.
// - Beat 3: as staging A: closer onto the path, a blue photon on a Chl b at the edge; click; 19 hops, the trap.
// Shared drawings, sources and the physics notes: antenna-common.ts.
import './antenna-b.css';
import {
  ARNOLD, benchSvg, BENCH_DX, countersSvg, cutPath, dive, DOTS, drawCounters, drawField, drawFlash, drawHop, drawLabel,
  drawPigments, drawStair, EMERSON, f1, FIELD, FIELD_SPOTS_T, fieldSvg, FIG1, FIG1_AR, FIG1_TOP, flashAt, hopPos,
  HOPS_END, ID_TF, keySvg, labelsSvg, lerp, lerpV, onStage, P680, packet, PATH_PTS, pigAt, REST, setters, smoother,
  spotAt, stairSvg, structureSvg, T, type Tf, tfStr, TIERS, type Tier, tw, tween, UP_PIGS, type V, ZOOM,
} from './antenna-common';
import { CHL } from './antenna-data';
import type { Staging } from './types';

const P = 'anb';

/* ---------------------------------------------------------------- the clipping on the desk */

const DESK = { x: 214, y: 92, w: 1172, h: 548, rot: -1.2 };
const POR = { w: 196, h: 245, y: 140, x1: 262, x2: 482 };
const FIG = { x: 736, y: 128, w: 604 };
const DC: V = [DESK.x + DESK.w / 2, DESK.y + DESK.h / 2];
const rotAbout = (p: V, c: V, deg: number): V => {
  const a = (deg * Math.PI) / 180, dx = p[0] - c[0], dy = p[1] - c[1];
  return [c[0] + dx * Math.cos(a) - dy * Math.sin(a), c[1] + dx * Math.sin(a) + dy * Math.cos(a)];
};
/** The brightest flash's point in Fig. 1, on the stage: the camera dives into it. */
const FIG_PT = rotAbout([FIG.x + FIG.w * FIG1_TOP[0], FIG.y + FIG.w * FIG1_AR * FIG1_TOP[1]], DC, DESK.rot);

function deskSvg(): string {
  const por = (href: string, x: number): string => `<image href="${href}" x="${x}" y="${POR.y}" width="${POR.w}" height="${POR.h}" preserveAspectRatio="xMidYMid slice"/>`;
  const ny = POR.y + POR.h + 50;
  return `<defs><filter id="${P}-desksh" x="-5%" y="-5%" width="110%" height="115%"><feDropShadow dx="2" dy="5" stdDeviation="7" flood-color="#3d3020" flood-opacity=".22"/></filter></defs>
    <g class="clip" transform="rotate(${DESK.rot} ${DC[0]} ${DC[1]})">
      <path class="clip-paper" d="${cutPath(DESK.x, DESK.y, DESK.w, DESK.h, 41, 5)}" filter="url(#${P}-desksh)"/>
      ${por(EMERSON, POR.x1)}${por(ARNOLD, POR.x2)}
      <text class="clip-name" x="${POR.x1 + POR.w / 2}" y="${ny}" text-anchor="middle" font-size="34">Emerson</text>
      <text class="clip-name" x="${POR.x2 + POR.w / 2}" y="${ny}" text-anchor="middle" font-size="34">Arnold</text>
      <text class="clip-find" x="${(POR.x1 + POR.x2 + POR.w) / 2}" y="${ny + 58}" text-anchor="middle" font-size="40">1932</text>
      <path class="anb-rule" d="M${FIG.x - 34},${POR.y}V${DESK.y + DESK.h - 50}"/>
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

/* ---------------------------------------------------------------- the dots that become pigments */

const SPOT = 2; // the field's reaction centre the camera dives into
const S0 = spotAt(SPOT);
const P680_REST = onStage(REST, P680);
/** Pairs of (field dot, pigment of the lit monomer): both sorted by distance from their centre, then matched by angle
 *  ring by ring, so each dot flies roughly outward to its pigment. */
const PAIRS: Array<{ dot: V; pig: number }> = (() => {
  const ang = (p: V, c: V): number => Math.atan2(p[1] - c[1], p[0] - c[0]);
  const dots = DOTS.map(o => o.p).filter(p => Math.hypot(p[0] - S0[0], p[1] - S0[1]) > 0.5)
    .sort((a, b) => Math.hypot(a[0] - S0[0], a[1] - S0[1]) - Math.hypot(b[0] - S0[0], b[1] - S0[1])).slice(0, UP_PIGS.length);
  const pigs = UP_PIGS.slice().sort((a, b) => Math.hypot(pigAt(a)[0] - P680[0], pigAt(a)[1] - P680[1]) - Math.hypot(pigAt(b)[0] - P680[0], pigAt(b)[1] - P680[1]));
  const out: Array<{ dot: V; pig: number }> = [];
  for (let i = 0; i < dots.length; i += 12) {
    const d = dots.slice(i, i + 12).sort((a, b) => ang(a, S0) - ang(b, S0));
    const g = pigs.slice(i, i + 12).sort((a, b) => ang(pigAt(a), P680) - ang(pigAt(b), P680));
    d.forEach((p, k) => out.push({ dot: p, pig: g[k] }));
  }
  return out;
})();
const morphSvg = (): string => `<g data-k="morph">${PAIRS.map((m, i) => `<circle data-k="md${i}" class="${['an-chla', 'an-chlb', 'an-pheo'][CHL[5 * m.pig + 2]]}" r="3"/>`).join('')}</g>`;

/* ---------------------------------------------------------------- timing */

const DIVE1: [number, number] = [1.0, 2.4], FLASH1 = 2.65, HOLD1 = 3.85, FLASH2 = 4.35;
const ZF = 5.2; // the field's zoom into its reaction centre
const LIT: Record<Tier, number> = { rc: 2.8, core: 3.25, minor: 3.65, lhcii: 4.0 };
const HOLD2 = 2.65;
const PHOTON = 2.05, HOLD3 = 2.3, HOPS = 2.4;
const TEND = [FLASH2 + FIELD_SPOTS_T + 0.6, LIT.lhcii + 0.5, HOPS + HOPS_END + 0.7];
// The bench is drawn 1.2 times larger here, with the flask at FLASK, since no clippings share its side of the stage.
const BENCH_K = 1.2, FLASK: V = [640, 470];
const BENCH_TF = `matrix(${BENCH_K},0,0,${BENCH_K},${FLASK[0] - BENCH_K * (650 + BENCH_DX)},${FLASK[1] - BENCH_K * 500})`;
const Z_DESK = (96 * BENCH_K) / 5.6;
const PH_FROM: V = [1500, 112];

export const STAGING: Staging = {
  id: 'b',
  name: 'B · Newspaper desk',
  note: 'The 1932 clipping on the desk; the camera dives into its brightest flash, then the field of chlorophylls flies into the printed structure.',
  holds: [[HOLD1], [HOLD2], [HOLD3]],
  svg: () => `
    <g class="anb-scene" data-k="w-desk">${deskSvg()}</g>
    <g class="anb-scene" data-k="w-bench"><g transform="${BENCH_TF}">${benchSvg(P, 'b')}</g></g>
    ${structureSvg(P, 'b')}
    ${countersSvg(1016, 120)}
    <g data-k="w-field">${fieldSvg()}</g>
    ${morphSvg()}
    ${granumCard()}
    ${labelsSvg()}${keySvg(76, 716)}${stairSvg()}
    <g data-k="photon"><path class="an-photon" data-k="ph-wave"/>${T(1540, 72, 'blue light', 'an-lab an-lab-photon', 'end')}</g>`,

  bind(stage) {
    const S = setters(stage), { q, set, op } = S;
    const scene = (k: string, v: Tf, o: number): void => { const el = q(k); op(el, o); if (o > 0.004) set(el, 'transform', tfStr(v)); };
    const md = PAIRS.map((_, i) => q(`md${i}`));
    let last = '';
    return (beatIn, t) => {
      const b = Math.max(0, Math.min(2, Math.round(beatIn)));
      const key = `${b}:${Math.max(0, Math.min(t, TEND[b])).toFixed(3)}`;
      if (key === last) return;
      last = key;
      const tb = (k: number): number => (b === k ? Math.max(0, t) : b > k ? 99 : 0);
      const t0 = tb(0), t1 = tb(1), t2 = tb(2);

      /* ---- beat 1: the clipping on the desk, the dive into its brightest flash, the experiment */
      const push = smoother((t0 - 0.3) / 0.8), k = lerp(1, 1.05, push);
      const e1 = b === 0 ? smoother((t0 - DIVE1[0]) / (DIVE1[1] - DIVE1[0])) : 1;
      const [va, vb] = dive(FIG_PT, FLASK, Z_DESK, e1);
      const vDesk: Tf = { s: va.s * k, t: [va.s * (1 - k) * FIG_PT[0] + va.t[0], va.s * (1 - k) * FIG_PT[1] + va.t[1]] };
      scene('w-desk', vDesk, b === 0 ? tw(t0, 0, 0.3) * (1 - tw(e1, 0.35, 0.62)) : 0);
      const benchO = b === 0 ? tw(e1, 0.3, 0.6) : b === 1 ? 1 - tw(t1, 0, 0.35) : 0;
      scene('w-bench', b === 0 ? vb : ID_TF, benchO);
      drawFlash(S, 'b', b === 0 ? Math.max(flashAt(t0, FLASH1), flashAt(t0, FLASH2)) : 0);
      const over = b === 0 ? 1 : b === 1 ? 1 - tw(t1, 0, 0.35) : 0;
      drawCounters(S, t0 - FLASH1, over * tw(t0, FLASH1 + 0.1, FLASH1 + 0.35));
      drawField(S, b === 0 ? t0 - FLASH2 : 99);
      op(q('fkey1'), over * tw(t0, FLASH2 + 0.15, FLASH2 + 0.4));
      op(q('fkey2'), over * tw(t0, FLASH2 + FIELD_SPOTS_T, FLASH2 + FIELD_SPOTS_T + 0.25));

      /* ---- beat 2: into one reaction centre of the field; the dots fly to the pigments; the printed structure */
      const ef = b === 1 ? smoother((t1 - 0.2) / 1.6) : b > 1 ? 1 : 0;
      const [vf] = dive(S0, P680_REST, ZF, ef);
      const fieldO = b === 0 ? tw(t0, HOLD1, HOLD1 + 0.3) : b === 1 ? 1 - tw(t1, 0.55, 1.15) : 0;
      scene('w-field', b === 1 ? vf : ID_TF, fieldO);
      const m = b === 1 ? smoother((t1 - 0.9) / 1.3) : b > 1 ? 1 : 0;
      const morphO = b === 1 ? (1 - tw(t1, 2.2, 2.4)) * (t1 > 0.2 ? 1 : 0) : 0;
      op(q('morph'), morphO);
      if (morphO > 0.004) {
        PAIRS.forEach((pr, i) => {
          const from = onStage(vf, pr.dot), to = onStage(REST, pigAt(pr.pig)), p = lerpV(from, to, m);
          set(md[i], 'cx', f1(p[0])); set(md[i], 'cy', f1(p[1]));
          set(md[i], 'r', f1(lerp(FIELD.r * vf.s, 13 * REST.s, m)));
          set(md[i], 'opacity', lerp(1, 0.5, m).toFixed(3)); set(md[i], 'stroke-width', lerp(0, 1.4, m).toFixed(2));
        });
      }
      op(q('gcard'), b === 1 ? tw(t1, 1.1, 1.4) : 0);

      // The printed structure appears under the arriving dots; then (click) the antenna lights up from the centre out.
      const stO = b === 1 ? tw(t1, 1.6, 2.2) : b > 1 ? 1 : 0;
      const lit = (k2: Tier): number => (b === 1 ? tw(t1, LIT[k2], LIT[k2] + 0.35) : b > 1 ? 1 : 0);
      const zoomE = b === 2 ? smoother((t2 - 0.1) / 1.4) : 0, back = b === 2 ? tw(t2, 0.6, 1.4) : 0;
      const vStruct: Tf = b === 2 ? tween(REST, ZOOM, zoomE) : REST;
      scene('st', vStruct, stO);
      TIERS.forEach(k2 => op(q(`lit-${k2}`), lit(k2) * (1 - (k2 === 'rc' ? 0.4 : 0.55) * back)));
      op(q('rcring'), lit('rc'));
      const pigIn = b === 1 ? tw(t1, 2.1, 2.3) : b > 1 ? 1 : 0, lowIn = b === 1 ? tw(t1, 1.9, 2.4) : b > 1 ? 1 : 0;
      const pl = (k2: Tier): number => pigIn * (0.5 + 0.5 * lit(k2)) * (1 - 0.55 * back);
      const hx = b === 2 ? hopPos(t2 - HOPS) : 0, on = b === 2 ? tw(t2, PHOTON - 0.05, PHOTON + 0.15) : 0;
      drawPigments(S, lowIn * (0.5 - 0.18 * lit('rc')) * (1 - 0.4 * back), { rc: pl('rc'), core: pl('core'), minor: pl('minor'), lhcii: pl('lhcii') }, on, hx);

      const labIn = (k2: Tier): number => (b === 1 ? tw(t1, LIT[k2] + 0.15, LIT[k2] + 0.4) : b > 1 ? 1 : 0);
      drawLabel(S, 'rc', vStruct, zoomE, labIn('rc'));
      drawLabel(S, 'core', vStruct, 0, labIn('core') * (b === 2 ? 1 - tw(t2, 0, 0.3) : 1));
      drawLabel(S, 'lhcii', vStruct, 0, labIn('lhcii') * (b === 2 ? 1 - tw(t2, 0, 0.3) : 1));
      op(q('lab-psii'), (b === 1 ? tw(t1, 2.2, 2.5) : b > 1 ? 1 : 0) * (b === 2 ? 1 - tw(t2, 0, 0.3) : 1));
      op(q('key'), b === 1 ? tw(t1, 2.2, 2.5) : b > 1 ? 1 : 0);

      /* ---- beat 3: closer onto the path; the photon; the hops; the trap */
      op(q('stair'), b === 2 ? tw(t2, 1.2, 1.5) : 0);
      const pf = b === 2 ? (t2 - (PHOTON - 0.6)) / 0.6 : -1, start = onStage(vStruct, PATH_PTS[0]);
      const ph = q('photon');
      op(ph, pf > 0 && pf < 1.2 ? tw(pf, 0, 0.15) * (1 - tw(pf, 0.95, 1.15)) : 0);
      if (pf > 0 && pf < 1.2) {
        const pp = lerpV(PH_FROM, start, Math.min(1, pf));
        const ang = (Math.atan2(start[1] - PH_FROM[1], start[0] - PH_FROM[0]) * 180) / Math.PI;
        set(q('ph-wave'), 'd', packet(pp[0], pp[1], 450, ang, 130, 17));
      }
      const trap = b === 2 ? Math.max(0, (t2 - HOPS - HOPS_END - 0.02) / 0.6) : 0;
      drawHop(S, hx, on, Math.min(1, trap));
      drawStair(S, hx, b === 2 ? tw(t2, PHOTON, PHOTON + 0.2) : 0, Math.min(1, trap));
    };
  },
};

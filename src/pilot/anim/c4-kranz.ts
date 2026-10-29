// 'lf12', staging c4k · C₄ photosynthesis in the micrograph-and-magnifier style (slide C12; captions beats-c24.ts C4K;
// brief scratchpad C24_BRIEF.md). Built on the style frame anim/c4-style.ts: the maize micrograph (Kranz), a lens on the
// wall between a bundle-sheath (BS) cell and its mesophyll (M) neighbour, and the magnifier drawn with bilayers, real
// protein structures and atom-ball molecules. One fixed framing; one thing moves at a time; eased glides only.
// - Beat 1: the names appear one at a time on the photo (vein, bundle sheath, mesophyll), then the lens and the
//   magnifier fade in. Nothing moves.
// - Beat 2 (M side only): HCO₃⁻ and PEP (docked on PEPC) appear; HCO₃⁻ glides into PEPC; the C₄ acid comes out of it and
//   waits at the plasmodesma.
// - Beat 3 (the C₄ acid only): through the plasmodesma into the BS chloroplast, next to RuBisCO; its fourth carbon leaves
//   as CO₂, which moves the last bit to RuBisCO; the stroma then glows gently (CO₂ high).
// - Beat 4 (these only): ATP appears on PPDK; pyruvate (3 C) glides back through the plasmodesma to PPDK; ATP becomes
//   AMP and pyruvate becomes PEP (3 C + P), which moves up to PEPC, ready for the next HCO₃⁻. Then the closing question.
// Polished overnight (29 Oct 2026): the molecules are the photorespiration slide's glyphs (anim/dk-rf6.ts: carbon-form
// rows and atom balls, R = 11, no capsules); the released CO₂ is slide 19's CO₂ character (co2-kit kidG), glad once
// RuBisCO catches it; a pause (holds) after each step: beat 1 after the names on the photo, beat 2 once the C₄ acid is
// made, beat 3 once it reaches RuBisCO, beat 4 once pyruvate is back at PPDK.
// PPDK: the maize enzyme, PDB 1VBG (Nakanishi et al. 2005, Biochemistry 44:1136), dimer, rendered like PEPC
// (scripts/rf_forms_render.mjs, pair view), hue turned to purple. PPDK makes AMP (pyruvate + ATP + Pᵢ → PEP + AMP + PPᵢ),
// so the tag turns from ATP to AMP: 2 ATP equivalents, as the caption says.
import '../figs/chain.css';
import zeaJpg from '../../assets/photos/c12-zea-kranz.jpg';
import pepcPng from '../../assets/rf/pepc-3zge.png';
import ppdkPng from '../../assets/rf/ppdk-1vbg.png';
import rubPng from '../../assets/rf/rubisco-8ruc.png';
import { bilayer } from '../figs/cell-schema';
import { tagG } from '../figs/chain';
import { row } from '../figs/carbon-form';
import { actor, bilayerE, ease, f, glide, inset, kid, kidG, makeScene, T, type Api, type V } from './co2-kit';
import type { Staging, StageKey } from './types';

const P = 'c4k';

/** The lens on the photo (stage units; the photo fills x 0–1000) and the magnifier. */
const LENS: V = [752, 386], C: V = [1292, 372], R = 268;
/** The magnifier: the wall between the 2 cells down its middle; the bundle-sheath cell on the left (cytosol and a
 *  chloroplast with its double envelope), the mesophyll cell on the right (cytosol with PEPC and PPDK). */
const W0 = C[0] - 20, W1 = C[0] + 20, PM_B = W0 - 7, PM_M = W1 + 7, PDY = C[1] + 10;
const top = C[1] - R, bot = C[1] + R, x0 = C[0] - R, x1 = C[0] + R;
const band = (a: number, b: number, cls: string): string => `<rect class="${cls}" x="${f(a)}" y="${top}" width="${f(b - a)}" height="${2 * R}"/>`;
/** A plasma membrane down the wall, open where the plasmodesma passes (its 2 halves meet the channel's lining). */
const pmV = (x: number): string => bilayer([{ L: [x, top, x, PDY - 15] }], 6, 1.6, 4.2) + bilayer([{ L: [x, PDY + 15, x, bot] }], 6, 1.6, 4.2);

/** HCO₃⁻: a C with 3 O, one of them carrying the H. */
const hco3G = (r = R11): string => `<circle class="atom atom-H" cx="${f(-1.7 * r)}" cy="${f(-1.55 * r)}" r="${f(r * 0.56)}"/>
  <circle class="atom atom-O" cx="${f(-1.2 * r)}" cy="${f(-0.75 * r)}" r="${r}"/><circle class="atom atom-O" cx="${f(1.2 * r)}" cy="${f(-0.75 * r)}" r="${r}"/>
  <circle class="atom atom-O" cx="0" cy="${f(1.3 * r)}" r="${r}"/><circle class="atom atom-C" r="${r}"/>`;

/* ---------------------------------------------------------------- places in the magnifier (stage units) */
/** The bundle-sheath chloroplast and what is in it. */
const CP: V = [1150, 360];
const RUB = { x: 1056, y: 262, w: 122 }, RUB_H = (122 * 471) / 548;
/** PEPC (top of the M cell) and PPDK (below it), at the scale of RuBisCO (Å per stage unit alike). */
const PEPC = { x: 1384, y: 236, w: 132 }, PEPC_H = (132 * 517) / 608;
const PPDK = { x: 1340, y: 452, w: 142 }, PPDK_H = (142 * 403) / 654;
/** The glyphs' atom radius and step, as on the photorespiration slide (anim/dk-rf6.ts). */
const R11 = 11, ST = R11 * 2.15;
const carb = (s: string): string => row(0, 0, s, { r: R11 });
/** HCO₃⁻ from the far side of the M cell into PEPC. */
const HCO3_IN: V[] = [[1514, 420], [1508, 372], [1484, 322]];
/** PEP docked on PEPC's flank; the C₄ acid out of PEPC to the mouth of the plasmodesma. */
const PEP_DOCK: V = [1378, 300];
const ACID_OUT: V[] = [[1416, 350], [1392, 380], [1372, 404]];
/** The C₄ acid through the plasmodesma into the chloroplast, next to RuBisCO. */
const STOP: V = [1200, 434];
const ACID_IN: V[] = [ACID_OUT[2], [1334, 386], [C[0], PDY], [1256, 386], [1232, 404], STOP];
/** Its fourth carbon (the one nearest RuBisCO) leaves as CO₂, which moves the last bit to RuBisCO. */
const CO2_AT: V = [STOP[0] - 1.5 * ST, STOP[1]], CO2_DOCK: V = [1194, 344];
const CO2_IN: V[] = [CO2_AT, [1150, 408], [1198, 386], CO2_DOCK];
/** Pyruvate (the 3 carbons left) back through the plasmodesma to PPDK; then PEP up to PEPC. */
const PYR_AT: V = [STOP[0] + 0.5 * ST, STOP[1]], PYR_DOCK: V = [1404, 444];
const PYR_BACK: V[] = [PYR_AT, [1238, 406], [1262, 386], [C[0], PDY], [1330, 388], [1376, 418], PYR_DOCK];
const PEP_AT: V = [PYR_DOCK[0] + 0.5 * ST, PYR_DOCK[1]];
const PEP_UP: V[] = [PEP_AT, [1402, 400], [1380, 348], PEP_DOCK];
const ATP_DOCK: V = [1494, 478];

/* ---------------------------------------------------------------- the drawing */

/** The bundle-sheath chloroplast (an ellipse with its 2 envelope bilayers), its grana, RuBisCO and the CO₂ glow. */
function chloroplast(): string {
  const grana = [[1100, 440], [1150, 486], [1150, 222]].map(([gx, gy]) => [0, 1, 2, 3].map(k => `<rect class="cel-lumen" x="${f(gx - 30)}" y="${f(gy + k * 9)}" width="60" height="6.5" rx="3.2" style="stroke:#9fbf6e;stroke-width:1.3"/>`).join('')).join('');
  return `<ellipse class="co2k-strm" cx="${CP[0]}" cy="${CP[1]}" rx="112" ry="168"/>
    ${actor(`${P}-glow`, `<ellipse cx="${CP[0]}" cy="${CP[1]}" rx="112" ry="168" fill="url(#${P}-glowg)"/>`)}
    ${bilayerE(CP[0], CP[1], 112, 168, 4)}${bilayerE(CP[0], CP[1], 124, 180, 4)}
    ${grana}<image href="${rubPng}" x="${RUB.x}" y="${RUB.y}" width="${RUB.w}" height="${f(RUB_H)}"/>`;
}

const lab = (x: number, y: number, s: string, a: 'start' | 'middle' | 'end' = 'middle', cls = 'co2k-il cel-halo'): string => T(x, y, s, cls, a);
const mn = (x: number, y: number, s: string): string => T(x, y, s, 'cel-mn cel-halo');

/** The molecules, each an actor drawn at the origin (labels ride with them). */
function molecules(): string {
  return [
    actor(`${P}-hco3`, hco3G()), actor(`${P}-hco3l`, mn(0, 0, 'HCO₃⁻')),
    actor(`${P}-pep`, `${carb('CCCP')}${mn(0, -24, 'PEP')}`),
    actor(`${P}-acid`, carb('CCCC')), actor(`${P}-acidl`, mn(0, -24, 'C₄ acid')),
    kidG(`${P}-co2`, R11, 'CO₂'),
    actor(`${P}-pyr`, carb('CCC')), actor(`${P}-pyrl`, mn(0, -24, 'pyruvate')),
    actor(`${P}-pep2`, carb('CCCP')), actor(`${P}-pep2l`, mn(0, -24, 'PEP')),
    actor(`${P}-atp`, `<g class="chn-g">${tagG(0, 0, 'ATP', 'atp')}</g>`),
    actor(`${P}-amp`, `<g class="chn-g">${tagG(0, 0, 'AMP', 'atp')}</g>`),
  ].join('');
}

function magnifier(): string {
  const fib = Array.from({ length: 22 }, (_, i) => { const y = top + 12 + i * 25; return Math.abs(y + 7 - PDY) < 26 ? '' : `<path class="co2k-fib" d="M${W0 + 8 + (i % 3) * 9},${y}q6,7 0,14t0,14"/>`; }).join('');
  // the plasmodesma: an open channel through the wall, lined by the plasma membrane, a desmotubule down its middle
  const pd = `<rect x="${W0 - 1}" y="${PDY - 15}" width="${W1 - W0 + 2}" height="30" class="co2k-cyt"/>
    ${bilayer([{ L: [PM_B, PDY - 15, PM_M, PDY - 15] }], 5, 1.5, 4)}${bilayer([{ L: [PM_B, PDY + 15, PM_M, PDY + 15] }], 5, 1.5, 4)}
    <path d="M${PM_B - 4},${PDY}H${PM_M + 4}" style="stroke:#b9a27a;stroke-width:3;stroke-dasharray:2 3;fill:none"/>`;
  return `${band(x0, W0, 'co2k-cyt')}${band(W0, W1, 'co2k-wallb')}${band(W1, x1, 'co2k-cyt')}${fib}${pmV(PM_B)}${pmV(PM_M)}${pd}
    ${chloroplast()}
    <image href="${pepcPng}" x="${PEPC.x}" y="${PEPC.y}" width="${PEPC.w}" height="${f(PEPC_H)}"/>
    <image href="${ppdkPng}" x="${PPDK.x}" y="${PPDK.y}" width="${PPDK.w}" height="${f(PPDK_H)}"/>
    ${lab(RUB.x + RUB.w / 2, RUB.y + RUB_H + 20, 'RuBisCO')}${lab(CP[0], CP[1] + 208, 'chloroplast')}
    ${lab(PEPC.x + PEPC.w / 2, PEPC.y - 12, 'PEPC')}${lab(PPDK.x + PPDK.w / 2, PPDK.y + PPDK_H + 22, 'PPDK')}
    ${lab(C[0], PDY - 46, 'plasmodesma')}${lab(C[0], bot - 30, 'cell wall')}
    ${molecules()}`;
}

/** Outlines on the photo: the wreath of bundle-sheath cells round the vein, and the one bundle-sheath cell the lens is on. */
const RING = `<ellipse cx="476" cy="385" rx="285" ry="215" style="fill:none;stroke:#2f6f5f;stroke-width:2.4;stroke-dasharray:8 6" opacity=".85"/>`;
const BS1 = `<ellipse cx="656" cy="382" rx="98" ry="110" style="fill:none;stroke:#8f7a3e;stroke-width:2.4;stroke-dasharray:6 4"/>`;

/** The evolution strip, top left: C₃ → C₂ → C₄ on a paper pill, this slide's step (C₄) dark, the others pale. */
const PALE = 'fill:#aeaba1';
const EVO = `<rect x="14" y="14" width="150" height="34" rx="17" style="fill:#fbfaf6;stroke:#d8d5cb;stroke-width:1.2"/>
  <text class="co2k-zl cel-halo" x="89" y="37" text-anchor="middle"><tspan style="${PALE}">C₃ → C₂ → </tspan><tspan>C₄</tspan></text>`;

/** The closing question, 2 key lines centred at x 800 in the band above the magnifier (it shows once the motion stops). */
const KEYS: StageKey[] = [
  { beat: 3, text: 'A cactus keeps its stomata shut on a hot day:', x: 800, y: 50, size: 44 },
  { beat: 3, text: 'how does it get its CO₂?', x: 800, y: 112, size: 44 },
];

/** Beat timings (s); the pauses (holds) come after each step. */
const B2 = { in: [0.2, 0.7], go: [0.9, 3.0], swap: [3.0, 3.4], out: [3.6, 5.0] };
const B3 = { go: [0.3, 3.4], lab: [3.6, 3.9], swap: [3.7, 4.1], co2: [4.3, 5.5], glow: [5.7, 6.9] };
const B4 = { in: [0.2, 0.6], go: [0.9, 4.0], lab: [4.0, 4.3], swap: [4.6, 5.0], lab2: [5.0, 5.3], up: [5.4, 6.9] };
const B1 = { vein: [0.4, 0.9], bs: [1.4, 1.9], mes: [2.4, 2.9], mag: [3.4, 4.2] };
const HOLDS = [[B1.mes[1] + 0.2], [B2.swap[1] + 0.1], [B3.go[1] + 0.1], [B4.lab[1] + 0.1]];

export const STAGING: Staging = {
  ...makeScene({
    id: 'c4k', name: 'c4k · Micrograph and magnifier', holds: HOLDS,
    note: 'The maize micrograph (Kranz) with a lens on the bundle-sheath/mesophyll wall; in the magnifier HCO₃⁻ into PEPC, the C₄ acid through the plasmodesma to RuBisCO (CO₂ released), pyruvate back to PPDK (ATP → AMP) and PEP to PEPC; one mover at a time',
    svg: () => {
      const m = inset(P, `${P}-in`, LENS, 30, C, R, magnifier());
      return `<defs><radialGradient id="${P}-glowg"><stop offset="0" stop-color="#f6c453" stop-opacity=".55"/><stop offset=".65" stop-color="#f6c453" stop-opacity=".32"/><stop offset="1" stop-color="#f6c453" stop-opacity=".08"/></radialGradient></defs>
        <image href="${zeaJpg}" x="0" y="0" width="1000" height="740" preserveAspectRatio="none"/>
        ${actor(`${P}-vein`, T(482, 404, 'vein', 'co2k-zl cel-halo'))}
        ${actor(`${P}-bs`, `${RING}${T(476, 642, 'bundle sheath', 'co2k-zl cel-halo')}`)}
        ${actor(`${P}-mes`, T(905, 540, 'mesophyll', 'co2k-zl cel-halo'))}
        ${actor(`${P}-bs1`, BS1)}
        ${m.lens}${m.box}
        ${actor(`${P}-hd`, `${T(1172, 92, 'bundle-sheath cell', 'co2k-zl')}${T(1440, 92, 'mesophyll cell', 'co2k-zl')}
          ${T(1596, 714, 'RuBisCO: PDB 8RUC · PEPC: PDB 3ZGE (Paulus et al. 2013)', 'co2k-cr', 'end')}
          ${T(1596, 732, 'PPDK: PDB 1VBG, maize (Nakanishi et al. 2005)', 'co2k-cr', 'end')}`)}
        ${EVO}
        ${T(992, 732, 'maize leaf: Berkshire Community College Bioscience Image Library (CC0)', 'co2k-cr cel-halo', 'end')}`;
    },
    frame(a: Api, beat: number, t: number) {
      const at = (b: number, t0: number, t1: number): number => (beat > b ? 1 : beat === b ? ease(t, t0, t1) : 0);
      // beat 1: the names one at a time, then the lens and the magnifier
      a.op(`${P}-vein`, at(0, B1.vein[0], B1.vein[1])); a.op(`${P}-bs`, at(0, B1.bs[0], B1.bs[1])); a.op(`${P}-mes`, at(0, B1.mes[0], B1.mes[1]));
      const mag = at(0, B1.mag[0], B1.mag[1]);
      a.op(`${P}-bs1`, mag); a.op(`${P}-in-lens`, mag); a.op(`${P}-in`, mag); a.op(`${P}-hd`, mag);
      if (beat === 0) return;

      // beat 2: HCO₃⁻ into PEPC (PEP docked on it); the C₄ acid out of PEPC to the plasmodesma
      if (beat === 1) {
        const o = ease(t, B2.in[0], B2.in[1]), gone = 1 - ease(t, B2.swap[0], B2.swap[1]);
        const p = glide(HCO3_IN, t, B2.go[0], B2.go[1]);
        a.put(`${P}-hco3`, p, o * gone);
        a.put(`${P}-hco3l`, [p[0], p[1] + 44], o * (1 - ease(t, 1.6, 2.4)));
        a.put(`${P}-pep`, PEP_DOCK, o * gone);
        const q = glide(ACID_OUT, t, B2.out[0], B2.out[1]), oa = ease(t, B2.swap[0] + 0.1, B2.swap[1] + 0.1);
        a.put(`${P}-acid`, q, oa); a.put(`${P}-acidl`, q, oa);
        return;
      }
      // beat 3: the C₄ acid through the plasmodesma to RuBisCO; CO₂ released, the last bit to RuBisCO; the stroma glows
      if (beat === 2) {
        const q = glide(ACID_IN, t, B3.go[0], B3.go[1]), s = ease(t, B3.swap[0], B3.swap[1]);
        a.put(`${P}-acid`, q, 1 - s); a.put(`${P}-acidl`, q, 1 - ease(t, B3.lab[0], B3.lab[1]));
        kid(a, `${P}-co2`, glide(CO2_IN, t, B3.co2[0], B3.co2[1]), s, { h: ease(t, B3.co2[1] - 0.2, B3.co2[1] + 0.2), lab: 1 - ease(t, B3.co2[0], B3.co2[0] + 0.3) });
        a.put(`${P}-pyr`, PYR_AT, s);
        a.op(`${P}-glow`, ease(t, B3.glow[0], B3.glow[1]));
        return;
      }
      // beat 4: pyruvate back to PPDK; ATP → AMP, pyruvate → PEP; PEP up to PEPC
      kid(a, `${P}-co2`, CO2_DOCK, 1, { h: 1 }); a.op(`${P}-glow`, 1);
      const s = ease(t, B4.swap[0], B4.swap[1]), o = ease(t, B4.in[0], B4.in[1]);
      const p = glide(PYR_BACK, t, B4.go[0], B4.go[1]), q = glide(PEP_UP, t, B4.up[0], B4.up[1]);
      a.put(`${P}-pyr`, p, 1 - s); a.put(`${P}-pyrl`, p, o * (1 - ease(t, B4.lab[0], B4.lab[1])));
      a.put(`${P}-atp`, ATP_DOCK, o * (1 - s)); a.put(`${P}-amp`, ATP_DOCK, s);
      a.put(`${P}-pep2`, q, s); a.put(`${P}-pep2l`, q, ease(t, B4.lab2[0], B4.lab2[1]));
    },
  }),
  keys: KEYS,
};

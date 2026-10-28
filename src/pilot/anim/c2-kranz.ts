// 'lf11a', staging c2k · C₂ photosynthesis (slide C11a; captions C2K, anim/beats-c24.ts) in the micrograph-and-magnifier
// style of anim/c4-style.ts: a real micrograph as the scene, a lens on the place that matters, and a round magnifier drawn
// with the deck's kit (bilayers, real protein structures, atom-ball molecules). One thing moves at a time; one framing.
// - The scene: a C₂ grass leaf in cross-section, one vein with its ring of bundle-sheath cells, the mesophyll around it:
//   Homolepis aturensis, Khoshravesh et al. 2016, J. Exp. Bot. 67:3065, Fig. 1B (CC BY 3.0); the panel cut out, its
//   letters (B, Hoat, M, *) and scale bar painted out from the tissue round them, scaled to 1000 × 740.
// - The lens: on the outer wall of the bundle-sheath cell right of the vein, where it meets a mesophyll cell.
// - The magnifier, left to right: the bundle-sheath cell (a chloroplast with RuBisCO, PDB 8RUC, and below it, on the vein
//   side, a mitochondrion with glycine decarboxylase, PDB 4LHC: in H. aturensis the bundle-sheath mitochondria sit at the
//   vein side among chloroplasts, Khoshravesh 2016), the wall with a plasmodesma, the mesophyll cell (a chloroplast with
//   RuBisCO, a mitochondrion with glycine decarboxylase), its far wall and an air space. Organelles are named on the
//   mesophyll side, proteins on the bundle-sheath side, each name once.
// - Beats: 1 the labels on the photo one at a time, then the lens and the magnifier; 2 "C₃ leaf": a CO₂ leaves the
//   mesophyll mitochondrion and escapes to the air space; 3 the mesophyll's glycine decarboxylase is absent (faded,
//   crossed); a glycine goes through the plasmodesma into the bundle-sheath mitochondrion; 4 there it gives its CO₂, which
//   goes the short way to RuBisCO in the chloroplast; the stroma glows (CO₂ rises); the question.
import homJpg from '../../assets/photos/c11a-homolepis-c2.jpg';
import gdcPng from '../../assets/cell/gdcp.png';
import rubPng from '../../assets/rf/rubisco-8ruc.png';
import { bilayer } from '../figs/cell-schema';
import { C2K } from './beats-c24';
import { actor, bilayerE, carbG, co2G, ease, f, flash, flashDefs, flashG, from, glide, inset, makeScene, T, type V } from './co2-kit';
import type { Staging } from './types';

const P = 'c2k';

/* ---------------------------------------------------------------- the photo (stage units; it fills x 0–1000) */

/** The lens (on the bundle-sheath/mesophyll wall right of the vein) and the ring of bundle-sheath cells. */
const LENS: V = [768, 432];
const RING = `<ellipse cx="488" cy="414" rx="294" ry="240" style="fill:none;stroke:#2f6f5f;stroke-width:2.4;stroke-dasharray:8 6" opacity=".85"/>`;

/* ---------------------------------------------------------------- the magnifier */

const C: V = [1292, 372], R = 268;
const W0 = C[0] - 20, W1 = C[0] + 20, PM_B = W0 - 7, PM_M = W1 + 7, PDY = C[1] + 10;
const top = C[1] - R, bot = C[1] + R, x0 = C[0] - R, x1 = C[0] + R;
/** The mesophyll cell's far wall (its middle), gently bowed out; the air space beyond it. */
const farX = (y: number): number => 1472 - 20 * ((y - C[1]) / R) ** 2;
const band = (a: number, b: number, cls: string): string => `<rect class="${cls}" x="${f(a)}" y="${top}" width="${f(b - a)}" height="${2 * R}"/>`;
/** A plasma membrane down the wall, open where the plasmodesma passes (its 2 halves meet the channel's lining). */
const pmV = (x: number): string => bilayer([{ L: [x, top, x, PDY - 15] }], 6, 1.6, 4.2) + bilayer([{ L: [x, PDY + 15, x, bot] }], 6, 1.6, 4.2);
/** Wall fibres down a band starting at x (every 25 units), left out where skip(y). */
const fibres = (x: number, skip: (y: number) => boolean): string => Array.from({ length: 22 }, (_, i) => { const y = top + 12 + i * 25; return skip(y + 7) ? '' : `<path class="co2k-fib" d="M${f(x + (i % 3) * 7)},${y}q5,7 0,14t0,14"/>`; }).join('');

/** A thylakoid stack: n discs of width w centred on (x, y). */
const granum = (x: number, y: number, w: number, n = 4): string => Array.from({ length: n }, (_, k) => `<rect class="cel-lumen" x="${f(x - w / 2)}" y="${f(y + k * 8.5)}" width="${f(w)}" height="6" rx="3" style="stroke:#9fbf6e;stroke-width:1.2"/>`).join('');
/** A chloroplast: stroma (with an optional glow over it), the double envelope, grana and RuBisCO (image width rw at rub). */
function chloroplast(c: V, rx: number, ry: number, rub: V, rw: number, grana: string, glow = ''): string {
  return `<ellipse class="co2k-strm" cx="${f(c[0])}" cy="${f(c[1])}" rx="${rx}" ry="${ry}"/>${glow}${bilayerE(c[0], c[1], rx, ry, 4)}${bilayerE(c[0], c[1], rx + 11, ry + 11, 4)}
    ${grana}<image href="${rubPng}" x="${f(rub[0] - rw / 2)}" y="${f(rub[1] - (rw * 471) / 548 / 2)}" width="${rw}" height="${f((rw * 471) / 548)}"/>`;
}
/** A mitochondrion: outer and inner bilayer, matrix, cristae (inner-membrane folds from its top and bottom), glycine
 *  decarboxylase (image width gw at g, keyed k). */
function mito(c: V, rx: number, ry: number, g: V, gw: number, k: string, folds: number[], fl = 13): string {
  const ri = rx - 9, qi = ry - 9;
  const cr = folds.map((u, i) => {
    const x = c[0] + u * ri, h = qi * Math.sqrt(1 - u * u), s = i % 2 ? 1 : -1, y0 = c[1] + s * (h - 1);
    return bilayer([{ L: [x, y0, x, y0 - s * fl] }], 3.4, 1.2, 3.2);
  }).join('');
  return `<ellipse cx="${f(c[0])}" cy="${f(c[1])}" rx="${ri}" ry="${qi}" style="fill:#f8e4d8"/>${bilayerE(c[0], c[1], rx, ry, 3.6)}${bilayerE(c[0], c[1], ri, qi, 3.6)}${cr}
    <image data-k="${k}" href="${gdcPng}" x="${f(g[0] - gw / 2)}" y="${f(g[1] - (gw * 222) / 302 / 2)}" width="${gw}" height="${f((gw * 222) / 302)}"/>`;
}

/** Bundle-sheath side: the chloroplast (RuBisCO), the mitochondrion below it (glycine decarboxylase). */
const BCP: V = [1172, 264], BRX = 76, BRY = 88, BRUB: V = [1166, 250];
const BMT: V = [1140, 432], BGDC: V = [1116, 432];
/** Mesophyll side: the chloroplast, the mitochondrion. */
const MCP: V = [1386, 252], MRX = 47, MRY = 76;
const MMT: V = [1391, 490];

/** Where the molecules go. Beat 2: CO₂ from the mesophyll's glycine decarboxylase out to the air space. Beat 3: glycine
 *  from beside the mesophyll mitochondrion through the plasmodesma to the bundle-sheath glycine decarboxylase. Beat 4:
 *  CO₂ from there up to RuBisCO. */
const CO2_M: V[] = [[MMT[0] + 8, MMT[1] - 2], [1438, 478], [1466, 466], [1494, 458], [1514, 456]];
const GLY: V[] = [[1392, 404], [1344, 390], [PM_M + 4, PDY], [C[0], PDY], [PM_B - 4, PDY], [1234, 394], [1202, 414], [1166, 432]];
const CO2_B: V[] = [[1166, 430], [1170, 392], [1168, 340], [1166, 302]];

function magnifier(): string {
  const fy = (y: number): number => farX(y);
  const far = Array.from({ length: 41 }, (_, i) => top + (i * 2 * R) / 40);
  const wallFar = `<path class="co2k-wallb" d="M${far.map(y => `${f(fy(y) - 8)},${f(y)}`).join('L')}L${far.slice().reverse().map(y => `${f(fy(y) + 8)},${f(y)}`).join('L')}Z"/>`;
  const air = `<path class="co2k-ias" d="M${far.map(y => `${f(fy(y) + 8)},${f(y)}`).join('L')}L${x1 + 4},${bot}L${x1 + 4},${top}Z"/>`;
  const pmFar = bilayer(far.slice(0, -1).map((y, i) => ({ L: [fy(y) - 15, y, fy(far[i + 1]) - 15, far[i + 1]] as [number, number, number, number] })), 6, 1.6, 4.2);
  const fibFar = Array.from({ length: 22 }, (_, i) => { const y = top + 12 + i * 25; return `<path class="co2k-fib" d="M${f(fy(y + 7) - 3)},${y}q4,7 0,14t0,14"/>`; }).join('');
  // the plasmodesma: an open channel through the wall, lined by the plasma membrane, a desmotubule down its middle
  const pd = `<rect x="${W0 - 1}" y="${PDY - 15}" width="${W1 - W0 + 2}" height="30" class="co2k-cyt"/>
    ${bilayer([{ L: [PM_B, PDY - 15, PM_M, PDY - 15] }], 5, 1.5, 4)}${bilayer([{ L: [PM_B, PDY + 15, PM_M, PDY + 15] }], 5, 1.5, 4)}
    <path d="M${PM_B - 4},${PDY}H${PM_M + 4}" style="stroke:#b9a27a;stroke-width:3;stroke-dasharray:2 3;fill:none"/>`;
  const lab = (x: number, y: number, s: string, a: 'start' | 'middle' | 'end' = 'middle'): string => T(x, y, s, 'co2k-il cel-halo', a);
  const glow = `<ellipse data-k="${P}-glow" data-actor="1" display="none" cx="${BCP[0]}" cy="${BCP[1]}" rx="${BRX}" ry="${BRY}" fill="url(#${P}-glowg)"/>`;
  const bsCp = chloroplast(BCP, BRX, BRY, BRUB, 84, `${granum(1112, 300, 26, 3)}${granum(1226, 286, 24, 3)}`, glow);
  const mCp = chloroplast(MCP, MRX, MRY, MCP, 64, `${granum(MCP[0], 192, 30, 3)}${granum(MCP[0], 290, 30, 3)}`);
  // the cross over the mesophyll's glycine decarboxylase (beat 3 on: it is absent in a C₂ leaf's mesophyll)
  const cross = actor(`${P}-x`, `<path d="M${MMT[0] - 24},${MMT[1] - 20}L${MMT[0] + 24},${MMT[1] + 20}M${MMT[0] + 24},${MMT[1] - 20}L${MMT[0] - 24},${MMT[1] + 20}" style="fill:none;stroke:#b0431f;stroke-width:3.4;stroke-linecap:round"/>`);
  return `<defs>${flashDefs(P)}<radialGradient id="${P}-glowg"><stop offset="0" stop-color="#f6c453" stop-opacity=".62"/><stop offset=".7" stop-color="#f6c453" stop-opacity=".34"/><stop offset="1" stop-color="#f6c453" stop-opacity=".12"/></radialGradient></defs>
    ${band(x0, W0, 'co2k-cyt')}${band(W0, W1, 'co2k-wallb')}${band(W1, x1, 'co2k-cyt')}${air}${wallFar}
    ${fibres(W0 + 8, y => Math.abs(y - PDY) < 26)}${fibFar}${pmV(PM_B)}${pmV(PM_M)}${pmFar}${pd}
    ${bsCp}${mito(BMT, 74, 40, BGDC, 56, `${P}-bgdc`, [-0.9, -0.82, 0.48, 0.84], 14)}
    ${mCp}${mito(MMT, 52, 36, MMT, 46, `${P}-mgdc`, [-0.8, -0.64, 0.64, 0.8], 10)}
    ${lab(BRUB[0], 206, 'RuBisCO')}${lab(1150, 496, 'glycine decarboxylase')}
    ${lab(MCP[0] + 2, 364, 'chloroplast')}${lab(MMT[0], 550, 'mitochondrion')}${lab(1514, 402, 'air space')}
    ${lab(C[0], PDY + 46, 'plasmodesma')}${lab(C[0], bot - 30, 'cell wall')}
    ${cross}
    ${actor(`${P}-fl`, flashG(P, 30))}
    ${actor(`${P}-co2a`, `<g>${co2G(9)}</g>${T(0, -18, 'CO₂', 'cel-mn cel-halo')}`)}
    ${actor(`${P}-gly`, `${carbG('CCN', 8)}${T(0, -20, 'glycine', 'cel-mn cel-halo')}`)}
    ${actor(`${P}-co2b`, `<g>${co2G(8)}</g>${T(0, 28, 'CO₂', 'cel-mn cel-halo')}`)}`;
}

/** The evolution strip: C₃ → C₂ → C₄ on a paper pill, this slide's step dark. */
const EVO = `<rect x="14" y="12" width="164" height="34" rx="17" style="fill:#fffdf8;stroke:#d8d5cb;stroke-width:1.2" opacity=".94"/>
  <text class="co2k-zl cel-halo" x="96" y="35" text-anchor="middle" style="font-size:18px"><tspan style="fill:#b9b6ac">C₃ → </tspan><tspan style="fill:#141413">C₂</tspan><tspan style="fill:#b9b6ac"> → C₄</tspan></text>`;
/** The "C₃ leaf" pill, on the magnifier's rim. */
const PILL = `<rect x="${C[0] - 44}" y="${top - 15}" width="88" height="30" rx="15" style="fill:#fffdf8;stroke:#8a877d;stroke-width:1.4"/>${T(C[0], top + 6, 'C₃ leaf', 'co2k-ilb')}`;

export const STAGING: Staging = {
  ...makeScene({
    id: 'c2k', name: 'c2k · Micrograph and magnifier: glycine to the bundle sheath', beats: C2K,
    note: 'A C₂ grass leaf (Homolepis aturensis, Khoshravesh et al. 2016), a lens on a bundle-sheath/mesophyll wall, a magnifier with bilayers, RuBisCO (8RUC) and glycine decarboxylase (4LHC): C₃ CO₂ escapes; C₂ glycine goes through the plasmodesma to the bundle-sheath mitochondrion; its CO₂ goes to RuBisCO next door',
    svg: () => {
      const m = inset(P, `${P}-in`, LENS, 30, C, R, magnifier());
      return `<image href="${homJpg}" x="0" y="0" width="1000" height="740" preserveAspectRatio="none"/>${EVO}
        ${actor(`${P}-vein`, T(500, 420, 'vein', 'co2k-zl cel-halo'))}
        ${actor(`${P}-bs`, `${RING}${T(292, 452, 'bundle sheath', 'co2k-zl cel-halo')}`)}
        ${actor(`${P}-mes`, T(872, 238, 'mesophyll', 'co2k-zl cel-halo'))}
        ${m.lens}${m.box}
        ${actor(`${P}-hd`, `${T(1150, 92, 'bundle-sheath cell', 'co2k-zl')}${T(1420, 92, 'mesophyll cell', 'co2k-zl')}`)}
        ${actor(`${P}-pill`, PILL)}
        ${T(992, 732, '<tspan font-style="italic">Homolepis aturensis</tspan>: Khoshravesh et al. 2016, J. Exp. Bot. (CC BY 3.0)', 'co2k-cr cel-halo', 'end')}
        ${T(1596, 732, 'RuBisCO: PDB 8RUC · glycine decarboxylase: PDB 4LHC', 'co2k-cr', 'end')}`;
    },
    frame(a, beat, t) {
      // beat 1: the labels on the photo, one at a time; then the lens and the magnifier (nothing moves)
      a.op(`${P}-vein`, from(beat, t, 0, 0.3, 0.7));
      a.op(`${P}-bs`, from(beat, t, 0, 1.1, 1.5));
      a.op(`${P}-mes`, from(beat, t, 0, 1.9, 2.3));
      a.op(`${P}-in-lens`, from(beat, t, 0, 2.7, 3.1));
      const mag = from(beat, t, 0, 3.1, 3.7);
      a.op(`${P}-in`, mag); a.op(`${P}-hd`, mag);
      // beat 2 (C₃ leaf): the pill; a CO₂ appears at the mesophyll's glycine decarboxylase and drifts out to the air space
      if (beat === 1) {
        a.op(`${P}-pill`, ease(t, 0.2, 0.6));
        a.put(`${P}-co2a`, glide(CO2_M, t, 1.5, 4.7), ease(t, 0.8, 1.2));
      }
      // beat 3: the pill and that CO₂ go; the mesophyll's glycine decarboxylase fades and is crossed; a glycine goes from
      // beside the mesophyll mitochondrion through the plasmodesma into the bundle-sheath mitochondrion
      if (beat === 2) {
        const out = 1 - ease(t, 0, 0.4);
        a.op(`${P}-pill`, out); a.put(`${P}-co2a`, CO2_M[CO2_M.length - 1], out);
        a.put(`${P}-gly`, glide(GLY, t, 2.0, 5.6), ease(t, 1.4, 1.8));
      }
      const gone = beat > 2 ? 1 : beat === 2 ? ease(t, 0.5, 1.1) : 0;
      a.op(`${P}-mgdc`, 1 - 0.72 * gone); a.op(`${P}-x`, gone);
      // beat 4: glycine decarboxylase releases the CO₂ (a flash; glycine gives way to CO₂), which goes up to RuBisCO;
      // then the stroma glows
      if (beat === 3) {
        const g = GLY[GLY.length - 1];
        flash(a, t, 0.5, g, `${P}-fl`);
        a.put(`${P}-gly`, g, 1 - ease(t, 0.4, 0.8));
        a.put(`${P}-co2b`, glide(CO2_B, t, 1.1, 3.3), ease(t, 0.4, 0.8));
        a.op(`${P}-glow`, ease(t, 3.5, 4.9));
      }
    },
  }),
  keys: [
    { beat: 3, text: 'What if the leaf pumped CO₂', x: 800, y: 636, size: 44 },
    { beat: 3, text: 'into the bundle sheath directly?', x: 800, y: 686, size: 44 },
  ],
};

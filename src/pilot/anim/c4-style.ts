// Style frame for the C₂ and C₄ slides (lecturer, 29 Oct 2026, late: "we use lipid, we use real protein structures; do
// your research first, find the images, then show me how you're going to draw it; once the style is set, C₂, C₄ and
// CAM will be illustrated well"). One still, composed like slide 19 (CO₂ uptake): a real micrograph as the scene, a lens
// on the place that matters, and a round magnifier drawn with the deck's kit (bilayers, real protein structures,
// atom-ball molecules).
// - The scene: a maize leaf in cross-section, one vein with its wreath of bundle-sheath cells (Kranz), mesophyll around
//   it (Berkshire Community College Bioscience Image Library, Wikimedia Commons, CC0; 400×; cropped to x 984–2484,
//   y 287–1397 of the 3264 × 1840 original).
// - The lens: on the wall between a bundle-sheath cell and the mesophyll cell next to it.
// - The magnifier, left to right: the bundle-sheath chloroplast (stroma, thylakoids, RuBisCO: PDB 8RUC), its double
//   envelope, cytosol, plasma membrane, the cell wall with a plasmodesma, plasma membrane, the mesophyll cytosol with
//   PEPC (PDB 3ZGE, the C₄ enzyme of Flaveria trinervia, Paulus et al. 2013, rendered as 8RUC, hue turned to teal).
//   HCO₃⁻ at PEPC, the C₄ acid in the plasmodesma, CO₂ released at RuBisCO.
import zeaJpg from '../../assets/photos/c12-zea-kranz.jpg';
import pepcPng from '../../assets/rf/pepc-3zge.png';
import rubPng from '../../assets/rf/rubisco-8ruc.png';
import { bilayer } from '../figs/cell-schema';
import { bilayerE, carbG, co2G, f, inset, makeScene, T, type V } from './co2-kit';
import type { Beat, Staging } from './types';

const P = 'c4s';
const BEATS: Beat[] = [{ tag: 'Style frame', say: 'Maize leaf: a bundle-sheath cell and a mesophyll cell meet at a wall crossed by plasmodesmata.', cite: [] }];

/** The lens on the photo (stage units; the photo fills x 0–1000) and the magnifier. */
const LENS: V = [752, 386], C: V = [1292, 372], R = 268;
/** The magnifier: the wall between the 2 cells down its middle; the bundle-sheath cell on the left (cytosol and a
 *  chloroplast with its double envelope), the mesophyll cell on the right (cytosol with PEPC). */
const W0 = C[0] - 20, W1 = C[0] + 20, PM_B = W0 - 7, PM_M = W1 + 7, PDY = C[1] + 10;
const top = C[1] - R, bot = C[1] + R, x0 = C[0] - R, x1 = C[0] + R;
const band = (a: number, b: number, cls: string): string => `<rect class="${cls}" x="${f(a)}" y="${top}" width="${f(b - a)}" height="${2 * R}"/>`;
/** A plasma membrane down the wall, open where the plasmodesma passes (its 2 halves meet the channel's lining). */
const pmV = (x: number): string => bilayer([{ L: [x, top, x, PDY - 15] }], 6, 1.6, 4.2) + bilayer([{ L: [x, PDY + 15, x, bot] }], 6, 1.6, 4.2);

/** HCO₃⁻: a C with 3 O, one of them carrying the H. */
const hco3G = (r = 11): string => `<circle class="atom atom-H" cx="${f(-1.7 * r)}" cy="${f(-1.55 * r)}" r="${f(r * 0.56)}"/>
  <circle class="atom atom-O" cx="${f(-1.2 * r)}" cy="${f(-0.75 * r)}" r="${r}"/><circle class="atom atom-O" cx="${f(1.2 * r)}" cy="${f(-0.75 * r)}" r="${r}"/>
  <circle class="atom atom-O" cx="0" cy="${f(1.3 * r)}" r="${r}"/><circle class="atom atom-C" r="${r}"/>`;

/** The bundle-sheath chloroplast (an ellipse with its 2 envelope bilayers), its grana and RuBisCO. */
const CP: V = [1150, 360];
function chloroplast(): string {
  const grana = [[1100, 450], [1170, 470], [1132, 270]].map(([gx, gy]) => [0, 1, 2, 3].map(k => `<rect class="cel-lumen" x="${f(gx - 30)}" y="${f(gy + k * 9)}" width="60" height="6.5" rx="3.2" style="stroke:#9fbf6e;stroke-width:1.3"/>`).join('')).join('');
  return `<ellipse class="co2k-strm" cx="${CP[0]}" cy="${CP[1]}" rx="112" ry="168"/>${bilayerE(CP[0], CP[1], 112, 168, 4)}${bilayerE(CP[0], CP[1], 124, 180, 4)}
    ${grana}<image href="${rubPng}" x="${f(CP[0] - 66)}" y="${f(CP[1] - 72)}" width="122" height="${f((122 * 471) / 548)}"/>`;
}

function magnifier(): string {
  const fib = Array.from({ length: 22 }, (_, i) => { const y = top + 12 + i * 25; return Math.abs(y + 7 - PDY) < 26 ? '' : `<path class="co2k-fib" d="M${W0 + 8 + (i % 3) * 9},${y}q6,7 0,14t0,14"/>`; }).join('');
  // the plasmodesma: an open channel through the wall, lined by the plasma membrane, a desmotubule down its middle
  const pd = `<rect x="${W0 - 1}" y="${PDY - 15}" width="${W1 - W0 + 2}" height="30" class="co2k-cyt"/>
    ${bilayer([{ L: [PM_B, PDY - 15, PM_M, PDY - 15] }], 5, 1.5, 4)}${bilayer([{ L: [PM_B, PDY + 15, PM_M, PDY + 15] }], 5, 1.5, 4)}
    <path d="M${PM_B - 4},${PDY}H${PM_M + 4}" style="stroke:#b9a27a;stroke-width:3;stroke-dasharray:2 3;fill:none"/>`;
  const lab = (x: number, y: number, s: string, a: 'start' | 'middle' | 'end' = 'middle', cls = 'co2k-il cel-halo'): string => T(x, y, s, cls, a);
  return `${band(x0, W0, 'co2k-cyt')}${band(W0, W1, 'co2k-wallb')}${band(W1, x1, 'co2k-cyt')}${fib}${pmV(PM_B)}${pmV(PM_M)}${pd}
    ${chloroplast()}
    <image href="${pepcPng}" x="1384" y="236" width="132" height="${f((132 * 517) / 608)}"/>
    <g transform="translate(1474 470)">${hco3G(10)}</g><g transform="translate(${C[0]} ${PDY - 1})">${carbG('CCCC', 7)}</g>
    <g transform="translate(1188 236)">${co2G(10)}</g>
        ${lab(CP[0] - 6, CP[1] + 52, 'RuBisCO')}${lab(1188, 212, 'CO₂', 'middle', 'cel-mn cel-halo')}${lab(CP[0], CP[1] + 208, 'chloroplast')}
    ${lab(1450, 374, 'PEPC')}${lab(1474, 512, 'HCO₃⁻', 'middle', 'cel-mn cel-halo')}${lab(C[0], PDY - 26, 'C₄ acid', 'middle', 'cel-mn cel-halo')}
    ${lab(C[0], PDY + 46, 'plasmodesma')}${lab(C[0], bot - 30, 'cell wall')}`;
}

/** Outlines on the photo: the wreath of bundle-sheath cells round the vein, and the one bundle-sheath cell the lens is on. */
const RING = `<ellipse cx="476" cy="385" rx="285" ry="215" style="fill:none;stroke:#2f6f5f;stroke-width:2.4;stroke-dasharray:8 6" opacity=".85"/>`;
const BS1 = `<ellipse cx="656" cy="382" rx="98" ry="110" style="fill:none;stroke:#8f7a3e;stroke-width:2.4;stroke-dasharray:6 4"/>`;

export const STAGING: Staging = makeScene({
  id: 'style', name: 'Style frame: maize leaf, bundle sheath and mesophyll', beats: BEATS,
  note: 'A real micrograph of a maize leaf (Kranz), a lens on the wall between a bundle-sheath and a mesophyll cell, and a magnifier drawn with bilayers, real protein structures (RuBisCO 8RUC, PEPC 3ZGE) and atom-ball molecules',
  svg: () => {
    const m = inset(P, `${P}-in`, LENS, 30, C, R, magnifier());
    return `<image href="${zeaJpg}" x="0" y="0" width="1000" height="740" preserveAspectRatio="none"/>${RING}${BS1}
      ${T(476, 642, 'bundle sheath', 'co2k-zl cel-halo')}${T(905, 540, 'mesophyll', 'co2k-zl cel-halo')}
      ${m.lens}${m.box}
      ${T(1150, 92, 'bundle-sheath cell', 'co2k-zl')}${T(1440, 92, 'mesophyll cell', 'co2k-zl')}
      ${T(992, 732, 'maize leaf: Berkshire Community College Bioscience Image Library (CC0)', 'co2k-cr cel-halo', 'end')}
      ${T(1596, 732, 'RuBisCO: PDB 8RUC · PEPC: PDB 3ZGE (Paulus et al. 2013)', 'co2k-cr', 'end')}`;
  },
  frame(a) {
    a.op(`${P}-in`, 1); a.op(`${P}-in-lens`, 1);
  },
});

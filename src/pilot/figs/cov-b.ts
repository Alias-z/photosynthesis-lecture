// The overview slide's page figure, layout b (slide C10o; brief OV_BRIEF.md): the end state of the animation 'ovb'
// (anim/ov-b.ts), still and without the problem panel. A climate band from "cool, moist" through "hot, sunny" to
// "hot, dry"; C₃ and C₄ pinned above it, C₂ and CAM below it, each a card with a plant photo, a lens onto its leaf
// section, RuBisCO (PDB 8RUC) and its CO₂ gauge (low, raised, high, high by day), and the 2 short lines; rust arrows
// C₃ → C₂ → C₄ and C₃ → CAM, "evolved from C₃, many times". Images and credits as in anim/ov-b.ts.
import { bandDefs, cardH, cardParts, headAt, kidStill, KINDS, type Kind, type Spec } from '../anim/ov-b';
import { T, type V } from '../anim/co2-kit';

/** Card geometry on the 800 × 600 page (≈ 1 screen px per unit): letters ≥ 12.5 px. */
const FIG: Spec = {
  w: 244, name: [12, 32, 26], photo: [10, 42, 106, 76], lens: [114, 118, 29], spot: 6,
  rub: [162, 86, 42], tube: [188, 12, 48, 136], kr: 7, pitch: 18,
  line: [12, 172, 15.5, 12.5], by: [212, 167, 12.5], pad: 10, ring: 2,
};
const BX = 14, BY = 288, BW = 772, BH = 28;
const PIN: Record<string, number> = { c3: 128, c2: 300, c4: 400, cam: 690 };
const CARD_X: Record<string, number> = { c3: 8, c2: 150, c4: 278, cam: 548 };
const ABOVE: Record<string, boolean> = { c3: true, c2: false, c4: true, cam: false };
const cardY = (k: Kind): number => (ABOVE[k.id] ? BY - 16 - cardH(k, FIG) : BY + BH + 14);
const ARROWS: string[] = [
  'M232,274C236,294 234,308 230,327',
  'M352,329C352,308 348,292 344,276',
  'M128,73C146,20 420,20 560,28C640,34 614,190 604,250C598,288 594,306 598,328',
];
const RUST = 'fill:none;stroke:#a9532f;stroke-width:2.8;stroke-linecap:round';
const HALO = 'fill:none;stroke:#fbfaf6;stroke-width:7;stroke-linecap:round';

export function draw(): string {
  const p = 'fovb';
  const cards = KINDS.map(k => {
    const q = `${p}-${k.id}`, x = CARD_X[k.id], y = cardY(k), h = cardH(k, FIG);
    const c = cardParts(q, k, FIG, PIN[k.id] - x, ABOVE[k.id] ? h + 16 : -14, k.level);
    const kids = c.rows.slice(0, k.level).map((r: V, i) => kidStill(`${q}-k${i}`, r, FIG.kr)).join('');
    return `<g transform="translate(${x} ${y})">${c.body}${kids}${c.over}${c.lines}${c.by}</g>`;
  }).join('');
  const band = `<rect x="${BX}" y="${BY}" width="${BW}" height="${BH}" rx="${BH / 2}" fill="url(#${p}-band)" style="stroke:#d3c9ad;stroke-width:1"/>
    ${T(BX + 14, BY + 19, 'cool, moist', 'co2k-zl', 'start', ' style="font-size:14px"')}${T(400, BY + 19, 'hot, sunny', 'co2k-zl', 'middle', ' style="font-size:14px"')}
    ${T(BX + BW - 14, BY + 19, 'hot, dry', 'co2k-zl', 'end', ' style="font-size:14px"')}`;
  const arrows = ARROWS.map(d => `<path d="${d}" style="${HALO}"/><path d="${d}" style="${RUST}"/>${headAt(d, 13)}`).join('');
  const cr = (y: number, s: string): string => T(14, y, s, 'co2k-cr', 'start', ' style="font-size:12.5px"');
  const it = (s: string): string => `<tspan font-style="italic">${s}</tspan>`;
  return `<svg class="fig-svg" viewBox="0 0 800 600" role="img" aria-label="A horizontal climate band runs from cool and moist on the left (pale blue-green) through hot and sunny in the middle (warm yellow) to hot and dry on the right (sand). Four cards are pinned to it where each photosynthesis type lives, each with a plant photo, a round lens onto its leaf section, the RuBisCO structure and a glass tube of CO2 characters beside it. C3, above the cool, moist end: ripe wheat, about 90 % of species, cool to warm, moist places; its tube holds 2 CO2, low. C2, below the band toward warm: wild rocket on dry sand, rare, warm, sunny, dry places; 4 CO2, raised. C4, above the middle: a maize field, about 3 % of species and about a quarter of land photosynthesis, hot, sunny grasslands; 7 CO2, high. CAM, below the hot, dry end: an agave, about 6 % of species, deserts and epiphytes; 7 CO2, high, by day. Rust arrows lead from C3 to C2 to C4, and over the top from C3 to CAM: evolved from C3, many times.">
    <defs>${bandDefs(`${p}-band`)}</defs><g class="dk1 co2k">
    ${band}${cards}${arrows}
    ${T(700, 156, 'evolved from C₃,', 'co2k-q', 'middle', ' style="font-size:15px"')}${T(700, 175, 'many times', 'co2k-q', 'middle', ' style="font-size:15px"')}
    ${cr(549, 'C₃: wheat, Hans Hillewaert (CC BY-SA 3.0) · C₂: wild rocket, Krzysztof Ziarnek, Kenraiz (CC BY-SA 4.0)')}
    ${cr(564, `C₄: maize, High Contrast (CC BY 3.0 DE) · CAM: ${it('Agave americana')}, Fawaz.tairou (CC BY 4.0) · photos: Wikimedia Commons`)}
    ${cr(579, 'Leaf sections: C₃ and C₂, Khoshravesh et al. 2016, J. Exp. Bot. (CC BY 3.0); C₄ and CAM, Berkshire Community')}
    ${cr(594, 'College Bioscience Image Library (CC0) · RuBisCO: PDB 8RUC')}</g></svg>`;
}

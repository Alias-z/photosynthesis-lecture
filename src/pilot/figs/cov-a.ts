// The overview slide's page figure, layout a: the end state of animation 'ova' (anim/ov-a.ts), still, without the problem
// panel. 4 columns, C₃, C₂, C₄, CAM: the type name, the plant photo, the leaf section in a round lens, RuBisCO (PDB 8RUC)
// with its CO₂ gauge (C₃ low, C₂ raised, C₄ high, CAM high by day), the 2 short lines; under them the arrows of descent
// from C₃ and "evolved from C₃, many times". Images and credits as in ov-a.ts.
import { credit, svg } from './cc-kit';
import { dayG, EVO_LABEL, evoPaths, kidStill, lensG, linesG, nameG, photoG, polyD, rubG, slots, tubeG, TYPES, type Geo } from '../anim/ov-a';
import { T } from '../anim/co2-kit';

const P = 'cova';
const G: Geo = {
  X: [100, 300, 500, 700], nameY: 34, nameSize: 30,
  ph: { y: 48, w: 186, h: 106, r: 10 },
  lens: { y: 198, r: 38 },
  rub: { dx: -26, y: 284, w: 76 },
  tube: { dx: 18, y: 244, w: 42, h: 82, kr: 6.5 },
  line: { y: 352, h: 17, size: 14, page: true },
};

export function draw(): string {
  const cols = TYPES.map((s, i) => {
    // CAM's RuBisCO and gauge sit a little left, so that "by day" fits inside the figure
    const X = G.X[i], sh = s.day ? -44 : 0, tx = X + G.tube.dx + sh;
    const kids = slots(tx, G.tube.y, G.tube.w, G.tube.h).slice(0, s.level).map((q, j) => kidStill(`${P}k${i}${j}`, q, G.tube.kr, i === 0 ? 's' : 'n')).join('');
    return `${nameG(X, s, G)}${photoG(`${P}-ph${i}`, s.photo, X - G.ph.w / 2, G.ph.y, G.ph.w, G.ph.h, G.ph.r)}
      ${lensG(`${P}-ln${i}`, s.sec, [X, G.lens.y], G.lens.r)}
      ${rubG([X + G.rub.dx + sh, G.rub.y], G.rub.w)}${tubeG(tx, G.tube.y, G.tube.w, G.tube.h, `${P}lq${i}`, s.level)}${kids}
      ${s.day ? dayG(tx + G.tube.w + 4, G.tube.y + 18, 12) : ''}
      ${linesG(X, s, G)}`;
  }).join('');
  const evo = evoPaths(G.X, 424, 454, 16).map(e => `<path d="${polyD(e.q)}" style="fill:none;stroke:#3d3d3a;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round"/><path d="${e.head}" style="fill:#3d3d3a"/>`).join('');
  const cr = [
    'Wikimedia Commons: wheat, Hans Hillewaert (CC BY-SA 3.0) · wild rocket, Krzysztof Ziarnek, Kenraiz (CC BY-SA 4.0)',
    'maize, High Contrast (CC BY 3.0 DE) · <tspan font-style="italic">Agave americana</tspan>, Fawaz.tairou (CC BY 4.0)',
    'Sections: Khoshravesh et al. 2016 (CC BY 3.0) · Berkshire Community College Bioscience Image Library (CC0)',
    'RuBisCO: PDB 8RUC',
  ];
  return svg('Four columns, left to right: C3, C2, C4 and CAM. Each has its name, a photo of a typical plant (ripe wheat; wild rocket on dry sand; a maize field; Agave americana), a round lens on a leaf cross-section, and the same RuBisCO structure with a CO2 gauge beside it: a tube holding CO2 molecules, 1 of 5 in C3 with the stomata closed, 3 in C2, 5 in C4 and 5 in CAM by day. Under each: C3, about 90 % of species, cool to warm, moist places; C2, rare, warm, sunny, dry places; C4, about 3 % of species and about a quarter of land photosynthesis, hot, sunny grasslands; CAM, about 6 % of species, deserts and epiphytes. Arrows under the columns run from C3 to C2 to C4 and from C3 to CAM: evolved from C3, many times.', `
    <g class="dk1 co2k">${cols}${evo}${T(400, 486, EVO_LABEL, 'co2k-note', 'middle', ' style="font-size:16px;fill:#141413"')}</g>
    ${cr.map((s, k) => credit(400, 528 + k * 17, s, 'middle')).join('')}`);
}

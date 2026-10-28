// Slide 9 figure concepts. What each must show is in research/figure-briefs/FIGURE_BRIEF.md.
import './s9.css';
import { text } from '../mechanisms';
import { bilayer, bolt, illusHeads, molecule, tag, water } from '../illus';

export const VARIANTS = [
  { id: 'a', name: 'Three flows' },
  { id: 'b', name: 'Lifts and dam' },
  { id: 'c', name: 'Icon Z' },
  { id: 'd', name: 'Machine' },
  { id: 'e', name: 'Four steps' },
];

/* ---------- shared parts ---------- */

/** Arrowheads for the flow paths, sized in user units so thick strokes keep small heads. */
const marks = (p: string): string =>
  `<defs>${[['fe', 'f9-hd-e'], ['fh', 'f9-hd-h'], ['fk', 'f9-hd-k']].map(([id, c]) =>
    `<marker id="${p}-${id}" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="15" markerHeight="15" markerUnits="userSpaceOnUse" orient="auto"><path class="${c}" d="M0,0L10,5L0,10z"/></marker>`).join('')}</defs>`;

const svg = (p: string, label: string, body: string): string =>
  `<svg class="fig-svg f9" viewBox="0 0 800 600" role="img" aria-label="${label}">${illusHeads(p)}${marks(p)}${body}</svg>`;

/** Electron path: red dashed. */
const ep = (p: string, d: string, thin = false): string =>
  `<path class="f9-fe${thin ? ' f9-thin' : ''}" d="${d}" marker-end="url(#${p}-fe)"/>`;
/** Proton path: blue dotted. */
const hp = (p: string, d: string, thin = false): string =>
  `<path class="f9-fh${thin ? ' f9-thin' : ''}" d="${d}" marker-end="url(#${p}-fh)"/>`;
/** Plain conversion arrow. */
const kp = (p: string, d: string): string => `<path class="f9-k" d="${d}" marker-end="url(#${p}-fk)"/>`;

/** A proton: white ball, blue outline. */
const H = (x: number, y: number, r = 14): string =>
  `<circle class="tag-h" cx="${x}" cy="${y}" r="${r}"/>${text(x, y + 5, 'H⁺', 'f9-ht')}`;
const eLab = (x: number, y: number, anchor: 'start' | 'middle' | 'end' = 'middle'): string => text(x, y, 'e⁻', 'sm f9-e', anchor);

/** A photosystem: green core inside a lighter antenna. */
function ps(cx: number, cy: number, w: number, h: number, label = '', cls = 'lab f9-b', inset = 14): string {
  const r = Math.min(w, h) * 0.32;
  return `<rect class="f9-ant" x="${cx - w / 2}" y="${cy - h / 2}" width="${w}" height="${h}" rx="${r.toFixed(1)}"/>`
    + `<rect class="blob-ps" x="${cx - w / 2 + inset}" y="${cy - h / 2 + inset}" width="${w - 2 * inset}" height="${h - 2 * inset}" rx="${Math.max(r - inset * 0.6, 6).toFixed(1)}"/>`
    + (label ? text(cx, cy + (cls.includes('lab') ? 9 : 8), label, cls) : '');
}

const b6f = (cx: number, cy: number, rx: number, ry: number, cls = 'lab f9-b'): string =>
  `<ellipse class="blob-b6f" cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}"/>${text(cx, cy + (cls.includes('lab') ? 9 : 8), 'b₆f', cls)}`;

/** ATP synthase: blue stalk through the membrane, purple head on the stroma side. Head top = top − 3.25 r. */
function atps(cx: number, top: number, bot: number, r = 22): string {
  const hy = top - r - 2;
  return `<rect class="blob-stalk" x="${cx - 14}" y="${top - 10}" width="28" height="${bot - top + 26}" rx="10"/>`
    + `<circle class="blob-atp" cx="${(cx - r * 0.75).toFixed(1)}" cy="${hy}" r="${r}"/><circle class="blob-atp" cx="${(cx + r * 0.75).toFixed(1)}" cy="${hy}" r="${r}"/>`
    + `<circle class="blob-atp" cx="${cx}" cy="${(top - r * 2.25).toFixed(1)}" r="${r}"/>`;
}

const num = (x: number, y: number, n: number): string =>
  `<circle class="f9-num" cx="${x}" cy="${y}" r="15"/>${text(x, y + 6.5, `${n}`, 'f9-num-t')}`;

/* ---------- 9A · three flows ---------- */

function threeFlows(): string {
  const p = 'f9a', mt = 250, mb = 330;
  return svg(p, 'Three flows across the thylakoid membrane: light into both photosystems, electrons from water to NADPH, protons into the lumen and back out through ATP synthase', `
    <rect class="f9-lumen" x="0" y="${mb}" width="800" height="${600 - mb}"/>
    ${bilayer(p, 0, 800, mt, mb)}
    ${ps(176, 290, 132, 176, 'PSII')}
    ${b6f(335, 290, 38, 78)}
    ${ps(495, 290, 140, 176, 'PSI')}
    ${atps(640, mt, mb)}
    ${text(664, 392, 'ATP', 'sm', 'start')}${text(664, 418, 'synthase', 'sm', 'start')}

    <path class="bolt" d="M26,22 L42,36 L33,40 L50,56"/>${text(64, 47, 'light', 'sm', 'start')}
    <path class="f9-key-e" d="M150,39 H198"/>${text(210, 47, 'electrons', 'sm', 'start')}
    <path class="f9-key-h" d="M340,39 H388"/>${text(400, 47, 'protons', 'sm', 'start')}

    ${bolt(p, 56, 96, 112, 198)}${bolt(p, 386, 96, 442, 198)}

    ${water(60, 440)}${text(60, 404, 'H₂O', 'sm')}
    ${kp(p, 'M60,462 L60,490')}${molecule(60, 514, 'OO', 12)}${text(60, 556, 'O₂', 'sm')}
    ${ep(p, 'M84,430 C108,418 122,404 128,386')}${eLab(140, 426, 'start')}
    ${ep(p, 'M246,290 L290,290')}
    ${ep(p, 'M366,338 C378,382 396,398 424,398 C440,398 450,396 454,388')}
    ${ep(p, 'M534,198 C548,130 600,66 666,62')}${eLab(560, 112, 'end')}
    ${tag(716, 62, 'NADPH', 'nadph')}${text(716, 100, 'from NADP⁺', 'tiny')}

    ${H(335, 150)}${hp(p, 'M335,168 L335,204')}${hp(p, 'M335,372 L335,420')}
    ${H(112, 474)}
    ${H(250, 470)}${H(300, 512)}${H(372, 462)}${H(420, 516)}${H(486, 466)}${H(530, 520)}
    ${hp(p, 'M200,562 L590,562 C622,562 640,540 640,508 L640,358')}
    ${hp(p, 'M640,176 L640,150')}${H(640, 132)}
    ${tag(738, 196, 'ATP', 'atp')}${text(738, 232, 'from ADP + Pᵢ', 'tiny')}

    ${text(24, 236, 'stroma', 'f9-note', 'start')}${text(790, 588, 'lumen', 'f9-note', 'end')}
  `);
}

/* ---------- 9B · lifts and dam ---------- */

function liftsAndDam(): string {
  const p = 'f9b';
  const shaft = (cx: number, top: number, bot: number): string =>
    `<rect class="f9-shaft" x="${cx - 28}" y="${top}" width="56" height="${bot - top}" rx="14"/>`
    + `<path class="f9-rail" d="M${cx - 16},${top + 8} V${bot - 8} M${cx + 16},${top + 8} V${bot - 8}"/>`
    + `<rect class="f9-car" x="${cx - 22}" y="${top + 6}" width="44" height="38" rx="7"/>${text(cx, top + 33, 'e⁻', 'f9-e-in')}`;
  const paddles = (cx: number, cy: number, r: number): string => Array.from({ length: 8 }, (_, i) => {
    const a = (i * 45 * Math.PI) / 180, x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r;
    return `<rect class="f9-paddle" x="${(x - 6).toFixed(1)}" y="${(y - 6).toFixed(1)}" width="12" height="12" rx="2" transform="rotate(${i * 45} ${x.toFixed(1)} ${y.toFixed(1)})"/>`;
  }).join('');
  const surf = Array.from({ length: 11 }, (_, i) => `T${60 + i * 40},420`).join(' ');
  return svg(p, 'Analogy: two light-powered lifts raise an electron, a downhill chute joins them and pumps protons into a reservoir, and the dammed protons drive a turbine, ATP synthase', `
    <path class="f9-chute" d="M182,128 L452,280"/>
    ${shaft(148, 106, 330)}${shaft(490, 46, 292)}
    ${ep(p, 'M148,318 L148,160')}${ep(p, 'M490,280 L490,100')}
    ${ep(p, 'M188,128 L444,272', true)}
    <ellipse class="blob-pq" cx="250" cy="166" rx="28" ry="17"/>${text(250, 174, 'PQ', 'sm')}
    ${paddles(329, 211, 33)}<circle class="blob-b6f" cx="329" cy="211" r="30"/>${text(329, 219, 'b₆f', 'sm f9-b')}
    <circle class="blob-small" cx="404" cy="252" r="21"/>${text(404, 260, 'PC', 'sm')}
    ${text(300, 136, 'downhill chute', 'f9-it')}
    ${text(110, 140, 'lift 1', 'f9-it', 'end')}${text(110, 168, 'PSII', 'lab f9-b', 'end')}
    ${text(532, 140, 'lift 2', 'f9-it', 'start')}${text(532, 168, 'PSI', 'lab f9-b', 'start')}
    ${bolt(p, 56, 226, 112, 282)}${text(18, 214, 'light', 'f9-note', 'start')}
    ${bolt(p, 604, 206, 530, 280)}${text(606, 200, 'light', 'f9-note', 'start')}
    ${water(80, 318)}${text(52, 292, 'H₂O', 'sm')}${ep(p, 'M100,320 L114,320', true)}
    ${ep(p, 'M524,70 L640,70', true)}${tag(696, 70, 'NADPH', 'nadph')}${text(696, 108, 'from NADP⁺', 'tiny')}

    ${hp(p, 'M329,246 L329,408', true)}${H(329, 300)}${H(329, 356)}${text(312, 334, 'pumps H⁺', 'sm f9-blue', 'end')}
    ${hp(p, 'M72,342 L72,408', true)}${H(72, 372)}
    <path class="f9-res" d="M20,420 L469,420 L463,572 L20,572 Z"/>
    <path class="f9-surf" d="M20,420 Q40,414 60,420 ${surf} L469,420"/>
    <path class="f9-dam" d="M469,396 L503,396 L550,572 L463,572 Z"/>
    ${H(200, 462)}${H(262, 510)}${H(322, 466)}${H(380, 528)}${H(430, 470)}${H(96, 534)}${H(168, 548)}${H(300, 552)}${H(420, 556)}${H(230, 554)}
    <rect class="blob-stalk" x="448" y="520" width="116" height="22" rx="8"/>
    ${hp(p, 'M414,531 L652,531', true)}
    <circle class="blob-atp" cx="580" cy="513" r="19"/><circle class="blob-atp" cx="580" cy="549" r="19"/><circle class="blob-atp" cx="604" cy="531" r="19"/>
    ${H(670, 531)}
    ${tag(642, 470, 'ATP', 'atp')}${text(678, 476, 'from ADP + Pᵢ', 'tiny', 'start')}
    ${text(40, 452, 'reservoir', 'f9-it', 'start')}${text(40, 478, 'lumen', 'sm f9-b', 'start')}
    ${text(486, 352, 'dam', 'f9-it')}${text(486, 380, 'membrane', 'sm f9-b')}
    ${text(680, 400, 'turbine', 'f9-it')}${text(680, 428, 'ATP synthase', 'sm f9-b')}
    ${text(704, 568, 'downstream', 'f9-it')}${text(704, 594, 'stroma', 'sm f9-b')}
  `);
}

/* ---------- 9C · Z-scheme drawn with the complexes ---------- */

function iconZ(): string {
  const p = 'f9c';
  return svg(p, 'Z-scheme on an electron-energy axis with each step drawn as its complex: two light-driven lifts, protons released at cytochrome b6f, NADPH at the end', `
    <path class="f9-axis" d="M40,580 V46" marker-end="url(#${p}-fk)"/>
    <text class="tl" transform="translate(26 320) rotate(-90)" text-anchor="middle">electron energy</text>

    ${water(100, 398)}${text(100, 366, 'H₂O', 'sm')}
    ${kp(p, 'M100,418 L100,470')}${molecule(100, 496, 'OO', 13)}
    ${ep(p, 'M122,404 L150,446', true)}
    ${ps(205, 486, 124, 72, 'PSII', 'sm f9-b', 12)}
    ${ep(p, 'M205,446 L205,150')}${eLab(222, 330, 'start')}
    <rect class="blob-ps" x="160" y="108" width="90" height="38" rx="19"/>${text(205, 135, 'PSII*', 'sm')}
    ${bolt(p, 132, 168, 192, 262)}${text(128, 160, 'light', 'f9-note', 'end')}

    <ellipse class="blob-pq" cx="304" cy="200" rx="34" ry="20"/>${text(304, 208, 'PQ', 'sm')}
    ${b6f(390, 272, 42, 30, 'sm f9-b')}
    <circle class="blob-small" cx="470" cy="340" r="23"/>${text(470, 348, 'PC', 'sm')}
    ${ep(p, 'M252,138 L280,178', true)}${ep(p, 'M330,218 L358,248', true)}${ep(p, 'M420,294 L448,322', true)}${ep(p, 'M490,354 L510,368', true)}

    ${ps(565, 404, 124, 72, 'PSI', 'sm f9-b', 12)}
    ${ep(p, 'M565,364 L565,96')}${eLab(548, 300, 'end')}
    <rect class="blob-ps" x="520" y="52" width="90" height="38" rx="19"/>${text(565, 79, 'PSI*', 'sm')}
    ${bolt(p, 494, 112, 552, 204)}${text(490, 104, 'light', 'f9-note', 'end')}

    <circle class="blob-small" cx="650" cy="140" r="24"/>${text(650, 148, 'Fd', 'sm')}
    <ellipse class="blob-small" cx="706" cy="206" rx="36" ry="22"/>${text(706, 214, 'FNR', 'sm')}
    ${ep(p, 'M612,84 L632,118', true)}${ep(p, 'M668,160 L686,184', true)}${ep(p, 'M712,230 L716,256', true)}
    ${tag(722, 284, 'NADPH', 'nadph')}${text(668, 292, 'NADP⁺ →', 'sm', 'end')}

    ${hp(p, 'M390,304 L390,436', true)}${H(390, 344)}${H(390, 392)}${text(390, 466, 'into lumen', 'sm f9-blue')}
  `);
}

/* ---------- 9D · the thylakoid as one machine ---------- */

function machine(): string {
  const p = 'f9d';
  const [r1, r2, r3] = [160, 315, 470];
  return svg(p, 'The thylakoid as one machine: light twice, water, NADP+ and ADP plus phosphate go in; oxygen, NADPH and ATP come out; inside, three numbered steps', `
    ${text(112, 32, 'in', 'f9-note')}${text(690, 32, 'out', 'f9-note')}${text(400, 32, 'thylakoid', 'f9-note')}
    <rect class="f9-case" x="236" y="60" width="328" height="500" rx="34"/>
    <rect class="f9-case-dots" x="227" y="51" width="346" height="518" rx="42"/>
    <rect class="f9-case-dots" x="245" y="69" width="310" height="482" rx="26"/>
    <path class="f9-row" d="M262,238 H538 M262,392 H538"/>

    ${num(274, 94, 1)}${ps(342, r1, 104, 70, 'PSII', 'sm f9-b', 12)}
    ${text(408, r1 - 4, 'takes e⁻', 'sm', 'start')}${text(408, r1 + 24, 'from water', 'sm', 'start')}

    ${num(274, 262, 2)}${b6f(314, r2, 28, 34, 'sm f9-b')}${ps(410, r2, 80, 70, 'PSI', 'sm f9-b', 11)}
    ${text(462, r2 - 4, 'reduces', 'sm', 'start')}${text(462, r2 + 24, 'NADP⁺', 'sm', 'start')}

    ${num(274, 416, 3)}${atps(360, r3 + 18, r3 + 40, 18)}
    ${text(404, r3 - 4, 'H⁺ flow back,', 'sm', 'start')}${text(404, r3 + 24, 'making ATP', 'sm', 'start')}

    ${ep(p, 'M320,198 L315,272')}${ep(p, `M343,${r2} L362,${r2}`, true)}
    ${hp(p, 'M312,352 L312,500 C312,540 340,552 356,538')}${H(312, 470)}

    ${bolt(p, 156, 70, 218, 150)}${text(150, 82, 'light', 'f9-note', 'end')}
    ${water(140, 196)}${text(102, 203, 'H₂O', 'sm', 'end')}${kp(p, 'M166,196 L216,196')}
    ${bolt(p, 156, 238, 218, 314)}${text(150, 250, 'light', 'f9-note', 'end')}
    ${tag(128, 350, 'NADP⁺', 'nadph')}${kp(p, 'M178,350 L216,350')}
    ${tag(98, r3, 'ADP', 'atp')}${tag(158, r3, '', 'pi')}${kp(p, `M180,${r3} L216,${r3}`)}

    ${kp(p, `M584,${r1} L624,${r1}`)}${molecule(664, r1, 'OO', 14)}${text(706, r1 + 8, 'O₂', 'sm', 'start')}
    ${kp(p, `M584,${r2} L624,${r2}`)}${tag(690, r2, 'NADPH', 'nadph')}
    ${kp(p, `M584,${r3} L624,${r3}`)}${tag(670, r3, 'ATP', 'atp')}
  `);
}

/* ---------- 9E · four-panel strip along one membrane ---------- */

function fourSteps(): string {
  const p = 'f9e', mt = 250, mb = 320;
  const cap = (x0: number, n: number, a: string, b: string): string =>
    `${num(x0 + 100, 490, n)}${text(x0 + 100, 528, a, 'sm')}${text(x0 + 100, 556, b, 'sm')}`;
  return svg(p, 'Four-panel strip along one thylakoid membrane: PSII takes electrons from water, the chain pumps protons, PSI reduces NADP+, protons return through ATP synthase', `
    <rect class="f9-lumen" x="0" y="${mb}" width="800" height="${458 - mb}"/>
    ${bilayer(p, 0, 800, mt, mb)}
    <path class="f9-div" d="M200,14 V566 M400,14 V566 M600,14 V566"/>

    ${ps(100, 285, 124, 150, 'PSII')}
    ${bolt(p, 40, 76, 76, 202)}${text(24, 62, 'light', 'f9-note', 'start')}
    ${water(58, 404)}${ep(p, 'M70,388 L82,366', true)}
    ${kp(p, 'M80,414 L104,424')}${molecule(132, 432, 'OO', 12)}
    ${H(160, 386)}
    ${ep(p, 'M162,285 L210,285')}${text(206, 234, 'stroma', 'f9-note', 'start')}${text(206, 352, 'lumen', 'f9-note', 'start')}

    <ellipse class="blob-pq" cx="236" cy="285" rx="24" ry="15"/>${text(236, 292, 'PQ', 'sm')}
    ${b6f(318, 285, 32, 72, 'sm f9-b')}
    <circle class="blob-small" cx="368" cy="384" r="21"/>${text(368, 392, 'PC', 'sm')}
    ${ep(p, 'M260,285 L280,285', true)}${ep(p, 'M338,342 L350,362', true)}
    ${H(318, 140)}${hp(p, 'M318,158 L318,206')}${hp(p, 'M318,360 L318,410')}${H(318, 428)}${H(266, 410)}

    ${ep(p, 'M389,388 C420,394 436,380 444,364')}
    ${ps(500, 285, 124, 150, 'PSI')}
    ${bolt(p, 588, 76, 550, 202)}${text(590, 62, 'light', 'f9-note', 'end')}
    <circle class="blob-small" cx="466" cy="196" r="19"/>${text(466, 203, 'Fd', 'sm')}
    <ellipse class="blob-small" cx="454" cy="134" rx="30" ry="18"/>${text(454, 141, 'FNR', 'sm')}
    ${ep(p, 'M462,176 L458,156', true)}${ep(p, 'M454,114 L458,92', true)}
    ${tag(470, 72, 'NADPH', 'nadph')}${text(470, 38, 'from NADP⁺', 'tiny')}

    ${atps(700, mt, mb, 24)}
    ${H(640, 396)}${H(672, 436)}${H(756, 404)}
    ${hp(p, 'M700,446 L700,346')}
    ${hp(p, 'M676,178 L652,152', true)}${H(640, 138)}
    ${kp(p, 'M726,176 L736,134')}${tag(744, 112, 'ATP', 'atp')}${text(788, 76, 'from ADP + Pᵢ', 'tiny', 'end')}

    ${cap(0, 1, 'water gives e⁻,', 'O₂ out')}
    ${cap(200, 2, 'e⁻ pass on,', 'H⁺ pumped in')}
    ${cap(400, 3, 'PSI reduces', 'NADP⁺')}
    ${cap(600, 4, 'H⁺ flow back,', 'ATP made')}
    ${text(400, 592, 'All four run at the same time.', 'tiny')}
  `);
}

const DRAW: Record<string, () => string> = { a: threeFlows, b: liftsAndDam, c: iconZ, d: machine, e: fourSteps };

export function draw(id: string): string {
  return (DRAW[id] ?? threeFlows)();
}

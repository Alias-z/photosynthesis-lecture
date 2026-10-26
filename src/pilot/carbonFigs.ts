// Carbon-fixation figures after the FvCB scheme in the lecturer's MSc thesis (Fig. 2b, itself a redraw of
// von Caemmerer 2000, Fig. 2.1): Rubisco's two reactions, PGA reduction, RuBP regeneration, export,
// and where each FvCB limitation acts.
import { illusHeads, molecule, tag } from './illus';
import { arrow, beads, text } from './mechanisms';

const pill = (x: number, y: number, s: string, w: number, cls = 'node'): string =>
  `<rect class="${cls}" x="${x - w / 2}" y="${y - 20}" width="${w}" height="40" rx="20"/>${text(x, y + 8, s, 'sm lab-b')}`;

/** RuBP as the thesis draws it: a pentagon carrying its five carbons. */
function rubp(x: number, y: number, r = 30): string {
  const pts = Array.from({ length: 5 }, (_, k) => {
    const a = -Math.PI / 2 + (k * 2 * Math.PI) / 5;
    return `${(x + r * Math.cos(a)).toFixed(1)},${(y + r * Math.sin(a)).toFixed(1)}`;
  }).join(' ');
  return `<polygon class="node node-rubp" points="${pts}"/>${text(x, y + 2, 'RuBP', 'sm lab-b')}${text(x, y + 20, 'C5', 'tiny')}`;
}

/** A limitation label in the colour of its FvCB term. */
const limit = (x: number, y: number, term: string, lines: string[], cls: 'lim-c' | 'lim-j' | 'lim-p', anchor: 'start' | 'end' = 'start'): string =>
  text(x, y, term, `lab lab-b ${cls}`, anchor) + lines.map((l, i) => text(x, y + 24 * (i + 1), l, 'sm', anchor)).join('');

/* ---------- 1 · the thesis scheme ---------- */

export function fvcbSchemeSvg(): string {
  const p = 'fvs';
  return `<svg class="fig-svg" viewBox="0 0 800 600" role="img" aria-label="FvCB scheme: Rubisco carboxylation and oxygenation, PGA reduction, RuBP regeneration and export, with the three limitations">
    ${illusHeads(p)}
    <rect class="node node-rub" x="340" y="482" width="120" height="44" rx="14"/>${text(400, 511, 'Rubisco', 'lab lab-b')}
    ${rubp(400, 444)}
    ${molecule(296, 566, 'OCO')}${arrow(p, 'ink', 'M316,548 L350,526')}${molecule(504, 566, 'OO')}${arrow(p, 'clay', 'M486,548 L452,526')}
    ${arrow(p, 'ink', 'M376,420 L320,334')}${text(330, 392, 'carboxylation', 'lab lab-b lim-c', 'end')}
    ${arrow(p, 'clay', 'M424,420 L494,334')}${arrow(p, 'clay', 'M432,424 L622,334')}${text(474, 400, 'oxygenation', 'lab lab-b lbl-pr', 'start')}
    ${pill(300, 312, '2 PGA (C3)', 150)}${pill(500, 312, 'PGA (C3)', 116)}${pill(650, 312, 'PGly (C2)', 120, 'node node-pr')}
    ${arrow(p, 'clay', 'M650,290 L650,246')}${pill(650, 224, '0.5 PGA (C3)', 140)}
    ${text(640, 262, '+ 0.5 O₂', 'tiny', 'end')}${text(640, 280, 'ATP, NADPH', 'tiny', 'end')}
    ${arrow(p, 'clay', 'M712,312 L734,312')}${text(766, 292, '0.5 CO₂', 'tiny')}${molecule(766, 316, 'OCO', 8)}
    ${arrow(p, 'clay', 'M580,224 L414,250')}
    ${arrow(p, 'ink', 'M400,292 L400,186', 'boost')}
    ${text(386, 214, 'PGA reduction', 'lab lab-b', 'end')}${tag(282, 248, 'ATP', 'atp')}${tag(352, 248, 'NADPH', 'nadph')}
    ${pill(400, 164, 'triose phosphate (C3)', 236)}
    <path class="ar ar-ink" d="M282,164 C150,164 116,300 146,396 S300,446 364,446" marker-end="url(#${p}-ink)"/>
    ${text(150, 128, '5/6 RuBP regeneration', 'lab lab-b lim-j', 'start')}${tag(98, 232, 'ATP', 'atp')}
    ${arrow(p, 'ink', 'M512,148 L590,110')}${text(548, 176, '1/6 carbon gain', 'lab lab-b lim-p', 'start')}
    ${pill(690, 94, 'sugars (cytosol)', 190, 'node node-out')}${tag(774, 40, '', 'pi')}${arrow(p, 'ink', 'M760,52 L724,74', 'dashed')}
    ${limit(22, 470, 'Aj ~ Jmax', ['RuBP regeneration', 'limited by electron transport'], 'lim-j')}
    ${limit(560, 470, 'Ac ~ Vcmax', ['Rubisco limited', 'by CO₂'], 'lim-c')}
    ${limit(22, 40, 'Ap ~ TPU', ['export limited by', 'triose-phosphate use'], 'lim-p')}
  </svg>`;
}

/* ---------- 2 · limitations mapped onto the cycle, with the response curve they produce ---------- */

export function fvcbMapSvg(): string {
  const p = 'fvm';
  // Illustrative response: Vcmax 60, J 110, TPU 7.5 µmol m⁻² s⁻¹; Rubisco kinetics at 25 °C.
  const vcmax = 60, j = 110, tpu = 7.5, kc = 404.9, ko = 278.4, o = 210, gs = 42.75, rl = 1;
  const ac = (c: number): number => (vcmax * c) / (c + kc * (1 + o / ko)) * (1 - gs / c) - rl;
  const aj = (c: number): number => (j * c) / (4 * (c + 2 * gs)) * (1 - gs / c) - rl;
  const ap = (): number => 3 * tpu - rl;
  const x0 = 500, x1 = 780, y0 = 520, y1 = 300, cmax = 1200, amax = 30;
  const X = (c: number): number => x0 + (c / cmax) * (x1 - x0);
  const Y = (a: number): number => y0 - (Math.max(0, a) / amax) * (y0 - y1);
  const seg = (f: (c: number) => number, from: number, to: number): string => {
    const pts: string[] = [];
    for (let c = from; c <= to; c += 10) pts.push(`${pts.length ? 'L' : 'M'}${X(c).toFixed(1)},${Y(f(c)).toFixed(1)}`);
    return pts.join('');
  };
  let cj = 50; while (ac(cj) < aj(cj)) cj++;
  let cp = cj; while (aj(cp) < ap()) cp++;
  return `<svg class="fig-svg" viewBox="0 0 800 600" role="img" aria-label="Where each FvCB limitation acts in the cycle, and the CO₂ response it produces">
    ${illusHeads(p)}
    <rect class="halo halo-c" x="40" y="420" width="400" height="160" rx="26"/>
    <rect class="halo halo-j" x="40" y="160" width="400" height="244" rx="26"/>
    <rect class="halo halo-p" x="40" y="20" width="400" height="124" rx="26"/>
    ${molecule(78, 520, 'OCO')}${arrow(p, 'ink', 'M100,520 L118,520')}
    <rect class="node node-rub" x="120" y="496" width="120" height="48" rx="14"/>${text(180, 527, 'Rubisco', 'lab lab-b')}
    ${text(426, 466, 'Ac', 'lab lab-b lim-c', 'end')}${text(426, 490, 'Rubisco capacity', 'sm', 'end')}${text(426, 512, '(Vcmax) and CO₂', 'sm', 'end')}
    ${arrow(p, 'ink', 'M180,494 L180,410')}${pill(180, 388, '2 PGA', 110)}
    ${arrow(p, 'ink', 'M180,366 L180,290', 'boost')}${tag(258, 342, 'ATP', 'atp')}${tag(274, 300, 'NADPH', 'nadph')}
    ${pill(180, 268, 'triose-P', 120)}
    <path class="ar ar-ink" d="M120,268 C56,268 56,470 116,512" marker-end="url(#${p}-ink)"/><text class="sm" transform="translate(34 390) rotate(-90)" text-anchor="middle">RuBP regeneration</text>
    ${text(426, 196, 'Aj', 'lab lab-b lim-j', 'end')}${text(426, 220, 'electron transport (J)', 'sm', 'end')}${text(426, 242, 'regenerates RuBP', 'sm', 'end')}
    ${arrow(p, 'ink', 'M180,246 L180,104')}${pill(180, 82, 'sugars', 110, 'node node-out')}${tag(84, 82, '', 'pi')}${arrow(p, 'ink', 'M102,82 L120,82', 'dashed')}
    ${text(426, 54, 'Ap', 'lab lab-b lim-p', 'end')}${text(426, 78, 'triose-phosphate use', 'sm', 'end')}${text(426, 100, '(TPU) frees Pᵢ', 'sm', 'end')}
    <path class="axis" d="M${x0},${y1 - 14} V${y0} H${x1}"/>
    ${text((x0 + x1) / 2, y0 + 30, 'CO₂ in the leaf →', 'tl')}<text class="tl" transform="translate(${x0 - 16} ${(y0 + y1) / 2}) rotate(-90)" text-anchor="middle">net uptake A →</text>
    <path class="curve fv-c" d="${seg(ac, 50, cj)}"/><path class="curve fv-j" d="${seg(aj, cj, cp)}"/><path class="curve fv-p" d="${seg(ap, cp, cmax)}"/>
    ${text(X(140), Y(13), 'Ac', 'lab lab-b lim-c', 'end')}${text(X((cj + cp) / 2), Y(aj((cj + cp) / 2)) - 14, 'Aj', 'lab lab-b lim-j')}${text(X(1000), Y(ap()) - 14, 'Ap', 'lab lab-b lim-p')}
    ${text(x1, 586, 'illustrative curve', 'note', 'end')}
  </svg>`;
}

/* ---------- 3 · bookkeeping per Rubisco reaction ---------- */

export function fvcbBalanceSvg(): string {
  const p = 'fvb';
  const col = (x: number, title: string, cls: string, rows: Array<[string, string]>, total: string, net: string): string =>
    `<rect class="box ${cls}" x="${x}" y="24" width="360" height="430" rx="22"/>${text(x + 180, 64, title, 'lab lab-b')}` +
    rows.map(([a, b], i) => text(x + 24, 196 + i * 64, a, 'sm lab-b', 'start') + text(x + 24, 220 + i * 64, b, 'sm', 'start')).join('') +
    `<path class="rule" d="M${x + 24},392 H${x + 336}"/>${text(x + 24, 426, total, 'sm lab-b', 'start')}${text(x + 336, 426, net, 'sm lab-b lbl-pr', 'end')}`;
  return `<svg class="fig-svg" viewBox="0 0 800 600" role="img" aria-label="ATP, NADPH and carbon per Rubisco carboxylation and per oxygenation, and the FvCB carbon balance">
    ${illusHeads(p)}
    ${col(24, 'One carboxylation', 'box-c', [
      ['reduce 2 PGA', '2 ATP + 2 NADPH'],
      ['regenerate RuBP', '1 ATP'],
      ['carbon', '+1 CO₂ fixed'],
    ], '3 ATP · 2 NADPH', '+1 C')}
    ${beads(100, 112, 5)}${text(160, 120, '+', 'lab')}${molecule(196, 112, 'OCO', 10)}${arrow(p, 'ink', 'M228,112 L256,112')}${beads(292, 100, 3)}${beads(292, 128, 3)}
    ${col(416, 'One oxygenation', 'box-pr', [
      ['salvage PGly → 0.5 PGA', '1 ATP + 0.5 NADPH; 0.5 CO₂ lost'],
      ['reduce 1.5 PGA', '1.5 ATP + 1.5 NADPH'],
      ['regenerate RuBP', '1 ATP'],
    ], '3.5 ATP · 2 NADPH', '−0.5 C')}
    ${beads(490, 112, 5)}${text(550, 120, '+', 'lab')}${molecule(580, 112, 'OO', 10)}${arrow(p, 'clay', 'M604,112 L632,112')}${beads(672, 100, 3)}${beads(672, 128, 2, 'bead bead-pr')}
    <rect class="box" x="24" y="474" width="752" height="110" rx="22"/>
    ${text(400, 516, 'Net uptake  A = Vc − 0.5 Vo − Rʟ', 'lab lab-b')}
    ${text(400, 552, 'ATP = 3 Vc + 3.5 Vo   ·   NADPH = 2 Vc + 2 Vo', 'sm')}
  </svg>`;
}

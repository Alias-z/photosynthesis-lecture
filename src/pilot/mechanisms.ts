// Mechanism figures for the harder pilot slides: electron transport, carbon fixation with
// photorespiration, and the fates of an excited chlorophyll. Drawn on an 800 x 600 grid.

export type Ink = 'ink' | 'clay' | 'proton' | 'red' | 'blue' | 'phos';
export const INKS: Ink[] = ['ink', 'clay', 'proton', 'red', 'blue', 'phos'];

/** Arrowheads in each ink, prefixed so several figures can share one page. */
export const heads = (p: string): string =>
  `<defs>${INKS.map(c => `<marker id="${p}-${c}" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse"><path class="hd hd-${c}" d="M0,0L10,5L0,10z"/></marker>`).join('')}</defs>`;

export const arrow = (p: string, c: Ink, d: string, extra = ''): string =>
  `<path class="ar ar-${c}${extra ? ` ${extra}` : ''}" d="${d}" marker-end="url(#${p}-${c})"/>`;

/** A wave from one point to another: light, or heat when drawn in ink. */
export function wave(x0: number, y0: number, x1: number, y1: number, amp: number, n: number): string {
  const dx = x1 - x0, dy = y1 - y0, len = Math.hypot(dx, dy), nx = -dy / len, ny = dx / len;
  const pts: string[] = [];
  for (let i = 0; i <= 120; i++) {
    const s = i / 120, w = Math.sin(s * Math.PI * 2 * n) * amp * Math.min(1, (1 - s) * 6);
    pts.push(`${i ? 'L' : 'M'}${(x0 + dx * s + nx * w).toFixed(1)},${(y0 + dy * s + ny * w).toFixed(1)}`);
  }
  return pts.join('');
}

export const text = (x: number, y: number, s: string, cls = 'lab', anchor: 'start' | 'middle' | 'end' = 'middle'): string =>
  `<text class="${cls}" x="${x}" y="${y}" text-anchor="${anchor}">${s}</text>`;

export const rcDot = (x: number, y: number): string =>
  `<circle class="rc-ring" cx="${x}" cy="${y}" r="15"/><text class="rc-t" x="${x - 6}" y="${y + 6}" text-anchor="middle">+</text><text class="rc-t" x="${x + 7}" y="${y + 5}" text-anchor="middle">–</text>`;

/* ---------- electron transport in the thylakoid membrane ---------- */

export function etcSvg(): string {
  const p = 'etc';
  return `<svg class="fig-svg" viewBox="0 0 800 600" role="img" aria-label="Linear electron transport from water to NADPH, with proton pumping and ATP synthase">
    ${heads(p)}
    ${text(250, 34, 'stroma', 'note', 'start')}${text(250, 586, 'lumen', 'note', 'start')}
    <rect class="mem" x="14" y="232" width="772" height="96" rx="6"/>
    <path class="mem-line" d="M14,232H786M14,328H786"/>
    <rect class="cplx cplx-ps" x="40" y="180" width="124" height="200" rx="22"/>${text(102, 214, 'PSII', 'lab lab-b')}
    ${rcDot(102, 280)}${text(112, 334, 'P680', 'sm', 'start')}
    <circle class="oec" cx="102" cy="404" r="17"/>${text(102, 446, 'Mn₄CaO₅', 'sm')}
    ${text(102, 484, '2 H₂O → O₂ + 4 H⁺', 'lab')}
    <ellipse class="cplx" cx="206" cy="280" rx="28" ry="17"/>${text(206, 288, 'PQ', 'sm')}
    <rect class="cplx" x="248" y="190" width="104" height="180" rx="18"/>${text(300, 222, 'b₆f', 'lab lab-b')}
    <circle class="cplx" cx="398" cy="398" r="21"/>${text(398, 406, 'PC', 'sm')}
    <rect class="cplx cplx-ps" x="436" y="180" width="124" height="200" rx="22"/>${text(498, 214, 'PSI', 'lab lab-b')}
    ${rcDot(498, 280)}${text(508, 334, 'P700', 'sm', 'start')}
    <circle class="cplx" cx="540" cy="146" r="21"/>${text(540, 154, 'Fd', 'sm')}
    <ellipse class="cplx" cx="584" cy="92" rx="36" ry="21"/>${text(584, 100, 'FNR', 'sm')}
    ${text(584, 46, 'NADP⁺ → NADPH', 'lab')}
    <rect class="cplx" x="696" y="236" width="70" height="88" rx="14"/><rect class="cplx" x="724" y="196" width="14" height="44"/>
    <circle class="cplx" cx="731" cy="166" r="34"/>${text(731, 94, 'ADP + Pᵢ', 'lab')}${text(731, 122, '→ ATP', 'lab')}${text(731, 290, 'ATP', 'sm')}${text(731, 310, 'synthase', 'sm')}
    <path class="light" d="${wave(26, 40, 84, 176, 7, 6)}"/>${arrow(p, 'red', 'M80,166 L86,180')}
    <path class="light" d="${wave(420, 40, 478, 176, 7, 6)}"/>${arrow(p, 'red', 'M474,166 L480,180')}
    ${text(30, 30, 'light', 'note', 'start')}
    ${arrow(p, 'ink', 'M102,386 L102,300')}
    ${arrow(p, 'ink', 'M120,276 L176,278')}
    ${arrow(p, 'ink', 'M234,282 L262,284')}
    ${arrow(p, 'ink', 'M318,330 L384,380')}
    ${arrow(p, 'ink', 'M414,382 L482,296')}
    ${arrow(p, 'ink', 'M506,262 L534,170')}
    ${arrow(p, 'ink', 'M556,130 L568,112')}
    ${text(150, 262, 'e⁻', 'sm')}
    ${arrow(p, 'proton', 'M330,164 L330,420')}${text(342, 160, 'H⁺', 'sm', 'start')}${text(340, 444, '8 H⁺', 'lab', 'start')}
    ${arrow(p, 'proton', 'M731,430 L731,206')}${text(744, 452, '12 H⁺', 'lab', 'start')}
    <g class="budget">
      <rect class="box" x="436" y="478" width="350" height="108" rx="14"/>
      ${text(611, 512, 'Per O₂ released (4 e⁻)', 'lab lab-b')}
      ${text(611, 546, '8 photons → 2 NADPH + ≈2.6 ATP', 'lab')}
      ${text(611, 574, '12 H⁺ in; ATP synthase: 14 H⁺ per 3 ATP', 'sm')}
    </g>
  </svg>`;
}

/* ---------- carbon fixation, regeneration and photorespiration ---------- */

const pill = (x: number, y: number, w: number, main: string, sub: string): string =>
  `<rect class="node" x="${x - w / 2}" y="${y - 30}" width="${w}" height="60" rx="30"/>${text(x, y - 2, main, 'lab lab-b')}${text(x, y + 22, sub, 'sm')}`;

const badge = (x: number, y: number, s: string): string =>
  `<rect class="badge" x="${x - 26}" y="${y - 18}" width="52" height="36" rx="10"/>${text(x, y + 8, s, 'badge-t')}`;

export function carbonSvg(): string {
  const p = 'cbb';
  return `<svg class="fig-svg" viewBox="0 0 800 600" role="img" aria-label="Calvin–Benson–Bassham cycle with RuBisCO carboxylation, reduction, regeneration and the photorespiratory loop">
    ${heads(p)}
    ${pill(170, 310, 170, '3 RuBP', '5 C each')}
    ${pill(570, 310, 170, '6 3-PGA', '3 C each')}
    ${pill(570, 490, 190, '6 triose-P', '3 C each')}
    ${arrow(p, 'ink', 'M258,310 L478,310')}
    ${text(368, 292, 'RuBisCO', 'lab lab-b')}${badge(300, 340, 'Wc')}
    ${arrow(p, 'ink', 'M368,404 L368,318')}${text(368, 430, '3 CO₂', 'lab lab-b')}
    ${arrow(p, 'ink', 'M570,342 L570,456')}
    ${text(592, 392, 'reduction', 'lab lab-b', 'start')}${text(592, 420, '6 ATP · 6 NADPH', 'sm', 'start')}
    ${arrow(p, 'ink', 'M668,490 L780,490')}${text(724, 470, '1 out', 'lab lab-b')}${text(724, 524, 'sugars', 'sm')}
    ${arrow(p, 'ink', 'M474,490 L196,490 Q170,490 170,464 L170,344')}
    ${text(330, 526, 'regeneration · 5 triose-P + 3 ATP', 'sm')}${badge(170, 410, 'Wj')}
    ${arrow(p, 'clay', 'M170,278 L170,196')}
    ${arrow(p, 'ink', 'M52,236 L162,236')}${text(40, 243, 'O₂', 'lab lab-b', 'end')}
    ${text(182, 262, 'RuBisCO', 'sm', 'start')}
    <rect class="node node-pr" x="102" y="134" width="136" height="54" rx="27"/>${text(170, 168, '2-PG (2 C)', 'lab lab-b')}
    ${arrow(p, 'clay', 'M238,160 L548,160 Q570,160 570,182 L570,276')}
    ${text(394, 144, 'photorespiration', 'lab lab-b lbl-pr')}
    ${text(410, 196, 'chloroplast · peroxisome · mitochondrion', 'sm')}
    ${arrow(p, 'ink', 'M470,158 L470,86')}${text(470, 72, 'CO₂ lost', 'lab lab-b')}
    ${text(250, 92, '4 C in → 3 C back + 1 CO₂', 'sm')}
    ${text(400, 588, 'FvCB: the rate is set by the slower of RuBisCO (Wc) and RuBP regeneration (Wj)', 'sm')}
  </svg>`;
}

/* ---------- fates of an excited chlorophyll (Jablonski diagram) ---------- */

export function fatesSvg(): string {
  const p = 'jab';
  return `<svg class="fig-svg" viewBox="0 0 800 600" role="img" aria-label="Energy levels of chlorophyll: absorption, internal conversion, photochemistry, heat, fluorescence, triplet formation, phosphorescence and singlet oxygen">
    ${heads(p)}
    ${arrow(p, 'ink', 'M40,540 L40,90', 'axis-ar')}<text class="tl" transform="translate(28 320) rotate(-90)" text-anchor="middle">energy</text>
    <path class="lvl" d="M80,520 H700"/><path class="lvl-sub" d="M80,506 H470M80,494 H470"/>${text(72, 527, 'S₀', 'lab lab-b', 'end')}
    <path class="lvl" d="M80,270 H470"/><path class="lvl-sub" d="M80,256 H470M80,244 H470"/>${text(72, 277, 'S₁', 'lab lab-b', 'end')}
    <path class="lvl" d="M80,110 H250"/>${text(72, 117, 'S₂', 'lab lab-b', 'end')}
    <path class="lvl" d="M520,360 H660"/>${text(590, 346, 'T₁ triplet', 'lab lab-b')}
    ${arrow(p, 'blue', 'M110,518 L110,114')}${text(110, 556, 'blue', 'sm')}
    ${arrow(p, 'red', 'M160,518 L160,274')}${text(160, 556, 'red', 'sm')}
    <path class="heat" d="${wave(222, 114, 222, 262, 6, 5)}"/>${arrow(p, 'ink', 'M222,256 L222,268')}
    ${text(234, 182, 'heat', 'sm', 'start')}${text(234, 206, '< 1 ps', 'sm', 'start')}
    ${arrow(p, 'red', 'M330,274 L330,516', 'fluor')}${text(322, 390, 'fluorescence', 'sm', 'end')}${text(322, 414, '≈ 685 nm · ns', 'sm', 'end')}
    <path class="heat" d="${wave(400, 274, 400, 508, 6, 7)}"/>${arrow(p, 'ink', 'M400,506 L400,516')}
    ${text(412, 390, 'heat', 'sm', 'start')}${text(412, 414, '(NPQ)', 'sm', 'start')}
    ${arrow(p, 'ink', 'M470,262 L594,170')}
    <rect class="box" x="600" y="120" width="190" height="78" rx="14"/>${text(695, 152, 'reaction centre', 'lab lab-b')}${text(695, 180, 'charge separation', 'sm')}
    ${text(500, 196, 'photochemistry', 'sm', 'end')}${text(500, 220, '< 100 ps', 'sm', 'end')}
    ${arrow(p, 'ink', 'M470,276 L522,354', 'dashed')}${text(512, 306, 'spin flip', 'sm', 'start')}
    ${arrow(p, 'phos', 'M590,364 L590,516')}${text(580, 452, 'phosphorescence', 'sm', 'end')}${text(580, 476, '(very weak)', 'sm', 'end')}
    ${arrow(p, 'clay', 'M660,360 L700,360')}
    <rect class="ros" x="704" y="330" width="86" height="60" rx="14"/>${text(747, 368, '¹O₂', 'lab lab-b')}
    ${text(747, 414, 'singlet', 'sm')}${text(747, 438, 'oxygen', 'sm')}
    ${text(690, 268, 'carotenoids quench', 'sm')}${text(690, 292, '³Chl and ¹O₂', 'sm')}
  </svg>`;
}

/* ---------- electron transport, variant: Z-scheme ---------- */

export const chip = (x: number, y: number, s: string, cls = 'node', w = 88): string =>
  `<rect class="${cls}" x="${x - w / 2}" y="${y - 20}" width="${w}" height="40" rx="20"/>${text(x, y + 8, s, 'sm')}`;

export function zSchemeSvg(): string {
  const p = 'zs';
  const N: Record<string, [number, number]> = {
    h2o: [90, 500], p680: [180, 450], p680x: [180, 150], pheo: [262, 206], pq: [336, 272], b6f: [410, 338], pc: [480, 392],
    p700: [550, 440], p700x: [550, 80], fd: [630, 166], fnr: [702, 226], nadph: [722, 300],
  };
  const step = (a: string, b: string): string => {
    const [x0, y0] = N[a], [x1, y1] = N[b], dx = x1 - x0, dy = y1 - y0, l = Math.hypot(dx, dy);
    return arrow(p, 'ink', `M${(x0 + (dx / l) * 30).toFixed(1)},${(y0 + (dy / l) * 22).toFixed(1)} L${(x1 - (dx / l) * 34).toFixed(1)},${(y1 - (dy / l) * 24).toFixed(1)}`);
  };
  return `<svg class="fig-svg" viewBox="0 0 800 600" role="img" aria-label="Z-scheme of linear electron transport">
    ${heads(p)}
    ${arrow(p, 'ink', 'M34,560 L34,60', 'axis-ar')}<text class="tl" transform="translate(22 320) rotate(-90)" text-anchor="middle">electron energy (more reducing ↑)</text>
    ${step('h2o', 'p680')}
    ${arrow(p, 'red', 'M180,428 L180,174', 'boost')}<path class="light" d="${wave(96, 360, 166, 330, 6, 5)}"/>${text(92, 350, 'light', 'note', 'end')}
    ${step('p680x', 'pheo')}${step('pheo', 'pq')}${step('pq', 'b6f')}${step('b6f', 'pc')}${step('pc', 'p700')}
    ${arrow(p, 'red', 'M550,418 L550,104', 'boost')}<path class="light" d="${wave(466, 290, 536, 260, 6, 5)}"/>${text(462, 282, 'light', 'note', 'end')}
    ${step('p700x', 'fd')}${step('fd', 'fnr')}
    ${arrow(p, 'ink', 'M712,246 L718,276')}
    ${chip(...N.h2o, 'H₂O')}${chip(...N.p680, 'P680', 'node node-ps')}${chip(...N.p680x, 'P680*', 'node node-ps')}
    ${chip(...N.pheo, 'Pheo')}${chip(...N.pq, 'PQ')}${chip(...N.b6f, 'b₆f')}${chip(...N.pc, 'PC')}
    ${chip(...N.p700, 'P700', 'node node-ps')}${chip(...N.p700x, 'P700*', 'node node-ps')}
    ${chip(...N.fd, 'Fd')}${chip(...N.fnr, 'FNR')}${chip(...N.nadph, 'NADPH', 'node node-out', 96)}
    ${text(90, 548, 'O₂ + H⁺', 'sm')}
    ${text(206, 316, 'PSII', 'lab lab-b', 'start')}${text(576, 266, 'PSI', 'lab lab-b', 'start')}
    ${text(462, 330, 'H⁺ → lumen', 'sm', 'start')}
    ${text(400, 586, 'Two light-driven boosts lift each electron from water to NADP⁺', 'sm')}
  </svg>`;
}

/* ---------- electron transport, variant: what four electrons buy ---------- */

export function etcBudgetSvg(): string {
  const p = 'bud';
  const box = (x: number, y: number, w: number, main: string, sub: string, cls = 'node'): string =>
    `<rect class="${cls}" x="${x}" y="${y - 34}" width="${w}" height="68" rx="16"/>${text(x + w / 2, y - 4, main, 'lab lab-b')}${text(x + w / 2, y + 22, sub, 'sm')}`;
  return `<svg class="fig-svg" viewBox="0 0 800 600" role="img" aria-label="Ideal budget of linear electron transport per O₂ released">
    ${heads(p)}
    ${text(30, 54, 'light', 'note', 'start')}${text(30, 254, 'electrons', 'note', 'start')}${text(30, 454, 'protons', 'note', 'start')}
    ${box(30, 110, 150, '8 photons', 'absorbed', 'node node-light')}
    ${arrow(p, 'red', 'M182,98 L272,72')}${arrow(p, 'red', 'M182,122 L272,148')}
    ${box(276, 72, 130, 'PSII', '4 photons', 'node node-ps')}${box(276, 150, 130, 'PSI', '4 photons', 'node node-ps')}
    ${box(30, 300, 150, '2 H₂O', 'source')}
    ${arrow(p, 'ink', 'M182,300 L272,300')}${box(276, 300, 130, '4 e⁻', 'via PSII → PSI')}
    ${arrow(p, 'ink', 'M408,300 L556,300')}${box(560, 300, 210, '2 NADPH', 'reducing power', 'node node-out')}
    ${arrow(p, 'ink', 'M106,336 L106,368')}${text(106, 396, 'O₂ released', 'sm lab-b')}
    ${arrow(p, 'proton', 'M340,336 L340,462')}
    ${box(276, 500, 130, '12 H⁺', '4 + 8 (b₆f)', 'node node-h')}
    ${arrow(p, 'proton', 'M408,500 L556,500')}${text(418, 484, 'ATP synthase', 'sm', 'start')}
    ${box(560, 500, 210, '≈ 2.6 ATP', '14 H⁺ per 3 ATP', 'node node-out')}
    ${arrow(p, 'red', 'M340,186 L340,262')}${text(352, 232, 'light drives', 'sm', 'start')}
    ${text(665, 392, 'ATP : NADPH ≈ 1.3', 'lab lab-b')}${text(665, 418, 'the Calvin cycle needs 1.5', 'sm')}
  </svg>`;
}

/* ---------- excited chlorophyll, variant: competing exits ---------- */

export function fatesForkSvg(): string {
  const p = 'fork';
  const cx = 250, cy = 300;
  const exit = (y: number, c: Ink, title: string, sub: string, cls = 'box', heat = false): string =>
    (heat ? `<path class="heat" d="${wave(cx + 70, cy + (y - cy) * 0.18, 486, y, 6, 6)}"/>${arrow(p, 'ink', `M480,${y - 2} L494,${y}`)}`
      : arrow(p, c, `M${cx + 70},${(cy + (y - cy) * 0.18).toFixed(1)} L494,${y}`)) +
    `<rect class="${cls}" x="500" y="${y - 40}" width="286" height="80" rx="16"/>${text(643, y - 6, title, 'lab lab-b')}${text(643, y + 22, sub, 'sm')}`;
  return `<svg class="fig-svg" viewBox="0 0 800 600" role="img" aria-label="Four competing fates of an excited chlorophyll">
    ${heads(p)}
    <path class="light" d="${wave(30, 230, 170, 282, 7, 6)}"/>${arrow(p, 'red', 'M164,280 L178,286')}
    <path class="light light-blue" d="${wave(30, 380, 170, 318, 7, 9)}"/>${arrow(p, 'blue', 'M164,321 L178,315')}
    ${text(40, 214, 'red photon', 'sm', 'start')}${text(40, 412, 'blue photon', 'sm', 'start')}${text(40, 436, '(extra energy → heat, < 1 ps)', 'sm', 'start')}
    <circle class="node node-ps" cx="${cx}" cy="${cy}" r="72"/>${text(cx, cy - 6, 'excited', 'lab lab-b')}${text(cx, cy + 22, 'Chl (S₁)', 'lab lab-b')}
    ${text(cx, cy + 104, 'lasts only ns', 'sm')}
    ${exit(90, 'ink', 'photochemistry', 'charge separation, < 100 ps')}
    ${exit(230, 'ink', 'heat', 'incl. regulated NPQ', 'box', true)}
    ${exit(370, 'red', 'fluorescence', 'red light ≈ 685 nm')}
    ${exit(510, 'clay', 'triplet ³Chl', '+ O₂ → singlet oxygen', 'ros')}
    ${text(643, 586, 'carotenoids quench ³Chl and ¹O₂', 'sm')}
  </svg>`;
}

/* ---------- excited chlorophyll, variant: timescales ---------- */

export function fatesTimelineSvg(): string {
  const x0 = 60, x1 = 760, lo = -15, hi = -3, ay = 300;
  const X = (e: number): number => x0 + ((e - lo) / (hi - lo)) * (x1 - x0);
  const decades = Array.from({ length: hi - lo + 1 }, (_, i) => lo + i);
  const named: Record<number, string> = { [-15]: 'fs', [-12]: 'ps', [-9]: 'ns', [-6]: 'µs', [-3]: 'ms' };
  /** A labelled event; tier ±1 sits near the axis, ±2 further out, so neighbours never collide. */
  const pin = (e: number, tier: -2 | -1 | 1 | 2, title: string, sub: string, cls = 'box'): string => {
    const x = Math.max(96, X(e)), y = ay + tier * 102, h = 70;
    return `<path class="pin" d="M${X(e).toFixed(1)},${ay} L${X(e).toFixed(1)},${tier < 0 ? y + h / 2 : y - h / 2}"/><circle class="dot dot-a" cx="${X(e).toFixed(1)}" cy="${ay}" r="6"/>` +
      `<rect class="${cls}" x="${(x - 92).toFixed(1)}" y="${y - h / 2}" width="184" height="${h}" rx="14"/>${text(x, y - 6, title, 'sm lab-b')}${text(x, y + 20, sub, 'sm')}`;
  };
  return `<svg class="fig-svg" viewBox="0 0 800 600" role="img" aria-label="Timescales of the fates of absorbed light, from femtoseconds to milliseconds">
    <rect class="gap-band" x="${X(-12)}" y="${ay - 34}" width="${X(-8.3) - X(-12)}" height="68"/>
    ${text((X(-12) + X(-8.3)) / 2 + 30, ay - 46, 'competition for S₁', 'note')}
    <path class="axis" d="M${x0},${ay} H${x1}"/>
    ${decades.map(e => `<line class="tick" x1="${X(e).toFixed(1)}" y1="${ay - (named[e] ? 10 : 5)}" x2="${X(e).toFixed(1)}" y2="${ay + (named[e] ? 10 : 5)}"/>`).join('')}
    ${decades.filter(e => named[e]).map(e => text(X(e), ay + 36, named[e], 'tl')).join('')}
    ${pin(-14.6, -2, 'absorption', 'photon taken up')}
    ${pin(-11.8, -1, 'energy hops', 'pigment to pigment')}
    ${pin(-8.7, -2, 'fluorescence', 'S₁ lifetime: ns')}
    ${pin(-13, 1, 'blue → red level', 'extra energy as heat')}
    ${pin(-10.6, 2, 'charge separation', 'reaction centre, < 100 ps')}
    ${pin(-5.5, 1, 'triplet ³Chl', 'long-lived → ¹O₂', 'ros')}
    ${text(410, 586, 'logarithmic time: each tick is ten times longer than the last', 'sm')}
  </svg>`;
}

/* ---------- carbon, variant: counting carbons around the cycle ---------- */

export const beads = (x: number, y: number, n: number, cls = 'bead'): string =>
  Array.from({ length: n }, (_, i) => `<circle class="${cls}" cx="${(x + (i - (n - 1) / 2) * 20).toFixed(1)}" cy="${y}" r="8"/>`).join('');

export function cbbWheelSvg(): string {
  const p = 'whl';
  const cx = 300, cy = 330, R = 168;
  const at = (deg: number, r = R): [number, number] => [cx + r * Math.cos((deg * Math.PI) / 180), cy + r * Math.sin((deg * Math.PI) / 180)];
  const arc = (a: number, b: number, c: Ink = 'ink'): string => {
    const [xa, ya] = at(a), [xb, yb] = at(b);
    return arrow(p, c, `M${xa.toFixed(1)},${ya.toFixed(1)} A${R},${R} 0 0 1 ${xb.toFixed(1)},${yb.toFixed(1)}`);
  };
  const mol = (deg: number, n: number, name: string): string => {
    const [x, y] = at(deg);
    return `<rect class="node" x="${(x - 70).toFixed(1)}" y="${(y - 34).toFixed(1)}" width="140" height="68" rx="20"/>${beads(x, y - 10, n)}${text(x, y + 24, name, 'sm lab-b')}`;
  };
  const [lx1, ly1] = at(245, 222), [lx2, ly2] = at(0, 214), [lx3, ly3] = at(118, 220);
  return `<svg class="fig-svg" viewBox="0 0 800 600" role="img" aria-label="Calvin–Benson cycle drawn with carbon atoms as beads, with the photorespiration carbon balance">
    ${heads(p)}
    ${arc(204, 288)}${arc(328, 32)}${arc(72, 156)}
    ${mol(180, 5, 'RuBP ×3')}${mol(308, 3, '3-PGA ×6')}${mol(52, 3, 'triose-P ×6')}
    ${text(lx1, ly1 - 8, '① carboxylation', 'lab lab-b')}${text(lx1, ly1 + 20, 'RuBisCO', 'sm')}
    ${text(lx2, ly2 - 8, '② reduction', 'lab lab-b', 'start')}${text(lx2, ly2 + 20, '6 ATP · 6 NADPH', 'sm', 'start')}
    ${text(lx3, ly3 - 8, '③ regeneration', 'lab lab-b')}${text(lx3, ly3 + 20, '3 ATP', 'sm')}
    ${beads(262, 250, 3, 'bead bead-co2')}${text(262, 228, '3 CO₂ in', 'sm lab-b')}${arrow(p, 'ink', 'M262,262 L262,300')}
    ${arrow(p, 'ink', 'M462,498 L530,540')}${beads(590, 552, 3)}${text(590, 584, '1 triose-P out → sugar', 'sm lab-b')}
    ${text(300, 382, 'RuBP 15 C + CO₂ 3 C', 'sm')}${text(300, 406, '= 18 C = 6 × 3-PGA', 'sm')}
    <rect class="box box-pr" x="560" y="40" width="226" height="250" rx="18"/>
    ${text(673, 76, 'If RuBisCO adds O₂', 'lab lab-b lbl-pr')}
    ${beads(673, 112, 5)}${text(673, 140, 'RuBP + O₂', 'sm')}
    ${arrow(p, 'clay', 'M673,150 L673,170')}
    ${beads(623, 192, 3)}${beads(733, 192, 2, 'bead bead-pr')}${text(623, 220, '3-PGA', 'sm')}${text(733, 220, '2-PG', 'sm')}
    ${text(673, 254, '2 × 2-PG: 3 C back,', 'sm')}${text(673, 278, '1 C lost as CO₂', 'sm')}
  </svg>`;
}

/* ---------- carbon, variant: the FvCB response to CO₂ ---------- */

export function fvcbSvg(): string {
  // Illustrative values: Vcmax 60 and J 110 µmol m⁻² s⁻¹; RuBisCO kinetics at 25 °C.
  const vcmax = 60, j = 110, kc = 404.9, ko = 278.4, o = 210, gs = 42.75, rl = 1;
  const wc = (c: number): number => (vcmax * c) / (c + kc * (1 + o / ko));
  const wj = (c: number): number => (j * c) / (4 * (c + 2 * gs));
  const net = (w: number, c: number): number => w * (1 - gs / c) - rl;
  const x0 = 120, x1 = 740, y0 = 470, y1 = 70, cmax = 1000, amin = -5, amax = 30;
  const X = (c: number): number => x0 + (c / cmax) * (x1 - x0);
  const Y = (a: number): number => y0 - ((a - amin) / (amax - amin)) * (y0 - y1);
  const path = (f: (c: number) => number, from: number, to: number): string => {
    const pts: string[] = [];
    for (let c = from; c <= to; c += 5) pts.push(`${pts.length ? 'L' : 'M'}${X(c).toFixed(1)},${Y(Math.max(amin, f(c))).toFixed(1)}`);
    return pts.join('');
  };
  let ct = 50;
  while (wc(ct) < wj(ct) && ct < cmax) ct += 1;
  const at = net(wc(ct), ct);
  const ticksX = [0, 200, 400, 600, 800, 1000].map(c => `<line class="tick" x1="${X(c)}" y1="${y0}" x2="${X(c)}" y2="${y0 + 8}"/>${text(X(c), y0 + 34, `${c}`, 'tl')}`).join('');
  const ticksY = [0, 10, 20, 30].map(a => `<line class="tick" x1="${x0 - 8}" y1="${Y(a)}" x2="${x0}" y2="${Y(a)}"/>${text(x0 - 14, Y(a) + 8, `${a}`, 'tl', 'end')}`).join('');
  return `<svg class="fig-svg" viewBox="0 0 800 600" role="img" aria-label="FvCB model: net CO₂ assimilation against chloroplast CO₂, limited by RuBisCO at low CO₂ and by RuBP regeneration at high CO₂">
    <path class="axis" d="M${x0},${y1 - 10} V${y0} H${x1}"/>${ticksX}${ticksY}
    <path class="zero" d="M${x0},${Y(0)} H${x1}"/>
    ${text((x0 + x1) / 2, y0 + 74, 'CO₂ at RuBisCO, Cc (µmol mol⁻¹)', 'tl')}
    <text class="tl" transform="translate(48 ${(y0 + y1) / 2}) rotate(-90)" text-anchor="middle">net CO₂ uptake, A (µmol m⁻² s⁻¹)</text>
    <path class="curve fv-c fv-ghost" d="${path(c => net(wc(c), c), ct, cmax)}"/>
    <path class="curve fv-j fv-ghost" d="${path(c => net(wj(c), c), 45, ct)}"/>
    <path class="curve fv-c" d="${path(c => net(wc(c), c), 45, ct)}"/>
    <path class="curve fv-j" d="${path(c => net(wj(c), c), ct, cmax)}"/>
    <circle class="dot dot-a" cx="${X(ct).toFixed(1)}" cy="${Y(at).toFixed(1)}" r="7"/>
    ${text(X(60), Y(26), 'RuBisCO-limited', 'lab lab-b lbl-c', 'start')}${text(X(60), Y(26) + 28, 'Wc: RuBisCO capacity', 'sm', 'start')}
    ${text(X(1000), Y(15), 'RuBP-regeneration-limited', 'lab lab-b lbl-j', 'end')}${text(X(1000), Y(15) + 28, 'Wj: ATP and NADPH supply', 'sm', 'end')}
    ${text(x0, y1 - 34, 'A = min(Wc, Wj) × (1 − Γ*/Cc) − Rʟ', 'sm', 'start')}
    ${text(x1, y0 - 16, 'illustrative: Vcmax 60, J 110, 25 °C', 'note', 'end')}
  </svg>`;
}

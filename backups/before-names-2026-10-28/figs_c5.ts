// Slide C5 figure concepts. What each must show is in research/figure-briefs/FIGURE_BRIEF.md.
// Vocabulary: carbon = dark bead, CO₂ and O₂ = atom balls, RuBP = pentagon, ATP/NADPH = tags, Pᵢ = orange ball,
// RuBisCO = warm grey block, photorespiration = clay and dashed. FvCB limits: Ac (RuBisCO, teal),
// Aj (electron transport, blue), Ap (triose-phosphate use, purple).
import './c5.css';
import { illusHeads, molecule, tag } from '../illus';
import { arrow, text } from '../mechanisms';
import { gasAr } from './l2-glyphs';

export const VARIANTS = [
  { id: 'a', name: 'FvCB scheme' },
  { id: 'b', name: 'Carbon wheel' },
  { id: 'c', name: 'Two doors' },
  { id: 'd', name: 'Bottlenecks' },
  { id: 'e', name: 'Assembly line' },
];

export function draw(id: string): string {
  const f = { a: schemeSvg, b: wheelSvg, c: doorsSvg, d: valvesSvg, e: lineSvg }[id] ?? schemeSvg;
  return f();
}

/* ---------- shared parts ---------- */

type Lim = 'c' | 'j' | 'p';
const n1 = (v: number): string => v.toFixed(1);
const svg = (label: string, body: string): string =>
  `<svg class="fig-svg fc5" viewBox="0 0 800 600" role="img" aria-label="${label}">${body}</svg>`;

/** Carbon skeleton: n beads on a bond. */
function chain(x: number, y: number, n: number, cls = 'bead', r = 8, gap = 20): string {
  const x0 = x - ((n - 1) * gap) / 2;
  const bond = n > 1 ? `<path class="fc5-bond${cls.includes('bead-pr') ? ' fc5-bond-pr' : ''}" d="M${n1(x0)},${y} H${n1(x0 + (n - 1) * gap)}"/>` : '';
  return bond + Array.from({ length: n }, (_, i) => `<circle class="${cls}" cx="${n1(x0 + i * gap)}" cy="${y}" r="${r}"/>`).join('');
}

/** RuBP as the thesis draws it: a pentagon. */
function pent(x: number, y: number, r: number, label = 'RuBP', cls = 'sm lab-b'): string {
  const pts = Array.from({ length: 5 }, (_, k) => {
    const a = -Math.PI / 2 + (k * 2 * Math.PI) / 5;
    return `${n1(x + r * Math.cos(a))},${n1(y + r * Math.sin(a))}`;
  }).join(' ');
  return `<polygon class="node node-rubp" points="${pts}"/>${label ? text(x, y + 8, label, cls) : ''}`;
}

const pill = (x: number, y: number, w: number, body: string, cls = 'node', h = 44): string =>
  `<rect class="${cls}" x="${x - w / 2}" y="${y - h / 2}" width="${w}" height="${h}" rx="${h / 2}"/>${body}`;

/** A curly brace from y0 to y1 at x; its tip points left (dir -1) or right (dir 1). */
function brace(x: number, y0: number, y1: number, dir: 1 | -1, l: Lim): string {
  const w = 12 * dir, m = (y0 + y1) / 2;
  return `<path class="fc5-br fc5-br-${l}" d="M${x},${y0} q${w},0 ${w},12 V${m - 12} q0,12 ${w},12 q${-w},0 ${-w},12 V${y1 - 12} q0,12 ${-w},12"/>`;
}

/* ---------- C5A · the thesis scheme (MSc thesis Fig. 2b), redrawn ---------- */

function schemeSvg(): string {
  const p = 'fc5a';
  const lim = (x: number, y: number, head: string, lines: string[], l: Lim, anchor: 'start' | 'end'): string =>
    text(x, y, head, `lab lab-b fc5-${l}`, anchor) + lines.map((s, i) => text(x, y + 28 * (i + 1), s, 'sm', anchor)).join('');
  return svg('FvCB scheme after the MSc thesis: RuBisCO carboxylation and oxygenation, PGA reduction, RuBP regeneration and export, with the three limitations',
    `${illusHeads(p)}
    ${brace(186, 170, 440, -1, 'j')}${lim(158, 280, 'Aj ~ J', ['electron', 'transport'], 'j', 'end')}
    ${brace(186, 462, 592, -1, 'c')}${lim(158, 506, 'Ac ~ Vcmax', ['RuBisCO', 'capacity'], 'c', 'end')}
    ${brace(628, 24, 116, 1, 'p')}${lim(652, 62, 'Ap ~ TPU', ['triose-P use'], 'p', 'start')}

    <rect class="node node-rub" x="336" y="494" width="128" height="44" rx="14"/>${text(400, 523, 'RuBisCO', 'sm lab-b')}
    ${pent(400, 454, 38)}
    ${molecule(294, 574, 'OCO', 12)}${gasAr(p, 'M322,560 L344,542')}
    ${molecule(506, 574, 'OO', 12)}${gasAr(p, 'M482,560 L458,542')}

    ${arrow(p, 'ink', 'M400,414 L400,362')}${text(388, 396, 'carboxylation', 'sm', 'end')}
    ${pill(400, 338, 104, text(400, 346, 'PGA', 'sm lab-b'))}
    ${arrow(p, 'ink', 'M400,316 L400,182', 'boost')}
    ${text(416, 216, 'reduction', 'sm', 'start')}${tag(448, 254, 'ATP', 'atp')}${tag(540, 254, 'NADPH', 'nadph')}
    ${pill(400, 158, 150, text(400, 166, 'triose-P', 'sm lab-b'))}

    <path class="ar ar-ink" d="M325,158 C224,158 204,318 226,384 S320,470 366,462" marker-end="url(#${p}-ink)"/>
    ${text(272, 112, 'regeneration', 'sm')}${text(272, 140, '5 of 6', 'sm lab-b')}${tag(262, 300, 'ATP', 'atp')}

    ${arrow(p, 'ink', 'M446,136 L500,96')}${text(494, 138, '1 of 6', 'sm lab-b', 'start')}
    ${pill(558, 74, 116, text(558, 82, 'sugar', 'sm lab-b'))}
    ${tag(452, 48, '', 'pi')}${arrow(p, 'ink', 'M446,66 L420,130', 'dashed')}

    ${arrow(p, 'clay', 'M436,440 L508,416', 'dashed')}${text(480, 472, 'oxygenation', 'sm fc5-pr', 'start')}
    ${pill(594, 410, 168, `<text class="sm lab-b" x="594" y="418" text-anchor="middle">PGA + <tspan class="fc5-pr-t">2-PG</tspan></text>`)}
    ${arrow(p, 'clay', 'M548,388 C540,366 488,366 458,354', 'dashed')}
    ${arrow(p, 'clay', 'M640,388 L640,334', 'dashed')}
    ${pill(664, 310, 210, text(664, 318, 'photorespiration', 'sm fc5-pr'), 'node node-pr')}
    ${arrow(p, 'clay', 'M558,304 L460,328', 'dashed')}${text(552, 298, '3 of 4 C back', 'sm', 'end')}
    ${gasAr(p, 'M706,288 L720,236', 'dashed')}${molecule(726, 218, 'OCO', 10)}${text(690, 224, '1 of 4 C lost', 'sm', 'end')}`);
}

/* ---------- C5B · three-station wheel with carbon counted as beads ---------- */

function wheelSvg(): string {
  const p = 'fc5b';
  const cx = 350, cy = 300, R = 172;
  const at = (deg: number, r = R): [number, number] => [cx + r * Math.cos((deg * Math.PI) / 180), cy + r * Math.sin((deg * Math.PI) / 180)];
  const arc = (a: number, b: number): string => {
    const [xa, ya] = at(a), [xb, yb] = at(b);
    return arrow(p, 'ink', `M${n1(xa)},${n1(ya)} A${R},${R} 0 0 1 ${n1(xb)},${n1(yb)}`);
  };
  // n-carbon chains in a 2-column grid (3 C) or a single column (5 C); slot `gone` is drawn as an empty dashed slot.
  const slot = (x: number, y: number, n: number, i: number): [number, number] =>
    n === 3 ? [x + (i % 2 ? 34 : -34), y + Math.floor(i / 2) * 26] : [x, y + i * 26];
  const grid = (x: number, y: number, n: number, k: number, gone = -1): string =>
    Array.from({ length: k }, (_, i) => {
      const [sx, sy] = slot(x, y, n, i);
      return i === gone ? `<rect class="fc5-gone" x="${n1(sx - 31)}" y="${n1(sy - 11)}" width="62" height="22" rx="11"/>` : chain(sx, sy, n, 'bead', 7, 19);
    }).join('');
  const [px, py] = at(240), [tx, ty] = at(0), [rx, ry] = at(120);
  const [rbx, rby] = at(180), [rdx, rdy] = at(300), [rgx, rgy] = at(60);
  const [gx, gy] = slot(tx, ty - 30, 3, 3);
  return svg('Calvin–Benson cycle as a wheel of three stations, with carbon atoms counted as beads: 3 CO₂ in, 1 triose phosphate out',
    `${illusHeads(p)}
    <circle class="fc5-track" cx="${cx}" cy="${cy}" r="${R}"/>
    ${arc(196, 220)}${arc(260, 280)}${arc(320, 340)}${arc(20, 40)}${arc(80, 100)}${arc(140, 164)}

    <rect class="node" x="${px - 76}" y="${py - 54}" width="152" height="118" rx="20"/>${grid(px, py - 30, 3, 6)}${text(px, py + 52, '6 PGA', 'sm lab-b')}
    <rect class="node" x="${tx - 76}" y="${ty - 54}" width="152" height="118" rx="20"/>${grid(tx, ty - 30, 3, 6, 3)}${text(tx, ty + 52, '6 triose-P', 'sm lab-b')}
    <rect class="node" x="${rx - 64}" y="${ry - 54}" width="128" height="118" rx="20"/>${grid(rx, ry - 30, 5, 3)}${text(rx, ry + 52, '3 RuBP', 'sm lab-b')}

    <rect class="node node-rub" x="${rbx - 62}" y="${rby - 24}" width="124" height="48" rx="14"/>${text(rbx, rby + 8, 'RuBisCO', 'sm lab-b')}
    <rect class="node" x="${rdx - 66}" y="${rdy - 24}" width="132" height="48" rx="24"/>${text(rdx, rdy + 8, 'reduction', 'sm lab-b')}
    <rect class="node" x="${rgx - 78}" y="${rgy - 24}" width="156" height="48" rx="24"/>${text(rgx, rgy + 8, 'regeneration', 'sm lab-b')}

    ${tag(rdx + 128, rdy - 24, 'ATP', 'atp')}${tag(rdx + 140, rdy + 24, 'NADPH', 'nadph')}${arrow(p, 'ink', `M${rdx + 94},${rdy - 22} L${rdx + 72},${rdy - 12}`)}${arrow(p, 'ink', `M${rdx + 94},${rdy + 22} L${rdx + 72},${rdy + 12}`)}
    ${tag(rgx + 138, rgy, 'ATP', 'atp')}${arrow(p, 'ink', `M${rgx + 104},${rgy} L${rgx + 84},${rgy}`)}

    ${[['15', -58], ['+', -28], ['3', 0], ['=', 28], ['18', 58]].map(([s, dx]) => text(cx + +dx, cy - 14, `${s}`, 'lab lab-b')).join('')}
    ${text(cx - 58, cy + 8, 'RuBP', 'tiny')}${text(cx, cy + 8, 'CO₂', 'tiny')}${text(cx + 58, cy + 8, 'PGA', 'tiny')}
    ${text(cx, cy + 46, '= 6 × 3', 'lab lab-b')}${text(cx, cy + 72, 'carbon atoms', 'tiny')}

    ${text(62, 216, '3 CO₂ in', 'lab lab-b')}
    ${molecule(62, 256, 'OCO', 11)}${molecule(62, 300, 'OCO', 11)}${molecule(62, 344, 'OCO', 11)}
    ${arrow(p, 'ink', `M96,300 L${rbx - 66},300`)}
    ${arrow(p, 'ink', `M${n1(gx + 34)},${n1(gy)} L${tx + 136},${n1(gy)}`)}
    <rect class="node node-out" x="${tx + 144}" y="${n1(gy - 22)}" width="84" height="44" rx="16"/>${chain(tx + 186, gy, 3, 'bead', 7, 19)}
    ${text(tx + 186, gy - 40, '1 out', 'lab lab-b')}${text(tx + 186, gy + 50, 'triose-P', 'sm')}${text(tx + 186, gy + 76, 'to sugars', 'sm')}
    ${text(786, 586, 'per 3 CO₂: 9 ATP + 6 NADPH', 'sm', 'end')}`);
}

/* ---------- C5C · RuBisCO's two doors ---------- */

function doorsSvg(): string {
  const p = 'fc5c';
  const door = (cx: number, w: number, yT: number, yB: number): string => {
    const r = w / 2, x0 = cx - r, x1 = cx + r;
    return `<path class="fc5-door" d="M${x0},${yB} V${yT + r} A${r},${r} 0 0 1 ${x1},${yT + r} V${yB} Z"/>`;
  };
  const L = 200, Rx = 590;
  return svg('RuBisCO has two doors: CO₂ gives two PGA and gains a carbon; O₂ gives PGA and 2-phosphoglycolate, and photorespiration loses one carbon in four',
    `${illusHeads(p)}
    <rect class="node node-rub" x="100" y="14" width="600" height="196" rx="30"/>${text(400, 54, 'RuBisCO', 'lab lab-b')}
    ${pent(400, 136, 40)}
    ${door(L, 124, 62, 210)}${door(Rx, 124, 62, 210)}
    ${molecule(L, 140, 'OCO', 15)}${text(L, 190, 'CO₂', 'lab lab-b')}
    ${molecule(Rx, 140, 'OO', 15)}${text(Rx, 190, 'O₂', 'lab lab-b')}

    ${arrow(p, 'ink', `M${L},216 L${L},266`)}${text(L + 16, 250, 'carboxylation', 'sm lab-b', 'start')}
    ${arrow(p, 'clay', `M${Rx},216 L${Rx},266`, 'dashed')}${text(Rx - 16, 250, 'oxygenation', 'sm lab-b fc5-pr', 'end')}

    ${chain(L - 42, 296, 3)}${chain(L + 42, 296, 3)}${text(L, 334, '2 PGA', 'sm lab-b')}
    ${chain(Rx - 50, 296, 3)}${chain(Rx + 50, 296, 2, 'bead bead-pr')}${text(Rx - 50, 334, 'PGA', 'sm lab-b')}${text(Rx + 50, 334, '2-PG', 'sm lab-b fc5-pr')}

    ${arrow(p, 'clay', `M${Rx + 50},344 L${Rx + 50},364`, 'dashed')}
    ${text(Rx + 50, 390, 'photorespiration', 'sm fc5-pr')}
    ${chain(458, 418, 2, 'bead bead-pr')}${chain(508, 418, 2, 'bead bead-pr')}${arrow(p, 'clay', 'M540,418 L570,418')}
    ${chain(620, 418, 3)}${text(668, 426, '+', 'lab')}${molecule(718, 418, 'OCO', 10)}
    ${text(483, 448, '2 × 2-PG', 'tiny')}${text(620, 448, '3 C back', 'tiny')}${text(718, 448, '1 C lost', 'tiny')}

    <path class="rule" d="M40,470 H760"/>
    ${text(L, 500, 'per carboxylation', 'tiny')}${text(Rx, 500, 'per oxygenation', 'tiny')}
    ${text(L, 538, '+1 C', 'pl')}${text(Rx, 538, '−0.5 C', 'pl fc5-pr')}
    ${tag(L - 62, 576, '3 ATP', 'atp')}${tag(L + 50, 576, '2 NADPH', 'nadph')}
    ${tag(Rx - 62, 576, '3.5 ATP', 'atp')}${tag(Rx + 62, 576, '2 NADPH', 'nadph')}`);
}

/* ---------- C5D · three valves in series, and the CO₂ response they produce ---------- */

function valvesSvg(): string {
  const p = 'fc5d';
  // Illustrative FvCB response: Vcmax 60, J 110, TPU 8 µmol m⁻² s⁻¹, RuBisCO kinetics at 25 °C (the constants of
  // fvcbMapSvg, with TPU 8 instead of 7.5 so that each limitation spans a readable stretch of the axis).
  const vcmax = 60, j = 110, tpu = 8, kc = 404.9, ko = 278.4, o = 210, gs = 42.75, rl = 1;
  const ac = (c: number): number => (vcmax * c) / (c + kc * (1 + o / ko)) * (1 - gs / c) - rl;
  const aj = (c: number): number => (j * c) / (4 * (c + 2 * gs)) * (1 - gs / c) - rl;
  const ap = (): number => 3 * tpu - rl;
  const x0 = 96, x1 = 772, y0 = 532, yt = 262, cmin = 60, cmax = 1500, amax = 30;
  const X = (c: number): number => x0 + (c / cmax) * (x1 - x0);
  const Y = (a: number): number => y0 - (Math.max(0, a) / amax) * (y0 - yt);
  const seg = (fn: (c: number) => number, from: number, to: number): string => {
    const pts: string[] = [];
    for (let c = from; c <= to + 0.01; c = c >= to ? to + 1 : Math.min(to, c + 10)) {
      if (fn(c) > amax) break;
      pts.push(`${pts.length ? 'L' : 'M'}${n1(X(c))},${n1(Y(fn(c)))}`);
    }
    return pts.join('');
  };
  let cj = cmin; while (ac(cj) < aj(cj)) cj++;
  let cp = cj; while (aj(cp) < ap()) cp++;
  const bands: Array<[number, number, Lim]> = [[x0, X(cj), 'c'], [X(cj), X(cp), 'j'], [X(cp), x1, 'p']];
  const mid = (a: number, b: number): number => (a + b) / 2;
  const vx = bands.map(([a, b]) => mid(a, b));
  const vy = 164;
  const valve = (x: number, l: Lim, name: string, param: string): string =>
    `<path class="fc5-stem" d="M${n1(x)},${vy - 15} V${vy - 40} M${n1(x - 16)},${vy - 40} H${n1(x + 16)}"/>
     <path class="fc5-valve fc5-valve-${l}" d="M${n1(x - 22)},${vy - 20} L${n1(x)},${vy} L${n1(x - 22)},${vy + 20} Z M${n1(x + 22)},${vy - 20} L${n1(x)},${vy} L${n1(x + 22)},${vy + 20} Z"/>
     ${text(x, 64, name, 'sm lab-b')}${text(x, 96, param, `lab lab-b fc5-${l}`)}`;
  return svg('A pipeline with three valves — RuBisCO, RuBP regeneration and export — above an illustrative CO₂ response curve coloured by the valve that limits it',
    `${illusHeads(p)}
    ${bands.map(([a, b, l]) => `<rect class="fc5-band fc5-band-${l}" x="${n1(a + 3)}" y="34" width="${n1(b - a - 6)}" height="${n1(y0 - 34)}" rx="16"/>`).join('')}
    <rect class="fc5-pipe" x="44" y="${vy - 17}" width="722" height="34" rx="17"/>
    ${molecule(30, vy, 'OCO', 10)}${arrow(p, 'ink', `M766,${vy} L794,${vy}`)}
    ${text(mid(vx[0], vx[1]), vy + 7, 'PGA', 'sm fc5-flow')}${text(mid(vx[1], vx[2]), vy + 7, 'triose-P', 'sm fc5-flow')}${text(mid(vx[2] + 22, 766), vy + 7, 'sugars', 'sm fc5-flow')}
    ${valve(vx[0], 'c', 'RuBisCO', 'Vcmax')}${valve(vx[1], 'j', 'regeneration', 'J')}${valve(vx[2], 'p', 'export', 'TPU')}
    <path class="axis" d="M${x0},${yt - 6} V${y0} H${x1}"/>
    <path class="curve fc5-ghost fc5-cv-c" d="${seg(ac, cj, cmax)}"/>
    <path class="curve fc5-ghost fc5-cv-j" d="${seg(aj, cmin + 20, cj)}${seg(aj, cp, cmax)}"/>
    <path class="curve fc5-ghost fc5-cv-p" d="M${n1(x0 + 4)},${n1(Y(ap()))} H${n1(X(cp))}"/>
    <path class="curve fc5-cv-c" d="${seg(ac, cmin, cj)}"/><path class="curve fc5-cv-j" d="${seg(aj, cj, cp)}"/><path class="curve fc5-cv-p" d="${seg(ap, cp, cmax)}"/>
    ${text(X(330), Y(ac(330)) + 54, 'Ac', 'lab lab-b fc5-c')}
    ${text(mid(X(cj), X(cp)), Y(aj(mid(cj, cp))) + 48, 'Aj', 'lab lab-b fc5-j')}
    ${text(mid(X(cp), x1), Y(ap()) + 48, 'Ap', 'lab lab-b fc5-p')}
    ${text(mid(x0, x1), 566, 'CO₂ in the leaf, Ci →', 'tl')}<text class="tl" transform="translate(${x0 - 20} ${(y0 + yt) / 2}) rotate(-90)" text-anchor="middle">net uptake A →</text>
    ${text(x1, 594, 'illustrative FvCB curve', 'fc5-note', 'end')}`);
}

/* ---------- C5E · assembly line ---------- */

function lineSvg(): string {
  const p = 'fc5e';
  /** A conveyor from x0 to x1 with end pulleys and chevrons pointing in the direction of travel. */
  const belt = (x0: number, x1: number, y: number, dir: 1 | -1): string => {
    const ch = Array.from({ length: Math.floor((x1 - x0 - 60) / 52) }, (_, i) => {
      const x = x0 + 46 + i * 52;
      return `<path class="fc5-chev" d="M${x - 4 * dir},${y - 6} L${x + 4 * dir},${y} L${x - 4 * dir},${y + 6}"/>`;
    }).join('');
    return `<rect class="fc5-belt" x="${x0}" y="${y - 12}" width="${x1 - x0}" height="24" rx="12"/>${ch}` +
      `<circle class="fc5-roller" cx="${x0 + 12}" cy="${y}" r="8"/><circle class="fc5-roller" cx="${x1 - 12}" cy="${y}" r="8"/>`;
  };
  const box = (x: number, y: number, cls = 'fc5-box'): string =>
    `<rect class="${cls}" x="${x - 25}" y="${y - 12}" width="50" height="24" rx="6"/>${chain(x, y, 3, 'bead', 5.5, 13.5)}`;
  /** Boxes stacked on a belt whose top is at `top`; `out` marks the top box as the one that leaves. */
  const stack = (x: number, top: number, n: number, out = false): string =>
    Array.from({ length: n }, (_, i) => box(x, top - 13 - i * 26, out && i === n - 1 ? 'fc5-box fc5-box-out' : 'fc5-box')).join('');
  const machine = (x0: number, x1: number, y0: number, y1: number, label: string, cls = 'node'): string =>
    `<rect class="${cls}" x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}" rx="14"/>${text((x0 + x1) / 2, y0 + 36, label, 'sm lab-b')}`;
  return svg('Calvin–Benson cycle as an assembly line: 3 CO₂ in, RuBisCO and reduction stations, 1 of 6 triose phosphates leaves as sugar, 5 return underneath to rebuild RuBP',
    `${illusHeads(p)}
    ${belt(90, 690, 250, 1)}${belt(100, 720, 470, -1)}

    ${text(135, 36, '3 CO₂ in', 'lab lab-b')}
    ${molecule(66, 78, 'OCO', 10)}${molecule(135, 78, 'OCO', 10)}${molecule(204, 78, 'OCO', 10)}
    <path class="fc5-hopper" d="M100,104 H170 L150,138 H120 Z"/>
    ${machine(80, 190, 140, 274, 'RuBisCO', 'node node-rub')}
    ${stack(232, 238, 2)}${stack(286, 238, 2)}${stack(340, 238, 2)}${text(286, 166, '6 PGA', 'sm lab-b')}

    ${tag(416, 96, 'ATP', 'atp')}${tag(506, 96, 'NADPH', 'nadph')}${arrow(p, 'ink', 'M416,114 L432,138')}${arrow(p, 'ink', 'M506,114 L490,138')}
    ${machine(392, 522, 140, 274, 'reduction')}
    ${stack(562, 238, 2)}${stack(616, 238, 2)}${stack(670, 238, 2, true)}${text(616, 166, '6 triose-P', 'sm lab-b')}

    ${arrow(p, 'ink', 'M696,212 L730,212')}${box(760, 212, 'fc5-box fc5-box-out')}
    ${text(760, 176, '1 out', 'lab lab-b')}${text(760, 246, 'to sugars', 'tiny')}
    ${arrow(p, 'ink', 'M706,266 C730,290 736,320 736,350 L736,436')}${text(750, 380, '5', 'lab lab-b', 'start')}

    ${stack(590, 458, 2)}${stack(644, 458, 2)}${stack(698, 458, 1)}${text(644, 394, '5 triose-P', 'sm lab-b')}
    ${machine(366, 526, 362, 494, 'regeneration')}
    ${tag(446, 552, 'ATP', 'atp')}${arrow(p, 'ink', 'M446,534 L446,500')}
    ${pent(170, 434, 26, '')}${pent(242, 434, 26, '')}${pent(314, 434, 26, '')}${text(242, 386, '3 RuBP', 'sm lab-b')}
    ${arrow(p, 'ink', 'M110,470 C52,470 40,450 40,410 L40,250 C40,224 52,214 76,214')}

    ${text(24, 590, 'per 3 CO₂: 9 ATP + 6 NADPH', 'sm', 'start')}`);
}

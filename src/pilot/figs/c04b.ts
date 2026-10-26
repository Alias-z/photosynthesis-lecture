// Slide C04b · Sucrose by day, starch for the night. Draft context checked in research/review-2026-10-23-claude/:
// REVIEW_SUMMARY.md §5(b) and essential 1, D_C01-C06.md gap 1 (Flügge 1999; Niittylä 2004; Graf 2010;
// Smith & Zeeman 2020; Chen 2012; Braun 2022; Knoblauch 2016). No numbers are used except carbon counts.
// Deliberately not drawn: leaf starch turning into grain starch (grain starch is rebuilt from sucrose; C13).
// Vocabulary: triose-P = three carbon beads with an orange phosphate, Pᵢ = orange ball, sucrose = hexagon + pentagon,
// maltose = two hexagons, starch = ringed granule, TPT = purple (as TPU / Ap elsewhere), day = solid ink and a sun,
// night = indigo dashes and a moon.
import { molecule, tag } from '../illus';
import { text as t } from '../mechanisms';
import type { PlateText, Variant } from '../types';
import './c04b.css';

export const PLATE: PlateText = {
  n: 'C4b',
  title: 'Sucrose by day, starch for the night',
  status: 'draft',
  lead: 'By day, triose phosphate becomes sucrose for the plant and starch to last the night.',
  points: [
    { claim: 'Triose-P leaves in exchange for Pᵢ.', text: 'Making sucrose frees that phosphate; if it lags, ATP synthesis slows: the triose-phosphate use (TPU) limit.' },
    { claim: 'Starch is the night-time store.', text: 'Built in the stroma by day, it is broken down at night at a rate that lasts until dawn.' },
    { claim: 'Sucrose travels in the phloem.', text: 'SWEET transporters release it, sucrose transporters (SUTs) load it, and pressure flow carries it to growing organs.' },
  ],
  refs: [
    { label: 'Flügge 1999', url: 'https://doi.org/10.1146/annurev.arplant.50.1.27' },
    { label: 'Niittylä et al. 2004', url: 'https://doi.org/10.1126/science.1091811' },
    { label: 'Graf et al. 2010', url: 'https://doi.org/10.1073/pnas.0914299107' },
    { label: 'Braun 2022', url: 'https://doi.org/10.1146/annurev-arplant-070721-083240' },
  ],
};

export const VARIANTS: Variant[] = [
  { id: 'a', name: 'Two routes' },
  { id: 'b', name: 'Swap counter' },
  { id: 'c', name: 'Starch clock', anim: true },
  { id: 'd', name: 'Leaf to sink' },
  { id: 'e', name: 'Sucrose lags' },
  { id: 'f', name: 'Six steps' },
  { id: 'g', name: 'Day and night', anim: true },
  { id: 'h', name: 'Early night' },
  { id: 'i', name: 'Equation unpacked' },
  { id: 'j', name: 'Three icons' },
];

export function draw(id: string): string {
  switch (id) {
    case 'b': return swapSvg();
    case 'c': return clockSvg();
    case 'd': return sinkSvg();
    case 'e': return lagSvg();
    case 'f': return stepsSvg();
    case 'g': return dayNightSvg();
    case 'h': return earlySvg();
    case 'i': return equationSvg();
    case 'j': return iconsSvg();
    default: return routesSvg();
  }
}

/* ---------- shared parts ---------- */

type K = 'ink' | 'night' | 'pi' | 'sug' | 'grey' | 'tpu';
const KS: K[] = ['ink', 'night', 'pi', 'sug', 'grey', 'tpu'];
type Anchor = 'start' | 'middle' | 'end';
const f1 = (v: number): string => v.toFixed(1);

const defs = (p: string): string =>
  `<defs>${KS.map(k => `<marker id="${p}-${k}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path class="fc04b-hd-${k}" d="M0,0L10,5L0,10z"/></marker>`).join('')}</defs>`;

const ar = (p: string, k: K, d: string, cls = ''): string =>
  `<path class="fc04b-ar fc04b-k-${k}${cls ? ` ${cls}` : ''}" d="${d}" marker-end="url(#${p}-${k})"/>`;

const svg = (p: string, label: string, body: string): string =>
  `<svg class="fig-svg fc04b" viewBox="0 0 800 600" role="img" aria-label="${label}">${defs(p)}${body}</svg>`;

/** Lines of text under one another. */
const lines = (x: number, y: number, ss: string[], cls = 'sm', anchor: Anchor = 'start', dy = 28): string =>
  ss.map((s, i) => t(x, y + i * dy, s, cls, anchor)).join('');

const num = (x: number, y: number, n: string): string =>
  `<circle class="num" cx="${x}" cy="${y}" r="15"/>${t(x, y + 6, n, 'num-t')}`;

function ngon(x: number, y: number, r: number, n: number, rot: number): string {
  return Array.from({ length: n }, (_, k) => {
    const a = ((rot + (k * 360) / n) * Math.PI) / 180;
    return `${f1(x + r * Math.cos(a))},${f1(y + r * Math.sin(a))}`;
  }).join(' ');
}

/** Sucrose: a glucose hexagon joined to a fructose pentagon. */
function sucrose(x: number, y: number, s = 1): string {
  const d = 19 * s;
  return `<path class="fc04b-ring-link" d="M${f1(x - d + 14 * s)},${y} H${f1(x + d - 13 * s)}"/>` +
    `<polygon class="fc04b-ring" points="${ngon(x - d, y, 14 * s, 6, 0)}"/><polygon class="fc04b-ring-f" points="${ngon(x + d, y, 13 * s, 5, 180)}"/>`;
}

/** Maltose: two glucose hexagons. */
function maltose(x: number, y: number, s = 1): string {
  const d = 18 * s;
  return `<path class="fc04b-ring-link" d="M${f1(x - d + 14 * s)},${y} H${f1(x + d - 14 * s)}"/>` +
    `<polygon class="fc04b-ring" points="${ngon(x - d, y, 14 * s, 6, 0)}"/><polygon class="fc04b-ring" points="${ngon(x + d, y, 14 * s, 6, 0)}"/>`;
}

/** A starch chain: n glucose hexagons in a row, then an ellipsis. */
function glucans(x: number, y: number, n: number, s = 1): string {
  const g = 34 * s, x0 = x - ((n - 1) * g) / 2;
  const link = `<path class="fc04b-ring-link" d="M${f1(x0)},${y} H${f1(x0 + (n - 1) * g + 26 * s)}"/>`;
  return link + Array.from({ length: n }, (_, i) => `<polygon class="fc04b-ring" points="${ngon(x0 + i * g, y, 14 * s, 6, 0)}"/>`).join('') +
    t(x0 + (n - 1) * g + 40 * s, y + 7, '…', 'sm fc04b-b', 'middle');
}

/** Triose phosphate: three carbon beads and an orange phosphate. */
function triose(x: number, y: number, s = 1): string {
  const g = 15 * s, r = 6.5 * s, x0 = x - 24 * s, px = x + 24 * s;
  return `<path class="fc04b-bond" d="M${f1(x0)},${y} H${f1(px)}"/>` +
    [0, 1, 2].map(i => `<circle class="bead" cx="${f1(x0 + i * g)}" cy="${y}" r="${f1(r)}"/>`).join('') +
    `<circle class="fc04b-p" cx="${f1(px)}" cy="${y}" r="${f1(10 * s)}"/>${s >= 0.8 ? t(px, y + 5, 'P', 'fc04b-pt') : ''}`;
}

const pi = (x: number, y: number): string => tag(x, y, '', 'pi');

/** A starch granule with growth rings; `ghost` draws its daytime size as a dashed outline. */
function granule(x: number, y: number, rx: number, ry: number, ghost?: [number, number]): string {
  return (ghost ? `<ellipse class="fc04b-st-ghost" cx="${x}" cy="${y}" rx="${ghost[0]}" ry="${ghost[1]}"/>` : '') +
    `<ellipse class="fc04b-st" cx="${x}" cy="${y}" rx="${rx}" ry="${ry}"/>` +
    `<ellipse class="fc04b-st-ring" cx="${x}" cy="${y}" rx="${f1(rx * 0.68)}" ry="${f1(ry * 0.68)}"/>` +
    `<ellipse class="fc04b-st-ring" cx="${x}" cy="${y}" rx="${f1(rx * 0.36)}" ry="${f1(ry * 0.36)}"/>` +
    `<circle class="fc04b-hil" cx="${x}" cy="${y}" r="2.5"/>`;
}

/** A membrane transporter, centred on the membrane it sits in. */
const tp = (x: number, y: number, cls: string, h = 50, w = 24): string =>
  `<rect class="${cls}" x="${x - w / 2}" y="${y - h / 2}" width="${w}" height="${h}" rx="${w / 2}"/>` +
  `<path class="fc04b-ring-link" d="M${x},${y - h / 2 + 9} V${y + h / 2 - 9}"/>`;

/** A chloroplast as a rounded box with a double envelope. */
const cp = (x: number, y: number, w: number, h: number, r: number): string =>
  `<rect class="fc04b-cp" x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}"/><rect class="fc04b-cp-in" x="${x + 6}" y="${y + 6}" width="${w - 12}" height="${h - 12}" rx="${r - 6}"/>`;

/** A granum: a stack of thylakoid discs. */
const granum = (x: number, y: number, n = 4): string =>
  Array.from({ length: n }, (_, i) => `<rect class="fc04b-gr" x="${x - 17}" y="${y - (n * 8) / 2 + i * 8}" width="34" height="6.5" rx="3"/>`).join('');

/** The Calvin–Benson cycle as a circular arrow; `off` draws it dashed and grey. */
function cycle(p: string, x: number, y: number, r: number, off = false): string {
  if (off) return `<circle class="fc04b-cyc-off" cx="${x}" cy="${y}" r="${r}"/>`;
  const a0 = (-60 * Math.PI) / 180, a1 = (250 * Math.PI) / 180;
  return `<path class="fc04b-cyc" d="M${f1(x + r * Math.cos(a0))},${f1(y + r * Math.sin(a0))} A${r},${r} 0 1 1 ${f1(x + r * Math.cos(a1))},${f1(y + r * Math.sin(a1))}" marker-end="url(#${p}-grey)"/>`;
}

const rubp = (x: number, y: number, r = 25): string =>
  `<polygon class="fc04b-rubp" points="${ngon(x, y, r, 5, -90)}"/>${t(x, y + 7, 'RuBP', 'fc04b-rubp')}`;

function sun(x: number, y: number, r = 13): string {
  const rays = Array.from({ length: 8 }, (_, k) => {
    const a = (k * Math.PI) / 4, c = Math.cos(a), s = Math.sin(a);
    return `M${f1(x + c * (r + 4))},${f1(y + s * (r + 4))} L${f1(x + c * (r + 10))},${f1(y + s * (r + 10))}`;
  }).join('');
  return `<path class="fc04b-ray" d="${rays}"/><circle class="fc04b-sun" cx="${x}" cy="${y}" r="${r}"/>`;
}

const moon = (x: number, y: number, r = 14): string =>
  `<path class="fc04b-moon" d="M${x},${y - r} A${r},${r} 0 1 0 ${x},${y + r} A${f1(r * 0.42)},${r} 0 1 1 ${x},${y - r} Z"/>`;

/** A reaction arrow from x0 to x1 at height y with light written over it (textbook notation, as on slide 1), dimmed. */
const rxLight = (x0: number, x1: number, y: number): string =>
  `<path class="fc04b-rx" d="M${x0},${y} H${x1 - 5}"/><path class="fc04b-rxh" d="M${x1},${y} L${x1 - 9},${y - 4.5} L${x1 - 9},${y + 4.5} Z"/>` +
  t((x0 + x1) / 2, y - 10, 'light', 'fc04b-rxl');

/** A sieve tube standing upright, with sieve plates. */
function tubeV(x0: number, y0: number, x1: number, y1: number, plates: number[]): string {
  return `<rect class="fc04b-tube" x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}" rx="10"/>` +
    plates.map(y => `<path class="fc04b-plate" d="M${x0 + 3},${y} H${x1 - 3}"/>`).join('');
}

/** ATP synthase in the shared vocabulary: purple head on a blue stalk. */
const atpSynthase = (x: number, y: number): string =>
  `<rect class="fc04b-atp-s" x="${x - 9}" y="${y}" width="18" height="48" rx="6"/>` +
  `<circle class="fc04b-atp-h" cx="${x - 12}" cy="${y - 4}" r="13"/><circle class="fc04b-atp-h" cx="${x + 12}" cy="${y - 4}" r="13"/><circle class="fc04b-atp-h" cx="${x}" cy="${y - 22}" r="13"/>`;

/** A crate for the analogy: full = triose-P (carbon beads in a phosphate crate), empty = Pᵢ. */
function crate(x: number, y: number, full: boolean): string {
  const body = `<rect class="${full ? 'fc04b-crate' : 'fc04b-crate-e'}" x="${x - 27}" y="${y - 17}" width="54" height="34" rx="6"/>`;
  if (!full) return body;
  return body + [-13, 0, 13].map(dx => `<circle class="bead" cx="${x + dx}" cy="${y}" r="5.5"/>`).join('');
}

/* ---------- a · Two routes: the textbook cell ---------- */

function routesSvg(): string {
  const p = 'fc04ba';
  return svg(p, 'A leaf cell: by day triose phosphate leaves the chloroplast through the TPT in exchange for Pᵢ and becomes sucrose, and starch is stored; by night starch leaves as maltose and also becomes sucrose; sucrose enters the phloem through SWEET and SUT',
    `<rect class="fc04b-cell" x="14" y="62" width="612" height="484" rx="30"/>
    ${t(24, 46, 'leaf cell', 'sm fc04b-grey', 'start')}${t(480, 112, 'cytosol', 'sm fc04b-b')}
    ${cp(40, 90, 300, 430, 70)}${t(190, 130, 'chloroplast', 'sm fc04b-b')}

    ${molecule(86, 176, 'OCO', 10)}${ar(p, 'ink', 'M102,190 L132,214')}
    ${cycle(p, 180, 246, 54)}${lines(180, 242, ['Calvin–', 'Benson'], 'sm', 'middle', 24)}
    ${ar(p, 'ink', 'M236,246 L322,246')}${triose(278, 222)}${t(278, 196, 'triose-P', 'sm fc04b-b')}${sun(266, 284, 10)}
    ${tp(340, 246, 'fc04b-tpt', 60, 26)}${t(354, 306, 'TPT', 'sm fc04b-b fc04b-tpu', 'start')}
    ${ar(p, 'ink', 'M356,246 L456,246')}
    ${ar(p, 'pi', 'M482,226 C466,160 368,160 350,212')}${pi(417, 175)}
    ${sucrose(500, 246, 1.1)}${t(566, 212, 'sucrose', 'sm fc04b-b')}

    ${ar(p, 'ink', 'M540,246 L608,246')}${tp(626, 246, 'fc04b-sweet', 50, 24)}${t(626, 306, 'SWEET', 'sm fc04b-b')}
    ${ar(p, 'ink', 'M640,246 L676,246')}
    ${tubeV(692, 72, 760, 520, [150, 330, 440])}${tp(692, 246, 'fc04b-sut', 50, 24)}${t(728, 214, 'SUT', 'sm fc04b-b')}
    ${t(726, 56, 'phloem', 'sm fc04b-b')}${ar(p, 'sug', 'M730,280 L730,500')}
    ${t(726, 556, 'to growing', 'sm fc04b-brown')}${t(726, 582, 'organs', 'sm fc04b-brown')}

    ${ar(p, 'ink', 'M180,302 L180,372')}${sun(148, 336, 10)}
    ${granule(180, 420, 64, 40)}${t(180, 494, 'starch', 'sm fc04b-b')}
    ${ar(p, 'night', 'M246,430 L322,452')}${tp(340, 452, 'fc04b-mex', 46, 24)}
    ${maltose(286, 404, 0.85)}${t(286, 374, 'maltose', 'sm fc04b-b fc04b-night')}
    ${ar(p, 'night', 'M356,452 C470,452 500,404 500,272')}${moon(420, 480, 13)}

    ${sun(54, 578, 10)}${t(82, 586, 'by day', 'sm', 'start')}${moon(196, 578, 12)}${t(214, 586, 'by night', 'sm fc04b-night', 'start')}${t(340, 584, 'TPT: triose-P/Pᵢ translocator', 'tiny', 'start')}`);
}

/* ---------- b · Swap counter: the analogy, mapped label by label ---------- */

function swapSvg(): string {
  const p = 'fc04bb';
  const title = (x: number, a: string, real: string): string => t(x, 54, a, 'lab fc04b-b') + t(x, 84, real, 'sm fc04b-map');
  return svg(p, 'Analogy: a depot (chloroplast) hands out a full crate (triose phosphate) at a swap counter (TPT) only when an empty crate (Pᵢ) comes back from the shop (cytosol), where unpacking (sucrose synthesis) frees the crates',
    `${title(161, 'depot', '= chloroplast')}${title(580, 'shop', '= cytosol')}
    <rect class="fc04b-cp" x="16" y="104" width="290" height="200" rx="18"/>
    <rect class="fc04b-cell" x="334" y="104" width="450" height="200" rx="18"/>
    <rect class="fc04b-wall" x="306" y="104" width="28" height="42"/><rect class="fc04b-wall" x="306" y="262" width="28" height="42"/>

    ${crate(128, 160, true)}${crate(194, 160, true)}${crate(128, 202, true)}${crate(194, 202, true)}
    ${t(161, 252, 'full crate', 'sm fc04b-b')}${t(161, 280, '= triose-P', 'sm fc04b-map')}

    ${ar(p, 'ink', 'M232,180 L392,180')}${crate(320, 180, true)}
    ${ar(p, 'pi', 'M412,206 C412,226 402,232 384,232 L236,232')}${crate(320, 232, false)}

    <rect class="fc04b-machine" x="398" y="156" width="150" height="48" rx="24"/>${t(473, 188, 'unpacking', 'sm fc04b-b')}
    ${t(473, 140, '= sucrose synthesis', 'sm fc04b-map')}
    ${ar(p, 'ink', 'M552,180 L600,180')}${sucrose(642, 180, 1)}${t(642, 222, 'sucrose', 'sm fc04b-b')}
    ${ar(p, 'sug', 'M684,180 L774,180')}${t(724, 160, 'to phloem', 'sm fc04b-brown')}
    <text class="sm" x="352" y="282"><tspan class="fc04b-b">empty crate</tspan> <tspan class="fc04b-map">= Pᵢ</tspan></text>
    <text class="sm" x="320" y="338" text-anchor="middle"><tspan class="fc04b-b">swap counter</tspan> <tspan class="fc04b-map">= TPT</tspan></text>

    <path class="rule" d="M16,372 H784"/>
    ${crate(130, 434, true)}${ar(p, 'ink', 'M162,434 L202,434')}${crate(230, 470, false)}${ar(p, 'pi', 'M198,470 L158,470')}
    ${t(180, 536, 'one out, one in', 'sm fc04b-b')}
    ${crate(498, 470, true)}${crate(556, 470, true)}${crate(527, 436, true)}${crate(636, 452, false)}
    <path class="fc04b-stop" d="M622,438 L650,466 M650,438 L622,466"/>
    <text class="sm" x="566" y="536" text-anchor="middle"><tspan class="fc04b-b">unpacking lags:</tspan> <tspan class="fc04b-tpu fc04b-b">TPU limit</tspan></text>
    ${t(16, 590, 'TPT: triose-P/Pᵢ translocator', 'tiny', 'start')}`);
}

/* ---------- c · Starch clock: a 24-hour dial (schematic) ---------- */

function clockSvg(): string {
  const p = 'fc04bc';
  const cx = 300, cy = 280, R = 122, base = R + 8, span = 92;
  const s = (h: number): number => (h <= 12 ? 0.05 + (0.95 * h) / 12 : 1 - (0.95 * (h - 12)) / 12);
  const pt = (h: number, r: number): string => {
    const a = Math.PI + (h / 24) * 2 * Math.PI;
    return `${f1(cx + r * Math.cos(a))},${f1(cy + r * Math.sin(a))}`;
  };
  const outer = Array.from({ length: 97 }, (_, i) => pt(i / 4, base + span * s(i / 4)));
  const inner = Array.from({ length: 97 }, (_, i) => pt(24 - i / 4, base));
  const ticks = Array.from({ length: 8 }, (_, k) => {
    const a = Math.PI + (k / 8) * 2 * Math.PI;
    return `M${f1(cx + (R - 10) * Math.cos(a))},${f1(cy + (R - 10) * Math.sin(a))} L${f1(cx + R * Math.cos(a))},${f1(cy + R * Math.sin(a))}`;
  }).join('');
  return svg(p, 'Schematic 24-hour dial: starch in the leaf builds up through the day, is used at a clock-set rate through the night and is nearly gone at dawn; sucrose is made around the clock',
    `<path class="fc04b-dayhalf" d="M${cx - R},${cy} A${R},${R} 0 0 1 ${cx + R},${cy} Z"/>
    <path class="fc04b-nighthalf" d="M${cx + R},${cy} A${R},${R} 0 0 1 ${cx - R},${cy} Z"/>
    <circle class="fc04b-tick" cx="${cx}" cy="${cy}" r="${R}"/><path class="fc04b-tick" d="${ticks}"/>
    <polygon class="fc04b-band" points="${outer.join(' ')} ${inner.join(' ')}"/>
    ${sun(cx, cy - 70, 14)}${t(cx, cy - 22, 'day', 'sm fc04b-b')}
    ${moon(cx, cy + 66, 15)}${t(cx, cy + 36, 'night', 'sm fc04b-b fc04b-night')}
    ${t(cx - R + 14, cy + 8, 'dawn', 'sm fc04b-b', 'start')}${t(cx + R - 14, cy + 8, 'dusk', 'sm fc04b-b', 'end')}
    ${ar(p, 'grey', `M${f1(cx - 6)},${cy - R - 24} A${R + 24},${R + 24} 0 0 1 ${f1(cx + 60)},${f1(cy - Math.sqrt((R + 24) ** 2 - 60 ** 2))}`, 'fc04b-thin')}

    ${t(cx + base + span + 12, cy + 8, '← most at dusk', 'sm fc04b-b', 'start')}${lines(cx - base - 12, cy - 4, ['nearly', 'empty'], 'sm fc04b-b', 'end', 24)}
    <rect class="fc04b-band" x="76" y="506" width="40" height="22" rx="4"/>${t(128, 524, 'starch in the leaf', 'sm', 'start')}
    ${sucrose(424, 517, 1)}${t(466, 524, 'sucrose made day and night', 'sm', 'start')}
    ${t(784, 588, 'schematic, 12-hour day', 'tiny', 'end')}`);
}

/* ---------- d · Leaf to sink: the plant, then a minor vein ---------- */

function sinkSvg(): string {
  const p = 'fc04bd';
  const roots = 'M170,470 L170,560 M170,500 L132,552 M170,500 L214,548 M150,526 L120,540 M190,520 L224,520';
  return svg(p, 'A source leaf sends sucrose through the phloem to sinks: young leaves, fruits and roots. In a minor vein, SWEET lets sucrose out of the leaf cell, SUT loads it into the phloem, and water follows',
    `<path class="fc04b-ground" d="M30,470 H330"/><path class="fc04b-root" d="${roots}"/>
    <path class="fc04b-stem" d="M170,470 V100"/>
    <ellipse class="fc04b-leaf" cx="246" cy="300" rx="76" ry="28" transform="rotate(-22 246 300)"/><path class="fc04b-vein" d="M174,328 L318,270"/>
    <ellipse class="fc04b-leaf" cx="112" cy="392" rx="62" ry="23" transform="rotate(22 112 392)"/>
    <ellipse class="fc04b-leaf" cx="198" cy="100" rx="32" ry="13" transform="rotate(-30 198 100)"/>
    <path class="fc04b-vein" d="M170,238 L120,218"/><circle class="fc04b-fruit" cx="104" cy="212" r="18"/>
    <path class="fc04b-phl" d="M176,322 V130"/>
    ${ar(p, 'sug', 'M176,330 L176,452')}${ar(p, 'sug', 'M176,300 L176,132')}${ar(p, 'sug', 'M168,238 L130,224')}${ar(p, 'sug', 'M176,486 L176,540')}
    ${lines(238, 358, ['source', 'leaf'], 'sm fc04b-b', 'middle', 24)}
    ${t(160, 96, 'young leaf', 'sm fc04b-brown', 'end')}${t(78, 182, 'fruit', 'sm fc04b-brown', 'middle')}${t(232, 560, 'roots', 'sm fc04b-brown', 'start')}
    ${t(24, 594, 'brown arrows: sucrose in the phloem', 'tiny', 'start')}

    <circle class="fc04b-lens" cx="270" cy="290" r="20"/>
    <path class="fc04b-zoom" d="M286,278 L362,44 M286,302 L362,560"/>
    <rect class="fc04b-panel" x="362" y="44" width="428" height="516" rx="20"/>


    <rect class="fc04b-cell" x="376" y="136" width="100" height="340" rx="22"/>${t(426, 124, 'leaf cell', 'sm fc04b-b')}
    ${cp(384, 162, 84, 66, 28)}${granum(408, 195, 3)}${granum(452, 195, 3)}
    ${sucrose(420, 330, 1)}${ar(p, 'ink', 'M454,330 L468,330')}
    ${tp(476, 330, 'fc04b-sweet', 48, 22)}${t(492, 306, 'SWEET', 'sm fc04b-b', 'start')}
    ${ar(p, 'ink', 'M490,330 L604,330')}
    ${tubeV(620, 136, 694, 476, [220, 410])}${t(657, 124, 'phloem', 'sm fc04b-b')}
    ${tp(620, 330, 'fc04b-sut', 48, 22)}${t(604, 372, 'SUT', 'sm fc04b-b', 'end')}
    ${molecule(756, 250, 'O', 11)}<circle class="atom atom-H" cx="${756 - 13}" cy="${250 + 9}" r="7"/><circle class="atom atom-H" cx="${756 + 13}" cy="${250 + 9}" r="7"/>
    ${ar(p, 'grey', 'M738,268 L702,282')}${t(756, 222, 'water', 'sm', 'middle')}
    ${ar(p, 'sug', 'M657,354 L657,456')}`);
}

/* ---------- e · Sucrose lags: with and without Pᵢ coming back ---------- */

function lagSvg(): string {
  const p = 'fc04be';
  const panel = (oy: number, lag: boolean): string => {
    const y = (v: number): number => oy + v;
    const faint = lag ? ' fc04b-faint' : '';
    const back = lag
      ? `${ar(p, 'pi', `M548,${y(200)} C520,${y(250)} 440,${y(250)} 424,${y(208)}`, 'fc04b-faint')}${ar(p, 'pi', `M404,${y(214)} C330,${y(236)} 190,${y(236)} 122,${y(214)}`, 'fc04b-faint')}
         ${t(160, y(200), 'Pᵢ?', 'lab fc04b-b fc04b-clay', 'start')}`
      : `${ar(p, 'pi', `M548,${y(200)} C520,${y(250)} 440,${y(250)} 424,${y(208)}`)}${ar(p, 'pi', `M404,${y(214)} C330,${y(250)} 190,${y(250)} 122,${y(214)}`)}
         ${pi(482, y(238))}${pi(262, y(241))}`;
    const cytosol = lag
      ? `${triose(500, y(124), 0.8)}${triose(568, y(124), 0.8)}${triose(500, y(150), 0.8)}${triose(568, y(150), 0.8)}${triose(534, y(176), 0.8)}${triose(602, y(176), 0.8)}
         ${ar(p, 'ink', `M640,${y(176)} L680,${y(176)}`, 'fc04b-faint')}<g opacity=".45">${sucrose(716, y(176), 0.9)}</g>
         ${t(780, y(262), 'sugar phosphates pile up', 'sm fc04b-clay', 'end')}`
      : `${ar(p, 'ink', `M430,${y(178)} L524,${y(178)}`)}${sucrose(566, y(178), 1)}${ar(p, 'sug', `M608,${y(178)} L688,${y(178)}`)}${t(744, y(184), 'phloem', 'sm fc04b-brown')}`;
    return `<rect class="fc04b-panel" x="10" y="${y(8)}" width="780" height="276" rx="18"/>
      ${t(30, y(46), lag ? 'Sucrose lags' : 'Sucrose keeps up', `lab fc04b-b${lag ? ' fc04b-clay' : ''}`, 'start')}
      ${t(780, y(46), lag ? 'Pᵢ stays in cytosol' : 'Pᵢ returns', `sm ${lag ? 'fc04b-clay' : 'fc04b-pi'}`, 'end')}
      ${cp(22, y(64), 392, 212, 26)}${t(398, y(92), 'chloroplast', 'sm fc04b-grey', 'end')}${t(780, y(92), 'cytosol', 'sm fc04b-grey', 'end')}
      ${atpSynthase(90, y(166))}${t(36, y(100), 'ATP synthase', 'sm', 'start')}
      <g class="${faint.trim()}">${tag(186, y(128), 'ATP', 'atp')}</g>${ar(p, 'ink', `M112,${y(140)} L150,${y(132)}`, faint.trim())}
      ${ar(p, 'ink', `M212,${y(140)} L236,${y(152)}`, faint.trim())}
      ${cycle(p, 266, y(178), 36, lag)}
      ${ar(p, 'ink', `M304,${y(178)} L398,${y(178)}`, faint.trim())}${triose(352, y(154), 0.85)}
      ${tp(414, y(178), 'fc04b-tpt', 56, 24)}
      ${cytosol}${back}
      ${lag ? t(266, y(258), 'TPU limit', 'sm fc04b-b fc04b-tpu') : ''}`;
  };
  return svg(p, 'Two panels. When sucrose synthesis keeps up, Pᵢ returns through the TPT to ATP synthase and the cycle runs. When it lags, sugar phosphates pile up in the cytosol, Pᵢ stays there, ATP synthesis slows and the cycle slows: the TPU limit',
    panel(0, false) + panel(304, true));
}

/* ---------- f · Six steps ---------- */

function stepsSvg(): string {
  const p = 'fc04bf';
  const W = 252, H = 282;
  const box = (col: number, row: number, n: string, title: string, txt: string[], icon: (x: number, y: number) => string, bg = 'fc04b-panel'): string => {
    const x = 10 + col * 263, y = 12 + row * 294;
    return `<rect class="${bg}" x="${x}" y="${y}" width="${W}" height="${H}" rx="18"/>
      ${num(x + 28, y + 32, n)}${t(x + 52, y + 40, title, 'sm fc04b-b', 'start')}
      ${icon(x, y)}${lines(x + W / 2, y + 222, txt, 'sm', 'middle', 27)}`;
  };
  return svg(p, 'Six steps: the cycle makes triose phosphate; the TPT swaps it for Pᵢ; the cytosol makes sucrose and frees Pᵢ; by day starch is stored; at night starch leaves as maltose and sucrose is made; SWEET and SUT load sucrose into the phloem',
    box(0, 0, '1', 'Fix', ['CO₂ → triose-P'], (x, y) =>
      `${molecule(x + 56, y + 84, 'OCO', 10)}${ar(p, 'ink', `M${x + 68},${y + 98} L${x + 82},${y + 112}`)}${cycle(p, x + 104, y + 140, 30)}${ar(p, 'ink', `M${x + 138},${y + 140} L${x + 164},${y + 140}`)}${triose(x + 200, y + 140, 0.9)}`) +
    box(1, 0, '2', 'Swap', ['TPT: triose-P out,', 'Pᵢ in'], (x, y) =>
      `<path class="fc04b-cp-in" d="M${x + 120},${y + 72} V${y + 170} M${x + 128},${y + 72} V${y + 170}"/>${tp(x + 124, y + 124, 'fc04b-tpt', 64, 26)}
       ${triose(x + 56, y + 104, 0.85)}${ar(p, 'ink', `M${x + 90},${y + 104} L${x + 206},${y + 104}`)}
       ${pi(x + 204, y + 150)}${ar(p, 'pi', `M${x + 184},${y + 150} L${x + 56},${y + 150}`)}
       ${t(x + 64, y + 178, 'stroma', 'tiny', 'middle')}${t(x + 188, y + 178, 'cytosol', 'tiny', 'middle')}`) +
    box(2, 0, '3', 'Build', ['sucrose made,', 'Pᵢ freed'], (x, y) =>
      `${triose(x + 56, y + 96, 0.85)}${triose(x + 56, y + 132, 0.85)}${ar(p, 'ink', `M${x + 96},${y + 114} L${x + 128},${y + 114}`)}
       ${sucrose(x + 176, y + 114, 1)}${ar(p, 'pi', `M${x + 150},${y + 134} L${x + 136},${y + 156}`)}${pi(x + 124, y + 170)}`) +
    box(0, 1, '4', 'Store', ['starch built', 'by day'], (x, y) =>
      `${sun(x + 48, y + 92, 13)}${granule(x + 150, y + 128, 56, 36)}
       ${ar(p, 'ink', `M${x + 90},${y + 128} L${x + 80},${y + 128}`)}${ar(p, 'ink', `M${x + 212},${y + 128} L${x + 224},${y + 128}`)}`, 'fc04b-tile-day') +
    box(1, 1, '5', 'Release', ['starch → maltose', 'at night'], (x, y) =>
      `${moon(x + 44, y + 92, 14)}${granule(x + 96, y + 136, 30, 20, [50, 33])}${ar(p, 'night', `M${x + 132},${y + 136} L${x + 166},${y + 136}`)}${maltose(x + 202, y + 136, 0.8)}`, 'fc04b-tile-night') +
    box(2, 1, '6', 'Ship', ['sucrose into', 'the phloem'], (x, y) =>
      `${sucrose(x + 66, y + 118, 1)}${ar(p, 'ink', `M${x + 104},${y + 118} L${x + 160},${y + 118}`)}${tp(x + 132, y + 118, 'fc04b-sweet', 40, 18)}
       ${tubeV(x + 170, y + 66, x + 222, y + 184, [100, 150].map(v => y + v))}${ar(p, 'sug', `M${x + 196},${y + 110} L${x + 196},${y + 174}`)}`));
}

/* ---------- g · Day and night: the illustrated cell twice ---------- */

function dayNightSvg(): string {
  const p = 'fc04bg';
  const half = (ox: number, night: boolean): string => {
    const X = (v: number): number => ox + v;
    const ex = (y: number): number => X(130) + 108 * Math.sqrt(1 - ((y - 290) / 190) ** 2);
    const env = `<ellipse class="fc04b-cp" cx="${X(130)}" cy="290" rx="108" ry="190"/><ellipse class="fc04b-cp-in" cx="${X(130)}" cy="290" rx="101" ry="183"/>
      ${granum(X(92), 152)}${granum(X(170), 152)}`;
    const head = `<rect class="${night ? 'fc04b-nightbg' : 'fc04b-day'}" x="${X(8)}" y="8" width="384" height="584" rx="20"/>
      ${night ? moon(X(40), 46, 15) : sun(X(40), 46, 14)}${t(X(70), 56, night ? 'Night' : 'Day', 'lab fc04b-b', 'start')}
      ${t(X(380), 56, night ? 'cycle off' : 'cycle runs', `sm ${night ? 'fc04b-night' : 'fc04b-grey'}`, 'end')}`;
    const common = `${ar(p, 'sug', `M${X(352)},${night ? 262 : 262} L${X(360)},530`)}${t(X(384), 566, 'to phloem', 'sm fc04b-brown', 'end')}
      ${sucrose(X(322), 236, 0.95)}${t(X(322), 202, 'sucrose', 'sm fc04b-b')}`;
    if (!night) {
      return `${head}${env}
        ${molecule(X(38), 124, 'OCO', 10)}${ar(p, 'ink', `M${X(52)},${140} L${X(80)},${206}`)}
        ${cycle(p, X(108), 236, 38)}${rubp(X(108), 236, 27)}
        ${ar(p, 'ink', `M${X(146)},236 L${f1(ex(236) - 14)},236`)}${triose(X(180), 212, 0.8)}${t(X(170), 188, 'triose-P', 'sm fc04b-b')}
        ${tp(ex(236), 236, 'fc04b-tpt', 46, 20)}${ar(p, 'ink', `M${f1(ex(236) + 12)},236 L${X(286)},236`)}
        ${ar(p, 'pi', `M${X(304)},258 C${X(298)},300 ${X(262)},300 ${f1(ex(236) + 6)},${262}`)}${pi(X(284), 300)}
        ${ar(p, 'ink', `M${X(108)},276 L${X(114)},${334}`)}
        ${granule(X(120), 382, 62, 40)}${t(X(126), 512, 'starch grows', 'sm fc04b-b')}
        ${common}`;
    }
    return `${head}${env}
      ${cycle(p, X(108), 236, 38, true)}<g opacity=".4">${rubp(X(108), 236, 27)}</g>
      ${granule(X(120), 382, 34, 22, [62, 40])}${t(X(126), 512, 'starch shrinks', 'sm fc04b-b')}
      ${ar(p, 'night', `M${X(156)},382 L${f1(ex(382) - 14)},382`)}${tp(ex(382), 382, 'fc04b-mex', 44, 20)}
      ${maltose(X(186), 352, 0.75)}${t(X(176), 326, 'maltose', 'sm fc04b-b fc04b-night')}
      ${ar(p, 'night', `M${f1(ex(382) + 12)},382 C${X(296)},382 ${X(318)},330 ${X(320)},264`)}
      ${common}`;
  };
  return svg(p, 'The same leaf cell by day and by night. Day: CO₂ enters the cycle, triose phosphate leaves through the TPT for Pᵢ and becomes sucrose, starch grows. Night: the cycle is off, starch shrinks and leaves as maltose, which becomes sucrose. Sucrose goes to the phloem in both',
    half(0, false) + half(400, true));
}

/* ---------- h · Early night: the evidence (schematic, after Graf et al. 2010) ---------- */

function earlySvg(): string {
  const p = 'fc04bh';
  const x0 = 170, x1 = 770, y0 = 500, yt = 216;
  const X = (h: number): number => x0 + (h / 24) * (x1 - x0);
  const Y = (s: number): number => y0 - s * (y0 - yt);
  const lo = 0.05, peak = 1, early = lo + ((peak - lo) * 8) / 12;
  const bar = (y: number, off: number, label: string): string =>
    `<rect class="fc04b-lightbar" x="${x0}" y="${y}" width="${f1(X(off) - x0)}" height="24"/><rect class="fc04b-darkbar" x="${f1(X(off))}" y="${y}" width="${f1(x1 - X(off))}" height="24"/>
     ${t((x0 + X(off)) / 2, y + 18, 'light', 'tiny', 'middle')}${t((X(off) + x1) / 2, y + 18, 'dark', 'tiny fc04b-w', 'middle')}
     ${t(x0 - 12, y + 19, label, 'sm fc04b-b', 'end')}`;
  const ticks = [0, 4, 8, 12, 16, 20, 24].map(h => `<path class="fc04b-tick" d="M${X(h)},${y0} V${y0 + 8}"/>${t(X(h), y0 + 32, `${h}`, 'tl')}`).join('');
  return svg(p, 'Schematic after Graf et al. 2010: starch rises through a 12-hour day and falls through the night to nearly zero at dawn. When night comes early, at 8 hours, starch is broken down more slowly and still lasts until dawn',
    `${bar(80, 12, '12-h day')}${bar(120, 8, 'early night')}
    <path class="axis" d="M${x0},${yt - 20} V${y0} H${x1}"/>${ticks}
    ${t((x0 + x1) / 2, y0 + 66, 'hours after dawn', 'tl')}
    <text class="tl" transform="translate(${x0 - 34} ${(y0 + yt) / 2}) rotate(-90)" text-anchor="middle">starch in the leaf →</text>
    <path class="fc04b-cv-early" d="M${f1(X(8))},${f1(Y(early))} L${X(24)},${f1(Y(lo))}"/>
    <path class="fc04b-cv" d="M${X(0)},${f1(Y(lo))} L${X(12)},${f1(Y(peak))} L${X(24)},${f1(Y(lo))}"/>
    <circle class="fc04b-p" cx="${f1(X(8))}" cy="${f1(Y(early))}" r="7"/>
    ${t(X(12), Y(peak) - 16, '12-h day', 'sm fc04b-b')}
    ${lines(X(8) - 14, Y(early) - 92, ['dark at 8 h:', 'slower', 'breakdown'], 'sm fc04b-clay', 'end', 26)}
    ${t(676, y0 - 24, 'both nearly empty at dawn', 'sm fc04b-b', 'end')}${ar(p, 'grey', `M684,${y0 - 26} L${X(24) - 10},${f1(Y(lo) - 2)}`, 'fc04b-thin')}
    ${t(790, 596, 'schematic, after Graf et al. 2010', 'tiny', 'end')}`);
}

/* ---------- i · Equation unpacked: what "C₆H₁₂O₆" really is ---------- */

function equationSvg(): string {
  const p = 'fc04bi';
  return svg(p, 'The equation 6 CO₂ + 12 H₂O → C₆H₁₂O₆ + 6 O₂ + 6 H₂O, with light over the arrow, and its term C₆H₁₂O₆ unpacked: the cycle exports triose phosphate; two make one six-carbon unit. By day carbon becomes sucrose (glucose plus fructose, exported) and starch (stored in the stroma); at night starch leaves as maltose and becomes sucrose',
    `${t(232, 74, '6 CO₂ + 12 H₂O', 'fc04b-eq fc04b-dim', 'end')}${rxLight(244, 318, 64)}
    <rect class="fc04b-eqbox" x="330" y="36" width="140" height="54" rx="12"/>${t(400, 74, 'C₆H₁₂O₆', 'fc04b-eq')}
    ${t(478, 74, '+ 6 O₂ + 6 H₂O', 'fc04b-eq fc04b-dim', 'start')}
    ${ar(p, 'ink', 'M400,96 L400,134')}${t(414, 122, 'what the cycle exports', 'sm fc04b-grey', 'start')}
    ${triose(346, 168)}${t(400, 175, '+', 'lab fc04b-b')}${triose(454, 168)}
    ${t(400, 214, '2 triose-P = one 6-C unit', 'sm fc04b-b')}
    ${ar(p, 'ink', 'M360,226 L254,290')}${sun(286, 240, 11)}
    ${ar(p, 'ink', 'M440,226 L546,290')}${sun(514, 240, 11)}
    ${sucrose(220, 324, 1.5)}${t(220, 380, 'sucrose', 'lab fc04b-b')}
    ${lines(220, 412, ['glucose + fructose', 'cytosol → phloem'], 'sm', 'middle', 27)}
    ${glucans(566, 324, 4, 1)}${t(580, 380, 'starch', 'lab fc04b-b')}
    ${lines(580, 412, ['glucose chains', 'stored in stroma'], 'sm', 'middle', 27)}
    ${ar(p, 'night', 'M580,450 L580,494')}
    ${maltose(580, 520, 1)}${t(626, 528, 'maltose', 'sm fc04b-b fc04b-night', 'start')}
    ${ar(p, 'night', 'M540,520 L372,520')}${moon(456, 546, 12)}
    ${sucrose(330, 520, 0.9)}${t(290, 528, 'sucrose by night', 'sm fc04b-b', 'end')}
    ${t(400, 590, 'No free glucose leaves the cycle', 'sm fc04b-grey')}`);
}

/* ---------- j · Three icons ---------- */

function iconsSvg(): string {
  const p = 'fc04bj';
  const tile = (x: number, word: string, l1: string, l2: string, icon: string): string =>
    `<rect class="fc04b-tile" x="${x}" y="70" width="240" height="460" rx="24"/>${icon}
     ${t(x + 120, 410, word, 'fc04b-big')}${t(x + 120, 452, l1, 'sm')}${t(x + 120, 480, l2, 'sm')}`;
  const swap = `<path class="fc04b-cp-in" d="M136,170 V320 M146,170 V320"/>${tp(141, 245, 'fc04b-tpt', 80, 30)}
    ${triose(80, 210)}${ar(p, 'ink', 'M116,210 L208,210')}${pi(200, 282)}${ar(p, 'pi', 'M180,282 L74,282')}`;
  const store = `${sun(352, 160, 14)}${moon(468, 160, 15)}${granule(410, 250, 76, 52)}
    ${ar(p, 'ink', 'M318,262 L318,214')}${ar(p, 'night', 'M502,214 L502,262')}`;
  const ship = `${tubeV(626, 150, 694, 340, [210, 280])}${sucrose(660, 182, 0.8)}${sucrose(660, 246, 0.8)}${ar(p, 'sug', 'M720,190 L720,320')}`;
  return svg(p, 'Three icons: swap (triose phosphate out, Pᵢ in), store (starch by day, used by night), ship (sucrose in the phloem)',
    tile(20, 'Swap', 'triose-P out,', 'Pᵢ in', swap) + tile(290, 'Store', 'starch by day,', 'degraded at night', store) + tile(560, 'Ship', 'sucrose in', 'the phloem', ship));
}

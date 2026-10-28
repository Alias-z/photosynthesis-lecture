// Slide C10 · CAM separates carbon capture in time. Draft context, checked in
// research/review-2026-10-23-claude/E_C07-C12.md (C10 rows 1–5, Gaps 5) and REVIEW_SUMMARY.md (essential 7).
// Facts used, and no others: night PEPC fixation stores organic (malic) acid in the vacuole; by day decarboxylation
// feeds the Calvin–Benson cycle while stomata stay (relatively) closed; C₄ separates the steps in space, CAM in time
// (Ludwig 2024); CAM water-use efficiency is much higher than C₃ or C₄ (Yang 2024); ≥ 66 origins, ~7 % of vascular
// plant species (Gilman 2023); Portulaca adds CAM under drought or short days (Koch & Kennedy 1980) and runs C₄
// and CAM in the same cells, CAM products probably feeding the C₄ cycle (Moreno-Villena 2022); the Calvin–Benson
// cycle is switched off in the dark (C01). Every curve is schematic and says so.
import { bolt, illusHeads, molecule } from '../illus';
import { text as t } from '../mechanisms';
import type { PlateText, Variant } from '../types';
import './c10.css';

export const PLATE: PlateText = {
  n: 'C11',
  title: 'CAM separates carbon capture in time',
  status: 'draft',
  lead: 'CAM (crassulacean acid metabolism) plants take up CO₂ at night, store it as malic acid and release it to RuBisCO by day.',
  points: [
    { claim: 'Night: CO₂ is stored as acid.', text: 'Through open stomata, CO₂ is fixed by PEPC and stored as malic acid in the vacuole.' },
    { claim: 'Day: RuBisCO works behind closed stomata.', text: 'Malate releases its CO₂, which the light-driven Calvin–Benson cycle fixes, so little water is lost.' },
    { claim: 'CO₂ pumps evolved many times.', text: 'C₄ separates the steps in space, CAM in time; algae and cyanobacteria pump HCO₃⁻ into a RuBisCO compartment and do about half of Earth’s CO₂ fixation.' },
  ],
  refs: [
    { label: 'Ludwig 2024', url: 'https://doi.org/10.1016/j.semcdb.2023.07.013' },
    { label: 'Yang et al. 2024', url: 'https://doi.org/10.1101/cshperspect.a041674' },
    { label: 'Hennacy & Jonikas 2020', url: 'https://doi.org/10.1146/annurev-arplant-081519-040100' },
  ],
};

export const VARIANTS: Variant[] = [
  { id: 'a', name: 'Night and day', anim: true },
  { id: 'b', name: 'Space vs time' },
  { id: 'c', name: '24-hour dial', anim: true },
  { id: 'd', name: 'Day–night traces' },
  { id: 'f', name: 'Four steps', anim: true },
  { id: 'g', name: 'Noon test' },
  { id: 'h', name: 'Plant to acid' },
  { id: 'i', name: 'Purslane exception' },
  { id: 'j', name: 'Equation by clock' },
];

export function draw(id: string): string {
  switch (id) {
    case 'b': return spaceTimeSvg();
    case 'c': return dialSvg();
    case 'd': return tracesSvg();
    case 'e': return bakerySvg();
    case 'f': return stepsSvg();
    case 'g': return noonSvg();
    case 'h': return zoomSvg();
    case 'i': return purslaneSvg();
    case 'j': return equationSvg();
    default: return nightDaySvg();
  }
}

/* ---------- shared parts ---------- */

type K = 'ink' | 'grey' | 'c' | 'acid' | 'water' | 'amber' | 'teal' | 'green';
const KS: K[] = ['ink', 'grey', 'c', 'acid', 'water', 'amber', 'teal', 'green'];
type Anchor = 'start' | 'middle' | 'end';
const f = (n: number): string => n.toFixed(1);

/** Arrowheads in each ink plus the amber bolt head, prefixed per figure. */
const defs = (p: string): string =>
  illusHeads(p) + `<defs>${KS.map(k => `<marker id="${p}-k-${k}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path class="fc10-hd-${k}" d="M0,0L10,5L0,10z"/></marker>`).join('')}</defs>`;

const ar = (p: string, k: K, d: string, cls = ''): string =>
  `<path class="fc10-ar fc10-k-${k}${cls ? ` ${cls}` : ''}" d="${d}" marker-end="url(#${p}-k-${k})"/>`;

const svg = (p: string, label: string, body: string): string =>
  `<svg class="fig-svg fc10" viewBox="0 0 800 600" role="img" aria-label="${label}">${defs(p)}${body}</svg>`;

/** Lines of text under one another. */
const lines = (x: number, y: number, ss: string[], cls: string, anchor: Anchor = 'middle', dy = 26): string =>
  ss.map((s, i) => t(x, y + i * dy, s, cls, anchor)).join('');

/** A label whose first word is bold and the rest a mapping in clay: "door = stomata". */
const mapped = (x: number, y: number, thing: string, real: string, anchor: Anchor = 'start'): string =>
  `<text class="sm" x="${x}" y="${y}" text-anchor="${anchor}"><tspan class="fc10-b">${thing}</tspan><tspan class="fc10-map"> = ${real}</tspan></text>`;

function sun(x: number, y: number, r = 13): string {
  const rays = Array.from({ length: 8 }, (_, k) => {
    const a = (k / 8) * Math.PI * 2, c = Math.cos(a), s = Math.sin(a);
    return `M${f(x + c * (r + 5))},${f(y + s * (r + 5))} L${f(x + c * (r + 12))},${f(y + s * (r + 12))}`;
  }).join('');
  return `<path class="fc10-ray" d="${rays}"/><circle class="fc10-sun" cx="${x}" cy="${y}" r="${r}"/>`;
}

function moon(x: number, y: number, r = 14): string {
  const tx = f(x + r * 0.5), ty = f(y - r * 0.866), by = f(y + r * 0.866);
  return `<path class="fc10-moon" d="M${tx},${ty} A${r},${r} 0 1 0 ${tx},${by} A${f(r * 0.95)},${f(r * 0.95)} 0 0 1 ${tx},${ty} Z"/>`;
}

/** A stoma seen from above: two guard cells around a pore that is open (lens) or shut (slit). */
function stoma(x: number, y: number, open: boolean, s = 1): string {
  const R = 24 * s, H = 34 * s, h = 24 * s, pw = (open ? 10 : 1.2) * s;
  const half = (sw: 0 | 1): string =>
    `M${x},${y - H} A${R},${H} 0 0 ${sw} ${x},${y + H} L${x},${y + h} A${pw},${h} 0 0 ${sw ? 0 : 1} ${x},${y - h} Z`;
  return (open ? `<ellipse class="fc10-pore" cx="${x}" cy="${y}" rx="${pw}" ry="${h}"/>` : '')
    + `<path class="fc10-gc" d="${half(0)}"/><path class="fc10-gc" d="${half(1)}"/>`;
}

function drop(x: number, y: number, s = 1): string {
  return `<path class="fc10-drop" d="M${f(x)},${f(y - 12 * s)} C${f(x + 3 * s)},${f(y - 6 * s)} ${f(x + 8 * s)},${f(y - 1 * s)} ${f(x + 8 * s)},${f(y + 4 * s)} A${f(8 * s)},${f(8 * s)} 0 0 1 ${f(x - 8 * s)},${f(y + 4 * s)} C${f(x - 8 * s)},${f(y - 1 * s)} ${f(x - 3 * s)},${f(y - 6 * s)} ${f(x)},${f(y - 12 * s)} Z"/>`;
}

const co2 = (x: number, y: number, r = 10): string => molecule(x, y, 'OCO', r);

/** Malate: four carbon beads in a chain (carbon = dark bead). */
function malate(x: number, y: number, r = 8, gap = 20): string {
  const xs = [0, 1, 2, 3].map(i => x + (i - 1.5) * gap);
  return `<path class="fc10-bond" d="M${f(xs[0])},${y} H${f(xs[3])}"/>` + xs.map(cx => `<circle class="fc10-bead" cx="${f(cx)}" cy="${y}" r="${r}"/>`).join('');
}

/** An enzyme or block as a rounded chip with its name. */
const chip = (x: number, y: number, w: number, s: string, cls: string, tcls = 'sm fc10-b', h = 36): string =>
  `<rect class="${cls}" x="${f(x - w / 2)}" y="${f(y - h / 2)}" width="${w}" height="${h}" rx="${h / 2}"/>${t(x, y + 8, s, tcls)}`;

const rubisco = (x: number, y: number, on = true, w = 104): string =>
  chip(x, y, w, 'RuBisCO', on ? 'fc10-rub' : 'fc10-rub fc10-off', on ? 'sm fc10-b' : 'sm fc10-mute');

/** The vacuole as a rounded store filled with malic acid to a level between 0 and 1. */
function vacuole(x: number, y: number, w: number, h: number, level: number, r = 18): string {
  const pad = 7, lv = level * (h - 2 * pad);
  return `<rect class="fc10-vac" x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}"/>`
    + (lv > 0 ? `<rect class="fc10-acid" x="${x + pad}" y="${f(y + h - pad - lv)}" width="${w - 2 * pad}" height="${f(lv)}" rx="${Math.max(4, r - 8)}"/>` : '');
}

const chloro = (x: number, y: number, rx: number, ry: number, on = true): string =>
  `<ellipse class="${on ? 'fc10-chl' : 'fc10-chl fc10-off'}" cx="${x}" cy="${y}" rx="${rx}" ry="${ry}"/>`;

const num = (x: number, y: number, n: string, r = 15): string =>
  `<circle class="fc10-num" cx="${x}" cy="${y}" r="${r}"/>${t(x, y + 6.5, n, 'fc10-num-t')}`;

const SCHEMATIC = (x = 784, y = 590): string => t(x, y, 'schematic', 'note', 'end');

/* ---------- 10A · night and day: one cell, two panels (the mechanism) ---------- */

function nightDaySvg(): string {
  const p = 'fc10a';
  const half = (y0: number, night: boolean): string => {
    const Y = (y: number): number => y0 + y;
    const head = night
      ? `${moon(34, Y(34), 15)}${t(60, Y(44), 'Night', 'lab fc10-b', 'start')}${t(146, Y(44), 'stomata open', 'sm fc10-mute', 'start')}`
      : `${sun(34, Y(34), 11)}${t(64, Y(44), 'Day', 'lab fc10-b', 'start')}${t(128, Y(44), 'stomata closed', 'sm fc10-mute', 'start')}`;
    const common = `<rect class="${night ? 'fc10-nightbg' : 'fc10-daybg'}" x="4" y="${y0}" width="792" height="290" rx="18"/>${head}
      ${night ? t(112, Y(100), 'stoma', 'sm fc10-mute') : ''}${stoma(112, Y(146), night, 0.95)}
      <rect class="fc10-cell" x="150" y="${Y(62)}" width="636" height="218" rx="26"/>
      ${chloro(330, Y(232), 160, 32, !night)}${rubisco(236, Y(232), !night)}
      ${malate(410, Y(146))}${t(410, Y(124), 'malate', 'sm fc10-plum')}
      ${vacuole(540, Y(76), 232, 190, night ? 0.72 : 0.12)}${t(656, Y(104), 'vacuole', 'sm fc10-b')}`;
    if (night) {
      return common + `
        ${co2(40, Y(146))}${ar(p, 'c', `M66,${Y(146)} L362,${Y(146)}`)}
        ${t(250, Y(132), 'PEPC', 'lab fc10-teal')}${t(250, Y(176), '+ PEP', 'sm fc10-teal')}
        ${ar(p, 'acid', `M456,${Y(146)} L530,${Y(146)}`)}
        ${t(656, Y(196), 'malic acid', 'lab fc10-plum')}${t(656, Y(224), 'fills up', 'sm')}
        ${t(306, Y(240), 'off in the dark', 'sm fc10-mute', 'start')}`;
    }
    return common + `
      <path class="fc10-was" d="M548,${Y(132)} H764"/>${t(764, Y(126), 'level at dawn', 'fc10-t15 fc10-mute', 'end')}
      ${t(636, Y(184), 'malic acid', 'lab fc10-plum')}${t(636, Y(212), 'drawn down', 'sm')}
      ${ar(p, 'acid', `M748,${Y(140)} L748,${Y(226)}`)}
      ${ar(p, 'acid', `M536,${Y(146)} L456,${Y(146)}`)}
      ${ar(p, 'acid', `M364,${Y(146)} L224,${Y(146)}`)}${t(292, Y(178), 'decarboxylation', 'sm fc10-plum')}
      ${co2(196, Y(146))}${ar(p, 'c', `M196,${Y(160)} L196,${Y(210)}`)}
      ${ar(p, 'ink', `M290,${Y(232)} L334,${Y(232)}`)}${t(342, Y(240), 'sugar', 'sm fc10-b', 'start')}
      ${t(24, Y(198), 'light', 'sm fc10-amber', 'start')}${bolt(p, 36, Y(212), 180, Y(234))}`;
  };
  return svg(p, 'CAM in one cell. At night stomata open, PEPC fixes CO₂ and malic acid fills the vacuole while the Calvin–Benson cycle is off. By day stomata close, malate is decarboxylated and the CO₂ goes to RuBisCO, powered by light',
    half(4, true) + half(306, false));
}

/* ---------- 10B · space vs time: C₄ and CAM side by side (a panel that also fits C09) ---------- */

function spaceTimeSvg(): string {
  const p = 'fc10b';
  const col = (bx: number, cam: boolean): string => {
    const head = t(bx + 187, 68, cam ? 'CAM' : 'C₄', 'fc10-h');
    const box1 = `<rect class="${cam ? 'fc10-nightbg' : 'fc10-cell'}" x="${bx}" y="96" width="374" height="174" rx="20"/>`
      + (cam ? `${moon(bx + 30, 120, 12)}${t(bx + 52, 128, 'night', 'sm fc10-b', 'start')}` : t(bx + 20, 128, 'mesophyll cell', 'sm fc10-b', 'start'));
    const box2 = `<rect class="${cam ? 'fc10-daybg' : 'fc10-bs'}" x="${bx}" y="316" width="374" height="174" rx="20"/>`
      + (cam ? `${sun(bx + 30, 340, 9)}${t(bx + 58, 348, 'day, same cell', 'sm fc10-b', 'start')}` : t(bx + 20, 348, 'bundle-sheath cell', 'sm fc10-b', 'start'));
    const capture = `${co2(bx + 56, 200)}${ar(p, 'c', `M${bx + 84},200 L${bx + (cam ? 238 : 252)},200`)}
      ${t(bx + 158, 186, 'PEPC', 'sm fc10-teal fc10-b')}${t(bx + 158, 228, '+ PEP', 'sm fc10-teal')}`;
    const acid1 = cam
      ? `${vacuole(bx + 246, 156, 108, 96, 0.72)}${malate(bx + 300, 222, 7, 18)}${t(bx + 300, 146, 'stored acid', 'sm fc10-plum')}`
      : `${malate(bx + 300, 200)}${t(bx + 300, 176, 'C₄ acid', 'sm fc10-plum')}`;
    const link = cam
      ? `${ar(p, 'acid', `M${bx + 300},256 L${bx + 300},344`, 'fc10-dash')}${t(bx + 286, 300, 'stored until day', 'sm', 'end')}`
      : `${ar(p, 'acid', `M${bx + 300},212 L${bx + 300},382`)}${t(bx + 286, 300, 'moves to next cell', 'sm', 'end')}`;
    const acid2 = cam
      ? `${vacuole(bx + 246, 350, 108, 96, 0.16)}`
      : `${malate(bx + 300, 396)}`;
    const release = `${ar(p, 'acid', `M${bx + (cam ? 240 : 256)},396 L${bx + 188},396`)}${t(bx + (cam ? 202 : 212), 382, 'release', 'sm fc10-plum fc10-b')}
      ${co2(bx + 156, 396)}${ar(p, 'c', `M${bx + 156},410 L${bx + 156},436`)}${rubisco(bx + 156, 458)}`;
    return head + box1 + box2 + capture + acid1 + link + acid2 + release;
  };
  return svg(p, 'C₄ and CAM use the same steps: PEPC captures CO₂ into a C₄ acid, which later releases CO₂ to RuBisCO. C₄ separates the steps between two cells, CAM between night and day',
    `<g transform="translate(0,4)">${col(16, false)}${col(410, true)}
    ${num(400, 200, '1')}${num(400, 396, '2')}
    ${t(400, 544, 'Same chemistry: PEPC first, then RuBisCO', 'sm fc10-b')}</g>`);
}

/* ---------- 10C · 24-hour dial: the minimal summary ---------- */

function dialSvg(): string {
  const p = 'fc10c';
  const cx = 400, cy = 306, Ro = 240, Ri = 150, Rm = 195;
  const at = (deg: number, r: number): [number, number] => [cx + r * Math.cos((deg * Math.PI) / 180), cy + r * Math.sin((deg * Math.PI) / 180)];
  const ring = (top: boolean): string => top
    ? `M${cx - Ro},${cy} A${Ro},${Ro} 0 0 1 ${cx + Ro},${cy} L${cx + Ri},${cy} A${Ri},${Ri} 0 0 0 ${cx - Ri},${cy} Z`
    : `M${cx + Ro},${cy} A${Ro},${Ro} 0 0 1 ${cx - Ro},${cy} L${cx - Ri},${cy} A${Ri},${Ri} 0 0 0 ${cx + Ri},${cy} Z`;
  const [sx1, sy1] = at(-130, Rm), [sx2, sy2] = at(130, Rm), [ux, uy] = at(50, Rm);
  const [ca, cb] = at(-50, 270), [a0x, a0y] = at(-50, 248), [a1x, a1y] = at(-50, 160);
  const jar = (x: number, level: number): string => vacuole(x - 30, cy - 44, 60, 88, level, 14);
  return svg(p, '24-hour dial for a CAM plant. Night half: stomata open, CO₂ enters and the vacuole fills with malic acid from dusk to dawn. Day half: stomata closed, the acid empties from dawn to dusk and its CO₂ goes to RuBisCO', `
    <path class="fc10-nightbg" d="${ring(true)}"/><path class="fc10-daybg" d="${ring(false)}"/>
    <circle class="fc10-disc" cx="${cx}" cy="${cy}" r="${Ri}"/>
    ${moon(cx, cy - Rm, 20)}${sun(cx, cy + Rm, 16)}
    ${stoma(sx1, sy1, true)}${stoma(sx2, sy2, false)}
    ${co2(ca, cb, 11)}${ar(p, 'c', `M${f(a0x)},${f(a0y)} L${f(a1x)},${f(a1y)}`)}
    ${chip(ux, uy, 104, 'RuBisCO', 'fc10-rub')}
    ${jar(cx - 66, 0.1)}${jar(cx + 66, 0.8)}${t(cx, cy + 8, 'acid', 'sm fc10-plum fc10-b')}
    ${ar(p, 'acid', `M${cx - 66},${cy - 54} Q${cx},${cy - 112} ${cx + 60},${cy - 56}`)}
    ${t(cx, cy - 102, 'fills at night', 'sm fc10-plum')}
    ${ar(p, 'acid', `M${cx + 66},${cy + 54} Q${cx},${cy + 112} ${cx - 60},${cy + 56}`)}
    ${t(cx, cy + 120, 'empties by day', 'sm fc10-plum')}
    ${ar(p, 'c', `M${cx + 78},${cy + 52} L${f(ux - 20)},${f(uy - 22)}`)}
    ${t(cx - Ro - 12, cy + 8, 'dusk', 'sm fc10-b', 'end')}${t(cx + Ro + 12, cy + 8, 'dawn', 'sm fc10-b', 'start')}
    ${t(cx, 44, 'Night: stomata open', 'sm fc10-b')}
    ${t(cx, 584, 'Day: stomata closed', 'sm fc10-b')}`);
}

/* ---------- 10D · day–night traces: three schematic time courses ---------- */

function tracesSvg(): string {
  const p = 'fc10d';
  const X0 = 60, X1 = 770, X = (h: number): number => X0 + (h / 24) * (X1 - X0);
  const ss = (a: number, b: number, x: number): number => { const u = Math.min(1, Math.max(0, (x - a) / (b - a))); return u * u * (3 - 2 * u); };
  const uptake = (h: number): number => (h < 12.6 ? 0.92 * ss(0, 1.3, h) * (1 - 0.3 * h / 12) * (1 - ss(11, 12.6, h)) : 0) + 0.03;
  const acid = (h: number): number => (h <= 12 ? 0.08 + 0.84 * (h / 12) : 0.92 - 0.84 * ((h - 12) / 12));
  const fix = (h: number): number => (h > 12.4 && h < 23.6 ? 0.9 * Math.pow(Math.sin(Math.PI * (h - 12.4) / 11.2), 0.7) : 0);
  const strip = (top: number, fn: (h: number) => number, cls: string, label: string, right = false): string => {
    const base = top + 96, Y = (v: number): number => base - v * 78;
    const pts = Array.from({ length: 145 }, (_, k) => { const h = (k / 144) * 24; return `${f(X(h))},${f(Y(fn(h)))}`; });
    return `${right ? t(X1 - 10, top + 22, label, 'sm fc10-b', 'end') : t(X0 + 10, top + 22, label, 'sm fc10-b', 'start')}
      <path class="fc10-area ${cls}" d="M${X0},${base} L${pts.join(' L')} L${X1},${base} Z"/>
      <path class="fc10-trace ${cls}" d="M${pts.join(' L')}"/><path class="fc10-base" d="M${X0},${base} H${X1}"/>`;
  };
  const ticks = [['dusk', 0], ['midnight', 6], ['dawn', 12], ['noon', 18], ['dusk', 24]] as const;
  return svg(p, 'Schematic 24-hour time courses in a CAM leaf: CO₂ uptake from the air happens at night; malic acid in the vacuole rises through the night and falls through the day; RuBisCO fixes CO₂ by day', `
    <rect class="fc10-nightbg" x="${X0}" y="92" width="${X(12) - X0}" height="410"/>
    <rect class="fc10-daybg" x="${X(12)}" y="92" width="${X1 - X(12)}" height="410"/>
    ${moon(X(6) - 120, 62, 13)}${t(X(6) - 100, 70, 'night · stomata open', 'sm fc10-b', 'start')}
    ${sun(X(18) - 124, 62, 10)}${t(X(18) - 94, 70, 'day · stomata closed', 'sm fc10-b', 'start')}
    ${strip(100, uptake, 'fc10-tr-c', 'CO₂ taken up from the air', true)}
    ${strip(236, acid, 'fc10-tr-acid', 'malic acid in the vacuole')}
    ${strip(372, fix, 'fc10-tr-fix', 'CO₂ fixed by RuBisCO')}
    ${ticks.map(([s, h]) => `<path class="fc10-tick" d="M${f(X(h))},502 V512"/>${t(X(h), 538, s, 'tl', h === 0 ? 'start' : h === 24 ? 'end' : 'middle')}`).join('')}
    ${SCHEMATIC(770, 584)}`);
}

/* ---------- 10E · bakery shifts: the analogy, mapped label by label ---------- */

function bakerySvg(): string {
  const p = 'fc10e';
  const shop = (bx: number, night: boolean): string => {
    const wallL = bx + 70, wallR = bx + 340, top = 228, floor = 430;
    // Solar panel along the right roof slope, from 35 % to 85 % of the slope, lifted off the roof.
    const ax = bx + 205, ay = 138, dx = 149, dy = 90, L = Math.hypot(dx, dy), ox = dy / L, oy = -dx / L;
    const P = (s: number, o: number): string => `${f(ax + dx * s + ox * o)},${f(ay + dy * s + oy * o)}`;
    const panel = `<path class="${night ? 'fc10-panel fc10-off' : 'fc10-panel'}" d="M${P(0.3, 3)} L${P(0.84, 3)} L${P(0.84, 21)} L${P(0.3, 21)} Z"/>`
      + `<path class="fc10-panel-grid" d="M${P(0.48, 3)} L${P(0.48, 21)} M${P(0.66, 3)} L${P(0.66, 21)} M${P(0.3, 12)} L${P(0.84, 12)}"/>`;
    const sacks = (n: number): string => Array.from({ length: 6 }, (_, k) => {
      const x = bx + 146 + (k % 2) * 40, y = floor - 40 - Math.floor(k / 2) * 38;
      return k < n ? `<rect class="fc10-sack" x="${x}" y="${y}" width="34" height="30" rx="9"/><path class="fc10-sack-tie" d="M${x + 11},${y + 6} H${x + 23}"/>`
        : `<rect class="fc10-sack-empty" x="${x}" y="${y}" width="34" height="30" rx="9"/>`;
    }).join('');
    const oven = `<rect class="${night ? 'fc10-oven fc10-off' : 'fc10-oven'}" x="${bx + 248}" y="${floor - 92}" width="84" height="92" rx="10"/>`
      + `<rect class="${night ? 'fc10-oven-win' : 'fc10-oven-win fc10-hot'}" x="${bx + 262}" y="${floor - 70}" width="56" height="34" rx="6"/>`;
    const door = night
      ? `<rect class="fc10-doorway" x="${wallL - 3}" y="${floor - 90}" width="6" height="90"/><path class="fc10-door" d="M${wallL},${floor - 90} L${wallL - 30},${floor - 102} L${wallL - 30},${floor - 8} L${wallL},${floor} Z"/>`
      : `<rect class="fc10-door" x="${wallL - 6}" y="${floor - 90}" width="12" height="90" rx="2"/>`;
    const head = night
      ? `${moon(bx + 30, 38, 14)}${t(bx + 58, 47, 'Night shift', 'lab fc10-b', 'start')}`
      : `${sun(bx + 30, 38, 10)}${t(bx + 60, 47, 'Day shift', 'lab fc10-b', 'start')}`;
    const flows = night
      ? `${co2(bx + 34, floor - 150, 8)}${ar(p, 'c', `M${bx + 34},${floor - 138} Q${bx + 38},${floor - 46} ${bx + 136},${floor - 46}`)}`
      : `${ar(p, 'acid', `M${bx + 226},${floor - 46} L${bx + 244},${floor - 46}`)}${bolt(p, bx + 300, ay + 74, bx + 296, floor - 98)}
         <ellipse class="fc10-loaf" cx="${bx + 290}" cy="${floor - 106}" rx="26" ry="11"/>${sun(bx + 360, 94, 11)}`;
    const legend = night
      ? `${mapped(bx + 20, 470, 'door open', 'stomata open')}${mapped(bx + 20, 498, 'delivery', 'CO₂')}${mapped(bx + 20, 526, 'packing', 'PEPC')}
         ${mapped(bx + 20, 554, 'sacks', 'malic acid')}${mapped(bx + 20, 582, 'storeroom', 'vacuole')}`
      : `${mapped(bx + 20, 470, 'door shut', 'stomata closed')}${mapped(bx + 20, 498, 'unpacking', 'decarboxylation')}${mapped(bx + 20, 526, 'oven', 'RuBisCO, Calvin cycle')}
         ${mapped(bx + 20, 554, 'solar panel', 'light reactions')}${mapped(bx + 20, 582, 'bread', 'sugar')}`;
    return `<rect class="${night ? 'fc10-nightbg' : 'fc10-daybg'}" x="${bx}" y="4" width="392" height="592" rx="18"/>${head}
      <path class="fc10-roof" d="M${bx + 56},${top} L${ax},${ay} L${bx + 354},${top} Z"/>${panel}
      <rect class="fc10-house" x="${wallL}" y="${top}" width="${wallR - wallL}" height="${floor - top}"/>
      <rect class="fc10-store" x="${bx + 138}" y="${floor - 128}" width="90" height="128" rx="6"/>${sacks(night ? 6 : 1)}
      ${oven}${door}<path class="fc10-ground" d="M${bx + 14},${floor} H${bx + 378}"/>${flows}${legend}`;
  };
  return svg(p, 'Analogy: a bakery that takes deliveries at night through an open door and packs them into sacks in a storeroom; by day the door is shut, sacks are unpacked and a solar-powered oven bakes bread. Door = stomata, delivery = CO₂, packing = PEPC, sacks = malic acid, storeroom = vacuole, unpacking = decarboxylation, oven = RuBisCO and the Calvin–Benson cycle, solar panel = light reactions, bread = sugar',
    shop(4, true) + shop(404, false));
}

/* ---------- 10F · four steps: a numbered strip (storyboard) ---------- */

function stepsSvg(): string {
  const p = 'fc10f';
  const panel = (px: number, py: number, n: number): string => {
    const night = n <= 2, open = n <= 2;
    const titles = ['Dusk: stomata open', 'Night: PEPC fixes CO₂', 'Dawn: stomata close', 'Day: CO₂ goes to RuBisCO'];
    const caps = ['CO₂ diffuses in', 'malic acid fills the vacuole', 'water stays in the leaf', 'light powers the Calvin cycle'];
    const level = [0.1, 0.78, 0.78, 0.22][n - 1];
    const sx = px + 92, sy = py + 150;
    const leaf = `<rect class="fc10-leaf" x="${px + 92}" y="${py + 62}" width="${280}" height="${176}" rx="20"/>
      <rect class="fc10-cell" x="${px + 128}" y="${py + 74}" width="${232}" height="${152}" rx="18"/>
      ${vacuole(px + 230, py + 86, 118, 128, level, 16)}
      ${chloro(px + 176, py + 196, 36, 18, !night)}${stoma(sx, sy, open, 0.62)}`;
    const bg = `<rect class="${night ? 'fc10-nightbg' : 'fc10-daybg'}" x="${px}" y="${py}" width="388" height="290" rx="16"/>
      ${num(px + 26, py + 30, `${n}`)}${t(px + 50, py + 38, titles[n - 1], 'sm fc10-b', 'start')}
      ${night ? moon(px + 360, py + 30, 12) : sun(px + 360, py + 30, 9)}
      ${t(px + 20, py + 272, caps[n - 1], 'sm', 'start')}`;
    let act = '';
    if (n === 1) act = `${co2(px + 44, sy - 34, 8)}${ar(p, 'c', `M${px + 44},${sy - 22} Q${px + 52},${sy} ${px + 120},${sy}`)}
      ${t(px + 76, py + 198, 'stoma', 'fc10-t15 fc10-mute', 'end')}${t(px + 176, py + 170, 'chloroplast', 'fc10-t15 fc10-mute')}${t(px + 289, py + 154, 'vacuole', 'fc10-t15 fc10-mute')}`;
    if (n === 2) act = `${co2(px + 44, sy - 34, 8)}${ar(p, 'c', `M${px + 44},${sy - 22} Q${px + 52},${sy} ${px + 150},${sy}`)}
      ${t(px + 180, sy - 16, 'PEPC', 'sm fc10-teal fc10-b')}${malate(px + 186, sy, 6, 14)}${ar(p, 'acid', `M${px + 214},${sy} L${px + 236},${sy}`)}`;
    if (n === 3) act = `${drop(px + 140, sy + 6, 1.2)}${drop(px + 116, sy + 50, 1)}`;
    if (n === 4) act = `<path class="fc10-was" d="M${px + 237},${py + 113} H${px + 341}"/>
      ${ar(p, 'acid', `M${px + 232},${py + 176} Q${px + 200},${py + 150} ${px + 168},${py + 166}`)}${co2(px + 186, py + 132, 7)}
      ${bolt(p, px + 124, py + 52, px + 160, py + 178)}`;
    return bg + leaf + act;
  };
  return svg(p, 'Four steps of CAM: at dusk stomata open and CO₂ enters; at night PEPC fixes it and malic acid fills the vacuole; at dawn stomata close and water stays in; by day the acid releases CO₂ to RuBisCO and light powers the Calvin–Benson cycle',
    panel(6, 6, 1) + panel(406, 6, 2) + panel(6, 306, 3) + panel(406, 306, 4));
}

/* ---------- 10G · noon test: a C₃ leaf and a CAM leaf in the same midday sun ---------- */

function noonSvg(): string {
  const p = 'fc10g';
  const cells = (x0: number, y0: number, w: number, h: number, r: number): string => {
    const out: string[] = [];
    for (let y = y0 + r + 8, row = 0; y < y0 + h - r - 4; y += 2 * r + 4, row++)
      for (let x = x0 + r + 10 + (row % 2) * r; x < x0 + w - r - 6; x += 2 * r + 6) out.push(`<circle class="fc10-mcell" cx="${f(x)}" cy="${f(y)}" r="${r}"/>`);
    return out.join('');
  };
  /** Guard cells in a leaf section, cut into the lower surface: apart when open, touching when closed. */
  const guard = (x: number, y: number, open: boolean): string =>
    `<path class="fc10-gap" d="M${x - 30},${y} H${x + 30}"/><ellipse class="fc10-gc" cx="${x - (open ? 19 : 12)}" cy="${y}" rx="13" ry="9"/><ellipse class="fc10-gc" cx="${x + (open ? 19 : 12)}" cy="${y}" rx="13" ry="9"/>`;
  return svg(p, 'At noon a C₃ leaf keeps its stomata open, taking in CO₂ and losing water; a CAM leaf keeps them closed, keeps its water and fixes CO₂ stored as malic acid the night before', `<g transform="translate(0,26)">
    ${sun(400, 50, 20)}${t(436, 58, 'noon', 'sm fc10-b', 'start')}
    ${bolt(p, 376, 70, 290, 146)}${bolt(p, 424, 70, 520, 160)}
    ${t(40, 132, 'C₃ leaf', 'lab fc10-b', 'start')}
    <rect class="fc10-leaf" x="40" y="150" width="320" height="110" rx="26"/>${cells(40, 150, 320, 110, 18)}
    ${guard(200, 260, true)}${t(236, 252, 'stoma', 'fc10-t15 fc10-mute', 'start')}
    ${co2(140, 352, 10)}${ar(p, 'c', 'M150,336 Q170,296 190,272')}
    ${ar(p, 'water', 'M212,272 Q236,300 258,322')}
    ${drop(272, 340)}${drop(304, 372)}${drop(258, 392)}${drop(318, 418)}
    ${t(290, 452, 'water out', 'sm fc10-blue')}
    <g transform="translate(0,44)">${t(760, 102, 'CAM leaf', 'lab fc10-b', 'end')}
    <rect class="fc10-leaf" x="440" y="120" width="320" height="180" rx="44"/>${cells(440, 120, 320, 180, 27)}
    ${vacuole(466, 176, 96, 88, 0.45, 14)}${t(514, 228, 'acid', 'sm fc10-plum fc10-b')}
    ${chloro(668, 220, 60, 28)}${rubisco(668, 220, true, 104)}
    ${ar(p, 'acid', 'M566,220 L604,220')}
    ${guard(600, 300, false)}${t(636, 330, 'stoma', 'fc10-t15 fc10-mute', 'start')}</g>
    <path class="fc10-rule" d="M400,128 V520"/>
    ${t(200, 504, 'stomata open', 'sm fc10-b')}${t(200, 532, 'CO₂ from the air now', 'sm')}
    ${t(600, 504, 'stomata closed', 'sm fc10-b')}${t(600, 532, 'CO₂ stored last night', 'sm')}</g>`);
}

/* ---------- 10H · plant to acid: a zoom from the plant to the molecule ---------- */

function zoomSvg(): string {
  const p = 'fc10h';
  const leafPath = (x: number, y: number, ang: number, len: number, w: number): string => {
    const a = (ang * Math.PI) / 180, ux = Math.cos(a), uy = Math.sin(a), nx = -uy, ny = ux;
    const tip = [x + ux * len, y + uy * len], m = [x + ux * len * 0.45, y + uy * len * 0.45];
    return `<path class="fc10-succ" d="M${f(x + nx * w * 0.5)},${f(y + ny * w * 0.5)} Q${f(m[0] + nx * w)},${f(m[1] + ny * w)} ${f(tip[0])},${f(tip[1])} Q${f(m[0] - nx * w)},${f(m[1] - ny * w)} ${f(x - nx * w * 0.5)},${f(y - ny * w * 0.5)} Z"/>`;
  };
  const plant = [[-150, 96, 26], [-30, 96, 26], [-120, 112, 30], [-60, 120, 30], [-90, 128, 30]].map(([a, l, w]) => leafPath(150, 236, a, l, w)).join('');
  const clip = (id: string, x: number, y: number, r: number): string => `<clipPath id="${p}-${id}"><circle cx="${x}" cy="${y}" r="${r}"/></clipPath>`;
  // circle 2: leaf section with large cells
  const c2x = 560, c2y = 150, c2r = 118;
  const bigCells: string[] = [];
  for (let row = 0; row < 5; row++) for (let k = 0; k < 6; k++) {
    const x = c2x - 130 + k * 52 + (row % 2) * 26, y = c2y - 66 + row * 46;
    bigCells.push(`<circle class="fc10-mcell" cx="${x}" cy="${y}" r="22"/><circle class="fc10-vac-s" cx="${x}" cy="${y}" r="15"/>`);
  }
  // circle 3: one cell, its vacuole full of acid at dawn
  const c3x = 210, c3y = 432, c3r = 122;
  const chls = Array.from({ length: 9 }, (_, k) => {
    const a = -Math.PI / 2 + (k / 9) * Math.PI * 2, x = c3x + 92 * Math.cos(a), y = c3y + 92 * Math.sin(a);
    return `<ellipse class="fc10-chl" cx="${f(x)}" cy="${f(y)}" rx="11" ry="6" transform="rotate(${f((a * 180) / Math.PI + 90)} ${f(x)} ${f(y)})"/>`;
  }).join('');
  // circle 4: malic acid, HOOC–CH₂–CH(OH)–COOH, as atom balls
  const c4x = 636, c4y = 470, s = 0.95;
  const A: Record<string, [number, number, string]> = {
    c1: [-78, 10, 'C'], c2: [-26, -20, 'C'], c3: [26, 10, 'C'], c4: [78, -20, 'C'],
    o1: [-117, -12, 'O'], o2: [-78, 55, 'O'], h1: [-100, 70, 'H'], h2: [-41, -48, 'H'], h3: [-11, -48, 'H'],
    o3: [4, 50, 'O'], h4: [-16, 66, 'H'], h5: [42, 36, 'H'], o4: [78, -66, 'O'], o5: [117, 2, 'O'], h6: [139, -12, 'H'],
  };
  const P = (k: string): [number, number] => [c4x + A[k][0] * s, c4y + A[k][1] * s];
  const bond = (a: string, b: string, dbl = false): string => {
    const [x1, y1] = P(a), [x2, y2] = P(b);
    if (!dbl) return `<path class="fc10-bond" d="M${f(x1)},${f(y1)} L${f(x2)},${f(y2)}"/>`;
    const L = Math.hypot(x2 - x1, y2 - y1), ox = -(y2 - y1) / L * 3.5, oy = (x2 - x1) / L * 3.5;
    return `<path class="fc10-bond" d="M${f(x1 + ox)},${f(y1 + oy)} L${f(x2 + ox)},${f(y2 + oy)} M${f(x1 - ox)},${f(y1 - oy)} L${f(x2 - ox)},${f(y2 - oy)}"/>`;
  };
  const bonds = [['c1', 'c2'], ['c2', 'c3'], ['c3', 'c4'], ['c1', 'o2'], ['o2', 'h1'], ['c2', 'h2'], ['c2', 'h3'], ['c3', 'o3'], ['o3', 'h4'], ['c3', 'h5'], ['c4', 'o5'], ['o5', 'h6']]
    .map(([a, b]) => bond(a, b)).join('') + bond('c1', 'o1', true) + bond('c4', 'o4', true);
  const atoms = Object.keys(A).map(k => {
    const [x, y] = P(k), el = A[k][2], r = el === 'H' ? 7 : el === 'C' ? 12 : 11;
    return `<circle class="atom atom-${el}" cx="${f(x)}" cy="${f(y)}" r="${r}"/>` + (el === 'H' ? '' : `<text class="atom-t atom-t-${el}" x="${f(x)}" y="${f(y + 5)}" text-anchor="middle">${el}</text>`);
  }).join('');
  return svg(p, 'Zoom from a succulent CAM plant to a thick leaf with large cells, to one cell whose vacuole is full of malic acid at dawn, to the malic acid molecule with its four carbons', `
    ${clip('c2', c2x, c2y, c2r)}${clip('c3', c3x, c3y, c3r)}
    <path class="fc10-ground" d="M40,236 H260"/>${plant}
    <rect class="fc10-zoombox" x="186" y="150" width="34" height="34" rx="4"/>
    <path class="fc10-zoomline" d="M220,150 L${c2x - 92},${c2y - 74} M220,184 L${c2x - 96},${c2y + 72}"/>
    ${t(150, 290, 'succulent CAM plant', 'sm fc10-b')}
    <circle class="fc10-lens" cx="${c2x}" cy="${c2y}" r="${c2r}"/>
    <g clip-path="url(#${p}-c2)"><rect class="fc10-leaf" x="${c2x - c2r}" y="${c2y - c2r}" width="${2 * c2r}" height="${2 * c2r}"/>${bigCells.join('')}</g>
    <circle class="fc10-lens-ring" cx="${c2x}" cy="${c2y}" r="${c2r}"/>
    ${t(c2x + c2r + 8, c2y - 30, 'thick leaf,', 'sm fc10-b', 'start')}${t(c2x + c2r + 8, c2y - 4, 'large cells', 'sm fc10-b', 'start')}
    <rect class="fc10-zoombox" x="${c2x - 52}" y="${c2y + 2}" width="48" height="48" rx="4"/>
    <path class="fc10-zoomline" d="M${c2x - 52},${c2y + 50} L${c3x + 76},${c3y - 96}"/>
    <circle class="fc10-lens" cx="${c3x}" cy="${c3y}" r="${c3r}"/>
    <g clip-path="url(#${p}-c3)"><circle class="fc10-cell" cx="${c3x}" cy="${c3y}" r="108"/><circle class="fc10-vac" cx="${c3x}" cy="${c3y}" r="82"/>
    <circle class="fc10-acid" cx="${c3x}" cy="${c3y}" r="76"/>${malate(c3x - 26, c3y - 22, 6, 13)}${malate(c3x + 22, c3y + 4, 6, 13)}${malate(c3x - 14, c3y + 34, 6, 13)}${chls}</g>
    <circle class="fc10-lens-ring" cx="${c3x}" cy="${c3y}" r="${c3r}"/>
    ${t(c3x + c3r + 14, c3y - 86, 'one cell at dawn:', 'sm fc10-b', 'start')}
    ${lines(c3x + c3r + 14, c3y - 60, ['vacuole full', 'of malic acid'], 'sm fc10-plum', 'start')}
    <path class="fc10-zoomline" d="M${c3x + 54},${c3y + 30} L${c4x - 132},${c4y + 30}"/>
    ${bonds}${atoms}
    ${t(c4x, c4y + 104, 'malic acid: 4 carbons', 'sm fc10-b')}`);
}

/* ---------- 10I · the purslane exception: C₄ and CAM in the same cells ---------- */

function purslaneSvg(): string {
  const p = 'fc10i';
  return svg(p, 'Purslane (Portulaca) runs C₄ by day and, under drought, adds CAM at night in the same mesophyll cells; acid stored at night probably feeds the C₄ cycle next day', `
    ${t(400, 40, 'Purslane (Portulaca) runs both, in the same cells', 'lab fc10-b')}
    <rect class="fc10-cell" x="24" y="72" width="476" height="420" rx="26"/>${t(44, 104, 'mesophyll cell', 'sm fc10-b', 'start')}
    <rect class="fc10-bs" x="516" y="72" width="260" height="420" rx="26"/>${t(534, 104, 'bundle-sheath cell', 'sm fc10-b', 'start')}
    <rect class="fc10-daybg" x="40" y="122" width="444" height="112" rx="16"/><rect class="fc10-daybg" x="532" y="122" width="228" height="190" rx="16"/>
    ${sun(64, 150, 9)}${t(92, 158, 'by day: C₄', 'sm fc10-b', 'start')}
    ${co2(80, 200)}${ar(p, 'c', 'M106,200 L226,200')}${t(166, 188, 'PEPC', 'sm fc10-teal fc10-b')}
    ${malate(290, 200)}${ar(p, 'acid', 'M336,200 L566,200')}${t(410, 188, 'C₄ acid moves', 'sm fc10-plum')}
    ${t(608, 160, 'release', 'sm fc10-plum fc10-b')}${co2(608, 200)}${ar(p, 'c', 'M634,200 L652,200')}
    ${rubisco(704, 200, true, 100)}
    <rect class="fc10-nightbg" x="40" y="254" width="444" height="222" rx="16"/>
    ${moon(64, 284, 12)}${t(86, 292, 'night, under drought: CAM', 'sm fc10-b', 'start')}
    ${co2(80, 370)}${ar(p, 'c', 'M106,370 L226,370')}${t(166, 358, 'PEPC', 'sm fc10-teal fc10-b')}
    ${malate(290, 370)}${ar(p, 'acid', 'M336,370 L366,370')}
    ${vacuole(372, 318, 96, 142, 0.7, 16)}${t(420, 352, 'vacuole', 'fc10-t15 fc10-mute')}
    ${ar(p, 'acid', 'M420,314 Q420,250 330,214', 'fc10-dash')}
    ${lines(534, 360, ['next day the', 'stored acid', 'probably joins', 'the C₄ cycle'], 'sm', 'start')}
    ${t(400, 538, '', 'sm fc10-b')}
    ${t(400, 572, 'Moreno-Villena et al. 2022 · Koch & Kennedy 1980', 'fc10-n')}`);
}

/* ---------- 10J · equation by the clock: CO₂ arrives at night, light by day ---------- */

function equationSvg(): string {
  const p = 'fc10j';
  const term = (x: number, s: string, cls = ''): string => t(x, 72, s, `fc10-eq${cls ? ` ${cls}` : ''}`);
  const box = (x: number, w: number, cls: string): string => `<rect class="${cls}" x="${x - w / 2}" y="40" width="${w}" height="46" rx="12"/>`;
  return svg(p, 'The photosynthesis equation in a CAM plant, with light over the reaction arrow: the CO₂ term arrives at night and is stored as malic acid; the light arrives by day; the stored acid bridges the two, and sugar is made by day', `<g transform="translate(0,14)">
    ${box(66, 92, 'fc10-nightbg')}<rect class="fc10-daybg" x="292" y="28" width="76" height="30" rx="10"/>${box(486, 128, 'fc10-sugarbg')}
    ${term(66, '6 CO₂', 'fc10-brown')}${term(130, '+')}${term(198, '12 H₂O')}
    ${ar(p, 'ink', 'M262,63 L402,63')}${t(330, 50, 'light', 'sm fc10-amber fc10-b')}
    ${term(486, 'C₆H₁₂O₆', 'fc10-brown')}${term(572, '+')}${term(626, '6 O₂')}${term(680, '+')}${term(742, '6 H₂O')}
    <rect class="fc10-nightbg" x="24" y="190" width="276" height="290" rx="18"/>
    <rect class="fc10-daybg" x="300" y="190" width="476" height="290" rx="18"/>
    ${moon(272, 216, 12)}${t(252, 224, 'night', 'sm fc10-b', 'end')}${sun(676, 216, 10)}${t(704, 224, 'day', 'sm fc10-b', 'start')}
    ${ar(p, 'c', 'M66,92 L66,234')}${t(80, 128, 'CO₂ at night', 'sm', 'start')}
    ${stoma(66, 270, true, 0.8)}${t(98, 278, 'stomata open', 'sm', 'start')}
    ${ar(p, 'c', 'M66,302 L66,370 Q66,400 94,400')}${t(80, 346, 'PEPC', 'sm fc10-teal fc10-b', 'start')}
    ${malate(140, 400)}${ar(p, 'acid', 'M186,400 L244,400')}
    ${vacuole(250, 330, 100, 130, 0.62, 18)}${t(300, 412, 'malic', 'sm fc10-plum fc10-b')}${t(300, 436, 'acid', 'sm fc10-plum fc10-b')}
    ${ar(p, 'acid', 'M354,400 L404,400')}${t(384, 384, 'release', 'fc10-t15 fc10-plum')}${co2(432, 400, 9)}
    ${ar(p, 'c', 'M432,386 L432,322')}${chloro(432, 300, 70, 26)}${rubisco(432, 300, true, 104)}
    ${ar(p, 'amber', 'M334,80 L404,276')}${t(338, 168, 'light by day', 'sm fc10-amber', 'end')}
    ${ar(p, 'ink', 'M462,276 L490,92')}${t(494, 168, 'sugar', 'sm fc10-brown', 'start')}
    ${stoma(700, 330, false, 0.8)}${t(700, 386, 'stomata', 'sm')}${t(700, 410, 'closed', 'sm')}
    ${t(400, 534, 'Malic acid stored at night releases CO₂ by day', 'sm fc10-b')}</g>`);
}

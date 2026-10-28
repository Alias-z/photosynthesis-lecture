// Slide L15 · From photons to the light-response curve. Draft context, checked in
// research/review-2026-10-23-claude/C_L12-L15.md (rows 41–53) and REVIEW_SUMMARY.md (essential 11, story 16).
// Every curve is schematic and says so, except the slopes in 15G. Numbers used, and no others:
// quantum yield 0.052 (C₃, air), 0.073 (C₃, 2 % O₂) and ≈ 0.053 (C₄, both), mol CO₂ per mol absorbed
// photons at 30 °C (Ehleringer & Björkman 1977); air is 21 % O₂.
import { bolt, illusHeads, molecule, tag, water } from '../illus';
import { text as t, wave } from '../mechanisms';
import type { PlateText, Variant } from '../types';
import './l15.css';

export const PLATE: PlateText = {
  n: '15',
  title: 'From photons to the light-response curve',
  status: 'draft',
  lead: 'A light-response curve plots a leaf’s net CO₂ uptake against light: photons limit uptake in dim light, downstream steps in bright light.',
  points: [
    { claim: 'The initial slope is the quantum yield.', text: 'CO₂ fixed per photon absorbed; low O₂ steepens it in C₃ leaves.' },
    { claim: 'Downstream steps set the plateau.', text: 'Electron transport, Rubisco or sugar export limit CO₂ uptake while pigments still absorb.' },
    { claim: 'Real curves bend smoothly.', text: 'Blackman (1905) drew a sharp corner; in leaves the limits overlap.' },
  ],
  refs: [
    { label: 'Blackman 1905', url: 'https://doi.org/10.1093/oxfordjournals.aob.a089000' },
    { label: 'Ehleringer & Björkman 1977', url: 'https://doi.org/10.1104/pp.59.1.86' },
    { label: 'Ögren & Evans 1993', url: 'https://doi.org/10.1007/BF00195075' },
    { label: 'Yin et al. 2021', url: 'https://doi.org/10.1111/pce.14070' },
  ],
};

export const VARIANTS: Variant[] = [
  { id: 'a', name: 'Two regimes' },
  { id: 'b', name: 'Funnel and pipe', anim: true },
  { id: 'c', name: 'Leaf layers', anim: true },
  { id: 'd', name: 'Corner vs bend' },
  { id: 'e', name: 'Turn up light', anim: true },
  { id: 'f', name: 'Supply line' },
  { id: 'g', name: 'Low-O₂ test' },
  { id: 'h', name: 'Equation hand-over' },
  { id: 'i', name: 'Lecture recap' },
  { id: 'j', name: 'Unused light' },
];

export function draw(id: string): string {
  switch (id) {
    case 'b': return funnelSvg();
    case 'c': return layersSvg();
    case 'd': return cornerSvg();
    case 'e': return stepsSvg();
    case 'f': return supplySvg();
    case 'g': return lowO2Svg();
    case 'h': return equationSvg();
    case 'i': return recapSvg();
    case 'j': return unusedSvg();
    default: return regimesSvg();
  }
}

/* ---------- shared parts ---------- */

type K = 'ink' | 'grey' | 'amber' | 'brown' | 'red' | 'c' | 'j' | 'p';
const KS: K[] = ['ink', 'grey', 'amber', 'brown', 'red', 'c', 'j', 'p'];
type Anchor = 'start' | 'middle' | 'end';

/** Arrowheads in each ink, prefixed per figure. */
const defs = (p: string): string =>
  `<defs>${KS.map(k => `<marker id="${p}-k-${k}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path class="fl15-hd-${k}" d="M0,0L10,5L0,10z"/></marker>`).join('')}</defs>`;

const ar = (p: string, k: K, d: string, cls = ''): string =>
  `<path class="fl15-ar fl15-k-${k}${cls ? ` ${cls}` : ''}" d="${d}" marker-end="url(#${p}-k-${k})"/>`;

const svg = (p: string, label: string, body: string, extra = ''): string =>
  `<svg class="fig-svg fl15" viewBox="0 0 800 600" role="img" aria-label="${label}">${defs(p)}${extra}${body}</svg>`;

/** Heat: a grey wavy arrow. */
const heat = (p: string, x0: number, y0: number, x1: number, y1: number, amp = 5, n = 3): string =>
  `<path class="fl15-heat" d="${wave(x0, y0, x1, y1, amp, n)}" marker-end="url(#${p}-k-grey)"/>`;

const num = (x: number, y: number, n: string, r = 15): string =>
  `<circle class="fl15-num" cx="${x}" cy="${y}" r="${r}"/>${t(x, y + 6.5, n, 'fl15-num-t')}`;

/** Lines of text under one another. */
const lines = (x: number, y: number, ss: string[], cls: string, anchor: Anchor = 'start', dy = 27): string =>
  ss.map((s, i) => t(x, y + i * dy, s, cls, anchor)).join('');

/** A horizontal curly brace from x0 to x1; d > 0 points its tip down. */
function hBrace(x0: number, x1: number, y: number, d: number, cls: string): string {
  const m = (x0 + x1) / 2, s = Math.sign(d) * Math.min(Math.abs(d), 12);
  return `<path class="${cls}" d="M${x0},${y} Q${x0},${y + s} ${x0 + Math.abs(s)},${y + s} L${m - Math.abs(s)},${y + s} Q${m},${y + s} ${m},${y + 2 * s} Q${m},${y + s} ${m + Math.abs(s)},${y + s} L${x1 - Math.abs(s)},${y + s} Q${x1},${y + s} ${x1},${y}"/>`;
}

/** A sun whose rays count the light level; no rays = lights off. */
function sun(x: number, y: number, rays: number, r = 13): string {
  if (!rays) return `<circle class="fl15-sun-off" cx="${x}" cy="${y}" r="${r}"/>`;
  const rs = Array.from({ length: rays }, (_, k) => {
    const a = (k / rays) * Math.PI * 2, c = Math.cos(a), s = Math.sin(a);
    return `M${(x + c * (r + 5)).toFixed(1)},${(y + s * (r + 5)).toFixed(1)} L${(x + c * (r + 13)).toFixed(1)},${(y + s * (r + 13)).toFixed(1)}`;
  }).join('');
  return `<path class="fl15-ray" d="${rs}"/><circle class="fl15-sun" cx="${x}" cy="${y}" r="${r}"/>`;
}

/* ---------- the schematic light response ---------- */

/** Gross rate as a non-rectangular hyperbola: initial slope phi, ceiling pm, curvature th (1 = sharp corner). */
function nrh(i: number, phi: number, pm: number, th: number): number {
  const b = phi * i + pm;
  return (b - Math.sqrt(Math.max(0, b * b - 4 * th * phi * i * pm))) / (2 * th);
}
const PHI = 4, PM = 1, TH = 0.88, RD = 0.08;
/** Net CO₂ uptake: gross minus a small loss, so it starts just below zero. */
const net = (i: number): number => nrh(i, PHI, PM, TH) - RD;
const CAP = PM - RD;

interface Plot { x0: number; x1: number; y0: number; yTop: number; X: (i: number) => number; Y: (a: number) => number }
/** Light 0…imax runs x0→x1; uptake 0…aTop runs y0 (the zero line) → yTop. */
const plot = (x0: number, x1: number, y0: number, yTop: number, aTop = 1, imax = 1): Plot =>
  ({ x0, x1, y0, yTop, X: i => x0 + (i / imax) * (x1 - x0), Y: a => y0 - (a / aTop) * (y0 - yTop) });

function trace(pl: Plot, f: (i: number) => number, from: number, to: number, n = 90, move = true): string {
  const pts: string[] = [];
  for (let k = 0; k <= n; k++) {
    const i = from + ((to - from) * k) / n;
    pts.push(`${k || !move ? 'L' : 'M'}${pl.X(i).toFixed(1)},${pl.Y(f(i)).toFixed(1)}`);
  }
  return pts.join('');
}

/** Axes with arrow ends: y rises from yBot, x runs along the zero line. */
function axes(p: string, pl: Plot, xl: string, yl: string, yBot = pl.y0, cls = 'tl', xlY = yBot + 38): string {
  return `<path class="fl15-ax" d="M${pl.x0},${yBot} V${pl.yTop - 24}" marker-end="url(#${p}-k-grey)"/>`
    + `<path class="fl15-ax" d="M${pl.x0},${pl.y0} H${pl.x1 + 24}" marker-end="url(#${p}-k-grey)"/>`
    + (xl ? t((pl.x0 + pl.x1) / 2, xlY, xl, cls) : '')
    + (yl ? `<text class="${cls}" transform="translate(${pl.x0 - 20} ${(pl.y0 + pl.yTop) / 2}) rotate(-90)" text-anchor="middle">${yl}</text>` : '');
}

/** Stroke gradient from amber (photon-limited) to brown (capacity-limited) along x. */
const grad = (p: string, xa: number, xb: number): string =>
  `<defs><linearGradient id="${p}-g" gradientUnits="userSpaceOnUse" x1="${xa}" y1="0" x2="${xb}" y2="0"><stop offset="0" class="fl15-s-amber"/><stop offset="1" class="fl15-s-brown"/></linearGradient></defs>`;

const gcurve = (p: string, d: string, cls = 'fl15-curve-g'): string => `<path class="${cls}" style="stroke:url(#${p}-g)" d="${d}"/>`;

const SCHEMATIC = (x = 784, y = 590): string => t(x, y, 'schematic', 'fl15-cr', 'end');

/* ---------- 15A · two regimes: the labelled curve ---------- */

function regimesSvg(): string {
  const p = 'fl15a', pl = plot(130, 740, 470, 150);
  const iTan = (1 + RD) / PHI;
  return svg(p, 'Schematic light-response curve: photons limit the initial slope; downstream capacity limits the plateau; the curve bends where both limit', `
    ${axes(p, pl, 'light: photon flux (PPFD) →', 'net CO₂ uptake →', 500)}
    <path class="fl15-slope" d="M${pl.X(0)},${pl.Y(-RD)} L${pl.X(iTan).toFixed(1)},${pl.Y(1)}"/>
    <path class="fl15-cap" d="M${pl.X(0.22)},${pl.Y(CAP)} H${pl.x1}"/>
    ${gcurve(p, trace(pl, net, 0, 1))}
    ${t(740, 104, 'downstream steps limit', 'lab fl15-b fl15-brown', 'end')}
    ${hBrace(450, 740, 128, 12, 'fl15-brace fl15-brace-brown')}
    ${t(266, 352, 'photons limit', 'lab fl15-b fl15-amber', 'start')}
    ${t(pl.X(0.38), pl.Y(0.6), 'both limit', 'sm', 'start')}
    ${t(146, 496, 'below zero: respiration exceeds fixation', 'fl15-t15 fl15-grey', 'start')}
    ${SCHEMATIC(740, 580)}`, grad(p, pl.X(0.12), pl.X(0.55)));
}

/* ---------- 15B · funnel and pipe: the analogy ---------- */

function funnelSvg(): string {
  const p = 'fl15b';
  const top = 168, nTop = 292, nBot = 400, rim = 95, neck = 10, outEnd = 512;
  const scene = (cx: number, bright: boolean): string => {
    const bolts = (bright ? [-72, -36, 0, 36, 72] : [-30, 26]).map(dx => bolt(p, cx + dx - 16, 62, cx + dx + 6, top - 8)).join('');
    const funnel = `M${cx - rim},${top} L${cx - neck},${nTop} V${nBot} M${cx + neck},${nBot} V${nTop} L${cx + rim},${top}`;
    const full = `M${cx - rim + 5},${top + 3} L${cx - neck + 2},${nTop} V${outEnd} H${cx + neck - 2} V${nTop} L${cx + rim - 5},${top + 3} Z`;
    const trickle = `M${cx - 4},${top - 4} H${cx + 4} V${outEnd} H${cx - 4} Z`;
    const spill = bright ? heat(p, cx + rim + 4, top + 2, cx + rim + 44, top + 64, 6, 4) + heat(p, cx - rim - 4, top + 2, cx - rim - 44, top + 64, 6, 4) : '';
    return `${bolts}<path class="fl15-fill" d="${bright ? full : trickle}"/><path class="fl15-funnel" d="${funnel}"/>${spill}`
      + `<path class="fl15-fill" d="M${cx - (bright ? neck - 2 : 4)},${outEnd} L${cx},${outEnd + 14} L${cx + (bright ? neck - 2 : 4)},${outEnd} Z"/>`;
  };
  const row = (y: number, a: string, b: string): string => t(400, y, a, 'note') + t(400, y + 28, b, 'sm fl15-b');
  return svg(p, 'Analogy: photons pour into a funnel that drains through a narrow pipe. In dim light everything passes; in bright light the pipe limits the output and the surplus spills as heat', `
    ${t(160, 34, 'dim light', 'lab fl15-b')}${t(640, 34, 'bright light', 'lab fl15-b')}
    ${scene(160, false)}${scene(640, true)}
    ${row(96, 'inflow', 'photons absorbed')}
    ${row(206, 'spill', 'heat (NPQ)')}
    ${row(336, 'narrow pipe', 'downstream capacity')}
    ${row(470, 'outflow', 'CO₂ uptake')}
    ${t(160, 570, 'output follows the light', 'sm fl15-b')}${t(640, 570, 'the pipe sets the output', 'sm fl15-b')}`, illusHeads(p));
}

/* ---------- 15C · leaf layers: the curve is a sum ---------- */

function layersSvg(): string {
  const p = 'fl15c';
  // Schematic: the top, middle and bottom layers absorb 50, 30 and 20 % of the light; each has the same capacity.
  const share = [0.5, 0.3, 0.2], cap = 1 / 3, imax = 0.75;
  const r = (k: number, i: number): number => nrh(i * share[k], PHI, cap, 0.98);
  const cum = (k: number, i: number): number => share.slice(0, k + 1).reduce((s, _, m) => s + r(m, i), 0);
  const pl = plot(440, 740, 470, 140, 1.05, imax);
  const band = (k: number): string => {
    const up = trace(pl, i => cum(k, i), 0, imax);
    const lo = k ? trace(pl, i => cum(k - 1, i), imax, 0, 90, false) : `L${pl.X(imax)},${pl.y0} L${pl.x0},${pl.y0}`;
    return `<path class="fl15-band fl15-band${k + 1}" d="${up}${lo}Z"/>`;
  };
  const labs = ['top cells', 'middle cells', 'bottom cells'].map((s, k) => {
    const y = pl.Y((cum(k, imax) + (k ? cum(k - 1, imax) : 0)) / 2) + 8;
    return num(pl.X(imax) - 168, y - 7, `${k + 1}`, 13) + t(pl.X(imax) - 146, y, s, 'sm fl15-b', 'start');
  }).join('');
  // Leaf cross-section, three cell layers between two epidermes.
  const L = 34, R = 262, lay = [[136, 236], [248, 346], [358, 452]];
  const pal = Array.from({ length: 7 }, (_, k) => `<rect class="fl15-cell" x="${L + 4 + k * 32}" y="${lay[0][0]}" width="28" height="${lay[0][1] - lay[0][0]}" rx="12"/>`
    + [0.2, 0.45, 0.7].map(f => `<ellipse class="fl15-chl" cx="${L + 9 + k * 32}" cy="${lay[0][0] + f * 100}" rx="4" ry="7"/><ellipse class="fl15-chl" cx="${L + 27 + k * 32}" cy="${lay[0][0] + (f + 0.12) * 100}" rx="4" ry="7"/>`).join('')).join('');
  const spongy = (y0: number, y1: number, flip: number): string => Array.from({ length: 5 }, (_, k) => {
    const cx = L + 26 + k * 44, cy = (y0 + y1) / 2 + (k % 2 ? 10 : -10) * flip;
    return `<ellipse class="fl15-cell" cx="${cx}" cy="${cy}" rx="20" ry="${(y1 - y0) / 2 - 12}"/><ellipse class="fl15-chl" cx="${cx - 11}" cy="${cy}" rx="4" ry="6"/><ellipse class="fl15-chl" cx="${cx + 11}" cy="${cy - 6}" rx="4" ry="6"/>`;
  }).join('');
  const depth = ['bright', 'dimmer', 'dimmest'].map((s, k) => num(L - 18, (lay[k][0] + lay[k][1]) / 2, `${k + 1}`, 13) + t(R + 14, (lay[k][0] + lay[k][1]) / 2 + 8, s, 'sm', 'start')).join('');
  return svg(p, 'Schematic: light fades with depth in a leaf, so the top cells saturate first and deeper cells keep gaining; the leaf curve is the sum of the layers and bends gradually', `
    <defs><linearGradient id="${p}-fade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="fl15-fade0"/><stop offset="1" class="fl15-fade1"/></linearGradient></defs>
    <rect class="fl15-epi" x="${L}" y="${lay[0][0] - 14}" width="${R - L}" height="10" rx="4"/><rect class="fl15-epi" x="${L}" y="${lay[2][1] + 4}" width="${R - L}" height="10" rx="4"/>
    ${pal}${spongy(lay[1][0], lay[1][1], 1)}${spongy(lay[2][0], lay[2][1], -1)}
    <rect x="${L}" y="${lay[0][0] - 14}" width="${R - L}" height="${lay[2][1] - lay[0][0] + 28}" fill="url(#${p}-fade)" rx="6"/>
    ${[60, 130, 200].map(x => bolt(p, x - 14, 34, x + 8, lay[0][0] - 20)).join('')}
    ${t(R + 14, 70, 'light', 'lab fl15-b fl15-amber', 'start')}
    ${depth}
    ${axes(p, pl, 'light on the leaf →', 'CO₂ uptake →')}
    ${band(0)}${band(1)}${band(2)}
    <path class="fl15-curve" d="${trace(pl, i => cum(2, i), 0, imax)}"/>
    ${labs}
    ${t(pl.x0 + 16, pl.yTop - 8, 'leaf curve = sum of the layers', 'sm fl15-b', 'start')}
    ${t(400, 556, 'Top cells saturate first; deeper cells still gain.', 'sm')}
    ${SCHEMATIC(784, 590)}`, illusHeads(p));
}

/* ---------- 15D · Blackman's corner vs the real bend ---------- */

function cornerSvg(): string {
  const p = 'fl15d', slope = 2.4, cap = 0.82;
  const panel = (x0: number, real: boolean): string => {
    const pl = plot(x0, x0 + 290, 430, 170, 1);
    const ic = cap / slope;
    const iTop = (cap + 0.16) / slope;
    const ghosts = `<path class="fl15-slope" d="M${pl.X(0)},${pl.Y(0)} L${pl.X(iTop).toFixed(1)},${pl.Y(iTop * slope).toFixed(1)}"/><path class="fl15-cap" d="M${pl.X(0.12)},${pl.Y(cap)} H${pl.x1}"/>`;
    const body = real
      ? `<rect class="fl15-zone" x="${pl.X(0.2)}" y="${pl.yTop - 6}" width="${pl.X(0.62) - pl.X(0.2)}" height="${pl.y0 - pl.yTop + 6}" rx="6"/>${ghosts}
         <path class="fl15-curve" d="${trace(pl, i => nrh(i, slope, cap, 0.7), 0, 1)}"/>
         ${t(pl.X(0.41), pl.y0 - 14, 'both limit', 'sm fl15-b')}`
      : `${ghosts}<path class="fl15-curve" d="M${pl.X(0)},${pl.Y(0)} L${pl.X(ic).toFixed(1)},${pl.Y(cap)} H${pl.x1}"/>
         <circle class="fl15-corner" cx="${pl.X(ic).toFixed(1)}" cy="${pl.Y(cap)}" r="9"/>${t(pl.X(ic) + 16, pl.Y(cap) + 34, 'sharp switch', 'sm fl15-b', 'start')}`;
    const keys = real ? '' : `${t(pl.X(0.22), pl.Y(0.36), 'light', 'sm fl15-amber fl15-b', 'start')}${t(pl.X(0.22), pl.Y(0.36) + 24, 'limits', 'sm fl15-amber fl15-b', 'start')}
      ${t(pl.x1, pl.Y(cap) - 14, 'another limit', 'sm fl15-brown fl15-b', 'end')}`;
    return `${axes(p, pl, 'light →', 'rate →', pl.y0, 'tl', 470)}${body}${keys}`;
  };
  return svg(p, 'Schematic. Then and now: Blackman (1905) drew a sharp switch from one limiting factor to the next; real leaves bend smoothly because the limits overlap', `<g transform="translate(0 -14)">
    ${t(215, 112, '1905 · Blackman', 'lab fl15-b')}
    ${t(605, 112, 'Real leaves', 'lab fl15-b')}
    ${panel(70, false)}${panel(460, true)}
    <path class="fl15-div" d="M400,90 V500"/>
    ${t(605, 512, 'after Ögren & Evans 1993', 'fl15-cr')}
    ${SCHEMATIC(784, 556)}</g>`);
}

/* ---------- 15E · turn up the light: four steps ---------- */

function stepsSvg(): string {
  const p = 'fl15e', W = 372, H = 262;
  const steps = [
    { i: 0, rays: 0, title: 'darkness', cap: ['respiration releases CO₂'] },
    { i: 0.11, rays: 4, title: 'dim light', cap: ['photons limit'] },
    { i: 0.3, rays: 8, title: 'brighter', cap: ['both limit'] },
    { i: 0.88, rays: 12, title: 'bright light', cap: ['downstream steps limit;', 'excess light → heat'] },
  ];
  const panel = (k: number): string => {
    const s = steps[k], px = 20 + (k % 2) * (W + 16), py = 20 + Math.floor(k / 2) * (H + 16);
    const pl = plot(px + 40, px + W - 34, py + 180, py + 76, 1);
    const at = s.i ? trace(pl, net, 0, s.i, 40) : '';
    const extra = k === 1 ? `<path class="fl15-slope" d="M${pl.X(0)},${pl.Y(-RD)} L${pl.X(0.24).toFixed(1)},${pl.Y(0.24 * PHI - RD).toFixed(1)}"/>`
      : k === 3 ? [-70, -44, -18].map(dx => heat(p, pl.X(s.i) + dx, pl.Y(net(s.i)) - 10, pl.X(s.i) + dx - 12, pl.Y(net(s.i)) - 44)).join('') : '';
    return `${grad(`${p}${k}`, pl.X(0.08), pl.X(0.5))}<rect class="box" x="${px}" y="${py}" width="${W}" height="${H}" rx="18"/>
      ${num(px + 30, py + 34, `${k + 1}`)}${t(px + 54, py + 42, s.title, 'lab fl15-b', 'start')}${sun(px + W - 38, py + 36, s.rays)}
      <path class="fl15-ax" d="M${pl.x0},${pl.y0 + 16} V${pl.yTop - 12}" marker-end="url(#${p}-k-grey)"/><path class="fl15-ax" d="M${pl.x0},${pl.y0} H${pl.x1 + 12}" marker-end="url(#${p}-k-grey)"/>
      ${t(pl.x1 + 10, pl.y0 - 8, 'light', 'fl15-t15 fl15-grey', 'end')}<text class="fl15-t15 fl15-grey" transform="translate(${pl.x0 - 10} ${pl.yTop + 30}) rotate(-90)" text-anchor="middle">CO₂ uptake</text>
      <path class="fl15-ghost" d="${trace(pl, net, 0, 1, 60)}"/>
      ${at ? gcurve(`${p}${k}`, at) : ''}${extra}
      <circle class="fl15-dot" cx="${pl.X(s.i).toFixed(1)}" cy="${pl.Y(net(s.i)).toFixed(1)}" r="8"/>
      ${lines(px + 24, py + 220, s.cap, 'sm', 'start', 26)}`;
  };
  return svg(p, 'Four steps as the light is turned up: darkness gives net CO₂ release, dim light is photon-limited, brighter light is co-limited, bright light is limited by downstream steps with the surplus shed as heat',
    `${[0, 1, 2, 3].map(panel).join('')}${SCHEMATIC(784, 592)}`);
}

/* ---------- 15F · supply line: where each limit sits (thesis style) ---------- */

function supplySvg(): string {
  const p = 'fl15f';
  const mTop = 330, mBot = 390, h = mBot - mTop;
  const ps = (x: number, label: string): string =>
    `<rect class="fl15-ant" x="${x - 52}" y="${mTop - 26}" width="104" height="${h + 52}" rx="30"/><rect class="blob-ps" x="${x - 36}" y="${mTop - 10}" width="72" height="${h + 20}" rx="20"/>${t(x, (mTop + mBot) / 2 + 8, label, 'sm fl15-b')}`;
  const atps = (x: number): string =>
    `<rect class="blob-stalk" x="${x - 12}" y="${mTop - 8}" width="24" height="${h + 22}" rx="9"/><circle class="blob-atp" cx="${x - 15}" cy="${mTop - 26}" r="19"/><circle class="blob-atp" cx="${x + 15}" cy="${mTop - 26}" r="19"/><circle class="blob-atp" cx="${x}" cy="${mTop - 50}" r="19"/>`;
  const membrane = `<defs><pattern id="${p}-lip" width="14" height="${h}" patternUnits="userSpaceOnUse" x="30" y="${mTop}"><path class="lip-tail" d="M5,8 V${h * 0.42} M9,8 V${h * 0.42} M5,${h - 8} V${h * 0.58} M9,${h - 8} V${h * 0.58}"/><circle class="lip-head" cx="7" cy="6" r="5.5"/><circle class="lip-head" cx="7" cy="${h - 6}" r="5.5"/></pattern></defs><rect class="lip-bg" x="30" y="${mTop}" width="450" height="${h}"/><rect x="30" y="${mTop}" width="450" height="${h}" fill="url(#${p}-lip)"/>`;
  // Calvin–Benson cycle, clockwise: RuBP (right) → Rubisco (bottom) → reduction (left, where ATP and NADPH arrive) → triose-P (top) → RuBP.
  const cx = 650, cy = 320, R = 80;
  const pt = (deg: number): [number, number] => [cx + R * Math.cos((deg * Math.PI) / 180), cy + R * Math.sin((deg * Math.PI) / 180)];
  const arc = (a: number, b: number): string => { const [xa, ya] = pt(a), [xb, yb] = pt(b); return ar(p, 'ink', `M${xa.toFixed(1)},${ya.toFixed(1)} A${R},${R} 0 0 1 ${xb.toFixed(1)},${yb.toFixed(1)}`); };
  const penta = (x: number, y: number, r = 33): string =>
    `<polygon class="node-rubp" points="${Array.from({ length: 5 }, (_, k) => { const a = -Math.PI / 2 + (k * 2 * Math.PI) / 5; return `${(x + r * Math.cos(a)).toFixed(1)},${(y + r * Math.sin(a)).toFixed(1)}`; }).join(' ')}"/>${t(x, y + 7, 'RuBP', 'fl15-t15 fl15-b')}`;
  return svg(p, 'Thesis-style supply line: photons drive the thylakoid membrane, which supplies ATP and NADPH to the Calvin–Benson cycle. Photons limit in dim light; electron transport, Rubisco with CO₂, or sugar export cap the plateau in bright light', `
    <g transform="translate(0 -24)">
    ${t(40, 116, '① photons absorbed', 'sm fl15-b fl15-amber', 'start')}${hBrace(40, 300, 128, 12, 'fl15-brace fl15-brace-amber')}
    ${bolt(p, 58, 166, 96, mTop - 30)}${bolt(p, 238, 166, 276, mTop - 30)}
    ${membrane}
    ${ps(110, 'PSII')}${ps(290, 'PSI')}${atps(420)}
    ${ar(p, 'red', `M164,${mTop + 30} L232,${mTop + 30}`, 'fl15-e')}${t(198, mTop + 22, 'e⁻', 'fl15-t15 fl15-red fl15-b')}
    ${t(200, mTop - 12, 'stroma', 'fl15-t15 fl15-grey')}${t(476, mBot + 30, 'lumen', 'fl15-t15 fl15-grey', 'end')}
    ${water(110, 446)}${ar(p, 'ink', 'M130,450 L168,460')}${molecule(194, 462, 'OO', 11)}${t(226, 469, 'O₂', 'sm', 'start')}
    ${ar(p, 'ink', `M296,${mTop - 28} L310,266`)}${tag(326, 246, 'NADPH', 'nadph')}
    ${ar(p, 'ink', `M420,${mTop - 72} L420,236`)}${tag(420, 216, 'ATP', 'atp')}
    ${ar(p, 'ink', 'M380,250 L560,300')}${ar(p, 'ink', 'M448,222 L566,276')}
    ${arc(22, 66)}${arc(114, 246)}${arc(292, 338)}
    <rect class="node-rub" x="${cx - 58}" y="${cy + R - 20}" width="116" height="40" rx="12"/>${t(cx, cy + R + 8, 'Rubisco', 'sm fl15-b')}
    ${penta(cx + R, cy)}
    <rect class="node" x="${cx - 62}" y="${cy - R - 20}" width="124" height="40" rx="20"/>${t(cx, cy - R + 8, 'triose-P', 'sm fl15-b')}
    ${t(cx - 20, cy - 4, 'Calvin–Benson', 'fl15-t15 fl15-grey')}${t(cx - 20, cy + 16, 'cycle', 'fl15-t15 fl15-grey')}
    ${molecule(cx + 92, cy + R + 64, 'OCO', 12)}${ar(p, 'ink', `M${cx + 80},${cy + R + 48} L${cx + 58},${cy + R + 20}`)}
    ${ar(p, 'ink', `M${cx + 40},${cy - R - 22} L${cx + 70},${cy - R - 60}`)}${t(cx + 82, cy - R - 58, 'sugar', 'sm fl15-b', 'start')}
    ${t(784, 116, '④ sugar export (TPU)', 'sm fl15-b fl15-p', 'end')}${hBrace(640, 784, 128, 12, 'fl15-brace fl15-brace-p')}
    ${hBrace(36, 476, 498, 12, 'fl15-brace fl15-brace-j')}${t(256, 548, '② electron transport (ATP, NADPH)', 'sm fl15-b fl15-j')}
    ${hBrace(574, 784, 498, 12, 'fl15-brace fl15-brace-c')}${t(679, 548, '③ Rubisco and CO₂', 'sm fl15-b fl15-c')}</g>`, illusHeads(p));
}

/* ---------- 15G · the low-O₂ test: measured initial slopes ---------- */

function lowO2Svg(): string {
  const p = 'fl15g', k = 3500;
  type L = { s: number; lab: string; cls: string };
  const panel = (x0: number, title: string, sub: string, ls: L[]): string => {
    const pl = plot(x0, x0 + 270, 430, 150, 1);
    const Y = (a: number): number => 430 - a * k;
    const key = ls.map((l, n) => `<path class="fl15-line ${l.cls}" d="M${x0 + 18},${168 + n * 32} H${x0 + 58}"/>${t(x0 + 68, 176 + n * 32, l.lab, 'sm fl15-b', 'start')}`).join('');
    return `${t(x0 + 135, 44, title, 'lab fl15-b')}${t(x0 + 135, 74, sub, 'sm')}
      ${axes(p, pl, 'absorbed photons →', 'CO₂ fixed →', 430, 'tl', 468)}
      ${ls.map(l => `<path class="fl15-line ${l.cls}" d="M${pl.x0},430 L${pl.x1},${Y(l.s).toFixed(1)}"/>`).join('')}${key}`;
  };
  return svg(p, 'Measured initial slopes (Ehleringer and Björkman 1977): lowering O₂ from 21 % to 2 % raises the quantum yield of C₃ leaves from 0.052 to 0.073 but leaves C₄ leaves at about 0.053', `
    ${panel(90, 'C₃ leaf', 'less O₂, steeper slope', [
      { s: 0.073, lab: '2 % O₂: 0.073', cls: 'fl15-line-lo' },
      { s: 0.052, lab: 'air: 0.052', cls: 'fl15-line-air' },
    ])}
    ${panel(480, 'C₄ leaf', 'O₂ makes no difference', [
      { s: 0.053, lab: '2 % O₂: ≈ 0.053', cls: 'fl15-line-lo' },
      { s: 0.053, lab: 'air: ≈ 0.053', cls: 'fl15-line-air' },
    ])}
    <path class="fl15-div" d="M410,40 V470"/>
    ${t(400, 522, 'slopes to scale · mol CO₂ per mol photons · 30 °C · air 21 % O₂', 'sm')}
    ${t(400, 556, 'Rubisco also reacts with O₂', 'sm fl15-b')}
    ${t(400, 586, 'Ehleringer & Björkman 1977', 'fl15-cr')}`);
}

/* ---------- 15H · the equation hands over ---------- */

function equationSvg(): string {
  const p = 'fl15h';
  type Kind = 'next' | 'water' | 'light' | 'op';
  // Light is the condition, written over the arrow as in the textbook form.
  const terms: Array<[string, Kind | 'arrow']> = [['6 CO₂', 'next'], ['+', 'op'], ['12 H₂O', 'water'], ['light', 'arrow'],
    ['C₆H₁₂O₆', 'next'], ['+', 'op'], ['6 O₂', 'water'], ['+', 'op'], ['6 H₂O', 'next']];
  // Approximate advance widths of Inter 600 at 25 px.
  const cw = (s: string): number => 0.93 * [...s].reduce((w, c) => w + (/[₀-₉]/.test(c) ? 11 : c === ' ' ? 7 : /[→+]/.test(c) ? 18
    : /[CHO]/.test(c) ? 20 : /[ilt1]/.test(c) ? 9 : 16), 0);
  const ws = terms.map(([s, k]) => (k === 'arrow' ? cw(s) + 50 : cw(s) + (k === 'op' ? 16 : 30)));
  let x = 400 - ws.reduce((a, b) => a + b, 0) / 2;
  const ey = 98, ay = 90;
  const eq = terms.map(([s, k], n) => {
    const w = ws[n], cx = x + w / 2; x += w;
    if (k === 'op') return t(cx, ey, s, 'fl15-eqt fl15-grey');
    if (k === 'arrow') {
      const lw = cw(s) + 30;
      return `<path class="fl15-eqar" d="M${(cx - w / 2 + 6).toFixed(1)},${ay} H${(cx + w / 2 - 14).toFixed(1)}"/><path class="fl15-eqhd" d="M${(cx + w / 2 - 4).toFixed(1)},${ay} l-14,-7 v14Z"/>`
        + `<rect class="fl15-eq fl15-eq-light" x="${(cx - lw / 2).toFixed(1)}" y="38" width="${lw.toFixed(1)}" height="36" rx="10"/>${t(cx, 64, s, 'fl15-eqt fl15-eq-t-light')}`;
    }
    return `<rect class="fl15-eq fl15-eq-${k}" x="${(cx - w / 2 + 3).toFixed(1)}" y="70" width="${w - 6}" height="40" rx="10"/>${t(cx, ey, s, `fl15-eqt fl15-eq-t-${k}`)}`;
  }).join('');
  const pl = plot(130, 730, 520, 300, 1);
  return svg(p, 'The photosynthesis equation, light over the arrow, with the lecture 1 terms (light, water, oxygen) filled and the lecture 2 terms (CO₂, sugar) dashed; lecture 1 makes ATP and NADPH and lecture 2 uses them; on the light-response curve, photons limit the initial slope and downstream steps limit the plateau', `
    ${eq}
    <rect class="fl15-eq fl15-eq-light" x="140" y="132" width="22" height="20" rx="5"/><rect class="fl15-eq fl15-eq-water" x="168" y="132" width="22" height="20" rx="5"/>${t(200, 149, 'explained in lecture 1', 'sm', 'start')}
    <rect class="fl15-eq fl15-eq-next" x="490" y="132" width="26" height="20" rx="5"/>${t(526, 149, 'lecture 2', 'sm', 'start')}
    ${t(296, 202, 'lecture 1 makes', 'sm fl15-b', 'end')}${ar(p, 'ink', 'M306,195 L338,195')}
    ${tag(378, 195, 'ATP', 'atp')}${tag(462, 195, 'NADPH', 'nadph')}
    ${ar(p, 'ink', 'M520,195 L552,195')}${t(562, 202, 'lecture 2 uses', 'sm fl15-b', 'start')}
    ${axes(p, pl, 'light: photon flux (PPFD) →', 'net CO₂ uptake →', 540, 'tl', 576)}
    <path class="fl15-cap" d="M${pl.X(0.22)},${pl.Y(CAP)} H${pl.x1}"/>
    ${gcurve(p, trace(pl, net, 0, 1))}
    ${t(250, 440, 'photons limit', 'lab fl15-b fl15-amber', 'start')}
    ${t(730, 282, 'downstream steps limit', 'lab fl15-b fl15-brown', 'end')}
    ${t(730, 386, 'making and using ATP, NADPH', 'sm', 'end')}
    ${SCHEMATIC(784, 590)}`, grad(p, pl.X(0.12), pl.X(0.55)));
}

/* ---------- 15I · lecture recap: three icons on one curve ---------- */

function recapSvg(): string {
  const p = 'fl15i';
  const cards = [
    { x: 20, title: 'Capture light', sub: ['pigments, antennas,', 'two photosystems'] },
    { x: 280, title: 'Shed the excess', sub: ['as heat (NPQ);', 'repair PSII'] },
    { x: 540, title: 'Make ATP, NADPH', sub: ['used to make sugar', 'in lecture 2'] },
  ];
  const icon = (k: number, cx: number): string => {
    if (k === 0) return `${bolt(p, cx - 64, 44, cx - 22, 92)}<circle class="fl15-pig" cx="${cx}" cy="96" r="20"/><circle class="fl15-pig" cx="${cx + 36}" cy="80" r="14"/><circle class="fl15-pig" cx="${cx + 30}" cy="114" r="11"/>`;
    if (k === 1) return `<rect class="blob-ps" x="${cx - 40}" y="96" width="80" height="34" rx="14"/>${heat(p, cx - 26, 92, cx - 34, 46)}${heat(p, cx, 92, cx, 42)}${heat(p, cx + 26, 92, cx + 34, 46)}`;
    return `${tag(cx - 44, 62, 'ATP', 'atp')}${tag(cx + 40, 62, 'NADPH', 'nadph')}${ar(p, 'ink', `M${cx},82 L${cx},96`)}<rect class="node-rub" x="${cx - 82}" y="100" width="164" height="34" rx="11"/>${t(cx, 124, 'CO₂ → sugar', 'sm fl15-b')}`;
  };
  const pl = plot(110, 730, 530, 300, 1);
  const spots: Array<[number, number, number]> = [[0.1, 30, -6], [0.3, -2, -34], [0.75, 0, -32]];
  const badges = spots.map(([i, dx, dy], k) => num(pl.X(i) + dx, pl.Y(net(i)) + dy, `${k + 1}`)).join('');
  return svg(p, 'Recap of lecture 1 on the light-response curve: capturing light sets the initial slope, excess light grows from the bend and is shed as heat, and the ATP and NADPH used to make sugar set the plateau', `
    ${cards.map((c, k) => `<rect class="box" x="${c.x}" y="20" width="240" height="214" rx="18"/>${num(c.x + 26, 46, `${k + 1}`)}${icon(k, c.x + 132)}${t(c.x + 120, 172, c.title, 'fl15-h')}${lines(c.x + 120, 198, c.sub, 'sm', 'middle', 25)}`).join('')}
    ${axes(p, pl, 'light: photon flux (PPFD) →', 'net CO₂ uptake →', 545, 'tl', 580)}
    ${gcurve(p, trace(pl, net, 0, 1))}
    ${badges}
    ${t(pl.X(0.1) + 52, pl.Y(net(0.1)) + 2, 'slope: photons limit', 'sm', 'start')}
    ${t(pl.X(0.3) + 22, pl.Y(net(0.3)) + 46, 'bend: excess light grows', 'sm', 'start')}
    ${t(784, pl.Y(net(0.75)) + 46, 'plateau: downstream', 'sm', 'end')}${t(784, pl.Y(net(0.75)) + 72, 'steps limit', 'sm', 'end')}
    ${SCHEMATIC(784, 590)}`, illusHeads(p) + grad(p, pl.X(0.12), pl.X(0.55)));
}

/* ---------- 15J · unused light: the gap above the curve ---------- */

function unusedSvg(): string {
  const p = 'fl15j', phi = 2, th = 0.9;
  const f = (i: number): number => nrh(i, phi, PM, th) - RD;
  const pl = plot(110, 540, 470, 66, 2.1);
  const wedge = `M${pl.X(0)},${pl.Y(-RD)} L${pl.X(1)},${pl.Y(phi - RD).toFixed(1)}${trace(pl, f, 1, 0, 90, false)}Z`;
  let i0 = 0; while (f(i0) < 0) i0 += 0.002;
  const used = `${trace(pl, f, i0, 1)}L${pl.X(1)},${pl.y0} L${pl.X(i0).toFixed(1)},${pl.y0} Z`;
  return svg(p, 'Schematic: extending the initial slope shows what the absorbed photons could fix; the growing gap above the actual curve is absorbed light that is not used for CO₂ and is mostly shed as heat', `<g transform="translate(0 30)">
    <path class="fl15-wedge" d="${wedge}"/><path class="fl15-used" d="${used}"/>
    ${axes(p, pl, 'light: photon flux (PPFD) →', 'CO₂ uptake →', 490, 'tl', 528)}
    <path class="fl15-slope" d="M${pl.X(0)},${pl.Y(-RD)} L${pl.X(1)},${pl.Y(phi - RD).toFixed(1)}"/>
    <path class="fl15-curve" d="${trace(pl, f, 0, 1)}"/>
    ${heat(p, 372, 312, 380, 266)}${heat(p, 418, 304, 426, 232)}${heat(p, 464, 298, 472, 200)}
    ${lines(556, 100, ['initial slope,', 'extended'], 'sm fl15-amber fl15-b', 'start', 25)}
    ${lines(556, 196, ['absorbed but not', 'used for CO₂'], 'fl15-h', 'start', 28)}
    ${lines(556, 256, ['mostly shed', 'as heat (NPQ)'], 'sm', 'start', 26)}
    ${ar(p, 'grey', 'M550,214 L506,232')}
    ${lines(556, 380, ['used for', 'CO₂ uptake'], 'fl15-h fl15-green', 'start', 28)}
    ${ar(p, 'grey', 'M550,392 L470,410')}
    ${SCHEMATIC(784, 520)}</g>`);
}

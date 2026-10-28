// Slide L14 · Reading photosynthesis through fluorescence. Draft context; see research/figure-briefs/LECTURE_OVERVIEW.md.
// Facts used, all CONFIRMED in research/review-2026-10-23-claude/C_L12-L15.md and REVIEW_SUMMARY.md:
// fluorescence yield in vivo 0.5–3 %; PSII emits at ≈ 685 nm, PSI mainly in the far-red (≈ 730 nm);
// a saturating pulse briefly closes PSII; Fv/Fm = (Fm − Fo)/Fm after ≥ 20 min dark, ≈ 0.8 in unstressed leaves
// (typical, not a universal threshold); ΦPSII = (Fm′ − Fs)/Fm′; Fm′ < Fm is the signature of NPQ;
// ETR ≈ ΦPSII × PPFD × 0.84 × 0.5 with both factors assumed; photorespiration is a competing electron sink;
// low ΦPSII is not proof of damage; qI relaxes over hours; Kautsky & Hirsch 1931; PAM (Schreiber et al. 1986);
// SIF from GOSAT (2011) and OCO-2 (Sun 2017); SIF is passive, gives no Fv/Fm, ≈ absorbed light × yield × escape,
// and mostly tracks absorbed light and canopy structure; ESA FLEX launched 15 September 2026.
// Not used: FLEX in-orbit results (unverified).
import type { PlateText, Variant } from '../types';
import { text, wave, rcDot } from '../mechanisms';
import { bolt, illusHeads } from '../illus';
import './l14.css';

/** Fluorescence parameters with real subscripts, in page text (HTML) and in figures (SVG). */
const sb = (s: string): string => `<sub class="fl14-sub">${s}</sub>`;
const F = (s: string): string => `F${sb(s)}`;
/** A formula kept on one line. */
const nw = (s: string): string => `<span class="fl14-nw">${s}</span>`;
const sym = (s: string): string =>
  s.replace(/ΦPSII/g, 'Φ<tspan class="fl14-sb">PSII</tspan>').replace(/\bF([vmos])(?![A-Za-z])/g, 'F<tspan class="fl14-sb">$1</tspan>');

export const PLATE: PlateText = {
  n: '14',
  title: 'Reading photosynthesis through fluorescence',
  status: 'draft',
  lead: 'Leaves re-emit 0.5–3 % of absorbed light as red fluorescence.',
  points: [
    { claim: 'A saturating pulse closes PSII.', text: `In the dark, ${nw(`${F('v')}/${F('m')} = (${F('m')} − ${F('o')})/${F('m')} ≈ 0.8`)} is PSII’s maximum quantum yield.` },
    { claim: `${F('m')}′ below ${F('m')} reveals NPQ.`, text: `In light, heat dissipation lowers the pulse peak; ${nw(`Φ${sb('PSII')} = (${F('m')}′ − ${F('s')})/${F('m')}′`)} is the operating PSII yield.` },
    { claim: 'It reads PSII, not CO₂ uptake.', text: 'Photorespiration and other electron sinks sit between PSII and carbon gain.' },
  ],
  refs: [
    { label: 'Kautsky & Hirsch 1931', url: 'https://doi.org/10.1007/BF01516164' },
    { label: 'Murchie & Lawson 2013', url: 'https://doi.org/10.1093/jxb/ert208' },
    { label: 'Porcar-Castell et al. 2014', url: 'https://doi.org/10.1093/jxb/eru191' },
    { label: 'Porcar-Castell et al. 2021', url: 'https://doi.org/10.1038/s41477-021-00980-4' },
    { label: 'Verhoeven 2014', url: 'https://doi.org/10.1111/nph.12466' },
  ],
};

export const VARIANTS: Variant[] = [
  { id: 'a', name: 'PAM trace', anim: true },
  { id: 'b', name: 'Three states' },
  { id: 'c', name: '1931 → 2026', anim: true },
  { id: 'd', name: 'Plug the drain' },
  { id: 'e', name: 'Red leak' },
  { id: 'f', name: 'Clip vs orbit' },
  { id: 'g', name: 'On the equation' },
  { id: 'h', name: 'Rested or hurt' },
  { id: 'i', name: 'Icons' },
  { id: 'j', name: 'Four steps' },
];

export function draw(id: string): string {
  switch (id) {
    case 'b': return statesSvg();
    case 'c': return historySvg();
    case 'd': return drainSvg();
    case 'e': return spectrumSvg();
    case 'f': return clipOrbitSvg();
    case 'g': return equationSvg();
    case 'h': return restedSvg();
    case 'i': return iconsSvg();
    case 'j': return stepsSvg();
    default: return traceSvg();
  }
}

/* ---------- shared parts ---------- */

type A = 'start' | 'middle' | 'end';
type K = 'ink' | 'green' | 'grey' | 'clay' | 'amber' | 'blue' | 'orange' | 'red';
const KS: K[] = ['ink', 'green', 'grey', 'clay', 'amber', 'blue', 'orange', 'red'];
const f = (v: number): string => v.toFixed(1);
const T = (x: number, y: number, s: string, cls = 'fl14-l', a: A = 'middle'): string => text(x, y, sym(s), cls, a);

const svg = (label: string, body: string): string =>
  `<svg class="fig-svg" viewBox="0 0 800 600" role="img" aria-label="${label}">${body}</svg>`;

const defs = (p: string): string => `${illusHeads(p)}<defs>${KS.map(k =>
  `<marker id="${p}-k${k}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path class="fl14-hd-${k}" d="M0,0L10,5L0,10z"/></marker>`).join('')}
  <radialGradient id="${p}-glow"><stop offset="0" class="fl14-g0"/><stop offset=".45" class="fl14-g1"/><stop offset="1" class="fl14-g2"/></radialGradient></defs>`;

const ar = (p: string, k: K, d: string, cls = ''): string =>
  `<path class="fl14-ar fl14-k-${k}${cls ? ` ${cls}` : ''}" d="${d}" marker-end="url(#${p}-k${k})"/>`;
const heat = (p: string, x0: number, y0: number, x1: number, y1: number, amp = 5, n = 4): string =>
  `<path class="fl14-heat" d="${wave(x0, y0, x1, y1, amp, n)}" marker-end="url(#${p}-kgrey)"/>`;
/** Fluorescence: a red wavy arrow. */
const flu = (p: string, x0: number, y0: number, x1: number, y1: number, w = 2.8, amp = 5, n = 4): string =>
  `<path class="fl14-ar fl14-k-red" style="stroke-width:${w}px" d="${wave(x0, y0, x1, y1, amp, n)}" marker-end="url(#${p}-kred)"/>`;
const glow = (p: string, x: number, y: number, r = 20): string =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#${p}-glow)"/><circle class="fl14-exc" cx="${x}" cy="${y}" r="${Math.max(4, r * 0.28).toFixed(1)}"/>`;
const num = (x: number, y: number, n: string): string =>
  `<circle class="fl14-num" cx="${x}" cy="${y}" r="14"/>${T(x, y + 6, n, 'fl14-nt')}`;
const poly = (pts: [number, number][]): string => pts.map(([x, y], i) => `${i ? 'L' : 'M'}${f(x)},${f(y)}`).join('');

/** A saturating flash: a small white star burst with an amber rim. */
function flash(x: number, y: number, r = 13): string {
  const pts = Array.from({ length: 16 }, (_, i) => {
    const a = (i * Math.PI) / 8 - Math.PI / 2, rr = i % 2 ? r * 0.45 : r;
    return `${i ? 'L' : 'M'}${f(x + Math.cos(a) * rr)},${f(y + Math.sin(a) * rr)}`;
  }).join('');
  return `<path class="fl14-flash" d="${pts}Z"/>`;
}

/** A leaf in a clip: dark jaws, green leaf edge. */
const clip = (x: number, y: number, s = 1): string =>
  `<g transform="translate(${x} ${y}) scale(${s})"><path class="fl14-leaf" d="M-70,8 Q-30,-14 60,-4 Q20,22 -70,8Z"/><rect class="fl14-clip" x="-14" y="-34" width="44" height="26" rx="8"/><rect class="fl14-clip" x="-14" y="14" width="44" height="22" rx="8"/></g>`;

/** A small satellite: body and two solar panels. */
const satellite = (x: number, y: number, s = 1): string =>
  `<g transform="translate(${x} ${y}) scale(${s})"><rect class="fl14-panel" x="-62" y="-10" width="40" height="20" rx="2"/><rect class="fl14-panel" x="22" y="-10" width="40" height="20" rx="2"/><path class="fl14-axis" d="M-22,0 H-14 M14,0 H22"/><rect class="fl14-sat" x="-14" y="-18" width="28" height="36" rx="5"/><path class="fl14-sat" d="M-8,18 L8,18 L4,28 L-4,28Z"/></g>`;

/* ---------- A · schematic PAM trace with each yield beside its state ---------- */

function traceSvg(): string {
  const p = 'fl14a';
  const x0 = 96, x1 = 772, yb = 506, yt = 170;
  const X = (t: number): number => x0 + t * (x1 - x0);
  const Y = (v: number): number => yb - v * (yb - yt);
  const tOn = 0.17, Fo = 0.2, Fm = 1, P = 0.74, Fs = 0.34;
  const pulses = [0.07, 0.29, 0.44, 0.59, 0.74, 0.89];
  const fmp = (t: number): number => 0.58 + 0.3 * Math.exp(-(t - tOn) / 0.12);
  const base = (t: number): number => {
    if (t < tOn) return Fo;
    const s = t - tOn, rise = 1 - Math.exp(-s / 0.006), dec = Fs + (P - Fs) * Math.exp(-s / 0.07);
    return Fo + (dec - Fo) * rise;
  };
  const F = (t: number): number => {
    for (const tp of pulses) {
      const g = Math.exp(-(((t - tp) / 0.0055) ** 6));
      if (g > 0.001) return base(t) * (1 - g) + (tp < tOn ? Fm : fmp(tp)) * g;
    }
    return base(t);
  };
  const pts = Array.from({ length: 1601 }, (_, i) => i / 1600).map(t => [X(t), Y(F(t))] as [number, number]);
  const last = pulses[pulses.length - 1];
  return svg('Schematic PAM fluorescence trace. In the dark, the measuring light gives Fo; a saturating pulse gives Fm, so Fv/Fm = (Fm − Fo)/Fm, about 0.8. When actinic light comes on, fluorescence rises and falls (the Kautsky transient) to a steady Fs; pulses in the light reach only Fm′, below Fm, which is the signature of NPQ; (Fm′ − Fs)/Fm′ is the operating PSII yield', `
    ${defs(p)}<g transform="translate(0 14)">
    <rect class="fl14-darkband" x="${X(0)}" y="64" width="${X(tOn) - X(0)}" height="30" rx="4"/>
    <rect class="fl14-act" x="${X(tOn)}" y="64" width="${X(1) - X(tOn)}" height="30" rx="4"/>
    ${T((X(0) + X(tOn)) / 2, 50, 'dark ≥ 20 min', 'fl14-in')}${T((X(tOn) + X(1)) / 2, 85, 'light on', 'fl14-in')}
    ${pulses.map(tp => flash(X(tp), 122, 11)).join('')}
    ${T(X(1), 50, 'saturating pulses ✷', 'fl14-s', 'end')}

    <path class="fl14-axis" d="M${x0},${yt - 26} V${yb} H${x1}"/>
    <text class="fl14-ax" transform="translate(${x0 - 22} ${(yb + yt) / 2}) rotate(-90)" text-anchor="middle">fluorescence</text>
    ${T(x1, yb + 30, 'time (minutes) · schematic', 'fl14-ax', 'end')}
    <path class="fl14-ref" d="M${X(0.07)},${Y(Fm)} H${X(0.97)}"/>
    <path class="fl14-fl" d="${poly(pts)}"/>

    ${T(X(0.115), Y(Fo) - 12, 'Fo', 'fl14-hb fl14-c-red', 'middle')}
    ${T(X(0.07) + 12, Y(Fm) + 24, 'Fm', 'fl14-hb fl14-c-red', 'start')}
    ${T(X(tOn) + 30, Y(0.1), 'Kautsky rise and fall', 'fl14-s', 'start')}${ar(p, 'grey', `M${X(tOn) + 40},${Y(0.1) - 18} L${X(tOn) + 30},${Y(0.5)}`, 'fl14-thin')}
    ${T(X(last) + 12, Y(fmp(last)) + 6, 'Fm′', 'fl14-hb fl14-c-red', 'start')}
    ${T(X(0.97), Y(Fs) + 30, 'Fs', 'fl14-hb fl14-c-red', 'end')}
    ${ar(p, 'grey', `M${X(last) - 16},${Y(Fm) + 4} L${X(last) - 16},${Y(fmp(last)) - 4}`, 'fl14-thin')}
    ${T(X(last) - 24, Y(0.8) + 2, 'NPQ', 'fl14-in', 'end')}
  </g>`);
}

/* ---------- B · three states: open, closed, closed and quenched ---------- */

/** A straight arrow drawn to a given width, with a filled head that stays in proportion. */
function fatLine(x0: number, y0: number, x1: number, y1: number, w: number, cls: string): string {
  const L = Math.hypot(x1 - x0, y1 - y0), ux = (x1 - x0) / L, uy = (y1 - y0) / L, nx = -uy, ny = ux;
  const hl = Math.max(14, w * 0.9 + 10), hw = w / 2 + Math.max(7, w * 0.42), bx = x1 - ux * hl, by = y1 - uy * hl;
  const P = (x: number, y: number, o: number): string => `${f(x + nx * o)},${f(y + ny * o)}`;
  return `<path class="${cls}" d="M${P(x0, y0, w / 2)} L${P(bx, by, w / 2)} L${P(bx, by, hw)} L${x1},${y1} L${P(bx, by, -hw)} L${P(bx, by, -w / 2)} L${P(x0, y0, -w / 2)}Z"/>`;
}

/** A wave of a given stroke width with a filled head, for heat (grey) and fluorescence (red). */
function fatWave(x0: number, y0: number, x1: number, y1: number, w: number, k: 'grey' | 'red', amp = 6, n = 4): string {
  const L = Math.hypot(x1 - x0, y1 - y0), ux = (x1 - x0) / L, uy = (y1 - y0) / L, nx = -uy, ny = ux;
  const hl = Math.max(13, w * 1.3 + 8), hw = w / 2 + Math.max(6, w * 0.6), bx = x1 - ux * hl, by = y1 - uy * hl;
  return `<path class="fl14-w-${k}" style="stroke-width:${w}px" d="${wave(x0, y0, bx + ux * 2, by + uy * 2, amp, n)}"/>` +
    `<path class="fl14-f-${k}" d="M${f(bx + nx * hw)},${f(by + ny * hw)} L${x1},${y1} L${f(bx - nx * hw)},${f(by - ny * hw)}Z"/>`;
}

function statesSvg(): string {
  const p = 'fl14b';
  const cols = [140, 400, 660];
  const S = [
    { title: 'dark-adapted', sub: 'PSII open', photo: 20, heat: 3, fl: 3, open: true, bar: 0.2, lab: 'Fo' },
    { title: 'saturating pulse', sub: 'PSII closed', photo: 0, heat: 4, fl: 12, open: false, bar: 1, lab: 'Fm' },
    { title: 'pulse in light', sub: 'closed + NPQ', photo: 0, heat: 14, fl: 7, open: false, bar: 0.6, lab: 'Fm′' },
  ];
  const yb = 548, bh = 140;
  const col = (cx: number, s: typeof S[number], first: boolean): string => {
    const ax = cx - 34, ay = 210;
    const photo = s.photo
      ? fatLine(ax + 30, ay + 30, cx + 54, ay + 84, s.photo, 'fl14-f-green')
      : `<path class="fl14-ar fl14-k-grey fl14-dash" d="M${ax + 30},${ay + 30} L${cx + 26},${ay + 66}"/><path class="fl14-stop" d="M${cx + 18},${ay + 76} l20,-16 l4,5 l-20,16Z"/>`;
    return `
      ${T(cx, 46, s.title, 'fl14-h')}${T(cx, 74, s.sub, 'fl14-l fl14-c-grey')}
      ${bolt(p, ax - 46, 96, ax - 26, ay - 36)}
      <circle class="fl14-lhc" cx="${ax}" cy="${ay}" r="42"/>${glow(p, ax, ay, 22)}
      <rect class="${s.open ? 'blob-ps' : 'fl14-rc-off'}" x="${cx + 30}" y="${ay + 84}" width="88" height="56" rx="20"/>
      ${s.open ? rcDot(cx + 74, ay + 112) : ''}
      ${photo}
      ${fatWave(ax + 32, ay - 30, ax + 92, ay - 102, s.heat, 'grey', 5, 3)}
      ${fatWave(ax - 32, ay + 30, ax - 54, ay + 122, s.fl, 'red', 6, 3)}
      ${first ? `${T(ax + 100, ay - 92, 'heat', 'fl14-s', 'start')}${T(cx + 74, ay + 166, 'photochemistry', 'fl14-s')}${T(24, ay + 160, 'fluorescence', 'fl14-s fl14-c-red', 'start')}` : ''}
      <rect class="fl14-bar-fl" x="${cx - 26}" y="${yb - s.bar * bh}" width="52" height="${s.bar * bh}" rx="4"/>
      ${T(cx + 36, yb - s.bar * bh + 24, s.lab, 'fl14-hb fl14-c-red', 'start')}`;
  };
  return svg('The same PSII in three states. Dark-adapted, PSII is open: photochemistry takes most excitation and fluorescence is low (Fo). During a saturating pulse PSII is closed: fluorescence rises to its maximum (Fm). A pulse in the light finds PSII closed and heat dissipation (NPQ) switched on, so fluorescence peaks lower (Fm′). Arrow widths are qualitative', `
    ${defs(p)}<g transform="translate(0 14)">
    ${S.map((s, i) => col(cols[i], s, i === 0)).join('')}
    <path class="fl14-axis" d="M40,${yb} H760"/>
    <path class="fl14-ref" d="M${cols[1] + 26},${yb - bh} H${cols[2] + 30}"/>
    ${T(24, yb - 58, 'fluorescence', 'fl14-s', 'start')}${T(24, yb - 36, 'measured', 'fl14-s', 'start')}
  </g>`);
}

/* ---------- C · history to now: Kautsky's glow to FLEX ---------- */

function historySvg(): string {
  const p = 'fl14c';
  const ty = 330, xs = [104, 300, 496, 692];
  const mini = (x: number, y: number): string => {
    const pts: [number, number][] = Array.from({ length: 61 }, (_, i) => {
      const t = i / 60, v = t < 0.1 ? 0.15 : 0.32 + 0.53 * Math.exp(-(t - 0.1) / 0.25) * (1 - Math.exp(-(t - 0.1) / 0.02));
      return [x - 60 + t * 120, y - v * 70];
    });
    return `<path class="fl14-axis" d="M${x - 60},${y - 80} V${y} H${x + 64}"/><path class="fl14-fl" style="stroke-width:3px" d="${poly(pts)}"/>`;
  };
  const card = (i: number, yr: string, who: string, lines: string[]): string =>
    `<circle class="fl14-num" cx="${xs[i]}" cy="${ty}" r="9"/>${T(xs[i], ty + 40, yr, 'fl14-yr')}${T(xs[i], ty + 66, who, 'fl14-s')}${lines.map((l, k) => T(xs[i], ty + 100 + k * 26, l, 'fl14-in')).join('')}`;
  return svg('From history to now: in 1931 Kautsky and Hirsch saw a dark-adapted leaf’s fluorescence rise and fall in steady light (schematic trace); in 1986 the PAM method added weak measuring light and saturating pulses; from 2011 satellites retrieved sun-induced fluorescence; on 15 September 2026 ESA launched FLEX, the first mission built for it. Satellites use sunlight only, so they give no Fv/Fm', `
    ${defs(p)}<g transform="translate(0 4)">
    <path class="fl14-axis" d="M40,${ty} H770"/>${ar(p, 'ink', 'M740,330 L776,330', 'fl14-thin')}
    ${mini(xs[0], 250)}${T(xs[0] - 56, 150, 'lamp on', 'fl14-s', 'start')}${T(xs[0], 280, 'schematic', 'fl14-s')}${ar(p, 'ink', `M${xs[0] - 48},158 L${xs[0] - 48},178`, 'fl14-thin')}
    ${clip(xs[1], 230, 1)}${flash(xs[1] + 40, 168, 15)}${T(xs[1], 150, 'pulse', 'fl14-s', 'end')}
    <path class="fl14-canopy" d="M${xs[2] - 70},280 Q${xs[2] - 50},250 ${xs[2] - 30},268 Q${xs[2] - 10},244 ${xs[2] + 12},266 Q${xs[2] + 34},246 ${xs[2] + 54},266 Q${xs[2] + 66},258 ${xs[2] + 72},280Z"/>
    ${satellite(xs[2] + 4, 150, 0.8)}${flu(p, xs[2] - 10, 250, xs[2] - 2, 186, 2.4, 4, 3)}
    ${satellite(xs[3], 160, 1)}${T(xs[3], 230, 'FLEX', 'fl14-hb')}${T(xs[3], 256, 'ESA', 'fl14-s')}
    ${card(0, '1931', 'Kautsky & Hirsch', ['red glow rises,', 'then fades'])}
    ${card(1, '1986', 'Schreiber et al. (PAM)', ['pulses give', 'Fv/Fm, ΦPSII'])}
    ${card(2, '2011–2017', 'GOSAT, OCO-2', ['fluorescence', 'seen from orbit'])}
    ${card(3, '15 Sep 2026', 'ESA FLEX launched', ['first mission', 'built for it'])}
  </g>`);
}

/* ---------- D · analogy: plug the drain to see what it took ---------- */

function drainSvg(): string {
  const p = 'fl14d';
  const cols = [24, 282, 540];
  const yTop = 130, yBot = 380;
  // levels chosen so that Fo/Fm = 0.2 (Fv/Fm = 0.8) and Fm′/Fm = 0.6
  const st = [
    { title: 'dark-adapted', h: 46, plug: false, valve: 0.25, lab: 'Fo', leak: 2 },
    { title: 'pulse', h: 230, plug: true, valve: 0.25, lab: 'Fm', leak: 6 },
    { title: 'pulse in light', h: 138, plug: true, valve: 1, lab: 'Fm′', leak: 4 },
  ];
  const tank = (c: number, s: typeof st[number]): string => {
    const x0 = c + 84, x1 = c + 174, mid = (x0 + x1) / 2, lv = yBot - s.h;
    return `
      ${T(mid, 42, s.title, 'fl14-h')}
      <path class="fl14-wall" style="stroke-width:3px" d="M${mid - 40},84 H${mid} V96"/>
      <rect class="fl14-water" x="${mid - 5}" y="96" width="10" height="${lv - 96}"/>
      <rect class="fl14-water" x="${x0}" y="${lv}" width="${x1 - x0}" height="${s.h}"/>
      <path class="fl14-water-o" d="M${x0},${lv} H${x1}"/>
      ${'' /* main drain in the floor */}
      <rect class="fl14-water" x="${mid - 8}" y="${yBot}" width="16" height="34" ${s.plug ? 'opacity=".3"' : ''}/>
      <path class="fl14-wall" style="stroke-width:2px" d="M${mid - 10},${yBot} V${yBot + 34} M${mid + 10},${yBot} V${yBot + 34}"/>
      ${s.plug ? `<rect class="fl14-stop" x="${mid - 12}" y="${yBot - 8}" width="24" height="16" rx="3"/>${flash(mid + 30, yBot + 22, 12)}` : ar(p, 'green', `M${mid},${yBot + 26} L${mid},${yBot + 58}`, 'fl14-thin')}
      ${'' /* side outlet with valve (heat) */}
      <rect class="fl14-water" x="${c + 26}" y="${yBot - 30}" width="${x0 - c - 26}" height="12"/>
      <path class="fl14-wall" style="stroke-width:2px" d="M${c + 26},${yBot - 32} H${x0} M${c + 26},${yBot - 16} H${x0}"/>
      <circle class="fl14-valve" cx="${c + 54}" cy="${yBot - 24}" r="11"/>
      <path class="fl14-ar fl14-k-ink fl14-thin" d="M${f(c + 54 - 9 * Math.cos(s.valve * 1.5))},${f(yBot - 24 + 9 * Math.sin(s.valve * 1.5))} L${f(c + 54 + 9 * Math.cos(s.valve * 1.5))},${f(yBot - 24 - 9 * Math.sin(s.valve * 1.5))}"/>
      ${fatWave(c + 30, yBot - 40, c + 26, yBot - 100 - s.valve * 40, 1.6 + s.valve * 4, 'grey', 4, 3)}
      ${'' /* small leak (fluorescence) into a cup */}
      <circle class="fl14-drop" cx="${x1}" cy="${yBot - 14}" r="3"/>
      <path class="fl14-ar fl14-k-red" style="stroke-width:${s.leak}px" d="M${x1 + 2},${yBot - 14} Q${x1 + 30},${yBot - 14} ${x1 + 36},${yBot + 12}"/>
      <path class="fl14-cup" d="M${x1 + 18},${yBot + 16} H${x1 + 56} L${x1 + 51},${yBot + 32} H${x1 + 23}Z"/>
      <path class="fl14-tank" d="M${x0},${yTop} V${yBot} H${mid - 10} M${mid + 10},${yBot} H${x1} V${yTop}"/>
      <rect class="fl14-bar-fl" x="${mid - 24}" y="${568 - s.h * 0.36}" width="48" height="${s.h * 0.36}" rx="4"/>
      ${T(mid + 32, Math.min(560, 568 - s.h * 0.36 + 24), s.lab, 'fl14-hb fl14-c-red', 'start')}`;
  };
  return svg('Analogy: three water tanks. The tap is absorbed light, the water level is excited chlorophyll, the main drain is photochemistry, the side valve is heat, and a small leak into a cup is the fluorescence we measure. Plugging the main drain (the saturating pulse) raises the level and the leak: Fo to Fm. In the light the side valve is open (NPQ), so the plugged level stays lower: Fm′', `
    ${defs(p)}<g transform="translate(0 6)">
    ${st.map((s, i) => tank(cols[i], s)).join('')}
    ${T(14, 112, 'tap:', 'fl14-s', 'start')}${T(14, 132, 'absorbed', 'fl14-s', 'start')}${T(14, 152, 'light', 'fl14-s', 'start')}
    ${T(14, 196, 'level:', 'fl14-s', 'start')}${T(14, 216, 'excited', 'fl14-s', 'start')}${T(14, 236, 'Chl', 'fl14-s', 'start')}
    ${T(26, 404, 'valve: heat', 'fl14-s', 'start')}
    ${T(14, 444, 'drain:', 'fl14-s', 'start')}${T(14, 464, 'photochemistry', 'fl14-s', 'start')}
    ${T(225, 438, 'leak:', 'fl14-s fl14-c-red')}${T(225, 458, 'fluorescence', 'fl14-s fl14-c-red')}
    ${T(405, 466, 'plug = saturating pulse', 'fl14-s')}
    ${T(556, 290, 'opened:', 'fl14-s', 'end')}${T(556, 312, 'NPQ', 'fl14-s', 'end')}
    <path class="fl14-axis" d="M40,568 H760"/>
    ${T(24, 500, 'leak we measure', 'fl14-s', 'start')}
  </g>`);
}

/* ---------- E · the red leak: absorbed across the visible, re-emitted in the red ---------- */

function spectrumSvg(): string {
  const p = 'fl14e';
  const x0 = 96, x1 = 760, yb = 440, yt = 110;
  const X = (nm: number): number => x0 + ((nm - 400) / 400) * (x1 - x0);
  const Y = (v: number): number => yb - v * (yb - yt);
  const g = (nm: number, c: number, s: number): number => Math.exp(-(((nm - c) / s) ** 2) / 2);
  const absb = (nm: number): number => {
    const v = 0.9 - 0.22 * g(nm, 552, 34);
    return Math.max(0.04, nm < 690 ? v : v * Math.exp(-(((nm - 690) / 14) ** 2)));
  };
  const em = (nm: number): number => 0.62 * g(nm, 685, 11) + 0.5 * g(nm, 732, 20);
  const nmz = Array.from({ length: 401 }, (_, i) => 400 + i);
  const absPath = `M${X(400)},${yb} ${poly(nmz.map(n => [X(n), Y(absb(n))])).replace('M', 'L')} L${X(800)},${yb}Z`;
  const emPath = `M${X(640)},${yb} ${poly(nmz.filter(n => n >= 640).map(n => [X(n), Y(em(n))])).replace('M', 'L')} L${X(800)},${yb}Z`;
  const strip = nmz.filter(n => n % 4 === 0).map(n => {
    const hue = n < 440 ? 265 : n < 490 ? 265 - (n - 440) * 1.6 : n < 580 ? 185 - (n - 490) * 1.4 : n < 650 ? 60 - (n - 580) * 0.8 : 4;
    const light = n > 700 ? Math.max(18, 44 - (n - 700) * 0.3) : 50;
    return `<rect class="fl14-vis" x="${f(X(n))}" y="${yb + 14}" width="${f(X(4) - X(0) + 0.6)}" height="16" style="fill:hsl(${hue.toFixed(0)},70%,${light.toFixed(0)}%)"/>`;
  }).join('');
  return svg('Schematic spectra of a leaf: light is absorbed across the visible, strongly in blue and red and less in green; fluorescence comes out only in the red and far-red, with peaks near 685 nm (PSII) and 730 nm (far-red, where PSI adds). The fluorescence curve is enlarged: it is only 0.5 to 3 percent of the absorbed light', `
    ${defs(p)}<g transform="translate(0 -12)">
    <path class="fl14-abs" d="${absPath}" opacity=".9"/>
    <path class="fl14-fl-fill" d="${emPath}"/>
    <path class="fl14-axis" d="M${x0},${yt - 24} V${yb} H${x1}"/>
    ${strip}
    ${[400, 500, 600, 700, 800].map(n => `<path class="fl14-axis" d="M${X(n)},${yb + 30} V${yb + 38}"/>${T(X(n), yb + 62, `${n}`, 'fl14-ax')}`).join('')}
    ${T((x0 + x1) / 2, yb + 92, 'wavelength (nm) · schematic', 'fl14-ax')}
    ${T(X(450), Y(0.9) - 18, 'absorbed', 'fl14-h fl14-c-green')}
    ${T(X(450), Y(0.9) + 18, 'blue', 'fl14-l')}${T(X(552), Y(0.68) + 30, 'less green', 'fl14-l')}${T(X(668), Y(0.9) + 22, 'red', 'fl14-l')}
    ${T(776, Y(0.86), 'fluorescence', 'fl14-h fl14-c-red', 'end')}${T(776, Y(0.86) + 24, '(enlarged)', 'fl14-s', 'end')}
    ${T(X(688), Y(0.64) - 10, 'PSII ≈ 685', 'fl14-in fl14-c-red', 'end')}${T(X(758), Y(0.52) - 12, '≈ 730', 'fl14-in fl14-c-red', 'start')}${T(X(758), Y(0.52) + 10, 'PSI adds', 'fl14-s', 'start')}
    ${ar(p, 'grey', `M${X(730)},${Y(0.86) + 34} L${X(726)},${Y(0.56)}`, 'fl14-thin')}
  </g>`);
}

/* ---------- F · leaf clip versus satellite: active versus passive ---------- */

function clipOrbitSvg(): string {
  const p = 'fl14f';
  return svg('Two ways to read fluorescence. A leaf clip (PAM) brings its own weak measuring light and saturating pulses, so it gives Fo, Fm, Fv/Fm, the operating yield and NPQ. A satellite sees sun-induced fluorescence with no pulse: the signal is about absorbed light times fluorescence yield times the share that escapes the canopy, it mostly tracks absorbed light and canopy structure, and it gives no Fv/Fm. ESA launched FLEX on 15 September 2026', `
    ${defs(p)}<g transform="translate(0 16)">
    ${T(200, 44, 'leaf clip', 'fl14-hb')}${T(200, 72, 'active: brings its own light', 'fl14-l fl14-c-grey')}
    ${T(600, 44, 'satellite', 'fl14-hb')}${T(600, 72, 'passive: sun-induced (SIF)', 'fl14-l fl14-c-grey')}
    <path class="fl14-rule" d="M400,24 V540"/>

    ${clip(200, 240, 1.5)}
    ${flash(90, 112, 16)}${T(114, 118, 'saturating pulse', 'fl14-s', 'start')}
    <circle class="fl14-act" cx="84" cy="152" r="8"/><circle class="fl14-act" cx="102" cy="152" r="4"/>${T(114, 158, 'weak measuring light', 'fl14-s', 'start')}
    ${flu(p, 236, 276, 296, 304, 2.6, 4, 3)}<rect class="fl14-clip" x="300" y="296" width="40" height="26" rx="6"/>${T(320, 346, 'detector', 'fl14-s')}
    <rect class="fl14-card" x="34" y="400" width="332" height="132" rx="16"/>
    ${T(200, 442, 'dark: Fv/Fm', 'fl14-in')}${T(200, 474, 'light: ΦPSII, NPQ', 'fl14-in')}${T(200, 506, 'one leaf', 'fl14-s')}

    <circle class="fl14-sunfill" cx="470" cy="146" r="26"/>
    ${satellite(660, 140, 1)}
    <path class="fl14-canopy" d="M440,330 Q460,292 492,310 Q514,280 548,304 Q572,276 606,302 Q632,280 662,306 Q690,286 716,310 Q744,294 764,330Z"/>
    <path class="fl14-ground" d="M430,330 H770"/>
    ${ar(p, 'amber', 'M484,176 L540,284', 'fl14-thin')}
    ${flu(p, 600, 292, 646, 172, 2.6, 5, 5)}${flu(p, 650, 292, 664, 172, 2.6, 5, 5)}
    ${T(686, 238, 'faint', 'fl14-s fl14-c-red', 'start')}${T(686, 258, 'red glow', 'fl14-s fl14-c-red', 'start')}
    <rect class="fl14-card" x="434" y="400" width="332" height="132" rx="16"/>
    ${T(600, 442, 'mostly tracks absorbed light', 'fl14-in')}${T(600, 474, 'no pulse → no Fv/Fm', 'fl14-in fl14-c-clay')}${T(600, 506, 'whole canopies', 'fl14-s')}
  </g>`);
}

/* ---------- G · on the equation: where fluorescence reads, and where it does not ---------- */

/** Approximate advance widths (em) of Inter 600, for laying out an equation term by term. */
const EMW: Record<string, number> = { ' ': 0.27, C: 0.74, O: 0.8, H: 0.76 };
const emw = (s: string): number => [...s].reduce((w, ch) => w + (/[₀-₉]/.test(ch) ? 0.44 : /\d/.test(ch) ? 0.64 : (EMW[ch] ?? 0.6)), 0);

/** 6 CO₂ + 12 H₂O → C₆H₁₂O₆ + 6 O₂ + 6 H₂O with light over the arrow, each term underlined as photo or synthesis. */
function equation(y: number, size: number): string {
  // Carbon terms brown, water and O₂ blue, as in the deck's colour code.
  const toks: Array<[string, 'term' | 'op' | 'arrow', string, string?]> = [['6 CO₂', 'term', 'synthesis', 'c'], ['+', 'op', ''], ['12 H₂O', 'term', 'photo', 'w'], ['', 'arrow', ''],
    ['C₆H₁₂O₆', 'term', 'synthesis', 'c'], ['+', 'op', ''], ['6 O₂', 'term', 'photo', 'w'], ['+', 'op', ''], ['6 H₂O', 'term', '', 'w']];
  const gap = 0.32 * size, ws = toks.map(([str, k]) => (k === 'arrow' ? 2.4 * size : k === 'op' ? 0.62 * size : emw(str) * size));
  let at = 400 - (ws.reduce((a, w) => a + w, 0) + gap * (toks.length - 1)) / 2;
  return toks.map(([str, k, half, ink], i) => {
    const x0 = at, x1 = at + ws[i], cx = (x0 + x1) / 2;
    at = x1 + gap;
    if (k === 'arrow') {
      const ay = y - 0.32 * size;
      return `<path class="fl14-eqar" d="M${f(x0)},${f(ay)} H${f(x1 - 8)}"/><path class="fl14-eqhd" d="M${f(x1)},${f(ay)} L${f(x1 - 14)},${f(ay - 7)} L${f(x1 - 14)},${f(ay + 7)}Z"/>`
        + `<text class="fl14-eqo" x="${f(cx)}" y="${f(ay - 10)}" text-anchor="middle">light</text>`;
    }
    const term = `<text class="fl14-eq${ink ? ` fl14-eq${ink}` : ''}" x="${f(cx)}" y="${y}" text-anchor="middle">${str}</text>`;
    return half ? `${term}<path class="fl14-rule" d="M${f(x0 - 4)},${y + 20} H${f(x1 + 4)}"/>${T(cx, y + 44, half, 'fl14-s')}` : term;
  }).join('');
}

function equationSvg(): string {
  const p = 'fl14g';
  return svg('The photosynthesis equation, with light over the arrow, and the two measurements placed on it. Fluorescence reads the photo half at PSII. The electrons from PSII go to CO₂ fixation, to photorespiration and to other sinks, so net CO₂ uptake must be measured by gas exchange', `
    ${defs(p)}<g transform="translate(0 40)">
    ${equation(62, 30)}

    <rect class="blob-ps" x="54" y="200" width="150" height="110" rx="30"/>${T(129, 262, 'PSII', 'fl14-h')}
    ${bolt(p, 70, 128, 110, 196)}${T(60, 150, 'light', 'fl14-s fl14-c-amber', 'end')}
    ${flu(p, 112, 314, 112, 392, 3, 5, 4)}
    <rect class="fl14-eqbox" x="24" y="398" width="330" height="84" rx="16"/>
    ${T(189, 432, 'fluorescence reads', 'fl14-in fl14-c-red')}${T(189, 462, 'ΦPSII here', 'fl14-h fl14-c-red')}

    ${ar(p, 'red', 'M206,254 L324,254', 'fl14-dash')}
    <rect class="fl14-card" x="330" y="200" width="150" height="110" rx="22"/>${T(405, 262, 'electrons', 'fl14-in')}
    ${ar(p, 'ink', 'M482,226 L556,176')}${ar(p, 'clay', 'M482,256 L556,256')}${ar(p, 'grey', 'M482,286 L556,336')}
    ${T(564, 182, 'CO₂ fixation', 'fl14-in', 'start')}
    ${T(564, 262, 'photorespiration', 'fl14-in fl14-c-clay', 'start')}
    ${T(564, 342, 'other sinks', 'fl14-in fl14-c-grey', 'start')}
    ${ar(p, 'ink', 'M708,176 H766 V392')}
    <rect class="fl14-eqbox-g" x="530" y="398" width="246" height="84" rx="16"/>
    ${T(653, 432, 'net CO₂ uptake:', 'fl14-in fl14-c-green')}${T(653, 462, 'gas exchange', 'fl14-h fl14-c-green')}
  </g>`);
}

/* ---------- H · rested or hurt: the dark test ---------- */

function restedSvg(): string {
  const p = 'fl14h';
  const x0 = 110, x1 = 760, yb = 470, yt = 150;
  const X = (t: number): number => x0 + t * (x1 - x0);
  const Y = (v: number): number => yb - v * (yb - yt);
  const tOff = 0.34;
  const reg = (t: number): number => t < tOff ? 0.3 : 0.8 - 0.5 * Math.exp(-(t - tOff) / 0.05);
  const dmg = (t: number): number => t < tOff ? 0.3 : 0.5 - 0.2 * Math.exp(-(t - tOff) / 0.05) + 0.24 * (1 - Math.exp(-(t - tOff - 0.0) / 0.9));
  const pts = (fn: (t: number) => number): [number, number][] => Array.from({ length: 201 }, (_, i) => i / 200).map(t => [X(t), Y(fn(t))]);
  return svg('Schematic dark test. Two leaves both show a low PSII yield in strong light. After at least 20 minutes of darkness, a leaf that was only regulating returns to an Fv/Fm near 0.8; a leaf that stays low has damaged PSII or locked-in quenching, and recovers only over hours or longer', `
    ${defs(p)}<g transform="translate(-20 32)">
    <rect class="fl14-act" x="${X(0)}" y="64" width="${X(tOff) - X(0)}" height="30" rx="4"/>
    <rect class="fl14-darkband" x="${X(tOff)}" y="64" width="${X(1) - X(tOff)}" height="30" rx="4"/>
    ${T((X(0) + X(tOff)) / 2, 50, 'strong light', 'fl14-in')}${T((X(tOff) + X(1)) / 2, 50, 'dark: 20 min … hours', 'fl14-in')}
    <path class="fl14-axis" d="M${x0},${yt - 20} V${yb} H${x1}"/>
    <text class="fl14-ax" transform="translate(${x0 - 24} ${(yb + yt) / 2}) rotate(-90)" text-anchor="middle">PSII efficiency</text>
    <path class="fl14-ref" d="M${x0},${Y(0.8)} H${x1}"/>${T(x0 - 8, Y(0.8) + 7, '0.8', 'fl14-ax', 'end')}
    ${T(x1, yb + 30, 'time · schematic', 'fl14-ax', 'end')}
    <path class="fl14-curve-rep" d="${poly(pts(reg))}"/>
    <path class="fl14-curve-dmg fl14-dash" d="${poly(pts(dmg))}"/>
    ${T(X(0.02), Y(0.3) + 34, 'both low in strong light:', 'fl14-in', 'start')}${T(X(0.02), Y(0.3) + 58, 'low ΦPSII is not proof of damage', 'fl14-s', 'start')}
    ${T(X(0.62), Y(0.8) - 16, 'regulation only', 'fl14-in fl14-c-green', 'middle')}
    ${T(X(0.98), Y(0.55) + 30, 'stays low: damaged PSII', 'fl14-in fl14-c-clay', 'end')}${T(X(0.98), Y(0.55) + 54, 'or locked-in quenching', 'fl14-in fl14-c-clay', 'end')}${T(X(0.98), Y(0.55) + 78, 'recovers over hours or longer', 'fl14-in fl14-c-clay', 'end')}
  </g>`);
}

/* ---------- I · minimal icon summary ---------- */

function iconsSvg(): string {
  const p = 'fl14i';
  const tile = (x: number, y: number): string => `<circle class="fl14-icon" cx="${x}" cy="${y}" r="62"/>`;
  const row1 = [130, 400, 670], row2 = [265, 535], y1 = 140, y2 = 380;
  return svg('Icon summary: a small red leak of 0.5 to 3 percent; a saturating pulse closes PSII and gives Fv/Fm near 0.8; Fm′ below Fm shows NPQ; fluorescence reads PSII, not CO₂ uptake; satellites now see it, with ESA FLEX launched in 2026', `
    ${defs(p)}<g transform="translate(20 8)">
    ${tile(row1[0], y1)}<circle class="fl14-lhc" cx="${row1[0] - 10}" cy="${y1 + 4}" r="30"/>${glow(p, row1[0] - 10, y1 + 4, 18)}${flu(p, row1[0] + 14, y1 - 10, row1[0] + 44, y1 - 40, 2.6, 4, 3)}
    ${T(row1[0], y1 + 96, 'a small red leak', 'fl14-h')}
    ${tile(row1[1], y1)}${flash(row1[1] - 20, y1 - 18, 20)}<rect class="fl14-rc-off" x="${row1[1] - 8}" y="${y1 + 2}" width="52" height="36" rx="12"/>
    ${tile(row1[2], y1)}<rect class="fl14-bar-fl" x="${row1[2] - 34}" y="${y1 - 44}" width="26" height="68" rx="3"/><rect class="fl14-bar-fl" x="${row1[2] + 8}" y="${y1 - 16}" width="26" height="40" rx="3"/>
    ${T(row1[2] - 21, y1 + 46, 'Fm', 'fl14-s', 'middle')}${T(row1[2] + 21, y1 + 46, 'Fm′', 'fl14-s', 'middle')}
    ${tile(row2[0], y2)}<rect class="blob-ps" x="${row2[0] - 50}" y="${y2 - 6}" width="50" height="30" rx="10"/><rect class="fl14-rc-off" x="${row2[0] + 4}" y="${y2 - 6}" width="46" height="30" rx="10"/>${T(row2[0] - 25, y2 + 15, 'PSII', 'fl14-s')}${T(row2[0] + 27, y2 + 15, 'CO₂', 'fl14-s')}
    ${T(row2[0] - 25, y2 - 16, '✓', 'fl14-h fl14-c-green')}${T(row2[0] + 27, y2 - 16, '✗', 'fl14-h fl14-c-clay')}
    ${tile(row2[1], y2)}${satellite(row2[1], y2 - 18, 0.8)}${flu(p, row2[1] - 10, y2 + 46, row2[1] - 4, y2 + 14, 2.2, 3, 2)}
    ${T(row2[1], y2 + 96, 'seen from orbit', 'fl14-h')}${T(row2[1], y2 + 122, 'ESA FLEX, 2026', 'fl14-l')}
  </g>`);
}

/* ---------- J · four steps: how a measurement is made ---------- */

/** Panel 4 trace in panel units (x 0–300, height 0–110): Fm pulse in the dark, light on, then smaller Fm′ pulses. */
function trace4(): [number, number][] {
  const base = (x: number): number => {
    if (x < 56) return 22;
    const s = x - 56, rise = 1 - Math.exp(-s / 3), dec = 34 + 40 * Math.exp(-s / 30);
    return 22 + (dec - 22) * rise;
  };
  const pulses: [number, number][] = [[28, 110], [120, 76], [184, 66], [244, 64]];
  return Array.from({ length: 601 }, (_, i) => i / 2).map(x => {
    for (const [c, top] of pulses) {
      const g = Math.exp(-(((x - c) / 4.5) ** 6));
      if (g > 0.001) return [x, base(x) * (1 - g) + top * g] as [number, number];
    }
    return [x, base(x)] as [number, number];
  });
}

function stepsSvg(): string {
  const p = 'fl14j';
  const P = [[24, 24], [408, 24], [24, 312], [408, 312]] as const, w = 368, h = 270;
  const panel = (i: number, n: string, title: string, sub: string, body: string): string => {
    const [x, y] = P[i];
    return `<rect class="fl14-card" x="${x}" y="${y}" width="${w}" height="${h}" rx="18"/>${num(x + 30, y + 34, n)}${T(x + 54, y + 41, title, 'fl14-h', 'start')}${T(x + 54, y + 67, sub, 'fl14-s', 'start')}${body}`;
  };
  const tr = (x: number, y: number, pts: [number, number][]): string =>
    `<path class="fl14-axis" d="M${x},${y - 110} V${y} H${x + 300}"/><path class="fl14-fl" style="stroke-width:3.2px" d="${poly(pts.map(([a, b]) => [x + a, y - b]))}"/>`;
  return svg('Four steps of a fluorescence measurement, with schematic traces. One: keep the leaf dark for at least 20 minutes. Two: a weak measuring light gives Fo with PSII open. Three: a saturating pulse closes PSII and gives Fm, hence Fv/Fm. Four: in light, pulses give Fm′ and the steady level Fs, hence the operating yield; Fm′ below Fm shows NPQ', `
    ${defs(p)}
    ${panel(0, '1', 'dark-adapt', '≥ 20 min, PSII opens', `<rect class="fl14-darkband" x="64" y="118" width="288" height="150" rx="14"/>${clip(214, 196, 1.3)}`)}
    ${panel(1, '2', 'measuring light: Fo', 'weak, so PSII stays open', `${tr(448, 270, [[0, 30], [300, 30]])}${T(762, 228, 'Fo', 'fl14-hb fl14-c-red', 'end')}${T(762, 130, 'all traces schematic', 'fl14-s', 'end')}`)}
    ${panel(2, '3', 'saturating pulse: Fm', 'closes PSII for a moment', `${tr(64, 558, [[0, 22], [120, 22], [124, 110], [140, 110], [144, 22], [300, 22]])}${flash(196, 412, 13)}${T(214, 456, 'Fm', 'fl14-hb fl14-c-red', 'start')}${T(300, 530, 'Fo', 'fl14-hb fl14-c-red', 'start')}`)}
    ${panel(3, '4', 'light on, pulse again', '', `${tr(448, 558, trace4())}
      <path class="fl14-ref" d="M${448 + 24},${448} H${448 + 300}"/>${T(448 + 184, 482, 'Fm′', 'fl14-hb fl14-c-red', 'middle')}${T(448 + 300, 520, 'Fs', 'fl14-hb fl14-c-red', 'end')}${T(448 + 300, 440, 'Fm', 'fl14-s', 'end')}`)}
  `);
}

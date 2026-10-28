// Photosystem I on the slide 9 figure, stagings m1–m4 (lecturer, 28 Oct 2026; research/redo-2026-10-28/ETC_ANIM_BRIEF.md,
// "psi"): the parts all four share. The stage IS slide 9's only figure, 9m1 = focusSvg(id, { look: 'bil', lit: LIT_PSI,
// g: { mol: true } }) of figs/chain.ts, in the slide's figure card. It opens with plastocyanin already docked under
// photosystem I, carrying one electron, where the b₆f animation leaves it, and it stays docked to the end.
// - Beat 1 (holds: named; jumped): zoom into photosystem I. Leaders name "photosystem I", "reaction centre (P700)",
//   plastocyanin glows under its own label, "ferredoxin (Fd)"; each glows as it is named. Light (the slide's amber wave)
//   arrives; one e⁻ goes P700 → ferredoxin; P700 is left with an empty place; plastocyanin's e⁻ refills it.
// - Beat 2 (holds: named; two e⁻ on FNR): a leader names "ferredoxin–NADP⁺ reductase (FNR)"; NADP⁺ (tag) and one ringed H⁺
//   wait in the stroma. Ferredoxin's e⁻ goes to FNR; a second ferredoxin brings a second e⁻ (FNR needs two:
//   NADP⁺ + 2 e⁻ + H⁺ → NADPH) and leaves; both e⁻ and the H⁺ join NADP⁺: the NADPH tag.
// - Beat 3 (push and pull; hold: both named): the camera pulls back to both photosystems; at each reaction centre a ringed
//   hole that pulls an electron in (PSII from water, strongly; PSI from plastocyanin, weakly) and a push arrow (PSII
//   short, PSI tall); the panel's words: "Light lifts a reaction centre's electron away: it is PUSHED out, and the hole it
//   leaves PULLS an electron in", PSII strong pull / weak push, PSI weak pull / strong push, "PSII's push feeds PSI's pull:
//   a relay"; one electron runs the relay, water → PSII → plastoquinone → b₆f → plastocyanin → PSI → ferredoxin → NADPH.
// - Beat 4 (red drop; hold: the curves), formerly beat 3, now told with the relay (far-red pushes PSI's electron out;
//   PSI's hole stays empty): the camera pulls back to both photosystems; photosystem II lights (its render in
//   colour, its name in ink), both are named "photosystem II (PSII)" and "photosystem I (PSI)"; the slide's amber light
//   arrows give way to red (650 nm, #c8361e) and far-red (> 700 nm, #7a1f17) light. A panel holds Emerson's clipping (1943)
//   and O₂ per absorbed photon against wavelength, 600–720 nm, with the light absorbed overlaid: flat to ≈ 680 nm, then
//   falling while absorption is still clearly there. Then the band beyond 685 nm is marked "red drop", far-red falls on PSI
//   on the chain, and the note "absorbed, but reaching mostly photosystem I → cannot make O₂ alone → wasted for O₂".
// - Beat 4 (Emerson's enhancement; holds: ready, after each light): the clipping turns 1957; the rule "Each electron must
//   pass through both photosystems, so the photosystem with fewer photons sets the pace", "O₂ follows the electrons: 4 e⁻
//   per O₂", "photon split illustrative"; the staging's own illustration (psi-m1 … psi-m4) and, one row per light, the
//   photons as two rows of dots (PSII, PSI) paired off one-to-one by links (each pair = one electron through); the unpaired
//   grey out as wasted: far-red alone, 8 photons: PSII 1, PSI 7 → 1 e⁻ (6 wasted); red alone, 8: PSII 5, PSI 3 → 3 e⁻
//   (2 wasted); both, 16: PSII 6, PSI 10 → 6 e⁻, more than 1 + 3 = 4.
// - Beat 5 (hold: the note): "PSII alone (no PSI): stops once plastoquinone is full → ≈ 0 O₂ · PSI alone: never makes O₂";
//   then the panel goes, the camera zooms out to the slide, photosystem II dims again, the slide's light returns, ATP
//   synthase starts to light.
//
// How the slide figure is reused (chain.ts is not modified), as in psi9-common.ts: focusSvg() wraps every part's markup in
// <g class="chn-on|off">; the part of each wrapper is found by drawing the view once per part lit, and the wrappers are
// tagged data-p. A second drawing with photosystem II and ATP synthase lit gives their lit copies (psii-lit, atps-lit),
// faded in over the dimmed ones. Glow copies (the chain's own glow filter, or a red / far-red one) sit under the parts that
// glow. The camera scales the whole figure; text and the outermost glyph groups (.chn-g: atom balls, ringed H⁺, tag rows)
// are counter-scaled by (s/s₀)^−0.7 about their own anchor or centre, as psiim-common.ts, so labels stay 21–28 px.
//
// Image: emerson-nas.png (assets/anim/antenna; halftone of the portrait in Rabinowitch's NAS Biographical Memoir of Robert
// Emerson, source in antenna-common.ts).
import '../figs/clipping.css';
import './psim-common.css';
import emersonImg from '../../assets/anim/antenna/emerson-nas.png';
import { carrierBox, carrierImg, focusSvg, GEO, hring, LIT_PSI, o2G, tagG, waterG, type Part } from '../figs/chain';
import { cutPath, f1, lerp, lerpV, setters, smooth, smoother, tfStr, tw, tween, type Tf, type V } from './antenna-common';
import { PC_DOCK } from './b6fm-common';
import type { Beat, Staging } from './types';

/* ---------------------------------------------------------------- the slide figure, tagged by part */

const PARTS: Part[] = ['psii', 'light-psii', 'water', 'e-water-psii', 'e-psii-pq', 'pq', 'pq-h-in', 'e-pq-b6f', 'b6f', 'pq-h-out',
  'e-b6f-pc', 'pc', 'e-pc-psi', 'psi', 'light-psi', 'e-psi-fd', 'fd', 'e-fd-fnr', 'fnr', 'e-fnr-nadph', 'nadph', 'h-lumen', 'atps', 'atp'];

/** Slide 9's figure (variant 9m1 of figs/l09c.ts) with any lit set. */
const view = (id: string, lit: Part[]): string => focusSvg(id, { look: 'bil', lit, g: { mol: true }, say: '' });

interface Wrap { a: number; b: number; inner: string; on: boolean }
/** The part wrappers of a chain drawing, in document order (they never nest; their content may hold other groups). */
function wraps(s: string): Wrap[] {
  const out: Wrap[] = [], re = /<g class="chn-(on|off)">/g, tag = /<g[\s>]|<\/g>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(s))) {
    const i0 = m.index + m[0].length;
    let depth = 1, i = i0, t: RegExpExecArray | null;
    tag.lastIndex = i0;
    while (depth && (t = tag.exec(s))) { depth += t[0] === '</g>' ? -1 : 1; i = tag.lastIndex; }
    out.push({ a: m.index, b: i, inner: s.slice(i0, i - 4), on: m[1] === 'on' });
    re.lastIndex = i;
  }
  return out;
}
/** The part of each wrapper: draw the view with one part lit at a time. */
function partsOf(): Array<Part | null> {
  const out: Array<Part | null> = wraps(view('pmprobe', [])).map(() => null);
  for (const p of PARTS) wraps(view('pmprobe', [p])).forEach((w, i) => { if (w.on) out[i] = p; });
  return out;
}
const strip = (s: string): string => s.replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
const esc = (s: string): string => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const NUM = '(-?[\\d.]+)';
function textOf(s: string, cls: string, content: string, dflt: V): V {
  const m = new RegExp(`<text class="${cls}" x="${NUM}" y="${NUM}"[^>]*>${esc(content)}</text>`).exec(s);
  return m ? [Number(m[1]), Number(m[2])] : dflt;
}

/** Glow copies: [part, filter]. 'amb' is the chain's own glow (the c2c3 look); 'red' and 'fr' glow in the light's colour. */
type Glow = 'amb' | 'red' | 'fr';
const GLOWS: Array<[Part, Glow]> = [['psi', 'amb'], ['psi', 'red'], ['psi', 'fr'], ['psii', 'red'], ['psii', 'fr'], ['pc', 'amb'], ['fd', 'amb'], ['fnr', 'amb']];

interface Scene { svg: string; pcLab: V }
function scene(id: string, P: string): Scene {
  const base = strip(view(id, LIT_PSI)), lit = strip(view(id, [...LIT_PSI, 'psii', 'atps']));
  const parts = partsOf(), wb = wraps(base), wl = wraps(lit);
  const filt = (g: Glow): string => (g === 'amb' ? `${id}-glow` : `${P}-g${g}`);
  let svg = '', at = 0;
  wb.forEach((w, i) => {
    const p = parts[i] ?? 'x', body = !/<text/.test(w.inner);
    svg += base.slice(at, w.a);
    // glow copies go under the body they light (photosystem II's from its lit copy)
    if (body) for (const [gp, g] of GLOWS) if (gp === p) svg += `<g class="chn-on" data-p="${p}-glow-${g}" opacity="0" display="none" filter="url(#${filt(g)})">${p === 'psii' ? wl[i].inner : w.inner}</g>`;
    svg += `<g class="chn-${w.on ? 'on' : 'off'}" data-p="${p}">${w.inner}</g>`;
    if ((p === 'psii' || p === 'atps') && wl[i]) svg += `<g class="chn-on" data-p="${p}-lit" opacity="0" display="none">${wl[i].inner}</g>`;
    at = w.b;
  });
  svg += base.slice(at);
  const pcInner = wb.filter((_, i) => parts[i] === 'pc').map(w => w.inner).join('');
  return { svg, pcLab: textOf(pcInner, 'chn-in', 'plastocyanin', [GEO.pc[0], GEO.pc[1] + 44]) };
}

/* ---------------------------------------------------------------- where the story happens (figure units) */

export const P700 = GEO.p700, FAB = GEO.fab, FD = GEO.fd, PC = GEO.pc, FNR = GEO.fnr, OEC = GEO.oec;
/** Plastocyanin docked under P700, on photosystem I's lumenal face: exactly where the b₆f animation leaves it, with its
 *  electron (b6fm-common.ts PC_DOCK = [500, 350]). */
export const DOCK: V = PC_DOCK;
/** PSII's reaction centre, 36.5 % of the way from the oxygen-evolving site to Q_B (as psii7-common.ts). */
export const RC2: V = lerpV(GEO.oec, GEO.qb, 0.365);
/** The two electrons on FNR, NADP⁺ in the stroma, the e⁻ landing on it, the H⁺ it takes (waiting, joining). */
const ON_FNR: [V, V] = [[FNR[0] - 13, FNR[1] - 9], [FNR[0] + 12, FNR[1] - 9]];
const NP: V = [540, 100];
const AT_NP: [V, V] = [[NP[0] - 6, NP[1] + 3], [NP[0] + 8, NP[1] + 3]];
const H0: V = [468, 142], H1: V = [NP[0] - 28, NP[1] + 2];
/** The second ferredoxin: where it enters (right of the close view), where it docks at FNR. */
/** The four turnovers (lecturer: every count on screen is shown in full): plastocyanins 1–4 arrive at the dock in turn
 *  (1 is there from the b₆f animation) and leave; ferredoxins 1–4 take an electron each at PSI's stromal dock (the slide's
 *  ferredoxin place), wait right of FNR (1–3), then each brings its electron to FNR (beat 2). */
const PC_IN: V[] = [[404, 350], [440, 356], [474, 354], DOCK], PC_OUT: V[] = [DOCK, [486, 410], [440, 424]];
const FD_IN: V = [612, 270], FD_Q: V[] = [[672, 226], [708, 226], [744, 226]], FNR_DOCK: V = [600, 218], FD_GONE: V = [650, 168];
/** Where an electron sits on a plastocyanin or a ferredoxin (its copper or iron–sulfur centre), from the glyph's centre. */
const PC_SPOT = carrierBox('pc').spot, FD_SPOT = carrierBox('fd').spot;
/** NADPH 1 is set aside here while NADPH 2 forms. */
const N1_PARK: V = [470, 96];
/** NADPH in the slide's row rowG(548, 64, NADP⁺ + H⁺ → NADPH): its tag sits 76 right of the row's centre. */
const ROW: V = [548, 64], ROW_NADPH = 76;

/* ---------------------------------------------------------------- views */

/** The whole chain: the slide's figure card (860 × 642 px around the 800 × 600 figure drawn at 0.97) fills the stage. */
export const B: Tf = { s: 1.07, t: [800 - 1.07 * 400, 370 - 1.07 * 300] };
/** Photosystem I, close: figure x 76–804, y 80–416 (NADP⁺ in the stroma, the docked plastocyanin and the labels in the
 *  lumen both show). */
const ZS = 2.2;
export const Z: Tf = { s: ZS, t: [800 - ZS * 440, 370 - ZS * 248] };
/** Both photosystems (beats 3–4): figure x 0–640, y 0–569 on the left of the stage (the key just below), the panel on the right. */
export const E: Tf = { s: 1.3, t: [12, 0] };
/** Text and glyph scale for a camera scale s. */
export const kOf = (s: number): number => (s / B.s) ** -0.7;
/** The slide's figure card, in figure units (pilot.css .lay-figure .fig). */
const CARD = { x: -43.3, y: -30.9, w: 886.6, h: 661.9, r: 22.7 };
/** Labels that only the close view needs (the slide's own are out of view there). */
const ZL = { stroma: [96, 236] as V, lumen: [96, 404] as V };

/** The panel of beats 3–4 (stage units) and the clipping on its top-left corner. */
export const PANEL = { x: 852, y: 16, w: 732, h: 708 };
const CLIP = { x: 866, y: 28, w: 300, h: 184 };

/* ---------------------------------------------------------------- timing (s into each beat) */

/** A move of about 1 s: 0 → 1 from t0 over d, eased at both ends. */
export const mv = (t: number, t0: number, d: number): number => smoother((t - t0) / d);
/** A short pulse: up over 0.12 s from t0, down by t0 + 0.6. */
const pulse = (t: number, t0: number): number => tw(t, t0, t0 + 0.12) * (1 - tw(t, t0 + 0.25, t0 + 0.6));
/** A brief glow while a part is named: up 0.25 s, held, down by t0 + 1.15. */
const named = (t: number, t0: number): number => tw(t, t0, t0 + 0.25) * (1 - tw(t, t0 + 0.65, t0 + 1.15));
/** A point on the quadratic Bézier a → c → b. */
const bez = (a: V, c: V, b: V, u: number): V => {
  const v = 1 - u;
  return [v * v * a[0] + 2 * v * u * c[0] + u * u * b[0], v * v * a[1] + 2 * v * u * c[1] + u * u * b[1]];
};

// Beat 1: zoom in; the parts named one by one (hold); light, the jump (hold); the refill.
const B1 = { zoom: 0.05, zoomD: 1.1, flowsOut: [0.05, 0.4], psi: 1.2, rc: 1.75, pc: 2.3, fd: 2.85, named: 3.4, light: 3.45, flash: 3.9, jump: 4.0, jumped: 4.85, refill: 4.9, end: 9.95 };
/** Turnovers 1–4 at PSI: the swap of carriers before turnovers 2–4 (S), each jump P700 → ferredoxin (J, JD), each refill
 *  from plastocyanin (R, RD). The first at the normal pace; 2–4 about 1.4 s each. */
const SW = [0, 5.5, 6.9, 8.3], SWD = 0.6;
const J = [4.0, 6.15, 7.55, 8.95], JD = [0.65, 0.4, 0.4, 0.4];
const R = [4.9, 6.55, 7.95, 9.35], RFD = [0.55, 0.3, 0.3, 0.3];
// Beat 2: FNR named, NADP⁺ and H⁺ shown (hold); e⁻ 1 to FNR, the second ferredoxin brings e⁻ 2 (hold); NADPH.
// Beat 2: FNR named, NADP⁺ 1 and an H⁺ wait (hold); ferredoxins 1, 2 bring their e⁻ to FNR → NADPH 1 (hold); NADP⁺ 2 and
// an H⁺; ferredoxins 3, 4 → NADPH 2. Each trip: to FNR (0.45 s), the e⁻ into FNR (0.3 s), away (0.45 s).
const B2 = { fnr: 0.05, nIn: 0.4, named: 0.9, d: [0.95, 1.6, 3.5, 4.15], trip: 0.45, give: 0.3, toN1: 2.35, toN2: 4.9, toND: 0.45, merge1: 2.85, merge2: 5.4, park: 3.0, two: 3.45, nIn2: 3.5, end: 5.8 };
// Beat 3 (two photosystems in series): pull back to both photosystems; PSII lights, both named; the Z-scheme in the panel
// (hold); red light lifts at PSII, one electron runs water → PSII → … → PSI; far-red lifts at PSI; on to NADP⁺.
export const BP = { out: 0.0, outD: 1.2, flowsIn: [0.6, 1.1] as V, psii: [0.9, 1.5] as V, names: [1.2, 1.6] as V, panel: [0.85, 1.3] as V,
  z: [1.0, 1.4] as V, hold: 1.6, red: 1.7, far: 4.0, end: 6.2 };
// Beat 4 (red drop): red goes; far-red alone: PSI's lift lit, PSII's grey; P700's electron lifted on to NADP⁺, P700 stays
// empty; one O₂ only; the line "far-red alone: little O₂".
export const B3 = { redOff: [0, 0.4] as V, push: 1.0, line: [1.9, 2.3] as V, o2: 2.6, end: 4.4, hold: 99, far: 0, pushD: 0.8 };
// Beat 5 (Emerson's enhancement): the clipping; red again: both lifts, electrons stream, many O₂; the line (hold); zoom out.
export const B4 = { clip: [0.1, 0.5] as V, red: 0.4, line: [2.9, 3.3] as V, hold: 3.6, out: 3.7, end: 3.7 + 2.4, rows: [99, 99, 99], sum: 99 };
const HOLDS4 = [B4.hold];
/** Times in a row of beat 4 (s after the row starts): the photon dots appear, the pairs link up (one per electron), the
 *  unpaired grey out, the count; each electron's tally; the light goes off. */
export const ROW_T = { dots: [0.25, 0.75] as V, link: 0.85, linkDt: 0.1, waste: [1.25, 1.5] as V, e: [1.3, 1.55] as V, o2: 1.3, o2dt: 0.12, off: 1.95 };
/** When electron j of row r is counted (beat 4). */
export const o2At = (r: number, j: number): number => B4.rows[r] + ROW_T.o2 + j * ROW_T.o2dt;
/** The photon accounting (the split is illustrative, the rule is real): photons per light, caught by PSII and by PSI;
 *  electrons through the chain = the smaller number (each must pass both); O₂ follows, 4 e⁻ per O₂. */
export const ROWS = [
  { lab: '<tspan class="pm-fr">far-red</tspan> alone', n: 8, ii: 1, i: 7, e: 1, lim: 'ii' as const },
  { lab: '<tspan class="pm-red">red</tspan> alone', n: 8, ii: 5, i: 3, e: 3, lim: 'i' as const },
  { lab: '<tspan class="pm-red">red</tspan> + <tspan class="pm-fr">far-red</tspan>', n: 16, ii: 6, i: 10, e: 6, lim: 'ii' as const },
];
/** The light on the chain: beat 3 far-red on PSI; beat 4 one light per row, both from row 3 to the end. */
const LIGHT_S: Step[] = [{ on: BP.red, off: 999, red: true }, { on: BP.far, off: 999, far: true }];
const LIGHT_D: Step[] = [{ on: -5, off: 0.05, red: true }, { on: -5, off: 999, far: true }];
const LIGHT_E: Step[] = [{ on: -5, off: 999, far: true }, { on: B4.red, off: 999, red: true }];
/** How lit ATP synthase gets at the end: it starts to light. */
const ATPS_END = 0.6;
/** The relay run of beat 3 (figure units): water → PSII's hole (pulled) → pushed up → plastoquinone → b₆f → plastocyanin →
 *  PSI's hole (pulled) → pushed up → ferredoxin → FNR → NADPH (the slide's tag); when the electron reaches each point. */
const RELAY: V[] = [[88, 436], OEC, RC2, [150, 272], GEO.pq, GEO.hem, GEO.cytf, DOCK, P700, FAB, FD, FNR, [614, 70]];
const RELAY_T = [2.0, 2.3, 2.45, 2.8, 3.15, 3.4, 3.6, 3.9, 4.15, 4.5, 4.75, 5.0, 5.4];
const FILL2 = RELAY_T[2], FILL1 = RELAY_T[8];
/** Push (a block arrow up, as tall as the reaction centre lifts its electron) and pull (a dashed arrow into the hole). */
function blockUp(x: number, y0: number, y1: number, w: number): string {
  const hh = 1.7 * w, hw = 1.15 * w;
  return `<path class="pm-push" d="M${f1(x - w / 2)},${f1(y0)}V${f1(y1 + hh)}H${f1(x - hw)}L${f1(x)},${f1(y1)}L${f1(x + hw)},${f1(y1 + hh)}H${f1(x + w / 2)}V${f1(y0)}Z"/>`;
}
function pullArrow(a: V, c: V, b: V, cls: string): string {
  const d: V = [b[0] - c[0], b[1] - c[1]], L = Math.hypot(d[0], d[1]), e: V = [b[0] - (d[0] / L) * 8, b[1] - (d[1] / L) * 8];
  return `<path class="${cls}" d="M${f1(a[0])},${f1(a[1])}Q${f1(c[0])},${f1(c[1])} ${f1(e[0])},${f1(e[1])}"/>${head(b, d, 'pm-pullh', 11, 6.5)}`;
}
/** Where the push and pull labels stand (figure units; counter-scaled). */
const PPL = { iiPush: [116, 248] as V, iiPull: [94, 404] as V, iPush: [456, 140] as V, iPull: [480, 350] as V, stall: [548, 422] as V };

/* ---------------------------------------------------------------- glyphs: drawn round their origin at the slide's size */

const glyph = (k: string, inner: string, o = 0): string => `<g data-k="${k}" opacity="${o}" display="none">${inner}</g>`;
export const lab = (s: string, cls: string, x: number, y: number, a: 'start' | 'middle' | 'end' = 'start'): string =>
  `<text class="${cls}" x="${f1(x)}" y="${f1(y)}" text-anchor="${a}">${s}</text>`;
const E_DOT = '<circle class="pm-e" r="6"/>';

/** Arrowhead with its tip at `tip`, pointing along `dir` (as chain.ts). */
export function head(tip: V, dir: V, cls: string, hl = 16, hw = 9): string {
  const L = Math.hypot(dir[0], dir[1]), u: V = [dir[0] / L, dir[1] / L], n: V = [-u[1], u[0]];
  const b: V = [tip[0] - u[0] * hl, tip[1] - u[1] * hl];
  return `<path class="${cls}" d="M${f1(tip[0])},${f1(tip[1])}L${f1(b[0] + n[0] * hw)},${f1(b[1] + n[1] * hw)}L${f1(b[0] - n[0] * hw)},${f1(b[1] - n[1] * hw)}Z"/>`;
}
/** A light wave with a head from a to b, as chain.ts draws light, in its own colour class. */
export function wave([a, b]: [V, V], cls: string, n = 4.5, amp = 7, hl = 16, hw = 9): string {
  const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, pts: string[] = [];
  const stop = 1 - hl / L;
  for (let i = 0; i <= 80; i++) {
    const t = (i / 80) * stop, w = Math.sin(t * n * 2 * Math.PI) * amp * Math.min(1, (stop - t) * 8);
    pts.push(`${i ? 'L' : 'M'}${f1(a[0] + dx * t - uy * w)},${f1(a[1] + dy * t + ux * w)}`);
  }
  return `<path class="${cls}" d="${pts.join('')}"/>${head(b, [dx, dy], cls.split(' ').map(c => `${c}h`).join(' '), hl, hw)}`;
}

/** The lamps and their light on the chain (figure units). One wavelength rule throughout: the red drop beyond 680 nm; red
 *  lamp 650 nm (Emerson's shorter red): onto photosystem II, and a thinner wave onto photosystem I (which absorbs 650 nm
 *  too); far-red lamp > 700 nm: onto photosystem I only. */
export const LAMP_R: V = [100, 64], LAMP_F: V = [384, 64];
const W_R2: [V, V] = [[104, 96], [110, 254]], W_R1: [V, V] = [[126, 94], [434, 244]], W_F1: [V, V] = [[390, 96], [452, 240]];
/** The light labels, two lines each: red right of its lamp, far-red left of its lamp (clear of the slide's NADPH row). */
const LL_R: V = [LAMP_R[0] + 30, 58], LL_F: V = [LAMP_F[0] - 30, 58];

/** A lamp: housing, reflector and a lens in its light's colour, pointing down; glow `on` drawn separately. */
function lampG(k: 'red' | 'fr'): string {
  return `<path class="pm-lampb" d="M-15,-30h30v20l9,16h-48l9,-16z"/>
    <ellipse class="pm-lens pm-lens-${k}" cx="0" cy="6" rx="24" ry="6"/>`;
}

/** Leaders of the close view: label anchor, its anchor side, where the line leaves the label (×k), the point named. */
interface Lead { s: string; at: V; a: 'start' | 'middle' | 'end'; off: V; to: V; cls?: string }
const LEADS: Record<string, Lead> = {
  psi: { s: 'photosystem I', at: [588, 374], a: 'start', off: [-6, -7], to: [562, 298], cls: 'chn-name' },
  rc: { s: 'reaction centre (P700)', at: [588, 405], a: 'start', off: [-6, -7], to: [513, 318] },
  fd: { s: 'ferredoxin (Fd)', at: [532, 186], a: 'end', off: [2, 4], to: [541, 216] },
  fnr: { s: 'ferredoxin–NADP⁺ reductase (FNR)', at: [604, 128], a: 'middle', off: [0, 4], to: [604, 151] },
};
function leadSvg(key: string): string {
  const l = LEADS[key];
  return `<g data-k="ld-${key}" opacity="0" display="none"><path class="chn-ldh" data-k="ld-${key}-h"/><path class="chn-ld" data-k="ld-${key}-p"/>
    <circle class="chn-ldt" data-k="ld-${key}-d" r="3.2"/><g data-k="ld-${key}-t">${lab(l.s, `${l.cls ?? 'chn-in'} chn-halo`, 0, 0, l.a)}</g></g>`;
}

function overlaySvg(p: string, o: Ill): string {
  const clip = (k: string): string => `<clipPath id="${p}-${k}"><rect data-k="${k}" x="-200" y="-200" width="1200" height="1000"/></clipPath>`;
  const gl = (k: string, c: string): string => `<filter id="${p}-g${k}" x="-25%" y="-35%" width="150%" height="170%" color-interpolation-filters="sRGB">
      <feGaussianBlur in="SourceAlpha" stdDeviation="10" result="b"/><feFlood flood-color="${c}" flood-opacity=".85"/><feComposite in2="b" operator="in" result="g"/>
      <feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`;
  const lampLab = (k: 'red' | 'fr'): string => (k === 'red'
    ? `${lab('red', 'pm-wl pm-wl-red chn-halo', 0, 0, 'start')}${lab('650 nm', 'pm-wl pm-wl-red pm-wn chn-halo', 0, 22, 'start')}`
    : `${lab('far-red', 'pm-wl pm-wl-fr chn-halo', 0, 0, 'end')}${lab('&gt; 700 nm', 'pm-wl pm-wl-fr pm-wn chn-halo', 0, 22, 'end')}`);
  return `<defs><radialGradient id="${p}-rcglow"><stop offset="0" stop-color="#fff4d6"/><stop offset=".4" stop-color="#f6c453" stop-opacity=".9"/><stop offset="1" stop-color="#f0a316" stop-opacity="0"/></radialGradient>
      <radialGradient id="${p}-lampglow"><stop offset="0" stop-color="#fff1e8" stop-opacity=".95"/><stop offset=".5" stop-color="#f3b9a8" stop-opacity=".5"/><stop offset="1" stop-color="#f3b9a8" stop-opacity="0"/></radialGradient>
      ${gl('red', '#d4261c')}${gl('fr', '#6b1d5c')}
      ${clip('lclip')}${clip('cw-r2')}${clip('cw-r1')}${clip('cw-f1')}</defs>
    ${glyph('zl-stroma', lab('stroma', 'chn-zone chn-halo', 0, 0))}${glyph('zl-lumen', lab('lumen', 'chn-zone chn-halo', 0, 0))}
    <g data-k="w-r2" opacity="0" display="none" clip-path="url(#${p}-cw-r2)">${wave(W_R2, 'pm-wred')}</g>
    <g data-k="w-r1" opacity="0" display="none" clip-path="url(#${p}-cw-r1)">${wave(W_R1, 'pm-wred pm-thin', 7, 5, 13, 7)}</g>
    <g data-k="w-f1" opacity="0" display="none" clip-path="url(#${p}-cw-f1)">${wave(W_F1, 'pm-wfr', 3.5)}</g>
    ${o.lamps ? `${glyph('lglow-red', `<circle r="34" fill="url(#${p}-lampglow)"/>`)}${glyph('lglow-fr', `<circle r="34" fill="url(#${p}-lampglow)"/>`)}
      ${glyph('lamp-red', lampG('red'))}${glyph('lamp-fr', lampG('fr'))}` : ''}
    ${glyph('ll-red', lampLab('red'))}${glyph('ll-fr', lampLab('fr'))}
    ${glyph('rcglow', `<circle r="24" fill="url(#${p}-rcglow)"/>`)}
    ${glyph('rcring', '<circle class="pm-ring" r="7.5"/>')}${glyph('rcdot', E_DOT)}${glyph('pce', E_DOT)}
    ${[1, 2, 3, 4].map(n => `${glyph(`pc${n}`, `<g class="chn-on">${carrierImg('pc', 0, 0)}</g>`)}${glyph(`fd${n}`, `<g class="chn-on">${carrierImg('fd', 0, 0)}</g>`)}`).join('')}
    ${glyph('gpc1', `<g class="chn-on" filter="url(#${p}c-glow)">${carrierImg('pc', 0, 0)}</g>`)}${glyph('gfd1', `<g class="chn-on" filter="url(#${p}c-glow)">${carrierImg('fd', 0, 0)}</g>`)}
    ${[1, 2, 3, 4].map(n => `${glyph(`tpc${n}`, `<circle class="pm-tagc" r="9.5"/><text class="pm-tagn" x="0" y="4.6" text-anchor="middle">${n}</text>`)}${glyph(`tfd${n}`, `<circle class="pm-tagc" r="9.5"/><text class="pm-tagn" x="0" y="4.6" text-anchor="middle">${n}</text>`)}`).join('')}
    ${[1, 2].map(n => `${glyph(`nadp${n}`, tagG(0, 0, 'NADP⁺', 'plain'))}${glyph(`nadph${n}`, tagG(0, 0, `NADPH ${n}`, 'nadph'))}${glyph(`hp${n}`, hring(0, 0, 12))}`).join('')}
    ${[0, 1, 2, 3, 4].map(n => glyph(`ed${n}`, E_DOT)).join('')}
    ${glyph('e1', E_DOT)}${glyph('l-e1', lab('e⁻', 'pm-elab chn-halo', -8, -8, 'end'))}
    ${Object.keys(LEADS).map(leadSvg).join('')}
    ${glyph('lab-psii', lab('photosystem II (PSII)', 'chn-name chn-halo', 0, 0, 'middle'))}${glyph('lab-psi', lab('photosystem I (PSI)', 'chn-name chn-halo', 0, 0, 'start'))}
    <g data-k="pp-ii" opacity="0" display="none">${blockUp(128, 298, 232, 10)}${pullArrow([96, 428], [92, 366], [138, 324], 'pm-pull pm-pull-strong')}</g>
    <g data-k="pp-i" opacity="0" display="none">${blockUp(470, 300, 116, 16)}${pullArrow([484, 356], [478, 336], [498, 322], 'pm-pull')}</g>
    ${glyph('ppl-ii-push', lab('push', 'chn-in pm-pushl chn-halo', 0, 0, 'end'))}${glyph('ppl-ii-pull', lab('pull', 'chn-in chn-halo', 0, 0, 'end'))}
    ${glyph('ppl-i-push', lab('push', 'chn-in pm-pushl chn-halo', 0, 0, 'end'))}${glyph('ppl-i-pull', lab('pull', 'chn-in chn-halo', 0, 0, 'end'))}
    ${glyph('hole2', '<circle class="pm-ring" r="8"/>')}${glyph('hole1', '<circle class="pm-ring" r="8"/>')}
    ${glyph('rcglow2', `<circle r="24" fill="url(#${p}-rcglow)"/>`)}${glyph('erl', E_DOT)}
    ${[0, 1, 2, 3].map(i => glyph(`cs${i}`, E_DOT)).join('')}${[0, 1, 2, 3, 4, 5].map(i => glyph(`ob${i}`, o2G(0, 0))).join('')}
    ${glyph('stall', lab('PSI’s hole stays empty', 'chn-in chn-halo', 0, 0, 'end'))}
    ${o.world ? o.world(p) : ''}`;
}

/* ---------------------------------------------------------------- the panel and Emerson's clipping (stage units) */

function clippingSvg(p: string): string {
  const { x, y, w, h } = CLIP, pw = 118, ph = 148, px = x + 16, py = y + 18, rx = (px + pw + x + w) / 2;
  return `<g transform="rotate(-1.4 ${x + w / 2} ${y + h / 2})">
    <defs><filter id="${p}-clsh" x="-10%" y="-10%" width="120%" height="130%"><feDropShadow dx="1" dy="3" stdDeviation="4" flood-color="#3d3020" flood-opacity=".22"/></filter></defs>
    <path class="clip-paper" d="${cutPath(x, y, w, h, 53, 3.2)}" filter="url(#${p}-clsh)"/>
    <image href="${emersonImg}" x="${px}" y="${py}" width="${pw}" height="${ph}" preserveAspectRatio="xMidYMid slice"/>
    <text class="clip-name pm-cname" x="${f1(rx)}" y="${py + 64}" text-anchor="middle">Emerson</text>
    <text class="clip-find pm-cyear" data-k="cy43" x="${f1(rx)}" y="${py + 108}" text-anchor="middle">1943</text>
    <text class="clip-find pm-cyear" data-k="cy57" opacity="0" x="${f1(rx)}" y="${py + 108}" text-anchor="middle">1957</text>
    <text class="clip-key pm-ckey" x="${f1(rx)}" y="${py + 138}" text-anchor="middle">the alga <tspan font-style="italic">Chlorella</tspan></text></g>`;
}

/* ---------------------------------------------------------------- what a staging adds */

/** What the chain shows in beats 3–5: the light on each photosystem (0–1) and how strongly each glows. */
export interface Light {
  /** How far each wave is drawn in (0 → 1) and its opacity (default 1): red onto PSII, red onto PSI (default as red), far-red onto PSI. */
  red: number; far: number; red1?: number; redOp?: number; farOp?: number;
  /** Glows in the light's colour: PSII in red, PSII in far-red, PSI in red, PSI in far-red. */
  glowR2: number; glowF2?: number; glowR1: number; glowF1: number;
}
/** What a staging's draw function gets each frame. */
export interface Ctx {
  q: <E extends Element = SVGElement>(k: string) => E;
  set: (el: Element, a: string, v: string) => void;
  op: (el: Element, v: number) => void;
  /** A world glyph at figure point at, scaled sc, at opacity o. */
  put: (k: string, at: V, sc: number, o: number) => void;
}
/** The photon table's place (stage units) and how its O₂ column is drawn. */
export interface Table { y0: number; rowH: number; o2: 'dots' | 'bars' | 'none' }
/** One staging's Emerson illustration (beat 4). Times are seconds into the beat; −1 before it begins, 99 after. */
export interface Ill {
  id: string; name: string; note: string;
  beats?: Beat[];
  /** Lamps on the chain (m1); otherwise the waves alone, labelled. */
  lamps: boolean;
  table: Table;
  /** The staging's own illustration in beat 4 (stage units; the band y 226–470 above the table), in a .fig group. */
  panel(p: string): string;
  /** Extra markup on the chain (figure units), counter-scaled by the staging itself. */
  world?(p: string): string;
  /** Wires the staging up; the returned function draws its own parts in beats 4 and 5. */
  bind(c: Ctx): (t4: number, t5: number, k: number) => void;
}

/* ---------------------------------------------------------------- beat 3: the red drop (stage units) */

const RD = { x0: 950, x1: 1502, nm0: 600, nm1: 720, y0: 560 };
const rdX = (nm: number): number => RD.x0 + ((nm - RD.nm0) / (RD.nm1 - RD.nm0)) * (RD.x1 - RD.x0);
const rdQ = (q: number): number => RD.y0 - q * 2500;      // O₂ per absorbed photon, 0–0.12
const rdA = (a: number): number => RD.y0 - a * 280;       // light absorbed, relative, peak 1
/** O₂ per absorbed photon, Chlorella (after Emerson & Lewis 1943, Fig. 1, and Emerson et al. 1957, Fig. 2): ≈ 0.1 to 680 nm, then falling. */
const YIELD: Array<[number, number]> = [[600, 0.095], [620, 0.098], [640, 0.1], [660, 0.101], [675, 0.1], [680, 0.097], [685, 0.088], [690, 0.065], [695, 0.04], [700, 0.022], [705, 0.011], [710, 0.005], [720, 0.002]];
/** Light absorbed by the cells' chlorophyll (relative, approximate: Chl a red band at 678 nm, Chl b shoulder at 650 nm,
 *  vibronic band at 620 nm, the long-wave tail of PSI's red chlorophylls): about a quarter of the peak at 700 nm. */
const gs = (x: number, m: number, w: number): number => Math.exp(-((x - m) ** 2) / (2 * w * w));
const absRaw = (x: number): number => gs(x, 678, 11) + 0.45 * gs(x, 650, 10) + 0.25 * gs(x, 620, 15) + 0.12 * gs(x, 705, 10);
const ABS_NM = Array.from({ length: 49 }, (_, i) => 600 + i * 2.5), ABS_MAX = Math.max(...ABS_NM.map(absRaw));
function redDropSvg(p: string): string {
  const yq = YIELD.map(([nm, q]): V => [rdX(nm), rdQ(q)]);
  const ya = ABS_NM.map((nm): V => [rdX(nm), rdA(absRaw(nm) / ABS_MAX)]);
  const area = `${curve(ya)}L${f1(rdX(720))},${RD.y0}L${f1(rdX(600))},${RD.y0}Z`;
  return `<defs>${revealClip(p, 'rdc1', RD.x0 - 8, rdA(1.1), RD.y0 - rdA(1.1) + 10)}${revealClip(p, 'rdc2', RD.x0 - 8, rdA(1.1), RD.y0 - rdA(1.1) + 10)}</defs>
    ${ptext(1192, 84, 'The red drop', 'pm-h')}${ptext(1192, 112, 'O₂ per absorbed photon', 'pm-t')}
    ${ptext(1192, 140, 'after Emerson &amp; Lewis 1943', 'pm-s')}${ptext(1192, 162, 'and Emerson et al. 1957', 'pm-s')}
    <g data-k="rd-band" opacity="0" display="none"><rect class="pm-band-fr" x="${f1(rdX(680))}" y="${f1(rdA(1.08))}" width="${f1(rdX(720) - rdX(680))}" height="${f1(RD.y0 - rdA(1.08))}"/>
      ${ptext((rdX(680) + rdX(720)) / 2, rdA(1.08) - 8, 'red drop', 'pm-t pm-fr', 'middle')}</g>
    <g clip-path="url(#${p}-rdc2)"><path class="pm-abs" d="${area}"/></g>
    <g data-k="rd-labs" opacity="0" display="none">${ptext(rdX(604), rdA(0.5), 'light absorbed', 'pm-t pm-absl')}</g>
    <path class="pm-axis" d="M${RD.x0},${f1(rdQ(0.12))}V${RD.y0}H${RD.x1 + 6}"/>
    ${[0, 0.05, 0.1].map(q => `<path class="pm-tk" d="M${RD.x0 - 6},${f1(rdQ(q))}h6"/>${ptext(RD.x0 - 10, rdQ(q) + 5, q === 0 ? '0' : q.toFixed(2), 'pm-tick', 'end')}`).join('')}
    <text class="pm-ax" transform="translate(${RD.x0 - 54} ${f1(rdQ(0.06))}) rotate(-90)" text-anchor="middle">O₂ per absorbed photon</text>
    <g clip-path="url(#${p}-rdc1)"><path class="pm-cv" d="${curve(yq)}"/></g>
    <g data-k="rd-labq" opacity="0" display="none">${ptext(rdX(604), rdQ(0.106), 'O₂ per photon', 'pm-t')}</g>
    ${wlStrip(p, 'rdwl', RD.x0, RD.x1, RD.y0 + 6, 22, 600, 720, [[600, '#e2581d'], [650, '#d0401f'], [684, '#c8361e'], [700, '#7a1f17'], [720, '#5e1811']], [[660, 'red'], [705, 'far-red']])}
    ${[600, 640, 680, 720].map(nm => ptext(rdX(nm), RD.y0 + 48, String(nm), 'pm-tick', 'middle')).join('')}
    ${ptext((RD.x0 + RD.x1) / 2, RD.y0 + 72, 'wavelength (nm)', 'pm-ax', 'middle')}
    <g data-k="rd-note" opacity="0" display="none">${ptext(1556, 668, '<tspan class="pm-fr">far-red</tspan> pushes mostly <tspan class="pm-i">PSI</tspan>; its hole pulls,', 'pm-say', 'end')}
      ${ptext(1556, 696, 'but <tspan class="pm-ii">PSII</tspan> pushes nothing in → the relay stalls', 'pm-say', 'end')}</g>`;
}

/* ---------------------------------------------------------------- beats 4–5: the rule, the note, the photon table */

function relaySvg(): string {
  const L = (y: number, t: string, k = ''): string => ptext(886, y, t, `pm-say${k}`);
  return `<g data-k="relay" opacity="0" display="none">${ptext(886, 84, 'Push and pull', 'pm-h')}
    <g data-k="rw0" opacity="0" display="none">${L(132, 'Light lifts a reaction centre’s electron away:')}${L(160, 'it is <tspan class="pm-b">PUSHED</tspan> out, and the hole it leaves')}${L(188, '<tspan class="pm-b">PULLS</tspan> an electron in.')}</g>
    <g data-k="rw2" opacity="0" display="none">${L(256, '<tspan class="pm-ii">PSII</tspan>: strong pull (from water),')}${L(284, 'weak push (only to plastoquinone)')}</g>
    <g data-k="rw1" opacity="0" display="none">${L(346, '<tspan class="pm-i">PSI</tspan>: weak pull (only from plastocyanin),')}${L(374, 'strong push (up to ferredoxin → NADPH)')}</g>
    <g data-k="rw3" opacity="0" display="none">${L(446, 'PSII’s push feeds PSI’s pull: <tspan class="pm-b">a relay</tspan>.')}</g></g>`;
}
function ruleSvg(): string {
  return `<g data-k="rule" opacity="0" display="none">${ptext(1192, 58, 'Each electron must pass through', 'pm-rl')}${ptext(1192, 81, 'both photosystems, so the photosystem', 'pm-rl')}
    ${ptext(1192, 104, 'with fewer photons sets the pace.', 'pm-rl')}
    ${ptext(1192, 129, 'each linked pair = one relay run', 'pm-xs')}${ptext(1192, 148, '4 e⁻ per O₂ · photon split illustrative', 'pm-xs')}</g>
    <g data-k="pnote" opacity="0" display="none">${ptext(1192, 174, '<tspan class="pm-ii">PSII</tspan> alone (no PSI): stops once', 'pm-note')}${ptext(1192, 193, 'plastoquinone is full → ≈ 0 O₂', 'pm-note')}
    ${ptext(1192, 212, '<tspan class="pm-i">PSI</tspan> alone: never makes O₂', 'pm-note')}</g>`;
}
/** Columns of the photon rows (stage units). */
const TX = { lab: 886, dot: 1084, dx: 22, e: 1340, tally: 1432, tdx: 20, bar: 20 };
/** The photon rows of beat 4: per light, PSII's photons over PSI's, paired off one-to-one (a link per electron through),
 *  the unpaired greyed as wasted; the electron count; per staging a tally of e⁻ (dots), bars, or nothing. */
function tableSvg(p: string, t: Table): string {
  const ry = (r: number): number => t.y0 + 44 + r * t.rowH;
  const head = `${ptext(TX.lab, t.y0 + 8, 'light', 'pm-s')}${ptext(TX.dot, t.y0 + 8, 'photons caught', 'pm-s')}${ptext(TX.e, t.y0 + 8, 'e⁻ through', 'pm-s')}
    <path class="pm-rule" d="M${TX.lab},${t.y0 + 18}H1562"/>`;
  const rows = ROWS.map((w, r) => {
    const y = ry(r), y2 = y - 12, y1 = y + 12;
    const dots = (n: number, yy: number, k: 'ii' | 'i'): string => Array.from({ length: n }, (_, j) =>
      `<circle data-k="td${r}${k}${j}" opacity="0" display="none" class="pm-ph pm-ph-${k}" cx="${TX.dot + j * TX.dx}" cy="${yy}" r="7"/>`).join('');
    const links = Array.from({ length: w.e }, (_, j) => `<path data-k="tk${r}-${j}" opacity="0" display="none" class="pm-link" d="M${TX.dot + j * TX.dx},${y2 + 7}V${y1 - 7}"/>`).join('');
    const waste = w.ii + w.i - 2 * w.e;
    const tally = t.o2 === 'dots'
      ? Array.from({ length: w.e }, (_, j) => `<circle data-k="to${r}-${j}" opacity="0" display="none" class="pm-e" cx="${TX.tally + 8 + j * TX.tdx}" cy="${y}" r="7"/>`).join('')
      : t.o2 === 'bars'
        ? `<rect data-k="tob${r}" class="${r === 0 ? 'pm-bar-fr' : r === 1 ? 'pm-bar-red' : ''}" ${r === 2 ? `fill="url(#${p}-both)"` : ''} x="${TX.tally}" y="${y - 11}" width="0" height="22"/>`
        : '';
    return `<g data-k="tr${r}" opacity="0" display="none">
      ${ptext(TX.lab, y - 2, w.lab, 'pm-t')}${ptext(TX.lab, y + 19, `${w.n} photons`, 'pm-s')}
      ${ptext(TX.dot - 14, y2 + 5, 'PSII', 'pm-xs pm-ii', 'end')}${ptext(TX.dot - 14, y1 + 5, 'PSI', 'pm-xs pm-i', 'end')}
      ${links}${dots(w.ii, y2, 'ii')}${dots(w.i, y1, 'i')}
      <g data-k="tw${r}" opacity="0" display="none">${ptext(TX.dot - 7, y1 + 26, `${waste} photons wasted`, 'pm-xs pm-waste')}</g>
      <g data-k="te${r}" opacity="0" display="none">${ptext(TX.e, y + 7, `→ <tspan class="pm-b">${w.e}</tspan> e⁻`, 'pm-t')}</g>
      ${tally}</g>`;
  }).join('');
  const sum = `<g data-k="tsum" opacity="0" display="none">${ptext(TX.e, ry(2) + 30, 'more than 1 + 3 = 4', 'pm-xs')}</g>`;
  return `<defs><linearGradient id="${p}-both" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#c8361e"/><stop offset="1" stop-color="#7a1f17"/></linearGradient></defs>${head}${rows}${sum}`;
}

/* ---------------------------------------------------------------- beat 2: the per-O₂ readout (stage units) */

/** Per O₂ (4 e⁻), what each part of photosystem I's side handles (lecturer's rule: every component shows its per-O₂
 *  electrons and H⁺): 4 photons at PSI move 4 e⁻; 4 ferredoxins carry 1 e⁻ each; FNR takes 4 e⁻ + 2 H⁺ from the stroma
 *  and makes 2 NADPH (NADP⁺ + 2 e⁻ + H⁺ → NADPH, twice). Fixed top left of the close view; rows fill as beat 2 plays. */
const RO = { x: 24, y: 18, w: 440, pad: 14 };
/** The readout's counts, as the story stands at a time: photons absorbed and e⁻ sent by PSI, e⁻ taken by ferredoxins,
 *  e⁻ given to FNR, NADPH made. */
const cnt = (ts: number[], t: number): number => ts.filter(x => t >= x).length;
function readoutSvg(): string {
  const y0 = RO.y + RO.pad + 22, dy = 32;
  return `<g class="fig" data-k="ro" opacity="0" display="none">
    <rect class="pm-lgp" x="${RO.x}" y="${RO.y}" width="${RO.w}" height="${RO.pad * 2 + 22 + 3 * dy + 4}" rx="14"/>
    ${ptext(RO.x + RO.pad, y0, 'per O₂ (4 e⁻)', 'pm-lgh')}
    <g data-k="ro1" opacity="0" display="none"><text class="pm-lg" data-k="ro1t" x="${RO.x + RO.pad}" y="${y0 + dy}">photosystem I: 4 e⁻ (4 photons)</text></g>
    <g data-k="ro2" opacity="0" display="none"><text class="pm-lg" data-k="ro2t" x="${RO.x + RO.pad}" y="${y0 + 2 * dy}">ferredoxin: 4 e⁻ (4 Fd)</text></g>
    <g data-k="ro3" opacity="0" display="none"><text class="pm-lg" data-k="ro3a" x="${RO.x + RO.pad}" y="${y0 + 3 * dy}">FNR: 4 e⁻ + 2</text>
      <g data-k="ro3h">${hring(0, 0, 11.5)}</g><text class="pm-lg" data-k="ro3b" x="0" y="${y0 + 3 * dy}">(stroma) → 2 NADPH</text></g>
  </g>`;
}

/* ---------------------------------------------------------------- beats 3–5: the Z-scheme (stage units) */

/** The Z-scheme (Hill & Bendall 1960), energy up, levels by approximate midpoint potentials (V; more negative = up): P680
 *  +1.2, H₂O/O₂ +0.82, PQ +0.1, cytochrome f +0.35, plastocyanin +0.37, P700 +0.45, P700* ≈ −1.3, P680* ≈ −0.8, ferredoxin
 *  −0.42, NADP⁺/NADPH −0.32 (Govindjee, Shevela & Björn 2017, Photosynth Res 133:5, Fig. 6); no numbers shown. */
const zy = (e: number): number => 300 + 150 * e;
const ZX = { ax: 904, h2o: 962, p680: 1036, pq: 1176, b6f: 1252, pc: 1322, p700: 1404, fd: 1494, nad: 1536 };
const ZP = {
  h2o: [ZX.h2o, zy(0.86)] as V, p680: [ZX.p680, zy(1.2)] as V, p680s: [ZX.p680, zy(-0.8)] as V, pq: [ZX.pq, zy(0.1)] as V,
  b6f: [ZX.b6f, zy(0.35)] as V, pc: [ZX.pc, zy(0.38)] as V, p700: [ZX.p700, zy(0.45)] as V, p700s: [ZX.p700, zy(-1.3)] as V,
  fd: [ZX.fd, zy(-0.42)] as V, nad: [ZX.nad, zy(-0.3)] as V,
};
const ZPATH: V[] = [ZP.h2o, ZP.p680, ZP.p680s, ZP.pq, ZP.b6f, ZP.pc, ZP.p700, ZP.p700s, ZP.fd, ZP.nad];
/** Beat 3's run on the Z (s into beat 3), in step with the run on the chain (RELAY_T). */
const ZRUN_T = [2.0, 2.45, 2.8, 3.15, 3.4, 3.6, 3.9, 4.5, 4.75, 5.4];
function zDown(a: V, b: V, ax = 0, bx = 0): string {
  const p0: V = [a[0] + ax, a[1] + 8], q0: V = [b[0] + bx, b[1] - 11], d: V = [q0[0] - p0[0], q0[1] - p0[1]], L = Math.hypot(d[0], d[1]);
  const e: V = [q0[0] - (d[0] / L) * 10, q0[1] - (d[1] / L) * 10];
  return `<path class="pm-zgrey" d="M${f1(p0[0])},${f1(p0[1])}L${f1(e[0])},${f1(e[1])}"/>${head(q0, d, 'pm-zgreyh', 12, 6.5)}`;
}
function zLift(k: string, lo: V, hi: V, cls: string): string {
  const dd = `M${lo[0]},${lo[1] - 8}V${hi[1] + 24}`, h = (c: string): string => head([lo[0], hi[1] + 8], [0, -1], c, 22, 13);
  return `<path class="pm-lift-off" d="${dd}"/>${h('pm-lift-offh')}<g data-k="${k}" opacity="0" display="none"><path class="${cls}" d="${dd}"/>${h(`${cls}h`)}</g>`;
}
function zSvg(): string {
  const lvl = (c: V, cls: string, w = 60): string => `<rect class="pm-lvl ${cls}" x="${f1(c[0] - w / 2)}" y="${f1(c[1] - 7)}" width="${w}" height="14" rx="5"/>`;
  const car = (c: V, kind: 'pc' | 'fd'): string => `<g class="chn-on">${carrierImg(kind, c[0], c[1], 0.8)}</g>`;
  return `<g data-k="zs" opacity="0" display="none">
    <path class="pm-axis" d="M${ZX.ax},${zy(1.32)}V${zy(-1.4) + 10}"/>${head([ZX.ax, zy(-1.4)], [0, -1], 'pm-axh', 13, 7)}
    <text class="pm-ax" transform="translate(${ZX.ax - 12} ${zy(0)}) rotate(-90)" text-anchor="middle">energy</text>
    ${zDown(ZP.h2o, ZP.p680, 16, -20)}${zDown(ZP.p680s, ZP.pq, 30, -18)}${zDown(ZP.pq, ZP.b6f, 22, -14)}${zDown(ZP.b6f, ZP.pc, 18, -14)}${zDown(ZP.pc, ZP.p700, 16, -20)}${zDown(ZP.p700s, ZP.fd, 30, -10)}${zDown(ZP.fd, ZP.nad, 14, -6)}
    ${zLift('zl2', ZP.p680, ZP.p680s, 'pm-lift-red')}${zLift('zl1', ZP.p700, ZP.p700s, 'pm-lift-fr')}
    ${lvl(ZP.p680, 'pm-lvl-ii')}${lvl(ZP.p680s, 'pm-lvl-ii')}${lvl(ZP.p700, 'pm-lvl-i')}${lvl(ZP.p700s, 'pm-lvl-i')}
    <g class="chn-on"><ellipse class="chn-body chn-pq" cx="${ZP.pq[0]}" cy="${ZP.pq[1]}" rx="18" ry="9"/><ellipse class="chn-body chn-b6f" cx="${ZP.b6f[0]}" cy="${ZP.b6f[1]}" rx="20" ry="11"/></g>
    ${car(ZP.pc, 'pc')}${car(ZP.fd, 'fd')}
    <g transform="translate(${ZP.h2o[0]} ${ZP.h2o[1] - 4}) scale(1.2)">${waterG(0, 0)}</g>${ptext(ZP.h2o[0], ZP.h2o[1] + 34, 'H₂O', 'pm-xs', 'middle')}
    ${ptext(ZP.p680[0] + 38, ZP.p680[1] + 6, 'P680', 'pm-xs')}${ptext(ZP.p700[0] + 38, ZP.p700[1] + 6, 'P700', 'pm-xs')}
    ${ptext(ZP.pq[0], ZP.pq[1] + 30, 'PQ', 'pm-xs', 'middle')}${ptext(ZP.b6f[0], ZP.b6f[1] + 32, 'b₆f', 'pm-xs', 'middle')}${ptext(ZP.pc[0], ZP.pc[1] + 34, 'PC', 'pm-xs', 'middle')}
    ${ptext(ZP.fd[0] + 22, ZP.fd[1] - 14, 'Fd', 'pm-xs')}
    ${ptext(ZP.p680[0] + 16, zy(0.2), 'PSII', 'pm-h pm-ii')}${ptext(ZP.p680[0] + 16, zy(0.2) + 24, 'red light', 'pm-t pm-red')}
    ${ptext(ZP.p700[0] - 16, zy(-0.66), 'PSI', 'pm-h pm-i', 'end')}${ptext(ZP.p700[0] - 16, zy(-0.66) + 24, 'far-red light', 'pm-t pm-fr', 'end')}
    <g transform="translate(${ZP.nad[0]} ${ZP.nad[1] + 28})"><g data-k="znadp">${tagG(0, 0, 'NADP⁺', 'plain')}</g><g data-k="znadph" opacity="0" display="none">${tagG(0, 0, 'NADPH', 'nadph')}</g></g>
    ${ptext(1560, 46, 'Z-scheme, after Hill &amp; Bendall 1960', 'pm-xs', 'end')}
    <circle data-k="zring" opacity="0" display="none" class="pm-ring" cx="${ZP.p700[0]}" cy="${ZP.p700[1]}" r="8"/>
    ${[0, 1, 2, 3, 4, 5].map(i => `<circle data-k="ze${i}" opacity="0" display="none" class="pm-e" r="7"/>`).join('')}
    <g data-k="zline4" opacity="0" display="none">${ptext(1110, 668, '<tspan class="pm-fr">far-red</tspan> alone: little O₂', 'pm-big')}</g>
    <g data-k="zline5" opacity="0" display="none">${ptext(1110, 668, '<tspan class="pm-red">red</tspan> + <tspan class="pm-fr">far-red</tspan>: much more O₂', 'pm-big')}</g>
  </g>`;
}
/** Emerson's clipping, small, bottom left of the panel (beat 5). */
function clipSmall(p: string): string {
  const x = 870, y = 584, w = 220, h = 128, pw = 78, ph = 98, px = x + 12, py = y + 14, rx = (px + pw + x + w) / 2;
  return `<g transform="rotate(-1.4 ${x + w / 2} ${y + h / 2})">
    <defs><filter id="${p}-clsh" x="-10%" y="-10%" width="120%" height="130%"><feDropShadow dx="1" dy="3" stdDeviation="4" flood-color="#3d3020" flood-opacity=".22"/></filter></defs>
    <path class="clip-paper" d="${cutPath(x, y, w, h, 53, 3)}" filter="url(#${p}-clsh)"/>
    <image href="${emersonImg}" x="${px}" y="${py}" width="${pw}" height="${ph}" preserveAspectRatio="xMidYMid slice"/>
    <text class="clip-name pm-cname-s" x="${f1(rx)}" y="${py + 44}" text-anchor="middle">Emerson</text>
    <text class="clip-find pm-cyear-s" x="${f1(rx)}" y="${py + 80}" text-anchor="middle">1957</text></g>`;
}

/* ---------------------------------------------------------------- the staging */

export function makeStaging(o: Ill): Staging {
  const P = `pm${o.id}`;
  const { svg: chain, pcLab } = scene(`${P}c`, P);
  // plastocyanin's label: below it, closer in the close view (its text is counter-scaled)
  const LAB_OFF0: V = [pcLab[0] - PC[0], pcLab[1] - PC[1]], LAB_OFFZ: V = [0, 31];
  const TEND = [B1.end, B2.end, BP.end, B3.end, B4.end];

  return {
    id: o.id,
    name: o.name,
    note: o.note,
    beats: o.beats,
    holds: [[B1.named, B1.jumped], [B2.named, B2.two], [BP.hold], [], HOLDS4],
    svg: () => `
      <g data-k="cam"><g class="fig">
        <defs><filter id="${P}-sl" x="-5%" y="-5%" width="110%" height="112%"><feDropShadow dx="0" dy="8" stdDeviation="9" flood-color="#46321a" flood-opacity=".14"/></filter></defs>
        <rect class="pm-slidecard" x="${CARD.x}" y="${CARD.y}" width="${CARD.w}" height="${CARD.h}" rx="${CARD.r}" filter="url(#${P}-sl)"/>
        <g data-k="chain" class="chn chn-pdb-bilayer chn-fx">${chain}</g>
        ${overlaySvg(P, o)}
      </g></g>
      <g data-k="panel" opacity="0" display="none">
        <defs><filter id="${P}-psh" x="-5%" y="-5%" width="110%" height="112%"><feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#46321a" flood-opacity=".16"/></filter></defs>
        <rect class="pm-panel" x="${PANEL.x}" y="${PANEL.y}" width="${PANEL.w}" height="${PANEL.h}" rx="22" filter="url(#${P}-psh)"/>
        <g class="fig">${zSvg()}</g>
      </g>
      <g data-k="clip" opacity="0" display="none">${clipSmall(P)}</g>
      ${readoutSvg()}`,

    bind(stage) {
      const { q, set, op } = setters(stage);
      const chainG = q('chain');
      const parts = (p: string): SVGGElement[] => Array.from(chainG.querySelectorAll<SVGGElement>(`[data-p="${p}"]`));
      // counter-scaled: texts outside glyph groups (about their anchor), glyph groups (about their centre)
      const texts = Array.from(chainG.querySelectorAll<SVGTextElement>('text')).filter(el => !el.closest('.chn-g'))
        .map(el => ({ el, x: Number(el.getAttribute('x')), y: Number(el.getAttribute('y')) }));
      const groups = Array.from(chainG.querySelectorAll<SVGGElement>('g.chn-g')).filter(el => !el.parentElement?.closest('.chn-g')).map(el => {
        let c: V = [0, 0];
        try { const bb = el.getBBox(); c = [bb.x + bb.width / 2, bb.y + bb.height / 2]; } catch { /* not laid out */ }
        if (!c[0] && !c[1]) { const ci = el.querySelector('circle'); if (ci) c = [Number(ci.getAttribute('cx')), Number(ci.getAttribute('cy'))]; }
        return { el, c };
      });
      const textIn = (p: string, s: string): SVGTextElement[] => parts(p).flatMap(g => Array.from(g.querySelectorAll('text'))).filter(t => t.textContent === s);
      const light1 = parts('light-psi'), light2 = parts('light-psii');
      light1.forEach(g => g.setAttribute('clip-path', `url(#${P}-lclip)`));
      const flows = ['e-psi-fd', 'e-fd-fnr', 'e-fnr-nadph', 'nadph'].flatMap(parts), ePcPsi = parts('e-pc-psi');
      const pcW = parts('pc'), pcBody = [...pcW.filter(g => !g.querySelector('text')), ...parts('pc-glow-amb')], pcText = pcW.filter(g => g.querySelector('text'));
      const psiiLit = parts('psii-lit'), atpsLit = parts('atps-lit');
      const fdText = textIn('fd', 'ferredoxin'), fnrText = textIn('fnr', 'FNR'), names = [...textIn('psii', 'photosystem II'), ...textIn('psii-lit', 'photosystem II'), ...textIn('psi', 'photosystem I')];
      const gl = (p: string, g: Glow): SVGGElement[] => parts(`${p}-glow-${g}`);
      /** A world glyph at figure point at, scaled sc, at opacity o. */
      const put = (k: string, at: V, sc: number, o2: number): void => {
        const el = q(k);
        op(el, o2);
        if (o2 > 0.004) set(el, 'transform', `translate(${f1(at[0])} ${f1(at[1])}) scale(${sc.toFixed(4)})`);
      };
      const shift = (els: Element[], d: V): void => els.forEach(el => set(el, 'transform', `translate(${d[0].toFixed(2)} ${d[1].toFixed(2)})`));
      /** A wave drawn in from above by time u (0 → 1) of its reveal. */
      const reveal = (k: string, top: number, bot: number, u: number): void => set(q(k), 'height', f1(lerp(top, bot, smooth(u)) + 200));
      /** A leader at opacity o, its text scaled k. */
      const lead = (key: string, o2: number, k: number): void => {
        const l = LEADS[key], g = q(`ld-${key}`);
        op(g, o2);
        if (o2 < 0.004) return;
        const a: V = [l.at[0] + l.off[0] * k, l.at[1] + l.off[1] * k], d = `M${f1(a[0])},${f1(a[1])}L${f1(l.to[0])},${f1(l.to[1])}`;
        set(q(`ld-${key}-h`), 'd', d);
        set(q(`ld-${key}-p`), 'd', d);
        const dot = q(`ld-${key}-d`);
        set(dot, 'cx', f1(l.to[0])); set(dot, 'cy', f1(l.to[1])); set(dot, 'r', (3.2 * k).toFixed(2));
        set(q(`ld-${key}-t`), 'transform', `translate(${f1(l.at[0])} ${f1(l.at[1])}) scale(${k.toFixed(4)})`);
      };
      const fdBody = [...parts('fd').filter(g => !g.querySelector('text')), ...parts('fd-glow-amb')];
      const ill = o.bind({ q, set, op, put });
      // the readout's last row: text, ringed H⁺, text, laid out by the measured width of the first run
      let ro3s = '';
      const ro3 = (): void => {
        const a = q<SVGTextElement>('ro3a'), y = Number(a.getAttribute('y'));
        let w = 150;
        try { const m = a.getComputedTextLength(); if (m > 0) w = m; } catch { /* not laid out */ }
        const hx = RO.x + RO.pad + w + 6 + 11.5;
        q('ro3h').setAttribute('transform', `translate(${f1(hx)} ${f1(y - 7)})`);
        q('ro3b').setAttribute('x', f1(hx + 11.5 + 6));
      };
      ro3();
      void document.fonts?.ready.then(ro3);

      let last = '';
      return (beatIn, t) => {
        const b = Math.max(0, Math.min(4, Math.round(beatIn)));
        const tt = Math.max(0, Math.min(t, TEND[b]));
        const key = `${b}:${tt.toFixed(3)}`;
        if (key === last) return;
        last = key;
        /** Seconds into beat n: −1 before it begins, 99 after it. */
        const T = (n: number): number => (b === n ? tt : b > n ? 99 : -1);
        const t1 = T(0), t2 = T(1), tp = T(2), tr = T(3), te = T(4);

        /* ---- camera: B → Z (beat 1), Z → E (beat 3, push and pull), E → B (end of beat 5) */
        const zin = mv(t1, B1.zoom, B1.zoomD), zE = mv(tp, BP.out, BP.outD), zOut = mv(te, B4.out, 1.2);
        const cam = zOut > 0 ? tween(E, B, zOut) : zE > 0 ? tween(Z, E, zE) : tween(B, Z, zin);
        const k = kOf(cam.s);
        set(q('cam'), 'transform', tfStr(cam));
        texts.forEach(({ el, x, y }) => set(el, 'transform', `matrix(${k.toFixed(4)},0,0,${k.toFixed(4)},${(x * (1 - k)).toFixed(2)},${(y * (1 - k)).toFixed(2)})`));
        groups.forEach(({ el, c }) => set(el, 'transform', `matrix(${k.toFixed(4)},0,0,${k.toFixed(4)},${(c[0] * (1 - k)).toFixed(2)},${(c[1] * (1 - k)).toFixed(2)})`));
        // the close view's own zone labels
        const zl = tw(t1, 0.95, 1.2) * (1 - tw(tp, 0, 0.3));
        put('zl-stroma', ZL.stroma, k, zl);
        put('zl-lumen', ZL.lumen, k, zl);

        /* ---- the slide's lit arrows of photosystem I give way while the story tells them, and return in beat 3 */
        const flowsOp = b === 0 ? 1 - tw(tt, B1.flowsOut[0], B1.flowsOut[1]) : b === 1 ? 0 : tw(tp, BP.flowsIn[0], BP.flowsIn[1]);
        flows.forEach(g => op(g, flowsOp));
        ePcPsi.forEach(g => op(g, 0)); // plastocyanin is docked from the first frame: its arrow from the slide place has no start
        // light at photosystem I: the slide's wave, cleared, then drawn in from above when light arrives (beat 1); off in
        // beats 3–4 (red and far-red instead) until the zoom out ends
        const lightBack = tw(te, B4.out + 1.2, B4.out + 1.6);
        let l1Op = 0, l1Y = 1000;
        if (b === 0) {
          if (tt < B1.light - 0.05) l1Op = 1 - tw(tt, B1.flowsOut[0], B1.flowsOut[1]);
          else if (tt < SW[1]) { l1Op = 1 - tw(tt, B1.jump + 0.5, B1.jump + 0.8); l1Y = lerp(88, 250, smooth((tt - B1.light) / 0.45)); }
          else l1Op = tw(tt, SW[1], SW[1] + 0.3) * (1 - tw(tt, J[3] + 0.5, J[3] + 0.8)); // turnovers 2–4: the light stays on
        } else if (b === 4) l1Op = lightBack;
        light1.forEach(g => op(g, l1Op));
        set(q('lclip'), 'height', f1(l1Y + 200));
        // light at photosystem II (dimmed on slide 9) would be cut by the close view's edge: it goes as the camera zooms in
        light2.forEach(g => op(g, b < 2 ? 1 - tw(t1, B1.zoom, B1.zoom + 0.4) : b === 4 ? lightBack : 0));

        /* ---- plastocyanin: docked under photosystem I from the first frame to the last */
        const dPc: V = [DOCK[0] - PC[0], DOCK[1] - PC[1]];
        shift(pcBody, dPc);
        // beats 1–2 are told by the numbered copies; the slide's own plastocyanin (docked) and ferredoxin return in beat 3
        const own = b < 2 ? 0 : b === 2 ? tw(tp, 0, 0.3) : 1;
        pcBody.forEach(g => op(g, own)); fdBody.forEach(g => op(g, own));
        const zc = b === 0 ? zin : b === 1 ? 1 : b === 2 ? 1 - zE : 0; // (beats 4–5: the slide's offset)
        const lo = lerpV(LAB_OFF0, LAB_OFFZ, zc);
        shift(pcText, [DOCK[0] + lo[0] - pcLab[0], DOCK[1] + lo[1] - pcLab[1]]);

        /* ---- point, then do: leaders and brief glows (beats 1–2) */
        const ldOut = 1 - tw(tp, 0, 0.3);
        lead('psi', tw(t1, B1.psi, B1.psi + 0.3) * ldOut, k);
        lead('rc', tw(t1, B1.rc, B1.rc + 0.3) * ldOut, k);
        lead('fd', tw(t1, B1.fd, B1.fd + 0.3) * ldOut, k);
        lead('fnr', tw(t2, B2.fnr, B2.fnr + 0.3) * ldOut, k);
        fdText.forEach(el => op(el, b === 0 ? 1 - tw(tt, B1.fd, B1.fd + 0.3) : b === 1 ? 0 : tw(tp, 0, 0.3)));
        // the slide's short FNR name (beside FNR) gives way in the close view, under the longer FNR leader
        fnrText.forEach(el => op(el, b === 0 ? 1 - tw(tt, B1.zoom, B1.zoom + 0.4) : b === 1 ? 0 : tw(tp, 0, 0.3)));

        /* ---- beats 3–5: the light on the chain (common), the panel, the staging's own parts */
        const L = b === 2 ? lightAt(LIGHT_S, tp) : b === 3 ? lightAt(LIGHT_D, tr) : b === 4 ? lightAt(LIGHT_E, te) : lightAt([], 0);
        void ill;
        const runs = (1 - tw(te, B4.out, B4.out + 0.3));
        // glows: named (beats 1–2), then each photosystem in the light it absorbs (beats 3–4)
        const g = (els: SVGGElement[], v: number): void => els.forEach(el => op(el, v));
        g(gl('psi', 'amb'), b === 0 ? named(tt, B1.psi) : 0);
        g(gl('fnr', 'amb'), b === 1 ? named(tt, B2.fnr) : 0);
        g(gl('psii', 'red'), L.glowR2 * runs);
        g(gl('psii', 'fr'), (L.glowF2 ?? 0) * runs);
        g(gl('psi', 'red'), L.glowR1 * runs);
        g(gl('psi', 'fr'), L.glowF1 * runs);
        // the red and far-red waves (beats 3–4), drawn in from their source
        const wv = (kk: string, ck: string, w: [V, V], u: number, o2 = 1): void => {
          op(q(kk), (u > 0 ? 1 : 0) * o2 * runs);
          reveal(ck, w[0][1] - 6, w[1][1], u);
        };
        wv('w-r2', 'cw-r2', W_R2, L.red, L.redOp);
        wv('w-r1', 'cw-r1', W_R1, L.red1 ?? L.red, L.redOp);
        wv('w-f1', 'cw-f1', W_F1, L.far, L.farOp);
        // the lamps (m1) or the light labels, shown from the opening of beat 3 to the zoom out
        const lampOp = (b === 2 ? tw(tp, BP.names[0], BP.names[1]) : b > 2 ? 1 : 0) * runs;
        if (o.lamps) {
          put('lamp-red', LAMP_R, k, lampOp);
          put('lamp-fr', LAMP_F, k, lampOp);
          put('lglow-red', [LAMP_R[0], LAMP_R[1] + 8], k, lampOp * smooth(L.red * 3) * (L.redOp ?? 1));
          put('lglow-fr', [LAMP_F[0], LAMP_F[1] + 8], k, lampOp * smooth(L.far * 3) * (L.farOp ?? 1));
          q('lamp-red').querySelector('.pm-lens')?.classList.toggle('pm-on', L.red > 0 && (L.redOp ?? 1) > 0.5);
          q('lamp-fr').querySelector('.pm-lens')?.classList.toggle('pm-on', L.far > 0 && (L.farOp ?? 1) > 0.5);
        }
        put('ll-red', LL_R, k, lampOp);
        put('ll-fr', LL_F, k, lampOp);
        // both photosystems named; PSII lights for beats 3–4
        // (the slide's own names give way first and return only after these have gone, so the two never overlap)
        const namesOp = b === 2 ? tw(tt, BP.names[0], BP.names[1]) : b === 3 ? 1 : b === 4 ? 1 - tw(tt, B4.out + 0.6, B4.out + 0.8) : 0;
        const slideNames = b === 2 ? 1 - tw(tt, BP.names[0] - 0.2, BP.names[0]) : b === 3 ? 0 : b === 4 ? tw(tt, B4.out + 0.8, B4.out + 1.0) : 1;
        put('lab-psii', [112, 505], k, namesOp);
        put('lab-psi', [422, 505], k, namesOp);
        names.forEach(el => op(el, slideNames));
        psiiLit.forEach(el => op(el, tw(tp, BP.psii[0], BP.psii[1]) * (1 - tw(te, B4.out + 0.3, B4.out + 0.9))));
        // the panel and the clipping
        const panelOp = tw(tp, BP.panel[0], BP.panel[1]) * (1 - tw(te, B4.out, B4.out + 0.35));
        op(q('panel'), panelOp);
        set(q('panel'), 'transform', `translate(${f1(40 * (1 - smooth(tw(tp, BP.panel[0], BP.panel[1]))))} 0)`);
        op(q('clip'), tw(te, B4.clip[0], B4.clip[1]) * (1 - tw(te, B4.out, B4.out + 0.35)));
        // the Z-scheme (beats 3–5): the lifts light with their light; electrons run on it; one line per beat (4, 5)
        op(q('zs'), tw(tp, BP.z[0], BP.z[1]));
        const redZ = b === 2 ? tw(tp, BP.red, BP.red + 0.4) : b === 3 ? 1 - tw(tr, B3.redOff[0], B3.redOff[1]) : b === 4 ? tw(te, B4.red, B4.red + 0.4) : 0;
        const farZ = b === 2 ? tw(tp, BP.far, BP.far + 0.4) : b > 2 ? 1 : 0;
        op(q('zl2'), redZ); op(q('zl1'), farZ);
        const zAt = (k2: string, p: V, o2: number): void => { const el = q(k2); op(el, o2); set(el, 'cx', f1(p[0])); set(el, 'cy', f1(p[1])); };
        // beat 3: one electron, water → NADP⁺; beat 4: P700's electron lifted on to NADP⁺, P700 left empty; beat 5: a stream
        const zRun = along(ZPATH, ZRUN_T, tp);
        zAt('ze0', zRun, b === 2 ? tw(tp, ZRUN_T[0] - 0.2, ZRUN_T[0]) * (1 - tw(tp, ZRUN_T[9], ZRUN_T[9] + 0.25)) : 0);
        const pT = [B3.push, B3.push + 0.55, B3.push + 0.85, B3.push + 1.3];
        zAt('ze1', along([ZP.p700, ZP.p700s, ZP.fd, ZP.nad], pT, tr), b === 3 ? tw(tr, 0.3, 0.5) * (1 - tw(tr, pT[3], pT[3] + 0.25)) : 0);
        op(q('zring'), b === 3 ? tw(tr, B3.push + 0.05, B3.push + 0.15) : b === 4 ? 1 - tw(te, B4.red + 0.9, B4.red + 1.0) : 0);
        const ST = ZRUN_T.map(x => (x - ZRUN_T[0]) * 0.75);
        for (let i = 2; i <= 5; i++) {
          const t0 = B4.red + 0.5 + (i - 2) * 0.55, u = te - t0;
          zAt(`ze${i}`, along(ZPATH, ST, u), b === 4 ? tw(u, -0.2, 0) * (1 - tw(u, ST[9], ST[9] + 0.25)) : 0);
        }
        const nadZ = b === 2 ? tw(tp, ZRUN_T[9], ZRUN_T[9] + 0.3) : b > 2 ? 1 : 0;
        op(q('znadph'), nadZ); op(q('znadp'), 1 - nadZ);
        op(q('zline4'), b === 3 ? tw(tr, B3.line[0], B3.line[1]) : 0);
        op(q('zline5'), b === 4 ? tw(te, B4.line[0], B4.line[1]) : 0);

        /* ---- beat 1: four turnovers at PSI; beat 2: four ferredoxin trips to FNR, two NADPH (all numbered) */
        const vis = b < 2 ? 1 : b === 2 ? 1 - tw(tp, 0, 0.3) : 0;
        // plastocyanin n: 1 docked from the start; 2–4 arrive in turn as the one before leaves; 4 stays
        const pcAt = (n: number): [V, number] => {
          if (b >= 1) return n === 4 ? [DOCK, vis] : [DOCK, 0];
          const tin = n === 1 ? -9 : SW[n - 1], tout = n === 4 ? 99 : SW[n];
          if (tt < tin) return [PC_IN[0], 0];
          if (tt < tin + SWD) { const u = (tt - tin) / SWD; return [along(PC_IN, [0, 0.33, 0.66, 1], u), tw(u, 0, 0.3)]; }
          if (tt < tout) return [DOCK, 1];
          const u = (tt - tout) / SWD;
          return [along(PC_OUT, [0, 0.5, 1], u), 1 - tw(u, 0.5, 1)];
        };
        // ferredoxin n: 1 docked from the start; 2–4 arrive in turn; 1–3 move to wait right of FNR; in beat 2 each brings its
        // e⁻ to FNR and goes (4 returns to the dock and stays)
        const fdAt = (n: number): [V, number] => {
          const spot = n === 4 ? FD : FD_Q[n - 1];
          if (b === 0) {
            const tin = n === 1 ? -9 : SW[n - 1], tout = n === 4 ? 99 : SW[n];
            if (tt < tin) return [FD_IN, 0];
            if (tt < tin + SWD) { const u = smooth((tt - tin) / SWD); return [lerpV(FD_IN, FD, u), tw(u, 0, 0.3)]; }
            if (tt < tout) return [FD, 1];
            return [lerpV(FD, spot, smooth((tt - tout) / SWD)), 1];
          }
          if (b === 1) {
            const d = B2.d[n - 1], away = d + B2.trip + B2.give;
            if (tt < d) return [spot, 1];
            if (tt < d + B2.trip) return [lerpV(spot, FNR_DOCK, smooth((tt - d) / B2.trip)), 1];
            if (tt < away) return [FNR_DOCK, 1];
            const u = smooth((tt - away) / B2.trip);
            return n === 4 ? [lerpV(FNR_DOCK, FD, u), 1] : [lerpV(FNR_DOCK, FD_GONE, u), 1 - u];
          }
          return n === 4 ? [FD, vis] : [FD, 0];
        };
        for (let n = 1; n <= 4; n++) {
          const [pa, po] = pcAt(n), [fa, fo] = fdAt(n);
          put(`pc${n}`, pa, 1, po); put(`tpc${n}`, [pa[0] + 18, pa[1] - 19], k, po);
          put(`fd${n}`, fa, 1, fo); put(`tfd${n}`, [fa[0] + 16, fa[1] - 19], k, fo);
        }
        // named (glows): plastocyanin 1 and ferredoxin 1
        put('gpc1', pcAt(1)[0], 1, b === 0 ? named(tt, B1.pc) : 0);
        put('gfd1', fdAt(1)[0], 1, b === 0 ? named(tt, B1.fd) : 0);
        // the reaction centre: a flash per turnover, the empty place from each jump to its refill
        put('rcglow', P700, k, b === 0 ? Math.max(...J.map(j => pulse(tt, j - 0.1))) : 0);
        put('rcring', P700, k, b === 0 ? Math.max(...J.map((j, i) => tw(tt, j + 0.05, j + 0.12) * (1 - tw(tt, R[i] + RFD[i] - 0.05, R[i] + RFD[i])))) : 0);
        if (b < 3) put('rcdot', P700, k, 0);
        // the electrons: e⁻ 0 starts in P700; e⁻ n (1–4) rides plastocyanin n and refills P700 at turnover n; e⁻ 0–3 jump at
        // turnovers 1–4 to ferredoxins 1–4, ride them, go into FNR (two at a time) and on to NADP⁺; e⁻ 4 stays in P700
        const onPc = (n: number): V => { const a = pcAt(n)[0]; return [a[0] + PC_SPOT[0], a[1] + PC_SPOT[1]]; };
        const onFd = (n: number): V => { const a = fdAt(n)[0]; return [a[0] + FD_SPOT[0], a[1] + FD_SPOT[1]]; };
        for (let e = 0; e <= 4; e++) {
          let at: V = P700, o2 = 0;
          if (b === 0) {
            const rIn = e === 0 ? -9 : R[e - 1], rD = e === 0 ? 0 : RFD[e - 1];
            if (e > 0 && tt < rIn) { at = onPc(e); o2 = pcAt(e)[1]; }
            else if (e > 0 && tt < rIn + rD) { at = lerpV(onPc(e), P700, smooth((tt - rIn) / rD)); o2 = 1; }
            else if (e === 4 || tt < J[e]) { at = P700; o2 = e === 0 ? tw(tt, B1.rc, B1.rc + 0.2) : 1; }
            else if (tt < J[e] + JD[e]) { at = bez(P700, [FAB[0] - 8, FAB[1] - 14], [FD[0] + FD_SPOT[0], FD[1] + FD_SPOT[1]], smooth((tt - J[e]) / JD[e])); o2 = 1; }
            else { at = onFd(e + 1); o2 = 1; }
          } else if (b === 1) {
            if (e === 4) { at = P700; o2 = 1; } else {
              const g0 = B2.d[e] + B2.trip, slot = ON_FNR[e % 2], toN = e < 2 ? B2.toN1 : B2.toN2, merge = e < 2 ? B2.merge1 : B2.merge2;
              if (tt < g0) at = onFd(e + 1);
              else if (tt < toN) at = lerpV(onFd(e + 1), slot, smooth((tt - g0) / B2.give));
              else at = bez(slot, [slot[0] - 10, (slot[1] + AT_NP[e % 2][1]) / 2], AT_NP[e % 2], smoother((tt - toN) / B2.toND));
              o2 = 1 - tw(tt, merge, merge + 0.2);
            }
          } else if (b === 2 && e === 4) { at = P700; o2 = 1 - tw(tp, 0, 0.3); }
          put(`ed${e}`, at, k, o2);
        }
        // the e⁻ label rides electron 0 from P700 to ferredoxin 1
        const eLab = b === 0 ? tw(tt, B1.rc, B1.rc + 0.2) * (1 - tw(tt, J[0] + JD[0] + 0.3, J[0] + JD[0] + 0.6)) : 0;
        const e0: V = b === 0 && tt >= J[0] ? bez(P700, [FAB[0] - 8, FAB[1] - 14], [FD[0] + FD_SPOT[0], FD[1] + FD_SPOT[1]], smooth((tt - J[0]) / JD[0])) : P700;
        put('l-e1', [e0[0] - 4 * k, e0[1] - 4 * k], k, eLab);
        if (b < 3) put('e1', P700, k, 0);

        /* ---- NADP⁺ + 2 e⁻ + H⁺ → NADPH, twice (beat 2); the slide's row takes over in beat 3 */
        const toRow: V = [ROW[0] + ROW_NADPH * k, ROW[1]];
        const glide = mv(tp, 0, 1.0), gone = 1 - tw(tp, 1.0, 1.25);
        const in1 = tw(t2, B2.nIn, B2.nIn + 0.3), m1 = tw(t2, B2.merge1 + 0.05, B2.merge1 + 0.25);
        const in2 = tw(t2, B2.nIn2, B2.nIn2 + 0.3), m2 = tw(t2, B2.merge2 + 0.05, B2.merge2 + 0.25);
        put('nadp1', NP, k, in1 * (1 - tw(t2, B2.merge1, B2.merge1 + 0.15)));
        put('hp1', lerpV(H0, H1, mv(t2, B2.toN1, B2.toND)), k, in1 * (1 - m1));
        put('nadph1', lerpV(lerpV(NP, N1_PARK, mv(t2, B2.park, 0.4)), toRow, glide), k, m1 * gone);
        put('nadp2', NP, k, in2 * (1 - tw(t2, B2.merge2, B2.merge2 + 0.15)));
        put('hp2', lerpV(H0, H1, mv(t2, B2.toN2, B2.toND)), k, in2 * (1 - m2));
        put('nadph2', lerpV(NP, toRow, glide), k, m2 * gone);

        /* ---- the chain in beats 3–5: one electron runs the chain (beat 3); far-red alone, PSI's electron goes and P700 stays
         *  empty, one O₂ (beat 4); with red again, electrons stream and O₂ bubbles from water (beat 5) */
        for (const kk of ['pp-ii', 'pp-i']) op(q(kk), 0);
        for (const kk of ['ppl-ii-push', 'ppl-ii-pull', 'ppl-i-push', 'ppl-i-pull', 'hole2', 'rcglow2', 'stall']) op(q(kk), 0);
        put('erl', along(RELAY, RELAY_T, tp), k, b === 2 ? tw(tp, RELAY_T[0], RELAY_T[0] + 0.2) * (1 - tw(tp, RELAY_T[12], RELAY_T[12] + 0.25)) : 0);
        if (b === 2) put('rcglow', P700, k, pulse(tp, RELAY_T[8] + 0.3));
        const pushed = (tr - B3.push) / 0.55;
        put('hole1', P700, k, b === 3 ? (pushed > 0.05 ? 1 : 0) : b === 4 ? 1 - tw(te, B4.red + 0.9, B4.red + 1.0) : 0);
        if (b === 3) {
          put('rcdot', P700, k, pushed < 0 ? tw(tr, 0.3, 0.5) : 0);
          put('e1', bez(P700, [FAB[0] - 8, FAB[1] - 14], FD, smooth(pushed)), k, pushed < 0 ? 0 : 1 - tw(tr, B3.push + 1.0, B3.push + 1.3));
          put('rcglow', P700, k, pulse(tr, B3.push - 0.05));
        }
        // the stream on the chain (beat 5): four electrons, each along the whole chain
        const CT = RELAY_T.map(x => (x - RELAY_T[0]) * 0.75);
        for (let i = 0; i < 4; i++) {
          const u = te - (B4.red + 0.5 + i * 0.55);
          put(`cs${i}`, along(RELAY, CT, u), k, b === 4 ? tw(u, -0.2, 0) * (1 - tw(u, CT[12], CT[12] + 0.25)) * runs : 0);
        }
        // O₂ from water at PSII: one in beat 4, six in beat 5
        const OB_A: V = [OEC[0] + 4, OEC[1] + 20], OB_B: V = [OEC[0] + 50, OEC[1] + 96];
        const obT = b === 3 ? [B3.o2] : b === 4 ? [0, 1, 2, 3, 4, 5].map(i => B4.red + 0.9 + i * 0.3) : [];
        for (let i = 0; i < 6; i++) {
          const t0 = obT[i], u = t0 === undefined ? -1 : ((b === 3 ? tr : te) - t0) / 1.1;
          put(`ob${i}`, lerpV(OB_A, OB_B, smooth(u)), k, u < 0 || u > 1.2 ? 0 : tw(u, 0, 0.15) * (1 - tw(u, 0.8, 1.05)));
        }

        /* ---- beat 2: the per-O₂ readout fills (PSI, ferredoxin, FNR); it goes as beat 3 pulls back */
        op(q('ro'), b === 0 ? tw(tt, B1.zoom + 0.9, B1.zoom + 1.2) : b === 1 ? 1 : b === 2 ? 1 - tw(tp, 0, 0.3) : 0);
        const nP = b === 0 ? cnt(J.map(j => j - 0.1), tt) : 4, nF = b === 0 ? cnt(J.map((j, i) => j + JD[i]), tt) : 4;
        const nE = b === 0 ? 0 : b === 1 ? cnt(B2.d.map(d => d + B2.trip + B2.give), tt) : 4;
        const nN = b === 0 ? 0 : b === 1 ? cnt([B2.merge1, B2.merge2], tt) : 2;
        op(q('ro1'), nP > 0 ? 1 : 0); op(q('ro2'), nF > 0 ? 1 : 0); op(q('ro3'), nE > 0 ? 1 : 0);
        set(q('ro1t'), 'text', `photosystem I: ${nP} e⁻ (${nP} photon${nP === 1 ? '' : 's'})`);
        set(q('ro2t'), 'text', `ferredoxin: ${nF} e⁻ (${nF} Fd)`);
        const r3 = `${nE}:${nN}`;
        if (r3 !== ro3s) { ro3s = r3; q('ro3a').textContent = `FNR: ${nE} e⁻ + ${nN}`; q('ro3b').textContent = `(stroma) → ${nN} NADPH`; ro3(); }

        /* ---- ATP synthase starts to light */
        atpsLit.forEach(el => op(el, ATPS_END * tw(te, B4.out + 1.6, B4.out + 2.2)));
      };
    },
  };
}

/* ---------------------------------------------------------------- helpers the stagings share (stage units) */

/** A text line in the panel. */
export const ptext = (x: number, y: number, s: string, cls: string, a: 'start' | 'middle' | 'end' = 'start', k = ''): string =>
  `<text class="${cls}" x="${f1(x)}" y="${f1(y)}" text-anchor="${a}"${k ? ` data-k="${k}"` : ''}>${s}</text>`;
/** A light program: each step turns red and/or far-red on at `on` (the waves draw in over 0.45 s, the photosystems glow)
 *  and off at `off` (fading over 0.3 s). Red (650 nm) lights PSII fully and PSI partly (it absorbs 650 nm too); far-red lights PSI,
 *  PSII barely. */
export interface Step { on: number; off: number; red?: boolean; far?: boolean }
export function lightAt(steps: Step[], t: number): Light {
  const L: Light = { red: 0, far: 0, glowR2: 0, glowR1: 0, glowF1: 0, glowF2: 0 };
  for (const s of steps) {
    if (t < s.on || t > s.off + 0.35) continue;
    const u = (t - s.on) / 0.45, o = 1 - tw(t, s.off, s.off + 0.3), g = tw(t, s.on + 0.3, s.on + 0.6) * o;
    if (s.red) { L.red = u; L.red1 = 0; L.redOp = o; L.glowR2 = g; L.glowR1 = 0; }
    if (s.far) { L.far = u; L.farOp = o; L.glowF1 = g; L.glowF2 = 0.15 * g; }
  }
  return L;
}

/* ---------------------------------------------------------------- plot kit for the panels (stage units) */

/** A smooth path through points (Catmull-Rom as cubic Béziers). */
export function curve(q: V[]): string {
  let d = `M${f1(q[0][0])},${f1(q[0][1])}`;
  for (let i = 0; i < q.length - 1; i++) {
    const p0 = q[Math.max(0, i - 1)], p1 = q[i], p2 = q[i + 1], p3 = q[Math.min(q.length - 1, i + 2)];
    d += `C${f1(p1[0] + (p2[0] - p0[0]) / 6)},${f1(p1[1] + (p2[1] - p0[1]) / 6)} ${f1(p2[0] - (p3[0] - p1[0]) / 6)},${f1(p2[1] - (p3[1] - p1[1]) / 6)} ${f1(p2[0])},${f1(p2[1])}`;
  }
  return d;
}
/** A wavelength axis drawn as a coloured strip from x0 to x1 (stops: [nm, colour]), with words in it. */
export function wlStrip(p: string, key: string, x0: number, x1: number, y: number, h: number, nm0: number, nm1: number,
  stops: Array<[number, string]>, words: Array<[number, string]>): string {
  const off = (nm: number): string => ((nm - nm0) / (nm1 - nm0)).toFixed(3);
  return `<defs><linearGradient id="${p}-${key}" x1="0" x2="1" y1="0" y2="0">${stops.map(([nm, c]) => `<stop offset="${off(nm)}" stop-color="${c}"/>`).join('')}</linearGradient></defs>
    <rect x="${f1(x0)}" y="${f1(y)}" width="${f1(x1 - x0)}" height="${h}" fill="url(#${p}-${key})"/>
    ${words.map(([nm, w]) => `<text class="pm-strip" x="${f1(x0 + (x1 - x0) * Number(off(nm)))}" y="${f1(y + h / 2 + 6)}" text-anchor="middle">${w}</text>`).join('')}`;
}
/** A clip that reveals its content from the left: its rect's width is set per frame. */
export const revealClip = (p: string, key: string, x: number, y: number, h: number): string =>
  `<clipPath id="${p}-${key}"><rect data-k="${key}" x="${f1(x)}" y="${f1(y)}" width="0" height="${f1(h)}"/></clipPath>`;
/** A point along a polyline by time: pts[i] is reached at ts[i]; each leg eased. */
export function along(pts: V[], ts: number[], t: number): V {
  if (t <= ts[0]) return pts[0];
  for (let i = 1; i < pts.length; i++) if (t < ts[i]) return lerpV(pts[i - 1], pts[i], smooth((t - ts[i - 1]) / (ts[i] - ts[i - 1])));
  return pts[pts.length - 1];
}

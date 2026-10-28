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
// - Beat 3 (Emerson): the camera pulls back to both photosystems; photosystem II lights (its render in colour, its name in
//   ink), both are named "photosystem II (PSII)" and "photosystem I (PSI)"; the slide's amber light arrows give way to red
//   (680 nm, #c8361e) and far-red (> 700 nm, #7a1f17) light; a panel on the right holds Emerson's clipping (portrait) and
//   the staging's own illustration (psi-m1 … psi-m4).
// - Beat 4: the staging writes what differs and what follows on its illustration; then the panel goes, the camera zooms
//   out to the slide, photosystem II dims again, the slide's light returns, ATP synthase starts to light.
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
import { focusSvg, GEO, hring, LIT_PSI, tagG, type Part } from '../figs/chain';
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
const FD2_IN: V = [836, 238], FD2_AT: V = [FNR[0] + 40, FNR[1] + 34];
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
const ZL = { stroma: [96, 150] as V, lumen: [96, 404] as V };

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
const B1 = { zoom: 0.05, zoomD: 1.1, flowsOut: [0.05, 0.4], psi: 1.2, rc: 1.75, pc: 2.3, fd: 2.85, named: 3.4, light: 3.45, flash: 3.9, jump: 4.0, jumped: 4.85, refill: 4.9, end: 5.75 };
const JUMP = 0.65, REFILL = 0.55;
// Beat 2: FNR named, NADP⁺ and H⁺ shown (hold); e⁻ 1 to FNR, the second ferredoxin brings e⁻ 2 (hold); NADPH.
const B2 = { fnr: 0.05, nIn: 0.4, named: 0.9, e1: 0.95, e1D: 0.75, fd2: 1.0, fd2D: 0.9, e2: 2.0, e2D: 0.5, fd2Out: 2.6, two: 2.7, toN: 2.75, toND: 0.7, merge: 3.5, end: 4.1 };
// Beat 3, common opening: zoom out to both photosystems, PSII lights, the panel and clipping come in.
export const B3 = { out: 0.0, outD: 1.2, flowsIn: [0.6, 1.1] as V, psii: [0.9, 1.5] as V, names: [1.2, 1.6] as V, panel: [0.85, 1.3] as V, clip: [1.05, 1.45] as V, ready: 1.6 };
/** How lit ATP synthase gets at the end: it starts to light. */
const ATPS_END = 0.6;

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

/** The lamps of beat 3 and their light on the chain (figure units). Red, 680 nm: onto photosystem II, and a thinner wave
 *  onto photosystem I (which absorbs 680 nm too); far-red, > 700 nm: onto photosystem I only. */
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
  fd2: { s: 'another ferredoxin', at: [FD2_AT[0] + 24, FD2_AT[1] + 34], a: 'middle', off: [0, -16], to: [FD2_AT[0] + 4, FD2_AT[1] + 12] },
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
    ? `${lab('red', 'pm-wl pm-wl-red chn-halo', 0, 0, 'start')}${lab('680 nm', 'pm-wl pm-wl-red pm-wn chn-halo', 0, 22, 'start')}`
    : `${lab('far-red', 'pm-wl pm-wl-fr chn-halo', 0, 0, 'end')}${lab('&gt; 700 nm', 'pm-wl pm-wl-fr pm-wn chn-halo', 0, 22, 'end')}`);
  return `<defs><radialGradient id="${p}-rcglow"><stop offset="0" stop-color="#fff4d6"/><stop offset=".4" stop-color="#f6c453" stop-opacity=".9"/><stop offset="1" stop-color="#f0a316" stop-opacity="0"/></radialGradient>
      <radialGradient id="${p}-lampglow"><stop offset="0" stop-color="#fff1e8" stop-opacity=".95"/><stop offset=".5" stop-color="#f3b9a8" stop-opacity=".5"/><stop offset="1" stop-color="#f3b9a8" stop-opacity="0"/></radialGradient>
      ${gl('red', '#c8361e')}${gl('fr', '#7a1f17')}
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
    ${glyph('fd2', `<g class="chn-on"><ellipse class="chn-body chn-fd" rx="12" ry="12"/></g>`)}
    ${glyph('nadp', tagG(0, 0, 'NADP⁺', 'plain'))}${glyph('nadph', tagG(0, 0, 'NADPH', 'nadph'))}
    ${glyph('hp', hring(0, 0, 12))}
    ${glyph('e1', E_DOT)}${glyph('l-e1', lab('e⁻', 'pm-elab chn-halo', -8, -8, 'end'))}${glyph('e2', E_DOT)}
    ${Object.keys(LEADS).map(leadSvg).join('')}
    ${glyph('lab-psii', lab('photosystem II (PSII)', 'chn-name chn-halo', 0, 0, 'middle'))}${glyph('lab-psi', lab('photosystem I (PSI)', 'chn-name chn-halo', 0, 0, 'start'))}
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
    <text class="clip-find pm-cyear" x="${f1(rx)}" y="${py + 108}" text-anchor="middle">1957</text>
    <text class="clip-key pm-ckey" x="${f1(rx)}" y="${py + 138}" text-anchor="middle">the alga <tspan font-style="italic">Chlorella</tspan></text></g>`;
}

/* ---------------------------------------------------------------- what a staging adds */

/** What the chain shows in beats 3–4: the light on each photosystem (0–1) and how strongly each glows. */
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
/** One staging's Emerson illustration (beats 3–4). Times are seconds into the beat; −1 before it begins, 99 after. */
export interface Ill {
  id: string; name: string; note: string;
  beats?: Beat[];
  /** Lamps on the chain (m1); otherwise the waves alone, labelled. */
  lamps: boolean;
  /** Click stops in beat 3 (after the common opening ends at B3.ready) and beat 4; when beat 4 zooms out; the ends. */
  holds3: number[]; end3: number; holds4: number[]; out4: number;
  /** Markup inside the panel (stage units), drawn in a .fig group. */
  panel(p: string): string;
  /** Extra markup on the chain (figure units), counter-scaled by the staging itself. */
  world?(p: string): string;
  /** Wires the staging up; the returned function draws its frame and returns the light on the chain. */
  bind(c: Ctx): (t3: number, t4: number, k: number) => Light;
}

/* ---------------------------------------------------------------- the staging */

export function makeStaging(o: Ill): Staging {
  const P = `pm${o.id}`;
  const { svg: chain, pcLab } = scene(`${P}c`, P);
  // plastocyanin's label: below it, closer in the close view (its text is counter-scaled)
  const LAB_OFF0: V = [pcLab[0] - PC[0], pcLab[1] - PC[1]], LAB_OFFZ: V = [0, 31];
  const END4 = o.out4 + 2.4;
  const TEND = [B1.end, B2.end, o.end3, END4];

  return {
    id: o.id,
    name: o.name,
    note: o.note,
    beats: o.beats,
    holds: [[B1.named, B1.jumped], [B2.named, B2.two], o.holds3, o.holds4],
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
        <g class="fig">${o.panel(P)}</g>
      </g>
      <g data-k="clip" opacity="0" display="none">${clippingSvg(P)}</g>`,

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
      const fdText = textIn('fd', 'ferredoxin'), names = [...textIn('psii', 'photosystem II'), ...textIn('psii-lit', 'photosystem II'), ...textIn('psi', 'photosystem I')];
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
      const ill = o.bind({ q, set, op, put });

      let last = '';
      return (beatIn, t) => {
        const b = Math.max(0, Math.min(3, Math.round(beatIn)));
        const tt = Math.max(0, Math.min(t, TEND[b]));
        const key = `${b}:${tt.toFixed(3)}`;
        if (key === last) return;
        last = key;
        /** Seconds into beat n: −1 before it begins, 99 after it. */
        const T = (n: number): number => (b === n ? tt : b > n ? 99 : -1);
        const t1 = T(0), t2 = T(1), t3 = T(2), t4 = T(3);

        /* ---- camera: B → Z (beat 1), Z → E (beat 3), E → B (beat 4) */
        const zin = mv(t1, B1.zoom, B1.zoomD), zE = mv(t3, B3.out, B3.outD), zOut = mv(t4, o.out4, 1.2);
        const cam = zOut > 0 ? tween(E, B, zOut) : zE > 0 ? tween(Z, E, zE) : tween(B, Z, zin);
        const k = kOf(cam.s);
        set(q('cam'), 'transform', tfStr(cam));
        texts.forEach(({ el, x, y }) => set(el, 'transform', `matrix(${k.toFixed(4)},0,0,${k.toFixed(4)},${(x * (1 - k)).toFixed(2)},${(y * (1 - k)).toFixed(2)})`));
        groups.forEach(({ el, c }) => set(el, 'transform', `matrix(${k.toFixed(4)},0,0,${k.toFixed(4)},${(c[0] * (1 - k)).toFixed(2)},${(c[1] * (1 - k)).toFixed(2)})`));
        // the close view's own zone labels
        const zl = tw(t1, 0.95, 1.2) * (1 - tw(t3, 0, 0.3));
        put('zl-stroma', ZL.stroma, k, zl);
        put('zl-lumen', ZL.lumen, k, zl);

        /* ---- the slide's lit arrows of photosystem I give way while the story tells them, and return in beat 3 */
        const flowsOp = b === 0 ? 1 - tw(tt, B1.flowsOut[0], B1.flowsOut[1]) : b === 1 ? 0 : tw(t3, B3.flowsIn[0], B3.flowsIn[1]);
        flows.forEach(g => op(g, flowsOp));
        ePcPsi.forEach(g => op(g, 0)); // plastocyanin is docked from the first frame: its arrow from the slide place has no start
        // light at photosystem I: the slide's wave, cleared, then drawn in from above when light arrives (beat 1); off in
        // beats 3–4 (red and far-red instead) until the zoom out ends
        const lightBack = tw(t4, o.out4 + 1.2, o.out4 + 1.6);
        let l1Op = 0, l1Y = 1000;
        if (b === 0) {
          if (tt < B1.light - 0.05) l1Op = 1 - tw(tt, B1.flowsOut[0], B1.flowsOut[1]);
          else { l1Op = 1 - tw(tt, B1.jump + 0.5, B1.jump + 0.8); l1Y = lerp(88, 250, smooth((tt - B1.light) / 0.45)); }
        } else if (b === 3) l1Op = lightBack;
        light1.forEach(g => op(g, l1Op));
        set(q('lclip'), 'height', f1(l1Y + 200));
        // light at photosystem II (dimmed on slide 9) would be cut by the close view's edge: it goes as the camera zooms in
        light2.forEach(g => op(g, b < 3 ? 1 - tw(t1, B1.zoom, B1.zoom + 0.4) : lightBack));

        /* ---- plastocyanin: docked under photosystem I from the first frame to the last */
        const dPc: V = [DOCK[0] - PC[0], DOCK[1] - PC[1]];
        shift(pcBody, dPc);
        const zc = b === 0 ? zin : b === 1 ? 1 : b === 2 ? 1 - zE : 0;
        const lo = lerpV(LAB_OFF0, LAB_OFFZ, zc);
        shift(pcText, [DOCK[0] + lo[0] - pcLab[0], DOCK[1] + lo[1] - pcLab[1]]);

        /* ---- point, then do: leaders and brief glows (beats 1–2) */
        const ldOut = 1 - tw(t3, 0, 0.3);
        lead('psi', tw(t1, B1.psi, B1.psi + 0.3) * ldOut, k);
        lead('rc', tw(t1, B1.rc, B1.rc + 0.3) * ldOut, k);
        lead('fd', tw(t1, B1.fd, B1.fd + 0.3) * ldOut, k);
        lead('fnr', tw(t2, B2.fnr, B2.fnr + 0.3) * ldOut, k);
        lead('fd2', tw(t2, B2.fd2 + 0.3, B2.fd2 + 0.6) * (1 - tw(t2, B2.fd2Out, B2.fd2Out + 0.3)), k);
        fdText.forEach(el => op(el, b === 0 ? 1 - tw(tt, B1.fd, B1.fd + 0.3) : b === 1 ? 0 : tw(t3, 0, 0.3)));

        /* ---- beat 3–4: the staging's illustration and the light on the chain */
        const L = ill(t3, t4, k);
        const runs = (1 - tw(t4, o.out4, o.out4 + 0.3));
        // glows: named (beats 1–2), then each photosystem in the light it absorbs (beats 3–4)
        const g = (els: SVGGElement[], v: number): void => els.forEach(el => op(el, v));
        g(gl('psi', 'amb'), b === 0 ? named(tt, B1.psi) : 0);
        g(gl('pc', 'amb'), b === 0 ? named(tt, B1.pc) : 0);
        g(gl('fd', 'amb'), b === 0 ? named(tt, B1.fd) : 0);
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
        const lampOp = tw(t3, B3.names[0], B3.names[1]) * runs;
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
        const namesOp = b === 2 ? tw(tt, B3.names[0], B3.names[1]) : b === 3 ? 1 - tw(tt, o.out4 + 0.6, o.out4 + 0.8) : 0;
        const slideNames = b === 2 ? 1 - tw(tt, B3.names[0] - 0.2, B3.names[0]) : b === 3 ? tw(tt, o.out4 + 0.8, o.out4 + 1.0) : 1;
        put('lab-psii', [112, 505], k, namesOp);
        put('lab-psi', [422, 505], k, namesOp);
        names.forEach(el => op(el, slideNames));
        psiiLit.forEach(el => op(el, tw(t3, B3.psii[0], B3.psii[1]) * (1 - tw(t4, o.out4 + 0.3, o.out4 + 0.9))));
        // the panel and the clipping
        const panelOp = tw(t3, B3.panel[0], B3.panel[1]) * (1 - tw(t4, o.out4, o.out4 + 0.35));
        op(q('panel'), panelOp);
        set(q('panel'), 'transform', `translate(${f1(40 * (1 - smooth(tw(t3, B3.panel[0], B3.panel[1]))))} 0)`);
        op(q('clip'), tw(t3, B3.clip[0], B3.clip[1]) * (1 - tw(t4, o.out4, o.out4 + 0.35)));

        /* ---- the reaction centre: its electron, the flash, the empty place, the refill (beat 1) */
        put('rcglow', P700, k, b === 0 ? pulse(tt, B1.flash) : 0);
        const back = B1.refill + REFILL; // plastocyanin's electron arrives
        put('rcring', P700, k, b === 0 ? tw(tt, B1.jump + 0.05, B1.jump + 0.15) * (1 - tw(tt, back - 0.05, back)) : 0);
        put('rcdot', P700, k, b === 0 ? tw(tt, B1.rc, B1.rc + 0.2) * (tt < B1.jump ? 1 : 0) : 0);
        // plastocyanin's electron: on it from the first frame, up into the reaction centre, there until beat 3
        const ur = b === 0 ? (tt - B1.refill) / REFILL : 1;
        put('pce', ur <= 0 ? DOCK : lerpV(DOCK, P700, smooth(ur)), k, 1 - tw(t3, 0, 0.3));

        /* ---- e⁻ 1: P700 → ferredoxin (beat 1) → FNR → NADP⁺ (beat 2); e⁻ 2: the second ferredoxin → FNR → NADP⁺ */
        let e1: V = P700, e1Op = 0;
        if (b === 0) {
          const u = (tt - B1.jump) / JUMP;
          e1 = bez(P700, [FAB[0] - 8, FAB[1] - 14], FD, smooth(u));
          e1Op = u >= 0 ? 1 : 0;
        } else if (b === 1) {
          const u1 = (tt - B2.e1) / B2.e1D, u2 = (tt - B2.toN) / B2.toND;
          e1 = u2 > 0 ? bez(ON_FNR[0], [ON_FNR[0][0] - 10, (ON_FNR[0][1] + AT_NP[0][1]) / 2], AT_NP[0], smoother(u2)) : bez(FD, [FD[0] + 26, FD[1] - 14], ON_FNR[0], smoother(u1));
          e1Op = 1 - tw(tt, B2.merge, B2.merge + 0.2);
        }
        put('e1', e1, k, e1Op);
        const eLab = b === 0 ? tw(tt, B1.rc, B1.rc + 0.2) : b === 1 ? 1 - tw(tt, B2.merge - 0.25, B2.merge) : 0;
        const eAt = b === 0 && tt < B1.jump ? P700 : e1;
        put('l-e1', [eAt[0] - 4 * k, eAt[1] - 4 * k], k, eLab);
        // the second ferredoxin, carrying e⁻ 2: in from the right, hands its e⁻ to FNR, leaves
        const fdIn = mv(t2, B2.fd2, B2.fd2D), fdOut = mv(t2, B2.fd2Out, 0.8);
        const fd2At = fdOut > 0 ? lerpV(FD2_AT, FD2_IN, fdOut) : lerpV(FD2_IN, FD2_AT, fdIn);
        put('fd2', fd2At, 1, b === 1 ? tw(tt, B2.fd2, B2.fd2 + 0.25) * (1 - tw(tt, B2.fd2Out + 0.4, B2.fd2Out + 0.8)) : 0);
        let e2: V = fd2At;
        if (b === 1) {
          const ue = (tt - B2.e2) / B2.e2D, u2 = (tt - B2.toN) / B2.toND;
          e2 = u2 > 0 ? bez(ON_FNR[1], [ON_FNR[1][0] - 4, (ON_FNR[1][1] + AT_NP[1][1]) / 2 - 10], AT_NP[1], smoother(u2))
            : ue > 0 ? bez(fd2At, [FD2_AT[0] - 6, FD2_AT[1] - 30], ON_FNR[1], smoother(ue)) : fd2At;
        }
        put('e2', e2, k, b === 1 ? tw(tt, B2.fd2, B2.fd2 + 0.25) * (1 - tw(tt, B2.merge, B2.merge + 0.2)) : 0);

        /* ---- NADP⁺ + 2 e⁻ + H⁺ → NADPH in the stroma (beat 2); the slide's row takes over in beat 3 */
        const nIn = tw(t2, B2.nIn, B2.nIn + 0.3), merged = tw(t2, B2.merge + 0.05, B2.merge + 0.25);
        put('nadp', NP, k, nIn * (1 - tw(t2, B2.merge, B2.merge + 0.15)));
        const toRow: V = [ROW[0] + ROW_NADPH * k, ROW[1]];
        put('nadph', lerpV(NP, toRow, mv(t3, 0, 1.0)), k, merged * (1 - tw(t3, 1.0, 1.25)));
        put('hp', lerpV(H0, H1, mv(t2, B2.toN, B2.toND)), k, nIn * (1 - merged));

        /* ---- ATP synthase starts to light */
        atpsLit.forEach(el => op(el, ATPS_END * tw(t4, o.out4 + 1.6, o.out4 + 2.2)));
      };
    },
  };
}

/* ---------------------------------------------------------------- helpers the stagings share (stage units) */

/** A text line in the panel. */
export const ptext = (x: number, y: number, s: string, cls: string, a: 'start' | 'middle' | 'end' = 'start', k = ''): string =>
  `<text class="${cls}" x="${f1(x)}" y="${f1(y)}" text-anchor="${a}"${k ? ` data-k="${k}"` : ''}>${s}</text>`;
/** The two statements of beat 4, as the brief words them (what differs, and what follows), each in two lines. */
export const SAY_FR: [string, string] = ['<tspan class="pm-fr">far-red alone:</tspan> PSI runs, PSII barely', '→ few electrons from water → little O₂'];
export const SAY_BOTH: [string, string] = ['<tspan class="pm-red">red</tspan> + <tspan class="pm-fr">far-red</tspan>: both run', '→ more O₂ than the two apart'];

/** A light program: each step turns red and/or far-red on at `on` (the waves draw in over 0.45 s, the photosystems glow)
 *  and off at `off` (fading over 0.3 s). Red lights PSII fully and PSI partly (it absorbs 680 nm too); far-red lights PSI,
 *  PSII barely. */
export interface Step { on: number; off: number; red?: boolean; far?: boolean }
export function lightAt(steps: Step[], t: number): Light {
  const L: Light = { red: 0, far: 0, glowR2: 0, glowR1: 0, glowF1: 0, glowF2: 0 };
  for (const s of steps) {
    if (t < s.on || t > s.off + 0.35) continue;
    const u = (t - s.on) / 0.45, o = 1 - tw(t, s.off, s.off + 0.3), g = tw(t, s.on + 0.3, s.on + 0.6) * o;
    if (s.red) { L.red = u; L.redOp = o; L.glowR2 = g; L.glowR1 = 0.55 * g; }
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
/** The two statements of beat 4 in the panel's bottom band, each as its own group (data-k say1, say2). */
export function sayBlock(x: number, ys: [number, number, number, number]): string {
  return `<g data-k="say1" opacity="0" display="none">${ptext(x, ys[0], SAY_FR[0], 'pm-say')}${ptext(x, ys[1], SAY_FR[1], 'pm-say')}</g>
    <g data-k="say2" opacity="0" display="none">${ptext(x, ys[2], SAY_BOTH[0], 'pm-say')}${ptext(x, ys[3], SAY_BOTH[1], 'pm-say')}</g>`;
}

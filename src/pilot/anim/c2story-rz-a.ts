// 'c2story', staging evoRa · slide 15, evoR (below, unchanged) with the modern-era zoom, variant a, "cross-fade" (lecturer,
// 30 Oct 2026: "when we enter the modern human era, from 1750, zoom in on the graph, so we don't see the past, and we can
// clearly see the temperature rise"; brief S15Z_BRIEF.md):
// - Beat 6 (0-based): v3's marker goes from 20,000 years ago to 1750 and stops; then the whole broken-axis chart fades out
//   over 0.8 s while a chart of 1750 → September 2026 fades in at the same place, with its own axes (x 130 → 1430; CO₂
//   linear 260 → 455 ppm, left; temperature −0.6 → +1.8 °C change from 1850–1900, right; v3's line styles; the rotated
//   axis titles, the same text in both, stay put). The status line reads "1750 → today" while it zooms; a click (hold);
//   the status returns to v3's year, then v3's cruise 1750 → 2026, the hot and the dry day run on the zoomed chart. It stays
//   zoomed through beats 6 and 7. v3's time is held at 1.6 s (B6_CR's start) from the zoom to the cruise.
// - The zoomed marker and its 2 dots sit at the years-ago v3 reports each frame (onFrame: averaged over the last 0.3 s, as
//   the balance and the record), and the curves are revealed up to it. CO₂: CO2_D; temperature: the LGMR reconstruction
//   (Osman et al. 2021) between its 376.8 and 176.8 years-ago bins for 1750–1850, then HadCRUT5 (T_D), as v3's TS[3].
// evoR's header:
// 'c2story', staging evoR · slide 15 RuBisCO, beats C2STORY5: staging evo (c2story-evo.ts; read its header first) with
// the record (lecturer, 29 Oct 2026: "did RuBisCO evolve at all?"; focus: "how RuBisCO's performance changed over the
// years"). Evo's parts A (beats 1–4, the ocean), B (v3, beats 5–7) and C (beat 8) are copied here unchanged except:
// - The record, its own layer above both parts, never leaves: every RuBisCO card keeps its structure render, name and
//   form, and 2 bars under its name in the card's colour, CO₂ preference S (0–200) and speed kcat (0–12 s⁻¹), at 25 °C:
//   purple bacteria 12 / 7.3, cyanobacteria 43 / 11.6, green algae 61 / 5.8 (Tcherkez et al. 2006, Table 1; green kcat
//   adjusted from 30 °C), red algae 177 / 1.4 (Flamholz et al. 2019, Fig. 5, median). Archaea (form III) have no reliable
//   S–kcat point (S 0.5–11, the lowest kcat at 25 °C; Iñiguez 2020): their rows say "very low", no bar. Cyanobacteria's
//   CO₂ preference first shows the small subunit's step, ≈ 22 → 39 (Schulz et al. 2022, as evo), then today's 43 and the
//   speed bar (beat 3).
// - Beats 1–4: the cards at their dates, as evo's, earlier ones dimmed. Beat 5: instead of fading, the record compacts
//   once, into one row above the chart's top edge, right of the status line (the per-card labels and date lines fade,
//   the frames, renders and bars glide, the compact names and a single legend fade in); then evo's beat 5 runs, later.
//   The row sits where no data line, scene or the balance ever is; the break marks of the axis stay below it.
// - Beat 6: after v3's heat and cold, a pause; then a "flowering plants" card (the land-plant render, PDB 8RUC) with
//   its bars growing slowly from the flowering-plant common ancestor (S 81.1, speed 2.6) to today's C₃ mean (87.1, 3.4;
//   Bouvier, Emms & Kelly 2024, Table 1); then the note "1 amino acid change per ≈ 7 million years" (rbcL, Bouvier 2024).
// - Beats 7–8: the record stays, dimmed. Beat 8: the note fades (the closing question takes its place); the clippings and
//   evo's "or learn from" row sit 16 px lower so the closing question fits between them and the record.
// - Only the closing question is drawn big (no take-home lines); the balance's S follows the table (43, 61).
// - Everything moves together (lecturer, 30 Oct 2026: "the RuBisCO values must change at the same time as the CO₂ and
//   the temperature, not one after the other; a little slower, so people can watch"): in beats 1–5 each step is one
//   window: the marker travels to the new date while, over the same window and with the same easing, the card fades in,
//   the balance's RuBisCO and S change and the bars grow; a pause follows. From the land plants on, the balance's S and the
//   flowering-plant card's bars are read at the marker's time (makeV3 in dk-c2story3.ts), averaged like the CO₂ and the
//   temperature: S 81.1 until the flowering-plant ancestor (≈ 160 million years ago; no values before), then rising
//   linearly to today's 87.1 (speed 2.6 → 3.4), as Bouvier et al. 2024 estimate a constant gain per million years. The
//   balance computes with tobacco's Γ* scaled by that relative S. v3's beats run 1.6 × slower here.
import './c2story-evo.css';
import { C2STORY5 } from './beats-c2story';
import { makeV3, markerYa, STAGING as V3, type LandRubisco } from './dk-c2story3';
import { animScene, N_SCENES, SC_CARRIERS, SC_FIRST_LAND, type SceneIO, type Spot } from './c2story-scenes';
import { CO2_D, T_C, T_D } from './c2story-data';
import { CC_CA, O2_TODAY } from './c2story-model';
import { ENZYMES, enzyme, oxPer100S } from './c2story-enzyme';
import r1geh from '../../assets/rf/rubisco-1geh.png';
import r9rub from '../../assets/rf/rubisco-9rub.png';
import r1rbl from '../../assets/rf/rubisco-1rbl.png';
import r1bwv from '../../assets/rf/rubisco-1bwv.png';
import r8ruc from '../../assets/rf/rubisco-8ruc.png';
import type { Staging } from './types';

type V = [number, number];
const f = (v: number): string => (Math.round(v * 10) / 10).toString();
const clamp = (x: number): number => (x < 0 ? 0 : x > 1 ? 1 : x);
const ease = (t: number, t0: number, t1: number): number => { const u = clamp((t - t0) / (t1 - t0)); return u * u * (3 - 2 * u); };
const ease2 = (t: number, t0: number, t1: number): number => { const u = clamp((t - t0) / (t1 - t0)); return u * u * u * (u * (u * 6 - 15) + 10); };
const lerp = (a: number, b: number, u: number): number => a + (b - a) * u;
const T = (x: number, y: number, s: string, cls: string, a: 'start' | 'middle' | 'end' = 'start', k = ''): string =>
  `<text${k ? ` data-k="${k}"` : ''} class="${cls}" x="${f(x)}" y="${f(y)}" text-anchor="${a}">${s}</text>`;

/* ---------------------------------------------------------------- part A: v3's chart, geometry copied from dk-c2story3.ts */

const X0 = 130, Y0 = 84, Y1 = 410, SEG0 = 0.35 * (1430 - 130 - 3 * 18);
const LA = Math.log10(4e9), LB = 6;
/** x of a time (billion years ago) on v3's first, logarithmic segment. */
const xGa = (ga: number): number => X0 + ((LA - Math.log10(ga * 1e9)) / (LA - LB)) * SEG0;
const XGOE = xGa(2.3), X500 = xGa(0.5);
const PX = 948, PY = 468, PW = 636, BX = PX + 176, YP = PY + 106, ARM = 100, BAR = 0.46, TILT = 0.14;
const RW = 104, RH = (RW * 471) / 548, RY = YP + 3, BYC = RY + RH / 2;
const QX = BX + 182, QR = PX + PW - 16, QW = QR - QX;
const S_MAX_V3 = Math.max(...ENZYMES.map(e => e.s)) * 1.04;
const CA_1750 = CO2_D[0][1];
const FROZEN = typeof location !== 'undefined' && new URLSearchParams(location.search).has('t');

/** v3's stage as a string, every id (and its url(#…) / href="#…" uses) given the prefix p. */
function renameIds(svg: string, p: string): string {
  const ids = new Set<string>();
  svg.replace(/\sid="([^"]+)"/g, (_m, id: string) => { ids.add(id); return ''; });
  return svg.replace(/(\sid="|url\(#|href="#)([^")]+)/g, (m, pre: string, id: string) => (ids.has(id) ? `${pre}${p}${id}` : m));
}

/* ---------------------------------------------------------------- the RuBisCOs of the record */

/** Render sizes at 4 px per Å (rf_forms_render.mjs; 8RUC also 4 px per Å), drawn at one common scale so sizes compare. */
const IMG: Record<string, { href: string; w: number; h: number }> = {
  '1geh': { href: r1geh, w: 636, h: 608 }, '9rub': { href: r9rub, w: 476, h: 336 },
  '1rbl': { href: r1rbl, w: 537, h: 484 }, '1bwv': { href: r1bwv, w: 548, h: 500 }, '8ruc': { href: r8ruc, w: 548, h: 471 },
};
/** s, kcat: today's values (null: no reliable point); `short`: the form in the compact row. */
interface Card { k: string; name: string; form: string; short: string; col: string; txt: string; ga: number; img: string; s: number | null; kcat: number | null }
const CARDS: Card[] = [
  { k: 'arc', name: 'archaea', form: 'form III', short: 'form III', col: '#8a8780', txt: '#6f6c66', ga: 3.5, img: '1geh', s: null, kcat: null },
  { k: 'pur', name: 'purple bacteria', form: 'form II', short: 'form II', col: '#7a4f9a', txt: '#7a4f9a', ga: 2.95, img: '9rub', s: 12, kcat: 7.3 },
  { k: 'cya', name: 'cyanobacteria', form: 'form I + small subunits', short: 'form I', col: '#2f7f86', txt: '#2f7f86', ga: 2.7, img: '1rbl', s: 43, kcat: 11.6 },
  { k: 'red', name: 'red algae', form: 'form ID', short: 'form ID', col: '#b5384a', txt: '#b5384a', ga: 1.05, img: '1bwv', s: 177, kcat: 1.4 },
  { k: 'grn', name: 'green algae', form: 'form I + CO₂ pump', short: 'form I', col: '#5b9a3c', txt: '#4f8a32', ga: 1.0, img: '1rbl', s: 61, kcat: 5.8 },
  // beat 6 only, compact: the flowering-plant common ancestor → today's C₃ mean (Bouvier 2024)
  { k: 'flo', name: 'flowering plants', form: 'form I', short: 'form I', col: '#3c7a2e', txt: '#3c6a2e', ga: 0.14, img: '8ruc', s: 87.1, kcat: 3.4 },
];
const N_OCEAN = 5, I_CYA = 2, I_FLO = 5;
const S_ANC = 81.1, K_ANC = 2.6, S_SSU0 = 22, S_SSU1 = 39;
/** Land plants over time (Bouvier, Emms & Kelly 2024): the flowering-plant ancestor ≈ 160 million years ago, today's C₃
 *  mean; a constant gain per million years in between; before the ancestor no values, so S stays at the ancestor's. */
const YA_ANC = 160e6, S_NOW = 87.1, K_NOW = 3.4;
const LAND: LandRubisco = {
  sAt: ya => (ya >= YA_ANC ? S_ANC : lerp(S_NOW, S_ANC, ya / YA_ANC)),
  kAt: ya => (ya >= YA_ANC ? K_ANC : lerp(K_NOW, K_ANC, ya / YA_ANC)),
  sRef: S_NOW,
  note: ['computed with tobacco RuBisCO, scaled to', 'the S shown (Bernacchi 2001; Bouvier 2024)'],
  // no measurements before the flowering-plant ancestor
  fmt: (ya, s) => (ya >= YA_ANC ? '≈ ' : '') + Math.round(s),
};
const V3L = makeV3(LAND);
interface Land { ya: number | null; s: number; k: number }
/** The balance's S for archaea (evo's stand-in; the cards show no point). */
const S_ARC = 5;
/** Bars: one scale for every card, in both layouts (so a bar only glides): S 0–200, speed 0–12 s⁻¹. */
const BW = 80, BH = 5, S_TOP = 200, K_TOP = 12;

// the expanded cards (beats 1–4): evo's places and size; bars under the name, each with its label
const CW = 196, CH = 192, CT = 116, CX0 = 330, CG = 18, IMK = 0.15;
const E_IMY = 52, E_NAME = 120, E_FORM = 140, E_LX = 12, E_BX = 106, E_B1 = 157, E_B2 = 175;
const cardX = (i: number): number => CX0 + i * (CW + CG);
const railY = (i: number): number => CT + CH + 18 + i * 16;
// the compact row (beats 5–8): above the chart's top edge (y 84), below the credit line (y 24), from just right of
// the longest status line (it ends at x 580) to the chart's right edge; the legend to its right
const K_Y = 28, K_H = 46, K_X0 = 592, K_X1 = 1430, KIMK = 0.06, K_PAD = 3, K_IMW = 38, K_BX = K_PAD + K_IMW + 3;
const K_NAME = 12, K_FORM = 24, K_B1 = 27, K_B2 = 39;
/** Text widths in the compact row: the 12 px bold name (Inter, measured) + 2, at least a full bar. */
const K_TW = [47.3, 89.1, 84.0, 54.1, 68.7, 94.8].map(w => Math.max(BW, Math.ceil(w) + 2));
const K_W = K_TW.map(tw => K_BX + tw + K_PAD);
const K_GAP = (K_X1 - K_X0 - K_W.reduce((a, b) => a + b, 0)) / (K_W.length - 1);
const kX = (i: number): number => K_X0 + K_W.slice(0, i).reduce((a, b) => a + b + K_GAP, 0);
const LEG_X = K_X1 + 10, NOTE_X = K_X1 - 4, NOTE_Y = 99;

const ST = (size: number, fill: string, weight = 400): string => `style="font-size:${size}px;font-weight:${weight};fill:${fill}"`;
const TX = (x: number, y: number, s: string, st: string, a: 'start' | 'middle' | 'end' = 'middle', k = ''): string =>
  `<text${k ? ` data-k="${k}"` : ''} x="${f(x)}" y="${f(y)}" text-anchor="${a}" ${st}>${s}</text>`;
const imgAt = (img: string, cx: number, cy: number, k: number, extra = ''): string => {
  const m = IMG[img], w = m.w * k, h = m.h * k;
  return `<image${extra} href="${m.href}" x="${f(cx - w / 2)}" y="${f(cy - h / 2)}" width="${f(w)}" height="${f(h)}"/>`;
};
const GREY = '#6b6a64', TRACK = 'fill:#ebe7dc';
/** The flowering-plant ancestor's value on its bar (≈ 160 million years ago): a thin dark tick the bar grows past. */
const ancTick = (x: number): string => `<rect x="${f(x - 0.75)}" y="-1" width="1.5" height="${BH + 2}" style="fill:#2f2e2b"/>`;

function recordSvg(): string {
  const cards = CARDS.map((c, i) => {
    const big = i < N_OCEAN, x = big ? cardX(i) : kX(i), y = big ? CT : K_Y, cx = x + CW / 2;
    const kx = kX(i);
    const bars = c.s === null ? '' : ['s', 'v'].map((b, r) => `<g data-k="rb${r}-${c.k}">
        <rect x="0" y="0" width="${BW}" height="${BH}" rx="2.5" style="${TRACK}"/>
        <rect data-k="r${b}-${c.k}" x="0" y="0" width="0" height="${BH}" rx="2.5" style="fill:${c.col}"/>${i === I_FLO ? ancTick(r === 0 ? (BW * S_ANC) / S_TOP : (BW * K_ANC) / K_TOP) : ''}</g>`).join('');
    const rail = big ? `<path data-k="rr-${c.k}" d="M${f(cx)},${CT + CH} V${railY(i)} H${f(xGa(c.ga))} V${Y1}" style="fill:none;stroke:${c.col};stroke-width:1.6;stroke-linejoin:round"/>` : '';
    const expanded = big ? `<g data-k="re-${c.k}">${TX(cx, CT + E_NAME, c.name, ST(18, c.txt, 700))}${TX(cx, CT + E_FORM, c.form, ST(14, '#4a4945'))}
        ${TX(x + E_LX, CT + E_B1 + BH, 'CO₂ preference', ST(12, GREY), 'start')}${TX(x + E_LX, CT + E_B2 + BH, 'speed', ST(12, GREY), 'start')}
        ${c.s === null ? `${TX(x + E_BX, CT + E_B1 + BH, 'very low', ST(12, GREY), 'start')}${TX(x + E_BX, CT + E_B2 + BH, 'very low', ST(12, GREY), 'start')}` : ''}</g>` : '';
    const compact = `<g data-k="rk-${c.k}" opacity="${big ? 0 : 1}">${TX(kx + K_BX, K_Y + K_NAME, c.name, ST(12, c.txt, 700), 'start')}${TX(kx + K_BX, K_Y + K_FORM, c.short, ST(12, '#4a4945'), 'start')}
        ${c.s === null ? TX(kx + K_BX, K_Y + K_B1 + 11, 'very low', ST(12, GREY), 'start') : ''}</g>`;
    return `<g data-k="rc-${c.k}" opacity="0" display="none">${rail}
      <rect data-k="rf-${c.k}" x="${x}" y="${y}" width="${big ? CW : K_W[i]}" height="${big ? CH : K_H}" rx="${big ? 12 : 8}" style="fill:#fffdf8;stroke:${c.col};stroke-width:1.6"/>
      ${imgAt(c.img, big ? cx : kx + K_PAD + K_IMW / 2, big ? CT + E_IMY : K_Y + K_H / 2, big ? IMK : KIMK, ` data-k="ri-${c.k}"`)}
      ${expanded}${compact}${bars}</g>`;
  }).join('');
  return `<g class="c2s" data-k="rec">
    ${T(X0, 24, 'S, speed: Tcherkez et al. 2006; Flamholz et al. 2019; Bouvier et al. 2024 · dates approximate', 'cs-crd', 'start', 'rcrd')}
    ${cards}
    <g data-k="rleg" opacity="0" display="none">${TX(LEG_X, K_Y + K_B1 + BH, 'CO₂ preference', ST(12, GREY), 'start')}${TX(LEG_X, K_Y + K_B2 + BH, 'speed', ST(12, GREY), 'start')}</g>
    <g data-k="rnote" opacity="0" display="none">${TX(NOTE_X, NOTE_Y, '1 amino acid change per ≈ 7 million years', ST(13, '#3c6a2e'), 'end')}</g>
  </g>`;
}
/** The panel's RuBisCO, one render per lineage (v3's own image, the land-plant 8RUC, takes over at the switch). */
const PIMK = 0.148;
const panelImgs = (): string => CARDS.slice(0, N_OCEAN).map((c, i) => `<g data-k="pi-${i}" opacity="0" display="none">${imgAt(c.img, BX, BYC, PIMK)}</g>`).join('');

/* ---------------------------------------------------------------- the timeline (0-based beats, s) */

// beat 0: the chart and the scene fade in; the archaea card; the balance.
// beat 1: the marker to 2.95, purple bacteria, the balance; the marker to 2.7, cyanobacteria, the balance; S ≈ 22 → 39.
// beat 2: S 43, then the speed bar; the marker to the Great Oxidation Event (O₂ bubbles, the air, the balance's O₂).
// beat 3: the marker to 1.0 (the O₂ band fades as it leaves); red algae, the balance; green algae, the balance; the CO₂ pump.
// beat 4: the record compacts (labels and date lines out; frames, renders and bars glide; compact names and the legend
//         in); the marker to 500 million years ago; the balance to the land plants; v3 takes over.
// beat 5: v3's heat and cold; a pause; flowering plants, the bars grow; the note.
// beat 6: v3's today; the record dims. beat 7: v3's clippings, evo's "or learn from"; the note fades.
// every fade ≥ 0.8 s (lecturer, 30 Oct 2026: "no blink between the phases; transit slowly")
const B0 = { bg: [0, 1.0] as V, card: [1.2, 2.2] as V, panel: [2.4, 3.4] as V };
// one window per step: the marker, the card, the balance and the bars share it (and its easing, ease2)
const B1 = { m1: [0.3, 2.5] as V, m2: [2.9, 5.1] as V };
const B2 = { m: [0.3, 2.9] as V };
const B3 = { m1: [0.3, 2.7] as V, m2: [3.1, 5.1] as V, pump: [5.5, 6.5] as V };
const B4 = { fo: [0, 1.0] as V, gl: [1.1, 2.7] as V, fi: [2.8, 3.6] as V, m: [3.8, 5.8] as V, xf: [5.9, 7.1] as V };
const B6 = { dim: [0, 1.2] as V };
/** v3's beat 5 (0-based 4) rests at X500 at 1.6 s; part A hands over at that frame. v3's beats run SLOW × slower here. */
const V3_REST = 1.6, SLOW = 1.6;
/** When v3's marker passes the flowering-plant ancestor (≈ 160 million years ago) in beat 5, on this staging's clock: the
 *  card fades in over 1.2 s around it (a fade by the marker's x took 0.1 s there). */
const T_FLO = ((): number => { let lo = 0, hi = 3; for (let i = 0; i < 40; i++) { const m = (lo + hi) / 2; if (markerYa(5, m) > 160e6) lo = m; else hi = m; } return lo * SLOW; })();
/** Beat 6 (s): v3's marker reaches 1750 at 1.4 × SLOW and v3's cruise would start at V3_CR × SLOW; instead v3 rests there
 *  while the charts cross-fade (Z), the status reads "1750 → today", a click (Z_HOLD), " → today" fades (ST_OUT), and
 *  the cruise starts at Z_CR. Everything of v3's after that runs Z_DT later. */
// slower (lecturer, 30 Oct 2026: "no blink; transit slowly"): the cross-fade 1.4 s, " → today" fades over 0.6 s
const V3_CR = 1.6, Z: V = [2.6, 4.0], Z_HOLD = 4.1, ST_OUT: V = [4.15, 4.75], Z_CR = 4.8, Z_DT = Z_CR - V3_CR * SLOW;
/** v3's time in beat b at time t. */
const v3T = (b: number, t: number): number => (b === 4 ? V3_REST + Math.max(0, t - B4.xf[1]) / SLOW
  : b === 5 ? t / SLOW
  : b === 6 ? (t < V3_CR * SLOW ? t / SLOW : t < Z_CR ? V3_CR : (t - Z_DT) / SLOW)
  : t);
const BIG = 99;
/** Earlier cards dim: to 0.45 at their dates (evo), to 0.6 in the compact row, where the type is small; beats 7–8 all. */
const DIM = 0.55, DIM_K = 0.4;

/** Seconds into beat n as seen from beat b at time t: before it −1, after it a large number. */
const tin = (b: number, t: number, n: number): number => (b === n ? t : b > n ? BIG : -1);
/** The step's progress, as the marker's (ease2). */
const ez = (t: number, w: V): number => ease2(t, w[0], w[1]);

function markX(b: number, t: number): number {
  // each card shows preference and speed together (lecturer, 30 Oct 2026); the small subunit's ancestral step (S only,
  // no speed measured) is told in the caption, not drawn
  const x35 = xGa(3.5), x295 = xGa(CARDS[1].ga), x27 = xGa(CARDS[2].ga), x105 = xGa(CARDS[3].ga), x10 = xGa(CARDS[4].ga);
  if (b === 0) return x35;
  if (b === 1) return t < B1.m2[0] ? lerp(x35, x295, ez(t, B1.m1)) : lerp(x295, x27, ez(t, B1.m2));
  if (b === 2) return lerp(x27, XGOE, ez(t, B2.m));
  if (b === 3) return t < B3.m2[0] ? lerp(XGOE, x105, ez(t, B3.m1)) : lerp(x105, x10, ez(t, B3.m2));
  return lerp(x10, X500, ez(t, B4.m));
}
/** Each card: when it appears [beat, t] and when it dims (the next one takes over; flowering plants in beat 7). */
// (flowering plants and the dimming of green algae follow the marker's time instead: bindR)
const CIN: Array<[number, V]> = [[0, B0.card], [1, B1.m1], [1, B1.m2], [3, B3.m1], [3, B3.m2], [5, [0, 0]]];
const CDIM: Array<[number, V]> = [[1, B1.m1], [1, B1.m2], [3, B3.m1], [3, B3.m2], [5, [0, 0]], [6, B6.dim]];
/** Key values over the beats: from v, then at each [beat, t0, t1] eased to the next value (log for S). */
function keyed(b: number, t: number, v0: number, keys: Array<[number, number, number, number]>, log = false): number {
  let v = v0;
  for (const [kb, t0, t1, to] of keys) {
    const u = ease2(tin(b, t, kb), t0, t1);
    if (u <= 0) break;
    v = log ? Math.exp(lerp(Math.log(v), Math.log(to), u)) : lerp(v, to, u);
  }
  return v;
}
const S_KEYS: Array<[number, number, number, number]> = [
  [1, ...B1.m1, 12], [1, ...B1.m2, 43], [3, ...B3.m1, 177], [3, ...B3.m2, 61], [4, ...B4.m, S_ANC],
];
/** The balance's RuBisCO: [beat, t0, t1] of each switch, to lineage i (5: the land plants, v3's own render). */
const P_KEYS: Array<[number, V, number]> = [[1, B1.m1, 1], [1, B1.m2, 2], [3, B3.m1, 3], [3, B3.m2, 4], [4, B4.m, 5]];
const PNAME = [...CARDS.slice(0, N_OCEAN).map(c => `${c.name} · ${c.short}`), enzyme('plant').name];
function panelWho(b: number, t: number): { from: number; to: number; u: number } {
  let from = 0, to = 0, u = 0;
  for (const [kb, w, i] of P_KEYS) {
    const v = ez(tin(b, t, kb), w);
    if (v <= 0) break;
    from = to; to = i; u = v;
    if (v >= 1) from = to;
  }
  return { from, to, u: from === to ? 1 : u };
}
const fmtOx = (ox: number): string => (ox <= 0.005 ? '0' : ox < 0.5 ? '&lt; 1' : String(Math.round(ox)));
const CRED = 'structures: PDB 1GEH, 9RUB, 1RBL, 1BWV · small subunit: Schulz et al. 2022';

type Setter = { set: (k: string, a: string, v: string) => void; op: (k: string, v: number) => void };
function setter(root: Element): Setter {
  const els = new Map<string, Element>();
  root.querySelectorAll('[data-k]').forEach(el => els.set(el.getAttribute('data-k') as string, el));
  const cache = new Map<Element, Map<string, string>>();
  const set = (k: string, a: string, v: string): void => {
    const el = els.get(k);
    if (!el) return;
    let m = cache.get(el);
    if (!m) { m = new Map(); cache.set(el, m); }
    if (m.get(a) === v) return;
    m.set(a, v);
    if (a === 'text') el.innerHTML = v; else el.setAttribute(a, v);
  };
  const op = (k: string, v: number): void => { set(k, 'display', v < 0.004 ? 'none' : 'inline'); set(k, 'opacity', v >= 0.996 ? '1' : v.toFixed(3)); };
  return { set, op };
}

function bindA(root: SVGSVGElement): (b: number, t: number) => void {
  const { set, op } = setter(root);
  // the algae ocean before land plants: scene 8's land plant stays hidden
  const io: SceneIO = { tr: (k, v) => set(k, 'transform', v), op: (k, v) => op(k, k === 's8-plant' ? 0 : v), at: (k, a, v) => set(k, a, v) };
  const t0wall = performance.now();

  return (b, t) => {
    const x = markX(b, t);
    // frozen frames (?t=) run the loops on the beat's time; in beat 5 on v3's clock, so the hand-over frame matches
    const amb = FROZEN ? (b === 4 ? v3T(4, t) : t) : (performance.now() - t0wall) / 1000;
    const bg = b === 0 ? ease(t, ...B0.bg) : 1;

    /* ---- the chart (v3's), revealed to the marker */
    op('cs-axes', bg); op('cs-curves', bg); op('cs-off', bg);
    set('cs-clip', 'width', f(Math.max(0, x - X0 + 6)));
    op('cs-goe', b === 2 ? ease(x, 152.5, 158.5) : b === 3 ? 1 - ease(t, B3.m1[0], B3.m1[0] + 1.2) : 0);   // fades as the marker leaves it
    op('cs-clab', 0); op('cs-status', 0);
    op('cs-ph', bg); set('cs-ph', 'transform', `translate(${f(x)} 0)`);
    set('cs-pdc', 'cy', f(Y0 + 26)); op('cs-pdc', 1); op('cs-pdt', 0);
    set('cs-crd', 'text', CRED); op('cs-crd', bg);
    for (let i = 0; i < 3; i++) op(`cs-clip${i}`, 0);

    /* ---- the scenes: early ocean → O₂ bubbles (Great Oxidation Event) → algae → the first land plants */
    const w = new Array<number>(N_SCENES).fill(0);
    if (b <= 1) w[0] = 1;
    else if (b === 2) { const r = ease(x, 152, 158.5); w[0] = 1 - r; w[1] = r; }
    else if (b === 3) { const r = ease(x, 165, 198); w[1] = 1 - r; w[SC_CARRIERS] = r; }
    else { const r = ease(x, 206, 236); w[SC_CARRIERS] = 1 - r; w[SC_FIRST_LAND] = r; }
    const pump = b === 3 ? ease(t, ...B3.pump) : b === 4 ? 1 - ez(t, B4.m) : 0;
    const spot: Spot = { cyano: 1, green: 1, plant: 0, red: 1, ccm: pump };
    for (let i = 0; i < N_SCENES; i++) {
      const v = w[i] * bg;
      op(`cs-sc${i}`, v);
      if (v > 0.004) animScene(i, amb, BIG, io, { spot });
    }

    /* ---- the balance (v3's panel): the RuBisCO named, its S, the air */
    op('c3-panel', b === 0 ? ease(t, ...B0.panel) : 1);
    op('c3-heads', 1); op('c3-gasc', 1);
    const who = panelWho(b, t);
    for (let i = 0; i < N_OCEAN; i++) op(`pi-${i}`, (who.to === i ? who.u : 0) + (who.from === i && who.from !== who.to ? 1 - who.u : 0));
    op('c3-rub', who.to === 5 ? who.u : 0);
    const name = who.u < 0.5 ? PNAME[who.from] : PNAME[who.to];
    set('c3-name', 'text', name); op('c3-name', who.from === who.to ? 1 : Math.abs(1 - 2 * who.u));
    const s = keyed(b, t, S_ARC, S_KEYS, true);
    const leave = b === 4 ? ez(t, B4.m) : 0;   // the Precambrian readouts empty, as v3's at 500 million years ago
    const sMax = lerp(177 * 1.04, S_MAX_V3, leave);
    set('c3-s', 'text', String(Math.round(s))); op('c3-s', 1);
    set('c3-sbar', 'width', f((QW * s) / sMax));
    // the air: v3's Precambrian stand-ins (CO₂ the 1750 value, a low bound; O₂ 0, then 0.1 % of today's)
    const rGoe = b < 2 ? 0 : b === 2 ? ease(x, 153, 158.5) : 1;
    const o2 = lerp(0, 0.001 * O2_TODAY, rGoe), o2g = lerp(lerp(0.16, 0.5, rGoe), 1, leave);
    set('c3-air', 'text', rGoe < 0.5 ? 'CO₂ high · almost no O₂' : 'CO₂ high · O₂ building up');
    op('c3-air', Math.abs(1 - 2 * rGoe) * (1 - leave));
    op('c3-gaso', o2g); op('c3-shell', 0);
    const m = 10 ** pump;
    for (let i = 0; i < 3; i++) op(`c3-x${i}`, clamp(pump * 1.3 - i * 0.1));
    op('c3-r1', 1); op('c3-r2', 1); op('c3-r3', 1); op('c3-r5', 0); op('c3-leaf', 0);
    for (const k of ['c3-hla', 'c3-bda', 'c3-bdt', 'c3-hlr', 'c3-bdr']) op(k, 0);
    const ox = oxPer100S(s, 25, CA_1750, o2, CC_CA * m), wBal = 1 - leave;
    const L = 100 * wBal, Rv = ox * wBal, th = (TILT * (L - Rv) * Math.PI) / 180;
    set('c3-beam', 'transform', `translate(${BX} ${YP}) rotate(${f(-TILT * (L - Rv))})`);
    const eL: V = [BX - ARM * Math.cos(th), YP + ARM * Math.sin(th)], eR: V = [BX + ARM * Math.cos(th), YP - ARM * Math.sin(th)];
    set('c3-trayL', 'transform', `translate(${f(eL[0])} ${f(eL[1] - 3.5)})`);
    set('c3-trayR', 'transform', `translate(${f(eR[0])} ${f(eR[1] - 3.5)})`);
    set('c3-barL', 'y', f(-3 - BAR * L)); set('c3-barL', 'height', f(BAR * L));
    set('c3-barR', 'y', f(-3 - BAR * Rv)); set('c3-barR', 'height', f(BAR * Rv));
    set('c3-bvL', 'y', f(-10 - BAR * L)); set('c3-bvR', 'y', f(-10 - BAR * Rv));
    set('c3-bvL', 'text', '100'); set('c3-bvR', 'text', fmtOx(ox));
    op('c3-bvL', wBal); op('c3-bvR', wBal);
  };
}

/** The record: appears card by card (beats 1–4, 6), compacts once (beat 5), dims (beats 7–8). */
function bindR(root: Element, land: () => Land | null): (b: number, t: number) => void {
  const { set, op } = setter(root);
  return (b, t) => {
    const t4 = tin(b, t, 4);
    const fo = ease(t4, ...B4.fo), gl = ease2(t4, ...B4.gl), fi = ease(t4, ...B4.fi);
    const dim6 = ease(tin(b, t, 6), ...B6.dim);
    const dim = lerp(DIM, DIM_K, fi);
    // the flowering plants come in as the marker passes their ancestor (175 → 160 million years ago), with the marker
    const lv = land(), floIn = b < 5 ? 0 : b > 5 ? 1 : ease(t, T_FLO - 0.6, T_FLO + 0.6);
    CARDS.forEach((c, i) => {
      const [ib, iw] = CIN[i], [db, dw] = CDIM[i];
      const cin = i === I_FLO ? floIn : i === 0 ? ease(tin(b, t, ib), ...iw) : ez(tin(b, t, ib), iw);
      const cdim = i === I_FLO - 1 ? floIn : i === I_FLO ? ease(tin(b, t, db), ...dw) : ez(tin(b, t, db), dw);
      op(`rc-${c.k}`, cin * (1 - dim * cdim));
      // where the card is: its date's place (expanded) → its slot in the row (compact)
      const big = i < N_OCEAN, u = big ? gl : 1;
      const ex = big ? cardX(i) : kX(i), kx = kX(i);
      const x = lerp(ex, kx, u), y = lerp(big ? CT : K_Y, K_Y, u);
      set(`rf-${c.k}`, 'x', f(x)); set(`rf-${c.k}`, 'y', f(y));
      set(`rf-${c.k}`, 'width', f(lerp(big ? CW : K_W[i], K_W[i], u))); set(`rf-${c.k}`, 'height', f(lerp(big ? CH : K_H, K_H, u)));
      set(`rf-${c.k}`, 'rx', f(lerp(big ? 12 : 8, 8, u)));
      const im = IMG[c.img], k = lerp(big ? IMK : KIMK, KIMK, u);
      const icx = lerp(big ? ex + CW / 2 : kx + K_PAD + K_IMW / 2, kx + K_PAD + K_IMW / 2, u), icy = lerp(big ? CT + E_IMY : K_Y + K_H / 2, K_Y + K_H / 2, u);
      set(`ri-${c.k}`, 'x', f(icx - (im.w * k) / 2)); set(`ri-${c.k}`, 'y', f(icy - (im.h * k) / 2));
      set(`ri-${c.k}`, 'width', f(im.w * k)); set(`ri-${c.k}`, 'height', f(im.h * k));
      for (const [r, eb, kb] of [[0, E_B1, K_B1], [1, E_B2, K_B2]] as const) {
        const bx = lerp(big ? ex + E_BX : kx + K_BX, kx + K_BX, u), by = lerp(big ? CT + eb : K_Y + kb, K_Y + kb, u);
        set(`rb${r}-${c.k}`, 'transform', `translate(${f(bx)} ${f(by)})`);
      }
      if (big) { op(`rr-${c.k}`, 1 - fo); op(`re-${c.k}`, 1 - fo); op(`rk-${c.k}`, fi); }
      // the values: cyanobacteria's small-subunit step, then today's; flowering plants' slow rise
      if (c.s === null || c.kcat === null) return;
      let s = c.s, kc = c.kcat;
      if (i === I_FLO) { s = lv && lv.ya !== null ? lv.s : S_ANC; kc = lv && lv.ya !== null ? lv.k : K_ANC; }
      set(`rs-${c.k}`, 'width', f((BW * s) / S_TOP)); set(`rv-${c.k}`, 'width', f((BW * kc) / K_TOP));
    });
    op('rleg', fi * (1 - DIM_K * dim6));
    op('rnote', floIn * (1 - DIM_K * dim6) * (1 - ease(tin(b, t, 7), 0, 1.0)));
    op('rcrd', b === 0 ? ease(t, ...B0.bg) : 1);
  };
}

/* ---------------------------------------------------------------- the zoomed chart (evoRa): 1750 → September 2026 */

const NOW = 2026.8, D_END = 2026.75, YA1750 = NOW - 1750, ZX1 = 1430;
/** x of a calendar year on the zoomed axis: v3's segment D (1750 → D_END) over the chart's full width. */
const xZ = (yr: number): number => X0 + ((yr - 1750) / (D_END - 1750)) * (ZX1 - X0);
const ZC: V = [260, 455], ZT: V = [-0.6, 1.8];  // CO₂ top 455: the 2026 dot clears the record's note
const yCz = (ppm: number): number => Y1 - ((ppm - ZC[0]) / (ZC[1] - ZC[0])) * (Y1 - Y0);
const yTz = (d: number): number => Y1 - ((d - ZT[0]) / (ZT[1] - ZT[0])) * (Y1 - Y0);
/** dk-c2story3.ts's at and cut: a series (years ago, descending) read linearly; null outside it. */
function at(pts: V[], ya: number): number | null {
  const n = pts.length, eps = 1e-6 * Math.max(1, Math.abs(ya));
  if (!n || ya > pts[0][0] + eps || ya < pts[n - 1][0] - eps) return null;
  const y = Math.min(pts[0][0], Math.max(pts[n - 1][0], ya));
  for (let i = 0; i < n - 1; i++) {
    const [a0, v0] = pts[i], [a1, v1] = pts[i + 1];
    if (y <= a0 && y >= a1) return a0 === a1 ? v0 : v0 + ((v1 - v0) * (a0 - y)) / (a0 - a1);
  }
  return pts[n - 1][1];
}
function cut(pts: V[], ya0: number, ya1: number): V[] {
  const inner = pts.filter(([a]) => a < ya0 && a > ya1);
  const s = at(pts, ya0), e = at(pts, ya1);
  return [...(s !== null ? [[ya0, s] as V] : []), ...inner, ...(e !== null ? [[ya1, e] as V] : [])];
}
/** Read at ya, held at the series' ends (the marker's dots). */
const atHeld = (pts: V[], ya: number): number => at(pts, Math.min(pts[0][0], Math.max(pts[pts.length - 1][0], ya))) as number;
const Z_CO2: V[] = CO2_D.map(([yr, v]): V => [NOW - yr, v]);
// as v3's TS[3]: the LGMR reconstruction (Osman et al. 2021) from 1750 to its 176.8 years-ago bin, then HadCRUT5
const Z_T: V[] = [...cut(T_C.map(([a, v]): V => [a, v]), YA1750, NOW - T_D[0][0]), ...T_D.map(([yr, v]): V => [NOW - yr, v])];
const Z_YRS = [1750, 1800, 1850, 1900, 1950, 2000, 2026], Z_CT = [280, 320, 360, 400], Z_TT = [0, 0.5, 1, 1.5];

function zoomSvg(): string {
  const dz = (pts: V[], y: (v: number) => number): string => `M${pts.map(([a, v]) => `${f(xZ(NOW - a))},${f(y(v))}`).join(' L')}`;
  const xt = Z_YRS.map(yr => `<path class="cs-tick" d="M${f(xZ(yr))},${Y1} v8"/>${T(xZ(yr), Y1 + 28, String(yr), 'cs-tk cs-halo', yr === 2026 ? 'end' : 'middle')}`).join('');
  const grid = Z_CT.map(v => `<path class="cs-grid" d="M${X0},${f(yCz(v))} H${ZX1}"/>`).join('');
  const cl = Z_CT.map(v => `<path class="cs-tick" d="M${X0},${f(yCz(v))} h-7"/>${T(X0 - 12, yCz(v) + 6, String(v), 'cs-tk cs-halo', 'end')}`).join('');
  const tl = Z_TT.map(v => `<path class="cs-tickt" d="M${ZX1},${f(yTz(v))} h7"/>${T(ZX1 + 12, yTz(v) + 6, v > 0 ? `+${v.toFixed(1)}` : '0', 'cs-tkt cs-halo')}`).join('');
  const co2 = dz(Z_CO2, yCz), tmp = dz(Z_T, yTz);
  return `<g data-k="zm" opacity="0" display="none">
    <g data-k="zm-axes">${grid}<path class="cs-zero" d="M${X0},${f(yTz(0))} H${ZX1}"/>
      <path class="cs-axis" d="M${X0},${Y0} H${ZX1} M${X0},${Y1} H${ZX1} M${X0},${Y0} V${Y1} M${ZX1},${Y0} V${Y1}"/>
      ${xt}${cl}${tl}${T((X0 + ZX1) / 2, Y1 + 52, 'year', 'cs-ax cs-halo', 'middle')}</g>
    <clipPath id="zra-clip"><rect data-k="zm-clip" x="${X0 - 6}" y="0" width="0" height="470"/></clipPath>
    <g data-k="zm-curves" clip-path="url(#zra-clip)">
      <path class="cs-co2h" d="${co2}"/><path class="cs-co2" d="${co2}"/><path class="cs-th" d="${tmp}"/><path class="cs-t" d="${tmp}"/>
    </g>
    <g data-k="zm-lab">${T(X0 + 20, yCz(278) + 23, 'CO₂', 'cs-lc cs-halo')}${T(X0 + 20, yTz(0) - 16, 'temperature', 'cs-lt cs-halo')}</g>
    <g data-k="zm-ph"><path class="cs-phl" d="M0,${Y0 - 4} V${Y1}"/><circle data-k="zm-pdc" class="cs-pdc" cx="0" cy="0" r="7"/><circle data-k="zm-pdt" class="cs-pdt" cx="0" cy="0" r="7"/></g>
  </g>`;
}
/** The status while it zooms: v3's "1750" (same place and style, so the swap does not show), then " → today" fades in. */
const zStatus = (): string => `<text data-k="zm-st" class="cs-status cs-halo" x="${X0}" y="${Y0 - 28}" opacity="0" display="none">1750<tspan data-k="zm-st2" style="fill-opacity:0;stroke-opacity:0"> → today</tspan></text>`;

/** The zoom: the broken-axis chart out and the zoomed chart in (beat 6, once; it stays); the zoomed marker at v3's time. */
function bindZ(root: SVGSVGElement, land: () => Land | null): (b: number, t: number) => void {
  const { set, op } = setter(root);
  return (b, t) => {
    const z = b < 6 ? 0 : b === 6 ? ease(t, ...Z) : 1;
    op('zo-ax', 1 - z); op('zo-rest', 1 - z); op('zm', z);
    // beat 7 dims the chart and takes the marker away, as v3's
    const last = b === 7, dimLast = last ? 1 - 0.65 * ease(t, 0, 1.2) : 1;
    op('zm-axes', dimLast); op('zm-curves', dimLast); op('zm-lab', dimLast); op('zm-ph', last ? 1 - ease(t, 0, 1.2) : 1);
    // the status: "1750 → today" from the zoom until just before the cruise; v3's otherwise
    const own = b === 6 && t >= Z[0] && t < ST_OUT[1], a = own ? ease(t, ...Z) * (1 - ease(t, ...ST_OUT)) : 0;
    op('zo-st', own ? 0 : 1); op('zm-st', own ? 1 : 0);
    set('zm-st2', 'style', `fill-opacity:${a.toFixed(3)};stroke-opacity:${a.toFixed(3)}`);
    if (z < 0.004) return;
    const lv = land(), ya = Math.min(YA1750, lv && lv.ya !== null ? lv.ya : YA1750), x = xZ(NOW - ya);
    set('zm-clip', 'width', f(Math.max(0, x - X0 + 6)));
    set('zm-ph', 'transform', `translate(${f(x)} 0)`);
    set('zm-pdc', 'cy', f(yCz(atHeld(Z_CO2, ya)))); set('zm-pdt', 'cy', f(yTz(atHeld(Z_T, ya))));
  };
}

/** Part A's stage: v3's (ids renamed), the per-lineage renders in its balance. */
const stageA = (): string => renameIds(V3L.svg(), 'ea-').replace(/(<g data-k="c3-rub">[\s\S]*?<\/g>)/, `$1${panelImgs()}`);
/** v3's stage with its clippings 16 px lower (beat 8: the closing question fits between them and the record); its
 *  chart in 2 groups that fade out (zo-ax, zo-rest; the rotated axis titles, the same in both charts, stay), its status
 *  line in a third (zo-st); the zoomed chart above it, under the balance. */
const CLIP_DY = 16;
const stageV3 = (): string => V3L.svg()
  .replace('<g data-k="cs-axes" opacity="0">', '<g data-k="cs-axes" opacity="0"><g data-k="zo-ax">')
  .replace('<text class="cs-axc', '</g><text class="cs-axc')
  .replace('<clipPath id="c3-clip">', '<g data-k="zo-rest"><clipPath id="c3-clip">')
  .replace(/(<text data-k="cs-status"[^>]*>[^<]*<\/text>)/, `</g><g data-k="zo-st">$1</g>${zStatus()}`)
  .replace('<g data-k="c3-panel"', `${zoomSvg()}<g data-k="c3-panel"`)
  .replace('<g data-k="cs-clip0"', `<g transform="translate(0 ${CLIP_DY})"><g data-k="cs-clip0"`).replace(/<\/g>\s*$/, '</g></g>');

/* ---------------------------------------------------------------- the staging */

type Part = 'a' | 'v3';
const layer = (part: Part, inner: string): string =>
  `<svg data-part="${part}" x="0" y="0" width="1600" height="740" viewBox="0 0 1600 740" overflow="visible" style="pointer-events:none">${inner}</svg>`;
/** Beat 8's "or learn from" row, under v3's clippings (as evo, 8 px lower and 10 px shorter). */
const learnSvg = (): string => `<g data-k="learn" opacity="0" class="ce">
  <rect class="ce-learnbg" x="420" y="412" width="760" height="54" rx="14"/>
  ${T(800, 447, 'or learn from plants that concentrate CO₂: C₂ · C₄ · CAM', 'ce-learn', 'middle')}</g>`;

export const STAGING: Staging = {
  id: 'evoRa',
  name: 'evoRa · the record, zoom to 1750 → today: cross-fade',
  note: 'EvoR with the modern-era zoom: when the marker reaches 1750 the broken-axis chart fades out over 0.8 s while a 1750 → 2026 chart (CO₂ 260–455 ppm, temperature −0.6 to +1.8 °C) fades in at the same place; a pause; then the cruise to 2026, the hot and the dry day on the zoomed chart.',
  beats: C2STORY5,
  // a pause after each new RuBisCO form (form II, form I before the small subunit's step, form ID), at the dinosaurs
  // (v3's walk to 100 million years ago ends at 1.8 s), and v3's own in beat 7; v3's times × SLOW
  // beat 6: after the zoom, then v3's own, Z_DT later
  holds: [[], [B1.m1[1] + 0.1, B1.m2[1] + 0.1], [], [B3.m1[1] + 0.1], [B4.fi[1] + 0.1, B4.xf[1] + 0.1], [2.0 * SLOW],  /* beat 5: pauses before leaving the ocean and as land plants arrive (lecturer, 30 Oct 2026) */ [Z_HOLD, ...((V3.holds ?? [])[6] ?? []).map(h => h * SLOW + Z_DT)], []],
  // only the closing question, centred between the record and the clippings
  keys: [{ beat: 7, text: 'First: how does the leaf turn 3-PGA into sugar?', x: 800, y: 115, size: 42 }],
  svg: () => `${layer('a', stageA())}${layer('v3', stageV3())}${recordSvg()}${learnSvg()}`,
  bind(stage) {
    const as = stage.querySelector<SVGSVGElement>('svg[data-part="a"]')!, vs = stage.querySelector<SVGSVGElement>('svg[data-part="v3"]')!;
    const rec = stage.querySelector<SVGGElement>('[data-k="rec"]')!;
    // the land-plant RuBisCO under v3's marker, written by v3 each frame it draws, read by the record
    let lv: Land | null = null;
    const drawA = bindA(as), drawV = makeV3({ ...LAND, onFrame: (ya, s, k) => { lv = { ya, s, k }; } }).bind(vs), drawR = bindR(rec, () => lv);
    const drawZ = bindZ(vs, () => lv);
    const learn = stage.querySelector<SVGGElement>('[data-k="learn"]');
    const show = (el: SVGSVGElement, o: number): void => { el.style.opacity = o.toFixed(3); el.style.display = o < 0.004 ? 'none' : ''; };
    return (beat, t) => {
      const b = Math.round(beat);
      // part A in beats 1–4 and the start of beat 5; there it hands over to v3, both at rest on the same frame
      const aOp = b <= 3 ? 1 : b === 4 ? 1 - ease(t, ...B4.xf) : 0;
      show(as, aOp); show(vs, 1 - aOp);
      if (aOp > 0.004) drawA(b, t);
      lv = null;
      if (aOp < 0.996) { drawV(b, v3T(b, t)); drawZ(b, t); }
      drawR(b, t);
      learn?.setAttribute('opacity', (b === 7 ? ease(t, 4.2, 5.0) : 0).toFixed(3));
    };
  },
};

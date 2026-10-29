// 'c2story', staging evoRh · slide 15 RuBisCO, beats C2STORY5 with beat 6 (0-based) its own (HOT_BEATS): evoR
// (c2story-record.ts; read its header first) with a visible hot day (lecturer, 30 Oct 2026: "the 2026 hot day as tiny text
// is very confusing: the graph does not change but the balance does; make the hot day visible"; "transit slowly, not
// everything at once"). Everything else is evoR's, unchanged.
// - Beat 6: v3's cruise to 2026 and a hold; then makeV3's Today hook (dk-c2story3.ts) replaces v3's hot and dry day. One
//   summer day is drawn left of the balance, over the scene; the yearly global curve gets no label. Only 2 cases, a
//   normal day and a hot, dry day (lecturer, 30 Oct 2026, late: "show the stomata and the temperature meter together,
//   changing in parallel; only normal and high temperature, nothing in between"):
//   1 a leaf thermometer (the deck's, co2-kit) and a leaf section in a round lens (a stoma between 2 guard cells in the
//     deck's guard-cell colours, ov-a; atom-ball CO₂ outside and inside) fade in together, at today's values (leaf 25 °C +
//     ΔGMST 1.49 = 26.5 °C, the stoma open);
//   2 the status line fades to "2026 · a hot, dry day" while one driver (3 s, eased) raises the thermometer to 35 °C and
//     closes the stoma halfway (pore half-width 10 → 5; the CO₂ arrow through the pore thins, 1 of the 4 CO₂ inside fades),
//     with the sun and a warm tint; the panel's leaf temperature and the balance follow in the same frames (C꜀/Cₐ 0.468 →
//     0.35, as v3's dry day: 46 → 94); a hold;
//   3 evening: the status line fades to "2026" while the same driver runs back (3 s): the balance returns to 46. The
//     thermometer and the lens fade with beat 7's dimming.
// - The caption changes with every step (STEPS): the age and the RuBisCO of that phase.
// - Numbers (oxPer100S as v3 calls it; tobacco Γ*, Bernacchi 2001; land-plant S at today's 87.1 = S_PLANT): 2026, 429.55
//   ppm, leaf 26.5 °C → 46; leaf 35 °C with C꜀/Cₐ 0.35 → 94; evening → 46.
import './c2story-evo.css';
import { C2STORY5 } from './beats-c2story';
import { makeV3, markerYa, type LandRubisco, type Today } from './dk-c2story3';
import { animScene, N_SCENES, SC_CARRIERS, SC_FIRST_LAND, type SceneIO, type Spot } from './c2story-scenes';
import { CO2_D, T_D } from './c2story-data';
import { CC_CA, leafT, O2_TODAY } from './c2story-model';
import { ENZYMES, enzyme, oxPer100S } from './c2story-enzyme';
import { balls } from '../figs/cell-schema';
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
/** v3 for the stage markup (its hot and dry day replaced by this staging's: TODAY). */
const V3L = makeV3(LAND, { at: t => TODAY.at(t), status: t => TODAY.status?.(t) ?? null });
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
/** v3's time in beat b at time t. */
const v3T = (b: number, t: number): number => (b === 4 ? V3_REST + Math.max(0, t - B4.xf[1]) / SLOW : b === 5 || b === 6 ? t / SLOW : t);
const BIG = 99;

/* ---------------------------------------------------------------- the visible hot day (beat 6, after 2026) */

/** Beat 6 on this staging's clock (s): v3's cruise reaches 2026 at 4.8 × SLOW = 7.68 s, its readouts settle by 8.16 s.
 *  Only 2 cases, a normal day and a hot, dry day, and the thermometer and the stoma always together (lecturer, 30 Oct 2026,
 *  late: "show the stomata and the temperature meter together, change them in parallel, not sequentially; only the normal
 *  and the high temperature, nothing in between"): after the hold at 2026 both fade in, at today's values (1.2 s); the
 *  status line fades to "2026 · a hot, dry day" while one driver (3 s) heats the leaf and half-closes the stoma at once;
 *  a hold; then the evening: the status line fades back to "2026" while the same driver runs back (3 s). */
const HD = {
  h0: 8.3,
  inst: [8.4, 9.6] as V,
  st1: [9.8, 10.4, 11.0] as [number, number, number], hot: [10.4, 13.4] as V,
  h1: 13.5,
  st2: [13.6, 14.2, 14.8] as [number, number, number], eve: [14.2, 17.2] as V,
};
/** Today's air and leaf (v3's state at rest on 2026: the last CO₂ and temperature points); the hot day's leaf; the dry
 *  day's C꜀/Cₐ (as v3's). */
const CA_TODAY = CO2_D[CO2_D.length - 1][1], TL_TODAY = leafT(T_D[T_D.length - 1][1]), TL_HOT = 35, K_DRY = 0.35;
/** The one driver at beat-6 time t (s): heat and dryness rise together and fall together in the evening. */
function hotAt(t: number): { heat: number; dry: number } {
  const u = ease2(t, ...HD.hot) * (1 - ease2(t, ...HD.eve));
  return { heat: u, dry: u };
}
/** The staging's beat and time, set each frame before v3 draws (beat 7's status dims with v3's). */
const cur = { b: 0, t: 0 };
const TODAY: Today = {
  // v3's time in beat 6 (SLOW × slower here); END in beat 7, where every driver has run out
  at: tv => {
    const ts = tv * SLOW, { heat, dry } = hotAt(ts);
    return ts < HD.h0 ? null : { ca: CA_TODAY, tl: lerp(TL_TODAY, TL_HOT, heat), k: lerp(CC_CA, K_DRY, dry) };
  },
  status: tv => {
    if (cur.b >= 7) return ['2026', 1 - 0.45 * ease(cur.t, 0, 1.2)];
    const ts = tv * SLOW;
    // each change: the old line fades out, the new one in
    const step = (s: [number, number, number], a: string, b: string): [string, number] =>
      ts < s[1] ? [a, 1 - ease(ts, s[0], s[1])] : [b, ease(ts, s[1], s[2])];
    if (ts < HD.st1[0]) return null;
    if (ts < HD.st2[0]) return step(HD.st1, '2026', '2026 · a hot, dry day');
    return step(HD.st2, '2026 · a hot, dry day', '2026');
  },
};

// the thermometer (co2-kit's thermoG, larger): tube, bulb, 20–40 °C, ticks at 25 and 35 °C
const TH = { x: 676, top: 514, bot: 650, r: 15 };
const thY = (c: number): number => TH.bot - 8 - ((c - 20) / 20) * (TH.bot - TH.top - 16);
// the leaf section in a round lens: leaf cells above, the lower epidermis with a stoma, the outside air below
const LC: V = [800, 596], LR = 88, EPI0 = 610, EPI1 = 632, GY = (EPI0 + EPI1) / 2, GRX = 19, GRY = 15;
/** The pore's half-width (open 10, half closed 5). */
const poreW = (dry: number): number => lerp(10, 5, dry);
/** CO₂ glyphs: atom balls, smaller type. */
const co2 = (x: number, y: number, r = 7.5): string => balls(x, y, 'OCO', r).replace(/class="cel-att/g, 'style="font-size:10px" class="cel-att');
const CO2_OUT: V[] = [[764, 652], [836, 652]];
const CO2_IN: V[] = [[754, 590], [846, 590], [764, 560], [836, 560]];
/** A guard cell in section, centred at the origin, its pore side (thickened wall) towards +x; mirrored for the right one. */
const guard = (m: boolean): string => `<g${m ? ' transform="scale(-1 1)"' : ''}>
  <ellipse cx="0" cy="0" rx="${GRX}" ry="${GRY}" style="fill:#dbe8c6;stroke:#8f9f6a;stroke-width:2.2"/>
  <path d="M${GRX - 3},-9 Q${GRX + 1},0 ${GRX - 3},9" style="fill:none;stroke:#7d8c58;stroke-width:4;stroke-linecap:round"/>
  <ellipse cx="-6" cy="-4" rx="4.5" ry="3.2" style="fill:#9fbf6e;stroke:#6f8f45;stroke-width:1"/><ellipse cx="-4" cy="6" rx="4.5" ry="3.2" style="fill:#9fbf6e;stroke:#6f8f45;stroke-width:1"/></g>`;
function lensSvg(): string {
  const [cx, cy] = LC;
  const cells = [690, 746, 802, 858, 914].map((x, i) => {
    const y = 522 + (i % 2) * 8;
    return `<ellipse cx="${x}" cy="${y}" rx="27" ry="20" style="fill:#e4edd2;stroke:#9fb57a;stroke-width:2"/>
      <ellipse cx="${x - 12}" cy="${y + 11}" rx="5" ry="3.4" style="fill:#9fbf6e;stroke:#6f8f45;stroke-width:1"/><ellipse cx="${x + 11}" cy="${y + 11}" rx="5" ry="3.4" style="fill:#9fbf6e;stroke:#6f8f45;stroke-width:1"/>`;
  }).join('');
  const walls = [700, 742, 858, 900].map(x => `<path d="M${x},${EPI0} V${EPI1}" style="stroke:#c9b98f;stroke-width:2.4"/>`).join('');
  return `<clipPath id="hd-lc"><circle cx="${cx}" cy="${cy}" r="${LR}"/></clipPath>
    <circle cx="${cx}" cy="${cy}" r="${LR}" style="fill:#fffdf8"/>
    <g clip-path="url(#hd-lc)">
      <rect x="${cx - LR}" y="${cy - LR}" width="${2 * LR}" height="${EPI0 - cy + LR}" style="fill:#f7f4ea"/>
      <rect x="${cx - LR}" y="${EPI1}" width="${2 * LR}" height="${cy + LR - EPI1}" style="fill:#e8eff1"/>
      ${cells}
      <rect x="${cx - LR}" y="${EPI0}" width="${2 * LR}" height="${EPI1 - EPI0}" style="fill:#f3eedc;stroke:#c9b98f;stroke-width:2.4"/>${walls}
      <rect x="${cx - 46}" y="${EPI0 - 2}" width="92" height="${EPI1 - EPI0 + 4}" style="fill:#f7f4ea"/>
      <rect x="${cx - 46}" y="${EPI1}" width="92" height="6" style="fill:#e8eff1"/>
      ${CO2_OUT.map(([x, y]) => co2(x, y)).join('')}
      ${CO2_IN.map(([x, y], i) => `<g data-k="hd-ci${i}">${co2(x, y)}</g>`).join('')}
      <path data-k="hd-arr" d="M${cx},678 V${GY - 46}" style="fill:none;stroke:#6b6a64;stroke-width:5;stroke-linecap:round"/>
      <path data-k="hd-arrh" d="M${cx},${GY - 58} l-8,13 h16z" style="fill:#6b6a64"/>
      <g data-k="hd-gl">${guard(false)}</g><g data-k="hd-gr">${guard(true)}</g>
    </g>
    <circle cx="${cx}" cy="${cy}" r="${LR}" style="fill:none;stroke:#3d3d3a;stroke-width:2.6"/>
    ${T(cx, cy + LR + 20, 'stoma', 'cs-note cs-halo', 'middle')}`;
}
function thermoSvg(): string {
  const { x, top, bot, r } = TH;
  const tick = (c: number, s: string): string => `<path d="M${x - 12},${f(thY(c))} h-7" style="stroke:#6b6a64;stroke-width:1.8"/>${T(x - 23, thY(c) + 5, s, 'cs-note cs-halo', 'end')}`;
  return `<rect x="${x - 9}" y="${top}" width="18" height="${bot - top}" rx="9" style="fill:#fffdf8;stroke:#6b6a64;stroke-width:1.8"/>
    <circle cx="${x}" cy="${bot + r - 2}" r="${r}" style="fill:#fffdf8;stroke:#6b6a64;stroke-width:1.8"/>
    <rect data-k="hd-merc" x="${x - 4.5}" y="${f(thY(TL_TODAY))}" width="9" height="${f(bot + 4 - thY(TL_TODAY))}" style="fill:#c2401f"/>
    <circle cx="${x}" cy="${bot + r - 2}" r="${r - 5}" style="fill:#c2401f"/>
    ${tick(25, '25 °C')}${tick(35, '35 °C')}${T(x, bot + 2 * r + 18, 'leaf', 'cs-note cs-halo', 'middle')}`;
}
/** The sun (co2-kit's sunG colours) with a warm glow. */
const SUN: V = [580, 512];
function sunSvg(): string {
  const [x, y] = SUN, r = 17;
  const rays = Array.from({ length: 8 }, (_, i) => { const a = (i * Math.PI) / 4; return `<path d="M${f(x + (r + 6) * Math.cos(a))},${f(y + (r + 6) * Math.sin(a))}L${f(x + (r + 15) * Math.cos(a))},${f(y + (r + 15) * Math.sin(a))}"/>`; }).join('');
  return `<radialGradient id="hd-glow"><stop offset="0" stop-color="#f8c45a" stop-opacity=".55"/><stop offset="1" stop-color="#f8c45a" stop-opacity="0"/></radialGradient>
    <circle cx="${x}" cy="${y}" r="95" style="fill:url(#hd-glow)"/>
    <circle cx="${x}" cy="${y}" r="${r}" style="fill:#f6c453;stroke:#d39a14;stroke-width:1.6"/><g style="fill:none;stroke:#d39a14;stroke-width:2.6;stroke-linecap:round">${rays}</g>`;
}
/** The day's layer, above the scene, left of the balance. */
const hotSvg = (): string => `<g class="c2s c3s" data-k="hd">
    <g data-k="hd-sun" opacity="0" display="none">${sunSvg()}</g>
    <g data-k="hd-th" opacity="0" display="none">${thermoSvg()}</g>
    <g data-k="hd-ln" opacity="0" display="none">${lensSvg()}</g>
  </g>`;
/** The warm tint, over v3's scenes, under its chart and panel. */
const tintSvg = (): string => `<linearGradient id="hd-tg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f2a640" stop-opacity="0"/><stop offset=".45" stop-color="#f2a640" stop-opacity=".2"/><stop offset="1" stop-color="#e98a2c" stop-opacity=".26"/></linearGradient>
  <rect data-k="hd-tint" x="0" y="420" width="1600" height="320" style="fill:url(#hd-tg)" opacity="0" display="none"/>`;

/** Draws the day at the staging's beat b, time t (beat 6 only; beat 7: the thermometer and the lens fade with v3's dimming). */
function bindHot(root: Element, tint: Element): (b: number, t: number) => void {
  const { set, op } = setter(root), tn = setter(tint);
  return (b, t) => {
    const { heat, dry } = b === 6 ? hotAt(t) : { heat: 0, dry: 0 };
    const out = b === 7 ? 1 - ease(t, 0, 1.2) : b === 6 ? 1 : 0;
    op('hd-th', (b === 6 ? ease(t, ...HD.inst) : 1) * out);
    op('hd-ln', (b === 6 ? ease(t, ...HD.inst) : 1) * out);
    op('hd-sun', heat);
    tn.op('hd-tint', heat);
    const tl = lerp(TL_TODAY, TL_HOT, heat);
    set('hd-merc', 'y', f(thY(tl))); set('hd-merc', 'height', f(TH.bot + 4 - thY(tl)));
    // the stoma closes halfway: the guard cells move in, the CO₂ arrow thins, 1 of the 4 CO₂ inside fades
    const p = poreW(dry);
    set('hd-gl', 'transform', `translate(${f(LC[0] - p - GRX)} ${GY})`);
    set('hd-gr', 'transform', `translate(${f(LC[0] + p + GRX)} ${GY})`);
    set('hd-arr', 'style', `fill:none;stroke:#6b6a64;stroke-width:${f(lerp(5, 2.5, dry))};stroke-linecap:round`);
    set('hd-arrh', 'transform', `translate(${LC[0]} ${GY - 52}) scale(${f(lerp(1, 0.7, dry))}) translate(${-LC[0]} ${-(GY - 52)})`);
    op('hd-ci3', 1 - dry);
  };
}

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

/** Part A's stage: v3's (ids renamed), the per-lineage renders in its balance. */
const stageA = (): string => renameIds(V3L.svg(), 'ea-').replace(/(<g data-k="c3-rub">[\s\S]*?<\/g>)/, `$1${panelImgs()}`);
/** v3's stage with its clippings 16 px lower (beat 8: the closing question fits between them and the record). */
const CLIP_DY = 16;
const stageV3 = (): string => V3L.svg().replace('<g data-k="cs-chart">', `${tintSvg()}<g data-k="cs-chart">`).replace('<g data-k="cs-clip0"', `<g transform="translate(0 ${CLIP_DY})"><g data-k="cs-clip0"`).replace(/<\/g>\s*$/, '</g></g>');

/* ---------------------------------------------------------------- the staging */

/** C2STORY5 with beat 6 (0-based) telling the visible day; its citations kept. */
/** The captions, one per step of the holds (lecturer, 30 Oct 2026, late: "every phase change, change the text below to
 *  show what age we were in and what RuBisCO was there; not the same text for each phase; only the essentials"). The
 *  beats' own tag and text stay as the fallback; the citations are the beats'. */
const STEPS: Array<Array<{ tag: string; say: string }>> = [
  [{ tag: '≈ 3.5 billion years ago', say: 'An ocean world without O₂. The first RuBisCO, form III (archaea), hardly tells CO₂ from O₂.' }],
  [{ tag: '≈ 3 billion years ago', say: 'Form II (purple bacteria): 2 large subunits; still a low CO₂ preference.' },
    { tag: '≈ 2.7 billion years ago', say: 'Form I (cyanobacteria): 8 large + 8 small subunits; a higher CO₂ preference, and fast.' }],
  [{ tag: '≈ 2.4 billion years ago', say: 'Cyanobacteria fill the air with O₂ (the Great Oxidation Event): RuBisCO now meets O₂.' }],
  [{ tag: '≈ 1 billion years ago', say: 'Red algae: form ID, very selective for CO₂, but slow.' },
    { tag: '≈ 1 billion years ago', say: 'Green algae: form I, with a CO₂ pump around RuBisCO.' }],
  [{ tag: 'In the ocean, 2 answers', say: 'A more selective but slower RuBisCO (red algae), or a CO₂ pump (cyanobacteria, green algae).' },
    { tag: '≈ 500 million years ago', say: 'Plants reach land with the green-algal RuBisCO, mostly without a CO₂ pump.' },
    { tag: '≈ 300 million years ago', say: 'Carboniferous: O₂ rose to ≈ 30 % and CO₂ fell, so RuBisCO took up more O₂.' }],
  [{ tag: '≈ 100 million years ago', say: 'Dinosaurs: much CO₂, but great heat. Flowering plants (from ≈ 160 million years ago): their RuBisCO improves only slowly.' },
    { tag: '≈ 20,000 years ago', say: 'Ice age: little CO₂, but cold. RuBisCO almost as today.' }],
  [{ tag: '1750 → 2026', say: 'CO₂ rose from 278 to ≈ 430 ppm: with the same RuBisCO, oxygenation fell.' },
    { tag: 'A hot, dry day', say: 'Leaf at 35 °C, stomata half closed: oxygenation about doubles.' },
    { tag: 'Evening', say: 'The leaf cools and the stomata open again: back to normal.' }],
];
const HOT_BEATS = C2STORY5.map((bt, i) => (STEPS[i] ? { ...bt, steps: STEPS[i] } : bt));

type Part = 'a' | 'v3';
const layer = (part: Part, inner: string): string =>
  `<svg data-part="${part}" x="0" y="0" width="1600" height="740" viewBox="0 0 1600 740" overflow="visible" style="pointer-events:none">${inner}</svg>`;
/** Beat 8's "or learn from" row, under v3's clippings (as evo, 8 px lower and 10 px shorter). */
const learnSvg = (): string => `<g data-k="learn" opacity="0" class="ce">
  <rect class="ce-learnbg" x="420" y="412" width="760" height="54" rx="14"/>
  ${T(800, 447, 'or learn from plants that concentrate CO₂: C₂ · C₄ · CAM', 'ce-learn', 'middle')}</g>`;

export const STAGING: Staging = {
  id: 'evoRh',
  name: 'evoRh · evoR with a visible hot day',
  note: 'EvoR, with the 2026 hot day made visible: after 2026, a leaf thermometer rises from 26.5 to 35 °C under a summer sun (oxygenations 46 → 70 per 100 carboxylations); then a stoma in a leaf section closes halfway and less CO₂ gets in (→ 94); in the evening everything returns (→ 46). One step per click.',
  beats: HOT_BEATS,
  // a pause after each new RuBisCO form (form II, form I before the small subunit's step, form ID), at the dinosaurs
  // (v3's walk to 100 million years ago ends at 1.8 s), and v3's own in beat 7; v3's times × SLOW
  holds: [[], [B1.m1[1] + 0.1] /* the beat's end is the stop at cyanobacteria (a second hold there was an empty click) */, [], [B3.m1[1] + 0.1], [B4.fi[1] + 0.1, B4.xf[1] + 0.1], [2.0 * SLOW],  /* beat 5: pauses before leaving the ocean and as land plants arrive (lecturer, 30 Oct 2026) */ [HD.h0, HD.h1], []],
  // only the closing question, centred between the record and the clippings
  keys: [{ beat: 7, text: 'First: how does the leaf turn 3-PGA into sugar?', x: 800, y: 115, size: 42 }],
  svg: () => `${layer('a', stageA())}${layer('v3', stageV3())}${hotSvg()}${recordSvg()}${learnSvg()}`,
  bind(stage) {
    const as = stage.querySelector<SVGSVGElement>('svg[data-part="a"]')!, vs = stage.querySelector<SVGSVGElement>('svg[data-part="v3"]')!;
    const rec = stage.querySelector<SVGGElement>('[data-k="rec"]')!;
    // the land-plant RuBisCO under v3's marker, written by v3 each frame it draws, read by the record
    let lv: Land | null = null;
    const drawA = bindA(as), drawV = makeV3({ ...LAND, onFrame: (ya, s, k) => { lv = { ya, s, k }; } }, TODAY).bind(vs), drawR = bindR(rec, () => lv);
    const drawH = bindHot(stage.querySelector('[data-k="hd"]')!, vs);
    const learn = stage.querySelector<SVGGElement>('[data-k="learn"]');
    const show = (el: SVGSVGElement, o: number): void => { el.style.opacity = o.toFixed(3); el.style.display = o < 0.004 ? 'none' : ''; };
    return (beat, t) => {
      const b = Math.round(beat);
      cur.b = b; cur.t = t;
      // part A in beats 1–4 and the start of beat 5; there it hands over to v3, both at rest on the same frame
      const aOp = b <= 3 ? 1 : b === 4 ? 1 - ease(t, ...B4.xf) : 0;
      show(as, aOp); show(vs, 1 - aOp);
      if (aOp > 0.004) drawA(b, t);
      lv = null;
      if (aOp < 0.996) drawV(b, v3T(b, t));
      drawR(b, t);
      drawH(b, t);
      learn?.setAttribute('opacity', (b === 7 ? ease(t, 4.2, 5.0) : 0).toFixed(3));
    };
  },
};

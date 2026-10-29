// 'c2story', staging evoT · slide 15 RuBisCO, beats C2STORY5: staging evo (c2story-evo.ts, copied here) with RuBisCO's CO₂
// preference over time (lecturer, 29 Oct 2026, late: "our focus is how RuBisCO's performance changed over the years, not
// to answer the trade-off of red algae"): a thin strip over the time chart, on the chart's own time axis (v3's broken axis,
// its x positions copied below), y = CO₂ preference S, 0–200.
// - Dots at each card's date in its card colour, appearing with its card: purple bacteria 12; cyanobacteria 22 → 39 → 48
//   (as the card: the small subunit's step, then today's value); red algae 177; green algae 62 (Tcherkez et al. 2006;
//   Flamholz et al. 2019). Archaea are not plotted.
// - Beat 6, after the climate's swings (dinosaurs, ice age) and a pause: the flowering-plant line, from the inferred
//   common ancestor, S 81.1, ≈ 160 million years ago (TimeTree), to today's C₃ mean, S 87.1 (Bouvier, Emms & Kelly 2024
//   PNAS, Table 1), read linearly in time between the 2 (Bouvier: + 0.05 % S per million years) and drawn slowly, left to
//   right: nearly flat, while CO₂ swung a lot. It breaks at the axis breaks, as the CO₂ curve does.
// - The strip stays still in the other beats and dims with the chart in beat 8. v3's status line moves up to make room
//   (baseline 24, beside the credits); part A's credit leaves S to the strip's own credit.
// evo's header follows.
// 'c2story', staging evo · slide 15 RuBisCO, beats C2STORY4 (lecturer, 29 Oct 2026, night: "in the ocean you can see how
// RuBisCO's shape and its preference for CO₂ changed; later you only need the land plants: the climate, and how the
// land-plant RuBisCO itself changed, until 2026; then the solutions"). Facts: research/redo-2026-10-29/
// RUBISCO_EVOLUTION_FACTS.md.
// Part A rebuilt on v3's time chart (lecturer, 29 Oct 2026: "show them all together in the time frame, by the time, so the
// background is much prettier, instead of a pure blue colour"): no separate panel.
// 3 parts, each in its own layer (a nested <svg>, so data-k names never meet), cross-faded as in cb1-story.ts:
// - A, beats 1–4, the ocean: a copy of v3's stage (dk-c2story3.ts: the time chart, the living scenes, the balance), its ids
//   renamed, driven here. Each RuBisCO is a small card in the chart's empty upper area (its real structure: renders of the
//   biological assemblies, form III 1GEH, form II 9RUB, form IB 1RBL, form ID 1BWV; scripts/rf_forms_render.mjs, one
//   common scale), with a thin line down to its date on the time axis; earlier cards stay, dimmed. The marker stands at
//   each card's date; the scenes follow it (early ocean; the Great Oxidation Event, 2.43–2.22 billion years ago, with O₂
//   bubbles; an ocean with algae, its land plant hidden). The balance follows the state: the RuBisCO named, its S, the air
//   (v3's Precambrian stand-ins: no O₂, then 0.1 % of today's after the Great Oxidation Event).
//   Dates: form III ≈ 3.5 billion years ago (Iñiguez 2020); purple bacteria and cyanobacteria not dated (evo's lines:
//   2.95, 2.7); red algae 1.05 (Bangiomorpha), green algae ≈ 1.0 (oldest fossils). S at 25 °C, typical values (Flamholz
//   2019, Tcherkez 2006): 5, 12, 48, 177, 62; the small subunit raised S ≈ 22 → 39 in rebuilt ancient enzymes (Schulz
//   2022). Green algae carry the same form IB as cyanobacteria (shown with the same 1RBL render) and a CO₂ pump.
//   Beat 5 starts in part A (cards out, the marker to 500 million years ago, the balance to the land plants), then
//   cross-fades into v3 at rest at the same frame (v3's beat 5 at its first stop, 1.6 s), so nothing jumps.
// - B, beats 5–7: staging v3 (dk-c2story3.ts), its beats 5–7 (0-based 4–6): the time chart, the living scenes and the
//   balance with the land-plant RuBisCO, from plants on land to a hot, dry day in 2026.
// - C, beat 8: v3's last beat (the clippings: engineering RuBisCO) and, below them, "or learn from" C₂, C₄ and CAM plants.
import './c2story-evo.css';
import { C2STORY5 } from './beats-c2story';
import { STAGING as V3 } from './dk-c2story3';
import { animScene, N_SCENES, SC_CARRIERS, SC_FIRST_LAND, type SceneIO, type Spot } from './c2story-scenes';
import { CO2_D } from './c2story-data';
import { CC_CA, O2_TODAY } from './c2story-model';
import { ENZYMES, enzyme, oxPer100S } from './c2story-enzyme';
import r1geh from '../../assets/rf/rubisco-1geh.png';
import r9rub from '../../assets/rf/rubisco-9rub.png';
import r1rbl from '../../assets/rf/rubisco-1rbl.png';
import r1bwv from '../../assets/rf/rubisco-1bwv.png';
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

/* ---------------------------------------------------------------- the RuBisCO cards */

/** Render sizes at 4 px per Å (rf_forms_render.mjs), drawn at one common scale so their sizes compare. */
const IMG: Record<string, { href: string; w: number; h: number }> = {
  '1geh': { href: r1geh, w: 636, h: 608 }, '9rub': { href: r9rub, w: 476, h: 336 },
  '1rbl': { href: r1rbl, w: 537, h: 484 }, '1bwv': { href: r1bwv, w: 548, h: 500 },
};
interface Card { k: string; name: string; form: string; s: number; col: string; txt: string; ga: number; img: string }
const CARDS: Card[] = [
  { k: 'arc', name: 'archaea', form: 'form III', s: 5, col: '#8a8780', txt: '#6f6c66', ga: 3.5, img: '1geh' },
  { k: 'pur', name: 'purple bacteria', form: 'form II', s: 12, col: '#7a4f9a', txt: '#7a4f9a', ga: 2.95, img: '9rub' },
  { k: 'cya', name: 'cyanobacteria', form: 'form I + small subunits', s: 48, col: '#2f7f86', txt: '#2f7f86', ga: 2.7, img: '1rbl' },
  { k: 'red', name: 'red algae', form: 'form ID', s: 177, col: '#b5384a', txt: '#b5384a', ga: 1.05, img: '1bwv' },
  { k: 'grn', name: 'green algae', form: 'form I + CO₂ pump', s: 62, col: '#5b9a3c', txt: '#4f8a32', ga: 1.0, img: '1rbl' },
];
const CW = 196, CH = 192, CT = 116, CX0 = 330, CG = 18, IMK = 0.15, PIMK = 0.148;
const cardX = (i: number): number => CX0 + i * (CW + CG);
const railY = (i: number): number => CT + CH + 18 + i * 16;
const ST = (size: number, fill: string, weight = 400): string => `style="font-size:${size}px;font-weight:${weight};fill:${fill}"`;
const TX = (x: number, y: number, s: string, st: string, k = ''): string =>
  `<text${k ? ` data-k="${k}"` : ''} x="${f(x)}" y="${f(y)}" text-anchor="middle" ${st}>${s}</text>`;
const imgAt = (img: string, cx: number, cy: number, k: number, extra = ''): string => {
  const m = IMG[img], w = m.w * k, h = m.h * k;
  return `<image${extra} href="${m.href}" x="${f(cx - w / 2)}" y="${f(cy - h / 2)}" width="${f(w)}" height="${f(h)}"/>`;
};

function cardsSvg(): string {
  return CARDS.map((c, i) => {
    const x = cardX(i), cx = x + CW / 2, xd = xGa(c.ga), ry = railY(i);
    const sLine = c.k === 'cya'
      ? `<g data-k="cs-cya-s0"><text x="${f(cx)}" y="${CT + 178}" text-anchor="middle" ${ST(20, '#141413', 700)}>S ≈ 22<tspan data-k="cs-cya-s39" fill-opacity="0"> → 39</tspan></text></g>
         <g data-k="cs-cya-s1" opacity="0">${TX(cx, CT + 178, `S ${c.s}`, ST(20, '#141413', 700))}</g>`
      : TX(cx, CT + 178, `S ${c.s}`, ST(20, '#141413', 700));
    return `<g data-k="cd-${c.k}" opacity="0" display="none">
      <path d="M${f(cx)},${CT + CH} V${ry} H${f(xd)} V${Y1}" style="fill:none;stroke:${c.col};stroke-width:1.6;stroke-linejoin:round"/>
      <rect x="${x}" y="${CT}" width="${CW}" height="${CH}" rx="12" style="fill:#fffdf8;stroke:${c.col};stroke-width:1.6"/>
      ${imgAt(c.img, cx, CT + 56, IMK)}
      ${TX(cx, CT + 126, c.name, ST(18, c.txt, 700))}${TX(cx, CT + 148, c.form, ST(14, '#4a4945'))}${sLine}
    </g>`;
  }).join('');
}
/** The panel's RuBisCO, one render per lineage (v3's own image, the land-plant 8RUC, takes over at the switch). */
const panelImgs = (): string => CARDS.map((c, i) => `<g data-k="pi-${i}" opacity="0" display="none">${imgAt(c.img, BX, BYC, PIMK)}</g>`).join('');

/* ---------------------------------------------------------------- part A's timeline (0-based beats 0–4, s) */

// beat 0: the chart and the scene fade in; the archaea card; the balance.
// beat 1: the marker to 2.95, purple bacteria, the balance; the marker to 2.7, cyanobacteria, the balance; S ≈ 22 → 39.
// beat 2: S 48; the marker to the Great Oxidation Event (O₂ bubbles, the air, the balance's O₂).
// beat 3: the marker to 1.0 (the O₂ band fades as it leaves); red algae, the balance; green algae, the balance; the CO₂ pump.
// beat 4: the cards fade; the marker to 500 million years ago; the balance to the land plants; v3 takes over.
const B0 = { bg: [0, 0.6] as V, card: [0.8, 1.4] as V, panel: [1.6, 2.2] as V };
const B1 = { m1: [0.2, 0.8] as V, pur: [1.0, 1.6] as V, p1: [1.8, 2.4] as V, m2: [2.8, 3.4] as V, cya: [3.6, 4.2] as V, p2: [4.4, 5.0] as V, step: [5.4, 6.0] as V };
const B2 = { s48: [0.3, 0.9] as V, m: [1.2, 2.8] as V };
const B3 = { m: [0.2, 1.6] as V, red: [1.8, 2.4] as V, p1: [2.6, 3.2] as V, grn: [3.6, 4.2] as V, p2: [4.4, 5.0] as V, pump: [5.2, 5.8] as V };
const B4 = { out: [0, 0.6] as V, m: [0.8, 2.0] as V, p: [2.2, 2.8] as V, xf: [2.9, 3.5] as V };
/** v3's beat 5 (0-based 4) rests at X500 at 1.6 s; part A hands over at that frame. */
const V3_REST = 1.6, V3_SHIFT = B4.xf[1] - V3_REST;
const BIG = 99;

/** Seconds into beat n as seen from beat b at time t: before it −1, after it a large number. */
const tin = (b: number, t: number, n: number): number => (b === n ? t : b > n ? BIG : -1);

function markX(b: number, t: number): number {
  const x35 = xGa(3.5), x295 = xGa(CARDS[1].ga), x27 = xGa(CARDS[2].ga), x10 = xGa(1.0);
  if (b === 0) return x35;
  if (b === 1) return t < B1.m2[0] ? lerp(x35, x295, ease2(t, ...B1.m1)) : lerp(x295, x27, ease2(t, ...B1.m2));
  if (b === 2) return lerp(x27, XGOE, ease2(t, ...B2.m));
  if (b === 3) return lerp(XGOE, x10, ease2(t, ...B3.m));
  return lerp(x10, X500, ease2(t, ...B4.m));
}
/** Each card: when it appears [beat, t] and when it dims (the next one takes over). */
const CIN: Array<[number, V]> = [[0, B0.card], [1, B1.pur], [1, B1.cya], [3, B3.red], [3, B3.grn]];
const CDIM: Array<[number, V]> = [[1, B1.pur], [1, B1.cya], [3, B3.red], [3, B3.grn], [5, [0, 1]]];
/** Key values over the beats: from v, then at each [beat, t0, t1] eased to the next value (log for S). */
function keyed(b: number, t: number, v0: number, keys: Array<[number, number, number, number]>, log = false): number {
  let v = v0;
  for (const [kb, t0, t1, to] of keys) {
    const u = ease(tin(b, t, kb), t0, t1);
    if (u <= 0) break;
    v = log ? Math.exp(lerp(Math.log(v), Math.log(to), u)) : lerp(v, to, u);
  }
  return v;
}
const S_KEYS: Array<[number, number, number, number]> = [
  [1, ...B1.p1, 12], [1, ...B1.p2, 22], [1, ...B1.step, 39], [2, ...B2.s48, 48], [3, ...B3.p1, 177], [3, ...B3.p2, 62], [4, ...B4.p, enzyme('plant').s],
];
/** The balance's RuBisCO: [beat, t0, t1] of each switch, to lineage i (5: the land plants, v3's own render). */
const P_KEYS: Array<[number, V, number]> = [[1, B1.p1, 1], [1, B1.p2, 2], [3, B3.p1, 3], [3, B3.p2, 4], [4, B4.p, 5]];
const PNAME = [...CARDS.map(c => `${c.name} · ${c.form.split(' + ')[0]}`), enzyme('plant').name];
function panelWho(b: number, t: number): { from: number; to: number; u: number } {
  let from = 0, to = 0, u = 0;
  for (const [kb, w, i] of P_KEYS) {
    const v = ease(tin(b, t, kb), ...w);
    if (v <= 0) break;
    from = to; to = i; u = v;
    if (v >= 1) from = to;
  }
  return { from, to, u: from === to ? 1 : u };
}
const fmtOx = (ox: number): string => (ox <= 0.005 ? '0' : ox < 0.5 ? '&lt; 1' : String(Math.round(ox)));
const CRED = 'structures: PDB 1GEH, 9RUB, 1RBL, 1BWV · small subunit: Schulz et al. 2022';

function bindA(root: SVGSVGElement): (b: number, t: number) => void {
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
  // the algae ocean before land plants: scene 8's land plant stays hidden
  const io: SceneIO = { tr: (k, v) => set(k, 'transform', v), op: (k, v) => op(k, k === 's8-plant' ? 0 : v), at: (k, a, v) => set(k, a, v) };
  const t0wall = performance.now();

  return (b, t) => {
    const x = markX(b, t);
    // frozen frames (?t=) run the loops on the beat's time; in beat 5 on v3's clock, so the hand-over frame matches
    const amb = FROZEN ? (b === 4 ? Math.max(V3_REST, t - V3_SHIFT) : t) : (performance.now() - t0wall) / 1000;
    const bg = b === 0 ? ease(t, ...B0.bg) : 1;

    /* ---- the chart (v3's), revealed to the marker */
    op('cs-axes', bg); op('cs-curves', bg); op('cs-off', bg);
    set('cs-clip', 'width', f(Math.max(0, x - X0 + 6)));
    op('cs-goe', b === 2 ? ease(x, 154, 157) : b === 3 ? 1 - ease(t, B3.m[0], B3.m[0] + 0.5) : 0);   // fades as the marker leaves it
    op('cs-clab', 0); op('cs-status', 0);
    op('cs-ph', bg); set('cs-ph', 'transform', `translate(${f(x)} 0)`);
    set('cs-pdc', 'cy', f(Y0 + 26)); op('cs-pdc', 1); op('cs-pdt', 0);
    set('cs-crd', 'text', CRED); op('cs-crd', bg);
    for (let i = 0; i < 3; i++) op(`cs-clip${i}`, 0);

    /* ---- the scenes: early ocean → O₂ bubbles (Great Oxidation Event) → algae → the first land plants */
    const w = new Array<number>(N_SCENES).fill(0);
    if (b <= 1) w[0] = 1;
    else if (b === 2) { const r = ease(x, 152, 157); w[0] = 1 - r; w[1] = r; }
    else if (b === 3) { const r = ease(x, 165, 198); w[1] = 1 - r; w[SC_CARRIERS] = r; }
    else { const r = ease(x, 206, 236); w[SC_CARRIERS] = 1 - r; w[SC_FIRST_LAND] = r; }
    const pump = b === 3 ? ease(t, ...B3.pump) : b === 4 ? 1 - ease(t, ...B4.p) : 0;
    const spot: Spot = { cyano: 1, green: 1, plant: 0, red: 1, ccm: pump };
    for (let i = 0; i < N_SCENES; i++) {
      const v = w[i] * bg;
      op(`cs-sc${i}`, v);
      if (v > 0.004) animScene(i, amb, BIG, io, { spot });
    }

    /* ---- the cards: each at its date, earlier ones dimmed */
    const out = b === 4 ? 1 - ease(t, ...B4.out) : b > 4 ? 0 : 1;
    CARDS.forEach((c, i) => {
      const [ib, iw] = CIN[i], [db, dw] = CDIM[i];
      op(`cd-${c.k}`, ease(tin(b, t, ib), ...iw) * (1 - 0.55 * ease(tin(b, t, db), ...dw)) * out);
    });
    // cyanobacteria: the small subunit's step (rebuilt ancient enzymes), then today's S
    // (out, then in: the 2 lines never show on top of each other)
    const s39 = ease(tin(b, t, 1), ...B1.step), sMid = (B2.s48[0] + B2.s48[1]) / 2, t2 = tin(b, t, 2);
    set('cs-cya-s39', 'fill-opacity', s39.toFixed(3));
    op('cs-cya-s0', 1 - ease(t2, B2.s48[0], sMid)); op('cs-cya-s1', ease(t2, sMid, B2.s48[1]));

    /* ---- the balance (v3's panel): the RuBisCO named, its S, the air */
    op('c3-panel', b === 0 ? ease(t, ...B0.panel) : 1);
    op('c3-heads', 1); op('c3-gasc', 1);
    const who = panelWho(b, t);
    for (let i = 0; i < CARDS.length; i++) op(`pi-${i}`, (who.to === i ? who.u : 0) + (who.from === i && who.from !== who.to ? 1 - who.u : 0));
    op('c3-rub', who.to === 5 ? who.u : 0);
    const name = who.u < 0.5 ? PNAME[who.from] : PNAME[who.to];
    set('c3-name', 'text', name); op('c3-name', who.from === who.to ? 1 : Math.abs(1 - 2 * who.u));
    const s = keyed(b, t, CARDS[0].s, S_KEYS, true);
    const leave = b === 4 ? ease(t, ...B4.p) : 0;   // the Precambrian readouts empty, as v3's at 500 million years ago
    const sMax = lerp(CARDS[3].s * 1.04, S_MAX_V3, leave);
    set('c3-s', 'text', String(Math.round(s))); op('c3-s', 1);
    set('c3-sbar', 'width', f((QW * s) / sMax));
    // the air: v3's Precambrian stand-ins (CO₂ the 1750 value, a low bound; O₂ 0, then 0.1 % of today's)
    const rGoe = b < 2 ? 0 : b === 2 ? ease(x, 154.5, 157.5) : 1;
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
/** v3's stage with its status line moved up (baseline 24, beside the credits), so the S strip fits over the chart. */
const v3Svg = (): string => V3.svg().replace(/(data-k="cs-status"[^>]*?\sy=")56"/, '$124"');
/** Part A's stage: v3's (ids renamed), the per-lineage renders in its balance, the cards on top. */
const stageA = (): string =>
  renameIds(v3Svg(), 'ea-').replace(/(<g data-k="c3-rub">[\s\S]*?<\/g>)/, `$1${panelImgs()}`).replace(/<\/g>\s*$/, `${cardsSvg()}</g>`);

/* ---------------------------------------------------------------- the S strip: CO₂ preference over time, over the chart */

// v3's broken time axis (dk-c2story3.ts), all 4 segments: the strip shares its x positions
const X1 = 1430, GAP = 18, NOW = 2026.8, D_END = 2026.75, YA1750 = NOW - 1750;
const SEGW = [0.35, 0.2, 0.15, 0.3].map(r => r * (X1 - X0 - 3 * GAP));
const SX: V[] = [];
{ let x = X0; for (const w of SEGW) { SX.push([x, x + w]); x += w + GAP; } }
/** x of a time (years ago) drawn in segment s (as v3). */
function xIn(s: number, ya: number): number {
  const [a, b] = SX[s];
  if (s === 0) return a + ((LA - Math.log10(ya)) / (LA - LB)) * (b - a);
  if (s === 1) return a + ((8e5 - ya) / (8e5 - 1.2e4)) * (b - a);
  if (s === 2) return a + ((1.2e4 - ya) / (1.2e4 - YA1750)) * (b - a);
  return a + ((NOW - ya - 1750) / (D_END - 1750)) * (b - a);
}
// the strip: S 0 at y 80, 200 at y 34 (the band between the status line and the chart's top edge, y 84)
const SY0 = 80, SY1 = 34, DOT_R = 5;
const yS = (s: number): number => SY0 - (s / 200) * (SY0 - SY1);
const LAND = '#3c7a2e';
// flowering plants (Bouvier et al. 2024, Table 1): the inferred common ancestor ≈ 160 million years ago → today's C₃ mean
const YA_ANC = 1.6e8, S_ANC = 81.1, S_NOW = 87.1, YA_TODAY = NOW - 2026;
const sLand = (ya: number): number => S_NOW - ((S_NOW - S_ANC) * ya) / YA_ANC;
/** The flowering-plant line, one path per axis segment (it breaks at the axis breaks, as the CO₂ curve). */
function landPath(): string {
  const segs: Array<[number, number, number]> = [[0, YA_ANC, 1e6], [1, 8e5, 1.2e4], [2, 1.2e4, YA1750], [3, YA1750, YA_TODAY]];
  return segs.map(([s, a, b]) => {
    const n = s === 0 ? 40 : 2;
    const pts = Array.from({ length: n + 1 }, (_, i) => (s === 0 ? 10 ** lerp(Math.log10(a), Math.log10(b), i / n) : lerp(a, b, i / n)));
    return `M${pts.map(ya => `${f(xIn(s, ya))},${f(yS(sLand(ya)))}`).join(' L')}`;
  }).join(' ');
}
const XL0 = xIn(0, YA_ANC), XL1 = xIn(3, YA_TODAY);
/** The dots: each at its card's date in its colour (archaea not plotted). */
const DOTS = CARDS.filter(c => c.k !== 'arc');
const SCRED = 'S: Tcherkez et al. 2006; Flamholz et al. 2019; Bouvier et al. 2024';

function stripSvg(): string {
  const lab = 'style="font-size:13px;fill:#6b6a64"', tkl = 'style="font-size:12px;fill:#6b6a64"';
  const ticks = [0, 100, 200].map(v => `<path d="M${X0},${f(yS(v))} h-5" style="fill:none;stroke:#8a877d;stroke-width:1"/>`).join('');
  return `<g data-k="sx-axes" opacity="0">
      <path d="M${X0},${SY0} V${SY1}" style="fill:none;stroke:#8a877d;stroke-width:1"/>${ticks}
      <text x="${X0 - 8}" y="${f(yS(200) + 4)}" text-anchor="end" ${tkl}>200</text><text x="${X0 - 8}" y="${f(yS(0) + 4)}" text-anchor="end" ${tkl}>0</text>
      ${['CO₂', 'preference', '(S)'].map((w, i) => `<text x="${X0 - 42}" y="${f(SY1 + 14 + i * 13)}" text-anchor="end" ${lab}>${w}</text>`).join('')}
      <text class="cs-crd" x="1590" y="${f(SY1 + 9)}" text-anchor="end" style="font-size:12px;fill:#8a877d">${SCRED}</text>
    </g>
    ${DOTS.map(c => `<circle data-k="sd-${c.k}" cx="${f(xGa(c.ga))}" cy="${f(yS(c.s))}" r="${DOT_R}" opacity="0" display="none" style="fill:${c.col};stroke:#fbfaf6;stroke-width:1.5"/>`).join('')}
    <clipPath id="evT-land"><rect data-k="sl-clip" x="${f(XL0 - DOT_R - 2)}" y="${SY1 - 10}" width="0" height="${SY0 - SY1 + 20}"/></clipPath>
    <g data-k="sl-a" opacity="0" display="none">
      <text x="${f(XL0 + 8)}" y="${f(yS(S_ANC) - 9)}" style="font-size:14px;font-weight:700;fill:${LAND}">flowering plants</text>
      <text x="${f(XL0 - 9)}" y="${f(yS(S_ANC) + 5)}" text-anchor="end" style="font-size:13px;font-weight:700;fill:${LAND}">${Math.round(S_ANC)}</text>
    </g>
    <path data-k="sl-line" clip-path="url(#evT-land)" d="${landPath()}" style="fill:none;stroke:${LAND};stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round"/>
    <circle data-k="sl-a0" cx="${f(XL0)}" cy="${f(yS(S_ANC))}" r="${DOT_R}" opacity="0" display="none" style="fill:#fbfaf6;stroke:${LAND};stroke-width:2"/>
    <g data-k="sl-b" opacity="0" display="none">
      <circle cx="${f(XL1)}" cy="${f(yS(S_NOW))}" r="${DOT_R}" style="fill:${LAND};stroke:#fbfaf6;stroke-width:1.5"/>
      <text x="${f(XL1 + 9)}" y="${f(yS(S_NOW) + 5)}" style="font-size:13px;font-weight:700;fill:${LAND}">${Math.round(S_NOW)}</text>
    </g>`;
}

// beat 6 (0-based 5): v3's marker rests at 20,000 years ago by 4.4 s (its readouts by 4.7, the walkers by 5.0); a pause;
// then the line's name and the ancestor, the line drawn slowly to today, today's dot
const HOLD5 = 5.2;
const B5L = { a: [5.4, 5.9] as V, line: [6.1, 9.6] as V, b: [9.7, 10.2] as V };

function bindStrip(root: SVGGElement): (b: number, t: number) => void {
  const els = new Map<string, Element>();
  root.querySelectorAll('[data-k]').forEach(el => els.set(el.getAttribute('data-k') as string, el));
  const last = new Map<string, string>();
  const set = (k: string, a: string, v: string): void => {
    const el = els.get(k), id = `${k}|${a}`;
    if (!el || last.get(id) === v) return;
    last.set(id, v); el.setAttribute(a, v);
  };
  const op = (k: string, v: number): void => { set(k, 'display', v < 0.004 ? 'none' : 'inline'); set(k, 'opacity', v >= 0.996 ? '1' : v.toFixed(3)); };
  const CIN_S: Record<string, [number, V]> = { pur: [1, B1.pur], cya: [1, B1.cya], red: [3, B3.red], grn: [3, B3.grn] };
  return (b, t) => {
    // the strip dims with the chart in beat 8 (as v3's dimLast)
    const dim = b === 7 ? 1 - 0.65 * ease(t, 0, 0.6) : 1;
    root.setAttribute('opacity', dim.toFixed(3));
    op('sx-axes', b === 0 ? ease(t, ...B0.bg) : 1);
    for (const c of DOTS) { const [ib, iw] = CIN_S[c.k]; op(`sd-${c.k}`, ease(tin(b, t, ib), ...iw)); }
    // cyanobacteria as their card: S ≈ 22, then 39 (the small subunit's step), then today's 48
    const sCya = keyed(b, t, 22, [[1, ...B1.step, 39], [2, ...B2.s48, 48]]);
    set('sd-cya', 'cy', f(yS(sCya)));
    // the flowering plants
    const t5 = tin(b, t, 5), a = ease(t5, ...B5L.a), u = ease(t5, ...B5L.line);
    op('sl-a', a); op('sl-a0', a); op('sl-b', ease(t5, ...B5L.b));
    set('sl-clip', 'width', f(u <= 0 ? 0 : (XL1 - XL0 + 2 * DOT_R + 4) * u));
    op('sl-line', u > 0 ? 1 : 0);
  };
}

/* ---------------------------------------------------------------- the staging */

type Part = 'a' | 'v3';
const layer = (part: Part, inner: string): string =>
  `<svg data-part="${part}" x="0" y="0" width="1600" height="740" viewBox="0 0 1600 740" overflow="visible" style="pointer-events:none">${inner}</svg>`;
/** Beat 8's "or learn from" row, under v3's clippings. */
const learnSvg = (): string => `<g data-k="learn" opacity="0" class="ce">
  <rect class="ce-learnbg" x="420" y="404" width="760" height="64" rx="14"/>
  ${T(800, 445, 'or learn from plants that concentrate CO₂: C₂ · C₄ · CAM', 'ce-learn', 'middle')}</g>`;

export const STAGING: Staging = {
  id: 'evoT',
  name: 'evoT · with RuBisCO’s CO₂ preference over time',
  note: 'Staging evo with a thin strip over the time chart, on its time axis: RuBisCO’s CO₂ preference S, a dot at each card’s date as the card appears; in beat 6, after a pause, the flowering-plant line from the ancestor (81, ≈ 160 million years ago) to today (87), drawn slowly: nearly flat while CO₂ swung a lot.',
  beats: C2STORY5,
  // a pause after each new RuBisCO form (lecturer, 29 Oct 2026: "every time RuBisCO changes form, pause so I can click
  // through; do not play all the way through"): after form II (purple bacteria) and after form I (cyanobacteria), before
  // the small subunit's step; after form ID (red algae), before the green algae; in beat 6 one more, after the climate's
  // swings, before the flowering-plant line
  holds: [[], [B1.p1[1] + 0.1, B1.p2[1] + 0.1], [], [B3.p1[1] + 0.1], [], [HOLD5], (V3.holds ?? [])[6] ?? [], []],
  keys: [
    { beat: 0, text: 'Oldest RuBisCO: a ring, unselective', x: 640, y: 60, size: 40 },
    { beat: 1, text: 'Small subunit: more CO₂ preference', x: 640, y: 60, size: 40 },
    { beat: 2, text: 'O₂ enters the air', x: 640, y: 60, size: 40 },
    { beat: 3, text: 'Pump CO₂, or become selective', x: 640, y: 60, size: 40 },
    { beat: 4, text: 'On land: air and temperature decide', x: 1000, y: 66, size: 40 },
    { beat: 5, text: 'Climate changed; RuBisCO barely', x: 1000, y: 66, size: 40 },
    { beat: 6, text: 'Most plants still suffer', x: 1000, y: 66, size: 40 },
    // the closing question centred above the clippings, which fill the middle (lecturer, 29 Oct 2026: centred, obvious)
    { beat: 7, text: 'First: how does the leaf turn 3-PGA into sugar?', x: 800, y: 103, size: 42 },
  ],
  svg: () => `${layer('a', stageA())}${layer('v3', v3Svg())}${learnSvg()}<g data-k="sx" style="pointer-events:none">${stripSvg()}</g>`,
  bind(stage) {
    const as = stage.querySelector<SVGSVGElement>('svg[data-part="a"]')!, vs = stage.querySelector<SVGSVGElement>('svg[data-part="v3"]')!;
    const drawA = bindA(as), drawV = V3.bind(vs);
    const learn = stage.querySelector<SVGGElement>('[data-k="learn"]');
    const drawS = bindStrip(stage.querySelector<SVGGElement>('[data-k="sx"]')!);
    const show = (el: SVGSVGElement, o: number): void => { el.style.opacity = o.toFixed(3); el.style.display = o < 0.004 ? 'none' : ''; };
    return (beat, t) => {
      const b = Math.round(beat);
      // part A in beats 1–4 and the start of beat 5; there it hands over to v3, both at rest on the same frame
      const aOp = b <= 3 ? 1 : b === 4 ? 1 - ease(t, ...B4.xf) : 0;
      show(as, aOp); show(vs, 1 - aOp);
      if (aOp > 0.004) drawA(b, t);
      if (aOp < 0.996) drawV(b, b === 4 ? Math.max(V3_REST, t - V3_SHIFT) : t);
      learn?.setAttribute('opacity', (b === 7 ? ease(t, 3.4, 4.0) : 0).toFixed(3));
      drawS(b, t);
    };
  },
};

// 'lf10' · CO₂ from the air to RuBisCO (slide C10; beats-co2.ts LF10K; brief research/redo-2026-10-29/
// CO2_DIFFUSION_STORY_BRIEF.md). What the two stagings share: the CO₂ card on the left (a gradient bar, then the
// concentrations as bars stepping down, the conductances and Fick's law in words), the leaf section in the middle
// (drawn, or traced over the lecturer's own section), two fixed round magnifiers on the right (the wet cell wall to the
// stroma; the stoma), and the CO₂ character's trip. One fixed framing, no zoom.
// Facts: Cₐ ≈ 430 ppm (NOAA Mauna Loa, 2025 mean 427 ppm; 2026 ≈ 430), Cᵢ ≈ 300 and C꜀ ≈ 200 ppm typical at 25 °C
// (Busch et al. 2024, Table 1); the boundary layer is still air (Busch et al. 2024); hundreds of H₂O leave per CO₂ taken
// up (Verslues et al. 2023), drawn as 4; D(CO₂) 1.56 × 10⁻⁵ m² s⁻¹ in air, 1.7 × 10⁻⁹ in water at 25 °C, ≈ 10⁴ times
// slower (Terashima et al. 2011); A = g × ΔC (Busch et al. 2024, Eqs 10–11); CO₂ solubility falls faster with warming
// than O₂ solubility: CO₂/O₂ −8 % from 25 to 35 °C (Sander 2023: d ln H/d(1/T) 2300 K for CO₂, 1500 K for O₂).
import rubPng from '../../assets/rf/rubisco-8ruc.png';
import st0 from '../../assets/photos/c10-stoma-3d-0.webp';
import st1 from '../../assets/photos/c10-stoma-3d-1.webp';
import st2 from '../../assets/photos/c10-stoma-3d-2.webp';
import st3 from '../../assets/photos/c10-stoma-3d-3.webp';
import st4 from '../../assets/photos/c10-stoma-3d-4.webp';
import { LF10K } from './beats-co2';
import {
  actor, bilayerH, clamp, co2G, driftM, ease, f, fade, flash, flashDefs, flashG, from, h2oG, inset, kid, kidG, lerp,
  makeScene, o2G, sunG, sym, T, thermoG, thermoSet, tickG, type Anchor, type Api, type V,
} from './co2-kit';
import type { Staging } from './types';

/** What a staging's leaf section provides (stage units; the section fills x 368–1000). */
export interface Geo {
  id: string; name: string; note: string;
  /** The static section markup (p: the id prefix). */
  section(p: string): string;
  /** Guard cells that close on the hot day (the drawn section): their markup at the origin and centres open / half. */
  guard?: { l: string; r: string; open: [V, V]; half: [V, V] };
  /** The CO₂ start in the outside air, the boundary layer (bottom, top), the epidermis top, the wall's outer face. */
  air: V; blBot: number; blTop: number; epiTop: number; wallY: number;
  /** The path: pore, points through the air space, the wall, the chloroplast. */
  pore: V; cav: V[]; wall: V; cp: V;
  /** When the CO₂ reaches the wall in beat 4 (s; default 2.25): a longer trip through the air spaces. */
  airT?: number;
  lensS: V; lensW: V;
  /** Zone labels: name, place, anchor, the beats in which they are lit. */
  zones: Array<{ k: string; at: V; text: string; lit: number[]; a?: Anchor }>;
}

/* ---------------------------------------------------------------- the right side: magnifiers */

const W: V = [1296, 238], WR = 210;
const S: V = [1296, 606], SR = 126;
/** Wall inset bands (y relative to W): stroma | envelope | cytosol | plasma membrane | cell wall | water | air space. */
const B = { env0: -42, env1: -14, pm0: 30, pm1: 48, wall1: 92, film1: 114 };
const WY = (y: number): number => W[1] + y;
const LANE = W[0] + 62;
const RUB: V = [W[0] + 34, W[1] - 120], SITE: V = [W[0] + 22, W[1] - 104];
const wallSpeed = (p: V): number => {
  const y = p[1] - W[1];
  return y > B.film1 ? 1 : y > B.wall1 ? 0.12 : y > B.pm1 ? 0.1 : y > B.pm0 ? 0.13 : y > B.env1 ? 0.3 : y > B.env0 ? 0.13 : 0.4;
};
const stomaSpeed = (p: V): number => { const y = p[1] - S[1]; return y > 30 ? 0.3 : y > -30 ? 0.12 : 1; };

function wallInset(p: string): string {
  const x0 = W[0] - WR, w = 2 * WR, band = (y0: number, y1: number, cls: string): string => `<rect class="${cls}" x="${x0}" y="${f(WY(y0))}" width="${w}" height="${f(y1 - y0)}"/>`;
  const fib = Array.from({ length: 16 }, (_, i) => { const x = x0 + 6 + i * 27, y = WY(56 + (i % 3) * 11); return `<path class="co2k-fib" d="M${x},${y}q7,-5 14,0t14,0"/>`; }).join('');
  const film = `<path class="co2k-film" d="M${x0},${f(WY(B.wall1))}H${x0 + w}V${f(WY(B.film1 - 2))}${Array.from({ length: 14 }, (_, i) => `Q${f(x0 + w - i * 30 - 15)},${f(WY(B.film1 + 5))} ${f(x0 + w - (i + 1) * 30)},${f(WY(B.film1 - 2))}`).join('')}Z"/>`;
  const granum = [0, 1, 2].map(k => `<rect class="cel-lumen" x="${W[0] - 150}" y="${f(WY(-150 + k * 12))}" width="88" height="8" rx="4" style="stroke:#9fbf6e;stroke-width:1.6"/>`).join('');
  const lab = (k: string, y: number, s: string, x = W[0] - 168): string => actor(`${p}wl-${k}`, T(x, WY(y), s, 'co2k-il cel-halo', 'start'));
  return `${band(-WR, B.env0, 'co2k-strm')}${band(B.env0, B.env1, 'co2k-cyt')}${band(B.env1, B.pm0, 'co2k-cyt')}${band(B.pm0, B.pm1, 'co2k-cyt')}
    ${band(B.pm1, B.wall1, 'co2k-wallb')}${fib}${band(B.film1 - 2, WR, 'co2k-ias')}${film}
    ${bilayerH(x0, x0 + w, WY(-35), 5.5)}${bilayerH(x0, x0 + w, WY(-21), 5.5)}${bilayerH(x0, x0 + w, WY(39), 7)}
    ${granum}<image href="${rubPng}" x="${f(RUB[0] - 54)}" y="${f(RUB[1] - 46)}" width="108" height="${f((108 * 471) / 548)}"/>
    ${lab('strm', -70, 'stroma')}${actor(`${p}wl-rub`, T(RUB[0], RUB[1] + 66, 'RuBisCO', 'co2k-ilb cel-halo'))}
    ${lab('env', -23, 'chloroplast envelope')}${lab('cyt', 13, 'cytosol')}${lab('pm', 45, 'plasma membrane')}${lab('wall', 78, 'cell wall')}
    ${lab('film', 109, 'water')}${lab('air', 160, 'air space', W[0] - 120)}
    ${actor(`${p}c0`, co2G(12))}${actor(`${p}o1`, `${o2G(12)}${T(0, -22, 'O₂', 'cel-mn cel-halo')}`)}${actor(`${p}o2`, o2G(12))}
    ${actor(`${p}fw`, flashG(p, 36))}${actor(`${p}fw2`, flashG(p, 36))}
    ${actor(`${p}tk0`, tickG('used'))}${actor(`${p}tk1`, tickG('fixed'))}
    ${kidG(`${p}kw`, 17, 'CO₂', -58)}`;
}

/* The stoma magnifier: the lecturer's own 3D render of an open stoma (its 2 guard cells, their starch in blue and pink;
   ~/Downloads/Trial 2 Replicate 1 EON-2hRL 4.png), lecturer, 29 Oct 2026: "use this stoma", "segment the image",
   "make the CO₂ go through it". Prepared by scratchpad st19tools/stoma3d_v2.py: the viewer's label and dot filled in
   from their nearest clean pixels, a 1120 px square round the stoma, cut out of its black background with its own
   colours (the pore is a hole, its outline the convex hull of the dark pore), scaled to 640 px. On the hot day the pore narrows: frames 1–4 are the same render with the pore's edges moved towards its
   midline across its long axis (to 36 % of its width, as the drawn guard cells' gap 56 → 20), each band between an
   edge and a line 100 px beyond it stretched to match, so nothing tears; the frames cross-fade.
   The CO₂ comes in front of the stoma, turns to line up with the pore, and goes through it: inside, it is drawn
   behind the render, seen only through the hole as it moves away. */
const ST3D = [st0, st1, st2, st3, st4];
/** The render's frame: 640 px at 228 stage units (the stoma reaches 336 px from its centre: it fits the 126-unit
 *  magnifier with a margin). */
const K3 = 228 / 640, X3 = S[0] - 114, Y3 = S[1] - 114;
const at3 = (x: number, y: number): V => [X3 + x * K3, Y3 + y * K3];
/** The pore's centre and the direction of its long axis on the render (stoma3d_v2.py: pixel (312.1, 319.3), −37.9°). */
const POREI: V = at3(312.1, 319.3), PORE_DEG = -37.9;
/** Where the CO₂ comes from on the render: the outside air on the viewer's side, to the right. */
const FRONT: V = [S[0] + 150, S[1] + 10];
const toPore = (u: number, end: V, sc1: number): { at: V; sc: number } => {
  const e = u * u * (3 - 2 * u);
  return { at: [lerp(FRONT[0], end[0], e), lerp(FRONT[1], end[1], e)], sc: lerp(1.25, sc1, e) };
};
/** Turns the CO₂ character's body (after kid() has set its squeeze). */
const tilt = (a: Api, k: string, deg: number, sy: number): void => a.attr(`${k}-b`, 'transform', `rotate(${deg.toFixed(1)}) scale(1 ${sy.toFixed(3)})`);
function stomaInset(p: string): string {
  return `${kidG(`${p}ksb`, 14, '')}
    ${ST3D.map((src, i) => actor(`${p}st${i}`, `<image href="${src}" x="${f(X3)}" y="${f(Y3)}" width="228" height="228"/>`)).join('')}
    ${[1, 2, 3, 4].map(i => actor(`${p}w${i}`, `${h2oG(9)}${i === 1 ? T(16, 5, 'H₂O', 'cel-mn cel-halo', 'start') : ''}`)).join('')}
    ${kidG(`${p}ks`, 14, 'CO₂', -28)}${kidG(`${p}ks2`, 14, '')}`;
}
const stCredit = T(1596, 737, '3D stoma: own data', 'co2k-cr', 'end');

/* ---------------------------------------------------------------- the left side: the CO₂ card */

const CX = 60, PPM = 0.62;
const BARS = { a: { y: 620, ppm: 430 }, i: { y: 432, ppm: 300 }, c: { y: 252, ppm: 200 } } as const;
const HOT = { i: 236, c: 140 };
function card(p: string): string {
  const bar = (k: 'a' | 'i' | 'c', name: string): string => {
    const b = BARS[k], w = b.ppm * PPM;
    return actor(`${p}b${k}`, `${T(CX, b.y - 14, name, 'co2k-cl', 'start')}
      ${k === 'a' ? '' : `<rect data-k="${p}b${k}-o" class="co2k-bar-old" x="${CX}" y="${b.y}" width="${f(w)}" height="30" rx="5" display="none"/>`}
      <rect data-k="${p}b${k}-r" class="co2k-bar" x="${CX}" y="${b.y}" width="${f(w)}" height="30" rx="5"/>
      <text data-k="${p}b${k}-v" class="co2k-cbv" x="${f(CX + w - 10)}" y="${b.y + 21}" text-anchor="end">≈ ${b.ppm} ppm</text>
      ${k === 'a' ? '' : `<text data-k="${p}b${k}-d" class="co2k-dn" x="${f(CX + (k === 'i' ? HOT.i : HOT.c) * PPM + 10)}" y="${b.y + 21}" text-anchor="start" display="none">↓ falls</text>`}`);
  };
  const up = (y0: number, y1: number): string => `<path class="co2k-up" d="M76,${y0}V${y1 + 10}"/><path class="co2k-uph" d="M76,${y1}l-7,13h14z"/>`;
  return `<rect class="co2k-card" x="12" y="12" width="344" height="716" rx="16"/>
    ${actor(`${p}cg`, `<rect x="24" y="214" width="18" height="436" rx="9" fill="url(#${p}-grad)"/>${T(33, 202, 'low', 'co2k-cv')}${T(33, 676, 'high', 'co2k-cv')}`)}
    ${bar('a', `CO₂ in the air (${sym('C', 'a')})`)}${bar('i', `CO₂ in the leaf air spaces (${sym('C', 'i')})`)}${bar('c', `CO₂ in the chloroplast (${sym('C', 'c')})`)}
    ${actor(`${p}u1`, up(586, 472))}${actor(`${p}u2`, up(398, 292))}
    ${actor(`${p}gb`, `${T(92, 510, 'boundary-layer', 'co2k-cg', 'start')}${T(92, 530, `conductance (${sym('g', 'b')})`, 'co2k-cg', 'start')}`)}
    ${actor(`${p}gs`, `${T(92, 558, 'stomatal', 'co2k-cg', 'start')}${T(92, 578, `conductance (${sym('g', 's')})`, 'co2k-cg', 'start')}`)}
    ${actor(`${p}gm`, `${T(92, 340, 'mesophyll', 'co2k-cg', 'start')}${T(92, 360, `conductance (${sym('g', 'm')})`, 'co2k-cg', 'start')}`)}
    ${actor(`${p}eq`, `${T(28, 62, 'CO₂ uptake (<tspan font-style="italic">A</tspan>) =', 'co2k-eq', 'start')}${T(28, 92, 'conductance (<tspan font-style="italic">g</tspan>) × CO₂ drop (Δ<tspan font-style="italic">C</tspan>)', 'co2k-eq', 'start')}`)}`;
}
function setBar(a: Api, p: string, k: 'i' | 'c', u: number): void {
  const b = BARS[k], w = lerp(b.ppm, HOT[k], u) * PPM;
  a.attr(`${p}b${k}-r`, 'width', f(w));
  a.op(`${p}b${k}-o`, u > 0.01 ? 1 : 0);
  a.op(`${p}b${k}-v`, 1 - clamp(u * 3));
  a.op(`${p}b${k}-d`, clamp((u - 0.6) * 2.5));
}

/* ---------------------------------------------------------------- the hot, dry day (right edge) */

const HX = 1514;
const hotG = (p: string): string => actor(`${p}hot`, `<g transform="translate(${HX - 34} 504)">${sunG(15)}</g>${thermoG(`${p}th`, HX + 30, 478, 70)}
  <text data-k="${p}tt" class="co2k-zl" x="${HX}" y="604" text-anchor="middle">25 °C</text>
  ${T(HX, 628, 'hot, dry day', 'co2k-zl')}`)
  + actor(`${p}sol`, `${T(HX, 658, 'warmer water:', 'co2k-note')}${T(HX, 680, 'less CO₂ dissolves', 'co2k-note')}${T(HX, 702, 'relative to O₂', 'co2k-note')}`);

/* ---------------------------------------------------------------- the staging */

export function lf10Staging(g: Geo): Staging {
  const p = `lfk${g.id}`;
  /** How much longer beat 4's trip through the air spaces takes than the default (s). */
  const D3 = (g.airT ?? 2.25) - 2.25;
  const secSpeed = (q: V): number => (q[1] > g.blBot ? 1 : q[1] > g.blTop ? 0.22 : q[1] > g.epiTop ? 0.13 : q[1] > g.wallY ? 1 : 0.1);
  const mood = (v: number, glad = false): { s: number; sweat: number; h: number } => ({ s: clamp((0.5 - v) / 0.25), sweat: clamp((0.27 - v) / 0.1), h: glad ? clamp((v - 0.55) / 0.3) : 0 });
  // the magnifiers' scales: an inset point maps back to the section through its lens
  const toS = (q: V): V => [g.lensS[0] + (q[0] - S[0]) / (SR / 22), g.lensS[1] + (q[1] - S[1]) / (SR / 22)];
  const toW = (q: V): V => [g.lensW[0] + (q[0] - W[0]) / (WR / 20), g.lensW[1] + (q[1] - W[1]) / (WR / 20)];
  const blTopV: V = toS([S[0], S[1] + 84]);
  const lw = inset(p, `${p}iw`, g.lensW, 20, W, WR, wallInset(p));
  const ls = inset(p, `${p}is`, g.lensS, 22, S, SR, stomaInset(p), stCredit);
  const zones = g.zones.map(z => `${T(z.at[0], z.at[1], z.text, 'co2k-z cel-halo', z.a ?? 'start')}${actor(`${p}z-${z.k}`, T(z.at[0], z.at[1], z.text, 'co2k-zl cel-halo', z.a ?? 'start'))}`).join('');
  const svg = (): string => `<defs>${flashDefs(p)}<linearGradient id="${p}-grad" x1="0" x2="0" y1="1" y2="0"><stop offset="0" class="co2k-grad0"/><stop offset="1" class="co2k-grad1"/></linearGradient>
      <linearGradient id="${p}-blg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" class="co2k-bl0"/><stop offset="1" class="co2k-bl1"/></linearGradient>
      <clipPath id="${p}-sec"><rect x="368" y="0" width="632" height="740"/></clipPath></defs>
    ${card(p)}
    <g clip-path="url(#${p}-sec)">${g.section(p)}
      ${g.guard ? `${actor(`${p}gl`, g.guard.l)}${actor(`${p}gr`, g.guard.r)}` : ''}
      ${zones}
      ${actor(`${p}fs`, flashG(p, 16))}${kidG(`${p}k`, 13, 'CO₂', -26)}${kidG(`${p}k2`, 13, '')}</g>
    ${lw.lens}${ls.lens}${lw.box}${ls.box}${hotG(p)}`;

  function frame(a: Api, beat: number, t: number): void {
    // zones lit in their beats
    for (const z of g.zones) a.op(`${p}z-${z.k}`, z.lit.includes(beat) ? ease(t, 0.1, 0.6) : 0);
    // the guard cells: open, half-closed on the hot day
    const close = beat === 5 ? ease(t, 0.6, 2.2) : 0;
    if (g.guard) { a.put(`${p}gl`, [lerp(g.guard.open[0][0], g.guard.half[0][0], close), g.guard.open[0][1]]); a.put(`${p}gr`, [lerp(g.guard.open[1][0], g.guard.half[1][0], close), g.guard.open[1][1]]); }
    // the micrograph's pore narrows with them: frame lo under frame lo + 1, which fades in
    const k = close * (ST3D.length - 1), lo = Math.min(ST3D.length - 2, Math.floor(k));
    ST3D.forEach((_, i) => a.op(`${p}st${i}`, i === lo ? 1 : i === lo + 1 ? k - lo : 0));

    /* the magnifiers */
    const wOn = beat === 0 ? ease(t, 0.3, 1.0) : 1, sOn = beat < 2 ? 0 : beat === 2 ? ease(t, 0, 0.8) : 1;
    a.op(`${p}iw`, wOn); a.op(`${p}iw-lens`, wOn); a.op(`${p}is`, sOn); a.op(`${p}is-lens`, sOn);
    a.op(`${p}wl-strm`, from(beat, t, 0, 0.7)); a.op(`${p}wl-rub`, from(beat, t, 0, 0.7));
    a.op(`${p}wl-air`, from(beat, t, 3, 1.6 + D3)); a.op(`${p}wl-film`, from(beat, t, 3, 2.7 + D3)); a.op(`${p}wl-wall`, from(beat, t, 3, 3.6 + D3));
    a.op(`${p}wl-pm`, from(beat, t, 4, 0.6)); a.op(`${p}wl-cyt`, from(beat, t, 4, 1.4)); a.op(`${p}wl-env`, from(beat, t, 4, 2.6));

    /* the CO₂ card */
    a.op(`${p}cg`, from(beat, t, 0, 3.4, 4.2));
    a.op(`${p}ba`, from(beat, t, 0, 4.2));
    a.op(`${p}gb`, from(beat, t, 1, 2.4)); a.op(`${p}u1`, from(beat, t, 2, 1.0)); a.op(`${p}gs`, from(beat, t, 2, 2.6));
    a.op(`${p}bi`, from(beat, t, 2, 5.0));
    a.op(`${p}gm`, from(beat, t, 3, 4.4)); a.op(`${p}u2`, from(beat, t, 4, 0.5));
    a.op(`${p}bc`, from(beat, t, 4, 5.0)); a.op(`${p}eq`, from(beat, t, 4, 5.8, 6.4));
    const shrink = beat === 5 ? ease(t, 2.0, 3.4) : 0;
    setBar(a, p, 'i', shrink); setBar(a, p, 'c', shrink);

    /* beat 0: RuBisCO uses CO₂; the CO₂ character waits in the outside air */
    if (beat === 0) {
      a.put(`${p}c0`, [lerp(W[0] - 30, SITE[0], ease(t, 1.0, 2.4)), lerp(WY(-56), SITE[1], ease(t, 1.0, 2.4))], fade(t, 0.8, 1.0, 2.4, 2.6));
      flash(a, t, 2.5, SITE, `${p}fw`);
      a.put(`${p}tk0`, [RUB[0] + 66, RUB[1] + 34], fade(t, 2.6, 3.0));
      kid(a, `${p}k`, g.air, ease(t, 3.0, 3.5), { lab: 1 });
    }
    if (beat === 1) {
      a.put(`${p}tk0`, [RUB[0] + 66, RUB[1] + 34], 1 - ease(t, 0, 0.5));
      const d = driftM(`${p}b1`, [g.air, [g.air[0], g.blBot], blTopV], secSpeed, 0.4, 4.6)(t);
      kid(a, `${p}k`, d.p, 1, { ...mood(d.v), lab: 1 - ease(t, 0, 0.6) });
    }
    if (beat === 2) {
      // the trip through the pore in the stoma inset; the CO₂ on the section follows it through the lens
      const di = driftM(`${p}s2`, [[S[0], S[1] + 84], [S[0], S[1] + 40], [S[0], S[1]], [S[0], S[1] - 60], [S[0], S[1] - 150]], stomaSpeed, 0.9, 5.0)(t);
      const ip = clamp(1 - Math.max(0, Math.abs(di.p[1] - S[1]) - 18) / 22);
      kid(a, `${p}k`, toS(di.p), 1, { ...mood(di.v), sx: 1 - 0.45 * ip, sy: 1 + 0.08 * ip });
      // on the 3D stoma, in step with the section: it comes from the outside air, lines up with the pore and goes
      // through it (behind the render, seen through the hole, smaller as it moves away)
      const u = clamp((S[1] + 84 - di.p[1]) / 84), inn = clamp((S[1] - di.p[1]) / 40), q = toPore(u, POREI, 0.8);
      const rot = PORE_DEG * ease(u, 0.4, 0.95), sq = 1 - 0.3 * ease(u, 0.6, 1);
      if (inn <= 0) { kid(a, `${p}ks`, q.at, sOn, { ...mood(di.v), lab: 1 - ease(t, 2.2, 2.8) }, q.sc); tilt(a, `${p}ks`, rot, sq); }
      else { kid(a, `${p}ksb`, q.at, sOn * (1 - ease(inn, 0.55, 1)), mood(di.v), q.sc * (1 - 0.55 * inn)); tilt(a, `${p}ksb`, rot, sq); }
      // water vapour comes out of the same pore, towards the viewer
      // (before the CO₂ reaches the pore, or after it has gone in)
      const wt: Array<[number, number, V]> = [[0.2, 2.0, [-150, 46]], [0.6, 2.4, [60, -130]], [4.6, 6.2, [150, -70]], [4.9, 6.5, [-160, 6]]];
      wt.forEach(([t0, t1, d], i) => {
        if (t < t0 - 0.2) return;
        const e = ease(t, t0, t1);
        a.put(`${p}w${i + 1}`, [POREI[0] + d[0] * e, POREI[1] + d[1] * e], sOn * fade(t, t0 - 0.2, t0 + 0.1, t1 - 0.5, t1), lerp(0.4, 1.15, e));
      });
    }
    if (beat === 3) {
      const di = driftM(`${p}w3`, [[LANE, WY(250)], [LANE, WY(150)], [LANE, WY(104)], [LANE, WY(56)]], wallSpeed, 2.0 + D3, 6.4 + D3)(t);
      if (t < 2.25 + D3) { const d = driftM(`${p}b3`, [toS([S[0], S[1] - 150]), ...g.cav.slice(1), toW([LANE, WY(250)])], secSpeed, 0.3, 2.25 + D3)(t); kid(a, `${p}k`, d.p, 1, mood(d.v, true)); }
      else kid(a, `${p}k`, toW(di.p), 1, { ...mood(di.v, true), shell: clamp((WY(B.film1 + 4) - di.p[1]) / 14) });
      const sh = clamp((WY(B.film1 + 4) - di.p[1]) / 14);
      kid(a, `${p}kw`, di.p, ease(t, 1.9 + D3, 2.2 + D3), { ...mood(di.v, true), shell: sh, lab: 1 });
      a.txt(`${p}kw-l`, sh > 0.5 ? 'dissolved CO₂' : 'CO₂');
    }
    if (beat === 4) {
      const di = driftM(`${p}w4`, [[LANE, WY(56)], [LANE, WY(10)], [LANE, WY(-30)], [LANE - 12, WY(-70)], [SITE[0] + 10, SITE[1] + 4]], wallSpeed, 0.3, 4.6)(t);
      kid(a, `${p}k`, toW(di.p), 1 - ease(t, 4.6, 4.8), { ...mood(di.v), shell: 1 });
      flash(a, t, 4.7, toW([SITE[0] + 10, SITE[1] + 4]), `${p}fs`);
      kid(a, `${p}kw`, di.p, 1 - ease(t, 4.6, 4.8), { ...mood(di.v), shell: 1, lab: clamp((di.p[1] - WY(B.pm0 - 26)) / 26) });
      a.txt(`${p}kw-l`, 'dissolved CO₂');
      flash(a, t, 4.75, SITE, `${p}fw`);
      a.put(`${p}tk1`, [RUB[0] + 66, RUB[1] + 34], fade(t, 4.9, 5.3));
    }
    if (beat === 5) {
      a.put(`${p}tk1`, [RUB[0] + 66, RUB[1] + 34], 1 - ease(t, 0, 0.4));
      a.op(`${p}hot`, ease(t, 0, 0.8));
      const temp = lerp(25, 35, ease(t, 0.3, 1.8));
      a.txt(`${p}tt`, `${Math.round(temp)} °C`); thermoSet(a, `${p}th`, 478, temp, 70);
      a.op(`${p}sol`, ease(t, 3.4, 4.0));
      // a second CO₂ reaches the narrowed pore and is stuck there
      const sway = t > 3.0 ? 2 * Math.sin(((t - 3.0) * 2 * Math.PI) / 2.4) * ease(t, 3.0, 3.6) : 0;
      const di = driftM(`${p}s5`, [[S[0], S[1] + 150], [S[0], S[1] + 90], [S[0], S[1] + 48]], stomaSpeed, 1.2, 3.0)(t);
      const u5 = clamp((S[1] + 150 - di.p[1]) / 102), q5 = toPore(u5, [POREI[0] + 4, POREI[1] + 4], 0.8);
      kid(a, `${p}ks2`, [q5.at[0] + sway, q5.at[1]], ease(t, 1.1, 1.4), { s: ease(t, 2.0, 2.6), sweat: ease(t, 2.6, 3.2) }, q5.sc);
      tilt(a, `${p}ks2`, PORE_DEG * ease(u5, 0.4, 0.95), 1 - 0.15 * ease(u5, 0.6, 1));
      const ds = toS([di.p[0], di.p[1] + sway]);
      kid(a, `${p}k2`, ds, ease(t, 1.1, 1.4), { s: ease(t, 1.6, 2.2), sweat: ease(t, 2.6, 3.2) });
      // RuBisCO takes up more O₂
      for (const [k, t0, t1, from0] of [[`${p}o1`, 2.6, 4.2, [W[0] - 70, WY(-60)]], [`${p}o2`, 3.0, 4.6, [W[0] - 110, WY(-90)]]] as Array<[string, number, number, V]>) {
        const u = ease(t, t0, t1);
        a.put(k, [lerp(from0[0], SITE[0] - 6, u), lerp(from0[1], SITE[1] + 6, u)], fade(t, t0 - 0.3, t0, t1, t1 + 0.2));
      }
      flash(a, t, 4.3, SITE, `${p}fw`); flash(a, t, 4.7, SITE, `${p}fw2`);
    }
  }
  return makeScene({ id: g.id, name: g.name, note: g.note, beats: LF10K, svg, frame });
}

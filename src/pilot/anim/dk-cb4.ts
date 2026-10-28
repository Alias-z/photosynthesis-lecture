// C4 · Sucrose and starch (beats CB4N, beats-cb4n.ts), staging s: in the real-protein strip (dk2-common.ts), rebuilt per
// triose phosphate (research/redo-2026-10-28/DARK_COUNTS_BRIEF.md). One still framing for all five beats.
// - Beat 1, export (unit: 1 triose phosphate out, 1 Pᵢ in): triose phosphate 1 comes from GAPDH ("from 3 CO₂ fixed"),
//   goes out through TPT and, at the same moment, Pᵢ 1 comes in from the cytosol's Pᵢ; they cross at TPT.
// - Beat 2, sucrose: triose phosphates 2–4 (each from 3 CO₂ fixed) go out the same way, each crossing Pᵢ 2–4. In the
//   cytosol the 4 × 3 C = 12 C (from 12 CO₂) become 1 sucrose: the phosphates come off and return to the cytosol's Pᵢ,
//   and the four 3-C rows slide into sucrose's two rows of 6 C.
// - Beat 3, day and night: beside the strip, Graf et al. 2010's starch over 24 h (Arabidopsis, 12 h light / 12 h dark,
//   figs/cb-common GRAF_CTRL); the sucrose of beat 2 leaves for the plant. By day the thylakoid and its supply are lit
//   and 2 triose phosphates go into the starch granule; at night it dims, the granule shrinks with the curve, and 2 sugar
//   units of 6 C leave it for the cytosol, where they make 1 sucrose (uncounted: a concept beat).
// - Beat 4, starch use at night: night after 8 h (GRAF_EARLY); the second curve draws, the granule follows it.
// - Beat 5, RuBisCO and O₂: the panel goes; CO₂ and RuBP go into RuBisCO, 2 3-PGA come out; O₂ comes in from the
//   oxygenation side and stays. Ends on the caption's question.
import { atomBall, row } from '../figs/carbon-form';
import { balls } from '../figs/cell-schema';
import { tagG } from '../figs/chain';
import { GRAF_CTRL, GRAF_EARLY } from '../figs/cb-common';
import {
  AX, AY, attrSetter, axesSvg, camTf, cardSvg, clamp01, curve, ease, f, fnPath, frame, gasPath, glide, interp, ledgerSetter,
  ledgerSvg, lerp, lerpV, litOf, mixLit, moverSvg, numT, placer, sceneSvg, SP, Strip, tAt, uNear, type Axes, type Cam,
  type LedRow, type LitMap, type Mover, type Path, type Put, type V,
} from './dk2-common';
import type { Staging } from './types';

const P = 'dkc4';
const R = 11, RT = 10.5;

/* ---------------------------------------------------------------- where: SPOT (cell-schema) through SP */

const TPAT: V = SP.tp, SRC: V = [SP.gapdh[0] + 30, SP.gapdh[1] - 48], GRAN: V = SP.starch, SUC: V = [SP.sucrose[0] + 42, SP.sucrose[1] + 1];
const TPT_X = 760;
/** Triose phosphates 1–4 in the cytosol: where each waits (far slots first) and where its 3 C end up in sucrose's two
 *  rows of 6 C (r 10.5: C step 22.6). */
const FIN: V[] = [[SUC[0] + 45.2, SUC[1] - 12], [SUC[0] - 22.6, SUC[1] - 12], [SUC[0] + 45.2, SUC[1] + 12], [SUC[0] - 22.6, SUC[1] + 12]];
const SLOT: V[] = FIN.map(([x, y], i) => [x + (i % 2 ? -24 : 24), y + (y < SUC[1] ? -26 : 26)] as V);
/** From GAPDH along its arrow to the triose phosphate spot, then out through TPT to its slot. */
const tpPath = (i: number): Path => curve([SRC, [SRC[0] + 40, SRC[1] - 30], TPAT, [460, 97], [570, 96], [690, 99], [TPT_X, 100], [830, 99], [SLOT[i][0] - 70, (SLOT[i][1] + 99) / 2 + 6], SLOT[i]]);
const U_TPT = [0, 1, 2, 3].map(i => uNear(tpPath(i), [TPT_X, 100]));
/** Pᵢ from the cytosol's Pᵢ (its spot in the strip) in through TPT to the stroma. */
const PI_POOL: V = SP.pi;
const piPath = curve([PI_POOL, [860, 140], [818, 129], [TPT_X, 127], [690, 126]]);
const U_PI = uNear(piPath, [TPT_X, 127]);
const toStarch = curve([SRC, [SRC[0] + 40, SRC[1] - 30], TPAT, [404, 70], [470, 40], [530, 24], GRAN]);
/** At night: a 6-C sugar unit leaves the granule across the envelope (not through TPT) to one of sucrose's rows. */
const hexPath = (k: number): Path => curve([[GRAN[0] + 30, GRAN[1] - 4], [650, -22], [TPT_X, -30], [840, -20], [SUC[0], SUC[1] + (k ? 12 : -12)]]);
const P_CO2 = gasPath('co2', 24);
const P_RUBP = curve([[SP.rubp[0], SP.rubp[1] + 40], SP.rubp, SP.rubpFrom, SP.rubpTo]);
const PGA_AT: V[] = [SP.pga, [SP.pga[0] + 20, SP.pga[1] + 34]];
const P_PGA = (k: number): Path => curve([lerpV(SP.carboxFrom, SP.rub, 0.35), SP.carboxFrom, SP.carboxTo, PGA_AT[k]]);
const P_O2 = gasPath('o2', 90, 24);

/* ---------------------------------------------------------------- timing */

/** Triose phosphate i (0-based): fades in at GAPDH at `g` − 0.3 and glides over `d`; Pᵢ i crosses TPT at the same moment. */
const TPS = [{ b: 0, g: 0.8, d: 4.0 }, { b: 1, g: 0.4, d: 3.4 }, { b: 1, g: 1.4, d: 3.0 }, { b: 1, g: 2.4, d: 2.8 }];
const T_CROSS = TPS.map((s, i) => tAt(U_TPT[i], s.g, s.d));
const PI_D = 1.6, PIS = T_CROSS.map(tc => ({ g: tc - tAt(U_PI, 0, PI_D), d: PI_D }));
/** The sucrose of beat 2: phosphates off, released to the cytosol's Pᵢ; rows slide together; sucrose takes over. */
const MERGE = [5.5, 5.9, 5.8, 6.5, 6.8];
/** Beats 3 and 4: the clock runs 0 → 24 h from H0 over HD s. */
const H0 = [1.2, 0.8], HD = 7.4;
const hourOf = (b: 2 | 3, t: number): number => 24 * clamp01((t - H0[b - 2]) / HD);
const tOfHour = (b: 2 | 3, h: number): number => H0[b - 2] + (h / 24) * HD;
/** Beat 3: 2 triose phosphates into starch by day, 2 sugar units out at night (they make 1 sucrose). */
const DAYTP = [2, 6].map(h => tOfHour(2, h)), NIGHT6 = [14, 17.5].map(h => tOfHour(2, h)), HEX_D = 1.8, NSUC = NIGHT6[1] + HEX_D + 0.2;

/* ---------------------------------------------------------------- the glyphs */

/** A triose phosphate whose phosphate (and number) can fade on its own (data-k tpP<i>): C at −33.9, −11.3, 11.3, P at 33.9. */
const tpG = (i: number, n?: number): string => `<g data-k="tpP${i}"><path d="M11.3,0H33.9" style="stroke:#6b6a64;stroke-width:2.31;fill:none"/>${atomBall(33.9, 0, 'P', RT)}${n ? numT(n, -2, -18) : ''}</g>${row(-11.3, 0, 'CCC', { r: RT })}`;
const piG = (n?: number): string => `<g class="chn-g">${tagG(0, 0, '', 'pi')}</g>${n ? numT(n, 0, -20) : ''}`;
const sucG = `${row(0, -12, 'CCCCCC', { r: RT })}${row(0, 12, 'CCCCCC', { r: RT })}`;
const MOV: Mover[] = [
  ...[0, 1, 2, 3].map(i => ({ k: `tp${i}`, svg: tpG(i, i + 1) })),
  ...[0, 1, 2, 3].map(i => ({ k: `pi${i}`, svg: piG(i + 1) })),
  ...[0, 1, 2, 3].map(i => ({ k: `pr${i}`, svg: piG() })),
  { k: 'suc', svg: sucG, label: 'sucrose', at: [0, 50] },
  ...[0, 1].map(i => ({ k: `st${i}`, svg: tpG(4 + i) })),
  ...[0, 1].map(i => ({ k: `hx${i}`, svg: row(0, 0, 'CCCCCC', { r: RT }), label: i === 0 ? 'from starch' : undefined, at: [0, -20] as V })),
  { k: 'nsuc', svg: sucG, label: 'sucrose', at: [0, 50] },
  { k: 'co2', svg: `<g class="chn-g">${balls(0, 0, 'OCO')}</g>`, label: 'CO₂', at: [0, -22] },
  { k: 'rubp', svg: row(0, 0, 'PCCCCCP', { r: R }), label: 'RuBP', at: [-96, 6], anchor: 'end' },
  { k: 'pga0', svg: row(0, 0, 'CCCP', { r: R }), label: '3-PGA', at: [0, -20] },
  { k: 'pga1', svg: row(0, 0, 'CCCP', { r: R }) },
  { k: 'o2', svg: `<g class="chn-g">${balls(0, 0, 'OO')}</g>`, label: 'O₂', at: [0, -22] },
];

/* ---------------------------------------------------------------- the ledger and the panel (stage units) */

const ROWS: LedRow[] = [
  { name: 'triose phosphate out', nums: [1, 2, 3, 4], total: '= 12 C, from 12 CO₂' },
  { name: 'Pᵢ in', nums: [1, 2, 3, 4] },
];
const LED = { x: 1020, y: 586, w: 560 };
/** The panel lies over the strip's dimmed lower part (RuBisCO, PRK), leaving the thylakoid, GAPDH, the starch granule,
 *  TPT and the cytosol's sucrose in view. */
const PAN = { x: 470, y: 300, w: 1110, h: 428 };
const AXS: Axes = { x0: 594, y0: 360, w: 920, h: 250, xr: [0, 24], yr: [0, 8] };
const ctrl = interp(GRAF_CTRL), early = interp(GRAF_EARLY);
function panelSvg(): string {
  const a = AXS, top = a.y0 - 34, band = (h0: number, h1: number, cls: string): string =>
    `<rect class="${cls}" x="${f(AX(a, h0))}" y="${f(top)}" width="${f(AX(a, h1) - AX(a, h0))}" height="24"/>`;
  return `<g data-k="${P}-panel" opacity="0">${cardSvg(PAN.x, PAN.y, PAN.w, PAN.h)}
    ${band(0, 12, 'dk2-day')}${band(12, 24, 'dk2-night')}
    <g data-k="${P}-early" opacity="0">${band(8, 12, 'dk2-night')}<rect class="dk2-nshade" x="${f(AX(a, 8))}" y="${f(a.y0)}" width="${f(AX(a, 12) - AX(a, 8))}" height="${f(a.h)}"/></g>
    <text class="dk2-band" x="${f(AX(a, 4))}" y="${f(top + 18)}" text-anchor="middle">day</text>
    <text class="dk2-band-d" x="${f(AX(a, 18))}" y="${f(top + 18)}" text-anchor="middle">night</text>
    <rect class="dk2-nshade" x="${f(AX(a, 12))}" y="${f(a.y0)}" width="${f(AX(a, 24) - AX(a, 12))}" height="${f(a.h)}"/>
    ${axesSvg(a, [0, 4, 8, 12, 16, 20, 24], [0, 4, 8], 'hours after dawn', 'starch (mg g⁻¹)')}
    <path data-k="${P}-cc" class="dk2-cur" d="M0,0"/><path data-k="${P}-ce" class="dk2-cur dk2-cur-amber" d="M0,0"/>
    <path data-k="${P}-cur" class="dk2-cursor" d="M0,0"/><circle data-k="${P}-dot" class="dk2-dot" r="7" opacity="0"/>
    <text data-k="${P}-l1" class="dk2-gl" x="${f(AX(a, 12.5))}" y="${f(AY(a, 6.7) - 6)}" opacity="0">night after 12 h</text>
    <text data-k="${P}-l2" class="dk2-gl" style="fill:#b5711a" x="${f(AX(a, 8.8))}" y="${f(AY(a, 1.2))}" opacity="0">night after 8 h</text>
    <text class="dk2-cr" x="${PAN.x + PAN.w - 16}" y="${PAN.y + PAN.h - 12}" text-anchor="end">Graf et al. 2010, PNAS, Fig. 1A</text></g>`;
}

/* ---------------------------------------------------------------- framing and lighting */

/** One still framing for the whole animation: the strip from the thylakoid to the cytosol. */
const CAM: Cam = frame(0, 1185, 0, 1600, -60);
const L1 = litOf(['tp', 'export', 'reduce']);
const DAY = litOf(['light', 'thyl', 'supply', 'tp', 'starch']), NIGHT = litOf(['starch']);
const L5 = litOf(['rubisco', 'co2', 'o2', 'carbox']);
const dayNight = (h: number, dusk: number): LitMap => mixLit(DAY, NIGHT, ease(h, dusk - 0.5, dusk + 0.5));
function lit(beat: number, t: number): LitMap {
  if (beat === 0) return mixLit({}, L1, ease(t, 0.1, 0.9));
  if (beat === 1) return L1;
  if (beat === 2) return mixLit(L1, dayNight(hourOf(2, t), 12), ease(t, 0, 0.9));
  if (beat === 3) return mixLit(NIGHT, dayNight(hourOf(3, t), 8), ease(t, 0, 0.6));
  return mixLit(NIGHT, L5, ease(t, 0.3, 1.2));
}
/** The granule's scale: 1 is the strip's drawn granule (its area ∝ starch, 6.7 mg g⁻¹ at the day's peak). */
const gScale = (s: number): number => Math.max(0.15, Math.sqrt(s / 6.7));
function granule(beat: number, t: number): number {
  if (beat <= 1) return 0.8;
  if (beat === 2) return lerp(0.8, gScale(ctrl(hourOf(2, t))), ease(t, 0.2, 1.2));
  if (beat === 3) return gScale(early(hourOf(3, t)));
  return gScale(early(24));
}

/* ---------------------------------------------------------------- the script */

interface St { pos: Record<string, Put>; att: Record<string, number> }
function script(beat: number, t: number): St {
  const pos: Record<string, Put> = {}, att: Record<string, number> = {};
  // triose phosphates 1–4 and Pᵢ 1–4 (beats 1–2)
  TPS.forEach((s, i) => {
    const pi = PIS[i];
    if (beat === s.b) {
      pos[`tp${i}`] = { at: glide(tpPath(i), t, s.g, s.d), o: ease(t, s.g - 0.3, s.g) };
      pos[`pi${i}`] = { at: glide(piPath, t, pi.g, pi.d), o: ease(t, pi.g - 0.6, pi.g - 0.2) * (1 - ease(t, pi.g + pi.d - 0.1, pi.g + pi.d + 0.4)) };
    } else if (beat > s.b && beat === 1) pos[`tp${i}`] = { at: SLOT[i], o: 1 };
    att[`tpP${i}`] = 1;
  });
  if (beat === 1) {
    const slide = ease(t, MERGE[2], MERGE[3]), take = ease(t, MERGE[3], MERGE[4]);
    for (let i = 0; i < 4; i++) {
      const s = TPS[i], at = s.b === 1 ? glide(tpPath(i), t, s.g, s.d) : SLOT[i];
      pos[`tp${i}`] = { at: lerpV(at, FIN[i], slide), o: (s.b === 1 ? ease(t, s.g - 0.3, s.g) : 1) * (1 - take) };
      att[`tpP${i}`] = 1 - ease(t, MERGE[0], MERGE[1]);
      // the phosphate comes off and returns to the cytosol's Pᵢ
      const from: V = [SLOT[i][0] + 33.9, SLOT[i][1]];
      pos[`pr${i}`] = { at: glide(curve([from, [lerp(from[0], PI_POOL[0], 0.5) + 20, lerp(from[1], PI_POOL[1], 0.5)], PI_POOL]), t, MERGE[0] + 0.1 * i, 1.0), o: ease(t, MERGE[0] - 0.05, MERGE[0] + 0.2) * (1 - ease(t, MERGE[0] + 0.9 + 0.1 * i, MERGE[0] + 1.2 + 0.1 * i)) };
    }
    pos.suc = { at: SUC, o: take };
  }
  // beat 3: the sucrose of beat 2 leaves for the plant; starch by day, sucrose from starch at night
  if (beat === 2) {
    pos.suc = { at: lerpV(SUC, [1260, SUC[1] - 30], ease(t, 0.2, 1.4)), o: 1 - ease(t, 0.9, 1.4) };
    DAYTP.forEach((g, i) => { const fin = ease(t, g + 1.2, g + 1.5); pos[`st${i}`] = { at: glide(toStarch, t, g, 1.5), o: ease(t, g - 0.3, g) * (1 - fin), s: 1 - 0.5 * fin }; att[`tpP${4 + i}`] = 1; });
    NIGHT6.forEach((g, i) => { pos[`hx${i}`] = { at: glide(hexPath(i), t, g, HEX_D), o: ease(t, g - 0.2, g + 0.2) * (1 - ease(t, NSUC, NSUC + 0.3)) }; });
    pos.nsuc = { at: SUC, o: ease(t, NSUC, NSUC + 0.3) };
  }
  if (beat === 3) pos.nsuc = { at: SUC, o: 1 };
  if (beat === 4) {
    pos.nsuc = { at: SUC, o: 1 - ease(t, 0, 0.8) };
    const into = ease(t, 2.6, 3.0);
    pos.co2 = { at: glide(P_CO2, t, 1.0, 1.7), o: ease(t, 0.9, 1.3) * (1 - into) };
    pos.rubp = { at: glide(P_RUBP, t, 1.1, 1.7), o: ease(t, 1.0, 1.4) * (1 - into) };
    for (const k of [0, 1]) pos[`pga${k}`] = { at: glide(P_PGA(k), t, 3.0 + 0.45 * k, 1.4), o: ease(t, 2.9 + 0.45 * k, 3.3 + 0.45 * k) };
    pos.o2 = { at: glide(P_O2, t, 4.4, 1.6), o: ease(t, 4.0, 4.5) };
  }
  return { pos, att };
}

export const STAGING: Staging = {
  id: 's',
  name: 's · In the protein strip',
  note: 'One still framing of the strip, per triose phosphate: triose phosphate 1 out through TPT as Pᵢ 1 comes in; 2–4 the same, and the 4 (from 12 CO₂) make 1 sucrose; Graf’s starch day and night beside the strip, starch by day and sucrose from starch at night; the early dusk; CO₂ and O₂ at RuBisCO',
  svg: () => {
    const gran = `<g data-k="${P}-gran" transform="translate(${GRAN[0]} ${GRAN[1]})"><ellipse class="cel-starch" rx="84" ry="40" vector-effect="non-scaling-stroke"/>${[0.75, 0.5, 0.26].map(q => `<ellipse class="cel-starchr" rx="${f(84 * q)}" ry="${f(40 * q)}" vector-effect="non-scaling-stroke"/>`).join('')}</g>`;
    const over = `<text data-k="${P}-stl" class="cel-mn cel-halo" x="${GRAN[0]}" y="-32" text-anchor="middle" opacity="0">starch</text>
      <rect data-k="${P}-veil" class="dk2-nightveil" x="-200" y="-200" width="2000" height="1000" opacity="0"/>
      <text data-k="${P}-tpl" class="cel-mn cel-halo" x="${TPAT[0]}" y="52" text-anchor="middle" opacity="0">triose phosphate</text>
      <text data-k="${P}-src" class="cel-cnt cel-halo" x="${TPAT[0]}" y="30" text-anchor="middle" opacity="0">from 3 CO₂ fixed</text>
      <text data-k="${P}-src2" class="cel-cnt cel-halo" x="${TPAT[0]}" y="30" text-anchor="middle" opacity="0">each from 3 CO₂ fixed</text>`;
    const hud = `${ledgerSvg(`${P}-led`, LED.x, LED.y, LED.w, '1 triose phosphate out, 1 Pᵢ in', ROWS, { nameW: 226 })}${panelSvg()}`;
    return sceneSvg(P, { under: gran, over, movers: MOV.map(moverSvg).join(''), hud });
  },
  bind(stage) {
    const S = new Strip(stage);
    S.hide('export', 'node'); S.hide('export', 'text', el => !el.textContent?.includes('TPT'));
    S.hide('starch', 'body'); S.hide('starch', 'text'); S.hide('o2', 'node'); S.hide('o2', 'text');
    const cam = stage.querySelector('[data-k="cam"]') as SVGGElement;
    cam.setAttribute('transform', camTf(CAM));
    const put = placer(stage, MOV.map(m => m.k)), led = ledgerSetter(stage, `${P}-led`, ROWS), A = attrSetter(stage);
    return (beat, t) => {
      S.light(lit(beat, t));
      A(`${P}-gran`, 'transform', `translate(${GRAN[0]} ${GRAN[1]}) scale(${f(granule(beat, t))})`);
      A(`${P}-stl`, 'opacity', beat < 4 ? ease(t, beat === 0 ? 0.1 : 0, beat === 0 ? 0.9 : 0.01) : 1 - ease(t, 0.3, 1.2));
      A(`${P}-tpl`, 'opacity', beat === 0 ? ease(t, 1.3, 1.9) : beat === 1 ? 1 : beat === 2 ? 1 - ease(t, 0, 0.6) : 0);
      A(`${P}-src`, 'opacity', beat === 0 ? ease(t, 1.3, 1.9) : beat === 1 ? 1 - ease(t, 0, 0.3) : 0);
      A(`${P}-src2`, 'opacity', beat === 1 ? ease(t, 0.3, 0.6) * (1 - ease(t, 4.6, 5.0)) : 0);
      const { pos, att } = script(beat, t);
      put(pos);
      for (const [k, v] of Object.entries(att)) A(k, 'opacity', v);
      // the ledger counts in step: each pair at the moment it crosses TPT; numerals 2–4 come in with beat 2
      if (beat <= 1) {
        const n = T_CROSS.filter((tc, i) => TPS[i].b < beat || (TPS[i].b === beat && t >= tc)).length;
        led(0, n, beat === 1 ? ease(t, MERGE[4] - 0.2, MERGE[4] + 0.3) : 0); led(1, n);
      }
      for (let j = 1; j < 4; j++) for (const i of [0, 1]) A(`${P}-led-n${i}-${j}`, 'opacity', beat === 0 ? 0 : 1);
      A(`${P}-led`, 'opacity', beat === 0 ? ease(t, 0.3, 0.9) : beat === 1 ? 1 : beat === 2 ? 1 - ease(t, 0, 0.5) : 0);
      // the panel: the clock, the curves, the granule in step
      const pan = beat === 2 ? ease(t, 0.3, 1.0) : beat === 3 ? 1 : beat === 4 ? 1 - ease(t, 0, 0.6) : 0;
      A(`${P}-panel`, 'opacity', pan);
      if (beat >= 2) {
        const h1 = beat === 2 ? hourOf(2, t) : 24, h2 = beat === 3 ? hourOf(3, t) : beat === 4 ? 24 : 0;
        A(`${P}-cc`, 'd', fnPath(AXS, ctrl, 0, h1, 120));
        A(`${P}-ce`, 'd', beat >= 3 ? fnPath(AXS, early, 0, h2, 120) : 'M0,0');
        const h = beat === 2 ? h1 : h2, fn = beat === 2 ? ctrl : early;
        const on = beat === 2 ? ease(t, H0[0] - 0.4, H0[0]) : beat === 3 ? 1 : 0;
        A(`${P}-dot`, 'opacity', on);
        A(`${P}-dot`, 'cx', AX(AXS, h)); A(`${P}-dot`, 'cy', AY(AXS, fn(h)));
        A(`${P}-dot`, 'class', beat === 3 ? 'dk2-dot dk2-dot-amber' : 'dk2-dot');
        A(`${P}-cur`, 'd', on > 0 ? `M${f(AX(AXS, h))},${f(AXS.y0)}V${f(AXS.y0 + AXS.h)}` : 'M0,0');
        A(`${P}-early`, 'opacity', beat === 3 ? ease(t, 0.1, 0.6) : beat === 4 ? 1 : 0);
        A(`${P}-l1`, 'opacity', beat === 2 ? ease(h1, 13, 14.5) : 1);
        A(`${P}-l2`, 'opacity', beat >= 3 ? ease(h2, 12, 14) : 0);
        const night = beat === 2 ? ease(h1, 11.5, 12.5) * (1 - ease(h1, 23.6, 24)) : beat === 3 ? ease(h2, 7.5, 8.5) * (1 - ease(h2, 23.6, 24)) : 0;
        A(`${P}-veil`, 'opacity', 0.1 * night);
      } else A(`${P}-veil`, 'opacity', 0);
    };
  },
};

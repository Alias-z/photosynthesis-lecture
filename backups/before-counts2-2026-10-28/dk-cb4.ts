// C4 · Sucrose and starch (beats CB4), staging s: in the real-protein strip (dk2-common.ts; DARK_ANIM_BRIEF.md).
// - Beat 1, out or in (counted per 18 CO₂ fixed: 6 triose phosphates, 1 per turn of 3 CO₂; 6 × 3 C = 18 C): the export
//   route, TPT and the starch granule lit.
//   Triose phosphates 1–4 leave through TPT, each in exchange for one Pᵢ (Pᵢ 1–4 come in); in the cytosol their
//   4 × 3 C become 1 sucrose (12 C). Triose phosphates 5–6 stay and go into the starch granule (2 × 3 C = 6 C, one
//   glucose unit), which grows. 4 + 2 are the fewest whole units of each product, not a measured split.
// - Beat 2, day and night: the camera moves left and a panel opens beside the strip: starch over 24 h (Graf et al. 2010,
//   Fig. 1A, Arabidopsis, 12 h light / 12 h dark, read off the figure: figs/cb-common GRAF_CTRL). The clock runs; by day
//   the thylakoid and its ATP and NADPH supply are lit, by night they dim; the granule grows and shrinks with the curve.
// - Beat 3, early dusk: night after 8 h (GRAF_EARLY); the second curve draws, the granule follows it, still lasting
//   until dawn.
// - Beat 4, RuBisCO and O₂: the camera moves to RuBisCO; CO₂ and RuBP go in, 2 3-PGA come out; then an O₂ comes to the
//   same site and stays. Ends on the caption's question.
import { atomBall, row } from '../figs/carbon-form';
import { balls } from '../figs/cell-schema';
import { tagG } from '../figs/chain';
import { GRAF_CTRL, GRAF_EARLY } from '../figs/cb-common';
import {
  AX, AY, attrSetter, axesSvg, camTf, cardSvg, clamp01, curve, ease, f, fnPath, frame, glide, interp, ledgerSetter,
  ledgerSvg, lerp, lerpV, litOf, mixLit, moverSvg, numT, placer, gasPath, sceneSvg, SP, Strip, type Axes, type Cam, type LedRow, type LitMap, type Mover,
  type Put, type V,
} from './dk2-common';
import type { Staging } from './types';

const P = 'dkc4';

/* ---------------------------------------------------------------- strip spots (strip units, cell-schema.ts) */

const TPAT: V = SP.tp, SRC: V = [SP.tp[0] - 48, SP.tp[1] + 18], GRAN: V = SP.starch, SUC: V = [SP.sucrose[0] + 42, SP.sucrose[1] + 1];
/** Triose phosphates 1–4 in the cytosol: where each waits (far slots first, so later ones never cross a parked one), and
 *  where its 3 C end up in sucrose's two rows of 6 C (r 10.5: C step 22.6). */
const FIN: V[] = [[SUC[0] + 45.2, 34], [SUC[0] - 22.6, 34], [SUC[0] + 45.2, 58], [SUC[0] - 22.6, 58]];
const SLOT: V[] = FIN.map(([x, y], i) => [x + (i % 2 ? -24 : 24), y + (y < 46 ? -26 : 26)] as V);
const tpPath = (i: number) => curve([SRC, TPAT, [460, 97], [570, 96], [690, 99], [760, 100], [830, 99], [SLOT[i][0] - 70, (SLOT[i][1] + 99) / 2 + 6], SLOT[i]]);
const piPath = curve([[SP.pi[0] + 12, SP.pi[1] - 2], [860, 140], [818, 129], [760, 127], [690, 126]]);
const toStarch = curve([SRC, TPAT, [404, 70], [470, 40], [530, 24], GRAN]);
// at RuBisCO (beat 4): spots from the one adapter SP (dk2-common.ts)
const P_CO2 = gasPath('co2', 24);
/** RuBP comes up from below RuBisCO along its arrow. */
const P_RUBP = curve([[SP.rubp[0], SP.rubp[1] + 40], SP.rubp, SP.rubpFrom, SP.rubpTo]);
/** The 2 3-PGA leave along the carboxylation arrow to the 3-PGA spot (one on it, one just below right). */
const PGA_AT: V[] = [SP.pga, [SP.pga[0] + 20, SP.pga[1] + 34]];
const P_PGA = (k: number) => curve([lerpV(SP.carboxFrom, SP.rub, 0.35), SP.carboxFrom, SP.carboxTo, PGA_AT[k]]);
/** O₂ comes in from the oxygenation side and stops at the arrow's tip, outside RuBisCO. */
const P_O2 = gasPath('o2', 90, 24);

/* ---------------------------------------------------------------- timing */

/** Beat 1: triose phosphate i (0-based) fades in at `a`, glides from `g` over `d`. 4 out, then 2 into starch. */
const TPS = [
  { a: 0.6, g: 1.2, d: 2.4 }, { a: 2.0, g: 2.4, d: 2.0 }, { a: 3.0, g: 3.3, d: 1.7 }, { a: 3.8, g: 4.1, d: 1.6 },
  { a: 7.0, g: 7.3, d: 1.6 }, { a: 7.6, g: 7.9, d: 1.5 },
];
/** Pᵢ i comes in so that it crosses TPT as triose phosphate i does. */
const PIS = TPS.slice(0, 4).map(s => ({ g: s.g + 0.65 * s.d - 0.6 * 1.5, d: 1.5 }));
/** The merge: phosphates and numbers fade, the four 3-C rows slide into sucrose's two rows, sucrose takes over. */
const MERGE = [5.9, 6.3, 6.2, 6.9, 7.2];
/** Beats 2 and 3: the clock runs 0 → 24 h from H0 over HD s. */
const H0 = [1.8, 0.8], HD = 7.2;
const hourOf = (b: 1 | 2, t: number): number => 24 * clamp01((t - H0[b - 1]) / HD);

/* ---------------------------------------------------------------- the glyphs */

const R = 11, RT = 10.5;
/** A triose phosphate whose phosphate (and number) can fade on its own (data-k tpP<i>): C at −33.9, −11.3, 11.3, P at 33.9. */
const tpG = (i: number): string => `<g data-k="tpP${i}"><path d="M11.3,0H33.9" style="stroke:#6b6a64;stroke-width:2.31;fill:none"/>${atomBall(33.9, 0, 'P', RT)}${numT(i + 1, -2, -18)}</g>${row(-11.3, 0, 'CCC', { r: RT })}`;
const MOV: Mover[] = [
  ...TPS.map((_, i) => ({ k: `tp${i}`, svg: tpG(i) })),
  ...PIS.map((_, i) => ({ k: `pi${i}`, svg: `<g class="chn-g">${tagG(0, 0, '', 'pi')}</g>${numT(i + 1, 0, -20)}` })),
  { k: 'suc', svg: `${row(0, -12, 'CCCCCC', { r: RT })}${row(0, 12, 'CCCCCC', { r: RT })}`, label: 'sucrose', at: [0, 50] },
  { k: 'co2', svg: `<g class="chn-g">${balls(0, 0, 'OCO')}</g>`, label: 'CO₂', at: [0, -22] },
  { k: 'rubp', svg: row(0, 0, 'PCCCCCP', { r: R }), label: 'RuBP', at: [-96, 6], anchor: 'end' },
  { k: 'pga0', svg: row(0, 0, 'CCCP', { r: R }), label: '3-PGA', at: [0, -20] },
  { k: 'pga1', svg: row(0, 0, 'CCCP', { r: R }) },
  { k: 'o2', svg: `<g class="chn-g">${balls(0, 0, 'OO')}</g>`, label: 'O₂', at: [0, -22] },
];

/* ---------------------------------------------------------------- the ledger and the panel (stage units) */

const ROWS: LedRow[] = [
  { name: 'out to sucrose', nums: [1, 2, 3, 4], total: '4 × 3 C = 12 C' },
  { name: 'Pᵢ in', nums: [1, 2, 3, 4] },
  { name: 'into starch', nums: [5, 6], total: '2 × 3 C = 6 C' },
];
const LED = { x: 1104, y: 548, w: 476 };
const AXS: Axes = { x0: 1108, y0: 128, w: 436, h: 400, xr: [0, 24], yr: [0, 8] };
const ctrl = interp(GRAF_CTRL), early = interp(GRAF_EARLY);
function panelSvg(): string {
  const a = AXS, top = a.y0 - 46, band = (h0: number, h1: number, cls: string): string =>
    `<rect class="${cls}" x="${f(AX(a, h0))}" y="${f(top)}" width="${f(AX(a, h1) - AX(a, h0))}" height="28"/>`;
  return `<g data-k="${P}-panel" opacity="0">${cardSvg(1000, 22, 578, 670)}
    ${band(0, 12, 'dk2-day')}${band(12, 24, 'dk2-night')}
    <g data-k="${P}-early" opacity="0">${band(8, 12, 'dk2-night')}<rect class="dk2-nshade" x="${f(AX(a, 8))}" y="${f(a.y0)}" width="${f(AX(a, 12) - AX(a, 8))}" height="${f(a.h)}"/></g>
    <text class="dk2-band" x="${f(AX(a, 4))}" y="${f(top + 20)}" text-anchor="middle">day</text>
    <text class="dk2-band-d" x="${f(AX(a, 18))}" y="${f(top + 20)}" text-anchor="middle">night</text>
    <rect class="dk2-nshade" x="${f(AX(a, 12))}" y="${f(a.y0)}" width="${f(AX(a, 24) - AX(a, 12))}" height="${f(a.h)}"/>
    ${axesSvg(a, [0, 4, 8, 12, 16, 20, 24], [0, 2, 4, 6, 8], 'hours after dawn', 'starch (mg g⁻¹)')}
    <path data-k="${P}-cc" class="dk2-cur" d="M0,0"/><path data-k="${P}-ce" class="dk2-cur dk2-cur-amber" d="M0,0"/>
    <path data-k="${P}-cur" class="dk2-cursor" d="M0,0"/><circle data-k="${P}-dot" class="dk2-dot" r="7" opacity="0"/>
    <text data-k="${P}-l1" class="dk2-gl" x="${f(AX(a, 12.6))}" y="${f(AY(a, 6.7) - 6)}" opacity="0">night after 12 h</text>
    <text data-k="${P}-l2" class="dk2-gl" style="fill:#b5711a" x="${f(AX(a, 8.8))}" y="${f(AY(a, 1.3))}" opacity="0">night after 8 h</text>
    <text class="dk2-cr" x="1562" y="676" text-anchor="end">Graf et al. 2010, PNAS, Fig. 1A</text></g>`;
}

/* ---------------------------------------------------------------- framings and lighting */

/** One still framing for the whole animation (lecturer: no zooming, at most one slow move): the strip from the thylakoid
 *  to the cytosol; in beats 2–3 the panel covers its right part, in beat 4 RuBisCO is lit in place. */
const CAM: Cam = frame(0, 1185, 0, 1600, -60);
const L1 = litOf(['tp', 'export', 'starch']);
const DAY = litOf(['light', 'thyl', 'supply', 'starch']), NIGHT = litOf(['starch']);
const L4 = litOf(['rubisco', 'co2', 'o2', 'carbox']);
/** Day → night as the clock passes dusk. */
const dayNight = (h: number, dusk: number): LitMap => mixLit(DAY, NIGHT, ease(h, dusk - 0.5, dusk + 0.5));
function lit(beat: number, t: number): LitMap {
  if (beat === 0) return mixLit({}, L1, ease(t, 0.1, 0.9));
  if (beat === 1) return mixLit(L1, dayNight(hourOf(1, t), 12), ease(t, 0, 0.9));
  if (beat === 2) return mixLit(NIGHT, dayNight(hourOf(2, t), 8), ease(t, 0, 0.6));
  return mixLit(NIGHT, L4, ease(t, 0.3, 1.2));
}
/** The granule's scale: 1 is the strip's drawn granule (its area ∝ starch, 6.7 mg g⁻¹ at the day's peak). */
const gScale = (s: number): number => Math.max(0.15, Math.sqrt(s / 6.7));
function granule(beat: number, t: number): number {
  if (beat === 0) return 0.8 + 0.06 * ease(t, 8.6, 9.0) + 0.06 * ease(t, 9.1, 9.5);
  if (beat === 1) return lerp(0.92, gScale(ctrl(hourOf(1, t))), ease(t, 0.2, 1.4));
  if (beat === 2) return gScale(early(hourOf(2, t)));
  return gScale(early(24));
}

/* ---------------------------------------------------------------- the script */

function script(beat: number, t: number): Record<string, Put> {
  const Pm: Record<string, Put> = {};
  if (beat === 0) {
    const slide = ease(t, MERGE[2], MERGE[3]), take = ease(t, MERGE[3], MERGE[4]);
    TPS.forEach((s, i) => {
      if (i < 4) { Pm[`tp${i}`] = { at: lerpV(glide(tpPath(i), t, s.g, s.d), FIN[i], slide), o: ease(t, s.a, s.a + 0.4) * (1 - take) }; return; }
      const fin = ease(t, s.g + s.d - 0.4, s.g + s.d);
      Pm[`tp${i}`] = { at: glide(toStarch, t, s.g, s.d), o: ease(t, s.a, s.a + 0.4) * (1 - fin), s: 1 - 0.5 * fin };
    });
    PIS.forEach((s, i) => { Pm[`pi${i}`] = { at: glide(piPath, t, s.g, s.d), o: ease(t, s.g - 0.3, s.g) * (1 - ease(t, s.g + s.d - 0.1, s.g + s.d + 0.4)) }; });
    Pm.suc = { at: SUC, o: take };
  } else Pm.suc = { at: SUC, o: beat === 3 ? 1 - ease(t, 0, 0.8) : 1 };
  if (beat === 3) {
    const into = ease(t, 2.6, 3.0);
    Pm.co2 = { at: glide(P_CO2, t, 1.0, 1.7), o: ease(t, 0.9, 1.3) * (1 - into) };
    Pm.rubp = { at: glide(P_RUBP, t, 1.1, 1.7), o: ease(t, 1.0, 1.4) * (1 - into) };
    for (const k of [0, 1]) Pm[`pga${k}`] = { at: glide(P_PGA(k), t, 3.0 + 0.45 * k, 1.4), o: ease(t, 2.9 + 0.45 * k, 3.3 + 0.45 * k) };
    Pm.o2 = { at: glide(P_O2, t, 4.4, 1.6), o: ease(t, 4.0, 4.5) };
  }
  return Pm;
}

export const STAGING: Staging = {
  id: 's',
  name: 's · In the protein strip',
  note: 'The dark-reaction strip: triose phosphates 1–4 leave through TPT for Pᵢ 1–4 and become sucrose in the cytosol, 5–6 go into the starch granule; beside the strip, Graf’s starch curve over a day and a night, then with an early dusk, the granule in step; then CO₂ and O₂ at RuBisCO',
  svg: () => {
    const gran = `<g data-k="${P}-gran" transform="translate(${GRAN[0]} ${GRAN[1]})"><ellipse class="cel-starch" rx="84" ry="40" vector-effect="non-scaling-stroke"/>${[0.75, 0.5, 0.26].map(q => `<ellipse class="cel-starchr" rx="${f(84 * q)}" ry="${f(40 * q)}" vector-effect="non-scaling-stroke"/>`).join('')}</g>`;
    const over = `<text data-k="${P}-stl" class="cel-mn cel-halo" x="${GRAN[0]}" y="-32" text-anchor="middle" opacity="0">starch</text>
      <rect data-k="${P}-veil" class="dk2-nightveil" x="-200" y="-200" width="2000" height="1000" opacity="0"/>
      <text data-k="${P}-tpl" class="cel-mn cel-halo" x="${TPAT[0]}" y="58" text-anchor="middle" opacity="0">triose phosphate</text>`;
    const hud = `${ledgerSvg(`${P}-led`, LED.x, LED.y, LED.w, 'per 18 CO₂ fixed: 6 triose phosphates', ROWS)}${panelSvg()}`;
    return sceneSvg(P, { under: gran, over, movers: MOV.map(moverSvg).join(''), hud });
  },
  bind(stage) {
    const S = new Strip(stage);
    S.hide('export', 'node'); S.hide('export', 'text'); S.hide('starch', 'body'); S.hide('starch', 'text'); S.hide('o2', 'node'); S.hide('o2', 'text');
    const cam = stage.querySelector('[data-k="cam"]') as SVGGElement;
    cam.setAttribute('transform', camTf(CAM));
    const put = placer(stage, MOV.map(m => m.k)), led = ledgerSetter(stage, `${P}-led`, ROWS), A = attrSetter(stage);
    return (beat, t) => {
      S.light(lit(beat, t));
      A(`${P}-gran`, 'transform', `translate(${GRAN[0]} ${GRAN[1]}) scale(${f(granule(beat, t))})`);
      A(`${P}-stl`, 'opacity', beat < 3 ? ease(t, beat === 0 ? 0.1 : 0, beat === 0 ? 0.9 : 0.01) : 1 - ease(t, 0.3, 1.2));
      A(`${P}-tpl`, 'opacity', beat === 0 ? ease(t, 0.3, 0.9) : beat === 1 ? 1 - ease(t, 0, 0.6) : 0);
      // the ledger counts in step: a triose phosphate is out when it has crossed TPT, a Pᵢ in when it has
      const Pm = script(beat, t);
      if (beat === 0) {
        const nOut = TPS.slice(0, 4).filter((s, i) => t > s.g && tpPath(i)(ease(t, s.g, s.g + s.d))[0] >= 760).length;
        const nPi = PIS.filter(s => t > s.g && piPath(ease(t, s.g, s.g + s.d))[0] <= 760).length;
        const nSt = TPS.slice(4).filter(s => t >= s.g + s.d - 0.2).length;
        led(0, nOut, ease(t, MERGE[4] - 0.2, MERGE[4] + 0.3)); led(1, nPi); led(2, nSt, ease(t, 9.5, 9.9));
      }
      for (let i = 0; i < 4; i++) A(`tpP${i}`, 'opacity', beat === 0 ? 1 - ease(t, MERGE[0], MERGE[1]) : 0);
      A(`${P}-led`, 'opacity', beat === 0 ? ease(t, 0.4, 1.0) : beat === 1 ? 1 - ease(t, 0, 0.5) : 0);
      // the panel: the clock, the curves, the granule in step
      const pan = beat === 1 ? ease(t, 1.0, 1.7) : beat === 2 ? 1 : beat === 3 ? 1 - ease(t, 0, 0.6) : 0;
      A(`${P}-panel`, 'opacity', pan);
      if (beat >= 1) {
        const h1 = beat === 1 ? hourOf(1, t) : 24, h2 = beat === 2 ? hourOf(2, t) : beat === 3 ? 24 : 0;
        A(`${P}-cc`, 'd', fnPath(AXS, ctrl, 0, h1, 120));
        A(`${P}-ce`, 'd', beat >= 2 ? fnPath(AXS, early, 0, h2, 120) : 'M0,0');
        const h = beat === 1 ? h1 : h2, fn = beat === 1 ? ctrl : early;
        const on = beat === 1 ? ease(t, H0[0] - 0.4, H0[0]) : beat === 2 ? 1 : 0;
        A(`${P}-dot`, 'opacity', on);
        A(`${P}-dot`, 'cx', AX(AXS, h)); A(`${P}-dot`, 'cy', AY(AXS, fn(h)));
        A(`${P}-dot`, 'class', beat === 2 ? 'dk2-dot dk2-dot-amber' : 'dk2-dot');
        A(`${P}-cur`, 'd', on > 0 ? `M${f(AX(AXS, h))},${f(AXS.y0)}V${f(AXS.y0 + AXS.h)}` : 'M0,0');
        A(`${P}-early`, 'opacity', beat === 2 ? ease(t, 0.1, 0.6) : beat === 3 ? 1 : 0);
        A(`${P}-l1`, 'opacity', beat === 1 ? ease(h1, 13, 14.5) : 1);
        A(`${P}-l2`, 'opacity', beat >= 2 ? ease(h2, 12, 14) : 0);
        const night = beat === 1 ? ease(h1, 11.5, 12.5) * (1 - ease(h1, 23.6, 24)) : beat === 2 ? ease(h2, 7.5, 8.5) * (1 - ease(h2, 23.6, 24)) : 0;
        A(`${P}-veil`, 'opacity', 0.1 * night);
      } else A(`${P}-veil`, 'opacity', 0);
      put(Pm);
    };
  },
};

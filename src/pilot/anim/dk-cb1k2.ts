// cb1, staging k2 · "The strip, with the story" (slide C1 · C₃ photosynthesis; beats CB1V2 of beats-cb1k.ts; brief
// research/redo-2026-10-29/C1_ANIM_V2_BRIEF.md, lecturer, 29 Oct 2026, evening: "tell the storyline", "make the
// calculation clear and simple", "too many numbers; only leave the key information"). The dark-reaction strip, one fixed
// framing (CYCLE_VIEW) for all 5 beats; carbons plain (counted, not traced); no molecule numbers; on screen only 2 lines,
// "3 RuBP = 15 C = 5 × 3 C" (beat 4) and "per 3 CO₂: 9 ATP + 6 NADPH used" (beat 5).
// - Beat 1, Carbon-14: ¹⁴CO₂ (ringed amber, the tracer) glides in from below to RuBisCO's side; card: the "lollipop"
//   (Berkeley Lab photo).
// - Beat 2, Carboxylation of RuBP (two steps, a click between): (A) card: Calvin's 5 s autoradiogram, its 3-PGA spot lit;
//   in the strip the ¹⁴CO₂ fades as the 3-PGA place takes the amber glow (the label first shows up in 3-PGA). (B) the card
//   and the glow go; RuBisCO lights; 3 CO₂ glide in, 3 RuBP appear under RuBisCO; 3 carboxylations give 6 3-PGA.
// - Beat 3, Reduction of 3-PGA: each 3-PGA with 1 ATP and 1 NADPH into GAPDH: 6 triose phosphates; ADP, Pᵢ and NADP⁺ glide
//   back along the strip's return arrow to the thylakoid edge.
// - Beat 4, Regeneration of RuBP: the line "3 RuBP = 15 C = 5 × 3 C"; 5 triose phosphates along the regeneration arrow
//   into PRK, which with 3 ATP gives 3 RuBP back to where the 3 RuBP started (ADP out past the ATP tag); the 6th, left alone
//   in the pile, leaves the cycle through TPT.
// - Beat 5, Per 3 CO₂: the whole cycle lit; the line "per 3 CO₂: 9 ATP + 6 NADPH used".
// - Every pile fills and empties in an order in which no molecule glides over a waiting one; the reactions are
//   dk1-common's (carbN, reduceN, prkN), re-written here with eased input scales, carriers that peel off their tags, and
//   the spent carriers' ways kept inside the frame. 27.7 s in all.
import lolJpg from '../../assets/photos/cb-lollipop-lbl.jpg';
import f5Png from '../../assets/photos/c2-5s.png';
import { SPOT } from '../figs/cell-schema';
import { tagG } from '../figs/chain';
import {
  add, ARROW, AT, card, clamp, CO2_FROM, CYCLE_VIEW, ease, ease2, G, GLYPH, glide, intoPrkN, lerp, lerpV, life, makeStaging,
  path, pileName, PILE, R, siteRing, SITE, T, WAY, type Actor, type Api, type Part, type V,
} from './dk1-common';
import { withKeys } from './stage-keys-cb';

/* ---------------------------------------------------------------- schedule (seconds into each beat) */

/** Beat 1: the photo, then ¹⁴CO₂ in from below. */
const B1 = { card: 0.3, co2: [0.8, 2.6] as [number, number] };
/** Beat 2, step A: the film, its 3-PGA spot, the label in the strip's 3-PGA; the hold; step B from B0. */
const B2 = { film: 0.3, ring: 1.3, label: 1.5, hold: 2.4 };
const B0 = B2.hold;
const CO2_T = (k: number): [number, number] => [B0 + 0.4 + 0.25 * k, B0 + 1.4 + 0.25 * k];
const RUBP_IN: [number, number] = [B0 + 0.4, B0 + 0.8];
const CARB = (k: number) => ({ t0: B0 + 1.8 + 1.4 * k, d: 1.9 });
/** Carboxylation k (RuBP from the top of the column) fills the 3-PGA pile from the top: row 2 − k (places 4 − 2k, 5 − 2k),
 *  so no 3-PGA glides over one already in the pile. */
const PGA_ROW = (k: number): [number, number] => [4 - 2 * k, 5 - 2 * k];
const tmOf = (k: number): number => CARB(k).t0 + 0.56 * CARB(k).d;
/** Beat 3: 6 reductions; reduction j takes the 3-PGA at place 5 − j (the top of the pile first) and puts its triose
 *  phosphate at place 5 − j of its pile (filled from the top), so no molecule glides over a waiting one. */
const RED = (j: number) => ({ t0: 0.4 + 0.8 * j, d: 1.0 });
const PLACE = (j: number): number => 5 - j;
/** Beat 4: the line, 5 triose phosphates into PRK, 3 RuBP out, the 6th out through TPT. */
const LINE_T = 0.2;
const TO_PRK = (k: number): [number, number] => [1.0 + 0.35 * k, 2.6 + 0.35 * k];
const PRK_T = (m: number): number => 4.3 + 1.0 * m;
const OUT_T: [number, number] = [6.6, 8.6];
/** The triose phosphate that leaves (top right of the pile: the others' ways into PRK do not cross it); the 5 leave the
 *  pile from the bottom, each through places already empty. */
const OUT_J = 5;
const BACK_J = [1, 0, 3, 2, 4];
/** RuBP m back from PRK fills the column from the bottom (place 2 − m), each above the one before. */
const RUBP_BACK = (m: number): number => 2 - m;

/* ---------------------------------------------------------------- actors (plain, unnumbered) */

const C14_CO2 = `<circle class="dk-c14g" r="16"/>${GLYPH.co2()}`;
const C14_PGA = `<ellipse class="dk-c14g" rx="60" ry="27"/>${GLYPH.carbon('CCCP')}`;
const ACTORS: Actor[] = [
  { k: 'c14', g: C14_CO2, lab: '¹⁴CO₂', dy: -22, cls: 'cel-mn cel-halo' }, { k: 'p14', g: C14_PGA },
  ...[1, 2, 3].flatMap(k => [{ k: `c${k}`, g: GLYPH.co2() }, { k: `r${k}`, g: GLYPH.carbon('PCCCCCP') }]),
  ...[1, 2, 3, 4, 5, 6].flatMap(j => [{ k: `p${j}`, g: GLYPH.carbon('CCCP') }, { k: `at${j}`, g: GLYPH.atp() }, { k: `nd${j}`, g: GLYPH.nadph() },
    { k: `t${j}`, g: GLYPH.carbon('CCCP') }, { k: `ad${j}`, g: GLYPH.adp() }, { k: `pi${j}`, g: GLYPH.pi() }, { k: `np${j}`, g: GLYPH.nadp() }]),
  ...[1, 2, 3].flatMap(m => [{ k: `ra${m}`, g: GLYPH.atp() }, { k: `nr${m}`, g: GLYPH.carbon('PCCCCCP') }, { k: `rd${m}`, g: GLYPH.adp() }]),
];
const RED_K = (j: number) => ({ pga: `p${j}`, atp: `at${j}`, nadph: `nd${j}`, tp: `t${j}`, adp: `ad${j}`, pi: `pi${j}`, nadp: `np${j}` });

/* ---------------------------------------------------------------- cards and the line (stage units) */

const CX = 1146, CW = 430;
const sub2 = 'CO<tspan baseline-shift="sub" font-size="70%">2</tspan>';
function cards(p: string): string {
  const lw = CW - 40, lh = lw * 884 / 1274;
  const fw = CW - 50, fh = fw * 1025 / 1349, fs = fw / 1349;
  const rx = CX + 25 + 975 * fs, ry = 86 + 708 * fs;
  return `${card(p, 'c-lol', CX, 34, CW, lh + 116, `${T(CX + 20, 70, 'the “lollipop”', 'dk-ctitle', 'start')}
      <image href="${lolJpg}" x="${CX + 20}" y="86" width="${lw}" height="${lh.toFixed(1)}"/>
      ${T(CX + 20, 86 + lh + 24, 'Berkeley Lab photo (R. M. Couto)', 'dk-ccr', 'start')}
      ${T(CX + 20, 86 + lh + 42, '© The Regents of the University of California', 'dk-ccr', 'start')}`, -1, 23)}
    ${card(p, 'c-film', CX, 34, CW, fh + 96, `${T(CX + 20, 70, `Calvin: 5 s of ¹⁴${sub2}`, 'dk-ctitle', 'start')}
      <image class="dk-mult" href="${f5Png}" x="${CX + 25}" y="86" width="${fw}" height="${fh.toFixed(1)}"/>
      <g data-k="c-ring" display="none"><ellipse cx="${rx.toFixed(1)}" cy="${ry.toFixed(1)}" rx="30" ry="38" style="fill:#f2b705;opacity:.22"/><ellipse class="dk-mark" cx="${rx.toFixed(1)}" cy="${ry.toFixed(1)}" rx="30" ry="38"/></g>
      ${T(CX + 20, 86 + fh + 26, 'Calvin 1961, Nobel lecture, Fig. 6 · © The Nobel Foundation 1961', 'dk-ccr', 'start')}`, 1, 29)}`;
}
/** The one line of beats 4 and 5, in a small panel at the bottom right. */
const LX = CX, LW = CW, LY = 652, LH = 56;
const LINES = [
  { k: 'ln-why', html: '3 RuBP = 15 C = 5 × 3 C' },
  { k: 'ln-used', html: 'per 3 CO₂: 9 ATP + 6 NADPH used' },
];
const lineSvg = (): string => `<g data-k="ln" display="none"><rect class="dk-panel" x="${LX}" y="${LY}" width="${LW}" height="${LH}" rx="14"/>
  ${LINES.map(l => `<g data-k="${l.k}" display="none">${T(LX + LW / 2, LY + 36, l.html, 'dk-pt')}</g>`).join('')}</g>`;

/* ---------------------------------------------------------------- reactions (dk1-common's, with their inputs' scale eased) */

/** One carboxylation (dk1-common carbN, except that RuBP and CO₂ grow from their pile scale as they set off, instead of
 *  jumping to full size at t0): RuBP rises into the active site, CO₂ docks, 2 3-PGA leave along the carboxylation arrow. */
function carb(a: Api, t: number, e: { t0: number; d: number; co2: V; rubp: V; to: [V, V]; k: { rb: string; g: string; a: string; b: string } }): void {
  const { t0, d } = e, tm = t0 + 0.56 * d, end = t0 + d, K = a.k, STEP = 2.15 * R;
  if (t < t0) return;
  const dock: V = add(SITE, [-STEP * K, -24 * K]), grow = lerp(PILE, 1, ease(t, t0, t0 + 0.35 * d));
  if (t < tm + 0.3) {
    a.put(e.k.rb, glide(path([e.rubp, G.rubpFrom, G.rubpTo, SITE]), t, t0, t0 + 0.45 * d), 1 - ease(t, tm, tm + 0.22), grow);
    a.put(e.k.g, t < t0 + 0.08 * d ? e.co2 : glide(path([e.co2, G.co2From, G.co2To, dock]), t, t0 + 0.08 * d, tm - 0.05 * d), 1 - ease(t, tm, tm + 0.2), grow);
  }
  if (t > tm - 0.12 && t < tm + 0.5) a.put('fl', SITE, life(t, tm - 0.12, tm + 0.03, tm + 0.1, tm + 0.5));
  if (t >= tm) {
    const [c0, c1] = ARROW.carbox, go0 = tm + 0.05 * d, o = ease(t, tm, tm + 0.18);
    const outA = path([add(SITE, [-40 * K, 0]), lerpV(c0, c1, 0.1), lerpV(c0, c1, 0.9), e.to[0]]);
    const outB = path([add(SITE, [-6 * K, -6 * K]), lerpV(c0, c1, 0.3), lerpV(c0, c1, 0.98), e.to[1]]);
    a.put(e.k.a, outA(ease2(t, go0, end)), o, lerp(1, PILE, ease(t, go0, end)));
    a.put(e.k.b, outB(ease2(t, go0 + 0.06 * d, end)), o, lerp(1, PILE, ease(t, go0, end)));
  }
}
/** A carrier peeling off a strip tag: it leaves its source quickly (smoother step of √u: no doubled tag for long, still
 *  no jerk) and docks gently. */
const peel = (c: (u: number) => V, t: number, t0: number, t1: number): V => c(ease2(Math.sqrt(clamp((t - t0) / (t1 - t0))), 0, 1));
/** Into GAPDH: 3-PGA's way from its place, ATP's and NADPH's from the thylakoid edge's tags (as dk1-common). */
const GAP_IN: V = add(G.gap, [-38, -4]);
const ATP_IN: V[] = [G.atpTag, lerpV(G.atpTag, GAP_IN, 0.5), GAP_IN];
const NADPH_IN: V[] = [G.nadphTag, add(lerpV(G.nadphTag, GAP_IN, 0.5), [14, -6]), GAP_IN];
const TP_OUT: V[] = [add(G.gap, [26, -44]), add(G.tp, [-56, 14])];
/** The spent carriers' way back, along the strip's dashed return arrow; they are gone just short of its row of spent
 *  carriers (no tag lands on a tag). */
const SPENT: V[] = [add(G.gap, [-14, -48]), [176, 70], [150, 42]];
/** One reduction at GAPDH (dk1-common reduceN, except that ATP and NADPH peel off their tags, and ADP, Pᵢ and NADP⁺ fade
 *  out along the return arrow instead of landing on the row of spent carriers). */
function reduce(a: Api, t: number, t0: number, d: number, from: V, to: V, k: { pga: string; atp: string; nadph: string; tp: string; adp: string; pi: string; nadp: string }): void {
  if (t < t0) return;
  const tR = t0 + d;
  if (t < tR + 0.25) {
    const o = 1 - ease(t, tR - 0.02, tR + 0.18);
    a.put(k.pga, glide(path([from, add(from, [26, -12]), GAP_IN]), t, t0, tR), o, lerp(PILE, 0.9, ease(t, t0, tR)));
    a.put(k.atp, peel(path(ATP_IN), t, t0, tR), o);
    a.put(k.nadph, peel(path(NADPH_IN), t, t0, tR), o);
  }
  if (t > tR - 0.12 && t < tR + 0.45) a.put('fl', G.gap, life(t, tR - 0.12, tR, tR + 0.08, tR + 0.45));
  if (t < tR) return;
  a.put(k.tp, glide(path([...TP_OUT, to]), t, tR + 0.05, tR + 1.05), ease(t, tR, tR + 0.18), lerp(1, PILE, ease(t, tR + 0.2, tR + 1.05)));
  const back = (key: string, dt: number): void => {
    const b0 = tR + 0.1 + dt, b1 = b0 + 1.3;
    if (t < b1) a.put(key, glide(path(SPENT), t, b0, b1), ease(t, tR, tR + 0.18) * (1 - ease(t, b0 + 0.55, b1)), 0.8);
  };
  back(k.adp, 0); back(k.pi, 0.1); back(k.nadp, 0.2);
}
/** ADP's way out of PRK: back past the ATP tag it came from, under it, fading (it is not recharged here). */
const ADP_OUT: V[] = [add(G.prk, [-30, 10]), add(G.regenAtp, [30, 18]), add(G.regenAtp, [-4, 30]), add(G.regenAtp, [-34, 32])];
/** At PRK at tE (dk1-common prkN, except that the ATP peels off the strip's ATP tag, RuBP goes to its place at the place's
 *  own height (along the PRK → RuBP arrow, then down to it, clear of the ATP tag and of the RuBP already back), and ADP leaves past the ATP tag instead of round the frame's top edge). */
function prk(a: Api, t: number, tE: number, to: V, k: { atp: string; rubp: string; adp: string }): void {
  if (t < tE - 0.8) return;
  if (t < tE + 0.25) a.put(k.atp, peel(path(WAY.regenAtp), t, tE - 0.8, tE), 1 - ease(t, tE - 0.02, tE + 0.18));
  if (t > tE - 0.12 && t < tE + 0.45) a.put('fl', G.prk, life(t, tE - 0.12, tE, tE + 0.08, tE + 0.45));
  if (t < tE) return;
  a.put(k.rubp, glide(path([G.prk, G.prkFrom, G.prkTo, [to[0] + 30, G.prkTo[1]], to]), t, tE + 0.05, tE + 1.2), ease(t, tE, tE + 0.18), lerp(1, PILE, ease(t, tE + 0.3, tE + 1.2)));
  if (t < tE + 1.5) a.put(k.adp, glide(path(ADP_OUT), t, tE + 0.1, tE + 1.5), ease(t, tE, tE + 0.18) * (1 - ease(t, tE + 0.8, tE + 1.5)), 0.8);
}

/* ---------------------------------------------------------------- the frame */

/** Beat 1: ¹⁴CO₂ in from below. */
function beat1(a: Api, t: number): void {
  a.put('c14', glide(path([CO2_FROM, add(AT.co2(0), [-12, 90]), AT.co2(0)]), t, B1.co2[0], B1.co2[1]), ease(t, B1.co2[0], B1.co2[0] + 0.3));
}
/** Beat 2: (A) the label shows up in 3-PGA; (B) 3 CO₂ + 3 RuBP → 6 3-PGA. */
function beat2(a: Api, t: number): void {
  // (A) the ¹⁴CO₂ goes as the strip's 3-PGA place takes the glow; both go when step B starts
  a.put('c14', AT.co2(0), 1 - ease(t, B2.label, B2.label + 0.5));
  a.put('p14', G.pga, ease(t, B2.label, B2.label + 0.5) * (1 - ease(t, B0, B0 + 0.4)));
  a.lit('pga', ease(t, B2.ring - 0.1, B2.ring + 0.4));
  a.lit('rubisco', ease(t, B0, B0 + 0.6)); a.lit('carbox', ease(t, B0, B0 + 0.6));
  // (B) the inputs, then 3 carboxylations
  for (let k = 0; k < 3; k++) {
    const [c0, c1] = CO2_T(k), cb = CARB(k), key = { rb: `r${k + 1}`, g: `c${k + 1}`, a: `p${2 * k + 1}`, b: `p${2 * k + 2}` };
    if (t < c0) continue;
    if (t < cb.t0) {
      a.put(key.g, glide(path([CO2_FROM, add(AT.co2(k), [-12, 60]), AT.co2(k)]), t, c0, c1), ease(t, c0, c0 + 0.25), PILE);
      a.put(key.rb, AT.rubp(k), ease(t, RUBP_IN[0], RUBP_IN[1]), PILE);
    }
    const [pa, pb] = PGA_ROW(k);
    carb(a, t, { ...cb, co2: AT.co2(k), rubp: AT.rubp(k), to: [AT.pga(pa), AT.pga(pb)], k: { ...key, a: `p${pa + 1}`, b: `p${pb + 1}` } });
  }
}
/** Beat 3: each 3-PGA with 1 ATP and 1 NADPH into GAPDH: 6 triose phosphates. */
function beat3(a: Api, t: number): void {
  for (let j = 0; j < 6; j++) {
    const i = PLACE(j);
    if (t < RED(j).t0) a.put(`p${i + 1}`, AT.pga(i), 1, PILE);
    reduce(a, t, RED(j).t0, RED(j).d, AT.pga(i), AT.tp(i), { ...RED_K(j + 1), pga: `p${i + 1}`, tp: `t${i + 1}` });
  }
}
/** Beat 4: 5 triose phosphates into PRK; 3 ATP; 3 RuBP back under RuBisCO; the 6th out through TPT. */
function beat4(a: Api, t: number): void {
  BACK_J.forEach((j, k) => {
    const [t0, t1] = TO_PRK(k);
    if (t < t0) a.put(`t${j + 1}`, AT.tp(j), 1, PILE);
    else intoPrkN(a, t, t0, t1, AT.tp(j), `t${j + 1}`);
  });
  const out = `t${OUT_J + 1}`;
  if (t < OUT_T[0]) a.put(out, AT.tp(OUT_J), 1, PILE);
  else a.put(out, glide(path([AT.tp(OUT_J), ...WAY.export.slice(0, 2), AT.tpt]), t, OUT_T[0], OUT_T[1]), 1, PILE + (0.85 - PILE) * ease(t, OUT_T[0], OUT_T[0] + 0.6));
  for (let m = 0; m < 3; m++) prk(a, t, PRK_T(m), AT.rubp(RUBP_BACK(m)), { atp: `ra${m + 1}`, rubp: `nr${m + 1}`, adp: `rd${m + 1}` });
}

function frame(a: Api, beat: number, t: number): void {
  a.pos('site', SITE); a.op('site', beat === 0 ? 0 : beat === 1 ? ease(t, B0, B0 + 0.6) : 1);
  a.pos('l-co2', add(G.co2, [0, -24])); a.pos('l-rubp', add(AT.rubp(0), [-69, 6])); a.pos('l-tp', add(G.tp, [88, -13]));
  if (beat === 0) beat1(a, t);
  else if (beat === 1) beat2(a, t);
  else if (beat === 2) beat3(a, t);
  else if (beat === 3) beat4(a, t);
  else { for (let m = 0; m < 3; m++) a.put(`nr${m + 1}`, AT.rubp(RUBP_BACK(m)), 1, PILE); a.put(`t${OUT_J + 1}`, AT.tpt, 1, 0.85); }
  // the piles' names (the strip's own are left out where the piles sit)
  a.op('l-co2', beat === 1 ? ease(t, CO2_T(0)[0], CO2_T(0)[0] + 0.4) * (1 - ease(t, tmOf(2), tmOf(2) + 0.4)) : 0);
  a.op('l-rubp', beat === 1 ? ease(t, RUBP_IN[0], RUBP_IN[1]) * (1 - ease(t, CARB(2).t0 + 0.3, CARB(2).t0 + 0.8))
    : beat === 3 ? ease(t, PRK_T(0) + 0.6, PRK_T(0) + 1.0) : beat === 4 ? 1 : 0);
  a.op('l-tp', beat === 2 ? ease(t, RED(0).t0 + 1.2, RED(0).t0 + 1.6) : beat === 3 ? 1 - ease(t, OUT_T[0], OUT_T[0] + 0.4) : 0);
  // the cards (beats 1 and 2) and the line (beats 4 and 5)
  a.op('c-lol', beat === 0 ? ease(t, B1.card, B1.card + 0.6) : beat === 1 ? 1 - ease(t, 0, 0.4) : 0);
  a.op('c-film', beat === 1 ? ease(t, B2.film, B2.film + 0.6) * (1 - ease(t, B0, B0 + 0.4)) : 0);
  a.op('c-ring', beat === 1 ? ease(t, B2.ring, B2.ring + 0.4) : 0);
  a.op('ln', beat === 3 ? ease(t, LINE_T, LINE_T + 0.4) : beat === 4 ? 1 : 0);
  a.op('ln-why', beat === 3 ? 1 : beat === 4 ? 1 - ease(t, 0, 0.3) : 0);
  a.op('ln-used', beat === 4 ? ease(t, 0.25, 0.6) : 0);
}

/** The thylakoid stays lit; the light wave is lit in beats 1 and 5 only (in beats 2 and 3 the 3-PGA pile sits on its tip). */
const LIT: Part[][] = [
  ['co2', 'light', 'thyl'],
  ['co2', 'pga', 'rubisco', 'carbox', 'thyl'],
  ['pga', 'supply', 'reduce', 'tp', 'thyl'],
  ['supply', 'tp', 'regen', 'export', 'thyl'],
  ['co2', 'rubisco', 'carbox', 'pga', 'supply', 'reduce', 'tp', 'regen', 'export', 'light', 'thyl'],
];
/** The strip's ATP tag of NH₃ refixation (photorespiration, never lit here) sits on the frame's bottom edge: left out. */
const NH3_ATP = `<g class="chn-g">${tagG(SPOT.nh3Atp[0], SPOT.nh3Atp[1], 'ATP', 'atp')}</g>`;

export const STAGING_BASE = makeStaging({
  id: 'k2',
  name: 'k2 · The strip, with the story',
  note: 'The 5 beats on the dark-reaction strip, plain unnumbered carbons: the lollipop; the 5 s film, the label in 3-PGA, then 3 CO₂ + 3 RuBP → 6 3-PGA; 6 reductions with 6 ATP and 6 NADPH; "3 RuBP = 15 C = 5 × 3 C", 5 triose phosphates → 3 RuBP with 3 ATP, 1 out through TPT; "per 3 CO₂: 9 ATP + 6 NADPH used"',
  holds: [[], [B2.hold], [], [], []],
  drop: [NH3_ATP], dropGlyph: ['co2', 'rubisco', 'pga', 'tp'], dropName: ['co2', 'rubisco', 'tp'],
  actors: ACTORS,
  world: () => `${siteRing('site', '')}${pileName('l-co2', 'CO₂')}${pileName('l-rubp', 'RuBP', 'end')}${pileName('l-tp', 'triose phosphate', 'start')}`,
  hud: p => `${cards(p)}${lineSvg()}`,
  cam0: CYCLE_VIEW, cams: [CYCLE_VIEW, CYCLE_VIEW, CYCLE_VIEW, CYCLE_VIEW, CYCLE_VIEW], camT: [[0, 1], [0, 1], [0, 1], [0, 1], [0, 1]],
  lit: LIT,
  frame,
});

/** Each beat's key line and the closing question, big on the stage (lecturer, 29 Oct 2026: "people don't read the
 *  text under the animation"). */
export const STAGING = withKeys(STAGING_BASE, [
  { beat: 1, lines: ['First product: 3-PGA'], x: 1370, y: 300, size: 38, at: 1.0 },
  { beat: 2, lines: ['ATP and NADPH make', 'triose phosphate'], x: 1370, y: 300, size: 36, at: 1.0 },
  { beat: 3, lines: ['3 RuBP = 15 C = 5 × 3 C'], x: 1370, y: 330, size: 34, at: 0.6, hide: ['[data-k="ln"]'] },
  { beat: 4, lines: ['Where does the triose', 'phosphate that leaves', 'the cycle go?'], x: 800, y: 328, size: 36, at: 1.0 },
]);

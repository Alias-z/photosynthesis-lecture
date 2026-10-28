// The CO₂ diffusion pathway (slide C10): the camera tour on the slide's drawn path (C10 v2, figs/cp10.ts draw('v2') =
// pathSchema with values), shared by stagings A and B (cp10-a, cp10-b), plus the concentration readout that stagings C
// and D reuse. The stage IS the slide figure: its ids are renamed for the stage, its parts tagged by exact markup, and
// each conductance is lit in turn with the slide's own lit sets (LIT in cp-stage.ts: boundary layer; stomata = C10 v11;
// mesophyll = C10 v12), dimmed parts at the slide's 0.22.
// The story's pieces on the figure (figure units):
// - one CO₂ (the tracer, a copy of the slide's top-left CO₂ at 70, 150) walks the path: to the leaf surface, through the
//   pore, across the air space, and, slowed, across wall, cytosol and stroma to RuBisCO (606, 272);
// - wind: three streaks down the outside air; the boundary layer (the slide's band x 150–237, its dashed edge, its label
//   and its g_b bracket) thins to x 200–237 and comes back as the camera leaves; C_s rises on the readout;
// - water: eight H₂O leave through the pore along the slide's water arrow (y 288) and stay in the outside air;
// - closing: the guard cells (the slide's, at y 238 and 322) move to 254 and 306, the CO₂ and water arrows thin, the values
//   300 and 200 give way to ↓, and the readout's Cᵢ and C_c bars fall.
// The readout (stage units, top right): CO₂ at Cₐ, Cₛ, Cᵢ, C_c as bars, values 420, 300, 200 (Busch et al. 2024, Table 1);
// C_s has no value (drawn at 405, as C10 v3); the wind's C_s (415) and the closed stomata's Cᵢ and C_c (230, 150) are drawn
// schematically and carry no number.
import './cp10-common.css';
import { draw as c10 } from '../figs/cp10';
import { co2, h2o } from '../figs/cp-kit';
import {
  beatClock, clipDefs, counterTexts, f1, FULL, lerp, lerpV, LIT, litMix, mark, mv, pathLit, pulseAt, setters, smooth, stagePill,
  cardSvg, figInner, tfStr, tw, tween, view, type Lit, type Setters, type Tf, type V,
} from './cp-stage';
import type { Beat, Staging } from './types';

/* ---------------------------------------------------------------- the slide figure, tagged */

const TOP = 110, BOT = 450, YP = 280, YC = 272, YW = 288;
export function pathScene(P: string, sc: string): string {
  let s = figInner(c10('v2'), 'cp10v2', `${P}${sc}v2`);
  s = mark(s, `<rect x="150" y="${TOP}" width="87"`, `${sc}-blr`);
  s = mark(s, `<path class="fcp-dash" d="M150,${TOP}`, `${sc}-bld`);
  s = mark(s, '<text class="fcp-z" x="194.0"', `${sc}-bll`);
  s = mark(s, '<path class="fcp-brace" d="M152.0', `${sc}-blb`);
  s = mark(s, '<text class="fcp-sym" x="193.5"', `${sc}-blbt`);
  s = mark(s, '<ellipse class="fcp-guard"', `${sc}-gu`);
  s = mark(s, '<ellipse class="fcp-guard"', `${sc}-gd`);
  s = mark(s, '<path class="fcp-ar fcp-ar-co2 fcp-ar-big"', `${sc}-aco2`);
  s = mark(s, '<path class="fcp-ar fcp-ar-h2o fcp-ar-big"', `${sc}-ah2o`);
  s = mark(s, '<text class="fcp-s" x="376.0" y="520.0"', `${sc}-v300`);
  s = mark(s, '<text class="fcp-s" x="664.0" y="520.0"', `${sc}-v200`);
  const streak = (i: number): string => `<path data-k="${sc}-wind${i}" class="cp10-wind" d="M0,0 q7,14 0,28 q-7,14 0,28 q7,14 0,28" opacity="0"/>`;
  const over = `
    <text data-k="${sc}-dn300" class="cp10-dn" x="376" y="520" text-anchor="middle" opacity="0">↓</text>
    <text data-k="${sc}-dn200" class="cp10-dn" x="664" y="520" text-anchor="middle" opacity="0">↓</text>
    ${[0, 1, 2].map(streak).join('')}
    ${[0, 1, 2, 3, 4, 5, 6, 7].map(i => `<g data-k="${sc}-w${i}" opacity="0">${h2o(0, 0, 8)}</g>`).join('')}
    <text data-k="${sc}-windl" class="fcp-z" x="96" y="132" text-anchor="middle" opacity="0">wind</text>
    <g data-k="${sc}-tr" opacity="0"><circle data-k="${sc}-trr" class="cp10-ring" r="26"/><g class="cp10-tracer">${co2(0, 0, 11)}</g></g>`;
  return `${cardSvg(`${P}${sc}`)}<g data-k="${sc}-schema">${s}</g>${over}`;
}

/* ---------------------------------------------------------------- views */

export type ViewKey = 'full' | 'bl' | 'st' | 'me';
export const VIEWS: Record<ViewKey, Tf> = {
  full: FULL,
  bl: view(2.1, [196, 280], [560, 392]),
  st: view(2.2, [262, 280], [440, 380]),
  me: view(1.9, [560, 285], [700, 380]),
};
export type LitKey = 'all' | 'bl' | 'st' | 'me';
const GLOW: Record<LitKey, number> = { all: 0, bl: 1, st: 1, me: 1 };

/* ---------------------------------------------------------------- the concentration readout (stage units) */

export const RO_BARS = { ca: 420, cs: 405, ci: 300, cc: 200, csWind: 415, ciClosed: 230, ccClosed: 150 };
const SY = (s: string): string => `<tspan font-style="italic">C</tspan><tspan baseline-shift="sub" font-size="70%">${s}</tspan>`;
/** The readout card, 300 × 260 at x, y: one bar per concentration. */
export function concSvg(k: string, x: number, y: number): string {
  const cols: Array<[string, string, string]> = [['ca', 'a', '420'], ['cs', 's', ''], ['ci', 'i', '300'], ['cc', 'c', '200']];
  return `<g data-k="${k}"><rect class="cps-rcard" x="${x}" y="${y}" width="300" height="262" rx="16"/>
    <text class="cps-sub" x="${x + 150}" y="${y + 32}" text-anchor="middle">CO₂ (µmol mol⁻¹)</text>
    ${cols.map(([kk, sub, v], i) => {
      const bx = x + 26 + i * 66;
      return `<rect data-k="${k}-hl-${kk}" class="cp10-hl" x="${bx - 6}" y="${y + 46}" width="56" height="${180}" rx="8" opacity="0"/>
        <rect data-k="${k}-${kk}" class="cp10-bar" x="${bx}" y="0" width="44" height="0" rx="3"/>
        ${v ? `<text data-k="${k}-t-${kk}" class="cps-val" x="${bx + 22}" y="0" text-anchor="middle">${v}</text>` : ''}
        <text class="cps-sym" x="${bx + 22}" y="${y + 252}" text-anchor="middle">${SY(sub)}</text>`;
    }).join('')}
 <text data-k="${k}-up-cs" class="cp10-dn2" x="${x + 26 + 66 + 22}" y="0" text-anchor="middle" opacity="0">↑</text>
    <text data-k="${k}-dn-ci" class="cp10-dn2" x="${x + 26 + 2 * 66 + 22}" y="0" text-anchor="middle" opacity="0">↓</text>
    <text data-k="${k}-dn-cc" class="cp10-dn2" x="${x + 26 + 3 * 66 + 22}" y="0" text-anchor="middle" opacity="0">↓</text>
    <path class="cps-axis" d="M${x + 16},${y + 222} H${x + 284}"/></g>`;
}
export interface ConcState { cs: number; ci: number; cc: number; down: number; up?: number; hl: Partial<Record<'ca' | 'cs' | 'ci' | 'cc', number>> }
export function concCtl(S: Setters, k: string, y: number): (o: ConcState) => void {
  const { q, set, op } = S;
  const H = (c: number): number => (c / 420) * 150;
  const bar = (kk: string, c: number, val = 1): void => {
    const el = q(`${k}-${kk}`), h = H(c);
    set(el, 'y', f1(y + 222 - h)); set(el, 'height', f1(h));
    const t = q(`${k}-t-${kk}`);
    if (t) { set(t, 'y', f1(y + 222 - h - 8)); op(t, val); }
    const dn = q(`${k}-dn-${kk}`);
    if (dn) { set(dn, 'y', f1(y + 222 - h - 8)); op(dn, 1 - val); }
  };
  return o => {
    bar('ca', RO_BARS.ca); bar('cs', o.cs);
    const up = q(`${k}-up-cs`);
    set(up, 'y', f1(y + 222 - H(o.cs) - 8)); op(up, o.up ?? 0); bar('ci', o.ci, 1 - o.down); bar('cc', o.cc, 1 - o.down);
    (['ca', 'cs', 'ci', 'cc'] as const).forEach(kk => op(q(`${k}-hl-${kk}`), o.hl[kk] ?? 0));
  };
}
/** The pair of concentrations across each conductance. */
export const ACROSS: Record<LitKey, Partial<Record<'ca' | 'cs' | 'ci' | 'cc', number>>> = {
  all: {}, bl: { ca: 1, cs: 1 }, st: { cs: 1, ci: 1 }, me: { ci: 1, cc: 1 },
};

/* ---------------------------------------------------------------- one drawn path on the stage: its controls */

export interface SceneCtl {
  lit: (w: Lit, glow: number, extra?: Partial<Record<'air' | 'bl' | 'st' | 'ias' | 'me' | 'h2o' | 'co2', number>>) => void;
  /** The boundary layer thinned by thin (0 → 1); streaks for tW seconds into the gust (−1: none); k: the text scale. */
  wind: (thin: number, tW: number, k: number) => void;
  /** Water leaving through the pore, t seconds into the stream (−1: none). */
  water: (t: number) => void;
  /** The stomata closing (0 → 1). */
  close: (cl: number) => void;
  tracer: (pos: V | null, o: number, k: number) => void;
}
/** The controls of the path scene sc (pathScene(P, sc)), its texts counter-scaled under root. */
export function sceneCtl(S: Setters, sc: string, root: Element): SceneCtl {
  const { q, set, op } = S;
  const lit = pathLit(q(`${sc}-schema`), S), texts = counterTexts(root, S);
  const blr = q(`${sc}-blr`), bld = q(`${sc}-bld`), bll = q(`${sc}-bll`), blb = q(`${sc}-blb`), blbt = q(`${sc}-blbt`);
  const gu = q(`${sc}-gu`), gd = q(`${sc}-gd`), aco2 = q(`${sc}-aco2`), ah2o = q(`${sc}-ah2o`), tr = q(`${sc}-tr`);
  return {
    lit,
    wind(thin, tW, k) {
      const x0 = lerp(150, 200, thin);
      set(blr, 'x', f1(x0)); set(blr, 'width', f1(237 - x0)); set(bld, 'd', `M${f1(x0)},${TOP} V${BOT}`);
      set(blb, 'd', `M${f1(x0 + 2)},98.0 V88.0 H235.0 V98.0`);
      texts(k, new Map([[bll, (x0 - 150) / 2], [blbt, (x0 - 150) / 2]]));
      [0, 1, 2].forEach(i => {
        const u = (tW - 0.9 - i * 0.12) / 1.0, el = q(`${sc}-wind${i}`);
        op(el, u > 0 && u < 1 ? Math.sin(Math.PI * u) : 0);
        set(el, 'transform', `translate(${[58, 94, 128][i]} ${f1(lerp(100, 380, Math.max(0, Math.min(1, u))))})`);
      });
      op(q(`${sc}-windl`), tW >= 0 ? tw(tW, 0.9, 1.1) * (1 - tw(tW, 2.0, 2.2)) : 0);
    },
    water(t) {
      // each leaves the air space along the arrow, passes the pore and stays in the outside air (two rows of four)
      for (let i = 0; i < 8; i++) {
        const u = Math.max(0, Math.min(1, (t - 0.2 - i * 0.2) / 1.0)), el = q(`${sc}-w${i}`);
        op(el, t >= 0 && t - 0.2 - i * 0.2 > 0 ? Math.min(1, 5 * u) : 0);
        const xe = 46 + (i % 4) * 30, ye = YW - 34 + Math.floor(i / 4) * 64;
        const x = lerp(430 - (i % 3) * 18, xe, u), y = lerp(YW + 8, ye, smooth((u - 0.72) / 0.28));
        set(el, 'transform', `translate(${f1(x)} ${f1(y)})`);
      }
    },
    close(cl) {
      set(gu, 'cy', f1(lerp(238, 254, cl))); set(gd, 'cy', f1(lerp(322, 306, cl)));
      const st = cl > 0.001 ? `stroke-width:${f1(lerp(5, 1.6, cl))};opacity:${lerp(1, 0.55, cl).toFixed(2)}` : '';
      set(aco2, 'style', st); set(ah2o, 'style', st);
      op(q(`${sc}-v300`), 1 - cl); op(q(`${sc}-v200`), 1 - cl); op(q(`${sc}-dn300`), cl); op(q(`${sc}-dn200`), cl);
    },
    tracer(pos, o, k) {
      op(tr, o);
      set(q(`${sc}-trr`), 'r', (26 * k).toFixed(1));
      if (pos) set(tr, 'transform', `translate(${f1(pos[0])} ${f1(pos[1])})`);
    },
  };
}

/* ---------------------------------------------------------------- the tour */

/** Where the tracer is at the end of each step of its walk (figure units). */
export const TR = {
  air: [70, 150] as V, surface: [222, YC] as V, pore: [300, YC] as V, space: [372, YC] as V, wall: [466, YC] as V, rubisco: [598, YC] as V,
};
export interface Plan {
  id: string; name: string; note: string; beats?: Beat[]; P: string;
  /** Per beat: the view and the lit set at the end of the beat (the camera moves in the first second). */
  cam: ViewKey[]; lit: LitKey[];
  /** Per beat: the tracer's place at the end of the beat, or null when it is hidden. */
  tracer: Array<V | null>;
  /** The beat of each event (absent: never). */
  ev: { brackets?: number; wind?: number; water?: number; slow?: number; close?: number };
  /** Per beat: the stage cards shown (keys of cardsSvg's groups); each appears at 0.9 s and leaves as the next beat starts. */
  cards: string[][];
  /** The stage cards' markup (portraits, clippings, insets, pills); its groups carry data-k and start hidden. */
  cardsSvg: (P: string) => string;
}
const RO = { x: 1286, y: 22 };
/** The camera's scenes end left of the readout column (stage x < 1268), so the readout never sits on the figure. */
export const sceneClip = (P: string): string => `<defs><clipPath id="${P}-scene"><rect x="0" y="0" width="1268" height="740"/></clipPath></defs>`;

export function tourStaging(o: Plan): Staging {
  const n = o.cam.length, P = o.P;
  const TEND = o.cam.map((_, b) => Math.max(1.3,
    o.ev.brackets === b ? 1.6 : 0, o.ev.wind === b ? 2.2 : 0, o.ev.water === b ? 2.7 : 0, o.ev.slow === b ? 3.0 : 0,
    o.ev.close === b ? 2.2 : 0, o.tracer[b] && o.tracer[b - 1] !== o.tracer[b] ? 1.9 : 0));
  return {
    id: o.id, name: o.name, note: o.note, beats: o.beats,
    svg: () => `${clipDefs(P)}
      ${sceneClip(P)}<g clip-path="url(#${P}-scene)"><g data-k="cam"><g class="fig">${pathScene(P, 'p')}</g></g></g>
      ${o.cardsSvg(P)}
      ${concSvg('ro', RO.x, RO.y)}`,
    bind(stage) {
      const S = setters(stage), { q, set, op } = S;
      const sc = sceneCtl(S, 'p', q('cam')), ro = concCtl(S, 'ro', RO.y);
      const cardKeys = [...new Set(o.cards.flat())];
      let last = '';
      return (beatIn, t) => {
        const b = Math.max(0, Math.min(n - 1, Math.round(beatIn))), tt = Math.max(0, Math.min(t, TEND[b]));
        const key = `${b}:${tt.toFixed(3)}`;
        if (key === last) return;
        last = key;
        const T = beatClock(b, tt);
        const at = (e?: number): number => (e === undefined ? -1 : T(e));

        /* camera and lit set: from the previous beat's to this beat's in the first second */
        const e = mv(tt, 0, 1.0), prev = Math.max(0, b - 1);
        const v0 = VIEWS[o.cam[b === 0 ? 0 : prev]], v1 = VIEWS[o.cam[b]];
        const cam = tween(v0, v1, b === 0 ? 1 : e);
        set(q('cam'), 'transform', tfStr(cam));
        const k = (cam.s / FULL.s) ** -0.7;
        const l0 = o.lit[b === 0 ? 0 : prev], l1 = o.lit[b], le = b === 0 ? 1 : tw(tt, 0, 0.8);
        const litNow: Lit = litMix(LIT[l0], LIT[l1], le);
        // the brackets beat: each conductance flashes in turn
        const tb = at(o.ev.brackets);
        const flash = { bl: pulseAt(tb, 0.2, 0.45), st: pulseAt(tb, 0.6, 0.45), me: pulseAt(tb, 1.0, 0.45) };
        sc.lit(litNow, lerp(GLOW[l0], GLOW[l1], le), flash);
        const hl0 = ACROSS[l0], hl1 = ACROSS[l1];
        const hl = Object.fromEntries((['ca', 'cs', 'ci', 'cc'] as const).map(k => [k, lerp(hl0[k] ?? 0, hl1[k] ?? 0, le)]));

        /* wind: the boundary layer thins, then recovers as the camera leaves */
        const wb = o.ev.wind ?? -9, tW = b === wb ? tt : -1;
        const thin = b === wb ? tw(tt, 1.0, 1.8) : b === wb + 1 ? 1 - tw(tt, 0, 0.8) : 0;
        sc.wind(thin, tW, k);
        sc.water(b === o.ev.water ? tt : -1);
        const cl = tw(at(o.ev.close), 1.2, 2.0);
        sc.close(cl);
        ro({ up: thin, cs: lerp(RO_BARS.cs, RO_BARS.csWind, thin), ci: lerp(RO_BARS.ci, RO_BARS.ciClosed, cl), cc: lerp(RO_BARS.cc, RO_BARS.ccClosed, cl), down: cl, hl });

        /* the tracer */
        const here = o.tracer[b], before = b > 0 ? o.tracer[b - 1] : here;
        let pos: V | null = null, tro = 0;
        if (here && before) {
          if (b === o.ev.slow) {
            const u1 = mv(tt, 1.0, 0.4), u2 = mv(tt, 1.4, 1.6);
            pos = tt < 1.4 ? lerpV(before, TR.wall, u1) : lerpV(TR.wall, here, u2);
          } else if (b === o.ev.wind) {
            pos = lerpV(before, here, mv(tt, 1.2, 1.0));
          } else pos = lerpV(before, here, mv(tt, 0.8, 1.0));
          tro = 1;
        } else if (before && !here) { pos = before; tro = 1 - tw(tt, 0, 0.3); }
        else if (here && !before) { pos = here; tro = tw(tt, 1.2, 1.5); }
        if (o.ev.brackets === b && here) tro = tw(tt, 1.4, 1.6);
        sc.tracer(pos, tro, k);

        /* stage cards */
        cardKeys.forEach(k => {
          const on = o.cards[b].includes(k) ? (b > 0 && o.cards[b - 1].includes(k) ? 1 : tw(tt, 0.9, 1.1)) : 0;
          const was = b > 0 && o.cards[b - 1].includes(k) && !o.cards[b].includes(k) ? 1 - tw(tt, 0, 0.2) : 0;
          op(q(k), Math.max(on, was));
        });
      };
    },
  };
}

/* ---------------------------------------------------------------- stage cards shared by the tours */

export const countPill = (): string => stagePill('cnt', 440, 668, '150 to over 500 H₂O per CO₂', 'h2o');
export const slowPill = (): string => stagePill('slow', 960, 668, 'in water: ≈ 10,000 × slower', 'co2');

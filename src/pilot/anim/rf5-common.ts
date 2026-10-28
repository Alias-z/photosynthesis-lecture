// RuBisCO: carboxylation and oxygenation, on the slide C5 schema (script: REPORT_rf.md, C5, tightened in beats-rf56.ts):
// the story the rf5 stagings share. The stage IS a slide C5 figure: schemaSvg(look, LIT_C5) of figs/rf-schema.ts, as
// figs/rff05.ts draws it (v1 thesis, v2 glow, v3 pdb), in the slide's figure card (rf56-kit.ts). The camera zooms into
// RuBisCO, the story plays there, and the camera zooms back out to the whole schema, which ends as on the slide with
// 2-phosphoglycolate ringed and glycolate (the next slide's first step) starting to light.
//
// Events (each staging plays them in its own order and with its own camera; one per beat):
// - carbox: a CO₂ molecule leaves the schema's CO₂ and reaches RuBP; two PGA go up the carboxylation arrow to PGA.
// - oxy: the camera dives into RuBisCO, whose box cross-fades into our render of spinach RuBisCO (PDB 8RUC, the slide's
//   v3/v5 image) with one active site marked; RuBP sits in it and an O₂ molecule enters (hold). Then back out: the
//   render gives way to the box, and 2-phosphoglycolate + PGA go up the oxygenation arrow; the PGA goes on to PGA.
// - forr: Forrester, Krotkov & Nelson 1966, Fig. 2 (soybean, CO₂ uptake against O₂), as a clipping on the right.
// - bowes: Bowes, Ogren & Hageman 1971, the paper's title as a clipping on the right.
// - temp: a thermometer runs from 5 to 40 °C; the CO₂/O₂ specificity of spinach RuBisCO reads ≈ 160 at 5 °C and ≈ 50
//   at 40 °C (Jordan & Ogren 1984; no values between are shown); on the schema the oxygenation arrows thicken and
//   the carboxylation arrow thins (qualitative: oxygenation rises relative to carboxylation).
// - scarbox, soxy, tally: the same reactions told inside the structure (staging C starts deep inside the pdb look's
//   own RuBisCO render): RuBP in the active site, CO₂ (or O₂) enters; then four molecules arrive one after another,
//   3 CO₂ and 1 O₂, as ≈ 1 oxygenation per 3 carboxylations in air at 25 °C (Flamholz et al. 2019, spinach RuBisCO).
// - out: back to the whole schema; 2-phosphoglycolate is ringed; glycolate starts to light (60 %).
// Positions are those of the drawing (rf-schema.ts GEO and its arrows); the render's active site is the anchor of
// assets/rf/rubisco-8ruc.json (sites[0], the front one), as figs/rff05.ts v5 uses it.
import rubPng from '../../assets/rf/rubisco-8ruc.png';
import forrPng from '../../assets/rf/forrester1966-fig2.png';
import sageJpg from '../../assets/rf/sage2012-fig4.jpg';
import { GEO, LIT_C5, type Look } from '../figs/rf-schema';
import { f1, lerp, lerpV, smooth, tw, type V } from './antenna-common';
import {
  atoms, B, camera, chip, glyph, kit, mv, panel, paper, pentagon, pulse, sceneSvg, stageSvg, T, view, walker,
  type Move, type Tf,
} from './rf56-kit';
import type { Beat, Staging } from './types';

/* ---------------------------------------------------------------- geometry (figure units) */

const RUBP: V = [GEO.rubp[0], GEO.rubp[1] + 3];
const RUB_C: V = [GEO.rub[0], GEO.rub[1] + 4];
const PGA: V = GEO.pga, OX: V = [GEO.ox[0], GEO.ox[1] + 7];
/** The render as it replaces RuBisCO's box (looks thesis, glow): 150 wide, centred under RuBP. */
const RW = 150, RH = RW * 471 / 548, RX = RUB_C[0] - RW / 2, RY = 441.5;
/** The front active site of the render (rubisco-8ruc.json sites[0]), in that placement and in the pdb look's own
 *  placement (rf-schema.ts rubiscoShape: 104 wide at x − 52, y − 22). */
const SITE_A: V = [RX + (317.6 / 548) * RW, RY + (309.5 / 471) * RH];
const PW = 104, PH = PW * 471 / 548;
const SITE_P: V = [GEO.rub[0] - 52 + (317.6 / 548) * PW, GEO.rub[1] - 22 + (309.5 / 471) * PH];

/** Camera views. Z1: RuBisCO, RuBP, the two gases and both products, the stage's right third free for a card.
 *  Z2: into RuBisCO (its render fills the left two thirds). Z3: inside the pdb look's render. */
export const Z1: Tf = view(2.3, [362, 452], [560, 370]);
export const Z2: Tf = view(4.4, [RUB_C[0], 506], [560, 370]);
/** Z2 centred on the stage (no card beside it). */
export const Z2C: Tf = view(4.4, [RUB_C[0], 506], [800, 370]);
export const Z3: Tf = view(5.6, [330, 521], [600, 380]);
/** Z3 centred on the stage (no card beside it). */
export const Z3C: Tf = view(5.6, [330, 521], [800, 380]);
export { B };
export { BL } from './rf56-kit';

/* ---------------------------------------------------------------- paths */

const CO2_IN = walker([GEO.co2, [270, 534], [298, 492], RUBP]);
const O2_IN = (site: V): ((u: number) => V) => walker([GEO.o2, [370, 548], [site[0] + 22, site[1] + 10], site]);
const CO2_SITE = (site: V): ((u: number) => V) => walker([GEO.co2, [276, 556], [site[0] - 24, site[1] + 6], site]);
const UP_CARBOX = walker([[RUBP[0] + 9, RUBP[1] - 34], [RUBP[0] + 9, 380], [PGA[0] + 9, PGA[1] + 26]]);
const UP_OXY = walker([[RUBP[0] + 26, RUBP[1] - 12], [GEO.rub[0] + 44, 432], [GEO.ox[0] - 70, GEO.ox[1] + 18]]);
/** The PGA of oxygenation rides 22 units above 2-phosphoglycolate, then follows the schema's thin arrow to PGA. */
const RIDE = -22;
const TO_PGA = walker([[GEO.ox[0] - 70, GEO.ox[1] + 18 + RIDE], [372, 356], [PGA[0] + 30, PGA[1] + 12]]);

/* ---------------------------------------------------------------- timing (s into each event) */

const E = {
  carbox: { co2: 1.2, co2D: 0.9, flash: 2.1, up: 2.25, upD: 1.0, lag: 0.28, end: 4.25 },
  oxy: { fade: [0.55, 1.05] as V, site: 1.05, rubp: 1.2, o2: 1.35, o2D: 0.9, hold: 2.4, flash: 2.45, back: [2.55, 3.15] as V, up: 3.2, upD: 0.8, on: 4.05, onD: 0.7, end: 5.45 },
  forr: { end: 0.6 },
  sage: { end: 0.6 },
  bowes: { end: 0.6 },
  temp: { show: 0.1, t0: 0.55, rise: 1.5, end: 2.4 },
  scarbox: { site: 0.1, rubp: 0.25, co2: 0.45, co2D: 0.85, flash: 1.3, up: 1.45, upD: 0.9, end: 2.8 },
  soxy: { rubp: 0.1, o2: 0.3, o2D: 0.85, flash: 1.15, up: 1.3, upD: 0.9, end: 2.7 },
  tally: { show: 0.1, t: [0.45, 1.15, 1.85, 2.55], d: 0.55, end: 3.9 },
  out: { ring: 1.25, lit: 1.5, end: 2.4 },
};
export type Ev = keyof typeof E;
/** How lit glycolate gets at the end: it starts to light. */
const NEXT_LIT = 0.6;

/* ---------------------------------------------------------------- overlay glyphs (figure units, round their origin) */

/** A gas as the deck's glyph set draws it in every look (GLYPH_BRIEF): atom balls, its name in ink beside. */
function gasGlyph(_look: Look, atomsOf: string, _label: string, angle: number, lab: string): string {
  return `${atoms(atomsOf, angle)}${lab}`;
}

function overSvg(p: string, look: Look): string {
  const pdb = look === 'pdb';
  return `
    <rect data-k="veil" class="rf-veil" x="-60" y="-40" width="980" height="700" style="display:none"/>
    ${pdb ? glyph('render', `<image href="${rubPng}" x="${GEO.rub[0] - 52}" y="${GEO.rub[1] - 22}" width="${PW}" height="${f1(PH)}"/>`)
    : glyph('render', `<image href="${rubPng}" x="${f1(RX)}" y="${RY}" width="${RW}" height="${f1(RH)}"/>`)}
    ${glyph('rub-l', `${T(0, 0, 'RuBisCO', 'rf-lab', 'end')}${T(0, 26, 'PDB 8RUC', 'rf-sub', 'end')}`)}
    ${glyph('site', '<circle class="rf-site" r="1"/>')}
    ${glyph('site-l', `<rect class="rf-pillbg" x="-62" y="-17" width="124" height="34" rx="17"/>${T(0, 7, 'active site', 'rf-lab', 'middle')}`)}
    ${glyph('flash', `<circle r="34" fill="url(#${p}-fl)"/>`)}
    ${glyph('srubp', pentagon(20))}
    ${glyph('co2', gasGlyph(look, 'OCO', 'CO₂', -18, T(-40, 16, 'CO₂', 'rfs-gas', 'end')))}${glyph('o2', gasGlyph(look, 'OO', 'O₂', 18, T(30, 20, 'O₂', 'rfs-gas')))}
    ${[0, 1, 2, 3].map(i => glyph(`tq${i}`, gasGlyph(look, i === 2 ? 'OO' : 'OCO', i === 2 ? 'O₂' : 'CO₂', i === 2 ? 18 : -18, ''))).join('')}
    ${glyph('pga0', chip('PGA'))}${glyph('pga1', chip('PGA'))}${glyph('pga2', chip('PGA'))}
    ${glyph('pg2', chip('2-phosphoglycolate', 'rf-chip-o'))}
    ${glyph('ring', '<rect class="rf-halo" x="-96" y="-37" width="192" height="74" rx="28"/>')}
    <defs><radialGradient id="${p}-fl"><stop offset="0" stop-color="#fff4d6"/><stop offset=".45" stop-color="#f6c453" stop-opacity=".85"/><stop offset="1" stop-color="#f0a316" stop-opacity="0"/></radialGradient></defs>`;
}

/* ---------------------------------------------------------------- cards (stage units) */

const FORR = { x: 1085, y: 24, w: 490, h: 690, iw: 360 };
function forrCard(p: string): string {
  const { x, y, w, h, iw } = FORR, s = iw / 355, ix = x + 34, iy = y + 92;
  const px = (o: number, a: number): V => [ix + (70 + 2.55 * o) * s, iy + (311 - 4.77 * a) * s];
  const air = px(21, 0)[0];
  return paper(p, 'forr', x, y, w, h, `
    ${T(x + 30, y + 46, 'Forrester, Krotkov &amp; Nelson 1966', 'rf-cname')}
    ${T(x + 30, y + 76, 'soybean leaves', 'rf-cs')}
    <image class="rf-cmult" href="${forrPng}" x="${ix}" y="${iy}" width="${iw}" height="${f1(457 * s)}"/>
    <path class="rf-mark" d="M${f1(air)},${f1(px(21, 58)[1])}V${f1(px(21, -20)[1])}"/>
    ${T(air, iy + 457 * s + 30, 'air: 21 % O₂', 'rf-ct', 'middle')}
    ${T(x + w - 40, iy + 457 * s + 30, 'O₂ (%)', 'rf-cs', 'end')}
    ${T(x + 30, y + h - 22, 'Plant Physiol 41:422, Fig. 2 · © ASPB, free in PMC', 'rf-ccr')}`, -1.1, 41);
}

const BOWES = { x: 1085, y: 150, w: 490, h: 440 };
function bowesCard(p: string): string {
  const { x, y, w, h } = BOWES, l = x + 34;
  return paper(p, 'bowes', x, y, w, h, `
    ${T(l, y + 52, 'Biochem. Biophys. Res. Commun. · 1971', 'rf-cjour')}
    ${T(l, y + 112, 'Phosphoglycolate production', 'rf-ctitle')}
    ${T(l, y + 150, 'catalyzed by ribulose', 'rf-ctitle')}
    ${T(l, y + 188, 'diphosphate carboxylase', 'rf-ctitle')}
    ${T(l, y + 244, 'G. Bowes, W. L. Ogren and', 'rf-cauth')}
    ${T(l, y + 274, 'R. H. Hageman', 'rf-cauth')}
    <path class="rf-rule" d="M${l},${y + 312}H${x + w - 34}"/>
    ${T(l, y + 354, 'ribulose diphosphate carboxylase:', 'rf-cs')}
    ${T(l, y + 384, 'today called RuBisCO', 'rf-cs')}`, 1, 53);
}

const SAGE = { x: 1075, y: 40, w: 505, h: 660, iw: 420 };
function sageCard(p: string): string {
  const { x, y, w, h, iw } = SAGE, s = iw / 1113, ix = x + 44, iy = y + 132, ib = iy + 1040 * s;
  return paper(p, 'sage', x, y, w, h, `
    ${T(x + 30, y + 46, 'Sage, Sage &amp; Kocacinar 2012', 'rf-cname')}
    ${T(x + 30, y + 78, 'C₃ leaf, modelled', 'rf-cs')}
    ${T(x + 30, y + 118, '↑ photorespiration / photosynthesis', 'rf-ct')}
    <image class="rf-cmult" href="${sageJpg}" x="${ix}" y="${iy}" width="${iw}" height="${f1(1040 * s)}"/>
    ${T(x + 30, ib + 34, '← chloroplast CO₂', 'rf-ct')}${T(x + w - 30, ib + 34, 'leaf temperature →', 'rf-ct', 'end')}
    ${T(x + 30, y + h - 18, 'Annu Rev Plant Biol 63:19, Fig. 4', 'rf-ccr')}`, 0.9, 71);
}

/** The thermometer: 0 °C at y Y0, 45 °C at y Y1. */
const TH = { x: 1150, Y0: 560, Y1: 220, bulb: 590 };
const yOfT = (c: number): number => TH.Y0 + (TH.Y1 - TH.Y0) * c / 45;
function tempPanel(): string {
  const tx = TH.x, ticks = [0, 10, 20, 30, 40].map(c => `<path class="rf-tick" d="M${tx - 6},${f1(yOfT(c))}h-10"/>${T(tx - 22, yOfT(c) + 7, `${c}`, 'rf-cs', 'end')}`).join('');
  return panel('temp', 1080, 70, 490, 610, `
    ${T(1110, 122, 'spinach RuBisCO', 'rf-ct')}
    <rect class="rf-tube" x="${tx - 15}" y="${TH.Y1 - 30}" width="30" height="${TH.Y0 - TH.Y1 + 60}" rx="15"/>
    <circle class="rf-tube" cx="${tx}" cy="${TH.bulb}" r="27"/><circle class="rf-merc" cx="${tx}" cy="${TH.bulb}" r="20"/>
    <rect data-k="merc" class="rf-merc" x="${tx - 8}" y="${TH.Y0}" width="16" height="${TH.bulb - TH.Y0}"/>
    ${ticks}${T(tx - 22, TH.Y1 - 36, '°C', 'rf-cs', 'end')}
    ${T(1210, 212, 'leaf temperature', 'rf-cs')}
    <text data-k="tval" class="rf-cbig" x="1210" y="262">5 °C</text>
    <path class="rf-rule" d="M1210,312H1540"/>
    ${T(1210, 352, 'CO₂/O₂ specificity', 'rf-cs')}
    ${T(1210, 404, 'at 5 °C', 'rf-ct')}${T(1540, 404, '≈ 160', 'rf-cbig', 'end')}
    <g data-k="s40" style="display:none">${T(1210, 470, 'at 40 °C', 'rf-ct')}${T(1540, 470, '≈ 50', 'rf-cbig rf-cbig-o', 'end')}</g>
    ${T(1110, 662, 'Jordan &amp; Ogren 1984', 'rf-ccr')}`);
}

function tallyPanel(): string {
  return panel('tally', 1080, 160, 490, 330, `
    ${T(1110, 214, 'air, 25 °C', 'rf-ct')}${T(1540, 214, 'at this active site', 'rf-cs', 'end')}
    <path class="rf-rule" d="M1110,240H1540"/>
    ${T(1110, 312, 'carboxylations', 'rf-ct')}<text data-k="nc" class="rf-cbig" x="1540" y="316" text-anchor="end">0</text>
    ${T(1110, 400, 'oxygenations', 'rf-ct')}<text data-k="no" class="rf-cbig rf-cbig-o" x="1540" y="404" text-anchor="end">0</text>
    ${T(1110, 462, 'spinach RuBisCO, after Flamholz et al. 2019', 'rf-ccr')}`);
}

/* ---------------------------------------------------------------- the staging */

export interface Opt {
  id: string; name: string; note: string; look: Look;
  /** The events, one per beat, in the staging's order; their captions. */
  order: Ev[]; beats?: Beat[];
  /** The camera: the view the staging opens on, and per beat its moves. */
  start: Tf; cam: Move[][];
  /** Which card shows in which beat (default: forr, sage, temp and tally in their own beats). A card appears 0.1 s into
   *  its beat, or, when the camera moves in that beat, as its first move ends. */
  cards?: Array<[beat: number, card: Card]>;
}
type Card = 'forr' | 'bowes' | 'temp' | 'tally' | 'sage';

export function makeStaging(o: Opt): Staging {
  const P = `r5${o.id}`, pdb = o.look === 'pdb';
  const schema = sceneSvg(`${P}s`, o.look, LIT_C5, ['glycolate']);
  const sched: Array<[number, Card]> = o.cards ?? o.order.flatMap((e, i): Array<[number, Card]> => (e === 'forr' || e === 'temp' || e === 'tally' || e === 'sage' ? [[i, e]] : []));
  const has = (c: Card): boolean => sched.some(([, x]) => x === c);
  const cards = [has('forr') ? forrCard(P) : '', has('bowes') ? bowesCard(P) : '', has('sage') ? sageCard(P) : '', has('temp') ? tempPanel() : '', has('tally') ? tallyPanel() : ''].join('');
  const cardAt = (i: number): number => { const m = o.cam[i]?.[0]; return m ? Math.max(0.1, m[0] + m[1] - 0.2) : 0.1; };
  const camAt = camera(o.start, o.cam);
  const SITE = pdb ? SITE_P : SITE_A;
  const n = o.order.length;
  const holds = o.order.map((e, i) => [...(i === 0 ? [0] : []), ...(e === 'oxy' ? [E.oxy.hold] : [])]);
  /** Each beat ends when its event, its camera moves and its card are done. */
  const ends = o.order.map((e, i) => Math.max(E[e].end, ...(o.cam[i] ?? []).map(([a, d]) => a + d + 0.05), ...sched.filter(([j]) => j === i).map(() => cardAt(i) + 0.3)));

  return {
    id: o.id,
    name: o.name,
    note: o.note,
    beats: o.beats,
    holds,
    svg: () => stageSvg(P, schema, overSvg(P, o.look), cards),

    bind(stage) {
      const K = kit(stage), { q, set, op, put } = K;
      const rubBody = K.parts('rubisco').flatMap(g => Array.from(g.querySelectorAll('rect.rfs-rub, path.rfs-notch, text.rfs-name')));
      const rubpBody = K.parts('rubisco').flatMap(g => Array.from(g.querySelectorAll('polygon.rfs-rubp, text.rfs-rubpt')));
      const oxyAr = K.parts('oxy').flatMap(g => Array.from(g.querySelectorAll<SVGPathElement>('path.rfs-ar')));
      const carAr = K.parts('carbox').flatMap(g => Array.from(g.querySelectorAll<SVGPathElement>('path.rfs-ar')));
      const lit = K.litCopies();
      const pgaNode = K.parts('pga'), pg2Node = K.parts('pg2');
      const o2Lab = q('o2').querySelector('text.rfs-gas'), co2Lab = q('co2').querySelector('text.rfs-gas');
      const oxyW = K.parts('oxy');
      let last = '';

      return (beatIn, t) => {
        const b = Math.max(0, Math.min(n - 1, Math.round(beatIn)));
        const tt = Math.max(0, Math.min(t, ends[b]));
        const key = `${b}:${tt.toFixed(3)}`;
        if (key === last) return;
        last = key;
        /** Seconds into event e: −1 before its beat, 1e6 after it. */
        const at = (e: Ev): number => { const i = o.order.indexOf(e); return i < 0 ? -1 : b === i ? tt : b > i ? 1e6 : -1; };

        /* ---- camera */
        const k = K.cam(camAt(b, tt));

        /* ---- cards: each shows during its beat and gives way as the next begins */
        for (const [i, c] of sched) {
          op(q(c), b < i ? 0 : b === i ? tw(tt, cardAt(i), cardAt(i) + 0.25) : b === i + 1 ? 1 - tw(tt, 0, 0.25) : 0);
        }

        /* ---- carbox: CO₂ to RuBP, two PGA up to PGA */
        {
          const c = E.carbox, te = at('carbox');
          const u = (te - c.co2) / c.co2D;
          put('co2', CO2_IN(smooth(u)), k, te >= c.co2 - 0.15 && te < c.flash + 0.05 ? tw(te, c.co2 - 0.15, c.co2) * (1 - tw(te, c.flash - 0.1, c.flash + 0.05)) : 0);
          [0, 1].forEach(i => {
            const v = (te - c.up - i * c.lag) / c.upD;
            put(`pga${i}`, UP_CARBOX(smooth(v)), k, v >= -0.05 && v < 1.2 ? tw(v, -0.05, 0.08) * (1 - tw(v, 0.92, 1.12)) : 0);
          });
        }

        /* ---- oxy: into RuBisCO's structure, O₂ into the active site; back out with the products */
        {
          const c = E.oxy, te = at('oxy');
          const inS = te < 0 || te >= 1e6 ? 0 : tw(te, c.fade[0], c.fade[1]) * (1 - tw(te, c.back[0], c.back[1]));
          if (!pdb) {
            op(q('render'), inS);
            rubBody.forEach(el => op(el, 1 - inS));
            op(q('veil'), 0.94 * inS);
          } else {
            // staging C opens inside the pdb look's own render: an exact copy of it sits above the veil until the pull-back
            const sIn = 1 - tw(at('out'), 0.2, 0.9);
            op(q('render'), sIn);
            op(q('veil'), 0.94 * sIn);
          }
          rubpBody.forEach(el => op(el, pdb ? 1 : 1 - inS));
          // the active site, RuBP in it, O₂ coming in
          const siteOn = te >= c.site && te < c.back[1] ? tw(te, c.site, c.site + 0.2) * (1 - tw(te, c.back[0], c.back[0] + 0.3)) : 0;
          const u = (te - c.o2) / c.o2D;
          const o2On = te >= c.o2 - 0.1 && te < c.flash + 0.1 ? tw(te, c.o2 - 0.1, c.o2) * (1 - tw(te, c.flash - 0.05, c.flash + 0.1)) : 0;
          const rubpOn = te >= c.rubp && te < c.back[1] ? tw(te, c.rubp, c.rubp + 0.2) * (1 - tw(te, c.flash, c.flash + 0.3)) : 0;
          // scarbox / soxy use the same site glyphs
          const sc = E.scarbox, so = E.soxy, ts = at('scarbox'), tx = at('soxy'), tq = at('tally');
          const sSite = ts >= 0 && ts < 1e6 ? tw(ts, sc.site, sc.site + 0.2) : tx >= 0 && tx < 1e6 ? 1 : tq >= 0 && tq < 1e6 ? 1 : 0;
          const sRubp = ts >= 0 && ts < 1e6 ? tw(ts, sc.rubp, sc.rubp + 0.2) * (1 - tw(ts, sc.flash, sc.flash + 0.3))
            : tx >= 0 && tx < 1e6 ? tw(tx, so.rubp, so.rubp + 0.2) * (1 - tw(tx, so.flash, so.flash + 0.3)) : 0;
          const siteO = Math.max(siteOn, sSite * (1 - tw(at('out'), 0, 0.3)));
          put('site', SITE, 1, siteO);
          put('rub-l', pdb ? [GEO.rub[0] - 60, GEO.rub[1] + 14] : [RX - 6, RY + RH * 0.45], k, pdb ? 1 - tw(at('out'), 0, 0.3) : inS);
          set(q('site').firstElementChild, 'r', pdb ? '9' : '13');
          put('site-l', [SITE[0], SITE[1] - (pdb ? 30 : 42)], k, siteO);
          put('srubp', SITE, k, Math.max(rubpOn, sRubp));
          if (!pdb) put('o2', O2_IN(SITE)(smooth(u)), k * lerp(1, 0.75, smooth(u)), o2On);
          op(o2Lab, 1 - tw(pdb ? (at('soxy') - E.soxy.o2) / E.soxy.o2D : u, 0.55, 0.85));
          op(co2Lab, 1 - tw(pdb ? (at('scarbox') - E.scarbox.co2) / E.scarbox.co2D : (at('carbox') - E.carbox.co2) / E.carbox.co2D, 0.55, 0.85));
          // the flash at the site (oxy, scarbox, soxy, tally)
          const fl = Math.max(te < 1e6 && te >= 0 ? pulse(te, c.flash) : 0, ts >= 0 && ts < 1e6 ? pulse(ts, sc.flash) : 0,
            tx >= 0 && tx < 1e6 ? pulse(tx, so.flash) : 0, ...E.tally.t.map(t0 => (tq >= 0 && tq < 1e6 ? pulse(tq, t0 + E.tally.d) : 0)));
          put('flash', SITE, k, fl);
          // back out: 2-phosphoglycolate and PGA up the oxygenation arrow, the PGA on to PGA
          if (!pdb) {
            const v = (te - c.up) / c.upD, w = (te - c.on) / c.onD;
            const pgOn = v >= -0.05 && v < 1.2 ? tw(v, -0.05, 0.08) * (1 - tw(v, 0.95, 1.15)) : 0;
            const pg = UP_OXY(smooth(v));
            put('pg2', pg, k, pgOn);
            put('pga2', w <= 0 ? [pg[0], pg[1] + RIDE] : TO_PGA(smooth(w)), k, v >= -0.05 && w < 1.2 ? tw(v, -0.05, 0.08) * (1 - tw(w, 0.92, 1.12)) : 0);
          }
          // products leaving the site inside the structure (scarbox: two PGA; soxy: PGA + 2-phosphoglycolate)
          if (pdb) {
            const up = (t0: number, d: number, tv: number, dx: number): V => lerpV(SITE, [SITE[0] + dx, SITE[1] - 62], smooth((tv - t0) / d));
            const sOn = (tv: number, t0: number, d: number): number => (tv >= t0 && tv < t0 + d + 0.3 ? tw(tv, t0, t0 + 0.12) * (1 - tw(tv, t0 + d - 0.15, t0 + d + 0.1)) : 0);
            const sx = ts >= 0 && ts < 1e6, ox = tx >= 0 && tx < 1e6;
            put('pga0', up(sc.up, sc.upD, ts, -16), k, sx ? sOn(ts, sc.up, sc.upD) : 0);
            put('pga1', up(sc.up + 0.15, sc.upD, ts, 18), k, sx ? sOn(ts, sc.up + 0.15, sc.upD) : 0);
            put('pga2', up(so.up, so.upD, tx, -24), k, ox ? sOn(tx, so.up, so.upD) : 0);
            put('pg2', up(so.up + 0.15, so.upD, tx, 34), k, ox ? sOn(tx, so.up + 0.15, so.upD) : 0);
            // the molecules entering (scarbox: CO₂; soxy: O₂)
            const cu = (ts - sc.co2) / sc.co2D, ou = (tx - so.o2) / so.o2D;
            put('co2', CO2_SITE(SITE)(smooth(cu)), k * lerp(1, 0.7, smooth(cu)), sx && ts >= sc.co2 - 0.1 && ts < sc.flash + 0.1 ? tw(ts, sc.co2 - 0.1, sc.co2) * (1 - tw(ts, sc.flash - 0.05, sc.flash + 0.1)) : 0);
            put('o2', O2_IN(SITE)(smooth(ou)), k * lerp(1, 0.7, smooth(ou)), ox && tx >= so.o2 - 0.1 && tx < so.flash + 0.1 ? tw(tx, so.o2 - 0.1, so.o2) * (1 - tw(tx, so.flash - 0.05, so.flash + 0.1)) : 0);
          }
        }

        /* ---- tally: 3 CO₂ and 1 O₂ arrive one after another */
        {
          const c = E.tally, te = at('tally');
          let nc = 0, no = 0;
          c.t.forEach((t0, i) => {
            const u = (te - t0) / c.d, ox = i === 2;
            const path = ox ? O2_IN(SITE) : CO2_SITE(SITE);
            put(`tq${i}`, path(smooth(u)), k * lerp(1, 0.7, smooth(u)), te >= t0 - 0.1 && u < 1.15 && te < 1e6 ? tw(te, t0 - 0.1, t0) * (1 - tw(u, 0.95, 1.12)) : 0);
            if (u >= 1) { if (ox) no++; else nc++; }
          });
          set(q('nc'), 'text', `${nc}`);
          set(q('no'), 'text', `${no}`);
        }

        /* ---- temp: 5 → 40 °C; specificity ≈ 160 at 5 °C, ≈ 50 at 40 °C; oxygenation arrows thicken */
        {
          const c = E.temp, te = at('temp'), to = at('out');
          const r = te < 0 ? 0 : te >= 1e6 ? 1 : mv(te, c.t0, c.rise);
          const C = 5 + 35 * r;
          set(q('merc'), 'y', f1(yOfT(C)));
          set(q('merc'), 'height', f1(TH.bulb - yOfT(C)));
          set(q('tval'), 'text', `${Math.round(C)} °C`);
          op(q('s40'), te >= 1e6 ? 1 : te >= c.t0 + c.rise ? tw(te, c.t0 + c.rise, c.t0 + c.rise + 0.15) : 0);
          const heat = r * (1 - tw(to, 0, 0.5));
          oxyAr.forEach(el => set(el, 'style:stroke-width', heat > 0.001 ? f1(2.8 + 1.8 * heat) : ''));
          oxyW.forEach(g => set(g, 'style:filter', heat > 0.01 ? `drop-shadow(0 0 ${f1(9 * heat)}px rgba(240,163,22,.95))` : ''));
          carAr.forEach(el => set(el, 'style:opacity', heat > 0.001 ? (1 - 0.55 * heat).toFixed(3) : ''));
        }

        /* ---- out: 2-phosphoglycolate ringed; glycolate starts to light */
        {
          const c = E.out, te = at('out');
          const ringHeat = at('temp') >= 0 ? (at('temp') >= 1e6 ? 1 : mv(at('temp'), E.temp.t0, E.temp.rise)) * (1 - tw(te, 0, 0.5)) : 0;
          const ring = Math.max(te >= 0 ? tw(te, c.ring, c.ring + 0.3) : 0, 0.8 * ringHeat);
          put('ring', OX, k, ring);
          lit.forEach(g => op(g, NEXT_LIT * (te >= 0 ? tw(te, c.lit, c.lit + 0.6) : 0)));
        }

        /* ---- the product nodes brighten as their products arrive */
        {
          const tc = at('carbox'), tox = at('oxy');
          const hitPga = Math.max(tc >= 0 && tc < 1e6 ? pulse(tc, E.carbox.up + E.carbox.lag + E.carbox.upD - 0.05) : 0,
            tox >= 0 && tox < 1e6 ? pulse(tox, E.oxy.on + E.oxy.onD - 0.05) : 0);
          const hitPg2 = tox >= 0 && tox < 1e6 ? pulse(tox, E.oxy.up + E.oxy.upD - 0.05) : 0;
          pgaNode.forEach(g => set(g, 'style:filter', hitPga > 0.01 ? `drop-shadow(0 0 ${f1(10 * hitPga)}px rgba(246,196,83,.95))` : ''));
          pg2Node.forEach(g => set(g, 'style:filter', hitPg2 > 0.01 ? `drop-shadow(0 0 ${f1(10 * hitPg2)}px rgba(246,196,83,.95))` : ''));
        }
      };
    },
  };
}

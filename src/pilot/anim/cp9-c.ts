// Measuring leaf gas exchange, staging C: real images first, with the analysers' readout fixed at the top right. Beat 1:
// a LI-6800 in a rice field (Du et al. 2020, Fig. 1f), its sensor head ringed; beat 2: the slide's LI-6800 head
// schematic (C9 v4) and, in the same click, the readout's "out" bars move (CO₂ down: A; H₂O up: E); beat 3: a stoma
// (tomato, SEM) with CO₂ going in and water vapour coming out, and the stomatal conductance from E and the water-vapour
// difference (C9 v8's relation); beat 4: a dive through the pore onto C9 v7 (Cᵢ calculated); beat 5: the question.
// Images: photos/cp-du-field.jpg (442 × 545; the sensor head at 170, 190), photos/c7-stoma-sem.jpg (760 × 660; the pore
// at 395, 265). Scenes: cp9-common.ts.
import fieldJpg from '../../assets/photos/cp-du-field.jpg';
import semJpg from '../../assets/photos/c7-stoma-sem.jpg';
import { CP9_C } from './beats-cp';
import { beatClock, clipDefs, dive, f1, mv, photo, pulseAt, setters, stagePill, tfStr, tw, view, type Tf, type V } from './cp-stage';
import { figCard, pathCtl, pathSvg, PORE_PT, readoutCtl, readoutSvg } from './cp9-common';
import type { Staging } from './types';

const P = 'cp9c';
const RO = { x: 990, y: 170 };
/** The field photo and the SEM, in stage units. */
const FLD = { x: 330, y: 46, w: 520, h: 641 }, SEM = { x: 270, y: 80, w: 640, h: 556 };
const HEAD: V = [FLD.x + (170 * FLD.w) / 442, FLD.y + (190 * FLD.h) / 545];
const PORE: V = [SEM.x + (395 * SEM.w) / 760, SEM.y + (265 * SEM.h) / 660];
const V4: Tf = view(0.92, [400, 300], [540, 380]), PATHV: Tf = view(0.92, [400, 300], [540, 372]);
const ID: Tf = { s: 1, t: [0, 0] };
const TEND = [1.0, 1.5, 1.4, 2.6, 1.6];

const arrow = (k: string, d: string, cls: 'co2' | 'h2o'): string =>
  `<g data-k="${k}"><path class="cps-halo" d="${d}"/><path class="cps-arrow-${cls}" d="${d}" pathLength="1" stroke-dasharray="1 1" marker-end="url(#${P}-hd-${cls})"/></g>`;

export const STAGING: Staging = {
  id: 'c',
  name: 'C · Real images (field → sensor head → stoma)',
  note: 'A LI-6800 in a rice field, the slide’s LI-6800 head schematic (C9 v4) with the readout reacting, a real stoma (SEM) with CO₂ in and water out, then the dive onto C9 v7.',
  beats: CP9_C,
  svg: () => `${clipDefs(P)}
    <defs>${(['co2', 'h2o'] as const).map(k => `<marker id="${P}-hd-${k}" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="4" markerHeight="4" orient="auto"><path class="cps-hd-${k}" d="M0,0.6 L10,5 L0,9.4z"/></marker>`).join('')}</defs>
    ${photo(P, 'fld', fieldJpg, 442, 545, FLD.x, FLD.y, FLD.w, FLD.h, { credit: 'LI-6800 in a rice field: Du et al. 2020, Plant Methods 16:6, Fig. 1f, CC BY 4.0', o: 1 })}
    <g data-k="ring" opacity="0"><circle class="cps-ring" cx="${f1(HEAD[0])}" cy="${f1(HEAD[1])}" r="34"/></g>
    ${stagePill('pl-head', HEAD[0] + 190, HEAD[1] - 70, 'leaf chamber', 'paper')}
    <g class="fig"><g data-k="v4" opacity="0">${figCard(P, 'h', 'v4')}</g></g>
    <g data-k="semg" opacity="0">
      ${photo(P, 'sem', semJpg, 760, 660, SEM.x, SEM.y, SEM.w, SEM.h, { credit: 'tomato stoma, SEM: Dartmouth Electron Microscope Facility, public domain', o: 1 })}
      ${arrow('a-co2', `M${f1(PORE[0] - 160)},${f1(PORE[1] - 140)} Q${f1(PORE[0] - 50)},${f1(PORE[1] - 120)} ${f1(PORE[0] - 14)},${f1(PORE[1] - 8)}`, 'co2')}
      ${arrow('a-h2o', `M${f1(PORE[0] + 16)},${f1(PORE[1] - 6)} Q${f1(PORE[0] + 60)},${f1(PORE[1] - 130)} ${f1(PORE[0] + 180)},${f1(PORE[1] - 146)}`, 'h2o')}
      ${stagePill('l-co2', PORE[0] - 170, PORE[1] - 170, 'CO₂ in', 'co2')}${stagePill('l-h2o', PORE[0] + 190, PORE[1] - 176, 'H₂O out', 'h2o')}
      ${stagePill('pl-st', PORE[0] + 10, PORE[1] + 150, 'stoma', 'paper', 1)}
    </g>
    <g class="fig"><g data-k="path" opacity="0">${pathSvg(P, 'p')}</g></g>
    <text class="cps-sub" x="${RO.x + 210}" y="${RO.y - 16}" text-anchor="middle">air before (in) and after (out) the leaf</text>
    ${readoutSvg('ro', RO.x, RO.y)}
    <g data-k="eq" opacity="0"><rect class="cps-rcard" x="${RO.x}" y="492" width="420" height="150" rx="16"/>
      <text class="cps-head" x="${RO.x + 210}" y="536" text-anchor="middle">stomatal conductance</text>
      <text class="cp9-eq" x="${RO.x + 210}" y="584" text-anchor="middle"><tspan font-style="italic">g</tspan><tspan baseline-shift="sub" font-size="70%">sw</tspan> = <tspan font-style="italic">E</tspan> / (<tspan font-style="italic">w</tspan><tspan baseline-shift="sub" font-size="70%">i</tspan> − <tspan font-style="italic">w</tspan><tspan baseline-shift="sub" font-size="70%">a</tspan>)</text>
      <text class="cps-sub" x="${RO.x + 210}" y="620" text-anchor="middle"><tspan font-style="italic">w</tspan>: water vapour in the leaf (i) and the air (a)</text></g>`,

  bind(stage) {
    const S = setters(stage), { q, set, op } = S;
    const path = pathCtl(S, 'p'), ro = readoutCtl(S, 'ro', RO.y);
    const dash = (k: string, u: number): void => { const el = q(k).querySelector('[pathLength]'); if (el) set(el, 'stroke-dashoffset', (1 - u).toFixed(3)); };
    let last = '';
    return (beatIn, t) => {
      const b = Math.max(0, Math.min(4, Math.round(beatIn))), tt = Math.max(0, Math.min(t, TEND[b]));
      const key = `${b}:${tt.toFixed(3)}`;
      if (key === last) return;
      last = key;
      const T = beatClock(b, tt), t0 = T(0), t1 = T(1), t2 = T(2), t3 = T(3), t4 = T(4);

      op(q('ro'), 1);
      ro(mv(t1, 0.5, 0.9));
      // beat 1: the field photo, its sensor head ringed and named
      op(q('fld'), 1 - tw(t1, 0, 0.5));
      const ring = tw(t0, 0.2, 0.5) * (1 - tw(t1, 0, 0.3));
      op(q('ring'), ring); op(q('pl-head'), ring);
      // beat 2: the slide's head schematic
      set(q('v4'), 'transform', tfStr(V4));
      op(q('v4'), tw(t1, 0.1, 0.6) * (1 - tw(t2, 0, 0.5)));
      // beat 3: the stoma, CO₂ in and water out; the conductance relation
      const e = mv(t3, 0.2, 1.3);
      const [va, vb] = dive(ID, PORE, PATHV, PORE_PT, 8, e);
      set(q('semg'), 'transform', tfStr(va)); set(q('path'), 'transform', tfStr(vb));
      op(q('semg'), tw(t2, 0.1, 0.6) * (1 - tw(e, 0.5, 0.85)));
      op(q('path'), tw(e, 0.35, 0.75));
      dash('a-co2', mv(t2, 0.6, 0.7)); dash('a-h2o', mv(t2, 0.6, 0.7));
      op(q('l-co2'), tw(t2, 1.1, 1.3)); op(q('l-h2o'), tw(t2, 1.1, 1.3)); op(q('pl-st'), 1);
      op(q('eq'), tw(t2, 1.1, 1.3) * (1 - tw(t3, 0, 0.3)));
      // beat 4: the drawn path, Cᵢ calculated; beat 5: the question
      path({ measured: tw(t3, 1.55, 1.75), calc: tw(t3, 2.05, 2.25), values: tw(t3, 2.05, 2.25), pulse: pulseAt(t4, 0.1, 1.2), q: tw(t4, 0.9, 1.1) });
    };
  },
};

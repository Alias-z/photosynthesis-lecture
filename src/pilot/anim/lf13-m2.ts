// 'lf13', staging m2 · lf13m polished (lecturer, lecture day): by night the CO₂ carried by each malic acid falls asleep in
// the vacuole (the face and z's of cam-kranz.ts's faceG on the carbon that came from CO₂); by day the light comes first
// (the thylakoids light up, ATP and NADPH appear), then the CO₂ wakes up, leaves the vacuole and is fixed, the ATP and
// NADPH used by the Calvin–Benson–Bassham cycle. Per CO₂, numbered; steps with holds in beats 1 and 3:
// - Beat 1 (night): the stoma opens; 1 small H₂O leaves | CO₂ 1 enters → CA (water joins) → HCO₃⁻ 1 → PEPC with PEP 1
//   from starch → C₄ acid → malic acid 1 into the vacuole | its CO₂ carbon falls asleep.
// - Beat 2: CO₂ 2 and 3 follow, malic acid 2 and 3 stack up and fall asleep; the starch granule shrinks.
// - Beat 3 (day): the sun rises, the stoma closes | the thylakoids light up; ATP, then NADPH | malic acid 3's CO₂ wakes |
//   it leaves the vacuole → malic enzyme → CO₂ → RuBisCO; ATP and NADPH used | pyruvate → starch; new ATP and NADPH.
// - Beat 4: malic acid 2 and 1 wake and follow; the vacuole is empty; the starch granule is full again.
// - Beat 5: water-use efficiency of C₃, C₄ and CAM (Borland et al. 2009, Table 2) on a card; no closing question.
import { atomBall, rowWidth } from '../figs/carbon-form';
import { C4, CAM, guardCells, h2oG, hco3G, H2O_PATH, LH, LW, PORE, SPOT, starchG, VAC, type LPart } from '../figs/leaf-schema';
import { hring } from '../figs/chain';
import { GLYPH } from './dk1-common';
import { LF13 } from './beats-lf';
import { add, ease, flash, glide, lerp, makeLeafStaging, panelShow, panelSvg, T, type Actor, type Api, type Row, type V } from './lf-common';
import type { Beat, Staging } from './types';

const S = SPOT;
const f = (v: number): string => (Math.round(v * 100) / 100).toString();
const cap = (w: number, r = 13): string => `<rect class="dk-cap" x="${-w / 2 - 5}" y="${-r - 5}" width="${w + 10}" height="${2 * r + 10}" rx="${r + 5}"/>`;
const N3 = [1, 2, 3];

/* ---------------------------------------------------------------- the CO₂'s face (after cam-kranz.ts faceG, zzG) */
const INK = '#2b1608';
/** The face on a C ball of radius r at the origin: awake, and asleep when k is given (`${k}-aw`, `${k}-as`). */
function faceG(r: number, k?: string): string {
  const R = (v: number): string => f(v * r), w = f(Math.max(1.4, r * 0.12)), er = f(Math.max(1.5, r * 0.13));
  const p = (d: string): string => `<path d="${d}" style="fill:none;stroke:${INK};stroke-linecap:round;stroke-linejoin:round;stroke-width:${w}px"/>`;
  const awake = `<circle cx="${R(-0.36)}" cy="${R(-0.16)}" r="${er}" style="fill:${INK}"/><circle cx="${R(0.36)}" cy="${R(-0.16)}" r="${er}" style="fill:${INK}"/>`
    + `<path d="M${R(-0.34)},${R(0.2)}Q0,${R(0.64)} ${R(0.34)},${R(0.2)}Z" style="fill:${INK}"/>`;
  if (!k) return awake;
  const asleep = p(`M${R(-0.56)},${R(-0.16)}Q${R(-0.36)},${R(0.08)} ${R(-0.16)},${R(-0.16)}M${R(0.16)},${R(-0.16)}Q${R(0.36)},${R(0.08)} ${R(0.56)},${R(-0.16)}`)
    + p(`M${R(-0.14)},${R(0.36)}Q0,${R(0.46)} ${R(0.14)},${R(0.36)}`);
  return `<g data-k="${k}-aw">${awake}</g><g data-k="${k}-as" display="none">${asleep}</g>`;
}
/** One meaning per face, deck-wide (lecturer, lecture day; co2-kit.ts kidG's faces): neutral (dissolved, as HCO₃⁻ in the
 *  cytosol) and strained with a sweat drop (trapped: by day, released behind the shut stoma, round RuBisCO). */
function neutralG(r: number): string {
  const R = (v: number): string => f(v * r), w = f(Math.max(1.4, r * 0.12)), er = f(Math.max(1.5, r * 0.13));
  return `<circle cx="${R(-0.36)}" cy="${R(-0.14)}" r="${er}" style="fill:${INK}"/><circle cx="${R(0.36)}" cy="${R(-0.14)}" r="${er}" style="fill:${INK}"/>`
    + `<path d="M${R(-0.3)},${R(0.36)}Q0,${R(0.5)} ${R(0.3)},${R(0.36)}" style="fill:none;stroke:${INK};stroke-linecap:round;stroke-width:${w}px"/>`;
}
function strainedG(r: number): string {
  const R = (v: number): string => f(v * r), w = f(Math.max(1.4, r * 0.12));
  const p = (d: string): string => `<path d="${d}" style="fill:none;stroke:${INK};stroke-linecap:round;stroke-linejoin:round;stroke-width:${w}px"/>`;
  return p(`M${R(-0.56)},${R(-0.34)}L${R(-0.22)},${R(-0.14)}L${R(-0.56)},${R(0.04)}M${R(0.56)},${R(-0.34)}L${R(0.22)},${R(-0.14)}L${R(0.56)},${R(0.04)}`)
    + p(`M${R(-0.42)},${R(0.42)}l${R(0.14)},${R(-0.12)}l${R(0.14)},${R(0.12)}l${R(0.14)},${R(-0.12)}l${R(0.14)},${R(0.12)}l${R(0.14)},${R(-0.12)}l${R(0.14)},${R(0.12)}`)
    + `<path d="M${R(0.62)},${R(-1.58)}C${R(0.86)},${R(-1.24)} ${R(0.86)},${R(-1.02)} ${R(0.62)},${R(-1.0)}C${R(0.38)},${R(-1.02)} ${R(0.38)},${R(-1.24)} ${R(0.62)},${R(-1.58)}Z" style="fill:#9cc3dd;stroke:#4f7cac;stroke-width:1.2px"/>`;
}
/** Two small z's up and right of a sleeping face (`${k}-z`). */
const zzG = (k: string, r: number): string => {
  const z = (x: number, y: number, s: number): string => `<text x="${f(x)}" y="${f(y)}" text-anchor="start" style="font-size:${s}px;font-style:italic;font-weight:600;fill:#5d6a8f">z</text>`;
  return `<g data-k="${k}-z" display="none">${z(r * 1.15, -r * 0.7, 14)}${z(r * 1.85, -r * 1.45, 17)}</g>`;
};
const C_BALL = (r: number): string => `<circle class="atom atom-C" r="${f(r)}"/>`;
/** CO₂ with the face on its C (the balls of GLYPH.co2, the C's letter left off): awake (smiling, entering through the open
 *  stoma at night) or strained and sweating (trapped by day). */
const co2FaceG = (trapped = false): string => {
  const r = 11, d = r * 1.7, o = (x: number): string => `<circle class="atom atom-O" cx="${f(x)}" cy="0" r="${r}"/><text class="cel-att cel-att-O" x="${f(x)}" y="${f(r * 0.42)}" text-anchor="middle">O</text>`;
  return `${cap(5.4 * r, r)}<g class="chn-g">${o(-d)}${C_BALL(r)}${o(d)}${trapped ? strainedG(r) : faceG(r)}</g>`;
};
/** HCO₃⁻ with the face on its C. */
const hcoFaceG = (): string => `<circle class="dk-cap" r="30"/>${hco3G(0, 0)}<g class="chn-g">${C_BALL(10.5 * 0.9)}${neutralG(10.5 * 0.9)}</g>`;
/** Malic acid (C–C–C–C) with the face on its fourth carbon, the one that came from CO₂ (its letter left off). */
const AR = 11, AW = rowWidth(4, AR), AX3 = -AW / 2 + AR + 3 * AR * 2.15;
const acidFaceG = (k: string): string => {
  const x0 = -AW / 2 + AR, bond = `<path d="M${f(x0)},0H${f(AX3)}" style="stroke:#6b6a64;stroke-width:${f(Math.max(1.6, AR * 0.22))};fill:none"/>`;
  const balls = [0, 1, 2].map(i => atomBall(x0 + i * AR * 2.15, 0, 'C', AR)).join('') + atomBall(AX3, 0, 'C', AR).replace(/<text[\s\S]*?<\/text>/, '');
  return `${cap(AW, AR)}<g class="chn-g">${bond}${balls}</g><g transform="translate(${f(AX3)} 0)">${faceG(AR, k)}${zzG(k, AR)}</g>`;
};
/** Malic acid i (0–2) in the vacuole: stacked from the bottom, spaced for the z's; the number right of them. */
const ACID_AT = (i: number): V => [S.vac[0] - 14, VAC[1] + VAC[3] - 24 - 32 * i];

const ACTORS: Actor[] = [
  ...N3.map(i => ({ k: `co2${i}`, g: co2FaceG(), lab: `CO₂ ${i}`, dy: -22 })),
  ...N3.map(i => ({ k: `hco${i}`, g: hcoFaceG(), lab: `HCO₃⁻ ${i}`, dy: 48 })),
  ...N3.map(i => ({ k: `pep${i}`, g: GLYPH.carbon('CCCP'), lab: `PEP ${i}`, dy: 34 })),
  ...N3.map(i => ({ k: `mal${i}`, g: acidFaceG(`mal${i}`), lab: `${i}`, dx: 74, dy: 6, an: 'start' as const })),
  ...N3.map(i => ({ k: `dco${i}`, g: co2FaceG(true), lab: 'CO₂', dy: 32 })),
  ...N3.map(i => ({ k: `pyr${i}`, g: GLYPH.carbon('CCC'), lab: 'pyruvate', dy: 34 })),
  { k: 'h2o', g: `${cap(36)}${h2oG(0, -2)}`, lab: 'H₂O 1', dy: 34 },
  { k: 'h2oL', g: `<g transform="scale(.7)">${h2oG(0, -2)}</g>`, lab: '', dy: 26 },
  { k: 'hp', g: `<g class="chn-g">${hring(0, 0, 12)}</g>` },
  { k: 'starchA', g: starchG(0, 0, 1), lab: 'starch', dy: 6 },
  { k: 'atp', g: GLYPH.atp() }, { k: 'nadph', g: GLYPH.nadph() },
  // what RuBisCO's carbon becomes: 3 CO₂ fixed, 1 triose phosphate (3 C) out of the chloroplast
  { k: 'tp', g: GLYPH.carbon('CCCP'), lab: 'triose phosphate', dy: 34 },
];

/* ---------------------------------------------------------------- ways (panorama units) */
const CO2_IN: V[] = [[24, 340], [70, 340], [PORE[0], 340], ...C4.co2In.slice(0, -1), add(S.ca, [-30, -4])];
const CO2_FAST: V[] = [[PORE[0], 340], ...C4.co2In.slice(0, -1), add(S.ca, [-30, -4])];
const H2O_IN: V[] = [[420, 196], [432, 150], add(S.ca, [-6, 22])];
const HCO3: V[] = [add(S.ca, [26, -10]), S.hco3, add(S.pepc, [8, -30])];
const PEP_IN: V[] = [...CAM.pepFromStarch.slice(0, -1), add(S.pepc, [-26, 8])];
const ACID_IN = (i: number): V[] => [add(S.pepc, [20, 30]), ...CAM.acidIn.slice(1, -1), ACID_AT(i)];
const ACID_OUT = (i: number): V[] => [ACID_AT(i), add(ACID_AT(i), [30, -40]), add(S.camMe, [18, 30])];
const ME_CO2: V[] = [add(S.camMe, [-34, -8]), ...CAM.meCo2.slice(1, -1), add(S.mRub, [24, 0])];
const PYR: V[] = [add(S.camMe, [-24, 26]), ...CAM.pyrToStarch.slice(1, -1), add(S.starch, [20, 0])];
/** The triose phosphate from RuBisCO out through the chloroplast envelope into the cytosol (upper right, clear of the
 *  vacuole and of the night's PEPC), so the starch is plainly the pyruvate's (lecturer, lecture day: "confusing: does the
 *  pyruvate make starch, or RuBisCO too?"). */
const TP_OUT: V[] = [add(S.mRub, [18, -26]), [360, 250], [400, 214], [436, 190]];
const WATER_OUT: V[] = [...H2O_PATH.slice(0, 5), [20, 396]];
/** The light's energy: the granum of the mesophyll chloroplast; ATP and NADPH made there wait above it, then go to the
 *  cycle at RuBisCO. */
const GR = S.granum, ATP_AT: V = [GR[0] - 30, 489], NADPH_AT: V = [GR[0] + 32, 489], TAG = 0.8;
const ATP_USE: V[] = [ATP_AT, [GR[0] - 43, 436], [S.mRub[0] - 20, 374]];
const NADPH_USE: V[] = [NADPH_AT, [GR[0] + 41, 440], [S.mRub[0] + 20, 374]];
/** The lit thylakoids: a soft glow and the 3 discs of the granum (figs/leaf-schema.ts granum()) in chlorophyll green. */
const thylG = (p: string): string => `<defs><radialGradient id="${p}-glow"><stop offset="0" stop-color="#fff4d6"/><stop offset=".55" stop-color="#f6c453" stop-opacity=".55"/><stop offset="1" stop-color="#f0a316" stop-opacity="0"/></radialGradient></defs>
  <g data-k="thyl" display="none"><ellipse cx="${GR[0]}" cy="${GR[1]}" rx="54" ry="30" fill="url(#${p}-glow)"/>${[0, 1, 2].map(j => `<rect x="${GR[0] - 30.8}" y="${GR[1] - 11 + 11 * j - 3.6}" width="61.6" height="7.2" rx="3.6" style="fill:#8fc35f;stroke:#4f7f2f;stroke-width:1.2"/>`).join('')}</g>`;

/* ---------------------------------------------------------------- the ledger, the clock, the card (stage units) */
const PX = 742, PY = 22, PW = 830;
const n = (k: string): string => `<tspan data-k="${k}">0</tspan>`;
const ROWS: Row[] = [
  { k: 'r0', h: 36, html: 'per CO₂', cls: 'dk-ph' },
  { k: 'r1', h: 38, html: '<tspan class="lfa-e">night · PEPC:</tspan> HCO₃⁻ + PEP → C₄ acid → malic acid in the vacuole' },
  { k: 'r3', h: 44, html: `malic acid in the vacuole: ${n('n-mal')}`, cls: 'lfa-sum' },
  { k: 'r2', h: 38, html: '<tspan class="lfa-e">day · malic enzyme:</tspan> malic acid → CO₂ + pyruvate; CO₂ → RuBisCO' },
];
const clock = (): string => `<g data-k="clk" display="none"><rect class="lfa-card" x="${PX}" y="250" width="380" height="96" rx="14"/>
  <g data-k="moon"><path class="lf-moon" d="M${PX + 44},${268}A20,20 0 1 0 ${PX + 52},${304}A15,15 0 1 1 ${PX + 44},${268}Z"/></g>
  <g data-k="sun" class="lf-sun"><circle cx="${PX + 46}" cy="298" r="14"/>${Array.from({ length: 8 }, (_, i) => { const a = (i * Math.PI) / 4; return `<path d="M${(PX + 46 + 20 * Math.cos(a)).toFixed(1)},${(298 + 20 * Math.sin(a)).toFixed(1)}L${(PX + 46 + 27 * Math.cos(a)).toFixed(1)},${(298 + 27 * Math.sin(a)).toFixed(1)}"/>`; }).join('')}</g>
  <text data-k="clk-t" class="lfa-h" x="${PX + 92}" y="292">night</text><text data-k="clk-s" class="lfa-sub" x="${PX + 92}" y="322">stomata open</text></g>`;
/** Water-use efficiency, mmol CO₂ per mol H₂O over 24 h (Borland et al. 2009, Table 2): ranges as bars on 0–10. */
const WUE: Array<[string, number, number, string]> = [['C₃', 0.5, 1.5, '0.5–1.5'], ['C₄', 1, 2, '1–2'], ['CAM', 4, 10, '4–10']];
const card = (): string => {
  const x0 = PX + 110, x1 = PX + 760, sx = (v: number): number => x0 + ((x1 - x0) * v) / 10, y0 = 424;
  return `<g data-k="card" display="none"><rect class="lfa-card" x="${PX}" y="362" width="${PW}" height="334" rx="16"/>
    ${T(PX + 24, 400, 'CO₂ fixed per water lost', 'lfa-h', 'start')}${T(PX + 24, 426, 'mmol CO₂ per mol H₂O, over 24 h', 'lfa-sub', 'start')}
    ${WUE.map(([k, a, b, s], i) => { const y = y0 + 40 + i * 56; return `${T(PX + 24, y + 8, k, 'lfa-sum', 'start')}<rect class="lfa-bar${k === 'CAM' ? ' lfa-bar-on' : ''}" x="${sx(a).toFixed(1)}" y="${y - 14}" width="${(sx(b) - sx(a)).toFixed(1)}" height="28" rx="6"/>${T(sx(b) + 10, y + 8, s, 'dk-pc', 'start')}`; }).join('')}
    <path class="lfa-axis" d="M${x0},${y0 + 196}H${x1}"/>${[0, 2, 4, 6, 8, 10].map(v => `<path class="lfa-axis" d="M${sx(v)},${y0 + 196}v6"/>${T(sx(v), y0 + 222, String(v), 'lfa-tick')}`).join('')}
    ${T(x1, 684, 'Borland et al. 2009, Table 2', 'dk-ccr', 'end')}</g>`;
};

/* ---------------------------------------------------------------- captions (LF13's, with a step each) */
const BEATS: Beat[] = [
  { ...LF13[0], steps: [
    { tag: 'Night: stomata open', say: 'At night, CAM plants open their stomata; a little water escapes.' },
    { tag: 'CO₂ into the vacuole', say: 'CO₂ 1 enters; carbonic anhydrase makes HCO₃⁻, and PEPC fixes it to PEP from starch. The C₄ acid goes into the vacuole as malic acid.' },
    { tag: 'Stored as malic acid', say: 'At night there is no light, so no ATP and NADPH for the Calvin–Benson–Bassham cycle: the CO₂ is stored in malic acid until the light supplies the energy.' },
  ] },
  { ...LF13[1], say: 'Through the night, malic acid builds up in the vacuole: 1 malic acid per CO₂ taken up. Less water evaporates through the open stomata into the cooler, more humid night air.' },
  { ...LF13[2], steps: [
    { tag: 'Day: stomata closed', say: 'By day the sun is up and the stomata close, to save water.' },
    { tag: 'Light: ATP and NADPH', say: 'Light now drives the thylakoids: they make ATP and NADPH, the energy that the Calvin–Benson–Bassham cycle needs.' },
    { tag: 'Energy for the stored CO₂', say: 'With ATP and NADPH at hand, the CO₂ stored overnight can now be fixed.' },
    { tag: 'Fixed behind closed stomata', say: 'All the malic acid leaves the vacuole; malic enzyme releases its CO₂, and RuBisCO fixes it with the ATP and NADPH: 3 CO₂ give 1 triose phosphate, a sugar, which leaves the chloroplast.' },
    { tag: 'Pyruvate back to starch', say: 'The vacuole is empty. The pyruvate is made back into starch, the store that gives PEP for the next night.' },
  ] },
  // the stored malic acid is spent in one go, in beat 2 (lecturer, lecture day: "spend all the stored malate in one go,
  // not one by one after each click"): LF13's "the vacuole empties" beat is dropped
  { ...LF13[4], say: 'Per mol of water lost, CAM plants fix 4–10 mmol CO₂; C₃ crops 0.5–1.5, C₄ crops 1–2. About 6–7 % of vascular plants use CAM.' },
];
/** Holds: beat 1 (stoma | CO₂ 1 in | stored), beat 3 (day | light | energy | all 3 fixed | starch). */
const HOLDS: number[][] = [[4.2, 12.4], [], [2.7, 6.2, 7.3, 13.0], []];

/* ---------------------------------------------------------------- the frame */
/** The CO₂ in malic acid i: asleep s (0 awake … 1 asleep), its z's z. */
const face = (a: Api, i: number, s: number, z: number): void => { a.op(`mal${i}-aw`, 1 - s); a.op(`mal${i}-as`, s); a.op(`mal${i}-z`, z); };
/** Night uptake of CO₂ i from t0: full steps for i = 1, a quicker run for 2 and 3; in the vacuole its CO₂ falls asleep. */
function night(a: Api, t: number, i: number, t0: number, slow: boolean): void {
  const k = (s: number): number => t0 + s * (slow ? 1 : 0.62);
  const ca = k(slow ? 4.0 : 2.0), pc = k(slow ? 5.6 : 3.2), va = k(slow ? 7.4 : 4.4);
  if (t < t0) return;
  if (t < ca + 0.3) a.put(`co2${i}`, glide(slow ? CO2_IN : CO2_FAST, t, t0 + (slow ? 0.6 : 0), ca), ease(t, t0, t0 + 0.4) * (1 - ease(t, ca, ca + 0.2)));
  if (slow && t > ca - 1.1 && t < ca + 0.3) a.put('h2o', glide(H2O_IN, t, ca - 1.1, ca), ease(t, ca - 1.1, ca - 0.8) * (1 - ease(t, ca, ca + 0.2)));
  flash(a, t, ca, S.ca);
  if (slow && t > ca && t < ca + 1.3) a.put('hp', glide([add(S.ca, [20, 20]), [500, 140], [520, 136]], t, ca + 0.05, ca + 1.1), ease(t, ca, ca + 0.2) * (1 - ease(t, ca + 0.9, ca + 1.3)));
  if (t > ca && t < pc + 0.3) a.put(`hco${i}`, glide(HCO3, t, ca + 0.05, pc - 0.1), ease(t, ca, ca + 0.2) * (1 - ease(t, pc, pc + 0.2)));
  a.op(`hco${i}-l`, slow ? 1 : 0);
  if (t > t0 && t < pc + 0.3) a.put(`pep${i}`, glide(PEP_IN, t, t0 + (slow ? 2.4 : 0.6), pc - 0.1), ease(t, t0 + (slow ? 2.3 : 0.5), t0 + (slow ? 2.6 : 0.8)) * (1 - ease(t, pc, pc + 0.2)));
  a.op(`pep${i}-l`, slow ? 1 : 0);
  flash(a, t, pc, S.pepc, 'fl2');
  if (t > pc) a.put(`mal${i}`, glide(ACID_IN(i - 1), t, pc + 0.05, va), ease(t, pc, pc + 0.2));
  a.op(`mal${i}-l`, ease(t, va - 0.2, va + 0.2));
  // asleep: the eyes close, then the z's come (slow: after the hold at va + 0.6)
  const sl = slow ? va + 0.7 : va + 0.1;
  face(a, i, ease(t, sl, sl + 0.8), ease(t, sl + 0.9, sl + 1.7));
}
/** Malic acid i asleep in the vacuole. */
const asleep = (a: Api, i: number): void => { a.put(`mal${i}`, ACID_AT(i - 1), 1); a.op(`mal${i}-l`, 1); face(a, i, 1, 1); };
/** Day release of malic acid i from t0 (it woke before): to malic enzyme, the CO₂ to RuBisCO, pyruvate to starch; slow:
 *  one after another, with ATP and NADPH used once the CO₂ is fixed. Returns when the CO₂ is fixed and when the pyruvate
 *  reaches the starch. */
function day(a: Api, t: number, i: number, t0: number, slow: boolean, lab = slow): { ru: number; st: number } {
  const k = (s: number): number => t0 + s * (slow ? 1 : 0.62);
  const me = k(1.8), ru = k(3.4), st = slow ? ru + 3.6 : k(3.6), p0 = slow ? ru + 2.3 : me + 0.05;
  face(a, i, 0, 0);
  if (t < t0) { a.put(`mal${i}`, ACID_AT(i - 1), 1); a.op(`mal${i}-l`, 1); return { ru, st }; }
  if (t < me + 0.3) a.put(`mal${i}`, glide(ACID_OUT(i - 1), t, t0, me), 1 - ease(t, me, me + 0.2));
  a.op(`mal${i}-l`, 1 - ease(t, t0, t0 + 0.8));
  flash(a, t, me, S.camMe);
  if (t > me && t < ru + 0.3) a.put(`dco${i}`, glide(ME_CO2, t, me + 0.05, ru), ease(t, me, me + 0.2) * (1 - ease(t, ru, ru + 0.2)));
  a.op(`dco${i}-l`, lab ? ease(t, me + 0.4, me + 1.2) : 0);
  flash(a, t, ru + 0.1, S.mRub, 'fl2');
  if (t > me && t < st + 0.3) a.put(`pyr${i}`, glide(PYR, t, p0, st), ease(t, me, me + 0.2) * (1 - ease(t, st, st + 0.2)));
  a.op(`pyr${i}-l`, lab ? ease(t, me + 0.5, me + 1.3) : 0);
  return { ru, st };
}
/** ATP and NADPH: made at the lit granum (from t0, one after the other) and waiting there. */
function tags(a: Api, t: number, t0: number, dt = 1.2): void {
  a.put('atp', glide([GR, ATP_AT], t, t0, t0 + 1.0), ease(t, t0, t0 + 0.8), TAG);
  a.put('nadph', glide([GR, NADPH_AT], t, t0 + dt, t0 + dt + 1.0), ease(t, t0 + dt, t0 + dt + 0.8), TAG);
}
function frame(a: Api, beat: number, t: number): void {
  // time of day: the night tint, the stoma's pore, the clock
  const nightU = beat === 0 ? ease(t, 0, 1.2) : beat === 1 ? 1 : beat === 2 ? 1 - ease(t, 0, 1.2) : 0;
  a.op('night', 0.13 * nightU);
  const open = beat === 0 ? ease(t, 0.3, 1.4) : beat === 1 ? 1 : beat === 2 ? 1 - ease(t, 1.4, 2.5) : 0;
  a.html('guard', guardCells(PORE, Math.round(24 * open) / 2, true));
  // the clock stays: no closing question on slides 21 on (player.ts NOQ_KEYS)
  a.op('clk', 1); a.op('moon', nightU); a.op('sun', 1 - nightU);
  a.txt('clk-t', nightU > 0.5 ? 'night' : 'day'); a.txt('clk-s', open > 0.5 ? 'stomata open' : 'stomata closed');
  // the starch granule: full at dusk, smaller after the night, full again by the end of the day
  const st = beat === 0 ? lerp(1, 0.75, ease(t, 6.7, 7.7)) : beat === 1 ? lerp(0.75, 0.35, ease(t, 0.2, 4.0)) : beat === 2 ? lerp(0.35, 1, ease(t, 14.4, 16.0)) : 1;
  a.put('starchA', S.starch, 1, 0.45 + 0.55 * st);
  // the light's energy: by day the thylakoids lit, ATP and NADPH made there (beat 3), used for CO₂ 3, made again
  a.op('thyl', beat < 2 ? 0 : beat === 2 ? ease(t, 2.8, 3.6) : 1);
  // night: the stoma opens, 1 small water molecule leaves; CO₂ 1 in full steps, 2 and 3 quicker
  if (beat === 0) {
    if (t > 1.6 && t < 4.1) a.put('h2oL', glide(WATER_OUT, t, 1.6, 3.8), ease(t, 1.6, 2.4) * (1 - ease(t, 3.2, 4.0)));
    night(a, t, 1, 4.4, true);
  }
  if (beat === 1) { asleep(a, 1); night(a, t, 2, 0.2, false); night(a, t, 3, 1.4, false); }
  if (beat === 2) {
    tags(a, t, 3.8);
    // all 3 stored CO₂ get their faces back at once, then all 3 malic acids leave together (0.3 s apart, so they read as
    // one stream; malic acid 3 carries the labels; the flashes are its, the first)
    const T0 = 7.4, GAP = 0.3, ds = [1, 2, 3].map(i => {
      const t0 = T0 + (3 - i) * GAP;
      if (t < t0) { a.put(`mal${i}`, ACID_AT(i - 1), 1); a.op(`mal${i}-l`, 1); face(a, i, 1 - ease(t, 6.3, 7.1), 1 - ease(t, 6.3, 7.1)); return null; }
      return day(a, t, i, t0, true, i === 3);
    });
    // the Calvin–Benson–Bassham cycle uses the ATP and NADPH as it fixes the CO₂, in the same window (lecturer, lecture day:
    // "why do ATP and NADPH go after the CO₂ is fixed? They go at the same time"): they leave the granum as the first CO₂
    // leaves malic enzyme, reach RuBisCO with it, and are used up while the 3 CO₂ are fixed; the light makes new ones
    // once the last pyruvate is in
    const go = T0 + 1.8, fix0 = T0 + 3.4, fix1 = T0 + 2 * GAP + 3.4, last = fix1 + 3.6;
    // the 3 CO₂ fixed give 1 triose phosphate, which leaves the chloroplast before the pyruvate goes back to starch
    if (t > fix1) { a.put('tp', glide(TP_OUT, t, fix1 + 0.2, fix1 + 1.5), ease(t, fix1, fix1 + 0.8)); a.op('tp-l', ease(t, fix1 + 0.6, fix1 + 1.4)); }
    if (ds[2] && t > go) {
      const used = 1 - ease(t, fix0, fix1 + 0.5);
      if (t < last + 0.9) { a.put('atp', glide(ATP_USE, t, go, fix0), used, TAG); a.put('nadph', glide(NADPH_USE, t, go, fix0), used, TAG); }
      else tags(a, t, last + 1.0, 0);
    }
  }
  if (beat === 3) tags(a, t, -10);
  // the ledger
  const vis = (b: number, t0: number): number => (beat > b ? 1 : beat === b ? ease(t, t0, t0 + 0.8) : 0);
  panelShow(a, 'panel', ROWS, { r0: vis(0, 0.2), r1: vis(0, 10.0), r2: vis(2, 9.2), r3: vis(0, 11.4) });
  const nm = beat === 0 ? Number(t > 11.8) : beat === 1 ? 1 + Number(t > 0.2 + 4.4 * 0.62 + 0.2) + Number(t > 1.4 + 4.4 * 0.62 + 0.2) : beat === 2 ? 3 - Number(t > 7.7) - Number(t > 8.0) - Number(t > 8.3) : 0;
  a.txt('n-mal', String(nm));
  a.op('malL', nm > 0 && beat < 3 ? 1 : 0);
  a.op('card', beat === 3 ? ease(t, 0.2, 1.0) : 0);
}

const NIGHT: LPart[] = ['stoma', 'cam-n', 'ca', 'pepc', 'pep-starch', 'vac', 'm-cp'];
const DAY: LPart[] = ['stoma', 'vac', 'cam-d', 'cam-me', 'm-cp', 'm-rub'];

export const STAGING: Staging = {
  ...makeLeafStaging({
    id: 'lf13m2',
    name: 'm2 · One cell, night and day: CO₂ stored as malic acid in the vacuole; by day light makes ATP and NADPH first',
    note: 'lf13m polished: by night CO₂ 1–3 → HCO₃⁻ → PEPC → malic acid 1–3 into the vacuole (drawn asleep); by day the thylakoids light up and make ATP and NADPH, then all 3 malic acids leave at once: malic enzyme → CO₂ → RuBisCO, the ATP and NADPH used; water-use efficiency card',
    beats: BEATS,
    holds: HOLDS,
    leaf: { noGuard: true, acid: 2, hide: ['m-perox', 'm-mito', 'ppdk', 'me', 'bs-rub', 'bs-mito', 'starch'] },
    actors: ACTORS,
    world: p => `${thylG(p)}<g data-k="malL" display="none">${T(ACID_AT(2)[0], ACID_AT(2)[1] - 28, 'malic acid', 'cel-mn cel-halo')}</g><g data-k="guard"></g><g data-k="night" display="none"><rect class="lfa-night" x="-20" y="-20" width="${LW + 40}" height="${LH + 40}"/></g>`,
    hud: () => `${panelSvg('panel', PX, PY, PW, ROWS)}${clock()}${card()}`,
    cam: { s: 1.16, c: [0, 20], at: [10, 6] },
    clip: [0, 0, 712, 740],
    lit: [NIGHT, NIGHT, DAY, DAY],
    frame,
  }),
  // no key lines: no closing question on the animations of slide 21 on (player.ts NOQ_KEYS)
  keys: [],
};

// C4 · Sucrose and starch (beats CB4V2, beats-cb4n.ts), staging p, "The phosphate loop" (lecturer, 29 Oct 2026, evening;
// research/redo-2026-10-29/C4_ANIM_V2_BRIEF.md). A close-up across the chloroplast envelope in one fixed framing, in the
// real-protein style of the strip (figs/cell-schema.ts: renders at 2.4 px per Å, bilayers as in 7m1), here at 1.45 × the
// strip's scale: the chloroplast on the left with ATP synthase on a thylakoid edge and RuBisCO, TPT large in the inner
// envelope at the centre, the cytosol on the right where sucrose is made and leaves "to growing organs and the grain".
// Pᵢ runs round one loop: in through TPT (lower lane), used by ATP synthase to make ATP, carried out inside triose
// phosphate (upper lane), freed when the cytosol makes sucrose, back to TPT. The loop is lit part by part, as the
// captions name its parts; molecules move only on lit parts and fade where the light ends.
// - Beat 1, export: 4 triose phosphates leave through TPT, each crossing 1 Pᵢ coming in from the cytosol (they pass TPT
//   at the same moment). The triose phosphates wait in the cytosol; the Pᵢ go on into the (dimmed) chloroplast.
// - Beat 2, sucrose: the 4 triose phosphates lose their phosphates (4 Pᵢ, freed), and their 4 × 3 C join into sucrose's
//   two rows of 6 C, which leaves along the exit arrow. The 4 Pᵢ go back in through TPT, each paired with a triose
//   phosphate out; those 4 wait in the cytosol.
// - Beat 3, TPU: the chloroplast half lights. The 4 Pᵢ of beat 2 reach ATP synthase; each makes 1 ATP, which takes it to
//   the triose phosphate spot, where it becomes the phosphate of a triose phosphate (the 3 C come from the cycle, from
//   RuBisCO's side); the ADP goes back. Meanwhile sucrose is made slowly: no Pᵢ comes back, so no triose phosphate can
//   leave; the 4 new ones pile up at TPT, ATP synthase has no Pᵢ left and dims, and then the chloroplast's flows dim.
// - Beat 4, starch by day, sucrose at night: a day/night band. By day 2 triose phosphates go into the starch granule
//   (it grows; each one's Pᵢ is freed in the stroma and goes to ATP synthase) while export goes on (its arrow lit). At
//   night ATP synthase and export dim, the granule shrinks, and 2 sugars of 6 C leave it, cross the envelope and make
//   1 sucrose in the cytosol, which leaves for the plant.
// - Beat 5: RuBisCO lights; CO₂ and RuBP go into it; its carbon arrow to the triose phosphate spot lights.
// No numbers, no counters; the 1-for-1 exchange is shown by pairing. Motion ≈ 33 s in all.
import './cb4-p.css';
import tptPng from '../../assets/cell/tpt.png';
import tptG from '../../assets/cell/tpt-g.png';
import atpsPng from '../../assets/chain/atps.webp';
import rubPng from '../../assets/rf/rubisco-8ruc.png';
import rubG from '../../assets/cell/rubisco-g.png';
import { arrow, balls, bilayer } from '../figs/cell-schema';
import { tagG } from '../figs/chain';
import { atomBall, row, step } from '../figs/carbon-form';
import { attrSetter, curve, ease, f, glide, lerp, lerpV, moverSvg, placer, poolDefs, poolSvg, tAt, uNear, type Mover, type Path, type Put, type V } from './dk2-common';
import type { Staging } from './types';
import { withKeys } from './stage-keys-cb';

const P = 'c4p';
const R = 12, ST = step(R);
/* ---------------------------------------------------------------- where (stage units, 1600 × 740, no camera) */

/** Proteins and bilayers at K × the strip's scale (renders at 2.4 px per Å; 0.95 units per Å in the strip). */
const K = 1.45, PX = (0.95 / 2.4) * K, HALF = 19 * K, HEADR = 3.1 * K, HSTEP = 7.2 * K;
const IN = 760, OUT = Math.round(IN + 58 * K);
const TPTC: V = [IN, 335], YO = 311, YI = 359;
const THY = 650;
const ASW = 343 * PX, ASH = 557 * PX, ASX = 300 - 146.6 * PX, ASY = THY - 462.8 * PX;
const HEAD_IN: V = [398, 490], HEAD_OUT: V = [322, 386];
const RUB: V = [110, 225], RW = 548 * (0.95 / 4) * K, RH = 471 * (0.95 / 4) * K;
/** The triose phosphate spot (glyph centre), its phosphate, where the ATP waits under it. */
const TPS: V = [320, 228], PPOS: V = [TPS[0] + 1.5 * ST, TPS[1]], ATP_AT: V = [PPOS[0], TPS[1] + 40];
const SUC: V = [1130, 335];
const GRAN: V = [620, 118];
const NT: V = [IN, 150];
const F: V = [560, 414];

type Slot = 'TR' | 'BR' | 'TL' | 'BL';
/** The 4 triose phosphates' waiting slots in the cytosol (filled far ones first) and where their 3 C go in sucrose's two
 *  rows of 6 C (a glyph's 3 C sit at −1.5, −0.5, +0.5 steps of its centre, its P at +1.5). */
const SL: Slot[] = ['TR', 'BR', 'TL', 'BL'];
const RY = 13.5;
const FIN: Record<Slot, V> = { TR: [SUC[0] + 2 * ST, SUC[1] - RY], BR: [SUC[0] + 2 * ST, SUC[1] + RY], TL: [SUC[0] - ST, SUC[1] - RY], BL: [SUC[0] - ST, SUC[1] + RY] };
const SLOT: Record<Slot, V> = { TR: [FIN.TR[0] + 34, SUC[1] - 46.5], BR: [FIN.BR[0] + 34, SUC[1] + 46.5], TL: [FIN.TL[0] - 34, SUC[1] - 46.5], BL: [FIN.BL[0] - 34, SUC[1] + 46.5] };
const PAT = (s: Slot): V => [SLOT[s][0] + 1.5 * ST, SLOT[s][1]];
const TO_SLOT: Record<Slot, V[]> = { TR: [[1040, 292]], BR: [[1000, 348], [1100, 372]], TL: [[995, 297]], BL: [[985, 352]] };
/** Triose phosphates for export glide in from 60 left of the spot (fading in as they move, clear of the one ahead). */
const LANE_TOP: V[] = [[TPS[0] - 60, TPS[1]], TPS, [430, 238], [560, 268], [660, YO - 4], [IN, YO], [OUT, YO], [920, YO]];
const tpPath = (s: Slot): Path => curve([...LANE_TOP, ...TO_SLOT[s], SLOT[s]]);
/** The Pᵢ lane: 4 waiting spots under the station (W0 nearest TPT), then in through TPT to F, where the lit part of
 *  beats 1–2 ends; F on to ATP synthase. */
const W: V[] = [[1010, 446], [1075, 456], [1140, 460], [1205, 458]];
const LANE_IN: V[] = [W[3], W[2], W[1], W[0], [930, 412], [880, 372], [OUT, YI], [IN, YI], [690, 364], [610, 392], F];
const piPath = (k: number): Path => curve(LANE_IN.slice(3 - k));
const toHead = curve([F, [480, 455], HEAD_IN]);
/** Beat 2: the freed Pᵢ drop from their slot to the waiting spots (W index k ← slot). */
const SLOT_OF_W: Slot[] = ['BL', 'TL', 'BR', 'TR'];
const DROP: Record<Slot, V[]> = { BL: [[1084, 430]], TL: [[1136, 330], [1140, 405], [1100, 445]], BR: [[1238, 432]], TR: [[1302, 335], [1292, 425]] };
const dropPath = (k: number): Path => { const s = SLOT_OF_W[k]; return curve([PAT(s), ...DROP[s], W[k]]); };
/** Beat 3: the stroma queue at TPT (Q0 nearest, Q3 the triose phosphate spot) along the upper lane. */
const Q_LANE = curve([TPS, [430, 238], [560, 268], [660, YO - 4], [IN - 40, YO]]);
const sub = (p: Path, u0: number, u1: number): Path => u => p(u0 + (u1 - u0) * u);
const len = (p: Path, n = 240): number => { let L = 0, a = p(0); for (let i = 1; i <= n; i++) { const b = p(i / n); L += Math.hypot(b[0] - a[0], b[1] - a[1]); a = b; } return L; };
const uAtX = (p: Path, x: number): number => { let best = 0, bd = Infinity; for (let i = 0; i <= 600; i++) { const d = Math.abs(p(i / 600)[0] - x); if (d < bd) { bd = d; best = i / 600; } } return best; };
/** The 4 stuck triose phosphates: one glyph width plus 6 apart in x, the last on the spot itself. */
const QU = [0, 1, 2, 3].map(k => (k === 3 ? 0 : uAtX(Q_LANE, TPS[0] + (3 - k) * (4 * ST + 4 + 2))));
const qPath = (k: number): Path => sub(Q_LANE, 0, QU[k]);
const atpPath = curve([HEAD_OUT, [342, 330], ATP_AT]);
/** The ADP goes back to the head on its own track, left of the ATP's, so the two never meet. */
const adpPath = curve([ATP_AT, [280, 298], [248, 384]]);
const cccPath = curve([[TPS[0] - 92, TPS[1]], TPS]);
const pmPath = curve([ATP_AT, PPOS]);
const exitPath = curve([SUC, [1300, SUC[1]], [1490, SUC[1]]]);
/** Beat 4: into starch; the freed Pᵢ down to the Pᵢ lane and ATP synthase; at night the sugars out to sucrose's rows. */
const ST_END: V = [500, 172], ST_P: V = [ST_END[0] + 1.5 * ST, ST_END[1]];
/** Into starch: along the export lane first, then up (clear of the triose phosphate name). */
const stPath = curve([TPS, [400, 238], [452, 230], [490, 198], ST_END]);
const spPath = curve([ST_P, [560, 232], [585, 320], [572, 392], [520, 438], [460, 466], HEAD_IN]);
const hxPath = [
  curve([[735, 128], [IN, NT[1] + 1], [OUT, NT[1] + 2], [930, 182], [1062, 262], [SUC[0], SUC[1] - RY]]),
  curve([[735, 128], [IN, NT[1] + 1], [OUT, NT[1] + 2], [905, 200], [955, 280], [972, SUC[1] + RY], [SUC[0], SUC[1] + RY]]),
];
/** CO₂ comes in from above RuBisCO, inside the frame with its name. */
const P_CO2 = curve([[42, 66], [46, 124], [60, 196]]);
const P_RUBP = curve([[108, 530], [108, 430], [110, 318]]);

/* ---------------------------------------------------------------- timing */

interface G { p: Path; g: number; d: number }
const at = (q: G, t: number): V => glide(q.p, t, q.g, q.d);
const end = (q: G): number => q.g + q.d;
const V1 = 215, VN = 330;
const dur = (p: Path, v: number): number => Math.max(0.5, len(p) / v);
/** A glide over p at speed v that starts at g. */
const from = (p: Path, g: number, v: number): G => ({ p, g, d: dur(p, v) });
/** A glide over p at speed v that passes the point q at time c. */
const through = (p: Path, q: V, c: number, v: number): G => { const d = dur(p, v); return { p, d, g: c - tAt(uNear(p, q), 0, d) }; };
const XO: V = [IN, YO], XI: V = [IN, YI];

// beat 1: the first triose phosphate fades in at 0.4 and sets off at 0.8 (slower); the next every 0.72 s
const A_TP: G[] = [from(curve([...LANE_TOP.slice(1), ...TO_SLOT[SL[0]], SLOT[SL[0]]]), 0.8, V1)];
const C0 = [tAt(uNear(A_TP[0].p, XO), A_TP[0].g, A_TP[0].d)];
for (let k = 1; k < 4; k++) { C0.push(C0[0] + 0.72 * k); A_TP.push(through(tpPath(SL[k]), XO, C0[k], VN)); }
const A_PI = C0.map((c, k) => through(piPath(k), XI, c, k ? VN : V1));
const DUR0 = Math.max(...A_TP.map(end)) + 0.3;

// beat 2: phosphates off, the freed Pᵢ drop to the waiting spots, the 3 C slide into sucrose, which leaves; then 4 exchanges
const B2 = { off: [0.3, 0.6], slide: [1.25, 1.95], take: [1.95, 2.25], exit: 2.35 };
const B_DROP = [0, 1, 2, 3].map(k => from(dropPath(k), [0.6, 0.7, 0.65, 0.6][k], 300));
const B_EXIT: G = from(exitPath, B2.exit, 220);
const C1 = [3.05, 3.7, 4.35, 5.0];
const B_PI = C1.map((c, k) => through(piPath(k), XI, c, VN));
const B_TP = C1.map((c, k) => through(tpPath(SL[k]), XO, c, VN));
const DUR1 = Math.max(...B_TP.map(end)) + 0.25;

// beat 3: the 4 Pᵢ go on from F to ATP synthase; ATP to the triose phosphate spot; slow sucrose; ATP synthase dims
const S3 = [0, 1, 2, 3].map(k => 0.4 + 1.1 * k);
const H3 = S3.map(s => s + 0.8);
const ATP3 = H3.map(h => from(atpPath, h + 0.25, 300));
const B3 = ATP3.map(end);
const ADP3 = B3.map(b => from(adpPath, b + 0.3, 330));
const Q3 = B3.map((b, k) => from(qPath(k), b + 0.4, 300));
const DUR2 = 8.0;

// beat 4: day (2 triose phosphates into starch), dusk, night (2 sugars out, 1 sucrose), the sucrose leaves
const ST4 = [from(stPath, 0.8, 230), from(stPath, 1.6, 230)];
const SA4 = ST4.map(end);
const SP4 = SA4.map(a => from(spPath, a + 0.3, 300));
const DUSK = Math.max(4.6, ...SP4.map(end));
const HX4 = [from(hxPath[0], DUSK + 0.8, 330), from(hxPath[1], DUSK + 1.8, 330)];
const T4 = Math.max(...HX4.map(end)) + 0.05;
const N_EXIT: G = from(exitPath, T4 + 0.35, 300);
const DUR3 = end(N_EXIT) + 0.1;
/** The granule's scale: 0.7 when it appears, +0.15 for each triose phosphate in, down to 0.62 by night's sucrose. */
function granS(beat: number, t: number): number {
  if (beat === 3) return 0.7 + 0.15 * ease(t, SA4[0], SA4[0] + 0.4) + 0.15 * ease(t, SA4[1], SA4[1] + 0.4) - 0.38 * ease(t, DUSK + 0.7, T4);
  return 0.62;
}

// beat 5: CO₂ and RuBP into RuBisCO; its carbon arrow
const CO2: G = from(P_CO2, 0.5, 100), RUBP: G = from(P_RUBP, 0.6, 160);
const DUR4 = Math.max(end(CO2), end(RUBP)) + 1.0;
export const DURATIONS = [DUR0, DUR1, DUR2, DUR3, DUR4];

/* ---------------------------------------------------------------- glyphs */

const bond = `<path d="M${f(0.5 * ST)},0H${f(1.5 * ST)}" style="stroke:#6b6a64;stroke-width:${f(Math.max(1.6, R * 0.22))};fill:none"/>`;
/** Triose phosphate centred on its 4 atoms; its P (with its bond) fades on its own (data-k P-<key>). */
const tpG = (key: string): string => `<g data-k="P-${key}">${bond}${atomBall(1.5 * ST, 0, 'P', R)}</g>${row(-0.5 * ST, 0, 'CCC', { r: R })}`;
const piG = `<g class="chn-g">${tagG(0, 0, '', 'pi')}</g>`;
const atpG = (k: number): string => `<g class="chn-g"><g data-k="atpT${k}">${tagG(0, 0, 'ATP', 'atp')}</g><g data-k="adpT${k}" opacity="0">${tagG(0, 0, 'ADP', 'atp')}</g></g>`;
const sucG = `${row(0, -RY, 'CCCCCC', { r: R })}${row(0, RY, 'CCCCCC', { r: R })}`;
const LAB = 'c4p-lab';
const MOV: Mover[] = [
  ...[0, 1, 2, 3].map(k => ({ k: `a${k}`, svg: tpG(`a${k}`) })),
  ...[0, 1, 2, 3].map(k => ({ k: `b${k}`, svg: tpG(`b${k}`) })),
  ...[0, 1, 2, 3].map(k => ({ k: `c${k}`, svg: tpG(`c${k}`) })),
  ...[0, 1].map(k => ({ k: `st${k}`, svg: tpG(`st${k}`) })),
  ...[0, 1, 2, 3].map(k => ({ k: `pa${k}`, svg: piG })),
  ...[0, 1, 2, 3].map(k => ({ k: `pb${k}`, svg: piG })),
  ...[0, 1, 2, 3].map(k => ({ k: `pc${k}`, svg: piG })),
  ...[0, 1].map(k => ({ k: `sp${k}`, svg: piG })),
  ...[0, 1, 2, 3].map(k => ({ k: `atp${k}`, svg: atpG(k) })),
  ...[0, 1, 2, 3].map(k => ({ k: `pm${k}`, svg: atomBall(0, 0, 'P', R) })),
  ...[0, 1].map(k => ({ k: `hx${k}`, svg: row(0, 0, 'CCCCCC', { r: R }) })),
  ...['suc1', 'suc2', 'suc3'].map(k => ({ k, svg: sucG, label: 'sucrose', at: [0, -38] as V, cls: LAB })),
  { k: 'labA', svg: '', label: 'triose phosphate', at: [0, -26], cls: LAB },
  { k: 'co2', svg: `<g class="chn-g">${balls(0, 0, 'OCO', R)}</g>`, label: 'CO₂', at: [0, -22], cls: LAB },
  { k: 'rubp', svg: row(0, 0, 'PCCCCCP', { r: 12 }), label: 'RuBP', at: [0, 40], cls: LAB },
];

/* ---------------------------------------------------------------- the scene */

const T = (x: number, y: number, s: string, cls: string, a: 'start' | 'middle' | 'end' = 'middle'): string =>
  `<text class="${cls}" x="${f(x)}" y="${f(y)}" text-anchor="${a}">${s}</text>`;
const litG = (k: string, svg: string): string => `<g data-k="L-${k}" opacity="0"><g class="chn-on">${svg}</g></g>`;
const img = (href: string, x: number, y: number, w: number, h: number, extra = ''): string =>
  `<image href="${href}" x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}"${extra}/>`;

function sceneSvg(): string {
  const bil = (segs: Parameters<typeof bilayer>[0]): string => bilayer(segs, HALF, HEADR, HSTEP);
  const thy = [{ L: [-20, THY, 440, THY] as [number, number, number, number] }, { A: [440, THY + 110, 60, 110, -90, 0] as [number, number, number, number, number, number] }];
  const bg = `<rect class="cel-stroma" x="-20" y="-20" width="${IN + 20}" height="780"/><rect class="cel-ims" x="${IN}" y="-20" width="${OUT - IN}" height="780"/>
    <path class="cel-lumen" d="M-20,${THY}H440A60,110 0 0 1 500,${THY + 110}V780H-20Z"/>`;
  const mem = `${bil(thy)}${bil([{ L: [IN, -20, IN, 780] }])}${bil([{ L: [OUT, -20, OUT, 780] }])}`;
  const tptX = IN - 83.7 * PX, tptW = 159 * PX, tptH = 263 * PX, tptY = TPTC[1] - tptH / 2;
  const prots = `${img(tptG, tptX, tptY, tptW, tptH)}${img(atpsPng, ASX, ASY, ASW, ASH, ` filter="url(#${P}-grey)"`)}${img(rubG, RUB[0] - RW / 2, RUB[1] - RH / 2, RW, RH)}
    ${litG('tpt', `${img(tptPng, tptX, tptY, tptW, tptH)}${T(IN - HALF - 10, tptY + 8, 'TPT', 'c4p-prot', 'end')}`)}
    ${litG('atps', `${img(atpsPng, ASX, ASY, ASW, ASH)}${T(418, 600, 'ATP synthase', 'c4p-prot', 'start')}`)}
    ${litG('rub', `${img(rubPng, RUB[0] - RW / 2, RUB[1] - RH / 2, RW, RH)}${T(RUB[0] + 24, RUB[1] - RH / 2 - 12, 'RuBisCO', 'c4p-prot')}`)}
    ${litG('nt', `<rect class="cel-drawn" x="${f(NT[0] - 26)}" y="${f(NT[1] - 40)}" width="52" height="80" rx="17"/><path class="cel-wallf" d="M${NT[0] - 13},${NT[1] - 34}V${NT[1] + 34}M${NT[0]},${NT[1] - 37}V${NT[1] + 37}M${NT[0] + 13},${NT[1] - 34}V${NT[1] + 34}" style="stroke:#5f8f87;stroke-width:1.4"/>`)}`;
  const arrows = [
    litG('out', arrow([[TPS[0] + 62, TPS[1] + 4], [430, 238], [560, 268], [660, YO - 4], [IN, YO], [OUT, YO], [930, YO], [1000, YO]], 'c', { halo: true })),
    litG('ret', `<path class="cbb-a cbb-a-gas" d="M1300,400C1300,420 1296,440 1270,452S1230,458 1205,458"/>`),
    litG('in', arrow([W[3], W[2], W[1], W[0], [930, 412], [880, 372], [OUT, YI], [IN, YI], [690, 364], [610, 392], F], 'gas', { halo: true })),
    litG('inP', `<path class="cbb-a cbb-a-gas" d="${pathD(curve([W[3], W[2], W[1], W[0], [930, 412], [880, 372], [OUT, YI], [IN, YI], [690, 364], [610, 392], F]))}"/>`),
    litG('str', arrow([F, [480, 455], [HEAD_IN[0] + 8, HEAD_IN[1] - 2]], 'gas', { halo: true })),
    litG('atpl', arrow([[HEAD_OUT[0] + 2, HEAD_OUT[1] - 4], [342, 330], [ATP_AT[0], ATP_AT[1] + 18]], 'atp', { thin: true })),
    litG('exit', `${arrow([[1232, SUC[1]], [1565, SUC[1]]], 'c')}${T(1440, 394, 'to growing organs', LAB)}${T(1440, 420, 'and the grain', LAB)}`),
    litG('starch', `${arrow([[TPS[0] + 92, 238], [470, 224], [506, 192], [546, 158]], 'c', { thin: true })}${arrow([[548, 190], [582, 280], [574, 384]], 'gas', { thin: true })}`),
    litG('ntA', arrow([[705, 128], [IN, NT[1]], [OUT, NT[1] + 2], [930, 186], [1050, 262]], 'c', { thin: true })),
    litG('rc', arrow([[RUB[0] + RW / 2 + 2, TPS[1]], [TPS[0] - 58, TPS[1]]], 'c')),
  ].join('');
  const labels = `${T(IN - HALF - 16, 722, 'chloroplast', 'c4p-zone', 'end')}${T(OUT + HALF + 16, 722, 'cytosol', 'c4p-zone', 'start')}
    <text data-k="L-labTP" class="${LAB}" x="${TPS[0]}" y="${TPS[1] - 28}" text-anchor="middle" opacity="0">triose phosphate</text>`;
  const gran = `<g data-k="${P}-gran" opacity="0" transform="translate(${GRAN[0]} ${GRAN[1]}) scale(0.7)"><ellipse class="cel-starch" rx="100" ry="48" vector-effect="non-scaling-stroke"/>${[0.75, 0.5, 0.26].map(q => `<ellipse class="cel-starchr" rx="${f(100 * q)}" ry="${f(48 * q)}" vector-effect="non-scaling-stroke"/>`).join('')}</g>
    <text data-k="${P}-stl" class="${LAB}" x="${GRAN[0]}" y="${GRAN[1] + 7}" text-anchor="middle" opacity="0">starch</text>`;
  const sky = `<rect data-k="L-veil" class="c4p-veil" x="-20" y="-20" width="1640" height="780" opacity="0"/>
    <g data-k="L-day" opacity="0"><rect class="c4p-day" x="-20" y="0" width="1640" height="40"/>${T(800, 27, 'day', 'c4p-band')}</g>
    <g data-k="L-night" opacity="0"><rect class="c4p-night" x="-20" y="0" width="1640" height="40"/>${T(800, 27, 'night', 'c4p-band-n')}</g>`;
  const defs = `<defs><filter id="${P}-grey" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values=".12 .24 .05 0 .53 .12 .24 .05 0 .53 .12 .24 .05 0 .53 0 0 0 1 0"/></filter></defs>${poolDefs(P)}`;
  return `<g class="fig dk2 c4p">${defs}${bg}${mem}${poolSvg(P, 'L-glow', SUC, 140, 86)}${prots}${arrows}${gran}${labels}${MOV.map(moverSvg).join('')}${sky}</g>`;
}
function pathD(p: Path, n = 120): string {
  let d = '';
  for (let i = 0; i <= n; i++) { const q = p(i / n); d += `${i ? 'L' : 'M'}${f(q[0])},${f(q[1])}`; }
  return d;
}

/* ---------------------------------------------------------------- lighting */

type Lit = Record<string, number>;
function lit(b: number, t: number): Lit {
  const e = (a: number, z: number): number => ease(t, a, z);
  const L: Lit = { tpt: 1, labTP: 1, out: 1, in: 1, inP: 0, ret: 0, str: 0, atpl: 0, exit: 0, atps: 0, glow: 0, starch: 0, nt: 0, ntA: 0, rub: 0, rc: 0, day: 0, night: 0, veil: 0 };
  if (b === 0) { L.tpt = e(0, 0.6); L.labTP = 0; L.out = e(0.2, 0.8); L.in = e(0.2, 0.8); return L; }
  if (b === 1) { L.labTP = 0; L.ret = e(0.1, 0.6); L.glow = e(0.1, 0.6) * (1 - 0.5 * e(2.3, 3.0)); L.exit = e(1.7, 2.3); return L; }
  L.ret = 1; L.exit = 1;
  if (b === 2) {
    const slow = 1 - 0.55 * e(7.0, 7.8);
    L.labTP = e(B3[0] - 0.6, B3[0] - 0.2);
    L.in = 1 - e(0, 0.6); L.inP = e(0, 0.6);
    L.str = e(0.1, 0.7) * slow; L.atpl = e(0.1, 0.7) * slow; L.out = slow;
    L.atps = e(0.1, 0.8) * (1 - 0.75 * e(6.2, 7.0));
    L.glow = 0.5 * (1 - 0.6 * e(0.1, 0.9));
    return L;
  }
  L.in = 0;
  if (b === 3) {
    const back = e(0.2, 0.8), dusk = e(DUSK, DUSK + 0.8), lv = lerp(lerp(0.45, 1, back), 0.25, dusk);
    L.out = lv; L.str = lv; L.atpl = lv; L.inP = lerp(1, 0.25, dusk); L.ret = lerp(1, 0.25, dusk);
    L.atps = lerp(lerp(0.25, 1, back), 0, dusk);
    L.glow = lerp(0.2, 0.5, back) + 0.5 * e(T4 - 0.3, T4) * (1 - e(T4 + 0.6, T4 + 1.2));
    L.starch = e(0.5, 1.0) * (1 - 0.7 * dusk); L.labTP = lerp(1, 0.4, dusk);
    L.nt = e(DUSK + 0.1, DUSK + 0.7); L.ntA = L.nt;
    L.day = e(0.2, 0.8) * (1 - dusk); L.night = dusk; L.veil = 0.13 * dusk;
    return L;
  }
  const up = e(0, 0.8);
  L.night = 1 - up; L.veil = 0.13 * (1 - up);
  L.out = lerp(0.25, 1, up); L.str = L.out; L.atpl = L.out; L.inP = L.out; L.ret = L.out;
  L.atps = up; L.glow = 0.5; L.starch = lerp(0.3, 1, up); L.labTP = lerp(0.4, 1, up); L.nt = 1; L.ntA = 1;
  L.rub = e(0.2, 0.9); L.rc = e(end(RUBP) - 0.1, end(RUBP) + 0.5);
  return L;
}

/* ---------------------------------------------------------------- the script */

interface St { pos: Record<string, Put>; att: Record<string, number> }
const OFFP = (s: Slot): V => [PAT(s)[0] + 6, PAT(s)[1] + (s[0] === 'T' ? -34 : 34)];
function script(beat: number, t: number): St {
  const pos: Record<string, Put> = {}, att: Record<string, number> = {};
  const e = (a: number, z: number): number => ease(t, a, z);
  for (const k of ['a', 'b', 'c']) for (let i = 0; i < 4; i++) att[`P-${k}${i}`] = 1;
  att['P-st0'] = 1; att['P-st1'] = 1;
  for (let i = 0; i < 4; i++) { att[`atpT${i}`] = 1; att[`adpT${i}`] = 0; }

  if (beat === 0) {
    A_TP.forEach((q, k) => { pos[`a${k}`] = { at: at(q, t), o: k ? e(q.g - 0.05, q.g + 0.3) : e(q.g - 0.4, q.g) }; });
    // the first one carries the name, except while it passes TPT
    const a0 = at(A_TP[0], t);
    pos.labA = { at: a0, o: e(A_TP[0].g - 0.4, A_TP[0].g) * (1 - ease(a0[0], 495, 555) + ease(a0[0], 975, 1030)) };
    A_PI.forEach((q, k) => { pos[`pa${k}`] = { at: at(q, t), o: e(0.2 + 0.1 * k, 0.7 + 0.1 * k) * (1 - e(end(q) - 0.35, end(q))) }; });
  }
  if (beat === 1) {
    const slide = e(B2.slide[0], B2.slide[1]), take = e(B2.take[0], B2.take[1]);
    SL.forEach((s, k) => {
      pos[`a${k}`] = { at: lerpV(SLOT[s], FIN[s], slide), o: 1 - take };
      att[`P-a${k}`] = 1 - e(B2.off[0], B2.off[1]);
    });
    B_DROP.forEach((q, k) => {
      const ex = B_PI[k];
      pos[`pb${k}`] = t < ex.g ? { at: at(q, t), o: e(B2.off[0], B2.off[1]) } : { at: at(ex, t), o: 1 - e(end(ex) - 0.35, end(ex)) };
    });
    pos.labA = { at: SLOT[SL[0]], o: 1 - e(B2.off[0], B2.off[1]) };
    pos.suc1 = { at: at(B_EXIT, t), o: take * (1 - e(end(B_EXIT) - 0.45, end(B_EXIT))) };
    B_TP.forEach((q, k) => { pos[`b${k}`] = { at: at(q, t), o: e(q.g - 0.05, q.g + 0.3) }; });
  }
  if (beat === 2) {
    // slow sucrose: the phosphates come off slowly (freed Pᵢ step out a little), the 3 C creep together
    const slide = e(1.5, 7.4), take = e(7.4, 7.7);
    SL.forEach((s, k) => {
      pos[`b${k}`] = { at: lerpV(SLOT[s], FIN[s], slide), o: 1 - take };
      att[`P-b${k}`] = 1 - e(0.8, 6.8);
    });
    SLOT_OF_W.forEach((s, k) => { pos[`pc${k}`] = { at: lerpV(PAT(s), OFFP(s), e(0.8, 6.8)), o: e(0.8, 6.8) }; });
    pos.suc2 = { at: SUC, o: take };
    // the chloroplast: Pᵢ → ATP synthase → ATP → triose phosphate → the queue at TPT
    for (let k = 0; k < 4; k++) {
      const s = S3[k], h = H3[k], b = B3[k];
      pos[`pb${k}`] = { at: glide(toHead, t, s, 0.8), o: e(s - 0.3, s) * (1 - e(h - 0.15, h + 0.05)) };
      const back = t >= b + 0.3;
      pos[`atp${k}`] = { at: back ? at(ADP3[k], t) : at(ATP3[k], t), o: e(h + 0.05, h + 0.3) * (1 - e(end(ADP3[k]) - 0.2, end(ADP3[k]))) };
      att[`atpT${k}`] = 1 - e(b + 0.05, b + 0.25); att[`adpT${k}`] = e(b + 0.05, b + 0.25);
      pos[`pm${k}`] = { at: glide(pmPath, t, b, 0.35), o: e(b - 0.05, b + 0.05) * (1 - e(b + 0.33, b + 0.36)) };
      const cin = glide(cccPath, t, b - 0.55, 0.55);
      pos[`c${k}`] = { at: t < Q3[k].g ? cin : at(Q3[k], t), o: e(b - 0.55, b - 0.3) };
      att[`P-c${k}`] = e(b + 0.32, b + 0.36);
    }
  }
  if (beat === 3) {
    // the stalled loop of beat 3 gives way
    const gone = 1 - e(0, 0.5);
    for (let k = 0; k < 4; k++) {
      pos[`c${k}`] = { at: Q_LANE(QU[k]), o: gone };
      pos[`pc${k}`] = { at: OFFP(SLOT_OF_W[k]), o: gone };
    }
    pos.suc2 = { at: SUC, o: gone };
    // day: 2 triose phosphates into starch; each one's Pᵢ freed there goes to ATP synthase
    ST4.forEach((q, k) => {
      const a = end(q), inG = e(a, a + 0.4);
      pos[`st${k}`] = { at: lerpV(at(q, t), [GRAN[0] - 20, GRAN[1] + 6], inG), o: e(q.g - 0.4, q.g) * (1 - e(a + 0.1, a + 0.4)), s: 1 - 0.55 * inG };
      att[`P-st${k}`] = 1 - e(a - 0.02, a + 0.02);
      const sp = SP4[k];
      pos[`sp${k}`] = { at: at(sp, t), o: e(a - 0.05, a + 0.1) * (1 - e(end(sp) - 0.25, end(sp))) };
    });
    // night: 2 sugars of 6 C from the granule, across the envelope, into sucrose's two rows; the sucrose leaves
    const take = e(T4, T4 + 0.3);
    HX4.forEach((q, k) => { pos[`hx${k}`] = { at: at(q, t), o: e(q.g + 0.05, q.g + 0.45) * (1 - take) }; });
    pos.suc3 = { at: at(N_EXIT, t), o: take * (1 - e(end(N_EXIT) - 0.45, end(N_EXIT))) };
  }
  if (beat === 4) {
    pos.co2 = { at: at(CO2, t), o: e(CO2.g - 0.1, CO2.g + 0.3) * (1 - e(end(CO2) - 0.1, end(CO2) + 0.2)) };
    pos.rubp = { at: at(RUBP, t), o: e(RUBP.g - 0.1, RUBP.g + 0.3) * (1 - e(end(RUBP) - 0.1, end(RUBP) + 0.2)) };
  }
  return { pos, att };
}

const STAGING_BASE: Staging = {
  id: 'p',
  name: 'p · The phosphate loop',
  note: 'A close-up across the envelope, one framing: Pᵢ runs one loop, in through TPT, into ATP at ATP synthase, out inside triose phosphate, freed when sucrose is made, back to TPT; the loop slows in TPU; starch by day and sucrose from starch at night; RuBisCO last',
  svg: sceneSvg,
  bind(stage) {
    const put = placer(stage, MOV.map(m => m.k)), A = attrSetter(stage);
    const keys = Object.keys(lit(0, 0));
    return (beat, t) => {
      const L = lit(beat, t);
      for (const k of keys) A(`L-${k}`, 'opacity', L[k]);
      const g = beat < 3 ? 0 : beat === 3 ? ease(t, 0.3, 0.9) : 1;
      A(`${P}-gran`, 'opacity', g); A(`${P}-stl`, 'opacity', g);
      A(`${P}-gran`, 'transform', `translate(${GRAN[0]} ${GRAN[1]}) scale(${f(granS(beat, t))})`);
      const { pos, att } = script(beat, t);
      put(pos);
      for (const [k, v] of Object.entries(att)) A(k, 'opacity', v);
    };
  },
};

/** Each beat's key line and the closing question, big on the stage (lecturer, 29 Oct 2026: "people don't read the
 *  text under the animation"). */
export const STAGING = withKeys(STAGING_BASE, [
  { beat: 0, lines: ['Triose phosphate out, Pᵢ in'], x: 1225, y: 600, size: 36, at: 1.5 },
  { beat: 1, lines: ['Sucrose: to growing organs and grain'], x: 1225, y: 600, size: 34, at: 1.5 },
  { beat: 2, lines: ['Too little Pᵢ: photosynthesis slows (TPU)'], x: 1225, y: 600, size: 32, at: 1.5 },
  { beat: 3, lines: ['Starch by day, sucrose at night'], x: 1225, y: 600, size: 36, at: 1.5 },
  { beat: 4, lines: ['But RuBisCO also adds O₂:', 'what happens to its product, 2-PG?'], x: 800, y: 470, size: 44, at: 1.5 },
]);

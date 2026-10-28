// C7 · Light-response curve (beats RF7), staging s: the real-protein strip (dk2-common.ts; DARK_ANIM_BRIEF.md) with a
// graph panel at the side, as balance-s2/s3 on 10b. The light rises once, 0 → 2000 µmol photons m⁻² s⁻¹; the curve
// draws as it rises, and the part that limits uptake is lit in the strip. Concept level: no counts.
// - Beat 1, darkness: the strip shows the mitochondrion (its membranes lit, its photorespiratory enzymes not); CO₂ leaves
//   it; the dot sits below zero.
// - Beat 2, light compensation point: the camera moves to the chloroplast; dim light, a little ATP and NADPH, one CO₂ to
//   RuBisCO; the dot reaches zero.
// - Beat 3, quantum yield: light 32 → 300; electron transport (light, thylakoid, ATP and NADPH supply) is lit as the
//   limit; ATP, NADPH and CO₂ come faster; the curve's straight part and its slope.
// - Beat 4, light saturation: 300 → 2000; past the bend the limit passes to RuBisCO and the cycle (lit), the supply dims;
//   ATP and NADPH back up before GAPDH; the curve levels off.
// - Beat 5, sun and shade: the shade-grown curve draws beside the sun-grown one.
// - Beat 6, which limit: the cycle stays lit at the plateau; ends on the caption's question.
// Data: Huang, Zhang & Hu 2014, Fig. 1C, read off the figure (as slide C7 v6 and rf7-d): tobacco grown in 95 % and 28 %
// of sunlight; light-saturated net CO₂ uptake 21.8 and 13.1 µmol m⁻² s⁻¹, light compensation points 32 and 20.
import { balls, SX } from '../figs/cell-schema';
import { tagG } from '../figs/chain';
import {
  attrSetter, AX, AY, axesSvg, camAt, camTf, cardSvg, curve, ease, f, fnPath, frame, gasPath, glide, lerp, litOf, mixLit,
  hidePhotoresp, monotone, moverSvg, placer, poolDefs, poolSvg, sceneSvg, SP, Strip, type Axes, type Cam, type LitMap, type Mover, type Path, type Put,
} from './dk2-common';
import type { Staging } from './types';

const P = 'dkr7';

/* ---------------------------------------------------------------- data and the light */

const PPFD = [0, 20, 50, 100, 200, 300, 500, 800, 1200, 1600, 2000];
const SUN = [-2.2, -0.8, 1.4, 4.3, 8.8, 12.4, 16.7, 19.7, 21.1, 21.8, 21.8];
const SHADE = [-1.0, 0.0, 1.8, 3.9, 6.7, 8.6, 10.4, 11.6, 12.3, 12.9, 13.1];
const sun = monotone(PPFD.map((q, i) => [q, SUN[i]])), shade = monotone(PPFD.map((q, i) => [q, SHADE[i]]));
/** The light at (beat, t): one rise, 0 → 32 → 300 → 2000. */
function light(beat: number, t: number): number {
  if (beat === 0) return 0;
  if (beat === 1) return 32 * ease(t, PAN + 0.3, PAN + 2.8);
  if (beat === 2) return lerp(32, 300, ease(t, 0.5, 5.0));
  if (beat === 3) return lerp(300, 2000, ease(t, 0.4, 5.4));
  return 2000;
}
const shadeTo = (beat: number, t: number): number => (beat === 4 ? 2000 * ease(t, 0.5, 4.3) : beat > 4 ? 2000 : 0);

/* ---------------------------------------------------------------- the panel (stage units) */

const AXS: Axes = { x0: 1076, y0: 96, w: 460, h: 404, xr: [0, 2000], yr: [-5, 25] };
const S0 = (sun(100) - sun(0)) / 100;
function panelSvg(): string {
  const a = AXS, lab = (k: string, x: number, y: number, s: string, anchor = 'start', cls = 'dk2-gl'): string =>
    `<text data-k="${P}-${k}" class="${cls}" x="${f(x)}" y="${f(y)}" text-anchor="${anchor}" opacity="0">${s}</text>`;
  return `<g data-k="${P}-panel">${cardSvg(956, 22, 622, 670)}
    ${axesSvg(a, [0, 500, 1000, 1500, 2000], [-5, 0, 5, 10, 15, 20, 25], 'light (µmol photons m⁻² s⁻¹)', 'net CO₂ uptake (µmol m⁻² s⁻¹)', { zero: true })}
    <g data-k="${P}-qy" opacity="0"><path class="dk2-cursor" d="M${f(AX(a, 0))},${f(AY(a, sun(0)))}L${f(AX(a, 420))},${f(AY(a, sun(0) + S0 * 420))}"/></g>
    <path data-k="${P}-cs" class="dk2-cur" d="M0,0"/><path data-k="${P}-ch" class="dk2-cur dk2-cur-amber" d="M0,0"/>
    <circle data-k="${P}-dot" class="dk2-dot" r="7"/><circle data-k="${P}-doth" class="dk2-dot dk2-dot-amber" r="7" opacity="0"/>
    <path data-k="${P}-lcp" class="dk2-tick" d="M${f(AX(a, 32))},${f(AY(a, 0) - 9)}v18" opacity="0"/>
    ${lab('l-lcp', AX(a, 70), AY(a, -2.6), 'light compensation point')}
    ${lab('l-qy', AX(a, 440), AY(a, sun(0) + S0 * 420) + 6, 'slope: quantum yield')}
    ${lab('l-sat', AX(a, 2000), AY(a, 21.8) - 16, 'light saturation', 'end')}
    ${lab('l-sun', AX(a, 2000), AY(a, 21.8) - 16, 'grown in 95 % sunlight', 'end')}
    ${lab('l-sh', AX(a, 2000), AY(a, 13.1) + 30, 'grown in 28 % sunlight', 'end', 'dk2-gl dk2-gl-amber')}
    <text class="dk2-cr" x="1562" y="676" text-anchor="end">tobacco: Huang, Zhang &amp; Hu 2014, Fig. 1C</text></g>`;
}

/* ---------------------------------------------------------------- the strip: framings, lighting, glyphs */

/** The animation's one camera move (beat 2, 0 → 2.4 s, eased): a pan at constant scale from the mitochondrion to the
 *  chloroplast; nothing moves while it runs. */
const CAMS: Cam[] = [frame(780, 1544, 0, 940, -14), frame(-10, 754, 0, 940, -14)];
const PAN = 2.4;
const CAM = (b: number): Cam => CAMS[Math.min(1, b)];
const SUPPLY = ['light', 'thyl', 'supply'], CYCLE = ['rubisco', 'co2', 'carbox', 'reduce', 'tp', 'regen'];
/** The limit is lit; the other side at a third. Past the bend (≈ 500–900 µmol m⁻² s⁻¹) the limit passes to the cycle. */
function lit(beat: number, t: number): LitMap {
  if (beat === 0) return mixLit({}, { 'mito:mem': 1, 'mito-name': 1, 'co2-out:flow': 1 }, ease(t, 0.1, 0.9));
  const q = light(beat, t), on = Math.min(1, 0.35 + q / 50), pass = ease(q, 500, 900);
  const L = { ...litOf(SUPPLY, on * lerp(1, 0.35, pass)), ...litOf(CYCLE, lerp(0.35, 1, pass) * Math.min(1, 0.4 + q / 60)) };
  return beat === 1 ? mixLit({ 'mito:mem': 1, 'mito-name': 1, 'co2-out:flow': 1 }, L, ease(t, 0.2, 1.2)) : L;
}

/** Supply paths (the strip's ATP and NADPH arrows, from the thylakoid to GAPDH) and CO₂ into RuBisCO. */
const P_N: Path = curve([[-4, 64], [100, 64], [150, 96], [188, 166]]), P_A: Path = curve([[-4, 96], [86, 98], [124, 146], [182, 204]]);
const P_C: Path = gasPath('co2', 24);
/** Respiration's CO₂ leaves the mitochondrion and stays above it, released. */
const P_R = (i: number): Path => curve([[1340 + 22 * i, 330 - 40 * i], [1320 + 34 * i, 200], [1290 + 50 * i, 70], [1270 + 70 * i, i === 1 ? 6 : 22]]);
/** Per beat: when each ATP / NADPH / CO₂ sets off (s), and how long it glides; the last `queue` of beat 4 back up. */
const PLAN: Record<number, { a: number[]; c: number[]; d: number; queue?: number }> = {
  1: { a: [PAN + 0.5], c: [PAN + 1.2], d: 2.2 },
  2: { a: [0.6, 1.6, 2.4, 3.0, 3.5, 3.9], c: [1.0, 2.0, 2.8, 3.4, 3.9], d: 1.8 },
  3: { a: [0.4, 0.8, 1.2, 1.6, 2.0, 2.6], c: [0.6, 1.3, 2.0, 2.7, 3.4, 4.1], d: 1.6, queue: 2 },
};
const QA = [1, 0.68], QN = [1, 0.73];
const MOV: Mover[] = [
  ...[0, 1, 2, 3, 4, 5].map(i => ({ k: `a${i}`, svg: `<g class="chn-g">${tagG(0, 0, 'ATP', 'atp')}</g>` })),
  ...[0, 1, 2, 3, 4, 5].map(i => ({ k: `n${i}`, svg: `<g class="chn-g">${tagG(0, 0, 'NADPH', 'nadph')}</g>` })),
  ...[0, 1, 2, 3, 4, 5].map(i => ({ k: `c${i}`, svg: `<g class="chn-g">${balls(0, 0, 'OCO')}</g>` })),
  ...[0, 1, 2].map(i => ({ k: `r${i}`, svg: `<g class="chn-g">${balls(0, 0, 'OCO')}</g>`, label: i === 0 ? 'CO₂' : undefined, at: [0, -22] as [number, number] })),
];
function script(beat: number, t: number): Record<string, Put> {
  const pos: Record<string, Put> = {};
  if (beat === 0) [0, 1, 2].forEach(i => { const g = 0.8 + 0.9 * i; pos[`r${i}`] = { at: glide(P_R(i), t, g, 2.6), o: ease(t, g - 0.2, g + 0.3) }; });
  if (beat === 1) [0, 1, 2].forEach(i => { pos[`r${i}`] = { at: P_R(i)(1), o: 1 - ease(t, PAN, PAN + 0.4) }; });
  const pl = PLAN[Math.min(beat, 3)];
  if (pl && beat <= 3) {
    pl.a.forEach((g, i) => {
      const q = pl.queue && i >= pl.a.length - pl.queue ? i - (pl.a.length - pl.queue) : -1;
      const end = q < 0 ? 1 : 0;
      const ua = ease(t, g, g + pl.d) * (q < 0 ? 1 : QA[q]), un = ease(t, g + 0.2, g + 0.2 + pl.d) * (q < 0 ? 1 : QN[q]);
      pos[`a${i}`] = { at: P_A(ua), o: ease(t, g - 0.2, g + 0.2) * (1 - end * ease(t, g + pl.d - 0.1, g + pl.d + 0.3)) };
      pos[`n${i}`] = { at: P_N(un), o: ease(t, g, g + 0.4) * (1 - end * ease(t, g + pl.d + 0.1, g + pl.d + 0.5)) };
    });
    pl.c.forEach((g, i) => { pos[`c${i}`] = { at: glide(P_C, t, g, pl.d), o: ease(t, g - 0.2, g + 0.2) * (1 - ease(t, g + pl.d - 0.2, g + pl.d + 0.2)) }; });
  }
  if (beat >= 4) for (let q = 0; q < 2; q++) { const i = 4 + q; pos[`a${i}`] = { at: P_A(QA[q]), o: 1 }; pos[`n${i}`] = { at: P_N(QN[q]), o: 1 }; }
  return pos;
}

export const STAGING: Staging = {
  id: 's',
  name: 's · In the protein strip',
  note: 'The dark-reaction strip with the light-response curve beside it: in darkness CO₂ leaves the mitochondrion; as light rises, electron transport (thylakoid, ATP and NADPH) is lit as the limit, then past the bend RuBisCO and the cycle; then the shade-grown curve',
  svg: () => sceneSvg(P, { under: `${poolDefs(P)}${poolSvg(P, `${P}-mpool`, SX.mito, 190, 270)}`, movers: MOV.map(moverSvg).join(''), hud: panelSvg() }),
  bind(stage) {
    const S = new Strip(stage);
    S.retag('mito', 'text', el => !!el.textContent?.includes('mitochondrion'), 'mito-name');
    S.hide('co2-out', 'text'); hidePhotoresp(S);
    const cam = stage.querySelector('[data-k="cam"]') as SVGGElement;
    const put = placer(stage, MOV.map(m => m.k)), A = attrSetter(stage);
    const show = (k: string, b: number, beat: number, t: number, keep = false): void =>
      A(`${P}-${k}`, 'opacity', beat === b ? ease(t, 0.6, 1.2) : keep && beat > b ? 1 : beat === b + 1 ? 1 - ease(t, 0, 0.5) : 0);
    return (beat, t) => {
      cam.setAttribute('transform', camTf(beat <= 1 ? camAt(CAMS, beat, t, PAN) : CAM(beat)));
      A(`${P}-mpool`, 'opacity', beat === 0 ? 0.8 * ease(t, 0.2, 1.0) : beat === 1 ? 0.8 * (1 - ease(t, 0, 0.8)) : 0);
      S.light(lit(beat, t));
      put(script(beat, t));
      const q = light(beat, t), qh = shadeTo(beat, t);
      A(`${P}-cs`, 'd', fnPath(AXS, sun, 0, Math.max(q, 0.01), 140));
      A(`${P}-dot`, 'cx', AX(AXS, q)); A(`${P}-dot`, 'cy', AY(AXS, sun(q)));
      A(`${P}-ch`, 'd', qh > 0 ? fnPath(AXS, shade, 0, qh, 140) : 'M0,0');
      A(`${P}-doth`, 'opacity', beat >= 4 ? ease(t, beat === 4 ? 0.3 : -1, beat === 4 ? 0.6 : 0) : 0);
      A(`${P}-doth`, 'cx', AX(AXS, qh)); A(`${P}-doth`, 'cy', AY(AXS, shade(qh)));
      A(`${P}-lcp`, 'opacity', beat === 1 ? ease(t, PAN + 2.6, PAN + 3.1) : beat === 2 ? 1 - ease(t, 0, 0.5) : 0);
      A(`${P}-l-lcp`, 'opacity', beat === 1 ? ease(t, PAN + 2.7, PAN + 3.3) : beat === 2 ? 1 - ease(t, 0, 0.5) : 0);
      A(`${P}-qy`, 'opacity', beat === 2 ? ease(t, 2.4, 3.2) : beat === 3 ? 1 - ease(t, 0, 0.5) : 0);
      A(`${P}-l-qy`, 'opacity', beat === 2 ? ease(t, 2.8, 3.4) : beat === 3 ? 1 - ease(t, 0, 0.5) : 0);
      A(`${P}-l-sat`, 'opacity', beat === 3 ? ease(t, 4.4, 5.2) : beat === 4 ? 1 - ease(t, 0, 0.5) : 0);
      show('l-sun', 4, beat, t, true);
      A(`${P}-l-sh`, 'opacity', beat === 4 ? ease(t, 3.6, 4.3) : beat > 4 ? 1 : 0);
    };
  },
};

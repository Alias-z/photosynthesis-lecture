// C8 · FvCB model (beats RF8), staging s: the real-protein strip (dk2-common.ts; DARK_ANIM_BRIEF.md) with an A/Cᵢ panel
// at the side. Cᵢ rises once, 50 → 1300 ppm; as each FvCB limit draws, the strip part it stands for is lit: A_c RuBisCO
// (with CO₂ and carboxylation), A_j the thylakoid supply (light, ATP and NADPH, reduction, regeneration), A_p triose
// phosphate's use (triose phosphate, TPT and sucrose, starch). The actual rate, the lowest of the three, is the thick ink
// line under the dot. Concept level: no counts.
// - Beat 1, A_c: CO₂ reaches RuBisCO slowly while 2 RuBP wait beside it; Cᵢ 50 → 200.
// - Beat 2, today's air: Cᵢ 200 → 300 (marked); the supply side half lit, near the switch.
// - Beat 3, A_j: past the switch (≈ 320 ppm) the supply is lit; the spare RuBP are gone and RuBP comes back from PRK one
//   at a time, fed by ATP and NADPH; Cᵢ 300 → 600.
// - Beat 4, A_p: past ≈ 690 ppm triose phosphate piles up, while one leaves through TPT for one Pᵢ; Cᵢ 600 → 1300.
// - Beat 5, the FvCB model: the three limits lit together; the actual rate is the lowest; ends on the caption's question.
// Model: anim/rf8-common.ts (Ac, Aj, Ap, An; V = 104, J/4 = 40.3, Γ* = 40 ppm, K = 710 ppm, R = 1, A_p = 33, fitted there
// to the lecturer's MSc thesis Fig. 5, wheat; A_p is a schematic cap, as there).
import { row } from '../figs/carbon-form';
import { balls } from '../figs/cell-schema';
import { tagG } from '../figs/chain';
import { Ac, Aj, An, Ap, CJ, JP } from './rf8-common';
import {
  attrSetter, AX, AY, axesSvg, camTf, cardSvg, curve, ease, f, fnPath, frame, gasPath, glide, hidePhotoresp, lerp, lerpV,
  litOf, mixLit, moverSvg, placer, sceneSvg, SP, Strip, type Axes, type LitMap, type Mover, type Path, type Put, type V,
} from './dk2-common';
import type { Staging } from './types';

const P = 'dkr8';

/* ---------------------------------------------------------------- Cᵢ and the panel */

function ci(beat: number, t: number): number {
  if (beat === 0) return lerp(50, 200, ease(t, 0.8, 5.4));
  if (beat === 1) return lerp(200, 300, ease(t, 0.4, 3.0));
  if (beat === 2) return lerp(300, 600, ease(t, 0.5, 5.0));
  if (beat === 3) return lerp(600, 1300, ease(t, 0.5, 5.0));
  return 1300;
}
const AXS: Axes = { x0: 1112, y0: 96, w: 436, h: 404, xr: [0, 1400], yr: [-5, 40] };
const sub = (s: string): string => `<tspan class="cbb-sub" dy="5">${s}</tspan>`;
function panelSvg(): string {
  const a = AXS;
  const lim = (k: 'c' | 'j' | 'p') => `<path data-k="${P}-${k}" class="dk2-lim dk2-lim-${k}" d="M0,0"/>`;
  const sym = (k: 'c' | 'j' | 'p', x: number, y: number, anchor = 'start') => `<text data-k="${P}-s${k}" class="dk2-lsym dk2-lt-${k}" x="${f(x)}" y="${f(y)}" text-anchor="${anchor}" opacity="0">A${sub(k)}</text>`;
  return `<g data-k="${P}-panel">${cardSvg(1016, 22, 562, 670)}
    <defs><clipPath id="${P}-pc"><rect x="${a.x0}" y="${a.y0 - 4}" width="${a.w + 8}" height="${a.h + 8}"/></clipPath></defs>
    ${axesSvg(a, [0, 400, 800, 1200], [0, 10, 20, 30, 40], '<tspan font-style="italic">C</tspan>ᵢ (ppm)', 'net CO₂ uptake (µmol m⁻² s⁻¹)', { zero: true })}
    <g data-k="${P}-air" opacity="0"><path class="dk2-cursor" d="M${f(AX(a, 300))},${f(a.y0 + 20)}V${f(a.y0 + a.h)}"/>
      <text class="dk2-gl" x="${f(AX(a, 300) - 8)}" y="${f(a.y0 + 40)}" text-anchor="end"><tspan font-style="italic">C</tspan>ᵢ in today’s air</text></g>
    <g clip-path="url(#${P}-pc)">${lim('c')}${lim('j')}${lim('p')}<path data-k="${P}-act" class="dk2-act" d="M0,0"/></g>
    <circle data-k="${P}-dot" class="dk2-dot" r="8"/>
    ${sym('c', AX(a, 420), AY(a, 37), 'end')}${sym('j', AX(a, 1380), AY(a, Aj(1380)) - 10, 'end')}${sym('p', AX(a, 1380), AY(a, Ap(1380)) + 28, 'end')}
    <text class="dk2-cr" x="1562" y="676" text-anchor="end">after Zhang 2021, MSc thesis, Fig. 5 (wheat) · A<tspan dy="3">p</tspan><tspan dy="-3"> added</tspan></text></g>`;
}

/* ---------------------------------------------------------------- the strip */

const CAM = frame(-10, 1000, 0, 1000, -60, 20);
const LC = ['rubisco', 'co2', 'carbox'], LJ = ['light', 'thyl', 'supply', 'reduce', 'regen'], LP = ['tp', 'export', 'starch'];
/** The limiting part lit, the others at a third; at the switches (≈ 320 and ≈ 690 ppm) the light passes over. */
function lit(beat: number, t: number): LitMap {
  const c = ci(beat, t), j = ease(c, CJ - 25, CJ + 25), p = ease(c, JP - 30, JP + 30);
  let L: LitMap = { ...litOf(LC, lerp(1, 0.3, j)), ...litOf(LJ, beat === 1 ? 0.3 + 0.35 * ease(t, 0.4, 3.0) : lerp(0.3, 1, j) * lerp(1, 0.3, p)), ...litOf(LP, lerp(0.3, 1, p)) };
  if (beat === 4) L = mixLit(L, { ...litOf(LC), ...litOf(LJ), ...litOf(LP) }, ease(t, 0.3, 1.2));
  return beat === 0 ? mixLit({}, L, ease(t, 0.1, 0.9)) : L;
}

const R = 11;
const P_C: Path = gasPath('co2', 24);
/** The 2 spare RuBP of beat 1 wait at the RuBP spot. */
const WAIT: V[] = [SP.rubp, [SP.rubp[0], SP.rubp[1] + 34]];
/** RuBP made by PRK (lower right) slides in to the RuBP spot and goes up into RuBisCO along its arrow. */
const P_RUBP = curve([[SP.rubp[0] + 60, SP.rubp[1] + 6], SP.rubp, SP.rubpFrom, SP.rubpTo]);
const P_N: Path = curve([[-4, 64], [100, 64], [150, 96], [188, 166]]), P_A: Path = curve([[-4, 96], [86, 98], [124, 146], [182, 204]]);
const P_EXP: Path = curve([SP.tp, [460, 97], [570, 96], [690, 99], [760, 100], [830, 99], [900, 70]]);
const P_PI: Path = curve([SP.pi, [860, 140], [818, 129], [760, 127], [690, 126]]);
const PILE: V[] = [[SP.tp[0] - 4, SP.tp[1] - 40], [SP.tp[0] - 70, SP.tp[1] - 6], [SP.tp[0] + 6, SP.tp[1] + 34]];
const MOV: Mover[] = [
  ...[0, 1, 2].map(i => ({ k: `c${i}`, svg: `<g class="chn-g">${balls(0, 0, 'OCO')}</g>`, label: i === 0 ? 'CO₂' : undefined, at: [34, 6] as [number, number], anchor: 'start' as const })),
  ...[0, 1].map(i => ({ k: `w${i}`, svg: row(0, 0, 'PCCCCCP', { r: R }), label: i === 1 ? 'RuBP' : undefined, at: [0, 32] as [number, number] })),
  ...[0, 1].map(i => ({ k: `b${i}`, svg: row(0, 0, 'PCCCCCP', { r: R }) })),
  ...[0, 1, 2].map(i => ({ k: `a${i}`, svg: `<g class="chn-g">${tagG(0, 0, 'ATP', 'atp')}</g>` })),
  ...[0, 1, 2].map(i => ({ k: `n${i}`, svg: `<g class="chn-g">${tagG(0, 0, 'NADPH', 'nadph')}</g>` })),
  ...[0, 1, 2].map(i => ({ k: `t${i}`, svg: row(0, 0, 'CCCP', { r: R }), label: i === 0 ? 'triose phosphate' : undefined, at: [0, -22] as [number, number] })),
  { k: 'suc', svg: `${row(0, -11, 'CCCCCC', { r: 9 })}${row(0, 11, 'CCCCCC', { r: 9 })}` },
  { k: 'tx', svg: row(0, 0, 'CCCP', { r: R }) }, { k: 'pi', svg: `<g class="chn-g">${tagG(0, 0, '', 'pi')}</g>` },
];
function script(beat: number, t: number): Record<string, Put> {
  const pos: Record<string, Put> = {};
  // beat 1: CO₂ is scarce, RuBP to spare
  if (beat === 0) {
    [0, 1].forEach(i => { const g = 1.2 + 2.0 * i; pos[`c${i}`] = { at: glide(P_C, t, g, 2.0), o: ease(t, g - 0.2, g + 0.2) * (1 - ease(t, g + 1.8, g + 2.2)) }; });
    WAIT.forEach((w, i) => { pos[`w${i}`] = { at: w, o: ease(t, 0.5 + 0.3 * i, 0.9 + 0.3 * i) }; });
  }
  if (beat === 1) WAIT.forEach((w, i) => { pos[`w${i}`] = { at: w, o: 1 }; });
  // beat 3: the spare RuBP is used up; RuBP returns one at a time from PRK, fed by ATP and NADPH; CO₂ is plenty
  if (beat === 2) {
    WAIT.forEach((w, i) => { const g = 0.4 + 0.6 * i; pos[`w${i}`] = { at: glide(curve([w, SP.rubpFrom, SP.rubpTo]), t, g, 0.8), o: 1 - ease(t, g + 0.6, g + 0.9) }; });
    [0, 1, 2].forEach(i => { const g = 0.6 + 1.1 * i; pos[`c${i}`] = { at: glide(P_C, t, g, 1.4), o: ease(t, g - 0.2, g + 0.2) * (1 - ease(t, g + 1.2, g + 1.6)) }; });
    [0, 1, 2].forEach(i => {
      const g = 0.8 + 1.0 * i;
      pos[`a${i}`] = { at: glide(P_A, t, g, 1.6), o: ease(t, g - 0.2, g + 0.2) * (1 - ease(t, g + 1.4, g + 1.8)) };
      pos[`n${i}`] = { at: glide(P_N, t, g + 0.2, 1.6), o: ease(t, g, g + 0.4) * (1 - ease(t, g + 1.6, g + 2.0)) };
    });
    [0, 1].forEach(i => { const g = 2.4 + 1.6 * i; pos[`b${i}`] = { at: glide(P_RUBP, t, g, 1.4), o: ease(t, g - 0.2, g + 0.2) * (1 - ease(t, g + 1.2, g + 1.6)) }; });
  }
  // beat 4: triose phosphate piles up; export through TPT stays slow
  if (beat >= 3) {
    PILE.forEach((at, i) => { const g = 0.8 + 1.0 * i; pos[`t${i}`] = { at: beat === 3 ? lerpV([SP.tp[0] - 50, SP.tp[1] + 20], at, ease(t, g, g + 0.8)) : at, o: beat === 3 ? ease(t, g - 0.1, g + 0.3) : 1 }; });
    if (beat === 3) {
      pos.tx = { at: glide(P_EXP, t, 1.4, 3.4), o: ease(t, 1.2, 1.5) * (1 - ease(t, 4.6, 5.0)) };
      pos.pi = { at: glide(P_PI, t, 3.0, 1.8), o: 1 - ease(t, 4.6, 5.0) };
    }
  }
  return pos;
}

export const STAGING: Staging = {
  id: 's',
  name: 's · In the protein strip',
  note: 'The dark-reaction strip with the A/Cᵢ curve beside it: as Cᵢ rises, each FvCB limit draws while its part of the strip is lit (A_c RuBisCO, A_j the thylakoid supply and RuBP regeneration, A_p triose phosphate, TPT and sucrose); the actual rate is the lowest',
  svg: () => sceneSvg(P, { movers: MOV.map(moverSvg).join(''), hud: panelSvg() }),
  bind(stage) {
    const S = new Strip(stage);
    hidePhotoresp(S);
    S.hide('export', 'node');   // its Pᵢ moves (beat 4); sucrose is drawn as a mover, dimmed with its part
    const cam = stage.querySelector('[data-k="cam"]') as SVGGElement;
    cam.setAttribute('transform', camTf(CAM));
    const put = placer(stage, MOV.map(m => m.k)), A = attrSetter(stage);
    const drawTo = (k: 'c' | 'j' | 'p', fn: (c: number) => number, b: number, beat: number, t: number): void => {
      const u = beat === b ? ease(t, 0.3, 2.3) : beat > b ? 1 : 0;
      A(`${P}-${k}`, 'd', u > 0 ? fnPath(AXS, fn, k === 'c' ? 45 : 60, 60 + 1340 * u, 120) : 'M0,0');
      A(`${P}-s${k}`, 'opacity', beat === b ? ease(t, 1.6, 2.2) : beat > b ? 1 : 0);
    };
    return (beat, t) => {
      S.light(lit(beat, t));
      const Lm = lit(beat, t), Pm = script(beat, t);
      Pm.suc = { at: SP.sucrose, o: 0.38 + 0.62 * (Lm.export ?? 0) };
      if (!Pm.pi) Pm.pi = { at: SP.pi, o: 0.38 + 0.62 * (Lm.export ?? 0) };
      put(Pm);
      const c = ci(beat, t);
      drawTo('c', Ac, 0, beat, t); drawTo('j', Aj, 2, beat, t); drawTo('p', Ap, 3, beat, t);
      A(`${P}-act`, 'd', fnPath(AXS, An, 45, c, 160));
      A(`${P}-dot`, 'cx', AX(AXS, c)); A(`${P}-dot`, 'cy', AY(AXS, An(c)));
      A(`${P}-air`, 'opacity', beat === 1 ? ease(t, 2.4, 3.0) : beat > 1 ? 1 : 0);
    };
  },
};

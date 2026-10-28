// Slide 11 · Excess light, stagings A and B (beats PP11 of beats-pp.ts): the story both share; A and B differ in the
// camera and the chain's look. The stage IS the slide 11 chain figure: focusSvg() of figs/chain.ts with photosystem II,
// its light, the electron path to plastoquinone and plastoquinone lit (LIT11 of figs/pp11f.ts, as figures v1 and v2 draw
// it), in the slide's figure card. A readout is on screen from the start: the light (µmol photons m⁻² s⁻¹), the energy
// balance (absorbed light vs CO₂ fixation, drawn after Murchie & Niyogi 2011 Fig. 1A, as figure v3) and the shares of the
// three exits (Rodríguez-Calcerrada et al. 2008, the values of figures v5, v6 and v8).
// - Beat 1 (opens on the slide figure; one click): the camera goes to photosystem II (A: zoom; B: a close-up window opens
//   out of a map of the chain); the three exits appear as arrows whose widths are their measured shares in weak light
//   (40 µmol m⁻² s⁻¹): photochemistry (along the slide's electron arrow to plastoquinone), heat (NPQ), fluorescence + other heat.
// - Beat 2: the light climbs to 1420; more light waves reach photosystem II; the readout's cursor runs along the energy
//   balance and the excess fills; the shares and the arrow widths follow the data.
// - Beat 3: O₂ near the reaction centre; an excitation that finds no exit reaches it; singlet O₂ forms and hits D1: a red
//   damage mark.
// - Beat 4: back to the whole chain (the slide figure), the damage mark stays on photosystem II.
import type { FocusLook, Part } from '../figs/chain';
import {
  box, burst, chainGroup, counterScaler, drawWindow, f1, fade, glyph, INK, kOf, lab, lerp, lerpV, markers, mv, num, o2, partsIn,
  pulse, putter, setters, slideCard, stroke, taggedChain, tfStr, tween, view, waveArrow, WHOLE, windowSvg, type Tf, type V, type WinLayout,
} from './pp-stage';
import type { Staging } from './types';

/* ---------------------------------------------------------------- data */

/** Lit on the slide (figs/pp11f.ts LIT11). */
export const LIT11: Part[] = ['psii', 'light-psii', 'e-psii-pq', 'pq'];
/** Rodríguez-Calcerrada et al. 2008, Quercus pyrenaica grown in high light: yields read off the figure as reproduced by
 *  E. Rosenqvist 2018, slide 56 (the values of figs/pp11f.ts). */
const PPF = [0, 40, 100, 250, 410, 715, 1065, 1420];
const Y_PSII = [0.87, 0.79, 0.73, 0.63, 0.52, 0.40, 0.29, 0.22];
const Y_NPQ = [0.00, 0.06, 0.12, 0.18, 0.28, 0.40, 0.50, 0.57];
const Y_NO = [0.15, 0.17, 0.17, 0.18, 0.21, 0.22, 0.22, 0.22];
const at = (ys: number[], L: number): number => {
  let i = 1;
  while (i < PPF.length - 1 && PPF[i] < L) i++;
  return lerp(ys[i - 1], ys[i], Math.max(0, Math.min(1, (L - PPF[i - 1]) / (PPF[i] - PPF[i - 1]))));
};
/** The 3 shares at light L, normalised so they add up to 1 (the read-off curves sum to 1.01–1.02). */
export const shares = (L: number): [number, number, number] => {
  const v = [at(Y_PSII, L), at(Y_NPQ, L), at(Y_NO, L)], s = v[0] + v[1] + v[2];
  return [v[0] / s, v[1] / s, v[2] / s];
};
export const L0 = 40, L1 = 1420;
/** The drawn energy balance (figs/pp11f.ts v3): absorbed light, and CO₂ fixation as a non-rectangular hyperbola. */
export const absorbed = (q: number): number => q / 2000 * 0.92;
export const fixed = (q: number): number => {
  const fq = 0.85 * absorbed(q), A = 0.3, th = 0.9;
  return (fq + A - Math.sqrt((fq + A) ** 2 - 4 * th * fq * A)) / (2 * th);
};

/* ---------------------------------------------------------------- geometry (figure units) */

/** The slide's electron arrow from water splitting to plastoquinone (chain.ts e-psii-pq). */
const E_PATH = 'M144.7,320.6C145.0,318.3 143.2,312.2 146.5,306.5C149.8,300.8 153.6,289.1 164.5,286.5C175.4,284.0 204.1,290.4 212.0,291.1';
/** Heat leaves the antenna at the left end of photosystem II; fluorescence leaves its top right. */
const HEAT: Array<[V, V]> = [[[30, 262], [-12, 170]], [[56, 259], [26, 156]]];
const FLUO: [V, V] = [[172, 261], [184, 150]];
/** The extra light waves, shown from these light levels on (the slide's own wave is always there). */
const LIGHT: Array<[V, V, number]> = [[[104, 120], [110, 254], 250], [[128, 118], [130, 255], 650], [[152, 122], [150, 256], 1050]];
export const D1: V = [128, 300], O2_AT: V = [100, 318], EX0: V = [34, 296];
/** Labels in the close view. */
export const LAB = {
  photo: [262, 346] as V, heat: [-34, 140] as V, fluo: [194, 140] as V, light: [96, 132] as V, name: [112, 396] as V,
  stroma: [460, 150] as V, lumen: [460, 392] as V, o2: [100, 344] as V, so: [100, 346] as V, d1: [128, 352] as V,
};

/* ---------------------------------------------------------------- timing (s into each beat) */

const B1 = { cam: 0.05, camD: 1.1, away: [0.05, 0.35], exits: 1.0, labs: 1.15, end: 1.6 };
const B2 = { sweep: 0.15, sweepD: 2.5, end: 2.9 };
export const B3 = { o2: 0.05, ex: 0.25, go: 0.35, goD: 0.9, flash: 1.25, so: 1.3, hit: 1.55, hitD: 0.6, dmg: 2.15, end: 2.6 };
const B4 = { labsOut: 0.05, cam: 0.1, camD: 1.2, back: 1.0, end: 1.5 };
const TEND = [B1.end, B2.end, B3.end, B4.end];

/* ---------------------------------------------------------------- the story overlay (figure units) */

/** The story's glyphs at photosystem II, keys prefixed by `kp` (a stage with two close-ups has two sets); `vals` (the
 *  shares of photochemistry, heat and the rest) are set after the exits' labels. */
export function storySvg(p: string, kp = '', vals?: [number, number, number]): string {
  const w = (k: string, a: V, b: V, ink: keyof typeof INK, amp = 6, n = 3.5): string => waveArrow(p, kp + k, ink, a, b, amp, n);
  const g = (k: string, inner: string): string => glyph(kp + k, inner);
  const v = (i: number, y: number): string => (vals ? lab(num(vals[i]), `ppa-num ppa-halo ${['ppa-green', 'ppa-grey', 'ppa-red'][i]}`, 0, y) : '');
  return `${markers(p + kp)}
    ${LIGHT.map(([a, b], i) => waveArrow(p + kp, `${kp}li${i}`, 'amber', a, b, 6, 4)).join('')}
    <path data-k="${kp}photo" class="ppa-ar" stroke="${INK.green}" d="${E_PATH}" marker-end="url(#${p}${kp}-m-green)" opacity="0" display="none"/>
    ${HEAT.map(([a, b], i) => waveArrow(p + kp, `${kp}heat${i}`, 'grey', a, b, 6, 3.5)).join('')}
    ${waveArrow(p + kp, `${kp}fluo`, 'red', FLUO[0], FLUO[1], 6, 4.5)}
    ${g('l-photo', `${lab('photochemistry', 'ppa-l ppa-green ppa-halo', 0, 0)}${v(0, 25)}`)}
    ${g('l-heat', `${lab('heat (NPQ)', 'ppa-l ppa-grey ppa-halo', 0, 0)}${v(1, 25)}`)}
    ${g('l-fluo', `${lab('fluorescence', 'ppa-l ppa-red ppa-halo', 0, 0)}${lab('+ other heat', 'ppa-l ppa-red ppa-halo', 0, 22)}${v(2, 47)}`)}
    ${g('l-light', lab('light', 'ppa-l ppa-amber ppa-halo', 0, 0, 'middle'))}
    ${g('l-name', lab('photosystem II', 'ppa-l ppa-halo', 0, 0, 'middle'))}
    ${g('l-stroma', lab('stroma', 'chn-zone', 0, 0, 'end'))}${g('l-lumen', lab('lumen', 'chn-zone', 0, 0, 'end'))}
    ${g('o2', o2(8))}${g('l-o2', lab('O₂', 'ppa-l ppa-halo', 0, 0, 'middle'))}
    ${g('ex', `<circle r="22" fill="url(#${p}${kp}-exg)"/><circle class="ppa-ex" r="8"/>`)}
    ${g('so', `<circle r="30" fill="url(#${p}${kp}-sog)"/>${o2(8)}`)}${g('l-so', lab('singlet O₂', 'ppa-l ppa-halo', 0, 0, 'middle'))}
    ${g('flash', `<circle r="40" fill="url(#${p}${kp}-exg)"/>`)}
    ${g('dmg', burst(20, 10))}${g('l-dmg', lab('D1 damaged', 'ppa-l ppa-red ppa-halo', 0, 0, 'middle'))}
    <defs><radialGradient id="${p}${kp}-exg"><stop offset="0" stop-color="#fff4d6"/><stop offset=".45" stop-color="#f6c453" stop-opacity=".85"/><stop offset="1" stop-color="#f0a316" stop-opacity="0"/></radialGradient>
      <radialGradient id="${p}${kp}-sog"><stop offset="0" stop-color="#f6b8a4"/><stop offset="1" stop-color="#e2553a" stop-opacity="0"/></radialGradient></defs>`;
}
/** The story's state in one frame. */
export interface St {
  /** light (µmol photons m⁻² s⁻¹), exits' opacity, labels' opacity, whole story's opacity (fades at the end) */
  L: number; ex: number; lb: number; story: number;
  /** seconds into the singlet-oxygen step (−1 before it, 99 after it) */
  ts: number;
}
/** Draws the story glyphs (keys prefixed kp) for state st at text scale k; `labAt` moves labels for another window. */
export function drawStory(S: ReturnType<typeof setters>, kp: string, k: number, st: St, labAt: Partial<typeof LAB> = {}): void {
  const A = { ...LAB, ...labAt };
  const put = putter(S), { L, ex, lb, story, ts } = st;
  const [sp, sn, sf] = shares(L);
  stroke(S, `${kp}photo`, 2.5 + 13 * sp, ex * story);
  stroke(S, `${kp}heat0`, 2 + 13 * sn, ex * story);
  stroke(S, `${kp}heat1`, 2 + 13 * sn, ex * story);
  stroke(S, `${kp}fluo`, 2 + 13 * sf, ex * story);
  LIGHT.forEach(([, , thr], i) => stroke(S, `${kp}li${i}`, 3.4, Math.max(0, Math.min(1, (L - thr) / 120)) * story));
  const l = lb * story;
  for (const [n, at] of [['l-photo', A.photo], ['l-heat', A.heat], ['l-fluo', A.fluo], ['l-light', A.light], ['l-name', A.name], ['l-stroma', A.stroma], ['l-lumen', A.lumen]] as Array<[string, V]>) put(kp + n, at, k, l);
  /* singlet oxygen */
  const o2On = fade(ts, B3.o2, 0.2) * (1 - fade(ts, B3.so - 0.05, 0.1));
  put(`${kp}o2`, O2_AT, k, o2On);
  put(`${kp}l-o2`, A.o2, k, o2On);
  const go = mv(ts, B3.go, B3.goD);
  const exAt = lerpV(EX0, [O2_AT[0] - 10, O2_AT[1] - 4], go);
  put(`${kp}ex`, [exAt[0], exAt[1] - 18 * Math.sin(Math.PI * go)], k, fade(ts, B3.ex, 0.15) * (1 - fade(ts, B3.flash, 0.1)));
  put(`${kp}flash`, O2_AT, k, pulse(ts, B3.flash));
  const soOn = fade(ts, B3.so, 0.15) * (1 - fade(ts, B3.dmg, 0.12));
  put(`${kp}so`, lerpV(O2_AT, D1, mv(ts, B3.hit, B3.hitD)), k, soOn);
  put(`${kp}l-so`, A.so, k, soOn * (1 - fade(ts, B3.hit, 0.2)));
  const dmg = fade(ts, B3.dmg, 0.15);
  put(`${kp}dmg`, D1, k * lerp(0.4, 1, dmg), dmg);
  put(`${kp}l-dmg`, A.d1, k, dmg * story);
}
/** Seconds the singlet-oxygen step takes. */
export const SINGLET_END = 2.6;

/* ---------------------------------------------------------------- the readout (stage units) */

export interface Ro { x: number; y: number; w: number; compact?: boolean }
/** The readout's layout: graph top and height, first bar row and row spacing. */
const lay = (r: Ro): { gy: number; gh: number; by: number; dy: number } =>
  r.compact ? { gy: r.y + 150, gh: 96, by: r.y + 322, dy: 58 } : { gy: r.y + 150, gh: 150, by: r.y + 380, dy: 66 };
export function readoutSvg(p: string, r: Ro): string {
  const { gy, gh, by, dy } = lay(r);
  const x0 = r.x + 18, iw = r.w - 36, gx = x0 + 30, gw = iw - 40, gb = gy + gh;
  const X = (q: number): number => gx + (q / 1500) * gw, Y = (v: number): number => gb - (v / 0.75) * gh;
  const qs = Array.from({ length: 31 }, (_, i) => i * 50);
  const line = (fn: (q: number) => number): string => `M${qs.map(q => `${f1(X(q))},${f1(Y(fn(q)))}`).join('L')}`;
  const bars = [['photochemistry', 'green'], ['heat (NPQ)', 'grey'], ['fluorescence + other heat', 'red']].map(([s, c], i) => {
    const y = by + i * dy;
    return `${lab(s, `ppa-l ppa-${c}`, x0, y)}<text data-k="ro-v${i}" class="ppa-num" x="${x0 + iw}" y="${y + 33}" text-anchor="end">0.00</text>
      <rect class="ppa-bar-bg" x="${x0}" y="${y + 16}" width="${iw - 58}" height="18" rx="4"/><rect data-k="ro-b${i}" class="ppa-bar-${c}" x="${x0}" y="${y + 16}" width="0" height="18" rx="4"/>`;
  }).join('');
  const h = by - r.y + 3 * dy - (r.compact ? 2 : 6);
  return box(p, r.x, r.y, r.w, h, `
    ${lab('light', 'ppa-t', x0, r.y + 34)}
    <text data-k="ro-L" class="ppa-big" x="${x0}" y="${r.y + 82}">40</text>
    ${lab('µmol photons m⁻² s⁻¹', 'ppa-s', x0, r.y + 108)}
    <path data-k="ro-ex" class="ppa-excess" d="M0,0"/>
    <path class="ppa-line" stroke="${INK.amber}" d="${line(absorbed)}"/><path class="ppa-line" stroke="${INK.green}" d="${line(fixed)}"/>
    <path class="ppa-axis" d="M${gx},${gy - 6}V${gb}H${gx + gw + 4}"/>
    <path data-k="ro-cur" class="ppa-cursor" d="M${X(L0)},${gy - 4}V${gb}"/>
    ${lab('absorbed', 'ppa-s ppa-amber', gx + gw, Y(absorbed(1500)) - 4, 'end')}
    ${lab('CO₂ fixation', 'ppa-s ppa-green', gx + gw, Y(fixed(1500)) + 24, 'end')}
    <g data-k="ro-exl" opacity="0" display="none">${lab('excess', 'ppa-l ppa-clay', X(1180), Y(0.42), 'middle')}</g>
    ${lab('light', 'ppa-s', gx + gw / 2, gb + 24, 'middle')}
    ${lab('energy per second', 'ppa-s', x0, gy - 14)}
    ${lab('share of absorbed energy', 'ppa-s', x0, by - 30)}${bars}`, 'ro');
}
/** Draws the readout at light L (excess and labels shown from L ≥ 300). */
export function drawReadout(S: ReturnType<typeof setters>, r: Ro, L: number): void {
  const { gy, gh } = lay(r);
  const x0 = r.x + 18, iw = r.w - 36, gx = x0 + 30, gw = iw - 40, gb = gy + gh;
  const X = (q: number): number => gx + (q / 1500) * gw, Y = (v: number): number => gb - (v / 0.75) * gh;
  S.set(S.q('ro-L'), 'text', `${Math.round(L / 10) * 10}`);
  S.set(S.q('ro-cur'), 'd', `M${f1(X(L))},${gy - 4}V${gb}`);
  const qs = Array.from({ length: 25 }, (_, i) => (i / 24) * L);
  S.set(S.q('ro-ex'), 'd', `M${qs.map(q => `${f1(X(q))},${f1(Y(absorbed(q)))}`).join('L')}L${[...qs].reverse().map(q => `${f1(X(q))},${f1(Y(fixed(q)))}`).join('L')}Z`);
  S.op(S.q('ro-exl'), Math.max(0, Math.min(1, (L - 900) / 200)));
  shares(L).forEach((v, i) => {
    S.set(S.q(`ro-v${i}`), 'text', num(v));
    S.set(S.q(`ro-b${i}`), 'width', f1(v * (iw - 58)));
  });
}

/* ---------------------------------------------------------------- the staging */

export interface Opt { id: string; name: string; note: string; look: FocusLook; camera: 'dive' | 'window' }

/** Close view of the dive (A). */
const Z: Tf = view([280, 262], 2.4);
/** Window camera (B): the map top left, the readout under it, the close-up on the right. */
const WIN: WinLayout = { map: { s: 0.3, t: [18 + 43.3 * 0.3, 16 + 30.9 * 0.3] }, win: [-45, 120, 515, 283.3], R: [304, 16, 1280, 704] };
export const RO_DIVE: Ro = { x: 1282, y: 22, w: 306 }, RO_WIN: Ro = { x: 18, y: 230, w: 278, compact: true };

export function makeStaging(o: Opt): Staging {
  const P = `pp11${o.id}`, win = o.camera === 'window';
  const RO = win ? RO_WIN : RO_DIVE;
  const chainA = taggedChain(`${P}a`, o.look, LIT11);
  const chainB = win ? taggedChain(`${P}b`, o.look, LIT11) : '';
  const story = storySvg(P);
  return {
    id: o.id,
    name: o.name,
    note: o.note,
    holds: [[0]],
    svg: () => win
      ? `<g data-k="map"><g class="fig">${slideCard(P)}${chainGroup('chainA', o.look, chainA)}${glyph('mdmg', burst(20, 10))}</g></g>
        ${windowSvg(P, `${chainGroup('chainB', o.look, chainB)}${story}`)}
        ${readoutSvg(P, RO)}`
      : `<g data-k="cam"><g class="fig">${slideCard(P)}${chainGroup('chainA', o.look, chainA)}${story}</g></g>
        ${readoutSvg(P, RO)}`,

    bind(stage) {
      const S = setters(stage), { q, op } = S, put = putter(S);
      const gA = q('chainA'), gB = win ? q('chainB') : gA;
      const csA = counterScaler(gA, S), csB = win ? counterScaler(gB, S) : csA;
      /** The slide's parts that the story covers while it is told: the electron arrow (told by the green arrow) and the
       *  dimmed H⁺ uptake under the fluorescence. */
      const covered = ['e-psii-pq', 'pq-h-in'].flatMap(p => partsIn(gB, p));
      let last = '';
      return (beatIn, t) => {
        const b = Math.max(0, Math.min(3, Math.round(beatIn)));
        const tt = Math.max(0, Math.min(t, TEND[b]));
        const key = `${b}:${tt.toFixed(3)}`;
        if (key === last) return;
        last = key;
        const T = (n: number): number => (b === n ? tt : b > n ? 99 : -1);
        const t1 = T(0), t3 = T(2), t4 = T(3);

        /* ---- camera */
        const e = mv(t1, B1.cam, B1.camD) * (1 - mv(t4, B4.cam, B4.camD));
        let k: number;
        if (win) {
          const v = drawWindow(S, WIN, e, q('map'));
          csA(1, 1 - Math.min(1, e * 1.6));
          k = kOf(v.inner.s);
          csB(k);
        } else {
          const cam = tween(WHOLE, Z, e);
          S.set(q('cam'), 'transform', tfStr(cam));
          k = kOf(cam.s);
          csA(k);
        }
        const story = b < 3 ? 1 : 1 - fade(t4, B4.labsOut, 0.3);

        /* ---- the slide's arrow and the dimmed H⁺ uptake give way to the story, and come back */
        const away = b === 0 ? 1 - fade(tt, B1.away[0], B1.away[1] - B1.away[0]) : b < 3 ? 0 : fade(tt, B4.back, 0.4);
        covered.forEach(g => op(g, away));

        /* ---- light, shares, exits, singlet oxygen */
        const L = b === 1 ? lerp(L0, L1, mv(tt, B2.sweep, B2.sweepD)) : b >= 2 ? L1 : L0;
        drawReadout(S, RO, L);
        drawStory(S, '', k, { L, ex: fade(t1, B1.exits, 0.3), lb: fade(t1, B1.labs, 0.25), story, ts: t3 });
        if (win) put('mdmg', D1, 1, b === 3 ? fade(tt, B4.cam + B4.camD - 0.3, 0.3) : 0);
      };
    },
  };
}

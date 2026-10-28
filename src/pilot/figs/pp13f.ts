// Slide 13 · Chlorophyll fluorescence: figures of chunk pp (28 Oct 2026). Slide 13 has no picks yet; the new variants
// v1–v9 come first, then the older l14 figures.
// New variants by approach: whole chain with the fluorescence leaving photosystem II (v1, zoom circle); drawings (v2:
// saturating pulse on a dark-adapted leaf, healthy vs photoinhibited, schematic; v5: the photosystem II population at
// Fo, Fm, Fs, Fm′ after E. Rosenqvist, slide 34; v6: the PAM principle); data redrawn (v4: Fv/Fm of pumpkin leaves in
// light with repair blocked, Tyystjärvi & Aro 1996 Fig. 1A, values read off the PMC scan); restyled paper figures (v3: a
// real PAM trace, Ruban 2016 Fig. 1A; v7: global SIF, Guanter et al. 2014 Fig. 1); combinations (v8: leaf → tree → Earth
// with Porcar-Castell et al. 2021 Fig. 3 and Guanter 2014; v9: the FLEX launch photo with the SIF map).
import type { PlateText, Variant } from '../types';
import { draw as l14, VARIANTS as L14 } from './l14';
import type { FocusView, Glyphs, Part } from './chain';
/** The chain in the deck's glyph mode (atom balls, ringed H⁺, tagged carriers; lecturer, 28 Oct 2026). */
const G: Glyphs = { mol: true };
import { PLATE as TEXT } from './pp13';
import rubanJpg from '../../assets/refs/L6-photoprotection/ruban2016-pam-trace.jpg';
import guanterJpg from '../../assets/photos/14-guanter.jpg';
import treeJpg from '../../assets/photos/14-pc-tree.jpg';
import flexJpg from '../../assets/photos/14-flex.jpg';
import {
  ar, axes, callout, chainWhole, credit, defs, f, F, frame, FVFM, mark, poly, PS2, shot, smooth, svg, T, TV, wv,
  type Img, type Pt,
} from './pp-kit';

export const PLATE: PlateText = { ...TEXT, play: 'pp13' };

export const VARIANTS: Variant[] = [
  { id: 'v1', name: 'Chain: fluorescence leaves photosystem II to a fluorometer (zoom circle)' },
  { id: 'v2', name: 'Saturating pulse: healthy vs photoinhibited leaf (Fv/Fm, drawn)' },
  { id: 'v3', name: 'A real PAM trace: Fo, Fm, Fs, Fm′ (Ruban 2016 Fig. 1A)' },
  { id: 'v4', name: 'Fv/Fm falls in light when repair is blocked (data, Tyystjärvi & Aro 1996)' },
  { id: 'v5', name: 'The photosystem II population behind Fo, Fm, Fs, Fm′ (dot grids)' },
  { id: 'v6', name: 'How a PAM fluorometer works (drawn)' },
  { id: 'v7', name: 'Global SIF from satellite (Guanter 2014 Fig. 1)' },
  { id: 'v8', name: 'One signal, three scales: leaf, tree, Earth' },
  { id: 'v9', name: 'FLEX launch + global SIF' },
  ...L14,
];

export function draw(id: string): string {
  switch (id) {
    case 'v1': return chainV1();
    case 'v2': return pulseV2();
    case 'v3': return rubanV3();
    case 'v4': return fvfmV4();
    case 'v5': return gridsV5();
    case 'v6': return pamV6();
    case 'v7': return sifV7();
    case 'v8': return scalesV8();
    case 'v9': return flexV9();
    default: return l14(id);
  }
}

const FM1 = `${F('m')}′`;

/* ---------- v1 · zoom circle on photosystem II: fluorescence to a fluorometer ---------- */

const LIT13: Part[] = ['psii', 'light-psii'];

/** A leaf-clip fluorometer head: a dark box with a lens. */
const meter = (x: number, y: number, w = 150, h = 70): string =>
  `<rect class="pp-devdk" x="${f(x)}" y="${f(y)}" width="${w}" height="${h}" rx="14"/><circle cx="${f(x + w / 2)}" cy="${f(y + h)}" r="14" fill="#8a877d" stroke="#141413" stroke-width="1.6"/>`;

function chainV1(): string {
  const p = 'pp13v1';
  const c: Pt = [276, 128], r = 122, win: Pt = [112, 296], z = 1.05;
  const Z = (q: Pt): Pt => [c[0] + z * (q[0] - win[0]), c[1] + z * (q[1] - win[1])];
  const v: FocusView = {
    look: 'bil', lit: LIT13, labels: [], g: G,
    inset: { k: 0.78, at: [88, 170], ring: [112, 318, 112], c, r, win, z },
    say: 'The chain is drawn smaller; a circle above enlarges photosystem II, from which red fluorescence leaves towards a fluorometer.',
  };
  const s1 = Z([60, PS2.top + 2]), s2 = Z([118, PS2.top]), s3 = Z([180, PS2.top + 2]);
  return chainWhole(p, v, `${defs(`${p}x`)}
    ${meter(560, 30)}${T(635, 136, 'fluorometer', 'pp-hb', 'middle')}
    ${wv(`${p}x`, 'red', s3[0] - 4, s3[1] - 4, 552, 74, 7, 6)}${wv(`${p}x`, 'red', s2[0], s2[1] - 6, 550, 54, 7, 7)}
    ${T(440, 34, 'fluorescence', 'pp-hb pp-c-red', 'middle')}
    ${callout(20, 60, 'photosystem II', [s1[0] + 4, s1[1] + 30], 'start', 'pp-hb', [70, 66])}`);
}

/* ---------- v2 · the saturating pulse on a dark-adapted leaf: healthy vs photoinhibited (schematic) ---------- */

function pulseV2(): string {
  const p = 'pp13v2';
  const panel = (x0: number, title: string, fm: number, ratio: string, cls: string): string => {
    const a = axes(x0, 450, x0 + 300, 120, [0, 10], [0, 1]);
    const fo = 0.17, q: Pt[] = [[0, fo], [3.6, fo], [3.75, fm], [5.25, fm], [5.4, fo], [10, fo]];
    const tr = q.map(([t, v]): Pt => [a.X(t), a.Y(v)]);
    return `${T(x0 + 150, 96, title, `pp-hb ${cls}`)}
      <path class="pp-axis" d="M${a.x0},${a.y1 - 10}V${a.y0}H${a.x1 + 8}"/>
      <rect class="pp-band" x="${f(a.X(3.6))}" y="${f(a.y1 - 6)}" width="${f(a.X(5.4) - a.X(3.6))}" height="${f(a.y0 - a.y1 + 6)}" style="fill:#fbf0cf"/>
      <path class="pp-line" stroke="#c8361e" d="${poly(tr)}"/>
      ${T(a.X(1.6), a.Y(fo) - 14, F('o'), 'pp-lv')}${T(a.X(5.6), a.Y(fm) + 8, F('m'), 'pp-lv', 'start')}
      <path class="pp-guide" d="M${a.X(5.25)},${a.Y(fo)} H${a.X(9.2)}"/><path class="pp-guide" d="M${a.X(5.4)},${a.Y(fm)} H${a.X(9.2)}"/>
      ${ar(p, 'ink', `M${a.X(8.4)},${a.Y(fo) - 4} V${a.Y(fm) + 8}`, 'pp-thin')}${T(a.X(8.6), (a.Y(fo) + a.Y(fm)) / 2 + 8, F('v'), 'pp-lv', 'start')}
      ${T(x0 + 150, 510, `${FVFM} ${ratio}`, `pp-big ${cls}`)}`;
  };
  return svg('Schematic: a dark-adapted leaf in weak measuring light gives the fluorescence Fo; a saturating light pulse closes every photosystem II reaction centre and fluorescence jumps to Fm. Fv = Fm − Fo. A healthy leaf reaches Fv/Fm ≈ 0.83; a photoinhibited leaf reaches a lower Fm, so its Fv/Fm is lower.', `
    ${defs(p)}
    ${panel(70, 'healthy leaf', 1, '≈ 0.83', 'pp-c-green')}${panel(450, 'photoinhibited leaf', 0.55, 'lower', 'pp-c-red')}
    ${T(400, 46, 'saturating pulse after dark adaptation', 'pp-l', 'middle')}
    ${TV(44, 285, 'fluorescence')}${T(220, 478, 'time', 'pp-ax')}${T(600, 478, 'time', 'pp-ax')}
    ${credit(786, 590, `${FVFM} ≈ 0.83: Björkman & Demmig 1987, 37 C₃ species (77 K)`)}`);
}

/* ---------- v3 · Ruban 2016, Fig. 1A: a real PAM trace ---------- */

const RUBAN: Img = { href: rubanJpg, w: 742, h: 466 };
function rubanV3(): string {
  const p = 'pp13v3';
  const masks: [number, number, number, number][] = [
    [0, 0, 22, 28], [38, 62, 78, 92], [38, 286, 72, 314], [0, 140, 28, 290], [66, 362, 124, 398], [126, 370, 236, 432], [186, 258, 228, 288],
    [262, 344, 344, 372], [392, 92, 570, 128], [398, 182, 438, 212], [398, 252, 444, 282], [326, 376, 424, 432], [424, 346, 468, 378],
    [440, 378, 532, 416], [636, 56, 712, 142], [300, 432, 366, 462],
  ];
  const a = shot(`${p}i`, RUBAN, 40, 40, 700, { masks, mult: true });
  const P = (u: number, v: number): Pt => a.at(u, v);
  return svg('Ruban 2016, Figure 1A: a real PAM fluorescence trace of an Arabidopsis leaf. In the dark, the measuring light gives Fo and a saturating pulse gives Fm; when actinic light is switched on, fluorescence settles to Fs and the pulses reach only Fm′, lower than Fm because of NPQ; after the actinic light is switched off, the pulse peaks recover as NPQ relaxes.', `
    ${defs(p)}${a.svg}<path class="pp-axis" style="stroke:#141413;stroke-width:2" d="M${f(P(26, 0)[0])},${f(P(0, 428)[1])} H${f(P(716, 0)[0])}"/>
    ${T(...P(48, 84), F('m'), 'pp-lv', 'end')}${T(...P(46, 308), F('o'), 'pp-lv', 'end')}${T(...P(236, 262), F('s'), 'pp-lv')}${T(...P(372, 254), FM1, 'pp-lv', 'end')}
    ${T(P(400, 0)[0] + 12, P(0, 186)[1], 'NPQ', 'pp-hb', 'start')}
    ${T(P(150, 0)[0], P(0, 398)[1], 'actinic', 'pp-lb')}${T(P(150, 0)[0], P(0, 398)[1] + 24, 'light on', 'pp-lb')}
    ${T(P(380, 0)[0], P(0, 398)[1], 'actinic', 'pp-lb')}${T(P(380, 0)[0], P(0, 398)[1] + 24, 'light off', 'pp-lb')}
    ${T(P(300, 0)[0], P(0, 362)[1], 'pulses', 'pp-lb')}
    ${T(P(380, 0)[0], P(0, 466)[1] + 20, 'time', 'pp-ax')}${TV(28, P(0, 220)[1], 'fluorescence')}
    ${credit(786, 590, 'Ruban 2016, Plant Physiol. 170: 1903, Fig. 1A, <tspan class="pp-i">Arabidopsis</tspan> leaf · © ASPB')}`);
}

/* ---------- v4 · Tyystjärvi & Aro 1996, Fig. 1A redrawn: Fv/Fm in light with repair blocked ---------- */

// Read off the PMC page scan (p. 2214). Pumpkin leaves in lincomycin (repair blocked) at four light levels; one set in
// 15 µmol m⁻² s⁻¹ without lincomycin (repair working). 0.83 before illumination (caption).
const TY_SETS: Array<{ ppfd: string; pts: Pt[]; col: string; kind: 'ci' | 'td' | 'sq' | 'tr' }> = [
  { ppfd: '548', col: '#b8301b', kind: 'ci', pts: [[0, 0.83], [1.3, 0.74], [4.6, 0.52], [23, 0.08], [48, 0], [69, 0]] },
  { ppfd: '307', col: '#d9821e', kind: 'td', pts: [[0, 0.83], [19.7, 0.34], [42, 0.10], [65, 0.03]] },
  { ppfd: '32', col: '#2a963a', kind: 'sq', pts: [[0, 0.83], [23, 0.66], [48, 0.51], [69, 0.36], [103, 0.15]] },
  { ppfd: '9', col: '#2350e6', kind: 'tr', pts: [[0, 0.83], [23, 0.72], [48, 0.60], [69, 0.43], [103, 0.38]] },
];
const TY_REPAIR: Pt[] = [[0, 0.83], [47, 0.82], [120, 0.81]];

function fvfmV4(): string {
  const p = 'pp13v4';
  const a = axes(130, 450, 690, 90, [0, 120], [0, 1]);
  /** First-order decay from 0.83 fitted (least squares on ln) to each set's points. */
  const fit = (pts: Pt[]): number => {
    const q = pts.filter(([t, v]) => t > 0 && v > 0.02);
    return q.reduce((s, [t, v]) => s + t * Math.log(0.83 / v), 0) / q.reduce((s, [t]) => s + t * t, 0);
  };
  const curve = (k: number, tmax: number): Pt[] => Array.from({ length: 61 }, (_, i): Pt => { const t = (i / 60) * tmax; return [a.X(t), a.Y(0.83 * Math.exp(-k * t))]; });
  const ends: Record<string, Pt> = { '548': [a.X(9), a.Y(0.04)], '307': [a.X(66) + 10, a.Y(0.03) - 16], '32': [a.X(104) + 10, a.Y(0.15) + 7], '9': [a.X(104) + 10, a.Y(0.38) + 7] };
  return svg('Redrawn from Tyystjärvi and Aro 1996: Fv/Fm of pumpkin leaves starts at 0.83. With repair blocked by lincomycin it falls with time in light, the faster the stronger the light (548, 307, 32 and 9 micromoles per square metre per second). With repair working (15 micromoles, no lincomycin) it stays at 0.83.', `
    ${defs(p)}
    ${frame(a, [0, 40, 80, 120], [0, 0.5, 0.83], 'hours in light', FVFM, { yfmt: v => (v === 0.83 ? '0.83' : `${v}`) })}
    <path class="pp-line" stroke="#6b6a64" style="stroke-dasharray:3 7" d="${poly(TY_REPAIR.map(([t, v]): Pt => [a.X(t), a.Y(v)]))}"/>
    ${TY_REPAIR.slice(1).map(([t, v]) => mark('sq', false, a.X(t), a.Y(v), 7, '#6b6a64')).join('')}
    ${T(a.X(118), a.Y(0.83) - 20, 'repair working, 15 µmol m⁻² s⁻¹', 'pp-lb', 'end')}
    ${TY_SETS.map(s => {
      const k = fit(s.pts), tmax = Math.max(...s.pts.map(q => q[0]));
      return `<path class="pp-line" stroke="${s.col}" d="${smooth(curve(k, tmax))}"/>${s.pts.slice(1).map(([t, v]) => mark(s.kind, s.kind === 'ci' ? false : true, a.X(t), a.Y(v), 6.5, s.col)).join('')}
        ${T(...ends[s.ppfd], s.ppfd, 'pp-hb', 'start').replace('class="pp-hb"', `class="pp-hb" style="fill:${s.col}"`)}`;
    }).join('')}
    ${T(a.X(60), a.Y(0.62), 'repair blocked:', 'pp-lb', 'start')}${T(a.X(60), a.Y(0.62) + 26, 'light in µmol m⁻² s⁻¹', 'pp-l', 'start')}
    ${credit(786, 590, 'data: Tyystjärvi & Aro 1996, PNAS 93: 2213, Fig. 1A, pumpkin leaves; read off the figure')}`);
}

/* ---------- v5 · the photosystem II population behind Fo, Fm, Fs, Fm′ ---------- */

function gridsV5(): string {
  const p = 'pp13v5';
  type S = 'o' | 'c' | 'q';
  const grid = (x: number, y: number, pat: (i: number, j: number) => S): string => {
    let s = '';
    for (let i = 0; i < 5; i++) for (let j = 0; j < 5; j++) {
      const k = pat(i, j), cls = k === 'o' ? 'pp-dot-open' : k === 'c' ? 'pp-dot-closed' : 'pp-dot-quench';
      s += `<circle class="${cls}" cx="${f(x + j * 30)}" cy="${f(y + i * 30)}" r="11"/>`;
    }
    return s;
  };
  // NPQ: about half the antennae quenching in the light; Fs: the rest open or closed
  const qMask = (i: number, j: number): boolean => (i * 5 + j) % 2 === 0;
  const cell = (cx: number, cy: number, sym: string, pat: (i: number, j: number) => S): string =>
    `${grid(cx - 60, cy - 60, pat)}${T(cx + 96, cy + 10, sym, 'pp-lv', 'start')}`;
  return svg('The photosystem II population behind the four fluorescence levels, after E. Rosenqvist: open centres (white) use excitation in photochemistry and fluoresce little; closed centres (red) fluoresce; quenching antennae (black) turn excitation into heat. Dark-adapted, measuring light: all open, Fo. Saturating pulse: all closed, Fm. In actinic light: a mix of open, closed and quenching, Fs. Saturating pulse in light: closed and quenching, Fm′, lower than Fm.', `
    ${defs(p)}
    <path class="pp-guide" d="M400,60V430"/><path class="pp-guide" d="M60,250H740"/>
    ${T(220, 50, 'dark-adapted', 'pp-hb')}${T(580, 50, 'in actinic light', 'pp-hb')}
    ${TV(30, 150, 'measuring light', 'pp-lb')}${TV(30, 345, 'saturating pulse', 'pp-lb')}
    ${cell(150, 150, F('o'), () => 'o')}${cell(150, 345, F('m'), () => 'c')}
    ${cell(510, 150, F('s'), (i, j) => (qMask(i, j) ? 'q' : (i + j) % 3 === 0 ? 'c' : 'o'))}${cell(510, 345, FM1, (i, j) => (qMask(i, j) ? 'q' : 'c'))}
    <circle class="pp-dot-open" cx="96" cy="484" r="11"/>${T(116, 491, 'open: photochemistry', 'pp-l', 'start')}
    <circle class="pp-dot-closed" cx="96" cy="522" r="11"/>${T(116, 529, 'closed: fluorescence', 'pp-l', 'start')}
    <circle class="pp-dot-quench" cx="440" cy="484" r="11"/>${T(460, 491, 'quenching: heat (NPQ)', 'pp-l', 'start')}
    ${credit(786, 590, 'after E. Rosenqvist, PhD course 2018, slide 34 (redrawn)')}`);
}

/* ---------- v6 · how a PAM fluorometer works ---------- */

function pamV6(): string {
  const p = 'pp13v6';
  const pulses = (x0: number, y: number, n: number, w: number, h: number, col: string): string =>
    `<path class="pp-line" stroke="${col}" style="stroke-width:2.6" d="${Array.from({ length: n }, (_, i) => `M${f(x0 + i * w)},${y} v${-h} h${w / 2} v${h} h${w / 2}`).join(' ')}"/>`;
  const leaf = `<path class="pp-leaf" d="M330,330 C380,250 500,230 560,300 C510,380 390,400 330,330Z"/><path class="pp-ar pp-k-green" style="stroke-width:2" d="M330,330 Q440,318 560,300"/>`;
  return svg('How a pulse-amplitude-modulated (PAM) fluorometer works: a weak measuring light flashes in short pulses, too weak to drive photosynthesis; actinic light drives photosynthesis; a strong saturating pulse closes every photosystem II reaction centre. The detector records only the fluorescence that pulses with the measuring light, so daylight and actinic light do not disturb the reading.', `
    ${defs(p)}
    ${leaf}${T(445, 410, 'leaf', 'pp-lb pp-c-green')}
    <rect class="pp-dev" x="40" y="80" width="190" height="380" rx="20"/>
    ${T(135, 130, 'measuring', 'pp-hb', 'middle')}${T(135, 156, 'light', 'pp-hb', 'middle')}${pulses(66, 214, 7, 20, 34, '#2a7fb8')}
    ${T(135, 262, 'actinic light', 'pp-hb', 'middle')}<path class="pp-line" stroke="#e0a21a" d="M66,300 H206"/>
    ${T(135, 360, 'saturating', 'pp-hb', 'middle')}${T(135, 386, 'pulse', 'pp-hb', 'middle')}<path class="pp-line" stroke="#e0a21a" style="stroke-width:3.4" d="M66,436 H120 V404 H140 V436 H206"/>
    ${ar(p, 'blue', 'M234,196 Q300,210 340,292', 'pp-thin')}${ar(p, 'amber', 'M234,300 H320', 'pp-thin')}${ar(p, 'amber', 'M234,420 Q300,410 340,350', 'pp-thick')}
    <rect class="pp-devdk" x="586" y="104" width="204" height="118" rx="18"/>${T(688, 152, 'detector', 'pp-hb pp-c-paper')}${T(688, 182, 'reads only', 'pp-l pp-c-paper')}${T(688, 206, 'the pulsed signal', 'pp-l pp-c-paper')}
    ${wv(p, 'red', 520, 268, 636, 226, 6, 4)}${T(560, 300, 'fluorescence', 'pp-lb pp-c-red', 'start')}
    <rect class="pp-card" x="590" y="330" width="190" height="130" rx="14"/>${T(685, 362, 'signal', 'pp-lb')}${pulses(608, 432, 7, 22, 20, '#c8361e')}
    <path class="pp-line" stroke="#c8361e" style="stroke-width:2.6" d="M${608 + 7 * 22},432 h4"/>
    ${credit(786, 590, 'after Schreiber, Schliwa & Bilger 1986; E. Rosenqvist, PhD course 2018, slides 20–21')}`);
}

/* ---------- v7 · Guanter et al. 2014, Fig. 1: global SIF ---------- */

const GUANTER: Img = { href: guanterJpg, w: 786, h: 422 };
function sifV7(): string {
  const p = 'pp13v7';
  const a = shot(`${p}i`, GUANTER, 10, 70, 780, { masks: [[0, 352, 356, 422], [340, 386, 786, 422]] });
  const P = (u: number, v: number): Pt => a.at(u, v);
  return svg('Guanter and colleagues 2014, Figure 1: a world map of the highest monthly solar-induced chlorophyll fluorescence in 2009, measured from satellite at 740 nm. Croplands of the US Corn Belt glow brightest; deserts are dark.', `
    ${defs(p)}${a.svg}
    ${T(P(358, 0)[0] - 12, P(0, 378)[1] + 2, 'SIF, 740 nm', 'pp-lb', 'end')}
    ${T(...P(360, 410), '0', 'pp-tk')}${T(...P(757, 410), '4.5', 'pp-tk')}${T(P(560, 0)[0], P(0, 410)[1], 'mW m⁻² sr⁻¹ nm⁻¹', 'pp-tk')}
    ${callout(P(230, 0)[0], 44, 'US Corn Belt', P(190, 86), 'start', 'pp-hb', [P(230, 0)[0] - 4, 50])}
    ${credit(786, 590, 'Guanter et al. 2014, PNAS 111: E1327, Fig. 1, maximum monthly SIF 2009 (GOME-2) · © PNAS')}`);
}

/* ---------- v8 · one signal at three scales: leaf, tree, Earth ---------- */

const TREE: Img = { href: treeJpg, w: 1552, h: 475 };
function scalesV8(): string {
  const p = 'pp13v8';
  const y = 150, h = 180, tw = h * 524 / 475;
  const tree = shot(`${p}t`, TREE, 200, y, tw, { win: [776, 0, 524, 475], rx: 10 });
  const ew = h * 680 / 330, earth = shot(`${p}e`, GUANTER, 790 - ew, y, ew, { win: [20, 0, 680, 330], rx: 10 });
  const cx = 92, cy = y + h / 2;
  const clip = `<rect class="pp-dev" x="${cx - 70}" y="${cy - 70}" width="140" height="42" rx="12"/><path class="pp-leaf" d="M${cx - 86},${cy + 4} C${cx - 40},${cy - 24} ${cx + 40},${cy - 26} ${cx + 86},${cy + 2} C${cx + 40},${cy + 30} ${cx - 40},${cy + 30} ${cx - 86},${cy + 4}Z"/>
    <rect class="pp-dev" x="${cx - 70}" y="${cy + 26}" width="140" height="42" rx="12"/>`;
  const tx = 200 + tw / 2, ex = 790 - ew / 2;
  return svg('The same red fluorescence measured at three scales: a leaf clip on one leaf; a camera image of solar-induced fluorescence (SIF) of trees, from Porcar-Castell et al. 2021; and the world map of SIF from satellite, Guanter et al. 2014.', `
    ${defs(p)}${clip}${tree.svg}${earth.svg}
    ${ar(p, 'ink', `M${cx + 90},${cy} H194`, 'pp-thin')}${ar(p, 'ink', `M${f(200 + tw + 6)},${cy} H${f(790 - ew - 6)}`, 'pp-thin')}
    ${T(cx, y + h + 54, 'leaf', 'pp-hb')}${T(cx, y + h + 82, 'leaf clip', 'pp-l')}
    ${T(tx, y + h + 54, 'tree', 'pp-hb')}${T(tx, y + h + 82, 'imaging spectrometer', 'pp-l')}
    ${T(ex, y + h + 54, 'Earth', 'pp-hb')}${T(ex, y + h + 82, 'satellite', 'pp-l')}
    ${T(400, 96, 'the same chlorophyll fluorescence, from leaf to planet', 'pp-hb pp-c-red')}
    ${credit(786, 566, 'tree: Porcar-Castell et al. 2021, Nat. Plants 7: 998, Fig. 3b · © Springer Nature')}
    ${credit(786, 590, 'Earth: Guanter et al. 2014, PNAS 111: E1327, Fig. 1 · © PNAS')}`);
}

/* ---------- v9 · the FLEX launch with the SIF map ---------- */

const FLEX: Img = { href: flexJpg, w: 1100, h: 941 };
function flexV9(): string {
  const p = 'pp13v9';
  const ph = shot(`${p}p`, FLEX, 20, 40, 300, { win: [250, 0, 600, 941], rx: 12 });
  const map = shot(`${p}m`, GUANTER, 350, 120, 430, { win: [0, 0, 786, 350], rx: 10 });
  return svg('Left, the launch of ESA’s FLEX satellite on a Vega-C rocket, 15 September 2026; its instrument is built to measure plant fluorescence from orbit. Right, the kind of map such data give: solar-induced fluorescence of the land, 2009, from an earlier satellite (Guanter et al. 2014).', `
    ${defs(p)}${ph.svg}${map.svg}
    ${T(170, ph.h + 76, 'FLEX launch, 2026', 'pp-hb')}
    ${T(565, 100, 'SIF from orbit', 'pp-hb')}
    ${T(565, 120 + map.h + 36, 'land fluorescence, 2009', 'pp-l')}
    ${credit(786, 566, 'photo: © 2026 ESA–CNES–AVIO / Optique Vidéo du CSG – J. Georget, ESA Standard Licence')}
    ${credit(786, 590, 'map: Guanter et al. 2014, PNAS 111: E1327, Fig. 1 · © PNAS')}`);
}


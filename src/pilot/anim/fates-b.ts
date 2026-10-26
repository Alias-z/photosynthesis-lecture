// Animation 4 · "Fates of an excitation", staging B · "Four doors". The camera zooms from a leaf into one chlorophyll
// inside its protein. The excitation is an amber glow in the chlorophyll's room; the room has four doors, one per exit,
// each labelled with its time: photochemistry (green, to the reaction centre), fluorescence (red wave), heat (grey
// wave, widened by NPQ in strong light) and the rare triplet (clay, to oxygen; a carotenoid quenches it). Inks follow
// slide 12. Beats: absorb (blue gives a bigger, hotter glow than red), relax (< 1 ps, both end in S₁), photochemistry,
// fluorescence, heat, triplet.
import './fates-b.css';
import type { Staging } from './types';
import { T, leaf } from '../figs/s2';
import { rcDot } from '../mechanisms';

const P = 'ftb';
type Pt = [number, number];
type RGB = [number, number, number];
type Anchor = 'start' | 'middle' | 'end';

const f = (v: number): string => v.toFixed(1);
const clamp = (v: number, a = 0, b = 1): number => Math.max(a, Math.min(b, v));
const sm = (x: number): number => { const u = clamp(x); return u * u * (3 - 2 * u); };
const ramp = (t: number, a: number, b: number): number => sm((t - a) / (b - a));
const lerp = (a: number, b: number, k: number): number => a + (b - a) * k;
const lerpP = (a: Pt, b: Pt, k: number): Pt => [lerp(a[0], b[0], k), lerp(a[1], b[1], k)];
const mix = (a: readonly number[], b: readonly number[], k: number): RGB => [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)];
const rgb = (c: readonly number[]): string => `rgb(${c.map(v => Math.round(clamp(v, 0, 255))).join(',')})`;

/* ---------- inks, as on slide 12 ---------- */

const INK = { blue: '#2350e6', red: '#c8361e', green: '#4f7f3f', grey: '#a9a59a', clay: '#d97757', orange: '#e07a1f', ink: '#3d3d3a' } as const;
const CORE_AMBER: RGB = [240, 163, 22], CORE_HOT: RGB = [255, 226, 140], CORE_CLAY: RGB = [217, 119, 87];

/* ---------- drawing helpers ---------- */

/** A wave with a fixed wavelength from a to b, its amplitude easing in and out at both ends. */
function wavy(a: Pt, b: Pt, lam: number, amp: number, ph = 0): string {
  const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy);
  if (L < 1) return `M${f(a[0])},${f(a[1])}`;
  const ux = dx / L, uy = dy / L, n = Math.max(2, Math.ceil(L / 2)), ease = Math.min(lam * 0.6, L / 2);
  const pts: string[] = [];
  for (let i = 0; i <= n; i++) {
    const d = (L * i) / n, e = Math.min(1, d / ease, (L - d) / ease);
    const w = Math.sin((2 * Math.PI * d) / lam + ph) * amp * e;
    pts.push(`${i ? 'L' : 'M'}${f(a[0] + ux * d - uy * w)},${f(a[1] + uy * d + ux * w)}`);
  }
  return pts.join('');
}

/** A filled arrowhead with its tip at b, pointing along a → b. */
function head(a: Pt, b: Pt, size = 15): string {
  const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L;
  const bx = b[0] - ux * size, by = b[1] - uy * size, w = size * 0.55;
  return `M${f(b[0])},${f(b[1])}L${f(bx - uy * w)},${f(by + ux * w)}L${f(bx + uy * w)},${f(by - ux * w)}Z`;
}

/** A wave packet of light: a few wavelengths under a smooth envelope, centred `d` along the path a → b. */
function packet(a: Pt, b: Pt, d: number, lam: number, amp = 9): string {
  const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, half = lam * 1.9;
  const pts: string[] = [];
  for (let i = 0; i <= 80; i++) {
    const s = -half + (2 * half * i) / 80, along = d + s;
    if (along < 0 || along > L) continue;
    const env = Math.pow(Math.cos((Math.PI * s) / (2 * half)), 2), w = Math.sin((2 * Math.PI * along) / lam) * amp * env;
    pts.push(`${pts.length ? 'L' : 'M'}${f(a[0] + ux * along - uy * w)},${f(a[1] + uy * along + ux * w)}`);
  }
  return pts.join('') || `M${f(a[0])},${f(a[1])}`;
}

/** Light as drawn on the slides: wavelength in nm / 22 px. */
const LAM = { blue: 450 / 22, red: 662 / 22, fl: 685 / 22 };

/** A time pill, coloured from fs to µs as on slide 12; the text always says the time. */
function badge(x: number, y: number, s: string, sc: 'fs' | 'ps' | 'ns' | 'us', a: Anchor = 'middle'): string {
  const w = Math.round(s.length * 11.5 + 30), x0 = a === 'start' ? x : a === 'end' ? x - w : x - w / 2;
  return `<rect class="ftb-tb ftb-tb-${sc}" x="${f(x0)}" y="${f(y - 16)}" width="${w}" height="32" rx="16"/>${T(x0 + w / 2, y + 7.5, s, 'ftb-bt', 'middle')}`;
}

/** A chlorophyll sketch: the ring of four small rings round a central Mg (the conjugated ring in amber), and its tail. */
function chlorophyll(cx: number, cy: number, s: number): string {
  const R = 50 * s, pr = 17 * s;
  const ring = `<circle class="ftb-chl-conj" cx="${f(cx)}" cy="${f(cy)}" r="${f(R)}"/>`;
  const pyr = [0, 90, 180, 270].map(a => {
    const rad = (a * Math.PI) / 180, px = cx + Math.cos(rad) * R, py = cy + Math.sin(rad) * R;
    const pts = Array.from({ length: 5 }, (_, i) => {
      const q = rad + Math.PI + (i * 2 * Math.PI) / 5;
      return `${f(px + Math.cos(q) * pr * -1)},${f(py + Math.sin(q) * pr * -1)}`;
    });
    return `<path class="ftb-chl" d="M${pts.join('L')}Z"/><path class="ftb-chl-b" d="M${f(cx + Math.cos(rad) * 12 * s)},${f(cy + Math.sin(rad) * 12 * s)}L${f(px - Math.cos(rad) * pr * 0.8)},${f(py - Math.sin(rad) * pr * 0.8)}"/>`;
  }).join('');
  const iso = `<path class="ftb-chl" d="M${f(cx + R * 0.72)},${f(cy + R * 0.72)}m${f(-14 * s)},0a${f(14 * s)},${f(14 * s)} 0 1 0 ${f(28 * s)},0a${f(14 * s)},${f(14 * s)} 0 1 0 ${f(-28 * s)},0"/>`;
  const t0: Pt = [cx + R * 0.15, cy + R + pr * 0.9];
  const tail = Array.from({ length: 7 }, (_, i) => `${i ? 'L' : 'M'}${f(t0[0] + i * 11 * s)},${f(t0[1] + i * 7.5 * s + (i % 2 ? -6 * s : 0))}`).join('');
  return `${ring}${pyr}${iso}<path class="ftb-chl-tail" d="${tail}"/><circle class="ftb-mg" cx="${f(cx)}" cy="${f(cy)}" r="${f(8 * s)}"/>`;
}

/** A carotenoid: a zigzag chain with a ring at each end. */
function carotenoid(x: number, y: number, len: number): string {
  const r = 10, hex = (cx: number): string =>
    `<path class="ftb-car-ring" d="${Array.from({ length: 6 }, (_, i) => `${i ? 'L' : 'M'}${f(cx + r * Math.cos((Math.PI / 3) * i))},${f(y + r * Math.sin((Math.PI / 3) * i))}`).join('')}Z"/>`;
  const a = x + r, b = x + len - r, n = Math.max(4, Math.round((b - a) / 10));
  const zz = Array.from({ length: n + 1 }, (_, i) => `${i ? 'L' : 'M'}${f(a + ((b - a) * i) / n)},${f(y + (i % 2 ? -6 : 6))}`).join('');
  return `<path class="ftb-car" d="${zz}"/>${hex(x)}${hex(x + len)}`;
}

/* ---------- the protein (layer B, drawn at the scale it is first seen at) ---------- */

/** The two chlorophyll rooms: A takes the blue photon, B the red; from beat 3 the camera stays on B. */
const ROOM = { w: 300, h: 280, r: 26 };
const RA: Pt = [520, 400], RB: Pt = [1080, 400];
/** The ring centre of each chlorophyll, where its glow sits. */
const ringC = (c: Pt): Pt => [c[0], c[1] + 10];
const S1_R = 66, S2_R = 96;

/** Layer B is seen at scale 1 in beats 1–2; from beat 3 at FOCUS_S, with room B's ring centre at FOCUS_AT. */
const FOCUS_S = 1.3, FOCUS_AT: Pt = [700, 370];
const toLayer = (p: Pt): Pt => [ringC(RB)[0] + (p[0] - FOCUS_AT[0]) / FOCUS_S, ringC(RB)[1] + (p[1] - FOCUS_AT[1]) / FOCUS_S];

/* ---------- room B as seen from beat 3 (stage coordinates) ---------- */

const RX0 = 505, RX1 = 895, RY0 = 175, RY1 = 539;
const GLOW: Pt = FOCUS_AT;
/** Door gaps (stage): right (photochemistry), top (fluorescence), left (heat), bottom (triplet). */
const DOOR_R = { y0: 330, y1: 410 }, DOOR_T = { x0: 770, x1: 850 }, DOOR_B = { x0: 660, x1: 740 }, DOOR_LY = 370;

/** Room B's walls with door gaps, in layer coordinates: the wall pieces, and the plugs that fill each gap until the
 *  doors appear. `hl` is the left door's half-height on the stage (it widens in strong light). */
function roomB(hl: number): { wall: string; plugs: string[] } {
  const x0 = RB[0] - ROOM.w / 2, x1 = RB[0] + ROOM.w / 2, y0 = RB[1] - ROOM.h / 2, y1 = RB[1] + ROOM.h / 2, r = ROOM.r;
  const lx = (x: number): number => toLayer([x, 0])[0], ly = (y: number): number => toLayer([0, y])[1];
  const gT: [number, number] = [lx(DOOR_T.x0), lx(DOOR_T.x1)], gB: [number, number] = [lx(DOOR_B.x0), lx(DOOR_B.x1)];
  const gR: [number, number] = [ly(DOOR_R.y0), ly(DOOR_R.y1)], gL: [number, number] = [ly(DOOR_LY - hl), ly(DOOR_LY + hl)];
  const arc = (ex: number, ey: number): string => `A${r},${r} 0 0 1 ${f(ex)},${f(ey)}`;
  const wall = `M${f(x0 + r)},${f(y0)}L${f(gT[0])},${f(y0)}M${f(gT[1])},${f(y0)}L${f(x1 - r)},${f(y0)}${arc(x1, y0 + r)}`
    + `L${f(x1)},${f(gR[0])}M${f(x1)},${f(gR[1])}L${f(x1)},${f(y1 - r)}${arc(x1 - r, y1)}`
    + `L${f(gB[1])},${f(y1)}M${f(gB[0])},${f(y1)}L${f(x0 + r)},${f(y1)}${arc(x0, y1 - r)}`
    + `L${f(x0)},${f(gL[1])}M${f(x0)},${f(gL[0])}L${f(x0)},${f(y0 + r)}${arc(x0 + r, y0)}`;
  const plugs = [
    `M${f(x1)},${f(gR[0])}L${f(x1)},${f(gR[1])}`,
    `M${f(gT[0])},${f(y0)}L${f(gT[1])},${f(y0)}`,
    `M${f(x0)},${f(gL[0])}L${f(x0)},${f(gL[1])}`,
    `M${f(gB[0])},${f(y1)}L${f(gB[1])},${f(y1)}`,
  ];
  return { wall, plugs };
}

/** A door leaf at its hinge, `len` long, at angle `deg` (0 = +x, 90 = down). */
const leafEnd = (h: Pt, len: number, deg: number): Pt => [h[0] + Math.cos((deg * Math.PI) / 180) * len, h[1] + Math.sin((deg * Math.PI) / 180) * len];
/** The dashed swing arc from the closed leaf to its current angle. */
function swing(h: Pt, len: number, a0: number, a1: number): string {
  if (Math.abs(a1 - a0) < 0.5) return '';
  const p0 = leafEnd(h, len, a0), p1 = leafEnd(h, len, a1);
  return `M${f(p0[0])},${f(p0[1])}A${f(len)},${f(len)} 0 0 ${a1 > a0 ? 1 : 0} ${f(p1[0])},${f(p1[1])}`;
}

/* ---------- exits (stage coordinates) ---------- */

const RC = { x: 1010, y: 320, w: 220, h: 100 };
const GREEN_A: Pt = [GLOW[0] + 90, GLOW[1]], GREEN_B: Pt = [RC.x - 6, GLOW[1]];
const E0: Pt = [RC.x + 70, GLOW[1]], E1: Pt = [1340, GLOW[1]];
const FL_A: Pt = [GLOW[0] + 52, GLOW[1] - 74], FL_B: Pt = [870, 40];
const HEAT = [
  { a: [GLOW[0] - 92, DOOR_LY] as Pt, b: [352, DOOR_LY] as Pt },
  { a: [GLOW[0] - 84, DOOR_LY - 36] as Pt, b: [352, DOOR_LY - 62] as Pt },
  { a: [GLOW[0] - 84, DOOR_LY + 36] as Pt, b: [352, DOOR_LY + 62] as Pt },
];
const O2: Pt = [700, 632], TRIP_A: Pt = [GLOW[0], GLOW[1] + 92], TRIP_B: Pt = [O2[0], O2[1] - 26];
const CAR = { x: 792, y: 632, len: 128 };
const Q_A: Pt = [O2[0] + 36, O2[1]], Q_B: Pt = [CAR.x - 6, CAR.y];
const CH_A: Pt = [CAR.x + CAR.len - 10, CAR.y - 16], CH_B: Pt = [CAR.x + CAR.len + 80, CAR.y - 84];

/** Incoming photons: beat, colour, path and travel time. Beats 1 (two rooms) and 4–6 (room B). */
interface Ph { b: number; c: 'blue' | 'red'; a: Pt; z: Pt; t0: number; t1: number }
const PHOTONS: Ph[] = [
  { b: 0, c: 'blue', a: [300, 40], z: ringC(RA), t0: 2.6, t1: 3.5 },
  { b: 0, c: 'red', a: [1300, 40], z: ringC(RB), t0: 2.6, t1: 3.5 },
  { b: 3, c: 'red', a: [330, 40], z: GLOW, t0: 0.5, t1: 1.4 },
  { b: 4, c: 'blue', a: [300, 40], z: GLOW, t0: 0.4, t1: 1.3 },
  { b: 4, c: 'red', a: [360, 30], z: GLOW, t0: 0.6, t1: 1.5 },
  { b: 4, c: 'red', a: [240, 70], z: GLOW, t0: 0.8, t1: 1.7 },
  { b: 5, c: 'red', a: [330, 40], z: GLOW, t0: 0.4, t1: 1.2 },
];

/* ---------- the stage ---------- */

/** The leaf, the point on it the camera zooms into, and the zoom from leaf to protein (the protein fades in while
 *  the leaf is still recognisable). */
const LEAF_AT: Pt = [800, 390], PA: Pt = [870, 372], ZMAX = Math.log(6);
const glowGrads = `<radialGradient id="${P}-g-amber"><stop offset="0" stop-color="#f6c453" stop-opacity=".95"/><stop offset=".45" stop-color="#f6c453" stop-opacity=".45"/><stop offset="1" stop-color="#f6c453" stop-opacity="0"/></radialGradient>
  <radialGradient id="${P}-g-hot"><stop offset="0" stop-color="#fffbea" stop-opacity="1"/><stop offset=".3" stop-color="#ffe7a0" stop-opacity=".9"/><stop offset=".62" stop-color="#f6c453" stop-opacity=".5"/><stop offset="1" stop-color="#f6c453" stop-opacity="0"/></radialGradient>
  <radialGradient id="${P}-g-clay"><stop offset="0" stop-color="#e89474" stop-opacity=".95"/><stop offset=".45" stop-color="#d97757" stop-opacity=".45"/><stop offset="1" stop-color="#d97757" stop-opacity="0"/></radialGradient>`;

/** One glow: amber, hot (white-yellow) and clay layers over each other, plus its core. */
const glowG = (cls: string, c: Pt): string => `<g class="ftb-glow ${cls}" opacity="0">
  <circle class="ftb-gl-a" cx="${f(c[0])}" cy="${f(c[1])}" r="1" fill="url(#${P}-g-amber)"/>
  <circle class="ftb-gl-h" cx="${f(c[0])}" cy="${f(c[1])}" r="1" fill="url(#${P}-g-hot)" opacity="0"/>
  <circle class="ftb-gl-c" cx="${f(c[0])}" cy="${f(c[1])}" r="1" fill="url(#${P}-g-clay)" opacity="0"/>
  <circle class="ftb-gl-core" cx="${f(c[0])}" cy="${f(c[1])}" r="1"/></g>`;

function svg(): string {
  const room = (c: Pt): string => `<rect class="ftb-room" x="${c[0] - ROOM.w / 2}" y="${c[1] - ROOM.h / 2}" width="${ROOM.w}" height="${ROOM.h}" rx="${ROOM.r}"/>`;
  const small = [[330, 250], [1290, 236], [1300, 556], [800, 590]] as Pt[];
  const rb = roomB(40);
  const hR: Pt = [RX1, DOOR_R.y0], hT: Pt = [DOOR_T.x0, RY0], hB: Pt = [DOOR_B.x0, RY1];

  return `<defs>${glowGrads}</defs>

  <g class="ftb-la">
    ${leaf(LEAF_AT[0], LEAF_AT[1], 640, 270, -12)}
    ${T(500, 510, 'leaf', 'ftb-h', 'middle')}
  </g>

  <g class="ftb-lb" opacity="0">
    <g class="ftb-ctx">
      <ellipse class="ftb-protein" cx="800" cy="400" rx="560" ry="270"/>
      ${small.map(([x, y]) => `<g opacity=".45">${chlorophyll(x, y, 0.42)}</g>`).join('')}
      ${room(RA)}${chlorophyll(ringC(RA)[0], ringC(RA)[1], 1)}
      ${glowG('ftb-glow-a', ringC(RA))}
      ${T(800, 172, 'protein', 'ftb-h ftb-c-protein', 'middle')}
      ${T(RA[0], RA[1] + ROOM.h / 2 + 38, 'chlorophyll', 'ftb-l', 'middle')}
      ${T(RB[0], RB[1] + ROOM.h / 2 + 38, 'chlorophyll', 'ftb-l', 'middle')}
      <g class="ftb-s2a">${T(RA[0], RA[1] - 98, 'more energy (S₂)', 'ftb-h', 'middle')}</g>
      <g class="ftb-s1a" opacity="0">${T(RA[0], RA[1] - 98, 'less energy (S₁)', 'ftb-h', 'middle')}</g>
      <g class="ftb-plab">${T(290, 48, 'blue light', 'ftb-l ftb-c-blue', 'end')}${T(1310, 48, 'red light', 'ftb-l ftb-c-red', 'start')}</g>
      <g class="ftb-relax">
        ${[160, 180, 200].map(a => {
          const r = (a * Math.PI) / 180, c = ringC(RA), p0: Pt = [c[0] + Math.cos(r) * 80, c[1] + Math.sin(r) * 80], p1: Pt = [c[0] + Math.cos(r) * 200, c[1] + Math.sin(r) * 200];
          return `<g class="ftb-rw" data-a="${f(p0[0])},${f(p0[1])},${f(p1[0])},${f(p1[1])}"><path class="ftb-heat"/><path class="ftb-heat-hd"/></g>`;
        }).join('')}
        <g class="ftb-relax-l" opacity="0">${T(330, 540, 'heat', 'ftb-h ftb-c-grey', 'end')}${badge(330, 574, '< 1 ps', 'ps', 'end')}</g>
      </g>
    </g>
    <rect class="ftb-room" x="${RB[0] - ROOM.w / 2}" y="${RB[1] - ROOM.h / 2}" width="${ROOM.w}" height="${ROOM.h}" rx="${ROOM.r}" style="stroke:none"/>
    ${chlorophyll(ringC(RB)[0], ringC(RB)[1], 1)}
    ${glowG('ftb-glow-b', ringC(RB))}
    <path class="ftb-wall ftb-wall-b" d="${rb.wall}"/>
    ${rb.plugs.map((d, i) => `<path class="ftb-wall ftb-plug ftb-plug-${i}" d="${d}"/>`).join('')}
    <g class="ftb-ctx2"><g class="ftb-s1b" opacity="0">${T(RB[0], RB[1] - 98, 'less energy (S₁)', 'ftb-h', 'middle')}</g></g>
  </g>

  <g class="ftb-ov" opacity="0">
    <g class="ftb-rc">
      <rect class="ftb-rc-open" x="${RC.x}" y="${RC.y}" width="${RC.w}" height="${RC.h}" rx="28"/>
      <rect class="ftb-rc-closed" x="${RC.x}" y="${RC.y}" width="${RC.w}" height="${RC.h}" rx="28" opacity="0"/>
      <g class="ftb-cs" opacity="0">${rcDot(RC.x + 52, GLOW[1])}</g>
      ${T(RC.x + RC.w / 2, RC.y + RC.h + 36, 'reaction centre', 'ftb-h', 'middle')}
      <g class="ftb-rc-o">${T(RC.x + RC.w / 2, RC.y + RC.h + 66, 'open', 'ftb-l', 'middle')}</g>
      <g class="ftb-rc-c" opacity="0">${T(RC.x + RC.w / 2, RC.y + RC.h + 66, 'closed', 'ftb-l', 'middle')}</g>
    </g>
    ${T(RC.x + RC.w / 2, 252, 'photochemistry', 'ftb-h ftb-c-green', 'middle')}${badge(RC.x + RC.w / 2, 288, '< 100 ps', 'ps')}
    ${T(900, 74, 'fluorescence', 'ftb-h ftb-c-red', 'start')}${badge(1066, 66, 'ns', 'ns', 'start')}${T(900, 106, '≈ 685 nm', 'ftb-l', 'start')}
    ${T(485, DOOR_LY + 110, 'heat (NPQ)', 'ftb-h ftb-c-grey', 'end')}${badge(485, DOOR_LY + 144, 'ns', 'ns', 'end')}
    ${T(630, 588, 'triplet', 'ftb-h ftb-c-clay', 'end')}${badge(630, 622, 'lasts µs', 'us', 'end')}
    <g class="ftb-roomlab">
      <g class="ftb-rl-s1">${T(620, 228, 'excitation (S₁)', 'ftb-l', 'middle')}</g>
      <g class="ftb-rl-t1" opacity="0">${T(620, 228, 'T₁ after spin flip', 'ftb-l ftb-c-clay', 'middle')}</g>
    </g>

    <path class="ftb-swing ftb-sw-r"/><path class="ftb-swing ftb-sw-t"/><path class="ftb-swing ftb-sw-l"/><path class="ftb-swing ftb-sw-b"/>
    <path class="ftb-door ftb-door-green ftb-dr-r" d="M${hR[0]},${hR[1]}L${hR[0]},${DOOR_R.y1}"/>
    <path class="ftb-door ftb-door-red ftb-dr-t" d="M${hT[0]},${hT[1]}L${DOOR_T.x1},${hT[1]}"/>
    <path class="ftb-door ftb-door-grey ftb-dr-l"/>
    <path class="ftb-door ftb-door-clay ftb-dr-b" d="M${hB[0]},${hB[1]}L${DOOR_B.x1},${hB[1]}"/>

    <g class="ftb-x-green"><path class="ftb-ar-green"/><path class="ftb-hd-green"/></g>
    <g class="ftb-elec" opacity="0"><circle class="ftb-e" r="9"/></g>
    <g class="ftb-elec-l" opacity="0">${T(E1[0], E1[1] - 26, 'electron', 'ftb-l', 'middle')}</g>
    <g class="ftb-x-red"><path class="ftb-ar-red"/><path class="ftb-hd-red"/></g>
    ${HEAT.map(() => '<g class="ftb-x-heat"><path class="ftb-heat"/><path class="ftb-heat-hd"/></g>').join('')}
    <g class="ftb-x-clay"><path class="ftb-ar-clay"/><path class="ftb-hd-clay"/></g>

    <g class="ftb-ox" opacity="0">
      <circle class="ftb-o2-halo" cx="${O2[0]}" cy="${O2[1]}" r="52" fill="url(#${P}-g-clay)" opacity="0"/>
      <circle class="ftb-o" cx="${O2[0] - 14}" cy="${O2[1]}" r="17"/><circle class="ftb-o" cx="${O2[0] + 14}" cy="${O2[1]}" r="17"/>
      <g class="ftb-o2-l">${T(O2[0], O2[1] + 58, 'oxygen (O₂)', 'ftb-l', 'middle')}</g>
      <g class="ftb-o2-s" opacity="0">${T(O2[0], O2[1] + 58, 'singlet oxygen (¹O₂)', 'ftb-h ftb-c-clay', 'middle')}</g>
      ${carotenoid(CAR.x, CAR.y, CAR.len)}${T(CAR.x + CAR.len / 2 + 30, CAR.y + 58, 'carotenoid', 'ftb-l ftb-c-orange', 'middle')}
      <g class="ftb-x-q"><path class="ftb-ar-q"/><path class="ftb-hd-q"/></g>
      <g class="ftb-x-ch"><path class="ftb-heat"/><path class="ftb-heat-hd"/></g>
    </g>
    <g class="ftb-red-l" opacity="0">${T(320, 48, 'red light', 'ftb-l ftb-c-red', 'end')}</g>
    <g class="ftb-strong-l" opacity="0">${T(230, 48, 'strong light', 'ftb-h', 'end')}</g>
  </g>

  ${PHOTONS.map(ph => `<path class="ftb-ph ftb-ph-${ph.c}" opacity="0"/>`).join('')}`;
}

function bind(stage: SVGSVGElement): (beat: number, t: number) => void {
  const q = (s: string): SVGElement => stage.querySelector(s) as SVGElement;
  const qa = (s: string): SVGElement[] => Array.from(stage.querySelectorAll<SVGElement>(s));
  const memo = new Map<Element, Map<string, string>>();
  const set = (el: Element, k: string, v: string): void => {
    let m = memo.get(el);
    if (!m) memo.set(el, (m = new Map()));
    if (m.get(k) !== v) { m.set(k, v); el.setAttribute(k, v); }
  };
  const op = (el: Element, v: number): void => set(el, 'opacity', clamp(v).toFixed(3));
  const show = (el: Element, v: number): void => { op(el, v); set(el, 'style', v > 0.001 ? '' : 'display:none'); };

  const la = q('.ftb-la'), lb = q('.ftb-lb'), ctx = q('.ftb-ctx'), ctx2 = q('.ftb-ctx2'), ov = q('.ftb-ov');
  const glowA = q('.ftb-glow-a'), glowB = q('.ftb-glow-b');
  const s2a = q('.ftb-s2a'), s1a = q('.ftb-s1a'), s1b = q('.ftb-s1b'), plab = q('.ftb-plab');
  const relaxW = qa('.ftb-rw'), relaxL = q('.ftb-relax-l');
  const wallB = q('.ftb-wall-b'), plugs = [0, 1, 2, 3].map(i => q(`.ftb-plug-${i}`));
  const rcOpen = q('.ftb-rc-open'), rcClosed = q('.ftb-rc-closed'), cs = q('.ftb-cs'), rcO = q('.ftb-rc-o'), rcC = q('.ftb-rc-c');
  const rlS1 = q('.ftb-rl-s1'), rlT1 = q('.ftb-rl-t1');
  const sw = { r: q('.ftb-sw-r'), t: q('.ftb-sw-t'), l: q('.ftb-sw-l'), b: q('.ftb-sw-b') };
  const dr = { r: q('.ftb-dr-r'), t: q('.ftb-dr-t'), l: q('.ftb-dr-l'), b: q('.ftb-dr-b') };
  const xGreen = q('.ftb-x-green'), xRed = q('.ftb-x-red'), xHeat = qa('.ftb-x-heat'), xClay = q('.ftb-x-clay');
  const elec = q('.ftb-elec'), elecDot = q('.ftb-e'), elecL = q('.ftb-elec-l');
  const ox = q('.ftb-ox'), o2Halo = q('.ftb-o2-halo'), o2L = q('.ftb-o2-l'), o2S = q('.ftb-o2-s'), xQ = q('.ftb-x-q'), xCh = q('.ftb-x-ch');
  const redL = q('.ftb-red-l'), strongL = q('.ftb-strong-l');
  const phs = qa('.ftb-ph');

  /** A glow: lit level, radius, how hot (white-yellow) and how clay (triplet) it is. */
  function setGlow(g: Element, lvl: number, r: number, hot: number, clay: number): void {
    show(g, lvl);
    const [a, h, c, core] = Array.from(g.children);
    for (const e of [a, h, c]) set(e, 'r', f(Math.max(1, r)));
    op(a, 1 - Math.max(hot, clay)); op(h, hot); op(c, clay);
    set(core, 'r', f(Math.max(1, r * 0.2)));
    set(core, 'fill', rgb(mix(mix(CORE_AMBER, CORE_HOT, hot), CORE_CLAY, clay)));
  }

  /** An arrow drawn from a toward b up to fraction k: straight (dash = clay dashes) or wavy, with its head at the end. */
  function arrow(g: Element, a: Pt, b: Pt, k: number, kind: 'line' | 'wave', lam = 26, amp = 7, size = 16): void {
    const [body, hd] = Array.from(g.children);
    show(g, k > 0.001 ? 1 : 0);
    if (k <= 0.001) return;
    const e = lerpP(a, b, k);
    set(body, 'd', kind === 'wave' ? wavy(a, e, lam, amp) : `M${f(a[0])},${f(a[1])}L${f(e[0])},${f(e[1])}`);
    set(hd, 'd', head(a, e, size));
  }

  /** A door: leaf from its hinge at the open fraction, with its swing arc. */
  function door(leafEl: Element, swEl: Element, h: Pt, len: number, closed: number, open: number, o: number): void {
    const a = lerp(closed, open, o), e = leafEnd(h, len, a);
    set(leafEl, 'd', `M${f(h[0])},${f(h[1])}L${f(e[0])},${f(e[1])}`);
    set(swEl, 'd', swing(h, len, closed, a));
  }

  return (beat: number, t: number): void => {
    const b = Math.max(0, Math.min(5, beat));
    /** 0 before beat `on`, a ramp inside it, 1 after. */
    const at = (on: number, a: number, z: number): number => (b < on ? 0 : b === on ? ramp(t, a, z) : 1);
    /** 1 only inside beat `on` from [a, z] up; in other beats 0. */
    const only = (on: number, a: number, z: number): number => (b === on ? ramp(t, a, z) : 0);

    // Camera. Beat 1 zooms from the leaf into the protein (layer A hands over to layer B); beat 3 zooms onto room B.
    if (b === 0) {
      const k = ramp(t, 0.3, 2.3), z = k * ZMAX, sa = Math.exp(z), sb = Math.exp(z - ZMAX), Q = lerpP(PA, [800, 400], k);
      set(la, 'transform', `translate(${f(Q[0])} ${f(Q[1])}) scale(${sa.toFixed(4)}) translate(${-PA[0]} ${-PA[1]})`);
      set(lb, 'transform', `translate(${f(Q[0])} ${f(Q[1])}) scale(${sb.toFixed(4)}) translate(-800 -400)`);
      show(la, 1 - ramp(k, 0.3, 0.6));
      op(lb, ramp(k, 0.3, 0.6));
    } else {
      show(la, 0);
      op(lb, 1);
      const k = at(2, 0, 1.8), F = lerpP([800, 400], ringC(RB), k), Q = lerpP([800, 400], FOCUS_AT, k), s = Math.pow(FOCUS_S, k);
      set(lb, 'transform', `translate(${f(Q[0])} ${f(Q[1])}) scale(${s.toFixed(4)}) translate(${f(-F[0])} ${f(-F[1])})`);
    }

    // The protein, room A and the beat 1–2 labels give way to room B as the camera closes in.
    show(ctx, b < 2 ? 1 : b === 2 ? 1 - ramp(t, 0, 0.3) : 0);
    show(ctx2, b < 2 ? 1 : b === 2 ? 1 - ramp(t, 0, 0.3) : 0);
    op(plab, only(0, 2.5, 2.8) * (1 - only(0, 3.6, 3.9)));
    op(s1b, at(0, 3.7, 4.0));
    op(s2a, b === 0 ? ramp(t, 3.7, 4.0) : b === 1 ? 1 - ramp(t, 2.6, 2.9) : 0);
    op(s1a, at(1, 2.8, 3.1));

    // Photons arrive as wave packets and vanish into the glow.
    PHOTONS.forEach((ph, i) => {
      const el = phs[i], k = b === ph.b ? (t - ph.t0) / (ph.t1 - ph.t0) : -1;
      if (k <= 0 || k >= 1) { op(el, 0); return; }
      const L = Math.hypot(ph.z[0] - ph.a[0], ph.z[1] - ph.a[1]);
      set(el, 'd', packet(ph.a, ph.z, k * L, LAM[ph.c]));
      op(el, Math.min(1, k / 0.08, (1 - k) / 0.06));
    });
    op(redL, b === 3 ? ramp(t, 0.4, 0.7) * (1 - ramp(t, 1.5, 1.8)) : b === 5 ? ramp(t, 0.3, 0.6) * (1 - ramp(t, 1.3, 1.6)) : 0);
    op(strongL, only(4, 0.3, 0.6) * (1 - only(4, 1.8, 2.1)));

    // Absorb (beat 1): blue makes a bigger, hotter glow in room A; red a smaller one in room B.
    // Relax (beat 2): room A sheds its extra energy as heat in under a picosecond and settles to the same S₁ glow.
    const litA = at(0, 3.35, 3.7), relax = at(1, 0.6, 2.8);
    setGlow(glowA, litA, lerp(S2_R, S1_R, relax), 1 - relax, 0);
    relaxW.forEach((g, i) => {
      const [x0, y0, x1, y1] = (g.getAttribute('data-a') ?? '0,0,0,0').split(',').map(Number);
      arrow(g, [x0, y0], [x1, y1], at(1, 0.4 + 0.15 * i, 1.6 + 0.15 * i), 'wave', 24, 7);
    });
    op(relaxL, at(1, 1.2, 1.5));

    // Room B's glow, beat by beat: lit by red (1), drained by photochemistry (3), re-lit and drained by fluorescence (4),
    // by heat (5), and in (6) re-lit, turned to a triplet and drained to oxygen.
    let lvl = 0, clay = 0, rB = S1_R;
    if (b <= 1) lvl = at(0, 3.35, 3.7);
    else if (b === 2) lvl = 1 - ramp(t, 3.0, 3.6);
    else if (b === 3) lvl = ramp(t, 1.3, 1.6) * (1 - ramp(t, 2.9, 3.6));
    else if (b === 4) { lvl = ramp(t, 1.2, 1.5) * (1 - ramp(t, 2.8, 3.8)); rB = S1_R * 1.08; }
    else { lvl = ramp(t, 1.0, 1.3) * (1 - ramp(t, 2.8, 3.3)); clay = ramp(t, 1.5, 2.1); }
    setGlow(glowB, lvl, rB, 0, clay);

    // Beat 3 on: the doors and their labels appear whole once the camera has landed.
    const doors = at(2, 1.8, 2.1);
    show(ov, doors);
    const hl = 40 + 40 * (b === 4 ? ramp(t, 1.8, 2.8) : b === 5 ? 1 - ramp(t, 0, 0.4) : 0);
    const rb = roomB(hl);
    set(wallB, 'd', rb.wall);
    plugs.forEach((p, i) => { set(p, 'd', rb.plugs[i]); op(p, 1 - doors); });

    // Door openings, each in its own beat; a door shuts again at the start of the next beat.
    const oR = b === 2 ? ramp(t, 2.3, 2.9) : b === 3 ? 1 - ramp(t, 0, 0.4) : 0;
    const oT = b === 3 ? ramp(t, 2.2, 2.8) : b === 4 ? 1 - ramp(t, 0, 0.4) : 0;
    const oL = b === 4 ? ramp(t, 1.8, 2.6) : b === 5 ? 1 - ramp(t, 0, 0.4) : 0;
    const oB = b === 5 ? ramp(t, 2.2, 2.7) : 0;
    door(dr.r, sw.r, [RX1, DOOR_R.y0], DOOR_R.y1 - DOOR_R.y0, 90, 0, oR);
    door(dr.t, sw.t, [DOOR_T.x0, RY0], DOOR_T.x1 - DOOR_T.x0, 0, -90, oT);
    door(dr.l, sw.l, [RX0, DOOR_LY - hl], 2 * hl, 90, 180, oL);
    door(dr.b, sw.b, [DOOR_B.x0, RY1], DOOR_B.x1 - DOOR_B.x0, 0, 90, oB);

    // Photochemistry: the energy reaches the open reaction centre, which separates charge, and an electron leaves.
    arrow(xGreen, GREEN_A, GREEN_B, b === 2 ? ramp(t, 2.9, 3.4) : b === 3 ? 1 : 0, 'line');
    if (b === 3) op(xGreen, 1 - ramp(t, 0, 0.3));
    op(cs, at(2, 3.4, 3.7));
    const ke = only(2, 3.6, 4.4);
    show(elec, b === 2 ? ramp(t, 3.6, 3.75) : b === 3 ? 1 - ramp(t, 0, 0.3) : 0);
    const ep = lerpP(E0, E1, b === 2 ? ke : 1);
    set(elecDot, 'cx', f(ep[0])); set(elecDot, 'cy', f(ep[1]));
    op(elecL, b === 2 ? ramp(t, 4.2, 4.5) : b === 3 ? 1 - ramp(t, 0, 0.3) : 0);

    // From beat 4 the reaction centre is closed: it still holds its separated charge.
    const closed = at(3, 0, 0.3);
    op(rcOpen, 1 - closed); op(rcClosed, closed); op(rcO, 1 - closed); op(rcC, closed);

    // Fluorescence: after nanoseconds, a slightly redder photon leaves through its door.
    arrow(xRed, FL_A, FL_B, b === 3 ? ramp(t, 2.8, 3.8) : b === 4 ? 1 : 0, 'wave', LAM.fl, 8, 17);
    if (b === 4) op(xRed, 1 - ramp(t, 0, 0.3));

    // Heat (NPQ): in strong light the heat door widens and the energy leaves as heat.
    xHeat.forEach((g, i) => {
      const k = b === 4 ? ramp(t, 2.6 + 0.12 * i, 3.4 + 0.12 * i) : b === 5 ? 1 : 0;
      arrow(g, HEAT[i].a, HEAT[i].b, k, 'wave', 24, 7);
      if (b === 5) op(g, 1 - ramp(t, 0, 0.3));
    });

    // Triplet: rarely the spin flips (T₁, clay); the triplet passes its energy to oxygen, making singlet oxygen,
    // and a carotenoid quenches that, giving the energy off as heat.
    op(rlS1, b < 5 ? lvl : lvl * (1 - ramp(t, 1.75, 1.92)));
    op(rlT1, b === 5 ? lvl * ramp(t, 1.92, 2.1) : 0);
    show(ox, only(5, 0.2, 0.5));
    arrow(xClay, TRIP_A, TRIP_B, only(5, 2.7, 3.2), 'line', 0, 0, 16);
    const singlet = only(5, 3.1, 3.4) * (1 - only(5, 4.0, 4.3));
    op(o2Halo, singlet);
    op(o2L, 1 - (b === 5 ? ramp(t, 3.1, 3.25) * (1 - ramp(t, 4.15, 4.3)) : 0));
    op(o2S, b === 5 ? ramp(t, 3.25, 3.4) * (1 - ramp(t, 4.0, 4.15)) : 0);
    arrow(xQ, Q_A, Q_B, only(5, 3.6, 4.0), 'line', 0, 0, 14);
    arrow(xCh, CH_A, CH_B, only(5, 4.1, 4.7), 'wave', 24, 7);
  };
}

export const STAGING: Staging = {
  id: 'b',
  name: 'B · Four doors',
  note: 'The excitation as a glow in a room with four exits, each with its time.',
  svg,
  bind,
};

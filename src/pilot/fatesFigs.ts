// Excited-chlorophyll figures that combine the classic energy-level (Jablonski) diagram with how long
// each step takes. Times are orders of magnitude: absorption fs, S₂→S₁ < 1 ps, energy transfer ps,
// charge separation < 100 ps, S₁ lifetime ns, triplet µs and longer.
import { arrow, heads, text, wave } from './mechanisms';

type Scale = 'fs' | 'ps' | 'ns' | 'us';
const SCALE_LABEL: Record<Scale, string> = { fs: 'fs', ps: 'ps', ns: 'ns', us: 'µs–ms' };

/** A time badge whose colour deepens with the timescale. */
const badge = (x: number, y: number, s: string, scale: Scale, anchor: 'start' | 'middle' | 'end' = 'middle'): string => {
  const w = s.length * 11 + 22, x0 = anchor === 'start' ? x : anchor === 'end' ? x - w : x - w / 2;
  return `<rect class="tb tb-${scale}" x="${x0}" y="${y - 15}" width="${w}" height="28" rx="14"/>${text(x0 + w / 2, y + 6, s, 'tb-t')}`;
};

/** A log time axis from 10^lo to 10^hi seconds. */
function timeAxis(X: (e: number) => number, y: number, lo: number, hi: number, vertical = false): string {
  const named: Record<number, string> = { [-15]: 'fs', [-12]: 'ps', [-9]: 'ns', [-6]: 'µs', [-3]: 'ms' };
  let s = vertical ? `<path class="axis" d="M${y},${X(lo)} V${X(hi)}"/>` : `<path class="axis" d="M${X(lo)},${y} H${X(hi)}"/>`;
  for (let e = lo; e <= hi; e++) {
    const t = named[e] ? 10 : 5, v = X(e);
    s += vertical ? `<line class="tick" x1="${y - t}" y1="${v}" x2="${y + t}" y2="${v}"/>` : `<line class="tick" x1="${v}" y1="${y - t}" x2="${v}" y2="${y + t}"/>`;
    if (named[e]) s += vertical ? text(y - 18, v + 8, named[e], 'tl', 'end') : text(v, y + 34, named[e], 'tl');
  }
  return s;
}

const numDot = (x: number, y: number, n: number): string =>
  `<circle class="num" cx="${x}" cy="${y}" r="14"/>${text(x, y + 7, `${n}`, 'num-t')}`;

/* ---------- A · classic diagram with time badges ---------- */

export function levelsBadgesSvg(): string {
  const p = 'jb';
  return `<svg class="fig-svg" viewBox="0 0 800 600" role="img" aria-label="Energy levels of chlorophyll with the time each step takes">
    ${heads(p)}
    ${arrow(p, 'ink', 'M40,540 L40,90', 'axis-ar')}<text class="tl" transform="translate(28 320) rotate(-90)" text-anchor="middle">energy</text>
    <path class="lvl" d="M80,520 H700"/>${text(72, 527, 'S₀', 'lab lab-b', 'end')}
    <path class="lvl" d="M80,270 H470"/>${text(72, 277, 'S₁', 'lab lab-b', 'end')}
    <path class="lvl" d="M80,110 H250"/>${text(72, 117, 'S₂', 'lab lab-b', 'end')}
    <path class="lvl" d="M520,360 H660"/>${text(590, 346, 'T₁ triplet', 'lab lab-b')}
    ${arrow(p, 'blue', 'M110,518 L110,114')}${arrow(p, 'red', 'M160,518 L160,274')}${badge(135, 470, 'fs', 'fs')}${text(135, 548, 'absorb', 'tiny')}
    <path class="heat" d="${wave(222, 114, 222, 262, 6, 5)}"/>${arrow(p, 'ink', 'M222,256 L222,268')}
    ${text(236, 172, 'heat', 'sm', 'start')}${badge(236, 202, '< 1 ps', 'ps', 'start')}
    ${arrow(p, 'red', 'M330,274 L330,516', 'fluor')}${text(318, 390, 'fluorescence', 'sm', 'end')}${badge(318, 420, 'ns', 'ns', 'end')}
    <path class="heat" d="${wave(400, 274, 400, 508, 6, 7)}"/>${arrow(p, 'ink', 'M400,506 L400,516')}${text(412, 390, 'heat', 'sm', 'start')}${text(412, 414, '(NPQ)', 'sm', 'start')}
    ${arrow(p, 'ink', 'M470,262 L594,170')}
    <rect class="box" x="600" y="120" width="190" height="78" rx="14"/>${text(695, 152, 'reaction centre', 'lab lab-b')}${text(695, 180, 'charge separation', 'sm')}
    ${text(522, 196, 'photochemistry', 'sm', 'end')}${badge(522, 228, '< 100 ps', 'ps', 'end')}
    ${arrow(p, 'ink', 'M470,276 L522,354', 'dashed')}${text(512, 304, 'spin flip', 'sm', 'start')}${badge(606, 304, 'ns', 'ns', 'start')}
    ${badge(590, 390, 'µs–ms', 'us')}
    ${arrow(p, 'phos', 'M600,404 L600,516')}${text(588, 452, 'phosphorescence', 'sm', 'end')}${text(588, 476, '(very weak)', 'sm', 'end')}
    ${arrow(p, 'clay', 'M660,360 L700,360')}<rect class="ros" x="704" y="330" width="86" height="60" rx="14"/>${text(747, 368, '¹O₂', 'lab lab-b')}
    ${text(747, 414, 'singlet', 'sm')}${text(747, 438, 'oxygen', 'sm')}
    ${text(690, 262, 'carotenoids quench', 'sm')}${text(690, 286, '³Chl and ¹O₂', 'sm')}
    ${(['fs', 'ps', 'ns', 'us'] as Scale[]).map((s, i) => badge(270 + i * 110, 576, SCALE_LABEL[s], s)).join('')}${text(212, 582, 'time:', 'sm', 'end')}
  </svg>`;
}

/* ---------- B · classic diagram, numbered, beside a vertical clock ---------- */

export function levelsClockSvg(): string {
  const p = 'jc';
  const Yt = (e: number): number => 70 + ((e + 15) / 12) * 480;
  const item = (e: number, n: number, title: string, sub: string): string =>
    `<path class="pin" d="M548,${Yt(e).toFixed(1)} H566"/>${numDot(580, Yt(e), n)}${text(602, Yt(e) - 2, title, 'sm lab-b', 'start')}${text(602, Yt(e) + 20, sub, 'tiny', 'start')}`;
  return `<svg class="fig-svg" viewBox="0 0 800 600" role="img" aria-label="Energy-level diagram with numbered steps, and a vertical time scale showing when each step happens">
    ${heads(p)}
    ${arrow(p, 'ink', 'M20,550 L20,80', 'axis-ar')}<text class="tl" transform="translate(10 320) rotate(-90)" text-anchor="middle">energy</text>
    <path class="lvl" d="M50,520 H510"/>${text(44, 527, 'S₀', 'sm lab-b', 'end')}
    <path class="lvl" d="M50,280 H330"/>${text(44, 287, 'S₁', 'sm lab-b', 'end')}
    <path class="lvl" d="M50,120 H170"/>${text(44, 127, 'S₂', 'sm lab-b', 'end')}
    <path class="lvl" d="M380,390 H500"/>${text(440, 412, 'T₁', 'sm lab-b')}
    ${arrow(p, 'blue', 'M74,518 L74,124')}${arrow(p, 'red', 'M110,518 L110,284')}${numDot(92, 470, 1)}
    <path class="heat" d="${wave(146, 124, 146, 272, 5, 5)}"/>${arrow(p, 'ink', 'M146,266 L146,278')}${numDot(170, 196, 2)}
    ${arrow(p, 'ink', 'M330,272 L392,206')}<rect class="box" x="396" y="150" width="130" height="62" rx="12"/>${text(461, 178, 'reaction', 'sm lab-b')}${text(461, 200, 'centre', 'sm lab-b')}${numDot(350, 220, 3)}
    ${arrow(p, 'red', 'M216,284 L216,516', 'fluor')}${numDot(216, 400, 4)}
    <path class="heat" d="${wave(276, 284, 276, 508, 5, 7)}"/>${arrow(p, 'ink', 'M276,506 L276,516')}${text(286, 440, 'heat', 'tiny', 'start')}
    ${arrow(p, 'ink', 'M330,288 L380,384', 'dashed')}${numDot(370, 330, 5)}
    ${arrow(p, 'clay', 'M440,386 L440,330')}<rect class="ros" x="400" y="276" width="80" height="50" rx="12"/>${text(440, 308, '¹O₂', 'sm lab-b')}${numDot(468, 362, 6)}
    ${arrow(p, 'phos', 'M492,394 L492,516')}${text(484, 470, 'phos.', 'tiny', 'end')}
    <rect class="gap-band" x="548" y="${Yt(-12)}" width="22" height="${Yt(-8.3) - Yt(-12)}"/>
    ${timeAxis(Yt, 548, -15, -3, true)}
    ${item(-14.6, 1, 'absorption', 'blue or red photon')}
    ${item(-13, 2, 'heat: S₂ → S₁', 'blue’s extra energy, < 1 ps')}
    ${item(-10.5, 3, 'charge separation', 'reaction centre, < 100 ps')}
    ${item(-8.7, 4, 'fluorescence', 'S₁ lifetime: ns')}
    ${item(-7.6, 5, 'spin flip to T₁', 'competes within ns')}
    ${item(-5.2, 6, 'triplet → ¹O₂', 'T₁ lives µs and longer')}
  </svg>`;
}

/* ---------- C · energy against log time: each step drawn when it happens ---------- */

const XT = (e: number): number => 120 + ((e + 15) / 12) * 660;

export function levelsTimeGridSvg(): string {
  const p = 'jg';
  return `<svg class="fig-svg" viewBox="0 0 800 600" role="img" aria-label="Energy levels drawn against logarithmic time, with each transition placed at the time it happens">
    ${heads(p)}
    <rect class="gap-band" x="${XT(-12)}" y="214" width="${XT(-8.3) - XT(-12)}" height="70"/>${text(XT(-10.15), 206, 'competition for S₁', 'note')}
    <path class="lvl" d="M${XT(-15)},500 H${XT(-3)}"/>${text(108, 507, 'S₀', 'lab lab-b', 'end')}
    <path class="lvl" d="M${XT(-15)},110 H${XT(-12.6)}"/>${text(108, 117, 'S₂', 'lab lab-b', 'end')}
    <path class="lvl" d="M${XT(-13.2)},250 H${XT(-8.3)}"/>${text(108, 257, 'S₁', 'lab lab-b', 'end')}
    <path class="lvl" d="M${XT(-8.5)},376 H${XT(-3.4)}"/>${text(XT(-8.3), 400, 'T₁', 'lab lab-b', 'start')}
    ${arrow(p, 'blue', `M${XT(-14.8)},498 L${XT(-14.8)},114`)}${arrow(p, 'red', `M${XT(-14.3)},498 L${XT(-14.3)},254`)}${text(XT(-14.55), 530, 'absorb', 'sm')}
    <path class="heat" d="${wave(XT(-13.1), 114, XT(-13.1), 242, 5, 4)}"/>${arrow(p, 'ink', `M${XT(-13.1)},238 L${XT(-13.1)},248`)}${text(XT(-13.1) + 12, 160, 'heat < 1 ps', 'sm', 'start')}
    ${arrow(p, 'ink', `M${XT(-12.4)},238 L${XT(-11.6)},238`)}${text(XT(-12), 228, 'hops', 'tiny')}
    ${arrow(p, 'ink', `M${XT(-10.5)},244 L${XT(-10.5)},100`)}<rect class="box" x="${XT(-10.5) - 96}" y="40" width="192" height="56" rx="12"/>${text(XT(-10.5), 64, 'charge separation', 'sm lab-b')}${text(XT(-10.5), 86, '< 100 ps', 'sm')}
    <path class="heat" d="${wave(XT(-9.4), 256, XT(-9.4), 490, 5, 7)}"/>${arrow(p, 'ink', `M${XT(-9.4)},488 L${XT(-9.4)},498`)}${text(XT(-9.4) - 10, 452, 'heat (NPQ)', 'sm', 'end')}
    ${arrow(p, 'red', `M${XT(-8.8)},256 L${XT(-8.8)},496`, 'fluor')}${text(XT(-8.8) + 10, 478, 'fluorescence, ns', 'sm', 'start')}
    ${arrow(p, 'ink', `M${XT(-8.6)},256 L${XT(-8.3)},370`, 'dashed')}${text(XT(-8.2), 346, 'spin flip', 'sm', 'start')}
    ${arrow(p, 'clay', `M${XT(-5.5)},372 L${XT(-5.5)},320`)}<rect class="ros" x="${XT(-5.5) - 56}" y="268" width="112" height="50" rx="12"/>${text(XT(-5.5), 300, '¹O₂', 'sm lab-b')}
    ${arrow(p, 'phos', `M${XT(-4.3)},380 L${XT(-4.3)},496`)}${text(XT(-4.3) - 8, 446, 'phosphorescence', 'tiny', 'end')}
    ${timeAxis(XT, 556, -15, -3)}
  </svg>`;
}

/* ---------- D · the life of one excitation: one path that branches over time ---------- */

export function levelsTrajectorySvg(): string {
  const p = 'jt';
  const s1 = 250, s0 = 500, t1 = 380;
  return `<svg class="fig-svg" viewBox="0 0 800 600" role="img" aria-label="The life of one excitation as a path through energy and time, branching into its possible fates">
    ${heads(p)}
    <path class="lvl-sub" d="M${XT(-15)},${s0} H${XT(-3)}M${XT(-15)},${s1} H${XT(-3)}M${XT(-15)},110 H${XT(-3)}M${XT(-15)},${t1} H${XT(-3)}"/>
    ${text(108, s0 + 7, 'S₀', 'lab lab-b', 'end')}${text(108, s1 + 7, 'S₁', 'lab lab-b', 'end')}${text(108, 117, 'S₂', 'lab lab-b', 'end')}${text(108, t1 + 7, 'T₁', 'lab lab-b', 'end')}
    <path class="traj" d="M${XT(-15)},${s0} L${XT(-14.7)},${s0} L${XT(-14.6)},110 C${XT(-13.6)},110 ${XT(-13.4)},${s1} ${XT(-12.8)},${s1} L${XT(-10.6)},${s1}"/>
    <path class="traj traj-main" d="M${XT(-10.8)},${s1} C${XT(-10.3)},${s1} ${XT(-10.2)},170 ${XT(-9.7)},150"/>
    <rect class="box" x="${XT(-9.7)}" y="118" width="196" height="60" rx="12"/>${text(XT(-9.7) + 98, 144, 'charge separation', 'sm lab-b')}${text(XT(-9.7) + 98, 168, 'most excitations', 'tiny')}
    <path class="traj traj-thin" d="M${XT(-10.6)},${s1} L${XT(-8.4)},${s1}"/>
    <path class="traj-heat" d="${wave(XT(-9.3), s1 + 4, XT(-9.1), s0 - 6, 5, 7)}"/>${text(XT(-9.4), 452, 'heat', 'sm', 'end')}
    <path class="traj-fl" d="M${XT(-8.7)},${s1} L${XT(-8.7)},${s0 - 2}"/>${text(XT(-8.6), 452, 'fluorescence', 'sm', 'start')}
    <path class="traj traj-thin traj-dash" d="M${XT(-8.5)},${s1} C${XT(-8.2)},${s1} ${XT(-8.1)},${t1} ${XT(-7.8)},${t1} L${XT(-4.4)},${t1}"/>${text(XT(-7.6), 406, 'spin flip', 'sm', 'start')}
    <path class="traj-o2" d="M${XT(-5.2)},${t1} L${XT(-5.2)},${t1 - 42}"/><rect class="ros" x="${XT(-5.2) - 48}" y="${t1 - 90}" width="96" height="46" rx="12"/>${text(XT(-5.2), t1 - 60, '¹O₂', 'sm lab-b')}
    ${text(XT(-4.4), t1 - 12, 'triplet', 'tiny', 'end')}
    <rect class="gap-band" x="${XT(-12)}" y="${s1 - 30}" width="${XT(-8.3) - XT(-12)}" height="60"/>
    ${text(XT(-14.6) + 8, 300, 'absorb', 'sm', 'start')}${text(XT(-13.5) + 10, 172, 'heat < 1 ps', 'sm', 'start')}
    ${timeAxis(XT, 556, -15, -3)}
    ${text(790, 30, 'line weight: how often each route is taken (qualitative)', 'tiny', 'end')}
  </svg>`;
}

/* ---------- E · the race out of S₁: classic exits as lanes on a time axis ---------- */

export function levelsRaceSvg(): string {
  const p = 'jr';
  const X = (e: number): number => 290 + ((e + 13) / 10) * 490;
  const lane = (y: number, label: string, end: number, cls: string, note = ''): string =>
    `<path class="fan" d="M136,300 C190,300 200,${y} 284,${y}"/>${text(284, y - 18, label, 'sm lab-b', 'end')}` +
    `<rect class="race ${cls}" x="${X(-12)}" y="${y - 13}" width="${X(end) - X(-12)}" height="26" rx="13"/>${note ? text(X(end) + 10, y + 7, note, 'sm', 'start') : ''}`;
  return `<svg class="fig-svg" viewBox="0 0 800 600" role="img" aria-label="The race out of the excited state: exits from S₁ shown as lanes on a logarithmic time axis">
    ${heads(p)}
    <circle class="node node-ps" cx="90" cy="300" r="46"/>${text(90, 296, 'S₁', 'lab lab-b')}${text(90, 320, 'excited', 'tiny')}
    ${text(90, 220, 'blue or red', 'tiny')}${text(90, 238, 'photon', 'tiny')}${arrow(p, 'red', 'M90,244 L90,250')}
    <path class="pin" d="M${X(-12)},70 V500"/>${text(X(-12) + 8, 64, 'S₁ formed (~ps)', 'tiny', 'start')}
    ${lane(120, 'photochemistry', -10.2, 'race-photo', '< 100 ps')}
    ${lane(220, 'heat (NPQ)', -9.5, 'race-heat')}
    ${lane(320, 'fluorescence', -8.5, 'race-fl', 'ns')}
    ${lane(420, 'spin flip', -8.1, 'race-isc')}
    <rect class="race race-trip" x="${X(-8.1)}" y="447" width="${X(-3.4) - X(-8.1)}" height="14" rx="7"/>${text(X(-5.6), 486, 'triplet lingers → ¹O₂', 'sm')}
    ${timeAxis(X, 540, -13, -3)}
    ${text(790, 30, 'the fastest exit takes most excitations', 'sm', 'end')}
  </svg>`;
}

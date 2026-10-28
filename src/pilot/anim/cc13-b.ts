// C13, staging B · Sour in the morning: Heyne's 1815 letter first (the printed page, Internet Archive scan, public domain)
// beside a photo of his plant, Bryophyllum calycinum (today Kalanchoe pinnata), with his three tastes appearing. Then the
// slide's own figures, each exactly as C13 draws it: v3 (one cell by night and by day; the camera zooms into the night cell,
// which fills with malic acid, then into the day cell, which empties it; acid gauge), v7 (Kalanchoë fedtschenkoi and its
// CO₂ trace, drawing itself) and v5 (water use, bars growing) with the question.
import { CC13_HIST } from './beats-cc';
import { drawFlyers, flyersSvg, type Flyer } from './cc11-common';
import { fig13, gauge } from './cc13-common';
import {
  bead, camera, clock, co2G, credit, cutPath, f1, fit, kOf, label, onStage, photo, pop, setters, slideCard, SLIDE, textScaler, tfStr, tw,
  type V,
} from './cc-anim-kit';
import type { Staging } from './types';
import heyne from '../../assets/anim/cc13/heyne1815-p213.png';
import kp from '../../assets/anim/cc13/kalanchoe-pinnata.jpg';

const P = 'a13b';
const VN = fit([14, 92, 372, 432], [30, 30, 1060, 680]), VD = fit([404, 92, 372, 432], [30, 30, 1060, 680]);
const B1 = { tastes: [0.4, 0.9, 1.4], end: 1.8 };
const B2 = { in: 0.05, cam: 0.1, camD: 1.0, drain: [0.2, 0.9] as V, labs: 1.1, t0: 1.25, gap: 0.55, end: 4.1 };
const B3 = { cam: 0.05, camD: 1.0, fill: [0.3, 0.8] as V, labs: 1.05, t0: 1.15, gap: 0.6, end: 4.5 };
const B4 = { cam: 0.05, camD: 1.0, swap: 0.1, reveal: [0.9, 2.4] as V, end: 2.7 };
const B5 = { swap: 0.1, reveal: [0.5, 1.6] as V, end: 1.9 };
const TEND = [B1.end, B2.end, B3.end, B4.end, B5.end];

export function build(): Staging {
  const v3 = fig13('v3', 'fcc13c', `${P}c`), v7 = fig13('v7', 'fcc13g', `${P}g`), v5 = fig13('v5', 'fcc13e', `${P}e`);
  // v3's cells (cell(x, night): y 160, 330 × 300, vacuole x + 150 … + 306, y 186 … 434; acid bottom at y 428)
  const vBot = 428, full = 190, low = 34, sy = 310;
  const nf: Flyer[] = [], df: Flyer[] = [];
  for (let i = 0; i < 4; i++) {
    const t = B2.t0 + i * B2.gap, j = [-30, 10, -10, 30][i];
    nf.push({ k: `${P}n-c${i}`, glyph: co2G(12), beat: 1, t0: t, d: 0.75, fade: 0.25, path: [[-40, sy - 8], [12, sy], [44, sy], [74, sy]] });
    nf.push({ k: `${P}n-m${i}`, glyph: bead('cca-mal', 11), beat: 1, t0: t + 0.8, d: 0.6, out: 0.15, path: [[150, sy], [184, sy], [268 + j, vBot - 30]] });
    const u = B3.t0 + i * B3.gap;
    df.push({ k: `${P}d-m${i}`, glyph: bead('cca-mal', 11), beat: 2, t0: u, d: 0.5, out: 0.1, path: [[658 + j, vBot - 30], [610, 412], [590, 410]] });
    df.push({ k: `${P}d-c${i}`, glyph: co2G(12), beat: 2, t0: u + 0.55, d: 0.75, fade: 0.4, path: [[588, 410], [540, 396], [522, 340], [514, 262], [506 + j / 3, 232]] });
  }
  const gg = gauge(`${P}gg`, 1140, 96);
  const an = (p: V): V => onStage(VN, p), ad = (p: V): V => onStage(VD, p);
  const labN = label(...an([268, 452]), 'vacuole');
  const labD = label(...ad([650, 226]), 'chloroplast', { to: ad([550, 222]) });

  // beat 1: Heyne's page, his plant, his three tastes
  const pg = photo(`${P}-pg`, heyne, 1560, 506, 88, 156, 820, [0, 0, 1560, 506], { mult: true });
  const ph = photo(`${P}-kp`, kp, 750, 1000, 1080, 80, 450, [0, 40, 750, 860]);
  const tastes = [['morning', '“as acid as sorrel”'], ['about noon', '“tasteless”'], ['towards evening', '“almost bitterish”']]
    .map(([w, q], i) => `<g data-k="${P}-t${i}" opacity="0">${tx2(110 + i * 280, 560, w, q)}</g>`).join('');
  const page = `<g data-k="${P}-heyne">
    <g transform="rotate(-1 500 290)"><path class="clip-paper" d="${cutPath(64, 130, 870, 320, 19, 3)}"/>${pg.svg}</g>
    ${credit(930, 478, 'Heyne 1815, Trans Linn Soc Lond 11:213 (scan: Internet Archive, public domain)')}
    ${ph.svg}${credit(1530, 80 + ph.h + 24, '<tspan font-style="italic">Kalanchoe pinnata</tspan> (= <tspan font-style="italic">Bryophyllum calycinum</tspan>) · Ahman10, Wikimedia Commons, CC0')}
    ${tastes}</g>`;

  return {
    id: 'b',
    name: 'B · Sour in the morning (Heyne 1815)',
    note: 'Heyne’s 1815 letter and his plant open the story; then the slide’s one-cell drawing night → day with the acid gauge, the Kalanchoë record and the water bars.',
    beats: CC13_HIST,
    svg: () => `
      <g data-k="cam" opacity="0"><g class="fig fcc">${slideCard(P)}
        <g data-k="w3">${v3}<rect data-k="${P}-vd" class="cca-cover" x="420" y="80" width="350" height="440" opacity="0"/><rect data-k="${P}-vn" class="cca-cover" x="0" y="80" width="390" height="440" opacity="0"/></g>
        <g data-k="w7" opacity="0">${v7}<rect data-k="${P}-cov7" class="cca-cover" x="412" y="80" width="372" height="336"/></g>
        <g data-k="w5" opacity="0">${v5}<rect data-k="${P}-cov5" class="cca-cover" x="208" y="100" width="600" height="350"/></g>
      </g></g>
      <g class="fig fcc">
        ${page}
        <g data-k="${P}-ln" opacity="0">${labN}</g><g data-k="${P}-ld" opacity="0">${labD}</g>
        <g data-k="${P}-gw" opacity="0">${gg.svg}</g>
        ${flyersSvg(nf)}${flyersSvg(df)}
      </g>`,

    bind(stage) {
      const S = setters(stage), w3 = S.q('w3'), w7 = S.q('w7'), w5 = S.q('w5');
      const scale = textScaler(S.q('cam'), S);
      const acids = Array.from(w3.querySelectorAll<SVGRectElement>('rect.fcc-acid')).sort((x, y) => +x.getAttribute('x')! - +y.getAttribute('x')!);
      const setAcid = (el: SVGRectElement, h: number): void => { S.set(el, 'y', f1(vBot - h)); S.set(el, 'height', f1(h)); };
      let last = '';
      return (beatIn, t) => {
        const b = Math.max(0, Math.min(4, Math.round(beatIn))), tt = Math.max(0, Math.min(t, TEND[b]));
        const key = `${b}:${tt.toFixed(3)}`;
        if (key === last) return;
        last = key;
        const T = clock(b, tt);
        const cam = camera([SLIDE, VN, VD, SLIDE], [[1, B2.cam, B2.camD], [2, B3.cam, B3.camD], [3, B4.cam, B4.camD]], T);
        S.set(S.q('cam'), 'transform', tfStr(cam));
        scale(kOf(cam.s));
        const toStage = (p: V): V => onStage(cam, p);

        // beat 1: the letter and the plant; then the slide's figures
        S.op(S.q(`${P}-heyne`), 1 - pop(T(1), 0));
        [0, 1, 2].forEach(i => S.op(S.q(`${P}-t${i}`), pop(T(0), B1.tastes[i])));
        S.op(S.q('cam'), pop(T(1), B2.in));
        const s7 = pop(T(3), B4.swap) * (1 - pop(T(4), B5.swap)), s5 = pop(T(4), B5.swap);
        S.op(w3, 1 - pop(T(3), B4.swap)); S.op(w7, s7); S.op(w5, s5);

        // night: the night cell drains during the zoom (dusk), then fills as CO₂ comes in; day: the day cell empties
        const inN = nf.filter(f => f.out && T(1) >= f.t0 + f.d).length, outD = df.filter(f => f.out && T(2) >= f.t0).length;
        setAcid(acids[0], b === 1 ? (tt < B2.drain[1] ? full - (full - low) * tw(tt, ...B2.drain) : low + ((full - low) * inN) / 4) : full);
        setAcid(acids[1], b === 2 ? (outD > 0 ? full - ((full - low) * outD) / 4 : low + (full - low) * tw(tt, ...B3.fill)) : low);
        S.op(S.q(`${P}-vd`), b === 1 ? 0.7 * pop(tt, B2.labs) : 0);
        S.op(S.q(`${P}-vn`), b === 2 ? 0.7 * pop(tt, B3.labs) : 0);
        S.op(S.q(`${P}-ln`), b === 1 ? pop(tt, B2.labs) : 0);
        S.op(S.q(`${P}-ld`), b === 2 ? pop(tt, B3.labs) : 0);
        S.op(S.q(`${P}-gw`), b === 1 ? pop(tt, B2.labs) : b === 2 ? 1 : 0);
        gg.draw(S, b === 1 ? (tt < B2.drain[1] ? 0 : inN / 4) : b === 2 ? 1 - outD / 4 : 0, b === 1 ? 1 : 0);
        drawFlyers(S, nf, T, toStage, b === 1 ? 1 : 0);
        drawFlyers(S, df, T, toStage, b === 2 ? 1 : 0);

        // the record and the water bars draw themselves
        const u7 = tw(T(3), ...B4.reveal), u5 = tw(T(4), ...B5.reveal);
        S.set(S.q(`${P}-cov7`), 'x', f1(412 + 372 * u7)); S.set(S.q(`${P}-cov7`), 'width', f1(372 * (1 - u7)));
        S.set(S.q(`${P}-cov5`), 'x', f1(208 + 600 * u5)); S.set(S.q(`${P}-cov5`), 'width', f1(600 * (1 - u5)));
      };
    },
  };
}

/** A taste: when, then Heyne's word. */
function tx2(x: number, y: number, when: string, q: string): string {
  return `<text class="cca-l" x="${x}" y="${y}">${when}</text><text class="cca-clip-title" x="${x}" y="${y + 44}">${q}</text>`;
}

export const STAGING = build();

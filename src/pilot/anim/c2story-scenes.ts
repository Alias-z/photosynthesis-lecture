// Era scenes of the C2 story, version 2 (dk-c2story.ts; brief research/redo-2026-10-29/C2STORY_V2_BRIEF.md): flat
// illustrations in the deck's quiet palette that move in subtle, eased loops, below the chart band (stage units,
// 1600 × 740; ground line y = 712; the corner panel covers x ≥ 964, so travelling objects wrap behind it and off the
// left edge). Organisms are those of each era:
// - early ocean (≈ 3 billion years ago): stromatolites (oldest generally accepted ≈ 3.48–3.43 billion years, Djokic et al.
//   2017, Allwood et al. 2006) and single cells in a shallow sea; waves;
// - Great Oxidation Event (≈ 2.43–2.22 billion years ago, Poulton et al. 2021): the same sea, O₂ bubbles rising from the
//   cyanobacterial mats (bubbles only here: before the event, O₂ did not build up);
// - Carboniferous (358.9–298.9 million years ago, ICS 2023): mosses, lycopsid trees (Lepidodendron), tree ferns swaying,
//   a griffinfly (Meganeura, ≈ 300 million years ago, wingspan ≈ 70 cm; Nel et al. 2018) flying;
// - Cretaceous, 100 million years ago: a sauropod (titanosaurs lived to 66 million years ago) lowering its neck to eat
//   araucarian conifer leaves, cycads, ferns, a flowering plant (angiosperm pollen from ≈ 140–133 million years ago,
//   Coiro et al. 2019), a small bipedal ornithopod walking;
// - last glacial maximum, ≈ 20,000 years ago: an ice sheet, steppe, a woolly mammoth, 3 humans (Homo sapiens) walking
//   with spears towards it (no hunt is shown);
// - farming (from ≈ 12,000–11,000 years ago, Larson et al. 2014): wheat swaying in the wind, a farmer harvesting with a
//   sickle (flint sickles are Neolithic), mud-brick houses;
// - industry (from ≈ 1760): a factory with chimney smoke drifting, a steam train moving;
// - today: a city skyline, a data centre with blinking status lights, cars on a road, a plane crossing.
// Every loop is a smooth periodic function of the ambient clock `amb` (seconds); the hunters' approach plays once with
// the beat's own time `tb`. Sways stay within ±3.5°, periods are ≥ 1.5 s, and nothing jitters.

const f = (v: number): string => (Math.round(v * 10) / 10).toString();
type Pt = [number, number];
const TAU = Math.PI * 2;
const clamp = (x: number): number => (x < 0 ? 0 : x > 1 ? 1 : x);
const smooth = (x: number): number => { const u = clamp(x); return u * u * (3 - 2 * u); };
const frac = (x: number): number => x - Math.floor(x);
/** A loop that wraps from x0 to x1 at speed v (px/s), with phase offset ph (s). */
const wrap = (amb: number, x0: number, x1: number, v: number, ph = 0): number => x0 + frac(((amb + ph) * v) / (x1 - x0)) * (x1 - x0);

/** The setters dk-c2story.ts passes in (cached attribute writes). */
export interface SceneIO { tr(k: string, v: string): void; op(k: string, v: number): void; at(k: string, a: string, v: string): void }

/** A sky tint over the whole stage. */
const sky = (c0: string, c1: string, id: string): string =>
  `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c0}"/><stop offset="1" stop-color="${c1}"/></linearGradient></defs><rect x="0" y="0" width="1600" height="740" fill="url(#${id})"/>`;
const G = 712;

/* ---------------------------------------------------------------- the sea (scenes 0, 1) */

/** A periodic sea surface from x = −200 to 1800 (wavelength 100), so a translation by 0–100 px loops seamlessly. */
const seaBody = (y: number, cls: string): string =>
  `<path class="${cls}" d="M-200,${y} ${Array.from({ length: 20 }, (_, i) => `Q${-200 + i * 100 + 25},${y - 9} ${-200 + i * 100 + 50},${y} T${-200 + i * 100 + 100},${y}`).join(' ')} V740 H-200Z"/>`;
const seaLine = (y: number, cls: string): string =>
  `<path class="${cls}" d="M-200,${y} ${Array.from({ length: 20 }, (_, i) => `Q${-200 + i * 100 + 25},${y - 5} ${-200 + i * 100 + 50},${y} T${-200 + i * 100 + 100},${y}`).join(' ')}"/>`;
function stromatolite(x: number, y: number, w: number, h: number): string {
  let s = `<path class="sc-strom" d="M${f(x - w / 2)},${y} Q${f(x - w / 2)},${f(y - h)} ${x},${f(y - h)} Q${f(x + w / 2)},${f(y - h)} ${f(x + w / 2)},${y}Z"/>`;
  for (let i = 1; i <= 4; i++) {
    const ww = w * (1 - 0.12 * i), hh = h * (1 - (i / 5) * 0.8);
    s += `<path class="sc-strom-l" d="M${f(x - ww / 2)},${y} Q${f(x - ww / 2)},${f(y - hh)} ${x},${f(y - hh)} Q${f(x + ww / 2)},${f(y - hh)} ${f(x + ww / 2)},${y}"/>`;
  }
  return s;
}
const MATS: Array<[number, number, number]> = [[110, 70, 46], [240, 96, 64], [390, 80, 52], [560, 110, 74], [730, 84, 56], [880, 104, 68]];
const CELLS: Pt[] = [[170, 600], [186, 612], [470, 590], [486, 600], [500, 592], [650, 614], [800, 598], [814, 606], [930, 622], [320, 632], [90, 640], [610, 650]];
const SURF = 566;
function seaScene(i: number): string {
  const wave = `<g data-k="s${i}-wave">${seaBody(560, i === 0 ? 'sc-sea0' : 'sc-sea1')}</g><g data-k="s${i}-wave2">${seaLine(578, 'sc-foam')}</g>`;
  const mats = MATS.map(([x, w, h]) => stromatolite(x, 700, w, h)).join('');
  const cells = CELLS.map(([x, y], k) => `<g data-k="s${i}-cell${k}"><ellipse class="sc-cell" cx="${x}" cy="${y}" rx="${6 + (k % 3)}" ry="${4 + (k % 2)}" transform="rotate(${(k * 37) % 180} ${x} ${y})"/></g>`).join('');
  const bub = i === 1 ? MATS.map((_, m) => Array.from({ length: 4 }, (_, k) => `<circle data-k="s1-b${m}-${k}" class="sc-bub" cx="0" cy="0" r="3.5" opacity="0"/>`).join('')).join('') : '';
  return wave + mats + cells + bub;
}
function seaAnim(i: number, amb: number, S: SceneIO): void {
  S.tr(`s${i}-wave`, `translate(${f(-frac(amb / 4.6) * 100)} 0)`);
  S.tr(`s${i}-wave2`, `translate(${f(frac(amb / 7.4) * 100 - 100)} 0)`);
  CELLS.forEach((_, k) => S.tr(`s${i}-cell${k}`, `translate(${f(3 * Math.sin(TAU * (amb / 3.4 + k * 0.17)))} ${f(3 * Math.sin(TAU * (amb / 2.6 + k * 0.29)))})`));
  if (i !== 1) return;
  MATS.forEach(([x, , h], m) => {
    const y0 = 700 - h + 6;
    for (let k = 0; k < 4; k++) {
      const u = frac(amb / 3.8 + k / 4 + m * 0.13), y = y0 - u * (y0 - SURF - 4), xx = x + 5 * Math.sin(TAU * (u * 1.2 + m * 0.21));
      S.at(`s1-b${m}-${k}`, 'cx', f(xx)); S.at(`s1-b${m}-${k}`, 'cy', f(y)); S.at(`s1-b${m}-${k}`, 'r', f(2.6 + 2 * u));
      S.op(`s1-b${m}-${k}`, smooth(u / 0.12) * (1 - smooth((u - 0.8) / 0.2)));
    }
  });
}

/* ---------------------------------------------------------------- Carboniferous (scene 2) */

function lepidodendron(x: number, y: number, h: number): string {
  const top: Pt = [x, y - h];
  let s = `<path class="sc-trunk" d="M${x - 15},${y} L${x - 8},${f(top[1])} L${x + 8},${f(top[1])} L${x + 15},${y}Z"/>`;
  for (let i = 1; i < 10; i++) { const yy = y - (h * i) / 10; s += `<path class="sc-scar" d="M${x - 5},${f(yy)} L${x},${f(yy - 6)} L${x + 5},${f(yy)} L${x},${f(yy + 6)}Z"/>`; }
  const fork = (p: Pt, a: number, len: number, d: number): string => {
    const q: Pt = [p[0] + Math.cos(a) * len, p[1] + Math.sin(a) * len];
    const br = `<path class="sc-branch" d="M${f(p[0])},${f(p[1])} L${f(q[0])},${f(q[1])}" style="stroke-width:${f(8 - d * 2)}"/>`;
    if (d >= 3) {
      const ux = Math.cos(a), uy = Math.sin(a), nx = -uy, ny = ux;
      let n = '';
      for (let k = 1; k <= 6; k++) {
        const u = k / 6, cx = p[0] + ux * len * u, cy = p[1] + uy * len * u, L = 9 - k * 0.6;
        n += `M${f(cx)},${f(cy)} l${f((nx + ux * 0.5) * L)},${f((ny + uy * 0.5) * L)} M${f(cx)},${f(cy)} l${f((-nx + ux * 0.5) * L)},${f((-ny + uy * 0.5) * L)} `;
      }
      return `${br}<path class="sc-needle" d="${n}"/>`;
    }
    return br + fork(q, a - 0.5, len * 0.78, d + 1) + fork(q, a + 0.5, len * 0.78, d + 1);
  };
  return s + fork(top, -Math.PI / 2, Math.min(44, h * 0.26), 0);
}
function treeFern(x: number, y: number, h: number): string {
  const top: Pt = [x, y - h];
  let s = `<path class="sc-trunk" d="M${x - 6},${y} L${x - 4},${f(top[1])} L${x + 4},${f(top[1])} L${x + 6},${y}Z"/>`;
  for (const a of [-160, -130, -100, -80, -50, -20]) {
    const r = (a * Math.PI) / 180, e: Pt = [top[0] + Math.cos(r) * 70, top[1] + Math.sin(r) * 50 + 28], c: Pt = [top[0] + Math.cos(r) * 40, top[1] + Math.sin(r) * 60];
    s += `<path class="sc-frond" d="M${f(top[0])},${f(top[1])} Q${f(c[0])},${f(c[1])} ${f(e[0])},${f(e[1])}"/>`;
    for (let k = 1; k < 6; k++) {
      const u = k / 6, px = (1 - u) * (1 - u) * top[0] + 2 * (1 - u) * u * c[0] + u * u * e[0], py = (1 - u) * (1 - u) * top[1] + 2 * (1 - u) * u * c[1] + u * u * e[1];
      s += `<path class="sc-leaflet" d="M${f(px)},${f(py)} l-5,9 M${f(px)},${f(py)} l5,9"/>`;
    }
  }
  return s;
}
const mosses = (x: number, y: number, n: number): string => Array.from({ length: n }, (_, i) => `<ellipse class="sc-moss" cx="${x + i * 22}" cy="${y}" rx="14" ry="${7 + (i % 3) * 2}"/>`).join('');
/** A griffinfly seen from above, centred at (0, 0), head towards −y; wings in their own group for the shimmer. */
function meganeura(): string {
  const wing = (dx: number, dy: number, rot: number, len: number): string =>
    `<g transform="translate(${dx} ${dy}) rotate(${rot})"><path class="sc-wing" d="M0,0 C${f(len * 0.3)},-9 ${f(len * 0.8)},-10 ${len},-3 C${f(len * 0.8)},4 ${f(len * 0.3)},6 0,0Z"/><path class="sc-vein" d="M4,-1 L${len - 6},-3 M10,1 L${f(len * 0.8)},1"/></g>`;
  let s = `<g data-k="s2-wings">${wing(4, -8, -8, 96) + wing(-4, -8, 188, 96) + wing(4, 4, 6, 86) + wing(-4, 4, 174, 86)}</g>`;
  for (let i = 0; i < 9; i++) s += `<ellipse class="sc-bodyc" cx="0" cy="${10 + i * 8}" rx="${f(4.6 - i * 0.25)}" ry="4.6"/>`;
  return s + `<ellipse class="sc-bodyc" cx="0" cy="-2" rx="7" ry="11"/><circle class="sc-bodyc" cx="0" cy="-17" r="6"/>`;
}
const FERNS: Array<[number, number]> = [[410, 100], [760, 104], [130, 84]];
const LEPS: Array<[number, number]> = [[250, 112], [580, 118], [880, 110]];
function carboniferous(): string {
  return `<rect class="sc-swamp" x="0" y="${G - 40}" width="1600" height="${740 - G + 40}"/>${mosses(20, G - 36, 6)}
    ${LEPS.map(([x, h], k) => `<g data-k="s2-lep${k}">${lepidodendron(x, G - 30, h)}</g>`).join('')}
    ${FERNS.map(([x, h], k) => `<g data-k="s2-fern${k}">${treeFern(x, G - 30, h)}</g>`).join('')}
    ${mosses(470, G - 34, 4)}
    <g data-k="s2-fly"><g transform="scale(0.46)">${meganeura()}</g></g>`;
}
function carbAnim(amb: number, S: SceneIO): void {
  FERNS.forEach(([x], k) => S.tr(`s2-fern${k}`, `rotate(${f(1.6 * Math.sin(TAU * (amb / 4.8 + k * 0.31)))} ${x} ${G - 30})`));
  LEPS.forEach(([x], k) => S.tr(`s2-lep${k}`, `rotate(${f(0.6 * Math.sin(TAU * (amb / 6.2 + k * 0.23)))} ${x} ${G - 30})`));
  // a closed, gently curving flight (period 18 s), the body along the heading, a slow wing shimmer
  const w = TAU / 18, p = amb * w;
  const x = 470 + 320 * Math.sin(p), y = 548 + 26 * Math.sin(2 * p + 0.6);
  const dx = 320 * w * Math.cos(p), dy = 52 * w * Math.cos(2 * p + 0.6);
  const head = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
  S.tr('s2-fly', `translate(${f(x)} ${f(y)}) rotate(${f(head)})`);
  S.tr('s2-wings', `scale(${f(1 + 0.05 * Math.sin(TAU * amb * 2.2))} 1)`);
}

/* ---------------------------------------------------------------- Cretaceous (scene 3) */

function araucaria(x: number, y: number, h: number): string {
  let s = `<path class="sc-trunk" d="M${x - 7},${y} L${x - 3},${y - h} L${x + 3},${y - h} L${x + 7},${y}Z"/>`;
  for (let i = 0; i < 5; i++) {
    const yy = y - h + i * 26, w = 34 + i * 14;
    s += `<path class="sc-conifer" d="M${x - w},${yy + 18} Q${x},${yy - 10} ${x + w},${yy + 18} Q${x},${yy + 6} ${x - w},${yy + 18}Z"/>`;
  }
  return s;
}
function cycad(x: number, y: number): string {
  let s = `<path class="sc-trunk" d="M${x - 14},${y} L${x - 12},${y - 56} L${x + 12},${y - 56} L${x + 14},${y}Z"/>`;
  for (const a of [-170, -140, -110, -90, -70, -40, -10]) { const r = (a * Math.PI) / 180; s += `<path class="sc-cycad" d="M${x},${y - 58} L${f(x + Math.cos(r) * 62)},${f(y - 58 + Math.sin(r) * 46)}"/>`; }
  return s;
}
const ferns = (x: number, y: number): string => [-60, -30, 0, 30, 60].map(dx => `<path class="sc-frond" d="M${x},${y} Q${x + dx * 0.6},${y - 46} ${x + dx},${y - 30}"/>`).join('');
function flower(x: number, y: number): string {
  const head = (cx: number, cy: number): string => [0, 72, 144, 216, 288].map(a => { const r = (a * Math.PI) / 180; return `<circle class="sc-petal" cx="${f(cx + Math.cos(r) * 7)}" cy="${f(cy + Math.sin(r) * 7)}" r="5.5"/>`; }).join('') + `<circle class="sc-fcentre" cx="${cx}" cy="${cy}" r="4"/>`;
  return `<path class="sc-stem" d="M${x},${y} Q${x - 4},${y - 40} ${x - 18},${y - 66} M${x - 2},${y - 30} Q${x + 14},${y - 48} ${x + 20},${y - 70}"/>${head(x - 18, y - 72)}${head(x + 20, y - 76)}`;
}
/** Sauropod facing left, body centre (x, y), scale s; the neck and head turn about NECK_PIVOT (inside the body). */
const SAU = { x: 620, y: 632, s: 0.62 };
const NECK_PIVOT: Pt = [SAU.x - 78 * SAU.s, SAU.y];
function sauropod(): string {
  const { x, y, s } = SAU;
  const P = (dx: number, dy: number): string => `${f(x + dx * s)},${f(y + dy * s)}`;
  return `<g data-k="s3-neck"><path class="sc-dino" d="M${P(-62, -14)} C${P(-90, -80)} ${P(-130, -150)} ${P(-170, -168)} C${P(-186, -174)} ${P(-198, -162)} ${P(-184, -152)} C${P(-150, -134)} ${P(-112, -74)} ${P(-92, 24)} Z"/>
      <circle class="sc-eye" cx="${f(x - 182 * s)}" cy="${f(y - 164 * s)}" r="${f(2.6 * s)}"/></g>
    <path class="sc-dino" d="M${P(80, -24)} C${P(150, -26)} ${P(220, 6)} ${P(280, 30)} C${P(220, 20)} ${P(150, 16)} ${P(84, 22)} Z"/>
    ${[-58, -22, 26, 60].map(dx => `<rect class="sc-dino${dx === -22 || dx === 60 ? ' sc-dino-far' : ''}" x="${f(x + (dx - 11) * s)}" y="${f(y + 26 * s)}" width="${f(22 * s)}" height="${f(72 * s)}" rx="${f(6 * s)}"/>`).join('')}
    <ellipse class="sc-dino" cx="${f(x)}" cy="${f(y)}" rx="${f(96 * s)}" ry="${f(50 * s)}"/>`;
}
/** A small bipedal ornithopod facing right, origin at its feet's midpoint; legs turn about the hip. */
function smallDino(): string {
  const leg = (k: number, cls: string): string => `<g data-k="s3-leg${k}"><path class="${cls}" d="M0,-24 L3,-10 L-1,0 M-1,0 h8"/></g>`;
  return `<g data-k="s3-small">${leg(1, 'sc-sdl sc-sdl-far')}
    <g data-k="s3-sbody"><path class="sc-sd" d="M-34,-30 C-22,-30 -12,-36 0,-36 C14,-36 22,-34 28,-40 C32,-48 40,-50 46,-47 C50,-45 50,-41 45,-40 C38,-39 34,-36 30,-30 C24,-22 10,-18 0,-19 C-12,-20 -24,-24 -34,-30Z"/>
      <path class="sc-sdl" d="M24,-30 l6,8"/><circle class="sc-eye" cx="43" cy="-45" r="1.4"/></g>
    ${leg(0, 'sc-sdl')}</g>`;
}
function cretaceous(): string {
  return `<rect class="sc-ground3" x="0" y="${G - 30}" width="1600" height="${740 - G + 30}"/>
    ${araucaria(90, G - 26, 160)}${cycad(225, G - 26)}${ferns(300, G - 26)}${araucaria(432, G - 26, 150)}
    ${sauropod()}${flower(830, G - 26)}${ferns(900, G - 26)}${smallDino()}`;
}
function cretAnim(amb: number, S: SceneIO): void {
  // the neck lowers to the conifer (2.2 s), stays to eat with a small bob (1.8 s), rises (2.2 s), rests (2.0 s)
  const P = 8.2, u = frac(amb / P) * P;
  const down = u < 2.2 ? smooth(u / 2.2) : u < 4 ? 1 : u < 6.2 ? 1 - smooth((u - 4) / 2.2) : 0;
  const bob = u >= 2.2 && u < 4 ? 1.6 * Math.sin(TAU * ((u - 2.2) / 0.9)) * Math.sin((Math.PI * (u - 2.2)) / 1.8) : 0;
  S.tr('s3-neck', `rotate(${f(-30 * down + bob)} ${f(NECK_PIVOT[0])} ${f(NECK_PIVOT[1])})`);
  // the small dinosaur walks right at 42 px/s and wraps behind the panel; a smooth 2-step gait
  const x = wrap(amb, -90, 1010, 42), ph = TAU * (amb / 0.9);
  S.tr('s3-small', `translate(${f(x)} ${G - 2})`);
  S.tr('s3-leg0', `translate(0 -18) rotate(${f(22 * Math.sin(ph))}) translate(0 18)`);
  S.tr('s3-leg1', `translate(0 -18) rotate(${f(-22 * Math.sin(ph))}) translate(0 18)`);
  S.tr('s3-sbody', `translate(0 ${f(-1.2 * Math.abs(Math.cos(ph)))})`);
}

/* ---------------------------------------------------------------- last glacial maximum (scene 4) */

const MAM: Pt = [300, G - 92];
function mammoth(): string {
  const [x, y] = MAM;
  return `<path class="sc-mam" d="M${x - 80},${y + 10} C${x - 86},${y - 46} ${x - 40},${y - 74} ${x + 6},${y - 70} C${x + 40},${y - 98} ${x + 92},${y - 86} ${x + 100},${y - 40} C${x + 104},${y - 24} ${x + 100},${y - 8} ${x + 86},${y - 2} C${x + 60},${y + 20} ${x + 20},${y + 28} ${x - 30},${y + 26} C${x - 60},${y + 24} ${x - 80},${y + 20} ${x - 80},${y + 10}Z"/>
    ${[-62, -34, 32, 60].map(dx => `<rect class="sc-mam${dx === -34 || dx === 60 ? ' sc-mam-far' : ''}" x="${x + dx - 11}" y="${y + 6}" width="22" height="62" rx="7"/>`).join('')}
    <g data-k="s4-trunk"><path class="sc-mam" d="M${x + 88},${y - 30} C${x + 106},${y - 8} ${x + 110},${y + 24} ${x + 104},${y + 58} L${x + 94},${y + 58} C${x + 98},${y + 26} ${x + 94},${y + 2} ${x + 80},${y - 12}Z"/></g>
    <path class="sc-tusk" d="M${x + 84},${y - 18} C${x + 108},${y + 8} ${x + 138},${y + 4} ${x + 146},${y - 22}"/>
    <g data-k="s4-tail"><path class="sc-mamt" d="M${x - 78},${y - 6} q-10,16 -6,30"/></g><circle class="sc-eye" cx="${x + 80}" cy="${y - 46}" r="2.6"/>`;
}
/** A hunter facing left, feet at (0, 0), height ≈ 120 × s; legs and the free arm turn about hip and shoulder. */
function hunter(k: number, s: number): string {
  const L = (cls: string, n: string, d: string, w: number): string => `<g data-k="s4-h${k}${n}"><path class="${cls}" d="${d}" style="stroke-width:${f(w * s)}"/></g>`;
  return `<g data-k="s4-h${k}"><g transform="scale(${s})">
    ${L('sc-huml sc-hum-far', 'l1', 'M0,-50 L4,-26 L0,0', 6)}
    <path class="sc-spear" d="M24,-100 L-58,-80"/><path class="sc-spearpt" d="M-58,-80 l9,-5 l-1,9Z"/>
    <path class="sc-humb" d="M0,-98 L0,-56" style="stroke-width:11"/><path class="sc-tunic" d="M-8,-96 L8,-96 L12,-46 L-12,-46Z"/><circle class="sc-hum" cx="-2" cy="-110" r="9"/><path class="sc-hair" d="M-10,-112 C-8,-122 6,-122 8,-112 C4,-116 -4,-116 -10,-112Z"/>
    <path class="sc-huml" d="M0,-88 L-14,-78 L-26,-86 M0,-88 L10,-80 L20,-96" style="stroke-width:5"/>
    ${L('sc-huml', 'l0', 'M0,-50 L4,-26 L0,0', 6)}</g></g>`;
}
const HUNT: Array<[number, number]> = [[700, 1.05], [770, 0.98], [842, 1.02]];
function iceAge(): string {
  return `<path class="sc-ice" d="M0,600 L90,548 L170,578 L260,536 L360,572 L470,540 L560,570 L680,528 L790,566 L900,542 L1010,578 L1130,552 L1600,580 V${G - 20} H0Z"/>
    <rect class="sc-steppe" x="0" y="${G - 24}" width="1600" height="${740 - G + 24}"/>
    ${[90, 150, 480, 560, 620, 930].map((x, k) => `<g data-k="s4-grass${k}"><path class="sc-grass" d="M${x},${G - 22} l-6,-18 M${x},${G - 22} l0,-22 M${x},${G - 22} l6,-18"/></g>`).join('')}
    ${mammoth()}${HUNT.map(([, s], k) => hunter(k, s)).join('')}`;
}
function iceAnim(amb: number, tb: number, S: SceneIO): void {
  S.tr('s4-trunk', `rotate(${f(4 * Math.sin(TAU * amb / 3.6))} ${MAM[0] + 86} ${MAM[1] - 22})`);
  S.tr('s4-tail', `rotate(${f(8 * Math.sin(TAU * amb / 2.4))} ${MAM[0] - 78} ${MAM[1] - 6})`);
  [90, 150, 480, 560, 620, 930].forEach((x, k) => S.tr(`s4-grass${k}`, `rotate(${f(3 * Math.sin(TAU * (amb / 3 - x / 300)))} ${x} ${G - 22})`));
  // the hunters walk 150 px towards the mammoth once (0.4–9.4 s of the beat, eased), then stand
  const T0 = 0.4, T1 = 9.4, u = clamp((tb - T0) / (T1 - T0)), d = 150 * smooth(u), speed = 6 * u * (1 - u);
  const ph = TAU * (tb / 1.05);
  HUNT.forEach(([x0, s], k) => {
    const sw = 20 * speed * Math.sin(ph + k * 1.9);
    S.tr(`s4-h${k}`, `translate(${f(x0 - d)} ${f(G - 18 - 1.5 * speed * Math.abs(Math.cos(ph + k * 1.9)))})`);
    S.tr(`s4-h${k}l0`, `rotate(${f(sw)} 0 -50)`); S.tr(`s4-h${k}l1`, `rotate(${f(-sw)} 0 -50)`);
    void s;
  });
}

/* ---------------------------------------------------------------- farming (scene 5) */

function wheat(x: number, y: number, h: number): string {
  let s = `<path class="sc-wheats" d="M${x},${y} Q${x + 3},${y - h * 0.6} ${x + 2},${y - h}"/>`;
  for (let i = 0; i < 6; i++) { const yy = y - h - 4 - i * 8; s += `<ellipse class="sc-grain" cx="${x - 3}" cy="${yy}" rx="3.4" ry="6" transform="rotate(-20 ${x - 3} ${yy})"/><ellipse class="sc-grain" cx="${x + 7}" cy="${yy}" rx="3.4" ry="6" transform="rotate(20 ${x + 7} ${yy})"/>`; }
  return s;
}
const WHEAT = Array.from({ length: 22 }, (_, i): [number, number, number] => [40 + i * 20, G - 20 - (i % 2) * 6, 70 + (i % 3) * 8]);
const houses = (x: number, y: number): string => [[0, 70, 60], [76, 90, 74], [176, 64, 54], [246, 84, 66]].map(([dx, w, h]) =>
  `<rect class="sc-house" x="${x + dx}" y="${y - h}" width="${w}" height="${h}"/><rect class="sc-roof" x="${x + dx - 4}" y="${y - h - 8}" width="${w + 8}" height="8"/><rect class="sc-door" x="${x + dx + w / 2 - 8}" y="${y - 30}" width="16" height="30"/>`).join('');
const FARMER: Pt = [530, G - 22];
/** A farmer bent over the wheat, facing left, a sickle in the swinging arm and a sheaf under the other. */
function farmer(): string {
  const [x, y] = FARMER;
  return `<g transform="translate(${x} ${y})">
    <path class="sc-huml" d="M6,-50 L-6,-26 L-10,0 M6,-50 L16,-26 L20,0" style="stroke-width:7"/>
    <path class="sc-humb" d="M6,-50 L-20,-84" style="stroke-width:14"/><circle class="sc-hum" cx="-30" cy="-94" r="10"/>
    <path class="sc-sheaf" d="M-4,-70 l10,-26 M-1,-69 l15,-23 M2,-68 l19,-19"/><path class="sc-huml" d="M-14,-76 L-2,-66 L4,-72" style="stroke-width:6"/>
    <g data-k="s5-arm"><path class="sc-huml" d="M-16,-78 L-34,-58 L-46,-44" style="stroke-width:6"/><path class="sc-sickleh" d="M-46,-44 l-6,6"/><path class="sc-sickle" d="M-52,-38 C-66,-40 -76,-30 -74,-16 C-70,-26 -62,-32 -52,-34Z"/></g></g>`;
}
function farming(): string {
  return `<rect class="sc-field" x="0" y="${G - 30}" width="1600" height="${740 - G + 30}"/>
    ${WHEAT.map(([x, y, h], k) => `<g data-k="s5-w${k}">${wheat(x, y, h)}</g>`).join('')}
    ${houses(630, G - 28)}${farmer()}`;
}
function farmAnim(amb: number, S: SceneIO): void {
  WHEAT.forEach(([x, y], k) => S.tr(`s5-w${k}`, `rotate(${f(3.2 * Math.sin(TAU * (amb / 3.2 - x / 260)))} ${x} ${y})`));
  // the sickle swings through the stalks and back (period 2.4 s, smooth)
  const a = -18 + 26 * (0.5 - 0.5 * Math.cos(TAU * amb / 2.4));
  S.tr('s5-arm', `rotate(${f(a)} -16 -78)`);
}

/* ---------------------------------------------------------------- industry (scene 6) */

const CHIMS: Array<[number, number]> = [[140, 118], [250, 132], [360, 112]];
function factory(x: number, y: number): string {
  let s = `<rect class="sc-fac" x="${x}" y="${y - 76}" width="360" height="76"/>`;
  for (let i = 0; i < 6; i++) s += `<path class="sc-fac" d="M${x + i * 60},${y - 76} L${x + i * 60 + 40},${y - 104} L${x + i * 60 + 60},${y - 76}Z"/>`;
  for (const [cx, h] of CHIMS) s += `<rect class="sc-chim" x="${cx - 13}" y="${y - h}" width="26" height="${h}"/>`;
  for (let i = 0; i < 6; i++) s += `<rect class="sc-win" x="${x + 16 + i * 58}" y="${y - 58}" width="30" height="34"/>`;
  return s;
}
const FAC_Y = G - 30, NPUFF = 5;
/** A steam train facing right: wagons, tender, locomotive; origin at the rear coupling on the rail. */
function train(): string {
  const wheel = (cx: number, r: number, k: number): string => `<g data-k="s6-wh${k}" transform="translate(${cx} ${-r - 2})"><circle class="sc-wheel" r="${r}"/><path class="sc-spoke" d="M${-r + 3},0 H${r - 3} M0,${-r + 3} V${r - 3}"/></g>`;
  let s = '';
  [0, 92].forEach(dx => { s += `<rect class="sc-wagon" x="${dx}" y="-50" width="84" height="36" rx="3"/><rect class="sc-wagtop" x="${dx + 4}" y="-58" width="76" height="9" rx="4"/>`; });
  s += `<rect class="sc-loco" x="184" y="-46" width="54" height="30" rx="3"/>`; // tender
  s += `<rect class="sc-loco" x="244" y="-84" width="50" height="68"/><rect class="sc-cabw" x="254" y="-76" width="18" height="16"/>`; // cab
  s += `<rect class="sc-loco" x="290" y="-62" width="104" height="44" rx="20"/><rect class="sc-loco" x="370" y="-96" width="16" height="38"/><path class="sc-loco" d="M364,-102 H392 L388,-94 H368Z"/>`; // boiler, chimney
  s += `<path class="sc-loco" d="M394,-30 L410,-12 H394Z"/>`;
  const wh: Array<[number, number]> = [[20, 9], [64, 9], [112, 9], [156, 9], [198, 9], [226, 9], [270, 13], [312, 18], [356, 18]];
  wh.forEach(([cx, r], k) => { s += wheel(cx, r, k); });
  s += Array.from({ length: NPUFF }, (_, k) => `<circle data-k="s6-tp${k}" class="sc-smoke" cx="0" cy="0" r="8" opacity="0"/>`).join('');
  return `<g data-k="s6-train">${s}</g>`;
}
const TRAIN_V = 64, TRAIN_WH: number[] = [9, 9, 9, 9, 9, 9, 13, 18, 18];
function industry(): string {
  const puffs = CHIMS.map((_, c) => Array.from({ length: NPUFF }, (_, k) => `<circle data-k="s6-p${c}-${k}" class="sc-smoke" cx="0" cy="0" r="10" opacity="0"/>`).join('')).join('');
  return `<rect class="sc-ground6" x="0" y="${G - 20}" width="1600" height="${740 - G + 20}"/>${factory(40, FAC_Y)}${puffs}
    <path class="sc-rail" d="M0,${G + 12} H1600"/><path class="sc-sleepers" d="${Array.from({ length: 70 }, (_, i) => `M${i * 24},${G + 9} v8`).join(' ')}"/>${train()}`;
}
function indAnim(amb: number, S: SceneIO): void {
  // chimney smoke: puffs rise, drift right, grow and fade (period 6 s per puff)
  CHIMS.forEach(([cx, h], c) => {
    for (let k = 0; k < NPUFF; k++) {
      const u = frac(amb / 6 + k / NPUFF + c * 0.17), id = `s6-p${c}-${k}`;
      S.at(id, 'cx', f(cx + 60 * u + 5 * Math.sin(TAU * u))); S.at(id, 'cy', f(FAC_Y - h - 8 - 62 * u)); S.at(id, 'r', f(8 + 14 * u));
      S.op(id, 0.6 * smooth(u / 0.12) * (1 - smooth((u - 0.45) / 0.55)));
    }
  });
  // the train: 64 px/s from off the left edge to behind the panel; wheels roll (angle = distance / radius)
  const x = wrap(amb, -440, 1020, TRAIN_V), dist = amb * TRAIN_V;
  S.tr('s6-train', `translate(${f(x)} ${G + 10})`);
  TRAIN_WH.forEach((r, k) => S.tr(`s6-wh${k}`, `translate(${[20, 64, 112, 156, 198, 226, 270, 312, 356][k]} ${-r - 2}) rotate(${f(((dist / r) * 180) / Math.PI % 360)})`));
  // locomotive smoke, in the train's frame: each puff leaves the chimney and stays behind in the air while it rises
  for (let k = 0; k < NPUFF; k++) {
    const u = frac(amb / 2.6 + k / NPUFF), age = u * 2.6;
    S.at(`s6-tp${k}`, 'cx', f(378 - TRAIN_V * age * 0.9)); S.at(`s6-tp${k}`, 'cy', f(-108 - 34 * u)); S.at(`s6-tp${k}`, 'r', f(7 + 12 * u));
    S.op(`s6-tp${k}`, 0.55 * smooth(u / 0.1) * (1 - smooth((u - 0.4) / 0.6)));
  }
}

/* ---------------------------------------------------------------- today (scene 7) */

function skyline(x: number, y: number): string {
  const B: Array<[number, number, number]> = [[0, 70, 120], [78, 54, 150], [140, 90, 110], [238, 60, 146], [306, 80, 100], [394, 64, 132]];
  return B.map(([dx, w, h]) => {
    let s = `<rect class="sc-tower" x="${x + dx}" y="${y - h}" width="${w}" height="${h}"/>`;
    for (let r = 0; r < Math.floor((h - 20) / 24); r++) for (let c = 0; c < Math.floor((w - 10) / 18); c++) s += `<rect class="sc-twin" x="${x + dx + 8 + c * 18}" y="${y - h + 12 + r * 24}" width="9" height="12"/>`;
    return s;
  }).join('');
}
const DC: Pt = [520, G - 18];
const LEDS: Pt[] = [];
function dataCentre(): string {
  const [x, y] = DC;
  let s = `<rect class="sc-dc" x="${x}" y="${y - 118}" width="380" height="118"/>`;
  for (let i = 0; i < 4; i++) { const cx = x + 60 + i * 86, cy = y - 132; s += `<rect class="sc-dc" x="${cx - 26}" y="${cy - 8}" width="52" height="22"/><circle class="sc-fan" cx="${cx}" cy="${cy + 3}" r="9"/><path class="sc-fanb" d="M${cx - 7},${cy + 3} H${cx + 7} M${cx},${cy - 4} V${cy + 10}"/>`; }
  // a band of windows onto the server racks; each rack's status lights blink
  for (let i = 0; i < 9; i++) {
    const wx = x + 18 + i * 40;
    s += `<rect class="sc-dcwin" x="${wx}" y="${y - 100}" width="30" height="62"/><rect class="sc-rack" x="${wx + 5}" y="${y - 96}" width="20" height="54"/>`;
    for (let k = 0; k < 4; k++) { const id = LEDS.length; LEDS.push([wx + 15, y - 88 + k * 13]); s += `<circle data-k="s7-led${id}" class="sc-led" cx="${wx + 11 + (k % 2) * 8}" cy="${y - 88 + k * 13}" r="2.4"/>`; }
  }
  return s + `<rect class="sc-door" x="${x + 170}" y="${y - 30}" width="40" height="30"/>`;
}
function car(k: number, cls: string, flip: boolean): string {
  const body = `<path class="${cls}" d="M0,-8 C0,-14 4,-16 10,-16 L20,-16 L30,-27 L56,-27 L68,-16 L78,-15 C84,-14 86,-11 86,-8 L86,-4 L0,-4Z"/><path class="sc-carw" d="M33,-24 L54,-24 L63,-16 L25,-16Z"/>`;
  const wheels = `<circle class="sc-tyre" cx="18" cy="-4" r="7"/><circle class="sc-tyre" cx="68" cy="-4" r="7"/><circle class="sc-hub" cx="18" cy="-4" r="2.6"/><circle class="sc-hub" cx="68" cy="-4" r="2.6"/>`;
  return `<g data-k="s7-car${k}"><g${flip ? ' transform="scale(-1 1)"' : ''}>${body}${wheels}</g></g>`;
}
const CARS: Array<[number, number, number, number]> = [[1, 700 + 17, 70, 0], [1, 717, 70, 7.5], [-1, 733, 56, 2], [-1, 733, 56, 11]]; // [direction, y, speed, phase]
function plane(): string {
  return `<g data-k="s7-plane"><path class="sc-trail" d="M-260,1 H-8"/><path class="sc-plane" d="M0,0 C6,-4 14,-5 22,-5 L60,-5 C68,-5 74,-2 76,0 C74,2 68,4 60,4 L22,4 C14,4 6,3 0,0Z"/>
    <path class="sc-plane" d="M34,-4 L22,-18 L30,-18 L50,-4Z"/><path class="sc-plane" d="M34,3 L24,14 L32,14 L50,3Z"/><path class="sc-plane" d="M4,-1 L-2,-13 L5,-13 L14,-2Z"/></g>`;
}
function today(): string {
  return `<rect class="sc-ground7" x="0" y="${G - 22}" width="1600" height="${740 - G + 22}"/>
    ${skyline(20, G - 20)}${dataCentre()}
    <rect class="sc-road" x="0" y="${G - 8}" width="1600" height="36"/><path class="sc-lane" d="M0,${G + 10} H1600"/>
    ${CARS.map(([dir], k) => car(k, ['sc-car0', 'sc-car1', 'sc-car2', 'sc-car3'][k], dir < 0)).join('')}${plane()}`;
}
function todayAnim(amb: number, S: SceneIO): void {
  LEDS.forEach((_, k) => {
    const per = 1.7 + (k % 5) * 0.37, u = frac(amb / per + k * 0.137);
    S.op(`s7-led${k}`, 0.25 + 0.75 * smooth(u / 0.15) * (1 - smooth((u - 0.45) / 0.15)));
  });
  CARS.forEach(([dir, y, v, ph], k) => {
    const x = dir > 0 ? wrap(amb, -120, 1020, v, ph) : 1020 - wrap(amb, 0, 1140, v, ph);
    S.tr(`s7-car${k}`, `translate(${f(x)} ${y})`);
  });
  S.tr('s7-plane', `translate(${f(wrap(amb, -120, 1300, 34))} 512)`);
}

/* ---------------------------------------------------------------- the scene list */

const ALL: Array<[string, string]> = [
  [sky('#efe0c8', '#e9e3d2', 'sc0g'), seaScene(0)],
  [sky('#e3ece6', '#dfe9e4', 'sc1g'), seaScene(1)],
  [sky('#e4ecdc', '#dfe6d2', 'sc2g'), carboniferous()],
  [sky('#ece9d6', '#e6e1c8', 'sc3g'), cretaceous()],
  [sky('#e6edf2', '#e2e6e4', 'sc4g'), iceAge()],
  [sky('#f0ead8', '#ebe2c8', 'sc5g'), farming()],
  [sky('#e8e4dc', '#e2ddd2', 'sc6g'), industry()],
  [sky('#e3e8ee', '#dfe3e6', 'sc7g'), today()],
];
export const SKY: string[] = ALL.map(a => a[0]);
export const GROUND: string[] = ALL.map(a => a[1]);
export const N_SCENES = ALL.length;

/** Moves scene i: `amb` is the ambient clock (s), `tb` the time since the beat began (s). */
export function animScene(i: number, amb: number, tb: number, S: SceneIO): void {
  if (i <= 1) seaAnim(i, amb, S);
  else if (i === 2) carbAnim(amb, S);
  else if (i === 3) cretAnim(amb, S);
  else if (i === 4) iceAnim(amb, tb, S);
  else if (i === 5) farmAnim(amb, S);
  else if (i === 6) indAnim(amb, S);
  else if (i === 7) todayAnim(amb, S);
}

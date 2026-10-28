// Era scenes of the C2 story (dk-c2story.ts): flat illustrations drawn here as simple shapes in the deck's quiet palette
// (stage units, 1600 × 740; ground at the bottom, the chart above). Organisms are those of each era:
// - early ocean (≈ 3.5–3 billion years ago): stromatolites (layered microbial mounds, oldest generally accepted ≈ 3.48
//   billion years, Djokic et al. 2017; 3.43 billion years, Allwood et al. 2006) and single cells in a shallow sea;
// - Great Oxidation Event (≈ 2.43–2.22 billion years ago, Poulton et al. 2021): the same sea, O₂ bubbles from
//   cyanobacterial mats;
// - Carboniferous (358.9–298.9 million years ago, ICS 2023): mosses, lycopsid trees (Lepidodendron), tree ferns, a
//   griffinfly (Meganeura, ≈ 300 million years ago, wingspan ≈ 70 cm; Nel et al. 2018);
// - Mesozoic (dinosaurs ≈ 230–66 million years ago, Martínez et al. 2011, ICS): a sauropod among araucarian conifers,
//   cycads and ferns; a small early flowering plant (angiosperm pollen from the Valanginian, ≈ 140–133 million years ago,
//   Coiro et al. 2019);
// - ice ages and early humans (last ≈ 3 million years): an ice sheet, a woolly mammoth (last glacial period), 2 humans
//   with stone tools (oldest tools 3.3 million years ago, Harmand et al. 2015);
// - farming (≈ 12,000–11,000 years ago, Larson et al. 2014): a wheat field and mud-brick houses;
// - industry (from ≈ 1760; first steam engine 1712): factory chimneys and a steam locomotive;
// - today: a city skyline and a data centre.

const f = (v: number): string => v.toFixed(1);
type Pt = [number, number];

/** A sky tint over the whole stage and the ground band. */
const sky = (c0: string, c1: string, id: string): string =>
  `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c0}"/><stop offset="1" stop-color="${c1}"/></linearGradient></defs><rect x="0" y="0" width="1600" height="740" fill="url(#${id})"/>`;

/* ---------------------------------------------------------------- organisms and objects */

/** A stromatolite: a dome of fine layers, base centre (x, y), width w, height h. */
function stromatolite(x: number, y: number, w: number, h: number): string {
  let s = `<path class="sc-strom" d="M${f(x - w / 2)},${y} Q${f(x - w / 2)},${f(y - h)} ${x},${f(y - h)} Q${f(x + w / 2)},${f(y - h)} ${f(x + w / 2)},${y}Z"/>`;
  for (let i = 1; i <= 4; i++) {
    const k = i / 5, ww = w * (1 - 0.12 * i), hh = h * (1 - k * 0.8);
    s += `<path class="sc-strom-l" d="M${f(x - ww / 2)},${y} Q${f(x - ww / 2)},${f(y - hh)} ${x},${f(y - hh)} Q${f(x + ww / 2)},${f(y - hh)} ${f(x + ww / 2)},${y}"/>`;
  }
  return s;
}
/** A shallow sea: water from y down, a gentle wave line. */
const sea = (y: number, cls: string): string =>
  `<path class="${cls}" d="M0,${y} ${Array.from({ length: 17 }, (_, i) => `Q${i * 100 + 25},${y - 8} ${i * 100 + 50},${y} T${i * 100 + 100},${y}`).join(' ')} V740 H0Z"/>`;
/** Single cells: small rounded cells in clusters. */
const cells = (pts: Pt[]): string => pts.map(([x, y], i) => `<ellipse class="sc-cell" cx="${x}" cy="${y}" rx="${6 + (i % 3)}" ry="${4 + (i % 2)}" transform="rotate(${(i * 37) % 180} ${x} ${y})"/>`).join('');
/** Gas bubbles rising in a column from (x, y). */
const bubbles = (x: number, y: number, n: number, seed: number): string =>
  Array.from({ length: n }, (_, i) => { const r = 3 + ((i * 7 + seed) % 4), dx = Math.sin(i * 1.7 + seed) * 6; return `<circle class="sc-bub" cx="${f(x + dx)}" cy="${f(y - i * 22)}" r="${r}"/>`; }).join('');

/** A lycopsid tree (Lepidodendron): a tall straight trunk with diamond leaf scars and, at the top, a crown of
 *  repeatedly forked branches ending in bottle-brush leafy shoots. */
function lepidodendron(x: number, y: number, h: number): string {
  const top: Pt = [x, y - h];
  let s = `<path class="sc-trunk" d="M${x - 15},${y} L${x - 8},${f(top[1])} L${x + 8},${f(top[1])} L${x + 15},${y}Z"/>`;
  for (let i = 1; i < 10; i++) { const yy = y - (h * i) / 10; s += `<path class="sc-scar" d="M${x - 5},${f(yy)} L${x},${f(yy - 6)} L${x + 5},${f(yy)} L${x},${f(yy + 6)}Z"/>`; }
  const fork = (p: Pt, a: number, len: number, d: number): string => {
    const q: Pt = [p[0] + Math.cos(a) * len, p[1] + Math.sin(a) * len];
    const br = `<path class="sc-branch" d="M${f(p[0])},${f(p[1])} L${f(q[0])},${f(q[1])}" style="stroke-width:${f(8 - d * 2)}"/>`;
    if (d >= 3) {
      // a bottle-brush shoot: short needle leaves on both sides along the last branch
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
/** A tree fern: a slender trunk and arching fronds with leaflets. */
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
/** Low mosses: rounded green cushions. */
const mosses = (x: number, y: number, n: number): string => Array.from({ length: n }, (_, i) => `<ellipse class="sc-moss" cx="${x + i * 22}" cy="${y}" rx="14" ry="${7 + (i % 3) * 2}"/>`).join('');
/** A griffinfly (Meganeura), seen from above: a long segmented abdomen, a thorax with 2 pairs of long narrow veined wings. */
function meganeura(x: number, y: number): string {
  const wing = (dx: number, dy: number, rot: number, len: number): string =>
    `<g transform="translate(${x + dx} ${y + dy}) rotate(${rot})"><path class="sc-wing" d="M0,0 C${f(len * 0.3)},-9 ${f(len * 0.8)},-10 ${len},-3 C${f(len * 0.8)},4 ${f(len * 0.3)},6 0,0Z"/><path class="sc-vein" d="M4,-1 L${len - 6},-3 M10,1 L${f(len * 0.8)},1"/></g>`;
  let s = wing(4, -8, -8, 96) + wing(-4, -8, 188, 96) + wing(4, 4, 6, 86) + wing(-4, 4, 174, 86);
  for (let i = 0; i < 9; i++) s += `<ellipse class="sc-bodyc" cx="${x}" cy="${y + 10 + i * 8}" rx="${f(4.6 - i * 0.25)}" ry="4.6"/>`;
  return s + `<ellipse class="sc-bodyc" cx="${x}" cy="${y - 2}" rx="7" ry="11"/><circle class="sc-bodyc" cx="${x}" cy="${y - 17}" r="6"/>`;
}
/** An araucarian conifer: a straight trunk with tiers of branches near the top. */
function araucaria(x: number, y: number, h: number): string {
  let s = `<path class="sc-trunk" d="M${x - 7},${y} L${x - 3},${y - h} L${x + 3},${y - h} L${x + 7},${y}Z"/>`;
  for (let i = 0; i < 5; i++) {
    const yy = y - h + i * 26, w = 34 + i * 14;
    s += `<path class="sc-conifer" d="M${x - w},${yy + 18} Q${x},${yy - 10} ${x + w},${yy + 18} Q${x},${yy + 6} ${x - w},${yy + 18}Z"/>`;
  }
  return s;
}
/** A cycad: a stout trunk with a crown of stiff pinnate leaves. */
function cycad(x: number, y: number): string {
  let s = `<path class="sc-trunk" d="M${x - 14},${y} L${x - 12},${y - 56} L${x + 12},${y - 56} L${x + 14},${y}Z"/>`;
  for (const a of [-170, -140, -110, -90, -70, -40, -10]) {
    const r = (a * Math.PI) / 180, e: Pt = [x + Math.cos(r) * 62, y - 58 + Math.sin(r) * 46];
    s += `<path class="sc-cycad" d="M${x},${y - 58} L${f(e[0])},${f(e[1])}"/>`;
  }
  return s;
}
/** Ferns: low arching fronds. */
const ferns = (x: number, y: number): string => [-60, -30, 0, 30, 60].map(dx => `<path class="sc-frond" d="M${x},${y} Q${x + dx * 0.6},${y - 46} ${x + dx},${y - 30}"/>`).join('');
/** A sauropod, facing left: body, long neck and small head, long tail, 4 pillar legs. */
function sauropod(x: number, y: number, s = 1): string {
  const P = (dx: number, dy: number): string => `${f(x + dx * s)},${f(y + dy * s)}`;
  return `<path class="sc-dino" d="M${P(-70, -10)} C${P(-90, -80)} ${P(-130, -150)} ${P(-170, -168)} C${P(-186, -174)} ${P(-196, -160)} ${P(-182, -152)} C${P(-150, -136)} ${P(-112, -76)} ${P(-86, 20)} Z"/>
    <ellipse class="sc-dino" cx="${f(x)}" cy="${f(y)}" rx="${f(96 * s)}" ry="${f(50 * s)}"/>
    <path class="sc-dino" d="M${P(80, -24)} C${P(150, -26)} ${P(220, 6)} ${P(280, 30)} C${P(220, 20)} ${P(150, 16)} ${P(84, 22)} Z"/>
    ${[-58, -22, 26, 60].map(dx => `<rect class="sc-dino" x="${f(x + (dx - 11) * s)}" y="${f(y + 26 * s)}" width="${f(22 * s)}" height="${f(72 * s)}" rx="${f(6 * s)}"/>`).join('')}
    <circle class="sc-eye" cx="${f(x - 182 * s)}" cy="${f(y - 164 * s)}" r="${f(2.6 * s)}"/>`;
}
/** A small early flowering plant: a branched stem with 5-petal flowers. */
function flower(x: number, y: number): string {
  const head = (cx: number, cy: number): string => [0, 72, 144, 216, 288].map(a => { const r = (a * Math.PI) / 180; return `<circle class="sc-petal" cx="${f(cx + Math.cos(r) * 7)}" cy="${f(cy + Math.sin(r) * 7)}" r="5.5"/>`; }).join('') + `<circle class="sc-fcentre" cx="${cx}" cy="${cy}" r="4"/>`;
  return `<path class="sc-stem" d="M${x},${y} Q${x - 4},${y - 40} ${x - 18},${y - 66} M${x - 2},${y - 30} Q${x + 14},${y - 48} ${x + 20},${y - 70}"/>${head(x - 18, y - 72)}${head(x + 20, y - 76)}`;
}
/** A woolly mammoth, facing right. */
function mammoth(x: number, y: number): string {
  return `<path class="sc-mam" d="M${x - 80},${y + 10} C${x - 86},${y - 46} ${x - 40},${y - 74} ${x + 6},${y - 70} C${x + 40},${y - 98} ${x + 92},${y - 86} ${x + 100},${y - 40} C${x + 112},${y - 10} ${x + 112},${y + 30} ${x + 106},${y + 62} L${x + 96},${y + 62} C${x + 98},${y + 30} ${x + 92},${y + 4} ${x + 80},${y - 6} C${x + 60},${y + 20} ${x + 20},${y + 28} ${x - 30},${y + 26} C${x - 60},${y + 24} ${x - 80},${y + 20} ${x - 80},${y + 10}Z"/>
    ${[-62, -34, 32, 60].map(dx => `<rect class="sc-mam" x="${x + dx - 11}" y="${y + 6}" width="22" height="62" rx="7"/>`).join('')}
    <path class="sc-tusk" d="M${x + 84},${y - 18} C${x + 108},${y + 8} ${x + 138},${y + 4} ${x + 146},${y - 22}"/><circle class="sc-eye" cx="${x + 82}" cy="${y - 46}" r="2.6"/>`;
}
/** A walking human with a stone tool in the hand (flat silhouette). */
function human(x: number, y: number, s = 1, tool = true): string {
  const P = (dx: number, dy: number): string => `${f(x + dx * s)},${f(y + dy * s)}`;
  return `<circle class="sc-hum" cx="${f(x)}" cy="${f(y - 112 * s)}" r="${f(10 * s)}"/>
    <path class="sc-humb" d="M${P(0, -98)} L${P(0, -50)}" style="stroke-width:${f(14 * s)}"/>
    <path class="sc-huml" d="M${P(0, -52)} L${P(-12, -2)} M${P(0, -52)} L${P(14, -4)} M${P(0, -90)} L${P(-14, -62)} M${P(0, -90)} L${P(16, -66)}" style="stroke-width:${f(7 * s)}"/>
    ${tool ? `<path class="sc-tool" d="M${P(14, -70)} L${P(26, -64)} L${P(18, -56)}Z"/>` : ''}`;
}
/** Wheat: a stem and an ear of paired grains. */
function wheat(x: number, y: number, h: number): string {
  let s = `<path class="sc-wheats" d="M${x},${y} Q${x + 3},${y - h * 0.6} ${x + 2},${y - h}"/>`;
  for (let i = 0; i < 6; i++) { const yy = y - h - 4 - i * 8; s += `<ellipse class="sc-grain" cx="${x - 3}" cy="${yy}" rx="3.4" ry="6" transform="rotate(-20 ${x - 3} ${yy})"/><ellipse class="sc-grain" cx="${x + 7}" cy="${yy}" rx="3.4" ry="6" transform="rotate(20 ${x + 7} ${yy})"/>`; }
  return s;
}
/** Mud-brick houses with flat roofs (an early farming village). */
const houses = (x: number, y: number): string => [[0, 70, 60], [76, 90, 74], [176, 64, 54], [246, 84, 66]].map(([dx, w, h]) =>
  `<rect class="sc-house" x="${x + dx}" y="${y - h}" width="${w}" height="${h}"/><rect class="sc-roof" x="${x + dx - 4}" y="${y - h - 8}" width="${w + 8}" height="8"/><rect class="sc-door" x="${x + dx + w / 2 - 8}" y="${y - 30}" width="16" height="30"/>`).join('');
/** A factory: sawtooth roofs, 3 chimneys with smoke. */
function factory(x: number, y: number): string {
  let s = `<rect class="sc-fac" x="${x}" y="${y - 110}" width="360" height="110"/>`;
  for (let i = 0; i < 6; i++) s += `<path class="sc-fac" d="M${x + i * 60},${y - 110} L${x + i * 60 + 40},${y - 150} L${x + i * 60 + 60},${y - 110}Z"/>`;
  for (const [dx, h] of [[60, 170], [170, 195], [280, 165]]) {
    s += `<rect class="sc-chim" x="${x + dx}" y="${y - h}" width="26" height="${h}"/>`;
    for (let k = 0; k < 3; k++) s += `<circle class="sc-smoke" cx="${x + dx + 18 + k * 24}" cy="${y - h - 14 - k * 8}" r="${11 + k * 4}"/>`;
  }
  for (let i = 0; i < 6; i++) s += `<rect class="sc-win" x="${x + 16 + i * 58}" y="${y - 80}" width="30" height="40"/>`;
  return s;
}
/** A steam locomotive on rails, facing left. */
function locomotive(x: number, y: number): string {
  return `<path class="sc-rail" d="M${x - 60},${y + 2} H${x + 320}"/>
    <rect class="sc-loco" x="${x}" y="${y - 70}" width="170" height="52" rx="22"/><rect class="sc-loco" x="${x + 160}" y="${y - 110}" width="70" height="92"/>
    <rect class="sc-loco" x="${x + 26}" y="${y - 112}" width="22" height="44"/><path class="sc-loco" d="M${x + 14},${y - 118} H${x + 60} L${x + 52},${y - 108} H${x + 22}Z"/>
    ${[30, 80, 130, 200].map(dx => `<circle class="sc-wheel" cx="${x + dx}" cy="${y - 16}" r="${dx === 200 ? 16 : 20}"/>`).join('')}
    ${[0, 1, 2].map(k => `<circle class="sc-smoke" cx="${x + 40 + k * 26}" cy="${y - 130 - k * 8}" r="${10 + k * 4}"/>`).join('')}`;
}
/** A city skyline: towers with window grids. */
function skyline(x: number, y: number): string {
  const B: Array<[number, number, number]> = [[0, 70, 140], [78, 54, 196], [140, 90, 160], [238, 60, 205], [306, 80, 130], [394, 64, 180], [466, 96, 150]];
  return B.map(([dx, w, h]) => {
    let s = `<rect class="sc-tower" x="${x + dx}" y="${y - h}" width="${w}" height="${h}"/>`;
    for (let r = 0; r < Math.floor((h - 20) / 26); r++) for (let c = 0; c < Math.floor((w - 10) / 18); c++) s += `<rect class="sc-twin" x="${x + dx + 8 + c * 18}" y="${y - h + 12 + r * 26}" width="9" height="13"/>`;
    return s;
  }).join('');
}
/** A data centre: a long low hall with server-rack bays and rooftop cooling fans. */
function dataCentre(x: number, y: number): string {
  let s = `<rect class="sc-dc" x="${x}" y="${y - 120}" width="330" height="120"/>`;
  for (let i = 0; i < 10; i++) s += `<rect class="sc-rack" x="${x + 14 + i * 31}" y="${y - 104}" width="20" height="88"/>${[0, 1, 2, 3, 4].map(k => `<circle class="sc-led" cx="${x + 24 + i * 31}" cy="${y - 92 + k * 16}" r="2.2"/>`).join('')}`;
  for (let i = 0; i < 4; i++) { const cx = x + 50 + i * 76, cy = y - 136; s += `<rect class="sc-dc" x="${cx - 26}" y="${cy - 10}" width="52" height="26"/><circle class="sc-fan" cx="${cx}" cy="${cy + 3}" r="10"/><path class="sc-fanb" d="M${cx - 8},${cy + 3} H${cx + 8} M${cx},${cy - 5} V${cy + 11}"/>`; }
  return s;
}

/* ---------------------------------------------------------------- the scenes */

const G = 712; // ground line
const ALL: string[] = [
  // 0 · early ocean, single cells and stromatolites
  `${sky('#efe0c8', '#e9e3d2', 'sc0g')}${sea(560, 'sc-sea0')}
   ${[[110, 70, 46], [240, 96, 64], [390, 80, 52], [560, 110, 74], [730, 84, 56], [880, 104, 68]].map(([x, w, h]) => stromatolite(x, 700, w, h)).join('')}
   ${cells([[170, 600], [184, 610], [470, 590], [484, 598], [498, 592], [650, 612], [800, 596], [812, 604], [930, 620], [320, 630]])}`,
  // 1 · Great Oxidation Event: the sea turns blue-green, O₂ bubbles from the mats
  `${sky('#e3ece6', '#dfe9e4', 'sc1g')}${sea(560, 'sc-sea1')}
   ${[[110, 70, 46], [240, 96, 64], [390, 80, 52], [560, 110, 74], [730, 84, 56], [880, 104, 68]].map(([x, w, h]) => stromatolite(x, 700, w, h)).join('')}
   ${[[110, 650], [240, 632], [390, 646], [560, 622], [730, 642], [880, 628]].map(([x, y], i) => bubbles(x, y, 4, i)).join('')}`,
  // 2 · Carboniferous coal forest
  `${sky('#e4ecdc', '#dfe6d2', 'sc2g')}<rect class="sc-swamp" x="0" y="${G - 40}" width="1600" height="${740 - G + 40}"/>
   ${mosses(30, G - 36, 7)}${lepidodendron(250, G - 30, 112)}${treeFern(410, G - 30, 100)}${lepidodendron(580, G - 30, 118)}${treeFern(760, G - 30, 104)}${lepidodendron(880, G - 30, 110)}
   ${meganeura(690, 560)}`,
  // 3 · Mesozoic: sauropod, araucarian conifers, cycads, ferns, an early flowering plant
  `${sky('#ece9d6', '#e6e1c8', 'sc3g')}<rect class="sc-ground3" x="0" y="${G - 30}" width="1600" height="${740 - G + 30}"/>
   ${araucaria(100, G - 26, 150)}${cycad(240, G - 26)}${ferns(320, G - 26)}${sauropod(560, G - 80, 0.62)}${flower(810, G - 26)}${araucaria(880, G - 26, 160)}`,
  // 4 · ice age: ice sheet, woolly mammoth, early humans with stone tools
  `${sky('#e6edf2', '#e2e6e4', 'sc4g')}
   <path class="sc-ice" d="M0,620 L90,560 L170,590 L260,545 L360,585 L470,550 L560,580 L680,535 L790,575 L900,550 L1010,585 L1130,560 L1600,590 V${G - 20} H0Z"/>
   <rect class="sc-steppe" x="0" y="${G - 24}" width="1600" height="${740 - G + 24}"/>
   ${mammoth(330, G - 92)}${human(760, G - 18, 1.1)}${human(830, G - 18, 1.0)}
   ${[120, 520, 600, 960, 1050].map(x => `<path class="sc-grass" d="M${x},${G - 22} l-6,-18 M${x},${G - 22} l0,-22 M${x},${G - 22} l6,-18"/>`).join('')}`,
  // 5 · farming: a wheat field and an early village
  `${sky('#f0ead8', '#ebe2c8', 'sc5g')}<rect class="sc-field" x="0" y="${G - 30}" width="1600" height="${740 - G + 30}"/>
   ${Array.from({ length: 24 }, (_, i) => wheat(40 + i * 20, G - 20 - (i % 2) * 6, 70 + (i % 3) * 8)).join('')}
   ${houses(600, G - 28)}${human(560, G - 26, 0.9, false)}`,
  // 6 · industry: factory chimneys and a steam locomotive
  `${sky('#e8e4dc', '#e2ddd2', 'sc6g')}<rect class="sc-ground6" x="0" y="${G - 20}" width="1600" height="${740 - G + 20}"/>
   ${factory(80, G - 20)}${locomotive(620, G - 22)}`,
  // 7 · today: city skyline and a data centre
  `${sky('#e3e8ee', '#dfe3e6', 'sc7g')}<rect class="sc-ground7" x="0" y="${G - 20}" width="1600" height="${740 - G + 20}"/>
   ${skyline(30, G - 20)}${dataCentre(600, G - 20)}`,
];

/** Each scene's sky tint (the first element) and its ground with the organisms and objects, apart, so that the chart
 *  can show the sky faintly behind it and keep the ground below the chart. */
const split = (sc: string): [string, string] => { const j = sc.indexOf('/>', sc.indexOf('fill="url(#')) + 2; return [sc.slice(0, j), sc.slice(j)]; };
export const SKY: string[] = ALL.map(sc => split(sc)[0]);
export const GROUND: string[] = ALL.map(sc => split(sc)[1]);
export const SCENES = ALL;

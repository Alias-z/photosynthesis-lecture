// "Follow an excitation": a stepped overlay animation for slide 6, drawn once and shown in two looks.
// The lecturer steps through the beats; motion inside a beat plays once and then holds.
import { pigmentDots, psiiScene } from './figures';

type Pt = [number, number];

interface Beat { tag: string; say: string }

const BEATS: Beat[] = [
  { tag: '1932', say: 'Emerson and Arnold lit algae with brief, saturating flashes. Each flash fixed at most one CO₂ per ~2,500 chlorophylls: chlorophylls must work in teams.' },
  { tag: 'Today', say: 'Cryo-electron microscopy now shows the team: hundreds of pigments held by proteins around the reaction centres.' },
  { tag: 'Absorb', say: 'A chlorophyll b absorbs a photon. Its energy becomes an excitation; nothing has moved yet.' },
  { tag: 'Transfer', say: 'The excitation hops from pigment to pigment: downhill from Chl b to Chl a, then on among Chl a until the reaction centre traps it. The pigments stay in place.' },
  { tag: 'Separate', say: 'At the reaction centre an electron moves to a neighbouring acceptor. Charge is separated: light energy has become chemical energy.' },
  { tag: 'Take-home', say: 'Antenna: energy moves. Reaction centre: an electron moves. The whole trip takes less than a billionth of a second.' },
];

const S = 2.3, OX = 170, OY = 40;
const toStage = ([x, y]: Pt): Pt => [OX + x * S, OY + y * S];
const lerp = (a: Pt, b: Pt, t: number): Pt => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
const ease = (t: number): number => (t < 0 ? 0 : t > 1 ? 1 : t * t * (3 - 2 * t));

/** Builds the animation inside host and returns a function that stops it. */
export function mountExcitation(host: HTMLElement, look: 'plate' | 'story'): () => void {
  const scene = psiiScene();
  const path = scene.path.map(toStage);
  const rc = path[path.length - 1];
  const acceptor: Pt = [rc[0] + 46, rc[1] + 58];
  const start = path[0];
  const ladder = { x: 1150, w: 220, b: 210, a: 300, cs: 470 };

  host.className = `anim look-${look}`;
  host.tabIndex = 0;
  host.innerHTML = `
    <svg class="anim-svg" viewBox="0 0 1600 760" aria-hidden="true">
      <defs>
        <radialGradient id="glow-${look}"><stop offset="0" class="g0"/><stop offset="1" class="g1"/></radialGradient>
      </defs>
      <g class="hist">
        <g class="lamp"><circle cx="250" cy="250" r="34" class="lamp-body"/>${Array.from({ length: 10 }, (_, k) => {
          const a = (k / 10) * Math.PI * 2;
          return `<line class="ray" x1="${250 + Math.cos(a) * 46}" y1="${250 + Math.sin(a) * 46}" x2="${250 + Math.cos(a) * 82}" y2="${250 + Math.sin(a) * 82}"/>`;
        }).join('')}</g>
        <path class="flask" d="M480,250 h70 v120 l90,190 q8,26 -20,26 h-210 q-28,0 -20,-26 l90,-190z"/>
        <path class="algae" d="M436,470 h158 l38,80 q6,18 -14,18 h-206 q-20,0 -14,-18z"/>
        <circle class="bubble" cx="515" cy="460" r="13"/>
        <text class="big" x="800" y="330">~2,500 chlorophylls</text>
        <text class="big" x="800" y="430">→ 1 CO₂ fixed per flash</text>
        <text class="small" x="800" y="510">Emerson &amp; Arnold 1932</text>
      </g>
      <g class="scene">
        <g transform="translate(${OX} ${OY}) scale(${S})">${scene.shapes}${pigmentDots(scene.pigments)}${scene.rc.map(([x, y]) => `<circle class="rc-ring" cx="${x}" cy="${y}" r="9"/>`).join('')}</g>
        <text class="tag-l" x="${OX + 58 * S}" y="${OY + 230 * S}" text-anchor="middle">LHCII</text>
        <text class="tag-l" x="${OX + 200 * S}" y="${OY + 236 * S}" text-anchor="middle">PSII core</text>
        <text class="tag-s" x="${OX + 200 * S}" y="${OY + 30 * S}" text-anchor="middle">reaction centres</text>
        <path class="photon" d=""/>
        <g class="trail"></g>
        <circle class="exc" r="40" fill="url(#glow-${look})"/>
        <circle class="exc-core" r="11"/>
        <g class="charges">
          <text class="plus" x="${rc[0] - 34}" y="${rc[1] - 22}">+</text>
          <g class="electron"><circle r="17"/><text y="7" text-anchor="middle">e⁻</text></g>
          <text class="tag-s" x="${acceptor[0] + 24}" y="${acceptor[1] + 44}">acceptor</text>
        </g>
        <g class="ladder">
          <text class="tag-s" x="${ladder.x}" y="${ladder.b - 70}">energy of the excitation</text>
          <line class="lvl" x1="${ladder.x}" x2="${ladder.x + ladder.w}" y1="${ladder.b}" y2="${ladder.b}"/><text class="tag-s" x="${ladder.x + ladder.w + 14}" y="${ladder.b + 8}">Chl b</text>
          <line class="lvl" x1="${ladder.x}" x2="${ladder.x + ladder.w}" y1="${ladder.a}" y2="${ladder.a}"/><text class="tag-s" x="${ladder.x + ladder.w + 14}" y="${ladder.a + 8}">Chl a</text>
          <line class="lvl lvl-cs" x1="${ladder.x}" x2="${ladder.x + ladder.w}" y1="${ladder.cs}" y2="${ladder.cs}"/><text class="tag-s" x="${ladder.x + ladder.w + 14}" y="${ladder.cs - 6}">charges</text><text class="tag-s" x="${ladder.x + ladder.w + 14}" y="${ladder.cs + 26}">separated</text>
          <circle class="ladder-dot" r="12"/>
        </g>
      </g>
      <g class="summary">
        <text class="big" x="800" y="300" text-anchor="middle">Antenna: energy moves.</text>
        <text class="big" x="800" y="410" text-anchor="middle">Reaction centre: an electron moves.</text>
        <text class="small" x="800" y="500" text-anchor="middle">less than a billionth of a second</text>
      </g>
    </svg>
    <div class="anim-under">
      <div class="anim-dots">${BEATS.map((b, i) => `<button type="button" data-beat="${i}" aria-label="${b.tag}"></button>`).join('')}</div>
      <p class="anim-tag"></p>
      <p class="anim-say"></p>
      <div class="anim-nav"><button type="button" data-step="-1">Back</button><button type="button" data-step="1">Next</button></div>
    </div>`;

  const q = <T extends Element>(sel: string): T => host.querySelector(sel) as T;
  const hist = q<SVGGElement>('.hist'), sceneG = q<SVGGElement>('.scene'), summary = q<SVGGElement>('.summary');
  const photon = q<SVGPathElement>('.photon'), exc = q<SVGCircleElement>('.exc'), core = q<SVGCircleElement>('.exc-core');
  const trail = q<SVGGElement>('.trail'), charges = q<SVGGElement>('.charges'), electron = q<SVGGElement>('.electron');
  const ladderG = q<SVGGElement>('.ladder'), ladderDot = q<SVGCircleElement>('.ladder-dot');
  const lamp = q<SVGGElement>('.lamp'), bubble = q<SVGCircleElement>('.bubble');
  const tag = q<HTMLParagraphElement>('.anim-tag'), say = q<HTMLParagraphElement>('.anim-say');
  const dots = Array.from(host.querySelectorAll<HTMLButtonElement>('.anim-dots button'));

  // Wavy photon from the upper left down to the first pigment.
  const photonFrom: Pt = [start[0] - 150, start[1] - 260];
  const wave = (u: number): string => {
    const pts: string[] = [];
    const dx = start[0] - photonFrom[0], dy = start[1] - photonFrom[1], len = Math.hypot(dx, dy);
    const nx = -dy / len, ny = dx / len;
    for (let i = 0; i <= 80 * u; i++) {
      const s = i / 80, w = Math.sin(s * Math.PI * 16) * 11;
      pts.push(`${i ? 'L' : 'M'}${(photonFrom[0] + dx * s + nx * w).toFixed(1)},${(photonFrom[1] + dy * s + ny * w).toFixed(1)}`);
    }
    return pts.join('');
  };

  const place = (el: SVGCircleElement, [x, y]: Pt): void => { el.setAttribute('cx', `${x}`); el.setAttribute('cy', `${y}`); };
  const ladderY = (seg: number): number => (seg <= 0 ? ladder.b : ladder.a + Math.sin(seg * 2.1) * 4);

  let beat = 0, t0 = performance.now(), raf = 0;

  function frame(now: number): void {
    const t = (now - t0) / 1000;
    hist.style.display = beat === 0 ? '' : 'none';
    sceneG.style.display = beat >= 1 && beat <= 4 ? '' : 'none';
    summary.style.display = beat === 5 ? '' : 'none';
    let hop = -1, sep = 0;
    if (beat === 0) {
      const ph = t % 1.6;
      lamp.style.opacity = ph < 0.18 ? '1' : '0.25';
      bubble.setAttribute('cy', `${460 - Math.max(0, ph - 0.25) * 120}`);
      bubble.style.opacity = ph > 0.25 ? `${1 - (ph - 0.25) / 1.35}` : '0';
    }
    const photonU = beat === 2 ? ease(t / 1.2) : beat > 2 ? 1 : 0;
    photon.setAttribute('d', beat >= 2 && beat <= 3 ? wave(photonU) : '');
    photon.style.opacity = beat === 3 ? `${Math.max(0, 1 - t / 0.6)}` : '1';
    const excited = (beat === 2 && t > 1.2) || beat === 3 || (beat === 4 && t < 0.3);
    if (beat === 3) hop = Math.min(path.length - 1, t / 0.55);
    if (beat === 4) { hop = path.length - 1; sep = ease((t - 0.3) / 0.9); }
    const pos: Pt = hop < 0 ? start : (() => {
      const i = Math.min(path.length - 2, Math.floor(hop));
      return lerp(path[i], path[i + 1], ease(hop - i));
    })();
    for (const el of [exc, core]) { place(el, pos); el.style.display = excited ? '' : 'none'; }
    if (excited) exc.setAttribute('r', `${40 + Math.sin(t * 9) * 6}`);
    trail.innerHTML = beat === 3 ? path.slice(0, Math.floor(hop) + 1).map(([x, y]) => `<circle class="visited" cx="${x}" cy="${y}" r="13"/>`).join('') : '';
    charges.style.display = beat === 4 ? '' : 'none';
    electron.setAttribute('transform', `translate(${lerp(rc, acceptor, sep).join(' ')})`);
    (charges.querySelector('.plus') as SVGTextElement).style.opacity = `${sep}`;
    ladderG.style.display = beat >= 2 && beat <= 4 ? '' : 'none';
    const ly = beat === 2 ? (t > 1.2 ? ladder.b : -100) : beat === 3 ? (hop < 1 ? ladder.b + (ladder.a - ladder.b) * ease(hop) : ladderY(hop)) : ladder.a + (ladder.cs - ladder.a) * sep;
    place(ladderDot, [ladder.x + 40 + (beat === 3 ? (hop / (path.length - 1)) * 110 : beat === 4 ? 110 + sep * 50 : 0), ly]);
    ladderDot.style.display = ly < 0 ? 'none' : '';
    raf = requestAnimationFrame(frame);
  }

  function go(i: number): void {
    beat = Math.max(0, Math.min(BEATS.length - 1, i));
    t0 = performance.now();
    tag.textContent = BEATS[beat].tag;
    say.textContent = BEATS[beat].say;
    dots.forEach((d, k) => d.setAttribute('aria-current', `${k === beat}`));
  }

  host.addEventListener('click', e => {
    const b = (e.target as Element).closest('button');
    if (!b) return;
    if (b.dataset.beat) go(Number(b.dataset.beat));
    if (b.dataset.step) go(beat + Number(b.dataset.step));
  });
  host.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight' || e.key === ' ') { go(beat + 1); e.preventDefault(); }
    if (e.key === 'ArrowLeft') { go(beat - 1); e.preventDefault(); }
  });
  go(0);
  raf = requestAnimationFrame(frame);
  return () => cancelAnimationFrame(raf);
}

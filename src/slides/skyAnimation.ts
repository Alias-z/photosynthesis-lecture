// Slide 4: yesterday's guided animation "Why is the sky blue? Why is the sunset red?", ported unchanged.
// NASA Space Place's Sun-Earth scene as one 16:9 picture. A soft spotlight walks the eye through seven
// beats; one caption at a time underneath; small step dots. Click the picture to pause.
import './skyAnimation.css';
import type { Slide } from '../slide';

type V2 = [number, number];
type V3 = [number, number, number];
interface Wave { nm: number; col: string; name: string; tau: number }
interface Beat {
  st: number; dur: number; focus: string[]; cap: string;
  mag?: boolean; skyLight?: boolean; win?: boolean; direct?: boolean; bracket?: boolean; bursts?: boolean;
}
interface Geo {
  C: V2; R: number; Ra: number; you: V2; sun: V2; sunR: number; zeta: number;
  u: V2; n: V2; L: number; tIn: number; rot: number; e: number;
}
interface Hole { x: number; y: number; rx: number; ry: number; a: number }
interface Burst { x: number; y: number; dx: number; dy: number; w: Wave; age: number }
interface SkyPacket { x0: number; y0: number; w: Wave; age: number }
interface Train { x: number; k: number; w: Wave; fate: number; stop: { x: number; at: number } | null; age: number }
interface MagArrow { x: number; y: number; dx: number; dy: number; w: Wave; age: number }

export interface SkyAnimation {
  slide: Slide;
  /** Starts or stops the animation loop when the slide is shown or hidden. */
  setActive(on: boolean): void;
  /** Re-measures the canvas after the window changes size. */
  resize(): void;
}

export function mountSkyAnimation(host: HTMLElement): SkyAnimation {
  host.classList.add('sky-anim');
  host.innerHTML = `
    <div class="wrap">
      <h1>Why is the sky blue? Why is the sunset red?</h1>
      <div class="stage"><canvas aria-label="Sunlight from the Sun reaches Earth's atmosphere. A spotlight moves through seven steps: sunlight's colours, molecules scattering blue most, scattered light reaching you, the blue sky, the long path at sunset, blue lost along the way, and the red setting Sun."></canvas></div>
      <div class="under">
        <div class="dots" aria-label="Steps"></div>
        <p class="say" aria-live="polite"></p>
      </div>
      <p class="fine">Not to scale. Wavy lines stand for light waves: blue waves are short, red waves are long. How much of each colour is scattered is computed from Rayleigh scattering and the real amount of air for each Sun angle. Click the picture to pause; arrow keys step through.</p>
    </div>`;

  // ------------------------------------------------------------------ physics
  const WAVES: Wave[] = [
    { nm: 450, col: '#3f7be0', name: 'blue', tau: 0 },
    { nm: 570, col: '#f3cf55', name: 'yellow', tau: 0 },
    { nm: 680, col: '#e2553f', name: 'red', tau: 0 },
  ];
  WAVES.forEach((w) => { w.tau = 0.0088 * Math.pow(w.nm / 1000, -4.15); });
  const TRGB: V3 = [0.046, 0.108, 0.265], TO3: V3 = [0.036, 0.026, 0.005], RE = 6371, HS = 8, TOPKM = 20;
  const airmass = (mu: number): number => { const m = Math.max(mu, 0); return 1 / (m + 0.025 * Math.exp(-11 * m)); };
  function realColumn(f: number, zetaDeg: number): number {
    const z = (zetaDeg * Math.PI) / 180, cz = Math.cos(z), sz = Math.sin(z);
    const tTop = -RE * cz + Math.sqrt(RE * RE * cz * cz + 2 * RE * TOPKM + TOPKM * TOPKM);
    const t = tTop * (1 - f), X: V2 = [t * sz, RE + t * cz], r = Math.hypot(X[0], X[1]);
    const mu = (X[0] * sz + X[1] * cz) / r, muh = -Math.sqrt(Math.max(1 - (RE / r) ** 2, 0));
    return airmass((mu - muh) / (1 - muh)) * Math.exp(-(r - RE) / HS);
  }
  const trans = (w: Wave, f: number, z: number): number => Math.exp(-w.tau * realColumn(Math.max(0, Math.min(1, f)), z));
  function skyRadiance(el: number, az: number, zeta: number): V3 {
    const s: V3 = [Math.sin(zeta), 0, Math.cos(zeta)];
    const d: V3 = [Math.cos(el) * Math.cos(az), Math.cos(el) * Math.sin(az), Math.sin(el)];
    const TOP = 80, b = RE * d[2], c = RE * RE - (RE + TOP) ** 2, tmax = -b + Math.sqrt(b * b - c);
    const cosT = d[0] * s[0] + d[1] * s[1] + d[2] * s[2], ph = 0.75 * (1 + cosT * cosT);
    const L: V3 = [0, 0, 0];
    let colV = 0, tp = 0;
    for (let i = 1; i <= 14; i++) {
      const t = tmax * (i / 14) ** 2, dt = t - tp, tm = (t + tp) / 2;
      tp = t;
      const X: V3 = [d[0] * tm, d[1] * tm, RE + d[2] * tm], r = Math.hypot(...X);
      const h = r - RE, rho = Math.exp(-h / HS), seg = (rho * dt) / HS;
      colV += seg / 2;
      const mu = (X[0] * s[0] + X[1] * s[1] + X[2] * s[2]) / r, muh = -Math.sqrt(Math.max(1 - (RE / r) ** 2, 0));
      if (mu > muh) {
        const cs = rho * airmass((mu - muh) / (1 - muh));
        const am3 = 1 / Math.sqrt(Math.max(1 - (1 - mu * mu) / 1.007, 0.006));
        for (let k = 0; k < 3; k++) L[k] += TRGB[k] * seg * Math.exp(-TRGB[k] * (colV + cs) - TO3[k] * am3) * ph;
      }
      colV += seg / 2;
    }
    return L;
  }
  function beamColour(f: number, z: number): number[] { // colour of the light still in the beam
    const col = realColumn(Math.max(0, Math.min(1, f)), z);
    const tr = TRGB.map((t) => Math.exp(-t * col)), m = Math.max(...tr);
    return tr.map((v) => Math.round(255 * Math.pow(v / m, 1 / 2.2)));
  }
  function sunColour(z: number): number[] {
    const tr = TRGB.map((t) => Math.exp(-t * airmass(Math.cos((z * Math.PI) / 180))));
    const m = Math.max(...tr);
    return tr.map((v) => Math.round(255 * Math.pow(v / m, 1 / 2.2)));
  }

  // ------------------------------------------------------------------ the seven beats
  const BEATS: Beat[] = [
    { st: 0, dur: 6.5, focus: ['sun'], cap: 'Sunlight is a mix of colours. Blue light travels as short waves, red light as long waves.' },
    { st: 0, dur: 10, focus: ['mag'], mag: true, cap: 'In the air, molecules scatter light off in all directions. The same molecules scatter 80% of the blue waves but only 20% of the red waves: short waves are scattered far more.' },
    { st: 0, dur: 6.5, focus: ['you'], skyLight: true, cap: 'That scattered light, mostly blue, reaches you from every part of the sky.' },
    { st: 0, dur: 7.5, focus: ['win', 'you'], win: true, direct: true, cap: 'So the sky looks blue. The sunlight itself crossed only a little air, so the Sun still looks white.' },
    { st: 1, dur: 8.5, focus: ['both'], bracket: true, cap: 'Hours later Earth has turned, and for you the Sun is setting. Its light now skims along the ground and crosses about 40 times more air to reach you.' },
    { st: 1, dur: 8.5, focus: ['path'], bursts: true, cap: 'Along that long path almost all the blue is scattered out of the beam, then much of the yellow.' },
    { st: 1, dur: 9, focus: ['win', 'you'], win: true, direct: true, cap: 'Mostly red light is left, so the setting Sun looks red. The blue it lost lights up the sky where it is still day.' },
  ];

  // ------------------------------------------------------------------ geometry (NASA's day and sunset frames)
  const cv = host.querySelector('canvas') as HTMLCanvasElement;
  const g = cv.getContext('2d') as CanvasRenderingContext2D;
  let W = 1, H = 1, DPR = 1;
  let back: HTMLCanvasElement | null = null;
  let shade: HTMLCanvasElement = document.createElement('canvas');
  let s = 0, beat = 0, beatT = 0, paused = false, time = 0;
  const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;
  const ease = (t: number): number => t * t * (3 - 2 * t);
  // One fixed camera for both times of day, so path lengths compare directly.
  // The Sun stays put; Earth turns and carries "you" from the sunlit side
  // (Sun 50 degrees up) to the top, where the sunlight just grazes the ground.
  let FX = { C: [0, 0] as V2, R: 1, Ra: 1, sun: [0, 0] as V2, angDay: 0, angSet: 0 };
  function fixGeometry(): void {
    const C: V2 = [0.80 * W, 1.30 * H], R = 0.95 * H, T = 0.12 * H, sun: V2 = [0.085 * W, 0.30 * H];
    const dS: V2 = [sun[0] - C[0], sun[1] - C[1]], DS = Math.hypot(dS[0], dS[1]), phiS = Math.atan2(dS[1], dS[0]);
    const al = Math.acos(R / DS);
    const a1 = phiS + al, a2 = phiS - al; // the two tangent points; take the upper one
    const angSet = Math.abs(a1 + Math.PI / 2) < Math.abs(a2 + Math.PI / 2) ? a1 : a2;
    const zen = (phi: number): number => {
      const P: V2 = [C[0] + Math.cos(phi) * R, C[1] + Math.sin(phi) * R], d: V2 = [sun[0] - P[0], sun[1] - P[1]], L = Math.hypot(d[0], d[1]);
      return (Math.acos((Math.cos(phi) * d[0] + Math.sin(phi) * d[1]) / L) * 180) / Math.PI;
    };
    let lo = phiS, hi = angSet; // find where the Sun is 40 degrees from overhead
    for (let i = 0; i < 40; i++) { const m = (lo + hi) / 2; if (zen(m) < 40) lo = m; else hi = m; }
    FX = { C, R, Ra: R + T, sun, angDay: (lo + hi) / 2, angSet };
  }
  function geoAt(sv: number): Geo {
    const e = ease(sv), { C, R, Ra, sun } = FX;
    const youAng = lerp(FX.angDay, FX.angSet, e);
    const you: V2 = [C[0] + Math.cos(youAng) * R, C[1] + Math.sin(youAng) * R];
    const sunR = H * 0.085, zeta = lerp(40, 89.5, e);
    const d: V2 = [you[0] - sun[0], you[1] - sun[1]], L = Math.hypot(d[0], d[1]), u: V2 = [d[0] / L, d[1] / L];
    const o: V2 = [sun[0] - C[0], sun[1] - C[1]], b = o[0] * u[0] + o[1] * u[1], cc = o[0] * o[0] + o[1] * o[1] - Ra * Ra;
    const tIn = -b - Math.sqrt(Math.max(b * b - cc, 0));
    return { C, R, Ra, you, sun, sunR, zeta, u, n: [-u[1], u[0]], L, tIn, rot: youAng - FX.angDay, e };
  }
  const geo = (): Geo => geoAt(s);
  const along = (G: Geo, t: number, off = 0): V2 => [G.sun[0] + G.u[0] * t + G.n[0] * off, G.sun[1] + G.u[1] * t + G.n[1] * off];

  function buildBack(): void {
    const c = document.createElement('canvas');
    c.width = cv.width; c.height = cv.height;
    const b = c.getContext('2d') as CanvasRenderingContext2D;
    b.scale(DPR, DPR);
    b.fillStyle = '#1b1d3b'; b.fillRect(0, 0, W, H);
    b.save(); b.translate(W * 0.5, H * 0.42); b.rotate(-0.30);
    const gr = b.createLinearGradient(0, -H * 0.22, 0, H * 0.22);
    gr.addColorStop(0, 'rgba(48,52,104,0)'); gr.addColorStop(0.35, 'rgba(48,52,104,0.75)');
    gr.addColorStop(0.65, 'rgba(48,52,104,0.75)'); gr.addColorStop(1, 'rgba(48,52,104,0)');
    b.fillStyle = gr; b.fillRect(-W, -H * 0.22, W * 2, H * 0.44); b.restore();
    let sd = 3;
    const r = (): number => { sd = (sd * 16807) % 2147483647; return (sd - 1) / 2147483646; };
    for (let i = 0; i < 150; i++) { b.fillStyle = `rgba(255,255,255,${0.3 + r() * 0.45})`; b.fillRect(r() * W, r() * H, 1.3, 1.3); }
    back = c;
  }

  // ------------------------------------------------------------------ drawing helpers
  interface HandOpts { alpha?: number; align?: CanvasTextAlign; color?: string }
  function hand(t: string, x: number, y: number, size: number, opts: HandOpts = {}): void {
    g.save();
    g.globalAlpha = opts.alpha ?? 1;
    g.font = `${size}px "Patrick Hand SC","Nunito",system-ui,sans-serif`;
    g.textAlign = opts.align || 'center'; g.textBaseline = 'middle';
    g.lineJoin = 'round'; g.lineWidth = size * 0.2; g.strokeStyle = 'rgba(20,22,48,0.75)'; g.strokeText(t, x, y);
    g.fillStyle = opts.color || '#ffffff'; g.fillText(t, x, y);
    g.restore();
  }
  function wavyArrow(x0: number, y0: number, dx: number, dy: number, len: number, lam: number, amp: number, col: string, alpha: number, width: number): void {
    const nx = -dy, ny = dx, n = 16;
    g.save(); g.globalAlpha = alpha; g.strokeStyle = col; g.fillStyle = col; g.lineWidth = width; g.lineCap = 'round';
    g.beginPath();
    for (let i = 0; i <= n; i++) {
      const s2 = (len * i) / n, off = amp * Math.sin((s2 / lam) * Math.PI * 2) * Math.sin((Math.PI * i) / n);
      const x = x0 + dx * s2 + nx * off, y = y0 + dy * s2 + ny * off;
      if (i) g.lineTo(x, y); else g.moveTo(x, y);
    }
    g.stroke();
    const hx = x0 + dx * len, hy = y0 + dy * len, k = width * 3.2;
    g.beginPath(); g.moveTo(hx + dx * k, hy + dy * k);
    g.lineTo(hx - dx * k * 0.4 + nx * k * 0.8, hy - dy * k * 0.4 + ny * k * 0.8);
    g.lineTo(hx - dx * k * 0.4 - nx * k * 0.8, hy - dy * k * 0.4 - ny * k * 0.8);
    g.closePath(); g.fill(); g.restore();
  }
  function curvedText(t: string, C: V2, r: number, angMid: number, size: number, alpha: number): void {
    g.save(); g.globalAlpha = alpha;
    g.font = `${size}px "Patrick Hand SC","Nunito",system-ui,sans-serif`;
    g.fillStyle = '#ffffff'; g.textAlign = 'center'; g.textBaseline = 'middle';
    const chars = [...t];
    const widths = chars.map((ch) => g.measureText(ch).width + size * 0.12);
    let a = angMid - widths.reduce((p, q) => p + q, 0) / 2 / r;
    chars.forEach((ch, i) => {
      const am = a + widths[i] / 2 / r;
      g.save(); g.translate(C[0] + Math.cos(am) * r, C[1] + Math.sin(am) * r); g.rotate(am + Math.PI / 2); g.fillText(ch, 0, 0); g.restore();
      a += widths[i] / r;
    });
    g.restore();
  }

  // ------------------------------------------------------------------ scene pieces
  const LAND: Array<Array<[number, number]>> = [ // continents in Earth-fixed polar coordinates: [angle deg (screen), radius fraction]
    [[-150, 1.01], [-146, 0.86], [-138, 0.80], [-128, 0.86], [-118, 0.80], [-110, 0.88], [-104, 1.01]],
    [[-92, 1.01], [-86, 0.86], [-76, 0.90], [-68, 0.82], [-58, 1.01]],
    [[-196, 1.01], [-186, 0.82], [-172, 0.78], [-162, 1.01]],
  ];
  function drawEarth(G: Geo): void {
    const { C, R, Ra, rot } = G;
    g.fillStyle = 'rgba(196,224,242,0.40)'; g.beginPath(); g.arc(C[0], C[1], Ra, 0, Math.PI * 2); g.fill();
    g.fillStyle = 'rgba(214,236,250,0.22)'; g.beginPath(); g.arc(C[0], C[1], R + (Ra - R) * 0.45, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#4c97d6'; g.beginPath(); g.arc(C[0], C[1], R, 0, Math.PI * 2); g.fill();
    g.save(); g.beginPath(); g.arc(C[0], C[1], R, 0, Math.PI * 2); g.clip();
    g.fillStyle = '#57a86c';
    LAND.forEach((poly) => {
      g.beginPath();
      poly.forEach(([a, f], i) => {
        const ang = (a * Math.PI) / 180 + rot;
        const x = C[0] + Math.cos(ang) * R * f, y = C[1] + Math.sin(ang) * R * f;
        if (i) g.lineTo(x, y); else g.moveTo(x, y);
      });
      g.closePath(); g.fill();
    });
    g.fillStyle = '#ffffff';
    const ia = (-40 * Math.PI) / 180 + rot;
    g.beginPath(); g.ellipse(C[0] + Math.cos(ia) * R * 0.97, C[1] + Math.sin(ia) * R * 0.97, R * 0.22, R * 0.07, ia + Math.PI / 2, 0, Math.PI * 2); g.fill();
    g.restore();
  }
  function drawSun(G: Geo): void {
    const { sun, sunR } = G;
    g.save(); g.strokeStyle = 'rgba(247,231,191,0.5)'; g.lineWidth = 2; g.lineCap = 'round';
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2, r0 = sunR * 1.25, r1 = sunR * (1.7 + 0.25 * (i % 2));
      g.beginPath(); g.moveTo(sun[0] + Math.cos(a) * r0, sun[1] + Math.sin(a) * r0); g.lineTo(sun[0] + Math.cos(a) * r1, sun[1] + Math.sin(a) * r1); g.stroke();
    }
    g.restore();
    g.fillStyle = '#f2a14a'; g.beginPath(); g.arc(sun[0], sun[1], sunR, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#f7e7bf'; g.beginPath(); g.arc(sun[0], sun[1], sunR * 0.86, 0, Math.PI * 2); g.fill();
  }
  function drawBeam(G: Geo): void {
    const { sun, sunR, u, n, L, e } = G;
    if (e < 0.999) {
      const wNear = sunR * 0.9, wFar = H * 0.40, far = L * 1.6;
      g.fillStyle = `rgba(255,255,255,${0.13 * (1 - e)})`;
      g.beginPath();
      g.moveTo(sun[0] + n[0] * wNear, sun[1] + n[1] * wNear);
      g.lineTo(sun[0] + u[0] * far + n[0] * wFar, sun[1] + u[1] * far + n[1] * wFar);
      g.lineTo(sun[0] + u[0] * far - n[0] * wFar, sun[1] + u[1] * far - n[1] * wFar);
      g.lineTo(sun[0] - n[0] * wNear, sun[1] - n[1] * wNear);
      g.closePath(); g.fill();
    }
    // the beam to you, tinted by the colour of the light that is left at each point
    const hw = H * 0.05, segs = 40;
    for (let i = 0; i < segs; i++) {
      const t0 = (L * i) / segs, t1 = (L * (i + 1)) / segs, tm = (t0 + t1) / 2;
      const f = tm < G.tIn ? 0 : (tm - G.tIn) / Math.max(L - G.tIn, 1);
      const c = tm < G.tIn ? [255, 255, 255] : beamColour(f, G.zeta);
      const a0 = along(G, t0), a1 = along(G, t1 + 0.5);
      g.fillStyle = `rgba(${c},0.2)`;
      g.beginPath();
      g.moveTo(a0[0] + n[0] * hw, a0[1] + n[1] * hw); g.lineTo(a1[0] + n[0] * hw, a1[1] + n[1] * hw);
      g.lineTo(a1[0] - n[0] * hw, a1[1] - n[1] * hw); g.lineTo(a0[0] - n[0] * hw, a0[1] - n[1] * hw);
      g.closePath(); g.fill();
    }
  }
  const OFFS = [-0.028, 0, 0.028];
  function drawBeamWaves(G: Geo): void {
    const { L, tIn, zeta, sunR } = G;
    WAVES.forEach((w, k) => {
      const lam = (H * 0.030 * w.nm) / 450, amp = H * 0.011;
      g.strokeStyle = w.col; g.lineWidth = Math.max(2, H * 0.0045); g.lineCap = 'round';
      let prev: V2 | null = null;
      for (let t = sunR * 0.9; t <= L; t += 2.5) {
        const f = t < tIn ? 0 : (t - tIn) / Math.max(L - tIn, 1);
        const a = t < tIn ? 1 : trans(w, f, zeta);
        const p = along(G, t, H * OFFS[k] + amp * Math.sin(((t - time * H * 0.18) / lam) * Math.PI * 2));
        if (prev && a > 0.02) { g.globalAlpha = Math.min(1, a * 1.05); g.beginPath(); g.moveTo(prev[0], prev[1]); g.lineTo(p[0], p[1]); g.stroke(); }
        prev = p;
      }
    });
    g.globalAlpha = 1;
  }

  // light scattered out of the beam along its path (sunset beat)
  const bursts: Burst[] = [];
  function spawnBursts(G: Geo, dt: number): void {
    WAVES.forEach((w) => {
      const lost = 1 - trans(w, 1, G.zeta), rate = dt * 10 * lost;
      for (let i = 0; i < rate; i++) {
        if (Math.random() > rate - i) continue;
        // place it where this colour is being lost along the path
        let f: number, tries = 0;
        do { f = Math.random(); tries++; } while (tries < 30 && Math.random() > (trans(w, Math.max(0, f - 0.04), G.zeta) - trans(w, f, G.zeta)) * 12);
        const t = G.tIn + f * (G.L - G.tIn), p = along(G, t, H * OFFS[WAVES.indexOf(w)]), a = Math.random() * Math.PI * 2;
        bursts.push({ x: p[0], y: p[1], dx: Math.cos(a), dy: Math.sin(a), w, age: 0 });
      }
    });
  }
  // scattered light arriving at you from all over the sky
  const skyLight: SkyPacket[] = [];
  function spawnSkyLight(G: Geo, dt: number, rate: number): void {
    if (Math.random() > dt * rate) return;
    const nx = (G.you[0] - G.C[0]) / G.R, ny = (G.you[1] - G.C[1]) / G.R;
    const a = (Math.random() - 0.5) * 2.4, ca = Math.cos(a), sa = Math.sin(a);
    const dir: V2 = [nx * ca - ny * sa, nx * sa + ny * ca], dist = H * (0.17 + Math.random() * 0.06);
    const f = lerp(0.3, 0.5, G.e), wts = WAVES.map((w) => w.tau * trans(w, f, G.zeta));
    let pick = Math.random() * wts.reduce((p, q) => p + q, 0), k = 0;
    while (k < 2 && pick > wts[k]) { pick -= wts[k]; k++; }
    skyLight.push({ x0: G.you[0] + dir[0] * dist, y0: G.you[1] + dir[1] * dist, w: WAVES[k], age: 0 });
  }

  // ------------------------------------------------------------------ magnifier: the same molecules, three colours side by side
  const LANE_Y = [-0.52, 0, 0.52], MOL_X = [-0.40, 0.04, 0.46];
  // Each molecule scatters a passing wave with a chance proportional to 1/wavelength^4
  // (blue 0.42, yellow 0.16, red 0.08). Past three molecules that makes about 8, 4 and
  // 2 in 10 waves scattered. The lanes replay one fixed cycle of 10 waves with exactly
  // those outcomes, so what you see always matches the numbers.
  // entries: index of the molecule that scatters the wave, or -1 if it passes
  const PATTERN = [
    [0, 1, 0, 2, 0, -1, 1, 0, -1, 2], // blue: 8 of 10 scattered
    [-1, 0, -1, 2, -1, 1, -1, -1, 0, -1], // yellow: 4 of 10
    [-1, -1, 1, -1, -1, -1, -1, 2, -1, -1], // red: 2 of 10
  ];
  const SCAT_OF_10 = PATTERN.map((p) => p.filter((v) => v >= 0).length);
  const mag = {
    trains: [] as Train[],
    arrows: [] as MagArrow[],
    flash: MOL_X.map(() => [0, 0, 0]),
    clock: [0, 0.37, 0.74],
    idx: [0, 3, 6],
  };
  function magGeom(G: Geo): { r: number; c: V2; tgt: V2 } {
    const r = H * 0.175, c: V2 = [W * 0.385, H * 0.195];
    const t = G.tIn + 0.4 * (G.L - G.tIn);
    return { r, c, tgt: along(G, t) };
  }
  function stepMag(dt: number): void {
    WAVES.forEach((w, k) => {
      mag.clock[k] += dt;
      if (mag.clock[k] > 1.15) {
        mag.clock[k] = 0;
        const fate = PATTERN[k][mag.idx[k]];
        mag.idx[k] = (mag.idx[k] + 1) % 10;
        mag.trains.push({ x: -1.4, k, w, fate, stop: null, age: 0 });
      }
    });
    for (let i = mag.trains.length - 1; i >= 0; i--) {
      const t = mag.trains[i];
      t.age += dt;
      if (t.stop === null) {
        t.x += 0.5 * dt;
        if (t.fate >= 0 && t.x >= MOL_X[t.fate]) {
          const j = t.fate;
          t.stop = { x: MOL_X[j], at: t.age };
          mag.flash[j][t.k] = 1;
          for (let q = 0; q < 4; q++) {
            const a = (q / 4 + 0.125) * Math.PI * 2;
            mag.arrows.push({ x: MOL_X[j], y: LANE_Y[t.k], dx: Math.cos(a), dy: Math.sin(a), w: t.w, age: 0 });
          }
        }
        if (t.stop === null && t.x > 1.45) mag.trains.splice(i, 1);
      } else if (t.age - t.stop.at > 0.9) mag.trains.splice(i, 1);
    }
    for (let i = mag.arrows.length - 1; i >= 0; i--) { mag.arrows[i].age += dt; if (mag.arrows[i].age > 1.1) mag.arrows.splice(i, 1); }
    mag.flash.forEach((row) => row.forEach((v, k) => { row[k] = Math.max(0, v - dt * 1.6); }));
  }
  function drawMag(G: Geo, A: number): void {
    if (A < 0.01) return;
    const { r, c, tgt } = magGeom(G), k0 = ease(A);
    // zoom out of the spot in the air it shows
    const cx = lerp(tgt[0], c[0], k0), cy = lerp(tgt[1], c[1], k0), rr = r * k0;
    const ang = Math.atan2(tgt[1] - cy, tgt[0] - cx);
    g.save(); g.globalAlpha = A;
    g.fillStyle = 'rgba(255,255,255,0.14)';
    g.beginPath(); g.moveTo(cx + Math.cos(ang - 1.1) * rr, cy + Math.sin(ang - 1.1) * rr);
    g.lineTo(tgt[0], tgt[1]); g.lineTo(cx + Math.cos(ang + 1.1) * rr, cy + Math.sin(ang + 1.1) * rr); g.closePath(); g.fill();
    g.strokeStyle = '#ffffff'; g.lineWidth = 2; g.beginPath(); g.arc(tgt[0], tgt[1], H * 0.02, 0, Math.PI * 2); g.stroke();
    g.beginPath(); g.arc(cx, cy, rr, 0, Math.PI * 2); g.save(); g.clip();
    g.fillStyle = '#a8d8e8'; g.fillRect(cx - rr, cy - rr, rr * 2, rr * 2);
    const lw = Math.max(2.2, H * 0.005);
    LANE_Y.forEach((ly) => { g.strokeStyle = 'rgba(255,255,255,0.5)'; g.lineWidth = 1; g.setLineDash([4, 6]); g.beginPath(); g.moveTo(cx - rr, cy + ly * rr); g.lineTo(cx + rr, cy + ly * rr); g.stroke(); g.setLineDash([]); });
    for (const t of mag.trains) {
      const lam = (rr * 0.11 * t.w.nm) / 450, amp = rr * 0.05, len = rr * 0.8, head = t.stop ? t.stop.x : t.x;
      const fade = t.stop ? Math.max(0, 1 - (t.age - t.stop.at) / 0.6) : 1;
      g.strokeStyle = t.w.col; g.lineWidth = lw; g.globalAlpha = A * fade; g.beginPath();
      for (let i = 0; i <= 40; i++) {
        const sl = (len * i) / 40, x = cx + head * rr - len + sl;
        const y = cy + LANE_Y[t.k] * rr + amp * Math.sin(((sl - t.age * rr * 0.5) / lam) * Math.PI * 2) * Math.sin((Math.PI * i) / 40) ** 0.4;
        if (i) g.lineTo(x, y); else g.moveTo(x, y);
      }
      g.stroke();
    }
    g.globalAlpha = A;
    for (const a of mag.arrows) {
      const k = Math.min(1, a.age / 0.3), fade = Math.max(0, 1 - Math.max(0, a.age - 0.6) / 0.5);
      wavyArrow(cx + (a.x + a.dx * 0.06) * rr, cy + (a.y + a.dy * 0.06) * rr, a.dx, a.dy, rr * 0.24 * k, (rr * 0.06 * a.w.nm) / 450, rr * 0.02, a.w.col, A * fade, lw * 0.85);
    }
    MOL_X.forEach((mx, j) => LANE_Y.forEach((ly, k) => {
      const x = cx + mx * rr, y = cy + ly * rr, mr = rr * 0.05, f = mag.flash[j][k];
      if (f > 0) { g.fillStyle = `rgba(255,255,255,${0.7 * f})`; g.beginPath(); g.arc(x, y, mr * 2.6, 0, Math.PI * 2); g.fill(); }
      g.fillStyle = '#16181f'; g.beginPath(); g.arc(x, y, mr, 0, Math.PI * 2); g.fill();
    }));
    g.restore();
    g.strokeStyle = '#ffffff'; g.lineWidth = Math.max(3, H * 0.007); g.beginPath(); g.arc(cx, cy, rr, 0, Math.PI * 2); g.stroke();
    if (A > 0.6) {
      hand('air molecules, magnified', cx, cy + rr + H * 0.04, H * 0.038, { alpha: A });
      hand('same molecules, three colours of light', cx, cy + rr + H * 0.085, H * 0.03, { alpha: A, color: '#d7dcf5' });
      const lx = cx + rr + H * 0.03, barMax = H * 0.12;
      hand('scattered', lx + barMax / 2 + H * 0.03, cy - rr * 0.86, H * 0.036, { alpha: A });
      WAVES.forEach((w, k) => {
        const frac = SCAT_OF_10[k] / 10, y = cy + LANE_Y[k] * rr;
        g.globalAlpha = A; g.fillStyle = 'rgba(255,255,255,0.18)'; g.fillRect(lx, y - H * 0.014, barMax, H * 0.028);
        g.fillStyle = w.col; g.fillRect(lx, y - H * 0.014, barMax * frac, H * 0.028);
        hand(`${SCAT_OF_10[k] * 10}%`, lx + barMax + H * 0.014, y, H * 0.044, { align: 'left', alpha: A });
      });
    }
    g.restore();
  }

  // ------------------------------------------------------------------ the sky window: what you see from the ground
  let skyImg: HTMLCanvasElement | null = null, skyFor = -1;
  function winGeom(): { w: number; h: number; x: number; y: number } {
    const w = W * 0.27, h = H * 0.34, x = H * 0.05, y = H - h - H * 0.06;
    return { w, h, x, y };
  }
  function buildSky(G: Geo): void {
    const n = 72, m = 48, c = document.createElement('canvas');
    c.width = n; c.height = m;
    const x = c.getContext('2d') as CanvasRenderingContext2D, im = x.createImageData(n, m);
    const z = (G.zeta * Math.PI) / 180, expo = 4.6 * (G.zeta > 80 ? 2.6 : 1);
    for (let py = 0; py < m; py++) {
      for (let px = 0; px < n; px++) {
        const L = skyRadiance(Math.max((1 - (py + 0.5) / m) * Math.PI / 2, 0.004), (((px + 0.5) / n) * 2 - 1) * 1.1, z), i = (py * n + px) * 4;
        for (let k = 0; k < 3; k++) im.data[i + k] = 255 * Math.pow(1 - Math.exp(-L[k] * expo), 1 / 2.2);
        im.data[i + 3] = 255;
      }
    }
    x.putImageData(im, 0, 0);
    skyImg = c; skyFor = G.zeta;
  }
  function drawWindow(G: Geo, A: number): void {
    if (A < 0.01) return;
    if (!skyImg || Math.abs(skyFor - G.zeta) > 0.4) buildSky(G);
    const k0 = ease(A), full = winGeom();
    const w = full.w * k0, h = full.h * k0, x = lerp(G.you[0], full.x, k0), y = lerp(G.you[1], full.y, k0), rad = H * 0.03 * k0;
    g.save(); g.globalAlpha = A;
    g.strokeStyle = 'rgba(255,255,255,0.8)'; g.lineWidth = 2; g.setLineDash([6, 6]);
    g.beginPath(); g.moveTo(x + w, y + h * 0.5); g.lineTo(G.you[0], G.you[1]); g.stroke(); g.setLineDash([]);
    g.save(); g.beginPath(); g.roundRect(x, y, w, h, rad); g.clip();
    const gy = y + h * 0.80;
    g.imageSmoothingEnabled = true; g.imageSmoothingQuality = 'high';
    if (skyImg) g.drawImage(skyImg, x, y, w, gy - y);
    const elev = 90 - G.zeta, sx = x + w * 0.5, sy = y + (gy - y) * (1 - Math.max(elev, -2) / 90), sr = h * 0.075;
    const sc = sunColour(G.zeta);
    const gr = g.createRadialGradient(sx, sy, sr * 0.6, sx, sy, sr * 3.4);
    gr.addColorStop(0, `rgba(${sc},0.55)`); gr.addColorStop(1, `rgba(${sc},0)`);
    g.fillStyle = gr; g.beginPath(); g.arc(sx, sy, sr * 3.4, 0, Math.PI * 2); g.fill();
    g.fillStyle = `rgb(${sc})`; g.beginPath(); g.arc(sx, sy, sr, 0, Math.PI * 2); g.fill();
    const lit = Math.max(0.25, Math.sin((Math.max(elev, 0) * Math.PI) / 180) * 0.9 + 0.25);
    g.fillStyle = `rgb(${Math.round(70 * lit)},${Math.round(150 * lit)},${Math.round(80 * lit)})`; g.fillRect(x, gy, w, y + h - gy);
    const tx = x + w * 0.83;
    g.fillStyle = `rgb(${Math.round(110 * lit)},${Math.round(80 * lit)},${Math.round(50 * lit)})`; g.fillRect(tx - w * 0.012, gy - h * 0.18, w * 0.024, h * 0.18);
    g.fillStyle = `rgb(${Math.round(110 * lit)},${Math.round(185 * lit)},${Math.round(90 * lit)})`;
    const crown: Array<[number, number, number]> = [[0, -0.30, 0.10], [-0.06, -0.24, 0.08], [0.06, -0.23, 0.08], [0, -0.40, 0.08]];
    crown.forEach(([dx, dy, r2]) => { g.beginPath(); g.arc(tx + dx * w, gy + dy * h, r2 * h, 0, Math.PI * 2); g.fill(); });
    g.restore();
    g.strokeStyle = '#ffffff'; g.lineWidth = Math.max(3, H * 0.007);
    g.beginPath(); g.roundRect(x, y, w, h, rad); g.stroke();
    if (A > 0.6) {
      hand('what you see, looking toward the Sun', x + w / 2, y - H * 0.035, H * 0.036, { alpha: A });
      hand('sky: scattered light', x + w * 0.05, y + h * 0.12, H * 0.032, { align: 'left', alpha: A });
      hand('Sun: direct light', sx + sr * 1.7, sy + (elev > 10 ? 0 : -h * 0.13), H * 0.032, { align: 'left', alpha: A });
    }
    g.restore();
  }

  // ------------------------------------------------------------------ spotlight: the rest of the picture steps back
  const holes: Hole[] = [{ x: 0, y: 0, rx: 1, ry: 1, a: 0 }, { x: 0, y: 0, rx: 0, ry: 0, a: 0 }];
  function focusTarget(G: Geo, key: string): Hole {
    if (key === 'sun') { const m = along(G, G.L * 0.22); return { x: m[0], y: m[1], rx: G.L * 0.3 + H * 0.12, ry: H * 0.26, a: Math.atan2(G.u[1], G.u[0]) }; }
    if (key === 'mag') { const M = magGeom(G); return { x: M.c[0] + H * 0.12, y: M.c[1], rx: M.r + H * 0.30, ry: M.r + H * 0.11, a: 0 }; }
    if (key === 'you') return { x: G.you[0], y: G.you[1] - H * 0.04, rx: H * 0.30, ry: H * 0.30, a: 0 };
    if (key === 'win') { const w = winGeom(); return { x: w.x + w.w / 2, y: w.y + w.h / 2 - H * 0.02, rx: w.w * 0.68, ry: w.h * 0.80, a: 0 }; }
    if (key === 'path') { const m = along(G, (G.tIn + G.L) / 2); return { x: m[0], y: m[1] - H * 0.03, rx: (G.L - G.tIn) / 2 + H * 0.12, ry: H * 0.22, a: Math.atan2(G.u[1], G.u[0]) }; }
    if (key === 'both') {
      const D0 = geoAt(0), q = along(D0, (D0.tIn + D0.L) / 2), m = along(G, (G.tIn + G.L) / 2);
      return { x: (q[0] + m[0]) / 2 + H * 0.02, y: (q[1] + m[1]) / 2, rx: Math.abs(m[0] - q[0]) / 2 + (G.L - G.tIn) / 2 + H * 0.08, ry: H * 0.30, a: 0 };
    }
    return { x: W / 2, y: H / 2, rx: W, ry: H, a: 0 };
  }
  function stepHoles(G: Geo, dt: number): void {
    const keys = BEATS[beat].focus, k = 1 - Math.pow(0.02, dt);
    holes.forEach((h, i) => {
      const t = keys[i] ? focusTarget(G, keys[i]) : { ...focusTarget(G, keys[0]), rx: 0, ry: 0 };
      h.x = lerp(h.x, t.x, k); h.y = lerp(h.y, t.y, k); h.rx = lerp(h.rx, t.rx, k); h.ry = lerp(h.ry, t.ry, k); h.a = lerp(h.a, t.a, k);
    });
  }
  function drawShade(): void {
    const sh = shade.getContext('2d') as CanvasRenderingContext2D;
    sh.setTransform(1, 0, 0, 1, 0, 0); sh.globalCompositeOperation = 'source-over';
    sh.clearRect(0, 0, shade.width, shade.height);
    sh.fillStyle = 'rgba(12,13,32,0.66)'; sh.fillRect(0, 0, shade.width, shade.height);
    sh.globalCompositeOperation = 'destination-out';
    holes.forEach((h) => {
      if (h.rx < 2) return;
      sh.setTransform(DPR, 0, 0, DPR, 0, 0);
      sh.translate(h.x, h.y); sh.rotate(h.a); sh.scale(h.rx, h.ry);
      const gr = sh.createRadialGradient(0, 0, 0.8, 0, 0, 1.0);
      gr.addColorStop(0, 'rgba(0,0,0,1)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
      sh.fillStyle = gr; sh.beginPath(); sh.arc(0, 0, 1.0, 0, Math.PI * 2); sh.fill();
    });
    g.setTransform(1, 0, 0, 1, 0, 0); g.drawImage(shade, 0, 0); g.setTransform(DPR, 0, 0, DPR, 0, 0);
  }

  // ------------------------------------------------------------------ frame
  let magA = 0, winA = 0;
  function draw(): void {
    const G = geo(), B = BEATS[beat];
    g.setTransform(1, 0, 0, 1, 0, 0);
    if (back) g.drawImage(back, 0, 0);
    g.setTransform(DPR, 0, 0, DPR, 0, 0);
    drawBeam(G); drawEarth(G);
    const atmA = 0.85 * (1 - G.e) * (1 - magA);
    if (atmA > 0.02) curvedText('ATMOSPHERE', G.C, G.R + (G.Ra - G.R) * 0.55, (-101 * Math.PI) / 180, H * 0.042, atmA);
    drawSun(G); drawBeamWaves(G);
    for (const b of bursts) {
      const k = Math.min(1, b.age / 0.35), fade = Math.max(0, 1 - Math.max(0, b.age - 0.8) / 0.5);
      wavyArrow(b.x + b.dx * H * 0.012, b.y + b.dy * H * 0.012, b.dx, b.dy, H * 0.06 * k, (H * 0.016 * b.w.nm) / 450, H * 0.005, b.w.col, fade, Math.max(2, H * 0.004));
    }
    for (const p of skyLight) {
      const k = Math.min(1, p.age / 0.8), fade = Math.max(0, 1 - Math.max(0, p.age - 0.8) / 0.3);
      const dx = G.you[0] - p.x0, dy = G.you[1] - p.y0, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, head = L * (0.25 + 0.65 * k), len = Math.min(head, H * 0.08);
      wavyArrow(p.x0 + ux * (head - len), p.y0 + uy * (head - len), ux, uy, len, (H * 0.017 * p.w.nm) / 450, H * 0.006, p.w.col, fade, Math.max(2.2, H * 0.0048));
    }
    g.fillStyle = '#ffffff'; g.beginPath(); g.arc(G.you[0], G.you[1], H * 0.013, 0, Math.PI * 2); g.fill();
    g.strokeStyle = '#1b1d3b'; g.lineWidth = 2; g.stroke();

    drawShade(); // everything outside the focus steps back

    // the focus of this beat, on top
    hand(B.bracket ? 'you at sunset' : 'you', G.you[0] + H * 0.045, G.you[1] + H * 0.04, H * 0.044, { align: B.bracket ? 'left' : 'center' });
    if (beat === 0) {
      hand('Sun (very far away)', G.sun[0] + G.sunR * 0.2, G.sun[1] - G.sunR * 2.25, H * 0.04);
      const t = G.L * 0.30;
      const pb = along(G, t, -H * 0.085), pr = along(G, t, H * 0.085);
      hand('blue: short waves', pb[0], pb[1], H * 0.04, { color: '#8fb4ff' });
      hand('red: long waves', pr[0], pr[1], H * 0.04, { color: '#ff9a87' });
    }
    if (B.bracket) {
      // the midday path, same scale, for comparison
      const D0 = geoAt(0), q0 = along(D0, D0.tIn), q1 = along(D0, D0.L), m0 = D0.n, o0 = -H * 0.06;
      g.save(); g.strokeStyle = 'rgba(255,255,255,0.75)'; g.lineWidth = 2; g.setLineDash([5, 5]);
      g.beginPath(); g.moveTo(D0.sun[0], D0.sun[1]); g.lineTo(q1[0], q1[1]); g.stroke(); g.setLineDash([]);
      const b0: V2 = [q0[0] + m0[0] * o0, q0[1] + m0[1] * o0], b1: V2 = [q1[0] + m0[0] * o0, q1[1] + m0[1] * o0];
      g.lineWidth = 2.5; g.beginPath(); g.moveTo(b0[0], b0[1]); g.lineTo(b1[0], b1[1]);
      [b0, b1].forEach((p) => { g.moveTo(p[0] - m0[0] * H * 0.016, p[1] - m0[1] * H * 0.016); g.lineTo(p[0] + m0[0] * H * 0.016, p[1] + m0[1] * H * 0.016); });
      g.stroke(); g.restore();
      g.fillStyle = '#ffffff'; g.beginPath(); g.arc(q1[0], q1[1], H * 0.009, 0, Math.PI * 2); g.fill();
      hand('you at midday', q1[0] - H * 0.02, q1[1] + H * 0.045, H * 0.034, { align: 'right' });
      hand('midday path', (b0[0] + b1[0]) / 2 - H * 0.02, (b0[1] + b1[1]) / 2 - H * 0.04, H * 0.034, { align: 'right' });
      // Earth turned: an arrow along the ground from the midday spot to the sunset spot
      const a0 = Math.atan2(q1[1] - G.C[1], q1[0] - G.C[0]), a1 = Math.atan2(G.you[1] - G.C[1], G.you[0] - G.C[0]), ra = G.R * 0.9;
      g.save(); g.strokeStyle = '#ffffff'; g.lineWidth = 3; g.lineCap = 'round';
      g.beginPath(); g.arc(G.C[0], G.C[1], ra, a0 + 0.02, a1 - 0.03); g.stroke();
      const ah: V2 = [G.C[0] + Math.cos(a1 - 0.03) * ra, G.C[1] + Math.sin(a1 - 0.03) * ra], tg: V2 = [-Math.sin(a1), Math.cos(a1)];
      g.fillStyle = '#ffffff'; g.beginPath();
      g.moveTo(ah[0] - tg[0] * H * 0.02, ah[1] - tg[1] * H * 0.02);
      g.lineTo(ah[0] + tg[0] * H * 0.012 + Math.cos(a1) * H * 0.016, ah[1] + tg[1] * H * 0.012 + Math.sin(a1) * H * 0.016);
      g.lineTo(ah[0] + tg[0] * H * 0.012 - Math.cos(a1) * H * 0.016, ah[1] + tg[1] * H * 0.012 - Math.sin(a1) * H * 0.016);
      g.closePath(); g.fill(); g.restore();
      const am = (a0 + a1) / 2;
      hand('Earth turns', G.C[0] + Math.cos(am) * ra * 0.93, G.C[1] + Math.sin(am) * ra * 0.93, H * 0.04);
      const off = -H * 0.09, p0 = along(G, G.tIn, off), p1 = along(G, G.L, off), n = G.n;
      g.save(); g.strokeStyle = '#ffffff'; g.lineWidth = 2.5; g.beginPath(); g.moveTo(p0[0], p0[1]); g.lineTo(p1[0], p1[1]);
      [p0, p1].forEach((p) => { g.moveTo(p[0] - n[0] * H * 0.018, p[1] - n[1] * H * 0.018); g.lineTo(p[0] + n[0] * H * 0.018, p[1] + n[1] * H * 0.018); });
      g.stroke(); g.restore();
      hand('sunset path: about 40x more air (not to scale)', (p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2 - H * 0.045, H * 0.04);
    }
    if (B.bursts) {
      const p = along(G, G.tIn + (G.L - G.tIn) * 0.45, -H * 0.12);
      hand('blue is scattered out first', p[0], p[1], H * 0.042, { color: '#8fb4ff' });
    }
    if (beat === 2) hand('scattered light comes from all directions', G.you[0] - H * 0.02, G.you[1] - H * 0.33, H * 0.04, { align: 'center' });
    if (B.direct) {
      const sc = sunColour(G.zeta), label = G.e < 0.5 ? 'Sun looks white' : 'Sun looks orange-red', fs = H * 0.038;
      g.save(); g.font = `${fs}px "Patrick Hand SC","Nunito",system-ui,sans-serif`; const tw = g.measureText(label).width; g.restore();
      const tx = Math.min(G.you[0] + H * 0.09, W - H * 0.03 - tw), ty = G.you[1] + H * 0.11;
      g.fillStyle = `rgb(${sc})`; g.beginPath(); g.arc(tx - H * 0.03, ty, H * 0.018, 0, Math.PI * 2); g.fill();
      hand(label, tx, ty, fs, { align: 'left' });
    }
    drawMag(G, magA);
    drawWindow(G, winA);
    if (paused) hand('paused', W - H * 0.05, H - H * 0.05, H * 0.04, { align: 'right' });
  }
  function step(dt: number): void {
    const B = BEATS[beat], G = geo();
    time += dt;
    // advance the story
    beatT += dt;
    if (beatT > B.dur) goBeat((beat + 1) % BEATS.length);
    const tgtS = BEATS[beat].st;
    if (s !== tgtS) s = tgtS > s ? Math.min(tgtS, s + dt / 1.8) : Math.max(tgtS, s - dt / 1.8);
    magA = lerp(magA, B.mag ? 1 : 0, 1 - Math.pow(0.01, dt));
    winA = lerp(winA, B.win ? 1 : 0, 1 - Math.pow(0.01, dt));
    if (B.bursts) spawnBursts(G, dt);
    for (let i = bursts.length - 1; i >= 0; i--) { bursts[i].age += dt; if (bursts[i].age > 1.3) bursts.splice(i, 1); }
    if (B.skyLight || (B.win && G.e < 0.5)) spawnSkyLight(G, dt, B.skyLight ? 14 : 3);
    for (let i = skyLight.length - 1; i >= 0; i--) { skyLight[i].age += dt; if (skyLight[i].age > 1.1) skyLight.splice(i, 1); }
    stepMag(dt);
    stepHoles(G, dt);
  }

  // ------------------------------------------------------------------ steps UI
  const dotsEl = host.querySelector('.dots') as HTMLElement, say = host.querySelector('.say') as HTMLElement;
  const dotBtns = BEATS.map((_, i) => {
    const d = document.createElement('button');
    d.type = 'button';
    d.setAttribute('aria-label', `Step ${i + 1}`);
    d.innerHTML = '<i></i>';
    d.addEventListener('click', () => goBeat(i));
    dotsEl.appendChild(d);
    return d;
  });
  function goBeat(i: number): void {
    beat = i; beatT = 0;
    say.textContent = BEATS[i].cap;
    dotBtns.forEach((d, j) => d.setAttribute('aria-current', j === i ? 'true' : 'false'));
    if (BEATS[i].bursts) bursts.length = 0;
  }
  function updateDots(): void {
    dotBtns.forEach((d, j) => {
      const bar = d.firstChild as HTMLElement;
      bar.style.transform = `scaleX(${j < beat ? 1 : j === beat ? Math.min(1, beatT / BEATS[beat].dur) : 0})`;
    });
  }
  cv.addEventListener('click', () => { paused = !paused; });

  function fit(): void {
    const r = cv.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return;
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    // draw at the on-screen size (the slide is scaled), but lay out in the canvas's own pixels
    W = cv.clientWidth; H = cv.clientHeight;
    const scale = r.width / W;
    DPR *= scale;
    cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
    shade = document.createElement('canvas'); shade.width = cv.width; shade.height = cv.height;
    buildBack(); skyImg = null; fixGeometry();
    const G = geo(), keys = BEATS[beat].focus, t0 = focusTarget(G, keys[0]);
    Object.assign(holes[0], t0);
    Object.assign(holes[1], keys[1] ? focusTarget(G, keys[1]) : { ...t0, rx: 0, ry: 0 });
  }
  let last = performance.now(), raf = 0, active = false, ready = false;
  function tick(now: number): void {
    const dt = Math.min(0.1, (now - last) / 1000);
    last = now;
    if (!paused) step(dt);
    draw(); updateDots();
    raf = active ? requestAnimationFrame(tick) : 0;
  }
  function start(): void {
    if (!ready || !active || raf) return;
    last = performance.now();
    raf = requestAnimationFrame(tick);
  }

  const fontsLoaded = Promise.all([document.fonts.load('40px "Patrick Hand SC"'), document.fonts.ready]).catch(() => undefined);
  fontsLoaded.then(() => {
    goBeat(0);
    s = BEATS[beat].st;
    magA = BEATS[beat].mag ? 1 : 0; winA = BEATS[beat].win ? 1 : 0;
    fit();
    new ResizeObserver(fit).observe(cv);
    for (let i = 0; i < 60; i++) { const sv = beatT; step(1 / 30); beatT = sv; }
    for (let i = 0; i < 150; i++) stepMag(1 / 30); // the magnifier is already running when you get there
    ready = true;
    start();
  });

  // In the deck, the arrow keys step through the seven beats; past the first or last beat they move to the
  // previous or next slide. Space pauses, as before.
  const slide: Slide = {
    title: 'Blue sky, red sunset (animation)',
    kind: 'sky',
    onKey(e) {
      if (e.code === 'Space') { paused = !paused; return true; }
      if (e.key === 'ArrowRight' && beat < BEATS.length - 1) { goBeat(beat + 1); return true; }
      if (e.key === 'ArrowLeft' && beat > 0) { goBeat(beat - 1); return true; }
      return false;
    },
  };

  return {
    slide,
    setActive(on) {
      active = on;
      if (on) { fit(); start(); }
      else if (raf) { cancelAnimationFrame(raf); raf = 0; }
    },
    resize() { if (active) fit(); },
  };
}

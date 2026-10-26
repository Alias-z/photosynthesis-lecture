// Slide 3: a live scattering demo. Light packets cross magnified air; blue scatters most.
import { H, INK, INKS, W, circ, grain, mulberry, paper, plex, rgba, serifI, txt, type Ctx, type RGB } from '../lib/canvas';
import { enc, lin } from '../lib/colour';
import { inkSun } from '../lib/ink';
import type { Slide } from '../slide';

type Mode = 'noon' | 'sunset';
interface Molecule { x: number; y: number; a: number; ph: number; set: 0 | 1 | 2; hot: number }
interface Packet { x: number; y: number; dx: number; dy: number; b: number; s: boolean; d: number }
interface Flash { x: number; y: number; b: number; u: number }

const SIM = { x0: 360, x1: 1220, y0: 240, y1: 760, cy: 500, band: 46, v: 300, R: 13 };
const BANDS = [{ nm: 450, tau: 0.8 }, { nm: 550, tau: 0.36 }, { nm: 650, tau: 0.18 }];
const LIGHT: RGB[] = [[35, 80, 230], [42, 150, 58], [222, 54, 30]];
const BL = ([[59, 108, 255], [108, 240, 90], [255, 74, 46]] as RGB[]).map((c) => c.map(lin));
const CAP: Record<Mode, string> = {
  noon: 'Midday: a short path through air. Blue scatters sideways most, so the sky is blue and the Sun looks white.',
  sunset: 'Sunset: a much longer path. Blue and green scatter away, so the light that reaches you is orange-red.',
};

const sim = {
  mols: [] as Molecule[],
  pk: [] as Packet[],
  fl: [] as Flash[],
  fs: [0, 0, 0],
  mode: 'noon' as Mode,
  mm: 0,
  spawn: 0,
  rng: mulberry(5),
  paused: false,
  t: 0,
};

(function makeMolecules() {
  const r = mulberry(21);
  for (const set of [0, 1] as const) {
    for (let i = 0; i < 34; i++) {
      const x = SIM.x0 + 30 + ((i + (set ? 0.5 : 0) + (r() - 0.5) * 0.6) * (SIM.x1 - SIM.x0 - 60)) / 34;
      sim.mols.push({ x, y: SIM.cy - SIM.band + r() * 2 * SIM.band, a: r() * Math.PI, ph: r() * 6.28, set, hot: 0 });
    }
  }
  const rows: Array<[number, number]> = [[SIM.y0 + 70, SIM.cy - SIM.band - 16], [SIM.cy + SIM.band + 16, SIM.y1 - 34]];
  for (const [ya, yb] of rows) {
    for (let i = 0; i < 12; i++) {
      for (let j = 0; j < 3; j++) {
        sim.mols.push({
          x: SIM.x0 + 40 + ((i + 0.2 + r() * 0.6) * (SIM.x1 - SIM.x0 - 80)) / 12,
          y: ya + ((j + 0.2 + r() * 0.6) * (yb - ya)) / 3,
          a: r() * Math.PI, ph: r() * 6.28, set: 2, hot: 0,
        });
      }
    }
  }
})();

/** Share of each colour scattered along the path (the physics, not a live count). */
const expected = (b: number, mode: Mode): number => 1 - Math.exp(-BANDS[b].tau * (mode === 'sunset' ? 6 : 1));
/** Chance that one molecule scatters a passing packet; a packet meets about 0.22 molecules per molecule placed. */
function pFor(b: number): number {
  const n = sim.mode === 'sunset' ? 68 : 34;
  return 1 - Math.exp((-BANDS[b].tau * (sim.mode === 'sunset' ? 6 : 1)) / (n * 0.22));
}
function scatterDir(r: () => number): [number, number] {
  for (;;) {
    const th = r() * Math.PI * 2;
    const cs = Math.cos(th);
    if (Math.abs(cs) > 0.88) continue; // near-forward and near-backward look like the beam itself
    if (r() * 2 <= 1 + cs * cs) return [cs, Math.sin(th)]; // Rayleigh phase function
  }
}

function step(dt: number): void {
  const r = sim.rng;
  sim.mm += ((sim.mode === 'sunset' ? 1 : 0) - sim.mm) * Math.min(1, dt * 4);
  sim.spawn += dt * 22;
  while (sim.spawn >= 1) {
    sim.spawn--;
    sim.pk.push({ x: 178, y: SIM.cy + (r() * 2 - 1) * SIM.band, dx: 1, dy: 0, b: (r() * 3) | 0, s: false, d: 0 });
  }
  for (let b = 0; b < 3; b++) sim.fs[b] += (expected(b, sim.mode) - sim.fs[b]) * Math.min(1, dt * 1.6);
  const P = [pFor(0), pFor(1), pFor(2)];
  const sunset = sim.mode === 'sunset';
  for (const p of sim.pk) {
    const mv = SIM.v * dt;
    const px = p.x;
    p.x += p.dx * mv;
    p.y += p.dy * mv;
    if (p.s) { p.d += mv; continue; }
    if (p.x > SIM.x0 && px < SIM.x1) {
      for (const m of sim.mols) {
        if (m.set === 2 || (m.set === 1 && !sunset)) continue;
        if (m.x > px && m.x <= p.x && Math.abs(m.y - p.y) < SIM.R) {
          if (r() < P[p.b]) {
            const d = scatterDir(r);
            p.dx = d[0]; p.dy = d[1]; p.s = true; p.x = m.x; p.y = m.y;
            m.hot = 1;
            sim.fl.push({ x: m.x, y: m.y, b: p.b, u: 0 });
          }
          break;
        }
      }
    }
  }
  sim.pk = sim.pk.filter((p) => p.x > -80 && p.x < (p.s ? W + 80 : 1392) && p.y > -80 && p.y < H + 80 && p.d < 380);
  for (const f of sim.fl) f.u += dt / 0.5;
  sim.fl = sim.fl.filter((f) => f.u < 1);
  for (const m of sim.mols) m.hot = Math.max(0, m.hot - dt * 2.5);
}

function mixColor(w: readonly number[]): RGB {
  let R = 0, G = 0, B = 0;
  for (let i = 0; i < 3; i++) { R += w[i] * BL[i][0]; G += w[i] * BL[i][1]; B += w[i] * BL[i][2]; }
  const m = Math.max(R, G, B, 1e-6);
  return [enc(R / m), enc(G / m), enc(B / m)];
}

function lab2(c: Ctx, x: number, y: number, a: string, b: string): void {
  txt(c, a, x, y + 8, serifI(36), INK, 'center');
  txt(c, b, x, y + 44, plex(400, 30), INKS, 'center');
}

function molecule(c: Ctx, m: Molecule, t: number, a: number): void {
  const x = m.x + 1.3 * Math.sin(t * 2 + m.ph);
  const y = m.y + 1.3 * Math.cos(t * 1.7 + m.ph);
  const an = m.a + 0.18 * Math.sin(t * 0.8 + m.ph);
  const dx = Math.cos(an) * 8, dy = Math.sin(an) * 8;
  c.globalAlpha = a;
  c.strokeStyle = INK;
  c.lineWidth = 1.8;
  c.beginPath();
  c.moveTo(x - dx, y - dy);
  c.lineTo(x + dx, y + dy);
  c.stroke();
  c.fillStyle = m.hot > 0 ? '#fffbe6' : '#f7f8f4';
  for (const s of [-1, 1]) { circ(c, x + s * dx, y + s * dy, 7.2); c.fill(); c.stroke(); }
  c.globalAlpha = 1;
}

function packet(c: Ctx, p: Packet): void {
  let a = p.s ? Math.max(0, 1 - p.d / 380) : 1;
  if (p.x < 210) a *= Math.max(0, (p.x - 178) / 32);
  if (!p.s && p.x > 1300) a *= Math.max(0, (1392 - p.x) / 92);
  if (a <= 0.01) return;
  const lam = BANDS[p.b].nm * 0.065, L = 50, A = 4.8;
  c.save();
  c.translate(p.x, p.y);
  c.rotate(Math.atan2(p.dy, p.dx));
  c.beginPath();
  for (let i = 0; i <= 14; i++) {
    const x = -L + (L * i) / 14;
    const y = A * Math.sin((Math.PI * i) / 14) * Math.sin((2 * Math.PI * x) / lam);
    if (i) c.lineTo(x, y); else c.moveTo(x, y);
  }
  c.lineCap = 'round';
  c.lineJoin = 'round';
  c.strokeStyle = rgba(LIGHT[p.b], 0.95 * a);
  c.lineWidth = 3.2;
  c.stroke();
  c.restore();
}

// fill the beam before the slide is first shown
for (let b = 0; b < 3; b++) sim.fs[b] = expected(b, sim.mode);
for (let i = 0; i < 360; i++) step(1 / 60);

export const scatteringSlide: Slide = {
  title: 'Air scatters blue light most',
  kind: 'canvas',
  update(dt) {
    if (sim.paused) return;
    step(dt);
    sim.t += dt;
  },
  drawStatic(c) {
    paper(c);
    const { x0, x1, y0, y1 } = SIM;
    c.strokeStyle = INK;
    c.lineWidth = 1.3;
    c.strokeRect(x0, y0, x1 - x0, y1 - y0);
    c.lineWidth = 1.6;
    const corners: Array<[number, number, number, number]> = [[x0, y0, 1, 1], [x1, y0, -1, 1], [x0, y1, 1, -1], [x1, y1, -1, -1]];
    for (const [x, y, sx, sy] of corners) {
      c.beginPath();
      c.moveTo(x - sx * 14, y);
      c.lineTo(x + sx * 18, y);
      c.moveTo(x, y - sy * 14);
      c.lineTo(x, y + sy * 18);
      c.stroke();
    }
    txt(c, 'Air molecules, greatly magnified', x0 + 24, y0 + 46, serifI(34), INK);
    inkSun(c, 140, SIM.cy, 30);
    txt(c, 'Sunlight', 140, SIM.cy + 104, serifI(36), INK, 'center');
    txt(c, 'all colours', 140, SIM.cy + 140, plex(400, 30), INKS, 'center');
    lab2(c, 1430, 370, 'Scattered sideways', 'the sky’s colour');
    lab2(c, 1430, 590, 'Gets through', 'the Sun’s colour');
  },
  drawFrame(c) {
    const t = sim.t;
    const scol = mixColor(sim.fs);
    const tcol = mixColor(sim.fs.map((f) => 1 - f));
    const amt = Math.min(1, (sim.fs[0] + sim.fs[1] + sim.fs[2]) / 2);
    const { x0, x1, y0, y1 } = SIM;
    c.fillStyle = rgba(scol, 0.18 * amt);
    c.fillRect(x0, y0, x1 - x0, y1 - y0);
    for (const m of sim.mols) {
      const a = m.set === 1 ? sim.mm : 1;
      if (a > 0.02) molecule(c, m, t, a);
    }
    for (const f of sim.fl) {
      c.strokeStyle = rgba(LIGHT[f.b], 0.85 * (1 - f.u));
      c.lineWidth = 1.8;
      circ(c, f.x, f.y, 9 + 22 * f.u);
      c.stroke();
    }
    for (const p of sim.pk) packet(c, p);
    c.fillStyle = rgba(scol);
    c.fillRect(1340, 240, 180, 96);
    c.fillStyle = grain(c);
    c.fillRect(1340, 240, 180, 96);
    c.strokeStyle = INK;
    c.lineWidth = 1.5;
    c.strokeRect(1340, 240, 180, 96);
    c.fillStyle = rgba(tcol);
    circ(c, 1430, SIM.cy, 46);
    c.fill();
    c.strokeStyle = INK;
    c.lineWidth = 1.6;
    c.stroke();
  },
  overlay: () => `
    <h2 class="h2" style="left:92px;top:48px;width:960px">Air scatters blue light most</h2>
    <div class="seg hit" style="right:96px;top:56px" role="group" aria-label="Animation controls">
      <button id="m-noon" type="button" data-mode="noon" aria-pressed="${sim.mode === 'noon'}">Midday</button>
      <button id="m-sunset" type="button" data-mode="sunset" aria-pressed="${sim.mode === 'sunset'}">Sunset</button>
      <button id="m-pause" type="button" data-act="pause" aria-pressed="${sim.paused}">${sim.paused ? 'Play' : 'Pause'}</button>
    </div>
    <p class="cap" style="left:96px;top:778px;width:1230px">${CAP[sim.mode]}</p>`,
  onButton(btn) {
    if (btn.dataset.mode === 'noon' || btn.dataset.mode === 'sunset') sim.mode = btn.dataset.mode;
    else if (btn.dataset.act === 'pause') sim.paused = !sim.paused;
  },
};

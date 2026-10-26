// Layout check for every figure variant: overlapping labels, labels outside the drawing, and page text
// columns that run into the sources line. Open /qa.html; the report is printed into the page as JSON.
import './pilot.css';
import { installPapers } from './papers';
import { PAGES } from './plates';

installPapers(document.documentElement);
const out = document.getElementById('qa') as HTMLElement;
const host = document.createElement('div');
host.className = 'plate theme-editorial lay-figure paper-bristol';
host.style.cssText = 'position:absolute;left:0;top:0;width:1600px;height:900px';
document.body.appendChild(host);

type Box = { x: number; y: number; w: number; h: number; s: string };
const overlap = (a: Box, b: Box): number => {
  const w = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
  const h = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
  return w > 0 && h > 0 ? (w * h) / Math.min(a.w * a.h, b.w * b.h) : 0;
};

// Load the faces before measuring; the loop below never yields, so fonts would otherwise stay unloaded.
await Promise.all(['400 20px Inter', '500 20px Inter', '600 20px Inter', '700 20px Inter', '400 20px Newsreader', '500 20px Newsreader', 'italic 400 20px Newsreader'].map(f => document.fonts.load(f)));
const report: Record<string, unknown>[] = [];
for (const pg of PAGES) {
  for (const v of pg.variants) {
    host.innerHTML = pg.html(v.id);
    const svg = host.querySelector('.fig svg, .lead-fig svg') as SVGSVGElement | null;
    const issues: string[] = [];
    if (svg) {
      const vb = svg.viewBox.baseVal;
      const boxes: Box[] = [...svg.querySelectorAll('text')]
        .filter(t => (t.textContent ?? '').trim() && getComputedStyle(t).display !== 'none')
        .map(t => {
          // On-screen box mapped back to figure units, so rotated and transformed labels are measured as drawn.
          const r = t.getBoundingClientRect();
          const m = (svg.getScreenCTM() as DOMMatrix).inverse();
          const a = new DOMPoint(r.left, r.top).matrixTransform(m), c = new DOMPoint(r.right, r.bottom).matrixTransform(m);
          return { x: a.x, y: a.y, w: c.x - a.x, h: c.y - a.y, s: (t.textContent ?? '').trim().slice(0, 28) };
        })
        .filter(b => b.w > 0 && b.h > 0);
      for (const b of boxes) {
        if (b.x < vb.x - 2 || b.y < vb.y - 2 || b.x + b.w > vb.x + vb.width + 2 || b.y + b.h > vb.y + vb.height + 2) issues.push(`outside: "${b.s}"`);
      }
      for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) {
        if (overlap(boxes[i], boxes[j]) > 0.25) issues.push(`overlap: "${boxes[i].s}" × "${boxes[j].s}"`);
      }
    } else issues.push('no svg');
    if (pg.kind === 'study' && v === pg.variants[0]) {
      const pts = host.querySelector('.p-points')?.getBoundingClientRect();
      const src = host.querySelector('.p-src')?.getBoundingClientRect();
      if (pts && src && pts.bottom > src.top - 4) issues.push(`text column ends at ${Math.round(pts.bottom)} past sources at ${Math.round(src.top)}`);
      const title = host.querySelector('.p-title') as HTMLElement | null;
      if (title && title.scrollWidth > 1412) issues.push(`title too wide (${title.scrollWidth}px)`);
    }
    if (issues.length) report.push({ slide: pg.key, v: v.id, name: v.name, issues });
  }
}
out.textContent = JSON.stringify({ variants: PAGES.reduce((n, pg) => n + pg.variants.length, 0), flagged: report.length, report }, null, 1);

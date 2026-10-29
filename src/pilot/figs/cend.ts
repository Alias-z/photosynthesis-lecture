// The last slide (lecture day, 30 Oct 2026; lecturer: "one more slide at the end to show my GitHub repo and the web
// address where we will host this"). One wide figure, no reading column: the 2 addresses, big.
import type { PlateText, Variant } from '../types';

/** The repository (git remote origin) and the address the deck is served from (the lecturer's domain, via a Cloudflare tunnel). */
export const REPO = 'https://github.com/Alias-z/photosynthesis-lecture';
export const SITE = 'https://photosynthesis-lecture.hongyuanzhang.com/pilot.html';

export const PLATE: PlateText = {
  n: 'END',
  title: 'The slides and their code',
  status: 'draft',
  lead: 'The slides, their animations and their code are open.',
  points: [],
  refs: [
    { label: 'GitHub: Alias-z/photosynthesis-lecture', url: REPO },
  ],
};

export const VARIANTS: Variant[] = [{ id: 'a', name: 'The 2 addresses', wide: true }];

const T = (x: number, y: number, s: string, size: number, fill: string, weight = 400, a: 'start' | 'middle' | 'end' = 'start'): string =>
  `<text x="${x}" y="${y}" text-anchor="${a}" style="font-size:${size}px;font-weight:${weight};fill:${fill}">${s}</text>`;

/** A card: what it is, the address as a link, a one-line note. */
function card(y: number, what: string, url: string, show: string, note: string): string {
  return `<rect x="70" y="${y}" width="1200" height="190" rx="22" style="fill:#fffdf8;stroke:#d9d4c6;stroke-width:1.5"/>
    ${T(120, y + 62, what, 30, '#9a4426', 700)}
    <a href="${url}" target="_blank" rel="noopener">${T(120, y + 122, show, 46, '#1f5f9e', 600)}</a>
    ${T(120, y + 164, note, 22, '#6b6a64')}`;
}

export function draw(_id: string): string {
  return `<svg class="fig-svg" viewBox="0 0 1340 590" role="img" aria-label="The slides online at ${SITE.replace('https://', '')} and their code on GitHub at ${REPO.replace('https://', '')}">
    ${card(40, 'The slides online', SITE, SITE.replace('https://', '').replace(/\/$/, ''), 'every slide and animation, in the browser')}
    ${card(300, 'The code', REPO, REPO.replace('https://', ''), 'figures, animations and their sources, open on GitHub')}
  </svg>`;
}

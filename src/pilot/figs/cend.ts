// The last slide (lecture day, 30 Oct 2026; lecturer: "one more slide at the end to show my GitHub repo and the web
// address where we will host this"; then: "change the last slide into a questions slide, but still put the website
// link and the GitHub link there"; then: "it can be a meme too. Like famous meme. Or Pingu. Show me more variants").
// One wide figure, no reading column, no page title: the figure says "Questions?". Only the picture on the left changes.
//
// Pictures (src/assets/photos/end-*.jpg; downloaded, cropped with sips, never stretched on the page):
// a        cottonbro studio, "Man in White Crew Neck Shirt Wearing Black Framed Eyeglasses", Pexels licence (free to use
//          and modify, no attribution required; credited anyway),
//          https://www.pexels.com/photo/man-in-white-crew-neck-shirt-wearing-black-framed-eyeglasses-5960674/
//          (1800 × 2000 crop from the top 120 px of the 1800 × 2700 download, scaled to 1440 × 1600).
// pingu    an original clay-style penguin drawn here in SVG (no free photo of a real Pingu figure on Wikimedia Commons:
//          the "Pingu" files there are other penguins, a plush of another penguin, or people in costume).
// grumpy   Gage Skidmore, "Grumpy Cat by Gage Skidmore" (VidCon 2014), CC BY-SA 3.0, cropped to 700 × 870,
//          https://commons.wikimedia.org/wiki/File:Grumpy_Cat_by_Gage_Skidmore.jpg
// dog      Jusper Mwangi, "Close-up Photo of a Dog", Pexels licence, https://www.pexels.com/photo/close-up-photo-of-a-dog-4966656/
//          (1600 × 1988 crop, scaled to 1287 × 1600).
// owl      Landiva Weber, "Head of Owl" (burrowing owl), Pexels licence, https://www.pexels.com/photo/head-of-owl-16732816/
//          (1075 × 1336 crop of the 2000 × 1336 download).
// einstein Ferdinand Schmutzer, Albert Einstein 1921 (restoration by Adam Cuerden), public domain,
//          https://commons.wikimedia.org/wiki/File:Einstein_1921_by_F_Schmutzer_-_restoration.jpg (1300 × 1615 crop of
//          the 1920 px rendition, scaled to 1288 × 1600).
import type { PlateText, Variant } from '../types';
import endJpg from '../../assets/photos/end-questions.jpg';
import grumpyJpg from '../../assets/photos/end-grumpy.jpg';
import dogJpg from '../../assets/photos/end-dog.jpg';
import owlJpg from '../../assets/photos/end-owl.jpg';
import einsteinJpg from '../../assets/photos/end-einstein.jpg';

/** The repository (git remote origin) and the address the deck is served from (the lecturer's domain, via a Cloudflare tunnel). */
export const REPO = 'https://github.com/Alias-z/photosynthesis-lecture';
export const SITE = 'https://photosynthesis-lecture.hongyuanzhang.com/';

export const PLATE: PlateText = {
  n: 'END',
  title: 'Questions?',
  status: 'draft',
  lead: 'The slides, their animations and their code are open.',
  points: [],
  // no citation line at the end (lecturer, lecture day)
  refs: [],
};

export const VARIANTS: Variant[] = [
  { id: 'a', name: 'Questions? with the 2 addresses', wide: true, noTitle: true },
  { id: 'pingu', name: 'Questions? A clay penguin: "Noot noot?"', wide: true, noTitle: true },
  { id: 'grumpy', name: 'Questions? Grumpy Cat', wide: true, noTitle: true },
  { id: 'dog', name: 'Questions? A dog tilting its head', wide: true, noTitle: true },
  { id: 'owl', name: 'Questions? A burrowing owl, one brow raised', wide: true, noTitle: true },
  { id: 'einstein', name: 'Questions? Einstein, 1921', wide: true, noTitle: true },
];

const T = (x: number, y: number, s: string, size: number, fill: string, weight = 400, a: 'start' | 'middle' | 'end' = 'start', cls = ''): string =>
  `<text${cls ? ` class="${cls}"` : ''} x="${x}" y="${y}" text-anchor="${a}" style="font-size:${size}px;font-weight:${weight};fill:${fill}">${s}</text>`;

// Widths measured in headless Chrome with the deck's fonts (Newsreader 400, Inter 600/700/400): "Questions?" at 136 px
// is 675 wide; the 2 addresses at 30 px are 656 and 628; the labels at 26 px 214 and 444; the notes at 21 px ≤ 385;
// the credits at 14 px ≤ 430. The text column starts at x = 624, so the widest line ends at 1299 < 1340.
const X0 = 624;
/** The picture panel: the left 560 × 696 of the 1340 × 696 page (wide, no-title layout). */
const PW = 560, PH = 696;

/** One address: what it is, the address as a link (plain grey text, underlined; lecturer, lecture day: "not blue"), a one-line note. */
function link(y: number, what: string, url: string, show: string, note: string): string {
  return `${T(X0, y, what, 26, '#9a4426', 700)}
    <a href="${url}" target="_blank" rel="noopener">${T(X0, y + 46, show, 30, '#6b6a64').replace('fill:#6b6a64', 'fill:#6b6a64;text-decoration:underline')}</a>
    ${T(X0, y + 80, note, 21, '#6b6a64')}`;
}

const frame = `<rect x="0" y="0" width="${PW}" height="${PH}" rx="18" style="fill:none;stroke:#d9d4c6;stroke-width:1.5"/>`;

/** A photo filling the panel: cropped by the clip (slice), never stretched. */
const photo = (id: string, href: string, align = 'xMidYMid'): string =>
  `<clipPath id="cend-clip-${id}"><rect x="0" y="0" width="${PW}" height="${PH}" rx="18"/></clipPath>
    <g clip-path="url(#cend-clip-${id})"><image href="${href}" x="0" y="0" width="${PW}" height="${PH}" preserveAspectRatio="${align} slice"/></g>${frame}`;

/** An original clay-style penguin (round black body, white belly, orange beak wide open, flippers raised) with a
 *  "Noot noot?" bubble; drawn here, not traced from the Pingu character sheet. */
const pingu = (): string => `<defs>
    <linearGradient id="cend-ice" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#dfeaf1"/><stop offset="1" stop-color="#f6f9fb"/></linearGradient>
    <radialGradient id="cend-clay" cx=".38" cy=".3" r=".75"><stop offset="0" stop-color="#4a4a52"/><stop offset=".55" stop-color="#25252b"/><stop offset="1" stop-color="#111114"/></radialGradient>
    <radialGradient id="cend-belly" cx=".42" cy=".35" r=".7"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#e6e1d4"/></radialGradient>
    <radialGradient id="cend-beak" cx=".4" cy=".3" r=".8"><stop offset="0" stop-color="#ffb04a"/><stop offset="1" stop-color="#e0701a"/></radialGradient>
    <clipPath id="cend-clip-pingu"><rect x="0" y="0" width="${PW}" height="${PH}" rx="18"/></clipPath>
  </defs>
  <g clip-path="url(#cend-clip-pingu)">
    <rect x="0" y="0" width="${PW}" height="${PH}" style="fill:url(#cend-ice)"/>
    <ellipse cx="280" cy="672" rx="330" ry="70" style="fill:#ffffff"/>
    <ellipse cx="280" cy="664" rx="150" ry="16" style="fill:#c9d6de;opacity:.7"/>
    <!-- flippers raised -->
    <path d="M150,430 C96,400 62,330 70,262 C96,282 150,340 178,392 Z" style="fill:url(#cend-clay)"/>
    <path d="M410,430 C464,400 498,330 490,262 C464,282 410,340 382,392 Z" style="fill:url(#cend-clay)"/>
    <!-- body and head: one pear of clay -->
    <path d="M280,178 C356,178 404,236 400,312 C398,352 384,378 400,418 C432,498 432,610 280,654 C128,610 128,498 160,418 C176,378 162,352 160,312 C156,236 204,178 280,178 Z" style="fill:url(#cend-clay)"/>
    <ellipse cx="280" cy="520" rx="104" ry="126" style="fill:url(#cend-belly)"/>
    <!-- feet -->
    <ellipse cx="226" cy="656" rx="52" ry="17" style="fill:url(#cend-beak)"/>
    <ellipse cx="334" cy="656" rx="52" ry="17" style="fill:url(#cend-beak)"/>
    <!-- eyes, looking at the class -->
    <ellipse cx="244" cy="268" rx="25" ry="31" style="fill:#fbfaf6"/>
    <ellipse cx="316" cy="268" rx="25" ry="31" style="fill:#fbfaf6"/>
    <circle cx="248" cy="274" r="11" style="fill:#141413"/><circle cx="312" cy="274" r="11" style="fill:#141413"/>
    <circle cx="252" cy="270" r="3.5" style="fill:#ffffff"/><circle cx="316" cy="270" r="3.5" style="fill:#ffffff"/>
    <!-- beak wide open, as a horn towards the class -->
    <ellipse cx="280" cy="352" rx="70" ry="46" style="fill:url(#cend-beak)"/>
    <ellipse cx="280" cy="350" rx="48" ry="29" style="fill:#7a1f1a"/>
    <ellipse cx="280" cy="364" rx="24" ry="10" style="fill:#d9605a"/>
    <!-- clay sheen -->
    <ellipse cx="226" cy="214" rx="34" ry="14" transform="rotate(-24 226 214)" style="fill:#ffffff;opacity:.16"/>
    <!-- the bubble -->
    <path d="M140,40 H420 A22,22 0 0 1 442,62 V112 A22,22 0 0 1 420,134 H312 L286,166 L290,134 H140 A22,22 0 0 1 118,112 V62 A22,22 0 0 1 140,40 Z" style="fill:#fffdf8;stroke:#3d3d3a;stroke-width:2.5"/>
    <text x="280" y="102" text-anchor="middle" style="font-family:Newsreader,Georgia,serif;font-style:italic;font-size:46px;font-weight:400;fill:#141413">Noot noot?</text>
  </g>${frame}`;

const PICTURES: Record<string, { svg: () => string; credit: string }> = {
  a: { svg: () => photo('a', endJpg), credit: 'Photo: cottonbro studio, Pexels (Pexels licence)' },
  pingu: { svg: pingu, credit: '' },
  grumpy: { svg: () => photo('grumpy', grumpyJpg, 'xMidYMin'), credit: 'Photo: Gage Skidmore, Wikimedia Commons (CC BY-SA 3.0), cropped' },
  dog: { svg: () => photo('dog', dogJpg), credit: 'Photo: Jusper Mwangi, Pexels (Pexels licence)' },
  owl: { svg: () => photo('owl', owlJpg), credit: 'Photo: Landiva Weber, Pexels (Pexels licence)' },
  einstein: { svg: () => photo('einstein', einsteinJpg, 'xMidYMin'), credit: 'Photo: Ferdinand Schmutzer, 1921 (public domain)' },
};

export function draw(id: string): string {
  const pic = PICTURES[id] ?? PICTURES.a;
  return `<svg class="fig-svg" viewBox="0 0 1340 696" role="img" aria-label="Questions? The slides online at ${SITE.replace('https://', '')} and their code on GitHub at ${REPO.replace('https://', '')}">
    ${pic.svg()}
    <text x="${X0 - 6}" y="214" style="font-family:Newsreader,Georgia,serif;font-size:136px;font-weight:400;letter-spacing:-.015em;fill:#141413">Questions?</text>
    <line x1="${X0}" y1="276" x2="1300" y2="276" style="stroke:#d9d4c6;stroke-width:1.5"/>
    ${link(344, 'The slides online', SITE, SITE.replace('https://', '').replace(/\/$/, ''), 'not guaranteed to be online at all times')}
    ${link(502, 'The code, including the animations', REPO, REPO.replace('https://', ''), 'on GitHub')}
    ${pic.credit ? T(1336, 688, pic.credit, 14, '#8a877d', 400, 'end') : ''}
  </svg>`;
}

// Key lines on the stage, per animation and staging (lecturer, 29 Oct 2026: "people don't read the text under the
// animation; their attention is on the top. Put it directly on the animation."). Each beat's take-home (≤ 6 words, the
// caption's own words) and the closing question, big, in free space of that staging's frames (stage units, 1600 × 740).
// The player draws them (player.ts); a staging's own `keys` win over these.
import type { StageKey } from './types';

const Q = 2.2; // a closing question comes after the beat's motion has begun

/** Key lines for a staging's own `keys`: one StageKey per line, the first line's baseline at y, the next ones below
 *  (line height 1.2 × size); x and anchor as for one line (default: centred). */
export function keyLines(beat: number, lines: string[], x: number, y: number,
  o: { size?: number; t0?: number; anchor?: 'start' | 'middle' | 'end' } = {}): StageKey[] {
  const lh = Math.round((o.size ?? 42) * 1.2);
  return lines.map((text, i) => ({ beat, text, x, y: y + i * lh, anchor: o.anchor, t0: o.t0, size: o.size }));
}

export const STAGE_KEYS: Record<string, StageKey[]> = {
  // slide 2 · Sunlight and the sky
  'sky:e': [
    { beat: 0, text: 'Sunlight is a mix of wavelengths', x: 800, y: 712 },
    { beat: 1, text: 'Air scatters short wavelengths most', x: 800, y: 712 },
    { beat: 2, text: 'So the sky looks blue', x: 800, y: 712 },
    { beat: 3, text: 'At sunset, far more air', x: 800, y: 80 },
    { beat: 4, text: 'Blue scattered away: red and orange', x: 800, y: 90 },
  ],
  // slide 3 · Who uses which light?
  'life:f': [
    { beat: 0, text: 'Blue-green goes deepest', x: 1320, y: 210 },
    { beat: 1, text: 'Red and green as 1 colour', x: 330, y: 260 },
    { beat: 2, text: 'A third colour receptor', x: 1350, y: 712 },
    { beat: 3, text: 'Bees see ultraviolet; red looks dark', x: 1150, y: 718 },
    { beat: 4, text: 'Chlorophyll absorbs mostly blue and red', x: 1180, y: 700 },
    { beat: 5, text: 'What is physically different about each slice?', x: 800, y: 150, size: 44, t0: 1.0 },
  ],
  // slide 5 · Why pigments differ
  'pig:a': [
    { beat: 0, text: 'Electrons spread over the ring', x: 480, y: 700 },
    { beat: 1, text: '1 group shifts both bands', x: 480, y: 700 },
    { beat: 2, text: 'Longer chain, longer wavelength', x: 800, y: 72 },
    { beat: 3, text: 'Carotenoids absorb blue to blue-green', x: 800, y: 110 },
    { beat: 4, text: 'Most blue and red, least green', x: 800, y: 712 },
  ],
  // slide 7 · Into the leaf
  'leaf:a': [
    { beat: 0, text: 'Chloroplasts move within minutes', x: 800, y: 722, size: 40 },
    { beat: 1, text: 'Thylakoid membranes stack into grana', x: 800, y: 722, size: 40 },
    // take-home, then the question in its place, both in the centre (lecturer, 29 Oct 2026)
    { beat: 2, text: 'PSII stacked, PSI unstacked', x: 800, y: 700, size: 44 },
    { beat: 2, text: 'Do all these chlorophylls do the chemistry?', x: 800, y: 700, size: 44, t0: Q },
  ],
  // slide 8 · To the reaction centre
  'antenna:a': [
    // each take-home only after its beat's motion has stopped (lecturer, 29 Oct 2026: beat 0 stops at ≈ 3 s, beat 1 at ≈ 4 s)
    { beat: 0, text: 'Most chlorophylls only collect light', x: 720, y: 120, size: 38, t0: 3.2 },
    // lecturer, 29 Oct 2026: "around 300 chlorophylls serve one reaction centre"; centred in the free band under the structure
    { beat: 1, text: 'About 300 chlorophylls serve 1 reaction centre', x: 800, y: 600, size: 44, t0: 4.2 },
    // right under the reaction centre it asks about (lecturer, 29 Oct 2026: the question close to what it is about)
    { beat: 2, text: 'What does the reaction centre', x: 800, y: 540, size: 44, t0: Q },
    { beat: 2, text: 'do with it?', x: 800, y: 592, size: 44, t0: Q },
  ],
  // slide 9 · Photosystem II
  'psii:pb': [
    // the questions centred, in the free stroma band at the top (lecturer, 29 Oct 2026)
    { beat: 0, text: 'Where does it get a new electron?', x: 800, y: 60, size: 44, t0: Q },
    { beat: 1, text: 'The O₂ comes from water', x: 500, y: 718 },
    { beat: 2, text: 'Photosystem II splits water', x: 1000, y: 718 },
    { beat: 3, text: 'Where do they go next?', x: 800, y: 80, size: 44, t0: Q },
  ],
  // slide 10 · Cytochrome b₆f
  'b6f:qb': [
    { beat: 0, text: 'H⁺ released into the lumen', x: 1580, y: 712, anchor: 'end', size: 38 },
    { beat: 1, text: 'Plastocyanin carries each electron', x: 1580, y: 712, anchor: 'end', size: 38 },
    { beat: 3, text: 'More H⁺ collect in the lumen', x: 1580, y: 712, anchor: 'end', size: 38 },
    // the last beat's framing fills x 12–960 with the chain and the top right with the count: the question goes in the
    // free space under the count, the only free band large enough
    { beat: 4, text: 'What does photosystem I', x: 1280, y: 400, size: 44, t0: Q },
    { beat: 4, text: 'do with the electrons?', x: 1280, y: 453, size: 44, t0: Q },
  ],
  // slide 11 · Photosystem I: the question, centred in the free band at the top (its Z-scheme panel already says that
  // both photosystems work together)
  'psi:m4': [
    { beat: 4, text: 'What else does the chain make besides NADPH?', x: 800, y: 44, size: 44, t0: Q },
  ],
  // slide 13 · Balancing ATP and NADPH (staging s1; staging a below)
  'cyclic:s1': [
    { beat: 0, text: 'Too little ATP for its NADPH', x: 1230, y: 600, size: 38 },
    { beat: 1, text: 'Cyclic electron flow: ATP, no NADPH', x: 1230, y: 600, size: 38 },
    { beat: 2, text: 'Water–water cycle: ATP, no NADPH', x: 1230, y: 600, size: 38 },
    { beat: 3, text: 'Malate valve: less NADPH', x: 1230, y: 600, size: 38 },
    // centred above the panels, the only free band of this last frame
    { beat: 4, text: 'With ATP and NADPH balanced, how do plants use them?', x: 800, y: 38, size: 44, t0: Q },
  ],
  'cyclic:a': [
    { beat: 0, text: '≈ 2.6 ATP made,', x: 1440, y: 380, size: 34 },
    { beat: 0, text: '3 needed', x: 1440, y: 422, size: 34 },
    { beat: 1, text: 'Ferredoxin returns electrons to plastoquinone', x: 1020, y: 718, size: 36 },
    { beat: 2, text: 'Without cyclic flow, plants grow poorly', x: 700, y: 718, size: 38 },
    // centred, between the complexes' names and the legend
    { beat: 3, text: 'With ATP and NADPH balanced, how do plants use them?', x: 800, y: 640, size: 44, t0: Q },
  ],
};

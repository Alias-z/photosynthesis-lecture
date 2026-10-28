// Cytochrome b₆f, staging pa: as m1 (one close view on b₆f), but plastoquinol is not pushed: it reaches the Q_o site by a
// random walk in the lipids (slow, jittery), binds, hands over, and the emptied plastoquinone walks off a little and stays.
// In the simplified story both electrons go on, one at a time, each with a plastocyanin (the first docks under PSI and
// stays there; a second comes in from the lumen and stops short of it); the end reads "2 e⁻ → 2 H⁺ into the lumen".
// The story, the walk, the timing and the camera: b6fm-common.ts. Captions: beats-b6fp.ts (drafts).
import { B6FP } from './beats-b6fp';
import { makeStaging } from './b6fm-common';

const Z = { s: 2.9, c: [350, 313.5] as [number, number] };

export const STAGING = makeStaging({
  id: 'pa',
  name: 'pa · Plastoquinol wanders',
  note: 'The slide 8 figure: plastoquinol diffuses at random in the membrane until b₆f’s Q_o pocket binds it; emptied, it wanders off again. Both electrons go on, each with a plastocyanin; the first docks under photosystem I and stays.',
  z1: Z, z2: Z, z2e: Z, follow: false, pq: 'wander', beats: B6FP,
  b1: { dock: 3.85, dockD: 2.0, hand: 6.0, relabel: 6.6, leave: 7.0, leaveD: 1.5, end: 8.6 },
  story: 'two',
  b2: { pc: 0.1, psi: 0.7, hold: 1.6, e: 1.7, eD: 0.9, go: 2.8, goD: 1.3, hold2: 4.3, in2: 4.4, e2: 5.5, go2: 6.6, end: 7.8 },
});

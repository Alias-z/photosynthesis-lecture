// Captions of the stagings pa and pb of the slide 8 animation (b6fm-common.ts): plastoquinol reaches cytochrome b₆f by
// diffusing in the membrane (lecturer's question, 28 Oct 2026: what drives it? nothing; it diffuses at random and b₆f's
// Q_o pocket binds it), and, in the simplified story, both its electrons go on to plastocyanin while its 2 H⁺ stay in
// the lumen (the Q cycle is told by the b6fq stagings). All three captions are drafts.
import { B6FM } from './beats-b6fm';
import type { Beat } from './types';

export const B6FP: Beat[] = [
  { ...B6FM[0], say: 'Plastoquinol diffuses to cytochrome b₆f, binds and hands over its two electrons; its two H⁺ are released into the lumen.' },
  { ...B6FM[1], say: 'Cytochrome b₆f passes the two electrons one at a time to plastocyanin, which carries each through the lumen to photosystem I.' },
  { ...B6FM[2], say: 'Each plastoquinol leaves 2 H⁺ in the lumen. <b>What does photosystem I do with the electrons?</b>' },
];

// Stepped lecture animations: every variant of an animation stages the same beats, captions and sources.
export interface Cite { label: string; url: string }

/** One step: a short tag, the caption (HTML) and the papers it rests on, shown under the caption. */
/** A beat's caption under the stage; `steps`, when given, replaces it step by step (one per step of the beat's holds;
 *  lecturer, 30 Oct 2026: "every time the animation changes phase, change the text below: what age, what RuBisCO"). */
export interface Beat { tag: string; say: string; cite: Cite[]; steps?: Array<{ tag: string; say: string }> }

/** One way of staging an animation's beats on the 1600 × 740 stage. */
export interface Staging {
  id: string;
  name: string;
  /** One line on what this variant tests, shown under the switch on the pilot page. */
  note: string;
  /** Beats this staging was built for, when they differ from the animation's current ones (older rounds). */
  beats?: Beat[];
  /** Pauses inside each beat, in seconds since the beat began (holds[b] for beat b, ascending): the player stops at
   *  each and waits for a click, so every click plays one step. The beat's end is always a stop and is not listed.
   *  Without holds, a beat plays through in one click. */
  holds?: number[][];
  /** Key lines drawn big on the stage, where the eyes are (lecturer, 29 Oct 2026: "people don't read the text under the
   *  animation"): a beat's take-home (≤ 6 words) or its closing question, in stage units; it fades in at t0 s into its beat. */
  keys?: StageKey[];
  /** Inner markup of the stage SVG (viewBox 0 0 1600 740). */
  svg(): string;
  /** Wires the stage up once it is in the page. The returned function draws `beat` at `t` seconds after the
   *  beat began; motion plays once and then holds its last frame, so a large `t` gives the beat's end state. */
  bind(stage: SVGSVGElement): (beat: number, t: number) => void;
}

export interface StageKey { beat: number; text: string; x: number; y: number; anchor?: 'start' | 'middle' | 'end'; t0?: number; size?: number }

export interface Animation { key: string; title: string; beats: Beat[]; stagings: Staging[] }

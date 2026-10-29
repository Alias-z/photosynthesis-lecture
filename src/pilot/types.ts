// Shapes shared by the slide modules in figs/: each slide owns its page text and its figure variants.
/** A point: its claim, short reading text, and (optional) the numbers as equations, set apart from the text (lecturer,
 *  28 Oct 2026: "separate the number calculation from the normal reading text"). */
export interface Point { claim: string; text: string; eq?: string }
/** A figure option; `anim` marks one whose drawing could also become an animation. */
export interface Variant {
  id: string;
  name: string;
  anim?: boolean;
  /** The page shows no title and the figure takes the space; the figure then names the topic itself. */
  noTitle?: boolean;
  /** The page drops its reading column and the figure spans the full width (a summary table; lecturer, 30 Oct 2026:
   *  "remove the right-side text, so the table occupies the entire slide"). */
  wide?: boolean;
}
export interface Ref { label: string; url: string }

export interface PlateText {
  /** Page number as shown: 1–15 for lecture 1, C1–C13 for lecture 2. */
  n: string;
  /** Key of the slide's picks and note in picks.json, when it differs from `n`: a slide that moved keeps the number it
   *  had when it was picked, so its picks stay with it (lecture 2 order A, 28 Oct 2026). */
  pick?: string;
  title: string;
  /** 'confirmed' = lecturer-confirmed context; 'draft' = checked draft awaiting confirmation. */
  status: 'confirmed' | 'draft';
  lead: string;
  /** Each point opens with a claim that reads on its own, then one supporting sentence. */
  points: Point[];
  refs: Ref[];
  animation?: string;
  /** The slide has only its lead page: shown live, never printed (slide 2 since 26 Oct 2026). */
  leadOnly?: boolean;
  /** Key of the animation this slide plays live (in src/pilot/anim): a play button on its lecture page opens it. */
  play?: string;
}

export interface Plate extends PlateText {
  variants: Variant[];
  figure: (variant: string) => string;
}

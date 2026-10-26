# Slide rules

The lecturer has selected slides 1–4 as content-planning views with plain text boxes for Claude to develop into variants. Slide 2 retains its original title. Original animations for slides 3 and 4 remain in src/slides/wavelengths.ts and src/slides/scattering.ts, with dated copies under backups/ and Backup/Return access in the viewer. Preserve the other existing slides and animations. Content planning is the assistant's role; the lecturer selects each slide, directs content and reviews visual variants. The rules below guide teaching slides, not the temporary brief boxes.

## 1. Content

- Show only essential information. If the lecturer can say it, leave it off the slide.
- One title per slide. No kicker, section label, running header or second title layer.
- At most one subtitle, and only if it says something the title does not.
- No figure numbers ("Fig. 1"), captions that only name the picture, legends, or notes such as "drawn to scale".
- No confusing numbers or labels. Every number shown must be needed to follow the slide.
- Labels sit on the drawing, next to what they name.
- Slides only: no style-guide or demo pages in the deck.
- Titles name the scientific subject. Avoid generic titles such as “Today”.
- Use scientific diagrams and photographs. Avoid decorative cartoon illustrations.
- Teaching slides must work as complete static PDF study pages. Use the full canvas for essential text and images. A small Animation button opens the demonstration over most of the screen. Close returns to the slide. Use brief animation only when motion clarifies a concept. Omit the button and animation from the PDF while retaining all static content. Slide 3 is entirely static.
- Slide 4 uses black-and-white newspaper-cutout portraits of Einstein and Rayleigh, with Planck optional. Pair each portrait with the finding, equation and concise takeaway. Its Animation button opens the existing seven-step sky/sunset animation.

## 2. Layout

- Canvas 1600 × 900 px, scaled to fit the screen. On a 13.3-inch screen, pt = px × 0.6.
- Margins: 96 px left and right.
- Title: top-left, at about `left: 92px; top: 48px`.
- Subtitle, if any: directly under the title, `left: 96px`.
- Controls (for example Midday / Sunset / Pause): top right, `right: 96px`, in line with the title.
- Body caption, if any: bottom left, `left: 96px`, ending before the page number.
- Page number with ‹ › arrows: bottom right. Nothing else goes there.
- Contents jumper: hidden at the left edge; appears only when the mouse reaches it.
- Nothing overlaps: no text on text, and no text on the page number or controls.

## 3. Type

Text is at least 18 pt (30 px) everywhere.

| Use | Face | Size |
|---|---|---|
| Cover question | Spectral Light, key words italic | 50 pt (84 px) |
| Slide title | Spectral Light, no full stop | 41 pt (68 px) |
| Subtitle | Spectral Italic | 24 pt (40 px) |
| Caption, body | IBM Plex Sans | 23 pt (38 px) |
| Labels on figures | Plex Sans SemiBold + Spectral Italic | 22 pt (36 px) |
| Ticks, page number, controls | IBM Plex Sans | 18 pt (30 px), the minimum |

## 4. Colour

Paper and ink. In diagrams, colour is used only for light (and the few washes in drawings). Photographs retain their natural colours. Text is never coloured.

| Token | Hex | Use |
|---|---|---|
| Paper | `#F2F3EE` | slide ground (with a faint grain) |
| Figure paper | `#EEF1E8` | inside figure plates |
| Ink | `#1F2A3A` | text, lines |
| Ink, soft | `#3F4A5A` | second lines, ticks, page number |
| Sky wash | `#5F86C4` → `#E6ECF0` | drawings only |
| Leaf wash | `#76AA58` | drawings only, two thin layers |
| Ground | `#C4CCB6` | drawings only |
| Sun wash | `#FFF6D8` | the Sun's disc |
| Light 450 nm | `#2350E6` | blue light only |
| Light 550 nm | `#2A963A` | green light only |
| Light 650 nm | `#DE361E` | red light only |

The spectrum strip is the only full rainbow; it darkens below 380 nm and above 750 nm.

## 5. Drawing

Ink outlines 1.5–2.4 px, figure circles 2.4 px, light waves 3.2–3.4 px, dashed guides 1.2 px.

## 6. Motion

- Light moves at one steady speed; all colours travel together.
- A scatter is a thin ring that fades in half a second.
- Results (swatches, percentages) are computed and stay still while the lecturer talks.
- The lecturer steps through; no sound.

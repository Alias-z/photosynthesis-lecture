# Photosynthesis lecture, ETH Zurich

Slides and animations for the lecture "Why is the sky blue, and why are leaves green?".
The whole deck is plain HTML: open any file in a browser, no build step.

## Files

| File | What it is |
|---|---|
| `style/plate-slides.html` | The chosen **Plate** style: three sample slides (title, figure, live demo). Arrow keys change slides, `F` toggles full screen, and a Contents jumper appears when the mouse reaches the left edge. |
| `style/style-directions.html` | The three directions that were compared (Observatory, Plate, Studio), for reference. |

## Plate style

Paper and ink, like a figure plate in a science journal. Colour is used only for light.

### Slides

- 1600 × 900 px canvas, scaled to the screen. On a 13.3-inch slide, pt = px × 0.6.
- One title per slide. No part labels or running headers.
- Navigation: page number bottom right; Contents jumper hidden at the left edge.
- Title slide: double-ruled ink frame, question as title, two numbered figure plates.
- Figure slide: title, optional subtitle, one figure with labels on it, `Fig. n` caption.
- Live demo slide: title, word buttons (Midday, Sunset, Pause) in an ink box, one caption.

### Type

| Use | Face | Size |
|---|---|---|
| Cover question | Spectral Light, key words italic | 50 pt (84 px) |
| Slide title | Spectral Light | 41 pt (68 px) |
| Subtitle | Spectral Italic | 24 pt (40 px) |
| Caption, body | IBM Plex Sans | 23 pt (38 px) |
| Figure labels | Plex Sans SemiBold + Spectral Italic | 22 pt (36 px) |
| Figure numbers | Spectral Italic + Plex Sans | 20 / 18 pt |
| Ticks, page number, controls | IBM Plex Sans | 18 pt (30 px), the minimum |

### Colour

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

The spectrum strip is the only full rainbow and darkens below 380 nm and above 750 nm. Text is never coloured.

### Drawing

Ink outlines 1.5–2.4 px, figure circles 2.4 px, light waves 3.2–3.4 px, dashed guides 1.2 px.
Labels sit on the drawing, never in a legend.

### Motion

- Light moves at one steady speed; all colours travel together.
- A scatter is a thin ring that fades in half a second.
- Results (swatches, percentages) are computed and stay still while you talk.
- The lecturer steps through; no sound.

Typefaces: Spectral and IBM Plex Sans (Google Fonts).

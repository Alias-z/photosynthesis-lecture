# Photosynthesis lecture, ETH Zurich

The slides and animations of a bachelor lecture on photosynthesis: how leaves capture light, how
the light reactions make ATP and NADPH, how RuBisCO fixes CO₂, and how C₃, C₂, C₄ and CAM plants
cope with too little CO₂. Every slide is a web page; many have an animation you can step through.

**View online:** https://photosynthesis-lecture.hongyuanzhang.com/ (not guaranteed to be online at
all times). If it is offline, run the slides on your own computer as below.

Figures taken from papers are credited on each slide and shown for teaching only.

## Installation

You need [Node.js](https://nodejs.org/) 20.19 or newer (the LTS version is fine) and
[Git](https://git-scm.com/).

```bash
git clone https://github.com/Alias-z/photosynthesis-lecture.git
cd photosynthesis-lecture
npm install
```

### Run the slides

```bash
npm run dev
```

Open http://localhost:5174/pilot.html in your browser.

### Or build a static copy

```bash
npm run build
npm run preview
```

Open http://127.0.0.1:4174/pilot.html. The built files are in `dist/`.

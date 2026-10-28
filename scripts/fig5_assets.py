# Real image for slide 5 (src/pilot/figs/l04a.ts, variant r2), restyled for the deck's paper.
#   python fig5_assets.py <refs-board dir L2b-shade-light> <out dir src/assets/photos>
# - alocasia-shade.jpg: John Robert McPherson 2013, Alocasia macrorrhizos in the understorey of Lamington National Park,
#   Queensland, Wikimedia Commons, CC BY-SA 4.0
#   (https://commons.wikimedia.org/wiki/File:Alocasia_macrorrhizos_National_Park_Rd_Lamington_National_Park_Queensland_P1310260.jpg).
#   Crop x 840-1440, y 300-1150 of the 1600 x 1200 board copy (the leaves and the dark stand above them), resized to
#   600 x 850. Toned as the deck's other real images: tones mapped from warm ink to paper, colour kept at 70 %.
#   Nothing is added or removed.
import sys
from pathlib import Path
from PIL import Image, ImageEnhance, ImageOps

board, out = Path(sys.argv[1]), Path(sys.argv[2])
INK, PAPER = (43, 42, 39), (247, 244, 236)
im = Image.open(board / 'forest-alocasia-rainforest-queensland.jpg').convert('RGB').crop((840, 300, 1440, 1150))
im = ImageOps.autocontrast(im, cutoff=0.5)
im = ImageEnhance.Color(im).enhance(0.7)
# each channel from [0, 255] to [ink, paper], so black prints as warm ink and white as paper
lut = [int(round(INK[c] + (PAPER[c] - INK[c]) * v / 255)) for c in range(3) for v in range(256)]
im = im.point(lut)
im.save(out / 'alocasia-shade.jpg', quality=88)
print(out / 'alocasia-shade.jpg', im.size)

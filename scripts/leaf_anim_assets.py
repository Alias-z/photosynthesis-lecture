# Real images for the "Into the leaf" animation (src/pilot/anim/leaf-a.ts, leaf-b.ts), restyled for the deck.
#   python leaf_anim_assets.py <refs-board dir L2b-shade-light> <out dir src/assets/anim/leaf>
# - senn.png: Gustav Senn, Photopress AG, between 1915 and 1935, Universitaetsbibliothek Basel, UBH Portr BS Senn G 1875, 2
#   (https://swisscollections.ch/Record/991100683099705501; no licence stated in the record). Newspaper halftone made
#   with scripts/halftone.py, crop x 30-890, y 20-1095 of the 918 x 1214 scan.
# - senn-1895.jpg: G. Senn 1895, chloroplasts moving in Vallisneria leaf cells (pencil, arrows show their paths), in
#   Honegger 2022, Bauhinia 28: 63, Abb. 3a, CC BY 4.0 (https://eterna.unibas.ch/bauhinia/article/view/1607). Crop x 225-964,
#   y 30-505 of the 964 x 583 file, above the handwritten caption; toned from warm ink to newsprint.
# - tem-sun.jpg, tem-shade.jpg: Shao Q, et al. 2014, PLoS One 9: e85996, https://doi.org/10.1371/journal.pone.0085996,
#   Fig. 6 b (50 % irradiance) and k (5 % irradiance), CC BY 4.0. Same field, 2.9 x 2.6 um, from each panel (their 0.5 um
#   bars measure 44.5 px in b and 40.5 px in k), inside the panels, without their scale bars and letters. In b the authors'
#   arrow (to a plastoglobule) is covered with micrograph texture copied from 28 px to its right, with a feathered edge. Both resized to 520 x 466 px
#   and toned from warm ink to paper. Nothing else is changed.
import subprocess, sys
from pathlib import Path
from PIL import Image, ImageOps

board, out = Path(sys.argv[1]), Path(sys.argv[2])
here = Path(__file__).resolve().parent
subprocess.run([sys.executable, str(here / 'halftone.py'), str(board / 'senn-portrait-photopress.jpg'), str(out / 'senn.png'),
                '30', '20', '890', '1095'], check=True)

INK, PAPER = (43, 42, 39), (247, 244, 236)
drawing = ImageOps.autocontrast(Image.open(board / 'senn1895-vallisneria-drawing.jpg').convert('L').crop((225, 30, 964, 505)), cutoff=1)
ImageOps.colorize(drawing, black=INK, white=(241, 236, 224)).save(out / 'senn-1895.jpg', quality=90)
print(out / 'senn-1895.jpg')
fig = Image.open(board / 'shao2014-shade-grana-tem.jpg').convert('L')
# um per figure px: b 0.5/44.5, k 0.5/40.5; one field of 2.9 x 2.6 um.
# Panel b's arrow, about x 1076-1094, y 118-139, covered with the texture 28 px to its right (feathered mask).
from PIL import ImageDraw, ImageFilter
m = Image.new('L', (34, 32), 0)
ImageDraw.Draw(m).rectangle((5, 5, 28, 26), fill=255)
fig.paste(fig.crop((1070 + 28, 112, 1104 + 28, 144)), (1070, 112), m.filter(ImageFilter.GaussianBlur(2.5)))
boxes = {'tem-sun.jpg': (880, 100, 880 + 258, 100 + 231), 'tem-shade.jpg': (790, 1105, 790 + 235, 1105 + 211)}
for name, box in boxes.items():
    g = ImageOps.autocontrast(fig.crop(box), cutoff=0.5).resize((520, 466), Image.LANCZOS)
    toned = ImageOps.colorize(g, black=INK, white=PAPER)
    toned.save(out / name, quality=88)
    print(out / name)

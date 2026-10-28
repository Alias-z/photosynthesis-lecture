# The plant photo of the cyclic electron flow animation (src/pilot/anim/cyc10b-common.ts), restyled as a newspaper halftone.
#   python cyclic_anim_assets.py <src/assets/refs/L5-electron-transport/munekage2004-cyclic-mutants.jpg> <out .png> [ht|tone]
# Source: Munekage et al. 2004, Nature 429: 579, Fig. 2 (Arabidopsis wild type, pgr5, crr and crr pgr5 plants in one pot),
# https://doi.org/10.1038/nature02598. Crop x 30-572, y 19-429 of the 600 x 466 board image (the photo, without its white
# margin). The paper's eight genotype labels (white type on the soil and the background) are taken out: their pixels are
# refilled from the surrounding soil (normalized blur); the animation sets its own two labels at the same places. Then
# greyscale and a 45-degree dot screen in warm ink on newsprint (as scripts/halftone.py, without the portrait vignette),
# at 2 output px per board px, 5 px cells; saved with 16 colours.
import math, sys
from PIL import Image, ImageDraw, ImageFilter, ImageOps

src, out = sys.argv[1], sys.argv[2]
mode = sys.argv[3] if len(sys.argv) > 3 else 'ht'
CROP = (30, 19, 572, 429)
# the paper's labels, in board pixels: WT, pgr5, crr2-2 pgr5, crr2-2, crr3, crr3 pgr5, crr4-2 pgr5, crr4-2
LABELS = [(163, 128, 202, 152), (378, 126, 427, 152), (423, 170, 527, 197), (58, 203, 117, 230), (156, 308, 200, 334),
          (430, 286, 517, 312), (366, 338, 467, 364), (208, 373, 270, 397)]

im = Image.open(src).convert('RGB')
px = im.load()
mask = Image.new('L', im.size, 0)
mp = mask.load()
for (x0, y0, x1, y1) in LABELS:
    for y in range(y0, y1):
        for x in range(x0, x1):
            r, g, b = px[x, y]
            if min(r, g, b) > 120 and max(r, g, b) - min(r, g, b) < 60:
                mp[x, y] = 255
mask = mask.filter(ImageFilter.MaxFilter(5))
# normalized blur of the unmasked pixels, used to refill the masked ones (twice, so wide letters fill from their edges)
for _ in range(2):
    keep = ImageOps.invert(mask)
    held = Image.composite(im, Image.new('RGB', im.size, (0, 0, 0)), keep)
    bi, bw = held.filter(ImageFilter.GaussianBlur(6)), keep.filter(ImageFilter.GaussianBlur(6))
    bp, wp, mp, ip = bi.load(), bw.load(), mask.load(), im.load()
    for y in range(im.size[1]):
        for x in range(im.size[0]):
            if mp[x, y] and wp[x, y] > 8:
                w = wp[x, y] / 255
                ip[x, y] = tuple(int(min(255, c / w)) for c in bp[x, y])
                mp[x, y] = 0
im = im.crop(CROP)

g = ImageOps.autocontrast(im.convert('L'), cutoff=1)
PAPER, INK = (241, 236, 224), (43, 42, 39)
if mode == 'tone':
    ImageOps.colorize(g, black=INK, white=PAPER).save(out, optimize=True)
    print(out); sys.exit()
SC = 2                      # output px per board px
W, H = g.size[0] * SC, g.size[1] * SC
g = g.resize((W, H), Image.LANCZOS).filter(ImageFilter.UnsharpMask(radius=3, percent=80, threshold=2)).filter(ImageFilter.GaussianBlur(0.5))
CELL, SS = float(sys.argv[4]) if len(sys.argv) > 4 else 5.0, 4
big = Image.new('RGB', (W * SS, H * SS), PAPER)
d = ImageDraw.Draw(big)
a = math.radians(45)
ca, sa = math.cos(a), math.sin(a)
n = int(max(W, H) * 1.5 / CELL) + 2
gp = g.load()
for i in range(-n, n):
    for j in range(-n, n):
        u, v = (i + 0.5) * CELL, (j + 0.5) * CELL
        x, y = W / 2 + u * ca - v * sa, H / 2 + u * sa + v * ca
        if not (-CELL <= x < W + CELL and -CELL <= y < H + CELL):
            continue
        dark = (1 - gp[min(W - 1, max(0, int(x))), min(H - 1, max(0, int(y)))] / 255) ** 1.7
        if dark < 0.03:
            continue
        r = CELL * 0.5 * math.sqrt(dark) * 1.1 * SS
        X, Y = x * SS, y * SS
        d.ellipse((X - r, Y - r, X + r, Y + r), fill=INK)
# 16 colours: ink, paper and the antialiased dot edges between them
big.resize((W, H), Image.LANCZOS).quantize(colors=16, method=Image.Quantize.MEDIANCUT).save(out, optimize=True)
print(out)

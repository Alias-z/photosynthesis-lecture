# Newspaper halftone of a portrait: crop, greyscale, soft oval vignette into newsprint, 45-degree dot screen in warm ink.
import math, sys
from PIL import Image, ImageDraw, ImageFilter, ImageOps

src, out, cx0, cy0, cx1, cy1 = sys.argv[1], sys.argv[2], *map(int, sys.argv[3:7])
W, H = 600, 750            # output px
CELL = 4.2                 # screen period in output px
SS = 4                     # supersampling
PAPER = (241, 236, 224)    # newsprint
INK = (43, 42, 39)

im = Image.open(src).convert('L').crop((cx0, cy0, cx1, cy1)).resize((W, H), Image.LANCZOS)
im = ImageOps.autocontrast(im, cutoff=2)
im = im.filter(ImageFilter.UnsharpMask(radius=4, percent=90, threshold=2))
# Soft oval vignette: fade the photo into the paper toward the edges.
mask = Image.new('L', (W, H), 0)
ImageDraw.Draw(mask).ellipse((W * 0.08, H * 0.04, W * 0.92, H * 1.04), fill=255)
mask = mask.filter(ImageFilter.GaussianBlur(W * 0.06))
im = Image.composite(im, Image.new('L', (W, H), 255), mask)
im = im.filter(ImageFilter.GaussianBlur(0.4))

big = Image.new('RGB', (W * SS, H * SS), PAPER)
d = ImageDraw.Draw(big)
a = math.radians(45)
ca, sa = math.cos(a), math.sin(a)
R = max(W, H) * 1.5
n = int(R / CELL) + 2
for i in range(-n, n):
    for j in range(-n, n):
        u, v = (i + 0.5) * CELL, (j + 0.5) * CELL
        x, y = W / 2 + u * ca - v * sa, H / 2 + u * sa + v * ca
        if not (-CELL <= x < W + CELL and -CELL <= y < H + CELL):
            continue
        g = im.getpixel((min(W - 1, max(0, int(x))), min(H - 1, max(0, int(y))))) / 255
        dark = (1 - g) ** 1.45
        if dark < 0.03:
            continue
        r = CELL * 0.5 * math.sqrt(dark) * 1.08 * SS
        X, Y = x * SS, y * SS
        d.ellipse((X - r, Y - r, X + r, Y + r), fill=INK)
big.resize((W, H), Image.LANCZOS).save(out, optimize=True)
print(out)

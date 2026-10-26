# Paints Rayleigh's closed eye into his original photo (greyscale), so the halftone screen renders the wink exactly
# like the rest of the portrait. (Einstein's tongue frame is his real 1951 photograph, see src/assets/SOURCES.md.)
import sys
from PIL import Image, ImageDraw, ImageFilter, ImageStat

src_dir, out_dir = sys.argv[1], sys.argv[2]

# Rayleigh: his near eye closed, centre (317, 284) in the 800 x 1077 original.
r = Image.open(f'{src_dir}/rayleigh.jpg').convert('L')
ex, ey, rw, rh = 317, 284, 23, 10
skin = int(ImageStat.Stat(r.crop((ex - 18, ey + 16, ex + 18, ey + 30))).mean[0])
lid = Image.new('L', r.size, 0)
ImageDraw.Draw(lid).ellipse((ex - rw, ey - rh, ex + rw, ey + rh), fill=255)
lid = lid.filter(ImageFilter.GaussianBlur(3))
r = Image.composite(Image.new('L', r.size, skin), r, lid)
d = ImageDraw.Draw(r)
d.arc((ex - 20, ey - 14, ex + 20, ey + 8), start=20, end=160, fill=28, width=4)    # closed lid line
d.arc((ex - 22, ey - 22, ex + 22, ey + 2), start=200, end=330, fill=int(skin * 0.7), width=2)  # crease above
r = r.filter(ImageFilter.GaussianBlur(0.5))
r.save(f'{out_dir}/rayleigh-wink.jpg', quality=95)
print('painted')

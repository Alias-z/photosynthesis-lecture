# The LHCII trimer from the stroma with chlorophyll a and b in separate colours (slide 5, variants s1 and s2).
#   python lhcii_ab_crop.py <render.png> <out: src/assets/photos/lhcii-top-ab.png>
# render.png: model3d/complex.html?bare=1&view=top&w=1000&h=1000&scale=10&stick=0.42 (3Dmol.js 2.5.5, PDB 2BHW, pea LHCII)
# in headless Chrome with SwiftShader GL, on a transparent ground: the same call as photos/lhcii-top.png without &onechl,
# so Chl a is #2e7d32, Chl b #93c95a, carotenoids #ef8a17, protein #e4dfd5. Cropped exactly as lhcii-top.png
# (x 83–892, y 70–864), so the anchors TOPA in l04a.ts hold, and quantized to 256 colours.
import sys
from PIL import Image

im = Image.open(sys.argv[1]).convert('RGBA').crop((83, 70, 892, 864)).quantize(256, method=Image.Quantize.FASTOCTREE)
im.save(sys.argv[2], optimize=True)
print(sys.argv[2], im.size)

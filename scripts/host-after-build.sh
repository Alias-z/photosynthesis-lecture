#!/bin/sh
# After `vite build`: the hosted copy (lecture day). The site's root opens the deck (pilot.html), not the old lecture page,
# and the picks and freezes are baked in as static files, so the copy shows the picked variants.
set -e
cd "$(dirname "$0")/.."
cat > dist/index.html <<'HTML'
<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Photosynthesis</title>
<meta http-equiv="refresh" content="0; url=pilot.html">
<script>location.replace('pilot.html' + location.search + location.hash)</script></head>
<body><a href="pilot.html">Open the slides</a></body></html>
HTML
cp research/figure-briefs/picks.json dist/__picks
python3 -c "import json;s=json.load(open('research/figure-briefs/status.json'));json.dump({'frozen':s.get('frozen',{}),'building':{}},open('dist/__status','w'))"

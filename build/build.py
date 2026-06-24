#!/usr/bin/env python3
"""Assemble the Gettysburg Field Companion PWA (index.html) + copy PWA assets."""
import json, base64, os, sys, shutil

B = os.path.dirname(os.path.abspath(__file__))                 # pwa/build
PWA = os.path.dirname(B)                                        # pwa
ROOT = os.path.dirname(PWA)                                     # project root
OUT = os.path.join(PWA, "index.html")

manifest = json.load(open(os.path.join(ROOT, "research", "images.json")))
# embed: portraits (confederate/union) + photos + the contour base map; skip the period sheet maps
USE = {"confederate", "union", "photo"}
assets, meta = {}, {}
for r in manifest:
    k, cat = r["key"], r["cat"]
    if not (cat in USE or k == "field_base"):
        continue
    p = os.path.join(ROOT, "assets-src", k + ".jpg")
    if not os.path.exists(p):
        print("  skip (no file):", k); continue
    b64 = base64.b64encode(open(p, "rb").read()).decode("ascii")
    assets[k] = "data:image/jpeg;base64," + b64
    meta[k] = {"title": r["title"], "license": r["license"]}

assets_js = "window.GBASSETS=" + json.dumps(assets) + ";\nwindow.__IMGMETA=" + json.dumps(meta) + ";"

tpl  = open(os.path.join(B, "app.html"), encoding="utf-8").read()
data = open(os.path.join(B, "stands.js"), encoding="utf-8").read()
eng  = open(os.path.join(B, "mobile.js"), encoding="utf-8").read()

def put(t, m, p):
    if m not in t: print("ERROR marker missing:", m); sys.exit(1)
    return t.replace(m, p, 1)

html = put(tpl, "/*__ASSETS__*/", assets_js)
html = put(html, "/*__DATA__*/", data)
html = put(html, "/*__ENGINE__*/", eng)
open(OUT, "w", encoding="utf-8").write(html)

# copy static PWA files alongside index.html
for f in ["manifest.webmanifest", "sw.js", "icon-192.png", "icon-512.png", "icon-512-maskable.png"]:
    src = os.path.join(B, f)
    if os.path.exists(src):
        shutil.copy(src, os.path.join(PWA, f))
    else:
        print("  (icon not generated yet:", f, ")")

print("Embedded images:", len(assets))
print("Output:", OUT, "%.1f MB" % (os.path.getsize(OUT) / 1048576))

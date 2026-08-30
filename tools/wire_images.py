#!/usr/bin/env python3
"""
Point index.html at real photographs.

Every image slot ships as a generated .svg. Drop a raster file with the same base
name into assets/img/ (.png, .jpg, .jpeg or .webp) and run this — it rewrites the
matching src, and the og:image tag when the hero changes. Slots with no raster are
left on their .svg, so a partial set is fine.

    python3 tools/wire_images.py            # wire whatever is present
    python3 tools/wire_images.py --status   # report only, change nothing
    python3 tools/wire_images.py --revert   # go back to the .svg artwork

Layout needs no changes: every image is placed with object-fit: cover, so only the
aspect ratio matters.

Afterwards, update the alt text by hand. It currently describes the vector scene,
and alt text has to describe the image that is actually there.
"""

import glob
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HTML = os.path.join(ROOT, "index.html")
IMG = os.path.join(ROOT, "assets", "img")
EXTS = (".png", ".jpg", ".jpeg", ".webp")

SLOTS = [
    "hero-refinery",
    "sector-minerals", "sector-agro", "sector-logistics",
    "news-mining", "news-boardroom", "news-product", "news-legal",
    "loc-chennai", "loc-nellore", "loc-singapore", "loc-morocco",
    "leader-shivprasad", "leader-veeravikram", "leader-ravikumar",
    "leader-priyarao", "leader-anburaj",
]


def raster_for(slot):
    for ext in EXTS:
        p = os.path.join(IMG, slot + ext)
        if os.path.exists(p):
            return slot + ext
    return None


def main():
    args = sys.argv[1:]
    html = open(HTML, encoding="utf-8").read()

    if "--revert" in args:
        n = 0
        for slot in SLOTS:
            for ext in EXTS:
                before = html
                html = html.replace("/assets/img/%s%s" % (slot, ext),
                                    "/assets/img/%s.svg" % slot)
                n += before != html
        open(HTML, "w", encoding="utf-8").write(html)
        print("reverted %d reference(s) to .svg" % n)
        return

    wired, waiting = [], []
    for slot in SLOTS:
        found = raster_for(slot)
        if not found:
            waiting.append(slot)
            continue
        wired.append(found)
        if "--status" not in args:
            # from the .svg, or from a previously wired raster of another type
            html = html.replace("/assets/img/%s.svg" % slot, "/assets/img/%s" % found)
            for ext in EXTS:
                if slot + ext != found:
                    html = html.replace("/assets/img/%s%s" % (slot, ext),
                                        "/assets/img/%s" % found)

    if "--status" in args:
        print("wired / available:")
        for w in wired:
            print("  ✓", w)
        print("still on generated .svg:")
        for w in waiting:
            print("  ·", w)
        return

    open(HTML, "w", encoding="utf-8").write(html)
    print("wired %d photograph(s); %d slot(s) still on .svg"
          % (len(wired), len(waiting)))
    if wired:
        print("\nNow update the alt text for:", ", ".join(wired))
        print("Then re-check:  npx html-validate index.html "
              "&& node tools/test-a11y.js")


if __name__ == "__main__":
    main()

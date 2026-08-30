#!/usr/bin/env python3
"""
Generate the site's photography with the Gemini API.

This replaces the procedural vector scenes in assets/img/ with real generated
images, using the same prompts recorded in README.md.

    export GEMINI_API_KEY=...
    python3 tools/generate_images_gemini.py                 # generate all
    python3 tools/generate_images_gemini.py hero sector     # only matching keys
    python3 tools/generate_images_gemini.py --list-models   # what the key can use
    python3 tools/generate_images_gemini.py --wire          # point index.html at them

Output goes to assets/img/<name>.png, alongside the .svg it replaces, so
nothing is destroyed until --wire rewrites the markup.

Note on the board portraits: they are deliberately NOT generated here. The five
directors are real, named people, and putting synthetic photorealistic
"headshots" of identifiable individuals on a public investor page would be
misrepresentation. Commission real photographs or keep the monogram tiles.
"""

import base64
import json
import os
import sys
import time
import urllib.error
import urllib.request

API = "https://generativelanguage.googleapis.com/v1beta"
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "assets", "img")

STYLE = (
    "Professional corporate photography for an industrial commodities company. "
    "High contrast, desaturated colour grading with warm highlights, no text, "
    "no logos, no watermarks, no people's faces in focus. "
)

# name -> (aspect ratio, prompt)
PROMPTS = {
    "hero-refinery": ("16:9",
        "Cinematic wide-angle photograph of an industrial oil refinery at golden hour, "
        "massive steel distillation columns and pipework silhouetted against a dramatic "
        "orange and purple sunset sky, foreground shows refined copper cathode sheets "
        "with metallic sheen, middle ground features shipping containers at a port "
        "terminal, atmospheric industrial haze, shot on medium format camera, "
        "photorealistic, ultra detailed"),
    "sector-minerals": ("4:5",
        "Close-up macro photograph of raw barite mineral crystals with metallic copper "
        "cathode sheets in the background, industrial mining facility blurred in the "
        "distance, dramatic side lighting creating strong shadows, earth tones with "
        "copper accents, shallow depth of field, photorealistic"),
    "sector-agro": ("4:5",
        "Industrial refinery interior showing golden refined edible oil flowing through "
        "stainless steel processing equipment, modern manufacturing facility with clean "
        "lines, warm amber lighting, steam rising, high detail, photorealistic"),
    "sector-logistics": ("4:5",
        "Aerial view of Singapore port at dusk, massive container ships docked, "
        "organised shipping containers in vibrant colours, city skyline in the "
        "background with a purple-orange sunset, drone photography, cinematic colour "
        "grading, photorealistic"),
    "news-mining": ("3:2",
        "Mining excavation site in Morocco, large earth-moving equipment, desert "
        "landscape, blue sky, workers in safety gear seen at a distance, wide angle, "
        "photojournalism style"),
    "news-boardroom": ("16:10",
        "Corporate office meeting room with financial documents and printed charts on "
        "the table, modern interior, natural light, no people"),
    "news-product": ("16:10",
        "Product packaging mockup for an edible oil brand, unbranded bottle, clean "
        "modern design, studio photography on a neutral backdrop"),
    "news-legal": ("16:10",
        "Legal documents with official embossed seals on a desk, business photography, "
        "shallow depth of field"),
    "loc-chennai": ("3:2",
        "Modern corporate office building exterior in Chennai, glass facade, "
        "architectural photography, daytime, clear sky"),
    "loc-nellore": ("3:2",
        "Industrial edible-oil refinery facility exterior, large storage tanks, "
        "processing units, industrial photography, daytime"),
    "loc-singapore": ("3:2",
        "Modern office towers in the Singapore financial district near Marina Bay, "
        "architectural photography, blue hour"),
    "loc-morocco": ("3:2",
        "Mining facility near Agadir, Morocco, desert landscape, industrial equipment "
        "and conveyors, wide angle photography"),
}


def _req(url, payload=None, method="GET"):
    data = json.dumps(payload).encode() if payload is not None else None
    req = urllib.request.Request(
        url, data=data, method=method,
        headers={"Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=180) as r:
            return json.load(r)
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", "replace")[:600]
        raise SystemExit("HTTP %s from %s\n%s" % (e.code, url.split("?")[0], body))


def list_models(key):
    out = _req("%s/models?key=%s&pageSize=200" % (API, key))
    rows = []
    for m in out.get("models", []):
        name = m.get("name", "").replace("models/", "")
        methods = m.get("supportedGenerationMethods", [])
        if "image" in name.lower() or "imagen" in name.lower() or "predict" in methods:
            rows.append((name, ",".join(methods)))
    return rows


def pick_model(key, override):
    if override:
        return override
    names = [n for n, _ in list_models(key)]
    # newest-first preference; falls back to whatever the key actually exposes
    for want in ("gemini-3-pro-image-preview", "gemini-2.5-flash-image",
                 "gemini-2.0-flash-preview-image-generation",
                 "imagen-4.0-generate-001", "imagen-3.0-generate-002"):
        for n in names:
            if n.startswith(want):
                return n
    if names:
        return names[0]
    raise SystemExit(
        "No image-capable model available to this key.\n"
        "Run with --list-models to see what it can reach.")


def gen_imagen(key, model, prompt, aspect):
    out = _req("%s/models/%s:predict?key=%s" % (API, model, key), {
        "instances": [{"prompt": STYLE + prompt}],
        "parameters": {"sampleCount": 1, "aspectRatio": aspect,
                       "personGeneration": "allow_adult"},
    }, "POST")
    preds = out.get("predictions") or []
    if not preds:
        raise SystemExit("no image returned: " + json.dumps(out)[:400])
    return base64.b64decode(preds[0]["bytesBase64Encoded"])


def gen_gemini(key, model, prompt, aspect):
    body = {
        "contents": [{"parts": [{"text": STYLE + prompt +
                                 ". Aspect ratio %s." % aspect}]}],
        "generationConfig": {"responseModalities": ["IMAGE"],
                             "imageConfig": {"aspectRatio": aspect}},
    }
    try:
        out = _req("%s/models/%s:generateContent?key=%s" % (API, model, key), body, "POST")
    except SystemExit:
        # older revisions reject imageConfig / IMAGE-only modalities
        body["generationConfig"] = {"responseModalities": ["TEXT", "IMAGE"]}
        out = _req("%s/models/%s:generateContent?key=%s" % (API, model, key), body, "POST")
    for cand in out.get("candidates", []):
        for part in cand.get("content", {}).get("parts", []):
            blob = part.get("inlineData") or part.get("inline_data")
            if blob and blob.get("data"):
                return base64.b64decode(blob["data"])
    raise SystemExit("no image in response: " + json.dumps(out)[:400])


def wire():
    """Point index.html at any generated .png that now exists."""
    path = os.path.join(ROOT, "index.html")
    html = open(path, encoding="utf-8").read()
    n = 0
    for name in PROMPTS:
        if os.path.exists(os.path.join(OUT, name + ".png")):
            before = html
            html = html.replace("/assets/img/%s.svg" % name, "/assets/img/%s.png" % name)
            n += before != html
    open(path, "w", encoding="utf-8").write(html)
    print("wired %d image reference(s) to .png" % n)


def main():
    args = [a for a in sys.argv[1:]]
    key = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")

    if "--wire" in args:
        return wire()
    if not key:
        raise SystemExit("Set GEMINI_API_KEY (or GOOGLE_API_KEY) first.")
    if "--list-models" in args:
        for n, m in list_models(key):
            print("%-46s %s" % (n, m))
        return

    model = None
    if "--model" in args:
        model = args[args.index("--model") + 1]
        args = [a for a in args if a != model and a != "--model"]
    model = pick_model(key, model)
    print("model:", model)

    filters = [a for a in args if not a.startswith("-")]
    targets = {k: v for k, v in PROMPTS.items()
               if not filters or any(f in k for f in filters)}
    os.makedirs(OUT, exist_ok=True)

    gen = gen_imagen if "imagen" in model else gen_gemini
    for i, (name, (aspect, prompt)) in enumerate(sorted(targets.items()), 1):
        dest = os.path.join(OUT, name + ".png")
        print("[%d/%d] %s (%s) ..." % (i, len(targets), name, aspect), end=" ", flush=True)
        data = gen(key, model, prompt, aspect)
        with open(dest, "wb") as fh:
            fh.write(data)
        print("%d KB" % (len(data) // 1024))
        time.sleep(1)

    print("\nDone. Review assets/img/*.png, then run:")
    print("  python3 tools/generate_images_gemini.py --wire")


if __name__ == "__main__":
    main()

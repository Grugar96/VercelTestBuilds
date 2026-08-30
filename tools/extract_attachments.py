#!/usr/bin/env python3
"""
Pull images the user attached in the chat out of the session transcript.

The sandbox's egress proxy blocks the OpenArt CDN, so generated images arrive as
chat attachments instead of downloads. They are not written to disk anywhere, but
they are embedded in the session JSONL, so they can be recovered from there.

    python3 tools/extract_attachments.py            # list what is available
    python3 tools/extract_attachments.py --stage    # write them to a staging dir
    python3 tools/extract_attachments.py --install N=slot [N=slot ...]

`--install` copies staged image N to assets/img/<slot> with the right extension,
e.g. `--install 3=hero-refinery 4=sector-minerals`. Screenshots taken by the
tooling itself are skipped; only user-supplied attachments are listed.

Always eyeball an image before installing it — index order is arrival order, and
putting the wrong photograph against a named director would be a real error.
"""

import base64
import glob
import json
import os
import shutil
import struct
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG = os.path.join(ROOT, "assets", "img")
STAGE = os.path.join(ROOT, ".attachments")
TRANSCRIPT_GLOB = "/root/.claude/projects/*/*.jsonl"


def sniff_ext(b):
    """Trust the bytes, not the declared media type — the transcript reports
    WebP attachments as image/jpeg."""
    if b[:8] == b"\x89PNG\r\n\x1a\n":
        return "png"
    if b[:4] == b"RIFF" and b[8:12] == b"WEBP":
        return "webp"
    if b[:2] == b"\xff\xd8":
        return "jpg"
    if b[:6] in (b"GIF87a", b"GIF89a"):
        return "gif"
    return "bin"


def dims(b):
    if b[:4] == b"RIFF" and b[8:12] == b"WEBP":
        c = b[12:16]
        if c == b"VP8X":
            w = int.from_bytes(b[24:27], "little") + 1
            h = int.from_bytes(b[27:30], "little") + 1
            return (w, h)
        if c == b"VP8 ":
            return (int.from_bytes(b[26:28], "little") & 0x3FFF,
                    int.from_bytes(b[28:30], "little") & 0x3FFF)
        if c == b"VP8L":
            n = int.from_bytes(b[21:25], "little")
            return ((n & 0x3FFF) + 1, ((n >> 14) & 0x3FFF) + 1)
        return None
    if b[:8] == b"\x89PNG\r\n\x1a\n" and b[12:16] == b"IHDR":
        return struct.unpack(">II", b[16:24])
    if b[:2] == b"\xff\xd8":
        i = 2
        while i < len(b) - 9:
            if b[i] != 0xFF:
                i += 1
                continue
            m = b[i + 1]
            if m in (0xC0, 0xC1, 0xC2, 0xC3, 0xC5, 0xC6, 0xC7,
                     0xC9, 0xCA, 0xCB, 0xCD, 0xCE, 0xCF):
                h, w = struct.unpack(">HH", b[i + 5:i + 9])
                return (w, h)
            if m in (0xD8, 0xD9) or 0xD0 <= m <= 0xD7:
                i += 2
                continue
            seg = struct.unpack(">H", b[i + 2:i + 4])[0]
            i += 2 + seg
    return None


def collect():
    paths = sorted(glob.glob(TRANSCRIPT_GLOB), key=os.path.getmtime, reverse=True)
    if not paths:
        raise SystemExit("no session transcript found")

    found = []

    def walk(o, in_tool_result):
        if isinstance(o, dict):
            if o.get("type") == "image" and o.get("source", {}).get("data"):
                if not in_tool_result:
                    found.append(o["source"])
            tr = in_tool_result or o.get("type") == "tool_result"
            for v in o.values():
                walk(v, tr)
        elif isinstance(o, list):
            for v in o:
                walk(v, in_tool_result)

    for line in open(paths[0], encoding="utf-8"):
        try:
            walk(json.loads(line), False)
        except Exception:
            continue

    out, seen = [], set()
    for src in found:
        data = base64.b64decode(src["data"])
        h = hash(data)
        if h in seen:
            continue
        seen.add(h)
        out.append((data, sniff_ext(data)))
    return out


def main():
    args = sys.argv[1:]
    items = collect()

    installs = [a for a in args if "=" in a]
    if installs:
        if not os.path.isdir(STAGE):
            raise SystemExit("run --stage first")
        for spec in installs:
            idx, slot = spec.split("=", 1)
            matches = glob.glob(os.path.join(STAGE, "att%s.*" % idx))
            if not matches:
                print("no staged image %s" % idx)
                continue
            ext = os.path.splitext(matches[0])[1]
            dest = os.path.join(IMG, slot + ext)
            shutil.copy(matches[0], dest)
            print("installed att%s -> assets/img/%s%s" % (idx, slot, ext))
        print("\nNext: python3 tools/wire_images.py, then update the alt text.")
        return

    if "--stage" in args:
        os.makedirs(STAGE, exist_ok=True)
        for i, (data, ext) in enumerate(items):
            open(os.path.join(STAGE, "att%d.%s" % (i, ext)), "wb").write(data)

    for i, (data, ext) in enumerate(items):
        d = dims(data)
        shape = "?"
        if d:
            shape = "%dx%d %s" % (d[0], d[1],
                                  "landscape" if d[0] > d[1] * 1.1 else
                                  "portrait" if d[1] > d[0] * 1.1 else "square")
        print("%2d  %-4s %-22s %6d KB" % (i, ext, shape, len(data) // 1024))
    if "--stage" in args:
        print("\nstaged %d file(s) in %s" % (len(items), STAGE))


if __name__ == "__main__":
    main()

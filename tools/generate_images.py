#!/usr/bin/env python3
"""
Procedural artwork generator for the SPGCL website.

Every image slot on the site is rendered here as a layered, cinematic SVG
scene. The output is deliberately art-directed to the same brief as the
photography prompts documented in README.md, so each file can be swapped
one-for-one with a real photograph without touching the markup.

Usage:  python3 tools/generate_images.py
Output: assets/img/*.svg
"""

import math
import os
import random

OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "assets", "img")


# --------------------------------------------------------------------------
# colour helpers
# --------------------------------------------------------------------------

def _hex2rgb(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def _rgb2hex(rgb):
    return "#%02x%02x%02x" % tuple(max(0, min(255, int(round(c)))) for c in rgb)


def mix(a, b, t):
    """Blend two hex colours; t=0 returns a, t=1 returns b."""
    ra, rb = _hex2rgb(a), _hex2rgb(b)
    return _rgb2hex([ra[i] + (rb[i] - ra[i]) * t for i in range(3)])


def shade(c, t):
    """Darken (t<0) or lighten (t>0) a hex colour."""
    return mix(c, "#000000" if t < 0 else "#ffffff", abs(t))


# --------------------------------------------------------------------------
# document builder
# --------------------------------------------------------------------------

class Doc:
    def __init__(self, w, h):
        self.w, self.h = w, h
        self.defs, self.body, self._n = [], [], 0

    def uid(self, prefix="g"):
        self._n += 1
        return "%s%d" % (prefix, self._n)

    def add(self, markup):
        self.body.append(markup)

    # -- gradients ---------------------------------------------------------
    def lingrad(self, stops, x1=0, y1=0, x2=0, y2=1):
        gid = self.uid("lg")
        s = "".join(
            '<stop offset="%s" stop-color="%s" stop-opacity="%s"/>'
            % (o, c, a) for o, c, a in stops
        )
        self.defs.append(
            '<linearGradient id="%s" x1="%s" y1="%s" x2="%s" y2="%s">%s</linearGradient>'
            % (gid, x1, y1, x2, y2, s)
        )
        return gid

    def radgrad(self, stops, cx=0.5, cy=0.5, r=0.5):
        gid = self.uid("rg")
        s = "".join(
            '<stop offset="%s" stop-color="%s" stop-opacity="%s"/>'
            % (o, c, a) for o, c, a in stops
        )
        self.defs.append(
            '<radialGradient id="%s" cx="%s" cy="%s" r="%s">%s</radialGradient>'
            % (gid, cx, cy, r, s)
        )
        return gid

    def blur(self, amount):
        fid = self.uid("bl")
        self.defs.append(
            '<filter id="%s" x="-30%%" y="-30%%" width="160%%" height="160%%">'
            '<feGaussianBlur stdDeviation="%s"/></filter>' % (fid, amount)
        )
        return fid

    # -- scene primitives --------------------------------------------------
    def sky(self, stops):
        gid = self.lingrad(stops)
        self.add('<rect width="%d" height="%d" fill="url(#%s)"/>' % (self.w, self.h, gid))

    def glow(self, cx, cy, r, colour, opacity=0.85):
        gid = self.radgrad([("0", colour, opacity), ("0.55", colour, opacity * 0.35),
                            ("1", colour, "0")])
        self.add('<circle cx="%s" cy="%s" r="%s" fill="url(#%s)"/>' % (cx, cy, r, gid))

    def haze(self, y, h, colour, opacity=0.5):
        gid = self.lingrad([("0", colour, "0"), ("0.5", colour, str(opacity)),
                            ("1", colour, "0")])
        self.add('<rect x="0" y="%s" width="%d" height="%s" fill="url(#%s)"/>' % (y, self.w, h, gid))

    def vignette(self, strength=0.55):
        gid = self.radgrad([("0.45", "#000000", "0"), ("1", "#000000", str(strength))],
                           cx=0.5, cy=0.5, r=0.78)
        self.add('<rect width="%d" height="%d" fill="url(#%s)"/>' % (self.w, self.h, gid))

    def grain(self, opacity=0.14, freq=0.9):
        fid = self.uid("gr")
        self.defs.append(
            '<filter id="%s"><feTurbulence type="fractalNoise" baseFrequency="%s" '
            'numOctaves="3" stitchTiles="stitch"/>'
            '<feColorMatrix type="saturate" values="0"/></filter>' % (fid, freq)
        )
        self.add(
            '<rect width="%d" height="%d" filter="url(#%s)" opacity="%s" '
            'style="mix-blend-mode:overlay"/>' % (self.w, self.h, fid, opacity)
        )

    def render(self):
        return (
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 %d %d" '
            'width="%d" height="%d" preserveAspectRatio="xMidYMid slice">'
            "<defs>%s</defs>%s</svg>"
            % (self.w, self.h, self.w, self.h, "".join(self.defs), "".join(self.body))
        )


# --------------------------------------------------------------------------
# shape builders
# --------------------------------------------------------------------------

def ridge(w, ybase, amp, seed, n=7, floor=None):
    """Smooth rolling silhouette path (hills / dunes)."""
    rnd = random.Random(seed)
    pts = [(i * w / n, ybase + rnd.uniform(-amp, amp)) for i in range(n + 1)]
    floor = floor if floor is not None else ybase + amp * 6 + 400
    d = ["M %.1f %.1f" % (pts[0][0], pts[0][1])]
    for i in range(1, len(pts)):
        px, py = pts[i - 1]
        cx, cy = pts[i]
        mx, my = (px + cx) / 2.0, (py + cy) / 2.0
        d.append("Q %.1f %.1f %.1f %.1f" % (px, py, mx, my))
    d.append("L %.1f %.1f" % (pts[-1][0], pts[-1][1]))
    d.append("L %.1f %.1f L 0 %.1f Z" % (w, floor, floor))
    return " ".join(d)


def refinery(x0, x1, ybase, height, colour, seed, detail=True):
    """Distillation columns, stacks, lattice towers and pipe racks."""
    rnd = random.Random(seed)
    parts = ['<g fill="%s">' % colour]
    x = x0
    while x < x1:
        kind = rnd.random()
        if kind < 0.42:                                  # distillation column
            cw = rnd.uniform(height * 0.09, height * 0.17)
            ch = rnd.uniform(height * 0.45, height * 1.0)
            top = ybase - ch
            parts.append('<rect x="%.1f" y="%.1f" width="%.1f" height="%.1f" rx="%.1f"/>'
                         % (x, top, cw, ch, cw * 0.42))
            for b in range(int(ch // (height * 0.16))):
                by = top + ch * 0.18 + b * height * 0.16
                if by < ybase - 8:
                    parts.append('<rect x="%.1f" y="%.1f" width="%.1f" height="3"/>'
                                 % (x - cw * 0.14, by, cw * 1.28))
            x += cw + rnd.uniform(height * 0.05, height * 0.13)
        elif kind < 0.62:                                # slim chimney
            cw = rnd.uniform(height * 0.03, height * 0.055)
            ch = rnd.uniform(height * 0.85, height * 1.45)
            parts.append('<path d="M %.1f %.1f L %.1f %.1f L %.1f %.1f L %.1f %.1f Z"/>'
                         % (x, ybase, x + cw * 0.72, ybase - ch,
                            x + cw * 1.28, ybase - ch, x + cw * 2, ybase))
            x += cw * 2 + rnd.uniform(height * 0.06, height * 0.16)
        elif kind < 0.80:                                # lattice tower
            cw = rnd.uniform(height * 0.10, height * 0.16)
            ch = rnd.uniform(height * 0.55, height * 1.1)
            top = ybase - ch
            parts.append('<path d="M %.1f %.1f L %.1f %.1f L %.1f %.1f L %.1f %.1f Z" '
                         'opacity="0.92"/>'
                         % (x, ybase, x + cw * 0.28, top, x + cw * 0.72, top, x + cw, ybase))
            rows = max(3, int(ch // (height * 0.13)))
            for r in range(rows):
                t0, t1 = r / rows, (r + 1) / rows
                y0, y1 = ybase - ch * t0, ybase - ch * t1
                w0 = cw * (1 - 0.72 * t0) / 2.0
                w1 = cw * (1 - 0.72 * t1) / 2.0
                cxx = x + cw / 2.0
                parts.append('<path d="M %.1f %.1f L %.1f %.1f M %.1f %.1f L %.1f %.1f" '
                             'stroke="%s" stroke-width="2.4" fill="none"/>'
                             % (cxx - w0, y0, cxx + w1, y1, cxx + w0, y0, cxx - w1, y1, colour))
            x += cw + rnd.uniform(height * 0.05, height * 0.12)
        else:                                            # storage tank
            cw = rnd.uniform(height * 0.20, height * 0.32)
            ch = rnd.uniform(height * 0.20, height * 0.34)
            parts.append('<rect x="%.1f" y="%.1f" width="%.1f" height="%.1f" rx="4"/>'
                         % (x, ybase - ch, cw, ch))
            parts.append('<ellipse cx="%.1f" cy="%.1f" rx="%.1f" ry="%.1f"/>'
                         % (x + cw / 2, ybase - ch, cw / 2, cw * 0.10))
            x += cw + rnd.uniform(height * 0.04, height * 0.11)
    if detail:                                           # pipe rack along the base
        ry = ybase - height * 0.13
        parts.append('<rect x="%.1f" y="%.1f" width="%.1f" height="%.1f"/>'
                     % (x0, ry, x1 - x0, height * 0.045))
        for px in range(int(x0), int(x1), max(30, int(height * 0.14))):
            parts.append('<rect x="%d" y="%.1f" width="5" height="%.1f"/>'
                         % (px, ry, ybase - ry))
    parts.append('<rect x="%.1f" y="%.1f" width="%.1f" height="%.1f"/>'
                 % (x0 - 20, ybase - 4, (x1 - x0) + 40, 40))
    parts.append("</g>")
    return "".join(parts)


def containers(x, y, cols, rows, cw, ch, seed, palette, gap=3, opacity=1.0):
    """A stacked block of shipping containers."""
    rnd = random.Random(seed)
    out = ['<g opacity="%s">' % opacity]
    for r in range(rows):
        for c in range(cols):
            if rnd.random() < 0.12:
                continue
            col = rnd.choice(palette)
            out.append('<rect x="%.1f" y="%.1f" width="%.1f" height="%.1f" fill="%s"/>'
                       % (x + c * (cw + gap), y - (r + 1) * (ch + gap), cw, ch, col))
    out.append("</g>")
    return "".join(out)


def crane(x, ybase, h, colour, flip=False):
    """Port gantry crane silhouette."""
    w = h * 0.82
    legs = h * 0.62
    s = ['<g fill="%s" stroke="%s" stroke-width="4">' % (colour, colour)]
    s.append('<path d="M %.1f %.1f L %.1f %.1f" />' % (x, ybase, x + w * 0.16, ybase - legs))
    s.append('<path d="M %.1f %.1f L %.1f %.1f" />' % (x + w * 0.42, ybase, x + w * 0.30, ybase - legs))
    s.append('<path d="M %.1f %.1f L %.1f %.1f" />' % (x + w * 0.72, ybase, x + w * 0.60, ybase - legs))
    s.append('<rect x="%.1f" y="%.1f" width="%.1f" height="%.1f"/>'
             % (x + w * 0.08, ybase - legs - h * 0.14, w * 0.62, h * 0.14))
    boom_x = x - w * 0.34 if flip else x + w * 0.04
    s.append('<rect x="%.1f" y="%.1f" width="%.1f" height="7"/>'
             % (boom_x, ybase - legs - h * 0.30, w * 1.14))
    s.append('<path d="M %.1f %.1f L %.1f %.1f" stroke-width="3"/>'
             % (x + w * 0.34, ybase - legs - h * 0.30, x + w * 0.34, ybase - legs - h * 0.14))
    s.append("</g>")
    return "".join(s)


def skyline(x0, x1, ybase, h, colour, seed, lit="#f4c98a", lit_op=0.55):
    """City towers with lit windows."""
    rnd = random.Random(seed)
    out = ['<g>']
    x = x0
    while x < x1:
        bw = rnd.uniform(h * 0.10, h * 0.26)
        bh = rnd.uniform(h * 0.35, h * 1.0)
        out.append('<rect x="%.1f" y="%.1f" width="%.1f" height="%.1f" fill="%s"/>'
                   % (x, ybase - bh, bw, bh, colour))
        cols = max(1, int(bw // 11))
        rows = max(1, int(bh // 15))
        for c in range(cols):
            for r in range(rows):
                if rnd.random() < 0.42:
                    out.append('<rect x="%.1f" y="%.1f" width="4" height="5.5" fill="%s" '
                               'opacity="%.2f"/>'
                               % (x + 5 + c * 11, ybase - bh + 8 + r * 15, lit,
                                  lit_op * rnd.uniform(0.45, 1.0)))
        x += bw + rnd.uniform(4, h * 0.05)
    out.append("</g>")
    return "".join(out)


def tanks(x0, x1, ybase, h, colour, seed, rim=None):
    """Row of bulk storage tanks."""
    rnd = random.Random(seed)
    out = ['<g>']
    x = x0
    while x < x1:
        tw = rnd.uniform(h * 0.55, h * 1.05)
        th = rnd.uniform(h * 0.5, h * 0.85)
        out.append('<rect x="%.1f" y="%.1f" width="%.1f" height="%.1f" fill="%s"/>'
                   % (x, ybase - th, tw, th, colour))
        out.append('<ellipse cx="%.1f" cy="%.1f" rx="%.1f" ry="%.1f" fill="%s"/>'
                   % (x + tw / 2, ybase - th, tw / 2, tw * 0.09, shade(colour, 0.10)))
        if rim:
            out.append('<rect x="%.1f" y="%.1f" width="3" height="%.1f" fill="%s" opacity="0.7"/>'
                       % (x + tw - 3, ybase - th, th, rim))
        x += tw + rnd.uniform(h * 0.12, h * 0.3)
    out.append("</g>")
    return "".join(out)


# --------------------------------------------------------------------------
# scenes
# --------------------------------------------------------------------------

def hero_refinery():
    """Refinery at golden hour, port terminal beyond, copper plates in foreground."""
    d = Doc(1920, 1080)
    d.sky([("0", "#140f26", "1"), ("0.34", "#33203f", "1"), ("0.58", "#6d3a3c", "1"),
           ("0.78", "#b0562a", "1"), ("0.92", "#e08a3c", "1"), ("1", "#f0a94f", "1")])
    d.glow(1240, 742, 430, "#ffcf87", 0.95)
    d.glow(1240, 742, 170, "#fff2d6", 0.9)

    horizon = 742
    d.add('<path d="%s" fill="%s" opacity="0.85"/>'
          % (ridge(1920, horizon - 26, 20, 11, 6, floor=1080), mix("#6d3a3c", "#e08a3c", 0.42)))
    d.add(skyline(1380, 1960, horizon, 190, mix("#33203f", "#b0562a", 0.55), 21,
                  lit="#ffd9a0", lit_op=0.4))
    d.haze(horizon - 120, 190, "#f0a94f", 0.34)

    # mid-ground refinery
    d.add(refinery(70, 1180, horizon + 14, 300, mix("#1A1A1A", "#6d3a3c", 0.42), 5))
    # flare stack
    d.add('<path d="M 1120 462 q 16 -34 4 -70 q 26 26 20 70 Z" fill="#ffb763" opacity="0.9"/>')
    d.glow(1128, 452, 96, "#ff9a3c", 0.5)

    # port terminal
    d.add(containers(1290, horizon + 30, 16, 5, 30, 15, 31,
                     [mix("#2C3E50", "#B87333", 0.3), "#8a4a2c", "#3a4a5c", "#6B4423"], opacity=0.9))
    d.add(crane(1500, horizon + 30, 210, mix("#1A1A1A", "#33203f", 0.35)))
    d.add(crane(1720, horizon + 30, 190, mix("#1A1A1A", "#33203f", 0.28)))

    d.haze(horizon - 40, 200, "#e08a3c", 0.2)

    # foreground refinery silhouette (darkest layer)
    d.add(refinery(-40, 620, 980, 250, "#0d0b12", 9))
    d.add(containers(760, 1000, 12, 3, 44, 22, 77, ["#141018", "#191320", "#0f0c14"]))

    # copper cathode plates, foreground right
    cop = d.lingrad([("0", "#d98f4f", "1"), ("0.45", "#B87333", "1"), ("1", "#5e3a1c", "1")],
                    x1=0, y1=0, x2=1, y2=1)
    plates = ['<g opacity="0.92">']
    for i in range(5):
        px, py = 1180 + i * 128, 1016 - i * 20
        plates.append('<path d="M %d %d l 250 -66 l 76 30 l -250 66 Z" fill="url(#%s)"/>'
                      % (px, py, cop))
        plates.append('<path d="M %d %d l 250 -66" stroke="#f0b877" stroke-width="2.5" '
                      'fill="none" opacity="0.65"/>' % (px, py))
    plates.append("</g>")
    d.add("".join(plates))

    d.vignette(0.62)
    d.grain(0.13)
    return d.render()


def sector_minerals():
    """Macro barite crystal facets against copper cathode."""
    d = Doc(800, 1000)
    d.sky([("0", "#241a12", "1"), ("0.5", "#3a2a1c", "1"), ("1", "#160f0a", "1")])
    d.glow(600, 210, 460, "#c98a4e", 0.5)

    # copper sheets behind
    cop = d.lingrad([("0", "#c98352", "1"), ("1", "#5c3819", "1")], x1=0, y1=0, x2=1, y2=1)
    for i in range(4):
        d.add('<path d="M %d %d l 330 -86 l 60 26 l -330 86 Z" fill="url(#%s)" opacity="0.5"/>'
              % (250 + i * 60, 300 + i * 74, cop))

    # crystal cluster
    rnd = random.Random(3)
    cx, cy = 400, 620
    facets = ['<g>']
    for i in range(16):
        a = i / 16.0 * math.tau + rnd.uniform(-0.12, 0.12)
        r1 = rnd.uniform(150, 300)
        r2 = r1 * rnd.uniform(0.5, 0.78)
        a2 = a + rnd.uniform(0.28, 0.52)
        t = rnd.uniform(0, 1)
        col = mix("#8c6b4a", "#efd9bd", t * 0.85)
        facets.append(
            '<path d="M %.1f %.1f L %.1f %.1f L %.1f %.1f Z" fill="%s" opacity="%.2f"/>'
            % (cx, cy, cx + math.cos(a) * r1, cy + math.sin(a) * r1 * 0.86,
               cx + math.cos(a2) * r2, cy + math.sin(a2) * r2 * 0.86, col,
               rnd.uniform(0.55, 0.95))
        )
    facets.append("</g>")
    d.add("".join(facets))

    # rim light
    d.add('<path d="M 400 620 L 250 380 L 470 330 Z" fill="#f6e6cd" opacity="0.45"/>')
    d.glow(300, 380, 190, "#ffe9c8", 0.35)

    d.haze(0, 260, "#1a120c", 0.55)
    d.vignette(0.6)
    d.grain(0.15)
    return d.render()


def sector_agro():
    """Refinery interior, golden rice-bran oil through steel plant."""
    d = Doc(800, 1000)
    d.sky([("0", "#2a1c0d", "1"), ("0.45", "#5c3d16", "1"), ("1", "#1a1207", "1")])
    d.glow(400, 300, 430, "#ffc061", 0.55)

    steel = d.lingrad([("0", "#8b93a0", "1"), ("0.4", "#4e5765", "1"), ("1", "#232a34", "1")],
                      x1=0, y1=0, x2=1, y2=0)
    for i, x in enumerate((70, 250, 470, 650)):
        h = 640 + (i % 2) * 90
        d.add('<rect x="%d" y="%d" width="96" height="%d" rx="14" fill="url(#%s)" opacity="0.9"/>'
              % (x, 1000 - h, h, steel))
        d.add('<ellipse cx="%d" cy="%d" rx="48" ry="12" fill="#9aa3b0" opacity="0.8"/>'
              % (x + 48, 1000 - h))
        for b in range(4):
            d.add('<rect x="%d" y="%d" width="120" height="7" fill="#39414d" opacity="0.85"/>'
                  % (x - 12, 1000 - h + 110 + b * 130))

    # oil flow
    oil = d.lingrad([("0", "#ffd98a", "1"), ("0.5", "#e8a13a", "1"), ("1", "#a35f14", "1")])
    d.add('<path d="M 120 250 C 300 380 500 300 720 430 L 720 560 C 500 430 300 510 120 380 Z" '
          'fill="url(#%s)" opacity="0.92"/>' % oil)
    d.add('<path d="M 120 262 C 300 392 500 312 720 442" stroke="#fff0c8" stroke-width="5" '
          'fill="none" opacity="0.6"/>')
    d.glow(420, 360, 300, "#ffbe5c", 0.45)

    # steam
    for i, (sx, sy, sr) in enumerate(((220, 190, 120), (520, 140, 150), (680, 250, 110))):
        d.glow(sx, sy, sr, "#ffe9c0", 0.22)

    d.haze(700, 300, "#1a1207", 0.65)
    d.vignette(0.58)
    d.grain(0.14)
    return d.render()


def sector_logistics():
    """Aerial container port at dusk."""
    d = Doc(800, 1000)
    d.sky([("0", "#1a1235", "1"), ("0.28", "#3d2350", "1"), ("0.5", "#8a3f56", "1"),
           ("0.64", "#d4713f", "1"), ("1", "#10203a", "1")])
    d.glow(560, 470, 260, "#ffc684", 0.8)

    horizon = 470
    d.add(skyline(0, 820, horizon, 170, mix("#1a1235", "#8a3f56", 0.5), 13,
                  lit="#ffd39a", lit_op=0.5))
    d.haze(horizon - 60, 130, "#d4713f", 0.3)

    # water
    d.add('<rect x="0" y="%d" width="800" height="%d" fill="#0f1c30" opacity="0.9"/>'
          % (horizon, 1000 - horizon))
    wat = d.lingrad([("0", "#ffb367", "0.5"), ("1", "#ffb367", "0")])
    d.add('<rect x="480" y="%d" width="180" height="150" fill="url(#%s)"/>' % (horizon, wat))

    # ships
    for (sx, sy, sw) in ((40, 560, 300), (430, 620, 340)):
        d.add('<path d="M %d %d l %d 0 l -26 44 l -%d 0 Z" fill="#151d2b"/>'
              % (sx, sy, sw, sw - 52))
        d.add(containers(sx + 26, sy, int(sw // 34), 3, 28, 14, sx,
                         ["#c0563a", "#2f6f8f", "#d8973c", "#3f7d5a", "#8a4a6b"]))

    # quay + yard
    d.add('<rect x="0" y="740" width="800" height="260" fill="#161d29"/>')
    d.add(containers(20, 950, 20, 6, 34, 17, 99,
                     ["#c0563a", "#2f6f8f", "#d8973c", "#3f7d5a", "#8a4a6b", "#b8763a"]))
    d.add(crane(120, 745, 200, "#0e131c"))
    d.add(crane(430, 745, 210, "#0e131c"))
    d.add(crane(640, 745, 190, "#0e131c"))

    d.vignette(0.55)
    d.grain(0.13)
    return d.render()


def news_mining():
    """Morocco open-pit mining site under a hard blue sky."""
    d = Doc(1200, 800)
    d.sky([("0", "#2a63a8", "1"), ("0.45", "#7fb2dc", "1"), ("1", "#e2d3b4", "1")])
    d.glow(940, 150, 300, "#fff6de", 0.6)

    d.add('<path d="%s" fill="#b99a6d" opacity="0.75"/>' % ridge(1200, 400, 34, 4, 6, floor=800))
    d.add('<path d="%s" fill="#9c7d54"/>' % ridge(1200, 470, 26, 8, 7, floor=800))

    # terraced pit
    for i in range(5):
        y = 540 + i * 52
        d.add('<path d="M %d %d L %d %d L %d %d L %d %d Z" fill="%s"/>'
              % (120 + i * 62, y, 1080 - i * 62, y, 1040 - i * 62, y + 52, 160 + i * 62, y + 52,
                 mix("#8a6a44", "#4a3722", i / 5.0)))
    # excavator
    d.add('<g fill="#3a2c1c">'
          '<rect x="470" y="560" width="120" height="46" rx="6"/>'
          '<rect x="486" y="530" width="62" height="34" rx="5"/>'
          '<path d="M 588 546 L 700 486 L 712 502 L 604 566 Z"/>'
          '<path d="M 700 486 l 40 30 l -22 26 l -34 -26 Z"/>'
          '<rect x="462" y="602" width="136" height="16" rx="8"/></g>')
    # haul truck
    d.add('<g fill="#4a3826"><rect x="800" y="596" width="150" height="42" rx="5"/>'
          '<path d="M 800 596 l 22 -34 l 96 0 l 16 34 Z"/>'
          '<circle cx="836" cy="646" r="17"/><circle cx="916" cy="646" r="17"/></g>')

    d.haze(340, 160, "#e2d3b4", 0.28)
    d.vignette(0.4)
    d.grain(0.12)
    return d.render()


def news_boardroom():
    d = Doc(800, 500)
    d.sky([("0", "#f3f0ea", "1"), ("1", "#d9d4cb", "1")])
    d.add('<rect x="470" y="0" width="330" height="500" fill="#eaf1f7"/>')
    d.glow(640, 120, 260, "#ffffff", 0.9)
    d.add('<rect x="470" y="0" width="8" height="500" fill="#c2ccd6"/>')
    d.add('<rect x="0" y="330" width="800" height="170" fill="#3a3129"/>')
    d.add('<rect x="0" y="326" width="800" height="10" fill="#544838"/>')
    # documents
    for i, (x, y, r) in enumerate(((60, 300, -6), (210, 312, 3), (340, 296, -2))):
        d.add('<g transform="translate(%d %d) rotate(%d)">'
              '<rect width="150" height="106" rx="3" fill="#ffffff" opacity="0.97"/>'
              % (x, y, r))
        for L in range(5):
            d.add('<rect x="14" y="%d" width="%d" height="5" fill="#b9bec6"/>'
                  % (18 + L * 15, 60 + (L * 27) % 100))
        d.add("</g>")
    # chart
    d.add('<rect x="80" y="90" width="300" height="190" rx="6" fill="#ffffff" opacity="0.95"/>')
    for i, hgt in enumerate((52, 88, 66, 120, 148)):
        d.add('<rect x="%d" y="%d" width="34" height="%d" fill="%s"/>'
              % (104 + i * 54, 258 - hgt, hgt, mix("#B87333", "#34495E", i / 5.0)))
    d.vignette(0.32)
    d.grain(0.1)
    return d.render()


def news_product():
    d = Doc(800, 500)
    d.sky([("0", "#efe6d6", "1"), ("1", "#cfc0a6", "1")])
    d.glow(400, 120, 340, "#fffaf0", 0.85)
    d.add('<ellipse cx="400" cy="452" rx="250" ry="30" fill="#8a7a60" opacity="0.35"/>')
    body = d.lingrad([("0", "#ffd88a", "1"), ("0.45", "#e0a02f", "1"), ("1", "#96631a", "1")],
                     x1=0, y1=0, x2=1, y2=0)
    d.add('<rect x="318" y="150" width="164" height="300" rx="16" fill="url(#%s)"/>' % body)
    d.add('<rect x="356" y="98" width="88" height="62" rx="8" fill="url(#%s)"/>' % body)
    d.add('<rect x="350" y="80" width="100" height="30" rx="8" fill="#2f2a22"/>')
    d.add('<rect x="342" y="228" width="116" height="150" rx="6" fill="#fbf6ec" opacity="0.96"/>')
    d.add('<rect x="360" y="250" width="80" height="9" rx="4" fill="#B87333"/>')
    d.add('<rect x="356" y="272" width="88" height="6" rx="3" fill="#c3c8ce"/>')
    d.add('<rect x="366" y="288" width="68" height="6" rx="3" fill="#c3c8ce"/>')
    d.add('<rect x="330" y="150" width="18" height="300" rx="9" fill="#ffffff" opacity="0.26"/>')
    d.vignette(0.35)
    d.grain(0.1)
    return d.render()


def news_legal():
    d = Doc(800, 500)
    d.sky([("0", "#e9e4da", "1"), ("1", "#cbc3b5", "1")])
    d.glow(250, 90, 320, "#ffffff", 0.8)
    for i, (x, y, r) in enumerate(((120, 90, -4), (200, 130, 2))):
        d.add('<g transform="translate(%d %d) rotate(%d)">'
              '<rect width="420" height="330" rx="4" fill="#ffffff" opacity="0.98"/>' % (x, y, r))
        d.add('<rect x="34" y="34" width="200" height="12" rx="4" fill="#2C3E50"/>')
        for L in range(9):
            d.add('<rect x="34" y="%d" width="%d" height="6" rx="3" fill="#c4c9d0"/>'
                  % (74 + L * 24, 200 + (L * 41) % 150))
        d.add("</g>")
    d.add('<circle cx="600" cy="360" r="56" fill="#B87333" opacity="0.92"/>')
    d.add('<circle cx="600" cy="360" r="44" fill="none" stroke="#f0c79a" stroke-width="3"/>')
    d.add('<path d="M 600 330 l 9 20 l 22 3 l -16 15 l 4 22 l -19 -11 l -19 11 l 4 -22 '
          'l -16 -15 l 22 -3 Z" fill="#f5dcc0"/>')
    d.add('<path d="M 578 408 l -14 56 l 36 -20 l 36 20 l -14 -56 Z" fill="#9c5c26"/>')
    d.vignette(0.34)
    d.grain(0.1)
    return d.render()


def loc_chennai():
    d = Doc(1200, 800)
    d.sky([("0", "#2f7ec4", "1"), ("0.6", "#8dc0e4", "1"), ("1", "#dfeaf3", "1")])
    d.glow(300, 110, 320, "#ffffff", 0.7)
    d.add(skyline(0, 1200, 720, 300, "#b9c9d6", 6, lit="#ffffff", lit_op=0.3))
    # hero tower
    glass = d.lingrad([("0", "#dbeaf6", "1"), ("0.5", "#7fa8c6", "1"), ("1", "#3f6a8c", "1")],
                      x1=0, y1=0, x2=1, y2=0)
    d.add('<rect x="430" y="120" width="330" height="600" fill="url(#%s)"/>' % glass)
    for r in range(24):
        d.add('<rect x="430" y="%d" width="330" height="3" fill="#2f4f6b" opacity="0.45"/>'
              % (140 + r * 24))
    for c in range(9):
        d.add('<rect x="%d" y="120" width="3" height="600" fill="#2f4f6b" opacity="0.35"/>'
              % (452 + c * 36))
    d.add('<path d="M 430 120 L 760 120 L 760 300 L 430 420 Z" fill="#ffffff" opacity="0.22"/>')
    d.add('<rect x="0" y="716" width="1200" height="84" fill="#8d949c"/>')
    d.add('<rect x="0" y="716" width="1200" height="6" fill="#b6bcc2"/>')
    d.vignette(0.34)
    d.grain(0.1)
    return d.render()


def loc_nellore():
    d = Doc(1200, 800)
    d.sky([("0", "#3f6f9e", "1"), ("0.55", "#9db9cd", "1"), ("1", "#dfd6c2", "1")])
    d.glow(880, 150, 300, "#fff3d8", 0.6)
    d.add('<path d="%s" fill="#9aa79a" opacity="0.6"/>' % ridge(1200, 520, 18, 15, 6, floor=800))
    d.add(refinery(60, 640, 690, 250, "#59636e", 12))
    d.add(tanks(660, 1180, 690, 120, "#c8ccd1", 4, rim="#B87333"))
    d.add('<rect x="0" y="686" width="1200" height="114" fill="#7d7568"/>')
    d.add('<rect x="0" y="686" width="1200" height="6" fill="#9a9184"/>')
    d.haze(480, 200, "#dfd6c2", 0.3)
    d.vignette(0.36)
    d.grain(0.11)
    return d.render()


def loc_singapore():
    d = Doc(1200, 800)
    d.sky([("0", "#20314f", "1"), ("0.4", "#4a4a6f", "1"), ("0.72", "#b26a5c", "1"),
           ("1", "#e0a06a", "1")])
    d.glow(860, 520, 330, "#ffc98a", 0.7)
    d.add(skyline(0, 1200, 600, 400, "#2b3550", 17, lit="#ffe0a8", lit_op=0.75))
    # marina-style triple tower with sky deck
    for i in range(3):
        x = 700 + i * 118
        d.add('<rect x="%d" y="250" width="72" height="350" fill="#39445f"/>' % x)
        for r in range(18):
            d.add('<rect x="%d" y="%d" width="72" height="3" fill="#22293c" opacity="0.6"/>'
                  % (x, 268 + r * 18))
    d.add('<path d="M 686 250 L 966 226 L 966 258 L 686 282 Z" fill="#4a5673"/>')
    d.add('<rect x="0" y="600" width="1200" height="200" fill="#141c2c"/>')
    refl = d.lingrad([("0", "#ffbe7d", "0.45"), ("1", "#ffbe7d", "0")])
    d.add('<rect x="760" y="600" width="220" height="200" fill="url(#%s)"/>' % refl)
    d.vignette(0.45)
    d.grain(0.12)
    return d.render()


def loc_morocco():
    d = Doc(1200, 800)
    d.sky([("0", "#3d79b0", "1"), ("0.5", "#a8c4d8", "1"), ("1", "#e6d5b2", "1")])
    d.glow(300, 130, 300, "#fff8e6", 0.6)
    d.add('<path d="%s" fill="#c0a377" opacity="0.7"/>' % ridge(1200, 430, 40, 22, 5, floor=800))
    d.add('<path d="%s" fill="#a5875c"/>' % ridge(1200, 520, 24, 27, 6, floor=800))
    d.add(refinery(700, 1160, 660, 170, "#6d5f4c", 33, detail=False))
    d.add(tanks(120, 520, 660, 90, "#cfc4ae", 8, rim="#B87333"))
    # conveyor
    d.add('<path d="M 520 660 L 760 560 L 780 578 L 540 678 Z" fill="#5c5140"/>')
    for i in range(7):
        d.add('<rect x="%d" y="%d" width="6" height="%d" fill="#5c5140"/>'
              % (540 + i * 36, 600 + i * -2, 68 - i * 6))
    d.add('<rect x="0" y="654" width="1200" height="146" fill="#8a7454"/>')
    d.add('<path d="M 0 654 q 300 -18 600 4 q 300 22 600 -6 l 0 20 l -1200 0 Z" fill="#9a815e"/>')
    d.haze(400, 180, "#e6d5b2", 0.3)
    d.vignette(0.38)
    d.grain(0.11)
    return d.render()


def avatar(initials, seed):
    """Monogram portrait tile — used in place of photographs of real directors."""
    d = Doc(600, 600)
    # Matched to the #e0e0e0 studio backdrop of the real board headshots, so a
    # partly-photographed board still reads as one row rather than two styles.
    g = d.lingrad([("0", "#e8e8e8", "1"), ("1", "#d4d4d4", "1")], x1=0, y1=0, x2=1, y2=1)
    d.add('<rect width="600" height="600" fill="url(#%s)"/>' % g)
    d.glow(430, 150, 380, "#B87333", 0.10)
    for i in range(3):
        d.add('<circle cx="300" cy="330" r="%d" fill="none" stroke="#B87333" '
              'stroke-width="1.5" opacity="%.2f"/>' % (170 + i * 52, 0.20 - i * 0.05))
    d.add('<text x="300" y="318" font-family="Inter, Segoe UI, Helvetica, Arial, sans-serif" '
          'font-size="170" font-weight="600" fill="#2C3E50" text-anchor="middle" '
          'dominant-baseline="central" letter-spacing="6">%s</text>' % initials)
    d.add('<rect x="228" y="430" width="144" height="3" fill="#B87333" opacity="0.9"/>')
    d.grain(0.06)
    return d.render()


def pattern():
    """Tiling background motif: mineral facet, oil drop, container."""
    return (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" width="240" height="240">'
        '<g fill="none" stroke="#1A1A1A" stroke-width="1.6" opacity="0.5">'
        '<path d="M 40 34 L 66 22 L 84 42 L 68 66 L 40 62 Z"/>'
        '<path d="M 40 34 L 68 66 M 66 22 L 68 66"/>'
        '<path d="M 176 26 c 0 0 -20 24 -20 36 a 20 20 0 0 0 40 0 c 0 -12 -20 -36 -20 -36 Z"/>'
        '<rect x="30" y="150" width="72" height="40" rx="2"/>'
        '<path d="M 44 150 L 44 190 M 60 150 L 60 190 M 76 150 L 76 190 M 92 150 L 92 190"/>'
        '<path d="M 150 158 h 64 M 150 176 h 64 M 158 158 v 18 M 206 158 v 18"/>'
        '<circle cx="182" cy="196" r="4"/><circle cx="166" cy="196" r="4"/>'
        "</g></svg>"
    )


def logo():
    """SPGCL mark — gradient geo-facet + wordmark. Replace with the official asset."""
    return (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 242 64" width="242" height="64">'
        "<defs>"
        '<linearGradient id="spgcl" x1="0" y1="1" x2="1" y2="0">'
        '<stop offset="0" stop-color="#F29300"/>'
        '<stop offset="0.5" stop-color="#00A650"/>'
        '<stop offset="1" stop-color="#00BCD4"/>'
        "</linearGradient></defs>"
        '<g fill="url(#spgcl)">'
        '<path d="M 32 6 L 56 20 L 56 44 L 32 58 L 8 44 L 8 20 Z" opacity="0.18"/>'
        '<path d="M 32 14 L 49 24 L 49 40 L 32 50 L 15 40 L 15 24 Z" opacity="0.42"/>'
        '<path d="M 32 22 L 42 28 L 42 36 L 32 42 L 22 36 L 22 28 Z"/>'
        "</g>"
        '<text x="72" y="30" font-family="Inter, Segoe UI, Helvetica, Arial, sans-serif" '
        'font-size="23" font-weight="700" letter-spacing="1.5" fill="currentColor">SPGCL</text>'
        '<text x="73" y="47" font-family="Inter, Segoe UI, Helvetica, Arial, sans-serif" '
        'font-size="9.2" font-weight="500" letter-spacing="1.35" fill="currentColor" '
        'opacity="0.72">SRI PRIYANKA GEO COMMEX</text>'
        "</svg>"
    )


# --------------------------------------------------------------------------

SCENES = {
    "hero-refinery.svg": hero_refinery,
    "sector-minerals.svg": sector_minerals,
    "sector-agro.svg": sector_agro,
    "sector-logistics.svg": sector_logistics,
    "news-mining.svg": news_mining,
    "news-boardroom.svg": news_boardroom,
    "news-product.svg": news_product,
    "news-legal.svg": news_legal,
    "loc-chennai.svg": loc_chennai,
    "loc-nellore.svg": loc_nellore,
    "loc-singapore.svg": loc_singapore,
    "loc-morocco.svg": loc_morocco,
    "pattern.svg": pattern,
    "logo.svg": logo,
}

AVATARS = {
    "leader-shivprasad.svg": ("NS", 1),
    "leader-veeravikram.svg": ("NV", 2),
    "leader-ravikumar.svg": ("NR", 3),
    "leader-priyarao.svg": ("PR", 4),
    "leader-anburaj.svg": ("VA", 5),
}


def main():
    os.makedirs(OUT, exist_ok=True)
    written = 0
    for name, fn in SCENES.items():
        with open(os.path.join(OUT, name), "w", encoding="utf-8") as fh:
            fh.write(fn())
        written += 1
    for name, (ini, seed) in AVATARS.items():
        with open(os.path.join(OUT, name), "w", encoding="utf-8") as fh:
            fh.write(avatar(ini, seed))
        written += 1
    print("wrote %d files to %s" % (written, OUT))


if __name__ == "__main__":
    main()

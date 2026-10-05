"""Generates public/projects/wovenward/wovenward-wireframes-corrected.svg.

Retrospective low-fidelity wireframes of the current Wovenward app. They keep
the supplied board's six-part grayscale structure but use the app's real
navigation, headline, currency (USD), single colourway per product and bag copy.
Edit this script and rerun it:  python scripts/wovenward-wireframes.py
"""
from pathlib import Path

W, H = 1536, 1024
INK, MID, LIGHT, FILL, LINE, BG = '#1f1f1f', '#5f5f5f', '#a8a8a8', '#e4e4e4', '#c9c9c9', '#f2f2f2'
SANS = 'font-family="Helvetica, Arial, sans-serif"'
SERIF = 'font-family="Georgia, Times New Roman, serif"'
out = []


def add(s):
    out.append(s)


def rect(x, y, w, h, fill='#fff', stroke=LINE, sw=1, dash=None, rx=0):
    d = f' stroke-dasharray="{dash}"' if dash else ''
    add(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"{d}/>')


def text(x, y, s, size=9, fill=INK, weight=400, anchor='start', serif=False):
    s = s.replace('&', '&amp;')
    add(f'<text x="{x}" y="{y}" {SERIF if serif else SANS} font-size="{size}" font-weight="{weight}" fill="{fill}" text-anchor="{anchor}">{s}</text>')


def line(x1, y1, x2, y2, stroke=LINE, sw=1, dash=None):
    d = f' stroke-dasharray="{dash}"' if dash else ''
    add(f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{stroke}" stroke-width="{sw}"{d}/>')


def circle(cx, cy, r, fill='#fff', stroke=None):
    s = f' stroke="{stroke}"' if stroke else ''
    add(f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{fill}"{s}/>')


def image(x, y, w, h):
    """Crossed image placeholder."""
    rect(x, y, w, h, fill=FILL, stroke=LIGHT)
    line(x, y, x + w, y + h, LIGHT)
    line(x + w, y, x, y + h, LIGHT)


def bars(x, y, widths, gap=7, h=3):
    for i, w in enumerate(widths):
        add(f'<rect x="{x}" y="{y + i * gap}" width="{w}" height="{h}" fill="{LINE}"/>')


def button(x, y, w, h, label, dark=True, size=8):
    rect(x, y, w, h, fill=INK if dark else '#fff', stroke=INK)
    text(x + w / 2, y + h / 2 + size * 0.35, label, size, '#fff' if dark else INK, 600, 'middle')


def size_chip(x, y, w, h, label, state='normal', size=7):
    if state == 'selected':
        rect(x, y, w, h, fill=INK, stroke=INK)
        text(x + w / 2, y + h / 2 + size * 0.35, '✓ ' + label, size, '#fff', 600, 'middle')
    elif state == 'soldout':
        rect(x, y, w, h, stroke=MID, dash='2 2')
        line(x, y, x + w, y + h, LIGHT)
        text(x + w / 2, y + h / 2 + size * 0.35, label, size, LIGHT, 400, 'middle')
    else:
        rect(x, y, w, h, stroke=MID)
        text(x + w / 2, y + h / 2 + size * 0.35, label, size, INK, 500, 'middle')


def stepper(x, y, w=60, h=18, size=7.5):
    third = w / 3
    rect(x, y, w, h, stroke=MID)
    line(x + third, y, x + third, y + h, MID)
    line(x + 2 * third, y, x + 2 * third, y + h, MID)
    text(x + third / 2, y + h / 2 + 3, '−', size, MID, 400, 'middle')
    text(x + third * 1.5, y + h / 2 + 3, '1', size, INK, 600, 'middle')
    text(x + third * 2.5, y + h / 2 + 3, '+', size, INK, 400, 'middle')


def header(x, y, w):
    rect(x, y, w, 30, stroke=LINE)
    text(x + 12, y + 19, 'Wovenward', 11, INK, 400, serif=True)
    nav = ['Shop all', 'Coats & jackets', 'Knitwear', 'Shirts', 'Dresses']
    widths = [len(n) * 4.3 + 12 for n in nav]
    nx = x + w - 54 - sum(widths)
    for n, nw in zip(nav, widths):
        text(nx, y + 19, n, 7.2, MID)
        nx += nw
    text(x + w - 12, y + 19, 'Bag (0)', 7.2, INK, 600, 'end')


def title(x, y, s):
    text(x, y, s, 14, INK, 700)


add(f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}" role="img" aria-labelledby="wf-title wf-desc">')
add('<title id="wf-title">Wovenward low-fidelity layout study, corrected</title>')
add('<desc id="wf-desc">Retrospective grayscale wireframes of the current Wovenward experience: homepage, collection, product details, size guide, bag and two mobile layouts.</desc>')
rect(0, 0, W, H, fill=BG, stroke='none')
text(32, 48, 'Wovenward', 34, INK, 700)
text(33, 71, 'Low-fidelity layout study', 15, MID)
text(33, 97, 'Retrospective wireframes of the current experience', 11, MID)

# 01 Homepage
x, y, w, h = 33, 144, 462, 446
title(x, y - 12, '01 Homepage')
rect(x, y, w, h)
header(x, y, w)
text(x + 18, y + 64, 'THE EVERYDAY COLLECTION', 6.5, MID, 600)
text(x + 18, y + 92, 'Clothes you’ll', 22, INK, 400, serif=True)
text(x + 18, y + 118, 'reach for first.', 22, INK, 400, serif=True)
bars(x + 18, y + 132, [168, 160, 120])
button(x + 18, y + 162, 104, 22, 'Shop the collection')
text(x + 132, y + 176, 'Coats & jackets', 7.5, INK, 500)
line(x + 132, y + 179, x + 188, y + 179, INK)
image(x + 270, y + 46, 172, 172)
image(x + 222, y + 162, 70, 82)
text(x + 18, y + 272, 'Featured pieces', 10, INK, 400, serif=True)
text(x + w - 18, y + 272, 'View all 12 pieces', 6.5, MID, 400, 'end')
for i in range(4):
    cx = x + 18 + i * 108
    image(cx, y + 282, 98, 92)
    bars(cx, y + 382, [56])
    text(cx + 98, y + 386, '$—', 7, INK, 600, 'end')
    text(cx, y + 398, 'Available sizes: XS, S, M', 5.6, MID)
text(x + 18, y + 422, 'Shop by category', 10, INK, 400, serif=True)
for i, c in enumerate(['Coats & jackets', 'Knitwear', 'Shirts', 'Dresses', 'Trousers']):
    text(x + 18 + i * 86, y + 438, c, 7, MID)

# 02 Collection
x, y, w, h = 521, 144, 498, 446
title(x, y - 12, '02 Collection')
rect(x, y, w, h)
header(x, y, w)
text(x + 16, y + 66, 'All clothing', 20, INK, 400, serif=True)
rect(x + 16, y + 80, 190, 18, stroke=MID)
text(x + 26, y + 92, 'Search by name', 7, LIGHT)
text(x + w - 96, y + 76, 'Sort by', 6.5, MID)
rect(x + w - 96, y + 80, 80, 18, stroke=MID)
text(x + w - 88, y + 92, 'Featured', 7, INK)
fx = x + 16
text(fx, y + 124, 'CATEGORY', 6.5, INK, 700)
for i, (c, n) in enumerate([('Coats & jackets', 4), ('Knitwear', 3), ('Shirts', 2), ('Dresses', 2), ('Trousers', 1)]):
    rect(fx, y + 132 + i * 16, 8, 8, stroke=MID, fill=INK if c == 'Knitwear' else '#fff')
    text(fx + 14, y + 139 + i * 16, c, 7, INK)
    text(fx + 108, y + 139 + i * 16, str(n), 6.5, MID, 400, 'end')
text(fx, y + 230, 'SIZE IN STOCK', 6.5, INK, 700)
for i, s in enumerate(['XS', 'S', 'M', 'L', 'XL']):
    size_chip(fx + i * 22, y + 238, 19, 15, s, 'selected' if s == 'XS' else 'normal', 5.5)
text(fx, y + 268, 'Shows pieces with that size available.', 5.5, MID)
text(fx, y + 292, 'MAXIMUM PRICE', 6.5, INK, 700)
for i, p in enumerate(['Any price', 'Up to $100', 'Up to $150', 'Up to $200', 'Up to $250']):
    circle(fx + 4, y + 302 + i * 15, 4, stroke=MID)
    if i == 0:
        circle(fx + 4, y + 302, 2, fill=INK)
    text(fx + 13, y + 305 + i * 15, p, 7, INK)
gx = x + 140
text(gx, y + 124, '3 pieces', 7.5, INK, 700)
for i, (c, cw) in enumerate([('Knitwear ×', 52), ('Size XS ×', 50)]):
    rect(gx + 42 + i * 58, y + 114, cw, 15, stroke=MID, rx=7)
    text(gx + 42 + i * 58 + cw / 2, y + 124, c, 6.5, INK, 500, 'middle')
text(gx + 160, y + 124, 'Clear all', 6.5, INK, 500)
line(gx + 160, y + 127, gx + 188, y + 127, INK)
for r in range(2):
    for c in range(3):
        cx, cy = gx + c * 116, y + 140 + r * 148
        image(cx, cy, 106, 102)
        bars(cx, cy + 110, [56])
        text(cx + 106, cy + 114, '$—', 7, INK, 600, 'end')
        circle(cx + 3, cy + 123, 3, fill=LIGHT)
        bars(cx + 9, cy + 121, [30])
        text(cx, cy + 137, 'Available sizes: XS, S, M', 5.8, MID)

# 03 Product details
x, y, w, h = 1043, 144, 463, 446
title(x, y - 12, '03 Product details')
rect(x, y, w, h)
header(x, y, w)
image(x + 12, y + 44, 32, 40)
text(x + 12, y + 92, 'Full look', 5.5, INK, 600)
image(x + 12, y + 98, 32, 40)
text(x + 12, y + 146, 'Detail', 5.5, MID)
image(x + 52, y + 44, 196, 232)
rect(x + 222, y + 262, 22, 10, stroke=LIGHT, rx=5)
text(x + 233, y + 270, '1 / 2', 5.5, INK, 600, 'middle')
px = x + 264
text(px, y + 52, 'COATS & JACKETS', 6, MID, 600)
text(px, y + 72, 'Product name', 15, INK, 400, serif=True)
text(px, y + 90, '$—', 10, INK, 600)
bars(px, y + 98, [180, 170, 120])
text(px, y + 132, 'Colour: Olive', 7, INK, 600)
rect(px, y + 138, 64, 18, stroke=INK, sw=1.5, rx=9)
circle(px + 10, y + 147, 6, fill=LIGHT)
text(px + 20, y + 150, 'Olive ✓', 7, INK, 500)
text(px, y + 168, 'Available in Olive only.', 6, MID)
text(px, y + 186, 'Size: M', 7, INK, 600)
text(px + 186, y + 186, 'Size guide', 6.5, INK, 500, 'end')
line(px + 152, y + 189, px + 186, y + 189, INK)
for i, s in enumerate(['XS', 'S', 'M', 'L', 'XL']):
    size_chip(px + i * 38, y + 194, 34, 20, s, {'M': 'selected', 'L': 'soldout'}.get(s, 'normal'))
rect(px, y + 222, 7, 7, fill=INK, stroke=INK)
text(px + 10, y + 228, 'Selected', 5.5, MID)
rect(px + 46, y + 222, 7, 7, stroke=MID, dash='1.5 1.5')
text(px + 56, y + 228, 'Sold out', 5.5, MID)
rect(px, y + 236, 186, 24, stroke=LINE)
bars(px + 8, y + 244, [150, 110], gap=7, h=2.5)
text(px, y + 276, 'Quantity', 7, INK, 600)
stepper(px, y + 282, 66, 20, 8)
button(px, y + 312, 186, 24, 'Add to bag')
line(x + 12, y + 356, x + w - 12, y + 356)
for i, t in enumerate(['Fit & sizing', 'Materials & care', 'Shipping & returns']):
    cx = x + 12 + i * 148
    text(cx, y + 376, t, 9, INK, 400, serif=True)
    bars(cx, y + 388, [120, 100, 110, 80])

# 04 Size guide
x, y, w, h = 33, 640, 462, 360
title(x, y - 12, '04 Size guide')
rect(x, y, w, h, fill='#9a9a9a', stroke='#9a9a9a')
dx, dy, dw, dh = x + 56, y + 18, 350, 324
rect(dx, dy, dw, dh)
text(dx + 16, dy + 28, 'Size guide', 14, INK, 400, serif=True)
text(dx + dw - 16, dy + 28, '×', 13, INK, 400, 'end')
text(dx + 16, dy + 44, 'Product name · Fitted fit', 7, MID)
rect(dx + 16, dy + 52, 82, 18, fill=INK, stroke=INK)
text(dx + 57, dy + 64, 'Centimetres (cm)', 6.5, '#fff', 600, 'middle')
rect(dx + 98, dy + 52, 64, 18, stroke=MID)
text(dx + 130, dy + 64, 'Inches (in)', 6.5, INK, 500, 'middle')


def table(tx, ty, heading, rows):
    text(tx, ty, heading, 7, INK, 700)
    text(tx, ty + 20, 'Measurement', 6.5, MID, 600)
    for i, c in enumerate(['XS', 'S', 'M', 'L', 'XL']):
        text(tx + 150 + i * 32, ty + 20, c, 6.5, MID, 600, 'middle')
    line(tx, ty + 26, tx + 318, ty + 26, INK)
    for r, name in enumerate(rows):
        ry = ty + 42 + r * 22
        text(tx, ry, name, 7, INK, 600)
        for i in range(5):
            text(tx + 150 + i * 32, ry, '—', 7, MID, 400, 'middle')
        line(tx, ry + 8, tx + 318, ry + 8, LINE)


table(dx + 16, dy + 92, 'GARMENT MEASUREMENTS', ['Chest', 'Body length', 'Sleeve'])
table(dx + 16, dy + 200, 'BODY MEASUREMENTS', ['Chest / bust', 'Waist', 'Hip'])

# 05 Bag
x, y, w, h = 521, 640, 545, 360
title(x, y - 12, '05 Bag')
rect(x, y, w, h)
header(x, y, w)
text(x + 18, y + 70, 'Your bag', 22, INK, 400, serif=True)
text(x + 18, y + 92, '2 items', 7, INK, 700)
line(x + 18, y + 98, x + 340, y + 98, INK)
for r in range(2):
    ry = y + 108 + r * 104
    image(x + 18, ry, 62, 76)
    text(x + 92, ry + 12, 'Product name', 8.5, INK, 600)
    text(x + 340, ry + 12, '$—', 8, INK, 600, 'end')
    text(x + 92, ry + 28, 'Colour: —    Size: —    Price: $— each', 6.5, MID)
    text(x + 92, ry + 46, 'Quantity', 6.5, INK, 600)
    stepper(x + 92, ry + 52)
    text(x + 164, ry + 64, 'Remove', 6.5, INK, 500)
    line(x + 164, ry + 67, x + 189, ry + 67, INK)
    line(x + 18, ry + 92, x + 340, ry + 92, LINE)
sx = x + 362
rect(sx, y + 52, 166, 222)
text(sx + 12, y + 74, 'Summary', 11, INK, 400, serif=True)
text(sx + 12, y + 94, 'Subtotal (2 items)', 7.5, INK, 600)
text(sx + 154, y + 94, '$—', 8, INK, 600, 'end')
text(sx + 12, y + 108, 'Subtotal excludes shipping and any taxes.', 5.6, MID)
rect(sx + 12, y + 118, 142, 84, fill=FILL, stroke='none')
line(sx + 12, y + 118, sx + 12, y + 202, INK, 2)
text(sx + 20, y + 134, 'Checkout is unavailable', 7.5, INK, 700)
for i, l in enumerate(['Wovenward is a concept store,', 'so purchases can’t be completed.', 'Your bag is saved in this', 'browser only.']):
    text(sx + 20, y + 150 + i * 11, l, 6.3, MID)
button(sx + 12, y + 214, 142, 22, 'Continue shopping', dark=False, size=7.5)

# 06 Mobile layouts
x, y = 1104, 640
title(x, y - 12, '06 Mobile layouts')


def phone(px, py, pw=170, ph=360):
    rect(px, py, pw, ph, rx=6)
    rect(px, py, pw, 28, stroke=LINE)
    text(px + 10, py + 19, '≡', 11, INK)
    text(px + 26, py + 18, 'Wovenward', 9.5, INK, 400, serif=True)
    text(px + pw - 10, py + 18, 'Bag (0)', 6.5, INK, 600, 'end')


phone(x + 12, y)
text(x + 24, y + 50, 'All clothing', 12, INK, 400, serif=True)
rect(x + 24, y + 58, 146, 16, stroke=MID)
text(x + 32, y + 69, 'Search by name', 6, LIGHT)
rect(x + 24, y + 80, 146, 16, stroke=MID)
text(x + 97, y + 91, 'Filters (1)', 6.5, INK, 600, 'middle')
for r in range(2):
    for c in range(2):
        cx, cy = x + 24 + c * 76, y + 106 + r * 120
        image(cx, cy, 70, 84)
        bars(cx, cy + 90, [44])
        text(cx + 70, cy + 94, '$—', 6, INK, 600, 'end')
        text(cx, cy + 106, 'Available: XS, S, M', 5, MID)
phone(x + 210, y)
image(x + 222, y + 36, 146, 146)
for i in range(2):
    circle(x + 291 + i * 8, y + 190, 2, fill=INK if i == 0 else LIGHT)
text(x + 222, y + 210, 'Product name', 10, INK, 400, serif=True)
text(x + 222, y + 224, '$—', 8, INK, 600)
text(x + 222, y + 240, 'Colour: Olive', 6, INK, 600)
rect(x + 222, y + 244, 54, 15, stroke=INK, sw=1.2, rx=7)
text(x + 249, y + 254, 'Olive ✓', 6, INK, 500, 'middle')
text(x + 222, y + 272, 'Size', 6, INK, 600)
text(x + 368, y + 272, 'Size guide', 5.5, INK, 500, 'end')
for i, s in enumerate(['XS', 'S', 'M', 'L', 'XL']):
    size_chip(x + 222 + i * 29.5, y + 278, 26, 16, s, {'M': 'selected', 'L': 'soldout'}.get(s, 'normal'), 5.5)
rect(x + 210, y + 318, 170, 42, stroke=LINE)
text(x + 222, y + 336, '$—', 7, INK, 600)
text(x + 222, y + 348, 'Size M', 5.5, MID)
button(x + 286, y + 326, 84, 24, 'Add to bag', size=7)

add('</svg>')
target = Path(__file__).resolve().parent.parent / 'public' / 'projects' / 'wovenward' / 'wovenward-wireframes-corrected.svg'
target.write_text('\n'.join(out), encoding='utf-8')
print('written', target.name, len(out), 'elements')

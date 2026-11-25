"""Render the Typography Systems web assets from the original PDFs.

Usage:
    python scripts/typography-systems-assets.py ["<folder containing the PDFs>"]

The folder defaults to the private archive next to the portfolio:
    UX Projects/Typography Systems/originals/
The PDFs are only read. They are not copied into public/: the originals stay
private because the ONE-X book contains uncredited member photographs and
substantial song lyrics (see Typography Systems/docs/RIGHTS-REVIEW.md).

Only selected, public-facing artwork is rendered:
  * whole PDF pages that contain no photographs and no song lyrics;
  * each printed page of those spreads on its own (-l / -r), so phones can
    step through one printed page at a time;
  * four labelled crops of ONE-X pages, taken from the top of a printed page
    so the portrait, quotation or lyric below is left out. Crops are never
    retouched: the page is cut, nothing is painted over.

Every page is rasterised on a white background. Sizes are set by height:
    sm  560 px tall  (gallery thumbnails)
    md 1100 px tall  (inline figures)
    lg 2200 px tall  (enlarged view)

Requires PyMuPDF and Pillow (with WebP support).
"""

import sys
from pathlib import Path

import pymupdf as fitz
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "projects" / "typography-systems"
DEFAULT_SOURCE = ROOT.parent / "Typography Systems" / "originals"

BOOK_1 = "book-1-typography.pdf"
BOOK_2 = "book-2-one-x.pdf"

HEIGHTS = {"sm": 560, "md": 1100, "lg": 2200}
QUALITY = 84

# PDF page numbers (1-based) published as whole pages. Book 1 contains no
# images; its part dividers (7, 10) and one near-repeat (8) are left out of
# the selection. Book 2 pages 4-8 carry member portraits, quotations or lyrics.
BOOK_1_PAGES = [1, 2, 3, 4, 5, 6, 9, 11, 12, 13]
BOOK_2_PAGES = [1, 2, 3, 9]
# Spreads whose two printed pages are also published separately. Book 2 page 9
# is left whole: its right-hand page is blank.
BOOK_1_HALVES = [2, 3, 4, 5, 6, 9, 11, 12, 13]
BOOK_2_HALVES = [2, 3]

# (PDF page, side) for single printed pages taken from spreads that are not
# published whole.
BOOK_2_SINGLE = {
    "b2-five-voices": (6, "right"),  # printed page 10, no portrait
    "b2-albums": (8, "right"),  # printed page 14, no lyrics
}

# Crops as fractions of the spread (x0, y0, x1, y1). Each lower edge falls in
# open space above the omitted material and between two lines of text.
BOOK_2_CROPS = {
    "b2-brad-detail": (5, (0.0, 0.0, 0.5, 0.51)),  # page 07 above the portrait
    "b2-matt-detail": (6, (0.0, 0.0, 0.5, 0.69)),  # page 09 above the portrait and quotation
    "b2-lyric-titles": (7, (0.0, 0.0, 1.0, 0.588)),  # pages 11-12 above the lyric excerpts
    "b2-pain-title": (8, (0.0, 0.0, 0.5, 0.415)),  # page 13 above the lyric excerpt
}


def render(page: fitz.Page, height: int) -> Image.Image:
    zoom = height / page.rect.height
    pix = page.get_pixmap(matrix=fitz.Matrix(zoom, zoom), alpha=False)
    return Image.frombytes("RGB", (pix.width, pix.height), pix.samples)


def save(image: Image.Image, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    image.save(path, "WEBP", quality=QUALITY, method=6)


def halves(image: Image.Image) -> tuple[Image.Image, Image.Image]:
    mid = image.width // 2
    return image.crop((0, 0, mid, image.height)), image.crop((mid, 0, image.width, image.height))


def render_pages(doc: fitz.Document, folder: str, pages: list[int], split: list[int]) -> None:
    for number in pages:
        page = doc[number - 1]
        for size, height in HEIGHTS.items():
            image = render(page, height)
            save(image, OUT / folder / f"p{number:02d}-{size}.webp")
            if number in split and size != "sm":
                left, right = halves(image)
                save(left, OUT / folder / f"p{number:02d}-l-{size}.webp")
                save(right, OUT / folder / f"p{number:02d}-r-{size}.webp")


def single(doc: fitz.Document, number: int, side: str, name: str) -> None:
    page = doc[number - 1]
    for size, height in HEIGHTS.items():
        left, right = halves(render(page, height))
        save(left if side == "left" else right, OUT / "details" / f"{name}-{size}.webp")


def crop(doc: fitz.Document, number: int, rect: tuple[float, float, float, float], name: str) -> None:
    image = render(doc[number - 1], HEIGHTS["lg"])
    x0, y0, x1, y1 = rect
    region = image.crop((round(x0 * image.width), round(y0 * image.height), round(x1 * image.width), round(y1 * image.height)))
    for size, longest in (("lg", 1600), ("md", 1200), ("sm", 600)):
        copy = region.copy()
        copy.thumbnail((longest, longest), Image.LANCZOS)
        save(copy, OUT / "details" / f"{name}-{size}.webp")


def shadow(size: tuple[int, int], offset: int, blur: int, color: tuple[int, int, int, int]) -> Image.Image:
    layer = Image.new("RGBA", (size[0] + blur * 4, size[1] + blur * 4), (0, 0, 0, 0))
    ImageDraw.Draw(layer).rectangle((blur * 2, blur * 2 + offset, blur * 2 + size[0], blur * 2 + size[1] + offset), fill=color)
    return layer.filter(ImageFilter.GaussianBlur(blur))


def card(book2: fitz.Document) -> None:
    """Homepage card, 16:9: the ONE-X cover beside the introduction spread (no photographs)."""
    width, height = 1600, 900
    ground = (33, 22, 22)
    canvas = Image.new("RGBA", (width, height), ground + (255,))
    draw = ImageDraw.Draw(canvas)
    draw.rectangle((0, height - 10, width, height), fill=(122, 31, 43, 255))

    # Side by side, never overlapping, so no part of either page is hidden.
    spread = render(book2[2], 610).convert("RGBA")
    cover = render(book2[0], 740).convert("RGBA")
    gap = 56
    left = (width - cover.width - gap - spread.width) // 2
    cover_pos = (left, (height - cover.height) // 2 - 6)
    spread_pos = (left + cover.width + gap, (height - spread.height) // 2 + 30)

    tint = (10, 4, 4, 170)
    for image, pos in ((spread, spread_pos), (cover, cover_pos)):
        blur = 22
        s = shadow(image.size, 18, blur, tint)
        canvas.alpha_composite(s, (pos[0] - blur * 2, pos[1] - blur * 2))
        canvas.alpha_composite(image, pos)

    save(canvas.convert("RGB"), OUT / "card-typography-systems.webp")


def main() -> None:
    if len(sys.argv) > 2:
        sys.exit(__doc__)
    source = Path(sys.argv[1]).expanduser() if len(sys.argv) == 2 else DEFAULT_SOURCE

    book1 = fitz.open(source / BOOK_1)
    book2 = fitz.open(source / BOOK_2)

    render_pages(book1, "book-1", BOOK_1_PAGES, BOOK_1_HALVES)
    render_pages(book2, "book-2", BOOK_2_PAGES, BOOK_2_HALVES)
    for name, (number, side) in BOOK_2_SINGLE.items():
        single(book2, number, side, name)
    for name, (number, rect) in BOOK_2_CROPS.items():
        crop(book2, number, rect, name)
    card(book2)


if __name__ == "__main__":
    main()

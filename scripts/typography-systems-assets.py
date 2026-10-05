"""Render the Typography Systems web assets from the original PDFs.

Usage:
    python3 scripts/typography-systems-assets.py "<folder containing the PDFs>"

Requires PyMuPDF and Pillow (with WebP support). The source PDFs are only read;
they are copied byte-for-byte into public/projects/typography-systems/ for the
download links.

Every page is rasterised on a white background, so transparent areas of the
artwork read as paper on any section colour. Pages are sized by height so
single pages and two-page spreads share the same density:
    sm  560 px tall  (gallery thumbnails)
    md 1100 px tall  (inline figures)
    lg 2200 px tall  (enlarged view)
"""

import shutil
import sys
from pathlib import Path

import pymupdf as fitz
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "projects" / "typography-systems"

SOURCES = {
    "case-study": ("Typography-Systems-Case-Study.pdf", "typography-systems-case-study.pdf"),
    "book-1": ("Book 1  Typography.pdf", "book-1-typography.pdf"),
    "book-2": ("Book 2.pdf", "book-2-one-x.pdf"),
}

HEIGHTS = {"sm": 560, "md": 1100, "lg": 2200}
QUALITY = 84


def render(page: fitz.Page, height: int) -> Image.Image:
    zoom = height / page.rect.height
    pix = page.get_pixmap(matrix=fitz.Matrix(zoom, zoom), alpha=False)
    return Image.frombytes("RGB", (pix.width, pix.height), pix.samples)


def save(image: Image.Image, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    image.save(path, "WEBP", quality=QUALITY, method=6)


def render_book(doc: fitz.Document, folder: str) -> None:
    for index, page in enumerate(doc, start=1):
        for size, height in HEIGHTS.items():
            save(render(page, height), OUT / folder / f"p{index:02d}-{size}.webp")


def half(doc: fitz.Document, page_number: int, side: str, name: str) -> None:
    """One printed page from a two-page spread, at md and lg sizes."""
    page = doc[page_number - 1]
    for size in ("md", "lg"):
        image = render(page, HEIGHTS[size])
        mid = image.width // 2
        box = (0, 0, mid, image.height) if side == "left" else (mid, 0, image.width, image.height)
        save(image.crop(box), OUT / "details" / f"{name}-{size}.webp")


def detail(doc: fitz.Document, page_number: int, rect: tuple[float, float, float, float], name: str) -> None:
    """A close-up region, given as fractions of the page (x0, y0, x1, y1)."""
    page = doc[page_number - 1]
    image = render(page, HEIGHTS["lg"])
    x0, y0, x1, y1 = rect
    crop = image.crop((round(x0 * image.width), round(y0 * image.height), round(x1 * image.width), round(y1 * image.height)))
    save(crop, OUT / "details" / f"{name}-lg.webp")
    small = crop.copy()
    small.thumbnail((1200, 1200), Image.LANCZOS)
    save(small, OUT / "details" / f"{name}-md.webp")


def shadow(size: tuple[int, int], offset: int, blur: int, color: tuple[int, int, int, int]) -> Image.Image:
    layer = Image.new("RGBA", (size[0] + blur * 4, size[1] + blur * 4), (0, 0, 0, 0))
    ImageDraw.Draw(layer).rectangle((blur * 2, blur * 2 + offset, blur * 2 + size[0], blur * 2 + size[1] + offset), fill=color)
    return layer.filter(ImageFilter.GaussianBlur(blur))


def card(book2: fitz.Document) -> None:
    """Homepage card, 16:9: the ONE-X cover beside a member spread."""
    width, height = 1600, 900
    ground = (33, 22, 22)
    canvas = Image.new("RGBA", (width, height), ground + (255,))
    draw = ImageDraw.Draw(canvas)
    draw.rectangle((0, height - 10, width, height), fill=(122, 31, 43, 255))

    # Side by side, never overlapping, so no part of either page is hidden.
    spread = render(book2[3], 610).convert("RGBA")
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
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    source = Path(sys.argv[1]).expanduser()

    OUT.mkdir(parents=True, exist_ok=True)
    for original, published in SOURCES.values():
        shutil.copyfile(source / original, OUT / published)

    book1 = fitz.open(source / SOURCES["book-1"][0])
    book2 = fitz.open(source / SOURCES["book-2"][0])

    render_book(book1, "book-1")
    render_book(book2, "book-2")

    # Single printed pages, as selected in the case study.
    half(book1, 2, "left", "b1-steady-entry")
    half(book1, 3, "right", "b1-direction")
    half(book1, 5, "right", "b1-space")
    half(book2, 3, "right", "b2-sound")
    half(book2, 6, "right", "b2-five-voices")

    # Close-ups of the upper part of a printed page. Each lower edge falls
    # between two lines of text, so no line is cut through.
    detail(book2, 4, (0.0, 0.0, 0.5, 0.725), "b2-adam-detail")
    detail(book2, 5, (0.0, 0.0, 0.5, 0.51), "b2-brad-detail")
    detail(book2, 8, (0.0, 0.0, 0.5, 0.545), "b2-pain-detail")

    card(book2)


if __name__ == "__main__":
    main()

"""Build the image assets for the AIC Museum Experience case study.

Usage:
    python scripts/aic-case-study-assets.py [--local-only]

1. Presentation artwork (skipped with --local-only). Two paintings from the
   Art Institute of Chicago's open-access collection. For each record the
   script asks the museum's public API whether the work is public domain; the
   API serves public-domain images and data under CC0 1.0
   (https://creativecommons.org/publicdomain/zero/1.0/, https://www.artic.edu/terms).
   If a record is not public domain, the script stops instead of downloading it.
   The paintings were not part of the original student project.

2. Andrew's individual follow-up designs, rendered from the vector mockup cards
   on page 11 of his 14-page case-study PDF. Nothing is redrawn: each card is
   rasterised exactly as it appears in the PDF.

3. One clean crop of an original team screen: the collectible detail screen
   (app-09) below its illustration, whose source is not recorded. The crop's
   white background contains no photography; nothing is painted over.

Other original screens are not published: their backgrounds carry sculpture
photography with no recorded source, and several show third-party NFT artwork,
a profile photo or the museum's logo. The case study shows them as labelled
low-fidelity reconstructions instead (src/data/aic-wireframes.ts).

Sources are read from the private archive next to the portfolio:
    UX Projects/AIC Museum Experience/originals/
See docs/RIGHTS-REVIEW.md there. Requires Pillow (WebP) and PyMuPDF.
"""

import io
import json
import sys
import urllib.request
from pathlib import Path

import pymupdf as fitz
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "projects" / "aic-museum-experience"
ORIGINALS = ROOT.parent / "AIC Museum Experience" / "originals"
QUALITY = 84

API = "https://api.artic.edu/api/v1/artworks/{id}?fields=id,title,artist_display,date_display,medium_display,main_reference_number,credit_line,is_public_domain,image_id"
IIIF = "https://www.artic.edu/iiif/2/{image_id}/full/1686,/0/default.jpg"
HEADERS = {"User-Agent": "portfolio-case-study-assets", "AIC-User-Agent": "portfolio-case-study-assets"}

# Artwork id -> file name. Chosen for subject: people on leisure outings.
ARTWORKS = {
    27992: "seurat-grande-jatte",  # A Sunday on La Grande Jatte — 1884
    20684: "caillebotte-paris-street",  # Paris Street; Rainy Day
}
ARTWORK_WIDTHS = {"sm": 640, "md": 1100, "lg": 1686}

# Follow-up mockup cards on PDF page 11, in PDF points (the cards' own borders).
FOLLOW_UP_PDF = ORIGINALS / "portfolio-case-study-pdf" / "aic-case-study-14-pages-2026-10-19.pdf"
FOLLOW_UP_CARDS = {
    "guest-access": (52, 263, 362, 557),
    "event-discovery": (426, 263, 736, 557),
    "keepsake": (800, 263, 1110, 557),
}
CARD_PAD = 3  # points around each card, so its border is not clipped
CARD_WIDTHS = {"md": 900, "lg": 1500}

# app-09 (706 x 1436): the illustration ends near y = 390.
COLLECTIBLE = ORIGINALS / "screen-exports" / "app-09.jpg"
COLLECTIBLE_CROP = (0, 405, 706, 1436)


def fetch(url: str) -> bytes:
    with urllib.request.urlopen(urllib.request.Request(url, headers=HEADERS), timeout=60) as response:
        return response.read()


def save(image: Image.Image, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    image.save(path, "WEBP", quality=QUALITY, method=6)
    print(f"  {path.relative_to(ROOT).as_posix()}  {image.width} x {image.height}")


def artworks() -> None:
    for artwork_id, name in ARTWORKS.items():
        record = json.loads(fetch(API.format(id=artwork_id)))
        data = record["data"]
        if not data["is_public_domain"]:
            sys.exit(f"{artwork_id} ({data['title']}) is not public domain; not downloading it.")
        image = Image.open(io.BytesIO(fetch(IIIF.format(image_id=data["image_id"])))).convert("RGB")
        for size, width in ARTWORK_WIDTHS.items():
            copy = image if image.width <= width else image.resize((width, round(image.height * width / image.width)), Image.LANCZOS)
            save(copy, OUT / "artworks" / f"{name}-{size}.webp")
        print(f"  {artwork_id}: {data['title']} | {data['artist_display'].splitlines()[0]} | {data['main_reference_number']} | {data['credit_line']}")


def follow_up() -> None:
    page = fitz.open(FOLLOW_UP_PDF)[10]
    for name, (x0, y0, x1, y1) in FOLLOW_UP_CARDS.items():
        clip = fitz.Rect(x0 - CARD_PAD, y0 - CARD_PAD, x1 + CARD_PAD, y1 + CARD_PAD)
        for size, width in CARD_WIDTHS.items():
            zoom = width / clip.width
            pix = page.get_pixmap(matrix=fitz.Matrix(zoom, zoom), clip=clip, alpha=False)
            save(Image.frombytes("RGB", (pix.width, pix.height), pix.samples), OUT / "follow-up" / f"{name}-{size}.webp")


def collectible() -> None:
    crop = Image.open(COLLECTIBLE).convert("RGB").crop(COLLECTIBLE_CROP)
    save(crop, OUT / "original" / "collectible-detail-crop.webp")


def main() -> None:
    if "--local-only" not in sys.argv:
        artworks()
    follow_up()
    collectible()


if __name__ == "__main__":
    main()

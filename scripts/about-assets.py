"""Generate the images used on the About page (#/about).

Sources are read only and never modified:
  ../About me photos/{Chicago,Colarado,Ocean}.jpg   personal photos (1920 x 2560)
      (extracted from "About me photos.zip"; Beach.jpg is not used yet)
  public/projects/backwater-journal/frame-0N.jpg    App Store frames (1080 x 2337)

Outputs (WebP, EXIF and any location metadata dropped, orientation baked in):
  public/about/photo-chicago-{640,960,1280}.webp    4:5, opening portrait
  public/about/photo-colorado-{400,640,960}.webp    4:5, supporting photo
  public/about/photo-ocean-{800,1200,1600}.webp     4:3, "Beyond the screen"
  public/about/backwater-frame-0N-{360,720}.webp    Backwater section frames

Run from the repository root:  python scripts/about-assets.py
"""

from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
PHOTOS = ROOT.parent / "About me photos"
BACKWATER_SOURCE = ROOT / "public" / "projects" / "backwater-journal"
OUT = ROOT / "public" / "about"

# Crop boxes in source pixels (left, top, right, bottom), chosen by eye:
#   Chicago   face in the upper middle, jacket and city lights kept
#   Colorado  whole seated figure, mountains either side, a band of sky
#   Ocean     raised arms, yellow sweatshirt, horizon and surf
PHOTO_CROPS = {
    "chicago": ("Chicago.jpg", (40, 120, 1720, 2220), (640, 960, 1280)),  # 1680 x 2100 = 4:5
    "colorado": ("Colarado.jpg", (480, 810, 1880, 2560), (400, 640, 960)),  # 1400 x 1750 = 4:5
    "ocean": ("Ocean.jpg", (0, 743, 1920, 2183), (800, 1200, 1600)),  # 1920 x 1440 = 4:3
}

# Backwater frames shown on the About page: Dock home, Share catches, Explore map.
BACKWATER_FRAMES = ("01", "02", "04")


def save_webp(image: Image.Image, width: int, path: Path) -> None:
    height = round(width * image.height / image.width)
    # A fresh RGB image carries no EXIF, XMP or GPS blocks into the WebP.
    clean = Image.new("RGB", image.size)
    clean.paste(image)
    clean.resize((width, height), Image.LANCZOS).save(path, "WEBP", quality=84, method=6)
    print(f"{path.relative_to(ROOT)}: {width}x{height}")


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)

    for name, (filename, box, widths) in PHOTO_CROPS.items():
        photo = ImageOps.exif_transpose(Image.open(PHOTOS / filename)).convert("RGB").crop(box)
        for width in widths:
            save_webp(photo, width, OUT / f"photo-{name}-{width}.webp")

    for frame in BACKWATER_FRAMES:
        image = Image.open(BACKWATER_SOURCE / f"frame-{frame}.jpg").convert("RGB")
        for width in (360, 720):
            save_webp(image, width, OUT / f"backwater-frame-{frame}-{width}.webp")


if __name__ == "__main__":
    main()

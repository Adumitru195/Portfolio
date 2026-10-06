"""Generate the portrait crops used on the About page.

Source: public/profile.jpg (1920 x 2560), left untouched.

  public/portrait/about-{800,1200}.webp   4:5, sky trimmed, head and shoulders

Run from the repository root:  python scripts/portrait-assets.py
"""

from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "public" / "profile.jpg"
OUT = ROOT / "public" / "portrait"

# Crop boxes in source pixels (left, top, right, bottom).
ABOUT_BOX = (180, 300, 1700, 2200)  # 1520 x 1900 = 4:5


def export(image: Image.Image, box, width: int, name: str) -> None:
    crop = image.crop(box)
    height = round(width * crop.height / crop.width)
    crop.resize((width, height), Image.LANCZOS).save(OUT / name, "WEBP", quality=82, method=6)
    print(f"{name}: {width}x{height}")


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    image = ImageOps.exif_transpose(Image.open(SOURCE)).convert("RGB")
    for width in (800, 1200):
        export(image, ABOUT_BOX, width, f"about-{width}.webp")


if __name__ == "__main__":
    main()

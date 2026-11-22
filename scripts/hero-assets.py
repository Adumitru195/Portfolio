"""Generate the right-sized screenshots for the homepage hero composition.

Sources are read only and never modified (they belong to the case studies):
  public/projects/porchlight/after-desktop-first.webp   1600 x 1000, finished page
  public/projects/backwater-journal/explore.webp         640 x 1325, iPhone frame (alpha)

Outputs (WebP), sized for the largest the hero ever shows them (about 560
and 200 CSS px wide on a 1920px screen) at 2x:
  public/hero/porchlight-final-1120.webp
  public/hero/backwater-explore-420.webp   (alpha kept for the device frame)

The wireframe (public/projects/porchlight/wf-home.webp, 577 x 481) is already
small enough and is used as is.

Run from the repository root:  python scripts/hero-assets.py
"""

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
PROJECTS = ROOT / "public" / "projects"
OUT = ROOT / "public" / "hero"

JOBS = [
    (PROJECTS / "porchlight" / "after-desktop-first.webp", "porchlight-final-1120.webp", 1120, 84),
    (PROJECTS / "backwater-journal" / "explore.webp", "backwater-explore-420.webp", 420, 86),
]


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for source, name, width, quality in JOBS:
        with Image.open(source) as img:
            img.load()
            height = round(img.height * width / img.width)
            resized = img.resize((width, height), Image.Resampling.LANCZOS)
            target = OUT / name
            resized.save(target, "WEBP", quality=quality, method=6)
            print(f"{target.relative_to(ROOT)}  {width}x{height}  {target.stat().st_size // 1024} KB")


if __name__ == "__main__":
    main()

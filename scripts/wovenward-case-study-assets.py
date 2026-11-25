"""Convert Wovenward prototype captures to WebP for the case study.

Input: scripts/.wovenward-captures/*.png, from scripts/wovenward-captures.mjs
(2x captures of the working storefront; nothing is edited, cropped by hand or
retouched). Each image is only resized when wider than MAX_WIDTH, then saved as
WebP.

Output: public/projects/wovenward/case-study/<name>.webp. The temporary capture
folder is deleted afterwards.
"""
from pathlib import Path
import shutil

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
CAPTURES = ROOT / 'scripts' / '.wovenward-captures'
OUT = ROOT / 'public' / 'projects' / 'wovenward' / 'case-study'
MAX_WIDTH = 2400


def main() -> None:
    if not CAPTURES.exists():
        raise SystemExit('No captures found. Run scripts/wovenward-captures.mjs first.')
    OUT.mkdir(parents=True, exist_ok=True)
    for png in sorted(CAPTURES.glob('*.png')):
        with Image.open(png) as im:
            im = im.convert('RGB')
            if im.width > MAX_WIDTH:
                im = im.resize((MAX_WIDTH, round(im.height * MAX_WIDTH / im.width)), Image.LANCZOS)
            target = OUT / f'{png.stem}.webp'
            im.save(target, 'WEBP', quality=86, method=6)
            print(f'{target.relative_to(ROOT)}  {im.width}x{im.height}')
    shutil.rmtree(CAPTURES)


if __name__ == '__main__':
    main()

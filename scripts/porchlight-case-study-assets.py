"""Make the web images for the redesigned Porchlight case study.

Sources are read only and never modified.

Arcadian Homes (2024), from the extracted reference copy of the original
project, UX Projects/Porchlight/reference/arcadian-homes/:
  Video 2.mp4             496 x 1048 recording of the 2024 mobile prototype.
                          Single frames are taken at the times below; each is
                          a whole, unedited frame (the prototype's own cursor
                          is visible in some).
  Thumbnail Cover.webp    the 2024 cover mock-up, copied unchanged
  (The 2024 usability summary is quoted as text on the page; its image is not
  published.)

  frame             time   shows
  price             0.3 s  "$3,234/mo" above "Est. Payment: $4,374/mo"
  sale              8.3 s  the same address as "$349,000", same est. payment
  tour-picker       2.1 s  date and time picker, Schedule Tour still disabled,
                           times with no time zone
  confirmation      6.1 s  "Your tour has been scheduled!" with "An agent will
                           be in touch with you shortly via email to confirm"

Porchlight (2026), from scripts/porchlight-captures.mjs (run that first): PNG
captures of the working prototype at 2x, converted to WebP. The temporary
capture folder is deleted afterwards.

Outputs:
  public/projects/porchlight/arcadian/{price,sale,tour-picker,confirmation,cover}.webp
  public/projects/porchlight/case-study/{mobile-search,mobile-listing,mobile-costs,
      mobile-tour-step1,mobile-tour-review,mobile-tour-disclosure,mobile-confirmation}.webp

Needs Pillow and imageio-ffmpeg (pip install pillow imageio-ffmpeg).
Run from the repository root:  python scripts/porchlight-case-study-assets.py
"""
import shutil
import subprocess
import tempfile
from pathlib import Path

import imageio_ffmpeg
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
ARCADIAN = ROOT.parent / 'Porchlight' / 'reference' / 'arcadian-homes'
CAPTURES = ROOT / 'scripts' / '.porchlight-captures'
OUT_ARCADIAN = ROOT / 'public' / 'projects' / 'porchlight' / 'arcadian'
OUT_PORCH = ROOT / 'public' / 'projects' / 'porchlight' / 'case-study'

FRAMES = {'price': 0.3, 'sale': 8.3, 'tour-picker': 2.1, 'confirmation': 6.1}
CAPTURE_NAMES = [
    'mobile-search', 'mobile-listing', 'mobile-costs', 'mobile-tour-step1',
    'mobile-tour-review', 'mobile-tour-disclosure', 'mobile-confirmation',
]


def save_webp(image: Image.Image, path: Path, quality: int) -> None:
    image.convert('RGB').save(path, 'WEBP', quality=quality, method=6)
    print(f'{path.relative_to(ROOT)}  {image.width} x {image.height}  {path.stat().st_size // 1024} KB')


def arcadian() -> None:
    OUT_ARCADIAN.mkdir(parents=True, exist_ok=True)
    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
    video = ARCADIAN / 'Video 2.mp4'
    with tempfile.TemporaryDirectory() as tmp:
        for name, seconds in FRAMES.items():
            frame = Path(tmp) / f'{name}.png'
            subprocess.run(
                [ffmpeg, '-loglevel', 'error', '-y', '-ss', str(seconds), '-i', str(video), '-frames:v', '1', str(frame)],
                check=True,
            )
            with Image.open(frame) as im:
                save_webp(im, OUT_ARCADIAN / f'{name}.webp', 90)
    for source, name in (('Thumbnail Cover.webp', 'cover.webp'),):
        shutil.copyfile(ARCADIAN / source, OUT_ARCADIAN / name)
        print(f'{(OUT_ARCADIAN / name).relative_to(ROOT)}  copied unchanged')


def porchlight() -> None:
    if not CAPTURES.exists():
        raise SystemExit('No captures found. Run scripts/porchlight-captures.mjs first.')
    OUT_PORCH.mkdir(parents=True, exist_ok=True)
    for name in CAPTURE_NAMES:
        with Image.open(CAPTURES / f'{name}.png') as im:
            save_webp(im, OUT_PORCH / f'{name}.webp', 85)
    shutil.rmtree(CAPTURES)


if __name__ == '__main__':
    arcadian()
    porchlight()

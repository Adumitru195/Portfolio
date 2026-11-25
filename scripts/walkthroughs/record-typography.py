"""Builds the Typography Systems publication walkthrough from the original book
PDFs, which are kept privately in UX Projects/Typography Systems/originals/
(override with TYPOGRAPHY_SOURCE). Full compositions first, then readable
detail views. Slides change with gentle crossfades only (no pans or zooms).
This is a paced view of printed pages, not an interactive demo.

Only artwork cleared for the public case study is used: no member portraits,
no quotations attributed to band members, no song lyrics. ONE-X pages that
carry them appear only as crops taken from above the omitted material, the
same crops the case study labels (scripts/typography-systems-assets.py).

Requires: pip install pymupdf pillow imageio-ffmpeg (or ffmpeg on PATH / FFMPEG_PATH).

Run from the project root:
    python scripts/walkthroughs/record-typography.py [--publish]
"""
import os
import shutil
import subprocess
import sys
from pathlib import Path

import pymupdf
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parents[2]
SRC = Path(os.environ.get("TYPOGRAPHY_SOURCE", ROOT.parent / "Typography Systems" / "originals"))
PUBLIC = ROOT / "public" / "projects" / "typography-systems"
OUT = Path(os.environ.get("WALKTHROUGH_OUTPUT", ROOT / "scripts" / "walkthroughs" / ".output")) / "typography-systems"
W, H, FPS, FADE = 1920, 1200, 30, 0.6
BG = (234, 227, 215)  # type-band, the case study's band tone

B1, B2 = "book-1-typography.pdf", "book-2-one-x.pdf"
# (book, page index, hold seconds, clip in PDF points or None, framed)
# Spreads are 1152 x 792 pt; a printed page is 576 pt wide. Framed slides show
# a page or a labelled crop on the band colour with a shadow; unframed slides
# are close-ups that fill the frame.
SLIDES = [
    (B1, 0, 1.8, None, True),   # Book 1 cover
    (B1, 1, 2.0, None, True),   # Two aligned compositions
    (B1, 3, 2.0, None, True),   # Diagonal and vertical type
    (B1, 10, 2.0, None, True),  # Blue field and pink block
    (B2, 0, 1.8, None, True),   # ONE-X front cover
    (B2, 2, 2.2, None, True),   # Introduction · The sound of Three Days Grace (04)
    (B2, 4, 2.4, (0, 0, 576, 404), True),    # Page 07, cropped above the portrait
    (B2, 5, 2.4, (0, 0, 576, 546), True),    # Page 09, cropped above the portrait and quotation
    (B2, 5, 2.0, (576, 0, 1152, 792), True),  # Page 10, The Five Voices
    (B2, 6, 2.4, (0, 0, 1152, 465), True),   # Pages 11-12, titles only, lyrics omitted
    (B2, 8, 2.0, None, True),   # Discography (15)
    # Readable detail views.
    (B1, 3, 3.2, (0, 300, 576, 660), False),     # Diagonal description block
    (B2, 5, 3.4, (576, 150, 1152, 510), False),  # The Five Voices and member list
]


def ffmpeg_path():
    if os.environ.get("FFMPEG_PATH"):
        return os.environ["FFMPEG_PATH"]
    found = shutil.which("ffmpeg")
    if found:
        return found
    import imageio_ffmpeg

    return imageio_ffmpeg.get_ffmpeg_exe()


def render(book, index, clip, framed):
    page = pymupdf.open(SRC / book)[index]
    rect = pymupdf.Rect(*clip) if clip else page.rect
    margin = 64 if framed else 0
    scale = min((W - 2 * margin) / rect.width, (H - 2 * margin) / rect.height)
    pix = page.get_pixmap(matrix=pymupdf.Matrix(scale, scale), clip=rect, alpha=False)
    art = Image.frombytes("RGB", (pix.width, pix.height), pix.samples)
    frame = Image.new("RGB", (W, H), BG)
    x, y = (W - art.width) // 2, (H - art.height) // 2
    if framed:
        # Soft warm shadow under the printed page, tinted to the background.
        shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        shadow.paste(Image.new("RGBA", art.size, (92, 72, 52, 70)), (x, y + 14))
        shadow = shadow.filter(ImageFilter.GaussianBlur(18))
        frame.paste(shadow, (0, 0), shadow)
    frame.paste(art, (x, y))
    return frame


def main():
    shutil.rmtree(OUT, ignore_errors=True)
    frames_dir = OUT / "frames"
    frames_dir.mkdir(parents=True)
    slides = [(render(b, i, c, f), hold) for b, i, hold, c, f in SLIDES]
    entries = []

    def emit(img, duration):
        path = (frames_dir / f"f{len(entries):05d}.jpg").as_posix()
        img.save(path, quality=95)
        entries.append((path, duration))

    steps = int(FADE * FPS)
    for k, (img, hold) in enumerate(slides):
        emit(img, hold)
        if k + 1 < len(slides):
            nxt = slides[k + 1][0]
            for s in range(1, steps + 1):
                emit(Image.blend(img, nxt, s / (steps + 1)), 1 / FPS)

    lines = []
    for path, duration in entries:
        lines += [f"file '{path}'", f"duration {duration:.4f}"]
    lines.append(f"file '{entries[-1][0]}'")  # the concat demuxer needs the last frame repeated
    listing = OUT / "frames.txt"
    listing.write_text("\n".join(lines))
    total = sum(d for _, d in entries)
    mp4 = OUT / "walkthrough.mp4"
    subprocess.run(
        [ffmpeg_path(), "-y", "-hide_banner", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", str(listing),
         "-t", f"{total:.3f}",
         "-vf", f"fps={FPS},scale=in_range=pc:out_range=tv,format=yuv420p", "-color_range", "tv",
         "-c:v", "libx264", "-profile:v", "high", "-preset", "slow", "-crf", "21", "-tune", "stillimage",
         "-movflags", "+faststart", "-an", str(mp4)],
        check=True,
    )
    print(f"typography-systems: {total:.1f} s\n  recording: {mp4}")
    if "--publish" in sys.argv:
        target = PUBLIC / "walkthrough.mp4"
        shutil.copyfile(mp4, target)
        print(f"  published: {target}")
    else:
        print("  Review it, then rerun with --publish to replace the published file.")


if __name__ == "__main__":
    main()

"""Builds the Typography Systems publication walkthrough from the original book
PDFs in public/projects/typography-systems: full compositions first, then
readable detail views. Slides change with gentle crossfades only (no pans or
zooms). This is a paced view of printed pages, not an interactive demo.

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
SRC = ROOT / "public" / "projects" / "typography-systems"
OUT = Path(os.environ.get("WALKTHROUGH_OUTPUT", ROOT / "scripts" / "walkthroughs" / ".output")) / "typography-systems"
W, H, FPS, FADE = 1920, 1200, 30, 0.6
BG = (234, 227, 215)  # type-band, the case study's band tone

B1, B2 = "book-1-typography.pdf", "book-2-one-x.pdf"
# (book, page index, hold seconds, detail clip in PDF points or None)
SLIDES = [
    (B1, 0, 2.0, None),   # Book 1 cover
    (B1, 1, 2.4, None),   # Two aligned compositions
    (B1, 3, 2.4, None),   # Diagonal and vertical type
    (B1, 10, 2.4, None),  # Blue field and pink block
    (B2, 0, 2.0, None),   # ONE-X front cover
    (B2, 3, 2.4, None),   # Adam Gontier (05) · Barry Stock (06)
    (B2, 5, 2.4, None),   # Matt Walst (09) · The five voices (10)
    (B2, 6, 2.4, None),   # Lyrics (11) · (12)
    # Readable detail views.
    (B1, 3, 3.4, (0, 300, 576, 660)),     # Diagonal description block
    (B2, 6, 3.4, (0, 140, 576, 500)),     # "I Hate Everything About You"
    (B2, 5, 3.8, (576, 150, 1152, 510)),  # The Five Voices and member list
]


def ffmpeg_path():
    if os.environ.get("FFMPEG_PATH"):
        return os.environ["FFMPEG_PATH"]
    found = shutil.which("ffmpeg")
    if found:
        return found
    import imageio_ffmpeg

    return imageio_ffmpeg.get_ffmpeg_exe()


def render(book, index, clip):
    page = pymupdf.open(SRC / book)[index]
    rect = pymupdf.Rect(*clip) if clip else page.rect
    margin = 0 if clip else 64
    scale = min((W - 2 * margin) / rect.width, (H - 2 * margin) / rect.height)
    pix = page.get_pixmap(matrix=pymupdf.Matrix(scale, scale), clip=rect, alpha=False)
    art = Image.frombytes("RGB", (pix.width, pix.height), pix.samples)
    frame = Image.new("RGB", (W, H), BG)
    x, y = (W - art.width) // 2, (H - art.height) // 2
    if not clip:
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
    slides = [(render(b, i, c), hold) for b, i, hold, c in SLIDES]
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
        target = SRC / "walkthrough.mp4"
        shutil.copyfile(mp4, target)
        print(f"  published: {target}")
    else:
        print("  Review it, then rerun with --publish to replace the published file.")


if __name__ == "__main__":
    main()

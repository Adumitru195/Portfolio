# Case-study walkthroughs

Tools for recording, reviewing and checking the silent walkthrough videos shown in the case studies. The player itself is `src/components/presentation/DemoVideo.tsx`, and each video's copy (heading, caption, description, length) lives in that project's `src/data/*.ts` file.

| Project | Video | How it's made |
| --- | --- | --- |
| Porchlight | `public/projects/porchlight/walkthrough.mp4` (~39 s) | `record-porchlight.mjs`, from the working prototype |
| Wovenward | `public/projects/wovenward/walkthrough.mp4` (~27 s) | `record-wovenward.mjs`, from the working prototype |
| Typography Systems | `public/projects/typography-systems/walkthrough.mp4` (~35 s) | `record-typography.py`, from the original book PDFs (a publication walkthrough, not a product demo) |
| Afterglow Cinema | `public/projects/afterglow-cinema/motion-demo.mp4` + `.webm` (~20 s) | Recorded earlier in the Afterglow repo (`docs/verification/motion-check.cjs`). These tools don't regenerate it. |
| AIC Museum Experience | none yet | Pending; see [Not recorded yet](#not-recorded-yet) |
| Backwater Journal | none yet | Pending; see [Not recorded yet](#not-recorded-yet) |

## Tools you need

- **Node.js 20.11+** (the site's own requirement).
- **Playwright with Chromium and WebKit**, installed here only, so the site build never pulls it in:
  ```bash
  npm install --prefix scripts/walkthroughs
  npx --prefix scripts/walkthroughs playwright install chromium webkit
  ```
- **ffmpeg with libx264 and libwebp**. The scripts look for `FFMPEG_PATH`, then `ffmpeg` on `PATH`, then the binary bundled with the Python package `imageio-ffmpeg` (`pip install imageio-ffmpeg`).
- **Python 3 with `pymupdf` and `pillow`**, for Typography Systems only (`pip install pymupdf pillow imageio-ffmpeg`).

Run every command from the portfolio root. Everything temporary (frames, contact sheets, check screenshots and reports, the portrait test clip, backups of replaced videos) goes to `scripts/walkthroughs/.output/`, which git ignores. Set `WALKTHROUGH_OUTPUT` to use another folder.

## Start the prototypes

The prototypes are sibling folders of this repo (`UX Projects/Porchlight`, `UX Projects/Wovenward`). These ports avoid 5173, which Porchlight uses by default, and 5200, used for the portfolio below:

```bash
# in UX Projects/Porchlight
npx vite --port 5181 --strictPort
# in UX Projects/Wovenward
npx vite --port 5190 --strictPort
```

To use other addresses, set `PORCHLIGHT_URL` and `WOVENWARD_URL`.

## Record

Each script writes `scripts/walkthroughs/.output/<project>/walkthrough.mp4` and leaves the published file alone. Review the result first, then rerun with `--publish` to copy it into `public/projects/<project>/`.

```bash
node scripts/walkthroughs/record-porchlight.mjs           # add --publish once reviewed
node scripts/walkthroughs/record-wovenward.mjs
python scripts/walkthroughs/record-typography.py
```

- **Porchlight:** searches "Charlotte"; filters to $2,500/mo, 2+ bedrooms and dogs allowed (11 homes → 3); opens the craftsman bungalow; requests an in-person tour for Friday, October 16 at 11:00 AM with a demo name and an example.com email; reviews and submits the request. It ends on "Tour request received." with its "Pending confirmation" status. The flow requests a tour; it never books or confirms one, and the copy should say so. The dates are relative to the prototype's 14-day window, so update the Friday chosen in the script, and the description in `src/data/porchlight.ts`, if you re-record later.
- **Wovenward:** filters by size L (12 pieces → 10), opens the Mock-Neck Jumper, scrolls the size guide, selects L, adds it to the bag and ends on the bag page, with the pointer clear of the line item.
- **Typography Systems:** eight full spreads and covers from both books, then three detail views, with 0.6 s crossfades. Edit the `SLIDES` list to change pages, hold times or crops (crops are in PDF points).

Recordings run at 1280 × 800 CSS pixels with a forced 1.5× scale, so the video is 1920 × 1200 and stays sharp in fullscreen. Headless Chromium has no cursor, so the recorder injects a small arrow and a soft press ring into the page. That overlay exists only in the recording browser.

### Demo data and cleanup

Every run uses a fresh, throwaway browser context: no saved profile, cookies or storage, and the scripts clear `localStorage` before recording. Both prototypes keep their data (tour requests, bag contents) in browser storage only, with no backend, so nothing persists after a run and there's nothing to clean up. Porchlight never stores the name or email, and the demo details are fictional (`example.com` is a reserved domain).

## Review before publishing

```bash
node scripts/walkthroughs/contact-sheet.mjs scripts/walkthroughs/.output/porchlight/walkthrough.mp4
```

This writes one frame per second to `.output/review/`. Check that:

- each action is easy to follow, and there's a pause after feedback (results count, dialogs, status);
- the pointer never rests on a label the viewer needs to read, especially at the end;
- the final screen stays up for at least about 3 seconds;
- text is readable at full size (open the MP4 fullscreen);
- the caption, description and `duration` in the project's data file still match what's on screen.

## Posters

Posters are 1600 × 1000 WebP frames taken from the published video:

```bash
node scripts/walkthroughs/poster.mjs porchlight            # first frame
node scripts/walkthroughs/poster.mjs wovenward             # first frame
node scripts/walkthroughs/poster.mjs typography-systems    # 6.2 s, the Book 1 diagonal spread
node scripts/walkthroughs/poster.mjs <project> --at 12.5 --from-output   # any frame of an unpublished take
```

If the poster shows something new, update its `alt` text in the data file.

## Where final media belongs

`public/projects/<project>/walkthrough.mp4` and `walkthrough-poster.webp`, referenced from the data files as `/Portfolio/projects/<project>/…` (the GitHub Pages base path). Keep the filenames stable so links and caches don't break. Don't edit or delete other assets in those folders.

## Player checks

Start the portfolio (`npx vite --port 5200 --strictPort` from the repo root; set `PORTFOLIO_URL` for another address), then run:

```bash
node scripts/walkthroughs/verify-players.mjs            # Chromium, then WebKit
node scripts/walkthroughs/verify-players.mjs chromium   # or one engine
```

For every player, it checks:

- no autoplay, and no media request before play;
- the 16:10 frame before load;
- focus ring and keyboard play;
- native controls after the first play;
- pause, seeking and the time readout;
- fullscreen entry and exit with the position kept, and `object-fit: contain`;
- replay;
- no horizontal overflow at 390 px;
- the load-error message with an Open video link;
- the Open video link when fullscreen is unavailable.

It also generates a temporary 720 × 1280 portrait clip, swaps it into one player inside the test browser only, and checks it stays portrait and uncropped, both inline and fullscreen. That clip is never published. Results and screenshots go to `.output/verify/`, and the command exits non-zero if any check fails.

Playwright's WebKit build is not Safari. Treat real iPhone Safari, desktop Safari and Firefox as unverified until someone checks them on real devices and browsers. A load failure that WebKit never reports as an error falls back to the Open video link after 12 seconds.

## Not recorded yet

These are internal notes, so don't add placeholder players or public messages to the case studies.

- **AIC Museum Experience:** an interactive recording needs a working Figma prototype link that opens without signing in. Neither the repo nor the case-study PDF has one. Record only the prototype's real onboarding, events and collection interactions; don't stitch static screens into fake navigation. If only the static screens are available, a separately labeled concept walkthrough (like Typography's publication walkthrough) is possible, but it must not be presented as a working prototype.
- **Backwater Journal:** it's an iOS app, so it needs a real recording made on an iPhone (iOS screen recording) or an iOS simulator, using a demo account with fictional catches. It should show Dock, Explore, catch logging and the species collection, with no private messages, credentials or real location details, and any demo catches saved only in a disposable environment. Don't install `react-native-web`, change the app's architecture, create a backend or edit its `.env` files just to record it. Once a recording exists, convert it to H.264 MP4 (keep it portrait), put it in `public/projects/backwater-journal/`, and add a `walkthrough` entry the same way as Porchlight. The player keeps portrait video portrait.

# Backwater Journal 1.2.0: screenshot capture guide

Captures for the portfolio's Backwater Journal case study, the homepage feature and the About page.

## Ground rules

- **Authentic only.** Capture from the App Store build installed on your iPhone. Before you start, confirm it's 1.2.0: **Settings → General → iPhone Storage → Backwater Journal** shows the version.
- **No editing.** Don't crop, scale, retouch, recolor, combine or annotate the originals. I'll make web versions from them with a script and record where each came from.
- **Never update an old image.** Don't edit an older screenshot to look current. Older screenshots stay only where they document history, like the Explore before-and-after.
- **Use an example account.** Use a demo account with sample content, like the earlier screenshots, so nothing reads as real usage figures. Don't show other people's names, faces, usernames or messages unless they've agreed (ideally use your own demo accounts).

## Device and capture settings

- **One device.** Use the same iPhone for every shot, so frames and proportions match. The earlier set came from a Dynamic Island iPhone.
- **Method.** Press the side button and volume up together. That saves a full-resolution PNG at the device's native size, which is what I need:

  | iPhone | Native screenshot |
  |---|---|
  | 14 Pro, 15, 15 Pro, 16 | 1179 × 2556 |
  | 16 Pro | 1206 × 2622 |
  | 14 Pro Max, 15 Plus, 15 Pro Max, 16 Plus | 1290 × 2796 |
  | 16 Pro Max | 1320 × 2868 (also App Store 6.9") |

- **Long screens.** Take several screenshots in order (e.g. `outlook-1`, `outlook-2`). Don't use iOS full-page captures; they come out as PDFs.
- **Status bar.** Full or near-full battery. Low Power Mode off (it turns the battery yellow). Wi-Fi connected. No screen recording, hotspot or call indicators. Clear any notification banners from other apps before each shot.
- **Appearance.** Light mode for the main set, to match the existing screens. For dark mode (a 1.2.0 change), take a matching dark-mode version of the Dock and the species collection.
- **Text size.** Default system text size and display zoom.
- **Files.** Save the originals to `UX Projects/Backwater Journal/screenshots/1.2.0/`, named like `1.2.0-activity-all.png`. Add a short note with the capture date and the iPhone model.

## iPhone checklist, in order

Work through this on your iPhone, top to bottom. Light mode unless the line says dark. One screenshot is the side button plus volume up.

**Before you start**
- [ ] Settings → General → iPhone Storage → Backwater Journal shows **1.2.0**.
- [ ] Signed in to the **demo account**.
- [ ] Battery full or near-full, **Low Power Mode off**, Wi-Fi on.
- [ ] Location set to a **public** lake or park, not home.
- [ ] No other app's notifications on screen.

**Captures**
1. [ ] **Activity, All:** Dock → bell. Mixed items, a few unread. `1.2.0-activity-all.png`
2. [ ] **Activity, Unread:** tap Unread. `1.2.0-activity-unread.png`
3. [ ] **Fishing Outlook, top:** Dock → View Conditions. `1.2.0-outlook-1.png`
4. [ ] **Fishing Outlook, days:** scroll until the day rows and disclaimer show. `1.2.0-outlook-2.png`
5. [ ] **Dock, top:** Dock tab, scrolled to the top. `1.2.0-dock-top.png`
6. [ ] **Dock, community:** scroll to a shared post. `1.2.0-dock-community.png`
7. [ ] **Dock, dark:** switch to dark mode, repeat shot 5, switch back. `1.2.0-dock-top-dark.png`
8. [ ] **Profile color picker:** Profile → Edit profile → color, all four shown, one selected. `1.2.0-profile-colors.png`
9. [ ] **Profile header:** back on Profile, header in a non-default color. `1.2.0-profile-header.png`
10. [ ] **Notification settings:** Activity → gear. Push on, toggles visible. `1.2.0-notifications-1.png`
11. [ ] **Notification settings, rest:** scroll, if the list continues. `1.2.0-notifications-2.png`
12. [ ] **Species collection:** Journal → species, Caught. At least four cards. `1.2.0-species.png`
13. [ ] **Species detail:** open one species. `1.2.0-species-detail.png`
14. [ ] **Species, dark:** dark mode, repeat shot 12, switch back. `1.2.0-species-dark.png`

**Optional**
15. [ ] **New Catch:** Catch Basics at the top. Check: is Primary Species the only required field? Does Add Photos still say "Up to 10 photos"? Write both answers down. `1.2.0-new-catch.png`
16. [ ] **Explore:** the current map screen. `1.2.0-explore.png`
17. [ ] **Market:** the current Market screen. `1.2.0-market.png`

**Before you send them**
- [ ] Zoom into each one: no real names, faces, messages, email, phone number or home location.
- [ ] Put them in `UX Projects/Backwater Journal/screenshots/1.2.0/` with a note of the date and the iPhone model.

## Placement plan (for review once the images exist)

These are slots in the current design. Nothing is replaced until authentic captures exist and you've reviewed them on desktop and mobile.

| Capture | Proposed slot | Replaces |
|---|---|---|
| Dock (top) | Case study opening, phone 1; homepage Backwater feature, front phone | Pre-1.0 Dock |
| Activity center (All) | Case study opening, phone 2 | Explore (after 1.1.0) |
| Species collection | Section 04, large phone 1 | Pre-1.0 Species |
| Fishing Outlook (days) | Section 04, large phone 2 | Pre-1.0 shared Dock post |
| New Catch (optional) | Section 04 catch-logging block, once the two checks above are confirmed | Pre-1.0 New Catch |
| Profile colors, Notification settings | Section 05, version 1.2.0 card. This would be a new visual and needs your approval | — |
| Explore (optional) | Homepage hero phone and homepage feature, back phone; then regenerate `og-image.png` | Explore (after 1.1.0) |

**Kept as they are:**
- the Explore before-and-after in section 03, which documents the 1.1.0 redesign;
- the About page's App Store frames, which are story imagery, unless you make 1.2.0 App Store frames.

## Shot list, in priority order

Navigation paths come from the 1.2.0 source and are approximate. The installed app is the authority.

### 1. Activity center (new in 1.2.0)

- **Where:** Dock → the bell icon at the top → Activity.
- **Screen state:**
  - the **All** filter, showing several kinds of item (a like, a comment, a new follower, a new catch from someone you follow);
  - a few items unread, so the unread styling and **Mark all read** both show.
- **Also capture:**
  - the **Unread** filter;
  - the empty state (**No activity yet**), on a fresh demo account if it's easy.
- **Hide:**
  - names, avatars and usernames of real people (use demo accounts);
  - comment text you don't want public;
  - any catch location in a preview.

### 2. Fishing Outlook (improved in 1.2.0)

- **Where:** Dock → Fishing Conditions card → **View Conditions** → scroll to the Fishing Outlook days.
- **Screen state:** clear weather data and an outlook rating. Scroll so the day-by-day rows **and** the outlook disclaimer are visible.
- **Also capture:** the top of the Conditions screen (rating, bite window, wind, sunrise and sunset, pressure, rain).
- **Hide:**
  - your home town and your usual spots. Set the location to a well-known public lake or park first; the old Dock screenshot shows "Calm in Northfield this evening";
  - exact coordinates or a precise map position.

### 3. Updated Dock

- **Where:** the Dock tab, scrolled to the top.
- **Screen state:** the greeting, the statistics row, and a Fishing Conditions card with a rating. Then scroll to show a shared community post.
- **Dark mode:** repeat the top of the Dock.
- **Hide:**
  - the location in the conditions summary (use a public location, as above);
  - real catch counts, if this isn't a demo account;
  - other anglers' identities in community posts.

### 4. Profile customization (new in 1.2.0)

- **Where:** Profile → Edit profile (profile settings) → profile color.
- **Screen state:**
  - the color picker with all four colors (**Pine Green, Navy Blue, Maroon, Gold**) and one selected;
  - then the profile screen with its header in a **non-default** color.

  Optionally, take the same profile in two colors.
- **Hide:**
  - your email address and phone number;
  - your real profile photo, if you'd rather keep it private (use the demo avatar);
  - bio details and location text;
  - names in follower and following lists.

### 5. Notification preferences (new in 1.2.0)

- **Where:** Activity → the settings (gear) button. You can also get there from Profile → Settings → Notifications.
- **Screen state:**
  - **Push notifications** showing *Notifications are on for this device*;
  - the toggles visible: New followers, Comments on my catches & journal posts, Direct messages, Message previews, New catches from anglers I follow, New journal posts from anglers I follow;
  - a realistic mix of on and off.

  Take a second screenshot if the list scrolls.
- **Optional:** the permission-off state (*Notifications are off in your device settings*, with **Open Settings**). It's good UX evidence of how the app explains a blocked permission.
- **Hide:** nothing sensitive is expected here. Check that no message preview shows real text.

### 6. Updated species collection

- **Where:** Journal tab → species collection, with the **Caught** filter.
- **Screen state:** at least four species cards with the **updated 1.2.0 artwork**, counts and best catches. Then open one species to show the redesigned detail screen.
- **Dark mode:** repeat the collection view.
- **Hide:** catch locations and exact dates in the species detail, if they reveal your spots.

### Also useful, lower priority

- **New Catch (1.2.0):** refreshes the catch-logging evidence. **Catch Basics** should be at the top, with **Add Photos**, the **Primary Species** field and the **date and time** row visible.

  While you're there, **confirm on the device**:
  - that Primary Species is still the only required field;
  - that Add Photos still says *Up to 10 photos*.
  
  The 1.2.0 source suggests both, but the source isn't proof of the shipped build.
- **Explore (1.2.0):** shows the current product. It doesn't replace the 1.1.0 "after" screenshot, which documents the redesign.
- **Market (1.2.0):** the current Market screen, with sample listings if there are any.

## What happens next

1. You add the originals and the capture note.
2. I make the web versions with a script (the originals stay untouched) and record each one's capture date in the code. The current framed screens were cut from App Store marketing frames, which already include a phone mockup. Raw screenshots don't. So the options for presenting the new ones are a CSS device frame or new App Store frames made first. That's a design decision for your review.
3. We review where they go on desktop and mobile before anything is published.

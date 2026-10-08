---
name: CampusConnect
description: Campus opportunities, free time and growth under an indigo-night aurora.
colors:
  bg: "#070918"
  bg-deep: "#04050f"
  workspace: "#080a1d"
  surface-1: "#0f1230"
  surface-2: "#171b42"
  surface-3: "#1f2454"
  field: "rgb(10 12 34 / 0.72)"
  line: "rgb(150 160 255 / 0.13)"
  line-strong: "rgb(160 170 255 / 0.26)"
  text: "#eef0ff"
  text-2: "#c4c8ec"
  muted: "#9ea3d2"
  faint: "#8186b9"
  mint: "#7cf5c4"
  mint-hi: "#b2ffe2"
  mint-deep: "#1d6b55"
  on-mint: "#03251a"
  mint-soft: "rgb(124 245 196 / 0.12)"
  violet: "#a594ff"
  violet-deep: "#4b3cc2"
  violet-soft: "rgb(157 140 255 / 0.14)"
  cyan: "#6fd6ff"
  cyan-deep: "#1b5d99"
  cyan-soft: "rgb(95 208 255 / 0.13)"
  coral: "#ff9a82"
  coral-deep: "#9a3b28"
  coral-soft: "rgb(255 138 112 / 0.13)"
  on-coral: "#2b0800"
  pink: "#ff8fd4"
  chart-cyan: "#3593cc"
  chart-mint: "#2ea57a"
  chart-violet: "#8b7bff"
  sentiment-neutral: "#6b7099"
  sentiment-constructive: "#d9604a"
typography:
  display:
    fontFamily: '"Space Grotesk Variable", "Segoe UI", system-ui, sans-serif'
    fontSize: "clamp(60px, 6.45vw, 91px)"
    fontWeight: 500
    lineHeight: 1.045
    letterSpacing: "-0.04em"
  headline:
    fontFamily: '"Space Grotesk Variable", "Segoe UI", system-ui, sans-serif'
    fontSize: "clamp(30px, 3vw, 40px)"
    fontWeight: 500
    lineHeight: 1.12
    letterSpacing: "-0.035em"
  section:
    fontFamily: '"Space Grotesk Variable", "Segoe UI", system-ui, sans-serif'
    fontSize: "22px"
    fontWeight: 500
    letterSpacing: "-0.035em"
  title:
    fontFamily: '"Space Grotesk Variable", "Segoe UI", system-ui, sans-serif'
    fontSize: "20px"
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: "-0.035em"
  figure:
    fontFamily: '"DM Sans Variable", "Segoe UI", system-ui, sans-serif'
    fontSize: "32px"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.02em"
    fontFeature: '"tnum"'
  body:
    fontFamily: '"DM Sans Variable", "Segoe UI", system-ui, sans-serif'
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: '"DM Sans Variable", "Segoe UI", system-ui, sans-serif'
    fontSize: "13px"
    fontWeight: 500
    lineHeight: 1.5
  action:
    fontFamily: '"DM Sans Variable", "Segoe UI", system-ui, sans-serif'
    fontSize: "14px"
    fontWeight: 600
    lineHeight: 1.4
rounded:
  focus: "6px"
  sm: "10px"
  button: "12px"
  card-inner: "14px"
  toast: "16px"
  surface: "18px"
  dialog: "22px"
  pill: "100px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  card: "20px"
  panel: "22px"
  dialog: "28px"
  workspace: "40px"
  landing: "48px"
components:
  button-primary:
    backgroundColor: "{colors.mint}"
    textColor: "{colors.on-mint}"
    typography: "{typography.action}"
    rounded: "{rounded.button}"
    padding: "14px 22px"
  button-primary-hover:
    backgroundColor: "{colors.mint-hi}"
  button-secondary:
    textColor: "{colors.text}"
    typography: "{typography.action}"
    rounded: "{rounded.button}"
    padding: "14px 22px"
  button-danger:
    backgroundColor: "{colors.coral}"
    textColor: "{colors.on-coral}"
    rounded: "{rounded.button}"
    padding: "14px 22px"
  button-small:
    rounded: "{rounded.sm}"
    padding: "9px 14px"
  form-field:
    backgroundColor: "{colors.field}"
    textColor: "{colors.text}"
    rounded: "{rounded.sm}"
    padding: "11px 13px"
  pill:
    textColor: "{colors.text-2}"
    rounded: "{rounded.pill}"
    padding: "6px 12px"
  pill-mint:
    backgroundColor: "{colors.mint-soft}"
    textColor: "{colors.mint}"
    rounded: "{rounded.pill}"
  pill-violet:
    backgroundColor: "{colors.violet-soft}"
    textColor: "{colors.violet}"
    rounded: "{rounded.pill}"
  pill-coral:
    backgroundColor: "{colors.coral-soft}"
    textColor: "{colors.coral}"
    rounded: "{rounded.pill}"
  workspace-navigation:
    textColor: "{colors.muted}"
    rounded: "11px"
    padding: "11px 12px"
  glass-card:
    rounded: "{rounded.surface}"
    padding: "18px 20px 20px"
  stat-tile:
    typography: "{typography.figure}"
    rounded: "{rounded.surface}"
    padding: "18px 20px"
  dialog:
    textColor: "{colors.text}"
    rounded: "{rounded.dialog}"
    padding: "28px"
---

# Design System: CampusConnect

## Overview

**Creative North Star: "Aurora over the campus"**

CampusConnect lights an indigo-night canvas with a moving band of aurora: violet at the outer edge, cyan through the middle, mint at the core. The hue progression carries meaning. Violet is growth and intelligence, cyan is time, mint is the moment something fits your day and the action that claims it. The pointer is part of the light: Canvas ribbons lean toward it on the landing, and every glass surface catches a soft spotlight where the cursor rests.

There are two surfaces with one material. The landing (Persuade) is spacious and theatrical: a masked headline rises line by line, a perspective opportunity card tilts with the pointer, and authored orbital art floats around it. The workspace, sign-in and status screens (Operate) keep the same glass, palette and light, but the aurora becomes a slow drifting field and motion is reserved for state changes: seats counting down, a ticket stamping on, a waitlist moving, bars filling.

The product is a connected MERN app (Express and MongoDB API, JWT sessions, optional Groq AI). The interface says plainly which engine answered and where data is demonstrative.

**Key Characteristics:**

- Indigo-night glass lit by a violet, cyan and mint aurora.
- Colour carries role: mint acts, violet grows, cyan tells time, coral warns.
- Pointer-reactive light: Canvas ribbons on the landing, a cursor spotlight on glass everywhere.
- Authored orbital, cube, step and wave art in CSS; no stock imagery.
- Expressive Persuade surface, quiet Operate surface, one material.
- Motion explains state; reduced motion keeps colour and opacity feedback and drops movement.

## Colors

A deep blue-violet night with four luminous signal colours and a separately tuned, darker chart palette. Frontmatter values are normative and match the `:root` custom properties in `frontend/src/index.css`; the chart palette lives in `frontend/src/styles/workspace.css`.

### Primary

- **Fit Mint** (`mint`): primary buttons, selected filter and day chips, active navigation marker, focus ring, caret, "fits your day" availability, confirmed tickets, the live dot.
- **Mint Glow** (`mint-hi`): primary button hover and inline code text.
- **Mint Ink** (`on-mint`): text and icons on any mint fill.
- **Mint Wash** (`mint-soft`) and **Mint Depth** (`mint-deep`): tinted pill and focus-halo fills; avatar-stack and art shadows.

### Secondary

- **Growth Violet** (`violet`): skills and growth, the AI assistant and "Groq AI on" chip, waitlist tickets and queues, hover borders on chips and fields, selection highlight, empty-state icons. **Violet Depth** (`violet-deep`) and **Violet Wash** (`violet-soft`) are its shadow and tint.

### Tertiary

- **Time Cyan** (`cyan`): "today" tags, time windows, schedule information. **Cyan Depth** and **Cyan Wash** support it.
- **Signal Coral** (`coral`): conflicts, form errors, the API-offline status icon, the destructive button, error toasts. Text on coral fills uses **Coral Ink** (`on-coral`). **Coral Depth** and **Coral Wash** support it.
- **Event Pink** (`pink`): only an event and community tone for artwork variety; it never signals state.

### Neutral

- **Night** (`bg`) and **Deep Night** (`bg-deep`): the landing, auth and status canvas; scrollbar track.
- **Workspace Night** (`workspace`): the Operate shell canvas.
- **Surface 1 / 2 / 3** (`surface-1`, `surface-2`, `surface-3`): ascending tonal layers for selects, code, active tabs and scrollbar thumbs.
- **Field Night** (`field`): translucent form-control fill.
- **Glass Line / Strong Line** (`line`, `line-strong`): resting outlines and dividers; outlines on interactive or raised elements.
- **Starlight** (`text`), **Haze** (`text-2`), **Dusk** (`muted`), **Faint** (`faint`): primary reading, secondary reading, descriptions and metadata, placeholders and quiet chrome.

### Chart palette

Bars and sentiment use darker, lower-chroma hues than the signal colours so long fills stay readable next to direct labels: **Chart Cyan** (`chart-cyan`), **Chart Mint** (`chart-mint`, also the positive sentiment), **Chart Violet** (`chart-violet`), plus **Neutral Sentiment** (`sentiment-neutral`) and **Constructive Sentiment** (`sentiment-constructive`). Each bar track is its hue at 16% opacity.

Validated with the dataviz palette checker in dark mode against both ends of the chart-panel surface (`#0c0f28` and `#181b42`): the three bar hues pass every check (lightness band, chroma, CVD and normal-vision separation, contrast). The sentiment set passes everything except chroma on the neutral gray, which is intentional: it is the gray midpoint of a diverging positive → constructive scale, and every segment carries a legend label and count.

**The Role Rule.** Mint means action or "this fits" and nothing else. Violet means growth, intelligence or waitlist. Cyan means time. Coral means conflict, error or destruction. Event tones (mint, violet, peach→coral, blue→cyan, pink) colour artwork and hover accents only.

**The Words-Too Rule.** Every coloured status carries a word or icon beside it: pills say what they mean, tickets say "confirmed" or show a queue position, charts carry direct value labels and a table view.

## Typography

**Display Font:** Space Grotesk Variable (with Segoe UI, system-ui, sans-serif)
**Body Font:** DM Sans Variable (with Segoe UI, system-ui, sans-serif)
**Code:** ui-monospace / Cascadia Code / Consolas, only for inline code.

**Character:** Space Grotesk gives headings a compact, technical edge with tight negative tracking; DM Sans keeps everyday decisions warm and readable. Both are bundled locally through Fontsource.

### Hierarchy

- **Display** (500, clamp(60px, 6.45vw, 91px), 1.045): the landing hero only, set in masked lines. It steps to fixed sizes at each landing breakpoint and to clamp(42px, 13.5vw, 60px) on small phones.
- **Headline** (500, clamp(30px, 3vw, 40px), 1.12): workspace page titles and status-screen titles. Landing section headings are larger (43px) and auth uses clamp(38px, 4.4vw, 60px) for its story line.
- **Section** (500, 22px): section headings inside the workspace.
- **Title** (500, 20px, 1.25): opportunity card titles; chart and proposal headings use 17px.
- **Figure** (DM Sans 600, 32px, 1.1, tabular numerals): stat tiles; 26px under 520px. Free-time figures go much larger (clamp(54px, 6vw, 80px)).
- **Body** (400, 14px, 1.7): operational paragraphs, wrapped with `text-wrap: pretty`. Page intros use 15px; status copy is capped at 52ch.
- **Label** (500, 13px): form labels, stat labels, chips, metadata. Pills, tooltips and footers use 12px.
- **Action** (600, 14px, 1.4): buttons; small buttons use 13px.

**The Tabular Numbers Rule.** Counts, seats, queues, chart values and tables use tabular numerals so animated values do not jitter.

## Layout

The **Persuade** landing centres a two-column hero (1.05fr / 1fr) at a 1440px maximum, with 76px 72px 100px padding and a 730px minimum height. The nav caps at 1360px; later sections share a 1296px wrapper with 48px side padding.

The **Operate** workspace has a fixed glass sidebar (260px) and a sticky blurred header (72px). Content is centred at a 1480px maximum with 38px 40px 60px padding (56px side padding at 1600px and above). Opportunity grids auto-fill 290px-minimum columns with 20px gaps; stat rows are four columns; analytics panels are two columns. Auth centres a story column beside a 360–480px card within 1240px.

Breakpoints are co-located with each stylesheet: 1600px (min), and 1280, 1180, 960, 760, 520 and 360px (max). At 1280px stat rows and Today picks go to two columns. At 1180px the sidebar narrows to 232px and multi-panel pages stack. At 960px analytics and admin layouts stack and landing links hide. At 760px the sidebar becomes an off-canvas drawer with a blurred scrim, the header drops to 62px and content padding falls to 24px 16px. At 520px grids go single-column, stat tiles go two-up, and bar charts move their track under the label. The document minimum width is 320px.

Spacing follows an informal 4px rhythm: 8, 12, 16 and 20px inside components, 22px chart panels, 28px dialogs, 40px workspace gutters and 48px landing gutters. Section headings sit 48px below the previous block.

## Elevation & Depth

Depth is mostly material and light rather than shadow. Glass is a 145° translucent indigo gradient, a Glass Line border and `backdrop-filter: blur(22px) saturate(1.3)`. Behind Operate screens, a fixed **aurora field** of three blurred radial glows (violet, cyan, mint) drifts over 26s. Shadows are soft, dark-indigo and diagonal, and appear on floating or raised objects and on hover.

### Shadow Vocabulary

- **Card lift** (`box-shadow: 0 24px 50px rgb(2 2 14 / 0.45)`): opportunity card hover, with a 4px rise.
- **Primary glow** (`box-shadow: 0 1px 0 rgb(255 255 255 / 0.4) inset, 0 10px 28px rgb(124 245 196 / 0.22)`): primary button hover. At rest it keeps only the inset highlight.
- **Dialog** (`box-shadow: 10px 40px 100px rgb(0 0 0 / 0.6)`): modals above a blurred `rgb(3 4 14 / 0.62)` backdrop.
- **Auth card** (`box-shadow: 0 40px 100px rgb(0 0 0 / 0.45)`): the sign-in card.
- **Toast** (`box-shadow: 0 20px 60px rgb(0 0 0 / 0.5)`): top-layer notifications.
- **Hero float** (`box-shadow: 0 1px 0 rgb(255 255 255 / 0.08) inset, 14px 34px 80px rgb(2 2 12 / 0.6)`): the landing's tilting opportunity card.
- **Signal glow** (`box-shadow: 0 0 14px var(--mint)` and violet equivalents): the active navigation marker, live dot, assistant orb. Light, not elevation.

**The Spotlight Rule.** Every `.glass` or `.spot` surface paints a 420px violet-to-cyan radial light at the cursor (`--sx`/`--sy`, written by one delegated pointer listener for fine pointers only). It is screen-blended at 10% and fades in on hover; it never replaces a border or state colour.

**The Quiet Workspace Rule.** The Canvas ribbons, tilting card and particle field belong to the landing. Operate screens get only the drifting aurora field (halved by `.quiet`) and the spotlight.

## Shapes

Corners are soft and generous. Glass surfaces and stat tiles use 18px; dialogs 22px; toasts and tickets 16px; inner cards, tabs and demo-account rows 14px; buttons 12px; fields, small buttons and icon buttons 10px; focus outlines 6px. Pills, chips, tags and filters are full capsules. Avatars, the toast icon, ticket stub and orbs are circles. Bar tracks are square at the origin and rounded at the end (0 4px 4px 0). Tickets use a dashed border to read as a stub. Artwork is authored CSS geometry (orbit rings built from masked gradient borders, isometric cubes, skewed steps, ripple rings) tinted by per-tone `--art-*` variables.

## Components

### Buttons

Confident and luminous.
- **Shape:** gently rounded (12px); small buttons 10px.
- **Primary:** mint fill with mint-ink text, 14px 22px padding, 600 weight, and a 1px inset top highlight.
- **Hover / Focus:** Mint Glow fill, 2px rise, mint glow shadow, a white light sweep crossing the face over 0.7s, and the trailing icon nudging 3px. Active presses to scale 0.98. Focus is the global 2px mint outline at 4px offset.
- **Secondary:** a faint indigo fill with a Strong Line border and a violet-tinted sweep; hover brightens the fill and turns the border violet.
- **Danger:** coral fill with coral-ink text, hovering to a lighter coral with a coral glow.
- **Text / Icon buttons:** text buttons turn mint on hover with a sliding arrow; 38px icon buttons gain a faint indigo fill and press to 0.92.

### Chips

- **Style:** capsule, Strong Line border, Haze text (12–13px). Tone pills (mint, violet, coral) use the hue's text, a 30% hue border and its wash fill.
- **State:** filter, day and interest chips turn the border violet on hover and fill solid mint with mint-ink 600 text when selected. The AI chip turns violet when Groq AI is on.

### Cards / Containers

- **Corner Style:** 18px (glass).
- **Background:** the shared glass gradient; feature panels layer mint and violet radial washes over it.
- **Shadow Strategy:** none at rest; card lift on hover (see Elevation & Depth).
- **Border:** Glass Line. On hover the border mixes toward the card's tone (45%) and the title takes the tone colour. Featured cards hold a 35% tone border.
- **Internal Padding:** 18px 20px 20px for opportunity cards; 22px for chart panels; 32px for the Today window.
- **Entrance:** cards and list rows rise in with a stagger capped at eight items (`min(var(--i), 8)` × 50–60ms).

### Inputs / Fields

- **Style:** Field Night fill, Strong Line border, 10px radius, 11px 13px padding, 14px text, faint placeholder. Labels sit above in 13px Haze.
- **Focus:** the border turns mint with a 4px mint halo at 12%, and the fill deepens. Icon fields colour their icon mint while focused. Hover turns the border violet.
- **Error:** a coral-wash panel with a coral icon and light-coral text that shakes once on entry.

### Navigation

- **Workspace:** vertical sidebar links (14px, Dusk text, 11px radius) brighten on hover. The active link takes a mint-to-transparent gradient, a mint icon and a 3px glowing mint marker that scales in from the edge. Current page uses `aria-current`.
- **Header:** a sticky blurred bar with breadcrumb, the fixed campus-clock chip and the AI-engine chip.
- **Mobile:** at 760px the sidebar slides in as a drawer over a blurred scrim. A skip link reaches the main content.
- **Landing:** a quiet 13px link row that turns mint on hover, plus the primary entry action.

### Dialogs and Toasts

Native `<dialog>` modals (560px; wide 700px) use a 160° indigo gradient, Strong Line border and 22px radius, and enter with a short rise, scale and de-blur. Toasts live in the top layer (`popover="manual"`), slide up from the corner, pop their mint (or coral) icon, and show a 2px violet-to-mint timer bar that drains over 4.8s.

### Tickets and queues

On registration a dashed mint ticket slides in and a circular stub stamps down (scale 2.2 and rotated, then settling). Waitlisted tickets use violet. Seat and queue numbers tween with an ease-out-quart counter (650ms) instead of swapping.

### Analytics

Stat tiles show a violet-iconed label, a 32px figure and a note, and rise in staggered. Horizontal bar charts use the chart palette, fill from the left with a 70ms stagger, carry direct right-aligned values, and show detail in a dark tooltip on hover (`[data-tip]`). Each chart has a collapsible table view. Sentiment is a stacked bar with a labelled legend.

### Aurora signature

The landing Canvas draws 34 perspective ribbon bands (16 in quiet mode) whose hue walks from 262° (violet) to about 160° (mint), plus 45 drifting particles. Both lean toward the pointer with eased lag. The hero headline lines rise out of clip masks, the highlighted word draws a violet underline, and the opportunity card tilts and catches a sheen with the pointer. A pause control and `prefers-reduced-motion` freeze the Canvas into a static frame, remove transforms, stop the aurora drift and cut animations to an instant, while colour, border, opacity and shadow transitions remain (0.15s).

### Status screens

The splash spins the brand mark's two orbit rings in opposite directions. The API-offline screen centres a coral icon, a headline and numbered recovery steps over the aurora field.

## Do's and Don'ts

### Do:

- **Do** keep the role map strict: mint for action and "fits your day", violet for growth, AI and waitlist, cyan for time, coral for conflicts, errors and destructive actions.
- **Do** build new panels from the shared glass (18px, Glass Line, 22px blur) so the cursor spotlight works on them.
- **Do** use the chart palette (`#3593cc`, `#2ea57a`, `#8b7bff`; sentiment `#2ea57a` / `#6b7099` / `#d9604a`) for data, with direct labels and a table view, never the brighter signal colours.
- **Do** cap staggered entrances at eight items and use the shared ease-out curve (`cubic-bezier(0.16, 1, 0.3, 1)`).
- **Do** animate changes in numbers and state (counter, stamp, bar fill), and keep a colour or opacity cue for reduced motion.
- **Do** label which engine produced AI output ("Answered by Groq AI" vs "Rule-based answer", "Read by Groq AI" vs "Parsed from text") and keep the campus-clock chip's "fixed for the demo" disclosure.
- **Do** keep visible focus (2px mint outline), the skip link, native dialog semantics and the motion pause control.

### Don't:

- **Don't** use mint for decoration, progress or growth. If it is mint, it is clickable or it fits.
- **Don't** make colour or animation the only signal for status, conflict or position.
- **Don't** bring the landing's Canvas ribbons, tilting card or particles into Operate screens; they get the drifting aurora field only.
- **Don't** replace authored orbital geometry with photos, stock illustration or icon fonts.
- **Don't** present demo data, the fixed campus clock or rule-based answers as live or AI-generated.
- **Don't** set operational copy below the 12px label size; the landing's 7–10px illustration captions are not a pattern.

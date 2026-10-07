---
name: CampusConnect
description: A campus constellation of opportunities, time and growth.
colors:
  midnight: "#080f13"
  surface: "#101c22"
  text: "#eaf2ef"
  muted: "#a6b9b8"
  mint: "#b8f4d6"
  violet: "#bcabf2"
  peach: "#f1be9f"
  line: "rgba(187, 215, 213, 0.13)"
  workspace: "#0a1217"
  action-ink: "#102820"
  mint-hover: "#d3ffe8"
  secondary-text: "#d7e9e4"
  secondary-fill: "#b9dcd009"
  field-fill: "#0f1c1d7a"
  field-text: "#e2eee6"
typography:
  display:
    fontFamily: '"Space Grotesk Variable", sans-serif'
    fontSize: "clamp(60px, 6.45vw, 91px)"
    fontWeight: 500
    lineHeight: 1.045
    letterSpacing: "-0.04em"
  headline:
    fontFamily: '"Space Grotesk Variable", sans-serif'
    fontSize: "34px"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "-0.035em"
  title:
    fontFamily: '"Space Grotesk Variable", sans-serif'
    fontSize: "21px"
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "-0.035em"
  body:
    fontFamily: '"DM Sans Variable", sans-serif'
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: '"DM Sans Variable", sans-serif'
    fontSize: "12px"
  action:
    fontFamily: '"DM Sans Variable", sans-serif'
    fontSize: "14px"
    fontWeight: 600
    lineHeight: 1.4
rounded:
  focus: "4px"
  compact: "6px"
  field: "7px"
  button: "8px"
  surface: "16px"
  pill: "100px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  card: "20px"
  mobile: "24px"
  dialog: "28px"
  panel: "30px"
  workspace: "40px"
  landing: "48px"
components:
  button-primary:
    backgroundColor: "{colors.mint}"
    textColor: "{colors.action-ink}"
    typography: "{typography.action}"
    rounded: "{rounded.button}"
    padding: "15px 23px"
  button-primary-hover:
    backgroundColor: "{colors.mint-hover}"
  button-secondary:
    backgroundColor: "{colors.secondary-fill}"
    textColor: "{colors.secondary-text}"
    typography: "{typography.action}"
    rounded: "{rounded.button}"
    padding: "15px 23px"
  text-button:
    textColor: "{colors.text}"
    padding: "0"
  form-field:
    backgroundColor: "{colors.field-fill}"
    textColor: "{colors.field-text}"
    rounded: "{rounded.field}"
    padding: "11px 13px"
  pill:
    rounded: "{rounded.pill}"
    padding: "6px 11px"
  workspace-navigation:
    rounded: "{rounded.button}"
    padding: "11px 12px"
  glass-card:
    rounded: "{rounded.surface}"
    padding: "20px"
---

# Design System: CampusConnect

## Overview

**Creative North Star: "Campus constellation"**

CampusConnect joins opportunities, free time and personal growth through a midnight glass world. Mint light gives actions and availability a clear signal; violet supports the sense of discovery and growth. Authored orbital geometry turns the idea of connection into a recognizable visual signature.

The landing page is expressive and spacious, with perspective ribbons, drifting particles and a floating opportunity card that responds to the pointer. The workspace retains the same materials while quieting the spectacle so students and coordinators can read, compare and act. The visual identity is techy and welcoming, with locally bundled typography and crisp, restrained controls.

**Key Characteristics:**

- Midnight glass with mint and violet light.
- Orbital geometry authored in CSS and Canvas.
- Expressive discovery, quiet operational reading.
- Visible focus, responsive layouts and user-controlled motion.

## Colors

The palette combines cool dark neutrals with luminous, soft accents; frontmatter values are normative and preserve the CSS source formats.

### Primary

- **Possibility Mint** (`mint`): main actions, positive timetable fit, active navigation, focus and orbital highlights.
- **Mint Light** (`mint-hover`): the shared primary button hover treatment.
- **Action Ink** (`action-ink`): readable text on the mint action fill.

### Secondary

- **Growth Violet** (`violet`): skill growth and secondary atmospheric color; use alongside mint in authored artwork.

### Tertiary

- **Warm Peach** (`peach`): warnings, conflicts and warmer opportunity artwork. Pair status color with readable words or an icon.

### Neutral

- **Midnight** (`midnight`): the base landing background.
- **Workspace Night** (`workspace`): the quieter operational canvas.
- **Deep Surface** (`surface`): the root surface token; translucent glass recipes provide the actual material variation.
- **Frost Text** (`text`) and **Quiet Text** (`muted`): primary reading and supporting descriptions.
- **Glass Line** (`line`): low-opacity separators and surface outlines.
- **Secondary Text / Fill** (`secondary-text`, `secondary-fill`): outlined secondary actions.
- **Field Text / Fill** (`field-text`, `field-fill`): form controls inside dialogs and operational panels.

**The Signal Rule.** Use mint for action and availability; keep written status information beside colored indicators.

## Typography

**Display Font:** Space Grotesk Variable with a sans-serif fallback.

**Body Font:** DM Sans Variable with a sans-serif fallback.

Both fonts are bundled through Fontsource packages. Space Grotesk supplies the technical character and compact headlines; DM Sans keeps everyday decisions approachable. There is no separate monospace family.

### Hierarchy

- **Display:** the landing hero uses the frontmatter display role; its responsive sizes are described in Layout.
- **Headline:** the default workspace page heading uses the headline role. Landing section headings are larger, and remain specific to those surfaces.
- **Title:** the default opportunity card heading uses the title role. Mobile card titles grow to support a single-column layout.
- **Body:** operational paragraphs use the body role. The landing hero uses a more open line-height (1.9) at desktop.
- **Label:** most operational event metadata, timetable metadata and supporting text use the label role. Selected passport microcopy remains smaller (11px).
- **Action:** workspace buttons, navigation and form controls retain a readable size (14px); text buttons use medium weight (500).

**The Operational Reading Rule.** Read final effective CSS before copying a type size: the overrides at the end of `frontend/src/styles/responsive.css` supersede the earlier compact workspace declarations.

## Layout

The landing is the **Persuade** surface. Its desktop hero is a two-column composition (1.05fr / 1fr), centered within a maximum width (1440px), with generous desktop padding (76px 72px 100px) and a minimum height (730px). The header has a separate maximum width (1360px). Subsequent landing sections share a centered container (1296px) and desktop horizontal padding (48px).

The workspace is the **Operate** surface. A fixed sidebar (248px) anchors navigation; content uses the matching left offset, a header height (75px), and a centered content maximum width (1500px). Default workspace padding is (36px 40px 55px). Opportunity grids, timetable panels and forecasts organize dense information without changing the shared glass material.

Responsive rules occur at (1600px minimum) and (1180px, 960px, 760px, 520px, 360px maximum). At (1180px), the sidebar narrows to (225px), content padding contracts and the availability panel stacks. At (960px), landing navigation links hide. At (760px), the hero stacks and the workspace sidebar becomes a toggleable drawer; its closed state is hidden from navigation. At (520px), opportunity grids become a single column and timetable bands turn into vertical rows. The base document minimum width is (320px).

The hero type scales from its desktop clamp to (72px) at 1180px, (61px) at 960px, (74px) in the stacked 760px layout, (66px) at 520px and (59px) at 360px. Workspace page headings adapt independently. Keep these surface-specific responsive treatments instead of imposing one global scale.

Review reference viewports are desktop (1440px) and mobile (390px); source-defined responsiveness continues down to the minimum width. This document records implementation evidence, not an independent browser accessibility certification.

## Elevation & Depth

Glass combines a translucent diagonal gradient, a thin Glass Line border and background blur (22px). Workspace depth comes primarily from tonal layers, spacing and contained artwork. The landing adds structural shadows and perspective to float an opportunity above its orbit; dialogs use stronger elevation above a blurred backdrop.

### Shadow Vocabulary

- **Floating opportunity** (`box-shadow: 12px 28px 70px #0006`): the hero's perspective card.
- **Floating evidence** (`box-shadow: 5px 15px 35px #0003`): nearby time and growth chips.
- **Primary action hover** (`box-shadow: 0 8px 22px #9ee8c018`): a small mint lift for the main button.
- **Dialog** (`box-shadow: 10px 30px 90px #0006`): modal separation from the workspace.

**The Quiet Workspace Rule.** Retain the shared glass material in operational screens and reserve the large ribbon, particle field and tilting card composition for expressive discovery surfaces.

## Shapes

Surfaces have gently rounded corners using the surface radius; controls use the tighter button and field radii. Metadata pills and availability markers use rounded capsules, while avatars and orbital art use circles. Thin borders define the glass edges. Rings, crossing ellipses, cubes, waves and stepped geometry are authored visual assets rather than external image dependencies.

## Components

### Buttons

Mint actions feel clear and confident. Primary and secondary buttons share the action role and button radius. Primary hover adds Mint Light, a small upward shift (2px) and the action shadow. Secondary actions use a translucent fill and visible border. Small buttons change padding to (10px 15px); workspace overrides preserve their readable action size. Text buttons pair a medium-weight label with an arrow that moves slightly on hover.

### Chips

Neutral metadata pills use Glass Line borders and capsule corners, with a compact shared label (11px) and context-specific responsive overrides. Filter chips are outlined at rest and filled with mint when selected; selected state is communicated in the control behavior as well as color. Operational filter labels use (14px), and most event metadata uses the label role. Landing floating evidence chips are decorative demonstrations with their own compact scale.

### Cards / Containers

The shared glass gradient is `linear-gradient(135deg, rgba(32, 52, 59, 0.66), rgba(16, 29, 36, 0.72))`. Cards combine this material with the surface radius, Glass Line outline and contained artwork. Default event card content padding uses the card spacing token. Opportunity titles and their art provide interactive entry points; hover shifts the container's tonal fill and highlights the title.

### Inputs / Fields

Fields use the field fill/text tokens, a mint-tinted thin outline, the field radius and padding from the frontmatter. Labels sit above form fields. Form controls use (14px) in the workspace and dialog. Search fields remove the individual filled box inside a shared panel. Native select controls remain recognizable; all fields retain the shared visible focus treatment.

### Navigation

The landing header pairs the orbital brand with quiet anchor links and a clear entry action. Workspace navigation is vertical, with icons, a short label and a mint selected state. Current navigation uses `aria-current`. Mobile navigation exposes expanded state, moves focus into the drawer and supports Escape to close and return focus to the trigger. A skip link reaches the main content.

### Campus constellation

The signature combines CSS orbital art, a Canvas ribbon projected with perspective, nearby particles and a pointer-responsive glass opportunity card. The card scene uses perspective (1200px); pointer coordinates adjust translation and rotation. CSS animations use smooth easing and a slow floating rhythm. The pause control stops CSS animation and removes card transforms; Canvas draws a static frame. Reduced-motion preferences stop animation, transition and smooth scrolling, and suppress pointer tilt. Preserve the readable opportunity preview in every motion state.

### Dialogs

Native dialogs provide event details, registration and guided campus interaction. A dark gradient surface, elevated shadow and blurred backdrop separate the task. Default dialog width caps at (540px), wide variants at (650px), while viewport-relative width and height keep content contained. Body copy and controls retain operational reading sizes. Preserve native dialog semantics and keyboard behavior.

## Do's and Don'ts

### Do:

- **Do** use the midnight glass, mint action and violet growth relationship across new surfaces.
- **Do** retain authored orbital geometry as the recognizable connection motif.
- **Do** resolve operational type against the final responsive overrides before reusing a component.
- **Do** keep visible focus, skip links, native dialog semantics and motion controls intact.
- **Do** label local demonstration data and illustrative intelligence honestly.

### Don't:

- **Don't** carry the landing's compact decorative labels into operational body copy or controls.
- **Don't** make color or animation the only way to understand availability or status.
- **Don't** replace authored geometry with unrelated imagery that changes the campus constellation world.
- **Don't** imply a connected backend, external AI service or live authentication from this frontend demo.

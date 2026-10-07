# CampusConnect frontend

A standalone React + Vite frontend for campus opportunity discovery. The animated glassmorphism landing leads into student, coordinator, and administrator demo workspaces.

## Commands

```bash
npm ci
npm run dev
npm run build
npm run preview
npm run lint
npm test
```

No backend, database, API key, or environment file is required. See the root README for the complete feature map and presentation walkthrough.

## Implementation

- React manages navigation, forms, shared event records, registrations, and attendance.
- Canvas draws perspective-projected ribbons and ambient particles; CSS builds the orbital artwork and glass surfaces.
- Space Grotesk and DM Sans variable fonts are bundled through Fontsource.
- `src/data/campus.js` contains fixtures, timetable checks, date formatting, and calendar export.
- `src/hooks/useCampus.js` persists the local demo state and reports storage failures.
- Each workspace page is a React component under `src/pages/`.
- Routes use URL fragments (`#today`, `#explore`, `#schedule`, `#poster`, `#passport`, `#communities`, `#organizer`, `#admin`, `#home`) and work on static hosts without route rewrites.

## Demo boundaries

The clock is fixed at 7 October 2026, 12:20 IST. Opportunity scores and attendance forecasts are illustrative. Poster extraction parses labeled pasted text; uploaded images are previewed only. The assistant uses scripted local-data answers. Role switching is a presentation aid rather than authentication. Certificates and resume exports describe local demo participation.

State is kept in the browser under `campusconnect-opportunities-v1`. Use **Reset local demo** in the sidebar, or remove that localStorage entry, to restore the initial fixtures. Uploaded images are never transmitted. The existing backend is unused and unchanged.

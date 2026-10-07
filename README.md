# CampusConnect

**What should I do on campus today?**

An AI-inspired campus opportunity discovery, scheduling, and student engagement experience. CampusConnect brings scattered campus information into one student journey: **Discover → Decide → Attend → Verify → Grow**.

This revision is a **React frontend-only interactive prototype**. It runs independently of the existing MERN backend. Event data, opportunity scores, forecasts, and assistant responses are demo data; no API, MongoDB, authentication, OCR, or live AI service is connected. The existing `backend/` directory has not been modified.

## Run locally

Use Node.js 22.12+ (or a compatible newer LTS) and npm.

```bash
cd frontend
npm ci
npm run dev
```

Open `http://localhost:5173`. No environment variables or database setup are needed.

```bash
npm run build    # production output in frontend/dist
npm run preview  # preview the production build
npm run lint     # frontend static checks
npm test         # scheduling and calendar tests
```

## The experience

- **Animated landing:** pointer-reactive, perspective-projected ribbons and particles; tilting glass event preview; floating contextual cards; custom geometric artwork; motion pause and reduced-motion support. Built with React, Canvas, and CSS, without a 3D framework.
- **My Campus Today:** a free-time window, timely recommendations, an afternoon timeline, class-conflict warnings, and deadline nudges.
- **Discover:** search, category and date filters, interest-match ordering, free-time duration controls, and explained recommendations.
- **Can I attend?:** checks event time, eligibility, registration deadline, classes, other registrations, and walking time before and after the event. Conflicting registrations are blocked with a reason.
- **My schedule:** classes and registered opportunities on one timeline; ticket details, cancellations, waitlist positions, and downloadable `.ics` calendar entries using India time.
- **Poster intelligence:** browser-local image preview, sample posters, labeled text extraction, editable event details, eligibility and timetable checks, and publishing into the demo event list. Uploaded images are previewed only; paste poster text to use the local parser. No image OCR is performed.
- **Organizer workspace:** event creation, capacity and turnout comparison, explicit illustrative forecasts, ordered waitlist promotion, manual attendance, and student reflection summaries.
- **Skill passport:** attendance updates skills and participation records, unlocks printable demo certificates, and exports a plain-text campus activity resume.
- **Campus assistant:** scripted answers grounded in the current local events, timetable, registrations, and passport. It does not claim access to friends' schedules or external information.
- **Communities and administration:** join/leave clubs, submit proposals, approve or decline them, and publish a local campus announcement.

## Presentation walkthrough

The demo clock is intentionally fixed at **Wednesday, 7 October 2026, 12:20 PM IST** for a repeatable academic presentation.

1. Enter campus as Pranav. Notice the 100-minute break before DBMS at 14:00.
2. Open **Build your first AI agent**, review the fit explanation, and save a seat. See it in **My schedule**.
3. Open **Robotics, beyond the basics** to show a timetable clash.
4. In **Poster intelligence**, try the timetable-clash sample, extract its details, and review the warning. Use the hackathon sample to add another opportunity.
5. Switch the **Demo workspace** selector to Coordinator. Mark Pranav present for the AI-agent workshop.
6. Switch back to Student and open **Skill passport**. The AI / ML count and participation record have updated. Open a certificate or leave a reflection.
7. Join the full HackMatrix waitlist as Student. In Coordinator view select HackMatrix and release demo seats. Seeded attendees occupy the first six positions; Pranav at position seven is promoted after seven cancellations.

The workspace selector demonstrates roles; it is not authentication or an access-control boundary.

## Local state

Registrations, events, community membership, announcements, attendance, and reflections persist in `localStorage` under `campusconnect-opportunities-v1`. Images remain temporary object URLs in browser memory. Reloading preserves the demo's records. Use **Reset local demo** in the sidebar to restore the original presentation scenario, or remove that storage key. If storage is unavailable, a notice explains that changes last only for the current session.

## Project structure

```text
frontend/
  src/
    components/  # shell, geometry, canvas, dialogs, event details, assistant
    data/        # demo fixtures, feasibility engine, calendar export, tests
    hooks/       # browser-local persistence
    pages/       # landing, today, discovery, schedule, poster, passport, operations
    styles/      # landing, workspace, responsive styles
    App.jsx      # navigation and connected demo state transitions
    index.css    # fonts, tokens, accessibility and shared primitives
  public/        # CampusConnect favicon
backend/         # existing MERN scaffold; unchanged and unused by this prototype
PRODUCT.md       # product purpose and frontend constraints
DESIGN.md        # visual system and interaction decisions
```

Fonts are bundled locally through Fontsource, so rendering does not depend on a Google Fonts request. Layout adapts from 320 px phones to desktop displays. Dialogs use the native dialog element for keyboard focus containment, and the app includes visible focus states and skip links.

## Project team

**Ramaiah Institute of Technology**

- Sinchana Jeppu — `1MS24CI124`
- Pranav R Mane — `1MS24CI091`
- Prajwal N — `1MS24CI090`

Developed for academic presentation and demonstration. Demo certificates are not institutional credentials.

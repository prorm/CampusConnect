# CampusConnect

**What should I do on campus today?**

CampusConnect is a full **MERN** application (MongoDB, Express, React, Node.js) for campus opportunity discovery, timetable-aware scheduling, verified participation, and student engagement analytics. It connects one student journey: **Discover → Decide → Attend → Verify → Grow**.

- **Students** find events that fit the gaps between classes, register or join a waitlist, and build an attendance-verified skill passport.
- **Coordinators** publish events (by hand or from a poster), watch turnout forecasts, manage waitlists, check attendees in, and read feedback digests.
- **Administrators** approve new communities, publish campus announcements, and read engagement analytics.

## Quick start

You need **Node.js 20.19+** and **MongoDB** (local or Atlas).

```bash
# 1. Install both apps
npm run setup

# 2. Configure the API
cp backend/.env.example backend/.env
#    then open backend/.env and set:
#      MONGO_URI          ← your MongoDB connection string (required)
#      JWT_SECRET         ← any long random string (required)
#      ANTHROPIC_API_KEY  ← optional, enables Claude (see "AI features")

# 3. Run the API and the React app together
npm run dev
```

Open **http://localhost:5173**. The API runs on **http://localhost:5000** and Vite proxies `/api` to it.

On first start the API seeds an empty database with the demo campus. Use `npm run seed` at any time to restore it.

### Demo accounts

Every seeded account uses the password **`campus123`**. The sign-in screen also has one-click buttons for each.

| Role | Email | Use it to |
|---|---|---|
| Student | `pranav@campusconnect.edu` | Plan around a timetable, register, earn passport entries |
| Student | `sinchana@campusconnect.edu` | A second student with different interests |
| Student | `prajwal@campusconnect.edu` | A third student, already registered for two events |
| Coordinator | `rajesh@campusconnect.edu` | Run events, release seats, check attendees in |
| Admin | `ananya@campusconnect.edu` | Approve communities, announcements, analytics |

New sign-ups always create **student** accounts, with a sample timetable they can edit under **My schedule → Edit timetable**.

## Scripts (repository root)

| Command | What it does |
|---|---|
| `npm run setup` | Installs backend and frontend dependencies |
| `npm run dev` | Starts the API (with auto-restart) and the Vite dev server together |
| `npm run seed` | Resets MongoDB to the demo campus |
| `npm test` | Runs the API integration tests and the frontend scheduling tests |
| `npm run lint` | Lints the frontend |
| `npm run build` | Builds the React app into `frontend/dist` |
| `npm start` | Production mode: the API serves the built app from one origin |

The API tests use a separate database (`campusconnect_test` by default, or `MONGO_URI_TEST`) and drop it when they finish.

## Environment variables (`backend/.env`)

| Variable | Required | Purpose |
|---|---|---|
| `MONGO_URI` | **Yes** | MongoDB connection string, e.g. `mongodb://127.0.0.1:27017/campusconnect` or an Atlas `mongodb+srv://…` URL |
| `JWT_SECRET` | **Yes** | Secret for signing login tokens |
| `ANTHROPIC_API_KEY` | No | Enables Claude for the assistant, poster images, and feedback summaries |
| `AI_MODEL` | No | Claude model ID (default `claude-opus-5-5`) |
| `PORT` | No | API port (default `5000`) |
| `CLIENT_URL` | No | Allowed browser origin(s) for CORS, comma-separated |
| `JWT_EXPIRES_IN` | No | Session length (default `7d`) |
| `DEMO_DATE`, `DEMO_TIME` | No | The fixed campus clock (default Wed 7 Oct 2026, 12:20) |
| `DEMO_ACCOUNTS` | No | One-click demo sign-in and demo reset (default `true`; set `false` for real use) |
| `AUTO_SEED` | No | Seed an empty database on start (default `true`) |

`backend/.env` is git-ignored. Only `backend/.env.example`, which holds placeholders, is committed.

## AI features

The **campus assistant**, **poster intelligence**, and **feedback digest** call **Claude** when `ANTHROPIC_API_KEY` is set. Without a key, every feature still works through a built-in rule-based engine:

| Feature | With an API key | Without a key |
|---|---|---|
| Campus assistant | Claude answers from your live timetable, registrations, events, and fit checks | Rule-based answers from the same data |
| Poster intelligence | Claude reads poster **images** into an editable event draft | Parses labelled poster **text** (samples included) |
| Feedback digest | Claude summarises strengths and improvements | Average, sentiment share, and representative quotes |

The header shows **Claude on** or **Rule-based AI**, and every answer is labelled with its source. If Claude is unavailable (for example, a rejected key or a rate limit), the assistant falls back to the rule-based reply and says why.

## What the app does

- **My campus today:** your current free window, a live day ribbon (classes, plans, and a "now" marker), picks that fit the break, conflict and deadline nudges, and the campus announcement.
- **Discover:** search, category and date filters, a "fits my free time" slider that includes walking time, and match-ordered results.
- **Can I attend?:** the API checks every registration against your weekly timetable, your other confirmed registrations, eligibility by year, deadlines, and walking time before and after the event. The UI shows the same check before you click.
- **Registration and waitlists:** seats fill atomically. A full event queues you at a numbered position; when a seat opens, the queue advances in order and the first person is confirmed automatically.
- **My schedule:** a day timeline with free gaps, your plans, `.ics` calendar export, and a weekly timetable editor.
- **Poster intelligence:** a poster becomes an editable event draft with a fit check, then publishes as a discoverable listing.
- **Event workspace (coordinators):** an event switcher, a capacity / registered / expected-turnout forecast, the live waitlist queue, desk-seat release, attendee check-in, and the feedback digest.
- **Skill passport:** coordinator check-ins write verified activities; skills, certificates, reflections, and a plain-text activity resume follow from them.
- **Communities:** join and leave, propose a new community, and see pending proposals.
- **Campus management (admins):** engagement analytics (fill rate, check-in rate, demand, skills earned, reflection sentiment, each with a table view), proposal review, and announcements.

## Presentation walkthrough

The campus clock is fixed at **Wednesday 7 October 2026, 12:20 IST** so the demo repeats exactly.

1. Sign in as **Pranav**. Note the 100-minute break before DBMS at 14:00 on the day ribbon.
2. Open **Build your first AI agent**, review why it matches, and **Save my seat**. The seat count drops and a ticket appears in **My schedule**.
3. Open **Robotics, beyond the basics**: registration is blocked because it overlaps DBMS, walking time included.
4. In **Poster intelligence**, try the timetable-clash sample, then publish the hackathon sample.
5. Join the full **HackMatrix** waitlist: you're at position #7.
6. Switch to **Rajesh** (sidebar → Switch demo account). In the event workspace, mark Pranav present for the AI-agent workshop, then select HackMatrix and release desk seats; on the seventh release Pranav is promoted.
7. Switch back to **Pranav** and open **Skill passport**: the new AI / ML activity and its certificate are there. Leave a reflection.
8. Switch to **Ananya**: analytics reflect the check-in and reflection. Approve **Shutter Society** and publish an announcement.

Use **Reset demo campus** in the sidebar (while signed in with a demo account) to restore the scenario.

## Architecture

```text
React (Vite) ──fetch /api──▶ Express API ──Mongoose──▶ MongoDB
   │                            │
   │ JWT in localStorage        ├─ JWT auth + role guards (student · coordinator · admin)
   │ one state snapshot         ├─ scheduling engine (fit checks, free windows)
   │ per mutation               ├─ seat / waitlist / attendance transitions
   │                            └─ AI service → Claude (optional) or rule-based engine
```

Every mutating endpoint responds with `{ message, state }`, a fresh role-aware snapshot, so the UI always renders confirmed server state.

```text
backend/
  src/
    config/       env loading, MongoDB connection
    middleware/   JWT auth, role guards, error handling
    models/       User, Event, Registration, Activity, Feedback, Community, Announcement
    routes/       auth, me (state, timetable, reflections), events, communities, admin, ai
    services/     schedule (fit checks), registrations (seats/waitlist/attendance),
                  state (role-aware snapshot), ai (Claude + rule-based)
    seed/         demo campus data and seeding
    app.js        Express app (also serves frontend/dist in production)
    server.js     entry point
  tests/          API integration tests (node:test + supertest)
frontend/
  src/
    api/          fetch client for every endpoint
    components/   shell, dialogs, cards, assistant, status screens, art
    data/         scheduling helpers (mirroring the API rules), navigation, tests
    hooks/        session/state, pointer spotlight
    pages/        landing, auth, today, discover, schedule, poster, passport,
                  organizer, communities, admin
    styles/       landing, workspace, auth
    index.css     Aurora design tokens and shared primitives
scripts/          dev runner (API + web) and production start
```

See [backend/README.md](backend/README.md) for the full API reference and [DESIGN.md](DESIGN.md) for the visual system.

## Project team

**Ramaiah Institute of Technology**

- Sinchana Jeppu — `1MS24CI124`
- Pranav R Mane — `1MS24CI091`
- Prajwal N — `1MS24CI090`

Developed for academic presentation. Certificates generated by the app record coordinator check-ins and are not institutional credentials.

# CampusConnect API

Express 5 + Mongoose 9 REST API for CampusConnect. It owns authentication, the scheduling rules, seats and waitlists, attendance, the skill passport, communities, analytics, and the optional Claude integration.

## Setup

```bash
npm install
cp .env.example .env     # set MONGO_URI and JWT_SECRET; ANTHROPIC_API_KEY is optional
npm run dev              # http://localhost:5000, restarts on file changes
```

| Script | Purpose |
|---|---|
| `npm run dev` | Start with `node --watch` |
| `npm start` | Start without watching |
| `npm run seed` | Replace all CampusConnect collections with the demo campus |
| `npm test` | Integration tests against `campusconnect_test` (or `MONGO_URI_TEST`) |

An empty database is seeded automatically on start unless `AUTO_SEED=false`. Every demo account's password is `campus123`.

## Conventions

- **Auth:** send `Authorization: Bearer <token>`. Tokens come from `/api/auth/login`, `/register`, or `/demo`.
- **Mutations return state:** every write responds with `{ message, state }`, where `state` is the same role-aware snapshot as `GET /api/me/state`.
- **Errors:** `{ error, details? }` with a meaningful status (`400` validation, `401` signed out, `403` wrong role, `404` missing, `409` conflict such as a timetable clash, `422` unreadable poster, `429` rate limited).
- **IDs:** events and communities are addressed by their `slug` (exposed to the client as `id`). Users by Mongo `_id`.
- **Times:** `date` is `YYYY-MM-DD` in campus time; `start`/`end` are minutes since midnight. Timetable `days` use `0` = Sunday … `6` = Saturday.

## Endpoints

### Health

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/health` | none | Database status, AI status, and campus clock |

### Auth — `/api/auth`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/register` | none | Create a **student** account `{ name, email, password, usn?, department?, year?, interests? }` → `{ token, state }` |
| POST | `/login` | none | `{ email, password }` → `{ token, state }` |
| GET | `/demo-accounts` | none | Seeded presentation accounts (empty when `DEMO_ACCOUNTS=false`) |
| POST | `/demo` | none | One-click demo sign-in `{ email }` → `{ token, state }` |
| GET | `/me` | user | Current profile |
| PATCH | `/me` | user | Update `name`, `department`, `usn`, `year`, `interests` |

Sign-in routes are rate limited to 50 requests per 15 minutes per IP.

### Me — `/api/me`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/state` | user | Role-aware snapshot: user, timetable, events, registrations, activities, communities, joined, proposals, announcement, feedbacks, rosters (staff only), clock, AI status |
| POST | `/timetable` | user | Add a class `{ title, venue?, start: "HH:MM", end: "HH:MM", days: [0-6] }` |
| DELETE | `/timetable/:id` | user | Remove a class |
| POST | `/activities/:key/feedback` | user | Reflect on a passport activity `{ rating: 1-5, comment }`, once per activity |

### Events — `/api/events`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/` | user | All events |
| GET | `/:slug` | user | One event |
| POST | `/` | user | Publish `{ title, club, category, description, venue, date, deadline, start, end, capacity, walk?, years?, tags? }`. Staff publish organizer events; students publish poster listings |
| DELETE | `/:slug` | coordinator, admin | Remove an event and its registrations |
| POST | `/:slug/registration` | user | Register. Enforces the fit check (`409` with the reason); joins the waitlist when full |
| DELETE | `/:slug/registration` | user | Cancel. A released seat goes to the front of the queue |
| POST | `/:slug/release` | coordinator, admin | Simulate a desk cancellation; advances the waitlist |
| PUT | `/:slug/attendance/:userId` | coordinator, admin | `{ present: boolean }`; writes or removes the passport activity |

### Communities — `/api/communities`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/` | user | Active communities |
| POST | `/:slug/membership` | user | Join |
| DELETE | `/:slug/membership` | user | Leave |
| POST | `/` | user | Propose `{ name, description }` (pending until reviewed) |
| PATCH | `/:slug/decision` | admin | `{ approved: boolean }` |

### Admin — `/api/admin`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/analytics` | coordinator, admin | Totals, seats by category, most in-demand events, skills earned, feedback sentiment |
| PUT | `/announcement` | admin | `{ text }` |
| POST | `/reset` | demo account | Re-seed the demo campus (only when `DEMO_ACCOUNTS=true`); returns a fresh `{ token, state }` |

### AI — `/api/ai`

Rate limited to 20 requests per minute. Each response includes `source: "claude" | "rules"`.

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/status` | user | `{ enabled, model }` |
| POST | `/assistant` | user | `{ message, history? }` → `{ reply, eventId, source, notice? }` |
| POST | `/poster` | user | `{ text?, image?: { data: base64, mediaType } }` → `{ draft, source }`. Images need an API key |
| GET | `/feedback-summary?event=slug` | coordinator, admin | `{ summary, strengths, improvements, source }` |

## Scheduling rules

`services/schedule.js` is the source of truth (the frontend mirrors it in `src/data/campus.js` to explain a fit before you click):

- An event conflicts with a class or a confirmed registration when `event.start − walk < other.end` and `event.end + walk > other.start`.
- Waitlisted registrations never block other plans.
- Registration closes after the deadline, after the event date, or once the event has started.
- The event must be open to the student's year.

## Seats and waitlists

`Event.registered` and `Event.waitlist` count everyone, including attendees registered at the desk; `Registration` documents track app users. Seats are claimed with an atomic conditional update (`registered < capacity`). Cancelling or releasing a seat while people are queued decrements the queue, confirms whoever holds position 1, and moves everyone else up one place.

## Claude integration

`services/ai.js` uses the official `@anthropic-ai/sdk` with structured JSON outputs, adaptive thinking, and server-side refusal fallbacks (`fallbacks: "default"`). The model defaults to `claude-opus-5-5` (`AI_MODEL` overrides it). The assistant receives the student's timetable, free window, events with precomputed fit checks, registrations, and passport, and is told to say when it lacks information. API failures (bad key, rate limits, network) fall back to the rule-based engine rather than failing the request.

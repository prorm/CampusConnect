# CampusConnect frontend

React 19 + Vite client for the CampusConnect MERN app. It talks to the Express API in `../backend` and renders the Aurora design system described in `../DESIGN.md`.

## Commands

```bash
npm install
npm run dev       # http://localhost:5173, proxies /api to http://localhost:5000
npm run build     # production build in dist/
npm run preview   # serve the build (also proxies /api)
npm run lint      # oxlint
npm test          # scheduling and calendar unit tests (node:test)
```

Start the API first (`npm run dev` in `../backend`), or run both from the repository root with `npm run dev`.

| Variable | Default | Purpose |
|---|---|---|
| `VITE_API_URL` | `/api` | API base URL when the API is hosted on another origin |
| `VITE_API_PROXY` | `http://localhost:5000` | Where the dev/preview server forwards `/api` |

## How it works

- `src/api/client.js` wraps every endpoint and keeps the JWT in `localStorage`.
- `src/hooks/useCampus.js` holds the session. Every mutation returns `{ message, state }`, and the hook swaps in the fresh server snapshot, so screens render confirmed data.
- `src/data/campus.js` mirrors the API's scheduling rules to explain a fit before the server confirms it. `src/data/nav.js` maps each role to its screens.
- If the API can't be reached, the app shows a recovery screen with setup steps instead of failing silently.

See the root [README](../README.md) for features, demo accounts, and the presentation walkthrough.

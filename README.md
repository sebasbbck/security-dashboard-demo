# Sentinel Demo — security dashboard

A small demo of a security operations dashboard: the kind of screens an analyst opens to see, in a few seconds, what is on fire and where.

> **Demo project.** All data is mock data served by the app's own REST API. Nothing here is connected to real infrastructure.

**Live demo:** _coming soon (Vercel)_

## Screens

- **Overview** — critical/open alert counts, distribution of open alerts by severity, the alerts that need action and the riskiest assets.
- **Alerts** — newest first, color-coded by severity, filterable by severity and status, with a debounced search. The status (open → investigating → resolved) can be changed inline with an optimistic update that rolls back if the API call fails.
- **Assets** — inventory table sorted by risk score (0–100) with a colored risk meter, open alerts per asset, filters by asset type and search by name, owner or IP.

The same four colors (critical / high / medium / low) mean the same thing everywhere, both for alert severity and for asset risk, so the screen can be read at a glance.

## Stack

- **Next.js 16** (App Router, Route Handlers) + **React 19** + **TypeScript**
- **Tailwind CSS v4** with a custom dark theme defined as design tokens in `globals.css`
- ESLint + Prettier (with the Tailwind class-sorting plugin)

## REST API

| Method  | Endpoint                                | Description                                          |
| ------- | --------------------------------------- | ---------------------------------------------------- |
| `GET`   | `/api/summary`                          | Aggregated numbers for the overview                  |
| `GET`   | `/api/alerts?severity=&status=&q=`      | Alerts, newest first; `400` on invalid filter values |
| `PATCH` | `/api/alerts/:id` `{ "status": "..." }` | Change an alert's status; `404` / `400` on bad input |
| `GET`   | `/api/assets?type=&q=`                  | Assets, riskiest first, with their open alert count  |

The UI consumes it through a small typed client (`src/lib/api.ts`) and a `useFetch` hook that aborts outdated requests, so a slow response never overwrites a newer one.

State lives in memory: status changes reset when the server restarts, and on serverless hosting different instances may not share them. That is intentional for a demo — a real version would use a database.

## Project structure

```
src/
├── app/
│   ├── api/           # REST endpoints (Route Handlers)
│   ├── alerts/        # /alerts page
│   ├── assets/        # /assets page
│   └── page.tsx       # / overview
├── components/        # Screen components and shared UI (badges, risk meter, filters)
└── lib/               # Types, mock data, API client, hooks, helpers
```

## Running locally

```bash
bun install
bun run dev        # http://localhost:3000
```

Other scripts: `bun run build`, `bun run lint`, `bun run typecheck`, `bun run format`.

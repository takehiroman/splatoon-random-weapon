---
name: splatoon-random-weapon
description: Use this skill when working in the splatoon-random-weapon repository. It covers the Preact + Vite frontend, the Hono API running on Cloudflare Pages Functions, and the D1/KV data flow used for random weapon selection and result history.
---

# Splatoon Random Weapon

Use this skill for feature work, bug fixes, refactors, or reviews in this repository.

## Repo map

- `src/main.tsx`: frontend entry point.
- `src/app.tsx`: main UI flow. This is the first place to inspect for product behavior.
- `src/components/`: presentational UI components.
- `functions/api/[[route]].ts`: API entry point for Cloudflare Pages Functions.
- `functions/api/routes/weapon.ts`: D1-backed weapon endpoints.
- `functions/api/routes/result.ts`: KV-backed result endpoint.
- `wrangler.toml`: Cloudflare bindings for D1 (`DB`) and KV (`RANDOM_WEAPONS`).

## Architecture

- Frontend uses `preact`, `vite`, `tailwindcss`, and `swr`.
- API uses `hono` on Cloudflare Pages Functions under `/api`.
- The frontend builds a typed client with `hc<AppType>('/')` and calls:
  - `GET /api/weapons/random?count=<n>`
  - `GET /api/results`
- Local Vite dev proxies `/api` to `http://localhost:3000`.

## Working rules for this repo

- Treat `src/app.tsx` as the current source of truth for user-visible behavior.
- Keep frontend and API changes aligned. If you change an API response shape, update the typed client usage in `src/app.tsx` in the same task.
- Be careful with the boundary between real data and placeholders:
  - `useSWR('results', ...)` fetches live result data from KV.
  - `cards` in `src/app.tsx` are currently hardcoded sample history entries.
  - Do not assume the rendered history UI is already wired to backend data.
- `src/constants/weapon.ts` appears to be legacy or unused. Confirm usage before editing it.
- `tsconfig.json` includes only `src`, even though the frontend imports types from `functions/`. If type changes behave strangely, inspect this include boundary first.
- `package.json` is configured for `husky` and `lint-staged`. Avoid assuming hooks are consistently installed.

## Safe change workflow

1. Read `src/app.tsx` and the relevant route files before editing.
2. Prefer the existing API shape and component patterns unless the task clearly requires a change.
3. For backend changes, verify the corresponding Cloudflare binding exists in `wrangler.toml`.
4. For frontend changes, check whether data is live or placeholder before wiring UI logic.
5. Run the narrowest useful verification available after edits.

## Verification

- Install dependencies: `npm install`
- Frontend dev server: `npm run dev`
- Lint scripts: `npm run lint:script`
- Lint styles: `npm run lint:style`

If a task touches Cloudflare runtime behavior, note that local verification may also require a Pages/Workers dev setup that is not fully captured by current package scripts.

## Known pitfalls

- `functions/api/routes/weapon.ts` builds the SQL `LIMIT` clause from the query string directly. Be cautious when changing request handling there.
- `index.html` still has the default Vite title, so product polish tasks may need to update app metadata.
- `wrangler.toml` contains concrete binding IDs. Do not rotate or replace them casually.

---
name: splatoon-random-weapon
description: Use this skill when working in the splatoon-random-weapon repository. It covers the Preact + Vite frontend, the Hono API running on Cloudflare Pages Functions, and the D1-backed data flow used for random weapon selection and result history.
---

# Splatoon Random Weapon

Use this skill for feature work, bug fixes, refactors, or reviews in this repository.

## Repo map

- `src/main.tsx`: frontend entry point.
- `src/app.tsx`: main UI flow. This is the first place to inspect for product behavior.
- `src/components/`: presentational UI components.
- `functions/api/[[route]].ts`: API entry point for Cloudflare Pages Functions.
- `functions/api/routes/weapon.ts`: D1-backed weapon endpoints.
- `functions/api/routes/result.ts`: D1-backed result endpoint with optional KV migration.
- `wrangler.toml`: Cloudflare bindings for D1 (`DB`) and optional KV (`RANDOM_WEAPONS`).

## Architecture

- Frontend uses `preact`, `vite`, `tailwindcss`, and `swr`.
- API uses `hono` on Cloudflare Pages Functions under `/api`.
- The frontend builds a typed client with `hc<AppType>('/')` and calls:
  - `GET /api/weapons/random?count=<n>`
  - `GET /api/results`
  - `POST /api/results`
- Local Vite dev proxies `/api` to `http://localhost:3000`.
- Result history is stored in Cloudflare D1, and the API can optionally import existing KV history on first access.

## Working rules for this repo

- Treat `src/app.tsx` as the current source of truth for user-visible behavior.
- Keep frontend and API changes aligned. If you change an API response shape, update the typed client usage in `src/app.tsx` in the same task.
- History is live data now:
  - `useSWR('results', ...)` reads current history from `GET /api/results`.
  - After `POST /api/results`, the frontend updates the SWR cache directly instead of forcing a refetch.
  - Keep the frontend cache update logic aligned with the backend retention limit.
- `src/constants/weapon.ts` appears to be legacy or unused. Confirm usage before editing it.
- `tsconfig.json` includes only `src`, even though the frontend imports types from `functions/`. If type changes behave strangely, inspect this include boundary first.
- `package.json` is configured for `husky` and `lint-staged`. Avoid assuming hooks are consistently installed.
- Free-tier-conscious behavior matters here. Prefer bounded history reads/writes and avoid extra reads when the UI can update from the mutation response.

## Safe change workflow

1. Read `src/app.tsx` and the relevant route files before editing.
2. Prefer the existing API shape and component patterns unless the task clearly requires a change.
3. For backend changes, verify the corresponding Cloudflare binding exists in `wrangler.toml`.
4. For history changes, update both `functions/api/routes/result.ts` and the SWR mutation logic in `src/app.tsx`.
5. Run the narrowest useful verification available after edits.

## Verification

- Install dependencies: `npm install`
- Frontend dev server: `npm run dev`
- Production build: `npm run build`
- Lint scripts: `npm run lint:script`
- Lint styles: `npm run lint:style`

If a task touches Cloudflare runtime behavior, note that local verification may also require a Pages/Workers dev setup that is not fully captured by current package scripts.

## Known pitfalls

- `functions/api/routes/result.ts` keeps only the newest `MAX_HISTORY_ITEMS` entries. If you change that value, update the frontend cache trimming logic too.
- `src/app.tsx` disables several SWR revalidation paths and relies on mutation results for freshness. If you change that strategy, reevaluate KV read volume.
- `wrangler.toml` contains concrete binding IDs. Do not rotate or replace them casually.

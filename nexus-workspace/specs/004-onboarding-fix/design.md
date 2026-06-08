# Onboarding Orchestration Design

## Backend Architecture (Supabase MCP & Express)
- **Database Model (Prisma)**: Change `model Config` so that `id` uses `@default(uuid())` instead of the hardcoded `"global"`. This prevents the SQLite `Unique constraint failed on the fields: ('id')` error when inserting multiple configs.
- **Express Routing**: The `404 Not Found` for `/api/setup/spawn` must be investigated and resolved. If the route is perfectly declared but not matched, it's possible a middleware or a syntax closure issue is swallowing the request. We will extract all `/api/setup/*` routes to a dedicated `setup.routes.ts` file or isolate them cleanly at the top of `index.ts` to ensure priority matching.

## Frontend UI (Stitch MCP - Liquid Tactical Noir 2026)
- The frontend `StepEngine.tsx` and `useProcessSession.ts` rely on `http://localhost:3000` via Axios. We will ensure the network requests properly reach the endpoints and correctly parse the JSON responses.
- The UI will be visually consistent with the requested 2026 UX standard, keeping the `TerminalBlock.tsx` for real-time SSE logs.

## Quality Gate (ux-ui-architect-2026)
- The `TerminalBlock` and onboarding cards already implement the Liquid Glass aesthetic, high-contrast borders, and interactive transitions. No major UI rewrites are necessary; focus is purely on the functional integration.

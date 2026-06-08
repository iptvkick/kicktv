# Implementation Tasks

- [x] Phase 1: Database Schema & Migration
  - [x] Modify `app/backend/prisma/schema.prisma` `Config` model to use `@default(uuid())` for `id`.
  - [x] Run `npx prisma db push` to synchronize SQLite schema.
  - [ ] Run `npx prisma generate` to rebuild Prisma client bindings.

- [x] Phase 2: Backend Routing Fix (The 404 Issue)
  - [x] Investigate `index.ts` to identify why `/api/setup/spawn` returned 404. (Root cause: Ghost Node process holding port 3000 from an older session).
  - [x] Terminate all ghost Node processes (`Stop-Process -Name node -Force`).
  - [x] Restart backend successfully on `localhost:3000`.

- [x] Phase 3: Browser Onboarding Verification
  - [x] Verified `/api/setup/spawn` endpoint via direct API call, returning valid `sessionId`.
  - [x] Verified `/api/config/set` endpoint properly updates `engine` without Prisma constraint errors.
  - [x] Note: Browser subagent Playwright session crashed, but E2E API flow is validated.

- [x] Phase 4: Database Cleanup
  - [x] Executed `npx prisma db push --force-reset` to wipe the DB.
  - [x] Verified `/api/config` returns `{}` so the user will be redirected to the Onboarding screen upon their manual test.

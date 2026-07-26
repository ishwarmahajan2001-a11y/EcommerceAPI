# Repo Restructure: backend/ + frontend/ — Build Brief

**Goal:** Move the Spring Boot project from the repo root into `backend/`, alongside the existing `frontend/`, with everything still building and running.

**Context:** Root currently holds pom.xml, src/, target/ plus `frontend/`. An untracked, stale, incomplete copy already sits in `backend/` (src + target + README, no pom) from a manual move attempt. Backend server is currently running from the root copy.

**Approach:** Stop the running server; delete the stale untracked `backend/` copy; `git mv` pom.xml + src/ + README.md (backend section going to backend/README? — no: README.md stays at root as repo overview) → move `pom.xml` and `src/` into `backend/`; keep root README.md (update run instructions); delete root `target/` (build output, untracked); update README paths. No file content changes except README run instructions. Vite proxy is unaffected (targets :8080).
- *Rejected:* keeping duplicate copies (confusing); rewriting history (unnecessary).

**File map:**
- `backend/pom.xml`, `backend/src/**` — moved via `git mv` (history preserved)
- `README.md` — run instructions updated (`cd backend`)
- root `target/`, stale `backend/` copy, `run.log` — removed (build artifacts / stale)

**Security & observability impact:** none.
**Constitution check:** no constitution.

**Behavioral invariants:**
1. `mvn test` inside `backend/` compiles and all existing Java tests pass unchanged
2. `mvn spring-boot:run` inside `backend/` starts the API on :8080; GET /api/v1/products returns 200
3. `npm test` inside `frontend/` still passes (77 tests)

## Tasks
- [x] 1. Stop server; remove stale backend/ copy and root target/
- [x] 2. git mv pom.xml + src → backend/; update README
- [x] 3. Verify invariants (backend 10/10 tests, GET /products 200, frontend 77/77 tests)
- [x] 4. Commit locally, hand off

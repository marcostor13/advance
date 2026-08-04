---
description: Verify that the project is ready to deploy — checks env vars, build, tests, and CI config. Usage: /deploy-check [frontend|backend|all]
---

Perform a deployment readiness check for $ARGUMENTS (defaults to "all").

## Frontend checks
- [ ] `frontend/.env` does NOT exist (not committed) — only `environment.prod.ts`
- [ ] `frontend/src/environments/environment.prod.ts` has production `apiUrl`
- [ ] `frontend/Dockerfile` copy path matches `angular.json` `outputPath` + `/browser`
- [ ] `frontend/nginx/default.conf` has SPA fallback and `/healthz`
- [ ] `frontend/.dockerignore` excludes `node_modules`, `dist`, `.angular`
- [ ] `angular.json` production build budget is not exceeded
- [ ] GitHub secrets documented: `COOLIFY_FRONTEND_WEBHOOK_URL`, `COOLIFY_TOKEN`
- [ ] Run `docker build -t advance-frontend ./frontend` — confirm it succeeds

## Backend checks
- [ ] `backend/.env` is NOT committed and IS listed in `backend/.dockerignore`
- [ ] `backend/.env.example` is up to date with all required vars
- [ ] `backend/Dockerfile` uses multi-stage build
- [ ] `MONGODB_URI` format is valid Atlas connection string pattern
- [ ] Health endpoint `GET /api/health` is configured
- [ ] `FRONTEND_URL` in Coolify matches the real frontend domain (CORS)
- [ ] GitHub secrets documented: `COOLIFY_BACKEND_WEBHOOK_URL`, `COOLIFY_TOKEN`

## CI/CD checks
- [ ] Both workflows trigger the correct Coolify webhook secret
- [ ] Both workflows have `test` job before `deploy`
- [ ] Workflows use `paths:` filter to avoid unnecessary runs
- [ ] No leftover Netlify references anywhere in the repo

**Output format**:
```
## Deploy Readiness: <scope>

### ✅ Ready
- (list passing checks)

### ❌ Blockers
- (list failing checks with exact fix)

### ⚠️ Warnings
- (non-blocking issues)

Status: READY TO DEPLOY / BLOCKED
```

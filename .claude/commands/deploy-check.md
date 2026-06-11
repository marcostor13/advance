---
description: Verify that the project is ready to deploy — checks env vars, build, tests, and CI config. Usage: /deploy-check [frontend|backend|all]
---

Perform a deployment readiness check for $ARGUMENTS (defaults to "all").

## Frontend checks
- [ ] `frontend/.env` does NOT exist (not committed) — only `environment.prod.ts`
- [ ] `frontend/netlify.toml` has correct `publish` path
- [ ] `frontend/src/environments/environment.prod.ts` has production `apiUrl`
- [ ] `angular.json` production build budget is not exceeded
- [ ] GitHub secrets documented: `NETLIFY_AUTH_TOKEN`, `NETLIFY_SITE_ID`
- [ ] Run `npm run build:prod` in frontend — confirm it succeeds

## Backend checks
- [ ] `backend/.env` does NOT exist (not committed)
- [ ] `backend/.env.example` is up to date with all required vars
- [ ] `backend/Dockerfile` uses multi-stage build
- [ ] `MONGODB_URI` format is valid Atlas connection string pattern
- [ ] Health endpoint `GET /api/health` is configured
- [ ] GitHub secrets documented: `COOLIFY_WEBHOOK_URL`, `COOLIFY_TOKEN`

## CI/CD checks
- [ ] `.github/workflows/frontend-ci.yml` has correct `publish-dir`
- [ ] `.github/workflows/backend-ci.yml` has correct image name
- [ ] Both workflows have `test` job before `deploy`
- [ ] Workflows use `paths:` filter to avoid unnecessary runs

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

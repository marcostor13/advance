# Advance Group — Claude Code Configuration

## Response style (token-efficient)
- No preamble, no closing remarks, no "Let me know if..."
- Never restate the question
- Targeted edits only — never rewrite files unless asked
- Read files before editing; run tests before declaring done
- One short comment max per code block; no multi-line docstrings

## Stack
- **Frontend**: Angular 21 (standalone, signals, new control flow) → Netlify
- **Backend**: NestJS 11 + MongoDB Atlas (Mongoose) → Coolify
- **CI/CD**: GitHub Actions
- **Language**: TypeScript strict mode everywhere

## Architecture rules
- Clean Architecture: core / shared / features (frontend); modules / common / config (backend)
- SOLID principles enforced (see `/solid-review` skill)
- No `any` type — use `unknown` + type guards
- Barrel exports (`index.ts`) per feature/module

## Naming conventions
| Layer | Pattern | Example |
|---|---|---|
| Angular component | `feature-name.component.ts` | `home.component.ts` |
| Angular service | `entity.service.ts` | `api.service.ts` |
| NestJS module | `entity.module.ts` | `users.module.ts` |
| NestJS DTO | `create-entity.dto.ts` | `create-user.dto.ts` |
| Test | `*.spec.ts` | `home.component.spec.ts` |

## Testing rules
- Angular: Jasmine + Karma; coverage threshold 80%
- NestJS: Jest; coverage threshold 80%
- Always mock external dependencies (HTTP, DB) in unit tests
- E2E tests for critical user flows only

## Environment variables
- Frontend: `src/environments/environment.*.ts`
- Backend: `.env` (never commit) — use `.env.example` as template

## Git conventions
- Branch: `feature/`, `fix/`, `chore/`
- Commit: `feat:`, `fix:`, `chore:`, `test:`, `docs:`
- PRs must pass CI before merge

## Available agents (`.claude/agents/`)
- `angular-expert` — Angular components, services, routing, signals
- `nestjs-expert` — NestJS modules, controllers, providers, pipes
- `mongodb-expert` — Mongoose schemas, queries, aggregations, Atlas
- `testing-expert` — Unit & E2E tests for both frontend and backend
- `devops-expert` — CI/CD, Docker, Netlify, Coolify, GitHub Actions

## Available skills (`.claude/commands/`)
| Command | Purpose |
|---|---|
| `/create-component` | Scaffold Angular standalone component |
| `/create-module` | Scaffold NestJS module with CRUD |
| `/clean-code-review` | Review file for clean code violations |
| `/solid-review` | Review file for SOLID principle violations |
| `/unit-test` | Generate unit tests for a file |
| `/deploy-check` | Verify deployment readiness |

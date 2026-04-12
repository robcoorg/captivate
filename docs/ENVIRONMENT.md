# Environment variables

Do not commit real credentials. Use your host’s secret store for production (see below).

## Inventory (production — captivate.icu)

| Variable | Required | Purpose |
|----------|----------|---------|
| `DATABASE_URL` | Yes (for DB-backed features) | PostgreSQL connection string (`postgresql://user:pass@host:5432/dbname`) |
| `ANTHROPIC_API_KEY` | Yes (for AI runs) | Anthropic API key for Claude calls |
| `PORT` | Optional | HTTP port (default `3000`). The sample `apprunner.yaml` references `APP_PORT` for the platform; ensure the runtime sets `PORT` or map `APP_PORT` → `PORT` in your service config. |
| `NODE_ENV` | Yes | Set to `production` in production. |

## Staging / preview (same keys, non-production values)

Use the **same variable names** so apps and infra templates stay aligned. Values must not point at production data unless intentional.

| Variable | Staging guidance |
|----------|------------------|
| `DATABASE_URL` | Separate Postgres instance or database name (e.g. `…/nanostudio_staging`). |
| `ANTHROPIC_API_KEY` | Org key with spend limits, or a dedicated staging key. |
| `PORT` | Often `3000` locally; hosting platform may inject its own. |
| `NODE_ENV` | `development` or `staging` as appropriate. |

Local development: copy `.env.example` to `.env` and fill with dev/staging-like values.

## Where secrets should live

| Context | Recommendation |
|---------|------------------|
| **GitHub Actions** | Store only secrets needed for CI (e.g. if you add integration tests that call external APIs). Prefer scoped tokens and repository secrets. |
| **AWS App Runner** | Configure environment variables and secrets in the App Runner service configuration (console or IaC). Reference: [App Runner env vars](https://docs.aws.amazon.com/apprunner/latest/dg/env-var.html). |
| **Docker / other hosts** | Inject at runtime (`docker run -e`, orchestrator secrets, Kubernetes secrets). |
| **Centralized (optional)** | AWS Systems Manager Parameter Store or Secrets Manager; app reads at startup or sidecar injects env. |

This repo ships `.env.example` as the onboarding template (no real values).

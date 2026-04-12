# Continuous integration

## Workflow

| Property | Value |
|----------|--------|
| **File** | `.github/workflows/ci.yml` |
| **Workflow name** | `CI` |
| **Triggers** | Pull requests (all branches), pushes to `main` |

## Jobs

| Job name | Steps |
|----------|--------|
| **build-lint-test** | Checkout → Node 20 + npm cache → `npm ci` → **Lint** (`npm run lint`) → **Build** (`npm run build`) → **Test** (`npm test`) |

Required checks for branch protection should reference the job **build-lint-test** from workflow **CI** (GitHub shows it as `CI / build-lint-test`).

## Branch protection (default branch)

Configure in GitHub: **Settings → Branches → Branch protection rules** for `main`:

1. Enable **Require a pull request before merging** (optional but recommended).
2. Enable **Require status checks to pass before merging**.
3. Add required check: **`build-lint-test`** (from workflow **CI**).

Without admin access to the repo, a maintainer must apply these settings once after the workflow is merged.

## Local commands

```bash
npm ci
npm run lint   # ESLint on .ts / .tsx
npm run build  # tsc + vite build
npm test       # Vitest (API health test)
```

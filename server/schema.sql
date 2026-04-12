CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  vertical TEXT DEFAULT 'bim',
  status TEXT DEFAULT 'active',
  repo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id),
  task_class TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  risk_level TEXT DEFAULT 'low',
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS task_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES tasks(id),
  model_name TEXT,
  provider TEXT DEFAULT 'anthropic',
  status TEXT DEFAULT 'pending',
  latency_ms INTEGER,
  token_input INTEGER,
  token_output INTEGER,
  cost_usd NUMERIC(10,6),
  output_summary TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_run_id UUID REFERENCES task_runs(id),
  decision TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Billing ──────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS users (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email              TEXT UNIQUE NOT NULL,
  password_hash      TEXT,                    -- bcrypt hash; NULL for OAuth-only accounts
  stripe_customer_id TEXT UNIQUE,
  tier               TEXT NOT NULL DEFAULT 'free', -- free | starter | pro | studio
  created_at         TIMESTAMPTZ DEFAULT NOW()
);

-- Idempotent migration: add password_hash if this table already exists without it
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT;

CREATE INDEX IF NOT EXISTS users_email_idx              ON users (email);
CREATE INDEX IF NOT EXISTS users_stripe_customer_id_idx ON users (stripe_customer_id);

CREATE TABLE IF NOT EXISTS subscriptions (
  id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                  UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  stripe_subscription_id   TEXT UNIQUE NOT NULL,
  stripe_price_id          TEXT NOT NULL,
  tier                     TEXT NOT NULL DEFAULT 'free',
  status                   TEXT NOT NULL DEFAULT 'active', -- active | past_due | canceled | incomplete
  current_period_end       TIMESTAMPTZ,
  credits_used_today       INTEGER NOT NULL DEFAULT 0,
  credits_used_month       INTEGER NOT NULL DEFAULT 0,
  last_credit_reset_day    DATE,
  last_credit_reset_month  DATE,
  created_at               TIMESTAMPTZ DEFAULT NOW(),
  updated_at               TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS subscriptions_user_id_idx ON subscriptions (user_id);

-- Append-only ledger for one-time credit pack purchases; never deleted
CREATE TABLE IF NOT EXISTS credit_ledger (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  source            TEXT NOT NULL,          -- e.g. 'credits_50', 'credits_150', 'credits_500'
  credits           INTEGER NOT NULL,
  stripe_session_id TEXT UNIQUE NOT NULL,   -- idempotency: ignore duplicate webhook deliveries
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS credit_ledger_user_id_idx ON credit_ledger (user_id);

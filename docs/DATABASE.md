# Database (PostgreSQL)

The API uses **PostgreSQL** via `pg` and `DATABASE_URL`. There is **no** ORM migration runner in this repo; schema is defined in `server/schema.sql` using idempotent `CREATE TABLE IF NOT EXISTS` / `CREATE EXTENSION`.

## Applying schema (deploy / new environment)

Operators should run the SQL file against the target database **before** or **after** deploying app code that expects those tables, using the same `DATABASE_URL` the app will use:

```bash
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f server/schema.sql
```

Requirements: `psql` installed and network access to the database (VPN/bastion as required).

For CI, database setup is optional; API tests use routes that do not require a live DB when `DATABASE_URL` is unset.

## Migration step in the deployment path

1. **Backup** (see below).  
2. **Apply schema** with the command above when `server/schema.sql` changes or when provisioning a new environment.  
3. **Deploy** the application (e.g. App Runner build → run, or container rollout).  

Document this order in your runbook; the critical invariant is: schema compatible with the app version being rolled out.

## Rollback strategy

### Before any schema change

Take a logical backup of the relevant database:

```bash
pg_dump --format=custom --file="backup-$(date -u +%Y%m%dT%H%MZ).dump" "$DATABASE_URL"
```

Store the file in durable storage (S3, encrypted volume) with retention policy per your org.

### Restore if a deploy or migration fails

```bash
pg_restore --clean --if-exists --dbname="$DATABASE_URL" backup-….dump
```

(Adjust flags if you use plain SQL dumps instead of custom format.)

### Reverting application code

Roll back the **deployment** to the previous image/release; schema is forward-only here. If you must undo DDL, restore from backup or write corrective SQL—never assume automatic down migrations exist in this repo.

### Safe practice

- Prefer additive changes (`ADD COLUMN`, new tables) over destructive ones in production.  
- Test schema application against a staging clone first.  
- Keep backups automated for production databases (RDS snapshots, managed Postgres backups, etc.).

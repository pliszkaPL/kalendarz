# ADR-002: SQLite for MVP

## Status
Accepted

## Context
Database selection for MVP. Single-user/low-traffic application.

## Options

| Option | Pros | Cons |
|--------|------|------|
| SQLite | Zero config, file-based, backup=copy | Limited concurrency |
| PostgreSQL | Full features, scalable | Requires server, config |
| MySQL | Popular | Requires server |

## Decision
**SQLite** for development and MVP.

## Rationale
- Zero server configuration
- Entire database in one file
- Sufficient for single user
- Easy backup (file copy)
- Laravel Eloquent abstracts differences

## Consequences
- Migration to PostgreSQL on production (Dokku plugin)
- Testing on same DB as dev
- No concurrent writes (not a problem for MVP)

## Migration to PostgreSQL
```bash
dokku postgres:create kalendarz-db
dokku postgres:link kalendarz-db kalendarz
```

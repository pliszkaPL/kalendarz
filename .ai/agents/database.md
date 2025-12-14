# Database Agent - Data Architect

## Scope

- Database schema design
- Laravel migrations
- Eloquent relationships
- Query optimization
- Seeders and factories

## Key Knowledge

| Area | Details |
|------|---------|
| Dev DB | SQLite |
| Prod DB | PostgreSQL (Dokku) |
| ORM | Eloquent |
| Migrations | Laravel |

## Schema

### users
`id, name, email (unique), password, email_verified_at, remember_token, timestamps`

### templates (planned)
`id, user_id (nullable FK), name, icon, background_color, text_color, fields (JSON), display_format, is_archived, timestamps`

### events (planned)
`id, user_id (FK), template_id (FK), title, description, data (JSON), timestamps`

### event_dates (planned)
`id, event_id (FK), date, timestamps`

### personal_access_tokens (Sanctum)
`id, tokenable_type, tokenable_id, name, token (unique), abilities, last_used_at, expires_at, timestamps`

## Working Files

```
backend/database/
├── migrations/
├── seeders/
└── factories/
```

## Commands

```bash
make migrate
docker compose exec backend php artisan migrate:fresh --seed
docker compose exec backend php artisan make:migration create_events_table
```

## Patterns

- Singular model names (Event, not Events)
- JSON columns for flexible data
- Soft deletes where needed
- Indexes on foreign keys
- Factory states for testing

## Related Agents

- [backend.md](./backend.md) - Model implementation

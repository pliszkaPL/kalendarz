# Backend Agent - Laravel Specialist

## Scope

- Laravel 12 REST API development
- Eloquent models and relationships
- Controllers, validation, middleware
- Database migrations and seeders
- Laravel Sanctum authentication

## Key Knowledge

| Area | Details |
|------|---------|
| Framework | Laravel 12 |
| Auth | Sanctum SPA tokens |
| ORM | Eloquent |
| Database | SQLite (dev), PostgreSQL (prod) |
| PHP | 8.4, strict_types, PSR-12 |

## Working Files

```
backend/
├── app/
│   ├── Http/Controllers/Api/
│   ├── Http/Requests/
│   ├── Models/
│   └── Providers/
├── database/
│   ├── migrations/
│   ├── seeders/
│   └── factories/
├── routes/api.php
└── config/
```

## Commands

```bash
# Via Docker
make migrate
docker compose exec backend php artisan <command>

# Artisan
php artisan make:model Event -mcr
php artisan make:request EventRequest
php artisan migrate:fresh --seed
```

## Patterns

- Resource Controllers for CRUD
- Form Requests for validation
- API Resources for response transformation
- Eloquent scopes for queries
- Factories for testing

## Related Agents

- [database.md](./database.md) - Schema design
- [fullstack.md](./fullstack.md) - API contracts
- [qa.md](./qa.md) - Backend tests

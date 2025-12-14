# Kalendarz MVP

Calendar application with innovative template system for managing important dates and events.

## Quick Start

```bash
# 1. Add host entry
echo "127.0.0.1 kalendarz.loc" | sudo tee -a /etc/hosts

# 2. Start
make up

# 3. Migrate database
make migrate
```

Access:
- Frontend: http://kalendarz.loc
- API: http://kalendarz.loc/api
- Traefik: http://localhost:8080

## Documentation

| Document | Description |
|----------|-------------|
| [AGENTS.md](AGENTS.md) | AI agent rules and navigation |
| [PROJECT.md](PROJECT.md) | Project context and status |
| [.ai/prd.md](.ai/prd.md) | Product requirements |
| [.ai/tech-stack.md](.ai/tech-stack.md) | Technology details |
| [.ai/architecture.md](.ai/architecture.md) | System architecture |

## Stack

| Layer | Technology |
|-------|------------|
| Frontend | Vue.js 3, Tailwind CSS, Vite |
| Backend | Laravel 12, Sanctum, PHP 8.4 |
| Database | SQLite (dev), PostgreSQL (prod) |
| Infrastructure | Docker, Traefik, Nginx |
| Testing | Playwright, PEST |
| CI/CD | GitHub Actions |
| Deployment | Dokku |

## Commands

```bash
make up          # Start Docker services
make down        # Stop services
make migrate     # Run database migrations
make build       # Rebuild Docker images
```

## Testing

```bash
# E2E tests
cd e2e-tests && npm test

# Backend tests
cd backend && ./vendor/bin/pest
```

## Project Structure

```
.
├── AGENTS.md           # AI rules
├── PROJECT.md          # Project status
├── .ai/                # AI docs and templates
├── docs/               # Project documentation
│   ├── adr/            # Architecture decisions
│   └── work/           # Active tasks
├── backend/            # Laravel API
├── frontend/           # Vue.js SPA
├── e2e-tests/          # Playwright tests
└── docker-compose.yml
```

## API Endpoints

```
POST /api/register    # Register user
POST /api/login       # Login user
POST /api/logout      # Logout (auth required)
GET  /api/user        # Get current user (auth required)
```

## License

MIT

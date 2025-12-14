# Kalendarz MVP

Calendar application with innovative template system for managing important dates and events.

## Prerequisites

- PHP 8.4+ with extensions:
  - mbstring
  - **sqlite3** (or pdo_sqlite) - **REQUIRED**
  - pdo
- Node.js 22+
- npm 11+

### Installing PHP SQLite Extension

⚠️ **REQUIRED**: Without SQLite extension, the application won't work.

**Debian/Ubuntu:**
```bash
sudo apt-get install php8.4-sqlite3 php8.4-pdo php8.4-mbstring
```

**macOS (Homebrew):**
```bash
brew install php@8.4
# SQLite is usually included
```

**Verify installation:**
```bash
php -m | grep -i sqlite
# Should show: pdo_sqlite and sqlite3
```

**If not installed:** Setup and tests will fail with "could not find driver" error.

## Quick Start

```bash
# Option 1: Quick setup script (recommended)
bash scripts/setup.sh

# Option 2: Using Make
make setup

# Start development servers
make dev
```

### Manual Setup

```bash
# 1. Install Composer locally
make install-composer

# 2. Install dependencies
make install-backend  # Backend (PHP)
make install-frontend # Frontend (Node.js)

# 3. Setup database
touch backend/database/database.sqlite
make migrate

# 4. Start servers
make dev
```

Access:
- Frontend: http://127.0.0.1:5173
- Backend API: http://127.0.0.1:8000/api
- Health Check: http://127.0.0.1:8000/api/health

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
| Frontend | Vue.js 3, TypeScript, Tailwind CSS, Vite |
| Backend | Laravel 12, Sanctum, PHP 8.4 |
| Database | SQLite (dev), PostgreSQL (prod) |
| Web Server | nginx (CI/prod), Vite dev server (local) |
| Testing | Playwright (E2E), PEST (backend) |
| CI/CD | GitHub Actions |
| Deployment | Dokku |

## Development Commands

```bash
# Setup & Installation
make setup              # Full setup (install + migrate)
make install-backend    # Install PHP dependencies
make install-frontend   # Install Node.js dependencies
make install-e2e        # Install E2E test dependencies

# Development
make dev               # Start both backend and frontend
make dev-backend       # Start backend only (port 8000)
make dev-frontend      # Start frontend only (port 5173)

# Database
make migrate           # Run migrations
make migrate-fresh     # Fresh migration (drops tables)
make migrate-seed      # Fresh migration with seeders

# Testing
make test              # Run backend tests only
make test-all          # Run all tests with auto-started backend
make test-backend      # Run backend tests (PEST)
make test-quick        # Quick backend tests
make test-e2e          # Run E2E tests (requires running servers!)
make test-e2e-headed   # Run E2E with visible browser
make test-e2e-ui       # Run E2E with Playwright UI
make smoke             # Run smoke tests only

# Quality & Validation
make validate          # Check entire setup
make health            # Check if backend is healthy
make status            # Show service status
make quality           # Run code quality checks (Pint)
make fix               # Fix code style issues

# Cache
make cache-clear       # Clear Laravel cache
make cache-optimize    # Optimize for production

# Utilities
make artisan cmd="..."   # Run artisan command
make composer cmd="..."  # Run composer command
```

## Testing

### Backend Tests (PEST)
```bash
make test              # Quick - backend tests only
make test-backend      # Same as above
make test-quick        # Alias for quick tests
```

### E2E Tests (Playwright)

**Option 1: Manual (recommended for development)**
```bash
# Terminal 1: Start servers
make dev

# Terminal 2: Run E2E tests
make test-e2e              # Headless mode
make test-e2e-headed       # With browser visible
make test-e2e-ui           # Interactive UI mode
make smoke                 # Quick smoke tests
```

**Option 2: Automatic (for CI-like testing)**
```bash
make test-all              # Runs backend tests + starts backend + runs E2E
```

### Individual Test Files
```bash
cd e2e-tests && npx playwright test tests/smoke.spec.js --headed
cd e2e-tests && npx playwright test tests/authentication.spec.js
```

### Why E2E tests need running servers

E2E tests make real HTTP requests to:
- Backend API: `http://127.0.0.1:8000`
- Frontend: `http://localhost` (via nginx in CI, or Vite dev server)

The `make test-all` command automatically:
1. Runs backend unit tests
2. Starts backend server
3. Runs E2E tests
4. Stops backend server

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

## Validation & Troubleshooting

```bash
# Check if everything is properly configured
make validate

# Check PHP version
php -v  # Should be 8.4+

# Check Node version  
node -v  # Should be 22+

# Check if services are running
make status

# Check backend health
curl http://127.0.0.1:8000/api/health

# View backend logs
tail -f backend/storage/logs/laravel.log
```

## CI/CD

The project uses GitHub Actions for continuous integration:

- **Smoke Tests**: Run on every push (critical path only)
- **Full E2E Tests**: Run after smoke tests pass
- **Caching**: Composer, npm, and Playwright browsers are cached
- **PHP Version**: 8.4
- **Node Version**: 22

Workflow file: `.github/workflows/e2e-tests.yml`

## API Endpoints

```
# Health
GET  /api/health      # Health check

# Authentication
POST /api/register    # Register user
POST /api/login       # Login user
POST /api/logout      # Logout (auth required)
GET  /api/user        # Get current user (auth required)

# Calendar Groups
GET    /api/groups           # List all groups
POST   /api/groups           # Create group
GET    /api/groups/{id}      # Get group details
PUT    /api/groups/{id}      # Update group
DELETE /api/groups/{id}      # Delete group

# Calendar Entries
GET    /api/groups/{groupId}/entries     # List entries
POST   /api/groups/{groupId}/entries     # Create entry
GET    /api/entries/{id}                 # Get entry details
PUT    /api/entries/{id}                 # Update entry
DELETE /api/entries/{id}                 # Delete entry
```

## License

MIT

# Makefile - Kalendarz MVP
#
# Usage: make <command>
# Run `make help` to see available commands

# =============================================================================
# Configuration
# =============================================================================

DC := docker compose
DOCKER := docker
BACKEND_CONTAINER := backend
FRONTEND_CONTAINER := frontend

# =============================================================================
# Help
# =============================================================================

.PHONY: help h
help h: ### Show this help message
	@grep -E '^[a-zA-Z_-]+.*:.*### .*$$' $(MAKEFILE_LIST) | sed 's/:.*###/:###/' | sort | awk 'BEGIN {FS = ":###"}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

# =============================================================================
# Build
# =============================================================================

.PHONY: build build-no-cache rebuild
build build-no-cache rebuild: ### Build all Docker images (no cache)
	$(DC) build --no-cache

.PHONY: build-cache
build-cache: ### Build Docker images (with cache)
	$(DC) build

# =============================================================================
# Run / Start / Stop
# =============================================================================

.PHONY: run up start
run up start: ### Start all services in background (production)
	@echo "🔍 Checking for dev containers..."
	@if docker ps --filter "name=kalendarz-frontend-dev-1" --format "{{.Names}}" | grep -q "kalendarz-frontend-dev-1"; then \
		echo "⚠️  WARNING: Dev containers are running!"; \
		echo "⚠️  This will cause conflicts (production won't work)"; \
		echo ""; \
		echo "Run: make dev-down   # to stop dev first"; \
		echo ""; \
		exit 1; \
	fi
	@echo "✅ No conflicts detected, starting production..."
	$(DC) up -d

.PHONY: run-logs up-logs
run-logs up-logs: ### Start all services with logs
	$(DC) up

.PHONY: down stop
down stop: ### Stop and remove all containers
	$(DC) down

.PHONY: restart
restart: ### Restart all services
	$(DC) restart

.PHONY: destroy
destroy: ### Stop containers and remove volumes
	$(DC) down -v

# =============================================================================
# Development
# =============================================================================

.PHONY: dev dev-up dev-start
dev dev-up dev-start: ### Start development environment with hot reload
	@echo "🔍 Checking for production containers..."
	@if docker ps --filter "name=kalendarz-frontend-1" --format "{{.Names}}" | grep -q "kalendarz-frontend-1"; then \
		echo "⚠️  WARNING: Production containers are running!"; \
		echo "⚠️  This will cause conflicts (dev won't work in browser)"; \
		echo ""; \
		echo "Run: make down   # to stop production first"; \
		echo ""; \
		exit 1; \
	fi
	@echo "✅ No conflicts detected, starting dev environment..."
	$(DC) -f docker-compose.dev.yml up -d

.PHONY: dev-logs
dev-logs: ### Show development logs
	$(DC) -f docker-compose.dev.yml logs -f

.PHONY: dev-down dev-stop
dev-down dev-stop: ### Stop development environment
	$(DC) -f docker-compose.dev.yml down

.PHONY: dev-restart
dev-restart: ### Restart development environment
	$(DC) -f docker-compose.dev.yml restart

.PHONY: dev-build
dev-build: ### Rebuild development containers
	$(DC) -f docker-compose.dev.yml build --no-cache

.PHONY: dev-rebuild
dev-rebuild: ### Rebuild and restart development
	$(DC) -f docker-compose.dev.yml build --no-cache
	$(DC) -f docker-compose.dev.yml up -d

.PHONY: which-env env-status
which-env env-status: ### Check which environment is running
	@echo "🔍 Checking environment status..."
	@echo ""
	@PROD=$$(docker ps --filter "name=kalendarz-frontend-1" --format "{{.Names}}" 2>/dev/null | grep -c "kalendarz-frontend-1" || true); \
	DEV=$$(docker ps --filter "name=kalendarz-frontend-dev-1" --format "{{.Names}}" 2>/dev/null | grep -c "kalendarz-frontend-dev-1" || true); \
	if [ "$${PROD}" != "0" ] && [ "$${DEV}" != "0" ]; then \
		echo "⚠️  CONFLICT: Both production AND dev are running!"; \
		echo "⚠️  This causes issues - stop one of them:"; \
		echo "     make down      # Stop production"; \
		echo "     make dev-down  # Stop dev"; \
	elif [ "$${PROD}" != "0" ]; then \
		echo "✅ Production environment is running"; \
		echo "   URL: http://kalendarz.loc"; \
		echo ""; \
		echo "   To switch to dev: make down && make dev"; \
	elif [ "$${DEV}" != "0" ]; then \
		echo "✅ Development environment is running"; \
		echo "   URL: http://kalendarz.loc (with hot reload)"; \
		echo ""; \
		echo "   To switch to prod: make dev-down && make up"; \
	else \
		echo "ℹ️  No environment is running"; \
		echo ""; \
		echo "   Start dev:  make dev"; \
		echo "   Start prod: make up"; \
	fi
	@echo ""

# =============================================================================
# Status / Logs
# =============================================================================

.PHONY: ps status
ps status: ### Show running containers
	$(DC) ps

.PHONY: logs
logs: ### Show logs from all services
	$(DC) logs -f

.PHONY: logs-backend
logs-backend: ### Show backend logs
	$(DC) logs -f $(BACKEND_CONTAINER)

.PHONY: logs-frontend
logs-frontend: ### Show frontend logs
	$(DC) logs -f $(FRONTEND_CONTAINER)

# =============================================================================
# Database
# =============================================================================

.PHONY: migrate db-migrate
migrate db-migrate: ### Run database migrations
	$(DC) exec $(BACKEND_CONTAINER) php artisan migrate --force

.PHONY: migrate-fresh db-fresh
migrate-fresh db-fresh: ### Fresh migration (drop all tables)
	$(DC) exec $(BACKEND_CONTAINER) php artisan migrate:fresh --force

.PHONY: migrate-seed db-seed
migrate-seed db-seed: ### Fresh migration with seeders
	$(DC) exec $(BACKEND_CONTAINER) php artisan migrate:fresh --seed --force

.PHONY: seed
seed: ### Run database seeders
	$(DC) exec $(BACKEND_CONTAINER) php artisan db:seed --force

# =============================================================================
# Tests
# =============================================================================

.PHONY: tests test
tests test: ### Run all tests (backend + e2e)
	@echo "Running backend tests..."
	$(DC) exec $(BACKEND_CONTAINER) ./vendor/bin/pest --exclude-group=e2e || true
	@echo ""
	@echo "Running E2E tests..."
	cd e2e-tests && npm test

.PHONY: tests-backend test-backend
tests-backend test-backend: ### Run backend tests (PEST)
	$(DC) exec $(BACKEND_CONTAINER) ./vendor/bin/pest --exclude-group=e2e

.PHONY: tests-e2e test-e2e
tests-e2e test-e2e: ### Run E2E tests (Playwright)
	cd e2e-tests && npm test

.PHONY: tests-e2e-headed test-e2e-headed
tests-e2e-headed test-e2e-headed: ### Run E2E tests with browser
	cd e2e-tests && npm run test:headed

.PHONY: tests-e2e-ui test-e2e-ui
tests-e2e-ui test-e2e-ui: ### Run E2E tests with Playwright UI
	cd e2e-tests && npm run test:ui

.PHONY: tests-smoke test-smoke smoke
tests-smoke test-smoke smoke: ### Run smoke tests only (critical path)
	cd e2e-tests && npx playwright test tests/smoke.spec.js

.PHONY: tests-smoke-headed test-smoke-headed smoke-headed
tests-smoke-headed test-smoke-headed smoke-headed: ### Run smoke tests with browser visible
	cd e2e-tests && npx playwright test tests/smoke.spec.js --headed

# =============================================================================
# Cache / Cleanup
# =============================================================================

.PHONY: cache-clear clear-cache
cache-clear clear-cache: ### Clear Laravel cache
	$(DC) exec $(BACKEND_CONTAINER) php artisan config:clear
	$(DC) exec $(BACKEND_CONTAINER) php artisan cache:clear
	$(DC) exec $(BACKEND_CONTAINER) php artisan route:clear
	$(DC) exec $(BACKEND_CONTAINER) php artisan view:clear

.PHONY: cache-optimize optimize
cache-optimize optimize: ### Optimize Laravel cache for production
	$(DC) exec $(BACKEND_CONTAINER) php artisan config:cache
	$(DC) exec $(BACKEND_CONTAINER) php artisan route:cache
	$(DC) exec $(BACKEND_CONTAINER) php artisan view:cache

# =============================================================================
# Shell Access
# =============================================================================

.PHONY: shell-backend sh-backend bash-backend
shell-backend sh-backend bash-backend: ### Open shell in backend container
	$(DC) exec $(BACKEND_CONTAINER) sh

.PHONY: shell-frontend sh-frontend bash-frontend
shell-frontend sh-frontend bash-frontend: ### Open shell in frontend container
	$(DC) exec $(FRONTEND_CONTAINER) sh

.PHONY: artisan
artisan: ### Run artisan command (usage: make artisan cmd="migrate:status")
	$(DC) exec $(BACKEND_CONTAINER) php artisan $(cmd)

# =============================================================================
# Code Quality
# =============================================================================

.PHONY: quality lint
quality lint: ### Run all code quality checks
	$(DC) exec $(BACKEND_CONTAINER) ./vendor/bin/pint --test

.PHONY: fix format
fix format: ### Fix code style issues
	$(DC) exec $(BACKEND_CONTAINER) ./vendor/bin/pint

# =============================================================================
# Setup / Install
# =============================================================================

.PHONY: setup install
setup install: ### Full project setup (build + start + migrate)
	$(DC) build
	$(DC) up -d
	@echo "Waiting for services to start..."
	@sleep 5
	$(DC) exec $(BACKEND_CONTAINER) php artisan migrate --force
	@echo ""
	@echo "Setup complete!"
	@echo "Frontend: http://kalendarz.loc"
	@echo "API: http://kalendarz.loc/api"

.PHONY: setup-e2e install-e2e
setup-e2e install-e2e: ### Install E2E test dependencies
	cd e2e-tests && npm install
	cd e2e-tests && npx playwright install chromium

.PHONY: install-frontend npm-install
install-frontend npm-install: ### Install frontend dependencies
	cd frontend && npm install

.PHONY: install-all
install-all: ### Install all dependencies (frontend + e2e)
	cd frontend && npm install
	cd e2e-tests && npm install

# =============================================================================
# Git
# =============================================================================

.PHONY: git-config
git-config: ### Configure git SSH key
	git config core.sshCommand "ssh -i ~/.ssh/id_ai_rsa -F /dev/null"

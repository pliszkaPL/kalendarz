# Makefile - Kalendarz MVP (Local Development)
#
# Usage: make <command>
# Run `make help` to see available commands

# =============================================================================
# Configuration
# =============================================================================

BACKEND_DIR := backend
FRONTEND_DIR := frontend
E2E_DIR := e2e-tests

# Composer command (prefer local, fallback to global)
COMPOSER := $(shell if [ -f $(BACKEND_DIR)/composer.phar ]; then echo "php $(BACKEND_DIR)/composer.phar"; else echo "composer"; fi)

# Backend server
BACKEND_HOST := 127.0.0.1
BACKEND_PORT := 8000
BACKEND_URL := http://$(BACKEND_HOST):$(BACKEND_PORT)

# Frontend server
FRONTEND_HOST := 127.0.0.1
FRONTEND_PORT := 5173
FRONTEND_URL := http://$(FRONTEND_HOST):$(FRONTEND_PORT)

# =============================================================================
# Help
# =============================================================================

.PHONY: help h
help h: ### Show this help message
	@grep -E '^[a-zA-Z_-]+.*:.*### .*$$' $(MAKEFILE_LIST) | sed 's/:.*###/:###/' | sort | awk 'BEGIN {FS = ":###"}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

# =============================================================================
# Setup / Install
# =============================================================================

.PHONY: setup install
setup install: ### Full project setup (install deps + migrate)
	@bash scripts/setup.sh

.PHONY: quick-setup quick-start
quick-setup quick-start: ### Quick setup with script
	@bash scripts/setup.sh

.PHONY: install-backend
install-backend: ### Install backend dependencies
	@if [ ! -f $(BACKEND_DIR)/composer.phar ]; then bash scripts/install-composer.sh; fi
	cd $(BACKEND_DIR) && $(COMPOSER) install --no-interaction --prefer-dist

.PHONY: install-frontend npm-install
install-frontend npm-install: ### Install frontend dependencies
	cd $(FRONTEND_DIR) && npm install

.PHONY: install-e2e setup-e2e
install-e2e setup-e2e: ### Install E2E test dependencies
	cd $(E2E_DIR) && npm install
	cd $(E2E_DIR) && npx playwright install chromium

.PHONY: install-all
install-all: ### Install all dependencies (backend + frontend + e2e)
	@if [ ! -f $(BACKEND_DIR)/composer.phar ]; then bash scripts/install-composer.sh; fi
	cd $(BACKEND_DIR) && $(COMPOSER) install --no-interaction --prefer-dist
	cd $(FRONTEND_DIR) && npm install
	cd $(E2E_DIR) && npm install

.PHONY: install-composer
install-composer: ### Install Composer locally
	bash scripts/install-composer.sh

# =============================================================================
# Development
# =============================================================================

.PHONY: dev dev-start
dev dev-start: ### Start development servers (backend + frontend)
	@echo "Starting backend on http://localhost:8000..."
	@echo "Starting frontend on http://localhost:5173..."
	@echo ""
	@echo "Press Ctrl+C to stop all servers"
	@trap 'kill 0' EXIT; \
		cd $(BACKEND_DIR) && php artisan serve --host=127.0.0.1 --port=8000 & \
		cd $(FRONTEND_DIR) && npm run dev & \
		wait

.PHONY: dev-backend
dev-backend: ### Start backend server only
	cd $(BACKEND_DIR) && php artisan serve --host=127.0.0.1 --port=8000

.PHONY: dev-frontend
dev-frontend: ### Start frontend dev server only
	cd $(FRONTEND_DIR) && npm run dev

.PHONY: build
build: ### Build frontend for production
	cd $(FRONTEND_DIR) && npm run build

# =============================================================================
# Database
# =============================================================================

.PHONY: migrate db-migrate
migrate db-migrate: ### Run database migrations
	cd $(BACKEND_DIR) && php artisan migrate --force

.PHONY: migrate-fresh db-fresh
migrate-fresh db-fresh: ### Fresh migration (drop all tables)
	cd $(BACKEND_DIR) && php artisan migrate:fresh --force

.PHONY: migrate-seed db-seed
migrate-seed db-seed: ### Fresh migration with seeders
	cd $(BACKEND_DIR) && php artisan migrate:fresh --seed --force

.PHONY: seed
seed: ### Run database seeders
	cd $(BACKEND_DIR) && php artisan db:seed --force

# =============================================================================
# Tests
# =============================================================================

.PHONY: tests test
tests test: ### Run all tests (backend only, use test-all for e2e)
	@echo "Running backend tests..."
	cd $(BACKEND_DIR) && ./vendor/bin/pest --exclude-group=e2e
	@echo ""
	@echo "✓ Backend tests passed!"
	@echo ""
	@echo "Note: E2E tests require running servers."
	@echo "  To run E2E: start servers (make dev) then run 'make test-e2e' in another terminal"
	@echo "  Or use: make test-all (starts servers automatically)"

.PHONY: tests-all test-all
tests-all test-all: ### Run all tests with servers (backend + frontend + e2e)
	@echo "=== Running Backend Tests ==="
	@echo ""
	cd $(BACKEND_DIR) && ./vendor/bin/pest --exclude-group=e2e
	@echo ""
	@echo "=== Starting Backend Server ==="
	@cd $(BACKEND_DIR) && php artisan serve --host=$(BACKEND_HOST) --port=$(BACKEND_PORT) > /tmp/backend.log 2>&1 & echo $$! > /tmp/kalendarz-backend.pid
	@sleep 2
	@echo "✓ Backend started at $(BACKEND_URL)"
	@echo ""
	@echo "=== Starting Frontend Server ==="
	@cd $(FRONTEND_DIR) && npm run dev -- --host $(FRONTEND_HOST) --port $(FRONTEND_PORT) > /tmp/frontend.log 2>&1 & echo $$! > /tmp/kalendarz-frontend.pid
	@sleep 5
	@echo "✓ Frontend started at $(FRONTEND_URL)"
	@echo ""
	@echo "=== Running E2E Tests ==="
	@cd $(E2E_DIR) && npm test || (kill `cat /tmp/kalendarz-backend.pid /tmp/kalendarz-frontend.pid` 2>/dev/null; rm -f /tmp/kalendarz-*.pid; exit 1)
	@echo ""
	@echo "=== Stopping Servers ==="
	@kill `cat /tmp/kalendarz-backend.pid /tmp/kalendarz-frontend.pid` 2>/dev/null || true
	@rm -f /tmp/kalendarz-backend.pid /tmp/kalendarz-frontend.pid /tmp/backend.log /tmp/frontend.log
	@echo "✓ All tests passed!"

.PHONY: tests-backend test-backend
tests-backend test-backend: ### Run backend tests (PEST)
	cd $(BACKEND_DIR) && ./vendor/bin/pest --exclude-group=e2e

.PHONY: tests-e2e test-e2e
tests-e2e test-e2e: ### Run E2E tests (requires running servers!)
	@echo "Note: Make sure servers are running:"
	@echo "  Backend: $(BACKEND_URL)"
	@echo "  Frontend: $(FRONTEND_URL)"
	@echo ""
	@echo "Use 'make dev' in another terminal or 'make test-all' to auto-start"
	@echo ""
	cd $(E2E_DIR) && npm test

.PHONY: tests-e2e-headed test-e2e-headed
tests-e2e-headed test-e2e-headed: ### Run E2E tests with browser
	cd $(E2E_DIR) && npm run test:headed

.PHONY: tests-e2e-ui test-e2e-ui
tests-e2e-ui test-e2e-ui: ### Run E2E tests with Playwright UI
	cd $(E2E_DIR) && npm run test:ui

.PHONY: tests-smoke test-smoke smoke
tests-smoke test-smoke smoke: ### Run smoke tests only (critical path)
	cd $(E2E_DIR) && npx playwright test tests/smoke.spec.js

.PHONY: tests-smoke-headed test-smoke-headed smoke-headed
tests-smoke-headed test-smoke-headed smoke-headed: ### Run smoke tests with browser visible
	cd $(E2E_DIR) && npx playwright test tests/smoke.spec.js --headed

.PHONY: test-quick
test-quick: ### Quick test - backend only (fastest)
	cd $(BACKEND_DIR) && ./vendor/bin/pest --exclude-group=e2e

# =============================================================================
# Cache / Cleanup
# =============================================================================

.PHONY: cache-clear clear-cache
cache-clear clear-cache: ### Clear Laravel cache
	cd $(BACKEND_DIR) && php artisan config:clear
	cd $(BACKEND_DIR) && php artisan cache:clear
	cd $(BACKEND_DIR) && php artisan route:clear
	cd $(BACKEND_DIR) && php artisan view:clear

.PHONY: cache-optimize optimize
cache-optimize optimize: ### Optimize Laravel cache for production
	cd $(BACKEND_DIR) && php artisan config:cache
	cd $(BACKEND_DIR) && php artisan route:cache
	cd $(BACKEND_DIR) && php artisan view:cache

# =============================================================================
# Code Quality
# =============================================================================

.PHONY: quality lint
quality lint: ### Run all code quality checks
	cd $(BACKEND_DIR) && ./vendor/bin/pint --test

.PHONY: fix format
fix format: ### Fix code style issues
	cd $(BACKEND_DIR) && ./vendor/bin/pint

# =============================================================================
# Health Checks & Validation
# =============================================================================

.PHONY: health health-check
health health-check: ### Check if backend is running and healthy
	@echo "Checking backend health at $(BACKEND_URL)/api/health..."
	@curl -f -s $(BACKEND_URL)/api/health || (echo "Backend is not healthy!" && exit 1)
	@echo ""
	@echo "Backend is healthy!"

.PHONY: validate check
validate check: ### Validate entire setup (deps, config, health)
	@echo "=== Validating Kalendarz Setup ==="
	@echo ""
	@echo "1. Checking PHP version..."
	@php -v | head -1
	@echo ""
	@echo "2. Checking Node.js version..."
	@node -v
	@echo ""
	@echo "3. Checking npm version..."
	@npm -v
	@echo ""
	@echo "4. Checking Composer..."
	@if [ -f $(BACKEND_DIR)/composer.phar ]; then \
		echo "✓ Local Composer found"; \
		php $(BACKEND_DIR)/composer.phar --version; \
	else \
		echo "✗ Local Composer not found (run 'make install-composer')"; \
	fi
	@echo ""
	@echo "5. Checking backend dependencies..."
	@if [ -d $(BACKEND_DIR)/vendor ]; then \
		echo "✓ Backend dependencies installed"; \
	else \
		echo "✗ Backend dependencies missing (run 'make install-backend')"; \
	fi
	@echo ""
	@echo "6. Checking frontend dependencies..."
	@if [ -d $(FRONTEND_DIR)/node_modules ]; then \
		echo "✓ Frontend dependencies installed"; \
	else \
		echo "✗ Frontend dependencies missing (run 'make install-frontend')"; \
	fi
	@echo ""
	@echo "7. Checking .env configuration..."
	@if [ -f $(BACKEND_DIR)/.env ]; then \
		echo "✓ Backend .env exists"; \
	else \
		echo "✗ Backend .env missing (run 'make setup')"; \
	fi
	@echo ""
	@echo "8. Checking database..."
	@if [ -f $(BACKEND_DIR)/database/database.sqlite ]; then \
		echo "✓ Database file exists"; \
	else \
		echo "✗ Database missing (run 'make migrate')"; \
	fi
	@echo ""
	@echo "=== Validation Complete ==="

.PHONY: status
status: ### Show status of all services
	@echo "=== Service Status ==="
	@echo ""
	@echo "Backend (should be at $(BACKEND_URL)):"
	@curl -s $(BACKEND_URL)/api/health 2>/dev/null && echo "✓ Running" || echo "✗ Not running"
	@echo ""
	@echo "Frontend (should be at $(FRONTEND_URL)):"
	@curl -s $(FRONTEND_URL) 2>/dev/null >/dev/null && echo "✓ Running" || echo "✗ Not running"

# =============================================================================
# Artisan Commands
# =============================================================================

.PHONY: artisan
artisan: ### Run artisan command (usage: make artisan cmd="migrate:status")
	cd $(BACKEND_DIR) && php artisan $(cmd)

.PHONY: composer
composer: ### Run composer command (usage: make composer cmd="require package")
	cd $(BACKEND_DIR) && $(COMPOSER) $(cmd)

# =============================================================================
# Git
# =============================================================================

.PHONY: git-config
git-config: ### Configure git SSH key
	git config core.sshCommand "ssh -i ~/.ssh/id_ai_rsa -F /dev/null"

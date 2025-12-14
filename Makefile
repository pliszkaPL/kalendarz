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
	@echo "Installing backend dependencies..."
	cd $(BACKEND_DIR) && composer install
	@echo ""
	@echo "Setting up backend .env..."
	@if [ ! -f $(BACKEND_DIR)/.env ]; then cp $(BACKEND_DIR)/.env.example $(BACKEND_DIR)/.env; fi
	cd $(BACKEND_DIR) && php artisan key:generate --force
	@echo ""
	@echo "Running migrations..."
	@touch $(BACKEND_DIR)/database/database.sqlite
	cd $(BACKEND_DIR) && php artisan migrate --force
	@echo ""
	@echo "Installing frontend dependencies..."
	cd $(FRONTEND_DIR) && npm install
	@echo ""
	@echo "Setup complete!"
	@echo "Run 'make dev' to start development servers"

.PHONY: install-backend
install-backend: ### Install backend dependencies
	cd $(BACKEND_DIR) && composer install

.PHONY: install-frontend npm-install
install-frontend npm-install: ### Install frontend dependencies
	cd $(FRONTEND_DIR) && npm install

.PHONY: install-e2e setup-e2e
install-e2e setup-e2e: ### Install E2E test dependencies
	cd $(E2E_DIR) && npm install
	cd $(E2E_DIR) && npx playwright install chromium

.PHONY: install-all
install-all: ### Install all dependencies (backend + frontend + e2e)
	cd $(BACKEND_DIR) && composer install
	cd $(FRONTEND_DIR) && npm install
	cd $(E2E_DIR) && npm install

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
tests test: ### Run all tests (backend + e2e)
	@echo "Running backend tests..."
	cd $(BACKEND_DIR) && ./vendor/bin/pest --exclude-group=e2e || true
	@echo ""
	@echo "Running E2E tests..."
	cd $(E2E_DIR) && npm test

.PHONY: tests-backend test-backend
tests-backend test-backend: ### Run backend tests (PEST)
	cd $(BACKEND_DIR) && ./vendor/bin/pest --exclude-group=e2e

.PHONY: tests-e2e test-e2e
tests-e2e test-e2e: ### Run E2E tests (Playwright)
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
# Artisan Commands
# =============================================================================

.PHONY: artisan
artisan: ### Run artisan command (usage: make artisan cmd="migrate:status")
	cd $(BACKEND_DIR) && php artisan $(cmd)

# =============================================================================
# Git
# =============================================================================

.PHONY: git-config
git-config: ### Configure git SSH key
	git config core.sshCommand "ssh -i ~/.ssh/id_ai_rsa -F /dev/null"

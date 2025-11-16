# Makefile

# Domyślny docker-compose
DC=sudo docker compose -f docker-compose.yml

# Build docker images
build:
	$(DC) build --no-cache

# Start all containers
up:
	$(DC) up -d

# Stop and remove containers
down:
	$(DC) down

# Run Laravel migrations in backend container
migrate:
	$(DC) exec backend php artisan migrate --force

# Optional: clear Laravel cache (config, routes, views)
cache-clear:
	$(DC) exec backend php artisan config:clear
	$(DC) exec backend php artisan cache:clear
	$(DC) exec backend php artisan route:clear
	$(DC) exec backend php artisan view:clear

# Combined: up + migrate
up-migrate: up migrate

git-config:
	git config core.sshCommand "ssh -i ~/.ssh/id_ai_rsa -F /dev/null"

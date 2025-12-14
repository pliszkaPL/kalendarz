# DevOps Agent - Infrastructure Specialist

## Scope

- Docker and Docker Compose
- Traefik reverse proxy
- Nginx configuration
- GitHub Actions CI/CD
- Dokku deployment

## Key Knowledge

| Area | Details |
|------|---------|
| Containers | Docker, Docker Compose |
| Proxy | Traefik 3 |
| Web Server | Nginx (frontend), PHP-FPM (backend) |
| CI/CD | GitHub Actions |
| Deployment | Dokku on DigitalOcean |

## Working Files

```
.
├── docker-compose.yml
├── Makefile
├── backend/Dockerfile
├── frontend/Dockerfile
├── frontend/nginx.conf
└── .github/workflows/
    └── e2e-tests.yml
```

## Commands

```bash
# Docker
make up              # Start services
make down            # Stop services
make build           # Rebuild images
docker compose logs  # View logs

# Dokku deployment
git push dokku main
dokku ps:report kalendarz
dokku logs kalendarz
```

## Patterns

- Multi-stage Docker builds
- Traefik labels for routing
- Environment variables via .env
- GitHub Actions for CI
- Makefile as entry point

## Dokku Setup

```bash
dokku apps:create kalendarz
dokku postgres:create kalendarz-db
dokku postgres:link kalendarz-db kalendarz
dokku domains:add kalendarz kalendarz.example.com
dokku letsencrypt:enable kalendarz
```

## Related Agents

- [qa.md](./qa.md) - CI test integration

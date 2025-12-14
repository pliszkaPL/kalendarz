# ADR-003: Dokku as Production Platform

## Status
Accepted

## Context
Need simple, cost-effective deployment platform for MVP.

## Options

| Option | Pros | Cons |
|--------|------|------|
| Dokku | PaaS on own VPS, git push deploy | Self-managed |
| Heroku | Managed PaaS | Expensive for hobby |
| AWS ECS | Scalable | Complex, overkill |
| Raw Docker | Full control | More maintenance |

## Decision
**Dokku** on DigitalOcean VPS.

## Rationale
- Heroku-like experience, own infrastructure
- Git push deployment
- Built-in Let's Encrypt SSL
- PostgreSQL plugin available
- Cost-effective ($5-10/month VPS)
- Docker-based (matches dev environment)

## Consequences
- Self-manage VPS updates
- Manual scaling if needed
- Need to learn Dokku commands

## Setup Commands
```bash
dokku apps:create kalendarz
dokku domains:add kalendarz kalendarz.example.com
dokku postgres:create kalendarz-db
dokku postgres:link kalendarz-db kalendarz
dokku letsencrypt:enable kalendarz
git push dokku main
```

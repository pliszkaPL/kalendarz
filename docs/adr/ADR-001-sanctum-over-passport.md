# ADR-001: Laravel Sanctum over Passport

## Status
Accepted

## Context
Need authentication system for SPA (Vue.js) communicating with Laravel API.

## Options

| Option | Pros | Cons |
|--------|------|------|
| Sanctum | Lightweight, simple, ideal for SPA | No OAuth |
| Passport | Full OAuth2 | Overkill for MVP |
| JWT (tymon) | Popular | Extra dependency, unofficial |

## Decision
**Laravel Sanctum** - official, lightweight token system for SPA.

## Rationale
- Officially supported by Laravel
- Simpler configuration
- Sufficient for MVP (no OAuth needed)
- Easy migration to Passport if needed

## Consequences
- Token-based auth (not sessions)
- CORS configuration required
- Frontend stores token in localStorage/memory

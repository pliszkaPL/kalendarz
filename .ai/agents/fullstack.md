# Fullstack Agent - Integration Specialist

## Scope

- Frontend-backend integration
- API contract design
- CORS configuration
- Authentication flow
- Error handling across stack

## Key Knowledge

| Area | Details |
|------|---------|
| API | REST, JSON |
| Auth | Sanctum SPA tokens |
| CORS | Laravel cors.php |
| HTTP | Axios (frontend), Guzzle (backend) |

## API Contracts

### Authentication
```
POST /api/register → { token, user }
POST /api/login → { token, user }
POST /api/logout → { message }
GET /api/user → { user }
```

### Templates (planned)
```
GET /api/templates → [ templates ]
POST /api/templates → { template }
GET /api/templates/{id} → { template }
PUT /api/templates/{id} → { template }
POST /api/templates/{id}/archive → { template }
DELETE /api/templates/{id} → 204
```

### Events (planned)
```
GET /api/events → [ events ]
POST /api/events → { event }
GET /api/events/{id} → { event }
PUT /api/events/{id} → { event }
DELETE /api/events/{id} → 204
GET /api/events/search?q= → [ events ]
GET /api/calendar/{year}/{month} → [ events ]
```

## Working Files

```
backend/
├── routes/api.php
├── config/cors.php
└── config/sanctum.php

frontend/
└── src/services/
    ├── auth.js
    ├── api.js (base)
    ├── events.js (planned)
    └── templates.js (planned)
```

## Integration Patterns

- Axios interceptors for auth token
- API error to user message mapping
- Loading states during requests
- Optimistic updates where safe
- Token refresh strategy

## Related Agents

- [backend.md](./backend.md) - API implementation
- [frontend.md](./frontend.md) - Service layer

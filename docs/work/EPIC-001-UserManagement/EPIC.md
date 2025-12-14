# EPIC-001: User Management

## Metadata

| Field | Value |
|-------|-------|
| ID | EPIC-001 |
| Bounded Context | UserManagement |
| Status | in-progress |
| Owner | Full Stack Team |

## Business Goal

Enable users to register, login, and manage their accounts. Foundation for all personalized features.

## User Stories

| ID | Title | Status |
|----|-------|--------|
| [STORY-001](./STORY-001-Registration/STORY.md) | User Registration | implemented |
| [STORY-002](./STORY-002-Login/STORY.md) | User Login | implemented |
| STORY-003 | View Profile | pending |
| STORY-004 | Edit Profile | pending |
| STORY-005 | Change Password | pending |
| STORY-006 | Password Recovery | pending |

## Technical Requirements

| Layer | Components |
|-------|------------|
| Backend | AuthController, User model, Sanctum |
| Frontend | Login.vue, Dashboard.vue, auth.js |
| Database | users, personal_access_tokens |

## Success Metrics

- [x] Registration endpoint works
- [x] Login endpoint returns token
- [x] Logout invalidates token
- [x] E2E tests pass (registration, auth)
- [ ] Profile CRUD complete
- [ ] Password recovery works

## Dependencies

- Laravel Sanctum configured
- CORS configured
- Traefik routing working

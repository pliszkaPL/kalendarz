# STORY-002: User Login

## Metadata

| Field | Value |
|-------|-------|
| ID | STORY-002 |
| Epic | [EPIC-001](../EPIC.md) |
| Status | implemented |

## User Story

**As** a registered user
**I want** to login to my account
**So that** I can access my calendar data

## Acceptance Criteria

- [x] Login form with email, password
- [x] Successful login returns auth token
- [x] Invalid credentials show error message
- [x] User redirected to dashboard after login
- [x] Logout clears token and redirects to login

## Technical Tasks

| ID | Description | Status |
|----|-------------|--------|
| TASK-201 | Backend: POST /api/login endpoint | implemented |
| TASK-202 | Backend: POST /api/logout endpoint | implemented |
| TASK-203 | Backend: GET /api/user endpoint | implemented |
| TASK-204 | Frontend: Login form component | implemented |
| TASK-205 | Frontend: Auth state management | implemented |
| TASK-206 | E2E: Authentication tests | implemented |

## API Contract

```
POST /api/login
Request:
{
  "email": "string",
  "password": "string"
}

Response (200):
{
  "token": "string",
  "user": { "id", "name", "email" }
}

Response (401):
{
  "message": "Invalid credentials"
}

---

POST /api/logout (requires auth)
Response (200):
{
  "message": "Logged out"
}

---

GET /api/user (requires auth)
Response (200):
{
  "id": 1,
  "name": "string",
  "email": "string"
}
```

## Files Modified

- `backend/app/Http/Controllers/Api/AuthController.php`
- `backend/routes/api.php`
- `frontend/src/views/Login.vue`
- `frontend/src/views/Dashboard.vue`
- `frontend/src/services/auth.js`
- `e2e-tests/tests/authentication.spec.js`

# STORY-001: User Registration

## Metadata

| Field | Value |
|-------|-------|
| ID | STORY-001 |
| Epic | [EPIC-001](../EPIC.md) |
| Status | implemented |

## User Story

**As** a new user
**I want** to create an account
**So that** I can use the calendar application

## Acceptance Criteria

- [x] Registration form with name, email, password, password_confirmation
- [x] Email validation (format, uniqueness)
- [x] Password validation (min 8 chars)
- [x] Successful registration returns auth token
- [x] User redirected to dashboard after registration
- [x] Error messages displayed for validation failures

## Technical Tasks

| ID | Description | Status |
|----|-------------|--------|
| TASK-101 | Backend: POST /api/register endpoint | implemented |
| TASK-102 | Backend: RegisterRequest validation | implemented |
| TASK-103 | Frontend: Registration form component | implemented |
| TASK-104 | E2E: Registration tests | implemented |

## API Contract

```
POST /api/register
Request:
{
  "name": "string",
  "email": "string",
  "password": "string",
  "password_confirmation": "string"
}

Response (201):
{
  "token": "string",
  "user": { "id", "name", "email" }
}

Response (422):
{
  "message": "Validation failed",
  "errors": { ... }
}
```

## Files Modified

- `backend/app/Http/Controllers/Api/AuthController.php`
- `backend/routes/api.php`
- `frontend/src/views/Login.vue`
- `frontend/src/services/auth.js`
- `e2e-tests/tests/registration.spec.js`

# kalendarz

A full-stack calendar application with authentication.

## Architecture

This project consists of:

- **Frontend**: Vue.js 3 + Tailwind CSS (in `frontend/` directory)
- **Backend**: Laravel 12 REST API with SQLite database (in `backend/` directory)
- **Reverse Proxy**: Traefik for routing (configured in `docker-compose.yml`)
- **E2E Tests**: Playwright tests with PEST 4.x wrapper (in `e2e-tests/` directory)

## Features

- User registration and authentication
- JWT token-based API authentication using Laravel Sanctum
- Login panel with tabbed interface (Login/Register)
- Dashboard showing username when logged in
- E2E tests for registration and authentication flows

## Routing

- `http://kalendarz.loc` → Vue.js frontend
- `http://kalendarz.loc/api` → Laravel API backend

## Local Development

### Prerequisites

- Docker and Docker Compose
- Node.js 20+ (for running tests locally)

### Setup

1. Add to your `/etc/hosts` file:
   ```
   127.0.0.1 kalendarz.loc
   ```

2. Start the application:
   ```bash
   docker compose up -d --build
   ```

3. The application will be available at:
   - Frontend: http://kalendarz.loc
   - API: http://kalendarz.loc/api
   - Traefik Dashboard: http://localhost:8080

### Running Tests

#### E2E Tests with Playwright

```bash
cd e2e-tests
npm install
npx playwright install chromium
npm test
```

#### E2E Tests via PEST (requires services running)

```bash
cd backend
./vendor/bin/pest --group=e2e
```

## CI/CD

The GitHub Actions workflow (`.github/workflows/e2e-tests.yml`) automatically runs E2E tests on commits to the master branch. It:

1. Sets up Docker services
2. Installs dependencies
3. Runs Playwright E2E tests
4. Uploads test results as artifacts

## Project Structure

```
.
├── backend/              # Laravel 12 API
│   ├── app/
│   │   └── Http/Controllers/Api/
│   │       └── AuthController.php
│   ├── routes/api.php
│   └── tests/
├── frontend/             # Vue.js 3 frontend
│   ├── src/
│   │   ├── views/       # Login and Dashboard pages
│   │   └── services/    # API service layer
│   └── Dockerfile
├── e2e-tests/           # Playwright E2E tests
│   ├── tests/
│   │   ├── registration.spec.js
│   │   └── authentication.spec.js
│   └── playwright.config.js
├── docker-compose.yml   # Traefik + Services configuration
└── .github/workflows/   # CI/CD configuration
```

## API Endpoints

- `POST /api/register` - Register a new user
- `POST /api/login` - Login user
- `POST /api/logout` - Logout user (requires auth)
- `GET /api/user` - Get authenticated user (requires auth)

## Technologies

- **Frontend**: Vue 3, Vue Router, Tailwind CSS, Axios, Vite
- **Backend**: Laravel 12, Laravel Sanctum, SQLite
- **Infrastructure**: Docker, Traefik, Nginx
- **Testing**: PEST 4.x, Playwright
- **CI/CD**: GitHub Actions